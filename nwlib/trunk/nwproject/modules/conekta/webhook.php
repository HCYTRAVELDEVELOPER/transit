<?php

$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
$appPath = "/var/www/movilmove_web/html/";
if (isset($_SERVER['HTTP_HOST'])) {
    $appPath = $_SERVER['DOCUMENT_ROOT'] . "/";
}
$usedOutNwlib = true;
require_once $appPath . "rpcsrv/server.php";

//$db = NWDatabase::database();
//$ca = new NWDbQuery($db);
//$ca->prepareSelect("nwconekta_orders", "*", "id=64");
//if (!$ca->exec()) {
//    return nwMaker::error($ca->lastErrorText(), true);
//}
//$rs = $ca->flush()["webhook_json_response"];
//$js = json_decode($rs);
////print_r($js->data->object->channel->checkout_request_id);
////print_r($js->data->object->checkout->id);
////print_r($js->data->object->customer_info);
////print_r($js->data->object->amount);
//return;
//$array = json_decode(json_encode($js), true);
////print_r($array["data"]["object"]["customer_info"]);
////print_r($array["data"]["object"]["shipping_contact"]);
////print_r($array["data"]["object"]["checkout"]);
//print_r($array);
//return;

$body = @file_get_contents('php://input');
$data = json_decode($body);
http_response_code(200); // Return 200 OK 


ini_set("display_errors", -1);
ini_set("error_reporting", 0);

$r = json_encode($data);

//$rs = $body;
//$js = json_decode($data);
//$array = json_decode(json_encode($data), true);

$id = $data->data->object->checkout->id;
if ($id === null || $id === false || $id === "") {
    $id = $data->data->object->channel->checkout_request_id;
}
$email = $data->data->object->customer_info->email;
$customer_id = $data->data->object->customer_info->customer_id;
$amount = $data->object->amount;
$type = $data->type;

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareInsert("nwconekta_orders", "valor,email_customer,customer_id,type,fecha,webhook_json_response,webhook_fecha_actualiza,checkoutRequestId");
$ca->bindValue(":valor", $amount);
$ca->bindValue(":email_customer", $email);
$ca->bindValue(":customer_id", $customer_id);
$ca->bindValue(":type", $type);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":webhook_json_response", $body);
$ca->bindValue(":webhook_fecha_actualiza", date("Y-m-d H:i:s"));
$ca->bindValue(":checkoutRequestId", $id);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText(), true);
}

$xa = false;
$fromName = "NwwebHook";
$fromEmail = "info@gruponw.com";
$title = "Reporte/Conekta Type {$type} ID {$id}.";
$asuntoon = "Reporte de movimiento webhook type {$type}. ID {$id} DATA: " . $r;
nw_configuraciones::sendEmail("desarrollonw1@gmail.com", "desarrollonw1@gmail.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);

//if ($data->type == 'charge.paid') {
//    
//}

$ca->prepareSelect("nwconekta_config", "url_webhook", "estado=:estado and url_webhook IS NOT NULL and url_webhook!='' ");
$ca->bindValue(":estado", "ACTIVA");
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText(), true);
}
if ($ca->size() > 0) {
    $c = $ca->flush();
    require_once $appPath . $c["url_webhook"];
}