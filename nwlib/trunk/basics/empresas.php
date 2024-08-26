<?php

class nw_empresas {

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("empresas", "id=:id");
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
            b.nombre as nom_ciudad,
            c.nombre as nom_pais
            from empresas a 
            left join ciudades b on (a.ciudad=b.id)
            left join paises c on (a.pais=c.id)
            ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getEmpresas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("empresas", "id,razon_social as nombre,ciudad,pais");
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
        $fields = "razon_social,nit,division,ciudad,direccion,telefono,email,slogan,logo,pais";
        if ($p["id"] == "") {
            $ca->prepareInsert("empresas", $fields);
        } else {
            $ca->prepareUpdate("empresas", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":razon_social", $p["razon_social"]);
        $ca->bindValue(":nit", $p["nit"]);
        $ca->bindValue(":division", $p["division"]);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":telefono", $p["telefono"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":slogan", $p["slogan"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":logo", $p["logo"]);
        $ca->bindValue(":pais", $p["pais"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

}