/**
 * BNC website → Google Sheets.
 *
 * Setup (once, about 2 minutes):
 *   1. Open the "BNC – Access Requests" sheet → Extensions → Apps Script.
 *   2. Replace everything in Code.gs with this file. Change SECRET below to a long random string.
 *   3. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone. Deploy, and authorise.
 *   4. Copy the Web app URL (ends in /exec). In Vercel, add two environment variables:
 *        SHEETS_WEBHOOK_URL    = that URL
 *        SHEETS_WEBHOOK_SECRET = the same SECRET as below
 *      then redeploy the site.
 *
 * Every submission becomes one row. Tabs ("Access Requests", "Subscribers", "Inquiries") are created on first use,
 * and columns are matched by header name, so you can reorder or add your own columns (e.g. Status, Notes) freely.
 */
const SECRET = "CHANGE-ME-to-a-long-random-string";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (body.secret !== SECRET) return json({ ok: false, error: "unauthorised" });
    const tab = String(body.tab || "");
    if (["Access Requests", "Subscribers", "Inquiries"].indexOf(tab) < 0) return json({ ok: false, error: "unknown tab" });
    const row = body.row || {};

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(tab);
    if (!sheet && tab === "Access Requests" && ss.getSheets().length === 1 && ss.getSheets()[0].getName() !== tab) {
      sheet = ss.getSheets()[0].setName(tab); // the sheet was created with its headers on the first tab
    }
    if (!sheet) sheet = ss.insertSheet(tab);

    let headers = sheet.getLastColumn() ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String) : [];
    const missing = Object.keys(row).filter((k) => headers.indexOf(k) < 0);
    if (missing.length) {
      sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]).setFontWeight("bold");
      headers = headers.concat(missing);
      sheet.setFrozenRows(1);
    }
    // Leading = + - @ would be read as a formula; prefix with an apostrophe so text stays text.
    const safe = (v) => (typeof v === "string" && /^[=+\-@]/.test(v) ? "'" + v : v == null ? "" : v);
    sheet.appendRow(headers.map((h) => safe(row[h])));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: "bnc-sheets" });
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
