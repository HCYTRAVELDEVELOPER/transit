<?php

//error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT);
ini_set("display_errors", 1);
//$cfg["dbDriver"] = "PGSQL";
$cfg["dbDriver"] = "MYSQL";
$cfg["nwlibVersion"] = "6";
//$_SESSION["nwproject"] = true;
$_SESSION["nwmaker"] = true;
$_SESSION["app_name"] = "movilmove";
$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
if (isset($bdCronAdd) && $bdCronAdd == "localhost" || $hostname == "movilmove.loc" || $hostname == "localhost" ||
        $hostname == "192.168.1.105" ||
        $hostname == "192.168.172.244" ||
        $hostname == "192.168.1.45" ||
        $hostname == "192.168.1.46" ||
        $hostname == "192.168.10.18" ||
        $hostname == "192.168.1.111" ||
        $hostname == "192.168.0.8" ||
        $hostname == "192.168.2.183" ||
        $hostname == "movilmove_trunk.loc"
) {
    $cfg["appRoot"] = "/";

//    $cfg["dbHost"] = "localhost";
//    $cfg["dbName"] = "movilmove_movilmove";
//    $cfg["dbUser"] = "alexf";
//    $cfg["dbPassword"] = '$alexf#';
//    NUEVO SERVIDOR
//    $cfg["dbHost"] = "18.229.190.36";
//    $cfg["dbName"] = "movilmove_test";
//    $cfg["dbUser"] = "desarrollador";
//    $cfg["dbPassword"] = '$NW_2024#';
////    ANTIGUO SERVIDOR
//    $cfg["dbHost"] = "18.229.190.36";
//    $cfg["dbName"] = "movilmove_test";
//    $cfg["dbUser"] = "andresf";
//    $cfg["dbPassword"] = '$V3gas1#';

    $cfg["dbHost"] = "192.168.1.30";
    $cfg["dbName"] = "movilmove_movilmove";
    $cfg["dbUser"] = "developer";
    $cfg["dbPassword"] = 'padre08';

//    $cfg["dbHost"] = "localhost";
//    $cfg["dbName"] = "movilmove_movilmove";
//    $cfg["dbUser"] = "root";
//    $cfg["dbPassword"] = '$alexf#';
//    $cfg["dbHost"] = "18.229.190.36";
////    $cfg["dbName"] = "movilmove_test";
//    $cfg["dbName"] = "movilmove_movilmove";
//    $cfg["dbUser"] = "andresf";
//    $cfg["dbPassword"] = '$V3gas1#';
} else
if ($hostname == "test.movilmove.com" || $hostname == "ultimamilla.sitca.co") {
    $cfg["appRoot"] = "/";
    $cfg["dbHost"] = "172.31.4.156";
    $cfg["dbName"] = "movilmove_test";
    $cfg["dbUser"] = "andresf";
    $cfg["dbPassword"] = '$V3gas1#';
} else
if ($hostname == "eu.movilmove.com") {
    $cfg["appRoot"] = "/";
    $cfg["dbHost"] = "172.31.23.117";
    $cfg["dbName"] = "movilmove_movilmove";
    $cfg["dbUser"] = "andresf";
    $cfg["dbPassword"] = '$V3gas1#';
} else if ($hostname == "app.movilmove.com" || $hostname == "app.transfershcy.com" || $hostname == "staging.movilmove.com") {
    $cfg["appRoot"] = "/";
    $cfg["dbHost"] = "172.31.4.156";
    $cfg["dbName"] = "movilmove_movilmove";
    $cfg["dbUser"] = "andresf";
    $cfg["dbPassword"] = '$V3gas1#';
} else {
    $cfg["appRoot"] = "/";
    $cfg["dbHost"] = "172.31.14.225";
    $cfg["dbName"] = "movilmove_movilmove";
    $cfg["dbUser"] = "andresf";
    $cfg["dbPassword"] = '$V3gas1#';
}