<?php
error_log("recibeLocation.php::: Start data location");
return;
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


//$r = '[{\\"fecha\\":\\"2023-09-27 17:15:16\\",\\"tipo\\":\\"EN_RUTA\\",\\"id_usuario\\":\\"6155\\",\\"data_service\\":\\"11\\",\\"serviceActive\\":true,\\"lon\\":-74.0466089,\\"usuario\\":\\"orionjafe@gmail.com\\",\\"empresa\\":\\"49\\",\\"lat\\":4.6815115,\\"perfil\\":\\"2\\"}]';
//$r = str_replace("\\", "", $r);
//$object = json_decode(json_encode($r));
//$object = (object) $r;
//$object = json_decode(json_encode((object) $r), true);
//print_r(json_decode($object));
//$jsonString = json_encode($r);
//$object = json_decode($jsonString);
//$object = json_decode($r);
//print_r($object[0]);
//print_r($object[0]->fecha);
//print_r($object->scalar->usuario);
//echo "<br />";
//print_r($object);
//return;
//error_log("Start data location");
//error_log(json_encode($_POST));
//error_log(json_encode($_GET));
//error_log(json_encode($_REQUEST, true));
//$p = json_encode($_REQUEST, true);
//error_log($p["s"]);

$data = file_get_contents('php://input');
$p = json_encode($data, true);
//error_log($p);
//$jsonString = json_encode($p);

$p = str_replace("\\", "", $p);
$p = substr($p, 1, -1);
error_log($p);

//$object = json_decode($p);
//$jsonString = json_encode($p);
//$object = json_decode($jsonString);

$object = json_decode($p);
//$object = json_decode($jsonString);
//print_r($object[0]->fecha);
//error_log($p["usuario"]);
//return;
//error_log($object["usuario"]);
//error_log($object[0]["usuario"]);
//error_log($object);
//error_log($object[0]->fecha);
//return;

$empresa = $object[0]->empresa;
$id_usuario = $object[0]->id_usuario;
$usuario = $object[0]->usuario;
$perfil = $object[0]->perfil;
$latitud = $object[0]->lat;
$longitud = $object[0]->lon;
$fechaCompleta = $object[0]->fecha;
$fecha = explode(" ", $fechaCompleta)[0];
$hora = explode(" ", $fechaCompleta)[1];

$usedOutNwlib = true;
$bdCronAdd = "localhost";
//require_once "/var/www/movilmove/html/rpcsrv/server.php";
require_once "/var/www/movilmove/trunk/rpcsrv/server.php";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareUpdate("pv_clientes", "latitud,longitud", "empresa=:empresa and usuario=:usuario and perfil=:perfil");
$ca->bindValue(":empresa", $empresa);
$ca->bindValue(":perfil", $empresa);
$ca->bindValue(":usuario", $empresa);
$ca->bindValue(":latitud", $latitud, true, true);
$ca->bindValue(":longitud", $longitud, true, true);
if (!$ca->exec()) {
    nwMaker::error($ca->lastErrorText(), true);
    return false;
}

if (isset($object[0]->data_service)) {
    $a = Array();
    $a["latitud"] = $latitud;
    $a["longitud"] = $longitud;
    $a["latitudEnd"] = $latitud;
    $a["longitudEnd"] = $longitud;
    $a["id_usuario"] = $id_usuario;
    $a["usuario"] = $usuario;
    $a["metros"] = 0;
    $a["id_servicio"] = $object[0]->data_service;
    $a["tipo"] = $object[0]->tipo;
    $a["z_fromlib_fecha_actual_navigator_cliente"] = $fecha;
    $a["z_fromlib_hora_actual_navigator_cliente"] = $hora;
    $a["empresa"] = $empresa;
    if (isset($object[0]->placa)) {
        $a["placa"] = $object[0]->placa;
    }
    servicios_conductor::saveRecorrido($a);
} else
if (isset($object[0]->placa)) {
    $a = Array();
    $a["latitud"] = $latitud;
    $a["longitud"] = $longitud;
    $a["latitudEnd"] = $latitud;
    $a["longitudEnd"] = $longitud;
    $a["id_usuario"] = $id_usuario;
    $a["usuario"] = $usuario;
    $a["z_fromlib_fecha_actual_navigator_cliente"] = $fecha;
    $a["z_fromlib_hora_actual_navigator_cliente"] = $hora;
    $a["empresa"] = $empresa;
    $a["placa"] = $object[0]->placa;
    servicios_conductor::saveRecorrido($a);
}

error_log("End data location");

