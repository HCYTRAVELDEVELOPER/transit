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

//echo "<div align='center'>";
//echo "<h1 style='text-transform: uppercase;'>";
//echo "PRECIO ";
//echo $plan["nombre"];
//echo ": ";
//echo "$" . $english_format_number_subtotal . " Doscientos Veinte Millones de Pesos M/CTE.";
//echo "</h1>";
//echo "</div>";
if ($r["descuento"] == 0) {
    
} else {
    if ($r["tipo_descuento"] == "0") {
        echo "<strong>Descuento Especial: </strong>" . $r["descuento"] . "%";
        echo " ($" . $english_format_number_desc . " Pesos)";
    } else {
        echo "<strong>Descuento Especial: </strong>";
        echo " $" . $english_format_number_desc . " Pesos";
    }
}


if ($r["adicionales_uno"] == "") {
    echo "";
} else
if ($r["adicionales_uno"] != "" & $r["valor_adicional"] == "0") {
    echo $r["adicionales_uno"];
} else {
    echo "<h1>Adicionales</h1>";
    echo $r["adicionales_uno"];
    echo "<h3>";
    echo "Valor adicional: $";
    echo $english_format_number_valor_ad;
    echo "Pesos";
    echo "</h3>";
}
echo "<div align='center'>";
echo "<h1>Valor Total del plan: $" . $english_format_number_totaly;
$total = $valor_final_con_descuento;
$V = new EnLetras();
$con_letra = strtoupper($V->ValorEnLetras($total, "pesos M/CTE"));
echo " <span class='moneda_texto_valor'>(" . $con_letra . ")</span> ";
echo "  <br /> + IVA</h1>";
echo "</div>";
echo "<br />";
?>
<h1 class='title1'><b>CONDICIONES COMERCIALES</b></h1>
<div>
    <strong>Forma de pago: </strong>
    <?php echo $formpag["nombre"] ?>
</div>
<div>
    <strong>Tiempo de entrega:</strong> 
    <?php echo $timentreg["nombre"] ?> a partir de la aprobación de la presente propuesta y la entrega del 100% del material en medio digital  por parte del cliente.
</div>
<div>
    <strong>Caducidad:</strong> 
    <?php echo $caducidad; ?> 
    <br />
    Posterior a la fecha de caducidad la propuesta puede tener cambios.
</div>
<p>Este plan bajo estas condiciones tendrá este precio. Tendrá variaciones en su costo de acuerdo a necesidades adicionales del cliente no contempladas en esta propuesta económica.</p>

