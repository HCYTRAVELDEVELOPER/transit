<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animate/_mod.php';
}
function updateOb() {
    $p = $_POST;
    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareUpdate("nwanimate_objetos", " pos_x_inicial, pos_y_inicial", "id=:id");
    $ca->bindValue(":id", $p["id"]);
//    $ca->bindValue(":pos_x", $p["pos_x"]);
//    $ca->bindValue(":pos_y", $p["pos_y"]);
//    $ca->bindValue(":pos_x_final", $p["pos_x"]);
//    $ca->bindValue(":pos_y_final", $p["pos_y"]);
    $ca->bindValue(":pos_x_inicial", $p["pos_x"]);
    $ca->bindValue(":pos_y_inicial", $p["pos_y"]);
//    $ca->bindValue(":animado", "si");
    if (!$ca->exec()) {
        echo "Error:" . $ca->lastErrorText();
        return false;
    }
}

function selectOb() {
    $p = $_POST;
    session::check();
    $db = NWDatabase::database();
    $cs = new NWDbQuery($db);
    $cs->prepareSelect("nwanimate_objetos", "pos_x, pos_y", "id=:id");
    $cs->bindValue(":id", $p["id"]);
    if (!$cs->exec()) {
        echo "Error:" . $cs->lastErrorText();
        return false;
    }
    $cs->next();
    return $cs->assoc();
}

$p = $_POST;
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$si = session::info();
$num_animate = 0;
$tabla = "nwanimate_objects_animation";
if (!isset($p["id"])) {
    echo "No hay objeto válido";
    return;
}
$cb->prepareSelect($tabla, "num_animate", "objeto=:objeto and activo='no' order by id desc limit 1");
$cb->bindValue(":objeto", $p["id"]);
if (!$cb->exec()) {
    echo "Error:" . $cb->lastErrorText();
    return false;
}
$velocidad = $p["velocidad"];
//$velocidad = $p["velocidad"] - $p["velocidad_anterior"];
//$delay = $p["velocidad_anterior"];
$delay = $p["velocidad_anterior_ok"];
$total = $cb->size();
if ($total > 0) {
    $cb->next();
    $rr = $cb->assoc();
    $num_animate = $rr["num_animate"] + 1;
//    $objectEnc = selectOb();
//    $x = $p["pos_x"] - $objectEnc["pos_x"];
//    $y = $p["pos_y"] - $objectEnc["pos_y"];
} else {
    updateOb();
    $num_animate = 1;
//    $x = 0;
//    $y = 0;
    $delay = 0;
    $velocidad = 0;
}
if ($velocidad == "") {
    $velocidad = 0;
}
$objectEnc = selectOb();
$x = $p["pos_x"] - $objectEnc["pos_x"];
$y = $p["pos_y"] - $objectEnc["pos_y"];
$fields = "objeto, activo, pos_x, pos_y, velocidad, opacidad, usuario, empresa, num_animate, delay, width, height, easing,rotacion,perspectiveX,perspectiveY";
$ca->prepareInsert($tabla, $fields);
$ca->bindValue(":objeto", $p["id"]);
$ca->bindValue(":activo", "no");
$ca->bindValue(":pos_x", $x);
$ca->bindValue(":pos_y", $y);
$ca->bindValue(":velocidad", $velocidad);
$ca->bindValue(":opacidad", $p["opacidad"]);
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":num_animate", $num_animate);
$ca->bindValue(":delay", $delay);
$ca->bindValue(":width", $p["width"]);
$ca->bindValue(":height", $p["height"]);
$ca->bindValue(":easing", $p["easing_object"]);
$ca->bindValue(":rotacion", $p["rotacion"]);
$ca->bindValue(":perspectiveX", $p["perspectivex"]);
$ca->bindValue(":perspectiveY", $p["perspectivey"]);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return false;
} else {
    echo $p["velocidad"];
}
?>