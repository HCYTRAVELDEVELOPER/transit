<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
<?php
$usedOutNwlib = true;
$saveSession = true;
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";

$protocol = "http";
if (isset($_SERVER["HTTPS"])) {
    if ($_SERVER["HTTPS"] === "on") {
        $protocol = "https";
    }
}
$domain = $protocol . "://" . $_SERVER['SERVER_NAME'];
$si = session::info();
if (!isset($si["usuario"]) || !isset($si["empresa"])) {
    require_once "inicia_sesion.php";
    return;
}
$modules = "";
if(isset($_GET["modules"])) {
    $modules = $_GET["modules"];
}
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("empresas", "ticket_id_customer,ticket_name_customer,razon_social", "id=:id");
$ca->bindValue(":id", $si["empresa"]);
if (!$ca->exec()) {
    print_r($ca->lastErrorText());
    return false;
}
if ($ca->size() === 0) {
    echo "Empresa no existe";
    return false;
}
$r = $ca->flush();
if (!isset($r["ticket_id_customer"]) || $r["ticket_id_customer"] == null || $r["ticket_id_customer"] == "") {
    $r["ticket_id_customer"] = 121;
}
if (!isset($r["ticket_name_customer"]) || $r["ticket_name_customer"] == null || $r["ticket_name_customer"] == "") {
    $r["ticket_name_customer"] = $r["razon_social"];
}
$si["db"] = Array();
$si["db"]["cliente"] = $r["ticket_id_customer"];
$si["db"]["cliente_text"] = $r["ticket_name_customer"];
$si["modules"] = $modules;
$si["db"]["modules"] = $modules;
$json = json_encode($si);
//$dom = "https://nwadmin3.loc";
$dom = "https://nwadmin.gruponw.com";
header("Location: {$dom}/app/tickets_widget/index.php?up={$json}");
