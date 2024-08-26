<?php

class enrutamiento_masivo {

    public static function traeViajeByID($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $rta = Array();
        $where = "a.id=:id";
        $tables = "edo_servicios a ";
        $tables .= " left join edo_empresas b ON(a.cliente_empresa_id=b.id)";
        $tables .= " left join edo_centro_costos c ON(a.cliente_sede_id=c.id)";
        $tables .= " left join ciudades d ON(a.ciudad_origen=d.nombre)";
        $fields = "a.*,a.cliente_sede_id as sede,a.tipo_servicio as servicio_para";
        $fields .= ",b.nombre as nombre_cliente";
        $fields .= ",c.nombre as nombre_sede";
        $fields .= ",d.id as ciudad_id";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $rta["form"] = $ca->flush();

//        $rta["conductor"] = Array();
        $rta["conductor"] = false;
        $p["trae_uno_driver"] = true;
        if ($rta["form"]["conductor_id"] != null && $rta["form"]["conductor_id"] != "") {
            $r = self::consultaConductores($p);
            if ($r !== 0) {
                $rta["conductor"] = $r;
            }
        }

        $f = "*,direccion as direccion_parada,nombre_pasajero as nombre,descripcion_carga as observacion";
        $f .= ",latitud_parada as latitud,longitud_parada as longitud,ciudad_parada as ciudad";
        $ca->prepareSelect("edo_servicio_parada", $f, "id_servicio=:id and (tipo!='DESTINO_FINAL_EJECUTIVO' or tipo IS NULL) ");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $rta["pasajeros"] = $ca->assocAll();
        return $rta;
    }

    public static function traeTokensApp($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $t = count($p["usuarios"]);
        $ids = "";
        for ($i = 0; $i < $t; $i++) {
            $r = $p["usuarios"][$i];
            $coma = ",";
            if ($i + 1 >= $t) {
                $coma = "";
            }
            $ids .= "'{$r["usuario"]}'{$coma}";
        }
        $perfil = "1";
        $where = "empresa=:empresa ";
        if (isset($p["perfil"])) {
            $where .= " and perfil=:perfil ";
            $perfil = $p["perfil"];
        } else {
            $where .= " and (perfil=1 or perfil=2) ";
        }
        $where .= " and usuario IN({$ids})";
        $ca->prepareSelect("nwmaker_suscriptorsPush", "DISTINCT json,usuario,perfil", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            $db->rollback();
        }
        return $ca->assocAll();
    }

    public static function importarValidaPasajerosRepetidos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $t = count($p);
        $ids = "";
        for ($i = 0; $i < $t; $i++) {
            $r = $p[$i];
            $coma = ",";
            if ($i + 1 >= $t) {
                $coma = "";
            }
            $ids .= "'{$r["direccion"]} {$r["ciudad"]} {$r["pais"]}'{$coma}";
        }
        $where = "empresa=:empresa";
        $where .= " and CONCAT(direccion_parada, ' ', ciudad, ' ', pais) IN({$ids})";
        $ca->prepareSelect("edo_enrutamiento", "DISTINCT direccion_parada,latitud,longitud ", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $total = $ca->size();
        $rt = $ca->assocAll();
        $rta = Array();
        for ($x = 0; $x < $t; $x++) {
            $r = $p[$x];
            $r["existente_en_bd"] = "NO";
            for ($i = 0; $i < $total; $i++) {
                $ra = $rt[$i];
                if ($r["direccion"] == $ra["direccion_parada"]) {
                    if ($ra["latitud"] !== null && $ra["latitud"] !== "") {
                        $r["latitud"] = $ra["latitud"];
                    }
                    if ($ra["longitud"] !== null && $ra["longitud"] !== "") {
                        $r["longitud"] = $ra["longitud"];
                    }
                    $r["existente_en_bd"] = "SI";
                }
            }
            $rta[] = $r;
        }
        return $rta;
    }

    public static function populatePlantillas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sede = null;
        $where = "empresa=:empresa";
        if (isset($p["sede"])) {
            $where .= " and sede=:sede";
            $sede = $p["sede"];
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("edo_plantillas_viajes", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":sede", $sede);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function crearPlantilla($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $db->transaction();
        $si = session::info();
        $fields = "empresa, usuario, fecha, nombre,data,cliente,sede,rutas";
        $ca->prepareInsert("edo_plantillas_viajes", $fields);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":data", $p["data"]);
        $ca->bindValue(":cliente", $p["cliente"]);
        $ca->bindValue(":sede", $p["sede"]);
        $ca->bindValue(":rutas", $p["rutas"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function crearServicioMasivoRutas($p) {
        $total = count($p["rutas"]);
        $estado = "SOLICITUD";
        if (isset($p["estado_servicio"])) {
            $estado = $p["estado_servicio"];
        }
        $res = "";
        for ($i = 0; $i < $total; $i++) {
            $r = $p["rutas"][$i];
            $r["masivo"] = true;

            $r["estado_servicio"] = $estado;

            $r["form"]["cliente"] = $p["form"]["cliente"];
            $r["form"]["cliente_array"] = $p["form"]["cliente_array"];
            $r["form"]["sede"] = $p["form"]["sede"];
            $r["form"]["sede_model"] = $p["form"]["sede_model"];

            $fecha = null;
            $hora = null;
            if (isset($p["form"]["fecha"])) {
                $fecha = $p["form"]["fecha"];
            }
            if (isset($r["form"]["fecha"])) {
                $fecha = $r["form"]["fecha"];
            }
            if (isset($p["form"]["hora"])) {
                $hora = $p["form"]["hora"];
            }
            if (isset($r["form"]["hora"])) {
                $hora = $r["form"]["hora"];
            }
            if (isset($p["form"]["usar_fecha_global"])) {
                if ($p["form"]["usar_fecha_global"] === true || $p["form"]["usar_fecha_global"] === "true") {
                    $fecha = $p["form"]["fecha"];
                }
            }

            $r["form"]["fecha"] = $fecha;
            $r["form"]["hora"] = $hora;

            if (!isset($r["form"]["sentido"])) {
                $r["form"]["sentido"] = $p["form"]["sentido"];
            }
            $n = self::crearServicio($r);
            $res .= "#{$n}";
        }
        return $res;
    }

    public static function crearServicio($p) {
        session::check();
        $si = session::info();
        $origen_ciudad = "";
//        NWJSonRpcServer::console($p);
        $origen_pais = "";

        $sentido = $p["form"]["sentido"];
        if (isset($p["masivo"]) && $p["masivo"] == true) {
            $cliente_direccion = $p["form"]["sede_model"]["direccion"];
            $cliente_latitud = $p["form"]["sede_model"]["latitud"];
            $cliente_longitud = $p["form"]["sede_model"]["longitud"];
            $cliente_ciudad = $p["form"]["sede_model"]["ciudad_text"];

            if (isset($p["pasajeros"][0]["direccion_origen"])) {
                $cliente_direccion = $p["pasajeros"][0]["direccion_origen"];
            }
            if (isset($p["pasajeros"][0]["latitud_longitud_origen"])) {
                if (isset(explode(",", $p["pasajeros"][0]["latitud_longitud_origen"])[0])) {
                    $cliente_latitud = explode(",", $p["pasajeros"][0]["latitud_longitud_origen"])[0];
                }
                if (isset(explode(",", $p["pasajeros"][0]["latitud_longitud_origen"])[1])) {
                    $cliente_longitud = explode(",", $p["pasajeros"][0]["latitud_longitud_origen"])[1];
                }
            }
            if (isset($p["pasajeros"][0]["ciudad_origen"])) {
                $cliente_ciudad = $p["pasajeros"][0]["ciudad_origen"];
            }

            $pasajero1_direccion = $p["pasajeros"][0]["direccion"];
            $pasajero1_latitud = $p["pasajeros"][0]["latitud"];
            $pasajero1_longitud = $p["pasajeros"][0]["longitud"];
            $pasajero1_ciudad = $p["pasajeros"][0]["ciudad"];

            //ENTRADA
            $origen_direccion = $pasajero1_direccion;
            $origen_ciudad = $pasajero1_ciudad;
            $origen_latitud = $pasajero1_latitud;
            $origen_longitud = $pasajero1_longitud;
            $destino_direccion = $cliente_direccion;
            $destino_ciudad = $cliente_ciudad;
            $destino_latitud = $cliente_latitud;
            $destino_longitud = $cliente_longitud;
            if ($sentido == "SALIDA") {
                $origen_direccion = $cliente_direccion;
                $origen_ciudad = $cliente_ciudad;
                $origen_latitud = $cliente_latitud;
                $origen_longitud = $cliente_longitud;
                $destino_direccion = $pasajero1_direccion;
                $destino_ciudad = $pasajero1_ciudad;
                $destino_latitud = $pasajero1_latitud;
                $destino_longitud = $pasajero1_longitud;
            }
        } else {
            $origen_direccion = $p["form"]["direccion_a"];
            $origen_latitud = $p["form"]["direccion_a_latitud"];
            $origen_longitud = $p["form"]["direccion_a_longitud"];
            $origen_ciudad = $p["form"]["direccion_a_ciudad"];
            if (isset($p["form"]["direccion_a_pais"])) {
                $origen_pais = $p["form"]["direccion_a_pais"];
            }

            $destino_direccion = $p["form"]["direccion_b"];
            $destino_latitud = $p["form"]["direccion_b_latitud"];
            $destino_longitud = $p["form"]["direccion_b_longitud"];
            $destino_ciudad = $p["form"]["direccion_b_ciudad"];
        }



        $r = Array();
        $r["adjunto_cotizacion"] = $p["form"]["adjunto_cotizacion"];
        if (isset($p["form"]["booking_id_journey"]) && $p["form"]["booking_id_journey"] !== "") {
            $r["booking_id_journey"] = $p["form"]["booking_id_journey"];
        }

        $r["tipo_urbanrural"] = "urbano";
        if ($origen_ciudad != $destino_ciudad) {
            $r["tipo_urbanrural"] = "intermunicipal";
        }

        if (isset($p["form"]["moneda"]) && $p["form"]["moneda"] !== "") {
            $r["moneda"] = $p["form"]["moneda"];
        }
        if (isset($p["form"]["id_servicio_enc"]) && $p["form"]["id_servicio_enc"] !== "") {
            $r["id"] = $p["form"]["id_servicio_enc"];
        }
        if (isset($p["form"]["flota"]) && $p["form"]["flota"] !== "") {
            $r["flota_id"] = $p["form"]["flota"];
            $r["flota_text"] = $p["form"]["flota_array"]["nombre"];
        }
        if (isset($p["form"]["observaciones_servicio"]) && $p["form"]["observaciones_servicio"] !== "") {
            $r["observaciones_servicio"] = $p["form"]["observaciones_servicio"];
        }
        if (isset($p["form"]["vuelo_numero"]) && $p["form"]["vuelo_numero"] !== "") {
            $r["vuelo_numero"] = $p["form"]["vuelo_numero"];
        }
        if (isset($p["form"]["terminal"]) && $p["form"]["terminal"] !== "") {
            $r["terminal"] = $p["form"]["terminal"];
        }
        $r["servicio_para"] = "reservado";
        if (isset($p["form"]["servicio_para"]) && $p["form"]["servicio_para"] !== "") {
            $r["servicio_para"] = $p["form"]["servicio_para"];
        }
        $r["creado_por_pc"] = "Back";
        if (isset($p["form"]["creado_por_pc"])) {
//            if (isset($p["form"]["creado_por_pc_model"]) && $p["form"]["creado_por_pc_model"] != "" && $p["form"]["creado_por_pc_model"] != null) {
//                $r["creado_por_pc_id"] = $p["form"]["creado_por_pc"];
//                $p["form"]["creado_por_pc"] = $p["form"]["creado_por_pc_text"];
//            }

            $r["creado_por_pc"] = $p["form"]["creado_por_pc"];
        }
        if (isset($p["form"]["trf"])) {
            $r["trf"] = $p["form"]["trf"];
        }
        if (isset($p["form"]["trf_text"])) {
            $r["trf_text"] = $p["form"]["trf_text"];
        }
        $r["estado"] = "SOLICITUD";
        if (isset($p["estado_servicio"])) {
            $r["estado"] = $p["estado_servicio"];
        }
        if (isset($p["fecha_creacion"])) {
            $r["fecha_creacion"] = $p["fecha_creacion"];
        }
        if (isset($p["fecha_asignacion_para_conductor"])) {
            $r["fecha_asignacion_para_conductor"] = $p["fecha_asignacion_para_conductor"];
        }
        $r["sentido"] = $sentido;

        //valores
        if (isset($p["tiempo_estimado"])) {
            $r["tiempo_estimado"] = $p["tiempo_estimado"];
        }
//        if (isset($p["tiempo"])) {
//            $r["tiempo"] = $p["tiempo"];
//        }
        if (isset($p["times_dis_travel_gps"])) {
            $r["times_dis_travel_gps"] = $p["times_dis_travel_gps"];
        }
        if (isset($p["total_metros"])) {
            $r["total_metros"] = $p["total_metros"];
        }
        //tiempo
        $r["fecha"] = $p["form"]["fecha"];
        $r["hora"] = $p["form"]["hora"];

        //info empresa cliente y sede
        if (isset($p["form"]["cliente"]) && $p["form"]["cliente"] !== "" && $p["form"]["cliente"] !== null && $p["form"]["cliente"] !== false) {
            $r["cliente_empresa_id"] = $p["form"]["cliente"];
        }
        if (isset($p["form"]["sede"]) && $p["form"]["sede"] !== "" && $p["form"]["sede"] !== null && $p["form"]["sede"] !== false) {
            $r["cliente_sede_id"] = $p["form"]["sede"];
        }

        //info user app
        if (isset($p["form"]["usuario_array"]) && $p["form"]["usuario_array"] != null && $p["form"]["usuario_array"] != false && $p["form"]["usuario_array"] != "") {
            $r["usuario"] = $p["form"]["usuario_array"]["id"];
            $r["usuario_text"] = $p["form"]["usuario_array"]["usuario"];
            $r["nombre_usuario"] = $p["form"]["usuario_array"]["nombre"];
            $r["celular_usuario"] = $p["form"]["usuario_array"]["celular"];
        } else
//        if (isset($p["form"]["sede_model"]) && $p["form"]["sede_model"] != null && $p["form"]["sede_model"] != false && $p["form"]["sede_model"] != "") {
        if (nwMaker::evalueData($p["form"]["sede_model"])) {
            $r["usuario"] = $p["form"]["sede_model"]["cliente_usuario_id"];
            $r["usuario_text"] = $p["form"]["sede_model"]["cliente_usuario"];
            $r["nombre_usuario"] = $p["form"]["sede_model"]["cliente_usuario"];
            $r["celular_usuario"] = $p["form"]["sede_model"]["telefono"];
        }
        if (isset($p["form"]["cliente"]) && nwMaker::evalueData($p["form"]["cliente"])) {
            $r["bodega"] = $p["form"]["cliente"];
        }
        if (isset($p["form"]["cliente_array"]["nombre"]) && nwMaker::evalueData($p["form"]["cliente_array"]["nombre"])) {
            $r["bodega_text"] = $p["form"]["cliente_array"]["nombre"];
        }
        if (isset($p["form"]["valor"]) && nwMaker::evalueData($p["form"]["valor"])) {
            $r["valor_viaje"] = $p["form"]["valor"];
        }

        //ubicación origen
        $r["latitudOri"] = $origen_latitud;
        $r["longitudOri"] = $origen_longitud;
        $r["origen"] = $origen_direccion;
        $r["ciudad_origen"] = $origen_ciudad;
        $r["pais_origen"] = $origen_pais;
        $r["ciudad_conductores_id"] = $p["form"]["ciudad"];
        $r["ciudad_conductores_nombre"] = $p["form"]["ciudad_text"];
        //ubicación destino
        $r["latitudDes"] = $destino_latitud;
        $r["longitudDes"] = $destino_longitud;
        $r["ciudad_destino"] = $destino_ciudad;
        $r["destino"] = $destino_direccion;
        //driver info
        if ($p["conductor"] != false) {
            $r["conductor"] = $p["conductor"]["id"];
            $r["conductor_text"] = $p["conductor"]["nombre"];
            $r["usuario_cond"] = $p["conductor"]["usuario_cliente"];
            $r["placa"] = $p["conductor"]["placa"];
            $r["marca"] = $p["conductor"]["marca"];
            $r["vehiculo_text"] = $p["conductor"]["marca_text"];
            $r["vehiculo"] = $p["conductor"]["id"];
            $r["id_tarifa"] = $p["conductor"]["servicios_driver"][0]["id"];
            $r["tipo_servicio"] = $p["conductor"]["servicios_driver"][0]["id"];
            $r["subcategoria_servicio"] = $p["conductor"]["servicios_driver"][0]["id"];
            $r["subcategoria_servicio_text"] = $p["conductor"]["servicios_driver"][0]["nombre"];
        }


        if (!isset($p["editaViajeDesdeHistorico"])) {
            $r["code_verifi_service"] = rand(1000, 9999);
            $r["code_verifi_service_fin"] = rand(1000, 9999);

            $r["tipo_tarifa"] = "trayecto";
            $r["valor_recargo_ruta_fija"] = "0";
            $r["valorbase"] = "0";
            $r["valorminutos"] = "0";
            $r["valordistancia"] = "0";
            $r["total_metros"] = "0";
            $r["valor_unidad_tiempo"] = "0";
            $r["valor_unidad_metros"] = "0";
            $r["valor_tarifa_minima"] = "0";
        }
//        if (!isset($r["tipo_servicio"])) {
        if (isset($p["form"]["tipo_servicio"]) && $p["form"]["tipo_servicio"] !== "") {
            $r["id_tarifa"] = $p["form"]["tipo_servicio"];
            $r["tipo_servicio"] = $p["form"]["tipo_servicio"];
            $r["subcategoria_servicio"] = $p["form"]["tipo_servicio"];
            if (isset($p["form"]["tipo_servicio_model"]) && $p["form"]["tipo_servicio_model"] !== "") {
                $r["subcategoria_servicio_text"] = $p["form"]["tipo_servicio_model"]["nombre_solo"];
                if (isset($p["form"]["tipo_servicio_model"]["others"]) && $p["form"]["tipo_servicio_model"]["others"] !== "") {
                    $r["valor_recargo_ruta_fija"] = $p["form"]["tipo_servicio_model"]["others"]["recargos"];
                    $r["valorbase"] = $p["form"]["tipo_servicio_model"]["others"]["valorbase"];
                    $r["valorminutos"] = $p["form"]["tipo_servicio_model"]["others"]["valorminutos"];
                    $r["valordistancia"] = $p["form"]["tipo_servicio_model"]["others"]["valordistancia"];
                    $r["total_metros"] = $p["form"]["tipo_servicio_model"]["others"]["totalunimetros"];
                }

                if (isset($p["form"]["tipo_servicio_model"]["servi"]) && nwMaker::evalueData($p["form"]["tipo_servicio_model"]["servi"])) {
                    $r["valor_unidad_tiempo"] = $p["form"]["tipo_servicio_model"]["servi"]["valor_unidad_tiempo"];
                    $r["valor_unidad_metros"] = $p["form"]["tipo_servicio_model"]["servi"]["valor_unidad_metros"];
                    $r["valor_tarifa_minima"] = $p["form"]["tipo_servicio_model"]["servi"]["minima"];
                }
                if (isset($p["form"]["tipo_servicio_model"]["valor_tarifa_fija"]) && nwMaker::evalueData($p["form"]["tipo_servicio_model"]["valor_tarifa_fija"])) {
                    $r["tipo_tarifa"] = "tarifa_fija";
                }
            }
        }
//        }

        if ($sentido == "EJECUTIVO") {
            $pas = Array();
            $pas["direccion"] = $p["form"]["direccion_b"];
            $pas["latitud_parada"] = $p["form"]["direccion_b_latitud"];
            $pas["longitud_parada"] = $p["form"]["direccion_b_longitud"];
            $pas["ciudad"] = $p["form"]["direccion_b_ciudad"];
            if (isset($r["nombre_usuario"]) && nwMaker::evalueData($r["nombre_usuario"])) {
                $pas["nombre_pasajero"] = $r["nombre_usuario"];
            }
            if (isset($r["celular_usuario"]) && nwMaker::evalueData($r["celular_usuario"])) {
                $pas["telefono"] = $r["celular_usuario"];
            }
            $pas["descripcion_carga"] = "Destino final";
            $pas["tipo"] = "DESTINO_FINAL_EJECUTIVO";

            $p["pasajeros"][count($p["pasajeros"])] = $pas;
        }

        $pasajeros = Array();
        for ($i = 0; $i < count($p["pasajeros"]); $i++) {
//        for ($i = 0; $i < $totalParadas; $i++) {
            $pasajeros[$i] = $p["pasajeros"][$i];
            if (isset($p["pasajeros"][$i]["direccion"])) {

                $pasajeros[$i]["direccion_origen"] = $p["pasajeros"][$i]["direccion"];
            } else {
                $pasajeros[$i]["direccion_origen"] = "";
                $p["pasajeros"][$i]["direccion"] = "";
            }
//                $pasajeros[$i]["direccion_destino"] = $cliente_direccion;
            $pasajeros[$i]["direccion_destino"] = $destino_direccion;
//                if ($sentido == "SALIDA") {
//                    $pasajeros[$i]["direccion_origen"] = $cliente_direccion;
//                    $pasajeros[$i]["direccion_destino"] = $p["pasajeros"][$i]["direccion"];
//                }
        }
        $r["parada"] = $pasajeros;

        if (count($p["pasajeros"]) <= 1) {
            if (nwMaker::evalueData($p["form"]["paradas_adicionales_iniciales_creacion"])) {
                $r["total_pasajeros"] = $p["form"]["paradas_adicionales_iniciales_creacion"];
            }
        }
        if (isset($p["form"]["tipo_pago"])) {
            if (isset($p["form"]["tipo_pago_model"]) && $p["form"]["tipo_pago_model"] != "" && $p["form"]["tipo_pago_model"] != null) {
                $r["tipo_pago_id"] = $p["form"]["tipo_pago"];
                $p["form"]["tipo_pago"] = $p["form"]["tipo_pago_text"];
            }

            if (nwMaker::evalueData($p["form"]["tipo_pago"])) {
                $r["tipo_pago"] = $p["form"]["tipo_pago"];
            }
        }
        if (isset($p["configCliente"])) {
            if (nwMaker::evalueData($p["configCliente"])) {
                $r["configCliente"] = $p["configCliente"];
            }
        }
        $rta = servicios_admin::saveServicio($r);
        return $rta;
    }

    public static function populateLotes($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa and lote IS NOT NULL order by lote asc";
        $ca->prepareSelect("edo_enrutamiento", "DISTINCT lote as nombre, lote as id", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function importarPasajeros($p) {
        session::check();
        $si = session::info();
        $lote = $si["usuario"] . "-" . date("Y-m-d H:i:s");
        if (isset($p["form"]["lote"]) && $p["form"]["lote"] !== "") {
            $lote = $p["form"]["lote"];
        }
        for ($i = 0; $i < count($p["rows"]); $i++) {
            $r = $p["rows"][$i];
            if ($p["form"]["validar_existentes"] == "SI") {
                if (isset($r["existente_en_bd"]) && $r["existente_en_bd"] == "SI") {
                    continue;
                }
            }
            $r["direccion_parada"] = $r["direccion"];
            if (isset($r["fecha"])) {
                $r["fecha_del_servicio"] = $r["fecha"];
            }
            if (isset($r["hora"])) {
                $r["hora_del_servicio"] = $r["hora"];
            }
            $r["lote"] = $lote;
            $send = self::saveParada($r);
            if ($send !== true) {
                return $send;
            }
        }
        return true;
    }

    public static function saveParada($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $db->transaction();
        $si = session::info();
        $lote = "";
        if (isset($p["lote"])) {
            $lote = $p["lote"];
        }
        $fecha_del_servicio = null;
        if (isset($p["fecha_del_servicio"])) {
            $fecha_del_servicio = $p["fecha_del_servicio"];
        }
        $hora_del_servicio = null;
        if (isset($p["hora_del_servicio"])) {
            $hora_del_servicio = $p["hora_del_servicio"];
        }
        $latitud = null;
        if (isset($p["latitud"])) {
            $latitud = $p["latitud"];
        }
        $longitud = null;
        if (isset($p["longitud"])) {
            $longitud = $p["longitud"];
        }
        $observacion = "";
        if (isset($p["observacion"])) {
            $observacion = $p["observacion"];
        }
        $pais = "";
        if (isset($p["pais"])) {
            $pais = $p["pais"];
        }
        $ciudad = "";
        if (isset($p["ciudad"])) {
            $ciudad = $p["ciudad"];
        }
        $correo = null;
        if (isset($p["correo"])) {
            $correo = $p["correo"];
        }
        $documento = null;
        if (isset($p["documento"])) {
            $documento = $p["documento"];
        }
        $telefono = null;
        if (isset($p["telefono"])) {
            $telefono = $p["telefono"];
        }
        $usuario_pasajero = null;
        if (isset($p["usuario_pasajero"])) {
            $usuario_pasajero = $p["usuario_pasajero"];
        }
        $fields = "empresa, usuario, fecha, nombre,direccion_parada,observacion,estado,ciudad,"
                . "pais,longitud,latitud,fecha_del_servicio,hora_del_servicio,correo,lote,documento,telefono,usuario_pasajero";
        $ca->prepareInsert("edo_enrutamiento", $fields);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":direccion_parada", $p["direccion_parada"]);
        $ca->bindValue(":correo", $correo);
        $ca->bindValue(":ciudad", $ciudad);
        $ca->bindValue(":pais", $pais);
        $ca->bindValue(":observacion", $observacion);
        $ca->bindValue(":estado", "SIN_ENRUTAR");
        $ca->bindValue(":longitud", $longitud);
        $ca->bindValue(":latitud", $latitud);
        $ca->bindValue(":fecha_del_servicio", $fecha_del_servicio);
        $ca->bindValue(":hora_del_servicio", $hora_del_servicio);
        $ca->bindValue(":lote", $lote);
        $ca->bindValue(":documento", $documento);
        $ca->bindValue(":telefono", $telefono);
        $ca->bindValue(":usuario_pasajero", $usuario_pasajero);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return true;
    }

    public static function consultaConductores($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "c.empresa=:empresa  and c.perfil=2 and c.estado='activo' ";
        $where .= " and v.empresa=:empresa  ";
//        $where .= " and v.activacion_cliente='SI' ";
//        $where .= " and c.estado_activacion='1' ";
        $where .= " and v.estado_activacion='1' ";
//        $where .= " and v.estado_activacion_text='activo' ";

        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        if (isset($p["permisos"])) {
            if (isset($p["permisos"]["filtrar_por_flota"])) {
                if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                    $where .= " and c.bodega=:flota ";
                }
            }
            if (isset($p["permisos"]["filtrar_por_terminal"])) {
                if ($p["permisos"]["filtrar_por_terminal"] === "true" || $p["permisos"]["filtrar_por_terminal"] === true) {
                    $where .= " and c.terminal=:terminal ";
                }
            }
        }

        if (isset($p["ciudad"]) && $p["ciudad"] != "") {
            $where .= " and c.ciudad=:ciudad ";
            $ca->bindValue(":ciudad", $p["ciudad"]);
        }
        if (isset($p["conductor_id"]) && $p["conductor_id"] != "") {
            $where .= " and c.id=:conductor_id ";
            $ca->bindValue(":conductor_id", $p["conductor_id"]);
        }
        if (isset($p["libres"]) && $p["libres"] != "") {
            if ($p["libres"] == "true") {
                $where .= " and c.ocupado='NO' ";
            }
        }
        if (isset($p["ocupados"]) && $p["ocupados"] != "") {
            if ($p["ocupados"] == "true") {
                $where .= " and c.ocupado='SI' ";
            }
        }
        if (isset($p["en_linea"]) && $p["en_linea"] != "") {
            if ($p["en_linea"] == "true") {
                $fecha_hora = nwMaker::sumaRestaFechas("+0 hour", "-5 minute", "+0 second");
                $where .= " and c.fecha_ultima_conexion >= '{$fecha_hora}' ";
            }
        }
        if (isset($p["buscar_conductor"]) && $p["buscar_conductor"] != "") {
            $campos = "c.ciudad_text,v.placa,c.documento,c.nit,c.nombre,c.apellido,c.usuario_cliente,c.email";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["buscar_conductor"], true);
            $ca->bindValue(":buscar_conductor", $p["buscar_conductor"]);
        }
//        if (isset($p["servicio_filtro"]) && $p["servicio_filtro"] != "") {
//            $where .= " and JSON_SEARCH(c.servicios_activos, 'all', {$p["servicio_filtro"]}, null, '$[*].id') ";
//        }
        $where .= " order by c.nombre asc";

        $fields = "c.fecha_ultima_conexion,c.latitud,c.longitud,c.id,c.nit,c.servicios_activos,c.usuario_cliente,c.hora_inicio,c.hora_fin";
        $fields .= ",c.preoperacional_ultima_fecha,c.preoperacional_novedad_encontrada,c.fecha_vencimiento,c.no_licencia,c.celular";
        $fields .= ",c.offline,c.ocupado,c.foto_perfil";
        $fields .= ",CONCAT(c.nombre, ' ', c.apellido) as nombre";
        //fields vehículo
        $fields .= ",v.capacidad_pasajeros as num_personas, v.num_maletas,v.placa,v.modelo,v.fecha_vencimiento_soat";
        $fields .= ",v.estado_activacion_text,v.fecha_vencimiento_tegnomecanica,v.vehiculo_publico_particular";
        $fields .= ",v.marca_text,v.marca";

        $tables = "pv_clientes c ";
        $tables .= "left join edo_vehiculos v on (c.id=v.id_usuario or c.usuario_cliente=v.usuario or v.id_otros_conductores LIKE concat('%{',c.id,'}%') )";

        $where = str_replace("::text", "", $where);
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":flota", $flota, true);
        if (isset($p["trae_uno_driver"])) {
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
            if ($ca->size() === 0) {
                return 0;
            }
            return $ca->flush();
//        return $ca->assocAll();
        } else {
            return $ca->execPage($p);
        }
    }

    public static function populateTokenPasajerosapp($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa ";
        if ($p["token"] != "") {
//            $campos = "nombre,telefono,correo,documento,usuario_pasajero";
            $campos = "documento,usuario_pasajero";
//            $campos = "documento";
//            $campos = "nombre,correo,documento,direccion_parada,telefono,latitud,longitud,ciudad,pais,observacion,usuario_pasajero";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $fields = "DISTINCT nombre,correo,documento,direccion_parada,telefono,latitud,longitud,ciudad,pais,observacion,usuario_pasajero";
        $ca->prepareSelect("edo_enrutamiento", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenTerminales($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa  ";
        if (isset($p["token"]) && $p["token"] != "") {
            $campos = "nombre";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("terminales", "id,nombre", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenTiposServicio($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa  ";
        if (isset($p["token"]) && $p["token"] != "") {
            $campos = "nombre";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $fields = "id,nombre,metros,tiempo,valor_unidad_tiempo,valor_unidad_metros,minima";
        $ca->prepareSelect("edo_taximetro", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenFlotas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa and tipo_empresa='Flota' ";
        if (isset($p["token"]) && $p["token"] != "") {
            $campos = "nombre,nit";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_empresas", "id,nombre", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenClientes($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa and tipo_empresa='Cliente' ";
        if (isset($p["token"]) && $p["token"] != "") {
            $campos = "nombre,nit";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        if (isset($p["set_id_cliente"]) && $p["set_id_cliente"] != "") {
            $where .= " and id=:id ";
            $ca->bindValue(":id", $p["set_id_cliente"]);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_empresas", "id,nombre", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenCiudades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 ";
        if ($p["token"] != "") {
            $campos = "nombre";
            $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["token"], true);
        }
        $where .= " order by nombre asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("ciudades", "id,nombre,latitud,longitud", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        //alexf: Se quita filtro usuario por última milla 14jul2023
//        $where = " usuario=:usuario and empresa=:empresa ";
        $where = " empresa=:empresa ";
//        $where .= " and estado='SIN_ENRUTAR' ";
//        if (isset($p["ciudad"])) {
//            if ($p["ciudad"] !== "") {
//                $campos = "ciudad";
//                $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["ciudad"][0]["nombre"], true);
//            }
//        }
        if (isset($p["filters"])) {
            if (isset($p["filters"]["estado"]) && $p["filters"]["estado"] != "TODOS") {
                $where .= " and estado=:estado ";
                $ca->bindValue(":estado", $p["filters"]["estado"]);
//                NWJSonRpcServer::error("Error ejecutando la consulta: " . $p["estado"]);
            }
//            if (isset($p["filters"]["lote"])) {
//                if ($p["filters"]["lote"]["lote"] !== "") {
//                    $where .= " and lote=:lote ";
//                    $ca->bindValue(":lote", $p["filters"]["lote"]["lote_model"]["nombre"]);
//                }
//            }
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= "and fecha_del_servicio BETWEEN :fecha_inicial and :fecha_final ";
                $ca->bindValue(":fecha_inicial", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
            }
            if ($p["filters"]["hora_inicial"] != "" && $p["filters"]["hora_final"] != "") {
                $where .= "and hora_del_servicio BETWEEN :hora_inicial and :hora_final ";
                $ca->bindValue(":hora_inicial", $p["filters"]["hora_inicial"]);
                $ca->bindValue(":hora_final", $p["filters"]["hora_final"]);
            }
        }
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_enrutamiento", "*", $where);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }
}
