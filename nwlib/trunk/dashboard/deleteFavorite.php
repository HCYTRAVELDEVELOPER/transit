<?php

if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
global $id;
$id = $_GET["id"];
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

function module() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $id;
    $ca->prepareDelete("nw_favoritos", "modulo=:modulo and usuario=:usuario and empresa=:empresa");
    $ca->bindValue(":modulo", $id);
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
        return;
    }
    echo "Agregado correctamente";
    ?>
    <script>
        reload();
    </script>
    <?php

}

module();
?>
