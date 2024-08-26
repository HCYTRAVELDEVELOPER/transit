<?php

class empresas {

    public static function setCountry($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $country = geimp_vista::getCountry($db);
        $_SESSION["pais"] = $country;
        setcookie("pais", $country, time() + (60 * 60 * 24 * 365));
        return true;
    }

    public static function execPage($p) {
        session::check();
        $where = "";
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " empresa=:empresa ";
        if (isset($p["tipo_empresa"])) {
            if ($p["tipo_empresa"]) {
                $where .= " and tipo_empresa = :tipo_empresa ";
                $ca->bindValue(":tipo_empresa", $p["tipo_empresa"]);
            }
        }
        if (isset($p["filters"]) && $p["filters"]["buscar"] != "") {
            $campos = "id,nombre,nit,razon_social,telefono,correo,encargado";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
        }
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_empresas", "*,'<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Adjuntar contrato</a></p><br />' as adjuntar,'<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Tiempo Espera</a></p><br />' as tiempos, '<p><a class=\"qxnw_verimgButton\" target=\"_blank\">Permisos</a></p><br />' as permisos_row", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        return $ca->execPage($p);
    }

    public static function traeClientes($p) {
        session::check();
        $where = "";
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 and empresa=:empresa ";
        if (isset($p["tipo_empresa"])) {
            if ($p["tipo_empresa"]) {
                $where .= " and tipo_empresa = :tipo_empresa ";
                $ca->bindValue(":tipo_empresa", $p["tipo_empresa"]);
            }
        }
        if (isset($p["filters"]) && $p["filters"]["buscar"] != "") {
            $campos = "id,nombre,nit,razon_social,telefono,correo,encargado";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
        }
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_empresas", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        return $ca->execPage($p);
    }

    public static function tiemposEmpresa($p) {
        session::check();
        $si = session::info();
        $where = " 1=1";
        if (isset($p["filters"]) && $p["filters"]["buscar"] != "") {
            $campos = "id,empresa_text,tiempo_servicio_text";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
        }
        if (isset($p["filters"]) && $p["filters"]["empresa"] != "") {
            $campos = "id,empresa_text,tiempo_servicio_text";
            $where .= " and empresa=" . $p["filters"]["empresa"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_tiempo_espera", "*", $where);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
//            return false;
//        }
        return $ca->execPage($p);
    }

    public static function consultaClientesPermisos($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "permisos,bodega", "id=:id");
        $ca->bindValue(":id", $si["usuario_id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->flush();
    }

    public static function userCentroCostos($p) {
        session::check();
        $si = session::info();
        $where = " id=:code";
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", " * ", $where);
        $ca->bindValue(":code", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        $rs = $ca->flush();
        $_SESSION["centro_costo"] = $rs["centro_costo"];
        return $rs;
    }

    public static function adjuntar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_empresas", "contrato_adjunto", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":contrato_adjunto", $p["contrato_adjunto"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function permisosClientes($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("usuarios", "permisos", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":permisos", $p["permisos"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function populatePermisosEmpresas($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select 
                id,
                razon_social as nombre,
                false as pertenece
                from empresas";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateCiudad($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select id,nombre from ciudades where 1=1 order by nombre asc";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function permisosEmpresas($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sql = "SELECT id,razon_social as nombre
                FROM empresas
                WHERE EXISTS (SELECT usuario FROM usuarios_empresas WHERE usuario=:usuario and empresa=:empresa)";
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function selectTarifasFijas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sql = "SELECT e.*,
(CASE
WHEN t.id is null  THEN
CONCAT(ciudad_o_lugar_origen,' ',ciudad_o_lugar_destino)
ELSE
CONCAT(ciudad_o_lugar_origen,' ',ciudad_o_lugar_destino, ' ',t.nombre)
END) AS nombre
FROM edo_foraneo e LEFT JOIN edo_taximetro t on (e.servicio_id=t.id) 
WHERE e.empresa=:empresa";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $si = session::info();
        $latitud = null;
        $longitud = null;
        if (isset($p["latitud"])) {
            $latitud = $p["latitud"];
        }
        if (isset($p["longitud"])) {
            $longitud = $p["longitud"];
        }
        $fields = "usuario,empresa,fecha,nombre,nit,razon_social,direccion,telefono,ciudad,ciudad_text,logo,encargado,contrato,"
                . "correo,tipo_empresa,numero_contacto_reponsable,identificacion_reponsable,direccion_reponsable,firma_representante_legal";
        $fields .= ",objeto_contrato,latitud,longitud";
        if ($p["id"] != "") {
            $ca->prepareUpdate("edo_empresas", $fields, "id=:id");
            $id = $p["id"];
        } else {
            $ca->prepareInsert("edo_empresas", $fields);
            $id = master::getNextSequence("edo_empresas" . "_id_seq", $db);
        }
        $contrato = null;
        if (isset($p["contrato"])) {
            $contrato = $p["contrato"];

            $where = "contrato_consecutivo=:contrato_consecutivo ";
            $where .= " and empresa=:empresa ";
//            $where .= " and id_empresa=:id_empresa";
            $cb->prepareSelect("nwmaker_contrato_consecutivo", "id_empresa,contrato_consecutivo", $where);
            $cb->bindValue(":contrato_consecutivo", $contrato);
            $cb->bindValue(":id_empresa", $id);
            $cb->bindValue(":empresa", $si["empresa"]);
            if (!$cb->exec()) {
                return nwMaker::error($cb->lastErrorText());
            }
            if ($cb->size() > 0) {
                $cons = $cb->flush();
                if ($cons["id_empresa"] != $id) {
                    return "consecutivo_usado";
                }
            }
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":nit", $p["nit"]);
        $ca->bindValue(":razon_social", $p["razon_social"]);
        $ca->bindValue(":direccion", $p["direccion"]);
        $ca->bindValue(":telefono", $p["telefono"]);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        $ca->bindValue(":ciudad_text", $p["ciudad_text"]);
        $ca->bindValue(":logo", $p["logo"]);
        $ca->bindValue(":encargado", $p["encargado"]);
        $ca->bindValue(":correo", $p["correo"]);
        $ca->bindValue(":tipo_empresa", $p["tipo_empresa"]);
        $ca->bindValue(":numero_contacto_reponsable", $p["numero_contacto_reponsable"]);
        $ca->bindValue(":identificacion_reponsable", $p["identificacion_reponsable"]);
        $ca->bindValue(":direccion_reponsable", $p["direccion_reponsable"]);
        $ca->bindValue(":firma_representante_legal", $p["firma_representante_legal"]);
        $ca->bindValue(":contrato", $contrato, true);
        $ca->bindValue(":objeto_contrato", $p["objeto_contrato"]);
        $ca->bindValue(":latitud", $latitud);
        $ca->bindValue(":longitud", $longitud);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }

        $p["contrato"] = $contrato;
        $p["id_empresa"] = $id;
        nwMaker::consumeConsecutivoContratoCuenta($p);

        if (isset($p["tarifas"])) {
            foreach ($p["tarifas"] as $r) {
                $fields = "valor_unidad_tiempo,valor_unidad_metros,valor_banderazo,valor_mascota,minima,trayecto,usuario,empresa,fecha,porcentaje_comision";
                if ($r["id"] == "") {
                    $ca->prepareInsert("edo_taximetro_cliente", $fields . ",id_cliente");
                } else {
                    $ca->prepareInsert("edo_taximetro_cliente", $fields, "id_cliente=:id_cliente");
                }
                $ca->bindValue(":id_cliente", $id);
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":empresa", $si["empresa"]);
                $ca->bindValue(":fecha", date('Y-m-d'));
                $ca->bindValue(":valor_unidad_tiempo", $r["valor_unidad_tiempo"]);
                $ca->bindValue(":valor_unidad_metros", $r["valor_unidad_metros"]);
                $ca->bindValue(":valor_banderazo", $r["valor_banderazo"]);
                $ca->bindValue(":valor_mascota", $r["valor_mascota"]);
                $ca->bindValue(":minima", $r["minima"]);
                $ca->bindValue(":trayecto", $r["trayecto"]);
                $ca->bindValue(":porcentaje_comision", $r["porcentaje_comision"] == "" ? null : $r["porcentaje_comision"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
                    return false;
                }
            }
        }
        if (isset($p["tarifas_fijas"])) {
            foreach ($p["tarifas_fijas"] as $r) {
                $fields = "valor,tarifa,tarifa_text,service,service_text,usuario,empresa,fecha,porcentaje_empresa,porcentaje_proveedor";
                if ($r["id"] == "") {
                    $ca->prepareInsert("edo_foraneo_clientes", $fields . ",id_cliente");
                } else {
                    $ca->prepareInsert("edo_foraneo_clientes", $fields, "id_cliente=:id_cliente");
                }
                $ca->bindValue(":id_cliente", $id);
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":empresa", $si["empresa"]);
                $ca->bindValue(":fecha", date('Y-m-d'));
                $ca->bindValue(":valor", $r["valor"]);
                $ca->bindValue(":tarifa", $r["tarifa"]);
                $ca->bindValue(":tarifa_text", $r["tarifa_text"]);
                $ca->bindValue(":service", $r["service"] == "" ? null : $r["service"]);
                $ca->bindValue(":service_text", $r["service_text"]);
                $ca->bindValue(":porcentaje_empresa", $r["porcentaje_empresa"] == "" ? 0 : $r["porcentaje_empresa"]);
                $ca->bindValue(":porcentaje_proveedor", $r["porcentaje_proveedor"] == "" ? 0 : $r["porcentaje_proveedor"]);
//                NWJSonRpcServer::information($ca->preparedQuery());
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
                    return false;
                }
            }
        }
        if (isset($p["centro_costos"])) {
            foreach ($p["centro_costos"] as $r) {
                $latitud = null;
                $longitud = null;
                if (isset($r["latitud"])) {
                    $latitud = $r["latitud"];
                }
                if (isset($r["longitud"])) {
                    $longitud = $r["longitud"];
                }
                $fields = "nombre,ciudad,ciudad_text,direccion,telefono,usuario,empresa,fecha,id_cliente,latitud,longitud";
                $fields .= ",cliente_correo,cliente_usuario,cliente_usuario_id";
                if ($r["id"] == "") {
                    $ca->prepareInsert("edo_centro_costos", $fields);
                } else {
                    $ca->prepareUpdate("edo_centro_costos", $fields, "id=:id");
                }
                $ca->bindValue(":id", $r["id"]);
                $ca->bindValue(":id_cliente", $id);
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":empresa", $si["empresa"]);
                $ca->bindValue(":fecha", date('Y-m-d'));
                $ca->bindValue(":nombre", $r["nombre"]);
                $ca->bindValue(":ciudad", $r["ciudad"] == "" ? 0 : $r["ciudad"]);
                $ca->bindValue(":ciudad_text", $r["ciudad_text"]);
                $ca->bindValue(":direccion", $r["direccion"]);
                $ca->bindValue(":telefono", $r["telefono"]);
                $ca->bindValue(":latitud", $latitud);
                $ca->bindValue(":longitud", $longitud);
                $ca->bindValue(":cliente_correo", $r["cliente_correo"]);
                $ca->bindValue(":cliente_usuario", $r["cliente_usuario"]);
                $ca->bindValue(":cliente_usuario_id", $r["cliente_usuario_id"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
                    return false;
                }
            }
        }
//        if (isset($p["detalle_contrato"])) {
//            if (count($p["detalle_contrato"] > 0)) {
//                $ca->prepareDelete("edo_detalle_contrato_fuec", "id_cliente=:id_cliente and empresa=:empresa");
//                $ca->bindValue(':id_cliente', $id);
//                $ca->bindValue(":empresa", $si["empresa"]);
//                if (!$ca->exec()) {
//                    $db->rollback();
//                    NWJSonRpcServer::error($ca->lastErrorText());
//                    return;
//                }
//
//                foreach ($p["detalle_contrato"] as $r) {
//                    $fields = "numero_contrato,objeto_contrato,fecha_inicial,fecha_final,origen,destino,convenio_text,"
//                            . "convenio,descripcion_recorrido,usuario,empresa,fecha,id_cliente,numero_fuec";
//                    $ca->prepareInsert("edo_detalle_contrato_fuec", $fields);
//                    $ca->bindValue(":id_cliente", $id);
//                    $ca->bindValue(":usuario", $si["usuario"]);
//                    $ca->bindValue(":empresa", $si["empresa"]);
//                    $ca->bindValue(":fecha", date('Y-m-d'));
//                    $ca->bindValue(":numero_contrato", $r["numero_contrato"]);
//                    $ca->bindValue(":objeto_contrato", $r["objeto_contrato"]);
//                    $ca->bindValue(":fecha_inicial", $r["fecha_inicial"]);
//                    $ca->bindValue(":fecha_final", $r["fecha_final"]);
//                    $ca->bindValue(":origen", $r["origen"]);
//                    $ca->bindValue(":destino", $r["destino"]);
//                    $ca->bindValue(":descripcion_recorrido", $r["descripcion_recorrido"]);
//                    $ca->bindValue(":convenio_text", $r["convenio_text"]);
//                    $ca->bindValue(":convenio", $r["convenio"] == "" ? null : $r["convenio"]);
//                    $ca->bindValue(":numero_fuec", $r["numero_fuec"]);
//                    if (!$ca->exec()) {
//                        $db->rollback();
//                        NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
//                        return false;
//                    }
//                }
//            }
//        }
        $db->commit();
        return true;
    }

    public static function populateTokenCiudades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 ";
        if ($p["token"] != "") {
            $where .= " and (lower(nombre) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("ciudades", "id,nombre", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function deleteNavcliente($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " id=:id ";
        $ca->prepareDelete(":table", $where);
        $ca->bindValue(":table", $p["table"], false);
        $ca->bindValue(":id", $p["id"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
    }

    public static function tiempo_espera($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "usuario,empresa,fecha,subcategoria,subcategoria_text,desde,tiempo,empresa_text,recargo,recargo_text";
        if ($p["id"] != "") {
            $ca->prepareUpdate("edo_tiempo_espera", $fields, "id=:id");
        } else {
            $ca->prepareInsert("edo_tiempo_espera", $fields);
        }
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":empresa_text", $p["empresa_text"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":subcategoria", $p["subcategoria"] == "" ? 0 : $p["subcategoria"]);
        $ca->bindValue(":subcategoria_text", $p["subcategoria_text"]);
        $ca->bindValue(":desde", $p["desde"]);
        $ca->bindValue(":tiempo", $p["tiempo"]);
        $ca->bindValue(":recargo", $p["recargo"] == "" ? 0 : $p["recargo"]);
        $ca->bindValue(":recargo_text", $p["recargo_text"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->preparedQuery());
            return false;
        }
        $ca->prepareUpdate("edo_empresas", "tiempo_espera", "id=:id");
        $ca->bindValue(":id", $p["empresa"]);
        $ca->bindValue(":tiempo_espera", true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["id"] == "") {
            NWJSonRpcServer::error("Debe seleccionar un registro para poder eliminarlo");
            return false;
        }
        $si = session::info();
        $ca->prepareDelete("edo_empresas", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function terminal($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("pe_caja", "id,nombre", "terminal=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateTarifasFijas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_foraneo_clientes", "*", "id_cliente=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateTarifas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_taximetro_cliente", "*", "id_cliente=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateCentros($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_centro_costos", "*", "id_cliente=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateDetalleContratoFuec($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_detalle_contrato_fuec", "*", "id_cliente=:id and empresa=:empresa");
        $ca->bindValue(":id", $p);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

}

?>