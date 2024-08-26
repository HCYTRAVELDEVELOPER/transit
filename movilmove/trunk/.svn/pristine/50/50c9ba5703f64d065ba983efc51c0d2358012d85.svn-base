<?php

$test = false;
if ($test) {
    require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
    $id = "449d9c24-a6cc-40bc-9708-7e57f10a1229";
}
//$minutosAdd = 60;
//$hoy = date("Y-m-d H:i:s");
//$hoy = "2021-09-18 16:44:13";
//$nuevaFecha = nwMaker::sumaRestaFechasByFecha("+0 hour", "+{$minutosAdd} minute", "+0 second", $hoy);
//echo $nuevaFecha;
//return;
$pay = false;
if (isset($data->type)) {
    $pay = $data->type;
    $test = false;
}
if ($pay == 'order.paid' || $test) {
    if ($test) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
    }
    $ca->prepareSelect("nwconekta_orders", "*", "checkoutRequestId=:checkoutRequestId and type='create' ");
    $ca->bindValue(":checkoutRequestId", $id);
    if (!$ca->exec()) {
        return nwMaker::error($ca->lastErrorText(), true);
    }
    if ($ca->size() > 0) {
        $ra = $ca->flush();
        $perfil = $ra["perfil"];
        if ($ca->size() > 0) {
            $respujson = json_decode($ra["extra"]);
            $ca->prepareSelect("pv_clientes", "nombre,usuario_cliente,empresa,perfil,saldo,saldo_por_tiempo,fecha_vencimiento_saldo as total_tiempo", "usuario_cliente=:usuario and perfil=:perfil and empresa=:empresa");
            $ca->bindValue(":usuario", $ra["email_customer"]);
            $ca->bindValue(":empresa", $ra["empresa"]);
            $ca->bindValue(":perfil", $perfil);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText(), true);
            }
            if ($ca->size() == 0) {
                return nwMaker::error("No hay registros", true);
            }
            $resp = $ca->flush();

            $saldo_time = $resp["saldo_por_tiempo"];
            $saldo_actu = $resp["saldo"];
            $monto = 0;

            $tipo = $respujson->tipo;
            $description = $respujson->descripcion;
            if ($tipo == "plan") {
                $monto = $respujson->total_recarga;
            } else {
                $monto = $ra["valor"];
                if (isset($respujson->valor_formato)) {
                    $monto = $respujson->valor_formato;
                }
            }

            function formatNumber($numero) {
                return round($numero, 2);
            }

            $nuevoSaldo = $saldo_actu;
            if ($perfil != "2") {
                $nuevoSaldo = $saldo_actu + $monto;
            }
            $nuevoSaldoTime = $saldo_time + $monto;

//            $nuevoSaldo = 0;
//            if ($saldo_actu < 0) {
//                $saldo = $saldo_actu * (-1);
//                $nuevoSaldo = $monto - $saldo;
//            } else {
//                if ($saldo_actu == "0") {
//                    $nuevoSaldo = $monto;
//                } else {
//                    $nuevoSaldo = $monto + $saldo_actu;
//                }
//            }
            $nuevaFecha = null;
            $fields = "fecha_ultima_recarga";
            if ($perfil != "2") {
                $fields .= ",saldo";
            }
            $minutosAdd = 0;
            $fecha_vencimiento_anterior = null;
            if (isset($respujson->total_tiempo) && $respujson->total_tiempo != "0") {
                $fields .= ",fecha_vencimiento_saldo,saldo_por_tiempo";
                $minutosAdd = intval($respujson->total_tiempo);
                $hoydat = date("Y-m-d H:i:s");
                $hoy = $hoydat;
                if ($resp["total_tiempo"] !== null && $resp["total_tiempo"] !== "") {
                    $hoy = $resp["total_tiempo"];
                    $fecha_vencimiento_anterior = $resp["total_tiempo"];
                    if ($hoy < $hoydat) {
                        $hoy = $hoydat;
                    }
                }
                $nuevaFecha = nwMaker::sumaRestaFechasByFecha("+0 hour", "+{$minutosAdd} minute", "+0 second", $hoy);
            }
            $fecha_vencimiento_actual = $nuevaFecha;
            $ca->prepareUpdate("pv_clientes", $fields, "usuario_cliente=:usuario and perfil=:perfil and empresa=:empresa");
            $ca->bindValue(":saldo", $nuevoSaldo, true, true);
            $ca->bindValue(":usuario", $ra["email_customer"]);
            $ca->bindValue(":empresa", $ra["empresa"]);
            $ca->bindValue(":perfil", $perfil);
            $ca->bindValue(":fecha_vencimiento_saldo", $nuevaFecha);
            $ca->bindValue(":saldo_por_tiempo", $nuevoSaldoTime);
            $ca->bindValue(":fecha_ultima_recarga", date("Y-m-d H:i:s"));
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText(), true);
            }

            $f = "valor_recarga,total_recarga,usuario,empresa,fecha,estado,perfil,nombre,fecha_transaccion,transaccion_id,tipo,saldo_anterior,saldo_actual,checkoutRequestId,fecha_vencimiento_anterior,fecha_vencimiento_actual";
            $f .= ",saldoAnteriorTime,saldoActualTime,descripcion,tiempo";
            $ca->prepareInsert("edo_recargas", $f);
            $ca->bindValue(":valor_recarga", $monto);
            $ca->bindValue(":total_recarga", $monto);
            $ca->bindValue(":usuario", $resp["usuario_cliente"]);
            $ca->bindValue(":empresa", $resp["empresa"]);
            $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ca->bindValue(":estado", "Aceptada");
            $ca->bindValue(":perfil", $perfil);
            $ca->bindValue(":nombre", $resp["nombre"]);
            $ca->bindValue(":fecha_transaccion", date("Y-m-d H:i:s"));
            $ca->bindValue(":transaccion_id", $id);
            $ca->bindValue(":tipo", $tipo);
            $ca->bindValue(":tipo", "plan");
            $ca->bindValue(":saldo_anterior", $saldo_actu, true, true);
            $ca->bindValue(":saldo_actual", $nuevoSaldo, true, true);
            $ca->bindValue(":saldoAnteriorTime", $saldo_time, true, true);
            $ca->bindValue(":saldoActualTime", $nuevoSaldoTime, true, true);
            $ca->bindValue(":fecha_vencimiento_anterior", $fecha_vencimiento_anterior);
            $ca->bindValue(":fecha_vencimiento_actual", $fecha_vencimiento_actual);
            $ca->bindValue(":tiempo", $minutosAdd);
            $ca->bindValue(":descripcion", $description);
            $ca->bindValue(":checkoutRequestId", $id);
            if (!$ca->exec()) {
                return nwMaker::error($ca->lastErrorText(), true);
            }

            $estat = "transacción ha sido aceptada";
            $ca->prepareSelect("empresas", "razon_social,slogan,logo", "id=:empresa");
            $ca->bindValue(":empresa", $ra["empresa"]);
            if (!$ca->exec()) {
                return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
            }
            $empresa = $ca->flush();
            $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//            $hostname = "rmovil.gruponw.com";
            $logo = "https://" . $hostname . "{$empresa["logo"]}";
            $razon_social = $empresa["razon_social"];
            $slogan = $empresa["slogan"];

            $cliente = $ra["name"];
            $tittle = "Respuesta transacción";
            $html = "<p>Detalle de la transacción:</p>";
            $html .= "<p><strong>Descripción: </strong>" . $respujson->descripcion . "</p>";
            $html .= "<p><strong>Nro factura: </strong>" . $id . "</p>";
            $html .= "<p><strong>Valor Total: </strong>" . $monto . "</p>";
            $html .= "<p><strong>Fecha y Hora Transacción: </strong>" . date("Y-m-d H:i:s") . "</p>";


            $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;'>";
            $body .= "<div style='position: relative;display: flex;'>";
            $body .= "<div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>";
            $body .= "<p style='width: 167px;Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 38px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>";
            $body .= $tittle;
            $body .= "</p>";
            $body .= "</div>";
            $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;position: absolute;'>";
            $body .= "<img style='width: 100%;' src='" . $logo . "' alt='' />";
            $body .= "</div>";
            $body .= "</div>";
            $body .= "<div style='text-align: left;margin: 30px 0 20px 0; padding: 0 20px'>";
            $body .= "<p>";
            $body .= $html;
            $body .= "</p>";
            $body .= "</div>";
            $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;'>";
            $body .= "<img style='width: 100%;' src='https://" . $hostname . "/imagenes/movil-correo.png' alt='' />";
            $body .= "</div>";
            $body .= "<div style='background: #000000; text-align: center; color: #fff; position: relative;top: -20px;'>";
            $body .= "<div style='display: flex;padding: 17px;'>";
            $body .= "<div style='width: 200px;'>";
            $body .= "<img style='width: 200px;' src='" . $logo . "' alt='' />";
//    $body .= "<img style='width: 200px;' src='https://" . $logo . "/imagenes/logo2-correo.png' alt='' />";
            $body .= "</div>";
            $body .= "<div style='display: flex;justify-content: space-between;position: absolute;right: 47px;width: 112px;padding: 9px;'>";
            $body .= "<img  src='https://" . $hostname . "/imagenes/face-correo.png' alt='' />";
            $body .= "<img  src='https://" . $hostname . "/imagenes/istag-correo.png' alt='' />";
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

            $body_notify = "Hola {$cliente} tu  {$estat}.";

            $a = Array();
            $a["correo_usuario_recibe"] = $ra["email_customer"];
            $a["destinatario"] = $ra["email_customer"];
            $a["titleMensaje"] = "Respuesta transaccion";
            $a["sms_body"] = $body_notify;
            $a["body"] = $body_notify;
            $a["body_email"] = $body;
            $a["tipo"] = "enviarRespConekta";
            $a["link"] = null;
            $a["modo_window"] = "popup";
            $a["fechaAviso"] = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
            $a["tipoAviso"] = "driver";
            $a["id_objetivo"] = $datos["x_id_invoice"];
            $a["foto"] = $logo;
            $a["usuario_envia"] = $ra["email_customer"];
//    $a["sendEmail"] = true;
            $a["sendNotifyPush"] = false;
            $a["celular"] = null;
            $a["send_sms"] = false;
            $a["cleanHtml"] = true;
            $a["fromName"] = $razon_social;
            $a["fromEmail"] = "info@gruponw.com";
//        $a["callback"] = "iniciarCitaAgenda($id);";
//    print_r($a);
            $n = nwMaker::notificacionNwMaker($a);
//    print_r($n);
            if ($n !== true) {
                $db->rollback();
                return nwMaker::error($n, true);
            }
            $xa = false;
            $fromName = "Nw test";
            $fromEmail = "info@gruponw.com";
            $title = "Pago realizado a jason ID 1. ";
            $asuntoon = "Pago realizado a {$ra["email_customer"]} customer_id: {$ra["customer_id"]} valor: {$ra["valor"]}  empresa: {$ra["empresa"]} terminal: {$ra["terminal"]} perfil: {$ra["perfil"]} webhook ID {$id} DATA: " . $data;
            nw_configuraciones::sendEmail("desarrollonw@gmail.com", "desarrollonw@gmail.com", $title, $title, $asuntoon, false, $xa, false, $fromName, $fromEmail);
        }
    }
}