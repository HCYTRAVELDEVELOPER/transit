<?php

$protocolo = nwMaker::protocoloHTTPS();
$page = $_SERVER["HTTP_HOST"];
$fecha = date("Y-m-d H:i:s");
$name = "";
$bodyForm = "";
$sum = 0;
if (isset($_POST["array"])) {
    if (count($_POST["array"]) > 0) {
        foreach ($_POST["array"] as $rb) {
            if (isset($rb["campo"])) {
                $rb["respuesta"] = master::clean($rb["respuesta"]);
                $respuesta = $rb["respuesta"];
                $typeData = null;
                if (isset($ra["typeData"])) {
                    $typeData = $ra["typeData"];
                }
                if ($typeData == "uploader") {
//                    $extension = getExtension($respuesta);
//                    if ($extension == "jpg" || $extension == "png" | $extension == "gif" || $extension == "pdf" || $extension == "doc" || $extension == "docx" || $extension == "xls" || $extension == "xlsx") {
                    $respuesta = "<a href='{$protocolo}://" . $_SERVER["HTTP_HOST"] . $rb["respuesta"] . "'>http://" . $_SERVER["HTTP_HOST"] . $rb["respuesta"] . "</a>";
//                    }
                }
                $bodyForm .= "<p><strong>{$rb["campo"]}</strong>: {$respuesta}</p>";
                if ($sum === 0) {
                    $name = $rb["respuesta"];
                }
                $sum++;
            }
        }
    }
}
$titleEnc = "Formulario {$r_form["nombre"]} diligenciado en $page por {$name}";
$asunto = "NwForm {$r_form["nombre"]} por {$name} en $page";

$db = NWDatabase::database();
$cc = New NWDbQuery($db);
$cc->prepareSelect("nwforms_destinatarios", "nombre,correo", "id_form=:id_form");
$cc->bindValue(":id_form", $id_enc);
if (!$cc->exec()) {
    $db->rollback();
    nwMaker::error($cc->lastErrorText(), true);
    $r = NWJSonRpcServer::error($cc->lastErrorText());
    print json_encode($r);
    return false;
}
$xa = false;
$cliente_nws = false;
$cleanHtml = false;
$fromEmail = false;
$fromName = false;

//$fromName = "info@gruponw.com";
//$fromEmail = "info@gruponw.com";

$titleEncBody = $asunto;
$textBody = $bodyForm;
if ($cc->size() > 0) {
    for ($i = 0; $i < $cc->size(); $i++) {
        $r_us = $cc->flush();
        $paraEmail = $r_us["correo"];
        $paraNombre = $r_us["nombre"];

        $a = Array();
//        $a["celular"] = null;
//        $a["send_sms"] = false;
        $a["cleanHtml"] = true;
//        $a["fromName"] = $pl["enviado_desde_nombre"];
//        $a["fromEmail"] = $pl["enviado_desde_correo"];
//        $a["correo_usuario_recibe"] = $atiende;
        $a["destinatario"] = $paraEmail;
        $a["titleMensaje"] = $asunto;
        $a["body"] = $textBody;
//        $a["body_email"] = $body;
        $a["tipo"] = "contact";
        $a["link"] = null;
        $a["modo_window"] = "popup";
        $a["fechaAviso"] = date("Y-m-d H:i:s");
//        $a["tipoAviso"] = "asesor";
        $a["sendEmail"] = true;
//        $a["id_objetivo"] = $id;
//        $a["usuario_envia"] = $correo;
//        $a["izquierda_nomostrar_despues_de"] = "3";
        $a["sendNotifyPush"] = false;
        $a["insertaEnTabla"] = false;
//        $a["terminal"] = $estado["terminal"];
//        $n = nwMaker::notificacionNwMaker($a);
        $n = nw_configuraciones::sendEmail($paraEmail, $paraNombre, $asunto, $titleEncBody, $textBody, $cliente_nws, $xa, $cleanHtml, $fromName, $fromEmail);
        if ($n !== true) {
            $db->rollback();
            nwMaker::error("Error " . json_encode($n), true);
            print json_encode($n);
            return false;
        }
    }
}