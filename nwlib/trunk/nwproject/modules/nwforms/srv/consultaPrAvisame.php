<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//$sessionID = session_id();
//VARIABLE A MOSTRAR
if(!isset($_POST["fields"])) {
    return true;
}
$columns = $_POST["fields"];
$rta = "";
if (isset($_POST["html"]))
    $rta .= $_POST["html"];

//TRAIGO LA LIBRERÍA NWFORMS
//$rta .= nwproject::loadModules("nwforms", false);
$rta .= nwprojectOut::loadModulesMaker("nwforms", false);
//CREO LAS COLUMNAS
//$columns = array
//    (
//    array
//        (
//        "tipo" => "textField",
//        "nombre" => "Correo",
//        "name" => "correo",
//        "requerido" => "SI",
//    ),
//    array
//        (
//        "tipo" => "textField",
//        "nombre" => "Nombre Completo",
//        "name" => "nombre",
//        "requerido" => "NO",
//    )
//);
//ENVÍO EL ARRAY DE COLUMNAS A CREARLAS EN EL LIENZO
$rta .= loadFormsMain("alf", $columns);
//MUESTRO TODO EL FORM Y CAMPOS
print_r($rta);
?>