<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
session::check();
$p = $_POST;
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->setCleanHtml(false);
$si = session::info();
$fields = "id, pos_x,pos_y,hoja,man,categoria,nombre,descripcion,fecha,usuario,empresa,orden,texto_audio,hoja_x,hoja_y,zoom";
if ($p["update"] == "false") {
    $ca->prepareInsert("man_objetos", $fields);
} else {
    $ca->prepareUpdate("man_objetos", $fields, "id=:id");
}
$ca->bindValue(":id", $p["id"]);
$ca->bindValue(":pos_x", $p["pos_x"], true);
$ca->bindValue(":pos_y", $p["pos_y"], true);
$ca->bindValue(":hoja", $p["id_imagen"]);
$ca->bindValue(":man", $p["man"]);
$ca->bindValue(":categoria", $p["categoria"]);
$ca->bindValue(":nombre", $p["nombre"]);
$ca->bindValue(":descripcion", $p["descripcion"]);
$ca->bindValue(":orden", $p["orden"]);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":texto_audio", $p["texto_audio"], true);
$ca->bindValue(":hoja_x", $p["hoja_x"], true);
$ca->bindValue(":hoja_y", $p["hoja_y"], true);
$ca->bindValue(":zoom", $p["zoom"], true);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
} else {
    echo "Guardado correctamente";
}