<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

function birthday() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("usuarios a left join usuarios_empresas b on (a.usuario=b.usuario)", "a.usuario,a.nombre,a.apellido, a.foto, a.fecha_nacimiento", " a.estado='activo' and b.empresa=:empresa order by usuario asc");
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    if (!$ca->exec()) {
        echo "errores" . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "<h2>No hay Usuarios</h2>";
        return;
    }
    $month = date("m");
    $n = 0;
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if (isset($r["fecha_nacimiento"])) {
            $birthday = explode("-", $r["fecha_nacimiento"]);
            if ($birthday[1] == $month) {
                echo "<div class='user_chat'>
                    <a href='/nwlib/modulos/nw_tareas.php?profile=" . $r["usuario"]. "&walk=show'>
                            <div class='img_user_chat' style='background-image: url(" . $r["foto"] . ");' ></div>
                            <p>
                                " . $r["nombre"] . " " . $r["apellido"] . " 
                            </p>
                            <p>
                                " . $birthday[2] . " de " . date("M") . " 
                            </p>
                            </a>
                        </div>";
                $n++;
            }
        }
    }
    if($n == 0) {
        echo "No hay Cumpleaños en este me";
    }
}

birthday();
?>
