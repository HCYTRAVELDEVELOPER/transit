<?php

if (!isset($_POST["id"])) {
    return;
}
if ($_POST["id"] == "") {
    return;
}
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$text = "";
$ca->prepareSelect("nwexcel_files", "*", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
if ($ca->size() > 0) {
    $ca->next();
    $r = $ca->assoc();
    $text .= $r["code_js"];
}
//$cb = new NWDbQuery($db);
//$cb->prepareSelect("nwexcel_condicionales", "*", "id_documento=:id");
//$cb->bindValue(":id", $_POST["id"]);
//if (!$cb->exec()) {
//    echo "Error . " . $cb->lastErrorText();
//    return;
//}
//$total = $cb->size();
//if ($total > 0) {
//    for ($i = 0; $i < $total; $i++) {
//        $cb->next();
//        $ra = $cb->assoc();
//        $div = "$('#{$ra["campo_div"]}')";
//        $text .= " compara_valores({$div}, '{$ra["campo_max"]}', '{$ra["campo_min"]}', '{$ra["igual"]}', '{$ra["colormax"]}', '{$ra["colormin"]}', '{$ra["colorigual"]}', '{$ra["colornormal"]}');";
//    }
//}
echo $text;
?>