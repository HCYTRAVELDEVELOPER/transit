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

class nwApi {

    var $url = null;
    var $token = null;
    var $method = null;
    var $service = null;
    var $password = null;
    var $profile = null;
    var $company = null;
    var $errorMessage = null;

    public function __construct($url) {
        $this->url = $url;
    }

    function setUser($user) {
        $this->user = $user;
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

    function startSession() {
        $data = array();
        $data['method'] = 'createToken';
        $data['service'] = 'NWJSonRpcServer';
        $data['params'] = [];

        $arr = array();
        $arr["user"] = $this->user;
        $arr["password"] = $this->password;
        $arr["profile"] = $this->profile;
        $arr["company"] = $this->company;

        $data["params"][] = $arr;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        $ret = curl_exec($ch);
        curl_close($ch);

        $r = json_decode($ret, true);
        if ($r != null) {
            if (!isset($r["token"])) {
                error_log(json_encode($r));
                $this->errorMessage = json_encode($r);
                if (class_exists('NWJSonRpcServer')) {
                    NWJSonRpcServer::error("Sesión Inválida", json_encode($r));
                } else {
                    echo json_encode($r);
                }
                return false;
            }
            $this->token = $r["token"];
        } else {
            $this->token = "";
        }
        return true;
    }

    function getErrorMessage() {
        return "ERROR DE SERVIDOR REMOTO: " . " :: " . $this->errorMessage;
    }

    function exec($method, $service, $p) {

        $this->method = $method;
        $this->service = $service;

        $data = array();
        $data['method'] = $method;
        $data['service'] = $service;

        //p should be an Array()
        $arr = $p;

        $data["params"][] = $arr;

        $ch = curl_init();

        //header('Content-Type: application/json');

        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

//********************Check these lines for headers*******************
        $headers = [
            "Content-Type: application/x-www-form-urlencoded; charset=utf-8",
            "Authorization: Bearer " . $this->token
        ];

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $ret = curl_exec($ch);
        curl_close($ch);

        $r = json_decode($ret, true);
        
        if (isset($r["isError"]) && $r["isError"] == true) {
            $this->errorMessage = $r["error"]["message"];
            error_log("JSON ERROR: " . json_encode($r));
            NWJSonRpcServer::error($this->errorMessage);
            return false;
        }
        
        if (isset($r["error"]) && $r["error"] == true) {
            $this->errorMessage = $r["error_message"];
            error_log("JSON ERROR: " . json_encode($r));
            NWJSonRpcServer::error($this->errorMessage);
            return false;
        }

        return $r;
    }

}

?>
