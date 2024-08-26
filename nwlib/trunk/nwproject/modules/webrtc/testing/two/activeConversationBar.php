<script>
    document.addEventListener("DOMContentLoaded", function (e) {
        readNotifications();
        interval = setInterval(function () {
            readNotifications();
        }, 30000);
    });

    function readNotifications() {
        var get = <?php echo json_encode($_GET); ?>;
        var send = "";
        send += "user=" + get.user;
        send += "&apikey=" + get.apikey;
        send += "&term=" + get.term;
        var li = "/nwlib6/nwproject/modules/webrtc/testing/two/getConvers.php";
        var request = new XMLHttpRequest();
        request.open("POST", li, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(send);
        request.onload = function (e) {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    var ra = request.responseText;
                    var r = {};
                    r.tipo = "createConversationsBarRingow";
                    var x = 0;
                    if (ra !== "false") {
                        x = JSON.parse(ra);
                    }
                    var da = x;
                    var da = [];
                    for (var i = 0; i < x.length; i++) {
                        x[i].myuser = get.user;
                        da[i] = x[i];
                    }
                    r.all = da;
                    window.parent.postMessage(r, '*');
                } else {
                    console.error(request.statusText);
                }
            }
        };
        request.onerror = function (e) {
            console.error(request.statusText);
        };
    }
</script>