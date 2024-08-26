<?php

$p = Array();
$p["token"] = "dCzGWho_XJ8:APA91bEsu0CsvhMhVlaBwsDRPILaK3HxZA0UUtZOjYUpEnEOaAqfgF-2w-gY0YO6Rsi3S5QWJaqs7wGzPMcfr1O-lN2420OldItRMRgyJIAtSVW29aImJqMJ7MVUAAjkVZwA_MryM8J-";
$p["body"] = "Hola que pasa";
$p["title"] = "Hola";
$p["data"] = "";
$p["icon"] = "fcm_push_icon";
$p["click_action"] = "";
$p["sound"] = "default";
$p["callback"] = "FCM_PLUGIN_ACTIVITY";

$ch = curl_init("https://fcm.googleapis.com/fcm/send");
$header = array('Content-Type: application/json',
    "Authorization: key=AIzaSyCOoH2AZXucFRnHljZOQxQC8PPwtuIqIss");
curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "{ \"notification\": { \"data\": \"{}\", \"click_action\": \"{$p["callback"]}\", \"icon\": \"{$p["icon"]}\", \"title\": \"{$p["title"]}\",    \"text\": \"{$p["body"]}\"  },    \"to\" : \"{$p["token"]}\"}");

$result = curl_exec($ch);
if ($result === FALSE) {
    die('Oops! FCM Send Error: ' . curl_error($ch));
    echo ('Oops! FCM Send Error: ' . curl_error($ch));
    return ('Oops! FCM Send Error: ' . curl_error($ch));
}
curl_close($ch);
