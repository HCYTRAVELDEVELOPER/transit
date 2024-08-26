<?php
$isApiOut = true;
require_once dirname(__FILE__) . "/_mod.inc.php";
NWLib::requireOnceModule("rpc/nwjsonrest.inc.php");

ini_set("display_errors", 0);
//ini_set("error_reporting", E_ALL | E_NOTICE | E_STRICT);
date_default_timezone_set('America/Bogota');

//session_set_cookie_params(3600 * 2);

$db = new NWDatabase($cfg["dbDriver"]);
$db->setHostName($cfg["dbHost"]);
$db->setDatabaseName($cfg["dbName"]);
$db->setUserName($cfg["dbUser"]);
$db->setPassword($cfg["dbPassword"]);
$db->open_();

$dir = dirname(__FILE__) . "/srv/";
$directorio = opendir($dir);
while ($archivo = readdir($directorio)) {
    if ($archivo == '.' or $archivo == '..') {
        continue;
    } else {
        require_once dirname(__FILE__) . '/srv/' . $archivo;
    }
}
closedir($directorio);
if (!isset($usedOutNwlib)) {
    NWJSonRpcServer::setOption("compress", false);
    NWJSonRpcServer::setOption("delay", 0);
    NWJSonRpcServer::startApi();
}
?>