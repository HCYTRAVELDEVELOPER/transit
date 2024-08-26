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
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwsites/_mod_ajax.php';
}
if (isset($_POST['usuario']) && $_POST['usuario'] != "" && isset($_POST['clave']) && $_POST['clave'] != "") {
    $clave = md5($_POST["clave"]);
    $dbb = NWDatabase::database();
    $cg = new NWDbQuery($dbb);
    $cg->prepareSelect("pv_clientes", "*", "usuario_cliente=:usuario and clave=:clave");
    $cg->bindValue(":usuario", $_POST["usuario"], true);
    $cg->bindValue(":clave", md5($_POST["clave"]), true);
    if (!$cg->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda.";
        return;
    }
    if ($cg->size() == 0) {
        echo "<h3 class='no_found_contend'>Usuario o Clave Incorrecta</h3>.";
        return;
    }
    $cg->next();
    $array_t = $cg->assoc();
    if ($array_t['clave'] == $clave) {
        if (session_id() == "") {
            session_start();
        }
        $_SESSION['id_usuario'] = $array_t['id'];
        $_SESSION['usuario'] = $array_t['usuario_cliente'];
        $_SESSION['nombre'] = $array_t['nombre'];
        $_SESSION['ciudad'] = $array_t['ciudad'];
        $_SESSION['telefono'] = $array_t['telefono'];
        $_SESSION['email'] = $array_t['email'];
        $_SESSION['celular'] = $array_t['celular'];
        $_SESSION['autenticado'] = 'SI';
    } else {
        echo "<h3 class='no_found_contend'>Usuario o Clave Incorrecta</h3>.";
        return;
    }
}
?>