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

function sampleGetAgentStatus() {
    //Not sure how to do this with regular expressions
    //Goal is to isolate agent ID
    //var agentId = window.location.href.substring(window.location.href.indexOf('agentId=') + 8);
    //var agentId = agentId.substring(0, agentId.indexOf('&'));
    var agentId = 6896120;
    console.log('Agent ID:' + agentId);
    getAgentContactHistoryPayload = {
        'updatedSince': '2018-10-29T14:07:19-04:00', //'2018-10-22T08:00:00.000Z',
        'fields': 'agentId, agentStateId, firstName, lastName, lastUpdateTime, teamName'
    }
    $.ajax({
        //The baseURI variable is created by the result.base_server_base_uri,
        //which is returned when getting a token and should be used to create the URL base
        'url': 'https://api-c12.incontact.com/InContactAPI/' + 'services/v12.0/agents/states',
        'type': 'GET',
        'headers': {
            'Authorization': 'bearer ' + '',
            'content-Type': 'application/x-www-form-urlencoded'
        },
        'data': getAgentContactHistoryPayload,
        'success': function (result, status, statusCode) {
            //Process success actions
            console.log('success: ' + status + " | " + statusCode);
            //console.log(result);
            var agentStatus = result;
            console.log(agentStatus.agentStates[0]);
            let html = '';
            let currTime = Date.now();
            let count = 0;
            for (let i = 0; i < agentStatus.agentStates.length; i++){
                if(agentStatus.agentStates[i].teamName == 'SL Client Services'){
                    html += '<div class="card">';
                    //add ID
                        html += '<div class="card-header"';
                            html += '<h5 class="mb-0">';
                    //change tags
                                html += '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' + count + '" aria-expanded="true" aria-controls="collapse' + count + '">';
                                    html += '<div class="row">';
                                        html += '<div class="col-2">' + agentStatus.agentStates[i].firstName + ' ' + agentStatus.agentStates[i].lastName + '</div>'
                                        html += '<div class="col-6"></div>';
                                        let newDate = new Date(agentStatus.agentStates[i].lastUpdateTime);
                                        html += '<div class="col-3">' + secondsToTime(currTime-newDate.getTime()) + '</div>';
                                        html += '<div class="col-1 status' + agentStatus.agentStates[i].agentStateId + '">' + agentStatus.agentStates[i].agentStateId + '</div>';
                                    html += '</div>'; //row
                                html += '</button>';
                            html += '</h5>';
                        html += '</div>'; //card header
                    
                        //card body
                        html += '<div id="collapse' + count + '" class="collapse hide" aria-labelledby="heading' + count + '" data-parent="#accordion">';
                            html += '<div class="card-body">Collapsible Content 2</div>';
                        html += '</div>';
                    html += '</div>';
                    count++;
                }
            }

            document.getElementById('testGeneratedHTML').innerHTML = html;
        },
        'error': function (XMLHttpRequest, textStatus, errorThrown) {
            //Process error actions
            console.log('error' + errorThrown);
            return false;
        }
    });
}

function secondsToTime(totalSeconds){;
    totalSeconds = Math.floor(totalSeconds/1000);
    let years = Math.floor(totalSeconds/31536000);
    totalSeconds %= 31536000;
    let days = Math.floor(totalSeconds/86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds/3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds/60);
    totalSeconds %= 60;
    if (years > 0){
        //return ('%3i:00');
        return (`${years}:${days}:${hours}:${minutes}:${totalSeconds}`);
    } else if (days > 0){
        return (`${days}:${hours}:${minutes}:${totalSeconds}`);
    } else{
        //return ('%03d:%03d:%02d', hours, minutes, totalSeconds);
        return (`${hours}:${minutes}:${totalSeconds}`);
    }
}

/*window.onclick = function(event){
    document.getElementById("salesforceContactDropdown").classList.remove("show");
    document.getElementById("salesforceOrganizationDropdown").classList.remove("show");
    document.getElementById("callReasonDropdown").classList.remove("show");
}*/