<?php

/*
  if (!isset($cfg)) {
  error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE | E_STRICT);
  ini_set("display_errors", 1);
  throw new Exception("Configuration var not found");
  } */

class NWConfig {

    public static function globalVar() {
        return $GLOBALS["cfg"];
    }

    public static function appPath() {
        global $cfg;

        if (isset($cfg["appPath"])) {
            return $cfg["appPath"];
        }

        return dirname(dirname(__FILE__));
    }

    public static function appRoot() {
        $cfg = self::globalVar();
        if (!isset($cfg["appRoot"])) {
            $cfg["appRoot"] = "";
        }

        return $cfg["appRoot"];
    }

    public static function nwlibPath() {
        global $cfg;
        return self::appPath() . '/nwlib' . $cfg["nwlibVersion"];
    }

    public static function nwlibRoot() {
        global $cfg;
        return self::appRoot() . "/nwlib" . $cfg["nwlibVersion"];
    }

    public static function privateTempPath() {
        return NWApp::appPath() . "/private_tmp";
    }

    public static function privateTempRoot() {
        return NWApp::appRoot() . "/private_tmp";
    }

}

class NWApp extends NWConfig {
    
}

?>