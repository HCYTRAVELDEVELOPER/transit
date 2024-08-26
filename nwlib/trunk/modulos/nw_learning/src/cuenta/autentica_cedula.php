<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
//    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod_all.php';
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
$db = NWDatabase::database();
$caImgConfig = new NWDbQuery($db);
$caImgConfig->prepareSelect("man_img_config", "*");
if(!$caImgConfig->exec()) {
    echo "No se pudo consultar la configuración de thumbs en la tabla man_img_config. Consulte con su administrador.";
    return;
}
if($caImgConfig->size() == 0) {
    echo "No existe la configuración de thumbs en la tabla man_img_config. Ingrese a nwproject y créela";
    return;
}
$caImgConfig->next();
$imgConfig = $caImgConfig->assoc();
$tabla_cedulas= $imgConfig["tabla_cedulas"];

if (isset($_POST['cedula'])) {
    $dbb = NWDatabase::database();
    $cg = new NWDbQuery($dbb);
    $sqlg = "select * from $tabla_cedulas where cedula=:cedula";
    $cg->bindValue(":cedula", $_POST["cedula"], true);
    $cg->prepare($sqlg);
    if (!$cg->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda.";
        return;
    }
    if ($cg->size() == 0) {
        echo "<h3 class='no_found_contend'>No existe un usuario con ese documento, lo sentimos. Informe al administrador del sistema.</h3>.";
        echo "<a class='' href='javascript:history.back()' >Volver</a>";
        return;
    }
    $cg->next();
    $array_t = $cg->assoc();
    if ($array_t['cedula'] == $_POST["cedula"]) {
        session_start();
        $_SESSION['cedula'] = $array_t['cedula'];
        $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
        echo "Autenticado correctamente";
        ?>
        <script type="text/javascript">
            window.location.reload();
        </script>
        <?php
    } else {
        echo "Usuario o clave incorrecta";
    }
}
?>