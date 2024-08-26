<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
print nwprojectOut::getNwProjectLib();
print nwprojectOut::getApiGoogleMaps();
if (session_id() == "") {
    session_start();
}
$terminal = 0;
$tienda = 0;
$showAll = "";
$showCoordenadas = "";
$createPoligono = "";
$posx = 4.644905;
$posy = -74.0838316;

if (isset($_GET["terminal"])) {
    $terminal = $_GET["terminal"];
}
if (isset($_GET["tienda"])) {
    $tienda = $_GET["tienda"];
}
if (isset($_GET["showall"])) {
    $showAll = $_GET["showall"];
}
if (isset($_GET["showcoordenadas"])) {
    $showCoordenadas = $_GET["showcoordenadas"];
}
if (isset($_GET["createpoligono"])) {
    $createPoligono = $_GET["createpoligono"];
}
if (isset($_GET["posx"])) {
    $posx = $_GET["posx"];
}
if (isset($_GET["posy"])) {
    $posy = $_GET["posy"];
}
?>
<style>
    body {
        position: relative;
        margin: 0;
        padding: 0;
        font-size: 12px;
        font-family: arial;
    }
    .contanEnc{
        position: fixed;
        top: 0;
        right: 0;
        z-index: 1;
    }
    .btn {
        position: relative;
        float: left;
        margin: 5px 0px;
        padding: 10px 20px;
        outline: 1px solid #ccc;
        font-weight: bold;
        background: #ffffff;
        color: #4a4a4a;
        border-radius: 0px;
        cursor: pointer;
    }
    .save{

    }
    .reinit{

    }
</style>

<div class="contanEnc">
    <div class="btn save">
        Guardar
    </div>
    <div class="btn reinit">
        Actualizar
    </div>
    <div class="btn limpiarPlano">
        Limpiar Plano
    </div>
</div>

<input type="hidden" name="terminal" id="terminal" value="<?php echo $terminal; ?>" />
<input type="hidden" name="tienda" id="tienda" value="<?php echo $tienda; ?>" />
<input type="hidden" name="showall" id="showall" value="<?php echo $showAll; ?>" />
<input type="hidden" name="showcoordenadas" id="showcoordenadas" value="<?php echo $showCoordenadas; ?>" />
<input type="hidden" name="createpoligono" id="createpoligono" value="<?php echo $createPoligono; ?>" />
<input type="hidden" name="posx" id="posx" value="<?php echo $posx; ?>" />
<input type="hidden" name="posy" id="posy" value="<?php echo $posy; ?>" />
<div id="mapa"></div>
<script>

    $(document).ready(function() {

//        polyline = "";
        polyline = [];

        map = createGoogleMap(null, null);

        posx = parseFloat($("#posx").val());
        posy = parseFloat($("#posy").val());

        addPointInGoogleMap(map, posx, posy);

        var terminal = $("#terminal").val();
        var tienda = $("#tienda").val();
        var showall = $("#showall").val();
        var createpoligono = $("#createpoligono").val();
        showcoordenadas = $("#showcoordenadas").val();

        if (showall == "true") {
            $(".contanEnc").remove();
            getInfoTerminales(tienda);
        } else
        if (showall == "onlyone") {
            showCoberturaTerminales(tienda, terminal);
        }

        if (createpoligono == "true") {

            //////////para crear puntos polígonos init
            var poly = createPoligonosMaps(map);

            var coordenadas = new Array();
            var i = 0;
            google.maps.event.addListener(map, 'click', function(event) {
                var pos = addLatLngToPoly(event.latLng, poly);
                coordenadas[i] = pos;
//                polyline.push(pos);
                i++;
            });

            //////////para crear puntos polígonos end

            $(".save").click(function() {
                saveCoberturaByTerminal(coordenadas);
            });

            $(".reinit").click(function() {
                window.location.reload();
            });

            $(".limpiarPlano").click(function() {
                removeLine();

            });
        }

    });

    function removeLine() {
        polyline.setMap(null);
    }

    function saveCoberturaByTerminal(coordenadas) {
        var data = {};
        data["tienda"] = $("#tienda").val();
        data["terminal"] = $("#terminal").val();
        data["coordenadas"] = coordenadas;
        var rpc = {};
        rpc["service"] = "pv_nwsites";
        rpc["method"] = "saveCoberturaByTerminal";
        rpc["data"] = data;
        var func = function(r) {
            console.log(r);
            if (!r) {
                nw_dialog("Lo sentimos, no hay mapas");
                return false;
            } else {
                window.location.reload();
            }
        };
        rpcNw("rpcNw", rpc, func);
    }
    function getInfoTerminales(tienda) {
        var rpc = {};
        rpc["service"] = "pv_nwsites";
        rpc["method"] = "getTiendasByCliente";
        rpc["data"] = {tienda: tienda};
        var func = function(r) {
            if (!r) {
                nw_dialog("Lo sentimos, no hay tiendas");
                return false;
            } else {
                for (var i = 0; i < r.length; i++) {
                    var terminal = r[i].id;
                    showCoberturaTerminales(tienda, terminal);
                }
            }
        };
        rpcNw("rpcNw", rpc, func);
    }

    function showCoberturaTerminales(tienda, terminal) {
        var rpca = {};
        rpca["service"] = "pv_nwsites";
        rpca["method"] = "getCoberturaPorPunto";
        rpca["data"] = {tienda: tienda, terminal: terminal};
        var funcc = function(ra) {
            if (ra) {
                var triangleCoords = [];
                for (var i = 0; i < ra.length; i++) {
                    var x = parseFloat(ra[i].x);
                    var y = parseFloat(ra[i].y);
                    var coor = {lat: x, lng: y};
                    triangleCoords.push(coor);
                }
                polyline = showPoligonoMap(map, triangleCoords, showcoordenadas);
            }
        };
        rpcNw("rpcNw", rpca, funcc);
    }

</script>