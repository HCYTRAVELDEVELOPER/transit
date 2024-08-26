<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$motor_bd = $cfg["dbDriver"];
$ruta_enlaces = "/nwlib6/modulos/";
$url_gen = "";
include "config_img.php";
?>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
<link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces ?>nw_maps/css/style.css">
<?php
if (!isset($_GET["normal"])) {
    ?>
    <link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces ?>nw_maps/css/all_window.css">
    <?php
}
?>
<script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/js/jquery-1.4.2.min.js" ></script>
<script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/js/jquery-ui.min.js" ></script>
<!--<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
<script src="http://code.jquery.com/ui/1.8.21/jquery-ui.min.js"></script>-->
<script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/js/drag_mob/jquery.ui.touch-punch.min.js"></script>
<script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/js/jQuery_mousewheel_plugin.js" ></script>
<script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/js/main.js" ></script>
<script  type="text/javascript">
    $(function() {
        $('#map').draggable();
    });
</script>
<div id="contenedor_total">
    <?php
    if (isset($_GET["viewmaps"]) != "") {
        
    } else
    if (isset($_GET["map"]) != "") {
        
    } else
    if (isset($_POST['mapa_id_post']) != "") {
        
    } else {
        require "lists_maps.php";
    }


    if (isset($_GET['viewmaps']) != "" || isset($_POST['mapa_id_post']) != "") {
        require "map_view.php";
    }
    ?>    
    <div style="clear: both;"></div>
</div>
<div style="clear: both;"></div>
<div id="popup_carga_note"></div>
<div class="credits">
    <a class="enlace_powered" href="http://www.netwoods.net" target="_blank">Powered By <span style="color:red;">Net</span><span style="color:#e9e9e9;">woods</span></a>
</div>

