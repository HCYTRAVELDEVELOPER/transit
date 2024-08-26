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
//session::check();

$db = NWDatabase::database();

$ca = new NWDbQuery($db);
$ca->prepare('LOAD DATA LOCAL INFILE "/var/www/nwproject5/tmp/last_tarifas.txt" INTO TABLE telmex_temporal FIELDS TERMINATED BY "||" LINES TERMINATED BY "\r\n" ');
if (!$ca->exec()) {
    echo "Error ejecutando la consulta: " . $ca->lastErrorText();
    echo "<br />";
    echo "<br />";
    echo $ca->preparedQuery();
    return false;
}
echo "OK!";
?>
