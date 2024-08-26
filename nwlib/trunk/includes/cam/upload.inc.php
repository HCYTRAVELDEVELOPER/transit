<?php

$jpeg_data = file_get_contents('php://input');
$filename = $_SERVER["DOCUMENT_ROOT"] . "/imagenes/" . $_GET["name"] . ".jpg";
$result = file_put_contents($filename, $jpeg_data);
if (!$result) {
    echo "No se pudo subir la imagen. Pruebe nuevamente.";
}
?>
