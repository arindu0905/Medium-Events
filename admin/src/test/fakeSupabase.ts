// In-memory stand-in for the Supabase client, used by component tests.
// Records every query-builder call so tests can assert on the query that was built.
import type { Profile } from '../lib/types';

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT';
type Session = { user: { id: string; email: string } } | null;
export type QueryCall = { method: string; args: unknown[] };
type Result = { data: unknown; error: { message: string; code?: string } | null; count?: number | null };
type TableHandler = (calls: QueryCall[]) => Result;

export function createFakeSupabase(init: { profiles?: Profile[]; password?: string; session?: Session } = {}) {
  const state = {
    // Copy each profile so a test that edits state can't leak into the next test
    profiles: (init.profiles ?? []).map((p) => ({ ...p })),
    password: init.password ?? 'correct-password',
    session: init.session ?? null,
    handlers: {} as Record<string, TableHandler>,
    queries: [] as { table: string; calls: QueryCall[] }[],
    invoked: [] as { name: string; body: unknown }[],
    rpcCalls: [] as { name: string; args: unknown }[],
    invokeResult: { data: { ok: true }, error: null } as { data: unknown; error: unknown },
  };
  const listeners = new Set<(event: AuthEvent, session: Session) => void>();
  const emit = (event: AuthEvent) => listeners.forEach((cb) => cb(event, state.session));

  // Default profiles handler: select ... eq('id', x) ... maybeSingle()
  state.handlers.profiles = (calls) => {
    const idFilter = calls.find((c) => c.method === 'eq' && c.args[0] === 'id');
    const single = calls.some((c) => c.method === 'maybeSingle' || c.method === 'single');
    // Fresh copies, like a real network response
    const rows = (idFilter ? state.profiles.filter((p) => p.id === idFilter.args[1]) : state.profiles).map((p) => ({ ...p }));
    return { data: single ? (rows[0] ?? null) : rows, error: null };
  };

  const from = (table: string) => {
    const calls: QueryCall[] = [];
    state.queries.push({ table, calls });
    const builder: Record<string, unknown> = {};
    for (const method of ['select', 'eq', 'neq', 'gte', 'lte', 'order', 'range', 'update', 'insert', 'maybeSingle', 'single', 'in']) {
      builder[method] = (...args: unknown[]) => {
        calls.push({ method, args });
        return builder;
      };
    }
    builder.then = (resolve: (r: Result) => unknown, reject: (e: unknown) => unknown) => {
      try {
        const handler = state.handlers[table];
        return Promise.resolve(handler ? handler(calls) : { data: [], error: null }).then(resolve, reject);
      } catch (e) {
        return Promise.reject(e).then(resolve, reject);
      }
    };
    return builder;
  };

  const client = {
    auth: {
      getSession: async () => ({ data: { session: state.session }, error: null }),
      onAuthStateChange: (cb: (event: AuthEvent, session: Session) => void) => {
        listeners.add(cb);
        return { data: { subscription: { unsubscribe: () => listeners.delete(cb) } } };
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const profile = state.profiles.find((p) => p.email === email);
        if (!profile || password !== state.password) {
          return { data: { session: null }, error: { message: 'Invalid login credentials' } };
        }
        state.session = { user: { id: profile.id, email } };
        emit('SIGNED_IN');
        return { data: { session: state.session }, error: null };
      },
      signOut: async () => {
        state.session = null;
        emit('SIGNED_OUT');
        return { error: null };
      },
      updateUser: async () => ({ data: {}, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
    },
    from,
    // Only the RPCs the app uses: clearing your own "must change password" flag
    rpc: async (name: string, args?: unknown) => {
      state.rpcCalls.push({ name, args });
      const me = state.profiles.find((p) => p.id === state.session?.user.id);
      if (name === 'clear_password_flag' && me) me.must_change_password = false;
      return { data: null, error: null };
    },
    functions: {
      invoke: async (name: string, options: { body: unknown }) => {
        state.invoked.push({ name, body: options.body });
        return state.invokeResult;
      },
    },
  };

  return { client, state, emit };
}

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'u-admin',
    full_name: 'Aisha Admin',
    email: 'admin@medium.test',
    role: 'admin',
    active: true,
    must_change_password: false,
    created_at: '2026-10-01T09:00:00Z',
    updated_at: null,
    ...overrides,
  };
}
