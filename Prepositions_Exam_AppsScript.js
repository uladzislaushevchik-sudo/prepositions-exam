var SHEET_ID = '1bzhTL58e2V5Cjaz-F5lH_5IPkXpFXLZsqTnAEqCiPvM';
var SHEET_NAME = 'Results';

function getSheet_() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function setupSheet() {
  var sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'timestamp', 'name', 'group', 'pct', 'correct', 'total', 'pass',
      'time', 'place', 'direction', 'transport', 'details_json'
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold');
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Prepositions Exam webhook OK. Use POST to submit results.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var raw = '{}';
    if (e && e.postData && e.postData.contents) raw = e.postData.contents;
    else if (e && e.parameter && e.parameter.data) raw = e.parameter.data;
    var data = JSON.parse(raw);
    return writeRow_(data);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeRow_(data) {
  setupSheet();
  var sheet = getSheet_();
  var by = data.bySec || {};
  function secPct(key) {
    var x = by[key];
    if (!x || !x.t) return '';
    return x.c + '/' + x.t + ' (' + Math.round(100 * x.c / x.t) + '%)';
  }
  sheet.appendRow([
    data.dateLocal || new Date().toLocaleString('ru-RU'),
    data.name || '',
    data.group || '',
    data.pct != null ? data.pct : '',
    data.correct != null ? data.correct : '',
    data.total != null ? data.total : '',
    data.pass ? 'PASS' : 'FAIL',
    secPct('Time'),
    secPct('Place'),
    secPct('Direction'),
    secPct('Transport'),
    JSON.stringify(data.details || [])
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function testPost() {
  writeRow_({
    name: 'Test Student',
    group: 'A2',
    dateLocal: new Date().toLocaleString('ru-RU'),
    pct: 85,
    correct: 34,
    total: 40,
    pass: true,
    bySec: {
      Time: { c: 9, t: 10 },
      Place: { c: 8, t: 10 },
      Direction: { c: 9, t: 10 },
      Transport: { c: 8, t: 10 }
    },
    details: []
  });
}
