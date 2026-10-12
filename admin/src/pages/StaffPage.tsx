import React, { useCallback, useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { inviteStaff, listStaff, updateStaff } from '../lib/staff';
import { validateInvite } from '../../../supabase/functions/invite-staff/validate.ts';
import { ROLE_LABELS, type Profile, type StaffRole } from '../lib/types';

const ROLES = Object.keys(ROLE_LABELS) as StaffRole[];
const FIELD =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand disabled:bg-surface disabled:text-muted';
const PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 cursor-pointer';
const SECONDARY =
  'inline-flex items-center justify-center rounded-md border border-line bg-white px-3 py-1.5 text-sm font-semibold text-ink hover:border-brand focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
const SELF_TITLE = "You can't change your own access";

export default function StaffPage() {
  const { profile: me } = useAuth();
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);
  const [confirming, setConfirming] = useState<Profile | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setStaff(await listStaff());
      setLoadError(null);
    } catch (e) {
      setLoadError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (person: Profile, patch: { role?: StaffRole; active?: boolean }) => {
    setMessage(null);
    const result = await updateStaff(person.id, patch);
    if (result.ok) {
      setMessage({ kind: 'success', text: `Saved changes for ${person.full_name}.` });
      await load();
    } else {
      setMessage({ kind: 'error', text: result.error });
    }
  };

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">Staff</h1>
          <p className="mt-1 text-body">Invite people, set their role and switch off access when they leave.</p>
        </div>
        <button type="button" onClick={() => setInviteOpen(true)} className={PRIMARY}>
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Invite staff
        </button>
      </div>

      {inviteOpen && (
        <InviteForm
          onClose={() => setInviteOpen(false)}
          onSent={async (email) => {
            setInviteOpen(false);
            setMessage({ kind: 'success', text: `Invitation sent to ${email}.` });
            await load();
          }}
        />
      )}

      {message && (
        <p
          role={message.kind === 'error' ? 'alert' : 'status'}
          className={`mt-6 rounded-md border px-4 py-3 text-sm ${
            message.kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          {message.text}
        </p>
      )}

      {confirming && (
        <div role="alertdialog" aria-labelledby="confirm-title" className="mt-6 rounded-lg border border-line bg-white p-5">
          <p id="confirm-title" className="font-semibold text-ink">
            Deactivate {confirming.full_name}?
          </p>
          <p className="mt-1 text-sm text-body">They'll be signed out and can't sign in again until reactivated.</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className={PRIMARY}
              onClick={async () => {
                const person = confirming;
                setConfirming(null);
                await save(person, { active: false });
              }}
            >
              Yes, deactivate {confirming.full_name}
            </button>
            <button type="button" className={SECONDARY} onClick={() => setConfirming(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loadError ? (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {loadError}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface text-left text-xs font-semibold uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Role</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {staff.map((person) => {
                const isMe = person.id === me?.id;
                return (
                  <tr key={person.id}>
                    <td className="px-4 py-3 font-medium text-ink">{person.full_name}</td>
                    <td className="px-4 py-3 text-body">{person.email}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Role for ${person.full_name}`}
                        value={person.role}
                        disabled={isMe}
                        title={isMe ? SELF_TITLE : undefined}
                        onChange={(e) => save(person, { role: e.target.value as StaffRole })}
                        className={`${FIELD} max-w-[140px]`}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                          person.active ? 'bg-green-50 text-green-800' : 'bg-surface text-muted'
                        }`}
                      >
                        {person.active ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {person.active ? (
                        <button
                          type="button"
                          disabled={isMe}
                          title={isMe ? SELF_TITLE : undefined}
                          onClick={() => setConfirming(person)}
                          className={SECONDARY}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button type="button" onClick={() => save(person, { active: true })} className={SECONDARY}>
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function InviteForm({ onClose, onSent }: { onClose: () => void; onSent: (email: string) => void }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('sales');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Check instantly; the server checks the same rules again
    const checked = validateInvite({ email, full_name: fullName, role });
    if (!checked.ok) return setError(checked.error);
    setBusy(true);
    setError(null);
    const result = await inviteStaff({ email, full_name: fullName, role });
    setBusy(false);
    if (result.ok) onSent(email.trim().toLowerCase());
    else setError(result.error);
  };

  return (
    <form onSubmit={submit} noValidate aria-label="Invite staff" className="mt-6 rounded-lg border border-line bg-white p-5 grid gap-4 sm:grid-cols-3">
      <div>
        <label htmlFor="invite-name" className="block text-sm font-semibold text-ink mb-1.5">Full name</label>
        <input id="invite-name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={FIELD} />
      </div>
      <div>
        <label htmlFor="invite-email" className="block text-sm font-semibold text-ink mb-1.5">Email</label>
        <input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
      </div>
      <div>
        <label htmlFor="invite-role" className="block text-sm font-semibold text-ink mb-1.5">Role</label>
        <select id="invite-role" value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className={FIELD}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r]}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p role="alert" className="sm:col-span-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="sm:col-span-3 flex gap-3">
        <button type="submit" disabled={busy} className={PRIMARY}>
          Send invitation
        </button>
        <button type="button" onClick={onClose} className={SECONDARY}>
          Cancel
        </button>
      </div>
    </form>
  );
}
