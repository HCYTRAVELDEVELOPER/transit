<?php
//require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$usedOutNwlib = true;
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/server.php";

require_once $_SERVER["DOCUMENT_ROOT"] . '/nwlib' . master::getNwlibVersion() . '/phpqrcode/qrlib.php';

$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
$id = $_GET["service"];

$db = NWDatabase::database();
$ca = new NWDbQuery($db);

$ca->prepareSelect("edo_servicios", "*", "id=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() == 0) {
    echo "No existen datos del viaje";
    return false;
}
$serv = $ca->flush();

$user = null;
$ca->prepareSelect("pv_clientes", "*", "id=:id");
$ca->bindValue(":id", $serv["id_usuario"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() > 0) {
    $user = $ca->flush();
}
if ($ca->size() == 0) {
    $ca->prepareSelect("usuarios", "*", "id=:id");
    $ca->bindValue(":id", $serv["id_usuario"]);
    if (!$ca->exec()) {
        return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
    }
    if ($ca->size() > 0) {
        $user = $ca->flush();
    }
}
if ($user == null) {
    echo "No existen datos del cliente en usuarios.";
    return false;
}

$ca->prepareSelect("pv_clientes", "*", "id=:id");
$ca->bindValue(":id", $serv["conductor_id"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() == 0) {
    echo "No existen datos del conductor";
    return false;
}
$driver = $ca->flush();

$ca->prepareSelect("empresas", "*", "id=:empresa");
$ca->bindValue(":empresa", $serv["empresa"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() == 0) {
    echo "No existen datos de la empresa principal";
    return false;
}
$emp = $ca->flush();

$ca->prepareSelect("edo_vehiculos", "*", "id=:id");
$ca->bindValue(":id", $serv["vehiculo"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() == 0) {
    echo "No existen datos del vehículo";
    return false;
}
$vehiculo = $ca->flush();

$ca->prepareSelect("edo_servicio_parada", "nombre_pasajero,descripcion_carga,documento", "id_servicio=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$pasajeros = Array();
if ($ca->size() > 0) {
    $pasajeros = $ca->assocAll();
}
$t_pasajeros = count($pasajeros);

$consecutivoFuec = $serv["consec_fuec"];
if ($serv["consec_fuec"] === null || $serv["consec_fuec"] === false || $serv["consec_fuec"] === "") {
    $ca->prepareSelect("edo_fuec_consecutivos", "*", "1=1 order by id desc limit 1");
    $ca->bindValue(":empresa", $serv["empresa"]);
    if (!$ca->exec()) {
        return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
    }
    if ($ca->size() == 0) {
        echo "No existen datos del FUEC consecutivos";
        return false;
    }
    $consec = $ca->flush();
    $consecutivoFuec = $consec["consecutivo"] + 1;

    $ca->prepareUpdate("edo_servicios", "consec_fuec", "id=:id");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":consec_fuec", $consecutivoFuec);
    if (!$ca->exec()) {
        return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
    }
    $ca->prepareInsert("edo_fuec_consecutivos", "id_servicio,consecutivo");
    $ca->bindValue(":id", $consec["id"]);
    $ca->bindValue(":id_servicio", $id);
    $ca->bindValue(":consecutivo", $consecutivoFuec);
    if (!$ca->exec()) {
        return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
    }
}


$convenio_text = "Ninguno";
if (isset($driver["bodega"]) && $driver["bodega"] !== null && $driver["bodega"] !== "") {
    $ca->prepareSelect("edo_empresas", "nombre", "id=:id");
    $ca->bindValue(":id", $driver["bodega"]);
    if (!$ca->exec()) {
        return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
    }
    if ($ca->size() > 0) {
        $flota = $ca->flush();
        $convenio_text = $flota["nombre"];
    }
}

//variables
$protocolo = nwMaker::protocoloHTTPS();

$logoEmpresa = "{$protocolo}://" . $hostname . $emp["logo"];
$logoMinisterio = "{$protocolo}://" . $hostname . $emp["logo_ministerio"];
$sello_transp = "{$protocolo}://" . $hostname . $emp["imagen_sello_fuec"];

$fechainicio = strtotime($serv["fecha"]);
//$fechafinal = strtotime(nwMaker::sumaRestaFechasByFecha("+24 hour", "+0 minute", "+0 second", $serv["fecha"]));
$fechafinal = strtotime($serv["fecha"]);

$empresaRazonSocial = $emp["razon_social"];
$empresaDireccion = $emp["direccion"];
$empresaTelefono = $emp["telefono"];
$empresaCorreo = $emp["email"];
$empresaNit = $emp["nit"];
$empresaFirmaRepLegal = "{$protocolo}://" . $hostname . $emp["firma_digital"];

$objeto_contrato = "Contrato para transporte especial";
$contratante = $user["nombre"];
if (isset($user["apellido"]) && $user["apellido"] !== null && $user["apellido"] !== "") {
    $contratante .= " {$user["apellido"]}";
}
$contrato = null;
if (isset($user["contrato"])) {
    $contrato = substr($user["contrato"], -4);
}
$clienteNit = null;
if (isset($user["nit"])) {
    $clienteNit = $user["nit"];
} else
if (isset($user["documento"])) {
    $clienteNit = $user["documento"];
}
$clienteCelular = $user["celular"];
$razonSocial = $emp["nombre"];
if (isset($user["bodega"]) && $user["bodega"] !== null && $user["bodega"] !== "" && $user["bodega"] !== false && $user["bodega"] !== "Seleccione") {
    $ca->prepareSelect("edo_empresas", "*", "id=:id");
    $ca->bindValue(":id", $user["bodega"]);
    if (!$ca->exec()) {
        echo nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
        return false;
    }
    if ($ca->size() == 0) {
        echo "No existen datos del FUEC consecutivos";
        return false;
    }
    $emprfuec = $ca->flush();
    $contratante = $emprfuec["nombre"];
    $clienteNit = $emprfuec["nit"];
    $contrato = $emprfuec["contrato"];
    if ($emprfuec["objeto_contrato"] !== null && $emprfuec["objeto_contrato"] !== false && $emprfuec["objeto_contrato"] !== "") {
        $objeto_contrato = $emprfuec["objeto_contrato"];
    }
}

$otrosDrivers = Array();
if ($serv["otros_conductores"] !== null && $serv["otros_conductores"] !== "") {
    $otrosDrivers = servicios_admin::consultaOtrosConductores($serv);
}

$numero_fuec = "<span class='fuecnum fuec_numeracionfija'>" . $emp["fuec_numeracion_fija"] . "</span>";
$numero_fuec .= "<span class='fuecnum fuec_anioactual'>" . date("Y", $fechainicio) . "</span>";
$numero_fuec .= "<span class='fuecnum fuec_contrato'>" . $contrato . "</span>";
$numero_fuec .= "<span class='fuecnum fuec_consecutivo'>{$consecutivoFuec}</span>";

$origen = $serv["origen"];
$destino = $serv["destino"];
$descripcion_recorrido = "Diferentes localidades de origen {$serv["ciudad_origen"]}, destino {$serv["ciudad_destino"]} y municipios aledaños";

$conductorNumTarjetaOp = $vehiculo["numero_tarjeta_operacion"];
$conductorNumInterno = $vehiculo["numero_interno"];

$codesDir = $_SERVER["DOCUMENT_ROOT"] . "/imagenes/";
$codeFile = date('d-m-Y-h-i-s') . '.png';
QRcode::png("{$hostname}/app/fuec_2021.php?service={$id}", $codesDir . $codeFile, "H", 5);
//echo $codesDir . $codeFile;

$qr = "/imagenes/{$codeFile}";
?>
<!DOCTYPE html>
<html>
    <head>
        <meta https-equiv="Content-Type" content="text/html" charset="utf-8">
        <style>
            @media print {
                .corta{
                    display:block;
                    page-break-before:always;
                    page-break-after: always;
                }
                body .cont-desc {
                    font-size: 10px!important;
                }
            }
            *{
                text-transform: uppercase;
            }

            html, body {
                font-size: 10px;
                font-family: Arial, Helvetica, sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                min-width: 100%;
            }
            * {
                margin:0px;
                padding:0px;
            }
            .cont-logoFuec {
                position: relative;
                display: flex;
                padding: 3px;
                width: 100%;
                text-align: center;
                flex-direction: row;
                align-content: space-around;
                justify-content: space-around;
                align-items: center;
            }
            #nwfuec {
                max-width: 884px;
                margin: auto;
                width: 100%;
            }
            .text-center{
                text-align: center;
            }
            .tittle p{
                margin: 7px;
                font-weight: bold;
            }
            td {
                padding: 8px 8px;
                height: auto;
            }
            .div_ruta{
                border-right: 1px solid;
                padding: 5px 8px;
                margin-right: 8px;
            }
            .div_ruta_description{
                padding: 5px 8px;
            }
            .title_enc{
                background: #75ac3b;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div id="nwfuec">

            <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
                <tbody>
                    <tr>
                        <td  style="position: relative;" class="text-center" colspan="2">
                            <div class='cont-logoFuec' >
                                <img src="<?php echo $logoMinisterio; ?>" style="max-width: 40%;">
                                <img src="<?php echo $logoEmpresa ?>" style="max-width: 40%;">
                                <img src="<?php echo $qr; ?>" style="max-width: 16%;">
                            </div>
                            <div style="position: relative;bottom: 0px;margin: auto;left: 0;right: 0;">MINISTERIO DE TRANSPORTE</div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="title_enc">
                            FORMATO ÚNICO DE CONTRATO DEL SERVICIO PÚBLICO DE TRANSPORTE AUTOMOTOR ESPECIAL
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style="width: 100%; text-align: center;">
                                <span style="margin-right: 64px;">
                                    <?php
                                    echo $emp["fuec_numeracion_fija"];
                                    ?>
                                </span>
                                <span>
                                    <?php
                                    echo date("Y", $fechainicio);
                                    ?>
                                </span>
                                <span>
                                    <?php
                                    echo $contrato;
                                    ?>
                                </span>
                                <span>
                                    <?php
                                    echo $consecutivoFuec;
                                    ?>
                                </span>
                            </div>
                        </td>
                        <td style="width: 173px;min-width: 173px; background: #44b152;">RNT:</td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 0px;border-right: 0px;">RAZON SOCIAL: 
                            <span style="margin-left: 62px;">
                                <b> 
                                    <?php echo $empresaRazonSocial; ?>
                                </b>
                            </span> 
                            <div style="float: right;margin-right: 48px;">NIT:</div>
                        </td>
                        <td style="border-bottom: 0px;border-left: 0px; text-align: center;">
                            <span>
                                <b>
                                    <?php echo $empresaNit ?>
                                </b>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="border-top: 0px;border-bottom: 0px;">CONTRATO No:
                            <span style="margin-left: 73px;">
                                <b>
                                    <?php echo $contrato; ?>
                                </b>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 0px;border-top: 0px;border-bottom: 0px;">CONTRATANTE:
                            <span style="margin-left: 68px;">
                                <b>
                                    <?php echo $contratante; ?>
                                </b>
                            </span>
                            <div style="float: right;margin-right: 18px;">NIT/CC:</div>
                        </td>
                        <td style="border-left: 0px; text-align: center;border-top: 0px;border-bottom: 0px;"> 
                            <span>
                                <b>
                                    <?php echo $clienteNit; ?>
                                </b>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top: 0px; padding-bottom: 11px;" colspan="2">
                            OBJETO CONTRATO: 
                            <span>
                                <b>
                                    <?php echo $objeto_contrato; ?>
                                </b>
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div style="display: flex; flex-wrap: wrap;">
                                <div style="border-right: 1px solid;height: 40px;text-align: center;width: 200px;box-sizing: border-box;"><b>ORIGEN-DESTINO</b></div>
                                <div style="box-sizing: border-box;">
                                    <b>
                                        ORIGEN: <?php echo $origen; ?> - DESTINO: <?php echo $destino; ?>
                                    </b>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <div style="display: flex; flex-wrap: wrap;">
                                <div class="div_ruta">
                                    <b>RUTA: 1 <?php // echo $index;                                                                                                                                         ?></b>
                                </div>
                                <div class="div_ruta_description">
                                    <?php echo $descripcion_recorrido; ?>
                                </div>
                            </div> 
                        </td>
                    </tr>
                    <?php
                    for ($index = 2; $index < 11; $index++) {
                        ?>
                        <tr>
                            <td colspan="2">
                                <div style="display: flex; flex-wrap: wrap;">
                                    <div class="div_ruta">
                                        <b>RUTA: <?php echo $index; ?></b>
                                    </div>
                                    <div class="div_ruta_description">
                                        <?php // echo $descripcion_recorrido;       ?>
                                    </div>
                                </div> 
                            </td>
                        </tr>
                        <?php
                    }
                    ?>
                    <tr>
                        <td colspan="2">
                            <div style="display: flex; flex-wrap: wrap;">
                                <div style="width: 100%; border-right: 1px solid;box-sizing: border-box;">
                                    CONVENIO / CONSORCIO / UNIÓN TEMPORAL / CON: <?php echo $convenio_text; ?> 
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center;border-bottom: 0px;"><b>VIGENCIA DEL CONTRATO</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-bottom: 45px;padding-right: 149px;padding-left: 141px;padding-top: 16px;border-top: 0px;">
                            <table border="1" cellpadding="0" style="width: 100%;  border-spacing: 0; border: #9f9f9f;height: 83px;">

                                <tr style="text-align: center;">
                                    <td style="border: 0;width: 285px;"></td>
                                    <td style="background: #75ac3b;">DÍA</td>
                                    <td style="background: #75ac3b;">MES</td>
                                    <td style="background: #75ac3b;">AÑO</td>
                                </tr>
                                <tr>

                                    <td style="border: 0;">FECHA INICIAL:</td>
                                    <td style="text-align: center;"><?php echo date("d", $fechainicio); ?></td>
                                    <td style="text-align: center;"><?php echo date("m", $fechainicio); ?></td>
                                    <td style="text-align: center;"><?php echo date("Y", $fechainicio); ?></td>
                                </tr>
                                <tr>
                                    <td style="border: 0;">FECHA VENCIMIENTO</td>
                                    <td style="text-align: center;"><?php echo date("d", $fechafinal); ?></td>
                                    <td style="text-align: center;"><?php echo date("m", $fechafinal); ?></td>
                                    <td style="text-align: center;"><?php echo date("Y", $fechafinal); ?></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <?php
                    if ($t_pasajeros > 0) {
                        ?>
                        <tr>
                            <td colspan="2" style="padding: 0;">
                                <h3 style="padding: 10px;">
                                    <?php
                                    echo "Total pasajeros: {$t_pasajeros} ";
                                    ?>
                                </h3>
                                <table border="0"  style="width: 100%;  border-spacing: 0; border: thin; text-align: center; border: #9f9f9f;">
                                    <tr style="background: #75ac3b;">
                                        <td style="text-align: left; border-bottom: 1px solid;padding: 5px;">Nombre pasajero</td>
                                        <td style="text-align: left; border-bottom: 1px solid;padding: 5px;">Otros</td>
                                    </tr>
                                    <?php
                                    for ($i = 0; $i < $t_pasajeros; $i++) {
                                        $pass = $pasajeros[$i];
                                        ?>
                                        <tr>
                                            <td style="text-align: left; border-top: 0px;border-bottom: 1px solid;border-right: 1px solid;padding: 5px;">
                                                <?php echo $pass["nombre_pasajero"]; ?>
                                            </td>
                                            <td style="text-align: left; border-top: 0px;border-bottom: 1px solid;border-right: 1px solid;padding: 5px;">
                                                <?php
                                                if ($pass["documento"] !== null && $pass["documento"] !== "") {
                                                    echo "CC: " . $pass["documento"] . ". ";
                                                }
                                                echo $pass["descripcion_carga"];
                                                ?>
                                            </td>
                                        </tr>
                                        <?php
                                    }
                                    ?>
                                </table>
                            </td>
                        </tr>
                        <?php
                    }
                    ?>
                    <tr>
                        <td colspan="2" style="padding: 0;">
                            <table border="0"  style="width: 100%;  border-spacing: 0; border: thin; text-align: center; border: #9f9f9f;">
                                <tr style="background: #75ac3b;">
                                    <td style="border-bottom: 1px solid;width: 135px;">PLACA</td>
                                    <td style="border-bottom: 1px solid;width: 228px;">MODELO</td>
                                    <td style="border-bottom: 1px solid;width: 156px;"></td>
                                    <td style="border-bottom: 1px solid;width: 255px;">MARCA</td>
                                    <td style="border-bottom: 1px solid;">CLASE</td>
                                </tr>
                                <tr>
                                    <td style="border-top: 0px;border-bottom: 1px solid;border-right: 1px solid;">
                                        <?php echo $vehiculo["placa"]; ?>
                                    </td>
                                    <td style="border-top: 0px;border-bottom: 1px solid;border-right: 1px solid;">
                                        <?php echo $vehiculo["modelo"] ?>
                                    </td>
                                    <td></td>
                                    <td style="border-top: 0px;border-bottom: 1px solid;border-left: 1px solid;">
                                        <?php echo $vehiculo["marca_text"] ?>
                                    </td>
                                    <td style="border-top: 0px;border-bottom: 1px solid;border-left: 1px solid;">
                                        <?php echo $vehiculo["tipo_vehiculo_text"] ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colspan="1"><strong>NÚMERO INTERNO</strong></td>
                                    <td></td>
                                    <td colspan="2"><strong>NÚMERO TARJETA DE OPERACIÓN</strong></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colspan="1" style="border: 1px solid;border-bottom: 0;">
                                        <?php echo $conductorNumInterno; ?>
                                    </td>
                                    <td></td>
                                    <td colspan="2" style="border: 1px solid;border-bottom: 0;border-right: 0;">
                                        <?php echo $conductorNumTarjetaOp; ?>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td style="border: 1px solid;">
                                        <strong>NOMBRES Y APELLIDOS</strong>
                                    </td>
                                    <td style="border: 1px solid;border-left: 0px;border-right: 0px;">
                                        <strong>NÚMERO CÉDULA</strong>
                                    </td>
                                    <td style="border: 1px solid;">
                                        <strong>NÚMERO LICENCIA CONDUCIR</strong>
                                    </td>
                                    <td style="border: 1px solid;border-left: 0px; border-right: 0px;">
                                        <strong>VIGENCIA</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 7px;text-align: left;">
                                        <strong>CONDUCTOR 1</strong>
                                    </td>
                                    <td style="border-left: 1px solid;border-right: 1px solid;">
                                        <?php echo $driver["nombre"] . " " . $driver["apellido"] ?>
                                    </td>
                                    <td >
                                        <?php echo $driver["nit"] ?>
                                    </td>
                                    <td style="border-left: 1px solid;border-right: 1px solid;">
                                        <?php echo $driver["no_licencia"] ?>
                                    </td>
                                    <td>
                                        <?php echo $driver["fecha_vencimiento"] ?>
                                    </td>
                                </tr>
                                <?php
                                if (count($otrosDrivers) > 0) {
                                    $num = 1;
                                    for ($i = 0; $i < count($otrosDrivers); $i++) {
                                        $otto = $otrosDrivers[$i];
                                        ?>
                                        <tr>
                                            <td style="padding: 7px;text-align: left;">
                                                <strong>CONDUCTOR <?php echo $num + 1; ?></strong>
                                            </td>
                                            <td style="border: 1px solid;">
                                                <?php echo $otto["nombre"]; ?>
                                            </td>
                                            <td style="border: 1px solid;border-left: 0px;border-right: 0px;">
                                                <?php echo $otto["cedula"]; ?>
                                            </td>
                                            <td style="border: 1px solid;">
                                                <?php echo $otto["licencia"]; ?>
                                            </td>
                                            <td style="border: 1px solid;border-left: 0px; border-right: 0px;">
                                                <?php echo $otto["vigencia"]; ?>
                                            </td>
                                        </tr>
                                        <?php
                                        $num++;
                                    }
                                }
                                ?>
                                <tr>
                                    <td style="border: 1px solid; border-right: 0px;border-left: 0px;" rowspan="2">
                                        <strong>RESPONSABLE</strong>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;">
                                        <strong>NOMBRES Y APELLIDOS</strong>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;">
                                        <strong>NUMERO CÉDULA</strong>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;">
                                        <strong>DIRECCIÓN</strong>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;">
                                        <strong>TELÉFONO</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid; border-top: 0px;height: 35px;" >
                                        <?php echo $contratante; ?>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;" >
                                        <?php echo $clienteNit; ?>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;" >
                                        <?php echo $origen; ?>
                                    </td>
                                    <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;" >
                                        <?php echo $clienteCelular; ?>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
            </table>
            <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
                <tbody>
                    <tr>
                        <td style="width: 50%;border-top: 0px;">
                            <p style="text-align: center;font-size: 12.9px;">
                                <?php echo $empresaRazonSocial; ?><br>
                                Dirección: <?php echo $empresaDireccion; ?><br>
                                Teléfono: <?php echo $empresaTelefono; ?><br>
                                <?php echo $empresaCorreo; ?>
                            </p>
                        </td>
                        <td style="width:50%; text-align: center;border-top: 0px;"> 
                            <p style="text-align: center;">Firma Representante Legal</p>
                            <img src= "<?php echo $empresaFirmaRepLegal; ?>" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="corta"></div>

            <div class="cont-desc" style="position: relative;text-align: justify;font-size: 13px;padding: 58px;box-sizing: border-box;line-height:0.23in;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <span>INSTRUCTIVO PARA LA DETERMINACIÓN DEL NÚMERO CONSECUTIVO DEL FUEC</span>
                </div>
                <div style="text-align: center; font-weight: bold; margin-bottom: 15px;">
                    <span>El Formato de Extracto de Contrato “FUEC” estará constituido por los siguientes números:</span>
                </div>
                <div style="padding-left: 34px;margin-bottom: 15px;"><span style="margin-right: 12px;">a)</span><span>Los tres primeros dígitos de izquierda a derecha corresponderán al Código de la Dirección Territorial que otorgó la habilitación a la empresa de Servicio Público de Transporte Especial.</span></div>
                <div>
                    <table border="1" style="width: 100%;">
                        <?php
                        $ciudadIndicativo = [["ciudad" => "Antioquia - Chocó", "indicativo" => "305", "ciudad2" => "Huila-Caquetá", "indicativo2" => "441"],
                            ["ciudad" => "Atlántico", "indicativo" => "208", "ciudad2" => "Magdalena", "indicativo2" => "247"],
                            ["ciudad" => "Bolívar-San Andrés Providencia", "indicativo" => "213", "ciudad2" => "Meto- Vaupés-Vichada", "indicativo2" => "550"],
                            ["ciudad" => "Boyacá-Casanare", "indicativo" => "415", "ciudad2" => "Nariño-Putumayo", "indicativo2" => "352"],
                            ["ciudad" => "Caldas", "indicativo" => "317", "ciudad2" => "N/Santander- Arauca", "indicativo2" => "454"],
                            ["ciudad" => "Cauca", "indicativo" => "319", "ciudad2" => "Quindío", "indicativo2" => "363"],
                            ["ciudad" => "César", "indicativo" => "220", "ciudad2" => "Risaralda", "indicativo2" => "366"],
                            ["ciudad" => "Córdoba-Sucre", "indicativo" => "223", "ciudad2" => "Santander", "indicativo2" => "468"],
                            ["ciudad" => "Cundinamarca", "indicativo" => "425", "ciudad2" => "Tolima", "indicativo2" => "473"],
                            ["ciudad" => "Guajira", "indicativo" => "241", "ciudad2" => "Valle del Cauca", "indicativo2" => "376"],];

                        for ($index1 = 0; $index1 < count($ciudadIndicativo); $index1++) {
                            ?>
                            <tr>
                                <td>
                                    <?php echo $ciudadIndicativo[$index1]["ciudad"]; ?>
                                </td>
                                <td style="width: 100px;">
                                    <?php echo $ciudadIndicativo[$index1]["indicativo"]; ?>
                                </td>
                                <td>
                                    <?php echo $ciudadIndicativo[$index1]["ciudad2"]; ?>
                                </td>
                                <td style="width: 100px;">
                                    <?php echo $ciudadIndicativo[$index1]["indicativo2"]; ?>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </table>
                </div>
                <div style="padding-left: 34px;margin-top: 15px; margin-bottom: 30px;">
                    <div><span style="margin-right: 12px;">b)</span><span>Los cuatro dígitos siguientes señalarán el número de la resolución mediante la cual otorgó la habilitación a la Empresa. En caso que la resolución no se tenga estos dígitos, los faltantes serán completados can ceros a la izquierda.</span></div>
                    <div><span style="margin-right: 12px;">c)</span><span>Los dos siguientes dígitos, corresponderán a los dos últimos del año en que la empresa fue habilitada.</span></div>
                    <div><span style="margin-right: 12px;">d)</span><span>A continuación cuatro dígitos que corresponderán al año en el que se expide el extracto del contrato.</span></div>
                    <div><span style="margin-right: 12px;">e)</span><span>Posteriormente, cuatro dígitos que identifican el número del contrato. La numeración debe ser consecutiva, establecida por cada empresa e iniciará con los contratos de prestación del servicio celebrados para el transporte 
                            de estudiantes, asalariados, turistas o grupo de usuarios, vigentes al momento de entrar en vigor la presente resolución.</span></div>
                    <div><span  style="margin-right: 12px;">f)</span><span>Finalmente, los cuatro últimos dígitos corresponderán al número consecutivo del extracto de contrato. Se debe 
                            expedir un nuevo extracto por vencimiento del plazo inicial del mismo o por cambio del vehículo. </span></div>
                </div>        
                <div style="margin-bottom: 30px;"><span>Empresa habilitada por la Dirección Territorial Cundinamarca en el año 2019, con resolución de habilitación 808, que 
                        expide el primero extracto de contrato en el <?php echo date("Y", $fechainicio) ?>, del contrato número 1000. El número del El Formato de Extracto de Contrato “FUEC” será <?php echo $numero_fuec; ?>.</span></div>
                <div style="margin-bottom: 50px;font-weight: bold;">
                    <span> NOTA: El vehículo se encuentra en perfecto estado Mecánico y de aseo.</span>
                </div>
                <div style="text-align: right;">
                    <img class="firma_y_sello_cliente" src="<?php echo $sello_transp; ?>" />
                </div>
                <div style="margin-bottom: 40px;font-weight: bold;"><span> Prueba de alcoholemia</span></div>
                <div style="display: flex;flex-wrap: wrap;justify-content: space-around;">
                    <div style="padding: 20px; border: 1px solid"><span style="font-weight:bold;font-size:16pt;">SI</span></div>
                    <div style="padding: 20px; border: 1px solid"><span style="font-weight:bold;font-size:16pt;">NO</span></div>
                    <div style="padding: 20px; border: 1px solid"><span style="font-weight:bold;font-size:16pt;">NEGATIVO</span></div>
                    <div style="padding: 20px; border: 1px solid"><span style="font-weight:bold;font-size:16pt;">POSITIVO</span></div>
                    <div style="padding: 20px; border: 1px solid"><span style="font-weight:bold;font-size:16pt;">GRADO: _____</span></div>
                </div>
                <div style="margin-top: 30px;font-weight: bold;"><span >SEÑOR CONDUCTOR: Respete las señales de tránsito, no exceda los límites de velocidad, maneje con precaución, respeto y tolerancia, esté siempre atento y muy concentrado a la hora de conducir su vehículo, recuerde que las personas que transporta tienen seres queridos que esperan su integro regreso a sus hogares.</span></div>
            </div>

        </div>
    </body>
</html>