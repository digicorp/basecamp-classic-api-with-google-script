//## Create Menu ######################################################################################################################
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

//## List People ######################################################################################################################
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

//## List Projects #####################################################################################################################
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

//## List Time Entries #################################################################################################################
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
