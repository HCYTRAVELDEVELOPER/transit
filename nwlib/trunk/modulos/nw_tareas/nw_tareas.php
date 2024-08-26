<?php

//require_once dirname(__FILE__) . '/../../rpcsrv/_mod.inc.php';
//echo $url="http://".$_SERVER['HTTP_HOST'].":".$_SERVER['SERVER_PORT'].$_SERVER['REQUEST_URI'];

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

if (session_id() == "") {
    // ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}

if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida en nw_tareas. Inicie sesión..";
    ?>
    <script type="text/javascript">
        window.location = "/tasklogin";
    </script>
    <?php
    return;
}
//$id_user = $r["id"];
$id_user = $_SESSION["id"];

//$id_user = $_POST["us"];

function tareas_diarias($p, $u, $det, $others) {
    global $user;
    global $id_user;
    $prioridad_show = "";
    $count_v = "";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $cc = new NWDbQuery($db);
    $where = " where 1=1 ";
    if (isset($user)) {
        $where .= " and usuario_asignado=:user";
    }
    if (isset($det)) {
        if ($det == 100) {
            echo "";
        } else
        if ($det != "0") {
            $where .= " and prioridad=:prioridad";
        }
    }
    if (isset($u)) {
        if ($u != "0") {
            $where .= " and usuario_asignado=:usuario";
        } else {
            $where .= " and usuario=:usuario_text";
        }
    }
    if (isset($p)) {
        if ($p == 0) {
            $where .= " and estado<>'3'";
        } else
        if ($p == 3) {
            $where .= " and estado=:estado";
        } else
        if ($p == 1000) {
            $where .= " and leido='NO' ";
        } else {
            $where .= " and estado=:estado and estado<>'3'";
        }
    }
    $sql = "select *,func_concepto(estado, 'estados_tareas_diarias') as estado_text,
        func_concepto(estado, 'estados_tareas_diarias', 'color') as color,
        func_concepto(prioridad, 'estado_prioridades') as priority_text
        FROM tareas_diarias " . $where . " order by fecha desc";
    $ca->prepare($sql);
    $ca->bindValue(":user", $id_user);
    $ca->bindValue(":prioridad", $det);
    $ca->bindValue(":usuario", $u);
    $ca->bindValue(":usuario_text", $_SESSION["usuario"]);
    $ca->bindValue(":estado", $p);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($ca->size() == 0) {
        if ($p == 1) {
            echo "<p style='color: green; text-decoration: none; cursor:auto;'>No tienes tareas nuevas!</p>";
            return;
        } else
        if ($p == 0) {
            echo "0 ";
            return;
        } else {
            echo "";
            return;
        }
    }
    if (isset($others)) {
        if ($others != "0") {
            echo "<b style='color:red;font-weight: 100;'>" . $ca->size() . "</b>";
            return;
        }
    }
    $ca->next();
    $r = $ca->assoc();
    $count_v = $ca->size();
    if ($det == 100) {
        $det = "0";
    }
    echo "<p style='color: " . $r["color"] . ";'  onclick='javascript:setParamRecordList($u,$det,$p)'>
            " . $count_v . " " . $r["estado_text"] . " $prioridad_show
          </p>";
//    }
    //ACTUALIZA PRIORIDADES AUTOMÁTICOS
    $sqlb = "select * FROM tareas_diarias " . $where . " order by fecha desc";
    $cb->prepare($sqlb);
    $cb->bindValue(":user", $id_user);
    $cb->bindValue(":prioridad", $det);
    $cb->bindValue(":usuario", $u);
    $cb->bindValue(":usuario_text", $_SESSION["usuario"]);
    $cb->bindValue(":estado", $p);
    if (!$cb->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($cb->size() == 0) {
        echo "no se encontraron datos relacionados";
        return;
    }
    for ($ii = 0; $ii < $cb->size(); $ii++) {
        $cb->next();
        $ra = $cb->assoc();
        if ($r["estado"] == 3) {
            return;
        } else {

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
            if ($fdias > 9) {
                $prioridad = 1;
            } else
            if ($fdias >= 6 & $fdias <= 9) {
                $prioridad = 2;
            } else
            if ($fdias >= 2 & $fdias <= 5) {
                $prioridad = 3;
            } else
            if ($fdias <= 1) {
                $prioridad = 4;
            } else
            if ($fdias < 0) {
                $prioridad = 4;
            }

            if ($ra["prioridad"] == $prioridad) {
                return;
            }
            $sqlc = "UPDATE tareas_diarias SET prioridad=:prioridad_ WHERE id=:id";
            $cc->bindValue(":id", $ra["id"]);
            $cc->bindValue(":prioridad_", $prioridad);
            $cc->prepare($sqlc);
            if (!$cc->exec()) {
                echo "Hubo un error, inténtelo nuevamente. Lo sentimos!";
                return;
            }
        }
    }
}

echo "<div class='box_tareas'>";
echo "<div class='new_tar button_new' onclick='javascript:FromUpdate(0,100)'>Nueva</div>";
echo "<div class='new_tar_mobile button_new' onclick='javascript:FromUpdate(0,100)'>+</div>";
echo "<h1 class='h1_tars_hidden'> Tienes ";
tareas_diarias(0, $id_user, 0, 1);
echo " Tareas</h1>";

echo "<div class='box_enc_prids'>";
echo "<div class='box_tareasdivs'>";
//echo "<p style='font-weight: bold;' onclick='javascript:setParamRecordList($id_user,0,1000)'>Recibidos <span style='color:#999;'>";
echo "<p style='font-weight: bold;' ><a href='/inbox'>Recibidos </a><span style='color:#999;'>";
tareas_diarias(1000, $id_user, 100, 1);
echo "</span></p>";
echo "<p style='font-weight: bold;' onclick='javascript:setParamRecordList($id_user,0,1000)'>Enviados";
echo "</p>";
echo "</div>";


echo "<div class='box_tareasdivs'>";
echo "<p style='font-weight: bold;' class='p_inmediatas'><span class='span_stag'> > </span>Inmediatas ";
tareas_diarias(0, $id_user, 4, 1);
echo "</p>";
echo "<div class='into_hidden_more'>";
tareas_diarias(1, $id_user, 4, 0);
tareas_diarias(2, $id_user, 4, 0);
tareas_diarias(4, $id_user, 4, 0);
tareas_diarias(5, $id_user, 4, 0);
tareas_diarias(6, $id_user, 4, 0);
tareas_diarias(7, $id_user, 4, 0);
tareas_diarias(8, $id_user, 4, 0);
tareas_diarias(9, $id_user, 4, 0);
tareas_diarias(10, $id_user, 4, 0);
echo "<p>";
tareas_diarias(3, $id_user, 4, 0);
echo "</p>";
echo "</div>";
echo "</div>";

echo "<div class='box_tareasdivs'>";
echo "<p style='font-weight: bold;'><span class='span_stag'> > </span>Altas";
tareas_diarias(0, $id_user, 3, 1);
echo "</p>";
echo "<div class='into_hidden_more'>";
tareas_diarias(1, $id_user, 3, 0);
tareas_diarias(2, $id_user, 3, 0);
tareas_diarias(4, $id_user, 3, 0);
tareas_diarias(5, $id_user, 3, 0);
tareas_diarias(6, $id_user, 3, 0);
tareas_diarias(7, $id_user, 3, 0);
tareas_diarias(8, $id_user, 3, 0);
tareas_diarias(9, $id_user, 3, 0);
tareas_diarias(10, $id_user, 3, 0);
echo "<p>";
tareas_diarias(3, $id_user, 3, 0);
echo "</p>";
echo "</div>";
echo "</div>";

echo "<div class='box_tareasdivs'>";
echo "<p style='font-weight: bold;'><span class='span_stag'> > </span>Medias";
tareas_diarias(0, $id_user, 2, 1);
echo "</p>";
echo "<div class='into_hidden_more'>";
tareas_diarias(1, $id_user, 2, 0);
tareas_diarias(2, $id_user, 2, 0);
tareas_diarias(4, $id_user, 2, 0);
tareas_diarias(5, $id_user, 2, 0);
tareas_diarias(6, $id_user, 2, 0);
tareas_diarias(7, $id_user, 2, 0);
tareas_diarias(8, $id_user, 2, 0);
tareas_diarias(9, $id_user, 2, 0);
tareas_diarias(10, $id_user, 2, 0);
echo "<p>";
tareas_diarias(3, $id_user, 2, 0);
echo "</p>";
echo "</div>";
echo "</div>";

echo "<div class='box_tareasdivs'>";
echo "<p style='font-weight: bold;'><span class='span_stag'> > </span>Bajas";
tareas_diarias(0, $id_user, 1, 1);
echo "</p>";
echo "<div class='into_hidden_more'>";
tareas_diarias(1, $id_user, 1, 0);
tareas_diarias(2, $id_user, 1, 0);
tareas_diarias(4, $id_user, 1, 0);
tareas_diarias(5, $id_user, 1, 0);
tareas_diarias(6, $id_user, 1, 0);
tareas_diarias(7, $id_user, 1, 0);
tareas_diarias(8, $id_user, 1, 0);
tareas_diarias(9, $id_user, 1, 0);
tareas_diarias(10, $id_user, 1, 0);
echo "<p>";
tareas_diarias(3, $id_user, 1, 0);
echo "</p>";
echo "</div>";
echo "</div>";

echo "<div class='box_tareasdivs'>";
echo "<p style='font-weight: bold;'>";
tareas_diarias(0, 0, 0, 1);
echo " Enviadas</p>";
echo "<div class='into_hidden_more'>";
tareas_diarias(1, 0, 100, 0);
tareas_diarias(2, 0, 100, 0);
tareas_diarias(4, 0, 100, 0);
tareas_diarias(5, 0, 100, 0);
tareas_diarias(6, 0, 100, 0);
tareas_diarias(7, 0, 100, 0);
tareas_diarias(8, 0, 100, 0);
tareas_diarias(9, 0, 100, 0);
tareas_diarias(10, 0, 100, 0);
echo "<p>";
tareas_diarias(3, 0, 0, 0);
echo "</p>";
echo "</div>";
echo "</div>";

echo "</div>";
echo "</div>";
echo "<div class='box_projects_home'><h1>Mis Proyectos</h1>";
echo "<div id='proyects'></div>";
echo "</div>";

//include 'nw_calendar.php';
?> 
    <script>
        loadMainProyects();
    </script>

