<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.conekta.io/js/latest/conekta.js"></script>
<script type="text/javascript" >
    Conekta.setPublicKey('key_Bks5AsVrZxP5ro3G79YaHzg');
    var conektaSuccessResponseHandler = function (token) {
        console.log("token", token);
        console.log("token.id", token.id);
        var $form = $("#card-form");
        $form.append($('<input type="hidden" name="conektaTokenId" id="conektaTokenId">').val(token.id));
    };
    var conektaErrorResponseHandler = function (response) {
        var $form = $("#card-form");
        $form.find(".card-errors").text(response.message_to_purchaser);
        $form.find("button").prop("disabled", false);
    };


    //jQuery para que genere el token después de dar click en submit
    $(function () {
        $("#card-form").submit(function (event) {
            var $form = $(this);
            // Previene hacer submit más de una vez
            $form.find("button").prop("disabled", true);
            console.log("$form", $form);
            Conekta.Token.create($form, conektaSuccessResponseHandler, conektaErrorResponseHandler);
            return false;
        });
    });
</script>

<form action="" method="POST" id="card-form">
    <span class="card-errors"></span>
    <div>
        <label>
            <span>Nombre del tarjetahabiente</span>
            <input type="text" size="20" data-conekta="card[name]" value="AlexF">
        </label>
    </div>
    <div>
        <label>
            <span>Número de tarjeta de crédito</span>
            <input type="text" size="20" data-conekta="card[number]" value="4122761896646819">
        </label>
    </div>
    <div>
        <label>
            <span>CVC</span>
            <input type="text" size="4" data-conekta="card[cvc]" value="123">
        </label>
    </div>
    <div>
        <label>
            <span>Fecha de expiración (MM/AAAA)</span>
            <input type="text" size="2" data-conekta="card[exp_month]" value="12">
        </label>
        <span>/</span>
        <input type="text" size="4" data-conekta="card[exp_year]" value="2023">
    </div>
    <button type="submit">Crear token</button>
</form>


<?php
//require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$p = Array();
//$p["token_id"] = "tok_2qV8w1CwehB7ovpsj";
$p["payment_method_type"] = "card";
$p["reference"] = "12987324097";
//$p["payment_method_type"] = "oxxo_cash";
//$p["payment_method_type"] = "spei";
$p["more_info"] = "Pruebas Nw";
$p["ruta"] = "/app/pagos/";
$p["name"] = "AlexF";
$p["email"] = "orionjafe@gmail.com";
$p["phone"] = "+52181818181";
$p["perfil"] = "2";
$p["empresa"] = "24";
$p["terminal"] = "1";
$p["itemName"] = "Prueba Nw Api";
$p["itemDescription"] = "Descripción Prueba Nw API";
$p["item_unit_price"] = "300";
$p["itemQuantity"] = "1";
$p["street1"] = "Calle 123, int 2";
$p["postal_code"] = "06100";
$p["country"] = "MX";
$p["currency"] = "MXN";
//$r = nwMaker::payConektaByApi($p);
//print_r($r);
//return;
//Inicialización del cliente Conekta a través de la adición de la llave privada y versión del API.
require_once $_SERVER['DOCUMENT_ROOT'] . $p["ruta"] . 'conekta-php-master/lib/Conekta.php';
\Conekta\Conekta::setApiKey("key_T8ct5EThjriCbiL4sBGvDQ");
\Conekta\Conekta::setApiVersion("2.0.0");


//Para los siguientes pasos en la integración un token_id de prueba se provee. 
//Para tener acceso al token que se generó en el paso 1.0 → es necesario accesarlo en el objeto conektaSuccessResponseHandler["id"] 
//Generación del cliente y la información de pago.
//try {
//    $customer = \Conekta\Customer::create(
//                    [
//                        "name" => $p["name"],
//                        "email" => $p["email"],
//                        "phone" => $p["phone"],
//                        "metadata" => ["reference" => $p["reference"], "random_key" => "random value"],
//                        "payment_sources" => [
//                            [
//                                "type" => $p["payment_method_type"],
//                                "token_id" => $p["token_id"]
//                            ]
//                        ]//payment_sources
//                    ]//customer
//    );
//} catch (\Conekta\ProccessingError $error) {
//    echo $error->getMesage();
//    return false;
//} catch (\Conekta\ParameterValidationError $error) {
//    echo $error->getMessage();
//    return false;
//} catch (\Conekta\Handler $error) {
//    echo $error->getMessage();
//    return false;
//}
//$customer_id = $customer["id"];
$customer_id = "cus_2qV8w6uj5qjVUG5Up";

// print_r($customer);

echo "<br />ID::customer_id: " . $customer_id . "<br />";

//Implementación de una orden.
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
                        "currency" => $p["currency"],
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
    echo $error->getMessage();
    return false;
} catch (\Conekta\ParameterValidationError $error) {
    echo $error->getMessage();
    return false;
} catch (\Conekta\Handler $error) {
    echo $error->getMessage();
    return false;
}
echo "<h1>Pago exitoso!</h1><br />";
echo "ID: " . $order->id . "<br />";
echo "Status: " . $order->payment_status . "<br />";
echo "$" . $order->amount / 100 . $order->currency . "<br />";
echo "Order" . "<br />";
echo $order->line_items[0]->quantity .
 " - " . $order->line_items[0]->name .
 " - $" . $order->line_items[0]->unit_price / 100 . "<br />";
echo "Payment info" . "<br />";
echo "CODE:" . $order->charges[0]->payment_method->auth_code . "<br />";
echo "Card info:" . "<br />" .
 " - " . $order->charges[0]->payment_method->name .
 " - " . $order->charges[0]->payment_method->last4 .
 " - " . $order->charges[0]->payment_method->brand .
 " - " . $order->charges[0]->payment_method->type;


// Si la orden fue exitosa la respuesta debería imprimir lo siguiente:
// Respuesta:
// ID: ord_2fsQdMUmsFNP2WjqS
// $ 1215.0 MXN
// Order
// 120 - Tacos - $10.0
// Payment info
// CODE: 035315
// Card info: 4242 - visa - banco - credit
?>