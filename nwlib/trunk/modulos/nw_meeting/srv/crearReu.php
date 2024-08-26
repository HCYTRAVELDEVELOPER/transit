<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function insertPlace($place) {
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $id = master::getNextSequence("nwreu_lugares_id_seq");
    $ca->prepareInsert("nwreu_lugares", "id,nombre,usuario,empresa,terminal,usuario_id_enc");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":nombre", $place);
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    $ca->bindValue(":terminal", $si["terminal"]);
    $ca->bindValue(":usuario_id_enc", $si["id"]);
    if (!$ca->exec()) {
        echo "No se pudo insertar el contacto";
        return;
    }
}

function insertContact($name, $email) {
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $id = master::getNextSequence("nwreu_contactos_id_seq");
    $ca->prepareInsert("nwreu_contactos", "id,nombre,email,usuario,empresa,terminal,usuario_id_enc");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":nombre", $name);
    $ca->bindValue(":email", $email);
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    $ca->bindValue(":terminal", $si["terminal"]);
    $ca->bindValue(":usuario_id_enc", $si["id"]);
    if (!$ca->exec()) {
        echo "No se pudo insertar el contacto";
        return;
    }
}

function creaNotificacion($user, $id) {
    $si = session::getInfo();
    $p = $_POST;
    $db = NWDatabase::database();
    $ch = new NWDbQuery($db);
    $ci = new NWDbQuery($db);
    $cj = new NWDbQuery($db);
    $ch->setCleanHtml(false);
    $ci->setCleanHtml(false);
    $db->transaction();
    $apellido = "";
    if (isset($si["apellido"]) && $si["apellido"] != "") {
        $apellido = $si["apellido"];
    }
    $asunto = "<p class='invitUserEnc'>" . $si["nombre"] . " " . $apellido . " te a invitado a una reunión.</p><p><strong>Asunto: </strong>" . $p["titulo"] . "</p><p><strong>Lugar: </strong>" . $p["lugar"] . "</p><div class='buttonsDivInvit'><div class='btInv btAcceptInv' data='" . $id . "'>Aceptar</div><div class='btInv btVerInv' data='" . $id . "'>Más Info</div></div>";
    $id_new_notify = master::getNextSequence("nw_notifications_id_seq");
    $ch->prepareInsert("nw_notifications", "id, parte, mensaje, enviado_por, fecha, empresa");
    $ch->bindValue(":id", $id_new_notify);
    $ch->bindValue(":parte", "NW_MEETING");
    $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ch->bindValue(":enviado_por", $si["usuario"]);
    $ch->bindValue(":empresa", $si["empresa"]);
    $ch->bindValue(":mensaje", $asunto);
    if (!$ch->exec()) {
        echo "errores line 36. " . $ch->lastErrorText();
        $db->rollback();
        return;
    }
    $ci->prepareInsert("nw_notifications_det", "notificacion, leida, usuario, fecha");
    $ci->bindValue(":notificacion", $id_new_notify);
    $ci->bindValue(":leida", "false");
    $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ci->bindValue(":usuario", $user);
    if (!$ci->exec()) {
        echo "errores line 42. " . $ci->lastErrorText();
        $db->rollback();
        return;
    }
    $db->commit();
}

session::check();
$si = session::getInfo();
$p = $_POST;
$fecha = date("Y-m-d H:i:s");
if ($p["fecha"] < date("Y-m-d")) {
    echo "La fecha no puede ser menor a hoy";
    return;
}
$lugar = 0;
$lugar_text = $p["lugar"];
$db = NWDatabase::database();
$db->transaction();
$cf = new NWDbQuery($db);
$cf->prepareSelect("nwreu_lugares", "id", "usuario_id_enc=:usuario_id_enc and nombre=:lugar");
$cf->bindValue(":usuario_id_enc", $si["id"]);
$cf->bindValue(":lugar", $lugar_text);
if (!$cf->exec()) {
    echo "error. " . $cf->lastErrorText();
    $db->rollback();
    return;
}
if ($cf->size() == 0) {
    insertPlace($lugar_text);
} else {
    $cf->next();
    $lu = $cf->assoc();
    $lugar = $lu["id"];
}

$ca = new NWDbQuery($db);
$id = master::getNextSequence("nwreu_enc_id_seq");
$ca->prepareInsert("nwreu_enc", "id, titulo, objetivo_general, lugar, lugar_text, fecha, fecha_creacion, tema_principal, 
                                                       estado, estado_text, usuario, empresa, terminal, tiempo_previsto, hora");
$ca->bindValue(":id", $id);
$ca->bindValue(":titulo", $p["titulo"]);
$ca->bindValue(":objetivo_general", $p["objetivo_principal"]);
$ca->bindValue(":lugar", $lugar);
$ca->bindValue(":lugar_text", $lugar_text);
$ca->bindValue(":fecha", $p["fecha"]);
$ca->bindValue(":hora", $p["hora"]);
$ca->bindValue(":fecha_creacion", $fecha);
$ca->bindValue(":tema_principal", $p["objetivo_principal"]);
$ca->bindValue(":estado", 1);
$ca->bindValue(":estado_text", "Pendiente");
$ca->bindValue(":usuario", $si["usuario"]);
$ca->bindValue(":empresa", $si["empresa"]);
$ca->bindValue(":terminal", $si["terminal"]);
$ca->bindValue(":tiempo_previsto", $p["tiempo_previsto"]);
if (!$ca->exec()) {
    echo "Error: " . $ca->lastErrorText();
    $db->rollback();
    return;
}
$id_aa = master::getNextSequence("nwreu_asistentes_id_seq");
$ccc = new NWDbQuery($db);
$ccc->prepareInsert("nwreu_asistentes", "id, asistente, reunion, usuario, empresa, terminal, estado, asistente_text, asistente_mail, estado_text, fecha");
$ccc->bindValue(":id", $id_aa);
$ccc->bindValue(":asistente", $si["id"]);
$ccc->bindValue(":asistente_text", $si["nombre"]);
$ccc->bindValue(":asistente_mail", $si["email"]);
$ccc->bindValue(":reunion", $id);
$ccc->bindValue(":usuario", $si["usuario"]);
$ccc->bindValue(":empresa", $si["empresa"]);
$ccc->bindValue(":terminal", $si["terminal"]);
$ccc->bindValue(":estado", 1);
$ccc->bindValue(":estado_text", "Invitado");
$ccc->bindValue(":fecha", $fecha);
if (!$ccc->exec()) {
    echo "Error: " . $ccc->lastErrorText();
    $db->rollback();
    return;
}
//$users_asigna = explode(",", $_POST["asistentes"]);
$users_asigna = explode(",", $_POST["asistentes_todos"]);
$total = count($users_asigna);
for ($i = 0; $i < $total; $i++) {
    $cc = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $cb_u = new NWDbQuery($db);
    $asistente = "";
    $asistente_usuario = "";
    $ass = explode("|", $users_asigna[$i]);
    $asistente_email = $ass[0];
    $asistente_text = $ass[1];
    $cb_u->prepareSelect("nwreu_contactos", "id", "email=:email and usuario_id_enc=:usuario_id_enc");
    $cb_u->bindValue(":email", $asistente_email);
    $cb_u->bindValue(":usuario_id_enc", $si["id"]);
    if (!$cb_u->exec()) {
        echo "Error. " . $cb_u->lastErrorText();
        $db->rollback();
        return;
    }
    if ($cb_u->size() == 0) {
        insertContact($asistente_text, $asistente_email);
    }
//    else {
//        $cb_u->next();
//        $r = $cb_u->assoc();
//        $asistente = $r["id"];
//        $asistente_usuario = $r["usuario"];
//        $err = 0;
//    }
    $cb->prepareSelect("usuarios", "id, nombre, usuario", "email=:email");
    $cb->bindValue(":email", $asistente_email);
    if (!$cb->exec()) {
        echo "Error. " . $cb->lastErrorText();
        $db->rollback();
        return;
    }
    if ($cb->size() == 0) {
        $asistente = 0;
        $err = 1;
    } else {
        $cb->next();
        $r = $cb->assoc();
        $asistente = $r["id"];
        $asistente_usuario = $r["usuario"];
        $err = 0;
    }
    $id_a = master::getNextSequence("nwreu_asistentes_id_seq");
    $cc->prepareInsert("nwreu_asistentes", "id, asistente, reunion, usuario, empresa, terminal, estado, asistente_text, asistente_mail, estado_text, fecha");
    $cc->bindValue(":id", $id_a);
    $cc->bindValue(":asistente", $asistente);
    $cc->bindValue(":asistente_text", $asistente_text);
    $cc->bindValue(":asistente_mail", $asistente_email);
    $cc->bindValue(":reunion", $id);
    $cc->bindValue(":usuario", $si["usuario"]);
    $cc->bindValue(":empresa", $si["empresa"]);
    $cc->bindValue(":terminal", $si["terminal"]);
    $cc->bindValue(":estado", 1);
    $cc->bindValue(":estado_text", "Invitado");
    $cc->bindValue(":fecha", $fecha);
    if (!$cc->exec()) {
        echo "Error: " . $cc->lastErrorText();
        $db->rollback();
        return;
    }
    if ($err == 0) {
        creaNotificacion($asistente_usuario, $id);
    }

    $mail = new PHPMailer();
    master::trySendSmtp($mail);
    $body = "<div style='padding: 20px;max-width: 600px;background: #e5e5e5;'>";
    $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
    $body .= "Invitación a Reunión <br /><br />";
    $body .= "</div>";
    $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
    $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
    $body .= "<b>Título de Reunión</b>: " . $p["titulo"] . "<br />";
    $body .= "<b>Lugar</b>: " . $lugar_text . "<br />";
    $body .= "<b>Objetivo General</b>: " . $p["objetivo_principal"] . "<br />";
    $body .= "<b>Fecha:</b> " . $p["fecha"] . "<br />";
    $body .= "<b>Hora:</b> " . $p["hora"] . "<br />";
    $body .= "<b>Tiempo Previsto:</b> " . $p["tiempo_previsto"] . "<br />";
    $body .= "<b>Convocado por: </b>" . $si["nombre"] . "<br />";
    $body .= "</div>";
    $body .= "<b>Ver más detalles:</b><br /><a href='http://" . $_SERVER["HTTP_HOST"] . "//nwlib/modulos/nw_meeting/src/viewReu.php?id=$id'>Enlace</a><br /><br />";
    $body .= "</div>";
    $body .= "</div>";
    $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='http://www.netwoods.net' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
    $mail->AddAddress($asistente_email, $asistente_text);
//    $mail->AddBCC("orionjafe@hotmail.com");
//    $mail->AddBCC("ingenieria@netwoods.net");
//    $mail->AddBCC("diseno@netwoods.net");
//    $mail->AddBCC("assdres@hotmail.com");
    $mail->AddReplyTo($_SESSION["email"], $_SESSION["nombre"]);
    $mail->SetFrom($_SESSION["email"], $_SESSION["nombre"]);
    $mail->Subject = "Invitación a Reunión";
    $mail->AltBody = "Invitación a Reunión";
    $mail->MsgHTML($body);
    if (!$mail->Send()) {
        echo "ERRORNWMAIL: No se pudo enviar el correo de notificación, sin embargo la reunión fue creada exitosamente.";
    }
}
$temas_asigna = explode(",", $_POST["temas"]);
$total_temas = count($temas_asigna);
for ($ii = 0; $ii < $total_temas; $ii++) {
    $ce = new NWDbQuery($db);
    $id_tema = master::getNextSequence("nwreu_temas_id_seq");
    $ce->prepareInsert("nwreu_temas", "id, nombre, estado, reunion, usuario, empresa, terminal, estado_text, fecha");
    $ce->bindValue(":id", $id_tema);
    $ce->bindValue(":nombre", $temas_asigna[$ii]);
    $ce->bindValue(":reunion", $id);
    $ce->bindValue(":usuario", $si["usuario"]);
    $ce->bindValue(":empresa", $si["empresa"]);
    $ce->bindValue(":terminal", $si["terminal"]);
    $ce->bindValue(":estado", 1);
    $ce->bindValue(":estado_text", "Pendiente");
    $ce->bindValue(":fecha", $fecha);
    if (!$ce->exec()) {
        $db->rollback();
        echo "Error: " . $ce->lastErrorText();
        return;
    }
}
$db->commit();
?>
