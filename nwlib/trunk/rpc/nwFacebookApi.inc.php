<?php

/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */

class nwFacebookApi {

    var $url = null;
    var $token = null;
    var $method = null;
    var $service = null;
    var $password = null;
    var $profile = null;
    var $company = null;
    var $errorMessage = null;
    var $contentType = "Content-Type: application/x-www-form-urlencoded; charset=utf-8";
    var $jsonEncode = true;
    var $mediaType = "image/jpeg";
    var $origin = null;

    public function __construct($url) {
        $this->url = $url;
    }

    function setOrigin($origin) {
        $this->origin = $origin;
    }

    function setMediaType($type) {
        $this->mediaType = $type;
    }

    function setUser($user) {
        $this->user = $user;
    }

    function setJsonEncode($bool) {
        $this->jsonEncode = $bool;
    }

    function setToken($token) {
        $this->token = $token;
    }

    function setContentType($type) {
        $this->contentType = $type;
    }

    function setPassword($password) {
        $this->password = $password;
    }

    function setProfile($profile) {
        $this->profile = $profile;
    }

    function setCompany($company) {
        $this->company = $company;
    }

    function getErrorMessage() {
        return "ERROR DE SERVIDOR REMOTO: " . " :: " . $this->errorMessage;
    }

    function uploadMedia($path, $isRemote = false, $user_id = null) {

        if ($isRemote) {
            $content = file_get_contents($path);
            $file = basename($path);
            $path = $_SERVER["DOCUMENT_ROOT"] . "/tmp/" . $file;
//            $path = dirname(__FILE__) . "/../../tmp/" . $file;
//            $path = dirname(__FILE__) . $allPath;
            $fp = fopen($path, "w");
            if (!$fp) {
                $this->errorMessage = "No se logró abrir el archivo " . $path;
                return false;
            }
            fwrite($fp, $content);
            fclose($fp);
        }

        $ch = curl_init();

//        $curl_log = fopen(dirname(__FILE__) . "/../../nwadmin3/trunk/tmp/curl.txt", 'w');

        $arr = explode("?", $path);
        
//        $path = $arr[0];
        
        $p = Array();
        $cfile = new CURLFile($path, $this->mediaType);
//        $cfile = new CURLFile('/var/www/nwadmin3/trunk/tmp/imagen_test.jpeg', 'image/jpeg');

        $p["file"] = $cfile;
        $p["messaging_product"] = "whatsapp";
        $p["type"] = $this->mediaType;
        
        error_log(json_encode($p));

//        curl_setopt($ch, CURLOPT_VERBOSE, 1);
//        curl_setopt($ch, CURLOPT_STDERR, $curl_log);

        curl_setopt($ch, CURLOPT_URL, "https://graph.facebook.com/v13.0/{$user_id}/media");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $p);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_VERBOSE, true);
        curl_setopt($ch, CURLOPT_USERAGENT, "curl/7.58.0");

        //********************Check these lines for headers*******************

        $headers = [
            "Content-Type: multipart/form-data",
            "Authorization: Bearer " . $this->token
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2_0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TCP_KEEPALIVE, 1);
        curl_setopt($ch, CURLOPT_USERAGENT, "curl/7.58.0");
//        curl_setopt($ch, CURLOPT_TLS13_CIPHERS, 'TLS_CHACHA20_POLY1305_SHA256');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $ret = curl_exec($ch);
        
        error_log($ret);
        
        curl_close($ch);

//        fclose($curl_log);
//        rewind($curl_log);
//        $output = fread($curl_log, 2048);
//        print_r($output);

        $r = json_decode($ret, true);

        return $r;

//        print_r($r);
//
//        if (isset($r["isError"]) && $r["isError"] == true) {
//            $this->errorMessage = $r["error"]["message"];
//            return false;
//        }
    }

    function exec($method = null, $service = null, $p) {

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_POST, 1);
        if ($this->jsonEncode === true) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($p));
        } else {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $p);
        }
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

        //********************Check these lines for headers*******************

        $headers = [
            $this->contentType,
            "Authorization: Bearer " . $this->token
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $ret = curl_exec($ch);
        curl_close($ch);

        $r = json_decode($ret, true);

        if (isset($r["isError"]) && $r["isError"] == true) {
            $this->errorMessage = $r["error"]["message"];
            return false;
        }

        return $r;
    }
}

?>
