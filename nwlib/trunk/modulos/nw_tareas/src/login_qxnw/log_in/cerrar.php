<?php
include($_SERVER['DOCUMENT_ROOT'] . "/nwproject/php/utiles.php");
//session_name('login');
session_start();
session_destroy();
unset ($cookie['access_token']);
//alert("Sesion cerrada correctamente. ");
php_location($_SERVER["HTTP_REFERER"]);
?>
