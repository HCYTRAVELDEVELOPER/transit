<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
?>
<script type="text/javascript">
    $(document).ready(function() {
        $('.info_local').mouseleave(function() {
            $('#charg_inf').fadeOut('slow');
            $('.ubic_' + <?php echo $_POST["id"] ?>).removeClass("active_point");
            $("#charg_inf" +<?php echo $_POST["id"] ?>).remove();
        });
        $('.a_open_popup').mouseenter(function() {
            $('.ubic_' + <?php echo $_POST["id"] ?>).addClass("active_point");
        });
        $('.info_local').mouseenter(function() {
            $('.ubic_' + <?php echo $_POST["id"] ?>).addClass("active_point");
        });
    });
</script>
<?php
include "config_img.php";
//print_r($_POST);
//$url_gen_local = "";
$db_local = NWDatabase::database();
$cd = new NWDbQuery($db_local);
$sql_local = "select a.*,b.*,b.productImage as productimage,b.productName as productname
            from nc_maps_local a
            left join nc_products b on (a.id_local=b.id)
            where a.id_local=:id_imagen";
$cd->bindValue(":id_imagen", $_POST["id"]);
$cd->prepare($sql_local);
if (!$cd->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda. " . $cd->lastErrorText();
    return;
}
if ($cd->size() == 0) {
    echo "<div class='list_item'>No hay sitios disponibles para este mapa</div>";
    return;
}
for ($i = 0; $i < $cd->size(); $i++) {
    $cd->next();
    $r = $cd->assoc();
    ?>
    <div class="display_loc_ubic">
        <div class="info_local">
            <div class="banner_p" style="background-image: url(<?php echo $ruta_phpthumb . $url_enl_pr_los . $r["productimage"] . $img_thumb_Xmedium; ?>);">
                <div class="contend_logo_name">
                    <a href="/<?php echo $r["url"] ?>" >
                        <?php
                        echo "<img src='" . $ruta_phpthumb . $url_enl_pr_los . $r["imagen_logo"] . "$img_thumb_small' style='float: left;' />";
                        ?>
                        <?php echo $r["productname"] ?>
                    </a>
                </div>
            </div>
            <p>
                Local: <?php echo $r["direccion"] ?>
                <br />
                <?php echo $r["descripcion_corta"] ?>
                <br />
            </p>
            <?php
            $db_local_dos = NWDatabase::database();
            $cp = new NWDbQuery($db_local_dos);
            $sql_local_dos = "select * from nc_local_products where terminal=:terminal order by id desc limit 4";
            $cp->bindValue(":terminal", $r["terminal"]);
            $cp->prepare($sql_local_dos);
            if (!$cp->exec()) {
                echo "No se pudo realizar la consulta de la búsqueda";
            }
            if ($cp->size() == 0) {
                echo "";
                //return;
            } else {
                echo "<div class='contend_prod_info_box' >";
                for ($i = 0; $i < $cp->size(); $i++) {
                    $cp->next();
                    $r_pr = $cp->assoc();
                    $replace_image = str_replace($text_replace_url_img, "/", $r_pr["imagen"]);
                    echo "<div class='contend_prod_info'>";
                    echo "<img src='" . $ruta_phpthumb . $url_enl_pr_los . $replace_image . "$img_thumb_Xsmall' />";
                    echo "</div>";
                }
                echo "</div>";
            }
            ?>
            <br />
            <a id="open<?php echo $r["id"]; ?>" class="a_visit_virtual a_open_popup" href="javascript: cargar_notice_h(<?php echo $r["id_local"]; ?>)" >
                Ver Visita Virtual
            </a>
        </div>
    </div>
    <div class="corner_map"></div>
    <?php
}
?>
