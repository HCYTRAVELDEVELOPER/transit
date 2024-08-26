<!DOCTYPE html>
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
        checkoutRequestId: "42a4c95e-0db2-4ae8-9bb3-ea681acc8281, // checkout request id
        publicKey: "public_api_key_XXXXXXXX",
        options: {},
        styles: {},
        onFinalizePayment: function(event){
            console.log(event);
        }
    })
    </script>
</body>