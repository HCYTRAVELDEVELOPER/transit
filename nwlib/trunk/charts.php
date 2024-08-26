<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$id = $_GET["id"];
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$ca->prepareSelect("nw_reports_enc", "*", "id=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "El informe posee problemas técnicos. Se ha enviado un informe del error. Puede comunicarse con las líneas 6824080";
    return;
}
$ca->next();
$r = $ca->assoc();
$ca->prepareSelect("nw_reports_cols", "*", "reporte=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
$titles = Array();
for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $ra = $ca->assoc();
    $titles[] = $ra["nombre"];
}
$ca->prepareSelect("nw_reports_filters", "*", "reporte=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
$filters = Array();
for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $rb = $ca->assoc();
    $filters[] = $rb;
    $quote = "";
    if ($rb["type"] == "dateField") {
        $quote = "'";
    }
    if ($rb["required"] == 1 && $_GET[$rb["nombre"]] == "") {
        echo "Debe ingresar un valor en el campo " . $rb["label"];
        return;
    }
    if ($_GET[$rb["nombre"]] != "null") {
        if ($_GET[$rb["nombre"]] != "") {
            $r["sql_query"] = str_replace(":" . $rb["nombre"], $quote . $_GET[$rb["nombre"]] . $quote, $r["sql_query"]);
        }
    }
}
$cb->prepare(str_replace("$", "'", $r["sql_query"]));
for ($i = 0; $i < count($filters); $i++) {
    if (isset($_GET[$filters[$i]["nombre"]])) {
        if ($_GET[$filters[$i]["nombre"]] != "null") {
            if ($_GET[$filters[$i]["nombre"]] != "") {
                $cb->bindValue(":" . $filters[$i]["nombre"], $_GET[$filters[$i]["nombre"]], true);
            }
        }
    }
}
if (!$cb->exec()) {
    echo $cb->lastErrorText();
    return;
}
$cb->next();
$rb = $cb->assoc();
if ($r["tipo"] == 1) {
    include dirname(__FILE__) . "/charts/column.php";
} else if ($r["tipo"] == 2) {
    include dirname(__FILE__) . "/charts/pie.php";
}
?>