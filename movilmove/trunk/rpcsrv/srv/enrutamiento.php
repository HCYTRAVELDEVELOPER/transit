<?php 

class enrutamiento {

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " usuario=:usuario and empresa=:empresa ";
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_fin"] != "") {
                $where .= "and CAST(fecha as date) BETWEEN :fecha_inicial and :fecha_fin ";
                $ca->bindValue(":fecha_inicial", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_fin"]);
            }
        }
        $ca->prepareSelect("edo_enrutamiento", "*", $where);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateConsulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
//         NWJSonRpcServer::console($p);
        $where = " empresa=:empresa and estado='esperando'";
        if (isset($p["fecha_inicial"])) {
            if ($p["fecha_inicial"] != "" && $p["fecha_final"] != "") {
                $where .= "and fecha BETWEEN :fecha_inicial and :fecha_final ";
                $ca->bindValue(":fecha_inicial", $p["fecha_inicial"]);
                $ca->bindValue(":fecha_final", $p["fecha_final"]);
            }
        }
        $ca->prepareSelect("edo_enrutamiento", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $r = $ca->assocAll();
        for ($i = 0; $i < count($r); $i++) {
            $r[$i]["nombre"] = $r[$i]["nombre"] . ", " . $r[$i]["ciudad"] . ", " . $r[$i]["direccion_parada"] . ", " . $r[$i]["observacion"];
        }
        return $r;
    }

    public static function saveParada($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $si = session::info();
        $fecha_del_servicio = date("Y-m-d");
        $hora_del_servicio = date("H:i:s");
//        NWJSonRpcServer::console($p);
        $fields = "empresa, usuario, fecha, nombre,direccion_parada,observacion,estado,ciudad,"
                . "pais,longitud,latitud,fecha_del_servicio,hora_del_servicio";
        $ca->prepareInsert("edo_enrutamiento", $fields);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":direccion_parada", $p["direccion_parada"]);
        $ca->bindValue(":observacion", $p["observacion"]);
        $ca->bindValue(":estado", "SIN_ENRUTAR");
        $ca->bindValue(":ciudad", (isset($p["ciudad"]) && $p["ciudad"] != "") ? $p["ciudad"] : " ");
        $ca->bindValue(":pais", (isset($si["pais"]) && $si["pais"] != "") ? $si["pais"] : " ");
        $ca->bindValue(":longitud", (isset($p["longitud"]) && $p["longitud"] != "") ? $p["longitud"] : " ");
        $ca->bindValue(":latitud", (isset($p["latitud"]) && $p["latitud"] != "") ? $p["latitud"] : " " );
        $ca->bindValue(":fecha_del_servicio", $fecha_del_servicio);
        $ca->bindValue(":hora_del_servicio", $hora_del_servicio);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

}

?>