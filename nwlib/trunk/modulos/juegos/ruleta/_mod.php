<?php

error_reporting(0);
//E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT

ini_set("display_errors", 1);

if (!session_id())
//    ini_set('session.cookie_domain', '.gruponw.com');
//session_set_cookie_params(0, '/', '.gruponw.com');
session_start();

date_default_timezone_set("America/Bogota");

$base_name_bd = "PGSQL";

//require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/config.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/conectar/_cfg.inc.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwlib/nwlib.php';
NWLib::requireOnceModule('database/nwdatabase.php');
NWLib::requireOnceModule('jquery/jquery.php');

$db = new NWDatabase();
if ($base_name_bd == "MYSQL") {
    $db->setDriver(NWDatabase::MYSQL);
} else {
    $db->setDriver(NWDatabase::PGSQL);
}
$db->setHostName($cfg["dbHost"]);
$db->setDatabaseName($cfg["dbName"]);
$db->setUserName($cfg["dbUser"]);
$db->setPassword($cfg["dbPassword"]);
$db->open_();
?>
