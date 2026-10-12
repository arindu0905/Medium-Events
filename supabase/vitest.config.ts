import { defineConfig } from 'vitest/config';

// Database tests run against the hosted dev project (no Docker); see supabase/tests/helpers.ts
export default defineConfig({
  test: {
    root: '.',
    include: ['supabase/tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 30_000,
    fileParallelism: false,
  },
});
