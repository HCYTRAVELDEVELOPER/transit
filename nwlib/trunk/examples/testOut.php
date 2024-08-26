<?php

//include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
ini_set("display_errors", 1);
date_default_timezone_set('America/Los_Angeles');
//require $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5_1/lib/nusoap.php";
require $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5/lib/nusoap.php";

//$client = new SoapClient("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('exceptions' => 0));
//$client = new nusoap_client("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('exceptions' => 0));
$client = new nusoap_client("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", "wsdl");
//$client = new nusoap_client("http://201.234.247.162:8081/DOMECQ_WS.asmx");

$err = $client->getError();
if ($err) {
    echo 'Error en Constructor' . $err;
}

$productos = array();

$param = array("F350_ID_CO" => "001",
    "F350_ID_TIPO_DOCTO" => "FVB",
    "F350_CONSEC_DOCTO" => "1",
    "f461_id_tercero_vendedor" => "999999999999996",
    "f461_num_docto_referencia" => "6",
    "f461_id_cond_pago" => "6",
    "f461_notas" => "Sin notas",
    "F160_ID" => "1019029476",
    "F160_IND_TIPO_TERCERO" => 0,
    "F160_RAZON_SOCIAL" => "N/A",
    "F160_APELLIDO_1" => "Alexander",
    "F160_NOMBRE" => "Florez",
    "F160_FECHA_NACIMIENTO" => "2016/04/18",
    "F015_DIRECCION1" => "Calle falsa 123",
    "F015_ID_PAIS" => "1",
    "F015_ID_DEPTO" => "1",
    "F015_ID_CIUDAD" => "1",
    "F015_TELEFONO" => "6817688",
    "F015_EMAIL" => "alexf@netwoods.net"
//    ,
//    'MOVIMIENTOS' => $productos
);
//$data = array('DOC_FACTURA_VENTA_01ENC' => $param);
$data = $param;

//$result = $client->UNOEE_Factura_Venta("DOC_FACTURA_VENTA_01ENC", $param);
//
//
//
//print_r($data);
//return;
//print_r($result);
//return;
//$param = array();
//$param["F350_ID_CO"] = "1";
//$param["F350_ID_TIPO_DOCTO"] = "6";
//$param["F350_CONSEC_DOCTO"] = "6";
//$param["f461_id_tercero_vendedor"] = 6;
//$param["f461_num_docto_referencia"] = 6;
//$param["f461_id_cond_pago"] = 6;
//$param["f461_notas"] = 6;
//$param["F160_ID"] = 6;
//$param["F160_IND_TIPO_TERCERO"] = 6;
//$param["F160_RAZON_SOCIAL"] = 6;
//$param["F160_APELLIDO_1"] = 6;
//$param["F160_NOMBRE"] = 6;
//$param["F160_FECHA_NACIMIENTO"] = 6;
//$param["F015_DIRECCION1"] = 6;
//$param["F015_ID_PAIS"] = 6;
//$param["F015_ID_DEPTO"] = 6;
//$param["F015_ID_CIUDAD"] = 6;
//$param["F015_TELEFONO"] = 6;
//$param["F015_EMAIL"] = 6;
//$param["MOVIMIENTOS"] = 6;
//$param = (object)$param;
//print_r($param);
//return;
//$result = $client->DOC_FACTURA_VENTA_01ENC(array('F350_ID_CO' => (string) 1));
//$result = $client->UNOEE_Factura_Venta(array('F350_ID_CO' => (string) 1));
//$result = $client->UNOEE_Factura_Venta($param);
//$result = $client->UNOEE_Factura_Venta($data);
$result = $client->call("UNOEE_Factura_Venta", $data);
//$result = $client->UNOEE_Factura_Venta("DOC_FACTURA_VENTA_01ENC", $data);
//print_r($result);
//return;

//if (is_soap_fault($result)) {
//    trigger_error("SOAP Fault: (faultcode: {$result->faultcode}, faultstring: {$result->faultstring})", E_USER_ERROR);
//}

if ($client->fault) {
    echo 'Fallo';
    print_r($result);
} else { // Chequea errores
    $err = $client->getError();
    if ($err) {  // Muestra el error
        echo 'Error' . $err;
    } else {  // Muestra el resultado
        echo 'Resultado';
        print_r($result);
    }
}

print "OK";
return true;
?>