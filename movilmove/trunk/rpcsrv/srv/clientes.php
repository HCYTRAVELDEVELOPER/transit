<?php

class clientes {

    public static function traeUsuariosPopulate($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa and perfil=1 ";
        if (isset($p["token"]) && $p["token"] != "") {
            $campos = "nombre,usuario_cliente,documento,telefono,celular";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        if (isset($p["id"]) && $p["id"] != "") {
            $where .= " and id=:id";
            $ca->bindValue(":id", $p["id"]);
        }
        if (isset($p["cliente"]) && $p["cliente"] != "") {
            $where .= " and bodega=:bodega";
            $ca->bindValue(":bodega", $p["cliente"]);
        }
        $where = str_replace("::text", "", $where);
        $fields = "id,email,usuario_cliente as usuario,celular,CONCAT(nombre, ' ', apellido) as nombre,documento";
        $ca->prepareSelect("pv_clientes", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

}
