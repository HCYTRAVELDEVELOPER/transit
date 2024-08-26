<?php

$ite = new RecursiveDirectoryIterator($_SERVER["DOCUMENT_ROOT"] . "/build/resource/");

$bytestotal = 0;
$nbfiles = 0;
foreach (new RecursiveIteratorIterator($ite) as $filename => $cur) {
    $filesize = $cur->getSize();
    $bytestotal+=$filesize;
    $nbfiles++;
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    if ($ext == "php" || $ext == "PHP") {
        echo $filename;
        echo "<br />";
    }
}

// generate output
//$body = "CACHE MANIFEST\n\nCACHE:\n";
//foreach ($files as $file)
//    $body .= $file . "\n";
//$body .= "\nNETWORK:\n*\n";
// render output (the 'Content-length' header avoids the automatic creation of a 'Transfer-Encoding: chunked' header)
header('Content-type: text/cache-manifest');
header('Content-length: ' . strlen($body));
echo $body;
?>