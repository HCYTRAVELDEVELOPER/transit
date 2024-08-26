<?php

//header("Content-type: application/octet-stream");
//header("Content-type: application/vnd.ms-excel; name='excel'");
$name = "ficheroExcel";
if (isset($_POST['name'])) {
    $name = $_POST['name'];
}
header("Content-Type:   application/vnd.ms-excel; charset=utf-8");
header("Content-Disposition: filename=ficheroExcel{$name}.xls");
header("Pragma: no-cache");
header("Expires: 0");
echo utf8_decode($_POST['datos_a_enviar']);
?>
