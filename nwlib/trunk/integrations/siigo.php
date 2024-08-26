<?php

class siigo {

    public static $user = "siigoapi@pruebas.com";
    public static $password = "OWE1OGNkY2QtZGY4ZC00Nzg1LThlZGYtNmExMzUzMmE4Yzc1Olc1YikvRTVjJU0=";
    public static $auth_method = "auth";
    public static $method = "";
    public static $version = "v1";
    public static $url = "https://api.siigo.com";
    public static $token = null;
    public static $errorMessage = "";
    public static $empresa = "";

    public function __construct() {
        
    }

    public static function start($p) {
        self::$empresa = $p["partner"];

        self::getCredentials();
        self::getToken();
        if (self::$token === "") {
            self::error("No tiene un token activo");
            return;
        }
        if (isset($p['type']) && $p['type'] == 'GET') {
            return self::update_data($p);
        } else {
            return self::process($p);
        }
    }

    public static function getCredentials() {
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_integrations_credentials", "*", "empresa=:empresa and tipo='SIIGO'");
        $ca->bindValue(":empresa", $si["empresa"]);

        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        $r = $ca->flush();
        self::$user = $r["aut_usuario"];
        self::$password = $r["clave"];
        self::$auth_method = $r["aut_metodo"];
        self::$version = $r["version"];
        self::$url = $r["url"];
    }

    public static function error($p) {
        if (class_exists('NWJSonRpcServer')) {
            NWJSonRpcServer::error("Error: ", json_encode($p));
        } else {
            return json_encode($p);
        }
    }

    public static function process($p) {

        $json = json_encode($p["params"]);

        $url = self::$url . "/" . self::$version . "/" . $p["method"];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
                array(
                    'Content-Type:application/json',
                    "Authorization: Bearer " . self::$token,
                    "Partner-Id:" . self::$empresa,
                    'Content-Length: ' . strlen($json)
                )
        );
        $ret = curl_exec($ch);
        curl_close($ch);

        $r = json_decode($ret, true);

        return $r;
    }

    public static function update_data($p) {
        $ch = curl_init();
        $url = self::$url . "/" . self::$version . "/" . $p["method"];
        $headers = [
            'Content-Type:application/json',
            "Authorization: Bearer " . self::$token,
            "Partner-Id:" . self::$empresa,
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $ret = curl_exec($ch);
        curl_close($ch);

        $r = json_decode($ret, true);
        return $r;
    }

    public static function getToken() {

        $arr = array();
        $arr["username"] = self::$user;
        $arr["access_key"] = self::$password;

        $url = self::$url . "/" . self::$auth_method;

        $json = json_encode($arr);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        curl_setopt($ch, CURLOPT_HTTPHEADER,
                array(
                    'Content-Type:application/json',
                    "Partner-Id:" . self::$empresa,
                    'Content-Length: ' . strlen($json)
                )
        );
        $ret = curl_exec($ch);
        curl_close($ch);

        $r = json_decode($ret, true);

        if ($r != null) {
            if (!isset($r["access_token"])) {
                error_log(json_encode($r));
                self::$errorMessage = json_encode($r);
                self::error($r);
                return false;
            }
            self::$token = $r["access_token"];
        } else {
            self::$token = "";
        }
        return true;
    }
}
