<?php

class configuracion_maestros {

    //tmovilmove_nwmaker
    public static function Save($p) {
//        NWJSonRpcServer::console($p);
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();

        $fields = "empresa,usuario,servicios_para,tipo_pago,cod_promocional,paradas_adicional,tipo_servicio,"
                . "cobro_con,marca,modelo,color,imagen_vehi,numero_puertas,capacidad_pasajeros,"
                . "usar_descripcion_carroceria,capacidad_carga_kg,capacidad_volumen_m3,tarjeta_propiedad_trasera,"
                . "revision_tegnomecanica,direccion_domicilio,telefono,afp,eps,referencias_per_lab,"
                . "documento_imagen_respaldo,pedir_datos_propietario_vehiculo,arl,soat,"
                . "fecha_vencimiento_soat,foto_soat,tarifa,documentos_adic,usa_servicios,"
                . "metros_para_aceptar_servicio,metros_para_confirmar_llegada,pide_vehiculo_conductores,"
                . "pide_documentos_conductores,mostrar_direccion_destino,valor_minimo_pago_credito,"
                . "app_para,mostrar_valor_conductor,hoja_vida,antecedentes,cancela_conductor,"
                . "valor_minimo_retiro,dias_maximo_pago,tope_maximo_pago,rango_modelo_vheiculo,"
                . "texto_boton_a_donde_vas,texto_boton_confirmar_abordaje,texto_boton_llegada_destino";

        if ($p["id"] == "") {
            $ca->prepareInsert("edo_configuraciones", $fields);
        } else {
            $ca->prepareUpdate("edo_configuraciones", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }

        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(':servicios_para', $p["servicios_para"]);
        $ca->bindValue(':tipo_pago', $p["tipo_pago"]);
        $ca->bindValue(':cod_promocional', $p["cod_promocional"]);
        $ca->bindValue(':paradas_adicional', $p["paradas_adicional"]);
        $ca->bindValue(':tipo_servicio', $p["tipo_servicio"]);
        $ca->bindValue(':cobro_con', $p["cobro_con"]);
        $ca->bindValue(':marca', $p["marca"]);
        $ca->bindValue(':modelo', $p["modelo"]);
        $ca->bindValue(':color', $p["color"]);
        $ca->bindValue(':imagen_vehi', $p["imagen_vehi"]);
        $ca->bindValue(':numero_puertas', $p["numero_puertas"]);
        $ca->bindValue(':capacidad_pasajeros', $p["capacidad_pasajeros"]);
        $ca->bindValue(':usar_descripcion_carroceria', $p["usar_descripcion_carroceria"]);
        $ca->bindValue(':capacidad_carga_kg', $p["capacidad_carga_kg"]);
        $ca->bindValue(':capacidad_volumen_m3', $p["capacidad_volumen_m3"]);
        $ca->bindValue(':tarjeta_propiedad_trasera', $p["tarjeta_propiedad_trasera"]);
        $ca->bindValue(':revision_tegnomecanica', $p["revision_tegnomecanica"]);
        $ca->bindValue(':direccion_domicilio', $p["direccion_domicilio"]);
        $ca->bindValue(':telefono', $p["telefono"]);
        $ca->bindValue(':afp', $p["afp"]);
        $ca->bindValue(':eps', $p["eps"]);
        $ca->bindValue(':referencias_per_lab', $p["referencias_per_lab"]);
        $ca->bindValue(':documento_imagen_respaldo', $p["documento_imagen_respaldo"]);
        $ca->bindValue(':pedir_datos_propietario_vehiculo', $p["pedir_datos_propietario_vehiculo"]);
        $ca->bindValue(':arl', $p["arl"]);
        $ca->bindValue(':soat', $p["soat"]);
        $ca->bindValue(':fecha_vencimiento_soat', $p["fecha_vencimiento_soat"]);
        $ca->bindValue(':foto_soat', $p["foto_soat"]);
        $ca->bindValue(':tarifa', $p["tarifa"]);
        $ca->bindValue(':documentos_adic', $p["documentos_adic"]);
        $ca->bindValue(':usa_servicios', $p["usa_servicios"]);
        $ca->bindValue(':metros_para_aceptar_servicio', $p["metros_para_aceptar_servicio"]);
        $ca->bindValue(':metros_para_confirmar_llegada', $p["metros_para_confirmar_llegada"]);
        $ca->bindValue(':pide_vehiculo_conductores', $p["pide_vehiculo_conductores"]);
        $ca->bindValue(':pide_documentos_conductores', $p["pide_documentos_conductores"]);
        $ca->bindValue(':mostrar_direccion_destino', $p["mostrar_direccion_destino"]);
        $ca->bindValue(':valor_minimo_pago_credito', $p["valor_minimo_pago_credito"]);
        $ca->bindValue(':app_para', $p["app_para"]);
        $ca->bindValue(':mostrar_valor_conductor', $p["mostrar_valor_conductor"]);
        $ca->bindValue(':hoja_vida', $p["hoja_vida"]);
        $ca->bindValue(':antecedentes', $p["antecedentes"]);
        $ca->bindValue(':cancela_conductor', $p["cancela_conductor"]);
        $ca->bindValue(':valor_minimo_retiro', $p["valor_minimo_retiro"]);
        $ca->bindValue(':dias_maximo_pago', $p["dias_maximo_pago"]);
        $ca->bindValue(':tope_maximo_pago', $p["tope_maximo_pago"]);
        $ca->bindValue(':rango_modelo_vheiculo', $p["rango_modelo_vheiculo"]);
        $ca->bindValue(':texto_boton_a_donde_vas', $p["texto_boton_a_donde_vas"]);
        $ca->bindValue(':texto_boton_confirmar_abordaje', $p["texto_boton_confirmar_abordaje"]);
        $ca->bindValue(':texto_boton_llegada_destino', $p["texto_boton_llegada_destino"]);
//          NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function queryConfiguration($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("edo_configuraciones", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function SaveTarifa($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $fields = "usuario,empresa,fecha,metros,tiempo,valor_unidad_tiempo,valor_unidad_metros,valor_banderazo,"
                . "iva,minima,tipo_servicio,valor_mascota,icono,solo_para_mujeres,orden,"
                . "pide_vehiculo_cliente,mostrar_fecha_hora,minutos_agregar_a_fecha,descuento_maximo,"
                . "reservar,nombre,cargue,descargue,porcentaje_valor_declarado,retorno,minutosMinimosParaPedirService";
        if ($p["id"] == "") {
            $ca->prepareInsert("edo_taximetro", $fields);
        } else {
            $ca->prepareUpdate("edo_taximetro", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(':usuario', $si['usuario']);
        $ca->bindValue(':empresa', $si['empresa']);
        $ca->bindValue(':fecha', date("Y-m-d"));
        $ca->bindValue(':metros', $p['metros'], true, true);
        $ca->bindValue(':tiempo', $p['tiempo'], true, true);
        $ca->bindValue(':valor_unidad_tiempo', $p['valor_unidad_tiempo'], true, true);
        $ca->bindValue(':valor_unidad_metros', $p['valor_unidad_metros'], true, true);
        $ca->bindValue(':valor_banderazo', $p['valor_banderazo'], true, true);
        $ca->bindValue(':iva', $p['iva'], true, true);
        $ca->bindValue(':minima', $p['minima'], true, true);
        $ca->bindValue(':tipo_servicio', $p['tipo_servicio'], true, true);
        $ca->bindValue(':valor_mascota', $p['valor_mascota'], true, true);
        $ca->bindValue(':icono', $p['icono'], true, true);
        $ca->bindValue(':solo_para_mujeres', $p['solo_para_mujeres'], true, true);
        $ca->bindValue(':orden', $p['orden'], true, true);
        $ca->bindValue(':pide_vehiculo_cliente', $p['pide_vehiculo_cliente'], true, true);
        $ca->bindValue(':mostrar_fecha_hora', $p['mostrar_fecha_hora'], true, true);
        $ca->bindValue(':minutos_agregar_a_fecha', $p['minutos_agregar_a_fecha'], true, true);
        $ca->bindValue(':descuento_maximo', $p['descuento_maximo'], true, true);
        $ca->bindValue(':reservar', $p['reservar'], true, true);
        $ca->bindValue(':nombre', $p['nombre'], true, true);
        $ca->bindValue(':cargue', $p['cargue'], true, true);
        $ca->bindValue(':descargue', $p['descargue'], true, true);
        $ca->bindValue(':porcentaje_valor_declarado', $p['porcentaje_valor_declarado'], true, true);
        $ca->bindValue(':retorno', $p['retorno'], true, true);
        $ca->bindValue(':minutosMinimosParaPedirService', $p['minutosMinimosParaPedirService'], true, true);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function consultaTarifas($p) {
//          NWJSonRpcServer::console($p);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();

        $where = "empresa =:empresa";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "tipo_servicio,nombre";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
        }
        if (isset($p["filters"]["fecha"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $ca->bindValue(":fecha_inicial", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
            }
        }

        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_taximetro", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//            return false;
//        }
        return $ca->execPage($p);
    }

    public static function EliminarTarifa($p) {
//         NWJSonRpcServer::console($p);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();
        $ca->prepareDelete("edo_taximetro", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function saveTarifasFijas($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $fields = "id,usuario,empresa,ciudad_o_lugar_origen,valor,ciudad_o_lugar_destino,servicio_id,"
                . "valor_metros_add,inicia_metros_add,valor_peajes,valor_recargo,concepto_recargo,"
                . "metros_cobro_peaje,metros_cobro_recargo,type,nombre,valor_pasajero_adicional,pasajero_adicional_rango_inicia_cobro";
        if ($p["id"] == "") {
            $id_tarifa = master::getNextSequence("edo_foraneo" . "_id_seq", $db);
            $ca->prepareInsert("edo_foraneo", $fields);
        } else {
            $ca->prepareUpdate("edo_foraneo", $fields, "id=:id");
            $id_tarifa = $p["id"];
        }

        $ca->bindValue(':id', $id_tarifa);
        $ca->bindValue(':usuario', $si['usuario']);
        $ca->bindValue(':empresa', $si['empresa']);
        $ca->bindValue(':ciudad_o_lugar_origen', $p['ciudad_o_lugar_origen']);
        $ca->bindValue(':valor', $p['valor']);
        $ca->bindValue(':ciudad_o_lugar_destino', $p['ciudad_o_lugar_destino']);
        $ca->bindValue(':servicio_id', $p['servicio_id'] == "" ? 0 : $p['servicio_id']);
        $ca->bindValue(':valor_metros_add', $p['valor_metros_add'] == "" ? 0 : $p['valor_metros_add']);
        $ca->bindValue(':inicia_metros_add', $p['inicia_metros_add'] == "" ? 0 : $p['inicia_metros_add']);
        $ca->bindValue(':valor_peajes', $p['valor_peajes'] == "" ? 0 : $p['valor_peajes']);
        $ca->bindValue(':valor_recargo', $p['valor_recargo'] == "" ? 0 : $p['valor_recargo']);
        $ca->bindValue(':concepto_recargo', $p['concepto_recargo']);
        $ca->bindValue(':metros_cobro_peaje', $p['metros_cobro_peaje'] == "" ? 0 : $p['metros_cobro_peaje'] );
        $ca->bindValue(':metros_cobro_recargo', $p['metros_cobro_recargo'] == "" ? 0 : $p['metros_cobro_recargo']);
        $ca->bindValue(':type', $p['type']);
        $ca->bindValue(':nombre', $p['nombre']);
        $ca->bindValue(':valor_pasajero_adicional', $p['valor_pasajero_adicional'], true, true);
        $ca->bindValue(':pasajero_adicional_rango_inicia_cobro', $p['pasajero_adicional_rango_inicia_cobro'], true, true);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if (count($p["servicios"]) > 0) {
            //NWJSonRpcServer::console($p);
            $ca->prepareDelete("edo_foraneo_service", "id_tarifa=:id_tarifa");
            $ca->bindValue(':id_tarifa', $id_tarifa);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
                return;
            }
            foreach ($p["servicios"] as $j) {
                $ca->prepareInsert("edo_foraneo_service", "id_tarifa,fecha,usuario,empresa,service,valor");
                $ca->bindValue(":id_tarifa", $id_tarifa);
                $ca->bindValue(':fecha', date("Y-m-d"));
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":empresa", $si["empresa"]);
                $ca->bindValue(":service", $j["service"]);
                $ca->bindValue(":valor", $j["valor"]);
//                NWJSonRpcServer::information($ca->preparedQuery());
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
        }

        $db->commit();
        return true;
    }

    public static function eliminarServicios($p) {
        session::check();

        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_foraneo_service", "id=:id");
        $ca->bindValue(":id", $p["id"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return false;
        }
    }

    public static function consultaTarifasFijas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "a.empresa =:empresa";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $campos = "a.ciudad_o_lugar_origen,a.ciudad_o_lugar_destino,a.concepto_recargo,a.valor,a.nombre";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
        }
        $where = str_replace("::text", "", $where);
        $fields = "a.*,b.nombre as servicio_id_text";
        $ca->prepareSelect("edo_foraneo a left join edo_taximetro b ON(a.servicio_id=b.id)", $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        return $ca->execPage($p);
    }

    public static function EliminarTarifaFija($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();
        $ca->prepareDelete("edo_foraneo", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function populateNavtableSubservicios($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $db->transaction();

        $ca->prepareSelect("edo_foraneo_service", " * ", "id_tarifa=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }
}
