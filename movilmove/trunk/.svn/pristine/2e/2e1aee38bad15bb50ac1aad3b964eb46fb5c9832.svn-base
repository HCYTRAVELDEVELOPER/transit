<?php

class addPhotos {

    public static function save($p) {
        $p = nwMaker::getData($p);
        if (!isset($p["files"])) {
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getDataSESSION($p, "usuario");
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $perfil = nwMaker::getDataSESSION($p, "perfil");
        $id_servicio = null;
        if (isset($p["id_servicio"])) {
            $id_servicio = $p["id_servicio"];
        }
        $comentarios = null;
        if (isset($p["comentarios"])) {
            $comentarios = $p["comentarios"];
        }
        $comentarios_usuario = null;
        if (isset($p["files"]["comentarios"])) {
            $comentarios_usuario = $p["files"]["comentarios"];
        }
        $latitud = null;
        if (isset($p["latitud"])) {
            $latitud = $p["latitud"];
        }
        $longitud = null;
        if (isset($p["longitud"])) {
            $longitud = $p["longitud"];
        }
        $fecha = date("Y-m-d H:i:s");
        if (isset($p["fecha"])) {
            $fecha = $p["fecha"];
        }
        $files = $p["files"]["files"];
        $total = count($files);
        $fields = "id_servicio,usuario,empresa,fecha,fecha_sistema,latitud,longitud";
        $fields .= ",estado,imagen,perfil,comentarios,comentarios_usuario";
        $tipo = null;
        if (isset($p["tipo"])) {
            $fields .= ",tipo";
            $tipo = $p["tipo"];
        }
        $id_parada = null;
        if (isset($p["id_parada"])) {
            $fields .= ",id_parada";
            $id_parada = $p["id_parada"];
        }
        for ($i = 0; $i < $total; $i++) {
            $r = $files[$i];
            $ca->prepareInsert("edo_fotos_relacionadas", $fields);
            $ca->bindValue(":id_servicio", $id_servicio);
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":empresa", $empresa);
            $ca->bindValue(":perfil", $perfil, true, true);
            $ca->bindValue(":estado", $p["estado"]);
            $ca->bindValue(":imagen", $r["imagen"]);
            $ca->bindValue(":fecha", $fecha);
            $ca->bindValue(":fecha_sistema", date("Y-m-d H:i:s"));
            $ca->bindValue(":comentarios", $comentarios);
            $ca->bindValue(":comentarios_usuario", $comentarios_usuario);
            $ca->bindValue(":latitud", $latitud);
            $ca->bindValue(":longitud", $longitud);
            $ca->bindValue(":tipo", $tipo);
            $ca->bindValue(":id_parada", $id_parada);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
        }
        $db->commit();
        return true;
    }

    public static function consultaFotosViaje($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_fotos_relacionadas", "*", "id_servicio=:id");
//        $ca->bindValue(":id", $p["id_service_initial"]);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }
}
