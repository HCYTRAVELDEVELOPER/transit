<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$vn = master::getNwlibVersion();
require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib{$vn}/dashboard/srv/main.nw.php";

if (!isset($_SESSION["products"])) {
    $loadMusic = "startAllStart();";
}

$products = nw_configuraciones::getOptionProduc();
//        print_r($_SESSION);

$db = NWDatabase::database();
$cai = new NWDbQuery($db);
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
$cacheManifest = "";
//if ($_SERVER["HTTP_HOST"] == "www.demo1.gruponw.com" && $_SESSION["usuario"] == "alexf") {
//    $cacheManifest = "manifest='nw.manifest' type='text/cache-manifest' ";
//}
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="<?php echo $protocolo; ?>://www.facebook.com/2008/fbml"
      xmlns:og="<?php echo $protocolo; ?>://ogp.me/ns#"
      xml:lang="es-ES"  <?php echo $cacheManifest; ?>>
    <head>
        <title>Bienvenido</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" /> 

    </head>
    <body>
        <?php
        $im = nw_configuraciones::getConfig("compose");
        if (isset($im["error"])) {
            echo "Error al consultar la configuración de diseño por empresa. <br /> " . $im["error"];
            print_r($im);
            return false;
        }
        $configImg = $im["data"];
        $_SESSION["config_dashboard"] = $configImg;
//        print_r($configImg);

        $mostrar_notificaciones = "SI";
        $segunda_vista = "";
        if ($configImg != false) {
            if ($configImg["mostrar_notificaciones"] == "NO") {
                $mostrar_notificaciones = "NO";
            }
            ?>
            <style type="text/css">
    <?php
    if ($configImg["mostrar_favoritos"] == "NO") {
        ?>
                    .contend_favorites {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_chat"] == "NO") {
        ?>
                    #buttonOpenNwChat {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_cumpleanios"] == "NO") {
        ?>
                    .divUBirtDay {
                        display: none;
                    }
        <?php
    }

    if (isset($configImg["color_soporte"])) {
        if ($configImg["color_soporte"] != "0" || $configImg["color_soporte"] != "") {
            ?>
                        .chatnwsubframeButton{
                            background-color: <?php echo $configImg["color_soporte"]; ?>!important;
                        }
            <?php
        }
    }
    if (isset($configImg["color_muro"]) && $configImg["color_muro"] != "0" || $configImg["color_muro"] != "") {
        ?>
                    .buttonComentBox{
                        background: <?php echo $configImg["color_muro"]; ?>!important;
                    }
        <?php
    }
    if (isset($configImg["color_noticias"]) && $configImg["color_noticias"] != "0" || $configImg["color_noticias"] != "") {
        ?>
                    #contend_prods_home_dos{
                        background-color: <?php echo $configImg["color_noticias"]; ?>!important;
                    }
        <?php
    }
    if (isset($configImg["color_mas_usados"]) && $configImg["color_mas_usados"] != "0" || $configImg["color_mas_usados"] != "") {
        ?>
                    .diInterReadUss{
                        background-color: <?php echo $configImg["color_mas_usados"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["fond_body"] != "0") {
        ?>
                    body{
                        background-color: <?php echo $configImg["fond_body"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["fondo_gral_left"] != "0") {
        ?>
                    .div_home_left_into{
                        background-color: <?php echo $configImg["fondo_gral_left"]; ?>!important;
                        color: <?php echo $configImg["color_letra"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["fond_buttons"] != "0") {
        ?>
                    .box_users_apps{
                        background: <?php echo $configImg["fond_buttons"]; ?>;
                        color: <?php echo $configImg["color_letra_buttons"]; ?>;
                    }
        <?php
    }
    if ($configImg["fondo_modulo_uno"] != "0") {
        ?>
                    .contend_modules_div{
                        background: <?php echo $configImg["fondo_modulo_uno"]; ?>!important;
                        color: <?php echo $configImg["color_letra_modulo_uno"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["buttons_menu_radius"] != "0") {
        ?>
                    .contend_modules_div, .DivNivel1, .DivNivel2, .DivNivel3{
                        border-radius: <?php echo $configImg["buttons_menu_radius"]; ?>px!important;
                    }
        <?php
    }
    if ($configImg["buttons_menu_margins"] != "0" && $configImg["buttons_menu_margins"] != NULL) {
        ?>
                    .contend_modules_div, .DivNivel1, .DivNivel2, .DivNivel3{
                        margin: <?php echo $configImg["buttons_menu_margins"]; ?>px!important;
                    }
        <?php
    }
    if ($configImg["fondo_modulo_uno"] != "0") {
        ?>
                    .DivNivel1{
                        background: <?php echo $configImg["fondo_modulo_uno"]; ?>!important;
                        color: <?php echo $configImg["color_letra_modulo_uno"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["fondo_modulo_dos"] != "0") {
        ?>
                    .DivNivel2{
                        background: <?php echo $configImg["fondo_modulo_dos"]; ?>!important;
                        color: <?php echo $configImg["color_letra_modulo_dos"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["fondo_modulo_tres"] != "0") {
        ?>
                    .DivNivel3{
                        background: <?php echo $configImg["fondo_modulo_tres"]; ?>!important;
                        color: <?php echo $configImg["color_letra_modulo_tres"]; ?>!important;
                    }
        <?php
    }
    if ($configImg["color_fond_buttons_indicadores"] != "0") {
        ?>
                    .box_users_apps span, .div_salir{
                        background: <?php echo $configImg["color_fond_buttons_indicadores"]; ?>;
                    }
        <?php
    }
    if ($configImg["mostrar_mensaje_inbox"] == "NO") {
        ?>
                    .buttonMenInbox {
                        display: none;
                    }
        <?php
    }

    if ($configImg["mostrar_notificaciones"] == "NO") {
        ?>
                    .buttonNotifications {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_cumpleanios"] == "NO") {
        ?>
                    .divUBirtDay {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_notas"] == "NO") {
        ?>
                    .buttonNotas {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_tareas"] == "NO") {
        ?>
                    .buttonTask {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_usuarios"] == "NO") {
        ?>
                    .buttonUserActives, .divUsersOnline, .divUBirtDay {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_favoritos"] == "NO") {
        ?>
                    .contend_favorites {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_especiales"] == "NO") {
        ?>
                    .contend_specials {
                        display: none;
                    }
        <?php
    }
    if (isset($configImg["mostrar_muro"]) && $configImg["mostrar_muro"] == "NO") {
        ?>
                    .divFrameWall {
                        display: none;
                    }
        <?php
    }
    if ($configImg["mostrar_chat"] == "NO") {
        ?>
                    .nw_button_chat {
                        display: none;
                    }
        <?php
    }

    if (isset($configImg["code_css"]) && $configImg["code_css"] != 0) {
        echo $configImg["code_css"];
    }
    ?>

            </style>
            <?php
//            $segunda_vista = $configImg["usar_segunda_vista"];
        }

        if (isset($configImg["url_hoja_css"]) && $configImg["url_hoja_css"] != 0) {
            echo "<link rel='stylesheet' type='text/css' href='{$configImg["url_hoja_css"]}'>";
        }


        $plantilla = "estilo1";
        if (isset($configImg["plantilla"])) {
            if ($configImg["plantilla"] != NULL) {
                $plantilla = $configImg["plantilla"];
            }
        }

        if ($_SERVER["HTTP_HOST"] == "sit.gruponw.com" || $_SERVER["HTTP_HOST"] == "sit.loc") {
            $plantilla = "estilo3";
        }

        if ($plantilla == "estilo1") {
            include_once ($_SERVER["DOCUMENT_ROOT"] . "/nwlib6/user_bienvenido_old.php");
        } else
        if ($plantilla == "estilo2") {
            include_once ($_SERVER["DOCUMENT_ROOT"] . "/nwlib6/dashboard6/index.nw.php");
        } else
        if ($plantilla == "estilo3") {
            include_once ($_SERVER["DOCUMENT_ROOT"] . "/nwlib6/nwproject/modules/nw_user_session/index.php");
            ?>
            <script>
                function loadMainDivs(id) {
                    var xmlhttp;
                    if (window.XMLHttpRequest)
                    {// code for IE7+, Firefox, Chrome, Opera, Safari
                        xmlhttp = new XMLHttpRequest();
                    } else
                    {// code for IE6, IE5
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange = function ()
                    {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                        {
    <?php
    if (isset($configImg["tercer_nivel"])) {
        if ($configImg["tercer_nivel"] == "SI") {
            ?>
                                    document.querySelector(".loadMenuModules").innerHTML = xmlhttp.responseText;
            <?php
        }
    } else {
        ?>
                                document.querySelector(".loadMenuModulesPopupMain").style.display = "block";
                                document.querySelector(".loadMenuModulesPopup").innerHTML = xmlhttp.responseText;
        <?php
    }
    ?>
                            var btn = document.querySelector(".DivNivelSalir");
                            if (btn) {
                                btn.addEventListener("click", function () {
                                    document.querySelector(".loadMenuModulesPopupMain").style.display = "none";
                                    document.querySelector(".loadMenuModulesPopup").innerHTML = "";
                                    return false;
                                });
                            }
                        }
                    }
                    var sendScondV = "";
                    sendScondV = "&usedSecondView=true";
                    xmlhttp.open("GET", "/nwlib6/dashboard/loadMainDivs.php?id=" + id + sendScondV + "&plantilla=3&normal=true", true);
                    xmlhttp.send();
                }

                function loadMainSubDivs(id) {
                    var xmlhttp;
                    if (window.XMLHttpRequest)
                    {// code for IE7+, Firefox, Chrome, Opera, Safari
                        xmlhttp = new XMLHttpRequest();
                    } else
                    {// code for IE6, IE5
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange = function ()
                    {
                        console.log(xmlhttp);
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                        {
    <?php
    if (isset($configImg["tercer_nivel"])) {
        if ($configImg["tercer_nivel"] == "SI") {
            ?>
                                    document.querySelector(".loadMenuModules").innerHTML = xmlhttp.responseText;
            <?php
        } else {
            ?>
                                    document.querySelector(".loadMenuModulesPopupMain").style.display = "block";
                                    document.querySelector(".loadMenuModulesPopup").innerHTML = xmlhttp.responseText;
            <?php
        }
    } else {
        ?>
                                document.querySelector(".loadMenuModulesPopupMain").style.display = "block";
                                document.querySelector(".loadMenuModulesPopup").innerHTML = xmlhttp.responseText;
        <?php
    }
    ?>
                            var btns = document.querySelector(".s88");
                            if (btns) {
                                btns.addEventListener("click", function () {
    <?php
    if (isset($configImg["tercer_nivel"])) {
        if ($configImg["tercer_nivel"] == "SI") {
            ?>
                                            location.reload();
            <?php
        } else {
            ?>
                                            document.querySelector(".loadMenuModulesPopupMain").style.display = "none";
                                            document.querySelector(".loadMenuModulesPopup").innerHTML = "";
            <?php
        }
    } else {
        ?>
                                        document.querySelector(".loadMenuModulesPopupMain").style.display = "none";
                                        document.querySelector(".loadMenuModulesPopup").innerHTML = "";
        <?php
    }
    ?>
                                    return false;
                                });
                            }
                            var btn = document.querySelector(".s66");
                            if (btn) {
                                btn.addEventListener("click", function () {
                                    document.querySelector(".loadMenuModulesPopupMain").style.display = "none";
                                    document.querySelector(".loadMenuModulesPopup").innerHTML = "";
                                    return false;
                                });
                            }

                        }
                    }
                    var sendScondV = "&usedSecondView=false";
                    if (typeof useSecondView != "undefined") {
                        if (useSecondView) {
                            sendScondV = "&usedSecondView=true";
                        }
                    }
                    xmlhttp.open("GET", "/nwlib6/dashboard/loadMainDivs.php?id=" + id + sendScondV + "&plantilla=3&tercer_vista=true&boton1", true);
                    xmlhttp.send();
                }

                document.addEventListener('DOMContentLoaded', function () {
                });
                function loadMainSubDivs2(id) {
                    var xmlhttp;
                    if (window.XMLHttpRequest)
                    {// code for IE7+, Firefox, Chrome, Opera, Safari
                        xmlhttp = new XMLHttpRequest();
                    } else
                    {// code for IE6, IE5
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    xmlhttp.onreadystatechange = function ()
                    {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
                        {
                            document.querySelector(".loadMenuModulesPopupMain").style.display = "block";
                            document.querySelector(".loadMenuModulesPopup").innerHTML = xmlhttp.responseText;
                            var btn = document.querySelector(".s66");
                            if (btn) {
                                btn.addEventListener("click", function () {
                                    document.querySelector(".loadMenuModulesPopupMain").style.display = "none";
                                    document.querySelector(".loadMenuModulesPopup").innerHTML = "";
                                    return false;
                                });
                            }
                            var btn = document.querySelector(".s88");
                            if (btn) {
                                btn.addEventListener("click", function () {
                                    location.reload();
                                    return false;
                                });
                            }
                        }
                    }
                    var sendScondV = "&usedSecondView=false";
                    if (typeof useSecondView != "undefined") {
                        if (useSecondView) {
                            sendScondV = "&usedSecondView=true";
                        }
                    }
                    xmlhttp.open("GET", "/nwlib6/dashboard/loadMainDivs.php?id=" + id + sendScondV + "&plantilla=3&tercer_vista=true&boton2", true);
                    xmlhttp.send();
                }

            </script>


            <div class="loadMenuModulesPopupMain">
                <div class="loadMenuModulesPopup">

                </div>
            </div>

            <style>
                .loadMenuModulesPopupMain{
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    z-index: 100000;
                    top: 0;
                    left: 0;
                    display: none;
                    background: rgba(0,0,0,0.58);
                }
                .loadMenuModulesPopup{
                    position: relative;
                    max-width: 600px;
                    margin: auto;
                    background: rgba(0, 0, 0, 0.56);
                    background-color: rgba(253,86,48,0.6)!important;
                    background: #4e5658;
                    overflow: hidden;
                    top: 10%;
                    border-radius: 5px;
                    padding: 25px;
                    box-shadow: 0 2px 3px rgba(0,0,0,0.5);
                    -moz-box-shadow: 0 2px 3px rgba(0,0,0,0.5);
                    -webkit-box-shadow: 0 2px 3px rgba(0,0,0,0.5);
                    z-index: 1999;
                }
                .loadMenuModulesPopup .containerBoxM{
                    width: auto!important;
                }
                #contend_modules_div {
                    font-size: 14px!important;
                    width: 125px!important;
                    height: 125px!important;
                }
                .containerBoxM{
                    width: 160px;
                    height: 180px;
                }
                .loadMenuModulesPopup .div_salir{
                    width: 100px!important;
                    float: left!important;
                    background: #fff;
                }
                .loadMenuModulesPopup .title_main{
                    color: #fff;
                }
                img_contend_modules_div{
                    width: 70px;
                }
                .textSpan {
                    word-break: break-word;
                    max-width: 75%;
                    display: block;
                    margin: auto;
                }
                .titleSnw {
                    font-size: 22px;
                    color: #fff;
                    background: rgba(75, 70, 70, 0.51);
                    position: relative;
                    display: block;
                    padding: 10px;
                    line-height: normal;
                }
                .loadMenuModules {
                    position: relative;
                    max-width: 1000px;
                    margin-left: 5px;
                    background: rgba(78, 86, 88, 0.17);
                    border-radius: 5px;
                    padding: 25px;
                    /* box-shadow: 0 2px 3px rgba(0,0,0,0.5); */
                    -moz-box-shadow: 0 2px 3px rgba(0,0,0,0.5);
                    /* -webkit-box-shadow: 0 2px 3px rgba(0,0,0,0.5); */
                }
                .containerLeft{
                    background-color: #4e5658!important;
                }
                .separatorsLeft{
                    border: 0px!important;
                }
                #elementsList th, td{
                    padding: 2px;
                }
                .DivNivelSalir {
                    display: inline-block!important;
                    vertical-align: middle;
                    margin-right: 10px!important;
                }
                .title_main p{
                    display: inline-block;

                }
            </style>
            <?php
        } else {
            include_once ($_SERVER["DOCUMENT_ROOT"] . "/nwlib6/user_bienvenido_old.php");
        }
        ?>
    </body>
</html>