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
// --props <file>: the prop logins listed in the game master package (used to test with a throwaway login).
const propsIdx = args.indexOf('--props');
const propsFile = propsIdx >= 0 ? args[propsIdx + 1] : null;
const dist = args.find((a, i) => !a.startsWith('--') && (credsIdx < 0 || i !== credsIdx + 1) && (propsIdx < 0 || i !== propsIdx + 1));
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

// Every portal document is encrypted once with its own key and stored as a static file. A login only
// needs the keys of the documents it may open, so which documents a login has can change later without
// rebuilding anything: the panel writes a small encrypted "keyring" per login. The keys live in
// private/doc-keys.json (never committed) and in the game master package.
//   document file: "NSD1" | iv (12) | ciphertext | auth tag (16), AES-256-GCM, JSON inside
function buildLibrary(accountNames) {
  const keyFile = join(priv, 'doc-keys.json');
  const store = existsSync(keyFile) ? JSON.parse(readFileSync(keyFile, 'utf8')) : { dirKey: '', docs: {} };
  if (!store.dirKey) store.dirKey = randomBytes(32).toString('base64');
  if (!store.docs) store.docs = {};
  const libDir = join(root, 'apps', 'neurostat', 'public', 'partner', 'lib');
  mkdirSync(libDir, { recursive: true });
  const library = [];
  const seen = new Set();
  for (const account of accountNames) {
    const b = loadAccount(account, true);
    for (const d of b.docs) {
      const id = account + '--' + d.id;
      if (seen.has(id)) continue;
      seen.add(id);
      const entry = store.docs[id] || (store.docs[id] = { key: randomBytes(32).toString('base64'), sha: '' });
      const plain = JSON.stringify({ mime: d.file ? d.file.mime : '', filename: d.file ? d.file.filename : '', b64: d.file ? d.file.b64 : '', stamp: d.stamp });
      const sha = createHash('sha256').update(plain).digest('hex');
      const path = join(libDir, id + '.enc');
      if (entry.sha !== sha || !existsSync(path)) {
        const iv = randomBytes(12);
        const cipher = createCipheriv('aes-256-gcm', Buffer.from(entry.key, 'base64'), iv);
        const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
        writeFileSync(path, Buffer.concat([Buffer.from('NSD1'), iv, enc, cipher.getAuthTag()]));
        entry.sha = sha;
      }
      library.push({ id, account, title: d.title, number: d.number, date: d.date, folder: d.folder, classification: d.classification,
        description: d.description, hasFile: !!d.file, key: entry.key });
    }
  }
  writeFileSync(keyFile, JSON.stringify(store, null, 2) + '\n');
  return { library, dirKey: store.dirKey };
}

// The game master account also carries what the panel needs: the key that reads the activity log, the
// key that signs site settings, every prop login with the documents it has, the document library
// (with keys), the open positions and the sites.
function adminConfig() {
  const keyFile = join(priv, 'log-keys.json');
  if (!existsSync(keyFile)) fail('private/log-keys.json not found (needed by the game master account)');
  const keys = JSON.parse(readFileSync(keyFile, 'utf8'));
  const fbFile = join(priv, 'firebase.json');
  const fb = existsSync(fbFile) ? JSON.parse(readFileSync(fbFile, 'utf8')) : null;
  if (!fb) console.warn('portal: private/firebase.json is missing, so the console has no data source yet');
  if (!keys.signing) console.warn('portal: private/log-keys.json has no signing key, so site settings cannot be published');

  const logins = [];
  const propLogins = propsFile || join(priv, 'credentials');
  if (existsSync(propLogins)) {
    for (const raw of readFileSync(propLogins, 'utf8').split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;
      const [user, pass, account] = line.split('\t');
      logins.push({ user: user.trim().toLowerCase(), pass, account: account.trim() });
    }
  }
  const { library, dirKey } = buildLibrary([...new Set(logins.map((l) => l.account))]);
  const accounts = logins.map((l) => {
    const b = loadAccount(l.account, false);
    return { user: l.user, pass: l.pass, account: l.account, name: b.name, role: b.role, welcome: b.welcome, folders: b.folders,
      docs: b.docs.map((d) => l.account + '--' + d.id) };
  });

  const jobs = [];
  const jobsDir = join(root, 'apps', 'kelvara', 'src', 'content', 'jobs');
  if (existsSync(jobsDir)) {
    for (const n of readdirSync(jobsDir).filter((x) => x.endsWith('.yml')).sort()) {
      const j = YAML.parse(readFileSync(join(jobsDir, n), 'utf8'));
      jobs.push({ reference: j.reference, title: j.title_en, positions: j.positions || 1, date: j.date instanceof Date ? j.date.toISOString().slice(0, 10) : String(j.date) });
    }
  }
  const sites = readdirSync(join(root, 'apps')).filter((d) => existsSync(join(root, 'apps', d, 'public', 'js', 'log-config.js')));
  const baseDate = (readFileSync(join(root, 'apps', 'neurostat', 'public', 'js', 'log-config.js'), 'utf8').match(/baseDate:\s*'([\d-]+)'/) || [])[1] || '';
  return { projectId: fb ? fb.projectId : '', apiKey: fb ? fb.apiKey : '', privateJwk: keys.privateJwk, signJwk: keys.signing ? keys.signing.privateJwk : null,
    accounts, library, dirKey, jobs, sites, baseDate };
}

function loadAccount(account, withFiles = true) {
  const dir = join(priv, 'portal', account);
  if (!existsSync(dir)) fail(`folder private/portal/${account} not found`);
  const meta = existsSync(join(dir, 'account.yml')) ? YAML.parse(readFileSync(join(dir, 'account.yml'), 'utf8')) : {};
  const docs = [];
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.md')).sort()) {
    const fm = frontmatter(join(dir, name));
    if (fm.published === false) continue;
    for (const k of ['title', 'number', 'date', 'classification']) if (!fm[k]) fail(`${account}/${name}: missing "${k}"`);
    let file = null;
    if (fm.file && withFiles) {
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
      stamp: withFiles ? stampSvg({ text: stampText }) : '',
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
