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

class nw_server {

    public static function loadSquidConf($p) {
        $archivo = $p["archivo"];
        $out = shell_exec("sudo bash -c 'cat '$archivo' 2>&1' ");
        return $out;
    }

    public static function saveSquidConf($p) {
        $out = null;
        $error = null;
        $archivo = $p["archivo"];
        exec("sudo bash -c '> $archivo' ", $out, $error);
        exec("sudo bash -c 'echo \"" . $p["texto"] . "\" >> $archivo' ", $out, $error);
        exec("sudo bash -c 'service squid3 restart' ", $out, $error);
        return json_encode($out);
    }

}

?>
