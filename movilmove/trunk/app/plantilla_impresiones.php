<?php
$usedOutNwlib = true;
//require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";

$pass = Array();
$cond = Array();
$vehiculo = Array();
$fotos = Array();
$fotos_html = "";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);

if ($_GET["tipo"] == "VER_INFORME_CONDUCTOR") {
    if ($_GET["fecha_inicio"] != "" && $_GET["fecha_final"] != "") {
        $where = "conductor_id=:id and estado='LLEGADA_DESTINO' and fecha between :fecha_inicio and :fecha_fin ";
        $ca->bindValue(":fecha_inicio", $_GET["fecha_inicio"]);
        $ca->bindValue(":fecha_fin", $_GET["fecha_final"]);
    } else {
        echo "Por favor ingrese un rango de fechas";
        return false;
    }
} else {
    $where = "id=:id";
}

$ca->prepareSelect("edo_servicios", "*", $where);
$ca->bindValue(":id", $_GET["id_service"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
if ($ca->size() == 0) {
    echo "Servicio no existe";
    return false;
}
$enc = $ca->flush();
$enc_res = $ca->assocAll();

$tot = 0;
$countservice = 0;
for ($i = 0; $i < count($enc_res); $i++) {
    $tot = $tot + $enc_res[$i]["valor_total_servicio"];
    $countservice++;
}

$res_service["count_service"] = $countservice;
$res_service["total_service"] = $tot;

$ca->prepareSelect("edo_plantillas_impresiones", "*", "tipo=:tipo and empresa=:empresa");
$ca->bindValue(":tipo", $_GET["tipo"]);
$ca->bindValue(":empresa", $enc["empresa"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
if ($ca->size() == 0) {
    echo "Plantilla {$_GET["tipo"]} no existe";
    return false;
}
$pl = $ca->flush();
$body = $pl["body"];

if (isset($enc["id_usuario"]) && nwMaker::evalueData($enc["id_usuario"])) {
    $ca->prepareSelect("pv_clientes", "*", "id=:id");
    $ca->bindValue(":id", $enc["id_usuario"]);
    if (!$ca->exec()) {
        return nwMaker::error($ca->lastErrorText());
    }
    if ($ca->size() > 0) {
        $pass = $ca->flush();
    }
}

if (isset($enc["conductor_id"]) && nwMaker::evalueData($enc["conductor_id"])) {
    $ca->prepareSelect("pv_clientes", "*", "id=:id");
    $ca->bindValue(":id", $enc["conductor_id"]);
    if (!$ca->exec()) {
        return nwMaker::error($ca->lastErrorText());
    }
    if ($ca->size() > 0) {
        $cond = $ca->flush();
    }
}
if (isset($enc["vehiculo"]) && nwMaker::evalueData($enc["vehiculo"])) {
    $ca->prepareSelect("edo_vehiculos", "*", "id=:id");
    $ca->bindValue(":id", $enc["vehiculo"]);
    if (!$ca->exec()) {
        return nwMaker::error($ca->lastErrorText());
    }
    if ($ca->size() > 0) {
        $vehiculo = $ca->flush();
    }
}


$ca->prepareSelect("edo_fotos_relacionadas", "imagen,comentarios", "id_servicio=:id");
$ca->bindValue(":id", $enc["id"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
if ($ca->size() > 0) {
    $fotos = $ca->assocAll();
    $tfotos = count($fotos);
    for ($i = 0; $i < $tfotos; $i++) {
        $f = $fotos[$i];
        $fotos_html .= "<div><img src='{$f["imagen"]}' class='fotos_rel' style='max-width: 500px;' /> <p>{$f["comentarios"]}</p> </div>";
    }
}


foreach ($enc as $key => $val) {
    $body = str_replace('{' . $key . '}', $val, $body);
}
foreach ($pass as $key => $val) {
    $body = str_replace('{pasajero_' . $key . '}', $val, $body);
}
foreach ($cond as $key => $val) {
    $body = str_replace('{conductor_' . $key . '}', $val, $body);
}
foreach ($vehiculo as $key => $val) {
    $body = str_replace('{vehiculo_' . $key . '}', $val, $body);
}
foreach ($res_service as $key => $val) {
    $body = str_replace('{' . $key . '}', $val, $body);
}

$body = str_replace('{fotos_relacionadas}', $fotos_html, $body);
?>
<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $_GET["tipo"] . " Emp: " . $enc["empresa"]; ?></title>
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta charset="utf-8">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <style>
            html,
            body {
                height: 100%;
                margin: 0;
                padding: 0;
                font-family: arial;
            }
            .containerMainPolicies{
                position: relative;
                margin: auto;
                max-width: 1000px;
                margin-top: 30px;
                box-shadow: 0px 0px 5px #ccc;
                height: 100%;
                padding: 20px;
                box-sizing: border-box;
                border-radius: 5px;
            }
        </style>
    </head>
    <body>
        <div class="containerMainPolicies">
            <?php
            echo $body;
            ?>
        </div>
    </body>
</html>