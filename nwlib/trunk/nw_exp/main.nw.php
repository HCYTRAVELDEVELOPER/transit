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

class nw_exp {

    public static function populateDynamic($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select id, ";
        $sql .= $p["field"];
        $sql .= " as nombre from ";
        $sql .= $p["table"];
        $ca->prepare($sql);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function deleteExp($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_exp_enc", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_exp_tables", "enc=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_exp_fields", "enc=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_exp_conections", "enc=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
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

    public static function deleteFilterById($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_exp_filters", "id=:id");
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

    public static function getQueryById($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $r = Array();
        $r["model"] = $p["enc"];
        $filtersData = $p["filters"];
        $connections = self::getConnectionsByEnc($r);
        $tablas = self::getTablesByEnc($r);
        $fields = self::getFieldsByEnc($r);
        $filters = self::getFiltersByEnc($p["enc"]);
        $letters = Array();
        $letters[0] = "a";
        $letters[1] = "b";
        $letters[2] = "c";
        $letters[3] = "d";
        $letters[4] = "e";
        $letters[5] = "f";
        $letters[6] = "g";
        $letters[7] = "h";
        $letters[8] = "i";
        $letters[9] = "j";
        $letters[10] = "k";
        $sql = "SELECT ";
        $campos = Array();
        $count = 0;
        $consec = 0;
        for ($i = 0; $i < count($fields); $i++) {
            $r = $fields[$i];
            if ($i > 0) {
                $sql .= ",";
            }
            if (isset($r["tipo"]) && $r["tipo"] == "CONDICIONAL") {
                $sql .= " CASE WHEN ";
                $sql .= $r["nombre_campo"];
                $sql .= $r["operacion"];
                $sql .= "'";
                $sql .= $r["valor_comparativo"];
                $sql .= "'";
                $sql .= " THEN '";
                $sql .= $r["campo_fijoa"];
                $sql .= "' ELSE '";
                $sql .= $r["campo_fijob"];
                $sql .= "' END AS ";
                $sql .= $r["nombre_mostrar"];
            } else if (isset($r["tipo"]) && $r["tipo"] == "FIJO") {
                $sql .= " '" . $r["comodin"] . "' AS " . $r["nombre"];
            } else if (isset($r["tipo"]) && $r["tipo"] == "CONSECUTIVO") {
                $sql .= " (row_number() OVER()) + " . ($r["comodin"] - 1) . " AS " . $r["nombre"];
                $count++;
            } else if (isset($r["tipo"]) && $r["tipo"] == "VACIO") {
                $sql .= " '' AS " . $r["nombre"];
            } else {
                if (in_array($r["nombre"], $campos) && $r["nombre_mostrar"] == "") {
                    $sql .= $r["nombre_campo"] . " AS " . $r["nombre"] . "_" . $letters[$count];
                    $count = $count + 1;
                } else if (in_array($r["nombre"], $campos) && $r["nombre_mostrar"] != "") {
                    if (isset($r["tipo"]) && $r["tipo"] == "FECHA") {
                        $sql .= "to_char(";
                        $sql .= $r["nombre_campo"];
                        $sql .= ", '";
                        $sql .= $r["comodin"];
                        $sql .= "')";
                        $sql .= " AS ";
                        $sql .= $r["nombre_mostrar"];
                    } else {
                        $sql .= $r["nombre_campo"] . " AS " . $r["nombre_mostrar"];
                    }
                } else {
                    if (isset($r["tipo"]) && $r["tipo"] == "FECHA") {
                        $sql .= "to_char(";
                        $sql .= $r["nombre_campo"];
                        $sql .= ", '";
                        $sql .= $r["comodin"];
                        $sql .= "')";
                        $sql .= " AS ";
                        $sql .= $r["nombre"];
                    } else {
                        $sql .= $r["nombre_campo"];
                    }
                }
                $campos[] = $r["nombre"];
            }
        }
        $sql .= " FROM ";
        for ($i = 0; $i < count($tablas); $i++) {
            $r = $tablas[$i];
            if ($i > 0) {
                $sql .= " LEFT JOIN ";
            }
            $sql .= $r["nombre"];
            $sql .= " ";
            if ($i > 0) {
                for ($ia = 0; $ia < count($connections); $ia++) {
                    $ra = $connections[$ia];
                    if ($ra["tabla_origen"] == $r["nombre"]) {
                        $sql .= " ON (";
                        $sql .= $ra["tabla_origen"];
                        $sql .= ".";
                        $sql .= $ra["campo_origen"];
                        $sql .= "::text=";
                        $sql .= $ra["tabla_destino"];
                        $sql .= ".";
                        $sql .= $ra["campo_destino"];
                        $sql .= "::text) ";
                    }
                }
            }
        }
        if (count($filters) > 0) {
            $sql .= " WHERE 1=1 ";
        }
        for ($i = 0; $i < count($filters); $i++) {
            $r = $filters[$i];
            if ($r["comparativo"] == "en") {
                if (isset($filtersData["fecha_inicial_filters"]) && isset($filtersData["fecha_final_filters"])) {
                    if ($filtersData["fecha_inicial_filters"] != "" && $filtersData["fecha_final_filters"]) {
                        $sql .= " and " . $r["tabla_origen"] . "." . $r["nombre"] . "::date between :fecha_inicial_filters and :fecha_final_filters ";
                    }
                }
            } else {
                if (isset($filtersData[$r["nombre"]]) && $filtersData[$r["nombre"]] != "") {
                    if ($r["tipo"] == "selectBox") {
                        $sql .= " AND ";
                        $sql .= $r["tabla_origen"];
                        $sql .= ".";
                        $sql .= $r["nombre"];
                        $sql .= "=";
                        $sql .= ":";
                        $sql .= $r["tabla_origen"];
                        $sql .= "_";
                        $sql .= $r["nombre"];
                    } else {
                        $funcType = "";
                        if ($r["comparativo"] == "==") {
                            $funcType = "LIKE";
                        }
                        $sql .= " AND ";
                        if ($funcType == "LIKE") {
                            $sql .= " LOWER(";
                        }
                        $sql .= $r["tabla_origen"];
                        $sql .= ".";
                        $sql .= $r["nombre"];
                        if ($funcType == "LIKE") {
                            $sql .= ") ";
                        }
                        $funcType = "";
                        if ($r["comparativo"] == "=") {
                            $sql .= "=";
                        } else if ($r["comparativo"] == "==") {
                            $funcType = "LIKE";
                            $sql .= " LIKE ";
                        } else if ($r["comparativo"] == ">") {
                            $sql .= ">";
                        } else if ($r["comparativo"] == "<") {
                            $sql .= "<";
                        }
                        $sql .= ":";
                        $sql .= $r["tabla_origen"];
                        $sql .= "_";
                        $sql .= $r["nombre"];
                    }
                }
            }
        }
        $ca->prepare($sql);
        for ($i = 0; $i < count($filters); $i++) {
            $r = $filters[$i];
            if ($r["comparativo"] == "en") {
                if (isset($filtersData["fecha_inicial_filters"])) {
                    $f = "fecha_inicial_filters";
                    $ca->bindValue(":" . $f, strtolower($filtersData["fecha_inicial_filters"]), true);
                }
                if (isset($filtersData["fecha_final_filters"])) {
                    $f = "fecha_final_filters";
                    $ca->bindValue(":" . $f, strtolower($filtersData["fecha_final_filters"]), true);
                }
            } else {
                if (isset($filtersData[$r["nombre"]]) && $filtersData[$r["nombre"]] != "") {
                    $f = $r["tabla_origen"];
                    $f .= "_";
                    $f .= $r["nombre"];
                    if ($r["comparativo"] == "==") {
                        $ca->bindValue(":" . $f, "%" . strtolower($filtersData[$r["nombre"]]) . "%");
                    } else {
                        $ca->bindValue(":" . $f, strtolower($filtersData[$r["nombre"]]));
                    }
                }
            }
        }
        $p["filters"]["count"] = 200000;
        return $ca->execPage($p);
    }

    public static function saveConnections($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_exp_conections", "enc,campo_origen,tabla_destino,campo_destino,usuario,fecha,empresa,"
                . "orden,tabla_origen,mostrar_como");
        $ca->bindValue(":enc", $p["enc"]);
        $ca->bindValue(":campo_origen", $p["camposDisponibles"]);
        $ca->bindValue(":tabla_destino", $p["tabla_a_conectar_text"]);
        $ca->bindValue(":campo_destino", $p["campos_tabla_destino"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":orden", $p["orden"]);
        $ca->bindValue(":tabla_origen", $p["tabla"]);
        $ca->bindValue(":mostrar_como", $p["mostrar_como"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

    public static function saveNewFilters($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $arr = explode(".", $p["nombre"]);
        $ca->prepareInsert("nw_exp_filters", "nombre,label,tipo,tabla_origen,comparativo,enc,usuario,fecha,empresa,tabla_llenado,campo_mostrar", "nombre=:nombre and enc=:enc");
        $ca->bindValue(":nombre", $arr[1]);
        $ca->bindValue(":label", $p["nombre_mostrar"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":tabla_origen", $arr[0]);
        $ca->bindValue(":comparativo", $p["comparativo"]);
        $ca->bindValue(":enc", $p["enc"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":tabla_llenado", $p["tabla_llenado"]);
        $ca->bindValue(":campo_mostrar", $p["campo_nombre_text"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
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
            $ca->prepareUpdate("nw_exp_fields", "nombre,tipo,comodin,usuario,fecha,empresa,nombre_mostrar", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        } else {
            $campo = $p["nombre_campo"];
            if (isset($p["nombre_mostrar"]) && $p["nombre_mostrar"]) {
                $campo = $p["nombre_mostrar"];
            }
            $ca->prepareSelect("nw_exp_fields", "nombre", "nombre=:nombre and enc=:enc");
            $ca->bindValue(":nombre", $campo);
            $ca->bindValue(":enc", $p["enc"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                $db->rollback();
                NWJSonRpcServer::information("El nombre del campo ya se encuentra registrado. Intente modificarlo antes de guardar");
                return false;
            }
            $ca->prepareInsert("nw_exp_fields", "nombre,enc,tipo,comodin,usuario,fecha,empresa,nombre_mostrar,nombre_campo,tabla");
        }
        $ca->bindValue(":nombre", $p["nombre_campo"]);
        $ca->bindValue(":nombre_campo", $p["nombre_alterno"] == "" ? "" : $p["nombre_alterno"]);
        $ca->bindValue(":tabla", $p["tabla"] == "" ? "0" : $p["tabla"]);
        $ca->bindValue(":enc", $p["enc"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":comodin", $p["comodin"], true);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":nombre_mostrar", isset($p["nombre_mostrar"]) ? $p["nombre_mostrar"] : "");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
    }

    public static function saveCondFields($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        if (isset($p["id"]) && $p["id"] != "") {
            $ca->prepareUpdate("nw_exp_fields", "nombre,tipo,comodin,usuario,fecha,empresa,nombre_mostrar,operacion,campo_fijoa,campo_fijob,valor_comparativo", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        } else {
            $campo = $p["nombre_campo"];
            if (isset($p["nombre_mostrar"]) && $p["nombre_mostrar"]) {
                $campo = $p["nombre_mostrar"];
            }
            $ca->prepareSelect("nw_exp_fields", "nombre", "nombre=:nombre and enc=:enc");
            $ca->bindValue(":nombre", $campo);
            $ca->bindValue(":enc", $p["enc"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                $db->rollback();
                NWJSonRpcServer::information("El nombre del campo ya se encuentra registrado. Intente modificarlo antes de guardar");
                return false;
            }
            $ca->prepareInsert("nw_exp_fields", "nombre,enc,tipo,comodin,usuario,fecha,empresa,nombre_mostrar,nombre_campo,tabla,operacion,campo_fijoa,campo_fijob,valor_comparativo");
        }
        $ca->bindValue(":nombre", $p["nombre_campo"]);
        $ca->bindValue(":nombre_campo", $p["tabla_text"] . "." . $p["nombre_campo"]);
        $ca->bindValue(":tabla", $p["tabla"] == "" ? "null" : $p["tabla"], false);
        $ca->bindValue(":enc", $p["enc"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":comodin", !isset($p["comodin"]) ? "" : $p["comodin"], true);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":nombre_mostrar", isset($p["nombre_mostrar"]) ? $p["nombre_mostrar"] : "");
        $ca->bindValue(":operacion", $p["operacion"]);
        $ca->bindValue(":campo_fijoa", $p["campo_fijoa"], true);
        $ca->bindValue(":campo_fijob", $p["campo_fijob"], true);
        $ca->bindValue(":valor_comparativo", $p["valor_comparativo"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        $db->commit();
    }

    public static function saveTableAndFields($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_exp_tables", "*", "nombre=:tabla and enc=:enc");
        $ca->bindValue(":tabla", $p["table"]["value"]);
        $ca->bindValue(":enc", $p["enc"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            $id = $ca->getNextId($ca, "nw_exp_tables", false);
            $ca->prepareInsert("nw_exp_tables", "id,nombre,empresa,fecha,usuario,enc");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":enc", $p["enc"]);
        } else {
            $ca->next();
            $ra = $ca->assoc();
            $id = $ra["id"];
            $ca->prepareUpdate("nw_exp_tables", "empresa,fecha,usuario", "nombre=:tabla and enc=:enc");
            $ca->bindValue(":tabla", $p["table"]["value"]);
            $ca->bindValue(":enc", $p["enc"]);
        }
        $ca->bindValue(":nombre", $p["table"]["value"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }

        for ($i = 0; $i < count($p["fields"]); $i++) {
            $r = $p["fields"][$i];
            if (is_numeric($r["id"])) {
                $ca->prepareSelect("nw_exp_fields", "*", "id=:id and tabla=:tabla and enc=:enc");
                $ca->bindValue(":id", $r["id"]);
                $ca->bindValue(":tabla", $p["table_id"]);
                $ca->bindValue(":enc", $p["enc"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                    return false;
                }
                if ($ca->size() == 0) {
                    $ca->prepareInsert("nw_exp_fields", "enc,tabla,nombre,empresa,fecha,usuario,nombre_campo");
                    $ca->bindValue(":enc", $p["enc"]);
                    $ca->bindValue(":tabla", $id);
                    $n = !isset($r["nombre"]) ? $r["field_name"] : $r["nombre"];
                    $na = !isset($r["field_name"]) ? $r["nombre"] : $r["field_name"];
                    $ca->bindValue(":nombre", $n);
                    $ca->bindValue(":nombre_campo", $p["table"]["value"] . "." . $n);
                    $ca->bindValue(":empresa", $si["empresa"]);
                    $ca->bindValue(":usuario", $si["usuario"]);
                    $ca->bindValue(":fecha", date("Y-m-d"));
                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                        return false;
                    }
                }
            } else {
                $ca->prepareInsert("nw_exp_fields", "enc,tabla,nombre,empresa,fecha,usuario,nombre_campo");
                $ca->bindValue(":enc", $p["enc"]);
                $ca->bindValue(":tabla", $id);
                $n = !isset($r["nombre"]) ? $r["field_name"] : $r["nombre"];
                $na = !isset($r["field_name"]) ? $r["nombre"] : $r["field_name"];
                $ca->bindValue(":nombre", $n);
                $ca->bindValue(":nombre_campo", $p["table"]["value"] . "." . $n);
                $ca->bindValue(":empresa", $si["empresa"]);
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":fecha", date("Y-m-d"));
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
                    return false;
                }
            }
        }
        $db->commit();
    }

    public static function searchFieldsByTable($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("SELECT column_name as nombre, column_name as id, column_name as field_name,ordinal_position,column_default as default,
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
                order by column_name, cols.ordinal_position");
        $ca->bindValue(":table", $p, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function getConnectionsByEnc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_exp_conections", "*, CONCAT(tabla_origen, '.', campo_origen, '=', tabla_destino, '.', campo_destino) as nombre", "enc=:enc order by id");
        $ca->bindValue(":enc", $p["model"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function searchTables($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select table_name as value, table_name as nombre from information_schema.tables where table_schema='public' order by table_name");
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
        $ca->prepare("select * from nw_exp_tables where enc=:enc order by id");
        $ca->bindValue(":enc", $p["model"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getTablesByEncAndModel($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select * from nw_sync_tables where nombre <> :table");
       // $ca->bindValue(":enc", $p["enc"]);
        $ca->bindValue(":table", $p["nombre"]);
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
                . " from nw_exp_fields where enc=:enc order by orden");
        $ca->bindValue(":enc", $p["model"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getFiltersByEnc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select * from nw_exp_filters where enc=:enc order by id");
        $ca->bindValue(":enc", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getFieldsFromTableByEnc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select * from nw_exp_fields where enc=:enc order by id");
        $ca->bindValue(":enc", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getFieldsByTable($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select a.*, b.nombre as nombre_tabla from nw_exp_fields a left join nw_exp_tables b on (a.tabla=b.id) where a.tabla=:enc");
        $ca->bindValue(":enc", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll($p);
    }

    public static function getMain($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("nw_exp_enc", "id, CONCAT(id, '.', nombre) as nombre,usuario,fecha,empresa", "empresa=:empresa", "id");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function addMain($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if (isset($p["edit"])) {
            $ca->prepareUpdate("nw_exp_enc", "nombre,empresa,usuario,fecha", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        } else {
            $ca->prepareInsert("nw_exp_enc", "nombre,empresa,usuario,fecha");
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return true;
    }

}

?>
