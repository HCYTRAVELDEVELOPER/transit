<?php
//header("Content-type: application/octet-stream");
//header("Content-type: application/vnd.ms-excel; name='excel'");
header("Content-Type:   application/vnd.ms-excel; charset=utf-8");
header("Content-Disposition: filename=ficheroExcel.xls");
header("Pragma: no-cache");
header("Expires: 0");
echo utf8_decode($_POST['datos_a_enviar']);
?>