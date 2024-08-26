<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers:        {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}
$usedOutNwlib = true;
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";
$p = $_POST;
// upload directory
$filePath = $_SERVER["DOCUMENT_ROOT"] . '/imagenes/' . $p['video-filename'];
// path to ~/tmp directory
$tempName = $_FILES['video-blob']['tmp_name'];
// move file from ~/tmp to "uploads" directory
if (!move_uploaded_file($tempName, $filePath)) {
    // failure report
    echo 'Problem saving file: ' . $tempName;
    die();
}
//$db = NWDatabase::database();
//$ca = new NWDbQuery($db);
//$fields = "id_enc,file,tipo,fecha";
//$ca->prepareInsert("sop_records_stream", $fields);
//$ca->bindValue(":id_enc", $p["id_call"]);
//$ca->bindValue(":file", '/imagenes/nw_taskenter_records/' . $p['video-filename']);
//$ca->bindValue(":tipo", "video");
//$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
//if (!$ca->exec()) {
//    $db->rollback();
//    $a = Array();
//    $a["error_text"] = "Ringow saveRecordVideo.php ERROR:" . $ca->lastErrorText();
//    $a["program_name"] = "Ringow saveRecordVideo.php {$_SERVER["HTTP_HOST"]}";
//    nwMaker::sendError($a);
//    echo "Error. " . $ca->lastErrorText();
//    return;
//}
//$ca->prepareUpdate("sop_visitantes", "tiempo", "id=:id_enc");
//$ca->bindValue(":id_enc", $p["id_call"]);
//$ca->bindValue(":tiempo", $p["time"]);
//if (!$ca->exec()) {
//    $db->rollback();
//    $a = Array();
//    $a["error_text"] = "Ringow saveRecordVideo.php ERROR:" . $ca->lastErrorText();
//    $a["program_name"] = "Ringow saveRecordVideo.php {$_SERVER["HTTP_HOST"]}";
//    nwMaker::sendError($a);
//    echo "Error. " . $ca->lastErrorText();
//    return;
//}
echo 'success';
