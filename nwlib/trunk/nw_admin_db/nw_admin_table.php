<?php

/* * ***********************************************************************

  Copyright:
  2014 Netwoods.net, http://www.netwoods.net

  Author:
  Lady Gonzalez
 * yyj6rNZh

 * *********************************************************************** */

class nw_admin_table_init {

    public static function emptyTable($p) {
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
            $sql = "DELETE  FROM public.{table_name} where 1=1";
        } else if ($driver == "MYSQL") {
            $sql = "DELETE FROM {table_name} where 1=1";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["nombre"], $sql);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function createTable($p) {
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
        $db->transaction();
        $where = " 1=1 ";
        $ddl = "";
        if ($driver == "PGSQL") {
            $sql = "CREATE TABLE  IF NOT EXISTS public.{table_name}(";
        } else if ($driver == "MYSQL") {
            $sql = "CREATE TABLE  IF NOT EXISTS {table_name}(";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $ddl = $sql;
        $count = 1;
        $primary = Array();
        $field_primary = false;
        if (isset($p["fields"]) && count($p["fields"]) > 0) {
            foreach ($p["fields"] as $r) {
                if ($count <= count($p["fields"])) {
                    if ($count > 1) {
                        $sql.=",";
                    }
                }
                $ddl .=" </br>";
                $count++;
                $sql .="{field_name}  {field_type}";
                $ddl .="{field_name}  {field_type}";
                $sql = str_replace("{" . "field_name" . "}", $r["field_name"], $sql);
                $ddl = str_replace("{" . "field_name" . "}", $r["field_name"], $ddl);
                $sql = str_replace("{" . "field_type" . "}", $r["field_type"], $sql);
                $ddl = str_replace("{" . "field_type" . "}", $r["field_type"], $ddl);
                if (isset($r["size"]) && $r["size"] != "" && $r["size"] != 0) {
                    $sql .="({size})";
                    $ddl .="({size})";
                    $sql = str_replace("{" . "size" . "}", $r["size"], $sql);
                    $ddl = str_replace("{" . "size" . "}", $r["size"], $ddl);
                }
                if (isset($r["not_null"]) && $r["not_null"] == true || $r["not_null"] == "true") {
                    $sql .=" NOT NULL";
                    $ddl .=" NOT NULL";
                }
                if (isset($r["unique"]) && $r["unique"] == true || $r["not_null"] == "true") {
                    if ($driver == "PGSQL") {
                        $sql .=" UNIQUE";
                        $ddl .=" UNIQUE";
                    }
                }
                if (isset($r["primary_key"]) && $r["primary_key"] == true) {
                    $field_primary = true;
                    $primary = $r["field_name"];
                }
                if ($driver == "MYSQL") {
                    if (isset($r["primary_key"]) && $r["primary_key"] == true) {
                        $sql .=" AUTO_INCREMENT";
                        $ddl .=" AUTO_INCREMENT";
                    }
                    if ($r["default"] != "" || $r["default"] != null) {
                        $sql .=" DEFAULT '{default}'";
                        $ddl .=" DEFAULT '{default}'";
                        $sql = str_replace("{" . "default" . "}", $r["default"], $sql);
                        $ddl = str_replace("{" . "default" . "}", $r["default"], $ddl);
                    }
                    if ($r["descripcion"] != "") {
                        $sql .=" COMMENT '{comment}'";
                        $ddl .=" COMMENT '{comment}'";
                        $sql = str_replace("{" . "comment" . "}", $r["descripcion"], $sql);
                        $ddl = str_replace("{" . "comment" . "}", $r["descripcion"], $ddl);
                    }
                }
            }
            $ddl .=",</br>";
            if ($field_primary == false) {
                NWJSonRpcServer::information("Debe ingresar el campo id primario de la tabla");
                return;
            }
            if ($driver == "PGSQL") {
                $sql .=", PRIMARY KEY ({primary})";
                $ddl .="PRIMARY KEY ({primary})";
                $sql = str_replace("{" . "primary" . "}", $primary, $sql);
                $ddl = str_replace("{" . "primary" . "}", $primary, $ddl);
            }
            if ($driver == "MYSQL") {
                foreach ($p["fields"] as $r) {
                    if (isset($r["unique"]) && $r["unique"] == true && $r["primary_key"] == false) {
                        $ddl .=" </br>";
                        $sql .=",UNIQUE KEY {field_name} ({field_name})";
                        $ddl .=",UNIQUE KEY {field_name} ({field_name})";
                        $sql = str_replace("{" . "field_name" . "}", $r["field_name"], $sql);
                        $ddl = str_replace("{" . "field_name" . "}", $r["field_name"], $sql);
                    }
                }
            }
            if ($driver == "PGSQL") {
                $ddl .= " </br>";
                $sql.=")  WITHOUT OIDS";
                $ddl.=")  WITHOUT OIDS";
            }
            if ($driver == "MYSQL") {
                $ddl .=" </br>";
                $sql.=")  ENGINE=InnoDB  DEFAULT CHARSET=latin1";
                $ddl.=")  ENGINE=InnoDB  DEFAULT CHARSET=latin1";
            }
        }
        $ca->prepare($sql);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        $owner = self::setOwnerTable($p, $db);
        $ddl .= "</br>" . $owner . " </br>";
        if ($driver == "PGSQL") {
            if (isset($p["fields"]) && count($p["fields"]) > 0) {
                foreach ($p["fields"] as $r) {
                    if (isset($r["descripcion"]) && $r["descripcion"] != "") {
                        $r["table_name"] = $p["table_name"];
                        $comment = self::setCommentField($r, $db);
                        $ddl .= "</br>" . $comment . " </br>";
                    }
                    if (isset($r["default"]) && $r["default"] != "") {
                        $r["table_name"] = $p["table_name"];
                        $default = self::setDefaultField($r, $db);
                        $ddl .= "</br>" . $default . " </br>";
                    }
                }
            }
        }
        if ($p["menus"] == "true") {
            $p["menu"]["table_name"] = $p["table_name"];
            self::createComponente($p["menu"], $db);

            $id = self::getMaxIdComponent($p, $db);
            $p["menu"]["modulo"] = $id;
            $p["menu"]["callback"] = "createMaster:master,{$p["table_name"]},{$p["menu"]["nombre"]}";
            self::createMenu($p["menu"], $db);
            self::createPermisos($p["menu"], $db);
        }
        if ($p["descripcion"] == "true") {
            $comment_tale = self::setCommentTable($p, $db);
            $ddl .= "</br>" . $comment_tale . " </br>";
        }
        $db->commit();
        return $ddl;
    }

    public static function orderTable($p) {
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
        $db->transaction();
        $where = " 1=1 ";
        if ($driver == "PGSQL") {
            $sql = "CREATE TABLE  IF NOT EXISTS public.{table_name}(";
        } else if ($driver == "MYSQL") {
            $sql = "CREATE TABLE  IF NOT EXISTS {table_name}(";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"] . "_tmp", $sql);
        $count = 1;
        $primary = Array();
        if (isset($p["fields"]) && count($p["fields"]) > 0) {
            foreach ($p["fields"] as $r) {
                if ($count <= count($p["fields"])) {
                    if ($count > 1) {
                        $sql.=",";
                    }
                }
                $count++;
                $sql .="{field_name}  {field_type}";
                $sql = str_replace("{" . "field_name" . "}", $r["field_name"], $sql);
                $sql = str_replace("{" . "field_type" . "}", $r["field_type"], $sql);
                if (isset($r["size"]) && $r["size"] != "") {
                    $sql .="({size})";
                    $sql = str_replace("{" . "size" . "}", $r["size"], $sql);
                }
                if (isset($r["not_null"]) && $r["not_null"] == true || $r["not_null"] == "true") {
                    $sql .=" NOT NULL";
                }
                if (isset($r["unique"]) && $r["unique"] == true || $r["not_null"] == "true") {
                    if ($driver == "PGSQL") {
                        $sql .=" UNIQUE";
                    }
                }
                if (isset($r["primary_key"]) && $r["primary_key"] == true) {
                    $primary = $r["field_name"];
                }
                if ($driver == "MYSQL") {
                    if (isset($r["primary_key"]) && $r["primary_key"] == true) {
                        $sql .=" AUTO_INCREMENT";
                    }
                    if ($r["default"] != "" || $r["default"] != null) {
                        $sql .=" DEFAULT '{default}'";
                        $sql = str_replace("{" . "default" . "}", $r["default"], $sql);
                    }
                    if ($r["descripcion"] != "") {
                        $sql .=" COMMENT '{comment}'";
                        $sql = str_replace("{" . "comment" . "}", $r["descripcion"], $sql);
                    }
                }
            }
//            if (count($primary) > 1) {
//                $primary = implode(",", $primary);
//            } else {
//                $primary = $primary[0];
//            }
            $sql .=", PRIMARY KEY ({primary})";
            $sql = str_replace("{" . "primary" . "}", $primary, $sql);
            foreach ($p["fields"] as $r) {
                if (isset($r["unique"]) && $r["unique"] == true && $r["primary_key"] == false) {
                    if ($driver == "MYSQL") {
                        $sql .=",UNIQUE KEY {field_name} ({field_name})";
                        $sql = str_replace("{" . "field_name" . "}", $r["field_name"], $sql);
                    }
                }
            }
            if ($driver == "PGSQL") {
                $sql.=")  WITHOUT OIDS";
            }
            if ($driver == "MYSQL") {
                $sql.=")  ENGINE=InnoDB  DEFAULT CHARSET=latin1";
            }
        }
        $ca->prepare($sql);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
//        self::setOwnerTable($p, $db);
        if ($driver == "PGSQL") {
            if (isset($p["fields"]) && count($p["fields"]) > 0) {
                foreach ($p["fields"] as $r) {
                    if (isset($r["descripcion"]) && $r["descripcion"] != "") {
                        $r["table_name"] = $p["table_name"];
                        $r["model"] = $p["model"];
                        self::setCommentField($r, $db);
                    }
                    if (isset($r["default"]) && $r["default"] != "") {
                        if ($r["field_name"] != "id") {
                            $r["table_name"] = $p["table_name"];
                            $r["model"] = $p["model"];
                            self::setDefaultField($r, $db);
                        }
                    }
                }
            }
        }
        if ($driver == "PGSQL") {
            $sql = "INSERT INTO :table (:field)
SELECT :field FROM public.:tabla;";
            $ca->prepare($sql);
            $ca->bindValue(":field", $p["field"], false);
            $ca->bindValue(":table", $p["table_name"] . "_tmp", false);
            $ca->bindValue(":tabla", $p["table_name"], false);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
            }
            if (isset($p["fields"]) && count($p["fields"]) > 0) {
                foreach ($p["fields"] as $r) {
                    $sql = "ALTER  TABLE  public.:table_name DROP COLUMN :field_name";
                    $ca->bindValue(":table_name", $p["table_name"], false);
                    $ca->bindValue(":field_name", $r["field_name"], false);
                    $ca->prepare($sql);
                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
                    }
                    $r["table_name"] = $p["table_name"];
                    $r["model"] = $p["model"];
                    self::addField($r);
                }
            }
            $sql = "INSERT INTO :tabla (:field)
SELECT :field FROM public.:table;";
            $ca->prepare($sql);
            $ca->bindValue(":field", $p["field"], false);
            $ca->bindValue(":table", $p["table_name"] . "_tmp", false);
            $ca->bindValue(":tabla", $p["table_name"], false);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
            }
            $sql = "drop table public.:table;";
            $ca->prepare($sql);
            $ca->bindValue(":table", $p["table_name"] . "_tmp", false);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
            }
        }
        $db->commit();
        return true;
    }

    public static function setOwnerTable($p, &$db) {
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
            $sql = "ALTER  TABLE  public.{table_name} OWNER TO {owner}";
        } else if ($driver == "MYSQL") {
            $sql = "GRANT ALL PRIVILEGES ON {table_name}  to {owner}";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $sql = str_replace("{" . "owner" . "}", $p["owner"], $sql);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return $sql;
    }

    public static function createMenu($p, &$db) {
        session::check();
        if (!$db) {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("menu", "nombre,orden,nivel,callback,pariente,icono,modulo,empresa");
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":orden", $p["orden"]);
        $ca->bindValue(":nivel", $p["nivel"]);
        $ca->bindValue(":callback", $p["callback"]);
        $ca->bindValue(":pariente", !isset($p["pariente"][0]["id"]) ? 0 : $p["pariente"][0]["id"]);
        $ca->bindValue(":icono", $p["icono"]);
        $ca->bindValue(":modulo", $p["modulo"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function createPermisos($p, &$db) {
        session::check();
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        if (!$db) {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($driver == "PGSQL") {
            $sql = "select func_registra_permisos(:perfil,:modulo,:crear,:editar,:eliminar,:consultar,:usuario,:todos)";
        } else if ($driver == "MYSQL") {
            $sql = "insert into permisos (perfil,modulo,crear,editar,eliminar,consultar,todos,fecha)
                 value (:perfil,:modulo,:crear,:editar,:eliminar,:consultar,:todos,:fecha)";
        }
        $ca->prepare($sql);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":modulo", $p["modulo"]);
        $ca->bindValue(":crear", $p["crear"] == "" ? 'false' : 'true', false);
        $ca->bindValue(":editar", $p["editar"] == "" ? 'false' : 'true', false);
        $ca->bindValue(":eliminar", $p["eliminar"] == "" ? 'false' : 'true', false);
        $ca->bindValue(":consultar", $p["consultar"] == "" ? 'false' : 'true', false);
        $ca->bindValue(":terminal", $p["terminal"] == "" ? 'false' : 'true', false);
        $ca->bindValue(":todos", $p["todos"] == "" ? 'false' : 'true', false);
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function createComponente($p, &$db) {
        session::check();
        if (!$db) {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("modulos", "nombre,clase,empresa,grupo,iconos_home");
        $ca->bindValue(":nombre", $p["nombre_class"]);
        $ca->bindValue(":clase", $p["table_name"]);
        $ca->bindValue(":grupo", $p["grupo_model"]["id"]);
        $ca->bindValue(":iconos_home", $p["icon"] == "" ? null : $p["icon"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function getMaxIdComponent($p, &$db) {
        session::check();
        if (!$db) {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("modulos", "max(id) as id");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $r = 0;
        $id = 0;
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            $id = $r["id"];
        }
        return $id;
    }

    public static function renameTable($p) {
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
            $sql = "ALTER  TABLE  public.{table_name} RENAME TO {rename}";
        } else if ($driver == "MYSQL") {
            $sql = "ALTER  TABLE  {table_name} RENAME TO {rename}";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["detalle"]["nombre"], $sql);
        $sql = str_replace("{" . "rename" . "}", $p["rename_table"], $sql);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function executeQuery($p) {
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
        $sql = $p["query"];
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al ejecutar : " . $ca->lastErrorText());
        }
        $sentence = explode(" ", $p["query"]);
//        NWJSonRpcServer::information(strtoupper("update"));
        switch (strtoupper($sentence[0])) {
            case "UPDATE":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "DELETE":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "DROP":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "CREATE":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "ALTER":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "SELECT":
                return $ca->assocAll();
                break;
        }
    }
    public static function executeQueryProcces($p) {
//        NWJSonRpcServer::console($p);
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
//        if($p["procces"] == "SELECT"){
//            $p["query"] = $p["procces"] . " " . $p["campo"] . " FROM " . $p["table"];  
//        }
        $sql = $p["query"];
//         NWJSonRpcServer::console($p["query"]);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al ejecutar : " . $ca->lastErrorText());
        }
        $sentence = explode(" ", $p["query"]);
//        NWJSonRpcServer::information(strtoupper("update"));
        switch (strtoupper($sentence[0])) {
            case "UPDATE":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "DELETE":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "DROP":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "CREATE":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "ALTER":
                NWJSonRpcServer::information("Query Ejecutado correctamente");
                break;
            case "SELECT":
                return $ca->assocAll();
                break;
        }
    }

    public static function renameField($p) {
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
            $sql = "ALTER  TABLE  public.{table_name} RENAME  COLUMN {field_name} TO {rename}";
        } else if ($driver == "MYSQL") {
            $sql = "ALTER  TABLE  {table_name} CHANGE  {field_name} {rename} {type}";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["detalle"]["table_name"], $sql);
        $sql = str_replace("{" . "rename" . "}", $p["rename_field"], $sql);
        $sql = str_replace("{" . "field_name" . "}", $p["detalle"]["field_name"], $sql);
        $sql = str_replace("{" . "type" . "}", $p["detalle"]["field_type"], $sql);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function deleteField($p) {
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
            $sql = "ALTER  TABLE  public.{table_name} DROP COLUMN {field_name}";
        } else if ($driver == "MYSQL") {
            $sql = "ALTER  TABLE  {table_name} DROP COLUMN {field_name}";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $sql = str_replace("{" . "field_name" . "}", $p["field_name"], $sql);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function setDefaultField($p, &$db) {
        session::check();
        $si = session::info();
        if (!$db) {
            $db = new NWDatabase();
            $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
            $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
            $db->open_();
        }
        $ca = new NWDbQuery($db);
        $sql = "ALTER  TABLE  public.{table_name}";
        $sql.=" ALTER  COLUMN {field_name} SET DEFAULT :default";
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $sql = str_replace("{" . "field_name" . "}", $p["field_name"], $sql);
        $ca->prepare($sql);
        $ca->bindValue(":default", $p["default"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return $ca->preparedQuery();
    }

    public static function addField($p) {
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
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ddl = "";
        if ($driver == "PGSQL") {
            $sql = "ALTER  TABLE  public.{table_name}";
            $ddl = "ALTER  TABLE  public.{table_name}";
        } else if ($driver == "MYSQL") {
            $sql = "ALTER  TABLE  {table_name}";
            $ddl = "ALTER  TABLE  {table_name}";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $ddl = str_replace("{" . "table_name" . "}", $p["table_name"], $ddl);
        if ($driver == "PGSQL") {
            $sql.=" ADD  COLUMN ";
            $ddl.="</br> ADD  COLUMN ";
        } else if ($driver == "MYSQL") {
            $sql.=" ADD  ";
            $ddl.="</br> ADD  ";
        }
        $sql.="{field_name}  {type_field}";
        $ddl.="{field_name}  {type_field}";
        $sql = str_replace("{" . "field_name" . "}", $p["field_name"], $sql);
        $sql = str_replace("{" . "type_field" . "}", $p["field_type"], $sql);
        $ddl = str_replace("{" . "type_field" . "}", $p["field_type"], $ddl);
        $ddl = str_replace("{" . "type_field" . "}", $p["field_type"], $ddl);
        if (isset($p["size"]) && $p["size"] != "" && $p["size"] != 0) {
            $sql .="({size})";
            $ddl .="({size})";
            $sql = str_replace("{" . "size" . "}", $p["size"], $sql);
            $ddl = str_replace("{" . "size" . "}", $p["size"], $ddl);
        }
        if (isset($p["default"]) && $p["default"] != "") {
            if ($p["field_name"] != "id") {
                $sql .="  DEFAULT :default";
                $ddl .="  DEFAULT :default";
            }
        }
        if (isset($p["not_null"]) && $p["not_null"] != "false") {
            if ($p["field_name"] != "id") {
                $sql .=" NOT NULL";
                $ddl .=" NOT NULL";
            }
        }
        if (isset($p["unique"]) && $p["unique"] != "false") {
            $sql .=" UNIQUE";
            $ddl .=" UNIQUE";
        }
        if ($driver == "MYSQL") {
            if (isset($p["primary_key"]) && $p["primary_key"] === true) {
                $sql .=" AUTO_INCREMENT";
                $ddl .=" AUTO_INCREMENT";
            }
            $primary[] = $p["field_name"];
            if ($p["default"] != "" || $p["default"] != null) {
                $sql .=" DEFAULT '{default}'";
                $ddl .=" DEFAULT '{default}'";
                $sql = str_replace("{" . "default" . "}", $p["default"], $sql);
                $ddl = str_replace("{" . "default" . "}", $p["default"], $ddl);
            }
            if ($p["descripcion"] != "") {
                $sql .=" COMMENT '{comment}'";
                $ddl .=" COMMENT '{comment}'";
                $sql = str_replace("{" . "comment" . "}", $p["descripcion"], $sql);
                $ddl = str_replace("{" . "comment" . "}", $p["descripcion"], $sql);
            }
            $ddl .=",";
        }
        if ($driver == "PGSQL") {
            if (isset($r["primary_key"]) && $r["primary_key"] == true) {
                $primary = $r["field_name"];
                $sql .=", PRIMARY KEY ({primary})";
                $ddl .="</br> PRIMARY KEY ({primary})";
                $sql = str_replace("{" . "primary" . "}", $primary, $sql);
                $ddl = str_replace("{" . "primary" . "}", $primary, $ddl);
            }
        }
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        if ($driver == "PGSQL") {
            if (isset($p["descripcion"]) || isset($p["descript"]) && $p["descript"] == "true") {
                $comment = self::setCommentField($p, $db);
                $ddl .= ";</br> " . $comment . ";";
            }
        }
        $db->commit();
        return $ddl;
    }

    public static function alterField($p) {
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
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ddl = "";
        $sql = "ALTER  TABLE  public.{table_name}";
        $ddl = "ALTER  TABLE  public.{table_name}";
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $ddl = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $sql.=" ALTER  COLUMN ";
        $ddl.=" </br> ";
        $ddl.=" ALTER  COLUMN ";
        $sql.="{field_name} TYPE {type_field}";
        $ddl.="{field_name} TYPE {type_field}";
        $sql = str_replace("{" . "field_name" . "}", $p["field_name"], $sql);
        $ddl = str_replace("{" . "field_name" . "}", $p["field_name"], $ddl);
        $sql = str_replace("{" . "type_field" . "}", $p["field_type"], $sql);
        $ddl = str_replace("{" . "type_field" . "}", $p["field_type"], $ddl);
        if (isset($p["size"]) && $p["size"] != "") {
            $sql .="({size})";
            $ddl .="({size})";
            $sql = str_replace("{" . "size" . "}", $p["size"], $sql);
            $ddl = str_replace("{" . "size" . "}", $p["size"], $ddl);
        }
        if ($p["field_type"] == "VARCHAR") {
            $sql.=' COLLATE pg_catalog."default"';
            $ddl.=' COLLATE pg_catalog."default"';
        }
        if (isset($p["default"]) && $p["default"] != "") {
            if ($p["field_name"] != "id") {
                $sql .="  DEFAULT :default";
                $ddl .="  DEFAULT :default";
            }
        }
        if (isset($p["not_null"]) && $p["not_null"] != "false") {
            if ($p["field_name"] != "id") {
                $sql .=" NOT NULL";
                $ddl .=" NOT NULL";
            }
        }
        if (isset($p["unique"]) && $p["unique"] != "false") {
            $sql .=" UNIQUE";
            $ddl .=" UNIQUE";
        }
        if ($driver == "PGSQL") {
            if (isset($r["primary_key"]) && $r["primary_key"] == true) {
                $primary = $p["field_name"];
                $sql .=", PRIMARY KEY ({primary})";
                $ddl .="</br> PRIMARY KEY ({primary})";
                $sql = str_replace("{" . "primary" . "}", $primary, $sql);
                $ddl = str_replace("{" . "primary" . "}", $primary, $ddl);
            }
        }
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        if (isset($p["descripcion"]) && $p["descript"] == "true") {
            $comment = self::setCommentField($p, $db);
            $ddl .= ";<br>" . $comment . ";";
        }
        $db->commit();
        return $ddl;
    }

    public static function dropTable($p) {
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
            $sql = "DROP  TABLE  public.{table_name}";
        } else if ($driver == "MYSQL") {
            $sql = "DROP  TABLE  {table_name}";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["nombre"], $sql);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function setCommentTable($p, &$db) {
        session::check();
        $si = session::info();
        if (!$db) {
            $db = new NWDatabase();
            $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
            $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
            $db->open_();
        }
        $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
        $where = " 1=1 ";
        if ($driver == "PGSQL") {
            $sql = "COMMENT ON  TABLE  public.{table_name} IS :description";
        } else if ($driver == "MYSQL") {
            $sql = "ALTER TABLE {table_name} COMMENT = :description;";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $ca->prepare($sql);
        $ca->bindValue(":description", $p["des"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function setCommentNewTable($p) {
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
        $where = " 1=1 ";
        if ($driver == "PGSQL") {
            $sql = "COMMENT ON  TABLE  public.{table_name}";
            $sql.=" IS :description";
        } else if ($driver == "MYSQL") {
            $sql = "ALTER TABLE {table_name} COMMENT =:description";
        }
        $sql = str_replace("{" . "table_name" . "}", $p["tabla"], $sql);
        $ca->prepare($sql);
        $ca->bindValue(":description", $p["description"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function setCommentField($p, &$db) {
        session::check();
        $si = session::info();
        $driver = $db->getDriver();
        if (!$db) {
            $db = new NWDatabase();
            $db->setHostName($si["host_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setUserName($si["user_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setPassword($si["pass_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setDriver($si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]]);
            $db->setDatabaseName($si["db_name" . $p["model"]["host"]]);
            $driver = $si["driver_db" . $p["model"]["db_name"] . $p["model"]["host"]];
            $db->open_();
        }
        $ca = new NWDbQuery($db);
        $sql = "COMMENT ON COLUMN public.{table_name}.{colum_name} IS :descripcion";
        $sql = str_replace("{" . "table_name" . "}", $p["table_name"], $sql);
        $sql = str_replace("{" . "colum_name" . "}", $p["field_name"], $sql);
        $ca->prepare($sql);
        $ca->bindValue(":descripcion", $p["descripcion"], true);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error al crear la tabla: " . $ca->lastErrorText());
        }
        return $ca->preparedQuery();
    }

}

?>