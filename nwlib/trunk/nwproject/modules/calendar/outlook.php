<?php
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
$direccion = "";
if (isset($_GET["direccion"])) {
    $direccion = $_GET["direccion"];
}
$fecha_inicio = explode(" ", $_GET["fecha_inicio"])[0];
$hora_inicio = explode(" ", $_GET["fecha_inicio"])[1];
$fecha_fin = explode(" ", $_GET["fecha_fin"])[0];
$hora_fin = explode(" ", $_GET["fecha_fin"])[1];

//$event = "BEGIN:VCALENDAR\n";
//$event .= "VERSION:2.0";
//$event .= "PRODID:-//hacksw/handcal//NONSGML v1.0//EN";
//$event .= "BEGIN:VEVENT";
//$event .= "DTSTART: " . str_replace("-", "", $fecha_inicio) . "T" . str_replace(":", "", $hora_inicio); //20100527T183000
//$event .= "DTEND:" . str_replace("-", "", $fecha_fin) . "T" . str_replace(":", "", $hora_fin); //20100527T2030000
//$event .= "SUMMARY:{$titulo}";
//$event .= "LOCATION:{$direccion}";
//$event .= "DESCRIPTION:{$descripcion}";
//$event .= "END:VEVENT";
//$event .= "END:VCALENDAR";
?>

<script src="FileSaver.js"></script>
<script type="text/javascript">
    document.addEventListener('DOMContentLoaded', function () {

        var event = "";
        event += "BEGIN:VCALENDAR\n";
        event += "VERSION:2.0\n";
        event += "PRODID:-//hacksw/handcal//NONSGML v1.0//EN\n";
        event += "BEGIN:VEVENT\n";
        event += "DTSTART: <?php echo str_replace("-", "", $fecha_inicio) . "T" . str_replace(":", "", $hora_inicio) ?>\n"; //20100527T183000
        event += "DTEND: <?php echo str_replace("-", "", $fecha_fin) . "T" . str_replace(":", "", $hora_fin) ?>\n"; //20100527T2030000
        event += "SUMMARY:<?php echo $titulo; ?>\n";
        event += "LOCATION:<?php echo $direccion; ?>\n";
        event += "DESCRIPTION:<?php echo $descripcion; ?>\n";
        event += "END:VEVENT\n";
        event += "END:VCALENDAR\n";

        console.log("event", event);
//        window.open("data:text/calendar;charset=utf8," + escape(event));

        var blob = new Blob([event], {type: "data:text/calendar;charset=utf8"});
        saveAs(blob, "calendarOutlook.ics");
    });
</script>