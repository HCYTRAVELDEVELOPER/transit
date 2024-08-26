<?php
//require_once dirname(__FILE__) . '/../../rpcsrv/_mod.inc.php';
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
}


if (session_id() == "") {
//    ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

$db = NWDatabase::database();
$cb = new NWDbQuery($db);

$post_vista_users = $_POST["a"];
$date_mes_ano = $_POST["b"];
$date_hoy_numbers = $_POST["c"];
$ei = $_POST["d"];
$type = "";
if (isset($_POST["type"])) {
    if ($_POST["type"] != "") {
        $type = $_POST["type"];
    }
}
$elAnio = date('Y');
$elMesEnvia = date('m');
//echo $post_vista_users . " - " . $date_mes_ano . " - " . $date_hoy_numbers . " - " . $ei;

$where = " where 1=1 ";
if (isset($_SESSION["id"])) {
    if (isset($post_vista_users)) {
        if ($post_vista_users == 1) {
            $where .= " and usuario=:usuario_text and usuario_asignado<>:user";
        } else
        if ($post_vista_users == 0) {
            $where .= " and usuario_asignado=:user";
        }
    }
    if ($type != "") {
        if ($type == "tarea") {
            $where .= " ";
        } else {
            $where .= " and tipo=:tipo";
        }
    }
}

if (isset($date_mes_ano)) {
    $where .= " and fecha_final=:fecha__";
}
$sqlb = "select *,
         func_concepto(estado, 'estados_tareas_diarias', 'color') as color ,
         func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text, 
         func_concepto(proyecto, 'projectplan_enc') as proyecto_text 
         FROM tareas_diarias " . $where . " order by hora_final asc";
$cb->prepare($sqlb);
$cb->bindValue(":user", $_SESSION["id"]);
$cb->bindValue(":fecha__", $date_mes_ano);
$cb->bindValue(":usuario_text", $_SESSION["usuario"]);
$cb->bindValue(":tipo", $type);
if (!$cb->exec()) {
    echo "no se pudo consultar";
    return;
}
$typeText = "";
if ($type == "tarea") {
    $typeText = "Tareas";
}
if ($type == "cita") {
    $typeText = "Citas";
}
if ($type != "") {
    echo "<h3 class='h3_others'>$typeText</h3>";
}

$date_envia = '"' . $elAnio . '-' . $elMesEnvia . '-' . $ei . '"';
if ($cb->size() == 0) {
//    if ($date_mes_ano >= $date_hoy_numbers) {
//        
    ?>
    <script type="text/javascript">
        //            $(".new__int//<?php echo $ei ?>").click(function() {
        //                var dataEnv = //<?php echo $date_envia ?>;
        //                FromUpdate(0, 100, dataEnv,//<?php echo $post_vista_users ?>, '<?php echo $elMesEnvia ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        //            });
    </script>
    <?php
//        echo "<div class='new_tar button_new button_hidden new__int$ei'>Nueva Tarea</div>";
//    } else {
//        
//    }
} else {
    for ($ai = 0; $ai < $cb->size(); $ai++) {
        $cb->next();
        $ra = $cb->assoc();
        $subrayado = "";
        $project_end_task = "";
        if ($ra["estado"] == 3) {
            $subrayado = "<span class='ok_task'>√</span>";
            $project_end_task = "project_end_task";
        }
        $hora_tarea = "00:00";
        if ($ra["hora_final"] != "") {
            $hora_tarea = explode(":", $ra["hora_final"]);
        }
        $id_encryp = $ra["id"];
        $id_desencryp = base64_decode($ra["id"]);
        $id = $ra["id"];
        ?>
        <script type="text/javascript">
            $(".tarea__div<?php echo $id_encryp ?>").click(function() {
                seetareaDialog(<?php echo $id; ?>,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>',<?php echo $ei ?>, <?php echo $ei ?>, "undefined", '<?php echo $type ?>');
            });
        </script>
        <?php
        $show_user_asignado = "";
        if (isset($post_vista_users)) {
            if ($post_vista_users == "1") {
                $show_user_asignado = $ra["usuario_asignado_text"];
            }
        }
        $no_leido = "";
        if ($ra["estado"] == "1") {
            if ($ra["leido"] == null || $ra["leido"] == "NO" || $ra["leido"] == "") {
                $no_leido = "mess_no_read";
            }
        }
        $user_coloca = "";
        if ($ra["usuario"] == $_SESSION["usuario"]) {
            $user_coloca = "Yo";
        } else {
            $user_coloca = $ra["usuario"];
        }
        $advertencia = "";
        $project_task_pasada = "";
        if ($ra["estado"] != 3 && $ra["estado"] != 13) {
            if ($ra["fecha_final"] < date("Y-m-d")) {
                $advertencia = "<div class='Vencida_clase'>!</div>";
                $project_task_pasada = "project_task_pasada";
            } else {
                $project_task_pasada = "";
            }
        } else {
            $project_task_pasada = "";
        }
        $project = "";
        $project_close = "";
        if ($ra["proyecto"] != "") {
            $project = "<div class='nom_project $project_end_task $project_task_pasada'>Proyecto: " . $ra["proyecto_text"] . "";
            $project_close = "</div>";
        }
        $limite_task = 100;
        $texto_task = strip_tags($ra["observaciones"]);
        $texto_task = substr($texto_task, 0, $limite_task);
        $palabras_task = explode(' ', $texto_task);
        $resultado_task = implode(' ', $palabras_task);
        $resultado_task .= '...';
        $tarea = $resultado_task;
        echo "<div class='list_tarea_calendar $no_leido tarea__div" . $id_encryp . " ' style='color: " . $ra["color"] . ";'>
                     " . $subrayado . $advertencia . $project . "
                     <p class='box_nw_user_coloca'>" . $user_coloca . " " . $hora_tarea[0] . ":" . $hora_tarea[1] . " $show_user_asignado
                    </p>
                    <span class='list_tarea_calendar_span tarea_" . $id_encryp . " '>" . strip_tags($tarea) . "</span>
                        $project_close
                  </div>";
    }
}
?>