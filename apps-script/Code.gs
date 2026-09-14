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
  "Tamanho da camisa",
  // Colunas novas entram sempre NO FIM da lista: as linhas já gravadas na
  // planilha continuam alinhadas com os títulos.
  "Profissão"
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
      data.tamanho || "",
      data.profissao || ""
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
  } else {
    completarCabecalho_(sheet);
  }
  return sheet;
}

/**
 * Preenche títulos que foram acrescentados ao fim de HEADERS depois que a
 * planilha já estava em uso, para não precisar editar a mão.
 */
function completarCabecalho_(sheet) {
  var faltando = HEADERS.length - sheet.getLastColumn();
  if (faltando <= 0) return;
  sheet
    .getRange(1, sheet.getLastColumn() + 1, 1, faltando)
    .setValues([HEADERS.slice(HEADERS.length - faltando)]);
}
