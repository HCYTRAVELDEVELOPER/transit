<?php

//set_error_handler("NWDatabase::errorHandler", E_ALL | E_NOTICE | E_STRICT);
//set_exception_handler("NWDatabase::exceptionHandler");

require_once dirname(__FILE__) . '/../global/exception.php';
require_once dirname(__FILE__) . '/nwdbquery.inc.php';

class NWDatabase {

    const PGSQL = "PGSQL";
    const MYSQL = "MYSQL";
    const ORACLE = "ORACLE";
    const SQLSERVER = "SQLSERVER";

    private $m_driver = self::MYSQL;
    public $isInTransaction = false;
    var $m_hostName = '';
    var $m_instance = '';
    var $m_databaseName = '';
    var $m_userName = '';
    var $m_password = '';
    var $module;
    var $m_link = null;
    var $isNewer = false;
    var $oracleTransaction = false;
    var $m_port = "1521";
    var $character_set = 'AL32UTF8';

    function __construct($driver = self::PGSQL) {
        $this->setDriver($driver);
        $GLOBALS["nwdriver"] = $driver;
        if (defined('PHP_VERSION_ID')) {
            if (PHP_VERSION_ID > 50101) {
                $this->isNewer = true;
            }
        }
    }

    public function isNewer() {
        return $this->isNewer;
    }

    public function getOracleTransaction() {
        return $this->oracleTransaction;
    }

    public function setModule($module) {
        $this->module = $module;
    }

    public function getModule() {
        return $this->module;
    }

    public function setInstance($instance) {
        $this->m_instance = $instance;
    }

    public function setDriver($driver) {
        $GLOBALS["nwdriver"] = $driver;
        $this->m_driver = $driver;
    }

    public function getDriver() {
        return $this->m_driver;
    }

    public function getHost() {
        return $this->m_hostName;
    }

    public function setPort($port) {
        $this->m_port = $port;
    }

    public function getPort() {
        return $this->m_port;
    }

    public function driver() {
        return $this->m_driver;
    }

    public function setHostName($hostName) {
        $this->m_hostName = $hostName;
    }

    public function setDatabaseName($databaseName) {
        $this->m_databaseName = $databaseName;
    }

    public function getDatabaseName() {
        return $this->m_databaseName;
    }

    public function setUserName($userName) {
        $this->m_userName = $userName;
    }

    public function getUserName() {
        return $this->m_userName;
    }

    public function setPassword($password) {
        $this->m_password = $password;
    }

    public function getPassword() {
        return $this->m_password;
    }

    public function link() {
        return $this->m_link;
    }

    public function setCharacterSet() {
        return $this->character_set;
    }

    public function open_($isOutside = null) {
        switch ($this->m_driver) {
            case self::SQLSERVER:
                $port = "1433";
                if (self::getPort() != "1521") {
                    $port = self::getPort();
                }
                $serverName = "{$this->m_hostName}\{{$this->m_instance}, " . $port; //serverName\instanceName
                $connectionInfo = array("Database" => $this->m_databaseName, "UID" => $this->m_userName, "PWD" => $this->m_password);
                $this->m_link = @sqlsrv_connect($serverName, $connectionInfo);
                if (!$this->m_link) {
                    error_log(print_r(sqlsrv_errors(), true));
                    $rta = "No se conectó con la base de datos. Host: {$this->m_hostName} DBNAME: {$this->m_databaseName}. Error: " . print_r(sqlsrv_errors(), true);
                    $d = Array();
                    $d["code"] = 104;
                    self::error($rta, $d);
                    throw new NWException($rta);
                }
                break;

            case self::PGSQL:
                $application_name = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
                if (isset($_SESSION["usuario"])) {
                    $application_name = $application_name . ",usuario";
                    $str = str_replace(' ', '', $_SESSION["usuario"]);
                    $str = str_replace('/', '', $str);
                    $str = str_replace('*', '', $str);
                    $application_name = $application_name . ":" . $str;
                }
                $conn = "host={$this->m_hostName} dbname={$this->m_databaseName} user={$this->m_userName} password={$this->m_password} options='--application_name={$application_name}'";
//                $conn = "host={$this->m_hostName} dbname={$this->m_databaseName} user={$this->m_userName} password={$this->m_password}";
                //TODO: SE AGREGA PARA RECIBIR CONEXIONES SIMULTÁNEAS
//                $this->m_link = @pg_connect($conn);
                $this->m_link = @pg_connect($conn, PGSQL_CONNECT_FORCE_NEW);
                if (!$this->m_link) {
                    $error = "";
                    if (gettype($this->m_link) !== "boolean") {
                        $stat = pg_connection_status($this->m_link);
                    } else {
                        $stat = "N/A";
                    }
                    if ($stat === PGSQL_CONNECTION_OK) {
                        $error = pg_last_error();
                    }
                    $rta = "No se conectó con la base de datos. Host: {$this->m_hostName} DBNAME: {$this->m_databaseName}. Error: " . $error;
                    error_log(print_r($error == "" ? $rta : $error, true));
                    $d = Array();
                    $d["code"] = 104;
                    self::error($rta, $d);
                    throw new NWException($rta);
                }
                break;

            case self::ORACLE:
                $conn = "host={$this->m_hostName} dbname={$this->m_databaseName} user={$this->m_userName} password={$this->m_password}";
                $this->m_link = @oci_connect($this->m_userName, $this->m_password, "{$this->m_hostName}:{$this->m_port}/{$this->m_databaseName}", $this->character_set);
                if (!$this->m_link) {
                    $e = oci_error();
                    if ($e["code"] == 1017) {
                        if (!isset($isOutside)) {
                            if ($isOutside == null) {
                                if (class_exists("NWJSonRpcServer")) {
                                    NWJSonRpcServer::information("Usuario o clave inválida para la base de datos " . $this->m_databaseName . ", usuario: " . $this->m_userName);
                                }
                            }
                        }
                        $rta = "No se conectó con la base de datos. Host: {$this->m_hostName} DBNAME: {$this->m_databaseName} ERROR: {$e["message"]}";
                        error_log(print_r($e["message"], true));
                        $d = Array();
                        $d["code"] = 104;
                        self::error($rta, $d);
                        throw new NWException($rta);
                    }
                    error_log(print_r($e["message"], true));
                    $rta = "No se conectó con la base de datos. Host: {$this->m_hostName} DBNAME: {$this->m_databaseName} ERROR: {$e["message"]}";
                    $d = Array();
                    $d["code"] = 104;
                    self::error($rta, $d);
                    throw new NWException($rta);
                }
//                $s = oci_parse($this->m_link, "alter session set nls_date_format='YYYY-MM-DD'");
//                oci_execute($s);
                break;

            case self::MYSQL:
                if (!$this->isNewer) {
                    $port = "3306";
                    if ($this->m_port != "1521") {
                        $port = ":" . $this->m_port;
                    }
                    $this->m_link = @mysql_connect($this->m_hostName . $port, $this->m_userName, $this->m_password);
                    if (mysql_errno()) {
                        $rta = "No se conectó con la base de datos. OOOO Error: " . mysql_error();
                        error_log(print_r(mysql_error(), true));
                        $d = Array();
                        $d["code"] = 104;
                        self::error($rta, $d);
                        throw new NWException($rta);
                    }
                    if (version_compare(PHP_VERSION, '5.2.3', '>=')) {
                        mysql_set_charset('utf8', $this->m_link);
                    }
                    mysql_select_db($this->m_databaseName, $this->m_link);
                    @mysql_query("SET NAMES 'utf8'");
                } else {
                    if (function_exists('mysqli_connect')) {
                        $this->m_link = @mysqli_connect($this->m_hostName, $this->m_userName, $this->m_password, $this->m_databaseName);
                        if (mysqli_connect_errno()) {
                            error_log("MYSQLI error");
                            $rta = "No se conectó con la base de datos. Error: " . mysqli_connect_error();
                            $d = Array();
                            error_log(print_r(mysqli_connect_error(), true));
                            $d["code"] = 104;
                            self::error($rta, $d);
                            throw new NWException($rta);
                        }
                        mysqli_set_charset($this->m_link, 'utf8');
                        $this->isNewer = true;
                    } else {
                        $this->m_link = mysql_connect($this->m_hostName, $this->m_userName, $this->m_password);
                        if (mysql_errno()) {
                            $rta = "No se conectó con la base de datos. Error: " . mysql_error();
                            $d = Array();
                            error_log(print_r(mysql_error(), true));
                            $d["code"] = 104;
                            self::error($rta, $d);
                            throw new NWException($rta);
                        }
                        mysql_set_charset('utf8', $this->m_link);
                        mysql_select_db($this->m_databaseName, $this->m_link);
                        @mysql_query("SET NAMES 'utf8'");
                        $this->isNewer = false;
                    }
                }
                break;

            default:
                throw new Exception("Invalid database driver '{$this->m_driver}'");
                break;
        }

        //NWJSonRpcServer::setDbLink($this->m_link, $this->driver());


        if (!$this->m_link) {
            return false;
        }
        return true;
    }

    public function lastErrorText() {
        return "error conectando";
    }

    public function close() {
        $this->close_();
    }

    public function cancellAll() {
        switch ($this->m_driver) {
            case self::PGSQL:
                pg_cancel_query($this->m_link);
                break;
            case self::MYSQL:
                return;
                break;
        }
        return true;
    }

    public function close_() {
        switch ($this->m_driver) {
            case self::PGSQL:
                pg_close($this->m_link);
                break;
            case self::ORACLE:
                oci_close($this->m_link);
                break;
            case self::SQLSERVER:
                sqlsrv_close($this->m_link);
                break;
            case self::MYSQL:
                if ($this->isNewer) {
                    try {
                        mysqli_close($this->m_link);
                    } catch (Exception $e) {
                        
                    }
                } else {
                    mysql_close($this->m_link);
                }
                break;
        }

        return true;
    }

    public function exec($sql) {
        switch ($this->m_driver) {

            case self::PGSQL:
                return pg_query($this->link(), $sql);
            case self::SQLSERVER:
                return sqlsrv_query($this->link(), $sql);

            case self::ORACLE:
                if ($this->oracleTransaction === true) {
                    return oci_execute($this->link(), OCI_NO_AUTO_COMMIT);
                } else {
                    return oci_execute($this->link());
                }

            case self::MYSQL:
                if ($this->isNewer) {
                    return mysqli_query($this->link(), "START TRANSACTION");
                } else {
                    return mysql_query("START TRANSACTION", $this->link());
                }

            default:
                throw new Exception("Invalid database driver {$this->m_driver}. ");
        }
    }

    public function savePoint() {
        switch ($this->m_driver) {
            case self::PGSQL:
                $this->exec("SAVEPOINT nw_pointer;");
                break;
        }
    }

    public function rollbackSavePoint() {
        switch ($this->m_driver) {
            case self::PGSQL:
                $this->exec("ROLLBACK TO nw_pointer;");
                break;
        }
    }

    public function transaction() {
        switch ($this->m_driver) {
            case self::PGSQL:
                $this->exec("BEGIN");
                $this->isInTransaction = true;
                break;

            case self::ORACLE:
                $this->oracleTransaction = true;
                break;

            case self::MYSQL:
                $this->exec("START TRANSACTION");
                break;

            case self::SQLSERVER:
                sqlsrv_begin_transaction($this->m_link);
                break;
        }

        return true;
    }

    public function commit() {
        switch ($this->m_driver) {
            case self::PGSQL:
                $this->exec("COMMIT");
                $this->isInTransaction = false;
                break;
            case self::MYSQL:
                $this->exec("COMMIT");
                break;
            case self::ORACLE:
                oci_commit($this->link());
                break;
            case self::SQLSERVER:
                sqlsrv_commit($this->link());
                break;
        }
        return true;
    }

    public function rollback() {
        switch ($this->m_driver) {
            case self::PGSQL:
                $this->exec("ROLLBACK");
                break;
            case self::MYSQL:
                $this->exec("ROLLBACK");
                break;
            case self::ORACLE:
                oci_rollback($this->link());
                break;
            case self::SQLSERVER:
                sqlsrv_rollback($this->link());
                break;
        }
        return true;
    }

    public function lock($table, $mode = "") {
        switch ($this->m_driver) {
            case self::PGSQL:
                $this->exec("LOCK TABLE " . $table . " " . $mode);
                break;
            case self::MYSQL:
                return;
                break;
        }
        return true;
    }

    public static function &database($name = 'db') {
        $dbrta = $GLOBALS[$name];
//        $dbrta->open_();        
        return $dbrta;
    }

    public function query() {
        return new NWdbQuery($this);
    }

    public static function error($message, $op = array()) {
        $op["file"] = isset($op["file"]) ? $op["file"] : "";
        $op["line"] = isset($op["line"]) ? $op["line"] : "";
        $op["code"] = isset($op["code"]) ? $op["code"] : 100;
        $op["strip_tags"] = isset($op["strip_tags"]) ? $op["strip_tags"] : false;

        $bt = debug_backtrace();
        $caller = array_shift($bt);

        if ($op["file"] == "") {
            $op["file"] = $caller['file'];
        }
        if ($op["line"] == "") {
            $op["line"] = $caller['line'];
        }

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

        if ($op["code"] == 10) {
            $trace = "";
        }

        $r["error"] = array("code" => $op["code"], "message" => $message, "id" => $id, "trace" => $trace, "origin" => 1);
        header("Content-Type: text/html; ");
        print json_encode($r);
        exit;
    }

    public static function exceptionHandler($e) {
        $errfile = str_replace(".php", "", basename($e->getFile()));
        $errline = $e->getLine();
        $errno = $e->getCode();
        $errstr = "exceptionHandler " . $e->getMessage();
        self::error("no: {$errno}, type: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }

    public static function exceptionErrorHandler($errno, $errstr, $errfile, $errline) {
        throw new NWException($errstr, $errno, array('file' => $errfile, 'line' => $errline));
    }

    public static function errorHandler($errno, $errstr, $errfile, $errline) {
        $errfile = str_replace(".php", "", basename($errfile));
        self::error("errorHandler no: {$errno}, string: {$errstr}, file: {$errfile}, line: {$errline}");
        exit;
    }
}

?>