
<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
//session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$where1 = " and id_enc=:id ";
$ca->prepareSelect("nwanimate_escenas", "id,nombre", "publicado IS NULL {$where1} or publicado='SI' {$where1} order by orden asc");
$ca->bindValue(":id", $p["id"]);
if (!$ca->exec()) {
    return "Error:" . $ca->lastErrorText();
}
$total = $ca->size();
if ($total == 0) {
    return "No hay registros";
}
$data = "";
for ($i = 0; $i < $total; $i++) {
    $num = $i + 1;
    $r = $ca->flush();
    $data .= "<div class='bloqEscena' >";
    $data .= "<div class='bloqEscenaInt bloqEscenaPage{$r["id"]}' data='{$r["id"]}' data-title='{$r["nombre"]}' data-page='{$num}' >";
    $data .= "<h3>";
    $data .= $r["nombre"];
    $data .= "</h3>";
    $data .= "</div>";
    $data .= "<p class='paginaItemMenu'>{$num}</p>";
    $data .= "</div>";
}
print json_encode($data);
return true;
?>
