<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$carpeta = "/nwlib{$cfg["nwlibVersion"]}/modulos/nwexcel/";
ob_start('comprimir_pagina');
$id_get = "";
$id_qxnwlist = "";
if (isset($_GET["id"])) {
    if ($_GET["id"] != "") {
        $id_get = $_GET["id"];
    }
}
if (isset($_GET["id_qxnwlist"])) {
    if ($_GET["id_qxnwlist"] != "") {
        $id_qxnwlist = $_GET["id_qxnwlist"];
    }
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$nombre = "Documento sin Título";
$name_file = "";
$propietario = "";
$plantilla = "NO";
$guardar = "SI";
$editar = "";
$total = 0;
if ($id_get != "") {
    $ca->prepareSelect("nwexcel_files", "*", "id=:id");
    $ca->bindValue(":id", $id_get);
    if (!$ca->exec()) {
        echo "error " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total > 0) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["nombre"] != "") {
            $nombre = $r["nombre"];
            $name_file = $r["nombre"];
        }
        $propietario = $r["usuario"];
        if ($r["tipo"] == "plantilla") {
            $plantilla = "SI";
        }
    }
}
//else
//if ($id_qxnwlist != "") {
//    $ca->prepareSelect("nw_excel_list", "*", "id=:id");
//    $ca->bindValue(":id", $id_qxnwlist);
//    if (!$ca->exec()) {
//        echo "error " . $ca->lastErrorText();
//        return;
//    }
//    $total = $ca->size();
//    if ($total > 0) {
//        $ca->next();
//        $r = $ca->assoc();
//        if ($r["nombre"] != "") {
//            $nombre = $r["nombre"];
//            $name_file = $r["nombre"];
//        }
//        $propietario = $r["usuario"];
//        if ($r["tipo"] == "plantilla") {
//            $plantilla = "SI";
//        }
//    }
//}
if (isset($r["acceso"])) {
    if ($r["acceso"] == "soloyo" || $r["acceso"] == "usuariosdelsistema") {
        if (!isset($si["usuario"])) {
            echo "Debes iniciar sesión. <a href='/build/index.html'>Haz clic aquí.</a>";
            return;
        }
    }
}
if ($plantilla != "SI") {
    $guardar = "NO";
}
if ($total > 0) {
    $guardar = "NO";
}
if (isset($r["permisos"])) {
    $editar = $r["permisos"];
}
if (isset($si["usuario"])) {
    if ($propietario == $si["usuario"]) {
        $guardar = "SI";
        $editar = "";
    }
}
if (isset($r["permisos"])) {
    if ($editar == "lecturayescritura") {
        $guardar = "SI";
    }
}
$maxRows = "";
$maxCols = "";
if (isset($_GET["maxRows"]))
    $maxRows = $_GET["maxRows"];
if (isset($_GET["maxCols"]))
    $maxCols = $_GET["maxCols"];
$functionQXNW = "NO";
if (isset($_GET["functionQXNW"]))
    if ($_GET["functionQXNW"] != "")
        $functionQXNW = $_GET["functionQXNW"];
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <!--<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">-->
    <!--<html>-->
    <head>
        <title>Nw Excel</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <link href="<?php echo $carpeta; ?>css/style.css" rel="stylesheet" type="text/css" charset="utf-8" />
            <link href="<?php echo $carpeta; ?>css/tablas_divs.css" rel="stylesheet" type="text/css" charset="utf-8" />
            <link href="<?php echo $carpeta; ?>css/jquery-ui.css" rel="stylesheet" type="text/css" charset="utf-8" />
            <link rel='stylesheet' type='text/css' href='<?php echo $carpeta; ?>css/style_print.css' media='print' />
            <script type='text/javascript' src='<?php echo $carpeta; ?>js/jquery.min.js' ></script>
            <script src="<?php echo $carpeta; ?>js/jquery-ui.min.js"></script>
            <?php
            if (1 == 1) {
//            if ($_SERVER["HTTP_HOST"] == "af.loc" || $_SERVER["HTTP_HOST"] == "www.af.loc" || $_SERVER["HTTP_HOST"] == "nwp5.loc" || $_SERVER["HTTP_HOST"] == "www.nwp5.loc") {
                ?>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/init.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/createAll.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/selected_fields.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/context_menu.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/srv.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/functions.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/barra_formulas_enc.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/funcs_buttons_enc.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/teclas.js' ></script>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/evalOperations.js' ></script>
                <?php
            } else {
                ?>
                <script type='text/javascript' src='<?php echo $carpeta; ?>js/main_original.js' ></script>          
                <?php
            }
            ?>
            <script type='text/javascript' src='<?php echo $carpeta; ?>js/loading.js' ></script>
    </head>
    <body>
        <div id="loading">
            <?php
            include_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib{$cfg["nwlibVersion"]}/includes/loading/index.php";
            ?>
        </div>
        <div id="contenedor">
            <div class="formulas_enc">
                <div class="formulas_enc_int">
                    <div class="bloques_enc">
                        <div class="home_buttonenc">
                            <a href="index.php">
                                Home
                            </a>
                        </div>
                        <h2 class="title_document" id="title_document">
                            <?php echo $nombre; ?>
                        </h2>
                        <input type="hidden" name="name_file" id="name_file" value="<?php echo $name_file; ?>" />
                    </div>
                    <div class="contain_menu_enc contain_buttons_enc">
                        <?php
                        if ($guardar == "SI") {
                            if (isset($si["usuario"])) {
                                if ($propietario == $si["usuario"]) {
                                    ?>
                                    <div class="bloques_enc btn btn-blue code_css">
                                        Code CSS
                                    </div>
                                    <div class="bloques_enc btn btn-blue code_js">
                                        Code JS
                                    </div>
                                    <div class="bloques_enc btn btn-blue compartir_file">
                                        Compartir
                                    </div>
                                    <?php
                                }
                            }
                            if ($functionQXNW == "NO") {
                                ?>
                                <div class="btn btn-blue save bloques_enc">
                                    Guardar
                                </div>
                                <?php
                            }
                        }
                        if (isset($_GET["file"])) {
                            $editar = "";
                        }
                        if ($editar == "" || $editar == "lecturayescritura") {
                            if (isset($si["usuario"])) {
                                if ($functionQXNW == "NO") {
//                        if ($propietario == $si["usuario"]) {
                                    ?>
                                    <div class="btn btn-blue save_como bloques_enc">
                                        Guardar Como
                                    </div>
                                    <div class="btn btn-blue complete_celdas bloques_enc">
                                        Completar Celdas
                                    </div>
                                    <?php
//                        }
                                }
                            }
                        }
                        if ($functionQXNW != "NO") {
                            ?>
                            <div class="btn btn-blue execute_functionQXNW bloques_enc">
                                Guardar
                            </div>
                            <?php
                        }
                        ?>
                        <div class="bloques_enc btn btn-blue vista_previa">
                            Vista Previa
                        </div>
                        <div class="bloques_enc btn btn-blue botonExcel">
                            Descargar
                        </div>
                        <div class="bloques_enc btn btn-blue menuOne">
                            Herramientas
                            <div class="subMenuOne">
                                <ul>
                                    <li>
                                        <div class="bloques_enc btn btn-blue normalizar">
                                            Normalizar
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue styles" tipo="cleanformat">
                                            Limpiar Formato
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue styles" tipo="clean_celda">
                                            Formatear Celda
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue styles" tipo="negrilla">
                                            Negrilla
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue">
                                            Tamaño Texto
                                            <input type="number" id="texto_tamano" class="colorButton" tipo="texto_tamano" value="12" />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue styles" tipo="texto_centrar">
                                            Centrar Texto
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue styles" tipo="texto_izquierda">
                                            Izquierda Texto
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue styles" tipo="texto_derecha">
                                            Derecha Texto
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue">
                                            Borde <input type="color" id="borde"  tipo="borde" class="colorButton" />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue">
                                            Color <input type="color" id="color_fuente"  tipo="color_fuente" class="colorButton" />
                                        </div>
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue">
                                            Fondo <input type="color" id="fondocolor"  tipo="fondocolor" class="colorButton" />
                                        </div>  
                                    </li>
                                    <li>
                                        <div class="bloques_enc btn btn-blue">
                                            Relleno Interno Alto
                                            <input type="number" id="altura_celda" class="colorButton" tipo="altura_celda" value="0" />
                                            Relleno Interno  Ancho
                                            <input type="number" id="ancho_celda" class="colorButton" tipo="ancho_celda" value="0" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="contain_menu_enc contain_inputs_enc">
                        Celda 
                        <input type="text" id="selection" name="selection" value="0" />
                        Fx 
                        <input type="text" id="formulas" name="formulas" value="0" />
                    </div>
                </div>
            </div>
            <form id="form_general" method="POST" oninput="javascript: op();" contenteditable="false" functionQXNW="<?php echo $functionQXNW; ?>" maxRows="<?php echo $maxRows; ?>" maxCols="<?php echo $maxCols; ?>" data-id="<?php echo $id_get; ?>" data-plantilla="<?php echo $plantilla; ?>" data-guardar="<?php echo $guardar; ?>" permisos="<?php echo $editar; ?>">
                <div class="body_happ">
                    <div class="enc_print">
                        <div class="bloques_enc btn btn-blue print_button">
                            Imprimir
                        </div>
                        <div class="bloques_enc btn btn-blue cancel_print">
                            Cancelar
                        </div>
                    </div>
                    <div id="body_contain" class="body_contain">
                        <div id="contain_divisor_page" class="contain_divisor_page">
                            <?php
                            for ($r = 0; $r < 100; $r++) {
                                echo "<div class='divisor_page'></div>";
                            }
                            ?>
                        </div>
                        <?php

                        function loadFile($file) {
                            if (is_file($file)) {
                                ob_start();
                                include $file;
                                return ob_get_clean();
                            }
                        }

                        $document = "";
                        $fileLoaded = false;

                        if (isset($_GET["file"])) {
                            if ($_GET["file"] == "/nwlib6/nw_calculate/nw_enc_user.inc.php") {
                                $document .= loadFile($_SERVER["DOCUMENT_ROOT"] . $_GET["file"]);
                                $fileLoaded = true;
                            }
                        }
                        if (isset($_GET["id"])) {
                            if ($_GET["id"] != "") {
                                $document .= loadFile("src/load_document.php");
                            }
                        } else if (isset($_GET["id_qxnwlist"])) {
                            if ($_GET["id_qxnwlist"] != "") {
                                $document .= loadFile("src/load_qxnwlist.php");
                            }
                        } else if (isset($_GET["file"])) {
                            if ($_GET["file"] != "") {
                                if ($fileLoaded == false) { 
                                    $document .= loadFile($_SERVER["DOCUMENT_ROOT"] . $_GET["file"]);
                                }
                            }
                        } else {
                            $document .= loadFile("src/initial.php");
                        }

                        $document = str_replace("<table>", "", $document);
                        $document = str_replace("<table class=\"axTable\">", "", $document);
                        $document = str_replace("<table class='axTable'>", "", $document);
                        $document = str_replace("<table border='1'><tbody>", "", $document);
                        $document = str_replace("<table border='1' class='axTable'>", "", $document);
                        $document = str_replace("<table border=\"1\" class=\"axTable\">", "", $document);
                        $document = str_replace("</table>", "", $document);
                        $document = str_replace("<tbody>", "", $document);
                        $document = str_replace("</tbody>", "", $document);

                        $allDataDocument = "";
                        $allDataDocument .= "<table>";
                        $allDataDocument .= "<tbody>";
                        $allDataDocument .= $document;
                        $allDataDocument .= "</table>";
                        $allDataDocument .= "</tbody>";

                        $testdivs = false;
//                        $testdivs = true;

                        if ($testdivs) {
                            $allDataDocument = str_replace("<tr", "<div ", $allDataDocument);
                            $allDataDocument = str_replace("</tr>", "</div> ", $allDataDocument);
                            $allDataDocument = str_replace("<td", "<div ", $allDataDocument);
                            $allDataDocument = str_replace("</td>", "</div> ", $allDataDocument);
                            $allDataDocument = str_replace("<table", "<div ", $allDataDocument);
                            $allDataDocument = str_replace("</table>", "</div> ", $allDataDocument);
                        }

                        print $allDataDocument;
                        ?>
                    </div>
                </div>
            </form>
            <div id="footer">
                <form action="srv/ficheroExcel.php" method="post" target="_blank" id="FormularioExportacion">
                    <input type="hidden" id="datos_a_enviar" name="datos_a_enviar" />
                </form>
                Field: 
                <span class="field_footer_show"></span>
                <span class="field_footer"></span>
            </div>
        </div>
        <div id="contain_code_js"></div>
    </body>
</html>
<?php
//ej: &var=F7:12;G5:1
///nwlib6/modulos/nwexcel/file.php?id=19&var=F7:12;G5:1;E2:texto%20de%20ejemplo
$v = "";
if (isset($_GET["var"])) {
    $v = $_GET["var"];
    $vt = explode(";", $v);
    if (count($vt) > 0) {
        for ($t = 0; $t < count($vt); $t++) {
            $vd = explode(":", $vt[$t]);
            if ($vd[1] == "null" || $vd[1] == "NULL")
                $vd[1] = "";
            ?>
            <script>
                $(document).ready(function () {
                    field_get('<?php echo $vd[0]; ?>', '<?php echo $vd[1]; ?>');
                });
            </script>
            <?php
        }
    }
}
ob_end_flush();

function comprimir_pagina($buffer) {
    $busca = array('/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s');
    $reemplaza = array('>', '<', '\\1');
    return preg_replace($busca, $reemplaza, $buffer);
}
?>