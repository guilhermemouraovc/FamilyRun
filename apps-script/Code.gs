/**
 * Family Run — recebe inscrições do formulário e grava numa aba da planilha.
 *
 * Como usar: veja o passo a passo em apps-script/README.md.
 */

var SHEET_NAME = "Inscrições";

var HEADERS = [
  "Data/hora",
  "Nome completo",
  "Data de nascimento",
  "Distância",
  "Telefone",
  "E-mail",
  "Tamanho da camisa"
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      data.nome || "",
      data.nascimento || "",
      data.distancia || "",
      data.telefone || "",
      data.email || "",
      data.tamanho || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
