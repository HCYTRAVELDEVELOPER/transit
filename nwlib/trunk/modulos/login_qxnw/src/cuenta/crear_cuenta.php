<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/login_qxnw/_mod.php';
}
?>
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>login_qxnw/js/validate/jquery.validate.1.5.2.js" ></script>
<div class="box_info_popup">
    CREAR CUENTA
    <form id="form_create" name="form_create" method="post">
        <div id="edit-name-wrapper">
            <label>
                Nombre
            </label>
            <input name="name" id="name" type="text" class="required"/>
        </div>
        <div id="edit-name-wrapper">
            <label>
                E-mail:
            </label>
            <input name="mail" id="mail" type="text" class="required"/>
        </div>
        <div id="edit-name-wrapper">
            <label>
                Sitio web:
            </label>
            <input name="host" id="host" type="text" class="required"/>
        </div>
        <div id="edit-name-wrapper">
            <label>
                Contraseña:
            </label>
            <input name="pass" id="pass" type="password" class="required input_all"/>
        </div>
        <div id="edit-name-wrapper">
            <input name="ingresar" id="ingresar" class="btn curve send_data_login_two" value="Crear Cuenta" type="submit" />
        </div>
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
            var xx = history.back();
            window.location == xx;
        });
        $('#close_bg').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            var xx = history.back();
            window.location == xx;
        });
    });
    $("#ingresar").click(function() {
        // autentica_user();
    });
</script>