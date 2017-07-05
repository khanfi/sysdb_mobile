// Export selectors engine
var $$ = Dom7;

// Initialize your app
var myApp = new Framework7({
    modalTitle: 'SysDB Mobile',
    animateNavBackIcon: false,
    preloadPreviousPage: false,
});

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: true,
});

//var BaseURLWeb = "http://ndewebtest/voii.mobileapptest/api/sysdbmobile/"; // web
var BaseURLWeb = "https://vpvitterdevcon.voith.net/api/sysdbmobile/"; //vpn
var BaseURLApp = "https://vpvitterdevconvpn.voith.net/api/sysdbmobile/"; //vpn mobile test
//var BaseURLApp = "https://dev-mobileapps.voith.com/voii.mobileapptest/api/sysdbmobile/"; //mobile test
//var BaseURLApp = "https://mobileapps.voith.com/voithmobileapi/sys/api/sysdbmobile/"; //mobile prod
var ENV = "WEB"; //Switch between mobile app and web app (Set for web:WEB and mobile:APP)

if (ENV != "APP" && (myApp.device.iphone || myApp.device.ipad || myApp.device.android)) {
    ENV = "APP";
}
if (ENV == "WEB") {
    BaseURLApp = BaseURLWeb;
}

/*
Local Store Keys
*/
var APP_KEY = 'sysdb';
var APP_PROFILE = new Object();
APP_PROFILE.CurrentUser = APP_KEY + "_cUser";
APP_PROFILE.WindowsUser = APP_KEY + "_wUser";
APP_PROFILE.WindowsPass = APP_KEY + "_wPass";
APP_PROFILE.RegionalSummary = APP_KEY + "_RegionalSummary";
APP_PROFILE.Device = APP_KEY + "_Device";
APP_PROFILE.FavoriteDevices = APP_KEY + "_FavoriteDevices";

var APP_MESSAGE = new Object();
APP_MESSAGE.NetworkNotAbailable = "Network is not available.";
APP_MESSAGE.LoginFailed = "Login failed.";
APP_MESSAGE.UserNotFound = "User not found. Please Sign In.";

function getCurrentUser() {
    var cUser = localStorage.getItem(APP_PROFILE.CurrentUser);
    if (cUser != null && cUser != "") {
        var oUser = JSON.parse(cUser);
        return oUser;
    }
    else {
        cUser = new Object();
        cUser.UserID = 0;
    }
    return cUser;
}

var CurrentUser = getCurrentUser();

//myApp.onPageInit('index', function (e) {
//    if (typeof e != 'undefined' && e.from == "left")
//        return;

//    if (CurrentUser == null || CurrentUser.UserID == null || CurrentUser.UserID == '' || Number(CurrentUser.UserID) <= 0) {
//        myApp.mainView.router.loadPage('login.html');
//    }
//}).trigger();

function GetDataAndRender(urlAddress, fnRenderData, Arg1, sLocalStoreKey, username, password) {
    if (!((CurrentUser != null && CurrentUser.UserID != null && CurrentUser.UserID > 0) || (username != null && password != null))) {
        myApp.alert(APP_MESSAGE.UserNotFound);
    }
    else {
        myApp.showIndicator();
        if (sLocalStoreKey != null && localStorage.getItem(sLocalStoreKey) != null && localStorage.getItem(sLocalStoreKey) != '') {
            var result = JSON.parse(localStorage.getItem(sLocalStoreKey));
            fnRenderData(result, Arg1);
            myApp.hideIndicator();
        }
        if (navigator.onLine) {

            if (username == null) {
                var _user = localStorage.getItem(APP_PROFILE.WindowsUser);
                username = _user;
            }
            if (password == null) {
                var _pass = localStorage.getItem(APP_PROFILE.WindowsPass)
                password = _pass;
            }

            localStorage.setItem(APP_PROFILE.WindowsUser, username);
            localStorage.setItem(APP_PROFILE.WindowsPass, password);

            $.ajax({
                //username: username,
                //password: password,
                async: true,
                crossDomain: true,
                url: urlAddress,
                type: "GET",
                dataType: 'json',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + username));
                },
                success: function (result) {
                    //Save to Local Store
                    if (sLocalStoreKey != null)
                        localStorage.setItem(sLocalStoreKey, JSON.stringify(result));
                    fnRenderData(result, Arg1);
                    myApp.hideIndicator();
                },
                error: function (xhr, status, error) {
                    myApp.hideIndicator();

                    if (!navigator.onLine) {
                        myApp.alert(APP_MESSAGE.NetworkNotAbailable);
                    } else {
                        myApp.alert(error + '\n' + urlAddress);
                    }
                }
            });
        } else {
            myApp.alert(APP_MESSAGE.NetworkNotAbailable);
        }
    }
}

//$$('.close-panel').on('click', function (e) {
//    if (e.srcElement.tabIndex == 1) {
//        GetDeviceSummary(false);
//    }
//    else if (e.srcElement.tabIndex == 2) {
//        GetDeviceSummary(true);
//    }
//});

///* ===== Login screen page events ===== */
//myApp.onPageInit('login-screen-embedded', function (page) {
//    $$(page.container).find('.list-button').on('click', function () {
//        var username = $$(page.container).find('input[name="username"]').val();
//        var password = $$(page.container).find('input[name="password"]').val();
//        myApp.alert('Username: ' + username + ', password: ' + password, function () {
//            mainView.router.back();
//        });
//    });
//});

function setUser(result) {
    localStorage.setItem(APP_PROFILE.CurrentUser, JSON.stringify(result));
    CurrentUser = getCurrentUser();

    //localStorage.setItem(APP_PROFILE.WindowsUser, username);
    //localStorage.setItem(APP_PROFILE.WindowsPass, password);

    mainView.router.loadPage("index.html?ts=" + Date.now());
}

// In page events:
$$(document).on('pageInit', function (e) {
    // Page Data contains all required information about loaded and initialized page 
    var page = e.detail.page;

    switch (page.name) {
        case 'login':
            $$('.sign-in').on('click', function () {
                var username = $$("#lgnUserName").val();
                var password = $$("#lgnPassword").val();

                GetDataAndRender(BaseURLApp + "login", setUser, null, null, username, password);
                //var settings = {
                //    "username": username,
                //    "password": password,
                //    "async": true,
                //    "crossDomain": true,
                //    "url": BaseURLApp + "login",
                //    "method": "GET",
                //    "cashe": true,
                //    "headers": {
                //        //"cache-control":"no-cache"
                //    }
                //};
                //$.support.cors = true;
                //$.ajax(settings).done(function (result) {

                //    localStorage.setItem(APP_PROFILE.CurrentUser, JSON.stringify(result));
                //    CurrentUser = getCurrentUser();

                //    localStorage.setItem(APP_PROFILE.WindowsUser, username);
                //    localStorage.setItem(APP_PROFILE.WindowsPass, password);

                //    mainView.router.loadPage("index.html?ts=" + Date.now());
                //}).fail(function () {
                //    myApp.alert(APP_MESSAGE.LoginFailed);
                //});
            });
            break;
        case "RegionalSummary":
            if (page.from == "right")
                GetRegionalSummary();
            break;
        case "DeviceSummary":
            if (page.from == "right") {
                var isSearch = getParmFromUrl(page.url, "isSearch");
                if (isSearch == "true") {
                    //$$('#openLeftPanelLink').hide();
                    var pdeviceName = $$("input[name*='fDeviceName']").val();
                    var pdescription = $$("input[name*='fDeviceDescription']").val();
                    var pdeviceClass = $$("input[name*='fDeviceClass']").val();
                    var pdeviceModel = $$("input[name*='fDeviceModel']").val();
                    var pITorg = $$("input[name*='fITOrg']").val();
                    var pAdminTeam = $$("input[name*='fAdminTeam']").val();
                    var pLanSite = $$("input[name*='fLanSite']").val();
                    GetDeviceByFilter(pdeviceName, pdescription, pdeviceClass, pdeviceModel, pITorg, pAdminTeam, pLanSite);
                }
                else {
                    //$$('#openLeftPanelLink').show();
                    GetDeviceSummary(false);
                }
            }
            else {

                $$("#ulDevices").html(localStorage.getItem("devicePageSummaryStr"));//myApp.template7Data.devicePageSummary
            }
            break;
        case "DeviceTabs":
            var deviceId = getParmFromUrl(page.url, "ID");
            var deviceName = getParmFromUrl(page.url, "Name");
            var description = getParmFromUrl(page.url, "desc");
            $$("#hiddenInputDeviceID").val(deviceId);
            $$("#divNavbarTitle").html(deviceName);
            $$("#divSelectedDeviceInfo").html(description);
            //$$("#deviceName").html(deviceName);
            //$$("#deviceDescription").html(description);
            //localStorage.setItem("deviceName", deviceName);
            //localStorage.setItem("deviceDesc", description);
            GetDeviceTabs(deviceId, deviceName);
            break;
        case "DeviceTabDetails":
            var deviceID = $$("#hiddenInputDeviceID").val();
            var tabID = getParmFromUrl(page.url, "tabID");
            var tabName = getParmFromUrl(page.url, "tabName");
            var deviceName = getParmFromUrl(page.url, "deviceName");
            $$("#divNavbarDeviceTabDetail").html(deviceName);
            $$("#divSelectedTabName").html(tabName);

            //$$("#deviceNameForDeviceDetail").html(localStorage.getItem("deviceName"));//myApp.template7Data.Name
            //$$("#deviceDescriptionForDeviceDetail").html(localStorage.getItem("deviceDesc"));//myApp.template7Data.Description
            GetSelectedTabInfo(deviceID, tabID);
            break;
        case "DeviceSearch":
            //GetSearchData();
            break;
    }
})

function getParmFromUrl(url, parm) {
    var re = new RegExp(".*[?&]" + parm + "=([^&]+)(&|$)");
    var match = url.match(re);
    return (match ? match[1] : "");
}

function GetDeviceSummary(isFavoriteOnly) {
    var urlString = BaseURLApp + 'Getdevices?isFavoriteOnly=' + isFavoriteOnly + '&pUserID=' + CurrentUser.UserID;
    GetDataAndRender(urlString, RenderDevices, null, APP_PROFILE.FavoriteDevices + '_' + isFavoriteOnly);
}

function GetDeviceByFilter(pName, pDescription, pClass, pModel, pITorg, pAdminTeam, pLansite) {
    var urlString = BaseURLApp + 'GetDevicesByFilter?pDeviceName=' + pName + '&pDescription=' + pDescription + '&pDeviceClass=' + pClass + '&pDeviceModel=' + pModel + '&pRespITOrg=' + pITorg + '&pAdminTeam=' + pAdminTeam + '&pLansite=' + pLansite + '&pUserID=' + CurrentUser.UserID;
    GetDataAndRender(urlString, RenderDevices, null, null);
}

function RenderDevices(data) {
    localStorage.setItem("devices", "");
    if (data.length > 0)
        localStorage.setItem("devices", JSON.stringify(data));
    $$("#ulDevices").html('');
    var strHtml = '';

    $$.each(data, function (i) {
        var strFavorite = '';
        var isFavorite = data[i]["IsFavorite"];
        if (!isFavorite) {
            strFavorite = '&nbsp; <a id="linkFavorite' + data[i]["CI_ID"] + '" href="#" onclick="AddAsFavorite(' + data[i]["CI_ID"] + ',' + isFavorite + ')"><i id="favoriteIcon' + data[i]["CI_ID"] + '" class="icon toolbar-demo-icon-whiteStar-inline"></i></a>';
        }
        else {
            strFavorite = '&nbsp; <a id="linkFavorite' + data[i]["CI_ID"] + '" href="#" onclick="AddAsFavorite(' + data[i]["CI_ID"] + ',' + isFavorite + ')"><i id="favoriteIcon' + data[i]["CI_ID"] + '" class="icon toolbar-demo-icon-yellowStar-inline"></i></a>';
        }

        strHtml += '<li><a href="DeviceTabs.html?ID=' + data[i]["CI_ID"] + '&Name=' + data[i]["Name"] + '&desc=' + data[i]["Description"] + '" class="item-link">';
        strHtml += '<div class="item-content">';
        strHtml += '    <div class="item-media">';
        //strHtml += strFavorite;
        strHtml += '    </div>';
        strHtml += '    <div class="item-inner">'
        strHtml += '        <div class="item-title-row">'
        strHtml += '            <div class="item-title">' + data[i]["Name"] + '</div>';
        strHtml += '        </div>';
        strHtml += '        <div class="item-subtitle">' + data[i]["Lansite"] + ' | ' + data[i]["Organization"] + ' | ' + data[i]["LastChanged"] + '</div>';
        strHtml += '        <div class="item-after">' + data[i]["Description"];
        strHtml += strFavorite;
        strHtml += '        </div>';
        strHtml += '    </div>';
        strHtml += '</div>';
        strHtml += '</a></li>';
    });

    $$("#ulDevices").html(strHtml);
    localStorage.setItem("devicePageSummaryStr", strHtml);
}

function GetDeviceTabs(deviceId, deviceName) {
    var urlString = BaseURLApp + 'GetDeviceTabs?deviceID=' + deviceId + '&deviceName=' + deviceName;
    GetDataAndRender(urlString, RenderDeviceTabs, deviceName, APP_PROFILE.Device + '_' + deviceId);
}

function RenderDeviceTabs(data, deviceName) {
    var strHtml = '';
    for (var i = 0; i < data.length; i++) {
        strHtml += '<li>';
        strHtml += ' <a href="DeviceTabDetails.html?tabID=' + data[i]["id"] + '&tabName=' + data[i]["name"] + '&deviceName=' + deviceName + '" class="item-content item-link">';
        strHtml += '<div class="item-inner">'
        strHtml += '<div class="item-title">' + data[i]["name"] + '</div>';
        strHtml += '</div></a>';
        strHtml += '</li>'
    }
    $$("#ulDeviceTabs").html(strHtml);
}

function GetSelectedTabInfo(deviceID, tabID) {
    var urlString = BaseURLApp + 'GetTabInfoByDeviceIDAndTabID?deviceID=' + deviceID + '&tabID=' + tabID;
    GetDataAndRender(urlString, RenderTabInfo, null, APP_PROFILE.Device + '_' + deviceID + '_' + tabID);
}

function RenderTabInfo(data) {
    var strHtml = '';
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        strHtml += '<li class="accordion-item">';
        strHtml += ' <a href="#" class="item-content item-link">';
        strHtml += '<div class="item-inner">'
        strHtml += '<div class="item-title">' + obj[0]["Group"] + '</div>';
        strHtml += '</div></a>';
        for (var j = 0; j < obj.length; j++) {
            var objIterate = obj[j];
            strHtml += '<div class="accordion-item-content">';
            strHtml += '<div class="list-block">';
            strHtml += '<ul>';
            strHtml += '<li>';
            strHtml += '<div class="item-content">';
            strHtml += '<div class="item-inner">';
            strHtml += '<div class="item-text label">' + objIterate["FieldTitle"] + '</div>';
            strHtml += '<div class="item-subtitle">' + objIterate["Value"] + '</div>';
            //strHtml += '<input type="textarea" value=' + objIterate["Value"] + '></input></div>';
            //+ objIterate["Value"] + '</div>';
            strHtml += '</div>';
            strHtml += '</div>';
            strHtml += '</li>';
            strHtml += '</ul>';
            strHtml += '</div>';
            strHtml += '</div>';
        }
        strHtml += '</li>'
    }
    $$("#ulDeviceTabDetails").html(strHtml);
}

function GetRegionalSummary() {
    var urlString = BaseURLApp + 'GetDeviceRegionalSummary';
    GetDataAndRender(urlString, RenderRegionalSummary, null, APP_PROFILE.RegionalSummary);
}

function RenderRegionalSummary(data) {
    var strHtml = '';
    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        strHtml += '<li class="accordion-item">';
        strHtml += ' <a href="#" class="item-content item-link">';
        strHtml += '<div class="item-inner">' + data[i]["DeviceClass"] + '</div></a>';
        strHtml += '<div class="accordion-item-content">';
        strHtml += '<div class="content-block">';
        strHtml += '<div class="item-inner">';
        for (var key in obj) {
            if (key != "DeviceClass") {
                strHtml += '<div class="item-title">' + key + '</div>';
            }
        }
        strHtml += '</div>';
        strHtml += '<div class="item-inner">';
        for (var key in obj) {
            if (key != "DeviceClass") {
                var val = data[i][key] != "null" ? data[i][key] : 0;
                strHtml += '<div class="item-text">' + val + '</div>';
            }
        }
        strHtml += '</div>';
        strHtml += '</div>';
        strHtml += '</div>';
        strHtml += '</div>';
        strHtml += '</li>'
    }
    $$("#ulRegionalSummary").html(strHtml);
}

function GetSearchData() {
    var urlString = BaseURLApp + 'GetSearchData';
    GetDataAndRender(urlString, RenderRegionalSummary, null, null);
}

function AddAsFavorite(deviceID, isFavorite) {
    var isFavrt = !isFavorite;
    var deviceArray = new Array();
    deviceArray[0] = { 'deviceID': deviceID };
    deviceArray[1] = { 'isFavorite': !isFavorite };

    var favorite = isFavrt ? 'true' : 'false';

    var urlString = BaseURLApp + 'AddAsFavorite?pdeviceID=' + deviceID + '&pIsFavorite=' + favorite + '&pUserID=' + CurrentUser.UserID;
    GetDataAndRender(urlString, SetAsFavorite, deviceArray, null);

    //SaveAsFavorite(deviceID, isFavrt);
}

function SaveAsFavorite(deviceID, isFavorite) {

    //$$.ajax({
    //    url: BaseURLApp + 'AddAsFavorite?pdeviceID=' + deviceID + '&pIsFavorite=' + isFavorite,
    //    type: "GET",
    //    contentType: "application/json; charset=utf-8",
    //    success: function (data, status, xhr) {
    //        var result = JSON.parse(data);
    //        if (result) {
    //            var lstDevices = myApp.template7Data.devices;
    //            // iterate over each element in the array
    //            for (var i = 0; i < lstDevices.length; i++) {
    //                // look for the entry with a matching `code` value
    //                if (lstDevices[i].CI_ID == deviceID) {
    //                    // we found it
    //                    lstDevices[i].IsFavorite = isFavorite;
    //                }
    //            }

    //            RenderDevices(lstDevices);

    //            //var strIconID = 'favoriteIcon' + deviceID;
    //            //var strLinkID = '#linkFavorite' + deviceID;

    //            //$$(strLinkID).on('click', 'AddAsFavorite(' + deviceID + ',' + isFavorite + ')');

    //            //document.getElementById(strLinkID).onclick = "AddAsFavorite(" + deviceID + "," + isFavorite + ")";

    //            //if (isFavorite) {
    //            //    document.getElementById(strIconID).className = "icon toolbar-demo-icon-yellowStar-inline";
    //            //}
    //            //else {
    //            //    document.getElementById(strIconID).className = "icon toolbar-demo-icon-whiteStar-inline";
    //            //}
    //        }
    //    },
    //    error: function (err) {
    //        console.log(err);
    //    }
    //});
}

function SetAsFavorite(data, deviceArray) {
    var result = data;
    if (result) {

        var lstDevices = JSON.parse(localStorage.getItem("devices"));//myApp.template7Data.devices;
        // iterate over each element in the array
        for (var i = 0; i < lstDevices.length; i++) {
            // look for the entry with a matching `code` value
            if (lstDevices[i].CI_ID == deviceArray[0].deviceID) {
                // we found it
                lstDevices[i].IsFavorite = deviceArray[1].isFavorite;
            }
        }

        RenderDevices(lstDevices);
    }
}

function ScanCode() {
    //cordova.plugins.barcodeScanner.scan(
    //function (result) {
    //    alert("We got a barcode\n" +
    //          "Result: " + result.text + "\n" +
    //          "Format: " + result.format + "\n" +
    //          "Cancelled: " + result.cancelled);
    //},
    //function (error) {
    //    alert("Scanning failed: " + error);
    //}
    //);
}
