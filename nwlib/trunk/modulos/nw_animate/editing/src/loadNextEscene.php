<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cb->prepareSelect("nwanimate_escenas", "orden", "id=:id_escena");
$cb->bindValue(":id_escena", $p["id_escena"]);
if (!$cb->exec()) {
    echo "Error" . $cb->lastErrorText();
    return;
}
$cb->next();
$ra = $cb->assoc();

$ca->prepareSelect("nwanimate_escenas", "id, duracion, transicion, background, transicion_final", "id_enc=:id_enc and id<>:id_escena and orden>:orden order by orden asc limit 1");
$ca->bindValue(":id_enc", $p["id_enc"]);
$ca->bindValue(":id_escena", $p["id_escena"]);
$ca->bindValue(":orden", $ra["orden"]);
if (!$ca->exec()) {
    echo "Error" . $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    return;
}
$ca->next();
$r = $ca->assoc();
echo $r["id"] . "," . $r["duracion"] . "," . $r["transicion"] . "," . $r["background"] . "," . $r["transicion_final"];
?>
