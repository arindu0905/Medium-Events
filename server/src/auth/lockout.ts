// Locks an email for 15 minutes after 5 failed sign-ins within 15 minutes.
// Kept in the database so the lockout holds across restarts and across serverless instances.
import type { Db } from '../db/index.js';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

export class Lockout {
  constructor(private db: Db) {}

  async isLocked(email: string, now: Date): Promise<boolean> {
    const [row] = await this.db.query<{ locked_until: Date | null }>('select locked_until from login_lockouts where email = $1', [email]);
    if (!row?.locked_until) return false;
    if (now.getTime() >= new Date(row.locked_until).getTime()) {
      await this.reset(email);
      return false;
    }
    return true;
  }

  async recordFailure(email: string, now: Date) {
    await this.db.transaction(async (tx) => {
      const [row] = await tx.query<{ failures: number[] }>('select failures from login_lockouts where email = $1 for update', [email]);
      const recent = (row?.failures ?? []).filter((t) => now.getTime() - t < WINDOW_MS);
      recent.push(now.getTime());
      const lockedUntil = recent.length >= MAX_FAILURES ? new Date(now.getTime() + WINDOW_MS) : null;
      await tx.query(
        `insert into login_lockouts (email, failures, locked_until) values ($1, $2, $3)
         on conflict (email) do update set failures = excluded.failures, locked_until = excluded.locked_until`,
        [email, JSON.stringify(recent), lockedUntil],
      );
    });
  }

  async reset(email: string) {
    await this.db.query('delete from login_lockouts where email = $1', [email]);
  }
}
