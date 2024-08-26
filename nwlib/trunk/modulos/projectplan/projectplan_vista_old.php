<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="/nwlib/modulos/projectplan/css/css.css" />
<script type="text/javascript" src="/nwlib/includes/jquery/jquery-1.4.2.min.js" ></script>
<script type="text/javascript" src="/nwlib/includes/jquery/jquery.validate.1.5.2.js" ></script>
<script type="text/javascript" src="/nwlib/includes/jquery/jquery-ui-1.8.1.custom.min.js"></script> 

<link type="text/css" href="/nwlib/includes/jquery/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
<script type="text/javascript" src="/nwlib/includes/jquery/dialogextend/jquery.dialogextend.min.js" ></script>

<script type="text/javascript" src="/nwlib/modulos/projectplan/js/main.js" ></script>
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
global $id;
if (isset($_POST["id"])) {
    $id = $_POST["id"];
} else {
    $id = $_GET["id"];
}

function dias_transcurridos($fecha_i, $fecha_f) {
    $dias = (strtotime($fecha_i) - strtotime($fecha_f)) / 86400;
    $dias = abs($dias);
    $dias = floor($dias);
    return $dias;
}

function projectplan_enc() {
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
    //  $ca->bindValue(":user", $id_user);
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($ca->size() == 0) {
        echo "No se han encontrado datos";
    }
    $ca->next();
    $r = $ca->assoc();
    global $dia_inicial;
    global $mes_inicial;
    global $ano_inicial;
    global $total_dias_proyecto;

    $datetime1 = new DateTime($r["fecha_inicial"]);
    $datetime2 = new DateTime($r["fecha_final"]);
    $interval = $datetime1->diff($datetime2);
    $total_dias_proyecto = $interval->format('%R%a  días');
    //  echo $total_dias_proyecto;

    $fecha_inicial = explode("-", $r["fecha_inicial"]);
    $fecha_final = explode("-", $r["fecha_final"]);
    $mes_inicial = $fecha_inicial[1];
    $ano_inicial = $fecha_inicial[0];


    $dia_inicial = $fecha_inicial[2];
    $mes = mktime(0, 0, 0, $mes_inicial, 1, $ano_inicial);
    $númeroDeDias = date('t', $mes);
    $total_dias_mes = $númeroDeDias;
    $sobran_dias = 100 - $total_dias_mes;
    $fecha_inicial_repacle = str_replace("-", "", $r["fecha_inicial"]);
    $fechaInicial = $fecha_inicial_repacle;
    $fecha_entrega_repacle = str_replace("-", "", $r["fecha_final"]);
    $fecha_entrega = $fecha_entrega_repacle;
    global $fdias;
    $fdias = dias_transcurridos($r["fecha_inicial"], $r["fecha_final"]);
//    $fdias = $fecha_entrega - $fechaInicial;
//    if ($fdias > $total_dias_mes & $fdias <= 130) {
//        $fdias = $fdias - $sobran_dias;
//    } else
//    if ($fdias > 130 & $fdias <= 230) {
//        $fdias = $fdias - ($sobran_dias * 2);
//    }

    $mes_mes = $fecha_inicial[1];
    $total_dias = date("t", $mes_mes);
    $mm = "";
    $sum_happys = "";
    $dayHappyNext = "";
    for ($d = 0; $d < $fdias; $d++) {
        $dayHappy = $d + $dia_inicial;
        $day_very_happy = $dayHappy;
        if ($dayHappy > $total_dias) {
//            $mes_mes_ahora = $mes_mes + 1;
            $mes_mes_ahora = $mes_mes + 1;
            $total_dias = date("d", mktime(0, 0, 0, $mes_mes_ahora + 1, 0, $ano_inicial));
            $mm = $mes_mes_ahora;
            $dayHappy = "";
            $dayHappyNext += 1;
            $day_very_happy = $dayHappyNext;
            if ($dayHappyNext > $total_dias) {
                $dayHappyNext = 0;
                $mes_mes += 1;
            }
        } else {
            $mm = $mes_mes;
        }
        $day_week_happy = date('N', strtotime($ano_inicial . '-' . $mm . "-" . $day_very_happy));
        if ($day_week_happy == 6) {
            $sum_happys += 1;
        }
        if ($day_week_happy == 7) {
            $sum_happys += 1;
        }
    }
    global $tipo_calendario;
    $tipo_calendario = $r["tipo"];
    if ($tipo_calendario == "habiles") {
        $gran_total_dias_proyecto = $fdias - $sum_happys;
    } else {
        $gran_total_dias_proyecto = $fdias;
    }
    echo $r["nombre"] . " " . $gran_total_dias_proyecto . " días " . $r["tipo"] . " Inicio:" . $r["fecha_inicial"] . " Final:" . $r["fecha_final"];
}

function show_hoy_enc($p, $h) {
    global $id;
    global $dia_inicial;
    global $mes_inicial;
    global $ano_inicial;
    global $fdias;
    $hoy = date("d");
    //MUESTRA EL DÍA DE HOY EN EL CRONOGRAMA
    $dia_inicia_proyecto = $dia_inicial - $hoy;
    if ($p != "") {
        echo "<tr class='enc_etapas_dias'><td style='width:100px;max-width: 100px;'>Etapas/Días</td>";
    }

    $total_dias_del_mes = date("d", mktime(0, 0, 0, $mes_inicial + 1, 0, $ano_inicial));

    $text_del = "del";
    $mes_dia = $mes_inicial;
    for ($iiii = 0; $iiii < $dia_inicia_proyecto; $iiii++) {
        if ($h != "") {
            $dayEncHoySuma = $iiii + $hoy;
            if ($dayEncHoySuma == $hoy & $mes_dia == date("m")) {
                $class_show_hoy_uno = "<div class='class_show_hoy'>^</div> ";
            } else {
                $class_show_hoy_uno = "";
                //  $dayEncHoySuma = "";
            }
            $day_week = date('N', strtotime($ano_inicial . '-' . $mes_inicial . "-" . $dayEncHoySuma));
            if ($day_week == 1) {
                $day_name = "Lunes";
                $ends_weekend = "";
            }
            if ($day_week == 2) {
                $day_name = "Martes";
                $ends_weekend = "";
            }
            if ($day_week == 3) {
                $day_name = "Miercoles";
                $ends_weekend = "";
            }
            if ($day_week == 4) {
                $day_name = "Jueves";
                $ends_weekend = "";
            }
            if ($day_week == 5) {
                $day_name = "Viernes";
                $ends_weekend = "";
            }
            if ($day_week == 6) {
                $day_name = "Sabado";
                $ends_weekend = "ends_weekend";
            }
            if ($day_week == 7) {
                $day_name = "Domingo";
                $ends_weekend = "ends_weekend";
            }
        } else {
            $class_show_hoy_uno = "";
            $dayEncHoySuma = "";
            $day_name = "";
            $mes_dia = "";
            $text_del = "";
        }
        if ($dayEncHoySuma < date("m")) {
            //   echo "<td>uno $class_show_hoy_uno $dayEncHoySuma <span>$day_name $text_del  $mes_dia</span></td>";
        }
    }
    $dayEncNext = "";
    if ($p != "") {
        for ($iii = 0; $iii < $fdias + 1; $iii++) {
            $class_show_hoy = "";
            $dayEnc = $iii + $dia_inicial;
             $year = date("Y");
            if ($dayEnc > $total_dias_del_mes) {
                global $mes_dia_ahora_global;
                if($mes_dia == 12) {
                    $mes_dia = 0;
                    $year += 1;
                }
                $mes_dia_ahora = $mes_dia + 1;
                $mes_dia_ahora_global = $mes_dia_ahora;
                $total_dias_del_mes = date("d", mktime(0, 0, 0, $mes_dia_ahora + 1, 0, $ano_inicial));
                $dayEnc = "";
                $dayEncNext += 1;
                if ($dayEncNext > $total_dias_del_mes) {
                    $dayEncNext = 1;
                    $mes_dia += 1;
                    $day_week_two = date('N', strtotime($year. '-' . $mes_dia_ahora . "-" . $dayEncNext));
                }
                $day_week_two = date('N', strtotime($year . '-' . $mes_dia_ahora . "-" . $dayEncNext));
                if ($dayEncNext == $hoy & $mes_dia_ahora == date("m")) {
                    $class_show_hoy = "<div class='class_show_hoy'>^</div> ";
                }
            } else {
                $mes_dia_ahora = $mes_dia;
                $day_week_two = date('N', strtotime($year . '-' . $mes_dia_ahora . "-" . $dayEnc));
                if ($dayEnc == $hoy & $mes_dia == date("m")) {
                    $class_show_hoy = "<div class='class_show_hoy'>^</div> ";
                }
            }
            if ($day_week_two == 1) {
                $day_name_two = "Lunes";
            }
            if ($day_week_two == 2) {
                $day_name_two = "Martes";
            }
            if ($day_week_two == 3) {
                $day_name_two = "Miercoles";
            }
            if ($day_week_two == 4) {
                $day_name_two = "Jueves";
            }
            if ($day_week_two == 5) {
                $day_name_two = "Viernes";
            }
            if ($day_week_two == 6) {
                $day_name_two = "Sabado";
            }
            if ($day_week_two == 7) {
                $day_name_two = "Domingo";
            }
            echo "<td> $class_show_hoy $dayEnc $dayEncNext  <span>$day_name_two del $mes_dia_ahora </span></td>";
        }
        echo "</tr>";
    }
}

function projectplan_etapas() {
    global $id;
    global $fdias;
    global $dia_inicial;
    global $mes_inicial;
    global $ano_inicial;
    global $total_dias_proyecto;
    global $mes_dia_ahora_global;
    global $tipo_calendario;
    $hoy = date("d");
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
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
        echo "No se han encontrado datos";
    }
    show_hoy_enc(1, 1);
    //MUESTRA TODOS LOS DÍAS DEL PROYECTO
    // echo "<tr class='enc_etapas_dias'><td>Etapas/Días</td>";
    //  echo $fdias;
    //  show_hoy_enc("","...");
    for ($iii = 0; $iii < $fdias + 1; $iii++) {
        $dayEnc = $iii + $dia_inicial;
        //  echo "<td> $dayEnc</td>";
    }
    echo "</tr>";
//    echo "<tr><td></td>";
//    for ($iii = 0; $iii < $fdias + 1; $iii++) {
//        global $dia_inicial;
//        $dayEnc = $iii + $dia_inicial;
//        if($dayEnc > 31) {
//            echo "ff";
//        }
//        echo "<td>$dayEnc</td>";
//    }
    //   echo "</tr>";
    for ($i = 0; $i < $total; $i++) {
        $day = "";
        $dayEncNext = "";
        $dayy = "";
        $dayyEncNextt = "";
        $ca->next();
        $r = $ca->assoc();
        $number_etap = $i + 1;
        echo "<tr class='tr_etapa'>";
        echo "<td><div class='max_width_td'>" . $number_etap . ". Etapa: " . $r["nombre"] . "</div></td>";
        $d_initt = explode("-", $r["fecha_inicial"]);
        $d_finitt = explode("-", $r["fecha_final"]);
        show_hoy_enc("", "");
        for ($iiiii = 0; $iiiii < $fdias + 1; $iiiii++) {
            $dayy = $iiiii + $dia_inicial;
//            if (in_array($dayy, range($d_initt[2], $d_finitt[2]))) {
//                $colorr = "rgb(0, 143, 255)";
//                $color_text = "#fff";
//                $show_dayy = $dayy;
//            } else {
//                $colorr = "";
//                $color_text = "#999";
//                $show_dayy = "";
//            }
            $mes_diaa = $mes_inicial;
            $mes_actual_et = $mes_diaa;
            $total_dias_del_mess = date("d", mktime(0, 0, 0, $mes_diaa + 1, 0, $ano_inicial));
            if ($dayy > $total_dias_del_mess) {
                $mes_dia_ahoraa = $mes_diaa + 1;
                $mes_actual_et = $mes_dia_ahoraa;
                $total_dias_del_mess = date("d", mktime(0, 0, 0, $mes_dia_ahoraa + 1, 0, $ano_inicial));
                $dayy = "";
                $dayyEncNextt += 1;
                $dayyEncVariable = $dayyEncNextt;
                if ($dayyEncNextt > $total_dias_del_mess) {
                    $mes_diaa += 1;
                    $mes_dia_ahoraa += 1;
                    //      $dayyEncNextt = 1;
                    $dayy = $dayyEncNextt - $total_dias_del_mess;
                    $dayyEncVariable = $dayy;
                    $mes_actual_et = $mes_dia_ahoraa;
                    //  $dayyEncVariable = $dayyEncNextt;
                }
            } else {
                $mes_dia_ahoraa = $mes_diaa;
                $total_dias_del_mess = date("d", mktime(0, 0, 0, $mes_dia_ahoraa + 1, 0, $ano_inicial));
                $dayyEncVariable = $dayy;
                $mes_actual_et = $mes_dia_ahoraa;
            }

            if ($d_initt[1] == $mes_dia_ahoraa && $d_finitt[1] == $mes_dia_ahoraa) {
                $data_one = $d_initt[2];
                $data_two = $d_finitt[2];
            } else
            if ($d_initt[1] < $d_finitt[1] & $d_finitt[1] >= $mes_dia_ahoraa) {
                if ($d_initt[1] == $mes_dia_ahoraa) {
                    $data_one = $d_initt[2];
                    $data_two = 31;
                } else
                if ($d_finitt[1] == $mes_dia_ahoraa) {
                    $data_one = 0;
                    $data_two = $d_finitt[2];
                }
            } else {
//                $data_one = 0;
//                $data_two = 0;
                $data_one = $d_initt[2];
                $data_two = $d_finitt[2];
            }
//            echo dias_transcurridos($r["fecha_inicial"], $r["fecha_final"]);
//            echo ":" . $dayyEncVariable . ":";
//            echo $data_one . "/";
//            echo $data_two . "----";
            if (in_array($dayyEncVariable, range($data_one, $data_two))) {
                $colorr = "rgb(0, 143, 255)";
                $color_text = "#fff";
                $show_dayy = $dayyEncVariable;
            } else {
                $colorr = "";
                $color_text = "#999";
                $show_dayy = "";
            }
            if ($tipo_calendario == "habiles") {
                $day_week_happy_et = date('N', strtotime($ano_inicial . '-' . $mes_actual_et . "-" . $dayyEncVariable));
                if ($day_week_happy_et == 6) {
                    $day_happy_et = "day_happy_et";
                } else
                if ($day_week_happy_et == 7) {
                    $day_happy_et = "day_happy_et";
                } else {
                    $day_happy_et = "";
                }
            } else {
                $day_happy_et = "";
            }
            echo $iiiii . "..." . $mes_dia_ahora_global . "//";
//            if ($dayyEncVariable >= $d_initt[2]) {
////                echo $d_initt[2];
//                $colorr = "rgb(0, 143, 255)";
//                $color_text = "#fff";
//                $show_dayy = $dayyEncVariable;
//            }
//            if ($dayyEncVariable == $d_finitt[2]) {
////                echo $d_finitt[2];
//                $colorr = "rgb(0, 143, 255)";
//                $color_text = "#fff";
//                $show_dayy = $dayyEncVariable;
//            }
            echo "<td class='$day_happy_et et' style='background: $colorr; color: $color_text;'> $show_dayy</td>";
            if ($iiiii == $total_dias_proyecto) {
                $dayy = 0;
                $dayyEncNextt = -1;
            } else {
                
            }
        }

        echo "</tr>";

        $whereb = " where etapa=:etapa";
        $sqlb = "select *,func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text FROM tareas_diarias 
            " . $whereb . " order by fecha asc";
        $cb->bindValue(":etapa", $r["id"]);
        $cb->prepare($sqlb);
        if (!$cb->exec()) {
            echo "no se pudo consultar la tarea";
            return;
        }
        for ($ii = 0; $ii < $cb->size(); $ii++) {
            $day = "";
            $dayEncNext = "";
            $cb->next();
            global $rb;
            $rb = $cb->assoc();
            $num = $ii + 1;
            //TAREA EN COLUMNA INICIAL
            ?>
            <script type="text/javascript">
                $(document).ready(function() {
                    var id = <?php echo $number_etap . $num; ?>;
                    //                        console.log(id);
                    $('.column_min' + id).click(function() {
                        $('.column_max' + id).fadeIn(100);
                        $('.column_min' + id).fadeOut(0);
                        $('.tr_tar_fil' + id).addClass("tr_tar_fil_click");
                    });
                    $('.column_max' + id).click(function() {
                        $('.column_max' + id).fadeOut(0);
                        $('.column_min' + id).fadeIn(100);
                        $('.tr_tar_fil' + id).removeClass("tr_tar_fil_click");
                    });
                });
            </script>
            <?php
            $id_div_fila = $number_etap . $num;
            echo "<tr class='tr_tar_fil" . $id_div_fila . "'>";
            echo "<td>
                   <div class='max_width_td column_min" . $id_div_fila . "'>
                     " . $number_etap . ".$num. " . $rb["tarea"] . "<br /> 
                     " . $rb["usuario_asignado_text"] . "
                   </div>
                   <div class='max_width_td column_max column_max" . $id_div_fila . "'>
                     " . $number_etap . ".$num. " . $rb["tarea"] . "<br /> 
                     " . $rb["usuario_asignado_text"] . "
                   </div>
                  </td>";

            //BLOQUE TAREA EN CALENDARIO
            $d_init = explode("-", $rb["fecha"]);
            $d_finit = explode("-", $rb["fecha_final"]);

            show_hoy_enc("", "");

            for ($iiii = 0; $iiii < $fdias + 1; $iiii++) {
                $id_all = $iiii . $rb["id"];
                $div_text = "<div class='bloque_tarea_span bloque_tarea_span" . $id_all . "'>
                              " . $rb["tarea"] . ".<br /> 
                              User: " . $rb["usuario_asignado_text"] . "
                             </div>";
                //  global $dia_inicial;
                $day = $iiii + $dia_inicial;
                $mes_dia = $mes_inicial;
                $mes_actual = $mes_dia;
                $total_dias_del_mes = date("d", mktime(0, 0, 0, $mes_dia + 1, 0, $ano_inicial));
                if ($day > $total_dias_del_mes) {
                    $mes_dia_ahora = $mes_dia + 1;
                    $mes_actual = $mes_dia_ahora;
                    $total_dias_del_mes = date("d", mktime(0, 0, 0, $mes_dia_ahora + 1, 0, $ano_inicial));
                    $day = "";
                    $dayEncNext += 1;
                    $dayEncVariable = $dayEncNext;
                    if ($dayEncNext > $total_dias_del_mes) {
                        $mes_dia += 1;
                        $mes_dia_ahora += 1;
                        $day = $dayEncNext - $total_dias_del_mes;
                        $dayEncVariable = $day;
                        $mes_actual = $mes_dia_ahora;
//                        $dayEncVariable = "day: " . $dayes . " " . $dayEncNext . " " . $iiii . " " . $total_dias_del_mes;
                    }
                } else {
                    $mes_dia_ahora = $mes_dia;
                    $mes_actual = $mes_dia_ahora;
                    //  $total_dias_del_mes = date("d", mktime(0, 0, 0, $mes_dia + 1, 0, $ano_inicial));
                    $dayEncVariable = $day;
                }

                if ($d_init[1] == $mes_dia_ahora & $d_finit[1] == $mes_dia_ahora) {
                    $data_one = $d_init[2];
                    $data_two = $d_finit[2];
                } else
                if ($d_init[1] < $d_finit[1] & $d_finit[1] >= $mes_dia_ahora) {
                    if ($d_init[1] == $mes_dia_ahora) {
                        $data_one = $d_init[2];
                        $data_two = 31;
                    } else
                    if ($d_finit[1] == $mes_dia_ahora) {
                        $data_one = 0;
                        $data_two = $d_finit[2];
                    }
                } else {
                    $data_one = 0;
                    $data_two = 0;
                }
                if ($tipo_calendario == "habiles") {
                    $day_week_happy = date('N', strtotime($ano_inicial . '-' . $mes_actual . "-" . $dayEncVariable));
                    if ($day_week_happy == 6) {
                        $day_happy = "day_happy";
                    } else
                    if ($day_week_happy == 7) {
                        $day_happy = "day_happy";
                    } else {
                        $day_happy = "";
                    }
                } else {
                    $day_happy = "";
                }

                if (in_array($dayEncVariable, range($data_one, $data_two))) {
                    if ($rb["estado"] == 3) {
                        $color = "green";
                        $color_texto = "#ffffff";
                        $show_day = $day;
                        $div_span_text = $div_text;
                    } else if ($rb["fecha_final"] < date("Y-m-d")) {
                        $color = "red";
                        $color_texto = "#000";
                        $show_day = $day;
                        $div_span_text = $div_text;
                    } else {
                        $color = "#e6e6e6";
                        $color_texto = "#000";
                        $show_day = $day;
                        $div_span_text = $div_text;
                    }
                } else {
                    $color = "";
                    $color_texto = "#ffffff";
                    $show_day = "";
                    $div_span_text = "";
                }
                ?>
                <script type="text/javascript">
                    $(document).ready(function() {
                        var id = <?php echo $iiii . $rb["id"]; ?>;
                        //                        console.log(id);
                        $('.bloque_tarea' + id).mouseenter(function() {
                            //    console.log("ingresa");
                            $('.bloque_tarea_span' + id).fadeIn(100);
                        });
                        $('.bloque_tarea' + id).mouseleave(function() {
                            //      console.log("sale");
                            $('.bloque_tarea_span' + id).fadeOut(100);
                        });
                        $('.bloque_tarea_span' + id).mouseover(function() {
                            //    console.log("ingresa span");
                            //   $(this).fadeOut(100);
                        });
                    });
                </script>
                <?php
                echo "<td class='bloque_tarea bloque_tarea" . $id_all . " $day_happy' style='background: $color; color: $color_texto;'>
                            $dayEncVariable 
                    $div_span_text </td>";
                if ($iiii == $total_dias_proyecto) {
                    $day = 0;
                    //    $iiii = 0;
                    $dayEncNext = 0;
                    $dayEncNext -= 1;
                    $dada = "dada";
                } else {
                    $dada = "";
                }
            }
            echo "</tr>";
        }
    }
}

function finalizadas($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $where = "";
    if ($_GET["tipo"] == "adicionales") {
        $where .= " and tipo='adicional'";
    } else
    if ($_GET["tipo"] == "tareas") {
        $where .= " and tipo<>'adicional'";
    }
    if ($p == "") {
        $where .= "and estado<>'3' and estado<>'13'";
    } else
    if ($p == 3 && $_GET["tipo"] == "adicionales") {
        $where .= "and estado='3' or proyecto=:proyecto and etapa IS NULL and estado='13'";
    } else
    if ($p == 2) {
        $where .= " and estado<>3 and estado<>13  and estado<>8  and estado<>10  and estado<>1  ";
    } else
    if ($p != "") {
        $where .= "and estado=:estado";
    }
    $ca->prepareSelect("tareas_diarias", "id", "proyecto=:proyecto and etapa IS NULL $where ");
    $ca->bindValue(":proyecto", $id);
    $ca->bindValue(":estado", $p);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    return $ca->size();
}

function porcentTotal() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $where = "";
    if ($_GET["tipo"] == "adicionales") {
        $where .= " and tipo='adicional'";
    } else
    if ($_GET["tipo"] == "tareas") {
        $where .= " and tipo<>'adicional'";
    }
    $ca->prepareSelect("tareas_diarias", "id", "proyecto=:proyecto and etapa IS NULL $where");
    $ca->bindValue(":proyecto", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        return;
    }
    global $tareasEnProceso;
    global $tareasFinalizadas;
    global $tareasPendientes;
    $total = $ca->size();
    $pendientes = finalizadas(1);
    $finalizadas = finalizadas(3);
    $tareasEnProceso = finalizadas(2);
    if ($pendientes != 0) {
        $tareasPendientes = $pendientes;
    } else {
        $tareasPendientes = "0";
    }
    if ($finalizadas != 0) {
        $tareasFinalizadas = $finalizadas;
    } else {
        $tareasFinalizadas = "0";
    }

    $diferencia = $pendientes / $total;
    $competitividad = $diferencia * 100;
//    $competivo = 100 - $competitividad;
    $competivo = $competitividad;
    $numberCompetitivity = number_format($competivo, 0);
    $bottom = 100 - $numberCompetitivity;
    echo "<h3 class='titlePorcent'>Porcentaje de desarrollo: " . $bottom . "%</h3>";
    ?>
    <div class="porcentTotal"><div class="porcentCrece"></div></div>
    <script>
        $(document).ready(function() {
            width = <?php echo $bottom; ?>;
            $(".porcentCrece").animate({width: width + '%'}, 5100);
            setTimeout(function() {
                if (width == 100) {
                    $("body").append("<div class='divAllPorcent'><h3>En hora buena! Se han completado al 100% todas las tareas, felicitaciones!</div>");
                    $(".divAllPorcent").fadeIn("slow");
                    $(".divAllPorcent h3").animate({top: "40%"}, 3000);
                    setTimeout(function() {
                        $(".divAllPorcent h3").animate({top: "-40%"}, 2000);
                        $(".divAllPorcent").fadeOut("fast");
                    }, 4500);
                }
                $(".titlePorcent").animate({opacity: 1}, 2000);
            }, 5000);
        });
    </script>
    <?php
}

function avances($p, $color) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("tareas_det", "*", "tarea=:tarea and tipo<>'Creación' order by fecha asc");
    $ca->bindValue(":tarea", $p);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        return;
    }
    echo " <tr>
                        <th width='100px'>
                            Usuario
                        </th>
                        <th width='100px'>
                            Fecha
                        </th>
                        <th>
                            Estado
                        </th>
                        <th>
                            Observación
                        </th>
                    </tr>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        $num = $i + 1;
        if ($num == $ca->size()) {
            $tdLast = "class='trLast'";
        } else {
            $tdLast = "class='trNormalB'";
        }
        echo " <tr style='color: $color;' $tdLast >
                        <td>
                            " . $r["usuario"] . "
                        </td>
                        <td>
                            " . $r["fecha"] . "
                        </td>
                        <td>
                            " . $r["tipo"] . "
                        </td>
                        <td>
                            " . $r["observaciones"] . "
                        </td>
                    </tr>";
    }
}

function others($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $where = "";
    if ($p != "") {
        $where .= " and tipo=:tipo";
    } else {
        $where .= " and tipo<>'adicional'";
    }
    if (isset($_GET["estado"])) {
        if ($_GET["estado"] == "pendientes") {
            $where .= " and estado='1'";
        } else
        if ($_GET["estado"] == "finalizadas") {
            $where .= " and estado='3' or proyecto=:proyecto and etapa IS NULL and estado='13'";
        } else
        if ($_GET["estado"] == "process") {
            $where .= " and estado<>'3' and estado<>'1' and estado<>'13'";
        }
    }
    $ca->prepareSelect("tareas_diarias", "*,
                                         func_concepto(estado, 'estados_tareas_diarias') as estado_text,
                                         func_concepto(estado, 'estados_tareas_diarias', 'color') as color,
                                         func_concepto(usuario_asignado, 'usuarios', 'nombre') as usuario_asignado_text
                                          ", "proyecto=:proyecto and etapa IS NULL $where order by fecha desc");
    $ca->bindValue(":proyecto", $id);
    $ca->bindValue(":tipo", $p);
    $ca->bindValue(":etapa", "");
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    $titulo = "";
    if ($_GET["tipo"] == "tareas") {
        $titulo = "Ajustes fuera de cronograma";
    } else
    if ($_GET["tipo"] == "adicionales") {
        $titulo = "Tareas Adicionales";
    }
    if ($ca->size() == 0) {
        echo "<tr class='titleTables'><td colspan='11'><h3>$titulo  Total registros: " . $ca->size() . " No se han encontrado registros.</h3></td></tr>";
        return;
    }
    echo "<tr class='titleTables'><td colspan='11'><h3>$titulo  Total registros: " . $ca->size() . " </h3></td></tr>";
    echo "<tr>
                <th>
                    ID
                </th>
                <th>
                    Fecha de Asignación
                </th>
                <th>
                    Fecha de Entrega
                </th>
                <th>
                    Creado por
                </th>
                <th>
                    Responsable
                </th>
                <th>
                    Estado
                </th>
                <th>
                    Tarea
                </th>
                <th>
                    Avances
                </th>
                <th>
                    Tiempo Dedicado
                </th>
                <th>
                    Fecha Finalizado
                </th>
                <th>
                    
                </th>
            </tr>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["observaciones"] == "") {
            $tarea = $r["tarea"];
        } else {
            $tarea = $r["observaciones"];
        }
        echo "
        <tr style='color:  " . $r["color"] . ";'>
            <td>
                " . $r["id"] . "
            </td>
            <td>
                " . $r["fecha"] . "
            </td>
            <td>
                " . $r["fecha_final"] . "
            </td>
            <td>
                " . $r["usuario"] . "
            </td>
            <td>
                " . $r["usuario_asignado_text"] . "
            </td>
            <td>
                 " . $r["estado_text"] . "
            </td>
            <td>
                 " . strip_tags($tarea) . "
            </td>
            <td class='no_padding'>
            <table class='tableAvances'>";
        avances($r["id"], $r["color"]);
        echo "</table>
                </td>
            <td>
                 " . $r["tiempo"] . "
            </td>
            <td>
                 " . $r["fecha_cierre"] . "
            </td>
            <td>
                 <div class='completedTask' name='" . $r["id"] . "'>
                 Finalizar
                 </div>
                 <div class='commentTask' name='" . $r["id"] . "'>
                 Comentar
                 </div>
            </td>
        </tr>
        ";
    }
}

function othersAnd($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $where = "";
    if ($p != "") {
        $where .= " and tipo=:tipo";
    } else {
//        $where .= " and tipo<>'adicional'";
    }
    $ca->prepareSelect("tareas_diarias", "*,
                                         func_concepto(estado, 'estados_tareas_diarias') as estado_text,
                                         func_concepto(estado, 'estados_tareas_diarias', 'color') as color,
                                         func_concepto(usuario_asignado, 'usuarios', 'nombre') as usuario_asignado_text
                                          ", "proyecto=:proyecto and etapa IS NULL $where order by fecha asc");
    $ca->bindValue(":proyecto", $id);
    $ca->bindValue(":tipo", $p);
    $ca->bindValue(":etapa", "");
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "<tr><td colspan='10'><h3>Total registros: " . $ca->size() . " No se han encontrado registros.</h3></td></tr>";
        return;
    }
    echo "<tr><td colspan='10'><h3>Total registros: " . $ca->size() . " </h3></td></tr>";
    echo "<tr>
                <td>
                    ID
                </td>
                <td>
                    Fecha Creación
                </td>
                <td>
                    Fecha Asignación
                </td>
                <td>
                    Creado por
                </td>
                <td>
                    Usuario Asignado
                </td>
                <td>
                    Estado
                </td>
                <td>
                    Tarea
                </td>
                <td>
                    Observaciones
                </td>
                <td>
                    Resultado Final
                </td>
                <td>
                    Avances
                </td>
                <td>
                    Fecha Finalizado
                </td>
            </tr>";
    $oldvalue = "";
    $arrayVal = Array();
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($i == 0) {
            $arrayVal[$i] = "
        <tr style='background:  " . $r["color"] . "; color: #fff;'>
            <td>
                " . $r["id"] . "
            </td>
            <td>
                " . $r["fecha"] . "
            </td>
            <td>
                " . $r["fecha_final"] . "
            </td>
            <td>
                " . $r["usuario"] . "
            </td>
            <td>
                " . $r["usuario_asignado_text"] . "
            </td>
            <td>
                 " . $r["estado_text"] . "
            </td>
            <td>
                 " . strip_tags($r["tarea"]) . "
            </td>
            <td>
                 " . strip_tags($r["observaciones"]) . "
            </td>
            <td>
                 " . strip_tags($r["respuesta"]) . "
            </td>
            <td>
                <table>" . avances($r["id"]) . "</table>
            </td>
            <td>
                 " . $r["fecha_cierre"] . "
            </td>
        </tr>
        ";
        } else {
            if ($oldvalue == $r["observaciones"]) {
                $anterior = $i - 1;
                $arrayVal[$anterior] .= "
            <td>
                " . $r["fecha"] . "
            </td>
            <td>
                " . $r["fecha_final"] . "
            </td>
            <td>
                " . $r["usuario"] . "
            </td>
            <td>
                " . $r["usuario_asignado_text"] . "
            </td>
            <td>
                 " . $r["estado_text"] . "
            </td>
            <td>
                 " . strip_tags($r["tarea"]) . "
            </td>
            <td>
                 " . strip_tags($r["observaciones"]) . "
            </td>
            <td>
                 " . strip_tags($r["respuesta"]) . "
            </td>
            <td>
                <table>" .
                        avances($r["id"]) .
                        "          
                </table>
            </td>
            <td>
                 " . $r["fecha_cierre"] . "
            </td>
        ";
            } else {
                $arrayVal[$i] = "
        <tr style='background:  " . $r["color"] . "; color: #fff;'>
            <td>
                " . $r["fecha"] . "
            </td>
            <td>
                " . $r["fecha_final"] . "
            </td>
            <td>
                " . $r["usuario"] . "
            </td>
            <td>
                " . $r["usuario_asignado_text"] . "
            </td>
            <td>
                 " . $r["estado_text"] . "
            </td>
            <td>
                 " . strip_tags($r["tarea"]) . "
            </td>
            <td>
                 " . strip_tags($r["observaciones"]) . "
            </td>
            <td>
                 " . strip_tags($r["respuesta"]) . "
            </td>
             <td>
                <table>" .
                        avances($r["id"]) .
                        "          
                </table>
            </td>
            <td>
                 " . $r["fecha_cierre"] . "
            </td>
        </tr>
        ";
            }
        }
        $oldvalue = $r["observaciones"];
    }
    $datas = $arrayVal;
    for ($ii = 0; $ii < count($datas); $ii++) {
        echo "<tr>";
        echo $datas[$ii];
        echo "</tr>";
    }
}
?>

<div id="contenedor" name="<?php echo $id; ?>" class="<?php echo $_GET["tipo"]; ?>">
    <div id="encAll">
        <div id="enc">
            <h1>
                <?php
                projectplan_enc();
                ?>
            </h1>
            <div class="buttonsEnc">
                <a href="<?php echo $_GET["id"]; ?>&tipo=adicionales" <?php
                if (isset($_GET["tipo"]) && $_GET["tipo"] == "adicionales") {
                    echo "class='activeButton'";
                }
                ?>>
                    Tareas Adicionales 
                </a>
            </div>
            <div class="buttonsEnc">
                <a href="<?php echo $_GET["id"]; ?>&tipo=tareas" <?php
                if (isset($_GET["tipo"]) && $_GET["tipo"] == "tareas") {
                    echo "class='activeButton'";
                }
                ?> >
                    Ajustes Fuera de Cronograma
                </a>
            </div>
            <div class="buttonsEnc">
                <a href="<?php echo $_GET["id"]; ?>" <?php
                if (!isset($_GET["tipo"])) {
                    echo "class='activeButton'";
                }
                ?> >
                    Cronograma
                </a>
            </div>
            <div class="buttonsEnc">
                <a href="<?php echo $_GET["id"]; ?>&tipo=stadistics" <?php
                if (isset($_GET["tipo"]) && $_GET["tipo"] == "stadistics") {
                    echo "class='activeButton'";
                }
                ?> >
                    Estadísticas
                </a>
            </div>
        </div>
        <?php
        if (isset($_GET["tipo"])) {
            if ($_GET["tipo"] != "stadistics") {
                global $tareasFinalizadas;
                global $tareasPendientes;
                global $tareasEnProceso;
                ?>
                <div class="porcent">
                    <?php
                    porcentTotal();
                    ?>
                </div>
                <div class="filtros" id="filtros">
                    <div class="divsFiltrosInter">
                        <div class="newTask">
                            + Nueva Tarea
                        </div>
                        <a href="<?php echo $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>" <?php
                        if (!isset($_GET["estado"])) {
                            echo " class='a_selected'";
                        }
                        ?> >
                            Todas las Tareas
                        </a>
                        <a href="<?php echo $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>&estado=pendientes" <?php
                        if (isset($_GET["estado"])) {
                            if ($_GET["estado"] == "pendientes") {
                                echo " class='a_selected'";
                            }
                        }
                        ?> >
                            Pendientes <span><?php echo $tareasPendientes; ?></span>
                        </a>
                        <a href="<?php echo $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>&estado=process" <?php
                        if (isset($_GET["estado"])) {
                            if ($_GET["estado"] == "process") {
                                echo " class='a_selected'";
                            }
                        }
                        ?> >
                            En proceso <span><?php echo $tareasEnProceso; ?></span>
                        </a>
                        <a href="<?php echo $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>&estado=finalizadas" <?php
                        if (isset($_GET["estado"])) {
                            if ($_GET["estado"] == "finalizadas") {
                                echo " class='a_selected'";
                            }
                        }
                        ?> >
                            Finalizadas <span><?php echo $tareasFinalizadas; ?></span>
                        </a>
                        <!--                        Ordenar por
                                                <select>
                                                    <option value="fecha">Fecha</option>
                                                    <option value="nombre">Nombre</option>
                                                </select>
                                                <select>
                                                    <option value="asc">Descendente</option>
                                                    <option value="desc">Ascendente</option>
                                                </select>-->
                    </div>
                </div>
                <?php
            }
        }
        ?>
    </div>
    <div class="contenedor_crono">
        <div class="contenedor_cronoFixed">
            <?php
            if (!isset($_GET["tipo"])) {
                ?>
                <table>
                    <?php
                    projectplan_etapas();
                    ?>
                </table>
                <?php
            }
            ?>
            <?php
            if (isset($_GET["tipo"])) {
                if ($_GET["tipo"] == "tareas") {
                    ?>
                    <table class="tareas">
                        <?php
                        others("");
                        ?>
                    </table>
                    <?php
                } else
                if ($_GET["tipo"] == "adicionales") {
                    ?>
                    <table class="adicionales">

                        <?php
                        others("adicional");
                        ?>
                    </table>
                    <?php
                } else
                if ($_GET["tipo"] == "stadistics") {
                    ?>
                    <div class="stadistics">
                        <?php
                        include "src/stadistics.php";
                        ?>
                    </div>
                    <?php
                }
            }
            ?>
        </div>
    </div>
</div>