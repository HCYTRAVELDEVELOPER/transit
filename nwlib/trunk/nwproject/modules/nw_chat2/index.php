<!DOCTYPE html>
<html>
    <head>
        <title>NwChat</title>
        <meta http-equiv="Content-Type" content="text/html, charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta http-equiv="Pragma" content="no-cache">
        <meta http-equiv="expires" content="0">
        <?php
        require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
        print nwprojectOut::getNwMakerLib();
        ?>
        <script>
<?php
if (isset($_GET["videollamada"])) {
    ?>
                videoCallNwChat = true;
    <?php
}
if (isset($_GET["video"])) {
    if ($_GET["video"] == "false") {
        ?>
                    showVideoCallNwChat = false;
        <?php
    }
}
?>
            $(document).ready(function () {
                initAll();
            });
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
        <div id="container-nwchat2">
            <div id="container-all"></div>
            <div id="container-conversations"></div>
            <div id="container-css-oculto"></div>
            <div class="container-mensaje-disconected"></div>
            <div class="container-credits"><a href="http://www.gruponw.com" rel="noreferrer" target="_BLANK"><span>Powered By GrupoNw</span></a></div>
        </div>

        <link href="/nwlib6/nwproject/modules/nw_chat2/css/main.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="/nwlib6/nwproject/modules/nw_chat2/js/main.js" ></script>

        <audio id='operador_sound' src='/nwlib6/audio/ping.mp3' ></audio>
        <audio id='usuario_sound' src='/nwlib6/audio/blop.mp3' ></audio>

        <audio id='soundCalling' src='/nwlib6/audio/misc027.mp3' ></audio>
        <audio id='soundIntroCalling' src='/nwlib6/audio/misc101.mp3' ></audio>
        <audio id='soundLostCalling' src='/nwlib6/audio/misc312.mp3' ></audio>

    </body>
</html>
