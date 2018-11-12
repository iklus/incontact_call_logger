// function callReasonOnclick(){
//     document.getElementById("callReasonDropdown").classList.toggle("show");
// }

// function salesforceOrganizationOnclick(){
//     document.getElementById("salesforceOrganizationDropdown").classList.toggle("show");
// }

// function salesforceContactOnclick(){
//     document.getElementById("salesforceContactDropdown").classList.toggle("show");
// }

// function phoneNumberDropdownOnclick(){
//     document.getElementById("phoneNumberDropdown").classList.toggle("show");
// }





let bearer = '';
function sampleGetAgentStatus() {
    var agentId = 6896120;
    let updatedSince = new Date(Date.now());
    updatedSince.setDate(updatedSince.getDate()-1);
    updatedSince = updatedSince.toISOString();
    getAgentContactStatusPayload = {
        'updatedSince': updatedSince,
        //'updatedSince': '2018-11-11T16%3A53%3A27.680Z',
        'fields': 'agentId, agentStateId, firstName, lastName, lastUpdateTime, teamName'
    }

    $.ajax({
        //The baseURI variable is created by the result.base_server_base_uri,
        //which is returned when getting a token and should be used to create the URL base
        'url': 'https://api-c12.incontact.com/InContactAPI/' + 'services/v12.0/agents/states',
        'type': 'GET',
        'headers': {
            'Authorization': 'bearer ' + bearer,
            'content-Type': 'application/x-www-form-urlencoded'
        },
        'data': getAgentContactStatusPayload,
        'success': function (result, status, statusCode) {
            getAgentStates(result, status, statusCode);
        },
        'error': function (XMLHttpRequest, textStatus, errorThrown) {
            console.log('error' + errorThrown);
            return false;
        }
    });
}





var html = '';
function getAgentStates(result, status, statusCode) {
        var agentStatus = result;
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
                                    html += '<div class="col-3">' + secondsToTime(Math.floor((currTime-newDate.getTime())/10000)) + '</div>';
                                    html += '<div class="col-1 status' + agentStatus.agentStates[i].agentStateId + '">' + agentStatus.agentStates[i].agentStateId + '</div>';
                                html += '</div>'; //row
                            html += '</button>';
                        html += '</h5>';
                    html += '</div>'; //card header
                
                    //card body
                    html += '<div id="collapse' + currentAgentId + '" class="collapse hide" aria-labelledby="heading' + currentAgentId + '" data-parent="#accordion">';
                        html += '<div id="' + currentAgentId + 'card-body" class="card-body">'
                        html += '</div>';
                    html += '</div>';
                html += '</div>';
            }
        }

        document.getElementById('testGeneratedHTML').innerHTML = html;
        html ='';
        createAccordionBodies();
}





function createAccordionBodies(){
    let elements = document.getElementsByClassName('card-body');
    timer();
    for (let i = 0; i < elements.length; i++){
        let agentId = elements[i].id.substring(0, elements[i].id.indexOf('c'));
        testXMLHttp(agentId);
    }
}





function testXMLHttp(currentAgentId){
    let requestURL = 'https://api-c12.incontact.com/InContactAPI/' + 'services/v12.0/agents/' + currentAgentId + '/state-history';
    let endDate = new Date(Date.now());
    let startDate = new Date(Date.now());
    startDate.setDate(startDate.getDate() - 4);
    startDate = startDate.toISOString();
    endDate = endDate.toISOString();
    startDate = toFormattedDate(startDate);
    endDate = toFormattedDate(endDate); 

    requestURL += `?startDate=${startDate}`; //+ '2018-10-23T08%3A00%3A00.000Z';
    requestURL += `&endDate=${endDate}`; //+ '2018-10-26T08%3A00%3A00.000Z';
    requestURL += '&fields=' + 'stateIndex%2C%20startDate%2C%20agentStateId%2C%20agentStateName%2C%20agentSessionId%2C%20duration%2C%20fromAddress%2C%20toAddress';
    
    //trying to fill in dropdowns
    let getAgentContactHistoryPayload = {
        'agentId': currentAgentId,
        'startDate': '2018-10-23T08:00:00.000Z', 
        'endDate': '2018-10-30T08:00:00.000Z',
        'fields': 'stateIndex, startDate, agentStateId, agentStateName, agentSessionId, duration, fromAddress, toAddress'
    }
    
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            interactionHistory(this.responseText, currentAgentId);
        } else {
            console.log('whoah there. readyState: ' + this.readyState + ' status: ' + this.status);
            console.log('error: ' + this.error);
        }
    };
    
    request.open('GET', requestURL);
    request.setRequestHeader('Authorization', 'bearer ' + bearer);
    request.setRequestHeader('Content-type', 'application/json');
    request.send();
}



function toFormattedDate(date){
    let newDateString = '';
    for (let i = 0; i < date.length; i ++){
        if (date.charAt(i) == ':'){
            newDateString += '%3A';
        } else {
            newDateString += date.charAt(i);
        }
    }
    return newDateString;
}




function interactionHistory(result, agentId){
    result = JSON.parse(result);
    result = sortBySessionId(result);
    let html = '';
    for (let i = 0; i < result.agentStateHistory.length; i++){
        if (result.agentStateHistory[i].agentStateId != undefined){
            //if it's the first entry, or the sessionId, stateId, or incoming caller changed
            html += '<div class="row">';
            if ((i==0) || (i > 0 && ((result.agentStateHistory[i].agentSessionId != result.agentStateHistory[i-1].agentSessionId) || (result.agentStateHistory[i].agentStateId != result.agentStateHistory[i-1].agentStateId) || (result.agentStateHistory[i].fromAddress != result.agentStateHistory[i-1].fromAddress)))){
                html += '<div class="col-2">';
                    html += 'Agent State: ' + result.agentStateHistory[i].agentStateName;
                html += '</div>';

                html += '<div class="col-5">';
                    let date = new Date(result.agentStateHistory[i].startDate);
                    html += date.toUTCString();
                html += '</div>';

                html += '<div class="col-3">';
                    html += 'Duration: ' + secondsToTime(result.agentStateHistory[i].duration);
                html += '</div>';

                html += '<div class="col-2">';
                    if (result.agentStateHistory[i].fromAddress != null){
                        html += 'Caller: ' + result.agentStateHistory[i].fromAddress.substring(0, 3) + '-' + result.agentStateHistory[i].fromAddress.substring(3, 6) + '-' + result.agentStateHistory[i].fromAddress.substring(6);
                    }
                html += '</div>';
            } else {
                html += '<div class="col-2">';
                    html += 'Agent State: ' + result.agentStateHistory[i].agentStateName;
                html += '</div>';

                //Will this update date when it shouldn't
                html += '<div class="col-5">';
                    let date = new Date(result.agentStateHistory[i].startDate);
                    html += date.toUTCString();
                html += '</div>';


                html += '<div class="col-3">';
                    //make duration cummulative as long as state/session/caller stay same
                    result.agentStateHistory[i].duration += result.agentStateHistory[(i-1)].duration; 
                    html += 'Duration: ' + secondsToTime(result.agentStateHistory[i].duration);
                    
                    //remove previous element ... could also try editing the inner html
                    setTimeout(function(){
                        document.getElementById(`${agentId}card-body`).removeChild(document.getElementById(`${agentId}card-body`).lastChild);
                    }, 1000);
                html += '</div>';


                html += '<div class="col-2">';
                    if (result.agentStateHistory[i].fromAddress != null){
                        html += 'Caller: ' + result.agentStateHistory[i].fromAddress.substring(0, 3) + '-' + result.agentStateHistory[i].fromAddress.substring(3, 6) + '-' + result.agentStateHistory[i].fromAddress.substring(6);
                    }
                html += '</div>';
            }
            html += '</div>'
            document.getElementById(agentId + 'card-body').innerHTML += html;
            html = '';
        }
    }
    
    return html;
}





function sortBySessionId(response){
    response.agentStateHistory.sort(function(a, b){
        return b.agentSessionId-a.agentSessionId || b.stateIndex - a.stateIndex;
    });
    
    return response;
}





//time functions to use with duration
function secondsToTime(totalSeconds){
    let years = Math.floor(totalSeconds/31536000);
    totalSeconds %= 31536000;
    let days = Math.floor(totalSeconds/86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds/3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds/60);
    totalSeconds %= 60;
    if (years > 0){
        return (`${years}:${days}:${hours}:${minutes}:${totalSeconds}`);
    } else if (days > 0){
        return (`${days}:${hours}:${minutes}:${totalSeconds}`);
    } else{
        return (`${hours}:${minutes}:${totalSeconds}`);
    }
}





function timeToSeconds(time){
    let splitTime = time.split(':');
    let seconds = 0;

    if (splitTime.length > 5){
        return 'unknown';
    }

    for (let i = 0; i < splitTime.length; i++){
        if (i == 0){ //seconds
            seconds += parseInt(splitTime[splitTime.length-1]);
        } else if (i == 1){ //minutes
            seconds += parseInt(splitTime[splitTime.length-2] * 60);
        } else if (i == 2){ //hours
            seconds += parseInt(splitTime[splitTime.length-3] * 3600);
        } else if (i == 3){ //days
            seconds += parseInt(splitTime[splitTime.length-4] * 86400);
        } else if (i == 4){ //years (not including leap)
            seconds += parseInt(splitTime[splitTime.length-5] * 31536000);
        }
    }
    return seconds;
}





function addTwoTimes(time1, time2){
    let totalSeconds = timeToSeconds(time1);
    totalSeconds += timeToSeconds(time2);
    return secondsToTime(totalSeconds);
}





function timer(){
    let elements = document.getElementsByClassName("btn btn-link");
    let count = 0;
    setInterval(function(){
        if (count == 4){
            getAgentContactStatusPayload = {
                'updatedSince': '2018-10-29T14:07:19-04:00',
                'fields': 'agentId, agentStateId, firstName, lastName, lastUpdateTime, teamName'
            }
        
            $.ajax({
                //The baseURI variable is created by the result.base_server_base_uri,
                //which is returned when getting a token and should be used to create the URL base
                'url': 'https://api-c12.incontact.com/InContactAPI/' + 'services/v12.0/agents/states',
                'type': 'GET',
                'headers': {
                    'Authorization': 'bearer ' + bearer,
                    'content-Type': 'application/x-www-form-urlencoded'
                },
                'data': getAgentContactStatusPayload,
                'success': function (result, ) {
                    updateAgentStatus(result);
                },
                'error': function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log('error' + errorThrown);
                    return false;
                }
            });
            count = 0;
        }
        for (let i = 0; i < elements.length; i++){
            elements[i].children[0].children[2].innerText = addTwoTimes(elements[i].children[0].children[2].innerText, '00:00:01');
        }
        count++;   
    }, 1000);
}





function updateAgentStatus(fullResult){
    let result = fullResult.agentStates.filter(team => team.teamName == 'SL Client Services');
    console.log(result);
    
    // for (let h = 0; h < fullResult.length; h++){
    //     if (fullResult.agentStates[h].teamName == 'SL Client Services'){
    //         result += fullResult.agentStates[h];
    //     }
    // }

    let elements = document.getElementById('testGeneratedHTML').getElementsByClassName("btn btn-link");;
    for (let i = 0; i < elements.length; i++){
        //let agentId = elements[i].parentNode.nextElementSibling.id.substring(elements[i].parentNode.nextElementSibling.id.indexOf('e') + 1);
        //console.log(elements[i].children[0]);
        let agentName = elements[i].children[0].children[0].innerText.split(' ');
        if (agentName[0] == result[i].firstName && agentName[0] == result[i].lastName && elements[i].children[0].children[3].innerText !== result[i].agentStateId){
            elements[i].children[0].children[3].innerText = result[i].agentStateId;
            elements[i].children[0].children[3].className = `col-1 status${result[i].agentStateId}`;
            elements[i].children[0].children[2].innerText = '0:0:0';
            console.log('agentState changed!');
            console.log(elements[i].children[0].children[3].innerHTML);
            console.log('elements[i].children[0].children[3].innerText: ' + elements[i].children[0].children[3].innerHTML);
            //console.log('result.agentStates[i].agentStateId: ' + result.agentStates[i].agentStateId);
        } else {
            console.log('agentState didnt change');
        }
        //elements[i].children[0].children[2].innerText = addTwoTimes(elements[i].children[0].children[2].innerText, '00:00:01');
    }

}