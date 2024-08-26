<?php

class NWPayEpayco {

    static $epayco = null;
    static $epayco_error = null;
    static $token;
    static $customer;

    public function construct($p) {
        include __DIR__ . '/../vendor/autoload.php';

        if (!isset($p["apiKey"])) {
            self::$epayco_error = "apiKey no puede estar vacía";
            return "apiKey no puede estar vacía";
        }
        if (!isset($p["privateKey"])) {
            self::$epayco_error = "privateKey no puede estar vacía";
            return "privateKey no puede estar vacía";
        }
        if (!isset($p["lenguage"])) {
            self::$epayco_error = "lenguage no puede estar vacía";
            return "lenguage no puede estar vacía";
        }
        if (!isset($p["test"])) {
            self::$epayco_error = "test no puede estar vacía";
            return "test no puede estar vacía";
        }
        self::$epayco = new Epayco\Epayco(array(
            "apiKey" => $p["apiKey"],
            "privateKey" => $p["privateKey"],
            "lenguage" => $p["lenguage"],
            "test" => $p["test"]
        ));
        return self::$epayco;
    }

    public function registerCustomerCreditAndCard($p) {
        $r = Array();
        $r["error"] = false;
        $r["status"] = "OK";
        if (self::$epayco === null) {
            $r["error"] = true;
            $r["status"] = "epayco no ha sido iniciado. " . self::$epayco_error;
            return $r;
        }

        $card = Array();
        $card["card[number]"] = $p["card_number"];
        $card["card[exp_year]"] = $p["card_exp_year"];
        $card["card[exp_month]"] = $p["card_exp_month"];
        $card["card[cvc]"] = $p["card_cvc"];
        self::$token = self::$epayco->token->create($card);
        if (self::$token->data->status !== "exitoso") {
            $r["status"] = "FAIL_REGISTER_CREDIT_CARD";
            $r["error"] = true;
            $r["message"] = self::$token->message;
            $r["message_description"] = self::$token->data->description;
            $r["errors"] = self::$token->data->errors;
            $r["data"] = self::$token;
            return $r;
        }

        $data = Array();
        $data["token_card"] = self::$token->id;
        $data["name"] = $p["name"];
        $data["email"] = $p["email"];
        if (isset($p["last_name"]) && $p["last_name"] !== "" && $p["last_name"] !== null && $p["last_name"] !== false) {
            $data["last_name"] = $p["last_name"];
        }
        $data["default"] = true;
        if (isset($p["city"]) && $p["city"] !== "" && $p["city"] !== null && $p["city"] !== false) {
            $data["city"] = $p["city"];
        }
        if (isset($p["address"]) && $p["address"] !== "" && $p["address"] !== null && $p["address"] !== false) {
            $data["address"] = $p["address"];
        }
        if (isset($p["phone"]) && $p["phone"] !== "" && $p["phone"] !== null && $p["phone"] !== false) {
            $data["phone"] = $p["phone"];
        }
        if (isset($p["cell_phone"]) && $p["cell_phone"] !== "" && $p["cell_phone"] !== null && $p["cell_phone"] !== false) {
            $data["cell_phone"] = $p["cell_phone"];
        }
        self::$customer = self::$epayco->customer->create($data);
        if (self::$customer->data->status !== "exitoso") {
            $r["status"] = "FAIL_REGISTER_CUSTOMER";
            $r["error"] = true;
            $r["message"] = self::$customer->message;
            $r["message_description"] = self::$customer->data->description;
            $r["errors"] = self::$customer->data->errors;
            $r["data"] = self::$customer;
            return $r;
        }

        $r["customer_id"] = self::$customer->data->customerId;
        $r["token_card"] = self::$token->id;
        $r["customer_data"] = self::$customer;
        $r["token_card_data"] = self::$token;
        return $r;
    }

    public function getCustomer($id) {
        $r = Array();
        $r["error"] = false;
        $r["status"] = "OK";
        if (self::$epayco === null) {
            $r["error"] = true;
            $r["status"] = "epayco no ha sido iniciado " . self::$epayco_error;
            return $r;
        }
        return self::$epayco->customer->get($id);
    }

    public function pay($p) {
        $r = Array();
        $r["error"] = false;
        $r["status"] = "OK";
        if (self::$epayco === null) {
            $r["error"] = true;
            $r["status"] = "epayco no ha sido iniciado " . self::$epayco_error;
            return $r;
        }

        $d = Array();
        $d["token_card"] = $p["token_card"];
        $d["customer_id"] = $p["customer_id"];
        $d["name"] = $p["name"];
        if (isset($p["doc_type"]) && $p["doc_type"] !== "" && $p["doc_type"] !== null && $p["doc_type"] !== false) {
            $d["doc_type"] = $p["doc_type"];
        }
        if (isset($p["doc_number"]) && $p["doc_number"] !== "" && $p["doc_number"] !== null && $p["doc_number"] !== false) {
            $d["doc_number"] = $p["doc_number"];
        }
        if (isset($p["last_name"]) && $p["last_name"] !== "" && $p["last_name"] !== null && $p["last_name"] !== false) {
            $d["last_name"] = $p["last_name"];
        }
        $d["email"] = $p["email"];
        $d["bill"] = $p["bill"];
        $d["description"] = $p["description"];
        $d["value"] = $p["value"];
        $d["tax_base"] = $p["tax_base"];
        $d["currency"] = $p["currency"];
        $d["dues"] = $p["dues"];
        if (isset($p["address"]) && $p["address"] !== "" && $p["address"] !== null && $p["address"] !== false) {
            $d["address"] = $p["address"];
        }
        if (isset($p["phone"]) && $p["phone"] !== "" && $p["phone"] !== null && $p["phone"] !== false) {
            $d["phone"] = $p["phone"];
        }
        if (isset($p["cell_phone"]) && $p["cell_phone"] !== "" && $p["cell_phone"] !== null && $p["cell_phone"] !== false) {
            $d["cell_phone"] = $p["cell_phone"];
        }
        $d["url_response"] = "https://tudominio.com/respuesta.php";
        $d["url_confirmation"] = "https://tudominio.com/confirmacion.php";

        $pay = self::$epayco->charge->create($d);

        if (isset($pay->data->status) && $pay->data->status === "error") {
            $r["status"] = "FAIL_PAYMENT";
            $r["error"] = true;
            $r["message"] = $pay->message;
            $r["message_description"] = $pay->data->description;
            $r["errors"] = $pay->data->errors;
            $r["data"] = $pay;
            return $r;
        }
        $r["ref_payco"] = $pay->data->ref_payco;
        $r["factura"] = $pay->data->factura;
        $r["estado"] = $pay->data->estado;
        $r["respuesta"] = $pay->data->respuesta;
        $r["autorizacion"] = $pay->data->autorizacion;
        $r["recibo"] = $pay->data->recibo;
        $r["data"] = $pay;
        return $r;
    }

    public function test() {
        $rta = "";

        $pay = new NWPayEpayco();
//$array = $pay->getCustomer("AMaoqSMrBYJNx8d2s");
        $p = Array();
        $p["name"] = "Alexander";
        $p["last_name"] = "Flórez";
        $p["email"] = "orionjafe@gmail.com";
        $p["card_number"] = "4575623182290326";
        $p["card_exp_year"] = "2025";
        $p["card_exp_month"] = "12";
        $p["card_cvc"] = "123";
        $p["city"] = false;
        $p["address"] = false;
        $p["phone"] = false;
        $p["cell_phone"] = false;
        $cus = $pay->registerCustomerCreditAndCard($p);
        if ($cus["status"] !== "OK") {
            $rta .= $cus["status"];
            $rta .= "<br />";
            $rta .= $cus["message"];
            $rta .= "<br />";
            $rta .= $cus["message_description"];
            $rta .= "<br />";
            $rta .= $cus["errors"];
            $d = json_encode($cus);
            $rta .= "<br />ALL_DATA: ------>" . strip_tags($d) . " <------- END_ALL_DATA ----->";
            return $rta;
        }

        $rand = $token = rand(100000, 999999);
        $p["customer_id"] = $cus["customer_id"];
        $p["token_card"] = $cus["token_card"];
        $p["bill"] = "NW-{$rand}";
        $p["doc_type"] = "CC";
        $p["doc_number"] = "123456789";
        $p["description"] = "Pago de prueba NW desde " . $_SERVER["HTTP_HOST"];
        $p["value"] = "10000";
        $p["tax"] = "0";
        $p["tax_base"] = "0";
        $p["currency"] = "COP";
        $p["dues"] = "1";
        $payment = $pay->pay($p);
        if ($payment["status"] !== "OK") {
            $rta .= $payment["status"];
            $rta .= "<br />";
            $rta .= $payment["message"];
            $rta .= "<br />";
            $rta .= $payment["message_description"];
            $rta .= "<br />";
            $rta .= $payment["errors"];

            $d = json_encode($payment);
            $rta .= "<br />ALL_DATA: ------>" . strip_tags($d) . " <------- END_ALL_DATA ----->";

            return $rta;
        }
        if ($payment["estado"] === "Rechazada") {
            $rta .= "PAGO RECHAZADO";
            $rta .= "<br />ref_payco: " . $payment["ref_payco"];
            $rta .= "<br />factura: " . $payment["factura"];
            $rta .= "<br />estado: " . $payment["estado"];
            $rta .= "<br />respuesta: " . $payment["respuesta"];
            $rta .= "<br />autorizacion: " . $payment["autorizacion"];
            $rta .= "<br />recibo: " . $payment["recibo"];
            $d = json_encode($payment);
            $rta .= "<br />ALL_DATA: ------>" . strip_tags($d) . " <------- END_ALL_DATA ----->";
            return $rta;
        }
        $rta .= "PAGO OK!!!";
        $rta .= "<br />ref_payco: " . $payment["ref_payco"];
        $rta .= "<br />factura: " . $payment["factura"];
        $rta .= "<br />estado: " . $payment["estado"];
        $rta .= "<br />respuesta: " . $payment["respuesta"];
        $rta .= "<br />autorizacion: " . $payment["autorizacion"];
        $rta .= "<br />recibo: " . $payment["recibo"];
        $d = json_encode($payment);
        $rta .= "<br />ALL_DATA: ------>" . strip_tags($d) . " <------- END_ALL_DATA ----->";
        return $rta;
    }

}

//if (isset($_GET["test"])) {
//    if ($_GET["test"] === "ok") {
//        $pay = new NWPayEpayco();
//        $d = Array();
//        $d["apiKey"] = "f3566b13f1e134574b53e67121b5a588";
//        $d["privateKey"] = "88f87ecd01d826fec3310ad6be8e2ae7";
//        $d["lenguage"] = "ES";
//        $d["test"] = true;
//        $pay->construct($d);
//        $r = $pay->test();
//        print_r($r);
//    }
//}