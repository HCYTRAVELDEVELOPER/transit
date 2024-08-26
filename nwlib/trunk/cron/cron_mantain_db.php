<?php

/* * ***********************************************************************

  Copyright:
  2015 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

$appPath = "";

if (!isset($argv[1])) {
    error_log("No se pasó como parámetro la carpeta del aplicativo");
    echo "No se pasó como parámetro la carpeta del aplicativo";
    return;
}

$appPath = explode("=", $argv[1]);
$appPath = $appPath[1];

require_once dirname(__FILE__) . '/../../' . $appPath . '/rpcsrv/_mod.inc.php';

class cron_mantain_db {

    public static function consulta() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("VACUUM ANALYSE");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepare("select current_database() as db");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            $ca->prepare("REINDEX DATABASE :db");
            $ca->bindValue(":db", $r["db"], false);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        echo "Trabajo realizado correctamente";
        return true;
    }

}

cron_mantain_db::consulta();
?>