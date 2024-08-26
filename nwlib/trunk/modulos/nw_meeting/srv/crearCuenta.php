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
$cg->prepareSelect("pv_clientes", "usuario_cliente", "usuario_cliente=:usuario");
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
$cj->prepareSelect("pv_clientes", "max(id) as id");
$cj->exec();
$cj->next();
$r = $cj->assoc();
$id = $r["id"] + 1;

$ca = new NWDbQuery($db);
$ca->prepareInsert("pv_clientes", "nombre, usuario_cliente, email, clave, fecha_registro");
$ca->bindValue(":id", $id);
$ca->bindValue(":nombre", $_POST["nombre"]);
$ca->bindValue(":usuario_cliente", $_POST["email"]);
$ca->bindValue(":email", $_POST["email"]);
$ca->bindValue(":clave", md5($_POST["clave_registro"]));
$ca->bindValue(":fecha_registro", date("Y-m-d H:i:s"));
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
