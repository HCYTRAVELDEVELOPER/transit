<?php
$db = NWDatabase::database();
$caImgConfig = new NWDbQuery($db);
$caImgConfig->prepareSelect("man_img_config", "*");
if(!$caImgConfig->exec()) {
    echo "No se pudo consultar la configuración de thumbs en la tabla man_img_config. Consulte con su administrador.";
    return;
}
if($caImgConfig->size() == 0) {
    echo "No existe la configuración de thumbs en la tabla man_img_config. Ingrese a nwproject y créela";
    return;
}
$caImgConfig->next();
$imgConfig = $caImgConfig->assoc();
$ruta_phpthumb = $imgConfig["ruta_phpthumb"];
$text_replace_url_img = $imgConfig["text_replace_url_img"];
$url_image_pr_locs = $imgConfig["url_image_server_raiz"];
$url_enl_pr_los = $imgConfig["url_ruta_imagenes"]; 
$img_no_disponible_local= $imgConfig["mg_no_disponible_local"];
$permitir_login_cedula= $imgConfig["permitir_login_cedula"];
$tabla_cedulas= $imgConfig["tabla_cedulas"];


//$url_image_pr_locs = "/var/www/cat/build/";
//$url_enl_pr_los = "http://cat.gruponw.com/";
//
//
//$url_enl_pr_los = "http://nw_apps.loc/"; 
//$ruta_phpthumb = $url_enl_pr_los . "nwlib/includes/phpThumbMaster/phpThumb.php?src=";
//$url_image_pr_locs = "/var/www/nw_apps/";
//$img_no_disponible_local= "/nwproject/php/modulos/nwcommerce/images/no_image_local.jpg";
?>