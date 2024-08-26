<?php

class nw_configuraciones {

    public static function getData($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("config", "*", "empresa=:empresa and usuario=:usuario");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("config", "*", "empresa=:empresa and usuario=:usuario and tipo_impresion=:tipo_impresion");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":tipo_impresion", $p["tipo_impresion"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        $fields = "usuario,all_top,all_left,width,tipo_impresion,empresa";
        if ($ca->size() == 0) {
            $ca->prepareInsert("config", $fields);
        } else {
            $ca->prepareUpdate("config", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":all_top", $p["all_top"]);
        $ca->bindValue(":all_left", $p["all_left"]);
        $ca->bindValue(":width", $p["width"]);
        $ca->bindValue(":tipo_impresion", $p["tipo_impresion"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return true;
    }

    public static function eliminar($p) {
        session::check();
        if ($p["id"] == "") {
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareDelete("config", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return false;
        }
    }

}