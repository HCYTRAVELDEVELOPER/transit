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
            <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.png" />
        </div>
    </div>
</div>

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

<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <div class="bloque1">
                <br />
                <h1>CARACTERÍSTICAS</h1>
                <strong> Beneficios: </strong>
                <br />
                <ul>
                    <li>
                        Amplio ahorro de costos de mantenimiento
                    </li>
                    <li>
                        Servicio estratégico, pues no requiere una persona en sitio tiempo completo
                    </li>
                    <li>
                        Se evita el manejo de movimientos burocráticos de contratación
                    </li>
                    <li>
                        Cuenta con la asesoría de toda una empresa y un grupo de expertos
                        para el manejo de sus necesidades tecnológicas.
                    </li>
                    <li>
                        Sin contratos ni cláusulas de permanencia
                    </li>
                    <li>
                        Puede aumentar el tiempo contratado en cualquier momento
                    </li>
                    <li>
                        Aumento del tiempo de duración de sus equipos
                    </li>
                    <li>
                        Blindaje de su organización al evitar software pirata o virus
                        informáticos
                    </li>
                    <li>
                        Manejo profesional de sus backups, evitando a toda costa la pérdida
                        de información
                    </li>
                    <li>
                        Perfeccionamiento de sus recursos tecnológicos incluida la red
                    </li>
                </ul>
                <strong> Incluye: </strong>
                <br />
                <ul>
                    <li>
                        Visita presencial de un asesor de soporte. 
                    </li>
                </ul>
                <strong> Actividades:</strong>
                <br />
                <ul>
                    <li>
                        Diagnósticos del equipo informático 
                    </li>
                    <li>
                        Análisis de requerimientos técnicos de software y hardware.
                    </li>
                    <li>
                        Planeación anticipada de actualizaciones.
                    </li>
                    <li>
                        Mantenimientos preventivos.
                    </li>
                    <li>
                        Mantenimientos correctivos.
                    </li>
                    <li>
                        Planeación de modelos de seguridad
                    </li>
                    <li>
                        Planeación de sincronizaciones de versiones de sistemas operativos.
                    </li>
                    <li>
                        Amplio soporte en servidores Linux y Windows.
                    </li>
                    <li>
                        Asesorías en adquisición y búsqueda de software.
                    </li>
                    <li>
                        Amplio soporte en funciones avanzadas de Excel (macros, tablas
                        dinámicas, fórmulas, entre otros). 
                    </li>
                    <li>
                        Sincronización homogénea de programas.
                    </li>
                    <li>
                        Soporte en sistemas operativos Windows, Linux, Mac, redes,       
                        impresoras, antivirus, navegadores, programas externos, paquetes como Office, Libreoffice.
                    </li>
                    <li>
                        Solución inmediata de todo tipo de errores.
                    </li>
                    <li>
                        Control de software pirata.
                    </li>
                    <li>
                        Configuraciones de correos electrónicos en cualquier herramienta.
                    </li>
                    <li>
                        Backups de información
                    </li>
                    <li>
                        Soporte de estructuras de redes
                    </li>
                    <li>
                        Soporte de recursos compartidos
                    </li>
                </ul>
                <strong>  Adicionales: </strong>
                <br />
                <ul>
                    <li>
                        Disposición de nuestro equipo de expertos cuando sea necesario o cuando el
                        inconveniente sea muy grave.  
                    </li>
                </ul>

                <strong>Traslados:</strong>
                <br />
                <ul>
                    <li>
                        Seleccionaremos al personal idóneo para los traslados (Viáticos, estadía y
                        transporte no incluidos). 
                    </li>
                </ul>

                <strong>Otros:</strong>
                <br />
                <ul>
                    <li>
                        Acceso remoto externo desde nuestras oficinas para requerimientos críticos
                        fuera de los horarios establecidos o atención de 2 y tercer nivel.
                    </li>
                </ul>

                <strong>Condiciones de la cotización:</strong>
                <br />
                <ul>
                    <li>
                        Horario: 1 día a la semana 8am a 5pm.
                    </li>
                    <li>
                        Es un requisito primordial mantener el registro de la entrada a sus
                        instalaciones del personal de soporte.
                    </li>
                    <li>
                        Condiciones de trabajo: parqueadero, acceso a equipos y autorizaciones
                        requeridas.
                    </li>
                    <li>
                        Incremento anual teniendo en cuenta el aumento del salario mínimo
                    </li>
                </ul>
            </div>
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
            <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
            <p style="text-align: center;"><img src="<?php echo $ruta_absoluta ?>propuestas/imagenes/logos_clientes.png" /></p>
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

            <p>Soporte técnico línea telefónica  <strong>(57)(1) 681 7688 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
                Horario extendido soporte técnico cel <strong>312 4379339 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
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
                <span>Fecha de Impresión: <?php echo date("Y-m-d"); ?></span>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

