<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

$db_other = new NWDatabase();
//$db->setDriver(NWDatabase::MYSQL);
$db_other->setDriver(NWDatabase::PGSQL);
$db_other->setHostName("192.168.1.26");
//    $db->setPort($p["puerto"]);
$db_other->setDatabaseName("msf");
$db_other->setUserName("andresf");
$db_other->setPassword('padre18');
$db_other->open_();

//$db = NWDatabase::database();
//$ca = new NWDbQuery($db);
$ca = new NWDbQuery($db_other);
$ca->prepareSelect("msf_pacientes", "nombre,apellidos,tipo_identificacion,cedula,edad,tipo", " 1=1 limit 1");
if (!$ca->exec()) {
    return "Error. " . $ca->lastErrorText();
}
$data = array();
$total = $ca->size();
for ($i = 0; $i < $total; $i++) {
    $r = $ca->flush();
    $data[$i] = $r;
}
print json_encode($data);
return true;
?>