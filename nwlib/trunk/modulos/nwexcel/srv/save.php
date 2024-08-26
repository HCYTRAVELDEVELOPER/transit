<?php

include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->setCleanHtml(false);
$si = session::info();
$id = "";
$date = date("Y-m-d H:i:s");
$name = "";
if (isset($_POST["nombre"])) {
    if ($_POST["nombre"] != "") {
        $name = ",nombre";
    }
}
$tipo = "";
if (isset($_POST["tipo"])) {
    if ($_POST["tipo"] != "") {
        $tipo = ",tipo";
    }
}
$user_name = "";
if (isset($si["usuario"])) {
    $user_name = ",usuario,empresa";
}
if ($_POST["id"] != "") {
    if ($_POST["plantilla"] == "SI" && $_POST["guardar"] == "NO") {
        $id = master::getNextSequence("nwexcel_files_id_seq");
        $ca->prepareInsert("nwexcel_files", "id,texto,fecha{$user_name}{$name}{$tipo}", "id=:id");
    } else {
        $id = $_POST["id"];
        $ca->prepareUpdate("nwexcel_files", "texto,fecha_update{$user_name}{$name}{$tipo}", "id=:id");
    }
} else {
    $id = master::getNextSequence("nwexcel_files_id_seq");
    $ca->prepareInsert("nwexcel_files", "id,texto,fecha,nombre{$tipo}{$user_name}");
}
$ca->bindValue(":id", $id);
$ca->bindValue(":texto", $_POST["texto"]);
if (isset($_POST["nombre"])) {
    if ($_POST["nombre"] != "") {
        $ca->bindValue(":nombre", $_POST["nombre"]);
    }
}
if (isset($_POST["tipo"])) {
    if ($_POST["tipo"] != "") {
        $ca->bindValue(":tipo", $_POST["tipo"]);
    }
}
$ca->bindValue(":fecha", $date);
$ca->bindValue(":fecha_update", $date);
if (isset($si["usuario"])) {
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
}
if (!$ca->exec()) {
    echo "error||" . $ca->lastErrorText();
    return false;
}
echo "/nwlib6/modulos/nwexcel/file.php?id=" . $id;
?>
