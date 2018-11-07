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
    getAgentContactStatusPayload = {
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
        'data': getAgentContactStatusPayload,
        'success': function (result, status, statusCode) {
            getAgentStates(result, status, statusCode);
        },
        'error': function (XMLHttpRequest, textStatus, errorThrown) {
            //Process error actions
            console.log('error' + errorThrown);
            return false;
        }
    });
}





var html = '';
function getAgentStates(result, status, statusCode) {
        //Process success actions
        //console.log('success: ' + status + " | " + statusCode);
        //console.log(result);
        var agentStatus = result;
        //console.log(agentStatus.agentStates[0]);
        
        let currTime = Date.now();
        for (let i = 0; i < agentStatus.agentStates.length; i++){
            if(agentStatus.agentStates[i].teamName == 'SL Client Services'){
                let currentAgentId = agentStatus.agentStates[i].agentId;
                html += '<div class="card">';
                //add ID
                    html += '<div class="card-header"';
                        html += '<h5 class="mb-0">';
                //change tags
                            html += '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' + currentAgentId + '" aria-expanded="true" aria-controls="collapse' + currentAgentId + '">';
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
                    html += '<div id="collapse' + currentAgentId + '" class="collapse hide" aria-labelledby="heading' + currentAgentId + '" data-parent="#accordion">';
                        html += '<div id="' + currentAgentId + 'card-body" class="card-body">'
                            
                            //console.log('test function: ');
                            //console.log(testXMLHttp(currentAgentId));

                            //let a1 = '';
                            // $.ajax({
                            //     'url': 'https://api-c12.incontact.com/InContactAPI/' + 'services/v12.0/agents/' + currentAgentId + '/state-history',
                            //     'type': 'GET',
                            //     'headers': {
                            //         'Authorization': 'bearer ' + '',
                            //         'content-Type': 'application/x-www-form-urlencoded'
                            //     },
                            //     'data': getAgentContactHistoryPayload,
                            //     'success': function(result){
                            //         a1 += interactionHistory(result, currentAgentId, html);
                            //     }, 
                            //     'error': function (XMLHttpRequest, textStatus, errorThrown) {
                            //         //Process error actions
                            //         console.log('error' + errorThrown);
                            //         return false;
                            //     }
                            // });
                            

                        html += '</div>';
                    html += '</div>';
                html += '</div>';
            }
        }

        document.getElementById('testGeneratedHTML').innerHTML = html;
        createAccordionBodies();
}

function createAccordionBodies(){
    let elements = document.getElementsByClassName('card-body');
    for (let i = 0; i < elements.length; i++){
        let agentId = elements[i].id.substring(0, elements[i].id.indexOf('c'));
        console.log(agentId);
        document.getElementById(agentId + 'card-body').innerHTML = testXMLHttp(agentId);
    }
}

//html += testXMLHttp(currentAgentId);




function testXMLHttp(currentAgentId){
    let requestURL = 'https://api-c12.incontact.com/InContactAPI/' + 'services/v12.0/agents/' + currentAgentId + '/state-history';
    requestURL += '?startDate=' + '2018-10-29T08%3A00%3A00.000Z';
    requestURL += '&endDate=' + '2018-10-30T08%3A00%3A00.000Z';
    requestURL += '&fields=' + 'agentStateId%2C%20duration%2C%20fromAddress%2C%20toAddress';
    
    //trying to fill in dropdowns
    console.log('currentAgentId: ' + currentAgentId)
    let getAgentContactHistoryPayload = {
        'agentId': currentAgentId,
        'startDate': '2018-10-23T08:00:00.000Z', //'2018-10-22T08:00:00.000Z',
        'endDate': '2018-10-30T08:00:00.000Z',
        //'fields': 'agentStateId, Duration, fromAddress, toAddress'
    }
    
    let request = new XMLHttpRequest();
    var generatedHTML = '';
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            console.log(this.responseText);
            console.log('another test: ' + interactionHistory(this.responseText, currentAgentId));
            generatedHTML += interactionHistory(this.responseText, currentAgentId);
        } else {
            console.log('whoah there. readyState: ' + this.readyState + ' status: ' + this.status);
            console.log('error: ' + this.error);
        }
    };
    
    request.open('GET', requestURL);
    request.setRequestHeader('Authorization', 'bearer ' + '');
    request.setRequestHeader('Content-type', 'application/json');
    request.send();
    
    console.log('generated html: ' + generatedHTML);
    return generatedHTML;
    return '<div>sample text</div>';
}


function interactionHistory(result, agentId){
    result = JSON.parse(result);
    console.log('result.length: ' + result.agentStateHistory.length);
    let html = '';
    for (let i = 0; i < result.agentStateHistory.length; i++){
        html += '<div>';
            html += 'Agent State: ' + result.agentStateHistory[i].agentStateId;
            //console.log('Agent State: ' + result.agentStateHistory[i].agentStateId);
        html += '</div>'
    }
    
    console.log('html: ' + html);
    document.getElementById(agentId + 'card-body').innerHTML += html;
    return html;
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