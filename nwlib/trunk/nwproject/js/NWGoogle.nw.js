/* ************************************************************************
 
 Copyright:
 2017 Grupo NW S.A.S, https://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to work on Google Login
 
 ************************************************************************ */
var NWGoogle = function () {

    this.url = "https://apis.google.com/js/api.js";
    this.api_key = 'AIzaSyANioRYIGLPZU6_ZF83K2HA6z-lvJspOJY';
    this.client_id = '187735317725-rnv6f4u1eds9om4ku5gsnfntbb27bf6e.apps.googleusercontent.com';

    this.start = function (parent) {
        var html = "";
        html += "<div id='nw-google-api-button' class='nw-google-api-button' onclick='javascript: handleSignInClick()'>";
        html += "<img  src='/nwlib6/icons/logo_google.svg' />";
        html += "<span>" + str("Registrarse con Google") + "</span>";
        html += "<center>";
        html += "</center>";
        html += "</div>";
        $(".titleencloginmaker_one").after(html);
        this.loadGoogleApi();
    };

    this.setApiKey = function (api_key) {
        this.api_key = api_key;
    };

    this.getApiKey = function () {
        return this.api_key;
    };

    this.setClientId = function (client_id) {
        this.client_id = client_id;
    };

    this.handleClientLoad = function () {
        var self = this;
        gapi.load('client:auth2', function () {
            gapi.client.init({
                apiKey: self.api_key,
                discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
                clientId: self.client_id,
                scope: 'profile'
            }).then(function () {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        });
    };

    this.loadGoogleApi = function () {
        var self = this;
        var a = document.createElement("script");
        a.type = "text/javascript";
        a.charset = "UTF-8";
        a.async = "async";
        a.src = this.url;
        a.id = "nw-google-api";
        a.onreadystatechange = function () {
            if (this.readyState === 'complete') {
                this.onload();
            }
        };
        a.onload = function () {
            self.handleClientLoad();
        };
        document.getElementsByTagName('head')[0].appendChild(a);
    };

    updateSigninStatus = function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            makeApiCall();
        }
    };

    handleSignInClick = function handleSignInClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    };

    makeApiCall = function makeApiCall() {
        gapi.client.people.people.get({
            'resourceName': 'people/me',
            'requestMask.includeField': 'person.names,person.emailAddresses,person.phoneNumbers'
        }).then(function (response) {
            if (typeof response.result != 'undefined') {
                if (typeof response.result.emailAddresses[0] != 'undefined') {
                    if (typeof response.result.emailAddresses[0].value != 'undefined') {
                        $("#usuario").val(response.result.emailAddresses[0].value);
                        $("#clave").val(response.result.resourceName);

                        if ($("#nombre").length) {
                            $("#nombre").val(response.result.names[0].givenName);
                        }
                        if ($("#apellido").length) {
                            $("#apellido").val(response.result.names[0].familyName);
                        }
                        if ($("#email").length) {
                            $("#email").val(response.result.emailAddresses[0].value);
                        }
                        if ($("#clave_registro").length) {
                            $("#clave_registro").val(response.result.resourceName);
                        }
                        if ($("#celular").length) {
                            if (typeof response.result.phoneNumbers != 'undefined') {
                                if (response.result.phoneNumbers.length > 0) {
                                    $("#celular").val(response.result.phoneNumbers[0]);
                                }
                            }
                        } 
//                        else {
//                            $("#button_nw").click();
//                            return;
//                        }
//
//                        $(".button_aceptar_cuenta_maker").click();
                    }
                }
            }
//            console.log('Hello, ' + response.result.names[0].givenName);
        }, function (reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    };
};