<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/nwproject/conectar/conectar.php";
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_config.php';
require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/utiles.php';

conectar();

if (!function_exists("GetSQLValueString")) {

    function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
        $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
        $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);
        switch ($theType) {
            case "text":
                $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                break;
            case "long":
            case "int":
                $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                break;
            case "double":
                $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                break;
            case "date":
                $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                break;
            case "defined":
                $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                break;
        }
        return $theValue;
    }

}
?>

    <?php
    $url_gen_local = "";
    $db_local = NWDatabase::database();
    $cd = new NWDbQuery($db_local);
    $sql_local = "select a.*,b.*
            from nc_maps_local a
            left join nc_products b on (a.id_local=b.productID)
            where id_imagen=:id_imagen and b.productName like '%:busqueda%'";
    $cd->bindValue(":id_imagen", $ra["id"]);
    $cd->bindValue(":busqueda", $_GET["buscar_mapas"]);
    $cd->prepare($sql_local);
    if (!$cd->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda. ";
        return;
    }
    if ($cd->size() == 0) {
        echo "<div class='list_item'>No hay sitios disponibles para este mapa</div>";
        //return;
    }
    for ($i = 0; $i < $cd->size(); $i++) {
        $cd->next();
        $r = $cd->assoc();
        ?>
        <div onmouseenter="cargar_info_local(<?php echo $r["id"] ?>)" onmouseleave="setTimeout('destroy_cargar_info_local(<?php echo $r["id"] ?>)', 0);" >
            <div class="list_item_into">
                <div class="button_tour_list">
                    <a class="button_a" href="javascript: cargar_notice_h(<?php echo $r["id_local"]; ?>)" >
                        Visita Virtual
                    </a>
                </div>
                <div>
                    <a href="/<?php echo $r["url"] ?>">
                        <?php echo $r["direccion"] ?> : 
                    </a>
                </div>
                <div>
                    <a href="/<?php echo $r["url"] ?>">
                        :  <?php echo $r["productName"] ?>
                    </a>
                </div>
            </div>
        </div>
        <?php
    }
    ?>
