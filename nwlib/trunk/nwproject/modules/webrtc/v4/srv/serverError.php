<?php

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
$usedOutNwlib = true;
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
$p = $_POST;
$p = json_encode($p);
//print_r($p);
//return;
$a = Array();
$a["error_text"] = "Ringow serverError.php ERROR:" . $p;
$a["program_name"] = "Ringow serverError.php {$_SERVER["HTTP_HOST"]}";
nwMaker::sendError($a);

