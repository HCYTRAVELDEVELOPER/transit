<?php

class nw_permisos {

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();

        if ($p["todos"] != "") {
            $p["crear"] = 'true';
            $p["editar"] = 'true';
            $p["eliminar"] = 'true';
            $p["consultar"] = 'true';
            $p["terminal"] = 'true';
        }

        $sql = "select func_registra_permisos(:perfil,:modulo,:crear,:editar,:eliminar,:consultar,:usuario,:todos,:terminal)";
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
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function getProfiles($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("permisos", "crear,consultar,editar,eliminar,todos,terminal", "perfil=:perfil and modulo=:modulo");
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":modulo", $p["modulo"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("permisos", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getGrupos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_modulos_grupos", "*", "empresa=:empresa", "nombre");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getPermissionsFree($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("permisos", "id,nombre");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

}