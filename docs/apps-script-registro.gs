/**
 * Registro dos formulários dos sites NeuroStat e Kelvara.
 *
 * Como usar: abra uma planilha do Google, Extensões → Apps Script, apague o que estiver lá,
 * cole este arquivo inteiro e implante como "App da Web" (passo a passo em docs/REGISTRO.md).
 * Cada tipo de formulário vira uma aba da planilha, com uma linha por envio.
 * Senhas nunca chegam aqui: o site não as envia.
 */

// Opcional: um e-mail que recebe aviso a cada nova candidatura. Deixe vazio para não receber.
const NOTIFY_EMAIL = '';

const TABS = {
  application: 'Candidaturas',
  contact: 'Contato',
  'boreas-screening': 'BOREAS-2 triagem',
  newsletter: 'Newsletter',
  'investor-alert': 'Alertas investidor',
  'portal-login': 'Portal logins',
  'portal-open': 'Portal documentos',
};
const FIXED = ['Data e hora', 'Site', 'Protocolo', 'Página', 'Idioma'];
const LAST = 'Navegador';
const MAX_LEN = 4000;

function doGet() {
  return reply({ ok: true, info: 'Registro ativo' });
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return reply({ ok: true }); // campo-armadilha preenchido por robôs

  let fields = [];
  try { fields = JSON.parse(p.fields || '[]'); } catch (err) { fields = []; }
  if (!Array.isArray(fields)) fields = [];
  fields = fields.slice(0, 40);

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const name = TABS[p.form] || 'Outros ' + clean(p.form).slice(0, 20);
    appendEntry(getTab(name), p, fields);
  } finally {
    lock.releaseLock();
  }

  if (NOTIFY_EMAIL && p.form === 'application') notify(p, fields);
  return reply({ ok: true });
}

function getTab(name) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  return book.getSheetByName(name) || book.insertSheet(name);
}

function appendEntry(sheet, p, fields) {
  let header = sheet.getLastColumn() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  if (header.length === 0) {
    header = FIXED.concat([LAST]);
    sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  fields.forEach(function (f) {
    const label = clean(f && f.label).slice(0, 90) || 'Campo';
    if (header.indexOf(label) < 0) {
      const at = header.indexOf(LAST);
      sheet.insertColumnBefore(at + 1);
      sheet.getRange(1, at + 1).setValue(label).setFontWeight('bold');
      header.splice(at, 0, label);
    }
  });

  const row = new Array(header.length).fill('');
  const tz = Session.getScriptTimeZone();
  const fixed = [
    Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss'),
    clean(p.site), clean(p.ref), clean(p.page), clean(p.lang),
  ];
  fixed.forEach(function (v, i) { row[i] = safe(v); });
  fields.forEach(function (f) {
    const label = clean(f && f.label).slice(0, 90) || 'Campo';
    row[header.indexOf(label)] = safe(f && f.value);
  });
  row[header.indexOf(LAST)] = safe(p.ua);
  sheet.appendRow(row);
}

function notify(p, fields) {
  const lines = fields.map(function (f) { return clean(f.label) + ': ' + clean(f.value); });
  MailApp.sendEmail(NOTIFY_EMAIL, 'Nova candidatura ' + clean(p.ref), lines.join('\n'));
}

// Evita que um texto digitado comece com = + - @ e vire fórmula na planilha.
function safe(v) {
  const s = clean(v).slice(0, MAX_LEN);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function clean(v) {
  return v === undefined || v === null ? '' : String(v);
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
