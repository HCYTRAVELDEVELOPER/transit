<div id="contenedor1">
    <?php
    encabezado_principal();
    ?>
    <div id="contenedor2">
        <div class="img1">
            <br />
            <?php if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") { ?>
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/pr.jpg" class="imgEncPortada"/>
            <?php } else { ?>
                <img src="/imagenes/PortadaLitecar.png" class="imgEncPortada"/>

            <?php } ?>
        </div>
        <div class="divTitleEnc">
            <h1 class="title1">
                <?php echo $r["titulo"] ?>
                <p>
                    PROPUESTA TÉCNICA Y ECONÓMICA  <strong><?php echo $r["titulo"] ?></strong>
                </p>
            </h1>
            <?php if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") { ?>
                <img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/ban3.png" style="float: left;width: 400px;" />
            <?php } else { ?>
                <img src="/imagenes/SubPortadaLitecar.png" class="imgEncPortada"/>

            <?php } ?>

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
<!--            <p>Reciba un  Cordial Saludo:</p>
            <p>Para  nosotros es grato poner en consideración de usted la siguiente oferta comercial <strong><?php echo $r["titulo"] ?></strong>. 
                No obstante, es necesario  recordar que podemos ofrecer otro tipo de aplicaciones dependiendo de sus  necesidades y de su presupuesto.</p>-->
            <div class="bloque1">
                <h1 style="margin:1px; padding: 3px;">
                    <?php echo $r["titulo"] ?>
                </h1>
                <div>
                    <?php echo $r["descripcion_general"] ?>
                </div>
            </div>
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
        echo '<th style="text-align: center;width: 150px;"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;&nbsp;</span></th>';
        echo '<th style="text-align: center;width: 80px;"><span style="color:#000000;">% de Ahorro</span></th>';
        echo '<th style="text-align: center;width: 120px;"><span style="color:#000000;">Valor Unidad </span></th>';
        echo '<th style="text-align: center;width: 120px;"><span style="color:#000000;">Valor Total</span></th></tr>';
        for ($i = 0; $i < count($tarifas); $i++) {
//            print_r($tarifas[$i]);
            echo '<tr><td style="text-align: center; width: 400px;">' . $tarifas[$i]["rango_final"] . ' por ' . $tarifa["unidad_medida"] . '</td>
			<td style="text-align: center;">' . $tarifas[$i]["ahorro"] . '</td>
			<td style="text-align: center;">$ ' . $tarifas[$i]["subtotal"] . '</td>
			<td style="text-align: center;">$ ' . number_format($tarifas[$i]["subtotal"] * $tarifas[$i]["rango_final"]) . '</td></tr>';
        }

        if (is_null($propuesta["valor_adicional_negociacion"])) {
            $propuesta["valor_adicional_negociacion"] = 0;
        }

        echo '</tbody></table><p>&nbsp;</p>';
        echo '<p style="text-align: center;">&nbsp;</p>
<p style="text-align: center;">&nbsp;</p>
<p><strong>Notas: </strong></p>
<ul>
	<li>*Todos los valores son por paquete adquirido por el cliente.</li>
	<li>Valor unidad por ' . $tarifa["unidad_medida"] . ' adicional $ ' . number_format($propuesta["valor_adicional_negociacion"]) . ' .</li>
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
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <?php
         //   echo "jajajaj";
            include "foot_prices.php";
            ?>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->
<?php if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") { ?>
    <!-- INICIO DE UNA PÁGINA -->
    <div id="contenedor1">
        <?php
        encabezado();
        ?>
        <div id="contenedor2">
            <div class="bloques_text_center">
                <h1 class="title1">ALGUNOS DE NUESTROS CLIENTES</h1>
                <p><img src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/modulos/propuestas/imagenes/logos_clientes.png" /></p>
                <p align="center">En el siguiente link encontrará mayor información de nuestros clientes y trabajos realizados:<br />
                    <a href="https://www.gruponw.com/clientes" style="color: blue;" target="_blank">https://www.gruponw.com/clientes</a>
                </p>
                <p align="center">Esta información es de carácter  confidencial y por lo tanto legalmente protegida. Está dirigida únicamente a quien se le  presente esta propuesta. </p>
            </div>
        </div>
    </div>

<?php } ?>
<!-- FIN DE UNA PÁGINA -->

<!-- INICIO DE UNA PÁGINA -->
<div id="contenedor1">
    <?php
    encabezado();
    ?>
    <div id="contenedor2">
        <div class="bloques_text_center">
            <?php if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") { ?>
                <p>Soporte técnico línea telefónica  <strong>(57)(1) 7022562 </strong> lunes a viernes 8:00 am. a 6:00 pm.<br />
                    Horario extendido soporte técnico cel <strong>3125734295 </strong>para casos excepcionales  fuera de los horarios establecidos, vía ONLINE   
                    <a href="http://www.netwoods.net">www.netwoods.net</a>.</p>
            <?php } ?>
            <div class="bloques_textos ">
                <?php if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") { ?>
                    <p>Visite  nuestra página Web para enterarse de otras características que tienen nuestros  productos.<br />
                        <a href="http://<?php echo $emp["web"]; ?>" target="_blank">
                            <?php echo $emp["web"]; ?>
                        </a>
                    </p>
                <?php } ?>
                <br />
                <p>Cordialmente, </p>
                <br />
                <?php
                $query = pg_exec("select a.id, a.usuario,b.firma, b.usuario as nom_usuario,b.apellido, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
                        where a.id =" . $_GET["id"]);
                $user = pg_fetch_array($query);
//                if (isset($user["firma"])) {
//                    if ($user["firma"] != "") {
                if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") {
                    echo "<strong><img src='https://nwadmin.gruponw.com//imagenes/nwgroupw_2015_06_24_17_49_35.png' width='150' /></strong><br />";
                }
                //                    }
                //                }
                echo "<strong>" . $user["nombre"] . " " . $user["apellido"] . "</strong><br />";
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
                <span>Fecha de Impresión: <?php echo date("Y-m-d H:i:s"); ?></span>
            </div>
        </div>
    </div>
</div>
<!-- FIN DE UNA PÁGINA -->

