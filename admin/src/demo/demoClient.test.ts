import { beforeEach, describe, expect, it, vi } from 'vitest';

type Demo = typeof import('./demoClient');
let demo: Demo;
// The demo client's query builder is loosely typed; describe just what these tests use
type Query = { update(p: object): Query; eq(c: string, v: unknown): Query; select(c: string): Query; order(c: string, o: object): Query; range(a: number, b: number): Query } & PromiseLike<unknown>;
const from = (table: string) => (demo.demoClient.from as unknown as (t: string) => Query)(table);

const signIn = (email: string) => demo.demoClient.auth.signInWithPassword({ email, password: demo.DEMO_PASSWORD });
const update = (id: string, patch: object) => from('profiles').update(patch).eq('id', id) as unknown as Promise<{ error: { message: string } | null }>;
const activity = () =>
  from('activity_log').select('*').order('at', { ascending: false }).range(0, 49) as unknown as Promise<{ data: { actor_id: string | null }[]; count: number }>;

beforeEach(async () => {
  vi.resetModules();
  demo = await import('./demoClient');
});

describe('demo backend', () => {
  it('signs in with the shown demo password only', async () => {
    expect((await signIn('admin@demo.medium')).error).toBeNull();
    expect((await demo.demoClient.auth.signInWithPassword({ email: 'admin@demo.medium', password: 'nope' })).error).not.toBeNull();
  });

  it("refuses an admin's change to their own role", async () => {
    await signIn('admin@demo.medium');
    expect((await update('demo-admin', { role: 'sales' })).error?.message).toMatch(/own role/);
  });

  it('never leaves zero active admins', async () => {
    await signIn('admin@demo.medium');
    await demo.demoClient.functions.invoke('invite-staff', { body: { email: 'second@demo.medium', full_name: 'Second Admin', role: 'admin' } });
    expect((await update('demo-new-1', { active: false })).error).toBeNull();
    // demo-admin is now the only active admin; nobody can remove them (self-change is also blocked)
    expect((await update('demo-admin', { active: false })).error).not.toBeNull();
  });

  it('logs changes and skips no-op updates', async () => {
    await signIn('admin@demo.medium');
    const before = (await activity()).count;
    await update('demo-sales', { role: 'finance' });
    await update('demo-sales', { role: 'finance' });
    expect((await activity()).count).toBe(before + 1);
  });

  it('only lets admins change staff or invite', async () => {
    await signIn('sales@demo.medium');
    expect((await update('demo-events', { role: 'finance' })).error).not.toBeNull();
    const invited = await demo.demoClient.functions.invoke('invite-staff', { body: { email: 'x@demo.medium', full_name: 'X', role: 'sales' } });
    expect(invited.error).not.toBeNull();
  });

  it('shows non-admins only their own activity', async () => {
    await signIn('sales@demo.medium');
    const { data } = await activity();
    expect(data.every((row) => row.actor_id === 'demo-sales')).toBe(true);
  });

  it('stays signed in across a page reload, and signs out cleanly', async () => {
    sessionStorage.clear();
    await signIn('events@demo.medium');
    vi.resetModules();
    demo = await import('./demoClient');
    const { data } = await demo.demoClient.auth.getSession();
    expect(data.session?.user.email).toBe('events@demo.medium');
    await demo.demoClient.auth.signOut();
    vi.resetModules();
    demo = await import('./demoClient');
    expect((await demo.demoClient.auth.getSession()).data.session).toBeNull();
  });
});
