<?php
$usedOutNwlib = true;
//require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/server.php";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);

$fields = "origen,latitudOri,longitudOri,destino,latitudDes,longitudDes";
$fields .= ",fecha,hora, CONCAT(fecha, ' ', hora) as fecha_hora_servicio,fecha_finaliza_servicio_driver,hora_llegada,fecha_conductor";
$fields .= ",latitudAceptaService,longitudAceptaService";
$fields .= ",latitudConfirmaLlegada,longitudConfirmaLlegada";
$fields .= ",latitudFinalizaServicio,longitudFinalizaServicio";
$fields .= ",latitud_actual,longitud_actual";
$ca->prepareSelect("edo_servicios", $fields, "id=:id");
$ca->bindValue(":id", $_GET["id"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
if ($ca->size() == 0) {
    echo "Viaje no existe";
    return false;
}
$enc = $ca->flush();
if (!nwMaker::evalueData($enc["latitudOri"])) {
    $enc["latitudOri"] = 4.6777153;
}
if (!nwMaker::evalueData($enc["longitudOri"])) {
    $enc["longitudOri"] = -74.0467835;
}

if (
        !nwMaker::evalueData($enc["latitudOri"]) ||
        !nwMaker::evalueData($enc["longitudOri"]) || !nwMaker::evalueData($enc["latitudDes"]) || !nwMaker::evalueData($enc["longitudDes"])
) {
    echo "No cuenta con las coordenadas del viaje principal.";
    return false;
}

$ca->prepareSelect("edo_posicion_users", "latitud,longitud,latitudEnd,longitudEnd,tipo", "id_servicio=:id order by id asc");
$ca->bindValue(":id", $_GET["id"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
$total = $ca->size();
$r = $ca->assocAll();
//$start = $r[0]["latitud"];
//$end = $r[0]["longitud"];
//$startEnd = $r[$total - 1]["latitudEnd"];
//$endEnd = $r[$total - 1]["longitudEnd"];
$start = $enc["latitudOri"];
$end = $enc["longitudOri"];
$startEnd = $enc["latitudDes"];
$endEnd = $enc["longitudDes"];

$ca->prepareSelect("edo_servicio_parada", "latitud_final,longitud_final,latitud_parada,longitud_parada,estado", "id_servicio=:id order by fecha_final asc");
$ca->bindValue(":id", $_GET["id"]);
if (!$ca->exec()) {
    return nwMaker::error($ca->lastErrorText());
}
$paradas = Array();
$paradasTotal = $ca->size();
if ($paradasTotal > 0) {
    $paradas = $ca->assocAll();
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Directions Service</title>
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta charset="utf-8">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <style>
            #map {
                height: 100%;
            }
            html,
            body {
                height: 100%;
                margin: 0;
                padding: 0;
                font-family: arial;
            }
            .menu {
                position: fixed;
                top: 10px;
                left: 189px;
                z-index: 1;
                display: flex;
            }
            .checkitem{
                background: none padding-box rgb(255, 255, 255);
                display: table-cell;
                border: 0px;
                margin: 0px;
                padding: 0px 17px;
                text-transform: none;
                appearance: none;
                position: relative;
                cursor: pointer;
                user-select: none;
                direction: ltr;
                overflow: hidden;
                text-align: center;
                height: 40px;
                vertical-align: middle;
                color: rgb(0, 0, 0);
                font-family: Roboto, Arial, sans-serif;
                font-size: 18px;
                border-bottom-left-radius: 2px;
                border-top-left-radius: 2px;
                box-shadow: rgb(0 0 0 / 30%) 0px 1px 4px -1px;
                min-width: 36px;
                font-weight: 500;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-content: center;
                justify-content: space-between;
                align-items: center;
            }
            .map-label {
                background-color: red;
                padding: 5px;
                border-radius: 5px;
                color: #fff!important;
                font-size: 10px!important;
                top: -8px;
                position: relative;
                left: 33px;
            }
            .map-label-parada{
                top: -20px!important;
                font-size: 9px!important;
            }
            .map-label-init{
                background-color: #000;
                font-size: 13px!important;
                font-weight: bold;
            }
            .map-label-final{
                background-color: green;
                font-size: 13px!important;
                font-weight: bold;
            }
            .map-label-init-destino{
                top: -10px;
            }
            .map-label-inicia{
                top: 0px;
                background-color: green;
            }
            .map-label-conductoractual{
                top: 0px;
                background-color: violet;
            }
            .map-label-llegada{
                top: -22px;
                background-color: orange;
            }
            .map-label-finaliza{
                top: -16px;
            }
        </style>
        <script>
            function initMap() {

                actionsBtns();

                markers = [];

//                var svgMarkerOrange = {
//                    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
//                    fillColor: "orange",
//                    fillOpacity: 1,
//                    strokeWeight: 0,
//                    rotation: 0,
//                    scale: 2,
//                    anchor: new google.maps.Point(15, 30)
//                };

                var myLatLng = {lat: <?php echo $start; ?>, lng: <?php echo $end; ?>};
                map = new google.maps.Map(document.getElementById("map"), {
                    zoom: 16, center: myLatLng
                });
//                setTimeout(function () {
//                    centra mapa
                var bounds = new google.maps.LatLngBounds();
                bounds.extend({lat: <?php echo $start; ?>, lng: <?php echo $end; ?>});
                bounds.extend({lat: <?php echo $startEnd; ?>, lng: <?php echo $endEnd; ?>});
<?php
if (nwMaker::evalueData($enc["latitud_actual"]) && nwMaker::evalueData($enc["longitud_actual"])) {
    ?>
                    bounds.extend({lat: <?php echo $enc["latitud_actual"]; ?>, lng: <?php echo $enc["longitud_actual"]; ?>});
    <?php
}
?>
//                map.setCenter(bounds.getCenter());
                map.fitBounds(bounds);
//                }, 1000);


                partida = new google.maps.Marker({
                    position: {lat: <?php echo $start; ?>, lng: <?php echo $end; ?>},
                    map,
                    infoWindow: "<?php echo strip_tags(str_replace('"', '', $enc["origen"])); ?>",
                    title: "",
                    optimized: true,
                    label: {
                        text: "Partida (<?php echo $enc["fecha_hora_servicio"]; ?>)",
                        className: "map-label map-label-init"
                    },
                    icon: '/lib_mobile/driver/img/marker_a.png',
                });
                destino = new google.maps.Marker({
                    position: {lat: <?php echo $startEnd; ?>, lng: <?php echo $endEnd; ?>},
                    map,
                    infoWindow: "<?php echo strip_tags(str_replace('"', '', $enc["destino"])); ?>",
                    title: "",
                    optimized: true,
                    label: {
                        text: "Destino ",
                        className: "map-label map-label-init map-label-init-destino"
                    },
                    icon: '/lib_mobile/driver/img/marker_b.png',
                });

<?php
if (nwMaker::evalueData($enc["latitud_actual"]) && nwMaker::evalueData($enc["longitud_actual"])) {
    ?>
                    inicia = new google.maps.Marker({
                        position: {lat: <?php echo $enc["latitud_actual"]; ?>, lng: <?php echo $enc["longitud_actual"]; ?>},
                        map,
                        title: "",
                        optimized: true,
                        label: {
                            text: "Conductor",
                            className: "map-label map-label-final map-label-conductoractual"
                        }
                    });
    <?php
}
if (nwMaker::evalueData($enc["latitudAceptaService"]) && nwMaker::evalueData($enc["longitudAceptaService"])) {
    ?>
                    inicia = new google.maps.Marker({
                        position: {lat: <?php echo $enc["latitudAceptaService"]; ?>, lng: <?php echo $enc["longitudAceptaService"]; ?>},
                        map,
                        title: "",
                        optimized: true,
                        label: {
                            text: "Inicia <?php echo $enc["fecha_conductor"]; ?>",
                            className: "map-label map-label-final map-label-inicia"
                        }
                    });
    <?php
}
if (nwMaker::evalueData($enc["latitudConfirmaLlegada"]) && nwMaker::evalueData($enc["longitudConfirmaLlegada"])) {
    ?>
                    llega = new google.maps.Marker({
                        position: {lat: <?php echo $enc["latitudConfirmaLlegada"]; ?>, lng: <?php echo $enc["longitudConfirmaLlegada"]; ?>},
                        map,
                        title: "",
                        optimized: true,
                        label: {
                            text: "Llega punto de partida <?php echo $enc["hora_llegada"]; ?>",
                            className: "map-label map-label-final map-label-llegada"
                        }
                    });
    <?php
}
?>
<?php
if (nwMaker::evalueData($enc["latitudFinalizaServicio"]) && nwMaker::evalueData($enc["longitudFinalizaServicio"])) {
    ?>
                    finaliza = new google.maps.Marker({
                        position: {lat: <?php echo $enc["latitudFinalizaServicio"]; ?>, lng: <?php echo $enc["longitudFinalizaServicio"]; ?>},
                        map,
                        infoWindow: "<?php echo strip_tags(str_replace('"', '', $enc["destino"])); ?>",
                        title: "",
                        optimized: true,
                        label: {
                            text: "Finaliza (<?php echo $enc["fecha_finaliza_servicio_driver"]; ?>)",
                            className: "map-label map-label-final map-label-finaliza"
                        }
                    });
    <?php
}
?>

                //trazaline
                var allCoordinates = [];
                var lineSymbol = {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: "blue",
                    fillOpacity: 0.6,
                    strokeWeight: 0,
                    rotation: 0,
                    scale: 3,
                    strokeColor: "#393",
                };
<?php
for ($i = 0; $i < $paradasTotal; $i++) {
    $pa = $paradas[$i];
    $latitud = null;
    $longitud = null;
    $icon = "/lib_mobile/driver/img/marker_g.png";
    if (nwMaker::evalueData($pa["latitud_parada"]) && nwMaker::evalueData($pa["longitud_parada"])) {
        $latitud = $pa["latitud_parada"];
        $longitud = $pa["longitud_parada"];
    }
    if (nwMaker::evalueData($pa["latitud_final"]) && nwMaker::evalueData($pa["longitud_final"])) {
        $latitud = $pa["latitud_final"];
        $longitud = $pa["longitud_final"];
        $icon = "/lib_mobile/driver/img/marker_v.png";
    }
    error_log("latitud {$latitud}");
    error_log("latitud {$longitud}");
    if (nwMaker::evalueData($latitud) && nwMaker::evalueData($longitud)) {
        ?>
                        var marker = new google.maps.Marker({
                            position: {lat: <?php echo $latitud; ?>, lng: <?php echo $longitud; ?>},
                            map,
                            infoWindow: "<?php echo $pa["estado"]; ?>",
                            title: "<?php echo $pa["estado"]; ?>",
                            optimized: true,
                            label: {
                                text: "P(<?php echo $i + 1; ?>) <?php echo $pa["estado"]; ?>",
                                className: "map-label map-label-parada"
                            }
                        });
                        markers.push(marker);
        <?php
    }
}
for ($i = 0; $i < $total; $i++) {
    $ra = $r[$i];
    if (nwMaker::evalueData($ra["latitud"]) && nwMaker::evalueData($ra["longitud"])) {
        ?>

                        allCoordinates.push(new google.maps.LatLng(<?php echo $ra["latitud"]; ?>, <?php echo $ra["longitud"]; ?>));
        <?php
    }
    if (nwMaker::evalueData($ra["latitudEnd"]) && nwMaker::evalueData($ra["longitudEnd"])) {
        ?>

                        allCoordinates.push(new google.maps.LatLng(<?php echo $ra["latitudEnd"]; ?>, <?php echo $ra["longitudEnd"]; ?>));
        <?php
    }
    if ($i === 0) {
        ?>
                        //                        var svgMarker = {
                        //                            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                        //                            fillColor: "blue",
                        //                            //                            fillOpacity: 0.6,
                        //                            fillOpacity: 1,
                        //                            strokeWeight: 0,
                        //                            rotation: 0,
                        //                            scale: 2,
                        //                            anchor: new google.maps.Point(15, 30),
                        //                        };
                        /*
                         var marker = new google.maps.Marker({
                         position: {lat: <?php echo $ra["latitud"]; ?>, lng: <?php echo $ra["longitud"]; ?>},
                         map,
                         infoWindow: "Acepta viaje",
                         title: "Inicio",
                         optimized: false,
                         icon: '/lib_mobile/driver/img/marker_a.png',
                         });
                         */
                        //                    var infowindow = new google.maps.InfoWindow({
                        //                    content: "Acepta viaje"
                        //                    });
                        //                    infowindow.open(map, marker);
        <?php
    } else {
        if (nwMaker::evalueData($ra["latitud"]) && nwMaker::evalueData($ra["longitud"])) {
            ?>
                            new google.maps.Marker({
                                position: {lat: <?php echo $ra["latitud"]; ?>, lng: <?php echo $ra["longitud"]; ?>},
                                map,
                                title: "",
                                optimized: true,
                                icon: lineSymbol
                            });
            <?php
        }
    }

    /*
      if($ra["tipo"] === "LLEGA_SITIO_ORIGEN_ESPERA_ABORDAJE" && !$llega_al_origen) {
      ?>
      var svgMarker = {
      path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      //                            fillColor: "blue",
      fillColor: "red",
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
      };
      new google.maps.Marker({
      position: {lat: <?php echo $ra["latitudEnd"]; ?>, lng: <?php echo $ra["longitudEnd"]; ?>}, map, title: "Llega origen", optimized: false, icon: svgMarker,
      });
      <?php
      $llega_al_origen = true;
      } else
     */
    $aborda = false;
    if ($ra["tipo"] === "ABORDO_DESTINO_EN_CAMINO" && !$aborda) {
        if (nwMaker::evalueData($ra["latitudEnd"]) && nwMaker::evalueData($ra["longitudEnd"])) {
            ?>
                            //                        var svgMarker = {
                            //                            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                            //                            fillColor: "orange",
                            //                            fillOpacity: 1,
                            //                            strokeWeight: 0,
                            //                            rotation: 0,
                            //                            scale: 2,
                            //                            anchor: new google.maps.Point(15, 30)
                            //                        };
                            /*
                             var marker = new google.maps.Marker({
                             position: {lat: <?php echo $ra["latitudEnd"]; ?>, lng: <?php echo $ra["longitudEnd"]; ?>}, map, title: "Aborda, inicia viaje", optimized: true, icon: svgMarker,
                             });
                             var infowindow = new google.maps.InfoWindow({
                             content: "Aborda, inicia viaje"
                             });
                             infowindow.open(map, marker);
                             */
            <?php
            $aborda = true;
        }
    }
    if ($i + 1 === $total) {
        if (nwMaker::evalueData($ra["latitudEnd"]) && nwMaker::evalueData($ra["longitudEnd"])) {
            ?>
                            //                        var svgMarker = {
                            //                            path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                            //                            fillColor: "green",
                            //                            fillOpacity: 1,
                            //                            strokeWeight: 0,
                            //                            rotation: 0,
                            //                            scale: 2,
                            //                            anchor: new google.maps.Point(15, 30),
                            //                        };
                            var marker = new google.maps.Marker({
                                position: {lat: <?php echo $ra["latitudEnd"]; ?>, lng: <?php echo $ra["longitudEnd"]; ?>},
                                map,
                                title: "Finaliza",
                                optimized: true,
                                //                            icon: '/lib_mobile/driver/img/marker_b.png',
                                icon: '/lib_mobile/driver/img/pindriver_1_35.png',
                            });
                            //                        var infowindow = new google.maps.InfoWindow({
                            //                            content: "Finaliza"
                            //                        });
                            //                        infowindow.open(map, marker);
            <?php
        }
    } else {
        ?>
                        //                        new google.maps.Marker({
                        //                            position: {lat: <?php echo $ra["latitudEnd"]; ?>, lng: <?php echo $ra["longitudEnd"]; ?>}, 
                        //                            map, 
                        //                            title: "", 
                        //                            optimized: false, 
                        //                            icon: lineSymbol
                        //                        });
        <?php
    }
}
?>

                var polyline = new google.maps.Polyline({
                    path: allCoordinates,
                    strokeColor: "#5491F5",
                    strokeOpacity: 2.0,
                    strokeWeight: 2,
                    geodesic: true,
                    clickable: true
//                    ,
//                    icons: [{
//                            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
//                            offset: '100%'
//                        }]
                });
                polyline.setMap(map);
            }

            function actionsBtns() {
                document.querySelector(".btnPartida").onclick = function () {
                    if (this.checked) {
                        partida.setMap(map);
                    } else {
                        partida.setMap(null);
                    }
                };
                document.querySelector(".btnDestino").onclick = function () {
                    if (this.checked) {
                        destino.setMap(map);
                    } else {
                        destino.setMap(null);
                    }
                };
                document.querySelector(".btnInicia").onclick = function () {
                    if (this.checked) {
                        inicia.setMap(map);
                    } else {
                        inicia.setMap(null);
                    }
                };
                document.querySelector(".btnLlega").onclick = function () {
                    if (this.checked) {
                        llega.setMap(map);
                    } else {
                        llega.setMap(null);
                    }
                };
                document.querySelector(".btnFinaliza").onclick = function () {
                    if (this.checked) {
                        finaliza.setMap(map);
                    } else {
                        finaliza.setMap(null);
                    }
                };
                document.querySelector(".btnParadas").onclick = function () {
                    if (this.checked) {
                        showMarkers();
                    } else {
                        hideMarkers();
                    }
                };

                function setMapOnAll(map) {
                    for (let i = 0; i < markers.length; i++) {
                        markers[i].setMap(map);
                    }
                }

// Removes the markers from the map, but keeps them in the array.
                function hideMarkers() {
                    setMapOnAll(null);
                }

// Shows any markers currently in the array.
                function showMarkers() {
                    setMapOnAll(map);
                }

            }

        </script>
    </head>
    <body>
        <div class="menu">
            <div class="checkitem">
                <label>Partida</label>
                <input type="checkbox" class="btn btnPartida" checked />
            </div>
            <div class="checkitem">
                <label>Destino</label>
                <input type="checkbox" class="btn btnDestino" checked />
            </div>
            <div class="checkitem">
                <label>Inicia</label>
                <input type="checkbox" class="btn btnInicia" checked />
            </div>
            <div class="checkitem">
                <label>Llega punto partida</label>
                <input type="checkbox" class="btn btnLlega" checked />
            </div>
            <div class="checkitem">
                <label>Finaliza</label>
                <input type="checkbox" class="btn btnFinaliza" checked />
            </div>
            <div class="checkitem">
                <label>Paradas</label>
                <input type="checkbox" class="btn btnParadas" checked />
            </div>
        </div>

        <div id="map"></div>
        <script
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBlqkcJcLStw3Mbqou7Qa504VdJwfFpvis&callback=initMap"
            async
        ></script>
    </body>
</html>