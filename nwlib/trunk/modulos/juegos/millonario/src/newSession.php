<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//if (session_id() == "") {
//    //  ini_set('session.cookie_domain', '.gruponw.com');
//    session_start();
//}
//if (!isset($_SESSION["usuario"])) {
//    echo "Sesion Invalida. Inicie sesion..";
//    return;
//}
//session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$nombre = "Invitado";
$usuario = "Invitado";
$empresa = "0";
if(isset($si["nombre"])) {
    $nombre = $si["nombre"];
}
if(isset($si["usuario"])) {
    $usuario = $si["usuario"];
}
if(isset($si["empresa"])) {
    $empresa = $si["empresa"];
}
$id = master::getNextSequence("nwplay_millonario_sesiones_id_seq", $db);
$tableName = "nwplay_millonario_sesiones";
$fields = "id,nombre,usuario,empresa,nivel,puntaje,estado,terminal";
$ca->prepareInsert($tableName, $fields);
$ca->bindValue(":id", $id);
$ca->bindValue(":nombre", $nombre);
$ca->bindValue(":usuario", $usuario);
$ca->bindValue(":empresa", $empresa);
$ca->bindValue(":terminal", $_POST["terminal"]);
$ca->bindValue(":nivel", 0);
$ca->bindValue(":puntaje", 0);
$ca->bindValue(":estado", "nadie");
if (!$ca->exec()) {
    echo "No se pudo consultar..." . $ca->lastErrorText();
    return;
} else {
    echo $id;
}
?>

