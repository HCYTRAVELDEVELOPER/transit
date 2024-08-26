<?php

require_once dirname(__FILE__) . '/../global/exception.php';

class NWDbQuery {

    var $m_db;
    var $v_rs;
    var $v_at;
    var $v_preparedQuery;
    var $v_boundValues;
    var $v_boundTypes;
    var $v_lastErrorText;
    var $v_lastErrorCode;
    var $nomPag;
    var $cleanHtml;
    var $action;
    var $cleanNonAscii = false;
    var $cleanNonAsciiPostgres = false;
    var $isNewer = false;
    var $__escapeShelArgs;
    var $encrypt;
    var $__haveAdvancedSecurity = true;
    var $register;
    var $isAsyncConnection = false;
    var $oracleConvert = null;
    var $pregMatchDuplicate = true;
    var $htmlentities = false;
    var $showLogQuerys = false;
    var $saveInRegistroSelect = false;

    function __construct(&$db) {
        $this->m_db = $db;
        $this->isNewer = $db->isNewer();
        $this->cleanHtml = true;
        $this->__escapeShelArgs = false;
        $this->register = true;
        self::clear();
        return;
    }

    public function setSaveInRegistroSelect($bool) {
        $this->saveInRegistroSelect = $bool;
    }

    public function setHtmlentities($bool) {
        $this->htmlentities = $bool;
    }

    public function setPregMatchDuplicate($bool) {
        $this->pregMatchDuplicate = $bool;
    }

    public function setCleanHtml($bool = false) {
        $this->cleanHtml = $bool;
    }

    public function setOracleConvert($bool) {
        $this->oracleConvert = $bool;
    }

    private function setRegistro($ca) {

        $table = $ca->getNomTable();
        $action = $ca->getAction();

        if ($action == "EXECPAGE" || $action == "SELECT" || $action == "CONSULTA GENERAL") {
            if (!$this->saveInRegistroSelect) {
                return;
            }
        }

        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : @exec("hostname");

        $db = $this->m_db;
        if ($db->isInTransaction == true) {
            $db->savePoint();
        }
//        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $cb->register = false;
        $cb->prepareInsert("nw_registro", "modulo,tabla,query,observaciones,accion,usuario,fecha,empresa,host");
        $cb->bindValue(":modulo", $db->getModule());
        $cb->bindValue(":accion", isset($action) ? $action : "");
        $cb->bindValue(":tabla", isset($table) ? $table : "");
        $cb->bindValue(":query", str_replace("'", "$", $ca->preparedQuery()));
        $cb->bindValue(":observaciones", "");
        $cb->bindValue(":usuario", isset($_SESSION["usuario"]) ? $_SESSION["usuario"] : "");
        $cb->bindValue(":host", $hostname);
        if ($db->getDriver() == "ORACLE") {
            $cb->bindValue(":fecha", NWUtils::getDate($db), false);
        } else {
            $cb->bindValue(":fecha", date("Y-m-d H:i:s"), true);
        }
        $empresa = 0;
        if (isset($_SESSION)) {
            if (isset($_SESSION["empresa"])) {
                $empresa = (int) $_SESSION["empresa"];
            }
        }
        $cb->bindValue(":empresa", $empresa);
        if (!$cb->exec()) {
            if ($db->isInTransaction == true) {
                $db->rollbackSavePoint();
            }
            error_log($cb->lastErrorText());
        }
        return true;
    }

    public function flush($bool = false) {
        if ($bool) {
            $r = Array();
        } else {
            $r = false;
        }
        if ($this->size() > 0) {
            $this->next();
            $r = $this->assoc();
        }
        return $r;
    }

    public static function getNextId($ca, $table, $company = true) {
        $where = "";
        $si = "";
        if (isset($company) && $company) {
            session::check();
            $si = session::info();
            $where = "empresa=:empresa";
        }
        $ca->prepareSelect($table, "max(id) as id", $where);
        if (isset($company) && $company) {
            $ca->bindValue(":empresa", $si["empresa"]);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $id = 1;
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            $id = $r["id"] + 1;
        }
        return $id;
    }

    public function execPage($p) {

        $export = false;
        $query = false;

        $this->isAsyncConnection = false;

        if (isset($p["filters"]["export"])) {
            if ($p["filters"]["export"] == true) {
                $export = true;
            }
        }
        if (isset($p["filters"]["part"])) {
            NWJSonRpcServer::setCallerFunc($p["filters"]["part"]);
        }

        $this->action = "EXECPAGE";

        $page = isset($p["filters"]["page"]) ? $p["filters"]["page"] : 1;
        $count = isset($p["filters"]["count"]) ? $p["filters"]["count"] : 1000;
        $sort = "";
        if (isset($p["filters"]["sort"])) {
            if ($p["filters"]["sort"] != "") {
                if ($p["filters"]["sort"] != "") {
                    $sort = "order by ";
                    $sort .= $p["filters"]["sort"];
                    $sort .= " asc ";
                }
            }
        }

        if ($page < 1) {
            $page = 1;
            //throw new NWException("Invalid page number {$page}");
        }

        $sql = $this->preparedQuery();

        if (isset($p["filters"]["getQuery"])) {
            if ($p["filters"]["getQuery"] == true) {
                $query = $this->v_preparedQuery;
            }
        }

        $limit = $count;
        $offset = ( $page - 1 ) * $count;

        //ANDRESF: se quita para que no cree instancias adicionales de $ca
        //$ca = new NWDbQuery($this->m_db);
        $this->clear();
        if ($export === true) {
            $recordCount = 0;
            $pageCount = 0;
        } else {
            switch ($this->m_db->driver()) {
                case NWDatabase::PGSQL:
                    $escaped = pg_escape_string($this->m_db->link(), $sql);
                    $this->prepare("select count(*) as records from ({$sql}) execPage");
                    if (!$this->exec()) {
                        NWJSonRpcServer::error($this->lastErrorText());
                        return false;
                    }

                    $this->next();
                    $r = $this->assoc();

                    $recordCount = $r["records"];
                    $pageCount = ceil($recordCount / $count);
                    $this->clear();
                    $this->prepare("select execPage.* from ({$sql}) execPage {$sort} limit {$limit} offset {$offset}");

                    if (!$this->exec()) {
                        NWJSonRpcServer::error($this->lastErrorText());
                        return false;
                    }
                    break;
                case NWDatabase::MYSQL:
                    $this->prepare("select count(*) as records from ({$sql}) execPage");
                    if (!$this->exec()) {
                        if (class_exists('NWJSonRpcServer')) {
                            NWJSonRpcServer::error($this->lastErrorText());
                        } else {
                            master::sendPHPError($this->lastErrorText());
                        }
                        return false;
                    }
                    $this->next();
                    $r = $this->assoc();
                    $recordCount = $r["records"];
                    $pageCount = ceil($recordCount / $count);
                    $this->clear();
                    $this->prepare("select execPage.* from ({$sql}) execPage {$sort} limit {$limit} offset {$offset}");
                    if (!$this->exec()) {
                        if (class_exists('NWJSonRpcServer')) {
                            NWJSonRpcServer::error($this->lastErrorText());
                        } else {
                            master::sendPHPError($this->lastErrorText());
                        }
                        return false;
                    }
                    break;
                case NWDatabase::SQLSERVER:
                    $this->prepare("select count(*) as records from ({$sql}) execPage");
                    if (!$this->exec()) {
                        NWJSonRpcServer::error($this->lastErrorText());
                        return false;
                    }
                    $this->next();
                    $r = $this->assoc();
                    $recordCount = $r["records"];
                    $pageCount = ceil($recordCount / $count);
                    $this->clear();
//                    error_log($sql);
                    $this->prepare("select execPage.* from ({$sql}) execPage {$sort} limit {$limit} offset {$offset}");
                    if (!$this->exec()) {
                        NWJSonRpcServer::error($this->lastErrorText());
                        return false;
                    }
                    break;
                case NWDatabase::ORACLE:
                    $this->prepare("select count(*) as records from ({$sql}) execPage");
                    if (!$this->exec()) {
                        NWJSonRpcServer::error($this->lastErrorText());
                        return false;
                    }
                    $ra = $this->assocAll();
                    $r = $ra[0];
                    $recordCount = $r["records"];
                    $pageCount = ceil($recordCount / $count);
                    $this->clear();
                    $this->prepare("select * 
                                    from ( select a.*, rownum rnum from 
                                    ({$sql}) a 
                                    {$sort} 
                                    where rownum <= {$limit} )
                                    where rnum >= {$offset} ");
                    if (!$this->exec()) {
                        NWJSonRpcServer::error($this->lastErrorText());
                        return false;
                    }
                    break;
            }
//            $recordCount = 0;
//            $pageCount = 0;
        }

        $records = $this->assocAll();

        $exportId = "";
        $exportKey = "";

        $this->isAsyncConnection = false;

        if ($export === true) {

            $noExport = false;
            $export = false;
            $rowHeight = false;
            $sort = '';
            $special = false;
            $boolEnc = false;
            $maxRowsEnc = false;
            if (isset($p["filters"]["special"])) {
                $special = $p["filters"]["special"];
            }
            if (isset($p["filters"]["noExport"])) {
                $noExport = $p["filters"]["noExport"];
            }
            if (isset($p["filters"]["rowHeight"])) {
                $rowHeight = $p["filters"]["rowHeight"];
            }
            if (isset($p["filters"]["exportCols"])) {
                $export = $p["filters"]["exportCols"];
            }
            $arrSort = Array();
            if (isset($p["filters"]["sorted"])) {
                $arrSort["sorted"] = $p["filters"]["sorted"];
            }
            if (isset($p["filters"]["sorted_name"])) {
                $arrSort["sorted_name"] = $p["filters"]["sorted_name"];
            }
            if (isset($p["filters"]["sorted_method"])) {
                $arrSort["sorted_method"] = $p["filters"]["sorted_method"];
            }
            if (isset($p["filters"]["subfilters"])) {
                $arrSort["subfilters"] = $p["filters"]["subfilters"];
            }
            if (isset($p["encBoolean"])) {
                $boolEnc = $p["encBoolean"];
            }
            if (isset($p["maxEncRows"])) {
                $maxRowsEnc = $p["maxEncRows"];
            }
            $part = "";
            if (isset($p["filters"]["part"])) {
                $part = $p["filters"]["part"];
            } else if (isset($p["table"])) {
                $part = $p["table"];
            }

            $d = exportExcel::exportXLS2007($records, $part, $noExport, $export, $rowHeight, $arrSort, $special, $boolEnc, $maxRowsEnc);
            $exportId = $d["id"];
            $exportKey = $d["key"];
            $records = Array();
        }

        return array(
            "getQuery" => $query,
            "currentPage" => $page,
            "pageCount" => $pageCount,
            "recordCount" => $recordCount,
            "recordsPerPage" => $count,
            "exportId" => $exportId,
            "exportKey" => $exportKey,
            "records" => $records
        );
    }

    public function cleanNonAscii($bool) {
        $this->cleanNonAscii = $bool;
    }

    public function cleanNonAsciiPostgres($bool) {
        $this->cleanNonAsciiPostgres = $bool;
    }

    public function lastErrorCode() {
        return $this->v_lastErrorCode;
    }

    public function clean() {
        $this->clear();
    }

    public function clear() {
        $this->v_lastErrorText = 'no error NDdbQuery';
        $this->v_preparedQuery = '';
        $this->v_at = -1;
        $this->v_boundValues = array();
        $this->v_boundTypes = array();
        $this->v_rs = null;
    }

    public function lastErrorText() {
        return $this->v_lastErrorText;
    }

    private function __replaceFields($c) {
        if (trim(strtolower($c[1])) == "in (") {
            return " in ( _ $c[2] _ ) ";
        }return
                "{$c[1]}'{$c[2]}'{$c[3]}";
    }

    public function preparedQuery() {
        $sql = $this->v_preparedQuery;

        if (NWUtils::functionExists('base64_encode')) {
            $serializedBoundValues = base64_encode(serialize($this->v_boundValues));
        } else {
            $serializedBoundValues = mb_convert_encoding(serialize($this->v_boundValues), "BASE64", "auto");
        }

        $boundValues = $this->v_boundValues;

        if (NWUtils::functionExists('base64_decode')) {
            $sql = preg_replace_callback("/(\\s+in\\s+\\(\\s*)(:[a-zA-Z_]+)(\\s*\\)\\s+\\\$?)/", function ($c) use ($serializedBoundValues) {
                $fields = unserialize(base64_decode($serializedBoundValues));
                return " in ( {$fields[$c[2]]} ) ";
            }, $sql);
            //DEPRECATED PHP 7.2 ANDRESF
//            $sql = preg_replace_callback("/(\\s+in\\s+\\(\\s*)(:[a-zA-Z_]+)(\\s*\\)\\s+\\\$?)/", create_function(
//                            '$c', '$fields=unserialize( base64_decode( "' . $serializedBoundValues . '" ) );'
//                            . 'return " in ( {$fields[$c[2]]} ) ";'
//                    ), $sql);
        } else {
            $sql = preg_replace_callback("/(\\s+in\\s+\\(\\s*)(:[a-zA-Z_]+)(\\s*\\)\\s+\\\$?)/", function ($c) use ($serializedBoundValues) {
                $fields = unserialize(mb_convert_encoding($serializedBoundValues, "auto", "BASE64"));
                return " in ( {$fields[$c[2]]})";
            }, $sql);
        }

        if (NWUtils::functionExists('base64_decode')) {
            $sql = preg_replace_callback("/(%)(:[a-zA-Z_]+)(%)/", function ($c) use ($serializedBoundValues) {
                $fields = unserialize(base64_decode($serializedBoundValues));
                return "{$c[1]}{$fields[$c[2]]}{$c[3]}";
            }, $sql);
//            $sql = preg_replace_callback("/(%)(:[a-zA-Z_]+)(%)/", create_function(
//                            '$c', '$fields=unserialize( base64_decode("' . $serializedBoundValues . '" ) );'
//                            . 'return "{$c[1]}{$fields[$c[2]]}{$c[3]}";'
//                    ), $sql);
        } else {
            $sql = preg_replace_callback("/(%)(:[a-zA-Z_]+)(%)/", function ($c) use ($serializedBoundValues) {
                $fields = unserialize(mb_convert_encoding($serializedBoundValues, "auto", "BASE64"));
                return "{$c[1]}{$fields[$c[2]]}{$c[3]}";
            }, $sql);
        }


        $boundValues = $this->v_boundValues;
        foreach ($this->v_boundTypes as $k => $v) {

            if (is_null($this->v_boundValues[$k])) {
                $boundValues[$k] = "null";
                continue;
            }

            if ($v === true) {
                $boundValues[$k] = "'{$this->v_boundValues[$k]}'";
            }
        }
        if (NWUtils::functionExists('base64_encode')) {
            $serializedBoundValues = base64_encode(serialize($boundValues));
        } else {
            $serializedBoundValues = mb_convert_encoding(serialize($boundValues), "BASE64", "auto");
        }

        //TODO: MUCHO CUIDADO CON 0-9 ([a-zA-Z_0-9])
        //TODO: match inicial: /(?<!:)(:[a-zA-Z_]+)/
        //TODO: match con números: /(?<!:)(:[a-zA-Z_0-9]+)/
        //PRIMERA MEJOR OPCIÓN: ((\s):{1}([a-zA-Z0-9]))
        //MEJOR OPCIÓN: (:{1}([a-zA-Z_])+([a-zA-Z0-9]?)+)
        //ULTIMA MEJOR OPCION: (?<![0-9])(?<!:)(:[a-zA-Z_0-9]+)
        if (NWUtils::functionExists('base64_decode')) {
            $sql = preg_replace_callback("/(?<![0-9])(?<!:)(:[a-zA-Z_0-9]+)/", function ($c) use ($serializedBoundValues) {
                $fields = unserialize(base64_decode($serializedBoundValues));
                return "{$fields[$c[0]]}";
            }, $sql);
        } else {
            $sql = preg_replace_callback("/(?<![0-9])(?<!:)(:[a-zA-Z_0-9]+)/", function ($c) use ($serializedBoundValues) {
                $fields = unserialize(mb_convert_encoding($serializedBoundValues, "auto", "BASE64"));
                return "{$fields[$c[0]]}";
            }, $sql);
        }
        return $sql;
    }

    function convert_ascii($string) {
        // Replace Single Curly Quotes
        if ($string == '' || $string == null) {
            return $string;
        }

        $search[] = chr(226) . chr(128) . chr(152);
        $replace[] = "'";
        $search[] = chr(226) . chr(128) . chr(153);
        $replace[] = "'";

        // Replace Smart Double Curly Quotes
        $search[] = chr(226) . chr(128) . chr(156);
        $replace[] = '"';
        $search[] = chr(226) . chr(128) . chr(157);
        $replace[] = '"';

        // Replace En Dash
        $search[] = chr(226) . chr(128) . chr(147);
        $replace[] = '--';

        // Replace Em Dash
        $search[] = chr(226) . chr(128) . chr(148);
        $replace[] = '---';

        // Replace Bullet
        $search[] = chr(226) . chr(128) . chr(162);
        $replace[] = '*';

        // Replace Middle Dot
        $search[] = chr(194) . chr(183);
        $replace[] = '*';

        // Replace Ellipsis with three consecutive dots
        $search[] = chr(226) . chr(128) . chr(166);
        $replace[] = '...';

        // Apply Replacements
        $string = str_replace($search, $replace, $string);

        // Remove any non-ASCII Characters
//        $string = preg_replace("/[^\x01-\x7F]/", "", $string);
//        $string = preg_replace("/[^(\x20-\x7F)]*/", "", $string);
//        $string = preg_replace("/[[:^print:]]/", "", $string);

        return $string;
    }

    public function setRegister($bool) {
        $this->register = $bool;
    }

    private function getRegister() {
        return $this->register;
    }

    public function exec($sql = '') {
        $this->v_at = -1;
        $this->v_lastErrorText = '';
        $this->v_lastErrorCode = '';

        if (trim($sql) == '' && trim($this->v_preparedQuery) != '') {
            $sql = self::preparedQuery();
        }

        if ($this->showLogQuerys === true) {
            error_log($sql);
            error_log("-----------------------------------------------------------");
            error_log("-----------------------------------------------------------");
        }

        switch ($this->m_db->driver()) {

            case NWDatabase::PGSQL:

//                $sql = pg_escape_string($sql);
//                ini_set("default_socket_timeout", 60);

                if ($this->isAsyncConnection) {
                    ignore_user_abort(false);
                    $pg_send_query = @pg_send_query($this->m_db->link(), $sql);
                    while (pg_connection_busy($this->m_db->link())) {
                        echo chr(0);
                        ob_flush();
                        flush();
                        usleep(100000); // 0.1s to avoid starving the CPU 
                        if (connection_status() != CONNECTION_NORMAL || connection_aborted()) {
                            pg_cancel_query($this->m_db->link());
                            pg_query($this->m_db->link(), "ROLLBACK");
                            pg_disconnect($this->m_db->link());
                            die();
                        }
                    }
                    $this->v_rs = pg_get_result($this->m_db->link());
                } else {
                    $this->v_rs = @pg_query($this->m_db->link(), $sql);
                    if (!$this->v_rs) {
                        pg_set_error_verbosity($this->m_db->link(), PGSQL_ERRORS_VERBOSE);
                        $stat = pg_connection_status($this->m_db->link());
                        if ($stat === PGSQL_CONNECTION_OK) {
                            $stat = '->Connection status: OK';
                        } else {
                            $stat = '->Connection status: BAD';
                        }
                        $last_error = pg_last_error($this->m_db->link());
                        if ($this->pregMatchDuplicate == true) {
                            if (preg_match('/duplicate key value violates unique constraint/i', $last_error)) {
                                $field = array();
                                try {
                                    preg_match("/Key ([\D ])*\)=\(/", $last_error, $field);
                                    error_log(print_r($field, true));
                                    if (isset($field[0])) {
                                        $field[0] = str_replace("Key ", "", $field[0]);
                                        $field[0] = str_replace("=", "", $field[0]);
                                        $field[0] = str_replace("(", "", $field[0]);
                                        $field[0] = str_replace("(", "", $field[0]);
                                        $field[0] = str_replace(")", "", $field[0]);
                                    }
                                } catch (Exception $exc) {
                                    $field[0] = "N/A";
                                }
                                $f = !isset($field[0]) ? "N/A" : $field[0];
                                $f = "<b>" . $f . "</b>";
                                NWJSonRpcServer::information("Hay un campo duplicado en el ingreso. Verifique el campo " . $f . " por favor ");
                                return;
                            }
                        }

                        $this->v_lastErrorText = "query failed, " . $last_error . $stat . "::SQL Query: " . $sql;

                        if (isset($_SESSION["usuario"])) {
                            $this->v_lastErrorText .= " :: User: " . $_SESSION["usuario"];
                        }
                        if (isset($_SESSION["empresa"])) {
                            $this->v_lastErrorText .= " :: Company: " . $_SESSION["empresa"];
                        }
                        if (isset($_SERVER["HTTP_HOST"])) {
                            $this->v_lastErrorText .= " :: Host: " . $_SERVER["HTTP_HOST"];
                        }

                        //throw new NWException($this->v_lastErrorText);
                        return false;
                    }
                }
                break;

            case NWDatabase::MYSQL:
                if ($this->isNewer) {
                    try {
                        $this->v_rs = @mysqli_query($this->m_db->link(), $sql);
                    } catch (Exception $e) {
                        $this->v_lastErrorText = "query failed, " . $e->getMessage() . "::SQL Query: " . $sql;
                        return false;
                    }
                    if (!$this->v_rs) {
                        $this->v_lastErrorText = "query failed, " . mysqli_error($this->m_db->link()) . "::SQL Query: " . $sql;
                        return false;
                        //throw new NWException($this->v_lastErrorText);
                    }
                } else {
                    @ $this->v_rs = @mysql_query($sql, $this->m_db->link());
                    if (!$this->v_rs) {
                        $this->v_lastErrorText = "query failed, " . mysql_error($this->m_db->link());
                        return false;
                        //throw new NWException($this->v_lastErrorText);
                    }
                }
                break;

            case NWDatabase::ORACLE:
                $this->v_rs = oci_parse($this->m_db->link(), $sql);
                $commit = OCI_COMMIT_ON_SUCCESS;
                if ($this->m_db->getOracleTransaction()) {
                    $commit = OCI_NO_AUTO_COMMIT;
                }
                if (!@oci_execute($this->v_rs, $commit)) {
                    $e = oci_error($this->v_rs);
                    debug_backtrace();
                    ob_start();
                    debug_print_backtrace();
                    $trace = ob_get_contents();
                    ob_end_clean();
                    $e["trace"] = $trace;
                    error_log(print_r($e, true));
                    $this->v_lastErrorText = "query failed, " . $e["message"] . "::Oracle code error: " . $e["code"] . "::SQL Query: " . $sql;
                    oci_rollback($this->m_db->link());
                    oci_free_statement($this->v_rs);
                    return false;
                    //throw new NWException($this->v_lastErrorText);
                }
                break;

            case NWDatabase::SQLSERVER:
                $params = array();
                $options = array("Scrollable" => SQLSRV_CURSOR_KEYSET);
                $this->v_rs = @sqlsrv_query($this->m_db->link(), $sql, $params, $options);
                if (!$this->v_rs) {
                    $e = sqlsrv_errors();
                    debug_backtrace();
                    ob_start();
                    debug_print_backtrace();
                    $trace = ob_get_contents();
                    ob_end_clean();
                    $e["trace"] = $trace;
                    error_log(print_r($e, true));
                    $this->v_lastErrorText = "query failed, STATE:" . $e["SQLSTATE"] . ", " . $e["message"] . "::Oracle code error: " . $e["code"] . "::SQL Query: " . $sql;
                    sqlsrv_rollback($this->v_rs);
                    sqlsrv_free_stmt($this->v_rs);
                    return false;
                }
                break;

            default:
                throw new NWException("Invalid database driver: {$this->m_db->driver()}");
        }
        try {
            if (!isset($this->register) || $this->register == true) {
                $this->setRegistro($this);
            }
        } catch (Exception $exc) {
            
        }
        return true;
    }

    public function setNomTable($table) {
        $this->nomPag = $table;
    }

    public function getNomTable() {
        return $this->nomPag;
    }

    public function at() {
        return $this->v_at;
    }

    public function size() {
        switch ($this->m_db->driver()) {
            case NWDatabase::SQLSERVER:
                $num_rows = sqlsrv_num_rows($this->v_rs);
                if (!$num_rows) {
                    $e = sqlsrv_errors();
                    debug_backtrace();
                    ob_start();
                    debug_print_backtrace();
                    $trace = ob_get_contents();
                    ob_end_clean();
                    $e["trace"] = $trace;
                    error_log(print_r($e, true));
                    $this->v_lastErrorText = "query failed, STATE:" . $e["SQLSTATE"] . ", " . $e["message"] . "::SQL server code error: " . $e["code"] . "::Trace: " . $trace;
                    sqlsrv_rollback($this->v_rs);
                    sqlsrv_free_stmt($this->v_rs);
                    return 0;
                }
                return $num_rows;

            case NWDatabase::PGSQL:
                return pg_num_rows($this->v_rs);

            case NWDatabase::ORACLE:
                $ca = new NWDbQuery($this->m_db);
                $ca->prepare('SELECT COUNT(*) AS NUMBER_OF_ROWS FROM (' . self::preparedQuery() . ')');
                if (!$ca->exec()) {
                    $this->v_lastErrorText = $ca->lastErrorText();
                    return 0;
                }
                $rta = $ca->assocAll();
                return $rta[0]["number_of_rows"];

            case NWDatabase::MYSQL:
                if ($this->isNewer) {
                    return mysqli_num_rows($this->v_rs);
                } else {
                    return mysql_num_rows($this->v_rs);
                }
        }
    }

    public function GetSQLValueString($theValue, $theType) {
//        $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
        $theValue = stripslashes($theValue) ?: $theValue;

        $theValue = function_exists("mysqli_real_escape_string") ? mysqli_real_escape_string($this->m_db->link(), $theValue) :
                (function_exists("mysqli_escape_string") ? mysqli_escape_string($this->m_db->link(), $theValue) : $theValue);
        //$theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

        return $theValue;
    }

    public function next() {
        $this->v_at += 1;
    }

    public function assoc($oracleConvert = true) {
        $size = $this->size();
        if ($this->v_at < 0 || ($this->v_at + 1) > $size) {
            throw new NWException("NWDbQuery::assoc Index out of range index={$this->v_at} records={$size}, QUERY: " . $this->preparedQuery());
        }
        if ($this->oracleConvert != null) {
            $oracleConvert = $this->oracleConvert;
        }

        switch ($this->m_db->driver()) {
            case NWDatabase::SQLSERVER:
                return sqlsrv_fetch_array($this->v_rs, SQLSRV_FETCH_ASSOC);

            case NWDatabase::PGSQL:
                return pg_fetch_assoc($this->v_rs, $this->v_at);

            case NWDatabase::ORACLE:
//                $rta = oci_fetch_array($this->v_rs, OCI_FETCHSTATEMENT_BY_ROW + OCI_ASSOC + OCI_RETURN_LOBS);
                $rta = oci_fetch_array($this->v_rs, OCI_ASSOC + OCI_RETURN_LOBS + OCI_RETURN_NULLS);
                if ($rta == false) {
                    return Array();
                }
                if ($oracleConvert === true) {
                    $r = NWUtils::convertToOracleLower($rta);
                } else {
                    $r = $rta;
                }
                return $r;

            case NWDatabase::MYSQL:
                if ($this->isNewer) {
                    return mysqli_fetch_assoc($this->v_rs);
                } else {
                    return mysql_fetch_assoc($this->v_rs);
                }
        }
    }

    public function assocAll($oracleConvert = true) {
        //TODO: cambio por un error inesperado, en observación
        if ($this->v_rs == null) {
            return array();
        }
        if ($this->oracleConvert != null) {
            $oracleConvert = $this->oracleConvert;
        }

        switch ($this->m_db->driver()) {
            case NWDatabase::SQLSERVER:
                if (sqlsrv_num_rows($this->v_rs) == 0) {
                    return array();
                } else {
                    $drta = Array();
                    while ($row = sqlsrv_fetch_array($this->v_rs, SQLSRV_FETCH_ASSOC)) {
                        $drta[] = $row;
                    }
                    return $drta;
                }

            case NWDatabase::PGSQL:
                if (pg_num_rows($this->v_rs) == 0) {
                    return array();
                } else {
                    return pg_fetch_all($this->v_rs);
                }

            case NWDatabase::ORACLE:
                $rta = array();
                if (oci_fetch_all($this->v_rs, $rta, null, null, OCI_FETCHSTATEMENT_BY_ROW + OCI_ASSOC + OCI_RETURN_LOBS) == 0) {
                    return array();
                } else {
                    $drta = Array();
                    for ($i = 0; $i < count($rta); $i++) {
                        if ($oracleConvert === true) {
                            $drta[$i] = NWUtils::convertToOracleLower($rta[$i]);
                        } else {
                            $drta[$i] = $rta[$i];
                        }
                    }
                    return $drta;
                }

            case NWDatabase::MYSQL:
                $result = array();
                if ($this->isNewer) {
                    while ($rax = mysqli_fetch_assoc($this->v_rs)) {
                        $result[] = $rax;
                    }
                } else {
                    while ($rax = mysql_fetch_assoc($this->v_rs)) {
                        $result[] = $rax;
                    }
                }
                return $result;
        }
    }

    public function haveAdvancedSecurity($bool) {
        $this->__haveAdvancedSecurity = $bool;
    }

    public function bindValue($k, $v, $quote = 'auto', $haveNull = false, $encrypt = false) {

//        if (!isset($v) || $v == "") {
//            $v = null;
//        }

        if ($quote === 'auto') {
            if ($v === null) {
                $v = "";
            }
//            if (gettype($v) === 'object' || gettype($v) === "array") {
//                NWJSonRpcServer::error("Se espera un tipo string o integer en la validación del bindValue, " . json_encode($v));
//            }
            if (array_search(strtolower($v), array("current_time", "current_date", "current_timestamp")) !== false) {
                self::bindValue($k, $v, false);
                return;
            }

            $match = array();
            preg_match('/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\z/', $v, $match);
            if (count($match) != 0) {
                self::bindValue($k, $v, true);
                return;
            }

            $match = array();
            // TODO: SE QUITA LA , (COMMA) DEL PREG_MATCH 29_MAY_2014
            preg_match("/[0-9\.]+/", $v, $match);
            if (count($match) == 0 || $match[0] != $v) {
                self::bindValue($k, $v, true);
                return;
            } else {
                if ($v == ".") {
                    self::bindValue($k, $v, true);
                    return;
                }
                $quote = false;
            }
        }

        if ($quote) {
            $type = "text";
        } else {
            $type = "int";
        }

        if ($v != null) {

            //TODO: ADD MORE SECURITY SETTINGS
            if ($this->cleanHtml) {
                $v = @strip_tags($v);
            }

            if ($this->__escapeShelArgs) {
                $v = escapeshellarg($v);
            }

            if ($encrypt) {
                try {
                    $v = NWUtils::encrypt($v, "md4");
                } catch (Exception $exc) {
                    NWJSonRpcServer::error($exc->getTraceAsString());
                }
            }

            if ($this->__haveAdvancedSecurity) {
                $v = str_replace("delete", "", $v);
                $v = str_replace("update", "", $v);
                $v = str_replace("drop", "", $v);
                $v = str_replace("where", "", $v);
                $v = str_replace("having", "", $v);
            }

            if ($this->cleanNonAscii == true) {
                $v = $this->convert_ascii(utf8_encode($v));
            }

            if ($this->cleanNonAsciiPostgres == true) {
                if ($type != "int") {
                    if (!$this->isValidTimeStamp($v)) {
                        if (!$this->is_valid_date($v)) {
                            $v = " func_valida_ascii(" . $v . ") ";
                        }
                    }
                }
            }
        }

        if ($haveNull) {
            if ($v == "" || $v == null || !isset($v)) {
                $v = 'null';
                $quote = false;
            }
        }

        $driver = $this->m_db->driver();

        if (NWUtils::validateDate($v, 'Y-m-d') == true && $driver == NWDatabase::ORACLE) {
            $v = "DATE'" . $v . "' ";
            $quote = false;
        }
        if (NWUtils::validateDate($v, 'Y-m-d H:i:s') == true && $driver == NWDatabase::ORACLE) {
            $v = "TIMESTAMP'" . $v . "' ";
            $quote = false;
        }
        if (NWUtils::validateDate($v, 'H:i:s') == true && $driver == NWDatabase::ORACLE) {
            $v = "TO_DATE('" . $v . "', 'HH24:MI:SS')";
            $quote = false;
        }

        switch ($driver) {
            case NWDatabase::PGSQL:
                if ($this->htmlentities == true) {
                    $this->v_boundValues[$k] = htmlentities(pg_escape_string($this->m_db->link(), $v));
                } else {
                    $this->v_boundValues[$k] = pg_escape_string($this->m_db->link(), $v);
                }
                break;
            case NWDatabase::MYSQL:
                if ($this->htmlentities == true) {
                    $this->v_boundValues[$k] = htmlentities($this->GetSQLValueString($v, $type));
                } else {
                    $this->v_boundValues[$k] = $this->GetSQLValueString($v, $type);
                }
                break;
            case NWDatabase::ORACLE:
                // TODO: Compatibilidad con Oracle en los tipos BOOLEAN
                if ($v == 'false') {
                    $v = 0;
                } else if ($v == 'true') {
                    $v = 1;
                }
                if ($this->htmlentities == true) {
                    $this->v_boundValues[$k] = htmlentities($v);
                } else {
                    $this->v_boundValues[$k] = $v;
                }
                break;
        };
        $this->v_boundTypes[$k] = $quote;
    }

    function is_valid_date($value, $format = 'yyyy-mm-dd') {
        if (strlen($value) >= 6 && strlen($format) == 10) {

            // find separator. Remove all other characters from $format 
            $separator_only = str_replace(array('m', 'd', 'y'), '', $format);
            $separator = "-"; // separator is first character 
            //$separator = $separator_only[0]; // separator is first character 

            if ($separator) {
                // make regex 
                $regexp = str_replace('mm', '(0?[1-9]|1[0-2])', $format);
                $regexp = str_replace('dd', '(0?[1-9]|[1-2][0-9]|3[0-1])', $regexp);
                $regexp = str_replace('yyyy', '(19|20)?[0-9][0-9]', $regexp);
                $regexp = str_replace($separator, "\\" . $separator, $regexp);
                if ($regexp != $value && preg_match('/' . $regexp . '\z/', $value)) {

                    // check date 
                    $arr = explode($separator, $value);
                    $day = $arr[0];
                    $month = $arr[1];
                    $year = $arr[2];
                    if (@checkdate($month, $day, $year))
                        return true;
                }
            }
        }
        return false;
    }

    public function isValidTimeStamp($timestamp) {
        return ((string) (int) $timestamp === $timestamp) && ($timestamp <= PHP_INT_MAX) && ($timestamp >= ~PHP_INT_MAX);
    }

    public function clean_html($bool) {
        if ($bool == true) {
            $this->cleanHtml = true;
        } else {
            $this->cleanHtml = false;
        }
    }

    public function boundValues() {
        return $this->v_boundValues;
    }

    public function prepare($sql) {
        $this->action = "CONSULTA GENERAL";
        $this->v_preparedQuery = $sql;
        return true;
    }

    public function prepareSelect($tableName, $fields, $where = '', $order = '', $extra = '') {

        $this->action = "SELECT";

        $this->setNomTable($tableName);

        $sql = "select {$fields} from {$tableName} ";

        if (trim($where) != "") {
            $sql .= " where {$where} ";
        }

        if (trim($order) != "") {
            $sql .= " order by {$order} ";
        }

        if (trim($extra) != "") {
            $sql .= " {$extra} ";
        }


        $this->v_preparedQuery = $sql;
        return true;
    }

    public function processRecord($tableName, $fields) {
        self::clear();

        $this->action = "PROCESS_RECORD";

        $this->setNomTable($tableName);

        $sql = "";
        $fieldList = explode(",", $fields);
        $valueList = $fieldList;
        $tmp = null;
        $tmp2 = null;

        for ($i = 0; $i < count($fieldList); $i++) {

            if (strpos($fieldList[$i], "=") !== false) {
                $tmp2 = explode("=", $fieldList[$i]);
                $fieldList[$i] = $tmp2[0];
                $valueList[$i] = $tmp2[1];
            } else {
                $fieldList[$i] = trim($fieldList[$i]);
                $valueList[$i] = ":" . trim($fieldList[$i]);
            }
        }

        $sql = "func_process_record(" . $tableName . " ( "
                . implode(",", $fieldList) . " ), ( "
                . implode(",", $valueList) . " )";

        $this->v_preparedQuery = $sql;
        return true;
    }

    public function prepareInsert($tableName, $fields) {
        self::clear();

        $this->action = "INSERT";

        $this->setNomTable($tableName);

        $sql = "";
        $fieldList = explode(",", $fields);
        $valueList = $fieldList;
        $tmp = null;
        $tmp2 = null;

        for ($i = 0; $i < count($fieldList); $i++) {

            if (strpos($fieldList[$i], "=") !== false) {
                $tmp2 = explode("=", $fieldList[$i]);
                $fieldList[$i] = $tmp2[0];
                $valueList[$i] = $tmp2[1];
            } else {
                $fieldList[$i] = trim($fieldList[$i]);
                $valueList[$i] = ":" . trim($fieldList[$i]);
            }
        }

        $sql = "insert into " . $tableName . " ( "
                . implode(",", $fieldList) . " ) values ( "
                . implode(",", $valueList) . " )";

        $this->v_preparedQuery = $sql;
        return true;
    }

    public function prepareUpdate($tableName, $fields, $where) {
        self::clear();

        $this->action = "UPDATE";

        $this->setNomTable($tableName);

        $sql = '';
        $fieldList = explode(",", $fields);
        $tmp = null;

        $sql = "update " . $tableName . " set ";

        for ($i = 0; $i < count($fieldList); $i++) {
            $fieldList[$i] = trim($fieldList[$i]);
            if (strpos($fieldList[$i], "=") !== false) {
                $sql .= $fieldList[$i] . ",";
            } else {
                $sql .= $fieldList[$i] . " = :" . $fieldList[$i] . ",";
            }
        }

        $sql = substr(trim($sql), 0, -1);

        if (trim($where) != "") {
            $sql .= " where " . $where;
        }


        $this->v_preparedQuery = $sql;
        return true;
    }

    public function prepareDelete($tableName, $where) {
        self::clear();

        $this->action = "DELETE";

        $this->setNomTable($tableName);

        $sql = "delete from " . $tableName . " ";
        if (trim($where) != '') {
            $sql .= " where " . $where;
        }

        $sql = trim($sql);
        $this->v_preparedQuery = $sql;
        return true;
    }

    public static function sqlFieldsFiltersEqual($fieldList, $value, $type = "int") {
        if (is_string($fieldList)) {
            $fieldList = explode(",", $fieldList);
        }
        $sqlFilters = "";
        if ($value != "TODOS") {
            if ($value != "TODAS") {
                foreach ($fieldList as $f) {
                    switch ($type) {
                        case "int":
                            $sqlFilters .= " and {$f}={$value}";
                            break;
                        case "text":
                            $sqlFilters .= " and lower({$f}::text) = '{$value}' ";
                            break;
                    }
                }
            }
        }
        return $sqlFilters;
    }

    public static function sqlFieldsFiltersOptional($fieldList, $value, $boolean, $quote) {
        if (is_string($fieldList)) {
            $fields = explode($quote, $fieldList);
        }

        $filtro = strtolower($value);

        $sqlFilters = array();

        foreach ($fields as $f) {
            if ($boolean) {
                $driver = $GLOBALS["nwdriver"];
                if ($driver == "PGSQL") {
                    $sqlFilters[] = "lower({$f}::text) like lower('%{$value}%')";
                } else if ($driver == "MYSQL") {
                    $sqlFilters[] = "lower(CAST({$f} AS CHAR)) like lower('%{$value}%')";
                } else if ($driver == "ORACLE") {
                    $sqlFilters[] = "lower(CAST({$f} AS VARCHAR2(200))) like lower('%{$value}%')";
                }
            } else {
                $sqlFilters[] = "lower({$f}) like lower('%{$value}%')";
            }
        }

        $sqlFilters = implode(" or ", $sqlFilters);
        return "( {$sqlFilters} )";
    }

    public static function sqlFieldsFilters($fieldList, $value, $boolean = false) {

        if ($value == null) {
            $value = "";
        }

        if (is_string($fieldList)) {
            $fields = explode(",", $fieldList);
        }

        $filtro = strtolower($value);

        $sqlFilters = array();

        foreach ($fields as $f) {
            if ($boolean) {
                if ($GLOBALS["nwdriver"] == "PGSQL") {
                    $sqlFilters[] = "lower({$f}::text) like lower('%{$value}%')";
                } else if ($GLOBALS["nwdriver"] == "MYSQL") {
                    $sqlFilters[] = "lower(CAST({$f} AS CHAR)) like lower('%{$value}%')";
                } else if ($GLOBALS["nwdriver"] == "ORACLE") {
                    $sqlFilters[] = "lower(CAST({$f} AS VARCHAR2(200))) like lower('%{$value}%')";
                }
            } else {
                $sqlFilters[] = "lower({$f}) like lower('%{$value}%')";
            }
        }

        $sqlFilters = implode(" or ", $sqlFilters);

        if ($sqlFilters == "") {
            return "";
        }

        return "( {$sqlFilters} )";
    }

    public function getAction() {
        return $this->action;
    }

    public function setAction($action) {
        $this->action = $action;
    }
}

?>