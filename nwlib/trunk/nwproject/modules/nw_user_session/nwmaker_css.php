<?php

$conf = $_GET;
$isnwproject = false;
if (isset($_GET["nwproject"])) {
    $isnwproject = true;
    include $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $co = nwprojectOut::nwpMakerConfig();
    $conf = $co;
    if (isset($co["config"])) {
        $conf = $co["config"];
    }
    if (isset($co["config_login"])) {
        if (isset($co["config_login"]["url_css_principal_login"])) {
            if ($co["config_login"]["url_css_principal_login"] != null && $co["config_login"]["url_css_principal_login"] != false && $co["config_login"]["url_css_principal_login"] != "") {
                $conf["url_css_principal_login"] = $co["config_login"]["url_css_principal_login"];
            }
        }
    }
    $pagina = nwproject::getPage();
    $idioma = nwproject::getIdioma();
}
$workLocal = false;
if (isset($conf["worklocal"])) {
    $workLocal = true;
}
if (isset($conf["workNHormal"])) {
    $workLocal = true;
}
$loadnwmakerall = true;
if (isset($conf["getcompressringow"]) || isset($_GET["getcompressringow"])) {
    $loadnwmakerall = false;
}
$loadmakercenter = true;
$inlogin = false;
if (isset($conf["inlogin"])) {
    if ($conf["inlogin"] === true || $conf["inlogin"] === "true") {
        $inlogin = true;
    }
}
if (isset($_GET["inlogin"])) {
    if ($_GET["inlogin"] === true || $_GET["inlogin"] === "true") {
        $inlogin = true;
    }
}
if (isset($conf["loadcenter"])) {
    if ($conf["loadcenter"] === false || $conf["loadcenter"] === "false") {
        $loadmakercenter = false;
        $loadnwmakerall = false;
    }
}
if (isset($_GET["loadcenter"])) {
    if ($_GET["loadcenter"] === false || $_GET["loadcenter"] === "false") {
        $loadmakercenter = false;
        $loadnwmakerall = false;
    }
}
$datepicker = true;
if (isset($conf["datepicker"]) || isset($_GET["datepicker"])) {
    $datepicker = false;
}
$nwdialog = true;
if (isset($conf["nwdialog"])) {
    if ($conf["nwdialog"] === false || $conf["nwdialog"] === "false") {
        $nwdialog = false;
    }
}
if (isset($_GET["nwdialog"])) {
    if ($_GET["nwdialog"] === false || $_GET["nwdialog"] === "false") {
        $nwdialog = false;
    }
}
$lists = true;
if (isset($conf["lists"])) {
    if ($conf["lists"] === false || $conf["lists"] === "false") {
        $lists = false;
    }
}
if (isset($_GET["lists"])) {
    if ($_GET["lists"] === false || $_GET["lists"] === "false") {
        $lists = false;
    }
}
$nwrtc = false;
if (isset($conf["nwrtc"])) {
    if ($conf["nwrtc"] === true || $conf["nwrtc"] === "true") {
        $nwrtc = true;
    }
}
$nwrtc_chat = false;
if (isset($conf["nwrtc_chat"])) {
    if ($conf["nwrtc_chat"] === true || $conf["nwrtc_chat"] === "true") {
        $nwrtc_chat = true;
    }
}
$ringow_openform = false;
if (isset($conf["ringow_openform"])) {
    if ($conf["ringow_openform"] === true || $conf["ringow_openform"] === "true") {
        $ringow_openform = true;
    }
}
$menu_para_qxnw = false;
if (isset($conf["menu_para_qxnw"])) {
    if ($conf["menu_para_qxnw"] == "SI") {
        $menu_para_qxnw = true;
    }
}

function comprimir_pagina($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}

function isMobile() {
    $useragent = $_SERVER['HTTP_USER_AGENT'];
    if (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i', $useragent) || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i', substr($useragent, 0, 4))) {
        return true;
    }
    return false;
}

$addtohomescreen = "NO";
if (isset($conf["addtohomescreen"])) {
    $addtohomescreen = $conf["addtohomescreen"];
}

$menu_movil_en_pc = "SI";
if (isset($conf["menu_movil_en_pc"])) {
    $menu_movil_en_pc = $conf["menu_movil_en_pc"];
}

$ismobile = isMobile();

header("Content-type: text/css");
ob_start('comprimir_pagina');

//include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/css/emoji/emoji.css";
if ($menu_para_qxnw)
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/dashboard/css/style.css";
if ($ringow_openform)
    include $_SERVER['DOCUMENT_ROOT'] . "/app/nwchat/openForm/css/openForm.css";
if ($nwrtc)
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/webrtc/testing/two/css/main.css";
if ($nwrtc_chat)
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/webrtc/testing/two/css/chat.css";
//forms
include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nwforms/css/style.css";
if ($nwdialog)
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/nwdialog.css";
if ($datepicker)
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css";
if ($inlogin) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/login_createaccount.css";
    if (isset($conf["url_css_principal_login"])) {
        if ($conf["url_css_principal_login"] != null && $conf["url_css_principal_login"] != false && $conf["url_css_principal_login"] != "") {
            include $_SERVER['DOCUMENT_ROOT'] . $conf["url_css_principal_login"];
        }
    }
}

if ($lists)
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/lists.css";

//nwmaker
if ($loadmakercenter) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/styleOut.css";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/home.css";
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/media.css";
}
if ($loadnwmakerall) {
//    if ($menu_movil_en_pc === "SI" || $menu_movil_en_pc === "true" || $menu_movil_en_pc === true) {
//        if (!$ismobile) {
//            include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/css/menupcnormal.css";
//        }
//    }
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/nwmaker_css_applyconfig.php";
    if ($addtohomescreen === "SI" || $addtohomescreen === "true" || $addtohomescreen === true) {
        include $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwmaker/css/addtohomescreen.css";
    }
    if (isset($conf["url_css_principal"])) {
        if ($conf["url_css_principal"] != null && $conf["url_css_principal"] != false && $conf["url_css_principal"] != "") {
            include $_SERVER['DOCUMENT_ROOT'] . $conf["url_css_principal"];
        }
    }
}
ob_end_flush();
