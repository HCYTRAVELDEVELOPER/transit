initialRingow();

function initialRingow() {
    var query = document.getElementById("nwchat2").src.match(/\?.*$/);
    query[0] = query[0].replace("?", "");
    var GET = query[0].split("&");
    var get = {};
    for (var i = 0, l = GET.length; i < l; i++) {
        var tmp = GET[i].split('=');
        get[tmp[0]] = unescape(decodeURI(tmp[1]));
    }
    var protocol = "https:";
    var p = document.getElementById("nwchat2").getAttribute("src");
    if (p.indexOf("https") == -1) {
        protocol = "http:";
    }
    var h = p.split(protocol);
    var hh = h[1].split("//");
    var hhh = hh[1].split("/");
    var dom = hhh[0];
    var domain = dom;
    var domainRingow = protocol + "//" + domain;
    var v = Math.floor((Math.random() * 100) + 1);
    var version = 1;
//    var s = document.querySelector("#nwchat2");
//    if (s) {
//        version = 1;
//    }
    if (navigator.mediaDevices) {
//        if (navigator.mediaDevices.getUserMedia) {
        version = 2;
//        }
    }
    version = 2;
    version = 3;
    if (version === 3) {
        version3();
    } else
    if (version === 1) {
        version1();
    } else {
        version2();
    }

    function version3() {
        var jrw = document.createElement('script');
        jrw.type = 'text/javascript';
        jrw.async = true;
        jrw.id = 'nwRtcMaker';
        jrw.src = domainRingow + "/ringowStart?id=" + get.id + "&key=" + get.key + "";
        var srw = document.getElementsByTagName('script')[0];
        srw.parentNode.insertBefore(jrw, srw);
    }
    function version1() {
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.charset = 'UTF-8';
        js.src = domainRingow + "/nwlib6/nwproject/modules/nw_chat2/js/nwchat_1.js?host=" + get.host + "&key=" + get.key + "&id=" + get.id + "&v=" + v;
        js.id = 'nwRtcMaker';
        js.async = true;
        document.body.appendChild(js);
    }

    function version2() {
        var js = document.createElement('script');
        js.type = 'text/javascript';
        js.charset = 'UTF-8';
        js.src = domainRingow + "/nwlib6/nwproject/modules/webrtc/testing/two/js/apinwrct_load.js?v=" + v + "&id=" + get.id + "&key=" + get.key + "&callback=startRingow";
        js.id = 'nwRtcMaker';
        js.async = true;
        document.body.appendChild(js);
    }
}