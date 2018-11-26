var application = "Call_Logger";
var consumer_key = "3MVG9KsVczVNcM8yZosqFDx.WpTcrPTukjC3xgmkPxRtq7eHB1P5EWeCeJhmbMq4RbuGTitgyksIr9Gr5KIQf";
var client_id = "InContact_API@Ivan_Klus";
var auth_url = "https://login.salesforce.com/services/oauth2/authorize";
var responce_type = "token";
var redirect_uri = "https://ivankl.us/incontact_call_logger";
var state_object = "mystate";


function redirectToSalesforceAuth() {
    var url = auth_url;
    url = url + "?state=" + state_object;
    url = url + "&response_type=" + responce_type;
    url = url + "&client_id=" + encodeURIComponent(consumer_key);
    url = url + "&redirect_uri=" + encodeURIComponent(redirect_uri);
    console.log(url);
    window.location.href = url;
}

