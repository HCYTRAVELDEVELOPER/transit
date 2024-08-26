<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
} else {
//NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
}
$db = NWDatabase::database();
$cg = new NWDbQuery($db);
$cg->prepareSelect("nwplay_ruleta_usuarios", "email", "email=:usuario");
$cg->bindValue(":usuario", $_POST["email"], true);
if (!$cg->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda.";
    return;
}
if ($cg->size() > 0) {
    echo "<h3 class='no_found_contend'>Este usuario ya existe.</h3>.";
    return;
}
$cj = new NWDbQuery($db);
$cj->prepareSelect("nwplay_ruleta_usuarios", "max(id) as id");
$cj->exec();
$cj->next();
$r = $cj->assoc();
$id = $r["id"] + 1;

$ca = new NWDbQuery($db);
$ca->prepareInsert("nwplay_ruleta_usuarios", "id, id_ruleta, nombre, documento, telefono, email, clave, fecha, estado, empresa, usuario, terminal");
$ca->bindValue(":id", $id);
$ca->bindValue(":id_ruleta", $_POST["id_reunion"]);
$ca->bindValue(":nombre", $_POST["nombre"]);
$ca->bindValue(":documento", $_POST["documento"]);
$ca->bindValue(":telefono", $_POST["telefono"]);
$ca->bindValue(":email", $_POST["email"]);
$ca->bindValue(":clave", md5($_POST["clave_registro"]));
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":estado", "activo");
$ca->bindValue(":empresa", 1);
$ca->bindValue(":usuario", "público");
$ca->bindValue(":terminal", 1);
if (!$ca->exec()) {
    echo "Error. " . $ca->lastErrorText();
    return;
} else {
    if (session_id() == "") {
        session_start();
    }
    $_SESSION['id_usuario'] = $id;
    $_SESSION['usuario'] = $_POST['email'];
    $_SESSION['nombre'] = $_POST['nombre'];
//    $_SESSION['ciudad'] = $array_t['ciudad'];
//    $_SESSION['telefono'] = $array_t['telefono'];
    $_SESSION['email'] = $_POST['email'];
//    $_SESSION['celular'] = $array_t['celular'];
    $_SESSION['autenticado'] = 'SI';
}
?>
