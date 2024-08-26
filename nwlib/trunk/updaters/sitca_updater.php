<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class sitca_updater {

    public static function start($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);
        
        $sql = "CREATE TABLE idiomas (
	id serial primary key,
	name_in_english varchar(3)
        )";
        
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        return true;
    }

}
