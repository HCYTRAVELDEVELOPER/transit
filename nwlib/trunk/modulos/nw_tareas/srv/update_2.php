<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/nwlib/PHPMailer/class.phpmailer.php";
}
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
$avances = "";
if (isset($_POST["avances"])) {
    $avances = $_POST["avances"];
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
//            echo "La fecha final no puede ser menor a la fecha de hoy.";
//            return;
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

        echo "La prioridad según la fecha de entrega es " . $r_priority["nombre"] . ". ";
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
//        print_r($taFather);
        $projects = "";
        $projectsFields = " ";
        $projectsFieldsOne = " ";
        if ($taFather["proyecto"] != "") {
            $projectsFields = "proyecto, ";
            $projectsFieldsOne = ":proyecto_padre,";
            $projects = $taFather["proyecto"];
        }
//        $id_new = master::getNextSequence("tareas_diarias_id_seq");
        $sql = "INSERT INTO tareas_diarias (id, tarea, estado, fecha, observaciones, usuario_asignado, fecha_final, hora_final, usuario, prioridad,empresa, leido, $projectsFields tipo, fecha_modificacion, id_padre) 
                                values ($id_new, :asunto, 1, :fecha_creacion, :asunto_padre, :usuario_asignado, :fecha_final,:hora, :usuario, $prioridad, :empresa, 'NO', $projectsFieldsOne :tipo_padre, :fecha_creacion, :id_padre)";
        $ca->bindValue(":id_padre", $_POST["id"]);
        $ca->bindValue(":asunto_padre", $_POST["respuesta"]);
        $ca->bindValue(":fecha_creacion", date("Y-m-d- H:i:s"));
        $ca->bindValue(":proyecto_padre", $projects);
        $ca->bindValue(":tipo_padre", "tarea");

        $sqlDetAll = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
                                          values (:tarea, :avance, :fecha, :usuario, :tipo)";
        $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
        $cl->bindValue(":usuario", $_SESSION["usuario"]);
//        $cl->bindValue(":tarea", $id_new);
        $cl->bindValue(":tarea", $_POST["id"]);
        $cl->bindValue(":avance", $_POST["respuesta"]);
        $cl->bindValue(":tipo", "Creación");
        $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
        $cl->prepare($sqlDetAll);
        if (!$cl->exec()) {
            echo "errores";
            return;
        }
        $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa, leido) 
                                        values (:fecha, :id_padre, 'Tarea Nueva', :usuario, :empresa, 'NO')";
//        $cc->bindValue(":id_padre", $id_new);
        $cc->bindValue(":id_padre", $_POST["id"]);
        $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
        $cc->bindValue(":usuario", $_SESSION["usuario"]);
        $cc->bindValue(":empresa", $_SESSION["empresa"]);
        $cc->prepare($sqlMov);
        if (!$cc->exec()) {
            echo "errores";
            return;
        }
        if ($_POST["adjunto"] != "") {
            $sqlAdjunto = "INSERT INTO nwtask_adjuntos (fecha, id_relation, nombre, usuario, empresa) 
                                        values (:fecha, $id_new, :adjunto, :usuario, 1)";
            $cg->bindValue(":adjunto", $_POST["adjunto"]);
            $cg->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cg->bindValue(":usuario", $_SESSION["usuario"]);
            $cg->bindValue(":empresa", $_SESSION["empresa"]);
            $cg->prepare($sqlAdjunto);
            if (!$cg->exec()) {
                echo "errores";
                return;
            }
        }
        //ENVÍO NOTIFICACIÓN A QXNW
        $ck->prepareSelect("usuarios", "usuario", "id=:id_user");
        $ck->bindValue(":id_user", $users_asigna[$i]);
        $ck->exec();
        $ck->next();
        $r_user = $ck->assoc();
        $id_new_user = $r_user["usuario"];

        $cj->prepareSelect("nw_notifications", "max(id) as id");
        $cj->exec();
        $cj->next();
        $r_notifi = $cj->assoc();
        $id_new_notify = $r_notifi["id"] + 1;
        $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
        $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ch->bindValue(":usuario", $_SESSION["usuario"]);
        $ch->bindValue(":empresa", $_SESSION["empresa"]);
        $ch->bindValue(":asunto", $_POST["respuesta"]);
        $ch->prepare($sqlMovNot);
        if (!$ch->exec()) {
            echo "errores";
            return;
        }
        $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
                                                   values ($id_new_notify, false,  :usuario, :fecha)";
        $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ci->bindValue(":usuario", $id_new_user);
        $ci->prepare($sqlMovNotDet);
        if (!$ci->exec()) {
            echo "errores";
            return;
        }
        //FIN ENVÍO NOTIFICACIÓN A QXNW
    } else
    if ($_POST["id"] == 0 || $_POST["id"] == "") {
        $cf->prepareSelect("tareas_diarias", "max(id) as id");
        $cf->exec();
        $cf->next();
        $r_new_id = $cf->assoc();
        $id_new = $r_new_id["id"] + 1;
//        $id_new = master::getNextSequence("tareas_diarias_id_seq");
        $sql = "INSERT INTO tareas_diarias (id, tarea, estado, fecha, observaciones, usuario_asignado, fecha_final,hora_final, usuario, prioridad,empresa, leido, proyecto, tipo, fecha_modificacion) 
                                values ($id_new, :asunto, 1, :fecha, :respuesta, :usuario_asignado, :fecha_final,:hora, :usuario, $prioridad,:empresa, 'NO', :proyecto, :tipo, :fecha_modificacion)";

        $sqlDetAll = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
                                          values (:tarea, :avance, :fecha, :usuario, :tipo)";
        $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
        $cl->bindValue(":usuario", $_SESSION["usuario"]);
        $cl->bindValue(":tarea", $id_new);
        $cl->bindValue(":avance", $_POST["respuesta"]);
        $cl->bindValue(":tipo", "Creación");
        $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
        $cl->prepare($sqlDetAll);
        if (!$cl->exec()) {
            echo "errores";
            return;
        }

        $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa, leido) 
                                        values (:fecha, $id_new, 'Tarea Nueva', :usuario, :empresa, 'NO')";
        $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
        $cc->bindValue(":usuario", $_SESSION["usuario"]);
        $cc->bindValue(":empresa", $_SESSION["empresa"]);
        $cc->prepare($sqlMov);
        if (!$cc->exec()) {
            echo "errores";
            return;
        }
        if ($_POST["adjunto"] != "") {
            $sqlAdjunto = "INSERT INTO nwtask_adjuntos (fecha, id_relation, nombre, usuario, empresa) 
                                        values (:fecha, $id_new, :adjunto, :usuario, 1)";
            $cg->bindValue(":adjunto", $_POST["adjunto"]);
            $cg->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cg->bindValue(":usuario", $_SESSION["usuario"]);
            $cg->bindValue(":empresa", $_SESSION["empresa"]);
            $cg->prepare($sqlAdjunto);
            if (!$cg->exec()) {
                echo "errores";
                return;
            }
        }
        //ENVÍO NOTIFICACIÓN A QXNW
        $ck->prepareSelect("usuarios", "usuario", "id=:id_user");
        $ck->bindValue(":id_user", $users_asigna[$i]);
        $ck->exec();
        $ck->next();
        $r_user = $ck->assoc();
        $id_new_user = $r_user["usuario"];

        $cj->prepareSelect("nw_notifications", "max(id) as id");
        $cj->exec();
        $cj->next();
        $r_notifi = $cj->assoc();
        $id_new_notify = $r_notifi["id"] + 1;
        $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
        $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ch->bindValue(":usuario", $_SESSION["usuario"]);
        $ch->bindValue(":empresa", $_SESSION["empresa"]);
        $ch->bindValue(":asunto", $_POST["respuesta"]);
        $ch->prepare($sqlMovNot);
        if (!$ch->exec()) {
            echo "errores";
            return;
        }
        $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
                                                   values ($id_new_notify, false,  :usuario, :fecha)";
        $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ci->bindValue(":usuario", $id_new_user);
        $ci->prepare($sqlMovNotDet);
        if (!$ci->exec()) {
            echo "errores";
            return;
        }
        //FIN ENVÍO NOTIFICACIÓN A QXNW
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
                echo "errores";
                  return;
            }
            $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa,leido) 
                                        values (:fecha, " . $_POST["id"] . ", 'Avance', :usuario, :empresa, 'NO')";
            $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cc->bindValue(":usuario", $_SESSION["usuario"]);
            $cc->bindValue(":empresa", $_SESSION["empresa"]);
            $cc->prepare($sqlMov);
            if (!$cc->exec()) {
                echo "errores";
                return;
            }
            //ENVÍO NOTIFICACIÓN A QXNW
            $ck->prepareSelect("tareas_diarias", "usuario,tarea", "id=:id_post");
            $ck->bindValue(":id_post", $_POST["id"]);
            $ck->exec();
            $ck->next();
            $r_user = $ck->assoc();
            $id_new_user = $r_user["usuario"];

            $cj->prepareSelect("nw_notifications", "max(id) as id");
            $cj->exec();
            $cj->next();
            $r_notifi = $cj->assoc();
            $id_new_notify = $r_notifi["id"] + 1;
            $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
            $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ch->bindValue(":usuario", $_SESSION["usuario"]);
            $ch->bindValue(":empresa", $_SESSION["empresa"]);
            $ch->bindValue(":asunto", "El usuario " . $_SESSION["usuario"] . " ha hecho un avance en la tarea: " . $r_user["tarea"] . " <br /> Respuesta: " . $_POST["respuesta"]);
            $ch->prepare($sqlMovNot);
            if (!$ch->exec()) {
                echo "errores";
                return;
            }
            $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
                                                   values ($id_new_notify, false,  :usuario, :fecha)";
            $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ci->bindValue(":usuario", $id_new_user);
            $ci->prepare($sqlMovNotDet);
            if (!$ci->exec()) {
                echo "errores";
                return;
            }
            //FIN ENVÍO NOTIFICACIÓN A QXNW
        } else
        if ($_POST["estado"] == 4 || $_POST["estado"] == 12) {
            $sql = "UPDATE tareas_diarias SET estado=:estado,usuario_asignado=:usuario_asignado_devuelto,usuario=:usuario,fecha_modificacion=:fecha_modificacion WHERE id=:id";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
            $estadoAvance = "Devolución";
            if ($_POST["estado"] == 12) {
                $estadoAvance = "Devuelta y todavía en proceso";
            }
            $sqlDetAll = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
                                          values (:tarea, :avance, :fecha, :usuario, :tipo)";
            $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cl->bindValue(":usuario", $_SESSION["usuario"]);
            $cl->bindValue(":tarea", $_POST["id"]);
            $cl->bindValue(":avance", $_POST["respuesta"]);
            $cl->bindValue(":tipo", $estadoAvance);
            $cl->prepare($sqlDetAll);
            if (!$cl->exec()) {
                echo "errores";
                return;
            }
            $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa,leido) 
                                        values (:fecha, " . $_POST["id"] . ", 'Devolución', :usuario, :empresa, 'NO')";
            $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cc->bindValue(":usuario", $_SESSION["usuario"]);
            $cc->bindValue(":empresa", $_SESSION["empresa"]);
            $cc->prepare($sqlMov);
            if (!$cc->exec()) {
                echo "errores";
                return;
            }
            //ENVÍO NOTIFICACIÓN A QXNW
            $ck->prepareSelect("tareas_diarias", "usuario,tarea", "id=:id_post");
            $ck->bindValue(":id_post", $_POST["id"]);
            $ck->exec();
            $ck->next();
            $r_user = $ck->assoc();
            $id_new_user = $r_user["usuario"];

            $cj->prepareSelect("nw_notifications", "max(id) as id");
            $cj->exec();
            $cj->next();
            $r_notifi = $cj->assoc();
            $id_new_notify = $r_notifi["id"] + 1;
            $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
            $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ch->bindValue(":usuario", $_SESSION["usuario"]);
            $ch->bindValue(":empresa", $_SESSION["empresa"]);
            $ch->bindValue(":asunto", "El usuario " . $_SESSION["usuario"] . " ha devueltvo la tarea: " . $r_user["tarea"] . " <br /> Respuesta: " . $_POST["respuesta"]);
            $ch->prepare($sqlMovNot);
            if (!$ch->exec()) {
                echo "errores";
                return;
            }
            $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
                                                   values ($id_new_notify, false,  :usuario, :fecha)";
            $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ci->bindValue(":usuario", $id_new_user);
            $ci->prepare($sqlMovNotDet);
            if (!$ci->exec()) {
                echo "errores";
                return;
            }
            //FIN ENVÍO NOTIFICACIÓN A QXNW
        } else if ($_POST["estado"] == 5) {
            $sql = "UPDATE tareas_diarias SET estado=:estado,usuario_asignado=:usuario_asig_transfer,usuario=:usuario,fecha_modificacion=:fecha_modificacion WHERE id=:id";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));

            $sqlDetAll = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
                                          values (:tarea, :avance, :fecha, :usuario, :tipo)";
            $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cl->bindValue(":usuario", $_SESSION["usuario"]);
            $cl->bindValue(":tarea", $_POST["id"]);
            $cl->bindValue(":avance", $_POST["respuesta"]);
            $cl->bindValue(":tipo", "Transferencia");
            $cl->prepare($sqlDetAll);
            if (!$cl->exec()) {
                echo "errores";
                return;
            }

            $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa,leido) 
                                        values (:fecha, " . $_POST["id"] . ", 'Transferencia', :usuario, :empresa, 'NO')";
            $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cc->bindValue(":usuario", $_SESSION["usuario"]);
            $cc->bindValue(":empresa", $_SESSION["empresa"]);
            $cc->prepare($sqlMov);
            if (!$cc->exec()) {
                echo "errores";
                return;
            }
            //ENVÍO NOTIFICACIÓN A QXNW
            $ck->prepareSelect("tareas_diarias", "usuario,tarea", "id=:id_post");
            $ck->bindValue(":id_post", $_POST["id"]);
            $ck->exec();
            $ck->next();
            $r_user = $ck->assoc();
            $id_new_user = $r_user["usuario"];

            $cj->prepareSelect("nw_notifications", "max(id) as id");
            $cj->exec();
            $cj->next();
            $r_notifi = $cj->assoc();
            $id_new_notify = $r_notifi["id"] + 1;
            $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
            $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ch->bindValue(":usuario", $_SESSION["usuario"]);
            $ch->bindValue(":empresa", $_SESSION["empresa"]);
            $ch->bindValue(":asunto", "El usuario " . $_SESSION["usuario"] . " ha transferido la tarea: " . $r_user["tarea"] . " <br /> Respuesta: " . $_POST["respuesta"]);
            $ch->prepare($sqlMovNot);
            if (!$ch->exec()) {
                echo "errores";
                return;
            }
            $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
                                                   values ($id_new_notify, false,  :usuario, :fecha)";
            $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ci->bindValue(":usuario", $id_new_user);
            $ci->prepare($sqlMovNotDet);
            if (!$ci->exec()) {
                echo "errores";
                return;
            }
            //FIN ENVÍO NOTIFICACIÓN A QXNW
        } else if ($_POST["estado"] == 3) {
//            $sql = "UPDATE tareas_diarias SET estado=:estado,fecha_cierre=:cierre WHERE id=:id";
            $sql = "UPDATE tareas_diarias SET estado=:estado,fecha_cierre=:cierre,fecha_modificacion=:fecha_modificacion WHERE tarea=:tarea and fecha=:fecha_creacion";
//            $ca->prepareUpdate("tareas_diarias", "estado,fecha_cierre", "id=:id and tarea=:asunto");
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":cierre", date("Y-m-d H:i:s"));
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
            buscaTarea($_POST["id"]);
//            echo $buscaTarea["tarea"];
            $ca->bindValue(":tarea", $buscaTarea["tarea"]);
            $ca->bindValue(":fecha_creacion", $buscaTarea["fecha"]);

            $sqlDetAll = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
                                          values (:tarea, :avance, :fecha, :usuario, :tipo)";
            $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cl->bindValue(":usuario", $_SESSION["usuario"]);
            $cl->bindValue(":tarea", $_POST["id"]);
            $cl->bindValue(":avance", $_POST["respuesta"]);
            $cl->bindValue(":tipo", "Finalizado");
            $cl->prepare($sqlDetAll);
            if (!$cl->exec()) {
                echo "errores";
                return;
            }

            $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa,leido) 
                                        values (:fecha, " . $_POST["id"] . ", 'Finalizado', :usuario, :empresa, 'NO')";
            $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cc->bindValue(":usuario", $_SESSION["usuario"]);
            $cc->bindValue(":empresa", $_SESSION["empresa"]);
            $cc->prepare($sqlMov);
            if (!$cc->exec()) {
                echo "errores";
                return;
            }
            //ENVÍO NOTIFICACIÓN A QXNW
            $ck->prepareSelect("tareas_diarias", "usuario,tarea", "id=:id_post");
            $ck->bindValue(":id_post", $_POST["id"]);
            $ck->exec();
            $ck->next();
            $r_user = $ck->assoc();
            $id_new_user = $r_user["usuario"];

            $cj->prepareSelect("nw_notifications", "max(id) as id");
            $cj->exec();
            $cj->next();
            $r_notifi = $cj->assoc();
            $id_new_notify = $r_notifi["id"] + 1;
            $sqlMovNot = "INSERT INTO nw_notifications (id, parte, mensaje, enviado_por, fecha, empresa) 
                                            values ($id_new_notify, 'NW_TAREAS', :asunto, :usuario, :fecha, :empresa)";
            $ch->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ch->bindValue(":usuario", $_SESSION["usuario"]);
            $ch->bindValue(":empresa", $_SESSION["empresa"]);
            $ch->bindValue(":asunto", "El usuario " . $_SESSION["usuario"] . " ha finalizado la tarea: " . $r_user["tarea"] . " <br /> Respuesta: " . $_POST["respuesta"]);
            $ch->prepare($sqlMovNot);
            if (!$ch->exec()) {
                echo "errores";
                return;
            }
            $sqlMovNotDet = "INSERT INTO nw_notifications_det (notificacion, leida, usuario, fecha) 
                                                   values ($id_new_notify, false,  :usuario, :fecha)";
            $ci->bindValue(":fecha", date("Y-m-d H:i:s"));
            $ci->bindValue(":usuario", $id_new_user);
            $ci->prepare($sqlMovNotDet);
            if (!$ci->exec()) {
                echo "errores";
                return;
            }
            //FIN ENVÍO NOTIFICACIÓN A QXNW
        } else {
            $sql = "UPDATE tareas_diarias SET estado=:estado,fecha_modificacion=:fecha_modificacion WHERE id=:id";
            $ca->bindValue(":id", $_POST["id"]);
            $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));

            $sqlDetAll = "INSERT INTO tareas_det (tarea, observaciones, fecha, usuario, tipo) 
                                          values (:tarea, :avance, :fecha, :usuario, :tipo)";
            $cl->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cl->bindValue(":usuario", $_SESSION["usuario"]);
            $cl->bindValue(":tarea", $_POST["id"]);
            $cl->bindValue(":avance", $_POST["respuesta"]);
            $cl->bindValue(":tipo", "Detenido");
            $cl->prepare($sqlDetAll);
            if (!$cl->exec()) {
                echo "errores";
                return;
            }

            $sqlMov = "INSERT INTO tareas_diarias_movs (fecha, id_tarea, accion, usuario, empresa,leido) 
                                        values (:fecha, " . $_POST["id"] . ", 'Cambio de Estado', :usuario, :empresa, 'NO')";
            $cc->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cc->bindValue(":usuario", $_SESSION["usuario"]);
            $cc->bindValue(":empresa", $_SESSION["empresa"]);
            $cc->prepare($sqlMov);
            if (!$cc->exec()) {
                echo "errores";
                return;
            }
        }
        if ($_POST["adjunto"] != "") {
            $sqlAdjunto = "INSERT INTO nwtask_adjuntos (fecha, id_relation, nombre, usuario, empresa) 
                                        values (:fecha, " . $_POST["id"] . ", :adjunto, :usuario, 1)";
            $cg->bindValue(":adjunto", $_POST["adjunto"]);
            $cg->bindValue(":fecha", date("Y-m-d H:i:s"));
            $cg->bindValue(":usuario", $_SESSION["usuario"]);
            $cg->bindValue(":empresa", $_SESSION["empresa"]);
            $cg->prepare($sqlAdjunto);
            if (!$cg->exec()) {
                echo "errores";
                return;
            }
        }
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
        echo $hora_all;
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
//        if (isset($r["usuario_asignado"])) {
//            if ($r["usuario_asignado"] == $_SESSION["id"]) {
//                return;
//            }
//        }
//         $r["usuario_asignado"] = "0";
//        echo $users_asigna[$i] . "//" . $_POST["estado"] . "////";
        /*         * ENVIO DE CORREO* */
//include dirname(__FILE__) . "/../../nwlib/PHPMailer/class.phpmailer.php";

        $mail = new PHPMailer();
//PARÁMETROS CONEXIÓN
//        $mail->IsSMTP();
//        $mail->Host = 'smtp.gmail.com';
//        $mail->Host = 'smtp.netwoods.net';
//        $mail->Host = 'dist.hostingred.net';
//        $mail->Port = 587;
//        $mail->SMTPSecure = "tls";
//        $mail->SMTPAuth = true;
//        $mail->Username = 'administracion@netwoods.net';
//        $mail->Password = 'netwoods08';
//        $mail->Username = 'diseno@netwoods.net';
//        $mail->Password = 'metallica1223';
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

        if ($_POST["estado"] == 5) {
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
        if ($_POST["id"] == 0) {
            $remitente_nombre = $_SESSION["nombre"];
            $remitente_email = $_SESSION["email"];
            $destinatario_nombre = $r_us["nombre"];
            $destinatario_email = $r_us["email"];

            $asunto_ = $_POST["asunto"];
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
//        echo $destinatario_email . "//" . $destinatario_nombre;
//BODY CUERPO MENSAJE
        $body = "<div style='padding: 1px;max-width: 100%;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #ec534d;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
        $body .= "$titulo.  para  $destinatario_nombre<br />";
        $body .= "</div>";
        $body .= "<div style='padding: 5px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 5px;background: #f1f1f1;color: #666;'>";
        $body .= "<h2 style='font-weight: lighter;font-size: 16px;'>El usuario <b>$remitente_nombre</b> $tipo_mail para $destinatario_nombre de la empresa <b>$empresa.</b> Con el estado: <b>" . $estado_ . "</b></h2><br/>";
//        $body .= "<div style='background: #fff;padding: 15px 0px 15px 5px;border: 1px solid #eee;'><b>Asunto: </b>$asunto_<br /></div><br /><br />";
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
        $mail->AddBCC("orionjafe@hotmail.com");
        $mail->AddBCC("assdres@hotmail.com");
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
        } else {
            echo "Tarea Creada Correctamente! Notificacion enviada por correo.";
        }

        /*         * ENVIO DE CORREO* */
    }
}
?>
