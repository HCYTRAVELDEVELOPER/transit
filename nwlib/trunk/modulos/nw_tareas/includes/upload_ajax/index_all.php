<!--<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>-->
<script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/includes/jquery/jquery.min.js" ></script>
<script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/nw_tareas/includes/upload_ajax/functions.js"></script>
<style type="text/css">
    .messages{
        float: left;
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
        position: absolute;
        top: 0;
        left: 400px;
    }
    .showImage img{
        height: 100%;
    }
</style>
<!--el enctype debe soportar subida de archivos con multipart/form-data-->
<form enctype="multipart/form-data" class="formulario">
    <label>Subir un archivo</label><br />
    <input name="archivo" type="file" id="imagen" /><br /><br />
    <input type="button" value="Subir imagen" /><br />
</form>
<!--div para visualizar mensajes-->
<div class="messages"></div><br /><br />
<!--div para visualizar en el caso de imagen-->
<div class="showImage"></div>
<?php
echo "Host: " . $_SERVER["HTTP_HOST"];
?>
<script type="text/javascript">
    function pasa_dato(p) {
        alert("Archivo subido correctamente");
    }
</script>
