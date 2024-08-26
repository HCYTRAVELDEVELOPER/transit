<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function niveles($p) {
//    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    $tableName = "nwplay_millonario_niveles";
    $fields = "*";
    $where = "terminal=:terminal";
    $order = "puntaje desc";
    $ca->prepareSelect($tableName, $fields, $where, $order);
    $ca->bindValue(":terminal", $p);
    if (!$ca->exec()) {
             echo "Error. " . $ca->lastErrorText() . " query: " . $ca->preparedQuery();
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay resultados.";
        return;
    }
    echo " <div id='playButton'>
                <div class='playButton' id='$p'>
                    <h3>
                        Iniciar nueva partida como invitado
                    </h3>
                </div>
                <div class='playButton' id='$p'>
                    <h3>
                        Iniciar nueva partida iniciando sesión
                    </h3>
                </div>
            </div>";
    echo "<div class='containMainNivelsHome'>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["nivel_seguro"] == "SI") {
            $clase = "nivel_seguro";
        } else {
            $clase = "";
        }
        echo "<div class='containNivels'>";
        echo "<ul>";
        echo "<li id='n" . $r["id"] . "' class='$clase'>" . $r["puntaje"] . "</li>";
        echo "</ul></div>";
    }
    echo "</div>";
}
$termi = "";
if(isset($_GET["terminal"])){
    $termi = $_GET["terminal"];
}
if(isset($_POST["terminal"])){
    $termi = $_POST["terminal"];
}
niveles($termi);
?>