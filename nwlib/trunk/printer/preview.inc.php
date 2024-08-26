<?php
if (!ob_start("ob_gzhandler")) {
    ob_start();
}

function load_pdf($name) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib/includes/dompdf/dompdf_config.inc.php";
    $dompdf = new DOMPDF();
    $html = ob_get_contents();
    ob_end_clean();
    $dompdf->load_html($html);
    $dompdf->render();
    if (!$name || $name == 0 || $name == '') {
        $name = $_SESSION["usuario"];
    }
    $dompdf->stream($name . "_" . date("Y-m-d") . ".pdf");
}

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

//error_reporting(-1);

if (session_id() == null) {
    session_start();
}

if (!isset($_SESSION["usuario"])) {
    $msg = "Debe ingresar correctamente al programa para ver esta impresi&oacute;n. Intente refrescando el navegador.";
    echo $msg;
    $data = Array();
    $data["error_text"] = $msg;
    master::sendReport($data);
    return;
}
$water_text = "";
$r = Array();
$printer = "";
if (isset($_GET["printer"])) {
    $printer = master::clean($_GET["printer"]);
} else {
    return;
}
if ($printer != "") {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nw_printer_settings", "*", "id=:printer and empresa=:empresa");
    $ca->bindValue(":printer", $printer);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    if (!$ca->exec()) {
        $db->rollback();
        echo $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "<b>Hay un problema con el tipo de configuración. Consulte con el administrador.</b> SQL: " . $ca->preparedQuery();
        return;
    }
    $ca->next();
    $r = $ca->assoc();
}
if (!isset($_GET["no_show_contents"])) {
    ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>QXNW - Vista previa de impresión</title>
            <link rel="stylesheet" type="text/css" href="css/nw_printer.css" media="print" ></link> 
            <style type="text/css">
                body{
                    position: relative;
                    margin: 0;
                    padding: 0;
                    font-family: <?php echo $r["fuente"] == "" ? "Arial" : $r["fuente"]; ?>;
                    font-size: <?php echo $r["tamano_fuente"] == 0 || $r["tamano_fuente"] == "" ? "12px" : $r["tamano_fuente"] . "px"; ?>;
                    background-color: white;
                    text-transform: <?php echo $r["text_transform"]; ?>;
                    margin-bottom: <?php echo $r["margen_inferior"] == "" ? 0 : $r["margen_inferior"] . "px"; ?>;
                    margin-top: <?php echo $r["margen_superior"] == "" ? 0 : $r["margen_superior"] . "px"; ?>;
                    margin-left: <?php echo $r["margen_izquierda"] == "" ? 0 : $r["margen_izquierda"] . "px"; ?>;
                    margin-right: <?php echo $r["margen_derecha"] == "" ? 0 : $r["margen_derecha"] . "px"; ?>;
                    max-width: <?php echo $r["ancho"] == "" ? 900 : $r["ancho"] . "px"; ?>;
                    width: <?php echo $r["ancho"] == "" ? 900 : $r["ancho"] . "px"; ?>;
                }
                div.capa {
                    position: absolute;
                    margin: 0 auto;
                    filter: alpha(opacity=35);
                    -moz-opacity: .35;
                    opacity: 0.3;
                    background: url(<?php echo "/nwlib/printer/water_mark.php?printer=" . $printer . "&water_text=" . $water_text; ?>) center 0;
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    z-index: 100;
                    /*background-size: 30%;*/
                    background-position-x: 50%;
                    background-position-y: 50%;
                }
                #contenedor{
                    position: relative;
                    width:<?php echo $r["ancho"] == "" || $r["ancho"] == 0 ? "100%" : $r["ancho"] . "px"; ?>;
                    height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;
                    margin: <?php echo $r["centrar"] == "t" ? "0 auto" : "0px"; ?>;
                    /*overflow: hidden;*/
                }
                .nw_list_table {
                    table-layout: fixed;
                    width: <?php echo $r["ancho_tabla"] == "" || $r["ancho_tabla"] == 0 ? "100%" : $r["ancho_tabla"] . "px"; ?>;
                    max-width: <?php echo $r["ancho_tabla"] == "" || $r["ancho_tabla"] == 0 ? "100%" : $r["ancho_tabla"] . "px"; ?>;
                    border-collapse: collapse;
                }
                .nw_list_table_enc {
                    background: #f1f1f1;
                    padding: 5;
                    font-weight: bold;
                }
                .nw_list_table table{
                    border-collapse: collapse;
                }
                .nw_list_table tr{

                }
                .nw_list_table th{

                }
                .nw_list_table td{
                    border: 1px solid #ccc;
                    padding: 3px;
                }
                .nw_list_table p{

                }
                .nw_list_table {
                    /*page-break-after: always;*/
                    word-wrap: break-word;
                }

            </style>
        </head>
        <body>
            <div class="capa" >
            </div>
            <div id="contenedor">
                <?php
            }
            $isSource = false;
            $data = Array();

            $r["centro"] = str_replace("{", "", $r["centro"]);
            $r["centro"] = str_replace("}", "", $r["centro"]);
            $r["encabezado"] = str_replace("{", "", $r["encabezado"]);
            $r["encabezado"] = str_replace("}", "", $r["encabezado"]);
            $r["pie"] = str_replace("{", "", $r["pie"]);
            $r["pie"] = str_replace("}", "", $r["pie"]);

            if (isset($r["encabezado"])) {
                echo "<div style='nw_encabezado'>";
                echo $r["encabezado"];
                echo "</div>";
            }
            if ($isSource) {
                echo "<div class='nw_centro'>";
                include_once $_SERVER["DOCUMENT_ROOT"] . $_GET["source"];
                echo "</div>";
            } else {
                if (isset($r["centro"])) {
                    echo "<div class='nw_center'>";
                    echo $r["centro"];
                    echo "</div>";
                }
            }
            if (isset($r["pie"])) {
                echo "<div class='nw_pie'>";
                echo $r["pie"];
                echo "</div>";
            }
            if (!isset($_GET["no_show_contents"])) {
                ?>
            </div>
        </body>
    </html>
    <?php
}

if (isset($_GET["load_pdf"])) {
    load_pdf($_GET["title"]);
}
?>