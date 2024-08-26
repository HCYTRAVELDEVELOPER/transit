<?php

session_start();
/*
  //$appPath = "/var/www/app_movilmove/html/";
  $empresa = false;
  if (isset($_SERVER['argv'][1])) {
  $server_paht = $_SERVER['argv'][1];
  if ($server_paht == "PATH=/var/www/app_movilmove/html/lib_mobile/") {
  $appPath = "/var/www/app_movilmove/html/";
  $_SERVER['HTTP_HOST'] = "admin.movilmove.com";
  $empresa = 1;
  } else if ($server_paht == "PATH=/var/www/test_movilmove/html/") {
  $appPath = "/var/www/test_movilmove/html/";
  $_SERVER['HTTP_HOST'] = "test.movilmove.com";
  $empresa = 1;
  } else if ($server_paht == "PATH=/var/www/test_movilmovelimocars/html/") {
  $appPath = "/var/www/test_movilmovelimocars/html/";
  $_SERVER['HTTP_HOST'] = "limocars.gruponw.com";
  $empresa = 22;
  } else if ($server_paht == "PATH=/var/www/limocars_movilmove/html/") {
  $appPath = "/var/www/limocars_movilmove/html/";
  $_SERVER['HTTP_HOST'] = "limocars.movilmove.com";
  $empresa = 22;
  } else if ($server_paht == "PATH=/var/www/destinosexpress_movilmove/html/") {
  $appPath = "/var/www/destinosexpress_movilmove/html/";
  $_SERVER['HTTP_HOST'] = "destinosexpress.movilmove.com";
  $empresa = 21;
  } else if ($server_paht == "PATH=/var/www/test_movilmovede/html/") {
  $appPath = "/var/www/test_movilmovede/html/";
  $_SERVER['HTTP_HOST'] = "destinosexpress.gruponw.com";
  $empresa = 21;
  } else if ($server_paht == "PATH=/var/www/andinapp_movilmove/html/") {
  $appPath = "/var/www/andinapp_movilmove/html/";
  $empresa = 14;
  $_SERVER['HTTP_HOST'] = "andinapp.movilmove.com";
  } else if ($server_paht == "PATH=/var/www/test_movilmoveandinapp/html/") {
  $appPath = "/var/www/test_movilmoveandinapp/html/";
  //        $appPath = "/var/www/movilmove/branches/movilmove/";
  $empresa = 14;
  $_SERVER['HTTP_HOST'] = "andinapp.gruponw.com";
  } else if ($server_paht == "PATH=/var/www/test_movilmovecarryexpress/html/") {
  $appPath = "/var/www/test_movilmovecarryexpress/html/";
  $_SERVER['HTTP_HOST'] = "carryexpress.gruponw.com";
  $empresa = 7;
  } else if ($server_paht == "PATH=/var/www/carryexpress_movilmove/html/") {
  $appPath = "/var/www/carryexpress_movilmove/html/";
  $_SERVER['HTTP_HOST'] = "carryexpress.movilmove.com";
  $empresa = 7;
  } else {
  $appPath = "/var/www/app_movilmove/html/";
  $_SERVER['HTTP_HOST'] = "app.netcarcompany.com";
  $empresa = 8;
  }
  } else {
  return;
  }

  $usedOutNwlib = true;
  require_once $appPath . "rpcsrv/server.php";
 */
$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
$appPath = "";
if (isset($_SERVER['HTTP_HOST'])) {
    $appPath = $_SERVER['DOCUMENT_ROOT'] . "/";
} else
if (!isset($argv[1])) {
    $appPath = "/var/www/movilmove/trunk/";
} else {
    $appPath = $argv[1];
}

$usedOutNwlib = true;
require_once $appPath . "rpcsrv/server.php";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cc = new NWDbQuery($db);

$empresa = 24;

//para actualizar
if (isset($empresa) && $empresa != false) {
    $ca->prepareSelect("edo_configuraciones", "repetir_servicio_continiuamente,minutos_para_cerrar_servicio", "empresa=:empresa");
    $ca->bindValue(":empresa", $empresa);
    if (!$ca->exec()) {
        nwMaker::error($ca->lastErrorText(), true);
        return false;
    }
    if ($ca->size() > 0) {
        $config = $ca->flush();
        if (isset($config["repetir_servicio_continiuamente"])) {
            if ($config["repetir_servicio_continiuamente"] == "SI" && $config["minutos_para_cerrar_servicio"] != null && $config["minutos_para_cerrar_servicio"] != "") {
                $fecha = nwMaker::sumaRestaFechas("+0 hour", "-" . $config["minutos_para_cerrar_servicio"] . " minute", "+0 second");
                $ca->prepareUpdate("edo_servicios", "estado", "empresa=:empresa and estado=:estado_actualizar and tipo_servicio='ahora' and CONCAT(fecha, ' ', hora) < :fecha");
//            $ca->prepareSelect("edo_servicios", "id,estado", "empresa=:empresa and estado=:estado and tipo_servicio='ahora'");
                $ca->bindValue(":empresa", $empresa);
                $ca->bindValue(":fecha", $fecha);
                $ca->bindValue(":estado_actualizar", "SOLICITUD");
                $ca->bindValue(":estado", "CIERRE AUTOMATICO");
//            print_r($ca->preparedQuery());
//            return;
                if (!$ca->exec()) {
                    $error = $ca->lastErrorText();
                    print_r($error);
                    error_log($error);
//                return false;
                }
            }
        }
    }
}

$horas_add = "2";
$minutos_add = "30";
$hoy = date("Y-m-d H:i:s");
// $p["fecha_final"] = nwMaker::sumaRestaFechasByFecha("+5 hour", "+0 minute", "+0 second", $p["fecha_final"]);
$date = nwMaker::sumaRestaFechas("+{$horas_add} hour", "+{$minutos_add} minute", "+0 second");
$date_fecha = explode(" ", $date)[0];
$date_hour = explode(" ", $date)[1];
$where = "tipo_servicio='reservado' and fecha_envio_recordatorio IS NULL and empresa=1 and token_conductor IS NOT NULL and estado='ACEPTADO_RESERVA' ";
//$where .= " and CONCAT(fecha, ' ', hora)>=:hoy ";
$where .= " and fecha>=:hoy_fecha ";
$where .= " and :date_hour>hora ";
$where .= "order by hora asc";
$ca->prepareSelect("edo_servicios", "cliente_nombre,conductor,token_conductor,token_usuario,fecha,hora,id,CONCAT(fecha, ' ', hora) as fecha_cita", $where);
$ca->bindValue(":hoy", $date);
$ca->bindValue(":hoy_fecha", $date_fecha);
$ca->bindValue(":date_hour", $date_hour);
if (!$ca->exec()) {
    nwMaker::error($ca->lastErrorText(), true);
    return false;
}
echo "<br />" . $date . " Hour: {$date_hour}<br />";

$t = $ca->size();
error_log("Total enviados: {$t}.");
if (isset($_SERVER['HTTP_HOST'])) {
    echo "Total enviados: {$t}.";
}
if ($t > 0) {
    $r = $ca->assocAll();
    $ids = "";
    for ($i = 0; $i < $t; $i++) {
        $ra = $r[$i];

        echo "<br />{$ra["id"]} {$ra["fecha_cita"]} {$ra["fecha"]} {$ra["hora"]}";

        $title = "Recordatorio de servicio";
        $body = "En {$horas_add} horas y {$minutos_add} minutos tienes un servicio, revisa tu agenda";

        $a = Array();
        $a["title"] = $title;
        $a["body"] = $body;
        $a["token"] = $ra["token_conductor"];
        nwMaker::sendNotificacionPush($a);

        $a = Array();
        $a["title"] = $title;
        $a["body"] = $body;
        $a["token"] = $ra["token_usuario"];
        nwMaker::sendNotificacionPush($a);

        $ca->prepareUpdate("edo_servicios", "fecha_envio_recordatorio", "id=:id");
        $ca->bindValue(":fecha_envio_recordatorio", $hoy);
        $ca->bindValue(":id", $ra["id"]);
        if (!$ca->exec()) {
            $error = $ca->lastErrorText();
            print_r($error);
            error_log($error);
            return false;
        }
    }
    $db->commit();
}

$hoy = date("Y-m-d H:i:s");
$where = " leido='NO' and send_email='SI' ";
$where .= " and (notificado is null or (fecha_final is not null and fecha_final<:hoy)) ";
$where .= " and fecha_aviso_recordat<:hoy ";
$where .= " and tipo='enviarInCron' ";
$ca->prepareSelect("nwmaker_notificaciones", "id,title,mensaje,usuario_recibe,correo_usuario_recibe,vencida_title,vencida_body,fecha_final,notificado,fecha_aviso_recordat,icon,email_is_sent,fromName,fromEmail,id_objetivo,body_email,terminal,send_sms,celular,sms_body", $where);
$ca->bindValue(":hoy", $hoy);
if (!$ca->exec()) {
    $error = $ca->lastErrorText();
    print_r($error);
    error_log($error);
    return false;
}
$t = $ca->size();
error_log("Total enviados: {$t}.");
if (isset($_SERVER['HTTP_HOST'])) {
    echo "Total enviados: {$t}.";
}
if ($t > 0) {
    $r = $ca->assocAll();
    $ids = "";
    for ($i = 0; $i < $t; $i++) {
        $ra = $r[$i];
        $correo = $ra["correo_usuario_recibe"];
        $usuario = $ra["usuario_recibe"];
        $fromName = "";
        $fromEmail = "";
        if ($ra["fromName"] !== null && $ra["fromName"] !== false && $ra["fromName"] !== "") {
            $fromName = $ra["fromName"];
        }
        if ($ra["fromEmail"] !== null && $ra["fromEmail"] !== false && $ra["fromEmail"] !== "") {
            $fromEmail = $ra["fromEmail"];
        }
        if ($ra["correo_usuario_recibe"] !== null && $ra["notificado"] === null && $ra["email_is_sent"] === null) {
            $xa = false;
            $textBody = $ra["mensaje"];
            if ($ra["body_email"] !== null && $ra["body_email"] !== false && $ra["body_email"] !== "") {
                $textBody = $ra["body_email"];
            }
            $asunto = $ra["title"];
            $titleEnc = $ra["mensaje"];
            $cliente_nws = false;
            $cleanHtml = true;
            $send = nw_configuraciones::sendEmail($correo, $usuario, $asunto, $titleEnc, $textBody, $cliente_nws, $xa, $cleanHtml, $fromName, $fromEmail);
            if (!$send) {
                $error = $send;
                print_r($error);
                error_log($error);
                continue;
            }

//            if ($ra["send_sms"] === "1" || $ra["send_sms"] === "SI" || $ra["send_sms"] === true || $ra["send_sms"] === "t") {
//                $sm = Array();
//                $sm["cel"] = $ra["celular"];
//                $sm["text"] = $ra["sms_body"];
//                $sm["from"] = "GRUPONW";
//                $sm["user"] = "GRUPONW";
//                $sm["pass"] = "Nw729272";
//                $sm["url"] = "http://sms.colombiagroup.com.co/Api/rest/message";
//                master::sendSMSByCBG($sm);
//            }

            $cb->prepareUpdate("nwmaker_notificaciones", "notificado,email_is_sent,date_email_is_sent", "id=:id");
            $cb->bindValue(":id", $ra["id"]);
            $cb->bindValue(":notificado", "SI");
            $cb->bindValue(":email_is_sent", "SI");
            $cb->bindValue(":date_email_is_sent", $hoy);
            if (!$cb->exec()) {
                nwMaker::error($cb->lastErrorText(), true);
                continue;
            }
        }
    }
    $db->commit();
}


error_log("Cron.php MOVILMOVE execute ok!");
