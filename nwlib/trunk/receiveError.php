<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

function functionExists($func) {
    if (ini_get('safe_mode'))
        return false;
    $disabled = ini_get('disable_functions');
    if ($disabled) {
        $disabled = explode(',', $disabled);
        $disabled = array_map('trim', $disabled);
        return !in_array($func, $disabled);
    }
    return true;
}

$img = file_get_contents("php://input");
$img = str_replace('data:image/octet-stream;base64,', '', $img);
if (functionExists('base64_decode')) {
    $data = base64_decode($img);
} else {
    $data = mb_convert_encoding($img, "UTF-8", "BASE64");
}
$fileName = uniqid() . ".jpg";
$file = $_SERVER["DOCUMENT_ROOT"] . "/tmp/" . $fileName;
if (!file_exists($_SERVER["DOCUMENT_ROOT"] . "/tmp/")) {
    echo "";
    return;
}
file_put_contents($file, $data);
$alterFile = "http://" . $_SERVER["HTTP_HOST"] . "/tmp/" . $fileName;
echo $alterFile;