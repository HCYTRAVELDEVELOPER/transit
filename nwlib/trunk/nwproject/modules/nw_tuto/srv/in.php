<?php
if (!session_id())
    session_start();
?>
<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>
<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js?v=0.0.0.1'></script>
<script type='text/javascript' src='/nwlib6/nwproject/js/main.js?v=0.0.0.1'></script>
<script>
    __nwMakerWorkOut = true;
    function getGET() {
        return <?php echo json_encode($_GET); ?>;
    }
    document.addEventListener("DOMContentLoaded", function (e) {
        var get = getGET();
        if (location.host != "localhost") {
            if (location.ancestorOrigins.length == 0) {
                //                    top.location.href = "http://www.google.com";
            } else {
                if (location.ancestorOrigins[0] != get.origin) {
                    //                        top.location.href = "http://www.google.com";
                }
            }
        }
        var pr = {};
        pr.typenw = "nwtutoLoaded";
        window.parent.postMessage(pr, '*');
    });
//    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
//    var eventer = window[eventMethod];
//    var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
//    eventer(messageEvent, function (e) {
//        console.log("frame inside received messageEvent");
//        if (e.data.func == "loaddata") {
//            loadData(e.data);
//        }
//        if (e.data.func == "savedata") {
//            savedata(e.data);
//        }
//    });
    window.addEventListener('message', function (e) {
        if (~e.origin.indexOf('http://yoursite.com')) {
            //            console.log(e.data);
        } else {
            //            console.log("no puede");
        }
        if (e.data.func == "loaddata") {
            loadData(e.data);
        }
        if (e.data.func == "savedata") {
            savedata(e.data);
        }
    });
    function loadData(data) {
        var da = {};
        da.tuto = data.id;
        da.adm = data.adm;
        var rpc = {};
        rpc["service"] = "nwtuto";
        rpc["method"] = "consuNwTuto";
        rpc["data"] = da;
        console.log(da);
        var func = function (r) {

            console.log("tuto loadData", r);
            if (r === false) {
//                window.parent.postMessage({"typenw": "nwtuto"}, '*');
                window.parent.postMessage(false, '*');
                return;
            }
            if (r !== true) {
                var pr = {};
                if (typeof r.rows !== "undefined")
                    pr.rows = r.rows;
                pr.enc = r.enc;
                pr.typenw = "nwtuto";
                window.parent.postMessage(pr, '*');
            }
        };
        rpcNw("rpcNw", rpc, func);
        return;
    }
    function savedata(data) {
        var rpc = {};
        rpc["service"] = "nwtuto";
        rpc["method"] = "saveNwTuto";
        rpc["data"] = data;
        var func = function (r) {
            console.log(r);
            if (r == true) {
                var pr = {};
                pr.typenw = "nwtutosok";
                window.parent.postMessage(pr, '*');
            }
        };
        rpcNw("rpcNw", rpc, func);
    }
</script>