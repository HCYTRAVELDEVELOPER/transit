<?php

class NWException extends Exception {

    protected $sqlError = '';
    protected $sql = '';

    public function __construct($message= "", $code= 0, $op=array()) {
        $op["sql"] = isset($op["sql"]) ? $op["sql"] : "";
        $op["sqlError"] = isset($op["sqlError"]) ? $op["sqlError"] : "";

        $op["file"] = isset($op["file"]) ? $op["file"] : "";
        $op["line"] = isset($op["line"]) ? $op["line"] : "";

        Exception::__construct($message, $code);

        $this->setFile($op["file"]);
        $this->setLine($op["line"]);

        $this->v_sqlError = $op["sqlError"];
        $this->v_sql = $op["sql"];

        return;
    }

    public function getSql() {
        return $this->v_sql;
    }

    public function getSqlError() {
        return $this->v_sqlError;
    }

    public function setFile($fileName) {
        $this->file = $fileName;
    }

    public function setLine($line) {
        $this->line = (int) $line;
    }

}
?>