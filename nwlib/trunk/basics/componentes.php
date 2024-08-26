<?php

class nw_componentes {

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["id"] == "") {
            $ca->prepareInsert("modulos", "nombre,clase,grupo,empresa,iconos_home");
        } else {
            $ca->prepareUpdate("modulos", "nombre,clase,grupo,empresa,iconos_home", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":clase", $p["clase"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":iconos_home", $p["iconos_home"]);
        $ca->bindValue(":grupo", $p["grupo"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function consulta($p) {

        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 ";
        if (isset($p["filters"])) {
            if ($p["filters"]["modulo"] != "") {
                $where .= " and a.grupo=" . $p["filters"]["modulo"];
            }
            if ($p["filters"]["empresa"] != "") {
                $where .= " and a.empresa=" . $p["filters"]["empresa"];
            }
            if ($p["filters"]["buscar"] != "") {
                $where .= " and ";
                $where .= NWDbQuery::sqlFieldsFiltersOptional("a.nombre:b.nombre", $p["filters"]["buscar"], false, ':');
            }
        }
        $sql = "select a.*,b.nombre as nom_grupo,c.razon_social as nom_empresa from modulos a join nw_modulos_grupos b
                on (a.grupo=b.id) left join empresas c on (a.empresa=c.id) " . $where;
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("modulos", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

}