<?php
//session_name('nw');
if (session_start()) {
    if (!$_SESSION['usuario']) {
        echo "Usuario sin autenticacion.";
    }
}
$ruta_enlaces = "/nwlib6/modulos/nw_animate/editing/";
?>

<!--<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>-->
<link href="<?php echo $ruta_enlaces; ?>upload_ajax/css/uploader.css" rel="stylesheet" type="text/css" charset="utf-8"/>
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>upload_ajax/jquery/jquery.min.js" ></script>
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>upload_ajax/functions.js"></script>
<style type="text/css">
<?php
if (isset($_GET["css"])) {
    if ($_GET["css"] == "noimg") {
        echo ".showImage {display: none;}";
    }
}
?>
</style>
<!--el enctype debe soportar subida de archivos con multipart/form-data-->
<form enctype="multipart/form-data" class="formulario">
    <label>Subir un archivo</label><br />
    <input name="archivo" type="file" id="imagen" />
    <input type="button" value="Subir imagen" style="display: none;" />
</form>
<div class="showImage"></div>
<div class="messages"></div>
<div class="bgBl"></div>
<?php
$function = "envia_dato";
if (isset($_GET["func"])) {
    $function = $_GET["func"];
} else {
    $function = "envia_dato";
}
?>
<script type="text/javascript">
    function pasa_dato(p) {
        //        parent.parent.envia_dato(p);
        parent.<?php echo $function; ?>("/imagenes/" + p);
    }
</script>