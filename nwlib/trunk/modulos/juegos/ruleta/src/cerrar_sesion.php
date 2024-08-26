<?php
include($_SERVER['DOCUMENT_ROOT'] . "/../utiles.php");
//session_name('login');
session_start();
session_destroy();
unset ($cookie['access_token']);
//alert("Sesion cerrada correctamente. ");
//php_location($_SERVER["HTTP_REFERER"]);
setcookie("username", "", time() + (60 * 60 * 24 * 365));
setcookie("marca", "", time() + (60 * 60 * 24 * 365));
?>
<script>
//    alert("Sesion cerrada correctamente. ");
    window.location.href = "http://" + document.domain + "/tiendaredwings";
//    window.location.reload();
</script>

