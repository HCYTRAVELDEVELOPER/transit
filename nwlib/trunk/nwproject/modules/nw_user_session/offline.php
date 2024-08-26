<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$_SESSION["load_nwmaker"] = true;
ob_start('comprimir_nwmaker');
$http = "http";
$https = "https";
$protocolo = $http;
if (isset($_SERVER["HTTPS"])) {
    if ($_SERVER["HTTPS"] == "on") {
        $protocolo = $https;
    } else {
        $protocolo = $http;
    }
}
$conf = nwprojectOut::nwpMakerConfig();
$cacheManifest = "";
if (isset($conf["config"]["offlineNwDual"])) {
    if ($conf["config"]["offlineNwDual"] == true || $conf["config"]["offlineNwDual"] == "true") {
        $cacheManifest = " manifest='/nw.manifest' ";
    }
}
$v = "";
?>
<!DOCTYPE html>
<html id='xhtmlEnc' xmlns="<?php echo $protocolo; ?>://www.w3.org/1999/xhtml" xmlns:fb="<?php echo $protocolo; ?>://www.facebook.com/2008/fbml" xmlns:og="<?php echo $protocolo; ?>://ogp.me/ns#" xml:lang="es-ES"<?php echo $cacheManifest; ?>>
    <head>
        <title>NwMaker - Grupo Nw Soft</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/nwlib6/nwmaker/manifest.json" />
        <?php
        print nwMaker::includeCssNwMaker($conf["config"], $v);
        ?>
    </head>
    <body>
        <div id="container-nwmaker"></div>
        <div class="downloadingPage">
            <div class="downloadingPageTitle"></div>
            <span class="downloadingPageStatus"></span>
            <span class="downloadingPageTotal"></span>
        </div>
        <div class="loadLocalStorage">
            Application Status: <span id="applicationStatus"></span>
            <div id="downloading"></div>
            <div id="error"></div>
        </div>
        <audio id='usuario_sound' src='/nwlib6/audio/household020.mp3' ></audio>
            <?php
            print nwMaker::includeJsNwMaker($conf["config"], $v);
//            print nwprojectOut::getApiGoogleMaps(false, $conf["config"]);
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
