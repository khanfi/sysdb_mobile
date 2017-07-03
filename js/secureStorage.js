// secureStorage.js is used with the cordova pluging here https://www.npmjs.com/package/cordova-plugin-secure-storage
// Add the plugin to your config file
// Documentation is found there as well.
// The browser platform is supported as a mock only. Key/values are stored unencrypted in localStorage.  
// use window.localStorage.clear(); to clear localStorage.
var secureStorage;
var secureStorageAvailable;
var ssNameSpaceStorage = "my_App";

///////////////////////////////////////////////////////////////////	
// Create a namespaced storage
// Secure Storage is available after Success of secureStorage
function createSS() {
    try {
        secureStorage = new cordova.plugins.SecureStorage(
            function () {
                console.log('secureStorage.js- Success: ' + secureStorage.service);
                //SampleSecureStorage();
                secureStorageAvailable = true;
                startLoginServe();

            },
            function (error) { console.log('Error ' + error); },
            ssNameSpaceStorage);
    } catch (error) {
        secureStorageAvailable = false;
        console.log("secureStorage.js- Cordova plugin not supported. Login will not be stored error: " + secureStorage);
    }
}

///////////////////////////////////////////////////////////////////	
// Secure Storage Methods are as follows: setSS, getSS, removeSS, getAllSS, clearAllSS
var sStorage = function (callback, ssObj) {
    switch (ssObj.ssMethod) {
        //Set a key/value in the storage.
        case 'setSS':
            secureStorage.set(
                function (key) {
                    console.log('secureStorage.js- setSS Success: ' + key);
                    ssObj.ssKey = key;
                    ssObj.cbStatus = true;
                    callback(ssObj);
                },
                function (error) {
                    console.log('secureStorage.js- setSS Error: ' + error);
                    ssObj.cbStatus = false;
                    callback(ssObj);
                },
                ssObj.ssKey, JSON.stringify(ssObj.ssValue));
            break;
        //Get a key's value from the storage
        case 'getSS':
            secureStorage.get(
                function (value) {
                    console.log('secureStorage.js- getSS, Success: ' + value);
                    ssObj.ssValue = JSON.parse(value);
                    ssObj.cbStatus = true;
                    callback(ssObj);
                },
                function (error) {
                    console.log('secureStorage.js- getSS, Error: ' + error);
                    ssObj.cbStatus = false;
                    callback(ssObj);
                },
                ssObj.ssKey);
            break;
        //Remove a key from the storage.
        case 'removeSS':
            secureStorage.remove(
                function (key) {
                    console.log('secureStorage.js- removeSS Success: ' + key);
                    ssObj.ssKey = key;
                    ssObj.cbStatus = true;
                    callback(ssObj);
                },
                function (error) {
                    console.log('secureStorage.js- removeSS Error: ' + error);
                    ssObj.cbStatus = false;
                    callback(ssObj);
                },
                ssObj.ssKey);
            break;
        //Get all keys from the storage.
        case 'getAllSS':
            secureStorage.keys(
                function (keys) {
                    console.log('secureStorage.js- getAllSS keys ' + keys.join(', '));
                    ssObj.ssKey = keys.join(', ');
                    ssObj.cbStatus = true;
                    callback(ssObj);
                },
                function (error) {
                    console.log('secureStorage.js- getAllSS Error, ' + error);
                    ssObj.cbStatus = false;
                    callback(ssObj);
                });
            break;
        //Clear all keys from the storage.
        case 'clearAllSS':
            secureStorage.clear(
                function () {
                    console.log('secureStorage.js- clearAllSS Success: ');
                    ssObj.ssKey = null;
                    ssObj.cbStatus = true;
                    callback(ssObj);
                },
                function (error) {
                    console.log('secureStorage.js- clearAllSS Error: ' + error);
                    ssObj.cbStatus = false;
                    callback(ssObj);
                });
            break;
    }
    //Return new results in call back;
};

///////////////////////////////////////////////////////////////////	
// Sample- callback: This is the callback after sStorage is called and completed. Remove for production.
// ssObj.cbStatus will return true (success) or false (fails).
// ssObj.ssKey is the key name to what is pared to it.
// ssObj.ssValue is the returned value.
// ssObj.ssMethod is the method used.
var foo2 = function (ssObj) {
    console.log("secureStorage.js- sample callback" +
        "cbStatus:" + ssObj.cbStatus +
        " Key:" + ssObj.ssKey +
        " Value:" + ssObj.ssValue.username +" "+ssObj.ssValue.password+
        " Method:" + ssObj.ssMethod);
};


///////////////////////////////////////////////////////////////////	
// Sample- Secure Storage Call. Remove for production. 
// Make call only after you have created a namespaced storage
// foo2 is the call back name (call it anything you like). 
// Below are required for the following methods
// ssMethod: There are 5 possibilities
// setSS: used to set a string in ssValue (like user name and password).
// getSS: gets the value of your ssKey.
// removeSS: remove the value of your ssKey
// getAllSS: gets all keys.
// clearAllSS: clears all keys.

var SampleSecureStorage = function () {
    var ss_Obj = {};
    ss_Obj.ssMethod = "setSS";
    ss_Obj.ssKey = "key";
    // options for setSS
    ss_Obj.ssValue = [];
    ss_Obj.ssValue.push({ "username": "lars", 'password': '12345678' });
    // console.log("secureStorage.js- ss_Obj find Value Name:" + Object.keys(ss_Obj.ssValue));
    sStorage(foo2, ss_Obj);
};