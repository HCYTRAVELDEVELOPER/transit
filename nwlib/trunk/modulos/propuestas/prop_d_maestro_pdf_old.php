<?php
$abre_contenedor1 = "<div id='contenedor1'>";
$cierra_contenedor1 = "</div>";
if (($pdf_impr == "pdf")) {
    $abre_contenedor1 = "";
    $cierra_contenedor1 = "";
}
?>
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
        <p style="color: #555;margin: 0;font-size: 14px;">
            <strong>Bogotá D.C.</strong><br />
        </p>
        <h2 style="color: #555;">
            Señores: <?php echo $prd["nombre"] ?>
            <br />
            At: 
            <?php
            echo $prd["nombre_contacto"];
            ?>
        </h2>
        <div class="img1">
            <img src="http://www.netwoods.net/imagenes/propuestas/img_inicial_pla_maestro.jpg" />
        </div>
    </div>
</div>
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <h1 class="title2">
            NETWOODS COLOMBIA 
        </h1>
        <div class="bloques_text_center">
            <p>&nbsp;</p>
            <p>Reciba un  Cordial Saludo Sr(a)<strong> <?php echo $prd["nombre_contacto"] ?></strong></p>
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial  para la implementación, desarrollo y sostenimiento de una plataforma 
                informática  que involucra el diseño y programación de su proyecto de <strong><?php echo $plan["nombre"] ?></strong>. No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.                  </p>
            <p><strong>Objetivo General: </strong></p>
            <p>- Diseñar: <?php echo $plan["nombre"] ?>.                </p>
            <p><strong>Objetivos Específicos: </strong></p>
            <ul>
                <li>Diseñar una página Web  administrable a partir de la cual El administrador de la misma podrá cambiar  cualquier contenido a través de perfiles de usuario que podrán crear y  restringir acciones, sin necesidad de recurrir a terceros. </li>
                <li>Integrar el diseño a la medida  requerido, teniendo en cuenta sus lineamientos e imagen corporativa, con una  plataforma de administración de contenido con navegación y funcionalidades  &quot;User Friendly&quot;. </li>
                <li>Permitir una fácil  actualización de información (textos, fotografías, videos, formularios,  noticias, encuestas), en cualquier sección, hoja o zona en el diseño Web a la  medida concebido por Netwoods.net. </li>
                <li>Cumplir con los lineamientos  y los estándares de W3C. </li>
                <li>Permitir que los visitantes  de la página web siempre estén a la expectativa de observan un contenido nuevo. </li>
                <li>Poner en las manos de nuestro  cliente, las herramientas necesarias para mantener actualizada la información y  contenido de su sitio web. </li>
                <li>Publicación de galería de  imágenes y videos.</li>
                <li>Integrar con diferentes  aplicaciones y redes sociales.</li>
                <li>Crear perfiles en diferentes  redes sociales.</li>
                <li>Tienda virtual.</li>
                <li>Incluye todos los módulos  creados por netwoods (aproximadamente 100).</li>
                <li>Técnicas especializadas en  posicionamiento web SEO.</li>
                <li>Inclusión en 20 directorios  web.</li>
            </ul>
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
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/banner_diseno_web_2013.png" style="float: left;" />
            <p>
                <br />
                <br />
                <span style="color: rgb(128, 128, 128);">Con netwoods podrá disfrutar de una página web hecha a la medida, original, administable, con posicionamiento natural para aumentar sus ventas, llamativa y atractiva.</span>
            <div>
                <span style="font-size: 14px;"><span style="color: rgb(128, 128, 128);">Usamos tecnología de punta, de hoy.</span></span></div>
            <div>
                <br />
                <br />
                <span style="font-size: 16px;"><span style="color: rgb(178, 34, 34);">
                        Diseño Web Profesional<br>
                        Adaptado a Móviles<br>
                        HTML5 y CSS3<br>
                        Administrador de Contenidos NwProject
                    </span>
                </span>
            </div>
            <div style="position: relative; overflow: hidden;width: 100%;">            
                <p style="font-size: 20px;"><strong>Este plan Incluye:</strong></p>
                <ul class="ul_imgtext">
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/foto_icono.png" />
                        </div>
                        <p>
                            20 Fotos Profesionales de Stock
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/papel_icono.png" />
                        </div>
                        <p>
                            20 Hojas Internas, ilimitadas por el cliente
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/diseno1.png" />
                        </div>
                        <p>
                            Diseño Único a la Medida
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/icon_nwproject.png" />
                        </div>
                        <p>
                            CMS NwProject, administrable
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/html5_css3_bogota_home.png" />
                        </div>
                        <p>
                            HTML5, CSS3
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/icons_home_cloud_servers.png" />
                        </div>
                        <p>
                            Hosting y Dominio
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/icon_inhouse.png" />
                        </div>
                        <p>
                            Posicionamiento Orgánico Natural
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/icons_home_software_pants.png" />
                        </div>
                        <p>
                            Hasta 6 módulos de Nw
                        </p>
                    </li>
                    <li>
                        <div>
                            <img src="/nwlib/modulos/propuestas/imagenes/maestro/icons_home_responsive.png" />
                        </div>
                        <p>
                            Responsive, Multi Navegador
                        </p>
                    </li>
                </ul>
            </div>
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/img3.png" style="float: right;width: 300px; top: 50px;" />
            <h1>Diseño único</h1>
            <ul>
                <li><strong>No manejamos plantillas</strong>, su página será un diseño  exclusivo y ajustado a sus necesidades, se enviarán 3 bosquejos de diferentes  diseñadores hasta llegar a lo deseado.        </li>
                <li>Nuestro administrador de contenidos <strong>Nw</strong> <strong>Project</strong> es propio, creado por  nosotros para brindar una administración más amigable para los usuarios que no  tengan conocimientos de programación ni diseño, <strong>no usamos </strong>cms como joomla, wordpress, drupal entre otros<strong>.</strong></li>
                <li>Contamos con la tecnología actual para desarrollar su página web  profesional, a la medida y a la altura de la tecnología de hoy. </li>
            </ul>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/img7.png" style="float: left;width: 300px; " />
            <h1>Animación e interactividad</h1>
            <ul>
                <li>Animaciones de imágenes 8 (máximo 8),  transiciones y demás en html, javascript y jquery, no usamos flash ya que no es  compatible con celulares, en caso de ser necesario podemos crear cualquier tipo  de animación flash AS2 y AS3.</li>
            </ul>
            <p>&nbsp;</p>
            <h1>&nbsp;</h1>
            <p>&nbsp;</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/img8.png" style="width: 100%; " />
            <h1>Administrador de  contenidos NW Project</h1>
            <ul>
                <li>Tendrán acceso total al <strong>administrador de contenidos Nw project sin  restricciones</strong>, 100% administrable,  <strong>podrá crear Ejem. Nuevos espacios, objetos  links a su gusto, páginas nuevas ilimitadas</strong>.  Este permitirá diseñar, mover bloques, agregar  páginas, mostrar los bloques o páginas requeridos, cambiar los colores de  fondo, insertar imágenes de fondo, cambiar fuentes, tamaños, cambiar tamaños de  páginas, cambiar los links, cambiar los párrafos de todas las páginas, además <strong>tendrá módulos (aplicaciones web) </strong>para  agregar productos, imágenes, párrafos o información requerida sin limitaciones.  Las imágenes se mostraran en su estado normal pequeñas y al momento de dar clic  sobre ellas  se agrandarán a su tamaño  original.</li>
            </ul>
            <br />
            <div style="position: relative;overflow: hidden;">
                <img src="/nwlib/modulos/propuestas/imagenes/maestro/img2.png" style="float: left;width: 400px;" />
                <div>
                    <h1>Módulos, aplicaciones web                </h1>
                    <strong>Catálogo de Productos</strong> En una hoja especial podrá  agregar, modificar o borrar publicaciones de interés para los usuarios, 
                    puede  crear categorías para cada tipo de publicación, haciéndola más llamativa y un  sitio de interés, cada publicación tiene un espacio para
                    que los usuarios  puedan comentar y tener interacción con el administrador, tanto en la página  como en <strong>facebook</strong>, el comentario se  publicará 
                    automáticamente en el muro de <strong>facebook </strong>del usuario.
                </div>
            </div>
            <br />
            <ul class="ulModules">
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/maestro/img2.png"  />
                    <h3>
                        Catálogo de Productos
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/maestro/foto_icono.png"  />
                    <h3>
                        Galería de imágenes
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/news1.png"  />
                    <h3>
                        Módulo Blog, Noticias
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/video1.png"  />
                    <h3>
                        Galería de Videos
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/calendar1.png"  />
                    <h3>
                        Calendario de Eventos
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/news_subscribe1.png"  />
                    <h3>
                        Suscripción a noticias, newsletter
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/icons/chat8.png"  />
                    <h3>
                        Chat Soporte:
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/slide1.png"  />
                    <h3>
                        Módulo Slider
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/contact1.png"  />
                    <h3>
                        Formulario contacto
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/survey1.png"  />
                    <h3>
                        Herramienta para crear  encuestas
                    </h3>
                </li>
                <li>
                    <img src="/nwlib/modulos/propuestas/imagenes/nwmaps.png"  />
                    <h3>
                        Mapas
                    </h3>
                </li>
            </ul>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/img5.png" />
            <ul>
                <li>
                    Motor de Búsqueda: El sitio contará con un buscador con filtros, este buscará en todo el portal lo relacionado con las palabras clave digitada
                </li>
                <li>
                    Interacción de todas las redes sociales, como Facebook, Twitter, etc. Con sus respectivos plugin.
                </li>
                <li>
                    Cada publicación, producto u oferta estará integrada con las redes sociales para que éste pueda ser compartido, recomendado o publicado en cualquier red social.
                </li>
                <li>
                    Integración con google maps.
                </li>
                <li>
                    Integración con web service que sea solicitado.
                </li>
            </ul>
            <p>&nbsp;</p>
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/img1.png" style="float: left;" />
            <h1>
                Posicionamiento Orgánico Natural
            </h1>
            <ul>
                <li>
                    El posicionamiento será orgánico, lo va dando automáticamente el administrador de contenidos, posicionamiento gradual automático y técnicas especiales de posicionamiento web SEO. 
                    Su página aparecerá en los motores de búsqueda en la primera semana de abrirse y se posicionará de 2 a 3 meses, quedando en los primeros lugares de acuerdo a las palabras clave que seleccione. 
                    Se incluirá en 20 directorios web. 
                </li>
                <li>
                    No será necesario crear una campaña de publicidad con Google, ya que su página web conservará su posición naturalmente.
                </li>
            </ul>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <img src="/nwlib/modulos/propuestas/imagenes/maestro/img6_1.png" style="float: right;" />
            <h1>Móviles, Web Responsive</h1>
            <p>
                Con esta nueva tecnología su sitio podrá visualizarse desde cualquier dispositivo, sea móvil o de escritorio.
                <br />
                El diseño se adapta automáticamente a la resolución del dispositivo.
                <br />
                Al actualizar, agregar o modificar cualquier contenido en su página web, ésta se verá reflejada en todos los dispositivos móviles
            </p>
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
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1>Aspectos Técnicos </h1>
            <ul>
                <li>El  portal Permitirá su navegación a través de los navegadores estándar del mercado  y las diferentes plataformas (Windows, Mac, Linux). </li>
            </ul>
            <ul>
                <li>Cualquier  contenido permitirá el acceso desde dispositivo móviles (celulares, tablets,  etc).</li>
            </ul>
            <ul>
                <li>Diagramación  Html por medio de Divs utilizando XHTML y CSS bajo estándar W3C. </li>
            </ul>
            <ul>
                <li>Utilizar  imágenes optimizadas y componentes de diseño que permitan mostrar la  información de manera dinámica, ágil y estética. </li>
            </ul>
            <ul>
                <li>Se  optimizará el peso de las páginas de tal forma que sean de carga rápida. </li>
            </ul>
            <ul>
                <li>Se  evitará el uso de Flash, utilizaremos componentes Ajax, javascript y html5 para  el caso de imágenes que realicen transiciones o animaciones. </li>
            </ul>
            <ul>
                <li>No  se implementarán frames o marcos. </li>
            </ul>
            <ul>
                <li>Las  imágenes mostradas en el sitio contendrán el atributo ALT, en caso de que  exista algún inconveniente en la carga de la misma.                    </li>
            </ul>
            <ul>
                <li>Se  manejará el formato del sitio por medio de hojas de estilo CSS, CSS3, html5  vinculadas y evitaremos al máximo la definición de estilos no incrustados en  las páginas. </li>
                <li>Se  podrá llegar a la información tratando de no exceder un máximo de tres clics.</li>
                <li>Se  podrá llegar a la información tratando de no exceder un máximo de tres niveles  de profundidad. </li>
                <li>Cada  formulario y sus campos contendrán su correspondiente guía de ayuda. </li>
            </ul>
            <h1>Plataformas, lenguajes de  programación y bases de datos.</h1>
            <p><strong>Netwoods  implementará lo siguiente para la creación del sitio:</strong></p>
            <ul>
                <li>Lenguajes de programación en  PhP, Javascript, Jquery, librerías, Ajax.</li>
                <li>Diseño y estructura en Html,  Html5, Css y Css3.</li>
                <li>No se usará Flash.</li>
                <li>Base de datos MySQL.</li>
                <li>Sistema Operativo Server:  Linux.                    </li>
            </ul>
            <h1>Seguridad</h1>
            <ul>
                <li>Autenticación a través de  usuario y contraseña, diferenciando como mínimo tres roles de usuario. </li>
            </ul>
            <ul type="disc">
                <li>Nuestras&nbsp;<a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">páginas</a>&nbsp;están       protegidas contra:</li>
            </ul>
            <p>&nbsp;</p>
            <div align="center">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="213"><p align="center">Inyección de código</p></td>
                        <td width="245"><p align="center">Deface</p></td>
                    </tr>
                    <tr>
                        <td width="213"><p align="center">Click hacking</p></td>
                        <td width="245"><p align="center">Ataques XSS (Cross    Site Scripting)</p></td>
                    </tr>
                    <tr>
                        <td width="213"><p align="center">Cache control</p></td>
                        <td width="245"><p align="center">Spam hack    formularios</p></td>
                    </tr>
                    <tr>
                        <td width="213"><p align="center">Submit java    diplicate problem</p></td>
                        <td width="245"><p align="center">Frame Busting</p></td>
                    </tr>
                </table>
            </div>
            <h1>&nbsp;</h1>
            <p>&nbsp;</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1>Informes</h1>
            <ul>
                <li>Contará con informes de  salida predefinidos (Gráficos y tablas excel) por medio de google analytics,  contará con estadísticas de su sitio.</li>
                <li>Se pueden obtener informes  como el seguimiento de usuarios exclusivos, el rendimiento del segmento de  usuarios, los resultados de la campaña de marketing, el marketing de motores de  búsqueda, las pruebas de versión de anuncios, el rendimiento del contenido, el  análisis de navegación, los objetivos y proceso de redireccionamiento o los  parámetros de diseño web</li>
                <li>La página contará con  informes de salida predefinidos (Gráficos y tablas excel) por medio de google  analytics. Google Analytics no solo le permite medir las ventas y las  conversiones, sino que también le ofrece información sobre cómo los visitantes  utilizan su sitio, cómo han llegado a él y qué puede hacer para que sigan  visitándolo.</li>
                <li>Todas las solicitudes por  medio de formularios se almacenará en una base de datos, que puede dar  seguimiento y posteriormente exportar en formato Excel.</li>
            </ul>
            <h1>Soporte</h1>
            <p>Luego de  que Nw entregue a satisfacción su página web, tendrá:</p>
            <ul>
                <li>Soporte y monitoreo de funcionalidad y  estabilidad en su página web y administrador de contenidos <strong>Nw Project permanentemente</strong>.</li>
                <li>Por medio de nuestra página web <a href="http://www.netwoods.net">www.netwoods.net</a> en el chat en línea o soporte en línea.</li>
                <li>Escribiéndonos al correo <a href="mailto:nwstudios@netwoods.net">nwstudios@netwoods.net</a>.</li>
                <li>Soporte telefónico.</li>
                <li>En caso de requerir administración del  portal será enviada una propuesta formal del servicio.</li>
            </ul>
            <p>&nbsp;</p>
            <h1>Hosting ,  especificaciones</h1>
            <table align="left" class="table_1">
                <tr>
                    <td width="169" valign="top"><p>Espacio </p></td>
                    <td width="193" valign="top"><p>10 GB</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Transferencia mensual</p></td>
                    <td width="193" valign="top"><p>30 GB</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Cuentas Email</p></td>
                    <td width="193" valign="top"><p>25</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Cuentas FTP</p></td>
                    <td width="193" valign="top"><p>Ilimitadas</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Bases de Datos MySQL</p></td>
                    <td width="193" valign="top"><p>Ilimitadas</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Dominios Parqueados</p></td>
                    <td width="193" valign="top"><p>Ilimitados</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Dominio Incluido</p></td>
                    <td width="193" valign="top"><p>.com .net . .org. .info .us .es .com.co .net .net.co</p></td>
                </tr>
                <tr>
                    <td width="169" valign="top"><p>Panel de Control</p></td>
                    <td width="193" valign="top"><p>CPANEL</p></td>
                </tr>
            </table>
            <p>&nbsp;</p>
            <ul>
                <li>Hosting y dominio : por 1 (un) año. Luego de cumplir el año lo debe renovar  el cliente. </li>
                <li><strong>Si cuenta con Hosting y dominio no afecta  el valor y consideración de la propuesta.</strong></li>
            </ul>
            <p><strong>&nbsp;</strong></p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title3">REQUERIMIENTOS A RECIBIR POR PARTE DEL  CLIENTE</h1>

            <ul type="disc">
                <li>Logo suministrado por el cliente.</li>
                <li>Manual de Imagen Corporativa (Tipografía, Colores,       Manejo de Fondos).</li>
                <li>Fotografías, imágenes y/o ilustraciones a ser       incluidas en formato digital en cualquiera de las siguientes extensiones:       JPG, GIF, PNG, PSD, CDR. Mínimo 72 dpi.</li>
                <li>Textos en cualquiera de los siguientes formatos:       .DOC, RTF, TXT, XLS, PDF.</li>
                <li>Archivos para descarga en cualquier Extensión o       Formato.</li>
            </ul>
            <p>&nbsp;</p>
            <p>Formatos para recepción de material</p>
            <ul>
                <li>Formato físico:  Catálogos, folletos, volantes, tarjetas de  presentación. Todo esto en buen estado y tamaño.</li>
                <li>Formato digital:<img src="http://www.netwoods.net/imagenes/propuesta_d_pyme_clip_image002.jpg" alt="" width="336" height="68" /></li>
                <li>Formato en los siguientes programas:  Photoshop Cs2,                Corel Draw,  paquete de office 2007.</li>
            </ul>
            <p><img src="http://www.netwoods.net/imagenes/propuesta_d_pyme_clip_image004.jpg" alt="" width="336" height="78" /> </p>
            <p>&nbsp;</p>
            <div>
                <p><strong>CAPACITACIÓN</strong></p>
            </div>
            <p>Capacitación  sobre administración del sistema.  <br />
                Vía  ONLINE, se le envía por correo tutorial del Administrador de contenidos.<br />
                Capacitación  sobre administración del sistema (2 horas) o las necesarias.<br />
                Número  máximo de asistentes x sesión: Diez (10)<br />
                Temas:  Filosofía del sistema.<br />
                Se dará  capacitación adicional a persona directa encargada del área.</p>
            <div>
                <p><strong>GARANTÍAS</strong></p>
            </div>
            <p>El  sistema de información tendrá una garantía limitada de 1 (UN) AÑO sobre los  productos que entregamos  por defectos de  fabricación o por defectos en el código fuente que ocasione mal funcionamiento.  Esta garantía cubre cualquier falla técnica o lógica no detectada en la etapa  de pruebas o Instalación.</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title3">ALGUNOS DE NUESTROS CLIENTES</h1>
            <p><img src="/nwlib/modulos/propuestas/imagenes/logos_clientes.png" /></p>
            <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
            <p>&nbsp;</p>
        </div>
    </div>
</div>
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
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title3"><strong>Especificaciones avanzadas de nuestros  productos y servicios</strong></h1>
            <p align="center">&nbsp;</p>
            <div>
                <p>POSICIONAMIENTO</p>
            </div>
            <p>Optimizamos nuestras  páginas con alta tecnología para aumentar la visibilidad de su contenido en los  principales buscadores del mundo. Con ésto, su empresa se verá beneficiada  ampliamente, utilizando su&nbsp;<em>página</em>&nbsp;como  un medio para conseguir ventas y nuevos clientes.<br />
                <img src="http://www.netwoods.net/imagenes/propuestas/propuesta_d_pyme_clip_image002_0000.jpg" alt="" width="485" height="423" />
                <img src="http://www.netwoods.net/imagenes/propuestas/propuesta_d_pyme_clip_image004.gif" alt="" width="380" height="260" /></p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title3">&nbsp;</h1>
            <p>Se trata de un trabajo  constante, generando contenidos, optimizando páginas web, a la vanguardia en  tecnología cuyos resultados son a largo plazo. Todo esto basados en:<br />
                <strong>:: 1 :: Buenos contenidos.</strong><br />
                Este es el punto principal, ya no solo para aparecer en los primeros puestos en  Google, sino para que la gente visite su sitio web.<br />
                :<strong>: 2 :: Tecnología web.</strong><br />
                Éstamos informados de las últimas novedades en cuanto a servidores o lenguajes  de programación.<br />
                <strong>:: 3 :: Sencillez.</strong><br />
                A los robots no le gustan las páginas con excesivas decoraciones y simplemente  busca textos legibles y contenidos claros.<br />
                <strong>:: 4 :: Alta en buscadores.</strong><br />
                El primer paso para conseguir una buena posición en los buscadores es aparecer  en el buscador.<br />
                <strong>:: 5 :: Conseguir enlaces.</strong><br />
                Es el pilar fundamental para obtener un PageRank alto.<br />
                <strong>:: 6 :: Evitar  penalizaciones.</strong><br />
                Los buscadores saben que muchas personas le intentan engañar, y está empezando  a tomar medidas contra páginas web que realizan prácticas poco éticas para  mejorar su posicionamiento. Somos expertos en evitar este tipo de sanciones  mediante buenas prácticas de programación.<br />
                <strong>:: 7 :: Información.</strong><br />
                El posicionamiento requiere estar informado constantemente. Nosotros lo estamos  a cada minuto.</p>
            <p align="center"><em>Recuerde que por la compra de cualquiera de nuestras  páginas web, nuestro</em><strong><em>&nbsp;</em></strong><a href="http://www.netwoods.net/paginas-web-software/administrador_de_contenidos-18">administrador de contenidos</a><strong><em>&nbsp;</em></strong><em>ya estará subiendo su</em><strong><em>&nbsp;</em></strong><em>página web</em><strong><em>&nbsp;</em></strong><em>en los buscadores automáticamente. Nuestra alta tecnología  busca satisfacer a todos nuestros clientes en este campo</em></p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h1 class="title3">&nbsp;</h1>
            <p>&nbsp;</p>
            <p><strong>El 70% de los&nbsp;</strong><a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">sitios web</a><strong><u>&nbsp;</u></strong><strong>están expuestos a ser hackeados, proteja  su&nbsp;</strong><a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">sitio</a><strong>&nbsp;con nosotros.</strong><br />
                Cuidar de sus datos es crucial,  tales como bases de clientes, información de visitantes, &nbsp;estadísticas de  sus movimientos, usuarios y claves, información secreta, datos de sus&nbsp;<strong><em>páginas  Web</em></strong>, etc.&nbsp;<br />
                Nuestros sistemas están protegidos  contra todo esto, ya que utilizamos las pruebas más rigurosas con nuestras <a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">páginas web</a><u>&nbsp;</u>y nuestro&nbsp;<a href="http://www.netwoods.net/paginas-web-software/software-programacion-14">software</a>. Así, cada día estamos actualizados de los últimos métodos utilizados para  violar la seguridad de los&nbsp;<a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">sitios web</a>.<br />
                Los aspectos de&nbsp;<a href="http://www.netwoods.net/paginas-web-software/seguridad-15">seguridad</a>&nbsp;son, hoy en día, un factor clave para las empresas el cual no se  puede dejar pasar por alto en ningún momento.<br />
                Y es por esto que debe ser una  prioridad para su organización, pues los hackers concentran sus facultades en  las&nbsp;<a href="http://www.netwoods.net/paginas-web-software/software-programacion-14">aplicaciones</a><u>&nbsp;</u>y&nbsp;<a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">páginas web</a>, las cuales están disponibles las 24 horas del día, 7 días a la semana.  Consulte con nosotros las vulnerabilidades de su&nbsp;<a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">página web</a><u>.</u></p>
            <p><u>&nbsp;</u></p>
            <p align="center"><strong>Seguridad en nuestras&nbsp;</strong><a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">páginas  WEB&nbsp;y&nbsp;software</a><strong>:</strong><br />
                Las vulnerabilidades&nbsp;<a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">WEB</a>&nbsp;son más comunes de lo que cree. Nuestras&nbsp;<a href="http://www.netwoods.net/paginas-web-software/paginas-web-4">páginas</a>&nbsp;están protegidas contra:</p>
            <div align="center">
                <table border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="135"><br />
                            Inyección de código </td>
                        <td width="156"><p>Deface</p></td>
                    </tr>
                    <tr>
                        <td width="135"><p>Click hacking</p></td>
                        <td width="156"><p>Ataques XSS (Cross Site Scripting)</p></td>
                    </tr>
                    <tr>
                        <td width="135"><p>Cache control</p></td>
                        <td width="156"><p>Spam hack formularios</p></td>
                    </tr>
                    <tr>
                        <td width="135"><p>Submit java diplicate problem</p></td>
                        <td width="156"><p>Frame Busting</p></td>
                    </tr>
                    <tr>
                        <td width="135"><p>&nbsp;</p>
                            <p>&nbsp;</p></td>
                        <td width="156"><p>&nbsp;</p></td>
                    </tr>
                    <tr>
                        <td width="135"><p>&nbsp;</p></td>
                        <td width="156"><p>&nbsp;</p></td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <p>ADMINISTRADOR  DE CONTENIDOS DE SU PÁGINA WEB.</p>
            <p><img src="http://www.netwoods.net/imagenes/propuestas/propuesta_d_pyme_clip_image002_0001.jpg" alt="" width="272" height="180" hspace="12" align="left" /></p>
            <p><strong>PLAN  MAESTRO:</strong> Es Administrable un 100%. Excepto los diseños  en flash y la estructura de la página.</p>
            <p>El administrador de contenidos es  un sistema robusto de información modular desarrollado en su totalidad en  ambiente WEB para la administración de todo tipo de contenidos de un portal Web  o de una Intranet. <br />
                Puede alimentarse con diferentes  tipos de información tales como : Textos, Imágenes, Documentos PDF, Archivos de  Sistema, Actualizaciones, Videos, Animaciones, Audio, Software, Listados de  Servicios, Documentos para descargar en cualquier formato, Noticias,  Cronogramas, Horarios, Manuales, E-Books, Formularios Dinámicos, Encuestas,  Foros, Galerías de Imágenes, o cualquier elemento que pueda ser representado en  formato digital puede ser publicado en la página web; el diseño de cada página  puede ser adaptado a las necesidades gráficas de la compañía.</p>
            <div>
                <strong><img src="http://www.netwoods.net/imagenes/propuestas/propuesta_d_pyme_clip_image004_0000.jpg" alt="" width="456" height="398" hspace="12" align="right" />INTERFASE  DE USUARIO FINAL </strong>
            </div>
            <p>(FRONT  END): Es todo lo que los visitantes consultan al entrar a su página web /  Intranet, como por ejemplo, los contenidos, encuestas, foros, formularios de  contacto, productos, carro de compras, estado de cuenta etc. </p>
            <div>
                <strong>INTERFASE DE ADMINISTRADORES</strong>
            </div>
            <p>(BACK END): Es la sección de la  página web / Intranet que solo es manejada por los administradores del sitio y  permite ingresar y modificar toda la información que los Usuarios (clientes)  podrán ver en la interface de usuario final FRONT END.<br />
            </p>
            <p><strong>MÓDULOS:</strong></p>
            Nuestro  administrador de contenidos está en la posibilidad de evolucionar  constantemente, integrándose con diferentes aplicaciones llamadas  &ldquo;módulos&rdquo;, las cuales son programas web diseñados para necesidades específicas.  Si usted desea integrar un módulo de noticias a su página web, puede utilizar  el módulo que más le convenga. Tenemos una amplia gama de aplicaciones en las  que encontrará muchas que le servirán a su página web. Éstos son diseñados totalmente  por NW, con tecnología de punta. Cada uno tiene su propia administración.</div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <p>&nbsp;</p>
            <p><strong>Objetos flotantes:</strong><br />
            <p>Puede diseñar su página con objetos que usted  mismo arrastra y suelta en el lugar que desee. Así, puede mostrar su página y  su contenido en la posición que desee, 
                exacta, en tiempo real. Además podrá  definir si quiere que esté por encima de los elementos, o que esté estática en  el navegador.&nbsp;</p><br />
            <img src="http://www.netwoods.net/imagenes/propuestas/propuesta_d_pyme_clip_image002_0002.jpg" alt="" width="643" height="433" /></p>
            <p>&nbsp;</p>
            <p align="center"><strong><em>¡Con esta herramienta, sus posibilidades  son ilimitadas!</em></strong></p>
            <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
            <p>&nbsp;</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <h2>Especificaciones técnicas:</h2>
            <p>NW Proyect está diseñado sobre PHP,  JAVASCRIPT, HTML y CSS. Posee las últimas tendencias tecnológicas WEB, avalado  por la W3C, la empresa que se encarga de estandarizar la manera de realizar las  páginas WEB. Inter </p>
            <div>
                <h2>Algunas ventajas del sistema:</h2>
            </div>
            <p>· Posee un sistema integrado de manipulación  de usuarios y perfiles. Adicional a esto, la seguridad hace parte de las  prioridades del sistema. Posee un rubusto programa de seguridad previniendo  ataques de hackers.<br />
                · Ya ha sido implementado en otros  portales, con un éxito del 100%.<br />
                · La instalación es cuestión de  minutos.<br />
                · El uso del sistema es intuitivo,  es decir, no se necesita ningún tipo de conocimiento en HTML ni en diseño  gráfico. Sin embargo ofrecemos una capacitación como parte integral del  contrato.<br />
                <strong>Cuenta con nuestro respaldo totalmente especializado en  portales corporativos y sistemas de edición y administración de portales.</strong></p>
            <div>
                <h2>Funcionalidades:</h2>
            </div>
            <p>Las siguientes son algunas  características y funcionalidades del sistema. El sistema evoluciona  permanentemente así que su Página Web podría ser entregada con nuevas  características que aquí no están listadas.</p>
            <ul>
                <li>Puede crear la cantidad de páginas que desee.</li>
                <li>Puede agregar cualquier cantidad de fotografías.</li>
                <li>Tiene un sistema de fácil acceso para importar animaciones en Flash.</li>
                <li>Puede editar sus textos como si lo estuviera haciendo en Word.</li>
                <li>Cambiar el tamaño y la forma del contenido es realmente fácil.</li>
                <li>Tiene la posibilidad de modificar un módulo de eventos, el que se mostrará  de </li>
            </ul>
            <p>      manera  dinámica   en su página web.</p>
            <ul>
                <li>Hay otro módulo de creación de noticias, en  donde se mostrarán de manera aleatoria.  </li>
                <li>Puede agregar fácilmente música a su sitio  WEB.</li>
                <li>Módulo de noticias integrado. Con esta  aplicación, puede generar noticias dinámicas. Puede mostrarlas en una página  completa, de manera parcial, y al darle clic, de manera total.</li>
                <li>Puede hacer una encuesta dinámica. También  obtendrá un administrador propio de dicha aplicación. La visualización de los  resultados es un análisis objetivo y muy bien estructurado.</li>
                <li>Menú principal: es muy fácil crear su  propio menú dinámico. De esta forma, puede cambiar la estructura de su página  fácilmente.</li>
                <li>Tiene acceso a ver los registros de  contacto de susu usuarios. Además, vía WEB le llegará la información  inmediatamente. Así podrá saber cuando los usuarios desean contactarse con su  empresa.</li>
                <li>Correos de contacto: puede editar los  correos a los que será enviada la información de los usuarios que desean  contactarse con su empresa.</li>
                <li>Imágenes aleatorias: Módulo diseñado para  mostrar las imágenes que desee automáticamente cada cierto tiempo. Así, su  página será más entendible. Puede usar este módulo para sus clientes actuales.</li>
            </ul>
            <p>&nbsp;</p>
            <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
            <p>&nbsp;</p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <ul>
                <li>Secciones: es muy sencillo modificar el  contenido central de su WEB. Con las secciones, puede editar y administrar  imágenes, texto, video, Flash, o lo que se pueda ver en la WEB. Así su página  estará más organizada y se visualizará mejor. </li>
                <li>Módulo de visitas. Podrá ver la cantidad de  visitantes de su página.</li>
                <li>En estas secciones o categorías puede  alojar cualquier tipo de información, acompañada de fotos y gráficas.</li>
            </ul>
            <p><strong>· Edición en Línea.</strong> El  proceso de edición se hace desde una interfaz amigable y directamente en el  portal. El sistema se encarga del control de los permisos de acceso y de  registrar todas las actividades en un archivo para su posterior auditoria.<br />
                <strong>· Herramienta de Búsqueda Interna</strong>. Cualquier contenido de la página está disponible para su búsqueda en el  potente motor integrado. Si usted modifica cualquier cosa en la página el motor  se actualiza automáticamente.<br />
                <strong>· Generación Dinámica de Mapa del Sitio.</strong> A medida que Usted añade nuevas secciones al sitio, este crea la nueva  versión actualizada del mapa de navegación.<br />
                <strong>· Control de Visibilidad.</strong> Usted  puede activar o desactivar páginas sin necesidad de borrarlas, el sistema se  encarga de actualizar automáticamente el motor de búsqueda, el mapa del sitio y  las subsecciones.<br />
                <strong>· Sistema de Seguridad Integrado para Controlar el Acceso  Mediante Passwords.</strong> Usted tiene un control total sobre las  diferentes secciones del portal. Puede definir zonas con acceso restringido mediante  passwords. El sistema se encarga de absolutamente toda la gestión de seguridad,  incluyendo: control de secciones y subsecciones, asignación de passwords y  username, envío de los mismos automáticamente, aviso vía email de nuevos  usuarios, formulario para recordar password, registro en la base de datos, es  decir, Usted se encarga de decir mediante un clic, quien entra y quién no.</p>
            <p><img src="http://www.netwoods.net/imagenes/propuestas/propuesta_d_pyme_clip_image002.gif" alt="" width="514" height="449" /></p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">

            <p><strong>Versión de la Página Para Imprimir.</strong> El sistema crea automáticamente una versión de la página amigable para su  impresión.<br />
                <strong>· Encuestas Gráficas en Línea.</strong> El  sistema integra un práctico módulo de creación de encuestas para que Usted  publique en cualquier sección del portal encuestas del tipo selección múltiple.  El número de encuestas posibles es ilimitado y la administración es totalmente  automática.<br />
                <strong>· Administrador de Cuestionarios:</strong> Permite insertar varias preguntas con múltiples respuestas cerradas y  llevar dicha información a una base de datos o a un e-mail. Incluye un  visualizador de estadísticas por resultados<br />
                <strong>- Foros en Línea.</strong> Con  esta herramienta Usted puede crear un número ilimitado de foros en cualquier  parte de la página. Los foros tienen la estructura &ldquo;Tema&rdquo; y &ldquo;comentarios&rdquo; los  cuales son publicados una vez el administrador los ha aprobado.<br />
                <strong>· Formularios de Contacto.</strong> Usted  puede agregar automáticamente formularios de contacto en cualquier parte de la  página con la información que necesite, con la posibilidad de que los  resultados (información recolectada) sean enviados a un e-mail o a una base de  datos en línea.<br />
                <strong>· Administrador de Noticias por Fecha:</strong> Usted puede definir cuando publicar o retirar una noticia de la página web  de forma automática.<br />
                <strong>· Configuración Global del Sitio:</strong> Permite modificar el título del Sitio, lenguaje inicial, alineación de la  página, imágenes y colores de fondo. <br />
                <strong>· Administrador de Idiomas:</strong> Permite configurar varios idiomas.<br />
                <strong>· Estadísticas Gráficas de Acceso:</strong> Permite visualizar cuáles son las páginas publicadas más visitadas, así  como cuantas veces han sido mostradas.<br />
                <strong>· Galería Fotográfica:</strong> Potente  administrador de Secciones (Álbumes) y administrador de Imágenes.<br />
                <strong>· Administrador de Enlaces:</strong> permite crear una estructura de navegación por temas con los links más  relevantes a su sitio web.<br />
                <strong>· Administrador de Documentos:</strong> permite crear una estructura de navegación de Documentos para descargar o  consultar en línea.<br />
                <strong>· Tickets de Soporte Técnico Interno:</strong> Sistema que permite la inserción y categorización de tickets de soporte  para uso interno de la compañía con el fin de hacer un seguimiento detallado de  tareas de la organización tales como, soporte a usuarios finales, soporte a  usuarios internos, publicación de contenidos, etc.<br />
                <strong>· Administrador de Preguntas Frecuentes FAQ:</strong> Sistema que permite categorizar e insertar preguntas frecuentes con sus  respectivas respuestas en un formato amigable y estandarizado para este tipo de  contenidos. <br />
                · Chat: Sistema que permite a los  usuarios ingresar a un canal de chat en tiempo real. <br />
                · Administrador de News- letters  (E-mail Marketing): Sistema que permite Crear e-mails masivos, administrar  plantillas, adicionar suscriptores y utilizar los usuarios registrados en el  sistema para envíos de Boletines o Promociones. </p>
            <div>
                <h2>Editor  de Texto Online (HTML EDITOR)</h2>
            </div>
            <p>El sistema incluye un potente  editor que permite darle un formato a todos los contenidos que se publican sin  necesidad de conocimientos sobre HTML, el usuario que publica los contenidos  sentirá que trabaja con un programa como Word o Excel, al cuál ya está  habituado, esto debido a que posee y conserva el manejo gráfico de un editor de  texto.<br />
                · Corrector de Ortografía<br />
                · Viñetas<br />
                · Justificación de Textos<br />
                · Manejo de Plantillas<br />
                · Inserción y Edición de Tablas - Inserción y Edición de Vínculos<br />
                · Inserción y Edición de Imágenes<br />
                · Editor de Textos<br />
                · Herramientas de Edición, deshacer,  rehacer, seleccionar todo.              </p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
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
            $query = pg_exec("select a.id, a.usuario, b.firma,b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
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
            <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
