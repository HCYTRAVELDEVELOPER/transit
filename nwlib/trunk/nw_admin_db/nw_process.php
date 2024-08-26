<?php

/* * ***********************************************************************

  Copyright:
  2014 Netwoods.net, http://www.netwoods.net

  Author:
  Lady Gonzalez

 * *********************************************************************** */

class nw_process {

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $db = new NWDatabase();
        if ($p["filters"]["host"] != "" && $p["filters"]["password"] != "" ) {
            $_SESSION["user_db" . 'template1'] = $p["filters"]["user_name"];
            $_SESSION["host_db" . 'template1'] = $p["filters"]["host"];
            $_SESSION["pass_db" . 'template1'] = $p["filters"]["password"];
            $_SESSION["driver_db" . 'template1'] = $p["filters"]["driver"];
            $_SESSION["db_name" . 'template1'] = "template1";
        }
        $db->setHostName($_SESSION["host_db" . 'template1']);
        $db->setUserName($_SESSION["user_db" . 'template1']);
        $db->setPassword($_SESSION["pass_db" . 'template1']);
        $db->setDriver($_SESSION["driver_db" . 'template1']);
        $db->setDatabaseName("template1");
        $db->open_();

        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["busca"]) && $p["filters"]["busca"] != "") {
                
            }
        }
        $ca->prepare("SELECT *,pid as procpid,xact_start-backend_start as time,
            round(EXTRACT (EPOCH FROM (xact_start-backend_start)::time)) as seconds,
             CASE WHEN round(EXTRACT (EPOCH FROM (xact_start-backend_start)::time))>120 THEN 'resource/qxnw/red.png'
             WHEN round(EXTRACT (EPOCH FROM (xact_start-backend_start)::time))>60 and  round(EXTRACT (EPOCH FROM (xact_start-backend_start)::time))<120 THEN 'resource/qxnw/yellow.png'
             ELSE  'resource/qxnw/green.png' END as online
                            FROM pg_stat_activity", $where, "order by (xact_start-backend_start) desc");
        if (isset($p["filters"]["tabla"]) && $p["filters"]["tabla"] != "") {
            $ca->bindValue(":tabla", $p["filters"]["tabla"], false);
        }
        $ca->bindValue(":tabla", $p["filters"]["tabla"], false);
        return $ca->execPage($p);
    }

    public static function delete_conection($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (count($p) > 0) {
            foreach ($p as $r) {
                $ca->prepare("SELECT pg_cancel_backend(:procpid)");
                $ca->bindValue(":procpid", $r["procpid"]);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
                }
                $ca->prepare("SELECT pg_terminate_backend(:procpid)");
                $ca->bindValue(":procpid", $r["procpid"]);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
                }
            }
        }
        return true;
    }

    public static function populateViews($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select viewname as id,viewname as nombre,'view' as tipo from pg_views where schemaname='public' order by viewname ASC");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function populateFunctions($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select routine_name as id,routine_name as nombre,'function' as tipo from information_schema.routines where specific_schema='public' order by routine_name ASC");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function populateTriggers($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select  tgname as id,tgname as nombre,'trigger' as tipo  from pg_trigger order by tgname ASC");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function populateSequences($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select sequence_name as id,sequence_name as nombre,'sequence' as tipo from
                information_schema.sequences order by sequence_name ASC");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function populateOwner($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select rolname as id, rolname as nombre  from pg_roles");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function populateTypes($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select typname as id, typname as nombre  from pg_type;");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function save_configurations($p) {

        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_admindb_configurations", "role,view_compilation,empresa,fecha");
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":telefono", $p["telefono"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function populateFieldsByTable($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("SELECT column_name as field_name,ordinal_position,column_default as default,
            data_type as field_type,character_maximum_length as size,(
                select pg_catalog.col_description(oid, cols.ordinal_position::int)
                from pg_catalog.pg_class c
                where c.relname = cols.table_name
                ) as descripcion,cols.table_name,
                CASE WHEN is_nullable = 'YES' THEN
                 'f' ELSE 't' END as not_null,
                 nw_admindb_getkey(cols.table_name::character varying,column_name::character varying) as primary_key,
                 nw_admindb_unique(cols.table_name::character varying,column_name::character varying) as unique
                FROM information_schema.columns cols
            WHERE 
                cols.table_name =:table
                order by cols.ordinal_position");
        $ca->bindValue(":table", $p, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

}

?>