<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';

$q = '';
if (isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
}
if (!$q) {
    return;
}

$db = NWDatabase::database();
$ca = new NWDbQuery($db);

$sql = "select productName from nc_products order by lower(productName)";
$ca->prepare($sql);
$ca->exec();

for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $r = $ca->assoc();
    $var = $r["productName"];
    if (strpos(strtolower($var), $q) !== false) {
        echo "$var\n";
    }
}
/*
foreach ($r as $key => $value) {
    echo "$key|$value\n";
}
*/