<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$si = session::info();
$tabla = "nwanimate_objetos";
$cb->prepareSelect($tabla, "*", "id=:id");
$cb->bindValue(":id", $p["id"]);
if (!$cb->exec()) {
    echo "Error:" . $cb->lastErrorText();
    return false;
}
$cb->next();
$r = $cb->assoc();
$animado = "";
if (isset($p["animado"])) {
    $animado = $p["animado"];
}
$mov = "";
if (isset($p["movimiento"])) {
    $mov = $p["movimiento"];
}
$rep = "";
if (isset($p["reproducir"])) {
    $rep = $p["reproducir"];
}
$orden = "";
if (isset($p["orden"])) {
    $orden = $p["orden"];
}
$id_ob = master::getNextSequence("nwanimate_objetos_id_seq");
$fields = "id, imagen,pos_x, pos_y, id_enc, id_escena,nombre,descripcion,fecha,usuario,empresa,animado, repeticiones, width, height, orden";
$ca->prepareInsert($tabla, $fields);
$ca->bindValue(":id", $id_ob);
$ca->bindValue(":id_enc", $r["id_enc"]);
$ca->bindValue(":id_escena", $r["id_escena"]);
$ca->bindValue(":pos_x", $r["pos_x"]);
$ca->bindValue(":pos_y", $r["pos_y"]);
$ca->bindValue(":width", $r["width"]);
$ca->bindValue(":height", $r["height"]);
$ca->bindValue(":imagen", $r["imagen"]);
$ca->bindValue(":repeticiones", $r["repeticiones"]);
$ca->bindValue(":nombre", $r["nombre"] . "(Copia $id_ob)");
$ca->bindValue(":descripcion", $r["descripcion"]);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":animado", $animado);
$ca->bindValue(":movimiento", $mov);
$ca->bindValue(":reproducir", $rep);
$ca->bindValue(":orden", $orden);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
}
?>