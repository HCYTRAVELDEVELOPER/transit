var nwrct = false;
var nwrctin = new initialNwRtc();
nwrctin.constructor();

function initialNwRtc() {
    this.constructor = constructor;
    this.activeNotificationsByUser = activeNotificationsByUser;
    this.activeConversationBar = activeConversationBar;
    this.startConversation = startConversation;

    function constructor() {
        if (document.body === null) {
            var intervnwrtva = setInterval(function () {
                if (document.body !== null) {
                    clearInterval(intervnwrtva);
                    activeNwRtc();
                }
            }, 500);
        } else {
            activeNwRtc();
        }
    }

    function activeNwRtc() {
        var query = document.getElementById("nwRtcMaker").src.match(/\?.*$/);
        query[0] = query[0].replace("?", "");
        var GET = query[0].split("&");
        var get = {};
        for (var i = 0, l = GET.length; i < l; i++) {
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        var protocol = "https:";
        var p = document.getElementById("nwRtcMaker").getAttribute("src");
        if (p.indexOf("https") === -1) {
            protocol = "http:";
        }
        var h = p.split(protocol);
        var hh = h[1].split("//");
        var hhh = hh[1].split("/");
        var dom = hhh[0];
        var domain = dom;
        var domainRingow = protocol + "//" + domain;
        var v = Math.floor((Math.random() * 100) + 1);
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.charset = 'UTF-8';
        js.src = domainRingow + "/nwlib6/nwproject/modules/webrtc/testing/two/js/apinwrct_load.js?v=" + v;
        js.id = 'nwRtcMaker';
        js.async = true;
        document.body.appendChild(js);
        js.onload = function () {
            nwrct = new nwRct();
            nwrct.start(get.terminal, get.key);
            if (typeof get.callback !== "undefined") {
                var fn = window[get.callback];
                if (typeof fn === 'function') {
                    fn();
                }
            }
        };
    }

    function startConversation(userone, usertwo, type, mode, isgroup, openForm, dataOpenForm, lienzo) {
        var intervnwrtva = setInterval(function () {
            if (nwrct !== false) {
                clearInterval(intervnwrtva);
                nwrct.startConversation(userone, usertwo, type, mode, isgroup, openForm, dataOpenForm, lienzo);
            }
        }, 500);
        if (nwrct !== false) {
            clearInterval(intervnwrtva);
            nwrct.startConversation(userone, usertwo, type, mode, isgroup, openForm, dataOpenForm, lienzo);
        }
    }
    function activeNotificationsByUser(user) {
        var intervnwrtva = setInterval(function () {
            if (nwrct !== false) {
                clearInterval(intervnwrtva);
                nwrct.activeNotificationsByUser(user);
            }
        }, 500);
        if (nwrct !== false) {
            clearInterval(intervnwrtva);
            nwrct.activeNotificationsByUser(user);
        }
    }
    function activeConversationBar(user, container) {
        var intervnwrtvab = setInterval(function () {
            if (nwrct !== false) {
                clearInterval(intervnwrtvab);
                nwrct.activeConversationBar(user, container);
            }
        }, 500);
    }
}
