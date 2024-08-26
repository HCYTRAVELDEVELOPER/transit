<?php

$workLocal = false;
$conf = $_GET;
if (isset($conf["worklocal"])) {
    $workLocal = true;
}
if (isset($conf["workNHormal"])) {
    $workLocal = true;
}
$loadnwmakerall = true;
if (isset($conf["getcompressringow"])) {
    $loadnwmakerall = false;
}
$onlyjquery = false;
if (isset($conf["onlyjquery"])) {
    $onlyjquery = true;
}
$addtohomescreen = "NO";
if (isset($conf["addtohomescreen"])) {
    $addtohomescreen = $conf["addtohomescreen"];
}
$ringow_openform = false;
if (isset($conf["ringow_openform"])) {
    if ($conf["ringow_openform"] === true || $conf["ringow_openform"] === "true") {
        $ringow_openform = true;
    }
}
$nwrtc = false;
if (isset($conf["nwrtc"])) {
    if ($conf["nwrtc"] === true || $conf["nwrtc"] === "true") {
        $nwrtc = true;
    }
}
$loadlist = true;
if (isset($conf["loadlist"])) {
    if ($conf["loadlist"] === false || $conf["loadlist"] === "false") {
        $loadlist = false;
    }
}
$loadform = true;
if (isset($conf["loadform"])) {
    if ($conf["loadform"] === false || $conf["loadform"] === "false") {
        $loadform = false;
    }
}

function comprimir_pagina($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}

header('Content-Type: application/javascript');
ob_start('comprimir_pagina');

if ($addtohomescreen === "SI" || $addtohomescreen === "true" || $addtohomescreen === true) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwmaker/js/addToHomeScreen/js/requestanimframe.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwmaker/js/addtohomescreen.js";
}
//include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-3.3.1.min.js";
//include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery//jquery-3.5.1.min.js";
include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-latest.js";
if ($loadnwmakerall) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.mask.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js";
}
include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/js/main.js";
if ($loadnwmakerall) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/lists/l_usuarios_conected.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/lists/l_usuarios.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/forms/f_usuarios.js";
}
if ($onlyjquery === false) {
    if ($loadlist) {
        include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/lists.js";
    }
    if ($loadform) {
        include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nwforms/js/forms.js";
    }
}
if ($loadnwmakerall) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/home.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/nwmaker.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwmaker/config_nwmaker.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-home.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/myProfile.js";
}
if ($ringow_openform) {
    include $_SERVER['DOCUMENT_ROOT'] . "/app/nwchat/openForm/js/l_secciones.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/app/nwchat/openForm/js/openForm.js";
}
if ($nwrtc) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/webrtc/testing/two/js/utils.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/webrtc/testing/two/js/simplewebrtc.bundle.js";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/webrtc/testing/two/js/main.js";
}
//if ($loadnwmakerall === false && $onlyjquery === false) {
//    print "activeButtonsNwMaker();";
//}

ob_end_flush();
