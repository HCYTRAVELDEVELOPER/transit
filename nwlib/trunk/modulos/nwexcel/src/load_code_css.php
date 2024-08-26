<?php
if(!isset($_POST["id"])) {
    return;
}
if($_POST["id"] == "") {
    return;
}
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwexcel_files", "*", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
$text = "";
if ($ca->size() > 0) {
    $ca->next();
    $r = $ca->assoc();
    $text = $r["code_css"];
}
echo $text;
?>