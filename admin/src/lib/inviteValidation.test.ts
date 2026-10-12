import { describe, expect, it } from 'vitest';
import { validateInvite } from '../../../supabase/functions/invite-staff/validate.ts';

describe('validateInvite', () => {
  it('accepts a valid invite and normalises it', () => {
    expect(validateInvite({ email: '  Aisha@Medium.MV ', full_name: '  Aisha Ali ', role: 'sales' })).toEqual({
      ok: true,
      value: { email: 'aisha@medium.mv', full_name: 'Aisha Ali', role: 'sales' },
    });
  });

  it('rejects a bad email', () => {
    expect(validateInvite({ email: 'not-an-email', full_name: 'A', role: 'sales' })).toEqual({
      ok: false,
      error: 'Enter a valid email address.',
    });
  });

  it('rejects a blank name', () => {
    expect(validateInvite({ email: 'a@b.mv', full_name: '   ', role: 'sales' })).toEqual({
      ok: false,
      error: "Enter the person's name.",
    });
  });

  it('rejects an unknown role', () => {
    expect(validateInvite({ email: 'a@b.mv', full_name: 'A', role: 'owner' })).toEqual({ ok: false, error: 'Choose a role.' });
  });

  it('rejects anything that is not an object', () => {
    expect(validateInvite(null)).toEqual({ ok: false, error: 'Invalid request.' });
    expect(validateInvite('x')).toEqual({ ok: false, error: 'Invalid request.' });
  });
});
