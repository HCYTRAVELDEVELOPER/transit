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

class nw_sync {

    public static function deleteExp($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_sync_enc", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_sync_tables", "enc=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
    }

    public static function selectEnc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_sync_enc", "*", "id=:id");
        $ca->bindValue(":id", $p["conexion"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->flush();
    }

    public static function sendDataByCurl($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $data = self::getDataByTableNotRepeat($p["table"]);
        include_once dirname(__FILE__) . '/../../nwlib6/rpc/nwApi.inc.php';
        $nwApi = new nwApi("http://192.168.1.41/rpcsrv/api.inc.php");
        $r = Array();
        $r["data"] = $data;
        $r["table"] = $p["table"];
        $nwApi->setUser("juliand");
        $nwApi->setPassword("padre08");
        $nwApi->setProfile("33");
        $nwApi->setCompany("157");
        $nwApi->startSession();
        $arr = $r;
        $method = "savePacientes";
        $class = "datos_basicos";
        $res = $nwApi->exec($method, $class, $arr);
        if (isset($res["result"])) {
            for ($i = 0; $i < count($data); $i++) {
                $ca->prepareInsert("nw_sync_history", "tabla,id_enviado,usuario,fecha,empresa");
                $ca->bindValue(":tabla", $p["table"]);
                $ca->bindValue(":id_enviado", $data[$i]["id"]);
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":fecha", date("Y-m-d"));
                $ca->bindValue(":empresa", $si["empresa"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
                    return false;
                }
            }
        } else {
            NWJSonRpcServer::console("No se conectó con WS, result: " . json_encode($nwApi->errorMessage));
        }
        $db->commit();
        return self::responseCurl($p["table"], count($data), $result);
    }

    public static function responseCurl($table, $size, $message) {
        $rta = Array();
        $rta["table"] = $table;
        $rta["enviados"] = $size;
        $rta["respuesta"] = $message;
        return $rta;
    }

    public static function saveData($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete($p["table"], "1=1");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        for ($i = 0; $i < count($p["data"]); $i++) {
            $r = $p["data"][$i];
            $fields = array_keys($p["data"][$i]);
            $fields = implode(",", $fields);
            $ca->prepareInsert($p["table"], $fields);
            foreach ($r as $key => $value) {
                $ca->bindValue(":" . $key, $value, true, true);
            }
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::information("Hay un problema con las tablas: " . $ca->lastErrorText());
                return false;
            }
        }
        $db->commit();
        return true;
    }

    public static function getDataByTableNotRepeat($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id_cast = " CAST (id as int) ";
        $ca->prepareSelect($p, "*", "$id_cast NOT IN (select id_enviado from nw_sync_history where tabla=:tabla) ");
        $ca->bindValue(":tabla", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getDataByTableJoinNotRepeat($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id_cast = " CAST (id as int) ";
        $ca->prepareSelect($p, "*", "$id_cast NOT IN (select id_enviado from nw_sync_history where tabla=:tabla) ");
        $ca->bindValue(":tabla", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getDataByTable($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect($p, "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function syncAll($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_sync_enc", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
    }

    public static function addMain($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("nw_sync_enc", "nombre,empresa,usuario,fecha,url");
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":url", $p["url"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return true;
    }

    public static function getMain($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("nw_sync_enc", "id, CONCAT(id, '.', nombre, ' (', url , ')') as nombre,usuario,fecha,empresa,url,json", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function deleteTableById($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_exp_tables", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_exp_fields", "tabla=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
    }

    public static function deleteConectionById($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_exp_conections", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
    }

    public static function deleteFieldById($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_exp_fields", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
    }

    public static function saveOrder($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        for ($i = 0; $i < count($p["records"]); $i++) {
            $r = $p["records"][$i];
            $ca->prepareUpdate("nw_exp_fields", "orden", "id=:id");
            $ca->bindValue(":id", $r["id"]);
            $ca->bindValue(":orden", $r["order"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                return false;
            }
        }
        $db->commit();
    }

    public static function saveNewFields($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        if (isset($p["id"]) && $p["id"] != "") {
            $ca->prepareUpdate("nw_sync_tables", "nombre,tipo,usuario,fecha,empresa,"
                    . "nivel,nivel_pariente,camposDisponibles,campos_tabla_destino,"
                    . "orden,validacion,campo_validar", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        } else {
            $ca->prepareInsert("nw_sync_tables", "nombre,enc,tipo,usuario,fecha,empresa,"
                    . "nivel,nivel_pariente,camposDisponibles,campos_tabla_destino,"
                    . "orden,validacion,campo_validar,tabla_a_conectar");
        }
        $ca->bindValue(":nombre", $p["tabla"]);
        $ca->bindValue(":enc", $p["enc"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":nivel", $p["nivel"]);
        $ca->bindValue(":nivel_pariente", $p["nivel_pariente"]);
        $ca->bindValue(":camposDisponibles", $p["camposDisponibles"]);
        $ca->bindValue(":campos_tabla_destino", $p["campos_tabla_destino"]);
        $ca->bindValue(":orden", $p["orden"]);
        $ca->bindValue(":tabla_a_conectar", $p["tabla_a_conectar"]);
        $ca->bindValue(":validacion", $p["validacion"]);
        $ca->bindValue(":campo_validar", $p["campo_validar"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit
        ();
    }

    public static function saveTable($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_sync_tables ", "* ", "nombre = :tabla");
        $ca->bindValue(":tabla", $p["table"]["value"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            $id = $ca->getNextId($ca, "nw_sync_tables");
            $ca->prepareInsert("nw_sync_tables ", "id, nombre, empresa, fecha, usuario, enc");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":enc", $p["enc"]);
        } else {
            $ra = $ca->flush();
            $id = $ra["id"];
            $ca->prepareUpdate("nw_sync_tables ", "empresa, fecha, usuario ", "nombre = :tabla");
            $ca->bindValue(":tabla", $p["table"]["value"]);
        }
        $ca->bindValue(":nombre", $p["table"]["value"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha ", date("Y-m-d"));
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }

        $db->commit
        ();
    }

    public static function searchFieldsByTable($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("SELECT column_name as nombre, column_name as id, column_name as field_name, ordinal_position, column_default as default,
                    data_type as field_type, character_maximum_length as size,(
                    select pg_catalog.col_description(oid, cols.ordinal_position::int)
                    from pg_catalog.pg_class c
                    where c.relname = cols.table_name
                    ) as descripcion, cols.table_name,
                    CASE WHEN is_nullable = 'YES' THEN
                    'f' ELSE 't' END as not_null,
                    nw_admindb_getkey(cols.table_name::character varying, column_name::character varying) as primary_key,
                    nw_admindb_unique(cols.table_name::character varying, column_name::character varying) as unique
                    FROM information_schema.columns cols
                    WHERE
                    cols.table_name = :table
                    order by column_name, cols.ordinal_position");
        $ca->bindValue(":table", $p["tabla"], true);
        
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function searchTables(
            $p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select table_name as id, table_name as nombre from information_schema.tables where table_schema = 'public' order by table_name");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getTablesByEnc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        if ((isset($p["filters"]) && isset($p["filters"]["conexion"]) && $p["filters"]["conexion"] != "") || (isset($p["model"]) && $p["model"] != "")) {
            if (isset($p["filters"]) && isset($p["filters"]["conexion"]) && $p["filters"]["conexion"] != "") {
                $where = " and nivel='1'";
            }
            $ca->prepare("select * from nw_sync_tables where 1=1 " . $where . " order by nivel,orden asc");
            $ca->bindValue(":enc", (isset($p["model"]) && $p["model"] != "") ? $p["model"] : $p["filters"]["conexion"] );
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                return false;
            }
            return $ca->assocAll($p);
        } else {
            NWJSonRpcServer::information("Debe ingresar una conexión");
        }
    }

    public static function getTablesByEncAndModel($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select * from nw_sync_tables where nivel = :nivel");
        $ca->bindValue(":nivel", $p["nivel_pariente"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getTablesByDependecy($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select * from nw_sync_tables where tabla_a_conectar = :tabla_a_conectar");
        $ca->bindValue(":tabla_a_conectar", $p, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getFieldsByEnc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select *, CASE WHEN nombre_campo IS NULL THEN nombre ELSE nombre_campo END AS nombre_campo"
                . " from nw_exp_fields where enc = :enc order by orden");
        $ca->bindValue(":enc", $p["model"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getFieldsByTable(
            $p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select a.*, b.nombre as nombre_tabla from nw_exp_fields a left join nw_exp_tables b on(a.tabla = b.id) where a.tabla = :enc");
        $ca->bindValue(":enc", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

}

?>
