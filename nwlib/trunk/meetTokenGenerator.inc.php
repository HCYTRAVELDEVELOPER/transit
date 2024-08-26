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

require_once $_SERVER['DOCUMENT_ROOT'] . '/nwlib6/includes/php-jwt/vendor/autoload.php';

use \Firebase\JWT\JWT;

class meetTokenGenerator {

    public static function getToken() {
        
        global $room;
        
        $key = "nw_app_secret";

        $room = str_replace("_", "", $room);

        $token = array(
            "iss" => "nw_app_video",
            "room" => $room,
            "exp" => strtotime("+10 years"),
            "sub" => "meet.gruponw.com",
            "aud" => "nw_app_secret",
            "moderator" => "true",
        );
        
        $jwt = JWT::encode($token, $key);
        
        return $jwt;
    }

}

?>
