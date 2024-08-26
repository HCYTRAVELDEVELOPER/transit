<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

//OPEN DB
$db = NWDatabase::database();

//CREATE QUERY MANAGER
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);

//CONSULTA 1
$ca->prepareSelect("nw_manuales_categorias", "*");
//SI NO LOGRA LA CONSULTA
if (!$ca->exec()) {
    master::sendPHPError($ca->lastErrorText());
    return;
}

//CONSULTA 2
$cb->prepareSelect("nw_manuales", "*");
if (!$cb->exec()) {
    master::sendPHPError($ca->lastErrorText());
    return;
}

$bAssoc = $cb->assocAll();
?>
<script type="text/javascript">
    function openManual(id) {
        window.parent.parent.main.slotOpenManual(id);
    }
</script>
<?php

//BUCLE ANIDADO
for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $ra = $ca->assoc();
    echo "<b>" . $ra["nombre"] . "</b>: <br />";
    for ($ia = 0; $ia < count($bAssoc); $ia++) {
        $rb = $bAssoc[$ia];
        if ($ra["id"] == $rb["categoria"]) {
            echo "&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript: openManual(" . $rb["id"] . ")'>" . $rb["nombre"] . "</a>";
            echo "<br />";
        }
    }
    echo "<br />";
}
?>
