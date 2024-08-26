<?php

if (!isset($_SESSION)) {
    session_start();
}
if (session_id() == "") {
    session_start();
}

function recoverPass() {
    include 'recoverPass/recoverPass.php';
}

function nwpMakerLoginConfig() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwmaker_login", "*", "1=1 order by id desc limit 1");
    if (!$ca->exec()) {
        return "Error line 8 " . $ca->lastErrorText();
    }
    if ($ca->size() == 0) {
        return false;
    }
    $r = $ca->flush();
    return $r;
}

function jsIndex() {
    $v = allVars();
    $rta = "<script type='text/javascript' src='{$v["carpet_module"]}js/index.js'></script>";
    return $rta;
}

function allVars() {
    $modo = "nwproject";
    $modo = "nwlib";

    $rta = array();
    $rta["url_sites"] = "";
    $rta["recover_pass"] = "";
    if (isset($_GET["url_sites"])) {
        $rta["url_sites"] = $_GET["url_sites"];
    }
    if (isset($_GET["recover_pass"])) {
        $rta["recover_pass"] = $_GET["recover_pass"];
    }
    $rta["carpet_jquery"] = "";
    if ($modo == "nwlib") {
        $rta["carpet_module_gral"] = "/nwlib6/nwproject/modules/";
        $rta["carpet_module"] = "/nwlib6/nwproject/modules/nw_user_session/";
        $rta["carpet_utils"] = "/nwlib6/nwproject/modules/nw_user_session/js/jquery/";
        $rta["carpet_main_js"] = "/nwlib6/nwproject/js/";
    } else {
        $rta["carpet_module_gral"] = "/modules/";
        $rta["carpet_module"] = "/modules/nw_user_session/";
        $rta["carpet_utils"] = "/nwproject/utilities/jquery/";
        $rta["carpet_main_js"] = "/nwproject/structure/js/";
    }
//    $rta["manifest"] = "manifest='nw.manifest'";
    $rta["manifest"] = "";
    return $rta;
}

function loadCss() {
    $v = allVars();
    $rta = "<link rel='stylesheet' href='{$v["carpet_module"]}css/media.css' >";
    return $rta;
}

function loadJquery() {
    $v = allVars();
    $rta = "<script type='text/javascript' src='{$v["carpet_utils"]}jquery.min.js'></script>";
    return $rta;
}

function loadJqueryUI() {
    $v = allVars();
    $rta = "";
    $rta .= "<link rel='stylesheet' href='{$v["carpet_utils"]}jquery-ui.css' />";
    $rta .= "<script src='{$v["carpet_utils"]}jquery-ui.min.js'></script>";
    return $rta;
}

function scriptsHeaderOut() {
    $v = allVars();
    print "
<!DOCTYPE html>
<html xmlns='http://www.w3.org/1999/xhtml' {$v["manifest"]}>
<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
    <head>
        <title>Autenticacion {$_SERVER["HTTP_HOST"]} </title>
    </head>
    <body>";

//    echo "<link rel='stylesheet' id='jquery-ui-css'  href='/nwlib6/nwproject/modules/nw_user_session/css/styleOut.css' type='text/css' media='all' />";

    print loadJquery();

    echo "<script type='text/javascript' src='{$v["carpet_main_js"]}main.js'></script>";
}

function endOutHtml() {
//       echo "<link rel='stylesheet' id='jquery-ui-css'  href='/nwlib6/nwproject/modules/nw_user_session/css/styleOut.css' type='text/css' media='all' />";
       echo "<script>

    loadCss('/nwlib6/nwproject/modules/nw_user_session/css/styleOut.css');

</script>";
//         loadJs('/nwlib6/nwproject/modules/nwforms/js/main.js');
    echo "   </body>
</html>";
}

?>