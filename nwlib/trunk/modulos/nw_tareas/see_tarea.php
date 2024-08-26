<div class="bx_all_see">
    <script>
        $(".closeWindow").click(function() {
            $("#see").empty();
            $("#see").fadeOut();
        });
    </script>
    <div class='closeWindow'>X</div>
    <style type="text/css">
        html,body {
            overflow: hidden!important;
            overflow-x: hidden!important;
            overflow-y: hidden!important;
        }
        @media screen and (max-width: 1000px) {
            .table_buttons_header{
                display: none!important;
            }
            .table_buttons_foot_movil{
                display: block;
            }
        }
    </style>
    <?php
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
    $motor_bd = "";
    if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
        require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
        $ruta_enlaces = "";
        $motor_bd = "PSQL";
    } else {
//MYSQL NWPROJECT
        $ruta_enlaces = "/nwproject/php/modulos/";
        $motor_bd = "MYSQL";
        require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
        if (!function_exists("GetSQLValueString")) {

            function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
                $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
                $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);
                switch ($theType) {
                    case "text":
                        $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                        break;
                    case "long":
                    case "int":
                        $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                        break;
                    case "double":
                        $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                        break;
                    case "date":
                        $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                        break;
                    case "defined":
                        $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                        break;
                }
                return $theValue;
            }

        }
    }
    echo "<div class='box_see_contgened'>";
    $post_vista_users = $_POST["a"];
    $date_mes_ano_post = $_POST["b"];
    $date_hoy_numbers = $_POST["c"];
    $ei = $_POST["d"];

//echo $post_vista_users . " - " . $date_mes_ano_post . " - " . $date_hoy_numbers . " - " . $ei;
    function consultaAvancesHijo($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("tareas_det", "*", "tarea=:tarea");
        $ca->bindValue(":tarea", $p);
        if (!$ca->exec()) {
            echo "no se pudo consultar";
            return;
        }
        if ($ca->size() == 0) {
            echo "<br />Sin avances";
            return;
        }
        echo "<div>";
        $total = $ca->size();
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $prd = $ca->assoc();
            echo "<span>" . $prd["observaciones"] . ", </span>";
        }
        echo "</div>";
        return;
    }

    function otros_users($p, $user) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 and tarea=:tarea and usuario_asignado<>:usuario_id";
        $sql = "select func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text from tareas_diarias " . $where;
        $ca->prepare($sql);
        $ca->bindValue(":usuario_id", $user);
        $ca->bindValue(":tarea", $p);
        if (!$ca->exec()) {
            echo "no se pudo consultar";
            return;
        }
        if ($ca->size() == 0) {
            return;
        }
        echo "<p>También enviado a: ";
        $total = $ca->size();
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $prd = $ca->assoc();
            echo "<span>" . $prd["usuario_asignado_text"] . ", </span>";
        }
        echo "<p>";
        return;
    }

    $id = $_POST["id"];
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $cg = new NWDbQuery($db);
    $where = " where 1=1 ";
    if (isset($_POST["id"])) {
        $where .= " and id=:id";
    }
    $sql = "select *,
        func_concepto(estado, 'estados_tareas_diarias') as estado_text,
        func_concepto(estado, 'estados_tareas_diarias', 'color') as color,
        func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text,
        func_concepto(proyecto, 'projectplan_enc') as proyecto_text
        FROM tareas_diarias " . $where;
    $ca->prepare($sql);
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($ca->size() == 0) {
        echo "No se han encontrado datos";
        return;
    }
    $ca->next();
    $ra = $ca->assoc();
    if (isset($_POST["tmov"])) {
        if ($_POST["tmov"] != "undefined") {
//            $sqlU = "UPDATE tareas_diarias_movs SET leido='SI' WHERE id=:id";
            $cg = new NWDbQuery($db);
            $cg->prepareUpdate("tareas_diarias_movs", "leido", "id=:id");
            $cg->bindValue(":id", $_POST["tmov"]);
            $cg->bindValue(":leido", "SI");
            if (!$cg->exec()) {
                echo "Hubo un error, inténtelo nuevamente. Lo sentimos!";
                return;
            }
        }
    }


    $fechaHoy1 = strtotime(date("Y-m-d"));
    $fecha_entrega1 = strtotime($ra["fecha_final"]);
    $fecha_restas = $fecha_entrega1 - $fechaHoy1;
    $fecha_entrega_dias = round($fecha_restas / 3600);

    $total_dias_mes = date('t');
    $sobran_dias = 100 - $total_dias_mes;
    $fechaHoy = date("Ymd");
    $fecha_entrega_repacle = str_replace("-", "", $ra["fecha_final"]);
    $fecha_entrega = $fecha_entrega_repacle;
    $fdias = $fecha_entrega - $fechaHoy;
    if ($fdias > $total_dias_mes & $fdias <= 130) {
        $fdias = $fdias - $sobran_dias;
    } else
    if ($fdias > 130 & $fdias <= 230) {
        $fdias = $fdias - ($sobran_dias * 2);
    }

    $display = "block";
    $display_ = "";
    $color = $ra["color"];
    if ($ra["estado"] == 3 || $ra["estado"] == 13) {
        $display = "none";
        $display_ = "none";
    }
    ?>
    <script type="text/javascript">
        $(".button_list2").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 2, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list3").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 3, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list7").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 7, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list4").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 4, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list8").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 12, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list5").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 5, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list50").click(function() {
            FromUpdate(<?php echo $ra["id"] ?>, 50, 0,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
        $(".button_list1_editar").click(function() {
            parent.nwadmin3.main.slotEditarTarea('<?php echo $ra["id"] ?>');
        });
//INTERVALO, UN SEGUNDO EQUIVALE A 1000 MILISEGUNDOS, Un minuto equivale a 60.000 milisegundos, 3600000 MILISEGUNDOS SON 10 MINUTOS
        intervalo = 3600000;
        function intervalSave() {
            var id = <?php echo $ra["id"] ?>;
            var segundos = $("#segundos<?php echo $ra["id"]; ?>").text();
            var minutos = $("#minutos<?php echo $ra["id"]; ?>").text();
            var horas = $("#horas<?php echo $ra["id"]; ?>").text();
            var tiempoTotal = horas + ":" + minutos + ":" + segundos;
            saveTimeInterval(id, tiempoTotal);
            saveTime = setTimeout("intervalSave()", intervalo);
        }
        $(".button_play").click(function(event) {
            var id = <?php echo $ra["id"]; ?>;
            var segundos = $("#segundos<?php echo $ra["id"]; ?>").text();
            var minutos = $("#minutos<?php echo $ra["id"]; ?>").text();
            var horas = $("#horas<?php echo $ra["id"]; ?>").text();
            var tiempoTotal = horas + ":" + minutos + ":" + segundos;
            event.preventDefault();
            ConteoAscendente(horas, minutos, segundos, id);
            insertTaskConteo(id, tiempoTotal);
            saveTime = setTimeout("intervalSave()", intervalo);
            $(".button_play").fadeOut(0);
            $(".ui-button").fadeOut(0);
            $(".ui-dialog-titlebar-close").fadeOut(0);
            $(".button_pausa").fadeIn(0);
            $(".bg_black_inhability").fadeIn("200");

//            document.onkeydown = tecla;
        });
        $(".button_pausa").click(function() {
            var id = <?php echo $ra["id"] ?>;
            var segundos = $("#segundos<?php echo $ra["id"]; ?>").text();
            var minutos = $("#minutos<?php echo $ra["id"]; ?>").text();
            var horas = $("#horas<?php echo $ra["id"]; ?>").text();
            var tiempoTotal = horas + ":" + minutos + ":" + segundos;
            pausarConteo(id, tiempoTotal);
            clearTimeout(saveTime);
            $(".button_play").html("continuar");
            $(".button_play").fadeIn(0);
            $(".ui-button").fadeIn(0);
            $(".ui-dialog-titlebar-close").fadeIn(0);
            $(".button_pausa").fadeOut(0);
            $(".bg_black_inhability").fadeOut("200");
        });
        function appear() {
            setTimeout(function() {
                $(".ui-dialog-titlebar-close").fadeIn(0);
            }, 1000);
        }
        appear();
    </script>
    <?php
    $button_devolver = "<td style='display: $display_;'><p class='button_list button_list8'></p></td><td style='display: $display_;'><p class='button_list button_list4'></p></td>";
    $button_devolverSpan = "<td style='display: $display_;'><span>Finalizar<br />y Devolver</span></td> <td style='display: $display_;'><span>Devolver</span></td>";
    if ($ra["usuario_asignado"] == $_SESSION["id"]) {
        if ($ra["usuario"] == $_SESSION["usuario"]) {
            $button_devolver = "";
            $button_devolverSpan = "";
        }
        if ($ra["leido"] == null || $ra["leido"] == "NO" || $ra["leido"] == "") {
            $sqll = "UPDATE tareas_diarias SET leido='SI' WHERE id=:id";
            $cb->bindValue(":id", $id);
            $cb->prepare($sqll);
            if (!$cb->exec()) {
                echo "Hubo un error, inténtelo nuevamente. Lo sentimos!";
                return;
            }
        }
    }
    echo "<div class='controlsEncTask'>";
    echo "               <table class='table_buttons_header' style='display: $display;'>
                         <tr>
                          <td><p class='button_list button_list1_editar' ></p></td>
                          <td><p class='button_list button_list2' ></p></td>
                          <td><p class='button_list button_list3' ></p></td>
                          $button_devolver
                          <td><p class='button_list button_list7' ></p></td>
                          <td><p class='button_list button_list5' ></p></td>
                          <td><p class='button_list button_list50' ></p></td>
                         </tr>
                         <tr>
                          <td><span>Editar</span></td>
                          <td><span>Avance</span></td>
                          <td><span>Finalizar</span></td>
                          $button_devolverSpan
                          <td><span>Detener</span></td>
                          <td><span>Transferir</span></td>
                          <td><span>Crear SubTarea</span></td>
                         </tr>
                       </table>";
    $seconds = 0;
    $minuts = 0;
    $hours = 0;
    if (isset($ra["tiempo"])) {
        if ($ra["tiempo"] != "" && $ra["tiempo"] != null) {
            $tiempo = explode(":", $ra["tiempo"]);
            $seconds = $tiempo[2];
            $minuts = $tiempo[1];
            $hours = $tiempo[0];
        }
    }
    echo " <div class='timeTaskRun'>
           <b>Tiempo total de actividad</b><br />
             <span id='horas" . $ra["id"] . "'>$hours</span>:<span id='minutos" . $ra["id"] . "'>$minuts</span>:<span id='segundos" . $ra["id"] . "'>$seconds</span><span class='textMini'>(h:m:s)</span>
             <div class='controlsTimeTask'  style='display: $display;'>
              <div class='buttonsControlsTime button_play'>Play</div>
              <div class='buttonsControlsTime button_pausa' style='display: none;'>Pausar</div>
              </div>
            </div> <div class='bg_black_inhability'></div>";
    echo "</div>";
    echo "<div class='enc_tar_see'>";
    echo "<div class='box_dates_left'>";
    if ($ra["proyecto_text"] != "") {
        echo "<h3>Proyecto: " . $ra["proyecto_text"] . " </h3>";
    }
    if ($ra["tipo"] != "") {
        echo "<h3>Tipo: " . $ra["tipo"] . " </h3>";
    }
    echo "<p>Asignado por: " . $ra["usuario"] . " </p>";
    echo "<p>Para: " . $ra["usuario_asignado_text"] . " </p>";
    otros_users($ra["tarea"], $ra["usuario_asignado"]);
    echo "<h1>Asunto: " . strip_tags($ra["tarea"]) . " </h1>";
    echo "<h2 style='color: $color;'>Estado: " . $ra["estado_text"] . " </h2>";
    echo "</div>";
    echo "<div class='box_dates_right'>";
    echo "<p>Fecha de creación: " . $ra["fecha"] . " </p>";
    echo "<p>Fecha de Entrega: " . $ra["fecha_final"] . " " . $ra["hora_final"] . " </p>";
    echo "<p>Fecha de Finalización: " . $ra["fecha_cierre"] . " </p>";
    echo "<p><b>Tiene $fdias días, $fecha_entrega_dias horas para la entrega</b></p>";
    echo "<p><b>Hora estimada de duración: " . $ra["hora_estimada"] . " </b></p>";
    if ($ra["proyecto"] != "") {
        echo "<p class='buttonGreen'><b><a href='http://" . $_SERVER["HTTP_HOST"] . "/cronograma/" . $ra["proyecto"] . "&tipo=tareas#" . $ra["id"] . "' target='_BLANK' >Ver Cronograma # " . $ra["proyecto"] . " </a></b></p>";
    }
    echo "</div>";
    echo "</div>";
    echo "<div class='box_tarea_see'><p>Tarea: " . $ra["observaciones"] . " </p></div>";
    if (isset($ra["respuesta"])) {
        echo "<div class='box_tarea_see'><p>Respuesta: " . $ra["respuesta"] . " </p></div>";
    }


    echo "<div class='containOtherTaskSee'>";
    echo "<h1>Adjuntos</h1>";
    $dbdb = NWDatabase::database();
    $cf = new NWDbQuery($dbdb);
    $whereee = "";
    $whereee .= " where id_relation=:id_tarea";

    $sqla = "select * FROM nwtask_adjuntos " . $whereee;
    $cf->prepare($sqla);
    $cf->bindValue(":id_tarea", $ra["id"]);
    if (!$cf->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($cf->size() == 0) {
//        echo "No se han encontrado datos";
    } else {
        echo "<div class='box_adjuntos_see'>";
        for ($ii = 0; $ii < $cf->size(); $ii++) {
            $cf->next();
            $rra = $cf->assoc();

            echo "<a href='" . $rra["nombre"] . "' href='/imagenes/" . $rra["nombre"] . "' target='_blank'>Ver adjunto</a>";
            echo "<a download='" . $rra["nombre"] . "' href='" . $rra["nombre"] . "'><img src='" . $rra["nombre"] . "' width='100' /></a>";
            // echo "<a href='/nwlib/modulos/nw_tareas/srv/download.php?file=" . $rra["nombre"] . "'><img src='" . $rra["nombre"] . "' width='100' /></a>";
        }
        echo "</div>";
    }

    echo "<div class='bloqs_history'>";
    echo "<h1>Historial de avances</h1>";
    $cb = new NWDbQuery($dbdb);
    $wheree = "";
    $wheree .= " where tarea=:id_tarea";

    $sqla = "select * FROM tareas_det " . $wheree . " order by fecha desc";
    $cb->prepare($sqla);
    $cb->bindValue(":id_tarea", $ra["id"]);
    if (!$cb->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($cb->size() == 0) {
        echo "No se han encontrado datos";
    }
    for ($ii = 0; $ii < $cb->size(); $ii++) {
        $cb->next();
        $rr = $cb->assoc();
        echo "<div class='div_avance'>";
        echo "<b>" . $rr["fecha"] . "</b> ";
        echo "<span>" . $rr["tipo"] . "</span> ";
        echo "<b>" . $rr["usuario"] . "</b> ";
        echo "<p>" . $rr["observaciones"] . "</p>";
        echo "</div>";
    }
    echo "</div>";


    echo "<div class='bloqs_history'>";
    echo "<h1>SubTareas</h1>";
    $cb = new NWDbQuery($dbdb);
    $whereeee = "";
    $whereeee .= " where id_padre=:id_tarea";
    $sqla = "select *, 
        func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text,
        func_concepto(estado, 'estados_tareas_diarias') as estado_text,
        func_concepto(estado, 'estados_tareas_diarias', 'color') as estado_color_text
        FROM tareas_diarias " . $whereeee . " order by fecha desc";
    $cb->prepare($sqla);
    $cb->bindValue(":id_tarea", $ra["id"]);
    if (!$cb->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($cb->size() == 0) {
        echo "No se han encontrado datos";
    }
    for ($ii = 0; $ii < $cb->size(); $ii++) {
        $cb->next();
        $rr = $cb->assoc();
        echo "<div class='div_avanceHijo'>";
        echo "<b>" . $rr["fecha"] . "</b> ";
        echo "<span style='color: " . $rr["estado_color_text"] . "'>" . $rr["estado_text"] . "</span> ";
        echo "<b>Responsable: " . $rr["usuario_asignado_text"] . "</b> ";
        echo "<p>" . $rr["observaciones"] . "</p>";
        echo "<div class='bloqs_historyInavances'>";
        echo "<b>Avances</b>";
        consultaAvancesHijo($rr["id"]);
        echo "</div>";
        echo "</div>";
    }
    echo "</div>";


    echo "</div>";
    echo "</div>";
    echo "               <table class='table_buttons_foot_movil'>
                         <tr>
                          <td style='display: $display_;'><p class='button_list button_list2' ></p><span>Avances</span></td>
                          <td style='display: $display_;'><p class='button_list button_list3' ></p><span>Finalizar</span></td>
                          <td style='display: $display_;'><p class='button_list button_list7' ></p><span>Detener</span></td>
                          $button_devolver
                          <td style='display: $display_;'><p class='button_list button_list5' ></p><span>Transferir</span></td>
                          <td><p class='button_list button_list_cerrar' >X</p></td>
                         </tr>
                       </table>";
    if ($ra["estado"] == "11") {
        if ($ra["usuario"] == $_SESSION["usuario"]) {
            echo "<style>.tareaenejecucionUserCreater{display: block;}</style>";
        } else {
            echo "<style>.tareaenejecucion{display: block;}</style>";
        }
    } else {
        
    }
    ?> 
    <div class='loading_see'><div>Cargando...</div></div>

    <script type="text/javascript">
        $(document).ready(function() {
            removeLoadingSee();
            removeLoading();
            $(".button_list").click(function() {
                $(".ui-dialog").remove();
                $(".ui-widget-overlay").remove();
            });
            $(".button_list_cerrar").click(function() {
                $(".bx_all_see").remove();
                $(".ui-dialog").remove();
                //            $(".ui-widget-overlay").remove();
                history.pushState(null, "Tarea", "tareas");
            });
        });
    </script>
    <div class="tareaenejecucion">
        Esta tarea está en ejecución, no puedes editarla. Sólo la puede editar el creador de la tarea.
    </div>
    <div class="tareaenejecucionUserCreater">
        Esta tarea está en ejecución, sin embargo tú eres el creador, puedes editarla!
    </div>
</div>
<div class="bgFond"></div>