<?php
//if ($map_id != "") {
//    $map_id_param = $map_id;
//} else
//if ($map_id == "") {
//    $map_id_param = $_POST['mapa_id_post'];
//} else {
//    $map_id_param = "";
//}
//
//if ($map_id_enc != "") {
//    $map_id_param_enc = $map_id_enc;
//} else
//if ($map_id_enc == "") {
//    $map_id_param_enc = $_POST['map_id_enc'];
//} else {
//    $map_id_param_enc = "";
//}
$map_id_param = $map_id;
$map_id_param_enc = $map_id_enc;
?>
<div class="div_buscar_in_contend_local">
    <div id="div_buscar_in_locales">
        <form action="" method="post" id="buscar_form">
            <!--<input type="hidden" name="mapa_id_post" value="<?php echo $map_id_param; ?>" />-->
            <input type="hidden" name="map" value="<?php echo $map_id_param; ?>" />
            <!--<input type="hidden" name="map_id_enc" value="<?php echo $map_id_param_enc; ?>" />-->
            <input type="hidden" name="viewmaps" value="<?php echo $map_id_param_enc; ?>" />
            <input class='inputSearch'
                   name="buscar_mapas" type="text"
                   value="Busca sitios" 
                   class="inputbox" id="buscar_mapas" 
                   onblur="if (this.value == '')
                               this.value = 'Busca sitios';" 
                   onfocus="if (this.value == 'Busca sitios')
                               this.value = '';" />
            <input class="input_search_locs" type="submit" />
        </form>
    </div>
</div>
<?php
if (isset($_GET["buscar_mapas"]) != "") {
    include "buscar/resultados.php";
} if (isset($_POST["buscar_mapas"]) != "") {
    include "buscar/resultados.php";
}
?>