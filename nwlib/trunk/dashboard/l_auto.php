<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$table = $_GET["table"];
$where = "1=1";
if (isset($_GET["id"]) != "") {
    $where .= " and id=:id";
}
if (isset($_GET["usuario"])) {
    $where .= " and usuario=:usuario";
}
if (isset($_GET["fecha_inicial"]) && isset($_GET["fecha_final"])) {
    $where .= " and fecha between :fecha_inicial and :fecha_final ";
}
$ca->prepareSelect($table, "*", $where);
$ca->bindValue(":fecha_inicial", $_GET["fecha_inicial"]);
$ca->bindValue(":fecha_final", $_GET["fecha_final"]);
$ca->bindValue(":usuario", $_GET["usuario"]);
$ca->bindValue(":id", $_GET["id"]);
if (!$ca->exec()) {
    echo "No se pudo";
    return;
}
if ($ca->size() == 0) {
    echo "No hay registros";
    return;
}
echo "<table border='1' style='border-collapse: collapse;'>";
$info_tabla = "SELECT * FROM information_schema.columns WHERE table_name = '$table'";
$cb->prepare($info_tabla);
if (!$cb->exec()) {
    echo "No se pudo";
    return;
}
$mete = "";
echo "<tr>";
for ($ii = 0; $ii < $cb->size(); $ii++) {
    $cb->next();
    $tb = $cb->assoc();
    $mete .= $tb["column_name"] . ",";
}
//$mete .= "sisisi,";
$val = explode(",", $mete);
$columns = count($val) - 1;
$totalColumns = $columns;
$iiii = 0;
while ($iiii < $totalColumns) {
    echo "<td>" . $val[$iiii] . "</td>";
    $iiii++;
}
echo "</tr>";
for ($iii = 0; $iii < $ca->size(); $iii++) {
    $ca->next();
    $r = $ca->assoc();
    echo "<tr>";
    $i = 0;
    while ($i < $totalColumns) {
        if (!isset($r[$val[$i]])) {
            echo "<td></td>";
        } else {
            echo "<td>" . $r[$val[$i]] . "</td>";
        }
        $i++;
    }
    echo "</tr>";
}
echo "</table>";
?>
