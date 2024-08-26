<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "/nwlib6/modulos/";

$id = "";
if (isset($_GET["id"])) {
    if ($_GET["id"] != "") {
        $id = $_GET["id"];
        ?>
        <script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/js/jquery-1.4.2.min.js" ></script>
        <script src="<?php echo $ruta_enlaces ?>nw_maps/js/drag_mob/jquery.ui.touch-punch.min.js"></script>
        <?php
    }
}
if (isset($_POST["id"])) {
    if ($_POST["id"] != "") {
        $id = $_POST["id"];
    }
}
require "../../config_img.php";
$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$cb->prepareSelect("nc_maps_visitas_virtuales a left join nc_products b on (a.id_local=b.id)", "a.*,b.*", "a.id_local=:id");
$cb->bindValue(":id", $id);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta. " . $cb->lastErrorText();
    return;
}
if ($cb->size() == 0) {
    echo "No se han encontrado datos";
    return;
}
$cb->next();
$pr_notice_enc_popup = $cb->assoc();
?>
<link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces ?>nw_maps/src/visita_virtual/css/css.css" />
<div class="content-popup content_popup_close">
    <div class="controlStatic"></div>
    <div class='controlPlay'></div>
    <div class="close_popup" id="close_popup">
        X
    </div>
    <div class="contend_ult_notices_portal">
        <style>
            #panorama {
                background-image: url(<?php echo "/nwlib6/includes/phpthumb/phpThumb.php?src=" . $pr_notice_enc_popup["imagen_pano"]; ?>&w=1000);
            }
        </style>
        <?php
        echo "nw: " . $url_enl_pr_los;
        ?>
        <div class="panorama-container panoStatic" id="panorama" ></div>
    </div> 
</div>
<script type="text/javascript" src="<?php echo $ruta_enlaces ?>nw_maps/src/visita_virtual/js/js.js" ></script>