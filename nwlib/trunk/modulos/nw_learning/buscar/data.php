<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';

$db = NWDatabase::database();
$ca = new NWDbQuery($db);

$sql = "";

if (isset($_POST["valor"])) {
    $sql = "select a.productName, a.productName from nc_products a 
        join nc_groups b on (a.productGroup=b.id)
        join nc_manufacturers c on (a.manufacturer=c.id)
        where b.name = :value or c.name = :value ";
    $ca->prepare($sql);
    $ca->bindValue(":value", $_POST["valor"]);
    $ca->bindValue(":value", $_POST["valor"]);
} else {
    $sql = "select productName, productName from nc_products ";
    $ca->prepare($sql);
}


if (!$ca->exec()) {
    return;
}

if ($ca->size() == 0) {
    return;
}

$r = "";

$filename = 'data.txt';

$control = fopen($filename, "w+");

if ($control == false) {
    die("No se ha podido crear el archivo.");
}

// nos aseguramos q el archivo sea writable 
if (is_writable($filename)) {

    file_put_contents($filename, "");
// abrimos el archivo a modo "append" ('a') para hacer escritura en el mismo 
// el puntero del cursor comenzará a escribir al final del archivo 
// ahi mismo en el archivo se escribirá el contenido $somecontent 

    $data = "";

    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();

        $data .= $r["productName"];
    }

    //$data = substr($data, 0, strlen($data) - 1);

    //$data .= "]";

// escribimos $somecontent en el archivo abierto. 
    if (fwrite($control, $data) === FALSE) {
        echo "no se puede escribir en el archivo ($filename)";
        exit;
    }

    //echo "se escribió ($somecontent) en el archivo ($filename)";

    fclose($control);
} else {
    echo "el archivo $filename no es writable";
}
?>