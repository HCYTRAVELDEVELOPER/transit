<?php

function utf8_fopen_read($fileName) {
    $fc = iconv('windows-1250', 'utf-8', file_get_contents($fileName));
    $handle = fopen("php://memory", "rw");
    fwrite($handle, $fc);
    fseek($handle, 0);
    return $handle;
}

function createExcel($filename, $arrydata) {
    $excelfile = "xlsfile://" . $filename;
    $fp = utf8_fopen_read($excelfile, "w+");
    if (!is_resource($fp)) {
        die("Error al crear $excelfile");
    }
    header("Content-type: text/html; charset=utf-8;");
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
    header("Cache-Control: no-cache, must-revalidate");
    header("Pragma: no-cache");
    header("Content-type: application/x-msexcel");
    header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
    $excelfile = "\xEF\xBB\xBF" . $excelfile;
    fwrite($fp, utf8_encode(serialize($arrydata)));
    fclose($fp);
    return;
    readfile($excelfile);
}

?>