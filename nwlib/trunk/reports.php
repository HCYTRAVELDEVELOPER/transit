<?php

class encabezado {

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_reports_enc", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select
            a.*,
            b.nombre as nom_tipo
            from nw_reports_enc a
            left join nw_reports_types b on (a.tipo=b.id)
            ";
        $ca->prepareSelect("", "*,", "1=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "id,nombre,tipo,ancho,alto,usuario,fecha,empresa,sql_query";
        $id = 1;
        if ($p["id"] == "") {
            $ca->prepareSelect("nw_reports_enc", "max(id) as id", "empresa=:empresa");
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() != 0) {
                $ca->next();
                $r = $ca->assoc();
                $id = $r["id"] + 1;
            }
            $ca->prepareInsert("nw_reports_enc", $fields);
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("nw_reports_enc", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":ancho", $p["ancho"]);
        $ca->bindValue(":alto", $p["alto"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":sql_query", str_replace("'", "$", $p["sql_query"]));
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_reports_cols", "reporte=:reporte");
        $ca->bindValue(":reporte", $id);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        if (count($p["detalleColumnas"]) > 0) {
            for ($i = 0; $i < count($p["detalleColumnas"]); $i++) {
                $ca->prepareInsert("nw_reports_cols", "reporte,nombre,orden");
                $ca->bindValue(":reporte", $id);
                $ca->bindValue(":nombre", $p["detalleColumnas"][$i]["nombre"]);
                $ca->bindValue(":orden", $p["detalleColumnas"][$i]["orden"] == "" ? 0 : $p["detalleColumnas"][$i]["orden"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
                    return false;
                }
            }
        }
        $ca->prepareDelete("nw_reports_filters", "reporte=:reporte");
        $ca->bindValue(":reporte", $id);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        if (count($p["detalleFiltros"]) > 0) {
            for ($i = 0; $i < count($p["detalleFiltros"]); $i++) {
                if ($p["detalleFiltros"][$i]["required"] == "true") {
                    $required = 1;
                } else if ($p["detalleFiltros"][$i]["required"] == "false") {
                    $required = 0;
                } else if ($p["detalleFiltros"][$i]["required"] == 1) {
                    $required = 1;
                } else {
                    $required = $p["detalleFiltros"][$i]["required"];
                }
                //NWJSonRpcServer::information($required);
                $ca->prepareInsert("nw_reports_filters", "reporte,nombre,label,type,required");
                $ca->bindValue(":reporte", $id);
                $ca->bindValue(":nombre", $p["detalleFiltros"][$i]["nombre"]);
                $ca->bindValue(":label", $p["detalleFiltros"][$i]["label"]);
                $ca->bindValue(":type", $p["detalleFiltros"][$i]["type"]);
                $ca->bindValue(":required", $required, false);
                //NWJSonRpcServer::information($ca->preparedQuery());
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
                    return false;
                }
            }
        }
        $db->commit();
        return true;
    }

}

class columnas {

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_reports_cols", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        if ($p["id"] != "") {
            $where .= "reporte=:id";
        }
        $ca->prepareSelect("nw_reports_cols", "*", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "reporte,nombre,orden";
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_reports_cols", $fields);
        } else {
            $ca->prepareUpdate("nw_reports_cols", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }

        $ca->bindValue(":reporte", $p["reporte"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":orden", $p["orden"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        return true;
    }

}

class filtros {

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_reports_filters", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        if ($p["id"] != "") {
            $where .= "reporte=:id";
        }
        $ca->prepareSelect("nw_reports_filters", "*, case when required=1 then 'SI' else 'NO' end as required_nom", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "reporte,nombre,label,type,required,descripcion";
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_reports_filters", $fields);
        } else {
            $ca->prepareUpdate("nw_reports_filters", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }

        $ca->bindValue(":reporte", $p["reporte"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":label", $p["label"]);
        $ca->bindValue(":type", $p["type"]);
        $ca->bindValue(":required", $p["required"]);
        $ca->bindValue(":descripcion", $p["descripcion"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        return true;
    }

}