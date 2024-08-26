<!--<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>-->
<?php
 require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
 ?>
<script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/includes/jquery/jquery.min.js" ></script>
<script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_tareas/includes/upload_ajax/functions.js"></script>
<style type="text/css">
    .messages{
        float: right;
        font-family: sans-serif;
        display: none;
    }
    .info{
        padding: 10px;
        border-radius: 10px;
        background: orange;
        color: #fff;
        font-size: 18px;
        text-align: center;
    }
    .before{
        padding: 10px;
        border-radius: 10px;
        background: blue;
        color: #fff;
        font-size: 18px;
        text-align: center;
    }
    .success{
        padding: 10px;
        border-radius: 10px;
        background: green;
        color: #fff;
        font-size: 18px;
        text-align: center;
    }
    .error{
        padding: 10px;
        border-radius: 10px;
        background: red;
        color: #fff;
        font-size: 18px;
        text-align: center;
    }
    .showImage{
        width: 100px;
        height: 100px;
        float: left;
        position: relative;
    }
    .showImage img{
        height: 100%;
    }
    .bgBl{
        position: fixed;
        top: 0;
        left: 0;
        background: #000;
        width: 100%;
        height: 100%;
        opacity: 0.7;
        display: none;
    }
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