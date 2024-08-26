<?php
$http = "http";
$https = "https";
$protocolo = $http;
if (isset($_SERVER["HTTPS"])) {
    if ($_SERVER["HTTPS"] == "on") {
        $protocolo = $https;
    } else {
        $protocolo = $http;
    }
}
$file = $_GET["file"];
$ruta = $protocolo . "://" . $_SERVER["HTTP_HOST"] . $file;
$url = "https://docs.google.com/gview?url={$ruta}&embedded=true";
?>
<style>
    body {
        position: relative;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-family: Arial;
        font-size: 12px;
    }
    .frameFile{
        position: relative;
        width: 100%;
        height: 100%;
        border: 0;
    }
    .btnDescargar{
        background: gray;
        color: #fff;
        text-decoration: none;
        padding: 8px;
        display: block;
        text-align: center;
        font-size: 13px;
        font-weight: bold;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>
<a href="<?php echo $ruta; ?>" target="_blank" class="btnDescargar">Descargar</a>
<iframe src="<?php echo $url; ?>" class="frameFile" >

</iframe>