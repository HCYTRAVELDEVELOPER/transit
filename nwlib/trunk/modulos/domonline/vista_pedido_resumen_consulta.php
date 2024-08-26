<style>
    body {
        position: relative;
        margin: 0;
        padding: 0;
        font-size: 12px;
        font-family: arial;
        background-color: #fff;
    }
    table, td, th, tr {
        font-size: 12px;
    }
</style>
<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
print_r(pv_nwsites::consultaPedidoClientesProductos($_GET));
?>