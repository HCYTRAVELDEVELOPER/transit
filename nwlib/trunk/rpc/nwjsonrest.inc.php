<?php

if (file_exists(dirname(__FILE__) . '/exception.php')) {
    require_once dirname(__FILE__) . '/exception.php';
} else {
    require_once dirname(__FILE__) . '/../global/exception.php';
}

include_once dirname(__FILE__) . '/../includes/php-jwt/vendor/autoload.php';

use \Firebase\JWT\JWT;

//error_reporting(-1);
if (function_exists('set_time_limit')) {
    set_time_limit(0);
}

//Detener el script cuando el usuario aborta la consulta
ignore_user_abort(false);

//ini_set("memory_limit", "900M");
ini_set("error_reporting", E_ALL | E_STRICT);
//ini_set("display_startup_errors",1);
//ini_set("display_errors", 1);
//EN PRUEBAS!
//register_shutdown_function("fatal_handler");

set_error_handler("NWJSonRpcServer::errorHandler", E_ALL | E_NOTICE | E_STRICT);
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
        }
    }
    exit;
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
    static $version = "0.0.0.8";

    public static function startApi($request = false) {

        self::autoExport();

        if ($request == false) {
            $request = self::request();
        }

        $request = str_replace('\n', "", $request);

        $call = json_decode($request, true);

//        TODO: validar cuando la URL no esté en HTTPS
//        if (!check_ssl()) {
//            $r["error"] = array("message" => "Ensure you are connection to HTTPS secure URL:");
//            self::output(json_encode($r));
//            return;
//        }

        if (!isset($call["method"])) {
            $r["error"] = array("message" => "User not autorized. Have to pass the method call:'{$request}'\n" . print_r($call, 1));
            self::output(json_encode($r), 401);
            return;
        }

        if (!isset($call["service"])) {
            $toCall = str_replace(".", "::", $call["method"]);
            if (strpos($toCall, "::") !== false) {
                $toCall = explode("::", $toCall);
            }
            if (isset($call["id"])) {
                self::$id = $call["id"];
            } else {
                self::$id = 1;
            }
        } else {
            $toCall = $call["service"] . "::" . $call["method"];
        }

        if (!is_callable($toCall)) {
            $op["id"] = 100;
            $op["origin"] = 1;
            self::error("Unknown class or method name {$call["service"]}:{$call["method"]}", $op);
        }

        if ($call["method"] == "createToken" && $call["service"] == "NWJSonRpcServer") {
            if (isset($call["params"])) {
                $pa = $call["params"][0];
            } else {
                $pa = "";
            }
            if (!isset($call["params"][0]["user"])) {
                $r["error"] = array("message" => "User not autorized. Check de user param.");
                self::output(json_encode($r), 401);
                return;
            }
            if (!isset($call["params"][0]["password"])) {
                $r["error"] = array("message" => "User not autorized. Check de password param.");
                self::output(json_encode($r), 401);
                return;
            }
            if (!isset($call["params"][0]["profile"])) {
                $r["error"] = array("message" => "User not autorized. Check de profile param.");
                self::output(json_encode($r), 401);
                return;
            }
            if (!isset($call["params"][0]["company"])) {
                $r["error"] = array("message" => "User not autorized. Check de company param.");
                self::output(json_encode($r), 401);
                return;
            }
            $result = call_user_func($toCall, $pa);
            session_destroy();
            self::response($call["method"], $result);
            return;
        }

        $key = "nwcaf2323";
        $token = null;
        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $matches = array();
            preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches);
            if (isset($matches[1])) {
                $token = $matches[1];
            }
        } else if (isset($headers['authorization'])) {
            $matches = array();
            preg_match('/Bearer\s(\S+)/', $headers['authorization'], $matches);
            if (isset($matches[1])) {
                $token = $matches[1];
            }
        }

        try {
            $decoded = JWT::decode($token, $key, array('HS256'));
        } catch (Exception $e) {
            $r["is_error"] = true;
            $r["code"] = 1008;
            $r["error"] = array("message" => $e->getMessage());
            self::output(json_encode($r), 400);
            return;
        }

        $decoded_array = (array) $decoded;

        // andresf: errors list
        // 1000: User not autorized. The parameter data isn't found in the decoded array.
        // 1001: User not autorized. The nbf (Not before, RFC 7519) parameter is missing.
        // 1002: User not autorized. The nbf (Not before, RFC 7519) parameter is missing.
        // 1003: The nbf ("Not before", RFC 7519) parameter is lower than the actual date. Please update your token.
        // 1004: User not autorized. Have to authenticate by token user. 
        // 1005: User not autorized. Have to authenticate by company user. 
        // 1006: User not autorized. Have to authenticate by user profile. 
        // 1007: User not autorized. The token user is incorrect. 
        // 1008: The token have some problem. 

        if (!isset($decoded_array["data"])) {
            $r["error"] = array("message" => "The parameter data isn't found in the decoded array. ");
            $r["is_error"] = true;
            $r["code"] = 1000;
            self::outputAndDecode($r, 400);
        }

        if (!isset($decoded_array["nbf"])) {
            $r["error"] = array("message" => "User not autorized. The nbf (Not before, RFC 7519) parameter is missing. ");
            $r["is_error"] = true;
            $r["code"] = 1002;
            self::outputAndDecode($r, 401);
        }

        if (strtotime("now") < $decoded_array["nbf"]) {
            $r["error"] = array("message" => "The nbf (Not before, RFC 7519) parameter is lower than the actual date. Please update your token. ");
            $r["is_error"] = true;
            $r["code"] = 1003;
            self::outputAndDecode($r, 401);
        }

        $decoded_array["data"] = (array) $decoded_array["data"];

        if (!isset($decoded_array["data"]["user"])) {
            $r["error"] = array("message" => "User not autorized. Have to authenticate by token user. ");
            $r["is_error"] = true;
            $r["code"] = 1004;
            self::outputAndDecode($r, 401);
        }

        if (!isset($decoded_array["data"]["company"])) {
            $r["error"] = array("message" => "User not autorized. Have to authenticate by company user. ");
            $r["is_error"] = true;
            $r["code"] = 1005;
            self::outputAndDecode($r, 401);
        }

        if (!isset($decoded_array["data"]["profile"])) {
            $r["error"] = array("message" => "User not autorized. Have to authenticate by user profile. ");
            $r["is_error"] = true;
            $r["code"] = 1006;
            self::outputAndDecode($r, 401);
        }

        $station = 0;
        $nom_station = 0;
        $city = 0;
        $name = "robot";

        if (isset($decoded_array["data"]["station"]) && isset($decoded_array["data"]["nom_station"]) && isset($decoded_array["data"]["city"])) {
            $station = $decoded_array["data"]["station"];
            $nom_station = $decoded_array["data"]["nom_station"];
            $city = $decoded_array["data"]["city"];
        }

        if (isset($decoded_array["data"]["name"])) {
            $name = $decoded_array["data"]["name"];
        }

        if (!self::autenticateByUser($decoded_array["data"]["user"], $decoded_array["data"]["company"], $decoded_array["data"]["profile"], $station, $nom_station, $city, $name)) {
            $r["error"] = array("message" => "User not autorized. The token user is incorrect. ");
            $r["is_error"] = true;
            $r["code"] = 1007;
            self::outputAndDecode($r, 400);
        }

        self::$callData = $call;

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

        if ($call["method"] == "cancelAll") {
            self::cancelAll();
            return;
        }

        if (isset($call["params"])) {
            $pa = $call["params"][0];
        } else {
            $pa = "";
        }

        $result = call_user_func($toCall, $pa, $call["server_data"]);

        self::response($call["method"], $result);
        return;
    }

    public static function check_ssl() {
        if (isset($_SERVER['HTTPS'])) {
            if ('on' == strtolower($_SERVER['HTTPS'])) {
                return true;
            } elseif ('1' == $_SERVER['HTTPS']) {
                return true;
            }
        }

        if (isset($_SERVER['SERVER_PORT']) && ( '443' == $_SERVER['SERVER_PORT'] )
        ) {
            return true;
        }

        return false;
    }

    public static function createToken($p) {

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "where a.usuario=:usuario";
        $sql = "select 
                a.*,
                a.perfil,
                b.nombre as nom_terminal,
                c.nombre as nom_perfil
               from usuarios a
               left join terminales b on (a.terminal=b.id)
               left join perfiles c on (a.perfil=c.id)
               {$where} ";
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $p["user"], true);
        if (!$ca->exec()) {
            $p["error_description"] = "Se a presentado un error en su usuario o clave. Error:" . $ca->lastErrorText();
            error_log($ca->lastErrorText());
            nw_security::setFailAccess($p, true);
            $r = array();
            $r["error"] = "Se a presentado un error en su usuario o clave";
            self::outputAndDecode($r);
            return false;
        }

        if ($ca->size() == 0) {
            $p["error_description"] = "Se a presentado un error en su usuario o clave. Error:" . $ca->lastErrorText();
            nw_security::setFailAccess($p);
            $r = array();
            $r["error"] = "Se a presentado un error en su usuario o clave";
            self::outputAndDecode($r);
            return false;
        }

        $ca->next();
        $r = $ca->assoc();

        $ca->clean();
        $sql = "select a.*, b.nombre as nom_terminal from usuarios_empresas a left join terminales b on (a.terminal=b.id) where a.usuario=:usuario and a.perfil=:perfil and a.empresa=:empresa";
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $p["user"], true);
        $ca->bindValue(":empresa", $p["company"], true);
        $ca->bindValue(":perfil", $p["profile"]);
        if (!$ca->exec()) {
            $p["error_description"] = "Se a presentado un error en la configuración de su perfil. Error:" . $ca->lastErrorText();
            error_log($ca->lastErrorText());
            nw_security::setFailAccess($p, true);
            $r = array();
            $r["error"] = "Se a presentado un error en la configuración de su perfil";
            self::outputAndDecode($r);
            return false;
        }
        if ($ca->size() == 0) {
            $profile = Array();
            $profile["terminal"] = "N/A";
            $profile["nom_terminal"] = "N/A";
        } else {
            $ca->next();
            $profile = $ca->assoc();
        }

        if ($r["estado"] !== "activo") {
            $p["error_description"] = "Su usuario no se encuentra activo, comúniquese con el administrador";
            nw_security::setFailAccess($p);
            $r = array();
            $r["error"] = "Su usuario no se encuentra activo, comúniquese con el administrador";
            self::outputAndDecode($r);
            return false;
        }

        if ($r["clave"] == md5($p["password"])) {
            $key = "nwcaf2323";
            $token = array(
                "iss" => "https://www.gruponw.com",
                "aud" => "https://www.gruponw.com",
                "iat" => strtotime("now"),
                "nbf" => strtotime("now"),
                "exp" => strtotime("+5 years"),
                'data' => [
                    'id' => 1,
                    'user' => $p["user"],
                    'profile' => $p["profile"],
                    'company' => $p["company"],
                    'station' => $profile["terminal"],
                    'nom_station' => $profile["nom_terminal"],
                    'city' => $r["ciudad"],
                    'name' => $r["nombre"]
                ]
            );
            $jwt = JWT::encode($token, $key);
            $r = Array();
            $r["token"] = $jwt;
            $r["expires"] = "5 years";
            $r["auth_type"] = "Bearer";
            self::output(json_encode($r));
        } else {
            $ra = array();
            $ra["message"] = "Error en su usuario o clave";
            self::output(json_encode($ra));
        }
    }

    public static function autenticateByUser($user, $company, $profile, $terminal = 0, $nom_terminal = 0, $city = 0, $name = "robot") {
        $_SESSION["nombre"] = $name;
        $_SESSION["usuario"] = $user;
        $_SESSION["empresa"] = $company;
        $_SESSION["perfil"] = $profile;
        $_SESSION["terminal"] = $terminal;
        $_SESSION["nom_terminal"] = $nom_terminal;
        $_SESSION["ciudad"] = $city;
        return true;
    }

    public static function process($request = false) {

        self::autoExport();

        if ($request == false) {
            $request = self::request();
        }

        $call = json_decode($request, true);

        self::$callData = $call;

        if (!isset($_SESSION["nwproject"])) {

            self::$isDebugMode = isset($call["server_data"]["debug"]) ? $call["server_data"]["debug"] : false;
            //SE ELIMINA LA COMPROBACIÓN DE CONTRASEÑAS POR EL PROBLEMA DE LOS PROXY

            if (!isset($call["server_data"]["key"])) {
                NWJSonRpcServer::information("Lo sentimos, no puede ingresar. Gracias.");
                return;
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

        if (!isset($call["method"])) {
            //$r["error"] = array("message" => "User not autorized. Have to pass the method call. JSON REQUEST: " . json_encode($request));
            $r["error"] = array("message" => "User not autorized. Have to pass the method call:'{$request}'\n" . print_r($call, 1));
            self::output(json_encode($r));
            return;
        }

        if (isset($call["sessionId"])) {
            $GLOBALS["sessionId"] = $call["sessionId"];
        }

        if (!isset($call["service"])) {
            $toCall = str_replace(".", "::", $call["method"]);
            if (strpos($toCall, "::") !== false) {
                $toCall = explode("::", $toCall);
            }
            if (isset($call["id"])) {
                self::$id = $call["id"];
            } else {
                self::$id = 1;
            }
        } else {
            $toCall = $call["service"] . "::" . $call["method"];
            self::$id = $call["id"];
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
        //$req = $call["params"][0];
        //TODO: se agrega segundo parámetro
        $result = call_user_func($toCall, json_decode($call["params"][0], true), $call["server_data"]);

        self::response($call["method"], $result);
        return;
    }

    public static function cancelAll() {
        ini_set("error_reporting", E_ALL | E_NOTICE | E_STRICT);
        header("Content-Type: text/html; ");
        error_log("Consulta abortada");

        error_log(connection_status());
        error_log(connection_aborted());

        ignore_user_abort(false);
        ob_end_clean();
        ob_start();
        ob_flush();
        flush();
        sleep(2);
        if (session_id()) {
            session_write_close();
        }

//        $db = new NWDatabase($cfg["dbDriver"]);
//        $status = pg_connection_status($db);
//        error_log("status");
//        error_log($status);
//        $db->cancellAll();

        print "";
        exit();
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
            "version" => self::$version,
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

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "origin" => 1);
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

        $r["isError"] = true;

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "trace" => $trace, "origin" => 1);
        self::output(json_encode($r), 400);
        exit;
    }

    public static function outputAndDecode($data, $code = null) {
        self::output(json_encode($data), $code);
    }

    public static function output($data, $code = null) {
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
            if (isset($code) && $code !== null) {
//                http_response_code($code);
            }
            header("Content-Type: application/json; ");
            //header("Content-Length: " . strlen($data));
            //$data = base64_encode($data);
            //$data = chunk_split(base64_encode($data));
            print $data;
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