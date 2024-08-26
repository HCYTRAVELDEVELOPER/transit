<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->setCleanHtml(false);
$si = session::info();
$description = "";
$delay = "";
$fields = "pos_x,pos_y,hoja,man,categoria,nombre,fecha,usuario,empresa,id_object, tipo, width, height, id_orden";
if (isset($p["descripcion"])) {
    $description = $p["descripcion"];
    $fields .= ",descripcion";
}
if (isset($p["delay"])) {
    $delay = $p["delay"];
    $fields .= ",delay";
}
//if ($p["id"] == "false") {
//    $ca->prepareInsert("man_otros_objetos", $fields);
//} else {
//    $ca->prepareUpdate("man_otros_objetos", $fields, "id=:id");
//    $ca->bindValue(":id", $p["id"]);
//}
$ca->prepareInsert("man_otros_objetos", $fields);

$ca->bindValue(":pos_x", $p["pos_x"], true);
$ca->bindValue(":pos_y", $p["pos_y"], true);
$ca->bindValue(":hoja", $p["hoja"]);
$ca->bindValue(":man", $p["man"]);
$ca->bindValue(":categoria", $p["categoria"]);
$ca->bindValue(":nombre", $p["nombre"]);
$ca->bindValue(":descripcion", $description);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":id_object", $p["id_object"]);
$ca->bindValue(":tipo", $p["tipo"]);
$ca->bindValue(":width", $p["width"]);
$ca->bindValue(":height", $p["height"]);
$ca->bindValue(":id_orden", $p["id_orden"]);
$ca->bindValue(":delay", $delay);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
}