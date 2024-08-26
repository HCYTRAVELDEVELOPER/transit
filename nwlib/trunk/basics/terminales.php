<?php

class nw_terminales {

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["id"] == "") {
            $ca->prepareInsert("terminales", "nombre,ciudad,empresa,codigo,telefono,direccion");
        } else {
            $ca->prepareUpdate("terminales", "nombre,ciudad,empresa,codigo,telefono,direccion", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":codigo", $p["codigo"] == "" ? 0 : $p["codigo"] );
        $ca->bindValue(":telefono", $p["telefono"] == "" ? 0 : $p["telefono"]);
        $ca->bindValue(":direccion", $p["direccion"] == "" ? 0 : $p["direccion"]);
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
            if ($p["filters"]["ciudad"] != "TODOS") {
                $where .= " and a.ciudad=" . $p["filters"]["ciudad"];
            }
            if ($p["filters"]["empresa"] != "TODOS") {
                $where .= " and a.empresa=" . $p["filters"]["empresa"];
            }
            if ($p["filters"]["buscar"] != "") {
                $where .= " and ";
                $where .= NWDbQuery::sqlFieldsFiltersOptional("a.nombre:b.nombre", $p["filters"]["buscar"], true, ':');
            }
        }
        $sql = "select a.*,b.nombre as nom_ciudad,c.razon_social as nom_empresa from terminales a join ciudades b
                on (a.ciudad=b.id) left join empresas c on (a.empresa=c.id) " . $where;
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("terminales", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

}
