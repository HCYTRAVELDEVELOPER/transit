<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (session_id() == "") {
    session_start();
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link href="/nwlib6/modulos/nw_soporte_chat/css/chat.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <script type="text/javascript" src="/nwlib6/includes/jquery/jquery-1.4.2.min.js" ></script>
        <script type="text/javascript" src="/nwlib6/includes/jquery/jquery.validate.1.5.2.js" ></script>
        <script type="text/javascript" src="/nwlib6/includes/jquery/jquery-ui-1.8.1.custom.min.js"></script> 
        <?php
        if (!isset($_SESSION['enviar_carpet'])) {
//        if (!isset($_POST['enviar_carpet'])) {
            $_POST["id_t"] = 1;
            $id_t = "";
            $key = "";
            $host = "";
            if (isset($_GET["id_t"])) {
                $id_t = $_GET["id_t"];
            }
            if (isset($_POST["id_t"])) {
                $id_t = $_POST["id_t"];
            }
            if (isset($_GET["key"])) {
                $key = $_GET["key"];
            }
            if (isset($_POST["key"])) {
                $key = $_POST["key"];
            }
            if (isset($_GET["host"])) {
                $host = $_GET["host"];
            }
            if (isset($_POST["host"])) {
                $host = $_POST["host"];
            }
            $id_terminal = $id_t;
            $host_get = $host;

            $db = NWDatabase::database();
            $c_init = new NWDbQuery($db);
            $_SERVER["HTTP_HOST"] = str_replace("www.", "", $_SERVER["HTTP_HOST"]);
            $where = "id=:id and clave=:key";
            if ($_SERVER["HTTP_HOST"] != $host_get) {
                $where .= " and host=:host ";
            }
            $c_init->prepareSelect("terminales", "id", $where);
            $c_init->bindValue(":id", $id_terminal);
            $c_init->bindValue(":host", $host_get);
            $c_init->bindValue(":key", $key, true, true);
            if (!$c_init->exec()) {
                echo "No se pudo realizar la consulta" . $c_init->lastErrorText();
                return;
            }
            if ($c_init->size() == 0) {
                echo "no hay registros {$_SERVER["HTTP_HOST"]} $id_terminal $host_get $key";
                return;
            }
            $user_pass = "";
            $mail_pass = "";
            $celular = "";
            if (isset($_GET["user"])) {
                $user_pass = $_GET["user"];
            }
            if (isset($_POST["user"])) {
                $user_pass = $_POST["user"];
            }
            if (isset($_SESSION["nombre"])) {
                $user_pass = $_SESSION["nombre"];
            }
            if (isset($_GET["mail"])) {
                $mail_pass = $_GET["mail"];
            }
            if (isset($_POST["mail"])) {
                $mail_pass = $_POST["mail"];
            }
            if (isset($_SESSION["email"])) {
                $mail_pass = $_SESSION["email"];
            }
            if (isset($_GET["celular"])) {
                $celular = $_GET["celular"];
            }
            if (isset($_POST["celular"])) {
                $celular = $_POST["celular"];
            }
            if (isset($_SESSION["celular"])) {
                $celular = $_SESSION["celular"];
            }
            ?>
            <div class="contend_chat_log">
                <div class="enc_log">
                    <?php
//                    $banner = "";
//                    $texto_bienvenida = "Bienvenido a nuestro chat.";
//                    $texto_registro = "Para iniciar una llamada ingrese su nombre y su correo.";
                    $cconf = new NWDbQuery($db);
                    $cconf->prepareSelect("sop_config", "*", "terminal=:terminal");
                    $cconf->bindValue(":terminal", $id_terminal);
                    if (!$cconf->exec()) {
                        echo "Error al consultar la configuración. " . $cconf->lastErrorText();
                        return;
                    }
                    if ($cconf->size() == 0) {
                        echo "No hay configuración del chat, consulte con el administrador del sistema.";
                        return;
                    }
                    $cconf->next();
                    $r_cconf = $cconf->assoc();
                    $banner = $r_cconf["banner"];
                    $texto_bienvenida = $r_cconf["texto_bienvenida"];
                    $texto_registro = $r_cconf["texto_registro"];
                    $show_name = $r_cconf["registro_usar_nombre"];
                    $show_email = $r_cconf["registro_usar_email"];
                    $show_celular = $r_cconf["registro_usar_celular"];
                    print $r_cconf["codigo_oculto"];
                    ?>
                    <img src="<?php echo $banner; ?>" class="img_log_enc" />
                    <h1>
                        <?php echo $texto_bienvenida; ?>
                    </h1>
                </div>
                <form action="/nwchatLive" method="get" id="pasa_form" name="pasa_form">
                    <input type="hidden" value="<?php echo $id_terminal; ?>" name="id_t" class="id_t" id="id_t" />
                    <input type="hidden" value="<?php echo $host_get; ?>" name="host" class="host" id="host" />
                    <input type="hidden" value="<?php echo $key; ?>" name="key" class="key" id="key" />
                    <table>
                        <tr>
                            <td colspan="2">
                                <p>
                                    <?php
                                    echo $texto_registro;
                                    ?>
                                </p>
                            </td>
                        </tr>

                        <?php
                        if ($show_name != "NO") {
                            ?>
                            <tr>
                                <td>
                                    <p>
                                        Nombre
                                    </p>
                                </td>
                                <td>
                                    <input type="text" name='nombre' value="<?php echo $user_pass; ?>" required />
                                </td>
                            </tr>
                            <?php
                        }
                        if ($show_email != "NO") {
                            ?>
                            <tr>
                                <td>
                                    <p>
                                        Correo
                                    </p>
                                </td>
                                <td>
                                    <input id="correo" type="text" name='correo' value="<?php echo $mail_pass; ?>" required />
                                </td>
                            </tr>
                            <?php
                        }
                        if ($show_celular != "NO") {
                            ?>
                            <tr>
                                <td>
                                    <p>
                                        Celular
                                    </p>
                                </td>
                                <td>
                                    <input id="celular" type="text" name='celular' value="<?php echo $celular; ?>" required />
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                        <tr>
                            <td style="text-align: center;" colspan="2">
                                <input type="submit" name="enviar_carpet" value="Iniciar Chat" class="submit_input" />
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
            <?php
        } else {
            include 'visitante.php';
        }
        ?>
    </body>
</html>