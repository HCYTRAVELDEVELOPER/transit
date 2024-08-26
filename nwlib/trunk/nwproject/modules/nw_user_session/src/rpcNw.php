<?php

$usedOutNwlib = true;
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
$_GET = nwMaker::cleanArray($_GET);
$_POST = nwMaker::cleanArray($_POST);

//TODO :: se deja la validacion cuando se presente la novedad:: marting 24/06/2020
if (version_compare(phpversion(), "7.3", ">=")) {
    if (is_countable($_POST)) {
        if (count($_POST) == "0") {
            return;
        }
    }
} else {
    if (is_array($_POST)) {
        if (count($_POST) == "0") {
            return;
        }
    }
}
$p = $_POST;

$method = $p["method"];
$service = $p["service"];

//alexf 13 July 2021: Valida si es string
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
