<?php

class nwFormsMaker {

    public static function traeColsFormOffline($data) {
        $p = nwMaker::getData($data["data"]);
        $id = $p["id"];
        $rta = "";
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwforms_preguntas", "id, tipo,name_submit,requerido", " id_enc=:id order by orden asc");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total > 0) {
            for ($i = 0; $i < $total; $i++) {
                $r = $ca->flush();
                $name = $r["tipo"] . $r["id"];
                if ($r["name_submit"] != null && $r["name_submit"] != "")
                    $name = $r["name_submit"];
                $rta .= "  {
            name: '{$name}',
            field: '{$name}',
            unique: false
        },
            ";
            }
        }
        return $rta;
    }

    public static function save($data) {
        $p = nwMaker::getData($data["data"]);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id_enc = $p["id_enc"];
        $timestamp = date("Y-m-d H:i:s");
        if (isset($p["fecha_insert"])) {
            $timestamp = $p["fecha_insert"];
        }
        $id_session = session_id();

        $session = master::getNextSequence("nwforms_respuestas_users_enc_id_seq", $db);
        $usuario = "";
        $c = self::configForm($data);
        $ca->prepareInsert("nwforms_respuestas_users_enc", "id,id_enc,fecha,sync,id_session,usuario");
        $ca->bindValue(":id", $session);
        $ca->bindValue(":id_enc", $id_enc);
        $ca->bindValue(":fecha", $timestamp);
        $ca->bindValue(":sync", "SI");
        $ca->bindValue(":id_session", $id_session);
        $ca->bindValue(":usuario", $usuario);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error("Error " . $ca->lastErrorText());
        }
        $p["timestamp"] = $timestamp;
        $p["id_session"] = $id_session;
        $p["session"] = $session;
        $p["usuario"] = $usuario;
        $res = self::saveResponses($p);
        if (!$res) {
            return $res;
        }
        if ($c["enviar_mail"] == "SI") {
            self::sendMail($p, $c);
        }
//        if (isset($correo) && isset($nombre)) {
//    require_once dirname(__FILE__) . '/srv/autocontestador.php';
//        }
        return true;
    }

    public static function sendMail($data, $c) {
        $p = nwMaker::getData($data);
        $titulo = "Formulario {$c["nombre"]} diligenciado";
        $page = $_SERVER["HTTP_HOST"];
        $fecha = date("Y-m-d H:i:s");
        $bodyForm = "";
        if (isset($p["array"])) {
            if (count($p["array"]) > 0) {
                foreach ($p["array"] as $rb) {
                    if (isset($rb["campo"]) && isset($rb["respuesta"])) {
//            $rb["campo"] = master::clean($rb["campo"]);
                        $rb["respuesta"] = master::clean($rb["respuesta"]);
                        $respuesta = $rb["respuesta"];
                        $extension = nwMaker::getExtension($respuesta);
                        if ($extension == "jpg" || $extension == "png" | $extension == "gif" || $extension == "pdf" || $extension == "doc" || $extension == "docx" || $extension == "xls" || $extension == "xlsx") {
                            $respuesta = "<a href='https://" . $_SERVER["HTTP_HOST"] . $rb["respuesta"] . "'>https://" . $_SERVER["HTTP_HOST"] . $rb["respuesta"] . "</a>";
                        }
                        $bodyForm .= "<p><strong>{$rb["campo"]}</strong>: {$respuesta}</p>";
                    }
                }
            }
        }
        $titleEnc = "$titulo en $page";
        $asunto = "$titulo en $page";
        $body = "<div style='border: 1px solid #E6E6E6;background: #FFF;padding: 0em;'>";
        $body .= "<div style='background-color: #f9f9f9;color: #999;font: 20px arial,normal;padding: 15px;border-bottom: 1px solid #ccc;'>";
        $body .= "$titulo<br />";
        $body .= "</div>";
        $body .= "<b>Fecha: $fecha <br />";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #ffffff;color: #666;'>";
        $body .= $bodyForm;
        $body .= "<br />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 10px;>
            Notificación automática de NwForms.<br />Powered by 
            <a style='text-decoration: none;' href='https://www.netwoods.net' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";

        $db = NWDatabase::database();
        $cc = New NWDbQuery($db);
        $cc->prepareSelect("nwforms_destinatarios", "nombre,correo", "id_form=:id_form");
        $cc->bindValue(":id_form", $p["id_enc"]);
        if (!$cc->exec()) {
            $db->rollback();
            return nwMaker::error($cc->lastErrorText());
        }
        if ($cc->size() > 0) {
            for ($i = 0; $i < $cc->size(); $i++) {
                $cc->next();
                $r_us = $cc->assoc();
                nw_configuraciones::sendEmail($r_us["correo"], $r_us["nombre"], $asunto, $titleEnc, $body, false);
            }
        }
    }

    public static function saveResponses($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (count($p["array"]) > 0) {
            foreach ($p["array"] as $ra) {
                if (!isset($ra["campo"])) {
                    continue;
                }
                if (!isset($ra["respuesta"])) {
                    continue;
                }
                $ra["campo"] = master::clean($ra["campo"]);
                $ra["respuesta"] = master::clean($ra["respuesta"]);

                if (strtolower($ra["campo"]) == "nombre") {
                    $nombre = $ra["respuesta"];
                } else
                if (strtolower($ra["campo"]) == "name") {
                    $nombre = $ra["respuesta"];
                }
                if (strtolower($ra["campo"]) == "correo") {
                    $correo = $ra["respuesta"];
                } else
                if (strtolower($ra["campo"]) == "email") {
                    $correo = $ra["respuesta"];
                } else
                if (strtolower($ra["campo"]) == "e-mail") {
                    $correo = $ra["respuesta"];
                } else
                if (strtolower($ra["campo"]) == "mail") {
                    $correo = $ra["respuesta"];
                }
                $ca->prepareInsert("nwforms_respuestas_users", "campo,respuesta,fecha,id_enc,enc_user,sync,id_session,usuario");
                $ca->bindValue(":campo", $ra["campo"]);
                $ca->bindValue(":respuesta", $ra["respuesta"]);
                $ca->bindValue(":id_enc", $p["id_enc"]);
                $ca->bindValue(":fecha", $p["timestamp"]);
                $ca->bindValue(":enc_user", $p["session"]);
                $ca->bindValue(":sync", "SI");
                $ca->bindValue(":id_session", $p["id_session"]);
                $ca->bindValue(":usuario", $p["usuario"], true, true);
                if (!$ca->exec()) {
                    $db->rollback();
                    return nwMaker::error($ca->lastErrorText());
                }
            }
        }
        return true;
    }

    public static function configForm($data) {
        $p = nwMaker::getData($data["data"]);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwforms_enc", "*", "id=:id_form");
        $ca->bindValue(":id_form", $p["id_enc"]);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function populateOne($data) {
        $p = nwMaker::getData($data["data"]);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwforms_preguntas_valores", "value as id, nombre", "id_pregunta=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error("Error " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consulta($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwforms_preguntas", "*", "id_enc=:id_enc");
        $ca->bindValue(":id_enc", $p["id_enc"]);
        if (!$ca->exec()) {
            return nwMaker::error("Error " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = Array();
        $r["preguntas"] = $ca->assocAll();
        $r["enc"] = self::configForm($data);
        return $r;
    }
}

class nwMaker {

    public static function populateCiudades($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1 ";
        if (isset($p["token"])) {
            $p["token"] = rtrim(master::clean($p["token"]));
            $campos = "nombre";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("ciudades", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function validaVersionCache($p) {
        $db = NWDatabase::database();
        $cs = new NWDbQuery($db);
        $where = " os='CACHE' ";
        if (!isset($p["para_todas_las_empresas"])) {
            if (isset($p["empresa"])) {
                $where .= " and empresa=:empresa ";
            }
        }
        if (!isset($p["para_todos_los_perfiles"])) {
            if (isset($p["perfil"])) {
                $where .= " and perfil=:perfil ";
            }
        }
        $cs->prepareSelect("nwmaker_current_version", "version,route_release,domain_rpc", $where);
        if (isset($p["empresa"])) {
            $cs->bindValue(":empresa", $p["empresa"]);
        }
        if (isset($p["perfil"])) {
            $cs->bindValue(":perfil", $p["perfil"]);
        }
        if (!$cs->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $cs->lastErrorText());
        }
        if ($cs->size() == 0) {
            return false;
        }
        return $cs->flush();
    }

    public static function guardarTraducciones($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["id"] == "") {
            $ca->prepareInsert("nwmaker_traducciones", "idioma,empresa,textos,activo");
        } else {
            $ca->prepareUpdate("nwmaker_traducciones", "idioma,empresa,textos,activo", "id=:id");
        }
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $p["empresa"], true, true);
        $ca->bindValue(":idioma", $p["idioma"], true, true);
        $ca->bindValue(":textos", $p["textos"], true, true);
        $ca->bindValue(":activo", $p["activo"], true, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return true;
    }

    public static function getTraducciones($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_traducciones", "*", "1=1 order by id asc");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return $ca->assocAll();
    }

    public static function populateIdiomas($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("idiomas", "name_in_english as id, nombre", "1=1 order by nombre asc");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return $ca->assocAll();
    }

    public static function getTranslateServer($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $fecha = date("Y-m-d H:i:s");
//        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
//            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
//        }
        $idioma = false;
        $empresa = null;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
        }
        $where = "activo='SI'";
        $where .= " and (empresa IS NULL or empresa=:empresa) ";
        if (isset($p["idioma"])) {
            $where .= " and idioma=:idioma ";
            $idioma = $p["idioma"];
        }
        $where .= "order by id asc";
        $ca->prepareSelect("nwmaker_traducciones", "textos,idioma", $where);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":idioma", $idioma);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return $ca->assocAll();
    }

    public static function getApiNwAds($dat) {
        $p = Array();
        $p["id"] = 1;
        $p["domain"] = $dat["domain"];
//        $url = "http://nwadmin3.loc/rpcsrv/api.inc.php";
        $url = "{$dat["domainApiRpc"]}/rpcsrv/api.inc.php";

        $data = Array();
        $data['method'] = 'createToken';
        $data['service'] = 'NWJSonRpcServer';
        $data['params'] = [];

        $arr = Array();
        $arr["user"] = "robot";
        $arr["password"] = "123456";
        $arr["profile"] = 1;
        $arr["company"] = 1;

        $data["params"][] = $arr;

        $cookieFile = "/tmp/cookies.txt";
        if (!file_exists($cookieFile)) {
            $fh = fopen($cookieFile, "w");
            fwrite($fh, "");
            fclose($fh);
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_COOKIESESSION, false);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, false);
//        curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
//        curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);

        $ret = curl_exec($ch);
        curl_close($ch);
        $r = json_decode($ret, true);

        $token = $r["token"];
//    echo "TOKEN::: {$token} :::FIN <br />";

        $data = array();
        $data['method'] = 'getSliders';
        $data['service'] = 'apiNwAds';
        $data['params'] = [];

        $arr = array();
        $arr["id"] = $p["id"];
        $arr["domain"] = $p["domain"];
//        if (isset($dat["data"])) {
//            foreach ($dat["data"] as $key => $row) {
//                $arr[$key] = $dat["data"][$key];
//            }
//        }
        $data["params"][] = $arr;

        $ch = curl_init();
        $authorization = "Authorization: Bearer " . $token;
//header('Content-Type: application/json');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
//********************Check these lines for headers*******************
        $headers = [
            "Content-Type: application/x-www-form-urlencoded; charset=utf-8",
            "Authorization: Bearer " . $token
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $ret = curl_exec($ch);
        curl_close($ch);
        $r = json_decode($ret, true);
//    print_r($r);
        return $r;
    }

    public static function validaCardConektaByApi($p) {
        $p = nwMaker::getData($p);
        //1. trae el cliente, si no existe lo crea
        $c = nwMaker::getKeysConekta($p);
        if ($c === false || $c === 0) {
            return "No hay configuración de keys";
        }
        $p["id_config"] = $c["id"];

        //pruebas rmóvil
//        $llavePublica = "key_Bks5AsVrZxP5ro3G79YaHzg";
//        $llavePrivada = "key_T8ct5EThjriCbiL4sBGvDQ";

        $llavePublica = $c["llavePublica"];
        $llavePrivada = $c["llavePrivada"];
        require_once $_SERVER['DOCUMENT_ROOT'] . $p["ruta"] . 'conekta-php-master/lib/Conekta.php';
        \Conekta\Conekta::setApiKey($llavePrivada);
        \Conekta\Conekta::setApiVersion("2.0.0");

        $customer_id = null;
        $cus = nwMaker::getCustomerConekta($p);
        if ($cus === false) {
            return $c;
        }
        $new = false;
        //existe
        if ($cus > 0) {
            $customer_id = $cus["id_customer"];
            $p["customer_id"] = $customer_id;
        }
        //lo crea
        else {
            $new = true;
            try {
                $customer = \Conekta\Customer::create(
                                [
                                    "name" => $p["name"],
                                    "email" => $p["email"],
                                    "phone" => $p["phone"],
                                    "metadata" => ["reference" => $p["reference"], "random_key" => "random value"],
                                    "payment_sources" => [
                                        [
                                            "type" => $p["payment_method_type"],
                                            "token_id" => $p["token_id"]
                                        ]
                                    ]//payment_sources
                                ]//customer
                );
            } catch (\Conekta\ProccessingError $error) {
                return $error->getMesage();
            } catch (\Conekta\ParameterValidationError $error) {
                return $error->getMessage();
            } catch (\Conekta\Handler $error) {
                return $error->getMessage();
            }
            $customer_id = $customer["id"];
            $p["customer_id"] = $customer_id;
        }
        //valida que tenga fondos
        try {
            $order = \Conekta\Order::create(
                            [
                                "line_items" => [
                                    [
                                        "name" => $p["itemName"],
                                        "unit_price" => $p["item_unit_price"],
                                        "quantity" => $p["itemQuantity"]
                                    ]
                                ],
                                "shipping_lines" => [
                                    [
                                        "amount" => 0
//                                "amount" => 1500,
//                                "carrier" => "FEDEX"
                                    ]
                                ], //shipping_lines - physical goods only
                                "currency" => "MXN",
                                "customer_info" => [
                                    "customer_id" => $customer_id
                                ],
                                "shipping_contact" => [
                                    "address" => [
                                        "street1" => $p["street1"],
                                        "postal_code" => $p["postal_code"],
                                        "country" => $p["country"]
                                    ]
                                ], //shipping_contact - required only for physical goods
                                "metadata" => ["reference" => $p["reference"], "more_info" => $p["more_info"]],
                                "charges" => [
                                    [
                                        "payment_method" => [
                                            "type" => "default"
//                                    "type" => $p["payment_method_type"],
//                                    "payment_source_id" => $p["token_id"]
                                        ]
                                    ////payment_method - use customer's default - a card
                                    //to charge a card, different from the default,
                                    //you can indicate the card's source_id as shown in the Retry Card Section
                                    ]
                                ]
                            ]
            );
        } catch (\Conekta\ProcessingError $error) {
            return $error->getMessage();
        } catch (\Conekta\ParameterValidationError $error) {
            return $error->getMessage();
        } catch (\Conekta\Handler $error) {
            return $error->getMessage();
        }


        if ($new) {
            $cusSave = nwMaker::saveCustomerConekta($p);
            if ($cusSave !== true) {
                return $cusSave;
            }
        }
        $cusUpdate = nwMaker::customerPaymentSourceConekta($p);
        if ($cusUpdate !== true) {
            return $cusUpdate;
        }

        $customer = \Conekta\Customer::find($customer_id);
        $source = $customer->payment_sources[0];
        $customer->update(
                [
                    "default_payment_source_id" => $source->id,
                ]
        );

        $p["documento"] = "1";
        $p["status"] = true;
        $p["currency"] = "MEX";
        $p["pais"] = "1";
        $p["pago_unico_mensual"] = "unico";
        $p["valor"] = "300";
        nwMaker::saveCreditCardPayment($p);

        nwMaker::saveCustomerCardConekta($p);

        return true;
    }

    public static function payConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $c = nwMaker::getKeysConekta($p);
        if ($c === false || $c === 0) {
            return $c;
        }
        $p["id_config"] = $c["id"];

        $llavePublica = $c["llavePublica"];
        $llavePrivada = $c["llavePrivada"];
        require_once $_SERVER['DOCUMENT_ROOT'] . $p["ruta"] . 'conekta-php-master/lib/Conekta.php';
        \Conekta\Conekta::setApiKey($llavePrivada);
        \Conekta\Conekta::setApiVersion("2.0.0");

        $customer_id = null;
        $cus = nwMaker::getCustomerConekta($p);
        if ($cus === false) {
            return $c;
        }
        if ($cus > 0) {
            $customer_id = $cus["id_customer"];
            $p["customer_id"] = $customer_id;
        } else {
            $validCustomer = [
                'name' => $p["name"],
                'email' => $p["email"],
                'antifraud_info' => array(
                    'account_created_at' => 1484040996,
                    'first_paid_at' => 1485151007,
                    'paid_transactions' => 4
                )
            ];
            $customer = \Conekta\Customer::create($validCustomer);
            $customer_id = $customer["id"];
            $p["customer_id"] = $customer_id;

            $cusSave = nwMaker::saveCustomerConekta($p);
            if ($cusSave !== true) {
                return $cusSave;
            }
        }

        $validOrderWithCheckout = array(
            'line_items' => array(
                array(
                    'name' => $p["itemName"],
                    'description' => $p["itemDescription"],
                    'unit_price' => $p["item_unit_price"],
                    'quantity' => $p["itemQuantity"],
                    'antifraud_info' => array(
                        'trip_id' => '12345',
                        'driver_id' => 'driv_1231',
                        'ticket_class' => 'economic',
                        'pickup_latlon' => '23.4323456,-123.1234567',
                        'dropoff_latlon' => '23.4323456,-123.1234567'
                    )
                )
            ),
            "shipping_lines" => array(
                array(
                    "amount" => 0
                )
            ),
            "shipping_contact" => array(
                "address" => array(
                    "street1" => $p["street1"],
                    "postal_code" => $p["postal_code"],
                    "country" => $p["country"]
                )
            ),
            'checkout' => array(
                'allowed_payment_methods' => array("cash", "card", "bank_transfer"),
                'monthly_installments_enabled' => false,
                'monthly_installments_options' => array(3, 6, 9, 12),
                "on_demand_enabled" => true
            ),
            'customer_info' => array(
                'customer_id' => $customer_id,
                'antifraud_info' => array(
                    'account_created_at' => 1484040996,
                    'first_paid_at' => 1485151007,
                    'paid_transactions' => 4
                )
            ),
            'currency' => 'mxn',
            'metadata' => array('test' => 'extra info')
        );
        $order = \Conekta\Order::create($validOrderWithCheckout);
        $array = json_decode(json_encode($order), true);

        $p["checkout_id"] = $array["checkout"]["id"];
        $p["json_response"] = json_encode($array);

        $orderSave = nwMaker::saveOrderConekta($p);
        if ($orderSave !== true) {
            return $orderSave;
        }
        $array["llavePublica"] = $llavePublica;
        return $array;
    }

    public static function saveCustomerCardConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $ca->prepareSelect("nwconekta_customer_tokens_card", "id", "token_id=:token_id");
        $ca->bindValue(":token_id", $p["token_id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        if ($ca->size() === 0) {
            $ca->prepareInsert("nwconekta_customer_tokens_card", "id_customer,token_id,fecha");
            $ca->bindValue(":id_customer", $p["customer_id"]);
            $ca->bindValue(":token_id", $p["token_id"]);
            $ca->bindValue(":fecha", $fecha);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText(), true);
            }
        }
        return true;
    }

    public static function getKeysConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwconekta_config", "id,llavePublica,llavePrivada", "estado=:estado");
        $ca->bindValue(":estado", "ACTIVA");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function getCustomerConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $token_id = null;
        $where = "email=:email and perfil=:perfil and empresa=:empresa and id_config=:id_config";
//        if (isset($p["token_id"])) {
//            $where .= " and token_id=:token_id";
//            $token_id = $p["token_id"];
//        }
        $ca->prepareSelect("nwconekta_customer", "id_customer,token_id", $where);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":id_config", $p["id_config"]);
        $ca->bindValue(":token_id", $token_id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function customerPaymentSourceConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "id_customer=:id_customer";
        $ca->prepareUpdate("nwconekta_customer", "token_id", $where);
        $ca->bindValue(":id_customer", $p["customer_id"]);
        $ca->bindValue(":token_id", $p["token_id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return true;
    }

    public static function saveCustomerConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $ca->prepareInsert("nwconekta_customer", "name,email,fecha,id_customer,perfil,empresa,terminal,id_config", "email=:email");
        $ca->bindValue(":name", $p["name"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":id_customer", $p["customer_id"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":terminal", $p["terminal"]);
        $ca->bindValue(":id_config", $p["id_config"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return true;
    }

    public static function saveOrderConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $extra = "";
        $f = "fecha,email_customer,customer_id,checkoutRequestId,valor,json_response,type,empresa,terminal,perfil,id_config";
        if (isset($p["extra"])) {
            $f .= ",extra";
            $extra = $p["extra"];
        }
        $ca->prepareInsert("nwconekta_orders", $f);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":email_customer", $p["email"]);
        $ca->bindValue(":customer_id", $p["customer_id"]);
        $ca->bindValue(":checkoutRequestId", $p["checkout_id"]);
        $ca->bindValue(":valor", $p["item_unit_price"]);
        $ca->bindValue(":json_response", $p["json_response"]);
        $ca->bindValue(":type", "create");
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":terminal", $p["terminal"]);
        $ca->bindValue(":id_config", $p["id_config"]);
        $ca->bindValue(":extra", $extra);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        return true;
    }

    public static function getKeysWompi($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_wompi_config", "*", "activo='SI' and empresa=:empresa order by id desc limit 1");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText(), true);
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function actualizaBD($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            qxnw_updater::updateVersionDb($p);
        } else {
            updaterNwp::nwmaker($p);
        }
        return $driver . " Actualizado correctamente!";
    }

    public static function evalueData($string) {
        if ($string === "") {
            return false;
        }
        if ($string === null) {
            return false;
        }
        if ($string === false) {
            return false;
        }
        return true;
    }

    public static function error($error, $send = false) {
//        if ($send === true) {
//            //ADD Oct 2022
//            $debug = json_encode(debug_backtrace());
//            $error .= $debug;
//            $requestHeaders = apache_request_headers();
//            $error .= " <br /><br /><br />:: HEADERS: " . json_encode($requestHeaders);
//            //END ADD 25 Oct 2022
//
//            $log = master::sendReport($error);
//            $end = $log . " ::::::  ERROR SHOW: " . $error;
//            $r = Array();
//            $r["error"] = Array();
//            $r["error"]["message"] = $log;
//            $r["error"]["message_developer"] = $error;
//            return $r;
//        }
        return NWJSonRpcServer::error($error);
    }

    public static function saveVideollamadaInTaskCalendar($p) {
        return;
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getDataSESSION($p, "usuario");
        $id_usuario = nwMaker::getDataSESSION($p, "id_usuario");
        $username = nwMaker::getDataSESSION($p, "username");
        $terminal = nwMaker::getDataSESSION($p, "terminal");
        $room = nwMaker::getDataSESSION($p, "room");
        $id_tarea = nwMaker::getDataSESSION($p, "id_tarea");
        $tarea = "Videollamada - room: {$room} ";
        $fecha_completa = date("Y-m-d H:i:s");
        $fecha = explode(" ", $fecha_completa)[0];
        $hora = explode(" ", $fecha_completa)[1];
        $fecha_end = nwMaker::sumaRestaFechas("+0 hour", "+1 minute", "+0 second");
        $hora_end = explode(" ", $fecha_end)[1];
        $f = "id,tarea,descripcion,fecha,hora_inicial,hora_final,asignado_a,asignado_por,estado,usuario,hora,fecha_y_hora,asignado_a_username,fecha_creacion";
        $f .= ",asignado_a_text,terminal,tipo";
        if ($id_tarea === "NONE") {
            $id = master::getNextSequence("nwtask_tareas_id_seq", $db);
            $ca->prepareInsert("nwtask_tareas", $f);
        } else {
            $id = $id_tarea;
            $ca->prepareUpdate("nwtask_tareas", "hora_final", "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":terminal", $terminal);
        $ca->bindValue(":tarea", $tarea);
        $ca->bindValue(":descripcion", $tarea);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":fecha_y_hora", $fecha_completa);
        $ca->bindValue(":fecha_creacion", $fecha_completa);
        $ca->bindValue(":hora", $hora);
        $ca->bindValue(":hora_inicial", $hora);
        $ca->bindValue(":hora_final", $hora_end);
        $ca->bindValue(":asignado_a", $id_usuario);
        $ca->bindValue(":asignado_por", $usuario);
        $ca->bindValue(":estado", "Finalizado");
        $ca->bindValue(":tipo", "calendar");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":asignado_a_username", $usuario);
        $ca->bindValue(":asignado_a_text", $username);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
//        $descripcion = "Usuarios: {$p["users"]} -<br /> Detalle: {$p["usersDetalle"]}";
//        $ca->prepareInsert("nwtask_tareas_comments", "descripcion,tarea_id,tipo,usuario,fecha,usuario_nombre,terminal");
//        $ca->bindValue(":descripcion", $descripcion);
//        $ca->bindValue(":tarea_id", $id);
//        $ca->bindValue(":tipo", "tarea");
//        $ca->bindValue(":usuario", $p["usuario"]);
//        $ca->bindValue(":fecha", $fecha_completa);
//        $ca->bindValue(":usuario_nombre", $p["username"]);
//        $ca->bindValue(":terminal", $p["terminal"]);
//        if (!$ca->exec()) {
//            return nwMaker::error($ca->lastErrorText());
//        }
        return $id;
    }

    public static function createSignature($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nc_config", "pagos_merchantid,pagos_accountid,pagos_pruebas,apikey", "terminal=:terminal");
        $ca->bindValue(":terminal", $p["terminal"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $c = $ca->flush();
        $test = "0";
        $pruebas = false;
        if ($c["pagos_pruebas"] === "SI") {
            $pruebas = true;
            $test = "1";
        }
        $prue = "https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/";
        $prod = "https://checkout.payulatam.com/ppp-web-gateway-payu/";
        $ApiKey = $c["apikey"];
        $accountId = $c["pagos_accountid"];
        $merchantId = $c["pagos_merchantid"];
        $urlSend = $prod;
        if ($pruebas) {
            $ApiKey = "4Vj8eK4rloUd272L48hsrarnUA";
            $accountId = "512321";
            $merchantId = "508029";
            $urlSend = $prue;
        }
        $signature_decode = $ApiKey . "~" . $merchantId . "~" . $p["referenceCode"] . "~" . $p["tx_value"] . "~" . $p["currency"];
        $signature = nwMaker::encrypt($ApiKey . "~" . $merchantId . "~" . $p["referenceCode"] . "~" . $p["tx_value"] . "~" . $p["currency"], "md5");

        $a = Array();
        $a["pagos_merchantid"] = $merchantId;
        $a["pagos_accountid"] = $accountId;
        $a["signature"] = $signature;
        $a["signature_decode"] = $signature_decode;
        $a["urlSend"] = $urlSend;
        $a["test"] = $test;
        return $a;
    }

    public static function limpiaTildes($string) {
        $unwanted_array = array('Š' => 'S', 'š' => 's', 'Ž' => 'Z', 'ž' => 'z', 'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'A', 'Ç' => 'C', 'È' => 'E', 'É' => 'E',
            'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ø' => 'O', 'Ù' => 'U',
            'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ý' => 'Y', 'Þ' => 'B', 'ß' => 'Ss', 'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'a', 'ç' => 'c',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ð' => 'o', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o',
            'ö' => 'o', 'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ý' => 'y', 'þ' => 'b', 'ÿ' => 'y');
        return strtr($string, $unwanted_array);
    }

    public static function sendEmailMasivo($p) {
        $p = nwMaker::getData($p);
//        $MJ_APIKEY_PUBLIC = "38ae35bee56d0994aea0d66cdc1cef5d";
//        $MJ_APIKEY_PRIVATE = "bc3a48af9bca3525adb6210dbbefc154";
        $MJ_APIKEY_PUBLIC = $p["MJ_APIKEY_PUBLIC"];
        $MJ_APIKEY_PRIVATE = $p["MJ_APIKEY_PRIVATE"];
        $contacts = $p["contacts"];
        $subject = $p["subject"];
        $body = $p["body"];
        $from_name = $p["from_name"];
        $from_email = $p["from_email"];
        return require $_SERVER['DOCUMENT_ROOT'] . '/nwlib6/nwproject/modules/mails_masivos/send_email.php';
//        return require $_SERVER['DOCUMENT_ROOT'] . '/app/emails_masivos/send_email.php';
    }

    public static function getUserSMS() {
        $c = nwprojectOut::nwpMakerConfig();
        $us = "GRUPONW";
        if (isset($c["userSMS"]) && $c["userSMS"] !== null && $c["userSMS"] !== false && $c["userSMS"] !== "") {
            $us = $c["userSMS"];
        }
        return $us;
    }

    public static function getPassSMS() {
        $c = nwprojectOut::nwpMakerConfig();
        $us = "Nw729272";
        if (isset($c["passSMS"]) && $c["passSMS"] !== null && $c["passSMS"] !== false && $c["passSMS"] !== "") {
            $us = $c["passSMS"];
        }
        return $us;
    }

    public static function validaDescargaSaldoSmsByEmpresa($p) {
        $c = nwprojectOut::nwpMakerConfig();
        if (isset($c["descarga_saldo_sms_by_empresa"]) && $c["descarga_saldo_sms_by_empresa"] !== null && $c["descarga_saldo_sms_by_empresa"] !== false && $c["descarga_saldo_sms_by_empresa"] !== "") {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("empresas", "saldo_sms,saldo_correos,usuario_sms,password_sms,tarifa_sms", "id=:empresa");
            $ca->bindValue(":empresa", $p["empresa"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() === 0) {
                return false;
            }
            $empresa = $ca->flush();

            $valor_sms = "60";
            $valor_email = "100";
            if (isset($empresa["tarifa_sms"]) && $empresa["tarifa_sms"] !== null) {
                $valor_sms = $empresa["tarifa_sms"];
            }
            if (isset($empresa["tarifa_correo"]) && $empresa["tarifa_correo"] !== null) {
                $valor_email = $empresa["tarifa_correo"];
            }
            $valor_descarga = $valor_sms;
            $camp_update = "saldo_sms";
            $saldo = $empresa["saldo_sms"] - $valor_sms;

            $sl = Array();
            $sl["saldo_nuevo"] = $saldo;
            $sl["saldo_anterior"] = $empresa["saldo_sms"];
            $sl["valor_descarga"] = $valor_descarga;
            $sl["campo"] = $camp_update;
            $sl["empresa"] = $p["empresa"];
            $sl["perfil"] = $p["perfil"];
            $sl["usuario"] = $p["celular"];
            $sl["tipo"] = $p["tipo"];
            $sl["description"] = $p["description"];
            $s = nwMaker::actualizaSaldo($sl);
            if ($s !== true) {
                $db->rollback();
                return $s;
            }
            return true;
        }
        return true;
    }

    public static function actualizaSaldo($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $saldo = $p["saldo_nuevo"];
        $campo = $p["campo"];
        $empresa = $p["empresa"];
        if ($campo == "") {
            return true;
        }
        $ca->prepareUpdate("empresas", $campo, "id=:empresa");
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":" . $campo, $saldo);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareInsert("nwmaker_history_saldos", "fecha,tipo,description,saldo_anterior,saldo_nuevo,valor_descarga,usuario,empresa,perfil");
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":description", $p["description"]);
        $ca->bindValue(":saldo_anterior", $p["saldo_anterior"]);
        $ca->bindValue(":saldo_nuevo", $p["saldo_nuevo"]);
        $ca->bindValue(":valor_descarga", $p["valor_descarga"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getPromotionsApp($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
//        $ca->prepareSelect("nwmaker_promotions_in_app", "*", "empresa=:empresa and perfil=:perfil and activo='SI' and :fecha >= fecha_inicial and :fecha <=fecha_final order by orden asc");
        $ca->prepareSelect("nwmaker_promotions_in_app", "*", "empresa=:empresa and activo='SI' and :fecha >= fecha_inicial and :fecha <=fecha_final order by orden asc");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", $fecha);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function populateCountriesByIndicativo($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $countryCode = null;
        $where = "1=1 and (indicativo_celular IS NOT NULL or indicativo_celular!='') ";
        if (isset($p["countryCode"])) {
            $countryCode = $p["countryCode"];
        }
        $fields = "*";
        if (isset($p["fields"])) {
            $fields = $p["fields"];
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("paises", $fields, $where);
        $ca->bindValue(":countryCode", $countryCode);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function populateAppMaestroVersiones($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_current_version", "*", "1=1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function guardaAppMaestroVersiones($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["id"] !== "") {
            $ca->prepareUpdate("nwmaker_current_version", "version,usuario,fecha,os,empresa,perfil,description", "id=:id");
        } else {
            $ca->prepareInsert("nwmaker_current_version", "version,usuario,fecha,os,empresa,perfil,description");
        }
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":version", $p["version"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", $p["fecha"]);
        $ca->bindValue(":os", $p["os"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":description", $p["description"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function populateCountries($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $countryCode = null;
        $where = "1=1";
        if (isset($p["countryCode"])) {
//            $where .= " and alias=:countryCode";
            $countryCode = $p["countryCode"];
        }
        $fields = "*";
        if (isset($p["fields"])) {
            $fields = $p["fields"];
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("paises", $fields, $where);
        $ca->bindValue(":countryCode", $countryCode);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function populateCities($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $countryCode = null;
        $where = "1=1";
        if (isset($p["pais_id"])) {
            $where .= " and pais_id=:pais_id";
            $countryCode = $p["pais_id"];
        }
        if (isset($p["field"]) && isset($p["value"])) {
            $where .= " and {$p["field"]}={$p["value"]} ";
        }
        $fields = "*";
        if (isset($p["fields"])) {
            $fields = $p["fields"];
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("ciudades", $fields, $where);
        $ca->bindValue(":pais_id", $countryCode);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function nuevaVideollamadaRingow($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $usuario = nwMaker::getUser($p);
        $terminal = nwMaker::getTerminal($p);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        if (isset($p["id"])) {
            $id = $p["id"];
        } else {
            $id = master::getNextSequence("nwmaker_videollamadas_id_seq", $db);
        }
//        $ringow = false;
        $ringow = true;
        if (!$ringow) {
            $da = self::getUserRainbow($usuario);
            if ($da === 0) {
                $a = "admin1@netwoods.net";
                $u = "admin2@netwoods.net";
            } else {
                $a = $da["usuario_asesor_rainbow"];
                $u = $da["usuario_cliente_rainbow"];
            }
            $link = "https://app.ringow.com/ale/main/user/index.html?a={$a}&u={$u}&s={$id}";
            $my_link = "https://app.ringow.com/ale/main/agent/index.html?a={$a}&u={$u}&s={$id}";
        } else {
            $protocolo = nwMaker::protocoloHTTPS();
//            $link = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . "/nwlib6/nwproject/modules/webrtc/v4/index.html?myID={$p["usuario_recibe"]}&otherID={$usuario}&room={$id}";
//            $my_link = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . "/nwlib6/nwproject/modules/webrtc/v4/index.html?myID={$usuario}&otherID={$p["usuario_recibe"]}&room={$id}";
//            $link = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . "/nwlib6/nwproject/modules/webrtc/v4/index.html?room={$id}";
//            $link = "https://meet.gruponw.com/{$id}";
            $link = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . "/nwlib6/nwproject/modules/webrtc/v4/initVideo.php?room={$id}&fileRecordingsEnabled=true&terminal={$terminal}";
            $my_link = $link;
        }
        if (!isset($p["reenviar"])) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareInsert("nwmaker_videollamadas", "id,usuario,usuario_recibe,terminal,empresa,tipo,fecha,fecha_caducidad,observaciones,nombre,link_usuario_recibe,link_usuario");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":usuario_recibe", $p["usuario_recibe"]);
            $ca->bindValue(":terminal", $terminal);
            $ca->bindValue(":empresa", $empresa);
            $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ca->bindValue(":tipo", "ringow_task");
            $ca->bindValue(":fecha_caducidad", $p["fecha_caducidad"]);
            $ca->bindValue(":nombre", $p["nombre"]);
            $ca->bindValue(":observaciones", $p["observaciones"]);
            $ca->bindValue(":link_usuario_recibe", $link);
            $ca->bindValue(":link_usuario", $my_link);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
        }
        $pl = self::getPlantilla("INVITACION_VIDEOLLAMADA", $si["terminal"]);
        $x = false;
        if ($pl > 0) {
            $asunto = $pl["asunto"];
            $asunto = str_replace("{nombre_envia}", $si["nombre"], $asunto);
            $asunto = str_replace("{apellido_envia}", $si["apellido"], $asunto);

            $textBody = $pl["cuerpo_mensaje"];
            $textBody = str_replace("{fecha_caducidad}", $p["fecha_caducidad"], $textBody);
            $textBody = str_replace("{nombre_recibe}", $p["nombre"], $textBody);
            $textBody = str_replace("{nombre_envia}", $si["nombre"], $textBody);
            $textBody = str_replace("{apellido_envia}", $si["apellido"], $textBody);
            $textBody = str_replace("{usuario_envia}", $usuario, $textBody);
            $textBody = str_replace("{fecha_caducidad}", $p["fecha_caducidad"], $textBody);
            $textBody = str_replace("{observaciones}", $p["observaciones"], $textBody);
            $textBody = str_replace("{link}", $link, $textBody);
        } else {
            $asunto = "Invitación videollamada por {$si["nombre"]} {$si["apellido"]}";
            $titleEnc = "Invitación videollamada por {$si["nombre"]} {$si["apellido"]}";
            $textBody = "El usuario {$si["nombre"]} {$si["apellido"]} ({$usuario}) ha generado una sala para iniciar una videollamada";
            $textBody .= "<br /><br />Haz click en el link para ingresar <a href='{$link}' target='_BLANK' style='background-color: #3ecc74;color: #fff;display: block;border-radius: 5px;text-decoration: none;padding: 5px;'>Ingresar a Video Llamada</a>";
            $textBody .= "<br />Caducidad: {$p["fecha_caducidad"]}";
            $textBody .= "<br />Observaciones: {$p["observaciones"]}";
        }
        $send = nw_configuraciones::sendEmail($p["usuario_recibe"], $p["nombre"], $asunto, $asunto, $textBody, false, $x, true);
        if ($send !== true) {
            return $send;
        }
        return $my_link;
    }

    public static function getPlantilla($tipo, $terminal = null) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "tipo='{$tipo}' and activo='SI' ";
        if ($terminal !== null) {
            $where .= " and terminal=:terminal";
        }
        $where .= " order by id desc limit 1 ";
        $ca->prepareSelect("sop_plantillas_correos", "asunto,cuerpo_mensaje,enviado_desde_correo,enviado_desde_nombre,cuerpo_notificacion_interna", $where);
        $ca->bindValue(":terminal", $terminal);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function getPlantillaByTypeCompany($tipo, $empresa = null) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "tipo='{$tipo}' and activo='SI' ";
        if ($empresa !== null) {
            $where .= " and empresa=:empresa";
        }
        $where .= " order by id desc limit 1 ";
        $ca->prepareSelect("nwmaker_plantillas_correos", "asunto,cuerpo_mensaje,enviado_por_correo,enviado_por_nombre", $where);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function getUserRainbow($usuario) {
        nwMaker::checkSession();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "usuario_asesor_rainbow,usuario_cliente_rainbow", "usuario_cliente=:usuario");
        $ca->bindValue(":usuario", $usuario);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function getMyLastVideollamadaRingow($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $ca->prepareSelect("nwmaker_videollamadas", "*", "usuario=:usuario order by id desc");
        $ca->bindValue(":usuario", $usuario);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaSaldoUserApp($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $f = "saldo,puntaje";
        if (isset($p["fecha_vencimiento_saldo"])) {
            $f .= ",fecha_vencimiento_saldo,fecha_ultima_recarga,saldo_por_tiempo";
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), $f, "id=:id");
        $ca->bindValue(":id", $p["id"], true, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function get_ip_detail($id_add = false) {
        $ip = master::getRealIp();
        if ($id_add !== false) {
            $ip = $id_add;
        }
    }

    public static function shorten_URL($longUrl, $dynamicLinkInfo = false) {
        if ($dynamicLinkInfo === false || $dynamicLinkInfo === null || $dynamicLinkInfo === "") {
//            $dynamicLinkInfo = "fnez8.app.goo.gl";
            $dynamicLinkInfo = "gruponw.page.link";
        }
//        $key = 'AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss';
        $key = 'AIzaSyDIQArFnVJ5aJSyPmXYrWyexrhb5LkmceM';
        $url = 'https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=' . $key;
        $data = array(
//        "longDynamicLink" => "https://fnez8.app.goo.gl/?link={$longUrl}",
            "dynamicLinkInfo" => array(
                "dynamicLinkDomain" => $dynamicLinkInfo,
                "link" => $longUrl
            ),
            "suffix" => array(
                "option" => "SHORT"
            )
        );

        $headers = array('Content-Type: application/json');

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

        $data = curl_exec($ch);
        curl_close($ch);

        $short_url = json_decode($data);
        if (isset($short_url->error)) {
            nwMaker::error($short_url->error->message);
            return $short_url->error->message;
        } else {
            return $short_url->shortLink;
        }
    }

    public static function sendNotificacionPush($p) {
        return nwMakerApis::sendNotificacionPush($p);
    }

    public static function createEventCalendarOutlook($p) {
        return nwMakerApis::createEventCalendarOutlook($p);
    }

    public static function random($init = 111111, $end = 999999) {
        return random_int($init, $end);
    }

    public static function encrypt($value, $type = null) {
        return NWUtils::encrypt($value, $type);
    }

    public static function getUser($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $usuario = false;
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        } else
        if (isset($si["usuario"])) {
            nwMaker::checkSession();
            $usuario = $si["usuario"];
        }
        return $usuario;
    }

    public static function getDataSESSION($p, $field) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $usuario = false;
        if (isset($p["{$field}"])) {
            $usuario = $p["{$field}"];
        } else
        if (isset($si["{$field}"])) {
            nwMaker::checkSession();
            $usuario = $si["{$field}"];
        }
        return $usuario;
    }

    public static function getIDUserMaker($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $id_usuario = false;
        if (isset($p["id_usuario"])) {
            $id_usuario = $p["id_usuario"];
        } else
        if (isset($si["id_usuario"])) {
            nwMaker::checkSession();
            $id_usuario = $si["id_usuario"];
        }
        return $id_usuario;
    }

    public static function getTerminal($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $terminal = false;
        if (isset($p["terminal"])) {
            $terminal = $p["terminal"];
        } else
        if (isset($si["terminal"])) {
            nwMaker::checkSession();
            $terminal = $si["terminal"];
        }
        return $terminal;
    }

    public static function getEmpresaSession($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $empresa = false;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
        } else
        if (isset($si["empresa"])) {
            nwMaker::checkSession();
            $empresa = $si["empresa"];
        }
        return $empresa;
    }

    public static function changeMetodoPagoUser($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("pv_clientes", "metodo_de_pago,id_tarjeta_credito_metodo,name_tarjeta_credito_metodo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":metodo_de_pago", $p["metodo"]);
        $ca->bindValue(":id_tarjeta_credito_metodo", $p["id_tarjeta_credito_metodo"]);
        $ca->bindValue(":name_tarjeta_credito_metodo", $p["name_tarjeta_credito_metodo"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function myCreditsCards($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $perfil = nwMaker::getDataSESSION($p, "perfil");
//        $ca->prepareSelect("nwmaker_tarjetascredito", "*", "usuario=:usuario and empresa=:empresa and perfil=:perfil and status='OK' ");
        $ca->prepareSelect("nwmaker_tarjetascredito", "*", "usuario=:usuario and empresa=:empresa and perfil=:perfil ");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function myCreditsCardsAlter($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $ca->prepareSelect("nwmaker_tarjetascredito", "*,numero_tarjeta as id", "usuario=:usuario");
        $ca->bindValue(":usuario", $usuario);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function eliminarCreditCard($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nwmaker_tarjetascredito", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getIdUser($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $id_usuario = false;
        if (isset($p["id_usuario"])) {
            $id_usuario = $p["id_usuario"];
        } else
        if (isset($si["id_usuario"])) {
            nwMaker::checkSession();
            $id_usuario = $si["id_usuario"];
        }
        return $id_usuario;
    }

    public static function deleteTokenPush($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nwmaker_suscriptorsPush", "json=:json and usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":json", $p["token"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function saveTokenPush($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $fields = "json,usuario,fecha";
        $device = null;
        if (isset($p["device"])) {
            $device = nwMaker::cortaText($p["device"], 99);
            $fields .= ",device";
        }
        $perfil = null;
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $fields .= ",perfil";
        }
        $empresa = null;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
            $fields .= ",empresa";
        }
        if (isset($p["token"])) {
            if (nwMaker::evalueData($p["token"])) {
                $user = nwMaker::fieldsUsersNwMaker("usuario_cliente");
                $where = "{$user}=:usuario";
                $where .= " and empresa=:empresa ";
                $where .= " and perfil=:perfil ";
                $table = nwMaker::tableUsersNwMaker();
                $field1 = "token_actual_app,token_actual_app_fecha";
                $zonaHorariaActual = null;
                if (isset($p["zonaHorariaActual"])) {
                    $zonaHorariaActual = $p["zonaHorariaActual"];
                    $field1 .= ",zonaHorariaActual";
                }
                $ca->prepareUpdate($table, $field1, $where);
                $ca->bindValue(":usuario", $p["usuario"]);
                $ca->bindValue(":empresa", $empresa);
                $ca->bindValue(":perfil", $perfil);
                $ca->bindValue(":token_actual_app", $p["token"]);
                $ca->bindValue(":token_actual_app_fecha", $fecha);
                $ca->bindValue(":zonaHorariaActual", $zonaHorariaActual);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
            }
        }
        if (isset($p["sigue2"])) {
            if ($p["sigue2"] == true || $p["sigue2"] == "true") {
                $ca->prepareInsert("nwmaker_suscriptorsPush", $fields);
                $ca->bindValue(":usuario", $p["usuario"]);
                $ca->bindValue(":json", $p["token"]);
                $ca->bindValue(":device", $device);
                $ca->bindValue(":fecha", $fecha);
                $ca->bindValue(":empresa", $empresa);
                $ca->bindValue(":perfil", $perfil);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
            }
        }
        return true;
    }

    public static function getUsersTokens($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_suscriptorsPush", "DISTINCT json as id,usuario as nombre", "usuario is not null and usuario!=:usuario order by usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function getCurrentVersion($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1";
        $os = null;
        if (isset($p["os"])) {
            $os = $p["os"];
            $where .= " and os=:os ";
        }
        $empresa = null;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
            $where .= " and empresa=:empresa ";
        }
        $perfil = null;
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil ";
        }
        $where .= " order by id desc limit 1";
        $ca->prepareSelect("nwmaker_current_version", "version,fecha", $where);
        $ca->bindValue(":os", $os);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function generateCodeUserNew($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
//        $ca->prepareSelect("usuarios", "estado", "usuario=:usuario_solicita");
//        $ca->bindValue(":usuario_solicita", $p["usuario"]);
//        $ca->bindValue(":documento", $p["documento"]);
//        if (!$ca->exec()) {
//          return nwMaker::error($ca->lastErrorText());
//        }
//        if ($ca->size() == 0) {
//            return "El usuario {$p["usuario"]} no existe.";
//        }
        $ca->prepareSelect("vis_solicitud_code", "estado", "usuario_solicita=:usuario_solicita and documento=:documento order by id desc limit 1");
        $ca->bindValue(":usuario_solicita", $p["usuario"]);
        $ca->bindValue(":documento", $p["documento"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $r = $ca->flush();
            if ($r["estado"] === "SOLICITUD") {
                return "El usuario {$p["usuario"]} ya tiene una solicitud de código pendiente.";
            }
        }
        $ca->prepareInsert("vis_solicitud_code", "usuario_solicita,documento,fecha_solicitud,estado");
        $ca->bindValue(":usuario_solicita", $p["usuario"]);
        $ca->bindValue(":documento", $p["documento"]);
        $ca->bindValue(":fecha_solicitud", $fecha);
        $ca->bindValue(":estado", "SOLICITUD");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareSelect("vis_plantillas_correos", "asunto,cuerpo_mensaje,enviado_desde_correo,enviado_desde_nombre", "tipo='GENERAR_CODIGO' and activo='SI' order by id desc limit 1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            nwMaker::error("No existen plantillas de correo para el tipo GENERAR_CODIGO. Consulte con el administrador del sistema.", true);
        }
        $pl = $ca->flush();

        $ca->prepareSelect("vis_plantillas_correos_destinatarios", "nombre,correo", "tipo='GENERAR_CODIGO'");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            nwMaker::error("No existen destinatarios de correo para la plantilla de tipo GENERAR_CODIGO. Consulte con el administrador del sistema.", true);
        }
        $des = $ca->assocAll();
        $desT = $ca->size();

        $xa = false;
//        $xa = Array();
//        $xa["logo"] = "https://www.taskenter.com/imagenes/1133816082030.png";
//        $xa["razon_social"] = "Taskenter - NwSupport";
//        $xa["slogan"] = "Red Social Corporativa - NwSupport";
        $body = $pl["cuerpo_mensaje"];
        $body = str_replace("{usuario}", $p["usuario"], $body);
        $body = str_replace("{documento}", $p["documento"], $body);
        $body = str_replace("{fecha}", $fecha, $body);
        $asunto = $pl["asunto"];
        $titleEnc = $pl["asunto"];
        $textBody = $body;
        $cliente_nws = false;
        $cleanHtml = false;
        $fromName = $pl["enviado_desde_nombre"];
        $fromEmail = $pl["enviado_desde_correo"];
        for ($i = 0; $i < $desT; $i++) {
            $r = $des[$i];
            $send = nw_configuraciones::sendEmail($r["correo"], $r["nombre"], $asunto, $titleEnc, $textBody, $cliente_nws, $xa, $cleanHtml, $fromName, $fromEmail);
            if (!$send) {
                return $send;
            }
        }
        return true;
    }

    public static function printHeaderFooter($r) {
        $rta = "<html>
    <head>
        <style type='text/css'>
            thead
            {
                display: table-header-group;
            }
            thead td
            {
                font-family: arial, verdana;
                font-weight: normal;
                font-style: normal;
            }
            tfoot
            {
                display: table-footer-group;
            }
            tfoot td
            {
                font-family: arial, verdana;
                font-size: 8pt;
                font-weight: normal;
                font-style: normal;
            }
            tbody td
            {
                font-family: arial, verdana;
                font-size: 10pt;
                font-weight: normal;
                font-style: normal;
            }
        </style>
    </head>
    <body>
        <table>
            <thead>
                <tr>
                    <td>{$r["header"]}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                    {$r["body"]}
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>{$r["footer"]}</td>
                </tr>
            </tfoot>
        </table>
    </body>
</html>";
        return $rta;
    }

    public static function changeRecoveryPassNwMaker($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $passnew = null;
        if (isset($p["passnew"])) {
            $passnew = $p["passnew"];
        }
        if (isset($p["nueva"])) {
            $passnew = $p["nueva"];
        }
        $usuario = null;
        if (isset($p["user"])) {
            $usuario = $p["user"];
        }
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        }
        if ($usuario === null) {
            return false;
        }
        if ($passnew === null) {
            return false;
        }
        $empresa = null;
        $perfil = null;
        $user = nwMaker::fieldsUsersNwMaker("usuario_cliente");
        $where = "{$user}=:usuario";
        if (isset($p["pedir_empresa"])) {
            $empresa = $p["pedir_empresa"];
            $where .= " and empresa=:empresa";
        }
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil";
        }
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), nwMaker::fieldsUsersNwMaker("clave") . "," . nwMaker::fieldsUsersNwMaker("fecha_actualizacion"), $where);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":clave", nwMaker::encrypt($passnew));
        $ca->bindValue(":fecha_actualizacion", $fecha);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $ca->prepareUpdate("nwmaker_resetpass", "usado", "usuario=:usuario and tipo='resetpass' ");
        $ca->bindValue(":usuario", $usuario, true, true);
        $ca->bindValue(":usado", "SI");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "email", $where);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $user = $ca->flush();
            $titleEnc = "<p>Hola {$usuario}</p>";
            $textBody = "<p>Tu contraseña en {$_SERVER["HTTP_HOST"]} ha sido cambiada exitosamente.</p>";
            $textBody .= "<p>Recuerda, tu nueva contraseña es {$passnew} </p>";
            nw_configuraciones::sendEmail($user["email"], $user["email"], "Cambio de clave exitoso en {$_SERVER["HTTP_HOST"]} ", $titleEnc, $textBody, false);
            nw_configuraciones::sendEmail("orionjafe@gmail.com", "orionjafe@gmail.com", "Cambio de clave exitoso en {$_SERVER["HTTP_HOST"]} ", $titleEnc, $textBody, false);
        }
        return true;
    }

    public static function sendCodeCambioClave($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $date = nwMaker::sumaRestaFechas("+0 hour", "-5 minute", "+0 second");
        $ca->prepareSelect("nwmaker_resetpass", "id,usuario", "token=:token and usado='NO' and tipo='resetpass_app' and :fecha<=fecha order by id desc ");
        $ca->bindValue(":token", $p["token"], true, true);
        $ca->bindValue(":fecha", $date);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "El código no es válido, verifique por favor";
        }
        $r = $ca->flush();
        $perfil = null;
        $empresa = null;
        $user = nwMaker::fieldsUsersNwMaker("usuario_cliente");
        $where = "1=1 and ({$user}=:usuario or email=:usuario) ";
        if (isset($p["pedir_empresa"])) {
            $empresa = $p["pedir_empresa"];
            $where .= " and empresa=:empresa";
        }
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil";
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "*", $where);
        $ca->bindValue(":usuario", $r["usuario"], true, true);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "El usuario no existe, verifique el correo registrado";
        }
        $ra = $ca->flush();
        $ca->prepareUpdate("nwmaker_resetpass", "usado", "id=:id");
        $ca->bindValue(":id", $r["id"]);
        $ca->bindValue(":usado", "SI");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if (nwMaker::validateIsNwMaker() === true) {
            $ra["usuario"] = $ra["usuario_cliente"];
        }
        return $ra;
    }

    public static function solicitarCambioClave($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $empresa = null;
        $perfil = null;
        $celular = null;
        $datos_empresa = false;
        $fieldsRes = "token,fecha,usuario,usado,tipo";
//        $user = nwMaker::fieldsUsersNwMaker("usuario_cliente");
//        $where = "{$user}=:usuario";
        $where = "email=:email";
        if (isset($p["pedir_empresa"])) {
            $empresa = $p["pedir_empresa"];
            $where .= " and empresa=:empresa";
            $fieldsRes .= ",empresa";
        }
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil";
            $fieldsRes .= ",perfil";
        }
        if (isset($p["pedir_empresa"]) && isset($p["pedir_empresa"]) != "" && isset($p["pedir_empresa"]) != false) {
            $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
            $ca->prepareSelect("empresas", "razon_social,slogan,logo", "id=:empresa");
            $ca->bindValue(":empresa", $p["pedir_empresa"]);
            if (!$ca->exec()) {
                nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() == 1) {
                $datos_empresa = $ca->flush();
                $datos_empresa["logo"] = "https://" . $hostname . "/{$datos_empresa["logo"]}";
            }
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "email,nombre,celular", $where);
        $ca->bindValue(":email", $p["correo_registrado"]);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "El usuario no existe, verifique el correo registrado";
        }
        $r = $ca->flush();
        if ($r["celular"] !== null && $r["celular"] !== false && $r["celular"] !== "") {
            $celular = $r["celular"];
            $fieldsRes .= ",celular";
        }
        $token = nwMaker::random(100000, 999999);
        $ca->prepareInsert("nwmaker_resetpass", $fieldsRes);
        $ca->bindValue(":token", $token);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":usuario", $r["email"], true, true);
        $ca->bindValue(":usado", "NO");
        $ca->bindValue(":tipo", "resetpass_app");
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":celular", $celular);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $xa = false;
        $cliente_nws = false;
        $cleanHtml = false;
        $fromName = "Recuperación clave";
        $fromEmail = "info@netwoods.net";
        $paraEmail = $r["email"];
        $paraNombre = $r["nombre"];
        $asunto = "Recuperación de contraseña {$p["app"]}";
        $titleEncBody = "<p>Hola {$r["nombre"]}</p>";
        $textBody = "<p>Hemos recibido una solicitud para cambiar tu contraseña de tu usuario {$p["correo_registrado"]} en {$p["app"]}.</p>";
        $textBody .= "<p>De acuerdo con la solicitud realizada por usted para el cambio de su contraseña, le enviamos el código <strong>{$token}</strong> que debe ingresar en la app {$p["app"]} </p>";
        if ($celular !== null) {
//            $user = "GRUPONW";
//            $pass = "Nw729272";
            $user = nwMaker::getUserSMS();
            $pass = nwMaker::getPassSMS();
            $sm = Array();
            $sm["cel"] = "{$celular}";
            $sm["text"] = "Su codigo de cambio de clave es {$token} en {$p["app"]}";
            $sm["from"] = $user;
            $sm["user"] = $user;
            $sm["pass"] = $pass;
            $sm["url"] = "http://sms.colombiagroup.com.co/Api/rest/message";
            master::sendSMSByCBG($sm);

            $a = Array();
            $a["empresa"] = $empresa;
            $a["perfil"] = $perfil;
            $a["celular"] = $celular;
            $a["tipo"] = "cambio_contrasena";
            $a["description"] = "Cambio de contraseña por SMS, envío de código";
            nwMaker::validaDescargaSaldoSmsByEmpresa($a);

            $textBody .= "<p>El código también fue enviado al número móvil 57{$celular}.</p>";
        }
        $textBody .= "<p>Si ignoras este mensaje, tu contraseña no se cambiará.</p>";
        $send = nw_configuraciones::sendEmail($paraEmail, $paraNombre, $asunto, $titleEncBody, $textBody, false, $datos_empresa);
        if ($send !== true) {
            return $send;
        }
//        nw_configuraciones::sendEmail("orionjafe@gmail.com", "orionjafe@gmail.com", $asunto, $titleEncBody, $textBody, false);
        return true;
    }

    public static function rememberPassNwMaker($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "*", "email=:email");
        $ca->bindValue(":email", $p["correo_registrado"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "noexiste";
        }
        $r = $ca->flush();
        $token = nwMaker::random(100000, 999999);
        $ca->prepareInsert("nwmaker_resetpass", "token,fecha,usuario,usado,tipo");
        $ca->bindValue(":token", $token);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":usuario", $r["email"], true, true);
        $ca->bindValue(":usado", "NO");
        $ca->bindValue(":tipo", "resetpass");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $link = "https://" . $_SERVER["HTTP_HOST"] . "/nwlib6/nwproject/modules/nw_user_session/index.php?nwaccount=nwtrue&recover_pass=true&token={$token}&user={$r["email"]}";
        if (isset($p["linkredirect"])) {
            $link .= "&linkredirect={$p["linkredirect"]}";
        }
        $xa = false;
        $cliente_nws = false;
        $cleanHtml = false;
        $fromName = "Recuperación clave";
        $fromEmail = "info@netwoods.net";
        $paraEmail = $r["email"];
        $paraNombre = $r["nombre"];
        $asunto = "Recuperación de contraseña {$_SERVER["HTTP_HOST"]}";
        $titleEncBody = "<p>Hola {$r["nombre"]}</p>";
        $textBody = "<p>Hemos recibido una solicitud para cambiar tu contraseña de tu usuario {$p["correo_registrado"]} en {$_SERVER["HTTP_HOST"]}.</p>";
        $textBody .= "<p><a href='{$link}' target='_blank'> Cambia la contraseña haciendo clic aquí </a><br /><br /> También puedes copiar y pegar en el navegador el enlace <a href='{$link}' target='_blank'>{$link}</a> </p>";
        $textBody .= "<p>Si ignoras este mensaje, tu contraseña no se cambiará.</p>";
//        nw_configuraciones::sendEmail($paraEmail, $paraNombre, $asunto, $titleEncBody, $textBody, $cliente_nws, $xa, $cleanHtml, $fromName, $fromEmail);
        nw_configuraciones::sendEmail($paraEmail, $paraNombre, $asunto, $titleEncBody, $textBody, false);
        return true;
    }

    public static function wsClientesNw($p) {
        $p = nwMaker::getData($p);
        $send = Array();
        $send["nombre"] = $p["nombre"];
        $send["telefono"] = $p["telefono"];
        $send["correo"] = $p["correo"];
        $send["observaciones"] = $p["observaciones"];
        $send["dominio"] = $p["dominio"];
        $send["url"] = $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
        if (isset($p["allData"])) {
            $send["observaciones"] .= " -----------<br />  TODOS LOS DATOS ENVIADOS: " . $p["allData"];
        }
        if (isset($p["url"])) {
            $send["url"] = $p["url"];
        }
        if (isset($p["tipo"])) {
            $send["tipo"] = $p["tipo"];
        }
        if (isset($p["pathname"])) {
            $send["pathname"] = $p["pathname"];
        }
        if (isset($p["hash"])) {
            $send["hash"] = $p["hash"];
        }
        if (isset($p["search"])) {
            $send["search"] = $p["search"];
        }
        if (isset($p["crm"])) {
            $send["crm"] = $p["crm"];
        }
        if (isset($p["pais"])) {
            $send["pais"] = $p["pais"];
        }
        if (isset($p["pais_text"])) {
            $send["pais_text"] = $p["pais_text"];
        }
        if (isset($p["name_app"])) {
            $send["name_app"] = $p["name_app"];
        }
        if (isset($p["nombre_empresa"])) {
            $send["nombre_empresa"] = $p["nombre_empresa"];
        }
//        print_r($send);
//        return;
//        return self::crearCuentaAPI($send);
        return master::callProductsAPI($send, "wsClientesnw");
    }

    public static function wsClientesNwRDA($p) {
        $p = nwMaker::getData($p);
        $send = Array();
        $send["nombre"] = $p["nombre"];
        $send["telefono"] = $p["telefono"];
        $send["correo"] = $p["correo"];
        $send["observaciones"] = $p["observaciones"];
        $send["dominio"] = $p["dominio"];
        $send["url"] = $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
        if (isset($p["allData"])) {
            $send["observaciones"] .= " -----------<br />  TODOS LOS DATOS ENVIADOS: " . $p["allData"];
        }
        if (isset($p["url"])) {
            $send["url"] = $p["url"];
        }
        if (isset($p["tipo"])) {
            $send["tipo"] = $p["tipo"];
        }
        if (isset($p["pathname"])) {
            $send["pathname"] = $p["pathname"];
        }
        if (isset($p["hash"])) {
            $send["hash"] = $p["hash"];
        }
        if (isset($p["search"])) {
            $send["search"] = $p["search"];
        }
        if (isset($p["crm"])) {
            $send["crm"] = $p["crm"];
        }
        if (isset($p["pais"])) {
            $send["pais"] = $p["pais"];
        }
        if (isset($p["pais_text"])) {
            $send["pais_text"] = $p["pais_text"];
        }
        if (isset($p["name_app"])) {
            $send["name_app"] = $p["name_app"];
        }
        if (isset($p["nombre_empresa"])) {
            $send["nombre_empresa"] = $p["nombre_empresa"];
        }
        return master::callProductsAPI($send, "wsClientesNwRDA");
    }

    public static function sendError($p) {
        error_log($p["error_text"]);
        master::sendReport($p);
    }

    public static function simulateError($p) {
        $p = nwMaker::getData($p);
        $r = $p["error"];
        error_log("Error simulado");
        return NWJSonRpcServer::error("Error simulado");

//        return $r;
//        return nwMaker::error("Error simulado...", true);
    }

    public static function getHorasEntreFechas($dateOne, $dateTwo = "now") {
        $date1 = new DateTime($dateOne);
        $date2 = new DateTime($dateTwo);
        $diff = $date1->diff($date2);
        $fechaDiff = "";
        $fechaDiff .= self::getNumberHour($diff->h);
        $fechaDiff .= self::getNumberHour($diff->i);
        $fechaDiff .= self::getNumberHour($diff->s, true);

        $r = Array();
        $r["hour"] = $fechaDiff;
        $r["h"] = $diff->h;
        $r["i"] = $diff->i;
        $r["s"] = $diff->s;
        return $r;
    }

    public static function getNumberHour($p, $last = false) {
        $fechaDiff = "";
        $points = ":";
        if ($last == true) {
            $points = "";
        }
        if (strlen($p) == 1) {
            $fechaDiff .= "0" . $p . $points;
        } else {
            $fechaDiff .= $p . $points;
        }
        return $fechaDiff;
    }

    public static function changeInsrvLanguaje($p) {
        $p = nwMaker::getData($p);
        $_SESSION['language'] = $p["language"];
        return true;
    }

    public static function getPayAlternatives($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nc_formas_pago", "id, descripcion as nombre", "1=1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function savePrintSkinner($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->setCleanHtml(false);
        $fields = "id,empresa,usuario,terminal,fecha,nombre,html,opcional";
        $id_relation = "";
        if (isset($p["id_relation"])) {
            $id_relation = $p["id_relation"];
            $fields .= ",id_relation";
        }
        $id = master::getNextSequence("nw_print_forms_id_seq", $db);
        $ca->prepareInsert("nw_print_forms", $fields);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":nombre", $p["nombre"], true, true);
        if (isset($p["opcional"])) {
            $ca->bindValue(":opcional", $p["opcional"], true, true);
        } else {
            $ca->bindValue(":opcional", "");
        }
        $ca->bindValue(":id_relation", $id_relation, true, true);
        $ca->bindValue(":html", $p["html"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $id;
    }

    public static function url_origin($s, $use_forwarded_host = false) {
        $ssl = (!empty($s['HTTPS']) && $s['HTTPS'] == 'on' );
        $sp = strtolower($s['SERVER_PROTOCOL']);
        $protocol = substr($sp, 0, strpos($sp, '/')) . ( ( $ssl ) ? 's' : '' );
        $port = $s['SERVER_PORT'];
        $port = ( (!$ssl && $port == '80' ) || ( $ssl && $port == '443' ) ) ? '' : ':' . $port;
        $host = ( $use_forwarded_host && isset($s['HTTP_X_FORWARDED_HOST']) ) ? $s['HTTP_X_FORWARDED_HOST'] : ( isset($s['HTTP_HOST']) ? $s['HTTP_HOST'] : null );
        $host = isset($host) ? $host : $s['SERVER_NAME'] . $port;
        return $protocol . '://' . $host;
    }

    public static function full_url($s, $use_forwarded_host = false) {
        return self::url_origin($s, $use_forwarded_host) . $s['REQUEST_URI'];
    }

    public static function validateIsNwMaker() {
        $c = nwprojectOut::nwpMakerLoginConfig();
        $tipo_login = false;
        if (isset($c["config_login"])) {
            if (isset($c["config_login"]["tipo_login"])) {
                $tipo_login = $c["config_login"]["tipo_login"];
            }
            if (isset($c["config_login"]["tipo_login_app"]) && nwMaker::getDispositivo() !== "pc_desktop") {
                $tipo_login = $c["config_login"]["tipo_login_app"];
            }
        }
        if (isset($c["tipo_login"])) {
            $tipo_login = $c["tipo_login"];
        }
        if (isset($c["tipo_login_app"]) && nwMaker::getDispositivo() !== "pc_desktop") {
            $tipo_login = $c["tipo_login_app"];
        }
        if ($tipo_login === "qxnw") {
            return false;
        }
        return true;
    }

    public static function tableUsersNwMaker($table = false) {
        if (nwMaker::validateIsNwMaker() === true) {
            if ($table != false) {
                return $table;
            }
            return "pv_clientes";
        }
        return "usuarios";
    }

    public static function fieldsUsersNwMaker($field) {
        $isNwmaker = nwMaker::validateIsNwMaker();
        $fields = Array();
        $fields["estado"] = "estado";
        $fields["usuario"] = "usuario";
        $fields["documento"] = "documento";
        $fields["nombre"] = "nombre";
        $fields["apellido"] = "apellido";
        $fields["celular"] = "celular";
        $fields["fecha_nacimiento"] = "fecha_nacimiento";
        $fields["permisos_board"] = "permisos_board";
        $fields["horario_task"] = "horario_task";
        $fields["horario_task_almuerzo"] = "horario_task_almuerzo";
        $fields["correo_gmail"] = "correo_gmail";
        $fields["foto_portada"] = "foto_portada";
        $fields["foto_perfil"] = "foto";
        $fields["foto"] = "foto";
        $fields["pais"] = "pais";
        $fields["ciudad"] = "ciudad";
        $fields["tags"] = "tags";
        $fields["fecha_actualizacion"] = "fecha_actualizacion";
        $fields["departamento"] = "departamento";
        $fields["cargo_actual"] = "cargo_actual";
        $fields["empresa_labora"] = "empresa_labora";
        $fields["descripcion"] = "descripcion";
        $fields["profesion"] = "profesion";
        $fields["usuario_principal"] = "usuario_principal";
        $fields["email"] = "email";
        $fields["clave"] = "clave";
        $fields["last_connection"] = "fecha_ultima_conexion";
        $fields["fecha_ultima_conexion"] = "fecha_ultima_conexion";
        $fields["terminal_asociada"] = "terminal";
        $fields["genero"] = "genero";
        if ($isNwmaker === true) {
            $fields["usuario_cliente"] = "usuario_cliente";
            $fields["foto_perfil"] = "foto_perfil";
            $fields["terminal_asociada"] = "terminal_asociada";
            $fields["user_cliente"] = "user_cliente";
            $fields["nombres_apellidos"] = "nombres_apellidos";
            $fields["last_connection"] = "last_connection";
            $fields["status_connection"] = "status_connection";
            $fields["dispositivo"] = "dispositivo";
            $fields["isGroup"] = "isGroup";
            $fields["usersGroup"] = "usersGroup";
            $fields["idCallGroup"] = "idCallGroup";
            $fields["estado_conexion"] = "estado_conexion";
            $fields["nit"] = "nit";
            $fields["documento"] = "nit";
        } else {
            $fields["usuario_cliente"] = "usuario";
            $fields["foto_perfil"] = "foto";
            $fields["terminal_asociada"] = "terminal";
            $fields["user_cliente"] = "usuario";
            $fields["nombres_apellidos"] = "nombre";
            $fields["last_connection"] = "fecha_ultima_conexion";
            $fields["status_connection"] = "estado_chat";
            $fields["dispositivo"] = "cargo";
            $fields["isGroup"] = "cargo";
            $fields["usersGroup"] = "cargo";
            $fields["idCallGroup"] = "cargo";
            $fields["estado_conexion"] = "estado";
            $fields["nit"] = "documento";
            $fields["usuario_principal"] = "usuario";
        }
        return $fields[$field];
    }

    public static function populateselectTokenField($data) {
        $p = nwMaker::getData($data["data"]);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "1=1 ";
        $campos = "usuario_cliente";
        $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id, " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as nombre", $where);
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function imgThumb($img, $width) {
        $width = str_replace("px", "", $width);
        $img = str_replace("https://" . $_SERVER["HTTP_HOST"] . "", "", $img);
        $ext_file = self::getExtension($img);
        $imagen = self::ruta_phpthumb() . $img . "&w={$width}&f={$ext_file}";
        return $imagen;
    }

    public static function ruta_phpthumb() {
        return "/nwlib6/includes/phpthumb/phpThumb.php?src=";
    }

    public static function updateShowTutorial() {
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $si = session::info();
        $cb->prepareUpdate(nwMaker::tableUsersNwMaker(), "show_tutorial", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $cb->bindValue(":show_tutorial", "SI");
        $cb->bindValue(":usuario", $si["usuario"]);
        if (!$cb->exec()) {
            return nwMaker::error($cb->lastErrorText());
        }
        $_SESSION['show_tutorial'] = "SI";
        return true;
    }

    public static function notificaNotifications($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $si = session::info();
        $where = " id=:id  ";
        $cb->prepareUpdate("nwmaker_notificaciones", "notificado", $where);
        $cb->bindValue(":notificado", "SI");
        $cb->bindValue(":id", $p["id"]);
        $cb->bindValue(":usuario", $si["usuario"]);
        if (!$cb->exec()) {
            return nwMaker::error($cb->lastErrorText());
        }
        return true;
    }

    public static function getHref($html) {
        preg_match_all('/<a[^>]+href=([\'"])(?<href>.+?)\1[^>]*>/i', $html, $result);
        if (!empty($result)) {
            return $result['href'];
        }
        return false;
    }

    public static function extraerURLs($cadena) {
        $regex = '/https?\:\/\/[^\" ]+/i';
        preg_match_all($regex, $cadena, $partes);
        return ($partes[0]);
    }

    public static function getData($data) {
        $p = $data;
        if (isset($data["data"]["data"])) {
            $p = $data["data"]["data"];
        } else if (isset($data["data"])) {
            if (is_string($data["data"])) {
                $p = json_decode($data["data"], true);
            } else {
                $p = $data["data"];
            }
        }
        return $p;
    }

    public static function getNwMakerLibOut() {
        $conf = nwprojectOut::nwpMakerConfig();
        $v = "";
        if (isset($conf["version"])) {
            $v = $conf["version"];
        }
        print nwMaker::includeCssNwMaker($conf["config"], $v);
        print nwMaker::includeJsNwMaker($conf["config"], $v);
        print nwprojectOut::getApiGoogleMaps(false, $conf["config"]);
    }

    public static function getNwMakerLibJs($version = "?v=1", $conf = false) {
        if ($version != "") {
            $version = "?v={$version}";
        }
        $addtohomescreen = "NO";
        if (isset($conf["addtohomescreen"])) {
            $addtohomescreen = $conf["addtohomescreen"];
        }
        $r = "";
        if ($addtohomescreen === "SI" || $addtohomescreen === "true" || $addtohomescreen === true) {
            $r .= "<script type='text/javascript' src='/nwlib6/nwmaker/js/addtohomescreen.js'></script>";
        }
        $loadlist = true;
        if (isset($conf["loadlist"])) {
            $loadlist = false;
        }
        $loadform = true;
        if (isset($conf["loadform"])) {
            $loadform = false;
        }
        $loadnwmakerall = true;
        if (isset($conf["getcompressringow"])) {
            $loadnwmakerall = false;
        }
        $ringow_openform = false;
        if (isset($conf["ringow_openform"])) {
            if ($conf["ringow_openform"] === true || $conf["ringow_openform"] === "true") {
                $ringow_openform = true;
            }
        }
        $nwrtc = false;
        if (isset($conf["nwrtc"])) {
            if ($conf["nwrtc"] === true || $conf["nwrtc"] === "true") {
                $nwrtc = true;
            }
        }
//        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-3.3.1.min.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-latest.js'></script>";
        if ($loadnwmakerall) {
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.mask.js'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
            $r .= "<script type='application/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        }
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js{$version}'></script>";
        if ($loadnwmakerall) {
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/lists/l_usuarios_conected.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/lists/l_usuarios.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/forms/f_usuarios.js{$version}'></script>";
        }
        if ($loadlist) {
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/lists.js{$version}'></script>";
        }
        if ($loadform) {
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/forms.js{$version}'></script>";
        }
        if ($loadnwmakerall) {
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/nwmaker.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwmaker/config_nwmaker.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-home.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/myProfile.js{$version}'></script>";
        }
        if ($ringow_openform) {
            $r .= "<script type='text/javascript' src='/app/nwchat/openForm/js/l_secciones.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/app/nwchat/openForm/js/l_secciones_version2.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/app/nwchat/openForm/js/openForm.js{$version}'></script>";
        }
        if ($nwrtc) {
            $r .= "<script async='async' type='text/javascript' src='/nwlib6/nwproject/modules/webrtc/testing/two/js/utils.js{$version}'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/webrtc/testing/two/js/simplewebrtc.bundle.js{$version}'></script>";
            $r .= "<script async='async' type='text/javascript' src='/nwlib6/nwproject/modules/webrtc/testing/two/js/main.js{$version}'></script>";
        }
        return $r;
    }

    public static function getNwMakerLibJsCompress($version = "?v=1", $conf = false, $getcompressringow = "") {
        $v = "v=1";
        if ($version != "") {
            $v = "v={$version}";
        }
        $addtohomescreen = "NO";
        if (isset($conf["addtohomescreen"])) {
            $addtohomescreen = $conf["addtohomescreen"];
        }
        if (isset($conf["getcompressringow"])) {
            $getcompressringow = "&getcompressringow=true";
        }
        $ringow_openform = "";
        if (isset($conf["ringow_openform"])) {
            if ($conf["ringow_openform"] === true || $conf["ringow_openform"] === "true") {
                $ringow_openform = "&ringow_openform=true";
            }
        }
        $nwrtc = "";
        if (isset($conf["nwrtc"])) {
            if ($conf["nwrtc"] === true || $conf["nwrtc"] === "true") {
                $nwrtc = "&nwrtc=true";
            }
        }
        $loadlist = "";
        if (isset($conf["loadlist"])) {
            $loadlist = "&loadlist=false";
        }
        $loadform = "";
        if (isset($conf["loadform"])) {
            $loadform = "&loadform=false";
        }
        $get = "?";
        $get .= $v;
        $get .= "&addtohomescreen={$addtohomescreen}";
        $get .= $getcompressringow;
        $get .= $ringow_openform;
        $get .= $nwrtc;
        $get .= $loadlist;
        $get .= $loadform;
        $r = "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/nwmaker_jsmaker.php{$get}'></script>";
//        $r = "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/test.js'></script>";
        return $r;
    }

    public static function includeJsNwMaker($conf = false, $version = "") {
        if (isset($conf["workLocal"])) {
            if ($conf["workLocal"] === true || $conf["workLocal"] === "true" || $conf["workLocal"] === "SI") {
                if (isset($_SESSION["nwproject_website"])) {
                    return self::getNwMakerLibJsCompress($version, $conf);
                } else {
                    return self::getNwMakerLibJs($version, $conf);
                }
            } else {
                return self::getNwMakerLibJsCompress($version, $conf);
            }
        } else {
            return self::getNwMakerLibJs($version, $conf);
        }
    }

    public static function loadCssMakerCompress($version = "?v=1", $conf = false) {
        if ($version != "") {
            $version = "?v={$version}";
        }
        $addtohomescreen = "NO";
        if (isset($conf["addtohomescreen"])) {
            $addtohomescreen = $conf["addtohomescreen"];
        }
        $getcompressringow = "";
        if (isset($conf["getcompressringow"])) {
            $getcompressringow = "&getcompressringow=true";
        }
        $inlogin = "";
        if (isset($conf["inlogin"])) {
            if ($conf["inlogin"] === true || $conf["inlogin"] === "true") {
                $inlogin = "&inlogin=true";
            }
        }
        $loadcenter = "";
        if (isset($conf["loadcenter"])) {
            if ($conf["loadcenter"] === false || $conf["loadcenter"] === "false") {
                $loadcenter = "&loadcenter=false";
            }
        }
        $datepicker = "";
        if (isset($conf["datepicker"])) {
            $datepicker = "&datepicker=false";
        }
        $nwdialog = "&nwdialog=true";
        if (isset($conf["nwdialog"])) {
            if ($conf["nwdialog"] === false || $conf["nwdialog"] === "false") {
                $lists = "&nwdialog=false";
            }
        }
        $lists = "";
        if (isset($conf["lists"])) {
            if ($conf["lists"] === false || $conf["lists"] === "false") {
                $lists = "&lists=false";
            }
        }
        $nwrtc = "";
        if (isset($conf["nwrtc"])) {
            if ($conf["nwrtc"] === true || $conf["nwrtc"] === "true") {
                $nwrtc = "&nwrtc=true";
            }
        }
        $nwrtc_chat = "";
        if (isset($conf["nwrtc_chat"])) {
            if ($conf["nwrtc_chat"] === true || $conf["nwrtc_chat"] === "true") {
                $nwrtc_chat = "&nwrtc_chat=true";
            }
        }
        $ringow_openform = "";
        if (isset($conf["ringow_openform"])) {
            if ($conf["ringow_openform"] === true || $conf["ringow_openform"] === "true") {
                $ringow_openform = "&ringow_openform=true";
            }
        }
        $menu_para_qxnw = "";
        if (isset($conf["menu_para_qxnw"])) {
            if ($conf["menu_para_qxnw"] == "SI") {
                $menu_para_qxnw = "&menu_para_qxnw=SI";
            }
        }
        $url_css_principal_login = "";
        if (isset($conf["url_css_principal_login"])) {
            if ($conf["url_css_principal_login"] != null && $conf["url_css_principal_login"] != false && $conf["url_css_principal_login"] != "") {
                $url_css_principal_login = "&url_css_principal_login=" . $conf["url_css_principal_login"];
            }
        }
        $get = $version;
        $get .= $menu_para_qxnw;
        $get .= $ringow_openform;
        $get .= $nwrtc;
        $get .= $nwrtc_chat;
        $get .= $lists;
        $get .= $loadcenter;
        $get .= $nwdialog;
        $get .= $datepicker;
        $get .= $inlogin;
        $get .= $getcompressringow;
        $get .= $url_css_principal_login;
        $get .= "&addtohomescreen={$addtohomescreen}";
        $get .= "&menu_movil_en_pc={$conf["menu_movil_en_pc"]}";
        $get .= "&alto_barra_enc=" . str_replace("px", "", $conf["alto_barra_enc"]);
        $get .= "&fondo_barra_enc=" . str_replace("#", "", $conf["fondo_barra_enc"]);
        $get .= "&ancho_menu_left=" . str_replace("px", "", $conf["ancho_menu_left"]);
        $get .= "&lateral_left_alto_completo={$conf["lateral_left_alto_completo"]}";
        if (isset($conf["fondo_menu"]))
            $get .= "&fondo_menu=" . str_replace("#", "", $conf["fondo_menu"]);
        $get .= "&backgroundPage=" . str_replace("#", "", $conf["backgroundPage"]);
        if (isset($conf["color_links_menu"]))
            $get .= "&color_links_menu=" . str_replace("#", "", $conf["color_links_menu"]);
        $get .= "&permitir_chat={$conf["permitir_chat"]}";
        $get .= "&mostrar_chat_al_inicio={$conf["mostrar_chat_al_inicio"]}";
        if (isset($conf["url_css_principal"])) {
            if ($conf["url_css_principal"] != null && $conf["url_css_principal"] != false && $conf["url_css_principal"] != "") {
                $get .= "&url_css_principal={$conf["url_css_principal"]}";
            }
        }
        return "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/nwmaker_css.php{$get}' />";
    }

    public static function isMobile() {
        if (!isset($_SERVER['HTTP_USER_AGENT'])) {
            return false;
        }
        $useragent = $_SERVER['HTTP_USER_AGENT'];
        if (preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i', $useragent) || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i', substr($useragent, 0, 4))) {
            return true;
        }
        return false;
    }

    public static function loadCssMaker($version = "", $conf = false) {
        $ismobile = self::isMobile();
        if ($version != "") {
            $version = "?v={$version}";
        }
        $addtohomescreen = "NO";
        if (isset($conf["addtohomescreen"])) {
            $addtohomescreen = $conf["addtohomescreen"];
        }
        $menu_movil_en_pc = "SI";
        if (isset($conf["menu_movil_en_pc"])) {
            $menu_movil_en_pc = $conf["menu_movil_en_pc"];
        }
        $loadnwmakerall = true;
        if (isset($conf["getcompressringow"])) {
            $loadnwmakerall = false;
        }
        $loadmakercenter = true;
        $inlogin = false;
        if (isset($conf["inlogin"])) {
            if ($conf["inlogin"] === true || $conf["inlogin"] === "true") {
                $inlogin = true;
            }
        }
        if (isset($conf["loadcenter"])) {
            if ($conf["loadcenter"] === false || $conf["loadcenter"] === "false") {
                $loadmakercenter = false;
                $loadnwmakerall = false;
            }
        }
        $datepicker = true;
        if (isset($conf["datepicker"])) {
            $datepicker = false;
        }
        $nwdialog = true;
        if (isset($conf["nwdialog"])) {
            if ($conf["nwdialog"] === false || $conf["nwdialog"] === "false") {
                $nwdialog = false;
            }
        }
        $lists = true;
        if (isset($conf["lists"])) {
            if ($conf["lists"] === false || $conf["lists"] === "false") {
                $lists = false;
            }
        }
        $nwrtc = false;
        if (isset($conf["nwrtc"])) {
            if ($conf["nwrtc"] === true || $conf["nwrtc"] === "true") {
                $nwrtc = true;
            }
        }
        $nwrtc_chat = false;
        if (isset($conf["nwrtc_chat"])) {
            if ($conf["nwrtc_chat"] === true || $conf["nwrtc_chat"] === "true") {
                $nwrtc_chat = true;
            }
        }
        $ringow_openform = false;
        if (isset($conf["ringow_openform"])) {
            if ($conf["ringow_openform"] === true || $conf["ringow_openform"] === "true") {
                $ringow_openform = true;
            }
        }
        $menu_para_qxnw = false;
        if (isset($conf["menu_para_qxnw"])) {
            if ($conf["menu_para_qxnw"] == "SI") {
                $menu_para_qxnw = true;
            }
        }
        $r = "";
        //css dashboard qxnw
        if ($menu_para_qxnw)
            $r .= "<link rel='stylesheet' href='/nwlib6/dashboard/css/style.css{$version}' />";
        //nwrtc
        if ($ringow_openform) {
            $r .= "<link rel='stylesheet' href='/app/nwchat/openForm/css/openForm.css{$version}' />";
        }
        if ($nwrtc)
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/webrtc/testing/two/css/main.css{$version}' />";
        //nwrtc solo chat
        if ($nwrtc_chat) {
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/webrtc/testing/two/css/chat.css{$version}' />";
        }
        //forms
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/style.css{$version}' />";
        if ($nwdialog)
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/nwdialog.css{$version}' />";
        if ($datepicker)
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css'>";
        if ($inlogin) {
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/login_createaccount.css{$version}' />";
            if (isset($conf["url_css_principal_login"])) {
                if ($conf["url_css_principal_login"] != null && $conf["url_css_principal_login"] != false && $conf["url_css_principal_login"] != "") {
                    $r .= "<link id='url_css_principal_login_nwmaker' rel='stylesheet' href='{$conf["url_css_principal_login"]}{$version}' />";
                }
            }
        }
        if ($lists)
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/lists.css{$version}' />";
        //nwmaker
        if ($loadmakercenter) {
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/styleOut.css{$version}' />";
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/home.css{$version}' />";
            $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/media.css{$version}' />";
        }
        if ($loadnwmakerall) {
//            if ($menu_movil_en_pc === "SI" || $menu_movil_en_pc === "true" || $menu_movil_en_pc === true) {
//                if (!$ismobile) {
//                    $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/menupcnormal.css{$version}' />";
//                }
//            }
            $r .= "<div class='styleCssApplyConfig'><style>";
            $ra = Array();
            $ra["file"] = "/nwlib6/nwproject/modules/nw_user_session/nwmaker_css_applyconfig.php";
            $ra["params"] = $conf;
            $r .= nwMaker::loadInclude($ra);
            $r .= "</style></div>";

            if ($addtohomescreen === "SI" || $addtohomescreen === "true" || $addtohomescreen === true) {
                $r .= "<link rel='stylesheet' href='/nwlib6/nwmaker/css/addtohomescreen.css{$version}' />";
            }
            if (isset($conf["url_css_principal"])) {
                if ($conf["url_css_principal"] != null && $conf["url_css_principal"] != false && $conf["url_css_principal"] != "") {
                    $r .= "<link id='url_css_principal_nwmaker' rel='stylesheet' href='{$conf["url_css_principal"]}{$version}' />";
                }
            }
        }
        return $r;
    }

    public static function includeCssNwMaker($conf, $version = "?v=1") {
        if (isset($conf["workLocal"])) {
            if ($conf["workLocal"] === true || $conf["workLocal"] === "true") {
                return self::loadCssMaker($version, $conf);
            } else {
                return self::loadCssMakerCompress($version, $conf);
            }
        } else {
            return self::loadCssMaker($version, $conf);
        }
    }

    public static function crearGrupoChat($data) {
        $p = $data["data"];
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id = master::getNextSequence(nwMaker::tableUsersNwMaker("pv_clientes") . "_id_seq", $db);
        $room = "userchat_{$id}_1_123144";
        $ca->prepareInsert(nwMaker::tableUsersNwMaker("pv_clientes"), "id,nombre,apellido,terminal,empresa,estado,fecha_ultima_conexion,tipo_creacion," . nwMaker::fieldsUsersNwMaker("usuario_cliente"));
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $p["nombres_apellidos"]);
        $ca->bindValue(":apellido", " (Grupo)");
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":estado", "activo");
        $ca->bindValue(":tipo_creacion", "grupo");
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("usuario_cliente"), $id);
        $ca->bindValue(":fecha_ultima_conexion", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $id_vis = master::getNextSequence("sop_visitantes_id_seq", $db);
        $ca->prepareInsert("sop_visitantes", "id,nombre,tipo,terminal,userscallintern,userscallintern_d,room_v2");
        $ca->bindValue(":id", $id_vis);
        $ca->bindValue(":nombre", $p["nombres_apellidos"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":tipo", "CHAT_INTERNO");
        $ca->bindValue(":userscallintern", $id);
        $ca->bindValue(":userscallintern_d", $si["usuario"]);
        $ca->bindValue(":room_v2", $room);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        if (isset($p["usersGroup_array"])) {
            $td = count($p["usersGroup_array"]);
            if ($td > 0) {
                $name = $si["nombre"];
                if (isset($si["apellido"])) {
                    $name .= " " . $si["apellido"];
                }
                for ($x = 0; $x < $td; $x++) {
                    $det = $p["usersGroup_array"][$x]["value"];

                    $id_vis = master::getNextSequence("sop_visitantes_id_seq", $db);
                    $ca->prepareInsert("sop_visitantes", "id,nombre,tipo,terminal,userscallintern,userscallintern_d,room_v2");
                    $ca->bindValue(":id", $id_vis);
                    $ca->bindValue(":nombre", $p["nombres_apellidos"]);
                    $ca->bindValue(":terminal", $si["terminal"]);
                    $ca->bindValue(":tipo", "CHAT_INTERNO");
                    $ca->bindValue(":userscallintern", $id);
                    $ca->bindValue(":userscallintern_d", $det);
                    $ca->bindValue(":room_v2", $room);
                    if (!$ca->exec()) {
                        return nwMaker::error($ca->lastErrorText());
                    }

                    $a = Array();
                    $a["destinatario"] = $det;
                    $a["body"] = "{$name} te ha agregado al grupo de chat {$p["nombres_apellidos"]}";
                    $a["tipo"] = "mini";
                    $a["link"] = null;
                    $a["modo_window"] = "popup";
                    $a["tipoAviso"] = "alert";
                    $a["sendEmail"] = true;
                    $a["id_objetivo"] = $id;
                    $a["titleMensaje"] = "Te han agregado a un grupo de chat {$p["nombres_apellidos"]}";
                    $a["foto"] = null;
                    $a["usuario_envia"] = $si["usuario"];
                    $a["callback"] = "windowNwChat('{$room}', '{$det}', '{$id}', '', '', '', 'body', '&is_group=true')";
                    $n = nwMaker::notificacionNwMaker($a);
                    if ($n !== true) {
                        return $n;
                    }
                }
            }
        }
        return $room;
    }

    public static function agregarParticipanteGrupoChat($data) {
        $p = nwMaker::getData($data);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id = $p["id"];
        $room = $p["room_v2"];
        if (isset($p["usersGroup_array"])) {
            $td = count($p["usersGroup_array"]);
            if ($td > 0) {
                $name = $si["nombre"];
                if (isset($si["apellido"])) {
                    $name .= " " . $si["apellido"];
                }
                for ($x = 0; $x < $td; $x++) {
                    $det = $p["usersGroup_array"][$x]["value"];

                    $id_vis = master::getNextSequence("sop_visitantes_id_seq", $db);
                    $ca->prepareInsert("sop_visitantes", "id,nombre,tipo,terminal,userscallintern,userscallintern_d,room_v2");
                    $ca->bindValue(":id", $id_vis);
                    $ca->bindValue(":nombre", $p["nombre_apellido"]);
                    $ca->bindValue(":terminal", $si["terminal"]);
                    $ca->bindValue(":tipo", "CHAT_INTERNO");
                    $ca->bindValue(":userscallintern", $id);
                    $ca->bindValue(":userscallintern_d", $det);
                    $ca->bindValue(":room_v2", $room);
                    if (!$ca->exec()) {
                        return nwMaker::error($ca->lastErrorText());
                    }

                    $a = Array();
                    $a["destinatario"] = $det;
                    $a["body"] = "{$name} te ha agregado al grupo de chat {$p["nombre_apellido"]}";
                    $a["tipo"] = "mini";
                    $a["link"] = null;
                    $a["modo_window"] = "popup";
                    $a["tipoAviso"] = "alert";
                    $a["sendEmail"] = true;
                    $a["id_objetivo"] = $id;
                    $a["titleMensaje"] = "Te han agregado a un grupo de chat {$p["nombre_apellido"]}";
                    $a["foto"] = null;
                    $a["usuario_envia"] = $si["usuario"];
                    $a["callback"] = "windowNwChat('{$room}', '{$det}', '{$id}', '', '', '', 'body', '&is_group=true')";
                    $n = nwMaker::notificacionNwMaker($a);
                    if ($n !== true) {
                        return $n;
                    }
                }
            }
        }
        return true;
    }

    public static function consultaUsuariosTerminalTextExcludeGrupo($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usersNOt = "";
        $ca->prepareSelect("sop_visitantes", "userscallintern_d", "room_v2=:room_v2");
        $ca->bindValue(":room_v2", $p["room_v2"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $t = $ca->size();
        if ($t > 0) {
            for ($i = 0; $i < $t; $i++) {
                $c = $ca->flush();
                $usersNOt .= " and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "!='{$c["userscallintern_d"]}' ";
            }
        }

        $where = "terminal=:terminal and estado='activo' and apellido!=' (Grupo)'";
//        $where .= " and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "!=:usuario";
        $where .= $usersNOt;
        $fields = "" . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as id,CONCAT(nombre, ' ', apellido) as nombre";
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), $fields, $where . " order by nombre asc");
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaUsuariosTerminalText($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "terminal=:terminal and estado='activo' and tipo_creacion is null ";
        if (!isset($p["allusers"])) {
            $where .= " and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "!=:usuario";
        }
        $fields = "" . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as id,CONCAT(nombre, ' ', apellido) as nombre";
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), $fields, $where . " order by nombre asc");
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaUsuariosTerminal($data) {
        $p = $data;
        if (isset($data["data"]["data"])) {
            $p = $data["data"]["data"];
        }
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "terminal=:terminal and estado='activo' ";
        if (!isset($p["allusers"])) {
            $where .= " and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "!=:usuario";
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id,CONCAT(nombre, ' ', apellido) as nombre", $where . " order by nombre asc");
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaPerfiles($data) {
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $perfil = "";
        if (isset($si["profile"])) {
            $perfil = $si["profile"];
        }
        if (isset($si["perfil"])) {
            $perfil = $si["perfil"];
        }
        $tables = "nwmaker_perfiles a left join nwmaker_perfiles_autorizados b ON (a.id=b.perfil_principal) ";
        $fields = "b.perfil_autorizado as id, (select nombre from nwmaker_perfiles where id=b.perfil_autorizado ) as nombre ";
        $where = "1=1";
        $where .= " and b.perfil_principal=:perfil  ";
        $where .= " order by a.nombre asc";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function saveSalasByUser($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (isset($p["detalle"])) {
            $t = count($p["detalle"]);
            if ($t > 0) {
                $ca->prepareDelete("sop_secciones_usuarios", "terminal=:terminal and usuario=:usuario");
                $ca->bindValue(":terminal", $si["terminal"]);
                $ca->bindValue(":usuario", $p["usuario_cliente"]);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
                for ($i = 0; $i < $t; $i++) {
                    $r = $p["detalle"][$i];
                    if (isset($r["seccion"])) {
                        $txt = explode("/", $r["seccion_text"]);
                        if (isset($txt[1])) {
                            $r["seccion_text"] = $txt[1];
                        } else {
                            $r["seccion_text"] = $txt[0];
                        }
                        $ca->prepareInsert("sop_secciones_usuarios", "seccion,usuario,terminal,seccion_text,pertenece");
                        $ca->bindValue(":terminal", $si["terminal"]);
                        $ca->bindValue(":usuario", $p["usuario_cliente"]);
                        $ca->bindValue(":pertenece", $r["id"]);
                        $ca->bindValue(":seccion", $r["seccion"]);
                        $ca->bindValue(":seccion_text", $r["seccion_text"]);
                        $ca->bindValue(":pertenece", $r["seccion"]);
                        if (!$ca->exec()) {
                            return nwMaker::error($ca->lastErrorText());
                        }
                    }
                }
            }
        }
        return true;
    }

    public static function consultaSalasByUser($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("sop_secciones_usuarios a left join sop_secciones b ON(a.pertenece=b.id)", "a.*,b.tiempo_minimo_duracion_cita,b.id_filtro_padre,if (b.id_filtro_padre is null, b.nombre, CONCAT((select nombre from sop_secciones where id=b.id_filtro_padre), ' / ',a.seccion_text))as seccion_text", "a.terminal=:terminal and a.usuario=:usuario");
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaSalas() {
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("sop_secciones a", "a.*,a.nombre as nombredos,CONCAT((select nombre from sop_secciones where id=a.id_filtro_padre), ' / ',a.nombre) as nombre", "a.terminal=:terminal");
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        $servi = $ca->assocAll();
        for ($index = 0; $index < count($servi); $index++) {
            $se = $servi[$index];
            if ($se["nombre"] == null && isset($se["nombredos"]) && $se["nombredos"]) {
                $servi[$index]["nombre"] = $se["nombredos"];
            }
        }
        return $servi;
    }

    public static function consultaProfesiones() {
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_login_profesiones", "*", "terminal=:terminal");
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaPaises() {
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("paises", "*", "1=1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function protocoloHTTPS() {
        $http = "http";
        $https = "https";
        $protocolo = $http;
        if (isset($_SERVER["HTTPS"])) {
            if ($_SERVER["HTTPS"] == "on") {
                $protocolo = $https;
            } else {
                $protocolo = $http;
            }
        }
        return $protocolo;
    }

    public static function saca_dominio($url) {
        $protocolos = array('http://', 'https://', 'ftp://', 'www.');
        $url = explode('/', str_replace($protocolos, '', $url));
        return $url[0];
    }

    public static function loadFilesCompress($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $t = count($p["files"]);
        $r = "";
        if ($t > 0) {
            for ($i = 0; $i < $t; $i++) {
                $d = $p["files"][$i];
                $h = Array();
                $h["ruta"] = $d["ruta"];
                $h["file"] = $d["file"];
                $h["ContentType"] = "js";
                $h["local"] = true;
                $h["show"] = false;
                $r .= nwMaker::compressMainAll($h);
            }
        }
        return $r;
    }

    public static function compressMainAll($p) {
        $ruta = "/nwlib6/nwproject/js/";
        //DEFINO VARIABLES PARA CREAR FILE COMPRESS
        if (isset($p["ruta"]))
            $ruta_file = $p["ruta"];
        else
            $ruta_file = $ruta;

        if (isset($p["file"]))
            $fileName = $p["file"];
        else
            $fileName = "main.js";
        $ruteType = "js/";
        if (isset($p["ContentType"])) {
            if ($p["ContentType"] == "css") {
                $newNameCompress = "Compress.css";
                $ruteType = "css/";
            } else {
                $newNameCompress = "Compress.js";
                $ruteType = "js/";
            }
        } else {
            $newNameCompress = "Compress.js";
            $ruteType = "js/";
        }
        $nameFinalFileCompress = $ruteType . str_replace("/", "_", $ruta_file) . $fileName . "-" . $newNameCompress;
        //REVISO SI ES LOCAL-DESARROLLO O ES PRODUCCIÓN ONLINE
        //SI ES DESARROLLO HAGO QUE CREE EL ARCHIVO NUEVO - LUEGO MUESTRO EL COMPRESS SIEMPRE
        $local = false;
        if ($_SERVER["HTTP_HOST"] == "www.nwp5.loc" || $_SERVER["HTTP_HOST"] == "nwp5.loc" || isset($p["local"])) {
            $local = true;
        }
        if ($local) {
            $archivo_script_js = $ruta_file . $fileName;
            include_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib6/includes/jsmin-php/jsmin-php.php";
            $codigo_comprimido = JSMin::minify(file_get_contents($_SERVER["DOCUMENT_ROOT"] . $archivo_script_js));
            $archivo = fopen($_SERVER["DOCUMENT_ROOT"] . "/compressFiles/{$nameFinalFileCompress}", "w+");
            fwrite($archivo, $codigo_comprimido);
            fclose($archivo);
            //EN PRUEBAS...  
//        createLocalComp($nameFinalFileCompress, $codigo_comprimido); 
        }
        //COMPRUEBO EL TIPO DE ARCHIVO CSS O JS
        $show = true;
        if (isset($p["show"])) {
            if ($p["show"] === false) {
                $show = false;
            }
        }
        if ($show === true) {
            if (isset($p["ContentType"]))
                if ($p["ContentType"] == "css")
                    header("Content-type: text/css");
                else
                    header('Content-Type: application/javascript');
            else
                header('Content-Type: application/javascript');
//    print_r($nameFinalFileCompress);
            include_once $_SERVER["DOCUMENT_ROOT"] . "/compressFiles/" . "{$nameFinalFileCompress}";
        }
        return $nameFinalFileCompress;
    }

    public static function createLocalComp($nameFinalFileCompress, $codigo_comprimido) {
        //TRAIGO LA RUTA LOCAL POR EL INCLUDE Y TRAIGO VARIABLE $pathComp QUE ES POR DEFECTO: /home/alexf/workspace_web/nwproject5/
        include_once $_SERVER["DOCUMENT_ROOT"] . "/pathComp.php";
        $archivo1 = fopen("{$pathComp}compressFiles/{$nameFinalFileCompress}", "w+");
        fwrite($archivo1, $codigo_comprimido);
        fclose($archivo1);
        return true;
    }

    public static function consultaPerfilUserNwTwo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fields = "a.*,CONCAT(a.nombre, ' ', a.apellido) as nombre_apellido,b.nombre as pais_text,a." . nwMaker::fieldsUsersNwMaker("foto_perfil") . " as foto_perfil,a." . nwMaker::fieldsUsersNwMaker("nit") . " as documento";
        $ca->prepareSelect(nwMaker::tableUsersNwMaker() . " a left join paises b ON(a.pais=b.id)", $fields, "a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and a.estado='activo'");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function consultaPerfilUserNw($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fields = "a.*";
        $ca->prepareSelect(nwMaker::tableUsersNwMaker() . " a", $fields, "a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and a.estado='activo'");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        $us = $ca->flush();
        $ca->prepareSelect("nwmaker_puntaje_historico", "calificacion", "usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $us["calificaciones"] = $ca->assocAll();
        } else {
            $us["calificaciones"] = 0;
        }
        return $us;
    }

    public static function checkWebSite($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        set_time_limit(0);
        $url = htmlentities($p["url"]);
        if (isset($url) && ($url != "")) {
            $online = @fsockopen($url, 80);
            if ($online) {
                return "online";
            } else {
                return "offline";
            }
        }
    }

    public static function cleanArray($array) {
        if (count($array) == "0") {
            return;
        }
//        return array_walk($array, self::limpiarCadenaN($array));
        $input_arr = array();
        foreach ($array as $key => $input_arr) {
//            $array[$key] = addslashes(self::limpiarCadenaN($input_arr));
//            if ($array[$key] != "update") {
            $array[$key] = self::limpiarCadenaN($input_arr);
//            $array[$key] = master::clean($input_arr);
//            }
        }
        return $array;
    }

    public static function limpiarCadenaN($valor) {

        $toTest = Array();

        if (is_string($valor)) {
            $toTest[] = $valor;
        } else {
            $v = null;
            foreach ($toTest as $key => $value) {
                $v = str_ireplace("COPY", "", $value);
                $v = str_ireplace("DELETE", "", $v);
                $v = str_ireplace("DROP", "", $v);
                $v = str_ireplace("DUMP", "", $v);
                $v = str_ireplace(" OR ", "", $v);
                $v = str_ireplace("LIKE", "", $v);
            }
            return $v;
        }

        for ($i = 0; $i < count($toTest); $i++) {

            $v = $toTest[$i];

//        $valor = str_ireplace("UPDATE", "", $valor);
//        $valor = str_ireplace("SELECT", "", $valor);
            $v = str_ireplace("COPY", "", $valor);
            $v = str_ireplace("DELETE", "", $valor);
            $v = str_ireplace("DROP", "", $valor);
            $v = str_ireplace("DUMP", "", $valor);
            $v = str_ireplace(" OR ", "", $valor);
//        $valor = str_ireplace("%", "", $valor);
            $v = str_ireplace("LIKE", "", $valor);
//        $valor = str_ireplace("--", "", $valor);
//        $valor = str_ireplace("^", "", $valor);
//        $valor = str_ireplace("[", "", $valor);
//        $valor = str_ireplace("]", "", $valor);
//    $valor = str_ireplace("\", "", $valor);
//        $valor = str_ireplace("!", "", $valor);
//        $valor = str_ireplace("¡", "", $valor);
//        $valor = str_ireplace("?", "", $valor);
//        $valor = str_ireplace("=", "", $valor);
//        $valor = str_ireplace("&", "", $valor);
        }

        return $valor;
    }

    public static function saveSuscriptorPush($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $fields = "usuario,json,fecha";
        $ca->prepareInsert("nwmaker_suscriptorsPush", $fields);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":usuario", $si['usuario']);
        $ca->bindValue(":json", $p['json']);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function saveCreditCardPayment($p) {
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
        if ($status === true) {
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
            $token_id = $p["token_id"];
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
        $ca->prepareInsert("nwmaker_tarjetascredito_pagos", "id_tarjeta,correo,valor,fecha");
        $ca->bindValue(":id_tarjeta", $id_card);
        $ca->bindValue(":correo", $p['email']);
        $ca->bindValue(":valor", $p["valor"]);
        $ca->bindValue(":fecha", $fecha);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function NwPayEpayco($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $pay = new NWPayEpayco();
        $d = Array();
        if (isset($p["apiKeyEpayco"]) && isset($p["privateKeyEpayco"])) {
            $d["apiKey"] = $p["apiKeyEpayco"];
            $d["privateKey"] = $p["privateKeyEpayco"];
        } else {
            //grupo nw
//        $d["apiKey"] = "f3566b13f1e134574b53e67121b5a588";
//        $d["privateKey"] = "88f87ecd01d826fec3310ad6be8e2ae7";
            //netcar
            $d["apiKey"] = "ca651922534b50a5fadce54750cb4648";
            $d["privateKey"] = "3d5e8da93b9dcf5a7042f7202df3a251";
        }

        $d["lenguage"] = "ES";
        $d["test"] = true;
        if (isset($p["test"])) {
            if ($p["test"] === "false" || $p["test"] === false || $p["test"] == "NO") {
                $d["test"] = 0;
            }
            if ($p["test"] === "true" || $p["test"] === true || $p["test"] === "SI") {
                $d["test"] = true;
            }
        }
//        $d["test"] = true;
        $pay->construct($d);
//        return $pay->test();

        $rta = "";
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $perfil = nwMaker::getDataSESSION($p, "perfil");
        $token_card = null;
        $customer_id = null;
        $nombre_tarjeta = null;
        $apellido_tarjeta = null;
        $email = null;
        $doc_type = null;
        $doc_number = null;
        $currency = null;
        $codigo_seguridad = "";
        $id_relational_pay = null;
        if (isset($p["id_relational_pay"])) {
            $id_relational_pay = $p["id_relational_pay"];
        } else {
            $id_relational_pay = nwMaker::random(100000, 999999);
        }
//$array = $pay->getCustomer("AMaoqSMrBYJNx8d2s");
        if (isset($p["id_tarjeta"]) && $p["id_tarjeta"] !== null && $p["id_tarjeta"] !== "undefined" && $p["id_tarjeta"] !== "") {
            $ca->prepareSelect("nwmaker_tarjetascredito", "*", "id=:id");
            $ca->bindValue(":id", $p['id_tarjeta']);
            if (!$ca->exec()) {

                $a = Array();
                $a["error_text"] = $ca->lastErrorText();
                $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//                nwMaker::sendError($a);

                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() === 0) {
                return "La tarjeta seleccionada no existe.";
            }
            $c = $ca->flush();
            $id_card = $c["id"];
            $nombre_tarjeta = $c["nombre_tarjeta"];
            $apellido_tarjeta = $c["apellido"];
            $email = $c["email"];
            $doc_type = $c["tipo_doc"];
            $doc_number = $c["documento"];
            $currency = $c["currency"];
            $cuotas = $c["cuotas"];
            $token_card = $c["token_card"];
            $customer_id = $c["customer_id"];
        } else {
            $nombre_tarjeta = $p["nombre_tarjeta"];
            $apellido_tarjeta = $p["apellido_tarjeta"];
            $email = $p["email"];
            $doc_type = $p["tipo_documento"];
            $doc_number = $p["documento"];
            $currency = $p["currency"];
            $cuotas = $p["cuotas"];
            $codigo_seguridad = $p["codigo_seguridad"];

            $a = Array();
            $a["name"] = $nombre_tarjeta;
            $a["last_name"] = $apellido_tarjeta;
            $a["email"] = $email;
            $a["card_number"] = $p["numero_tarjeta"];
            $a["card_exp_year"] = $p["anio_vencimiento"];
            $a["card_exp_month"] = $p["mes_vencimiento"];
            $a["card_cvc"] = $codigo_seguridad;
            $a["country"] = $p["pais"];
//            $a["city"] = false;
//            $a["address"] = false;
//            $a["phone"] = false;
//            $a["cell_phone"] = false;
            $cus = $pay->registerCustomerCreditAndCard($a);
            if ($cus["status"] !== "OK") {
                $rta = "";
                $rta .= $cus["status"];
                $rta .= "<br />";
                $rta .= $cus["message"];
                $rta .= "<br />";
                $rta .= $cus["message_description"];
                $rta .= "<br />";
                $rta .= $cus["errors"];

                $d = json_encode($cus);
                $rta .= "<br />ALL_DATA: ------>" . strip_tags($d) . " <------- END_ALL_DATA ----->";

                $a = Array();
                $a["error_text"] = $rta;
                $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//                nwMaker::sendError($a);

                return $rta;
            }
            $token_card = $cus["token_card"];
            $customer_id = $cus["customer_id"];
            $rest = substr($p['numero_tarjeta'], -4);
            $id_card = master::getNextSequence("nwmaker_tarjetascredito_id_seq", $db);
            $ca->prepareInsert("nwmaker_tarjetascredito", "id,customer_id,token_card,email,fecha,usuario,documento,nombre_tarjeta,apellido,tipo_doc,pais,currency,cuotas,nombre_banco,nombre,empresa,perfil,status,pago_unico_mensual,json_response");
            $ca->bindValue(":id", $id_card);
            $ca->bindValue(":fecha", date("Y-m-d H-i-s"));
            $ca->bindValue(":email", $email);
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":tipo_doc", $doc_type);
            $ca->bindValue(":documento", $doc_number);
            $ca->bindValue(":nombre_tarjeta", $nombre_tarjeta);
            $ca->bindValue(":apellido", $apellido_tarjeta);
            $ca->bindValue(":pais", $p['pais']);
            $ca->bindValue(":currency", $currency);
            $ca->bindValue(":nombre_banco", $p['nombre_banco']);
            $ca->bindValue(":nombre", $p['nombre_banco'] . " **** **** **** " . $rest);
            $ca->bindValue(":empresa", $empresa, true, true);
            $ca->bindValue(":perfil", $perfil, true, true);
            $ca->bindValue(":status", $cus["status"], true, true);
            $ca->bindValue(":pago_unico_mensual", $p["pago_unico_mensual"]);
            $ca->bindValue(":cuotas", $cuotas);
            $ca->bindValue(":token_card", $token_card);
            $ca->bindValue(":customer_id", $customer_id);
            $ca->bindValue(":json_response", strip_tags(json_encode($cus)));
            if (!$ca->exec()) {
                $db->rollback();

                $a = Array();
                $a["error_text"] = $ca->lastErrorText();
                $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//                nwMaker::sendError($a);

                return nwMaker::error($ca->lastErrorText());
            }
        }

        $rand = $token = nwMaker::random(100000, 999999);
        $a = Array();
        $a["name"] = $nombre_tarjeta;
        $a["last_name"] = $apellido_tarjeta;
        $a["email"] = $email;
        $a["customer_id"] = $customer_id;
        $a["token_card"] = $token_card;
        $a["bill"] = "NW-{$rand}";
        $a["doc_type"] = $doc_type;
        $a["doc_number"] = $doc_number;
        $a["description"] = $p["description"];
        $a["value"] = $p["price"];
        $a["tax"] = "0";
        $a["tax_base"] = "0";
        $a["currency"] = $currency;
        $a["dues"] = $cuotas;
        $payment = $pay->pay($a);
        if ($payment["status"] !== "OK") {
            $rt = "";
            $rt .= $payment["status"];
            $rt .= "<br />";
            $rt .= $payment["message"];
            $rt .= "<br />";
            $rt .= $payment["message_description"];
            $rt .= "<br />";
            if (isset($payment["errors"])) {
//                $rta .= $payment["errors"];
            }
            $rta = $rt;
            $rta .= "<br />";
            $rta .= " token_card: {$token_card} customer_id: {$customer_id} {$nombre_tarjeta} {$apellido_tarjeta} {$email} {$doc_type} {$doc_number} {$currency} {$cuotas}, price {$p["price"]} {$codigo_seguridad}";

            $d = json_encode($payment);
            $rta .= "<br />ALL_DATA: ------>" . strip_tags($d) . " <------- END_ALL_DATA ----->";

            $a = Array();
            $a["error_text"] = $rta;
            $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//            nwMaker::sendError($a);

            $ca->prepareInsert("nwmaker_tarjetascredito_pagos", "id_tarjeta,correo,valor,fecha,estado,respuesta,empresa,perfil,usuario,json_response,id_relational_pay,description");
            $ca->bindValue(":id_tarjeta", $id_card);
            $ca->bindValue(":correo", $email);
            $ca->bindValue(":valor", $p["price"]);
            $ca->bindValue(":fecha", date("Y-m-d H-i-s"));
            $ca->bindValue(":empresa", $empresa, true, true);
            $ca->bindValue(":perfil", $perfil, true, true);
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":estado", $payment["status"]);
            $ca->bindValue(":respuesta", strip_tags($rt));
            $ca->bindValue(":json_response", strip_tags(json_encode($payment)));
            $ca->bindValue(":id_relational_pay", $id_relational_pay);
            $ca->bindValue(":description", $p["description"]);
            if (!$ca->exec()) {
                $db->rollback();
                $a = Array();
                $a["error_text"] = $ca->lastErrorText();
                $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//                nwMaker::sendError($a);
                return nwMaker::error($ca->lastErrorText());
            }

            $ca->prepareUpdate("nwmaker_tarjetascredito", "status,fecha_ultima_actualizacion,json_response_rechazo", "id=:id");
            $ca->bindValue(":id", $id_card);
            $ca->bindValue(":fecha_ultima_actualizacion", date("Y-m-d H-i-s"));
            $ca->bindValue(":status", "RECHAZADA");
            $ca->bindValue(":json_response_rechazo", strip_tags(json_encode($payment)));
            if (!$ca->exec()) {
                $db->rollback();
                $a = Array();
                $a["error_text"] = $ca->lastErrorText();
                $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//                nwMaker::sendError($a);
                return nwMaker::error($ca->lastErrorText());
            }

            return $rta;
        }
        $ca->prepareInsert("nwmaker_tarjetascredito_pagos", "id_tarjeta,correo,valor,fecha,ref_payco,factura,estado,respuesta,autorizacion,recibo,empresa,perfil,usuario,json_response,id_relational_pay,description");
        $ca->bindValue(":id_tarjeta", $id_card);
        $ca->bindValue(":correo", $email);
        $ca->bindValue(":valor", $p["price"]);
        $ca->bindValue(":fecha", date("Y-m-d H-i-s"));
        $ca->bindValue(":ref_payco", $payment["ref_payco"]);
        $ca->bindValue(":factura", $payment["factura"]);
        $ca->bindValue(":estado", $payment["estado"]);
        $ca->bindValue(":respuesta", $payment["respuesta"]);
        $ca->bindValue(":autorizacion", $payment["autorizacion"]);
        $ca->bindValue(":recibo", $payment["recibo"]);
        $ca->bindValue(":empresa", $empresa, true, true);
        $ca->bindValue(":perfil", $perfil, true, true);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":json_response", strip_tags(json_encode($payment)));
        $ca->bindValue(":id_relational_pay", $id_relational_pay);
        $ca->bindValue(":description", $p["description"]);
        if (!$ca->exec()) {
            $db->rollback();
            $a = Array();
            $a["error_text"] = $ca->lastErrorText();
            $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//            nwMaker::sendError($a);
            return nwMaker::error($ca->lastErrorText());
        }

        $rta = Array();
        if ($payment["estado"] === "Rechazada") {
            $rta["status"] = "Rechazada";

            $ca->prepareUpdate("nwmaker_tarjetascredito", "status,fecha_ultima_actualizacion,json_response_rechazo", "id=:id");
            $ca->bindValue(":id", $id_card);
            $ca->bindValue(":fecha_ultima_actualizacion", date("Y-m-d H-i-s"));
            $ca->bindValue(":status", "RECHAZADA");
            $ca->bindValue(":json_response_rechazo", strip_tags(json_encode($payment)));
            if (!$ca->exec()) {
                $db->rollback();
                $a = Array();
                $a["error_text"] = $ca->lastErrorText();
                $a["program_name"] = "APi Epayco {$_SERVER["HTTP_HOST"]}";
//                nwMaker::sendError($a);
                return nwMaker::error($ca->lastErrorText());
            }
        } else {
            $rta["status"] = "OK";
        }
        $rta["ref_payco"] = $payment["ref_payco"];
        $rta["factura"] = $payment["factura"];
        $rta["estado"] = $payment["estado"];
        $rta["respuesta"] = $payment["respuesta"];
        $rta["autorizacion"] = $payment["autorizacion"];
        $rta["recibo"] = $payment["recibo"];
        $rta["data_all_payment"] = $payment;
        return $rta;
    }

    public static function apiNwPayTesting($data) {
        $p = nwMaker::getData($data);
        if (isset($p["type"]) && $p["type"] === "epayco") {
            return nwMaker::NwPayEpayco($p);
        }
        $p["valor"] = 10000;
        if (isset($p["price"])) {
            $p["valor"] = $p["price"];
        }
        if (!isset($p["description"])) {
            $p["description"] = "Testing";
        }
        $p["descripcion"] = $p["description"];

        if (!isset($p["pago_unico_mensual"])) {
            $p["pago_unico_mensual"] = "UNICO";
        }

        $p["nombre"] = $p["nombre_tarjeta"];
        $p["telefono"] = "";
        if (isset($p["celular"])) {
            $p["telefono"] = $p["celular"];
        }
        if (isset($p["telefono_fijo"])) {
            $p["telefono"] = $p["telefono_fijo"];
        }
        if (!isset($p["celular"])) {
            $p["celular"] = "";
        }
        if (isset($p["telefono"])) {
            $p["celular"] = $p["telefono"];
        }
        $documento = "";
        if (isset($p["nit"])) {
            $documento = $p["nit"];
        }
        if (isset($p["documento"])) {
            $documento = $p["documento"];
        }
        if (isset($p["identificacion"])) {
            $documento = $p["identificacion"];
        }
        if (!isset($p["direccion"])) {
            $p["direccion"] = "NONE";
        }
        if (isset($p["direccion"])) {
            if ($p["direccion"] === null || $p["direccion"] === false || $p["direccion"] === "") {
                $p["direccion"] = "NONE";
            }
        }
        if (!isset($p["ciudad_text"])) {
            $p["ciudad_text"] = "Bogotá";
        }
        if (isset($p["ciudad_text"])) {
            if ($p["ciudad_text"] === null || $p["ciudad_text"] === false || $p["ciudad_text"] === "") {
                $p["ciudad_text"] = "Bogotá";
            }
        }
        if (!isset($p["departamento"])) {
            $p["departamento"] = "Cundinamarca";
        }
        if (isset($p["departamento"])) {
            if ($p["departamento"] === null || $p["departamento"] === false || $p["departamento"] === "") {
                $p["departamento"] = "Cundinamarca";
            }
        }
        $usuario = null;
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        }
        $empresa = null;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
        }
        $perfil = null;
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $dcard = $p;
        if (isset($p["card"])) {
            $dcard = $p["card"];
        }
        $cardNew = true;
        if (isset($p["capturar_tarjeta"])) {
            if ($p["capturar_tarjeta"] === false || $p["capturar_tarjeta"] === "false" || $p["capturar_tarjeta"] === "NO") {
                $cardNew = false;
            }
            if ($p["capturar_tarjeta"] === true || $p["capturar_tarjeta"] === "true" || $p["capturar_tarjeta"] === "SI") {
                $cardNew = true;
            }
        }
        if (isset($dcard['tarjetas_registradas'])) {
            if ($dcard['tarjetas_registradas'] != "" && $dcard['tarjetas_registradas'] != "NEW") {
                $ca->prepareSelect("nwmaker_tarjetascredito", "*", "id=:id");
                $ca->bindValue(":id", $dcard['tarjetas_registradas']);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
                if ($ca->size() > 0) {
                    $nn = $ca->flush();
                    $cardNew = false;
                    $p["cuotas"] = "1";
                    $p["nombre_banco"] = $nn['nombre_banco'];
                    $p["numero_tarjeta"] = $nn['numero_tarjeta'];
                    $p["fecha_vencimiento"] = $nn['fecha_vencimiento'];
                    $p["codigo_seguridad"] = $nn['codigo_seguridad'];
                }
            }
        }
        if ($cardNew === true) {
            $p["cuotas"] = "1";
            $p["nombre_banco"] = $dcard['nombre_banco'];
            $p["numero_tarjeta"] = $dcard['numero_tarjeta'];
            $p["fecha_vencimiento"] = $dcard['fecha_vencimiento'];
            $p["codigo_seguridad"] = $dcard['codigo_seguridad'];
        }



        $p["documento"] = $documento;
        $ra = nwMaker::NwPayments($p);

        $dataCreditCard = $p;
        $dataCreditCard["empresa"] = $empresa;
        $dataCreditCard["perfil"] = $perfil;
        $dataCreditCard["documento"] = $documento;
        $dataCreditCard["usuario"] = $usuario;
        $dataCreditCard["status"] = $ra["APPROVED"];
        //testing save card, comment in production
//        if ($cardNew === true) {
//            $sc = nwMaker::saveCreditCardPayment($dataCreditCard);
//            if ($sc !== true) {
//                return $sc;
//            }
//        }
        if (!isset($ra["APPROVED"])) {
            return $ra;
        }
        if ($ra["APPROVED"] === true) {
            ///////////GUARDA LA TARJETA SI ES APROBADA
            if ($cardNew === true) {
                $sc = nwMaker::saveCreditCardPayment($dataCreditCard);
                if ($sc !== true) {
                    return $sc;
                }
            }
            if (isset($p["serviceResponse"]) && isset($p["methodResponse"])) {
                //callback opcional
                $method = $p["methodResponse"];
                //se oculta para que funcione helpers, REVISAR 09 JULIO 2019 
//                $d = $p["serviceResponse"]::$method($p["data_others"]);
                $d = $p["serviceResponse"]::$method($p);
                if ($d != true) {
                    return $d;
                }
            }
        }
        return $ra;
    }

    public static function NwPayments($data) {
        $p = nwMaker::getData($data);
        $id_session = session_id();
        //INICIA variables que recibe
        $nombre = $p["nombre"];
        $email = $p["email"];
        $celular = $p["celular"];
        $telefono = $p["telefono"];
        $documento = $p["documento"];
        $direccion = $p["direccion"];
        $ciudad = $p["ciudad_text"];
        $departamento = $p["departamento"];
        $pais = $p["pais"];
        $currency = $p["currency"];
        $description = $p["descripcion"];
        $nombre_banco = $p["nombre_banco"];
        $numero_tarjeta = $p["numero_tarjeta"];
        $fecha_vencimiento = $p["fecha_vencimiento"];
        $codigo_seguridad = $p["codigo_seguridad"];
        $valor = $p['valor'];
        //FIN variables que recibe
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $empresa = null;
        $where = "1=1";
        if (isset($p["empresa"])) {
            $where .= " and empresa=:empresa ";
            $empresa = $p["empresa"];
        }
        $where .= " order by id desc limit 1";
        $ca->prepareSelect("nc_config", "*", $where);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "No hay configuración de credenciales en nwcommerce nc_config";
        }
        $co = $ca->flush();
        $ref = NWUtils::get_random_string("abcdefghijklmnoq", 10);
        setcookie("PHPSESSID", $id_session, time() + 3600);
        $_SESSION["PHPSESSID"] = $id_session;

        $t = Array();
        if ($co["solo_validar"] == "SI") {
            $t["solo_validar"] = true;
        }
        if (isset($p["solo_validar"])) {
            $t["solo_validar"] = $p["solo_validar"];
        }
        $t["isTest"] = false;
        if ($co["pagos_pruebas"] == "SI" || $co["pagos_pruebas"] == "YES" || $co["pagos_pruebas"] == "t") {
            $t["isTest"] = true;
        }
        if (isset($p['pruebas'])) {
            if ($p['pruebas'] === "SI" || $p['pruebas'] === "true" || $p['pruebas'] === true) {
                $t["isTest"] = true;
            } else
            if ($p['pruebas'] === "NO" || $p['pruebas'] === "false" || $p['pruebas'] === false) {
                $t["isTest"] = false;
            }
        }
//        $t["isTest"] = true;
        if ($t["isTest"] == true) {
            $t["PaymentsCustomUrl"] = "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi";
            $t["ReportsCustomUrl"] = "https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi";
            $t["SubscriptionsCustomUrl"] = "https://sandbox.api.payulatam.com/payments-api/rest/v4.3/";
        } else {
            $t["PaymentsCustomUrl"] = "https://api.payulatam.com/payments-api/4.0/service.cgi";
            $t["ReportsCustomUrl"] = "https://api.payulatam.com/reports-api/4.0/service.cgi";
            $t["SubscriptionsCustomUrl"] = "https://api.payulatam.com/payments-api/rest/v4.3";
        }
        $t["apiKey"] = $co["apikey"];
        $t["apiLogin"] = $co["apiLogin"];
        $t["merchantId"] = $co["pagos_merchantId"];
        $t["cuenta_payu"] = $co["pagos_accountId"];
        if ($t["isTest"] == true) {
            $t["apiKey"] = "4Vj8eK4rloUd272L48hsrarnUA";
            $t["apiLogin"] = "pRRXKOl8ikMmt9u";
            $t["merchantId"] = "508029";
            $t["cuenta_payu"] = "512321";
        }
        $t["referencia"] = $ref;
        $t["descripcion"] = $description;
        $t["valor"] = $valor;
        $t["cuotas"] = "1";
        $t["nombre_banco"] = $nombre_banco;
        $t["numero_tarjeta"] = $numero_tarjeta;
        $t["fecha_vencimiento"] = $fecha_vencimiento;
        $t["codigo_seguridad"] = $codigo_seguridad;
        $t["nombre_completo"] = $nombre;
        $t["correo"] = $email;
        $t["telefono"] = $celular;
        $t["identificacion"] = $documento;
        $t["direccion_principal"] = $direccion;
        $t["direccion_secundaria"] = $direccion;
        $t["ciudad"] = $ciudad;
        $t["departamento"] = $departamento;
        $t["pais"] = $pais;
        $t["codigo_postal"] = "11001000";
        $t["telefono_fijo"] = $telefono;
        $t["pagador_nombre_completo"] = $nombre;
        $t["pagador_correo"] = $email;
        $t["pagador_telefono"] = $celular;
        $t["pagador_identificacion"] = $documento;
        $t["pagador_direccion_principal"] = $direccion;
        $t["pagador_direccion_secundaria"] = $direccion;
        $t["pagador_ciudad"] = $ciudad;
        $t["pagador_departamento"] = $departamento;
        $t["pagador_pais"] = $pais;
        $t["pagador_codigo_postal"] = "11001000";
        $t["pagador_telefono_fijo"] = $telefono;
        $t["currency"] = $currency;

        $pay = new NWPayments($t);
        $result = $pay->pagar($t);

        $ta = Array();
        $ta["result"] = $result;
        $ta["APPROVED"] = self::validateNwPayments($result);
        return $ta;
    }

    public static function validateNwPayments($ra) {
        $rta = false;
        $r = $ra;
        if (isset($r->transactionResponse->state)) {
            if ($r->transactionResponse->state == "APPROVED") {
                $rta = true;
            }
        }
        if ($r->transactionResponse->responseCode == "DECLINED_TEST_MODE_NOT_ALLOWED") {
            $rta = true;
        }
        return $rta;
    }

    public static function getPriceSegure($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nc_config", "*", "1=1 order by id desc limit 1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "No hay configuración de credenciales en nwcommerce";
        }
        $configNc = $ca->flush();
        return nwMaker::encrypt("{$configNc["apikey"]}~{$configNc["pagos_merchantId"]}~{$p["price"]}~COP", "md5");
    }

    public static function getConfigPayuNw($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nc_config", "*", "1=1 order by id desc limit 1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $referencia = "NW-" . date("YmdHis");
        $configNc = $ca->flush();

        $url_pruebas = "https://stg.gateway.payulatam.com/ppp-web-gateway/";
        $url_produccion = "https://gateway.payulatam.com/ppp-web-gateway/";
        $url_pruebas_sandbox = "https://sandbox.gateway.payulatam.com/ppp-web-gateway";
        $url_produccion_sandbox = "https://sandbox.gateway.payulatam.com/ppp-web-gateway/";
        ////////////////////////COMPRUEBA URL DE PRUEBAS O EN PRODUCCIÓN//////////////////////////////////////////////////////////////
//        $configNc["payu_sandbox"] = "SI";
//        $configNc["pagos_pruebas"] = "SI";
        $action = $url_produccion;
        if ("SI" == $configNc["payu_sandbox"]) {
            $action = $url_produccion_sandbox;
        }
        if ("SI" == $configNc["pagos_pruebas"]) {
            if ("SI" == $configNc["payu_sandbox"]) {
                $action = $url_pruebas_sandbox;
            } else {
                $action = $url_pruebas;
            }
        }
        $priceSegure = $p["price_segure"];
        if ($priceSegure != nwMaker::encrypt("{$configNc["apikey"]}~{$configNc["pagos_merchantId"]}~{$p["price"]}~COP", "md5")) {
            return "errorconprecios";
        }

        $pagina_de_respuesta = $configNc["pagina_de_respuesta"];
        $pagina_de_respuesta = 'https://' . $_SERVER["HTTP_HOST"] . '/nwlib6/nwproject/modules/apiNwPay/pageConfirmPay.php';
        $confirmationUrl = 'https://' . $_SERVER["HTTP_HOST"] . '/nwlib6/nwproject/modules/apiNwPay/pageConfirmPay.php';

        $r = Array();
        $r["signature"] = nwMaker::encrypt("{$configNc["apikey"]}~{$configNc["pagos_merchantId"]}~{$referencia}~{$p["price"]}~COP", "md5");
        $r["referencia"] = $referencia;
        $r["accountId"] = $configNc["pagos_accountId"];
        $r["merchantId"] = $configNc["pagos_merchantId"];
        $r["pruebas"] = $configNc["pagos_pruebas"];
        $r["action"] = $action;
        $r["price"] = $p["price"];
        $r["pagina_de_respuesta"] = $pagina_de_respuesta;
        $r["confirmationUrl"] = $confirmationUrl;
        $r["estado"] = "CREADO";
        if (isset($p["serviceResponse"]) && isset($p["methodResponse"])) {
            $r["serviceResponse"] = $p["serviceResponse"];
            $r["methodResponse"] = $p["methodResponse"];
        }

        $r["tipo"] = "BLANK_DEBIDO_PAYU";
        if (isset($p["tipo"])) {
            $r["tipo"] = $p["tipo"];
            if ($r["tipo"] == "SALDO") {
                $saldo = self::getSaldoUser();
                if (!$saldo) {
                    return "notienesaldo";
                }
                if ($saldo < $p["price"]) {
                    return "saldonoalzanza";
                }
                $r["saldo"] = $saldo;
            }
        }
        $r["refPayNw"] = self::insertPayNwPay($r);
        if (!$r["refPayNw"]) {
            return false;
        }
        return $r;
    }

    public static function getSaldoUser() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = $_SESSION;
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "saldo", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $sa = $ca->flush();
        return $sa["saldo"];
    }

    public static function getDataByPayNw($referencia) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwpay_pagos", "*", "clave_segura=:clave_segura");
        $ca->bindValue(":clave_segura", $referencia);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function insertPayNwPay($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $sessionID = session_id();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = $_SESSION;
        $fields1 = "cliente_nom,email_cliente,documento_cliente,usuario,empresa,fecha_creacion,estado,referencia,total,clave_segura,ref_session_pedido";
        $fields2 = "fecha_actualizacion,estado";
        if (isset($p["serviceResponse"]) && isset($p["methodResponse"])) {
            $fields1 .= ",serviceResponse,methodResponse";
        }
        if (isset($p["tipo"])) {
            $fields1 .= ",tipo";
        }
        $name = "";
        $nit = "";
        if (isset($si["nombre"])) {
            $name .= $si["nombre"];
        }
        if (isset($si["apellido"])) {
            $name .= $si["apellido"];
        }
        if (isset($si["nit"])) {
            $nit .= $si["nit"];
        }
        if (isset($p["refPayNw"])) {
            if (!isset($p["estado"])) {
                $p["estado"] = "ENVIADO_A_PAYU";
            }
            if ($p["estado"] == "PAGADO_CON_SALDO") {
                $su = self::getDataByPayNw($p["refPayNw"]);
                if (!$su) {
                    return nwMaker::error("error", true);
                }
                $saldo = self::getSaldoUser();
                $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "saldo", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":saldo", $saldo - $su["total"]);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
            }
            $ca->prepareUpdate("nwpay_pagos", $fields2, "usuario=:usuario and clave_segura=:clave_segura");
            $ca->bindValue(":clave_segura", $p["refPayNw"]);
        } else {
            $ca->prepareInsert("nwpay_pagos", $fields1);
            $clave_segura = $p["referencia"] . $sessionID;
            $ca->bindValue(":cliente_nom", $name);
            $ca->bindValue(":email_cliente", $si["email"]);
            $ca->bindValue(":documento_cliente", $nit);
            $ca->bindValue(":empresa", 1);
            $ca->bindValue(":clave_segura", $clave_segura);
            $ca->bindValue(":fecha_creacion", date("Y-m-d H:i:s"));
            $ca->bindValue(":referencia", $p["referencia"]);
            $ca->bindValue(":total", $p["price"]);
            $ca->bindValue(":ref_session_pedido", $sessionID);
            if (isset($p["factura_crear_pago"])) {
                $ca->bindValue(":num_factura", $p["factura_crear_pago"]);
            }
            if (isset($p["tipo"])) {
                $ca->bindValue(":tipo", $p["tipo"]);
            }
            if (isset($p["serviceResponse"]) && isset($p["methodResponse"])) {
                $ca->bindValue(":serviceResponse", $p["serviceResponse"]);
                $ca->bindValue(":methodResponse", $p["methodResponse"]);
            }
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha_actualizacion", date("Y-m-d H:i:s"));
        $ca->bindValue(":estado", $p["estado"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if (isset($p["refPayNw"])) {
            return true;
        }
        return $clave_segura;
    }

    public static function getMobile() {
        $r = "Unknown";
        // android
        $ua = strtolower($_SERVER['HTTP_USER_AGENT']);
        if (stripos($ua, 'android') !== false) { // && stripos($ua,'mobile') !== false) {
            $r = "android";
        }
//        $isiPad = (bool) strpos($_SERVER['HTTP_USER_AGENT'], 'iPad');
// ipad
        if (strpos($_SERVER['HTTP_USER_AGENT'], 'iPad')) {
            $r = "iPad";
        }
// iphone/ipod
        if (strstr($_SERVER['HTTP_USER_AGENT'], 'iPod')) {
            $r = "iPod";
        }
        if (strstr($_SERVER['HTTP_USER_AGENT'], 'iPhone')) {
            $r = "iPhone";
        }
        return $r;
    }

    public static function getDispositivo() {
        $tablet_browser = 0;
        $mobile_browser = 0;
        $body_class = 'desktop';

        if (preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
            $tablet_browser++;
            $body_class = "tablet";
        }

        if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
            $mobile_browser++;
            $body_class = "mobile";
        }

        if ((strpos(strtolower($_SERVER['HTTP_ACCEPT']), 'application/vnd.wap.xhtml+xml') > 0) or ( (isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) {
            $mobile_browser++;
            $body_class = "mobile";
        }

        $mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
        $mobile_agents = array(
            'w3c ', 'acs-', 'alav', 'alca', 'amoi', 'audi', 'avan', 'benq', 'bird', 'blac',
            'blaz', 'brew', 'cell', 'cldc', 'cmd-', 'dang', 'doco', 'eric', 'hipt', 'inno',
            'ipaq', 'java', 'jigs', 'kddi', 'keji', 'leno', 'lg-c', 'lg-d', 'lg-g', 'lge-',
            'maui', 'maxo', 'midp', 'mits', 'mmef', 'mobi', 'mot-', 'moto', 'mwbp', 'nec-',
            'newt', 'noki', 'palm', 'pana', 'pant', 'phil', 'play', 'port', 'prox',
            'qwap', 'sage', 'sams', 'sany', 'sch-', 'sec-', 'send', 'seri', 'sgh-', 'shar',
            'sie-', 'siem', 'smal', 'smar', 'sony', 'sph-', 'symb', 't-mo', 'teli', 'tim-',
            'tosh', 'tsm-', 'upg1', 'upsi', 'vk-v', 'voda', 'wap-', 'wapa', 'wapi', 'wapp',
            'wapr', 'webc', 'winw', 'winw', 'xda ', 'xda-');

        if (in_array($mobile_ua, $mobile_agents)) {
            $mobile_browser++;
        }

        if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']), 'opera mini') > 0) {
            $mobile_browser++;
            //Check for tablets on opera mini alternative headers
            $stock_ua = strtolower(isset($_SERVER['HTTP_X_OPERAMINI_PHONE_UA']) ? $_SERVER['HTTP_X_OPERAMINI_PHONE_UA'] : (isset($_SERVER['HTTP_DEVICE_STOCK_UA']) ? $_SERVER['HTTP_DEVICE_STOCK_UA'] : ''));
            if (preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $stock_ua)) {
                $tablet_browser++;
            }
        }
        $r = "";
        if ($tablet_browser > 0) {
// Si es tablet has lo que necesites
            $r = "tablet";
        } else if ($mobile_browser > 0) {
// Si es dispositivo mobil has lo que necesites
            $r = "mobile";
        } else {
// Si es ordenador de escritorio has lo que necesites
            $r = "pc_desktop";
        }
        return $r;
    }

    public static function getSystem() {
        $browser = array("IE", "OPERA", "MOZILLA", "NETSCAPE", "FIREFOX", "SAFARI", "CHROME");
        $os = array("WIN", "MAC", "LINUX");

        # definimos unos valores por defecto para el navegador y el sistema operativo
        $info['browser'] = "OTHER";
        $info['os'] = "OTHER";

        # buscamos el navegador con su sistema operativo
        foreach ($browser as $parent) {
            $s = strpos(strtoupper($_SERVER['HTTP_USER_AGENT']), $parent);
            $f = $s + strlen($parent);
            $version = substr($_SERVER['HTTP_USER_AGENT'], $f, 15);
            $version = preg_replace('/[^0-9,.]/', '', $version);
            if ($s) {
                $info['browser'] = $parent;
                $info['version'] = $version;
            }
        }

        # obtenemos el sistema operativo
        foreach ($os as $val) {
            if (strpos(strtoupper($_SERVER['HTTP_USER_AGENT']), $val) !== false)
                $info['os'] = $val;
        }

        # devolvemos el array de valores
        return $info;
    }

    public static function sumaRestaFechasByFecha($hour, $minute, $second, $fecha) {
//    $fecha = date('Y-m-d H:i:s'); //inicializo la fecha con la hora
        $nuevafecha = strtotime($hour, strtotime($fecha));
        $nuevafecha = strtotime($minute, $nuevafecha); // utilizo "nuevafecha"
        $nuevafecha = strtotime($second, $nuevafecha); // utilizo "nuevafecha"
        $nuevafecha = date('Y-m-d H:i:s', $nuevafecha);
//    $nuevafecha = date('Y-m-d', $nuevafecha);
//    $nuevafecha = date('Y-m-d', $nuevafecha);
        return $nuevafecha;
    }

    public static function sumaRestaFechas($hour, $minute, $second) {
        $fecha = date('Y-m-d H:i:s'); //inicializo la fecha con la hora
        $nuevafecha = strtotime($hour, strtotime($fecha));
        $nuevafecha = strtotime($minute, $nuevafecha); // utilizo "nuevafecha"
        $nuevafecha = strtotime($second, $nuevafecha); // utilizo "nuevafecha"
        $nuevafecha = date('Y-m-d H:i:s', $nuevafecha);
        return $nuevafecha;
    }

    public static function cortaText($texto, $limite) {
        if ($texto == null || $texto == false) {
            return $texto;
        }
        $total_caracteres = strlen($texto);
        if ($total_caracteres <= $limite) {
            return $texto;
        }
        $texto = substr(strip_tags($texto), 0, $limite);
        $palabras = explode(' ', $texto);
        $resultado = implode(' ', $palabras);
        return $resultado;
    }

    public static function getYouTubeIdFromURL($url) {
        $url_string = parse_url($url, PHP_URL_QUERY);
        parse_str($url_string, $args);
        return isset($args['v']) ? $args['v'] : false;
    }

    public static function getExtension($file_name) {
//        return end(explode(".", $str));
//        $file_extension = end(explode(".", $str));

        $tmp = explode('.', $file_name);
        $file_extension = end($tmp);
        return $file_extension;
    }

    public static function comprueba_extension($extension) {
        $extensiones_permitidas = Array(".gif", ".jpg", ".doc", ".docx", ".pdf", ".xlsx", ".xls", ".rar", ".png", ".JPG", ".PNG", ".GIF", ".apk");
        $permitida = false;
        for ($i = 0; $i < count($extensiones_permitidas); $i++) {
            if ($extensiones_permitidas[$i] == $extension) {
                $permitida = true;
                break;
            }
        }
        return $permitida;
    }

    public static function uploadFile($data) {
        $p = nwMaker::getData($data);
        $_POST = $p;
        include_once '/nwib6/uploader.php';
//        $rand = nwMaker::random(1000000000000, 9000000000000);
//        $nombre_archivo = $_FILES['archivo']['name'];
//        $ext = "." . self::getExtension($nombre_archivo);
//        $file = $rand . $ext;
//        if (self::comprueba_extension($ext)) {
//            $destino = $_SERVER["DOCUMENT_ROOT"] . "/imagenes/" . $file;
//            if ($file && move_uploaded_file($nombre_archivo, $destino)) {
//                sleep(3);
//                echo $file;
//            } else {
//                echo "{$nombre_archivo} No se subió";
//            }
//        } else {
//            echo "Nopuedesubiresetipodearchivo";
//        }
    }

    public static function saveTerminalAdicional($data) {
        $p = $data["data"];
        $_SESSION["multi_terminal"] = "NO";
        $_SESSION["terminal"] = $p["terminal"];
        return true;
    }

    public static function consumeConsecutivoContratoCuenta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $fecha = date("Y-m-d H:i:s");
        $usuario_pasajero = null;
        if (isset($p["usuario_pasajero"])) {
            $usuario_pasajero = $p["usuario_pasajero"];
        }
        $id_empresa = null;
        if (isset($p["id_empresa"])) {
            $id_empresa = $p["id_empresa"];
        }
        $ca->prepareInsert("nwmaker_contrato_consecutivo", "usuario,empresa,fecha,contrato_consecutivo,id_empresa,usuario_pasajero");
        $ca->bindValue(":usuario", $usuario, true);
        $ca->bindValue(":empresa", $empresa, true, true);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":contrato_consecutivo", $p["contrato"], true);
        $ca->bindValue(":id_empresa", $id_empresa, true, true);
        $ca->bindValue(":usuario_pasajero", $usuario_pasajero);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getConsecutivoContratoCuenta() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_contrato_consecutivo", "contrato_consecutivo", "1=1 order by id desc");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $contrato = "0001";
        if ($ca->size() > 0) {
            $r = $ca->flush();
            $contrato = floatval($r["contrato_consecutivo"]) + 1;
            //extrae los últimos 4 en caso de tener menos de 4 números            
            $contrato = substr("0000" . $contrato, -4);
        }
        return $contrato;
    }

    public static function saveAceptoTerminosCondiciones($p) {
        $p = nwMaker::getData($p);
        $usuario = nwMaker::getUser($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $contrato = nwMaker::random(1000000, 9999999);
        $contrato = nwMaker::getConsecutivoContratoCuenta();

        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $where = nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and perfil=:perfil";
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "acepto_terminos_condiciones,fecha_acepta_terminos,contrato", $where);
        $ca->bindValue(":usuario", $usuario, true);
        $ca->bindValue(":perfil", $p["perfil"], true);
        $ca->bindValue(":acepto_terminos_condiciones", "SI");
        $ca->bindValue(":fecha_acepta_terminos", $fecha);
        $ca->bindValue(":contrato", $contrato);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $p["contrato"] = $contrato;
        $p["usuario_pasajero"] = $usuario;
        nwMaker::consumeConsecutivoContratoCuenta($p);

        return true;
    }

    public static function consultaSiAceptoTerminos() {
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "acepto_terminos_condiciones", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and estado='activo' ");
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        if ($r["acepto_terminos_condiciones"] != "SI") {
            $ca->prepareSelect("nwmaker_terminos_condiciones", "html", "activo='SI' limit 1");
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            return $ca->flush();
        }
        return true;
    }

    public static function consultaUsuarioConectado($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and " . nwMaker::fieldsUsersNwMaker("estado_conexion") . "<>'desconectado' and estado='activo' ";
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "estado", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return true;
    }

    public static function consultaUsuariosParaEtiquetar($data) {
        $p = nwMaker::getData($data);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $table = nwMaker::tableUsersNwMaker();
        $where = "1=1";
        $where .= " and terminal=:terminal and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "<>:usuario and estado='activo' and tipo_creacion is null ";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar_usuario"]) && $p["filters"]["buscar_usuario"] != "") {
                $campos = nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",nombre";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar_usuario"], true);
            }
        }
        $ca->prepareSelect("{$table}", "CONCAT(nombre, ' ', apellido) AS nombre," . nwMaker::fieldsUsersNwMaker("foto_perfil") . "," . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as usuario_cliente", $where . " order by nombre asc");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaUsuarioChatPush($data) {
        $p = nwMaker::getData($data);
        $usuario = nwMaker::getUser($p);
        $terminal = nwMaker::getTerminal($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker("pv_clientes"), "id," . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as usuario_cliente,CONCAT(nombre, ' ', apellido) as nombre_apellido," . nwMaker::fieldsUsersNwMaker("foto_perfil") . " as foto_perfil", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and terminal=:terminal");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":terminal", $terminal);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function eliminaParticipanteConversation($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("sop_visitantes", "id=:id_vis");
        $ca->bindValue(":id_vis", $p["id_vis"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaParticipantesConversations($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("sop_visitantes a left join " . nwMaker::tableUsersNwMaker("pv_clientes") . " b ON(a.userscallintern=b." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " or a.userscallintern_d=b." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . ")", "b." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as user,CONCAT(b.nombre, ' ', b.apellido) as nombre,a.id as id_vis,b.id as id_user", "a.room_v2=:room_v2 and b.apellido!=' (Grupo)' order by b.nombre asc ");
        $ca->bindValue(":room_v2", $p["room_v2"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaUsuariosConectados($data) {
        $p = nwMaker::getData($data);
        $usuario = nwMaker::getUser($p);
        $terminal = nwMaker::getTerminal($p);
        if ($usuario === null || $usuario === false || $usuario === "" || $terminal === null || $terminal === false || $terminal === "") {
            nwMaker::checkSession();
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $showLastConversations = true;
        $where = " a.terminal=:terminal and a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "<>:usuario and a.estado='activo' ";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar_usuario"]) && $p["filters"]["buscar_usuario"] != "") {
                $campos = "a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",a." . nwMaker::fieldsUsersNwMaker("nombre") . "";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar_usuario"], true);
                $showLastConversations = false;
            }
        }
        if ($p["mode"] === "contactos") {
            $showLastConversations = false;
        }
        $whereON = "";
        if ($showLastConversations) {
            $where .= " and (b.userscallintern=:usuario or b.userscallintern_d=:usuario ) and b.tipo='CHAT_INTERNO' ";
            $whereON = "inner join sop_visitantes b ON(a.terminal=b.terminal and (b.userscallintern=a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " or b.userscallintern_d=a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "  ) )";
        } else {
            $where .= " and apellido!=' (Grupo)' ";
        }
        $table = "" . nwMaker::tableUsersNwMaker("pv_clientes") . " a {$whereON} ";
        $fields = "a.id, CONCAT(a." . nwMaker::fieldsUsersNwMaker("nombre") . ", ' ', a." . nwMaker::fieldsUsersNwMaker("apellido") . ") as nombre_apellido,a." . nwMaker::fieldsUsersNwMaker("foto_perfil") . " as foto_perfil,a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . " as usuario_cliente,a." . nwMaker::fieldsUsersNwMaker("estado_conexion") . ",a." . nwMaker::fieldsUsersNwMaker("dispositivo") . "";
        $fields .= ",a." . nwMaker::fieldsUsersNwMaker("fecha_ultima_conexion") . "";
        if ($showLastConversations) {
            $fields .= ",b.date_last_message,b.last_message,b.room_v2";
            $order = " order by b.fecha_ultima_interaccion_cliente desc, a." . nwMaker::fieldsUsersNwMaker("nombre") . " asc";
        } else {
            $order = " order by a." . nwMaker::fieldsUsersNwMaker("nombre") . " asc";
        }
        if ($db->getDriver() != "MYSQL") {
            $order = "";
        }
        $ca->prepareSelect($table, $fields, $where . $order);
        $ca->bindValue(":userDouble", $usuario . "&" . $usuario);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
        $ca->bindValue(":fecha_inicial", date("Y-m-d 00:00:00"));
        $ca->bindValue(":fecha_final", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
//        return $ca->preparedQuery();
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function notificacionNwMaker($p) {
        $userRecibe = null;
        if (isset($p["destinatario"])) {
            $userRecibe = $p["destinatario"];
        }
        if (isset($p["userRecibe"])) {
            $userRecibe = $p["userRecibe"];
        }
        $mensaje = null;
        if (isset($p["body"])) {
            $mensaje = $p["body"];
        }
        if (isset($p["mensaje"])) {
            $mensaje = $p["mensaje"];
        }
        $tipo = null;
        if (isset($p["tipo"])) {
            $tipo = $p["tipo"];
        }
        $link = null;
        if (isset($p["link"])) {
            $link = $p["link"];
        }
        $modo_window = null;
        if (isset($p["modo_window"])) {
            $modo_window = $p["modo_window"];
        }
        $fechaAviso = false;
        if (isset($p["fechaAviso"])) {
            $fechaAviso = $p["fechaAviso"];
        }
        $tipoAviso = null;
        if (isset($p["tipoAviso"])) {
            $tipoAviso = $p["tipoAviso"];
        }
        $sendEmail = true;
        if (isset($p["sendEmail"])) {
            $sendEmail = $p["sendEmail"];
        }
        $id_objetivo = null;
        if (isset($p["id_objetivo"])) {
            $id_objetivo = $p["id_objetivo"];
        }
        $titleMensaje = null;
        if (isset($p["titleMensaje"])) {
            $titleMensaje = $p["titleMensaje"];
        }
        $usuario_envia = null;
        if (isset($p["usuario_envia"])) {
            $usuario_envia = $p["usuario_envia"];
        }
        $foto = null;
        if (isset($p["foto"])) {
            $foto = $p["foto"];
        }
        $fecha_envio = null;
        if (isset($p["fecha_envio"])) {
            $fecha_envio = $p["fecha_envio"];
        }
        $callback = null;
        if (isset($p["callback"])) {
            $callback = $p["callback"];
        }
        $correo_usuario_recibe = null;
        if (isset($p["correo_usuario_recibe"])) {
            $correo_usuario_recibe = $p["correo_usuario_recibe"];
        }
        $fecha_final = null;
        if (isset($p["fecha_final"])) {
            $fecha_final = $p["fecha_final"];
        }
        $vencida_body = null;
        if (isset($p["vencida_body"])) {
            $vencida_body = $p["vencida_body"];
        }
        $vencida_title = null;
        if (isset($p["vencida_title"])) {
            $vencida_title = $p["vencida_title"];
        }
        $cleanHtml = false;
        if (isset($p["cleanHtml"])) {
            $cleanHtml = $p["cleanHtml"];
        }
        $fromName = false;
        if (isset($p["fromName"])) {
            $fromName = $p["fromName"];
        }
        $fromEmail = false;
        if (isset($p["fromEmail"])) {
            $fromEmail = $p["fromEmail"];
        }
        $leido = "NO";
        if (isset($p["leido"])) {
            $leido = $p["leido"];
        }
        $sendNotifyPush = false;
        if (isset($p["sendNotifyPush"])) {
            $sendNotifyPush = $p["sendNotifyPush"];
        }
        $izquierda_nomostrar_despues_de = false;
        if (isset($p["izquierda_nomostrar_despues_de"])) {
            $izquierda_nomostrar_despues_de = $p["izquierda_nomostrar_despues_de"];
        }
        $send_sms = "NO";
        if (isset($p["send_sms"])) {
            $send_sms = $p["send_sms"];
        }
        $celular = null;
        if (isset($p["celular"])) {
            $celular = $p["celular"];
        }
        $sms_body = null;
        if (isset($p["sms_body"])) {
            $sms_body = $p["sms_body"];
        }
        $body_email = null;
        if (isset($p["body_email"])) {
            $body_email = $p["body_email"];
        }
        $asunto_email = null;
        if (isset($p["asunto_email"])) {
            $asunto_email = $p["asunto_email"];
        }
        $terminal = null;
        if (isset($_SESSION["terminal"])) {
            $terminal = $_SESSION["terminal"];
        }
        if (isset($p["terminal"])) {
            $terminal = $p["terminal"];
        }
        $solo_campana = null;
        if (isset($p["solo_campana"])) {
            $solo_campana = $p["solo_campana"];
        }
        $solo_campana = null;
        if (isset($p["solo_campana"])) {
            $solo_campana = $p["solo_campana"];
        }
        $usuCredeSms = null;
        if (isset($p["usuCredeSms"])) {
            $usuCredeSms = $p["usuCredeSms"];
        }
        $passCredeSms = null;
        if (isset($p["passCredeSms"])) {
            $passCredeSms = $p["passCredeSms"];
        }
        $insertaEnTabla = null;
        if (isset($p["insertaEnTabla"])) {
            $insertaEnTabla = $p["insertaEnTabla"];
        }
        $empresa = null;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
        }
        $tipo_text_optional = null;
        if (isset($p["tipo_text_optional"])) {
            $tipo_text_optional = $p["tipo_text_optional"];
        }
        $perfil = null;
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
        }
        return nwMaker::crearNotificacion($userRecibe, $mensaje, $tipo, $link, $modo_window, $fechaAviso, $tipoAviso, $sendEmail, $id_objetivo, $titleMensaje, $usuario_envia, $foto, $fecha_envio, $callback, $correo_usuario_recibe, $fecha_final, $vencida_body, $vencida_title, $cleanHtml, $fromName, $fromEmail, $leido, $sendNotifyPush, $izquierda_nomostrar_despues_de, $send_sms, $celular, $sms_body, $body_email, $asunto_email, $terminal, $solo_campana, $usuCredeSms, $passCredeSms, $insertaEnTabla, $empresa, $tipo_text_optional, $perfil);
    }

    public static function crearNotificacion($userRecibe = null, $mensaje = null, $tipo = null, $link = null, $modo_window = null, $fechaAviso = false, $tipoAviso = null, $sendEmail = true, $id_objetivo = null, $titleMensaje = null, $usuario_envia = null, $foto = null, $fecha_envio = null, $callback = null, $correo_usuario_recibe = false, $fecha_final = null, $vencida_body = null, $vencida_title = null, $cleanHtml = false, $fromName = false, $fromEmail = false, $leido = "NO", $sendNotifyPush = false, $izquierda_nomostrar_despues_de = null, $send_sms = false, $celular = null, $sms_body = null, $body_email = null, $asunto_email = null, $terminal = null, $solo_campana = null, $usuCredeSms = null, $passCredeSms = null, $insertaEnTabla = true, $empresa = null, $tipo_text_optional = null, $perfil = null) {
        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $ca->haveAdvancedSecurity(false);
        $hoy = date("Y-m-d H:i:s");
        if ($fechaAviso === false) {
            $fechaAviso = $hoy;
        }
        if ($usuario_envia == null) {
            if (isset($si["usuario"])) {
                $usuario_envia = $si["usuario"];
            }
        }
        if ($foto == null) {
            if (isset($si["foto"])) {
                $foto = $si["foto"];
            }
        }
        if ($fecha_envio == null) {
            $fecha_envio = $hoy;
        }
        $send_email = "NO";
        if ($sendEmail === true) {
            $send_email = "SI";
        }
        if ($fechaAviso > $hoy) {
            $sendEmail = false;
        }
        $fromNameNot = null;
        if ($fromName !== false) {
            $fromNameNot = $fromName;
        }
        $fromEmailNot = null;
        if ($fromEmail !== false) {
            $fromEmailNot = $fromEmail;
        }
        $sendEmailNow = false;
        $email_is_sent = null;
        $date_email_is_sent = null;
        if ($sendEmail && $fecha_envio == $fechaAviso && $correo_usuario_recibe !== false) {
            $sendEmailNow = true;
            $email_is_sent = "SI";
            $date_email_is_sent = $hoy;
        }
        $mensaje_email = $mensaje;
        if ($body_email !== null) {
            $mensaje_email = $body_email;
        }
        $title = "Notificación {$hostname} NwMaker";
        if ($titleMensaje != null) {
            $title = $titleMensaje;
        }
        $titleEmail = "Notificación {$hostname} NwMaker";
        if ($titleMensaje != null) {
            $titleEmail = $titleMensaje;
        }
        if ($asunto_email != null) {
            $titleEmail = $asunto_email;
        }
        $sms_date_is_sent = null;
        if ($send_sms === true && $fecha_envio == $fechaAviso && $celular !== null) {
            $sms_date_is_sent = date("Y-m-d H:i:s");
        }

        $mensaje_corto = $mensaje;
        $sendNotifyPushData = "NO";
        $titleMensaje = nwMaker::cortaText($titleMensaje, 69);
        if ($insertaEnTabla === true) {
            $fields = "sms_date_is_sent";
            if (nwMaker::evalueData($fecha_final)) {
                $fields .= ",fecha_final";
            }
            if (nwMaker::evalueData($date_email_is_sent)) {
                $fields .= ",date_email_is_sent";
            }
            if (nwMaker::evalueData($fecha_envio)) {
                $fields .= ",fecha_envio";
            }
            if ($tipo_text_optional !== null) {
                $fields .= ",tipo_text_optional";
            }
            $fields .= ",fecha_aviso_recordat,";
            $fields .= "usuario_recibe,usuario_envia,leido,mensaje,tipo_aviso_recordat,tipo,link,modo_window,id_objetivo,title,icon,callback,send_email,correo_usuario_recibe,vencida_body,vencida_title,email_is_sent,izquierda_nomostrar_despues_de";
            $fields .= ",fromName,fromEmail,send_sms,celular,sms_body,asunto_email,body_email,terminal,solo_campana";
            if ($sendNotifyPush === true) {
                $fields .= ",sendNotifyPush";
                $sendNotifyPushData = "SI";
            }
            $ca->prepareInsert("nwmaker_notificaciones", $fields);
            $ca->bindValue(":usuario_recibe", $userRecibe);
            $ca->bindValue(":usuario_envia", $usuario_envia);
            $ca->bindValue(":leido", $leido);
            $ca->bindValue(":mensaje", $mensaje_corto);
//            $ca->bindValue(":tipo_aviso_recordat", nwMaker::cortaText($tipoAviso, 5));
            $ca->bindValue(":tipo_aviso_recordat", $tipoAviso);
            $ca->bindValue(":link", $link);
//            $ca->bindValue(":tipo", nwMaker::cortaText($tipo, 5));
            $ca->bindValue(":tipo", $tipo);
            $ca->bindValue(":modo_window", $modo_window);
            $ca->bindValue(":id_objetivo", $id_objetivo);
            $ca->bindValue(":title", $titleMensaje);
            $ca->bindValue(":icon", $foto);
            $ca->bindValue(":callback", $callback);
            $ca->bindValue(":send_email", $send_email);
            $ca->bindValue(":correo_usuario_recibe", $correo_usuario_recibe);
            $ca->bindValue(":vencida_body", $vencida_body);
            $ca->bindValue(":vencida_title", $vencida_title);
            $ca->bindValue(":email_is_sent", $email_is_sent);
            $ca->bindValue(":izquierda_nomostrar_despues_de", $izquierda_nomostrar_despues_de);
            $ca->bindValue(":fromName", $fromNameNot);
            $ca->bindValue(":fromEmail", $fromEmailNot);
            $ca->bindValue(":celular", $celular);
            $ca->bindValue(":send_sms", $send_sms);
            $ca->bindValue(":sms_body", $sms_body);
            $ca->bindValue(":asunto_email", $asunto_email);
            $ca->bindValue(":body_email", $body_email);
            $ca->bindValue(":terminal", $terminal, true, true);
            $ca->bindValue(":solo_campana", $solo_campana);
            $ca->bindValue(":sendNotifyPush", $sendNotifyPushData);
            $ca->bindValue(":sms_date_is_sent", $sms_date_is_sent, true, true);
            $ca->bindValue(":fecha_final", $fecha_final);
            $ca->bindValue(":fecha_aviso_recordat", $fechaAviso);
            $ca->bindValue(":fecha_envio", $fecha_envio);
            $ca->bindValue(":date_email_is_sent", $date_email_is_sent);
            $ca->bindValue(":tipo_text_optional", $tipo_text_optional);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
        }
        if ($send_sms === true && $fecha_envio == $fechaAviso && $celular !== null) {
//            $user = "GRUPONW";
//            $pass = "Nw729272";
            $user = nwMaker::getUserSMS();
            $pass = nwMaker::getPassSMS();
            if ($usuCredeSms !== null && $usuCredeSms !== false) {
                $user = $usuCredeSms;
            }
            if ($passCredeSms !== null && $passCredeSms !== false) {
                $pass = $passCredeSms;
            }
            $sm = Array();
            $sm["cel"] = $celular;
            $sm["text"] = nwMaker::limpiaTildes($sms_body);
            $sm["from"] = $user;
            $sm["user"] = $user;
            $sm["pass"] = $pass;
            $sm["url"] = "http://sms.colombiagroup.com.co/Api/rest/message";
            master::sendSMSByCBG($sm);
        }
        if ($sendEmailNow === true) {
            if ($hostname != "nwp5.loc" && $hostname != "www.nwp5.loc" && $hostname != "www.transmov.loc" && $hostname != "localhost" && $hostname != "localhost:8000") {
                nw_configuraciones::sendEmail($correo_usuario_recibe, $userRecibe, $titleEmail, $titleEmail, $mensaje_email, false, false, $cleanHtml, $fromName, $fromEmail, $empresa);
            }
        }
        if ($sendNotifyPush === true) {
            $where = "usuario=:usuario and json != '' and json IS NOT NULL ";
            if ($empresa != null) {
                $where .= " and empresa=:empresa ";
            }
            if ($perfil != null) {
                $where .= " and perfil=:perfil ";
            }
            $ca->prepareSelect("nwmaker_suscriptorsPush", "DISTINCT json", $where);
            $ca->bindValue(":usuario", $userRecibe, true, true);
            $ca->bindValue(":empresa", $empresa, true, true);
            $ca->bindValue(":perfil", $perfil, true, true);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                for ($i = 0; $i < $ca->size(); $i++) {
                    $r = $ca->flush();
                    $ra = Array();
                    $ra["title"] = $title;
                    $ra["body"] = $mensaje_corto;
                    $ra["token"] = $r["json"];
                    nwMaker::sendNotificacionPush($ra);
                }
            }
        }
        return true;
    }

    public static function getNotificaciones($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $date = nwMaker::sumaRestaFechas("+0 hour", "+60 minute", "+0 second");
        $where = "usuario_recibe=:usuario and fecha_aviso_recordat<:hoy and (fecha_lectura IS NULL or fecha_lectura<:hoymas) ";
//        $where = "usuario_recibe=:usuario ";
        if ($p["tipo"] === "chat") {
            $where .= " and (tipo='chat' or tipo='chatg' or tipo='call')";
        } else {
            $where .= " and tipo!='chat' and tipo!='chatg' and tipo!='call' ";
        }
//        $where .= " order by fecha_envio desc limit 20";
        $where .= " order by fecha_aviso_recordat desc limit 20";
        $ca->prepareSelect("nwmaker_notificaciones", "id,fecha_envio,mensaje,icon,usuario_envia,usuario_recibe,title,leido,callback,link,tipo,fecha_aviso_recordat,notify_open", $where);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":hoy", date("Y-m-d H:i:s"));
        $ca->bindValue(":hoymas", $date);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function leerNotificaciones($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $tipo = null;
        $tipo_diferent = null;
        $w = "usuario_recibe=:usuario and leido='NO' and fecha_aviso_recordat<:fecha_lectura ";
        if (isset($p["tipo"])) {
            $tipo = $p["tipo"];
            $w .= " and tipo=:tipo ";
        }
        if (isset($p["tipo_diferent"])) {
            $tipo_diferent = $p["tipo_diferent"];
            $w .= " and tipo!=:tipo_diferent ";
        }
        $ca->prepareUpdate("nwmaker_notificaciones", "leido,fecha_lectura", $w);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":leido", "SI");
        $ca->bindValue(":fecha_lectura", date("Y-m-d H:i:s"));
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":tipo_diferent", $tipo_diferent);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function leerNotificacionesById($data) {
        nwMaker::checkSession();
        $p = nwmaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("nwmaker_notificaciones", "leido,fecha_lectura,notify_open", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":leido", "SI");
        $ca->bindValue(":notify_open", "SI");
        $ca->bindValue(":fecha_lectura", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function readNotifyByIDS($data) {
        nwMaker::checkSession();
        $p = nwmaker::getData($data);
        for ($i = 0; $i < count($p["detalle"]); $i++) {
            $r = Array();
            $r["id"] = $p["detalle"][$i];
            $s = self::leerNotificacionesById($r);
            if ($s !== true) {
                return $s;
            }
        }
        return true;
    }

    public static function leerFechaLecturaNotificacionesById($data) {
        nwMaker::checkSession();
        $p = nwmaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("nwmaker_notificaciones", "fecha_lectura", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":fecha_lectura", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaNotificaciones($data) {
        if (nwMaker::checkSession() == false) {
            return "nohaysession";
        }
        $si = session::info();
        if (!isset($si["usuario"])) {
            return false;
        }
        $date = nwMaker::sumaRestaFechas("+0 hour", "+60 minute", "+0 second");
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "usuario_recibe=:usuario and :hoy>fecha_aviso_recordat and (fecha_lectura IS NULL or fecha_lectura<:hoymas)";
        $where .= " and leido=:leido ";
//        $where .= " and notificado is null ";
        $order = " order by fecha_envio desc  ";
        $ca->prepareSelect("nwmaker_notificaciones", "id,mensaje,usuario_recibe,usuario_envia,tipo,fecha_aviso_recordat,fecha_envio,leido,link,modo_window,id_objetivo,icon,title,notificado,callback,izquierda_nomostrar_despues_de,inhabil_callback_despues_de,solo_campana", $where . $order);
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":leido", "NO");
        $ca->bindValue(":hoy", date("Y-m-d H:i:s"));
        $ca->bindValue(":hoymas", $date);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $t = $ca->size();
        if ($t == 0) {
            return false;
        }
        $r = $ca->assocAll();
        for ($i = 0; $i < $t; $i++) {
            $ra = $r[$i];
            if ($ra["callback"] === null) {
                self::leerFechaLecturaNotificacionesById($ra);
            }
        }
        return $r;
    }

    public static function saveMyUsuariosNwMaker($p) {
        nwMaker::checkSession();
        $p = nwMaker::getData($p);
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $config = nwprojectOut::nwpMakerConfig();
        $configLogin = $config["config_login"];
        $table = nwMaker::tableUsersNwMaker();
        $estado = "activo";
        if (isset($configLogin["estado_registro"])) {
            $estado = $configLogin["estado_registro"];
        }
        if ($p["id"] === "") {
            $ca->prepareSelect($table, "id", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente");
            $ca->bindValue(":usuario_cliente", $p["usuario_cliente"], true);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                return "yaexiste";
            }
        }
        $doc = "";
        if (isset($p["documento"])) {
            $doc = $p["documento"];
        }
        $profesion = "";
        if (isset($p["profesion"])) {
            $profesion = $p["profesion"];
        }
        $user = $si["usuario"];
        $sendEmail = false;
        $fields = "nombre,apellido,perfil,estado_conexion";
        if (isset($p["clave"])) {
            $fields .= ",clave,email,usuario,terminal,usuario_principal";
        }
        $sala = "";
        $sala_text = "";
        if (isset($p["sala"])) {
            if ($p["sala"] !== "") {
                $fields .= ",sala";
                $sala = $p["sala"];
            }
        }
        if (isset($p["sala_text"])) {
            if ($p["sala_text"] !== "") {
                $fields .= ",sala_text";
                $sala_text = $p["sala_text"];
            }
        }
        $cargo_actual = "";
        if (isset($p["cargo_actual"])) {
            $cargo_actual = $p["cargo_actual"];
            $fields .= ",cargo_actual";
        }
        $pais = "";
        $pais_text = "";
        $pais_code = "";
        if (isset($p["pais"]) && $p["pais"] !== "") {
            $fields .= ",pais,pais_text,pais_code";
            $pais = $p["pais"];
            if (isset($p["pais_all_data"])) {
                $pais_text = $p["pais_all_data"]["nombre"];
                $pais_code = $p["pais_all_data"]["alias"];
            }
        }
        $extension_pbx = "";
        if (isset($p["extension_pbx"]) && $p["extension_pbx"] !== "") {
            $fields .= ",extension_pbx";
            $extension_pbx = $p["extension_pbx"];
        }
        $celular = "";
        if (isset($p["celular"]) && $p["celular"] !== "") {
            $fields .= ",celular";
            $celular = $p["celular"];
        }
        $descripcion = "";
        if (isset($p["descripcion"]) && $p["descripcion"] !== "") {
            $fields .= ",descripcion";
            $descripcion = $p["descripcion"];
        }
        $tarifa = "";
        if (isset($p["tarifa"]) && $p["tarifa"] !== "") {
            $fields .= ",tarifa";
            $tarifa = $p["tarifa"];
        }
        $fecha_nacimiento = "";
        if (isset($p["fecha_nacimiento"]) && $p["fecha_nacimiento"] !== "") {
            $fields .= ",fecha_nacimiento";
            $fecha_nacimiento = $p["fecha_nacimiento"];
        }

        $foto_perfil = "";
        if (isset($p["foto_perfil"]) && $p["foto_perfil"] !== "") {
//            $fields .= ",foto";
            $fields .= "," . nwMaker::fieldsUsersNwMaker("foto_perfil");
            $foto_perfil = $p["foto_perfil"];
        }
        $fields .= "," . nwMaker::fieldsUsersNwMaker("nit") . "";
        if ($table === "pv_clientes") {
            $fields .= ",usuario_cliente";
            $fields .= ",genero,profesion";
            $user = $p["usuario_cliente"];
        } else {
            $user = $p["usuario_cliente"];
            if ($p["id"] == "") {
                $ca->prepareInsert("usuarios_empresas", "usuario,empresa,perfil,terminal");
            } else {
                $ca->prepareUpdate("usuarios_empresas", "usuario,empresa,perfil,terminal", "usuario=:usuario");
            }
            $ca->bindValue(":usuario", $p["usuario_cliente"], true, true);
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":perfil", $si["perfil"]);
            $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
        }
        $fields .= ",horario_task,horario_task_almuerzo";
        if ($p["id"] == "") {
            $fields .= ",estado,empresa";
            $sendEmail = true;
            $ca->prepareInsert($table, $fields);
        } else {
            $ca->prepareUpdate($table, $fields, nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente and terminal=:terminal");
        }
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":horario_task", $p["horario_task"], true, true);
        $ca->bindValue(":horario_task_almuerzo", $p["horario_task_almuerzo"], true, true);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":apellido", $p["apellido"]);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("nit"), $doc, true);
        $ca->bindValue(":email", $p["usuario_cliente"], true);
        $ca->bindValue(":usuario_cliente", $p["usuario_cliente"], true);
        $ca->bindValue(":estado_conexion", $p["estado_conexion"], true);
        $ca->bindValue(":usuario", $user);
        if (isset($p["clave"])) {
            $ca->bindValue(":clave", $p["clave"] == "" ? "" : nwMaker::encrypt($p["clave"]));
        }
        $ca->bindValue(":genero", $p["genero"]);
        $ca->bindValue(":profesion", $profesion, true, true);
        $ca->bindValue(":cargo_actual", $cargo_actual, true, true);
        if (isset($si["pais"])) {
            $ca->bindValue(":pais", $si["pais"]);
        }
        $term = "";
        if (isset($p["terminal"])) {
            $ca->bindValue(":terminal", $p["terminal"]);
            $term = $p["terminal"];
        } else {
//            {
//            if (isset($si["terminal_principal"])) {
//                $ca->bindValue(":terminal", $si["terminal_principal"]);
//                $term = $si["terminal_principal"];
//            } else
            if (isset($si["terminal"])) {
                $ca->bindValue(":terminal", $si["terminal"]);
                $term = $si["terminal"];
            }
        }
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":usuario_principal", $si["usuario_principal"]);
        $ca->bindValue(":sala", $sala, true, true);
        $ca->bindValue(":sala_text", $sala_text, true, true);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":pais", $pais, true, true);
        $ca->bindValue(":pais_text", $pais_text, true, true);
        $ca->bindValue(":pais_code", $pais_code, true, true);
        $ca->bindValue(":extension_pbx", $extension_pbx, true, true);
        $ca->bindValue(":celular", $celular, true, true);
        $ca->bindValue(":tarifa", $tarifa, true, true);
        $ca->bindValue(":descripcion", $descripcion, true, true);
        $ca->bindValue(":fecha_nacimiento", $fecha_nacimiento, true, true);
//        $ca->bindValue(":foto", $foto_perfil, true, true);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("foto_perfil"), $foto_perfil, true, true);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        $a = Array();
        $a["id"] = $p["id"];
        $a["nombres_apellidos"] = $p["nombre"] . " " . $p["apellido"];
        $a["usuario_cliente"] = $p["usuario_cliente"];
        $a["terminal"] = $term;
//        if (nwMaker::updateUserMutiTerminal($a) != true) {
//            return "No se pudo actualizar la información";
//        }
        $sendEmail = false;
        if ($sendEmail == true) {
            $mensaje = "Nueva cuenta creada en {$_SERVER["HTTP_HOST"]}, usuario: {$p["usuario_cliente"]}, clave: {$p["clave"]} ";
            $a = Array();
            $a["destinatario"] = $p["usuario_cliente"];
            $a["titleMensaje"] = "Se ha creado una cuenta para ti en {$_SERVER["HTTP_HOST"]}";
            $a["body"] = $mensaje;
            $a["tipo"] = "n_min";
            $a["link"] = false;
            $a["modo_window"] = "popup";
            $a["fechaAviso"] = date("Y-m-d H:i:s");
            $a["tipoAviso"] = "";
            $a["sendEmail"] = true;
            $a["sendNotifyPush"] = true;
            nwMaker::notificacionNwMaker($a);

            $p["email"] = $p["usuario_cliente"];
            $p["usuario"] = $p["usuario_cliente"];
            $p["email_principal"] = $si["usuario_principal"];
            $p["pais_all_data"] = $si["pais_all_data"];
            $nwp = self::verifyCodeUserProduct($p);
            if ($nwp !== true) {
                $db->rollback();
                return $nwp;
            }
        }
        $db->commit();
        return true;
    }

    public static function checkCountryProd($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "pais", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente");
        $ca->bindValue(":usuario_cliente", $si["usuario"]);
        $ca->bindValue(":pais", $p["pais"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $_SESSION["pais"] = $p["pais"];
        $_SESSION["pais_text"] = $p["pais_text"];
        $_SESSION["pais_all_data"] = $p["pais_all_data"];
        return true;
    }

    public static function validateConcurrencia() {
        nwMaker::checkSession();
        $si = session::info();
        if (!isset($si["usuario"])) {
            return false;
        }
        $configLogin = nwprojectOut::nwpMakerLoginConfig();
        if (!isset($configLogin["concurrencia"])) {
            return true;
        }
        if ($configLogin["concurrencia"] === "NO" && isset($si["usuario"])) {
            $sessionID = session_id();
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $date = nwMaker::sumaRestaFechas("+0 hour", "-1 minute", "-30 second");
            $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "fecha_ultima_conexion", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and id_session!=:session_id and fecha_ultima_conexion>=:fecha_ultima_conexion and estado_conexion='conectado' order by fecha_ultima_conexion desc limit 1");
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":session_id", $sessionID);
            $ca->bindValue(":fecha_ultima_conexion", $date);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $r = $ca->flush();
                nwMaker::closeSession();
                $r["concurrente"] = true;
                return $r;
            } else {
                nwMaker::verifySessionsIDMaker(false);
                return true;
            }
        }
        return true;
    }

    public static function refreshSessionApp($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $perfil = "";
        $empresa = "";
        $perfiles = "perfiles";
        $table = nwMaker::tableUsersNwMaker();
        $user = nwMaker::fieldsUsersNwMaker("usuario_cliente");
        if ($table === "pv_clientes") {
            $perfiles = "nwmaker_perfiles";
        }
        $id_usuario = null;
        $where = "a.{$user}=:usuario and a.estado='activo' ";
        if (isset($p["id_usuario"])) {
            $where .= " and a.id=:id ";
            $id_usuario = $p["id_usuario"];
        }
        if (isset($p["empresa"])) {
            $where .= " and a.empresa=:empresa";
            $empresa = $p["empresa"];
        }
        if (isset($p["perfil"])) {
            $where .= " and a.perfil=:perfil";
            $perfil = $p["perfil"];
        }
        $tables = "{$table} a ";
//        $tables .= " left join {$perfiles} b on (a.perfil=b.id) ";
        $tables .= " left join empresas c on (a.empresa=c.id) ";
        $fields = "a.*";
//        $fields .= ",b.nombre as perfil_text";
        $fields .= ",c.idioma_por_defecto as idioma_por_defecto";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":usuario", $p["usuario"], true, true);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":id", $id_usuario);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "USUARIO_NO_EXISTE";
        }
        $ra = $ca->flush();

        nwMaker::actualizeLastConnectionAPP($p);

        if (nwMaker::validateIsNwMaker() === true) {
            $ra["usuario"] = $ra["usuario_cliente"];
        }
//        $db->close();
        return $ra;
    }

    public static function actualizeLastConnectionAPP($p) {
        $p = nwMaker::getData($p);
        $usuario = nwMaker::getUser($p);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $perfil = nwMaker::getDataSESSION($p, "perfil");
        $fields = "fecha_ultima_conexion,estado_conexion";
        $latitud = null;
        $longitud = null;
        if (isset($p["latitud"]) && isset($p["longitud"])) {
            $fields .= ",latitud,longitud";
            $latitud = $p["latitud"];
            $longitud = $p["longitud"];
        }
//        $ciudad = null;
//        $ciudad_text = null;
//        if (isset($p["ciudad"])) {
//            $fields .= ",ciudad";
//            $ciudad = $p["ciudad"];
//        }
//        if (isset($p["ciudad_text"])) {
//            $fields .= ",ciudad_text";
//            $ciudad_text = $p["ciudad_text"];
//        }
        $version_in_this_device = null;
        if (isset($p["version_in_this_device"])) {
            $fields .= ",version_in_this_device";
            $version_in_this_device = $p["version_in_this_device"];
        }
        $version = null;
        if (isset($p["version"])) {
            $fields .= ",version";
            $version = $p["version"];
        }
        $dispositivo = null;
        if (isset($p["dispositivo"])) {
            $fields .= ",dispositivo";
            $dispositivo = $p["dispositivo"];
        }
        $token = null;
        if (isset($p["token"])) {
            $fields .= ",token";
            $token = $p["token"];
        }
        $sistema_operativo = null;
        if (isset($p["sistema_operativo"])) {
            $fields .= ",sistema_operativo";
            $sistema_operativo = $p["sistema_operativo"];
        }
        $fechaOnly = date("Y-m-d");
        $horaOnly = date("H:i:s");
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        if (isset($p["z_fromlib_fecha_actual_navigator_cliente"])) {
            $fechaOnly = $p["z_fromlib_fecha_actual_navigator_cliente"];
        }
        if (isset($p["z_fromlib_hora_actual_navigator_cliente"])) {
            $horaOnly = $p["z_fromlib_hora_actual_navigator_cliente"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), $fields, nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario_cliente", $usuario);
        $ca->bindValue(":fecha_ultima_conexion", $fecha);
        $ca->bindValue(":estado_conexion", $p["estado"]);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
//        $ca->bindValue(":ciudad", $ciudad);
//        $ca->bindValue(":ciudad_text", $ciudad_text);
        $ca->bindValue(":latitud", $latitud);
        $ca->bindValue(":longitud", $longitud);
        $ca->bindValue(":version_in_this_device", nwMaker::cortaText($version_in_this_device, 50), true, true);
        $ca->bindValue(":version", nwMaker::cortaText($version, 20), true, true);
        $ca->bindValue(":dispositivo", nwMaker::cortaText($dispositivo, 100));
        $ca->bindValue(":token", nwMaker::cortaText($token, 200));
        $ca->bindValue(":sistema_operativo", nwMaker::cortaText($sistema_operativo, 50));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if (isset($p["haveCallBack"]) && $p["haveCallBack"] === "SI") {
            return $fecha;
        } else {
            return true;
        }
    }

    public static function actualizeLastConnection($p = false) {
//        if (!isset($p["session_app"])) {
        nwMaker::checkSession();
        $fecha_hora_actual = date("Y-m-d H:i:s");
        $_SESSION['tiempo_vida_session'] = $fecha_hora_actual;
        if (!isset($_SESSION["usuario"])) {
            nwMaker::closeSession();
            return "session_expired";
//            session_destroy();
//            return true;
        }
//        }
        $estado = "conectado";
//        $getSession = "";
        $getSession = false;
        if ($p !== false) {
            $p = nwMaker::getData($p);
            if (isset($p["estado"])) {
                $estado = $p["estado"];
            }
            if (isset($p["getSession"])) {
                $getSession = $p["getSession"];
            }
        }
        $hoy = date("Y-m-d H:i:s");
        if (isset($p["session_app"])) {
            $usuario = $p["usuario"];
            $terminal = $p["terminal"];
        } else {
            $usuario = nwMaker::getUser($p);
            $terminal = nwMaker::getTerminal($p);
        }
        $sessionID = session_id();
        if ($p !== false) {
            if (isset($p["session_id"])) {
                $sessionID = master::clean($p["session_id"]);
            }
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "fecha_ultima_conexion,id_session,estado_conexion", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente");
        $ca->bindValue(":usuario_cliente", $usuario);
        $ca->bindValue(":fecha_ultima_conexion", $hoy);
        $ca->bindValue(":id_session", $sessionID);
        $ca->bindValue(":estado_conexion", $estado);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $_SESSION['estado_conexion'] = $estado;
        $data = Array();
        $data["usuario"] = $usuario;
        $data["terminal"] = $terminal;
        nwMaker::insertLogUserNwMaker($estado, $data);
//        $val = nwMaker::validateConcurrencia();
//        if ($val !== true) {
//            return $val;
//        }
//        $db->close();
        if ($getSession !== false) {
            return $_SESSION;
        }
        return true;
    }

    public static function verifySessionsIDMaker($data) {
        $si = session::info();
        $p = nwMaker::getData($data);
        $key = null;
        $login = false;
        if (isset($p["login"])) {
            $login = $p["login"];
            if (isset($p["key"])) {
                $key = $p["key"];
            }
        }
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $terminal = null;
        if (isset($si["terminal"])) {
            $terminal = $si['terminal'];
        }
        $uss = false;
        if (isset($_COOKIE['user_nwmaker'])) {
            $uss = $_COOKIE['user_nwmaker'];
        } else
        if (isset($_COOKIE['usuario_name'])) {
            $uss = $_COOKIE['usuario_name'];
        } else
        if (isset($si["usuario"])) {
            $uss = $si['usuario'];
        } else
        if (isset($p["usuario"]) && $p["usuario"] !== false) {
            $uss = $p['usuario'];
        }
        $cookie = false;
        if (isset($p['cookie'])) {
            $cookie = $p['cookie'];
        } else
        if (isset($_COOKIE['marca_nwmaker'])) {
            $cookie = $_COOKIE['marca_nwmaker'];
        } else
        if (isset($_COOKIE['marca'])) {
            $cookie = $_COOKIE['marca'];
        }
        $disp = self::getDispositivo();
        $sessionID = session_id();
        if (isset($p['session_id'])) {
            if ($p['session_id'] !== false) {
                $sessionID = $p['session_id'];
            }
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $w = "session_id=:session_id";
        if ($cookie != false && $uss != false) {
            $w .= " or cookie=:cookie and usuario=:usuario";
        }
        $ca->prepareSelect("nwmaker_sessions", "session_id,usuario,key_tmp", $w);
        $ca->bindValue(":session_id", $sessionID, true);
        $ca->bindValue(":cookie", $cookie, true);
        $ca->bindValue(":usuario", $uss, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0 && $uss != false && $terminal != null) {
            $ca->prepareInsert("nwmaker_sessions", "usuario,terminal,session_id,key_tmp,fecha,cookie,fecha_ultima_conexion,dispositivo");
            $ca->bindValue(":usuario", $uss);
            $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
            $ca->bindValue(":session_id", $sessionID);
            $ca->bindValue(":key_tmp", $key);
            $ca->bindValue(":fecha", $fecha);
            $ca->bindValue(":cookie", $cookie);
            $ca->bindValue(":fecha_ultima_conexion", $fecha);
            $ca->bindValue(":dispositivo", $disp);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            return "insession";
        } else {
            $r = $ca->flush();
            if ($login === false && !isset($si["usuario"])) {
                $pos = Array();
                if (isset($r["usuario"])) {
                    $pos["usuario"] = $r["usuario"];
                }
                if (isset($r["key_tmp"])) {
                    $pos["clave"] = $r["key_tmp"];
                }
                $pos["nomd5"] = true;
                $pos["session_id"] = $sessionID;
                return nwMaker::loginStarSession($pos);
            } else {
                return $si;
            }
        }
    }

    public static function queryDomainsAutorized($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_domains_autorizados", "*", "pagina=:page");
        $ca->bindValue(":page", $p["page"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function insertLogUserNwMaker($status, $p = false) {
        nwMaker::checkSession();
        if (!isset($_SESSION["usuario"])) {
            session_destroy();
            return true;
        }
        $p = nwMaker::getData($p);
        $usuario = nwMaker::getUser($p);
        $terminal = nwMaker::getTerminal($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
//        if ($status === "EN_LINEA" || $status === "conectado" || $status === "ausente" || $status === "ocupado" || $status === "desconectado") {
//            if (isset($_SESSION['fecha_ultima_conexion'])) {
//                $lastsum = nwMaker::sumaRestaFechasByFecha("+0 hour", "+0 minute", "+90 second", $_SESSION['fecha_ultima_conexion']);
//                if ($hoy <= $lastsum) {
//                    $ca->prepareDelete("nwmaker_usuarios_log", "usuario=:usuario and terminal=:terminal and fecha=:fecha and estado=:estado ");
//                    $ca->bindValue(":usuario", $usuario);
//                    $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
//                    $ca->bindValue(":estado", $status);
//                    $ca->bindValue(":fecha", $_SESSION['fecha_ultima_conexion']);
//                    if (!$ca->exec()) {
//                         return nwMaker::error($ca->lastErrorText());
//                    }
//                } else {
//                    //quiere decir que estuvo ausente por más de 30 segundos
//                    $ca->prepareInsert("nwmaker_usuarios_log", "usuario,terminal,estado,fecha");
//                    $ca->bindValue(":usuario", $usuario);
//                    $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
//                    $ca->bindValue(":estado", "ENTRADA_UP");
//                    $ca->bindValue(":fecha", $hoy);
//                    if (!$ca->exec()) {
//                       return nwMaker::error($ca->lastErrorText());
//                    }
//                }
//            } else {
//                $ca->prepareSelect("nwmaker_usuarios_log", "fecha", "usuario=:usuario and terminal=:terminal and estado=:estado order by fecha desc limit 1");
//                $ca->bindValue(":usuario", $usuario);
//                $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
//                $ca->bindValue(":estado", $status);
//                if (!$ca->exec()) {
//                  return nwMaker::error($ca->lastErrorText());
//                }
//                $fecha_ultima_conexion = $ca->flush();
//                $fecha_ultima_conexion = $fecha_ultima_conexion["fecha"];
//                if ($ca->size() > 0) {
//                    $lastsum = nwMaker::sumaRestaFechasByFecha("+0 hour", "+0 minute", "+30 second", $fecha_ultima_conexion);
//                    if ($hoy <= $lastsum) {
//                        $ca->prepareDelete("nwmaker_usuarios_log", "usuario=:usuario and terminal=:terminal and fecha=:fecha and estado=:estado ");
//                        $ca->bindValue(":usuario", $usuario);
//                        $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
//                        $ca->bindValue(":estado", $status);
//                        $ca->bindValue(":fecha", $fecha_ultima_conexion);
//                        if (!$ca->exec()) {
//                       return nwMaker::error($ca->lastErrorText());
//                        }
//                    }
//                }
//            }
//        }
        $ca->prepareInsert("nwmaker_usuarios_log", "usuario,terminal,estado,fecha");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":terminal", $terminal == "" ? 0 : $terminal);
        $ca->bindValue(":estado", $status);
        $ca->bindValue(":fecha", $hoy);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $_SESSION['fecha_ultima_conexion'] = $hoy;
        return true;
    }

    public static function insertLoginLineTime($p) {
        $config = nwprojectOut::nwpMakerConfig();
        $pass = false;
        if (isset($config["use_linetime_login"]) && $config["use_linetime_login"] === true) {
            $pass = true;
        }
        if (!$pass) {
            return true;
        }
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $tipo = "LOGIN";
        $terminal = nwMaker::getTerminal($p);
        $usuario = nwMaker::getUser($p);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $perfil = nwMaker::getDataSESSION($p, "perfil");
        $ciudad = null;
        $pais = null;
        $latitud = null;
        $longitud = null;
        $timezone = null;
        $obs = null;
        if (isset($p["visitor"]) && $p["visitor"] !== null) {
            if (isset($p["visitor"]["city"]))
                $ciudad = $p["visitor"]["city"];
            if (isset($p["visitor"]["country"]))
                $pais = $p["visitor"]["country"];
            if (isset($p["visitor"]["latitude"])) {
                $latitud = $p["visitor"]["latitude"];
            }
            if (isset($p["visitor"]["longitude"])) {
                $longitud = $p["visitor"]["longitude"];
            }
            if (isset($p["visitor"]["timezone"])) {
                $timezone = $p["visitor"]["timezone"];
            }
            $obs = json_encode($p["visitor"]);
        }
//        else {
//            $ipd = nwMaker::get_ip_detail();
//            if ($ipd !== false) {
//
//                if (isset($ipd["city"]))
//                    $ciudad = $ipd["city"];
//
//                if (isset($ipd["country"]))
//                    $pais = $ipd["country"];
//
//                if (isset($ipd["lat"]))
//                    $latitud = $ipd["lat"];
//
//                if (isset($ipd["lon"]))
//                    $longitud = $ipd["lon"];
//
//                if (isset($ipd["timezone"]))
//                    $timezone = $ipd["timezone"];
//
//                $obs = json_encode($ipd);
//            }
//        }

        $device = nwMaker::getDispositivo();
        $sys = nwMaker::getSystem();
        $navegador = "";
        if (isset($sys["browser"]))
            $navegador .= $sys["browser"];
        if (isset($sys["os"]))
            $navegador .= " OS:" . $sys["os"];
        if (isset($sys["version"]))
            $navegador .= " V:" . $sys["version"];
        $ing_disp = $device . "-" . $navegador;

        $ip = master::getRealIp();

        $ca->prepareInsert("nwmaker_users_login_linetime", "usuario,terminal,empresa,fecha,ip,dispositivo,host,tipo,ciudad,pais,latitud,longitud,timezone,obs");
        $ca->bindValue(":usuario", $usuario, true, true);
        $ca->bindValue(":terminal", $terminal, true, true);
        $ca->bindValue(":empresa", $empresa, true, true);
        $ca->bindValue(":perfil", $perfil, true, true);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":ip", $ip, true, true);
        $ca->bindValue(":dispositivo", $ing_disp, true, true);
        $ca->bindValue(":tipo", $tipo, true, true);
        $ca->bindValue(":host", $_SERVER["HTTP_HOST"]);
        $ca->bindValue(":ciudad", $ciudad, true, true);
        $ca->bindValue(":pais", $pais, true, true);
        $ca->bindValue(":latitud", $latitud, true, true);
        $ca->bindValue(":longitud", $longitud, true, true);
        $ca->bindValue(":timezone", $timezone, true, true);
        $ca->bindValue(":obs", $obs, true, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "ip,dispositivo,ciudad_ultimo_login,pais_ultimo_login,latitud_ultimo_login,longitud_ultimo_login", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":ip", $ip);
        $ca->bindValue(":dispositivo", $ing_disp);
        $ca->bindValue(":ciudad_ultimo_login", $ciudad);
        $ca->bindValue(":pais_ultimo_login", $pais);
        $ca->bindValue(":latitud_ultimo_login", $latitud);
        $ca->bindValue(":longitud_ultimo_login", $longitud);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function cancelarCuenta($p) {
        $p = nwMaker::getData($p);
//        print_r($p);
//        return;
        nwMaker::checkSession();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("usuarios_empresas", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"], true);
        $ca->bindValue(":empresa", $p["empresa"], true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $ca->prepareDelete("usuarios_empresas", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"], true);
        $ca->bindValue(":empresa", $p["empresa"], true);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaMisTarjetas($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "usuario=:usuario ";
        $table = "nwmaker_tarjetascredito";
        $fields = "id,nombre,fecha_vencimiento";
        $ca->prepareSelect($table, $fields, $where);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function consultaMyUsuariosNwMaker($data) {
        $p = nwMaker::getData($data);
        nwMaker::checkSession();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $where = "terminal=:terminal and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "!=:usuario";
        $where = "a.terminal=:terminal and a.apellido!=' (Grupo)'";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "a.nombre,a.apellido,a." . nwMaker::fieldsUsersNwMaker("usuario_cliente");
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if (isset($p["filters"]["estado"]) && $p["filters"]["estado"] != "") {
                $where .= " and a.estado=:estado ";
                $ca->bindValue(":estado", $p["filters"]["estado"]);
            }
        }
        $table = nwMaker::tableUsersNwMaker() . " a left join nwmaker_perfiles b ON(a.perfil=b.id)";
        $fields = "a.*,CONCAT(a.nombre, ' ', a.apellido) as nombres_apellidos,b.nombre as nombre_perfil";
        $fields .= ", a.fecha_ultima_conexion";
        $fields .= ", a.estado_conexion as estado";
        $fields .= ", (select nombre from sop_secciones where a.sala=id) as sala_text,a.sala";
        $where .= " order by a.fecha_ultima_conexion desc ";
        $where .= nwMaker::paginationLIst($data);
        $ca->prepareSelect($table, $fields, $where);
        $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function closeSessionInApp($p) {
        $p = nwMaker::getData($p);
        return nwMaker::closeSession(true, $p);
    }

    public static function closeSession($log = true, $p = false) {
        $usuario = false;
        if (isset($_SESSION["usuario"])) {
            $usuario = $_SESSION["usuario"];
        }
        if ($p !== false) {
            if (isset($p["usuario"])) {
                $usuario = $p["usuario"];
            }
        }
        if ($usuario !== false) {
            $terminal = nwMaker::getTerminal($p);
            if ($log === true) {
                $data = Array();
                $data["estado"] = "SALIDA";
                $data["usuario"] = $usuario;
                $data["terminal"] = $terminal;
                nwMaker::changeStatusConection($data);
                nwMaker::insertLogUserNwMaker("SALIDA", $data);
            }
            $sessionID = session_id();
            if (isset($p["session_id"])) {
                $sessionID = $p["session_id"];
            }
            if (isset($p["token"])) {
                nwMaker::deleteTokenPush($p);
            }
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareDelete("nwmaker_sessions", "session_id=:session_id and usuario=:usuario");
            $ca->bindValue(":session_id", $sessionID);
            $ca->bindValue(":usuario", $usuario);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $db->commit();
        }
        if (isset($_COOKIE['user_nwmaker'])) {
            unset($_COOKIE['user_nwmaker']);
            setcookie('user_nwmaker', '', time() - 3600);
        }
        if (isset($_COOKIE['marca_nwmaker'])) {
            unset($_COOKIE['marca_nwmaker']);
            setcookie('marca_nwmaker', '', time() - 3600);
        }
        if (!isset($_SESSION)) {
            session_start();
        }
        if (session_id() == "") {
            session_start();
        }
        session_regenerate_id();
        session_destroy();
        // Inicializar la sesión.
// Si está usando session_name("algo"), ¡no lo olvide ahora!
        session_start();
        $_SESSION = array();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
//        Header('Location: ' . $_SERVER['PHP_SELF']);
        return true;
    }

    public static function validateUserMakerById($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id," . nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",email,nombre,apellido", "id=:id and (clave is null or clave='' or clave='0')");
        $ca->bindValue(":id", $p["AuthenticUserNwMaker"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function validateKeyAuthenticUserOnly($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $configLogin = nwprojectOut::nwpMakerLoginConfig();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id," . nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",email,nombre,apellido", "id=:id and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente and (clave is null or clave='' or clave='0')");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario_cliente", $p["usuario_cliente"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }

        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "clave,fecha_actualizacion", "id=:id and " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario_cliente and (clave is null or clave='' or clave='0')");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario_cliente", $p["usuario_cliente"]);
        $ca->bindValue(":clave", nwMaker::encrypt($p["clave"]));
        $ca->bindValue(":fecha_actualizacion", $fecha);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $r = Array();
        $r["usuario"] = $p["usuario_cliente"];
        $r["clave"] = $p["clave"];
        return self::loginStarSession($r);
    }

    public static function validateAuthenticUserOnly($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $configLogin = nwprojectOut::nwpMakerLoginConfig();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id," . nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",email,nombre,apellido", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and (clave is null or clave='' or clave='0')");
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id," . nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",email,nombre,apellido,clave", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $r["send"] = false;
        if ($configLogin["comprobar_via_email_login_user_only"] == "SI") {
            $r["send"] = true;
            $link = "https://" . $_SERVER["HTTP_HOST"] . "/nwlib6/nwproject/modules/nw_user_session/index.php?AuthenticUserNwMaker=" . $r["id"];
            $email = $r["email"];
            $name = $r["nombre"] . " " . $r["apellido"];
            $asunto = "Autenticación de cuenta en " . $_SERVER["HTTP_HOST"];
            $titleEnc = $asunto;
            $textBody = "Para completar de autenticar tu cuenta, por favor sigue el siguiente enlace: <a href='{$link}'>{$link}</a>";
            nw_configuraciones::sendEmail($email, $name, $asunto, $titleEnc, $textBody, false);
            return $r;
        }
        $ra = Array();
        $ra["usuario"] = $p["usuario"];
        $ra["clave"] = $r["clave"];
        $ra["nomd5"] = true;
        $d = self::loginStarSession($ra);
        if ($d === false || $d === "nonexisteusuario") {
            return $d;
        }
//        return $r;
        return $d;
    }

    public static function checkSession() {
        $continue = false;
        if (!isset($_SESSION["usuario"]) && $continue) {
            if (isset($_COOKIE['user_nwmaker']) && isset($_COOKIE['marca_nwmaker'])) {
                if ($_COOKIE['user_nwmaker'] != "" && $_COOKIE['marca_nwmaker'] != "") {
                    $db = NWDatabase::database();
                    $ca = new NWDbQuery($db);
                    $ca->prepareSelect("" . nwMaker::tableUsersNwMaker() . " a 
                                         left join ciudades b ON(a.ciudad=b.id) 
                                         left join terminales c ON(a.terminal=c.id)
                                         "
                            , "a.*,b.nombre as ciudad_text,c.nombre as nom_terminal,c.clave as apikey", "a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and a.cookie=:cookie");
                    $ca->bindValue(":usuario", $_COOKIE['user_nwmaker']);
                    $ca->bindValue(":cookie", $_COOKIE['marca_nwmaker']);
                    if (!$ca->exec()) {
                        print "No se pudo realizar la consulta de la búsqueda. bug: " . $ca->lastErrorText();
                        nwMaker::error($ca->lastErrorText());
                        return false;
                    }
                    if ($ca->size() == 0) {
//                        nwMaker::error("Sesión Inválida", true);
                        NWJSonRpcServer::error("Sesión Inválida");
//                        nwMaker::closeSession();
//                        return "noexiste";
                    }
                    $r = $ca->flush();
                    if (session_id() == "") {
                        session_start();
                    }
                    $_SESSION['id_usuario'] = $r['id'];
                    $_SESSION['usuario'] = $r['usuario_cliente'];
                    $_SESSION['nombre'] = $r['nombre'];
                    $_SESSION['apellido'] = $r['apellido'];
                    $_SESSION['nit'] = $r['nit'];
                    $_SESSION['ciudad'] = $r['ciudad'];
                    $_SESSION['celular'] = $r['celular'];
                    $_SESSION['telefono'] = $r['telefono'];
                    $_SESSION['email'] = $r['email'];
                    if (!isset($_SESSION['direccion'])) {
                        $_SESSION['direccion'] = "";
                    }
                    if (isset($r['celular_validado'])) {
                        $_SESSION['celular_validado'] = $r['celular_validado'];
                    } else {
                        $_SESSION['celular_validado'] = "NO";
                    }
                    if (isset($r['bodega'])) {
                        $_SESSION['bodega'] = $r['bodega'];
                    } else {
                        $_SESSION['bodega'] = "";
                    }
                    if (isset($r['correo_gmail'])) {
                        $_SESSION['correo_gmail'] = $r['correo_gmail'];
                    }
                    if (isset($r['horario_task'])) {
                        $_SESSION['horario_task'] = $r['horario_task'];
                    }
                    if (isset($r['horario_task_almuerzo'])) {
                        $_SESSION['horario_task_almuerzo'] = $r['horario_task_almuerzo'];
                    }
                    if (isset($r['permisos_board'])) {
                        $_SESSION['permisos_board'] = $r['permisos_board'];
                    }
                    $_SESSION['barrio'] = $r['barrio'];
                    $_SESSION['fecha_nacimiento'] = $r['fecha_nacimiento'];
                    $_SESSION['profile'] = $r['perfil'];
                    $_SESSION['perfil'] = $r['perfil'];
                    $_SESSION['autenticado'] = 'SI';
                    $_SESSION['foto'] = $r['foto_perfil'];
                    $_SESSION['foto_perfil'] = $r['foto_perfil'];
                    $_SESSION['foto_portada'] = $r['foto_portada'];
                    $_SESSION['ciudad'] = $r['ciudad'];
                    $_SESSION['ciudad_text'] = $r['ciudad_text'];
                    $_SESSION['departamento'] = $r['departamento'];
                    $_SESSION['pais'] = $r['pais'];
                    $_SESSION['pago_estado'] = $r['pago_estado'];
                    $_SESSION['terminal_principal'] = $r['terminal'];
                    $_SESSION['terminal'] = $r['terminal'];
                    $_SESSION['nom_terminal'] = $r['nom_terminal'];
                    $_SESSION['usuario_principal'] = $r['usuario_principal'];
                    $_SESSION['saldo'] = $r['saldo'];
                    $_SESSION['estado_conexion'] = "conectado";
                    $_SESSION['profesion'] = $r['profesion'];
                    $_SESSION['casa_apto'] = $r['casa_apto'];
                    if (isset($r['show_tutorial'])) {
                        $_SESSION['show_tutorial'] = "SI";
                    } else {
                        $_SESSION['show_tutorial'] = null;
                    }
                    $_SESSION['apikey'] = $r["apikey"];
                    $_SESSION['descripcion'] = $r["descripcion"];
                    $_SESSION['estado'] = $r["estado"];
                    $cou = nwMaker::getCountryByID($r['pais']);
                    if ($cou !== false) {
                        $_SESSION['pais_all_data'] = $cou;
                        $_SESSION['pais'] = $cou["id"];
                        $_SESSION['pais_text'] = $cou["nombre"];
                        if (isset($cou["zona_horaria"])) {
                            $_SESSION['pais_zona_horaria'] = $cou["zona_horaria"];
                        }
                    } else {
                        $_SESSION['pais_all_data'] = "";
                    }

                    $rta = array();
                    $rta["usuario"] = $r["usuario_cliente"];
                    $rta["empresa"] = 1;
                    $rta["nom_empresa"] = 1;
                    include_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/basics/session.php";
                    nw_session::setEmpresa($rta);
                    return $_SESSION;
                } else {
//                    nwMaker::error("Sesión Inválida", true);
                    NWJSonRpcServer::error("Sesión Inválida");
//                    return nwMaker::closeSession();
//                    return false;
                }
            } else {
//                nwMaker::error("Sesión Inválida", true);
                NWJSonRpcServer::error("Sesión Inválida");
//                return nwMaker::closeSession();
//                return false;
            }
        }
//        else {
//            return nwMaker::closeSession();
//        }
        return true;
//        return false;
    }

    private static function createCookieSession() {
        $si = session::info();
        mt_srand(time());
        $rand = nwMaker::random(1000000, 9999999);
        setcookie("user_nwmaker", $_SESSION["usuario"], time() + (60 * 60 * 24 * 365));
        setcookie("marca_nwmaker", $rand, time() + (60 * 60 * 24 * 365));
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "cookie", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":cookie", $rand);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $rand;
    }

    public static function verificarCodeByPhone($p) {
        $p = nwMaker::getData($p);
        $n = self::validateTokenValidaUser($p);
        if ($n !== true) {
            return $n;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $empresa = null;
        $perfil = null;
        $where = " " . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario ";
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
            $where .= " and empresa=:empresa ";
        }
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil ";
        }
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "celular_validado", $where);
        $ca->bindValue(":celular_validado", "SI");
        $ca->bindValue(":celular", $p["celular"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $_SESSION["celular"] = $p["celular"];
        $_SESSION["celular_validado"] = "SI";
        return true;
    }

    public static function sendPhoneVerificarByCode($p) {
        $p = nwMaker::getData($p);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $token = nwMaker::random(111111, 888888);
        $indicativo = false;
        if (isset($p["indicativo"])) {
            if ($p["indicativo"] !== false && $p["indicativo"] !== null && $p["indicativo"] !== "null" && $p["indicativo"] !== "") {
                $indicativo = $p["indicativo"];
            }
        }
        $usuario = $indicativo . $p["celular"];
        $n = self::createVerifyNewAccountByEmail($usuario, $token);
        if ($n !== true) {
            return $n;
        }
        $plantilla = false;
        if (isset($p["empresa"]) && $p["empresa"] != "" && $p["empresa"] !== false && $p["empresa"] !== "null") {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("nwmaker_plantillas_correos", "tipo,asunto,cuerpo_mensaje,enviado_por_correo,enviado_por_nombre", "empresa=:empresa and tipo=:tipo and activo=:activo");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":tipo", 'sendPhoneVerificarByCode');
            $ca->bindValue(":activo", 'SI');
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
                $plantilla = false;
            } else {
                $plantilla = $ca->flush();
            }
        }


        if (isset($p["email"]) && !$plantilla) {
            $asunto = "Código de activación {$_SERVER["HTTP_HOST"]}";
            $mensaje = "";
            $mensaje .= " Estimado usuario<br />";
            $mensaje .= "Su código de activación solicitado por el celular {$usuario} y correo {$p["email"]} para la plataforma {$p["name"]} en {$_SERVER["HTTP_HOST"]} es {$token}";
            $mensaje .= "<br /> Ingrese ahora mismo a {$_SERVER["HTTP_HOST"]} e ingrese su código.";
            $cleanHtml = false;
            $fromName = false;
            $fromEmail = false;
            $send = nw_configuraciones::sendEmail($p["email"], $p["email"], $asunto, $asunto, $mensaje, false, true, $cleanHtml);
            if ($send !== true) {
                return $send;
            }
        } else {
            $correo = master::clean($p["email"]);
            $nombre = master::clean($p["name"]);
            $host = $_SERVER["HTTP_HOST"];
            $fromName = $plantilla["enviado_por_nombre"];
            $fromEmail = $plantilla["enviado_por_correo"];
            $asunto = $plantilla["asunto"];
            $fecha_actual = $fecha;
            $cleanHtml = true;

            $body = $plantilla["cuerpo_mensaje"];
            $body = str_replace("{token}", $token, $body);
            $body = str_replace("{usuario}", $usuario, $body);
            $body = str_replace("{correo}", $correo, $body);
            $body = str_replace("{nombre}", $nombre, $body);
            $body = str_replace("{host}", $host, $body);
            $body = str_replace("{fecha_actual}", $fecha_actual, $body);

            $send = nw_configuraciones::sendEmail($p["email"], $p["email"], $asunto, $asunto, $body, false, true, $cleanHtml, $fromName, $fromEmail);
            if ($send !== true) {
                return $send;
            }
        }
        if ($indicativo === false) {
            return "No hay indicativo";
        }
        //            $user = "GRUPONW";
//            $pass = "Nw729272";
//        $user = nwMaker::getUserSMS();
//        $pass = nwMaker::getPassSMS();
//        $sm = Array();
//        $sm["cel"] = $usuario;
//        $sm["text"] = nwMaker::limpiaTildes($p["name"] . ", el codigo de verificacion es {$token} valido por 5 minutos");
//        $sm["from"] = $user;
//        $sm["user"] = $user;
//        $sm["pass"] = $pass;
//        $sm["url"] = "http://sms.colombiagroup.com.co/Api/rest/message";
//        master::sendSMSByCBG($sm);

        $a = Array();
        $a["celular"] = $usuario;
        $a["send_sms"] = true;
        $a["destinatario"] = $usuario;
        $a["sms_body"] = nwMaker::limpiaTildes($p["name"] . ", el codigo de verificacion es {$token} valido por 5 minutos");
        $a["tipo"] = "smsAcitve";
        $a["fechaAviso"] = $fecha;
        $a["tipoAviso"] = "cliente";
        $a["sendEmail"] = false;
        $a["insertaEnTabla"] = true;
        $a["id_objetivo"] = 1;
        $a["usuario_envia"] = $usuario;
        $a["sendNotifyPush"] = true;
        $a["terminal"] = 1;
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            return $n;
        }


        if (isset($p["empresa"])) {
            $a = Array();
            $a["empresa"] = $p["empresa"];
            if (isset($p["perfil"])) {
                $a["perfil"] = $p["perfil"];
            }
            $a["celular"] = $usuario;
            $a["tipo"] = "activar_usuario_por_code";
            $a["description"] = "Envío de SMS para activación de cuenta, envío de código";
            nwMaker::validaDescargaSaldoSmsByEmpresa($a);
        }
        return true;
    }

    public static function createVerifyNewAccountByEmail($usuario, $token) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nwmaker_resetpass", "token,usuario,usado,fecha,tipo");
        $ca->bindValue(":token", $token);
        $ca->bindValue(":usuario", $usuario, true, true);
        $ca->bindValue(":usado", "NO");
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":tipo", "verify");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function validateTokenValidaUser($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $tipo = "verify";
        if (isset($p["tipo"])) {
            $tipo = $p["tipo"];
        }
        $use = false;
        if (isset($p["use"])) {
            $use = $p["use"];
        }
        $fecha = nwMaker::sumaRestaFechas("+0 hour", "-5 minute", "+0 second");
        $ca->prepareSelect("nwmaker_resetpass", "id", "token=:token and usuario=:usuario and usado='NO' and tipo=:tipo and fecha>=:fecha order by id desc limit 1");
        $ca->bindValue(":token", $p["token"], true, true);
        $ca->bindValue(":usuario", $p["user"], true, true);
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":fecha", $fecha);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        if ($use === true || $use === "true" || $use === "SI") {
            $r = $ca->flush();
            $ca->prepareUpdate("nwmaker_resetpass", "usado", "id=:id");
            $ca->bindValue(":id", $r["id"]);
            $ca->bindValue(":usado", "SI");
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
        }
        $asunto = "Nueva activación por SMS en {$_SERVER["HTTP_HOST"]}";
        $mensaje = "Nuevo usuario {$p["user"]} activo por mensaje de texto con el celular {$p["user"]} en {$_SERVER["HTTP_HOST"]}";
        if (isset($p["name"])) {
            $mensaje .= " en el programa {$p["name"]}";
        }
        $cleanHtml = false;
        $fromName = false;
        $fromEmail = false;
        nw_configuraciones::sendEmail("orionjafe@gmail.com", "orionjafe@gmail.com", $asunto, $asunto, $mensaje, false, true, $cleanHtml, $fromName, $fromEmail);
        nw_configuraciones::sendEmail("direccion@netwoods.net", "direccion@netwoods.net", $asunto, $asunto, $mensaje, false, true, $cleanHtml, $fromName, $fromEmail);
        return true;
    }

    public static function verifyNewAccountByEmail($usuario, $token, $clave) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $configLogin = nwprojectOut::nwpMakerLoginConfig();
        $ca->prepareSelect("nwmaker_resetpass", "*", "token=:token and usuario=:usuario and usado='NO' and tipo='verify'");
        $ca->bindValue(":token", $token);
        $ca->bindValue(":usuario", $usuario, true, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        if (isset($configLogin["no_usar_clave"])) {
            if ($configLogin["no_usar_clave"] === "SI" || $configLogin["no_usar_clave"] === "true" || $configLogin["no_usar_clave"] === true) {
                $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "clave", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:user and estado='preregistrado'");
                $ca->bindValue(":user", $usuario);
                $ca->bindValue(":clave", $clave);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
            }
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "estado", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:user and clave=:clave and estado='preregistrado'");
        $ca->bindValue(":user", $usuario);
        $ca->bindValue(":clave", $clave);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "estado", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:user and clave=:clave");
        $ca->bindValue(":estado", "activo");
        $ca->bindValue(":user", $usuario);
        $ca->bindValue(":clave", $clave);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $ca->prepareUpdate("nwmaker_resetpass", "usado", "token=:token and usuario=:usuario and usado='NO' and tipo='verify'");
        $ca->bindValue(":usado", "SI");
        $ca->bindValue(":token", $token, true, true);
        $ca->bindValue(":usuario", $usuario, true, true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function createUserProduct($p) {
        $send = Array();
//        $send["product_id"] = $pr;
        $send["plan"] = "1";
        $send["usuario"] = $p["email"];
        $send["nombres"] = $p["nombre"];
        $send["apellidos"] = $p["apellido"];
        if (isset($p["clave_registro"])) {
            $send["clave"] = $p["clave_registro"];
        } else
        if (isset($p["clave"])) {
            $send["clave"] = $p["clave"];
        } else {
            return false;
        }
        $send["correo"] = $p["email"];
        $send["usuario_principal"] = $p["email"];
        $send["usuario_principal_email"] = $p["email"];
        $send["usuario_principal_nombre"] = $p["nombre"] . " " . $p["apellido"];
        $send["usuario_principal_nombre_contacto"] = $p["nombre"] . " " . $p["apellido"];
        $send["usuario_principal_telefono_contacto"] = "78789";
        $send["usuario_principal_nit"] = "0";
        $send["usuario_principal_nom_pais"] = "CO";

        $yep = master::callProductsAPI($send, "createUsuarios");
//        $yep = master::callProducts($send, "createUsuarios");
        return $yep;
    }

    public static function getDataProductUserNoServer($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $code = false;
        if (isset($p["account_code_activation"])) {
            $code = $p["account_code_activation"];
        }
        if (isset($p["usuario"])) {
            $code = $p["usuario"];
        }
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "account_date_expiration as fecha_expiracion,estado, id as cliente", "account_code_activation=:account_code_activation or usuario=:account_code_activation");
        $ca->bindValue(":account_code_activation", $code, true, true);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function getEstadoUserProducto($p) {
        $p = nwMaker::getData($p);
        if (!isset($p["account_code_activation"])) {
            return true;
        }
        $codigo_activacion = $p["account_code_activation"];
        $config = nwprojectOut::nwpMakerConfig();
        $connecToServer = true;
        if (isset($config["productnw_connect_to_server"])) {
            if ($config["productnw_connect_to_server"] === false) {
                $connecToServer = false;
            }
        }
        $rta = Array();
        if (isset($config["productnw"]) && isset($config["product_id"])) {
            if ($config["productnw"] === "true" || $config["productnw"] === true || $config["productnw"] === "SI") {
                if ($connecToServer === true) {
                    if ($codigo_activacion === "NO_HAVE") {
                        self::closeSession();
                        return "NO TIENE USUARIO ACTIVO EN NUESTRA CENTRAL";
                    }
                    $send = Array();
                    $send["product_id"] = $config["product_id"];
                    $send["codigo_activacion"] = $codigo_activacion;
                    $serv = master::callProductsAPI($send, "getEstado");
                    if ($serv === "product_usuario_no_exist") {
                        return $serv;
                    }
                    $rta = $serv;
//                    $rta = json_decode($serv, true);
                } else {
                    $rta = nwMaker::getDataProductUserNoServer($p);
                    if ($rta === false || !isset($rta["estado"])) {
                        return $rta;
                    }
                }
                if (isset($rta["estado"])) {
                    $_SESSION["estado_producto_cliente"] = $rta["estado"];
                }
                if (isset($rta["cliente"])) {
                    $_SESSION["id_cliente_product"] = $rta["cliente"];
                }
                if (isset($rta["cliente"])) {
                    $_SESSION["account_code_activation"] = $rta["cliente"];
                }
                if (isset($rta["fecha_expiracion"])) {
                    $_SESSION["account_date_expiration"] = $rta["fecha_expiracion"];
                }
                if (isset($rta["fecha_expiracion"])) {
                    $_SESSION["fecha_final_product"] = $rta["fecha_expiracion"];
                }
                if ($connecToServer === true) {
                    if (isset($rta["fecha"])) {
                        $_SESSION["fecha_inicio_mes_producto"] = $rta["fecha"];
                    }
                    if (isset($rta["id_plan"])) {
                        $_SESSION["id_plan"] = $rta["id_plan"];
                    }
                }
//                $date1 = new DateTime($rta["fecha"]);
                $date1 = new DateTime(date("Y-m-d H:i:s"));
                if (isset($rta["fecha_expiracion"])) {
                    $date2 = new DateTime($rta["fecha_expiracion"]);
                    $diff = $date1->diff($date2);
                    $fdias = $diff->format('%R%a');
                    $fdias = str_replace("+", "", $fdias);
                    $_SESSION["dias_prueba"] = $fdias;
                }
                if (isset($rta["fecha_expiracion"])) {
                    if ($rta["fecha_expiracion"] < date("Y-m-d H:i:s")) {
                        if ($rta["estado"] === "DEMO") {
                            $_SESSION["status_account"] = "DEMO_HAS_EXPIRE";
                        } else {
                            $_SESSION["status_account"] = "ACCOUNT_HAS_EXPIRE";
                        }
                    } else {
                        $_SESSION["status_account"] = "ACTIVE";
                    }
                }
                return true;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    public static function updateSaldoStateUser($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        $config = nwprojectOut::nwpMakerConfig();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $date = nwMaker::sumaRestaFechas("+720 hour", "+0 minute", "+0 second");
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "account_date_expiration,saldo,plan", "usuario=:usuario");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":account_date_expiration", $date);
        $ca->bindValue(":saldo", $p["price"]);
        $ca->bindValue(":plan", $p["plan"]);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        $ca->prepareUpdate("terminales", "plan", "id=:terminal");
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":plan", $p["plan"]);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        /*
          $send = Array();
          $send["product_id"] = $config["product_id"];
          $send["plan"] = $p["plan"];
          $send["usuario_id"] = $_SESSION["usuario"];
          $send["usuario"] = $_SESSION["account_code_activation"];
          $send["usuario_principal"] = $_SESSION["usuario_principal"];
          $yep = master::callProducts($send, "activeUser");
         */
        $_SESSION["status_account"] = "ACTIVE";
        $_SESSION["account_date_expiration"] = $date;
        $db->commit();
        return true;
    }

    public static function payMentsProducts($p) {
        $p = nwMaker::getData($p);
        $p["cliente"] = $_SESSION["account_code_activation"];

        $s = Array();
        $s["id_tarjeta"] = null;
        if (isset($p["id_tarjeta"])) {
            $s["id_tarjeta"] = $p["id_tarjeta"];
        }
        $s["numero_tarjeta"] = $p["numero_tarjeta"];
        $s["codigo_seguridad"] = $p["codigo_seguridad"];
        $s["fecha_vencimiento"] = $p["fecha_vencimiento"];
        $s["cliente"] = $p["cliente"];
        $s["nombre_tarjeta"] = $p["nombre_tarjeta"];
        $s["documento"] = $p["documento"];
        $s["nombre_banco"] = $p["nombre_banco"];
        $s["product_id"] = $p["product_id"];
        $s["id_plan"] = $p["id_plan"];
        $s["price"] = $p["price"];
        $yep = master::callProducts($s, "payMents");
        return $yep;
    }

    public static function populateCreditsCards() {
        $r = Array();
        $r["cliente"] = $_SESSION["account_code_activation"];
        $yep = master::callProducts($r, "getCreditsCards");
        return $yep;
    }

    public static function getPlansProducts($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $mode = false;
        if (isset($p["mode"])) {
            $mode = $p["mode"];
        }
        if ($mode !== false && $mode !== "onlyshow" && $mode !== "NEW") {
            if ($mode !== false && $mode !== "onlyshow" && !isset($si["usuario_principal"]) || $si["usuario_principal"] === null || $si["usuario_principal"] === false || $si["usuario_principal"] === "") {
                return "notienecliente";
            }
            $db = NWDatabase::database();
            $db->transaction();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "account_code_activation", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
            $ca->bindValue(":usuario", $si["usuario_principal"]);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() === 0) {
                return "notienecliente";
            }
            $s = $ca->flush();
        }

        $send = Array();
        $send["product_id"] = $p["product_id"];
        if (isset($s["account_code_activation"])) {
            $send["cliente"] = $s["account_code_activation"];
        }
        $send["pais"] = $p["pais"];
        $yep = master::callProducts($send, "getPlanes");
        $yap = master::callProducts($send, "getPriceByCostumer");
        $rta = json_decode($yep, true);
        $rta2 = json_decode($yap, true);
        $res = Array();
        $res["plans"] = $rta;
        $res["prices"] = $rta2;
        return $res;
    }

    public static function crearCuentaAPI($p, $pr = false) {//Antiguo consumeServiceLady
//        public static function consumeServiceLady($p, $pr = false) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        if ($pr === false) {
            $pr = 8;
        }
        $nombre = "";
        $apellido = "";
        $celular = "";
        $pais = "";
        $pais_text = "";
        if (isset($p["nombre"])) {
            $nombre = $p["nombre"];
        }
        if (isset($p["apellido"])) {
            $apellido = $p["apellido"];
        }
        if (isset($p["celular"])) {
            $celular = $p["celular"];
        }
        if (isset($p["pais"])) {
            $pais = $p["pais"];
        }
        if (isset($p["pais_all_data"]["nombre"])) {
            $pais_text = $p["pais_all_data"]["nombre"];
        }
        $send = Array();
        $send["product_id"] = $pr;
        $send["plan"] = "1";
        $send["usuario"] = $p["email"];
        $send["nombres"] = $nombre;
        $send["apellidos"] = $apellido;
        $send["pais"] = $pais;
        $send["pais_text"] = $pais_text;
        $send["celular"] = $celular;
        if (isset($p["clave_registro"])) {
            $send["clave"] = $p["clave_registro"];
        } else
        if (isset($p["clave"])) {
            $send["clave"] = $p["clave"];
        } else {
            return false;
        }
        $send["correo"] = $p["email"];
        $send["usuario_principal"] = $p["email_principal"];
        $send["usuario_principal_email"] = $p["email_principal"];
        $send["usuario_principal_nombre"] = $nombre . " " . $apellido;
        $send["usuario_principal_nombre_contacto"] = $nombre . " " . $apellido;
        $send["usuario_principal_telefono_contacto"] = "78789";
        $send["usuario_principal_nit"] = "0";
        if (isset($p["pais_all_data"]["alias"])) {
            $send["usuario_principal_nom_pais"] = $p["pais_all_data"]["alias"];
        } else {
            $send["usuario_principal_nom_pais"] = "CO";
        }
        $yep = master::callProductsAPI($send, "getUsuarios");
//        print_r($yep);
        return $yep;
    }

    public static function verifyCodeUserProduct($p) {
        $config = nwprojectOut::nwpMakerConfig();
        if (isset($config["productnw"]) && isset($config["product_id"])) {
            if ($config["productnw"] === "true" || $config["productnw"] === true || $config["productnw"] === "SI") {
                nwMaker::checkSession();
                $p = nwMaker::getData($p);
                $rta = nwMaker::crearCuentaAPI($p, $config["product_id"]);
//                print_r($rta);
//                return false;
//                $rta = json_decode($serv, true);
                $db = NWDatabase::database();
                $db->transaction();
                $ca = new NWDbQuery($db);
                $cons = $rta["codigo_activacion"];
                $date = $rta["fecha_expiracion"];
                $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "account_code_activation,account_date_expiration", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
                $ca->bindValue(":account_code_activation", $cons);
                $ca->bindValue(":account_date_expiration", $date);
                $ca->bindValue(":usuario", $p["usuario"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    return nwMaker::error($ca->lastErrorText());
                }
                $a = Array();
                $a["account_code_activation"] = $cons;
                $a["usuario"] = $p["usuario"];
                $coco = self::getEstadoUserProducto($a);
                if ($coco !== true) {
                    $db->rollback();
                    return $coco;
                }
                $db->commit();
                return true;
            }
            return true;
        }
        return true;
    }

    public static function saveFBDataUser($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nwmaker_users_info_aditional", "usuario,type_register,id_relation_user_extern,fecha");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":type_register", $p["type_register"]);
        $ca->bindValue(":id_relation_user_extern", $p["id_relation_user_extern"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        if (isset($p["picture"])) {
            $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), nwMaker::fieldsUsersNwMaker("foto_perfil"), nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("foto_perfil"), $p["picture"]);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
            $_SESSION['foto'] = $p["picture"];
        }
        $db->commit();
        return true;
    }

    public static function validaUserFBCreate($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $perfil = null;
        $empresa = null;
        $code = "-nwp5";
        $clave = $p["id"] . $code;
        $where = nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario ";
//        $where .= " and clave=:clave";
        if (isset($p["perfil"])) {
            $where .= " and perfil=:perfil";
            $perfil = $p["perfil"];
        }
        if (isset($p["empresa"])) {
            $where .= " and empresa=:empresa";
            $empresa = $p["empresa"];
        }

        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "id", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":clave", nwMaker::encrypt($clave));
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        //existe y se va a autenticar
        if ($ca->size() > 0) {
            $r = $ca->flush();
            $t = Array();
            $t["usuario"] = $p["usuario"];
            $t["clave"] = $clave;
            $t["perfil_send"] = $perfil;
            $t["pedir_empresa"] = $empresa;
            return nwMaker::loginStarSession($t, false);
        }
        if ($p["showcreate"] === "true" || $p["showcreate"] === true) {
            return "noexisteuser";
        }
        //no existe y va a crear y autenticar
        $p["clave_registro"] = $clave;
        return nwMaker::createAccount($p);
    }

    public static function createAccount($data) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $db->transaction();
        $p = nwMaker::getData($data);
        $p_origin = nwMaker::getData($data);
        $config = nwprojectOut::nwpMakerConfig();
        $configLogin = $config["config_login"];

        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }

        if (isset($p["terminal"])) {
            $configLogin["id_nueva_terminal"] = $p["terminal"];
        }

        $token = "";
        $email = master::clean($p["email"]);
        $usuario = $email;
        $pais_all_data = "";
        $visitor = null;
        $code_referido = null;
        if (isset($p_origin["code_referido"])) {
            $code_referido = $p_origin["code_referido"];
        }
        if (isset($p_origin["visitor"])) {
            $visitor = $p_origin["visitor"];
        }
        $name_app = null;
        if (isset($config["alias"])) {
            $name_app = $config["alias"];
        }
        if (isset($p_origin["name_app"])) {
            $name_app = $p_origin["name_app"];
        }
        if (isset($p["pais_all_data"])) {
            $pais_all_data = $p["pais_all_data"];
        } else
        if (isset($p["pais_model_selected"])) {
            $pais_all_data = $p["pais_model_selected"];
        }
        $productnw = false;
        if (isset($config["productnw"])) {
            $productnw = $config["productnw"];
        }
        if (isset($p_origin["productnw"])) {
            $productnw = $p_origin["productnw"];
        }
        $product_id = false;
        if (isset($config["product_id"])) {
            $product_id = $config["product_id"];
        }
        if (isset($p_origin["product_id"])) {
            $product_id = $p_origin["product_id"];
        }
        $dominio = "";
        if (isset($p_origin["dominio"])) {
            $dominio = $p_origin["dominio"];
        }
        $url = "";
        if (isset($p_origin["url"])) {
            $url = $p_origin["url"];
        }
        $tipo = "";
        if (isset($p_origin["tipo"])) {
            $tipo = $p_origin["tipo"];
        }
        $pathname = "";
        if (isset($p_origin["pathname"])) {
            $pathname = $p_origin["pathname"];
        }
        $hash = "";
        if (isset($p_origin["hash"])) {
            $hash = $p_origin["hash"];
        }
        $search = false;
        if (isset($p_origin["search"])) {
            $search = $p_origin["search"];
        }
        $nombre = "";
        if (isset($p["nombre"])) {
            $nombre = master::clean($p["nombre"]);
        }
        $apellido = "";
        if (isset($p["apellido"])) {
            $apellido = master::clean($p["apellido"]);
        }
        $clave = null;
        if (isset($p["clave_registro"]) && $p["clave_registro"] !== null && $p["clave_registro"] !== "") {
            $clave = master::clean($p["clave_registro"]);
        }
        $tipo_creacion = false;
        if (isset($p["tipo_creacion"])) {
            $tipo_creacion = master::clean($p["tipo_creacion"]);
        }
        $create_session = false;
        if (isset($p["create_session_registro"])) {
            $create_session = true;
        }
        $timezone = false;
        if (isset($p["timezone"])) {
            $timezone = $p["timezone"];
        }
        $pedir_empresa = "";
        if (isset($p["pedir_empresa"])) {
            $pedir_empresa = $p["pedir_empresa"];
        }
        $picture_fb = false;
        $id_fb = false;
        if (isset($p["id_fb"])) {
            if ($p["id_fb"] !== null && $p["id_fb"] !== false && $p["id_fb"] !== "") {
                $id_fb = $p["id_fb"];
                if ($p["picture_fb"] !== null && $p["picture_fb"] !== false && $p["picture_fb"] !== "") {
                    $picture_fb = $p["picture_fb"];
                }
            }
        }
        $direccion = "";
        if (isset($p["direccion"])) {
            $direccion = master::clean($p["direccion"]);
        }
        $pais = "";
        if (isset($p["pais"])) {
            $pais = master::clean($p["pais"]);
        }
        $pais_text = "";
        if (isset($p["pais_text"])) {
            $pais_text = master::clean($p["pais_text"]);
        }
        $departamento_geo = "";
        if (isset($p["departamento"])) {
            $departamento_geo = master::clean($p["departamento"]);
        }
        $departamento_geo_text = "";
        if (isset($p["departamento_text"])) {
            $departamento_geo_text = master::clean($p["departamento_text"]);
        }
        $ciudad = "";
        if (isset($p["ciudad"])) {
            $ciudad = master::clean($p["ciudad"]);
        }
        $city_text = "";
        if (isset($p["ciudad_text"])) {
            $city_text = master::clean($p["ciudad_text"]);
        }
        $documento = "";
        if (isset($p["nit"])) {
            $documento = master::clean($p["nit"]);
        }
        $celular = null;
        if (isset($p["celular"])) {
            $celular = master::clean($p["celular"]);
        }
        $fecha_nacimiento = "";
        if (isset($p["fecha_nacimiento"])) {
            $fecha_nacimiento = master::clean($p["fecha_nacimiento"]);
        }
        $codigo_promocional = "";
        if (isset($p["codigo_promocional"])) {
            $codigo_promocional = master::clean($p["codigo_promocional"]);
        }
        $genero = "";
        if (isset($p["genero"])) {
            $genero = master::clean($p["genero"]);
        }
        $profesion = null;
        if (isset($p["profesion"])) {
            $profesion = master::clean($p["profesion"]);
        }
        $forma_pago = null;
        if (isset($p["forma_pago"])) {
            $forma_pago = master::clean($p["forma_pago"]);
        }
        $observaciones = null;
        if (isset($p["observaciones"])) {
            $observaciones = master::clean($p["observaciones"]);
        }
        $foto_perfil = false;
        if (isset($p["foto_perfil"])) {
            $foto_perfil = master::clean($p["foto_perfil"]);
        }
        $perfil_send = false;
        if (isset($p["perfil_send"])) {
            if ($p["perfil_send"] !== null && $p["perfil_send"] !== false && $p["perfil_send"] !== "") {
                $perfil_send = master::clean($p["perfil_send"]);
            }
        }
        if (isset($p["perfil_crea_cuenta"])) {
            if ($p["perfil_crea_cuenta"] !== null && $p["perfil_crea_cuenta"] !== false && $p["perfil_crea_cuenta"] !== "") {
                $perfil_send = master::clean($p["perfil_crea_cuenta"]);
            }
        }
        $plan = 1;
        if (isset($p["plan"])) {
            $plan = master::clean($p["plan"]);
        }
        $session_id = false;
        if (isset($p["session_id"])) {
            $session_id = master::clean($p["session_id"]);
        }
        $host = $_SERVER["HTTP_HOST"];
        if (isset($p["host"])) {
            $host = master::clean($p["host"]);
        }

        $page = master::clean($p["page"]);
        $table = nwMaker::tableUsersNwMaker();
        $estado = "activo";
        if (isset($p["estado"])) {
            $estado = $p["estado"];
        }
        if (isset($configLogin["estado_registro"])) {
            $estado = $configLogin["estado_registro"];
        }
        $tipo_login = $configLogin["tipo_login"];
        if (isset($configLogin["tipo_login_app"]) && nwMaker::getDispositivo() !== "pc_desktop") {
            $tipo_login = $configLogin["tipo_login_app"];
        }
        if ($tipo_login == "qxnw") {
            if (isset($configLogin["id_empresa_de_nuevas_cuentas"]) && $configLogin["id_empresa_de_nuevas_cuentas"] != false) {
                $id_empresa = $configLogin["id_empresa_de_nuevas_cuentas"];
            } else {
                if ($pedir_empresa !== "") {
                    $id_empresa = $pedir_empresa;
                } else {
                    $id_empresa = master::getNextSequence("empresas_id_seq", $db);
                    $f = "id,razon_social,nit,email,direccion,telefono,slogan";
                    if ($ciudad !== "") {
                        $f .= ",ciudad";
                    }
                    $ca->prepareInsert("empresas", $f);
                    $ca->bindValue(":id", $id_empresa);
                    $ca->bindValue(":razon_social", $usuario);
                    $ca->bindValue(":nit", $documento, true, true);
                    $ca->bindValue(":email", $usuario);
                    $ca->bindValue(":ciudad", $ciudad, true, true);
                    $ca->bindValue(":direccion", $direccion, true, true);
                    $ca->bindValue(":telefono", $celular, true, true);
                    $ca->bindValue(":slogan", "1");
                    if (!$ca->exec()) {
                        $db->rollback();
                        return nwMaker::error($ca->lastErrorText());
                    }
                }
            }
            $_SESSION['empresa_logo'] = "";
            $_SESSION["empresa"] = $id_empresa;
            $_SESSION["nom_empresa"] = $usuario;

            if (isset($configLogin["id_nueva_terminal"]) && $configLogin["id_nueva_terminal"] != false) {
                $id_terminal = $configLogin["id_nueva_terminal"];
                $ca->prepareSelect("terminales", "*", "id=:id");
                $ca->bindValue(":id", $id_terminal);
                if (!$ca->exec()) {
                    $db->rollback();
                    return nwMaker::error($ca->lastErrorText());
                }
                $term = $ca->flush();
                $apikey = $term["clave"];
            } else {
                $apikey = nwMaker::random(1000000000, 9999999999999);
                $id_terminal = master::getNextSequence("terminales_id_seq");
                $ca->prepareInsert("terminales", "id,nombre,ciudad,usuario,fecha,plan,activo, host,empresa,clave,pais");
                $ca->bindValue(":id", $id_terminal);
                $ca->bindValue(":nombre", $email);
                $ca->bindValue(":usuario", $usuario);
                $ca->bindValue(":fecha", $fecha);
                $ca->bindValue(":ciudad", $ciudad, true, true);
                $ca->bindValue(":plan", $plan);
                $ca->bindValue(":activo", "SI");
                $ca->bindValue(":host", $host);
                $ca->bindValue(":empresa", $id_empresa);
                $ca->bindValue(":clave", $apikey);
                $ca->bindValue(":pais", $pais, true, true);
                if (!$ca->exec()) {
                    $db->rollback();
                    return nwMaker::error($ca->lastErrorText());
                }
            }
            $perfil = "1";
            if ($perfil_send !== false) {
                $perfil = $perfil_send;
            }
            $terminal = $id_terminal;
            $empresa = $id_empresa;

            $detail = array();
            $detail["id"] = $empresa;
            $detail["perfil"]["id"] = $perfil;
            $detail["terminal"]["id"] = $terminal;
            $detail["pertenece"] = true;

            $p = array();
            $p["id"] = "";
            $p["usuario"] = $usuario;
            $p["usuario_principal"] = $usuario;
            $p["email_principal"] = $usuario;
            $p["celular"] = $celular;
            $p["email"] = $email;
            $p["nombre"] = $nombre;
            $p["apellido"] = $apellido;
            $p["clave"] = $clave;
            $p["fecha_nacimiento"] = $fecha;
            $p["cliente"] = "TODOS";
//            $documento = $documento;
//            if (isset($p["nit"])) {
//                $documento = master::clean($p["nit"]);
//            }
            $p["documento"] = $documento;
            $p["terminal"] = $terminal;
            $p["perfil"] = $perfil;
            $p["estado"] = $estado;
            $p["foto"] = "";
            $p["ver_chat"] = "SI";
            $p["nwmaker"] = "SI";
            $p["create"] = "create";
            $p["empresa"] = $empresa;
            $p["detail"][0] = $detail;
            if ($pais !== "")
                $p["pais"] = $pais;
            if ($ciudad !== "")
                $p["ciudad"] = $ciudad;
            if ($tipo_creacion !== false)
                $p["tipo_creacion"] = $tipo_creacion;
            if ($foto_perfil !== false)
                $p["foto"] = $foto_perfil;
            $p["pais_all_data"] = $pais_all_data;
//            print_r($p);
//            return;
            $rta = nw_usuarios::save($p);
            if ($rta) {
                $pa = array();
                $pa["usuario"] = $usuario;
                $pa["clave"] = nwMaker::encrypt($clave);
                $pa["empresa"] = $empresa;
                $pa["nom_empresa"] = $usuario;
                if (isset($p["estado"])) {
                    $pa["estado"] = $p["estado"];
                }

                $_SESSION['usuario_principal'] = $usuario;
                $_SESSION['pais_all_data'] = $pais_all_data;
                $_SESSION['apikey'] = $apikey;

                $pass = nw_session::consulta($pa);
                $emp = nw_session::setEmpresa($pa);

                $pol = self::validatePolitics($p_origin);
                if ($pol !== true) {
                    $db->rollback();
                    return $pol;
                }

                $ca->prepareUpdate($table, "pais,fecha_ultima_conexion,estado_conexion,celular", "usuario=:usuario");
                $ca->bindValue(":celular", $celular);
                $ca->bindValue(":usuario", $usuario);
                $ca->bindValue(":pais", $pais, true, true);
                $ca->bindValue(":fecha_ultima_conexion", $fecha);
                $ca->bindValue(":estado_conexion", "conectado");
                if (!$ca->exec()) {
                    $db->rollback();
                    return nwMaker::error($ca->lastErrorText());
                }
                $_SESSION['pais'] = $pais;
                $_SESSION['pais_text'] = $pais_text;
                $_SESSION['foto'] = $foto_perfil;
                $_SESSION['foto_perfil'] = $foto_perfil;

                if ($emp != true) {
                    $db->rollback();
                    return $emp;
                }
                $nwp = nwMaker::verifyCodeUserProduct($p);
                if ($nwp !== true) {
                    $db->rollback();
                    return $nwp;
                }

                if ($productnw != false && $product_id != false) {
                    if ($productnw == "true" || $productnw == true || $productnw == "SI") {
                        $c = Array();
                        $c["nombre"] = $nombre . " " . $apellido;
                        $c["telefono"] = $celular;
                        $c["correo"] = $email;
                        $c["observaciones"] = "Creación de cuenta";
                        $c["dominio"] = $dominio;
                        $c["url"] = $url;
                        $c["tipo"] = $tipo;
                        $c["pathname"] = $pathname;
                        $c["hash"] = $hash;
                        if ($search !== false)
                            $c["search"] = $search;
                        $c["name_app"] = $name_app;
                        if (isset($pais) && $pais != "") {
                            $c["pais"] = $pais;
                            $c["pais_text"] = $pais_text;
                        } else {
                            if (isset($p_origin["pais_all_data"])) {
                                $c["pais"] = $p_origin["pais_all_data"]["nombre"];
                            } else {
                                $c["pais"] = "COL";
                            }
                        }
//                        print_r($c);
                        $cws = self::wsClientesNw($c);
                        if ($cws !== "OK") {
                            $db->rollback();
                            return $cws;
                        }
                    }
                }

                $_SESSION['estado'] = $estado;
                $pass['estado'] = $estado;

                $_SESSION['estado_conexion'] = "conectado";
                $pass['estado_conexion'] = "conectado";

                $_SESSION['empresa'] = $empresa;
                $pass["empresa"] = $empresa;

                $_SESSION['celular'] = $celular;
                $pass["celular"] = $celular;

                $_SESSION['perfil'] = $perfil;
                $pass["perfil"] = $perfil;
                $pass["bodega"] = "";

                $_SESSION['id_usuario'] = $pass["id"];
                $pass['id_usuario'] = $pass["id"];

                if ($timezone !== false) {
                    $_SESSION['timezone'] = $timezone;
                    $pass["timezone"] = $timezone;
                }

                if ($pass != false) {
//                    $db->rollback();
//                    return $pass;
                }
                if ($id_fb !== false) {
                    $fa = Array();
                    $fa["usuario"] = $usuario;
                    $fa["type_register"] = "facebook";
                    $fa["id_relation_user_extern"] = $id_fb;
                    if ($picture_fb !== false) {
                        $fa["picture"] = $picture_fb;
                    }
                    $ff = nwMaker::saveFBDataUser($fa);
                    if ($ff !== true) {
                        $db->rollback();
                        return $ff;
                    }
                }
                //verifica si verifica correo por email
                if ($id_fb === false) {
                    if (isset($configLogin["verificar_email_via_correo"])) {
                        if ($configLogin["verificar_email_via_correo"] == "SI") {
                            $token = nwMaker::random(1000000000, 8888888888);
                            $veri = self::createVerifyNewAccountByEmail($usuario, $token);
                            if (!$veri) {
                                nwMaker::error("Error al crear usuario pre-registrado. " . $veri, true);
                                return "Error al crear usuario pre-registrado. " . $veri;
                            }
                            $ca->prepareUpdate("usuarios", "estado", "usuario=:usuario");
                            $ca->bindValue(":usuario", $usuario);
                            $ca->bindValue(":estado", "preregistrado");
                            if (!$ca->exec()) {
                                $db->rollback();
                                return nwMaker::error($ca->lastErrorText());
                            }
                            nwMaker::closeSession();
                            $estado = "preregistrado";
                        }
                    }
                }

                $configLogin["nombre"] = $nombre;
                $configLogin["apellido"] = $apellido;
                $configLogin["email"] = $email;
                $configLogin["clave"] = $clave;
                $configLogin["usuario"] = $usuario;
                $configLogin["estado"] = $estado;
                $configLogin["token"] = $token;
                $fo = self::saveFormasPago($p_origin);
                if ($fo != true) {
                    $db->rollback();
                    return $fo;
                }

                nwMaker::insertLogUserNwMaker("ENTRADA");

                $m = Array();
                $m["terminal"] = $terminal;
                $m["usuario"] = $usuario;
                $m["empresa"] = $empresa;
                $m["perfil"] = $perfil;
                $m["visitor"] = $visitor;
                $lin = nwMaker::insertLoginLineTime($m);
                if ($lin !== true) {
                    return $lin;
                }

//                self::sendEmailRegister($configLogin);

                $db->commit();
                if ($estado === "activo" || $estado === "registrado_sin_validacion") {
                    return $pass;
                }
                return $estado;
            } else {
                return $rta;
            }
        }

        $where = "usuario_cliente=:usuario";
        if (isset($p["nit"])) {
//            $where .= " or nit=:nit";
        }
        $whereIn = "";
        $pedir_empresa = null;
        if (isset($p["pedir_empresa"])) {
            if ($p["pedir_empresa"] !== null && $p["pedir_empresa"] !== false && $p["pedir_empresa"] !== "") {
                $pedir_empresa = $p["pedir_empresa"];
                $whereIn .= " and empresa=:pedir_empresa";
                $where .= " and empresa=:pedir_empresa";
            }
        }
        if ($perfil_send !== false) {
            $whereIn .= " and perfil=:perfil";
            $where .= " and perfil=:perfil";
        }
        $whnit = "";
        if ($documento !== "") {
            $whnit = " or nit=:nit {$whereIn} ";
            $where = "1=1 and (usuario_cliente=:usuario {$whereIn} or nit=:nit {$whereIn})";
        }
        if ($celular !== null) {
            $where = "1=1 and (usuario_cliente=:usuario {$whereIn} or celular=:celular {$whereIn} {$whnit})";
        }
        $empresaTerminal = $pedir_empresa;
        if ($pedir_empresa === null) {
            $empresaTerminal = master::getNextSequence("empresas_id_seq");
        }
        $cg = new NWDbQuery($db);
        $cg->prepareSelect($table, "id,usuario_cliente,nit,terminal,usuario_principal,clave", $where);
        $cg->bindValue(":usuario", $email, true);
        $cg->bindValue(":usuario_principal", $email, true);
        $cg->bindValue(":nit", $documento, true);
        $cg->bindValue(":pedir_empresa", $empresaTerminal, true);
        $cg->bindValue(":perfil", $perfil_send, true);
        $cg->bindValue(":celular", $celular, true);

        if (!$cg->exec()) {
            $db->rollback();
            return nwMaker::error($cg->lastErrorText());
        }

        $yaexiste = false;
        if ($cg->size() > 0) {
            $cag = $cg->flush();
            if (isset($configLogin["no_usar_clave"])) {
                if ($configLogin["no_usar_clave"] === "SI" || $configLogin["no_usar_clave"] === "si" || $configLogin["no_usar_clave"] === true) {
                    $yaexiste = true;
                }
            }
            if (isset($_SESSION["usuario"]) && $clave === null) {
                $yaexiste = true;
            }
            if (isset($configLogin["loguear_alcrear_siexiste"])) {
                if ($configLogin["loguear_alcrear_siexiste"] === "SI" || $configLogin["loguear_alcrear_siexiste"] === "si" || $configLogin["loguear_alcrear_siexiste"] === true) {
//                    $yaexiste = true;
//                    $d = $p;
//                    $d["clave"] = $clave;
//                    $d["usuario"] = $usuario;
//                    return self::loginStarSession($d);
                }
            }
            if ($yaexiste === false) {
                $db->rollback();
                if (isset($configLogin["loguear_alcrear_siexiste"])) {
                    if ($configLogin["loguear_alcrear_siexiste"] === "NO" || $configLogin["loguear_alcrear_siexiste"] === "no" || $configLogin["loguear_alcrear_siexiste"] === false) {
                        return "yaexiste";
                    }
                }
                return "yaexiste_hagalogin";
            }
        }
        if ($perfil_send === false) {
            $per = nwprojectOut::getProfilesNwMaker($page);
            if ($per == 0) {
                $db->rollback();
                return "No existen perfiles de usuario nwmaker, comuníquese con el administrador del sistema.";
            }
        }
        //verifica si verifica correo por email
        if ($id_fb === false) {
            if (isset($configLogin["verificar_email_via_correo"])) {
                if ($configLogin["verificar_email_via_correo"] == "SI") {
                    $token = nwMaker::random(1000000000, 8888888888);
                    $veri = self::createVerifyNewAccountByEmail($usuario, $token);
                    if (!$veri) {
                        nwMaker::error("Error al crear usuario pre-registrado. " . $veri, true);
                        return "Error al crear usuario pre-registrado. " . $veri;
                    }
                    $create_session = true;
                    $estado = "preregistrado";
                }
            }
        }
        $perfil = 1;
        if ($perfil_send !== false) {
            $perfil = $perfil_send;
        } else {
            $perfil = $per["id"];
        }
        if (isset($configLogin["id_nueva_terminal"]) && $configLogin["id_nueva_terminal"] != false) {
            $id_terminal = $configLogin["id_nueva_terminal"];
            $ca->prepareSelect("terminales", "*", "id=:id");
            $ca->bindValue(":id", $id_terminal);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
            $term = $ca->flush();
            $apikey = $term["clave"];
        } else {
            $apikey = nwMaker::random(1000000000, 8888888888);
            $id_terminal = master::getNextSequence("terminales_id_seq");
            $fils = "id,nombre,ciudad,usuario,fecha,plan,activo,host,clave,pais,empresa";
            if ($clave === null && $yaexiste === true || $yaexiste === true) {
                $fils = "nombre,ciudad,pais";
            }
            if ($yaexiste === false) {
                $ca->prepareInsert("terminales", $fils);
            } else {
                $id_terminal = $cag["terminal"];
                $ca->prepareUpdate("terminales", $fils, "id=:id");
            }
            $ca->bindValue(":id", $id_terminal);
            $ca->bindValue(":nombre", $email);
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":fecha", $fecha);
            $ca->bindValue(":ciudad", $ciudad, true, true);
            $ca->bindValue(":plan", $plan);
            $ca->bindValue(":activo", "SI");
            $ca->bindValue(":host", $host);
            $ca->bindValue(":clave", $apikey);
            $ca->bindValue(":pais", $pais, true, true);
            $ca->bindValue(":empresa", $empresaTerminal, true, true);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
        }
        $fields = "id,nombre,apellido,estado_conexion,saldo,fecha_ultima_conexion,empresa";
        if ($yaexiste === false) {
            $fields .= ",clave,usuario_cliente,email,fecha_registro,perfil,usuario,terminal,usuario_principal,estado";
        }
        if (isset($configLogin["pedir_documento"])) {
            if ($configLogin["pedir_documento"] != "NO") {
                if ($documento !== "")
                    $fields .= ",nit";
            }
        }
        if (isset($configLogin["pedir_celular"])) {
            if ($configLogin["pedir_celular"] != "NO") {
                if ($celular !== "")
                    $fields .= ",celular";
            }
        }
        if (isset($configLogin["pedir_direccion"])) {
            if ($configLogin["pedir_direccion"] != "NO") {
                if ($direccion !== "")
                    $fields .= ",direccion";
            }
        }
        if ($configLogin["pedir_pais"] != "NO" || isset($p["pais"])) {
            if ($pais !== "")
                $fields .= ",pais";
        }
        if (isset($configLogin["pedir_departamento_geo"])) {
            if ($configLogin["pedir_departamento_geo"] != "NO") {
                $fields .= ",departamento";
            }
        }
        if (isset($configLogin["pedir_ciudad"])) {
            if ($configLogin["pedir_ciudad"] != "NO") {
                if ($ciudad !== "")
                    $fields .= ",ciudad";
            }
        }
        if (isset($configLogin["pedir_fecha_nacimiento"])) {
            if ($configLogin["pedir_fecha_nacimiento"] != "NO") {
                if ($fecha_nacimiento !== "")
                    $fields .= ",fecha_nacimiento";
            }
        }
        if (isset($configLogin["pedir_code_promo"])) {
            if ($configLogin["pedir_code_promo"] === "SI") {
                if ($codigo_promocional !== "")
                    $fields .= ",codigo_promocional";
            }
        }
        if (isset($configLogin["pedir_genero"])) {
            if ($configLogin["pedir_genero"] != "NO") {
                if ($genero !== "")
                    $fields .= ",genero";
            }
        }
        if (isset($configLogin["pedir_profesion"])) {
            if ($configLogin["pedir_profesion"] != "NO") {
                $fields .= ",profesion";
            }
        }
        $pasaF = false;
        if (isset($configLogin["pedir_empresa"])) {
            if ($configLogin["pedir_empresa"] != "NO") {
//                $fields .= ",empresa";
                $pasaF = true;
            }
        }
        if ($pedir_empresa === null && $pasaF === false) {
//            $fields .= ",empresa";
//            $pedir_empresa = master::getNextSequence("empresas_id_seq");
            $ca->prepareInsert("empresas", "id,razon_social,email,nombre,usuario,fecha");
//            $ca->bindValue(":id", $pedir_empresa);
            $ca->bindValue(":id", $empresaTerminal);
            $ca->bindValue(":razon_social", $usuario);
            $ca->bindValue(":email", $email);
            $ca->bindValue(":nombre", $email);
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":fecha", $fecha);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
        }
        if (isset($configLogin["pedir_formas_pago"])) {
            if ($configLogin["pedir_formas_pago"] != "NO") {
                $fields .= ",pago_forma_pago";
            }
        }
        if (isset($configLogin["pedir_observaciones"])) {
            if ($configLogin["pedir_observaciones"] != "NO") {
                $fields .= ",descripcion";
            }
        }
        if ($foto_perfil != false) {
            $fields .= ",foto_perfil";
        }
        if ($tipo_creacion !== false) {
            $fields .= ",tipo_creacion";
        }
        if ($code_referido !== null) {
            $fields .= ",code_referido";
        }

        if ($yaexiste === false) {
            $id = master::getNextSequence("{$table}_id_seq");
            $ca->prepareInsert($table, $fields);
        } else {
            $id = $cag["id"];
            $ca->prepareUpdate($table, $fields, "usuario_cliente=:usuario_cliente");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $nombre);
        $ca->bindValue(":usuario_cliente", $usuario);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":email", $email);
        $ca->bindValue(":clave", nwMaker::encrypt($clave), true, true);
        $ca->bindValue(":fecha_registro", $fecha);
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":nit", $documento);
        $ca->bindValue(":apellido", $apellido);
        $ca->bindValue(":celular", $celular);
        $ca->bindValue(":fecha_nacimiento", $fecha_nacimiento, true, true);
        $ca->bindValue(":genero", $genero, true, true);
        $ca->bindValue(":profesion", $profesion, true, true);
        $ca->bindValue(":direccion", $direccion);
        $ca->bindValue(":ciudad", $ciudad, true);
        $ca->bindValue(":pais", $pais, true);
        $ca->bindValue(":departamento", $departamento_geo, true);
        $ca->bindValue(":terminal", $id_terminal);
        $ca->bindValue(":codigo_promocional", $codigo_promocional);
        $ca->bindValue(":usuario_principal", $usuario);
        $ca->bindValue(":estado_conexion", "conectado");
        $ca->bindValue(":saldo", "0");
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":fecha_actualizacion", $fecha);
        $ca->bindValue(":fecha_ultima_conexion", $fecha);
        $ca->bindValue(":pago_forma_pago", $forma_pago);
        $ca->bindValue(":descripcion", $observaciones);
        $ca->bindValue(":tipo_creacion", $tipo_creacion);
        $ca->bindValue(":foto_perfil", $foto_perfil);
        $ca->bindValue(":empresa", $empresaTerminal);
        $ca->bindValue(":code_referido", $code_referido);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
//        $a = Array();
//        $a["id"] = $id;
//        $a["nombres_apellidos"] = $nombre . " " . $apellido;
//        $a["usuario_cliente"] = $usuario;
//        $a["terminal"] = $id_terminal;
//        $a["estado"] = "conectado";
//        if (nwMaker::updateUserMutiTerminal($a) != true) {
//            $db->rollback();
//            return "No se pudo actualizar la información";
//        }
//        $pol = self::validatePolitics($p_origin);
//        if ($pol !== true) {
//            return $pol;
//        }
        if ($code_referido !== null) {
            $ca->prepareInsert("usuarios_referidos_register", "usuario,usuario_refiere,fecha,perfil,empresa");
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":usuario_refiere", $code_referido);
            $ca->bindValue(":fecha", $fecha);
            $ca->bindValue(":perfil", $perfil);
            $ca->bindValue(":empresa", $empresaTerminal);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
        }
        if ($create_session === false) {
            if (session_id() == "") {
                session_start();
            }
            $_SESSION['id_usuario'] = $id;
            $_SESSION['id'] = $id;
            $_SESSION['usuario'] = $usuario;
            $_SESSION['nombre'] = $nombre;
            $_SESSION['apellido'] = $apellido;
            $_SESSION['nit'] = $documento;
            $_SESSION['pais'] = $pais;
            $_SESSION['departamento'] = $departamento_geo;
            $_SESSION['departamento_text'] = $departamento_geo_text;
            $_SESSION['ciudad'] = $ciudad;
            $_SESSION['profesion'] = $profesion;
            $_SESSION['celular'] = $celular;
            $_SESSION['telefono'] = $celular;
            $_SESSION['email'] = $email;
            $_SESSION['direccion'] = $direccion;
            $_SESSION['barrio'] = "";
            $_SESSION['casa_apto'] = "";
            $_SESSION['fecha_nacimiento'] = $fecha_nacimiento;
            $_SESSION['profile'] = $perfil;
            $_SESSION['perfil'] = $perfil;
            $_SESSION['autenticado'] = 'SI';
            $_SESSION['foto'] = $foto_perfil;
            $_SESSION['foto_perfil'] = $foto_perfil;
            $_SESSION['foto_portada'] = "";
            $_SESSION['ciudad_text'] = $city_text;
            $_SESSION['pais_text'] = $pais_text;
            $_SESSION['pago_estado'] = NULL;
            $_SESSION['terminal_principal'] = $id_terminal;
            $_SESSION['terminal'] = $id_terminal;
            $_SESSION['nom_terminal'] = $email;
            $_SESSION['usuario_principal'] = $usuario;
            $_SESSION['saldo'] = "0";
            $_SESSION['estado_conexion'] = "conectado";
//            $_SESSION['show_tutorial'] = "NO";
            $_SESSION['show_tutorial'] = null;
            $_SESSION['apikey'] = $apikey;
            $_SESSION['pago_forma_pago'] = $forma_pago;
            $_SESSION['descripcion'] = $observaciones;
            $_SESSION['pais_all_data'] = $pais_all_data;
            $_SESSION['empresa'] = $empresaTerminal;
            if (isset($configLogin["pedir_genero"])) {
                if ($configLogin["pedir_genero"] != "NO") {
                    if ($genero !== "")
                        $_SESSION['genero'] = $genero;
                }
            }
            $_SESSION['metodo_de_pago'] = "efectivo";
            $_SESSION['id_tarjeta_credito_metodo'] = "";
            $_SESSION['name_tarjeta_credito_metodo'] = "";
            $_SESSION['bodega'] = "";
            $_SESSION['estado'] = $estado;
            if ($timezone !== false) {
                $_SESSION['timezone'] = $timezone;
            }
        }

        $rta = array();
        $rta["usuario"] = $usuario;
        $rta["empresa"] = 1;
        $rta["nom_empresa"] = 1;
        if (isset($configLogin["pedir_empresa"])) {
            if ($configLogin["pedir_empresa"] != "NO") {
                if ($pedir_empresa !== "" && $pedir_empresa != null) {
                    $rta["empresa"] = $empresaTerminal;
                    $rta["nom_empresa"] = $empresaTerminal;
                }
            }
        }
        if ($estado == "preregistrado") {
            $rta["verifyAccount"] = true;
        }
//        include_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/basics/session.php";
//        nw_session::setEmpresa($rta);

        if ($productnw != false && $product_id != false) {
            if ($productnw == "true" || $productnw == true || $productnw == "SI") {
                $c = Array();
                $c["nombre"] = $nombre . " " . $apellido;
                $c["telefono"] = $celular;
                $c["correo"] = $email;
                $c["observaciones"] = "Creación de cuenta";
                $c["dominio"] = $dominio;
                $c["url"] = $url;
                $c["tipo"] = $tipo;
                $c["pathname"] = $pathname;
                $c["hash"] = $hash;
                if ($search !== false)
                    $c["search"] = $search;
                $c["name_app"] = $name_app;
                if (isset($p_origin["pais_all_data"])) {
                    $c["pais"] = $p_origin["pais_all_data"]["nombre"];
                } else {
                    $c["pais"] = "COL";
                }
                $cws = self::wsClientesNw($c);
                if ($cws !== "OK") {
                    $db->rollback();
                    return $cws;
                }
            }
        }

//        $configLogin["nombre"] = $nombre;
//        $configLogin["apellido"] = $apellido;
//        $configLogin["email"] = $email;
//        $configLogin["clave"] = $clave;
//        $configLogin["usuario"] = $usuario;
//        $configLogin["estado"] = $estado;
//        $configLogin["token"] = $token;

        $fo = self::saveFormasPago($p_origin);
        if ($fo !== true) {
            $db->rollback();
            return $fo;
        }

        $p["usuario"] = $usuario;
        $p["email_principal"] = $usuario;
        $nwp = self::verifyCodeUserProduct($p);
        if ($nwp !== true) {
            $db->rollback();
            return $nwp;
        }

        if (isset($p["usar_datos_envio_tarjetabiente"])) {
            $taj = self::usar_datos_envio_tarjetabiente($p);
            if ($taj !== true) {
                $db->rollback();
                return $taj;
            }
        }

        $m = Array();
        $m["terminal"] = $id_terminal;
        $m["usuario"] = $usuario;
        $m["empresa"] = $empresaTerminal;
        $m["perfil"] = $perfil;
        $m["visitor"] = $visitor;
        $lin = nwMaker::insertLoginLineTime($m);
        if ($lin !== true) {
            $db->rollback();
            return $lin;
        }

        if ($estado === "preregistrado") {
            $db->commit();
            return "preregistrado";
        }
        if ($create_session == false) {
            $rta = array();
            $rta["usuario"] = $usuario;
            $rta["create"] = "create";
            nwMaker::insertLogUserNwMaker("ENTRADA");
            $m = Array();
            $m["key"] = nwMaker::encrypt($clave);
            $m["login"] = true;
            $m["session_id"] = $session_id;
            nwMaker::verifySessionsIDMaker($m);
            self::createCookieSession();
            $db->commit();
            return $_SESSION;
        }
        $db->commit();

        if ($id_fb !== false) {
            $fa = Array();
            $fa["usuario"] = $usuario;
            $fa["type_register"] = "facebook";
            $fa["id_relation_user_extern"] = $id_fb;
            if ($picture_fb !== false) {
                $fa["picture"] = $picture_fb;
            }
            $ff = nwMaker::saveFBDataUser($fa);
            if ($ff !== true) {
                $db->rollback();
                return $ff;
            }
        }
//        self::sendEmailRegister($configLogin);
        return true;
    }

    public static function saveFormasPago($p) {
        $p = nwMaker::getData($p);
        if (isset($p["checkbox_forma_pago"])) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $db->transaction();
            $t = count($p["checkbox_forma_pago"]);
            if ($t > 0) {
                for ($i = 0; $i < $t; $i++) {
                    $pata = $p["checkbox_forma_pago"][$i];
                    if ($pata["value"] === true || $pata["value"] === "true") {
                        $ca->prepareInsert("nwmaker_login_valores_formapago", "usuario,id_forma_pago");
                        $ca->bindValue(":usuario", $p["email"]);
                        $ca->bindValue(":id_forma_pago", $pata["name"]);
                        if (!$ca->exec()) {
                            $db->rollback();
                            return nwMaker::error($ca->lastErrorText());
                        }
                    }
                }
                $db->commit();
                return true;
            }
        }
        return true;
    }

    public static function sendEmailRegister($configLogin) {
        $token = null;
        if (isset($configLogin["token"])) {
            $token = $configLogin["token"];
        }
        $usuario = $configLogin["usuario"];
        $clave = $configLogin["clave"];
        $nombre = $configLogin["nombre"];
        $apellido = $configLogin["apellido"];
        $email = $configLogin["email"];
        $estado = $configLogin["estado"];
        $asunto = "Cuenta creada exitosamente en <a href='{$_SERVER["HTTP_HOST"]}' target='_BLANK'>{$_SERVER["HTTP_HOST"]}</a>";
        $cleanHtml = false;
//        if (!isset($_SESSION["usuario"])) {
        $mensaje = "¡{$nombre} Gracias por registrarte con nosotros!<br />";
        if ($estado == "preregistrado") {
            $link = "https://{$_SERVER["HTTP_HOST"]}/?nwaccount=nwtrue&verifyNewAccount=true&user={$usuario}&token=" . $token;
            $mensaje .= "<p>Para confirmar y terminar de crear su cuenta por favor ingrese al siguiente link</p>";
            $mensaje .= "<p><a href='{$link}' target='_blank'>URL: {$link}</a></p>";
        } else {
            $mensaje .= "<p>Ahora puede comenzar a usar su cuenta y todos los privilegios que tenemos, a continuación un resumen de su cuenta:</p>";
        }
        $mensaje .= "<p><strong>Usuario</strong>: {$usuario}</p>";
        $mensaje .= "<p><strong>Clave</strong>: {$clave}</p>";
        if ($estado != "preregistrado") {
            $mensaje .= "<p>Ingresa ahora mismo https://{$_SERVER["HTTP_HOST"]}/ </p>";
        }
        if ($estado !== "preregistrado") {
            if (isset($configLogin["asunto_bienvenido_registro"]) && $configLogin["asunto_bienvenido_registro"] != null && $configLogin["asunto_bienvenido_registro"] != false && $configLogin["asunto_bienvenido_registro"] != "") {
                $asunto = $configLogin["asunto_bienvenido_registro"];
            }
            if (isset($configLogin["html_bienvenido_registro"]) && $configLogin["html_bienvenido_registro"] != null && $configLogin["html_bienvenido_registro"] != false && $configLogin["html_bienvenido_registro"] != "") {
                $mensaje = $configLogin["html_bienvenido_registro"];
                $cleanHtml = true;
            }
        }

        $fromName = $_SERVER["HTTP_HOST"];
        $fromEmail = "noreply@" . str_replace("www.", "", $_SERVER["HTTP_HOST"]);
        if (isset($configLogin["desti_nombre_bienvenido_registro"]) && $configLogin["desti_nombre_bienvenido_registro"] != null && $configLogin["desti_nombre_bienvenido_registro"] != false && $configLogin["desti_nombre_bienvenido_registro"] != "") {
            $fromName = $configLogin["desti_nombre_bienvenido_registro"];
        }
        if (isset($configLogin["desti_emailreply_bienvenido_registro"]) && $configLogin["desti_emailreply_bienvenido_registro"] != null && $configLogin["desti_emailreply_bienvenido_registro"] != false && $configLogin["desti_emailreply_bienvenido_registro"] != "") {
            $fromEmail = $configLogin["desti_emailreply_bienvenido_registro"];
        }

        $asunto = str_replace("{username}", $usuario, $asunto);
        $asunto = str_replace("{userFullName}", $nombre . " " . $apellido, $asunto);

        $mensaje = str_replace("{username}", $usuario, $mensaje);
        $mensaje = str_replace("{userFullName}", $nombre . " " . $apellido, $mensaje);

        $fromName = str_replace("{userFullName}", $nombre . " " . $apellido, $fromName);
        $fromName = str_replace("{username}", $usuario, $fromName);

        nw_configuraciones::sendEmail($email, $nombre . " " . $apellido, $asunto, $asunto, $mensaje, false, true, $cleanHtml, $fromName, $fromEmail);

//        $m = "Se ha creado una nueva cuenta con estado {$estado} en el sitio {$_SERVER["HTTP_HOST"]}, user: {$usuario}, {$nombre} {$apellido} {$email} ";
//        nw_configuraciones::sendEmail("orionjafe@gmail.com", "orionjafe@gmail.com", "NwMaker: Nueva cuenta creada en {$_SERVER["HTTP_HOST"]}", "NwMaker: Nueva cuenta creada en {$_SERVER["HTTP_HOST"]}", $m, false, true);
    }

    public static function validatePolitics($p) {
        $p = nwMaker::getData($p);
        if (!isset($p["accept_politics"])) {
            return true;
        }
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $ip = master::getRealIp();
        $ca->prepareInsert("nwmaker_policies_accept", "usuario,ip,fecha,accept");
        $ca->bindValue(":usuario", $p["email"], true, true);
        $ca->bindValue(":ip", $ip, true, true);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":accept", "ACCEPT");
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function usar_datos_envio_tarjetabiente($data) {
        $p = nwMaker::getData($data);
        $id_session = session_id();
        $nombre = $p["nombre"];
        $apellido = $p["apellido"];
        $telefono = $p["celular"];
        $direccion = $p["direccion"];
        $pais = $p["pais"];
        $pais_text = $p["pais_text"];
        $depto = $p["departamento"];
        $depto_text = $p["departamento_text"];
        $ciudad = $p["ciudad"];
        $ciudad_text = $p["ciudad_text"];
        $_SESSION['usar_datos_envio_tarjetabiente'] = $p["usar_datos_envio_tarjetabiente"];
        if ($p["usar_datos_envio_tarjetabiente"] === "off") {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $db->transaction();
            $ca->prepareInsert("nwmaker_login_datostarjetabiente", "usuario,nombre,apellido,telefono,direccion,pais,departamento,ciudad,session_id");
            $ca->bindValue(":usuario", $p["usuario"], true, true);
            $ca->bindValue(":nombre", $p["nombre_recibe_pedido"], true, true);
            $ca->bindValue(":apellido", $p["apellido_recibe_pedido"], true, true);
            $ca->bindValue(":telefono", $p["telefono_recibe_pedido"], true, true);
            $ca->bindValue(":direccion", $p["direccion_recibe_pedido"], true, true);
            $ca->bindValue(":pais", $p["pais_recibe_pedido"], true, true);
            $ca->bindValue(":departamento", $p["departamento_recibe_pedido"], true, true);
            $ca->bindValue(":ciudad", $p["ciudad_recibe_pedido"], true, true);
            $ca->bindValue(":session_id", $id_session, true, true);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
            $nombre = $p["nombre_recibe_pedido"];
            $apellido = $p["apellido_recibe_pedido"];
            $telefono = $p["telefono_recibe_pedido"];
            $direccion = $p["direccion_recibe_pedido"];
            $pais = $p["pais_recibe_pedido"];
            $pais_text = $p["pais_recibe_pedido_text"];
            $depto = $p["departamento_recibe_pedido"];
            $depto_text = $p["departamento_recibe_pedido_text"];
            $ciudad = $p["ciudad_recibe_pedido"];
            $ciudad_text = $p["ciudad_recibe_pedido_text"];
            $db->commit();
        }
        $_SESSION['nombre_recibe_pedido'] = $nombre;
        $_SESSION['apellido_recibe_pedido'] = $apellido;
        $_SESSION['telefono_recibe_pedido'] = $telefono;
        $_SESSION['direccion_recibe_pedido'] = $direccion;
        $_SESSION['pais_recibe_pedido'] = $pais;
        $_SESSION['pais_recibe_pedido_text'] = $pais_text;
        $_SESSION['departamento_recibe_pedido'] = $depto;
        $_SESSION['departamento_recibe_pedido_text'] = $depto_text;
        $_SESSION['ciudad_recibe_pedido'] = $ciudad;
        $_SESSION['ciudad_recibe_pedido_text'] = $ciudad_text;
        return true;
    }

    public static function loginStarSession($data, $usePass = true) {
        $pos = $data;
        if (isset($data["data"])) {
            $pos = $data["data"];
        }
//        $pos = nwMaker::getData($data);
//        NWJSonRpcServer::console("holas");

        $dispositivo = nwMaker::getDispositivo();
        $configLogin = nwprojectOut::nwpMakerLoginConfig();
        $msgerror = "usuariooclaveinvalida";
        $autorize = false;
        $session_id = false;
        $permitir_log_entrada_in_mobile = true;
        $ingreso_log_entrada = true;
        if (isset($configLogin["permitir_log_entrada_in_mobile"])) {
            $permitir_log_entrada_in_mobile = $configLogin["permitir_log_entrada_in_mobile"];
        }
        if (!$permitir_log_entrada_in_mobile && $dispositivo !== "pc_desktop") {
            $ingreso_log_entrada = false;
        }
        $visitor = null;
        if (isset($pos["visitor"])) {
            $visitor = $pos["visitor"];
        }
        $timezone = false;
        if (isset($pos["timezone"])) {

            $timezone = $pos["timezone"];
        }
        if (isset($pos["session_id"])) {
            $session_id = master::clean($pos["session_id"]);
        }
        if (isset($pos['usuario']) && $pos['usuario'] != "" && isset($pos['clave']) && $pos['clave'] != "") {
            $autorize = true;
        }
        if ($autorize === true) {
            $usuario = master::clean($pos["usuario"]);
            $clave_nomd5 = master::clean($pos["clave"]);
            $clave = nwMaker::encrypt($pos["clave"]);
            if (isset($pos["nomd5"])) {
                $clave = $pos["clave"];
            }
            if (isset($configLogin["verificar_email_via_correo"])) {
                if ($configLogin["verificar_email_via_correo"] === "SI") {
                    if (isset($pos["token"])) {
                        $veri = nwMaker::verifyNewAccountByEmail($usuario, $pos["token"], $clave);
                        if ($veri !== true) {
                            return "tokennovalido_useryaregistrado";
                        }
                    }
                }
            }
            $tipo_login = $configLogin["tipo_login"];
            if (isset($configLogin["tipo_login_app"]) && $dispositivo !== "pc_desktop") {
                $tipo_login = $configLogin["tipo_login_app"];
            }
            $tipo_login_version = 1;
            if (isset($configLogin["tipo_login_version"])) {
                $tipo_login_version = $configLogin["tipo_login_version"];
            }
            if ($tipo_login == "qxnw" && $tipo_login_version === 1) {
                $p = array();
                $p["usuario"] = $usuario;
                $p["clave"] = $clave;
                $db = NWDatabase::database();
                $ca = new NWDbQuery($db);
                $p["no_close"] = true;
                if (isset($pos["pedir_empresa"])) {
                    $p["pedir_empresa"] = $pos["pedir_empresa"];
                }
                if (isset($pos["perfil_send"])) {
                    $p["perfil_send"] = $pos["perfil_send"];
                }

                if (isset($configLogin["validaconclave"]) && $configLogin["validaconclave"] === "SI") {
                    $p["conclave"] = $pos['clave'];
                }
                $pass = nw_session::consulta($p);
                if (!$pass) {
                    return $pass;
                }

                $empres = null;
                $where = "a.usuario=:usuario ";
                if (isset($configLogin["validaconclave"]) && $configLogin["validaconclave"] === "SI") {
                    if (isset($pass["empresa"]) && $pass["empresa"] !== "" && $pass["empresa"] !== null) {
                        $where .= " and a.empresa=:empresa";
                        $empres = $pass["empresa"];
                    }
                }
                $where .= " order by b.id desc limit 1";
                $ca->prepareSelect("usuarios_empresas a left join empresas b ON (a.empresa=b.id)", "a.empresa,b.razon_social as empresa_text,b.logo,b.id,a.perfil,a.terminal,b.idioma_por_defecto", $where);
                $ca->bindValue(":usuario", $usuario, true, true);
                $ca->bindValue(":empresa", $empres, true, true);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
                if ($ca->size() == 0) {
//                    nwMaker::error("nonexisteusuario {$usuario}", true);
                    return "nonexisteusuario";
                }
                $r = $ca->flush();
                $_SESSION['empresa_logo'] = $r["logo"];
                $_SESSION["empresa"] = $r["id"];
                $_SESSION["nom_empresa"] = $r["empresa_text"];
                if (isset($r["idioma_por_defecto"])) {
                    if (nwMaker::evalueData($r["idioma_por_defecto"])) {
                        $_SESSION["idioma_por_defecto"] = $r["idioma_por_defecto"];
                    }
                }

                $p["empresa"] = $r["empresa"];
                $p["nom_empresa"] = $r["empresa_text"];

                $emp = nw_session::setEmpresa($p);
                if ($emp != true) {
                    return $emp;
                }
                $_SESSION['apikey'] = null;
                if (isset($pass["terminal"]) && $pass["terminal"] !== null && $pass["terminal"] !== "") {
                    $ca->prepareSelect("terminales", "clave as apikey", "id=:id");
                    $ca->bindValue(":id", $pass["terminal"]);
                    if (!$ca->exec()) {
                        return nwMaker::error($ca->lastErrorText());
                    }
                    if ($ca->size() === 0) {
                        nwMaker::error("Error, no tiene terminal configurada", true);
                        return "Error, no tiene terminal configurada";
                    }
                    $te = $ca->flush();
                    $_SESSION['apikey'] = $te["apikey"];
                }

                $we = "a.usuario=:usuario and a.clave=:clave and a.id=:id ";
                if (isset($pos["codigo"])) {
                    $we .= " and a.codigo=:codigo ";
                }
                $pedir_empresa = null;
                $perfil_send = null;
                $perfil_tipo = null;
                if (isset($pos["pedir_empresa"])) {
                    if ($pos["pedir_empresa"] !== null && $pos["pedir_empresa"] !== false && $pos["pedir_empresa"] !== "") {
                        $pedir_empresa = $pos["pedir_empresa"];
                        $we .= " and a.empresa=:pedir_empresa";
                    }
                }
                if (isset($pos["perfil_send"])) {
                    if ($pos["perfil_send"] !== null && $pos["perfil_send"] !== false && $pos["perfil_send"] !== "") {
                        $perfil_send = $pos["perfil_send"];
                        $we .= " and a.perfil=:perfil_send ";
                    }
                }
                if (isset($pos["perfil_tipo"])) {
                    if ($pos["perfil_tipo"] !== null && $pos["perfil_tipo"] !== false && $pos["perfil_tipo"] !== "") {
                        $perfil_tipo = $pos["perfil_tipo"];
                        $we .= " and b.tipo=:perfil_tipo ";
                    }
                }
                $we .= " limit 1";
                $ca->prepareSelect("usuarios a left join perfiles b on(a.perfil=b.id)", "a.*,b.nombre as perfil_text,b.tipo as perfil_tipo", $we);
                $ca->bindValue(":usuario", $pass["usuario"]);
                $ca->bindValue(":empresa", $pedir_empresa);
                $ca->bindValue(":pedir_empresa", $pedir_empresa);
                $ca->bindValue(":perfil_send", $perfil_send);
                $ca->bindValue(":perfil_tipo", $perfil_tipo);
                $ca->bindValue(":clave", $clave);
                $ca->bindValue(":id", $pass["id"]);
                if (isset($pos["codigo"])) {
                    $ca->bindValue(":codigo", $pos["codigo"]);
                }
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
                if ($ca->size() === 0) {
//                    nwMaker::error("nonexisteusuario {$pass["usuario"]}", true);
                    return "nonexisteusuario";
                }
                $pd = $ca->flush();

                $_SESSION['id_usuario'] = $pd["id"];
                $_SESSION['perfil'] = $pd["perfil"];
                $_SESSION['profile'] = $pd["perfil"];
                $_SESSION['terminal'] = $pd["terminal"];
                if (isset($r["perfil"]) && $r["perfil"] !== null && $r["perfil"] !== "") {
                    $_SESSION['perfil'] = $r["perfil"];
                    $_SESSION['profile'] = $r["perfil"];
                }
                if (isset($r["terminal"]) && $r["terminal"] !== null && $r["terminal"] !== "") {
                    $_SESSION['terminal'] = $r["terminal"];
                }
                if (isset($pd["generos_musicales"])) {
                    $_SESSION['generos_musicales'] = $pd["generos_musicales"];
                }
                if (isset($pd["sala"])) {
                    $_SESSION['sala'] = $pd["sala"];
                }
                if (isset($pd["perfil_text"])) {
                    $_SESSION['perfil_text'] = $pd["perfil_text"];
                }
                if (isset($pd["perfil_tipo"])) {
                    $_SESSION['perfil_tipo'] = $pd["perfil_tipo"];
                }
                if (isset($pd["pais"])) {
                    $cou = nwMaker::getCountryByID($pd["pais"]);
                    if ($cou !== false) {
                        $_SESSION['pais_all_data'] = $cou;
                        $_SESSION['pais'] = $cou["id"];
                        $_SESSION['pais_text'] = $cou["nombre"];
                        if (isset($cou["zona_horaria"])) {
                            $_SESSION['pais_zona_horaria'] = $cou["zona_horaria"];
                        }
                    } else {
                        $_SESSION['pais_all_data'] = "";
                    }
                } else {
                    $_SESSION['pais_all_data'] = "";
                }
                if (isset($pd["estado_activacion"])) {
                    $_SESSION["estado_activacion"] = $pd["estado_activacion"];
                } else {
                    $_SESSION["estado_activacion"] = "1";
                }
                if (isset($pd["account_code_activation"])) {
                    $_SESSION["account_code_activation"] = $pd["account_code_activation"];
                } else {
                    $_SESSION["account_code_activation"] = "NO_HAVE";
                }
                if (isset($pd['usuario_principal'])) {
                    $_SESSION['usuario_principal'] = $pd['usuario_principal'];
                } else {
                    $_SESSION['usuario_principal'] = "";
                }
                if (isset($pd['celular_validado'])) {
                    $_SESSION['celular_validado'] = $pd['celular_validado'];
                } else {
                    $_SESSION['celular_validado'] = "NO";
                }
                if (isset($pd['bodega'])) {
                    $_SESSION['bodega'] = $pd['bodega'];
                } else {
                    $_SESSION['bodega'] = "";
                }
                $_SESSION['estado'] = $pd['estado'];
                $_SESSION['estado_conexion'] = $pd['estado_conexion'];
                if (isset($pd['estado_conexion_fecha_limit'])) {
                    $_SESSION['estado_conexion_fecha_limit'] = $pd['estado_conexion_fecha_limit'];
                }
                $_SESSION['apellido'] = $pd['apellido'];
                if ($timezone !== false) {
                    $_SESSION['timezone'] = $timezone;
                    $pass["timezone"] = $timezone;
                }

                $pass["estado_conexion"] = $_SESSION['estado_conexion'];
                $pass["usuario_principal"] = $_SESSION['usuario_principal'];
                $pass["account_code_activation"] = $_SESSION['account_code_activation'];

                $connecToServerProduct = true;
                if (isset($configLogin["profiles_no_product"]) && $configLogin["profiles_no_product"] !== false) {
                    if (count($configLogin["profiles_no_product"]) > 0) {
                        $pass["profiles_no_product"] = $configLogin["profiles_no_product"];
                        $_SESSION["profiles_no_product"] = $configLogin["profiles_no_product"];
                        if (in_array($pass["perfil"], $configLogin["profiles_no_product"])) {
                            $pass["profile_connect_to_server"] = false;
                            $_SESSION["profile_connect_to_server"] = false;
                            $connecToServerProduct = false;
                        }
                    }
                }

                if ($connecToServerProduct === true) {
                    if (isset($pass["account_code_activation"])) {
                        $nw = self::getEstadoUserProducto($pass);
                        if ($nw !== true) {
                            return $nw;
                        }
                    }
                }

                $val = nwMaker::validateConcurrencia();
                if ($val !== true) {
                    return $val;
                }

                $m = Array();
                $m["cookie"] = $pass["marca_cookie"];
                $m["key"] = $clave;
                $m["login"] = true;
                $m["session_id"] = $session_id;
                $val = nwMaker::verifySessionsIDMaker($m);
                if ($pass != false) {
//                    return $pass;
                }
//                $dp = Array();
//                $dp["estado"] = "conectado";
//                self::changeStatusConection($dp);
                $roc = self::actualizeLastConnection();

                $m = Array();
                $m["session_id"] = $session_id;
                $m["terminal"] = $pass['terminal'];
                $m["usuario"] = $pass['usuario'];
//              nwMaker::actualizeLastConnection($m);
                nwMaker::insertLogUserNwMaker("ENTRADA", $m);

                $m = Array();
                $m["terminal"] = $pass['terminal'];
                $m["usuario"] = $pass['usuario'];
                if (isset($pd["empresa"])) {
                    $m["empresa"] = $pd["empresa"];
                }
                $m["perfil"] = $pd["perfil"];
                $m["visitor"] = $visitor;
                $lin = nwMaker::insertLoginLineTime($m);
                if ($lin !== true) {
                    return $lin;
                }
                if (isset($configLogin["verificar_email_via_correo"])) {
                    if ($configLogin["verificar_email_via_correo"] === "SI") {
                        if (isset($pos["token"])) {
                            $configLogin["nombre"] = $_SESSION["nombre"];
                            $configLogin["apellido"] = $_SESSION["apellido"];
                            $configLogin["email"] = $_SESSION["email"];
                            $configLogin["clave"] = $clave;
                            $configLogin["usuario"] = $_SESSION["usuario"];
                            $configLogin["estado"] = $_SESSION["estado"];
                            $configLogin["token"] = $pos["token"];
                            self::sendEmailRegister($configLogin);
                        }
                    }
                }
                if ($roc !== true) {
                    return $roc;
                }
                return $_SESSION;
            }

            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $pedir_empresa = null;
            $perfil_send = null;
            $where = "a." . nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario";
            if ($usePass === true) {
                $where .= " and a.clave=:clave";
            }
            if (isset($pos["pedir_empresa"])) {
                if ($pos["pedir_empresa"] !== null && $pos["pedir_empresa"] !== false && $pos["pedir_empresa"] !== "") {
                    $pedir_empresa = $pos["pedir_empresa"];
                    $where .= " and a.empresa=:pedir_empresa";
                }
            }
            if (isset($pos["perfil_send"])) {
                if ($pos["perfil_send"] !== null && $pos["perfil_send"] !== false && $pos["perfil_send"] !== "") {
                    $perfil_send = $pos["perfil_send"];
                    $where .= " and a.perfil=:perfil_send";
                }
            }
            $fields = "a.*,b.nombre as ciudad_text,c.nombre as nom_terminal,d.nombre as pais_text,c.clave as apikey";
            $fields .= ",e.idioma_por_defecto";
            $tables = nwMaker::tableUsersNwMaker() . " a left join ciudades b ON(a.ciudad=b.id) left join terminales c ON(a.terminal=c.id) left join paises d ON(a.pais=d.id)";
            $tables .= " left join empresas e ON(a.empresa=e.id)";
            $ca->prepareSelect($tables, $fields, $where);
            $ca->bindValue(":usuario", $usuario, true);
            $ca->bindValue(":clave", $clave, true);
            $ca->bindValue(":pedir_empresa", $pedir_empresa, true);
            $ca->bindValue(":perfil_send", $perfil_send, true);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
//                nwMaker::error("nonexisteusuario {$usuario}", true);
                return "nonexisteusuario";
            }
            $r = $ca->flush();
            if ($r["estado"] == "inactivo") {
                return "usuarioinactivo";
            }
            if ($r["estado"] == "preregistrado") {
                return "usuariopreregistrado";
            }
            if ($r["estado"] != "activo") {
                return "usuarioinactivo";
            }

            if ($r['clave'] == $clave || $usePass === false) {
                $nw = self::getEstadoUserProducto($r);
                if ($nw !== true) {
                    return $nw;
                }
                if (!isset($_SESSION)) {
                    session_start();
                }
                if (session_id() == "") {
                    session_start();
                }

                $_SESSION['id_usuario'] = $r['id'];
                $_SESSION['id'] = $r['id'];
                $_SESSION['usuario'] = $r[nwMaker::fieldsUsersNwMaker("usuario_cliente")];
                $_SESSION['nombre'] = $r['nombre'];
                $_SESSION['apellido'] = $r['apellido'];
                $_SESSION['nit'] = $r[nwMaker::fieldsUsersNwMaker("documento")];
                $_SESSION['ciudad'] = $r['ciudad'];
                if (isset($_SESSION['departamento'])) {
                    $_SESSION['departamento'] = $r['departamento'];
                }
                $_SESSION['celular'] = $r['celular'];
                $_SESSION['telefono'] = $r['telefono'];
                $_SESSION['email'] = $r['email'];
                if (isset($r["direccion"]))
                    $_SESSION['direccion'] = $r['direccion'];
                if (isset($r["correo_gmail"])) {
                    $_SESSION['correo_gmail'] = $r['correo_gmail'];
                }
                if (isset($r["barrio"])) {
                    $_SESSION['barrio'] = $r['barrio'];
                }
                if (isset($r["horario_task"])) {
                    $_SESSION['horario_task'] = $r['horario_task'];
                }
                if (isset($r["horario_task_almuerzo"])) {
                    $_SESSION['horario_task_almuerzo'] = $r['horario_task_almuerzo'];
                }
                if (isset($r["permisos_board"])) {
                    $_SESSION['permisos_board'] = $r['permisos_board'];
                }
                if (isset($r['fecha_nacimiento'])) {
                    $_SESSION['fecha_nacimiento'] = $r['fecha_nacimiento'];
                }
                if (isset($r['idioma_por_defecto'])) {
                    if (nwMaker::evalueData($r["idioma_por_defecto"])) {
                        $_SESSION['idioma_por_defecto'] = $r['idioma_por_defecto'];
                    }
                }
                $_SESSION['profile'] = $r['perfil'];
                $_SESSION['perfil'] = $r['perfil'];
                $_SESSION['autenticado'] = 'SI';
                if (isset($r['foto'])) {
                    $_SESSION['foto'] = $r[nwMaker::fieldsUsersNwMaker("foto_perfil")];
                }
                if (isset($r['foto_perfil'])) {
                    $_SESSION['foto_perfil'] = $r[nwMaker::fieldsUsersNwMaker("foto_perfil")];
                }
                if (isset($_SESSION['genero'])) {
                    $_SESSION['genero'] = $r['genero'];
                }
                $_SESSION['estado'] = $r['estado'];
                if (isset($r['foto_portada'])) {
                    $_SESSION['foto_portada'] = $r['foto_portada'];
                } else {
                    $_SESSION['foto_portada'] = "";
                }
                if (isset($r["estado_activacion"])) {
                    $_SESSION["estado_activacion"] = $r["estado_activacion"];
                } else {
                    $_SESSION["estado_activacion"] = "1";
                }
                $_SESSION['ciudad'] = $r['ciudad'];
                $_SESSION['pais'] = $r['pais'];
                $_SESSION['pais_text'] = $r['pais_text'];
                $_SESSION['ciudad_text'] = $r['ciudad_text'];
                if (isset($r['pago_estado']))
                    $_SESSION['pago_estado'] = $r['pago_estado'];
                $_SESSION['terminal_principal'] = $r['terminal'];
                $_SESSION['terminal'] = $r['terminal'];
                $_SESSION['nom_terminal'] = $r['nom_terminal'];
                if (isset($r['metodo_de_pago'])) {
                    $_SESSION['metodo_de_pago'] = $r['metodo_de_pago'];
                } else {
                    $_SESSION['metodo_de_pago'] = "efectivo";
                }
                if (isset($r['id_tarjeta_credito_metodo'])) {
                    $_SESSION['id_tarjeta_credito_metodo'] = $r['id_tarjeta_credito_metodo'];
                } else {
                    $_SESSION['id_tarjeta_credito_metodo'] = "";
                }
                if (isset($r['name_tarjeta_credito_metodo'])) {
                    $_SESSION['name_tarjeta_credito_metodo'] = $r['name_tarjeta_credito_metodo'];
                } else {
                    $_SESSION['name_tarjeta_credito_metodo'] = "";
                }
                if (isset($r['usuario_principal'])) {
                    $_SESSION['usuario_principal'] = $r['usuario_principal'];
                } else {
                    $_SESSION['usuario_principal'] = "";
                }
                if (isset($r['saldo'])) {
                    $_SESSION['saldo'] = $r['saldo'];
                } else {
                    $_SESSION['saldo'] = "";
                }
                $_SESSION['estado_conexion'] = $r['estado_conexion'];
                if (isset($r['estado_conexion_fecha_limit'])) {
                    $_SESSION['estado_conexion_fecha_limit'] = $r['estado_conexion_fecha_limit'];
                }
                if (isset($r['profesion'])) {
                    $_SESSION['profesion'] = $r['profesion'];
                } else {
                    $_SESSION['profesion'] = "";
                }
                if (isset($r['casa_apto'])) {
                    $_SESSION['casa_apto'] = $r['casa_apto'];
                } else {
                    $_SESSION['casa_apto'] = "";
                }
                if (isset($r['show_tutorial'])) {
                    $_SESSION['show_tutorial'] = $r['show_tutorial'];
                } else {
//                    $_SESSION['show_tutorial'] = "NO";
                    $_SESSION['show_tutorial'] = null;
                }
                if (isset($r['servicios_activos'])) {
                    $_SESSION['servicios_activos'] = $r['servicios_activos'];
                } else {
                    $_SESSION['servicios_activos'] = "NO";
                }
                if (isset($r['placa_activa'])) {
                    $_SESSION['placa_activa'] = $r['placa_activa'];
                }
                if (isset($r['celular_validado'])) {
                    $_SESSION['celular_validado'] = $r['celular_validado'];
                } else {
                    $_SESSION['celular_validado'] = "NO";
                }
                if (isset($r['bodega'])) {
                    $_SESSION['bodega'] = $r['bodega'];
                } else {
                    $_SESSION['bodega'] = "";
                }
                if (isset($r["sala"])) {
                    $_SESSION['sala'] = $r["sala"];
                }
                $_SESSION['apikey'] = $r["apikey"];
                $_SESSION['acepto_terminos_condiciones'] = "";
                if (isset($r["acepto_terminos_condiciones"]))
                    $_SESSION['acepto_terminos_condiciones'] = $r["acepto_terminos_condiciones"];

                $cou = nwMaker::getCountryByID($r['pais']);
                if ($cou !== false) {
                    $_SESSION['pais_all_data'] = $cou;
                    $_SESSION['pais'] = $cou["id"];
                    $_SESSION['pais_text'] = $cou["nombre"];
                    if (isset($cou["zona_horaria"])) {
                        $_SESSION['pais_zona_horaria'] = $cou["zona_horaria"];
                    }
                } else {
                    $_SESSION['pais_all_data'] = "";
                }
                if ($timezone !== false) {
                    $_SESSION['timezone'] = $timezone;
                }

//                $dp = Array();
//                $dp["estado"] = "conectado";
//                self::changeStatusConection($dp);
                $rta = array();
                $rta["usuario"] = $r[nwMaker::fieldsUsersNwMaker("usuario_cliente")];
                $rta["empresa"] = 1;
                $rta["nom_empresa"] = 1;
                if (isset($r['empresa'])) {
                    if ($r['empresa'] != "" && $r['empresa'] != null) {
                        $rta["empresa"] = $r['empresa'];
                        $rta["nom_empresa"] = $r['empresa'];
                    }
                }
//                include_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/basics/session.php";
                nw_session::setEmpresa($rta);

                if ($ingreso_log_entrada) {
                    $m = Array();
                    $m["session_id"] = $session_id;
                    $m["terminal"] = $r['terminal'];
                    $m["usuario"] = $r[nwMaker::fieldsUsersNwMaker("usuario_cliente")];
//              nwMaker::actualizeLastConnection($m);
                    nwMaker::insertLogUserNwMaker("ENTRADA", $m);
                }

                $m = Array();
                $m["terminal"] = $r['terminal'];
                $m["usuario"] = $r[nwMaker::fieldsUsersNwMaker("usuario_cliente")];
                if (isset($r['empresa']))
                    $m["empresa"] = $r['empresa'];
                $m["perfil"] = $r['perfil'];
                $m["visitor"] = $visitor;
                $lin = nwMaker::insertLoginLineTime($m);
                if ($lin !== true) {
                    return $lin;
                }

                $m["key"] = $clave;
                $m["login"] = true;
                $m["cookie"] = nwMaker::createCookieSession();
                nwMaker::verifySessionsIDMaker($m);

                if (isset($configLogin["verificar_email_via_correo"])) {
                    if ($configLogin["verificar_email_via_correo"] === "SI") {
                        if (isset($pos["token"])) {
                            $configLogin["nombre"] = $_SESSION["nombre"];
                            $configLogin["apellido"] = $_SESSION["apellido"];
                            $configLogin["email"] = $_SESSION["email"];
                            $configLogin["clave"] = $clave;
                            $configLogin["usuario"] = $_SESSION["usuario"];
                            $configLogin["estado"] = $_SESSION["estado"];
                            $configLogin["token"] = $pos["token"];
                            self::sendEmailRegister($configLogin);
                        }
                    }
                }

                $db->commit();
                //TODO: SE DEBE ENVIAR ÚNICAMENTE LO QUE SE NECESITA
                return $_SESSION;
            } else {
                return $msgerror;
            }
        } else {
            return $msgerror;
        }
    }

    public static function getCountryByID($id) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("paises", "*", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function checkFBUserExists($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "email,clave", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and clave=:clave and estado='activo'");
        $ca->bindValue(":usuario", $p["email"]);
        $ca->bindValue(":clave", nwMaker::encrypt($p["userID"]));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $ca->next();
        return $ca->assoc();
    }

    public static function verifySession($p = false) {
        $p = nwMaker::getData($p);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $fecha_hora_actual = $fecha;
        $_SESSION['tiempo_vida_session'] = $fecha_hora_actual;
        if (!isset($_SESSION["usuario"])) {
            $reintentar = true;
            if (isset($_SESSION['reintentar_conectar_session_by_cookie'])) {
                if ($_SESSION['reintentar_conectar_session_by_cookie'] === false) {
                    $reintentar = false;
                }
            }
            if ($reintentar === true) {
//            return "Su sesión ha expirado, vuelva a ingresar por favor";
                nwMaker::verifySessionsIDMaker(false);
            } else {
                nwMaker::closeSession();
                return "session_expired";
            }
        }

        if (isset($_SESSION["usuario"])) {
            $val = nwMaker::validateConcurrencia();
            if ($val !== true) {
                return $val;
            }
        }
        $active = false;
        $up = $_SESSION;
        $hoy = $fecha;
        if (isset($up["estado_producto_cliente"]) && isset($up["account_date_expiration"])) {
            if ($up["estado_producto_cliente"] === "ACTIVO") {
                if ($up["account_date_expiration"] > $hoy) {
                    $active = true;
                }
            }
        }
        $_SESSION["session_id_verify"] = session_id();
//        $_SESSION["cooks"] = $_COOKIE;
        if ($active === false) {
            $productnw = false;
            if (isset($p["productnw"])) {
                if ($p["productnw"] == true || $p["productnw"] == "true") {
                    $productnw = true;
                }
            }
            if (isset($_SESSION["usuario"]) && $productnw == true) {
                $db = NWDatabase::database();
                $ca = new NWDbQuery($db);
                $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "account_code_activation,account_date_expiration", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and (estado='activo' or estado='registrado_sin_validacion') ");
                $ca->bindValue(":usuario", $_SESSION["usuario"]);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
                if ($ca->size() === 0) {
                    return "usuario_no_existe";
                }
                $r = $ca->flush();
                $_SESSION["account_code_activation"] = $r["account_code_activation"];

                $pass = Array();
                $pass["account_code_activation"] = $r["account_code_activation"];
                $pass["usuario"] = $_SESSION["usuario"];
                $nw = self::getEstadoUserProducto($pass);
                if ($nw !== true) {
                    return $nw;
                }
            }
        }
        return $_SESSION;
    }

    public static function verifyInitSessionByGetUserName($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(nwMaker::tableUsersNwMaker(), nwMaker::fieldsUsersNwMaker("usuario_cliente") . ",clave", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and estado='activo'");
        $ca->bindValue(":usuario", $p["userName"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $d = Array();
        $d["usuario"] = $r["usuario_cliente"];
        $d["clave"] = $r["clave"];
        $d["nomd5"] = true;
        return self::loginStarSession($d);
    }

    public static function changeStatusConection($data) {
        $p = nwMaker::getData($data);
        $usuario = nwMaker::getUser($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "estado_conexion", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":estado_conexion", $p["estado"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $_SESSION['estado_conexion'] = $p["estado"];
        return $_SESSION;
    }

    public static function selectGeneric($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $where = $p["where"];
        $where = str_replace(" o ", " or ", $p["where"]);
        if (isset($p["token"]) && isset($p["fields_token"])) {
            $where .= " and " . NWDbQuery::sqlFieldsFilters($p["fields_token"], $p["token"], true);
        }
        $order = "";
        if (isset($p["order"])) {
            $order = " " . $p["order"];
        }
        $ca->prepareSelect($p["table"], $p["fields"], $where . $order);
        if (isset($p["bindValues"])) {
            if ($p["bindValues"] != "undefined" && $p["bindValues"] != "") {
                foreach ($p["bindValues"] as $key => $value) {
                    $ca->bindValue(":" . $key, $value);
                }
            }
        }
        if (!$ca->exec()) {
            return nwMaker::error("Error " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateSelectTokenFieldGeneric($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $where = "1=1 ";
        $campos = "";
        if (isset($p["fields"])) {
            $campos = $p["fields"];
        }
        if (isset($p["fields_search"])) {
            $campos = $p["fields_search"];
        }
        $fields = "*";
        if (isset($p["fields_get"])) {
            $fields = $p["fields_get"];
        }
        $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        if (isset($p["where_add"])) {
            $where .= $p["where_add"];
        }
        if (isset($p["empresa"]) && $p["empresa"] == "SI") {
            $where .= " and empresa=:empresa ";
        }
        $ca->prepareSelect($p["table"], $fields, $where);
        if (isset($p["empresa"]) && $p["empresa"] == "SI") {
            $ca->bindValue(":empresa", $si["empresa"]);
        }
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateCitiesSelectTokenField($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1 ";
        $campos = "nombre";
        $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        $ca->prepareSelect("ciudades", "*", $where);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function getCities($name = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("ciudades", "*", "1=1 order by nombre asc");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return false;
        }

        if (!$name) {
            $name = "ciudad";
        }
        $rta = "";
        $rta .= "<select name='{$name}'  id='{$name}' class='selectbox_nwform selectbox_{$name} required' >";
        $rta .= "<option value='' >Seleccione</option>";
        for ($i = 0; $i < $total; $i++) {
            $r = $ca->flush();
            $rta .= "<option value='{$r["id"]}'>{$r["nombre"]}</option>";
        }
        $rta .= "<select>";
        return $rta;
    }

    public static function getConfigNwMaker() {
        $si = session::info();
        if (!isset($si["usuario"])) {
            $conf = nwprojectOut::nwpMakerConfig();
            if ($conf["config_login"]["permitir_acceso_sin_login"] == "SI") {
                $rta = self::continuegetConfigNwMaker();
                if ($rta == 0) {
                    return false;
                }
            } else {
                $rta = Array();
            }
            $rta["verifySession"] = nwMaker::verifySessionsIDMaker(false);
//            $rta["config_login"] = self::getConfigLoginNwMaker();
            $rta["config_login"] = $conf;
        } else {
//            $rta = self::continuegetConfigNwMaker();
            $rta = nwprojectOut::nwpMakerConfig();
        }
        return $rta;
    }

    public static function continuegetConfigNwMaker() {
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_codigo_oculto", "*", "activo='SI' limit 1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        $rta = Array();
        $rta["session"] = $si;
        $rta["config"] = $ca->flush();
        return $rta;
    }

    public static function getConfigLoginNwMaker() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_login", "*", "activo='SI' limit 1");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function FromTableById($data) {
        return self::deleteFromTableById($data);
    }

    public static function deleteFromTableById($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $field = "id";
        if (isset($p["field"])) {
            $field = $p["field"];
        }
        $where = "{$field}=:id";
        if (isset($p["where"])) {
            $where = $p["where"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete($p["table"], $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function loadInclude($data) {
        $p = nwMaker::getData($data);
        $file = "";
        if (isset($p["file"])) {
            $file = $p["file"];
        } else {
            $file = $p;
        }
        $params = "";
        if (isset($p["module_nwproject"])) {
            if (!empty($p["module_nwproject"])) {
                $db = NWDatabase::database();
                $ca = new NWDbQuery($db);
                $ca->prepareSelect("nwp_modulos", "nombre,parametros", "id=:id");
                $ca->bindValue(":id", $p["module_nwproject"]);
                if (!$ca->exec()) {
                    return nwMaker::error($ca->lastErrorText());
                }
                $ra = $ca->flush();
                if ($ca->size() == 0) {
                    return 0;
                }
                $file = "/modules/{$ra["nombre"]}/index.php";
//                $params = "form=1";
                $params = $ra["parametros"];
                $_GET = array();
                array_push($_GET, $p["get"]);
            }
        } else
        if (isset($_POST["get"])) {
            $_POST["get"] = $p["get"];
        }
        if (isset($p["params"])) {
            $params = $p["params"];
        }
        $filename = $_SERVER["DOCUMENT_ROOT"] . $file;
        if (is_file($filename)) {
            ob_start();
            $paramObject = $params;
            include $filename;
            return ob_get_clean();
        }
        return false;
    }

    public static function loadModuleComponentMakerNew($p) {
        $p = nwMaker::getData($p);
        if (!isset($p["id"])) {
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_modulos_componentes", "*", "modulo=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function loadModuleHomeMakerNew() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "a.activo='SI' and b.activo='SI'";
        $perfil = "";
        if (isset($_SESSION["profile"]) || isset($_SESSION["perfil"])) {
            if (isset($_SESSION["profile"])) {
                $perfil = $_SESSION["profile"];
            }
            if (isset($_SESSION["perfil"])) {
                $perfil = $_SESSION["perfil"];
            }
            $where .= " and a.perfil=:profile ";
        }
        $where .= " order by a.orden asc";
        $ca->prepareSelect("nwmaker_modulos_home a left join nwmaker_modulos b ON(a.modulo=b.id)", "a.*, b.js, b.css,b.titulo", $where);
        $ca->bindValue(":profile", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function getDataMenuMaker($p) {
        if (isset($p["data"])) {
            $p = $p["data"];
        }
        if (isset($p["menu_para_qxnw"])) {
            if ($p["menu_para_qxnw"] == true) {
                return nw_configuraciones::getButtonModules();
            }
        }
        $perfil = "";
        if (isset($_SESSION["profile"])) {
            $perfil = $_SESSION["profile"];
        }
        if (isset($_SESSION["perfil"])) {
            $perfil = $_SESSION["perfil"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $nivel = "1";
        $where = " a.activo='SI' ";
        if (isset($p["nivel"])) {
            $nivel = $p["nivel"];
        }
        $where .= " and a.nivel=:nivel  ";
        if (isset($_SESSION["profile"])) {
            $where .= " and b.perfil=:profile and b.consultar='SI' ";
        }
        if (isset($p["pertenece"])) {
            $where .= " and a.pertenece=:pertenece ";
            $ca->bindValue(":pertenece", $p["pertenece"]);
        }
        $where .= " order by a.orden asc ";
        $tab = "(a.callback=b.modulo)";
        if ($db->getDriver() != "MYSQL") {
            $tab = "(a.callback::int=b.modulo::int)";
        }
        $ca->prepareSelect("nwmaker_menu a left join nwmaker_permisos b ON {$tab} ", "a.*", $where);
        $ca->bindValue(":nivel", $nivel, true, true);
        if (isset($_SESSION["profile"])) {
            $ca->bindValue(":profile", $perfil, true, true);
        }
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function loadModuleHomeMaker() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_modulos_home", "*", "activo='SI' and perfil=:profile order by orden asc");
        $ca->bindValue(":profile", $_SESSION["profile"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return false;
        }
        $rta = "";
        for ($i = 0; $i < $total; $i++) {
            $r = $ca->flush();
            $rta .= "<div class='menuDashBoard menuDashBoard_{$r["id"]} menuDashBoard_ord_{$i}' style='width: {$r["ancho"]}; float: {$r["flotante"]}' >";
            $rta .= loadModuleMaker($r["modulo"]);
            $rta .= "</div>";
        }
        return $rta;
    }

    public static function menuModuleCallBack($callback) {
        if (isset($callback)) {
            if (!empty($callback)) {
                $callback = master::clean($callback);
                $id = $callback;
                return loadModuleMaker($id);
            }
        }
        return false;
    }

    public static function loadModuleMaker($id) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_modulos", "*", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $rta = " <div class='loadModulesHome'>";
//    $rta .= "<h2>{$r['titulo']}</h2>";
        $rta .= loadModuleComponentMaker($r["id"]);
        $rta .= "<script>{$r['js']}</script>";
        $rta .= "<style>{$r['css']}</style>";
        $rta .= "</div>";
        return $rta;
    }

//$containFileDirNum = 0;
//global $containFileDirNum;
    public static function loadModuleComponentMaker($id) {
        global $containFileDirNum;
        if ($containFileDirNum == "") {
            $containFileDirNum = 0;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_modulos_componentes", "*", "modulo=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return false;
        }
        $rta = "";
        for ($i = 0; $i < $total; $i++) {
            $r = $ca->flush();
            $html = true;
            $rta .= "<div class='loadModulesUnitary'>";
            if ($r['html'] == null || $r['html'] == "" || $r['html'] == "<p>0</p>" || str_replace(" ", "", strip_tags($r["html"])) == "0" || strip_tags($r["html"]) == "0") {
                $html = false;
            }
            if ($html) {
                $rta .= $r['html'];
            }

            if ($r['usar_modulo'] == "SI") {
                if ($r['nwproject_modulo'] != null && $r['nwproject_modulo'] != '' && $r['nwproject_modulo'] != 0) {
                    $mod = getModuleNwpById($r["nwproject_modulo"]);
                    $rta .= "<div class='containFileDir containFileDir_{$containFileDirNum}' >";
                    $rta .= loadModuleNwproject($mod['nombre'], $mod['parametros']);
                    $rta .= "</div>";
                }
            }
            if ($r['usar__tabla_maestro'] == "SI") {
                $fields = "";
                if ($r['maestro_columnas'] != null && $r['maestro_columnas'] != "") {
                    $fields = "," . $r['maestro_columnas'];
                }
                if ($r['maestro'] != null && $r['maestro'] != "" && $r['maestro'] != " ") {
                    $rta .= makeTable($r['maestro'] . $fields);
                }
            }

            if ($r['mostrar_archivo'] == "SI") {
                $rta .= "<div class='containFileDir containFileDir_{$containFileDirNum}' >";
                $filename = $_SERVER["DOCUMENT_ROOT"] . $r['ruta_archivo'];
                if (is_file($filename)) {
                    ob_start();
                    include $filename;
                    $rta .= ob_get_clean();
                }
                $rta .= "</div>";
                $containFileDirNum++;
            }

            $rta .= "</div>";
        }
        return $rta;
    }

    public static function getModuleNwpById($id) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwp_modulos", "*", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $total = $ca->size();
        if ($total == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function getLetters() {
        $r = Array();
        $r[0] = "a";
        $r[1] = "b";
        $r[2] = "c";
        $r[3] = "d";
        $r[4] = "e";
        $r[5] = "f";
        $r[6] = "g";
        $r[7] = "h";
        $r[8] = "i";
        $r[9] = "j";
        $r[10] = "k";
        $r[11] = "l";
        $r[12] = "m";
        $r[13] = "n";
        $r[14] = "o";
        $r[15] = "p";
        $r[16] = "q";
        return $r;
    }

    public static function getDataByTableMaster($data) {
        nwMaker::checkSession();
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $table = $p["table"] . " a";
//        print_r($p);
//        $fields = $p["fields"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where1 = "1=1 ";

        if (isset($p["filters"])) {
            foreach ($p["filters"] as $key => $value) {
                if ($value != "") {
                    $key = str_replace("_filter", "", $key);
                    if ($key == "buscar") {
                        //like...
                    } else {
                        if (count(explode("_text", $key)) == 1) {
                            $where1 .= " and a.{$key}='{$value}'  ";
                        }
                    }
                }
            }
        }
        //extrae las columnas y hace los joins para los selects, la tabla del join debe tener id  y nombre obligatoriamente
        $order = "";
        $fields = "";
//        $columnas = self::getColsByTableMaster($data);
        $columnas = $p["columnas"];
        $cols = $columnas["cols"];

        $tieneTerminal = false;
        $tieneusuario = false;
        $tienefecha = false;
        $let = 1;
        $letters = self::getLetters();
        $total = count($cols);
        $coma = "";
        for ($i = 0; $i < $total; $i++) {
            $r = $cols[$i];
            $input = $r["column_name"];
            $description = explode(",", $r["description"]);
            //hace el join
            if (isset($description[0])) {
                if ($description[0] == "selectBox") {
                    if (isset($description[1])) {
                        if ($description[1] != "array") {
                            $populate = $description[1];
                            if ($populate != "boolean" && $populate != "0" && $populate != null && $populate != false) {
                                if (!isset($letters[$let]))
                                    continue;
                                $letter = $letters[$let];
                                $table .= " left join {$populate} {$letter} ON (a.{$input}={$letter}.id)  ";
                                $fields .= $coma . "{$letter}.nombre as " . $input . "_text";
                                $let++;
                            }
                        }
                    }
                }
            }

            //agrega el campo normal sin join
            $fields .= $coma . "a." . $input;
            if ($i + 1 != $total) {
                $coma = ",";
            }

            if ($input == "terminal") {
                $tieneTerminal = true;
            }
            if ($input == "usuario") {
                $tieneusuario = false;
                if (isset($description[6])) {
                    if ($description[6] === true || $description[6] === "true" || $description[6] === "t" || $description[6] === "SI") {
                        $tieneusuario = true;
                    }
                }
            }

            if ($input == "fecha") {
                $tienefecha = true;
            }
        }

        if (isset($p["filter_by_user"])) {
            if ($p["filter_by_user"] == "NO" || $p["filter_by_user"] == false) {
                $tieneusuario = false;
            }
        }
        if (isset($p["filter_by_terminal"])) {
            if ($p["filter_by_terminal"] == "NO" || $p["filter_by_terminal"] == false) {
                $tieneTerminal = false;
            }
        }

        if ($tieneTerminal) {
            $where1 .= " and a.terminal=:terminal ";
        }
        if ($tieneusuario) {
            $where1 .= " and a.usuario=:usuario ";
        }
        if ($tienefecha) {
            $order = " order by fecha desc ";
        }
        if (isset($p["order"])) {
            $order = " order by " . $p["order"] . " ";
        }

        $order .= self::paginationLIst($data);

        $ca->prepareSelect($table, $fields, $where1 . " " . $order);
        if (isset($si["usuario"])) {
            $ca->bindValue(":usuario", $si["usuario"]);
        } else {
            $ca->bindValue(":usuario", "-110");
        }
        if (isset($si["terminal"])) {
            $ca->bindValue(":terminal", $si["terminal"] == "" ? 0 : $si["terminal"]);
        } else {
            $ca->bindValue(":terminal", "-10");
        }
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
//        return $ca->execPage($p["data"]);
    }

    public static function paginationLIst($p) {
        $db = NWDatabase::database();
        $driver = $db->getDriver();
        if (!isset($p["dataPaginationInit"])) {
            if ($driver == "PGSQL") {
                return " limit 12 offset 0 ";
            } else {
                return " limit 0,12 ";
            }
        }
        $init = $p["dataPaginationInit"];
        $end = $p["dataPaginationEnd"];
        if ($init === "#") {
            $init = 0;
        }
        if ($end === "#") {
            $end = 12;
        }
        if ($driver == "PGSQL") {
            return " limit 12 offset " . $init . " ";
        } else {
            return " limit " . $init . "," . $end . " ";
        }
    }

    public static function getColsByTableMaster($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
//        $table = $p["table"];
////        $fields = $p["fields"];
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
//        $driver = $db->getDriver();
//        $database = $db->getDatabaseName();
//        $table_schema = "information_schema.columns";
//        if ($driver == "MYSQL") {
//            $columnas = "COLUMN_NAME,DATA_TYPE,COLUMN_COMMENT";
//            $colName = "COLUMN_NAME";
//        } else {
//            $columnas = "*";
//            $colName = "column_name";
//        }
//
//        $where = "1=1 ";
//        $orderCols = "";
//        if ($driver == "MYSQL") {
//            $orderCols = " ordinal_position ";
//        } else {
//            $orderCols = " ordinal_position ";
//        }
//        $fields = "*";
//        if ($fields == "*") {
//            if ($driver == "MYSQL") {
//                $where .= " and table_schema=:db and  table_name=:table";
//            } else {
//                $where .= " and table_name=:table";
//            }
//        } else {
//            if ($driver == "MYSQL") {
//                $whereAll = " and table_schema=:db and  table_name=:table";
//            } else {
//                $whereAll = " and table_name=:table";
//            }
//            $expFields = explode(",", $fields);
//            for ($ra = 0; $ra < count($expFields); $ra++) {
//                $intOp = "or";
//                if ($ra == 0)
//                    $intOp = "and";
//                $where .= " {$intOp} column_name='{$expFields[$ra]}' {$whereAll} ";
//            }
//        }
//        
//        $where = "1=1 ";
//        if ($driver == "MYSQL") {
//            $columnas = "COLUMN_NAME,COLUMN_COMMENT as description,IS_NULLABLE,DATA_TYPE";
//            $where .= " and table_schema=:db and  table_name=:table";
//        }
//        if ($driver == "PGSQL") {
//            $columnas = "column_name,data_type,is_nullable,  
//                (select pg_catalog.col_description(oid, cols.ordinal_position::int)
//                from pg_catalog.pg_class c
//                where c.relname = information_schema.table_name
//                ) as description";
//            $where .= " and table_name=:table";
//        } else {
//            $where .= " and table_name=:table";
//        }
//        $ca->prepareSelect("information_schema.columns", $columnas, $where, " ordinal_position ");
//        $ca->bindValue(":table", $table);
//        $ca->bindValue(":db", $database);
//        if (!$ca->exec()) {
//              return nwMaker::error($ca->lastErrorText());
//        }
//        return $ca->assocAll();
        $p["nwmaker"] = true;
        return master::getColumnsAndDescriptions($p);
    }

    public static function insertOrUpdateMasterNwMaker($data) {
        nwMaker::checkSession();
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }

        $fields = "";
        for ($i = 0; $i < count($p["cols"]); $i++) {
            $value = $p["cols"][$i];
            $coma = ",";
            if ($i == 0) {
                $coma = "";
            }
            $column_name = $value["column_name"];
            $fields .= $coma . $column_name;
        }

        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id = $p["data"]["id"];
        $id_new = master::getMaxId($p["table"], $db, false);
        $id_new++;

        if ($id == "") {
            $ca->prepareInsert($p["table"], $fields);
        } else {
            $ca->prepareUpdate($p["table"], $fields, "id=:id");
        }

        for ($i = 0; $i < count($p["cols"]); $i++) {
            $value = $p["cols"][$i];
            $column_name = $value["column_name"];
            $key = ":" . $column_name;
            $val = $p["data"][$column_name];
            if ($id == "") {
                if ($column_name == "id") {
                    $val = $id_new;
                }
            }
            if ($column_name == "usuario") {
                $val = $si["usuario"];
            }
            if ($column_name == "terminal") {
                $val = $si["terminal"];
            }
            if ($column_name == "fecha") {
                $val = date("Y-m-d H:i:s");
            }
            $ca->bindValue($key, $val, true, true);
        }

        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaPlanesPorID($data) {
        $id = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_planes", "*", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consultaDatosCuenta($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "numero_cuenta,banco,tipo_cuenta", "id=:usuario and empresa=:empresa and numero_cuenta is not null and numero_cuenta <> ''");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["id_usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveDatosCuenta($p) {
        $p = nwMaker::getData($p);
        $usuario = nwMaker::getUser($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("pv_clientes", "numero_cuenta,banco,tipo_cuenta", "id=:usuario and empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["id_usuario"]);
        $ca->bindValue(":numero_cuenta", $p["numero_cuenta"]);
        $ca->bindValue(":banco", $p["banco"]);
        $ca->bindValue(":tipo_cuenta", $p["tipo_cuenta"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function savePagosEmpresas($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_pagos_empresas", "documento,nombre,comprobante_pago,valor,fecha_pago,estado,observaciones,usuario,perfil,empresa,fecha,tipo");
        $ca->bindValue(":documento", $p["documento"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":comprobante_pago", $p["comprobante_pago"]);
        $ca->bindValue(":valor", $p["valor"]);
        $ca->bindValue(":fecha_pago", $p["fecha_pago"]);
        $ca->bindValue(":estado", "EN REVISION");
        $ca->bindValue(":tipo", 'PAGO');
        $ca->bindValue(":observaciones", $p["observaciones"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaHistoricoPagos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_pagos_empresas", "*", "usuario=:usuario and empresa=:empresa and perfil=:perfil and tipo=:tipo order by id desc");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":tipo", 'PAGO');
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveRetirosFondos($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $ca->prepareInsert("nw_pagos_empresas", "documento,nombre,valor,estado,observaciones,usuario,perfil,empresa,fecha,tipo");
        $ca->bindValue(":documento", $p["documento"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":valor", $p["valor"]);
        $ca->bindValue(":estado", "SOLICITUD");
        $ca->bindValue(":tipo", "RETIRO");
        $ca->bindValue(":observaciones", $p["observaciones"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", $fecha);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaHistoricoRetiros($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_pagos_empresas", "*", "usuario=:usuario and empresa=:empresa and perfil=:perfil and tipo=:tipo order by id desc");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":tipo", 'RETIRO');
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaPuntaje($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_calificaciones", "puntuacion,numero_servicios", "empresa=:empresa  and perfil=:perfil and usuario=:usuario");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return $array = ["puntuacion" => 0, "total_servicios" => 0, "puntajes" => 0];
        }
        $val = $ca->flush();
        $punt = json_decode($val["puntuacion"]);
        $total = 0;
        foreach ($punt as $key => $value) {
            $total = intval($total) + intval($value);
        }
        $total_servicios = intval($val["numero_servicios"]);
        $total = $total / $total_servicios;

        $array = ["puntuacion" => $total, "total_servicios" => $total_servicios, "puntajes" => $punt];
        return $array;
    }

    public static function creaPreTransaccion($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["z_fromlib_fecha_hora_actual_navigator_cliente"])) {
            $fecha = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        }
        $nombre = null;
        $correo = null;
        $foto = null;
        $idFacebook = null;
        $jsonFb = null;
        if (isset($p["nombre"])) {
            $nombre = $p["nombre"];
        }
        if (isset($p["correo"])) {
            $correo = $p["correo"];
        }
        if (isset($p["foto"])) {
            $foto = $p["foto"];
        }
        if (isset($p["jsonFb"])) {
            $jsonFb = $p["jsonFb"];
        }
        $id = master::getMaxId("donaciones_sin_pagar");
        $id = $id + 1;
        $f = "id,fecha,nombre,correo,json,valor_total,currency,foto,idFacebook,jsonFb";
        $ca->prepareInsert("donaciones_sin_pagar", $f);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":nombre", $nombre);
        $ca->bindValue(":correo", $correo);
        $ca->bindValue(":foto", $foto);
        $ca->bindValue(":idFacebook", $idFacebook);
        $ca->bindValue(":jsonFb", $jsonFb);
        $ca->bindValue(":json", $p["json"]);
        $ca->bindValue(":valor_total", $p["tx_value"]);
        $ca->bindValue(":currency", $p["currency"]);
        if (!$ca->exec()) {
            return nwMaker::error("Error " . $ca->lastErrorText());
        }
        return $id;
    }
}
