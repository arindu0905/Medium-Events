-- Piece 1: staff profiles, roles, access rules and the activity log.
-- Spec: docs/superpowers/specs/2026-10-12-admin-foundation-design.md (incl. Amendment)

create type public.staff_role as enum ('admin', 'sales', 'events', 'finance');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (length(trim(full_name)) > 0),
  email text not null unique,
  role public.staff_role not null,
  active boolean not null default true,
  -- true while the user is on a temporary password set by an admin
  must_change_password boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table public.activity_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor_id uuid,
  table_name text not null,
  record_id text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  changes jsonb not null default '{}'::jsonb
);

create index activity_log_at_idx on public.activity_log (at desc);
create index activity_log_actor_idx on public.activity_log (actor_id);

-- Role helpers. "current_role" is a reserved SQL word, hence current_staff_role.
create function public.current_staff_role() returns public.staff_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and active
$$;

create function public.is_active_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active)
$$;

create function public.has_role(variadic roles public.staff_role[]) returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_staff_role() = any (roles), false)
$$;

create function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end
$$;

-- Nobody changes their own role or active status, and there is always one active admin.
-- The advisory lock serialises admin demotions so two admins can't remove each other at once.
create function public.guard_profile_change() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  remaining integer;
begin
  if auth.uid() is not null and new.id = auth.uid()
     and (new.role is distinct from old.role or new.active is distinct from old.active) then
    raise exception 'cannot change own role or active status';
  end if;

  if old.role = 'admin' and old.active and (new.role <> 'admin' or not new.active) then
    perform pg_advisory_xact_lock(hashtext('medium_last_admin_guard'));
    select count(*) into remaining
      from public.profiles
     where role = 'admin' and active and id <> old.id;
    if remaining = 0 then
      raise exception 'last active admin';
    end if;
  end if;

  return new;
end
$$;

-- Writes one activity_log row per change. Updates record only the columns that changed;
-- an update that changes nothing writes nothing.
create function public.log_activity() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  old_row jsonb;
  new_row jsonb;
  diff jsonb := '{}'::jsonb;
  col text;
begin
  if tg_op = 'INSERT' then
    new_row := to_jsonb(new);
    insert into public.activity_log (actor_id, table_name, record_id, action, changes)
    values (auth.uid(), tg_table_name, new_row ->> 'id', 'insert', new_row);
  elsif tg_op = 'DELETE' then
    old_row := to_jsonb(old);
    insert into public.activity_log (actor_id, table_name, record_id, action, changes)
    values (auth.uid(), tg_table_name, old_row ->> 'id', 'delete', old_row);
  else
    old_row := to_jsonb(old);
    new_row := to_jsonb(new);
    for col in select jsonb_object_keys(new_row) loop
      if col <> 'updated_at' and (old_row -> col) is distinct from (new_row -> col) then
        diff := diff || jsonb_build_object(col, jsonb_build_object('old', old_row -> col, 'new', new_row -> col));
      end if;
    end loop;
    if diff <> '{}'::jsonb then
      insert into public.activity_log (actor_id, table_name, record_id, action, changes)
      values (auth.uid(), tg_table_name, new_row ->> 'id', 'update', diff);
    end if;
  end if;
  return null;
end
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_change();
create trigger profiles_activity after insert or update or delete on public.profiles
  for each row execute function public.log_activity();

-- Lets a signed-in user clear their own "must change password" flag after choosing a password.
create function public.clear_password_flag() returns void
language sql security definer set search_path = public as $$
  update public.profiles set must_change_password = false where id = auth.uid() and active
$$;

-- Row-level security: default deny, then allow exactly what the spec says.
alter table public.profiles enable row level security;
alter table public.activity_log enable row level security;

create policy "Active staff read profiles" on public.profiles
  for select to authenticated using (public.is_active_staff());

create policy "Admins update profiles" on public.profiles
  for update to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Admins read all activity, staff their own" on public.activity_log
  for select to authenticated
  using (public.has_role('admin') or (public.is_active_staff() and actor_id = auth.uid()));

-- Table and column privileges (belt and braces on top of RLS)
revoke all on public.profiles, public.activity_log from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant update (full_name, role, active) on public.profiles to authenticated;
revoke insert, update, delete on public.activity_log from authenticated;

revoke execute on function public.current_staff_role(), public.is_active_staff(),
  public.has_role(public.staff_role[]), public.clear_password_flag() from public, anon;
grant execute on function public.current_staff_role(), public.is_active_staff(),
  public.has_role(public.staff_role[]), public.clear_password_flag() to authenticated;
