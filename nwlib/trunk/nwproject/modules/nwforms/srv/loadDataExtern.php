<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect($p["table"], $p["fields"], " 1=1 ");
if (!$ca->exec()) {
    return "Error. " . $ca->lastErrorText();
}
$data = array();
$total = $ca->size();
for ($i = 0; $i < $total; $i++) {
    $r = $ca->flush();
    $data[$i] = $r;
}
print json_encode($data);
return true;
?>