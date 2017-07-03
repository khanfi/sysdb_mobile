
var ss_Obj = {};

// Login service
var ajaxLoginService = function (ssObj) {
    console.log('login.js- ajaxLoginService ' +
        ' Login ID:' + ssObj.ssValue.username +
        ' Login password:' + ssObj.ssValue.password+
        ' URL:'+ssObj.url
    ); 
    $.ajax({
        cache: false,
        url: ssObj.url,
        dataType: "text",
        method: "GET",
        username: ssObj.ssValue.username,
        password: ssObj.ssValue.password,
        error: function (err) {
            console.log('login.js- ajaxLoginService, Login err: ' + JSON.stringify(err));
            myApp.alert('Error during login. Please try again. Error code: ' + err,
                function () {
                    mainView.router.loadPage('login.html');
                });

        },
        success: function (response) { loginSuccess(response); }
    });
};

// Success function after logging in.
function loginSuccess(xx) {
    //console.log('request performed: '+xx.employees.firstName);
    console.log('login.js- Ajax returned: ' + JSON.stringify(xx));
    myApp.alert('Returned: ' + xx, function () {
        // Go back on main View
        mainView.router.back();
    });
}

// Get keys from secure storage to login
var startLoginServe = function () {
    ss_Obj.ssMethod = "getSS";
    ss_Obj.ssKey = "key";
    sStorage(loginCallback, ss_Obj);
    console.log("login.js- startLoginServe trying to login");
};

// Callback: check that we have the keys and then login
var loginCallback = function (ssObj) {
    if (ssObj.cbStatus === true) {
        console.log("login.js- loginCallback, got username and password");
        ajaxLoginService(ssObj);
    }
    else {
        // Load page from login.html file to main View:
        console.log("login.js- loginCallback, loading login.html");
        mainView.router.loadPage('login.html');
    }
};

// Callback: check that we have the keys and then Remove username and password
var removeLogin = function (ssObj) {
    if (ssObj.cbStatus === true) {
        console.log("login.js- removeLogin callback, granted");
        //logout
        ajaxLoginService(ss_Obj);
        myApp.alert('Username and Password removed', function () {
            mainView.router.back();
        });
    }
    else {
        // Load page from login.html file to main View:
        console.log("login.js- removeLogin callback, can't remove username and password, may already be removed");
    }
};

// Sign or remove login id or close page
myApp.onPageInit('login', function (page) {
    var pageContainer = $$(page.container);

    // Sign in now
    pageContainer.find('.sign-in').on('click', function () {
        var username = pageContainer.find('input[name="username"]').val();
        var password = pageContainer.find('input[name="password"]').val();
        ss_Obj.url = "https://test3.voith.net/vpn-od-poc"; // loginURL
        ss_Obj.ssMethod = "setSS"; // saving to secure storage
        ss_Obj.ssKey = "key"; // name of the key
        ss_Obj.ssValue = JSON.parse('{"username":"' + username + '","password":"' + password + '"}');
        console.log('login.js- ID:' + ss_Obj.ssValue.username + " PW:" + ss_Obj.ssValue.password);

        if (secureStorageAvailable === true) {
            sStorage(startLoginServe, ss_Obj);
            console.log("login.js- using SecureStorage");
        }
        else if (secureStorageAvailable === false) {
            console.log("login.js- SecureStorage is not available, logging in now");
            ajaxLoginService(ss_Obj);
        }
        else {
            console.log("login.js- SecureStorage has a problem");
        }
    });

    // Remove username and password
    pageContainer.find('.remove-sign-in').on('click', function () {
        ss_Obj.url = "log out url"; // loginURL
        ss_Obj.ssMethod = "removeSS"; // remove from secure storage
        ss_Obj.ssKey = "key";
        sStorage(removeLogin, ss_Obj);
        console.log("login.js- remove-sign-in. Requesting to remove login and password");
    });

    // Close login
    pageContainer.find('.close-login').on('click', function () {
        console.log("login.js- closing login page");
        // Go back on main View
        mainView.router.back();
    });
});




