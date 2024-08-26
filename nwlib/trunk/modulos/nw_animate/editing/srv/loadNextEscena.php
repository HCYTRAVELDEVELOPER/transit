<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$id = $_POST["escena"];
$ca->prepareSelect("nwanimate_escenas", "id_enc,orden", "id=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo "No se pudo insertar el orden";
    return;
}
$ca->next();
$d = $ca->assoc();
$where = " and id_enc=:id_enc  ";
$order = "";
if ($_POST["control"] != "escenaById") {
    $where .= " and id<>:id  ";
}
if ($_POST["control"] == "next") {
    $where .= " and orden>:orden ";
    $order = " order by orden asc ";
} else
if ($_POST["control"] == "back") {
    $where .= " and orden<:orden ";
    $order = " order by orden desc ";
} else
if ($_POST["control"] == "escenaById") {
    $where .= " and id=:id";
}
$where1 = " publicado IS NULL {$where} or publicado='SI' {$where} {$order}  limit 1";
$ca->prepareSelect("nwanimate_escenas", "id", $where1);
$ca->bindValue(":id", $id);
$ca->bindValue(":id_enc", $d["id_enc"]);
$ca->bindValue(":orden", $d["orden"]);
if (!$ca->exec()) {
    echo "Error: " . $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "no";
} else {
    $ca->next();
    $r = $ca->assoc();
    echo $r["id"];
}
?>
