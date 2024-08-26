<?php

if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$read = $_GET["read"];
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$where = "usuario=:usuario ";
if($read == "read") {
    
} else {
    $where .= "and leida=false"; 
}
$ca->prepareSelect("nw_notifications_det", "id,notificacion", "$where order by fecha desc");
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":leida", false);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    echo "nohay";
    return;
}
$notification = 0;
$notification_title = "";
$notification_text = "";
$chat = 0;
$chat_title = "";
$chat_text = "";
for ($i = 0; $i < $total; $i++) {
    $ca->next();
    $r = $ca->assoc();
    $cb->prepareSelect("nw_notifications", "*", "id=:id");
    $cb->bindValue(":id", $r["notificacion"]);
    if (!$cb->exec()) {
        echo $cb->lastErrorText();
        return;
    }
    $cb->next();
    $ra = $cb->assoc();
    $limite = 70;
    if ($ra["parte"] == "CHAT") {
        $chat++;
        $chat_title .= "Mensaje de: " . $ra["enviado_por"] . "//";
        $texto = strip_tags($ra["mensaje"]);
        $texto = substr($texto, 0, $limite);
        $palabras = explode(' ', $texto);
        $resultado = implode(' ', $palabras);
        $resultado .= '...';
        $chat_text .= strip_tags($resultado) . "//";
    } else {
        $notification++;
        $notification_title .= $ra["parte"] . ": De: " . $ra["enviado_por"] . "//";
        $texto = strip_tags($ra["mensaje"]);
        $texto = substr($texto, 0, $limite);
        $palabras = explode(' ', $texto);
        $resultado = implode(' ', $palabras);
        $resultado .= '...';
        $notification_text .= strip_tags($resultado) . "//";
    }
}
echo "$total||$notification&/$notification_title&/$notification_text||$chat&/$chat_title&/$chat_text";
?>