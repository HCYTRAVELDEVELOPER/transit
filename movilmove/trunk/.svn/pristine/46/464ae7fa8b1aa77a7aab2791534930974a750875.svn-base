<?php

class lineTime {

    public static function save($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $ca->setCleanHtml(false);
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
        $dispositivo = "";
        if (isset($p["all_data"])) {
            if (isset($p["all_data"]["z_fromlib_dispositivo_navigator_cliente"])) {
                $dispositivo = $p["all_data"]["z_fromlib_dispositivo_navigator_cliente"];
            }
        }
        if ($dispositivo == "") {
            if (isset($_SERVER['HTTP_USER_AGENT'])) {
                $dispositivo = $_SERVER['HTTP_USER_AGENT'];
            }
        }
        $ca->prepareInsert("edo_linea_tiempo", "id_servicio,usuario,accion,empresa,perfil,fecha,modulo,comentarios,latitud,longitud,fecha_sistema,dispositivo");
        $ca->bindValue(":accion", $p["accion"]);
        $ca->bindValue(":id_servicio", $id_servicio, true, true);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil, true, true);
        $ca->bindValue(":modulo", $p["modulo"]);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":fecha_sistema", date("Y-m-d H:i:s"));
        $ca->bindValue(":comentarios", $comentarios);
        $ca->bindValue(":latitud", $latitud);
        $ca->bindValue(":longitud", $longitud);
        $ca->bindValue(":dispositivo", nwMaker::cortaText($dispositivo, 99));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

    public static function consultaLineaTiempoByIDService($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_linea_tiempo", "*", "id_servicio=:id_servicio order by fecha desc,id desc");
        $ca->bindValue(":id_servicio", $p["id"]);
        return $ca->execPage($p);
    }

    public static function consultaConductoresNotificados($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios_conductores_notificados", "*", "id_servicio=:id_servicio order by fecha desc,id desc");
        $ca->bindValue(":id_servicio", $p["id"]);
        return $ca->execPage($p);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//        }
//        return $ca->assocAll();
    }
}
