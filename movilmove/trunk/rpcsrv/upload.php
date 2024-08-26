<?php

function writeToFile($data, $mode = "", $file = "") {
    if ($mode == "") {
        $mode = "a+";
    }
    if ($file == "") {
        $file = dirname(__FILE__) . "/log";
    }
    $fp = fopen($file, $mode);
    fwrite($fp, $data);
    fclose($fp);
}

$image = $_SERVER["DOCUMENT_ROOT"] . '/imagenes/' . $_FILES["uploadfile"]['name'];

if (!move_uploaded_file($_FILES["uploadfile"]["tmp_name"], $image)) {
    echo "No se subió";
} else {
    echo $image;
}
?>
