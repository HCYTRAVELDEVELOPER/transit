<?php

$dbd = NWDatabase::database();
$cau = new NWDbQuery($dbd);
$sqlu = "select a.*,func_concepto(b.perfil, 'perfiles') as mi_perfil,b.nombre as nombre_complet,b.email,b.celular,b.cargo,b.perfil
    from terminales a
    join usuarios b on(a.id=b.terminal) 
    where b.usuario=:usuario";
$cau->bindValue(":usuario", $_SESSION["usuario"]);
$cau->prepare($sqlu);
if (!$cau->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda.";
    return;
}
if ($cau->size() == 0) {
    echo "<h3 class='no_found_contend'>El usuario no existe</h3>.";
    return;
}
$cau->next();
$arrayUSe = $cau->assoc();

$url_space_account = "http://" . $_SERVER['HTTP_HOST'] . "/" . $arrayUSe["url"];
echo "<div class='session_info'>";
echo "<a href='$url_space_account'>Hola " . $_SESSION["usuario"] . "!</a>";
echo " | ";
echo "<a href='/nwproject/php/modulos/nw_learning/src/log_in/cerrar.php'>Cerrar sesión</a>";
echo "</div>";
?>
