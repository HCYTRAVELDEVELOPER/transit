<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
//$id_cliente = $_POST["id_cliente"];
//$sessionID = session_id();
$zona = "";
if (isset($_GET["zona"])) {
    $zona = $_GET["zona"];
}
if (isset($_POST["zona"])) {
    $zona = $_POST["zona"];
}
if ($zona == "") {
    echo "Lo sentimos! No fue posible.";
    return;
}
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$db->transaction();
$si = session::getInfo();

$ca->prepareSelect("terminales", "*", "id=:id");
$ca->bindValue(":id", $zona);
if (!$ca->exec()) {
    $db->rollback();
    echo "Error. " . $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "No existe la terminal";
    return false;
}
$t = $ca->flush();

$ca->prepareUpdate("terminales", "pos_x,pos_y,zoom", "id=:id");
$ca->bindValue(":id", $zona);
$ca->bindValue(":pos_x", $p["pos_x"]);
$ca->bindValue(":pos_y", $p["pos_y"]);
$ca->bindValue(":zoom", $p["zoom"]);
if (!$ca->exec()) {
    $db->rollback();
    echo "Error. " . $ca->lastErrorText();
    return;
}
$ca->prepareDelete("pv_tiendas_direcciones", "terminal=:zona");
$ca->bindValue(":zona", $zona);
if (!$ca->exec()) {
    $db->rollback();
    echo "Error. " . $ca->lastErrorText();
    return;
}

if (isset($p["poligonos"])) {
    $totalPoligonos = count($p["poligonos"]);
    if ($totalPoligonos > 0) {
        
        $table = "pv_tiendas_direcciones";
        $fields = "pos_x, pos_y,terminal,usuario,empresa,terminal_text,empresa_cliente";
        
        foreach ($p["poligonos"] as $r) {
            $ca->prepareInsert($table, $fields);
            $ca->bindValue(":pos_x", $r['leng']);
            $ca->bindValue(":pos_y", $r['long']);
            $ca->bindValue(":terminal", $zona);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":terminal_text", $t["nombre"]);
            $ca->bindValue(":empresa_cliente", $t["tienda_nwscliente"]);
            if (!$ca->exec()) {
                $db->rollback();
                echo "Error. " . $ca->lastErrorText();
                return;
            }
        }
    }
}
$db->commit();
return true;
?>
