<?php
if (isset($_SESSION["usuario"])) {
    
}
echo "<h1 id='precio' class='title1'>OFERTA COMERCIAL</h1>";
$total_total = $r["valor"] + $r["valor_adicional"];

if ($r["tipo_descuento"] == "0") {
    $descuento_trad = $r["valor"] * $r["descuento"] / 100;
} else {
    $descuento_trad = $r["descuento"];
}
$valor_final_con_descuento = $total_total - $descuento_trad;

$number_subtotaly = $r["valor"];
$english_format_number_subtotal = number_format($number_subtotaly);

$number_valor_ad = $r["valor_adicional"];
$english_format_number_valor_ad = number_format($number_valor_ad);

$number_desc = $descuento_trad;
$english_format_number_desc = "";
if ($number_desc !== null) {
    $english_format_number_desc = number_format($number_desc);
}

$number_totaly = $valor_final_con_descuento;
$english_format_number_totaly = number_format($number_totaly);

if ($r["valor"] != 0) {
    echo "</h2>";
    if ($r["descuento"] == 0) {
        
    } else {
        if ($r["tipo_descuento"] == "0") {
            
        } else {
            
        }
    }
}
?>
<?php
$subTotal = 0;
$totaly = 0;
$si = session::getInfo();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("propuestas_valores", "*", "propuesta=:id", "orden asc");
$ca->bindValue(":id", $_GET["id"]);
if (!$ca->exec()) {
    echo "No se pudo consultar los ítems";
    return;
}
if ($ca->size() != 0) {
    ?>
    <table class="tablePrecios" cellspacing="7">
        <tr>
            <th>
                Ítem / Descripción
            </th>
            <th>
                Cantidad
            </th>
            <?php
//            if (isset($_SESSION["perfil"])) {
//                if ($_SESSION["perfil"] == "1" || $_SESSION["perfil"] == "6" || $_SESSION["usuario"] == $r["usuario"]) {
            ?>
            <th style="min-width: 130px;">
                Precio Unidad
            </th>
            <th style="min-width: 130px;">
                Total
            </th>
            <?php
//                }
//            } else {
            ?>
    <!--                <th style="min-width: 130px;">
            Precio Unidad
        </th>
        <th style="min-width: 130px;">
            Total
        </th>-->
            <?php
//            }
            ?>
        </tr>
        <tr class="separateTr">
            <td colspan="4">

            </td>
        </tr>
        <?php
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $pr = $ca->assoc();
            ?>
            <tr class="separateTr">
                <td colspan="4">

                </td>
            </tr>
            <tr>
                <td style="text-align: left;">
                    <strong style="font-size: 15px;"><?php echo $pr["producto_text"]; ?></strong>
                    <br />
                    <?php
                    echo $pr["observaciones"];
                    ?>
                </td>
                <td>
                <?php echo $pr["unidades"] ?>
                </td>
                <?php
//                if (isset($_SESSION["perfil"])) {
//                    if ($_SESSION["perfil"] == "1" || $_SESSION["perfil"] == "6" || $_SESSION["usuario"] == $r["usuario"]) {
                ?>
                <td>
                    $<?php echo number_format($pr["valor"], 2) . "    " . $r["nom_moneda"]; ?>
                </td>
                <td  style="text-align: right;">
                    $<?php
                    echo
                    number_format($pr["valor_total"], 2) . "    " . $r["nom_moneda"];
                    ?>
                </td>
                <?php
//                    }
//                } else {
                ?>
        <!--                    <td>
                $<?php // echo number_format($pr["valor"]) . "    " . $r["nom_moneda"];           ?>
            </td>
            <td  style="text-align: right;">
                $<?php
//                        echo
//                        number_format($pr["valor_total"]) . "    " . $r["nom_moneda"];
                ?>
            </td>-->
                <?php
//                }
                ?>
            </tr>
            <?php
        }
        ?>
        <tr class="separateTr">
            <td colspan="4" >

            </td>
        </tr>
        <?php
        if (isset($_SESSION["perfil"])) {
//            if ($_SESSION["perfil"] == "1" || $_SESSION["perfil"] == "6" || $_SESSION["usuario"] == $r["usuario"]) {
            ?>
            <tr class="trTotales">
            <tr class="tr_others">
                <td colspan="2">
                </td>
                <td style="text-align: right;">
                    Sub Total:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    $subTotal = $r["valor"];
                    echo number_format($r["valor"]) . "    " . $r["nom_moneda"];
                    ?>
                </td>
            </tr>
            <?php
            if ($r["descuento"] != "" || $r["descuento"] != 0) {
                ?>
                <tr class="tr_others">
                    <td colspan="2"></td>
                    <td style="text-align: right;">
                        <?php
                        $tipoDescuento = "";
                        if ($r["tipo_descuento"] == 0) {
                            $tipoDescuento = " (" . $r["descuento"] . "%) ";
                        }
                        $totaly = $r["valor"] - $descuento_trad;
                        ?>
                        Descuento<?php echo $tipoDescuento; ?>:
                    </td>
                    <td style="background: #e6e6e6;">
                        $<?php
                        echo $english_format_number_desc . "    " . $r["nom_moneda"];
                        ?>
                    </td>
                </tr>
                <tr class="tr_others">
                    <td colspan="2"></td>
                    <td style="text-align: right;">
                        <?php
                        $tipoDescuento = "";
                        if ($r["tipo_descuento"] == 0) {
                            $tipoDescuento = " (" . $r["descuento"] . "%) ";
                        }
                        ?>
                        Sub Total - Descuento
                    </td>
                    <td style="background: #e6e6e6;">
                        $<?php
                        echo number_format($totaly) . "    " . $r["nom_moneda"];
                        ?>
                    </td>
                </tr>
                <?php
            } else {
                $totaly = $subTotal;
            }
            ?>
            <tr class="tr_others">
                <td colspan="2">

                </td>
                <td style="text-align: right;">
                    IVA:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    $iva = $totaly * 16 / 100;
//                print_r($r);
                    echo number_format($r["iva"]) . "    " . $r["nom_moneda"];
                    ?>
                </td>
            </tr>
            <tr class="tr_others">
                <td colspan="2">

                </td>
                <td  style="text-align: right;">
                    Total:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    echo number_format($r["valor_total"]) . "    " . $r["nom_moneda"];
                    ?>
                </td>
            </tr>
            <?php
//        }
        } else {
            ?>
            <tr class="trTotales">
                <td colspan="2">
                </td>
                <td style="text-align: right;">
                    Sub Total:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    $subTotal = $r["valor"];
                    echo number_format($r["valor"]) . "    " . $r["nom_moneda"];
                    ?>
                </td>
            </tr>
            <?php
            if ($r["descuento"] != "" || $r["descuento"] != 0) {
                ?>
                <tr class="tr_others">
                    <td colspan="2"></td>
                    <td style="text-align: right;">
                        <?php
                        $tipoDescuento = "";
                        if ($r["tipo_descuento"] == 0) {
                            $tipoDescuento = " (" . $r["descuento"] . "%) ";
                        }
                        $totaly = $r["valor"] - $descuento_trad;
                        ?>
                        Descuento<?php echo $tipoDescuento; ?>:
                    </td>
                    <td style="background: #e6e6e6;">
                        $<?php
                        echo $english_format_number_desc . "    " . $r["nom_moneda"];
                        ?>
                    </td>
                </tr>
                <tr class="tr_others">
                    <td colspan="2"></td>
                    <td style="text-align: right;">
                        <?php
                        $tipoDescuento = "";
                        if ($r["tipo_descuento"] == 0) {
                            $tipoDescuento = " (" . $r["descuento"] . "%) ";
                        }
                        ?>
                        Sub Total - Descuento
                    </td>
                    <td style="background: #e6e6e6;">
                        $<?php
                        echo number_format($totaly) . "    " . $r["nom_moneda"];
                        ?>
                    </td>
                </tr>
                <?php
            } else {
                $totaly = $subTotal;
            }
            ?>
            <tr class="tr_others">
                <td colspan="2">

                </td>
                <td style="text-align: right;">
                    IVA:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    $iva = $totaly * 16 / 100;
//                print_r($r);
                    echo number_format($r["iva"]) . "    " . $r["nom_moneda"];
                    ?>
                </td>
            </tr>
            <tr class="tr_others">
                <td colspan="2">

                </td>
                <td  style="text-align: right;">
                    Total:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    echo number_format($r["valor_total"]) . "    " . $r["nom_moneda"];
                    ?>
                </td>
            </tr>
            <?php
        }
        ?>
    </table>
    <?php
}
//} else {
//    echo "<h1>Valor Total: $" . $english_format_number_totaly . "  Pesos + IVA</h1>";
//}
?>
<div class="containerConditions" style="page-break-after: auto">
    <h2>CONDICIONES A TENER EN CUENTA</h2>
    <p>
        <strong>Forma de pago: </strong>
<?php echo $formpag["nombre"] ?>
    </p>
    <br />
    <p>
        <strong>Tiempo de entrega:</strong> 
<?php echo $timentreg["nombre"] ?>
    </p>
    <br />
    <p>
        <strong>Caducidad:</strong> 
<?php echo $caducidad; ?> <span>Posterior a la fecha de caducidad la propuesta puede tener cambios.</span>
    </p>
    <br/>
    <?php
    if ($r["tipo_descuento"] != "") {
        if ($r["fecha_descuento"] != "") {
            ?>
            <p>
                <strong>Descuento:</strong> 
                <span>Este descuento es válido hasta </span> <?php echo $r["fecha_descuento"]; ?>
            </p>
            <br />
            <?php
        }
    }
    ?>
</div>
<?php
echo "<div class='containerAdditionsOne'>" . $r["adicionales_uno"] . "</div>";
if ($r["adicionales_uno"] == "") {
    echo "";
} else
if ($r["adicionales_uno"] != "" & $r["valor_adicional"] == "0") {
//    echo $r["adicionales_uno"];
} else {
//    echo "<h1>Adicionales</h1>";
    echo $r["adicionales_uno"];
    echo "<h3>";
    echo "Valor adicional: $";
    echo $english_format_number_valor_ad;
    echo "Pesos";
    echo "</h3>";
}
?>
<!--<p>A partir de la entrega del 100% del material en medio digital  por parte del cliente.</p>
<p>*Envió del <strong>100% </strong>del material  (Incluye indicaciones, textos, logos, manual de imagen corporativa e imágenes),  en medio digital por parte del cliente.</p>
<p>Este plan bajo estas condiciones  tendrá   este precio, tiene variaciones de acuerdo a necesidades adicionales del  cliente no contempladas en esta propuesta económica.</p>-->
