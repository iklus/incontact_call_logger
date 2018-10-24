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
    let xmlhttp = new XMLHttpRequest();
    let txt = '';
    xmlhttp.overrideMimeType("application/json");
    xmlhttp.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            if (document.getElementById("phoneNumberDropdown").childElementCount < 2){                
                var response = JSON.parse(this.responseText);
                console.log(response);
                response.contactList.contactStates.forEach(function(call){
                    txt += '<option>' + call.fromAddr + '</option>';
                });   
                console.log(txt);
                document.getElementById("phoneNumberDropdown").innerHTML = txt;
            }
        }
    }
    xmlhttp.open("GET", 'call_history.json', true);
    xmlhttp.send(null);
    document.getElementById("phoneNumberDropdown").classList.toggle("show");
}

/*window.onclick = function(event){
    document.getElementById("salesforceContactDropdown").classList.remove("show");
    document.getElementById("ssalesforceOrganizationDropdown").classList.remove("show");
    document.getElementById("callReasonDropdown").classList.remove("show");
}*/
