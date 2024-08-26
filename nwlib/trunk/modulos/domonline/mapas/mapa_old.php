<?php
 include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$nwv = master::getNwlibVersion();
if (session_id() == "") {
    session_start();
}
$zona = "";
if (isset($_GET["terminal"])) {
    $zona = $_GET["terminal"];
}
if (isset($_POST["terminal"])) {
    $zona = $_POST["terminal"];
}
if ($zona == "") {
    return;
}

function banner_nws($zona) {
    $dbb = NWDatabase::database();
    $ca = new NWDbQuery($dbb);
    $ca->prepareSelect("pv_tiendas_direcciones", "*", "terminal=:zona");
//            $ca->bindValue(":id_cliente", $id_cliente);
    $ca->bindValue(":zona", $zona);
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "No hay información";
        return;
    }
    ?>
    <?php
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        ?>
        <div class='marcaPolig marcaPolig_<?php echo $i; ?>' data-x='<?php echo $r["pos_y"]; ?>' data-y='<?php echo $r["pos_x"]; ?>' >
            <?php echo $r["pos_x"] . " " . $r["pos_y"]; ?> 
        </div>
        <?php
    }
//    zona($zona);
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html;charset=ISO-8859-1">
            <title>Mapa de Google</title>
            <!--<script type="text/javascript" src="/contenido/js/jquery.min.js" ></script>-->
            <script type="text/javascript" src="/nwlib<?php echo $nwv; ?>/modulos/domonline/js/jquery.min.js" ></script>
            <!--<script type="text/javascript" src="/nwproject/php/modulos/nwsites/js/mapa.js" ></script>-->
            <script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=ABQIAAAAUnJY3ChJhF0YgyTSDJuVfBTqu-zEVMNfNVaqfAe9FKyfKhfBExSs9LrIQ7GOuBeSnaddg05sRmEBxQ"  type="text/javascript"></script>
            <script type="text/javascript">
                $(document).ready(function() {
                    var a = $("#pos_x").val();
                    var b = $("#pos_y").val();
                    var c = $("#zoom").val();
                    pos_x = a;
                    pos_y = b;
                    zoom = c;
                    $('.delete_poligono').click(function() {
                        $(".marcaPolig").remove();
                        load(pos_x, pos_y, zoom);
                    });
                    $('#search').click(function() {
                        var modo = $('#modo').val();
                        var xx = $('#xx').val();
                        var yy = $('#yy').val();
                        var zz = $('#zz').val();
                        var city = $('#city').val();
                        var address = modo + " " + xx + " " + yy + " " + zz + " " + city;
                        var geocoder = new google.maps.Geocoder();
                        geocoder.geocode({'address': address}, geocodeResult);
                    });
                    function geocodeResult(results, status) {
                        if (status == 'OK') {
                            var data = results[0].geometry.location;
                            var place = results[0].address_components[2].long_name;
//                        $("#informacion").append(data.A + ", " + data.F + " " + place);
                            load("" + data.F + "", "" + data.A + "", 17, "SI");
                        } else {
                            alert("Geocoding no tuvo éxito debido a: " + status);
                        }
                    }
                    $('#saveMapa').click(function() {
                        var datosPolig = [];
                        var equis = [];
                        var ye = [];
                        var data = {};
                        var zona = $("#zona").val();
                        var pos_x = $("#pos_x").val();
                        var pos_y = $("#pos_y").val();
                        var zoom = $("#zoom").val();
                        var ElementosMitexto = $(".marcaPolig");
                        var total = ElementosMitexto.length;
                        for (var i = 0; i < total; i++) {
                            var xx = $(".marcaPolig_" + i).attr("data-x");
                            var yy = $(".marcaPolig_" + i).attr("data-y");
                            var v = {};
                            v.long = xx;
                            v.leng = yy;
                            datosPolig.push(v);
                        }
                        data["poligonos"] = datosPolig;
                        data["zona"] = zona;
                        data["pos_x"] = pos_x;
                        data["pos_y"] = pos_y;
                        data["zoom"] = zoom;
                        $.ajax({
                            type: "POST",
//                            url: "/nwproject/php/modulos/nwsites/srv/saveMapaPuntos.php",
                            url: "saveMapaPuntos.php",
                            data: data,
                            error: function() {
                                alert("La operación no pudo ser procesada. Inténtelo de nuevo.");
                            },
                            success: function(data) {
                                window.location.reload();
                            }
                        });
                    });
                });
                var polygon;
                suma = 0;
                function load(X, Y, Z, m) {
                    if (GBrowserIsCompatible()) {
                        var positionX = parseFloat(X);
                        var positionY = parseFloat(Y);
                        var frase1 = "" + positionX + "";
                        var positionXreplace = frase1.replace("-", '');
                        var frase4 = "" + positionY + "";
                        var positionYreplace = frase4.replace("-", '');
                        var dentroX = "NO";
                        var dentroY = "NO";

                        var map = new GMap2(document.getElementById("map"));
                        console.log(Z);
                        map.setCenter(new GLatLng(positionY, positionX), Z);
                        map.setMapType(G_NORMAL_MAP);

                        var ElementosMitexto = $(".marcaPolig");
                        var total = ElementosMitexto.length;
                        var datosPolig = [];
                        var equis = [];
                        var ye = [];
                        for (var i = 0; i < total; i++) {
                            var xx = $(".marcaPolig_" + i).attr("data-x");
                            var yy = $(".marcaPolig_" + i).attr("data-y");
                            if (xx != undefined && yy != undefined) {
                                var xxReplace = xx.replace("-", '');
                                var yyReplace = yy.replace("-", '');
                                datosPolig[i] = new GLatLng(xx, yy);
                                equis[i] = yyReplace;
                                ye[i] = xxReplace;
                            }
                        }
                        function  buscaX(array, search) {
                            array.sort();
                            var old = null;
                            for (var i = 0; i < array.length; i++) {
                                if (i == 0) {
                                    old = array[i];
                                }
                                if (search > old && search < array[i]) {
                                    dentroX = "SI";
                                }
                                old = array[i];
                            }
                        }
                        function  buscaY(array, search) {
                            array.sort();
                            var old = null;
                            for (var i = 0; i < array.length; i++) {
                                if (i == 0) {
                                    old = array[i];
                                }
                                if (search > old && search < array[i]) {
                                    dentroY = "SI";
                                }
                                old = array[i];
                            }
                        }
                        buscaX(equis, positionXreplace);
                        buscaY(ye, positionYreplace);
                        if (m == "SI") {
                            if (dentroX == "SI" && dentroY == "SI") {
                                document.getElementById("entraosale").innerHTML = "Dentro!";
                                document.getElementById("entraosale").className = "dentro";
                            } else {
                                document.getElementById("entraosale").innerHTML = "Fuera!";
                                document.getElementById("entraosale").className = "fuera";
                            }
                        }
                        polygon = new GPolygon([datosPolig], "#669933", 5, 0.7, "#996633", 0.4);
                        var point;
                        point = map.getCenter();
                        var marker = new GMarker(point);
                        GEvent.addListener(map, "click", function(overlay, point) {
                            marker.setPoint(point);
                            map.addOverlay(marker);
                            marker.openInfoWindowHtml("<div style='font-size: 8pt; font-family: verdana'>Mi marca situada en<br>Latitud: " + point.lat() + "<br>Longitud: " + point.lng() + "</div>");
                            $("#datas").append("<div class='marcaPolig marcaPolig_" + suma + "' data-x='" + point.lat() + "' data-y='" + point.lng() + "' >" + point.lat() + " " + point.lng() + "</div>");
                            suma++;
                            load(pos_x, pos_y, zoom);
//                            load(X, Y, Z);
                        });
                        GEvent.addListener(map, "dragend", function() {
                            var point = map.getCenter();
                            var zoo = map.getZoom();
                            $("#pos_x").val(point.lng());
                            $("#pos_y").val(point.lat());
                            $("#zoom").val(zoo);
                            pos_x = point.lng();
                            pos_y = point.lat();
                            zoom = zoo;
                            load(pos_x, pos_y, zoom);
                        });
//                        GEvent.addListener(map, 'zoom_changed', function() {
//                            var point = map.getCenter();
//                            var zoo = map.getZoom();
//                            $("#pos_x").val(point.lng());
//                            $("#pos_y").val(point.lat());
//                            $("#zoom").val(zoo);
//                            pos_x = point.lng();
//                            pos_y = point.lat();
//                            zoom = zoo;
//                            load(pos_x, pos_y, zoom);
//                        });
                        map.addOverlay(polygon);
                        var punto_marca = new GPoint(positionX, positionY);
                        var marca = new GMarker(punto_marca);
                        if (m == "SI") {
                            map.addOverlay(marca);
                        }
                    }
                }
            </script>
            <style>
                body {
                    position: relative;
                    margin: 0;
                    padding: 0;
                    font-family: arial;
                    font-size: 12px;
                    color: #454545;
                }
                #datas {
                    position: relative;
                    right: 0;
                    top: 0;
                    width: 25%;
                    float: right;
                    background: #FAFAFA;
                    height: 100%;
                    border: 1px solid #E4E4E4;
                    padding: 10px;
                    border-radius: 3px;
                    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.34);
                }
                #map {
                    width: 70%;
                    height: 100%;
                    position: relative;
                    overflow: hidden;
                    transform: translateZ(0px) translateZ(0px);
                    background-color: rgb(229, 227, 223);
                    min-height: 800px;
                    max-height: 100%;
                    float: left;
                }
                input {
                    max-width: 40px;
                    padding: 5px 10px;
                }
                #entraosale {
                    position: relative;
                    margin: 0;
                    padding: 10px;
                    text-align: center;
                    color: #fff;
                    top: 0;
                    right: 0;
                }
                .fuera {
                    background: red;
                }
                .dentro{
                    background: green;
                }
                .marcaPolig {
                    position: relative;
                    border-bottom: 1px solid #ccc;
                    padding: 5px;
                }
                #saveMapa {
                    position: relative;
                    background: green;
                    color: #fff;
                    display: -webkit-inline-box;
                    margin: 15px;
                    padding: 5px;
                    cursor: pointer;
                }
                .delete_poligono{
                    position: relative;
                    color: #fff;
                    text-align: right;
                    background: green;
                    padding: 5px;
                    display: -webkit-inline-box;
                    cursor: pointer;
                }
                .terminal_info{

                }
                .terminal_info input {
                    max-width: inherit;
                }
            </style>
            <?php
            //function zona($zona) {
            $dbb = NWDatabase::database();
            $ca = new NWDbQuery($dbb);
//    $table = "pv_tiendas_direcciones_zonas";
            $table = "terminales";
            $ca->prepareSelect($table, "*", "id=:zona");
            $ca->bindValue(":zona", $zona);
            if (!$ca->exec()) {
                echo "Error. " . $ca->lastErrorText();
                return;
            }
            $total = $ca->size();
            if ($total == 0) {
                echo "No hay información";
                return;
            }
            $ca->next();
            $r = $ca->assoc();
            $pos_x = $r["pos_x"];
            $pos_y = $r["pos_y"];
            $zoom = $r["zoom"];
            if($pos_x == "" || $pos_x == null) {
                $pos_x = "-74.09222602844238";
            }
            if($pos_y == "" || $pos_y == null) {
                $pos_y = "4.753283966693326";
            }
            if($zoom == "" || $zoom == null) {
                $zoom = "15";
            }
            ?>
            <script>
                $(document).ready(function() {
                    load("<?php echo $pos_x; ?>", "<?php echo $pos_y; ?>", <?php echo $zoom; ?>);
                });
            </script>
            <?php
//}
            ?>
    </head>
    <body>
        <form id="datos_mapa">
            <input type="hidden" name="zona" id="zona" value="<?php echo $zona; ?>" />
            <div>
                <select name="city" id="city">
                    <option value="Bogota">Bogota</option>
                    <option value="Chia">Chia</option>
                </select>
                <select name="modo" id="modo">
                    <option value="Calle">Calle</option>
                    <option value="Carrera">Carrera</option>
                    <option value="Avenida">Avenida</option>
                    <option value="Diagonal">Diagonal</option>
                    <option value="Transversal">Transversal</option>
                </select>
                <input type="text" maxlength="100" id="xx" name="xx"  /> 
                #
                <input type="text" maxlength="100" id="yy" name="yy"  /> 
                -
                <input type="text" maxlength="100" id="zz" name="zz"  /> 
                <input type="button" id="search" value="Ok" />
            </div>
            <div class="terminal_info">
                Ubicación terminal:
                <input type="text" name="lat" id="pos_x" value="<?php echo $pos_x; ?>" />
                <input type="text" name="lon" id="pos_y" value="<?php echo $pos_y; ?>" />
                <input type="text" name="zoom" id="zoom" value="<?php echo $zoom; ?>" />
            </div>
        </form>
        <br/>
        <h2 id="entraosale"></h2>
        <div id="informacion"></div>
        <div id="datas">
            <div class="delete_poligono">
                Reiniciar Coordenadas
            </div>
            <div class="saveMapa" id="saveMapa">
                Guardar Mapa
            </div>
            <?php
            banner_nws($zona);
            ?>
        </div>
        <div id="map" ></div>
    </body>
</html>