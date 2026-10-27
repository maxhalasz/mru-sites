#!/usr/bin/env node
// Publishes the package defaults for library documents that no login holds yet: the same thing the panel does
// with "Entregar como o pacote indica", for use from this computer. It reads the private files (log-keys.json,
// doc-keys.json, firebase.json, the logins) and never prints a password.
//   node tools/portal-docs/apply-defaults.mjs [--dry]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { webcrypto as crypto, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const dry = process.argv.includes('--dry');
const resetDateOnly = process.argv.includes('--reset-date-only');
const TOP = 999999;
const ROUNDS = 600000;
const enc = new TextEncoder();
const b64 = (buf) => Buffer.from(buf).toString('base64');
const unb64 = (s) => new Uint8Array(Buffer.from(s, 'base64'));
const inv = (n) => ('000000' + (TOP - n)).slice(-6);
const seqOf = (id) => TOP - parseInt(id.slice(id.lastIndexOf('-') + 1), 10);
const clone = (o) => JSON.parse(JSON.stringify(o));
const hashOf = (user) => createHash('sha256').update('ns-partner:' + user).digest('hex').slice(0, 32);

const tmp = path.join(os.tmpdir(), 'ns-portal-config-' + process.pid + '.json');
execFileSync('node', [root + 'packages/portal/build.mjs', '--print-config', tmp], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
const cfg = JSON.parse(fs.readFileSync(tmp, 'utf8'));
fs.rmSync(tmp);

const base = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.projectId)}/databases/(default)/documents`;
const key = `key=${encodeURIComponent(cfg.apiKey)}`;
const docRef = (id) => `projects/${cfg.projectId}/databases/(default)/documents/submissions/${id}`;

async function rangeQuery(prefix, limit) {
  const f = (op, id) => ({ fieldFilter: { field: { fieldPath: '__name__' }, op, value: { referenceValue: docRef(id) } } });
  const res = await fetch(`${base}:runQuery?${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ structuredQuery: {
    from: [{ collectionId: 'submissions' }], where: { compositeFilter: { op: 'AND', filters: [f('GREATER_THAN_OR_EQUAL', prefix + '-'), f('LESS_THAN', prefix + '.')] } },
    orderBy: [{ field: { fieldPath: '__name__' }, direction: 'ASCENDING' }], limit } }) });
  if (!res.ok) throw new Error('query ' + res.status);
  return res.json();
}
async function createDoc(id, fields) {
  const res = await fetch(`${base}/submissions?documentId=${encodeURIComponent(id)}&${key}`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, { stringValue: v }])) }) });
  if (res.ok) return true;
  if (res.status === 409) return false;
  throw new Error('create ' + id.slice(0, 4) + ' ' + res.status);
}

const pub = { kty: 'EC', crv: 'P-256', x: cfg.signJwk.x, y: cfg.signJwk.y };
const verifyKey = await crypto.subtle.importKey('jwk', pub, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
const signKey = await crypto.subtle.importKey('jwk', cfg.signJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
const dirKey = await crypto.subtle.importKey('raw', unb64(cfg.dirKey), 'AES-GCM', false, ['encrypt', 'decrypt']);

async function loadCtl() {
  const rows = await rangeQuery('ctl', 10);
  let best = null, maxId = 0;
  for (const r of rows) {
    if (!r.document) continue;
    maxId = Math.max(maxId, seqOf(r.document.name.split('/').pop()));
    const f = r.document.fields || {};
    const payload = f.c && f.c.stringValue, sig = f.k && f.k.stringValue;
    if (!payload || !sig) continue;
    if (!(await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, verifyKey, unb64(sig), enc.encode(payload)))) continue;
    const o = JSON.parse(payload);
    if (o && typeof o.seq === 'number' && (!best || o.seq > best.seq)) best = o;
  }
  return { ctl: best || { v: 1, seq: 0 }, maxId };
}
async function loadDir() {
  const rows = await rangeQuery('dir', 10);
  for (const r of rows) {
    if (!r.document) continue;
    const f = r.document.fields || {};
    try {
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(f.iv.stringValue) }, dirKey, unb64(f.c.stringValue));
      const o = JSON.parse(new TextDecoder().decode(plain));
      if (o && Array.isArray(o.logins)) return { seq: seqOf(r.document.name.split('/').pop()), logins: o.logins };
    } catch (e) { /* next */ }
  }
  return null;
}

const lib = Object.fromEntries(cfg.library.map((d) => [d.id, d]));
const sigOf = (L) => JSON.stringify([L.user, L.pass, L.name, L.role, L.welcome, L.folders, (L.docs || []).slice().sort()]);

async function putKeyring(L) {
  const ring = { v: 1, name: L.name, role: L.role, welcome: L.welcome || '', folders: L.folders || [],
    docs: (L.docs || []).filter((id) => lib[id]).map((id) => { const d = lib[id];
      return { id: d.id, folder: d.folder || '', title: d.title, number: d.number, date: d.date, classification: d.classification, description: d.description || '', lib: d.id, key: d.key }; }) };
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(L.user + '\n' + L.pass), 'PBKDF2', false, ['deriveKey']);
  const k = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ROUNDS, hash: 'SHA-256' }, baseKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
  const ct = b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, enc.encode(JSON.stringify(ring))));
  if (ct.length > 39000) throw new Error('keyring too large for ' + L.user);
  for (let tries = 0; tries < 6; tries++, L.ver++) {
    if (await createDoc('acc-' + L.hash + '-' + inv(L.ver), { t: new Date().toISOString(), k: b64(salt), iv: b64(iv), c: ct })) return ring.docs.length;
  }
  throw new Error('could not publish keyring of ' + L.user);
}
async function putDir(logins, seq0) {
  let seq = seq0 + 1;
  for (let tries = 0; tries < 6; tries++, seq++) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const body = { v: 1, seq, t: new Date().toISOString(), logins: logins.map((L) => ({ key: L.key, user: L.user, pass: L.pass, name: L.name, role: L.role, welcome: L.welcome || '',
      folders: L.folders || [], docs: L.docs || [], ver: L.ver || 0, sig: L.sig || '' })) };
    const ct = b64(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, dirKey, enc.encode(JSON.stringify(body))));
    if (ct.length > 39000) throw new Error('directory too large');
    if (await createDoc('dir-' + inv(seq), { t: body.t, k: 'dir1', iv: b64(iv), c: ct })) return seq;
  }
  throw new Error('could not publish the directory');
}
async function publish(mutate) {
  const { ctl, maxId } = await loadCtl();
  const next = clone(ctl);
  let seq = Math.max(ctl.seq || 0, maxId || 0) + 1;
  for (let tries = 0; tries < 6; tries++, seq++) {
    next.v = 1; next.seq = seq; next.t = new Date().toISOString();
    mutate(next);
    const payload = JSON.stringify(next);
    const sig = b64(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, signKey, enc.encode(payload)));
    if (await createDoc('ctl-' + inv(seq), { t: next.t, k: sig, iv: 'ctl1', c: payload })) return seq;
  }
  throw new Error('could not publish the settings notice');
}

// ---- run -----------------------------------------------------------------------------------------
if (resetDateOnly) {
  const cur = (await loadCtl()).ctl;
  console.log('shared date in the settings:', cur.today || '(default)');
  if (cur.today) console.log('settings notice #' + (await publish((n) => { delete n.today; })) + ': date back to the default');
  process.exit(0);
}
let dir = await loadDir();
if (!dir) {
  console.log('no directory published yet: starting from the package logins');
  dir = { seq: 0, logins: [] };
  for (const a of cfg.accounts) {
    dir.logins.push({ key: 'l' + hashOf(a.user).slice(0, 10), user: a.user, pass: a.pass, name: a.name, role: a.role, welcome: a.welcome || '', folders: a.folders || [], docs: [], ver: 0, sig: '' });
  }
}
const held = new Set();
dir.logins.forEach((L) => (L.docs || []).forEach((id) => held.add(id)));
const next = clone(dir.logins);
let given = 0;
for (const L of next) {
  const a = cfg.accounts.find((x) => x.user === L.user);
  if (!a) continue;
  L.docs = L.docs || [];
  for (const id of a.docs) if (!held.has(id) && lib[id] && !L.docs.includes(id)) { L.docs.push(id); given++; }
  L.folders = L.folders || [];
  for (const fo of a.folders || []) if (!L.folders.some((x) => x.name === fo.name)) L.folders.push(fo);
}
console.log(`documents in the library: ${Object.keys(lib).length}, not held by anybody: ${Object.keys(lib).filter((id) => !held.has(id)).length}, deliveries: ${given}`);
async function apply() {
let changed = 0;
for (const L of next) {
  L.user = L.user.trim().toLowerCase();
  L.hash = hashOf(L.user);
  const o = dir.logins.find((x) => x.key === L.key);
  const sig = sigOf(L);
  if (!o || !o.ver || o.sig !== sig) {
    L.ver = ((o && o.ver) || L.ver || 0) + 1;
    const n = await putKeyring(L);
    L.sig = sig;
    changed++;
    console.log(`keyring ${L.user}: version ${L.ver}, ${n} documents`);
  } else { L.ver = o.ver; L.sig = o.sig; }
}
const seq = await putDir(next, dir.seq);
const noticeSeq = await publish((n) => {
  n.dir = n.dir || {};
  next.forEach((L) => { n.dir[L.hash] = L.ver; });
  // leftovers of earlier tests
  Object.values(n.banner || {}).forEach((b) => { if (b && /^TEST NOTICE/.test(b.text || '')) { b.text = ''; b.on = false; } });
});
console.log(`directory #${seq}, settings notice #${noticeSeq}, ${changed} keyrings published`);
}
if (!dry) await apply();
