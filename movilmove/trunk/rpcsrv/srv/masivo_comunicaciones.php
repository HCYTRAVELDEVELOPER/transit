<?php

class masivo_comunicaciones {

    public static function envioMasivo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if (isset($p["tipo"])) {
            if ($p["tipo"] == "notificacion") {
                $campo = "razon_social,slogan,logo";
                $camp_update = "";
            }
            if ($p["tipo"] == "correo") {
                $campo = "razon_social,slogan,logo,saldo_correos as saldo,usuario_correos,password_correos,tarifa_correo,from_email,from_name,img_header,img_body,img_footer";
                $camp_update = "saldo_correos";
            }
            if ($p["tipo"] == "mensaje_text") {
                $campo = "razon_social,slogan,logo,saldo_sms as saldo,usuario_sms,password_sms,tarifa_sms";
                $camp_update = "saldo_sms";
            }
        }
        $ca->prepareSelect("empresas", $campo, "id=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $empresa = $ca->flush();
        if ($p["tipo"] == "notificacion") {
            $empresa["saldo"] = "1";
        }
        $saldo = $empresa["saldo"];
        $total = $p["total"];
        $valor_sms = "60";
        $valor_email = "100";
        $valor_push = "0";
        if (isset($empresa["tarifa_sms"]) && $empresa["tarifa_sms"] !== null) {
            $valor_sms = $empresa["tarifa_sms"];
        }
        if (isset($empresa["tarifa_correo"]) && $empresa["tarifa_correo"] !== null) {
            $valor_email = $empresa["tarifa_correo"];
        }

        if ($saldo <= 0) {
            return "No tiene saldo suficiente";
        }
        $totalusers = count($p["filters"]);
        $sum = 0;
        $msgFinal = "";

        //only for mail
        if ($p["tipo"] === "correo") {
            $ma = Array();
            $ma["contacts"] = Array();
            $ma["subject"] = $p["asunto"];
            $ma["body"] = self::bodyEmail($p, $empresa);
            $ma["from_email"] = $empresa["from_email"];
            $ma["from_name"] = $empresa["from_name"];
            $ma["MJ_APIKEY_PUBLIC"] = $empresa["usuario_correos"];
            $ma["MJ_APIKEY_PRIVATE"] = $empresa["password_correos"];
        }

        for ($index = 0; $index < $totalusers; $index++) {
            $row = $p["filters"][$index];
            if ($p["tipo"] === "notificacion" || $p["tipo"] === "mensaje_text") {
                $s = self::sendMasivo($row, $empresa, $p, $db);
                if ($s !== true) {
                    $db->rollback();
                    return $s;
                }
            } else
            if ($p["tipo"] === "correo") {
                $ma["contacts"][$index] = [];
                $ma["contacts"][$index]["email"] = $row["email"];
                $ma["contacts"][$index]["name"] = $row["nombre"];
            }

            $saldo_old = $saldo;
            $description = "";
            $valor_descarga = 0;
            if ($p["tipo"] === "mensaje_text") {
                $saldo = $saldo - $valor_sms;
                $description = "Envío de SMS Masivo módulo comunicaciones";
                $valor_descarga = $valor_sms;
            }
            if ($p["tipo"] === "correo") {
                $saldo = $saldo - $valor_email;
                $description = "Envío de SMS Masivo módulo comunicaciones";
                $valor_descarga = $valor_email;
            }
            if ($p["tipo"] === "notificacion") {
                $saldo = $saldo - $valor_push;
            }
//            $s = self::actualizaSaldo($saldo, $camp_update);

            if ($p["tipo"] === "correo" || $p["tipo"] === "mensaje_text") {
                $sl = Array();
                $sl["saldo_nuevo"] = $saldo;
                $sl["saldo_anterior"] = $saldo_old;
                $sl["campo"] = $camp_update;
                $sl["empresa"] = $si["empresa"];
                $sl["perfil"] = $si["perfil"];
                $sl["usuario"] = $row["celular"];
                $sl["valor_descarga"] = $valor_descarga;
                $sl["tipo"] = "{$p["tipo"]}_masivo_mod_comunicaciones";
                $sl["description"] = $description;
                $s = nwMaker::actualizaSaldo($sl);
                if ($s !== true) {
                    $db->rollback();
                    return $s;
                }
            }
            $sum++;
            if ($saldo <= 0) {
                $msgFinal = "<p style='color: red;font-weight: bold;'>¡No tiene saldo suficiente! No fueron enviados algunos contactos<p> <br />{$sum} {$p["tipoText"]} correctamente";
                break;
            }
            if ($p["tipo"] === "correo") {
                $r = nwMaker::sendEmailMasivo($ma);
//            return $r;
            }
        }
        if ($msgFinal === "") {
            $msgFinal = "<p style='color: green;font-weight: bold;'>¡Todos los contactos fueron enviados correctamente!<p> <br />{$sum} {$p["tipoText"]} correctamente";
        }
        return $msgFinal;
    }

    public static function sendMasivo($usu, $empresa, $p, $db) {
//        session::check();
        $si = session::getInfo();
        
        $tipo_usu = false;
        $sendEmail = false;
        $sendNotifyPush = false;
        $celular = false;
        $send_sms = false;
        $usuCredeSms = false;
        $passCredeSms = false;
        if (isset($empresa["usuario_sms"]) && $empresa["usuario_sms"] != "" && $empresa["usuario_sms"] !== null) {
            $usuCredeSms = $empresa["usuario_sms"];
        }
        if (isset($empresa["password_sms"]) && $empresa["password_sms"] != "" && $empresa["password_sms"] !== null) {
            $passCredeSms = $empresa["password_sms"];
        }
        $asunto = "Información";
        if (isset($p["asunto"])) {
            $asunto = $p["asunto"];
        }
        $usuario_cliente = $usu["email"];

        if ($p["dirigido"] == "1") {
            $tipo_usu = "driver";
        } else {
            $tipo_usu = "user";
        }
        if ($p["tipo"] == "notificacion") {
            $sendNotifyPush = true;
            $celular = $usu["celular"];
        }
        if ($p["tipo"] == "mensaje_text") {
            $send_sms = true;
            $celular = $usu["celular"];
        }
        if ($p["tipo"] == "correo") {
            $sendEmail = true;
        }

        $razon_social = $empresa["razon_social"];

        /*
          $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
          $logo = "https://" . $hostname . "{$empresa["logo"]}";
          $slogan = $empresa["slogan"];
          strtoupper($usu["nombre"][0]);
          $cliente = $usu["nombre"];
          $html = $p["descripcion"];
          $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;' >";
          //TITLE
          $body .= "<div style='text-align: center;margin: 30px 0 20px 0;background-color: #c04025; color: #fff;' >
          <img src='{$logo}' style='width: auto; max-width: 100%; margin-top:20px;' />
          <p>{$razon_social}</p>
          <p style='margin-bottom:20px;'>{$slogan}</p>
          </div>";
          //MENSAJE GRANDE ALERT ENC
          $body .= " <div style='text-align: left; margin: 30px 0 0 0; padding: 0 15px'>
          <p style='    Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 30px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>
          Hola  {$cliente},
          </p>
          </div>";
          //MENSAJE CENTRO
          $body .= " <div style='text-align: left;margin: 30px 0 20px 0; padding: 0 20px'>
          <p>
          {$html}
          </p>
          </div>";
          //FOOTER
          $body .= " <div style='text-align: center;margin: 30px 0 20px 0; background-color: #c04025; color: #fff;'>";
          $body .= "<p style='margin-top:20px;' >Con la tecnología de <a href='https://www.gruponw.com' target='_blank'>NW Group</a></p>";
          $body .= "<p>Hostname: {$hostname} - " . date("Y-m-d H:i:s") . "</p>";
          $body .= " </div>";
          //CIERRA CONTENEDOR TOTAL
          $body .= "</div>";
         */
        $body = "N/A";
        $body_notify = $p["descripcion"];

        $a = Array();
        $a["correo_usuario_recibe"] = $usuario_cliente;
        $a["destinatario"] = $usuario_cliente;
        $a["titleMensaje"] = $asunto;
        $a["sms_body"] = $body_notify;
        $a["body"] = $body_notify;
        $a["body_email"] = $body;
        $a["tipo"] = "enviarInCron";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = date("Y-m-d H:i:s");
        $a["tipoAviso"] = $tipo_usu;
        $a["id_objetivo"] = $p["id"];
//        $a["foto"] = $logo;
        $a["foto"] = "";
        $a["usuario_envia"] = $usuario_cliente;
        $a["sendEmail"] = $sendEmail;
        $a["sendNotifyPush"] = $sendNotifyPush;
        $a["celular"] = "57{$celular}";
        $a["send_sms"] = $send_sms;
        $a["cleanHtml"] = true;
        $a["insertaEnTabla"] = true;
        $a["fromName"] = $razon_social;
//        $a["fromEmail"] = "";
        $a["usuCredeSms"] = $usuCredeSms;
        $a["passCredeSms"] = $passCredeSms;
        $a["perfil"] = $p["dirigido"];
        $a["empresa"] = $si["empresa"];
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
        return true;
    }

    public static function bodyEmail($p, $empresa) {
        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
        $logo = "https://" . $hostname . "{$empresa["logo"]}";
        $razon_social = $empresa["razon_social"];
        $slogan = $empresa["slogan"];
        $html = $p["descripcion"];

        $tittle = " Hola  [name],";
//        $subt = "Te hemos enviado unas observaciones que debes tener en cuenta.<br>";

        $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;'>";
        $body .= "<div style='position: relative;display: flex;'>";
        $body .= "<div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>";
        $body .= "<p style='width: 200px;Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 32px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>";
        $body .= $tittle;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;position: absolute;'>";
//        $body .= "<img style='width: 100%;' src='http://" . $hostname . "/imagenes/logo-correo.jpg' alt='' />";
        $body .= "<img style='width: 100%;' src='https://" . $hostname . $empresa["img_header"] . "' alt='' />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<div style='text-align: left;margin: 30px 0 10px 0; padding: 0 10px'>";
        $body .= "<p>";
        $body .= $html;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;'>";
//        $body .= "<img style='width: 100%;' src='http://" . $hostname . "/imagenes/movil-correo.png' alt='' />";
        $body .= "<img style='width: 100%;' src='https://" . $hostname . $empresa["img_body"] . "' alt='' />";
        $body .= "</div>";
        $body .= "<div style='background: #000000; text-align: center; color: #fff; position: relative;top: -20px;'>";
        $body .= "<div style='display: flex;padding: 17px;'>";
        $body .= "<div style='width: 200px;'>";
//        $body .= "<img style='width: 200px;' src='http://" . $hostname . "/imagenes/logo2-correo.png' alt='' />";
        $body .= "<img style='width: 200px;' src='https://" . $hostname . $empresa["img_footer"] . "' alt='' />";
        $body .= "</div>";
        $body .= "<div style='display: flex;justify-content: space-between;position: absolute;right: 47px;width: 112px;padding: 9px;'>";
        $body .= "<img  src='https://" . $hostname . "/imagenes/face-correo.png' alt='' />";
        $body .= "<img  src='https://" . $hostname . "/imagenes/istag-correo.png' alt='' />";
//        $body .= "<img  src='http://" . $hostname . "/imagenes/face-correo.png' alt='' />";
//        $body .= "<img  src='http://" . $hostname . "/imagenes/istag-correo.png' alt='' />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<div>";
        $body .= "<p style='    width: 93%;margin: auto;margin-top: 20px;border-top: 1px solid grey;padding-top: 13px'>Con la tecnologia de";
        $body .= "<a href='https://www.gruponw.com' target='_blank'>NW Group</a>";
        $body .= "</p>";
        $body .= "<p style='margin: 0px;margin: 0px;padding-bottom: 13px;'>Hostname: {$hostname} - " . date("Y-m-d H:i:s") . "</p>";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "</div>";

        return $body;
    }

}
