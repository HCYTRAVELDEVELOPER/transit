<?php
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
$english_format_number_desc = number_format($number_desc);

$number_totaly = $valor_final_con_descuento;
$english_format_number_totaly = number_format($number_totaly);

if ($r["valor"] != 0) {
//    echo "<h2 style='text-transform: uppercase;'>";
//    echo "PRECIO ";
    if ($plan["nombre"] == "Propuesta en Blanco") {
//        echo $r["titulo"];
    } else {
//        echo $plan["nombre"];
    }
//    echo ": ";
//    echo "$" . $english_format_number_subtotal . " Pesos.";
    echo "</h2>";
    if ($r["descuento"] == 0) {
        
    } else {
        if ($r["tipo_descuento"] == "0") {
//            echo "<strong>Descuento Especial: </strong>" . $r["descuento"] . "%";
//            echo " ($" . $english_format_number_desc . " Pesos)";
        } else {
//            echo "<strong>Descuento Especial: </strong>";
//            echo " $" . $english_format_number_desc . " Pesos";
        }
    }

//    if ($r["adicionales_uno"] == "") {
//        echo "";
//    } else
//    if ($r["adicionales_uno"] != "" & $r["valor_adicional"] == "0") {
//        echo $r["adicionales_uno"];
//    } else {
//        echo "<h1>Adicionales</h1>";
//        echo $r["adicionales_uno"];
//        echo "<h3>";
//        echo "Valor adicional: $";
//        echo $english_format_number_valor_ad;
//        echo "Pesos";
//        echo "</h3>";
//    }
//    echo "<h1>Valor Total del plan: $" . $english_format_number_totaly . "  Pesos + IVA</h1>";
}
?>
<?php
$subTotal = 0;
$si = session::getInfo();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("propuestas_valores", "*,func_concepto(producto, 'productos') as producto_text", "propuesta=:id");
$ca->bindValue(":id", $_GET["id"]);
if (!$ca->exec()) {
    echo "No se pudo consultar los ítems";
    return;
}
if ($ca->size() != 0) {
    ?>
    <table class="tablePrecios" cellspacing="10">
        <tr>
            <th>
                Ítem / Descripción
            </th>
            <th>
                Cantidad
            </th>
            <th>
                Precio Unidad
            </th>
            <th>
                Total
            </th>
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
                <td colspan="5">

                </td>
            </tr>
            <tr>
                <td style="text-align: left;">
                    <strong><?php echo $pr["producto_text"]; ?></strong>
                    <br />
                    <?php
//                    echo strip_tags($pr["observaciones"]); 
                    echo $pr["observaciones"];
                    ?>
                </td>
                <td>
                    <?php echo $pr["unidades"]; ?>
                </td>
                <td>
                    $<?php echo number_format($pr["valor"]); ?>
                </td>
                <td>
                    $<?php
                    echo
                    number_format($pr["valor_total"]);
                    $subTotal += $pr["valor_total"];
                    ?>
                </td>
            </tr>
            <?php
        }
        ?>
        <tr class="separateTr">
            <td colspan="5">

            </td>
        </tr>
        <tr class="trTotales">
            <td colspan="2">

            </td>
            <td style="text-align: right;">
                Sub Total:
            </td>
            <td style="background: #e6e6e6;">
                $<?php
                echo number_format($subTotal);
                ?>
            </td>
        </tr>
        <?php
        if ($r["descuento"] != "" || $r["descuento"] != 0) {
            ?>
            <tr class="trTotales">
                <td colspan="2"></td>
                <td style="text-align: right;">
                    <?php
                    $tipoDescuento = "";
                    if ($r["tipo_descuento"] == 0) {
                        $tipoDescuento = " (" . $r["descuento"] . "%) ";
                    }
                    ?>
                    Descuento<?php echo $tipoDescuento; ?>:
                </td>
                <td style="background: #e6e6e6;">
                    $<?php
                    echo $english_format_number_desc;
                    ?>
                </td>
            </tr>
            <?php
        }
        ?>
        <tr class="trTotales">
            <td colspan="2">

            </td>
            <td style="text-align: right;">
                IVA:
            </td>
            <td style="background: #e6e6e6;">
                $<?php
                echo number_format($r["iva"]);
                ?>
            </td>
        </tr>
        <tr class="trTotales">
            <td colspan="2">

            </td>
            <td  style="text-align: right;">
                Total:
            </td>
            <td style="background: #e6e6e6;">
                $<?php
                echo number_format($subTotal + $r["iva"] - $descuento_trad);
                ?>
            </td>
        </tr>
    </table>
    <?php
} else {
    echo "<h1>Valor Total: $" . $english_format_number_totaly . "  Pesos + IVA</h1>";
}

if ($r["adicionales_uno"] == "") {
    echo "";
} else
if ($r["adicionales_uno"] != "" & $r["valor_adicional"] == "0") {
    echo $r["adicionales_uno"];
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
<h2>CONDICIONES COMERCIALES</h2>
<p>
    <strong>Forma de pago: </strong>
    <?php echo $formpag["nombre"] ?>
</p>
<p>
    <strong>Tiempo de entrega:</strong> 
    <?php echo $timentreg["nombre"] ?>
</p>
<p>A partir de la entrega del 100% del material en medio digital  por parte del cliente.</p>
<p>*Envió del <strong>100% </strong>del material  (Incluye indicaciones, textos, logos, manual de imagen corporativa e imágenes),  en medio digital por parte del cliente.</p>
<p>Este plan bajo estas condiciones  tendrá   este precio, tiene variaciones de acuerdo a necesidades adicionales del  cliente no contempladas en esta propuesta económica.</p>

