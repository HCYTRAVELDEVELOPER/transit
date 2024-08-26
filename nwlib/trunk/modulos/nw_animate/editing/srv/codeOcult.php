<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$ca->setCleanHtml(false);
$p = $_POST;
//$ca->prepareInsert("nwanimate_code", "codigo,id_enc,escena,usuario,empresa,terminal", "id_enc=:id_enc and escena=:escena");
if ($p["id"] != "") {
    $ca->prepareUpdate("nwanimate_code", "codigo,id_enc,escena,usuario,empresa,terminal", "id=:id and id_enc=:id_enc and escena=:escena");
    $ca->bindValue(":id", $p["id"]);
} else {
    $ca->prepareInsert("nwanimate_code", "codigo,id_enc,escena,usuario,empresa,terminal");
}
$ca->bindValue(":id_enc", $p["d"]);
$ca->bindValue(":escena", $p["e"]);
$ca->bindValue(":codigo", $p["codigo"]);
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":terminal", $si["terminal"]);
if (!$ca->exec()) {
    $db->rollback();
    echo "Error: " . $ca->lastErrorText();
    return;
} else {
    echo "Realizado correctamente!";
    return true;
}
?>