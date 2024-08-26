<?php

include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$p = $_POST;
$fields = "id_documento, campo_div, campo_max, campo_min, igual, colormax, colormin, colorigual, colornormal, usuario, empresa";
if ($p["id"] != "") {
    $ca->prepareUpdate("nwexcel_condicionales", $fields, "id=:id");
    $ca->bindValue(":id", $p["id"]);
} else {
    $ca->prepareInsert("nwexcel_condicionales", $fields);
}
$ca->bindValue(":id_documento", $p["id_documento"]);
$ca->bindValue(":campo_div", $p["campo_div"]);
$ca->bindValue(":campo_max", $p["campo_max"]);
$ca->bindValue(":campo_min", $p["campo_min"]);
$ca->bindValue(":igual", $p["igual"]);
$ca->bindValue(":colormax", $p["colormax"]);
$ca->bindValue(":colormin", $p["colormin"]);
$ca->bindValue(":colorigual", $p["colorigual"]);
$ca->bindValue(":colornormal", $p["colornormal"]);
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
?>