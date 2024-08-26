<!--
created by Alex Flórez
-->
<!DOCTYPE html>
<html>
    <head>
        <?php
        $dbdb = NWDatabase::database();
        $ca = new NWDbQuery($dbdb);
        $where_p = " where id=:id_propuesta";
        $sqla = "select *,
                                  func_concepto(plan,'nw_planes') as nom_plan,
                                  func_concepto(cliente_prospecto, 'clientes_prospecto') as cliente_nombre
                     FROM propuestas " . $where_p;
        $ca->prepare($sqla);
        $ca->bindValue(":id_propuesta", $id_propuesta);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() > 0) {
            $prop = $ca->flush();
            $plan = $prop["nom_plan"];
            $cliente_data = $prop["cliente_nombre"];
        } else {
            $plan = "PREMIUM";
        }
        ?>
        <title>NW Propuesta Económica</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>/propuestas/css/css_before_print.css" />
        <link rel="stylesheet" type="text/css" href="/imagenes/propuestas/css_2015.css" />
        <link rel="shortcut icon"  href="http://www.netwoods.net/imagenes/favicon.ico"></link>
        <?php
        if (($pdf_impr == "pdf")) {
            ?>
            <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>/propuestas/css/estilos_new.css" />
            <?php
        }
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>propuestas/css/estilos_new.css" media="print" />
        <style type="text/css" media="print">
            @page{
                margin-bottom: 0;
                margin-top: 0;
                margin-left: 0;
                margin-right: 0;
            }
            #contenedor1 {
                margin: 0!important;
                border: 0!important;
                page-break-after:always;
            }
            .buttonOpenNwChat, .buttonOpenNwChatRingow, .containconversnwrtc  {
                display: none!important;
            }
        </style>
        <style>
            .containerTranslate a, .printProposal {
                cursor: pointer;
                background: #ec534d;
                color: #fff;
                text-decoration: none;
                padding: 5px 3px;
                position: relative;
                border-radius: 3px;
                display: inline-block;
                margin: 0px 10px;
                font-size: 14px;
            }
        </style>
        <script>
            function imprime() {
                window.print();
            }
        </script>
    </head>
    <body>
        <div id="enc_nw">
            <div id="enc_nw_into">
                <meta name="google-translate-customization" content="caf4cab95252f73e-ef01b710b2a48f02-g4fd482e9c745f22e-13"></meta>
                <div id="google_translate_element"></div>
                <script type="text/javascript">
                    function googleTranslateElementInit() {
                        new google.translate.TranslateElement({pageLanguage: 'es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
                    }
                </script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

                <div class="printProposal" onclick="imprime();">Print / Imprimir</div>
            </div>
        </div>
        <div id="contenedor">
            <?php
            $abre_contenedor1 = "<div id='contenedor1'>";
            $cierra_contenedor1 = "</div>";
            if (($pdf_impr == "pdf")) {
                $abre_contenedor1 = "";
                $cierra_contenedor1 = "";
            }
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
                if ($ii != 0) {
                    encabezado();
                }
                echo "<div id='contenedor2'>";
                echo "<div class='bloques_text_center'>";
                echo "<div class='bloques_textos'>";
                echo $rr["texto"];
                if ($ii == 0) {
                    echo "<h2>Señores {$cliente_data}</h2>";
                    echo "<p class='dataClient'>Propuesta N° {$id_propuesta}  {$fecha_final}</p>";
                }
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
                        <div class="content">
                            <div class="adicionales_uno">
                                <?php
//                                if (isset($prop["adicionales_uno"])) {
//                                    if ($prop["adicionales_uno"] != "") {
//                                        echo "NOTA:";
//                                        echo $prop["adicionales_uno"];
//                                    }
//                                }
                                ?>
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            <div class="condition" style="display: none;">
                                <h2 class="alltitles mod cd">Condiciones</h2>
                                <ul class="listc">
                                    <li class="formapago">
                                        <strong>Forma de pago: </strong>
                                        <?php echo $formpag["nombre"] ?>
                                    </li>
                                    <li class="tiempoentrega">
                                        <strong>Tiempo de entrega:</strong> 
                                        <?php echo $timentreg["nombre"] ?>
                                    </li>
                                    <li class="caducidad_conds">
                                        <strong>Caducidad:</strong> 
                                        <?php echo $prop["caducidad"] ?>
                                        <br />
                                        Posterior a la fecha de caducidad la propuesta puede tener cambios.
                                    </li>
                                    <?php if ($r["tipo_descuento"] != "") { ?>
                                        <li class="caducidad_conds">
                                            <strong>Descuento:</strong> 
                                            <span>Este descuento es válido hasta </span> <?php echo $r["fecha_descuento"]; ?>
                                        </li>
                                        <br />
                                    <?php } ?>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>Cordialmente, </p>
                    <br />
                    <?php
//                    $query = pg_exec("select a.id, a.usuario,b.firma, b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo from propuestas a join usuarios b on (a.usuario=b.usuario)
//                        where a.id =" . $_GET["id"]);
//                    $user = pg_fetch_array($query);
                    if (isset($user["firma"])) {
                        if ($user["firma"] != "") {
                            echo "<strong><img src='http://nwadmin.gruponw.com" . $emp["logo"] . "' width='150' /></strong><br />";
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
                    <span>Fecha de la Impresión: <?php echo "$dia[$numdia],$diames de $mes[$nummes] del $anho  "; ?></span>
                    <p>
                        <br />
                        <br />
                        © 2007-<?php echo date("y") . " " . $emp["razon_social"]; ?> All Rights Reserved – <a target="_BLANK" href="http://www.gruponw.com/politicas-administracion-documentos">Clic para ver las políticas</a>
                    </p>
                </div>
            </div>
            <!-- FIN DE UNA PÁGINA -->
        </div>
    </body>
</html>
