<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

  $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_posicion_users", "*", "id_servicio=4321 order by id asc limit 11");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $r = $ca->assocAll();
        $start = $r[0]["latitud"];
        $end = $r[0]["longitud"];
        $startEnd = $r[count($r) - 1]["latitud"];
        $endEnd = $r[count($r) - 1]["longitud"];
//        print_r($r);
//        print_r($r[419]);
//        echo count($r);
//        return;

?>
<!DOCTYPE html>
<html>
    <head>
        <title>Directions Service</title>
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
        <style>
            /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
#map {
  height: 100%;
}

/* Optional: Makes the sample page fill the window. */
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#floating-panel {
  position: absolute;
  top: 10px;
  left: 25%;
  z-index: 5;
  background-color: #fff;
  padding: 5px;
  border: 1px solid #999;
  text-align: center;
  font-family: "Roboto", "sans-serif";
  line-height: 30px;
  padding-left: 10px;
}
        </style>
        <script>
        function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 },
  });

  directionsRenderer.setMap(map);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  
  onChangeHandler();
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
          var start = new google.maps.LatLng(<?php echo $start; ?>, <?php echo $end; ?>);
          var end = new google.maps.LatLng(<?php echo $startEnd; ?>, <?php echo $endEnd; ?>);
//          var start = new google.maps.LatLng(4.690028289799077, -74.03975935013044);
//        var end = new google.maps.LatLng(4.690035891081546, -74.03974563360771);
//        var tres = new google.maps.LatLng(4.6499989, -74.0638745);
//        var cuatro = new google.maps.LatLng(4.690030990245962, -74.03974291670825);
  directionsService
    .route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
       waypoints: [
           <?php
           for($i = 0; $i < count($r); $i++) {
               $ra = $r[$i];
               ?>
                                {
      location: new google.maps.LatLng(<?php echo $ra["latitud"]; ?>, <?php echo $ra["longitud"]; ?>),
      stopover: false
    },
                                {
      location: new google.maps.LatLng(<?php echo $ra["latitudEnd"]; ?>, <?php echo $ra["longitudEnd"]; ?>),
      stopover: false
    },
                               <?php
           }
           ?>
    ],
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}
        </script>
    </head>
    <body>
        <div id="map"></div>
        <!-- Async script executes immediately and must be after any DOM elements used in callback. -->
        <script
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyACNy07A4kREm7VTt6ucGPSTJTMPfSi3nM&callback=initMap&v=weekly"
            async
        ></script>
    </body>
</html>