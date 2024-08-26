<?php

class app_user {

    public static function myCreditsCards($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $perfil = nwMaker::getDataSESSION($p, "perfil");
        $where = "usuario=:usuario and empresa=:empresa and perfil=:perfil ";
        if (isset($p["type"])) {
            if ($p["type"] == "epayco") {
                $where .= " and status='OK' ";
            }
        }
        
        $ca->prepareSelect("nwmaker_tarjetascredito", "*", $where);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function notificaAdminNewService($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_config_destinatarios_email", "correo_destinatario,usuario_back,id_usuario_pc,email_pc,nombre_pc", "empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
//        $ca->bindValue(":id_servicio", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $t = $ca->size();
        if ($t == 0) {
            return false;
        }
        $usersNotify = Array();
        $emails = "";
        for ($i = 0; $i < $t; $i++) {
//            $r = $ra[$i];
            $r = $ca->flush();
            $emails .= " {$r["correo_destinatario"]} ";

            $a = Array();
            $a["celular"] = null;
            $a["send_sms"] = false;
            $a["cleanHtml"] = false;
//            $a["fromName"] = "ServiceMovilmove";
//            $a["fromEmail"] = "ServiceMovilmove";
            $a["correo_usuario_recibe"] = $r["correo_destinatario"];
            $a["destinatario"] = $r["correo_destinatario"];
            $a["titleMensaje"] = "Nuevo viaje en Movilmove";
            $a["body"] = "Tienes un nuevo viaje en Movilmove, ingresa a la plataforma y asigna un conductor.";
            $a["body_email"] = "Tienes un nuevo viaje en Movilmove, ingresa a la plataforma y asigna un conductor.";
            $a["tipo"] = "mailNewServ";
            $a["link"] = null;
            $a["modo_window"] = "popup";
            $a["insertaEnTabla"] = true;
            $a["fechaAviso"] = $hoy;
            $a["fecha_envio"] = $hoy;
            $a["tipoAviso"] = "system";
            $a["sendEmail"] = true;
            $a["id_objetivo"] = $p["id"];
            $a["usuario_envia"] = $p["usuario"];
            $a["sendNotifyPush"] = false;
            $a["empresa"] = $p["empresa"];
            $a["terminal"] = $p["terminal"];
            $n = nwMaker::notificacionNwMaker($a);
            if ($n !== true) {
                $db->rollback();
                nwMaker::error($n);
                return $n;
            }

            if (nwMaker::evalueData($r["usuario_back"]) && nwMaker::evalueData($r["id_usuario_pc"]) && nwMaker::evalueData($r["email_pc"]) && nwMaker::evalueData($r["nombre_pc"])) {
                $usersNotify[$i] = Array();
                $usersNotify[$i]["nombre"] = $r["nombre_pc"];
                $usersNotify[$i]["email"] = $r["email_pc"];
                $usersNotify[$i]["usuario"] = $r["usuario_back"];
                $usersNotify[$i]["id"] = $r["id_usuario_pc"];
            }
        }

        $li = Array();
        $li["accion"] = "appPax:::solicita viaje y notifica admins por correo";
        $li["modulo"] = "appPax:::solicita viaje y notifica admins por correo";
        $li["comentarios"] = "Destinatarios: {$emails}. ";
        $li["id_servicio"] = $p["id"];
        $li["fecha"] = $hoy;
        $li["empresa"] = $p["empresa"];
        $li["usuario"] = $p["usuario"];
        $li["all_data"] = $p;
        lineTime::save($li);

        if (count($usersNotify) > 0) {
            //notification back pc
            $n = Array();
            $n["id"] = "";
            $n["body"] = Array();
            $n["body"]["texto"] = "Nuevo servicio";
            $n["adjunto"] = "";
            $n["prioridad"] = "";
            $n["accion"] = "";
            $n["enviar_por_correo"] = 1;
            $n["fecha_final"] = date("Y-m-d H:i:s");
            $n["tipo"] = "m";
            $n["usuario"] = $p["usuario"];
            $n["empresa"] = $p["empresa"];
            $n["users"] = Array();
            $n["users"]["users"] = $usersNotify;
            nw_notifications::save($n);
        }
        return true;
    }

    public static function buscaOfertas($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios_ofertas", "*", "id_servicio=:id_servicio and empresa=:empresa and estado='OFERTADO' order by id desc limit 10");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":id_servicio", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function actualizarPrecioViaje($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
//        $ca->prepareUpdate("edo_servicios_ofertas", "estado", "id=:id ");
//        $ca->bindValue(":id", $p["id"]);
//        $ca->bindValue(":estado", $p["estado"]);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//            return false;
//        }
//        if ($p["estado"] == "ACEPTA_CLIENTE") {
        $ca->prepareUpdate("edo_servicios", "valor", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":valor", $p["value"], true, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }

        $li = Array();
        $li["accion"] = "appPax:::sube valor de viaje";
        $li["modulo"] = "appPax:::sube valor de viaje";
        $li["comentarios"] = "Nuevo valor: {$p["value"]}. ";
        $li["id_servicio"] = $p["id"];
        $li["fecha"] = $hoy;
        $li["empresa"] = $p["empresa"];
        $li["usuario"] = $p["usuario"];
        $li["all_data"] = $p;
        lineTime::save($li);
        return true;
    }

    public static function rechazaAceptaOferta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios_ofertas", "estado,id_servicio,oferta", "id=:id and estado='OFERTADO' ");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();

        $ca->prepareUpdate("edo_servicios_ofertas", "estado", "id=:id ");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", $p["estado"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($p["estado"] == "ACEPTA_CLIENTE") {
            $ca->prepareUpdate("edo_servicios", "valor", "id=:id");
            $ca->bindValue(":id", $r["id_servicio"]);
            $ca->bindValue(":valor", $r["oferta"], true, true);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
        }
        return true;
    }

    public static function rechazaTdasOferta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios_ofertas", "estado", "usuario_pasajero=:usuario and empresa=:empresa and perfil=:perfil and estado='OFERTADO' ");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":estado", "USUARIO_CANCELA_MASIVO_AUTO");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function savePermisos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        if ($p["actualizar"] == "SI") {
            $ca->prepareUpdate("edo_app_permisos_users", "usuario,empresa,perfil,os,text,fecha,fecha_server,token", "usuario=:usuario and empresa=:empresa and perfil=:perfil and token=:token");
        } else {
            $ca->prepareInsert("edo_app_permisos_users", "usuario,empresa,perfil,os,text,fecha,fecha_server,token");
        }
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":os", $p["os"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":text", $p["text"]);
        $ca->bindValue(":token", $p["token"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":fecha_server", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function formasDePago($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_formas_pago", "id,nombre", "empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function traeConfigCarga($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_configuraciones_carga", "*", "empresa=:empresa limit 1");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function guardaConductoresCerca($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_servicios_conductores_notificados", "id_servicio=:id_servicio");
        $ca->bindValue(":id_servicio", $p["id_servicio"], true, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $ca->prepareInsert("edo_servicios_conductores_notificados", "id_servicio,drivers,empresa,fecha");
        $ca->bindValue(":id_servicio", $p["id_servicio"], true, true);
        $ca->bindValue(":drivers", $p["drivers"]);
        $ca->bindValue(":empresa", $p["empresa"], true, true);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $drivers = "";
        $c = json_decode($p["drivers"]);
        for ($x = 0; $x < count($c); $x++) {
            $drivers .= $c[$x]->usuario_cliente . " - ";
        }
        $li = Array();
        $li["accion"] = "appPax:::solicita viaje y notifica conductores";
        $li["modulo"] = "appPax:::solicita viaje y notifica conductores";
        $li["comentarios"] = "Destinatarios: {$drivers}. ";
        $li["id_servicio"] = $p["id_servicio"];
        $li["fecha"] = date("Y-m-d H:i:s");
        $li["empresa"] = $p["empresa"];
        $li["usuario"] = $p["usuario"];
        $li["all_data"] = $p;
        lineTime::save($li);
        return true;
    }

    public static function traeConductoresCerca($data) {
        $p = nwMaker::getData($data);
        if (!nwMaker::evalueData($p["subcategoria_servicio"])) {
            return false;
        }
        if (!nwMaker::evalueData($p["ciudad"])) {
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa and perfil=2 and ciudad_text=:ciudad  ";
        $where .= " and estado='activo' ";
        $where .= " and estado_activacion=1 ";
        $where .= " and (offline='activo' or offline='online') ";
        $where .= " and servicios_activos!='[]' ";
        $where .= " and token IS NOT NULL ";
//        $where .= "  and servicios_activos IN (" . $p["subcategoria_servicio"] . ") ";
        $where .= " and JSON_SEARCH(servicios_activos, 'all', {$p["subcategoria_servicio"]}, null, '$[*].id') ";
        $ca->prepareSelect("pv_clientes", "usuario_cliente,token,latitud,longitud", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function populatePaises($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("paises", "*", "1=1 order by nombre asc");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateCiudades($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1 ";
        if (isset($p["token"])) {
            $p["token"] = master::clean($p["token"]);
            $campos = "nombre";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("ciudades", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function paradasAdicionalesUserApp($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $w = "id_servicio=:id_servicio and empresa=:empresa and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL)";
        $ca->prepareSelect("edo_servicio_parada", "*", $w);
        $ca->bindValue(":id_servicio", $p["id_service"], true);
        $ca->bindValue(":empresa", $p["empresa"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function cancelarParada($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $ca->prepareUpdate("edo_servicio_parada", "estado,fecha_cancelacion_pasajero", "id=:id");
        $ca->bindValue(":id", $p["id_parada"]);
        $ca->bindValue(":estado", "CANCELADO_POR_CLIENTE");
        $ca->bindValue(":fecha_cancelacion_pasajero", $hoy);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consulta_historico_servicios($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $minutes = "120";
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["historial_app_driver_minutos_ver_reservados"])) {
                if (nwMaker::evalueData($p["configCliente"]["historial_app_driver_minutos_ver_reservados"])) {
                    $minutes = $p["configCliente"]["historial_app_driver_minutos_ver_reservados"];
                }
            }
        }
        $fecha_hora = nwMaker::sumaRestaFechas("+0 hour", "-{$minutes} minute", "+0 second", $hoy);

        $order = " order by id desc ";
        $where = " empresa=:empresa ";
        $where .= " and usuario=:usuario ";
        if ($p["estado"] === "ACTIVOS") {
            $where .= " and estado in('EN_RUTA','ABORDO','EN_SITIO') ";
        } else
        if ($p["estado"] === "PASADOS") {
            $where .= " and (estado='CANCELADO_POR_USUARIO' or estado='LLEGADA_DESTINO' or estado='CANCELADO_POR_CONDUCTOR') ";
        } else
        if ($p["estado"] === "RESERVADO") {
//            $where .= " and estado='ACEPTADO_RESERVA' ";
//            $where .= " and (fecha <>0000-00-00 ) ";
//            $where .= " and (tipo_servicio='reservado' or estado in('ACEPTADO_RESERVA', 'SOLICITUD')) ";
//            $where .= " and CONCAT(fecha, ' ' , hora)>=:fecha_suma ";
            $where .= " and estado in ('ACEPTADO_RESERVA','SOLICITUD') ";
            $where .= " and (fecha <>0000-00-00 ) ";

            $order = " order by fecha asc, hora asc ";
        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["fecha_inicial"]) && isset($p["filters"]["fecha_final"])) {
                if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                    $where .= " and fecha between :fecha_inicio and :fecha_fin and estado='LLEGADA_DESTINO'";
                    $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                    $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
                }
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
        $ca->prepareSelect("edo_servicios", "*,CONCAT(fecha, ' ', hora) as fecha_hora,id_usuario as id_cliente", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":fecha_suma", $fecha_hora);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $r = self::getViajesParadas($p);
        $total = $ca->size();
        if ($total > 0) {
            for ($i = 0; $i < $total; $i++) {
                $r[] = $ca->flush();
            }
        }
        return $r;
//        return $ca->assocAll();
    }

    public static function getViajesParadas($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
//        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
//        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $minutes = "120";
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["historial_app_driver_minutos_ver_reservados"])) {
                if (nwMaker::evalueData($p["configCliente"]["historial_app_driver_minutos_ver_reservados"])) {
                    $minutes = $p["configCliente"]["historial_app_driver_minutos_ver_reservados"];
                }
            }
        }
        $fecha_hora = nwMaker::sumaRestaFechas("+0 hour", "-{$minutes} minute", "+0 second", $hoy);

        $order = " order by a.id desc ";
        $where = "a.usuario_pasajero=:usuario and a.empresa=:empresa and a.estado not in('CANCELADO_POR_CLIENTE') ";
        $where .= " and (a.usuario_pasajero!=b.usuario or b.usuario IS NULL or b.usuario='') ";
        $where .= "  and (a.tipo!='DESTINO_FINAL_EJECUTIVO' or a.tipo IS NULL) ";
        if ($p["estado"] === "ACTIVOS") {
            $where .= " and b.estado in('EN_RUTA','ABORDO','EN_SITIO') ";
        } else
        if ($p["estado"] === "PASADOS") {
            $where .= " and (b.estado='CANCELADO_POR_USUARIO' or b.estado='LLEGADA_DESTINO' or b.estado='CANCELADO_POR_CONDUCTOR') ";
        } else
        if ($p["estado"] === "RESERVADO") {
//            $where .= " and (b.tipo_servicio='reservado' and b.estado in('ACEPTADO_RESERVA', 'SOLICITUD')) ";
////            $where .= " and CONCAT(b.fecha, ' ' , b.hora)>=:fecha_suma ";
            $where .= " and b.estado='ACEPTADO_RESERVA' ";
            $where .= " and (b.fecha <>0000-00-00 ) ";

            $order = " order by b.fecha asc, b.hora asc ";
        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["fecha_inicial"]) && isset($p["filters"]["fecha_final"])) {
                if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                    $where .= " and b.fecha between :fecha_inicio and :fecha_fin ";
                    $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                    $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
                }
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

        $fields = "b.*,a.id as id_parada,a.id_servicio as id";
        $fields .= ",a.direccion_origen as origen,a.direccion_destino as destino";
        $fields .= ",'SI' as es_parada,b.estado as estado,a.estado as estado_parada";
        $fields .= ",CONCAT(b.fecha, ' ', b.hora) as fecha_hora,b.id_usuario as id_cliente";
        $tables = "edo_servicio_parada a inner join edo_servicios b on(a.id_servicio=b.id)";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha_suma", $fecha_hora);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $r = Array();
        if ($ca->size() > 0) {
            $r = $ca->assocAll();
        }
        return $r;
    }
}
