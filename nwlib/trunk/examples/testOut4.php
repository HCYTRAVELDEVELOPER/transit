<?php

/**
 * Extend SoapClientClass
 */
class anotherSoapClient extends SoapClient {

    function __construct($wsdl, $options) {
        parent::__construct($wsdl, $options);
        $this->server = new SoapServer($wsdl, $options);
    }

    public function __doRequest($request, $location, $action, $version) {
//        $result = parent::__doRequest($request, $location, $action, $version);
        $result = self::__doRequest_ok($request, $location, $action, $version);
        return $result;
    }

    function __doRequest_ok($request, $location, $action, $version, $one_way = 0) {
        ob_start();
        $this->server->handle($request);
        $response = ob_get_contents();
        ob_end_clean();
        return $response;
    }

    function __anotherRequest($call, $params) {
//        $location = 'http://localhost:8090/mockCustomerManagementSoapHttpBinding';
//        $action = 'http://localhost:8090/mockCustomerManagementSoapHttpBinding/' . $call;
        $location = 'http://201.234.247.162:8081/DOMECQ_WS.asmx';
        $action = 'http://201.234.247.162:8081/DOMECQ_WS.asmx/' . $call;
        $request = $params;
        $result = $this->__doRequest($request, $location, $action, '1');
        return $result;
    }

}

// Create new SOAP client
//$wsdl = 'http://localhost:8090/mockCustomerManagementSoapHttpBinding?WSDL';
$wsdl = 'http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL';
$client = new anotherSoapClient($wsdl, array(
    'cache_wsdl' => WSDL_CACHE_NONE,
    'cache_ttl' => 86400,
    'trace' => true,
    'exceptions' => true,
        ));

// Make the request
//$XMLrequest = "";
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
try {
    $request = $client->__anotherRequest('UNOEE_Factura_Venta', $XMLrequest);
} catch (SoapFault $e) {
    echo "Last request:<pre>" . htmlentities($client->__getLastRequest()) . "</pre>";
    exit();
}

header('Content-type: text/xml');
echo $request;
?>
