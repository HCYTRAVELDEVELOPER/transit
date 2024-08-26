<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$db = NWDatabase::database();
$id_session = session_id();
$db->transaction();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cd = new NWDbQuery($db);

$fields = "nombre,enviar_mail";
$getRecaptha = false;
if (isset($_POST["data_g"]) && isset($_POST["contain_captcha"])) {
    $fields .= ",secretKey_reCAPTCHA";
    $getRecaptha = true;
}
$_POST["id_enc"] = master::clean($_POST["id_enc"]);
$_POST["fecha_insert"] = master::clean($_POST["fecha_insert"]);
$id_enc = $_POST["id_enc"];
$timestamp = $_POST["fecha_insert"];
$session = "";
$cd->prepareSelect("nwforms_enc", $fields, "id=:id_form");
$cd->bindValue(":id_form", $id_enc);
if (!$cd->exec()) {
    $db->rollback();
    nwMaker::error($cd->lastErrorText(), true);
    print json_encode($cd->lastErrorText());
    return false;
}
if ($cd->size() > 0) {
//    $cd->next();
//    $r_form = $cd->assoc();
    $r_form = $cd->flush();
}

if ($getRecaptha === true) {
    require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib6/nwproject/modules/nwforms/recaptchalib.php";
    $secret = $r_form["secretKey_reCAPTCHA"];
    $response = null;
    $reCaptcha = new ReCaptcha($secret);
    if ($_POST["data_g"]) {
        $response = $reCaptcha->verifyResponse($_SERVER["REMOTE_ADDR"], $_POST["data_g"]);
    }
    if ($response != null && $response->success) {
        
    } else {
        nwMaker::error("reCAPTCHA_invalido", true);
        print json_encode("reCAPTCHA_invalido");
        return;
    }
}

$cb->prepareSelect("nwforms_respuestas_users_enc", "id", "1=1 order by id desc limit 1");
if (!$cb->exec()) {
    $db->rollback();
    nwMaker::error("Error " . $cb->lastErrorText(), true);
    print json_encode("Error " . $cb->lastErrorText());
    return false;
}
if ($cb->size() > 0) {
    $cb->next();
    $r = $cb->assoc();
    $session = $r["id"] + 1;
} else {
    $session = 1;
}
//INSERTO EL ENCABEZADO
$fields = "id,id_enc,fecha,sync,id_session,url,usuario";

$usuario = "N/A";
if (isset($_SESSION["usuario"])) {
    $usuario = $_SESSION["usuario"];
}
$url = "N/A";
if (isset($_POST["url"])) {
    $url = $_POST["url"];
}
$id_relational = "";
if (isset($_POST["id_relational"])) {
    $fields .= ",id_relational";
    $id_relational = $_POST["id_relational"];
}
$cb->prepareInsert("nwforms_respuestas_users_enc", $fields);
$cb->bindValue(":id", $session);
$cb->bindValue(":id_enc", $id_enc);
$cb->bindValue(":fecha", $timestamp);
$cb->bindValue(":sync", "SI");
$cb->bindValue(":id_session", $id_session);
$cb->bindValue(":url", $url);
$cb->bindValue(":usuario", $usuario, true, true);
$cb->bindValue(":id_relational", $id_relational, true, true);
if (!$cb->exec()) {
    $db->rollback();
    print json_encode("Error " . $cb->lastErrorText());
    return false;
}
if (isset($_POST["array"])) {
    if (count($_POST["array"]) > 0) {
        foreach ($_POST["array"] as $ra) {
            if (!isset($ra["campo"])) {
                continue;
            }
            if (!isset($ra["respuesta"])) {
                continue;
            }
            $name = "";
            if (isset($ra["name"])) {
                $name = $ra["name"];
            }
            $ra["campo"] = master::clean($ra["campo"]);
            $ra["respuesta"] = master::clean($ra["respuesta"]);

            if (strtolower($ra["campo"]) == "calificaciongeneral" || $name === "calificaciongeneral") {
                $calificaciongeneral = $ra["respuesta"];
            }

            if (strtolower($ra["campo"]) == "nombre" || $name === "nombre") {
                $nombre = $ra["respuesta"];
            } else
            if (strtolower($ra["campo"]) == "name" || $name === "name") {
                $nombre = $ra["respuesta"];
            }
            if (strtolower($ra["campo"]) == "correo" || $name === "correo") {
                $correo = $ra["respuesta"];
            } else
            if (strtolower($ra["campo"]) == "email" || $name === "email") {
                $correo = $ra["respuesta"];
            } else
            if (strtolower($ra["campo"]) == "e-mail" || $name === "e-mail") {
                $correo = $ra["respuesta"];
            } else
            if (strtolower($ra["campo"]) == "mail" || $name === "mail") {
                $correo = $ra["respuesta"];
            }

            $typeData = null;
            if (isset($ra["typeData"])) {
                $typeData = $ra["typeData"];
            }
            $rev_label = null;
            if (isset($ra["rev_label"])) {
                $rev_label = $ra["rev_label"];
            }
            $rev_orden = null;
            if (isset($ra["rev_label"])) {
                $rev_orden = $ra["rev_orden"];
            }

            $fields_d = "campo,respuesta,fecha,id_enc,enc_user,sync,id_session,typeData,id_pregunta,name_submit,rev_label,rev_orden";
            if (isset($_SESSION["usuario"])) {
                $fields_d .= ",usuario";
            }
            $ca->prepareInsert("nwforms_respuestas_users", $fields_d);
            $ca->bindValue(":campo", $ra["campo"]);
            $ca->bindValue(":respuesta", $ra["respuesta"]);
            $ca->bindValue(":id_enc", $id_enc);
            $ca->bindValue(":fecha", $timestamp);
            $ca->bindValue(":enc_user", $session);
            $ca->bindValue(":sync", "SI");
            $ca->bindValue(":id_session", $id_session);
            $ca->bindValue(":usuario", $usuario, true, true);
            $ca->bindValue(":typeData", $typeData, true, true);
            $ca->bindValue(":id_pregunta", $ra["id_pregunta"], true, true);
            $ca->bindValue(":name_submit", $name, true, true);
            $ca->bindValue(":rev_label", $rev_label, true, true);
            $ca->bindValue(":rev_orden", $rev_orden, true, true);
            if (!$ca->exec()) {
                $db->rollback();
                nwMaker::error("Error " . $ca->lastErrorText(), true);
                print json_encode("Error " . $ca->lastErrorText());
                return false;
            }
        }
    }
}
//if (isset($nombre)) {
//    $cb->prepareUpdate("nwforms_respuestas_users_enc", "nombre", "id=:id");
//    $cb->bindValue(":id", $session);
//    $cb->bindValue(":nombre", $nombre);
//    if (!$cb->exec()) {
//        $db->rollback();
//        print json_encode("Error " . $cb->lastErrorText());
//        return false;
//    }
//}
//if (isset($calificaciongeneral)) {
//    $cb->prepareUpdate("nwforms_respuestas_users_enc", "calificacion_general", "id=:id");
//    $cb->bindValue(":id", $session);
//    $cb->bindValue(":calificacion_general", $calificaciongeneral);
//    if (!$cb->exec()) {
//        $db->rollback();
//        print json_encode("Error " . $cb->lastErrorText());
//        return false;
//    }
//}

$db->commit();
if ($r_form["enviar_mail"] == "SI") {
    require_once dirname(__FILE__) . '/srv/mail.php';
}
if (isset($correo) && isset($nombre)) {
    require_once dirname(__FILE__) . '/srv/autocontestador.php';
}
print json_encode("");
return true;
