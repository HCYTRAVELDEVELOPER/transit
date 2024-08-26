<?php     

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class nws {

    public static function validateFields($p, $fields) {
        $rta = Array();
        $rta["exists"] = true;
        foreach ($fields as $value) {
            if (!isset($p[$value])) {
                $rta["exists"] = false;
                $rta["key"] = $value;
            }
        }
        return $rta;
    }

    public static function response($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        if ($p["token"] != "") {
            $where .= " and (lower(id::text) like lower('%{$p["token"]}%') 
                        or lower(nombre::text) like lower('%{$p["token"]}%')
                        or lower(descripcion::text) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("nw_no_exists", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function exceptionHandler($e) {
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
        
        nw_sender::sendDireccionEmail($log, "Error WS Huawei-CLARO");

        return new soapval("return", "xsd:string", "no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function exceptionErrorHandler($errno, $errstr, $errfile, $errline) {
        throw new NWException($errstr, $errno, array('file' => $errfile, 'line' => $errline));
    }

    public static function errorHandler($errno, $errstr, $errfile, $errline) {
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
        
        nw_sender::sendDireccionEmail($log, "Error WS Huawei-CLARO");

        return new soapval("errorHandler no: {$errno}, string: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function exception($message, $code = -1) {
        throw new NWException($message);
    }

}