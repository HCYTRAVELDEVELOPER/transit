<?php

class nw_notifications {

    public static function checkNotifications($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "PGSQL") {
            //$ca->prepareSelect("nw_notifications_det", "count(*) as total", "usuario::text=:usuario and leida=false and fecha_entrega is null");
            $sql = "select count(a.*) as total from nw_notifications_det a left join nw_notifications b on (a.notificacion=b.id) where empresa=:empresa and usuario::text=:usuario and leida=false and fecha_entrega is null ";
            $ca->prepare($sql);
        } else if ($db->getDriver() == "MYSQL") {
            $sql = "select "
                    . "count(*) as total "
                    . "from nw_notifications_det a "
                    . "left join nw_notifications b on (a.notificacion=b.id) "
                    . "where empresa=:empresa "
                    . "and CAST(usuario AS CHAR)=:usuario "
                    . "and leida=0 "
                    . "and fecha_entrega is null ";
            $ca->prepare($sql);
            //$ca->prepareSelect("nw_notifications_det", "count(*) as total", "CAST(usuario AS CHAR)=:usuario and leida=0 and fecha_entrega is null");
        } else if ($db->getDriver() == "ORACLE") {
            $sql = "select count(a.*) as total from nw_notifications_det a left join nw_notifications b on (a.notificacion=b.id) where empresa=:empresa and CAST( usuario AS VARCHAR2(100) )=:usuario and leida=0 and fecha_entrega is null ";
            $ca->prepare($sql);
            //$ca->prepareSelect("nw_notifications_det", "count(*) as total", "CAST( usuario AS VARCHAR2(100) )=:usuario and leida=0 and fecha_entrega is null");
        }
        //TODO: Removed and current_date < fecha::date + integer '7'
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            $r = $ca->assoc();
            if ($r["total"] > 1) {
                return $r;
            } else if ($r["total"] == 1) {
                if ($db->getDriver() == "MYSQL") {
                    $sql = "select 
                    a.*,
                    b.mensaje,
                    CONCAT(a.fecha, '. Sended by: ', b.enviado_por) as complement
                    from nw_notifications_det a 
                    left join nw_notifications b on (a.notificacion=b.id)
                    where b.empresa=:empresa and CAST(a.usuario as CHAR)=:usuario and leida=0 and fecha_entrega is null limit 1";
                } else if ($db->getDriver() == "ORACLE") {
                    $sql = "select 
                    a.*,
                    b.mensaje,
                    CONCAT(a.fecha, '. Sended by: ', b.enviado_por) as complement
                    from nw_notifications_det a 
                    left join nw_notifications b on (a.notificacion=b.id)
                    where b.empresa=:empresa and CAST(a.usuario as VARCHAR(100))=:usuario and leida=0 and fecha_entrega is null limit 1";
                } else if ($db->getDriver() == "PGSQL") {
                    $sql = "select 
                    a.*,
                    b.mensaje,
                    CONCAT(a.fecha, '. Sended by: ', b.enviado_por) as complement
                    from nw_notifications_det a 
                    left join nw_notifications b on (a.notificacion=b.id)
                    where b.empresa=:empresa and a.usuario::text=:usuario and leida=false and fecha_entrega is null limit 1";
                }
                $ca->prepare($sql);
                $ca->bindValue(":usuario", $si["usuario"], true);
                $ca->bindValue(":empresa", $si["empresa"]);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
                if ($ca->size() == 0) {
                    return false;
                }
                $ca->next();
                $ra = $ca->assoc();
                $ra["total"] = 1;
                $ra["mensaje"] = $ra["mensaje"];
                $ra["complement"] = $ra["complement"];
                //$ra["type"] = $ra["tipo"];
                return $ra;
            } else {
                return false;
            }
        }
    }

    public static function setReadedNotifications($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        $where = "usuario::text=:usuario and fecha_entrega is null";
        if ($driver == "PGSQL") {
            $where = "usuario::text=:usuario and fecha_entrega is null";
        } else if ($driver == "MYSQL") {
            $where = "CAST(usuario as char(50))=:usuario and fecha_entrega is null";
        } else if ($driver == "ORACLE") {
            $where = "CAST(usuario as varchar2(50))=:usuario and fecha_entrega is null";
        }
        $ca->prepareUpdate("nw_notifications_det", "leida", $where);
        if ($driver == "ORACLE" || $driver == "MYSQL") {
            $ca->bindValue(":leida", 1);
        } else {
            $ca->bindValue(":leida", "true");
        }
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getNotificationsByUser($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $added = " limit 10";
        if (isset($p["offset"])) {
            $added .= " offset " . $p["offset"];
        }
        if ($db->getDriver() == "MYSQL") {
            $sql = " select 
            a.*,
            b.mensaje as message,
            b.enviado_por as enviado_por
            from nw_notifications_det a
            left join nw_notifications b on (a.notificacion=b.id)
            where b.empresa=:empresa and CAST(usuario as CHAR)=:usuario and current_date < CAST(fecha as DATE) + integer '7' 
            order by fecha desc {$added} ";
        } else if ($db->getDriver() == "PGSQL") {
            $sql = " select 
            a.*,
            b.mensaje as message,
            b.enviado_por as enviado_por
            from nw_notifications_det a
            left join nw_notifications b on (a.notificacion=b.id)
            where b.empresa=:empresa and usuario::text=:usuario and current_date < fecha::date + integer '7' 
            order by fecha desc {$added} ";
        }
        $ca->prepare($sql);
        //TODO: DELETED and leida=true andresf 14_MAY_2014
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":empresa", $si["empresa"]);
        //NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getALotNotificationsByUser($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        $added = " limit 10";
        $limit = 10;
        $offset = 0;
        if (isset($p["limit"]) && $p["limit"] > 0 && $p["limit"] != "") {
            $added = " limit " . $p["limit"];
            $limit = $p["limit"];
        }
        if (isset($p["offset"])) {
            $added .= " offset " . $p["offset"];
            $offset = $p["offset"];
        }
        if ($driver == "MYSQL") {
            $sql = "select 
            a.*,
            b.mensaje as message,
            b.enviado_por as enviado_por
            from nw_notifications_det a
            left join nw_notifications b on (a.notificacion=b.id)
            where b.empresa=:empresa and CAST(usuario as CHAR)=:usuario and (fecha_entrega is null or fecha_entrega < current_date) order by a.fecha desc " . $added;
        } else if ($driver == "PGSQL") {
            $sql = "select 
            a.*,
            b.mensaje as message,
            b.enviado_por as enviado_por
            from nw_notifications_det a
            left join nw_notifications b on (a.notificacion=b.id) 
            where b.empresa=:empresa and usuario::text=:usuario and (fecha_entrega is null or fecha_entrega::date <= current_date) order by a.fecha desc " . $added;
        } else if ($driver == "ORACLE") {
            $sql = "
            SELECT * FROM (
                    SELECT rownum rnum, a.* 
                    FROM(
                        select 
                        a.*,
                        b.mensaje as message,
                        b.enviado_por as enviado_por
                        from nw_notifications_det a
                        left join nw_notifications b on (a.notificacion=b.id) 
                        where b.empresa=:empresa and CAST(usuario AS VARCHAR2(30))=:usuario and (fecha_entrega is null or CAST(fecha_entrega as DATE) <= current_date) order by a.fecha desc 
                    ) a 
                WHERE rownum <={$limit}
                )
            WHERE rnum >={$offset} ";
        }
        $ca->prepare($sql);
        //TODO: DELETED and leida=true andresf 14_MAY_2014
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":empresa", $si["empresa"]);
        //NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function sendAutoNotification($id, $data) {
        session::check();
        $r = Array();
        $r["id"] = $id;
        $r["data"] = $data;
        $noti = self::getAutoNotifications($r);
        if (isset($data["send"]) && $data["send"]) {
            $r["send"] = true;
        }
        self::saveNotifications($noti);
    }

    public static function getAutoNotifications($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_notifications_enc", "*,texto as message", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $r = $ca->flush(true);

        if (isset($p["data"])) {
            foreach ($p["data"] as $key => $value) {
                if ($r != false) {
                    $r["message"] = str_replace("{" . $key . "}", $value, $r["message"]);
                }
            }
        }

        if ($r == false) {
            return;
        }
        $ca->prepareSelect("nw_notifications_users", "*", "notificacion=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ra = $ca->assocAll();
        for ($i = 0; $i < count($ra); $i++) {
            $r["usersList"][] = Array("usuario" =>
                $ra[$i]["usuario"]);
        }
        return $r;
    }

    public static function saveNotifications($p, &$db = null, $isConsole = false) {
        session::check();
        $si = session::info();
        $haveDb = false;
        if (isset($db) && $db != null) {
            $haveDb = true;
        }
        if (!$haveDb) {
            $db = NWDatabase::database();
            $db->transaction();
        }
        $subject = "";

        if (isset($p["subject"])) {
            $subject = $p["subject"];
        }

        $attach = "";

        if (isset($p["attach"])) {
            $attach = $p["attach"];
        }

        if (isset($p["observations"])) {
            if ($p["observations"] != null) {
                if ($p["observations"] != '') {
                    $p["message"] = $p["message"] . "| Observaciones: " . $p["observations"];
                }
            }
        }

        $fecha_envio = date("Y-m-d H:i:s");

        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
//        $id = master::getNextSequence("nw_notifications_id_seq", $db);
        $id = master::getSequence("nw_notifications", "id");

        if (!isset($p["parte"])) {
            $p["parte"] = "UNKNOWN";
        }

        $ca->prepareInsert("nw_notifications", "id,parte,mensaje,enviado_por,fecha,empresa");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":parte", $p["parte"]);
        $ca->bindValue(":mensaje", $p["message"]);
        if ($isConsole) {
            $ca->bindValue(":enviado_por", 'boot');
        } else {
            $ca->bindValue(":enviado_por", $si["usuario"]);
        }
        $ca->bindValue(":fecha", $fecha_envio);
        if ($isConsole) {
            $ca->bindValue(":empresa", 1);
        } else {
            $ca->bindValue(":empresa", $si["empresa"]);
        }
        if (!$ca->exec()) {
            $db->rollback();
            if ($isConsole) {
                error_log($ca->lastErrorText());
            } else {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }

        if (!isset($p["usersList"])) {
            //$db->rollback();
            //NWJSonRpcServer::information("Por favor seleccione los usuarios para enviar la notificación");
            //return false;
            $p["usersList"] = Array();
        }
        $added_date = "";
        if (isset($p["fecha_entrega"]) && $p["fecha_entrega"] != "") {
            $added_date = ",fecha_entrega";
        }
        if (count($p["usersList"]) > 0) {
            for ($i = 0; $i < count($p["usersList"]); $i++) {
                $ra = $p["usersList"][$i];
                $ca->prepareInsert("nw_notifications_det", "notificacion,usuario,fecha,leida" . $added_date);
                $ca->bindValue(":notificacion", $id);
                $ca->bindValue(":usuario", $ra["usuario"]);
                $ca->bindValue(":fecha", $fecha_envio);
                if ($db->getDriver() == "MYSQL") {
                    $ca->bindValue(":leida", 0);
                } else {
                    $ca->bindValue(":leida", "false");
                }
                if (isset($p["fecha_entrega"]) && $p["fecha_entrega"] != "") {
                    $ca->bindValue(":fecha_entrega", $p["fecha_entrega"]);
                }
                if (!$ca->exec()) {
                    $db->rollback();
                    if ($isConsole) {
                        error_log($ca->lastErrorText());
                    } else {
                        NWJSonRpcServer::error($ca->lastErrorText());
                    }
                    return false;
                }
                if (isset($p["tittle"]) && $p["tittle"] != "") {
                    $tittle = $p["tittle"];
                } else {
                    $tittle = "";
                }
                if (isset($p["send"])) {
                    if ($p["send"] != false) {
                        if ($p["send"] != '') {
                            if ($p["send"] == true || $p["send"] == "t" && $added_date == "") {
                                $reply = true;
                                if (isset($p["reply_to_nw"])) {
                                    $reply = $p["reply_to_nw"];
                                }
                                self::sendEmailNotification($db, $p["message"], $ra["usuario"], $subject, $attach, $tittle, $reply, $isConsole);
                            }
                        }
                    }
                }
            }
        }
        if (!$haveDb) {
            $db->commit();
        }
        return true;
    }

    public static function sendEmailNotification(&$db, $text, $user, $subject, $attach, $tittle, $reply = true, $isConsole = false, $email = "null", $nombre = "") {
        session::check();
        if (!$db) {
            $db = NWDatabase::database();
        }
        $mail = new PHPMailer();
        master::trySendSmtp($mail);
        if (!$isConsole) {
            if ($reply == true) {
                $mail->AddReplyTo("info@gruponw.com", $_SESSION["nombre"]);
                $mail->SetFrom("info@gruponw.com", $_SESSION["nombre"]);
            }
        }
        $body = "<div style='padding: 10px;max-width: 600px;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 13px 20px;'>";
        if (!isset($tittle) || $tittle == null || $tittle == "") {
            if ($isConsole) {
                $body .= "Información enviada por: Grupo NW <br />";
            } else {
                $body .= "Información enviada por: " . $_SESSION["nombre"] . " <br />";
            }
        } else {
            $body .= $tittle;
        }
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $body .= "<b>Notificación: </b><br />" . $text . "<br />";
        $body .= "</div>";
        $body .= "<br />";
        $body .= "<b>Link para ingresar al aplicativo: <a href='http://" . $_SERVER["HTTP_HOST"] . "'>" . $_SERVER["HTTP_HOST"] . "</a></b><br />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='http://www.netwoods.net' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
        $ca = new NWDbQuery($db);

        if ($email == "null") {
            $ca->prepareSelect("usuarios", "nombre,email", "usuario::text=:usuario");
            $ca->bindValue(":usuario", $user, true);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
                $db->rollback();
                NWJSonRpcServer::information("El usuario {$user} no tiene correos asociados. Comuníquese con el administrador.");
                return false;
            }
            $r = $ca->flush();
            $mail->AddAddress($r["email"], $r["nombre"]);
        } else {
//            $mail->AddAddress($email, $nombre);
        }
        if (isset($subject) && $subject != "") {
            $mail->Subject = $subject;
        } else {
            $mail->Subject = "Envío de datos NW";
        }
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.netwoods.net";
        $mail->MsgHTML($body);

        if (isset($attach) && $attach != "") {
            $mail->AddAttachment($attach);
        }
        if (!$mail->Send()) {
            NWJSonRpcServer::information("Tuvimos un problema al enviar la información al usuario {$user}. Por favor comuníquese con el administrador. Error: " . $mail->ErrorInfo);
        }
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_notifications_enc", "*");
        return $ca->execPage($p);
    }

    public static function getUsersByNotification($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select b.id,
                a.nombre,
                b.email,
                b.usuario,
                case
                    when a.email is not null then true
                    else false
                end as value
                from nw_notifications_users a
                left join usuarios b on (a.id_usuario=b.id)
                where b.empresa=:empresa and a.notificacion=:notification
                order by a.nombre";
        $ca->prepare($sql);
        $ca->bindValue(":notification", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getUsersNotifications($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = " select 
                a.email,
                a.id,
                a.nombre,
                a.usuario,
                case
                    when b.email is not null then true
                else false
                end as value
            from usuarios a
                left join nw_notifications_users b on (a.id = b.id_usuario)
            order by a.nombre";
        $d = Array();
        $d["table"] = "usuarios";
        $d["field"] = "apellido";
        if (master::fieldExists($d, $db)) {
            $sql = " select 
                a.email,
                a.id,
                CONCAT(a.nombre, ' ', a.apellido) as nombre,
                a.usuario,
                case
                    when b.email is not null then true
                else false
                end as value
            from usuarios a
                left join nw_notifications_users b on (a.id = b.id_usuario)
            order by a.nombre";
        }
//where a.usuario in (select usuario from usuarios_empresas where usuario=a.usuario) 
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function save($p) {
//        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
//        $si = session::info();
        $usuario = nwMaker::getDataSESSION($p, "usuario");
        $empresa = nwMaker::getDataSESSION($p, "empresa");
//        error_log("Holaaaaa");
        $fields = "texto,adjunto,prioridad,usuario,fecha,accion,empresa,enviar_por_correo,tipo";
        $id = $p["id"];
        if ($id == "") {
//            $id = NWDbQuery::getNextId($ca, "nw_notifications_enc");
            $id = master::getNextSequence("nw_notifications_enc_id_seq", $db);
            $ca->prepareInsert("nw_notifications_enc", "id," . $fields);
        } else {
            $ca->prepareUpdate("nw_notifications_enc", $fields, "id=:id");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":texto", $p["body"]["texto"]);
        $ca->bindValue(":adjunto", $p["adjunto"]);
        $ca->bindValue(":prioridad", $p["prioridad"]);
        $ca->bindValue(":accion", $p["accion"]);
        $ca->bindValue(":enviar_por_correo", $p ["enviar_por_correo"], false);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":fecha_final", $p["fecha_final"]);
        $ca->bindValue(":tipo", $p["tipo"]);
//        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":usuario", $usuario);
//        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $ca->prepareDelete("nw_notifications_users", "notificacion=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if (isset($p["users"]) && isset($p["users"]["users"]) && count($p["users"]["users"]) > 0) {
            $fields = "nombre,email,notificacion,id_usuario,usuario ";
            for ($i = 0; $i < count($p["users"]["users"]); $i++) {
                $r = $p["users"]["users"][$i];
                $ca->prepareInsert("nw_notifications_users", $fields);
                $ca->bindValue(":nombre", $r["nombre"]);
                $ca->bindValue(":email", $r["email"]);
                $ca->bindValue(":usuario", $r["usuario"]);
                $ca->bindValue(":id_usuario", $r["id"]);
                $ca->bindValue(":notificacion", $id);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
        }
        $db->commit();
    }

    public static function delete($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $db->transaction();
        $ca->prepareDelete("nw_notifications_enc", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareDelete("nw_notifications_users", "notificacion=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
    }
}
