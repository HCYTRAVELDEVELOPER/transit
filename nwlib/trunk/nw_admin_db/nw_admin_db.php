<?php

/* * ***********************************************************************

  Copyright:
  2014 Netwoods.net, http://www.netwoods.net

  Author:
  Lady Gonzalez

 * *********************************************************************** */

class nw_admin_tables {

    public static function consulta($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $fields = "imp";
        $where = " 1=1 ";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["busca"]) && $p["filters"]["busca"] != "") {
                
            }
        }
        $ca->prepareSelect(":tabla", "*", $where);
        if (isset($p["filters"]["tabla"]) && $p["filters"]["tabla"] != "") {
            $ca->bindValue(":tabla", $p["filters"]["tabla"], false);
        }
        $ca->bindValue(":tabla", $p["filters"]["tabla"], false);
        return $ca->execPage($p);
    }

    public static function populateFunctionsByName($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca->prepare("SELECT a.rolname AS owner,
  n.nspname AS shema,
  p.proname AS name,
  'function' as tipo,
  pg_get_functiondef(p.oid) AS object
FROM pg_language AS l
JOIN pg_proc AS p
ON p.prolang = l.oid
JOIN pg_namespace AS n
ON p.pronamespace = n.oid
JOIN pg_authid AS a
ON a.oid = p.proowner
WHERE l.lanname = 'plpgsql' and proname=:name
ORDER BY shema ASC,
 proname ASC");
        $ca->bindValue(":name", $p["nombre"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function populateViewsByName($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca->prepare("select *,'view' as tipo from pg_views a join
     information_schema.columns b on a.viewname=b.table_name
     where table_name=:name");
        $ca->bindValue(":name", $p["nombre"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateServers($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select *,'host' as tipo from nwdb_server where usuario=:usuario");
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTableProcces($p) {
        session::check();

        $server = self::populateServers($p);
        $p = $server[0]["host"];
        $host = self::populateDBS($p);
        $h["model"] = $host[0];
        $rest = self::populateTables($h);

        return $rest;
    }

    public static function viewCompilate($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_admindb_configurations", "view_compilation", "1=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $res = $ca->flush();
        $view_comp = "f";
        if (!$res) {
            $view_comp = "f";
        } else {
            $view_comp = $res["view_compilation"];
        }
        return $view_comp;
    }

    public static function deleteDatabases($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nwdb_server_db", "host=:host and db_name=:db_name and usuario=:usuario");
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":db_name", $p["db_name"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function deleteServers($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nwdb_server", "host=:host and usuario=:usuario");
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $ca->prepareDelete("nwdb_server_db", "host=:host and usuario=:usuario");
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function populateTables($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("select tablename as id,tablename as nombre,'table' as tipo from pg_tables where schemaname='public' order by tablename ASC");
        }
        if ($driver == "MYSQL") {
            $ca->prepare("select table_name as id, table_name as nombre,'table' as tipo from information_schema.tables where table_schema=:db_name");
            $ca->bindValue(":db_name", $db->getDatabaseName(), true);
        }
        if ($driver == "ORACLE") {
            $ca->prepare("select tablename as id,tablename as nombre,'table' as tipo from pg_tables where schemaname='public' order by tablename ASC");
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateDBS($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select a.*,a.db_name as nombre,'db' as tipo,b.driver from nwdb_server_db a join nwdb_server b on (a.host=b.host and a.usuario=b.usuario) where a.usuario=:usuario and a.host=:host");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":host", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function deleteRowTable($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete(":table", "id=:id");
        $ca->bindValue(":table", $p["tabla"], false);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function saveTableSimple($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $fields = "";
        for ($i = 0; $i < count($p["columns"]); $i++) {
            if ($i == 0) {
                $fields = $p["columns"][$i]["field_name"];
            } else {
                $fields .= "," . $p["columns"][$i]["field_name"];
            }
        }
        if ($p["id"] == "") {
            $ca->prepareInsert(":table", $fields);
        } else {
            $ca->prepareUpdate(":table", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        for ($i = 0; $i < count($p["columns"]); $i++) {
            $ca->bindValue(":" . $p["columns"][$i]["field_name"], $p[$p["columns"][$i]["field_name"]]);
        }
        $ca->bindValue(":table", $p["tabla"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function pg_dumpDataBase($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $output = "";
        if ($driver == "PGSQL") {
            $filePath = $_SERVER["DOCUMENT_ROOT"] . "/tmp/{db_name}{date}.tar.gz";
            $filePath = str_replace("{" . "db_name" . "}", $db->getDatabaseName(), $filePath);
            $filePath = str_replace("{" . "date" . "}", date("Y-m-d"), $filePath);
            $pg_dump = "export PGPASSWORD={pass_db}; pg_dump -U {user_db} -h {host_db} -Ft -d {db_name} | gzip > {$filePath}";
            $pg_dump = str_replace("{" . "user_name" . "}", $si["user_db"], $pg_dump);
            $pg_dump = str_replace("{" . "host_db" . "}", $si["host_db"], $pg_dump);
            $pg_dump = str_replace("{" . "db_name" . "}", $db->getDatabaseName(), $pg_dump);
            $pg_dump = str_replace("{" . "pass_db" . "}", $si["pass_db"], $pg_dump);
            $pg_dump = str_replace("{" . "user_db" . "}", $si["user_db"], $pg_dump);
        } else if ($driver == "MYSQL") {
            $filePath = $_SERVER["DOCUMENT_ROOT"] . "/tmp/{db_name}{date}.sql";
            $filePath = str_replace("{" . "db_name" . "}", $db->getDatabaseName(), $filePath);
            $filePath = str_replace("{" . "date" . "}", date("Y-m-d"), $filePath);
            $pg_dump = "export PGPASSWORD={pass_db}; mysqldump -u {user_db} -h {host_db} -p {db_name} > {$filePath}";
            $pg_dump = str_replace("{" . "user_name" . "}", $si["user_db"], $pg_dump);
            $pg_dump = str_replace("{" . "host_db" . "}", $si["host_db"], $pg_dump);
            $pg_dump = str_replace("{" . "db_name" . "}", $db->getDatabaseName(), $pg_dump);
            $pg_dump = str_replace("{" . "pass_db" . "}", $si["pass_db"], $pg_dump);
            $pg_dump = str_replace("{" . "user_db" . "}", $si["user_db"], $pg_dump);
        }
        exec($pg_dump, $output);

        $ca->prepareSelect("nw_downloads", "max(id) as id");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $id = 1;
        $r = $ca->flush();
        if ($r != false) {
            $id = $r["id"] + 1;
        }
        $clave = master::get_random_string("abcdefghijkLMNWefr", 20);
        $ca->prepareInsert("nw_downloads", "id,file_name,path,clave,parte,fecha_creacion,usuario,num_rows");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":file_name", basename($filePath));
        $ca->bindValue(":path", $filePath);
        $ca->bindValue(":clave", $clave);
        $ca->bindValue(":parte", $_SESSION["usuario"]);
        $ca->bindValue(":fecha_creacion", date("Y-m-d"));
        $ca->bindValue(":usuario", $_SESSION["usuario"]);
        $ca->bindValue(":num_rows", 0);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $rta = Array();
        $rta["id"] = $id;
        $rta["key"] = $clave;
        return $rta;
    }

    public static function pg_restoreDataBase($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $output = "";
//         NWJSonRpcServer::information($si["pass_db"]);
        $filePath = $_SERVER["DOCUMENT_ROOT"] . "{$p["adjunto"]}";
        $pg_dump = "gzip -d {fullpath};export PGPASSWORD='{pass_db}'; pg_restore -U {user_db} -h {host_db}  -d {db_name} {fullpathy}";
        $pg_dump = str_replace("{" . "user_name" . "}", $si["user_db"], $pg_dump);
        $pg_dump = str_replace("{" . "host_db" . "}", $si["host_db"], $pg_dump);
        $pg_dump = str_replace("{" . "db_name" . "}", $db->getDatabaseName(), $pg_dump);
        $pg_dump = str_replace("{" . "pass_db" . "}", $si["pass_db"], $pg_dump);
        $pg_dump = str_replace("{" . "user_db" . "}", $si["user_db"], $pg_dump);
        $pg_dump = str_replace("{" . "fullpath" . "}", str_replace("//", "/", $filePath), $pg_dump);
        $pg_dump = str_replace("{" . "fullpathy" . "}", str_replace(".gz", "", $filePath), $pg_dump);
        $pg_dump = str_replace("{" . "fullpathy" . "}", str_replace("//", "/", $filePath), $pg_dump);
//           NWJSonRpcServer::information($pg_dump);
        exec($pg_dump, $output);

//        NWJSonRpcServer::information("jhgjhg");
    }

    public static function populateDescriptionTable($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $ca->prepare("select obj_description('public.{$p["nombre"]}' ::regclass) as description");
        }
        if ($driver == "MYSQL") {
            $ca->prepare("SELECT  TABLE_COMMENT as description
FROM information_schema.tables
WHERE table_schema = :db_name AND table_name = :table");
            $ca->bindValue(":db_name", $db->getDatabaseName(), true);
            $ca->bindValue(":table", $p["nombre"], true);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $r = $ca->flush();
        if (isset($r["description"]) && $r["description"] != "") {
            $obj = json_encode($r["description"]);
//            return $obj;
            return $r["description"];
        }
    }

    public static function populateDDL($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $ca->prepare("CREATE OR REPLACE FUNCTION generate_create_table_statement(p_table_name varchar)
                RETURNS text AS
                \$BODY$
                DECLARE
                    v_table_ddl   text;
                    column_record record;
                BEGIN
                FOR column_record IN 
                SELECT 
                    b.nspname as schema_name,
                    b.relname as table_name,
                    a.attname as column_name,
                    pg_catalog.format_type(a.atttypid, a.atttypmod) as column_type,
            CASE WHEN 
                (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid) for 128)
                 FROM pg_catalog.pg_attrdef d
                 WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef) IS NOT NULL THEN
                'DEFAULT '|| (SELECT substring(pg_catalog.pg_get_expr(d.adbin, d.adrelid) for 128)
                              FROM pg_catalog.pg_attrdef d
                              WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef)
            ELSE
                ''
            END as column_default_value,
            CASE WHEN a.attnotnull = true THEN 
                'NOT NULL'
            ELSE
                'NULL'
            END as column_not_null,
            a.attnum as attnum,
            e.max_attnum as max_attnum
            FROM 
            pg_catalog.pg_attribute a
            INNER JOIN 
             (SELECT c.oid,
                n.nspname,
                c.relname
              FROM pg_catalog.pg_class c
                   LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
              WHERE c.relname ~ ('^('||p_table_name||')$')
                AND pg_catalog.pg_table_is_visible(c.oid)
              ORDER BY 2, 3) b
            ON a.attrelid = b.oid
            INNER JOIN 
             (SELECT 
                  a.attrelid,
                  max(a.attnum) as max_attnum
              FROM pg_catalog.pg_attribute a
              WHERE a.attnum > 0 
                AND NOT a.attisdropped
              GROUP BY a.attrelid) e
            ON a.attrelid=e.attrelid
            WHERE a.attnum > 0 
          AND NOT a.attisdropped
            ORDER BY a.attnum
        LOOP
        IF column_record.attnum = 1 THEN
            v_table_ddl:='CREATE TABLE '||column_record.schema_name||'.'||column_record.table_name||' (';
        ELSE
            v_table_ddl:=v_table_ddl||',';
        END IF;

        IF column_record.attnum <= column_record.max_attnum THEN
            v_table_ddl:=v_table_ddl||chr(10)||
                     '    '||column_record.column_name||' '||column_record.column_type||' '||column_record.column_default_value||' '||column_record.column_not_null;
        END IF;
        END LOOP;

        v_table_ddl:=v_table_ddl||');';
        RETURN v_table_ddl;
       END;
        \$BODY$
        LANGUAGE 'plpgsql' COST 100.0 SECURITY INVOKER;");
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $ca->prepare("SELECT generate_create_table_statement('{$p["nombre"]}') as ddl;");
        }
        if ($driver == "MYSQL") {
            $ca->prepare("show create table {$si["db_name" . $p["model"]["host"]]}.{$p["nombre"]};");
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $r = $ca->flush();
        if ($driver == "MYSQL") {
            if (isset($r["Create Table"]) && $r["Create Table"] != "") {
                return $r["Create Table"];
            } else {
                return "";
            }
        } else {
            if (isset($r["ddl"]) && $r["ddl"] != "") {
                return $r["ddl"];
            } else {
                return "";
            }
        }
    }

    public static function populateViews($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("select viewname as id,viewname as nombre,'view' as tipo from pg_views where schemaname='public' order by viewname ASC");
        } else if ($driver == "MYSQL") {
            NWJSonRpcServer::information("En Desarrollo");
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateFunctions($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("select routine_name as id,routine_name as nombre,'function' as tipo from information_schema.routines where specific_schema='public' order by routine_name ASC");
        } else if ($driver == "MYSQL") {
            NWJSonRpcServer::information("Depreciado para nuestras plataformas MYSQL no maneja funciones dinamicas si no procedimientos");
            return;
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function setUserConection($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $_SESSION["user_db" . $p["db_name"] . $p["host"]] = $p["user_name"];
        $_SESSION["host_db" . $p["db_name"] . $p["host"]] = $p["host"];
        $_SESSION["pass_db" . $p["db_name"] . $p["host"]] = $p["password"];
        $_SESSION["driver_db" . $p["db_name"] . $p["host"]] = $p["driver"];
        $_SESSION["db_name" . $p["host"]] = $p["db_name"];
        $ca->prepareDelete("nw_server_db", "driver=:driver and host=:host and 
        dbname=:dbname and username=:username");
        $ca->bindValue(":driver", $p["driver"]);
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":dbname", $p["db_name"]);
        $ca->bindValue(":username", $p["user_name"]);
        $ca->bindValue(":puerto", "");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareInsert("nw_server_db", "driver,host,dbname,username,pass,puerto");
        $ca->bindValue(":driver", $p["driver"]);
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":dbname", $p["db_name"]);
        $ca->bindValue(":username", $p["user_name"]);
        $ca->bindValue(":pass", $p["password"]);
        $ca->bindValue(":puerto", "");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function findConection($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_server_db", "*", "driver=:driver and host=:host and dbname=:dbname and username=:username");
        $ca->bindValue(":driver", $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $ca->bindValue(":host", $si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $ca->bindValue(":dbname", $si["db_name" . $p["model"]["host"]]);
        $ca->bindValue(":username", $si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function testConection($p) {
        session::check();
        $si = session::info();
        $db = $db = new NWDatabase();
        $db->setHostName($p["host"]);
        $db->setUserName($p["user_name"]);
        $db->setPassword($p["password"]);
        $db->setDriver($p["driver"]);
        $db->setDatabaseName($p["db_name"]);
        if ($db->open_()) {
            return true;
        } else {
            NWJSonRpcServer::information("No se logro la conexión");
        }

//        $_SESSION["user_db" . $p["db_name"] . $p["host"]] = $p["user_name"];
//        $_SESSION["host_db" . $p["db_name"] . $p["host"]] = $p["host"];
//        $_SESSION["pass_db" . $p["db_name"] . $p["host"]] = $p["password"];
//        $_SESSION["driver_db" . $p["db_name"] . $p["host"]] = $p["driver"];
//        $_SESSION["db_name" . $p["host"]] = $p["db_name"];
        return true;
    }

    public static function populateTriggers($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("select  tgname as id,tgname as nombre,'trigger' as tipo  from pg_trigger order by tgname ASC");
        } else if ($driver == "MYSQL") {
            NWJSonRpcServer::information("Depreciado para nuestras plataformas MYSQL no maneja funciones dinamicas si no procedimientos");
            return;
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateSequences($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("select sequence_name as id,sequence_name as nombre,'sequence' as tipo,increment,
            maximum_value,start_value,minimum_value,'pgsql' as driver from
                information_schema.sequences order by sequence_name ASC");
        } else if ($driver == "MYSQL") {
            $ca->prepare("select table_name as id, table_name as nombre,'sequence' as tipo,'mysql' as driver
                from information_schema.tables where table_schema=:db_name");
        }
        $ca->bindValue(":db_name", $db->getDatabaseName(), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateNextvalue($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $next = master::getNextSequence("{$p["nombre"]}");
        return $next;
    }

    public static function populateOwner($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $ca->prepare("select rolname as id, rolname as nombre  from pg_roles");
        } else if ($driver == "MYSQL") {
            $ca->prepare("SELECT user as id, user as nombre FROM mysql.user");
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateIndex($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "MYSQL") {
            $ca->prepare("SHOW INDEX FROM :db_name.:table_name where Key_name='PRIMARY'");
        }
        $ca->bindValue(":db_name", $db->getDatabaseName(), false);
        $ca->bindValue(":table_name", $p["nombre"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function populateTypes($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca->prepare("select typname as id, typname as nombre  from pg_type;");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function save_configurations($p) {

        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_admindb_configurations", "1=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $ca->prepareInsert("nw_admindb_configurations", "usuario,view_compilation");
        $ca->bindValue(":view_compilation", $p["view_compilation"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function populateConfigurations($p) {

        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_admindb_configurations", "*", "usuario=:usuario");
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->flush();
    }

    public static function populateDatabases($p) {

        session::check();
        $si = session::getInfo();
        $db = new NWDatabase();
        $db->setHostName($p["host"]);
        $db->setUserName($p["user_name"]);
        $db->setPassword($p["password"]);
        $db->setDriver($p["driver"]);
        $driver = $p["driver"];
        if ($driver == "PGSQL") {
            $db->setDatabaseName('template1');
        }
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        if ($driver == "PGSQL") {
            $ca->prepareSelect("pg_database", "datname as id, datname as nombre");
        }
        if ($driver == "MYSQL") {
            $ca->prepareSelect("information_schema.schemata", "schema_name as id, schema_name as nombre");
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveServers($p) {
        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["tipo"] == "new") {
            $ca->prepareSelect("nwdb_server", "*", "host=:host and usuario=:usuario");
            $ca->bindValue(":host", $p["host"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                NWJSonRpcServer::information("Este servidor ya lo tienes configurado");
                return;
            }
            $ca->prepareInsert("nwdb_server", "host,driver,nombre,user_name,usuario,password,fecha");
            $ca->bindValue(":host", $p["host"]);
            $ca->bindValue(":nombre", $p["nombre"]);
            $ca->bindValue(":user_name", $p["user_name"]);
            $ca->bindValue(":driver", $p["driver"]);
            $ca->bindValue(":password", $p["password"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
        } else {
            $ca->prepareUpdate("nwdb_server", "host,driver,nombre,user_name,usuario,password,fecha", "host=:host");
            $ca->bindValue(":host", $p["host"]);
            $ca->bindValue(":nombre", $p["nombre"]);
            $ca->bindValue(":user_name", $p["user_name"]);
            $ca->bindValue(":driver", $p["driver"]);
            $ca->bindValue(":password", $p["password"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
        }
        return true;
    }

    public static function saveDataBase($p) {

        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwdb_server_db", "*", "host=:host and usuario=:usuario and db_name=:db_name");
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":db_name", $p["db_name"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() > 0) {
            NWJSonRpcServer::information("Esta base de datos ya existe en el servidor");
            return;
        }
        $ca->prepareInsert("nwdb_server_db", "host,db_name,user_name,usuario,password,fecha");
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":user_name", $p["user_name"]);
        $ca->bindValue(":db_name", $p["db_name"]);
        $ca->bindValue(":password", $p["password"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function populateFieldsByTable($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
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
        }
        if ($driver == "MYSQL") {
            $ca->prepare("SELECT COLUMN_NAME  as field_name,ordinal_position,COLUMN_DEFAULT,
            COLUMN_TYPE AS field_type,COLUMN_COMMENT as descripcion,CHARACTER_MAXIMUM_LENGTH as size,
CASE WHEN COLUMN_KEY='PRI' THEN 't' ELSE 'f' END AS primary_key,        
CASE WHEN COLUMN_KEY='UNI' THEN 't' ELSE 'f' END AS unica,        
CASE WHEN IS_NULLABLE = 'YES' THEN
                 'f' ELSE 't' END as not_null,table_name
                FROM information_schema.columns cols
            WHERE 
                cols.table_name =:table and cols.table_schema=:db_name");
        }
        $ca->bindValue(":table", $p["nombre"], true);
        $ca->bindValue(":db_name", $db->getDatabaseName());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateFieldsByTableProcces($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("SELECT column_name as id ,column_name as nombre,ordinal_position,column_default as default,
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
                order by cols.column_name asc");
        }
        if ($driver == "MYSQL") {
            $ca->prepare("SELECT COLUMN_NAME  as field_name,ordinal_position,COLUMN_DEFAULT,
            COLUMN_TYPE AS field_type,COLUMN_COMMENT as descripcion,CHARACTER_MAXIMUM_LENGTH as size,
CASE WHEN COLUMN_KEY='PRI' THEN 't' ELSE 'f' END AS primary_key,        
CASE WHEN COLUMN_KEY='UNI' THEN 't' ELSE 'f' END AS unica,        
CASE WHEN IS_NULLABLE = 'YES' THEN
                 'f' ELSE 't' END as not_null,table_name
                FROM information_schema.columns cols
            WHERE 
                cols.table_name =:table and cols.table_schema=:db_name");
        }
        $ca->bindValue(":table", $p["nombre"], true);
        $ca->bindValue(":db_name", $db->getDatabaseName());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
//        NWJSonRpcServer::console($ca->assocAll());
        return $ca->assocAll();
    }

    public static function populateFieldsBySequence($p) {
        session::check();
        $si = session::info();
        $db = new NWDatabase();
        $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
        $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $db->open_();
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("ALTER SEQUENCE public.:name
  INCREMENT :increment MINVALUE :min_value
  MAXVALUE :max_value START :start_value
  CACHE 1 NO CYCLE;");
            $ca->bindValue(":min_value", $p["minimum_value"], false);
            $ca->bindValue(":increment", $p["increment"], false);
            $ca->bindValue(":max_value", $p["maximum_value"], false);
            $ca->bindValue(":start_value", $p["start_value"], false);
        } else if ($driver == "MYSQL") {
            $ca->prepare("ALTER TABLE :name AUTO_INCREMENT :next_value");
            $ca->bindValue(":next_value", $p["next_value"], false);
        }
        $ca->bindValue(":name", $p["nombre"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

}

?>
