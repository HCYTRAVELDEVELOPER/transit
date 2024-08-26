<?php

/* * ***********************************************************************

  Copyright:
  2015 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

use php\manager\crontab\CrontabManager;

class nw_cron {

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        if (isset($p["filtro"]) && $p["filtro"] != "") {
            $where .= " and (lower(id::text) like lower('%{$p["filtro"]}%') 
                        or lower(nombre::text) like lower('%{$p["filtro"]}%')
                        or lower(trabajo::text) like lower('%{$p["filtro"]}%'))";
        }
        $ca->prepareSelect("nw_cron", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function eliminar($p) {
        include_once dirname(__FILE__) . "/../includes/php-crontab-manager/src/CrontabManager.php";
        include_once dirname(__FILE__) . "/../includes/php-crontab-manager/src/CronEntry.php";

        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_cron", "*", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $r = null;
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            $ca->prepareDelete("nw_cron", "id=:id and empresa=:empresa");
            $ca->bindValue(":id", $p);
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
        $toDelete = "";
        $r["trabajo"] = str_replace("/usr/bin/php -f ", "", $r["trabajo"]);
        $r["trabajo"] = str_replace("&> /dev/null", "", $r["trabajo"]);
        $ra = explode(" ", $r["trabajo"]);
        $ra = explode("/", $ra[0]);
        $toDelete = trim(array_pop($ra));
        $crontab = new CrontabManager();
        $crontab->deleteJob($toDelete);
        $crontab->save(false);

        $db->commit();
        return true;
    }

    public static function save($p) {
        include_once dirname(__FILE__) . "/../includes/php-crontab-manager/src/CrontabManager.php";
        include_once dirname(__FILE__) . "/../includes/php-crontab-manager/src/CronEntry.php";
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $fields = "nombre,trabajo,usuario,fecha,empresa,minuto,hora,dia_mes,mes,dia_semana";
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_cron", $fields);
        } else {
            $ca->prepareUpdate("nw_cron", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":trabajo", $p["trabajo"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":minuto", $p["minuto"]);
        $ca->bindValue(":hora", $p["hora"]);
        $ca->bindValue(":dia_mes", $p["dia_mes"]);
        $ca->bindValue(":mes", $p["mes"]);
        $ca->bindValue(":dia_semana", $p["dia_semana"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $crontab = new CrontabManager();
        $job = $crontab->newJob();
        $job->onMinute($p["minuto"] == 0 ? "*" : $p["minuto"]);
        $job->onHour($p["hora"] == 0 ? "*" : $p["hora"]);
        $job->onDayOfMonth($p["dia_mes"] == 0 ? "*" : $p["dia_mes"]);
        $job->onMonth($p["mes"] == 0 ? "*" : $p["mes"]);
        $job->onDayOfWeek($p["dia_semana"] == 0 ? "*" : $p["dia_semana"]);
        $job->doJob($p["trabajo"]);
        $crontab->add($job);
        $crontab->save();

        $db->commit();
        return true;
    }

}

?>