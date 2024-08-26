<?php

/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */

class NWPayments {

    private $payupath = '/payu/lib/PayU.php';

    function __construct($p) {
        $this->includePayuPath($p);
        $this->setDefaultValues($p);
    }

    public function mostrarParametros($p) {
        foreach ($p as $key => $value) {
            echo $key . " => " . $value;
            echo "<br />";
        }
    }

    public function pagar($p) {

        //$this->mostrarParametros($p);

        $PHPSESSID = "";
        if (isset($_COOKIE["PHPSESSID"])) {
            $PHPSESSID = $_COOKIE["PHPSESSID"];
        } else
        if (isset($_SESSION["PHPSESSID"])) {
            $PHPSESSID = $_SESSION["PHPSESSID"];
        } else {
            return "NO HAY PHPSESSID";
        }

        $deviceSessionId = md5(session_id() . microtime());

        if ($p["nombre_banco"] == "BALOTO") {

            $parameters = array(
                //Ingrese aquí el identificador de la cuenta.
                PayUParameters::ACCOUNT_ID => $p["cuenta_payu"],
                //Ingrese aquí el código de referencia.
                PayUParameters::REFERENCE_CODE => $p["referencia"],
                //Ingrese aquí la descripción.
                PayUParameters::DESCRIPTION => $p["descripcion"],
                // -- Valores --
                //Ingrese aquí el valor.        
                PayUParameters::VALUE => $p["valor"],
                //Ingrese aquí la moneda.
//                PayUParameters::CURRENCY => "COP",
                PayUParameters::CURRENCY => $p["currency"],
//                PayUParameters::CURRENCY => "USD",
                // -- Comprador 
                //Ingrese aquí el nombre del comprador.
                PayUParameters::BUYER_NAME => $p["nombre_completo"],
                //Ingrese aquí el email del comprador.
                PayUParameters::BUYER_EMAIL => $p["correo"],
                //Ingrese aquí el teléfono de contacto del comprador.
                PayUParameters::BUYER_CONTACT_PHONE => $p["telefono"],
                //Ingrese aquí el documento de contacto del comprador.
                PayUParameters::BUYER_DNI => $p["identificacion"],
                //Ingrese aquí la dirección del comprador.
                PayUParameters::BUYER_STREET => $p["direccion_principal"],
                PayUParameters::BUYER_STREET_2 => $p["direccion_secundaria"],
                PayUParameters::BUYER_CITY => $p["ciudad"],
                PayUParameters::BUYER_STATE => $p["departamento"],
                PayUParameters::BUYER_COUNTRY => $p["pais"],
                PayUParameters::BUYER_POSTAL_CODE => $p["codigo_postal"],
                PayUParameters::BUYER_PHONE => $p["telefono_fijo"],
                // -- pagador --
                //Ingrese aquí el nombre del pagador.
                PayUParameters::PAYER_NAME => $p["pagador_nombre_completo"],
                //Ingrese aquí el email del pagador.
                PayUParameters::PAYER_EMAIL => $p["pagador_correo"],
                //Ingrese aquí el teléfono de contacto del pagador.
                PayUParameters::PAYER_CONTACT_PHONE => $p["pagador_telefono"],
                //Ingrese aquí el documento de contacto del pagador.
                PayUParameters::PAYER_DNI => $p["pagador_identificacion"],
                //Ingrese aquí la dirección del pagador.
                PayUParameters::PAYER_STREET => $p["pagador_direccion_principal"],
                PayUParameters::PAYER_STREET_2 => $p["pagador_direccion_secundaria"],
                PayUParameters::PAYER_CITY => $p["pagador_ciudad"],
                PayUParameters::PAYER_STATE => $p["pagador_departamento"],
                PayUParameters::PAYER_COUNTRY => $p["pagador_pais"],
                PayUParameters::PAYER_POSTAL_CODE => $p["pagador_codigo_postal"],
                PayUParameters::PAYER_PHONE => $p["pagador_telefono_fijo"],
                PayUParameters::PAYMENT_METHOD => $p["nombre_banco"],
                //Ingrese aquí el número de cuotas.
                PayUParameters::INSTALLMENTS_NUMBER => $p["cuotas"],
                //Ingrese aquí el nombre del pais.
//                PayUParameters::COUNTRY => PayUCountries::CO,
//                PayUParameters::COUNTRY => PayUCountries::US,
                PayUParameters::COUNTRY => $p["pais"],
                //Session id del device.
                PayUParameters::DEVICE_SESSION_ID => $deviceSessionId,
                //IP del pagadador
                PayUParameters::IP_ADDRESS => NWUtils::getRealIp(),
                //Cookie de la sesión actual.
                PayUParameters::PAYER_COOKIE => $PHPSESSID,
                //Cookie de la sesión actual.        
                PayUParameters::USER_AGENT => "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0"
            );
        } else {

            $parameters = array(
                //Ingrese aquí el identificador de la cuenta.
                PayUParameters::ACCOUNT_ID => $p["cuenta_payu"],
                //Ingrese aquí el código de referencia.
                PayUParameters::REFERENCE_CODE => $p["referencia"],
                //Ingrese aquí la descripción.
                PayUParameters::DESCRIPTION => $p["descripcion"],
                // -- Valores --
                //Ingrese aquí el valor.        
                PayUParameters::VALUE => $p["valor"],
                //Ingrese aquí la moneda.
                PayUParameters::CURRENCY => "COP",
//                PayUParameters::CURRENCY => "USD",
//                PayUParameters::CURRENCY => $p["currency"],
                // -- Comprador 
                //Ingrese aquí el nombre del comprador.
                PayUParameters::BUYER_NAME => $p["nombre_completo"],
                //Ingrese aquí el email del comprador.
                PayUParameters::BUYER_EMAIL => $p["correo"],
                //Ingrese aquí el teléfono de contacto del comprador.
                PayUParameters::BUYER_CONTACT_PHONE => $p["telefono"],
                //Ingrese aquí el documento de contacto del comprador.
                PayUParameters::BUYER_DNI => $p["identificacion"],
                //Ingrese aquí la dirección del comprador.
                PayUParameters::BUYER_STREET => $p["direccion_principal"],
                PayUParameters::BUYER_STREET_2 => $p["direccion_secundaria"],
                PayUParameters::BUYER_CITY => $p["ciudad"],
                PayUParameters::BUYER_STATE => $p["departamento"],
                PayUParameters::BUYER_COUNTRY => $p["pais"],
                PayUParameters::BUYER_POSTAL_CODE => $p["codigo_postal"],
                PayUParameters::BUYER_PHONE => $p["telefono_fijo"],
                // -- pagador --
                //Ingrese aquí el nombre del pagador.
                PayUParameters::PAYER_NAME => $p["pagador_nombre_completo"],
                //Ingrese aquí el email del pagador.
                PayUParameters::PAYER_EMAIL => $p["pagador_correo"],
                //Ingrese aquí el teléfono de contacto del pagador.
                PayUParameters::PAYER_CONTACT_PHONE => $p["pagador_telefono"],
                //Ingrese aquí el documento de contacto del pagador.
                PayUParameters::PAYER_DNI => $p["pagador_identificacion"],
                //Ingrese aquí la dirección del pagador.
                PayUParameters::PAYER_STREET => $p["pagador_direccion_principal"],
                PayUParameters::PAYER_STREET_2 => $p["pagador_direccion_secundaria"],
                PayUParameters::PAYER_CITY => $p["pagador_ciudad"],
                PayUParameters::PAYER_STATE => $p["pagador_departamento"],
                PayUParameters::PAYER_COUNTRY => $p["pagador_pais"],
                PayUParameters::PAYER_POSTAL_CODE => $p["pagador_codigo_postal"],
                PayUParameters::PAYER_PHONE => $p["pagador_telefono_fijo"],
                // -- Datos de la tarjeta de crédito -- 
                //Ingrese aquí el número de la tarjeta de crédito
                PayUParameters::CREDIT_CARD_NUMBER => $p["numero_tarjeta"],
                //Ingrese aquí la fecha de vencimiento de la tarjeta de crédito
                PayUParameters::CREDIT_CARD_EXPIRATION_DATE => $p["fecha_vencimiento"], //"2014/12"
                //Ingrese aquí el código de seguridad de la tarjeta de crédito
                PayUParameters::CREDIT_CARD_SECURITY_CODE => $p["codigo_seguridad"],
                //Ingrese aquí el nombre de la tarjeta de crédito
                //VISA||MASTERCARD||AMEX||DINERS
                PayUParameters::PAYMENT_METHOD => $p["nombre_banco"],
                //Ingrese aquí el número de cuotas.
                PayUParameters::INSTALLMENTS_NUMBER => $p["cuotas"],
                //Ingrese aquí el nombre del pais.
                PayUParameters::COUNTRY => PayUCountries::CO,
//                PayUParameters::COUNTRY => PayUCountries::US,
//                PayUParameters::COUNTRY => $p["pais"],
                //Session id del device.
                PayUParameters::DEVICE_SESSION_ID => $deviceSessionId,
                //IP del pagadador
                PayUParameters::IP_ADDRESS => self::getRealIp(),
                //Cookie de la sesión actual.
                PayUParameters::PAYER_COOKIE => $PHPSESSID,
                //Cookie de la sesión actual.        
                PayUParameters::USER_AGENT => "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0"
            );
        }

        $solo_validar = false;
        if (isset($p["solo_validar"])) {
            if ($p["solo_validar"] === "SI" || $p["solo_validar"] === "true" || $p["solo_validar"] === true) {
                $solo_validar = true;
            }
        }
        if ($solo_validar === true) {
            $response = PayUPayments::doAuthorization($parameters);
        } else {
            $response = PayUPayments::doAuthorizationAndCapture($parameters);
        }

        $rta = Array();

        if ($response) {
            $response->transactionResponse->dataSend = $p;
            if (isset($response->transactionResponse->orderId)) {
                $response->transactionResponse->orderId;
                $response->transactionResponse->transactionId;
                $response->transactionResponse->state;
                if ($response->transactionResponse->state == "PENDING") {
                    $response->transactionResponse->pendingReason;
                }
                $response->transactionResponse->responseCode;
            }
        }
        return $response;
    }

    private function includePayuPath($p) {
        require_once dirname(__FILE__) . $this->payupath;
    }

    public function getRealIp() {
        $ip = "";
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public function getPayuPath($p) {
        return $this->payupath;
    }

    private function processValues($p) {
        $v = Array();
        for ($i = 0; $i < count($p); $i++) {
            $val = $p[$i];
            $v[$val["nombre_parametro"]] = $val["valor"];
        }
        return $v;
    }

    private function setDefaultValues($p) {
        // URL de Pagos
        Environment::setPaymentsCustomUrl($p["PaymentsCustomUrl"]);
        // URL de Consultas
        Environment::setReportsCustomUrl($p["ReportsCustomUrl"]);
        // URL de Suscripciones para Pagos Recurrentes
        Environment::setSubscriptionsCustomUrl($p["SubscriptionsCustomUrl"]);

        PayU::$apiKey = $p["apiKey"];
        PayU::$apiLogin = $p["apiLogin"];
        PayU::$merchantId = $p["merchantId"];
        PayU::$language = SupportedLanguages::ES;
        PayU::$isTest = $p["isTest"] == "true" ? true : false;
    }

    public function get_random_string($valid_chars, $length) {
        $random_string = "";
        $num_valid_chars = strlen($valid_chars);
        for ($i = 0; $i < $length; $i++) {
            $random_pick = mt_rand(1, $num_valid_chars);
            $random_char = $valid_chars[$random_pick - 1];
            $random_string .= $random_char;
        }
        return $random_string;
    }

    public static function test($p) {
//        $p = Array();
        $p["referencia"] = self::get_random_string("abcdefghijklmnoq", 10);
//        $p["descripcion"] = "Desc";
//        $p["valor"] = 10000;
//
//        $p["apiKey"] = "4Vj8eK4rloUd272L48hsrarnUA";
//        $p["apiLogin"] = "pRRXKOl8ikMmt9u";
//        $p["merchantId"] = "508029";
//        $p["isTest"] = true;
//        $p["PaymentsCustomUrl"] = "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi";
//        $p["ReportsCustomUrl"] = "https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi";
//        $p["SubscriptionsCustomUrl"] = "https://sandbox.api.payulatam.com/payments-api/rest/v4.3/";
//
//        $p["nombre_completo"] = "César Andrés Flórez E";
//        $p["correo"] = "assdres@gmail.com";
//        $p["telefono"] = "3144304998";
//        $p["identificacion"] = "80821912";
//        $p["direccion_principal"] = "Tv 02 # 68 - 04";
//        $p["direccion_secundaria"] = "";
//        $p["ciudad"] = "Bogota";
//        $p["departamento"] = "Cundinamarca";
//        $p["pais"] = "CO";
//        $p["codigo_postal"] = "11001000";
//        $p["telefono_fijo"] = "";
//
//        $p["pagador_nombre_completo"] = "CESAR ANDRES FLOREZ";
//        $p["pagador_correo"] = "assdres@gmail.com";
//        $p["pagador_telefono"] = "3144304998";
//        $p["pagador_identificacion"] = "80821912";
//        $p["pagador_direccion_principal"] = "Tv 02 # 68 - 04";
//        $p["pagador_direccion_secundaria"] = "";
//        $p["pagador_ciudad"] = "Bogota";
//        $p["pagador_departamento"] = "Cundinamarca";
//        $p["pagador_pais"] = "CO";
//        $p["pagador_codigo_postal"] = "11001000";
//        $p["pagador_telefono_fijo"] = "";
//
//        $p["numero_tarjeta"] = "4841931141784927";
//        $p["fecha_vencimiento"] = "2022/02";
//        $p["codigo_seguridad"] = "913";
//        $p["nombre_banco"] = "VISA"; //VISA||MASTERCARD||AMEX||DINERS
//        $p["cuotas"] = "1"; //VISA||MASTERCARD||AMEX||DINERS
//
//        $p["cuenta_payu"] = "512321";
        //$p["cuenta_payu"] = "553632";

        $pay = new NWPayments($p);
        return $pay->pagar($p);
    }

}
