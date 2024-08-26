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
$usedOutNwlib = true;
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
$_GET = nwMaker::cleanArray($_GET);
$_POST = nwMaker::cleanArray($_POST);
if (!function_exists('is_countable')) {
    function is_countable($var) {
        return (is_array($var) || $var instanceof Countable);
    }
}
if (count(is_countable($_POST) ? $_POST : []) == "0") {
    return;
}
$p = $_POST;
$method = $p["method"];
$service = $p["service"];
try {
    if (!is_string($method)) {
        print nwMaker::error("Error en rpcNw, no es string: method: {$method} JSON: " . json_encode($p));
        return false;
    }
    if (!is_string($service)) {
        print nwMaker::error("Error en rpcNw, no es string: service: {$service} JSON: " . json_encode($p));
        return false;
    }
} catch (Exception $e) {
    print nwMaker::error('Excepción capturada: ', $e->getMessage(), "\n");
    return false;
}
print json_encode($service::$method($p));
return true;