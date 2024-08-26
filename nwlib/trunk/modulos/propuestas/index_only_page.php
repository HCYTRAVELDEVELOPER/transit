<?php
//data of index, required
$proposal = $r;
$customer = $prd;
$myCompany = $emp;
$discount = $desc;
$paymentMethods = $formpag;
$timeDelivery = $timentreg;
//echo $domain_http;
//echo $fecha_final;
//echo $id_get;
//echo $logotipo;
//print_r($myCompany);

foreach ($customer as $key => $value) {
    if ($value == "") {
        $customer[$key] = "N/A";
    }
}
$actual_link = (isset($_SERVER['HTTPS']) ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Presupuesto de inversión Nw Group <?php echo $id_get . " " . $customer["nombre"]; ?> </title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="shortcut icon"  href="https://www.gruponw.com/imagenes/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="<?php echo "/nwlib" . master::getNwlibVersion() ?>/modulos/propuestas/css/style_only_page.css" />
        <style type="text/css" media="print">
            @page{
                margin-bottom: 10px;
                margin-top: 10px;
                margin-left: 10px;
                margin-right: 10px;
                font-size: 12px;
            }
            .bodyCenter{
                border: 0px!important;
                box-shadow: none!important;
            }
            body {
                top: 0!important;
            }
            .buttonOpenNwChat, .containerTranslate, .skiptranslate, .buttonOpenNwChatRingow, .containconversnwrtc  {
                display: none!important;
            }
            .bloques_text_center{
                color: #595959;
                margin-top: 5px;
                margin-right: 20px;
                margin-left: 20px;
                margin-bottom: 10px;
                text-align: justify;
                /*font-size: 14px;*/
                overflow: hidden;
            }
            .bloques_text_center img{
                margin: 10px;
                position: relative;
            }
            #contenedor2 {
                position: relative;
                height: auto;
                z-index: 1;
                margin: auto;
                padding: 5px 20px;
                /*overflow: hidden;*/
            }
        </style>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
//                document.onselectstart = new Function("return false");
//                if (window.sidebar) {
//                    document.onmousedown = disableselect();
//                    document.onclick = reEnable();
//                }
//                document.oncontextmenu = function () {
//                    return false;
//                };
//                Disable_Control_C();
//                document.onkeydown = function (e) {
//                    if (e.ctrlKey) {
//                        return false;
//                    } else {
//                        return true;
//                    }
//                };
            });
            function Disable_Control_C() {
                var keystroke = String.fromCharCode(event.keyCode).toLowerCase();
                if (event.ctrlKey && (keystroke == 'c' || keystroke == 'v')) {
                    alert("let's see");
                    event.returnValue = false; // disable Ctrl+C
                }
            }
            function imprime() {
                window.print();
            }
        </script>
    </head>
    <body>
        <div class="containerAll">
            <div class="bodyCenter">
                <div class="enc">
                    <div class="containerTranslate">
                        <meta name="google-translate-customization" content="caf4cab95252f73e-ef01b710b2a48f02-g4fd482e9c745f22e-13"></meta>
                        <div id="google_translate_element"></div>
                        <script type="text/javascript">
                            function googleTranslateElementInit() {
                                new google.translate.TranslateElement({pageLanguage: 'es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
                            }
                        </script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

                        <a class="printProposal" href="<?php echo $actual_link; ?>&viewAll=true" target="_blank">Ver más detalles</a>
                        <div class="printProposal" onclick="imprime();">Print / Imprimir</div>
                    </div>
                    <div class="encFirstPart">
                        <div class="logoCompany">
                            <img src="<?php echo $logotipo; ?>" />
                            <h1>
                                <?php echo $myCompany["razon_social"]; ?>
                            </h1>
                            <p>
                                <?php echo $myCompany["slogan"]; ?>
                            </p>
                            <p>
                                <a target="_BLANK" href="https://<?php echo $myCompany["web"]; ?>"><?php echo $myCompany["web"]; ?></a>
                            </p>
                            <p>
                                <?php echo $myCompany["direccion"]; ?>
                            </p>
                            <p>
                                <?php echo $myCompany["city_text"]; ?>
                            </p>
                        </div>
                        <div class="titleAndData">
                            <h1>
                                Presupuesto de Inversión #<?php echo $proposal["id"]; ?>
                            </h1>
                            <h2>
                                <?php echo $proposal["titulo"]; ?>
                            </h2>
                            <p>
                                Fecha de creación <?php echo $proposal["fecha"]; ?>
                            </p>
                            <p>
                                Vigencia <?php echo $proposal["caducidad"]; ?>
                            </p>
                            <p>
                                Moneda <?php echo $proposal["nom_moneda"]; ?>
                            </p>
                        </div>
                    </div>
                    <div class="signatures">
                        <div class="signatureCustomer">
                            <p>
                                <strong>
                                    Presentado a
                                </strong>
                            </p>
                            <p>
                                <strong>
                                    <?php echo $customer["nombre_contacto"]; ?>
                                </strong>
                            </p>
                            <p>
                                <?php echo $customer["nombre"]; ?>
                            </p>
                            <p>
                                Correo: <?php echo $customer["mail"]; ?>
                            </p>
                            <p>
                                Dirección: <?php echo $customer["direccion"] . ". Tel: " . $customer["telefono"]; ?>
                            </p>
                            <p>
                                <?php echo $customer["country_text"]; ?>
                            </p>
                        </div>
                        <div class="signatureMyCompany">
                            <p>
                                <strong>
                                    Presentado por
                                </strong>
                            </p>
                            <p>
                                <strong>
                                    <?php echo $user["nombre"] . "  " . $user["apellido"]; ?>
                                </strong>
                            </p>
                            <p>
                                <?php echo $user["cargo"]; ?>
                            </p>
                            <p>
                                <?php echo $user["email"]; ?>
                            </p>
                            <p>
                                <?php echo $user["celular"]; ?>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="description">
                    <?php echo $proposal["descripcion_general"]; ?>
                </div>
                <?php
                global $id_propuesta;
                $dbdb = NWDatabase::database();
                $cb = new NWDbQuery($dbdb);
                $ca = new NWDbQuery($dbdb);
                $wheree = " where id=:id_propuesta";
                $sqla = "select *,func_concepto(producto,'productos') as nom_producto FROM propuestas" . $wheree . " order by id asc";
                $cb->prepare($sqla);
                $cb->bindValue(":id_propuesta", $proposal["id"]);
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
//                    print_r($tarifas);
                    if ($tarifa) {
                        if (count($tarifas) > 0) {
                            $total = count($tarifas) + 1;

                            if (is_null($propuesta["valor_adicional_negociacion"])) {
                                $propuesta["valor_adicional_negociacion"] = 0;
                            }


                            echo "<div id='contenedor2'>";
                            echo "<div class='bloques_text_center'>";
                            echo "<div class='bloques_textos'>";
                            echo '<div style="width: 800px;margin: auto;"><p style="text-align: center;">&nbsp;</p>';
                            echo '<p style="text-align: center;"><strong>Paquete de Servicios</strong></p>';
                            echo '<p style="text-align: center;">&nbsp;</p>';
                            echo '<table class="tablePrecios" style="width: 800px; border-collapse: collapse;">';
                            echo '<thead>';
                            echo '<tr>';
                            echo '<th style="text-align: center; width: 150px; border: 1px solid #000;"><span style="color:#000000;">' . $propuesta["nom_producto"] . '&nbsp;&nbsp;</span></th>';
                            echo '<th style="text-align: center; width: 80px; border: 1px solid #000;"><span style="color:#000000;">% de Ahorro</span></th>';
                            echo '<th style="text-align: center; width: 120px; border: 1px solid #000;"><span style="color:#000000;">Valor Unidad </span></th>';
                            echo '<th style="text-align: center; width: 120px; border: 1px solid #000;"><span style="color:#000000;">Valor Total</span></th>';
                            echo '</tr>';
                            echo '</thead>';
                            echo '<tbody>';
                            for ($i = 0; $i < count($tarifas); $i++) {
                                echo '<tr>';
                                echo '<td style="text-align: center; width: 400px; border: 1px solid #000;">' . $tarifas[$i]["rango_final"] . ' por ' . $tarifa["unidad_medida"] . '</td>';
                                echo '<td style="text-align: center; border: 1px solid #000;">' . round(floatval($tarifas[$i]["ahorro"])) . '%' . '</td>';
                                echo '<td style="text-align: center; border: 1px solid #000;">$ ' . number_format($tarifas[$i]["subtotal"], 2) . '</td>';
                                echo '<td style="text-align: center; border: 1px solid #000;">$ ' . number_format($tarifas[$i]["subtotal"] * $tarifas[$i]["rango_final"]) . '</td>';
                                echo '</tr>';
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
                        }
                    }
                }
                ?>
                <div class="items">
                    <?php
                    include "foot_prices.php";
                    ?>
                </div>
            </div>
        </div>
    </body>
</html>
