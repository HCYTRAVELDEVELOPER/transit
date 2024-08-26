<?php
//require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
global $id;
if (isset($_POST["id"])) {
    $id = $_POST["id"];
} else {
    $id = $_GET["id"];
}

//function dias_transcurridos($fecha_i, $fecha_f) {
//    $dias = (strtotime($fecha_i) - strtotime($fecha_f)) / 86400;
//    $dias = abs($dias);
//    $dias = floor($dias);
//    return $dias;
//}
function projectplan_data() {
    global $id;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = " where 1=1 ";
    if (isset($id)) {
        $where .= " and id=:id ";
    } else {
        return;
    }
    $sql = "select * FROM projectplan_enc " . $where;
    $ca->prepare($sql);
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($ca->size() == 0) {
        echo "No se han encontrado datos";
    }
    $ca->next();
    return $ca->assoc();
}

$enc = projectplan_data();
//echo "inicia: " . $enc["fecha_inicial"];
//echo ". Termina:" . $enc["fecha_final"];
$totalDias = dias_transcurridos($enc["fecha_inicial"], $enc["fecha_final"]);
//echo " total dias:" . $totalDias;
?>
<div class="contenedor_cronoFixed">
    <table id="Exportar_a_Excel">
        <tr class="enc_etapas_dias">
            <td class="encTdFil">
                Etapa / días
            </td>
            <?php
            global $f_initial;
            $f_initial = explode("-", $enc["fecha_inicial"]);
            $mesAhora = $f_initial[1];
            $anoAhora = $f_initial[0];
            $mes = mktime(0, 0, 0, $mesAhora, 1, $anoAhora);
            $númeroDeDias = date('t', $mes);
            $day = $f_initial[2];
            for ($i = 0; $i < $totalDias; $i++) {
                if ($day > $númeroDeDias) {
                    $day = 1;
                    $mesAhora++;
                    if ($mesAhora >= 12) {
                        $mesAhora = 1;
                        $anoAhora++;
                    }
                    $mes = mktime(0, 0, 0, $mesAhora, 1, $anoAhora);
                    $númeroDeDias = date('t', $mes);
                }
                $day_week = date('N', strtotime($anoAhora . '-' . $mesAhora . "-" . $day));
                if ($day_week == 1) {
                    $day_name = "L";
                    $ends_weekend = "";
                }
                if ($day_week == 2) {
                    $day_name = "M";
                    $ends_weekend = "";
                }
                if ($day_week == 3) {
                    $day_name = "M";
                    $ends_weekend = "";
                }
                if ($day_week == 4) {
                    $day_name = "J";
                    $ends_weekend = "";
                }
                if ($day_week == 5) {
                    $day_name = "V";
                    $ends_weekend = "";
                }
                if ($day_week == 6) {
                    $day_name = "S";
                    $ends_weekend = "ends_weekend";
                }
                if ($day_week == 7) {
                    $day_name = "D";
                    $ends_weekend = "ends_weekend";
                }
                $zero = "";
                $cuenta = strlen($mesAhora);
                if ($cuenta == 1) {
                    $zero = "0";
                } else {
                    $zero = "";
                }
                $cuentaDia = strlen($day);
                if ($cuentaDia == 1) {
                    $zeroDia = "0";
                } else {
                    $zeroDia = "";
                }
                $f = "{$anoAhora}-{$zero}{$mesAhora}-{$zeroDia}{$day}";
//                 <br />$anoAhora
                $cl = "";
                $cld = "";
                if ($f == date("Y-m-d")) {
                    $cl = "td_hoy";
                    $cld = "<div class='class_show_hoy'></div>";
                }
                echo "<td class='td_enc {$cl}' >{$cld}<span class='dia_month'>$zero$mesAhora</span><span class='dia_number'>$zeroDia$day</span><span class='dia_text'>$day_name</span></td>";
                $day++;
            }
            ?>
        </tr>
        <?php
        $ca = new NWDbQuery($db);
        $where = " where id_enc=:id_enc";
        $sql = "select * FROM projectplan_etapas " . $where . " order by fecha_inicial asc";
        $ca->prepare($sql);
        $ca->bindValue(":id_enc", $id);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta. ";
            return;
        }
        $total = $ca->size();
        if ($total == 0) {
            echo "No se han encontrado etapas";
        }
//        show_hoy_enc(1, 1);
        for ($ii = 0; $ii < $total; $ii++) {
            $ca->next();
            $et = $ca->assoc();
            ?>
            <tr class="tr_etapa">
                <td class="td_etapa">
                    <?php echo $et["nombre"]; ?>
                    <div class="fechastd_etapa">
                        <span>
                            <?php
                            echo $et["fecha_inicial"] . " " . $et["fecha_final"];
                            ?>
                        </span>
                    </div>
                </td>
                <?php
                $f_initial = explode("-", $enc["fecha_inicial"]);
                $mesAhora = $f_initial[1];
                $anoAhora = $f_initial[0];
                $mes = mktime(0, 0, 0, $mesAhora, 1, $anoAhora);
                $númeroDeDias = date('t', $mes);
                $bg = "";
                $day = $f_initial[2];
                $totalDiasEtapa = dias_transcurridos($et["fecha_inicial"], $et["fecha_final"]);
                for ($i = 0; $i < $totalDias; $i++) {
                    if ($day > $númeroDeDias) {
                        $day = 1;
                        $mesAhora++;
                        if ($mesAhora >= 12) {
                            $mesAhora = 1;
                            $anoAhora++;
                        }
                        $mes = mktime(0, 0, 0, $mesAhora, 1, $anoAhora);
                        $númeroDeDias = date('t', $mes);
                    }
                    $zero = "";
                    $cuenta = strlen($mesAhora);
                    if ($cuenta == 1) {
                        $zero = "0";
                    } else {
                        $zero = "";
                    }
                    $cuentaDia = strlen($day);
                    if ($cuentaDia == 1) {
                        $zeroDia = "0";
                    } else {
                        $zeroDia = "";
                    }
                    $fechaAhora = $anoAhora . "-" . $zero . $mesAhora . "-" . $zeroDia . $day;
                    $dayShow = "";
                    $cls = "";
                    if ($fechaAhora >= $et["fecha_inicial"] && $totalDiasEtapa != -1) {
                        $cls = "days_etapa_active";
                        $bg = "rgb(0, 143, 255)";
                        $color = "#fff";
                        $dayShow = $day;
                        $totalDiasEtapa--;
                    } else {
                        $cls = "";
                        $bg = "";
                        $color = "";
                        $dayShow = "";
                    }
                    if ($enc["tipo"] == "habiles") {
                        $day_week_happy_et = date('N', strtotime($anoAhora . '-' . $zero . $mesAhora . "-" . $zeroDia . $day));
                        if ($day_week_happy_et == 6) {
                            $day_happy_et = "day_happy_et_tr";
                        } else
                        if ($day_week_happy_et == 7) {
                            $day_happy_et = "day_happy_et_tr";
                        } else {
                            $day_happy_et = "";
                        }
                    } else {
                        $day_happy_et = "";
                    }
                    echo "<td class='et days_etapa {$cls} $day_happy_et ' >$dayShow </td>";
                    $day++;
                }
                ?>
            </tr>
            <?php
            tareas($et["id"], $et["fecha_inicial"], $et["fecha_final"], $totalDias, $enc["tipo"]);
        }

        function tareas($id, $fInit, $fFin, $totalDias, $tipo) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $where = " where etapa=:id ";
            if (isset($_GET["usuario_asignado"])) {
                $where .= " and usuario_asignado={$_GET["usuario_asignado"]}";
            }
            $sql = "select *,fecha::date as fecha_inicial, 
                        func_concepto(usuario_asignado, 'usuarios') as usuario_responsable, 
                        func_concepto(estado, 'estados_tareas_diarias', 'color') as color_estado
                         FROM tareas_diarias " . $where . " order by id asc";
            $ca->prepare($sql);
            $ca->bindValue(":id", $id);
            if (!$ca->exec()) {
                echo "No se pudo realizar la consulta. ";
                return;
            }
            $total = $ca->size();
            if ($total == 0) {
//                echo "No se han encontrado etapas";
            }
            for ($ii = 0; $ii < $total; $ii++) {
                $ca->next();
                $et = $ca->assoc();
                $color = "";
                $color_texto = "#ffffff";
                if ($et["estado"] == 3) {
                    $color = "#67A003";
                    $color_texto = "#ffffff";
                } else
                if ($et["fecha_final"] < date("Y-m-d")) {
                    $color = "firebrick";
                    $color_texto = "#fff";
                } else {
                    $color = "#e6e6e6";
                    $color_texto = "#000";
                }
                ?>
                <tr class="tr_tar_fil ">
                    <td class="td_task" style="background: <?php echo $color; ?>; color: <?php echo $color_texto; ?>;">
                        <div class="fechastd">
                            <span>
                                <?php
                                echo $et["fecha_inicial"] . " " . $et["fecha_final"];
                                ?>
                            </span>
                        </div>
                        <?php
                        echo "<span style='display: none;' >" . $et["id"] . "</span>" . $et["tarea"] . " <br /><b>" . $et["usuario_responsable"] . "</b>";
                        ?>
                    </td>
                    <?php
                    global $f_initial;
//                    $f_initial = explode("-", $et["fecha_inicial"]);
                    $mesAhora = $f_initial[1];
                    $anoAhora = $f_initial[0];
                    $mes = mktime(0, 0, 0, $mesAhora, 1, $anoAhora);
                    $númeroDeDias = date('t', $mes);
                    $bg = "";
                    $clsc = "";
                    $clsc2 = "";
                    $day = $f_initial[2];
                    $totalDiasEtapa = dias_transcurridos($et["fecha_inicial"], $et["fecha_final"]);
                    for ($i = 0; $i < $totalDias; $i++) {
                        if ($day > $númeroDeDias) {
                            $day = 1;
                            $mesAhora++;
                            if ($mesAhora >= 12) {
                                $mesAhora = 1;
                                $anoAhora++;
                            }
                            $mes = mktime(0, 0, 0, $mesAhora, 1, $anoAhora);
                            $númeroDeDias = date('t', $mes);
                        }
                        $zero = "";
                        $cuenta = strlen($mesAhora);
                        if ($cuenta == 1) {
                            $zero = "0";
                        } else {
                            $zero = "";
                        }
                        $cuentaDia = strlen($day);
                        if ($cuentaDia == 1) {
                            $zeroDia = "0";
                        } else {
                            $zeroDia = "";
                        }
                        $fechaAhora = $anoAhora . "-" . $zero . $mesAhora . "-" . $zeroDia . $day;
                        $dayShow = "";
                        $textTarea = "";
                        $divText = "";
                        $textRespuesta = "";
                        if ($fechaAhora >= $et["fecha_inicial"] && $totalDiasEtapa != -1) {
                            $bg = "#e6e6e6";
                            $clsc = "tarea_activa";
                            $clsc2 = "";
                            $color = "#666";
                            $dayShow = $day;
                            $textTarea = $et["tarea"];
                            $cc = new NWDbQuery($db);
                            $cc->prepareSelect("tareas_det", "*", "tarea=:tarea");
                            $cc->bindValue(":tarea", $et["id"]);
                            if (!$cc->exec()) {
                                echo "No se pudo consultar";
                                return;
                            }
                            if ($cc->size() > 0) {
                                $cc->next();
                                $res = $cc->assoc();
                                $textRespuesta .= "<p class='respuesta_p'><b>Rta " . $res["usuario"] . " (" . $res["fecha"] . "):</b> " . $res["observaciones"] . "</p>";
                            }
                            $divText = "<div class='descriptionTask'>$textTarea <br /><b>" . $et["usuario_responsable"] . "</b> $textRespuesta </div>";
                            $totalDiasEtapa--;
                            if ($et["estado"] == 3) {
                                $bg = "#67A003";
                                $clsc2 = "tarea_activa_pasada";
                                $clsc = "tarea_activa";
                                $color = "#ffffff";
                            } else
                            if ($et["fecha_final"] < date("Y-m-d")) {
//                                $bg = "red";
                                $bg = $et["color_estado"];
                                $color = "#000";
                            } else {
                                $color = "";
                                $color_texto = "";
                            }
                        } else {
//                            $bg = $et["color_estado"];
                            $color = "";
                            $textTarea = "";
                            $dayShow = "";
                            $divText = "";
                        }
                        if ($tipo == "habiles") {
                            $day_week_happy_et = date('N', strtotime($anoAhora . '-' . $zero . $mesAhora . "-" . $zeroDia . $day));
                            if ($day_week_happy_et == 6) {
                                $day_happy_et = "day_happy_et";
                                $divText = "";
                                $dayShow = "";
                            } else
                            if ($day_week_happy_et == 7) {
                                $day_happy_et = "day_happy_et";
                                $divText = "";
                                $dayShow = "";
                            } else {
                                $day_happy_et = "";
                            }
                        } else {
                            $day_happy_et = "";
                        }
                        if ($dayShow == "") {
                            $bg = "transparent";
                            $clsc2 = "";
                            $clsc = "";
                        }
//                        echo "<td  class='tdTask {$clsc} {$clsc2} $day_happy_et  ' style='background: $bg; color:$color'>$dayShow $divText </td>";
                        echo "<td  class='tdTask {$clsc} {$clsc2} $day_happy_et  ' >$dayShow $divText </td>";
                        $day++;
                    }
                    ?>
                </tr>
                <?php
            }
        }
        ?>
    </table>
</div>
