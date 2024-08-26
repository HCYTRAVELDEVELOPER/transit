<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://www.howsmyssl.com/a/check");
curl_setopt($ch, CURLOPT_SSLVERSION, 6);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);
$tlsVer = json_decode($response, true);
echo "<h1>Your TSL version is: <u>" . ( $tlsVer['tls_version'] ? $tlsVer['tls_version'] : 'no TLS support' ) . "</u></h1>";