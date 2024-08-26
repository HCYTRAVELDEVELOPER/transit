<?php

class html_forms {

    public static function getData($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db); 
        $ca->prepareSelect("nw_html_forms", "*", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            NWJSonRpcServer::information("No se encontraron registros");
        }
        $ca->next();
        $r = $ca->assoc();
        return $r["html"];
    }

    public static function consult($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        $fields = "nombre,html,empresa,fecha,usuario";
        if (isset($p["filters"])) {
            if ($p["filters"]["search"] != "") {
                $where = NWDbQuery::sqlFieldsFilters($fields, $p["filters"]["search"], true);
            }
        }
        $ca->prepareSelect("nw_html_forms", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $si = session::info();
        $fields = "nombre,html,empresa,fecha,usuario";
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_html_forms", $fields);
        } else {
            $ca->prepareUpdate("nw_html_forms", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":html", $p["html"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function delete($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_html_forms", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

}