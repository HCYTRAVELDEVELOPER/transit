<?php

error_log("ENTRA");

$hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
$appPath = "";
if (isset($_SERVER['HTTP_HOST'])) {
    $appPath = $_SERVER['DOCUMENT_ROOT'] . "/";
} else
if (!isset($argv[1])) {
    error_log("NO EXISTE PATH");
    return false;
} else {
    $argv[1] = str_replace("PATH=", "", $argv[1]);
    $appPath = $argv[1];
}

$usedOutNwlib = true;
require_once "{$appPath}rpcsrv/server.php";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$hoy = date("Y-m-d");
$hoyDay = date("Y-m-d H:i:s");

$fields = "a.celular,a.id as id_user,CONCAT(a.nombre, ' ', a.apellido) as nombre, a.empresa,a.usuario_cliente,";
$fields .= "b.fecha_vencimiento_tegnomecanica,b.vehiculo_poliza_todoriesgo,b.vehiculo_poliza_contractual,b.fecha_vencimiento_soat,b.estado_activacion,b.id,b.placa,a.email,";
$fields .= "c.dominio_back,c.logo,c.razon_social,c.slogan,c.email as email_empresa";

$where = "a.perfil=:perfil";
$where .= " and (b.fecha_vencimiento_soat<=:fecha_vence";
$where .= " or b.vehiculo_poliza_todoriesgo IS NOT NULL and b.vehiculo_poliza_todoriesgo<:fecha_vence";
$where .= " or b.vehiculo_poliza_contractual IS NOT NULL and b.vehiculo_poliza_contractual<:fecha_vence";
$where .= " or b.fecha_vencimiento_tegnomecanica IS NOT NULL and b.fecha_vencimiento_tegnomecanica<:fecha_vence)";
$where .= " and b.estado_activacion <> 2 and b.estado_activacion <> 3";
$where .= " order by a.usuario_cliente asc";

$tables = "pv_clientes a join edo_vehiculos b on(a.usuario_cliente=b.usuario and a.empresa= b.empresa)";
$tables .= " left join empresas c on(a.empresa=c.id)";
$ca->prepareSelect($tables, $fields, $where);
$ca->bindValue(":perfil", "2");
$ca->bindValue(":fecha_vence", $hoy);
if (!$ca->exec()) {
    print_r(nwMaker::error($ca->lastErrorText(), true));
    return false;
}
$total = $ca->size();

$users = "";
for ($i = 0; $i < $total; $i++) {
    $row = $ca->flush();

    $concepto_bloqueo = "";
    if ($row["fecha_vencimiento_soat"] < $hoy) {
        $concepto_bloqueo .= "Vence SOAT. ";
    }
    if ($row["vehiculo_poliza_todoriesgo"] !== null && $row["vehiculo_poliza_todoriesgo"] < $hoy) {
        $concepto_bloqueo .= "Vence Póliza todoriesgo ";
    }
    if ($row["vehiculo_poliza_contractual"] !== null && $row["vehiculo_poliza_contractual"] < $hoy) {
        $concepto_bloqueo .= "Vence Póliza contractual";
    }
    if ($row["fecha_vencimiento_tegnomecanica"] !== null && $row["fecha_vencimiento_tegnomecanica"] < $hoy) {
        $concepto_bloqueo .= "Vence TecnoMecánica";
    }

    $users .= "<br /><br />IDUSER: " . $row["id_user"] . " User: " . $row["usuario_cliente"] . " Placa " . $row["placa"] . " IDVehículo: " . $row["id"];
    $users .= " FechaVenceSoat: " . $row["fecha_vencimiento_soat"];
    $users .= " FechaVencePolizaTodoRiesgo: " . $row["vehiculo_poliza_todoriesgo"];
    $users .= " FechaVencePolizaContractual: " . $row["vehiculo_poliza_contractual"];
    $users .= " FechaVenceTecnoMecánica: " . $row["fecha_vencimiento_tegnomecanica"];

    $cb->prepareUpdate("edo_vehiculos", "estado_activacion,estado_activacion_text,concepto_bloqueo", "usuario=:usuario and id=:id");
    $cb->bindValue(":id", $row["id"]);
    $cb->bindValue(":usuario", $row["usuario_cliente"]);
    $cb->bindValue(":estado_activacion", "3");
    $cb->bindValue(":estado_activacion_text", "bloqueado");
    $cb->bindValue(":concepto_bloqueo", $concepto_bloqueo);
    if (!$cb->exec()) {
        print_r(nwMaker::error($cb->lastErrorText(), true));
        continue;
    }
    $logo = $row["dominio_back"] . $row["logo"];
    $razon_social = $row["razon_social"];
    $slogan = $row["slogan"];
    $html = "Hola " . $row["nombre"] . ", <br> Te informamos que tu vehículo de placas " . $row["placa"] . " ha sido bloqueado en nuestra app de conductores {$razon_social} por el motivo: <strong>{$concepto_bloqueo}</strong>.<br />"
            . " Por favor ingresa y actualiza los datos de tu vehículo o comunícate con el administrador.";

    $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;' >";
//TITLE
    $body .= "<div style='text-align: center;margin: 30px 0 20px 0;background-color: #b8b5b4;' >
                        <img src='{$logo}' style='width: auto; max-width: 200px; margin-top:20px;' />
                        <p>{$razon_social}</p>
                        <p style='margin-bottom:20px;'>{$slogan}</p>
                     </div>";
//MENSAJE GRANDE ALERT ENC
    $body .= " <div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>
                          <p style='    Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 30px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>
                            Reporte de bloqueo.
                          </p>
                      </div>";
//MENSAJE CENTRO
    $body .= " <div style='text-align: left;margin: 30px 0 20px 0; padding: 0 20px'>
                         <p>
                          {$html}
                        </p>
                       </div>";
//FOOTER
    $body .= " <div style='text-align: center;margin: 30px 0 20px 0; background-color: #b8b5b4; padding: 1px;'>";
    $body .= "<p style='margin-top:20px;' >Con la tecnología de <a href='https://www.gruponw.com' target='_blank'>NW Group</a></p>";
    $body .= "<p>Hostname: {$hostname} - " . date("Y-m-d H:i:s") . "</p>";
    $body .= " </div>";
//CIERRA CONTENEDOR TOTAL
    $body .= "</div>";

//    $send = nw_configuraciones::sendEmail($row["email"], $row["nombre"], "Reporte de bloqueo en {$razon_social}", "Reporte de bloqueo en {$razon_social}", $body, $cliente_nws = false, $dt = false, $cleanHtml = true, $razon_social, $row["email_empresa"]);
//    if (!$send) {
//        nwMaker::error($send, true);
//        continue;
//    }

    $tittle = "Tu vehículo de placas {$row["placa"]} fue bloqueado";
    $body_notify = "Tu vehículo de placas {$row["placa"]} presenta novedad y fue bloqueado de la app por {$concepto_bloqueo}";

    $a = Array();
    $a["correo_usuario_recibe"] = $row["usuario_cliente"];
    $a["destinatario"] = $row["usuario_cliente"];
    $a["titleMensaje"] = $tittle;
    $a["sms_body"] = $body_notify;
    $a["body"] = $body_notify;
    $a["body_email"] = $body;
    $a["tipo"] = "driveVence";
    $a["link"] = null;
    $a["modo_window"] = "popup";
    $a["fechaAviso"] = $hoyDay;
    $a["tipoAviso"] = "driveVence";
    $a["id_objetivo"] = null;
    $a["foto"] = null;
    $a["insertaEnTabla"] = true;
    $a["usuario_envia"] = "SYSTEM";
    $a["sendEmail"] = true;
    $a["sendNotifyPush"] = true;
    $a["celular"] = $row["celular"];
    $a["send_sms"] = false;
    $a["cleanHtml"] = false;
    $a["fromName"] = $razon_social;
//        $a["fromEmail"] = "";
    $n = nwMaker::notificacionNwMaker($a);
    if ($n !== true) {
        $db->rollback();
        print_r(nwMaker::error($n, true));
        return $n;
    }

    $send = nw_configuraciones::sendEmail("orionjafe@gmail.com", "NW", "Reporte de bloqueo en {$razon_social}", "Reporte de bloqueo en {$razon_social}", $body, $cliente_nws = false, $dt = false, $cleanHtml = true, $razon_social, $row["email_empresa"]);
    if (!$send) {
        nwMaker::error($send, true);
        continue;
    }


//    $a = Array();
//    $a["title"] = $title;
//    $a["body"] = $body;
//    $a["token"] = $ra["token_usuario"];
//    nwMaker::sendNotificacionPush($a);
}
$db->commit();

if ($total > 0) {
    echo $users;
} else {
    echo "No hay vencimientos";
}


error_log("Cron.php MOVILMOVE execute ok!");

