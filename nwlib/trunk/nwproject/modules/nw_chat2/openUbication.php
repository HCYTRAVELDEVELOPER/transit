<style>
    body {
        margin: 0;
        padding: 0;
        position: relative;
        font-size: 12px;
        font-family: Arial;
    }
    .frameGeo{
        position: relative;
        width: 100%;
        height: 1000px;
        position: absolute;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 0; 
    }
    a {
        text-decoration: none;
    }
    .openInnew{
        font-size: 18px;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1;
        background: #4b4b4b;
        padding: 10px;
        font-weight: bold;
        color: #fff;
    }
</style>
<a class="openInnew" href="http://es.geoipview.com/?q=<?php echo $_GET["ip"]; ?>" target="_BLANK">
    Abrir en nueva ventana
</a>
<iframe class="frameGeo" src="http://es.geoipview.com/?q=<?php echo $_GET["ip"]; ?>" ></iframe>