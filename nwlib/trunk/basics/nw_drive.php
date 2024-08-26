<?php

class nw_drive {

    public static function subir_file($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $archivo = $p["nombre"];
        $trozos = explode(".", $archivo);
        $extension = end($trozos);
        $fields = "id,nombre,extension,ruta, fecha,usuario,empresa,compartir";
        if ($p["id"] == "") {
            $id = master::getNextSequence("nw_drive_files_id_seq");
            $ca->prepareInsert("nw_drive_files", $fields);
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("nw_drive_files", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $archivo);
        $ca->bindValue(":extension", $extension);
        $ca->bindValue(":ruta", $p["ruta"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":compartir", $p["compartir"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            return "Error procesando el registro: " . $ca->lastErrorText();
        }
        return true;
    }

    public static function consulta_files() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_drive_files", "*", "usuario=:usuario and empresa=:empresa order by fecha desc");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            return "Error ejecutando la consulta: " . $ca->preparedQuery() . " Error: " . $ca->lastErrorText();
        }
        return $ca->assocAll();
    }

    public static function consulta_red() {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $table = "nw_drive_folders a";
        $table .= " left join usuarios b ON(a.usuario=b.usuario)";
        $where = "a.empresa=:empresa";
        $where .= " and b.estado='activo' ";
        $where .= " group by a.usuario ";
        $where .= " order by a.usuario asc ";
        $ca->prepareSelect($table, "a.usuario", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consulta_tree($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "empresa=:empresa ";
        $order = " ";
        if (isset($p["usuario"]) && $p["usuario"] != "0" && $p["usuario"] != "" && $p["usuario"] != 'undefined') {
            $where .= " and usuario='" . $p["usuario"] . "'";
        } else {
            $where .= " and usuario=:usuario ";
        }
        if (isset($p["compartido"]) && $p["compartido"] != "0" && $p["compartido"] != "" && $p["compartido"] != "undefined") {
            $where .= " and compartir='" . $p["compartido"] . "'";
        }
        if (isset($p["buscar"]) && $p["buscar"] != "0" && $p["buscar"] != "" && $p["buscar"] != "undefined") {
            $campos = "nombre";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["buscar"], true);
        }
        if (isset($p["carpeta"]) && $p["carpeta"] != "" && $p["carpeta"] != 0 && $p["carpeta"] != "undefined") {
            $where .= " and asociado=" . $p["carpeta"];
        } else {
            $where .= " and asociado is NULL";
        }
//        if (isset($p["compartido"]) && $p["compartido"] != "0" && $p["compartido"] != "") {
//            
//        }
        $order .= " order by id desc";
        $ca->prepareSelect("nw_drive_folders", "*", "$where " . $order);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery() . " Error: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function consulta_treeFiles($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "empresa=:empresa ";
        if (isset($p["usuario"]) && $p["usuario"] != "0") {
            $where .= " and usuario='" . $p["usuario"] . "' ";
        } else {
            $where .= " and usuario=:usuario ";
        }
        if (isset($p["compartido"]) && $p["compartido"] != "0" && $p["compartido"] != "") {
            $where .= " and compartir='" . $p["compartido"] . "' ";
        }
        if (isset($p["buscar"]) && $p["buscar"] != "0" && $p["buscar"] != "") {
            $campos = "nombre";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["buscar"], true);
        }
        if (isset($p["carpeta"]) && $p["carpeta"] != 0) {
            $where .= " and carpeta=" . $p["carpeta"];
        } else {
            $where .= " and carpeta is null";
        }
        $order = " order by nombre asc";
        $ca->prepareSelect("nw_drive_files", "*", $where . $order);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery() . " Error: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaPermisos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_drive_folders", "*", "id=:id and usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se consultaron los permisos $p " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaUsuariosPermisos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select 
            a.*,
            a.usuario_asociado as usuario,
            b.nombre as usuario_text
            from nw_drive_permisos a 
            left join usuarios b on (a.usuario_asociado=b.id) where a.asociado=:asociado";
        $ca->prepare($sql);
        $ca->bindValue(":asociado", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se consultaron los usuarios de permisos $p " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateFolders($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_drive", "*", "asociado=:asociado and usuario=:usuario");
        $ca->bindValue("_asociado", $p["asociado"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se consultaron las órdenes de servicio sin pagos registrados");
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $id = "";
        $asociado = "";
        $asociadoValue = "";
        if ($p["asociado"] == 0) {
            $asociado = "";
            $asociadoValue = "";
        } else {
            $asociado = "asociado,";
            $asociadoValue = $p["asociado"];
        }
        $fields = "id,nombre,usuario,fecha, $asociado privada,empresa, compartir";
        if ($p["id"] == "") {
            $id = master::getNextSequence("nw_drive_folders_id_seq");
            $ca->prepareInsert("nw_drive_folders", $fields);
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("nw_drive_folders", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":asociado", $asociadoValue);
        $ca->bindValue(":compartir", $p["compartir"]);
        $ca->bindValue(":privada", "SI");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando el registro: " . $ca->lastErrorText());
            return;
        }
        $db->commit();
        return true;
    }

    public static function saveFile($data) {
        $p = $data;
        if (isset($data["data"])) {
            $p = $data["data"];
        }
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $id = "";
        $asociado = "";
        $compartir = "";
        $compartirValue = "";
        $asociadoValue = "";
        if (isset($p["file"])) {
            if (count($p["file"]) > 0) {
                foreach ($p["file"] as $r) {
                    $archivo = $r["filename"];
                    $trozos = explode(".", $archivo);
                    $extension = end($trozos);
                    if (isset($p["asociado"]) && $p["asociado"] == 0) {
                        $asociado = "";
                        $asociadoValue = "";
                    } else {
                        $asociado = "carpeta,";
                        $asociadoValue = $p["asociado"];
                    }
                    if (isset($p["compartir"]) && $p["compartir"] == 0) {
                        $compartir = "";
                        $compartirValue = "";
                    } else {
                        $compartir = ",compartir";
                        $compartirValue = $p["compartir"];
                    }
                    $fields = "id,nombre,extension,ruta, $asociado fecha,peso,usuario,empresa $compartir";
                    if ($p["id"] == "") {
                        $id = master::getNextSequence("nw_drive_files_id_seq");
                        $ca->prepareInsert("nw_drive_files", $fields);
                    } else {
                        $id = $p["id"];
                        $ca->prepareUpdate("nw_drive_files", $fields, "id=:id");
                    }
//                    NWJSonRpcServer::information($p);
                    $ca->bindValue(":id", $id);
                    $ca->bindValue(":nombre", $r["filename"]);
                    $ca->bindValue(":extension", $extension);
                    $ca->bindValue(":ruta", $r["absolute_path"]);
                    $ca->bindValue(":carpeta", $asociadoValue);
                    $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
                    $ca->bindValue(":peso", $r["size"]);
                    $ca->bindValue(":compartir", $compartirValue);
                    $ca->bindValue(":usuario", $si["usuario"]);
                    $ca->bindValue(":empresa", $si["empresa"]);
                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error("Error procesando el registro: " . $ca->lastErrorText());
                        return;
                    }
                }
            }
        }
        $db->commit();
        return true;
    }

    public static function savePermisos($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $si = session::info();
        $id = $p["id"];
        $compartir = $p["compartir"];
        $compartir_value = $p["compartir"];
        if ($p["compartir"] == "CON_ALGUNOS") {
            $compartir = "SI";
        }
        if ($p["compartir"] == "SI") {
            $compartir_value = "CON_TODOS";
        }
        if ($p["compartir"] == "NO") {
            $compartir_value = "CON_NADIE";
        }
        $ca->prepareUpdate("nw_drive_folders", "compartir,compartir_value", "id=:id");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":compartir", $compartir);
        $ca->bindValue(":compartir_value", $compartir_value);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando el registro: " . $ca->lastErrorText());
            return;
        }
//        $ca->prepareUpdate("nw_drive_folders", "compartir", "asociado=:id");
//        $ca->bindValue(":id", $id);
//        $ca->bindValue(":compartir", $compartir);
//        if (!$ca->exec()) {
//            $db->rollback();
//            NWJSonRpcServer::error("Error procesando el registro: " . $ca->lastErrorText());
//            return;
//        }
        if (isset($p["usuarios"])) {
            if (count($p["usuarios"]) > 0) {
//                $ca->prepareDelete("nw_drive_permisos", "asociado=:id");
//                $ca->bindValue(":id", $id);
//                if (!$ca->exec()) {
//                    $db->rollback();
//                    NWJSonRpcServer::error($ca->lastErrorText());
//                    return;
//                }
                foreach ($p["usuarios"] as $r) {
                    $fieldsNav = "asociado,usuario_asociado,fecha, consultar,editar,crear,eliminar,usuario,empresa";
                    if ($r["id"] == "") {
                        $idNav = master::getNextSequence("nw_drive_permisos_id_seq");
                        $fieldsNav .= ",id";
                        $ca->prepareInsert("nw_drive_permisos", $fieldsNav);
                        $ca->bindValue(":id", $idNav);
                    } else {
//                        $idNav = $r["id"];
                        $ca->prepareUpdate("nw_drive_permisos", $fieldsNav, "id=:id");
                        $ca->bindValue(":id", $r["id"]);
                    }
                    $ca->bindValue(":asociado", $id);
                    $ca->bindValue(":usuario_asociado", $r["usuario"]);
                    $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
                    $ca->bindValue(":consultar", $r["consultar"]);
                    $ca->bindValue(":editar", $r["editar"]);
                    $ca->bindValue(":crear", $r["crear"]);
                    $ca->bindValue(":eliminar", $r["eliminar"]);
                    $ca->bindValue(":usuario", $si["usuario"]);
                    $ca->bindValue(":empresa", $si["empresa"]);
                    if (!$ca->exec()) {
                        $db->rollback();
                        NWJSonRpcServer::error("Error procesando el registro: " . $ca->lastErrorText());
                        return;
                    }
                }
            }
        }
//        if ($compartir == "SI") {
//            $ca->prepareUpdate("nw_drive_files", "compartir", "carpeta=:carpeta");
//            $ca->bindValue(":carpeta", $id);
//            $ca->bindValue(":compartir", "SI");
//            if (!$ca->exec()) {
//                $db->rollback();
//                NWJSonRpcServer::error("Error actualizando los archivos asociados. " . $ca->lastErrorText());
//            }
//        }
        $db->commit();
        return true;
    }

    public static function eliminarCarpet($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_drive_folders", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. " . $ca->lastErrorText());
        }
        return true;
    }

    public static function eliminarUsuarioCompartir($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_drive_permisos", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function saveMail($p) {
        session::check();
        $mail = new PHPMailer();
        master::trySendSmtp($mail);
        $si = session::info();
        $titulo = "Descarga de archivo NwDrive";
        $fecha = date("Y-m-d H:i:s");
        $user = $si["usuario"];
        $observaciones = $p["observacion"];
        //BODY CUERPO MENSAJE
        $body = "<div style='border: 1px solid #E6E6E6;background: #FFF;padding: 0em;'>";
        $body .= "<div style='background-color: #f9f9f9;color: #999;font: 20px arial,normal;padding: 15px;border-bottom: 1px solid #ccc;'>";
        $body .= "$titulo<br />";
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #ffffff;color: #666;'>";
        $body .= "<p>$observaciones</p>";
        $body .= "<br />";
        $body .= "<b>Creado por el usuario: $user </b> Fecha: $fecha <br />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de QXNW.<br />Powered by 
            <a style='text-decoration: none;' href='https://www.netwoods.net' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
        //REMITENTE
        $mail->SetFrom($p["correo"], $p["correo"]);
        //DESTINATARIOS
        $mail->AddAddress($p["correo"], "nombre");
        $mail->AddReplyTo($si["email"], $si["usuario"]);
        //CC OCULTA
        //$mail->AddBCC("ingenieria@netwoods.net");
        // $mail->AddBCC("alexf@netwoods.net");
        //TÍTULO MAIL
        $mail->Subject = $titulo;
        $mail->AltBody = "Mensaje reenviado de contacto nwsites";
        $mail->MsgHTML($body);
        if (!$mail->Send()) {
            NWJSonRpcServer::information("Error al enviar el correo:" . $mail->ErrorInfo);
        }
    }

    public static function eliminarArchivo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_drive_files", "id=:id");
        $ca->bindValue(":id", $p);

        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. " . $ca->lastErrorText());
        }
        return true;
    }

}
