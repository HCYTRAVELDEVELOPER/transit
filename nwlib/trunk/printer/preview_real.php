<?php
//PARA DESCARGAR EN WORD
//header("Content-type: application/vnd.ms-word"); 
//header("Content-Disposition: attachment; filename=nombre.doc");

error_reporting(0);

$printer = master::clean($_GET["selectPrinterSettings"]);
$water_text = "";
if (isset($_GET["water_text"])) {
    $water_text = master::clean($_GET["water_text"]);
} else {
    $water_text = "";
}
$r = Array();
if ($printer != "") {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nw_printer_settings", "*", "id=:printer");
    $ca->bindValue(":printer", $printer);
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
} else {
    $r["encabezado"] = "";
    $r["centro"] = "";
    $r["pie"] = "";
    $r["fuente"] = "Arial";
    $r["tamano_fuente"] = "12px";
    $r["text_transform"] = "none";
    $r["margen_inferior"] = "0";
    $r["margen_izquierda"] = "0";
    $r["margen_derecha"] = "0";
    $r["margen_superior"] = "0";
    $r["alto"] = "900";
    $r["ancho"] = "700";
    $r["centrar"] = "t";
    $r["ancho_tabla"] = "100%";
}
?>
<?php
if (!isset($_GET["no_show_contents"])) {
    ?>
    <div class="contenedor_nwprint">
        <style type="text/css" media="print">
            @page{
                /*margin: 0;*/
                margin-bottom: <?php echo $r["margen_inferior"] == "" ? 0 : $r["margen_inferior"] . "px"; ?>;
                margin-top: <?php echo $r["margen_superior"] == "" ? 0 : $r["margen_superior"] . "px"; ?>;
                margin-left: <?php echo $r["margen_izquierda"] == "" ? 0 : $r["margen_izquierda"] . "px"; ?>;
                margin-right: <?php echo $r["margen_derecha"] == "" ? 0 : $r["margen_derecha"] . "px"; ?>;

            }
            .contenedor_pages {
                margin: 0!important;
                border: 0!important;
                /*page-break-after:always;*/
            }
            #contenedor{
                margin: 0!important;
            }
        </style>
        <style type="text/css">
            body{
                position: relative;
                margin: 0;
                padding: 0;
                font-family: <?php echo $r["fuente"] == "" ? "Arial" : $r["fuente"]; ?>!important;
                /*font-family: Arial!important;*/
                font-size: <?php echo $r["tamano_fuente"] == 0 || $r["tamano_fuente"] == "" ? "12px" : $r["tamano_fuente"] . "px"; ?>;
                background-color: #fff!important;
                text-transform: <?php echo $r["text_transform"]; ?>;
                background-color: gray;
                color: #000;
                font-style: normal!important;

                width: 100%;
                height: 100%;
            }
            body span, strong, a, div, big, em, p, pre,center,td{
                font-family: <?php echo $r["fuente"] == "" ? "Arial" : $r["fuente"]; ?>!important;
                font-size: <?php echo $r["tamano_fuente"] == 0 || $r["tamano_fuente"] == "" ? "12px" : $r["tamano_fuente"] . "px"; ?>!important;
                text-transform: <?php echo $r["text_transform"]; ?>!important;

            }
            em{
                font-style: normal!important;
            }
            span{
                font-style: normal!important;
            }
            table{
                background-color: transparent!important;
                width: 100%!important;
                border: 0;
                border-left: 1px solid #000!important;
                padding: 0;
                margin: 0;
            }
            td{
                border: 1px solid #000;
                padding: 6px;
                height: auto!important;
                border-bottom: 0;
                border-left: 0;
                border-collapse: collapse!important;
            }
            tr{
                margin: 0;
                padding: 0;
            }
            p{
                margin: 0;
                padding: 0;
                margin-bottom: 5px;
            }
            strong{
                font-size: 14px;
                text-transform: capitalize;
                margin: 0;
                padding: 0;
                text-align: left;
            }
            pre{
                margin: 0;
                padding: 0;
                font-family: arial;
                white-space: normal;
                line-height: normal;
            }
            .div_uno_pie{
                border-bottom: 1px solid #000;
                height: 100%;
                border-left: 1px solid #000;
                border-right: 1px solid #000;
            }
            .div_uno_pie table{
                border-left: 0!important;
                border-right: 0!important;
                border: 0!important;
                margin-bottom: 30px;
                margin-top: 0px;
            }
            .div_uno_pie td{
                border: 0px;
            }
            .capa {
                position: absolute;
                filter: alpha(opacity=35);
                -moz-opacity: .35;
                opacity: 0.2;
                width: 100%;
                height: 1000px;
                z-index: 0;
                top: 0;
                left: 0;
                text-align: center;
            }
            .capa img{
                /*width: 50%;*/
                margin: auto;
                position: relative;
                text-align: center;
                top: 30%;
                display: none;
            }
            .capa p{
                font-size: 11em!important;
                font-weight: bold;
                opacity: 0.8;
                text-transform: uppercase;
                -webkit-transform: rotateZ(-30deg);
                -moz-transform: rotateZ(-30deg);
                -o-transform: rotateZ(-30deg);
                /*line-height: 1200px;*/
                top: 50%;
                position: relative;
            }
            #contenedor{

                /*position: relative;*/
                position: absolute;
                height: auto;
                background-color: white;

                width:<?php echo $r["ancho"] == "" || $r["ancho"] == 0 ? "100%" : $r["ancho"] . "px"; ?>;

                margin: <?php echo $r["centrar"] == "t" ? "0 auto" : "0px"; ?>;
                /*height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;*/
                /*margin-bottom: <?php echo $r["margen_inferior"] == "" ? 0 : $r["margen_inferior"] . "px"; ?>;*/
                /*margin-top: <?php echo $r["margen_superior"] == "" ? 0 : $r["margen_superior"] . "px"; ?>;*/
                margin-left: <?php echo $r["margen_izquierda"] == "" ? 0 : $r["margen_izquierda"] . "px"; ?>;
                margin-right: <?php echo $r["margen_derecha"] == "" ? 0 : $r["margen_derecha"] . "px"; ?>;
                z-index: 1;
                padding: 0px;
                overflow: hidden;
            }
            .contenedor_one{
                height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;
            }
            #box_pags{
                position: absolute;
                top: 0;
                left: 0;

                /*                    height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;	*/
                height: auto;
                margin: <?php echo $r["centrar"] == "t" ? "0 auto" : "0px"; ?>;
                background-color: white;
                margin-bottom: <?php echo $r["margen_inferior"] == "" ? 0 : $r["margen_inferior"] . "px"; ?>;
                margin-top: <?php echo $r["margen_superior"] == "" ? 0 : $r["margen_superior"] . "px"; ?>;
                margin-left: <?php echo $r["margen_izquierda"] == "" ? 0 : $r["margen_izquierda"] . "px"; ?>;
                margin-right: <?php echo $r["margen_derecha"] == "" ? 0 : $r["margen_derecha"] . "px"; ?>;
                z-index: 1;
                padding: 0px;
                overflow: hidden;
            }
            .contenedor_one{
                height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;
            }
            #box_pags{
                position: absolute;
                top: 0;
                left: 0;

            }
            .nw_encabezado {

            }
            .nw_encabezado table{

            }
            .nw_encabezado tr{

            }
            .nw_encabezado td{
                /*padding: 20px 0;*/
            }
            .nw_center {

            }
            .nw_pie {

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
                /*word-wrap: break-word;*/
                page-break-inside: auto;
            }
            .nw_list_table.tr    {
                page-break-inside:avoid;
                page-break-after:auto
            }
            .nw_pie {
                page-break-after: always;
            }
            .mision td{
                border:0;
            }
            .mision table{
                border:0!important;
            }
            .contenedor_pages{
                position: relative;
                /*width:<?php echo $r["ancho"] == "" || $r["ancho"] == 0 ? "100%" : $r["ancho"] . "px"; ?>;*/
                width: auto;
                /*height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;*/
                /*height: 1203px;*/
                height: 1160px;
                z-index: 1;
                padding: 0px;
                margin: 0;
                border: 1px solid #000;
                page-break-after:always;
                /*page-break-before: always;*/

                margin-bottom: <?php echo $r["margen_inferior"] == "" ? 0 : $r["margen_inferior"] . "px"; ?>;
                /*margin-top: <?php echo $r["margen_superior"] == "" ? 0 : $r["margen_superior"] . "px"; ?>;*/
                /*  margin-left: <?php echo $r["margen_izquierda"] == "" ? 0 : $r["margen_izquierda"] . "px"; ?>;
                  margin-right: <?php echo $r["margen_derecha"] == "" ? 0 : $r["margen_derecha"] . "px"; ?>;*/
            }
            .border_bottom{
                border-bottom: 1px solid!important;
            }
            .paginacion{
                position: absolute;
                top: 0px;
                left: 0;
                padding: 0;
                margin: 0;
                height: 0;
            }
            .numeral_pag{
                position: absolute;
                z-index: 1000;
                top:0px;
                right:0px;
                width:200px;
            }
            .table_columns td{
                padding: 0;
            }
            .table_columns div{
                border-bottom: 1px solid;
                width: 100%;
                padding: 5px 0;
                margin: 0px;
                position: relative;
                height: 20px;
            }
            .table_columns span{
                text-align: right;
                float: right;
                border-left: 1px solid;
                width: 100px;
                margin-right: 5px;
                height: 100%;
            }
            .table_columns br{
                display: none;
            }
            .contenedor_pages{
                position: relative;
                /*width:<?php echo $r["ancho"] == "" || $r["ancho"] == 0 ? "100%" : $r["ancho"] . "px"; ?>;*/
                width: auto;
                /*height: <?php echo $r["alto"] == "" || $r["alto"] == 0 ? "100%" : $r["alto"] . "px"; ?>;*/
                /*height: 1203px;*/
                height: 1181px;
                z-index: 1;
                padding: 0px;
                margin: 0;
                /*border: 1px solid #000;*/
            }
        </style>
        <div id="contenedor">
            <?php
        }

        if (isset($r["oculto"]) && $r["oculto"] != null && $r["oculto"] != '') {
            $r["oculto"] = str_replace("[", "{", $r["oculto"]);
            $r["oculto"] = str_replace("]", "}", $r["oculto"]);
            echo $r["oculto"];
        }

        $GLOBALS["get"] = $_GET;
        foreach ($_GET as $key => $v) {
            if ($key != "source") {
                if ($key != "selectPrinterSettings") {
                    if (isset($r["encabezado"])) {
                        $r["encabezado"] = str_replace("{" . $key . "}", $v, $r["encabezado"]);
                    }
                    if (isset($r["centro"])) {
                        $r["centro"] = str_replace("{" . $key . "}", $v, $r["centro"]);
                    }
                    if (isset($r["pie"])) {
                        $r["pie"] = str_replace("{" . $key . "}", $v, $r["pie"]);
                    }
                }
            }
        }
        $listCode = "";
        $isSource = false;
        if (isset($_GET["source"])) {
            if (isset($_GET["list_code"])) {
                $listCode = $_GET["list_code"];
            }
            $isSource = true;
        }
        $data = Array();
        $fields = Array();
        $dataNames = Array();
        if (isset($r["centro"]) || $r["encabezado"] || $r["pie"]) {
            if (isset($ca)) {
                $ca->clear();
            } else {
                $db = NWDatabase::database();
                $ca = new NWDbQuery($db);
            }
            $ca->prepareSelect("nw_printer_data", "*", "printer=:printer");
            $ca->bindValue(":printer", $printer);
            if (!$ca->exec()) {
                echo "No se consultaron los datos para esta impresión. Error: " . $ca->lastErrorText();
            }
            $ra = $ca->assocAll();
            for ($i = 0; $i < count($ra); $i++) {
                $rc = $ra[$i];
                $dataNames[] = $rc["nombre"];
                if ($db->getDriver() == "MYSQL") {
                    $ca->prepare(str_replace("$", "'", $ra[$i]["sql_data"]));
                } else {
                    $ca->prepare(str_replace("$", "'", $ra[$i]["sql"]));
                }
                foreach ($_GET as $key => $v) {
                    if ($key != "source") {
                        if ($key != "selectPrinterSettings") {
                            $ca->bindValue(":" . $key, $v);
                        }
                    }
                }
                if (!$ca->exec()) {
                    echo "La consulta llamada " . $ra[$i]["nombre"] . " debe ser verificada: " . $ca->lastErrorText();
                }
                for ($ia = 0; $ia < $ca->size(); $ia++) {
                    $ca->next();
                    $rb = $ca->assoc();
                    if ($ia == 0) {
                        $fields = array_keys($rb);
                    }
                    foreach ($fields as $v) {
                        $data[$rc["nombre"]][$v][] = $rb[$v];
                    }
                }
                $data_cc = "";
                foreach ($dataNames as $v) {
                    foreach ($fields as $w) {
                        if (isset($data[$v][$w])) {
                            $data[$v][$w] = str_replace("#", "$", $data[$v][$w]);
                            $bb = "<br/>";

                            foreach ($data[$v][$w] as $fields_a) {
                                $data_cc .= "< br/>" . $fields_a . "</td>";
                            }
//                                    $data_cc = implode("<br />", $data[$v][$w]);
                            $r["centro"] = str_replace("{" . $v . "." . $w . "}", implode("<br />", $data[$v][$w]), $r["centro"]);
                            $r["encabezado"] = str_replace("{" . $v . "." . $w . "}", implode("<hr />", $data[$v][$w]), $r["encabezado"]);
                            $r["pie"] = str_replace("{" . $v . "." . $w . "}", implode("<br />", $data[$v][$w]), $r["pie"]);
                        }
                    }
                }
            }
        }

        if (isset($r["centro"])) {
            $r["centro"] = str_replace("{", "", $r["centro"]);
            $r["centro"] = str_replace("}", "", $r["centro"]);
        }
        if (isset($r["encabezado"])) {
            $r["encabezado"] = str_replace("{", "", $r["encabezado"]);
            $r["encabezado"] = str_replace("}", "", $r["encabezado"]);
        }
        if (isset($r["pie"])) {
            $r["pie"] = str_replace("{", "", $r["pie"]);
            $r["pie"] = str_replace("}", "", $r["pie"]);
        }

        if (isset($r["encabezado"])) {
            if ($r["encabezado"] != null) {
                if ($r["encabezado"] != '') {
                    echo "<div class='nw_encabezado'>";
                    echo $r["encabezado"];
                    echo "</div>";
                }
            }
        }
        if ($isSource) {
            //echo "<div class='nw_centro'>";
            include_once $_SERVER["DOCUMENT_ROOT"] . $_GET["source"];
            //echo "</div>";
        } else {
            if (isset($r["centro"])) {
                if ($r["centro"] != null) {
                    if ($r["centro"] != '') {
                        echo "<div class='nw_center' style='page-break-inside: avoid;'>";
                        echo $r["centro"];
//                            echo "<br />N°: " . strlen($r["centro"]);
//                            echo "<br />";
//                            $b = array($r["centro"]);
//                            $a = sizeof($b);
//                            echo $a;
                        echo "</div>";
                    }
                }
            }
        }
        if (isset($r["pie"])) {
            if ($r["pie"] != null) {
                if ($r["pie"] != '') {
                    echo "<div class='nw_pie'>";
                    echo $r["pie"];
                    echo "</div>";
                }
            }
        }
        if (!isset($_GET["no_show_contents"])) {
            ?>
            <div class="capa" style="display: none; <?php
                 if (isset($_GET["media_hoja"])) {
                     if ($_GET["media_hoja"] == "true") {
                         echo "top: 10%!important;";
                     }
                 }
                 ?>">
                <img alt="water mark" src="<?php echo "/nwlib" . master::getNwlibVersion() . "/printer/water_mark.php?printer=" . $printer . "&water_text=" . $water_text; ?>" />
                <p>
                    <?php echo $water_text; ?>
                </p>
            </div>
        </div>
        <script type="text/javascript">
            function alto() {
                var he = document.getElementById("contenedor").offsetHeight;
                //  var he = document.body.offsetHeight;
                var h_hoja = 1200;
                he = he.toString();
                var cadena_r = he / h_hoja;

                var cadena_m = Math.round(cadena_r);
                var hoja_real = "";
                var total_hoja = cadena_r.toFixed(1)
                //        if (he > 100000) {
                //            var cadena = he.substring(0, 3);
                //        } else
                //        if (he > 10000) {
                //            var cadena = he.substring(0, 2);
                //        } else {
                //            var cadena = he.substring(0, 1);
                //        }
                if (total_hoja > cadena_m) {
                    var hoja_real = cadena_m + 1;
                } else
                if (total_hoja == cadena_m) {
                    var hoja_real = cadena_m;
                } else {
                    var hoja_real = cadena_m;
                }
                //        if (hoja_real == 1) {
                //            alert(hoja_real + " Página");
                //        } else {
                //            alert(hoja_real + " Páginas");
                //        }
                var x = 0;
                while (x < hoja_real) {
                    document.write('<div class="contenedor_pages"><div class="paginacion"><div class="numeral_pag"><p>' + (x + 1) + ' de ' + hoja_real + '</p></div></div><div class="capa"><p style="<?php
                if (isset($_GET["media_hoja"])) {
                    if ($_GET["media_hoja"] == true) {
                        echo "top: 15%!important;";
                    }
                }
                ?>"><?php echo $water_text; ?></p></div></div>');
                    x = x + 1;
                }
            }
            window.onload = alto();
        </script>
    </div>
    <?php
}
if (isset($_GET["load_pdf"])) {
    load_pdf($_GET["title"]);
} else if (isset($_GET["show_pdf"])) {
    show_pdf($_GET["title"]);
}
?>