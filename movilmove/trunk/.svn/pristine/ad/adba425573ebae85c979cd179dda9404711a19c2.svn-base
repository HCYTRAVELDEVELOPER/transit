<?php

class conductores {

    public static function consultaTipologiaCancelacion($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa ";
        $where .= " and perfil=:perfil ";
        $where .= " order by nombre asc ";
        $ca->prepareSelect("edo_motivos_cancelacion", "pide_fotos as id, nombre", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":terminal", $p["terminal"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaTipologiaNovedadParada($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $ca->prepareSelect("edo_tipologia_novedad_paradas", "id,nombre", "empresa=:empresa and terminal=:terminal");
        $ca->prepareSelect("edo_tipologia_novedad_paradas", "id,nombre,aplica_no_abordo", "empresa=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":terminal", $p["terminal"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function myEstado($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select estado_activacion from pv_clientes where usuario_cliente=:usuario and empresa=:empresa and  perfil=:perfil");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "2");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->flush();
    }

    public static function populateVehiculos($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select id,placa as nombre from edo_vehiculos where empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getUrlShort($p) {
        $p = nwMaker::getData($p);
        $r = Array();
        $r["link"] = nwMaker::shorten_URL($p["link"]);
        $r["link_driver"] = nwMaker::shorten_URL($p["link_driver"]);
        return $r;
    }

    public static function getConductoresCerca($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " perfil=2 and empresa=:empresa ";
//        $where .= " and offline <> 'offline' ";
        $where .= " and estado_conexion='conectado' ";
//        $where .= " and fecha_ultima_conexion >= :fecha ";
//        $fecha_hora = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "-40 second");
        if (isset($p["filters"])) {
            if ($p["filters"]["ciudades"] != "") {
                $where .= " and ciudad_text=:ciudad";
                $ca->bindValue(":ciudad", $p["filters"]["ciudades_text"]);
            }
        }
        $ca->prepareSelect("pv_clientes", "latitud,longitud,nombre,apellido", $where);
//        $ca->bindValue(":fecha", $fecha_hora);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getConductor($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        $where .= " perfil=2";
        $ca->prepareSelect("pv_clientes", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function borrarDocumento($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareDelete("edo_otros_documentos_conductor", "id=:id and conductor=:conductor");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":conductor", $p["conductor"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function guardarDocumentosOtros($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareInsert("edo_otros_documentos_conductor", "nombre,conductor,descripcion,adjunto,fecha,usuario,empresa");
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":conductor", $p["conductor"]);
        $ca->bindValue(":descripcion", $p["descripcion"]);
        $ca->bindValue(":adjunto", $p["adjunto"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
//        NWJSonRpcServer::console($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }
        return true;
    }

    public static function consultaComparendos($p) {
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "empresa=:empresa and usuario=:conductor";
        $ca->prepareSelect("edo_comparendos", "*", $where);
        $ca->bindValue(":conductor", $p["conductor"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function consultaDocumentosOtros($p) {
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("edo_otros_documentos_conductor", "*", "empresa=:empresa and usuario=:conductor");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":conductor", $p["email"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function enviaCorreo($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("sop_correos", "usuario,fecha,empresa,observaciones,celular,nombre");
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":observaciones", $p["observaciones"]);
        $ca->bindValue(":celular", $p["celular"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        $n = self::sendEmailServicioDestiono($p);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
        return true;
    }

    public static function sendEmailServicioDestiono($data, $inactive = false) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("empresas", "razon_social,slogan,logo,img_header,img_body,img_footer", "id=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $empresa = $ca->flush();
        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//        $hostname = "app.movilmove.com";
//        NWJSonRpcServer::console($hostname);
//        
        $logo = "https://" . $hostname . "{$empresa["logo"]}";
        $razon_social = $empresa["razon_social"];
        $slogan = $empresa["slogan"];
        strtoupper($p["nombre"][0]);
        $cliente = $p["nombre"];
        $tittle = "Respuesta solicitud";
        if ($inactive) {
            $html = "Hola  {$cliente}, </br></br> Tu usuario ha sido inactivado. Por favor comunícate con el administrador.";
            $tittle = "Inactivación";
        } else {
            $tittle = "Activación";
            $html = "Hola  {$cliente}, " . $p["html"] . "</br></br><strong>Observaciones: </strong>" . $p["observaciones"];
        }


        $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;'>";
        $body .= "<div style='position: relative;display: flex;'>";
        $body .= "<div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>";
        $body .= "<p style='width: 167px;Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 38px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>";
        $body .= $tittle;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;position: absolute;'>";
        $body .= "<img style='width: 100%;' src='http://" . $hostname . $empresa["img_header"] . "' alt='' />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<div style='text-align: left;margin: 30px 0 20px 0; padding: 0 20px'>";
        $body .= "<p>";
        $body .= $html;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;'>";
        $body .= "<img style='width: 100%;' src='http://" . $hostname . $empresa["img_body"] . "' alt='' />";
        $body .= "</div>";
        $body .= "<div style='background: #000000; text-align: center; color: #fff; position: relative;top: -20px;'>";
        $body .= "<div style='display: flex;padding: 17px;'>";
        $body .= "<div style='width: 200px;'>";
        $body .= "<img style='width: 200px;' src='http://" . $hostname . $empresa["img_footer"] . "' alt='' />";
        $body .= "</div>";
        $body .= "<div style='display: flex;justify-content: space-between;position: absolute;right: 47px;width: 112px;padding: 9px;'>";
        $body .= "<img  src='http://" . $hostname . "/imagenes/face-correo.png' alt='' />";
        $body .= "<img  src='http://" . $hostname . "/imagenes/istag-correo.png' alt='' />";
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

//        NWJSonRpcServer::console($body);
//        $body_notify = $p["body_notify"];
        if ($inactive) {
            $obs = "Tu usuario ha sido inactivado. Pof favor comunícate con el administrador.";
        } else {
            $obs = $p["observaciones"];
            $leng = strlen($obs);
            if ($leng > 100) {
                $tot = $leng - 100;
                $obs = substr($obs, 0, -$tot);
            }
        }
        $body_notify = $obs;

        $a = Array();
        $a["correo_usuario_recibe"] = $p["usuario_cliente"];
        $a["destinatario"] = $p["usuario_cliente"];
        $a["titleMensaje"] = $tittle;
        $a["sms_body"] = $body_notify;
        $a["body"] = $body_notify;
        $a["body_email"] = $body;
        $a["tipo"] = "enviarInCron";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = date("Y-m-d H:i:s");
        $a["tipoAviso"] = "driver";
        $a["id_objetivo"] = $p["id"];
        $a["foto"] = $logo;
        $a["usuario_envia"] = $p["usuario_cliente"];
        $a["sendEmail"] = true;
        $a["sendNotifyPush"] = true;
        $a["celular"] = $p["celular"];
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["fromName"] = $razon_social;
//        $a["fromEmail"] = "";
        $a["empresa"] = nwMaker::getDataSESSION($p, "empresa");
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
        return true;
    }

    public static function updateRechazado($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("pv_clientes", "estado_activacion,foto_perfil,estado_activacion_text,rechazado", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":rechazado", "SI");
        $ca->bindValue(":foto_perfil", false);
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":no_licencia", "");
        $ca->bindValue(":foto_perfil", "");
        $ca->bindValue(":estado_activacion", null);
        $ca->bindValue(":estado_activacion_text", "rechazado");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $where = "empresa=:empresa and usuario=:usuario and activacion_cliente='SI'";
        $ca->prepareUpdate("edo_vehiculos", "activacion_cliente,estado_activacion,estado_activacion_text", $where);
        $ca->bindValue(":activacion_cliente", "NO");
        $ca->bindValue(":estado_activacion", 2);
        $ca->bindValue(":estado_activacion_text", "inactivo");
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        $p["html"] = "no has pasado el proceso de verificación.";
        $p["body_notify"] = "Lo sentimos, no has pasado el proceso de verificación, te hemos enviado un correo con las observaciones que debes corregir.";
        $n = self::sendEmailServicioDestiono($p);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
        return true;
    }

    public static function getConductores($p) {
        session::check();
        $db = NWDatabase::database();
//        NWJSonRpcServer::console($p);
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = " where perfil=2 and empresa=:empresa and offline=:offline and estado_conexion=:estado_conexion and fecha_ultima_conexion >= :fecha";
//        $where = " where perfil=2 and offline= 'activo'";

        if (isset($p["filters"])) {
            if (isset($p["filters"]["cliente"])) {
                if ($p["filters"]["cliente"] != "") {
                    $where .= " and cliente='" . $p["filters"]["cliente"] . "' ";
                }
            }
        }
        $sql = "select * from pv_clientes" . $where;
//        $fecha_hora = date("Y-m-d H:i:s");
//        $fecha_hora = nwMaker::sumaRestaFechasByFecha("+0 hour", "+0 minute", "-40 second", $fecha_hora);
        $fecha_hora = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "-40 second");
//        NWJSonRpcServer::console($fecha_hora);
        $ca->bindValue(":fecha", $fecha_hora);
        $ca->bindValue(":estado_conexion", "conectado");
        $ca->bindValue(":offline", "activo");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->prepare($sql);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateFindConductor($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $si = session::info();
        $sql = "select * from pv_clientes where nit=:documento and perfil=:perfil and empresa=:empresa";
        $ca->prepare($sql);
        $ca->bindValue(":documento", $p["nit"], true);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
//        NWJSonRpcServer::console($ca->flush());
        return $ca->flush();
    }

    public static function consultaSaldoFlotas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $si = session::info();
        $sql = "select tope_saldo from edo_empresas where empresa=:empresa and id=:bodega";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":bodega", $si["bodega"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->flush();
    }

    public static function populatenavTableDoc($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepare("select * from edo_documentos_conductor where id_conductor=:id_conductor");
        $ca->bindValue(":id_conductor", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function tarifa($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepare("select * from edo_taximetro where id=:tipo_servicio and empresa=:empresa");
        $ca->bindValue(":tipo_servicio", $p["tipo_servicio"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $res = $ca->assocAll();
//        if ($ca->size() > 0) {
//            $tax = $ca->assocAll();
//            for ($i = 0; $i < count($res); $i++) {
//                for ($j = 0; $j < count($tax); $j++) {
//                    if ($res[$i]["id"] = $tax[$i]["trayecto"]) {
//                        $res[$i]["valor_banderazo"] = $tax[$i]["valor_banderazo"];
//                        $res[$i]["minima"] = $tax[$i]["minima"];
//                        $res[$i]["valor_mascota"] = $tax[$i]["valor_mascota"];
//                        $res[$i]["valor_unidad_metros"] = $tax[$i]["valor_unidad_metros"];
//                        $res[$i]["valor_unidad_tiempo"] = $tax[$i]["valor_unidad_tiempo"];
//                    }
//                }
//            }
//        }
        if (isset($p["app_para"])) {
            if (isset($si["bodega"]) && $si["bodega"] != null && $si["bodega"] != 'null' && $si["bodega"] != 'undefined') {
                $ca->prepare("select * from edo_taximetro_cliente where trayecto=:tipo_servicio and id_cliente=:cliente and empresa=:empresa");
                $ca->bindValue(":cliente", $si["bodega"]);
                $ca->bindValue(":tipo_servicio", $p["tipo_servicio"]);
                $ca->bindValue(":empresa", $si["empresa"]);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error($ca->lastErrorText());
                    return false;
                }
                $res1 = $ca->flush();
                if ($ca->size() > 0) {
                    $res[0]["valor_banderazo"] = $res1["valor_banderazo"];
                    $res[0]["minima"] = $res1["minima"];
                    $res[0]["valor_mascota"] = $res1["valor_mascota"];
                    $res[0]["valor_unidad_metros"] = $res1["valor_unidad_metros"];
                    $res[0]["valor_unidad_tiempo"] = $res1["valor_unidad_tiempo"];
                }
            }
        }
//        NWJSonRpcServer::console($res);
        return $res;
    }

    public static function recargos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $hoy = date("H:i:s");
        $ca->prepare("select * from edo_recargos where empresa=:empresa and :hora between desde AND hasta");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":hora", $hoy);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function comisiones() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("edo_comisiones", "porcentaje", "empresa=:empresa and activo='SI' order by id desc limit 1");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->flush();
    }

    public static function consultaConductor($p) {
        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $bodega = null;
        $estado = null;
        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        $fecha = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
        $fechafin = "";
        $fechainicio = "";
        $fecha_inicial = null;
        $fecha_final = null;
        $filtro_fecha = "";
        $where = "a.empresa=:empresa and a.perfil=2 ";
        $where .= " and a.estado<>'ELIMINADO' ";
        if (isset($p["permisos"])) {
            if (isset($p["permisos"]["filtrar_por_flota"])) {
                if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                    $where .= " and a.bodega=:flota ";
                }
            }
            if (isset($p["permisos"]["filtrar_por_terminal"])) {
                if ($p["permisos"]["filtrar_por_terminal"] === "true" || $p["permisos"]["filtrar_por_terminal"] === true) {
                    $where .= " and a.terminal=:terminal ";
                }
            }
        }
        if (isset($p["filters"])) {
            if (nwMaker::evalueData($p["filters"]["fecha_inicial"]) && nwMaker::evalueData($p["filters"]["fecha_final"])) {
                $fecha_inicial = $p["filters"]["fecha_inicial"];
                $fecha_final = $p["filters"]["fecha_final"];
                $where .= " and DATE(a.fecha_registro) between :fecha_inicial and :fecha_final ";
            }
            if ($p["filters"]["buscar_driver"] != "") {
                $campos = "a.nombre,a.usuario_cliente,a.nit,a.email,a.apellido,a.telefono,a.placa_activa";
                $where .= "and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar_driver"], true);
            }
            if ($p["filters"]["estadoa"] != "") {
                if ($p["filters"]["estadoa"] == "Cuenta-creada") {
                    $where .= " and a.estado_activacion_text IS NULL ";
                } else
                if ($p["filters"]["estadoa"] == "rechazado") {
                    $where .= " and a.rechazado='SI' ";
                } else {
                    $where .= " and a.estado_activacion_text=:estado ";
                    $estado = $p["filters"]["estadoa"];
                }
            }
        }
        if (isset($p["minutos_adicionar_tardanzas"])) {
            $minutos = $p["minutos_adicionar_tardanzas"];
        }
        $where .= " order by a.id desc ";
        $where = str_replace("::text", "", $where);
        $tables = "pv_clientes a";
        $fields = "a.*";
        if (isset($p["bloqueo_incumplimiento"])) {
            $fields .= ",(CASE WHEN a.fecha_bloqueo is null THEN (select COUNT(id) from edo_servicios where empresa=:empresa and conductor_id=a.id and estado='ACEPTADO_RESERVA' and CONCAT(fecha, ' ', hora) < :fecha) ELSE "
                    . "(select COUNT(id) from edo_servicios where empresa=:empresa and conductor_id=a.id and estado='ACEPTADO_RESERVA' and CONCAT(fecha, ' ', hora) <:fecha  and  CONCAT(fecha, ' ', hora) > a.fecha_bloqueo) END ) AS catidad_incumplimiento";
        }
        if (isset($p["minutos_adicionar_tardanzas"])) {
            $fields .= ",(CASE WHEN a.fecha_bloqueo is null THEN (select COUNT(id) from edo_servicios where empresa=:empresa and conductor_id=a.id and tipo_servicio=:tipo_servicio and estado='LLEGADA_DESTINO' and CONCAT(fecha, ' ', hora) + INTERVAL " . $minutos . " MINUTE < CONCAT(fecha, ' ', hora_llegada)) ELSE "
                    . "(select COUNT(id) from edo_servicios where empresa=:empresa and conductor_id=a.id and tipo_servicio=:tipo_servicio and estado='LLEGADA_DESTINO' and CONCAT(fecha, ' ', hora) + INTERVAL " . $minutos . " MINUTE < CONCAT(fecha, ' ', hora_llegada) and  CONCAT(fecha, ' ', hora) > a.fecha_bloqueo) END ) AS catidad_tardanzas";
        }
//        $fields .= ",(SELECT count(*) from edo_servicios b WHERE a.id=b.conductor_id and estado = 'LLEGADA_DESTINO' {$filtro_fecha}) as total_viajes";
//        $fields .= ",ROUND(( SELECT SUM(utilidad_conductor) from edo_servicios b WHERE a.id=b.conductor_id and estado = 'LLEGADA_DESTINO' {$filtro_fecha})) as utilidad_conductor";
//        $fields .= ",ROUND(( SELECT SUM(utilidad_empresa) from edo_servicios b WHERE a.id=b.conductor_id and estado = 'LLEGADA_DESTINO' {$filtro_fecha})) as utilidad_interna";
//        $fields .= ",ROUND(( SELECT SUM(valor_total_servicio) from edo_servicios b WHERE a.id=b.conductor_id and estado = 'LLEGADA_DESTINO' {$filtro_fecha})) as total_valor";
        $ca->prepareSelect($tables, $fields, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha_inicial", $fecha_inicial);
        $ca->bindValue(":fecha_final", $fecha_final);
        $ca->bindValue(":fecha_inicio", $fechainicio);
        $ca->bindValue(":fecha_fin", $fechafin);
        $ca->bindValue(":fecha", $fecha);
        $ca->bindValue(":tipo_servicio", "reservado");
        $ca->bindValue(":rechazado", 'SI');
        $ca->bindValue(":bodega", $bodega, true);
        $ca->bindValue(":estado", $estado, true);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":flota", $flota, true);
//        $r = Array();
//        $r["conductores"] = $ca->execPage($p);
//        $r["comision"] = self::comisiones();
//        return $r;
        return $ca->execPage($p);
    }

    public static function enrutamientoUltimamilla($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($p);
        $where = "  empresa=:empresa";
        if (isset($p["fecha_inicial"])) {
            if ($p["fecha_inicial"] !== "" && $p["fecha_final"] !== "") {
                $where .= " and fecha between :fecha_inicial and :fecha_final";
            }
        }
        $ca->prepareSelect("edo_enrutamiento ", " * ", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha_inicial", $p["fecha_inicial"]);
        $ca->bindValue(":fecha_final", $p["fecha_final"]);

//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta" . $ca->lastErrorText());
            return false;
        }
//         NWJSonRpcServer::console($ca->assocAll());
        return $ca->assocAll();
    }

    public static function saveConductor($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $cd = new NWDbQuery($db);
        $si = session::getInfo();
        $id = "";
        if ($p["id"] == "") {
            $cd->prepare("select * from pv_clientes where usuario_cliente=:usuario_cliente and empresa=:empresa and perfil=2");
            $cd->bindValue(":empresa", $si["empresa"]);
            $cd->bindValue(":usuario_cliente", $p["email"]);
            if (!$cd->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return;
            }
            if ($cd->size() > 0) {
                NWJSonRpcServer::information("Ya se encuentra registrado un conductor con el mismo correo.");
                return;
            }
            $id = master::getNextSequence("pv_clientes" . "_id_seq", $db);
        } else {
            $id = $p["id"];
        }
        $bodega = null;
        $fields = "id,usuario,foto,nombre,apellido,documento,celular,usuario_cliente,offline,nit,saldo,"
                . "email,no_licencia,categoria,fecha_vencimiento,perfil,perfil_text,terminal,"
                . "empresa,genero,contrato,servicios_activos,tipo_doc,atiende_subservicios";
        $fields .= ",ciudad,ciudad_text,pais,pais_text";
        if (nwMaker::evalueData($p["foto_perfil"])) {
            $fields .= ",foto_perfil";
        }
        $bodega_text = null;
        if (isset($p["bodega"]) && $p["bodega"] != "") {
            $fields .= ",bodega,bodega_text";
            $bodega = $p["bodega"];
            $bodega_text = $p["bodega_text"];
        }
        if ($p["id"] == "") {
//            $fields .= ",clave";
            $fields .= ",fecha_registro";
            $ca->prepareInsert("pv_clientes", $fields);
        } else {
            $ca->prepareUpdate("pv_clientes", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }

        $ca->bindValue(":fecha_registro", date("Y-m-d H:i:s"));
        $ca->bindValue(":ciudad", $p["ciudad"], true, true);
        $ca->bindValue(":ciudad_text", $p["ciudad_text"], true, true);
        $ca->bindValue(":pais", $p["pais"], true, true);
        $ca->bindValue(":pais_text", $p["pais_text"], true, true);
        $ca->bindValue(":terminal", $p["terminal"], true, true);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":usuario", $p["email"], true, true);
        $ca->bindValue(":foto_perfil", $p["foto_perfil"], true, true);
        $ca->bindValue(":offline", "activo");
        $ca->bindValue(":saldo", "0");
        $ca->bindValue(":foto", $p["foto_perfil"], true, true);
        $ca->bindValue(":nombre", $p["nombre"], true, true);
        $ca->bindValue(":apellido", $p["apellido"], true, true);
        $ca->bindValue(":documento", $p["nit"], true, true);
        $ca->bindValue(":nit", $p["nit"], true, true);
        $ca->bindValue(":celular", $p["celular"], true, true);
        $ca->bindValue(":genero", $p["genero"], true, true);
        $ca->bindValue(":email", $p["email"], true, true);
        $ca->bindValue(":no_licencia", $p["no_licencia"], true, true);
        $ca->bindValue(":categoria", $p["categoria"], true, true);
        $ca->bindValue(":fecha_vencimiento", $p["fecha_vencimiento"], true, true);
        $ca->bindValue(":contrato", $p["contrato"] == "" ? 0 : $p["contrato"], true, true);
        $ca->bindValue(":perfil", $p["perfil"] == "" ? 0 : $p["perfil"], true, true);
        $ca->bindValue(":tipo_doc", $p["tipo_doc"] == "" ? 0 : $p["tipo_doc"], true, true);
        $ca->bindValue(":perfil_text", $p["perfil_text"], true, true);
        $ca->bindValue(":usuario_cliente", $p["email"], true, true);
        $ca->bindValue(":empresa", $si["empresa"], true, true);
        $ca->bindValue(":servicios_activos", $p["activar_servicios"], true, true);
        $ca->bindValue(":atiende_subservicios", $p["subservicio"], true, true);
        $ca->bindValue(":bodega", $bodega);
        $ca->bindValue(":bodega_text", $bodega_text);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        if (isset($p["documentos_conductor"])) {
            if (count($p["documentos_conductor"]) > 0) {
                $r = $p["documentos_conductor"][0];
//                foreach ($p["documentos_conductor"] as $r) {
                $field = "id_conductor,fecha,usuario,hoja_vida,examen_medico,licencia_conduccion,ver_comparendos,"
                        . "lic_conductor1,lic_conductor2,selfie_licencia,antecedentes_judiciales,certificacion_licencia,examen_alcohol,"
                        . "adjunto_uno,adjunto_dos,observaciones,documento_imagen,documento_imagen_respaldo,direccion_domicilio,afp,eps,arl,referencias_per_lab,empresa";
                if ($p["id"] == "") {
                    $ca->prepareInsert("edo_documentos_conductor", $field);
                } else {
                    $ca->prepareUpdate("edo_documentos_conductor", $field, "id_conductor=:id_conductor");
                }
                $ca->bindValue(":id_conductor", $id);
                $ca->bindValue(":usuario", $p["email"], true, true);
                $ca->bindValue(":empresa", $si["empresa"], true, true);
                $ca->bindValue(":fecha", date("Y-m-d"));
                $ca->bindValue(":hoja_vida", $r["hoja_vida"], true, true);
                $ca->bindValue(":examen_medico", $r["examen_medico"], true, true);
                $ca->bindValue(":licencia_conduccion", $r["licencia_conduccion"], true, true);
                $ca->bindValue(":ver_comparendos", $r["ver_comparendos"], true, true);
                $ca->bindValue(":antecedentes_judiciales", $r["antecedentes_judiciales"], true, true);
                $ca->bindValue(":certificacion_licencia", $r["certificacion_licencia"], true, true);
                $ca->bindValue(":examen_alcohol", $r["examen_alcohol"], true, true);
                $ca->bindValue(":adjunto_uno", $r["adjunto_uno"], true, true);
                $ca->bindValue(":adjunto_dos", $r["adjunto_dos"], true, true);
                $ca->bindValue(":lic_conductor1", $r["lic_conductor1"], true, true);
                $ca->bindValue(":lic_conductor2", $r["lic_conductor2"], true, true);
                $ca->bindValue(":selfie_licencia", $r["selfie_licencia"], true, true);
                $ca->bindValue(":observaciones", $r["observaciones"] == "" ? 0 : $r["observaciones"], true, true);
                $ca->bindValue(":documento_imagen", $r["documento_imagen"], true, true);
                $ca->bindValue(":documento_imagen_respaldo", $r["documento_imagen_respaldo"], true, true);
                $ca->bindValue(":direccion_domicilio", $r["direccion_domicilio"], true, true);
                $ca->bindValue(":afp", $r["afp"], true, true);
                $ca->bindValue(":eps", $r["eps"], true, true);
                $ca->bindValue(":arl", $r["arl"], true, true);
                $ca->bindValue(":referencias_per_lab", $r["referencias_per_lab"], true, true);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
//                }
            }
        }
        if (isset($p["comparendos"])) {
            if (count($p["comparendos"]) > 0) {
                $ca->prepareDelete("edo_comparendos", "id_conductor=:id");
                $ca->bindValue(":id", $id);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                    return;
                }
                foreach ($p["comparendos"] as $r) {
                    $ca->prepareInsert("edo_comparendos", "id_conductor,adjunto,numero_comparendo,vehiculo,observacion,fecha_comparendo,vehiculo_text,usuario,empresa");
                    $ca->bindValue(":id_conductor", $id);
                    $ca->bindValue(":usuario", $p["email"], true, true);
                    $ca->bindValue(":empresa", $si["empresa"], true, true);
                    $ca->bindValue(":fecha_comparendo", $r["fecha_comparendo"], true, true);
                    $ca->bindValue(":adjunto", $r["adjunto"], true, true);
                    $ca->bindValue(":numero_comparendo", $r["numero_comparendo"], true, true);
                    $ca->bindValue(":vehiculo", $r["vehiculo"], true, true);
                    $ca->bindValue(":vehiculo_text", $r["vehiculo_text"], true, true);
                    $ca->bindValue(":observacion", $r["observacion"], true, true);

                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error($ca->lastErrorText());
                    }
                }
            }
        }
        if (isset($p["otros_documentos"])) {
            if (count($p["otros_documentos"]) > 0) {
                $ca->prepareDelete("edo_otros_documentos_conductor", "usuario=:usuario");
                $ca->bindValue(":usuario", $p["email"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                    return;
                }
                foreach ($p["otros_documentos"] as $r) {
                    $ca->prepareInsert("edo_otros_documentos_conductor", "nombre,conductor,descripcion,adjunto,fecha,usuario,empresa");
                    $ca->bindValue(":nombre", $r["nombre"], true, true);
                    $ca->bindValue(":conductor", $id);
                    $ca->bindValue(":descripcion", $r["descripcion"], true, true);
                    $ca->bindValue(":adjunto", $r["adjunto"], true, true);
                    $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
                    $ca->bindValue(":empresa", $si["empresa"], true, true);
                    $ca->bindValue(":usuario", $p["email"], true, true);
                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error($ca->lastErrorText());
                    }
                }
            }
        }
        $p["empresa"] = $si["empresa"];
//        servicios_conductor::sendEmailProccess($p, "REGISTRO CONDUCTORES");
        if ($p["id"] == "") {
            $ca->prepareSelect("empresas", "*", "id=:id");
            $ca->bindValue(":id", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                $datos = $ca->flush();
                $p["logo"] = $datos["logo"];
                $p["empresa"] = $datos["razon_social"];
                $p["usuario"] = $p["email"];
                $p["plantilla_bienvenida"] = "movilmove";
            }
            $p["usuario"] = $p["email"];
            $p["tipo_plantilla"] = "CREAR_CUENTA_CONDUCTOR_MOVILMOVE";
            master::sendWelcomeMail($p);
        }

        $cd->prepare("select json from nwmaker_suscriptorsPush where usuario=:usuario and perfil=:perfil and empresa=:empresa");
        $cd->bindValue(":usuario", $p["email"]);
        $cd->bindValue(":perfil", $p["perfil"]);
        $cd->bindValue(":empresa", $si["empresa"]);
        if (!$cd->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
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
        $db->commit();
        return $token;
    }

    public static function saveHoursDrivers($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareUpdate("pv_clientes", "hora_inicio,hora_fin", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":hora_inicio", $p["hora_inicio"]);
        $ca->bindValue(":hora_fin", $p["hora_fin"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        $db->commit();
        return true;
    }

    public static function cambioEstado($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $estado_activacion = "1";
        $estado_activacion_text = "Activo";
        if ($p["estado_activacion"] == "1") {
            $estado_activacion = "2";
            $estado_activacion_text = "Inactivo";
        }
        $fields = "estado_activacion_text,estado_activacion";
        $ca->prepareUpdate("pv_clientes", $fields, "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado_activacion", $estado_activacion);
        $ca->bindValue(":estado_activacion_text", $estado_activacion_text);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();
//        self::sendEmailServicioDestiono($p, true);
    }

    public static function verificar($p) {
//        NWJSonRpcServer::console($p);
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $cs = new NWDbQuery($db);
        $where = " email=:email and empresa=:empresa and perfil=2";
        $cs->prepareSelect("pv_clientes", "*", $where);
        $cs->bindValue(":email", $p);
        $cs->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::information($cs->preparedQuery());
        if (!$cs->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        if ($cs->size() == 0) {
            return false;
        } else {
//            NWJSonRpcServer::information("El email ya se encuentra registrado, Valida por favor");
            return true;
//            $parametrizacion = $ca->flush();
        }
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cd = new NWDbQuery($db);
        if ($p["id"] == "") {
            NWJSonRpcServer::error("Debe seleccionar un registro para poder eliminarlo");
            return false;
        }
        $si = session::info();
//        esta opcion no,lo elimina solo cambia el estado se comenta para mas adelante poder usar
//        $where = "id=:id";
//        $ca->prepareUpdate("pv_clientes", "estado,estado_activacion,estado_activacion_text", $where);
//        $ca->bindValue(":id", $p["id"]);
//        $ca->bindValue(":estado", "ELIMINADO");
//        $ca->bindValue(":estado_activacion", 10);
//        $ca->bindValue(":estado_activacion_text", "Eliminado");
//        $ca->bindValue(":empresa", $si["empresa"]);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
//            return false;
//        }

        $ca->prepareDelete("pv_clientes", "id=:id and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", '2');
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("edo_documentos_conductor", "usuario=:usuario and id_conductor=:id and empresa=:empresa");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("edo_otros_documentos_conductor", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
//        $cd->prepareDelete("edo_vehiculos", "usuario=:usuario and empresa=:empresa");
//        $cd->bindValue(":usuario", $p["usuario"]);
//        $cd->bindValue(":empresa", $si["empresa"]);
//        if (!$cd->exec()) {
//            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
//            return false;
//        }
        return true;
    }

    public static function getAgenda($p) {
        session::check();
        $si = session::info();
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $hoy = date("Y-m-d");
//        $hora = "08:15:26";
        $hora = date("H:i:s");
//        $ca->prepareSelect("edo_servicios", "*");
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//            return;
//        }
//        if ($ca->size() == 0) {
//            NWJSonRpcServer::information("Debe parametrizar la Agenda. Verifique por favor");
//            return;
//        } else {
//            $parametrizacion = $ca->flush();
//        }
        $where = "";
        $where .= " conductor_id=:conductor_id and fecha >= '$hoy' and hora >= '$hora' and hora_fin_servicio is null and empresa=:empresa";
//        if ($parametrizacion["nombre"] == "Diario") {
//            $where.=" and fecha=:fecha";
//            $ca->bindValue(":fecha", date("Y-m-d"));
//        }
//        if ($parametrizacion["nombre"] == "Semanal") {
//            $where.=" and fecha between :fecha and :nuevaFecha";
//
//            $fecha = date('Y-m-j');
//            $nuevafecha = strtotime('+7 day', strtotime($fecha));
//            $nuevafecha = date('Y-m-j', $nuevafecha);
//            $ca->bindValue(":fecha", date("Y-m-d"));
//            $ca->bindValue(":nuevaFecha", $nuevafecha);
//        }
//        if ($parametrizacion["nombre"] == "Mensual") {
//            $where.=" and fecha between :fecha and :nuevaFecha";
//
//            $fecha = date('Y-m-j');
//            $nuevafecha = strtotime('+1 month', strtotime($fecha));
//            $nuevafecha = date('Y-m-j', $nuevafecha);
//            $ca->bindValue(":fecha", date("Y-m-d"));
//            $ca->bindValue(":nuevaFecha", $nuevafecha);
//        }
//        if ($parametrizacion["nombre"] == "Anual") {
//            $where.=" and fecha between :fecha and :nuevaFecha";
//
//            $fecha = date('Y-m-j');
//            $nuevafecha = strtotime('+1 year', strtotime($fecha));
//            $nuevafecha = date('Y-m-j', $nuevafecha);
//            $ca->bindValue(":fecha", date("Y-m-d"));
//            $ca->bindValue(":nuevaFecha", $nuevafecha);
//        }
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":conductor_id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
//        $cs = $ca->assocAll();
//        NWJSonRpcServer::console($cs);
        return $ca->assocAll();
    }

    public static function getMotorizados($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
//        $where .= " id_usuario=:conductor_id ";
        $where .= " usuario=:usuario_cond ";
        $where .= " and servicio_activo_text='activo' and activacion_cliente='SI' and empresa=:empresa";
        $ca->prepareSelect("edo_vehiculos", "*", $where);
        $ca->bindValue(":conductor_id", $p["id"]);
        $ca->bindValue(":usuario_cond", $p["usuario_cond"]);
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::console($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
        if ($ca->size() === 0) {
//            NWJSonRpcServer::information("El conductor no tiene información de su vehículo. Consulte en vehículos de conductores y valide que tenga uno.");
            return false;
        }
        return $ca->assocAll();
    }
}

?>