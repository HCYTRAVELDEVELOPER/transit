<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
function order($id, $p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareUpdate("nwanimate_objetos", "orden", "id=:id");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":orden", $p);
    if (!$ca->exec()) {
        echo "No se pudo insertar el orden";
        return;
    }
}

if (!empty($_POST['data'])) {
    $data = $_POST["data"];
    $order = 1;
    $array_elementos = explode(',', $data);
    foreach ($array_elementos as $element) {
        if (is_numeric($element)) {
            order($element, $order);
            $order++;
        }
    }
}
?>
