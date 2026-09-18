// SPDX-License-Identifier: Apache-2.0
'use strict';
const assert = require('assert');
const fs = require('fs');
const { elapsed, body } = require('./format');

assert.strictEqual(elapsed(900), '1s');
assert.strictEqual(elapsed(45000), '45s');
assert.strictEqual(elapsed(95000), '1m 35s');
assert.strictEqual(elapsed(120000), '2m');
assert.strictEqual(elapsed(3600000), '1h');
assert.strictEqual(elapsed(5400000), '1h 30m');

assert.strictEqual(body('  npm   run build  ', 95000), 'npm run build · 1m 35s');
assert.ok(body('x'.repeat(100), 1000).startsWith('x'.repeat(59) + '…'));

// Every translated string must exist in every translation, or a Korean window falls back to English.
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const pkg = fs.readFileSync('package.json', 'utf8');
const nls = read('package.nls.json');
const nlsKo = read('package.nls.ko.json');
for (const [, key] of pkg.matchAll(/"%([^%]+)%"/g)) {
  assert.ok(key in nls, `package.nls.json 에 ${key} 없음`);
  assert.ok(key in nlsKo, `package.nls.ko.json 에 ${key} 없음`);
}
assert.deepStrictEqual(Object.keys(nls).sort(), Object.keys(nlsKo).sort());

const ko = read('l10n/bundle.l10n.ko.json');
const code = fs.readFileSync('extension.js', 'utf8');
const used = [...code.matchAll(/l10n\.t\('((?:[^'\\]|\\.)*)'/g)].map((m) => m[1]);
assert.ok(used.length, 'extension.js 에서 l10n.t 를 찾지 못함');
for (const s of used) assert.ok(s in ko, `bundle.l10n.ko.json 에 ${s} 없음`);
assert.deepStrictEqual(Object.keys(ko).sort(), [...new Set(used)].sort());

console.log('ok');
