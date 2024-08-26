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

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
error_reporting(E_ALL);

if (session_id() == null) {
    session_start();
}
session::check();

class nw_export_enc {

    public static function start() {
        $rta = "";
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if (!isset($si["usuario"])) {
            return "";
        }
        if (isset($_GET["dev"]) && $_GET["dev"] == true) {
            $ca->prepareSelect("nw_export_calculate_dev", "*", "empresa=:empresa");
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                return "Error ejecutando la consulta: Error:" . $ca->lastErrorText() . ". Query:" . $ca->preparedQuery();
            }
            if ($ca->size() == 0) {
                include_once dirname(__FILE__) . '/nw_calc_test.inc.php';
            } else {
                $ca->next();
                $r = $ca->assoc();
                $rta = $r["encabezado"];
            }
        } else {
            $ca->prepareSelect("nw_export_calculate_enc", "*", "empresa=:empresa and usuario=:usuario");
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            if (!$ca->exec()) {
                return "Error ejecutando la consulta: Error:" . $ca->lastErrorText() . ". Query:" . $ca->preparedQuery();
            }
            if ($ca->size() == 0) {
                $ca->prepareSelect("nw_export_calculate_dev", "*", "empresa=:empresa");
                $ca->bindValue(":empresa", $si["empresa"]);
                if (!$ca->exec()) {
                    return "Error ejecutando la consulta: Error:" . $ca->lastErrorText() . ". Query:" . $ca->preparedQuery();
                }
                if ($ca->size() == 0) {
                    include_once dirname(__FILE__) . '/nw_calc_test.inc.php';
                } else {
                    $ca->next();
                    $r = $ca->assoc();
                    $rta = $r["encabezado"];
                }
            } else {
                $ca->next();
                $r = $ca->assoc();
                $rta = $r["encabezado"];
            }
        }
        return $rta;
    }

}

print nw_export_enc::start();
?>