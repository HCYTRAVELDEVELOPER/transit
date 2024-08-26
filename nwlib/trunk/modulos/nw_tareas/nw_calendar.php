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
//    ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

$db = NWDatabase::database();
$cb = new NWDbQuery($db);

$hoy = "";

if ($_POST["year"] == 0) {
    $elAnio = date('Y');
} else {
    $elAnio = $_POST["year"];
}
if ($_POST["month"] == 0) {
    $elMes = date('m');
} else {
    $elMes = $_POST["month"];
}

if (isset($_POST["day"])) {
    if ($elMes == date('m') & $elAnio == date('Y')) {
        $elDia = date('d');
    } else {
        if ($_POST["day"] == 100) {
            $elDia = 01;
        } else
        if ($_POST["day"] == 0) {
            $elDia = date('d');
        } else {
            $elDia = $_POST["day"];
        }
    }
} else {
    if ($elMes <> date('m') & $elAnio <> date('Y')) {
        $elDia = "";
    } else {
        $elDia = date('d');
    }
}
$date_hoy_numbers = $elAnio . "-" . $elMes . "-" . $elDia;
$day_number = $elDia;
$mes_number = $elMes;
$year_number = $elAnio;
$mes_text = "";
$ends_weekend = "";
$vista_cuadros = $_POST["vista"];
if ($vista_cuadros != "lista_inicial") {
    setcookie("vistaCookie", $vista_cuadros);
}
$text_vista = "";
$post_vista = "";
$vista_cookie = "";
if(isset($_COOKIE["vistaCookie"])) {
    $vista_cookie = $_COOKIE["vistaCookie"];
}
$post_vista_users_text = "";
$post_vista_users = $_POST["users"];
if (isset($_POST["users"])) {
    if ($post_vista_users == 0) {
        $post_vista_users_text = "ENVIADAS";
        $post_vista_users_data = 1;
    } else
    if ($_POST["users"] == 1) {
        $post_vista_users_text = "MIS TAREAS";
        $post_vista_users_data = 0;
    }
}
if ($vista_cuadros == "lista") {
    $text_vista = "cuadros";
    $post_vista_real = 1;
    $post_vista = 2;
    $class_days_calendar = "calendar_list";
    $class_days_calendar_block = "calendar_list_block";
} else
if ($vista_cookie == "cuadros" || $vista_cuadros == "cuadros") {
    echo " <link rel='stylesheet' type='text/css' href='/nwlib" . master::getNwlibVersion() . "/modulos//nw_tareas/css/cuadros.css' />";
    $text_vista = "lista";
    $post_vista_real = 2;
    $post_vista = 1;
    $class_days_calendar = "";
    $class_days_calendar_block = "";
} else {
    $text_vista = "cuadros";
    $post_vista_real = 1;
    $post_vista = 2;
    $class_days_calendar = "calendar_list";
    $class_days_calendar_block = "calendar_list_block";
}
if ($mes_number == 01) {
    $mes_text = "Enero";
}
if ($mes_number == 02) {
    $mes_text = "Febrero";
}
if ($mes_number == 03) {
    $mes_text = "Marzo";
}
if ($mes_number == 04) {
    $mes_text = "Abril";
}
if ($mes_number == 05) {
    $mes_text = "Mayo";
}
if ($mes_number == 06) {
    $mes_text = "Junio";
}
if ($mes_number == 07) {
    $mes_text = "Julio";
}
if ($mes_number == 08) {
    $mes_text = "Agosto";
}
if ($mes_number == 8) {
    $mes_text = "Agosto";
}
if ($mes_number == 09) {
    $mes_text = "Septiembre";
}
if ($mes_number == 9) {
    $mes_text = "Septiembre";
}
if ($mes_number == 10) {
    $mes_text = "Octubre";
}
if ($mes_number == 11) {
    $mes_text = "Noviembre";
}
if ($mes_number == 12) {
    $mes_text = "Diciembre";
}
if ($day_number == 100) {
    $day_number = "";
} else
if ($day_number == "") {
    $day_number = "";
} else {
    $day_number = "$day_number de";
}
$fecha_hoy_text = "$day_number  $mes_text de $year_number";

echo "<div class='enc_calendar_contros_hours'>";
echo "<div id='hora'></div>";
//echo "<div class='enc_hours_date'>";
//echo "<h1>$fecha_hoy_text</h1>";
//echo "</div>";
$elMesSiguiente = $elMes + 1;
if ($elMesSiguiente == 13) {
    $elMesSiguiente = 01;
}
$elMesAnterior = $elMes - 1;
if ($elMesAnterior == 0) {
    $elMesAnterior = 12;
}
$elAnoSiguiente = $elAnio + 1;
$elAnoAnterior = $elAnio - 1;
?>
<script type="text/javascript">
    $(".anterior_mes").click(function() {
        loadCalendar(<?php echo $post_vista_real ?>,<?php echo $elMesAnterior ?>,<?php echo $elAnio ?>, 100, <?php echo $post_vista_users ?>);
    });
    $(".siguiente_mes").click(function() {
        loadCalendar(<?php echo $post_vista_real ?>,<?php echo $elMesSiguiente ?>,<?php echo $elAnio ?>, 100, <?php echo $post_vista_users ?>);
    });
    $(".anterior_anio").click(function() {
        loadCalendar(<?php echo $post_vista_real ?>,<?php echo $elMes ?>,<?php echo $elAnoAnterior ?>, 100, <?php echo $post_vista_users ?>);
    });
    $(".siguiente_anio").click(function() {
        loadCalendar(<?php echo $post_vista_real ?>,<?php echo $elMes ?>,<?php echo $elAnoSiguiente ?>, 100, <?php echo $post_vista_users ?>);
    });
</script>
<?php
echo "<div class='controls_months'>
    <p class='buttonver_lista_cuadro buttonver_lista_cuadro_only' onclick='javascript:loadCalendar($post_vista,0,0,0,$post_vista_users)'> $text_vista </p>
    <p class='buttonver_lista_cuadro' onclick='javascript:loadCalendar($post_vista_real,0,0,0,$post_vista_users_data)'>$post_vista_users_text</p>
        <div class='box_controls_next_date_year'>
        <div class='box_controls_next_month'>
    <p class='anterior_mes'>Anterior</p> <p class='p_month_year_middle'>$mes_text</p>
    <p class='siguiente_mes'>Siguiente</p> 
</div>    
<span>|</span> 
<div class='box_controls_next_year'>
    <p class='anterior_anio'>Anterior</p> <p class='p_month_year_middle'>$elAnio</p>
    <p class='siguiente_anio'>Siguiente</p>
    </div>  
    </div>
    </div>";
echo "<div class='buscar'>";
include "src/buscar/buscador.php";
echo "</div>";
echo "<div class='lista_priority' onclick='location.href=\"/viewLists\"'>Lista por prioridad</div>";
echo "<div class='lista_priority' onclick='location.href=\"/nwlib" . master::getNwlibVersion() . "/modulos/nw_tareas/src/cuenta/cerrar.php\"'>Cerrar Sesión</div>";
echo "</div>";

echo "<div class='weekend $vista_cuadros'>";
$total_dias_del_mes = date("d", (mktime(0, 0, 0, $elMes + 1, 1, $elAnio) - 1));
for ($ei = 1; $ei <= $total_dias_del_mes; $ei++) {

    $day_week = date('N', strtotime($elAnio . '-' . $elMes . "-" . $ei));
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
    if ($ei < 10) {
        $ei = "0" . $ei;
    }
    if ($ei == $elDia & $elMes == date('m') & $elAnio == date('Y')) {
        $daay = "<h1>Hoy $day_name</h1> <p>$ei<span class='span_visible'> de $mes_text</span></p>";
        $hoy = " hoy_calendar";
    } else {
        $daay = "<h1>$day_name</h1> <p>$ei<span class='span_visible'> de $mes_text</span></p>";
        $hoy = "";
    }
    if ($ei < $elDia) {
        $days_pass = "days_pass";
    } else
    if ($ei > $elDia) {
        $days_pass = "days_news";
    } else {
        $days_pass = "";
    }
    if ($class_days_calendar == "") {
        ?>
        <script type="text/javascript">
            $('.day_main_sel<?php echo $ei ?>').click(function() {
                //            $('.day_main_sel<?php echo $ei ?>').animate({padding: '50px 150px'});
                $('.day_main_sel<?php echo $ei ?>').animate({width: '300', height: '300', left: '-70', top: '-50', border: '1px solid #ccc', boxShadow: '0px 0px 5px'}, 500);
                $('.day_main_sel<?php echo $ei ?>').css({zIndex: '1'});

                $('.day_main_sel<?php echo $ei ?>').mouseleave(function() {
                    $('.day_main_sel<?php echo $ei ?>').animate({width: '100%', height: '92%', left: '0', top: '0', border: '0', boxShadow: 'none'}, 500);
                    $('.day_main_sel<?php echo $ei ?>').css({zIndex: '0'});
                });
            });
        </script>
        <?php
    }
    $hoyDiv = "";
    if ($ei == $elDia) {
        $hoyDiv = $elDia;
        ?>
        <script type="text/javascript">
            $(document).ready(function() {
                setTimeout(function() {
                    var id_div_day = '<?php echo $ei ?>';
                    var div_day = $(".dayc" + id_div_day);
                    var position = div_day.position();
                    moveCalendar(position.left, position.top);
                    removeLoading();
                }, 1500);
            });
        </script>
        <?php
    }
    $classDayCalendar = "";
    $classDayCalendarBola = "";
    $box_contend_notesOthers = "";
    $numero = $ei;
    if ($numero % 2 == 0) {
        $classDayCalendar = "blockDayLeft";
        $classDayCalendarBola = "<div class='blockDayLeftBola'><span class='new_tar_bola new_$ei' >+</span></div>";
        $box_contend_notesOthers = "box_contend_notesOthersLeft";
    } else {
        $classDayCalendar = "blockDayRight";
        $classDayCalendarBola = "<div class='blockDayRightBola'><span class='new_tar_bola new_$ei' >+</span></div>";
        $box_contend_notesOthers = "box_contend_notesOthersRight";
    }
    //ABRE DIV BLOQUE DÍA
    echo "<div id='day$hoyDiv' class='days $days_pass $ends_weekend dayc$ei $class_days_calendar $classDayCalendar'>";
    echo "<div class='div_dia_interno$hoy'>";

    echo $classDayCalendarBola;
    echo "<div class='box_contend_notesOthers box_contend_notesOthers$ei $box_contend_notesOthers'></div>";
    echo "<div class='day_intern day_main_sel$ei $ends_weekend'>";
    echo "<div class='days_enc $class_days_calendar_block'>";
    $date_mes_ano = $elAnio . "-" . $elMes . "-" . $ei;
    if ($elMes == date('m')) {
        $elMesEnvia = date('m');
    } else
    if ($elMes < 10) {
        $elMesEnvia = "0" . $elMes;
    }
    $date_envia = '"' . $elAnio . '-' . $elMesEnvia . '-' . $ei . '"';
    $date_enviaSta = $elAnio . '-' . $elMesEnvia . '-' . $ei;
    echo $daay;
    ?>
    <script type="text/javascript">
        $(".new_<?php echo $ei ?>").click(function() {
            var dataEnv = <?php echo $date_envia ?>;
            FromUpdate(0, 100, dataEnv,<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>);
        });
    </script>
    <?php
    if ($date_mes_ano >= date("Y-m-d")) {
        echo "<span class='new_tar button_new button_hidden_new new_$ei' >+</span>";
    }
    echo "</div>";
    ?>
    <script type="text/javascript">
        loadCalendarBlock(<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>, "box_contend_notes", "tarea");
        loadCalendarBlock(<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>', <?php echo $ei ?>,<?php echo $ei ?>, "box_contend_notesOthers", "cita");
    </script>
    <?php
    echo "<div class='box_contend_notes$ei'></div>";


    echo "</div>";
    echo "<div class='clear'></div>";
    //CIERRA DIV BLOQUE DÍA
    echo "</div>";
    echo "</div>";
}
echo "<div class='clear'></div>";
echo "</div>";
echo "<div class='separate_calendar'><div class='separate_calendar_into'></div></div>";
?>
<script type="text/javascript">
//    $(document).ready(function() {
//        var x = 0;
//        var all = <?php echo $ei ?>;
//        console.log(all);
//        while (x < all) {
//            console.log(x);
//            console.log('<?php echo $date_hoy_numbers ?>');
    //   setInterval("loadCalendarBlock(<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano ?>', '<?php echo $date_hoy_numbers ?>', " + x + ", " + x + ")", 1000); //10000 10 segundos
//            x = x + 1;
//            return;
//        }
//    });
</script>