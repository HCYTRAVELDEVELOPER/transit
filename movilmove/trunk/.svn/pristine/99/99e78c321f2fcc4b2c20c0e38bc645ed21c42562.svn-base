<?php

class usuarios_app {

    public static function validaVersionCache($p) {
        return nwMaker::validaVersionCache($p);
    }

    public static function importacionMasiva($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        for ($i = 0; $i < count($p["rows"]); $i++) {

            $r = $p["rows"][$i];
            $r["id"] = "";
            $r["perfil"] = $p["form"]["perfil"];
            $r["perfil_text"] = $p["form"]["perfil_text"];
            $r["bodega"] = $p["form"]["empresa"];
            $r["bodega_text"] = $p["form"]["empresa_text"];

            $r["trae_datos"] = true;
            $exs = usuarios_app::verificarUsuario($r);
            if ($exs != false) {
                $r["id"] = $exs["id"];
            }
            usuarios_app::guardaUsuario($r);
        }
        return true;
    }

    public static function guardaUsuario($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $clave = false;
        if ($p["clave"] != "0" && $p["clave"] != "12345") {
            $clave = $p["clave"];
        }
        $contrato = null;
        if (isset($p["contrato"])) {
            $contrato = $p["contrato"];
        }
        $bodega = null;
        if (isset($p["bodega"])) {
            $bodega = $p["bodega"];
        }
        $bodega_text = null;
        if (isset($p["bodega_text"])) {
            $bodega_text = $p["bodega_text"];
        }
        $centro_costo = null;
        if (isset($p["centro_costo"])) {
            $centro_costo = $p["centro_costo"];
        }
        $centro_costo_text = null;
        if (isset($p["centro_costo_text"])) {
            $centro_costo_text = $p["centro_costo_text"];
        }
        $foto_perfil = null;
        if (isset($p["foto_perfil"])) {
            $foto_perfil = $p["foto_perfil"];
        }
        $tieneContrato = null;
        if ($contrato == "" || $contrato == null || $contrato == false) {
            $tieneContrato = false;
            $contrato = nwMaker::getConsecutivoContratoCuenta();
        }
        if ($p["id"] != "") {
            $id = $p["id"];
        } else {
            $id = master::getNextSequence("pv_clientes" . "_id_seq", $db);
        }
        $fields = "id,usuario,nombre,apellido,celular,usuario_cliente,contrato,nit,documento,"
                . "email,perfil,perfil_text,terminal,empresa,genero,bodega,centro_costo,centro_costo_text,bodega_text,foto_perfil,estado,ciudad,ciudad_text";
        if ($clave != false) {
            $fields .= ",clave";
        }
        if ($p["id"] == "") {
            $fields .= ",creado_desde,fecha_registro";
            $ca->prepareInsert("pv_clientes", $fields);
        } else {
            $ca->prepareUpdate("pv_clientes", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":clave", md5($clave));
        $ca->bindValue(":fecha_registro", date("Y-m-d H:i:s"));
        $ca->bindValue(":id", $id);
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":foto_perfil", $foto_perfil);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":apellido", $p["apellido"]);
        $ca->bindValue(":genero", $p["genero"]);
        $ca->bindValue(":celular", $p["celular"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":clave", md5($p["clave"]));
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":perfil_text", $p["perfil_text"]);
        $ca->bindValue(":usuario_cliente", $p["usuario_cliente"]);
        $ca->bindValue(":estado", $p["estado"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":bodega", $bodega, true, true);
        $ca->bindValue(":bodega_text", $bodega_text, true, true);
        $ca->bindValue(":centro_costo", $centro_costo, true, true);
        $ca->bindValue(":centro_costo_text", $centro_costo_text, true, true);
        $ca->bindValue(":contrato", $contrato);
        $ca->bindValue(":nit", $p["nit"], true, true);
        $ca->bindValue(":documento", $p["nit"], true, true);
        $ca->bindValue(":ciudad", $p["ciudad"], true, true);
        $ca->bindValue(":ciudad_text", $p["ciudad_text"], true, true);
        $ca->bindValue(":creado_desde", "PC", true, true);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }
        if ($tieneContrato === false) {
            $p["contrato"] = $contrato;
            $p["usuario_pasajero"] = $p["usuario_cliente"];
            nwMaker::consumeConsecutivoContratoCuenta($p);
        }
        if ($p["id"] == "") {
            $ca->prepareInsert("usuarios_empresas", "usuario,empresa,perfil,terminal");
            $ca->bindValue(":usuario", $p["usuario_cliente"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":perfil", $p["perfil"]);
            $ca->bindValue(":terminal", $si["terminal"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
                return false;
            }
            $ca->prepareSelect("empresas", "*", "id=:id");
            $ca->bindValue(":id", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                $datos = $ca->flush();
                $p["logo"] = $datos["logo"];
                $p["empresa"] = $datos["razon_social"];
                $p["plantilla_bienvenida"] = "movilmove";
            }
            if ($p["perfil"] == "1") {
                $p["tipo_plantilla"] = "CREAR_CUENTA_USUARIO_MOVILMOVE";
            }
            if ($p["perfil"] == "2") {
                $p["tipo_plantilla"] = "CREAR_CUENTA_CONDUCTOR_MOVILMOVE";
            }
            $p["usuario"] = $p["usuario_cliente"];
            $p["empresa"] = $si["empresa"];
            master::sendWelcomeMail($p);
        }
        $db->commit();
        return $id;
    }

    public static function verificarUsuario($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $cs = new NWDbQuery($db);
        $where = " usuario_cliente=:usuario_cliente and empresa=:empresa and perfil=:perfil";
        $cs->prepareSelect("pv_clientes", "id", $where);
        $cs->bindValue(":empresa", $si["empresa"]);
        $cs->bindValue(":usuario_cliente", $p["usuario_cliente"]);
        $cs->bindValue(":perfil", $p["perfil"]);
        if (!$cs->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $cs->lastErrorText());
        }
        if ($cs->size() == 0) {
            return false;
        }
        if (isset($p["trae_datos"])) {
            return $cs->flush();
        }
        return true;
    }

    public static function consultaUsuariosList($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $estado = null;
        $bodega = null;
        $where = " empresa=:empresa and perfil=:perfil ";
        if (isset($p["filters"])) {
            if ($p["filters"]["buscar"] != "") {
                $campos = "id,nombre,email,usuario,estado_conexion,estado,ciudad";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
            if (isset($p["filters"]["bodega"]) && $p["filters"]["bodega"] != "") {
                $where .= " and bodega=:bodega ";
                $bodega = $p["filters"]["bodega"];
            }
            if ($p["filters"]["estado"] != "") {
                $where .= " and estado=:estado ";
                $estado = $p["filters"]["estado"];
            }
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_final"] != "") {
                $where .= "and DATE(fecha_registro) BETWEEN :fecha_inicial and :fecha_final ";
                $ca->bindValue(":fecha_inicial", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_final", $p["filters"]["fecha_final"]);
            }
        }
        $where .= " order by fecha_ultima_conexion desc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("pv_clientes", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":bodega", $bodega);
        $ca->bindValue(":estado", $estado);
        $ca->bindValue(":perfil", $p["filters"]["perfil"]);
        return $ca->execPage($p);
    }
}
