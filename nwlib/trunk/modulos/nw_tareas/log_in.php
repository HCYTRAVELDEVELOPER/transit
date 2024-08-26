<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<?php
$ruta_carpeta = "/nwlib" . master::getNwlibVersion() . "/modulos/";
if ($_SERVER["HTTP_HOST"] == "nwadmin3.loc") {
    echo "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>";
//    echo "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES' manifest='" . $ruta_carpeta . "nw_tareas/cach.manifest' type='text/cache-manifest'>";
} else
if (isset($_SESSION["usuario"]) && $_SESSION["usuario"] == "alexf") {
//    echo "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>";
    echo "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES' manifest='" . $ruta_carpeta . "nw_tareas/cach.manifest' type='text/cache-manifest'>";
} else {
//    echo "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>";
    echo "<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES' manifest='" . $ruta_carpeta . "nw_tareas/cach.manifest' type='text/cache-manifest'>";
}
?>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<!--<script type="text/javascript" src="/nwproject/jquery/validate/jquery.validate.1.5.2.js" ></script>-->
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
    <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/style.css" />
    <script type="text/javascript" src="/<?php echo "nwlib" . master::getNwlibVersion(); ?>/includes/jquery/jquery-1.4.2.min.js" ></script>
    <script type="text/javascript" src="/<?php echo "nwlib" . master::getNwlibVersion(); ?>/includes/jquery/jquery.validate.1.5.2.js" ></script>
    <script type="text/javascript" src="/<?php echo "nwlib" . master::getNwlibVersion(); ?>/includes/jquery/jquery-ui-1.8.1.custom.min.js"></script> 
    <script type="text/javascript" src="<?php echo $ruta_carpeta; ?>/nw_tareas/js/login.js" ></script>
    <style>
        .recordar_input{
            width: auto!important;
            border: 0!important;
            box-shadow: none!important;
            display: inline!important;
        }
    </style>
</head>
<?php
if (isset($_COOKIE['username']) && isset($_COOKIE['marca'])) {
    ?>
    <script>
        autentica_user_cookie();
    </script>
    <?php
} else {
//    return;
    ?>
    <body>
        <script>
            function load() {
                $("#loader").load('/<?php echo "nwlib" . master::getNwlibVersion(); ?>/modulos/nw_tareas/src/cuenta/autentica_cookie.php');
            }
            $(window).load(function() {
                load();
            });
        </script>
        <div id="loader"></div>
        <div class="box_info_popup">
            <form id="form_login_two" name="form_login_two" method="post">
                <table>
                    <tr>
                        <td>
                            Usuario:
                        </td> 
                        <td>
                            <input size="8" name="usuario" tabindex="1" id="usuario" type="text" class="required"/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Contraseña:
                        </td>
                        <td>
                            <input size="8" name="clave" id="clave" type="password" tabindex="2" class="required input_all"/>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center;">
                            No cerrar sesión
                            <input class="recordar_input" name="recordar" id="recordar"  type="checkbox" checked />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <input name="ingresar" id="ingresar" class="btn curve send_data_login_two" value="Ingresar" type="submit" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" >
                            <center>
                                <a href="#" onclick="javascript: crearCuenta();" class="lnk_crear" style="font-size: 11px; color: #0000FF;">Crear una cuenta</a>
                            </center>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3" >
                            <center>
                                <a href="#" class="lnk_olvido" style="font-size: 11px; color: #0000FF;">¿Olvidó su usuario o contraseña?</a>
                            </center>
                        </td>
                    </tr>
                </table>
            </form>
            <div id="respuesta"></div>
        </div>
        <div id="close_bg"></div>
        <script type="text/javascript">
            $(document).ready(function() {
                document.getElementById('usuario').focus();

                $("#form_login_two").validate({
                    rules: {
                        usuario: {
                            required: true
                        },
                        clave: {
                            required: true
                        }
                    },
                    messages: {
                        usuario: "Usuario Requerido",
                        clave: "Clave Requerida"
                    },
                    submitHandler: function() {
                        autentica_user();
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
        <div id="popup_carga_note"></div>
        <div id="bg"></div>
        
    </body>
    <?php
}
?>
</html>

