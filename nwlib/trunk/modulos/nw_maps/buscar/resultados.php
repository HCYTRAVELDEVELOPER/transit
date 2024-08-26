<?php
$busqueda_post = "";
if (isset($_POST["buscar_mapas"])) {
    $busqueda_post = $_POST["buscar_mapas"];
}
if (isset($_GET["buscar_mapas"])) {
    $busqueda_post = $_GET["buscar_mapas"];
}
$url_gen_local = "";
$db_local = NWDatabase::database();
$cd = new NWDbQuery($db_local);

if ($motor_bd == "MYSQL") {
    $whereb = " where id_imagen=:id_imagen and b.productName like '%:busqueda%'";
} else
if ($motor_bd == "PSQL") {
    $fields = "b.productname";
    $where_searchb = NWDbQuery::sqlFieldsFilters($fields, $busqueda_post, true);
    $whereb = " where 1=1 and id_imagen=:id_imagen and " . $where_searchb;
}

$sql_local = "select a.*,b.*,b.productName as productname
            from nc_maps_local a
            left join nc_products b on (a.id_local=b.productID)
            $whereb ";
$cd->bindValue(":id_imagen", $ra["id"]);
$cd->bindValue(":busqueda", $busqueda_post);
$cd->prepare($sql_local);
if (!$cd->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda. ";
    return;
}
if ($cd->size() == 0) {
    echo "<div class='list_item'>No hay sitios disponibles para este mapa</div>";
    //return;
}
echo "Resultados con <strong>$busqueda_post</strong>";
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
                    :  <?php echo $r["productname"] ?>
                </a>
            </div>
        </div>
    </div>
    <?php
}
?>
