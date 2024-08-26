<?php
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
$dat = $_GET;
$id_fuec = $dat["id_fuec"];
$id_conductor = $dat["id_conductor"];

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
//$si = session::info();

$ca->prepareSelect("pv_clientes", "*", "id=:id_conductor");
$ca->bindValue(":id_conductor", $id_conductor);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$driver = $ca->flush();

$ca->prepareSelect("empresas", "*", "id=:empresa");
$ca->bindValue(":empresa", $driver["empresa"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
$logo_empresa = $ca->flush();

//$ca->prepareSelect("edo_vehiculos", "*", "empresa=:empresa and usuario=:usuario and estado_activacion_text='activo'");
$ca->prepareSelect("edo_vehiculos", "*", "usuario=:usuario and estado_activacion_text='activo'");
//$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":usuario", $driver["usuario"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() == 0) {
    echo "No tiene un vehiculo activo o no está activo.";
    return;
}
$vehiculo = $ca->flush();

//$ca->prepareSelect("edo_empresas a join edo_detalle_contrato_fuec b on(a.id=b.id_cliente)", "a.*,b.*", "b.empresa=:empresa and b.id_cliente=:id_cliente and b.numero_contrato=:numero_contrato and (b.convenio=:convenio or b.convenio is null or b.convenio='Seleccione')");
//$ca->prepareSelect("edo_empresas a join edo_detalle_contrato_fuec b on(a.id=b.id_cliente)", "a.*,b.*", "b.empresa=:empresa and b.id_cliente=:id_cliente and b.numero_contrato=:numero_contrato");
//$ca->prepareSelect("edo_empresas a join edo_detalle_contrato_fuec b on(a.id=b.id_cliente)", "a.*,b.*", "b.id=:id_fuec");
$ca->prepareSelect("edo_detalle_contrato_fuec", "*", "id=:id_fuec");
//$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":id_fuec", $id_fuec);
//$ca->bindValue(":id_cliente", $dat["id_cliente"]);
//$ca->bindValue(":convenio", $dat["flota"]);
//$ca->bindValue(":numero_contrato", $dat["numero_contrato"]);
if (!$ca->exec()) {
    return nwMaker::error("Error ejecutando la consulta: " . $ca->lastErrorText(), true);
}
if ($ca->size() == 0) {
    echo "No hay detalle del contrato para este cliente";
    return;
}
$detalle_fuec = $ca->flush();
//print_r($detalle_fuec);
$fechainicio = strtotime($detalle_fuec["fecha_inicial"]);
$fechafinal = strtotime($detalle_fuec["fecha_final"]);
?>
<style>
    @media print {
        .corta{
            display:block;
            page-break-before:always;
            page-break-after: always;
        }
    }
</style>
<div id="nwfuec">

    <header>
        <meta https-equiv="Content-Type" content="text/html" charset="utf-8">
        <style type="text/css">
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
        </style>
    </header>

    <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
        <tbody>
            <tr>
                <td style="width: 50%" class="text-center">
                    <div class='cont-logoFuec'>
                        <img src="/imagenes/logoFuec.png" style="max-width: 84%;">
                    </div>
                </td>
                <td style="width: 50%; padding: 0px;" class="text-center"> 
                    <img src= "https://<?php echo $hostname . $logo_empresa["logo"] ?>"  style="max-width: 42%;">
                </td>
            </tr>
            <tr>
                <td colspan="2" class="text-center tittle">
                    <p>FORMATO UNICO DE EXTRACTO DEL CONTRATO DEL SERVICIO PUBLICO DE</p>
                    <p>TRANSPORTE TERRESTRE AUTOMOTOR ESPECIAL</p>
                    <p><span style="color: #F00;"><?php echo $detalle_fuec["numero_fuec"] ?></span></p>
                </td>
            </tr>
            <tr>
                <td style="border-bottom: 0px;border-right: 0px;"><b>RAZON SOCIAL:</b> <?php echo $logo_empresa["nombre"] ?></td>
                <td style="border-bottom: 0px;border-left: 0px; text-align: right;"><b>NIT:</b><?php echo $logo_empresa["documento"] ?></td>
            </tr>
            <tr>
                <td colspan="2" style="border-top: 0px;"><b>CONTRATO No:</b><?php echo $detalle_fuec["numero_contrato"] ?></td>
            </tr>
            <tr>
                <td style="border-right: 0px;"><b>CONTRATANTE:</b><?php echo $detalle_fuec["razon_social"] ?></td>
                <td style="border-left: 0px; text-align: right;"><b>NIT/CC:</b> <?php echo $detalle_fuec["nit"] ?></td>
            </tr>
            <tr>
                <td colspan="2"><b>OBJETO CONTRATO:</b> <?php echo $detalle_fuec["objeto_contrato"] ?></td>
            </tr>
            <tr>
                <td><b>ORIGEN:</b> <?php echo $detalle_fuec["origen"] ?></td>
                <td><b>DESTINO: </b><?php echo $detalle_fuec["destino"] ?></td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center;"><b>DESCRIPCION DEL RECORRIDO</b><br><?php echo $detalle_fuec["descripcion_recorrido"] ?> </td>
            </tr>
            <tr>
                <td colspan="2"><b>CONVENIO/CONSORCIO/UNION TEMPORAL CON:</b> <?php echo $detalle_fuec["convenio_text"] == "Seleccione" ? "" : $detalle_fuec["convenio_text"] ?> </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center; padding: 7px;"><b>VIGENCIA DEL CONTRATO</b></td>
            </tr>
            <tr>
    </table>
    <table border="1" cellpadding="10" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
        <tr>

            <td><b>FECHA INICIAL:</b></td>
            <td style="text-align: center;"><b>DÍA:</b> <?php echo date("d", $fechainicio); ?></td>
            <td style="text-align: center;"><b>MES:</b> <?php echo date("m", $fechainicio); ?></td>
            <td style="text-align: center;"><b>AÑO:</b> <?php echo date("Y", $fechainicio); ?></td>
        </tr>
        <tr>
            <td><b>FECHA VENCIMIENTO:</b></td>
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
            <td><?php echo $vehiculo["placa"] ?></td>
            <td><?php echo $vehiculo["modelo"] ?></td>
            <td><?php echo $vehiculo["marca_text"] ?></td>
            <td><?php echo $vehiculo["tipo_vehiculo_text"] ?></td>
        </tr>
        <tr>
            <td colspan="2"><b>NUMERO INTERNO:</b></td>
            <td colspan="2"><b>NUMERO TARJETA DE OPERACION:</b></td>
        </tr>
        <tr>
            <td colspan="2"><?php echo $vehiculo["numero_interno"] ?></td>
            <td colspan="2"><?php echo $vehiculo["numero_tarjeta_operacion"] ?></td>
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
                <td><?php echo $driver["nombre"] . " " . $driver["apellido"] ?></td>
                <td><?php echo $driver["nit"] ?></td>
                <td><?php echo $driver["celular"] ?></td>
                <td><?php echo $driver["fecha_vence_licencia"] ?></td>
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
                <td colspan="2" style="padding: 7px;"><?php echo $detalle_fuec["encargado"]; ?></td>
                <td><?php echo $detalle_fuec["identificacion_reponsable"]; ?></td>
                <td><?php echo $detalle_fuec["numero_contacto_reponsable"]; ?></td>
                <td><?php echo $detalle_fuec["direccion_reponsable"]; ?></td>
            </tr>
        </tbody>
    </table>
    <div class="corta"></div>
    <table border="1" style="width: 100%;  border-spacing: 0; border: #9f9f9f;">
        <tbody>
            <tr>
                <td style="width: 50%;">
                    <p style="text-align: center;">Para efectos de control y seguridad, Contáctenos:<br>
                        <?php echo $logo_empresa["nombre"]; ?><br>
                        Dirección: <?php echo $logo_empresa["direccion"]; ?><br>
                        Teléfono: <?php echo $logo_empresa["telefono"]; ?><br>
                        <?php echo $logo_empresa["correo"]; ?>
                    </p>
                </td>
                <td style="width:50%; text-align: center;"><p style="text-align: center;">Firma Representante Legal</p><img src= "<?php echo $detalle_fuec["firma_representante_legal"] ?>" style="max-width: 84%; width: 114px;"></td>
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