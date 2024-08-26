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
        <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwlearning_1.png" style="width: auto!important;" />
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
            <p>NwLearning es una aplicacion web para la creación de manuales de procedimientos. Permite el aprendizaje de sus procesos de forma fácil y dinámica.
                Nwlearning permite la creación de categorías, subcategorías y el manual final, donde puede subir una imagen y sobre esta ubicar su texto, imágenes, multimedia. La aplicación dispone de animación 
                para la ubicación de sus indicaciones, realizando de forma simultánea la conversión del texto a voz. 
            </p>
            <p>
                <b>Objetivos:</b> <br />
                -Usar servicios autoguiados didácticos, fáciles de manejar<br />
                -Ensamblar y entregar el contenido de aprendizaje rápidamente<br />
                -Centralizar y automatizar la gestión del aprendizaje<br />
                -Consolidar los procesos de formación en una plataforma basada en la web<br />
                -Realizar el mejoramiento contínuo de los sistemas de aprendizaje<br />
                -Personalizar el contenido y permitir la reutilización del conocimiento<br />
            </p>
            <p style="text-align: center;" >
                <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwlearning_2.png" style="height:500px;" >
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
$sqla = "select * FROM propuestas_hojas " . $wheree . " order by id asc";
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
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center">
        <h1>Plataforma de Administración</h1>
        <ul>
            <li>
                En la plataforma podrá administrar usuarios, perfiles, contenidos y demás configuraciones para la aplicación.
            </li>
            <li>
                Puede guardar sus imágenes y crear una biblioteca propia, que podrá usar en posteriores manuales.
            </li>
            <li>
                Esta plataforma funciona en cualquier navegador (IE, chrome, firefox, safari, etc), incluso en cualquier sistema operativo (mac, linux, windows). Solo necesita tener
                conexión a internet para poder crear sus manuales. No será necesario instalar una aplicación o plugin adicional.
            </li>
        </ul>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwlearning_3.png" style="width: 1000px;">
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
        <h1>Manuales Interactivos</h1>
        <ul>
            <li>
                Seguimiento de avances, evaluaciones, tiempos de capacitación y puntajes
            </li>
            <li>
                El manual de usuario final ofrece todo tipo de herramientas para agilizar, comprender e interactuar con el manual.
            </li>
            <li>
                Tiene la opción de crear manuales privados, para que por medio de un usuario o contraseña lo puedan revisar, si el manual es público podrá verlo cualquier usuario
                las veces que quiera. 
            </li>
            <li>
                Nunca estará fuera de línea.
            </li>
            <li>
                El sistema de <b>conversión de texto a voz</b> se hace simultaneamente con la indicación dentro del manual, creando una especie de guía o robot indicador.
            </li>
            </p>
        </ul>
        <div style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes//nwlearning_4.png" style="float: none; width: 1000px;">
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
    <div class="bloques_text_center">
        <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
        <p style="text-align: center;"><img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/logos_clientes.png" /></p>
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
            <!--<span>Fecha de Impresión: <?php echo "$dia[$numdia], $diames de $mes[$nummes] del $anho  "; ?></span>-->
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->

