<div id="contenedor1">
    <?php
    encabezado_principal();
    ?>
    <div id="contenedor2">
        <div class="img1">
            <br />
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/pr.jpg" class="imgEncPortada"/>
        </div>
        <div class="divTitleEnc">
            <h1 class="title1">
                <?php echo $r["titulo"] ?>
                <p>
                    PROPUESTA TÉCNICA Y ECONÓMICA  <strong><?php echo $r["titulo"] ?></strong>
                </p>
            </h1>
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.png" style="float: left;width: 400px;" />
            <h2 style="color: #555;">
                Señores: <?php echo $prd["nombre"] ?>
                <br />
                <br />
                Atn: <?php echo $prd["nombre_contacto"] ?>
                <?php
                if ($prd["cargo_contacto"] != "") {
                    echo "<br />" . $prd["cargo_contacto"];
                }
                ?>
                <br />
                Fecha: <?php echo $fecha_final ?>
                <br />
                Propuesta N°: <?php echo $_GET["id"] ?>

            </h2>
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
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial <strong><?php echo $r["titulo"] ?></strong>. 
                No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
            <div class="bloque1">
                <h1 style="margin:1px; padding: 3px;">
                    <?php echo $r["titulo"] ?>
                </h1>
                <div>
                    <?php echo $r["descripcion_general"] ?>
                </div>
            </div>
            <h2 style="text-align:center"><strong><span style="font-size:13px">NETWOODS &nbsp;Y SU SERVICIO DE VIDEO</span></strong></h2>

            <p style="text-align:justify">Hoy los comerciales, videos institucionales, productos y servicios son pensados casi exclusivamente para ser difundidos en la red así como en diferentes medios de comunicación.&nbsp;<strong>NW</strong>&nbsp;es un equipo de profesionales capacitados en la realizaci&oacute;n de&nbsp;<strong><em>videos institucionales </em></strong>,<strong>banners</strong>&nbsp;en Flash y nuevas tecnolog&iacute;as digitales.&nbsp; Internet es un medio de comunicaci&oacute;n importante, de gran respuesta y efectividad, &nbsp;por ello los videos deben ser acordes a la imagen de su marca.</p>

            <p style="text-align:justify">Ofrecemos un paquete especializado con&nbsp;<em><strong>Videos Institucionales</strong></em>,&nbsp;<strong><em>Banners</em></strong>&nbsp;en FLASH,&nbsp;<strong><em>Fotograf&iacute;a</em></strong>, todo tipo de animaciones, estrategias de comercializaci&oacute;n y promoci&oacute;n, dise&ntilde;o e impresi&oacute;n de tarjetas corporativas, dise&ntilde;o del logo e imagen corporativa, producci&oacute;n de impresos, entre muchos otros servicios.</p>

            <p>Recuerde que tambi&eacute;n nos especializamos en&nbsp;<strong>Fotograf&iacute;a</strong>, publicidad en general e imagen corporativa.</p>

            <p style="text-align:justify">En materia de videos institucionales nos caracterizamos por tener lo que se requiere para hacer que su video &nbsp;cumpla con el objetivo de mostrar la compa&ntilde;&iacute;a y darle ese toque c&aacute;lido que genera empat&iacute;a por parte del cliente. Esto lo logramos gracias a nuestro equipo humano y t&eacute;cnico especializado en producci&oacute;n audiovisual, y por nuestro trato y trabajo exclusivo con nuestros clientes; nos dedicamos de manera personalizada &nbsp;involucr&aacute;ndonos hasta conseguir&nbsp; exactamente lo que el cliente busca.&nbsp;</p>

            <p style="text-align:justify">Para garantizar el cumplimiento del contrato en cuanto a fechas de entrega, por costos de producci&oacute;n&nbsp; y por comodidad del cliente tambi&eacute;n, dado el tiempo que demanda la realizaci&oacute;n, nosotros proponemos un <strong>cronograma</strong>, en donde se encuentra especificado todo el proceso a ejecutar desde el momento en que se firma el contrato hasta el momento en que se entrega el producto final.</p>

            <p>
                <strong>Descripci&oacute;n del servicio:</strong><br />
                <br />
                <span style="font-size:13px">Narraci&oacute;n de cine edici&oacute;n din&aacute;mica y autor&iacute;a de m&uacute;sica avanzada</span>
                <br />
                <span style="font-size:13px">Narraci&oacute;n voz en off</span>
                <br />
                <span style="font-size:13px">Grabaci&oacute;n 2k superior a full HD</span>
                <br />
                <span style="font-size:13px">Musicalizaci&oacute;n y sonorizaci&oacute;n dolby digital</span>
                <br />
                <span style="font-size:13px">5 minutos m&aacute;ximo</span>
                <br />
                <span style="font-size:13px">Entregables en medios magnéticos</span>
                <br />
                <span style="font-size:13px">Edición de alto nivel</span>
            </p>

            <p><span style="font-size:13px"><strong>Tiempo de entrega:</strong> </span>8 d&iacute;as h&aacute;biles.&nbsp;</p>

            <p><strong>REQUERIMIENTOS</strong></p>

            <p>Con el &uacute;nico fin de optimizar nuestra actividad para cumplir y superar&nbsp; las expectativas de nuestros clientes, tenemos pocos pero importantes requerimientos a cumplir por parte de nuestros clientes:</p>

            <ul>
                <li>Tener acceso a todas las instalaciones de la empresa durante todo el tiempo de grabaci&oacute;n.</li>
                <li>Contar con la colaboraci&oacute;n de todo el personal de la empresa, durante el tiempo de grabaci&oacute;n, obviamente sin &aacute;nimo de interferir con la producci&oacute;n o el desempe&ntilde;o normal de la empresa, solo en los momentos necesarios y de ciertas personas, sin embargo es importante saber que contamos con ello.</li>
                <li>Cumplir ordenada y puntualmente con el cronograma de actividades.&nbsp;</li>
            </ul>
        </div>
    </div>
</div>
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
    echo "<div id='contenedor1'>";
    encabezado();
    echo "<div id='contenedor2'>";
    echo "<div class='bloques_text_center'>";
    echo "<div class='bloques_textos'>";
    echo $rr["texto"];
    echo "</div>";
    echo "</div>";
    echo "</div>";
    echo "</div>";
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
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <?php
            include "foot_prices.php";
            ?>
        </div>
        <div class="bloques_text_center">
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
                </strong>
                <br />
                <span>Fecha de Creación: <?php echo $fecha_final ?></span>
                <br />
                <?php
                $nummes = $nummes - 1;
                ?>
                <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->