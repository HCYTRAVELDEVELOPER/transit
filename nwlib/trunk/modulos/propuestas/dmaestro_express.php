<!--<link rel="stylesheet" type="text/css" href="css/css_2015.css">-->
<link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>/propuestas/css/css_2015.css" />

<style>
    body{
        font-family: 'Open Sans',arial,sans-serif !important;   
    }
    .bloquesFlotantes{
        width: 20%;
    }
    .bloquesFlotantesIMG img {
        max-width: 100px;
    }
</style>
<?php
$abre_contenedor1 = "<div id='contenedor1'>";
$cierra_contenedor1 = "</div>";
if (($pdf_impr == "pdf")) {
    $abre_contenedor1 = "";
    $cierra_contenedor1 = "";
}
global $id_propuesta;
//encabezado_principal();
?>
<div id="contenedor1">
    <div id="contenedor2">
        <div id="logo">
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/images/design1.png" alt="Nw Grupo Netwoods">
        </div>
        <h2>NW Express</h2>
        <div id="portada">
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/images/desktop.jpg" alt="Nw Group">
        </div>
        <h2>Señores: </h2>
    </div>
</div>

<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloq">
            <div id="title">
                <h2 class="alltitles">¿cómo funciona tu plan?</h2>
            </div>
            <div class="how">
                <div class="circle one"></div>
                <p class="paragraph">Selecciona tu plantilla</p>
            </div>
            <div class="how">
                <div class="circle two" ></div>
                <p class="paragraph">Editala tu mismo</p>
            </div>
            <div class="how">
                <div class="circle three"></div>
                <p class="paragraph">Nosotros te damos el soporte técnico</p>
            </div>
        </div>
        <div id="title">
            <h2 class="alltitles">¿qué incluye tu plan?</h2>
        </div>
        <div class="bloqcontainer">
            <div class="bloqs">
                <div class="what">
                    <div class="small_circle four"></div>
                    <p class="paragraph description">Puesdes escoger tener un diseñador a tu disposición o crear tu propio diseño. </p>
                </div>
                <div class="what">
                    <div class="small_circle five" ></div>
                    <p class="paragraph description">Las páginas internas que necesites en lenguaje HTML 5 y CSS3 de nuestra biblioteca que podrás seleccionar
de acuerdo a tus necesidades. </p>
                </div>
                <div class="what">
                    <div class="small_circle six"></div>
                    <p class="paragraph description">No incluye fotos stock</p>
                </div>
                <div class="what">
                    <div class="small_circle seven"></div>
                    <p class="paragraph description">Una animación de NW animate entendida como una transición de imagenes.</p>
                </div>
                <div class="what">
                    <div class="small_circle eight" ></div>
                    <p class="paragraph description">Soporte técnico para ayudarte a manejar tu sitio web.</p>
                </div>
            </div>
            <div class="bloqs">
                <div class="what">
                    <div class="small_circle nine"></div>
                    <p class="paragraph description">No incluye Modulos NW</p>
                </div>
                <div class="what">
                    <div class="small_circle ten"></div>
                    <p class="paragraph description">Responsive Web para que el diseño de tu sitio web se adapte a dispositivos móviles.</p>
                </div>
                <div class="what">
                    <div class="small_circle eleven" ></div>
                    <p class="paragraph description">Una capacitación en el manejo de NW project para que puedas administrar tu sitio web.</p>
                </div>
                <div class="what">
                    <div class="small_circle twelve"></div>
                    <p class="paragraph description">Hosting y dominio : por 1 (un) año. Luego de cumplir el año lo debe renovar el cliente
                        (si cuenta con Hosting y dominio no afecta el valor y consideración de la propuesta).</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloqcontainer">
            <div id="title">
                <h2 class="alltitles mod">¿Por qué trabajar con nosotros?</h2>
            </div>
            <div class="responsive">
                <div class="disp"></div>
            </div>
            <h2 class="alltitles mod textres">Responsive Design</h2>
            <p class="paragraph bottom">Con esta nueva tecnología su sitio podrá visualizarse desde cualquier dispositivo, sea móvil o de escritorio.</p>
            <p class="paragraph bottom">El diseño se adapta automáticamente a la resolución del dispositivo.
                Al actualizar, agregar o modificar cualquier contenido en su página web, ésta se
                verá reflejada en todos los dispositivos móviles.</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloqcontainer">
            <div class="two_screens"></div>
            <h2 class="alltitles mod textres">Posicionamiento Natural</h2>
            <p class="paragraph bottom">Su sitio será enfocado directamente en el posicionamiento en los motores de búsqueda. Tenemos disponible la visualización previa del posicionamiento esperado mediante técnicas especializadas de desarrollo junto con estrategias de programación orientadas a lograr el posicionamiento, como ventaja competitiva de superioridad frente a otros sitios web.</p>
            <p class="paragraph bottom">(Microformatos, sitemaps, rss, metaetiquetas, microdatos, analythics, Quantcast, Dublin Core, Geoposicionamiento, entre otras).</p>
            <div class="two_screens"></div>
            <h2 class="alltitles mod textres">Administrador de Contenidos</h2>
            <p class="paragraph bottom">Tendrán acceso total al administrador de contenidos Nw project sin restricciones, 100% administrable,
                podrá crear Ejem. Nuevos espacios, objetos links a su gusto,páginas nuevas ilimitadas. </p>
            <p class="paragraph bottom">Este permitirá diseñar, mover bloques, agregar páginas, mostrar los bloques o páginas requeridos,
                cambiar los colores de fondo, insertar imágenes de fondo, cambiar fuentes, tamaños, cambiar tamaños
                de páginas, cambiar los links, cambiar los párrafos de todas las páginas, además tendrá módulos
                (aplicaciones web) para agregar productos, imágenes, párrafos o información requerida sin limitaciones.</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloqcontainer">
            <div id="title">
                <h2 class="alltitles mod">¿Qué nos diferencia?</h2>
            </div>
            <div class="text_objects">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/images/ventajaspro.png" alt="Que nos destaca a Netwoods">
                <p class="absolut a"><strong>Velocidad de tiempos de entrega</strong></p>
                <p class="absolut b"><strong>Configuración y
                        funcionamiento:
                    </strong><br>Con las herramientas
                    mas actuales
                    (HTML5, CSS3,
                    JavaScript, PHP).</p>
                <p class="absolut c"><strong>Diseño único: </strong><br>Gracias a
                    nuestra experiencia
                    certificada y a el manejo
                    de nuestras propias
                    herramientas</p>
                <p class="absolut d"><strong>Seguridad: </strong><br>Sitio web
                    protegido contra
                    ataques de inyección
                    de código o cualquier
                    intento de afectación.</p>
                <p class="absolut e">No nos limitamos al
                    uso de otros administradores</p>
                <p class="absolut f">Creación de
                    formularios
                    a la medida</p>
                <p class="absolut g">Te damos el
                    soporte
                    y la asesoría que
                    nesesites</p>
                <p class="absolut h">Manejo de perfiles de administración
                    según las funciones del usuario</p>
            </div>
            <div id="title">
                <h2 class="alltitles mod ik">¿Donde trabajamos?</h2>
            </div>
            <div class="maps">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/images/mapa.png" alt="Que nos destaca a Netwoods">
            </div>
        </div>
    </div>
</div>


<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php
global $id_propuesta;
$dbdb = NWDatabase::database();
$cb = new NWDbQuery($dbdb);
$ca = new NWDbQuery($dbdb);
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
    $wheree = " where id=:id";
    $sqla = "select * FROM tarifas_generales_productos " . $wheree . " order by id asc";
    $ca->prepare($sqla);
    $ca->bindValue(":id", $propuesta["tarifa"]);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    $tarifa = $ca->flush();
    $tarifas = $cb->assocAll();
    if (count($tarifas) > 0) {
        $total = count($tarifas) + 1;
        echo "<div id='contenedor1'>";
        encabezado();
        echo "<div id='contenedor2'>";
        echo "<div class='bloques_text_center'>";
        echo "<div class='bloques_textos'>";
        echo '<div style="width: 800px;margin: auto;"><p style="text-align: center;">&nbsp;</p>';
        echo '<p style="text-align: center;"><strong>Paquete de Servicios</strong></p>';
        echo '<p style="text-align: center;">&nbsp;</p>';
        echo '<table cellspacing="10" class="tablePrecios" style="height:1px;width:800px;">';
        echo '<tbody><tr>';
        echo '<th style="text-align: center;width: 300px;"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;&nbsp;</span></th>';
        echo '<th style="text-align: center;width: 120px;"><span style="color:#000000;">% de Ahorro</span></th>';
        echo '<th style="text-align: center;width: 200px;"><span style="color:#000000;">Valor Unidad </span></th></tr>';
        for ($i = 0; $i < count($tarifas); $i++) {
            echo '<tr><td style="text-align: center; width: 400px;">' . $tarifas[$i]["rango_inicial"] . '- ' . $tarifas[$i]["rango_final"] . ' por ' . $tarifa["unidad_medida"]  .'</td>
			<td style="text-align: center;">' . $tarifas[$i]["ahorro"] . '</td>
			<td style="text-align: center;">$ ' . number_format($tarifas[$i]["valor_unidad"]) . '</td></tr>';
        }
        echo '</tbody></table><p>&nbsp;</p>';
        echo '<p style="text-align: center;">&nbsp;</p>
<p style="text-align: center;">&nbsp;</p>
<p><strong>Notas: </strong></p>
<ul>
	<li>*Todos los valores son por paquete adquirido por el cliente.</li>
	<li>Valor unidad por '. $tarifa["unidad_medida"] .' adicional $ ' . number_format($propuesta["valor_adicional_negociacion"]) . ' .</li>
	<li>Las fechas de corte ser&aacute;n generadas a partir de la entrega&nbsp;del software, con facturaci&oacute;n mes vencido.</li>
	<li>Mensualmente se debe adquirir uno de los paquetes de manifiestos&nbsp;&nbsp;explicados en las tablas.</li>
	<li>Despu&eacute;s de terminado el&nbsp;paquete de manifiestos, el usuario podr&aacute; adquirir uno nuevo denominado&nbsp;&quot; paquete adicional &quot;&nbsp;</li>
</ul>
</div>';
        echo "</div>";
        echo "</div>";
        echo "</div>";
        echo '</div>';
    }
}
?>

<?php
global $id_propuesta;
$dbdb = NWDatabase::database();
$cb = new NWDbQuery($dbdb);
$ca = new NWDbQuery($dbdb);
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
    $wheree = " where id=:id";
    $sqla = "select * FROM tarifas_generales_productos " . $wheree . " order by id asc";
    $ca->prepare($sqla);
    $ca->bindValue(":id", $propuesta["tarifa"]);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    $tarifa = $ca->flush();
    $tarifas = $cb->assocAll();
    if (count($tarifas) > 0) {
        $total = count($tarifas) + 1;
        echo "<div id='contenedor1'>";
        encabezado();
        echo "<div id='contenedor2'>";
        echo "<div class='bloques_text_center'>";
        echo "<div class='bloques_textos'>";
        echo '<div style="width: 800px;margin: auto;"><p style="text-align: center;">&nbsp;</p>';
        echo '<p style="text-align: center;"><strong>Paquete de Servicios</strong></p>';
        echo '<p style="text-align: center;">&nbsp;</p>';
        echo '<table cellspacing="10" class="tablePrecios" style="height:1px;width:800px;">';
        echo '<tbody><tr>';
        echo '<th style="text-align: center;width: 300px;"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;&nbsp;</span></th>';
        echo '<th style="text-align: center;width: 120px;"><span style="color:#000000;">% de Ahorro</span></th>';
        echo '<th style="text-align: center;width: 200px;"><span style="color:#000000;">Valor Unidad </span></th></tr>';
        for ($i = 0; $i < count($tarifas); $i++) {
            echo '<tr><td style="text-align: center; width: 400px;">' . $tarifas[$i]["rango_inicial"] . '- ' . $tarifas[$i]["rango_final"] . ' por ' . $tarifa["unidad_medida"]  .'</td>
			<td style="text-align: center;">' . $tarifas[$i]["ahorro"] . '</td>
			<td style="text-align: center;">$ ' . number_format($tarifas[$i]["valor_unidad"]) . '</td></tr>';
        }
        echo '</tbody></table><p>&nbsp;</p>';
        echo '<p style="text-align: center;">&nbsp;</p>
<p style="text-align: center;">&nbsp;</p>
<p><strong>Notas: </strong></p>
<ul>
	<li>*Todos los valores son por paquete adquirido por el cliente.</li>
	<li>Valor unidad por '. $tarifa["unidad_medida"] .' adicional $ ' . number_format($propuesta["valor_adicional_negociacion"]) . ' .</li>
	<li>Las fechas de corte ser&aacute;n generadas a partir de la entrega&nbsp;del software, con facturaci&oacute;n mes vencido.</li>
	<li>Mensualmente se debe adquirir uno de los paquetes de manifiestos&nbsp;&nbsp;explicados en las tablas.</li>
	<li>Despu&eacute;s de terminado el&nbsp;paquete de manifiestos, el usuario podr&aacute; adquirir uno nuevo denominado&nbsp;&quot; paquete adicional &quot;&nbsp;</li>
</ul>
</div>';
        echo "</div>";
        echo "</div>";
        echo "</div>";
        echo '</div>';
    }
}
?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloqcontainer">
            <div id="title">
                <h2 class="alltitles mod">¿Con quienes trabajamos?</h2>
            </div>
            <div class="clientes">
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
                <div class="logos"></div>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <?php
            include "foot_prices.php";
            ?>
            <div class="content">
                <div class="condition">
                    <h2 class="alltitles mod cd">Condiciones</h2>
                    <ul class="listc">
                        <li>Forma de pago: 50% al iniciar, 50% contra entrega</li>
                        <li>Tiempo de entrega: 20 días hábiles</li>
                    </ul>
                </div>
                <div class="trust">
                    <div class="good"></div>
                    <h2 class="alltitles mod cd">“confia la imagen de tu empresa a profesionales”</h2>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <div class="header"></div>
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title3">&nbsp;</h1>
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

