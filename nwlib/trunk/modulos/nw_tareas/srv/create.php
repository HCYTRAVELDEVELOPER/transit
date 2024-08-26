<?php

$cont = $_POST["data_all"];
$arc = fopen('/var/www/nwadmin3/imagenes/yes.php', 'a');
$er = 0;
if (!isset($arc)) {
    $er = 1;
    print "No se ha podido crear/abrir el archivo.$cont<br />";
} elseif (!fwrite($arc, $cont)) {
    $er = 1;
    print "No se ha podido escribir en el archivo.$cont<br />";
}
@fclose();
if ($er == 0) {
    print "Datos actualizados.<br />";
    print "<a href='asistente'>Volver</a>";
}
?>