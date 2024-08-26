<?php

class nw_perfiles {

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 ";
        if (isset($p["filters"])) {
            if ($p["filters"]["empresa"] != "TODOS") {
                $where .= " and a.empresa=" . $p["filters"]["empresa"];
            }
            if ($p["filters"]["buscar"] != "") {
                $where .= " and ";
                $where .= NWDbQuery::sqlFieldsFiltersOptional("a.nombre:b.nombre", $p["filters"]["buscar"], false, ':');
            }
        }
        $ca->prepare("select a.*,b.razon_social as nom_empresa from perfiles a join empresas b on (a.empresa=b.id) " . $where);
        return $ca->execPage($p);
    }

    public static function getProfiles($p) {
        session::check();
        $db = NWDatabase::database();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("perfiles", "id,nombre", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
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
        $si = session::getInfo();
        if ($p["id"] == "") {
            $ca->prepareInsert("perfiles", "nombre,empresa,tipo,usuario");
        } else {
            $ca->prepareUpdate("perfiles", "nombre,empresa,tipo,usuario", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function getPerfiles($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("perfiles", "id,nombre", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta");
            return false;
        }
        return $ca->assocAll();
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareDelete("perfiles", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro");
            return false;
        }
    }

}

class perfiles extends nw_perfiles {
    
}