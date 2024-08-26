<?php

if (isset($correo) && isset($nombre)) {
    $db = NWDatabase::database();
    $cau = new NWDbQuery($db);
    $id_enc = $_POST["id_enc"];
    $cau->prepareSelect("nwforms_autocontestador", "body,responder_a_email,responder_a_nombre,asunto", "id_form=:id_form and activo='SI' ");
    $cau->bindValue(":id_form", $id_enc);
    if (!$cau->exec()) {
        nwMaker::error($cau->lastErrorText(), true);
        print json_encode($cau->lastErrorText());
        return false;
    }
    if ($cau->size() > 0) {
        $page = str_replace("www.", "", $_SERVER["HTTP_HOST"]);
        $r_aut = $cau->flush();
        $fecha = date("Y-m-d H:i:s");
        $bodyForm = $r_aut["body"];
        $bodyForm = str_replace("{nombre}", $nombre, $bodyForm);
        $bodyForm = str_replace("{correo}", $correo, $bodyForm);

        $xa = false;
        $cliente_nws = false;
        $cleanHtml = true;
        $fromEmail = false;
        $fromName = false;
        $asunto = "Gracias por escribirnos en {$page}";
        if ($r_aut["responder_a_email"] != null && $r_aut["responder_a_email"] != "" && $r_aut["responder_a_email"] != "0")
            $fromEmail = $r_aut["responder_a_email"];
        if ($r_aut["responder_a_nombre"] != null && $r_aut["responder_a_nombre"] != "" && $r_aut["responder_a_nombre"] != "0")
            $fromName = $r_aut["responder_a_nombre"];
        if ($r_aut["asunto"] != null && $r_aut["asunto"] != "" && $r_aut["asunto"] != "0")
            $asunto = $r_aut["asunto"];
        $paraEmail = $correo;
        $paraNombre = $nombre;
        $titleEncBody = $asunto;
        $textBody = $bodyForm;
        $n = nw_configuraciones::sendEmail($paraEmail, $paraNombre, $asunto, $titleEncBody, $textBody, $cliente_nws, $xa, $cleanHtml, $fromName, $fromEmail);
        if ($n !== true) {
            nwMaker::error("Error " . json_encode($n), true);
//            print json_encode("Error " . $n);
//            return false;
        }
    }
}