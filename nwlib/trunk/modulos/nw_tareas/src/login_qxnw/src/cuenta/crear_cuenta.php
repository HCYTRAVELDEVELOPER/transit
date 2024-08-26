<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/nw_tareas/src/login_qxnw/";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/login_qxnw/_mod.php';
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
?>
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>js/validate/jquery.validate.1.5.2.js" ></script>
<style>
    span {
        display: none;
    }
    .box_info_popup {
        width: 20%;   
    }
</style>
<div class="box_info_popup">
    CREAR CUENTA
    <form id="form_create" name="form_create" method="post">
        <table>
            <tr>
                <td>
                    Nombre
                </td> 
                <td>
                    <input name="name" id="name" type="text" class="required"/>
                </td>
            </tr>
            <tr>
                <td>
                    E-mail:
                </td> 
                <td>
                    <input name="mail" id="mail" type="text" class="required"/>
                </td>
            </tr>
            <tr>
                <td>
                    Contraseña:
                </td>
                <td>
                    <input name="pass" id="pass" type="password" class="required input_all"/>
                </td>
            </tr>
            <td colspan="2">
                <input name="ingresar" id="ingresar" class="btn curve send_data_login_two" value="Crear Cuenta" type="submit" />
            </td>
        </table>
    </form>
    <div id="respuesta"></div>
</div>
<div id="close_bg"></div>
<script type="text/javascript">
    $(document).ready(function() {
        document.getElementById('name').focus();
        $("#form_create").validate({
            rules: {
                name: {
                    required: true
                },
                mail: {
                    required: true
                },
                pass: {
                    required: true
                }
            },
            messages: {
                name: "Usuario Requerido",
                mail: "Correo Requerido",
                pass: "Clave Requerida"
            },
            submitHandler: function() {
                create_user();
            }
        });
        $('#close').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
        $('#close_bg').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
    });
    $("#ingresar").click(function() {
        // autentica_user();
    });
</script>