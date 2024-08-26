<?php

class nw_paises {

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["id"] == "") {
            $ca->prepareInsert("paises", "nombre,alias,idioma_text,usuario");
        } else {
            $ca->prepareUpdate("paises", "nombre,alias,idioma_text,usuario", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":alias", $p["alias"]);
        $ca->bindValue(":idioma_text", $p["idioma_text"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function consultar($p) {

        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where empresa=:empresa";
//        if (isset($p["filters"])) {
//            if ($p["filters"]["empresa"] != "TODOS") {
//                $where .= " and empresa=" . $p["filters"]["empresa"];
//            }
//            if ($p["filters"]["buscar"] != "") {
//                $buscarPor= "nombre";
//                $where .= NWDbQuery::sqlFieldsFiltersOptional($buscarPor, $p["filters"]["buscar"], true, ':');
//            }
//        }
        $ca->prepare("select * from paises", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        return $ca->execPage($p);
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("paises", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

}