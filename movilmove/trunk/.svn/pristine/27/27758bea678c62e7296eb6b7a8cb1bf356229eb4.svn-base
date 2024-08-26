<?php

//http://stackoverflow.com/questions/18382740/cors-not-working-php
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}
//$usedOutNwlib = true;

require_once dirname(__FILE__) . "/_mod.inc.php";
NWLib::requireOnceModule("rpc/nwjsonrpc.inc.php");

//ini_set("display_errors", 0);
//ini_set("error_reporting", E_ALL | E_NOTICE | E_STRICT);
$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
date_default_timezone_set('America/Bogota');
if ($hostname == "rmovil.gruponw.com" || $hostname == "rmovil.movilmove.com") {
//date_default_timezone_set('America/Mexico_City');
    date_default_timezone_set('America/Chihuahua');
}
if ($hostname == "transdal.movilmove.com" || $hostname == "transdal.gruponw.com") {
    date_default_timezone_set('America/Santiago');
}
//    date_default_timezone_set('America/Santiago');
//session_set_cookie_params(3600 * 2);

//$db = new NWDatabase($cfg["dbDriver"]);
//$db->setHostName($cfg["dbHost"]);
//if (isset($cfg["dbPort"]) && $cfg["dbPort"] != "") {
//    $db->setPort($cfg["dbPort"]);
//}
//$db->setDatabaseName($cfg["dbName"]);
//$db->setUserName($cfg["dbUser"]);
//$db->setPassword($cfg["dbPassword"]);
//$db->open_();

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
    NWJSonRpcServer::process();
}