<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");

$conf = nwprojectOut::nwpMakerConfig();

$okMenu = true;
if ($conf["config"]["menu_para_qxnw"] == "SI") {
    $okMenu = false;
}
if (isset($conf["config"]["use_menu_of_bd"])) {
    if ($conf["config"]["use_menu_of_bd"] === false || $conf["config"]["use_menu_of_bd"] === "NO" || $conf["config"]["use_menu_of_bd"] === "false") {
        $okMenu = false;
    }
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
if ($okMenu == true) {
    $where = " 1=1 ";
    if (isset($_SESSION["profile"])) {
        $where .= " and b.perfil=:profile and b.consultar='SI' ";
    }
    $where .= " order by a.orden asc ";
    $ca->prepareSelect("nwmaker_menu a left join nwmaker_permisos b ON (a.callback=b.modulo) ", "a.*", $where);
    if (isset($_SESSION["profile"])) {
        $ca->bindValue(":profile", $_SESSION["profile"]);
    }
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText();
        return false;
    }
    $t = $ca->size();
}
$workLocal = false;
if (isset($_GET["worklocal"])) {
    $workLocal = true;
}
if (isset($_GET["workNHormal"])) {
    $workLocal = true;
}
if ($hostname === "pdc.com.co" || $hostname === "www.pdc.com.co") {
    $workLocal = true;
}

//$workLocal = true;

function comprimir_pagina($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}

header('Content-Type: application/javascript');
//ob_start('comprimir_pagina');
//if (isset($conf["config"]["permitir_chat"])) {
//    if ($conf["config"]["permitir_chat"] == "SI") {
//        include_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_chat2/js/main2.js";
//        echo "nwc = new newNwChat(); nwc.setConfig('intern');";
//        include_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_chat2/js/forms/f_chat.js";
//    }
//}

$rta = "$(document).ready(function () {";

if ($workLocal === false) {
    $vers = "1";
    if (isset($conf["config"]["version_compress"]) && isset($conf["config"]["url_js_forms_lists"])) {
        $vers = $conf["config"]["version_compress"];
    }
    if ($vers == "1") {
        $dir = $_SERVER['DOCUMENT_ROOT'] . "/compressFiles/js/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                include_once $dir . $archivo;
            }
        }
        closedir($directorio);
    } else
    if ($vers == "2") {
        $dir = $_SERVER['DOCUMENT_ROOT'] . $conf["config"]["url_js_forms_lists"] . "/forms/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                include_once $dir . $archivo;
            }
        }
        closedir($directorio);

        $dir = $_SERVER['DOCUMENT_ROOT'] . $conf["config"]["url_js_forms_lists"] . "/lists/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                include_once $dir . $archivo;
            }
        }
        closedir($directorio);
        include_once $_SERVER['DOCUMENT_ROOT'] . $conf["config"]["url_javascript_principal"];
    }
}



if ($okMenu == true) {
    if ($t > 0) {
        for ($i = 0; $i < $t; $i++) {
            $r = $ca->flush();
            if (isset($r['callback_code'])) {
                if ($r['callback_code'] != null && $r['callback_code'] != "" && $r['callback_code'] != "0") {
                    $rta .= "(function () {";
                    $rta .= "$('body').delegate('.linkleft_{$r["id"]}', 'click', function () { ";
                    $rta .= $r['callback_code'] . "()";
                    $rta .= "});";
                    $rta .= "})();";
                    $rta .= "(function () {";
                    $rta .= "$('body').delegate('.nwMakerMenu_{$r["id"]}', 'click', function () {";
                    $rta .= $r['callback_code'] . "()";
                    $rta .= "});";
                    $rta .= "})();";
                }
            }
        }
    }
}
$rta .= "});";

echo $rta;
//ob_end_flush();
