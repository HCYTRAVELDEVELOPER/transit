<?php
//require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db_local = NWDatabase::database();
$cd = new NWDbQuery($db_local);
$where = " 1=1 ";
$where .= " and id_imagen=:id_imagen ";
$id_ubic_map = "";
if (isset($_GET["buscar_mapas"]) || isset($_POST["buscar_mapas"])) {
    if (isset($_POST["buscar_mapas"])) {
        $id_ubic_map = $_POST["buscar_mapas"];
    }
    if (isset($_GET["buscar_mapas"])) {
        $id_ubic_map = $_GET["buscar_mapas"];
    }
    if ($motor_bd == "MYSQL") {
        $where .= " and b.productName like '%:busqueda%' ";
    } else
    if ($motor_bd == "PSQL") {
        $fields = "b.productName";
        $where_search = NWDbQuery::sqlFieldsFilters($fields, $id_ubic_map, true);
        $where .= "  and " . $where_search;
    }
}

$sql_local = "select a.*,b.*, c.icono
            from nc_maps_local a
            left join nc_products b on (a.id_local=b.id)
                 left join nc_groups c on (b.productgroup=c.id) 
            where {$where}";
$cd->bindValue(":id_imagen", $ra["id"]);
$cd->bindValue(":busqueda", $id_ubic_map);
$cd->prepare($sql_local);
if (!$cd->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda. " . $cd->lastErrorText();
    return;
}
echo $ra["id"];
if ($cd->size() == 0) {
    echo "";
    //return;
}
for ($i = 0; $i < $cd->size(); $i++) {
    $cd->next();
    $r = $cd->assoc();
    $top = $r["pos_y"] / 10;
    $left = $r["pos_x"] / 10;
    $unidad_distancia = "%";
    $icono = "";
    if ($r["icono"] != "") {
        $icono = "background-image: url(" . $r["icono"] . ");";
    } else {
        $icono = "";
    }
       $icono = "";
    ?>
    <script type="text/javascript">
        $(document).ready(function() {
            function blabla() {
                $('#ubic_loc<?php echo $r["id"]; ?>').animate({top: '-40px'}, 500, function() {
                    $('#ubic_loc<?php echo $r["id"]; ?>').animate({top: '-35px'}, 500, function() {
                        setTimeout(blabla, 1);
                    });
                });

            }

            $("#ubic_loc<?php echo $r["id"]; ?>").mouseenter(function() {
                $("#ubic_loc<?php echo $r["id"]; ?>").click(function() {
                    $("#ubic_loc<?php echo $r["id"]; ?>").animate({
                        top: "-35px"
                    },
                    500);
                    $("#ubic_loc<?php echo $r["id"]; ?>").stop();
                });
                blabla();
            });
            $("#ubic_loc<?php echo $r["id"]; ?>").mouseout(function() {
                $("#ubic_loc<?php echo $r["id"]; ?>").animate({
                    top: "-35px"
                },
                500);
                $("#ubic_loc<?php echo $r["id"]; ?>").stop();
            });
            $("#ubic_loc<?php echo $r["id"]; ?>").click(function() {
                $("#charg_inf").remove();
                cargar_info_local(<?php echo $r["id"] ?>);
                $("#ubic_loc<?php echo $r["id"]; ?>").animate({
                    top: "-35px"
                },
                500);
                $("#ubic_loc<?php echo $r["id"]; ?>").stop();
            });
        });
    </script>
    <div id="ubic_loc<?php echo $r["id"]; ?>" onmouseleave="setTimeout('destroy_cargar_info_local(<?php echo $r["id"] ?>)', 0);"  class="ubic_loc ubic_<?php echo $r["id"]; ?>" style="<?php echo $icono; ?>margin-top:<?php echo $top . $unidad_distancia . ";"; ?> margin-left:<?php echo $left . $unidad_distancia . ";"; ?>">
        <?php
        if (isset($_GET["buscar_mapas"]) || isset($_POST["buscar_mapas"])) {
            echo "   <div class='pointer_result'> <div class='punta_top_two'></div></div>";
        }
        ?>
    </div>
    <?php
}
?>