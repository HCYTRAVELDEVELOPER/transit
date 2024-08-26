<?php

class stripeApi {

    public static $version = "v1";
    public static $url = "https://api.stripe.com";
    public static $clave_secreta = null;
    public static $empresa = "";

    public static function credentialsStripeApi($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $return = array();
        $ca->prepareSelect("edo_stripe_config", "*", "empresa=:empresa and activo=:activo");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":activo", 'SI');
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $return["code"] = 99;
            $return["message"] = "No es posible realizar el pago";
            return $return;
        } else {
            $s = $ca->flush();
            self::$empresa = $p["empresa"];
            self::$clave_secreta = $s["llavePrivada"];
            self::$version = $s["version"];
            self::$url = $s["url"];
            return $s;
        }
    }

    public static function saveApiStripe($p) {
        $p = nwMaker::getData($p);

        // Consulta configuración Stripe clave secreta
        self::credentialsStripeApi($p);
        $return = array();
        if (self::$clave_secreta !== "") {
            $return["code"] = 99;
            $return["message"] = "No es posible realizar el pago";
        }

        $p["proceso"] = "PAGO_VIAJE";
        $res = self::process($p);
        return $res;
    }

    public static function process($p) {
        $p = nwMaker::getData($p);

        require_once $_SERVER['DOCUMENT_ROOT'] . '/app/pagos/stripe/vendor/autoload.php';
//        error_log(self::$clave_secreta);

        \Stripe\Stripe::setApiKey(self::$clave_secreta);
        $customer_id = null;
        $new = null;
        $token_id = null;
        $payment = true;

        if (isset($p["usuario_cliente"])) {
            $p["email"] = $p["usuario_cliente"];
            $p["perfil"] = 1;
            $valor = $p["precio_viaje"];
            $res = explode('.', $valor);
            $p["valor"] = $res[0] . $res[1];
        }

//        if (isset($p["price"]) && !isset($p["cobro"])) {
//            $p["cobro"] = $p["price"];
//        }
//        if (!isset($p["cobro"]) && $p["cobro"] !== true) {
//            $payment = false;
//            $p["status"] = "OK";
//            $p["valor"] = 0000;
//        }
        // Se valida si existe el pasajero/customer
        //valida si está registrando tarjeta, si está registrando no consulta si existe
        $validaNuevo = true;
        $p["numberCard"] = false;
        $cus = 0;
        if (isset($p["stripe"])) {
            if (isset($p["stripe"]["token"])) {
                if (isset($p["stripe"]["token"]["id"])) {
                    $validaNuevo = false;
                }
                if (isset($p["stripe"]["token"]["card"])) {
                    if (isset($p["stripe"]["token"]["card"]["last4"])) {
                        $p["numberCard"] = "**** **** **** " . $p["stripe"]["token"]["card"]["last4"];
                    }
                }
            }
        }
        if ($validaNuevo) {
            $cus = self::getCustomerStripe($p);
        }

        if ($cus > 0) {
            $customer_id = $cus["id_customer"];
            $p["customer_id"] = $customer_id;
            $p["token_card"] = $cus["token_card"];
            $token_id = $cus["token_card"];
        } else {
            $new = true;
            try {
                //Se crea el token de la terjeta
//                if ($p["test"] == "SI") {
//                    $token_card["id"] = "tok_mastercard_debit";
//                } else {
//                    $token_card = \Stripe\Token::create([
//                                'card' => [
//                                    'number' => $p["numero_tarjeta"],
//                                    'exp_month' => $p["mes_vencimiento"],
//                                    'exp_year' => $p["anio_vencimiento_text"],
//                                    'cvc' => $p["codigo_seguridad"]
//                                ]
//                    ]);
//                }
//                $token = "tok_1P8orkCTT79Q0XWPZFk7jH7q";
//                $token = $p["stripe"]["token"]["card"]["id"];
                $token = $p["stripe"]["token"]["id"];
//                $token = "tok_1P8qwrCTT79Q0XWPidRUo5vh";

                error_Log("TEST token {$token} ");

                // Se crea el cliente si no existe
                $customer = \Stripe\Customer::create([
                            'name' => $p["nombre_tarjeta"],
                            'email' => $p["email"],
                            'email' => strip_tags(trim($p["email"])),
//                            'source' => $token_card["id"]
                            'source' => $token
                ]);

                $customer_id = $customer["id"];

                error_Log("CREA CLIENTE customer_id{$customer_id} ");

                $p["customer_id"] = $customer_id;
//                $token_id = $token_card["id"];
                $token_id = $token;
                $p["token_card"] = $token_id;
            } catch (Exception $e) {
                return $e->getError()->message;
            }
        }

        error_Log("SIGUE customer_id{$customer_id} ");

        // Se realiza el pago
//        if ($payment !== false) {
        try {
            if (!isset($p["valor"])) {
//                $p["valor"] = 0100;
                $p["valor"] = 0051;
//            $p["valor"] = 1059;
                $p["valor"] = 0100;
            }

            error_Log("TRY TO PAY: token: {$token_id} customer_id: {$customer_id}  valor: {$p["valor"]}  Description: {$p["description"]}");

            $pay = \Stripe\Charge::create([
                        'amount' => $p["valor"],
                        'currency' => 'usd',
//                        'source' => $token_id,
                        'customer' => $customer_id,
                        'description' => $p["description"]
            ]);

            $p["id_pay"] = $pay["id"];
            if ($pay["status"] == "succeeded") {
                $p["status"] = "OK";
                $p["payment"] = true;
            } else {
                $p["status"] = "Rechazada";
                $p["payment"] = false;
            }
        } catch (\Stripe\Exception\ApiErrorException $e) {
            return $e->getError()->message;
        }

        $p["status"] = $pay["status"];
        $p["codigo_seguridad"] = "";
        $p["pais"] = "";
        $p["currency"] = "USD";
        $p["numero_tarjeta"] = "**** **** **** " . $pay["payment_method_details"]["card"]["last4"];
        $p["id_tarjeta_credito"] = "**** **** **** " . $pay["payment_method_details"]["card"]["last4"];
        $p["nombre_banco"] = $pay["payment_method_details"]["card"]["brand"];
        $p["precio_viaje"] = $p["valor"];
        $p["token_id"] = $token_id;
        $p["customer_id"] = $customer_id;
        if ($new) {
            if ($pay["status"] == "succeeded") {
                $saveCutom = self::saveCustomerStripe($p);
                if ($saveCutom != true) {
                    return $saveCutom;
                }
            }
            $saveCard = self::saveCreditCardPayment($p);
            if ($saveCard != true) {
                return $saveCard;
            }
        }
        $savePay = self::savePayment($p);
        if ($savePay != true) {
            return $savePay;
        }
        return $pay;
//        } else {
//            $p["codigo_seguridad"] = "";
//            self::saveCreditCardPayment($p);
//        }
//        return $p;
    }

    public static function getCustomerStripe($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $numero_tarjeta = null;
        $where = "empresa=:empresa and perfil=:perfil and email=:email ";
        if (isset($p["numberCard"])) {
            if (nwMaker::evalueData($p["numberCard"])) {
                $where .= " and numero_tarjeta=:numero_tarjeta ";
                $numero_tarjeta = $p["numberCard"];
            }
        }
        $where .= " order by id desc limit 1";
        $ca->prepareSelect("edo_stripe_customer", "*", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":numero_tarjeta", $numero_tarjeta);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        } else {
            return $ca->flush();
        }
    }

    public static function saveCustomerStripe($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        $id = null;
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $ca->prepareSelect("edo_stripe_customer", "id", "email=:email and empresa=:empresa and numero_tarjeta=:numero_tarjeta order by id desc limit 1");
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":numero_tarjeta", $p["numero_tarjeta"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        if ($ca->size() == 0) {
            $ca->prepareInsert("edo_stripe_customer", "name,email,fecha,id_customer,perfil,empresa,token_card,numero_tarjeta");
        } else {
            $d = $ca->flush();
            $ca->prepareUpdate("edo_stripe_customer", "name,email,fecha,id_customer,perfil,empresa,token_card,numero_tarjeta", "id=:id");
            $id = $d["id"];
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":name", $p["nombre_tarjeta"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":id_customer", $p["customer_id"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":token_card", $p["token_card"]);
        $ca->bindValue(":numero_tarjeta", $p["numero_tarjeta"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return true;
    }

    public static function saveCreditCardPayment($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $empresa = $p["empresa"];
        $perfil = $p["perfil"];
        $documento = $p["documento"];
        $usuario = $p["usuario"];
        $status = $p["status"];
        $email = $p['email'];
        if ($status === "OK") {
            $status = "APPROVED";
        }
        $where = "numero_tarjeta=:numero_tarjeta and usuario=:usuario";
        if ($empresa !== null) {
            $where .= " and empresa=:empresa ";
        }
        if ($perfil !== null) {
            $where .= " and perfil=:perfil ";
        }
        $where .= " order by id desc limit 1 ";
        $ca->prepareSelect("nwmaker_tarjetascredito", "id", $where);
        $ca->bindValue(":numero_tarjeta", $p['numero_tarjeta']);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa, true, true);
        $ca->bindValue(":perfil", $perfil, true, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $token_id = null;
        $customer_id = null;
        $codigo_seguridad = null;
        if (isset($p["codigo_seguridad"])) {
            if ($p["codigo_seguridad"] !== null && $p["codigo_seguridad"] !== false && $p["codigo_seguridad"] !== "") {
                $codigo_seguridad = $p["codigo_seguridad"];
            }
        }
        $fecha_vencimiento = null;
        if (isset($p["fecha_vencimiento"])) {
            if ($p["fecha_vencimiento"] !== null && $p["fecha_vencimiento"] !== false && $p["fecha_vencimiento"] !== "") {
                $fecha_vencimiento = $p["fecha_vencimiento"];
            }
        }
        $fields = "usuario,numero_tarjeta,codigo_seguridad,fecha_vencimiento,fecha,nombre,nombre_banco,documento,nombre_tarjeta,pais,currency,empresa,perfil,status,pago_unico_mensual";
        if (isset($p["token_id"])) {
            $fields .= ",token_id";
            $token_id = $p["token_card"];
        }
        if (isset($p["customer_id"])) {
            $fields .= ",customer_id_conekta";
            $customer_id = $p["customer_id"];
        }
        if ($ca->size() === 0) {
            $id_card = master::getNextSequence("nwmaker_tarjetascredito_id_seq", $db);
            $ca->prepareInsert("nwmaker_tarjetascredito", $fields . ",id");
        } else {
            $r = $ca->flush();
            $id_card = $r["id"];
            $ca->prepareUpdate("nwmaker_tarjetascredito", $fields, "id=:id");
        }
        $rest = substr($p['numero_tarjeta'], -4);
        $ca->bindValue(":id", $id_card);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":usuario", $p['email']);
        $ca->bindValue(":documento", $documento);
        $ca->bindValue(":nombre_tarjeta", $p['nombre_tarjeta']);
        $ca->bindValue(":pais", $p['pais']);
        $ca->bindValue(":currency", $p['currency']);
        $ca->bindValue(":numero_tarjeta", $p['numero_tarjeta']);
        $ca->bindValue(":codigo_seguridad", $codigo_seguridad, true, true);
        $ca->bindValue(":fecha_vencimiento", $fecha_vencimiento);
        $ca->bindValue(":nombre_banco", $p['nombre_banco']);
        $ca->bindValue(":nombre", $p['nombre_banco'] . " **** **** **** " . $rest);
        $ca->bindValue(":empresa", $empresa, true, true);
        $ca->bindValue(":perfil", $perfil, true, true);
        $ca->bindValue(":status", $status, true, true);
        $ca->bindValue(":pago_unico_mensual", $p["pago_unico_mensual"]);
        $ca->bindValue(":token_id", $token_id);
        $ca->bindValue(":customer_id_conekta", $customer_id);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }

        return true;
    }

    public static function savePayment($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $id_card = $p["id_tarjeta_credito"];

        $ca->prepareInsert("nwmaker_tarjetascredito_pagos", "id_tarjeta,correo,valor,fecha");
        $ca->bindValue(":id_tarjeta", $id_card);
        $ca->bindValue(":correo", $p['email']);
        $ca->bindValue(":valor", $p["precio_viaje"]);
        $ca->bindValue(":fecha", $fecha);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }
}
