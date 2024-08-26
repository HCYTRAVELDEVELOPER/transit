<?php                
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$pos = strrpos($_SERVER["HTTP_HOST"], ".loc");
if ($pos != "") {
    echo "Está trabajando local. Su IP puede variar por el usuario developer. <br />";
}    
echo "My IP: " . master::getRealIp();