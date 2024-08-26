<?php
//
//$db = NWDatabase::database();
//$cbAut = new NWDbQuery($db);
//$sqll = "select * from man_img_config limit 1";
//$cbAut->prepare($sqll);
//if (!$cbAut->exec()) {
//    echo "No se pudo realizar la consulta.";
//     return;
//}
//if ($cbAut->size() == 0) {
//    echo "No se han encontrado datos";
//     return;
//}
//$cbAut->next();
//$ra_aut = $cbAut->assoc();

echo "<div class='div_login_container_no'>";
echo "<div class='enc_login_noautorice'>";
echo "Este manual es privado, debe autenticarse.";
echo "</div>";

echo "<div class='div_box_login_noautorice'>";
echo "<h3>Ingresa con tu usuario y contraseña</h3>";
include "log_in.php";
echo "</div>";

if ($permitir_login_cedula == "SI") {
    echo "<div class='div_box_login_noautorice'>";
    echo "<h3>También puedes ingresar temporalmente con tu cédula.</h3>";
    include "src/cuenta/login_cedula.php";
    include "</div>";
}

include "</div>";
?>
