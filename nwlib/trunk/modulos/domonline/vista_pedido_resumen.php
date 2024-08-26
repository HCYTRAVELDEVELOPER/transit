<script>
    function changeData(data, d) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }
        else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                document.getElementById("editor").innerHTML = xmlhttp.responseText;
            }
        };
        xmlhttp.open("GET", "/nwlib6/modulos/domonline/vista_pedido_resumen_consulta.php?id=" + data + "&d=" + d, true);
        xmlhttp.send();
    }
</script>
<style>
    body {
        position: relative;
        margin: 0;
        padding: 0;
        font-size: 12px;
        font-family: arial;
    }
    table, td, th, tr {
         font-size: 12px;
    }
</style>
<div id="editor"></div>