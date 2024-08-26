<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function updateChatsNw($p) {
    $dbd = NWDatabase::database();
    $ca = new NWDbQuery($dbd);
    $ca->prepareUpdate("sop_chat", "leido", "id=:id");
    $ca->bindValue(":id", $p);
    $ca->bindValue(":leido", "2");
    if (!$ca->exec()) {
        echo "errores. " . $ca->lastErrorText();
        return;
    }
}

function loadChatsNw($t) {
    $dbd = NWDatabase::database();
    $ca = new NWDbQuery($dbd);
    $ca->prepareSelect("sop_chat", "*", "visitante=:visita and terminal=:terminal order by fecha asc");
    $ca->bindValue(":visita", $_COOKIE["$t"]);
    $ca->bindValue(":ip", $_COOKIE["real_ip"], true);
    $ca->bindValue(":terminal", $t);
    if (!$ca->exec()) {
        echo "Error!";
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "Espere mientras un asesor atiende su llamada. Gracias!";
    }
    $rta = "";
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            
            $rta .= "<div class='chats_conversations chat_{$r["tipo_user"]}'>";
            $rta .= "<div class='photo photo_{$r["tipo_user"]}' style='background-image: url(" . $r["foto_usuario"] . ");' ></div>";
            $rta .= "<div class='message_all message_visit{$r["tipo_user"]}'>";
            $rta .= "<p class='usuario'>{$r["fecha"]} <span>{$r["nombre_operador"]}:</span></p>";
            $rta .= "<p class='mensaje'>{$r["texto"]}</p>";
            $rta .= "</div>";
            $rta .= "</div>";
            if ($r["leido"] != 2) {
                ?>
                <script>
                    scroll();
                </script>
                <?php

            }
            echo $rta;
            updateChatsNw($r["id"]);
            if ($i + 1 == $total) {
                if ($r["status"] == "FINALIZADO") {
                    ?>
                    <script>
                        inactivity("SI");
                    </script>
                    <?php

                }
            }
        }
    }
}

loadChatsNw($_POST["id_t"]);
?>