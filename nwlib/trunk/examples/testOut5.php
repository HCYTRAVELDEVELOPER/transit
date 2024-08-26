<?php
ini_set("display_errors", 1);
date_default_timezone_set('America/Los_Angeles');

class LocalSoapClient extends SoapClient {

    function __doRequest($request, $location, $action, $version, $one_way = 0) {
//        $request = "...."; // your changed XML goes here

        return parent::__doRequest($request, $location, $action, $version, $one_way);
    }

}

$client = new LocalSoapClient("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('trace' => 1));

$XMLrequest = array("F350_ID_CO" => "001",
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


$client->__soapCall("UNOEE_Factura_Venta", array($XMLrequest));
?>