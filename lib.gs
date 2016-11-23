//## Execute API #######################################################################################################################
/**
 * Used to call api and return response XML
 * @param url  API URL
 * @param username Username
 * @param password Password
 * @customFunction
 */
function Invoke(url,username,password) {
    var headers = {
        'Authorization': 'Basic ' + Utilities.base64Encode(username + ':' + password),
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
        'validateHttpsCertificates': false,
        'muteHttpExceptions': true,
    }
    var opt = {
        'headers': headers,
    };
    var response;
    response = UrlFetchApp.fetch(url, opt).getContentText();
    return response;
    }

//## Get Active Sheet ##################################################################################################################
/**
 * Get active sheet OR Get sheet by name
 * @param sheetname Name of the sheet.
 */
function GetActiveSheet(sheetname) {
    var spreadsheet;

    if (sheetname == '') {
        spreadsheet = SpreadsheetApp.getActive().getActiveSheet();
    } else {
        spreadsheet = SpreadsheetApp.getActive().getSheetByName(sheetname);
    }
    return spreadsheet;
}

//## Insert Sheet ######################################################################################################################
/**
 * Create new sheet under spreadsheet
 * @param sheetname Name of the sheet.
 */
function InsertSheet(sheetname) {
    var spreadsheet;
    spreadsheet= SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetname);
    return spreadsheet;
}

//## Get items #########################################################################################################################
/**
* Get array of child items for provided parent key
 * @param  apiresponse XML response from called API
 * @param  key Parent key for which child items list required from response.
 */
function GetItems(apiresponse,key)
{
  var items;
  var parsedresponse = XmlService.parse(apiresponse);
  items = parsedresponse.getRootElement().getChildren(key);
  return items;
}

//## Clear Sheet #######################################################################################################################
/**
 * Will clear sheet.
 * @param sheet Sheet that needs to be cleared
 */
function ClearSheet(sheet)
{
  sheet.clear({
        formatOnly: true,
        contentsOnly: true
    });
    sheet.clearNotes();
}

//## Set Cell Value ####################################################################################################################
/**
 * To set value of a cell
 * @param sheet Sheet contain cell on which value should set.
 * @param row Row on which value should set
 * @param column Column on which value should set
 * @param value Value which should set in cell
 */
function SetCellValue(sheet,row,column,value)
{
  sheet.getRange(row, column).setValue(value);
}

//## Get Cell Value ####################################################################################################################
/**
 * To get value of a cell
 * @param sheet Sheet contain cell of which value should get.
 * @param row Row on which value should get
 * @param column Column on which value should get
 */
function GetCellValue(sheet,row,column)
{
  return sheet.getRange(row, column).getValue();
}

//## Get Child Item Value ##############################################################################################################
/**
 * To get item from array
 * @param array Collection of items as an array.
 * @param index Index number for which item value to get
 * @param key Child item key
 */
function GetChildItemValue(array,index,key)
{
  return array[index].getChild(key).getText(); 
}

