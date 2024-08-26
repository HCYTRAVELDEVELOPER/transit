<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
ob_start('comprimir_nwmaker');
$conf = nwprojectOut::nwpMakerConfig();
if (isset($conf["version"])) {
    $v = $conf["version"];
} else {
    $v = rand(5, 100000);
}
$conf["config"]["getcompressringow"] = "true";
$conf["config"]["datepicker"] = "false";
$conf["config"]["loadcenter"] = "false";
$conf["config"]["ringow_openform"] = "true";
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Control</title>
        <meta http-equiv="Content-Type" content="text/html, charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <?php
        if (isset($_GET["link_css"])) {
            ?>
            <link rel='stylesheet' href='<?php echo $_GET["link_css"]; ?>?v=<?php echo $v; ?>' />
            <?php
        }
        if (isset($_GET["embed"])) {
            ?>
            <link rel='stylesheet' href='/nwlib6/nwproject/modules/webrtc/testing/two/css/embed.css?v=<?php echo $v; ?>' />
            <?php
        }
        print nwMaker::includeCssNwMaker($conf["config"], $v);
        ?>
    </head>
    <body app-version="<?php echo $v; ?>">
        <div class="encChat">
            <div class='encPhoto'></div>
            <div class='encName'></div>
            <i class='material-icons iconsEnc closeChat'>close</i>
            <i class='material-icons iconsEnc openChat'>open_in_new</i>
        </div>
        <div class="bgBody"></div>
        <div id="loadingNwChat" class="loadingNwChat" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: transparent;z-index: 100000000;">
            <div class="cEftVf" style="top: 40%;position: relative;"></div>
            <style>
                @-webkit-keyframes iECmZH {
                    0% {
                        -webkit-transform: rotate(0deg);
                        -ms-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        -ms-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }

                @keyframes iECmZH {
                    0% {
                        -webkit-transform: rotate(0deg);
                        -ms-transform: rotate(0deg);
                        transform: rotate(0deg);
                    }
                    100% {
                        -webkit-transform: rotate(360deg);
                        -ms-transform: rotate(360deg);
                        transform: rotate(360deg);
                    }
                }
                .cEftVf {
                    margin-left: auto;
                    margin-right: auto;
                    border: 4px solid #358EFF;
                    border-top: 4px solid transparent;
                    height: 3rem;
                    width: 3rem;
                    box-sizing: border-box;
                    -webkit-animation: iECmZH 1100ms infinite linear;
                    animation: iECmZH 1100ms infinite linear;
                    border-radius: 50%;
                }
            </style>
        </div>
        <audio id='operador_sound' class='operador_sound' src='/nwlib6/audio/ping.mp3' ></audio>
        <audio id='usuario_sound' class='usuario_sound' src='/nwlib6/audio/blop.mp3' ></audio>
            <?php
            print nwMaker::includeJsNwMaker($conf["config"], $v);
            ?>
    </body>
</html>
<?php
ob_end_flush();

function comprimir_nwmaker($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}
