<?php

$new_image_name = "newimage_" . random_int(111111, 999999) . ".jpg";
// upload directory
$filePath = $_SERVER["DOCUMENT_ROOT"] . '/imagenes/' . $new_image_name;
// path to ~/tmp directory
error_log("try to Upload camera: " . $filePath);
$tempName = $_FILES["file"]["tmp_name"];
// move file from ~/tmp to "uploads" directory
if (!move_uploaded_file($tempName, $filePath)) {
    $error = "Problem file {$tempName} Not uploaded because of error #" . $_FILES["file"]["error"];
    error_log($error);
    echo $error;
    // failure report
//    echo 'Problem saving file: ' . $tempName;
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
