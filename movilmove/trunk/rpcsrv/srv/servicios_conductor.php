<?php

class servicios_conductor {

    public static function validaTrad($text, $p, $var) {
        if ($p == false) {
            return $text;
        }
        if (isset($p["templateEmail"])) {
            if (isset($p["templateEmail"][$var])) {
                return $p["templateEmail"][$var];
            }
            return $text;
        }
        return $text;
    }

    public static function adicionalesServicioApp($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $w = "id_service=:id_service";
        $ca->prepareSelect("edo_adicionales_servicio", "*", $w);
        $ca->bindValue(":id_service", $p["id_service"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function paradasAdicionalesAppHistorial($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $w = "id_servicio=:id_servicio and empresa=:empresa and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL) ";
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

    public static function paradasAdicionalesApp($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $w = "id_servicio=:id_servicio and empresa=:empresa ";
        $w .= " and (estado!='ENTREGADO' and estado!='NOVEDAD') and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL) ";
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

    public static function preoperacional_hoy_nuevo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_preoperadmin_results_enc", "id", "usuario=:usuario and empresa=:empresa and DATE(fecha)=:fecha");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":fecha", date("Y-m-d"), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return true;
    }

    public static function preoperacional_hoy($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_preoperacional", "id", "usuario=:usuario and empresa=:empresa and DATE(fecha)=:fecha");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":fecha", date("Y-m-d"), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return true;
    }

    public static function updateRechazados($data) {
        $p = nwMaker::getData($data);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios", "drivers_rechazan,conductor_usuario", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $ser = $ca->flush();
        $drivers_rechazan = $ser["drivers_rechazan"];
        if (!isset(explode($p["usuario"], $ser["drivers_rechazan"])[1])) {
            if ($ser["drivers_rechazan"] !== null && $ser["drivers_rechazan"] !== "" && $ser["drivers_rechazan"] !== false) {
                $drivers_rechazan .= ",{$p["usuario"]}";
            } else {
                $drivers_rechazan .= "{$p["usuario"]}";
            }
        }
        $estado = "";
        $fields = "drivers_rechazan";
        if ($ser["conductor_usuario"] == $p["usuario"]) {
            $fields .= ",estado";
            $estado = "RECHAZADO_POR_CONDUCTOR";
        }
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":drivers_rechazan", $drivers_rechazan);
        $ca->bindValue(":estado", $estado);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if (isset($p["bloqueo_no_aceptacion_servicios"]) && $p["bloqueo_no_aceptacion_servicios"] == "SI") {
            $ca->prepareSelect("pv_clientes", "numero_rechazos", "usuario_cliente=:conductor_usuario and perfil=2 and empresa=:empresa and numero_rechazos is not null");
            $ca->bindValue(":conductor_usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"], true);
            $ca->bindValue(":perfil", 2);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $count_rechazos = 1;
            $numero_rechazos = ["numero_rechazados" => $count_rechazos, "numero_rechazados_totales" => $count_rechazos, "fecha_rechazo" => $fecha];
            if ($ca->size() > 0) {
                $j = $ca->flush();
                $j = json_decode($j["numero_rechazos"]);

                if ($j->fecha_rechazo < $fecha) {
                    $j->numero_rechazados = 0;
                    $j->fecha_rechazo = $fecha;
                }
                $j->numero_rechazados = $j->numero_rechazados + $count_rechazos;
                $j->numero_rechazados_totales = $j->numero_rechazados_totales + $count_rechazos;
                $numero_rechazos = $j;
            }
            $numero_rechazos = json_encode($numero_rechazos);
            $fields = 'numero_rechazos';
            $ca->prepareUpdate("pv_clientes", $fields, "usuario_cliente=:usuario_cliente and empresa=:empresa and perfil=:perfil ");
            $ca->bindValue(":usuario_cliente", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":numero_rechazos", $numero_rechazos);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":perfil", 2);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }

        $ca->prepareSelect("edo_servicios_conductores_notificados", "drivers", "id_servicio=:id");
        $ca->bindValue(":id", $p["id"], true, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $dri = $ca->flush();
        $dri["drivers"] = str_replace($p["usuario"], $p["usuario"] . "_(rechaza)", $dri["drivers"]);

        $ca->prepareUpdate("edo_servicios_conductores_notificados", "drivers", "id_servicio=:id");
        $ca->bindValue(":id", $p["id"], true, true);
        $ca->bindValue(":drivers", $dri["drivers"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $action = "Rechazado por un conductor.";
        $comments = "Conductor: {$p["usuario"]} - Fecha dispositivo: {$hoy}.";
        if ($ser["conductor_usuario"] == $p["usuario"]) {
            $action = "{$estado} Rechazado por conductor principal.";
            $comments = "{$estado} Conductor principal: {$p["usuario"]} - Fecha dispositivo: {$hoy}.";
        }
        $li = Array();
        $li["modulo"] = "app_driver:::rechaza_servicio";
        $li["accion"] = $action;
        $li["comentarios"] = $comments;
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        $li["fecha"] = $hoy;
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function consultaRechazados($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "numero_rechazos", "usuario_cliente=:conductor_usuario and perfil=2 and empresa=:empresa and numero_rechazos is not null");
        $ca->bindValue(":conductor_usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":perfil", 2);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $j = 0;
//         print_r($ca->flush());
//        return;
        if ($ca->size() > 0) {
            $j = $ca->flush();
            $j = json_decode($j["numero_rechazos"]);
        }
        return $j;
    }

    public static function actualizaEstadoConductor($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $ca->prepareSelect("pv_clientes", "numero_rechazos", "usuario_cliente=:conductor_usuario and perfil=2 and empresa=:empresa and numero_rechazos is not null");
        $ca->bindValue(":conductor_usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":perfil", 2);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $rechazo = "";
        if ($ca->size() > 0) {
            $j = $ca->flush();
            $rechazo = ",numero_rechazos";
            $j = json_decode($j["numero_rechazos"]);
            $j->numero_rechazados = 0;
            $numero_rechazos = json_encode($j);
        }

        $fields = 'estado_activacion,estado_activacion_text,fecha_bloqueo,motivo_bloqueo' . $rechazo;
        $ca->prepareUpdate("pv_clientes", $fields, "usuario_cliente=:usuario_cliente and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario_cliente", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha_bloqueo", $hoy);
        $ca->bindValue(":perfil", 2);
        $ca->bindValue(":estado_activacion", "6");
        $ca->bindValue(":estado_activacion_text", "Bloqueado");
        $ca->bindValue(":motivo_bloqueo", $p["motivo_bloqueo"]);
        if ($rechazo != "") {
            $ca->bindValue(":numero_rechazos", $numero_rechazos);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $tittle = "Bloqueo";
        $a = Array();
        $a["correo_usuario_recibe"] = $p["usuario"];
        $a["destinatario"] = $p["usuario"];
        $a["titleMensaje"] = $tittle;
        $a["sms_body"] = "bloqueado";
        $a["body"] = "Tu usuario ha sido bloqueado";
        $a["body_email"] = "bloqueado";
        $a["tipo"] = "enviarBloqueo";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = $hoy;
        $a["tipoAviso"] = "driver";
//        $a["foto"] = $logo;
        $a["usuario_envia"] = "soportegrupo.com";
        $a["sendEmail"] = true;
        $a["sendNotifyPush"] = true;
//        $a["celular"] = $p["celular"];
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["fromName"] = "prueba";
        $a["fromEmail"] = "soportegrupo.com";
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        $n = nwMaker::notificacionNwMaker($a);
//        NWJSonRpcServer::console($n);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }

        return true;
    }

    public static function consultaIncumplimiento($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fecha = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
//        print_r($fecha);
//        return;
        $ca->prepareSelect("pv_clientes", "fecha_bloqueo", "usuario_cliente=:conductor_usuario and perfil=2 and empresa=:empresa and fecha_bloqueo is not null");
        $ca->bindValue(":conductor_usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":perfil", 2);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
//        print_r($ca->size());
//        return;
        $where = "empresa=:empresa and conductor_usuario=:conductor_usuario and estado=:estado";
        if ($ca->size() > 0) {
            $j = $ca->flush();
            $where .= " and CONCAT(fecha, ' ', hora) <:fecha  and  CONCAT(fecha, ' ', hora) > :fecha_bloqueo";
            $ca->bindValue(":fecha_bloqueo", $j["fecha_bloqueo"]);
        } else {
            $where .= " and CONCAT(fecha, ' ', hora) <:fecha";
        }
        $ca->prepareSelect("edo_servicios", "*", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":conductor_usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":estado", "ACEPTADO_RESERVA");
        $ca->bindValue(":fecha", $fecha);

        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaTardanzas($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
//        $fecha = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
//        print_r($fecha);
//        return;
        $minutos = "10";
        if (isset($p["minutos_adicionar_tardanzas"])) {
            $minutos = $p["minutos_adicionar_tardanzas"];
        }
        $ca->prepareSelect("pv_clientes", "fecha_bloqueo", "usuario_cliente=:conductor_usuario and perfil=2 and empresa=:empresa and fecha_bloqueo is not null");
        $ca->bindValue(":conductor_usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":perfil", 2);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $where = "empresa=:empresa and conductor_usuario=:conductor_usuario and tipo_servicio=:tipo_servicio and estado=:estado";
        if ($ca->size() > 0) {
            $j = $ca->flush();
            $where .= " and CONCAT(fecha, ' ', hora) + INTERVAL " . $minutos . " MINUTE < CONCAT(fecha, ' ', hora_llegada) and  CONCAT(fecha, ' ', hora) > :fecha_bloqueo";
            $ca->bindValue(":fecha_bloqueo", $j["fecha_bloqueo"]);
        } else {
            $where .= " and CONCAT(fecha, ' ', hora) + INTERVAL " . $minutos . " MINUTE < CONCAT(fecha, ' ', hora_llegada)";
        }
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":conductor_usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":tipo_servicio", "reservado");
        $ca->bindValue(":estado", "LLEGADA_DESTINO");
//        print_r($ca->preparedQuery());
//        return;
//        $ca->bindValue(":fecha", $fecha);
//        print_r($ca->preparedQuery());
//        return;

        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaMisSalasChat($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "empresa=:empresa and usuario=:usuario and perfil=:perfil order by id desc";
//        $ca->prepareSelect("edo_salas_soporte", "*,'<p class=\"qx_containButton\" ><a class=\"qx_verimgButton\" target=\"_blank\">Chat</a></p><br />' as chat", $where);
        $ca->prepareSelect("edo_salas_soporte", "*,'<p class=\"qx_containButton\" ><button class=\"qx_verimgButton\">Chat</button></p><br />' as chat", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"], true);
        $ca->bindValue(":perfil", 2);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function actualizaParada($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);

//        if (isset($p["detalleRegistroFoto"]) && isset($p["detalleRegistroFoto"]["rotulos"])) {
//            $ca->prepareUpdate("edo_enrutamiento_rotulos", "rotulos_finales,estado", "id_parada=:id_parada");
//            $ca->bindValue(":id_parada", $p["id"]);
//            $ca->bindValue(":rotulos_finales", json_encode($p["detalleRegistroFoto"]["rotulos"]));
//            $ca->bindValue(":estado", "FINALIZADO");
//            if (!$ca->exec()) {
//                return NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->lastErrorText());
//            }
//        }
//        return;
//        return api_sitca::envioEstado($p);
//        return self::sendNotifyPasajeroNovedad($p);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $paradas_adicional_numero_total = 0;
        $ca->prepareSelect("edo_servicios", "paradas_adicional_numero_total", "id=:id");
        $ca->bindValue(":id", $p["id_servicio"]);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $se = $ca->flush();
        if (nwMaker::evalueData($se["paradas_adicional_numero_total"])) {
            $paradas_adicional_numero_total = $se["paradas_adicional_numero_total"];
        }
        $paradas_adicional_numero_total_final = $paradas_adicional_numero_total + 1;
        $paradas_adicional_valor_unitario = 0;
        if (isset($p["paradas_adicional_valor_unitario"])) {
            $paradas_adicional_valor_unitario = $p["paradas_adicional_valor_unitario"];
        }
        $paradas_adicional_valor_total = $paradas_adicional_valor_unitario * $paradas_adicional_numero_total_final;
        $ca->prepareUpdate("edo_servicios", "paradas_adicional_numero_total,paradas_adicional_valor_unitario,paradas_adicional_valor_total", "id=:id");
        $ca->bindValue(":id", $p["id_servicio"]);
        $ca->bindValue(":paradas_adicional_numero_total", $paradas_adicional_numero_total_final);
        $ca->bindValue(":paradas_adicional_valor_unitario", $paradas_adicional_valor_unitario);
        $ca->bindValue(":paradas_adicional_valor_total", $paradas_adicional_valor_total);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $latitud_final = null;
        if (isset($p["latitud_final"])) {
            $latitud_final = $p["latitud_final"];
        }
        $longitud_final = null;
        if (isset($p["longitud_final"])) {
            $longitud_final = $p["longitud_final"];
        }
        $where = "id=:id";
        $f = "estado";
        if (nwMaker::evalueData($latitud_final) || nwMaker::evalueData($longitud_final)) {
            $f .= ",fecha_final,latitud_final,longitud_final";
        }
        $novedad = null;
        $novedad_observaciones = null;
        if (isset($p["detalleNovedad"])) {
            if (isset($p["detalleNovedad"]["novedad"]) && nwMaker::evalueData($p["detalleNovedad"]["novedad"])) {
                $f .= ",novedad";
                $novedad = $p["detalleNovedad"]["novedad"];
            }
            if (isset($p["detalleNovedad"]["novedad_text"]) && nwMaker::evalueData($p["detalleNovedad"]["novedad_text"])) {
                $f .= ",novedad_observaciones";
                $novedad_observaciones = $p["detalleNovedad"]["novedad_text"] . " Observaciones driver: " . $p["detalleNovedad"]["observaciones"];
            }
        }
        $registro_fotografico = null;
        if (isset($p["detalleRegistroFoto"]) && isset($p["detalleRegistroFoto"]["registro_fotografico"])) {
            $f .= ",registro_fotografico";
            $registro_fotografico = $p["detalleRegistroFoto"]["registro_fotografico"];
        }
        $estado_origendestino = NULL;
        if (isset($p["estado_origendestino"])) {
            $f .= ",estado_origendestino";
            $estado_origendestino = $p["estado_origendestino"];
        }
        $ca->prepareUpdate("edo_servicio_parada", $f, $where);
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":novedad_observaciones", $novedad_observaciones);
        $ca->bindValue(":novedad", $novedad, true, true);
        $ca->bindValue(":registro_fotografico", $registro_fotografico);
        $ca->bindValue(":fecha_final", $hoy);
        $ca->bindValue(":latitud_final", $latitud_final);
        $ca->bindValue(":longitud_final", $longitud_final);
        $ca->bindValue(":estado_origendestino", $estado_origendestino);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        self::sendNotifyPasajeroNovedad($p);

        api_movilmove::actualizaGuiaSitca($p);

        if (isset($p["detalleRegistroFoto"]) && isset($p["detalleRegistroFoto"]["registro_fotografico_otras_fotos"])) {
            $add = Array();
            $add["estado"] = $p["estado"];
            $add["comentarios"] = "Adjunto fotos parada, {$novedad_observaciones}";
            $add["files"] = Array();
            $add["files"]["files"] = $p["detalleRegistroFoto"]["registro_fotografico_otras_fotos"];
            $add["files"]["comentarios"] = $p["detalleRegistroFoto"]["registro_fotografico_comentarios"];
            $add["id_servicio"] = $p["id_servicio"];
            $add["id_parada"] = $p["id"];
            $add["tipo"] = "PARADA";
            $add["usuario"] = $p["usuario"];
            $add["empresa"] = $p["empresa"];
            $add["fecha"] = $hoy;
            $add["perfil"] = 2;
            $add["latitud"] = $latitud_final;
            $add["longitud"] = $longitud_final;
            addPhotos::save($add);
        }
        if (isset($p["detalleRegistroFoto"]) && isset($p["detalleRegistroFoto"]["rotulos"])) {
            $ca->prepareUpdate("edo_enrutamiento_rotulos", "rotulos_finales,estado", "id_parada=:id_parada");
            $ca->bindValue(":id_parada", $p["id"]);
            $ca->bindValue(":rotulos_finales", json_encode($p["detalleRegistroFoto"]["rotulos"]));
            $ca->bindValue(":estado", "FINALIZADO");
            if (!$ca->exec()) {
                return NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->lastErrorText());
            }
        }

        $li = Array();
        $li["modulo"] = "app_driver:::cambiaEstadoParada";
        $li["accion"] = "Parada - Cambio de estado {$p["estado"]}";
        $li["comentarios"] = "#{$p["id"]} (id parada)";
        if (isset($p["id_servicio"])) {
            $li["id_servicio"] = $p["id_servicio"];
        }
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        if (isset($p["latitud"])) {
            $li["latitud"] = $p["latitud"];
        }
        if (isset($p["longitud"])) {
            $li["longitud"] = $p["longitud"];
        }
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function sendNotifyPasajeroNovedad($p) {
        if ($p["estado"] != "NOVEDAD") {
            return true;
        }
        $ra = Array();
        $ra["title"] = "Viaje finalizado con novedad";
        $ra["body"] = "No se pudo completar un viaje, presenta novedad";
        $ra["token"] = $p["token_usuario"];
        return nwMaker::sendNotificacionPush($ra);
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
//        $ca->prepareSelect("pv_clientes", "token_actual_app", "");
//        $ca->bindValue(":id", $id);
//        $ca->bindValue(":comentario", $p["comentarios"]);
//        $ca->bindValue(":usuario", $p["usuario"]);
//        $ca->bindValue(":empresa", $p["empresa"]);
//        $ca->bindValue(":token", $p["token"]);
//        $ca->bindValue(":perfil", 2);
//        $ca->bindValue(":hora", $hora);
//        $ca->bindValue(":fecha", $fecha);
//        $ca->bindValue(":estado", "LLAMANDO");
//        if (!$ca->exec()) {
//            $db->rollback();
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//        }
    }

    public static function saveSalasSoporte($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $id = master::getNextSequence("edo_salas_soporte_id_seq", $db);
        $ca->prepareInsert("edo_salas_soporte", "id,comentario,usuario,empresa,perfil,hora,fecha,estado,token");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":comentario", $p["comentarios"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":token", $p["token"]);
        $ca->bindValue(":perfil", 2);
        $ca->bindValue(":hora", $hora);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":estado", "LLAMANDO");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();
        return $id;
    }

    public static function cambiarFormaPago($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "tipo_pago", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":tipo_pago", $p["tipo_pago"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function comisiones($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_comisiones", "porcentaje", "empresa=:empresa and activo='SI' order by id desc limit 1");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->flush();
    }

    public static function inactiveVehiculo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_vehiculos", "*", "empresa=:empresa and id=:id_vehiculo and usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":id_vehiculo", $p["id_vehiculo"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $vehicu = $ca->flush();
        if ($vehicu["estado_activacion"] == 1) {
            $fields = "estado_activacion,estado_activacion_text,activacion_cliente";
            $ca->prepareUpdate("edo_vehiculos", $fields, "id=:id");
            $ca->bindValue(":id", $vehicu["id"]);
            $ca->bindValue(":activacion_cliente", "NO");
            $ca->bindValue(":estado_activacion", 3);
            $ca->bindValue(":estado_activacion_text", "bloqueado");
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    public static function populateRecargos($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $r = Array();
        $where = "empresa=:empresa and :hora between desde and hasta  and estado='Activo' ";
        $ca->prepareSelect("edo_recargos", "*", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":hora", $hora);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $r["recargos"] = $ca->assocAll();
        if (isset($p["confirma_parada"]) && $p["confirma_parada"] == true) {
            $where1 = "id_servicio=:id_servicio and empresa=:empresa and estado=:estado and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL) ";
            $ca->prepareSelect("edo_servicio_parada", "count(id) as confirmadas", $where1);
            $ca->bindValue(":id_servicio", $p["id_service"]);
            $ca->bindValue(":estado", "CONFIRMADO");
            $ca->bindValue(":empresa", $p["empresa"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $r["countparadas"] = $ca->flush();
            return $r;
        }
        if (!isset($p["usuario"])) {
            return $r["recargos"];
        }
        return $r;
    }

    public static function consultaTiempoEspera($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fields = "minutos,valor";
        $ca->prepareSelect("edo_tiempos_espera", $fields, "empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function saldoRecargaUser($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $perfil = "1";
        $where = " usuario=:usuario and empresa=:empresa and perfil=:perfil";
        $ca->prepareSelect("pv_clientes", " saldo ", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
//        NWJSonRpcServer::information($ca->preparedQuery());
        return $ca->flush();
    }

//    public static function saveStateTravel($data) {
//        $p = nwMaker::getData($data);
//
//        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
//        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
//        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
//
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
//        $ca->prepareSelect("edo_servicios", "stated_travel", "empresa=:empresa and id=:id");
//        $ca->bindValue(":empresa", $p["empresa"]);
//        $ca->bindValue(":id", $p["id_service"]);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
//            return false;
//        }
//        $res = $ca->flush();
//        if (empty($res["stated_travel"])) {
//            $travel[0] = ['fecha' => $hoy, 'reporte_conductor' => $p["state_travel"]];
//            $states = json_encode($travel);
//        } else {
//            $res = json_decode($res["stated_travel"]);
//            $r = count($res);
//            $states = $res;
//            $states[$r] = ['fecha' => $hoy, 'reporte_conductor' => $p["state_travel"]];
//            $states = json_encode($states);
//        }
//
//        $ca->prepareUpdate("edo_servicios", "stated_travel", "empresa=:empresa and id=:id");
//        $ca->bindValue(":empresa", $p["empresa"]);
//        $ca->bindValue(":id", $p["id_service"]);
//        $ca->bindValue(":stated_travel", $states);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
//            return false;
//        }
//        return true;
//    }

    public static function consultaTotalServicios($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $fields = "latitudOri,longitudOri,servicio";
        $ca->prepareSelect("edo_servicios", $fields, "empresa=:empresa and fecha=:fecha");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":estado", "SIN_ATENDER_ARCHIVADO");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateTokenDomiciliario($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        $where .= " and  now() between desde and hasta and estado =:estado";
        $ca->prepareSelect("edo_recargos", "*", $where);
        $ca->bindValue(":estado", "Activo");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function cancelaConductor($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareUpdate("edo_servicios", "estado", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", "CANCELADO_POR_CONDUCTOR");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $id = $p["id"];
        $mensaje = "El conductor ha cancelado el servicio";
        $a = Array();
        $a["destinatario"] = $p["usuario"];
        $a["body"] = $mensaje;
        $a["modo_window"] = "popup";
        $a["sendEmail"] = false;
        $a["titleMensaje"] = "Respuesta solicitud";
        $a["callback"] = "";
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        nwMaker::notificacionNwMaker($a);
        return true;
    }

    public static function llegadaServicioCon($p) {
        $p = nwMaker::getData($p);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "estado,hora_llegada,latitudConfirmaLlegada,longitudConfirmaLlegada,fecha_llegada", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":latitudConfirmaLlegada", $p["latitudConfirmaLlegada"]);
        $ca->bindValue(":longitudConfirmaLlegada", $p["longitudConfirmaLlegada"]);
        $ca->bindValue(":estado", "EN_SITIO");
        $ca->bindValue(":hora_llegada", $hora);
        $ca->bindValue(":fecha_llegada", $fecha);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $li = Array();
        $li["modulo"] = "app_driver:::viaje en curso::: confirma llegada";
        $li["accion"] = "Cambio de estado EN_SITIO.";
        $li["comentarios"] = "El conductor confirma llegada al sitio de partida, hora dispositivo: {$hora} - fecha dispositivo {$fecha} .";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["fecha"] = $hoy;
        $li["perfil"] = 2;
        $li["latitud"] = $p["latitudConfirmaLlegada"];
        $li["longitud"] = $p["longitudConfirmaLlegada"];
        $li["all_data"] = $p;
        lineTime::save($li);

        if (isset($p["files"])) {
            $add = Array();
            $add["estado"] = "EN_SITIO";
            $add["comentarios"] = "El conductor confirma llegada al sitio de partida, hora dispositivo: {$hora} - fecha dispositivo {$fecha} .";
            $add["files"] = $p["files"];
            $add["id_servicio"] = $p["id"];
            $add["usuario"] = $p["usuario"];
            $add["empresa"] = $p["empresa"];
            $add["fecha"] = $hoy;
            $add["perfil"] = 2;
            $add["latitud"] = $p["latitudConfirmaLlegada"];
            $add["longitud"] = $p["longitudConfirmaLlegada"];
            addPhotos::save($add);
        }

        $book = booking::updateStatusTravel($p["dataService"]);

        return true;
    }

    public static function confirmarAbordaje($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $tiempo_espera = "0";
        if (isset($p["tiempo_espera"])) {
            $tiempo_espera = $p["tiempo_espera"];
        }
        $valor_espera = "0";
        if (isset($p["valor_espera"])) {
            $valor_espera = $p["valor_espera"];
        }
        $recargo_valor_minuto_valor_espera = "0";
        if (isset($p["recargo_valor_minuto_valor_espera"])) {
            $recargo_valor_minuto_valor_espera = $p["recargo_valor_minuto_valor_espera"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $ca->prepareUpdate("edo_servicios", "estado,latitudConfirmaAbordaje,longitudConfirmaAbordaje,hora_inicio,fecha_inicio,tiempo_espera,valor_espera,recargo_valor_minuto_valor_espera", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":latitudConfirmaAbordaje", $p["latitudConfirmaAbordaje"]);
        $ca->bindValue(":longitudConfirmaAbordaje", $p["longitudConfirmaAbordaje"]);
        $ca->bindValue(":hora_inicio", $hora);
        $ca->bindValue(":fecha_inicio", $fecha);
        $ca->bindValue(":estado", "ABORDO");
        $ca->bindValue(":tiempo_espera", $tiempo_espera);
        $ca->bindValue(":valor_espera", $valor_espera);
        $ca->bindValue(":recargo_valor_minuto_valor_espera", $recargo_valor_minuto_valor_espera);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $li = Array();
        $li["modulo"] = "app_driver:::viaje en curso::: confirma recogida";
        $li["accion"] = "Cambio de estado ABORDO.";
        $li["comentarios"] = "El conductor confirma abordaje e inicia servicio, hora dispositivo: {$hora} - fecha dispositivo {$fecha} .";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["fecha"] = $hoy;
        $li["perfil"] = 2;
        $li["latitud"] = $p["latitudConfirmaAbordaje"];
        $li["longitud"] = $p["longitudConfirmaAbordaje"];
        $li["all_data"] = $p;
        lineTime::save($li);

        if (isset($p["files"])) {
            $add = Array();
            $add["estado"] = "ABORDO";
            $add["comentarios"] = "El conductor confirma abordaje e inicia servicio, hora dispositivo: {$hora} - fecha dispositivo {$fecha} .";
            $add["files"] = $p["files"];
            $add["id_servicio"] = $p["id"];
            $add["usuario"] = $p["usuario"];
            $add["empresa"] = $p["empresa"];
            $add["fecha"] = $hoy;
            $add["perfil"] = 2;
            $add["latitud"] = $p["latitudConfirmaAbordaje"];
            $add["longitud"] = $p["longitudConfirmaAbordaje"];
            addPhotos::save($add);
        }

        $book = booking::updateStatusTravel($p["dataService"]);

        $db->commit();
        return true;
    }

    public static function getDataServiceFinal($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios", "*", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function makePagoCreditConekta($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_tarjetascredito", "token_id,customer_id_conekta", "id=:id");
        $ca->bindValue(":id", $p["id_tarjeta_credito"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return "La tarjeta de crédito no existe";
        }
        $r = $ca->flush();

        $customer_id = $r["customer_id_conekta"];

        $c = nwMaker::getKeysConekta($p);
        if ($c === false || $c === 0) {
            return "No hay configuración de keys";
        }
        $p["id_config"] = $c["id"];

        $llavePublica = $c["llavePublica"];
        $llavePrivada = $c["llavePrivada"];
        require_once $_SERVER['DOCUMENT_ROOT'] . $p["ruta"] . 'conekta-php-master/lib/Conekta.php';
        \Conekta\Conekta::setApiKey($llavePrivada);
        \Conekta\Conekta::setApiVersion("2.0.0");

        //Implementación de una orden.
        try {
            $order = \Conekta\Order::create(
                            [
                                "line_items" => [
                                    [
                                        "name" => $p["itemName"],
                                        "unit_price" => $p["item_unit_price"],
                                        "quantity" => $p["itemQuantity"]
                                    ]
                                ],
                                "shipping_lines" => [
                                    [
                                        "amount" => 0
//                                "amount" => 1500,
//                                "carrier" => "FEDEX"
                                    ]
                                ], //shipping_lines - physical goods only
                                "currency" => $p["currency"],
                                "customer_info" => [
                                    "customer_id" => $customer_id
                                ],
                                "shipping_contact" => [
                                    "address" => [
                                        "street1" => $p["street1"],
                                        "postal_code" => $p["postal_code"],
                                        "country" => $p["country"]
                                    ]
                                ], //shipping_contact - required only for physical goods
                                "metadata" => ["reference" => $p["reference"], "more_info" => $p["more_info"]],
                                "charges" => [
                                    [
                                        "payment_method" => [
                                            "type" => "default"
//                                    "type" => $p["payment_method_type"],
//                                    "payment_source_id" => $p["token_id"]
                                        ]
                                    ////payment_method - use customer's default - a card
                                    //to charge a card, different from the default,
                                    //you can indicate the card's source_id as shown in the Retry Card Section
                                    ]
                                ]
                            ]
            );
        } catch (\Conekta\ProcessingError $error) {
            return $error->getMessage();
        } catch (\Conekta\ParameterValidationError $error) {
            return $error->getMessage();
        } catch (\Conekta\Handler $error) {
            return $error->getMessage();
        }

        $rta = Array();
        $rta["order"] = $order;
        $rta["status"] = "OK";
        return $rta;
//        echo "<h1>Pago exitoso!</h1><br />";
//        echo "ID: " . $order->id . "<br />";
//        echo "Status: " . $order->payment_status . "<br />";
//        echo "$" . $order->amount / 100 . $order->currency . "<br />";
//        echo "Order" . "<br />";
//        echo $order->line_items[0]->quantity .
//        " - " . $order->line_items[0]->name .
//        " - $" . $order->line_items[0]->unit_price / 100 . "<br />";
//        echo "Payment info" . "<br />";
//        echo "CODE:" . $order->charges[0]->payment_method->auth_code . "<br />";
//        echo "Card info:" . "<br />" .
//        " - " . $order->charges[0]->payment_method->name .
//        " - " . $order->charges[0]->payment_method->last4 .
//        " - " . $order->charges[0]->payment_method->brand .
//        " - " . $order->charges[0]->payment_method->type;
    }

    public static function makePagoCreditEpayco($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_tarjetascredito", "*", "id=:id");
        $ca->bindValue(":id", $p["id_tarjeta_credito"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        if ($ca->size() === 0) {
            return "La tarjeta de crédito no existe";
        }
        $r = $ca->flush();

        $valor = $p["valor_servicio_inicial"];
        if ($p["precio_viaje"] != "") {
            $valor = $p["precio_viaje"];
        }

        $data = Array();
        if (isset($p["apiKeyEpayco"]) && isset($p["privateKeyEpayco"])) {
            $data["apiKeyEpayco"] = $p["apiKeyEpayco"];
            $data["privateKeyEpayco"] = $p["privateKeyEpayco"];
        }
        $data["description"] = "Pago servicio {$p["app_name"]}";
        $data["id_relational_pay"] = $p["id_relational_pay"];
        $data["price"] = $valor;
        $data["id_tarjeta"] = $r["id"];
        $data["usuario"] = $p["usuario"];
        $data["empresa"] = $p["empresa"];
        $data["perfil"] = $p["perfil"];
        $data["test"] = $p["test"];
        $v = nwMaker::NwPayEpayco($data);
        return $v;
    }

    public static function makePagoCreditPayu($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_tarjetascredito", "*", "id=:id");
        $ca->bindValue(":id", $p["id_tarjeta_credito"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return "La tarjeta de crédito no existe";
        }
        $r = $ca->flush();

        $valor = $p["valor_servicio_inicial"];
        if ($p["precio_viaje"] != "" && $p["precio_viaje"] != null && $p["precio_viaje"] != "0" && $p["precio_viaje"] != 0 && $p["precio_viaje"] != false) {
            $valor = $p["precio_viaje"];
        }

        if ($valor == 0) {
            return "pago_en_ceros_aprobada";
        }

        $data = Array();
        $data["usuario"] = $p["usuario"];
        $data["empresa"] = $p["empresa"];
        $data["usuario_text"] = $p["nombre_usuario"];
        $data["id_usuario"] = $p["id_usuario"];
        $data["price"] = $valor;
        $data["cuotas"] = "1";
        $data["capturar_tarjeta"] = false;
        $data["description"] = "Pago viaje transporte especial";
        $data["email"] = $r["usuario"];
        $data["pais"] = $r["pais"];
        $data["currency"] = $r["currency"];
        $data["nombre_tarjeta"] = $r["nombre_tarjeta"];
        $data["documento"] = $r["documento"];
        $data["nombre_banco"] = $r["nombre_banco"];
        $data["numero_tarjeta"] = $r["numero_tarjeta"];
        $data["fecha_vencimiento"] = $r["fecha_vencimiento"];
        $data["codigo_seguridad"] = $r["codigo_seguridad"];
        $v = nwMaker::apiNwPayTesting($data);
        return $v;
    }

    public static function sendEmailServicioDestiono($data, $r = false) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (!isset($p["usuario_cliente"])) {
            return true;
        }
        if (!nwMaker::evalueData($p["usuario_cliente"])) {
            return true;
        }
        if (!isset($p["nit"])) {
            $ca->prepareSelect("pv_clientes", "nit,telefono", "empresa=:empresa and usuario_cliente=:usuario_cliente and perfil=1 ");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":usuario_cliente", $p["usuario_cliente"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $cliente = $ca->flush();
                $p["nit"] = $cliente["nit"];
                $p["telefono"] = $cliente["telefono"];
            }

            $ca->prepareSelect("pv_clientes", "nit", "id=:id");
            $ca->bindValue(":id", $p["id_usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $cond = $ca->flush();
                $p["identificacion_conductor"] = $cond["nit"];
            }
        }

        $ca->prepareSelect("empresas", "razon_social,slogan,logo,email,img_header,img_body,img_footer", "id=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $empresa = $ca->flush();

        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
        $logo = "https://" . $hostname . "{$empresa["logo"]}";
        $razon_social = $empresa["razon_social"];
        $slogan = $empresa["slogan"];
        $cliente = strtoupper($p["nombre_cliente"]);

        $ca->prepareSelect("nwmaker_plantillas_correos", "*", "empresa=:empresa and tipo=:tipo and activo='SI' ");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":tipo", 'sendEmailServiceEnd');
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $plantilla = $ca->flush();
        if ($plantilla > 0) {
            $logo_empresa = $logo;
            $firma_usuario = "https://" . $hostname . "{$p["firma_recibido"]}";
            $nombre_cliente = master::clean($p["nombre_cliente"]);
            $dir_origen = master::clean($p["dir_origen"]);
            $dir_destino = master::clean($p["dir_destino"]);
            $fecha_hora = date("Y-m-d H:i:s");
            $tipo_pago = master::clean($p["tipo_pago"]);
            $precio_viaje = master::clean($p["precio_viaje"]);
            $correo = master::clean($p["usuario_cliente"]);
            $valor_recargo = master::clean($p["valor_recargo"]);
            $valor_peajes = master::clean($p["valor_peajes"]);
            $descuento_aplicado = master::clean($p["descuento_aplicado"]);
            $nit = master::clean($p["nit"]);
            $telefono = master::clean($p["telefono"]);
            $id = master::clean($p["id"]);
            $remitente = master::clean($p["remitente"]);
            $telefono_recogida = master::clean($p["telefono_recogida"]);
            $destinatario = master::clean($p["destinatario"]);
            $telefono_entrega = master::clean($p["telefono_entrega"]);
            $placa = master::clean($p["placa"]);
            $conductor = master::clean($p["conductor"]);
            $identificacion_conductor = master::clean($p["identificacion_conductor"]);
            $tipo_vehiculo = master::clean($p["tipo_vehiculo"]);

            $body = $plantilla["cuerpo_mensaje"];
            $body = str_replace("{logo_empresa}", $logo_empresa, $body);
            $body = str_replace("{id}", $id, $body);
            $body = str_replace("{fecha}", $fecha_hora, $body);
            $body = str_replace("{origen}", $dir_origen, $body);
            $body = str_replace("{destino}", $dir_destino, $body);
            $body = str_replace("{tipo_pago}", $tipo_pago, $body);
            $body = str_replace("{precio_viaje}", $precio_viaje, $body);
            $body = str_replace("{logo}", $logo, $body);
            $body = str_replace("{razon_social}", $razon_social, $body);
            $body = str_replace("{correo_cliente}", $correo, $body);
            $body = str_replace("{nombre_cliente}", $nombre_cliente, $body);
            $body = str_replace("{valor_recargo}", $valor_recargo, $body);
            $body = str_replace("{valor_peajes}", $valor_peajes, $body);
            $body = str_replace("{descuento_aplicado}", $descuento_aplicado, $body);
            $body = str_replace("{firma_usuario}", $firma_usuario, $body);
            $body = str_replace("{nit}", $nit, $body);
            $body = str_replace("{telefono}", $telefono, $body);
            $body = str_replace("{remitente}", $remitente, $body);
            $body = str_replace("{telefono_recogida}", $telefono_recogida, $body);
            $body = str_replace("{destinatario}", $destinatario, $body);
            $body = str_replace("{telefono_entrega}", $telefono_entrega, $body);
            $body = str_replace("{placa}", $placa, $body);
            $body = str_replace("{conductor}", $conductor, $body);
            $body = str_replace("{identificacion_conductor}", $identificacion_conductor, $body);
            $body = str_replace("{tipo_vehiculo}", $tipo_vehiculo, $body);
            $body = str_replace("{punto_punto}", $p["punto_punto"], $body);
            $body = str_replace("{medio_dia}", $p["medio_dia"], $body);
            $body = str_replace("{dia}", $p["dia"], $body);
            $body = str_replace("{retorno}", $p["retorno"], $body);
            $body = str_replace("{numero_auxiliares}", $p["numero_auxiliares"], $body);
            $body = str_replace("{empaque}", $p["empaque"], $body);
            $body = str_replace("{cantidad}", $p["cantidad"], $body);
            $body = str_replace("{descricion_carga}", $p["descricion_carga"], $body);
            $body = str_replace("{aplico_peaje}", $p["aplico_peaje"], $body);
            $body = str_replace("{volumen}", $p["volumen"], $body);
            $body = str_replace("{valor_declarado}", $p["valor_declarado"], $body);
            $body = str_replace("{remesa}", $p["remesa"], $body);
            $body = str_replace("{hora_inicio}", $p["hora_inicio_calcu"], $body);
            $body = str_replace("{hora_fin}", $p["hora_fin_calcu"], $body);
            $body = str_replace("{total_tiempo}", $p["tiempo"], $body);
            $body_notify = "Tu viaje ha finalizado";

            $a = Array();
            $a["correo_usuario_recibe"] = $p["usuario_cliente"];
            $a["destinatario"] = $p["usuario_cliente"];
            $a["titleMensaje"] = $plantilla["asunto"];
            $a["sms_body"] = $body_notify;
            $a["body"] = $body_notify;
            $a["body_email"] = $body;
            $a["tipo"] = "enviarInCron";
            $a["link"] = null;
            $a["modo_window"] = "popup";
            $a["fechaAviso"] = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
            $a["tipoAviso"] = "driver";
            $a["id_objetivo"] = $p["id"];
            $a["foto"] = $logo;
            $a["usuario_envia"] = $p["usuario_cliente"];
            $a["sendEmail"] = true;
            $a["sendNotifyPush"] = false;
            $a["celular"] = null;
            $a["send_sms"] = false;
            $a["cleanHtml"] = true;
            $a["fromName"] = $plantilla["enviado_por_nombre"];
            $a["fromEmail"] = $plantilla["enviado_por_correo"];
            $a["insertaEnTabla"] = true;
            $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
            $n = nwMaker::notificacionNwMaker($a);
            if ($n !== true) {
                $db->rollback();
                return $n;
            }
            return;
        }

        $html = "<h1>Total: $" . $p["precio_viaje"] . "</h1>";
//        $html .= "<p><strong>Tipo pago: </strong>" . $p["tipo_pago"] . "</p>";
//        $html .= "<p><strong>Origen: </strong>" . $p["origen"] . "</p>";
//        $html .= "<p><strong>Destino: </strong>" . $p["destino"] . "</p>";
//        $html .= "<p><strong>Fecha: </strong>" . date("Y-m-d H:i:s") . "</p>";

        $html .= "<p><strong>" . servicios_conductor::validaTrad("Tipo pago:", $r, "tipo_pago") . " </strong>" . $p["tipo_pago"] . "</p>";
        $html .= "<p><strong>" . servicios_conductor::validaTrad("Origen:", $r, "origen") . " </strong>" . $p["origen"] . "</p>";
        $html .= "<p><strong>" . servicios_conductor::validaTrad("Destino:", $r, "destino") . " </strong>" . $p["destino"] . "</p>";
        $html .= "<p><strong>" . servicios_conductor::validaTrad("Fecha:", $r, "fecha") . " </strong>" . date("Y-m-d H:i:s") . "</p>";

        $tittle = " ";

        $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;'>";
        $body .= "<div style='position: relative;display: flex;'>";
        $body .= "<div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>";
        $body .= "<p style='width: 167px;Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 38px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>";
        $body .= $tittle;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 40px;margin: auto;width: 230px;position: absolute;'>";
        $body .= "<img style='width: 100%;' src='https://" . $hostname . $empresa["img_header"] . "' alt='' />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= " <div style='text-align: left; margin: 50px 0 10px 0; padding:20px'>
                        <p style='    Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 30px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>
                           {$cliente} " . servicios_conductor::validaTrad("gracias por preferirnos", $r, "gracias") . ".
                           " . servicios_conductor::validaTrad("Esperamos que hayas disfrutado tu viaje", $r, "esperamos_viaje") . ".
                       </p>
                    </div>";
        $body .= "<div style='text-align: left;margin: 30px 0 20px 0; padding: 0 20px'>";
        $body .= "<p>";
        $body .= $html;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;'>";
        $body .= "<img style='width: 100%;' src='https://" . $hostname . $empresa["img_body"] . "' alt='' />";
        $body .= "</div>";
        $body .= "<div style='background: #000000; text-align: center; color: #fff; position: relative;top: -20px;'>";
        $body .= "<div style='display: flex;padding: 17px;'>";
        $body .= "<div style='width: 200px;'>";
        $body .= "<img style='width: 200px;' src='https://" . $hostname . $empresa["img_footer"] . "' alt='' />";
        $body .= "</div>";
        $body .= "<div style='display: flex;justify-content: space-between;position: absolute;right: 47px;width: 112px;padding: 9px;'>";
        $body .= "<img  src='https://" . $hostname . "/imagenes/face-correo.png' alt='' />";
        $body .= "<img  src='https://" . $hostname . "/imagenes/istag-correo.png' alt='' />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<div>";
        $body .= "<p style='    width: 93%;margin: auto;margin-top: 20px;border-top: 1px solid grey;padding-top: 13px'>Con la tecnologia de";
        $body .= "<a href='https://www.gruponw.com' target='_blank'>NW Group</a>";
        $body .= "</p>";
        $body .= "<p style='margin: 0px;margin: 0px;padding-bottom: 13px;'>Hostname: {$hostname} - " . date("Y-m-d H:i:s") . "</p>";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "</div>";

        $body_notify = servicios_conductor::validaTrad("Tu viaje ha finalizado", $r, "asunto_viaje_finalizado");

        $a = Array();
        $a["correo_usuario_recibe"] = $p["usuario_cliente"];
        $a["destinatario"] = $p["usuario_cliente"];
        $a["titleMensaje"] = servicios_conductor::validaTrad("Tu viaje ha finalizado", $r, "asunto_viaje_finalizado");
        $a["sms_body"] = $body_notify;
        $a["body"] = $body_notify;
        $a["body_email"] = $body;
        $a["tipo"] = "enviarInCron";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
        $a["tipoAviso"] = "driver";
        $a["id_objetivo"] = $p["id"];
        $a["foto"] = $logo;
        $a["usuario_envia"] = $p["usuario_cliente"];
        $a["sendEmail"] = true;
        $a["sendNotifyPush"] = false;
        $a["celular"] = null;
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["fromName"] = $razon_social;
        $a["fromEmail"] = "";
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }


        $li = Array();
        $li["modulo"] = "app_driver:::enviaCorreo";
        $li["accion"] = "Envío de correo llegada destino a {$p["usuario_cliente"]} ";
        $li["comentarios"] = $body;
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        $li["all_data"] = $p;
        lineTime::save($li);
    }

    public static function duplicaViaje($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id_service_initial = $p["id"];
        $ca->prepareSelect("pv_clientes", "*", "id=:id");
        $ca->bindValue(":id", $p["conductor_proximo"]);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $res = $ca->flush();

        $ca->prepareSelect("edo_servicio_parada", "*", "id_servicio=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
//        $paradas = $ca->assocAll();
        $paradas = Array();
        $par = $ca->assocAll();
        $tot = count($par);
        for ($i = 0; $i < $tot; $i++) {
            $paradas[$i] = $par[$i];
            $paradas[$i]["estado_origendestino"] = "ORIGEN_FINALIZADO";
        }

        $ca->prepareSelect("edo_enrutamiento_rotulos", "*", "id_servicio=:id_servicio and estado='FINALIZADO' ");
        $ca->bindValue(":id_servicio", $id_service_initial);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $rotulos = $ca->assocAll();
        for ($i = 0; $i < count($rotulos); $i++) {
            $rot = $rotulos[$i];
            $ca->prepareInsert("edo_enrutamiento_rotulos", "empresa,usuario,fecha,numero_guia,rotulos");
            $ca->bindValue(":empresa", $rot["empresa"]);
            $ca->bindValue(":usuario", $rot["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":numero_guia", $rot["numero_guia"]);
            $ca->bindValue(":rotulos", $rot["rotulos"]);
            if (!$ca->exec()) {
                return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }

        $r = $p;
        $r["parada"] = $paradas;

        $r["id"] = "";
        $r["estado"] = "SOLICITUD";
        $r["conductor"] = $p["conductor_proximo"];
        $r["usuario_session"] = $p["usuario"];
        $r["conductor_text"] = $res["nombre"] . " " . $res["nombre"];
        $r["usuario_cond"] = $res["usuario_cliente"];
        $r["usuario"] = $res["id"];
        $r["usuario_text"] = $res["usuario"];
        $r["configCliente"] = $p["config"];
        $r["id_service_initial"] = $id_service_initial;
        $rta = servicios_admin::saveServicio($r);
        return $rta;
    }

    public static function llegadaServicioDestiono($data) {
        $p = nwMaker::getData($data);

        $comentarios_ubicacion = null;
        if (isset($p["files"])) {
            if (isset($p["files"]["comentarios"])) {
                $comentarios_ubicacion = $p["files"]["comentarios"];
                $p["dataService"]["comentarios_ubicacion"] = $p["files"]["comentarios"];
            }
        }

        if (isset($p["duplica_viaje"])) {
            self::duplicaViaje($p["dataService"]);
        }

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $valor = 0;
        if (isset($p["valor_servicio_inicial"])) {
            if (nwMaker::evalueData($p["valor_servicio_inicial"])) {
                if ($p["valor_servicio_inicial"] != "" && $p["valor_servicio_inicial"] != "NaN") {
                    $valor = $p["valor_servicio_inicial"];
                }
            }
        }
        if (isset($p["precio_viaje"])) {
            if (nwMaker::evalueData($p["precio_viaje"])) {
                if ($p["precio_viaje"] != "" && $p["precio_viaje"] != "NaN") {
                    $valor = $p["precio_viaje"];
                }
            }
        }
        $utilidad_conductor = 0;
        if (isset($p["utilidad_conductor"])) {
            if (nwMaker::evalueData($p["utilidad_conductor"])) {
                if ($p["utilidad_conductor"] != "" && $p["utilidad_conductor"] != "NaN") {
                    $utilidad_conductor = $p["utilidad_conductor"];
                }
            }
        }
        $utilidad_interna = 0;
        if (isset($p["utilidad_interna"])) {
            if (nwMaker::evalueData($p["utilidad_interna"])) {
                if ($p["utilidad_interna"] != "" && $p["utilidad_interna"] != "NaN") {
                    $utilidad_interna = $p["utilidad_interna"];
                }
            }
        }
        $descuento_aplicado = 0;
        if (isset($p["descuento_aplicado"])) {
            $descuento_aplicado = $p["descuento_aplicado"];
        }
        $saldo_user_aplicado = null;
        if (isset($p["saldo_user_aplicado"])) {
            $saldo_user_aplicado = $p["saldo_user_aplicado"];
        }
        $usuario_cliente = null;
        if (isset($p["usuario_cliente"])) {
            $usuario_cliente = $p["usuario_cliente"];
        }
        $payu_responseCode = null;
        if (isset($p["payu_responseCode"])) {
            $payu_responseCode = $p["payu_responseCode"];
        }
        $payu_orderId = null;
        if (isset($p["payu_orderId"])) {
            $payu_orderId = $p["payu_orderId"];
        }
        $aplico_peaje = null;
        if (isset($p["aplico_peaje"])) {
            $aplico_peaje = $p["aplico_peaje"];
        }
        $aplico_recargo = null;
        if (isset($p["aplico_recargo"])) {
            $aplico_recargo = $p["aplico_recargo"];
        }
        $numero_referidos = null;
        if (isset($p["numero_referidos"])) {
            $numero_referidos = $p["numero_referidos"];
        }
        $valor_referido = null;
        if (isset($p["valor_referido"])) {
            $valor_referido = $p["valor_referido"];
        }
        $total_metros = null;
        if (isset($p["total_metros_final"]) && nwMaker::evalueData($p["total_metros_final"])) {
            if (is_int($p["total_metros_final"])) {
                $total_metros = $p["total_metros_final"];
            } else {
                $total_metros = null;
            }
        }
        $fields = "fecha_finaliza_servicio_driver,estado,hora_fin_servicio,valor_total_servicio,latitudFinalizaServicio,"
                . "longitudFinalizaServicio,tiempo,descuento_aplicado,payu_responseCode,payu_orderId,utilidad_conductor,utilidad_empresa,comision_porcentaje,"
                . "aplico_recargo,aplico_peaje,total_metros_final,numero_referidos,valor_referido"
                . ",saldo_user_aplicado,iva,iva_porcentaje,porcentaje_proveedor,porcentaje_empresa";
        $firma = "";
        if (isset($p["firma_recibido"])) {
            $fields .= ",firma_recibido";
            $firma = $p["firma_recibido"];
        }
        $valor_final_tiempo = null;
        if (isset($p["valor_final_tiempo"])) {
            $fields .= ",valor_final_tiempo";
            $valor_final_tiempo = $p["valor_final_tiempo"];
        }
        $valor_final_distancia = null;
        if (isset($p["valor_final_distancia"])) {
            $fields .= ",valor_final_distancia";
            $valor_final_distancia = $p["valor_final_distancia"];
        }
        $formaCobroFinalAutomatico = null;
        if (isset($p["formaCobroFinalAutomatico"])) {
            $fields .= ",formaCobroFinalAutomatico";
            $formaCobroFinalAutomatico = $p["formaCobroFinalAutomatico"];
        }
        if ($comentarios_ubicacion != null) {
            $fields .= ",observacion_ultima_ubicacion";
        }
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":valor_total_servicio", $valor, true, true);
        $ca->bindValue(":total_metros_final", $total_metros, true, true);
        $ca->bindValue(":payu_orderId", $payu_orderId);
        $ca->bindValue(":payu_responseCode", $payu_responseCode);
        $ca->bindValue(":tiempo", $p["tiempo"]);
        $ca->bindValue(":latitudFinalizaServicio", $p["latitudFinalizaServicio"]);
        $ca->bindValue(":longitudFinalizaServicio", $p["longitudFinalizaServicio"]);
        $ca->bindValue(":comision_porcentaje", $p["comision_porcentaje"]);
        $ca->bindValue(":utilidad_conductor", $utilidad_conductor, true, true);
        $ca->bindValue(":utilidad_empresa", $utilidad_interna, true, true);
        $ca->bindValue(":porcentaje_proveedor", $p["porcentaje_proveedor"]);
        $ca->bindValue(":porcentaje_empresa", $p["porcentaje_empresa"]);
        $ca->bindValue(":estado", "LLEGADA_DESTINO");
        $ca->bindValue(":hora_fin_servicio", $hora);
        $ca->bindValue(":descuento_aplicado", $descuento_aplicado);
        $ca->bindValue(":aplico_peaje", $aplico_peaje);
        $ca->bindValue(":aplico_recargo", $aplico_recargo);
        $ca->bindValue(":numero_referidos", $numero_referidos, true, true);
        $ca->bindValue(":valor_referido", $valor_referido, true, true);
        $ca->bindValue(":saldo_user_aplicado", $saldo_user_aplicado, true, true);
        $ca->bindValue(":fecha_finaliza_servicio_driver", $hoy);
        $ca->bindValue(":iva", $p["iva"]);
        $ca->bindValue(":iva_porcentaje", $p["iva_porcentaje"]);
        $ca->bindValue(":firma_recibido", $firma);
        $ca->bindValue(":valor_final_tiempo", $valor_final_tiempo);
        $ca->bindValue(":valor_final_distancia", $valor_final_distancia);
        $ca->bindValue(":formaCobroFinalAutomatico", $formaCobroFinalAutomatico);
        $ca->bindValue(":observacion_ultima_ubicacion", $comentarios_ubicacion);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if (isset($p["saldo_user_aplicado"])) {
            $ca->prepareUpdate("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
            $ca->bindValue(":usuario", $usuario_cliente);
            $ca->bindValue(":saldo", $p["saldo_user"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":perfil", "1");
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
        if ($p["usuario"] !== null) {
            $res = 0;
            $ca->prepareSelect("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":perfil", "2");
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $s = $ca->flush();
            $saldo = $s["saldo"];
            $val = 0;
            if ($p["tipo_pago"] == "efectivo") {
                $val = $p["utilidad_interna"];
                if (floatval($saldo) < 0) {
                    $saldo = floatval($saldo) * (-1);
                    $tes = floatval($saldo) + floatval($val);
                    $res = "-" . $tes;
                    if (floatval($descuento_aplicado) > 0) {
                        $res = floatval($tes) - floatval($descuento_aplicado);
                        if (floatval($res) < 0) {
                            $res = floatval($res) * (-1);
                        } else {
                            $res = "-" . $res;
                        }
                    }
                } else {
                    $vals = floatval($saldo) - floatval($val);
                    if (floatval($descuento_aplicado) > 0) {
                        $res = floatval($vals) + floatval($descuento_aplicado);
                    } else {
                        $res = floatval($vals);
                    }
                }
            } else {
                $val = $p["utilidad_conductor"];
                if ($saldo < 0) {
                    $saldo = floatval($saldo) * (-1);
                    $res = floatval($saldo) - floatval($val);
                    if ($res < 0) {
                        $res = floatval($res) * (-1);
                    } else {
                        $res = "-" . $res;
                    }
                } else {
                    $res = floatval($saldo) + floatval($val);
                }
            }
            $ca->prepareUpdate("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":saldo", $res);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":perfil", "2");
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
//        if (isset($p["cupon_nombre"]) && floatval($descuento_aplicado) > 0 && isset($p["tipo_descuento"]) && $p["tipo_descuento"] == "valor" || isset($p["quemar_cupon"]) && $p["quemar_cupon"] == "SI") {
//            $estado = "";
//            $valor_cupon = floatval($p["cupon_valor"]) - floatval($descuento_aplicado);
//            if ($valor_cupon <= 0 || isset($p["quemar_cupon"]) && $p["quemar_cupon"] == "SI") {
//                $estado = ",estado";
//            }
//            $ca->prepareUpdate("edo_cupones_redimidos", "valor" . $estado, "empresa=:empresa and usuario=:usuario and perfil=:perfil and cupon = :cupon");
//            $ca->bindValue(":valor", $valor_cupon);
//            $ca->bindValue(":empresa", $p["empresa"]);
//            $ca->bindValue(":cupon", $p["cupon_nombre"]);
//            $ca->bindValue(":usuario", $usuario_cliente);
//            $ca->bindValue(":perfil", "1");
//            if (isset($p["quemar_cupon"]) && $p["quemar_cupon"] == "SI") {
//                $ca->bindValue(":estado", "QUEMADO");
//            }
//            if ($valor_cupon <= 0) {
//                $ca->bindValue(":estado", "SIN SALDO");
//            }
//            if (!$ca->exec()) {
//                $db->rollback();
//                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//            }
//        }
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["enviar_mail_final_driver"]) && $p["configCliente"]["enviar_mail_final_driver"] == "SI") {
                self::sendEmailServicioDestiono($p["serv"], $p);
            }
        }

        $x = self::actualizaOcupadoDriver($p, $db, "NO");

        $li = Array();
        $li["modulo"] = "app_driver:::finaliza_servicio";
        $li["accion"] = "Cambio de estado LLEGADA_DESTINO.";
        $li["comentarios"] = "Hora dispositivo: {$hora} - Fecha dispositivo: {$hoy} Paradas /pasajeros: {$p["paradas_adicional_numero_total"]}";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        $li["fecha"] = $hoy;
        $li["latitud"] = $p["latitudFinalizaServicio"];
        $li["longitud"] = $p["longitudFinalizaServicio"];
        $li["all_data"] = $p;
        lineTime::save($li);

        if (isset($p["files"])) {
            $add = Array();
            $add["estado"] = "LLEGADA_DESTINO";
            $add["comentarios"] = "Hora dispositivo: {$hora} - Fecha dispositivo: {$hoy} Paradas /pasajeros: {$p["paradas_adicional_numero_total"]}";
            $add["files"] = $p["files"];
            $add["id_servicio"] = $p["id"];
            $add["usuario"] = $p["usuario"];
            $add["empresa"] = $p["empresa"];
            $add["fecha"] = $hoy;
            $add["perfil"] = 2;
            $add["latitud"] = $p["latitudFinalizaServicio"];
            $add["longitud"] = $p["longitudFinalizaServicio"];
            addPhotos::save($add);
        }

        $book = booking::updateStatusTravel($p["dataService"]);

//        $db->commit();
        if ($x !== true) {
            return $x;
        }
        return true;
    }

    public static function saveUtilidadReferidos($data) {
        $p = nwMaker::getData($data);

//        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
//        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
//        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (count($p["referidos_viaje"]) > 0) {
            $count = 0;
            foreach ($p["referidos_viaje"] as $r) {
                $count++;
                $ca->prepareSelect("pv_clientes", "saldo,usuario_cliente", "id=:id and empresa=:empresa and perfil=:perfil");
                $ca->bindValue(":id", $r["id_ref"]);
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":perfil", $r["perf"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                }
                $s = $ca->flush();
                $saldo = $s["saldo"];
                $aplicar_bono = 0;
                if ($count == count($p["referidos_viaje"]) && isset($p["bono_referido"]) && intval($p["bono_referido"]) > 0) {
                    $ca->prepareSelect("edo_movimientos_referidos", "id", "usuario_referido=:usuario_referido and empresa=:empresa and perfil_usuario_referido=:perfil_usuario_referido ");
                    $ca->bindValue(":usuario_referido", $r["usuario_referido"]);
                    $ca->bindValue(":empresa", $p["empresa"]);
                    $ca->bindValue(":perfil_usuario_referido", $r["perfil_usuario_referido"]);
                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                    }
                    if ($ca->size() === 0) {
                        $aplicar_bono = intval($p["bono_referido"]);
                    }
                }

                if (floatval($saldo) < 0) {
                    $saldo = floatval($saldo) * (-1);
                    $tes = floatval($saldo) - floatval($p["valor_referido"]) - $aplicar_bono;
                    if ($tes < 0) {
                        $saldo = floatval($tes) * (-1);
                    } else {
                        $saldo = "-" . $tes;
                    }
                } else {
                    $saldo = floatval($saldo) + floatval($p["valor_referido"]) + $aplicar_bono;
                }

                $ca->prepareUpdate("pv_clientes", "saldo", "id=:id and empresa=:empresa and perfil=:perfil");
                $ca->bindValue(":id", $r["id_ref"]);
                $ca->bindValue(":saldo", $saldo);
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":perfil", $r["perf"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                }

                $ca->prepareInsert("edo_movimientos_referidos", "id_servicio,id_ref,utilidad_interna_neto,utilidad_referido,porcentaje_referidos,numero_referidos,hora,fecha,perfil,usuario_referido,nivel,saldo,nuevo_saldo,empresa,bono_primer_viaje,perfil_usuario_referido");
                $ca->bindValue(":id_servicio", $p["id"]);
                $ca->bindValue(":id_ref", $r["id_ref"]);
                $ca->bindValue(":utilidad_interna_neto", $p["utilidad_interna_neto"]);
                $ca->bindValue(":utilidad_referido", $p["valor_referido"], true, true);
                $ca->bindValue(":porcentaje_referidos", $p["porcentaje_referidos"]);
                $ca->bindValue(":numero_referidos", $p["numero_referidos"], true, true);
                $ca->bindValue(":perfil", $r["perf"]);
                $ca->bindValue(":nivel", $r["nivel"]);
                $ca->bindValue(":saldo", $s["saldo"]);
                $ca->bindValue(":nuevo_saldo", $saldo);
                $ca->bindValue(":bono_primer_viaje", $aplicar_bono);
                $ca->bindValue(":perfil_usuario_referido", $r["perfil_usuario_referido"]);
                $ca->bindValue(":usuario_referido", $r["usuario_referido"]);
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":hora", date("H:i:s"));
                $ca->bindValue(":fecha", date("Y-m-d"));
                if (!$ca->exec()) {
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                }
            }
        }
    }

    public static function saveDetalleServicio($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios", "*", " id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $serv = $ca->flush();
        $ca->prepareUpdate("edo_servicios", "iva,subcategoria_conductor_servicio,subcategoria_conductor_servicio_text,"
                . "recargos,valor_servicio,recargos_valor,esperas,valor_total_servicio,calificacion,comentarios_conductor,hora_fin_detalle_servicio", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":subcategoria_conductor_servicio", $p["subcategoria_servicio"]);
        $ca->bindValue(":subcategoria_conductor_servicio_text", $p["subcategoria_servicio_text"]);
        $ca->bindValue(":recargos", $p["recargos"] == "" ? 0 : $p["recargos"]);
        $ca->bindValue(":valor_servicio", $p["valor_servicio"]);
        $ca->bindValue(":iva", $p["iva"]);
        $ca->bindValue(":recargos_valor", $p["recargos_valor"] == "" ? 0 : $p["recargos_valor"]);
        $ca->bindValue(":esperas", $p["esperas"] == "" ? 0 : $p["esperas"]);
        $ca->bindValue(":valor_total_servicio", $p["valor_total_servicio"]);
        $ca->bindValue(":calificacion", $p["calificacion"] == "" ? 0 : $p["calificacion"]);
        $ca->bindValue(":comentarios_conductor", $p["comentarios_conductor"]);
        $ca->bindValue(":hora_fin_detalle_servicio", $hora);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $id = $p["id"];
        $mensaje = "Hemos llegado, Aqui esta el detalle del servicio";
        $a = Array();
        $a["destinatario"] = $serv["usuario"];
        $a["body"] = $mensaje;
        $a["modo_window"] = "popup";
        $a["sendEmail"] = false;
        $a["titleMensaje"] = "Servicio Finalizado";
        $a["callback"] = "openDetalleUsuario($id);";
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        nwMaker::notificacionNwMaker($a);

        return true;
    }

    public static function consultaSolit($data) {
        $p = nwMaker::getData($data);
        $id = $p;
        if (isset($p["id"])) {
            $id = $p["id"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios", "*", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consulta_historico_viajes($data) {

        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 and (usuario=:usuario or conductor_id=:id_usuario) and empresa=:empresa ";
        if ($p["estado"] === "ACTIVOS") {
            $where .= " and estado='EN_RUTA' ";
        } else
        if ($p["estado"] === "PASADOS") {
            $where .= " and (estado='CANCELADO_POR_USUARIO' or  estado='LLEGADA_DESTINO') ";
        }
        if ($p["estado"] === "RESERVADO") {
            $where .= " and tipo_servicio='reservado' and estado='ASIGNADO' ";
        }
        $where .= " order by id desc";
        $ca->prepareSelect("edo_servicios", "*,CONCAT(fecha, ' ', hora) as fecha_hora", $where);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
//         print_r($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consulta_new($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = null;
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        }
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $timeRest = "1440";
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["minutos_de_vida_notificacion_conductores_viajes_ahora"]) && nwMaker::evalueData($p["configCliente"]["minutos_de_vida_notificacion_conductores_viajes_ahora"])) {
                $timeRest = $p["configCliente"]["minutos_de_vida_notificacion_conductores_viajes_ahora"];
            }
        }
//        $fecha_hora = nwMaker::sumaRestaFechasByFecha("-24 hour", "+0 minute", "+0 second", $hoy);
        $fecha_hora = nwMaker::sumaRestaFechasByFecha("+0 hour", "-{$timeRest} minute", "+0 second", $hoy);
//        $fecha_one = null;
//        $fecha_limit = null;
//        $fecha_one = nwMaker::sumaRestaFechasByFecha("+0 hour", "-15 minute", "+0 second", $hoy);
//        $fecha_limit = nwMaker::sumaRestaFechasByFecha("+0 hour", "+0 minute", "-300 second", $hoy);

        $whereServices = "";

        $where = " empresa=:empresa ";
        $where .= " and (estado='SOLICITUD' or estado='CONDUCTOR_ASIGNADO' or estado='CONDUCTOR_REASIGNADO') ";
//        $where .= " and CONCAT(fecha, ' ', hora) >=:fecha_hora ";
        $where .= " and (CONCAT(fecha, ' ', hora) >=:fecha_hora and tipo_servicio='ahora' or tipo_servicio='reservado' or tipo_servicio='' or tipo_servicio IS NULL ) ";
        if (isset($p["servicios_driver_ids"]) && $p["servicios_driver_ids"] != "") {
//            $servicesDriver = $p["servicios_driver_ids"];
            $servicesDriver = json_encode($p["servicios_driver_ids"]);
            $servicesDriver = str_replace("[", "", $servicesDriver);
            $servicesDriver = str_replace("]", "", $servicesDriver);
//            $where .= " and subcategoria_servicio IN ({$servicesDriver})";
            $whereServices = "  and subcategoria_servicio IN ({$servicesDriver}) ";
        }
//        if (!isset($p["repetir_servicio_continiuamente"])) {
//            $fecha_one = nwMaker::sumaRestaFechasByFecha("+0 hour", "-15 minute", "+0 second", $hoy);
//            $fecha_limit = nwMaker::sumaRestaFechasByFecha("+0 hour", "+0 minute", "-300 second", $hoy);
//            $ca->bindValue(":fecha", $fecha_one);
//            $ca->bindValue(":fecha_limit", $fecha_limit);
//
//            $where .= " and ( ";
//            $where .= " tipo_servicio='ahora' and CONCAT(fecha, ' ', hora) >=:fecha ";
//            $where .= " or tipo_servicio='reservado' and CONCAT(fecha, ' ', hora) >=:fecha ";
//            $where .= " or tipo_servicio='reservado' and conductor_usuario=:usuario and fecha_conductor IS NULL and fecha_asignacion_para_conductor IS NOT NULL ";
//            $where .= " or fecha_asignacion_para_conductor IS NOT NULL and fecha_asignacion_para_conductor>=:fecha ";
//            $where .= "  or conductor_usuario=:usuario and fecha_asignacion_para_conductor>=:fecha_limit ";
//            $where .= " )";
//        }
        $tomaaleatorio = true;
        if (isset($p["tomarServiciosReservadosAutomatic"]) && $p["tomarServiciosReservadosAutomatic"] == "SI") {
            $tomaaleatorio = false;
        }
        if ($tomaaleatorio) {
            $tiposerv = "";
            if (isset($p["verServiciosReservados"]) && $p["verServiciosReservados"] == "NO") {
                $tiposerv = " and tipo_servicio!='reservado' ";
            }
            $where .= " and (conductor_usuario='' {$tiposerv} {$whereServices} or conductor_usuario is null {$tiposerv} {$whereServices} or conductor_usuario=:usuario) ";
        } else {
            $where .= " and (conductor_usuario=:usuario)";
        }
//        if (isset($p["id_rechazados"]) && $p["id_rechazados"] !== "") {
//            $where .= " and id NOT IN ({$p["id_rechazados"]})";
//        }
        $where .= " and (drivers_rechazan IS NULL or INSTR(drivers_rechazan , :usuario) <= 0)";
//        $where .= "   order by tipo_servicio,RAND() limit 4";
        $where .= "   order by fecha desc,hora desc limit 5";
        $ca->prepareSelect("edo_servicios", "*,CONCAT(fecha, ' ', hora) as fecha_hora", $where);
        $ca->bindValue(":fecha_hora", $fecha_hora);
//        $ca->bindValue(":fecha_limit", $fecha_limit);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $usuario);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function datosVehiculos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " empresa=:empresa ";
//        $where .= " and (id_usuario=:id_usuario or usuario_usando=:usuario or :id_usuario IN (id_otros_conductores) )";
        $where .= " and (id_usuario=:id_usuario or usuario_usando=:usuario or  id_otros_conductores LIKE concat('%{',:id_usuario,'}%') )";
//        $where .= " and (id_usuario=:id_usuario or usuario_usando=:usuario or id_otros_conductores LIKE '%{" . $p["usuario"] . "}%' ) )";
//        $where .= " and usuario_usando=:usuario";
        $where .= " order by id desc";
        $ca->prepareSelect("edo_vehiculos", "*", $where);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $veh = $ca->assocAll();
        for ($i = 0; $i < count($veh); $i++) {
            $ra = $veh[$i];
            if ($ra["usuario_usando"] == $p["usuario"]) {
                return $ra;
            }
        }
        return true;
    }

    public static function populateTokenMarcaBuscarApp($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        $search = "";
        if (isset($p["token"])) {
            $search = master::clean($p["token"]);
        }
        if ($search != "") {
            $campos = "nombre";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $search, true);
        }
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_marca_vehiculos", "id,nombre,nombre as Marca", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenMarcaV($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        if ($p["marca"] != "") {
//            $where .= " and (lower(nombre) like lower('%{$p["marca"]}%'))";
            $campos = "nombre";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["marca"], true);
        }
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_marca_vehiculos", "id,nombre,nombre as Marca", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function readMessage($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_salas_soporte", "ultimo_mensaje,leido", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":leido", 0);
        $ca->bindValue(":ultimo_mensaje", $p["ultimo_mensaje"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function datosConductor($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $empresa = null;
        $where = "usuario_cliente=:usuario and estado_activacion=1 and perfil=2";
        if (isset($p["empresa"])) {
            $where .= " and empresa=:empresa";
            $empresa = $p["empresa"];
        }
        $ca->prepareSelect("pv_clientes", "*", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $r["usuario"] = $r["usuario_cliente"];
        return $r;
    }

    public static function datosServicios($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $empresa = null;
        $where = "usuario_cliente=:usuario and servicios_activos!='[]' and estado_activacion=1 and perfil=2";
        if (isset($p["empresa"])) {
            $where .= " and empresa=:empresa";
            $empresa = $p["empresa"];
        }
        $ca->prepareSelect("pv_clientes", "*", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $r["usuario"] = $r["usuario_cliente"];
        return $r;
    }

    public static function consulta($data) {
        $p = nwMaker::getData($data);
//        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $si = session::info();
        $where = " reservado_text=:reservado_text  order by id desc";
        $ca->prepareSelect("edo_servicios", "*,CONCAT(fecha, ' ', hora) as fecha_hora", $where);
        $ca->bindValue(":reservado_text", $p["tipo"] == "ahora" ? "NO" : "SI");
        $ca->bindValue(":estado", "SOLICITUD");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $servicios = Array();
        $servicios["list"] = $ca->assocAll();
        $where = " reservado_text=:reservado_text order by id desc";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":reservado_text", $p["tipo"] == "ahora" ? "SI" : "NO");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $servicios["label"] = count($ca->assocAll());
        return $servicios;
    }

    public static function estadoServicio($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " id=:id";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function servicioActivoConductor($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $fecha_hora = nwMaker::sumaRestaFechasByFecha("-2 hour", "+0 minute", "+0 second", $hoy);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa and conductor_id=:conductor_id ";
        $where .= " and (estado='EN_RUTA' ";
        $where .= " or estado='ABORDO' ";
        $where .= " or estado='EN_SITIO' ";
        $where .= " or (estado='CANCELADO_POR_USUARIO' and calificacion_cliente IS NULL and CONCAT(fecha, ' ', hora) >=:fecha_hora) ";
        $where .= " ) ";
        $where .= " order by id desc limit 1";
        $fields = "*";
        $ca->prepareSelect("edo_servicios", $fields, $where);
        $ca->bindValue(":conductor_id", $p["id_usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha_hora", $fecha_hora);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function conductorActivo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "estado_activacion", "usuario_cliente=:usuario and estado_activacion=1");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
//       
        return $ca->flush();
    }

    public static function consultaDetalleServicio($data) {
        $p = nwMaker::getData($data);
//        session::check();
//        print_r($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $si = session::info();
        $where = " id=:id";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consultaPasajero($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " id=:id and estado='INICIA_SERVICIO'";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return true;
    }

    public static function saveRecorrido($data) {
        $p = nwMaker::getData($data);
//        if (!nwMaker::evalueData($p["id_servicio"])) {
//            return false;
//        }
        if (!isset($p["latitud"]) || !isset($p["longitud"])) {
            error_log("No existe latitud y/o longitud en servicios_conductor::saveRecorrido::: user: {$p["usuario"]} empresa: {$p["empresa"]} " . json_encode($p));
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $speed = 0;
        if (isset($p["speed"])) {
            $speed = $p["speed"];
        }
        $placa = null;
        if (isset($p["placa"])) {
            $placa = $p["placa"];
        }
        if (isset($p["id_servicio"])) {
            $fields = "hora,fecha,latitud,longitud,usuario,usuario_text,latitudEnd,longitudEnd,metros,id_servicio,tipo,speed,placa";
            $ca->prepareInsert("edo_posicion_users", $fields);
            $ca->bindValue(":hora", $hora);
            $ca->bindValue(":fecha", $fecha);
            $ca->bindValue(":latitud", $p["latitud"], true, true);
            $ca->bindValue(":longitud", $p["longitud"], true, true);
            $ca->bindValue(":latitudEnd", $p["latitudEnd"], true, true);
            $ca->bindValue(":longitudEnd", $p["longitudEnd"], true, true);
            $ca->bindValue(":usuario", $p["id_usuario"]);
            $ca->bindValue(":usuario_text", $p["usuario"]);
            $ca->bindValue(":metros", $p["metros"], true, true);
            $ca->bindValue(":id_servicio", $p["id_servicio"]);
            $ca->bindValue(":tipo", $p["tipo"]);
            $ca->bindValue(":speed", $speed);
            $ca->bindValue(":placa", $placa);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $ca->prepareUpdate("edo_servicios", "latitud_actual,longitud_actual", "id=:id");
            $ca->bindValue(":id", $p["id_servicio"]);
            $ca->bindValue(":latitud_actual", $p["latitud"], true, true);
            $ca->bindValue(":longitud_actual", $p["longitud"], true, true);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
        if ($placa != null) {
            $f = "latitud,longitud,geoloc_fecha,geoloc_last_user";
            $last_service_id = null;
            if (isset($p["id_servicio"])) {
                $f .= ",last_service_id";
                $last_service_id = $p["id_servicio"];
            }
            $ca->prepareUpdate("edo_vehiculos", $f, "empresa=:empresa and placa=:placa");
            $ca->bindValue(":geoloc_fecha", $fecha . " " . $hora);
            $ca->bindValue(":latitud", $p["latitud"], true, true);
            $ca->bindValue(":longitud", $p["longitud"], true, true);
            $ca->bindValue(":placa", $placa);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":last_service_id", $last_service_id);
            $ca->bindValue(":geoloc_last_user", $p["usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
        return true;
    }

    public static function tiempoServicio($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "tiempo_estimado", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":tiempo_estimado", $p["tiempo"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function actualizaOcupadoDriver($p, &$db, $ocupado = "NO") {
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("pv_clientes", "ocupado", "usuario_cliente=:usuario and empresa=:empresa and perfil=2");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":ocupado", $ocupado);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $li = Array();
        $li["modulo"] = "app_driver:::actualizaOcupadoDriver";
        $li["accion"] = "Conductor actualiza estado.";
        $li["comentarios"] = "Ocupado {$ocupado}. Conductor {$p["usuario"]}.";
        if (isset($p["id"])) {
            $li["id_servicio"] = $p["id"];
        }
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function validaFechaVencimientoDriver($p, $ca) {

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $ca->prepareSelect("pv_clientes", "fecha_vencimiento_saldo", " id=:id_usuario and fecha_vencimiento_saldo>=:hoy");
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        $ca->bindValue(":hoy", $hoy);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return true;
    }

    public static function getStatusService($p, $ca) {
        $ca->prepareSelect("edo_servicios", "estado", " id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $serv = $ca->flush();
        if (isset($p["estado_inicial"])) {
            if ($p["estado_inicial"] === "ACEPTADO_RESERVA" && $serv["estado"] === "ACEPTADO_RESERVA") {
                return true;
            }
        }
        if ($serv["estado"] !== "SOLICITUD" && $serv["estado"] !== "CONDUCTOR_REASIGNADO" && $serv["estado"] !== "CONDUCTOR_ASIGNADO") {
            return false;
        }
        return true;
    }

    public static function acceptSolit($data) {
        $p = nwMaker::getData($data);
        $serv = Array();
        if (isset($p["dataAll"])) {
            $serv = $p["dataAll"];
        }
//        return self::procesaCupon($p);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $nombre = "";
        $id_usuario = "";
        if (isset($p["id_usuario"])) {
            $id_usuario = $p["id_usuario"];
            $nombre = $p["nombre"];
            if (isset($p["apellido"]) && nwMaker::evalueData($p["apellido"])) {
                $nombre .= " " . $p["apellido"];
            }
        } else {
            session::check();
            $si = session::info();
            $id_usuario = $si["id_usuario"];
            $nombre = $si["nombre"] . " " . $si["apellido"];
        }
        $usaFechaVencimientoSaldo = false;
        if (isset($p["usaFechaVencimientoSaldo"]) && $p["usaFechaVencimientoSaldo"] === "SI") {
            $usaFechaVencimientoSaldo = true;
        }
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
//        if (!self::getStatusService($p, $ca)) {
//            return false;
//        }
        if ($usaFechaVencimientoSaldo) {
            if (!self::validaFechaVencimientoDriver($p, $ca)) {
                return "Lo sentimos, no cuenta con saldo vigente, favor recargue su saldo.";
            }
        }
        $foto = "";
        $celular = "";
        $color = "";
        $bodega = "";
        $bodega_text = "";
        $pathDriverToOrigin = null;
        $fields = "conductor_id,hora_acepta_servicio,latitudAceptaService,longitudAceptaService,conductor,fecha_conductor,"
                . "estado,conductor_usuario,token_conductor";
        $fields .= ",pathDriverToOrigin";
        $traeflota = false;
        if (isset($p["bodega"])) {
            if (nwMaker::evalueData($p["bodega"])) {
                if (!isset($serv["flota_id"])) {
                    $traeflota = true;
                } else {
                    if (!nwMaker::evalueData($serv["flota_id"])) {
                        $traeflota = true;
                    } else {
                        $traeflota = false;
                    }
                }
            }
        }
        if ($traeflota) {
            $fields .= ",bodega_conductor,flota_id,flota_text";
            $bodega = $p["bodega"];
            if (isset($p["bodega_text"])) {
                if (nwMaker::evalueData($p["bodega_text"])) {
                    $bodega_text = $p["bodega_text"];
                }
            }
        }
        if (isset($p["foto"])) {
            $fields .= ",conductor_foto";
            $foto = $p["foto"];
        }
        if (isset($p["celular"])) {
            $fields .= ",conductor_celular";
            $celular = $p["celular"];
        }
        if (isset($p["pathDriverToOrigin"])) {
            $pathDriverToOrigin = $p["pathDriverToOrigin"];
        }
        $estado = "EN_RUTA";
        if (isset($p["estado"])) {
            $estado = $p["estado"];
        }
        if (isset($p["color"]) && nwMaker::evalueData($p["color"])) {
            $fields .= ",vehiculo_color";
            $color = $p["color"];
        }
        $vehiculo = "";
        if (isset($p["vehiculo"]) && nwMaker::evalueData($p["vehiculo"])) {
            $fields .= ",vehiculo";
            $vehiculo = $p["vehiculo"];
        }
        $vehiculo_text = "";
        if (isset($p["vehiculo_text"]) && nwMaker::evalueData($p["vehiculo_text"])) {
            $fields .= ",vehiculo_text";
            $vehiculo_text = $p["vehiculo_text"];
        }
        $placa = null;
        if (isset($p["placa"]) && nwMaker::evalueData($p["placa"])) {
            $placa = $p["placa"];
            $fields .= ",placa";
        }
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":conductor_id", $id_usuario, true, true);
        $ca->bindValue(":conductor", $nombre);
        $ca->bindValue(":conductor_foto", $foto);
        $ca->bindValue(":conductor_celular", $celular);
        $ca->bindValue(":vehiculo_color", $color);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":conductor_usuario", $p["conductor_usuario"]);
        $ca->bindValue(":token_conductor", $p["token_conductor"]);
        $ca->bindValue(":placa", $placa);
        $ca->bindValue(":vehiculo_text", $vehiculo_text);
        $ca->bindValue(":vehiculo", $vehiculo);
        $ca->bindValue(":fecha_conductor", $hoy);
        $ca->bindValue(":hora_acepta_servicio", $hora);
        $ca->bindValue(":latitudAceptaService", $p["latitudAceptaService"]);
        $ca->bindValue(":longitudAceptaService", $p["longitudAceptaService"]);
        $ca->bindValue(":pathDriverToOrigin", $pathDriverToOrigin);
        $ca->bindValue(":bodega_conductor", $bodega);
        $ca->bindValue(":flota_id", $bodega);
        $ca->bindValue(":flota_text", $bodega_text);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $li = Array();
        $li["modulo"] = "app_driver:::Acepta notificación::: Cambio de estado {$estado}";
        $li["accion"] = "Conductor acepta notificación";
        $li["comentarios"] = "Conductor {$p["conductor_usuario"]}.";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        $li["latitud"] = $p["latitudAceptaService"];
        $li["longitud"] = $p["longitudAceptaService"];
        $li["fecha"] = $hoy;
        $li["all_data"] = $p;
        lineTime::save($li);

        if ($estado == "EN_RUTA") {
            $li = Array();
            $li["modulo"] = "app_driver:::En camino a punto de partida";
            $li["accion"] = "Cambio de estado {$estado}.";
            $li["comentarios"] = "Conductor {$p["conductor_usuario"]}.";
            $li["id_servicio"] = $p["id"];
            $li["usuario"] = $p["usuario"];
            $li["empresa"] = $p["empresa"];
            $li["perfil"] = 2;
            $li["latitud"] = $p["latitudAceptaService"];
            $li["longitud"] = $p["longitudAceptaService"];
            $li["fecha"] = $hoy;
            $li["all_data"] = $p;
            lineTime::save($li);
        }

        if ($estado !== "SOLICITUD" && $estado !== "ACEPTADO_RESERVA") {
            $x = self::actualizaOcupadoDriver($p, $db, "SI");
            $db->commit();
            if ($x !== true) {
//                print_r($x);
                return $x;
            }
        } else {
//            self::sendEmailProccess($p, "RESERVA");
            self::sendEmailProccess($p, "ACEPTACIÓN RESERVA");
        }

        $book = booking::updateStatusTravel($p["dataService"]);

        self::procesaCupon($p);

        $db->commit();
        return true;
    }

    public static function procesaCupon($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios", "id,datos_cupon,descuento_aplicado", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $r = $ca->flush();
        if (nwMaker::evalueData($r["datos_cupon"])) {
            $cupon = json_decode($r["datos_cupon"], true);

            $ca->prepareSelect("edo_cupones_redimidos", "id,valor,tipo,id_viajes", "id=:id and id_viajes NOT LIKE '%{" . $p["id"] . "}%' ");
            $ca->bindValue(":id", $cupon["id"]);
            if (!$ca->exec()) {
                $db->rollback();
                return ("Error: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $h = $ca->flush();
                $id_viajes = $h["id_viajes"];
                if (!nwMaker::evalueData($id_viajes)) {
                    $id_viajes = "{" . $r["id"] . "}";
                } else {
                    $id_viajes = $id_viajes . "{" . $r["id"] . "}";
                }

                $nuevoValor = 0;
                if ($h["tipo"] == "valor") {
                    $nuevoValor = $h["valor"] - $r["descuento_aplicado"];
                }
                if ($nuevoValor < 0) {
                    $nuevoValor = 0;
                }

                $ca->prepareUpdate("edo_cupones_redimidos", "valor,id_viajes", "id=:id");
                $ca->bindValue(":id", $h["id"]);
                $ca->bindValue(":valor", $nuevoValor);
                $ca->bindValue(":id_viajes", $id_viajes);
                if (!$ca->exec()) {
                    $db->rollback();
                    return nwMaker::error($ca->lastErrorText());
                }
//                $db->commit();
                return true;
            }
        }
    }

    public static function sendEmailNotAttended($data) {
        $p = nwMaker::getData($data);
        return self::sendEmailProccess($p, "SERVICIO NO ATENDIDO");
    }

    public static function sendEmailProccess($data, $type) {
        $p = $data;
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_plantillas_correos", "*", "empresa=:empresa and tipo=:tipo");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":tipo", $type);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $plantilla = $ca->flush();

        if (empty($plantilla)) {
            return true;
//            NWJSonRpcServer::information("No tiene plantilla configurada");
        }
        $ca->prepareSelect("empresas", "logo", "id=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $empresa = $ca->flush();

        if ($type == "ACEPTACIÓN RESERVA") {
            $ca->prepareSelect("edo_vehiculos v inner join pv_clientes c on (v.id_usuario=c.id) ", " * ", "c.empresa=:empresa and c.id=:id_usuario");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":id_usuario", $p["id_usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $dat = $ca->flush();

            $ca->prepareSelect("edo_servicios", " * ", "id=:id");
            $ca->bindValue(":id", $p["id"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $serv = $ca->flush();
        }
        if ($type == "CANCELAR SERVICIO" || $type == "SERVICIO NO ATENDIDO" || $type == "RESERVA" && isset($p["id"])) {
            $num_servicio = $p["id"];
        }
        $host = "";
        if (isset($dat["nombre"])) {
            $nombre = $dat["nombre"] . " " . $dat["apellido"];
        } else if (isset($p["nombre"])) {
            $nombre = $p["nombre"] . " " . $p["apellido"];
        }if (isset($dat["documento"])) {
            $documento = $dat["documento"];
        } else if (isset($p["nit"])) {
            $documento = $p["nit"];
        }if (isset($dat["email"])) {
            $email = $dat["email"];
        } else if (isset($p["email"])) {
            $email = $p["email"];
        }if (isset($dat["celular"])) {
            $celular = $dat["celular"];
        } else if (isset($p["celular"])) {
            $celular = $p["celular"];
        }if (isset($p["domain_rpc"])) {
            $host = $p["domain_rpc"];
        }if (isset($dat["foto"])) {
            $foto_cond = $host . $dat["foto"];
        } else if (isset($p["foto_perfil"])) {
            $foto_cond = $host . $p["foto_perfil"];
        }if (isset($dat["imagen_vehi"])) {
            $foto_vehi = $host . $dat["imagen_vehi"];
        }if (isset($p["address"])) {
            $origen = $p["address"];
        } else if (isset($p["origen"])) {
            $origen = $p["origen"];
        }if (isset($p["address"])) {
            $destino = $p["address_destino"];
        } else if (isset($p["destino"])) {
            $destino = $p["destino"];
        }if (isset($p["subcategoria_servicio_text"])) {
            $servicio = $p["subcategoria_servicio_text"];
        }if (isset($p["subservicio"]["nombre"])) {
            $subservicio = $p["subservicio"]["nombre"];
        } else if (isset($p["subservicio_text"])) {
            $subservicio = $p["subservicio_text"];
        }

        $host .= $empresa["logo"];
        if (isset($serv["fecha"])) {
            $fecha_reserva = $serv["fecha"] . " " . $serv["hora"];
        } else if (isset($p["fecha"])) {
            $fecha_reserva = $p["fecha"];
        }

        $mensaje = $plantilla["cuerpo_mensaje"];

        $mensaje = str_replace("{logo}", $host, $mensaje);
        if (isset($fecha_reserva)) {
            $mensaje = str_replace("{fecha_reserva}", $fecha_reserva, $mensaje);
        } if (isset($foto_cond)) {
            $mensaje = str_replace("{foto_cond}", $foto_cond, $mensaje);
        }if (isset($nombre)) {
            $mensaje = str_replace("{nombre}", $nombre, $mensaje);
        } if (isset($documento)) {
            $mensaje = str_replace("{documento}", $documento, $mensaje);
        }if (isset($email)) {
            $mensaje = str_replace("{email}", $email, $mensaje);
        }if (isset($celular)) {
            $mensaje = str_replace("{celular}", $celular, $mensaje);
        }if (isset($foto_vehi)) {
            $mensaje = str_replace("{foto_vehi}", $foto_vehi, $mensaje);
        }if (isset($dat["tipo_vehiculo_text"])) {
            $mensaje = str_replace("{tipo_vehiculo}", $dat["tipo_vehiculo_text"], $mensaje);
        }if (isset($dat["placa"])) {
            $mensaje = str_replace("{placa}", $dat["placa"], $mensaje);
        }if (isset($dat["marca_text"])) {
            $mensaje = str_replace("{marca}", $dat["marca_text"], $mensaje);
        }if (isset($dat["modelo"])) {
            $mensaje = str_replace("{modelo}", $dat["modelo"], $mensaje);
        }if (isset($dat["color"])) {
            $mensaje = str_replace("{color}", $dat["color"], $mensaje);
        }if (isset($p["no_licencia"])) {
            $mensaje = str_replace("{licencia}", $p["no_licencia"], $mensaje);
        }if (isset($p["fecha_vencimiento"])) {
            $mensaje = str_replace("{fecha_vencimiento}", $p["fecha_vencimiento"], $mensaje);
        }if (isset($p["estado"])) {
            $mensaje = str_replace("{cancelado}", $p["estado"], $mensaje);
        }if (isset($p["cancelado_motivo_text"])) {
            $mensaje = str_replace("{motivo}", $p["cancelado_motivo_text"], $mensaje);
        }if (isset($p["cancelado_notas"])) {
            $mensaje = str_replace("{observaciones}", $p["cancelado_notas"], $mensaje);
        }if (isset($num_servicio)) {
            $mensaje = str_replace("{num_servicio}", $num_servicio, $mensaje);
        }if (isset($p["hora"])) {
            $mensaje = str_replace("{hora}", $p["hora"], $mensaje);
        }if (isset($origen)) {
            $mensaje = str_replace("{origen}", $origen, $mensaje);
        }if (isset($destino)) {
            $mensaje = str_replace("{destino}", $destino, $mensaje);
        }if (isset($servicio)) {
            $mensaje = str_replace("{servicio}", $servicio, $mensaje);
        }if (isset($subservicio)) {
            $mensaje = str_replace("{subservicio}", $subservicio, $mensaje);
        }

//        NWJSonRpcServer::console($mensaje);

        if (isset($p["conductor_usuario"])) {
            $usuario_envia = $p["conductor_usuario"];
        } else if (isset($plantilla["enviado_por_correo"])) {
            $usuario_envia = $plantilla["enviado_por_correo"];
        }if (!empty($plantilla["correo_destino"])) {
            $destinatario = $plantilla["correo_destino"];
        } else {
            $destinatario = $p["usuario"];
        }


        $a = Array();
//        $destinatario = "enderg@gruponw.com";
        $a["empresa"] = $p["empresa"];
        $a["correo_usuario_recibe"] = $destinatario;
        $a["destinatario"] = $destinatario;
        $a["titleMensaje"] = $plantilla["asunto"];
        $a["sms_body"] = "";
        $a["body"] = "";
        $a["body_email"] = $mensaje;
        $a["tipo"] = 'enviarInCron';
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = nwMaker::sumaRestaFechas("+0 hour", "+1 minute", "+0 second");
        $a["tipoAviso"] = "user";
        $a["id_objetivo"] = $p["id"];
        $a["foto"] = $host;
        $a["usuario_envia"] = $usuario_envia;
        $a["sendEmail"] = true;
        $a["sendNotifyPush"] = false;
        $a["celular"] = null;
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["fromName"] = $plantilla["enviado_por_nombre"];
        $a["fromEmail"] = $plantilla["enviado_por_nombre"];
        $a["insertaEnTabla"] = true;
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            return $n;
        }
        return true;
    }

    public static function acceptReserva($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $nombre = "";
        $id_usuario = "";
        if (isset($p["id_usuario"])) {
            $id_usuario = $p["id_usuario"];
            $nombre = $p["nombre"];
        } else {
            session::check();
            $si = session::info();
            $id_usuario = $si["id_usuario"];
            $nombre = $si["nombre"] . " " . $si["apellido"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "placa,vehiculo_text,vehiculo,conductor_id,conductor,fecha_conductor,tiempo_estimado,estado,conductor_usuario,token_conductor", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":conductor_id", $id_usuario, true, true);
        $ca->bindValue(":conductor", $nombre);
        $ca->bindValue(":tiempo_estimado", $p["tiempo_estimado"]);
        $ca->bindValue(":estado", "ASIGNADO");
        $ca->bindValue(":fecha_conductor", $hoy);
        $ca->bindValue(":conductor_usuario", $p["conductor_usuario"]);
        $ca->bindValue(":token_conductor", $p["token_conductor"]);
        $ca->bindValue(":placa", $p["placa"]);
        $ca->bindValue(":vehiculo_text", $p["vehiculo_text"]);
        $ca->bindValue(":vehiculo", $p["vehiculo"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function consultaRecargos($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " id=:tipo";
        $ca->prepareSelect("edo_recargos", "*", $where);
        $ca->bindValue(":tipo", $p["tipo"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function intervalNotificacion($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " id=:id ";
        $ca->prepareSelect("edo_servicios", "estado", $where);
        $ca->bindValue(":id", $p["id_servicio"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function consultaTarifas($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " tipo=:tipo";
        $ca->prepareSelect("edo_precios", "*", $where);
        $ca->bindValue(":tipo", $p["tipo_servicio"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateVehiculo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $id_usuario = false;
        if (isset($si["id_usuario"])) {
            $id_usuario = $si["id_usuario"];
        }
        if (isset($p["id_usuario"])) {
            $id_usuario = $p["id_usuario"];
        }
        $where = " id_usuario=:id_usuario";
        $ca->prepareSelect("edo_vehiculos", "id, CONCAT(marca_text, '-', placa) as nombre", $where);
        $ca->bindValue(":id_usuario", $id_usuario);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consulta_vehiculo($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_vehiculos", "*", "id_usuario=:id_usuario");
        $ca->bindValue(":id_usuario", $si["id_usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function poner_onoffline($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("pv_clientes", "offline,estado_conexion,fecha_ultima_conexion", "usuario_cliente=:usuario and empresa=:empresa and perfil=2");
        $ca->bindValue(":offline", $p["mode"]);
        $ca->bindValue(":estado_conexion", $p["estado_conexion"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha_ultima_conexion", $hoy);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

//quitar
    public static function poner_offline($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " id=:id_usuario";
        $ca->prepareUpdate("pv_clientes", "offline,estado_conexion,fecha_ultima_conexion", $where);
        $ca->bindValue(":offline", "inactivo");
        $ca->bindValue(":estado_conexion", "desconectado");
        $ca->bindValue(":id_usuario", $p["usuario"]);
        $ca->bindValue(":fecha_ultima_conexion", $hoy);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function poner_online($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " id=:id_usuario";
        $ca->prepareUpdate("pv_clientes", "offline,estado_conexion,fecha_ultima_conexion", $where);
        $ca->bindValue(":offline", "activo");
        $ca->bindValue(":estado_conexion", "conectado");
        $ca->bindValue(":id_usuario", $p["usuario"]);
        $ca->bindValue(":fecha_ultima_conexion", $hoy);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

//fin quitar

    public static function save_vehiculo($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "imagen_vehi,tipo_vehiculo_text,placa,marca,marca_text,modelo,color,"
                . "id_usuario,usuario,empresa,numero_puertas,capacidad_pasajeros,soat,foto_soat,"
                . "fecha_vencimiento_soat";
        $id = $p["id"];
        if ($id == "") {
            $ca->prepareInsert("edo_vehiculos", $fields);
        } else {
            $ca->prepareUpdate("edo_vehiculos", $fields, "id=:id");
            $ca->bindValue(":id", $id);
        }
        $ca->bindValue(":imagen_vehi", $p["imagen_vehi"]);
        $ca->bindValue(":tipo_vehiculo_text", $p["tipo_vehiculo_text"]);
        $ca->bindValue(":placa", $p["placa"]);
        $ca->bindValue(":marca_text", $p["marca_text"]);
        $ca->bindValue(":marca", $p["marca"]);
        $ca->bindValue(":modelo", $p["modelo"]);
        $ca->bindValue(":color", $p["color"]);
        $ca->bindValue(":numero_puertas", $p["numero_puertas"]);
        $ca->bindValue(":capacidad_pasajeros", $p["capacidad_pasajeros"]);
        $ca->bindValue(":soat", $p["soat"]);
        $ca->bindValue(":foto_soat", $p["foto_soat"]);
        $ca->bindValue(":fecha_vencimiento_soat", $p["fecha_vencimiento_soat"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":id_usuario", $si["id_usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function cons_recargos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 and empresa=:empresa ";
        $ca->prepareSelect("edo_recargos", "*", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }
}
