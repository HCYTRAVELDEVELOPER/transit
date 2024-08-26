<div id="contenedor1">
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
        <br />
        <br />
        <p style="color: #555;margin: 0;font-size: 14px;">
            <strong>Bogotá D.C.</strong><br />
        </p>
        <br />
        <h2 style="color: #555;">
            Señores: <?php echo $prd["nombre"] ?>
            <br />
            At: <?php echo $prd["nombre_contacto"] ?>

        </h2>
        <br /><br /><br /><br />
        <div class="img1">
            <img src="http://www.netwoods.net/imagenes//revista_netwoods.jpg" />
        </div>
    </div>
</div>
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <p>Reciba un  Cordial Saludo:</p>
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial <strong> <?php echo $plan["nombre"] ?></strong>. 
                No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
            <h1>CARACTERÍSTICAS</h1>
            <h2>
                <p>
                    <span style="font-family: Arial, Helvetica, sans-serif; "><span style="color:#800000;">Revista Digital NW,</span> <span style="color:#696969;">otra forma de mostrar sus productos</span></span></h2>
            <span style="font-family: Arial, Helvetica, sans-serif; ">Una&nbsp;<strong>revista digital</strong>&nbsp;es una forma profesional y llamativa de dar a conocer un contenido. 
                Con la tecnología cada vez más accesible para la mayoría de los usuarios, hoy día tener una revista no es privilegio de unos pocos y ya sólo es cuestión de tener ganas e ideas para que cualquiera pueda
                llevar a cabo una buena revista digital.</span>
            </p>

            <img src="http://www.netwoods.net/imagenes//revista_netwoods.jpg" />
            <p>
                <span style="font-family: Arial, Helvetica, sans-serif; ">Con&nbsp;<strong>Netwoods Colombia</strong>&nbsp;solo necesitas tener un archivo PDF con el contenido de tu revista. 
                    La revista digital de Netwoods Colombia es un servicio que le convertirá<strong>&nbsp;un archivo (PDF, Word, powert point, etc) en un archivo de Flash</strong>&nbsp;que se irá 
                    cargando a medida que el usuario lector pase la página (<a href="http://www.netwoods.net/demo_revista_digital/">ver&nbsp;</a>
                    <a href="http://www.netwoods.net/demo_revista_digital/" style="color: rgb(0, 102, 203); text-decoration: none; ">Demo</a>). 
                    La conversión es en alta calidad y además permite hacer zoom en cualquier página del documento sin perder nitidez.</span>
            </p>
            <h1>OFERTA COMERCIAL</h1>
            <h5 class='file_price'> <?php echo $plan["nombre"] ?>: <span>$  <?php echo number_format($plan["valor"]) ?> Pesos</span></h5>
            <p>La página adicional tendrá un valor de:$56.000 pesos.</p>
        </div>
    </div>
</div>
<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1>ALGUNOS DE NUESTROS CLIENTES</h1>
            <p style="text-align: center;"><img src="/nwlib/modulos/propuestas/imagenes/logos_clientes.png" /></p>
            <p align="center">
                En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:
                <a href="https://www.gruponw.com/clientes" style="color: blue;">https://www.gruponw.com/clientes</a>
            </p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
global $id_propuesta;
$dbdb = NWDatabase::database();
$cb = new NWDbQuery($dbdb);
$wheree .= " where id_propuesta=:id_propuesta";
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
    echo "<div id='contenedor1'>";
    encabezado();
    echo "<div id='contenedor2'>";
    echo "<div class='bloques_text_center'>";
    echo "<div class='bloques_textos'>";
    echo "<h1>Módulos</h1>";
    echo $rr["texto"];
    echo "</div>";
    echo "</div>";
    echo "</div>";
    echo "</div>";
}
?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
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
</div>
<!-- FIN DE UNA PÁGINA -->

