<?php
//Inicialización del cliente Conekta a través de la adición de la llave privada y versión del API.
//$llavePrivada = "key_eYvWV7gSDkNYXsmr";//test demo
 //test demo my company Estefanía...
$llavePublica = "key_JcZGTF8QgdW5fAn5q9zFbKg";
$llavePrivada = "key_GC8FW5nv8WEKSf3h3ppyxw";
//Producción
//$llavePublica = "key_Bks5AsVrZxP5ro3G79YaHzg";
//$llavePrivada = "key_T8ct5EThjriCbiL4sBGvDQ";

require_once("conekta-php-master/lib/Conekta.php");
\Conekta\Conekta::setApiKey($llavePrivada);
\Conekta\Conekta::setApiVersion("2.0.0");
//
$validCustomer = [
    'name' => "Alexander Flórez",
    'email' => "orionjafe@gmail.com"
];
$customer = \Conekta\Customer::create($validCustomer);

echo "<h1>Class:: Custormer create</h1>";
echo $customer;
echo "<br />";

$validOrderWithCheckout = array(
    'line_items' => array(
        array(
            'name' => 'Prueba Viaje1',
            'description' => 'Prueba Viaje1 Descp.',
            'unit_price' => 90000,
            'quantity' => 1
        )
    ),
    "shipping_lines" => array(
        array(
            "amount" => 0
        )
    ),
    "shipping_contact" => array(
        "address" => array(
            "street1" => "Calle 123, int 2",
            "postal_code" => "06100",
            "country" => "MX"
        )
    ),
    'checkout' => array(
        'allowed_payment_methods' => array("cash", "card", "bank_transfer"),
        'monthly_installments_enabled' => true,
        'monthly_installments_options' => array(3, 6, 9, 12)
    ),
    'customer_info' => array(
        'customer_id' => $customer["id"]
    ),
    'currency' => 'mxn',
    'metadata' => array('test' => 'extra info')
);
$order = \Conekta\Order::create($validOrderWithCheckout);
$array = json_decode(json_encode($order), true);
echo "<h1>Class:: Order create</h1>";
print_r($array);
$checkoutRequestId = $array["checkout"]["id"];
//print_r($checkoutRequestId);
echo "<br />";
//echo "checkoutRequestId: <br />";
?>


<html>
    <head>
        <meta charset="utf-8">
        <title>Checkout</title>
        <script type="text/javascript" src="https://pay.conekta.com/v1.0/js/conekta-checkout.min.js"></script>
    </head>
    <body>
        <div id="conektaIframeContainer" style="height: 700px;"></div>
        <script type="text/javascript">
            window.ConektaCheckoutComponents.Integration({
                targetIFrame: "#conektaIframeContainer",
                checkoutRequestId: "<?php echo $checkoutRequestId; ?>", // checkout request id
//                checkoutRequestId: "70b4aca8-305f-4a42-a0a2-90fe7a4e34cc", // checkout request id
                //        publicKey: "key_D8CpFzCk4x7Ho5Cr9xosgcA",
                publicKey: "<?php echo $llavePublica; ?>",
                // paymentMethods: ["Cash"],
                onCreateTokenSucceeded: function (token) {
                    console.log(token)
                },
                onCreateTokenError: function (error) {
                    console.log(error)
                },
                onFinalizePayment: function (event) {
                    console.log(event)
                },
                onErrorPayment: function (event) {
                    console.log(event)
                }
            });
        </script>
    </body>
</html>