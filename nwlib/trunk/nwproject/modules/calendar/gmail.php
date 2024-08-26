<?php
/* * ******************************************************************
 * Función getGCalendar                   *
 * Genera url para la creación de un evento en google calendar.      *
 * ******************************************************************* */

function getGCalendarUrl($event) {
    $titulo = urlencode($event['titulo']);
    $descripcion = urlencode($event['descripcion']);
    $localizacion = urlencode($event['localizacion']);
    $start = new DateTime($event['fecha_inicio'] . ' ' . $event['hora_inicio'] . ' ' . date_default_timezone_get());
    $end = new DateTime($event['fecha_fin'] . ' ' . $event['hora_fin'] . ' ' . date_default_timezone_get());
    $dates = urlencode($start->format("Ymd\THis")) . "/" . urlencode($end->format("Ymd\THis"));
    $name = urlencode($event['nombre']);
    $url = urlencode($event['url']);
    $gCalUrl = "http://www.google.com/calendar/event?action=TEMPLATE&amp;text=$titulo&amp;dates=$dates&amp;details=$descripcion&amp;location=$localizacion&amp;trp=false&amp;sprop=$url&amp;sprop=name:$name";
    return ($gCalUrl);
}

if (!isset($_GET["titulo"]) ||
        !isset($_GET["fecha_inicio"]) ||
        !isset($_GET["fecha_fin"])
) {
    echo "Falta parámetros, confirme: titulo, descripcion, fecha_inicio,hora_inicio,fecha_fin,hora_fin";
    return false;
}

$titulo = $_GET["titulo"];
$descripcion = "";
if (isset($_GET["descripcion"])) {
    $descripcion = $_GET["descripcion"];
}
$nombre_sitio = "";
if (isset($_GET["nombre_sitio"])) {
    $nombre_sitio = $_GET["nombre_sitio"];
}
$direccion = "";
if (isset($_GET["direccion"])) {
    $direccion = $_GET["direccion"];
}
$url = "";
if (isset($_GET["url"])) {
    $url = $_GET["url"];
}
$fecha_inicio = explode(" ", $_GET["fecha_inicio"])[0];
$hora_inicio = explode(" ", $_GET["fecha_inicio"])[1];
$fecha_fin = explode(" ", $_GET["fecha_fin"])[0];
$hora_fin = explode(" ", $_GET["fecha_fin"])[1];

echo "<br />Fecha inicio: " . $fecha_inicio;
echo "<br />Inicio hora: " . $hora_inicio;
echo "<br />Fecha fin: " . $fecha_fin;
echo "<br />Hora fin: " . $hora_fin;
//return;

// array asociativo con los parametros necesarios.
$evento = array(
    'titulo' => $titulo,
    'descripcion' => $descripcion,
    'localizacion' => $direccion,
    'fecha_inicio' => $fecha_inicio, // Fecha de inicio de evento en formato AAAA-MM-DD
    'hora_inicio' => $hora_inicio, // Hora Inicio del evento
    'fecha_fin' => $fecha_fin, // Fecha de fin de evento en formato AAAA-MM-DD
    'hora_fin' => $hora_fin, // Hora final del evento
    'nombre' => $nombre_sitio, // Nombre del sitio
    'url' => $url // Url de la página
);

//$evento = array(
//    'titulo' => 'Mi evento de prueba ok',
//    'descripcion' => 'Descripcion del evento de prueba',
//    'localizacion' => 'Aqui ponemos la dirección donde se celebra el evento',
//    'fecha_inicio' => '2014-04-11', // Fecha de inicio de evento en formato AAAA-MM-DD
//    'hora_inicio' => '17:30', // Hora Inicio del evento
//    'fecha_fin' => '2014-04-12', // Fecha de fin de evento en formato AAAA-MM-DD
//    'hora_fin' => '19:00', // Hora final del evento
//    'nombre' => 'ReviBlog', // Nombre del sitio
//    'url' => 'www.reviblog.net' // Url de la página
//);

$link = getGCalendarUrl($evento);
//header('Location: ' . $link . '');
//exit;
//http://nwchat.loc/nwlib6/nwproject/modules/calendar/gmail.php?titulo=prueba&descripcion=descripcion&fecha_inicio=2021-12-10&hora_inicio=15:00&fecha_fin=2021-12-10&hora_fin=15:30
?>
Redirecting to <a class="btn" href="<?php echo $link; ?>" target='_SELF'><?php echo $link; ?><img src="http://www.google.com/calendar/images/ext/gc_button6_es.gif" border="0"></a>
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelector(".btn").click();
    });
</script>