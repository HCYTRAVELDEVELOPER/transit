
<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
?>
<script type="text/javascript">
//    $(document).ready(function() {
//        $('.info_local').mouseleave(function() {
//            $('#charg_inf').fadeOut('slow');
//            //$('.display_loc_listtt').fadeOut('slow');
//            //$(".display_loc_listtt").remove();
//            $('.ubic_' + <?php echo $_POST["id"] ?>).removeClass("active_point");
//            //$('.ubic_loc').removeClass("clasecss");          
//            //$('#charg_inf').removeClass("clasecss_on"); 
//            $("#charg_inf" +<?php echo $_POST["id"] ?>).remove();
//        });
//        $('#open_button').mouseenter(function() {
//            // $('#charg_inf').addClass("clasecss_on");
//            //$('#charg_inf').fadeIn('slow');       
//            $('.ubic_' + <?php echo $_POST["id"] ?>).addClass("active_point");
//        });
//        $('.info_local').mouseenter(function() {
//            //$('#charg_inf').addClass("clasecss_on");
//            //$('#charg_inf').fadeIn('slow');    
//            $('.ubic_' + <?php echo $_POST["id"] ?>).addClass("active_point");
            //$("#charg_inf"+<?php echo $_POST["id"] ?>).remove();
//        });
//    });
</script>
<?php
//$url_gen_local = "";
print_r($_POST);
$db_local = NWDatabase::database();
$cd = new NWDbQuery($db_local);
$sql_local = "select a.*,b.*
            from nc_maps_local a
            left join nc_products b on (a.id_local=b.id)
            where a.id=:id_imagen";
$cd->bindValue(":id_imagen", $_POST["id"]);
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
    ?>
    <div id="charg_inf_inf" class="display_loc_listtt display_loc_list" style="margin-top:<?php echo $r["pos_y"]; ?>%; margin-left:<?php echo $r["pos_x"]; ?>%;">
        <div class="display_loc_ubic">
            <div class="info_local">
                <a href="/<?php echo $r["url"] ?>" >
                    <?php echo $r["productName"] ?>
                </a>
                <br />
                <a id="open_button" class="a_open_popup" href="javascript: cargar_notice_h(<?php echo $r["id_local"]; ?>)" >
                    Ver Visita Virtual
                </a>
            </div>
        </div>
    </div>
<div class="corner_map"></div>
    <?php
}
?>

