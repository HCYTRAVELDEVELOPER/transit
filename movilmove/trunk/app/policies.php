<?php
$usedOutNwlib = true;
//require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("edo_policies", "*", "empresa=:empresa and perfil=:perfil");
$ca->bindValue(":empresa", $_GET["empresa"]);
$ca->bindValue(":perfil", $_GET["perfil"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
if ($ca->size() == 0) {
    echo "Políticas no existe";
    return false;
}
$enc = $ca->flush();
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Políticas de privacidad</title>
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta charset="utf-8">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <style>
            html,
            body {
                height: 100%;
                margin: 0;
                padding: 0;
                font-family: arial;
            }
            .containerMainPolicies{
                position: relative;
                margin: auto;
                max-width: 1000px;
                margin-top: 30px;
                box-shadow: 0px 0px 5px #ccc;
                height: 100%;
                padding: 20px;
                box-sizing: border-box;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="containerMainPolicies">
            <?php
            echo $enc["body"];
            ?>
        </div>
    </body>
</html>