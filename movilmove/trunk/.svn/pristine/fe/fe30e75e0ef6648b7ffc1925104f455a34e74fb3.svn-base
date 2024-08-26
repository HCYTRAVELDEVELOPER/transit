<?php

class servicios {

    public static function getTokensByChat($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $id = $p["id"];
        $usuario_pasajero = null;
        $usuario_conductor = null;
        $name_pasajero = null;
        $name_conductor = null;
        if ($p["es_parada"] == "SI") {
            $ca->prepareSelect("edo_servicio_parada", "id_servicio,usuario_pasajero,nombre_pasajero", "id=:id");
            $ca->bindValue(":id", $id);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
                return "No existe la parada o pasajero";
            }
            $par = $ca->flush();
            $usuario_pasajero = $par["usuario_pasajero"];
            $id = $par["id_servicio"];
            $name_pasajero = $par["nombre_pasajero"];
        }
        $ca->prepareSelect("edo_servicios", "id,usuario,conductor_usuario,conductor,conductor_foto,cliente_nombre,fecha,hora", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return "No existe el viaje";
        }
        $enc = $ca->flush();
        $name_conductor = $enc["conductor"];
        $foto_conductor = $enc["conductor_foto"];
        if (!nwMaker::evalueData($name_pasajero)) {
            $name_pasajero = $enc["cliente_nombre"];
        }
        if ($usuario_pasajero == null && nwMaker::evalueData($enc["usuario"])) {
            $usuario_pasajero = $enc["usuario"];
        }
        if (nwMaker::evalueData($enc["conductor_usuario"])) {
            $usuario_conductor = $enc["conductor_usuario"];
        }
        if ($usuario_pasajero == null) {
            return "pasajero_no_configurado";
        }

        $where = "empresa=:empresa  ";
//        $where .= " and (usuario=:usuario_conductor and perfil=2 or usuario=:usuario_pasajero and perfil=1) ";
        if ($p["perfil"] == "1") { //pax searching drivers tokens
            $where .= " and usuario=:usuario_conductor and perfil=2 ";
        } else
        if ($p["perfil"] == "2") { //driver searching pax tokens
            $where .= " and usuario=:usuario_pasajero and perfil=1 ";
        } else
        if ($p["perfil"] == "admin") { //driver and pax searching tokens by admin
            $where .= " and (usuario=:usuario_pasajero and perfil=1 or usuario=:usuario_conductor and perfil=2) ";
        } else {
            return "No se está enviando el perfil a consultar, comuníquese con el administrador del sistema.";
        }
        $where .= " order by fecha desc limit 10";
        $ca->prepareSelect("nwmaker_suscriptorsPush", "DISTINCT json as token,usuario,perfil,fecha,device,empresa", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario_conductor", $usuario_conductor);
        $ca->bindValue(":usuario_pasajero", $usuario_pasajero);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $t = $ca->size();
        if ($t == 0) {
            return "No existen tokens de envío, el usuario no ha iniciado sesión en la app.";
        }
        $all = $ca->assocAll();
        $res = Array();
        for ($i = 0; $i < $t; $i++) {
            $res[$i] = $all[$i];
            $res[$i]["id_servicio_fecha"] = $enc["fecha"];
            $res[$i]["id_servicio_hora"] = $enc["hora"];
            $res[$i]["id_viaje"] = $enc["id"];
            if ($p["es_parada"] == "SI") {
                $res[$i]["id_parada"] = $id;
            }
            if ($all[$i]["usuario"] == $usuario_conductor) {
                $res[$i]["nombre"] = $name_conductor;
                $res[$i]["foto"] = $foto_conductor;
            } else
            if ($all[$i]["usuario"] == $usuario_pasajero) {
                $res[$i]["nombre"] = $name_pasajero;
            }
        }
//        return $ca->assocAll();
        return $res;
    }

    public static function consultaPOsitionCond($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_users_geo", "latitud,longitud,hora,fecha", "id_servicio=:id_servicio order by hora asc");
        $ca->bindValue(":id_servicio", $p["id"]);
//        print_r($ca->preparedQuery());
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function validateActiveCompany($empresa) {
        if ($empresa === "5") {
            return false;
        }
        return true;
    }

    public static function validaFuecPorTipo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_vehiculos", "vehiculo_publico_particular", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function getServiceByID($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $ca->prepareSelect("edo_servicios a left join pv_clientes b ON(a.conductor_id=b.id)", "a.*,b.latitud as conductor_latitud,b.longitud as conductor_longitud", "a.id=:id");
        $ca->prepareSelect("edo_servicios a", "a.*", "a.id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function actualizaParada($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $ca->prepareUpdate("edo_servicio_parada", "direccion,descripcion_carga,latitud_parada,longitud_parada,nombre_pasajero", "id=:id and id_servicio=:id_servicio");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":id_servicio", $p["id_servicio"]);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":descripcion_carga", $p["descripcion_carga"]);
        $ca->bindValue(":latitud_parada", $p["latitud"]);
        $ca->bindValue(":longitud_parada", $p["longitud"]);
        $ca->bindValue(":nombre_pasajero", $p["nombre_pasajero"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function eliminaParada($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_servicio_parada", "id=:id and id_servicio=:id_servicio");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":id_servicio", $p["id_servicio"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return true;
    }

    public static function saveParada($data) {
        $p = nwMaker::getData($data);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $id_parada = master::getNextSequence("edo_servicio_parada_id_seq", $db);
        $fields = "id,id_servicio,fecha,direccion,usuario,empresa,latitud_parada,longitud_parada,descripcion_carga,estado,nombre_pasajero";
        $ca->prepareInsert("edo_servicio_parada", $fields);
        $ca->bindValue(":id", $id_parada);
        $ca->bindValue(":id_servicio", $p["id_servicio_edit"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":latitud_parada", $p["latitud"]);
        $ca->bindValue(":longitud_parada", $p["longitud"]);
        $ca->bindValue(":descripcion_carga", $p["descripcion_carga"]);
        $ca->bindValue(":estado", "SOLICITUD");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":nombre_pasajero", $p["nombre_pasajero"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function updateServiceFecha($data) {
        $p = nwMaker::getData($data);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "fecha,hora", "empresa=:empresa and usuario=:usuario and id=:id_servicio_edit");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":id_servicio_edit", $p["id_servicio_edit"]);
        $ca->bindValue(":fecha", $p["fecha"]);
        $ca->bindValue(":hora", $p["hora"]);
        if (!$ca->exec()) {
            return nwMaker::error("Ha ocurrido un error! Log: " . $ca->lastErrorText());
        }
        if (isset($p["conductor_usuario"])) {
            $a = Array();
            $a["celular"] = null;
            $a["send_sms"] = false;
            $a["cleanHtml"] = false;
            $a["fromName"] = "ServiceMovilmove";
            $a["fromEmail"] = "ServiceMovilmove";
            $a["correo_usuario_recibe"] = $p["conductor_usuario"];
            $a["destinatario"] = $p["conductor_usuario"];
            $a["titleMensaje"] = "Reprogramación de viaje";
            $a["body"] = "El usuario {$p["nombre"]} @{$p["usuario"]} ha reprogramado su viaje, revisa tu agenda en viajes próximos.";
            $a["body_email"] = $a["body"];
            $a["tipo"] = "reprgSer";
            $a["link"] = null;
            $a["modo_window"] = "popup";
            $a["insertaEnTabla"] = true;
            $a["fechaAviso"] = $hoy;
            $a["tipoAviso"] = "system";
            $a["sendEmail"] = true;
            $a["id_objetivo"] = null;
            $a["usuario_envia"] = $p["usuario"];
            $a["sendNotifyPush"] = true;
            $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
            $n = nwMaker::notificacionNwMaker($a);
            if ($n !== true) {
                $db->rollback();
                nwMaker::error($n);
                return $n;
            }
        }
        return true;
    }

    public static function updateServiceDirOrigen($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicios", "valor,destino,ciudad_destino,latitudDes,longitudDes", "empresa=:empresa and usuario=:usuario and id=:id_servicio_edit");
//        $ca->bindValue(":estado", "INACTIVO");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
//        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":id_servicio_edit", $p["id_servicio_edit"]);
        $ca->bindValue(":valor", $p["valor_estimado"]);
        $ca->bindValue(":destino", $p["destino"]);
        $ca->bindValue(":ciudad_destino", $p["ciudad_destino"]);
        $ca->bindValue(":latitudDes", $p["latitudDes"]);
        $ca->bindValue(":longitudDes", $p["longitudDes"]);
//        print_r($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consultaSaldo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_planes", "*", "empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaCuponesActive($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];

        $fields = "id,cupon as nombre,tipo as tipo_descuento,valor,fecha_expiracion,descripcion,estado,servicio,ciudad,quemar_cupon,id_cupon";
        $where = "empresa=:empresa and fecha_expiracion>=:fecha and perfil=:perfil and estado=:estado and valor>0 ";
        $ca->prepareSelect("edo_cupones_redimidos", $fields, $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":estado", 'ACTIVO');
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();

        $ca->prepareSelect("edo_cupones", "servicio,tipo_descuento", "id=:id_cupon and fecha_expiracion>=:fecha and valido_para_usuario='SI' and activo='SI' ");
        $ca->bindValue(":id_cupon", $r["id_cupon"]);
        $ca->bindValue(":fecha", $hoy);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $rs = $ca->flush();
        $r["servicio"] = $rs["servicio"];
        $r["tipo_descuento"] = $rs["tipo_descuento"];
        $r["tipo"] = $rs["tipo"];

        return $r;
    }

    public static function consultaCupones($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $ca = new NWDbQuery($db);
        $sql = "select id,nombre,tipo_descuento,valor,fecha_expiracion,descripcion,'INACTIVO' as estado,ciudad,servicio,quemar_cupon from edo_cupones a "
                . "where empresa=:empresa and fecha_expiracion >= :fecha and valido_para_usuario=:valido_para_usuario  and activo='SI' "
                . " and (SELECT id FROM edo_cupones_redimidos WHERE id_cupon=a.id and usuario=:usuario and perfil=:perfil) is null"
                . " UNION  select id,cupon as nombre,tipo as tipo_descuento,valor,fecha_expiracion,descripcion,estado,ciudad,servicio,quemar_cupon"
                . " from edo_cupones_redimidos where empresa=:empresa and fecha_expiracion >= :fecha and perfil=:perfil and usuario=:usuario and estado='ACTIVO' and valor>0  "
                . " and (estado <> :estado and estado <> :estado_dos) order by estado asc";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":estado", "SIN SALDO");
        $ca->bindValue(":estado_dos", "QUEMADO");
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":valido_para_usuario", 'SI');
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":usuario", $p["usuario"]);
//        print_r($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function updateCupon($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $ca->prepareUpdate("edo_cupones_redimidos", "estado", "estado='ACTIVO' and empresa=:empresa and usuario=:usuario and perfil=:perfil");
        $ca->bindValue(":estado", "INACTIVO");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $ca->prepareSelect("edo_cupones", "*", "nombre=:nombre and empresa=:empresa and fecha_expiracion>=:fecha");
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $r = $ca->flush();

        $ca->prepareSelect("edo_cupones_redimidos", "id", "cupon=:nombre and usuario=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $h = $ca->flush();
            $ca->prepareUpdate("edo_cupones_redimidos", "estado", "id=:id");
            $ca->bindValue(":id", $h["id"]);
            $ca->bindValue(":estado", "ACTIVO");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":usuario", $p["usuario"]);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
            $db->commit();
            return true;
        }
        $ca->prepareInsert("edo_cupones_redimidos", "usuario,cupon,fecha,empresa,perfil,valor,tipo,descripcion,fecha_expiracion,estado,id_cupon,ciudad,servicio,quemar_cupon,valor_inicial");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":cupon", $p["nombre"]);
        $ca->bindValue(":id_cupon", $r["id"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":tipo", $p["tipo_descuento"]);
        $ca->bindValue(":valor", $p["valor"]);
        $ca->bindValue(":valor_inicial", $p["valor"]);
        $ca->bindValue(":descripcion", $p["descripcion"]);
        $ca->bindValue(":estado", 'ACTIVO');
        $ca->bindValue(":fecha_expiracion", $p["fecha_expiracion_format"]);
        $ca->bindValue(":ciudad", $p["ciudad"] == "" ? 0 : $p["ciudad"]);
        $ca->bindValue(":servicio", $p["servicio"] == "" ? 0 : $p["servicio"]);
        $ca->bindValue(":quemar_cupon", $p["quemar_cupon"]);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function populateTareasAdicionales($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_adicionales_servicio", "*", "id_service=:id_service and empresa=:empresa and leido=:leido");
        $ca->bindValue(":id_service", $p["id_service"]);
        $ca->bindValue(":leido", 'NO');
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $tarea = $ca->flush();

        $ca->prepareUpdate("edo_adicionales_servicio", "leido", "id=:id");
        $ca->bindValue(":leido", "SI");
        $ca->bindValue(":id", $tarea["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $tarea;
    }

    public static function populateFavoritos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_favoritos", "*", "usuario=:usuario order by tipo desc, agregado_especial desc, id desc limit 6 ");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaBodega($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "bodega", "id=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["id_usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
//        print_r($ca->preparedQuery());
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function reportarNovedad($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $estado = "";
        if (isset($p["estado"])) {
            $estado = ",estado";
        }
        $ca->prepareInsert("edo_novedades", "id_usuario,usuario,empresa,perfil,id_viaje,fecha,comentario,adjunto" . $estado);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":id_viaje", $p["id_viaje"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":comentario", $p["comentario"]);
        $ca->bindValue(":adjunto", $p["adjunto"]);
        if (isset($p["estado"])) {
            $ca->bindValue(":estado", $p["estado"]);
        }
//        print_r($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function notService($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cancelado_notas = 'El servicio no ha sido atendido oportunamente.';
        if (isset($p["cancelado_notas"])) {
            $cancelado_notas = $p["cancelado_notas"];
        }
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $ca->prepareUpdate("edo_servicios", "estado,cancelado_fecha,cancelado_motivo,cancelado_notas,usuario_cancela", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario_cancela", $p["usuario"]);
        $ca->bindValue(":estado", "SIN_ATENDER");
        $ca->bindValue(":cancelado_fecha", $hoy);
        $ca->bindValue(":cancelado_motivo", 'NO_ATENDIDO');
        $ca->bindValue(":cancelado_notas", $cancelado_notas);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $li = Array();
        $li["modulo"] = "system:::SIN_ATENDER";
        $li["accion"] = "Cambio de estado SIN_ATENDER.";
        $li["comentarios"] = "Fecha dispositivo: {$hoy}. cancelado_motivo: NO_ATENDIDO -  cancelado_notas: {$cancelado_notas}";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 1;
        $li["all_data"] = $p;
        lineTime::save($li);

        return true;
    }

    public static function consulta_historico_servicios($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $isDriver = false;
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        if (isset($p["perfil"])) {
            if ($p["perfil"] === "2") {
                $isDriver = true;
            }
        }
        $where = " empresa=:empresa ";
        if (!$isDriver) {
            $where .= " and usuario=:usuario ";
        } else {
            $where .= " and conductor_usuario=:usuario ";
        }
        if ($p["estado"] === "ACTIVOS") {
            $where .= " and estado in('EN_RUTA','ABORDO','EN_SITIO') ";
        } else
        if ($p["estado"] === "PASADOS") {
            $where .= " and (estado='CANCELADO_POR_USUARIO' or estado='LLEGADA_DESTINO' or estado='CANCELADO_POR_CONDUCTOR') ";
        } else
        if ($p["estado"] === "RESERVADO") {
            if ($isDriver === true) {
                $where .= " and estado='ACEPTADO_RESERVA' ";
            } else {
                $where .= " and (tipo_servicio='reservado' or estado in('SOLICITUD')) ";
            }
        }
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= " and fecha between :fecha_inicio and :fecha_fin and estado='LLEGADA_DESTINO'";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
            }
        }
        $where .= " order by id desc limit 200";
        $ca->prepareSelect("edo_servicios", "*,CONCAT(fecha, ' ', hora) as fecha_hora,id_usuario as id_cliente", $where);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $r = Array();
        if (!$isDriver) {
            $r = self::getViajesParadas($p);
        }
        $total = $ca->size();
        if ($total > 0) {
            for ($i = 0; $i < $total; $i++) {
                $r[] = $ca->flush();
            }
        }
//        return $ca->assocAll();
        return $r;
    }

    public static function getViajesParadas($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "a.usuario_pasajero=:usuario and a.empresa=:empresa ";
        if ($p["estado"] === "ACTIVOS") {
            $where .= " and b.estado in('EN_RUTA','ABORDO','EN_SITIO') ";
        } else
        if ($p["estado"] === "PASADOS") {
            $where .= " and (b.estado='CANCELADO_POR_USUARIO' or b.estado='LLEGADA_DESTINO' or b.estado='CANCELADO_POR_CONDUCTOR') ";
        } else
        if ($p["estado"] === "RESERVADO") {
            if ($isDriver === true) {
                $where .= " and b.estado='ACEPTADO_RESERVA' ";
            } else {
//                $where .= " and (tipo_servicio='reservado' or estado in('SOLICITUD')) ";
            }
        }
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= " and b.fecha between :fecha_inicio and :fecha_fin ";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
            }
        }
        $where .= " order by a.id desc limit 200";
        $fields = "b.*,a.id as id_parada,a.id_servicio as id";
        $fields .= ",a.direccion_origen as origen,a.direccion_destino as destino";
        $fields .= ",'SI' as es_parada,b.estado as estado";
        $fields .= ",CONCAT(b.fecha, ' ', b.hora) as fecha_hora,b.id_usuario as id_cliente";
        $tables = "edo_servicio_parada a inner join edo_servicios b on(a.id_servicio=b.id)";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $r = Array();
        if ($ca->size() > 0) {
            $r = $ca->assocAll();
        }
        return $r;
    }

    public static function conduActicos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "id", "offline=:offline and empresa=:empresa and perfil=2 limit 1");
        $ca->bindValue(":offline", "activo");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            return true;
        }
    }

    public static function actualizaVencidos($data) {
        $p = nwMaker::getData($data);
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
        $t = count($p["vencidos"]);
        for ($i = 0; $i < $t; $i++) {
            $d = $p;
            $d["id"] = $p["vencidos"][$i];
            $d["usuario"] = "system";
            $d["cancelado_notas"] = "Servicio cancelado por el sistema automáticamente, nadie atendió el servicio.";
            self::notService($d);
        }
        return true;
    }

    public static function servicioActivoUser($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $fecha_hora = nwMaker::sumaRestaFechasByFecha("-2 hour", "+0 minute", "+0 second", $hoy);
//        if ($p["empresa"] == "28") {
//            $fecha_hora = $hoy;
//        }

        $minutesToCali = "1440"; //24 hours
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["pasajero_minutos_para_calificar_servicio"])) {
                if (nwMaker::evalueData(($p["configCliente"]["pasajero_minutos_para_calificar_servicio"]))) {
                    $minutesToCali = $p["configCliente"]["pasajero_minutos_para_calificar_servicio"];
                }
            }
        }
        $fecha_hora_para_calificar = nwMaker::sumaRestaFechasByFecha("-0 hour", "-{$minutesToCali} minute", "+0 second", $hoy);

        $join1 = "";
        $fields_join1 = "";
        if (isset($p["getDataGeoDriver"])) {
            $join1 = " left join pv_clientes b ON(a.conductor_id=b.id) ";
            $fields_join1 = ",b.latitud as driver_latitud,b.longitud as driver_longitud,b.puntaje";
        }
        //para usuarios pasajeros no principales de viaje
        $traePasajeroNoPrincipal = false;
        if (isset($p["configCliente"])) {
            if (isset($p["configCliente"]["app_cliente_trae_pasajeros_vista_principal"]) && $p["configCliente"]["app_cliente_trae_pasajeros_vista_principal"] == "SI") {
                $traePasajeroNoPrincipal = true;
            }
        }
//        $traePasajeroNoPrincipal = false;
        $join2 = "";
        $join2_fields = "";
        $where = "a.usuario=:usuario and a.empresa=:empresa ";
        if ($traePasajeroNoPrincipal) {
//            $where = "1=1 and (a.usuario=:usuario or (c.usuario_pasajero=:usuario and c.estado='SOLICITUD' ))";
            $where = " a.empresa=:empresa ";
            $where .= " and (a.usuario=:usuario or c.usuario_pasajero=:usuario) ";
//            $where .= " and c.estado !='CANCELADO_POR_CLIENTE' ";
//            $join2 = " left join edo_servicio_parada c on(a.id=c.id_servicio)";
            $join2 = " left join edo_servicio_parada c on(a.id=c.id_servicio and c.estado !='CANCELADO_POR_CLIENTE' and a.estado !='SOLICITUD' and c.calificacion_a_conductor IS NULL and c.usuario_pasajero=:usuario) ";
            $join2_fields = ",c.id as id_parada,c.estado as estado_parada";
            $join2_fields .= ",c.calificacion_a_conductor as calificacion_conductor ";
            $join2_fields .= ",c.usuario_pasajero ";
//            $join2_fields .= ",CASE WHEN (a.calificacion_conductor ='' or a.calificacion_conductor IS NULL) THEN c.calificacion_a_conductor
//                              ELSE a.calificacion_conductor
//                              END AS calificacion_conductor";
            $join2_fields .= ",CASE WHEN (c.latitud_parada !='' or c.latitud_parada IS NOT NULL) THEN c.latitud_parada
                              ELSE a.latitudOri
                              END AS latitudOri";
            $join2_fields .= ",CASE WHEN (c.longitud_parada !='' or c.longitud_parada IS NOT NULL) THEN c.longitud_parada
                              ELSE a.longitudOri
                              END AS longitudOri";
            $join2_fields .= ",CASE ";
            $join2_fields .= " WHEN (a.estado ='EN_SITIO' and c.estado ='SOLICITUD') THEN 'EN_RUTA'";
            $join2_fields .= " WHEN (a.estado ='LLEGADA_DESTINO' || 'CANCELADO_POR_ADMIN' || 'CANCELADO_POR_CONDUCTOR' || 'CANCELADO_POR_USUARIO') THEN 'LLEGADA_DESTINO'";
            $join2_fields .= " WHEN (c.estado ='CANCELADO_POR_CLIENTE' and a.estado !='SOLICITUD') THEN 'CANCELADO_POR_CLIENTE' ";
            $join2_fields .= " WHEN (c.estado ='REPARTO') THEN 'EN_RUTA'";
//            $join2_fields .= " WHEN (c.estado ='ENTREGADO') THEN 'ABORDO'";
            $join2_fields .= " WHEN (c.estado ='ENTREGADO') THEN 'LLEGADA_DESTINO'";
            $join2_fields .= " WHEN (c.estado ='REPARTO_DETENIDO') THEN 'EN_SITIO'";
            $join2_fields .= " WHEN (c.estado ='NOVEDAD') THEN 'LLEGADA_DESTINO'";
            $join2_fields .= " WHEN (c.estado ='SOLICITUD' and a.estado ='EN_RUTA' || c.estado ='SOLICITUD' and a.estado ='ABORDO') THEN 'EN_RUTA'";
            $join2_fields .= " ELSE a.estado";
            $join2_fields .= " END AS estado";
        }
        $where .= " and (a.estado='SOLICITUD' and (a.tipo_servicio!='reservado' or a.ofertado='SI') ";
        $where .= " or a.estado='EN_RUTA' and a.conductor_id IS NOT NULL ";
        $where .= " or a.estado='EN_SITIO' and a.conductor_id IS NOT NULL ";
        $where .= " or a.estado='ABORDO' and a.conductor_id IS NOT NULL ";
        $where .= " or a.estado='CANCELADO_POR_CONDUCTOR' and a.conductor_id IS NOT NULL and a.calificacion_conductor IS NULL and CONCAT(a.fecha, ' ', a.hora) >= :fecha_hora  ";
        $where .= " or a.estado='LLEGADA_DESTINO' and a.calificacion_conductor IS NULL and CONCAT(a.fecha, ' ', a.hora) >= :fecha_hora_para_calificar "
                . "   ) ";
//        $where .= " and a.calificacion_conductor IS NULL ";
//        $where .= " and (a.calificacion_conductor IS NULL and CONCAT(a.fecha, ' ', a.hora) >= :fecha_hora_para_calificar) ";
        $where .= " order by a.id desc limit 1";
        $ca->prepareSelect("edo_servicios a {$join1} {$join2} ", "a.*{$fields_join1}{$join2_fields}", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha_hora", $fecha_hora);
        $ca->bindValue(":fecha_hora_para_calificar", $fecha_hora_para_calificar);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
//        return $ca->assocAll();
    }

    public static function consultaConfiguracion($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_configuraciones", "*", "empresa=:empresa order by id desc limit 1");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $r["documentos_driver"] = Array();
        $r["documentos_vehiculo"] = Array();
        $ca->prepareSelect("edo_configuraciones_documentos_driver", "*", "empresa=:empresa order by id desc limit 1");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $r["documentos_driver"] = $ca->flush();
        }
        $ca->prepareSelect("edo_configuraciones_documentos_vehiculos", "*", "empresa=:empresa order by id desc limit 1");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $r["documentos_vehiculo"] = $ca->flush();
        }
        return $r;
    }

    public static function populateParadas($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        $where .= "id_servicio=:id and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL) ";
        $ca->prepareSelect("edo_servicio_parada", "*", $where);
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function deleteNotification($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nwmaker_notificaciones", "id_objetivo=:id_objetivo");
        $ca->bindValue(":id_objetivo", $id);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
    }

    public static function consultaServicio($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "id=:id";
        $ca->prepareSelect("edo_servicios", "fecha,id,hora,origen,reservado_text,tipo_servicio", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consultaServicioDet($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "id=:id";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function notificaConductor($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $total = count($p);
        for ($i = 0; $i < $total; $i++) {
            $r = $p[$i];
            $tipo = "Ahora";
            if ($r["reservado_text"] == "SI") {
                $tipo = "Reservado";
            }
            $where = " perfil=:perfil and estado=:estado and id=:id_usu";
            $ca->prepareSelect("pv_clientes", "email", $where);
            $ca->bindValue(":perfil", 2);
            $ca->bindValue(":estado", "activo");
            $ca->bindValue(":id_usu", $r["usuario"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $pers = $ca->flush();

            $where = "b.id_conductor=:id_usu and  DATE(b.fecha)=DATE(NOW()) and b.estado=:estado_sincro";
            $ca->prepareSelect("pv_clientes a join trans_synchronize b on(a.id=b.id_conductor)", "b.id_motorizado,(select email from pv_clientes where id=b.id_motorizado) as email", $where);
            $ca->bindValue(":estado", "activo");
            $ca->bindValue(":id_usu", $r["usuario"]);
            $ca->bindValue(":estado_sincro", 'SINCRONIZADO');
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $pers2 = $ca->flush();

            $mensaje = "<strong>{$tipo}";
            if ($tipo == "Reservado") {
                $mensaje .= " " . $r["fecha"] . " " . $r["hora"] . "";
            }
            $mensaje .= "</strong><br />";
            $mensaje .= "<strong>Origen:</strong> " . $r["direccion_origen"] . "<br />";
            $mensaje .= "<strong>Destino:</strong> " . $r["direccion_destino"] . "";

            $id = $r["servicio"];
//            print_r($pers2);
            if ($pers2) {
                $persuno = $pers;
                $a = Array();
                $a["destinatario"] = $pers2["email"];
                $a["body"] = $mensaje;
                $a["modo_window"] = "popup";
                $a["sendEmail"] = false;
                $a["titleMensaje"] = "Nuevo servicio";
                $a["callback"] = "openServiceDrive($id);";
                $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
                nwMaker::notificacionNwMaker($a);
            }
            $persuno = $pers;
            $a = Array();
            $a["destinatario"] = $persuno["email"];
            $a["body"] = $mensaje;
            $a["modo_window"] = "popup";
            $a["sendEmail"] = false;
            $a["titleMensaje"] = "Nuevo servicio";
            $a["callback"] = "openServiceDrive($id);";
            $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
            nwMaker::notificacionNwMaker($a);
        }
        return true;
    }

    public static function IniciaServicio($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $ca->prepareUpdate("edo_servicios", "estado,hora_inicio", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", "INICIA_SERVICIO");
        $ca->bindValue(":hora_inicio", $hora);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return true;
    }

    public static function consulataMisComentarios($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $ca->prepareSelect("edo_comentarios", "*", "usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function calificarServicioConductor($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $puntaje = 1;
        if (isset($p["puntaje"])) {
            $puntaje = $p["puntaje"];
        }
        $calificacion_cliente_comentarios = "Sin comentarios";
        if (isset($p["comentarios"])) {
            $calificacion_cliente_comentarios = $p["comentarios"];
        }

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $ca->prepareUpdate("edo_servicios", "calificacion,estado_final,hora_fin_detalle_servicio,calificacion_cliente,calificacion_cliente_comentarios", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":calificacion", $puntaje);
        $ca->bindValue(":calificacion_cliente", $puntaje);
        $ca->bindValue(":calificacion_cliente_comentarios", $calificacion_cliente_comentarios);
        $ca->bindValue(":estado_final", "COBRADO_FINALIZADO");
        $ca->bindValue(":hora_fin_detalle_servicio", $hora);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareSelect("nw_calificaciones", "puntuacion,numero_servicios", "usuario=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario"], true, true);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "1");
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            $numero_servicios = 1;
            $array_puntuacion = [intval($puntaje)];
            $ca->prepareInsert("nw_calificaciones", "puntuacion,numero_servicios,fecha,empresa,usuario,perfil");
        } else {
            $resp = $ca->flush();
            $numero_servicios = $resp["numero_servicios"] + 1;
            $array_puntuacion = json_decode($resp["puntuacion"]);
            array_push($array_puntuacion, intval($puntaje));
            $ca->prepareUpdate("nw_calificaciones", "puntuacion,numero_servicios", "usuario=:usuario and empresa=:empresa and perfil=:perfil");
        }
        $obj = json_encode($array_puntuacion);

        $sum = 0;
        for ($i = 0; $i < count($array_puntuacion); $i++) {
            $sum = $sum + $array_puntuacion[$i];
        }
        $puntajePromedio = round($sum / $numero_servicios, 1);

        $ca->bindValue(":puntuacion", $obj);
        $ca->bindValue(":numero_servicios", $numero_servicios);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", date('Y-m-d H:m:s'));
        $ca->bindValue(":usuario", $p["usuario"], true, true);
        $ca->bindValue(":perfil", 1);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareUpdate("pv_clientes", "puntaje", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":puntaje", $puntajePromedio);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "1");
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }

        $v = servicios::saveComentario($p);
        if ($v !== true) {
            return $v;
        }

        $li = Array();
        $li["modulo"] = "app_driver:::califica_conductor";
        $li["accion"] = "Conductor califica servicio.";
        $li["comentarios"] = "{$puntaje} estrellas. Comentarios: {$calificacion_cliente_comentarios}";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        $li["all_data"] = $p;
        lineTime::save($li);

        $db->commit();
        return true;
    }

    public static function calificarServicio($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $puntaje = 1;
        if (isset($p["puntaje"])) {
            $puntaje = $p["puntaje"];
        }
        $comentarios = "Sin comentarios";
        if (isset($p["comentarios"]) && $p["comentarios"] !== "") {
            $comentarios = $p["comentarios"];
        }
        $id_parada = null;
        if (isset($p["id_parada"])) {
            $id_parada = $p["id_parada"];
            $ca->prepareUpdate("edo_servicio_parada", "calificacion_a_conductor,calificacion_a_conductor_comentarios", "id=:id");
            $ca->bindValue(":id", $p["id_parada"]);
            $ca->bindValue(":calificacion_a_conductor", $puntaje);
            $ca->bindValue(":calificacion_a_conductor_comentarios", $comentarios);
        } else {
            $ca->prepareUpdate("edo_servicios", "calificacion_conductor,calificacion_conductor_comentarios", "id=:id");
            $ca->bindValue(":id", $p["id"]);
            $ca->bindValue(":calificacion_conductor", $puntaje);
            $ca->bindValue(":calificacion_conductor_comentarios", $comentarios);
        }
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareInsert("edo_servicios_calificaciones", "id_servicio,fecha,usuario_pasajero,calificacion_pasajero,comentarios_pasajero,empresa");
        $ca->bindValue(":id_servicio", $p["id"]);
        $ca->bindValue(":id_parada", $id_parada);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":usuario_pasajero", $p["usuario"]);
        $ca->bindValue(":calificacion_pasajero", $puntaje);
        $ca->bindValue(":comentarios_pasajero", $comentarios);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $v = servicios::saveComentario($p);
        if ($v !== true) {
            return $v;
        }
        $ca->prepareSelect("nw_calificaciones", "puntuacion,numero_servicios", "usuario=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "2");
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            $numero_servicios = 1;
            $array_puntuacion = [intval($puntaje)];
            $ca->prepareInsert("nw_calificaciones", "puntuacion,numero_servicios,fecha,empresa,usuario,perfil");
        } else {
            $resp = $ca->flush();
            $numero_servicios = $resp["numero_servicios"] + 1;
            $array_puntuacion = json_decode($resp["puntuacion"]);
            array_push($array_puntuacion, intval($puntaje));
            $ca->prepareUpdate("nw_calificaciones", "puntuacion,numero_servicios", "usuario=:usuario and empresa=:empresa and perfil=:perfil");
        }
        $obj = json_encode($array_puntuacion);

        $sum = 0;
        for ($i = 0; $i < count($array_puntuacion); $i++) {
            $sum = $sum + $array_puntuacion[$i];
        }
        $puntajePromedio = round($sum / $numero_servicios, 1);

        $ca->bindValue(":puntuacion", $obj);
        $ca->bindValue(":numero_servicios", $numero_servicios);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", "2");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareUpdate("pv_clientes", "puntaje", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":puntaje", $puntajePromedio);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "2");
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }

        $ca->prepareSelect("pv_clientes", "saldo,puntaje", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario_califica"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "1");
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        $r = $ca->flush();

        $li = Array();
        $li["modulo"] = "app_pax:::califica_cliente";
        $li["accion"] = "Cliente califica servicio.";
        $li["comentarios"] = "{$puntaje} estrellas. Comentarios: {$comentarios}";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario_califica"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 1;
        $li["fecha"] = $hoy;
        $li["all_data"] = $p;
        lineTime::save($li);

        $db->commit();
        return $r;
    }

    public static function consultaHistoricoRecargas($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_recargas", "*", "usuario=:usuario and empresa=:empresa and perfil=:perfil order by id desc");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->assocAll();
    }

    public static function saveRecarga($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $id = master::getNextSequence("edo_recargas_id_seq", $db);
        $ca->prepareInsert("edo_recargas", "id,fecha,usuario,valor_recarga,total_recarga,nombre,id_plan,perfil,estado,empresa");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":id_plan", $p["id_plan"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":total_recarga", $p["total_recarga"]);
        $ca->bindValue(":valor_recarga", $p["valor_plan"]);
        $ca->bindValue(":nombre", $p["nombre"]);
//        $ca->bindValue(":id_plan", $p["id_plan"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":estado", "Verificacion");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $db->commit();
        return $id;
    }

//    public static function cambiacheckout($data) {
//        $p = nwMaker::getData($data);
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
//        $ca->prepareUpdate("edo_recargas", "checkoutRequestId", " id=:id");
//        $ca->bindValue(":id", $p["id"]);
//        $ca->bindValue(":checkoutRequestId", $p["checkoutRequestId"]);
//        if (!$ca->exec()) {
//               return nwMaker::error($ca->lastErrorText());
//        }
//        return true;
//    }

    public static function saveComentario($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $puntaje = 1;
        if (isset($p["puntaje"])) {
            $puntaje = $p["puntaje"];
        }
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $ca->prepareInsert("edo_comentarios", "fecha,usuario,puntaje,comentarios,usuario_califica,id_servicio");
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":id_servicio", $p["id"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":usuario_califica", $p["usuario_califica"]);
        $ca->bindValue(":puntaje", $puntaje);
        $ca->bindValue(":comentarios", $p["comentarios"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function recargoCancelar($data) {
        $p = nwMaker::getData($data);

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_recargos", "valor,desde,nombre,estado", "empresa=:empresa and estado=:estado and nombre=:nombre");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":estado", $p["estado_service"]);
        $ca->bindValue(":nombre", $p["cancela"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $recargo = $ca->flush();

        $ca->prepareSelect("pv_clientes", "saldo", "empresa=:empresa and usuario_cliente=:usuario and perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $sal = $ca->flush();
        $hora_actual = $hora;
        if ($recargo["estado"] == "EN_RUTA") {
            $hora_inicio = $p["tiempo"];
        } else {
            $hora_inicio = $p["hora_llegada"];
        }
        $datetime1 = new DateTime($hora_actual);
        $datetime2 = new DateTime($hora_inicio);
        $interval = $datetime1->diff($datetime2);
        $dif_tiempo = $interval->format('%H:%I:%S');
        if ($dif_tiempo > $recargo["desde"] && $recargo["estado"] == "EN_RUTA") {
            if (floatval($sal["saldo"]) >= 0) {
                $saldo_total = floatval($sal["saldo"]) - floatval($recargo["valor"]);
            } else {
                $saldo_total = (floatval($sal["saldo"]) * (-1) ) + floatval($recargo["valor"]);
                $saldo_total = "-" . $saldo_total;
            }
        }
//        print_r($dif_tiempo);
//        print_r($recargo["desde"]);
//        print_r($saldo_total);
        if ($dif_tiempo < $recargo["desde"] && $recargo["estado"] == "EN_SITIO" && $p["cancela"] == "cancela_conductor" || $recargo["estado"] == "EN_SITIO" && $p["cancela"] == "cancela_usuario") {
            if (floatval($sal["saldo"]) >= 0) {
                $saldo_total = floatval($sal["saldo"]) - floatval($recargo["valor"]);
            } else {
                $saldo_total = (floatval($sal["saldo"]) * (-1) ) + floatval($recargo["valor"]);
                $saldo_total = "-" . $saldo_total;
            }
        }
        if (isset($saldo_total)) {
            $ca->prepareUpdate("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
            $ca->bindValue(":saldo", $saldo_total);
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":perfil", $p["perfil"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            return $recargo["valor"];
        } else {
            return true;
        }
    }

    public static function cancelarServicio($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $ca->prepareSelect("edo_servicios", "conductor_id,conductor_usuario,usuario", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return "El servicio no existe";
        }
        $r = $ca->flush();

        servicios_conductor::sendEmailProccess($p, "CANCELAR SERVICIO");

        $estado = $p["estado"];
        $field = "";
        if (isset($p["libera_servicio"])) {
            $field = ",servicio_cancelado";
            $estado = $p["libera_servicio"];
        }
        $ca->prepareUpdate("edo_servicios", "estado,cancelado_fecha,cancelado_motivo,cancelado_notas,usuario_cancela" . $field, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":cancelado_fecha", $hoy);
        $ca->bindValue(":cancelado_motivo", $p["cancelado_motivo"]);
        $ca->bindValue(":cancelado_notas", $p["cancelado_notas"]);
        $ca->bindValue(":usuario_cancela", $p["usuario"]);
        if (isset($p["libera_servicio"])) {
            $ca->bindValue(":servicio_cancelado", "SI");
        }
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $ca->prepareUpdate("pv_clientes", "ocupado", "id=:id");
        $ca->bindValue(":id", $r["conductor_id"]);
        $ca->bindValue(":ocupado", "NO");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }

        $correoRecibe = null;
        $send = true;
        $asunto = "Servicio cancelado por conductor: " . $p["cancelado_motivo"];
        $body = "Servicio cancelado por conductor: " . $p["cancelado_motivo"];
        if (isset($p["texto_cancel_por_conductor"])) {
            $asunto = "{$p["texto_cancel_por_conductor"]} " . $p["cancelado_motivo"];
            $body = "{$p["texto_cancel_por_conductor"]} " . $p["cancelado_motivo"];
        }
        if ($p["estado"] === "CANCELADO_POR_USUARIO") {
            $asunto = "Servicio cancelado por cliente";
            $body = "Servicio cancelado por cliente";
            $correoRecibe = $r["conductor_usuario"];
            if (isset($p["texto_cancel_por_cliente"])) {
                $asunto = $p["texto_cancel_por_cliente"];
                $body = $p["texto_cancel_por_cliente"];
            }
        } else
        if ($p["estado"] === "CANCELADO_POR_CONDUCTOR") {
            $correoRecibe = $r["usuario"];
        } else {
            $send = false;
        }
        if ($send) {
            $a = Array();
            $a["celular"] = null;
            $a["send_sms"] = false;
            $a["cleanHtml"] = true;
            $a["fromName"] = "ServiceMovilmove";
            $a["fromEmail"] = "ServiceMovilmove";
            $a["correo_usuario_recibe"] = $correoRecibe;
            $a["destinatario"] = $correoRecibe;
            $a["titleMensaje"] = $asunto;
            $a["body"] = $body;
            $a["body_email"] = $body;
            $a["tipo"] = "cancelSer";
            $a["link"] = null;
            $a["modo_window"] = "popup";
            $a["insertaEnTabla"] = true;
            $a["fechaAviso"] = $hoy;
            $a["tipoAviso"] = "system";
            $a["sendEmail"] = false;
            $a["id_objetivo"] = null;
            $a["usuario_envia"] = $p["usuario"];
            $a["empresa"] = $p["empresa"];
            $a["sendNotifyPush"] = true;
            $n = nwMaker::notificacionNwMaker($a);
            if ($n !== true) {
                $db->rollback();
                nwMaker::error($n);
                return $n;
            }
        }

        $perfil = 1;
        $li = Array();
        $li["modulo"] = "app_pax:::cancela_servicio";
        if ($p["estado"] === "CANCELADO_POR_CONDUCTOR") {
            $li["modulo"] = "app_driver:::cancela_servicio";
            $perfil = 2;
        }
        $li["accion"] = "Cancelación de servicio {$estado}.";
        $li["comentarios"] = "Fecha dispositivo: {$hoy}. cancelado_motivo: {$p["cancelado_motivo"]} -  cancelado_notas: {$p["cancelado_notas"]}";
        $li["id_servicio"] = $p["id"];
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = $perfil;
        $li["all_data"] = $p;
        lineTime::save($li);

        if (isset($p["files"])) {
            $add = Array();
            $add["estado"] = "CANCELADO_POR_CONDUCTOR::{$p["cancelado_motivo"]}";
            $add["comentarios"] = "{$p["cancelado_motivo"]} Fecha dispositivo: {$hoy}. cancelado_motivo: {$p["cancelado_motivo"]} -  cancelado_notas: {$p["cancelado_notas"]}";
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

        if (isset($p["estado_service"])) {
            $recar = self::recargoCancelar($p);
            return $recar;
        } else {
            return true;
        }
    }

    public static function consultaConductores($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " a.id=:id and a.estado='EN_RUTA'";
        $ca->prepareSelect("edo_servicios a join pv_clientes b on(a.conductor_id=b.id)", "a.*,b.foto_perfil,b.celular", $where);
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", "activo");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consultaConductoresDetall($data) {
        $p = nwMaker::getData($data);
//        print_r($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " a.id=:id";
        $ca->prepareSelect("edo_servicios a join pv_clientes b on(a.conductor_id=b.id)", "a.*,b.foto_perfil,b.celular", $where);
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", "activo");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function categoriUsuario($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " usuario_cliente=:id";
        $ca->prepareSelect("pv_clientes", "*", $where);
        $ca->bindValue(":id", $si["usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consultaTarifas($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $apply = false;
        $servicio = null;
        $where = " 1=1 and a.empresa=:empresa ";
        if (isset($p["servicio"])) {
            $where .= " and a.id=:servicio";
            $servicio = $p["servicio"];
        }

        $tables = "edo_taximetro a ";
        $fields = "a.*,(SELECT porcentaje from edo_comisiones where empresa=a.empresa) as porcentaje ";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":servicio", $servicio);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $res = $ca->flush();

        if (isset($p["bodega"]) && $p["bodega"] != "") {
            $ca->prepareSelect('edo_foraneo_clientes', "*", "empresa=:empresa and id_cliente=:cliente and tarifa=:tarifa and service=:service");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":cliente", $p["bodega"]);
            $ca->bindValue(":tarifa", $p["id_tarifa"]);
            $ca->bindValue(":service", $p["subservicio"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $fc = $ca->flush();
            if (isset($fc["valor"])) {
                $apply = true;
                if (trim($fc["valor"]) != "trayecto") {
                    $res["valor_total"] = $fc["valor"];
                    $res["tarifa"] = "FIJA";
                    return $res;
                }
            }
        }

        if (!empty($p["subservicio"]) && $apply == false) {
            $ca->prepareSelect("edo_foraneo_service", "*", "empresa=:empresa and service=:id and id_tarifa=:id_tarifa");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":id", $p["subservicio"]);
            $ca->bindValue(":id_tarifa", $p["id_tarifa"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $tfs = $ca->flush();
            if (isset($tfs["valor"])) {
                $apply = true;
                if (trim($tfs["valor"]) != "trayecto") {
                    $res["valor_total"] = $tfs["valor"];
                    $res["tarifa"] = "FIJA";
                    return $res;
                }
            }
        }

        if (isset($res["tarifa"]) && $res["tarifa"] != "FIJA" && $apply == false) {
            $ca->prepareSelect("edo_foraneo", "*", "empresa=:empresa and id=:id");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":id", $p["id_tarifa"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            $tf = $ca->flush();
            if (isset($tf["valor"])) {
                if (trim($tf["valor"]) != "trayecto") {
                    $res["valor_total"] = $tf["valor"];
                    $res["tarifa"] = "FIJA";
                    return $res;
                }
            }
        }
        if (isset($p["bodega"]) && $p["bodega"] != "") {
            $ca->prepareSelect("edo_taximetro_cliente", "*", "empresa=:empresa and id_cliente=:cliente and trayecto=:servicio");
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":cliente", $p["bodega"]);
            $ca->bindValue(":servicio", $p["servicio"]);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $tax = $ca->flush();
                $res["valor_unidad_tiempo"] = $tax["valor_unidad_tiempo"];
                $res["valor_unidad_metros"] = $tax["valor_unidad_metros"];
                $res["valor_banderazo"] = $tax["valor_banderazo"];
                $res["valor_mascota"] = $tax["valor_mascota"];
                $res["minima"] = $tax["minima"];
                $res["porcentaje"] = $tax["porcentaje_comision"];
            }
        }
        return $res;
    }

    public static function consultaTarifasAll($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "a.empresa=:empresa ";
        $ciudad_origen = null;
        $ciudad_destino = null;
        $name_place_origen = null;
        $name_place_destino = null;
        $type = null;
        $typeSql = "";
        if (isset($p["type"])) {
            $typeSql = " and type=:type";
            $type = $p["type"];
        }
        if (isset($p["ciudad_origen"]) && isset($p["name_place_origen"]) && isset($p["ciudad_destino"]) && isset($p["name_place_destino"])) {
            $name_place_origen = $p["name_place_origen"];
            $name_place_destino = $p["name_place_destino"];
//        if (isset($p["ciudad_origen"]) && isset($p["ciudad_destino"])) {
            $ciudad_origen = $p["ciudad_origen"];
            $ciudad_destino = $p["ciudad_destino"];
            $where .= " and (";
//            $where .= "    b.ciudad_o_lugar_origen=:ciudad_origen and b.ciudad_o_lugar_destino=:ciudad_destino ";
//            $where .= " or b.ciudad_o_lugar_origen=:name_place_origen and b.ciudad_o_lugar_destino=:name_place_destino ";
//            $where .= " or b.ciudad_o_lugar_origen=:ciudad_origen and b.ciudad_o_lugar_destino=:name_place_destino ";
//            $where .= " or ";
            $where .= " b.ciudad_o_lugar_origen LIKE '%:ciudad_origen%' and b.ciudad_o_lugar_destino LIKE '%:ciudad_destino%'  {$typeSql} ";
            $where .= " or b.ciudad_o_lugar_origen LIKE '%:name_place_origen%' and b.ciudad_o_lugar_destino LIKE '%:name_place_destino%'  {$typeSql} ";
            $where .= " or b.ciudad_o_lugar_origen LIKE '%:ciudad_origen%' and b.ciudad_o_lugar_destino LIKE '%:name_place_destino%' {$typeSql} ";
            if ($type !== null) {
                $where .= " or ( MATCH(b.ciudad_o_lugar_origen) AGAINST (:ciudad_origen) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino)  {$typeSql}) ";
            }
            $where .= " ) ";
        }
        $where .= " and a.id =:tipo ";
        $where .= " order by a.orden asc";
        $fields = "DISTINCT a.*,b.ciudad_o_lugar_origen,b.ciudad_o_lugar_destino,b.valor as valor_tarija_fija,b.id as id_service_tarifa_fija";
        $fields .= ",b.valor_metros_add,b.inicia_metros_add,b.valor_peajes,b.valor_recargo,b.concepto_recargo,b.metros_cobro_recargo,b.metros_cobro_peaje";

        $ca->prepareSelect("edo_taximetro a inner join edo_foraneo b ON(a.id=b.servicio_id)", $fields, $where);
        $ca->bindValue(":tipo", $p["servi"]["tipo_servicio"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":ciudad_origen", $ciudad_origen);
        $ca->bindValue(":ciudad_destino", $ciudad_destino);
        $ca->bindValue(":name_place_origen", $name_place_origen);
        $ca->bindValue(":name_place_destino", $name_place_destino);
        $ca->bindValue(":type", $type);
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
        }
        $res = $ca->assocAll();

        if (isset($p["usa_subservice"])) {
            if (isset($p["servi"]["subservicio"]) && $p["servi"]["subservicio"] != "") {
                $ca->prepareSelect('edo_foraneo_service', "*", "empresa=:empresa and id_tarifa=:tarifa and id=:id");
                $ca->bindValue(":id", $p["servi"]["subservicio"]);
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":tarifa", $res[0]["id_service_tarifa_fija"]);
                if (!$ca->exec()) {
                    return NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
                }
                if ($ca->size() > 0) {
                    $ser = $ca->flush();
                    if (!empty($ser["valor"])) {
                        $res[0]["valor_tarija_fija"] = $ser["valor"];
                    }
                }
            }
        }
        if (isset($p["carga"])) {
            if (isset($p["bodega"])) {
                $ca->prepareSelect('edo_foraneo_clientes', "*", "empresa=:empresa and id_cliente=:cliente");
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":cliente", $p["bodega"]);
                if (!$ca->exec()) {
                    return NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
                }
                if ($ca->size() > 0) {
                    $tar = $ca->assocAll();
                    for ($i = 0; $i < count($res); $i++) {
                        for ($j = 0; $j < count($tar); $j++) {
                            if ($res[$i]["id_service_tarifa_fija"] == $tar[$j]["tarifa"]) {
                                if (isset($p["servi"]["subservicio"]) && $p["servi"]["subservicio"] != "") {
                                    if ($tar[$j]["service"] == $p["servi"]["subservicio_model"]["id_subservice"]) {
//                                NWJSonRpcServer::console($tar[$i]);
                                        $res[$i]["valor_tarija_fija"] = $tar[$j]["valor"];
                                        break;
                                    } else {
                                        $res[$i]["valor_tarija_fija"] = $tar[$j]["valor"];
                                    }
                                } else {
                                    $res[$i]["valor_tarija_fija"] = $tar[$j]["valor"];
                                }
                            }
                        }
                    }
                }
            }
        }
//        NWJSonRpcServer::console($res);
        return $res;
    }

    public static function consultaTarifasAllApp($data) {
        $p = nwMaker::getData($data);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $cobertura_por_ciudades = true;
        if (isset($p["cobertura_por_ciudades"])) {
            if ($p["cobertura_por_ciudades"] === "NO") {
                $cobertura_por_ciudades = false;
            }
        }
        $where = "a.empresa=:empresa ";
        $ciudad_origen = null;
        $ciudad_destino = null;
        $name_place_origen = null;
        $name_place_destino = null;
        $name_place_destino_text = null;
        $name_place_origen_text = null;
        $type = null;
        if (isset($p["type"])) {
            $typeSql = " and type=:type";
            $type = $p["type"];
        }
//        $typeSql = "";
        if ($cobertura_por_ciudades === true) {
            if (isset($p["ciudad_origen"]) && isset($p["name_place_origen"]) && isset($p["ciudad_destino"]) && isset($p["name_place_destino"])) {
                $name_place_origen = $p["name_place_origen"];
                $name_place_destino = $p["name_place_destino"];
                $ciudad_origen = $p["ciudad_origen"];
                $ciudad_destino = $p["ciudad_destino"];
                $name_place_origen_text = $ciudad_origen;
                $name_place_destino_text = $ciudad_destino;

                if (isset($p["name_place_origen"])) {
                    $name_place_origen_text = $p["name_place_origen"];
                }
                if (isset($p["name_place_destino_text"])) {
                    $name_place_destino_text = $p["name_place_destino_text"];
                }

                $cobertura_ciudades_exactas = false;
                if (isset($p["configCliente"])) {
                    if (isset($p["configCliente"]["cobertura_ciudades_exactas"]) && $p["configCliente"]["cobertura_ciudades_exactas"] == "SI") {
                        $cobertura_ciudades_exactas = true;
                    }
                }
                if ($cobertura_ciudades_exactas) {
                    $where .= "    and b.ciudad_o_lugar_origen=:ciudad_origen and b.ciudad_o_lugar_destino=:ciudad_destino {$typeSql} ";
                } else {
                    $where .= " and (";
//                    $where .= "  ( MATCH(b.ciudad_o_lugar_origen) AGAINST (:ciudad_origen) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino_text)  {$typeSql}) ";
//                    $where .= "  ( MATCH(b.ciudad_o_lugar_origen) AGAINST (:name_place_origen_text) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino_text)  {$typeSql} ) ";
                    $where .= " ( ";
                    $where .= " MATCH(b.ciudad_o_lugar_origen) AGAINST (:name_place_origen_text) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino_text) ";
                    $where .= " or MATCH(b.ciudad_o_lugar_origen) AGAINST (:name_place_origen) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino) ";
                    $where .= "   ) ";
                    $where .= " {$typeSql} ";
//            $where .= "    b.ciudad_o_lugar_origen=:ciudad_origen and b.ciudad_o_lugar_destino=:ciudad_destino ";
//            $where .= " or b.ciudad_o_lugar_origen=:name_place_origen and b.ciudad_o_lugar_destino=:name_place_destino ";
//            $where .= " or b.ciudad_o_lugar_origen=:ciudad_origen and b.ciudad_o_lugar_destino=:name_place_destino ";
//            $where .= " or ";
//                if (isset($p["name_place_destino_text"])) {
//                    $name_place_destino_text = $p["name_place_destino_text"];
//                    $where .= " b.ciudad_o_lugar_origen LIKE '%:ciudad_origen%' and b.ciudad_o_lugar_destino LIKE '%:name_place_destino_text%' {$typeSql} ";
//                    $where .= " or";
//                    $where .= "  ( MATCH(b.ciudad_o_lugar_origen) AGAINST (:ciudad_origen) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino_text)  {$typeSql}) ";
//                }
//                $where .= " b.ciudad_o_lugar_origen LIKE '%:ciudad_origen%' and b.ciudad_o_lugar_destino LIKE '%:ciudad_destino%'  {$typeSql} ";
//                $where .= " or b.ciudad_o_lugar_origen LIKE '%:name_place_origen%' and b.ciudad_o_lugar_destino LIKE '%:ciudad_destino%'  {$typeSql} ";
//                $where .= " or b.ciudad_o_lugar_origen LIKE '%:name_place_origen%' and b.ciudad_o_lugar_destino LIKE '%:name_place_destino%'  {$typeSql} ";
//                $where .= " or b.ciudad_o_lugar_origen LIKE '%:ciudad_origen%' and b.ciudad_o_lugar_destino LIKE '%:name_place_destino%' {$typeSql} ";
//                if (isset($p["name_place_destino_text"]) && $name_place_destino_text != null) {
//                    $where .= " or b.ciudad_o_lugar_origen LIKE '%:ciudad_origen%' and b.ciudad_o_lugar_destino LIKE '%:name_place_destino_text%' {$typeSql} ";
//                }
//                if ($type !== null) {
//                    $where .= " or ( MATCH(b.ciudad_o_lugar_origen) AGAINST (:ciudad_origen) and MATCH(b.ciudad_o_lugar_destino) AGAINST (:name_place_destino_text)  {$typeSql}) ";
//                }
                    $where .= " ) ";
                }
            }
        }
        $where .= " order by a.orden asc";
        $fields = "DISTINCT a.*";
//        $fields = " a.*";
//        $fields .= " ,b.id as id";
        if ($cobertura_por_ciudades === true) {
            $fields .= ",b.ciudad_o_lugar_origen,b.ciudad_o_lugar_destino,b.valor as valor_tarija_fija,b.id as id_service_tarifa_fija";
            $fields .= ",b.valor_metros_add,b.inicia_metros_add,b.valor_peajes,b.valor_recargo,b.concepto_recargo,b.metros_cobro_recargo,b.metros_cobro_peaje";
            $fields .= ",b.id as id_foraneo";
            $fields .= ",b.valor_pasajero_adicional,b.pasajero_adicional_rango_inicia_cobro";
        }
        $tables = "edo_taximetro a ";
        if ($cobertura_por_ciudades === true) {
            $tables .= "inner join edo_foraneo b ON(a.id=b.servicio_id)";
        }
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":ciudad_origen", $ciudad_origen);
        $ca->bindValue(":ciudad_destino", $ciudad_destino);
        $ca->bindValue(":name_place_origen", $name_place_origen);
        $ca->bindValue(":name_place_destino", $name_place_destino);
        $ca->bindValue(":name_place_origen_text", $name_place_origen_text);
        $ca->bindValue(":name_place_destino_text", $name_place_destino_text);
        $ca->bindValue(":type", $type);
//        NWJSonRpcServer::information($ca->preparedQuery());
//        return NWJSonRpcServer::information($ca->preparedQuery());
//        print_r($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
        }
        $res = $ca->assocAll();
        return $res;

        if (isset($p["bodega"])) {
            $cb->prepareSelect('edo_foraneo_clientes', "*", "empresa=:empresa and id_cliente=:cliente");
            $cb->bindValue(":empresa", $p["empresa"]);
            $cb->bindValue(":cliente", $p["bodega"]);
            if (!$cb->exec()) {
                return NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $cb->lastErrorText());
            }
            $foraClien = $cb->assocAll();
            if (count($foraClien) > 0) {
                $tar = $foraClien;
                for ($i = 0; $i < count($res); $i++) {
                    for ($j = 0; $j < count($tar); $j++) {
                        if ($res[$i]["id_service_tarifa_fija"] == $tar[$j]["tarifa"]) {
                            $res[$i]["valor_tarija_fija"] = $tar[$j]["valor"];
                            $res[$i]["valor_unidad_metros"] = $tar[$j]["valor"];
                        }
                    }
                }
            }
            $cb->prepareSelect('edo_taximetro_cliente', "*", "empresa=:empresa and id_cliente=:cliente");
            $cb->bindValue(":empresa", $p["empresa"]);
            $cb->bindValue(":cliente", $p["bodega"]);
            if (!$cb->exec()) {
                return NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $cb->lastErrorText());
            }
            $foraClien = $cb->assocAll();
            if (count($foraClien) > 0) {
                $tar = $foraClien;
                for ($i = 0; $i < count($res); $i++) {
                    for ($j = 0; $j < count($tar); $j++) {
                        if ($res[$i]["id"] == $tar[$j]["trayecto"]) {
                            $res[$i]["valor_unidad_tiempo"] = $tar[$j]["valor_unidad_tiempo"];
                            $res[$i]["valor_unidad_metros"] = $tar[$j]["valor_unidad_metros"];
                            $res[$i]["valor_banderazo"] = $tar[$j]["valor_banderazo"];
                            $res[$i]["minima"] = $tar[$j]["minima"];
                        }
                    }
                }
            }
        }
        return $res;
    }

    public static function dataSubservices($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        if (isset($si["bodega"]) && $si["bodega"] != null && $si["bodega"] != 'null' && $si["bodega"] != 'undefined') {
            $where = " a.empresa=:empresa and a.servicio_id=:id and b.tarifa=:id_service_tarifa_fija and id_cliente=:bodega ";
//        $ca->prepareSelect("edo_taximetro a inner join edo_foraneo b ON(a.id=b.servicio_id) inner join  edo_foraneo_service f on (b.id=f.id_tarifa) "
            $ca->prepareSelect("edo_foraneo a join edo_foraneo_clientes b on(a.id=b.tarifa and a.empresa=b.empresa)"
                    . "inner join edo_subservice s on b.service=s.id ", "b.id,b.service,b.valor,s.nombre,s.icono,s.id as id_subservice", $where);
            $ca->bindValue(":bodega", $si["bodega"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":id", $p["id"]);
            $ca->bindValue(":id_service_tarifa_fija", $p["id_service_tarifa_fija"]);
//            NWJSonRpcServer::information($ca->preparedQuery());
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                return $ca->assocAll();
            }
        }
        $where = " a.empresa=:empresa and a.servicio_id=:id and b.id_tarifa=:id_service_tarifa_fija ";
//        $ca->prepareSelect("edo_taximetro a inner join edo_foraneo b ON(a.id=b.servicio_id) inner join  edo_foraneo_service f on (b.id=f.id_tarifa) "
        $ca->prepareSelect("edo_foraneo a join edo_foraneo_service b on(a.id=b.id_tarifa and a.empresa=b.empresa)"
                . "inner join edo_subservice s on b.service=s.id ", "b.id,b.service,b.valor,s.nombre,s.icono,s.id as id_subservice", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":id_service_tarifa_fija", $p["id_service_tarifa_fija"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaTarifasPh($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1";
        $ca->prepareSelect("edo_ph", "*", $where);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function querySubService($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        if (isset($p["bodega"]) && $p["bodega"] != null && $p["bodega"] != 'null' && $p["bodega"] != 'undefined') {
            $where = " a.empresa=:empresa and a.servicio_id=:id and b.tarifa=:id_service_tarifa_fija and id_cliente=:bodega ";
            $ca->prepareSelect("edo_foraneo a join edo_foraneo_clientes b on(a.id=b.tarifa and a.empresa=b.empresa)"
                    . "inner join edo_subservice s on b.service=s.id ", "s.porcentaje_aumento,b.id,b.service,b.valor,s.nombre,s.icono,s.id as id_subservice", $where);
            $ca->bindValue(":bodega", $p["bodega"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":id", $p["id_sevice"]);
            $ca->bindValue(":id_service_tarifa_fija", $p["id_tarifa"]);
//            NWJSonRpcServer::information($ca->preparedQuery());
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
//            print_r($ca->assocAll());
//            return;
            if ($ca->size() > 0) {
                return $ca->assocAll();
            }
        }

        $where = " a.empresa=:empresa and a.servicio_id=:id and b.id_tarifa=:tarifa ";
        $ca->prepareSelect("edo_foraneo a join edo_foraneo_service b on(a.id=b.id_tarifa and a.empresa=b.empresa)"
                . "inner join edo_subservice s on b.service=s.id ", "s.porcentaje_aumento,b.id,b.service,b.valor,s.nombre,s.icono,a.servicio_id", $where);

        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":tarifa", $p["id_tarifa"]);
        $ca->bindValue(":id", $p["id_sevice"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
//        print_r($ca->assocAll());
//        return;
        return $ca->assocAll();
    }

    public static function consultaTarifasForaneo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " nombre=:ciudad";
        $ca->prepareSelect("ciudades", "id", $where);
        $ca->bindValue(":ciudad", $p["ciudad_destino"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $ciudad = $ca->flush();
        $ca->prepareSelect("edo_foraneo", "*", "ciudad=:ciudad");
        $ca->bindValue(":ciudad", $ciudad["id"], true);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function consultaFavoritos($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_favoritos", "*", "usuario=:usuario");
        $ca->bindValue(":usuario", $si["id_usuario"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function eliminarUbicacion($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_favoritos", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function savePreferidos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $id = null;
        $tipo = "favorite";
        $orden = null;
        if (isset($p["orden"])) {
            $tipo = $p["orden"];
        }
        if (isset($p["tipo"])) {
            $tipo = $p["tipo"];
        }
        $resultsVal = "";
        $fields = "nombre,usuario,empresa,agregado_especial";
        if (isset($p["results"])) {
            $fields .= ",results";
            $resultsVal = $p["results"];
        }
        if ($p["id"] === "") {
            $fields .= ",id,fecha,direccion,tipo,orden";
            $id = master::getNextSequence(" edo_favoritos_id_seq", $db);
            $ca->prepareInsert("edo_favoritos", $fields);
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("edo_favoritos", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":results", $resultsVal);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":tipo", $tipo);
        $ca->bindValue(":orden", $orden, true, true);
        $ca->bindValue(":agregado_especial", "SI");
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
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
        if (isset($p["confirma_parada"])) {
            if ($p["confirma_parada"] == true) {
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
        }
        if (!isset($p["usuario"])) {
            return $r["recargos"];
        }
        $ca->prepareSelect("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil and estado=:estado");
        $ca->bindValue(":estado", "Activo");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return "USUARIO_NO_EXISTE";
        }
        $r["saldo"] = $ca->flush();
        return $r;
    }

    public static function save($p) {
        $p = nwMaker::getData($p);
        $sentido = "EJECUTIVO";
        $usuario = "";
        $id_usuario = "";
        $empresa = "";
        $foto_perfil = "";
        $concepto_recargo_ruta_fija = null;
        $valor_recargo_ruta_fija = null;
        $metros_cobro_recargo = null;
        $valor_peajes = null;
        $metros_cobro_peaje = null;
        $inicia_metros_add = null;
        $valor_metros_add = null;
        $valorbase = null;
        $valorminutos = null;
        $valordistancia = null;
        $valor_unidad_tiempo = null;
        $valor_unidad_metros = null;
        $pathOriginToDestiny = null;
        $code_verifi_service = null;
        $code_verifi_service_fin = null;
        $centro_costo = null;
        $vuelo_numero = null;
        $ofertado = "NO";
        if (isset($p["ofertado"])) {
            $ofertado = $p["ofertado"];
        }
        if (isset($p["vuelo_numero"])) {
            $vuelo_numero = $p["vuelo_numero"];
        }
        $valor_tarifa_minima = null;
        if (isset($p["servicio_array"])) {
            $valor_tarifa_minima = $p["servicio_array"]["data"]["minima"];
        }
        $cliente_empresa_id = null;
        if (isset($p["cliente_empresa_id"])) {
            $cliente_empresa_id = $p["cliente_empresa_id"];
        }
        if (isset($p["sentido"])) {
            $sentido = $p["sentido"];
        }
        if (isset($p["centro_costo"])) {
            $centro_costo = $p["centro_costo"];
        }
        if (isset($p["code_verifi_service"])) {
            $code_verifi_service = $p["code_verifi_service"];
        }
        if (isset($p["code_verifi_service_fin"])) {
            $code_verifi_service_fin = $p["code_verifi_service_fin"];
        }
        if (isset($p["pathOriginToDestiny"])) {
            $pathOriginToDestiny = $p["pathOriginToDestiny"];
        }
        if (isset($p["valor_peajes"])) {
            $valor_peajes = $p["valor_peajes"];
        }
        if (isset($p["metros_cobro_peaje"])) {
            $metros_cobro_peaje = $p["metros_cobro_peaje"];
        }
        if (isset($p["valor_recargo_ruta_fija"])) {
            $valor_recargo_ruta_fija = $p["valor_recargo_ruta_fija"];
        }
        if (isset($p["metros_cobro_recargo"])) {
            $metros_cobro_recargo = $p["metros_cobro_recargo"];
        }
        if (isset($p["concepto_recargo_ruta_fija"])) {
            $concepto_recargo_ruta_fija = $p["concepto_recargo_ruta_fija"];
        }
        if (isset($p["inicia_metros_add"])) {
            if ($p["inicia_metros_add"] !== "" && $p["inicia_metros_add"] !== "null" && $p["inicia_metros_add"] !== null) {
                $inicia_metros_add = $p["inicia_metros_add"];
            }
        }
        if (isset($p["valor_metros_add"])) {
            if ($p["valor_metros_add"] !== "" && $p["valor_metros_add"] !== "null" && $p["valor_metros_add"] !== null) {
                $valor_metros_add = $p["valor_metros_add"];
            }
        }
        if (isset($p["valorbase"])) {
            $valorbase = $p["valorbase"];
        }
        if (isset($p["valorminutos"])) {
            $valorminutos = $p["valorminutos"];
        }
        if (isset($p["valordistancia"])) {
            $valordistancia = $p["valordistancia"];
        }
        if (isset($p["valor_unidad_tiempo"])) {
            $valor_unidad_tiempo = $p["valor_unidad_tiempo"];
        }
        if (isset($p["valor_unidad_metros"])) {
            $valor_unidad_metros = $p["valor_unidad_metros"];
        }
        if (isset($p["foto_perfil"])) {
            $foto_perfil = $p["foto_perfil"];
        }
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
            $id_usuario = $p["id_usuario"];
            $empresa = $p["empresa"];
        } else {
            session::check();
            $si = session::info();
            $id_usuario = $si["id_usuario"];
            $usuario = $si["usuario"];
            $empresa = $si["empresa"];
        }
        $localidad_origen = "";
        if (isset($p["localidad_origen"])) {
            $localidad_origen = $p["localidad_origen"];
        }
        $ciudad_destino = "";
        if (isset($p["ciudad_destino"])) {
            $ciudad_destino = $p["ciudad_destino"];
        }
        $latitudDes = "";
        if (isset($p["latitudDes"])) {
            $latitudDes = $p["latitudDes"];
        }
        $longitudDes = "";
        if (isset($p["longitudDes"])) {
            $longitudDes = $p["longitudDes"];
        }
        $tiempo = "";
        if (isset($p["tiempo"])) {
            $tiempo = $p["tiempo"];
        }
        $total_metros = "";
        if (isset($p["total_metros"])) {
            $total_metros = $p["total_metros"];
        }
        $serv = "";
        $servicio = null;
        if (isset($p["servicio_nom"])) {
            $servicio = $p["servicio_nom"];
            $serv = "servicio,";
        }
        $celular = null;
        if (isset($p["celular"])) {
            $celular = $p["celular"];
        }
        $cliente_nombre = null;
        if (isset($p["cliente_nombre"])) {
            $cliente_nombre = $p["cliente_nombre"];
        }
        $datos_vehiculo_elegido = null;
        if (isset($p["datos_vehiculo_elegido"])) {
            $datos_vehiculo_elegido = $p["datos_vehiculo_elegido"];
        }
        $descuento_maximo = 0;
        if (isset($p["descuento_maximo"])) {
            $descuento_maximo = $p["descuento_maximo"];
        }
        $estado = "SOLICITUD";
        if (isset($p["estado"])) {
            $estado = $p["estado"];
        }
        $bodega = "";
        if (isset($p["bodega"])) {
            $bodega = ",bodega";
        }
        $subservicio = "";
        if (isset($p["subservicio"])) {
            $subservicio = ",subservicio,subservicio_text";
        }
        $num_maletas = null;
        if (isset($p["num_maletas"])) {
            $num_maletas = $p["num_maletas"];
        }
        $num_personas = null;
        if (isset($p["num_personas"])) {
            $num_personas = $p["num_personas"];
        }
        $id_tarifa = null;
        if (isset($p["id_tarifa"])) {
            $id_tarifa = $p["id_tarifa"];
        }
        $totalParadas = 0;
        if (isset($p["paradas"])) {
            if (count($p["paradas"]) > 0) {
                $totalParadas = count($p["paradas"]);
            }
        }

        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $cb->setCleanHtml(false);

        $id = master::getNextSequence("edo_servicios_id_seq", $db);
        $fields = "id," . $serv . "fecha,hora,origen,tarifa,latitudOri,longitudOri ,destino,latitudDes,longitudDes,tipo_servicio,tiempo_estimado,"
                . "valor,estado,localidad_origen,ciudad_origen,pais_origen,tipo_pago,subcategoria_servicio,subcategoria_servicio_text,"
                . "ciudad_destino,total_metros,reservado_text,id_usuario,usuario,empresa,token_usuario,celular,cliente_nombre,datos_vehiculo_elegido,"
                . "descuento_maximo,descricion_carga,num_personas,num_maletas,cliente_foto" . $bodega . $subservicio;
        $fields .= ",sentido,cliente_empresa_id,ofertado";

        $valorDescuentoCupon = 0;
        if (isset($p["valorDescuentoCupon"])) {
            $fields .= ",descuento_aplicado";
            $valorDescuentoCupon = $p["valorDescuentoCupon"];
        }

        $vehiculo = null;
        $vehiculo_text = null;
        if (isset($p["vehiculo"])) {
            $fields .= ",vehiculo,vehiculo_text";
        }
        $id_tarjeta_credito = null;
        if (isset($p["id_tarjeta_credito"])) {
            if ($p["tipo_pago"] === "tarjeta_credito") {
                $fields .= ",id_tarjeta_credito";
                $id_tarjeta_credito = $p["id_tarjeta_credito"];
            }
        }
        if ($valor_tarifa_minima != null) {
            $fields .= ",valor_tarifa_minima";
        }
        $d["empresa"] = $empresa;
        $remesa = self::consecutiveRemittance($d, $db);

        if ($remesa) {
            $fields .= ",remesa";
        }
        if (isset($p["centro_costo"])) {
            $fields .= ",centro_costo";
        }
        $pais_origen = null;
        if (isset($p["pais_origen"])) {
            $pais_origen = $p["pais_origen"];
        }
        $ciudad_origen = null;
        if (isset($p["ciudad_origen"])) {
            $ciudad_origen = $p["ciudad_origen"];
        }
        if (isset($p["carga"]) && $p["carga"] == "SI") {
            $fields .= ",numero_auxiliares,salida_periferia,despacho,retorno,cargue,descargue,observaciones_servicio,contacto_recogida"
                    . ",observaciones_recogida,contacto_entrega,telefono_recogida,"
                    . "telefono_entrega,observaciones_entrega,descripcion_carga,cantidad,volumen,peso,empaque,valor_declarado";
        }
        if (isset($p["datos_cupon"])) {
            $fields .= ",datos_cupon";
        }

        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $fields .= ",concepto_recargo_ruta_fija,valor_recargo_ruta_fija,metros_cobro_recargo,valor_peajes,metros_cobro_peaje";
        $fields .= ",inicia_metros_add,valor_metros_add,valorbase,valorminutos,valordistancia,valor_unidad_metros,valor_unidad_tiempo,code_verifi_service_fin";
        $fields .= ",pathOriginToDestiny,id_tarifa,code_verifi_service,paradas_adicionales_iniciales_creacion,creado_por_pc";
        $fields .= ",vuelo_numero";
        $ca->prepareInsert("edo_servicios", $fields);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":token_usuario", $p["token_usuario"]);
        $ca->bindValue(":fecha", $p["tipo_servicio"] == "ahora" ? $fecha : $p["fecha"]);
        $ca->bindValue(":hora", $p["tipo_servicio"] == "ahora" ? $hora : $p["hora"]);
        $ca->bindValue(":origen", $p["address"]);
        $ca->bindValue(":servicio", $servicio);
        if (isset($p["subservicio"])) {
            $ca->bindValue(":subservicio", $p["subservicio"]["service"]);
            $ca->bindValue(":subservicio_text", $p["subservicio"]["nombre"]);
        }
        $ca->bindValue(":creado_por_pc", "AppPax", true, true);
        $ca->bindValue(":id_tarifa", $id_tarifa, true, true);
        $ca->bindValue(":remesa", $remesa);
        $ca->bindValue(":descuento_aplicado", $valorDescuentoCupon);
        $ca->bindValue(":num_personas", $num_personas, true, true);
        $ca->bindValue(":num_maletas", $num_maletas, true, true);
        $ca->bindValue(":localidad_origen", $localidad_origen);
        $ca->bindValue(":tarifa", $p["forma"]);
        $ca->bindValue(":descricion_carga", $p["descricion_carga"]);
        $ca->bindValue(":ciudad_origen", $ciudad_origen);
        $ca->bindValue(":pais_origen", $pais_origen);
        $ca->bindValue(":latitudOri", $p["latitudOri"]);
        $ca->bindValue(":longitudOri", $p["longitudOri"]);
        $ca->bindValue(":destino", $p["address_destino"]);
        $ca->bindValue(":ciudad_destino", $ciudad_destino);
        $ca->bindValue(":latitudDes", $latitudDes);
        $ca->bindValue(":longitudDes", $longitudDes);
        $ca->bindValue(":tipo_servicio", $p["tipo_servicio"]);
        $ca->bindValue(":tipo_pago", $p["tipo_pago"]);
        $ca->bindValue(":subcategoria_servicio", $p["subcategoria_servicio"], true, true);
        $ca->bindValue(":subcategoria_servicio_text", $p["subcategoria_servicio_text"], true, true);
        $ca->bindValue(":tiempo_estimado", $tiempo);
        $ca->bindValue(":total_metros", $total_metros);
        $ca->bindValue(":valor", $p["valor"]);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":reservado_text", $p["reservado_text"]);
        $ca->bindValue(":id_tarjeta_credito", $id_tarjeta_credito);
        $ca->bindValue(":vehiculo", $vehiculo);
        $ca->bindValue(":vehiculo_text", $vehiculo_text);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":id_usuario", $id_usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":celular", $celular);
        $ca->bindValue(":cliente_nombre", $cliente_nombre);
        $ca->bindValue(":datos_vehiculo_elegido", $datos_vehiculo_elegido);
        $ca->bindValue(":descuento_maximo", $descuento_maximo);
        $ca->bindValue(":concepto_recargo_ruta_fija", $concepto_recargo_ruta_fija);
        $ca->bindValue(":valor_recargo_ruta_fija", $valor_recargo_ruta_fija, true, true);
        $ca->bindValue(":metros_cobro_recargo", $metros_cobro_recargo, true, true);
        $ca->bindValue(":valor_peajes", $valor_peajes, true, true);
        $ca->bindValue(":metros_cobro_peaje", $metros_cobro_peaje, true, true);
        $ca->bindValue(":valor_metros_add", $valor_metros_add, true, true);
        $ca->bindValue(":inicia_metros_add", $inicia_metros_add, true, true);
        $ca->bindValue(":valorbase", $valorbase, true, true);
        $ca->bindValue(":valorminutos", $valorminutos, true, true);
        $ca->bindValue(":valordistancia", $valordistancia, true, true);
        $ca->bindValue(":valor_unidad_metros", $valor_unidad_metros, true, true);
        $ca->bindValue(":valor_unidad_tiempo", $valor_unidad_tiempo, true, true);
        $ca->bindValue(":pathOriginToDestiny", $pathOriginToDestiny);
        $ca->bindValue(":code_verifi_service", $code_verifi_service, true, true);
        $ca->bindValue(":code_verifi_service_fin", $code_verifi_service_fin, true, true);
        $ca->bindValue(":centro_costo", $centro_costo);
        $ca->bindValue(":cliente_foto", $foto_perfil);
        $ca->bindValue(":paradas_adicionales_iniciales_creacion", $totalParadas);
        $ca->bindValue(":sentido", $sentido);
        $ca->bindValue(":vuelo_numero", $vuelo_numero);
        $ca->bindValue(":cliente_empresa_id", $cliente_empresa_id, true, true);
        $ca->bindValue(":valor_tarifa_minima", $valor_tarifa_minima, true, true);
        $ca->bindValue(":ofertado", $ofertado, true, true);
        //carga
        if (isset($p["datos_cupon"])) {
            $ca->bindValue(":datos_cupon", $p["datos_cupon"]);
        }
        //fin cupon
        //carga
        if (isset($p["carga"]) && $p["carga"] == "SI") {
            $ca->bindValue(":numero_auxiliares", $p["numero_auxiliares"]);
            $ca->bindValue(":salida_periferia", $p["salida_periferia"]);
            $ca->bindValue(":despacho", $p["despacho"]);
            $ca->bindValue(":retorno", $p["retorno"]);
            $ca->bindValue(":cargue", $p["cargue"]);
            $ca->bindValue(":descargue", $p["descargue"]);
            $ca->bindValue(":observaciones_servicio", $p["observaciones_servicio"]);
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
        if (isset($p["bodega"])) {
            $ca->bindValue(":bodega", $p["bodega"]);
        }
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($totalParadas > 0) {
            $fields = "id,id_servicio,fecha,direccion,usuario,empresa,latitud_parada,longitud_parada,descripcion_carga,estado";
            $fields .= ",nombre_pasajero";
            foreach ($p["paradas"] as $r) {
                $id_parada = master::getNextSequence("edo_servicio_parada_id_seq", $db);
                $cb->prepareInsert("edo_servicio_parada", $fields);
                $cb->bindValue(":id", $id_parada);
                $cb->bindValue(":id_servicio", $id);
                $cb->bindValue(":fecha", $hoy);
                $cb->bindValue(":direccion", $r["direccion"]);
                $cb->bindValue(":nombre_pasajero", $r["nombre_pasajero"]);
                $cb->bindValue(":latitud_parada", $r["latitud"]);
                $cb->bindValue(":longitud_parada", $r["longitud"]);
                $cb->bindValue(":descripcion_carga", $r["descripcion_carga"]);
                $cb->bindValue(":estado", "SOLICITUD");
                $cb->bindValue(":usuario", $usuario);
                $cb->bindValue(":empresa", $empresa);
                if (!$cb->exec()) {
                    return nwMaker::error($cb->lastErrorText());
                }
            }
        }
        $ca->prepareSelect("edo_favoritos", "id", "direccion=:origen and usuario=:usuario");
        $ca->bindValue(":origen", $p["address_destino"]);
        $ca->bindValue(":usuario", $usuario);
        if (!$ca->exec()) {
            return nwMaker::error($ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            $ca->prepareInsert("edo_favoritos", "nombre,direccion,usuario,empresa,fecha,results");
            $ca->bindValue(":empresa", $empresa);
            $ca->bindValue(":results", $p["dataGeoTwo"]);
            $ca->bindValue(":nombre", $p["dataGeoTwoName"]);
            $ca->bindValue(":direccion", $p["address_destino"]);
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":fecha", $hoy);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText());
            }
        }
        if ($p["tipo_servicio"] == "reservado") {
            $p["id"] = $id;
            servicios_conductor::sendEmailProccess($p, "RESERVA");
        }

        $li = Array();
        $li["modulo"] = "app_pax:::solicita_servicio_app";
        $li["accion"] = "Cliente solicita servicio.";
        $li["comentarios"] = "Fecha dispositivo: {$hoy}";
        $li["id_servicio"] = $id;
        $li["usuario"] = $usuario;
        $li["empresa"] = $empresa;
        $li["perfil"] = 1;
        $li["all_data"] = $p;
        lineTime::save($li);

        $db->commit();
        return $id;
    }

    public static function consecutiveRemittance($d, &$db) {
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_consecutivo_remesas", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $d["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            return nwMaker::error($ca->lastErrorText());
        }
        $conse = $ca->flush();
        if (!empty($conse["rango_inicial"])) {
            $ca->prepareSelect("edo_servicios", 'MAX(remesa) as remesa', "empresa=:empresa");
            $ca->bindValue(":empresa", $d["empresa"]);
            if (!$ca->exec()) {
                $db->rollback();
                return nwMaker::error($ca->lastErrorText());
            }
            $res = $ca->flush();
            if (!empty($res["remesa"])) {
                return $res["remesa"] + 1;
            } else {
                return $conse["rango_inicial"];
            }
        } else {
            return false;
        }
    }

    public static function populateCiudadesHomologadas($p) {
        $p = nwMaker::getData($p);
        if (!servicios::validateActiveCompany($p["empresa"])) {
            return NWJSonRpcServer::error("Esta cuenta se encuentra inactiva");
        }

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $ca->prepare("select * from edo_homologaciones_ciudades where empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }
}
