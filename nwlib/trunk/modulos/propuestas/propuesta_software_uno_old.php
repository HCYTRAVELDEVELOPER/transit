<?php 
global $id_propuesta;
?>
<div id="contenedor1">
    <?php
    encabezado_principal();
    ?>
    <div id="contenedor2">
        <h1 class="title1">
            <br /> <br /> <br />
            <?php echo $plan["nombre"] ?>
            <p>
                PROPUESTA TÉCNICA Y ECONÓMICA  <strong><?php echo $r["titulo"] ?></strong>
            </p>
        </h1>
        <br /> <br /> <br />
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

        </h2>
        <br /> <br /> <br /><br /><br />
        <div class="img1">
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.png" />
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

<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center" id="descripcion_general">
            <p>Reciba un  Cordial Saludo:</p>
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial  para la implementación, desarrollo y sostenimiento de una plataforma 
                informática  que involucra el diseño y programación de su proyecto de <strong><?php echo $plan["nombre"] ?> <?php echo $r["titulo"] ?></strong>. No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>
            <div class="bloque1">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.png" style="float: left;width: 400px; display: none;"  />
                <h1>
                    <?php echo $r["titulo"] ?>
                </h1>
                <p>
                    <?php echo $r["descripcion_general"] ?>
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Base de datos:
                </h1>
                <p>
                    PostgreSQL 9.1
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Librerías:
                </h1>
                <p>
                    QOOXDOO, QXNW, NWPHP
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Lenguaje Servidor:
                </h1>
                <p>
                    PHP 5
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    OS Sugerido:
                </h1>
                <p>
                    Linux Server
                    -Apache 2
                    -PHP5
                    -PHP-GD
                    -PHP-CURL
                    -PostgreSQL 9.1
                </p>
            </div>
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
    echo "<div id='contenedor1'>";
    encabezado();
    echo "<div id='contenedor2'>";
    echo "<div class='bloques_text_center' id='modulos'>";
    echo "<div class='bloques_textos'>";
    if ($ii == 0) {
        echo "<h1>Módulos</h1>";
    } else {
        echo "<h1 class='title_modulos'>Módulos</h1>";
    }
    echo $rr["texto"];
    echo "</div>";
    echo "</div>";
    echo "</div>";
    echo "</div>";
}
?>
<!-- FIN DE UNA PÁGINA -->
<!-- INICIO DE UNA PÁGINA -->
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center" id="bases_datos">
            <div class="bloques_textos">
                <h1>
                    Artiquectura
                </h1>
                <p>
                    Sistema desarrollado bajo ambiente web, teniendo en cuenta los estándares internacionales de programación, con librerías de carga de datos veloces y eficaces, manteniendo interfaces visuales agradables para el usuario, asegurando su familiaridad con el software bajo ambientes Windows, Linux o Mac. Hecho en PHP y JAVASCRIPT. Será un programa robusto y eficiente, el cual podrá ser consultado desde cualquier parte del mundo, teniendo en cuenta las necesidades de su empresa.
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
                    Base de datos en PostgreSQL. No necesita licencia, lo cual asegura una reducción en los costos. Posee estrategias de almacenamiento para cargas de información de alto nivel y almacenamiento de volúmenes muy grandes. Cumple con los estándares de integridad referencial, replicación, vistas, triggers, secuencias, funciones, entre otros. Con esta base de datos aseguramos que el software será veloz, robusto y bastante seguro.
                </p>
            </div>
            <div class="bloques_textos">
                <h1>
                    Otros
                </h1>
                <ul>
                    <li>
                        Actualizaciones de la librería central por 1 año gratis.
                    </li>
                    <li>
                        Amables con el medio ambiente: políticas de no uso de papel.
                    </li>
                    <li>
                        Exportación de datos en Excel y PDF.
                    </li>
                    <li>
                        Selección de las mejores librerías para aplicaciones web.
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
<div id="contenedor1">
    <?php
    encabezado();
    ?>
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
                        Navegadores: Google Chrome, Firefox, IE 8 en adelante.
                    </li>
                    <li>
                        Memoria de 256M de RAM mínimo.
                    </li>
                    <li>
                        Sistema operativo: Windows Xp en adelante,  Mac OS, Linux.
                    </li>
                    <li>
                        Conexión a Internet.
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
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center" id="escencials">
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image009.jpg" />
                <h1>
                    COMPATIBILIDAD CON DISPOSITIVOS MÓVILES
                </h1>
                <p>
                    Sus clientes podrán navegar desde un SmartPhone, iPod, iPad, Tablet, computador de escritorio, PC portátil, 
                    NoteBook, sistemas operativos como Android, IOS, Blackberry, Windows Mobile o cualquier sistema operativo de computador de escritorio.
                </p> 
            </div>
            <div class="bloques_textos bloque_img_left">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image011.jpg" />
                <h1>
                    PLUGINS
                </h1>
                <p>
                    Su función principal es asistir al usuario en varias actividades, buscando
                    el uso continuo de la herramienta sin salir de ella, teniendo un chat,
                    notas personales, favoritos, sistema de alarmas, calculadora,
                    notificaciones, búsqueda, PQR y soporte especializado.
                </p> 
            </div>
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image013.jpg" />
                <h1>
                    CHAT INTERACTIVO
                </h1>
                <p>
                    Chat corporativo con posibilidad de salas interactivas por grupos de empleados. 
                </p>
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
            <div class="bloques_textos bloque_img_left">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image015.jpg" />
                <h1>
                    NOTAS PERSONALES
                </h1>
                <p>
                    Plugin para el almacenamiento de las notas del usuario, las cuales son de
                    carácter privado. Dichas notas se almacenarán en el servidor centra y
                    podrán ser vistas desde cualquier parte del mundo y desde cualquier
                    dispositivo.
                </p>
            </div>
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/image017.jpg" />
                <h1>
                    NOTIFICACIONES
                </h1>
                <p>
                    Sistema de notificaciones del sistema con avisos interactivos para
                    mantener al usuario informado de cambios en la plataforma, anuncios de
                    problemas, etc.   
                </p>
            </div>
            <div class="bloques_textos ">
                <h1>
                    CONFIGURACIÓN PERSONALIZADA
                </h1>
                <p>
                    Sistema de maestros inteligentes, temas y total configuración personalizada por cada sesión de usuario.  
                </p>
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
            <div class="bloques_textos bloque_img_right">
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/img_soporte_chatnw.png" style="height: 400px;" />
                <h1>
                    CHAT! SOPORTE EN VIVO
                </h1>
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
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/img_pqrnw.png" style="width: 550px;" />
                <h1>
                    PQR PETICIONES QUEJAS O RECLAMOS
                </h1>
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
            <h1 class="title1" id="requerimientos">
                REQUERIMIENTOS A RECIBIR POR PARTE DEL  CLIENTE
            </h1>
            <ul type="disc">
                <li>
                    Logotipo en formato editable.
                </li>
                <li>
                    Manual de Imagen Corporativa (Tipografía, Colores, Manejo de Fondos, imágenes de stock).
                </li>
                <li>
                    Fotografías, imágenes y/o ilustraciones a ser incluidas en formato digital en cualquiera de las siguientes extensiones:
                    JPG, GIF, PNG, PSD, CDR. Mínimo 72 dpi.
                </li>
                <li>
                    Textos en cualquiera de los siguientes formatos: .DOC, RTF, TXT, XLS, PDF.
                </li>
                <li>
                    Archivos para descarga en cualquier Extensión o Formato.
                </li>
                <li>
                    Posterior o durante la entrega, el cliente deberá alimentar la información de la aplicación, como son los maestros, textos,
                    parametrizaciones, usuarios y demás opciones propios de uso del administrador.
                </li>
            </ul>
            <p>&nbsp;</p>
            <p>Formatos para recepción de material</p>
            <ul>
                <li>Formato físico:  Catálogos, folletos, volantes, tarjetas de  presentación. Todo esto en buen estado y tamaño.</li>
                <li>Formato digital:<img src="http://www.netwoods.net/imagenes/propuesta_d_pyme_clip_image002.jpg" alt="" width="336" height="68" /></li>
                <li>Formato en los siguientes programas:  Photoshop Cs2,                Corel Draw,  paquete de office 2007.</li>
            </ul>
            <p>
                <img src="http://www.netwoods.net/imagenes/propuesta_d_pyme_clip_image004.jpg" alt="" width="336" height="78" /> 
            </p>
            <!--            <h1 class="title1" id="capacitacion">
                            CAPACITACIÓN
                        </h1>
                        <p>
                            Capacitación  sobre administración del sistema.  <br />
                            Capacitación sobre uso, administración y alimentación de las diferentes parametrizaciones del software.<br />
                            Asistentes: 4 integrantes por sesión máximo.<br />
                            Duración: 6 horas distribuidas en máximo 2 sesiones.
                        </p>-->
            <h1 class="title1" id="garantias">
                GARANTÍAS
            </h1>
            <p>El  sistema de información tendrá una garantía limitada de 1 (UN) AÑO sobre los  productos que entregamos  por defectos de  fabricación
                o por defectos en el código fuente que ocasione mal funcionamiento.  
                Esta garantía cubre cualquier falla técnica o lógica no detectada en la etapa  de pruebas o Instalación.
            </p>
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
        <div class="bloques_text_center" id="clientes">
            <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
            <p><img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/logos_clientes.png" /></p>
            <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
                <a href="https://www.gruponw.com/clientes" style="color: blue;" target="_blank">https://www.gruponw.com/clientes</a>
            </p>
            <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
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
            include "foot_prices_dos.php";
            ?>
            <div class="bloques_textos ">
                <h1>
                    NETWOODS, ESPECIALISTAS EN SOFTWARE Y DISEÑO WEB
                </h1>
                <p>
                    Nos  especializamos por crear páginas web y software de muy alta calidad,  
                    conservando unos estrictos parámetros de diseño y calidad mediante sistemas propios de control de tiempos, efectividad y eficiencia. 
                    Nuestra meta es la absoluta satisfacción de nuestros  usuarios en cualquiera de nuestras líneas de productos. 
                    Contamos con personal  altamente calificado, quienes no son sólo programadores; 
                    también poseen formas  de ver el diseño de software como un arte.  
                </p>
                <h4>Nuestros productos son casi artesanales, hechos  pieza a pieza sin repeticiones. </h4>
            </div>

            <p>Soporte técnico línea telefónica  <strong>(57)(1) 7022562 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
                Horario extendido soporte técnico cel <strong>3125734295 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
                <a href="http://www.netwoods.net">www.netwoods.net</a>.</p>
            <div class="bloques_textos " id="contacto">
                <p>Visite  nuestra página Web para enterarse de otras características de nuestros productos: <a href="http://<?php echo $emp['web']; ?>" target="_blank"><?php echo $emp["web"]; ?></a></p>
                <p>Cordialmente, </p>
                <br />
                <?php
                $query = pg_exec("select a.id,b.firma, a.usuario, b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
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
                <span>Fecha de Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

