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
    if (!function_exists("GetSQLValueString")) {

        function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
            $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;

            $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

            switch ($theType) {
                case "text":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "long":
                case "int":
                    $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                    break;
                case "double":
                    $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                    break;
                case "date":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "defined":
                    $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                    break;
            }
            return $theValue;
        }

    }
}

if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

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

$id_relation = "";
if (isset($_POST["id_relation"])) {
    $id_relation = $_POST["id_relation"];
} else
if (isset($_GET["id_relation"])) {
    $id_relation = $_GET["id_relation"];
} else {
    echo "El campo id_relation no puede estar vacío";
    return;
}

$tipo = "";
if (isset($_POST["tipo"])) {
    $tipo = $_POST["tipo"];
} else
if (isset($_GET["tipo"])) {
    $tipo = $_GET["tipo"];
} else {
    echo "El campo tipo no puede estar vacío";
    return;
}

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$id_comment = master::getNextSequence("propuestas_id_seq");
//$sql = "INSERT INTO nwtask_comments (fecha, comentario, usuario, empresa, id_user, id_relation, tipo) 
//                                values (:fecha, :comentario, :usuario, :empresa, :id_user, :id_relation, :tipo)";
$ca->prepareInsert("nwtask_comments", "id,fecha, comentario, usuario, empresa, id_user, id_relation, tipo");
$ca->bindValue(":id", $id_comment);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":comentario", $comentario);
$ca->bindValue(":id_relation", $id_relation);
$ca->bindValue(":tipo", $tipo);
$ca->bindValue(":id_user", $_SESSION["id"]);
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":empresa", $_SESSION["empresa"]);
//$ca->prepare($sql);
if (!$ca->exec()) {
    echo "Hubo un error, inténtelo nuevamente" . $ca->lastErrorText();
    return;
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
    $ce = new NWDbQuery($db);
    $sql = "select a.comentario,b.nombre,b.email,a.usuario from nwtaks_publications a left join usuarios b on (a.usuario=b.usuario) where a.id=:id_relation";
    $ce->bindValue(":id_relation", $id_relation);
    $ce->prepare($sql);
    if (!$ce->exec()) {
        echo "Hubo un error, inténtelo nuevamente";
        return;
    }
    if ($ce->size() != 0) {
        $ce->next();
        $r_us = $ce->assoc();
    }
    $tu_o_yo = "";
    $tu = "una";
    if ($r_us["usuario"] == $_SESSION["usuario"]) {
        $tu_o_yo = "que hiciste";
        $tu = "tú";
    }
    $titulo = "Comentario en $tu publicación del muro!";
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
    $body .= "<h2 style='font-weight: lighter;font-size: 16px;'>El usuario <b>$remitente_nombre</b> ha comentado una publicación $tu_o_yo en el muro</h2><br/>";
    $body .= "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><b>$tu Publicación: </b>" . $r_us["comentario"] . "<br /></div><br /><br />";
    $body .= "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><b>El Comentario: </b>" . $comentario . "<br /></div><br /><br />";
    $body .= "<a href='http://" . $_SERVER['HTTP_HOST'] . "/postwalk/" . $id_relation . "' target='_blank' style='padding: 5px;background: green;color: #fff;text-decoration: none;position: relative;bottom: 10px;' >
                <b>Ir al comentario aquí </b></a><br />";
    $body .= "<b>Fecha: </b>$fecha<br />";
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
    //   $mail->AddAddress($r_us["email"], $r_us["nombre"]);
    $si = session::info();
    $cf = new NWDbQuery($db);
    $cf->prepareSelect("usuarios", "id,nombre,email", "empresa=:empresa and terminal=:terminal and estado='activo' and cliente=:cliente");
    $cf->bindValue(":empresa", $empresa);
    $cf->bindValue(":terminal", $si["terminal"]);
    $cf->bindValue(":cliente", 0);
    $cf->exec();
    if ($cf->size() != 0) {
        for ($iii = 0; $iii < $cf->size(); $iii++) {
            $cf->next();
            $r_us = $cf->assoc();
            $mail->AddAddress($r_us["email"], $r_us["nombre"]);
        }
    } else {
        echo "No se pudo consultar";
        return;
    }

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
        echo "Comentario creado Correctamente! Notificacion enviada por correo.";
    }

    /*     * ENVIO DE CORREO* */
}
?>
