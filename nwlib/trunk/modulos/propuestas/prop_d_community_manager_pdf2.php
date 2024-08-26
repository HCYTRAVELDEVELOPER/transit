<?php
$abre_contenedor1 = "<div id='contenedor1'>";
$cierra_contenedor1 = "</div>";
if (($pdf_impr == "pdf")) {
    $abre_contenedor1 = "";
    $cierra_contenedor1 = "";
}
global $id_propuesta;
encabezado_principal();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Propuesta N° <?php echo $_GET["id"] ?> <?php echo $prd["nombre"]; ?> <?php echo $plan["nombre"]; ?> <?php echo $fecha_final ?></title>
        <link rel="stylesheet" type="text/css" href="propuestas/css/estilos.css" />
    </head>

    <body>
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>
                    <?php echo $fecha_final ?>
                </p>
                <strong>Propuesta N°  <?php echo $_GET["id"] ?> </strong>
            </div>
            <div id="contenedor2">
                <h1 class="title1">
                    PROPUESTA TÉCNICA Y ECONÓMICA <?php echo $plan["nombre"] ?>
                </h1>
                <p style="color: #555;margin: 0;font-size: 14px;">
                    <strong>Bogotá D.C.</strong><br />
                    <strong>Fecha: <?php echo $fecha_final ?></strong>
                </p>
                <h2 style="color: #555;">
                    Señores: <?php echo $prd["nombre"] ?>
                    <br />
                    At: <?php echo $prd["nombre_contacto"] ?>

                </h2>
                <div class="img1">
                    <img src="http://www.netwoods.net/imagenes/propuestas/img_inicial_pla_community_manager.jpg" />
                </div>
                <div class="logo_home">
                    <img src="<?php echo $emp["logo"] ?>" />
                    <h2>2015</h2>
                </div>
            </div>
        </div>
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>
                    <?php echo $fecha_final ?>
                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <h1 class="title2">
                    NETWOODS COLOMBIA 
                </h1>
                <div class="bloques_text_center">
                    <p>&nbsp;</p>
                    <p>Reciba un  Cordial Saludo<strong>:</strong>                  </p>
                    <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial  para la  implementación de estrategias para posicionar su marca en las redes sociales  (<strong><?php echo $plan["nombre"] ?></strong>). No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
                    <p>&nbsp;</p>
                    <p>
                        <h1 class="title3">COMMUNITY MANAGER</h1>
                        <p><br clear="all" />
                            <br />
                            Conocedora de la necesidad de diseñar e implementar  una estrategia de presencia Social Media, la Dirección de  Netwoods Colombia,  se plantea externalizar el servicio de  atención a su comunidad On line, para conseguir los resultados esperados. Los  medios sociales han adquirido una importancia relevante para la comunicación de  las marcas con sus públicos. El rendimiento de su marca será mayor introducida  apropiadamente en los medios sociales y desarrollando una actividad coherente  en ellos. La generación de contenidos, de perfiles en redes sociales, la participación  de terceros en la comunicación, la presencia en foros y en blogs permite un  posicionamiento natural de la web, la prevención de posibles críticas negativas  y la potenciación de los comentarios positivos sobre nuestra marca y/o producto. </p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <h1>Propósito  del  proyecto</h1>
                        <P>Contribuir  a una imagen y reputación positivas de su marca en Internet y aprovechar los  medios y redes sociales como canal de comunicación, contribuyendo a su vez al  retorno en visitas y ventas, dando continuidad al Plan Social Media de Netwoods  Colombia.</P>
                        <p>&nbsp;</p>
                </div>
            </div>
        </div>
        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>
                    <?php echo $fecha_final ?>
                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <h1 class="title3">
                    PROPUESTA TÉCNICA
                </h1>
                <div class="bloques_text_center">
                    <p><H1>TWITTER</H1>
                        <H1>&nbsp;</H1>
                        <p><strong>Acciones permanentes y  puntuales (Twitter)</strong></p>
                        <ol>
                            <li>Captar  nuevos seguidores (followers)</li>
                            <li>Publicar  tweets según campaña, concurso y/o sorteo</li>
                            <li>Publicar  tweets de contenido propio y/o de otros</li>
                            <li>Responder  a menciones</li>
                            <li>Programación de  contenido </li>
                            <li>Integrar  con Facebook para mayor interacción<strong></strong></li>
                        </ol>
                        <p>&nbsp;</p>
                        <p><strong>Objetivos  cualitativos (Twitter)</strong></p>
                        <p>Mantener una presencia en twitter, transmitiendo  información, estableciendo conversaciones con clientes y usuarios, mantener  nuestra reputación y persuadir para obtener una acción por parte de la  comunidad de followers en.</p>
                        <p><strong>&nbsp;</strong></p>
                        <p><strong>Objetivos  cuantitativos (Twitter)</strong></p>
                        <p>Generación de tráfico  para  incrementar el número de contactos o de clientes, y así contribuir a incrementar  las ventas.</p>
                        <p>&nbsp;</p>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->
        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>
                    <?php echo $fecha_final ?>
                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <div class="bloques_text_center">
                    <p><H1>FACEBOOK</H1><br />
                        <p><strong>Acciones  permanentes y puntuales (Facebook)</strong></p>
                        <ol>
                            <li>Publicar  comentarios  3 veces a la semana  (recomendado) según campaña, concurso y/o sorteo.</li>
                            <li>Publicar  comentarios de contenido propio o de terceros.</li>
                            <li>Publicar  preguntas y sondeos para captar la atención de los Fans.</li>
                            <li>Gestionar  comentarios de los seguidores.</li>
                            <li>Trasladar  a atención al cliente (correo electrónico) las incidencias, dudas o preguntas  de usuarios o clientes, realizadas en Facebook para ser respondidas en la misma  plataforma.</li>
                            <li>Programación  de contenido.</li>
                            <li>Rediseño  de la portada, combinar la foto del perfil con la portada.</li>
                            <li>Informes  de estadística.</li>
                            <li>Implementación  de Facebook Ads para aumentar Fans y generar mas trafico.</li>
                            <li>Rediseño  e inserción de HTML estático de Bienvenida.</li>
                            <li>Implementación  de aplicaciones </li>
                            <li>Integrar  con YouTube para mayor interacción</li>
                        </ol>
                        <p>&nbsp;</p>
                        <p><strong>Objetivos  cualitativos (Facebook)</strong></p>
                        <p>Mantener una presencia coherente en Facebook,  transmitiendo información, estableciendo conversaciones con clientes y usuarios  y obteniendo feedback; contribuir al mantenimiento y mejora de la reputación de  la marca en Facebook y persuadir para obtener una acción por parte de la  comunidad de Fans de la Fanpage.                  </p>
                        <p><strong>Objetivos  cuantitativos (Facebook)</strong></p>
                        <p>Contribuir a la generación de tráfico para incrementar el número de contactos o de  clientes, y así contribuir a incrementar las ventas.</p>
                        <p>&nbsp;</p>
                        <h1>Informes y Detalles</h1>
                        <ul>
                            <li>Acordaremos  una reunión semanal o mensual según lo conveniente, donde informaremos el  estado y estadísticas de la campaña en Facebook Ads.</li>
                            <li>Enviaremos  reportes semanales del movimiento del público en Facebook.</li>
                        </ul>
                        <p>&nbsp;</p>
                        <h1>&nbsp;</h1>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->
        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>
                    <?php echo $fecha_final ?>
                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <div class="bloques_text_center">
                    <p><H1>YOUTUBE</H1><br />
                        <p><strong>Acciones  permanentes y puntuales (Youtube)</strong></p>
                        <ol>
                            <li>Publicar  videos según material disponible.</li>
                            <li>Viralizar los videos.</li>
                            <li>Gestionar  comentarios.</li>
                            <li>Gestionar mensajes internos.</li>
                            <li>Programación  de contenido.</li>
                            <li>Rediseño  de la portada.</li>
                            <li>Informes  de estadística.</li>
                            <li>Integrar  con redes sociales</li>
                        </ol>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->
        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>                    <?php echo $fecha_final ?>                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <div class="bloques_text_center">
                    <h1>&nbsp;</h1>
                    <h1>Informes</h1>
                    <ul>
                        <li>Informes semanales y/o mensuales de la actividad de los usuarios en las diferentes plataformas.</li>
                    </ul>
                    <ul>
                        <li>Envío de informes en PDF, con gráficos.</li>
                    </ul>
                    <p>&nbsp;</p>
                    <h1>Soporte</h1>
                    <p>En todo momento tendrá una persona a cargo de sus redes sociales 7/24, sin embargo en caso de ser necesario tendrá soporte adicional.</p>
                    <ul>
                        <li>Soporte y monitoreo de funcionalidad y  estabilidad de contenidos<strong> permanentemente</strong>.</li>
                        <li>Por medio de nuestra página web <a href="http://www.netwoods.net">www.netwoods.net</a> en el chat en línea o soporte en línea.</li>
                        <li>Escribiéndonos al correo <a href="mailto:nwstudios@netwoods.net">nwstudios@netwoods.net</a>.</li>
                        <li>Soporte telefónico.</li>
                        <li>En caso de requerir aplicaciones, será enviada una propuesta formal del servicio.</li>
                    </ul>
                    <p>&nbsp;</p>
                    <h1>Relación, empresa - Netwoods - cliente</h1>
                    <p>Es necesario acordar citas semanales y/o mensuales, ya sea personalmente en sus instalaciones o vía Skype, para solicitar información de noticias, novedades o promociones a destacar en el mes.</p>
                    <p>Con esto generamos temas semanales acordes a su actividad.</p>
                    <p>&nbsp;</p>
                    <h1 class="title3">REQUERIMIENTOS A RECIBIR POR PARTE DEL  CLIENTE</h1>
                    <ul type="disc">
                        <li>Información completa sobre la empresa.</li>
                        <li>Imágenes, fichas técnicas de los productos y/o servicios.</li>
                    </ul>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->

        <!-- INICIO DE UNA PÁGINA -->
        <?php
        global $id_propuesta;
        $dbdb = NWDatabase::database();
        $cb = new NWDbQuery($dbdb);
        $wheree = " where id_propuesta=:id_propuesta";
        $sqla = "select * FROM propuestas_hojas " . $wheree . " order by orden asc";
        $cb->prepare($sqla);
        $cb->bindValue(":id_propuesta", $id_propuesta);
        if (!$cb->exec()) {
            echo "No se pudo realizar la consulta. ";
            return;
        }
        if ($cb->size() == 0) {
            echo "";
        }
        for ($ii = 0; $ii < $cb->size(); $ii++) {
            $cb->next();
            $rr = $cb->assoc();
            echo $abre_contenedor1;
            encabezado();
            echo "<div id='contenedor2'>";
            echo "<div class='bloques_text_center'>";
            echo "<div class='bloques_textos'>";
            echo $rr["texto"];
            echo "</div>";
            echo "</div>";
            echo "</div>";
            echo $cierra_contenedor1;
        }
        ?>
        <?php
global $id_propuesta;
$dbdb = NWDatabase::database();
$cb = new NWDbQuery($dbdb);
$wheree = " where id=:id_propuesta";
$sqla = "select *,func_concepto(producto,'productos') as nom_producto FROM propuestas" . $wheree . " order by id asc";
$cb->prepare($sqla);
$cb->bindValue(":id_propuesta", $id_propuesta);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta. ";
    return;
}
if ($cb->size() == 0) {
    echo "";
}
$propuesta = $cb->flush();
if (isset($propuesta["tarifa"]) && $propuesta["tarifa"] != "") {
    $wheree = " where id_enc=:id_propuesta";
    $sqla = "select * FROM tarifas_propuestas_det" . $wheree . " order by id asc";
    $cb->prepare($sqla);
    $cb->bindValue(":id_propuesta", $id_propuesta);
    if (!$cb->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    $tarifas = $cb->assocAll();
    if (count($tarifas) > 0) {
        echo $abre_contenedor1;
        encabezado();
        echo "<div id='contenedor2'>";
        echo "<div class='bloques_text_center'>";
        echo "<div class='bloques_textos'>";
        echo '<div style="width: 800px;margin: auto;"><p style="text-align: center;">&nbsp;</p>';
        echo '<p style="text-align: center;"><strong>Paquete de Servicios</strong></p>';
        echo '<p style="text-align: center;">&nbsp;</p>';
        echo '<table cellspacing="10" class="tablePrecios" style="height:1px;width:800px;">';
        echo '<tbody><tr><th rowspan="' . count($tarifas) + 1 . '"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;</span></th>';
        echo '<th style="width: 80px;"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;&nbsp;</span></th>';
        echo '<th><span style="color:#000000;">% de Ahorro</span></th>';
        echo '<th style="width: 600px;"><span style="color:#000000;">Valor Unidad </span></th></tr>';
        for ($i = 0; $i < count($tarifas); $i++) {
            echo '<tr><td style="text-align: center; width: 400px;">' . $tarifas[$i]["rango_inicial"] . '- ' . $tarifas[$i]["rango_final"] . '</td>
			<td style="text-align: center;">0%</td>
			<td style="text-align: center;">$ 2.039 COP</td></tr>';
        }
        echo '</tbody></table><p>&nbsp;</p>';
        echo "</div>";
        echo "</div>";
        echo "</div>";
        echo $cierra_contenedor1;
    }
}
?>
        <!-- FIN DE UNA PÁGINA -->

        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>                    <?php echo $fecha_final ?>                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <div class="bloques_text_center">
                    <h1 class="title3">ALGUNOS DE NUESTROS CLIENTES</h1>
                    <p><img src="http://www.netwoods.net/imagenes/clientes_prop.jpg" /></p>
                    <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
                        <a href="https://www.gruponw.com/clientes" style="color: blue;" target="_blank">https://www.gruponw.com/clientes</a>
                    </p>
                    <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
                    <p>&nbsp;</p>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->

        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>                    <?php echo $fecha_final ?>                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <div class="bloques_text_center">
                    <?php
                    include "foot_prices.php";
                    ?>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->


        <!-- INICIO DE UNA PÁGINA -->
        <div id="contenedor1">
            <div class="cabezote">
                <img src="<?php echo $emp["logo"] ?>" />
                <p>                    <?php echo $fecha_final ?>                </p>
                <strong>Propuesta No. <?php echo $_GET["id"] ?></strong>
            </div>
            <div id="contenedor2">
                <div class="bloques_text_center">
                    <h1<p>SOPORTE</h1>
                    <p>Por cualquier soporte respecto a su relación con nosotros Ud. puede siempre  contactarnos usando la siguiente información.<br />
                    </p>
                    <table align="center" class="table_1">
                        <tr>
                            <td width="406" valign="top"><br />
                                <strong><em>Soporte    técnico</em></strong><strong>:</strong><br />
                                URL soporte técnico: <a href="http://www.netwoods.net/livezilla/chat.php">http://www.netwoods.net/livezilla/chat.php</a><br />
                                Netwoods.net<br />
                                Phone. 57 1 681 7688<br />
                                Mobile. 57 3124379339<br />
                                Email. nwstudios@netwoods.net </td>
                            <td width="266" valign="top"><p><strong><em>Servicio al    cliente y contacto de desarrollo</em></strong><strong>:</strong><br />
                                    LIBIA RINCÓN <br />
                                    Netwoods.net<br />
                                    Phone. 57 1 681 7688<br />
                                    Email. coordinacionventas@netwoods.net</p></td>
                        </tr>
                        <tr>
                            <td width="266" valign="top">
                                <p><strong><em>Contacto de    Facturación</em></strong><strong>:</strong><br />
                                    OLGA LUCÍA RICO<strong></strong><br />
                                    Netwoods.net<br />
                                    Phone. 57 1 681 7688<br />
                                    Email. facturacion@netwoods.net<br />
                                    Bogotá, Colombia<strong></strong></p></td>
                        </tr>
                    </table>
                    <p>Soporte técnico línea telefónica  <strong>(57)(1) 7022562 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
                        Horario extendido soporte técnico cel <strong>3125734295 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
                        <a href="http://www.netwoods.net">www.netwoods.net</a>.</p>
                    <p><strong>&nbsp;</strong></p>
                    <p>Visite  nuestra página Web para enterarse de otras características que tienen nuestros  productos.<br />
                        <a href="http://<?php echo $emp["web"]; ?>" target="_blank">
                            <?php echo $emp["web"]; ?>
                        </a>
                    </p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>Cordialmente, </p>
                    <br />
                    <?php
                    $query = pg_exec("select a.id, a.usuario,b.firma, b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
                        where a.id =" . $_GET["id"]);
                    $user = pg_fetch_array($query);
                    if (isset($user["firma"])) {
                        if ($user["firma"] != "") {
                            echo "<strong><img src='http://www.netwoods.net" . $user["firma"] . "' width='150' /></strong><br />";
                        }
                    }
                    echo "<strong>" . $user["nombre"] . "</strong><br />";
                    echo "<strong>" . $user["cargo"] . "</strong><br />";
                    echo "<span>E-mail: " . $user["email"] . "</span><br />";
                    echo "<span>Móvil: " . $user["celular"] . "</span><br />";
                    ?>
                    <span>
                        Teléfono: <?php echo $emp["telefono"]; ?>
                    </span>
                    <br />
                    <span>
                        <a href="http://<?php echo $emp["web"]; ?>" target="_blank">
                            <?php echo $emp["web"]; ?>
                        </a>
                    </span>
                    <br />
                    <strong>
                        <?php echo $emp["razon_social"]; ?>
                    </strong><br />
                    <span>Fecha de Creación: <?php echo $fecha_final ?></span>
                    <br />
                    <?php
                    $nummes = $nummes - 1;
                    ?>
                    <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
                </div>
            </div>
        </div>
        <!-- FIN DE UNA PÁGINA -->
    </body>
</html>
