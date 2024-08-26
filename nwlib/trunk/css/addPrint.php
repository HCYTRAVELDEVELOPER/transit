<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
error_reporting(E_ALL);

if (session_id() == null) {
    session_start();
}
$p = $_GET;
if (!isset($p["id"])) {
    return;
}
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

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$ca->prepareSelect("nw_print_forms", "*", "id=:id");
$ca->bindValue(":id", $p["id"]);
if (!$ca->exec()) {
    echo "Error al consultar la configuración. " . $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    return 0;
}
$r = $ca->flush();
?>
<!DOCTYPE html>
<html id='xhtmlEnc' xmlns="<?php echo $protocolo; ?>://www.w3.org/1999/xhtml" xmlns:fb="<?php echo $protocolo; ?>://www.facebook.com/2008/fbml" xmlns:og="<?php echo $protocolo; ?>://ogp.me/ns#" xml:lang="es-ES">
    <head>
        <title>Printer Principal Skinner</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="generator" content="gruponw" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <?php
        echo "<link href='/nwlib6/css/addPrint2.css' rel='stylesheet' type='text/css' />";
        echo '<script src="/nwlib6/css/addPrint.js"></script>';
        ?>
    </head>
    <body>
        <?php
        echo $r["html"];
        ?>
    </body>
</html>
