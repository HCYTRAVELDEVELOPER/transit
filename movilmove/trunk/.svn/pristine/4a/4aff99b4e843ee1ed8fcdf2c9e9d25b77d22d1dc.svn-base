<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

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
$serv = $ca->flush();

$ca->prepareSelect("pv_clientes", "*", "id=:id");
$ca->bindValue(":id", $serv["id_usuario"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$user = $ca->flush();

$ca->prepareSelect("pv_clientes", "*", "id=:id");
$ca->bindValue(":id", $serv["conductor_id"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$driver = $ca->flush();

$ca->prepareSelect("empresas", "*", "id=:empresa");
$ca->bindValue(":empresa", $serv["empresa"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$emp = $ca->flush();


$ca->prepareSelect("edo_vehiculos", "*", "id=:id");
$ca->bindValue(":id", $serv["vehiculo"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$vehiculo = $ca->flush();


$consecutivoFuec = $serv["consec_fuec"];
if ($serv["consec_fuec"] === null || $serv["consec_fuec"] === false || $serv["consec_fuec"] === "") {
    $ca->prepareSelect("edo_fuec_consecutivos", "*", "1=1 order by id desc limit 1");
    $ca->bindValue(":empresa", $serv["empresa"]);
    if (!$ca->exec()) {
        return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
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

//variables
$protocolo = nwMaker::protocoloHTTPS();

$logoEmpresa = "{$protocolo}://" . $hostname . $emp["logo"];
$logoMinisterio = "{$protocolo}://" . $hostname . $emp["logo_ministerio"];

$fechainicio = strtotime($serv["fecha"]);
$fechafinal = strtotime(nwMaker::sumaRestaFechasByFecha("+24 hour", "+0 minute", "+0 second", $serv["fecha"]));

$empresaRazonSocial = $emp["razon_social"];
$empresaDireccion = $emp["direccion"];
$empresaTelefono = $emp["telefono"];
$empresaCorreo = $emp["email"];
$empresaNit = $emp["nit"];
$empresaFirmaRepLegal = "{$protocolo}://" . $hostname . $emp["firma_digital"];

$objeto_contrato = "Contrato para transporte especial";
$contratante = $user["nombre"];
$contrato = substr($user["contrato"], -4);
$clienteNit = $user["nit"];
$clienteCelular = $user["celular"];
$razonSocial = $emp["nombre"];

$numero_fuec = "<span class='fuecnum fuec_numeracionfija'>" . $emp["fuec_numeracion_fija"] . "</span>";
$numero_fuec .= "<span class='fuecnum fuec_anioactual'>" . date("Y", $fechainicio) . "</span>";
$numero_fuec .= "<span class='fuecnum fuec_contrato'>" . $contrato . "</span>";
$numero_fuec .= "<span class='fuecnum fuec_consecutivo'>{$consecutivoFuec}</span>";


$origen = $serv["origen"];
$destino = $serv["destino"];
$descripcion_recorrido = "Diferentes localidades de origen {$serv["ciudad_origen"]}, destino {$serv["ciudad_destino"]} y municipios aledaños";
$convenio_text = "Ninguno";


$conductorNumTarjetaOp = $vehiculo["numero_tarjeta_operacion"];
$conductorNumInterno = $vehiculo["numero_interno"];


$codesDir = $_SERVER["DOCUMENT_ROOT"] . "/imagenes/";
$codeFile = date('d-m-Y-h-i-s') . '.png';
QRcode::png("{$hostname}/app/fuec_generate.php?service={$id}", $codesDir . $codeFile, "H", 5);
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
            }
            html, body { 
                font-size: 10px; 
                font-family: Arial, Helvetica, sans-serif; 
            }
            .cont-logoFuec {
                position: relative;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
            }
            #nwfuec {
                max-width: 1200px;
                margin: auto;
            }
            .text-center{
                text-align: center;
            }
            .tittle p{
                margin: 7px;
                font-weight: bold;
            }
            .fuecnum{
                display: inline-block;
                margin: 0 4px 0 0px;
                font-size: 20px;
            }
            .fuec_numeracionfija{
                color: #254084;
            }
            .fuec_anioactual{
                color: green;
            }
            .fuec_contrato{
                color: #c60000;
            }
            .fuec_consecutivo{
                color: #798000;
            }
            .img-thumbnail{
                max-width: 150px;
            }
            td {
                min-height: 20px;
                height: 20px;
            }
        </style>
    </head>
    <body>
        <div id="nwfuec">

            <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
                <tbody>
                    <tr>
                        <td style="width: 50%" class="text-center">
                            <div class='cont-logoFuec'>
                                <img src="<?php echo $logoMinisterio; ?>" style="max-width: 84%;">
                            </div>
                        </td>
                        <td style="width: 50%; padding: 0px;" class="text-center"> 
                            <img src= "<?php echo $logoEmpresa ?>"  style="max-width: 42%;">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="text-center tittle">
                            <p>FORMATO UNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PUBLICO DE</p>
                            <p>TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL</p>
                            <p><span style="color: #F00;"><?php echo $numero_fuec; ?></span></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-bottom: 0px;border-right: 0px;"><b>RAZON SOCIAL:</b> 
                            <?php echo $empresaRazonSocial; ?>
                        </td>
                        <td style="border-bottom: 0px;border-left: 0px; text-align: right;"><b>NIT:</b> 
                            <?php echo $empresaNit ?>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="border-top: 0px;"><b>CONTRATO No:</b> 
                            <?php echo $contrato; ?>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-right: 0px;"><b>CONTRATANTE:</b> 
                            <?php echo $contratante; ?>
                        </td>
                        <td style="border-left: 0px; text-align: right;"><b>NIT/CC:</b> 
                            <?php echo $clienteNit; ?>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>OBJETO CONTRATO:</b> 
                            <?php echo $objeto_contrato; ?>
                        </td>
                    </tr>
                    <tr>
                        <td><b>ORIGEN:</b> 
                            <?php echo $origen; ?>
                        </td>
                        <td><b>DESTINO: </b>
                            <?php echo $destino; ?>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center;"><b>DESCRIPCION DEL RECORRIDO</b><br>
                            <?php echo $descripcion_recorrido; ?> 
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>CONVENIO/CONSORCIO/UNION TEMPORAL CON:</b> 
                            <?php echo $convenio_text; ?> 
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center; padding: 7px;"><b>VIGENCIA DEL CONTRATO</b></td>
                    </tr>
                    <tr>
            </table>
            <table border="1" cellpadding="10" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
                <tr>

                    <td><b>FECHA INICIAL: </b></td>
                    <td style="text-align: center;"><b>DÍA:</b> <?php echo date("d", $fechainicio); ?></td>
                    <td style="text-align: center;"><b>MES:</b> <?php echo date("m", $fechainicio); ?></td>
                    <td style="text-align: center;"><b>AÑO:</b> <?php echo date("Y", $fechainicio); ?></td>
                </tr>
                <tr>
                    <td><b>FECHA VENCIMIENTO: </b></td>
                    <td style="text-align: center;"><b>DÍA:</b> <?php echo date("d", $fechafinal); ?></td>
                    <td style="text-align: center;"><b>MES:</b> <?php echo date("m", $fechafinal); ?></td>
                    <td style="text-align: center;"><b>AÑO:</b> <?php echo date("Y", $fechafinal); ?></td>
                </tr>
            </table>
            <table border="1"  style="width: 100%;  border-spacing: 0; border: thin; text-align: center;">
                <tr>
                    <td colspan="4" style="text-align: center; padding: 7px;"><b>CARACTERISTICAS DEL VEHICULO</b></td>
                </tr>
                <tr>
                    <td><b>PLACA:</b></td>
                    <td><b>MODELO:</b></td>
                    <td><b>MARCA:</b></td>
                    <td><b>CLASE:</b></td>
                </tr>
                <tr>
                    <td>
                        <?php echo $vehiculo["placa"] ?>
                    </td>
                    <td>
                        <?php echo $vehiculo["modelo"] ?>
                    </td>
                    <td>
                        <?php echo $vehiculo["marca_text"] ?>
                    </td>
                    <td>
                        <?php echo $vehiculo["tipo_vehiculo_text"] ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="2"><b>NUMERO INTERNO:</b></td>
                    <td colspan="2"><b>NUMERO TARJETA DE OPERACION:</b></td>
                </tr>
                <tr>
                    <td colspan="2">
                        <?php echo $conductorNumInterno; ?>
                    </td>
                    <td colspan="2">
                        <?php echo $conductorNumTarjetaOp; ?>
                    </td>
                </tr>
                </tbody>
            </table>
            <table border="1" style="width: 100%;  border-spacing: 0; text-align:center; border: #9f9f9f;">
                <tbody>
                    <tr>
                        <td colspan="5" style="text-align:center; padding: 7px;">
                            <b>DATOS DE LOS CONDUCTORES</b>
                        </td>
                    </tr>
                    <tr>
                        <td><b># Nro</b></td>
                        <td><b>NOMBRES Y APELLIDOS</b></td>
                        <td><b>NUMERO CEDULA</b></td>
                        <td><b>NUMERO LICENCIA CONDUCIR</b></td>
                        <td><b>VIGENCIA</b></td>
                    </tr>
                    <tr>
                        <td style="padding: 7px;text-align: left;"><b>CONDUCTOR 1</b></td>
                        <td>
                            <?php echo $driver["nombre"] . " " . $driver["apellido"] ?>
                        </td>
                        <td>
                            <?php echo $driver["nit"] ?>
                        </td>
                        <td>
                            <?php echo $driver["celular"] ?>
                        </td>
                        <td>
                            <?php echo $driver["fecha_vencimiento"] ?>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 7px;text-align: left;"><b>CONDUCTOR 2</b></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style="padding: 7px;text-align: left;"><b>CONDUCTOR 3</b></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>

                    <tr>
                        <td colspan="5" style="text-align:center;padding: 7px;">
                            <b>RESPONSABLE DEL CONTRATANTE</b>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>NOMBRES Y APELLIDOS</b></td>
                        <td><b>NUMERO CEDULA</b></td>
                        <td><b>TELEFONO</b></td>
                        <td><b>DIRECCION</b></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding: 7px;">
                            <?php echo $contratante; ?>
                        </td>
                        <td>
                            <?php echo $clienteNit; ?>
                        </td>
                        <td>
                            <?php echo $clienteCelular; ?>
                        </td>
                        <td>
                            <?php echo $origen; ?>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="corta"></div>
            <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
                <tbody>
                    <tr>
                        <td style="width: 50%;">
                            <p style="text-align: center;">Para efectos de control y seguridad, Contáctenos:<br>
                                <?php echo $empresaRazonSocial; ?><br>
                                Dirección: <?php echo $empresaDireccion; ?><br>
                                Teléfono: <?php echo $empresaTelefono; ?><br>
                                <?php echo $empresaCorreo; ?>
                            </p>
                        </td>
                        <td style="width:50%; text-align: center;">
                            <p style="text-align: center;">
                                Firma Representante Legal
                            </p>
                            <img src= "<?php echo $empresaFirmaRepLegal; ?>" style="max-width: 84%; width: 114px;">
                        </td>
                    </tr>
                </tbody>
            </table>
            <table border="1" style="text-align: center; width: 100%;  border-spacing: 0; border: thin;">
                <tbody>
                    <tr>
                        <td style="width: 100%;" class=""></td>
                    </tr>
                </tbody>
            </table>

            <!--<div style="page-break-after: always;"></div>-->

            <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
                <tbody>
                    <tr>
                        <td style="padding: 5px;">
                            Nota: El presente Extracto de Contrato, no lleva sellos según el Decreto 2150 Art, 11 de Diciembre de 1995 y el Decreto-Ley 019 de Enero de 2012 (Ley Antitrámites)
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 5px;">
                            <strong>DE ACUERDO A LA GUÍA PARA LA APLICACIÓN DE LA RESOLUCIÓN 3060 DEL 15 DE OCTUBRE DE 2014 EMITIDO POR EL MINISTERIO DE TRANSPORTES, EN EL PUNTO 2 SE ESPECIFÍCA, QUE EL NOMBRE DE LAS PERSONAS QUE SE TRANSPORTAN NO DEBEN ESTAR RELACIONADAS EN EL FUEC.</strong>
                        </td>
                        <td style="padding: 5px;">
                            <img class="img-thumbnail" src="<?php echo $qr; ?>" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <table style="width: 100%; border-spacing: 0; ">
                <tbody><tr>
                        <!--<td style="width: 25%; text-align: center;">codigoqr</td>-->
                        <td style="width:50%; text-align: left;">
                            <!--Para verificar éste documento, por favor leer el código QR por medio de la cámara de su dispositivo y la aplicación correspondiente-->
                        </td><td style="width: 25%;">&nbsp;</td>
                    </tr>
                </tbody></table>

            <table style="width: 100%; border-spacing: 0; ">
                <tbody>
                    <tr>
                        <td style="font-size: 13px; text-align:center;">
                            <p style="margin-top: 13px;"><b>INSTRUCTIVO PARA DETERMINACION DEL NÚMERO CONSECUTIVO DEL FUEC</b></p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="margin-top: 30px; text-align:justify; font-size: 13px; width: 70%; margin-left: 80px;">
                                El Formato Único de Extracto del Contrato "FUEC" estará constituido por los siguientes números:
                            </p>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                a. Los tres primeros dígitos de izquierda a derecha corresponderán al código de la Dirección Territorial que otorgó la habilitación o de aquella a la cual se hubiera trasladado la empresa de Servicio Público de Transporte Terrestre Automotor Especial;
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                b. Los cuatro números siguientes señalaran el número de la resolución mediante la cual se otorgó la habilitación de la empresa. En caso que la resolución no tenga estos dígitos, los faltantes serán completados con ceros a la izquierda;
                            </p>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                c. Los dos siguientes dígitos, corresponderán a los dos últimos del año en que la empresa fue habilitada;
                            </p>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                d. A continuación, cuatro dígitos que corresponderán al año en el que se expide el extracto del contrato;
                            </p>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                e. Posteriormente, cuatro dígitos que identifican el número del contrato. La numeración de los contratos debe ser consecutiva, establecida por cada empresa y continuará con la numeración dada a los contratos de prestación del servicio celebrados para el transporte de estudiantes, empleados, turistas, usuarios del servicio de salud y grupos específicos de usuarios, en vigencia de la resolución 3068 de 2014.
                            </p>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                f. Finalmente, los cuatro últimos dígitos corresponderán al número consecutivo del extracto de contrato que se expida para la ejecución de cada contrato. Se debe expedir un nuevo extracto por vencimiento del plazo inicial del mismo o por cambio del vehículo.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="text-align:justify; font-size: 13px; width: 70%; margin-left: 80px;">
                                <b>EJEMPLO</b>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p style="text-align: justify; font-size: 13px; width: 70%; margin-left: 95px;">
                                Empresa habilitada por la Dirección Territorial  en el año , con resolución de habilitación número , que expide el primer extracto del contrato en el año , del contrato número 1000. El número del Formato Único de Extracto del Contrato "FUEC" será 10000155.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>