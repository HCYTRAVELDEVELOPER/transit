<?php

class nw_ciudades {

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["id"] == "") {
            $ca->prepareInsert("ciudades", "nombre,departamento,pais,usuario");
        } else {
            $ca->prepareUpdate("ciudades", "nombre,departamento,pais,usuario", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":departamento", $p["departamento"], true, true);
        $ca->bindValue(":pais", $p["pais"]);
        $ca->bindValue(":usuario", $si["usuario"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
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
        $where = " 1=1 ";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["pais"]) && $p["filters"]["pais"] != "TODOS") {
                $where .= " and a.pais_id=" . $p["filters"]["pais"];
            }
            if (isset($p["filters"]["departamento"]) && $p["filters"]["departamento"] != "TODOS") {
                $where .= " and a.departamento=" . $p["filters"]["departamento"];
            }
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $where .= " and ";
                $where .= NWDbQuery::sqlFieldsFiltersOptional("a.nombre:b.nombre", $p["filters"]["buscar"], true, ':');
            }
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("ciudades a left join paises c on (a.pais_id=c.id)", "a.*,c.nombre as nom_pais", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("ciudades", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

}
