<?php

class api_sitca {

    public static $HOST;
    public static $USER;
    public static $PASSWORD;
    public static $PROFILE;
    public static $COMPANY;
    public static $METHOD;
    public static $CLASS;

    public static function sitcaApi($p) {
        include_once dirname(__FILE__) . '/../../nwlib6/rpc/nwApi.inc.php';
        $nwApi = new nwApi(self::$HOST . "/rpcsrv/api.inc.php");
//        $nwApi = new nwApi("http://test.sitca.co/rpcsrv/api.inc.php");
        $nwApi->setUser(self::$USER);
        $nwApi->setPassword(self::$PASSWORD);
        $nwApi->setProfile(self::$PROFILE);
        $nwApi->setCompany(self::$COMPANY);
        $nwApi->startSession();
//        $nwApi->setUser("andersonb");
//        $nwApi->setPassword("ander1016");
//        $nwApi->setProfile(582);
//        $nwApi->setCompany(50);
//        $nwApi->startSession();
//        $cli = Array();
//        $cli["numero_guia"] = "400000008";
//        $cli["estado"] = "PRUEBA";
//        $cli["observacion"] = "OK";
//        $arr = $cli;
        $arr = $p;
        $method = self::$METHOD;
//        $method = "cambiarEstado";
        $class = self::$CLASS;
//        $class = "ws_movilmove";
        $res = $nwApi->exec($method, $class, $arr);
//        return $res["result"];
        return $res;
//        return self::$METHOD;
    }

    public static function datosApi($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("ws_sitca", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $r = $ca->flush();
        self::$HOST = $r["host_api"];
        self::$USER = $r["usuario_api"];
        self::$PASSWORD = $r["password_api"];
        self::$PROFILE = $r["profile_api"];
        self::$COMPANY = $r["company_api"];
    }

    public static function envioEstado($p) {
        self::datosApi($p);

        self::$CLASS = "ws_movilmove";
        self::$METHOD = "cambiarEstado";

//        $data = self::datosParada($p);

//        $r = self::sitcaApi($data);
        $r = self::sitcaApi($p);
        return $r;
    }

    public static function datosParada($p) {
        $cli = Array();
        $cli["numero_guia"] = $p["numero_guia"];
        $cli["estado"] = $p["estado"];
        $cli["observacion"] = $p["observacion"];
        $cli["imagen_guia"] = $p["imagen_guia"];
        return $cli;
    }

}

?>