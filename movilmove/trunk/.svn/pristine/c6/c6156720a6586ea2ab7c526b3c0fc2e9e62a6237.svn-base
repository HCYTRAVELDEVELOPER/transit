<?php

class vehiculo {

    public static function savePreoperacional($p) {
        return preoperacional::savePreoperacional($p);
    }

    public static function consultaPreoperacionalDocumentos($p) {
        return preoperacional::consultaPreoperacionalDocumentos($p);
    }

    public static function consultaPreoperacional($p) {
        return preoperacional::consultaPreoperacional($p);
    }

    public static function borrarDocumento($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_otros_documentos_conductor", "id=:id and conductor=:conductor");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":conductor", $p["conductor"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function saveOtrosDocumentosConductor($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("edo_otros_documentos_conductor", "nombre,conductor,descripcion,adjunto,fecha,usuario,empresa");
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":conductor", $p["conductor"]);
        $ca->bindValue(":descripcion", $p["descripcion"]);
        $ca->bindValue(":adjunto", $p["adjunto"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
//        NWJSonRpcServer::console($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return "Error " . $ca->lastErrorText();
        }
        return true;
    }

    public static function populateDocumentos_otros($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa and conductor=:conductor";
        $ca->prepareSelect("edo_otros_documentos_conductor", "*", $where);
        $ca->bindValue(":conductor", $p["conductor"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return;
        }
//        print_r($ca->preparedQuery());
//        return;
        return $ca->assocAll();
    }

    public static function referir($p) {
        $p = nwMaker::getData($p);
        $link = $p["link"];
        $xa = false;
        $body = "Te ha referido {$p["nombre"]}. Por favor ingresa al siguiente link: <br /><a target='_BLANK' href='{$link}' style='border: 0 solid #00a7e7;
    color: #fff;
    display: inline-block;
    font-family: Arial,Helvetica,sans-serif;
    font-size: 17px;
    font-weight: normal;
    line-height: 28px;
    outline: none;
    padding: 18px 24px 18px 24px;
    text-decoration: none;
    word-break: normal;
    word-wrap: normal;
    background-color: #00a7e7;'>Ingresa aquí</a>";
        $asunto = "Te ha referido {$p["nombre"]}";
        $titleEnc = "Te ha referido {$p["nombre"]}";
        $textBody = $body;
        $cliente_nws = false;
        $cleanHtml = false;
//        $fromName = "";
//        $fromEmail = "";
        $send = nw_configuraciones::sendEmail($p["correo_referido"], $p["correo_referido"], $asunto, $titleEnc, $textBody, $cliente_nws, $xa, $cleanHtml, $fromName, $fromEmail);
        if (!$send) {
            return $send;
        }
        return true;
    }

    public static function validate_cupon($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $cup = $p["nombre"];
        $usuario = nwMaker::getUser($p);
        $empresa = $p["empresa"];
        $perfil = $p["perfil"];
        $ca->prepareSelect("edo_cupones", "*", "nombre=:nombre and empresa=:empresa and fecha_expiracion>=:fecha and tipo_descuento like '%valor%' ");
        $ca->bindValue(":nombre", $cup);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() === 0) {
            return false;
        }
        $r = $ca->flush();

        if (isset($p["ciudad"])) {
            if (isset($r["ciudad"]) && $r["ciudad"] != null && $r["ciudad"] != "" && $r["ciudad"] != "" && $p["ciudad"] != $r["ciudad"]) {
                return false;
            }
        }
        if ($r["valido_para_usuario"] === "SI" && $r["valido_para_conductor"] === "NO" && $perfil === "2") {
            return false;
        }
        if ($r["valido_para_usuario"] === "NO" && $r["valido_para_conductor"] === "SI" && $perfil === "1") {
            return false;
        }

        $ca->prepareSelect("edo_cupones_redimidos", "*", "cupon=:nombre and usuario=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":nombre", $cup);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            return false;
        }
//        print_r($r);
//        return;
        $ca->prepareInsert("edo_cupones_redimidos", "usuario,cupon,fecha,empresa,perfil,valor,tipo,descripcion,fecha_expiracion,estado,id_cupon,ciudad,servicio");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":id_cupon", $r["id"]);
        $ca->bindValue(":cupon", $r["nombre"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":tipo", $r["tipo_descuento"]);
        $ca->bindValue(":valor", $r["valor"]);
        $ca->bindValue(":descripcion", $r["descripcion"]);
        $ca->bindValue(":estado", 'INACTIVO');
        $ca->bindValue(":fecha_expiracion", $r["fecha_expiracion"]);
        $ca->bindValue(":ciudad", $r["ciudad"]);
        $ca->bindValue(":servicio", $r["servicio"]);
        if (!$ca->exec()) {
            $db->rollback();
            return ("Error: " . $ca->lastErrorText());
        }
        if ($perfil == "2") {
            $ca->prepareSelect("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":empresa", $empresa);
            $ca->bindValue(":perfil", $perfil);
            if (!$ca->exec()) {
                $db->rollback();
                return ("Error: " . $ca->lastErrorText());
            }
            $s = $ca->flush();
            $saldo = $s["saldo"] + $r["valor"];
            $ca->prepareUpdate("pv_clientes", "saldo", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":saldo", $saldo);
            $ca->bindValue(":empresa", $empresa);
            $ca->bindValue(":perfil", $perfil);
            if (!$ca->exec()) {
                $db->rollback();
                return ("Error: " . $ca->lastErrorText());
            }
        }
        $db->commit();
        return $r;
    }

    public static function eliminarVehiculo($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("edo_vehiculos", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function consulataVehiculos($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $where = "empresa=:empresa";
        $where .= " and (id_usuario=:id_usuario or id_otros_conductores LIKE '%{:id_usuario}%' )";
        $ca->prepareSelect("edo_vehiculos", "*", $where);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":id_usuario", $p["id_usuario"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }

    public static function sendVerifyDocumnt($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("empresas", "razon_social,slogan,logo,email", "id=:empresa");
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $empresa = $ca->flush();
        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//        $hostname = "app.movilmove.com";
        $logo = "https://" . $hostname . "{$empresa["logo"]}";
        $razon_social = $empresa["razon_social"];
        $slogan = $empresa["slogan"];
        $html = "El conductor ha creado o ha modificado un vehiculo por favor revisa que todos los documentos esten en regla y si todo esta bien activa el vehiculo. A continuacón encotraras los datos del conductor."
                . "<br><strong>Nombre: </strong> {$p["usuario_text"]}"
                . "<br><strong>Email / Usuario: </strong> {$p["usuario"]}"
                . "<br><strong>Marca: </strong> {$p["marca_text"]}"
                . "<br><strong>Placa: </strong> {$p["placa"]}"
                . "<br><strong>Tipo: </strong> {$p["tipo_vehiculo_text"]}";
        $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;' >";
//TITLE
        $body .= "<div style='text-align: center;margin: 30px 0 20px 0;background-color: #c04025; color: #fff;' >
                        <img src='{$logo}' style='width: auto; max-width: 100%; margin-top:20px;' />
                        <p>{$razon_social}</p>
                        <p style='margin-bottom:20px;'>{$slogan}</p>
                     </div>";
//MENSAJE GRANDE ALERT ENC
        $body .= " <div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>
                          <p style='    Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 30px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>
                            Reporte de modificación
                          </p>
                      </div>";
//MENSAJE CENTRO
        $body .= " <div style='text-align: left;margin: 30px 0 20px 0; padding: 0 20px'>
                         <p>
                          {$html}
                        </p>
                        <p>Notificado al correo {$empresa["email"]} Razón social {$empresa["razon_social"]}</p>
                       </div>";
//FOOTER
        $body .= " <div style='text-align: center;margin: 30px 0 20px 0; background-color: #c04025; color: #fff;'>";
        $body .= "<p style='margin-top:20px;' >Con la tecnología de <a href='https://www.gruponw.com' target='_blank'>NW Group</a></p>";
        $body .= "<p>Hostname: {$hostname} - " . date("Y-m-d H:i:s") . "</p>";
        $body .= " </div>";
//CIERRA CONTENEDOR TOTAL
        $body .= "</div>";
//        print_r($body);
        nw_configuraciones::sendEmail($empresa["email"], $empresa["razon_social"], "Reporte de modificación", "Reporte de modificación", $body, $cliente_nws = false, $dt = false, $cleanHtml = true, $p["usuario_text"], $p["usuario"]);
        nw_configuraciones::sendEmail("orionjafe@gmail.com", $empresa["razon_social"], "Reporte de modificación", "Reporte de modificación", $body, $cliente_nws = false, $dt = false, $cleanHtml = true, $p["usuario_text"], $p["usuario"]);
    }

    public static function save($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes", "rechazado,foto", "usuario_cliente=:usuario and empresa=:empresa and perfil=2");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $rech = $ca->flush();

        $bodega = null;
        $vehiculo_poliza_contractual = null;
        $vehiculo_poliza_todoriesgo = null;
        $numero_tarjeta_operacion = null;
        $numero_interno = null;
        $fields = "vehiculo_publico_particular,estado_activacion,estado_activacion_text,placa,marca_text,marca,modelo,color,"
                . "fecha_vencimiento_soat,imagen_vehi,foto_soat,tarjeta_propiedad,tipo_vehiculo,tipo_vehiculo_text,numero_puertas,capacidad_pasajeros,"
                . "servicio_activo,servicio_activo_text,activacion_cliente,descripcion_carroceria,descripcion_carroceria_text,capacidad_carga_kg,capacidad_volumen_m3,"
                . "tarjeta_propiedad_trasera,revision_tegnomecanica,nombre_propietario,identificacion_propietario,rut,direccion_proietario,telefono_proietario,fecha_vencimiento_tegnomecanica";
        if (isset($p["bodega"])) {
            $fields .= ",bodega";
            $bodega = $p["bodega"];
        }
        if (isset($p["vehiculo_poliza_todoriesgo"])) {
            $fields .= ",vehiculo_poliza_todoriesgo";
            $vehiculo_poliza_todoriesgo = $p["vehiculo_poliza_todoriesgo"];
        }
        if (isset($p["vehiculo_poliza_contractual"])) {
            $fields .= ",vehiculo_poliza_contractual";
            $vehiculo_poliza_contractual = $p["vehiculo_poliza_contractual"];
        }
        if (isset($p["numero_tarjeta_operacion"])) {
            $fields .= ",numero_tarjeta_operacion";
            $numero_tarjeta_operacion = $p["numero_tarjeta_operacion"];
        }
        if (isset($p["numero_interno"])) {
            $fields .= ",numero_interno";
            $numero_interno = $p["numero_interno"];
        }
        $fecha_vencimiento_numero_tarjeta_operacion = null;
        if (isset($p["fecha_vencimiento_numero_tarjeta_operacion"])) {
            $fields .= ",fecha_vencimiento_numero_tarjeta_operacion";
            $fecha_vencimiento_numero_tarjeta_operacion = $p["fecha_vencimiento_numero_tarjeta_operacion"];
        }
        if ($p["id"] == "") {
            $fields .= ",id,id_usuario,empresa,usuario,usuario_text,fecha";
            $id = master::getNextSequence("edo_vehiculos" . "_id_seq", $db);
            $ca->prepareInsert("edo_vehiculos", $fields);
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("edo_vehiculos", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":numero_puertas", $p["numero_puertas"], true, true);
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
        $ca->bindValue(":tipo_vehiculo_text", $p["tipo_vehiculo_text"], true, true);
        $ca->bindValue(":tipo_vehiculo", $p["tipo_vehiculo"], true, true);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":id_usuario", $p["id_usuario"], true, true);
        $ca->bindValue(":usuario_text", $p["usuario_text"], true, true);
        $ca->bindValue(":placa", $p["placa"], true, true);
        $ca->bindValue(":marca", $p["marca"], true, true);
        $ca->bindValue(":marca_text", $p["marca_text"], true, true);
        $ca->bindValue(":modelo", $p["modelo"], true, true);
        $ca->bindValue(":color", $p["color"], true, true);
        $ca->bindValue(":fecha_vencimiento_soat", $p["fecha_vencimiento_soat"], true, true);
        $ca->bindValue(":imagen_vehi", $p["imagen_vehi"], true, true);
        $ca->bindValue(":bodega", $bodega, true, true);
        $ca->bindValue(":vehiculo_poliza_todoriesgo", $vehiculo_poliza_todoriesgo, true, true);
        $ca->bindValue(":vehiculo_poliza_contractual", $vehiculo_poliza_contractual, true, true);
        $ca->bindValue(":numero_tarjeta_operacion", $numero_tarjeta_operacion, true, true);
        $ca->bindValue(":numero_interno", $numero_interno, true, true);
        $ca->bindValue(":fecha_vencimiento_numero_tarjeta_operacion", $fecha_vencimiento_numero_tarjeta_operacion, true, true);
        $ca->bindValue(":vehiculo_publico_particular", $p["vehiculo_publico_particular"], true, true);
        if ($p["id"] == "") {
            if (isset($p["activo"])) {
                $ca->bindValue(":activacion_cliente", "NO");
            } else {
                $ca->bindValue(":activacion_cliente", "SI");
            }
        } else {
            if ($rech["rechazado"] == "SI" && isset($p["update"])) {
                $ca->bindValue(":activacion_cliente", "SI");
            } else {
                $ca->bindValue(":activacion_cliente", "NO");
            }
        }
        $ca->bindValue(":estado_activacion", 0);
        $ca->bindValue(":estado_activacion_text", "solicitud_aprobacion");
        $ca->bindValue(":servicio_activo", 1);
        $ca->bindValue(":servicio_activo_text", "activo");
        $ca->bindValue(":foto_soat", $p["foto_soat"]);
        $ca->bindValue(":tarjeta_propiedad", $p["tarjeta_propiedad"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if (isset($p["update"])) {
            $estado = "";
            if (isset($rech["rechazado"]) && $rech["rechazado"] == "SI") {
                $estado = ",estado_activacion,estado_activacion_text";
//                $ca->bindValue(":estado_activacion", 6);
//                $ca->bindValue(":estado_activacion_text", "Solicitud-Aprovacion");
            }
            $ca->prepareUpdate("pv_clientes", "rechazado" . $estado, "usuario_cliente=:usuario and empresa=:empresa");
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":rechazado", "NO");
            if (isset($rech["rechazado"]) && $rech["rechazado"] == "SI") {
                $ca->bindValue(":estado_activacion", 3);
                $ca->bindValue(":estado_activacion_text", "Pre-Registrado");
            }
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
        $db->commit();
        if ($p["id"] != "") {
            self::sendVerifyDocumnt($p);
        }
        return true;
    }

    public static function consultaDatosConductor($data) {
        $p = nwMaker::getData($data);
//        print_r($p);
//        return;
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("pv_clientes a join edo_documentos_conductor b on(a.usuario_cliente=b.usuario and a.empresa=b.empresa)", "a.foto_perfil,a.no_licencia,a.estado_activacion,a.celular,atiende_subservicios,a.tipo_doc as tipo_doc_tab, b.*", "a.usuario_cliente=:usuario and a.empresa=:empresa and perfil=2");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
//        NWJSonRpcServer::console($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->flush();
    }

    public static function consultaDatosVehiculo($data) {
        $p = nwMaker::getData($data);
//        print_r($p);
//        return;
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_vehiculos", "*", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        return $ca->flush();
    }

    public static function activarVehiculo($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
//        $ca->prepareSelect("edo_vehiculos", "id", "usuario=:usuario and empresa=:empresa and id=:id_vehiculo and estado_activacion=1");
//        $ca->bindValue(":usuario", $p["usuario"]);
//        $ca->bindValue(":empresa", $p["empresa"]);
//        $ca->bindValue(":id_vehiculo", $p["id_vehiculo"]);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
//        }
//        if ($ca->size() === 0) {
//            return "NO";
//        }
//        $r = $ca->flush();
        //LIBERA OTROS VEHÍCULOS
        $where = "empresa=:empresa and ";
        $where .= " usuario_usando=:usuario ";
//        $where .= "(usuario=:usuario or  ";
//        $where .= ' id_otros_conductores like "%{' . $p["id_usuario"] . '}%" ';
//        $where .= ") ";
//        $ca->prepareUpdate("edo_vehiculos", "activacion_cliente,usuario_usando", "(usuario=:usuario or id_otros_conductores IN({$p["id_usuario"]}) ) ");
//        $ca->prepareUpdate("edo_vehiculos", "activacion_cliente,usuario_usando", $where);
        $ca->prepareUpdate("edo_vehiculos", "usuario_usando", $where);
//        $ca->bindValue(":activacion_cliente", "NO");
        $ca->bindValue(":usuario_usando", "N/A");
        $ca->bindValue(":id", $p["id_vehiculo"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        //ASIGNA
        $ca->prepareUpdate("edo_vehiculos", "activacion_cliente,usuario_usando", "id=:id");
        $ca->bindValue(":activacion_cliente", "SI");
        $ca->bindValue(":id", $p["id_vehiculo"]);
        $ca->bindValue(":usuario_usando", $p["usuario"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $ca->prepareUpdate("pv_clientes", "placa_activa", "usuario_cliente=:usuario and perfil=2 and empresa=:empresa ");
        $ca->bindValue(":placa_activa", $p["placa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function saveDatosConductor($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $fields = "no_licencia,foto_perfil,estado_activacion,estado_activacion_text,tipo_doc,nit,fecha_vencimiento";
        $celular = null;
        if (isset($p["celular"]) && $p["celular"] != "" && $p["celular"] != null) {
            $fields .= ",celular";
            $celular = $p["celular"];
        }
        $categoria = "";
        if (isset($p["categoria"]) && nwMaker::evalueData($p["celular"])) {
            $fields .= ",categoria";
            $categoria = $p["categoria"];
        }
        $ca->prepareUpdate("pv_clientes", $fields, "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
//        $ca->bindValue(":id", $p["id_usuario"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "2");
        $ca->bindValue(":celular", $celular);
        $ca->bindValue(":no_licencia", $p["no_licencia"]);
        $ca->bindValue(":fecha_vencimiento", $p["fecha_vencimiento"], true, true);
        $ca->bindValue(":foto_perfil", $p["foto_perfil"]);
        $ca->bindValue(":estado_activacion", 3);
        $ca->bindValue(":estado_activacion_text", "Pre-Registrado");
        $ca->bindValue(":tipo_doc", $p["tipo_doc"]);
        $ca->bindValue(":nit", $p["nit"]);
        $ca->bindValue(":categoria", $categoria, true, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $ca->prepareDelete("edo_documentos_conductor", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $datos_contacto_emergencia = null;
        $fields = "usuario,antecedentes_judiciales,hoja_vida,lic_conductor1,lic_conductor2,selfie_licencia";
        $fields .= ",id_conductor,empresa,fecha,tipo_doc,";
        $fields .= "nit,documento_imagen,documento_imagen_respaldo,direccion_domicilio,afp,eps,arl,referencias_per_lab,capacitaciones,";
        $fields .= "codigo_rut,adjunto_rut";
        if (isset($p["datos_contacto_emergencia"]) && $p["datos_contacto_emergencia"] != "" && $p["datos_contacto_emergencia"] != null) {
            $fields .= ",datos_contacto_emergencia";
            $datos_contacto_emergencia = $p["datos_contacto_emergencia"];
        }
        $id = master::getNextSequence("edo_documentos_conductor" . "_id_seq", $db);
        $ca->prepareInsert("edo_documentos_conductor", $fields);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":hoja_vida", $p["hoja_vida"]);
        $ca->bindValue(":antecedentes_judiciales", $p["antecedentes_judiciales"]);
        $ca->bindValue(":lic_conductor1", $p["lic_conductor1"]);
        $ca->bindValue(":lic_conductor2", $p["lic_conductor2"]);
        $ca->bindValue(":selfie_licencia", $p["selfie_licencia"]);
        $ca->bindValue(":id_conductor", $p["id_usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":tipo_doc", $p["tipo_doc"]);
        $ca->bindValue(":nit", $p["nit"]);
        $ca->bindValue(":documento_imagen", $p["documento_imagen"]);
        $ca->bindValue(":documento_imagen_respaldo", $p["documento_imagen_respaldo"]);
        $ca->bindValue(":direccion_domicilio", $p["direccion_domicilio"]);
        $ca->bindValue(":afp", $p["afp"]);
        $ca->bindValue(":eps", $p["eps"]);
        $ca->bindValue(":arl", $p["arl"]);
        $ca->bindValue(":referencias_per_lab", $p["referencias_per_lab"]);
        $ca->bindValue(":capacitaciones", $p["capacitaciones"]);
        $ca->bindValue(":codigo_rut", $p["codigo_rut"]);
        $ca->bindValue(":adjunto_rut", $p["adjunto_rut"]);
        $ca->bindValue(":datos_contacto_emergencia", $datos_contacto_emergencia);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();

        $ca->prepareSelect("pv_clientes", "*", "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":id", $p["id_usuario"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "2");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $r = $ca->flush();

//        $xa = false;
//        $body = "Nueva solicitud de activación de conductor. Usuario: {$p["usuario"]} - Empresa {$p["empresa"]} Por favor ingrese al sistema y revise la solicitud.";
//        $asunto = "Solicitud de activación de conductor {$p["usuario"]} Emp {$p["empresa"]}";
//        $titleEnc = "Solicitud de activación de conductor {$p["usuario"]} Emp {$p["empresa"]}";
//        $textBody = $body;
//        $cliente_nws = false;
//        $cleanHtml = false;
//        $send = nw_configuraciones::sendEmail("orionjafe@gmail.com", "orionjafe@gmail.com", $asunto, $titleEnc, $textBody, $cliente_nws, $xa, $cleanHtml);
//        if (!$send) {
//            $db->rollback();
//            return $send;
//        }
        return $r;
    }

    public static function actualizarDatosConductor($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $celular = "";
        if (isset($p["celular"]) && $p["celular"] != "" && $p["celular"] != null) {
            $celular = ",celular";
        }
        $ca->prepareUpdate("pv_clientes", "no_licencia,foto_perfil,tipo_doc,nit" . $celular, "usuario_cliente=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":id", $p["id_usuario"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":perfil", "2");
        if (isset($p["celular"]) && $p["celular"] != "" && $p["celular"] != null) {
            $ca->bindValue(":celular", $p["celular"]);
        }
        $ca->bindValue(":no_licencia", $p["no_licencia"]);
        $ca->bindValue(":foto_perfil", $p["foto_perfil"]);
        $ca->bindValue(":tipo_doc", $p["tipo_doc"]);
        $ca->bindValue(":nit", $p["nit"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $ca->prepareDelete("edo_documentos_conductor", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $id = master::getNextSequence("edo_documentos_conductor" . "_id_seq", $db);
        $ca->prepareInsert("edo_documentos_conductor", "usuario,antecedentes_judiciales,hoja_vida,lic_conductor1,lic_conductor2,selfie_licencia,id_conductor,empresa,"
                . "fecha,tipo_doc,nit,documento_imagen,documento_imagen_respaldo,direccion_domicilio,afp,eps,arl,referencias_per_lab,capacitaciones,"
                . "codigo_rut,adjunto_rut");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":hoja_vida", $p["hoja_vida"]);
        $ca->bindValue(":antecedentes_judiciales", $p["antecedentes_judiciales"]);
        $ca->bindValue(":lic_conductor1", $p["lic_conductor1"]);
        $ca->bindValue(":lic_conductor2", $p["lic_conductor2"]);
        $ca->bindValue(":selfie_licencia", $p["selfie_licencia"]);
        $ca->bindValue(":id_conductor", $p["id_usuario"]);
        $ca->bindValue(":tipo_doc", $p["tipo_doc"]);
        $ca->bindValue(":nit", $p["nit"]);
        $ca->bindValue(":documento_imagen", $p["documento_imagen"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));

        $ca->bindValue(":documento_imagen_respaldo", $p["documento_imagen_respaldo"]);
        $ca->bindValue(":direccion_domicilio", $p["direccion_domicilio"]);
        $ca->bindValue(":afp", $p["afp"]);
        $ca->bindValue(":eps", $p["eps"]);
        $ca->bindValue(":arl", $p["arl"]);
        $ca->bindValue(":referencias_per_lab", $p["referencias_per_lab"]);
        $ca->bindValue(":capacitaciones", $p["capacitaciones"]);
        $ca->bindValue(":codigo_rut", $p["codigo_rut"]);
        $ca->bindValue(":adjunto_rut", $p["adjunto_rut"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();
        return true;
    }
}
