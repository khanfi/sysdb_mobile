//----------------------------------------------------------------------------------
//		This is a sample app to show how to use the inAuthApp plugin
//		This is a work in progress so it is not finished.
//----------------------------------------------------------------------------------  

//var url1 = "https://voin-dev-gano.voith.net/xml/test.xml";
//var url2 = "https://itnappwss2t.voith.com/sites/mobile_app_store/allApps/appName/appConfig.xml";
//var url3 = "https://dev-mobileapps.voith.com/voii.mobileapptest/test.html";


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        //alert("deviceready");
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event




    //----------------------------------------------------------------------------------
    //		This starts up the inAppAuth and gives feed back on the status
    //		alerts can be commented for production code
    //      **optional you can test your code with the "Voith PGD" App, the inAppAuth is installed.
    //		see Lars Johnson for questions**
    //----------------------------------------------------------------------------------  
    receivedEvent: function () {
        "use strict";

        //alert("Type of : window.VoithIT.InAppAuth " + typeof (window.VoithIT.InAppAuth));
        //fnInAppAuthStartup(app.successCert);
        fnInAppAuthStartup(document.getElementById("divCert"), app.successCert);

    },
    //successCert: function (objAdapter, certSubject) {
    //    "use strict";
    //    alert("cert recieved certSubject-" + certSubject + "objAdapter-" + objAdapter);

    //}
    successCert: function (objAdapter, certSubject) {
        // localStorage.setItem("CURRENTUSEROBJECT", certSubject);
        try {
            myApp.closeModal('.login-screen');
            //alert(mainView.activePage.name);        
        }
        catch (ex) {
            alert(ex.message + " --- " + ex.stack);
        }
    },
    httpSuccess: function (data, statusCode, headers) {
        //alert(result);

    }

};


