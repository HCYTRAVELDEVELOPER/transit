<?php
$sqll = "select * FROM nc_products where url=" . $_GET["producto"];
$queryy = mysql_query($sqll);
$pr_sear = mysql_fetch_array($queryy);
?>
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

$sql = "select nombre from nc_local_products order by lower(nombre)";
//$sql = "select nc_products.productName,nc_products.direccion from nc_products,nc_local_products order by lower(productName)";
//$sql_p = "select nombre from nc_local_products order by lower(nombre)";
$ca->prepare($sql);
$ca->exec();

for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $r = $ca->assoc();
    $var = $r["nombre"];
    //$var = $r["productName"] . " " . $r["direccion"];
    //$var_pr = $r["nombre"];
    if (strpos(strtolower($var), $q) !== false) {
        echo "$var\n";
    }
}
/*
foreach ($r as $key => $value) {
    echo "$key|$value\n";
}
*/
?>