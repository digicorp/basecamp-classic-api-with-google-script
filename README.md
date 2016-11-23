# Overview

This repository contains the end to end solution to create google app script that connects with [Basecamp Classic API](https://github.com/basecamp/basecamp-classic-api) and get the different set of datasets based on needs. The solution that described here solved our problem of generating timesheet from basecamp at [Digicorp](https://www.digi-corp.com) with few click and easy of use. this whole tutorial divided into following three sections.

1. [Core Library (Lib.gs)](#core-library)
2. [Helper Class (Helper.gs)](#Helper Class)
3. [Controller (Controller.gs)](#Controller)

_[Note : It is assumed that one will have basic knowledge of how to create google app script on google spreadsheet. So basic steps of creating script files and authorization of same is not included in this tutorial. You can refer [Google App Script](https://developers.google.com/apps-script/) for more help ]_

# Core Library

We have created core library that contains generic functions and methods that used throughout the whole solution. These functions and methods are generic and can be used with any google script solution. It is nothing but the wrapper function and methods written on google app script functions and methods. Following details describes each of them

Function                                      | Type         | Description                                                  | Input                          | Output
--------------------------------------------- | ------------ | ------------------------------------------------------------ | ------------------------------ | -------------
[Execute API](#Execute API)                   | Core Library | Function to invoke API based on provided inputs              | `url`,`username`,`password`    | `response`
[Get Active Sheet](#Get Active Sheet)         | Core Library | Function to get active spreadsheet                           | `sheetname`                    | `spreadsheet`
[Insert Sheet](#Insert Sheet)                 | Core Library | Function to get create new sheet under active spreadsheet    | `sheetname`                    | `spreadsheet`
[Get Items](#Get Items)                       | Core Library | Function to get child items for provided parent key from XML | `apiresponse','key`            | `items`
[Clear Sheet](#Clear Sheet)                   | Core Library | Method to clear sheet's content and formatting               | `sheet`                        | `-`
[Set Cell Value](#Set Cell Value)             | Core Library | Method to set value in specific cell of sheet                | `sheet`,`row`,`column`,`value` | `-`
[Get Cell Value](#Get Cell Value)             | Core Library | Method to get value of specific cell of sheet                | `sheet`,`row`,`column`         | `-`
[Get Child Item Value](#Get Child Item Value) | Core Library | Function to get value of specific child item of array        | `array`,`index`,`key`          | `value`

## Execute API

`Invoke` function used to call basecamp api. it takes `url`, `username` and `password` as input arguments. Passes authentication details in header in base64Encoded format. Based on authentication, it responds with XML.

We created this function to invoke basecamp classic APIs. Throughout the whole implementation eventually this functions is invoked to connect with basecamp APIs and get the response.

```javascript
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
```

## Get Active Sheet

`GetActiveSheet` function used to get the active OR specific sheet of spreadsheet. it takes `sheetname` as input argument. in case if `sheetname` passed as blank string, it returns active sheet, otherwise it return the sheet provided as `sheetname`

We had need of get instance of Current Sheet and in some cases Specific Sheet. so we created a parameterized function that served purpose. To get the Current Active Sheet we can simply use this function with empty sting ('') and in case to get Specific Sheet we can simply use sheet name.

```javascript
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
```

## Insert Sheet

`InsertSheet` function used to create new sheet with provided name in spreadsheet. it takes `sheetname` as input argument.

We created this function to create new sheet in active spreadsheet. We had requirement of creating new sheets with specific name in active spreadsheet runtime.

```javascript
/**
 * Create new sheet under spreadsheet
 * @param sheetname Name of the sheet.
 */
function InsertSheet(sheetname) {
    var spreadsheet;
    spreadsheet= SpreadsheetApp.getActiveSpreadsheet().insertSheet(sheetname);
    return spreadsheet;
}
```

## Get items

`GetItems` function used to create of array of child items for parent key from XML. It takes `apiresponse` in xml format and `key`. it parses xml response and returns child items array for specific `key`

### Sample XML

```xml
<people type="array">
  <person>
    <client-id type="integer">0</client-id>
    <created-at type="datetime">2006-05-11T00:00:00Z</created-at>
    <id type="integer">000000</id>
    <title>Director</title>
    <first-name>Mark</first-name>
    <last-name>Twain</last-name>
    <company-id type="integer">123456</company-id>
  </person>
</people>
```

We are getting typical XML response from basecamp api as displayed above. To get the list of persons from people parent node, we created this function that helped to generate array of items for specific child key from passed XML.

```javascript
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
```

## Clear Sheet

`ClearSheet` method used to clear format and content of the sheet. It takes `sheet` as input argument and clears it. We had created this utility to clear sheet content and format as and when required. We had plenty of use cases where we need to regenerate the sheet and before doing it we need to clear it

```javascript
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
```

## Set Cell Value

`SetCellValue` method used to set the `value` in specific `row` and `column`

```javascript
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
```

## Get Cell Value

`GetCellValue` function used to get the of value `row` and `column` of specified `sheet`

```javascript
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
```

## Get Child Item Value

`GetChildItemValue` function used to get the value from `array` from specific `index` for specific `key`

We had list of items in arrays and we need values of specific key from that array. we created this function to get the value of specific key from array on specific index

```javascript
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
```

# Helper Class

We have created helper class that contains business logic specific functions and methods which will be called from controller on specific events. We conceived and created more generic business logic functions that helped us plenty of implementation around basecamp people,projects and time entries. Once can use these functions and methods few basecamp account related configuration changes.

Function                                | Type         | Description                                                                               | Input                            | Output
--------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- | -------------------------------- | -------------
[Constants](#Constants)                 | Helper Class | To use username, password and url throughout the helper class, it is defined as constants | `-`                              | `-``
[Call Basecamp API](#Call Basecamp API) | Helper Class | Function to call API and get response in XML                                              | `xml`                            | `response`
[Get People](#Get People)               | Helper Class | Function used to get the list of People                                                   | `-`                              | `people`
[Get Projects](#Get Projects)           | Helper Class | Function used to get the list of Projects                                                 | `-`                              | `projects`
[Get TODO Lists](#Get TODO Lists)       | Helper Class | Function used to get the list of TODO Lists                                               | `subjectiid`                     | `todolists`
[Get TODO Items](#Get TODO Items)       | Helper Class | Function used to get the list of TODO Items                                               | `todo_list_id`                   | `todoitems`
[Get Time Entries](#Get Time Entries)   | Helper Class | Function used to get the list of Time Entries                                             | `fromdate`,`todate`,`subjectiid` | `timeentries`

## Constants

To use `username`, `password` and `url` throughout the helper class, it is defined as constants. We kept this section for configuration purpose, so once can change configuration directly from here and start using it.

```javascript
/**
*This section defines the constants that will
*be used through out this helper Class
*/
username = 'basecampusername';
password= 'basecampuserpassword'
url = "https://example.basecamphq.com/"
```

## Call Basecamp API

`CallBacampAPI` function used to call basecamp API through core library function. It takes `xml` filename as input and creates API url and invokes to get response.We created this functions that take configurations from constants and Invoke core library functions to get the response.

```javascript
/**
* To call API and get response in XML format
* @param xml Name of XML that returns response.
*/
function CallBacampAPI(xml) {
    var response;
    response = Invoke(url + xml, username, password)
    return response;
}
```

## Get People

`GetPeople` function used to get the list of people from basecamp and returns array of people

```javascript
/**
* To call people.xml and get the list of people from basecamp
*/
function GetPeople() {
    var people;
    var response = CallBacampAPI('people.xml')
    people = GetItems(response, "person");
    return people;
}
```

## Get Projects

`GetProjects` function used to get the list of projects from basecamp and returns array of projects

```javascript
/**
* To call project.xml and get the list of people from basecamp
*/
function GetProjects() {
    var projects;
    var response = CallBacampAPI('projects.xml')
    projects = GetItems(response, 'project')
    return projects;
}
```

## Get TODO Lists

`GetTODOList` function used to get the list of TODO Lists from basecamp for specific project and returns array of TODO Lists

```javascript
/**
* To get the list of TODO Lists of specific project
*/
function GetTODOList(subjectid) {
    var todolists;
    var todolisturl = 'projects/' + subjectid + '/todo_lists.xml'
    var response = CallBacampAPI(todolisturl);
    todolists = GetItems(response, 'todo-list')
    return todolists;
}
```

## Get TODO Items

`GetTODOItems` function used to get the list of TODO Items from basecamp for specific todo list and returns array of TODO Items

```javascript
/**
* To get the list of TODO Items of specific TODO List
*/
function GetTODOItems(todo_list_id) {
    var todolistsitems;
    var todolistitemsurl = 'todo_lists/' + todo_list_id + '/todo_items.xml'
    var response = CallBacampAPI(todolistitemsurl);
    todolistsitems = GetItems(response, 'todo-item')
    return todolistsitems;
}
```

## Get Time Entries

`GetTimeEntries` function used to get the list of TODO Items from basecamp for specific todo list and returns array of TODO Items

We had need of get time entries of all projects and in some cases Specific Project. so we created a parameterized function that served purpose. To get the time entries of all projects we can simply used this function with empty sting (0) and in case to get Specific Project time entries we can simply use project id (subjectid) along with from date and to date.

```javascript
/**
* To get the list of Time Entries between date range.
* To get the list of Time Entries of Specific Project between date range
* @param fromdate From date
* @param todate To Date
* @param subjectid Project Unique ID (default value should be 0)
*/
function GetTimeEntries(fromdate, todate, subjectid) {
    var timings;
    if (subjectid == 0) {
        var timetrackingurl = 'time_entries/report.xml?from='
        + fromdate + '&to=' + todate
    } else {
        var timetrackingurl = 'time_entries/report.xml?from='
        + fromdate + '&to=' + todate + '&subject_id=' + subjectid;
    }

    var response = CallBacampAPI(timetrackingurl);
    timings = GetItems(response, 'time-entry')
    return timings;
}
```

# Controller

A controller class contains methods and events that demonstrates the use of core library and helper class and get the desired output from basecamp classic and stored on google sheets.

Function                                | Type       | Description                               | Input | Output
--------------------------------------- | ---------- | ----------------------------------------- | ----- | ------
[Create Menu](#Create Menu)             | Controller | Event to create menu with submenu item    | `-`   | `-`
[List People](#List People)             | Controller | Event to insert list of people in sheet   | `-`   | `-`
[List Projects](#List Projects)         | Controller | Event to insert list of projects in sheet | `-`   | `-`
[List Time Entries](#List Time Entries) | Controller | Event to insert time entries sheet        | `-`   | `-`

## Create Menu

`onOpen` method used to create menu with submenu items in spreadsheet.

```javascript
/**
* To create menu on google sheet
*/
function onOpen() {
    var spreadsheet = SpreadsheetApp.getActive();
    var menuItems = [
        {
        name: 'Get People From Basecamp',
        functionName: 'ListPeople'
        },
        {
            name: 'Get Projects From Basecamp',
            functionName: 'ListProjects'
        }
        ,
        {
            name: 'Get Time Entries From Basecamp',
            functionName: 'ListTimeEntries'
        }  
    ];
    spreadsheet.addMenu('Sample', menuItems);
}
```

## List People

`ListPeople` method used to get the list of people from basecamp using function `GetPeople` and insert into specific sheet

```javascript
/**
* To create sheet called "People" and get the list of people
* from basecamp and insert into sheet
*/
function ListPeople() {
        var sheet = CreateSheet("People");
        var people = GetPeople();
        var count = 1;
        //
        for (var i = 0; i < people.length; i++) {
            var clientid = GetChildItems(people, i, 'client-id');
            var team = GetChildItems(people, i, 'phone-number-home');
            var firstname = GetChildItems(people, i, 'first-name');
            var lastname = GetChildItems(people, i, 'last-name');
            if (clientid == '0')
            {
                SetCellValue(sheet, count, 1, firstname + ' ' + lastname);
                SetCellValue(sheet, count, 2, team);
                count = count + 1;
            }
        }
}
```

## List Projects

`ListProjects` method used to get the list of projects from basecamp using function `GetProjects` and insert into specific sheet

```javascript
/**
* To create sheet called "Projects" and get the list of active projects
* from basecamp and insert into sheet
*/
function ListProjects()
{
  var sheet = CreateSheet('Projects')
  var projects = GetProjects();
  var count = 1;
  for (var i=0; i< projects.length; i++)
  {
    var company = projects[i].getChild('company').getChild('name').getText();
    var projectid = GetChildItems(projects, i, 'id');
    var projectname = GetChildItems(projects, i, 'name');
    var status = GetChildItems(projects, i, 'status')
   if (status=='active')
   {
    SetCellValue(sheet, count, 1, projectid);
    SetCellValue(sheet, count, 2, projectname);   
    SetCellValue(sheet, count, 3, company);
    count = count + 1
    }
  }
}
```

# List Time Entries

`ListTimeEntries` method used to get the list of time entries from basecamp using function `GetTimeEntries` and insert into specific sheet

```javascript
/**
* To create sheet called "Report" and get the list of time entries of
* between start date and end date
*/
function ListTimeEntries() {
    var sheet =  CreateSheet('Report');
    var fromdate = '20160101' //1st January 2016
    var todate = '20160131' //31s January 2016
    var timeentries =  GetTimeEntries(fromdate, todate, '0');
    var count = 1;
    var values = [[]];
    for (var i = 0; i < timeentries.length; i++) {
      var date = GetChildItems(timeentries, i, 'date');
        var hrs = GetChildItems(timeentries, i, 'hours');
        var id = GetChildItems(timeentries, i, 'id');
        var personid = GetChildItems(timeentries, i, 'person-id');
        var projectid = GetChildItems(timeentries, i, 'project-id');
        var todoitemid = GetChildItems(timeentries, i, 'todo-item-id');
        var personname = GetChildItems(timeentries, i, 'person-name');
        var description = GetChildItems(timeentries, i, "description");

        if (values[0].length ==0)
        {
        values =  [[date,hrs,id,personid,projectid,todoitemid,personname,description]];
         }
         else
         {
         values.push([date,hrs,id,personid,projectid,todoitemid,personname,description ]);
        }
    }
    var range = sheet.getRange(1,1,values.length,values[0].length);
    range.clear({contentsOnly: true});
    range.setValues(values);
    }
```
