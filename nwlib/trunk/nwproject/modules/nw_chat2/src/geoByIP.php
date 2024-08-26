<?php
//$ip = $_SERVER['REMOTE_ADDR'];
$ip = $_GET["ip"];

$meta = unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip=' . $ip));
$latitud = $meta['geoplugin_latitude'];
$longitud = $meta['geoplugin_longitude'];

$m = " <div class='textT'>";
$m .= "Latitud: " . $latitud;
$m .=" Longitud: " . $longitud;
$m .=" País:" . $meta["geoplugin_countryName"];
$m .=" Ciudad:" . $meta['geoplugin_city'];
$m .="</div>";
?>
<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-size: 12px;
                font-family: arial;
            }
            #map{
                position: fixed!important;
                width: 100%;
                height: 100%;
                top: 0px;
                left: 0px;
            }
            .text{
                position: fixed;
                width: 100%;
                height: auto;
                top: 0px;
                left: 0px;
                z-index: 10;
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            function initMap() {
                var uluru = {lat: <?php echo $latitud; ?>, lng: <?php echo $longitud; ?>};
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 15,
                    center: uluru
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                var pos = map.getCenter();
                infoWindow.setPosition(pos);
                infoWindow.setContent("<?php echo $m; ?>");
                map.setCenter(pos);

                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
            }
        </script>
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkI3HE2iU7-m3qSy3LR7dON2Pf_Qx8Tas&callback=initMap"
        async defer></script>
    </body>
</html>