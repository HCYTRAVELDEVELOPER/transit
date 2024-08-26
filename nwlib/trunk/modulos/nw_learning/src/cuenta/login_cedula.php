<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/";
    echo '<script type="text/javascript" src="nw_learning/js/jquery-1.4.2.min.js" ></script>';
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
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
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>nw_learning/js/jquery.validate.1.5.2.js" ></script>
<style>
    span {
        display: none;
    }
    .box_info_popup {
        width: 80%!important;   
    }
</style>
<div class="box_info_popup">
    <form id="form_login_two_cedula" name="form_login_two_cedula" method="post">
        <table>
            <tr>
                <td>
                    Cédula:
                </td> 
                <td>
                    <input size="8" name="cedula" tabindex="1" id="cedula" type="text" class="required"/>
                </td>
            </tr>
            <td colspan="2">
                <input name="ingresar_cedula" id="ingresar_cedula" class="send_data_login_two _cedula" value="Ingresar" type="submit" />
            </td>
        </table>
    </form>
    <div id="respuesta_cedula"></div>
</div>
<script type="text/javascript">
    $(document).ready(function() {
        document.getElementById('cedula').focus();
        $("#form_login_two_cedula").validate({
            rules: {
                cedula: {
                    required: true
                }
            },
            messages: {
                cedula: "Cédula Requerida"
            },
            submitHandler: function() {
                autentica_user_cedula();
            }
        });
    });
</script>

