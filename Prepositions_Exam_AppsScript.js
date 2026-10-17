/**
 * Google Apps Script for Prepositions Exam auto-submit
 * Deploy as Web App: Execute as Me, Who has access: Anyone
 */
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Results') || ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp','name','group','pct','correct','total','pass','time','place','direction','transport','details_json']);
    }
    var by = data.bySec || {};
    function secPct(key) {
      var x = by[key];
      if (!x || !x.t) return '';
      return x.c + '/' + x.t + ' (' + Math.round(100 * x.c / x.t) + '%)';
    }
    sheet.appendRow([
      data.dateLocal || new Date().toString(),
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
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
function testPost() {
  doPost({ postData: { contents: JSON.stringify({
    name: 'Test Student', group: 'A2', dateLocal: new Date().toLocaleString('ru-RU'),
    pct: 85, correct: 34, total: 40, pass: true,
    bySec: { Time: { c: 9, t: 10 }, Place: { c: 8, t: 10 }, Direction: { c: 9, t: 10 }, Transport: { c: 8, t: 10 } },
    details: []
  }) } });
}
