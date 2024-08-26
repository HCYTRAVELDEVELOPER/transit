<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    ?>
    <script>
        iniciarSesion();
    </script>
    <?php

    return;
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cf = new NWDbQuery($db);
$ce = new NWDbQuery($db);
$cf->prepareSelect("tareas_diarias", "max(id) as id");
$cf->exec();
$cf->next();
$r_new_id = $cf->assoc();
$id = $r_new_id["id"] + 1;

$ce->prepareSelect("projectplan_enc", "*", "id=:id");
$ce->bindValue(":id", $_POST["project"]);
if (!$ce->exec()) {
    echo "Error: " . $ce->lastErrorText();
    return;
}
$ce->next();
$r = $ce->assoc();
$userLider = $r["usuario_lider"];
if($userLider == null || $userLider == "") {
    $userLider = 32;
}
$ca->prepareInsert("tareas_diarias", "id, tarea,estado,fecha,empresa,usuario,usuario_asignado,observaciones,fecha_final,hora_final,proyecto,tipo");
$ca->bindValue(":id", $id);
$ca->bindValue(":tarea", $_POST["observaciones"]);
$ca->bindValue(":estado", 1);
$ca->bindValue(":fecha", date("Y-m-d H:i:s"));
$ca->bindValue(":empresa", $_SESSION["empresa"]);
$ca->bindValue(":usuario", $_SESSION["usuario"]);
$ca->bindValue(":usuario_asignado", $userLider);
$ca->bindValue(":observaciones", $_POST["observaciones"]);
$ca->bindValue(":fecha_final", $_POST["fecha_final"]);
$ca->bindValue(":hora_final", $_POST["hora_final"]);
$ca->bindValue(":proyecto", $_POST["project"]);
$ca->bindValue(":tipo", $_POST["tipo"]);
if (!$ca->exec()) {
    echo "Error: " . $ca->lastErrorText();
    return;
} else {
    echo "<div class='div_show'>Tarea agregada correctamente</div>";
}
?>