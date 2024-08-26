<?php

if (file_exists(dirname(__FILE__) . '/exception.php')) {
    require_once dirname(__FILE__) . '/exception.php';
} else {
    require_once dirname(__FILE__) . '/../global/exception.php';
}

//ob_start();
//error_reporting(-1);
if (function_exists('set_time_limit')) {
    set_time_limit(0);
}

//Detener el script cuando el usuario aborta la consulta
ignore_user_abort(false);

//ini_set("memory_limit", "900M");
//ini_set("error_reporting", E_ALL | E_STRICT);
//ini_set("display_startup_errors",1); 
// TODO: (andresf) para que se encapsulen
ini_set("display_errors", 0);

//EN PRUEBAS!
register_shutdown_function("fatal_handler");

set_error_handler("NWJSonRpcServer::errorHandler", E_STRICT);
//set_error_handler("NWJSonRpcServer::errorHandler", E_ALL | E_NOTICE | E_STRICT);
//set_error_handler("NWJSonRpcServer::exceptionErrorHandler",E_ALL | E_NOTICE | E_STRICT);
set_exception_handler("NWJSonRpcServer::exceptionHandler");

function fatal_handler() {

    $errfile = "unknown file";
    $errstr = "shutdown";
    $errno = E_CORE_ERROR;
    $errline = 0;

    $error = error_get_last();

    if ($error !== NULL) {
        $errno = $error["type"];
        $errfile = $error["file"];
        $errline = $error["line"];
        $errstr = $error["message"];
    } else {
        $errno = "";
        $errfile = "";
        $errline = "";
        $errstr = "";
    }

    $rta = "errorHandler no: {$errno}, string: {$errstr}, file: {$errfile}, line: {$errline}";

    if ($errstr != "") {

        $last_error = error_get_last();

        if ($last_error['type'] === E_ERROR) {
            // fatal error
            NWJSonRpcServer::errorHandler(E_ERROR, $last_error['message'], $last_error['file'], $last_error['line']);
            master::sendPHPError($rta);
            exit;
        }
    }
}

if (!function_exists('json_decode')) {

    function json_decode($content, $assoc = false) {
        require_once dirname(__FILE__) . '/JSON.php';
        if ($assoc) {
            $json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
        } else {
            $json = new Services_JSON;
        }
        return $json->decode($content);
    }

}

if (!function_exists('json_encode')) {

    function json_encode($content) {
        require_once dirname(__FILE__) . '/JSON.php';
        $json = new Services_JSON;
        return $json->encode($content);
    }

}

class NWJSonRpcServer {

    static $id;
    static $isDebugMode;
    static $callerFunc;
    static $callData;

    public static function process($request = false) {

        self::autoExport();

        if ($request == false) {
            $request = self::request();
        }

        $call = json_decode($request, true);

        self::$callData = $call;

        if (isset($call["base64"]) && $call["base64"] === true) {
            $call["method"] = base64_decode($call["method"]);
            $call["params"][0] = utf8_encode(base64_decode($call["params"][0]));
        }

        if (!isset($call["method"])) {
            //$r["error"] = array("message" => "User not autorized. Have to pass the method call. JSON REQUEST: " . json_encode($request));
            $r["error"] = array("message" => "User not autorized. Have to pass the method call:'{$request}'\n" . print_r($call, 1));
            self::output(json_encode($r));
            return;
        }

        if (!isset($_SESSION["nwproject"])) {

            self::$isDebugMode = isset($call["server_data"]["debug"]) ? $call["server_data"]["debug"] : false;
            //SE ELIMINA LA COMPROBACIÓN DE CONTRASEÑAS POR EL PROBLEMA DE LOS PROXY

            if (isset($call["server_data"]["company"])) {
                if (isset($_SESSION["empresa"])) {
                    if ($_SESSION["empresa"] != "") {
                        if ($call["server_data"]["company"] != "") {
                            if ($call["server_data"]["company"] != null) {
                                if ($_SESSION["empresa"] != $call["server_data"]["company"]) {
                                    NWJSonRpcServer::information("La empresa del sistema difiere de la empresa de sesión del servidor. Actualize (F5) el navegador para continuar");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            if (!isset($call["server_data"]["key"])) {
//                NWJSonRpcServer::information("Lo sentimos, no puede ingresar. Gracias.");
//                return;
            } else {
                if (NWUtils::functionExists('base64_decode')) {
                    if (base64_decode($call["server_data"]["key"]) != "nwcaf2323") {
                        NWJSonRpcServer::error("Lo sentimos, no puede ingresar. Gracias.");
                        return;
                    }
                } else {
                    if (mb_convert_encoding($call["server_data"]["key"], "UTF-8", "BASE64") != "nwcaf2323") {
                        NWJSonRpcServer::error("Lo sentimos, no puede ingresar. Gracias.");
                        return;
                    }
                }
            }
        }

        $call["server_data"]["key"] = "";
        if ((isset($call["method"]) && $call["method"] == "wsdl") || isset($_GET["wsdl"])) {
            self::wsdl();
        }

        if (isset($call["server_data"]["class_caller"])) {
            self::$callerFunc = $call["server_data"]["class_caller"];
        }

        if (isset($call["sessionId"])) {
            $GLOBALS["sessionId"] = $call["sessionId"];
        }

        if (!isset($call["service"])) {
            $toCall = str_replace(".", "::", $call["method"]);
            if (strpos($toCall, "::") !== false) {
                $toCall = explode("::", $toCall);
            }
        } else {
            $toCall = $call["service"] . "::" . $call["method"];
        }

        if (isset($call["id"])) {
            self::$id = $call["id"];
        } else {
            self::$id = 1;
        }

        if (!is_callable($toCall)) {
            $op["id"] = 100;
            $op["origin"] = 1;
            self::error("Unknown class or method name {$call["service"]}:{$call["method"]}", $op);
        }
        //NWJSonRpcServer::information($call["service"]);
        if ($call["method"] == "cancelAll") {
            self::cancelAll();
            return;
        }
//        $params = null;
//        if (isset(json_decode($call["params"][0], true))) {
//            $params = json_decode($call["params"][0], true);
//        }
        $req = [];
        $decode = true;
        if (!isset($call["params"])) {
            $req = $call["data"];
            $decode = false;
        } else if (!isset($call["params"][0])) {
            $req = $call["params"];
        } else {
            $req = $call["params"][0];
        }
        if ($decode) {
            $req = json_decode($req, true);
        }
        //TODO: se agrega segundo parámetro
        $result = call_user_func($toCall, $req, $call["server_data"]);
//        $result = call_user_func($toCall, $req, true, $call["server_data"]);

        self::response($call["method"], $result);
        return;
    }

    public static function cancelAll() {
        header("Content-Type: text/html; ");
//        error_log("Consulta abortada");
        ignore_user_abort(false);
        ob_end_clean();
        ob_start();
        ob_flush();
        flush();
        sleep(2);
        if (session_id()) {
            session_write_close();
        }
//        print "";
//        die();
//        exit();
        return true;
    }

    public static function setCallerFunc($caller) {
        self::$callerFunc = $caller;
    }

    private static function responseBase($error = false) {
        $r = array("jsonrpc" => 2.0, "id" => null);
        if ($error) {
            $r["error"] = null;
        }
        return $r;
    }

    private static function response($method, $result) {
        $response = array(
            "jsonrpc" => 2.0,
            "id" => self::$id,
            "error" => null,
            "result" => $result
        );
        //$response["result"] = base64_encode(json_encode($response["result"]));
        $response = json_encode($response);
        self::output($response);
        exit;
    }

    public static function request() {
        if (isset($_POST["cmd"])) {
            $request = $_POST["cmd"];
        } else if (isset($_GET["cmd"])) {
            $request = stripslashes($_GET["cmd"]);
        } else {
            $request = file_get_contents('php://input');
            //$request = md5($request);
            //$request = json_encode($_GET);
        }

        if (trim($request) != "" && $request[0] != "{") {
            try {
                $request = @gzuncompress($request);
            } catch (Exception $exc) {
                
            }
        }

        $request = str_replace("\n", "\\n", $request);
        $request = str_replace("\r", "", $request);
        return $request;
    }

    public static function setOption($k, $v) {
        if (!isset($GLOBALS["NWJSonRpcServer"])) {
            $GLOBALS["NWJSonRpcServer"] = array();
        }

        $GLOBALS["NWJSonRpcServer"][$k] = $v;
    }

    public static function option($k, $default = '') {
        if (isset($GLOBALS["NWJSonRpcServer"][$k])) {
            return $GLOBALS["NWJSonRpcServer"][$k];
        }
        return $default;
    }

    public static function options() {
        if (!isset($GLOBALS["NWJSonRpcServer"])) {
            return array();
        }

        return $GLOBALS["NWJSonRpcServer"];
    }

    private static function autoExport() {
        $trace = debug_backtrace();
        $call = $trace[count($trace) - 1];
        $lines = file($call["file"]);

        $exportTag = "//@export";
        $paramsTag = "//@params";
        $returnsTag = "//@returns";

        for ($i = 0; $i < count($lines); $i++) {
            $l = trim($lines[$i]);

            if (substr($l, 0, strlen($exportTag)) == $exportTag) {
                $method = preg_split("/[\s]+/", $l);
                $method = $method[1];

                $args = trim($lines[$i + 1]);
                $args = preg_split("/[\s]+/", $args);
                $args = $args[1];

                $returns = trim($lines[$i + 2]);
                $returns = preg_split("/[\s]+/", $returns);
                $returns = $returns[1];

                self::export($method, $args, $returns);
            }
        }

        return;
    }

    public static function setDbLink($link, $driver) {
        $GLOBALS["link"] = $link;
    }

    public static function wsdl() {
        global $jsonRpcExports;
        if (!is_array($jsonRpcExports))
            $jsonRpcExports = array();

        echo "<html><head><title>wsdl</title></head><body>";
        echo "<h1>Exported methods</h1><br/>";

        foreach ($jsonRpcExports as $k => $v) {
            $params = "";
            foreach ($v["params"] as $v2) {
                $params .= "{$v2["name"]} {$v2["type"]},";
            }
            $params = trim($params) == '' ? "" : substr($params, 0, -1);

            $returns = $v["returns"];

            echo "{$k}({$params}) returns $returns <br/>";
        }

        echo "</body></html>";
        exit;
    }

    public static function checkExported($func) {

        global $jsonRpcExports;

        if (!is_array($jsonRpcExports))
            $jsonRpcExports = array();

        if (in_array($func, array_keys($jsonRpcExports)))
            return true;

        self::error("Unknown method {$func}");
        return;
    }

    public static function export($func, $params = '', $returns = '') {
        global $jsonRpcExports;
        if (!is_array($jsonRpcExports))
            $jsonRpcExports = array();

        $tmp = explode(",", $params);
        $params = array();
        foreach ($tmp as $r) {
            $tmp2 = explode(":", $r);
            if ($tmp2[0] == "void") {
                continue;
            }

            $params[] = array("name" => $tmp2[0], "type" => $tmp2[1]);
        }

        $jsonRpcExports[$func] = array(
            'params' => $params,
            'returns' => $returns
        );
        return;
    }

    public static function checkParams($required, $params) {
        $required = explode(",", $required);
        $params = array_keys($params);

        $r = array_diff($required, $params);
        if (count($r) == 0)
            return true;

        $trace = debug_backtrace();
        $func = $trace[count($trace) - 2];

        $funcName = $func["args"][0];

        //if is class method
        if (is_array($funcName))
            $funcName = $funcName[0] . "." . $funcName[1];

        //print_r($func);

        self::error("Invalid arguments for function {$funcName}, unknown or not found argument(s) " . implode(",", $r));
        return $r;
    }

    public static function checkParamOrError($p, $name, $label) {

        if (!isset($p["name"])) {
            self::error("Missing argumen {$label} field name ({$name})");
            exit;
        }

        return true;
    }

    public function isError($result) {
        if (isset($result["__error__"]))
            return true;
        return false;
    }

    public static function information($message, $op = array()) {
        $op["code"] = isset($op["code"]) ? $op["code"] : 102;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;
        $op["strip_slashes"] = isset($op["strip_slashes"]) ? $op["strip_slashes"] : false;

        $r = self::responseBase();

        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }
        if ($op["strip_slashes"] === true) {
            $message = stripslashes(html_entity_decode($message));
        }

        $id = 1;
        $id = self::$id != "" ? self::$id : $id;

        $r["id"] = $id;

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $op["code"], "origin" => 1);
        self::output(json_encode($r));
        exit;
    }

    public static function console($message, $op = array()) {
        $op["code"] = isset($op["code"]) ? $op["code"] : 103;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;

        $r = self::responseBase();

        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }

        $id = 1;
        $id = self::$id != "" ? self::$id : $id;

        if (is_string($message)) {
            $message = htmlentities($message);
        }

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "origin" => 1);
        self::output(json_encode($r));
        exit;
    }

    public static function serverToClient($message, $op = array()) {
        $op["file"] = isset($op["file"]) ? $op["file"] : "";
        $op["line"] = isset($op["line"]) ? $op["line"] : "";
        $op["code"] = isset($op["code"]) ? $op["code"] : 101;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;

        $bt = debug_backtrace();
        $caller = array_shift($bt);

        if ($op["file"] == "") {
            $op["file"] = $caller['file'];
        }
        if ($op["line"] == "") {
            $op["line"] = $caller['line'];
        }

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
        debug_print_backtrace();
        $trace = ob_get_contents();
        ob_end_clean();

        if (trim($op["file"]) != '') {
            $op["file"] = str_replace(".php", "", basename($op["file"]));
            $trace .= "<br /><b>\nfile:{$op["file"]}, line:{$op["line"]}</b>";
        }

        $id = 1;
        if (self::$id != "") {
            $id = self::$id;
        }

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "trace" => $trace, "origin" => 1);
        self::output(json_encode($r));
        exit;
    }

    public static function homologarError($error) {
        $error = str_replace("character", "", $error);
        $error = str_replace("varying", "TEXTO", $error);
        return $error;
    }

    public static function evalueError($message, $op = array()) {
        if (preg_match('/duplicate/i', $message)) {
            NWJSonRpcServer::information("Hay un campo duplicado en el ingreso. Verifique por favor.");
            return;
        }
        $messageArray = explode("::", $message);
        if (preg_match('/demasiado/i', $messageArray[0])) {
            if (preg_match('/valor/i', $messageArray[0])) {
                //NWJSonRpcServer::information("El valor es demasiado largo para el campo");
                NWJSonRpcServer::information(homologarError($messageArray[0]));
                return;
            }
        }
    }

    public static function error($message, $op = array()) {

        $op["file"] = isset($op["file"]) ? $op["file"] : "";
        $op["line"] = isset($op["line"]) ? $op["line"] : "";
        $op["code"] = isset($op["code"]) ? $op["code"] : 100;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;

        $trace = "";
        $bt = debug_backtrace();
        $caller = array_shift($bt);

        if ($op["file"] == "") {
            $op["file"] = $caller['file'];
        }
        if ($op["line"] == "") {
            $op["line"] = $caller['line'];
        }

        $r = self::responseBase();

        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }

        if (!is_array($message)) {
            $message = html_entity_decode($message);
            $message = stripslashes($message);
            $message .= "\n";
        }

        if (trim($op["file"]) != '') {
            //$op["file"] = str_replace(".php", "", basename($op["file"]));
            $trace .= "<br /><b>\nfile:{$op["file"]}, line:{$op["line"]}</b>";
        }
        $id = 1;
        if (self::$id != "") {
            $id = self::$id;
        }

        if ($op["code"] == 10) {
            $trace = "";
        }

        if (isset(self::$callerFunc)) {
            $trace .= "<b>" . (string) self::$callerFunc . "</b>";
        }

        if (isset(self::$callData)) {
            try {
                self::$callData = @json_encode(self::$callData);
                $trace .= "::JSON DATA: " . self::$callData;
            } catch (Exception $e) {
                
            }
        }

        $message = htmlentities($message);

        if (isset($op["code"]) && $op["code"] !== 10) {
            error_log(json_encode($message));
        }

        $debug = json_encode(debug_backtrace());
        $message .= $debug;

        $requestHeaders = "N/A";
        if (NWUtils::functionExists('base64_decode')) {
            $requestHeaders = apache_request_headers();
        }
        $message .= " <br /><br /><br />:: HEADERS: " . json_encode($requestHeaders);

//        $r["error"] = array("code" => $op["code"], "message" => "message", "id" => $id, "trace" => "trace", "origin" => 1);
        $r["error"] = array("valid" => false, "code" => $op["code"], "error_message" => $message, "message" => $message, "id" => $id, "trace" => $trace, "origin" => 1);
        self::output(json_encode($r));
        exit;
    }

    public static function output($data) {
        $op = self::options();
        if (isset($op["delay"])) {
            sleep($op["delay"]);
        }
        $compress = self::option("compress", false);

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
            if (!headers_sent()) {
                header("Content-Type: application/json; ");
            }
//            header("Content-Type: text/html; ");
            //header("Content-Length: " . strlen($data));
            //$data = base64_encode($data);
            //$data = chunk_split(base64_encode($data));
            $buffer = str_replace(array("\r", "\n"), '', $data);
            print $buffer;
//            print json_encode($data);
            exit;
        }
        exit;
    }

    public static function logMessage($message) {
        //file_put_contents("/tmp/planner.log",date("Y-m-d h:i:s")."\t{$message}\n",FILE_APPEND );
        return;
    }

    public static function sucess($message = '', $p = array()) {
        $r = self::responseBase();

        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;
        if ($op["strip_tags"] === true) {
            $message = strip_tags($message);
        }

        $message = html_entity_decode($message);
        $message = stripslashes($message);

        $p["message"] = $message;
        $r["result"] = $p;

        self::output(json_encode($r));
        exit;
    }

    public static function exceptionHandler($e) {
        if (0 === error_reporting()) {
            return false;
        }

        $errfile = str_replace(".php", "", basename($e->getFile()));
        $errline = $e->getLine();
        $errno = $e->getCode();
        $errstr = "-------NWExceptionHandler: " . $e->getMessage();

        $errstr = str_replace("\\n", " ", $errstr);

        $date = date('d.m.Y h:i:s');
        $log = "Error text: " . "no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}" . "   \n  Date:  " . $date . "\n";
        if (isset($_SESSION["usuario"])) {
            $log .= $log . " User:  " . $_SESSION["usuario"] . "\n";
        }

        $debug = json_encode(debug_backtrace());

        $log .= $debug;

        $log .= "\n";

        error_log($log, 0);

        self::error("no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function exceptionErrorHandler($errno, $errstr, $errfile, $errline) {
        throw new NWException($errstr, $errno, array('file' => $errfile, 'line' => $errline));
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

        $log .= "PHP " . PHP_VERSION . " (" . PHP_OS . ")<br />\n";

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

        self::error($log);
//        self::error("errorHandler no: {$errno}, string: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function exception($message, $code = -1) {
        throw new NWException($message);
    }
}

class NWJSonRpcClient {

    var $url = '';

    function __construct($url) {
        $this->setUrl($url);
    }

    function setUrl($url) {
        $this->url = $url;
    }

    public function execMethod($method, $params = array(), $op = array()) {
        return self::call($method, $params, $op);
    }

    public function call($method, $params = array(), $op = array()) {
        $op["raw"] = isset($op["raw"]) ? $op["raw"] : false;
        $op["debug"] = isset($op["debug"]) ? $op["debug"] : false;

        $request = json_encode(array('version' => 2.0, 'method' => $method, 'params' => $params));

        $context = stream_context_create(array('http' => array(
                'method' => "POST",
                'header' => "Content-Type: application/json",
                'content' => $request
        )));

        $result = file_get_contents($this->url, false, $context);

        if ($op["debug"]) {
            echo "RPC SERVER: {$this->url}<br/>";
            echo "RPC PARAMS: " . $request . "<br/>";
            echo "RPC RESULT: {$result}<br/>";
        }

        if ($op["raw"] == true)
            return $result;

        $jsonResult = json_decode($result, true);
        if (trim($result) == "") {
            throw new Exception("Failed processing returned data\nresult='{$result}'\n");
        }

        return $jsonResult;
    }
}

?>