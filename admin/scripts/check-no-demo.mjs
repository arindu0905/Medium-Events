// Fails the build if demo-mode logins or the demo client leaked into the production bundle.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const FORBIDDEN = ['demo.medium', 'medium-demo', 'demoClient'];
const files = readdirSync('dist/assets')
  .map((f) => join('dist/assets', f))
  .concat('dist/index.html');

const leaks = files.flatMap((file) => {
  const text = readFileSync(file, 'utf8');
  return FORBIDDEN.filter((s) => text.includes(s)).map((s) => `${file}: ${s}`);
});

if (leaks.length) {
  console.error(`Demo mode leaked into the production build:\n  ${leaks.join('\n  ')}`);
  process.exit(1);
}
console.log('Production build contains no demo logins.');
