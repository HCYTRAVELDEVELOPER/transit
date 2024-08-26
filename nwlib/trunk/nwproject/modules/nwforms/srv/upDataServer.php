<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

function compruebaRegistro($fecha, $id_session, $id_enc) {
    //DEBO COMPROBAR SI EL REGISTRO EXISTE POR LA FECHA, HORA, ID_SESSION Y SI EXISTE EL USUARIO
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwforms_respuestas_users_enc", "id", "id_enc=:id_enc and fecha=:fecha and id_session=:id_session ");
    $ca->bindValue(":fecha", $fecha);
    $ca->bindValue(":id_session", $id_session);
    $ca->bindValue(":id_enc", $id_enc);
    if (!$ca->exec()) {
        return "Error " . $ca->lastErrorText();
    }
    if ($ca->size() == 0) {
        return false;
    }
    $r = $ca->flush();
    return $r["id"];
}

if (isset($_POST["master"])) {
    if (count($_POST["master"]) > 0) {
        foreach ($_POST["master"] as $ra) {
            $id_session = session_id();
            $date_last_sync = date("Y-m-d H:i:s");
            $timestamp = $ra["date_insert_db"];
            $id_update = "";
            $id_enc = $_POST["id_form"];
            //COMPRUEBO QUE EXISTA EL REGISTRO, SI EXISTE NO continúo
            $validate = compruebaRegistro($timestamp, $id_session, $id_enc);
            if ($validate == false) {
                $insert = true;
            } else {
                $insert = false;
                $id_update = $validate;
                $session = $validate;
            }
            $db = NWDatabase::database();
            $db->transaction();
            $ca = new NWDbQuery($db);
            $cb = new NWDbQuery($db);

            //INSERTO EL ENCABEZADO
            $fields = "id_enc,fecha,sync,id_session";
            //MIRO SI EXISTE EL USER 
            if (isset($_SESSION["usuario"])) {
                $fields .= ",usuario";
            }
            //SACO EL ÚLTIMO ID, SI NO HAY REGISTROS QUEDA COMO 1 ($session), esto para relacionar las respuestas con el encabezado
            if ($insert == true) {
                $fields .= ",id";
                $session = 1;
                $cb->prepareSelect("nwforms_respuestas_users_enc", "id", "1=1 order by id desc limit 1");
                if (!$cb->exec()) {
                    $db->rollback();
                    echo "Error " . $cb->lastErrorText();
                    return;
                }
                if ($cb->size() > 0) {
                    $cb->next();
                    $r = $cb->assoc();
                    $session = $r["id"] + 1;
                }
                $cb->prepareInsert("nwforms_respuestas_users_enc", $fields);
            } else {
                $fields .= ",date_last_sync";
                $cb->prepareUpdate("nwforms_respuestas_users_enc", $fields, "id=:id");
                $cb->bindValue(":date_last_sync", $date_last_sync);
            }
            $cb->bindValue(":id", $session);
            $cb->bindValue(":id_enc", $id_enc);
            $cb->bindValue(":fecha", $timestamp);
            $cb->bindValue(":sync", "SI");
            $cb->bindValue(":id_session", $id_session);
            //MIRO SI EXISTE EL USER 
            if (isset($_SESSION["usuario"])) {
                $cb->bindValue(":usuario", $_SESSION["usuario"]);
            }
            if (!$cb->exec()) {
                $db->rollback();
                echo "Error " . $cb->lastErrorText();
                return;
            }
            //REVISO LOS CAMPOS A INSERTAR
            if (count($ra) > 0) {
                $fields_d = "campo,respuesta,fecha,id_enc,enc_user,sync,id_session";
                if (isset($_SESSION["usuario"])) {
                    $fields_d .= ",usuario";
                }
                foreach ($ra as $x) {
                    //EXTRAIGO NOMBRE DEL CAMPO, KEY SACA EL NOMBRE DEL ARRAY
                    $campo = key($ra);
                    //NO INSERTO EL ID DE LA TABLA INDEXEDDB
                    if ($campo != "id" && $campo != "date_insert_db") {
                        //.. NO RECUERDO...
                        next($ra);
                        //EXTRAIGO EL VALOR DEL ARRAY
                        $respuesta = $x;
                        if ($insert == true) {
                            $ca->prepareInsert("nwforms_respuestas_users", $fields_d);
                        } else {
                            $fields_d .= ",date_last_sync";
                            $ca->prepareUpdate("nwforms_respuestas_users", $fields_d, "enc_user=:enc_user");
                            $ca->bindValue(":date_last_sync", $date_last_sync);
                        }
                        $ca->bindValue(":campo", $campo);
                        $ca->bindValue(":respuesta", $respuesta);
                        $ca->bindValue(":id_enc", $id_enc);
                        $ca->bindValue(":fecha", $timestamp);
                        $ca->bindValue(":enc_user", $session);
                        $ca->bindValue(":sync", "SI");
                        $ca->bindValue(":id_session", $id_session);
                        if (isset($_SESSION["usuario"])) {
                            $ca->bindValue(":usuario", $_SESSION["usuario"]);
                        }
                        if (!$ca->exec()) {
                            $db->rollback();
                            echo "Error " . $ca->lastErrorText();
                            return;
                        }
                    } else {
                        next($ra);
                    }
                }
            }
        }
    }
}
$db->commit();
?>
