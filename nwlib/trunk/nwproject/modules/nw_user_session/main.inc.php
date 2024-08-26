<?php
//$usedOutNwlib = true;
//include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//if (!isset($_SESSION)) {
//    session_start();
//}
//if (session_id() == "") {
//    session_start();
//}

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
$inlogin = true;
if (isset($_SESSION["usuario"])) {
    $inlogin = false;
}
$conf = nwprojectOut::nwpMakerConfig();
if (isset($conf["config_login"]["permitir_acceso_sin_login"])) {
    if ($conf["config_login"]["permitir_acceso_sin_login"] === "SI") {
//        $inlogin = false;
    }
}
if (isset($_GET["createLogin"]) || isset($_GET["createAccount"])) {
    if (!isset($_SESSION["usuario"])) {
        $inlogin = true;
    }
}
if (isset($conf["config_login"]["url_css_principal_login"])) {
    if ($conf["config_login"]["url_css_principal_login"] != null && $conf["config_login"]["url_css_principal_login"] != false && $conf["config_login"]["url_css_principal_login"] != "") {
        $conf["config"]["url_css_principal_login"] = $conf["config_login"]["url_css_principal_login"];
    }
}
if ($inlogin) {
//    $conf["config"]["loadcenter"] = false;
//    $conf["config"]["datepicker"] = false;
//    $conf["config"]["lists"] = false;
    $conf["config"]["inlogin"] = true;
}

$cacheManifest = "";
if (isset($conf["config"]["offlineNwDual"])) {
    if ($conf["config"]["offlineNwDual"] === true || $conf["config"]["offlineNwDual"] === "true" || $conf["config"]["offlineNwDual"] === "SI") {
        $cacheManifest = " manifest='/nw.manifest' ";
    }
}
$v = "?v=1";
if (isset($conf["version"])) {
    $v = $conf["version"];
}
$theme_color = "#ffffff";
if (isset($conf["theme_color"])) {
    $theme_color = $conf["theme_color"];
}
$safariPinnedTab = "";
$icon16x16 = "";
$icon32x32 = "";
$icon_install = "";
$appleTouchIcon = "";
if (isset($conf["icon_install"])) {
    $icon_install = $conf["icon_install"];
    $appleTouchIcon = $conf["icon_install"];
    $icon32x32 = $conf["icon_install"];
    $icon16x16 = $conf["icon_install"];
    $safariPinnedTab = $conf["icon_install"];
}
if (isset($conf["icon16x16"])) {
    $icon16x16 = $conf["icon16x16"];
}
if (isset($conf["icon32x32"])) {
    $icon32x32 = $conf["icon32x32"];
}
if (isset($conf["apple-touch-icon"])) {
    $appleTouchIcon = $conf["apple-touch-icon"];
}
if (isset($conf["safari-pinned-tab"])) {
    $safariPinnedTab = $conf["safari-pinned-tab"];
}
$favicon = false;
if (isset($conf["favicon"])) {
    $favicon = $conf["favicon"];
}
$addtohomescreen = "NO";
if (isset($conf["addtohomescreen"])) {
    $addtohomescreen = $conf["addtohomescreen"];
}
$title = $_SERVER["HTTP_HOST"] . " - NwMaker";
if (isset($conf["name"])) {
    $title = $conf["name"];
}
if (isset($_GET["title"])) {
    $title = $_GET["title"];
}
$img = "";
if (isset($_GET["img"])) {
    $img = $_GET["img"];
}
$description = $title;
if (isset($conf["description"])) {
    $description = $conf["description"];
}
$keywords = "";
if (isset($conf["keywords"])) {
    $keywords = $conf["keywords"];
}
$isInNwproject = false;
if (isset($_SESSION["nwproject_website"])) {
    $isInNwproject = true;
}
$actual_link = $_SERVER["REQUEST_URI"];
$pp = explode("/nw_user_session/index.php", $actual_link);
$pp2 = explode("nwUserAccount", $actual_link);
$pp3 = explode("nwmaker", $actual_link);
$pp4 = false;
if (isset($_SESSION["url_nwmaker_account"])) {
    $pp4 = explode($_SESSION["url_nwmaker_account"], $actual_link);
}
if (isset($pp[0]) && $pp[0] === "/nwlib6/nwproject/modules" || isset($pp[0]) && $pp[0] === "nwUserAccount" || isset($pp2[1]) || isset($pp3[1]) || $pp4 !== false && isset($pp4[1])) {
    $isInNwproject = false;
}
//$isInNwproject = true;
//$isInNwproject = false;
?>
<!DOCTYPE html>
<html id='xhtmlEnc' xmlns="<?php echo $protocolo; ?>://www.w3.org/1999/xhtml" xmlns:fb="<?php echo $protocolo; ?>://www.facebook.com/2008/fbml" xmlns:og="<?php echo $protocolo; ?>://ogp.me/ns#" xml:lang="es-ES"<?php echo $cacheManifest; ?>>
    <head>
        <title><?php echo $title; ?></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="apple-mobile-web-app-title" content="<?php echo $title; ?>">
        <meta name="msapplication-TileColor" content="<?php echo $theme_color; ?>">
        <meta name="theme-color" content="<?php echo $theme_color; ?>" />
        <meta name="description" content="<?php echo $description; ?>" />
        <meta name="keywords" content="<?php echo $keywords; ?>" />
        <meta name="generator" content="gruponw" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" sizes="76x76" href="<?php echo $appleTouchIcon; ?>">
        <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $icon32x32; ?>">
        <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $icon16x16; ?>">
        <link rel="mask-icon" href="<?php echo $safariPinnedTab; ?>" color="<?php echo $theme_color; ?>">
        <link rel="manifest" href="/config_nwmaker.json" />
        <?php
        if ($favicon !== false) {
            ?>
            <link id="favicon" rel="icon" href="<?php echo $favicon; ?>"/>
            <?php
        }
        if (!$isInNwproject) {
            print nwMaker::includeCssNwMaker($conf["config"], $v);
        }
        $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://{$_SERVER['HTTP_HOST']}{$_SERVER['REQUEST_URI']}";
        ?>
        <meta property="og:site_name" content="nwmaker">
        <meta property="og:url" content="<?php echo $actual_link; ?>">
        <meta property="og:type" content="website"> 
        <meta property="og:title" content="<?php echo $title; ?>">
        <meta property="og:description" content="<?php echo $title; ?>">
        <meta property="og:image" content="<?php echo $img; ?>">
        <meta property="fb:app_id" content="1948887535379031">
        <meta property="fb:admins" content="598313794,598333120">
    </head>
    <body>
        <div id="loadingNwMakerHome" class="loadingNwMakerHome" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: #fff;z-index: 100000000;display: grid;">
            <div class="cEftVf"></div>
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
                    vertical-align: middle;
                    margin: auto;
                }
            </style>
        </div>
        <div id="container-nwmaker"></div>
        <div class="bg-color-login-nwmaker"></div>
        <div class="bg-img-login-nwmaker"></div>
        <div class="downloadingPage">
            <div class="downloadingPageTitle"></div>
            <span class="downloadingPageStatus"></span>
            <span class="downloadingPageTotal"></span>
        </div>
        <div class="loadLocalStorage" style="display: none;">
            Application Status: <span id="applicationStatus"></span>
            <div id="downloading">Descargando Contenido, Espera...</div>
            <div id="error"></div>
        </div>
        <div class="favicon_initial" data="/imagenes/favicon.ico"></div>
        <div class="title_initial" data="<?php echo $title; ?>"></div>
        <div class="installAppMaker"></div>
        <?php
        if (!$isInNwproject) {
            print nwMaker::includeJsNwMaker($conf["config"], $v);
        }

        if (isset($conf["config"]["useApiGoogleMaps"])) {
            if ($conf["config"]["useApiGoogleMaps"] == "SI" || $conf["config"]["useApiGoogleMaps"] == "true" || $conf["config"]["useApiGoogleMaps"] == true) {
                print nwprojectOut::getApiGoogleMaps(false, $conf["config"]);
            }
        }
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
