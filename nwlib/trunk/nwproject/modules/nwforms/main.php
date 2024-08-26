<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib6/nwproject/modules/nw_user_session/src/info_cliente/varsGlobals.php";
$v = allVars();
require_once $_SERVER["DOCUMENT_ROOT"] . $v["carpet_module_gral"] . 'nwforms/all.inc.php';
//$page_construction = nwproject::getPageConstruction();
$page_construction = "NO";
if (isset($_GET["vista"])) {
    if ($_GET["vista"] == "nwvista") {
        ?>
        <!DOCTYPE html>
        <html>
            <head>
                <title>NwForms - Form <?php echo $_GET["form"]; ?></title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
                <meta name="apple-touch-fullscreen" content="YES" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </head>
            <body>
                <?php
            }
        }
        ?>
        <?php
        /*
        $user_agent = $_SERVER['HTTP_USER_AGENT'];
        $navegador = getBrowser($user_agent);
         *    $browser = NWUtils::getBrowser();
        if ($navegador === "Google Chrome") {
            ?>
            <link rel='preload' href='<?php echo $v["carpet_module_gral"]; ?>nwforms/css/style.css?v=1' as='style' onload="this.rel = 'stylesheet'" />
            <?php
        } else {
            ?>
            <link rel='stylesheet' href='<?php echo $v["carpet_module_gral"]; ?>nwforms/css/style.css?v=1' as='style' />
            <?php
        }
        */
        ?>
        <link rel='stylesheet' href='<?php echo $v["carpet_module_gral"]; ?>nwforms/css/style.css?v=1' as='style' />
        <?php
        if (isset($_GET["vista"])) {
            if ($_GET["vista"] == "nwvista") {
                print nwprojectOut::jqueryLib();
                ?>
                <link href='<?php echo $v["carpet_module_gral"]; ?>nwforms/css/style_vista.css?v=1' rel='stylesheet' type='text/css' />
                <link href='<?php echo $v["carpet_module_gral"]; ?>nw_user_session/css/nwdialog.css?v=1' rel='stylesheet' type='text/css' />
                <?php
            }
        }
        ?>
        <?php
        $showScripts = true;

        if (!isset($_SESSION["load_nwmaker"])) {
            $showScripts = true;
        } else {
            $showScripts = false;
        }
        if (isset($_SESSION["nwproject"])) {
            $showScripts = true;
        }
        if (isset($_GET["vista"])) {
            $showScripts = true;
        }
        if ($showScripts === true) {
            global $createYaNwForm;
            if (!isset($createYaNwForm)) {
                ?>
                <script async defer type='text/javascript' src='<?php echo $v["carpet_module_gral"]; ?>nwforms/js/main.js' /></script>
            <?php
            global $createYaNwForm;
            $createYaNwForm = true;
        }
    }
    if (!isset($nwtablemaker)) {
        $nwtablemaker = "";
    }
    $idForm = "";
    if (isset($_GET["form"])) {
        $idForm = $_GET["form"];
    }
    if ($idForm == "createFormByTable") {
        print_r(loadFormsMain($idForm, $nwtablemaker));
    } else
    if ($idForm != false && $idForm != "alf") {
        print_r(loadFormsMain($idForm, $nwtablemaker));
    } else {
        ?>
        <script>
        </script>
        <?php
    }
    if (isset($_GET["vista"])) {
        if ($_GET["vista"] == "nwvista") {
            ?>
        </body>
        </html>
        <?php
    }
}