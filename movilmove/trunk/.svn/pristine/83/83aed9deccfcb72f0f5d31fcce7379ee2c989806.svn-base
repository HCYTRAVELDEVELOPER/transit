<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

//USUARIO:    NETCAR
//CONTRASEÑA:    NC729272
//USUARIO:    GRUPONW
//CONTRASEÑA:    Nw729272
//$user = "GRUPONW";
//$pass = "Nw729272";
return;
$user = "NETCAR";
$pass = "NC729272";

$sm = Array();
$sm["cel"] = "573125729272";
$sm["text"] = "HOLAS {$user} ";
$sm["from"] = $user;
$sm["user"] = $user;
$sm["pass"] = $pass;
$sm["url"] = "http://sms.colombiagroup.com.co/Api/rest/message";
$r = master::sendSMSByCBG($sm);
print_r($r);