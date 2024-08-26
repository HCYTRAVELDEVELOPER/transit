<?php

class preoperacional {

    public static function consultaPreopeAdmin($data) {
        $p = nwMaker::getData($data);
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "a.empresa=:empresa";
        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        if (isset($p["permisos"])) {
            if (isset($p["permisos"]["filtrar_por_flota"])) {
                if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                    $where .= " and b.bodega=:flota ";
                }
            }
            if (isset($p["permisos"]["filtrar_por_terminal"])) {
                if ($p["permisos"]["filtrar_por_terminal"] === "true" || $p["permisos"]["filtrar_por_terminal"] === true) {
                    $where .= " and b.terminal=:terminal ";
                }
            }
        }
        if (isset($p["usuario"]) && $p["usuario"] !== "" && $p["usuario"] !== "TODOS") {
            $where .= " and a.usuario=:usuario ";
        }
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= " and a.fecha between :fecha_inicio and :fecha_fin";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
            }
        }
        $where .= " order by a.id desc";
        $tables = "edo_preoperadmin_results_enc a";
        $tables .= " left join pv_clientes b ON(a.id_usuario=b.id) "
                . " left join edo_vehiculos c on (a.id_vehiculo=c.id) ";
        $ca->prepareSelect($tables, "a.*,b.ciudad_text, CONCAT( b.nombre, ' ',b.apellido) as nombres_conductor,"
                . "b.usuario, c.fecha_vencimiento_soat,c.vehiculo_poliza_contractual,"
                . "c.vehiculo_poliza_todoriesgo, c.fecha_vencimiento_tegnomecanica ", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
//                        NWJSonRpcServer::information($ca->preparedQuery());

        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $rta = $ca->assocAll();
//        $total = count($rta);
//        $ids_array = Array();
//        for ($i = 0; $i < $total; $i++) {
//            $r = $rta[$i];
//            $ids_array[] = $r["id"];
//        }
//
//        $ca->prepareSelect("edo_preoperadmin_results_valores", "campo,valor", "id_enc IN (:id)");
//        $ca->bindValue(":id", implode(",", $ids_array));
//        if (!$ca->exec()) {
//            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
//        }
//
//        $rs = $ca->assocAll();
//        $total2 = count($rs);
//        for ($x = 0; $x < $total2; $x++) {
//            $rsa = $rs[$x];
//            $rta[$i][$rsa["campo"]] = $rsa["valor"];
//        }


        $id_enc_values = array_column($rta, 'id');
//        NWJSonRpcServer::console($id_enc_values);
        if (!empty($id_enc_values)) {
            $id_enc = implode(', ', array_map(function ($id) {
                        return ":id{$id}";
                    }, $id_enc_values));

            $ca->prepareSelect("edo_preoperadmin_results_valores", "id_enc, campo, valor", "id_enc IN ({$id_enc})");
            foreach ($id_enc_values as $index => $id) {
                $ca->bindValue(":id{$id}", $id);
            }
//                NWJSonRpcServer::information($ca->preparedQuery());

            if (!$ca->exec()) {
                return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
            }

            $rs = $ca->assocAll();
            foreach ($rs as $row) {
                $index = array_search($row['id_enc'], $id_enc_values);
                if ($index !== false) {
                    $rta[$index][$row["campo"]] = $row["valor"];
                }
            }
        }
//        NWJSonRpcServer::console($rta);
//return $rta;

        return $rta;
//        return $ca->assocAll();
//        return $ca->execPage($p);
    }

    public static function savePreopeAdmin($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $fields = "id,usuario,empresa,fecha,id_usuario,id_vehiculo,marca,tipo,placa,modelo";
        $bodega = "";
        if (isset($p["bodega"])) {
            $bodega = $p["bodega"];
            $fields .= ",bodega";
        }
        $id = master::getNextSequence("edo_preoperadmin_results_enc" . "_id_seq", $db);

        $ca->prepareInsert("edo_preoperadmin_results_enc", $fields);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        $ca->bindValue(":bodega", $bodega);
        $ca->bindValue(":id_vehiculo", $p["id_vehiculo"], true, true);
        $ca->bindValue(":marca", $p["marca"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":placa", $p["placa"]);
        $ca->bindValue(":modelo", $p["modelo"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if (isset($p["preguntas_dinamicas"])) {
//            $t = count($p["preguntas_dinamicas"]);
            $fields = "campo,valor,id_enc";
//            for ($i = 0; $i < $t; $i++) {
            foreach ($p["preguntas_dinamicas"] as $key => $value) {
                $ca->prepareInsert("edo_preoperadmin_results_valores", $fields);
                $ca->bindValue(":id_enc", $id);
                $ca->bindValue(":campo", $key);
                $ca->bindValue(":valor", $value);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                }
            }
        }
        if (isset($p["otros_documentos"])) {
            $t = count($p["otros_documentos"]);
            $fields = "id_preoperacional,fecha,usuario,usuario_conductor,adjunto,empresa,observaciones";
            for ($i = 0; $i < $t; $i++) {
                $rs = $p["otros_documentos"][$i];
                $ca->prepareInsert("edo_preoperacional_otros_documentos", $fields);
                $ca->bindValue(":id_preoperacional", $id);
                $ca->bindValue(":fecha", $hoy);
                $ca->bindValue(":usuario", $p["usuario"]);
                $ca->bindValue(":usuario_conductor", $p["usuario"]);
                $ca->bindValue(":adjunto", $rs["adjunto"]);
                $ca->bindValue(":observaciones", $rs["observaciones"]);
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":bodega", $bodega);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                }
            }
        }
        $preoperacional_novedad_encontrada = "NO";
        foreach ($p as $key => $value) {
            if ($value == "NO" || $value == false) {
                $preoperacional_novedad_encontrada = "SI";
            }
        }
        $ca->prepareUpdate("pv_clientes", "preoperacional_ultima_fecha,preoperacional_novedad_encontrada", "usuario_cliente=:usuario and empresa=:empresa and perfil=2");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":preoperacional_ultima_fecha", $hoy);
        $ca->bindValue(":preoperacional_novedad_encontrada", $preoperacional_novedad_encontrada);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function getPreopeAdminPreguntas($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " empresa=:empresa order by orden asc ";
        $ca->prepareSelect("edo_preoperadmin_preguntas", "*", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function getUsuariosPopulate($data) {
        $p = nwMaker::getData($data);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=:empresa and perfil=2 ";
        $ca->prepareSelect("pv_clientes", "usuario_cliente as id,CONCAT(nombre, ' ', apellido) as nombre", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function savePreoperacional($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $hoy = $p["z_fromlib_fecha_hora_actual_navigator_cliente"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];
        $bodega = "";
        if (isset($p["bodega"])) {
            $bodega = ",bodega";
        }
        $fields = "estado_salud_observaciones,presion,tuercas_completas_aseguradas,labrado,freno_parqueo_funciona,frenos_funcionando,liquido_frenos_dentro_limites,enciende_luz_reversa,encienden_luces_bajas,"
                . "encienden_cocuyos,encienden_luces_freno,encienden_direccionales_atras_delante,nivel_combustible,indicador_presion_aceite,indicador_nivel_bateria,espejos_retrovisores_funcionando"
                . ",todas_puertas_cierran_ajustan,nivel_aceite_motor,nivel_liquido_direccion,nivel_liquido_refrigerante,nivel_agua_limpiabrisas,pito,limpiabrisas_funcionando,radiador_tapa_ajustada"
                . ",correa_ventilador_tensionada,bateria_sin_residuos,ajuste_horizontal_sillas_delanteras,ajuste_vertical_sillas_delanteras,tapizado_roturas_manchas,firma_fonductor_inspeccion,observaciones,"
                . "marca,tipo,placa,modelo" . $bodega;
        if ($p["id"] == "") {
            $fields .= ",id,id_usuario,empresa,usuario,fecha,id_vehiculo";
            $id = master::getNextSequence("edo_preoperacional" . "_id_seq", $db);
            $ca->prepareInsert("edo_preoperacional", $fields);
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("edo_preoperacional", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":fecha", $hoy);
        $ca->bindValue(":estado_salud_observaciones", $p["estado_salud_observaciones"]);
        $ca->bindValue(":presion", $p["presion"]);
        $ca->bindValue(":tuercas_completas_aseguradas", $p["tuercas_completas_aseguradas"]);
        $ca->bindValue(":labrado", $p["labrado"]);
        $ca->bindValue(":freno_parqueo_funciona", $p["freno_parqueo_funciona"]);
        $ca->bindValue(":frenos_funcionando", $p["frenos_funcionando"]);
        $ca->bindValue(":liquido_frenos_dentro_limites", $p["liquido_frenos_dentro_limites"]);
        $ca->bindValue(":enciende_luz_reversa", $p["enciende_luz_reversa"]);
        $ca->bindValue(":encienden_luces_bajas", $p["encienden_luces_bajas"]);
        $ca->bindValue(":encienden_cocuyos", $p["encienden_cocuyos"]);
        $ca->bindValue(":encienden_luces_freno", $p["encienden_luces_freno"]);
        $ca->bindValue(":encienden_direccionales_atras_delante", $p["encienden_direccionales_atras_delante"]);
        $ca->bindValue(":nivel_combustible", $p["nivel_combustible"]);
        $ca->bindValue(":indicador_presion_aceite", $p["indicador_presion_aceite"]);
        $ca->bindValue(":indicador_nivel_bateria", $p["indicador_nivel_bateria"]);
        $ca->bindValue(":espejos_retrovisores_funcionando", $p["espejos_retrovisores_funcionando"]);
        $ca->bindValue(":todas_puertas_cierran_ajustan", $p["todas_puertas_cierran_ajustan"]);
        $ca->bindValue(":nivel_aceite_motor", $p["nivel_aceite_motor"]);
        $ca->bindValue(":nivel_liquido_direccion", $p["nivel_liquido_direccion"]);
        $ca->bindValue(":nivel_liquido_refrigerante", $p["nivel_liquido_refrigerante"]);
        $ca->bindValue(":nivel_agua_limpiabrisas", $p["nivel_agua_limpiabrisas"]);
        $ca->bindValue(":pito", $p["pito"]);
        $ca->bindValue(":limpiabrisas_funcionando", $p["limpiabrisas_funcionando"]);
        $ca->bindValue(":radiador_tapa_ajustada", $p["radiador_tapa_ajustada"]);
        $ca->bindValue(":correa_ventilador_tensionada", $p["correa_ventilador_tensionada"]);
        $ca->bindValue(":bateria_sin_residuos", $p["bateria_sin_residuos"]);
        $ca->bindValue(":ajuste_horizontal_sillas_delanteras", $p["ajuste_horizontal_sillas_delanteras"]);
        $ca->bindValue(":ajuste_vertical_sillas_delanteras", $p["ajuste_vertical_sillas_delanteras"]);
        $ca->bindValue(":tapizado_roturas_manchas", $p["tapizado_roturas_manchas"]);
        $ca->bindValue(":firma_fonductor_inspeccion", $p["firma_fonductor_inspeccion"]);
        $ca->bindValue(":observaciones", $p["observaciones"]);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":id_vehiculo", $p["id_vehiculo"], true, true);
        $ca->bindValue(":marca", $p["marca"]);
        $ca->bindValue(":tipo", $p["tipo"]);
        $ca->bindValue(":placa", $p["placa"]);
        $ca->bindValue(":modelo", $p["modelo"]);
        if (isset($p["bodega"])) {
            $ca->bindValue(":bodega", $p["bodega"]);
        }
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if (isset($p["otros_documentos"])) {
            $t = count($p["otros_documentos"]);
            $fields = "id_preoperacional,fecha,usuario,usuario_conductor,adjunto,empresa,observaciones";
            for ($i = 0; $i < $t; $i++) {
                $rs = $p["otros_documentos"][$i];
                $ca->prepareInsert("edo_preoperacional_otros_documentos", $fields);
                $ca->bindValue(":id_preoperacional", $id);
                $ca->bindValue(":fecha", $hoy);
                $ca->bindValue(":usuario", $p["usuario"]);
                $ca->bindValue(":usuario_conductor", $p["usuario"]);
                $ca->bindValue(":adjunto", $rs["adjunto"]);
                $ca->bindValue(":observaciones", $rs["observaciones"]);
                $ca->bindValue(":empresa", $p["empresa"]);
                if (isset($p["bodega"])) {
                    $ca->bindValue(":bodega", $p["bodega"]);
                }
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                }
            }
        }
        $preoperacional_novedad_encontrada = "NO";
        foreach ($p as $key => $value) {
            if ($value == "NO" || $value == false) {
                $preoperacional_novedad_encontrada = "SI";
            }
        }
        $ca->prepareUpdate("pv_clientes", "preoperacional_ultima_fecha,preoperacional_novedad_encontrada", "usuario_cliente=:usuario and empresa=:empresa and perfil=2");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":preoperacional_ultima_fecha", $hoy);
        $ca->bindValue(":preoperacional_novedad_encontrada", $preoperacional_novedad_encontrada);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $db->commit();
        return true;
    }

    public static function consultaPreoperacionalDocumentos($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_preoperacional_otros_documentos", "*", "id_preoperacional=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }

    public static function consultaPreoperacional($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $si = session::getInfo();
        $ca = new NWDbQuery($db);
        $where = "a.empresa=:empresa";
        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        if (isset($p["permisos"])) {
            if (isset($p["permisos"]["filtrar_por_flota"])) {
                if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                    $where .= " and b.bodega=:flota ";
                }
            }
            if (isset($p["permisos"]["filtrar_por_terminal"])) {
                if ($p["permisos"]["filtrar_por_terminal"] === "true" || $p["permisos"]["filtrar_por_terminal"] === true) {
                    $where .= " and b.terminal=:terminal ";
                }
            }
        }
        if (isset($p["usuario"]) && $p["usuario"] !== "" && $p["usuario"] !== "TODOS") {
            $where .= " and a.usuario=:usuario ";
        }
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= " and a.fecha between :fecha_inicio and :fecha_fin";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
            }
        }
        $where .= " order by a.id desc";
        $tables = "edo_preoperacional a";
        $tables .= " left join pv_clientes b ON(a.id_usuario=b.id) ";
        $tables .= "left join edo_vehiculos c on (a.id_vehiculo=c.id)";
        $ca->prepareSelect($tables, "a.*,b.ciudad_text,CONCAT( b.nombre, ' ',b.apellido) as nombres_conductor,
             c.fecha_vencimiento_soat,c.vehiculo_poliza_contractual,c.vehiculo_poliza_todoriesgo,
            c.fecha_vencimiento_tegnomecanica 
", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":flota", $flota, true);
//        if (!$ca->exec()) {
//            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
//        }
//        return $ca->assocAll();
        return $ca->execPage($p);
    }

    public static function consultaPreoperacionalApp($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa";
        if (isset($p["usuario"]) && $p["usuario"] !== "" && $p["usuario"] !== "TODOS") {
            $where .= " and usuario=:usuario ";
        }
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= " and fecha between :fecha_inicio and :fecha_fin";
                $ca->bindValue(":fecha_inicio", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_final"]);
            }
        }
        $where .= " order by id desc";
        $ca->prepareSelect("edo_preoperacional", "*", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }
}
