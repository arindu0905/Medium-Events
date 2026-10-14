-- Failed sign-ins per email, kept in the database so every server instance shares the same lockout
-- (on serverless hosts each request can land on a different instance).

create table login_lockouts (
  email text primary key,
  -- Times (ms since epoch) of recent failed attempts
  failures jsonb not null default '[]',
  locked_until timestamptz
);
