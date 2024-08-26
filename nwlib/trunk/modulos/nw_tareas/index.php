<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesion Invalida. Inicie sesion.." . $_SESSION["usuario"] . " user";
    ?>
    <script type="text/javascript">
        window.location = "/tasklogin";
    </script>
    <?php
    return true;
}
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
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "<?php echo $protocolo; ?>://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<?php
//$nwlib_ver = "nwlib{$cfg["nwlibVersion"]}";
$nwlib_ver = "nwlib" . master::getNwlibVersion();
$ruta_carpeta = "/$nwlib_ver/modulos/";
if ($_SERVER["HTTP_HOST"] == "nwadmin3.loc") {
    echo "<html xmlns='<?php echo $protocolo; ?>://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>";
} else {
    echo "<html xmlns='$protocolo://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>";
//    echo "<html xmlns='$protocolo://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES' manifest='" . $ruta_carpeta . "nw_tareas/cach.manifest' type='text/cache-manifest'>";
}
?>
<head>
    <meta "<?php echo $protocolo; ?>-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
    <meta name="apple-touch-fullscreen" content="YES" />
    <meta name="apple-mobile-web-app-capable" content="yes" />

    <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/style.css" />
    <script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/includes/jquery/jquery-1.4.2.min.js" ></script>

    <link type="text/css" href="/<?php echo $nwlib_ver; ?>/includes/jquery/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
    <script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/includes/jquery/dialogextend/jquery.dialogextend.min.js" ></script>

    <!--<script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/includes/jquery/jquery.min.js" ></script>-->

    <script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/includes/jquery/jquery.validate.1.5.2.js" ></script>
    <script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/includes/jquery/jquery-ui-1.8.1.custom.min.js"></script> 
    <?php
    if (isset($_GET["home"]) && $_GET["home"] != "homeList") {
        $ser = "$protocolo://" . $_SERVER["HTTP_HOST"];
        if (preg_match('/android|avantgo|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i', $useragent) || preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i', substr($useragent, 0, 4))) {
            header("location:$ser/tareas");
        } else {
            if (!isset($_GET["task"])) {
                header("location:$ser/inbox");
            }
        }
    }
    $id_global_user = $_SESSION["id"];
    ?>
    <script type="text/javascript" src="<?php echo $ruta_carpeta; ?>/nw_tareas/js/srv.js" ></script>
    <script type="text/javascript" src="<?php echo $ruta_carpeta; ?>/nw_tareas/js/storage.js" ></script>
    <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/lists_1.css" />
    <?php
    $classDayCalendar = "fsad";
    if ($classDayCalendar != "") {
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/styleTwo.css" />
        <?php
    }
    $usarGeo = "NO";
    if ($usarGeo == "SI") {
        if ($_SERVER["HTTP_HOST"] != "nwadmin3.loc" && $_SERVER["HTTP_HOST"] != "nwadmin.gruponw.com") {
            ?>
            <div class="blog-test" id="geolocation-test">
                <p>
                    El script aún no se ha ejecutado.
                </p>
            </div>
            <script type="text/javascript" src="<?php echo $protocolo; ?>://maps.google.com/maps/api/js?sensor=false"></script>
            <script type="text/javascript">
                /*<![CDATA[*/
                (function() {
                    var content = document.getElementById("geolocation-test");
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(objPosition) {
                            var lon = objPosition.coords.longitude;
                            var lat = objPosition.coords.latitude;
                            var dir = "";
                            var latlng = new google.maps.LatLng(lat, lon);
                            geocoder = new google.maps.Geocoder();
                            geocoder.geocode({"latLng": latlng}, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    if (results[0]) {
                                        dir = "<p><strong>Dirección: </strong>" + results[0].formatted_address + "</p>";
                                    } else {
                                        dir = "<p>No se ha podido obtener ninguna dirección en esas coordenadas.</p>";
                                    }
                                } else {
                                    dir = "<p>El Servicio de Codificación Geográfica ha fallado con el siguiente error: " + status + ".</p>";
                                }
                                content.innerHTML = "<p><strong>Latitud:</strong> " + lat + "</p><p><strong>Longitud:</strong> " + lon + "</p>" + dir;
                                ubication(lat, lon, dir);
                            });
                        }, function(objPositionError) {
                            switch (objPositionError.code) {
                                case objPositionError.PERMISSION_DENIED:
                                    content.innerHTML = "No se ha permitido el acceso a la posición del usuario.";
                                    break;
                                case objPositionError.POSITION_UNAVAILABLE:
                                    content.innerHTML = "No se ha podido acceder a la información de su posición.";
                                    break;
                                case objPositionError.TIMEOUT:
                                    content.innerHTML = "El servicio ha tardado demasiado tiempo en responder.";
                                    break;
                                default:
                                    content.innerHTML = "Error desconocido.";
                            }
                        }, {maximumAge: 75000, timeout: 15000});
                    } else {
                        content.innerHTML = "Su navegador no soporta la API de geolocalización.";
                    }
                })();/*]]>*/
            </script>
            <?php
        }
    }
    ?>
    <script type="text/javascript">
        function testNotifications() {
            //nos devuelve true si podemos usar notificaciones
            if (window.webkitNotifications || Notification)
                return true;
            return false;
        }

        function checkPermission() {
            if (window.webkitNotifications && window.webkitNotifications.checkPermission() == 0) {
                $(document).ready(function() {
                    var el = document.getElementById('request');
                    el.parentNode.removeChild(el);
                });
                return true;
            } else
            if (Notification && Notification.permission == 'granted') {
                $(document).ready(function() {
                    var el = document.getElementById('request');
                    el.parentNode.removeChild(el);
                });
                return true;
            }
        }

        function requestPermission() {
            //pedimos permiso para mostrar notificaciones
            if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {//Chrome
                window.webkitNotifications.requestPermission();
            } else if (Notification && Notification.permission != 'granted') {//Firefox
                Notification.requestPermission();
            }
        }
        checkPermission();

        onpopstate = function(event) {
            $('.ui-dialog').fadeOut(100);
            $('.ui-widget-overlay').fadeOut(100);
        }
        var hash = "" + window.location.hash + "";
        hash = hash.replace("#", "");
        //    document.write(hash);
        //                $(window).load(function() {
        setTimeout(function() {
            $(window).scroll(function() {
                OnScrollDiv();
            });
        }, 5000);
        //                });
        function OnScrollDiv() {
            //detectar scroll hacia abajo
            var obj = $(document);          //objeto sobre el que quiero detectar scroll
            var obj_top = obj.scrollTop()   //scroll vertical inicial del objeto
            obj.scroll(function() {
                var obj_act_top = $(this).scrollTop();  //obtener scroll top instantaneo
                if (obj_act_top > obj_top) {
                    //scroll hacia abajo
                    $('.div_buttons_menu_enc').fadeOut(0);
                } else {
                    //scroll hacia arriba
                    $('.div_buttons_menu_enc').fadeIn(0);
                }
                obj_top = obj_act_top;//almacenar scroll top anterior
            });
        }

        function loadimg() {
            setTimeout(function() {
                var ahora = $("#body_max").html();
//                var ahora = $("body").html();
                if (ahora == null) {
                    return;
                }
                localStorage["ahora"] = ahora;
                var all_dat = "\
    <link rel='stylesheet' type='text/css' href='/<?php echo $nwlib_ver; ?>/modulos/nw_tareas/css/lists_1.css' />\n\
    <link rel='stylesheet' type='text/css' href='/<?php echo $nwlib_ver; ?>/modulos/nw_tareas/css/style.css' />" + ahora;
                localStorage["descarga"] = all_dat;
            }, 10000);
        }
        function errorloadimg() {
            alert("No Hay conexión a internet, lo sentimos. Puede acceder a los últimos registros descargados.");
            window.location = "/<?php echo $nwlib_ver; ?>/modulos/nw_tareas/offline_task.html";
            return;
        }

        var appCache = window.applicationCache;
        appCache.update(); // intentara actualizar el cache
//definimos un manejador de eventos para
// capturar cuando este listo para cambiar
        window.applicationCache.addEventListener('updateready', function(e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                window.applicationCache.swapCache();
                window.location.reload();
            } else {
                // manifest no ha cambiado
            }
        }, false);
        $(document).ready(function() {
            loadInternetSiNo();
        });
        function loadInternetSiNo() {
            //        $("#hayInternet").load('/<?php echo $nwlib_ver; ?>/modulos/nw_tareas/loadInternet.php');
            if (!$("#hayInternet").load('/<?php echo $nwlib_ver; ?>/modulos/nw_tareas/loadInternet.php')) {
                alert("no se pudo cargar loadInternet");
            }
            setTimeout(function() {
                var htmlInternet = $("#hayInternet").text();
                if (htmlInternet == "") {
                    window.location = "/<?php echo $nwlib_ver; ?>/modulos/nw_tareas/offline_task.html";
                }
            }, 4000);
        }

    </script> 
    <div id="hayInternet" style="display: none;"></div>
</head>
<?php
if ($_SERVER["HTTP_HOST"] == "nwadmin3.loc") {
    ?>
    <script>
        loadimg();
    </script>
    <?php
} else {
    ?>
    <script>
        setTimeout(function() {
            $("#html").html("<img id='imgLoadIe' src='<?php echo $protocolo; ?>://profile.ak.fbcdn.net/hprofile-ak-prn1/t1.0-1/c20.7.90.90/s50x50/397562_10151421161186122_6125907_s.jpg' onload='loadimg();' onerror='errorloadimg()' style='display: none;' />");
        }, 20000);
    </script>
    <?php
}
?>
<body>
    <div onclick="javascript:requestPermission()" class="request" id="request">
        ¿Deseas recibir notificaciones de scritorio para nuevas tareas? Clic aquí
    </div>
    <?php
    if (isset($_GET["task"])) {
        if ($_GET["task"] != "") {
            ?>
            <script>
            $(document).ready(function() {
                seetareaDialog(<?php echo $_GET["task"] ?>, <?php echo $_GET["a"] ?>, '<?php echo $_GET["b"] ?>', '<?php echo $_GET["c"] ?>', <?php echo $_GET["d"] ?>, <?php echo $_GET["div"] ?>);
            });
            </script>
            <?php
        }
    }
    ?>
    <div id="body_max">
        <div id="enc_main_user_dats"></div>
        <div id="walk"></div>

        <div id="notifications"></div>
        <div id="box_notifications_load"></div>
        <div id="main_main"><div id="main"></div></div>
        <div class="show_contend_popup" id="show_contend_popup"></div>
        <div class="show_contend_popup_task" id="show_contend_popup_task"></div>
        <div id="update_for"></div>
        <div id="loading"><div>Cargando</div></div>
    </div>
    <script type="text/javascript">
        $(window).load(function() {
//        loadEncUser();
<?php
if (!isset($_GET["walk"])) {
    ?>
                loadFilters();
    <?php
}
?>
        });
    </script>
    <?php
    if ($_GET["viewLists"] == "bV") {
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/lists.css" />
        <script type="text/javascript">
            function ShowMob() {
                $('#see').fadeIn(0);
                $('.list_tarea').fadeOut(0);
            }
            function RemoveDialog() {
                $('.ui-dialog').fadeOut(0);
                $('.ui-widget-overlay').fadeOut(0);
            }
            $(window).load(function() {
                loadMain();
                return;
            });
        </script>
        <?php
    } else
    if ($_GET["proyects"] == "bP") {
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/lists.css" />
        <div id="proyects"></div>
        <script type="text/javascript">
            $(window).load(function() {
                loadMainProyects();
                return;
            });
        </script>
        <?php
    } else
    if (isset($_GET["walk"]) != "") {
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/walk.css" />
        <?php
        if (isset($_GET["embedQXNW"]) == "true") {
            ?>
            <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/walkEmbed.css" />
            <?php
        }
        ?>
        <script type="text/javascript">
            $(window).load(function() {
    <?php
    $post = 0;
    if (isset($_GET["post"])) {
        if ($_GET["post"] == "") {
            $post = 0;
        } else {
            $post = $_GET["post"];
        }
    }
    $profile = 0;
    if (isset($_GET["profile"])) {
        if ($_GET["profile"] == "") {
            $profile = 0;
        } else {
            $profile = $_GET["profile"];
        }
    }
    ?>
                loadWalk(<?php echo $post; ?>, '<?php echo $profile; ?>');
                return;
            });
        </script>
        <?php
    } else
    if ($_GET["home"] != "") {
        ?>
        <script type="text/javascript">
            $(window).load(function() {
                $("#menu_home").addClass("active_link");
                loadMain();
    <?php
    if ($_GET["lists"] != "" || $_GET["Stask"] != "") {
        ?>
                    $("#body_max").append("<div id='formListTaskHome'></div>");
                    $("#calendar_nw").fadeOut();
                    setParamRecordListTwo(<?php echo $_SESSION["id"]; ?>);
        <?php
    } else {
        ?>
                    $("#body_max").append("<div id='calendar_nw'></div>");
                    loadCalendar(1, 0, 0, 0, 0);
        <?php
    }
    ?>
    //                notifications();
            });
        </script>
        <?php
    }
    ?>
    <div id="bg"></div>
</body>
</html>