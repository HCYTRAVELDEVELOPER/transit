<?php
include_once dirname(__FILE__) . "/../rpcsrv/_mod.inc.php";
//require_once $_SERVER["DOCUMENT_ROOT"] . '/nwlib' . master::getNwlibVersion() . '/pdf/cmfpdf.inc.php';
//include $_SERVER["DOCUMENT_ROOT"] . 'nwlib' . master::getNwlibVersion() . '/barCode.php';

$db = NWDatabase::database();
session::check();
$si = session::info();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$dta = $_GET;
//print_r('HOLAAA');
//print_r($_GET);
//return;
$fech = $dta["fecha"];
//print_r($fech . "<br>");
$dias_ES1 = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
$dias_ES = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado");
$dias_EN = array("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
$fech = date($fech);
$dia = date('l', strtotime($fech));
$nombredia = str_replace($dias_EN, $dias_ES1, $dia);
//print_r($fech . "<br>");
if ($nombredia == "Lunes") {
    $fecha_inicio = date("Y-m-d", strtotime($fech));
    $fecha_fin = date("Y-m-d", strtotime($fech . "+ 6 days"));
}
if ($nombredia == "Martes") {
    $fecha_inicio = date("Y-m-d", strtotime($fech . "- 1 days"));
    $fecha_fin = date("Y-m-d", strtotime($fech . "+  5 days"));
}
if ($nombredia == "Miércoles") {
    $fecha_inicio = date("Y-m-d", strtotime($fech . "- 2 days"));
    $fecha_fin = date("Y-m-d", strtotime($fech . "+ 4 days"));
}
if ($nombredia == "Jueves") {
    $fecha_inicio = date("Y-m-d", strtotime($fech . "- 3 days"));
    $fecha_fin = date("Y-m-d", strtotime($fech . "+ 3 days"));
}
if ($nombredia == "Viernes") {
    $fecha_inicio = date("Y-m-d", strtotime($fech . "- 4 days"));
    $fecha_fin = date("Y-m-d", strtotime($fech . "+ 2 days"));
}
if ($nombredia == "Sábado") {
    $fecha_inicio = date("Y-m-d", strtotime($fech . "- 5 days"));
    $fecha_fin = date("Y-m-d", strtotime($fech . "+ 1 days"));
}

$id = master::clean($_GET["id"]);
$ca->prepare("select * from edo_preoperacional where fecha between :fecha_inicio and :fecha_fin and empresa=:empresa and id=:id order by fecha asc");
$ca->bindValue(":id", $dta["id"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":fecha_inicio", $fecha_inicio);
$ca->bindValue(":fecha_fin", $fecha_fin);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

if ($ca->size() != 0) {
    $result = $ca->assocAll();
}
//echo '<pre>';
//print_r($ca->preparedQuery());
//echo '</pre>';

$ca->prepare("select * from edo_vehiculos where id_usuario=:id_usuario and empresa=:empresa");
$ca->bindValue(":id_usuario", $result[0]["id_usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() != 0) {
    $vehiculo = $ca->flush();
} else {
    echo 'El conductor no tiene un vehículo asociado.';
    return;
}
$fecha_soat = date("Y-m-d", strtotime($vehiculo["fecha_vencimiento_soat"]));
$fecha_soat = explode('-', $fecha_soat);
$dia_soat = $fecha_soat[2];
$mes_soat = $fecha_soat[1];
$anio_soat = $fecha_soat[0];

$fecha_tegno = date("Y-m-d", strtotime($vehiculo["fecha_vencimiento_tegnomecanica"]));
$fecha_tegno = explode('-', $fecha_tegno);
$dia_tegno = $fecha_tegno[2];
$mes_tegno = $fecha_tegno[1];
$anio_tegno = $fecha_tegno[0];

$fecha_licencia = date("Y-m-d", strtotime($dta["fecha_vencimiento_licencia"]));
$fecha_licencia = explode('-', $fecha_licencia);
$dia_licencia = $fecha_licencia[2];
$mes_licencia = $fecha_licencia[1];
$anio_licencia = $fecha_licencia[0];
//print_r($vehiculo);

$ca->prepare("select * from usuarios where id=:id");
$ca->bindValue(":id", $si["id_usuario"]);
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
$user = $ca->flush();

$ca->prepare("select * from empresas where id=:empresa");
$ca->bindValue(":empresa", $si["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

if ($ca->size() != 0) {
    $emp = $ca->flush();
}

if (isset($_SERVER["HTTPS"])) {
    $host = "https://";
    $host .= $_SERVER["HTTP_HOST"];
    $fc = $host . $dta["firma_fonductor_inspeccion"];
    $fs = $host . $user["firma"];
    $host .= $emp["logo"];
} else {
    $host = "http://";
    $host .= $_SERVER["HTTP_HOST"];
    $fc = $host . $dta["firma_fonductor_inspeccion"];
    $fs = $host . $user["firma"];
    $host .= $emp["logo"];
}
?>
<html>
    <style>
        body{
            font-size: 10px;
            max-width: 1000px;
            width: 100%;
        }
        .center{
            padding: 5px;
            text-align: center;
            align-items: center;
        }
        h2, h3, h4 {
            margin: 0;
            padding: 0;
        }
        img{
            width: 150px;
            height: 100px;
        }
        td{
            font-size: 7pt;
        }
        @media print{
            body .text-revision{
                width: 233px;
                height: 16px!important;
                /*font-size:7px;*/
            }
        }
    </style>
    <head>
    </head>
    <body style="font-family: sans-serif;margin: auto;max-width: 850px;">
        <div style="margin: 20px 10px 10px 10px;">
            <table align="center" border="1" cellpadding="0" cellspacing="0" style="width:100%;margin-left: 0">
                <tbody>
                    <tr>
                        <td class="center" colspan="22">
                            <div style="position: relative;"> 
                                <div><h4>REVISIÓN DIARIA DE VEHÍCULOS</h4></div>
                                <div style="position: absolute;top:-12px; right: 10px;"><h5>TPT F-0003</h5></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;padding: 3px;border-bottom: 0px;font-size: 7pt;padding-top: 6px;" colspan="22">
                            Semana del <span style="border-bottom: 1px solid #3b3a3a;padding: 0px 38px 0px 38px;"><?php echo $fecha_inicio ?>  </span>al <span style="border-bottom: 1px solid #3b3a3a;padding: 0px 38px 0px 38px;"><?php echo $fecha_fin ?></span>
                        </td>
                    </tr>
                    <tr>
                        <td style="border-top: 0px;" colspan="22">
                            <div style="display: flex; flex-wrap: wrap;">
                                <div style="width: 50%;font-size: 7pt;padding: 0px 0px 1px 10px;line-height: 19px;">
                                    <div>Empresa Contratista: ___________________________________________________</div>
                                    <div>Nombre conductor <span style="border-bottom: 1px solid #3b3a3a;position: relative;width: 275px;display: inline-block;text-align: center;height: 14px;"><?php echo $dta["nombre_conductor"] ?>  </span></div>
                                    <div>Móvil N° __________________ Hora inicio ____________ hora final _____________</div>
                                    <div>
                                        Placa<span style="border-bottom: 1px solid #3b3a3a;position: relative;width: 92px;display: inline-block;text-align: center;height: 14px;"><?php echo $vehiculo["placa"] ?>  </span> 
                                        Marca<span style="border-bottom: 1px solid #3b3a3a;position: relative;width: 111px;display: inline-block;text-align: center;height: 14px;"><?php echo $vehiculo["marca_text"] ?>  </span> 
                                        Modelo<span style="border-bottom: 1px solid #3b3a3a;position: relative;width: 65px;display: inline-block;text-align: center;height: 14px;"><?php echo $vehiculo["modelo"] ?>  </span>
                                    </div>
                                    <div>Empresa Vinculada ____________________________________________________</div>
                                    <div>No. Pasajeros a transportar: ______ Lugar de operación _______________________</div>
                                    <div>Km inicial _______________ Km final _____________</div>
                                </div>
                                <div style="width: 47%; padding: 10px 0px 10px 38px;box-sizing: border-box;">
                                    <table border="1" cellpadding="0" cellspacing="0" style="width: 100%; font-size: 7pt">
                                        <tr>
                                            <td colspan="4" style="padding-left: 6px; font-weight: bold;">
                                                VENCIMIENTOS DOCUMENTOS
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; padding-left: 2px;">
                                                T. O:
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray; border-top: 1px solid black;">
                                                DD
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray; border-top: 1px solid black;">
                                                MM
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray; border-top: 1px solid black;">
                                                AÑO
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                SOAT:
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $dia_soat ?>
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $mes_soat ?>
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $anio_soat ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                POLIZA RCC:
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                DD
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                MM
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                AÑO
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                POLIZA RCE:
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                DD
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                MM
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                AÑO
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                REV.. TEC. MECANICA:
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $dia_tegno ?>
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $mes_tegno ?>
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $anio_tegno ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                REV. PREVENTIVA
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                DD
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                MM
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                AÑO
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                LIC. CONDUCCION:
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $dia_licencia ?>
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $mes_licencia ?>
                                            </td>
                                            <td style="width: 50px;text-align: center;border: 1px solid gray;">
                                                <?php echo $anio_licencia ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="border-bottom: 0px; border-top: 0px; padding-left: 2px;">
                                                FUEC:
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                DD
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                MM
                                            </td>
                                            <td style="width: 50px;text-align: center;color: grey;border: 1px solid gray;">
                                                AÑO
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center; font-weight: bold;font-size: 10pt;" colspan="22">
                            REVISIÓN
                        </td>
                    </tr>
                    <tr style="text-align: center; font-weight: bold;font-size: 10pt;">
                        <td colspan="3">DÍA</td>
                        <td colspan="3" style="width: 63px;">LUNES</td>
                        <td colspan="3" style="width: 63px;">MARTES</td>
                        <td colspan="3" style="width: 63px;">MIÉRCOLES</td>
                        <td colspan="3" style="width: 63px;">JUEVES</td>
                        <td colspan="3" style="width: 63px;">VIERNES</td>
                        <td colspan="3" style="width: 63px;">SÁBADO</td>
                    </tr>
                    <tr style="text-align: center; font-weight: bold;font-size: 10pt;">
                        <td colspan="3">EVALUACIÓN</td>
                        <?php
                        for ($index = 0; $index < 6; $index++) {
                            ?>
                            <td style="width: 27px;">M</td>
                            <td style="width: 27px;">R</td>
                            <td style="width: 27px;">B</td>
                        <?php } ?>
                    </tr>
                    <?php
                    $labels = [0 => "Nivel de aceite", 1 => "Nivel del hidráulico dirección", 2 => "Nivel líquido frenos",
                        3 => "Nivel refrigeración", 4 => "Radiador tapa ajustada", 5 => "Correa ventilador tensionada", 6 => "Nivel del agua limpiabrisas",
                        7 => "Luces bajas", 8 => "Cocuyos", 9 => "Direccional izquierda",
                        10 => "Direccional derecha", 11 => "Pito", 12 => "Luz de reversa",
                        13 => "Limpiabrisas", 14 => "Luz freno", 15 => "Indicador combustible",
                        16 => "Indicador Presión aceite", 17 => "Indicador batería", 18 => "Bateria sin residuos",
                        19 => "Labrado", 20 => "Presión", 21 => "Tuercas completas y aseguradas", 22 => "Freno de parqueo", 23 => "Frenos funcionando",
                        24 => "Espejos retrovisores", 25 => "Puertas cierran y ajustan", 26 => "Ajuste horizontal sillas", 27 => "Ajuste vertical sillas", 28 => "Tapizado sin roturas o manchas",
                    ];
                    $name = [0 => "nivel_aceite_motor", 1 => "nivel_liquido_direccion", 2 => "liquido_frenos_dentro_limites",
                        3 => "nivel_liquido_refrigerante", 4 => "radiador_tapa_ajustada", 5 => "correa_ventilador_tensionada", 6 => "nivel_agua_limpiabrisas",
                        7 => "encienden_luces_bajas", 8 => "encienden_cocuyos", 9 => "encienden_direccionales_atras_delante",
                        10 => "encienden_direccionales_atras_delante", 11 => "pito", 12 => "enciende_luz_reversa",
                        13 => "limpiabrisas_funcionando", 14 => "encienden_luces_freno", 15 => "nivel_combustible",
                        16 => "indicador_presion_aceite", 17 => "indicador_nivel_bateria", 18 => "bateria_sin_residuos",
                        19 => "labrado", 20 => "presion", 21 => "tuercas_completas_aseguradas", 22 => "freno_parqueo_funciona", 23 => "frenos_funcionando",
                        24 => "espejos_retrovisores_funcionando", 25 => "todas_puertas_cierran_ajustan", 26 => "ajuste_horizontal_sillas_delanteras", 27 => "ajuste_vertical_sillas_delanteras", 28 => "tapizado_roturas_manchas",
                    ];
                    for ($index1 = 0; $index1 < 29; $index1++) {
                        ?>
                        <tr style = "text-align: center; font-weight: bold;font-size: 10pt;">
                            <?php
                            if ($index1 == 0) {
                                ?>
                                <td rowspan="29" style="width: 75px;"><img src="/app/img/logo_transprotours_vertical.png" style="width: 67px;height: 414px;"></td>
                                <?php
                            }
                            ?>
                            <?php
                            switch ($index1) {
                                case 0:
                                    ?>
                                    <td rowspan = "7" style="width: 43px;">
                                        <div style="width: 9px;word-break: break-word;margin: auto;">MOTOR</div>
                                        <?php
                                        break;
                                    case 7:
                                        ?>
                                    <td rowspan="12">
                                        <div style="width: 9px;word-break: break-word;margin: auto;">ELECTRICIDAD</div>
                                        <?php
                                        break;
                                    case 19:
                                        ?>
                                    <td rowspan="5">
                                        <div style="transform: rotate(-35deg);">LLANTAS</div>
                                        <?php
                                        break;
                                    case 24:
                                        ?>
                                    <td rowspan="5">
                                        <div style="width: 9px;word-break: break-word;margin: auto;">OTROS</div>
                                        <!--<div style="width: 9px;word-break: break-word;margin: auto;">PRESENTACIÓN</div>-->
                                        <?php
                                        break;
                                }
                                ?>
                            </td>
                            <?php
                            if (isset($labels[$index1])) {
                                ?>
                                <td class='text-revision' style="text-align: left;height: 18px;">
                                    <?php
                                    echo $labels[$index1];
                                    ?>
                                </td>
                                <?php
                            } else {
                                ?>
                                <td>MOTOR</td>
                                <?php
                            }

                            for ($index2 = 0; $index2 < count($dias_ES); $index2++) {
                                $crea = false;
                                for ($index3 = 0; $index3 < count($result); $index3++) {
                                    if (isset($result[$index3])) {
                                        $fecha_hora = date($result[$index3]["fecha"]);
                                        $dia = date('l', strtotime($fecha_hora));
                                        $nombredia = str_replace($dias_EN, $dias_ES, $dia);
//                                print_r($nombredia);
//                                print_r($dias_ES[$index2]);
                                        if ($nombredia === $dias_ES[$index2]) {
                                            if (isset($name[$index1])) {
                                                $crea = true;
//                                            print_r($result[$index3][$name[$index1]]);
                                                if ($result[$index3][$name[$index1]] != "SI") {
                                                    ?>
                                                    <td>X</td>
                                                    <td> </td>
                                                    <td> </td>
                                                    <?php
                                                } else if ($result[$index3][$name[$index1]] == "SI") {
                                                    ?>
                                                    <td> </td>
                                                    <td> </td>
                                                    <td>X</td>
                                                    <?php
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!$crea) {
                                    ?>
                                    <td> </td>
                                    <td> </td>
                                    <td> </td>
                                    <?php
                                }
                            }
                            ?>
                        </tr>
                    <?php } ?>
                    <tr>
                        <td colspan="22" style="height: 100px;position: relative;">
                            <div style="position: absolute; top: 2px; left: 2px;"> OBSERVACIONES: Diligenciar los items que aplican para la operación del automotor</div>
                            <div style="height: 23px;margin: auto; width: 90%; border-bottom: 1px solid; border-top: 1px solid;margin-top: 15px;" ></div>
                            <div style="height: 23px;margin: auto; width: 90%; border-bottom: 1px solid; " ></div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="22" style="height: 60px;position: relative;">
                            <div style="position: absolute;bottom: 5px;">
                                &nbsp; REVISADO POR: &nbsp;&nbsp;&nbsp;<img style="height: 48px;" src="<?php echo $fc; ?>" alt="firma conductor" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                SUPERVISADO POR:&nbsp;&nbsp;&nbsp;<img style="height: 48px;" src="<?php echo $fs; ?>" alt="firma supervisor" />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="22" style="height: 42px;position: relative;text-align: center;">
                            TRANSPRO TOUR ́S S.A.S no se hace responsable por el mal diligenciamiento de la planilla de REVISION DIARIA DE VEHICULOS, ni por el diligenciar estudio del automotor con respuestas no acordes
                            a la realidad del vehiculo.
                        </td>
                    </tr>
                    <tr>
                        <td colspan="22" style="height: 4px;position: relative;padding-left: 2px;">
                            <div>INSTRUCCIONES DE DILIGENCIAMIENTO</div>
                            <div>1. Diligenciar los espacios con informacion clara y veraz.</div>
                            <div>2. La planilla debe ser diligenciada antes de empezar la operación.</div>
                            <div>3. La informacion de revision preoperacional del vehiculo debe ser sujeta a las condiciones del automotor antes de iniciar la operación.</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </body>
</html>
