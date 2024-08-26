<?php

if (!session_id()) {
    session_start();
}

require_once dirname(__FILE__) . '/_cfg.inc.php';

if (!isset($cfg["nwlibVersion"])) {
    $cfg["nwlibVersion"] = "";
}

$_SESSION["nwlibVersion"] = $cfg["nwlibVersion"];

require_once dirname(__FILE__) . '/../nwlib' . $cfg["nwlibVersion"] . '/nwlib.inc.php';

if (isset($isApiOut)) {
    NWLib::requireOnceModule("rpc/nwjsonrest.inc.php");
} else {
    NWLib::requireOnceModule("rpc/nwjsonrpc.inc.php");
}

NWLib::requireOnceModule('database/nwdb.inc.php');
NWLib::requireOnceModule('database/nwdbquery.inc.php');

$request = NWJSonRpcServer::request();
$call = json_decode($request, true);

$requireDb = true;

if (isset($call["server_data"]["requireDb"])) {
    $requireDb = false;
}

if ($requireDb) {
    $db = new NWDatabase();
    if (isset($cfg["dbPort"]) && $cfg["dbPort"] != "") {
        $db->setPort($cfg["dbPort"]);
    }
    $db->setDriver($cfg["dbDriver"]);
    $db->setHostName($cfg["dbHost"]);
    $db->setDatabaseName($cfg["dbName"]);
    $db->setUserName($cfg["dbUser"]);
    $db->setPassword($cfg["dbPassword"]);
    $db->open_();
}

if (isset($_SESSION["zona_horaria"]) && $_SESSION["zona_horaria"] !== "") {
    date_default_timezone_set($_SESSION["zona_horaria"]);
} else {
    date_default_timezone_set("America/Bogota");
}

