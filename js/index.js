
var application = "InContact_API_Test";
var vendor = "Ivan_Klus";
//var client_id = window.btoa(application + "@" + vendor);
var client_id = "InContact_API_Test@Ivan_Klus";
var implicitUri = "https://api.incontact.com/InContactAuthorizationServer/Authenticate";
var token_scope = "RealTimeApi AdminApi AgentApi ReportingApi";
var redirect_uri = "http://ivankl.us/incontact_call_logger";
var state_object = "myState";

function dropdownFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }   
}

function redirectToInContactAuth() {
    var url = implicitUri;
    url = url + "?state=" + state_object;
    url = url + "&response_type=token";
    url = url + "&client_id=" + encodeURIComponent(client_id);
    url = url + "&redirect_uri=" + encodeURIComponent(redirect_uri);
    url = url + "&scope=" + encodeURIComponent(token_scope);
    console.log(url);
    window.location.href = url;
}

var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);
        urlParams = {};
    while (match = search.exec(query))
        urlParams[decode(match[1])] = decode(match[2]);
})();

console.log(urlParams);
var requestURL = urlParams['resource_server_base_uri'] + 'services/v12.0/agents/' + agentId + '/interaction-history';
var agentContactHistoryResult;

function getAgentContactHistory() {
    var agentId = document.getElementById('agentIdValue').value;
    console.log('Agent ID:' + agentId);
    getAgentContactHistoryPayload = {
        'startDate': document.getElementById('startDate').value,
        'endDate': document.getElementById('endDate').value,
        'mediaTypeId': '4'
    }   // 4 is the media type for Phone Calls
        /* Unused parameters
        'updatedSince': 'ISO 8601 formatted date/time',
        'fields': 'string',
        'skip': 'integer',
        'top': 'integer',
        'orderBy': 'string'
        */
    $.ajax({
        //The baseURI variable is created by the result.base_server_base_uri,
        //which is returned when getting a token and should be used to create the URL base
        'url': urlParams['resource_server_base_uri'] + 'services/v12.0/agents/' + agentId + '/interaction-history',
        'type': 'GET',
        'headers': {
            'Authorization': 'bearer ' + urlParams["access_token"],
            'content-Type': 'application/x-www-form-urlencoded'
        },
        'data': getAgentContactHistoryPayload,
        'success': function (result, status, statusCode) {
            //Process success actions
            console.log('success: ' + status + " | " + statusCode);
            console.log(result);
            agentContactHistoryResult = result;
            document.getElementById('test').innerHTML = JSON.stringify(result);
        },
        'error': function (XMLHttpRequest, textStatus, errorThrown) {
            //Process error actions
            console.log('error' + errorThrown);
            return false;
        }
    });
}

console.log("Hello JavaScript!");
