<?php

require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$p = $_POST;

function base64_to_jpeg($base64_string, $output_file) {
    $ifp = fopen($output_file, 'wb');
    // $data[ 0 ] == "data:image/png;base64"
    // $data[ 1 ] == <actual base64 string>
    $data = explode(',', $base64_string);
    fwrite($ifp, base64_decode($data[1]));
    fclose($ifp);
    //convierte en wav
    $r = NWUtils::mp3ToWav($output_file);
    return $r;
    //retorna mp3
//    return $output_file;
}

$fileName = "audio_" . date("YmdHis") . ".mp3";
$dir = "/imagenes/$fileName";
$uploadDirectory = $_SERVER["DOCUMENT_ROOT"] . $dir;
$fi = base64_to_jpeg($p["image"], $uploadDirectory);
$fi = str_replace($_SERVER["DOCUMENT_ROOT"], "", $fi);

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$fields = "id_enc,file,usuario,usuario_recibe,terminal,tipo,fecha";
//$fields .= ",test";
$ca->prepareInsert("sop_records_stream", $fields);
$ca->bindValue(":id_enc", $p["idCall"]);
$ca->bindValue(":terminal", $p["term"]);
$ca->bindValue(":usuario", $p["iam"]);
$ca->bindValue(":usuario_recibe", $p["received"]);
$ca->bindValue(":file", $fi);
$ca->bindValue(":tipo", "audio");
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
//$ca->bindValue(":test", $p["image"]);
if (!$ca->exec()) {
    $db->rollback();
    $a = Array();
    $a["error_text"] = "Ringow up.php ERROR:" . $ca->lastErrorText();
    $a["program_name"] = "Ringow up.php {$_SERVER["HTTP_HOST"]}";
    nwMaker::sendError($a);
    echo "Error. " . $ca->lastErrorText();
    return;
}
echo $fi;
