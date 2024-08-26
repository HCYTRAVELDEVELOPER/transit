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
$id = master::clean($_GET["id"]);
$ca->prepare("select * from edo_preoperacional where id=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

if ($ca->size() != 0) {
    $result = $ca->flush();
}

//print_r($result);

$ca->prepare("select * from usuarios where id=:id");
$ca->bindValue(":id", $si["id_usuario"]);
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}

//if ($ca->size() != 0) {
    $user = $ca->flush();
//} else {
//    echo 'Este usuario administrativo no tiene una firma asociada, por favor ingrese al modulo de usuarios admin y ingrese una firma.';
//    return;
//}
//print_r($user);
$ca->prepare("select * from empresas where id=:id");
$ca->bindValue(":id", $result["empresa"]);
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

function limpiar($p) {
//    $res = str_replace("_", " ", $p);
//    return strtoupper($res);
//    return strtoupper($p);

    return $p;
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
        .logotipo{
            width: auto;
            max-width: 150px;
        }
    </style>
    <head>
    </head>
    <body style="font-family: sans-serif;margin: auto;max-width: 1000px;">
        <div style="margin: 20px 10px 10px 10px;">
            <table align="center" border="1" cellpadding="0" cellspacing="0" style="width:100%;margin-left: 0">
                <tbody>
                    <tr>
                        <td>
                            <img class="logotipo" src="<?php echo $host; ?>" alt="logo" />
                        </td>
                        <td class="center">
                            <h3>INSPECCIÓN PREOCUPACIONAL A VEHÍCULOS</h3>
                        </td>
                        <td class="center">
                            <h4>HV-O&A-F-07-11</h4>
                            <h4>Rev. 4</h4>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" class="center"> 
                            <h3>
                                1.DATOS DEL CONDUCTOR Y VEHÍCULO
                            </h3>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"><b>Base:</b></td>
                        <td><b>Placa: <?php echo $result["placa"]; ?></b></td>
                    </tr>
                <table align="center" border="1" cellpadding="0" cellspacing="0" style="width:100%;margin-left: 0">
                    <tr>
                        <td colspan="2" rowspan="2" class="center"><b>2. LISTADO DE VERIFICACIÓN</b></td>
                        <td class="center" colspan="2"><b> <?php echo $result["fecha"]; ?></b> </td>
                    </tr>
                    <tr>
                        <!--<td><b>Si</b> </td>-->
                        <td class="center"colspan="2"><b>Cumple</b> </td>
                    </tr>
                    <tbody>
                        <?php
//                        $count = 1;
//                        foreach ($result as $key => $value) {
//                            if ($value == "SI" || $value == "NO") {
//                                
                        ?>
<!--                                <tr>
                                    <td class="center" style="width: 30px;"><?php // echo $count;                                      ?></td>
                                    <td class="center">//<?php //echo limpiar($key);                                      ?></td>
                                    <td class="center"> //<?php //echo $value;                                      ?></td>
                                </tr>-->
                        <?php
//                                $count++;
//                            }
//                        }
//                        
                        ?>
                        <tr>
                            <td class="center" style="width: 30px;">1</td>
                            <td class="center"><?php echo limpiar("Presión"); ?></td>
                            <td class="center"><?php echo $result["presion"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">2</td>
                            <td class="center"><?php echo limpiar("Labrado"); ?></td>
                            <td class="center"><?php echo $result["presion"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">3</td>
                            <td class="center"><?php echo limpiar("Tuercas completas y aseguradas"); ?></td>
                            <td class="center"><?php echo $result["tuercas_completas_aseguradas"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">4</td>
                            <td class="center"><?php echo limpiar("Freno de parqueo funciona"); ?></td>
                            <td class="center"><?php echo $result["freno_parqueo_funciona"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">5</td>
                            <td class="center"><?php echo limpiar("Frenos funcionando"); ?></td>
                            <td class="center"><?php echo $result["frenos_funcionando"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">6</td>
                            <td class="center"><?php echo limpiar("Líquido de frenos dentro de los límites"); ?></td>
                            <td class="center"><?php echo $result["liquido_frenos_dentro_limites"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">7</td>
                            <td class="center"><?php echo limpiar("Enciende la luz de reversa"); ?></td>
                            <td class="center"><?php echo $result["enciende_luz_reversa"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">8</td>
                            <td class="center"><?php echo limpiar("Encienden luces bajas"); ?></td>
                            <td class="center"><?php echo $result["encienden_luces_bajas"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">9</td>
                            <td class="center"><?php echo limpiar("Encienden cocuyos"); ?></td>
                            <td class="center"> <?php echo $result["encienden_cocuyos"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">10</td>
                            <td class="center"><?php echo limpiar("Encienden luces de freno"); ?></td>
                            <td class="center"><?php echo $result["encienden_luces_freno"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">11</td>
                            <td class="center"><?php echo limpiar("Encienden direccionales (adelante y atrás"); ?></td>
                            <td class="center"><?php echo $result["encienden_direccionales_atras_delante"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">12</td>
                            <td class="center"><?php echo limpiar("Nivel de combustible"); ?></td>
                            <td class="center"><?php echo $result["nivel_combustible"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">13</td>
                            <td class="center"><?php echo limpiar("Indicador de presión de aceite"); ?></td>
                            <td class="center"><?php echo $result["indicador_presion_aceite"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">14</td>
                            <td class="center"><?php echo limpiar("Indicador nivel de batería"); ?></td>
                            <td class="center"><?php echo $result["indicador_nivel_bateria"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">15</td>
                            <td class="center"><?php echo limpiar("Espejos retrovisores funcionando"); ?></td>
                            <td class="center"><?php echo $result["espejos_retrovisores_funcionando"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">16</td>
                            <td class="center"><?php echo limpiar("Todas las puertas cierran y ajustan"); ?></td>
                            <td class="center"><?php echo $result["todas_puertas_cierran_ajustan"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">17</td>
                            <td class="center"><?php echo limpiar("Nivel de aceite del motor"); ?></td>
                            <td class="center"><?php echo $result["nivel_aceite_motor"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">18</td>
                            <td class="center"><?php echo limpiar("Nivel del líquido de la dirección"); ?></td>
                            <td class="center"><?php echo $result["nivel_liquido_direccion"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">19</td>
                            <td class="center"><?php echo limpiar("Nivel del líquido refrigerante"); ?></td>
                            <td class="center"><?php echo $result["nivel_liquido_refrigerante"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">20</td>
                            <td class="center"><?php echo limpiar("Nivel del agua del limpiabrisas"); ?></td>
                            <td class="center"><?php echo $result["nivel_agua_limpiabrisas"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">21</td>
                            <td class="center"><?php echo limpiar("Pito"); ?></td>
                            <td class="center"><?php echo $result["pito"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">22</td>
                            <td class="center"><?php echo limpiar("Limpiabrisas funcionando"); ?></td>
                            <td class="center"><?php echo $result["limpiabrisas_funcionando"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">23</td>
                            <td class="center"><?php echo limpiar("Radiador con tapa ajustada"); ?></td>
                            <td class="center"><?php echo $result["radiador_tapa_ajustada"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">24</td>
                            <td class="center"><?php echo limpiar("Correa del ventilador tensionada"); ?></td>
                            <td class="center"><?php echo $result["correa_ventilador_tensionada"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">25</td>
                            <td class="center"><?php echo limpiar("Batería sin residuos"); ?></td>
                            <td class="center"><?php echo $result["bateria_sin_residuos"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">26</td>
                            <td class="center"><?php echo limpiar("Ajuste horizontal sillas delanteras"); ?></td>
                            <td class="center"><?php echo $result["ajuste_horizontal_sillas_delanteras"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">27</td>
                            <td class="center"><?php echo limpiar("Ajuste vertical sillas delanteras"); ?></td>
                            <td class="center"><?php echo $result["ajuste_vertical_sillas_delanteras"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">28</td>
                            <td class="center"><?php echo limpiar("Tapizado sin roturas o manchas"); ?></td>
                            <td class="center"><?php echo $result["tapizado_roturas_manchas"]; ?></td>
                        </tr>
                        <tr>
                            <td class="center" style="width: 30px;">28</td>
                            <td class="center" colspan="2"><div style="text-align: left;"><?php echo limpiar("Observaciones conductor"); ?> :</div> <div style="text-align: justify; padding: 15px;"><?php echo $result["observaciones"]; ?></div></td>
                        </tr>
                    </tbody>
                </table>
                </tbody>
            </table>
            <br>
            <table width="100%" border="1" cellpadding="0" cellspacing="0">
                <tr>
                    <th class="center" style="width: 200px; height: 60px">Firma conductor</th>
                    <td class="center"> <img src="<?php echo $fc; ?>" alt="logo" /></td>
                </tr>
                <tr>
                    <th class="center" style="width: 200px; height: 60px">Firma supervisor</th>
                    <td class="center"> <img src="<?php echo $fs; ?>" alt="logo" /> </td>
                </tr>
            </table>
        </div>
    </body>
</html>
