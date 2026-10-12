import { describe, expect, it } from 'vitest';
import { normalizeSiteUrl } from './config';

describe('normalizeSiteUrl', () => {
  it('defaults to https://medium.mv when unset', () => {
    expect(normalizeSiteUrl(undefined)).toBe('https://medium.mv');
    expect(normalizeSiteUrl('')).toBe('https://medium.mv');
  });

  it('strips trailing slashes', () => {
    expect(normalizeSiteUrl('https://medium.mv/')).toBe('https://medium.mv');
    expect(normalizeSiteUrl('https://staging.example.com//')).toBe('https://staging.example.com');
  });
});
