<?php
global $id_propuesta;
?>
<?php
encabezado_principal();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="img1">
            <br />
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/pr.jpg" class="imgEncPortada"/>
        </div>
        <div class="divTitleEnc">
            <h1 class="title1">
                <?php echo $plan["nombre"] ?>
                <p>
                    PROPUESTA TÉCNICA Y ECONÓMICA  <strong><?php echo $r["titulo"] ?></strong>
                </p>
            </h1>
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.jpg" style="float: left;width: 500px;" />
            <h2 class="datosCleintEnc" style="color: #555;">  
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
<?php
encabezado();
?>
<div id="contenedor1">
    <div id="contenedor2">
        <div class="bloques_text_center" id="descripcion_general">
            <h1>
                ACERCA DE NOSOTROS
            </h1>
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/about.jpg" style="float: left;"/>
            Creamos soluciones rápidas de software y desarrollo web con estrategias de mejoramiento de procesos hechos a la medida, usando 
            estructuras tecnológicas flexibles y seguras propias bajo ambiente web que evolucionan y crecen con su negocio, asegurando la 
            competividad y la diferenciación corporativa mediante el mejoramiento de procesos. <b>Nuestras interfaces ofrecen amplios valores 
                agregados a sus soluciones informáticas, puesto que la base de desarrollo de todos nuestros aplicativos se perfecciona con cada 
                programa nuevo que creamos. </b>
            <br />
            <br />
            Debido al número de programas e interfaces hechos a la medida en Colombia, USA y algunos países de suramérica, tenemos la experiencia para que su proyecto sea exitoso y supere sus expectativas.  

            <div class="bloques_textos">
                <h2>
                    Principios clave
                </h2>
                <b>Seguridad  ||</b>
                <b>Técnica   ||</b>
                <b>Software inteligente que evoluciona   ||</b>                
                <b>Mejoramiento contínuo    ||</b>                
                <b>Reducción de costos    ||</b>                
            </div>
            <br />
            <br />
            <br />
            <br />
            <div class="bloques_textos">
                <h2>
                    ++INNOVACIÓN
                </h2>
                <p>
                    Estamos convencidos que la mayor riqueza es el conocimiento y el bienestar del ser humano. Distrutamos nuestro trabajo con el constante aprendizaje, contratando personas 
                    inteligentes con visiones amplias. La transferencia de conocimiento es un objetivo compartido y una filosofía fundamental. Esta estrategia hace que seamos una empresa que innova todos los días,
                    combinando la creatividad con la tecnología para desarrollar soluciones serias que resuelven problemas y que han obtenido el reconocimiento de compañías de clase mundial
                </p>
            </div>
            <div class="bloques_textos">
                <h2>
                    ++TECNOLOGÍA
                </h2>
                <p>
                    Unimos la creatividad con soluciones robustas, apoyados en nuestras filosofías de software propio. Por esto todas nuestras soluciones son hechas a la medida, incluyendo
                    los frameworks de creación de otras soluciones, administradores de contenidos, entre otros
                </p>
            </div>
            <div class="bloques_textos">
                <h2>
                    ++VENTAJAS
                </h2>
                <p>
                    Con el software a la medida usted obtiene innumerables ventajas, desde la adaptación de la solución a sus necesidades, hasta los cambios y adiciones que su proceso requiera
                    en el futuro, pasando por el ahorro de costos y la flexibilidad y escalamiento que necesita
                </p>
            </div>
            <div class="bloques_textos" style="color: green">
                <h2>
                    SEMBRAMOS UN ÁRBOL POR SU COMPRA
                </h2>
                <p>
                    Compromiso con la conservación: nuestro enfoque conservacionista con sentido social se apoya con nuestra fundación de siembra de árboles <b>(<a target="_blank" href="http://www.reddearboles.org">www.reddearboles.org</a>)</b>.
                </p>
            </div>
        </div>
    </div>
</div>
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center divServicesOur" id="descripcion_general">
            <h1>
                NUESTROS SERVICIOS
            </h1>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_controlpanel.jpg">
                </div>
                <h2>
                    SOFTWARE A LA MEDIDA
                </h2>
                <p>
                    Creamos aplicativos serios, que evolucionan a medida que su empresa lo hace, conservando estrictos parámetros de seguridad, juntando las mejores prácticas de las
                    organizaciones y uniendo todo en un único framework de desarrollo, haciendo que su aplicativo sea veloz, confiable y bastante seguro
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_system2.jpg">
                </div>
                <h2>
                    ARRIENDO DE SOFTWARE
                </h2>
                <p>
                    Tenemos más de 68 aplicativos de todo tipo, desde sistemas de facturación, hasta software de control de GPS, biométicos y controladores electrónicos. Por esto podemos ofrecer
                    sistemas con ventajas competitivas bajo la modalidad de arriendo, con la cual garantizamos el soporte, mejoramiento y disminución de costos
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/Mobile-Tablet-icon.jpg">
                </div>
                <h2>
                    APLICACIONES MÓVILES
                </h2>
                <p>
                    Nuestra tecnología siempre va más alla. Por esto pensamos en sistemas compatibles con la gran cantidad de dispositivos que existen actualmente, creando aplicativos
                    multiplataforma, accesibles desde cualquier lugar del mundo, sin importar si es un celular, una tablet o un computador de escritorio
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/PC-a-icon.jpg">
                </div>
                <h2>
                    DISEÑO WEB
                </h2>
                <p>
                    Con la combinación de herramientas potentes y un diseño adecuado, logramos mantener el equilibrio óptimo con nuestras interfaces visuales fáciles de manejar, familiarizando
                    al usuario con técnicas de visualizaciones gráficas amplias de registros y minimalismo en las composiciones, dando como resultado sistemas poderosos fáciles de usar
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_inhouse.png">
                </div>
                <h2>
                    PERSONAL INHOUSE
                </h2>
                <p>
                    Un buen sistema de información debe tener un buen soporte, acorde a las necesidades de nuestros clientes. Por esto nuestro personal conoce diferentes tipos de operaciones,
                    además de estar capacitados para brindarle la asistencia que usted necesita lo más rápido posible
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/Home-Server-icon.png">
                </div>
                <h2>
                    SERVIDORES 24/7
                </h2>
                <p>
                    Nuestra filosofía es el control en toda la cadena del proceso de software. Por esto nos esforzamos por mantener nuestros propios servidores y los de nuestros clientes 
                    en varias partes del país, con nuestros sistemas administrativos propios centralizados en nuestra dirección general. Con esto, podemos asegurar la calidad en el servicio al
                    tener el control total de nuestros procesos, los cuales adaptamos a la medida del crecimiento de nuestros clientes y nuestra organización
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/Settings-icon.png">
                </div>
                <h2>
                    SOPORTE DE SISTEMAS
                </h2>
                <p>
                    Inspiración e inteligencia: consideramos a la programación como un arte. Todos nuestros proyectos se nutren con la creatividad y genialidad de nuestra gente. 
                    Motivamos el desarrollo de nuestra estructura social por medio de la creatividad con resultados que siempre van más lejos de lo planteado, resolviendo problemas complejos en 
                    nuestros procesos diarios. Con estas directrices, por ejemplo, en la informalidad de nuestra estructura hemos creado ideas que pueden ser de uso mundial.
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes">
                <div class="bloquesFlotantesIMG">
                    <h1 style="
                        font-size: 70px;
                        font-weight: bold;
                        float: left;
                        margin: 25px;
                        "><span style="
                            color: firebrick;
                            ">N</span><span style="
                            color: #999;
                            ">W</span></h1>
                </div>
                <h2>
                    PLATAFORMAS PROPIAS
                </h2>
                <p>
                    Para muchas organizaciones, es de vital importancia moldear sus estructuras informáticas de acuerdo a su propio crecimiento. Por esto no usamos software de terceros,
                    asegurando la disminución frontal de costos y el monitoreo y control de todos nuestros aplicativos, repartidos a lo largo y ancho del país, junto con Perú, Ecuador y otros
                    países.
                </p>
            </div>
        </div>
    </div>
</div>
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center divServicesOur" id="descripcion_general">
            <h1>
                VISIÓN GENERAL DEL PROYECTO
            </h1>
            <p>Reciba un  Cordial Saludo:</p>
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial  para la implementación, desarrollo y sostenimiento de una plataforma 
                informática  que involucra el diseño y programación de su proyecto de <strong><?php echo $plan["nombre"] ?> <?php echo $r["titulo"] ?></strong>. No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
            <div class="bloque1">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.png" style="float: left;width: 400px; display: none;"  />
                <h2>
                    <?php echo $r["titulo"] ?>
                </h2>
                <p>
                    <?php echo $r["descripcion_general"] ?>
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes" style="text-align: center;">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_database2.png" />
                </div>
                <h2>
                    Base de datos:
                </h2>
                <p>
                    PostgreSQL+/ORACLE+/SQL SERVER+/MYSQL+/SQLite+/<b>NoSQL</b>
                    <br />
                    <br />
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes" style="text-align: center;">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_librery.png" />
                </div>
                <h2>
                    Librerías:
                </h2>
                <p>
                    QXNW Javascript (Cliente), NWPHP (Servidor)
                    <br />
                    <br />
                    <br />
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes" style="text-align: center;">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_php.png" />
                </div>
                <h2>
                    Lenguaje Servidor
                </h2>
                <p>
                    PHP 5+/Java
                    <br />
                    <br />
                    <br />
                </p>
            </div>
            <div class="bloques_textos bloquesFlotantes" style="text-align: center;">
                <div class="bloquesFlotantesIMG">
                    <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/icon_linux.png" />
                </div>
                <h2>
                    OS:
                </h2>
                <p>
                    Linux Server (sin costos de licenciamiento) / Windows Server
                    <br />
                    <br />
                    <br />
                </p>
            </div>
            <?php
            include 'changes.php';
            ?>
        </div>
    </div>
</div>
<!-- INICIO DE UNA PÁGINA -->
<?php
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
    encabezado();
    echo "<div id='contenedor1'>";
    echo "<div id='contenedor2'>";
    echo "<div class='bloques_text_center' id='modulos'>";
//    echo "<div class='bloques_textos'>";
    echo $rr["texto"];
//    echo "</div>";
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
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center" id="bases_datos">
            <div class="bloques_textos">
                <h1>
                    Arquitectura
                </h1>
                <p>
                    Sistema desarrollado bajo ambiente web <b><a target="_blank" href="https://es.wikipedia.org/wiki/Rich_Internet_application">RIA</a></b>, teniendo en cuenta los estándares internacionales de programación, con librerías de carga de datos veloces y eficaces, manteniendo interfaces visuales agradables para el usuario, asegurando su familiaridad con el software bajo ambientes Windows, Linux o Mac. Hecho en PHP y JAVASCRIPT. Será un programa robusto y eficiente, el cual podrá ser consultado desde cualquier parte del mundo, teniendo en cuenta las necesidades de su empresa.
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Seguridad
                </h1>
                Autenticación a través de usuario y contraseña, diferenciando como mínimo tres roles de usuario.
                <ul>
                    <li>
                        Auditoría de movimientos guardando todos los procesos ejecutados por los usuarios.
                    </li>
                    <li>
                        Log de errores presentados en la ejecución del aplicativo. 
                    </li>
                    <li>
                        Envío de errores a nuestra central con el reporte de la ejecución.
                    </li>
                    <li>
                        Sistema por perfiles.
                    </li>
                    <li>
                        Administración de permisos de vistas por:
                        <ul>
                            <li>
                                Crear
                            </li>
                            <li>
                                Editar 
                            </li>
                            <li>
                                Consultar
                            </li>
                            <li>
                                Eliminar
                            </li>
                            <li>
                                Exportar
                            </li>
                            <li>
                                Copiar
                            </li>
                            <li>
                                Consultar tablas dinámicas
                            </li>
                            <li>
                                Ver sólo mi regional
                            </li>
                        </ul>
                    </li>
                    <li>
                        Encriptación de contraseñas.
                    </li>
                    <li>
                        Sistema de cambios de claves. 
                    </li>
                    <li>
                        Parametrización de claves aceptadas, usuarios, entre otros.
                    </li>
                </ul>
            </div>
            <div class="bloques_textos">
                <h1>
                    Bases de Datos
                </h1>
                <p>
                    Sugerimos base de datos en PostgreSQL. No necesita licencia, lo cual asegura una reducción en los costos. Posee estrategias de almacenamiento para cargas de información de alto nivel y almacenamiento de volúmenes muy grandes. Cumple con los estándares de integridad referencial, replicación, vistas, triggers, secuencias, funciones, entre otros. Con esta base de datos aseguramos que el software será veloz, robusto y bastante seguro.
                    <br />
                    También puede usar Oracle, SQL Server, SQLITE, MYSQL, NoSQL Cassandra (Apache Foundation).
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Otros
                </h1>
                <ul>
                    <li>
                        Amables con el medio ambiente: políticas de no uso de papel.
                    </li>
                    <li>
                        Exportación de datos en Excel y PDF.
                    </li>
                    <li>
                        Soporte las 24 horas, los 7 días de la semana*.
                    </li>
                    <li>
                        Sistema de tiquets web para reportar posibles inconvenientes que surga con el software*.
                    </li>
                    <li>
                        Sistema hecho para la amplia visualización de la información en una sola pantalla.
                    </li>
                    <li>
                        Sistema de reportes de errores en línea: Cuando se genera un error, nuestros aplicativos recopilan toda la información d
                        e la causa, para luego ser enviado (si usted lo desea) a nuestra central de datos. De esta manera el sof
                        tware estará en constante evolución. Nos comunicaremos con usted en caso de errores graves o recurrentes del sistema.
                    </li>
                    <li>
                        Sistema de recarga en una única página: A diferencia de otras aplicaciones web, el aplicativo 
                        está desarrollado para que todo el trabajo se haga en una sola hoja, sin recargar la página en ningún momento.
                    </li>
                    <li>
                        Menús hechos  teniendo en cuenta la sencillez para el usuario. Creados con interfaces simples Mostrando familiaridad y al mismo tiempo un sistema robusto.
                    </li>
                    <li>
                        Sistema de semáforos: Indicativos visuales para mejorar el rendimiento del análisis de datos, teniendo en cuenta fechas y procesos. 
                        Verde para indicar que el caso se encuentra en proceso normal (0 a 20 días), amarillo para indicar que se está acabando el tiempo máximo  
                        de cierre(21 a 40 días) y rojo para evidenciar que la solución del caso está por encima de las fechas establecidas (41  o más días).
                    </li>
                    <li>
                        Maestros inteligentes: El sistema permite manipular toda la información del software desde los maestros, incluyendo   datos como ciudades, usuarios, 
                        cargos de los empleados,  tipos de semáforos, entre muchos otros.
                    </li>
                    <li>
                        Sistema por pestañas: Para mantener la fluidez en el trabajo del usuario, el sistema está diseñado por pestañas para cambiar de actividades en la misma página.
                    </li>
                    <li>
                        Sistema de filtros inmediatos: Filtros hechos para buscar y analizar la información más rápido. Por ejemplo, puede buscar un registro por cualquiera de sus campos, o por fechas, si lo desea.
                    </li>
                </ul>  
                <p style="font-style: oblique; font-size: 12px; color: #444;">
                    * Servicio disponible únicamente contratando uno de nuestros planes de soporte.
                </p>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center" id="tecnicos">
            <div class="bloques_textos">
                <h1>
                    Aspectos Técnicos
                </h1>
                <ul>
                    <li>
                        Sistema de carga por módulos para aumentar eficiencia, velocidad y manejo de memoria del equipo.
                    </li>
                    <li>
                        El portal Permitirá su navegación a través de los navegadores estándar del mercado y las diferentes plataformas (Windows, Mac, Linux).
                    </li>
                    <li>
                        Cualquier contenido permitirá el acceso desde dispositivos móviles (celulares, tablets, etc).
                    </li>
                    <li>
                        Diagramación HTML por medio de Divs utilizando XHTML y CSS bajo estándar W3C.
                    </li>
                    <li>
                        Se evitará el uso de Flash, utilizaremos componentes Ajax, Javascript y html5 para el caso de imágenes que realicen transiciones o animaciones.
                    </li>
                    <li>
                        No se implementarán frames o marcos.
                    </li>
                    <li>
                        Cada formulario y sus campos contendrán su correspondiente guía de ayuda.
                    </li>
                    <li>
                        Temas totalmente configurables.
                    </li>
                    <li>
                        Manejo inteligente de las configuraciones del usuario, quien puede adaptar el sistema a su estilo de trabajo.
                    </li>
                </ul>  
            </div>
            <div class="bloques_textos">
                <h1>
                    Soporte
                </h1>
                <ul>
                    <li>
                        Soporte y monitoreo de funcionalidad y estabilidad en la aplicación por 1 año*.
                    </li>
                    <li>
                        Actualización de librería central gratis el primer año.
                    </li>
                    <li>
                        Documentación. Librería central totalmente documentada bajo ambiente web, 
                        mostrando procesos de programación tales como clases, variables, métodos, funciones, propiedades, listados y formularios.
                    </li>
                    <li>
                        Acceso remoto externo desde nuestras oficinas para requerimientos críticos 
                        fuera de los horarios establecidos o atención de 2 y tercer nivel**.
                    </li>
                    <li>
                        Soporte vía chat en horarios establecidos**.
                    </li>
                    <li>
                        Soporte vía correo electrónico 24 horas**.
                    </li>
                    <li>
                        Soporte telefónico en horarios establecidos**.
                    </li>
                    <li>
                        Sistema de tickets con tiempo de respuesta máximo de 24 horas**.
                    </li>
                </ul> 
                <p style="font-style: oblique; font-size: 12px; color: #444;">
                    * Ver garantía.<br /><br />
                    ** Este servicio será válido durante el desarrollo de la aplicación. Posterior a la entrega a satisfacción el servicio estará
                    disponible únicamente contratando uno de nuestros planes de soporte.
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Requisitos de Uso de la Aplicación
                </h1>
                <ul>
                    <li>
                        Navegadores: Google Chrome, Firefox, IE 8 en adelante, Safari.
                    </li>
                    <li>
                        Memoria de 256M de RAM mínimo.
                    </li>
                    <li>
                        Sistema operativo: Windows Xp en adelante,  Mac OS, Linux.
                    </li>
                    <li>
                        Conexión a Internet (en algunos casos podemos instalar software local o en red). 
                    </li>
                </ul>
                En servidor (requisitos mínimos):
                <ul>
                    <li>
                        Memoria de 4G RAM mínimo.
                    </li>
                    <li>
                        Sistema operativo: Windows Server,  Linux (Ubuntu, Red Hat, openSUSE).
                    </li>
                    <li>
                        Mínimo 500G de disco.
                    </li>
                </ul>  
            </div>
            <div class="bloques_textos">
                <h1>
                    Etapas de Desarrollo
                </h1>
                <strong>Analista In House</strong><br />
                Para complementar el desarrollo a la medida de software, es necesario que nuestro personal esté presente en los procesos de su empresa por un tiempo determinado por el nivel de software que se pretenda realizar. De esta forma aseguramos que el resultado final será hecho a la medida de sus necesidades, de su personal, exactamente lo que busca.   
                <br />
                <strong>Etapa de producción</strong><br />
                Contando con el material y datos listos, empieza la etapa de producción, 
                en la que nuestros ingenieros se encargarán de realizar el complejo trabajo de programación y bases de datos. 
                Dependiendo del software requerido, el tiempo de desarrollo variará.
                <br />
                <strong>Etapa de asimilación</strong><br />
                Luego de la entrega, entramos a la etapa de asimilación, en la que el personal de nuestra empresa estará presente en las capacitaciones al personal, en la solución de inconvenientes y finalmente, en la entrega exitosa del producto.
                <br />
                <strong>Etapa Final</strong><br />
                Posterior a la entrega del software a conformidad, nuestro equipo seguirá haciendo un seguimiento periódico del comportamiento de las aplicaciones, con el fin de garantizarle una total satisfacción.
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center" id="escencials">
            <h1>
                CARACTERÍSTICAS DEL SOFTWARE
            </h1>
            <h2>Plataforma de Administración</h2>
            <p>En la plataforma podrá administrar usuarios, perfiles, contenidos y demás configuraciones para la aplicación.</p>
            <p style="text-align: center;">
                <img alt="" src="<?php echo $ruta_absoluta ?>/propuestas/imagenes/dashboard.jpg" style="width:800px">
            </p>
        </div>
        <div class="bloques_text_center">
            <h2>Reportes Estadísticas</h2>
            <p>
                Podrá generar estadísticas de uso, y también las que se generen a la medida.
            </p>
            <p style="text-align: center;">
                <img alt="" src="<?php echo $ruta_absoluta ?>/propuestas/imagenes/estadistica.jpg" style="width:800px">
            </p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<!--<div id="contenedor1">-->

    <!--<div id="contenedor2">-->
        <!--<div class="bloques_text_center" id="escencials">-->
<!--            <div class="bloques_textos bloque_img_right">
                <img src="/<?php // echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image009.jpg" />
                <h2>
                    COMPATIBILIDAD CON DISPOSITIVOS MÓVILES
                </h2>
                <p>
                    Sus clientes podrán navegar desde un SmartPhone, iPod, iPad, Tablet, computador de escritorio, PC portátil, 
                    NoteBook, sistemas operativos como Android, IOS, Blackberry, Windows Mobile o cualquier sistema operativo de computador de escritorio.
                    Sugerimos el uso de la plataforma en móviles para consultas, pues majera los formularios puede ser dispendioso.
                </p> 
            </div>-->
<!--            <div class="bloques_textos bloque_img_left">
                <img src="/<?php // echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image011.jpg" />
                <h2>
                    PLUGINS
                </h2>
                <p>
                    Su función principal es asistir al usuario en varias actividades, buscando
                    el uso continuo de la herramienta sin salir de ella, teniendo un chat,
                    notas personales, favoritos, sistema de alarmas, calculadora, NWDrive, NWCalculate,
                    notificaciones, búsqueda, PQR y soporte especializado.
                </p> 
            </div>-->
<!--            <div class="bloques_textos bloque_img_right">
                <img src="/<?php // echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image013.jpg" />
                <h2>
                    CHAT INTERACTIVO
                </h2>
                <p>
                    Chat corporativo con posibilidad de salas interactivas por grupos de empleados. 
                </p>
            </div>-->
<!--        </div>
    </div>
</div>-->
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center">
            <div class="bloques_textos bloque_img_left">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image015.jpg" />
                <h2>
                    NOTAS PERSONALES
                </h2>
                <p>
                    Plugin para el almacenamiento de las notas del usuario, las cuales son de
                    carácter privado. Dichas notas se almacenarán en el servidor centra y
                    podrán ser vistas desde cualquier parte del mundo y desde cualquier
                    dispositivo.
                </p>
            </div>
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image017.jpg" />
                <h2>
                    NOTIFICACIONES
                </h2>
                <p>
                    Sistema de notificaciones del sistema con avisos interactivos para
                    mantener al usuario informado de cambios en la plataforma, anuncios de
                    problemas, etc.   
                </p>
            </div>
            <div class="bloques_textos ">
                <h2>
                    CONFIGURACIÓN PERSONALIZADA
                </h2>
                <p>
                    Sistema de maestros inteligentes, temas y total configuración personalizada por cada sesión de usuario.  
                </p>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<!--<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center">
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php // echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/img_soporte_chatnw.png" style="height: 280px;" />
                <h2>
                    CHAT! SOPORTE EN VIVO
                </h2>
                <p>
                    Hemos creado nuestro sistema de soporte especializado con el cual
                    esperamos resolver cualquier duda que se presente en cualquiera de
                    nuestras líneas de negocio, manteniendo una comunicación fluída, rápida y
                    eficaz, pues nuestra mesa de ayuda estará disponible en cualquier momento
                    y desde cualquier lugar con el chat QXNW, un recurso propio para el
                    mejoramiento de nuestra compañía y de los procesos con nuestros clientes.  
                </p>
            </div>
            <br />
            <br />
            <br />
            <div class="bloques_textos bloque_img_left">
                <img src="/<?php // echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/img_pqrnw.png" style="width: 400px;" />
                <h2>
                    PQR PETICIONES QUEJAS O RECLAMOS
                </h2>
                <p>
                    Para nosotros lo más importante es la fidelización de nuestros clientes
                    con la mejora continua en todos los procesos y la atención al cliente. Por
                    esto hemos creado el aplicativo de Peticiones, Quejas y Reclamos, para
                    brindar una asistencia personalizada, seria y ágil de las quejas de todos
                    los componentes de la cadena de servicio. Contamos con 15 días hábiles
                    para resolver dichas quejas, las cuales serán auditadas directamente por
                    un grupo bajo la jefatura directa de la Gerencia General de nuestra
                    compañía.
                </p>

            </div>
            <br />
            <br />
            <br />
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php // echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/nwdrive/window1.jpg" style="width: 350px;" />
                <h2>
                    NW Drive
                </h2>
                <p>
                    Nuestro software posee como valor agregado el sistema NWDRIVE de almacenamiento de archivos en línea. Podrá compartir sus documentos con uno o varios usuarios
                    dentro del software.
                </p>

            </div>

        </div>
    </div>
</div>-->
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center" id="clientes">
            <h1>ALGUNOS DE NUESTROS CLIENTES</h1>
            <p><img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/logos_clientes.jpg" /></p>
            <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
                <a href="https://www.gruponw.com/clientes" style="color: blue;" target="_blank">https://www.gruponw.com/clientes</a>
            </p>
            <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<?php
encabezado();
?>
<div id="contenedor1">

    <div id="contenedor2">
        <div class="bloques_text_center">
            <?php
//            include "foot_prices_dos.php";
            include "foot_prices.php";
            ?>
            <div class="bloques_textos " id="contacto">
                <p>Visite  nuestra página Web para enterarse de otras características de nuestros productos: <a href="http://<?php echo $emp['web']; ?>" target="_blank"><?php echo $emp["web"]; ?></a></p>
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
                    <a href="http://<?php echo $emp['web']; ?>" target="_blank"><?php echo $emp["web"]; ?>
                    </a>
                </span>
                <br />
                <strong>
                    <?php echo $emp["razon_social"]; ?>
                </strong>
                <strong>
                    NIT. 900710977-1
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

