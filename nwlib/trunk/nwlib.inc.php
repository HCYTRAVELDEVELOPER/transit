<?php

set_error_handler("NWLib::errorHandler", E_ALL | E_NOTICE | E_STRICT);
set_exception_handler("NWLib::exceptionHandler");

global $isApiOut;
global $usedOutNwlib;
global $saveSession;

if (version_compare(phpversion(), '8.1.0', '<')) {
    if (!session_id()) {
        session_start();
    }
} else if (isset($saveSession) && $saveSession === true) {
    include dirname(__FILE__) . "/sessionHandler.inc.php";
} else if (isset($usedOutNwlib) && $usedOutNwlib === true) {
    if (!session_id()) {
        session_start();
    }
} else if (isset($isApiOut) && $isApiOut === true) {
    if (!session_id()) {
        session_start();
    }
} else {
    include dirname(__FILE__) . "/sessionHandler.inc.php";
}

$composer_path = "vendor/autoload.php";
if (file_exists($composer_path)) {
    include dirname(__FILE__) . "/vendor/autoload.php";
}

include_once dirname(__FILE__) . "/PHPMailer/class.phpmailer.php";
include_once dirname(__FILE__) . "/config.php";
include_once dirname(__FILE__) . "/utils.inc.php";
include_once dirname(__FILE__) . "/central/ws_config.inc.php";
include_once dirname(__FILE__) . "/ws/connectCentral.inc.php";
include_once dirname(__FILE__) . "/master.php";
//include_once dirname(__FILE__) . "/chat.php";
include_once dirname(__FILE__) . "/reports.php";
include_once dirname(__FILE__) . "/camera.php";
include_once dirname(__FILE__) . "/excelReport.php";
include_once dirname(__FILE__) . "/htmlForms.php";
include_once dirname(__FILE__) . "/mail_lists.php";
include_once dirname(__FILE__) . "/nw_printer.php";
include_once dirname(__FILE__) . "/notifications.php";
include_once dirname(__FILE__) . "/file_manager.php";
include_once dirname(__FILE__) . "/exportExcel.php";
include_once dirname(__FILE__) . "/exportExcel_v2.php";
include_once dirname(__FILE__) . "/security.php";
include_once dirname(__FILE__) . "/basics/session.php";
include_once dirname(__FILE__) . "/basics/perfiles.php";
include_once dirname(__FILE__) . "/basics/componentes.php";
include_once dirname(__FILE__) . "/basics/menu.php";
include_once dirname(__FILE__) . "/basics/empresas.php";
include_once dirname(__FILE__) . "/basics/configuraciones.php";
include_once dirname(__FILE__) . "/basics/modulos.php";
include_once dirname(__FILE__) . "/basics/terminales.php";
include_once dirname(__FILE__) . "/basics/permisos.php";
include_once dirname(__FILE__) . "/basics/permissions.php";
include_once dirname(__FILE__) . "/basics/usuarios.php";
include_once dirname(__FILE__) . "/basics/nw_drive.php";

//include_once dirname(__FILE__) . "/basics/componentes.php";
//include_once dirname(__FILE__) . "/printer/reportStatus.php";

include_once dirname(__FILE__) . "/basics/ciudades.php";
include_once dirname(__FILE__) . "/basics/nw_file_manager.php";
include_once dirname(__FILE__) . "/nw_admin_db/nw_admin_db.php";
include_once dirname(__FILE__) . "/nw_admin_db/nw_admin_table.php";
include_once dirname(__FILE__) . "/nw_admin_db/nw_process.php";

include_once dirname(__FILE__) . "/updater.inc.php";
include_once dirname(__FILE__) . "/basics/updaterNwp.nw.php";
include_once dirname(__FILE__) . "/updaters/sitca_updater.php";
include_once dirname(__FILE__) . "/updaters/movilmove_updater.php";
include_once dirname(__FILE__) . "/updaters/visitentry_updater.php";
include_once dirname(__FILE__) . "/updaters/sanitco_updater.php";
include_once dirname(__FILE__) . "/updaters/paginas_updater.php";
include_once dirname(__FILE__) . "/updaters/ringow_updater.php";
include_once dirname(__FILE__) . "/updaters/nwadmin_updater.php";

include_once dirname(__FILE__) . "/gadgets/cmi.inc.php";
include_once dirname(__FILE__) . "/cron/cron_manager.inc.php";
include_once dirname(__FILE__) . "/mobile.inc.php";
include_once dirname(__FILE__) . "/basics/nwproject.php";
include_once dirname(__FILE__) . "/basics/nwMaker.php";
include_once dirname(__FILE__) . "/basics/nwMakerApis.php";
include_once dirname(__FILE__) . "/basics/paises.php";
//include_once dirname(__FILE__) . "/basics/nwchat.php";
include_once dirname(__FILE__) . "/payments/nwpayments.nw.php";
include_once dirname(__FILE__) . "/nw_import_data/main.nw.php";
include_once dirname(__FILE__) . "/google.nw.php";
include_once dirname(__FILE__) . "/nw_exp/main.nw.php";
include_once dirname(__FILE__) . "/nw_sync/nw_sync.nw.php";
include_once dirname(__FILE__) . "/nw_server/nw_server.nw.php";
include_once dirname(__FILE__) . "/rpc/nwApi.inc.php";
include_once dirname(__FILE__) . "/payments/epayco/epayco-php-master/tests/NWPayEpayco.php";
include_once dirname(__FILE__) . "/tokenGenerator.inc.php";

//INTEGRATIONS
include_once dirname(__FILE__) . "/integrations/siigo.php";

class NWLib {

    public static function requireOnce($fileName) {
        if (!file_exists($fileName)) {
            throw new Exception("No such file or directory {$fileName}");
        }

        require_once $fileName;
    }

    public static function requireOnceModule($src) {
        global $cfg;
        $fileName = dirname(__FILE__) . "/{$src}";
//        $fileName = NWApp::nwlibPath() . "/{$src}";
        self::requireOnce($fileName);
        return;
    }

    public static function errorHandler($errno, $errstr, $errfile, $errline) {

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
        try {
            if (version_compare(phpversion(), '7.0.0', '<')) {
                debug_print_backtrace();
            }
        } catch (Exception $e) {
            
        }
        $log .= ob_get_contents();
        ob_end_clean();

        $log .= "\n";

        error_log($log, 0);

        self::error("errorHandler no: {$errno}, string: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function exceptionHandler($e) {
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

        self::error("no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function error($message, $op = array()) {

        $op["file"] = isset($op["file"]) ? $op["file"] : "";
        $op["line"] = isset($op["line"]) ? $op["line"] : "";
        $op["code"] = isset($op["code"]) ? $op["code"] : 100;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;

        //self::evalueError($message);

        $bt = debug_backtrace();
        $caller = array_shift($bt);

        $op["file"] = $caller['file'];
        $op["line"] = $caller['line'];

        $r = self::responseBase();

        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }

        if (!is_array($message)) {
            $message = html_entity_decode($message);
            $message = stripslashes($message);
            $message .= "\n";
        }
        ob_start();
        try {
            if (version_compare(phpversion(), '7.0.0', '<')) {
                debug_print_backtrace();
            }
        } catch (Exception $e) {
            
        }
        $trace = ob_get_contents();
        ob_end_clean();

        if (trim($op["file"]) != '') {
            $op["file"] = str_replace(".php", "", basename($op["file"]));
            $trace .= "<br /><b>\nfile:{$op["file"]}, line:{$op["line"]}</b>";
        }
        $id = 1;

        if ($op["code"] == 10) {
            $trace = "";
        }

        $message = htmlentities($message);

        $r["isError"] = true;

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "trace" => $trace, "origin" => 1);
        self::output(json_encode($r));
        exit;
    }

    private static function responseBase($error = false) {
        $r = array("jsonrpc" => 2.0, "id" => null);
        if ($error) {
            $r["error"] = null;
        }
        return $r;
    }

    public static function output($data) {
        $compress = null;

        if ($compress == "gzip") {
            header("Content-Type: text/html; ");
            header("Content-Encoding: gzip;");
            $data = gzcompress($data, 9);
            //$data = base64_encode($data);
            //header("Content-Length: " . strlen($data));
            print "\x1f\x8b\x08\x00\x00\x00\x00\x00";
            print $data;
            exit;
        } else {
            header("Content-Type: application/json; ");
            //header("Content-Length: " . strlen($data));
            //$data = base64_encode($data);
            //$data = chunk_split(base64_encode($data));
            print $data;
            exit;
        }
        exit;
    }
}
