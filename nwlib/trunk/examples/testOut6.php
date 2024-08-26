<?php

ini_set("display_errors", 1);
date_default_timezone_set('America/Los_Angeles');
// Añadimos la librería nuSOAP. Que es la que utilizaremos.
require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5/lib/nusoap.php";

// Indicamos donde está el WSDL en nuestro disco o ruta externa.
//$wsdl = "./rutadelfichero.WSDL";
$wsdl = "http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL";

// Instanciamos la clase.
$oSoapClient = new nusoap_client($wsdl, true);

// Después de instanciar la clase, debemos asignar los siguientes namespaces.
//$oSoapClient->namespaces = array(
//    'soapenv' => "http://schemas.xmlsoap.org/soap/envelope/",
//    'tg' => "http://www.rutadeltg.com/xml/tgweb",
//    'asi' => "http://rutadelasi/asi/"
//);
//$oSoapClient->namespaces = array(
//    'soapenv' => "http://schemas.xmlsoap.org/soap/envelope/",
//    'tg' => "http://www.rutadeltg.com/xml/tgweb",
//    'asi' => "http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL"
//);


/* si el WS no está hecho en PHP podría rechazar los métodos implementados.
  Para evitar este problema le mandamos el XML directamente. */
$cadena = '<asi:etiqueta><tg:Bebidas><tg:Refresco>LIMON</tg:Refresco></tg:Bebidas></asi:etiqueta>';

// El último parámetro es para evitar que pille el NameSpace por defecto del NuSOAP, que es http://tempuri.org
$respuesta = $oSoapClient->call("UNOEE_Factura_Venta", $cadena, "");

// Miramos si hubo algún error.
if ($oSoapClient->getError()) {
    echo "<br/><br/>Error al llamar el metodo<br/> " . $oSoapClient->getError();
} else {
    // La carga fue bien y tenemos datos en $respuesta.
}
?>