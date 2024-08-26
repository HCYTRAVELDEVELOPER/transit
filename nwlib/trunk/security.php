<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class nw_security {

    const USER_ERROR_DIR_LOCAL = '/home/andresf/error_logs.log';

    public static function sendSimpleEmail($text) {
        mail("direccion@netwoods.net", "Mensaje simple de datos: " . date("Y-m-d"), $text);
    }

    public static function logSystemError($text, $local = false, $email = false) {
        $date = date('d.m.Y h:i:s');
        $log = "Texto: " . $text . "   \n  Date:  " . $date . "\n";
        if (isset($_SESSION["usuario"])) {
            $log .= $log . " User:  " . $_SESSION["usuario"] . "\n";
        }

        ob_start();
        debug_print_backtrace();
        $log .= ob_get_contents();
        ob_end_clean();

        $log .= "\n";

        $code = 0;

        if ($local) {
            $code = 3;
        }

        error_log($log, 0, self::USER_ERROR_DIR_LOCAL);

        if ($email) {
            self::sendSimpleEmail($log);
        }
    }

    public static function sendEmailDeveloper($p) {
        $mail = new PHPMailer();

//            $mail->IsSMTP();
//            $mail->Host = "mail.netwoods.net";
//            $mail->SMTPDebug = 2;
//            $mail->SMTPAuth = true;
//            $mail->Host = "mail.netwoods.net";
//            $mail->Port = 26;
//            $mail->Username = "direccion";
//            $mail->Password = "netwoods";

        $mail->AddReplyTo("info@gruponw.com", "NW team");
        $mail->SetFrom("info@gruponw.com", "NW team");
        $mail->AddAddress($p["email"], $p["nombre"]);
        $mail->Subject = "Reporte de errores NW";
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.netwoods.net";

        $body = "<div style='padding: 20px;max-width: 600px;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
        $body .= "informe de errores. Recuerde que se ha generado un ticket y está corriendo el tiempo para solucionarlo.";
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $body .= $p["error_text"];
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
        $mail->MsgHTML($body);
        if (!$mail->Send()) {
            
        }
    }

    public static function getRegistro($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 ";
        if ($p["filters"]["filtro"] != "") {
            $where .= " and (lower(a.tabla::text) like lower('%{$p["filters"]["filtro"]}%') or lower(a.query::text) like lower('%{$p["filters"]["filtro"]}%') "
                    . "or lower(a.usuario::text) like lower('%{$p["filters"]["filtro"]}%'))";
        }
        if (isset($p["filters"]["accion"])) {
            if ($p["filters"]["accion"] != "TODOS") {
                $where .= " and a.accion='" . $p["filters"]["accion"] . "' ";
            }
        }
        if ((isset($p["filters"]["fecha_inicial"]) && $p["filters"]["fecha_inicial"] != "") && (isset($p["filters"]["fecha_final"]) && $p["filters"]["fecha_final"] != "")) {
            $where .= " and a.fecha between '" . $p["filters"]["fecha_inicial"] . "' and '" . $p["filters"]["fecha_final"] . "' ";
        }
        $sql = "select "
                . "a.*, "
                . "CONCAT(c.nombre, ' ', c.apellido) as nombre_usuario, "
                . "b.razon_social as nom_empresa "
                . "from nw_registro a "
                . "left join empresas b on (a.empresa=b.id) "
                . "left join usuarios c on (a.usuario=c.usuario) " . $where;
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function getLogEntradasSalidas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " where 1=1 ";
        if ($p["filters"]["filtro"] != "") {
            $where .= " and (lower(a.usuario::text) like lower('%{$p["filters"]["filtro"]}%')) ";
        }
        if (isset($p["filters"]["accion"])) {
            if ($p["filters"]["accion"] != "TODOS") {
                $where .= " and a.accion='" . $p["filters"]["accion"] . "' ";
            }
        }
        if ((isset($p["filters"]["fecha_inicial"]) && $p["filters"]["fecha_inicial"] != "") && (isset($p["filters"]["fecha_final"]) && $p["filters"]["fecha_final"] != "")) {
            $where .= " and a.fecha between '" . $p["filters"]["fecha_inicial"] . "' and '" . $p["filters"]["fecha_final"] . "' ";
        }
        $sql = "select a.*, "
                . "b.razon_social as nom_empresa, "
                . "CASE WHEN c.estado = 'activo' THEN 'Activo' ELSE 'Inactivo' END as estado, "
                . "CONCAT(c.nombre, ' ', c.apellido) as nombre_usuario, "
                . "d.nombre as nom_terminal "
                . "from usuarios_log a "
                . "left join empresas b on (a.empresa=b.id) "
                . "left join usuarios c on (a.usuario=c.usuario) "
                . "left join terminales d on (a.terminal=d.id) " . $where;
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function sendDeveloperError($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $text = self::handleError($p);
        self::sendEmailDeveloper($text);
    }

    public static function handleError($p) {

        $id = "0";
        if (isset($p["id"])) {
            $id = $p["id"];
        }

        $text = "";
        $text .= "<b>Texto de error: </b>" . $p["error_text"] . "<br />";
        $text .= "<b>Dominio: </b>" . isset($p["dominio"]) ? $p["dominio"] : "N/A" . "<br />";
        $text .= "<b>Navegador: </b>" . $p["browser_name"] . "<br />";
        $text .= "<b>Versión navegador: </b>" . $p["browser_version"] . "<br />";
        $text .= "<b>Dispositivo: </b>" . $p["device_name"] . "<br />";
        $text .= "<b>Motor navegador: </b>" . $p["engine_name"] . "<br />";
        $text .= "<b>Motor Versión: </b>" . $p["engine_version"] . "<br />";
        $text .= "<b>Sistema operativo: </b>" . $p["os_name"] . "<br />";
        $text .= "<b>SO Versión: </b>" . $p["os_version"] . "<br />";
        $text .= "<b>Programa: </b>" . ucwords($p["program_name"]) . "<br />";
        $text .= "<b>Usuario: </b>" . $p["user_name"] . "<br />";
        $text .= "<b>Usuario Mail: </b>" . $p["email"] . "<br />";
        $text .= "<b>DB: </b>" . ucwords($p["db"]) . "<br />";
        $text .= "<b>Fecha: </b>" . $p["fecha"] . "<br />";
        $text .= "<b>Hora: </b>" . $p["hora"] . "<br />";
        $text .= "<b>Comentarios: </b>" . $p["comments"] . "<br />";
        $text .= "<b>Id Ticket: </b>" . $id . "<br />";
        return $text;
    }

    public static function save($p) {

        session::check();

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $si = session::info();

        $ca->prepareSelect("nw_keys_conf", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $fields = "block_fail_access,minutes_blocked_fail_access,expiration_days,concurrency,inactivity_days,days_search_old_key,minimun_length,upper_word,numeric_word,special_characters,
            fecha,usuario,empresa,change_at_init,check_terminal";
        if ($ca->size() == 0) {
            $ca->prepareInsert("nw_keys_conf", $fields);
        } else {
            $ca->prepareUpdate("nw_keys_conf", $fields, "1=1");
        }
        $ca->bindValue(":block_fail_access", $p["block_fail_access"] == "" ? "null" : $p["block_fail_access"], false);
        $ca->bindValue(":minutes_blocked_fail_access", $p["minutes_blocked_fail_access"] == "" ? "null" : $p["minutes_blocked_fail_access"], false);
        $ca->bindValue(":expiration_days", $p["expiration_days"] == "" ? "null" : $p["expiration_days"], false);
        $ca->bindValue(":concurrency", $p["concurrency"]);
        $ca->bindValue(":inactivity_days", $p["inactivity_days"] == "" ? "null" : $p["inactivity_days"], false);
        $ca->bindValue(":days_search_old_key", $p["days_search_old_key"] == "" ? "null" : $p["days_search_old_key"], false);
        $ca->bindValue(":minimun_length", $p["minimun_length"] == "" ? "null" : $p["minimun_length"], false);
        $ca->bindValue(":upper_word", $p["upper"]);
        $ca->bindValue(":numeric_word", $p["numeric"]);
        $ca->bindValue(":special_characters", $p["special_characters"]);
        $ca->bindValue(":change_at_init", $p["change_at_init"] == "" ? "null" : $p["change_at_init"], false);
        $ca->bindValue(":check_terminal", $p["check_terminal"] == "" ? "null" : $p["check_terminal"], false);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se procesó la información. " . $ca->lastErrorText());
        }
        NWJSonRpcServer::sucess("Información procesada correctamente");
        return true;
    }

    public static function getData() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_keys_conf", "*", "", 1);
        if (!$ca->exec()) {
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            return $ca->assoc();
        }
    }

    public static function getErrorsLog() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_registro", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se pudo realizar la consulta");
            return false;
        }
    }

    public static function getExpiration() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_keys_conf", "expiration_days");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se pudo realizar la consulta");
            return false;
        }
        $r = 0;
        $exp = 0;
        if ($ca->size() != 0) {
            $ca->next();
            $r = $ca->assoc();
            $exp = $r["expiration_days"];
        }
        $ca->prepareSelect("usuarios", "DATEDIFF(current_date, date_change_key) as days_after_change", "usuario=:usuario");
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se consultó la última fecha de cambio de clave");
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        $days_after = $r["days_after_change"];
        if ($days_after >= $exp) {
            return true;
        } else {
            return false;
        }
    }

    public static function getConnectedUser10Min($empresa) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = master::getInfo();
        $ca->prepareSelect("usuarios_log", "fecha,accion,session_id", "usuario=:usuario and fecha > (CURRENT_TIMESTAMP - interval '60 min') and empresa=:empresa", "fecha desc limit 1");
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return;
        }
        if ($ca->size() === 0) {
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        if (isset($r["accion"])) {
            if ($r["accion"] == "INGRESO") {
                return $r;
            }
        }
        return false;
    }

    public static function eliminarConcurrencia($empresa) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = master::getInfo();
        $ca->prepareSelect("usuarios_log", "id", "usuario=:usuario and empresa=:empresa", "id desc");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return;
        }

        $ca->prepareUpdate("usuarios_log", "fecha", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return;
        }
    }

    public static function getConnectedUser($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "conectado", "usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            $r = $ca->assoc();
            return $r["conectado"];
        }
    }

    public static function getDaysNotEntered($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios_log", "cast(current_date as date) - cast(max(fecha) as date) as diference", "usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            $r = $ca->assoc();
            return $r["diference"];
        }
    }

    public static function getMaxDateEnteredUser($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios_log", "max(fecha)- current_date", "usuario=:usuario");
        $ca->bindValue(":usuario", $p["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se consultó la fecha máxima de ingreso");
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            $r = $ca->assoc();
            return $r;
        }
    }

    public static function updatefailedAccess($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("nw_fail_access", "blocked", "usuario=:usuario and fecha=:fecha");
        $ca->bindValue(":blocked", 'false', true);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->exec();
        return true;
    }

    public static function getFailedAccess($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_fail_access", "count(*) as failed_access, (:current - max(hora)) as max_hora", "usuario=:usuario and fecha=:fecha and blocked is false");
        $ca->bindValue(":usuario", $p["usuario"], true);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":current", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            return false;
        }
        if ($ca->size() > 0) {
            $ca->next();
            return $ca->assoc();
        } else {
            return false;
        }
    }

    public static function setFailAccess($p, $send = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $user = "N/A";
        if (isset($p["usuario"])) {
            $user = $p["usuario"];
        } else if (isset($p["user"])) {
            $user = $p["user"];
        }
        $ca->prepareInsert("nw_fail_access", "error_description,usuario,clave,hora,fecha,blocked");
        $ca->bindValue(":error_description", $p["error_description"]);
        $ca->bindValue(":usuario", $user, true);
        $ca->bindValue(":clave", isset($p["clave"]) ? $p["clave"] : "N/A");
        $ca->bindValue(":hora", date("H:i:s"));
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":blocked", 'false', false);
        if (!$ca->exec()) {
//            NWJSonRpcServer::error("No se ingresó la novedad de acceso");
            NWJSonRpcServer::error("No se ingresó la novedad de acceso " . $ca->lastErrorText());
        }
        if ($send != false) {
            master::sendReport($p["error_description"]);
        }
        return true;
    }

}
