<?php
$client = new SoapClient("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('exceptions' => 0));
$result = $client->Lista_Inventario();
if (is_soap_fault($result)) {
    trigger_error("SOAP Fault: (faultcode: {$result->faultcode}, faultstring: {$result->faultstring})", E_USER_ERROR);
}
function objToArray($obj = false) {
    if (is_object($obj))
        $obj = get_object_vars($obj);
    if (is_array($obj)) {
        return array_map(__FUNCTION__, $obj);
    } else {
        return $obj;
    }
}
$result = objToArray($result);
$res = $result["Lista_InventarioResult"];
//print_r($res);
echo $res["any"];
?>