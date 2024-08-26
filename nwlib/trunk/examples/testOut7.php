<?php

ini_set("display_errors", 1);
date_default_timezone_set('America/Los_Angeles');
require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/includes/nusoap-0.9.5/lib/nusoap.php";

$cadena1 = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<soap:Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:tem=\"http://tempuri.org/\">
   <soap:Header/>
   <soap:Body>
      <tem:UNOEE_Factura_Venta>
         <tem:tranDocumento>
            <tem:DOC_FACTURA_VENTA_01ENC>
               <tem:F350_ID_CO>'001'</tem:F350_ID_CO>
               <tem:F350_ID_TIPO_DOCTO>'FDV'</tem:F350_ID_TIPO_DOCTO>
               <tem:F350_CONSEC_DOCTO>1</tem:F350_CONSEC_DOCTO>
               <tem:f461_id_tercero_vendedor>1234566</tem:f461_id_tercero_vendedor>
               <tem:f461_num_docto_referencia>'4345345'</tem:f461_num_docto_referencia>
               <tem:f461_id_cond_pago>'1'</tem:f461_id_cond_pago>
               <tem:f461_notas>'PRUEBAS ENVIO INFO'</tem:f461_notas>
               <tem:F160_ID>1</tem:F160_ID>
               <tem:F160_IND_TIPO_TERCERO>1</tem:F160_IND_TIPO_TERCERO>
               <tem:F160_RAZON_SOCIAL>'PRUEBAS LTDA'</tem:F160_RAZON_SOCIAL>
               <tem:F160_APELLIDO_1>'PRUEBAS'</tem:F160_APELLIDO_1>
               <tem:F160_NOMBRE>'SIMISIM'</tem:F160_NOMBRE>
               <tem:F160_FECHA_NACIMIENTO>19941218</tem:F160_FECHA_NACIMIENTO>
               <tem:F015_DIRECCION1>'AVENIDA SIEMPRE VIVA'</tem:F015_DIRECCION1>
               <tem:F015_ID_PAIS>169</tem:F015_ID_PAIS>
               <tem:F015_ID_DEPTO>'05'</tem:F015_ID_DEPTO>
               <tem:F015_ID_CIUDAD>'10'</tem:F015_ID_CIUDAD>
               <tem:F015_TELEFONO>'5555555'</tem:F015_TELEFONO>
               <tem:F015_EMAIL>'PRUEBASENVIO@SOAP.COM'</tem:F015_EMAIL>
               <tem:MOVIMIENTOS>
                  <tem:DOC_FACTURA_VENTA_02MOV>
                     <tem:f470_id_bodega>'01'</tem:f470_id_bodega>
                     <tem:f470_id_lote>'2'</tem:f470_id_lote>
                     <tem:f470_id_lista_precio>'1'</tem:f470_id_lista_precio>
                     <tem:f470_cant_base>1</tem:f470_cant_base>
                     <tem:f470_referencia_item>'13'</tem:f470_referencia_item>
                     <tem:f470_id_un_movto>2</tem:f470_id_un_movto>
                     <tem:F358_ID_MEDIOS_PAGO>'EFE'</tem:F358_ID_MEDIOS_PAGO>
                     <tem:F_VLR_MEDIO_PAGO>2000</tem:F_VLR_MEDIO_PAGO>
                     <tem:F358_NRO_CUENTA>'1'</tem:F358_NRO_CUENTA>
                     <tem:F358_COD_SEGURIDAD>'1'</tem:F358_COD_SEGURIDAD>
                     <tem:F358_NRO_AUTORIZACION>'12'</tem:F358_NRO_AUTORIZACION>
                     <tem:F358_FECHA_VCTO>20160104</tem:F358_FECHA_VCTO>
                     <tem:F358_NOTAS>'PRUEBA ENVIO DATOS'</tem:F358_NOTAS>
                     <tem:F472_ID_LLAVE_IMPUESTO>'1'</tem:F472_ID_LLAVE_IMPUESTO>
                     <tem:F472_VLR_UNI>2300</tem:F472_VLR_UNI>
                     <tem:F472_VLR_TOT>123456</tem:F472_VLR_TOT>
                     <tem:F358_ID_BANCO>'001'</tem:F358_ID_BANCO>
                  </tem:DOC_FACTURA_VENTA_02MOV>
               </tem:MOVIMIENTOS>
            </tem:DOC_FACTURA_VENTA_01ENC>
         </tem:tranDocumento>
      </tem:UNOEE_Factura_Venta>
   </soap:Body>
</soap:Envelope>
";

$cadena2 = "<?xml version=\"1.0\"?> 
<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope' xmlns:tem='http://tempuri.org/'>
   <soap:Body>
      <tem:UNOEE_Factura_Venta>
         <tem:tranDocumento>
            <tem:DOC_FACTURA_VENTA_01ENC>
               <tem:F350_ID_CO>'001'</tem:F350_ID_CO>
               <tem:F350_ID_TIPO_DOCTO>'FDV'</tem:F350_ID_TIPO_DOCTO>
               <tem:F350_CONSEC_DOCTO>1</tem:F350_CONSEC_DOCTO>
               <tem:f461_id_tercero_vendedor>1234566</tem:f461_id_tercero_vendedor>
               <tem:f461_num_docto_referencia>'4345345'</tem:f461_num_docto_referencia>
               <tem:f461_id_cond_pago>'0'</tem:f461_id_cond_pago>
               <tem:f461_notas>'PRUEBAS ENVIO INFO'</tem:f461_notas>
               <tem:F160_ID>1</tem:F160_ID>
               <tem:F160_IND_TIPO_TERCERO>1</tem:F160_IND_TIPO_TERCERO>
               <tem:F160_RAZON_SOCIAL>'PRUEBAS LTDA'</tem:F160_RAZON_SOCIAL>
               <tem:F160_APELLIDO_1>'PRUEBAS'</tem:F160_APELLIDO_1>
               <tem:F160_NOMBRE>'SIMISIM'</tem:F160_NOMBRE>
               <tem:F160_FECHA_NACIMIENTO>19941218</tem:F160_FECHA_NACIMIENTO>
               <tem:F015_DIRECCION1>'AVENIDA SIEMPRE VIVA'</tem:F015_DIRECCION1>
               <tem:F015_ID_PAIS>169</tem:F015_ID_PAIS>
               <tem:F015_ID_DEPTO>'05'</tem:F015_ID_DEPTO>
               <tem:F015_ID_CIUDAD>'10'</tem:F015_ID_CIUDAD>
               <tem:F015_TELEFONO>'5555555'</tem:F015_TELEFONO>
               <tem:F015_EMAIL>'PRUEBASENVIO@SOAP.COM'</tem:F015_EMAIL>
               <tem:MOVIMIENTOS>
                  <tem:DOC_FACTURA_VENTA_02MOV>
                     <tem:f470_id_bodega>'01'</tem:f470_id_bodega>
                     <tem:f470_id_lote>'2'</tem:f470_id_lote>
                     <tem:f470_id_lista_precio>'1'</tem:f470_id_lista_precio>
                     <tem:f470_cant_base>1</tem:f470_cant_base>
                     <tem:f470_referencia_item>'13'</tem:f470_referencia_item>
                     <tem:f470_id_un_movto>2</tem:f470_id_un_movto>
                     <tem:F358_ID_MEDIOS_PAGO>'EFE'</tem:F358_ID_MEDIOS_PAGO>
                     <tem:F_VLR_MEDIO_PAGO>2000</tem:F_VLR_MEDIO_PAGO>
                     <tem:F358_NRO_CUENTA>'1'</tem:F358_NRO_CUENTA>
                     <tem:F358_COD_SEGURIDAD>'1'</tem:F358_COD_SEGURIDAD>
                     <tem:F358_NRO_AUTORIZACION>'12'</tem:F358_NRO_AUTORIZACION>
                     <tem:F358_FECHA_VCTO>20160104</tem:F358_FECHA_VCTO>
                     <tem:F358_NOTAS>'PRUEBA ENVIO DATOS'</tem:F358_NOTAS>
                     <tem:F472_ID_LLAVE_IMPUESTO>'1'</tem:F472_ID_LLAVE_IMPUESTO>
                     <tem:F472_VLR_UNI>2300</tem:F472_VLR_UNI>
                     <tem:F472_VLR_TOT>123456</tem:F472_VLR_TOT>
                     <tem:F358_ID_BANCO>'001'</tem:F358_ID_BANCO>
                  </tem:DOC_FACTURA_VENTA_02MOV>
               </tem:MOVIMIENTOS>
            </tem:DOC_FACTURA_VENTA_01ENC>
         </tem:tranDocumento>
      </tem:UNOEE_Factura_Venta>
   </soap:Body>
</soap:Envelope>
";

$cadena3 = "<?xml version='1.0' encoding='utf-8'?>
<soap:Envelope xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance' xmlns:xsd='http://www.w3.org/2001/XMLSchema' xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/'>
  <soap:Body>
    <UNOEE_Factura_Venta xmlns='http://tempuri.org/'>
      <tranDocumento>
        <DOC_FACTURA_VENTA_01ENC>
          <F350_ID_CO>'string'</F350_ID_CO>
          <F350_ID_TIPO_DOCTO>'string'</F350_ID_TIPO_DOCTO>
          <F350_CONSEC_DOCTO>'string'</F350_CONSEC_DOCTO>
          <f461_id_tercero_vendedor>'string'</f461_id_tercero_vendedor>
          <f461_num_docto_referencia>'string'</f461_num_docto_referencia>
          <f461_id_cond_pago>'string'</f461_id_cond_pago>
          <f461_notas>'string'</f461_notas>
          <F160_ID>'string'</F160_ID>
          <F160_IND_TIPO_TERCERO>1</F160_IND_TIPO_TERCERO>
          <F160_RAZON_SOCIAL>'string'</F160_RAZON_SOCIAL>
          <F160_APELLIDO_1>'string'</F160_APELLIDO_1>
          <F160_NOMBRE>'string'</F160_NOMBRE>
          <F160_FECHA_NACIMIENTO>'string'</F160_FECHA_NACIMIENTO>
          <F015_DIRECCION1>'string'</F015_DIRECCION1>
          <F015_ID_PAIS>'string'</F015_ID_PAIS>
          <F015_ID_DEPTO>'string'</F015_ID_DEPTO>
          <F015_ID_CIUDAD>'string'</F015_ID_CIUDAD>
          <F015_TELEFONO>'string'</F015_TELEFONO>
          <F015_EMAIL>'string'</F015_EMAIL>
          <MOVIMIENTOS>
            <DOC_FACTURA_VENTA_02MOV xsi:nil='true' />
            <DOC_FACTURA_VENTA_02MOV xsi:nil='true' />
          </MOVIMIENTOS>
        </DOC_FACTURA_VENTA_01ENC>
        <DOC_FACTURA_VENTA_01ENC>
          <F350_ID_CO>'string'</F350_ID_CO>
          <F350_ID_TIPO_DOCTO>'string'</F350_ID_TIPO_DOCTO>
          <F350_CONSEC_DOCTO>'string'</F350_CONSEC_DOCTO>
          <f461_id_tercero_vendedor>'string'</f461_id_tercero_vendedor>
          <f461_num_docto_referencia>'string'</f461_num_docto_referencia>
          <f461_id_cond_pago>'string'</f461_id_cond_pago>
          <f461_notas>'string'</f461_notas>
          <F160_ID>'string'</F160_ID>
          <F160_IND_TIPO_TERCERO>1</F160_IND_TIPO_TERCERO>
          <F160_RAZON_SOCIAL>'string'</F160_RAZON_SOCIAL>
          <F160_APELLIDO_1>'string'</F160_APELLIDO_1>
          <F160_NOMBRE>'string'</F160_NOMBRE>
          <F160_FECHA_NACIMIENTO>'string'</F160_FECHA_NACIMIENTO>
          <F015_DIRECCION1>'string'</F015_DIRECCION1>
          <F015_ID_PAIS>'string'</F015_ID_PAIS>
          <F015_ID_DEPTO>'string'</F015_ID_DEPTO>
          <F015_ID_CIUDAD>'string'</F015_ID_CIUDAD>
          <F015_TELEFONO>'string'</F015_TELEFONO>
          <F015_EMAIL>'string'</F015_EMAIL>
          <MOVIMIENTOS>
            <DOC_FACTURA_VENTA_02MOV xsi:nil='true' />
            <DOC_FACTURA_VENTA_02MOV xsi:nil='true' />
          </MOVIMIENTOS>
        </DOC_FACTURA_VENTA_01ENC>
      </tranDocumento>
    </UNOEE_Factura_Venta>
  </soap:Body>
</soap:Envelope>
";

$cadena4 = "
<?xml version=\"1.0\" encoding=\"utf-8\"?>
<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">
  <soap12:Body>
    <UNOEE_Factura_Venta xmlns=\"http://tempuri.org/\">
      <tranDocumento>
        <DOC_FACTURA_VENTA_01ENC>
          <F350_ID_CO>'string'</F350_ID_CO>
          <F350_ID_TIPO_DOCTO>'string'</F350_ID_TIPO_DOCTO>
          <F350_CONSEC_DOCTO>'string'</F350_CONSEC_DOCTO>
          <f461_id_tercero_vendedor>'string'</f461_id_tercero_vendedor>
          <f461_num_docto_referencia>'string'</f461_num_docto_referencia>
          <f461_id_cond_pago>'string'</f461_id_cond_pago>
          <f461_notas>'string'</f461_notas>
          <F160_ID>'string'</F160_ID>
          <F160_IND_TIPO_TERCERO>1</F160_IND_TIPO_TERCERO>
          <F160_RAZON_SOCIAL>'string'</F160_RAZON_SOCIAL>
          <F160_APELLIDO_1>'string'</F160_APELLIDO_1>
          <F160_NOMBRE>'string'</F160_NOMBRE>
          <F160_FECHA_NACIMIENTO>'string'</F160_FECHA_NACIMIENTO>
          <F015_DIRECCION1>'string'</F015_DIRECCION1>
          <F015_ID_PAIS>'string'</F015_ID_PAIS>
          <F015_ID_DEPTO>'string'</F015_ID_DEPTO>
          <F015_ID_CIUDAD>'string'</F015_ID_CIUDAD>
          <F015_TELEFONO>'string'</F015_TELEFONO>
          <F015_EMAIL>'string'</F015_EMAIL>
          <MOVIMIENTOS>
            <DOC_FACTURA_VENTA_02MOV xsi:nil=\"true\" />
            <DOC_FACTURA_VENTA_02MOV xsi:nil=\"true\" />
          </MOVIMIENTOS>
        </DOC_FACTURA_VENTA_01ENC>
        <DOC_FACTURA_VENTA_01ENC>
          <F350_ID_CO>'string'</F350_ID_CO>
          <F350_ID_TIPO_DOCTO>'string'</F350_ID_TIPO_DOCTO>
          <F350_CONSEC_DOCTO>'string'</F350_CONSEC_DOCTO>
          <f461_id_tercero_vendedor>'string'</f461_id_tercero_vendedor>
          <f461_num_docto_referencia>'string'</f461_num_docto_referencia>
          <f461_id_cond_pago>'string'</f461_id_cond_pago>
          <f461_notas>'string'</f461_notas>
          <F160_ID>'string'</F160_ID>
          <F160_IND_TIPO_TERCERO>1</F160_IND_TIPO_TERCERO>
          <F160_RAZON_SOCIAL>'string'</F160_RAZON_SOCIAL>
          <F160_APELLIDO_1>'string'</F160_APELLIDO_1>
          <F160_NOMBRE>'string'</F160_NOMBRE>
          <F160_FECHA_NACIMIENTO>'string'</F160_FECHA_NACIMIENTO>
          <F015_DIRECCION1>'string'</F015_DIRECCION1>
          <F015_ID_PAIS>'string'</F015_ID_PAIS>
          <F015_ID_DEPTO>'string'</F015_ID_DEPTO>
          <F015_ID_CIUDAD>'string'</F015_ID_CIUDAD>
          <F015_TELEFONO>'string'</F015_TELEFONO>
          <F015_EMAIL>'string'</F015_EMAIL>
          <MOVIMIENTOS>
            <DOC_FACTURA_VENTA_02MOV xsi:nil=\"true\" />
            <DOC_FACTURA_VENTA_02MOV xsi:nil=\"true\" />
          </MOVIMIENTOS>
        </DOC_FACTURA_VENTA_01ENC>
      </tranDocumento>
    </UNOEE_Factura_Venta>
  </soap12:Body>
</soap12:Envelope>    
";

$cadena5 = "<?xml version=\"1.0\" encoding=\"utf-8\"?>
<Envelope xmlns:soap=\"http://www.w3.org/2003/05/soap-envelope\" xmlns:tem=\"http://tempuri.org/\">
   <Header/>
   <Body>
      <UNOEE_Factura_Venta>
         <tranDocumento>
            <DOC_FACTURA_VENTA_01ENC>
               <F350_ID_CO>'001'</F350_ID_CO>
               <F350_ID_TIPO_DOCTO>'FDV'</F350_ID_TIPO_DOCTO>
               <F350_CONSEC_DOCTO>1</F350_CONSEC_DOCTO>
               <f461_id_tercero_vendedor>1234566</f461_id_tercero_vendedor>
               <f461_num_docto_referencia>'4345345'</f461_num_docto_referencia>
               <f461_id_cond_pago>'1'</f461_id_cond_pago>
               <f461_notas>'PRUEBAS ENVIO INFO'</f461_notas>
               <F160_ID>1</F160_ID>
               <F160_IND_TIPO_TERCERO>1</F160_IND_TIPO_TERCERO>
               <F160_RAZON_SOCIAL>'PRUEBAS LTDA'</F160_RAZON_SOCIAL>
               <F160_APELLIDO_1>'PRUEBAS'</F160_APELLIDO_1>
               <F160_NOMBRE>'SIMISIM'</F160_NOMBRE>
               <F160_FECHA_NACIMIENTO>19941218</F160_FECHA_NACIMIENTO>
               <F015_DIRECCION1>'AVENIDA SIEMPRE VIVA'</F015_DIRECCION1>
               <F015_ID_PAIS>169</F015_ID_PAIS>
               <F015_ID_DEPTO>'05'</F015_ID_DEPTO>
               <F015_ID_CIUDAD>'10'</F015_ID_CIUDAD>
               <F015_TELEFONO>'5555555'</F015_TELEFONO>
               <F015_EMAIL>'PRUEBASENVIO@SOAP.COM'</F015_EMAIL>
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
                     <F358_FECHA_VCTO>20160104</F358_FECHA_VCTO>
                     <F358_NOTAS>'PRUEBA ENVIO DATOS'</F358_NOTAS>
                     <F472_ID_LLAVE_IMPUESTO>'1'</F472_ID_LLAVE_IMPUESTO>
                     <F472_VLR_UNI>2300</F472_VLR_UNI>
                     <F472_VLR_TOT>123456</F472_VLR_TOT>
                     <F358_ID_BANCO>'001'</F358_ID_BANCO>
                  </DOC_FACTURA_VENTA_02MOV>
               </MOVIMIENTOS>
            </DOC_FACTURA_VENTA_01ENC>
         </tranDocumento>
      </UNOEE_Factura_Venta>
   </Body>
</Envelope>
";

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

$wsdl = "http://201.234.247.162:8081/DOMECQ_WS.asmx?WSDL";

//$oSoapClient = new nusoap_client($wsdl, true);
$oSoapClient = new nusoap_client($wsdl, "wsdl");

//$oSoapClient->http_encoding = 'utf-8';
//$oSoapClient->defencoding = 'utf-8';

//print_r($enc);
//return;
//$respuesta = $oSoapClient->call("UNOEE_Factura_Venta", $enc);

//$respuesta = $oSoapClient->call("UNOEE_Factura_Venta", $cadena);

//$cadena = $cadena1;
//$cadena = $cadena2;
//$cadena = $cadena3;
$cadena = $cadena5;

//$cadena = htmlentities($cadena);

$respuesta = $oSoapClient->call("UNOEE_Factura_Venta", "$cadena");

if ($oSoapClient->getError()) {
    echo "Error al llamar el metodo<br/> " . $oSoapClient->getError();
} else {
    echo "La carga fue bien y tenemos datos en $respuesta ";
}

echo "<br />soap response<br />";
var_dump($oSoapClient->response);
echo "<br />Respuesta<br />";
var_dump($respuesta);
echo "<br />Cadena<br />";
var_dump($cadena);
//print_r($cadena);
echo "<br />Respuesta<br />";
print_r($respuesta);
?>