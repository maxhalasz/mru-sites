#!/usr/bin/env node
// Copies the full panel address (with the secret after #) to the clipboard, without printing the secret.
//   npm run panel-link
// Use that address the first time you open the panel on a new device. Afterwards the plain address works.
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const file = new URL('../private/credentials.panel', import.meta.url);
if (!existsSync(file)) { console.error('private/credentials.panel not found'); process.exit(1); }
const line = readFileSync(file, 'utf8').split(/\r?\n/).find((l) => l.trim() && !l.startsWith('#'));
const secret = line && line.split('\t')[1];
if (!secret) { console.error('No secret found in private/credentials.panel'); process.exit(1); }

const url = 'https://maxhalasz.github.io/mru-sites/#' + secret;
if (process.argv.includes('--check')) { console.log('ok, the link has ' + url.length + ' characters'); process.exit(0); }

const tool = process.platform === 'win32' ? ['clip'] : process.platform === 'darwin' ? ['pbcopy'] : ['xclip', '-selection', 'clipboard'];
const r = spawnSync(tool[0], tool.slice(1), { input: url });
if (r.error || r.status !== 0) { console.error('Could not reach the clipboard. Open private/credentials.panel and add the second column after # in the panel address.'); process.exit(1); }
console.log('Link copied. Paste it into the browser address bar, then type the word on the black screen.');
