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
    <br />
    <br />
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
    <br />
    <br />
    <br />
    <h2 style="color: #555;">
        Señores: <?php echo $prd["nombre"] ?>
        <br />
        At: <?php echo $prd["nombre_contacto"] ?>

    </h2>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <div class="img1">
        <img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/dispositives_init.png" style="width: auto!important;" />
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
                Con <strong style="color: red">Nw Task & Work</strong> nunca olvidará una tarea!
                <br />
                <br />
                Nw Task & Work es un gestor de tareas dinámico, donde puede gestionar su tiempo y optimizar los procesos de nuestras tareas diarias. 
                Con esta aplicación podrá crear una tarea en su calendario, organizar su agenda, crear grupos de trabajo, asignar tareas a su grupo de trabajo o a cualquier usuario, crear un cronograma de un proyecto, <b>ver las tareas que han sido desarrolladas en tiempo real</b>, recibir notificaciones y tener el control de los procesos propios o de su grupo de trabajo.
                <br />
                <br />
                También le muestra sus tareas por rangos de fechas. De esta forma organiza las tareas por prioridad, mostrando las de mayor prioridad de acuerdo a la fecha final. Si la fecha final está a punto de vencerse, le advertirá y organizará las tareas por carpetas.
            </p>
            <p style="text-align: center;" >
                <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/img1.jpg" style="height:500px;" >
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
<?php echo $abre_contenedor1 ?>
<?php
encabezado();
?>
<div id="contenedor2">
    <div class="bloques_text_center">
        <h1>Interfaz</h1>
        <p>
            La plataforma de tareas diarias contiene varios módulos integrados, que hacen robusta y completa la herramienta web. Tendrá notificaciones por correo electrónico.
        </p>
        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/27_10_2014/task1.png" style="width:800px!important;">
        </p>
    </div>
    <div class="bloques_text_center">
        <h1>Vista Amigable</h1>
        <p style="
           float: left;
           width: 300px;
           padding: 0;
           ">
            Nos hemos esforzado por crear una plataforma simple, de fácil manejo, sin complicaciones. La interfaz gráfica es amigable, con todo lo que se necesita a máximo 1 click.
        </p>
        <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/27_10_2014/task2.png" style="width:600px!important; float:right;">
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
        <h1>Opciones, avances, tiempo de ejecución.</h1>
        <p style="float: left;width: 300px;padding: 0;">
            <b>Avances</b>: Se pueden agregar avances a una tarea de forma fácil, de modo que se pueda llevar la trazabilidad hasta su cierre.<br />
            <b>Transferir</b>: Se puede trasladar una tarea a otro colaborador, con las respectivas observaciones.<br />
            <b>Devolver</b>: Hay casos en los que se debe devolver una tarea, ya sea por falta de información, datos incorrectos, entre otros.<br />
            <b>Finalizar y devolver: </b>: Una tarea se puede finalizar y devolver a su creador, para que haga una revisión y proceda a cerrarla completamente.<br />
            <b>Tareas asociadas: </b>: Una tarea se puede asociar a otras para llevar la trazabilidad desde la primera creada hasta el cierre del grupo de tareas.<br />
        </p>
        <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/27_10_2014/task3.png" style="width:600px!important; float:right;">
    </div>
    <div class="bloques_text_center">
        <h1 style="text-align: right;">Vista de calendario</h1>
        <p style="float: right;width: 300px;padding: 0;">
            La facilidad de ver las tareas en calendario es muy importante, pues de este modo se podrán ver los datos de forma ágil, mejorando la velocidad de administración y reemplazando 
            otros programas, evitando reprocesos de información.
            Podrá ver sus tareas en dos tipos de vista:
            <br />
            Vista mensual
            <br />
            Vista semanal
        </p>
        <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/27_10_2014/task4.png" style="width:600px!important; float:left;">
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
        <h1>Plataforma de Administración</h1>
        <ul>
            <li>
                En la plataforma podrá administrar usuarios, perfiles, contenidos y demás configuraciones para la aplicación.
            </li>
            <li>
                Puede verificar la ubicación de su grupo o personal en tiempo real.
            </li>
            <li>
                Esta plataforma funciona en cualquier navegador (IE, chrome, firefox, safari, etc), incluso en cualquier sistema operativo (mac, linux, windows). Solo necesita tener
                conexión a internet para poder administrarla. No será necesario instalar una aplicación o plugin adicional.
            </li>
            <li>
                Podrá obtener <b>estadísticas</b> de productividad, visitas, recordatorios, entre otros. 
            </li>
        </ul>

        <p style="text-align: center;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/nwtaskAdmin2.jpg" style="width: 850px!important;">
        </p>
    </div>
    <div class="bloques_text_center">
        <h1>Tareas, Agenda, Clientes, todo en uno!</h1>
        <ul>
            <li>
                Asignación de tareas, citas de la semana, mes o día.
            </li>
            <li>
                Seguimiento de tarea, con fechas automáticas de cierre.
            </li>
            <li>
                Priorización de tareas y citas automáticas
            </li>
            <li>
                Notificaciones automáticas
            </li>
            <li>
                Versión aplicación móvil para Smartphone.
            </li>
            <li>
                Tareas grupales
            </li>
            </p>
        </ul>
        <div style="text-align: center;" >
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/movil1.png" style="float: none; width: 300px;">
            <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/movil2.png" style="float: none; width: 300px;">
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
        <h1>Comunicaciones por correo electrónico</h1>
        <p style="padding: 0;">
            Todos los movimientos se pueden copiar al creador de la tarea, los avances, el cierre total de una tarea. Esto es opcional, lo cual asegura que los creadores siempre estarán informados de los movimientos de los procesos.
        </p>
        <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/taskMailOutlook.png" style="width:800px!important; ">
    </div>
    <div class="bloques_text_center">
        <h1>Espacio de archivos (nwdrive)*</h1>
        <p style="padding: 0;">
            Con este aplicativo el control documental es bastante fácil, todo en la nube, con la auditoría corporativa que más le convenga. Podrá compartir archivos con los demás usuarios, 
            asignar permisos de escritura, lectura y descarga. Adicional a esto podrá tener un log de movimientos de dichos archivos, generando una alta trazabilidad. Podrá compartir sus archivos sin importar la ubicación geográfica del grupo de trabajo.
        </p>
        <img alt="" src="<?php echo $ruta_absoluta ?>propuestas/imagenes/task/27_10_2014/taskDrive1.png" style="width:800px!important;">
        <br />
        <font style="color: gray">* Con limitaciones de hasta 100M de subida de archivos. Consulte con su ejecutivo de cuentas sobre este servicio.</font>
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
    <div id="contenedor1" style="position: relative; width: 1000px; height: auto; z-index: 1; margin: auto; min-height: 1000px; padding: 5px; color: rgb(0, 0, 0); font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: normal; background-image: initial; background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
        <div id="contenedor2" style="position: relative; height: auto; z-index: 1; margin: auto; padding: 5px 20px;">
            <div class="bloques_text_center" style="color: rgb(89, 89, 89); margin: 5px 20px 10px; text-align: justify; font-size: 14px; overflow: hidden;">
                <div class="bloque1" style="position: relative; overflow: hidden;">
                    <h1>CARACTER&Iacute;STICAS DE SOPORTE TÉCNICO</h1>
                    &nbsp;

                    <table class="table_uno" style="border-collapse:collapse; max-width:700px">
                        <tbody>
                            <tr>
                                <th>TIPOS</th>
                                <th>REMOTO</th>
                                <th>LLAMADA</th>
                                <th>CHAT EN L&Iacute;NEA</th>
                                <th>PRESENCIAL</th>
                                <th>DISPONIBILIDAD HORAS/ MES</th>
                                <th>MANTENIMIENTO</th>
                                <th>TIEMPOS DE RESPUESTA</th>
                            </tr>
                            <tr>
                                <th>B&Aacute;SICO</th>
                                <td style="text-align:center">&nbsp;</td>
                                <td style="text-align:center">&nbsp;</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">&nbsp;</td>
                                <td style="text-align:center">2 horas/Lunes - Viernes</td>
                                <td style="text-align:center">&nbsp;</td>
                                <td style="text-align:center">48 HORAS</td>
                            </tr>
                            <tr>
                                <th>MEDIO</th>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">&nbsp;</td>
                                <td style="text-align:center">3 horas/Lunes - Viernes</td>
                                <td style="text-align:center">&nbsp;</td>
                                <td style="text-align:center">48 HORAS</td>
                            </tr>
                            <tr>
                                <th>PREMIUM</th>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">Hasta 6 horas mes</td>
                                <td style="text-align:center">8 horas/Lunes - Viernes</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">18 HORAS</td>
                            </tr>
                            <tr>
                                <th>MASTER</th>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">8 horas mes</td>
                                <td style="text-align:center">12 horas/Lunes - Domingo</td>
                                <td style="text-align:center">X</td>
                                <td style="text-align:center">5 HORAS</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bloques_text_center" style="color: rgb(89, 89, 89); margin: 5px 20px 10px; text-align: justify; font-size: 14px; overflow: hidden;">&nbsp;
                <p><strong>MANTENIMIENTO INCLUYE:</strong>&nbsp;<br />
                    1. Aplicativo&nbsp;<br />
                    2. Base de Datos (mejora de la velocidad de las transacciones, reorganizaci&oacute;n de &iacute;ndices, mejora en la velocidad de las consultas)<br />
                    3. Servidor (limpieza de cach&eacute;, verificaci&oacute;n de cortafuegos, an&aacute;lisis de virus, reinicio de servicios, mejora de velocidad)</p>
                &nbsp;

                <p><strong>DESCRIPCION DETALLADA:</strong><br />
                    <strong>BASICO:</strong>&nbsp;Soporte v&iacute;a chat m&aacute;ximo 2 horas al mes. Disponibilidad 8 horas del d&iacute;a, los 5 d&iacute;as de la semana (de lunes a viernes de 8:00am a 5:30pm).<br />
                    <strong>MEDIO:</strong>&nbsp;Soporte remoto, soporte telef&oacute;nico m&aacute;ximo 3 horas al mes. Disponibilidad 8 horas del d&iacute;a, los 5 d&iacute;as de la semana (de lunes a viernes de 8:00am a 5:30pm).<br />
                    <strong>PREMIUM:</strong>&nbsp;Soporte remoto, soporte telef&oacute;nico m&aacute;ximo 8 horas al mes, visita in House de 6 horas. Disponibilidad 8 horas del d&iacute;a, los 5 d&iacute;as de la semana (de lunes a viernes de 8:00am a 5:30pm), mantenimiento mensual<br />
                    <strong>MASTER:</strong>&nbsp;Soporte remoto, soporte telef&oacute;nico m&aacute;ximo 12 horas al mes, visita in House de 8 horas. Disponibilidad 24 horas del d&iacute;a, los 7 d&iacute;as de la semana, mantenimiento mensual</p>

                <p><strong>Condiciones de la cotizaci&oacute;n:</strong><br />
                    -Es un requisito primordial mantener el registro de la entrada a sus instalaciones del personal de soporte.<br />
                    -Condiciones de trabajo: parqueadero, acceso a equipos y autorizaciones requeridas.<br />
                    -Incremento anual teniendo en cuenta el aumento del salario m&iacute;nimo</p>
                &nbsp;

                <p><strong>TERMINOS Y CODICIONES</strong><br />
                    . Las visitas se realizan de lunes a viernes, de 8:00 a.m. a 6:00 p.m. teniendo en cuenta antes la disponibilidad del desarrollador.</p>

                <h1 style="text-align:justify">OFERTA COMERCIAL</h1>

                <table class="table_uno" style="border-collapse:collapse; color:rgb(89, 89, 89); font-family:open sans,helvetica neue,helvetica,arial,sans-serif; font-size:14px; line-height:normal; text-align:right">
                    <tbody>
                        <tr>
                            <th>PLAN</th>
                            <th>VALOR MENSUAL</th>
                            <th>VALOR ANUAL</th>
                        </tr>
                        <tr>
                            <th>B&Aacute;SICO</th>
                            <td style="text-align:center">$85.000 PESOS + IVA</td>
                            <td style="text-align:center">$969.000 PESOS + IVA</td>
                        </tr>
                        <tr>
                            <th>MEDIO</th>
                            <td style="text-align:center">$360.000 PESOS + IVA</td>
                            <td style="text-align:center">$4.104.000 PESOS + IVA</td>
                        </tr>
                        <tr>
                            <th>PREMIUM</th>
                            <td style="text-align:center">$789.000 PESOS + IVA</td>
                            <td style="text-align:center">$8.994.600 PESOS + IVA</td>
                        </tr>
                        <tr>
                            <th>MASTER</th>
                            <td style="text-align:center">$1.599. 000 PESOS + IVA</td>
                            <td style="text-align:center">$17.269.200 PESOS + IVA</td>
                        </tr>
                    </tbody>
                </table>

                <p style="text-align:justify"><strong>Nota:</strong>&nbsp;<br />

                    Por realizar el pago del servicio por un (1) a&ntilde;o, tiene un descuento del 5% en B&aacute;sico, Medio y Premium y 10% Master ya discriminado arriba.</p>

                <p><span style="color:rgb(89, 89, 89); font-family:open sans,helvetica neue,helvetica,arial,sans-serif; font-size:14px">Este presupuesto cubre los par&aacute;metros mencionados en el documento, cualquier adaptaci&oacute;n adicional, deber&aacute; ser cotizada por aparte de acuerdo a caracter&iacute;sticas t&eacute;cnicas y complejidad.</span></p>

                <p><strong><span style="color:rgb(89, 89, 89); font-family:open sans,helvetica neue,helvetica,arial,sans-serif; font-size:14px">Por la compra del plan PREMIUM o MASTER&nbsp;Incluye actualizaciones semestrales gratuitas.</span></strong></p>
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
        <br />
        <br />
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

