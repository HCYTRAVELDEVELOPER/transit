<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareInsert("nw_rias", "fecha, pregunta, respuesta, palabras_clave");
$ca->bindValue(":fecha", date("Y-m-d"));
$ca->bindValue(":pregunta", $_POST["pregunta"]);
$ca->bindValue(":respuesta", $_POST["respuesta"]);
$ca->bindValue(":palabras_clave", $_POST["keys"]);
if(!$ca->exec()) {
    echo "error";
    return;
}
echo "He aprendido algo nuevo! Ahora se que cuando me pregunten:/n " . $_POST["pregunta"]  . " puedo responder <b>" . $_POST["respuesta"] . "</b>";
?>
