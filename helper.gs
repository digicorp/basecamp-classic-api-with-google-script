//## Constants #########################################################################################################################
/**
*This section defines the constants that will
*be used through out this helper Class
*/
username = 'basecampusername';
password= 'basecampuserpassword'
url = "https://example.basecamphq.com/"

//## Call Basecamp API #################################################################################################################
/**
* To call API and get response in XML format
* @param xml Name of XML that returns response.
*/
function CallBacampAPI(xml) {
    var response;
    response = Invoke(url + xml, username, password)
    return response;
}

//## Get People ########################################################################################################################
/**
* To call people.xml and get the list of people from basecamp
*/
function GetPeople() {
    var people;
    var response = CallBacampAPI('people.xml')
    people = GetItems(response, "person");
    return people;
}

//## Get Projects ######################################################################################################################
/**
* To call project.xml and get the list of people from basecamp
*/
function GetProjects() {
    var projects;
    var response = CallBacampAPI('projects.xml')
    projects = GetItems(response, 'project')
    return projects;
}

//Get TODO Lists #######################################################################################################################
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

//## Get TODO Items ####################################################################################################################
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

//## Get Time Entries ##################################################################################################################
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
