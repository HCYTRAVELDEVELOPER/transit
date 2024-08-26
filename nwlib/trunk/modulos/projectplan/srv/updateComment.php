<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
require_once $_SERVER['DOCUMENT_ROOT'] . "/nwlib6/PHPMailer/class.phpmailer.php";
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    ?>
    <script>
        iniciarSesion();
    </script>
    <?php

    return;
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareInsert("tareas_det", "tarea, usuario, observaciones, fecha, tipo");
$ca->bindValue(":tarea", $_POST["id"]);
$ca->bindValue(":observaciones", $_POST["observaciones"]);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":tipo", "Comentario");
if (!$ca->exec()) {
    echo "Error: " . $ca->lastErrorText();
    return;
} else {
    $mail = new PHPMailer();
    master::trySendSmtp($mail);
    $body = "<div style='padding: 20px;max-width: 600px;background: #e5e5e5;'>";
    $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
    $body .= "Comentario en una tarea! <br /><br />";
    $body .= "</div>";
    $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
    $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
    $body .= "<b>Proyecto</b>: " . $_POST["project"] . "<br />";
    $body .= "<b>Type</b>: " . $_POST["type"] . "<br />";
    $body .= "<b>Tarea ID</b>: " . $_POST["id"] . "<br />";
    $body .= "<b>Fecha:</b> " . date("Y-m-d H:i:s") . "<br />";
    $body .= "<b>Comentado por: </b>" . $_SESSION["usuario"] . "<br />";
    $body .= "</div>";
    $body .= "<br />";
    $body .= "<b>Observaciones:</b><br />" . $_POST["observaciones"] . "<br /><br />";
    $body .= "</div>";
    $body .= "</div>";
    $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='http://www.netwoods.net' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
    $ca->prepareSelect("usuarios", "nombre,email", "empresa=:empresa and terminal=:terminal and estado='activo' and cliente='0'");
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        $db->rollback();
        NWJSonRpcServer::error($ca->lastErrorText());
        return;
    }
    if ($ca->size() != 0) {
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r_us = $ca->assoc();
            $mail->AddAddress(trim($r_us["email"]), $r_us["nombre"]);
        }
    }
    $mail->AddBCC("orionjafe@hotmail.com");
    $mail->AddBCC("ingenieria@netwoods.net");
    $mail->AddBCC("diseno@netwoods.net");
    $mail->AddBCC("assdres@hotmail.com");
    $mail->AddReplyTo($_SESSION["email"], $_SESSION["nombre"]);
    $mail->SetFrom($_SESSION["email"], $_SESSION["nombre"]);
    $mail->Subject = "Comentario en tarea";
    $mail->AltBody = "Comentario en tarea";
    $mail->MsgHTML($body);
    $mail->Send();
    echo "Comentario agregado correctamente";
}
?>