<?php

$new_image_name = "newaudio_" . mt_rand() . ".wav";
// upload directory
$filePath = $_SERVER["DOCUMENT_ROOT"] . '/imagenes/' . $new_image_name;
// path to ~/tmp directory
$tempName = $_FILES["file"]["tmp_name"];
// move file from ~/tmp to "uploads" directory
if (!move_uploaded_file($tempName, $filePath)) {
    // failure report
    echo 'Problem saving file: ' . $tempName;
    die();
}
//echo 'success';
echo '/imagenes/' . $new_image_name;
//
//// Set new file name
//$new_image_name = "newimage_" . mt_rand() . ".jpg";
//// upload file
//move_uploaded_file($_FILES["file"]["tmp_name"], 'imagenes/' . $new_image_name);
//echo $new_image_name;
