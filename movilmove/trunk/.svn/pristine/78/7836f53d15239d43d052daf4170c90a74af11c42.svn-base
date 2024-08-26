<?php
$user = "NETCAR";
$pass = "N3tc4r20";
$subject = "Prueba";
$body = "Hola%20mundo&to%5B%5D";
$to = "orionjafe@gmail.com";
$fromEmail = "info@app.movilmove.com"; 
$replyTo = "soporte@mailreplay.movilmove.com"; 
//$replyTo = "soporte@netcar.company";

$curl = curl_init();
curl_setopt_array($curl, array(
//    CURLOPT_URL => "http://sender.colombiagroup.com.co/temp.php",
    CURLOPT_URL => "http://mailing.colombiagroup.com.co/temp.php",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS =>
    "body={$body}=to{$to}&subject={$subject}&fromEmail={$fromEmail}&replyTo={$replyTo}&user={$user}&password={$pass}",
    CURLOPT_HTTPHEADER => array(
        "Content-Type: application/x-www-form-urlencoded"
    ),
));
$response = curl_exec($curl);
curl_close($curl);
echo $response;
