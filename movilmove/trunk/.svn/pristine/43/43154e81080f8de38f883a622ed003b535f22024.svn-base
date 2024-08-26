<?php
$dat = $_GET;
//print_r($dat);
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$ca->prepareSelect("empresas", "*", "id=:empresa");
$ca->bindValue(":empresa", $si["empresa"]);
$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//$hostname = "limocars.gruponw.com";
if (!$ca->exec()) {
    print_r("Error ejecutando la consulta: " . $ca->lastErrorText());
    return false;
}
$logo_empresa = $ca->flush();
//print_r($logo_empresa);

$ca->prepareSelect("edo_vehiculos", "*", "empresa=:empresa and usuario=:usuario and estado_activacion_text='activo'");
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":usuario", $dat["usuario"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "No tiene un vehiculo activo.";
    return;
}
$vehiculo = $ca->flush();

$ca->prepareSelect("edo_empresas a join edo_detalle_contrato_fuec b on(a.id=b.id_cliente)", "a.*,b.*", "b.empresa=:empresa and b.id_cliente=:id_cliente and b.numero_contrato=:numero_contrato and (b.convenio=:convenio or b.convenio is null)");
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":id_cliente", $dat["id_cliente"]);
$ca->bindValue(":convenio", $dat["flota"]);
$ca->bindValue(":numero_contrato", $dat["numero_contrato"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "No hay detalle del contrato para este cliente";
    return;
}
$detalle_fuec = $ca->flush();
//print_r($detalle_fuec);
$fechainicio = strtotime($detalle_fuec["fecha_inicial"]);
$fechafinal = strtotime($detalle_fuec["fecha_final"]);
//print_r($logo_empresa);
if (isset($logo_empresa["web"])) {
    $text = $logo_empresa["web"];
} else {
    $text = "Razon social:" . $logo_empresa["razon_social"] . " Email:" . $logo_empresa["email"];
}
?>
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
                padding: 3px;
                float: left;
            }
            #nwfuec {
                max-width: 884px;
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
                <td  style="position: relative;" class="text-center" colspan="2">
                    <div style="width: 87%" class='cont-logoFuec' >
                        <img src="/app/img/secretaria_movilidad.png" style="width: 327px;height: 55px;">
                        <img src="/app/img/logo_super_transporte.png" style="height: 55px;width: 100px;margin-left: 10px;margin-right: 10px;">
                        <img src="/app/img/logo_transprotours.png" style="width: 287px;height: 55px;">
                        <!--<img src= "https://<?php // echo $hostname . $logo_empresa["logo"] ?>"  style="max-width: 42%;">-->
                    </div>
                    <div style="width: 12%;position: relative;float: left;" >
                        <iframe style="position:relative;width:1in;height:1in;border: 0px;" src="<?php $_SERVER['DOCUMENT_ROOT'] ?>/nwlib6/phpqrcode/generator.php?text=<?php echo $text ?>&size=3&key=nwadmin123XfTr"></iframe>
                    </div>  
                    <div style="position: absolute;bottom: 0px;margin: auto;left: 0;right: 0;">MINISTERIO DE TRANSPORTE</div>
                </td>
            </tr>
            <tr>
                <td style="padding: 0;" colspan="2" class="text-center tittle">
                    <div style="background: #75ac3b;font-size: 14px;font-weight: bold;padding: 2px;">FORMATO UNICO DE CONTRATO DEL SERVICIO PUBLICO DE TRANSPORTE AUTOMOTOR ESPECIAL</div>
                </td>
            </tr>
            <tr>
                <td><div style="display: flex;width: 700px;height: 26px;padding: 5px;box-sizing: border-box;">
                        <div style="width: 50%; text-align: right;"><span style="margin-right: 64px;"><?php echo $detalle_fuec["numero_fuec"] ?></span><span><?php echo date("Y", $fechainicio); ?></span></div>
                        <div style="width: 50%;"><span style="margin-left: 4px; margin-right: 64px;">N° CONTRATO </span><span><?php echo $detalle_fuec["numero_contrato"] ?></span></div>
                    </div></td>
                <td style="width: 173px;min-width: 173px; background: #44b152;">RNT:</td>
            </tr>
            <tr>
                <td style="border-bottom: 0px;border-right: 0px;">RAZON SOCIAL: <span style="margin-left: 62px;"><b> <?php echo $si["nom_empresa"] ?> </b></span> 
                    <div style="float: right;margin-right: 48px;">NIT:</div>
                </td>
                <td style="border-bottom: 0px;border-left: 0px; text-align: center;"><span><b><?php echo $logo_empresa["nit"] ?></b></span></td>
            </tr>
            <tr>
                <td colspan="2" style="border-top: 0px;border-bottom: 0px;">CONTRATO No:<span style="margin-left: 73px;"><b><?php echo $detalle_fuec["numero_contrato"] ?></b></span></td>
            </tr>
            <tr>
                <td style="border-right: 0px;border-top: 0px;border-bottom: 0px;">CONTRATANTE:<span style="margin-left: 68px;"><b><?php echo $detalle_fuec["razon_social"] ?></b></span>
                    <div style="float: right;margin-right: 18px;">NIT/CC:</div>
                </td>
                <td style="border-left: 0px; text-align: center;border-top: 0px;border-bottom: 0px;"> <span><b><?php echo $detalle_fuec["nit"] ?></b></span></td>
            </tr>
            <tr>
                <td style="border-top: 0px; padding-bottom: 11px;" colspan="2">OBJETO CONTRATO: <div style="text-align: center;float: right;width: 690px;"><span><b><?php echo $detalle_fuec["objeto_contrato"] ?></b></span></div></td>
            </tr>
            <tr>
                <td colspan="2">
                    <div style="display: flex; flex-wrap: wrap;">
                        <div style="border-right: 1px solid;height: 40px;text-align: center;width: 200px;padding: 10px;box-sizing: border-box;"><b>ORIGEN-DESTINO</b></div>
                        <div style="padding: 10px;box-sizing: border-box;"><b><?php echo $detalle_fuec["origen"] ?>-<?php echo $detalle_fuec["destino"] ?></b></div>
                    </div>
                </td>
            </tr>
            <?php
            for ($index = 1; $index < 11; $index++) {
                ?>
                <tr>
                    <td colspan="2" style=" padding: 0px;">
                        <div style="display: flex; flex-wrap: wrap;">
                            <div style="width: 117px;border-right: 1px solid;padding: 2px;">
                                <b>RUTA: <?php echo $index ?></b>
                            </div>
                            <div style="padding: 2px;">
                                <?php echo $index == 1 ? $detalle_fuec["descripcion_recorrido"] : "" ?>
                            </div>
                        </div> 
                    </td>
                </tr>
            <?php } ?>
            <tr>
                <td colspan="2" style="padding: 0px;">
                    <div style="display: flex; flex-wrap: wrap;">
                        <div style="width: 210px; border-right: 1px solid;padding: 2px;box-sizing: border-box;">
                            CONVENIO
                        </div>
                        <div style="width: 210px; border-right: 1px solid;padding: 2px;box-sizing: border-box;">
                            CONSORCIO
                        </div>
                        <div style="width: 210px; border-right: 1px solid;padding: 2px;box-sizing: border-box;">
                            UNION TEMPORAL
                        </div>
                        <div style="width: 243px;padding: 2px;box-sizing: border-box;">
                            CON:
                            <?php echo $detalle_fuec["convenio_text"] == "Seleccione" ? "" : $detalle_fuec["convenio_text"] ?>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center; padding: 7px; border-bottom: 0px;"><b>VIGENCIA DEL CONTRATO</b></td>
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
                            <td style="border-top: 0px;border-bottom: 1px solid;border-right: 1px solid;"><?php echo $vehiculo["placa"] ?></td>
                            <td style="border-top: 0px;border-bottom: 1px solid;border-right: 1px solid;"><?php echo $vehiculo["modelo"] ?></td>
                            <td></td>
                            <td style="border-top: 0px;border-bottom: 1px solid;border-left: 1px solid;"><?php echo $vehiculo["marca_text"] ?></td>
                            <td style="border-top: 0px;border-bottom: 1px solid;border-left: 1px solid;"><?php echo $vehiculo["tipo_vehiculo_text"] ?></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="1">NUMERO INTERNO</td>
                            <td></td>
                            <td colspan="2">NUMERO TARJETA DE OPERACION</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td colspan="1" style="border: 1px solid;border-bottom: 0;"><?php echo $vehiculo["numero_interno"] == "" ? "XXXXXXX" : $vehiculo["numero_interno"] ?></td>
                            <td></td>
                            <td colspan="2" style="border: 1px solid;border-bottom: 0;border-right: 0;"><?php echo $vehiculo["numero_tarjeta_operacion"] == "" ? "XXXXXXX" : $vehiculo["numero_tarjeta_operacion"] ?></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td style="border: 1px solid;">NOMBRES Y APELLIDOS</td>
                            <td style="border: 1px solid;border-left: 0px;border-right: 0px;">NUMERO CEDULA</td>
                            <td style="border: 1px solid;">NUMERO LICENCIA CONDUCIR</td>
                            <td style="border: 1px solid;border-left: 0px; border-right: 0px;">VIGENCIA</td>
                        </tr>
                        <tr>
                            <td style="padding: 7px;text-align: left;">CONDUCTOR1</td>
                            <td style="border-left: 1px solid;border-right: 1px solid;"><?php echo $dat["nombre"] . " " . $dat["apellido"] ?></td>
                            <td ><?php echo $dat["nit"] ?></td>
                            <td style="border-left: 1px solid;border-right: 1px solid;"><?php echo $dat["celular"] ?></td>
                            <td><?php echo $dat["fecha_vence_licencia"] ?></td>
                        </tr>
                        <tr>
                            <td style="padding: 7px;text-align: left;">CONDUCTOR2</td>
                            <td style="border: 1px solid;"></td>
                            <td style="border: 1px solid;border-left: 0px;border-right: 0px;"></td>
                            <td style="border: 1px solid;"></td>
                            <td style="border: 1px solid;border-left: 0px; border-right: 0px;"></td>
                        </tr>
                        <tr>
                            <td style="padding: 7px;text-align: left; border-top: 0px;">CONDUCTOR3</td>
                            <td style="border: 1px solid; border-top: 0px;"></td>
                            <td style="border: 1px solid;border-left: 0px;border-right: 0px;border-top: 0px;"></td>
                            <td style="border: 1px solid;border-top: 0px;"></td>
                            <td style="border: 1px solid;border-left: 0px; border-right: 0px;border-top: 0px;"></td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid; border-right: 0px;border-left: 0px;" rowspan="2">RESPONSABLE</td>
                            <td style="border: 1px solid; border-top: 0px;">NOMBRES Y APELLIDOS</td>
                            <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;">NUMERO CEDULA</td>
                            <td style="border: 1px solid; border-top: 0px;">DIRECCION</td>
                            <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;">TELEFONO</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid; border-top: 0px;height: 35px;" ><?php echo $detalle_fuec["encargado"]; ?></td>
                            <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;" ><?php echo $detalle_fuec["identificacion_reponsable"]; ?></td>
                            <td style="border: 1px solid; border-top: 0px;" ><?php echo $detalle_fuec["direccion_reponsable"]; ?></td>
                            <td style="border: 1px solid; border-top: 0px;border-left: 0px;border-right: 0px;" ><?php echo $detalle_fuec["numero_contacto_reponsable"]; ?></td>
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
                        CALLE 8D #82B-59 BARRIO VALLADOLID BOGOTÁ - 292 61 36 - 314 491<br>
                        6111 - transprotourssas@gmail.com
                    </p>
                </td>
                <td style="width:50%; text-align: center;border-top: 0px;"><img src= "<?php echo $detalle_fuec["firma_representante_legal"] ?>" style="max-width: 84%; width: 114px;"> <p style="text-align: center;">Firma Representante Legal</p></td>
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
            <table border="1" style="width: 8in;">
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
                <!--expide el primero extracto de contrato en el <?php // echo date("Y", $fechainicio)  ?>, del contrato número 0004. El número del El Formato de Extracto de Contrato “FUEC” será 425080819202000030057.</span></div>-->
                expide el primero extracto de contrato en el <?php echo date("Y", $fechainicio) ?>, del contrato número <?php echo $detalle_fuec["numero_contrato"] ?>. El número del El Formato de Extracto de Contrato “FUEC” será <?php echo $detalle_fuec["numero_fuec"] . date("Y", $fechainicio) . $detalle_fuec["numero_contrato"] ?>.</span></div>
        <div style="margin-bottom: 50px;font-weight: bold;"><span> NOTA: El vehículo se encuentra en perfecto estado Mecánico y de aseo.</span></div>
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