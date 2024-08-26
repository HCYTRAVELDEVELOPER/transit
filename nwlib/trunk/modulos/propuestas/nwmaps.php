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
        <?php echo $plan["nombre"] ?>
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
        <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwmaps_banner.png" style="width: 900px!important;" />
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center">
        <p>Reciba un  Cordial Saludo:</p>
        <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial <strong><?php echo $plan["nombre"] ?></strong>. 
            No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
        <div class="bloque1">
            <h1>
                <?php echo $plan["nombre"] ?>
            </h1>
            <p>NwMaps es una forma muy profesional e interactiva de crear mapas virtuales. 
                Con la tecnología más accesible para navegar desde cualquier dispositivo (smartphone, tablets, pc, notebooks, etc), 
                da la posibilidad de crear un mapa virtual propio, ubicando sitios de interés dentro de los planos o mapas que pueden ser cargados en cualquier orden. 
                Cada ubicación dentro del mapa da la opción de generar una visita virtual 360°. Con esta opción se da la facilidad al usuario de realizar recorridos 
                virtuales dentro de una zona, facultad, centro comercial, barrio o cualquier mapa que se quiera mostrar. También dentro de los recorridos virtuales en 360° 
                se pueden crear ubicaciones o puntos de acceso, dando la opción al usuario de poder interactuar con el recorrido tocando objetos o puntos señalados donde 
                mostrarán galería de imágenes del punto u objeto, información y enlaces de interés.</p>
            <p style="text-align: center;" >
                <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps2.png" style="height:500px;">
            </p>
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center">
        <h1>Crear mapas o planos propios</h1>
        <p>Con NwMaps puede subir sus propios planos, creando de esta manera mapas ilimitados.</p>
        <p style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps4.png" style="height:400px;">
        </p>
    </div>
    <div class="bloques_text_center">
        <h1>Creación y ubicación de sitios en mapas</h1>
        <p>Ubicando sitios de interés dentro de los planos o mapas que pueden ser cargados en cualquier orden puede dar una mejor guía y visita virtual a su mapa.</p>
        <p style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps5.png" style="height:500px;">
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
    <div class="bloques_text_center">
        <h1>Recorridos Virtuales 360°</h1>
        <p>Cada ubicación dentro del mapa da la opción de generar una visita virtual 360°. Con esta opción se da la facilidad al usuario de realizar recorridos 
            virtuales dentro de una zona, facultad, centro comercial, barrio o cualquier mapa que se quiera mostrar</p>
        <p style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps6.png" style="height:400px;">
        </p>
    </div>
    <div class="bloques_text_center">
        <h1>Ubicación de objetos en recorridos 360°</h1>
        <p>Dentro de los recorridos virtuales en 360° 
            se pueden crear ubicaciones o puntos de acceso, dando la opción al usuario de poder interactuar con el recorrido tocando objetos o puntos señalados donde 
            mostrarán galería de imágenes del punto u objeto, información y enlaces de interés.</p>
        <p style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps7.jpg" style="height:400px;">
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
    <div class="bloques_text_center" style="display: none;">
        <h1>Búsqueda de sitios fácil</h1>
        <p>La búsqueda de los sitios facilita mucho al usuario para poder encontrar un lugar dentro del mapa. El resultado de la búsqueda se da exactamente en el punto del lugar, 
            mostrando en la parte izquierda el listado de los resultados.</p>
        <p style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps8.png" style="height:400px;">
        </p>
    </div>
    <div class="bloques_text_center">
        <h1>Compatible con dispositivos móviles</h1>
        <p>NwMaps es compatible con cualquier dispositivo móvil, ya sea un SmartPhone, tablet, iPhone, iPad, Blackberry o Windows Mobile. Su navegación se puede hacer mediante el navegador del dispositivo
            o descargando la aplicación en la tienda de aplicaciones del dispositivo.</p>
        <div class="img_moviles" style="text-align: center;">
            <img alt="" src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/includes/phpthumb/phpThumb.php?src=<?php echo $ruta_dosc ?>propuestas/imagenes/nwmaps12.png&w=400">
            <img alt="" src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/includes/phpthumb/phpThumb.php?src=<?php echo $ruta_dosc ?>propuestas/imagenes/nwmaps13.png&w=400">
            <img alt="" src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/includes/phpthumb/phpThumb.php?src=<?php echo $ruta_dosc ?>propuestas/imagenes/nwmaps14.png&w=400">
            <img alt="" src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/includes/phpthumb/phpThumb.php?src=<?php echo $ruta_dosc ?>propuestas/imagenes/nwmaps15.png&w=400">
<!--            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps13.png">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps14.png">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwmaps15.png">-->
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
//global $id_propuesta;
//$dbdb = NWDatabase::database();
//$cb = new NWDbQuery($dbdb);
//$wheree .= " where id_propuesta=:id_propuesta";
//$sqla = "select * FROM propuestas_hojas " . $wheree . " order by id asc";
//$cb->prepare($sqla);
//$cb->bindValue(":id_propuesta", $id_propuesta);
//if (!$cb->exec()) {
//    echo "No se pudo realizar la consulta. ";
//    return;
//}
//if ($cb->size() == 0) {
//    echo "";
//}
//for ($ii = 0; $ii < $cb->size(); $ii++) {
//    $cb->next();
//    $rr = $cb->assoc();
//   echo $abre_contenedor1;
//    encabezado();
//    echo "<div id='contenedor2'>";
//    echo "<div class='bloques_text_center'>";
//    echo "<div class='bloques_textos'>";
//    echo $rr["texto"];
//    echo "</div>";
//    echo "</div>";
//    echo "</div>";
//    echo $cierra_contenedor1;
//}
?>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center">
        <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
        <p><img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/logos_clientes.png" /></p>
        <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
            <a href="https://www.gruponw.com/clientes" style="color: blue;">https://www.gruponw.com/clientes</a>
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
        <div class="bloques_textos ">
            <h1>
                NETWOODS, ESPECIALISTAS EN SOFTWARE Y DISEÑO WEB
            </h1>
            <p>
                Nos  especializamos por crear páginas web y software de muy alta calidad,  
                conservando unos estrictos parámetros de diseño para la comodidad de todos  nuestros clientes. 
                Nuestra meta es la absoluta satisfacción de nuestros  usuarios en cualquiera de nuestras líneas de productos. 
                Contamos con personal  altamente calificado, quienes no son sólo programadores; 
                también poseen formas  de ver el diseño de software como un arte.  
            </p>
            <h4>Nuestros productos son totalmente artesanales, hechos  pieza a pieza sin repeticiones. </h4>
        </div>

        <p>Soporte técnico línea telefónica  <strong>(57)(1) 7022562 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
            Horario extendido soporte técnico cel <strong>3125734295 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
            <a href="http://www.netwoods.net">www.netwoods.net</a>.</p>
        <div class="bloques_textos ">
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

