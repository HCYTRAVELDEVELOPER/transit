<?php

/* * ***********************************************************************

  Copyright:
  2015 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

$appPath = "";

if (!isset($argv[1])) {
    error_log("No se pasó como parámetro la carpeta del aplicativo");
    echo "No se pasó como parámetro la carpeta del aplicativo";
    return;
}

$appPath = explode("=", $argv[1]);
$appPath = $appPath[1];

require_once dirname(__FILE__) . '/../../' . $appPath . '/rpcsrv/_mod.inc.php';

class cron_notifications {

    public static function consulta() {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $sql = "select
            a.id,
            a.usuario,
            b.mensaje as message,
            b.enviado_por as enviado_por
            from nw_notifications_det a
            left join nw_notifications b on (a.notificacion=b.id)
            where 
            a.leida is false 
            and a.fecha_entrega is not null 
            and current_timestamp between a.fecha_entrega - interval '2 minutes' and a.fecha_entrega + interval '2 minutes' 
            order by fecha_entrega desc ";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            for ($i = 0; $i < $ca->size(); $i++) {
                $ca->next();
                $r = $ca->assoc();
                $p = Array();
                $p["usersList"][] = Array("usuario" => $r["usuario"]);
                $p["send"] = true;
                $p["message"] = $r["message"] . ". Enviado por: " . $r["enviado_por"];
                self::saveNotifications($p, $db);
                $cb->prepareUpdate("nw_notifications_det", "leida", "id=:id");
                $cb->bindValue(":id", $r["id"]);
                $cb->bindValue(":leida", "true");
                if (!$cb->exec()) {
                    $db->rollback();
                    master::logSystemError($cb->lastErrorText());
                }
            }
        }
        $db->commit();
        echo "Notificación enviada exitosamente";
        return true;
    }

    public static function getUsersByNotification($p) {
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
                where a.notificacion=:notification
                order by a.nombre";
        $ca->prepare($sql);
        $ca->bindValue(":notification", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function saveNotifications($p, &$db = null) {
        $haveDb = false;
        if (isset($db) && $db != null) {
            $haveDb = true;
        }
        if (!$haveDb) {
            $db = NWDatabase::database();
            $db->transaction();
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
        $id = master::getSequence("nw_notifications", "id");
        if (!isset($p["parte"])) {
            $p["parte"] = "UNKNOWN";
        }
        $ca->prepareInsert("nw_notifications", "id,parte,mensaje,enviado_por,fecha,empresa");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":parte", $p["parte"]);
        $ca->bindValue(":mensaje", $p["message"]);
        $ca->bindValue(":enviado_por", "NW Robot");
        $ca->bindValue(":fecha", $fecha_envio);
        $ca->bindValue(":empresa", 1);
        if (!$ca->exec()) {
            $db->rollback();
            master::logSystemError($ca->lastErrorText());
        }

        if (!isset($p["usersList"])) {
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
                $ca->bindValue(":leida", "false");
                if (isset($p["fecha_entrega"]) && $p["fecha_entrega"] != "") {
                    $ca->bindValue(":fecha_entrega", $p["fecha_entrega"]);
                }
                if (!$ca->exec()) {
                    $db->rollback();
                    master::logSystemError($ca->lastErrorText());
                    return false;
                }
                if (isset($p["send"])) {
                    if ($p["send"] != false) {
                        if ($p["send"] != '') {
                            if ($p["send"] == true || $p["send"] == "t" && $added_date == "") {
                                self::sendEmailNotification($db, $p["message"], $ra["usuario"]);
                            }
                        }
                    }
                }
            }
        }
        $db->commit();
        return true;
    }

    public static function sendEmailNotification(&$db, $text, $user) {
        $mail = new PHPMailer();
        master::trySendSmtp($mail);
        $mail->AddReplyTo("info@gruponw.com", "NW Robot");
        $mail->SetFrom("info@gruponw.com", "NW Robot");
        $body = "<div style='padding: 20px;max-width: 600px;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
        $body .= "Información enviada por el Robot NW<br /><br />";
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $body .= "<b>Notificación: </b><br />" . $text . "<br />";
        $body .= "</div>";
        $body .= "<br />";
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
        $ca->prepareSelect("usuarios", "nombre,email", "usuario::text=:usuario");
        $ca->bindValue(":usuario", $user, true);
        if (!$ca->exec()) {
            $db->rollback();
            master::logSystemError($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $db->rollback();
            master::logSystemError("El usuario {$user} no tiene correos asociados. Comuníquese con el administrador.");
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        $mail->AddAddress($r["email"], $r["nombre"]);

        $mail->Subject = "Envío de datos NW";
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.netwoods.net";
        $mail->MsgHTML($body);

        if (!$mail->Send()) {
            master::logSystemError("Tuvimos un problema al enviar la información al usuario {$user}. Por favor comuníquese con el administrador. ");
        }
    }

}

cron_notifications::consulta();
?>