<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}

$dbd = NWDatabase::database();
$ca = new NWDbQuery($dbd);
if ($_POST["id"] == "") {
    $sql = "INSERT INTO man_enc (nombre, descripcion, objetivo, publico, imagen, fecha, usuario, terminal,empresa) 
        values (:nombre, :descripcion, :objetivo, :publico, :imagen, :fecha, :usuario, :terminal, :empresa)";
} else {
    $sql = "UPDATE man_enc SET nombre=:nombre, descripcion=:descripcion, objetivo=:objetivo, publico=:publico, imagen=:imagen, fecha=:fecha WHERE id=:id";
    $ca->bindValue(":id", $_POST["id"]);
}

$ca->bindValue(":nombre", $_POST["nombre"]);
$ca->bindValue(":descripcion", $_POST["descripcion"]);
$ca->bindValue(":objetivo", $_POST["objetivo"]);
$ca->bindValue(":imagen", $_POST["imagen"]);
$ca->bindValue(":publico", $_POST["publico"]);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":terminal", $_SESSION["terminal"]);
$ca->bindValue(":empresa", $_SESSION["empresa"]);

$ca->prepare($sql);
//$ca->exec();

if (!$ca->exec()) {
    echo "Hubo un error, inténtelo nuevamente. Lo sentimos!";
} else {
    echo "Cambios guardados correctamente";
}
?>