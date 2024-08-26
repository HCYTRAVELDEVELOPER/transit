<?php
Header("content-type: application/x-javascript");
$serverIP = $_SERVER['REMOTE_ADDR'];
echo "document.write(\"Your IP address is: <b>" . $serverIP . "</b>\");";
echo "document.write(\"<script src='/nwlib6/modulos/nwanimate/js/jquery-1.10.2.js'></script>\");";
echo "alert({$_GET["escena"]})";
?>