<?php
echo $_POST["scroll"];

$data = explode("&", $_POST["data"]);
$userExplode = explode("=", $data[0]);
$priorityExplode = explode("=", $data[1]);
$estadoExplode = explode("=", $data[2]);

$showExplode = explode("=", $data[3]);
$modeExplode = explode("=", $data[4]);
$stateExplode = explode("=", $data[5]);
$proyectoExplode = explode("=", $data[6]);
$tipoExplode = explode("=", $data[7]);
$prioridadExplode = explode("=", $data[8]);
$asignatedExplode = explode("=", $data[9]);
$users_listExplode = explode("=", $data[10]);
global $pass1;
$pass1 = $userExplode[1];
$pass2 = $priorityExplode[1];
$pass3 = $estadoExplode[1];
$state = $stateExplode[1];
$proyect = $proyectoExplode[1];
$type = $tipoExplode[1];
$prioryty = $prioridadExplode[1];
$asignated = $asignatedExplode[1];
$users_list = $users_listExplode[1];
$mode = $modeExplode[1];
$show = $showExplode[1];

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

function week_bounds($date, &$start, &$end) {
    $date = strtotime($date);
// Encuentra el inicio de la semana, trabajando hacia atrás
    $start = $date;
    while (date('w', $start) > 1) {
        $start -= 86400; // One day
    }
// Fin de la semana es más que 6 días desde el inicio
    $end = date('Y-m-d', $start + ( 6 * 86400 ));
    $start = date('Y-m-d', $start);
}

function _data_first_month_day() {
    $month = date('m');
    $year = date('Y');
    return date('Y-m-d', mktime(0, 0, 0, $month, 1, $year));
}

$others = 1;
$today = date("Y-m-d");

//$month = date("Y-m-d");
$month = _data_first_month_day();
//$fecha = $today;
//$nuevafecha = strtotime('-5 day', strtotime($fecha));
//$nuevafecha = date('Y-m-j', $nuevafecha);
//$week = $nuevafecha;
week_bounds(date("Y-m-d"), $start, $end);
$week = $start;
//function tareas_diarias($pass3, $pass1, $pass2, $others) {
global $user;
global $id_user;
$para = "";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$where = " where 1=1 ";

//if (isset($pass1)) {
//    $where .= " and usuario_asignado=:user";
//}
if (isset($show) && $show != "") {
    if ($show == "today") {
        $where .= " and fecha::date=:today";
    } else
    if ($show == "week") {
        $where .= " and fecha::date>=:week";
    } else
    if ($show == "month") {
        $where .= " and fecha::date>=:month";
    }
}
if (isset($prioryty) && $prioryty != "") {
    $where .= " and prioridad=:priority";
}
//else {
//    if (isset($pass2)) {
//        if ($pass2 != "0") {
//            $where .= " and prioridad=:prioridad";
//        }
//    }
//}
if (isset($asignated) && $asignated != "") {
    if ($asignated == "my") {
        $where .= " and usuario_asignado=:usuario";
    } else
    if ($asignated == "other") {
        $where .= "   and usuario=:usuario_text";
        if (isset($users_list) && $users_list != "") {
            $where .= " and usuario_asignado=:users_list";
        } else {
            $where .= " and usuario_asignado<>:usuario";
        }
    }
}
//if (isset($pass1)) {
//    if ($pass1 != "0") {
//        $where .= " and usuario_asignado=:usuario";
//    } else {
//        $where .= " and usuario=:usuario_text";
//        $para = "Para: ";
//    }
//}
if (isset($state) && $state != "") {
    if (isset($mode) && $mode == "incluir") {
        $where .= " and estado=:state";
    } else
    if (isset($mode) && $mode == "excluir") {
        $where .= " and estado<>:state";
    } else {
        $where .= " and estado=:state";
    }
}
$where .= " and estado<>'13'";
//else {
//    if (isset($pass3)) {
//        if ($pass3 == 0) {
//            $where .= " and estado<>'3'";
//        } else
//        if ($pass3 == 3) {
//            $where .= " and estado=:estado";
//        } else
//        if ($pass3 == 1000) {
//            $where .= " ";
//        } else {
//            $where .= " and estado=:estado and estado<>'3'";
//        }
//    }
//}

if (isset($proyect) && $proyect != "") {
    if ($proyect == "0") {
        $where .= " and proyecto is null";
    } else {
        $where .= " and proyecto=:proyect";
    }
}
if (isset($type) && $type != "") {
    $where .= " and tipo=:type";
}
$sql = "select *,fecha::date as fecha_date,
        func_concepto(estado, 'estados_tareas_diarias') as estado_text,
        func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text
        FROM tareas_diarias " . $where . " order by fecha_modificacion desc, id desc";
//$ca->bindValue(":user", $id_user);
$ca->bindValue(":user", $pass1);
$ca->bindValue(":prioridad", $pass2);
$ca->bindValue(":usuario", $pass1);
$ca->bindValue(":usuario_text", $_SESSION["usuario"]);
$ca->bindValue(":estado", $pass3);
$ca->bindValue(":state", $state);
$ca->bindValue(":proyect", $proyect);
$ca->bindValue(":type", $type);
$ca->bindValue(":priority", $prioryty);
$ca->bindValue(":users_list", $users_list);
$ca->bindValue(":today", $today);
$ca->bindValue(":week", $week);
$ca->bindValue(":month", $month);
$ca->prepare($sql);
if (!$ca->exec()) {
    echo "No se pudo realizar la consulta. " . $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    echo "No se han encontrado datos";
    return;
}
echo "Total: " . $total;
if (isset($others)) {
    if ($others != "0") {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            //  print_r($r);
            $fecha_explode = explode("-", $r["fecha"]);
            $post_vista_users = 1;
            $date_mes_ano = $r["fecha"];
            $date_hoy_numbers = date('Y-m-d');
            $explodeDosFecha = explode(" ", $fecha_explode[2]);
            $ei = $explodeDosFecha[0];
            $user_show = "";
            if ($asignated == "my") {
                $user_show = $r["usuario"];
            } else {
                $user_show = $r["usuario_asignado_text"];
            }
            ?>
            <?php
            if (isset($_GET["Stask"])) {
                if ($_GET["Stask"] != "") {
                    ?>
                    <script type="text/javascript">
                        $(document).ready(function() {
                            SeeTarea(<?php echo $r["id"]; ?>,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>',<?php echo $ei ?>, <?php echo $ei ?>);
                        });
                    </script>
                    <?php
                }
            }
            ?>
            <script type="text/javascript">
                $('.list_filas_tareas__<?php echo $r["id"] ?>').click(function() {
                    SeeTarea(<?php echo $r["id"]; ?>,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>',<?php echo $ei ?>, <?php echo $ei ?>);
                    //                                                SeeTarea(<?php echo $r["id"]; ?>);
                    $(".list_filas_tareas").removeClass("row_selected");
                    $(this).removeClass("messaje_no_leido");
                    $(this).addClass("row_selected");
                    ShowMob();
                });
            </script>
            <?php
            $leido = "";
            $fecha_show = "";
            $hora_task = explode(" ", $r["fecha"]);
            if ($r["fecha_date"] == date("Y-m-d")) {
                $fecha_show = "Hoy a las $hora_task[1]";
            } else {
                $fecha_show = $r["fecha"];
            }
            if ($r["leido"] == "NO") {
                $leido = "messaje_no_leido";
            }
            $limite = 60;
            $texto = strip_tags($r["observaciones"]);
            $texto = substr($texto, 0, $limite);
            $palabras = explode(' ', $texto);
            $resultado = implode(' ', $palabras);
            $resultado .= '...';
            if($user_show == $_SESSION["usuario"]) {
                $user_show = "";
            }
            echo "<div class='list_filas_tareas list_filas_tareas__" . $r["id"] . " $leido' >
                             <h1>$para" . $user_show . "</h1>
                             <h2>" . strip_tags($resultado) . "</h2> 
                             <h3>Creación: " . $fecha_show . "</h3>
                             <h3>Entrega: " . $r["fecha_final"] . " " . $r["hora_final"] . "</h3>
                             <h4>" . $r["estado_text"] . ". ID: " . $r["id"] . "</h4>
                     </div>";
        }
    }
} else {
    echo $ca->size();
}
//}
//tareas_diarias($pass3, $pass1, $pass2, 1);
?> 
<script type="text/javascript">
    $(document).ready(function() {
        $("#lists_tasks").scrollTop(<?php echo $_POST["scroll"]; ?>);
    });
</script>