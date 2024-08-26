<?php

header('Content-Type: text/html; charset=UTF-8');

//include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
ini_set("display_errors", 1);
date_default_timezone_set('America/Los_Angeles');
//require $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5_1/lib/nusoap.php";


require $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5/lib/nusoap.php";

$client = new nusoap_client("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", "wsdl");

$err = $client->getError();
if ($err) {
    echo 'Error en Constructor' . $err;
}

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
    'F358_FECHA_VCTO' => '20160104',
    'F358_NOTAS' => 'PRUEBA DE ENVÍO DE DATOS',
    'F472_ID_LLAVE_IMPUESTO' => '1',
    'F472_VLR_UNI' => '2300',
    'F472_VLR_TOT' => 123456,
    'F358_ID_BANCO' => '001',
);

$movimientos = array('DOC_FACTURA_VENTA_02MOV' => $productos);

$enc = array('F350_ID_CO' => '001',
    'F350_ID_TIPO_DOCTO' => 'FDV',
    'F350_CONSEC_DOCTO' => 1,
    'f461_id_tercero_vendedor' => 1234566,
    'f461_num_docto_referencia' => '4345345',
    'f461_id_cond_pago' => '0D',
    'f461_notas' => 'PRUEBAS ENVIO INFO',
    'F160_ID' => '1019029476',
    'F160_IND_TIPO_TERCERO' => 1,
    'F160_RAZON_SOCIAL' => 'PRUEBAS LTDA',
    'F160_APELLIDO_1' => 'PRUEBAS',
    'F160_NOMBRE' => 'SIMISIM',
    'F160_FECHA_NACIMIENTO' => 19941218,
    'F015_DIRECCION1' => 'CALLE FALSA 123',
    'F015_ID_PAIS' => (int) 169,
    'F015_ID_DEPTO' => '05',
    'F015_ID_CIUDAD' => '10',
    'F015_TELEFONO' => '5555555',
    'F015_EMAIL' => 'PRUEBASENVIO@SOAP.COM',
    'MOVIMIENTOS' => $movimientos
);


//$param = array("DOC_FACTURA_VENTA_01ENC" => $enc);

$data = array('DOC_FACTURA_VENTA_01ENC' => $enc);

//$data = $param;
//print_r($data);

$result = $client->call("UNOEE_Factura_Venta", $data);


//return;

if ($client->fault) {
    $err = $client->getError();
    echo 'Fallo';
//    print_r($err);
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
//
//if (is_soap_fault($result)) {
//    trigger_error("SOAP Fault: (faultcode: {$result->faultcode}, faultstring: {$result->faultstring})", E_USER_ERROR);
//}
?>