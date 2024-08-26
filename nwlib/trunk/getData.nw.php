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
NWLib::requireOnceModule("rpc/nwjsonrpc.inc.php");

if (function_exists('set_time_limit')) {
    set_time_limit(0);
}

class getData {

    public static function consulta($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect($p, "*");
        if (!$ca->exec()) {
            self::error($ca->lastErrorText());
            return false;
        }
        self::response($ca->assocAll());
    }

    public static function insert() {
        $request = file_get_contents('php://input');
        $p = json_decode($request, true);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        for ($i = 0; $i < count($p["data"]); $i++) {
            $r = $p["data"][$i];
            $fields = array_keys($p["data"][$i]);
            for ($iz = 0; $iz < count($fields); $iz++) {
                if ($fields[$iz] == "id") {
                    unset($fields[$iz]);
                    break;
                }
            }
            $fields = implode(",", $fields);
            $ca->prepareInsert($p["table"], $fields);
            foreach ($r as $key => $value) {
                if ($key == "id") {
                    continue;
                }
                $ca->bindValue(":" . $key, $value, true, true);
            }
            if (!$ca->exec()) {
                $db->rollback();
                self::error($ca->lastErrorText());
                return false;
            }
        }
        $db->commit();
        $rta = Array();
        $rta["response"] = true;
        self::responseJson($rta);
    }

    public static function error($message) {
        header('Content-type: application/javascript; charset=utf-8');
        $callback = filter_input(INPUT_GET, 'callback');
        $r = Array();
        $r["error"] = true;
        $r["message"] = $message;
        print sprintf('%s(%s);', $callback, json_encode($r));
    }

    public static function errorJson($r) {
        $rta = Array();
        $rta["error"] = true;
        $rta["message"] = $r;
        print json_encode($rta);
    }
    
    public static function responseJson($r) {
        print json_encode($r);
    }

    public static function response($r) {
        $callback = filter_input(INPUT_GET, 'callback');
        header('Content-type: application/javascript; charset=utf-8');
        print sprintf('%s(%s);', $callback, json_encode($r));
    }

}

$rta = Array();
$key = filter_input(INPUT_GET, 'key');
if (!$key) {
    return;
}
$keyArr = explode(":", $key);
$t = filter_input(INPUT_GET, 'table');
$table = !isset($t) ? "x" : $t;

if (!isset($keyArr[1])) {
    getData::error("No existe uno de los parámetros de autenticación");
    return;
}
if (md5($table) != $keyArr[1]) {
    getData::error("Uno de los parámetros de autenticación es incorrecto");
    return;
}
$type = filter_input(INPUT_GET, "type");
if (null == $type) {
    getData::error("Hay un problema con el tipo. Comuníquese con el administrador");
    return;
}
switch ($type) {
    case "receive":
        getData::consulta($table);
        break;
    case "send":
        getData::insert();
        break;

    default:
        break;
}
