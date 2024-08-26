<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';


$pageConfirmResponse = true;

if (isset($_GET)) {
    if (count($_GET) > 0) {
        $pageConfirmResponse = false;
    }
}

$vars = getVariablesMain();
$referenceCode = $vars["referenceCode"];
$lapResponseCode = $vars["lapResponseCode"];
$lapPaymentMethod = $vars['lapPaymentMethod'];
$cus = $vars['cus'];

$r = consultaPagoNwPay($referenceCode);



//$pagepruebasnw = true;
$pagepruebasnw = false;
if (isset($_GET["nwtestingkey"])) {
    if ($_GET["nwtestingkey"] == "19881223") {
        $pagepruebasnw = true;
    }
}

$payAproved = false;

if ($r["estado"] != "Transacción rechazada" && $r["estado"] != "Transacción aprobada") {
    $payAproved = true;
}
if ($pagepruebasnw === true) {
    $payAproved = true;
}

if ($payAproved === true) {

    if ($r == false) {
        echo "No hay información";
        error_log("No hay información");
        return;
    }

    $sendEmailConfirmation = true;
    if ($r["email_informativo_enviado"] == "SI") {
        $sendEmailConfirmation = false;
    }

    $type_response_payu = "PAGINA_RESPUESTA_GET";
    if ($pageConfirmResponse) {
        $type_response_payu = "PAGINA_CONFIRMACION_POST";
        $pageConfirm = true;
    }

    include 'payu_respuesta.php';

    $approved = false;
    if ($lapResponseCode == 4) {
        $estadoTx = "Transacción aprobada";
        $approved = true;
    } else if ($lapResponseCode == 6) {
        $estadoTx = "Transacción rechazada";
    } else if ($lapResponseCode == 104) {
        $estadoTx = "Error";
    } else if ($lapResponseCode == 7) {
        $estadoTx = "Transacción pendiente";
    } else {
        $estadoTx = "Ninguno";
    }

//    print_r($r);

    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);

    $ca->prepareUpdate("nwpay_pagos", "estado_response_pay,fecha_actualizacion_payu,tipo_respuesta_payu", "referencia=:referencia ");
    $ca->bindValue(":referencia", $referenceCode);
    $ca->bindValue(":estado_response_pay", $estadoTx);
    $ca->bindValue(":fecha_actualizacion_payu", date("Y-m-d H:i:s"));
    $ca->bindValue(":tipo_respuesta_payu", $type_response_payu);
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText();
        return;
    }

    error_log("Actualizado pago correctamente.");

    $cb = new NWDbQuery($db);
    $fields = "a.*";
    $fields .= ",b.nit,b.nombre as nombre_cliente,b.apellido as apellido_cliente,b.direccion,b.telefono as tel_cliente,b.email as email_cliente, b.fecha_nacimiento";
    $cb->prepareSelect("pv_salidas a left join pv_clientes b on (a.cliente=b.id)", $fields, "a.ref_pago=:passPayNw");
    $cb->bindValue(":passPayNw", $referenceCode);
    if (!$cb->exec()) {
        return "Error. " . $cb->lastErrorText();
    }

    $estado_pago_salida = "";
    $_GET["lastOrder"] = "";

    if ($cb->size() > 0) {
        $rp = $cb->flush();
        $_GET["lastOrder"] = $rp["id"];
        $estado_pago_salida = $rp["estado_pago"];
    }

    if ($estado_pago_salida != "Transacción aprobada") {
        $ca->prepareUpdate("pv_salidas", "estado_pago,medio_pago,cus,fecha_actualizacion_payu,forma_respuesta_payu", "ref_pago=:passPayNw");
        $ca->bindValue(":passPayNw", $referenceCode);
        $ca->bindValue(":estado_pago", $estadoTx);
        $ca->bindValue(":medio_pago", $lapPaymentMethod);
        $ca->bindValue(":cus", $cus);
        $ca->bindValue(":fecha_actualizacion_payu", date("Y-m-d H:i:s"));
        $ca->bindValue(":forma_respuesta_payu", $type_response_payu);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
    }

    $crearWebService = false;

    if ($sendEmailConfirmation) {

        $mails = "alexf@netwoods.net";

        $asunto = "Información de pago en línea {$_SERVER["HTTP_HOST"]}";
        $title = "Información de pago en línea {$_SERVER["HTTP_HOST"]}";
        $textBody = "Has recibido una confirmación de pago de PAYU en {$_SERVER["HTTP_HOST"]} estado {$estadoTx}, referencia pago: {$referenceCode} ";
        if (!isset($rta_payu)) {
            $rta_payu = "";
        }

        $textBody .= $rta_payu;

        nw_configuraciones::sendEmail($mails, "Informaciones Pagos en línea Nw", $asunto, $title, $textBody, true);

        $ca->prepareUpdate("nwpay_pagos", "email_informativo_enviado", "referencia=:referencia ");
        $ca->bindValue(":referencia", $referenceCode);
        $ca->bindValue(":email_informativo_enviado", "SI");
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
    }

    if (true === $approved) {
        if ($r["serviceResponse"] != null && $r["methodResponse"] != null) {
            $service = $r["serviceResponse"];
            $method = $r["methodResponse"];
            $service::$method($vars);
        }
    }
} else {
    include 'payu_respuesta.php';
}

function consultaPagoNwPay($ref) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = "referencia=:referencia";
    $ca->prepareSelect("nwpay_pagos", "*", $where);
    $ca->bindValue(":referencia", $ref);
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        return false;
    }
    $ca->next();
    return $ca->assoc();
}

function getVariablesMain() {
    $r = array();

    if (isset($_GET["product_id_com"]))
        $r["producto"] = $_GET["product_id_com"];

    if (isset($_GET["pagina_actual"]))
        $r["pagina_actual"] = $_GET["pagina_actual"];

    if (isset($_GET["pagina"]))
        $r["pagina"] = $_GET["pagina"];

    if (isset($_GET["cat_filtros"]))
        $r["cat_filtros"] = $_GET["cat_filtros"];

    if (isset($_GET["n_cat_filtros"]))
        $r["n_cat_filtros"] = $_GET["n_cat_filtros"];

    if (isset($_GET["category"]))
        $r["category"] = $_GET["category"];

    if (isset($_GET["grupo"]))
        $r["grupo"] = $_GET["grupo"];

    if (isset($_GET["marca"]))
        $r["marca"] = $_GET["marca"];

    if (isset($_GET["filtros"]))
        $r["filtros"] = $_GET["filtros"];

    if (isset($_GET["n_filtros"]))
        $r["n_filtros"] = $_GET["n_filtros"];

    if (isset($_GET["order"]))
        $r["order"] = $_GET["order"];

    if (isset($_GET["asc"]))
        $r["asc"] = $_GET["asc"];

    if (isset($_GET["grupo"]))
        $r["grupo"] = $_GET["grupo"];

    if (isset($_GET["vercarrito"]))
        $r["vercarrito"] = $_GET["vercarrito"];

    if (isset($_GET["pagarCarrito"]))
        $r["pagarCarrito"] = $_GET["pagarCarrito"];

    if (isset($_GET["spaceUser"]))
        $r["spaceUser"] = $_GET["spaceUser"];

    if (isset($_GET["confirm_final"]))
        $r["confirm_final"] = $_GET["confirm_final"];

    if (isset($_GET["url_sites"]))
        $r["url_sites"] = $_GET["url_sites"];

    if (isset($_GET["rute_path"]))
        $r["rute_path"] = $_GET["rute_path"];

    if (isset($_GET["cat"]))
        $r["cat"] = $_GET["cat"];

    if (isset($_GET["gru"]))
        $r["gru"] = $_GET["gru"];

    if (isset($_GET["lastOrder"]))
        $r["lastOrder"] = $_GET["lastOrder"];

    if (isset($_GET["updatePayNw"]))
        $r["updatePayNw"] = $_GET["updatePayNw"];

    if (isset($_GET["passPayNw"]))
        $r["passPayNw"] = $_GET["passPayNw"];

    if (isset($_GET["referenceCode"])) {
        $r["referenceCode"] = $_GET["referenceCode"];
    }

    $p = $_REQUEST;
//    if ($_SERVER["HTTP_HOST"] == "www.nwp5.loc")
//        $p = $_GET;

    if (isset($p["reference_sale"])) {
        $r["passPayNw"] = $p["reference_sale"];
        $r["referenceCode"] = $p["reference_sale"];
        $r["updatePayNw"] = "truePayNw";
    }

    if (isset($_GET["lapResponseCode"])) {
        $r["lapResponseCode"] = $_GET["lapResponseCode"];
    }
    if (isset($p["response_message_pol"])) {
        $r["lapResponseCode"] = $p["response_message_pol"];
    }
    if (isset($p["state_pol"])) {
        $r["lapResponseCode"] = $p["state_pol"];
    }

    if (isset($_REQUEST['merchantId'])) {
        $r["merchantId"] = $_REQUEST['merchantId'];
    }
    if (isset($p['merchant_id'])) {
        $r["merchantId"] = $p['merchant_id'];
    }

    if (isset($_REQUEST['referenceCode'])) {
        $r["referenceCode"] = $_REQUEST['referenceCode'];
    }
    if (isset($p['reference_sale'])) {
        $r["referenceCode"] = $p['reference_sale'];
    }

    if (isset($_REQUEST['TX_VALUE'])) {
        $r["TX_VALUE"] = $_REQUEST['TX_VALUE'];
    }
    if (isset($p['value'])) {
        $r["TX_VALUE"] = $p['value'];
    }

    if (isset($_REQUEST['currency'])) {
        $r["currency"] = $_REQUEST['currency'];
    }
    if (isset($p['currency'])) {
        $r["currency"] = $p['currency'];
    }

    if (isset($_REQUEST['transactionState'])) {
        $r["transactionState"] = $_REQUEST['transactionState'];
    }
    if (isset($p['payment_method_id'])) {
        $r["transactionState"] = $p['payment_method_id'];
    }

    if (isset($_REQUEST['signature'])) {
        $r["signature"] = $_REQUEST['signature'];
    }
    if (isset($p['sign'])) {
        $r["signature"] = $p['sign'];
    }

    $r["cus"] = "";
    if (isset($_REQUEST['cus'])) {
        $r["cus"] = $_REQUEST['cus'];
    }
    if (isset($p['cus'])) {
        $r["cus"] = $p['cus'];
    }

    $r["authorization_code"] = "";
    if (isset($_REQUEST['authorization_code'])) {
        $r["authorization_code"] = $_REQUEST['authorization_code'];
    }
    if (isset($p['authorization_code'])) {
        $r["authorization_code"] = $p['authorization_code'];
    }

    if (isset($_REQUEST['reference_pol'])) {
        $r["reference_pol"] = $_REQUEST['reference_pol'];
    }

    if (isset($p['reference_pol'])) {
        $r["reference_pol"] = $p['reference_pol'];
    }

    if (isset($_REQUEST['description'])) {
        $r["description"] = $_REQUEST['description'];
    }
    if (isset($p['description'])) {
        $r["description"] = $p['description'];
    }

    if (isset($_REQUEST['pseBank'])) {
        $r["pseBank"] = $_REQUEST['pseBank'];
    }
    if (isset($p['pse_bank'])) {
        $r["pseBank"] = $p['pse_bank'];
    }

    if (isset($_REQUEST['lapPaymentMethod'])) {
        $r["lapPaymentMethod"] = $_REQUEST['lapPaymentMethod'];
    }
    if (isset($p['payment_method_name'])) {
        $r["lapPaymentMethod"] = $p['payment_method_name'];
    }

    if (isset($_REQUEST['transactionId'])) {
        $r["transactionId"] = $_REQUEST['transactionId'];
    }
    if (isset($p['transaction_id'])) {
        $r["transactionId"] = $p['transaction_id'];
    }

    if (isset($_REQUEST['message'])) {
        $r["message"] = $_REQUEST['message'];
    } else
    if (isset($p['message'])) {
        $r["message"] = $p['message'];
    } else {
        $r["message"] = "N/A";
    }




    if (isset($_GET["url_path"]))
        $r["url_path"] = $_GET["url_path"];

    return $r;
}
