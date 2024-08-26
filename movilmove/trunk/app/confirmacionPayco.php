<?php
$dat = $_GET;
$datos = $_POST;
//print_r($datos);
require_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$p_cust_id_cliente = '56140';
$p_key = 'f3566b13f1e134574b53e67121b5a588';

$x_ref_payco = $_REQUEST['x_ref_payco'];
//print_r($x_ref_payco);
$x_transaction_id = $_REQUEST['x_transaction_id'];
//print_r($x_transaction_id);
$x_amount = $_REQUEST['x_amount'];
//print_r($x_amount);
$x_currency_code = $_REQUEST['x_currency_code'];
//print_r($x_currency_code);
$x_signature = $_REQUEST['x_signature'];
//print_r($x_signature);
$continuar = true;
$signature = hash('sha256', $p_cust_id_cliente . '^' . $p_key . '^' . $x_ref_payco . '^' . $x_transaction_id . '^' . $x_amount . '^' . $x_currency_code);

$x_response = $_REQUEST['x_response'];
$x_motivo = $_REQUEST['x_response_reason_text'];
$x_id_invoice = $_REQUEST['x_id_invoice'];
$x_autorizacion = $_REQUEST['x_approval_code'];
$x_cod_response = $_REQUEST['x_cod_response'];
//if ($dat["type"] == "false" || $dat["type"] == false || true) {
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("edo_recargas", "estado", "id=:id");
$ca->bindValue(":id", $datos["x_id_factura"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
    return;
}
if ($ca->size() == 0) {
//    echo "No hay registros";
//    return;
    $continuar = false;
    $datos["x_respuesta"] = "Cancelada";
}
if ($continuar == true) {
    $estado = $ca->flush();
//    print_r($estado);
    if ($estado["estado"] != "Aceptada") {
//return;

        $saldos = "";
        if ($datos["x_respuesta"] == "Aceptada") {
            $ca->prepareSelect("pv_clientes", "saldo", "usuario_cliente=:usuario and perfil=:perfil and empresa=:empresa");
            $ca->bindValue(":usuario", $datos["x_extra1"]);
            $ca->bindValue(":empresa", $datos["x_extra2"]);
            $ca->bindValue(":perfil", $datos["x_extra3"]);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {
                echo "No hay registros";
                return;
            }
            $resp = $ca->flush();
            $saldo_actu = floatval($resp["saldo"]);
            $tipo = $datos["x_extra5"];
            $monto = 0;
            if ($tipo == "plan") {
                $monto = $datos["x_extra4"];
            } else {
                $monto = $datos["x_amount"];
            }
//    print_r($monto);
            $total = 0;
            if ($saldo_actu < 0) {
                $saldo = floatval($saldo_actu) * (-1);
                $total = floatval($monto) - floatval($saldo);
            } else {
                $total = floatval($monto) + floatval($saldo_actu);
            }
//print_r($total);
            $ca->prepareUpdate("pv_clientes", "saldo", "usuario_cliente=:usuario and perfil=:perfil and empresa=:empresa");
            $ca->bindValue(":saldo", $total);
            $ca->bindValue(":usuario", $datos["x_extra1"]);
            $ca->bindValue(":empresa", $datos["x_extra2"]);
            $ca->bindValue(":perfil", $datos["x_extra3"]);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }

            $saldos = ",saldo_anterior,saldo_actual";
        }
        $ca->prepareUpdate("edo_recargas", "estado,fecha_transaccion,transaccion_id,tipo" . $saldos, "id=:id");
        $ca->bindValue(":id", $datos["x_id_factura"]);
        $ca->bindValue(":estado", $datos["x_respuesta"]);
        $ca->bindValue(":fecha_transaccion", $datos["x_fecha_transaccion"]);
        $ca->bindValue(":transaccion_id", $datos["x_transaction_id"]);
        $ca->bindValue(":tipo", $datos["x_extra5"]);
        if ($datos["x_respuesta"] == "Aceptada") {
            $ca->bindValue(":saldo_anterior", $saldo_actu);
            $ca->bindValue(":saldo_actual", $total);
        }
        if (!$ca->exec()) {
            echo $ca->lastErrorText();
            return;
        }
    }
//     correo confirmacion
    if ($dat["type"] == true) {
        $x_cod_response = $_REQUEST['x_cod_response'];
        $estat = "";
        switch ((int) $x_cod_response) {

            case 1:
                $estat = "transacción ha sido aceptada";
                break;

            case 2:
                $estat = "transacción ha sido rechazada";
                break;

            case 3:
                $estat = "transacción se encuentra pendiente";
                break;

            case 4:
                $estat = "transacción ha sido fallida";
                break;
        }

        $ca->prepareSelect("empresas", "razon_social,slogan,logo", "id=:empresa");
        $ca->bindValue(":empresa", $datos["x_extra2"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $empresa = $ca->flush();
        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//        $hostname = "app.movilmove.com";
        $logo = "https://" . $hostname . "{$empresa["logo"]}";
        $razon_social = $empresa["razon_social"];
        $slogan = $empresa["slogan"];

        $cliente = $datos["x_customer_name"];
        $tittle = "Respuesta transacción";
        $html = "<p>Detalle de la transacción:</p>";
        $html .= "<p><strong>Descripción: </strong>" . $datos["x_description"] . "</p>";
        $html .= "<p><strong>Medio de Pago: </strong>" . $datos["x_bank_name"] . "</p>";
        $html .= "<p><strong>Nro Recibo interno: </strong>" . $datos["x_id_invoice"] . "</p>";
        $html .= "<p><strong>Nro Recibo: </strong>" . $datos["x_ref_payco"] . "</p>";
        $html .= "<p><strong>Valor Total: </strong>" . $datos["x_amount"] . "</p>";
        $html .= "<p><strong>Fecha y Hora Transacción: </strong>" . $datos["x_fecha_transaccion"] . "</p>";


        $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;'>";
        $body .= "<div style='position: relative;display: flex;'>";
        $body .= "<div style='text-align: left; margin: 30px 0 0 0; padding: 0 20px'>";
        $body .= "<p style='width: 167px;Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 38px;font-weight: normal;line-height: 1.5;padding: 0;text-align: left;word-break: normal;word-wrap: normal;'>";
        $body .= $tittle;
        $body .= "</p>";
        $body .= "</div>";
        $body .= "<div style='right: 0px;top: 30px;bottom: 0px;margin: auto;width: 230px;position: absolute;'>";
        $body .= "<img style='width: 100%;' src='https://" . $hostname . "/imagenes/logo-correo.jpg' alt='' />";
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
        $body .= "<img style='width: 200px;' src='https://" . $hostname . "/imagenes/logo2-correo.png' alt='' />";
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
        $a["correo_usuario_recibe"] = $datos["x_extra1"];
        $a["destinatario"] = $datos["x_extra1"];
        $a["titleMensaje"] = "Respuesta transaccion";
        $a["sms_body"] = $body_notify;
        $a["body"] = $body_notify;
        $a["body_email"] = $body;
        $a["tipo"] = "enviarRespPayco";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = nwMaker::sumaRestaFechas("+0 hour", "+0 minute", "+0 second");
        $a["tipoAviso"] = "driver";
        $a["id_objetivo"] = $datos["x_id_invoice"];
        $a["foto"] = $logo;
        $a["usuario_envia"] = $datos["x_extra1"];
//    $a["sendEmail"] = true;
        $a["sendNotifyPush"] = false;
        $a["celular"] = null;
        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
        $a["fromName"] = $razon_social;
        $a["fromEmail"] = "soporte@netcar.company";
//        $a["callback"] = "iniciarCitaAgenda($id);";
        $n = nwMaker::notificacionNwMaker($a);
        if ($n !== true) {
            $db->rollback();
            return $n;
        }
    }
}
// fin correo
?>
<html>
    <head>
        <meta charset="UTF-8">
        <style>
            .contentInfo {
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                margin: auto;
                width: 67%;
                height: 319px;
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                align-items: center;
                text-align: center;
            }
            .tittleContent {
                position: relative;
                width: 90%;
                font-size: 33px;
                font-weight: bold;
            }
            .descriptContent {
                position: relative;
                width: 90%;
                font-size: 33px;
            }
            .btn_volver {
                padding: 20px;
                font-size: 20px;
                background: #f64316;
                color: #ffff;
                border-radius: 23px;
            }
            body {
                -webkit-touch-callout: none;                /* prevent callout to copy image, etc when tap to hold */
                -webkit-text-size-adjust: none;             /* prevent webkit from resizing text to fit */
                -webkit-user-select: none;                  /* prevent copy paste, to allow, change 'none' to 'text' */
                background-color:#fff;
                font-family:'HelveticaNeue-Light', 'HelveticaNeue', Helvetica, Arial, sans-serif;
                height:100%;
                margin:0px;
                padding:0px;
                width:100%;
            }
        </style>
    </head>
    <body>
        <div class="contentInfo">
            <div class="tittleContent">
                Confirmación.
            </div>
            <div class="descriptContent">
                Hola <?php echo $datos["x_customer_name"]; ?>  Tu solicitud ha sido <?php echo $datos["x_respuesta"]; ?>
            </div>
            <div class="btn_volver">
                <span>Volver a la aplicación</span>
            </div>
        </div>
        <script type="text/javascript"  async="async" >
            var btn = document.querySelector(".btn_volver");
            console.log(btn);
            btn.addEventListener("click", function () {
<?php // if ($dat["usuario"]) {     ?>
<?php if ($continuar) { ?>
                    //                    window.open("https://play.google.com/store/apps/details?id=com.movilmove.movilmove_netcar");
                    window.history.go(-3);
<?php } else { ?>
                    //                    window.open("https://play.google.com/store/apps/details?id=com.movilmove.movilmove_netcar_driver");
                    window.history.go(-2);
<?php } ?>
                //                window.open("http://localhost:8383/movilmove_driver/index.html#f_recargas", "_self");
                //                window.open("https://play.google.com/store/apps/details?id=com.movilmove.driver");
            });
        </script>
    </body>
</html>
<?php
// } ?>