<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
}

if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);

//$id_cc = "";
//$cb->prepareSelect("nwtaks_publications_id_seq", "nextval('nwtaks_publications_id_seq') as id");
////   $ca->prepareSelect("cuentas_cobro", "max(id) as id");
//if (!$cb->exec()) {
//    $db->rollback();
//    NWJSonRpcServer::error($cb->lastErrorText());
//    return;
//}
//if ($cb->size() != 0) {
//    $cb->next();
//    $ra = $cb->assoc();
//    $id_cc = $ra["id"] + 1;
//}
$id_cc = master::getNextSequence("nwtaks_publications_id_seq");
$comentario = "";
if (isset($_POST["comentario"])) {
    $comentario = $_POST["comentario"];
} else
if (isset($_GET["comentario"])) {
    $comentario = $_GET["comentario"];
} else {
    echo "El campo no puede estar vacío";
    return;
}
if ($comentario == "") {
    echo "Debe agregar un comentario";
    return;
}

$sql = "INSERT INTO nwtaks_publications (id,fecha,comentario,usuario,empresa, id_user) 
                                values (:id,:fecha, :comentario, :usuario, :empresa, :id_user)";
$ca->bindValue(":id", $id_cc);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":comentario", $comentario);
//$ca->bindValue(":adjunto", $_POST["adjunto"]);
$ca->bindValue(":id_user", $_SESSION["id"]);
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":empresa", $_SESSION["empresa"]);
$ca->prepare($sql);
if (!$ca->exec()) {
    echo "Hubo un error, inténtelo nuevamente. Lo sentimos! Error: " . $ca->lastErrorText();
    //  return;
} else {
    /*     * ENVIO DE CORREO* */
//include dirname(__FILE__) . "/../../nwlib/PHPMailer/class.phpmailer.php";

    $mail = new PHPMailer();
//PARÁMETROS CONEXIÓN
//        $mail->IsSMTP();
//        $mail->Host = 'smtp.gmail.com';
//        $mail->Port = 587;
//        $mail->SMTPSecure = "tls";
//        $mail->SMTPAuth = true;
//        $mail->Username = 'publicidad@cat.com.co';
//        $mail->Password = 'ADMONCAT';
//DATOS VARIABLES

    $titulo = "Nueva Publicación en el muro de conocimientos!";
    $remitente_nombre = $_SESSION["nombre"];
    $remitente_email = $_SESSION["email"];
    $terminal = $_SESSION["nom_terminal"];
    $empresa = $_SESSION["empresa"];
    $fecha = date("Y-m-d H:i:s");
    $user = $_SESSION["usuario"];

//BODY CUERPO MENSAJE
    $body = "<div style='padding: 1px;max-width: 100%;background: #e5e5e5;'>";
    $body .= "<div style='background-color: #ec534d;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
    $body .= "$titulo.<br />";
    $body .= "</div>";
    $body .= "<div style='padding: 5px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
    $body .= "<div style='padding: 5px;background: #f1f1f1;color: #666;'>";
    $body .= "<h2 style='font-weight: lighter;font-size: 16px;'>El usuario <b>$remitente_nombre</b> ha escrito en el muro de tareas</h2><br/>";
    $body .= "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><b>Comentario: </b>" . $comentario . "<br /></div><br /><br />";
    $body .= "<a href='http://" . $_SERVER['HTTP_HOST'] . "/postwalk/$id_cc' target='_blank' style='padding: 5px;background: green;color: #fff;text-decoration: none;position: relative;bottom: 10px;' >
                <b>Ir al comentario aquí </b></a><br />";
    $body .= "<b>Fecha: </b>$fecha<br />";
    $body .= "<b>Terminal: </b>$terminal<br />";
    $body .= "<b>Usuario creador: </b>$remitente_nombre<br />";
    $body .= "</div>";
    $body .= "<br />";
    $body .= "<b>Creado por el usuario: $user </b><br />";
    $body .= "</div>";
    $body .= "</div>";
    $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de QXNW & NW Mail.<br />Powered by 
            <a style='text-decoration: none;' href='http://www.netwoods.net' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
//REMITENTE
    $mail->SetFrom($remitente_email, $remitente_nombre);
//DESTINATARIOS
    $ce = new NWDbQuery($db);
    $si = session::info();
    $ce->prepareSelect("usuarios", "id,nombre,email", "empresa=:empresa  and terminal=:terminal and estado='activo' and cliente=:cliente");
    $ce->bindValue(":empresa", $empresa);
    $ce->bindValue(":terminal", $si["terminal"]);
    $ce->bindValue(":cliente", "0");
    $ce->exec();
    $totalUser = $ce->size();
    if ($totalUser > 0) {
        for ($ii = 0; $ii < $totalUser; $ii++) {
            $ce->next();
            $r_us = $ce->assoc();
            $mail->AddAddress($r_us["email"], $r_us["nombre"]);
        }
    }
//    else {
//        echo "No se pudo consultar los usuarios de la empresa $empresa . total datos: $totalUser ";
//        return;
//    }
//RESPONDER A
    $mail->AddReplyTo($remitente_email, $remitente_nombre);
//CC OCULTA
    $mail->AddBCC("orionjafe@hotmail.com");
    $mail->AddBCC("assdres@hotmail.com");
//TÍTULO MAIL
    $mail->Subject = "$titulo de $remitente_nombre";
    $mail->AltBody = "Mensaje reenviado de contacto nwsites";
    $mail->MsgHTML($body);
    if (!$mail->Send()) {
        echo "Tarea creada exitosamente pero tuvimos un problema, No se envió el correo!Posiblemente el usuario no tiene configurado el correo o no está disponible NW Mail en el servidor.";
    } else {
        echo "Tarea Creada Correctamente! Notificacion enviada por correo.";
    }

    /*     * ENVIO DE CORREO* */
}
?>
