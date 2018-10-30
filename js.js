function callReasonOnclick(){
    document.getElementById("callReasonDropdown").classList.toggle("show");
}

function salesforceOrganizationOnclick(){
    document.getElementById("salesforceOrganizationDropdown").classList.toggle("show");
}

function salesforceContactOnclick(){
    document.getElementById("salesforceContactDropdown").classList.toggle("show");
}

function phoneNumberDropdownOnclick(){
    document.getElementById("phoneNumberDropdown").classList.toggle("show");
}

// function sampleGetAgentStatus() {
//     //Not sure how to do this with regular expressions
//     //Goal is to isolate agent ID
//     //var agentId = window.location.href.substring(window.location.href.indexOf('agentId=') + 8);
//     //var agentId = agentId.substring(0, agentId.indexOf('&'));
//     var agentId = 6896120;
//     console.log('Agent ID:' + agentId);
//     getAgentContactHistoryPayload = {
//         'updatedSince': '2018-10-29T14:07:19-04:00', //'2018-10-22T08:00:00.000Z',
//         'fields': 'agentId, agentStateId, firstName, lastName'
//     }
//     $.ajax({
//         //The baseURI variable is created by the result.base_server_base_uri,
//         //which is returned when getting a token and should be used to create the URL base
//         'url': urlParams['resource_server_base_uri'] + 'services/v12.0/agents/status',
//         'type': 'GET',
//         'headers': {
//             'Authorization': 'bearer ' + urlParams["access_token"],
//             'content-Type': 'application/x-www-form-urlencoded'
//         },
//         'data': getAgentContactHistoryPayload,
//         'success': function (result, status, statusCode) {
//             //Process success actions
//             console.log('success: ' + status + " | " + statusCode);
//             console.log(result);
//             document.getElementById('test').innerHTML = JSON.stringify(result);
//         },
//         'error': function (XMLHttpRequest, textStatus, errorThrown) {
//             //Process error actions
//             console.log('error' + errorThrown);
//             return false;
//         }
//     });
// }

/*window.onclick = function(event){
    document.getElementById("salesforceContactDropdown").classList.remove("show");
    document.getElementById("salesforceOrganizationDropdown").classList.remove("show");
    document.getElementById("callReasonDropdown").classList.remove("show");
}*/