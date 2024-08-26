<?php

class nw_modulos {

    public static function consulta($p) {

        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 ";
        if (isset($p["filters"])) {
            if ($p["filters"]["empresa"] != "") {
                $where .= " and a.empresa=" . $p["filters"]["empresa"];
            }
            if ($p["filters"]["buscar"] != "") {
                $where .= " and ";
                $where .= NWDbQuery::sqlFieldsFiltersOptional("a.nombre:b.nombre", $p["filters"]["buscar"], false, ':');
            }
        }
        $sql = "select a.*,b.nombre as nom_pariente,c.razon_social as nom_empresa from nw_modulos_grupos a join nw_modulos_grupos b
                on (a.id=b.id) left join empresas c on (a.empresa=c.id) " . $where;
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function getModules($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $sql = "select id,nombre from modulos where empresa=:empresa order by nombre";
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->prepare($sql);
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
            $ca->prepareInsert("nw_modulos_grupos", "nombre,fecha,parte,empresa,usuario,icono,pariente,orden,mostrar_en_el_home");
        } else {
            $ca->prepareUpdate("nw_modulos_grupos", "nombre,fecha,parte,empresa,usuario,icono,pariente,orden,mostrar_en_el_home", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":parte", $p["parte"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":icono", $p["icono"]);
        $ca->bindValue(":pariente", $p["pariente"]);
        $ca->bindValue(":orden", $p["orden"]);
        $ca->bindValue(":mostrar_en_el_home", $p["mostrar_en_el_home"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_modulos_grupos", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function getModulesByGroup($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "";
        if ($p["grupo"] == "General") {
            $where = "where (grupo is null or grupo = 0) ";
        } else {
            $where = "where grupo=:grupo ";
        }
        $sql = "select id,nombre from modulos {$where} and empresa=:empresa order by nombre";
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":grupo", $p["grupo"]);
        $ca->prepare($sql);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

}