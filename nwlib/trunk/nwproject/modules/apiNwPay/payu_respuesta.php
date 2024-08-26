<?php

$vars = getVariablesMain();

$configNc = consultaConfigTienda();

$ApiKey = $configNc["apikey"];
$merchant_id = $vars['merchantId'];
$referenceCode = $vars['referenceCode'];
$TX_VALUE = $vars['TX_VALUE'];
$New_value = number_format($TX_VALUE, 1, '.', '');
$currency = $vars['currency'];
$transactionState = $vars['transactionState'];
$firma_cadena = "$ApiKey~$merchant_id~$referenceCode~$New_value~$currency~$transactionState";
$firmacreada = md5($firma_cadena);
$firma = $vars['signature'];
$reference_pol = $vars['reference_pol'];
$cus = $vars['cus'];
$authorization_code = $vars['authorization_code'];
$extra1 = $vars['description'];
$pseBank = $vars['pseBank'];
$lapPaymentMethod = $vars['lapPaymentMethod'];
$transactionId = $vars['transactionId'];

if (isset($vars["lapResponseCode"])) {
//    $estadoTx = $vars["lapResponseCode"];

    if ($vars["lapResponseCode"] == 4) {
        $estadoTx = "Transacción aprobada";
    } else if ($vars["lapResponseCode"] == 6) {
        $estadoTx = "Transacción rechazada";
    } else if ($vars["lapResponseCode"] == 104) {
        $estadoTx = "Error";
    } else if ($vars["lapResponseCode"] == 7) {
        $estadoTx = "Transacción pendiente";
    } else {
        $estadoTx = $vars['message'];
    }
} else
if ($vars['transactionState'] == 4) {
    $estadoTx = "Transacción aprobada";
} else if ($vars['transactionState'] == 6) {
    $estadoTx = "Transacción rechazada";
} else if ($vars['transactionState'] == 104) {
    $estadoTx = "Error";
} else if ($vars['transactionState'] == 7) {
    $estadoTx = "Transacción pendiente";
} else {
    $estadoTx = $vars['message'];
}

$showData = false;
if (strtoupper($firma) == strtoupper($firmacreada)) {
    $showData = true;
}
if (isset($pageConfirm)) {
    if ($pageConfirm) {
        $showData = true;
    }
}

if ($showData) {

    $rta_payu = "  <h2>Resumen Transacción</h2>
    <table>
        <tr>
            <td>Estado de la transaccion</td>
            <td>{$estadoTx}</td>
        </tr>
        <tr>
        <tr>
            <td>ID de la transaccion</td>
            <td>{$transactionId}</td>
        </tr>
        <tr>
            <td>Referencia de la venta</td>
            <td>{$reference_pol}</td> 
        </tr>
        <tr>
            <td>Referencia de la transaccion</td>
            <td>{$referenceCode}</td>
        </tr>
        <tr>";

    if ($pseBank != null) {
        $rta_payu .= "<tr>
                <td>cus </td>
                <td>{$cus} </td>
            </tr>
            <tr>
                <td>Banco </td>
                <td>{$pseBank} </td>
            </tr>";
    }

    $rta_payu .= "<tr>
            <td>Valor total</td>
            <td>$" . number_format($TX_VALUE) . "</td>
        </tr>
        <tr>
            <td>Moneda</td>
            <td>{$currency}</td>
        </tr>
        <tr>
            <td>Descripción</td>
            <td>{$extra1}</td>
        </tr>
        <tr>
            <td>Entidad:</td>
            <td>{$lapPaymentMethod}</td>
        </tr>
    </table>";

    print "<div class='containerResultPayu' >";
    print "<div class='containerResultPayuInter' >";
    print $rta_payu;
    print "<a href='/'>Volver al sitio web</a>";
    print "</div>";
    print "</div>";

    if (isset($_GET["lastOrder"])) {
        if ($_GET["lastOrder"] != "") {
            loadorder_nws();
        }
    }
} else {
    $rta_payu = "<h1>Error validando firma digital.</h1>";

    echo $rta_payu;
}
?>