<?php

if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión para ver el manual.";
    include "log_in.php";
    return;
}
$dbd = NWDatabase::database();
$cau = new NWDbQuery($dbd);
$sqlu = "select a.*
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
$arrayU = $cau->assoc();
?>
<script type="text/javascript">
function redireccionar(){
  window.location="/<?php echo $arrayU["url"] ?>";
} 
setTimeout ("redireccionar()", 0); //tiempo expresado en milisegundos
//redireccionar(); //tiempo expresado en milisegundos
</script>
