<?php

class servicios_admin {

    public static function getTravelsForFirebase($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $total = count($p["ids"]);
        $where = "empresa=:empresa";
        $where .= " and (";
        for ($i = 0; $i < $total; $i++) {
            $id = $p["ids"][$i];
            error_log("FIREBASE_GET_ID: " . $id . " Company: " . $p["empresa"] . " User: " . $p["usuario"]);
            if (nwMaker::evalueData($id)) {
                $where .= " id={$id} ";
                if ($i + 1 != $total) {
                    $where .= " or ";
                }
            }
        }
        $where .= " )";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $res = $ca->assocAll($p);
        for ($i = 0; $i < count($res); $i++) {
            $r = $res[$i];

            $res[$i]["conductores_disponibles"] = Array();
            if (nwMaker::evalueData($r["conductor_usuario"])) {
                $res[$i]["conductores_disponibles"][] = $r["conductor_usuario"];
            }
            $ca->prepareSelect("edo_servicios_conductores_notificados", "drivers", "id_servicio=:id_servicio");
            $ca->bindValue(":id_servicio", $r["id"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $conds = $ca->flush();
                $c = json_decode($conds["drivers"]);
                for ($x = 0; $x < count($c); $x++) {
                    $res[$i]["conductores_disponibles"][] = $c[$x]->usuario_cliente;
                }
            }

            $res[$i]["estado_array"] = Array();
            $res[$i]["estado_array"][] = $r["estado"];

            $res[$i]["subcategoria_servicio_array"] = Array();
            if (isset($r["subcategoria_servicio_array"])) {
                if (nwMaker::evalueData($r["subcategoria_servicio_array"])) {
                    $res[$i]["subcategoria_servicio_array"][] = $r["subcategoria_servicio"];
                }
            }

            $res[$i]["drivers_rechazan_array"] = Array();
            if (nwMaker::evalueData($r["drivers_rechazan"])) {
                $dre = explode(",", $r["drivers_rechazan"]);
                for ($y = 0; $y < count($dre); $y++) {
                    $res[$i]["drivers_rechazan_array"][] = $dre[$y];
                }
            }

            $res[$i]["paradas"] = false;
            $res[$i]["parada_data"] = Array();
            $res[$i]["paradas_total"] = 0;
            $res[$i]["parada_data_users"] = Array();
            if (nwMaker::evalueData($r["usuario"])) {
                $res[$i]["parada_data_users"][] = $r["usuario"];
            }
            $ca->prepareSelect("edo_servicio_parada", "*", "id_servicio=:id_servicio");
            $ca->bindValue(":id_servicio", $r["id"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $res[$i]["paradas"] = true;
                $res[$i]["parada_data"] = $ca->assocAll();
                $res[$i]["paradas_total"] = count($res[$i]["parada_data"]);
                for ($x = 0; $x < $res[$i]["paradas_total"]; $x++) {
                    if (nwMaker::evalueData($res[$i]["parada_data"][$x]["usuario_pasajero"])) {
                        $res[$i]["parada_data_users"][] = $res[$i]["parada_data"][$x]["usuario_pasajero"];
                    }
                }
            }
        }
        return $res;
    }

    public static function getOffersByTravelsForFirebase($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_servicios_ofertas", "*", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->flush($p);
    }

    public static function verFotosViaje($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $tipo = null;
        $id_parada = null;
        $where = "empresa=:empresa and id_servicio=:id_servicio";
        if ($p["filters"]["tipo"] != "") {
            $where .= " and tipo=:tipo";
            $tipo = $p["filters"]["id_servicio"];
        }
        if ($p["filters"]["id_parada"] != "") {
            $where .= " and id_parada=:id_parada";
            $id_parada = $p["filters"]["id_parada"];
        }
        $ca->prepareSelect("edo_fotos_relacionadas", "*,comentarios_usuario as comentarios_user", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id_servicio", $p["filters"]["id_servicio"]);
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":id_parada", $id_parada);
        return $ca->execPage($p);
    }

    public static function enviarMsgPushCorreo($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "email", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil limit 1");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "No existe el usuario";
        }
        $us = $ca->flush();

        $ca->prepareSelect("nwmaker_suscriptorsPush", "DISTINCT json,usuario,perfil", "empresa=:empresa and perfil=:perfil and usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $res = Array();
        $res["tokens"] = $ca->assocAll();

        $a = Array();
        $a["celular"] = null;
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
//        $a["fromName"] = $pl["enviado_desde_nombre"];
//        $a["fromEmail"] = $pl["enviado_desde_correo"];
        $a["correo_usuario_recibe"] = $us["email"];
        $a["destinatario"] = $us["email"];
        $a["titleMensaje"] = $p["asunto"];
        $a["body"] = $p["cuerpo"];
        $a["body_email"] = $p["cuerpo"];
        $a["tipo"] = "emailAndPush";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["insertaEnTabla"] = true;
        $a["fechaAviso"] = date("Y-m-d H:i:s");
        $a["tipoAviso"] = "backend";
        $a["sendEmail"] = true;
        $a["id_objetivo"] = null;
        $a["foto"] = null;
        $a["usuario_envia"] = $si["usuario"];
        $a["sendNotifyPush"] = false;
        $a["terminal"] = $si["terminal"];
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return nwMaker::error($n);
        }
        return $res;
    }

    public static function saveParadasAdicionales($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareUpdate("edo_servicio_parada", "nombre_pasajero,direccion,estado,correo,telefono,usuario_pasajero", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":nombre_pasajero", $p["nombre_pasajero"]);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":correo", $p["correo"]);
        $ca->bindValue(":telefono", $p["telefono"]);
        $ca->bindValue(":usuario_pasajero", $p["usuario_pasajero"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $li = Array();
        $li["modulo"] = "back:::servicios_totales::: informe abordaje, click derecho editar";
        $li["accion"] = "Actualiza pasajero / parada.";
        $li["comentarios"] = "Datos nuevos: {$p["nombre_pasajero"]} {$p["estado"]} {$p["direccion"]}. ";
        $li["id_servicio"] = $p["id_servicio"];
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function consultaCiudades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "1=1 ";
        if (isset($p["pais"])) {
            $where .= " and pais_id=:pais";
            $ca->bindValue(":pais", $p["pais"]);
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("ciudades", "id,nombre", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaPaises($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("paises", "id,nombre", "1=1 order by nombre asc");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaNovedades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "id_viaje=:id_viaje and empresa=:empresa ";
        $ca->prepareSelect("edo_novedades", "*", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":id_viaje", $p["id"], true);
        $ca->bindValue(":empresa", $si["empresa"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function updateEstateSalasChat($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareUpdate("edo_salas_soporte", "estado", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":estado", $p["estado"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function readMessage($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareUpdate("edo_salas_soporte", "leido", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":leido", true);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function consultaSalasChat($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "empresa=:empresa order by id desc";
        $ca->prepareSelect("edo_salas_soporte", "*,'<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Contestar Chat</a></p><br />' as chat,'<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Cerrar Chat</a></p><br />' as cerrar", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":empresa", $si["empresa"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaNotificaNovedades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "empresa=:empresa and perfil=2 and fecha >= :fecha";
        $ca->prepareSelect("edo_novedades", "notificado_back,id_viaje,comentario,id", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":empresa", $si["empresa"], true);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaParadasAdicionales($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "a.empresa=:empresa ";
        if ($p["id"] !== "TODOS") {
            $where .= " and a.id_servicio=:id_servicio ";
        }
        if (isset($p["filters"])) {
            if ($p["id"] === "TODOS" && $p["filters"]["fecha_inicio"] !== "" && $p["filters"]["fecha_final"] !== "") {
                $where .= " and c.fecha between :fecha_inicio and :fecha_final ";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicio"]);
                $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
            }
            if ($p["filters"]["buscar"] != "") {
                $campos = "a.direccion,a.nombre_pasajero,a.documento";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if ($p["filters"]["cliente"] != "" && $p["filters"]["cliente"] != null) {
                $where .= " and d.id=:cliente";
                $ca->bindValue(":cliente", $p["filters"]["cliente"], true);
            }
            if ($p["filters"]["buscar_por_id"] != "") {
                $where = " a.id=:buscar_por_id ";
                $ca->bindValue(":buscar_por_id", $p["filters"]["buscar_por_id"], true);
            }
        }
        $where .= " order by  id_servicio desc";
        $tables = "edo_servicio_parada a ";
        $tables .= " left join edo_tipologia_novedad_paradas b ON(a.novedad=b.id)";
        $tables .= " left join edo_servicios c ON(a.id_servicio=c.id)";
        $tables .= " left join edo_empresas d ON(c.cliente_empresa_id=d.id)";
        $f = "a.*";
        $f .= ",b.nombre as novedad_text";
        $f .= ",c.placa,c.conductor,c.fecha as fecha_servicio,c.hora as hora_servicio,subcategoria_servicio_text,sentido";
        $f .= ",c.estado as estado_servicio";
        $f .= ",c.fecha_finaliza_servicio_driver";
        $f .= ",d.nombre as cliente_empresa_nombre";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect($tables, $f, $where);
        $ca->bindValue(":id_servicio", $p["id"], true);
        $ca->bindValue(":empresa", $si["empresa"], true);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//        }
//        return $ca->assocAll();
        return $ca->execPage($p);
    }

//    public static function consultaReportes($p) {
//        session::check();
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
//        $si = session::info();
//        $ca->prepareSelect("edo_servicios", "stated_travel", "empresa=:empresa and id=:id");
//        $ca->bindValue(":empresa", $si["empresa"]);
//        $ca->bindValue(":id", $p["id"]);
////        NWJSonRpcServer::information($ca->preparedQuery());
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
//            return false;
//        }
//        $res = $ca->flush();
//        return $res;
//    }

    public static function getSaldo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $campo = "";
        if (isset($p["tipo"])) {
            if ($p["tipo"] == "notificacion") {
                return [saldo => "0"];
            }
            if ($p["tipo"] == "correo") {
                $campo = "saldo_correos as saldo,usuario_correos as usuCreden,password_correos as passCreden";
            }
            if ($p["tipo"] == "mensaje_text") {
                $campo = "saldo_sms as saldo,usuario_sms as usuCreden,password_sms as passCreden";
            }
        }
        $ca->prepareSelect("empresas", $campo, "id=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->flush();
    }

    public static function actualizaSaldo($saldo, $campo) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($campo);
        if ($campo == "") {
            return true;
        }
        $ca->prepareUpdate("empresas", $campo, "id=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":" . $campo, $saldo);

        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function populateTokenVehiculosNormal($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa ";
        if ($p["token"] != "") {
            $campos = "placa";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where = str_replace("::text", "", $where);
        $fields = "id,placa as nombre,placa,marca_text as vehiculo_text";
        $fields .= ",usuario,id_usuario,usuario_text";
        $ca->prepareSelect("edo_vehiculos", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenConductores($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa and perfil=2 ";
        if ($p["token"] != "") {
            $campos = "id,nombre,apellido,no_licencia,nit,documento,usuario_cliente,email";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where = str_replace("::text", "", $where);
        $fields = "id,CONCAT(nombre, ' ', apellido) as nombre_completo,no_licencia,fecha_vencimiento,nit,documento,usuario_cliente as usuario_principal,placa_activa";
        $fields .= ",CONCAT(nombre, ' ', apellido) as nombre";
        $ca->prepareSelect("pv_clientes", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function traeVehiculoPorPlaca($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_vehiculos", "id,marca_text,placa", "placa=:placa and empresa=:empresa order by id desc limit 1");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":placa", $p["placa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function populateTokenVehiculos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa ";
        $where .= " and (id_usuario!=:id_usuario or id_usuario IS NULL or id_usuario='') ";
        $where .= " and (id_otros_conductores NOT LIKE '%{:id_usuario}%' or id_otros_conductores IS NULL or id_otros_conductores='') ";
        if ($p["token"] != "") {
            $campos = "placa";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where = str_replace("::text", "", $where);
        $fields = "id,placa as nombre,placa,id_otros_conductores";
        $ca->prepareSelect("edo_vehiculos", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function desvincularVehiculoExisteConductor($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $id_otros_conductores = str_replace("{" . $p["id_usuario"] . "}", "", $p["id_otros_conductores"]);
        $ca->prepareUpdate("edo_vehiculos", "id_otros_conductores", "id=:vehiculo_id and empresa=:empresa");
        $ca->bindValue(":vehiculo_id", $p["vehiculo_id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id_otros_conductores", $id_otros_conductores);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function vincularVehiculoExisteConductor($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        if (nwMaker::evalueData($p["vehiculo_id_array"]["id_otros_conductores"])) {
            $id_otros_conductores = $p["vehiculo_id_array"]["id_otros_conductores"];
            $id_otros_conductores .= "{" . $p["id_usuario"] . "}";
        } else {
            $id_otros_conductores = "{" . $p["id_usuario"] . "}";
        }
        $ca->prepareUpdate("edo_vehiculos", "id_otros_conductores", "id=:vehiculo_id and empresa=:empresa");
        $ca->bindValue(":vehiculo_id", $p["vehiculo_id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id_otros_conductores", $id_otros_conductores);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function guardaOtrosConductores($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $conductores = "";
        $conductores = Array();
        for ($i = 0; $i < count($p["otros_conductores"]); $i++) {
            $conductores[] = "{" . $p["otros_conductores"][$i] . "}";
        }
        $conductores = json_encode($conductores);

        $fields = "otros_conductores";

        $vehiculo = null;
        $vehiculo_text = null;
        $placa = null;
        if (isset($p["vehiculo"]) && nwMaker::evalueData($p["vehiculo"])) {
            $fields .= ",vehiculo,vehiculo_text,placa";
            $vehiculo = $p["vehiculo_array"]["id"];
            $vehiculo_text = $p["vehiculo_array"]["vehiculo_text"];
            $placa = $p["vehiculo_array"]["placa"];
        }

        $conductor_id = null;
        $conductor_usuario = null;
        $conductor = null;
        if (isset($p["conductor_principal"]) && nwMaker::evalueData($p["conductor_principal"])) {
            $fields .= ",conductor_id,conductor_usuario,conductor";
            $conductor_id = $p["conductor_principal_array"]["id"];
            $conductor_usuario = $p["conductor_principal_array"]["usuario_principal"];
            $conductor = $p["conductor_principal_array"]["nombre"];
        }

        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["id_servicio"]);
        $ca->bindValue(":otros_conductores", $conductores);
        $ca->bindValue(":vehiculo", $vehiculo);
        $ca->bindValue(":vehiculo_text", $vehiculo_text);
        $ca->bindValue(":placa", $placa);
        $ca->bindValue(":conductor_id", $conductor_id);
        $ca->bindValue(":conductor_usuario", $conductor_usuario);
        $ca->bindValue(":conductor", $conductor);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }

        $li = Array();
        $li["modulo"] = "back:::servicios_totales::: conductores adicionales";
        $li["accion"] = "Actualiza conductores adicionales.";
        $li["comentarios"] = " Principal: {$conductor_usuario} Otros conductores: {$conductores} ";
        $li["id_servicio"] = $p["id_servicio"];
        $li["all_data"] = $p;
        lineTime::save($li);

        $title_conductor = "Conductor(a), tienes un nuevo servicio";
        $body_conductor = "¡Conductor(a)!, tienes un nuevo servicio, revisa tu agenda";

        $a = Array();
        $a["perfil"] = 2;
        $a["usuarios"] = Array();
        if (nwMaker::evalueData($conductor_usuario)) {
            $a["usuarios"][0]["usuario"] = $conductor_usuario;
        }
        for ($i = 0; $i < count($p["detalle"]); $i++) {
            $a["usuarios"][$i + 1]["usuario"] = $p["detalle"][$i]["usuario"];
        }
        if (nwMaker::evalueData($p["usuario_pasajero"])) {
            $a["usuarios"][$i + 1]["usuario"] = $p["usuario_pasajero"];
        }
        $tokens = enrutamiento_masivo::traeTokensApp($a);

        $tokens_pasajeros = Array();
        if (isset($p["usuario_pasajero"]) && nwMaker::evalueData(isset($p["usuario_pasajero"]))) {
            $a = Array();
            $a["perfil"] = 1;
            $a["usuarios"] = Array();
            $a["usuarios"][0]["usuario"] = $p["usuario_pasajero"];
            $tokens_pasajeros = enrutamiento_masivo::traeTokensApp($a);
        }

        $b = Array();
        $b["id"] = $p["id_servicio"];
        $b["users"] = Array();
        for ($i = 0; $i < count($tokens); $i++) {
            $tk = $tokens[$i];
            $b["users"][$i] = Array();
            $b["users"][$i]["title"] = $title_conductor;
            $b["users"][$i]["body"] = $body_conductor;
            $b["users"][$i]["usuario"] = $tk["usuario"];
            $b["users"][$i]["perfil"] = $tk["perfil"];
            $b["users"][$i]["token"] = $tk["json"];
        }
        $b["modulo"] = "back:::envioNotificaciones:::Configurar Conductores";
        notificaciones::saveNotificacionesCreaViaje($b);

        $res = Array();
        $res["tokens_conductores"] = $tokens;
        $res["tokens_pasajeros"] = $tokens_pasajeros;
        return $res;
//        return $tokens;
//        return true;
    }

    public static function consultaOtrosConductores($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $res = Array();
        $fields = "id,CONCAT(nombre, ' ', apellido) as nombre,no_licencia as licencia,fecha_vencimiento as vigencia,nit as cedula,usuario_principal,usuario_cliente as usuario";
        $p["otros_conductores"] = str_replace("{", "", $p["otros_conductores"]);
        $p["otros_conductores"] = str_replace("}", "", $p["otros_conductores"]);
        $p["otros_conductores"] = str_replace('"', "", $p["otros_conductores"]);
        foreach (json_decode($p["otros_conductores"]) as $key => $value) {
            $ca->prepareSelect("pv_clientes", $fields, "id=:id");
            $ca->bindValue(":id", $value);
            if (!$ca->exec()) {
                return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
            }
            if ($ca->size() > 0) {
                $res[] = $ca->flush();
            }
        }
        return $res;
    }

    public static function consultaMasivo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "";
        if ($p["dirigido"] == "2") {
//            NWJSonRpcServer::console($p);
            if ($p["estado"] == "4") {
                $where .= " and estado_activacion is null";
            }
            if ($p["estado"] != "4") {
                $where .= " and estado_activacion=:estado_activacion";
                $ca->bindValue(":estado_activacion", $p["estado"]);
            }
        }
        $ca->prepareSelect("pv_clientes a", "email,celular,perfil,CONCAT(nombre, ' ', apellido) as nombre,estado_activacion,estado_activacion_text,(select numero_servicios from nw_calificaciones where empresa=a.empresa  and perfil=a.perfil and usuario=a.usuario_cliente) as numero_servicios", "empresa=:empresa and perfil=:perfil" . $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $p["dirigido"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }

    public static function consulta($p) {
        session::check();
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        $fecha_fin = nwMaker::sumaRestaFechas("-24 hour", "+0 minute", "+0 second");
        $fecha_fin = date("Y-m-d 00:00:00");
//        NWJSonRpcServer::console($fecha_fin);
        $where = " where  a.empresa=:empresa";
        $where .= " and (a.estado='SOLICITUD' or a.estado='ACEPTADO_RESERVA' or a.estado='ABORDO' or a.estado='EN_RUTA' or a.estado='EN_SITIO' or a.estado='CANCELADO_POR_ADMIN' or a.estado='CANCELADO_POR_CONDUCTOR' or a.estado='CANCELADO_POR_USUARIO' or a.estado='LLEGADA_DESTINO' and :fecha_fin<fecha_finaliza_servicio_driver)";
        if (isset($p["id"])) {
            $where .= " and  a.id=:id ";
        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "a.conductor,a.conductor_id,a.estado,a.tipo_servicio,a.cliente_nombre,a.subcategoria_servicio_text,a.tipo_pago";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if (isset($p["filters"]["cliente"]) && $p["filters"]["cliente"] != "") {
                $where .= " and a.id_usuario=" . $p["filters"]["cliente"];
            }
            if (isset($p["filters"]["bodega"]) && $p["filters"]["bodega"] != "") {
                if (isset($p["filters"]["tipo_empresa"]) && $p["filters"]["tipo_empresa"] == "Flota") {
                    $where .= " and a.bodega_conductor =" . $p["filters"]["bodega"];
                } else {
                    $where .= " and a.bodega=" . $p["filters"]["bodega"];
                }
            }
            if (isset($p["filters"]["estado"])) {
                if ($p["filters"]["estado"] != "0" && $p["filters"]["estado"] != "TODOS" && $p["filters"]["estado"] != "") {
                    $where .= " and a.estado='" . $p["filters"]["estado"] . "'";
                }
            }
            if (isset($p["filters"]["ids"])) {
                if ($p["filters"]["ids"] != "0" && $p["filters"]["ids"] != "TODOS" && $p["filters"]["ids"] != "") {
                    $where .= "and a.estado= 'LLEGADA_DESTINO' and conductor_id=" . $p["filters"]["ids"];
//                }
                }
            }
            if (isset($p["filters"]["fecha_inicio"])) {
                if ($p["filters"]["fecha_inicio"] != "" && $p["filters"]["fecha_final"] != "") {
                    $where .= " and a.fecha between :fecha_inicio and :fecha_final";
                    $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicio"]);
                    $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
                }
            } else {

//                $where .= " and  a.fecha >= :fecha ";
                $ca->bindValue(":fecha", $fecha_fin);
            }
        }
        $where = str_replace("::text", "", $where);
        $sql = "select a.*,(select comentarios from edo_comentarios where id_servicio= a.id and usuario_califica=a.conductor_usuario limit 1) as comentarios_conductor,(select comentarios from edo_comentarios where id_servicio= a.id and usuario_califica=a.usuario limit 1) as comentarios_cliente,b.nombre as bodega_text, 
            concat('<b>Hora: </b>', a.hora,'<br/><b>Fecha: </b>', a.fecha) as hora_fecha,a.estado,a.conductor as conductor_placa,
            concat('<b>Placa:</b>', a.placa,'<br/><b>Marca: </b>', a.vehiculo_text) as placa_text,
            concat(origen,' <br> ', a.ciudad_origen) as origen,a.subcategoria_servicio_text as  sub_servicio,
            concat(destino ,' <br> ', a.ciudad_destino) as destino,
            concat('<b>Tipo Cancelación: </b>', REPLACE(a.cancelado_motivo,\"_\",\" \"),'<br/><b>Motivo: </b>', a.cancelado_notas) as cancelado_motivo,
            '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver Mapa</a></p><br />' as mapa,          
            '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Cancelar</a></p><br />' as cancelar ,   
            '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Finalizar</a></p><br />' as finalizar,    
            '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Chat</a></p><br />' as chat 
            from edo_servicios a left join edo_empresas b on(a.bodega=b.id) " . $where . " order by id desc";

        $ca->prepare($sql);
//        NWJSonRpcServer::console($sql);
        if (isset($p["id"])) {
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha_fin", $fecha_fin);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
//        NWJSonRpcServer::console($ca->assocAll());
//        return $ca->assocAll();

        if (isset($p["id"])) {
            return $ca->flush();
        } else {
            $res = $ca->assocAll();
            if (count($res) > 0) {
                for ($i = 0; $i < count($res); $i++) {
                    $usuario = $res[$i]["cliente_nombre"] == "" ? $res[$i]["usuario"] : $res[$i]["cliente_nombre"];
                    $empresa = $res[$i]["bodega_text"] == "" ? "" : "<br><strong>Empresa: </strong>" . $res[$i]["bodega_text"];
                    $img = "";
                    $datos = "";
                    if ($res[$i]["creado_por_pc"] == "si") {
                        $img = "\"../../imagenes/gaming.png\"/";
                    } else {
                        $img = "\"../../imagenes/gps.png\"/";
                    }
                    if ($res[$i]["subcategoria_servicio"] == "11") {
                        $datos = "<br><strong>Datos Vehículo: </strong>" . $res[$i]["datos_vehiculo_elegido"] . "";
                    }
                    $res[$i]["creado_por_pc"] = "<div style=\" display: flex; justify-content: space-evenly;  height:100%; position:relative;\"><p style=' position:relative;' ><img  src=" . $img . "></p><p><strong>Nombre: </strong>" . $usuario . "<br>"
                            . "<strong>Telefono: </strong>" . $res[$i]["celular"] . "<br><strong>Servicio: </strong>" . $res[$i]["subcategoria_servicio_text"] . "<br><strong>Correo: </strong>" . $res[$i]["usuario"] . ""
                            . $empresa . ""
                            . $datos . "</p></div>";
                    if ($res[$i]["tipo_servicio"] == 1) {
                        $res[$i]["tipo_servicio"] = "reservado";
                    }
                    if ($res[$i]["tipo_servicio"] == "") {
                        $res[$i]["tipo_servicio"] = "ahora";
                    }
//                     NWJSonRpcServer::console($res);
                    if ($res[$i]["estado"] == "SOLICITUD") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 0%; background-color: #104772'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "ASIGNADO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 5%; background-color: #95FE71'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "ACEPTADO_RESERVA") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 10%; background-color: #104772'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "EN_RUTA") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 20%; background-color: #104772'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "EN_SITIO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 40%; background-color: #FEF171'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "ABORDO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 80%; background-color: #FA8F44'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }

                    if ($res[$i]["estado"] == "DESPLAZANDOSE_AL_PUNTO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 10%; background-color: #FA44DE'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "INICIA_SERVICIO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 20%; background-color: #FA8F44'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "SIN_ATENDER") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "LLEGADA_DESTINO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #95FE71'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "CANCELADO_POR_USUARIO") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "CANCELADO_POR_ADMIN") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                    if ($res[$i]["estado"] == "CANCELADO_POR_CONDUCTOR") {
                        $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                    }
                }
            }
//            NWJSonRpcServer::console($res);
            return $res;
        }
    }

    public static function consultaTotal($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $id = null;
        if (isset($p["id"])) {
            $id = $p["id"];
        }
        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        $where = " a.empresa=:empresa";
        if (isset($p["permisos"]["filtrar_por_terminal"])) {
            if ($p["permisos"]["filtrar_por_terminal"] === "true" || $p["permisos"]["filtrar_por_terminal"] === true) {
                $where .= " and a.terminal=:terminal ";
            }
        }
        if (isset($p["permisos"]["filtrar_por_flota"])) {
            if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                $where .= " and a.flota_id=:flota ";
            }
        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "a.placa,a.id,a.conductor_usuario,a.conductor,a.conductor_id,a.estado,a.tipo_servicio,a.cliente_nombre,a.subcategoria_servicio_text,a.tipo_pago,a.booking_id_journey";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if (isset($p["filters"]["estado"])) {
                if ($p["filters"]["estado"] != "0" && $p["filters"]["estado"] != "TODOS" && $p["filters"]["estado"] != "") {
                    if ($p["filters"]["estado"] == "EN_SERVICIO") {
                        $where .= " and a.estado IN('EN_RUTA','EN_SITIO','ABORDO')";
                    } else {
                        $where .= " and a.estado='" . $p["filters"]["estado"] . "'";
                    }
                }
            }
            if (isset($p["filters"]["origen_estado"]) && $p["filters"]["origen_estado"] != "") {
                $where .= " and a.creado_por_pc='" . $p["filters"]["origen_estado"] . "' ";
            }
            if (isset($p["filters"]["bodega"]) && $p["filters"]["bodega"] != "") {
//                $where .= " and a.bodega=" . $p["filters"]["bodega"];
                $where .= " and a.cliente_empresa_id=" . $p["filters"]["bodega"];
            }
            if (isset($p["filters"]["empresa"]) && $p["filters"]["empresa"] != "") {
                $where .= " and a.bodega=" . $p["filters"]["empresa"];
            }
            if (isset($p["filters"]["ciudad_origen"]) && $p["filters"]["ciudad_origen"] != "") {
//                $where .= " and a.ciudad_origen='" . $p["filters"]["ciudad_origen"] . " '";
                $campos = "a.ciudad_origen";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["ciudad_origen"], true);
            }
            if (isset($p["filters"]["ciudad_destino"]) && $p["filters"]["ciudad_destino"] != "") {
//                $where .= " and a.ciudad_destino='" . $p["filters"]["ciudad_destino"] . "' ";
                $campos = "a.ciudad_destino";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["ciudad_destino"], true);
            }
            if (isset($p["filters"]["fecha_inicio"])) {
                if ($p["filters"]["fecha_inicio"] != "" && $p["filters"]["fecha_final"] != "") {
                    $where .= " and a.fecha between :fecha_inicio and :fecha_final";
                    $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicio"]);
                    $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
                }
            }
            if (isset($p["filters"]["ids"])) {
                if ($p["filters"]["ids"] != "0" && $p["filters"]["ids"] != "TODOS" && $p["filters"]["ids"] != "") {
                    $where .= "and a.estado= 'LLEGADA_DESTINO' and a.conductor_id=" . $p["filters"]["ids"];
//                }
                }
            }
        }
        $where .= " order by a.id desc";
        $where = str_replace("::text", "", $where);
//        $fields = "a.*,a.usuario as email,e.nombre as motivo_rechazo_text,";
        $fields = "a.*,a.usuario as email,";
        $fields .= "UCASE(MONTHNAME(a.fecha)) as mes,";
        $fields .= "HOUR(a.hora) as hora_num,";
        $fields .= "CASE WHEN a.hora_fin_servicio is not null AND a.hora_acepta_servicio is not null THEN TIMEDIFF(a.hora_fin_servicio, a.hora_acepta_servicio) ELSE '00:00:00' END as tiempo_finalizado,";
        $fields .= "concat(a.fecha, ' ', a.hora) as hora_fecha";
        $fields .= ",concat(a.fecha, ' ', a.hora) as hora_fecha_servicio";
        $fields .= ",a.cliente_nombre as nombre_cliente";
        $fields .= ",b.nombre as cliente_empresa_id_text,b.nombre as empresa_cliente";
        $fields .= ",c.nombre as cliente_sede_id_text";
        $tables = "edo_servicios a ";
        $tables .= " left join edo_empresas b on (a.cliente_empresa_id=b.id)";
        $tables .= " left join edo_centro_costos c on (a.cliente_sede_id=c.id)";
//        $tables .= " left join edo_motivos_rechazos e on (a.motivo_rechazo=e.id) ";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":flota", $flota);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if ($id != null) {
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
            return $ca->flush();
        } else {
            return $ca->execPage($p);
        }
    }

    public static function consultaDet($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = " where  empresa=:empresa and id=:conductor_id";
        if (isset($p["id"])) {
            $where .= " and  id=:id ";
        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "cliente,cliente_text,conductor,conductor_text";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if (isset($p["filters"]["estado"])) {
                if ($p["filters"]["estado"] != "0" && $p["filters"]["estado"] != "TODOS" && $p["filters"]["estado"] != "") {
                    $where .= " and estado='" . $p["filters"]["estado"] . "'";
                }
            }
        }
        $where = str_replace("::text", "", $where);
        $sql = "select *, 
            concat('<b>Hora: </b>', hora,'<br/><b>Fecha: </b>', fecha) as hora_fecha,estado,conductor as conductor_placa,
            concat('<b>Placa:</b>', placa,'<br/><b>Marca: </b>', vehiculo_text) as placa_text,
            concat('<b>Tipo Cancelación: </b>', REPLACE(cancelado_motivo,\"_\",\" \"),'<br/><b>Motivo: </b>', cancelado_notas) as cancelado_motivo,
            concat(origen,', ', origen) as origen,        
            concat(destino,', ', destino) as destino,   
            '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Ver Mapa</a></p><br />' as mapa          
            from edo_servicios" . $where . " order by id desc";
        $ca->prepare($sql);
//        if (isset($p["id"])) {
//            $ca->bindValue(":id", $p["id"]);
//        }
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":conductor_id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
//        if (isset($p["id"])) {
//            return $ca->flush();
//        } else {
        $res = $ca->assocAll();
        if (count($res) > 0) {
            for ($i = 0; $i < count($res); $i++) {
//                     NWJSonRpcServer::console($res);

                if ($res[$i]["creado_por_pc"] == "si") {
                    $res[$i]["creado_por_pc"] = "<p style=\"text-align=center;\"><img src=\"../../app/img/gaming.png\"/></p>";
                } else {
                    $res[$i]["creado_por_pc"] = "<p style=\"text-align=center;\"><img src=\"../../app/img/gps.png\"/></p>";
                }
                if ($res[$i]["tipo_servicio"] == 1) {
                    $res[$i]["tipo_servicio"] = "reservado";
                }
                if ($res[$i]["tipo_servicio"] == "") {
                    $res[$i]["tipo_servicio"] = "ahora";
                }
//                     NWJSonRpcServer::console($res);
                if ($res[$i]["estado"] == "EN_RUTA") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 40%; background-color: #104772'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "ASIGNADO") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 40%; background-color: #95FE71'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "EN_SITIO") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 10%; background-color: #FEF171'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "SIN_ATENDER") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "CANCELADO_POR_USUARIO") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "CANCELADO_POR_ADMIN") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "CANCELADO_POR_CONDUCTOR") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #F05A3A'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "LLEGADA_DESTINO") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 100%; background-color: #95FE71'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "SOLICITUD") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 0%; background-color: #104772'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "INICIA_SERVICIO") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 20%; background-color: #FA8F44'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
                if ($res[$i]["estado"] == "DESPLAZANDOSE_AL_PUNTO") {
                    $res[$i]["estatus"] = "<div style='width: 100%; height: 10px; background-color: white;border-radius: 5px; border: 2px #ccc solid;'> <div id='porcentaje' style='height: 100%; width: 5%; background-color: #FA44DE'></div><div style='text-align: center; margin-top: -11px; font-size: 10px; font-family: arial;'>" . $res[$i]["estado"] . "</div></div>";
                }
            }
        }
//            NWJSonRpcServer::console($res);
        return $res;
//        }
    }

    public static function consultaVehiculos($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $tables = "edo_vehiculos a";
        $where = " a.empresa=:empresa";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "a.placa,a.usuario,a.usuario_usando,a.id_otros_conductores,a.usuario_text";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if (isset($p["filters"]["placav"]) && $p["filters"]["placav"] != "") {
                $campos = "a.placa";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["placav"], true);
            }
            if (isset($p["filters"]["tipo_vehiculo"]) && $p["filters"]["tipo_vehiculo"] != "") {
                $campos = "a.tipo_vehiculo,a.tipo_vehiculo_text";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["tipo_vehiculo"], true);
            }
            if (isset($p["filters"]["usuario"]) && $p["filters"]["usuario"] != "") {
                $campos = "a.id_usuario,a.usuario_text";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["usuario"], true);
            }
            if (isset($p["filters"]["estado"]) && $p["filters"]["estado"] != "") {
                $where .= " and a.estado_activacion_text='" . $p["filters"]["estado"] . "'";
            }
            if (isset($p["filters"]["soat"]) && $p["filters"]["soat"] != "" && $p["filters"]["soat"] != "white" && $p["filters"]["tipo_semaforo"] == "soat") {
                $fechafin = "";
                $fechainicio = "";
                if ($p["filters"]["soat"] == "green") {
                    $fechafin = self::restaFecha("31");
                    $where .= " and a.fecha_vencimiento_soat >= :fecha_fin";
                }
                if ($p["filters"]["soat"] == "yellow") {
                    $fechainicio = self::restaFecha("1");
                    $fechafin = self::restaFecha("30");
                    $where .= " and a.fecha_vencimiento_soat between :fecha_inicio and :fecha_fin";
                }
                if ($p["filters"]["soat"] == "red") {
                    $fechafin = self::restaFecha("0");
                    $where .= " and a.fecha_vencimiento_soat <= :fecha_fin";
                }
                $ca->bindValue(":fecha_fin", $fechafin);
                $ca->bindValue(":fecha_inicio", $fechainicio);
            }
            if (isset($p["filters"]["ids"])) {
//                if ($p["filters"]["usuario_cliente"] != "0" && $p["filters"]["usuario_cliente"] != "") {
//                    $where .= " and usuario='" . $p["filters"]["usuario_cliente"] . "'";
//                } else {
                if ($p["filters"]["ids"] != "0" && $p["filters"]["ids"] != "") {
                    $where .= " and (a.id_usuario=:id_usuario or a.id_otros_conductores LIKE '%{" . $p["filters"]["ids"] . "}%' ) ";
                    $ca->bindValue(":id_usuario", $p["filters"]["ids"], true, true);
                }
//                }
            }
        }
        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        if (isset($p["permisos"])) {
            if (isset($p["permisos"]["filtrar_por_flota"])) {
                if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                    $tables .= " left join pv_clientes b ON(a.id_usuario=b.id)";
                    $where .= " and b.bodega=:flota ";
                }
            }
        }
        $where .= " order by id DESC";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect($tables, "a.*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":flota", $flota, true);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//            return false;
//        }
        return $ca->execPage($p);
    }

    public static function restaFecha($p) {
        $fecha_actual = date("Y-m-d");
        $nuevafecha = strtotime('+' . $p . ' day', strtotime($fecha_actual));
        $nuevafecha = date('Y-m-d', $nuevafecha);
        return $nuevafecha;
    }

    public static function populateCantVehiculos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepare("select * from edo_vehiculos where id_usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaConductores($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fecha = nwMaker::sumaRestaFechas("+0 hour", "-2 minute", "+0 second");
        $conductores = null;
        $where = "c.empresa=:empresa  ";
        $where .= " and c.perfil=2 and c.offline<>'offline' ";
        $where .= " and c.estado='Activo' ";
        $where .= " and v.empresa=:empresa and v.estado_activacion_text='activo' ";
        if (isset($p["ultimos_conectados"]) && $p["ultimos_conectados"] === true) {
            $where .= " and c.fecha_ultima_conexion>=:fecha";
        }
        if ($p["conductores"] === "TODOS") {
//            $where .= " and c.ciudad_text=:ciudad";
        } else {
            $where .= " and c.id=:id";
            $conductores = $p["conductores"];
        }
        if (isset($p["servicio_para"]) && $p["servicio_para"] == "ahora") {
            $where .= " and c.ocupado='NO' ";
        }
        if (isset($p["servicio_filtro"]) && $p["servicio_filtro"] != "") {
            $where .= " and JSON_SEARCH(c.servicios_activos, 'all', {$p["servicio_filtro"]}, null, '$[*].id') ";
        }
        $where .= " order by c.fecha_ultima_conexion desc";
        $fields = "c.fecha_ultima_conexion,c.latitud,c.longitud,c.id,c.nombre,c.nit,c.servicios_activos,c.usuario_cliente,c.hora_inicio,c.hora_fin";
        $fields .= ",c.preoperacional_ultima_fecha,c.preoperacional_novedad_encontrada,c.fecha_vencimiento,c.no_licencia";
        //fields vehículo
        $fields .= ",v.capacidad_pasajeros as num_personas, v.num_maletas,v.placa,v.modelo,v.fecha_vencimiento_soat";
        $fields .= ",v.estado_activacion_text,v.fecha_vencimiento_tegnomecanica,v.vehiculo_publico_particular";

        $tables = "pv_clientes c ";
        $tables .= "left join edo_vehiculos v on (c.usuario_cliente=v.usuario)";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id", $conductores);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($ca->size() === 0) {
            return 0;
        }
        if ($p["conductores"] != "TODOS") {
            return $ca->flush();
        } else {
            return $ca->assocAll();
        }
    }

    public static function populateEmpresas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "empresa=:empresa ";
        $ca->prepareSelect("edo_empresas", "id,nombre", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenTipoServicio($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 and empresa=:empresa ";
        $ca->prepareSelect("edo_taximetro", "id,tipo_servicio as nombre,tipo_servicio as nombre_solo", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaPagos($p) {
        session::check();
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 and empresa=:empresa";
        if (isset($p["filters"])) {
            if ($p["filters"]["usuario"] != "" && $p["filters"]["usuario"] != null) {
                $where .= " and usuario='" . $p["filters"]["usuario_text"] . "'";
            }
            if ($p["filters"]["tipo"] != "" && $p["filters"]["tipo"] != null) {
                $where .= " and tipo='" . $p["filters"]["tipo"] . "'";
            }
            if ($p["filters"]["estado"] != "" && $p["filters"]["estado"] != null) {
                $where .= " and estado='" . $p["filters"]["estado"] . "'";
            }
            if (isset($p["filters"]["fecha_inicio"])) {
                if ($p["filters"]["fecha_inicio"] != "" && $p["filters"]["fecha_fin"] != "") {
                    $where .= " and fecha between :fecha_inicio and :fecha_fin";
                    $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicio"]);
                    $ca->bindValue(":fecha_fin", $p["filters"]["fecha_fin"]);
                }
            }
        }
        $where .= " order by id desc";
        $ca->prepareSelect("nw_pagos_empresas", "*", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function aprobarPago($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["estado"] == "APROBADO") {
            $ca->prepareSelect("pv_clientes", "saldo,id,celular", "empresa=:empresa and perfil=2 and usuario_cliente=:usuario");
//        NWJSonRpcServer::information($ca->preparedQuery());
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
            $data = $ca->flush();
            $campo = "";
            $saldo = $data["saldo"];
            if ($p["tipo"] == "PAGO") {
                if ($saldo < 0) {
                    $saldo = floatval($saldo) * (-1);
                    $res = floatval($saldo) - floatval($p["valor"]);
                    if ($res < 0) {
                        $res = floatval($res) * (-1);
                    } else if ($res > 0) {
                        $res = "-" . $res;
                    }
                } else {
                    $res = floatval($saldo) + floatval($p["valor"]);
                }
                $campo = ",fecha_ultimo_pago";
            } else {
                if ($saldo < 0) {
                    $saldo = floatval($saldo) * (-1);
                    $res = floatval($saldo) + floatval($p["valor"]);
                    if ($res < 0) {
                        $res = floatval($res) * (-1);
                    } else if ($res > 0) {
                        $res = "-" . $res;
                    }
                } else {
                    $res = floatval($saldo) - floatval($p["valor"]);
                }
            }
            $ca->prepareUpdate("pv_clientes", "saldo" . $campo, "id=:id");
            $ca->bindValue(":id", $data["id"]);
            $ca->bindValue(":saldo", $res);
            if ($p["tipo"] == "PAGO") {
                $ca->bindValue(":fecha_ultimo_pago", $p["fecha"]);
            }
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
                return false;
            }
        }
        $fields = "estado";
        if ($p["estado"] == "APROBADO") {
            $fields .= ",saldo_anterior,nuevo_saldo";
        }
        $ca->prepareUpdate("nw_pagos_empresas", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", $p["estado"]);
        if ($p["estado"] == "APROBADO") {
            $ca->bindValue(":saldo_anterior", $data["saldo"]);
            $ca->bindValue(":nuevo_saldo", $res);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }

        $p["html"] = "Tu solicitud de " . $p["tipo"] . " a sido " . $p["estado"] . ". ";
        if ($p["estado"] == "APROBADO") {
            $p["html"] .= "</br><strong>Valor: </strong>" . $p["valor"] . "";
            $p["html"] .= "</br><strong>Saldo anterior: </strong>" . $data["saldo"] . ""
                    . "</br><strong>Saldo actual: </strong>" . $res;
        }
        $p["body_notify"] = "Tu solicitud de " . $p["tipo"] . " a sido " . $p["estado"] . ".";
        $p["usuario_cliente"] = $p["usuario"];
        $p["celular"] = $data["celular"];
        conductores::sendEmailServicioDestiono($p);
    }

    public static function consultaV($p) {
        session::check();
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 and usuario=:usuario";
        $ca->prepareSelect("edo_vehiculos", "*", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenUsuarios($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $bodega = null;
        $where = " empresa=:empresa and perfil=:perfil ";
        if (isset($p["bodega"])) {
            $where .= " and bodega=:bodega ";
            $bodega = $p["bodega"];
        }
        if ($p["token"] != "") {
            $where .= " and {";
            $where .= " lower(usuario_cliente) like lower('%{$p["token"]}%') ";
            $where .= " or lower(nombre) like lower('%{$p["token"]}%') ";
            $where .= " or lower(nit) like lower('%{$p["token"]}%') ";
            $where .= " or lower(celular) like lower('%{$p["token"]}%') ";
            $where .= " or lower(email) like lower('%{$p["token"]}%') ";
            $where .= " }";
//            $where .= " and (lower(email) like lower('%{$p["token"]}%') 
//                        or lower(nombre) like lower('%{$p["token"]}%')
//                        or lower(documento) like lower('%{$p["token"]}%')
//                        or lower(celular) like lower('%{$p["token"]}%')
//                        or lower(email) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("pv_clientes", "id,usuario_cliente as nombre,concat(nombre,' ',apellido) as nombre_usuario,nit as documento,celular,empresa,perfil,centro_costo,bodega", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":bodega", $bodega);
        $ca->bindValue(":perfil", "1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
//        NWJSonRpcServer::information($ca->preparedQuery());
//        NWJSonRpcServer::console($ca->assocAll());
        return $ca->assocAll();
    }

    public static function populateTokenConductor($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $bodega = null;
        $where = " empresa=:empresa and perfil=:perfil and estado <> 'ELIMINADO'";
        if (isset($p["bodega"])) {
            $where .= " and bodega=:bodega ";
            $bodega = $p["bodega"];
        }
        if (isset($si["bodega"]) && $si["bodega"] != "") {
            $where .= " and bodega=:bodega ";
            $bodega = $si["bodega"];
        }
        if ($p["token"] != "") {
            $where .= " and {";
            $where .= " lower(usuario_cliente) like lower('%{$p["token"]}%') ";
            $where .= " or lower(nombre) like lower('%{$p["token"]}%') ";
            $where .= " or lower(nit) like lower('%{$p["token"]}%') ";
            $where .= " or lower(celular) like lower('%{$p["token"]}%') ";
            $where .= " or lower(email) like lower('%{$p["token"]}%') ";
            $where .= " }";
        }
        $ca->prepareSelect("pv_clientes", "id,usuario_cliente as nombre,concat(nombre,' ',apellido) as nombre_usuario,nit as documento,celular,empresa,perfil", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":bodega", $bodega);
        $ca->bindValue(":perfil", "2");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenUsuarioss($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 and perfil=2 ";
        $where .= " and empresa=:empresa and estado <> 'ELIMINADO'";
//        if (isset($si["bodega"]) && $si["bodega"] != "") {
//            $where .= " and bodega=:bodega ";
//            $ca->bindValue(":bodega", $si["bodega"]);
//        }
        if ($p["token"] != "") {
            $where .= " and (lower(email) like lower('%{$p["token"]}%') 
                        or lower(usuario_cliente) like lower('%{$p["token"]}%')
                        or lower(nombre) like lower('%{$p["token"]}%')
                        or lower(documento) like lower('%{$p["token"]}%')
                        or lower(email) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("pv_clientes", "id,email as nombre,concat(nombre,' ',apellido) as nombre_usuario,documento", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function updateEstadoServicio($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "estado", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", "SIN_ATENDER");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        $li = Array();
        $li["modulo"] = "system:::SIN_ATENDER";
        $li["accion"] = "Cambio de estado SIN_ATENDER.";
        $li["comentarios"] = "";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = "system";
        $li["empresa"] = $p["empresa"];
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function updateNotifyNovedades($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $fields = "notificado_back";
        $ca->prepareUpdate("edo_novedades", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":notificado_back", $p["notificado_back"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
    }

    public static function activarVehiculo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "estado_activacion,estado_activacion_text";
        $ca->prepareUpdate("edo_vehiculos", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado_activacion", $p["estado_activo"]);
        $ca->bindValue(":estado_activacion_text", $p["estado_activo_text"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        $where = "empresa=:empresa and usuario_cliente=:usuario";
        $ca->prepareSelect("pv_clientes", "id,celular,usuario_cliente", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", "2");
//NWJSonRpcServer::console($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $data = $ca->flush();
//        NWJSonRpcServer::console($data);
        if ($p["estado_activo"] == "1" || $p["estado_activo"] == 1) {
            $asunto = "Aceptado";
        } else {
            $asunto = "Rechazado";
        }
        $body_notify = "Tu vehículo ha sido " . strtolower($asunto);

        $ind = "57";
        $a = Array();
        $a["correo_usuario_recibe"] = $data["usuario_cliente"];
        $a["destinatario"] = $data["usuario_cliente"];
        $a["titleMensaje"] = $asunto;
        $a["sms_body"] = $body_notify;
        $a["body"] = $body_notify;
        $a["body_email"] = $body_notify;
        $a["tipo"] = "bloqueoVhe";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = date("Y-m-d H:i:s");
        $a["tipoAviso"] = "driver";
        $a["id_objetivo"] = $p["id"];
        $a["foto"] = "";
        $a["usuario_envia"] = $data["usuario_cliente"];
        $a["sendEmail"] = false;
        $a["sendNotifyPush"] = true;
        if (isset($data["celular"]) && $data["celular"] != "" && $data["celular"] != null && $data["celular"] != false) {
            $a["celular"] = "{$ind}{$data["celular"]}";
        }
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
//        $a["fromName"] = "";
//        $a["fromEmail"] = "";
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
    }

    public static function updateArchivar($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fields = "estado";
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", "SIN_ATENDER_ARCHIVADO");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        $li = Array();
        $li["modulo"] = "system:::SIN_ATENDER_ARCHIVADO";
        $li["accion"] = "Cambio de estado SIN_ATENDER_ARCHIVADO.";
        $li["comentarios"] = "";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = "system";
        $li["empresa"] = $p["empresa"];
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function confirmaCotizacionServicio($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($p);

        $db->transaction();
        $liquida_fecha = date("Y-m-d H:i:s");
        $fields = "valor_total_servicio,tiempo,total_metros_final,liquida_fecha,liquida_usuario,estado,observaciones_liquidacion";
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["data_service"]["id"]);
        $ca->bindValue(":estado", "COTIZACION_CONFIRMADA");
        $ca->bindValue(":valor_total_servicio", $p["valor_final"]);
        $ca->bindValue(":tiempo", $p["tiempo"]);
        $ca->bindValue(":total_metros_final", $p["total_metros_final"]);
        $ca->bindValue(":observaciones_liquidacion", $p["observaciones_liquidacion"]);
        $ca->bindValue(":liquida_usuario", $si["usuario"]);
        $ca->bindValue(":liquida_fecha", $liquida_fecha);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }

        $li = Array();
        $li["modulo"] = "COTIZACION_CONFIRMADA_OPERADOR";
        $li["accion"] = "Cambio de estado COTIZACION_CONFIRMADA_OPERADOR.";
        $li["comentarios"] = "Cotización confirmada por operador";
        $li["id_servicio"] = $p["data_service"]["id"];
        $li["usuario"] = $si["usuario"];
        $li["empresa"] = $si["empresa"];
        $li["all_data"] = $p;
        lineTime::save($li);

        $p["plantilla"] = "COTIZACION_CONFIRMADA_OPERADOR";
        $p["correo_destinatario"] = $p["data_service"]["usuario"];
        $p["fieldsReplace"] = Array();
        $p["fieldsReplace"]["nombre_cliente"] = $p["data_service"]["nombre_cliente"];
        $p["fieldsReplace"]["empresa_nombre"] = $p["data_service"]["bodega_text"];
        $p["fieldsReplace"]["ciudad_destino"] = $p["data_service"]["ciudad_destino"];
        $p["fieldsReplace"]["ciudad_origen"] = $p["data_service"]["ciudad_origen"];
        $p["fieldsReplace"]["origen"] = $p["data_service"]["origen"];
        $p["fieldsReplace"]["destino"] = $p["data_service"]["destino"];
        $p["fieldsReplace"]["conductor"] = $p["data_service"]["conductor"];
        $p["fieldsReplace"]["vehiculo_text"] = $p["data_service"]["vehiculo_text"];
        $p["fieldsReplace"]["correo_cliente"] = $p["data_service"]["email"];
        $p["fieldsReplace"]["placa"] = $p["data_service"]["placa"];
        $p["fieldsReplace"]["valor_total_servicio"] = $p["valor_final"];
        $p["fieldsReplace"]["tiempo"] = $p["tiempo"];
        $p["fieldsReplace"]["total_metros_final"] = $p["total_metros_final"];
        $p["fieldsReplace"]["usuario"] = $si["usuario"];
        $p["fieldsReplace"]["fecha"] = $liquida_fecha;
        $n = servicios_admin::sendEmailByPlantilla($p);
        if ($n !== true) {
            $db->rollback();
            return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]}), " . $n);
        }

        $ca->prepareSelect("nw_params ", "*", "clave='correo_cotizaciones' and valor='SI'and empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        $empres = $ca->flush();
        if ($empres != false) {
            $ca->prepareSelect("usuarios ", "usuario,email", "id=:id");
            $ca->bindValue(":id", $p["data_service"]["operario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return;
            }
            $usuario = $ca->flush();

            $liquida_fecha = date("Y-m-d H:i:s");
            $p["plantilla"] = "CONFIRMAR_COTIZACION_CLIENTE";
            $p["correo_destinatario"] = $usuario["email"];
//            $p["correo_destinatario"] = 'diegoj@gruponw.com';
            $p["fieldsReplace"] = Array();
            $p["fieldsReplace"]["id"] = $p["data_service"]["id"];
            $p["fieldsReplace"]["empresa_nombre"] = $empres["razon_social"];
            $p["fieldsReplace"]["nombre_cliente"] = $usuario["nombre"];
            $p["fieldsReplace"]["estado"] = "COTIZACION_CONFIRMADA";
            $n = servicios_admin::sendEmailByPlantilla($p);
            if ($n !== true) {
                $db->rollback();
                return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]}), " . $n);
            }
        }
        $db->commit();
        return true;
    }

    public static function liquidarServicio($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();
        $liquida_fecha = date("Y-m-d H:i:s");
        $fields = "valor_total_servicio,tiempo,total_metros_final,liquida_fecha,liquida_usuario,estado,observaciones_liquidacion";
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["data_service"]["id"]);
        $ca->bindValue(":estado", "LIQUIDADO");
        $ca->bindValue(":valor_total_servicio", $p["valor_final"]);
        $ca->bindValue(":tiempo", $p["tiempo"]);
        $ca->bindValue(":total_metros_final", $p["total_metros_final"]);
        $ca->bindValue(":observaciones_liquidacion", $p["observaciones_liquidacion"]);
        $ca->bindValue(":liquida_usuario", $si["usuario"]);
        $ca->bindValue(":liquida_fecha", $liquida_fecha);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }

        $li = Array();
        $li["modulo"] = "LIQUIDA_SERVICIO_FINAL_OPERADOR";
        $li["accion"] = "Cambio de estado COTIZACION_CONFIRMADA_OPERADOR.";
        $li["comentarios"] = "Cotización confirmada por operador";
        $li["id_servicio"] = $p["data_service"]["id"];
        $li["usuario"] = $si["usuario"];
        $li["empresa"] = $si["empresa"];
        $li["all_data"] = $p;
        lineTime::save($li);

        $p["plantilla"] = "LIQUIDA_SERVICIO_FINAL";
        $p["correo_destinatario"] = $p["data_service"]["usuario"];
        $p["fieldsReplace"] = Array();
        $p["fieldsReplace"]["nombre_cliente"] = $p["data_service"]["nombre_cliente"];
        $p["fieldsReplace"]["empresa_nombre"] = $p["data_service"]["bodega_text"];
        $p["fieldsReplace"]["ciudad_destino"] = $p["data_service"]["ciudad_destino"];
        $p["fieldsReplace"]["ciudad_origen"] = $p["data_service"]["ciudad_origen"];
        $p["fieldsReplace"]["origen"] = $p["data_service"]["origen"];
        $p["fieldsReplace"]["destino"] = $p["data_service"]["destino"];
        $p["fieldsReplace"]["conductor"] = $p["data_service"]["conductor"];
        $p["fieldsReplace"]["vehiculo_text"] = $p["data_service"]["vehiculo_text"];
        $p["fieldsReplace"]["correo_cliente"] = $p["data_service"]["email"];
        $p["fieldsReplace"]["placa"] = $p["data_service"]["placa"];
        $p["fieldsReplace"]["valor_total_servicio"] = $p["valor_final"];
        $p["fieldsReplace"]["tiempo"] = $p["tiempo"];
        $p["fieldsReplace"]["total_metros_final"] = $p["total_metros_final"];
        $p["fieldsReplace"]["usuario"] = $si["usuario"];
        $p["fieldsReplace"]["fecha"] = $liquida_fecha;
        $n = servicios_admin::sendEmailByPlantilla($p);
        if ($n !== true) {
            $db->rollback();
            return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]}), " . $n);
        }
        $db->commit();
        return true;
    }

    public static function updateServicioConductor($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cd = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();
        $estado = 'SOLICITUD';
        if (isset($p["estado"])) {
            $estado = $p["estado"];
        }
        $fields = "fecha_asignacion_para_conductor,placa,vehiculo,vehiculo_text,conductor_id,conductor,conductor_usuario";
        if (isset($p["reasignarCoductor"]) && $p["reasignarCoductor"] == "SI") {
            $ca->prepareUpdate("pv_clientes", "ocupado", "id=:conductor_id");
            $ca->bindValue(":conductor_id", $p["usuario_anterior_service"]);
            $ca->bindValue(":ocupado", "NO");
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
            $fields .= ",estado";
        }
        $fields .= ",valor,subcategoria_servicio,subcategoria_servicio_text";
        $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":vehiculo", isset($p["vehiculo"]) == "" ? 0 : $p ["vehiculo"]);
        $ca->bindValue(":vehiculo_text", isset($p["vehiculo_text"]) == "" ? 0 : $p["vehiculo_text"]);
        $ca->bindValue(":placa", isset($p["placa"]) == "" ? 0 : $p["placa"]);
        $ca->bindValue(":conductor_id", $p["conductor"]);
        $ca->bindValue(":conductor", $p["conductor_text"]);
        $ca->bindValue(":fecha_asignacion_para_conductor", date("Y-m-d H:i:s"));
        $ca->bindValue(":conductor_usuario", $p["usuario_cond"]);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":valor", $p["valor"]);
        $ca->bindValue(":servicio", $p["dataGetRecord"]["tipo_servicio"]);
        $ca->bindValue(":subcategoria_servicio", $p["dataGetRecord"]["tipo_servicio"]);
        $ca->bindValue(":subcategoria_servicio_text", $p["dataGetRecord"]["tipo_servicio_text"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        $cd->prepare("select * from nwmaker_suscriptorsPush where usuario=:conductor_id and empresa = :empresa and perfil=2");
        $cd->bindValue(":conductor_id", $p["usuario_cond"]);
        $cd->bindValue(":empresa", $si["empresa"]);
        if (!$cd->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $cd->lastErrorText());
            return;
        }
        $token = Array();
        $token[] = $p;
        $cont = $cd->size();
        if ($cont > 0) {
            for ($i = 0; $i < $cont; $i++) {
                $res = $cd->flush();
                $token[] = $res["json"];
            }
        }

        $p["plantilla"] = "ASIGNA_CONDUCTOR_A_CLIENTE";
        $p["correo_destinatario"] = $p["usuario"];
        $p["fieldsReplace"] = Array();
        $p["fieldsReplace"]["nombre_cliente"] = $p["data_service"]["nombre_cliente"];
        $p["fieldsReplace"]["empresa_nombre"] = $p["data_service"]["bodega_text"];
        $p["fieldsReplace"]["ciudad_destino"] = $p["data_service"]["ciudad_destino"];
        $p["fieldsReplace"]["ciudad_origen"] = $p["data_service"]["ciudad_origen"];
        $p["fieldsReplace"]["origen"] = $p["data_service"]["origen"];
        $p["fieldsReplace"]["destino"] = $p["data_service"]["destino"];
        $p["fieldsReplace"]["conductor_text"] = $p["conductor_text"];
        $p["fieldsReplace"]["usuario_cond"] = $p["usuario_cond"];
        $p["fieldsReplace"]["vehiculo_text"] = $p["vehiculo_text"];
        $p["fieldsReplace"]["valor"] = $p["valor"];
        $p["fieldsReplace"]["correo_cliente"] = $p["usuario"];
        $p["fieldsReplace"]["placa"] = $p["placa"];
        $p["fieldsReplace"]["marca_text"] = $p["marca_text"];
        $p["fieldsReplace"]["estado"] = $p["estado"];
        $n = servicios_admin::sendEmailByPlantilla($p);
        if ($n !== true) {
            $db->rollback();
            return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]}), " . $n);
        }
        $db->commit();
        return $token;
    }

    public static function sendEmailByPlantilla($p) {
        $si = session::getInfo();
        $pl = servicios_admin::getPlantilla($p["plantilla"], $si["terminal"]);
//                NWJSonRpcServer::console($pl);

        if ($pl > 0) {
            $xa = false;
            $body = $pl["cuerpo_mensaje"];
            foreach ($p["fieldsReplace"] as $key => $value) {
                $body = str_replace("{{$key}}", $value, $body);
            }
            $asunto = $pl["asunto"];
            foreach ($p["fieldsReplace"] as $key => $value) {
                $asunto = str_replace("{{$key}}", $value, $asunto);
            }

            $body_notify = "";

            $correoSend = $p["correo_destinatario"];
            $mail = servicios_admin::getMail($correoSend);
            if ($mail !== false) {
                $a = Array();
                $a["celular"] = false;
                $a["send_sms"] = false;
                $a["cleanHtml"] = true;
                $a["fromName"] = $pl["enviado_desde_nombre"];
                $a["fromEmail"] = $pl["enviado_desde_correo"];
                $a["correo_usuario_recibe"] = $correoSend;
                $a["destinatario"] = $correoSend;
                $a["titleMensaje"] = $asunto;
                $a["body"] = $body_notify;
                $a["body_email"] = $body;
                $a["tipo"] = nwMaker::cortaText($p["plantilla"], 15);
                $a["link"] = null;
                $a["modo_window"] = "popup";
                $a["insertaEnTabla"] = true;
                $a["fechaAviso"] = date("Y-m-d H:i:s");
                $a["tipoAviso"] = "asesor";
                $a["sendEmail"] = true;
                $a["id_objetivo"] = null;
                $a["usuario_envia"] = $si["usuario"];
                $a["izquierda_nomostrar_despues_de"] = "1";
                $a["sendNotifyPush"] = true;
                $a["terminal"] = $si["terminal"];
                $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
                $n = nwMaker::notificacionNwMaker($a);
//                if ($n !== true) {
//                    $db->rollback();
//                    return nwMaker::error($n);
//                }
                return true;
            }
            return true;
//            return "El correo no es válido.";
        }
        return "No existe la plantilla {$p["plantilla"]} Consulte con el administrador del sistema.";
    }

    public static function getPlantilla($tipo, $terminal = null) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "tipo='{$tipo}' and activo='SI' ";
        if ($terminal !== null) {
            $where .= " and terminal=:terminal";
        }
        $where .= " order by id desc limit 1 ";
        $ca->prepareSelect("sop_plantillas_correos", "asunto,cuerpo_mensaje,enviado_desde_correo,enviado_desde_nombre,cuerpo_notificacion_interna,enviar_a", $where);
        $ca->bindValue(":terminal", $terminal);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function getMail($cadena) {
        $mail = false;
        if (servicios_admin::is_valid_email($cadena)) {
            $cad = explode("@", $cadena);
            if (isset($cad[1])) {
                $x = $cad[1];
                $mystring = $x;
                $findme = '.';
                $pos = strpos($mystring, $findme);
                if ($pos !== false) {
                    $mail = "@" . $x;
                    $mail = explode(" ", $mail);
                    $mail = $mail[0];
                    $exp = explode(" ", $cad[0]);
                    $end = end($exp);
                    $mail = $end . $mail;
                }
            }
        }
        return $mail;
    }

    public static function is_valid_email($str) {
        return (false !== strpos($str, "@") && false !== strpos($str, "."));
    }

//    public static function validaNotificaciones($p) {
//        
//    }

    public static function saveServicio($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $cb->setCleanHtml(false);
//        $cd = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();
        $terminal = null;
        if (isset($p["terminal"])) {
            $terminal = $p["terminal"];
        }
        if (isset($si["terminal"])) {
            $terminal = $si["terminal"];
        }
        $id_usuario = null;
        if (isset($p["id_usuario"])) {
            $id_usuario = $p["id_usuario"];
        }
        if (isset($si["id_usuario"])) {
            $id_usuario = $si["id_usuario"];
        }
        $empresa = null;
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
        }
        if (isset($si["empresa"])) {
            $empresa = $si["empresa"];
        }
        $usuario_session = null;
        if (isset($p["usuario"])) {
            $usuario_session = $p["usuario"];
        }
        if (isset($si["usuario"])) {
            $usuario_session = $si["usuario"];
        }
        if (isset($p["usuario_session"])) {
            $usuario_session = $p["usuario_session"];
        }

        $tipo_urbanrural = false;
        if (isset($p["tipo_urbanrural"])) {
            $tipo_urbanrural = $p["tipo_urbanrural"];
        }
        $valor_recargo_ruta_fija = false;
        if (isset($p["valor_recargo_ruta_fija"])) {
            $valor_recargo_ruta_fija = $p["valor_recargo_ruta_fija"];
        }
        $valorbase = false;
        if (isset($p["valorbase"])) {
            $valorbase = $p["valorbase"];
        }
        $valorminutos = false;
        if (isset($p["valorminutos"])) {
            $valorminutos = $p["valorminutos"];
        }
        $valordistancia = false;
        if (isset($p["valordistancia"])) {
            $valordistancia = $p["valordistancia"];
        }
        $valor_unidad_tiempo = false;
        if (isset($p["valor_unidad_tiempo"])) {
            $valor_unidad_tiempo = $p["valor_unidad_tiempo"];
        }
        $valor_unidad_metros = false;
        if (isset($p["valor_unidad_metros"])) {
            $valor_unidad_metros = $p["valor_unidad_metros"];
        }
        $valor_tarifa_minima = false;
        if (isset($p["valor_tarifa_minima"])) {
            $valor_tarifa_minima = $p["valor_tarifa_minima"];
        }

        $cliente_empresa_id = null;
        if (isset($p["cliente_empresa_id"])) {
            $cliente_empresa_id = $p["cliente_empresa_id"];
        }
        $cliente_sede_id = null;
        if (isset($p["cliente_sede_id"])) {
            $cliente_sede_id = $p["cliente_sede_id"];
        }
        $centro_costo = "";
        if (isset($p["centro_costo"])) {
            $centro_costo = $p["centro_costo"];
        }
        $bodega_text = "";
        if (isset($p["bodega_text"])) {
            $bodega_text = $p["bodega_text"];
        }
        $valor = "";
        if (isset($p["recogiendo"])) {
            $valor = $p["recogiendo"];
        }
//        if (isset($p["valor_viaje"]) && nwMaker::evalueData($p["valor_viaje"])) {
        if (isset($p["valor_viaje"])) {
            $valor = $p["valor_viaje"];
        }
        $valor_viaje_booking = self::getVar($p, "valor_viaje_booking");
        $flota_id = self::getVar($p, "flota_id");
        $flota_text = self::getVar($p, "flota_text");
        $ciudad_conductores_id = self::getVar($p, "ciudad_conductores_id");
        $ciudad_conductores_nombre = self::getVar($p, "ciudad_conductores_nombre");
        $sentido = self::getVar($p, "sentido");
        $times_dis_travel_gps = self::getVar($p, "times_dis_travel_gps");
        $total_metros = self::getVar($p, "total_metros");
        $tiempo_estimado = self::getVar($p, "tiempo_estimado");
        $tiempo = self::getVar($p, "tiempo");
        $latitudOri = self::getVar($p, "latitudOri");
        $longitudOri = self::getVar($p, "longitudOri");
        $latitudDes = self::getVar($p, "latitudDes");
        $longitudDes = self::getVar($p, "longitudDes");
        $tipo_servicio = self::getVar($p, "tipo_servicio");
        $servicio_para = self::getVar($p, "servicio_para");
        $vehiculo_text = self::getVar($p, "vehiculo_text");
        $vehiculo = self::getVar($p, "vehiculo");
        $tipo_tarifa = self::getVar($p, "tipo_tarifa");
        $id_tarifa = self::getVar($p, "id_tarifa");
        $celular_usuario = self::getVar($p, "celular_usuario");
        $ciudad_origen = self::getVar($p, "ciudad_origen");
        $pais_origen = self::getVar($p, "pais_origen");
        $origen = self::getVar($p, "origen");
        $ciudad_destino = self::getVar($p, "ciudad_destino");
        $destino = self::getVar($p, "destino");
        $placa = self::getVar($p, "placa");
        $conductor_id = self::getVar($p, "conductor");
        $conductor_text = self::getVar($p, "conductor_text");
        $usuario_cond = self::getVar($p, "usuario_cond");
        $usuario = self::getVar($p, "usuario");
        $usuario_text = self::getVar($p, "usuario_text");
        $nombre_usuario = self::getVar($p, "nombre_usuario");
        $token_usuario = self::getVar($p, "token_usuario");
        $observaciones_servicio = self::getVar($p, "observaciones_servicio");
        $vuelo_numero = self::getVar($p, "vuelo_numero");
        $cod_compra = self::getVar($p, "cod_compra");
        $booking_id_journey = self::getVar($p, "booking_id_journey");
        $booking_id_real_journey = self::getVar($p, "booking_id_real_journey");
        $estado = self::getVar($p, "estado");
        $moneda = self::getVar($p, "moneda");
        $centro_costo_text = self::getVar($p, "centro_costo_text");
        $subcategoria_servicio = self::getVar($p, "subcategoria_servicio");
        $subcategoria_servicio_text = self::getVar($p, "subcategoria_servicio_text");
        $bodega_id = self::getVar($p, "bodega");
        $creado_por_pc = self::getVar($p, "creado_por_pc");
        $trf = self::getVar($p, "trf");
        $trf_text = self::getVar($p, "trf_text");

        $adjunto_cotizacion = self::getVar($p, "adjunto_cotizacion");

        $id_relation_group_travel = self::getVar($p, "id_relation_group_travel");
        if (isset($p["token_usuario"][0]["json"])) {
            $token_usuario = $p["token_usuario"][0]["json"];
        }

        $fecha_asignacion_para_conductor = null;
        if (isset($p["placa"]) && isset($p["servicio_para"]) && $p["servicio_para"] == "reservado") {
            $fecha_asignacion_para_conductor = date("Y-m-d H:i:s");
        }
        if (isset($p["fecha_asignacion_para_conductor"])) {
            $fecha_asignacion_para_conductor = $p["fecha_asignacion_para_conductor"];
        }

        if (isset($p["fecha"]) && isset($p["hora"])) {
            $fecha = $p["fecha"];
            $hora = $p["hora"];
        } else {
            $fecha = date("Y-m-d");
            $hora = date("H:i:s");
        }
        $bodega = "";
        if (isset($p["bodega"])) {
            $bodega .= ",bodega";
        }
        $fecha_creacion = date("Y-m-d H:i:s");
        if (isset($p["fecha_creacion"])) {
            $fecha_creacion = $p["fecha_creacion"];
        }
        if (isset($p["subservicio"])) {
            $bodega .= ",subservicio,subservicio_text";
        }
        $num_maletas = null;
        if (isset($p["num_maletas"])) {
            $num_maletas .= $p["num_maletas"];
        }
        $es_cliente = false;
        if (isset($p["es_cliente"])) {
            $es_cliente = $p["es_cliente"];
        }
        $num_personas = null;
        if (isset($p["num_personas"])) {
            $num_personas .= $p["num_personas"];
        }
        $code_verifi_service = null;
        $code_verifi_service_fin = null;
        if (isset($p["code_verifi_service"])) {
            $code_verifi_service = $p["code_verifi_service"];
        }
        if (isset($p["code_verifi_service_fin"])) {
            $code_verifi_service_fin = $p["code_verifi_service_fin"];
        }
        $totalParadas = 0;
        if (isset($p["parada"])) {
            $totalParadas = count($p["parada"]);
        }
        if (isset($p["total_pasajeros"])) {
            $totalParadas = $p["total_pasajeros"];
        }
        $tipo_pago = "";
        if (isset($p["tipo_pago"])) {
            $tipo_pago = $p["tipo_pago"];
        }
        $tipo_pago_id = "";
        if (isset($p["tipo_pago_id"])) {
            $tipo_pago_id = $p["tipo_pago_id"];
        }

        $comentarios_ubicacion = null;
        if (isset($p["comentarios_ubicacion"])) {
            $comentarios_ubicacion = $p["comentarios_ubicacion"];
        }
        $id_service_initial = "";
        if (isset($p["id_service_initial"])) {
            $id_service_initial = $p["id_service_initial"];
        }

//        $creado_por_pc_id = "";
//        if (isset($p["creado_por_pc_id"])) {
//            $creado_por_pc_id = $p["creado_por_pc_id"];
//        }


        $fields = "paradas_adicionales_iniciales_creacion,
                   datos_vehiculo_elegido,usuario,id_usuario,empresa,fecha,hora
                   ,origen,ciudad_origen,pais_origen,destino,ciudad_destino
                   ,operario,operario_text,latitudOri,longitudOri,longitudDes,latitudDes
                   ,centro_costo,centro_costo_text,num_maletas,num_personas{$bodega}";

        if (!isset($p["id_booking_api"])) {
            $fields .= ",id";
        }
        if (isset($p["id"]) && $p["id"] != "" && $p["id"] != null && !isset($p["id_booking_api"])) {
//            $fields .= ",id";
        } else {
            $fields .= ",terminal";
        }
        if ($creado_por_pc != "") {
            $fields .= ",creado_por_pc";
        }
        if ($trf != "") {
            $fields .= ",trf";
        }
        if ($trf_text != "") {
            $fields .= ",trf_text";
        }
        if ($bodega_text != "") {
            $fields .= ",bodega_text";
        }
        if ($times_dis_travel_gps != "") {
            $fields .= ",times_dis_travel_gps";
        }
        if ($cliente_sede_id != null) {
            $fields .= ",cliente_sede_id";
        }
        if ($cliente_empresa_id != null) {
            $fields .= ",cliente_empresa_id";
        }
        if ($tipo_tarifa != "") {
            $fields .= ",tarifa";
        }
        if ($id_tarifa != "") {
            $fields .= ",id_tarifa";
        }
        if ($subcategoria_servicio != "") {
            $fields .= ",subcategoria_servicio";
        }
        if ($subcategoria_servicio_text != "") {
            $fields .= ",subcategoria_servicio_text";
        }
        if ($tipo_servicio != "") {
            $fields .= ",servicio";
        }
        if ($servicio_para != "") {
            $fields .= ",tipo_servicio";
        }
        if ($placa != "") {
            $fields .= ",placa";
        }
        if ($vehiculo != "") {
            $fields .= ",vehiculo";
        }
        if ($vehiculo_text != "") {
            $fields .= ",vehiculo_text";
        }
        if ($conductor_id != "") {
            $fields .= ",conductor_id";
        }
        if ($conductor_text != "") {
            $fields .= ",conductor";
        }
        if ($usuario_cond != "") {
            $fields .= ",conductor_usuario";
        }
        if ($tipo_pago != "") {
            $fields .= ",tipo_pago";
        }
        if ($tipo_pago_id != "") {
            $fields .= ",tipo_pago_id";
        }
//        if ($creado_por_pc_id != "") {
//            $fields .= ",creado_por_pc_id";
//        }
        if ($tipo_urbanrural != false) {
            $fields .= ",tipo_urbanrural";
        }
        if ($flota_id != "") {
            $fields .= ",flota_id";
        }
        if ($flota_text != "") {
            $fields .= ",flota_text";
        }
        if ($booking_id_journey != "") {
            $fields .= ",booking_id_journey";
        }
        if ($booking_id_real_journey != "") {
            $fields .= ",booking_id_real_journey";
        }
        if ($token_usuario != "") {
            $fields .= ",token_usuario";
        }
        if ($nombre_usuario != "") {
            $fields .= ",cliente_nombre";
        }
        if ($celular_usuario != "") {
            $fields .= ",celular";
        }
        if ($tiempo != "") {
            $fields .= ",tiempo";
        }
        if ($tiempo_estimado != "") {
            $fields .= ",tiempo_estimado";
        }
        if ($total_metros != "") {
            $fields .= ",total_metros";
        }
        if ($code_verifi_service != "") {
            $fields .= ",code_verifi_service";
        }
        if ($code_verifi_service_fin != "") {
            $fields .= ",code_verifi_service_fin";
        }
        if ($sentido != "") {
            $fields .= ",sentido";
        }
        if ($valor != "") {
            $fields .= ",valor";
        }
        if ($ciudad_conductores_id != "") {
            $fields .= ",ciudad_conductores_id";
        }
        if ($ciudad_conductores_nombre != "") {
            $fields .= ",ciudad_conductores_nombre";
        }
        if ($observaciones_servicio != "") {
            $fields .= ",observaciones_servicio";
        }
        if ($vuelo_numero != "") {
            $fields .= ",vuelo_numero";
        }
        if ($cod_compra != "") {
            $fields .= ",cod_compra";
        }
        if ($moneda != "") {
            $fields .= ",moneda";
        }
        if ($estado != "") {
            $fields .= ",estado";
        }
        if ($fecha_creacion != false) {
            $fields .= ",fecha_creacion";
        }
        if ($fecha_asignacion_para_conductor != false) {
            $fields .= ",fecha_asignacion_para_conductor";
        }
        if ($adjunto_cotizacion != "") {
            $fields .= ",adjunto_cotizacion";
        }

        if ($valor_recargo_ruta_fija != false) {
            $fields .= ",valor_recargo_ruta_fija";
        }
        if ($valorbase != false) {
            $fields .= ",valorbase";
        }
        if ($valorminutos != false) {
            $fields .= ",valorminutos";
        }
        if ($valordistancia != false) {
            $fields .= ",valordistancia";
        }
        if ($valor_unidad_tiempo != false) {
            $fields .= ",valor_unidad_tiempo";
        }
        if ($valor_unidad_metros != false) {
            $fields .= ",valor_unidad_metros";
        }
        if ($valor_tarifa_minima != false) {
            $fields .= ",valor_tarifa_minima";
        }
        if ($valor_viaje_booking != "") {
            $fields .= ",valor_viaje_booking";
        }
        if ($comentarios_ubicacion != null) {
            $fields .= ",observacion_ultima_ubicacion";
        }
        if ($id_service_initial != "") {
            $fields .= ",id_service_initial";
        }

        $d["empresa"] = $empresa;
        $remesa = servicios::consecutiveRemittance($d, $db);
        if ($remesa) {
            $fields .= ",remesa";
        }
        if (isset($p["carga"]) && $p["carga"] == "SI") {
            $fields .= ",numero_auxiliares,salida_periferia,despacho,retorno,cargue,descargue,contacto_recogida"
                    . ",observaciones_recogida,contacto_entrega,telefono_recogida,"
                    . "telefono_entrega,observaciones_entrega,descripcion_carga,cantidad,volumen,peso,empaque,valor_declarado";
        }
//        if ($id_relation_group_travel != "") {
        $fields .= ",id_relation_group_travel";
//        }
        $id_booking = null;
        $id = null;
        if (isset($p["id_booking_api"]) && nwMaker::evalueData($p["id_booking_api"])) {
            $ca->prepareUpdate("edo_servicios", $fields, "booking_id_real_journey=':id_booking_api' ");
            $id_booking = $p["id_booking_api"];
            $id = $id_booking;
        } else
        if (isset($p["id"]) && nwMaker::evalueData($p["id"])) {
            $ca->prepareUpdate("edo_servicios", $fields, "id=:id");
            $id = $p["id"];
        } else {
            $id = master::getNextSequence("edo_servicios");
            $ca->prepareInsert("edo_servicios", $fields);
        }
        if ($id_relation_group_travel == "") {
//            $id_relation_group_travel = rand(100000, 999999);
            $id_relation_group_travel = $id;
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":valor_viaje_booking", $valor_viaje_booking);
        $ca->bindValue(":id_relation_group_travel", $id_relation_group_travel);
        $ca->bindValue(":id_booking_api", $id_booking);
        $ca->bindValue(":adjunto_cotizacion", $adjunto_cotizacion);
        $ca->bindValue(":empresa", $empresa, true, true);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":hora", $hora);
        $ca->bindValue(":fecha_creacion", $fecha_creacion);
        $ca->bindValue(":remesa", $remesa);
        $ca->bindValue(":num_personas", $num_personas, true, true);
        $ca->bindValue(":num_maletas", $num_maletas, true, true);
        $ca->bindValue(":id_tarifa", $id_tarifa, true, true);
        $ca->bindValue(":paradas_adicionales_iniciales_creacion", $totalParadas);
        $ca->bindValue(":bodega", $bodega_id);
        $ca->bindValue(":centro_costo_text", $centro_costo_text);
        $ca->bindValue(":centro_costo", $centro_costo, true, true);
        $ca->bindValue(":tarifa", $tipo_tarifa);
        $ca->bindValue(":vehiculo", $vehiculo, true, true);
        $ca->bindValue(":vehiculo_text", $vehiculo_text, true, true);
        $ca->bindValue(":placa", $placa);
        $ca->bindValue(":id_usuario", $usuario, true, true);
        $ca->bindValue(":usuario", $usuario_text, true, true);
        $ca->bindValue(":cliente_nombre", $nombre_usuario);
        $ca->bindValue(":token_usuario", $token_usuario);
        $ca->bindValue(":celular", $celular_usuario);
        $ca->bindValue(":operario", $id_usuario, true, true);
        $ca->bindValue(":operario_text", $usuario_session);
        $ca->bindValue(":lugar_origen", isset($p["lugar_origen"]) == "" ? 0 : $p["lugar_origen"]);
        $ca->bindValue(":subcategoria_servicio", $subcategoria_servicio, true, true);
        $ca->bindValue(":subcategoria_servicio_text", $subcategoria_servicio_text, true, true);
        $ca->bindValue(":datos_vehiculo_elegido", isset($p["datos_vehiculo_elegido"]) == "" ? null : $p["datos_vehiculo_elegido"]);
        $ca->bindValue(":ciudad_origen", $ciudad_origen);
        $ca->bindValue(":pais_origen", $pais_origen);
        $ca->bindValue(":origen", $origen);
        $ca->bindValue(":ciudad_destino", $ciudad_destino);
        $ca->bindValue(":destino", $destino);
        $ca->bindValue(":creado_por_pc", $creado_por_pc);
        $ca->bindValue(":trf", $trf);
        $ca->bindValue(":trf_text", $trf_text);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":conductor_id", $conductor_id, true, true);
        $ca->bindValue(":conductor", $conductor_text, true, true);
        $ca->bindValue(":code_verifi_service", $code_verifi_service, true, true);
        $ca->bindValue(":code_verifi_service_fin", $code_verifi_service_fin, true, true);
        $ca->bindValue(":sentido", $sentido);
        $ca->bindValue(":terminal", $terminal);
        $ca->bindValue(":cliente_empresa_id", $cliente_empresa_id, true, true);
        $ca->bindValue(":cliente_sede_id", $cliente_sede_id, true, true);
        $ca->bindValue(":times_dis_travel_gps", $times_dis_travel_gps);
        $ca->bindValue(":total_metros", $total_metros);
        $ca->bindValue(":bodega_text", $bodega_text);
        $ca->bindValue(":ciudad_conductores_id", $ciudad_conductores_id, true, true);
        $ca->bindValue(":ciudad_conductores_nombre", $ciudad_conductores_nombre, true, true);
        $ca->bindValue(":moneda", $moneda, true, true);
        $ca->bindValue(":observacion_ultima_ubicacion", $comentarios_ubicacion);
        $ca->bindValue(":id_service_initial", $id_service_initial);
        if (isset($p["subservicio"])) {
            $ca->bindValue(":subservicio", $p["subservicio"] == "" ? null : $p["subservicio"]);
            $ca->bindValue(":subservicio_text", $p["subservicio_text"]);
        }
        $ca->bindValue(":fecha_asignacion_para_conductor", $fecha_asignacion_para_conductor, true, true);
        $ca->bindValue(":conductor_usuario", $usuario_cond);
        $ca->bindValue(":tipo_servicio", $servicio_para);
        $ca->bindValue(":servicio", $tipo_servicio);
        $ca->bindValue(":latitudDes", $latitudDes);
        $ca->bindValue(":latitudOri", $latitudOri);
        $ca->bindValue(":longitudDes", $longitudDes);
        $ca->bindValue(":longitudOri", $longitudOri);
        $ca->bindValue(":valor", $valor, true, true);
        $ca->bindValue(":tiempo_estimado", $tiempo_estimado);
        $ca->bindValue(":tiempo", $tiempo);
        $ca->bindValue(":observaciones_servicio", nwMaker::cortaText($observaciones_servicio, 149));
        $ca->bindValue(":vuelo_numero", $vuelo_numero);
        $ca->bindValue(":cod_compra", $cod_compra);
        $ca->bindValue(":booking_id_journey", $booking_id_journey, true, true);
        $ca->bindValue(":booking_id_real_journey", $booking_id_real_journey, true, true);
        $ca->bindValue(":flota_id", $flota_id);
        $ca->bindValue(":flota_text", $flota_text);
        $ca->bindValue(":tipo_pago", $tipo_pago);
        $ca->bindValue(":tipo_pago_id", $tipo_pago_id);
//        $ca->bindValue(":creado_por_pc_id", $creado_por_pc_id);
        $ca->bindValue(":valor_recargo_ruta_fija", $valor_recargo_ruta_fija, true, true);
        $ca->bindValue(":valorbase", $valorbase, true, true);
        $ca->bindValue(":valorminutos", $valorminutos, true, true);
        $ca->bindValue(":valordistancia", $valordistancia, true, true);
        $ca->bindValue(":valor_unidad_tiempo", $valor_unidad_tiempo, true, true);
        $ca->bindValue(":valor_unidad_metros", $valor_unidad_metros, true, true);
        $ca->bindValue(":valor_tarifa_minima", $valor_tarifa_minima, true, true);
        $ca->bindValue(":tipo_urbanrural", $tipo_urbanrural, true, true);
        //carga
        if (isset($p["carga"]) && $p["carga"] == "SI") {
            $ca->bindValue(":numero_auxiliares", $p["numero_auxiliares"]);
            $ca->bindValue(":salida_periferia", $p["salida_periferia"]);
            $ca->bindValue(":despacho", $p["despacho"]);
            $ca->bindValue(":retorno", $p["retorno"]);
            $ca->bindValue(":cargue", $p["cargue"]);
            $ca->bindValue(":descargue", $p["descargue"]);
            $ca->bindValue(":contacto_recogida", $p["contacto_recogida"]);
            $ca->bindValue(":telefono_recogida", $p["telefono_recogida"]);
            $ca->bindValue(":observaciones_recogida", $p["observaciones_recogida"]);
            $ca->bindValue(":contacto_entrega", $p["contacto_entrega"]);
            $ca->bindValue(":telefono_entrega", $p["telefono_entrega"]);
            $ca->bindValue(":observaciones_entrega", $p["observaciones_entrega"]);
            $ca->bindValue(":descripcion_carga", $p["descripcion_carga"]);
            $ca->bindValue(":cantidad", $p["cantidad"]);
            $ca->bindValue(":volumen", $p["volumen"]);
            $ca->bindValue(":peso", $p["peso"]);
            $ca->bindValue(":empaque", $p["empaque"]);
            $ca->bindValue(":valor_declarado", $p["valor_declarado"]);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            return false;
        }
        if (isset($p["parada"]) && $p["parada"] != false) {
            if (count($p["parada"]) > 0) {
                $cb->prepareDelete("edo_servicio_parada", "id_servicio=:id_servicio");
                $cb->bindValue(":id_servicio", $id);
                if (!$cb->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($cb->lastErrorText());
                    return false;
                }

                foreach ($p["parada"] as $d) {

                    $fields = "id,id_servicio,fecha,direccion,usuario,empresa,latitud_parada,longitud_parada,descripcion_carga,estado";
                    $fields .= ",nombre_pasajero,ciudad_parada,correo,documento,telefono,usuario_pasajero,direccion_origen,direccion_destino";
                    $fields .= ",token_usuario,tipo";

                    $nombre_pasajero = "";
                    if (isset($d["nombre_pasajero"])) {
                        $nombre_pasajero = $d["nombre_pasajero"];
                    }

                    $tipo = null;
                    if (isset($d["tipo"])) {
                        $tipo = $d["tipo"];
                    }
                    $ciudad = null;
                    if (isset($d["ciudad"])) {
                        $ciudad = $d["ciudad"];
                    }
                    $correo = null;
                    if (isset($d["correo"])) {
                        $correo = $d["correo"];
                    }
                    $documento = null;
                    if (isset($d["documento"])) {
                        $documento = $d["documento"];
                    }
                    $telefono = null;
                    if (isset($d["telefono"])) {
                        $telefono = $d["telefono"];
                    }
                    $usuario_pasajero = null;
                    if (isset($d["usuario_pasajero"])) {
                        $usuario_pasajero = $d["usuario_pasajero"];
                    }
                    $direccion_origen = null;
                    if (isset($d["direccion_origen"])) {
                        $direccion_origen = $d["direccion_origen"];
                    }
                    $direccion_destino = null;
                    if (isset($d["direccion_destino"])) {
                        $direccion_destino = $d["direccion_destino"];
                    }
                    $token_usuario = null;
                    if (isset($d["token_usuario"])) {
                        $token_usuario = $d["token_usuario"];
                    }
                    if ($token_usuario == null && $usuario_pasajero != null) {
                        $token_usuario = self::tokenPasajeroByUser($usuario_pasajero);
                    }
                    $origen_manual_direccion = null;
                    if (isset($d["origen_manual_direccion"]) && nwMaker::evalueData($d["origen_manual_direccion"])) {
                        $origen_manual_direccion = $d["origen_manual_direccion"];
                        $fields .= ",origen_manual_direccion";
                    }
                    $origen_manual_latitud = null;
                    if (isset($d["origen_manual_latitud"]) && nwMaker::evalueData($d["origen_manual_latitud"])) {
                        $origen_manual_latitud = $d["origen_manual_latitud"];
                        $fields .= ",origen_manual_latitud";
                    }
                    $origen_manual_longitud = null;
                    if (isset($d["origen_manual_longitud"]) && nwMaker::evalueData($d["origen_manual_longitud"])) {
                        $origen_manual_longitud = $d["origen_manual_longitud"];
                        $fields .= ",origen_manual_longitud";
                    }
                    $origen_manual_pais = null;
                    if (isset($d["origen_manual_pais"]) && nwMaker::evalueData($d["origen_manual_pais"])) {
                        $origen_manual_pais = $d["origen_manual_pais"];
                        $fields .= ",origen_manual_pais";
                    }
                    $origen_manual_ciudad = null;
                    if (isset($d["origen_manual_ciudad"]) && nwMaker::evalueData($d["origen_manual_ciudad"])) {
                        $origen_manual_ciudad = $d["origen_manual_ciudad"];
                        $fields .= ",origen_manual_ciudad";
                    }
                    $id_parada = master::getNextSequence("edo_servicio_parada_id_seq", $db);
                    $d["id_parada"] = $id_parada;
                    $d["id_servicio"] = $id;
                    $d["empresa"] = $empresa;
                    $cb->prepareInsert("edo_servicio_parada", $fields);
                    $cb->bindValue(":id", $id_parada);
                    $cb->bindValue(":id_servicio", $id);
                    $cb->bindValue(":fecha", date("Y-m-d H:i:s"));
                    $cb->bindValue(":nombre_pasajero", nwMaker::cortaText($nombre_pasajero, 100));
                    $cb->bindValue(":direccion", nwMaker::cortaText(self::clean_string($d["direccion"]), 100));
                    $cb->bindValue(":latitud_parada", $d["latitud_parada"]);
                    $cb->bindValue(":longitud_parada", $d["longitud_parada"]);
                    $cb->bindValue(":descripcion_carga", $d["descripcion_carga"]);
                    $cb->bindValue(":estado", "SOLICITUD");
//                    $cb->bindValue(":usuario", $p["usuario_text"]);
                    $cb->bindValue(":usuario", $usuario_session);
                    $cb->bindValue(":empresa", $empresa);
                    $cb->bindValue(":ciudad_parada", $ciudad);
                    $cb->bindValue(":correo", $correo);
                    $cb->bindValue(":documento", $documento);
                    $cb->bindValue(":telefono", $telefono);
                    $cb->bindValue(":usuario_pasajero", $usuario_pasajero);
                    $cb->bindValue(":direccion_origen", self::clean_string($direccion_origen));
                    $cb->bindValue(":direccion_destino", self::clean_string($direccion_destino));
                    $cb->bindValue(":token_usuario", $token_usuario);
                    $cb->bindValue(":tipo", $tipo);
                    $cb->bindValue(":origen_manual_direccion", $origen_manual_direccion);
                    $cb->bindValue(":origen_manual_latitud", $origen_manual_latitud);
                    $cb->bindValue(":origen_manual_longitud", $origen_manual_longitud);
                    $cb->bindValue(":origen_manual_pais", $origen_manual_pais);
                    $cb->bindValue(":origen_manual_ciudad", $origen_manual_ciudad);
                    if (!$cb->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error($cb->lastErrorText());
                        return false;
                    }
                    if (isset($d["id"]) && $d["id"] !== "") {
                        $cb->prepareUpdate("edo_enrutamiento", "estado,id_servicio", "id=:id");
                        $cb->bindValue(":id", $d["id"]);
                        $cb->bindValue(":estado", "ENRUTA");
                        $cb->bindValue(":id_servicio", $id);
                        if (!$cb->exec()) {
                            $db->rollback();
                            NWJSonRpcServer::error($cb->lastErrorText());
                            return false;
                        }
                    }
                    if (isset($p["configCliente"]) && nwMaker::evalueData($p["configCliente"])) {
                        if (isset($p["configCliente"]["usa_rotulos_en_paradas"]) && $p["configCliente"]["usa_rotulos_en_paradas"] == "SI") {
                            self::asociaRotulosParada($d);
                        }
                    }
                }
            }
        }

//        $token = Array();
//        if (isset($p["conductor"]) && $p["conductor"] != 0 || isset($p["conductor"]) && $p["conductor"] != "") {
//            $cd->prepare("select * from nwmaker_suscriptorsPush where usuario=:conductor_id and empresa = :empresa and perfil=2 GROUP BY id order by fecha desc");
//            $cd->bindValue(":conductor_id", $p["usuario_cond"]);
//            $cd->bindValue(":empresa", $si["empresa"]);
//        } else {
////            $cd->prepare("select a.json,a.usuario,a.empresa,b.offline from nwmaker_suscriptorsPush a join pv_clientes b ON(a.usuario= b.usuario_cliente and a.empresa=b.empresa) where b.estado_activacion = 1 and a.empresa = :empresa and a.perfil=2 and (b.offline is null or b.offline='online') GROUP BY a.json,a.usuario,a.empresa,b.offline order by a.fecha desc");
//            $f = "a.json,a.usuario,a.empresa,b.offline";
//            $tables = "nwmaker_suscriptorsPush a join pv_clientes b ON(a.usuario= b.usuario_cliente and a.empresa=b.empresa)";
//            $w = "b.estado_activacion = 1 and a.empresa = :empresa and a.perfil=2 and (b.offline is null or b.offline='online') ";
////            $w .= " GROUP BY a.json,a.usuario,a.empresa,b.offline ";
//            $w .= " order by a.fecha desc";
//            $cd->prepareSelect($tables, $f, $w);
//            $cd->bindValue(":empresa", $si["empresa"]);
//        }
//        if (!$cd->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $cd->lastErrorText());
//            return;
//        }
//        $cont = $cd->size();
//        if ($cd->size() > 0) {
//            $res = $cd->assocAll();
//            $token = $res;
//        }

        if (isset($p["servicio_para"]) && $p["servicio_para"] == "reservado") {
            $a = $p;
            $a["empresa"] = $empresa;
            $a["id"] = $id;
            servicios_conductor::sendEmailProccess($a, "RESERVA");
        }

        $es = $p;
        $es["es_cliente"] = $es_cliente;
        $es["fecha"] = $fecha;
        $es["hora"] = $hora;
        $es["empresa"] = $empresa;
        $es["usuario"] = $usuario_session;
        $es["id_cotizacion"] = $id;
        $es["totalParadas"] = $totalParadas;
        if (isset($liquida_fecha)) {
            $es["liquida_fecha"] = $liquida_fecha;
        }
        $es["ciudad_origen"] = $ciudad_origen;
        $es["origen"] = $origen;
        $es["destino"] = $destino;
        $es["ciudad_destino"] = $ciudad_destino;
        $es["destino"] = $destino;
        $es["estado"] = $estado;

        notificaciones::validaNotificaciones($es, $db);

//       

        $li = Array();
        $li["modulo"] = "back:::servicios_totales";
        if (isset($p["id"]) && $p["id"] != "" && $p["id"] != null) {
            $li["accion"] = "Edición de servicio.";
        } else {
            $li["accion"] = "Creación de servicio.";
        }
        $li["comentarios"] = "{$totalParadas} pasajeros. ";
        $li["id_servicio"] = $id;
        $li["empresa"] = $empresa;
        $li["all_data"] = $p;
        lineTime::save($li);

        $db->commit();
//        return $token;
        return $id;
    }

    public static function asociaRotulosParada($p) {
//        session::check();
        if (!nwMaker::evalueData($p["descripcion_carga"])) {
            return false;
        }
//        $si = session::info();
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $cb->prepareUpdate("edo_enrutamiento_rotulos", "id_parada,id_servicio", "numero_guia=:descripcion_carga and empresa=:empresa and id_parada IS NULL and estado IS NULL");
        $cb->bindValue(":descripcion_carga", $p["descripcion_carga"]);
        $cb->bindValue(":id_parada", $p["id_parada"]);
        $cb->bindValue(":id_servicio", $p["id_servicio"]);
        $cb->bindValue(":empresa", $p["empresa"]);
        if (!$cb->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->lastErrorText());
        }
        return true;
    }

    public static function tokenPasajeroByUser($usuario) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $where = "usuario=:usuario and perfil=1 and empresa=:empresa order by id desc limit 1";
        $cb->prepareSelect("nwmaker_suscriptorsPush", "json", $where);
        $cb->bindValue(":usuario", $usuario);
        $cb->bindValue(":empresa", $si["empresa"]);
        if (!$cb->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->lastErrorText());
        }
        if ($cb->size() == 0) {
            return null;
        }
        $r = $cb->flush();
        $token = $r["json"];
        return $token;
    }

    public static function clean_string($string) {
        $string = str_replace("⁰", "", $string);
        return $string;
    }

    public static function getVar($p, $text) {
        $rta = "";
        if (isset($p[$text])) {
            $rta = $p[$text];
        }
        return $rta;
    }

    public static function sendEmailReservation($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_plantillas_servicios", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $plantilla = $ca->flush();

        $ca->prepareSelect("empresas", "logo", "id=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $empresa = $ca->flush();

        $host = $_SERVER["HTTP_HOST"];
        $foto_cond = $host;
        $foto_vehi = $host;
        $host .= $empresa["logo"];

        $fecha_reserva = $p["fecha"] . " " . $p["hora"];

        $mensaje = str_replace("[" . "logo" . "]", $host, $plantilla["plantilla"]);
        $mensaje = str_replace("[" . "fecha_reserva" . "]", $fecha_reserva, $plantilla["plantilla"]);
        $mensaje = str_replace("[" . "foto_cond" . "]", $fecha_reserva, $plantilla["plantilla"]);

        NWJSonRpcServer::console($p);

//        NWJSonRpcServer::information($host);
    }

    public static function tokenUsuario($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $empresa = null;
        $where = "usuario=:usuario_text and perfil=:perfil ";
        if (isset($p["empresa"])) {
            $where .= " and empresa=:empresa ";
            $empresa = $p["empresa"];
        }
        $where .= " order by fecha desc";
        $cb->prepareSelect("nwmaker_suscriptorsPush", "*", $where);
        $cb->bindValue(":usuario_text", $p["usuario"]);
        $cb->bindValue(":empresa", $empresa);
        $cb->bindValue(":perfil", $p["perfil"]);
        if (!$cb->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->lastErrorText());
        }
        return $cb->assocAll();
    }

    public static function alerta($id, $p) {
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        $si = session::info();
        $fechaAviso = date("Y-m-d H:i:s");
        $tipoAviso = "alert";

        $cb->prepareSelect("pv_clientes", "*", "perfil=2");
        if (!$cb->exec()) {
            return "Error ejecutando la consulta: " . $cb->lastErrorText();
        }
        $cont = $cb->size();
        if ($cont > 0) {
            for ($i = 0; $i < $cont; $i++) {
                $res = $cb->flush();
                $mensaje = "<h1>¡Hay un nuevo Servicio!</h1>";
                $mensaje .= "<p>Origen: {$p["origen"]}</p>";
                $mensaje .= "<p>Destino: {$p["destino"]}</p>";
                $mensaje .= "<p><div class='btn-aocc aceptarServicio' data='{$id}' >Aceptar</div><div class='btn-aocc rechazarServicio' data='{$id}' >Rechazar</div></p>";
                nwMaker::crearNotificacion($res["usuario_cliente"], $mensaje, "alert", false, "popup", $fechaAviso, $tipoAviso);
            }
        }
        return true;
    }

    public static function populateParadas($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "servicio=:id and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL) ";
        $ca->prepareSelect("edo_servicio_parada", "*", $where);
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function consultaNav($p) {
//        NWJSonRpcServer::console($p);
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        $where .= "id_conductor=:id";
        $ca->prepareSelect("edo_documentos_conductor", "*", $where);
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function eliminarParada($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_servicio_parada", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function populate($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("trans_modelo", "id,nombre", "marca=:marca");
        $ca->bindValue(":marca", $p, false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function cancelar($p) {
        $p = nwMaker::getData($p);
        $si = session::info();
        $perfil = null;
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
        } else
        if (isset($si["perfil"])) {
            $perfil = $si["perfil"];
        }
//         NWJSonRpcServer::console($perfil);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        //usuario
        if ($perfil == "1") {
            $ca->prepareUpdate("edo_servicios", "estado=:estado,observacion_cancelado_usu=:fields", "id=:id");
            $cancelap = "CANCELADO_POR_USUARIO";
            //Conductor
        } if ($perfil == "2") {
            $ca->prepareUpdate("edo_servicios", "estado=:estado,observacion_cancelado_con=:fields", "id=:id");
            $cancelap = "CANCELADO_POR_CONDUCTOR";
            //Administrador
        } if ($perfil == "3" || $perfil == "1229") {
            $ca->prepareUpdate("edo_servicios", "estado=:estado,observacion_cancelado_adm=:fields", "id=:id");
            $cancelap = "CANCELADO_POR_ADMIN";
        } else {
            return "No cuenta con permisos para cancelar";
        }
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":fields", $p["observacion"]);
        $ca->bindValue(":estado", $cancelap);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if (isset($p["conductor_id"]) && $p["conductor_id"] !== null && $p["conductor_id"] !== "" && $p["conductor_id"] !== false) {
            $ca->prepareUpdate("pv_clientes", "ocupado", "id=:conductor_id");
            $ca->bindValue(":conductor_id", $p["conductor_id"]);
            $ca->bindValue(":ocupado", "NO");
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
        }
        return true;
    }

    public static function actualizaEstadoServicio($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fin = $p["estado_nuevo"];
        $libera_conductor = $p["libera_conductor"];
        $fe = "estado,cancelado_notas";
        if ($libera_conductor === "SI") {
            $fe .= ",estado_final,hora_fin_servicio";
//            $fe .= ",valor_total_servicio";
        }
        $ca->prepareUpdate("edo_servicios", $fe, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", $fin);
        $ca->bindValue(":cancelado_notas", $p["observacion"]);
//        $ca->bindValue(":valor_total_servicio", $p["valor"], true, true);
        $ca->bindValue(":hora_fin_servicio", date("H:i:s"));
        $ca->bindValue(":estado_final", $fin);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($libera_conductor === "SI" && nwMaker::evalueData($p["conductor_id"])) {
            if (isset($p["conductor_id"]) && $p["conductor_id"] !== null && $p["conductor_id"] !== "" && $p["conductor_id"] !== false) {
                $ca->prepareUpdate("pv_clientes", "ocupado", "id=:conductor_id");
                $ca->bindValue(":conductor_id", $p["conductor_id"]);
                $ca->bindValue(":ocupado", "NO");
                if (!$ca->exec()) {
                    NWJSonRpcServer::error($ca->lastErrorText());
                    return false;
                }
            }
        }

        $book = booking::updateStatusTravel($p);

        $li = Array();
        $li["id_servicio"] = $p["id"];
        $li["modulo"] = "back:::servicios_totales:::click derecho, cambiar estado.";
        $li["accion"] = "Cambio de estado a {$fin}";
        $li["comentarios"] = "Comentarios: {$p["observacion"]} ::: ";
        if ($libera_conductor === "SI") {
            if (isset($p["conductor_id"]) && $p["conductor_id"] !== null && $p["conductor_id"] !== "" && $p["conductor_id"] !== false) {
                $li["comentarios"] .= " ::: Actualización de conductor ID {$p["conductor_id"]} a ocupado='NO' ";
            }
        }
        $li["all_data"] = $p;
        lineTime::save($li);

//        return true;
        return $book;
    }

    public static function finalizarServi($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "estado=:estado,cancelado_notas=:observacion,valor_total_servicio=:valor_total_servicio,estado_final=:estado_final,hora_fin_servicio=:hora_fin_servicio ", "id=:id");
        $fin = "LLEGADA_DESTINO";
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":observacion", $p["observacion"]);
        $ca->bindValue(":hora_fin_servicio", date("H:i:s"));
        $ca->bindValue(":valor_total_servicio", $p["valor"]);
        $ca->bindValue(":estado", $fin);
        $ca->bindValue(":estado_final", "COBRADO_FINALIZADO");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if (isset($p["conductor_id"]) && $p["conductor_id"] !== null && $p["conductor_id"] !== "" && $p["conductor_id"] !== false) {
            $ca->prepareUpdate("pv_clientes", "ocupado", "id=:conductor_id");
            $ca->bindValue(":conductor_id", $p["conductor_id"]);
            $ca->bindValue(":ocupado", "NO");
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
        }
        return true;
    }

    public static function save_favoritos($data) {
        $p = $data["data"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("trans_app_favoritos", "usuario,empresa,fecha,direccion,nombre");
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }
        return true;
    }

    public static function guardarAdjuntos($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($si);
//        return;
        $bodega = "";
        if (isset($si["bodega"])) {
            $bodega = ",bodega";
        }
        $ca->prepareInsert("edo_adjuntos", "nombre,descripcion,adjunto,fecha,usuario,empresa" . $bodega);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":descripcion", $p["descripcion"]);
        $ca->bindValue(":adjunto", $p["adjunto"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (isset($si["bodega"])) {
            $ca->bindValue(":bodega", $si["bodega"]);
        }
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }
        return true;
    }

    public static function consultaAdjuntos($p) {
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "empresa=:empresa";
        if (isset($si["bodega"])) {
            $where .= " and bodega=:bodega ";
            $ca->bindValue(":bodega", $si["bodega"]);
        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["fecha_inicio"])) {
                if ($p["filters"]["fecha_inicio"] != "" && $p["filters"]["fecha_final"] != "") {
                    $where .= " and Date(fecha) between :fecha_inicio and :fecha_final";
                    $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicio"]);
                    $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
                }
            }
            if (isset($p["filters"]["cliente"]) && $p["filters"]["cliente"] != "") {
                $where .= " and bodega=" . $p["filters"]["cliente"];
            }
        }
        $ca->prepareSelect("edo_adjuntos", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function populateTokenEmpresaCliente($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa";
        if ($p["token"] != "") {
            $where .= " and (lower(nombre) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("edo_empresas", "id,nombre", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function saveTareasAdic($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($p);
//        return;
        $bodega = "";
        if (isset($si["bodega"])) {
            $bodega = ",bodega";
        }
        $ca->prepareInsert("edo_adicionales_servicio", "usuario,empresa,fecha,caracteristicas,id_service,leido" . $bodega);
        $ca->bindValue(":id_service", $p["id"]);
        $ca->bindValue(":caracteristicas", $p["caracteristicas"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":leido", 'NO');
        if (isset($si["bodega"])) {
            $ca->bindValue(":bodega", $si["bodega"]);
        }
//        NWJSonRpcServer::console($ca->preparedQuery());
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }

        $body_notify = "Tienes una nueva tarea para este servicio revisa el etalle del servicio para mas información.";

        $asunto = "Nueva tarea";

        $a = Array();
        $a["correo_usuario_recibe"] = $p["conductor_usuario"];
        $a["destinatario"] = $p["conductor_usuario"];
        $a["titleMensaje"] = $asunto;
        $a["sms_body"] = $body_notify;
        $a["body"] = $body_notify;
        $a["body_email"] = $body_notify;
        $a["tipo"] = "infoTarea";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = date("Y-m-d H:i:s");
        $a["tipoAviso"] = "driver";
        $a["id_objetivo"] = $p["id"];
        $a["foto"] = "";
        $a["usuario_envia"] = $p["conductor_usuario"];
        $a["sendEmail"] = false;
        $a["sendNotifyPush"] = true;
        $a["celular"] = false;
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["fromName"] = $p["enviado_por"];
        $a["fromEmail"] = $p["enviado_por_correo"];
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
        return true;
    }

    public static function consultaTareasAdic($p) {
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("edo_adicionales_servicio", "*", "id_service=:id_service and empresa=:empresa");
        $ca->bindValue(":id_service", $p["id_service"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function consultaFavoritos($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("trans_app_favoritos", "*", "usuario_favorito=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function consultaPrecioServicio($data) {
        $p = $data["data"];
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("transmov_precios ", "* ", ":km BETWEEN kilometros_min AND kilometros_max and tipo = :tipo");
        $ca->bindValue(":km", $p["km"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->flush();
    }

    public static function comentarios_operarios($data) {
        $p = $data["data"];
//        print_r($p);
//        return;
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("trans_comentario_operario", "fecha,id_servicio,id_operario,operario_text,comentario,usuario");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":id_servicio", $p["dataService"]["id"]);
        $ca->bindValue(":id_operario", $p["dataService"]["conductor"]);
        $ca->bindValue(":operario_text", $p["dataService"]["conductor_text"]);
        $ca->bindValue(":comentario", $p["comentario"]["descripcion"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }
    }

    public static function calificar_operario($data) {
        $p = $data["data"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("nwmaker_puntaje_historico", "usuario,fecha,calificacion,usuario_califica");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":calificacion", $p["calificacion"]);
        $ca->bindValue(":usuario_califica", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }

        $ca->prepareSelect("nwmaker_puntaje_historico", "calificacion", "usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }

        $t = 0;
        if ($ca->size() > 0) {
            for ($i = 0; $i < $ca->size(); $i++) {
                $r = $ca->flush();
                $t += $r["calificacion"];
            }
        }

        $puntos = $t / $ca->size();

        $ca->prepareUpdate("pv_clientes", "puntaje", "usuario_cliente=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":puntaje", $puntos);
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }
        return true;
    }

    public static function consultaPlacasUsuario($p) {
        session::check();
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepare("select *, placa as nombre from  edo_vehiculos where id_usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
//        WJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function rechazarCotizacion($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();

        $si = session::getInfo();
//        NWJSonRpcServer::console($p);
        $fields = "estado,motivo_rechazo,motivo_rechazo_text,fecha_rechazo,observaciones_rechazo";
        $ca->prepareUpdate("edo_servicios", $fields, "id = :id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", 'COTIZACION_RECHAZADA');
        $ca->bindValue(":motivo_rechazo", $p["motivo_rechazo"]);
        $ca->bindValue(":motivo_rechazo_text", $p["motivo_rechazo_text"]);
        $ca->bindValue(":fecha_rechazo", $p["fecha"]);
        $ca->bindValue(":observaciones_rechazo", $p["observaciones"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        $es = $p;
        $es["plantilla"] = "RESPUESTA_COTIZACION_CLIENTE";
        $es["estado"] = "COTIZACION_RECHAZADA";
        $es["empresa"] = $si["empresa"];
        notificaciones::notificacionesAprobacion($es, $db);

        $db->commit();

        return true;
    }

    public static function aprobarCotizacion($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();

//        NWJSonRpcServer::console($p);
        $fields = "estado,adjunto_cotizacion_aprobada,numero_expediente";
        $ca->prepareUpdate("edo_servicios", $fields, "id = :id");
        $ca->bindValue(":id", $p["data_service"]["id"]);
        $ca->bindValue(":estado", 'COTIZACION_APROBADA');
        $ca->bindValue(":adjunto_cotizacion_aprobada", $p["adjunto"]);
        $ca->bindValue(":numero_expediente", $p["numero_expediente"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        $es = $p;
        $es["id"] = $p["data_service"]["id"];
        $es["plantilla"] = "RESPUESTA_COTIZACION_CLIENTE";
        $es["estado"] = "COTIZACION_APROBADA";
        $es["empresa"] = $si["empresa"];

        notificaciones::notificacionesAprobacion($es, $db);

        $db->commit();

        return true;
    }
}

?>
