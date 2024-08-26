<?php

class notificaciones {

    public static function saveNotificacionesCreaViaje($p) {
        for ($i = 0; $i < count($p["users"]); $i++) {
            $r = $p["users"][$i];
            $r["id"] = $p["id"];

            $li = Array();
            $li["modulo"] = $p["modulo"];
            $li["accion"] = "EnvioNotificacionesPush";
            $li["comentarios"] = "Usuario: {$r["usuario"]} Perfil: {$r["perfil"]} Title: {$r["title"]} Body: {$r["body"]} Token {$r["token"]} ";
            $li["id_servicio"] = $r["id"];
            $li["all_data"] = $r;
            lineTime::save($li);
        }
        return true;
    }

    public static function validaNotificaciones($p, &$db) {
        $cd = new NWDbQuery($db);
        $si = session::getInfo();
        $empresa = $p['empresa'];

        if ($p["es_cliente"] === "SI") {
            $cd->prepareSelect("empresas", "razon_social,email", "id=:empresa");
            $cd->bindValue(":empresa", $p['empresa']);
            if (!$cd->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $cd->lastErrorText());
                return;
            }
            $empres = $cd->flush();

            $liquida_fecha = date("Y-m-d H:i:s");
            $p["plantilla"] = "COTIZACION";
            $p["correo_destinatario"] = $empres["email"];
            $p["fieldsReplace"] = Array();
            $p["fieldsReplace"]["empresa_nombre"] = $empres["razon_social"];
            $p["fieldsReplace"]["tipo_servicio"] = $p["servicio_para"];
            $p["fieldsReplace"]["servicio"] = $p["tipo_servicio"];
            $p["fieldsReplace"]["fecha"] = $p['fecha'];
            $p["fieldsReplace"]["hora"] = $p['hora'];
            $p["fieldsReplace"]["totalParadas"] = $p['totalParadas'];
            $p["fieldsReplace"]["fecha_creacion"] = $p["liquida_fecha"];
            $p["fieldsReplace"]["ciudad_origen"] = $p["ciudad_origen"];
            $p["fieldsReplace"]["origen"] = $p["origen"];
            $p["fieldsReplace"]["destino"] = $p["destino"];
            $p["fieldsReplace"]["ciudad_destino"] = $p["ciudad_destino"];
            $p["fieldsReplace"]["destino"] = $p["destino"];
            $n = servicios_admin::sendEmailByPlantilla($p);
            if ($n !== true) {
                $db->rollback();
                return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]})," . $n);
            }
        }


        if ($p["estado"] == "COTIZACION" && $si['perfil'] == "1232") {
            $empres = self::validateEmpresa($empresa, $db);

            if ($empres != false) {

                $usuarios = self::validateUsuariosTerminal($empresa, $db);
                for ($i = 0; $i < count($usuarios); $i++) {
                    $liquida_fecha = date("Y-m-d H:i:s");
                    $p["plantilla"] = "CREACION_COTIZACION_OPERADOR";
                    $p["correo_destinatario"] = $usuarios[$i]["email"];
//                    $p["correo_destinatario"] = 'diegoj@gruponw.com';
                    $p["fieldsReplace"] = Array();
                    $p["fieldsReplace"]["id"] = $p['id_cotizacion'];
                    $p["fieldsReplace"]["empresa_nombre"] = $empres["razon_social"];
                    $p["fieldsReplace"]["nombre_cliente"] = $p['usuario'];
                    $p["fieldsReplace"]["tipo_servicio"] = $p["servicio_para"];
                    $p["fieldsReplace"]["servicio"] = $p["tipo_servicio"];
                    $p["fieldsReplace"]["fecha"] = $p['fecha'];
                    $p["fieldsReplace"]["hora"] = $p['hora'];
                    $p["fieldsReplace"]["totalParadas"] = $p['totalParadas'];
                    $p["fieldsReplace"]["fecha_creacion"] = $p["liquida_fecha"];
                    $p["fieldsReplace"]["ciudad_origen"] = $p["ciudad_origen"];
                    $p["fieldsReplace"]["origen"] = $p["origen"];
                    $p["fieldsReplace"]["destino"] = $p["destino"];
                    $p["fieldsReplace"]["ciudad_destino"] = $p["ciudad_destino"];
                    $p["fieldsReplace"]["destino"] = $p["destino"];

                    $n = servicios_admin::sendEmailByPlantilla($p);
                    if ($n !== true) {
                        $db->rollback();
                        return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]}), " . $n);
                    }
                }
            }
        }
        return true;
    }

    public static function notificacionesAprobacion($p, &$db) {
        $cd = new NWDbQuery($db);
        $si = session::getInfo();
        $empresa = $p['empresa'];
        $empres = self::validateEmpresa($empresa, $db);

        if ($empres != false) {
            $usuarios = self::validateUsuariosTerminal($empresa, $db);
            for ($i = 0; $i < count($usuarios); $i++) {
                $liquida_fecha = date("Y-m-d H:i:s");
                $p["plantilla"] = "RESPUESTA_COTIZACION_CLIENTE";
                $p["correo_destinatario"] = $usuarios[$i]["email"];
//                $p["correo_destinatario"] = 'diegoj@gruponw.com';
                $p["fieldsReplace"] = Array();
                $p["fieldsReplace"]["id"] = $p["id"];
                $p["fieldsReplace"]["empresa_nombre"] = $empres["razon_social"];
                $p["fieldsReplace"]["nombre_cliente"] = $si["usuario"];
                $p["fieldsReplace"]["estado"] = $p['estado'];
                $n = servicios_admin::sendEmailByPlantilla($p);
                if ($n !== true) {
                    $db->rollback();
                    return NWJSonRpcServer::error("Error enviando el correo (correo destinatario: {$p["correo_destinatario"]})," . $n);
                }
            }
        }
//        }
        return true;
    }

    public static function validateEmpresa($empresa, &$db) {
        $cd = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($p);
        $cd->prepareSelect("empresas a inner join nw_params b on a.id=b.empresa", "razon_social,email", "b.clave='correo_cotizaciones' and valor='SI' and a.id=:empresa");
        $cd->bindValue(":empresa", $empresa);

        if (!$cd->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $cd->lastErrorText());
            return;
        }
        return $cd->flush();
    }

    public static function validateUsuariosTerminal($empresa, &$db) {
        $cd = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($p);
        $cd->prepareSelect("usuarios", "email", "empresa=:empresa and terminal=:terminal and perfil_text<>'Cliente'");
        $cd->bindValue(":empresa", $empresa);
        $cd->bindValue(":terminal", $si['terminal']);
//        NWJSonRpcServer::information($cd->preparedQuery());
        if (!$cd->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $cd->lastErrorText());
            return;
        }
        return $cd->assocAll();
    }
}
