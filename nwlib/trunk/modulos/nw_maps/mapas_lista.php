<?php
//require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
?>

<style>
    #ubic_list_loc{
        display: none;
    }
</style>


<div class="show_list">
    <h2 class="title_map_list">
        <?php echo $ra["nombre"]; ?>
    </h2>
    <div class="busqueda">
        <?php
//        include "nw_maps/buscar.php";
        include "buscar.php";
        ?>    
    </div>
    <?php
    if (isset($_GET["buscar_mapas"]) != "") {
        
    } if (isset($_POST["buscar_mapas"]) != "") {
        
    } else {
        echo "<div id='box_list_contend'>";
        $url_gen_local = "";
        $db_local = NWDatabase::database();
        $cd = new NWDbQuery($db_local);
        $sql_local = "select a.*,b.*,b.productName as productname
            from nc_maps_local a
            left join nc_products b on (a.id_local=b.id)
            where id_imagen=:id_imagen";
        $cd->bindValue(":id_imagen", $ra["id"]);
        $cd->prepare($sql_local);
        if (!$cd->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda. ";
            return;
        }
        if ($cd->size() == 0) {
            echo "<div class='list_item'>No hay sitios disponibles para este mapa</div>";
            return;
        }

        for ($i = 0; $i < $cd->size(); $i++) {
            $cd->next();
            $r = $cd->assoc();
            $top = $r["pos_y"] / 15;
            $left = $r["pos_x"] / 15;
            ?>
            <script type="text/javascript">
                $(document).ready(function() {
                    function blabla() {
                        $('#ubic_loc<?php echo $r["id"]; ?>').animate({top: '-55px'}, 500, function() {
                            $('#ubic_loc<?php echo $r["id"]; ?>').animate({top: '-35px'}, 500, function() {
                                setTimeout(blabla, 1);
                            });
                        });

                    }

                    $("#ubic_list_loc<?php echo $r["id"]; ?>").mouseenter(function() {
                        $("#ubic_list_loc<?php echo $r["id"]; ?>").click(function() {
                            $("#ubic_loc<?php echo $r["id"]; ?>").animate({
                                top: "-35px"
                            },
                            500);
                            $("#ubic_loc<?php echo $r["id"]; ?>").stop();
                        });
                        blabla();
                    });
                    $("#ubic_list_loc<?php echo $r["id"]; ?>").mouseleave(function() {
                        $("#ubic_loc<?php echo $r["id"]; ?>").animate({
                            top: "-35px"
                        },
                        500);
                        $("#ubic_loc<?php echo $r["id"]; ?>").stop();
                    });
                    $("#ubic_list_loc<?php echo $r["id"]; ?>").click(function() {
                        $("#charg_inf").remove();
                        cargar_info_local(<?php echo $r["id"] ?>, <?php echo round($top) ?>, <?php echo round($left) ?>);
                        $("#ubic_loc<?php echo $r["id"]; ?>").animate({
                            top: "-35px"
                        },
                        500);
                        $("#ubic_loc<?php echo $r["id"]; ?>").stop();
                        return true;
                    });
                });
            </script>
            <!--<div id="ubic_list_loc<?php echo $r["id"]; ?>" onmouseenter="cargar_info_local(<?php echo $r["id"] ?>, <?php echo round($top) ?>, <?php echo round($left) ?>)" onmouseleave="setTimeout('destroy_cargar_info_local(<?php echo $r["id"] ?>)', 0);" >-->
            <div id="ubic_list_loc<?php echo $r["id"]; ?>" onmouseleave="setTimeout('destroy_cargar_info_local(<?php echo $r["id"] ?>)', 0);" >
                <div class="list_item_into">
                    <div class="button_tour_list">
                        <a class="button_a" href="javascript: cargar_notice_h(<?php echo $r["id_local"]; ?>)" >
                            Visita Virtual
                        </a>
                    </div>
                    <div>
                        <a href="#">
                            <?php echo $r["direccion"] ?> : 
                        </a>
                    </div>
                    <div>
                        <a href="#">
                            :  <?php echo $r["productname"] ?>
                        </a>
                    </div>
                </div>
            </div>
            <?php
        }
        echo "</div>";

    }
    ?>
</div>

