<?php
/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html lang="es" xmlns="http://www.w3.org/1999/xhtml"> 
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
        <meta name="title" content="Grupo NW :: Cambio de contraseña con seguridad avanzada"></meta>
        <style>
            body {
                position: relative;
                margin: 0;
                padding: 0;
                background-repeat: no-repeat;
                background-size: cover;
                /*background-size: 1367px 678px;*/
                font-size: 16px;
                font-family: arial;
            }    

            .contenedor{
                background-color: rgba(255, 255, 255, 0.5);
                text-align: center;
                padding: 19px;
                width: 100%;
                animation-duration: 900ms;
                overflow: hidden;
                animation-name: fadein;
                max-width: 1000px;
                margin: auto;
            }
            .foo{
                overflow: hidden;
                display: flex;
                align-items: center;
            }
            .imagen{
                height: 130px;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
            }
            #animei{
                position: absolute;
            }
            #asteriscos{
                top: 115px;
                position: absolute;
            }
            #texto1{
                font-family: gro;
                font-size: 1.6em;

            }
            #logo {
                float: left;
                width: 50%;
                text-align: left;
            }
            #envio {
                float: right;
                width: 50%;
                text-align: right;
            }
            #texto2{
                font-family: latoH;
                font-size: 1.6em;
                font-weight: 100;
            }
            form{
                width: 100%;
                margin: auto;
                box-sizing: border-box;
            }
            #boton{
                font-family: gro;
                background: #20282c;
                width: 50%;
                height: 50px;
                border: none;
                color: #fff;
                font-size: 2em;
            }
            input{
                width: 60%;
                box-sizing: border-box;
                font-size: 23px;
            }

            /*animaciones*/

            #as1 {
                animation-duration: 2s;
                animation-name: fadein;
            }


            #as2{
                animation-duration: 4s;
                animation-name: fadein;
            }

            #as3{
                animation-duration: 6s;
                animation-name: fadein;
            }
            @keyframes fadein {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }

        </style>
    </head>
    <body style="background-image: url('/nwlib6/img/olvido.jpg')">
        <?php
        if (!isset($_GET["usuario"])) {
            $com = "<center>No está autorizado para ingresar a esta página. Se ha generado una comunicación de seguridad</center>";
            master::sendPHPError($com);
        }

        function msg($str) {
            $html = "<br /><div class='contenedor' >
            <div class='imagen' >
                <div id='animei'>
                    <img src='img/senior.png' alt='' style='width: 80px; height: auto;' ></img>
                </div>
                 <div id='asteriscos'>
                    <img src='img/asterisco1.png'  id='as1' alt='' style=' width: 11px; height: 11px;'></img>&nbsp;
                    <img src='img/asterisco1.png'  id='as2' alt='' style=' width: 11px; height: 11px;'></img>&nbsp;
                    <img src='img/asterisco1.png'  id='as3' alt='' style=' width: 11px; height: 11px;'></img>
                </div>
            </div>
            <div id='texto2'>";
            $html .= "<p>";
            $html .= "<center>" . $str . "</center>";
            $html .= "</p>";
            $html .= " 
            <div class='foo'>
                    <div id='logo'>
                        <img src='img/logonwhome.png' alt='Logo Grupo NW S.A.S' style='width: 140px; height: 120px;'></img>
                    </div>
            </div>
            </div>";
            $html .= "</div></div>";
            echo $html;
        }

        $usuario = master::clean($_GET["usuario"]);
        $clave = master::clean($_GET["clave"]);
        $email = master::clean($_GET["email"]);

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "MYSQL") {
            $ca->prepareSelect("nw_forgot_password", "*", "usuario=:usuario and clave=:clave and CAST(fecha AS DATE)=CURDATE() and usada=0 and correo=:correo ");
        } else if ($db->getDriver() == "PGSQL") {
            $ca->prepareSelect("nw_forgot_password", "*", "usuario=:usuario and clave=:clave and fecha::date=CURRENT_DATE and usada=false and correo=:correo");
        }
        $ca->bindValue(":usuario", $usuario, true);
        $ca->bindValue(":clave", $clave, true);
        $ca->bindValue(":correo", $email, true);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            msg("Se presentó un problema al realizar la consulta para el cambio de clave o fue cambiada con anterioridad");
            return;
        }
        if ($ca->size() == 0) {
            msg("No se encontró la información relacionada para el cambio de clave o fue cambiada con anterioridad ");
            return;
        }
        if (isset($_GET["submited"])) {
            if ($_POST["nueva_clave"] == "") {
                msg("Debe ingresar su nueva clave");
                return;
            }
            if ($_POST["nueva_clave_nuevamente"] == "") {
                msg("Debe ingresar su nueva clave dos veces");
                return;
            }
            if ($_POST["nueva_clave"] != $_POST["nueva_clave_nuevamente"]) {
                msg("La claves ingresadas no son iguales");
                return;
            }
            $nueva_clave = master::clean($_POST["nueva_clave"]);
            $ca->prepareUpdate("usuarios", "clave", "usuario=:usuario and email=:email");
            $ca->bindValue(":usuario", $usuario, true);
            $ca->bindValue(":email", $email, true);
            $ca->bindValue(":clave", md5($nueva_clave), true);
            if (!$ca->exec()) {
                error_log($ca->lastErrorText());
                msg("Tuvimos un problema cambiando su clave");
                return;
            }
            $ca->prepareUpdate("nw_forgot_password", "usada", "usuario=:usuario and correo=:email and clave=:clave");
            $ca->bindValue(":usuario", $usuario, true);
            $ca->bindValue(":email", $email, true);
            $ca->bindValue(":clave", $clave, true);
            $ca->bindValue(":usada", true);
            if (!$ca->exec()) {
                error_log($ca->lastErrorText());
                msg("Tuvimos un problema cambiando su clave");
                return;
            }
            echo "<div class='contenedor' >";
            echo "<div id='text_counter'>Su clave ha sido cambiada correctamente. Esta página se cerrará en <b>5</b> segundos</div>";
            echo "<div id='text_counter_alter'><br /><a href='javascript:window.close();'>Cierre el navegador o click aquí</a></div>";
            echo "<script type='text/javascript'>";
            echo "setInterval(function() {";
            echo "window.close();";
            echo "}, 5000); ";
            echo "var count = 5;";
            echo "var number = document.getElementById('text_counter');";
            echo "setInterval(function(){";
            echo "count--; ";
            echo " if (count < 0) { count = 0; }";
            echo "number.innerHTML = 'Su clave ha sido cambiada correctamente. Esta página se cerrará en <b>' + count + '</b> segundos'";
            echo "}, 1000);";
            echo "</script>";
            echo "</div>";
            echo "</body>";
            echo "</html>";
            return;
        }
        ?>
        <br />
        <div class="contenedor" >
            <div class="imagen" >
                <div id="animei">
                    <img src="img/senior.png" alt="" style="width: 80px; height: auto;" ></img>
                </div>
                <div id="asteriscos">
                    <img src="img/asterisco1.png"  id="as1" alt="" style=" width: 11px; height: 11px;"></img>&nbsp;
                    <img src="img/asterisco1.png"  id="as2" alt="" style=" width: 11px; height: 11px;"></img>&nbsp;
                    <img src="img/asterisco1.png"  id="as3" alt="" style=" width: 11px; height: 11px;"></img>
                </div>
            </div>
            <div id="texto1">
                <p>Bienvenid@ al sistema de cambio de claves y recuperación de contraseñas</p>
            </div>
            <div id="texto2">
                <p>Su posibilidad de cambio de clave sólo es <br>válida por hoy</p>
            </div>
            <form method="POST" action="<?php echo NWUtils::getVar("SERVER", "REQUEST_URI") . "&submited" ?>">
                <p>Ingrese su nueva clave</p>
                <input type="password" autocomplete="off" name="nueva_clave"></input>
                <p>De nuevo</p>
                <input type="password" autocomplete="off" name="nueva_clave_nuevamente" ></input>
                <div class="foo">
                    <div id="logo">
                        <img src="img/logonwhome.png" alt="Logo Grupo NW S.A.S" style="width: 300px; height: 120px;"></img>
                    </div>
                    <div id="envio" ><input type="submit" name="submit" value="ENVIAR" id="boton"></div>
                </div>
            </form>
        </div>

    </body>
</html>