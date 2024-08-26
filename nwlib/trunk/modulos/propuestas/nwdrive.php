<?php
$abre_contenedor1 = "<div id='contenedor1'>";
$cierra_contenedor1 = "</div>";
if (($pdf_impr == "pdf")) {
    $abre_contenedor1 = "";
    $cierra_contenedor1 = "";
}
echo $abre_contenedor1;

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
        <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/banne1.png" style="width: auto!important;" />
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
            <p>
                Nw Drive es una aplicación web para el almacenamiento y la administración de documentos en la nube. Permite subir archivos de forma ilimitada,
                mostrando en una interfaz gráfica amigable sus archivos, organizados como a usted le convenga. Permite tener la funcionalidad de los aplicativos de 
                escritorio actuales, sin instalaciones adicionales. Con abrir la página web con su usuario y contraseña, podrá administrar los archivos.
            </p>
            <p>
                Ventajas:
            <ul>
                <li>
                    1. No necesita instalaciones
                </li>
                <li>
                    2. No requiere mantenimiento
                </li>
                <li>
                    3. Puede abrir sus archivos desde cualquier parte del mundo
                </li>
                <li>
                    4. No necesita tener almacenamiento propio
                </li>
                <li>
                    5. No debe preocuparse por los backups de información
                </li>
                <li>
                    6. Puede administrar los permisos de sus archivos para que sean leidos o descargados
                </li>
                <li>
                    7. Puede administrar quien puede borrar los archivos
                </li>
                <li>
                    8. Log de movimientos: podrá saber con exactitud quién manipuló sus documentos
                </li>
                <li>
                    9. Se pueden subir muchos doucmentos al mismo tiempo
                </li>
                <li>
                    10. Puede manipular sus carpetas como prefiera
                </li>
            </ul>
            </p>
            <p style="text-align: center;" >
                <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/window1.jpg" style="height:500px;" >
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
        <h1>Multi Ventanas</h1>
        <p>
            Podrá seguir trabajando en otras cosas minimizando la ventana. Compatible con todos los navegadores y tablets del mercado. Puede abrir varias 
            ventanas para administrar diferentes carpetas.
        </p>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/window_multi.jpg" style="width: 700px;">
        </p>
        <h1>Compartir Carpetas y Archivos</h1>
        <p>
            Podrá decidir que carpetas comparte al público o a usuarios específicos. De esta forma tiene la funcionalidad de los actuales sistemas pero en la nube.
        </p>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/compartidos.jpg" style="width: 700px;">
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
        <h1>Administración de Carpetas</h1>
        <p>
            Podrá nombrar sus carpetas de la manera que más le convenga. Se pueden organizar carpetas por empresas, por años, por meses o por tipos de documentos. 
            Así mismo podrá limitar el espacio máximo de espacio.
        </p>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/carpet.jpg" style="width: 700px;">
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
        <h1>Menú Contextual (opciones)</h1>
        <p>
            Al igual que los sistemas actuales, podrá realizar los siguientes procedimientos sobre sus carpetas y archivos:
        <ul>
            <li>
                -Abrir
            </li>
            <li>
                -Abrir en nueva ventana
            </li>
            <li>
                -Nueva carpeta
            </li>
            <li>
                -Compartir una carpeta
            </li>
            <li>
                -Agregar marcadores (favoritos) a las carpetas
            </li>
            <li>
                -Renombrar carpetas
            </li>
            <li>
                -Descargar una carpeta completa
            </li>
            <li>
                -Eliminar
            </li>
        </ul>
        </p>
        <div style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/windowsMenuContext.jpg" style="float: none; width: 700px;">
        </div>
    </div>
    <div class="bloques_text_center">
        <h1>Subir Archivos</h1>
        <p>
            Podrá subir cientos de archivos al mismo tiempo, ubicarlos en la carpeta elegida y listo. Con esto es fácil la administración de archivos en línea. 
            Podrá cancelar dicho proceso en cualquier momento.
        </p>
        <div style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/nwdrive/upload.jpg" style="float: none; width: 700px;">
        </div>
        <h1>Permisos</h1>
        <p>
            Podrá definir quiénes pueden descargra sus archivos, quienes pueden verlos y quien puede eliminarlos. Conservará un registro de todos los movimientos
            sobre sus carpetas.
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
            <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
        </div>
    </div>
</div>
<?php echo $cierra_contenedor1 ?>
<!-- FIN DE UNA PÁGINA -->

