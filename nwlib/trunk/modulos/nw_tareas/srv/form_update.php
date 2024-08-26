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
}

$id = $_POST["id"];
$estado = $_POST["estado"];

if (session_id() == "") {
//    ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

function hours_day($n) {
    $horas_dia = 8;
    if ($n == "hora_estimada") {
        $horas_dia = 0;
    }
    $hour = $horas_dia;
    $media = "00";
    $hour_sistem = $horas_dia;
    echo "<select  id='" . $n . "_task' name='" . $n . "' >";
    for ($ib = 0; $ib <= 22; $ib++) {
        if ($ib == 0) {
            if ($n != "hora_estimada") {
                echo "<option value=''>00:00</option>";
            }
        } else {
            echo "<option value='" . $hour_sistem . ":" . $media . "'>" . $hour . ":" . $media . "</p>";
            if ($media == "30") {
                if ($hour == 12 && $media == "30") {
                    $hour = 1;
                } else {
                    $hour++;
                }
                $hour_sistem++;
                $media = "00";
            } else {
                $media = "30";
            }
        }
    }
    echo "</select>";
}

if ($estado == 0) {
    $dbd = NWDatabase::database();
    $ca = new NWDbQuery($dbd);
    $ca->prepareSelect("tareas_det", "*", "tarea=:id order by fecha desc");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error!" . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "no hay historial.";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        echo "Fecha:" . $r["fecha"] . "<br />. Avance: " . $r["observaciones"] . "<br /><hr>";
    }
    return;
}
?>
<style type="text/css">
    html,body {
        overflow: hidden;
        overflow-x: hidden!important;
        overflow-y: hidden;
    }
</style>
<?php
$post_vista_users = $_POST["a"];
$date_mes_ano_post = $_POST["b"];
$date_hoy_numbers = $_POST["c"];
$ei = $_POST["d"];

if ($post_vista_users == "undefined") {
    $post_vista_users = "'none'";
    $date_mes_ano_post = "none";
    $date_hoy_numbers = "none";
    $ei = "'none'";
}

//echo $post_vista_users . " - " . $date_mes_ano_post . " - " . $date_hoy_numbers . " - " . $ei;

function usuarios($p) {
    $dbd = NWDatabase::database();
    $ca = new NWDbQuery($dbd);
    $si = session::getInfo();
    $ca->prepareSelect("usuarios", "*", "1=1 and estado='activo' and empresa=:empresa and terminal=:terminal order by nombre asc");
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!" . $ca->lastErrorText();
    }
    if ($ca->size() == 0) {
        echo "no hay usuarios.";
    }
    $name_select = $p;
    echo "<select multiple id='$name_select' name='$name_select' class='required input_multiple input_multiple_usuarios' onchange='populateUserTime(this.value)'>";
//    echo "<option value=''>Seleccione</option>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["id"] == $_SESSION["id"]) {
            $selected = "selected='selected'";
        } else {
            $selected = "";
        }
        echo "<option $selected  value='" . $r["id"] . "'>" . $r["nombre"] . "</option>";
    }
    echo "</select>";
}

function proyectos($p) {
    $dbd = NWDatabase::database();
    $ca = new NWDbQuery($dbd);
    $ca->prepareSelect("projectplan_enc", "*", "estado=:estado and empresa=:empresa and terminal=:terminal order by nombre asc");
    $ca->bindValue(":estado", "ABIERTO");
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "Error!" . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
//        echo "No hay proyectos.";
//        return;
    }
    $name_select = $p;
    echo "<select id='$name_select' name='$name_select'>";
    echo "<option value=''>Ninguno</option>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["id"] == $_SESSION["id"]) {
            $selected = "selected='selected'";
        } else {
            $selected = "";
        }
        echo "<option $selected  value='" . $r["id"] . "'>" . $r["nombre"] . "</option>";
    }
    echo "</select>";
}
?>
<div class="blog-test" id="geolocation-test-into" style="display: none;">
    <p>
        El script aún no se ha ejecutado.
    </p>
</div>
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
<script type="text/javascript">
    lon = "";
    lat = "";
    dir = "";
    /*<![CDATA[*/
    (function() {
        var content = document.getElementById("geolocation-test-into");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(objPosition) {
                lon = objPosition.coords.longitude;
                lat = objPosition.coords.latitude;
                dir = "";
                var latlng = new google.maps.LatLng(lat, lon);
                geocoder = new google.maps.Geocoder();
                geocoder.geocode({"latLng": latlng}, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            dir = "<p><strong>Dirección: </strong>" + results[0].formatted_address + "</p>";
                        } else {
                            dir = "<p>No se ha podido obtener ninguna dirección en esas coordenadas.</p>";
                        }
                    } else {
                        dir = "<p>El Servicio de Codificación Geográfica ha fallado con el siguiente error: " + status + ".</p>";
                    }
                    content.innerHTML = "<p><strong>Latitud:</strong> " + lat + "</p><p><strong>Longitud:</strong> " + lon + "</p>" + dir;
//                    ubication(lat, lon, dir, <?php echo $id; ?>);
                });
            }, function(objPositionError) {
                switch (objPositionError.code) {
                    case objPositionError.PERMISSION_DENIED:
                        content.innerHTML = "No se ha permitido el acceso a la posición del usuario.";
                        break;
                    case objPositionError.POSITION_UNAVAILABLE:
                        content.innerHTML = "No se ha podido acceder a la información de su posición.";
                        break;
                    case objPositionError.TIMEOUT:
                        content.innerHTML = "El servicio ha tardado demasiado tiempo en responder.";
                        break;
                    default:
                        content.innerHTML = "Error desconocido.";
                }
            }, {maximumAge: 75000, timeout: 15000});
        } else {
            content.innerHTML = "Su navegador no soporta la API de geolocalización.";
        }
    })();/*]]>*/</script>
<script type="text/javascript">
    function envia_dato(p) {
        $(".adjunto").val(p);
    }
    function envia_datos_editor(p) {
        $(".ckediot").val(p);
    }
    function FocusOnInput() {
        document.getElementById("tipo").focus();
    }

    function populateUserTime(e) {
        return true;
        var data = {};
        data.users = [];
        $('.input_multiple_usuarios :selected').each(function(i, selected) {
            data.users[i] = $(selected).val();
        });
        data.fecha = $("#fecha_final").val();
        $.ajax({
            url: "/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_tareas/srv/getUserTime.php",
            type: 'post',
            data: data,
            error: function() {
                alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
            },
            success: function(data) {
                $("#horasEstimadasDiv").empty();
                $("#horasEstimadasDiv").append(data);
            }
        });
    }

    $("#form_two").validate({
        rules: {
            respuesta: {
                required: true
            }
        },
        messages: {
            respuesta: "respuesta Requerido"
        },
        submitHandler: function() {
            $(".ui-dialog").remove();
            $(".ui-widget-overlay").remove();
            update(<?php echo $post_vista_users ?>, '<?php echo $date_mes_ano_post ?>', '<?php echo $date_hoy_numbers ?>',<?php echo $ei ?>, <?php echo $ei ?>);
//            ubication(lat, lon, dir, <?php echo $id; ?>);
        }
    });
    $(document).ready(function() {
        removeLoading();
        FocusOnInput();
    });
</script>


<form id="form_two" name="form_two" method="post">
    <input name="id" type="hidden" value="<?php echo $id; ?>" />
    <?php
    $contend_textarea = "";
    if ($id == 0 & $estado == 100) {
        //NUEVO
        echo "<div class='form_box_left'>";
        echo "<div>";
        echo "<div class='div_list_new'>";
        echo "<label>Tipo</label>";
        echo "<select class='required' name='tipo' id='tipo'>
                <option value='tarea'>Tarea</option>
                <option value='adicional'>Tarea Adicional</option>
                  <option value='cita'>Cita</option>
                <option value='mensaje'>Mensaje / Recordatorio</option>
              </select>
                ";
        echo "<label>Repetir</label>";
        echo "<select class='repetir' name='repetir' id='repetir'>
                <option value='nunca'>Nunca</option>
                <option value='semanal'>Semanal</option>
                  <option value='mensual'>Mensual</option>
                <option value='anual'>Anual</option>
              </select>
                ";
        echo "<label>¿Público?</label>";
        echo "<select class='publico' name='publico' id='publico'>
                <option value='SI'>SI</option>
                <option value='NO'>NO</option>
              </select>
                ";
        ?>
        <div style="display: none;">
            <label>fecha_limite_repeticion</label>
            <input type='date' id='fecha_limite_repeticion' name='fecha_limite_repeticion' class='required' value='<?php echo date("Y-m-d"); ?>' >
        </div>
        <?php
        echo "</div>";
        echo "<div class='div_list_new'>";
        echo "<label>Proyecto</label>";
        proyectos("proyecto");
        echo "</div>";
        echo "<div class='div_list_new'>";
        echo "<label>Fecha de Entrega:</label> ";
        if (isset($_POST["fecha"])) {
            if ($_POST["fecha"] == "undefined") {
                echo "<input type='date' id='fecha_final' name='fecha_final' class='required' value='" . date("Y-m-d") . "'>";
            } else {
                $date_mes_ano = date('Y-m') . "-" . $_POST["fecha"];
                echo "<input type='date' id='fecha_final' name='fecha_final' class='required' value='" . $_POST["fecha"] . "'>";
            }
        } else {
            echo "<input type='date' id='fecha_final' name='fecha_final' class='required' value='" . date("Y-m-d") . "'>";
        }
        echo "</div>";
        echo "<div class='div_list_new'>";
//        echo "<label>Hora</label><input type='time' name='hora' class='required'  required id='hour_task'>";
        echo "<label>Hora</label>";
        hours_day("hora");
        echo "</div>";
        echo "<div class='div_list_new horasEstimadas'>";
//        echo "<label>Hora Estimada de Duración</label><input type='number' name='hora_estimada' class='required' value='00'>Hrs <input type='number' name='minutos_estimados' class='required' value='00'>Mins";
        echo "<label>Hora Estimada de Duración</label>";
        hours_day("hora_estimada");
        //hours_day_notask("hora_estimada");
        echo "<div id='horasEstimadasDiv'>";
        echo "</div>";
        echo "</div>";
        echo "</div>";
        echo "<div>";
        echo "<label>Usuario</label>";
        usuarios("usuario_asignado[]");
        echo "</div>";
        echo "</div>";
        $title_respuesta = "Tarea";
    } else
    if ($estado == 2) {
        //ENVIAR AVANCES
        $title_respuesta = "Avance";
        echo "<input name='usuario_asignado' type='hidden' value='0' />";
        echo "<input name='avances' type='hidden' value='avances' />";
        echo "<input name='estado' type='hidden' value='2' />";
    } else
//        {
    if ($estado == 5) {
        //TRANSFERIR
        ?>
        <style>
            .input_multiple{
                width: 20%!important;
                float: right!important;
            }
        </style>
        <?php
        echo "<h3>Seleccione el usuario a transferir la tarea</h3>";
        usuarios("usuario_asig_transfer");
//        }
        $title_respuesta = "Respuesta";
        $contend_textarea = "Hecho!";
        echo "<input name='usuario_asignado' type='hidden' value='0' />";
        echo "<input name='estado' type='hidden' value='$estado' />";
    } else
    if ($estado == 50) {
        //TAREA HIJO
        ?>
        <style>
            .input_multiple{
                width: 20%!important;
                float: right!important;
            }
        </style>
        <?php
        echo "<input type='date' id='fecha_final' name='fecha_final' class='required' value='" . date("Y-m-d") . "'>";
        echo "<label>Hora</label><input type='time' name='hora' class='required' value='12:00'>";
        echo "<h3>Seleccione  los usuarios a crear la SUB-Tarea</h3>";
        usuarios("usuario_asignado[]");
        $title_respuesta = "Tarea: ";
        $contend_textarea = "Hecho!";
//        echo "<input name='usuario_asignado' type='hidden' value='0' />";
        echo "<input name='estado_hijo' type='hidden' value='$estado' />";
        echo "<input name='estado' type='hidden' value='1' />";
    } else {
        if ($estado == 5) {
            //TRANSFERIR
            ?>
            <style>
                .input_multiple{
                    width: 20%!important;
                    float: right!important;
                }
            </style>
            <?php
            echo "<h3>Seleccione el usuario a transferir la tarea</h3>";
            usuarios("usuario_asig_transfer");
        }
        $title_respuesta = "Respuesta";
        $contend_textarea = "Hecho!";
        echo "<input name='usuario_asignado' type='hidden' value='0' />";
        echo "<input name='estado' type='hidden' value='$estado' />";
    }
    ?>
    <div class="form_box_right">
        <label><?php echo $title_respuesta ?></label>
        <div>
            <iframe src="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_tareas/includes/editor/editor1.php" name="SubHtmlEditor" id="SubHtmlEditor"
                    width="100%" height="230px" scrolling="auto" frameborder="0">
            <p>Texto alternativo para navegadores que no aceptan iframes.</p>
            </iframe>
            <textarea id="respuesta" name="respuesta" class="required ckediot" style="display: none;"></textarea>
        </div>
        <div class="box_adjunte">
            <input id="adjunto" name="adjunto" class="adjunto" type="hidden" value="" />
            <iframe src="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_tareas/includes/upload_ajax/index.php" name="SubHtml"
                    width="100%" height="240px" scrolling="auto" frameborder="0">
            <p>Texto alternativo para navegadores que no aceptan iframes.</p>
            </iframe>
            <?php
//  include $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/nw_tareas/includes/upload_ajax/index.php";
            ?>
        </div>
    </div>
    <input id="ingresar" type="submit" value="enviar" style="display: none;"/>
</form>
<style type="text/css">
    .ui-dialog-buttonpane {
        display: block!important;
    }
</style>

