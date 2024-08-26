<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$id_enc = "";
//$escena = "";
if (isset($_GET["id_enc"])) {
    $id_enc = $_GET["id_enc"];
}
if (isset($_POST["id_enc"])) {
    $id_enc = $_POST["id_enc"];
}
//if (isset($_GET["escena"])) {
//    $escena = $_GET["escena"];
//}
//if (isset($_POST["escena"])) {
//    $escena = $_POST["escena"];
//}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$where = " and id_enc=:id_enc ";
$ca->prepareSelect("nwanimate_escenas", "id", "publicado IS NULL {$where} or publicado='SI' {$where} order by orden asc ");
//$ca->bindValue(":escena", $escena);
$ca->bindValue(":id_enc", $id_enc);
if (!$ca->exec()) {
    echo "Error:" . $ca->lastErrorText();
    return;
}
$total = $ca->size();
$escenas = "";
for ($i = 0; $i < $total; $i++) {
    $num = $i + 1;
    $r = $ca->flush();
    $separador = ",";
    if ($i == $total - 1) {
        $separador = "";
    }
    $escenas .= $r["id"] . $separador;
}
$result = $total . ";" .$escenas;
print json_encode($result);
return true;
?>