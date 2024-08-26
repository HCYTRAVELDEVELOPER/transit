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
            <img src="/nwlib/modulos/propuestas/imagenes/banner_diseno_web_2013_propuestas.png" />
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
            <div class="bloque1">
                <br />
                <h1>CARACTERÍSTICAS</h1>
                <br /><br />
                <p>
                    Planes sugeridos mensuales:
                </p>
                <table class="table_uno">
                    <tr>
                        <th>
                            PLAN
                        </th>
                        <th>
                            MODIFICACIONES
                        </th>
                        <th>
                            DISPONIBILIDAD
                        </th>
                        <th>
                            CMS NWPROJECT
                        </th>
                        <th>
                            CMS OTRO
                        </th>
                        <th>
                            CÓDIGO DIRECTO
                        </th>
                    </tr>
                    <tr>
                        <th>
                            BÁSICO
                        </th>
                        <td>
                            2
                        </td>
                        <td>
                            8am-5-pm/lun-Vier
                        </td>
                        <td>
                            $80.000
                        </td>
                        <td>
                            $140.000
                        </td>
                        <td>
                            $220.000
                        </td>
                    </tr>
                    <tr>
                        <th>
                            MEDIO
                        </th>
                        <td>
                            5
                        </td>
                        <td>
                            8am-5-pm/lun-Vier
                        </td>
                        <td>
                            $280.000
                        </td>
                        <td>
                            $340.000
                        </td>
                        <td>
                            $420.000
                        </td>
                    </tr>
                    <tr>
                        <th>
                            PREMIUM
                        </th>
                        <td>
                            10
                        </td>
                        <td>
                            8am-7-pm/lun-Sáb
                        </td>
                        <td>
                            $480.000
                        </td>
                        <td>
                            $540.000
                        </td>
                        <td>
                            $620.000
                        </td>
                    </tr>
                    <tr>
                        <th>
                            MASTER
                        </th>
                        <td>
                            30
                        </td>
                        <td>
                            7/24
                        </td>
                        <td>
                            $1'680.000
                        </td>
                        <td>
                            $1'820.000
                        </td>
                        <td>
                            $2.100.000
                        </td>
                    </tr>
                </table>
                <p>
                    CADA EDICIÓN TIENE UNA DURACIÓN DE 1 HORA MÁXIMO.
                    <br />
                    <br />
                    VALOR DISEÑO DE BANNERS: $90.000 UNIDAD
                    <br />
                    <br />
                    <span>
                        Nota: A los valores anteriores adicionarles IVA.
                    </span>
                </p>
            </div>
        </div>
        <div class="bloques_text_center">
            <strong>
                LA EDICIÓN INCLUYE:
            </strong>
            <br />
            <ul>
                <li>
                    Subida de textos. 
                </li>
                <li>
                    Carga de imágenes. 
                </li>
                <li>
                    Carga de documentos. 
                </li>
                <li>
                    Inserción de enlaces, noticias, información general. 
                </li>
            </ul>
            <p>
                <strong>TERMINOS Y CODICIONES</strong><br />                                                                                                                               .
                Los cambios se hacen un día después de la solicitud en el horario establecido por el plan seleccionado.
            </p>
            <p>
                <strong>Nota:</strong> <br />Por realizar el pago del servicio por un (1) año, tiene un descuento del 5% en Básico, Medio y Premium y 10% Master ya discriminado arriba.
            </p>
            <br /><br />
            Este presupuesto cubre los parámetros mencionados en el documento, cualquier adaptación adicional, deberá ser cotizada por aparte de acuerdo a características técnicas y complejidad.<br />
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
            <p style="text-align: center;">
                <img src="/nwlib/modulos/propuestas/imagenes/logos_clientes.png" />
            </p>
            <p align="center">
                En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:
                <a href="https://www.gruponw.com/clientes" style="color: blue;" target="_blank">https://www.gruponw.com/clientes</a>
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

