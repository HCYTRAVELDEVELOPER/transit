<?php

//error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT);
//ini_set("display_errors", 1);

error_reporting(0);
ini_set("display_errors", 1);

//require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/conectar/conectar.php';
//$cfg["dbDriver"] = "MYSQL";
//if ($_SERVER["HTTP_HOST"] == "localhost.loc") {
//    $cfg["appRoot"] = "/";
//    $cfg["dbHost"] = "localhost";
//    $cfg["dbName"] = "netwoods_nwproject";
//    $cfg["dbUser"] = "root";
//    $cfg["dbPassword"] = "alexf08";
//} else {
//    $cfg["appRoot"] = "";
//    $cfg["dbHost"] = $bd_nw["host"];
//    $cfg["dbName"] = $bd_nw["db"];
//    $cfg["dbUser"] = $bd_nw["user"];
//    $cfg["dbPassword"] = $bd_nw["pass"];     
//}

if ($base_name_bd == "MYSQL") {
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/conectar/conectar.php';
    $cfg["dbDriver"] = "MYSQL";
    $cfg["appRoot"] = "/";
    $cfg["dbHost"] = $bd_nw["host"];
    $cfg["dbName"] = $bd_nw["db"];
    $cfg["dbUser"] = $bd_nw["user"];
    $cfg["dbPassword"] = $bd_nw["pass"];
} 
if ($base_name_bd == "PGSQL") {
    $cfg["dbDriver"] = "PGSQL";
    $cfg["appRoot"] = "/";
    $cfg["dbHost"] = "192.168.1.16";
    $cfg["dbName"] = "nwlive";
    $cfg["dbUser"] = "andresf";
    $cfg["dbPassword"] = "padre18";
}

?>