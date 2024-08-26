<?php

class app_driver {

    public static function validaAceptacionViaje($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $a = Array();
        $a["id"] = $p["id_servicio"];
        if (!servicios_conductor::getStatusService($a, $ca)) {
            return "VIAJE_NO_DISPONIBLE";
        }
        $ca->prepareSelect("edo_servicios_ofertas", "estado", "id=:id and (estado='ACEPTA_CLIENTE' or estado='RECHAZADO_POR_USUARIO')");
        $ca->bindValue(":id", $p["id_oferta"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function cancelaTodasOfertas($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $ca->prepareUpdate("edo_servicios_ofertas", "estado", "usuario=:usuario and empresa=:empresa and perfil=:perfil and estado='OFERTADO' ");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":estado", "SYSTEM_CANCELA_CONDUCTOR_AUTO");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function ofertarViaje($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $a = Array();
        $a["id"] = $p["id_servicio"];
        if (!servicios_conductor::getStatusService($a, $ca)) {
            return false;
        }

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        if (isset($p["id_oferta"])) {
            $ca->prepareUpdate("edo_servicios_ofertas", "estado", "usuario=:usuario and empresa=:empresa and perfil=:perfil and id_servicio=:id_servicio and estado='OFERTADO' ");
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":perfil", $p["perfil"]);
            $ca->bindValue(":id_servicio", $p["id_servicio"]);
            $ca->bindValue(":estado", $p["estado"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
            return true;
        } else {

            $id = master::getNextSequence("edo_servicios_ofertas" . "_id_seq", $db);
            $ca->prepareInsert("edo_servicios_ofertas", "id,usuario,empresa,perfil,id_servicio,estado,oferta,fecha,fecha_server,token,conductor_foto,conductor_nombre,conductor_marca_carro,conductor_foto_carro,usuario_pasajero");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"], true, true);
            $ca->bindValue(":perfil", $p["perfil"], true, true);
            $ca->bindValue(":oferta", $p["oferta"], true, true);
            $ca->bindValue(":id_servicio", $p["id_servicio"], true, true);
            $ca->bindValue(":estado", $p["estado"]);
            $ca->bindValue(":token", $p["token"]);
            $ca->bindValue(":fecha", $hoy);
            $ca->bindValue(":fecha_server", date("Y-m-d H:i:s"));
            $ca->bindValue(":conductor_foto", $p["conductor_foto"]);
            $ca->bindValue(":conductor_nombre", $p["conductor_nombre"]);
            $ca->bindValue(":conductor_marca_carro", $p["conductor_marca_carro"]);
            $ca->bindValue(":conductor_foto_carro", $p["conductor_foto_carro"]);
            $ca->bindValue(":usuario_pasajero", $p["usuario_pasajero"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
            return $id;
        }
    }

    public static function consultaRotulosPorParada($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_enrutamiento_rotulos", "rotulos", "id_parada=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consulta_historico_servicios($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $conductor_historico_ver_viajes_tarde_en_boton = true;
        $minutes = "120";
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["conductor_historico_ver_viajes_tarde_en_boton"])) {
                if ($p["configCliente"]["conductor_historico_ver_viajes_tarde_en_boton"] == "NO") {
                    $conductor_historico_ver_viajes_tarde_en_boton = false;
                }
            }
            if (isset($p["configCliente"]["historial_app_driver_minutos_ver_reservados"])) {
                if (nwMaker::evalueData($p["configCliente"]["historial_app_driver_minutos_ver_reservados"])) {
                    $minutes = $p["configCliente"]["historial_app_driver_minutos_ver_reservados"];
                }
            }
        }
        $fecha_hora = "";

//        $order = " order by a.id desc ";
        $order = " order by a.fecha desc, a.hora desc ";
        $where = " a.empresa=:empresa ";
        $where .= " and a.conductor_usuario=:usuario ";
        if ($p["estado"] === "ACTIVOS") {
            $where .= " and a.estado in('EN_RUTA','ABORDO','EN_SITIO') ";
        } else
        if ($p["estado"] === "PASADOS") {
            $where .= " and (a.estado='CANCELADO_POR_USUARIO' or a.estado='LLEGADA_DESTINO' or a.estado='CANCELADO_POR_CONDUCTOR') ";
        } else
        if ($p["estado"] === "RESERVADO") {
            $where .= " and a.estado='ACEPTADO_RESERVA' ";
            $where .= " and (a.fecha <>0000-00-00 ) ";

            if (!$conductor_historico_ver_viajes_tarde_en_boton) {
//                $where .= " and CONCAT(a.fecha, ' ' , a.hora)>=:fecha_suma ";
                $fecha_hora = nwMaker::sumaRestaFechas("+0 hour", "-{$minutes} minute", "+0 second", $hoy);
            }
            $order = " order by a.fecha asc, a.hora asc ";
//            $order = " order by a.fecha desc, a.hora desc ";
        }
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= " and a.fecha between :fecha_inicio and :fecha_fin ";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
            }
        }
        $limit = "  limit 50 ";
        if ($p["estado"] === "RESERVADO") {
            $limit = "  limit 200";
        }
        if (isset($p["limit_old"]) && isset($p["limit_new"])) {
            $limit = "  limit {$p["limit_old"]}, {$p["limit_new"]}";
        }
        $where .= $order;
        $where .= $limit;
        $tables = "edo_servicios a";
        $tables .= " left join edo_empresas b ON(a.cliente_empresa_id=b.id)";
        $fields = "a.*,CONCAT(a.fecha, ' ', a.hora) as fecha_hora,a.id_usuario as id_cliente";
        $fields .= ",b.nombre as nombre_empresa_cliente";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha_suma", $fecha_hora);
//        if (!$ca->exec()) {
//            return nwMaker::error($ca->lastErrorText());
//        }
//        return nwMaker::error($ca->preparedQuery());
//        return $ca->assocAll();
        $res = $ca->execPage($p);
        return $res["records"];
    }
}
