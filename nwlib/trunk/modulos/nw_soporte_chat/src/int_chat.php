<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$t = $_POST["id_t"];
$tipo_user = "visitante";
if (isset($_POST["tipo_user"])) {
    $tipo_user = $_POST["tipo_user"];
}
if (!isset($_COOKIE["real_ip"])) {
    $real_ip = master::getRealIp();
    setcookie("real_ip", $real_ip);
} else {
     $real_ip = $_COOKIE["real_ip"];
}
$ca->prepareInsert("sop_chat", "visitante,  texto, usuario,  fecha, terminal, tipo_user, leido, ip, nombre_operador, foto_usuario, status");
$ca->bindValue(":visitante", $_COOKIE["$t"]);
$ca->bindValue(":texto", $_POST["texto"]);
$ca->bindValue(":usuario", $_POST["nombre"]);
$ca->bindValue(":nombre_operador", $_POST["nombre"]);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":terminal", $t);
$ca->bindValue(":ip", $real_ip, true);
$ca->bindValue(":tipo_user", $tipo_user);
$ca->bindValue(":status", "HABLANDO_US");
$ca->bindValue(":leido", 1);
$ca->bindValue(":foto_usuario", "/nwlib/dashboard/img/icon_user.png");
if (!$ca->exec()) {
    echo "errores. " . $ca->lastErrorText();
    return;
}
?>