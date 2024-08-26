<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

include_once 'phpqrcode.php';

if (!isset($_GET["key"])) {
    echo "No tiene autorización para ingresar al módulo";
    return;
}
if ($_GET["key"] != "nwadmin123XfTr") {
    echo "No tiene autorización para ingresar al módulo";
    return;
}

$size = 3;
$text = "";

if (isset($_GET["size"])) {
    $size = strip_tags($_GET["size"]);
}
if (isset($_GET["text"])) {
    $text = $_GET["text"];
}

QRcode::png($text, false, QR_ECLEVEL_L, $size);

//BEGIN:VCARD
//VERSION:3.0
//N:Andrés;Flórez
//FN:Andrés Flórez
//ORG:Netwoods.net
//URL:http://www.netwoods.net/
//EMAIL:direccion@netwoods.net
//TEL;TYPE=voice,work,pref:+571 3125743001
//END:VCARD
?>