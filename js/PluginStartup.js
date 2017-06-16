var fInAppAuthStartedUp = false;
function fnInAppAuthStartup(eContainer, fnContinue) {
    var oAdapter = null;
    function fnTry(fn) {
        try {
            return fn();
        }
        catch (ex) {
            window.alert(ex.message + "\r\n\r\n" + ex.stack);
        }
    }
    function fnOnError(sErrorText) {
        window.alert("InAppAuth error: " + sErrorText);
    }
    function fnObtainIdentity(fnCheckAfter) {
        myApp.popup('.login-screen');
        //var e1 = document.createElement("div");
        //var e2 = document.createElement("div");
        //var e3 = document.createElement("input");
        //var e4 = document.createElement("div");
        //var e5 = document.createElement("input");
        var e6 = document.getElementById("submit_btn");
        //e1.appendChild(e2);
        //e1.appendChild(e3);
        //e1.appendChild(e4);
        //e1.appendChild(e5);
        //e1.appendChild(e6);
        //e2.textContent = "Cert Path:";
        //e3.type = "text";
        //e3.setAttribute("autocapitalize", "none");
        //e3.setAttribute("autocomplete", "off");
        //e3.setAttribute("autocorrect", "off");
        //e4.textContent = "Passcode:";
        //e5.type = "password";
        //e6.type = "button";
        //e6.value = "Submit";
        e6.addEventListener(
          "click",
          fnTry.bind(null, function () {
              //alert("Get addEventListener");
              oAdapter.obtainIdentity(
                document.getElementById("certURL").value,
                document.getElementById("password").value,
                fnTry.bind(null, function () { fnCheckAfter(); }),
                fnOnError);
          }),
          false);
        //eContainer.appendChild(e1);
    }
    var fUICreated = false;
    fnTry(function () {
        function fnCheckCertSubject() {
            oAdapter.getCertSubject(
              function (sCertSubject) {
                  fnTry(function () {
                      if (sCertSubject != null)
                          fnContinue(oAdapter, sCertSubject);
                      else if (!fUICreated) {
                          fnObtainIdentity(fnCheckCertSubject);
                          fUICreated = true;
                      }
                  });
              },
              fnOnError);
        }
        if (!fInAppAuthStartedUp) {
            window.VoithIT.InAppAuth.createAdapter(
              "Basic",
              function (oAdapter_) {
                  oAdapter = oAdapter_;
                  fnTry(fnCheckCertSubject);
              },
              fnOnError,
              { persistRefPath: "Library/VoithIT#CC5F02AA-3D01-43AF-95E3-EF17D140B58E" });
            fInAppAuthStartedUp = true;
        }
        else if (oAdapter != null)
            fnCheckCertSubject();
    });
}
