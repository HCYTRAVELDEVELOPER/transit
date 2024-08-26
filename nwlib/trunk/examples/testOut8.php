<?php

ini_set("display_errors", 1);
date_default_timezone_set('America/Los_Angeles');
require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5/lib/nusoap.php";


$productos = array(
    'f470_id_bodega' => '01',
    'f470_id_lote' => '2',
    'f470_id_lista_precio' => '1',
    'f470_cant_base' => 1,
    'f470_referencia_item' => '13',
    'f470_id_un_movto' => 2,
    'F358_ID_MEDIOS_PAGO' => 'EFE',
    'F_VLR_MEDIO_PAGO' => 2000,
    'F358_NRO_CUENTA' => '1',
    'F358_COD_SEGURIDAD' => '1',
    'F358_NRO_AUTORIZACION' => '12',
    'F358_FECHA_VCTO' => '1985-01-04',
    'F358_NOTAS' => 'PRUEBA DE ENVÍO DE DATOS',
    'F472_ID_LLAVE_IMPUESTO' => '1',
    'F472_VLR_UNI' => '2300',
    'F472_VLR_TOT' => 123456,
    'F358_ID_BANCO' => '001',
);

$movimientos = array('DOC_FACTURA_VENTA_02MOV' => $productos);

$enc = array('F350_ID_CO' => '001',
    'F350_ID_TIPO_DOCTO' => 'FDV',
    'F350_CONSEC_DOCTO' => 11112222,
    'f461_id_tercero_vendedor' => 1234566,
    'f461_num_docto_referencia' => '55447788',
    'f461_id_cond_pago' => '0D',
    'f461_notas' => 'PRUEBAS ENVIO INFO',
    'F160_ID' => '1019029476',
    'F160_IND_TIPO_TERCERO' => 1,
    'F160_RAZON_SOCIAL' => 'PRUEBAS LTDA',
    'F160_APELLIDO_1' => 'PRUEBAS',
    'F160_NOMBRE' => 'SIMISIM',
    'F160_FECHA_NACIMIENTO' => '19850104',
    'F015_DIRECCION1' => 'CALLE FALSA 123',
    'F015_ID_PAIS' => (int) 169,
    'F015_ID_DEPTO' => '05',
    'F015_ID_CIUDAD' => '10',
    'F015_TELEFONO' => '5555555',
    'F015_EMAIL' => 'ws@nw.com',
    'MOVIMIENTOS' => $movimientos
);

$wsdl = "http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL";

$clienteSOAP = new SoapClient($wsdl, array(
    'trace' => 1,
    'exceptions' => 1,
    'soap_version' => SOAP_1_2,
    'encoding' => 'UTF-8',
    'features' => SOAP_SINGLE_ELEMENT_ARRAYS
        ));

//print_r($enc);
//print_r($clienteSOAP);
//return;

try {
//    $respuesta = $clienteSOAP->UNOEE_Factura_Venta(Array('tranDocumento' => $enc));
    $respuesta = $clienteSOAP->UNOEE_Factura_Venta(Array('tranDocumento' => Array('DOC_FACTURA_VENTA_01ENC' => $enc)));
    print_r($respuesta);
//    var_dump($respuesta);
} catch (SoapFault $e) {
    var_dump($e);
}

return;