<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cc = new NWDbQuery($db);

$si = session::info();
$tabla = "nwanimate_objetos";
$total = 0;
if (isset($p["id"])) {
    $cb->prepareSelect($tabla, "*", "id=:id");
    $cb->bindValue(":id", $p["id"]);
    if (!$cb->exec()) {
        echo "error al consultar $tabla";
        return;
    }
    $total = $cb->size();
}
$orden = 1;
$cc->prepareSelect($tabla, "orden", "id_escena=:id order by orden desc");
$cc->bindValue(":id", $p["escena"]);
if (!$cc->exec()) {
    echo "error al consultar line 33";
    return;
}
$total_cc = $cc->size();
if ($total_cc == 0) {
    $orden = 1;
} else {
    $cc->next();
    $obConsult = $cc->assoc();
    $orden = $obConsult["orden"] + 1;
}
if (isset($p["orden"])) {
    $orden = $p["orden"];
}
$pos_x = 1;
$pos_y = 1;
$width = 100;
$height = 100;
$movimiento = "no";
$reproducir = "no";
$tipo = "";
$color = "";
$rotacion = "";
$tipo_figura = "";
if (isset($p["tipo_figura"])) {
    $tipo_figura = $p["tipo_figura"];
}
if (isset($p["rotacion"])) {
    $rotacion = $p["rotacion"];
}
if (isset($p["color"])) {
    $color = $p["color"];
}
if (isset($p["tipo"])) {
    $tipo = $p["tipo"];
}
if (isset($p["pos_x"])) {
    $pos_x = $p["pos_x"];
}
if (isset($p["pos_y"])) {
    $pos_y = $p["pos_y"];
}
if (isset($p["width"])) {
    $width = $p["width"];
}
if (isset($p["height"])) {
    $height = $p["height"];
}
if (isset($p["movimiento"])) {
    $movimiento = $p["movimiento"];
}
if (isset($p["reproducir"])) {
    $reproducir = $p["reproducir"];
}
$imagen = "";
$des = "";
$repet = "";
$animado = "";
if (isset($p["imagen"])) {
    if ($p["imagen"] != "") {
        $imagen = $p["imagen"];
    }
}
if (isset($p["descripcion"])) {
    if ($p["descripcion"] != "") {
        $des = $p["descripcion"];
    }
}
if (isset($p["repeticiones"])) {
    if ($p["repeticiones"] != "") {
        $repet = $p["repeticiones"];
    }
}
if (isset($p["animado"])) {
    if ($p["animado"] != "") {
        $animado = $p["animado"];
    }
}
//if ($tipo == "text") {
$ca->setCleanHtml(false);
//}
if ($total == 1) {
    $cb->next();
    $r = $cb->assoc();
    $id_ob = $r["id"];
    $fields = "id, pos_x, pos_y, imagen,nombre,descripcion,fecha,usuario,empresa,animado, repeticiones, width, height, movimiento, reproducir, orden, rotacion, color, tipo_figura";
    $ca->prepareUpdate($tabla, $fields, "id=:id");
    $ca->bindValue(":id", $id_ob);
} else {
    $id_ob = master::getNextSequence("nwanimate_objetos_id_seq");
    $fields = "id, imagen,pos_x, pos_y, id_enc, id_escena,nombre,descripcion,fecha,usuario,empresa,animado, repeticiones, width, height, movimiento, orden, tipo, rotacion, color, tipo_figura";
    $ca->prepareInsert($tabla, $fields);
    $ca->bindValue(":id", $id_ob);
    $ca->bindValue(":id_enc", $p["id_enc"]);
    $ca->bindValue(":id_escena", $p["escena"]);
}
$ca->bindValue(":pos_x", $pos_x);
$ca->bindValue(":pos_y", $pos_y);
$ca->bindValue(":width", $width);
$ca->bindValue(":height", $height);
$ca->bindValue(":imagen", $imagen);
$ca->bindValue(":repeticiones", $repet);
$ca->bindValue(":nombre", $p["nombre"]);
$ca->bindValue(":descripcion", $des);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":animado", $animado);
$ca->bindValue(":movimiento", $movimiento);
$ca->bindValue(":reproducir", $reproducir);
$ca->bindValue(":orden", $orden);
$ca->bindValue(":tipo", $tipo);
$ca->bindValue(":rotacion", $rotacion);
$ca->bindValue(":color", $color);
$ca->bindValue(":tipo_figura", $tipo_figura);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
}
?>