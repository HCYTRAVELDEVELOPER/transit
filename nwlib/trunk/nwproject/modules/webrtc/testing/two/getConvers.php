<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$p = $_POST;
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$ca->prepareSelect("sop_visitantes", "userscallintern,userscallintern_d,last_message", "terminal=:terminal and tipo='chat' and (userscallintern=:usuario or userscallintern_d=:usuario) order by date_last_message desc ");
$ca->bindValue(":terminal", $p["term"], true, true);
$ca->bindValue(":usuario", $p["user"], true, true);
//$ca->bindValue(":apikey", $p["apikey"], true, true);
if (!$ca->exec()) {
    $a = Array();
    $a["error_text"] = $ca->lastErrorText();
    $a["program_name"] = "Ringow getConvers.php {$_SERVER["HTTP_HOST"]}";
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
