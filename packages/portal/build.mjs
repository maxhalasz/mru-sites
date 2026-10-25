#!/usr/bin/env node
// Encrypts the private portal documents into one package per account.
// Usage: node packages/portal/build.mjs <dist folder of the NeuroStat site>
//        node packages/portal/build.mjs --gm <output folder>   (local only: builds the game master package)
//        add --creds <file> to either form to read the logins from another file
//
// The game master login (private/credentials.gm) and the activity-log private key (private/log-keys.json)
// never leave this computer. Only the encrypted game master package is committed, and it is built here.
//
// Package format (file name = first 32 hex chars of sha256("ns-partner:" + username)):
//   "NSP1" | salt (16) | iv (12) | ciphertext | auth tag (16)
// Key: PBKDF2-SHA256, 600000 rounds, over "username\npassword" (username in lower case), 32 bytes.
// Cipher: AES-256-GCM. The browser decrypts with WebCrypto in public/partner/portal.js.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto';
import { join, extname, basename } from 'node:path';
import YAML from 'yaml';
import { stampSvg } from '@mru/brand';

const ROUNDS = 600000;
const MIME = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };

const args = process.argv.slice(2);
const gmMode = args.includes('--gm');
// --creds <file>: read the logins from another file (used for throwaway test accounts kept outside the repository).
const credsIdx = args.indexOf('--creds');
const credsFile = credsIdx >= 0 ? args[credsIdx + 1] : null;
const dist = args.find((a, i) => !a.startsWith('--') && (credsIdx < 0 || i !== credsIdx + 1));
if (!dist) { console.error('portal: no output folder given'); process.exit(2); }
const root = new URL('../../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const priv = join(root, 'private');

function fail(msg) { console.error('portal: ' + msg); process.exit(1); }

function readCredentials() {
  const file = credsFile || join(priv, gmMode ? 'credentials.gm' : 'credentials');
  if (!existsSync(file)) fail(`${credsFile || 'private/' + (gmMode ? 'credentials.gm' : 'credentials')} not found`);
  const out = [];
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const [user, pass, account] = line.split('\t');
    if (!user || !pass || !account) fail(`bad line in credentials: "${line.slice(0, 20)}..."`);
    out.push({ user: user.trim().toLowerCase(), pass, account: account.trim() });
  }
  return out;
}

function frontmatter(path) {
  const txt = readFileSync(path, 'utf8').replace(/^﻿/, '');
  const m = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) fail(`${path}: no front matter`);
  return YAML.parse(m[1]);
}

// The game master account also carries what the console needs to read and decrypt the activity log.
function adminConfig() {
  const keyFile = join(priv, 'log-keys.json');
  if (!existsSync(keyFile)) fail('private/log-keys.json not found (needed by the game master account)');
  const keys = JSON.parse(readFileSync(keyFile, 'utf8'));
  const fbFile = join(priv, 'firebase.json');
  const fb = existsSync(fbFile) ? JSON.parse(readFileSync(fbFile, 'utf8')) : null;
  if (!fb) console.warn('portal: private/firebase.json is missing, so the console has no data source yet');
  return { projectId: fb ? fb.projectId : '', apiKey: fb ? fb.apiKey : '', privateJwk: keys.privateJwk };
}

function loadAccount(account) {
  const dir = join(priv, 'portal', account);
  if (!existsSync(dir)) fail(`folder private/portal/${account} not found`);
  const meta = existsSync(join(dir, 'account.yml')) ? YAML.parse(readFileSync(join(dir, 'account.yml'), 'utf8')) : {};
  const docs = [];
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
    const fm = frontmatter(join(dir, name));
    if (fm.published === false) continue;
    for (const k of ['title', 'number', 'date', 'classification']) if (!fm[k]) fail(`${account}/${name}: missing "${k}"`);
    let file = null;
    if (fm.file) {
      const p = join(dir, fm.file);
      if (!existsSync(p) || !statSync(p).isFile()) fail(`${account}/${name}: file "${fm.file}" not found`);
      const ext = extname(p).toLowerCase();
      if (!MIME[ext]) fail(`${account}/${name}: unsupported file type "${ext}"`);
      file = { filename: basename(p), mime: MIME[ext], b64: readFileSync(p).toString('base64') };
    }
    const stampText = fm.stamp || String(fm.classification).toUpperCase();
    docs.push({
      id: name.replace(/\.md$/, ''),
      folder: fm.folder || '',
      title: String(fm.title),
      number: String(fm.number),
      date: fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date),
      classification: String(fm.classification),
      description: fm.description ? String(fm.description) : '',
      stamp: stampSvg({ text: stampText }),
      file,
    });
  }
  const folders = (meta.folders || []).map((f) => ({ name: String(f.name), note: f.note ? String(f.note) : '' }));
  return {
    v: 1,
    name: meta.name || account,
    role: meta.role || '',
    welcome: meta.welcome || '',
    folders,
    docs,
    admin: meta.admin ? adminConfig() : undefined,
    app: meta.admin && existsSync(join(dir, 'console.js')) ? readFileSync(join(dir, 'console.js'), 'utf8') : undefined,
  };
}

const creds = readCredentials();
const outDir = gmMode ? dist : join(dist, 'partner', 'd');
mkdirSync(outDir, { recursive: true });

for (const c of creds) {
  const bundle = loadAccount(c.account);
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(`${c.user}\n${c.pass}`, salt, ROUNDS, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(bundle), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  const name = createHash('sha256').update('ns-partner:' + c.user).digest('hex').slice(0, 32);
  writeFileSync(join(outDir, `${name}.bin`), Buffer.concat([Buffer.from('NSP1'), salt, iv, enc, tag]));
  console.log(`portal: ${c.account}: ${bundle.docs.length} documents, ${(enc.length / 1024).toFixed(0)} KB`);
}
