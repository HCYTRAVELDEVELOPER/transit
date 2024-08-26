<?php
if (isset($_GET["print_direct"])) {
    ?>
    <div class="btn-print" onclick="javascript:window.print();">
        Imprimir
    </div>
    <script type="text/javascript">
        setTimeout(function () {
            print();
            window.print();
        }, 3000);
    </script>
    <?php
}
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
error_reporting(E_ALL);

if (session_id() == null) {
    session_start();
}

set_error_handler("errorHandler", E_ALL | E_NOTICE | E_STRICT);
set_exception_handler("exceptionHandler");

function errorHandler($errno, $errstr, $errfile, $errline) {

    if (0 === error_reporting()) {
        return false;
    }
    $errfile = str_replace(".php", "", basename($errfile));

    $date = date('d.m.Y h:i:s');
    $log = "Error text: " . "no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}" . "   \n  Date:  " . $date . "\n";
    if (isset($_SESSION["usuario"])) {
        $log .= $log . " User:  " . $_SESSION["usuario"] . "\n";
    }

    ob_start();
    debug_print_backtrace();
    $log .= ob_get_contents();
    ob_end_clean();

    $log .= "\n";

    error_log($log, 0);

    master::sendReport($log);

    echo ("errorHandler no: {$errno
    }, string: {$errstr
    }, file: {$errfile
    }, line: {$errline
    }");
    exit;
}

function exceptionHandler($e) {
    if (0 === error_reporting()) {
        return false;
    }
    $errfile = str_replace(".php", "", basename($e->getFile()));
    $errline = $e->getLine();
    $errno = $e->getCode();
    $errstr = "exceptionHandler " . $e->getMessage();

    $date = date('d.m.Y h:i:s');
    $log = "Error text: " . "no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}" . "   \n  Date:  " . $date . "\n";
    if (isset($_SESSION["usuario"])) {
        $log .= $log . " User:  " . $_SESSION["usuario"] . "\n";
    }

    ob_start();
    debug_print_backtrace();
    $log .= ob_get_contents();
    ob_end_clean();

    $log .= "\n";

    error_log($log, 0);

    echo ("no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}");
    exit;
}

//SE QUITA PARA DISPOSITIVOS MÓVILES
//if (!isset($_SESSION["usuario"])) {
//
//    if (isset($_GET["usuario"])) {
//        $_SESSION["usuario"] = $_GET["usuario"];
//        if (isset($_GET["empresa"])) {
//            $_SESSION["empresa"] = $_GET["empresa"];
//        }
//    } else {
//        $msg = "Debe ingresar correctamente al programa para ver esta impresi&oacute;n. Intente refrescando el navegador.";
//        echo $msg;
//        $data = Array();
//        $data["error_text"] = $msg;
//        master::sendReport($data);
//        return;
//    }
//}

function load_pdf($name) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/includes/dompdf/dompdf_config.inc.php";
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

//
//function show_pdf($name) {
//    require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/includes/dompdf/dompdf_config.inc.php";
//    $dompdf = new DOMPDF();
//    $html = ob_get_contents();
//    ob_end_clean();
//    $dompdf->load_html($html);
//    $dompdf->render();
//    if (!$name || $name == 0 || $name == '') {
//        $name = $_SESSION["usuario"];
//    }
//    $dompdf->stream($name . "_" . date("Y-m-d") . ".pdf");
//}
//
//function show_pdf_better($name, $html) {
//    require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib" . master::getNwlibVersion() . "/includes/dompdf/dompdf_config.inc.php";
//    $dompdf = new DOMPDF();
//    $dompdf->load_html($html);
//    $dompdf->render();
//    if (!$name || $name == 0 || $name == '') {
//        $name = $_SESSION["usuario"]; 
//    }
//    $dompdf->stream($name . "_" . date("Y-m-d") . ".pdf");
//}

function preview_real($id_real) {
    if ($id_real != 0) {
        $_GET["id"] = $id_real;
    }
    $contain_include = "SI";
    if (isset($_GET["file"])) {
        $parsed_url = parse_url($_GET["file"]);
        if (isset($parsed_url["scheme"])) {
            if ($parsed_url["scheme"] == "http") {
                echo file_get_contents($_GET["file"]);
            } else if ($parsed_url["scheme"] == "https") {
                echo file_get_contents($_GET["file"]);
            }
        } else {
            $path_file = $_SERVER["DOCUMENT_ROOT"] . $_GET["file"];
            $exploded_file = explode("?", $path_file);
            if (!file_exists($exploded_file[0])) {
                echo "El archivo en la ubicación " . $path_file . " no se encuentra. Verifique los datos enviados";
                return;
            }
            if (isset($exploded_file[1])) {
                $exploded_query = explode("&", $exploded_file[1]);
                for ($i = 0; $i < count($exploded_query); $i++) {
                    $r = explode("=", $exploded_query[$i]);
                    $_GET[$r[0]] = $r[1];
                }
            }
            include $exploded_file[0];
        }
    } else if (isset($_GET["source"])) {
        $parsed_url = parse_url($_GET["source"]);
        if (isset($parsed_url["scheme"])) {
            if ($parsed_url["scheme"] == "http") {
                echo file_get_contents($_GET["source"]);
            } else if ($parsed_url["scheme"] == "https") {
                echo file_get_contents($_GET["source"]);
            }
        } else {
            include $_SERVER["DOCUMENT_ROOT"] . $_GET["source"];
        }
    } else {
        include "printer/preview_real.php";
    }
}

$rta_result = "";
if (isset($_GET["idmasivo"])) {
    $ids = explode(",", $_GET["idmasivo"]);
    $total_ids = count($ids);
    if ($total_ids == 0) {
        echo "Debe contener por lo menos un id masivo separado por comas, ejemplo: idmasivo=1,2,3";
        return;
    }
    for ($i = 0; $i < $total_ids; $i++) {
        $rta_result .= preview_real($ids[$i]);
    }
} else {
    $rta_result = preview_real(0);
}

if (!isset($_GET["no_show_contents"])) {
    ?>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <link rel="stylesheet" type="text/css" href="printer/css/nw_printer.css" media="print" ></link> 
            <style>
                .contenedor_nwprint{
                    page-break-after: always;
                }
            </style>
        </head>
        <body>
            <div class='container-all'>
                <?php
            }
            echo $rta_result;

            if (!isset($_GET["no_show_contents"])) {
                ?>
            </div>
        </body>
    </html>
    <?php
}

