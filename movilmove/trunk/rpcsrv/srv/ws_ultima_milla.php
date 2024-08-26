<?php

class ws_ultima_milla {

    public static function saveParada($p) {
//        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $si = session::info();
        $fecha_del_servicio = date("Y-m-d");
        $hora_del_servicio = date("H:i:s");
        $fields = "empresa, usuario, fecha, nombre,direccion_parada,observacion,estado,ciudad,"
                . "pais,longitud,latitud,fecha_del_servicio,hora_del_servicio,"
                . "origen_manual_nombre,origen_manual_direccion,origen_manual_latitud,origen_manual_longitud,"
                . "origen_manual_ciudad,origen_manual_pais";
        $ca->prepareInsert("edo_enrutamiento", $fields);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":origen_manual_nombre", $p["nombre_remitente"]);
        $ca->bindValue(":direccion_parada", $p["direccion_parada"]);
        $ca->bindValue(":origen_manual_direccion", $p["direccion_parada_remitente"]);
        $ca->bindValue(":observacion", $p["observacion"]);
        $ca->bindValue(":estado", "SIN_ENRUTAR");
        $ca->bindValue(":ciudad", (isset($p["ciudad"]) && $p["ciudad"] != "") ? $p["ciudad"] : " ");
        $ca->bindValue(":origen_manual_ciudad", (isset($p["ciudad_remitente"]) && $p["ciudad_remitente"] != "") ? $p["ciudad_remitente"] : " ");
        $ca->bindValue(":pais", (isset($si["pais"]) && $si["pais"] != "") ? $si["pais"] : " ");
        $ca->bindValue(":origen_manual_pais", (isset($si["pais"]) && $si["pais"] != "") ? $si["pais"] : " ");
        $ca->bindValue(":longitud", (isset($p["longitud"]) && $p["longitud"] != "") ? $p["longitud"] : " ");
        $ca->bindValue(":latitud", (isset($p["latitud"]) && $p["latitud"] != "") ? $p["latitud"] : " " );
        $ca->bindValue(":origen_manual_longitud", (isset($p["longitud_remitente"]) && $p["longitud_remitente"] != "") ? $p["longitud_remitente"] : " ");
        $ca->bindValue(":origen_manual_latitud", (isset($p["latitud_remitente"]) && $p["latitud_remitente"] != "") ? $p["latitud_remitente"] : " " );
        $ca->bindValue(":fecha_del_servicio", $fecha_del_servicio);
        $ca->bindValue(":hora_del_servicio", $hora_del_servicio);
        if (!$ca->exec()) {
            error_log("Error ejecutando la consulta: " . $ca->lastErrorText());
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $fieldr = "empresa,usuario,fecha,numero_guia,rotulos";
        $ca->prepareInsert("edo_enrutamiento_rotulos", $fieldr);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":numero_guia", $p["observacion"]);
        $ca->bindValue(":rotulos", (isset($p["rotulos"]) && $p["rotulos"] != "") ? $p["rotulos"] : " " );
        if (!$ca->exec()) {
            error_log("Error ejecutando la consulta: " . $ca->lastErrorText());
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }
}
