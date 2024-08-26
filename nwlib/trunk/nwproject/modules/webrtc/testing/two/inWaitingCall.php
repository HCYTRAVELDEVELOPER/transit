<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://www.facebook.com/2008/fbml"
      xmlns:og="http://ogp.me/ns#"
      xml:lang="es-ES" >
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <title>Waiting call</title>
        <style>
            body {
                position: relative;
                font-size: 12px;
                font-family: arial;
            }
            .btn {
                line-height: 10;
                font-size: 20px;
                background: #25ab25;
                color: #fff;
                padding: 10px;
                display: block;
                margin: 10px 0;
                cursor: pointer;
                border-radius: 5px;
                box-sizing: border-box;
                text-align: center;
                position: relative;
            }
            .btn:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h2 class="btn" onclick="goBack()">
            Volver al chat
        </h2>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                var domain = location.origin;
                var type = "<?php echo $_GET["type"]; ?>";
                var mode = "<?php echo $_GET["mode"]; ?>";
                var url = domain + "/nwlib6/nwproject/modules/webrtc/testing/two/index.php";
                url += "?t=<?php echo $_GET["term"]; ?>,op=<?php echo $_GET["iam"]; ?>,cli=<?php echo $_GET["received"]; ?>&apikey=<?php echo $_GET["apikey"]; ?>";
                if (type === "chat") {
                    url += "&chat=true";
                } else
                if (type === "audio") {
                    url += "&audio=true&video=false";
                }
                var win = false;
                if (mode === "popup") {
                    //            win = window.open(url, "Nw", "width=600,height=600");
                } else {
                    //            win = window.open(url, mode);
                }
                var timer = setInterval(function () {
                    if (win) {
                        if (win.closed) {
                            clearInterval(timer);
                            goBack();
                        }
                    }
                }, 800);
            });

            function goBack() {
                window.history.back();
            }
        </script>
    </body>
</html>