<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$where = "a.terminal=:terminal";
$where .= " and a.usuario!=:usuario and (a.usuario_recibe=:usuario or a.usuario_recibe like lower('%" . $p["user"] . "%') ) ";
$where .= " and a.leido='NO'";
$ca->prepareSelect("sop_chat a", "a.id,a.visitante,a.usuario,a.texto,a.fecha,a.usuario_recibe,a.foto_usuario,a.foto_usuario_recibe,a.nombre_operador", $where);
$ca->bindValue(":terminal", $p["term"], true, true);
$ca->bindValue(":usuario", $p["user"], true, true);
$ca->bindValue(":usuario_like", $p["user"], true, true);
$ca->bindValue(":apikey", $p["apikey"], true, true);
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow getNotify.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo "Error. " . $ca->lastErrorText();
    return;
}
if ($ca->size() > 0) {
    echo json_encode($ca->assocAll());
    return true;
}
echo "false";
return false;
