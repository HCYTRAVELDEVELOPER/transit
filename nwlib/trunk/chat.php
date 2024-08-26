<?php

class vistaGeneral {

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where=" ";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") { //filters para el filtro de buscar
                $campos = "a.usuario_envia,a.usuario_recibe";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
        }
        // $ca->prepareSelect("nw_chat_private", "*","1=1". $where);
        //$sql = "SELECT usuario_envia,usuario_recibe,mensaje,hora,leido_envia,leido_recibe,nombre FROM nw_chat_private AS p,nw_chat_room AS r WHERE p.id = r.id" . $where;
        $sql = "select a.usuario_envia,a.usuario_recibe,a.mensaje,a.hora,a.leido_envia,a.leido_recibe,c.nombre FROM nw_chat_private a left join nw_chat_users_room b on (a.usuario_envia=b.usuario) left join nw_chat_rooms c on (b.room=c.id) where 1=1 " . $where;
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }
}

class SalasPorUsuario {

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_chat_users_room", "id=:id");
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
            b.nombre as nom_sala
            from nw_chat_users_room a
            left join nw_chat_room b on (a.sala=b.id)
            ";
        $ca->prepare($sql);
        //$ca->prepareSelect("nw_chat_users_room", "*");
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
        $si = session::info();
        $fields = "nombre,fecha,usuario,empresa,sala"; 
        $id = 1;
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_chat_users_room", $fields);
        } else {
            $ca->prepareUpdate("nw_chat_users_room", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":id",$id);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":fecha", $p["fecha"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":sala", $p["sala"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }
}


?>