<?php
//$testnwmaker2 = false;
$testnwmaker2 = true;

if (isset($_GET["edite"])) {
    if ($_GET["edite"] == "TrueEditNW") {
        return;
    }
}

if ($testnwmaker2) {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/nwproject/modules/nw_user_session/main.inc.php";
} else {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/varsGlobals.php";

    if (!isset($_SESSION)) {
        session_start();
    }
    if (session_id() == "") {
        session_start();
    }
    $get = nwprojectOut::getGetNwProject();

    $nwproject = true;
    if (!isset($get["url_sites"])) {
        $nwproject = false;
    } else
    if ($get["url_sites"] == "") {
        $nwproject = false;
    }

    if (isset($get["edite"])) {
        if ($get["edite"] == "TrueEditNW") {
            return;
        }
    }
    $v = allVars();
    $configLogin = nwpMakerLoginConfig();
    if ($configLogin["html_encabezado"] != null && $configLogin["html_encabezado"] != "" && $configLogin["html_encabezado"] != "0") {
        print "<div class='encNwMaker'>";
        print $configLogin["html_encabezado"];
        print "</div>";
    }

    if (!$nwproject) {
        print scriptsHeaderOut();
    }

    print loadJqueryUI();
    print loadCss();
    ?>
    <div class="loginnw" carpet_module="/nwlib6/nwproject/modules/nw_user_session/" url_sites="<?php echo $v["url_sites"]; ?>" ></div>
    <?php
    if (isset($get["recover_pass"])) {
        print recoverPass();
    } else {
        print jsIndex();
    }
    if ($configLogin["html_footer"] != null && $configLogin["html_footer"] != "" && $configLogin["html_footer"] != "0") {
        print "<div class='encNwMaker'>";
        print $configLogin["html_footer"];
        print "</div>";
    }
    if (!isset($get["url_sites"])) {
        print endOutHtml();
    }
}

?>