<?php
$abre_contenedor1 = "<div id='contenedor1'>";
$cierra_contenedor1 = "</div>";
if (($pdf_impr == "pdf")) {
    $abre_contenedor1 = "";
    $cierra_contenedor1 = "";
}
?>

<?php echo $abre_contenedor1 ?>
<?php
encabezado_principal();
?>
<div id="contenedor2">

    <h1 class="title1">
        <?php echo $r["titulo"] ?>
        <p>
            PROPUESTA TÉCNICA Y ECONÓMICA 
        </p>
    </h1>

    <p style="color: #555;margin: 0;font-size: 14px;">
        <strong>Bogotá D.C.</strong><br />
    </p>
    <br />
    <h2 style="color: #555;">
        Señores: <?php echo $prd["nombre"] ?>
        <br />
        At: <?php echo $prd["nombre_contacto"] ?>

    </h2>
    <div class="img1">
        <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/ban_app_hibrida.png" style="width: auto!important;" />
    </div>
</div>
<?php echo $cierra_contenedor1 ?>

<!--AGREGAR ÍNDICE-->
<script>
    $(window).load(function () {
        indice("software", <?php echo $id_propuesta; ?>);
    });
</script>
<div id="contenedor1" class="indiceMain">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div id="loadIndice"></div>
        <div id="menuIndiceTop"></div>
    </div>
</div>
<!--FIN AGREGAR ÍNDICE-->

<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center"  id="descripcion_general">
        <p>Reciba un  Cordial Saludo:</p>
        <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial <strong><?php echo $r["titulo"] ?></strong>. 
            No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
        <div class="bloque1">
            <p>
                <?php echo $r["descripcion_general"] ?>
            </p>
            <h1>
                <?php echo $r["titulo"] ?>
            </h1>
            <p>Una aplicación móvil para teléfonos inteligentes (smartphone) es una excelente forma de agilizar sus procesos, tener disponibilidad de su software móvil en cualquier momento y cualquier lugar
                al mismo tiempo de tener presencia en un sistema operativo móvil. <br />
                Con la tecnología más accesible para navegar desde cualquier dispositivo (smartphone, tablets, pc, notebooks, etc), nuestras aplicaciones móviles híbridas
                dan la posibilidad de poder ejecutarlas en cualquier teléfono inteligente (android, iPhone, blackberry, windows Mobile). <br />
                Las aplicaciones híbridas tienen lo mejor de las aplicaciones nativas y las aplicaciones móviles. Este tipo de aplicaciones 
                permite el uso de tecnologías multiplataforma como HTML, 
                Javascript y CSS pero permiten acceder a los dispositivos y sensores del teléfono. 
                Buena parte de la infraestructura es tipo web y la comunicación con los elementos del teléfono se hace mediante comunicadores propios del lenguaje nativo del dispositivo.<br />
                Un buen ejemplo de aplicaciones híbridas es Facebook. 
                Se descarga de la tienda (google play, app store, etc) y cuenta con todas las características de una aplicación nativa pero requiere ser actualizada ocasionalmente.
            </p>
            <p style="text-align: center;" >
                <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//ban_app_hibrida_3.png" style="height:500px;">
            </p>
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>

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
    echo "<div class='bloques_text_center' id='modulos'>";
//    echo "<h1>Módulos</h1>";
    echo "<div class='bloques_textos'>";
    echo $rr["texto"];
    echo "</div>";
    echo "</div>";
    echo "</div>";
    echo $cierra_contenedor1;
}
?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center" id="bases_datos">
        <div class="bloques_textos bloque_img_right">
            <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/app/uno.png" height="600px" />
            <h1>
                TOTAL OPERATIVIDAD
            </h1>
            <p>
                Nuestas aplicaciones híbridas manejan la funcionalidad y programación de una app nativa y programación web en HTML5 y CSS3.
            </p>
            <ul>
                <li>
                    Excelente visualización
                </li>
                <li>
                    Adaptado para cualquier resolución
                </li>
            </ul>
        </div>
        <div class="bloques_textos bloque_img_left" style="margin-top: -300px;">
            <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/app/dos.png" height="600px" />
            <div style="margin-top: 320px;">
                <h1>
                    NOTIFICACIONES Y ALERTAS
                </h1>
                <p>
                    La aplicación podrá disfrutar de los componentes del smartPhone donde esté instalada. Podrá usar:
                </p>
                <ul style="float: right;">
                    <li>
                        Notificaciones
                    </li>
                    <li>
                        Cámara
                    </li>
                    <li>
                        GPS
                    </li>
                    <li>
                        Mapas
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center" id="tecnicos">
        <div class="bloques_textos bloque_img_right">
            <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/app/tres.png" height="600px" />
            <h1>
                ACTUALIZACIONES
            </h1>
            <p>
                Las actualizaciones de la aplicación se pueden realizar de forma transparente para el usuario, generando de esta forma
                la no descarga o actualización de la aplicación desde la tienda de aplicaciones.
                <br />
                Sólo será necesario la actualización desde la tienda de aplicaciones cuando se realice un cambio en estructura desde el código
                del lenguaje nativo del dispositivo.
            </p>
        </div>
        <div class="bloques_textos bloque_img_left" style="margin-top: -300px;">
            <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/app/cuatro.png" height="600px" />
            <div style="margin-top: 320px;">
                <h1>
                    ADMINISTRACIÓN
                </h1>
                <p>
                    La aplicación será administrada desde la plataforma administrativa donde podrá:
                </p>
                <ul style="float: right;">
                    <li>
                        Generar notificaciones
                    </li>
                    <li>
                        Cambiar información
                    </li>
                    <li>
                        Crear configuraciones
                    </li>
                    <li>
                        Crear reportes
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center" id="escencials">
        <h1>Plataforma de Administración</h1>
        <p>En la plataforma podrá administrar usuarios, perfiles, contenidos y demás configuraciones para la aplicación.</p>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/app/dashboard.png" style="width:800px">
        </p>
    </div>
    <div class="bloques_text_center">
        <h1>Reportes Estadísticas</h1>
        <p>
            Podrá generar estadísticas de uso, y también las que se generen a la medida.
        </p>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/app/estadistica.png" style="width:800px">
        </p>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center" id="clientes">
        <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
        <p style="text-align: center;"><img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/logos_clientes.png" /></p>
        <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
            <a hrehref="http://www.netwoods.net/paginas-web-software/clientes-5" >http://www.netwoods.net/paginas-web-software/clientes-5 </a>
        </p>
        <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center">
        <?php
        include "foot_prices.php";
        ?>
        <p>Soporte técnico línea telefónica  <strong>(57)(1) 7022562 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
            Horario extendido soporte técnico cel <strong>3125734295 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
            <a href="http://www.netwoods.net">www.netwoods.net</a>.</p>
        <div class="bloques_textos " id="contacto">
            <p>Visite  nuestra página Web para enterarse de otras características que tienen nuestros  productos.<br />
                <a href="http://<?php echo $emp["web"]; ?>" target="_blank">
                    <?php echo $emp["web"]; ?>
                </a>
            </p>
            <br />
            <p>Cordialmente, </p>
            <br />
            <?php
            $query = pg_exec("select a.id, a.usuario, b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
                        where a.id =" . $_GET["id"]);
            $user = pg_fetch_array($query);
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
            <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->

