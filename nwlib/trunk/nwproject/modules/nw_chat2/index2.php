<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
print nwprojectOut::getNwMakerLib();
?>
<!DOCTYPE html>
<html>
    <head>
        <title>NwChat</title>
        <meta http-equiv="Content-Type" content="text/html, charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <script>
//            document.addEventListener('DOMContentLoaded', function () {
//                var js = document.createElement('script');
//                js.type = 'text/javascript';
//                js.charset = 'UTF-8';
//                js.src = 'https://videoconf.gruponw.com/nwlib6/nwproject/modules/webrtc/testing/two/js/apinwrct.js';
//                js.id = 'nwRtcMaker';
//                js.async = true;
//                document.body.appendChild(js);
//                js.onload = function () {
//                    var nwrct = new nwRct();
//                    nwrct.start(2, "6223784632597");
//                };
//            });
<?php
if (isset($_GET["videollamada"])) {
    ?>
                videoCallNwChat = true;
    <?php
} else {
    ?>
                videoCallNwChat = false;
                delete videoCallNwChat;
    <?php
}
?>
        </script>

    </head>
    <body>
        <div id='loadingNwChat' class='loadingNwChat' style='
             background-color: #fff;
             position: fixed;
             top: 0;
             left: 0;
             width: 100%;
             height: 100%;
             z-index: 100;
             ' >
            <div class='h1_carga' style="    position: relative;
                 top: 20%;
                 margin: auto;
                 max-width: 120px;">
                <div class='loader2' id='loader' style="    width: 50px;
                     height: 50px;
                     position: absolute;
                     top: 50%;
                     left: 50%;
                     margin: -25px 0 0 -25px;
                     font-size: 10px;
                     text-indent: -12345px;
                     border-top: 1px solid rgba(0,0,0, 0.08);
                     border-right: 1px solid rgba(0,0,0, 0.08);
                     border-bottom: 1px solid rgba(0,0,0, 0.08);
                     border-left: 1px solid rgba(0,0,0, 0.5);
                     -webkit-border-radius: 50%;
                     -moz-border-radius: 50%;
                     border-radius: 50%;
                     -webkit-animation: load3 700ms infinite linear;
                     -moz-animation: load3 700ms infinite linear;
                     -ms-animation: load3 700ms infinite linear;
                     -o-animation: load3 700ms infinite linear;
                     animation: load3 700ms infinite linear;
                     z-index: 100001;" ></div>
            </div>
            <style>
                @-webkit-keyframes load3 { 
                    0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); }
                    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
                }
                @keyframes load3 { 
                    0% { -webkit-transform: rotate(0deg); transform: rotate(0deg); } 
                    100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); }
                }
            </style>
        </div>
        <link href="/nwlib6/nwproject/modules/nw_chat2/css/main_kowa.css" rel="stylesheet" type="text/css" />
        <audio id='operador_sound' src='/nwlib6/audio/ping.mp3' ></audio>
        <audio id='usuario_sound' src='/nwlib6/audio/blop.mp3' ></audio>
        <link href="/nwlib6/nwproject/modules/nw_chat2/css/main.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="/nwlib6/nwproject/modules/nw_chat2/js/externPage.js" ></script>
    </body>
</html>
