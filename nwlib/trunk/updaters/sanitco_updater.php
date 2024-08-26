<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class sanitco_updater {

    public static function start($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);
        $sql = "";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }

        $sql = "alter table empresas add column informe_texto_licencia text;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        return true;
    }

}
