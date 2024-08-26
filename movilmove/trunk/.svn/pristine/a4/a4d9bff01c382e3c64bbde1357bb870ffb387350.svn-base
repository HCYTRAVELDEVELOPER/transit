<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$p = Array();
$p["MJ_APIKEY_PUBLIC"] = "38ae35bee56d0994aea0d66cdc1cef5d";
$p["MJ_APIKEY_PRIVATE"] = "bc3a48af9bca3525adb6210dbbefc154";

$p["subject"] = "Hola que tal {name}!";
$p["body"] = "Esta es una prueba, tranquilo {name}!";
$p["from_email"] = "info@app.movilmove.com";
$p["from_name"] = "NetCar";

$p["contacts"] = Array();

$p["contacts"][0] = [];
$p["contacts"][0]["email"] = "orionjafe@gmail.com";
$p["contacts"][0]["name"] = "Alexander Flórez";

$p["contacts"][1] = [];
$p["contacts"][1]["email"] = "alexf@gruponw.com";
$p["contacts"][1]["name"] = "Alexander Grupo Nw";

$p["contacts"][2] = [];
$p["contacts"][2]["email"] = "alexf@netwoods.net";
$p["contacts"][2]["name"] = "Alexander Netwoods";

$p["contacts"][3] = [];
$p["contacts"][3]["email"] = "orionjafe@hotmail.com";
$p["contacts"][3]["name"] = "Alexander Hotmail";

$r = nwMaker::sendEmailMasivo($p);

print_r($r);
