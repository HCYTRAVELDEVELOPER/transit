<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function insertchat() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $msg = "El usuario " . $_POST["nombre"] . " estuvo inactivo por 15 minutos, el chat fue cerrado.";
    $t = $_POST["id_t"];
    $ca->prepareInsert("sop_chat", "visitante,  texto, usuario,  fecha, terminal, tipo_user, leido, ip, nombre_operador, foto_usuario, status");
    $ca->bindValue(":visitante", $_COOKIE["$t"]);
    $ca->bindValue(":texto", $msg);
    $ca->bindValue(":usuario", $_POST["nombre"]);
    $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
    $ca->bindValue(":terminal", $_POST["id_t"]);
    $ca->bindValue(":tipo_user", "visitante");
    $ca->bindValue(":leido", 1);
    $ca->bindValue(":ip", $_COOKIE["real_ip"], true);
    $ca->bindValue(":nombre_operador", $_POST["nombre"]);
    $ca->bindValue(":foto_usuario", "/nwlib/dashboard/img/icon_user.png");
    $ca->bindValue(":status", "DESCONECTADO");
    if (!$ca->exec()) {
        echo "errores. " . $ca->lastErrorText();
        return;
    }
}

function update() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $t = $_POST["id_t"];
    $ca->prepareUpdate("sop_visitantes", "estado", "id=:id");
    $ca->bindValue(":id", $_COOKIE["$t"]);
    $ca->bindValue(":estado", "DESCONECTADO");
    if (!$ca->exec()) {
        echo "errores. " . $ca->lastErrorText();
        return;
    }
}

if ($_POST["param"] != "SI") {
    insertchat();
    update();
    ?>
    <div class="inactive">
        El chat ha sido cerrado por inactividad.
    </div>
    <?php
} else {
    ?>
    <div class="inactive">
        El chat se ha cerrado.
    </div>
    <?php
}
?>