<?php

class vehiculos_admin {

    public static function desvincularConductorOfVehiculo($p) {
        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $ca->prepareSelect("edo_vehiculos", "id_otros_conductores,usuario_usando", "id=:id_vehiculo");
        $ca->bindValue(":id_vehiculo", $p["id_vehiculo"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $r = $ca->flush();

        $id_otros_conductores = str_replace("{" . $p["id"] . "}", "", $r["id_otros_conductores"]);

        $fields = "id_otros_conductores";
        if ($r["usuario_usando"] == $p["usuario_cliente"]) {
            $fields .= ",usuario_usando";
        }
        $ca->prepareUpdate("edo_vehiculos", $fields, "id=:id_vehiculo");
        $ca->bindValue(":id_vehiculo", $p["id_vehiculo"]);
        $ca->bindValue(":id_otros_conductores", $id_otros_conductores);
        $ca->bindValue(":usuario_usando", "");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($r["usuario_usando"] == $p["usuario_cliente"]) {
            $ca->prepareUpdate("pv_clientes", "placa_activa", "id=:id");
            $ca->bindValue(":id", $p["id"]);
            $ca->bindValue(":placa_activa", "");
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        return true;
    }

    public static function getConductoresByVehiculo($p) {
        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $users = str_replace("'", "", $p["usuarios"]);
        $ca->prepareSelect("pv_clientes", "id,usuario_cliente, CONCAT(nombre, ' ', apellido) as nombre_completo", "empresa=:empresa and perfil=2 and id IN({$users})");
        $ca->bindValue(":empresa", $si["empresa"]);
        return $ca->execPage($p);
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $fecha = date("Y-m-d");
        if ($p["id"] != "") {
            $id = $p["id"];
        } else {
            $id = master::getNextSequence("edo_vehiculos" . "_id_seq", $db);
        }
        $bodega = null;
        if (isset($si["bodega"]) && $si["bodega"] != "") {
            $bodega = $si["bodega"];
        }
        $fields = "id,empresa,usuario,placa,marca,modelo,color,soat,fecha_vencimiento_soat,fecha,numero_moto,tarjeta_propiedad,"
                . "tipo_vehiculo,tipo_vehiculo_text,imagen_vehi,foto_soat,usuario_text,num_maletas,"
                . "marca_text,numero_puertas,capacidad_pasajeros,estado_activacion,estado_activacion_text,servicio_activo,servicio_activo_text,descripcion_carroceria,"
                . "descripcion_carroceria_text,capacidad_carga_kg,capacidad_volumen_m3,tarjeta_propiedad_trasera,revision_tegnomecanica,nombre_propietario,identificacion_propietario,"
                . "vehiculo_publico_particular,"
                . "rut,direccion_proietario,telefono_proietario,numero_interno,numero_tarjeta_operacion,activar_servicios,fecha_vencimiento_tegnomecanica";
        $fields .= ",vehiculo_poliza_contractual,vehiculo_poliza_todoriesgo,fecha_vencimiento_numero_tarjeta_operacion";

        $propietario_vehiculo = null;
        if (isset($p["propietario_vehiculo"]) && nwMaker::evalueData($p["propietario_vehiculo"])) {
            $propietario_vehiculo = $p["propietario_vehiculo"];
            $fields .= ",id_usuario";
        }
        if (isset($si["bodega"]) && $si["bodega"] != "") {
            $fields .= ",bodega";
        }
        if ($p["id"] == "") {
            $ca->prepareInsert("edo_vehiculos", $fields);
//            $ca->bindValue(":fecha", date("Y-m-d"));
        } else {
            $ca->prepareUpdate("edo_vehiculos", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":vehiculo_publico_particular", $p["vehiculo_publico_particular"], true, true);
        $ca->bindValue(":usuario", $p["propietario_vehiculo_text"], true, true);
        $ca->bindValue(":empresa", $si["empresa"], true, true);
        $ca->bindValue(":placa", $p["placa"], true, true);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":marca", $p["marca"] == "" ? 0 : $p ["marca"], true, true);
        $ca->bindValue(":marca_text", $p["marca_text"], true, true);
        $ca->bindValue(":modelo", $p["modelo"], true, true);
        $ca->bindValue(":color", $p["color"], true, true);
        $ca->bindValue(":soat", $p["soat"], true, true);
        $ca->bindValue(":servicio_activo", $p["servicio_activo"], true, true);
        $ca->bindValue(":servicio_activo_text", $p["servicio_activo_text"], true, true);
        $ca->bindValue(":estado_activacion", $p["estado_activacion"], true, true);
        $ca->bindValue(":estado_activacion_text", $p["estado_activacion_text"], true, true);
        $ca->bindValue(":fecha_vencimiento_soat", $p["fecha_vencimiento_soat"], true, true);
        $ca->bindValue(":foto_soat", $p["foto_soat"], true, true);
        $ca->bindValue(":numero_moto", $p["numero_moto"], true, true);
        $ca->bindValue(":id_usuario", $propietario_vehiculo, true, true);
        $ca->bindValue(":usuario_text", $p["propietario_vehiculo_text"], true, true);
        $ca->bindValue(":tipo_vehiculo", $p["tipo_vehiculo"] == "" ? 0 : $p ["tipo_vehiculo"], true, true);
        $ca->bindValue(":tipo_vehiculo_text", $p["tipo_vehiculo_text"], true, true);
        $ca->bindValue(":imagen_vehi", $p["imagen_vehi"], true, true);
        $ca->bindValue(":numero_puertas", $p["numero_puertas"], true, true);
        $ca->bindValue(":tarjeta_propiedad", $p["tarjeta_propiedad"], true, true);
        $ca->bindValue(":capacidad_pasajeros", $p["capacidad_pasajeros"], true, true);
        $ca->bindValue(":descripcion_carroceria", $p["descripcion_carroceria"] == "" ? 0 : $p["descripcion_carroceria"], true, true);
        $ca->bindValue(":descripcion_carroceria_text", $p["descripcion_carroceria_text"], true, true);
        $ca->bindValue(":capacidad_carga_kg", $p["capacidad_carga_kg"], true, true);
        $ca->bindValue(":capacidad_volumen_m3", $p["capacidad_volumen_m3"], true, true);
        $ca->bindValue(":tarjeta_propiedad_trasera", $p["tarjeta_propiedad_trasera"], true, true);
        $ca->bindValue(":revision_tegnomecanica", $p["revision_tegnomecanica"], true, true);
        $ca->bindValue(":fecha_vencimiento_tegnomecanica", $p["fecha_vencimiento_tegnomecanica"], true, true);
        $ca->bindValue(":nombre_propietario", $p["nombre_propietario"], true, true);
        $ca->bindValue(":identificacion_propietario", $p["identificacion_propietario"], true, true);
        $ca->bindValue(":rut", $p["rut"], true, true);
        $ca->bindValue(":direccion_proietario", $p["direccion_proietario"], true, true);
        $ca->bindValue(":telefono_proietario", $p["telefono_proietario"], true, true);
        $ca->bindValue(":numero_interno", $p["numero_interno"], true, true);
        $ca->bindValue(":numero_tarjeta_operacion", $p["numero_tarjeta_operacion"], true, true);
        $ca->bindValue(":activar_servicios", $p["activar_servicios"], true, true);
        $ca->bindValue(":num_maletas", $p["num_maletas"] == "" ? 0 : $p["num_maletas"], true, true);
        $ca->bindValue(":bodega", $bodega);
        $ca->bindValue(":vehiculo_poliza_todoriesgo", $p["vehiculo_poliza_todoriesgo"], true, true);
        $ca->bindValue(":vehiculo_poliza_contractual", $p["vehiculo_poliza_contractual"], true, true);
        $ca->bindValue(":fecha_vencimiento_numero_tarjeta_operacion", $p["fecha_vencimiento_numero_tarjeta_operacion"], true, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();
        return $id;
    }

    public static function populateTokenMarcaV($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " 1=1 ";
        if ($p["token"] != "") {
            $where .= " and (lower(nombre) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("edo_marca_vehiculos", "id,nombre,nombre as Marca", $where);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateVehiculo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select * from edo_vehiculos where placa=:placa and id_usuario=:propietario_vehiculo ";
        $ca->prepare($sql);
        $ca->bindValue(":placa", $p["placa"], true);
        $ca->bindValue(":propietario_vehiculo", $p["propietario_vehiculo"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->flush();
    }
}
