<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (session_id() == "") {
//    ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$dbd = NWDatabase::database();
$ca = new NWDbQuery($dbd);
$ca->cleanHtml = false;
$si = session::getInfo();
$cb = new NWDbQuery($dbd);
$cc = new NWDbQuery($dbd);
$cf = new NWDbQuery($dbd);
$cg = new NWDbQuery($dbd);
$ch = new NWDbQuery($dbd);
$ci = new NWDbQuery($dbd);
$cj = new NWDbQuery($dbd);
$ck = new NWDbQuery($dbd);
$cl = new NWDbQuery($dbd);
$cm = new NWDbQuery($dbd);

function buscaTarea($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("tareas_diarias", "*", "id=:id");
    $ca->bindValue(":id", $p);
    if (!$ca->exec()) {
        echo "No se pudo consultar la tarea";
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay tareas";
        return;
    }
    $ca->next();
    global $buscaTarea;
    $buscaTarea = $ca->assoc();
//    return $buscaTarea;
}

function tareas_det($id, $tipo) {
    $db = NWDatabase::database();
    $cl = new NWDbQuery($db);
    $cl->prepareInsert("tareas_det", "tarea, observaciones, fecha, usuario, tipo");
    $cl->bindValue(":tarea", $id);
    $cl->bindValue(":observaciones", $_POST["respuesta"]);
    $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
    $cl->bindValue(":usuario", $_SESSION["usuario"]);
    $cl->bindValue(":tipo", $tipo);
    if (!$cl->exec()) {
        echo "errores line 71: " . $cl->lastErrorText();
        return;
    }
}

function tareas_diarias_movs($accion, $id) {
    $db = NWDatabase::database();
    $cc = new NWDbQuery($db);
    $cc->prepareInsert("tareas_diarias_movs", "fecha, id_tarea, accion, usuario, empresa,leido");
    $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
    $cc->bindValue(":id_tarea", $id);
    $cc->bindValue(":accion", $accion);
    $cc->bindValue(":usuario", $_SESSION["usuario"]);
    $cc->bindValue(":empresa", $_SESSION["empresa"]);
    $cc->bindValue(":leido", "NO");
    if (!$cc->exec()) {
        echo "errores line 87. " . $cc->lastErrorText();
        return;
    }
}

function nwtask_adjuntos($id) {
    if ($_POST["adjunto"] != "") {
        $db = NWDatabase::database();
        $cg = new NWDbQuery($db);
        $cg->prepareInsert("nwtask_adjuntos", "fecha, id_relation, nombre, usuario, empresa");
        $cg->bindValue(":fecha", date("Y-m-d H:i:s"));
        $cg->bindValue(":id_relation", $id);
        $cg->bindValue(":nombre", $_POST["adjunto"]);
        $cg->bindValue(":usuario", $_SESSION["usuario"]);
        $cg->bindValue(":empresa", $_SESSION["empresa"]);
        if (!$cg->exec()) {
            echo "errores line 103. " . $cg->lastErrorText();
            return;
        }
    }
}

function creaNotificacion($p, $user, $tipo) {
    $db = NWDatabase::database();
    $ck = new NWDbQuery($db);
    $cj = new NWDbQuery($db);
    $ch = new NWDbQuery($db);
    $ci = new NWDbQuery($db);
    $asunto = "";
    if ($tipo == "nueva") {
        $asunto = "Nueva tarea: " . $_POST["respuesta"];
    }
    if ($tipo == "avances") {
        $asunto = "El usuario " . $_SESSION["usuario"] . " ha hecho un avance en la tarea: " . $_POST["respuesta"] . " <br /> Respuesta: " . $_POST["respuesta"];
    }
    if ($tipo == "devolucion") {
        $asunto = "El usuario " . $_SESSION["usuario"] . " ha devueltvo la tarea: " . $_POST["respuesta"] . " <br /> Respuesta: " . $_POST["respuesta"];
    }
    if ($tipo == "transferencia") {
        $asunto = "El usuario " . $_SESSION["usuario"] . " ha transferido la tarea: " . $_POST["respuesta"] . " <br /> Respuesta: " . $_POST["respuesta"];
    }
    if ($tipo == "finalizado") {
        $asunto = "El usuario " . $_SESSION["usuario"] . " ha finalizado la tarea: " . $_POST["respuesta"] . " <br /> Respuesta: " . $_POST["respuesta"];
    }
    if ($p == 1) {
        $ck->prepareSelect("usuarios", "usuario", "id=:id_user");
        $ck->bindValue(":id_user", $user);
        $ck->exec();
        $ck->next();
        $r_user = $ck->assoc();
        $id_new_user = $r_user["usuario"];
    } else {
        $ck->prepareSelect("tareas_diarias", "usuario,tarea", "id=:id_post");
        $ck->bindValue(":id_post", $_POST["id"]);
        $ck->exec();
        $ck->next();
        $r_user = $ck->assoc();
        $id_new_user = $r_user["usuario"];
    }

//    $cj->prepareSelect("nw_notifications", "max(id) as id");
//    $cj->exec();
//    $cj->next();
//    $r_notifi = $cj->assoc();
//    $id_new_notify = $r_notifi["id"] + 1;
    $id_new_notify = master::getNextSequence("nw_notifications_id_seq", $db);
    $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
    $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ch->bindValue(":usuario", $_SESSION["usuario"]);
    $ch->bindValue(":empresa", $_SESSION["empresa"]);
    $ch->bindValue(":asunto", $asunto);
    $ch->prepare($sqlMovNot);
    if (!$ch->exec()) {
        echo "errores line 160. " . $ch->lastErrorText();
        return;
    }
    $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha, fecha_entrega) 
                                                   values ($id_new_notify, false,  :usuario, :fecha, :fecha_entrega)";
    $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ci->bindValue(":usuario", $id_new_user);
    $ci->bindValue(":fecha_entrega", $_POST["fecha_final"]);
    $ci->prepare($sqlMovNotDet);
    if (!$ci->exec()) {
        echo "errores line 169. " . $ci->lastErrorText();
        return;
    }
}

$avances = "";
if (isset($_POST["avances"])) {
    $avances = $_POST["avances"];
}
$hora_estimada = "";
$minutos_estimados = "";
if (isset($_POST["hora_estimada"])) {
    $hora_estimada = $_POST["hora_estimada"];
}
if (isset($_POST["minutos_estimados"])) {
    $minutos_estimados = $_POST["minutos_estimados"];
}
$users_asigna = $_POST["usuario_asignado"];
for ($i = 0; $i < count($users_asigna); $i++) {
    if (isset($_POST["fecha_final"])) {
        $total_dias_mes = date('t');
        $sobran_dias = 100 - $total_dias_mes;
        $fechaHoy = date("Ymd");
        $fecha_entrega_repacle = str_replace("-", "", $_POST["fecha_final"]);
        $fecha_entrega = $fecha_entrega_repacle;
        $fdias = $fecha_entrega - $fechaHoy;
        if ($fdias > $total_dias_mes & $fdias <= 130) {
            $fdias = $fdias - $sobran_dias;
        } else
        if ($fdias > 130 & $fdias <= 230) {
            $fdias = $fdias - ($sobran_dias * 2);
        }
        if ($fecha_entrega < $fechaHoy) {
            echo "La fecha final no puede ser menor a la fecha de hoy.";
            return;
        }
        if ($fdias > 9) {
            $prioridad = 1;
        } else
        if ($fdias >= 6 & $fdias <= 9) {
            $prioridad = 2;
        } else
        if ($fdias >= 2 & $fdias <= 5) {
            $prioridad = 3;
        } else
        if ($fdias <= 1) {
            $prioridad = 4;
        } else
        if ($fdias < 0) {
            $prioridad = 4;
        }

        $ca->prepareSelect("estado_prioridades", "nombre", "id=:priority");
        $ca->bindValue(":priority", $prioridad);
        $ca->exec();
        $ca->next();
        $r_priority = $ca->assoc();

//        echo "La prioridad según la fecha de entrega es " . $r_priority["nombre"] . ". ";
    }
    if (isset($_POST["estado_hijo"]) && $_POST["estado_hijo"] == 50) {
        $cf->prepareSelect("tareas_diarias", "max(id) as id");
        $cf->exec();
        $cf->next();
        $r_new_id = $cf->assoc();
        $id_new = $r_new_id["id"] + 1;
        $cm->prepareSelect("tareas_diarias", "*", "id=:id");
        $cm->bindValue(":id", $_POST["id"]);
        if (!$cm->exec()) {
            echo "Error al consultar la tarea padre";
            return;
        }
        if ($cm->size() == 0) {
            echo "No existe la tarea padre";
            return;
        }
        $cm->next();
        $taFather = $cm->assoc();
        $projects = "";
        $projectsFields = " ";
        $projectsFieldsOne = " ";
        if ($taFather["proyecto"] != "") {
            $projectsFields = "proyecto, ";
            $projectsFieldsOne = ":proyecto_padre,";
            $projects = $taFather["proyecto"];
        }
        $sql = "INSERT INTO tareas_diarias (id, tarea, estado, fecha, observaciones, usuario_asignado, fecha_final, hora_final, usuario, prioridad,empresa, leido, $projectsFields tipo, fecha_modificacion, id_padre, publico) 
                                values ($id_new, :asunto, 1, :fecha_creacion, :asunto_padre, :usuario_asignado, :fecha_final,:hora, :usuario, $prioridad, :empresa, 'NO', $projectsFieldsOne :tipo_padre, :fecha_creacion, :id_padre, :publico)";
        $ca->bindValue(":id_padre", $_POST["id"]);
        $ca->bindValue(":asunto_padre", $_POST["respuesta"]);
        $ca->bindValue(":fecha_creacion", date("Y-m-d- H:i:s"));
        $ca->bindValue(":proyecto_padre", $projects);
        $ca->bindValue(":publico", $_POST["publico"]);
        $ca->bindValue(":tipo_padre", "tarea");
        $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));

        tareas_det($_POST["id"], "Creación");
        nwtask_adjuntos($id_new);
        tareas_diarias_movs("Tarea Nueva", $id_new);
        if ($users_asigna[$i] != $si["id"]) {
            creaNotificacion(1, $users_asigna[$i], "nueva");
        }
    } else
    if ($_POST["id"] == 0 || $_POST["id"] == "") {
        $cf->prepareSelect("tareas_diarias", "max(id) as id");
        $cf->exec();
        $cf->next();
        $r_new_id = $cf->assoc();
        $id_new = $r_new_id["id"] + 1;
        $sql = "INSERT INTO tareas_diarias (id, tarea, estado, fecha, observaciones, usuario_asignado, fecha_final,hora_final, usuario, prioridad,empresa, leido, proyecto, tipo, fecha_modificacion, repetir, hora_estimada, publico) 
                                values ($id_new, :asunto, 1, :fecha, :respuesta, :usuario_asignado, :fecha_final,:hora, :usuario, $prioridad, :empresa, 'NO', :proyecto, :tipo, :fecha_modificacion, :repetir, :hora_estimada, :publico)";
        $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
        $ca->bindValue(":repetir", $_POST["repetir"]);
        $ca->bindValue(":publico", $_POST["publico"]);
        $ca->bindValue(":hora_estimada", $hora_estimada . ":" . $minutos_estimados);

        tareas_det($id_new, "Creación");
        nwtask_adjuntos($id_new);
        tareas_diarias_movs("Tarea Nueva", $id_new);
        if ($users_asigna[$i] != $si["id"]) {
            creaNotificacion(1, $users_asigna[$i], "nueva");
        }
    } else {
        if ($avances != "") {
            $sql = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
        values (:tarea, :avance, :fecha, :usuario, :tipo)";
            $ca->bindValue(":avance", $_POST["respuesta"]);
            $ca->bindValue(":tarea", $_POST["id"]);
            $ca->bindValue(":tipo", "Avance");

            $cb->prepareUpdate("tareas_diarias", "estado,fecha_modificacion", "id=:id");
            $cb->bindValue(":id", $_POST["id"]);
            $cb->bindValue(":estado", "2");
            $cb->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
            if (!$cb->exec()) {
                echo "errores line 302. " . $cb->lastErrorText();
                return;
            }
            tareas_diarias_movs("Avance", $_POST["id"]);
            if ($users_asigna[$i] != $si["id"]) {
                creaNotificacion(0, 0, "avances");
            }
        } else
        if ($_POST["estado"] == 4 || $_POST["estado"] == 12) {
            $sql = "UPDATE tareas_diarias SET estado=:estado,usuario_asignado=:usuario_asignado_devuelto,usuario=:usuario,fecha_modificacion=:fecha_modificacion WHERE id=:id";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));

            $estadoAvance = "Devolución";
            if ($_POST["estado"] == 12) {
                $estadoAvance = "Devuelta y todavía en proceso";
            }
            tareas_det($_POST["id"], $estadoAvance);
            tareas_diarias_movs("Devolución", $_POST["id"]);
            if ($users_asigna[$i] != $si["id"]) {
                creaNotificacion(0, 0, "devolucion");
            }
        } else if ($_POST["estado"] == 5) {
            $sql = "UPDATE tareas_diarias SET estado=:estado,usuario_asignado=:usuario_asig_transfer,usuario=:usuario,fecha_modificacion=:fecha_modificacion WHERE id=:id";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));

            tareas_det($_POST["id"], "Transferencia");
            tareas_diarias_movs("Transferencia", $_POST["id"]);
            if ($users_asigna[$i] != $si["id"]) {
                creaNotificacion(0, 0, "transferencia");
            }
        } else if ($_POST["estado"] == 3) {
            $sql = "UPDATE tareas_diarias SET estado=:estado,fecha_cierre=:cierre,fecha_modificacion=:fecha_modificacion WHERE tarea=:tarea and fecha=:fecha_creacion";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":cierre", date("Y-m-d H:i:s"));
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
            buscaTarea($_POST["id"]);
            $ca->bindValue(":tarea", $buscaTarea["tarea"]);
            $ca->bindValue(":fecha_creacion", $buscaTarea["fecha"]);

            tareas_det($_POST["id"], "Finalizado");
            tareas_diarias_movs("Finalizado", $_POST["id"]);
            if ($users_asigna[$i] != $si["id"]) {
                creaNotificacion(0, 0, "finalizado");
            }
        } else {
            $sql = "UPDATE tareas_diarias SET estado=:estado,fecha_modificacion=:fecha_modificacion WHERE id=:id";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));

            tareas_det($_POST["id"], "Detenido");
            tareas_diarias_movs("Cambio de Estado", $_POST["id"]);
        }
        nwtask_adjuntos($_POST["id"]);
    }
//CONSULTO AL USUARIO EN TAREAS Y EN USUARIOS PARA TOMAR EL MAIL Y NOMBRE
    if ($_POST["id"] == 0) {
        $usuario_tarea = $users_asigna[$i];
        $tipo_busqueda = "id";
    } else {
        $ca->prepareSelect("tareas_diarias", "*,func_concepto(estado, 'estados_tareas_diarias') as estado_text,
                                        func_concepto(prioridad, 'estado_prioridades') as prioridad_text", "id=:id");
        $ca->bindValue(":id", $_POST["id"]);
        if (!$ca->exec()) {
            echo "Error al traer la tarea!";
            return;
        }
        if ($ca->size() == 0) {
            if ($_POST["id"] == 0) {
                
            } else {
                echo "no hay tareas con ese id.";
                return;
            }
        }
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            $usuario_tarea = $r["usuario"];
            $tipo_busqueda = "usuario";
        }
    }
    $ce = new NWDbQuery($dbd);
    $ce->prepareSelect("usuarios", "id,nombre,email", "$tipo_busqueda=:usuario");
    $ce->bindValue(":usuario", $usuario_tarea);
    $ce->exec();
    if ($ce->size() != 0) {
        $ce->next();
        $r_us = $ce->assoc();
    }
//USUARIO TRANSFERIDO
    $ca->bindValue(":usuario_asignado_devuelto", $r_us["id"]);
//}
//CAMPOS PARA NUEVO INSERT
    $hora_all = "";
    $resultado = "";
    if (isset($_POST["hora"])) {
        $hora_replace = str_replace("%3A", ":", $_POST["hora"]);
        $hora = $hora_replace;
        $hora_all = $hora;
//        echo $hora_all;
    }

    if (isset($_POST["respuesta"])) {
        $limite = 90;
        $texto = $_POST["respuesta"];
        $texto = substr($texto, 0, $limite);
        $palabras = explode(' ', $texto);
        $resultado = implode(' ', $palabras);
        $resultado .= '...';
    }
//$ca->bindValue(":asunto", $_POST["asunto"]);
    $ca->bindValue(":asunto", $resultado);
    if (isset($_POST["fecha_final"])) {
        $ca->bindValue(":fecha_final", $_POST["fecha_final"]);
    }
    $ca->bindValue(":hora", $hora_all);
    $ca->bindValue(":usuario_asignado", $users_asigna[$i]);
//OTROS DATOS POST
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    if (isset($_POST["estado"])) {
        $ca->bindValue(":estado", $_POST["estado"]);
    }
    $ca->bindValue(":respuesta", $_POST["respuesta"]);
    if (isset($_POST["proyecto"])) {
        $ca->bindValue(":proyecto", $_POST["proyecto"], true, true);
    }
    if (isset($_POST["tipo"])) {
        $ca->bindValue(":tipo", $_POST["tipo"]);
    }
    if (isset($_POST["usuario_asig_transfer"])) {
        $ca->bindValue(":usuario_asig_transfer", $_POST["usuario_asig_transfer"]);
    }
    $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ca->prepare($sql);
    if (!$ca->exec()) {
        echo "Hubo un error, inténtelo nuevamente. Lo sentimos!-- 792. ERROR: " . $ca->lastErrorText() . " QUERY: " . $ca->preparedQuery();
        return;
    } else {
        if ($users_asigna[$i] == $_SESSION["id"]) {
            return;
        }
        $mail = new PHPMailer();
        master::trySendSmtp($mail);
//PARÁMETROS CONEXIÓN
//        $mail->IsSMTP();
//        $mail->Host = 'smtp.gmail.com';
//        $mail->Host = 'smtp.netwoods.net';
//        $mail->Host = 'dist.hostingred.net';
//        $mail->Port = 587;
//        $mail->SMTPSecure = "tls";
//        $mail->SMTPAuth = true;
//        $mail->Username = 'diseno@netwoods.net';
//        $mail->Password = 'test';
//DATOS VARIABLES
        $history = "";
        $historyAll = "";
        if ($_POST["id"] != 0 || $_POST["id"] != "") {
            $chis = new NWDbQuery($dbd);
            $chis->prepareSelect("tareas_det", "*", "tarea=:id order by fecha desc");
            $chis->bindValue(":id", $_POST["id"]);
            if (!$chis->exec()) {
                echo "Error al consultar el historial";
            }
            $totalHistory = $chis->size();
            if ($totalHistory != 0) {
                for ($hi = 0; $hi < $totalHistory; $hi++) {
                    $chis->next();
                    $rr = $chis->assoc();
                    $history .= "<div class='div_avance'><b>" . $rr["fecha"] . "</b> <span>" . $rr["tipo"] . "</span> <b>" . $rr["usuario"] . "</b> <p>" . $rr["observaciones"] . "</p></div>";
                }
            }
        }
        if ($history != "") {
            $historyAll = "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><h3>Histórico</h3> $history </div><br /><br />";
        }

        if ($_POST["id"] == 0) {
            $titulo = "Tarea Nueva.";
            $tipo_mail = "ha creado una tarea nueva ";
        } else
        if (isset($_POST["avances"]) != "") {
            $titulo = "Registro de Avances en tarea.";
            $tipo_mail = "ha registrado avances en una tarea pendiente de ";
        } else
        if ($_POST["estado"] == 3) {
            $titulo = "Tarea Finalizada!";
            $tipo_mail = "ha finalizado una tarea pendiente de ";
        } else
        if ($_POST["estado"] == 4) {
            $titulo = "Tarea Devuelta!";
            $tipo_mail = "ha devuelto una tarea asignada ";
        } else
        if ($_POST["estado"] == 5) {
            $titulo = "Tarea Transferida!";
            $tipo_mail = "ha transferido una tarea asignada ";
        } else
        if ($_POST["estado"] == 50) {
            $titulo = "Sub-Tarea!";
            $tipo_mail = "ha creado una sub tarea ";
        } else {
            $titulo = "Cambio de Estado en Tarea Asignada";
            $tipo_mail = "ha realizado un cambio de estado en tarea asignada";
        }
        if (isset($_POST["estado"]) && $_POST["estado"] == 5) {
            $remitente_nombre = $_SESSION["nombre"];
            $remitente_email = $_SESSION["email"];
            $destinatario_nombre = $r_us["nombre"];
            $destinatario_email = $r_us["email"];

            $asunto_ = $r["tarea"];
            $observaciones = $r["observaciones"];
            $estado_ = $r["estado_text"];
            $fecha_entrega_ = $r["fecha_final"];
            $prioridad_ = $r["prioridad_text"];
        } else
        if (isset($_POST["id"]) && $_POST["id"] == 0) {
            $remitente_nombre = $_SESSION["nombre"];
            $remitente_email = $_SESSION["email"];
            $destinatario_nombre = $r_us["nombre"];
            $destinatario_email = $r_us["email"];

            $asunto_ = $resultado;
            $observaciones = $_POST["respuesta"];
            $estado_ = "Nuevo";
            $fecha_entrega_ = $_POST["fecha_final"];
            $prioridad_ = $r_priority["nombre"];
        } else {
            $remitente_nombre = $_SESSION["nombre"];
            $remitente_email = $_SESSION["email"];
            $destinatario_nombre = $r_us["nombre"];
            $destinatario_email = $r_us["email"];

            $asunto_ = $r["tarea"];
            $observaciones = $r["observaciones"];
            $estado_ = $r["estado_text"];
            $fecha_entrega_ = $r["fecha_final"];
            $prioridad_ = $r["prioridad_text"];
        }
        $terminal = $_SESSION["nom_terminal"];
        $empresa = $_SESSION["nom_empresa"];
        $fecha = date("Y-m-d H:i:s");
        $user = $_SESSION["usuario"];
//BODY CUERPO MENSAJE
        $body = "<div style='padding: 1px;max-width: 100%;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #ec534d;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
        $body .= "$titulo.  para  $destinatario_nombre<br />";
        $body .= "</div>";
        $body .= "<div style='padding: 5px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 5px;background: #f1f1f1;color: #666;'>";
        $body .= "<h2 style='font-weight: lighter;font-size: 16px;'>El usuario <b>$remitente_nombre</b> $tipo_mail para $destinatario_nombre de la empresa <b>$empresa.</b> Con el estado: <b>" . $estado_ . "</b></h2><br/>";
        $body .= "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><b>Tarea: </b>" . $observaciones . "<br /></div><br /><br />";
        $body .= "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><b>Comentario: </b>" . $_POST["respuesta"] . "<br /></div><br /><br />";
        $body .= " $historyAll ";
        $body .= "<b>Asignado a: </b>$destinatario_nombre<br />";
        $body .= "<b>Estado: </b>" . $estado_ . "<br />";
        $body .= "<b>Fecha: </b>$fecha<br />";
        $body .= "<b>Fecha de entrega: </b>" . $fecha_entrega_ . "<br />";
        $body .= "<b>prioridad: </b>" . $prioridad_ . "<br />";
        $body .= "<b>Terminal: </b>$terminal<br />";
        $body .= "<b>Email Usuario: </b>$destinatario_email<br />";
        $body .= "<b>Nombre Usuario creador: </b>$remitente_nombre<br />";
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
        $mail->AddAddress($destinatario_email, $destinatario_nombre);
//RESPONDER A
        $mail->AddReplyTo($remitente_email, $remitente_nombre);
//CC OCULTA
//        $mail->AddBCC("orionjafe@hotmail.com");
//        $mail->AddBCC("assdres@hotmail.com");
//ADJUNTO
        if ($_POST["adjunto"] != "") {
            $archivo = $_POST["adjunto"];
            $mail->AddAttachment($archivo, $archivo);
        }
//TÍTULO MAIL
        $mail->Subject = "NW Mail: $titulo de $remitente_nombre";
        $mail->AltBody = "Mensaje reenviado de contacto nwsites";
        $mail->MsgHTML($body);
        if (!$mail->Send()) {
            echo "Tarea creada exitosamente pero tuvimos un problema, No se envió el correo!Posiblemente el usuario no tiene configurado el correo o no está disponible NW Mail en el servidor.";
        }
        /*         * ENVIO DE CORREO* */
    }
}
?>
