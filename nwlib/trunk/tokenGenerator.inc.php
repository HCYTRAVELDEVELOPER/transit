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

//header("Access-Control-Allow-Origin: *");

require_once dirname(__FILE__) . '/includes/php-jwt/vendor/autoload.php';

use \Firebase\JWT\JWT;

//TODO: ANDRESF FIX IMPORTANT

function getProtocol() {
            if (!isset($_SERVER['HTTPS'])) {
                return 'http://';
            }
            $sptc = strtolower($_SERVER['HTTPS']);
            $proto = $sptc == 'on' ? 'https://' : 'http://';
            return $proto;
        }
        
class tokenGenerator {

    public static function getToken($p) {

        $key = "nw_app_secret";
        $room = str_replace("_", "", $p["room"]);

        $protocolo = getProtocol();

        $terminal = "";
        if (isset($p["terminal"])) {
            $terminal = $p["terminal"];
        }
        if (isset($_SESSION["terminal"])) {
            $terminal = $_SESSION["terminal"];
        }
        $id_user = "";
        if (isset($p["id_user"])) {
            $id_user = $p["id_user"];
        }
        if (isset($_SESSION["id_usuario"])) {
            $id_user = $_SESSION["id_usuario"];
        }
        $email = "";
        if (isset($p["email"])) {
            $email = $p["email"];
        }
        if (isset($_SESSION["email"])) {
            $email = $_SESSION["email"];
        }
        $name = "";
        if (isset($p["name"])) {
            $name = $p["name"];
        }
        if (isset($_SESSION["nombre"])) {
            $name = $_SESSION["nombre"];
            if (isset($_SESSION["apellido"])) {
                $name .= " " . $_SESSION["apellido"];
            }
        }
        $foto = "";
        if (isset($p["foto"])) {
            $foto = $p["foto"];
        }
        if (isset($_SESSION["foto"])) {
            $foto = "{$protocolo}://" . $_SERVER["HTTP_HOST"] . $_SESSION["foto"];
        }
        $moderator = true;
        if (isset($p["moderator"])) {
            if ($p["moderator"] === "false") {
                $moderator = false;
            }
        }
        $fileRecordingsEnabled = false;
        if (isset($p["fileRecordingsEnabled"])) {
            if ($p["fileRecordingsEnabled"] === "true") {
                $fileRecordingsEnabled = true;
            }
        }
        $startWithVideoMuted = false;
        if (isset($_GET["startWithVideoMuted"])) {
            if ($_GET["startWithVideoMuted"] === "true") {
                $startWithVideoMuted = true;
            }
        }
        $mosaico = true;
        if (isset($p["mosaico"])) {
            if ($p["mosaico"] === "false") {
                $mosaico = false;
            }
        }

        $jwt = false;
        if ($moderator === true) {
            $token = array(
                "iss" => "nw_app_video",
                "room" => $room,
                "exp" => strtotime("+10 years"),
                "sub" => "meet.gruponw.com",
                "aud" => "nw_app_secret",
                "moderator" => "true",
                "openBridgeChannel" => "true",
                "context" => [
                    "user" => [
                        'avatar' => $foto,
                        'name' => $name,
                        'email' => $email,
                        'id' => $id_user
                    ]
                ]
            );
            $jwt = JWT::encode($token, $key);
        }

        $rta = Array();
        $rta["response"] = $jwt;
        return $rta;
    }

}


?>
