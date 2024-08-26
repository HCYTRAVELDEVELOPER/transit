<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function crear() {
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $db->transaction();
    $cb->prepareSelect("tareas_diarias", "max(id) as id");
    $cb->exec();
    $cb->next();
    $r_new_id = $cb->assoc();
    $id = $r_new_id["id"] + 1;
    $p = $_POST;
    $ca->prepareInsert("tareas_diarias", "id, tarea, estado, fecha, observaciones, usuario_asignado, fecha_final,hora_final, usuario, prioridad,empresa, leido, tipo, fecha_modificacion, hora_estimada, publico");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":tarea", $p["titulo"]);
    $ca->bindValue(":estado", 1);
    $ca->bindValue(":fecha", $p["fecha"]);
    $ca->bindValue(":observaciones", $p["titulo"]);
    $ca->bindValue(":usuario_asignado", $si["id"]);
    $ca->bindValue(":fecha_final", $p["fecha"]);
    $ca->bindValue(":hora_final", $p["hora"]);
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    $ca->bindValue(":prioridad", 1);
    $ca->bindValue(":leido", "NO");
    $ca->bindValue(":tipo", "cita");
    $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
    $ca->bindValue(":hora_estimada", $p["tiempo_previsto"]);
    $ca->bindValue(":publico", "SI");
    if (!$ca->exec()) {
        echo "Error al insertar la tarea: " . $ca->lastErrorText();
        return;
    }
    $db->commit();
}

crear();

$si = session::getInfo();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cc = new NWDbQuery($db);
$db->transaction();
$users_asigna = explode(",", $_POST["asistentes"]);
$total = count($users_asigna);
for ($i = 0; $i < $total; $i++) {
    $ass = explode("|", $users_asigna[$i]);
    $asistente_email = $ass[0];
    $asistente = 0;
    $cc->prepareSelect("usuarios", "id", "email=:email");
    $cc->bindValue(":email", $asistente_email);
    if (!$cc->exec()) {
        echo "Error. " . $cc->lastErrorText();
        $db->rollback();
        return;
    }
    if ($cc->size() > 0) {
        $cc->next();
        $ra = $cc->assoc();
        $asistente = $ra["id"];
        $cb->prepareSelect("tareas_diarias", "max(id) as id");
        $cb->exec();
        $cb->next();
        $r_new_id = $cb->assoc();
        $id = $r_new_id["id"] + 1;
        $p = $_POST;
        $ca->prepareInsert("tareas_diarias", "id, tarea, estado, fecha, observaciones, usuario_asignado, fecha_final,hora_final, usuario, prioridad,empresa, leido, tipo, fecha_modificacion, hora_estimada, publico");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":tarea", $p["titulo"]);
        $ca->bindValue(":estado", 1);
        $ca->bindValue(":fecha", $p["fecha"]);
        $ca->bindValue(":observaciones", $p["titulo"]);
        $ca->bindValue(":usuario_asignado", $asistente);
        $ca->bindValue(":fecha_final", $p["fecha"]);
        $ca->bindValue(":hora_final", $p["hora"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":prioridad", 1);
        $ca->bindValue(":leido", "NO");
        $ca->bindValue(":tipo", "cita");
        $ca->bindValue(":fecha_modificacion", date("Y-m-d H:i:s"));
        $ca->bindValue(":hora_estimada", $p["tiempo_previsto"]);
        $ca->bindValue(":publico", "SI");
        if (!$ca->exec()) {
            echo "Error al insertar la tarea: " . $ca->lastErrorText();
            return;
        }
        $db->commit();
    }
}
?>
