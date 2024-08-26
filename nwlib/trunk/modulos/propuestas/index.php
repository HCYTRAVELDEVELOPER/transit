<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
require_once dirname(__FILE__) . '/moneda_texto.php';
$pdf_impr = "";
if (isset($_GET["pdf"])) {
    $pdf_impr = $_GET["pdf"];
    if (($pdf_impr == "pdf")) {
        ob_start();
    }
}
if (!isset($_GET["id"]) || $_GET["id"] == "") {
    return;
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
//$protocolo = $https;
$domain = $_SERVER['HTTP_HOST'];
$domain_http = "$protocolo://" . $_SERVER['HTTP_HOST'];
$ruta_dosc = "/nwlib" . master::getNwlibVersion() . "/modulos/";
$ruta_absoluta = "$protocolo://" . $domain . $ruta_dosc;

global $id_get;
global $key;

$id_get = $_GET["id"];
if (!isset($_GET["key"])) {
    ?>
    <h2>Solicite una nueva cotizaci&oacute;n para esta propuesta</h2>
    <br /><a href='https://www.gruponw.com/contacto'>Cont&aacute;ctenos.</a>
    <?php
    return;
} else {
    if ($_GET["key"] == "") {
        ?><h2>Solicite una nueva cotizaci&oacute;n para esta propuesta</h2>
        <br /><a href='https://www.gruponw.com/contacto'>Cont&aacute;ctenos.</a>
        <?php
        return;
    } else {
        $key = $_GET["key"];
    }
}

$visitor = "";
if (isset($_GET["visitor"])) {
    $visitor = $_GET["visitor"];
}
global $ip;
if (!empty($_SERVER['HTTP_CLIENT_IP'])) { //Verificar la ip compartida de internet
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) { //verificar si la ip fue provista por un proxy
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}


$id_propuesta = strip_tags(!isset($_GET["id"]) ? "" : $_GET["id"]);
$p_key = strip_tags(!isset($_GET["key"]) ? "" : $_GET["key"]);

if (!$id_propuesta) {
    echo "Debe tener un ID para ver una propuesta";
    return;
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("propuestas", "*,func_concepto(moneda,'tipo_moneda') as nom_moneda", "id=:id and key=:key");
$ca->bindValue(":id", $id_propuesta, true, true);
$ca->bindValue(":key", $_GET["key"], true, true);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "Verifique por favor, no existe propuesta referente al codigo " . $id_propuesta;
    return;
}
$ca->next();
$r = $ca->assoc();

if ($r["cliente_prospecto"] == "") {
    echo "Esta propuesta no tiene cliente prospecto.";
    return;
}

global $id_propuesta;
global $estado_propuesta;
global $caducidad;
//$id_propuesta = $r["id"];
$estado_propuesta = $r["estado"];
$caducidad = $r["caducidad"];

$ca->clear();
if (isset($r["producto"]) && $r["producto"] != "") {
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("productos", "*", "id=:producto");
    $ca->bindValue(":producto", $r["producto"]);
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
        return;
    }
    $manejaPlanes = "";
    if ($ca->size() == 0) {
        $manejaPlanes = "SI";
//    echo "Se encontró un problema con la información de la propuesta"  . $ca->lastErrorText();
//    return;
    } else {
        $ca->next();
        $plan = $ca->assoc();
    }
}


$ca->clear();
$ca = new NWDbQuery($db);
$ca->prepareSelect("propuestas a join usuarios b on (a.usuario=b.usuario)", "a.id, a.usuario,b.firma, b.usuario as nom_usuario, b.nombre, b.email, b.celular, b.cargo,b.apellido", " a.id =:id");
$ca->bindValue(":id", $id_propuesta);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "Se encontró un problema con la  de la propuesta no hay cliente prospecto" . $ca->lastErrorText();
    return;
}
$ca->next();
$user = $ca->assoc();

$ca->clear();
$ca = new NWDbQuery($db);
$ca->prepareSelect("clientes_prospecto", "*,func_concepto(pais, 'paises') as country_text", "id=:cliente_prospecto");
$ca->bindValue(":cliente_prospecto", $r["cliente_prospecto"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "Se encontró un problema con la  de la propuesta no hay cliente prospecto" . $ca->lastErrorText();
    return;
}
$ca->next();
$prd = $ca->assoc();

global $id_cliente;
$id_cliente = $prd["id"];
//echo "<br />cliente<br />";
//print_r($prd);

$ca->clear();
$ca = new NWDbQuery($db);
$ca->prepareSelect("empresas", "*, func_concepto(ciudad, 'ciudades') as city_text", "id=:empresa");
$ca->bindValue(":empresa", $r["empresa"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "Se encontró un problema con la información de la propuesta No hay empresa" . $ca->lastErrorText();
    return;
}
$ca->next();
$emp = $ca->assoc();

global $logotipo;
$logotipo = $emp["logo"];
$ca->clear();
$desc = "";
if ($r["descuento"] != "") {
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("descuentos", "*", "id=:descuento");
    $ca->bindValue(":descuento", $r["descuento"]);
    if (!$ca->exec()) {
        echo $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        $desc = "";
    } else {
        $ca->next();
        $desc = $ca->assoc();
    }
}
$ca->clear();
$ca = new NWDbQuery($db);
$ca->prepareSelect("formas_pago", "*", "id=:forma_pago");
$ca->bindValue(":forma_pago", $r["forma_pago"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "Se encontró un problema con la información de la propuesta no hay forma de pago" . $ca->lastErrorText();
    return;
}
$ca->next();
$formpag = $ca->assoc();

$ca->clear();
$ca = new NWDbQuery($db);
$ca->prepareSelect("tiempos_entrega", "*", "id=:tiempo_entrega");
$ca->bindValue(":tiempo_entrega", $r["tiempo_entrega"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
    echo "Se encontró un problema con la información de la propuesta no hay tiempo de entrega" . $ca->lastErrorText();
    return;
}
$ca->next();
$timentreg = $ca->assoc();

$sdate = date("d") . "/" . date("m") . "/" . date("Y");

$dia = array("domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado");
$mes = array("enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre");
$numdia = date("w"); //muestra el día de la semana
$nummes = date("n");
$diames = date("j"); //muestra el día del mes

global $hoy;
global $hoyletra;
global $hoymes;
global $anho;
$hoy = $dia[$numdia];
$anho = date("Y");
$hoyletra = $diames;
$hoymes = $mes[$nummes - 1];

$fecha = $r["fecha"];
$fecha_m = explode("-", $fecha);
$dia_m = $fecha_m[2];
$mes_m = $fecha_m[1];
$anio_m = $fecha_m[0];
global $fecha_final;
$fecha_final = $dia_m . '-' . $mes_m . '-' . $anio_m;

function encabezado_principal() {
    global $pdf_impr;
    if (($pdf_impr == "pdf")) {
        return;
    }
    global $logotipo;
    global $fecha_final;
    global $id_get;
    global $domain_http;
    ?>
    <div class="footPage">
        <p>
            <a href="https://www.gruponw.com" style="color: #FFFFFF;" target="_blank">  Gruponw.com </a> <span class="num_prop_fecha">Propuesta No <?php echo $id_get; ?> | <?php echo $fecha_final; ?></span>
        </p>
    </div>
    <?php
    echo '<div class="cabezote cabezote_main">
                <img src="' . $domain_http . "/" . $logotipo . '" class="img_logo_principal" />
                <p>
                    ' . $fecha_final . '
                </p>
                <p>
                <strong>Propuesta No. ' . $id_get . '</strong>
                    </p>
            </div>';
}

function encabezado() {
    global $pdf_impr;
    if (($pdf_impr == "pdf")) {
        return;
    }
    global $logotipo;
    global $fecha_final;
    global $id_get;
    global $domain_http;
    ?>
    <div class="footPage">
        <p>
            <a href="https://www.gruponw.com" style="color: #FFFFFF;" target="_blank">  Gruponw.com </a>
        </p>
    </div>
    <?php
    echo '<div class="cabezote cabezote_all">
                <img src="' . $domain_http . "/" . $logotipo . '" class="img_logo" />
                <p>
                    ' . $fecha_final . '  
                </p>
                <p>
                <strong>Propuesta No. ' . $id_get . '</strong>
                    </p>
            </div>';
}

function encabezado_pdf() {
    global $logotipo;
    global $fecha_final;
    global $id_get;
    global $domain_http;
    echo '
                <img src="' . $domain_http . "/" . $logotipo . '" width="80" />
                <p>
                    ' . $fecha_final . '  
                </p>
                <strong>Propuesta No. ' . $id_get . '</strong>
            ';
}

function otras_hojas() {
    global $id_propuesta;
    $dbdb = NWDatabase::database();
    $cb = new NWDbQuery($dbdb);
    $wheree .= " where id_propuesta=:id_propuesta";
    $sqla = "select * FROM propuestas_hojas " . $wheree . " order by id asc";
    $cb->prepare($sqla);
    $cb->bindValue(":id_propuesta", $id_propuesta);
    if (!$cb->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($cb->size() == 0) {
        echo "No se han encontrado datos";
    }
    for ($ii = 0; $ii < $cb->size(); $ii++) {
        $cb->next();
        $rr = $cb->assoc();
        echo "<div class='bloques_textos'>";
        echo "<h1>Módulos</h1>";
        echo $rr["texto"];
        echo "</div>";
    }
}

function detect_city($ip) {

    $default = 'UNKNOWN';

    if (!is_string($ip) || strlen($ip) < 1 || $ip == '127.0.0.1' || $ip == 'localhost')
        $ip = '8.8.8.8';

    $curlopt_useragent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2) Gecko/20100115 Firefox/3.6 (.NET CLR 3.5.30729)';

    $url = 'http://ipinfodb.com/ip_locator.php?ip=' . urlencode($ip);
    $ch = curl_init();

    $curl_opt = array(
        CURLOPT_FOLLOWLOCATION => 1,
        CURLOPT_HEADER => 0,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_USERAGENT => $curlopt_useragent,
        CURLOPT_URL => $url,
        CURLOPT_TIMEOUT => 1,
        CURLOPT_REFERER => 'http://' . $_SERVER['HTTP_HOST'],
    );

    curl_setopt_array($ch, $curl_opt);

    $content = curl_exec($ch);
    $curl_info = "";
    $city = "";

    if (!is_null($curl_info)) {
        $curl_info = curl_getinfo($ch);
    }

    curl_close($ch);

    if (preg_match('{<li>City : ([^<]*)</li>}i', $content, $regs)) {
        $city = $regs[1];
    }
    if (preg_match('{<li>State/Province : ([^<]*)</li>}i', $content, $regs)) {
        $state = $regs[1];
    }

    if ($city != '' && $state != '') {
        $location = $city . ', ' . $state;
        return $location;
    } else {
        return $default;
    }
}

function ingresa_movimiento($p) {
    global $id_get;
    global $id_cliente;
    global $ip;
    $ipdetect = detect_city($ip);
    $db = NWDatabase::database();
    $cc = new NWDbQuery($db);
    $sqlMov = "INSERT INTO propuestas_movs (fecha, id_propuesta, accion, ip, cliente, ciudad) 
                                        values (:fecha, :id_propuesta, :accion, :ip, :cliente ,:ciudad)";
    $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
    $cc->bindValue(":id_propuesta", $id_get);
    $cc->bindValue(":accion", $p);
    $cc->bindValue(":ip", $ip, true);
    $cc->bindValue(":cliente", $id_cliente);
    $cc->bindValue(":ciudad", $ipdetect);
    $cc->prepare($sqlMov);
    if (!$cc->exec()) {
        echo $cc->lastErrorText();
        return;
    }
}

function update_prop($p) {
    global $id_get;
    global $id_cliente;
    global $ip;
    $ipdetect = detect_city($ip);
    $db = NWDatabase::database();
    $cc = new NWDbQuery($db);
    $sqlMov = "INSERT INTO propuestas_movs (fecha, id_propuesta, accion, ip, cliente, ciudad) 
                                        values (:fecha, :id_propuesta, :accion, :ip, :cliente ,:ciudad)";
    $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
    $cc->bindValue(":id_propuesta", $id_get);
    $cc->bindValue(":accion", $p);
    $cc->bindValue(":ip", $ip, true);
    $cc->bindValue(":cliente", $id_cliente);
    $cc->bindValue(":ciudad", $ipdetect);
    $cc->prepare($sqlMov);
    if (!$cc->exec()) {
        echo $cc->lastErrorText();
        return;
    }
}

$onlyPage = false;
if (isset($r["only_page"])) {
    if ($r["only_page"] === "SI" || $r["only_page"] === true || $r["only_page"] === "t") {
        $onlyPage = true;
    }
}
if (isset($_GET["viewAll"])) {
    if ($_GET["viewAll"] === "true") {
        $onlyPage = false;
    }
}
if ($onlyPage === true) {
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/propuestas/index_only_page.php";
    return;
}
if ($manejaPlanes == "SI") {
//if (isset($r["plan"])) {
//    if ($r["plan"] != null || $r["plan"] != "") {
    global $id_propuesta;
    $id_propuesta = $_GET["id"];
    include $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/propuestas/index_planes.php";
    return false;
//    }
//}
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "<?php echo $protocolo; ?>://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="<?php echo $protocolo; ?>://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Propuesta N° <?php echo $_GET["id"] ?> <?php echo $prd["nombre"]; ?>  <?php echo $fecha_final ?></title>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>/propuestas/css/css_before_print.css" />
<!--        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>/propuestas/css/css_2015.css" />-->
<?php
if (($pdf_impr == "pdf")) {
    ?>
            <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>/propuestas/css/estilos_new.css" />
            <?php
        }
        ?>
        <link rel='shortcut icon' href='https://www.gruponw.com/imagenes/favicon.ico'></link>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_absoluta ?>propuestas/css/estilos_new.css" media="print" ></link>
        <style>
            body {
                /*font-family: 'Titillium Web', sans-serif!important;*/
            }
        </style>
        <style type="text/css" media="print">
            @page{
                margin-bottom: 0;
                margin-top: 0;
                margin-left: 0;
                margin-right: 0;

            }
            #contenedor1 {
                margin: 0!important;
                border: 0!important;
                page-break-after:always;
            }
            .buttonOpenNwChat, .buttonOpenNwChatRingow, .containconversnwrtc {
                display: none!important;
            }
        </style>

        <script type="text/javascript" src="/nwlib<?php echo master::getNwlibVersion(); ?>/includes/jquery/jquery-1.4.2.min.js" ></script>
        <script>
            OnScrollDiv();
            $(window).scroll(function () {
                OnScrollDiv();
            });

            function OnScrollDiv() {
                var scrollTop = $(document).scrollTop();
                if (scrollTop < 1700) {
                    $("#menuIndiceTop").fadeOut(500);
                } else
                if (scrollTop > 1700) {
                    $("#menuIndiceTop").fadeIn(500);
                }
            }
            function indice(p, id) {
                $("#loadIndice").load('/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/propuestas/indice.php', {
                    id: id,
                    prop: p,
                    tipo: "normal"
                });
                $("#menuIndiceTop").load('/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/propuestas/indice.php', {
                    prop: p,
                    id: id,
                    tipo: "fixed"
                });
            }
            function scroll(p) {
                var top = $(p).offset().top - 100;
                $('html, body').animate({
                    scrollTop: top
                }, 2000);
            }
        </script>
<?php
if (isset($_GET["visitor"])) {
    if ($_GET["visitor"] == "nw") {
        ?>

                <style>
                    #menuIndiceTop {
                        top: 0;
                    }
                </style>
        <?php
    }
}
?>



    </head>
    <body>
<?php
if (($pdf_impr == "pdf")) {
    ?>
            <div style="position: fixed; top: -52px; left: -40px;">
            <?php
            encabezado_pdf();
            ?>
            </div>
                <?php
            }
            ?>

        <?php
        if (($pdf_impr != "pdf")) {
            if ($visitor != "nw") {
                ingresa_movimiento("Lectura");
                ?>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        <!--<script type="text/javascript" src="<?php echo $protocolo; ?>://maps.google.com/maps/api/js?sensor=true"></script>-->
                <script type="text/javascript">
                    document.onkeydown = function (e) {
                        if (e.ctrlKey) {
                            return false;
                        } else {
                            return true;
                        }
                    };
                    $(document).ready(function () {
                        document.onselectstart = new Function("return false");
                        if (window.sidebar) {
                            document.onmousedown = disableselect();
                            document.onclick = reEnable();
                        }
                        document.oncontextmenu = function () {
                            return false;
                        };
                    });
                    function Disable_Control_C() {
                        var keystroke = String.fromCharCode(event.keyCode).toLowerCase();
                        if (event.ctrlKey && (keystroke == 'c' || keystroke == 'v')) {
                            alert("let's see");
                            event.returnValue = false; // disable Ctrl+C
                        }
                    }

                    function imprime(data, id) {
                        update(data, id);
                        window.print();
                    }
                    function descarga_pdf(data, id) {
                        update(data, id);
                    }
                    function aprobar(data, id) {
                        update(data, id);
                        setInterval("window.location.reload()", 1000);
                    }
                    function update(data, id) {
                        var url_data = "/nwlib<?php echo master::getNwlibVersion(); ?>/modulos/propuestas/srv/update.php";
                        $.ajax({
                            type: "POST",
                            url: url_data,
                            data: {
                                id: id,
                                data: data
                            },
                            error: function () {
                                alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                            },
                            success: function (data) {
                                console.log(data);
                                if (data == "") {

                                } else {
                                    alert(data);
                                }
                                location.reload();
                            }
                        });
                        return false;
                    }
                    var map;
                    var latitud;
                    var longitud;
                    var precision;

                    //        $(document).ready(function() {
                    //                    localizame();
                    //                Disable_Control_C();
                    //        });

                    function localizame() {
                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(coordenadas, errores);
                        } else {
                            alert('Oops! Tu navegador no soporta geolocalización. Bájate Chrome, que es gratis!');
                        }
                    }

                    function coordenadas(position) {
                        latitud = position.coords.latitude;
                        longitud = position.coords.longitude;
                        precision = position.coords.accuracy;
                        cargarMapa();
                        //  alert("Datos con una precisión de " + precision/1000 + " km, " + precision + " metros");
                    }

                    function errores(err) {
                        if (err.code == 0) {
                            alert("Oops! Algo ha salido mal");
                        }
                        if (err.code == 1) {
                        }
                        if (err.code == 2) {
                            alert("Oops! No se puede obtener la posición actual");
                        }
                        if (err.code == 3) {
                            alert("Oops! Hemos superado el tiempo de espera");
                        }
                    }

                    function cargarMapa() {
                        var latlon = new google.maps.LatLng(latitud, longitud);
                        var myOptions = {
                            zoom: 17,
                            center: latlon,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        map = new google.maps.Map($("#map_canvas").get(0), myOptions);

                        var coorMarcador = new google.maps.LatLng(latitud, longitud);

                        var marcador = new google.maps.Marker({
                            position: coorMarcador,
                            map: map,
                            title: "Dónde estoy?"
                        });
                    }
                </script>
                <div id="enc_nw">
                    <div id="enc_nw_into">
                        <div class="caducidad">
        <?php
        if ($p_key == "" || $p_key == null) {
            echo "Lo sentimos, verifique el link de nuevo por favor.";
            echo "<br /><a href='https://www.gruponw.com/contacto'>Volver.</a>";
            return;
        }
        echo "Esta propuesta caduca el " . $caducidad;
        if ($caducidad <= date("Y-m-d")) {
            echo " Lo sentimos, la propuesta ha caducado.";
            echo "<br /><a href='https://www.gruponw.com/contacto'> Para solicitar de nuevo una propuesta o solicitar información haga clic aquí"
            . " o comuníquese a los teléfonos en Bogotá PBX (57)(1) 7022562, celular: 322 348 5784,  PBX: 018000180350 línea nacional gratuita.</a>";
            return;
        }
        ?>
                        </div>
                            <?php
                            if ($estado_propuesta == 20) {
                                ?>
                            <a href="#" style="background: green;">propuesta Aprobada</a>
                            <?php
                        } else {
                            ?>
                            <a href="#" onclick="aprobar('Aprobar', <?php echo $id_get ?>);" >Aprobar</a>
                            <?php
                        }
                        ?>
                        <!--<a href="#" >Comentar</a>-->
                        <a href="#" onclick="imprime('Descarga', <?php echo $id_get ?>);">Imprimir</a>
                        <!--<a href="/propuestas/<?php echo $id_get ?>&pdf=pdf" onclick="descarga_pdf('Descarga', <?php echo $id_get ?>);">Descargar en PDF</a>-->

                        <meta name="google-translate-customization" content="caf4cab95252f73e-ef01b710b2a48f02-g4fd482e9c745f22e-13"></meta>
                        <div id="google_translate_element"></div><script type="text/javascript">
                            function googleTranslateElementInit() {
                                new google.translate.TranslateElement({pageLanguage: 'es', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
                            }
                        </script><script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>

                        <p class="text_publicit">
                            <a href="https://www.gruponw.com/contacto" target="_blank"> 
                                Propuesta creada y enviada con el sistema automático de propuestas NW. Desea uno igual? solicítelo aquí.
                            </a>
                        </p>
                    </div>
                    <div id="box_notifications_load"></div>
                </div>
                <div id='map_canvas' style='width:100%; height:50px;display: none;'></div>
                <div id="respuesta"></div>
        <?php
    }
}
?> 
        <div id="contenedor">
        <?php
        $propuesta = $plan["propuesta"];
        if ($propuesta != "") {
            if ($propuesta != "0") {
                if ($_SERVER['HTTP_HOST'] != "app_sitca.loc" && $_SERVER['HTTP_HOST'] != "app.sitca.co" && $_SERVER['HTTP_HOST'] != "sistema.humadea.com" && $_SERVER['HTTP_HOST'] != "sistema.thunder.com") {
                    require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/propuestas/" . $propuesta . ".php";
                } else {
                    require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/propuestas/propuesta_blanco.php";
                }
            } else {
                require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/propuestas/propuesta_blanco.php";
            }
        } else {
            require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/modulos/propuestas/propuesta_blanco.php";
        }
        ?>

            <p>
                <br />
                <br />
            </p>
        </div>
    </body>
</html>
<?php
//if (isset($pdf_impr)) {
if ($pdf_impr == "pdf") {
    require_once("js/dompdf/dompdf_config.inc.php");
    $dompdf = new DOMPDF();
    $dompdf->load_html(ob_get_clean());
    $dompdf->render();

//$dompdf->stream("resultado.pdf");
//return;
    $dompdf->render();
    $filename = "ejemplo" . time() . '.pdf';
    $dompdf->stream($filename);
    $pdf = $dompdf->output();
    file_put_contents($filename, $pdf);
}