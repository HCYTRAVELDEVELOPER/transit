<?php

//include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
ini_set("display_errors", 1);
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
    'F015_ID_PAIS' => (int)169,
    'F015_ID_DEPTO' => '05',
    'F015_ID_CIUDAD' => '10',
    'F015_TELEFONO' => '5555555',
    'F015_EMAIL' => 'PRUEBASENVIO@SOAP.COM',
    'MOVIMIENTOS' => $movimientos
);


//$param = array("DOC_FACTURA_VENTA_01ENC" => $enc);

$data = array('DOC_FACTURA_VENTA_01ENC' => $enc);

$xmlDocumentExample = "<?xml version='1.0' encoding='utf-8'?>
<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>
<soap:Body>
<SiguemeTerceros xmlns='http://tempuri.org/'>
<autenticacion>
<Usuario>xxxxxx</Usuario>
<Clave>xxxxxx</Clave>
</autenticacion>
<array_terceros>
<tercero>
<TipoIdentificacion>CC</TipoIdentificacion>
<IdentificacionTercero>123456</IdentificacionTercero>
<PrimerNombre>JUAN</PrimerNombre>
<SegundoNombre>PABLO</SegundoNombre>
<ObservacionesTercero></ObservacionesTercero>
<PrimerApellido>VELEZ</PrimerApellido>
<SegundoApellido>VELEZ</SegundoApellido>
<ApodoPersona></ApodoPersona>
<ClaseTercero>CA</ClaseTercero>
<CategoriaTercero>1</CategoriaTercero>
</tercero>
</SiguemeTerceros>
</soap:Body>
</soap:Envelope>";



$xmlDocument = "<?xml version='1.0' encoding='utf-8'?>
<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>
  <soap:Body>
    <UNOEE_Factura_Venta xmlns='http://tempuri.org/'>
      <tranDocumento>
        <DOC_FACTURA_VENTA_01ENC>
          <F350_ID_CO>'{$enc["F350_ID_CO"]}'</F350_ID_CO>
          <F350_ID_TIPO_DOCTO>'{$enc["F350_ID_TIPO_DOCTO"]}'</F350_ID_TIPO_DOCTO>
          <F350_CONSEC_DOCTO>{$enc["F350_CONSEC_DOCTO"]}</F350_CONSEC_DOCTO>
          <f461_id_tercero_vendedor>'{$enc["f461_id_tercero_vendedor"]}'</f461_id_tercero_vendedor>
          <f461_num_docto_referencia>'{$enc["f461_num_docto_referencia"]}'</f461_num_docto_referencia>
          <f461_id_cond_pago>'{$enc["f461_id_cond_pago"]}'</f461_id_cond_pago>
          <f461_notas>'{$enc["f461_notas"]}'</f461_notas>
          <F160_ID>'{$enc["F160_ID"]}'</F160_ID>
          <F160_IND_TIPO_TERCERO>{$enc["F160_IND_TIPO_TERCERO"]}</F160_IND_TIPO_TERCERO>
          <F160_RAZON_SOCIAL>'{$enc["F160_RAZON_SOCIAL"]}'</F160_RAZON_SOCIAL>
          <F160_APELLIDO_1>'{$enc["F160_APELLIDO_1"]}'</F160_APELLIDO_1>
          <F160_NOMBRE>'{$enc["F160_NOMBRE"]}'</F160_NOMBRE>
          <F160_FECHA_NACIMIENTO>'{$enc["F160_FECHA_NACIMIENTO"]}'</F160_FECHA_NACIMIENTO>
          <F015_DIRECCION1>'{$enc["F015_DIRECCION1"]}'</F015_DIRECCION1>
          <F015_ID_PAIS>'{$enc["F015_ID_PAIS"]}'</F015_ID_PAIS>
          <F015_ID_DEPTO>'{$enc["F015_ID_DEPTO"]}'</F015_ID_DEPTO>
          <F015_ID_CIUDAD>'{$enc["F015_ID_CIUDAD"]}'</F015_ID_CIUDAD>
          <F015_TELEFONO>'{$enc["F015_TELEFONO"]}'</F015_TELEFONO>
          <F015_EMAIL>'{$enc["F015_EMAIL"]}'</F015_EMAIL>
          <MOVIMIENTOS>
            <DOC_FACTURA_VENTA_02MOV>
             <f470_id_bodega>'01'</f470_id_bodega>
                     <f470_id_lote>'2'</f470_id_lote>
                     <f470_id_lista_precio>'1'</f470_id_lista_precio>
                     <f470_cant_base>1</f470_cant_base>
                     <f470_referencia_item>'13'</f470_referencia_item>
                     <f470_id_un_movto>2</f470_id_un_movto>
                     <F358_ID_MEDIOS_PAGO>'EFE'</F358_ID_MEDIOS_PAGO>
                     <F_VLR_MEDIO_PAGO>2000</F_VLR_MEDIO_PAGO>
                     <F358_NRO_CUENTA>'1'</F358_NRO_CUENTA>
                     <F358_COD_SEGURIDAD>'1'</F358_COD_SEGURIDAD>
                     <F358_NRO_AUTORIZACION>'12'</F358_NRO_AUTORIZACION>
                     <F358_FECHA_VCTO>2016/01/04</F358_FECHA_VCTO>
                     <F358_NOTAS>'PRUEBA ENVIO DATOS'</F358_NOTAS>
                     <F472_ID_LLAVE_IMPUESTO>'1'</F472_ID_LLAVE_IMPUESTO>
                     <F472_VLR_UNI>2300?</F472_VLR_UNI>
                     <F472_VLR_TOT>123456</F472_VLR_TOT>
                     <F358_ID_BANCO>'001'</F358_ID_BANCO>
            </DOC_FACTURA_VENTA_02MOV>
          </MOVIMIENTOS>
        </DOC_FACTURA_VENTA_01ENC>
      </tranDocumento>
    </UNOEE_Factura_Venta>
  </soap:Body>
</soap:Envelope>";
          

$client = new SoapClient("http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL", array('exceptions' => 0));

array(
    'trace' => 1,
    'exceptions' => 1,
    'soap_version' => SOAP_1_1,
    'encoding' => 'ISO-8859-1',
    'features' => SOAP_SINGLE_ELEMENT_ARRAYS
        )
;

$xmlvar = new SoapVar(
        '<ns1:xmlDocument>' . $xmlDocument . '</ns1:xmlDocument>', XSD_ANYXML
);


//$result = $client->SiguemeTerceros(array('xml' => $xmlDocument));
//$result = $client->UNOEE_Factura_Venta(array('xml' => $xmlDocument));
$result = $client->UNOEE_Factura_Venta(array('xml' => $xmlDocument));
//$result = $client->UNOEE_Factura_Venta($xmlDocument);

//print_r($result);
//return;

if (is_soap_fault($result)) {
    trigger_error("SOAP Fault: (faultcode: {$result->faultcode}, faultstring: {$result->faultstring})", E_USER_ERROR);
}
?>