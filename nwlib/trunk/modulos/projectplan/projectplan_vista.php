<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$vn = master::getNwlibVersion();
?>
<style type="text/css">
    body{
        position: relative;
        margin: 0;
        padding: 0;
        font-family: Arial;
        font-size: 18px;
        color: #555;
    }

</style>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<link rel="stylesheet" type="text/css" href="/nwlib<?php echo $vn; ?>/modulos/projectplan/css/css.css" />

<script type="text/javascript" src="/nwlib<?php echo $vn; ?>/includes/jquery/jquery-1.4.2.min.js" ></script>

<script type="text/javascript" src="/nwlib<?php echo $vn; ?>/includes/jquery/jquery.validate.1.5.2.js" ></script>
<script type="text/javascript" src="/nwlib<?php echo $vn; ?>/includes/jquery/jquery-ui-1.8.1.custom.min.js"></script> 

  <!--  <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/jquery.min.js" type="text/javascript"></script>-->

<?php
if (isset($_GET["tipo"])) {
    ?>
        <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/tinysort.js"></script>
        <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/jquery.tinysort.js"></script>
        <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/tinysort.charorder.js"></script>
        <script>
        $(document).ready(function () {
             if ($(this).hasClass('.sortat')){
            $(".sortat").tsort({attr: "id", order: 'asc'});
             }
        });
        </script>
    <?php
}
?>


<link type="text/css" href="/nwlib<?php echo $vn; ?>/includes/jquery/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
<script type="text/javascript" src="/nwlib<?php echo $vn; ?>/includes/jquery/dialogextend/jquery.dialogextend.min.js" ></script>

<script type="text/javascript" src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/main.js" ></script>
<?php
global $id;
if (isset($_POST["id"])) {
    $id = $_POST["id"];
} else {
    $id = $_GET["id"];
}
?>
<title>Proyecto <?php echo $id; ?></title>
<?php

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
    $sum_happys = 0;
    $dayHappyNext = 0;
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
    echo $r["nombre"] . "<br> " . $gran_total_dias_proyecto . " días " . $r["tipo"] . "<br> Inicio:" . $r["fecha_inicial"] . "<br> Final:" . $r["fecha_final"];
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
                if ($mes_dia == 12) {
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
                    $day_week_two = date('N', strtotime($year . '-' . $mes_dia_ahora . "-" . $dayEncNext));
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
        $(document).ready(function () {
            width = <?php echo $bottom; ?>;
            $(".porcentCrece").animate({width: width + '%'}, 5100);
            setTimeout(function () {
                if (width == 100) {
                    $("body").append("<div class='divAllPorcent'><h3>En hora buena! Se han completado al 100% todas las tareas, felicitaciones!</div>");
                    $(".divAllPorcent").fadeIn("slow");
                    $(".divAllPorcent h3").animate({top: "40%"}, 3000);
                    setTimeout(function () {
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

function adjuntos($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwtask_adjuntos", "nombre, fecha, usuario", "id_relation=:tarea order by fecha desc");
    $ca->bindValue(":tarea", $p);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        return;
    }
    echo " <table>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        echo " <tr>
                        <td>
                        " . $r["fecha"] . "<br />
                        " . $r["usuario"] . "<br />
                       <a href='" . $r["nombre"] . "' target='_blank' class='buttonGreen'>Adjunto</a>
                        </td>
                    </tr>";
    }
    echo "</table>";
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
                                         func_concepto(usuario_asignado, 'usuarios', 'nombre') as usuario_asignado_text,
                                         fecha::date as fecha_sola
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
        echo "<tr class='titleTables'><td colspan='12'><h3>$titulo  Total registros: " . $ca->size() . " No se han encontrado registros.</h3></td></tr>";
        return;
    }
    echo "<tr class='titleTables'><td colspan='12'><h3>$titulo  Total registros: " . $ca->size() . " </h3></td></tr>";
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
                    Adjuntos
                </th>
                <th>
                    
                </th>
            </tr>";
    $fecha_enc = "";
    $num_task_dia = "";
    $br = "";
    $fecha_es = "";
    ?>
    <!--      <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/jquery.min.js" type="text/javascript"></script>
        <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/tinysort.js"></script>
        <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/jquery.tinysort.js"></script>
        <script src="/nwlib<?php echo $vn; ?>/modulos/projectplan/js/sortable/js/tinysort.charorder.js"></script>
        <script>
        $(document).ready(function() {
            $(".sortat").tsort({attr: "id", order: 'asc'});
        });
        </script>-->
    <?php
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["observaciones"] == "") {
            $tarea = $r["tarea"];
        } else {
            $tarea = $r["observaciones"];
        }
        if ($fecha_enc != $r["fecha_sola"]) {
            if ($fecha_enc != "") {
                ?>
                <script>
                    $(document).ready(function () {
                        $(".contenedor_cronoFixed").scroll(function () {
                            var pos_scroll = $(this).scrollTop();
                            var pos = $(".<?php echo strtotime($fecha_enc); ?>").position();
                            if (pos_scroll > pos.top) {
                                $(".tr_fecha_enc").removeClass("se_paso");
                                $(".<?php echo strtotime($fecha_enc); ?>").removeClass("normal_altura");
                                $(".<?php echo strtotime($fecha_enc); ?>").addClass("se_paso");
                            } else {
                                $(".<?php echo strtotime($fecha_enc); ?>").addClass("normal_altura");
                            }
                        });
                    });
                </script>
                <?php
                $idd = ($i - $num_task_dia) - 1;
                if ($fecha_enc == date("Y-m-d")) {
                    $fecha_es = "<b style='color: red;'>Hoy!</b> " . date("D", strtotime($fecha_enc)) . ", " . date("d", strtotime($fecha_enc)) . " de " . date("M", strtotime($fecha_enc)) . " del " . date("Y", strtotime($fecha_enc));
                } else {
                    $fecha_es = date("D", strtotime($fecha_enc)) . ", " . date("d", strtotime($fecha_enc)) . " de " . date("M", strtotime($fecha_enc)) . " del " . date("Y", strtotime($fecha_enc));
                }
                $br = "<tr id='$idd' class='tr_fecha_enc sortat " . strtotime($fecha_enc) . "'><td colspan='12'><h2> $fecha_es Total tareas: $num_task_dia </h2></td></tr>";
                echo $br;
            }
        }
        if ($fecha_enc == $r["fecha_sola"]) {
            $num_task_dia += 1;
        } else {
            $num_task_dia = 1;
        }
        $fecha_enc = $r["fecha_sola"];
        echo "
        <tr id='$i' class='sortat '  style='color:  " . $r["color"] . ";'>
            <td id='" . $r["id"] . "'>
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
            <td>";
        adjuntos($r["id"]);
        echo " </td>
            <td>
                 <div class='commentTask' name='" . $r["id"] . "'>
                 Comentar
                 </div>
            </td>
        </tr>
        ";
    }
//       <div class='completedTask' name='" . $r["id"] . "'>
//                 Finalizar
//                 </div>
}

function usuarios() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $ca->prepareSelect("projectplan_responsables a left join usuarios b ON(a.user_responsable=b.id)", "distinct a.user_responsable,b.nombre", "a.id_enc=:id");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() > 0) {
        for ($i = 0; $i < $ca->size(); $i++) {
            $r = $ca->flush();
            $sel = "";
            if (isset($_GET["usuario_asignado"])) {
                if ($_GET["usuario_asignado"] == $r["user_responsable"]) {
                    $sel = " selected='selected'";
                }
            }
            echo "<option {$sel} value='{$r["user_responsable"]}'>{$r["nombre"]}</option>";
        }
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

$tipoForm = "";
if (isset($_GET["tipo"])) {
    $tipoForm = $_GET["tipo"];
}
$url_actual = $_SERVER['REQUEST_SCHEME'] . "://" . $_SERVER["SERVER_NAME"] . $_SERVER["PHP_SELF"];
//echo $url_actual;
?>

<div id="contenedor" name="<?php echo $id; ?>" class="<?php echo $tipoForm; ?>">
    <div id="encAll">
        <div id="enc">
            <h1>
                <?php
                projectplan_enc();
                ?>
            </h1>
            <div class="buttonsEnc">
                <a href="<?php echo $url_actual . "?id=" . $_GET["id"]; ?>&tipo=adicionales" <?php
                if (isset($_GET["tipo"]) && $_GET["tipo"] == "adicionales") {
                    echo "class='activeButton'";
                }
                ?>>
                    Tareas Adicionales 
                </a>
            </div>
            <div class="buttonsEnc">
                <a href="<?php echo $url_actual . "?id=" . $_GET["id"]; ?>&tipo=tareas" <?php
                if (isset($_GET["tipo"]) && $_GET["tipo"] == "tareas") {
                    echo "class='activeButton'";
                }
                ?> >
                    Ajustes Fuera de Cronograma
                </a>
            </div>
            <div class="buttonsEnc">
                <a href="<?php echo $url_actual . "?id=" . $_GET["id"]; ?>" <?php
                if (!isset($_GET["tipo"])) {
                    echo "class='activeButton'";
                }
                ?> >
                    Cronograma
                </a>
            </div>
            <div class="buttonsEnc">
                <a href="<?php echo $url_actual . "?id=" . $_GET["id"]; ?>&tipo=stadistics" <?php
                if (isset($_GET["tipo"]) && $_GET["tipo"] == "stadistics") {
                    echo "class='activeButton'";
                }
                ?> >
                    Estadísticas
                </a>
            </div>
            <!--            <div class="buttonsEnc">
                            <a>
                                Descargar Imagen
                            </a>
                        </div>-->
            <script language="javascript">
                $(document).ready(function () {
                    $(".botonExcel").click(function (event) {
                        $("#datos_a_enviar").val($("<div>").append($("#Exportar_a_Excel").eq(0).clone()).html());
                        $("#FormularioExportacion").submit();
                    });
                    $(".usuarios").change(function (event) {
                        var val = $(this).val();
                        if (val === "") {
                            return false;
                        }
                        if (val === "todos") {
                            window.location = "<?php echo $url_actual . "?id=" . $id; ?>";
                            return false;
                        }
                        window.location = "<?php echo $url_actual . "?id=" . $id; ?>&usuario_asignado=" + val;
                    });
                });
            </script>
            <form action="/nwlib6/modulos/projectplan/ficheroExcel.php" method="post" target="_blank" id="FormularioExportacion" style="display: none">
                <input type="hidden" id="datos_a_enviar" name="datos_a_enviar" />
            </form>
            <div class="buttonsEnc">
                <a class="botonExcel">
                    Descargar excel
                </a>
            </div>
            <div class="buttonsEnc">
                <select class="usuarios">
                    <option value="">Seleccione el usuario</option>
                    <option value="todos">Todos</option>
                    <?php
                    usuarios();
                    ?>
                </select>
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
                        <a href="<?php echo $url_actual . "?id=" . $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>" <?php
                        if (!isset($_GET["estado"])) {
                            echo " class='a_selected'";
                        }
                        ?> >
                            Todas las Tareas
                        </a>
                        <a href="<?php echo $url_actual . "?id=" . $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>&estado=pendientes" <?php
                        if (isset($_GET["estado"])) {
                            if ($_GET["estado"] == "pendientes") {
                                echo " class='a_selected'";
                            }
                        }
                        ?> >
                            Pendientes <span><?php echo $tareasPendientes; ?></span>
                        </a>
                        <a href="<?php echo $url_actual . "?id=" . $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>&estado=process" <?php
                        if (isset($_GET["estado"])) {
                            if ($_GET["estado"] == "process") {
                                echo " class='a_selected'";
                            }
                        }
                        ?> >
                            En proceso <span><?php echo $tareasEnProceso; ?></span>
                        </a>
                        <a href="<?php echo $url_actual . "?id=" . $_GET["id"] . "&tipo=" . $_GET["tipo"]; ?>&estado=finalizadas" <?php
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
                include 'dos.php';
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