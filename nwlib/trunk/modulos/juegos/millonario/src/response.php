<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//if (session_id() == "") {
//    session_start();
//}
//if (!isset($_SESSION["usuario"])) {
//    echo "Sesion Invalida. Inicie sesion..";
//    return;
//}
//session::check();
//global $terminal;
//$terminal = $_POST["terminal"];
if (!isset($_POST["id"])) {
    return;
}
if (!isset($_POST["pr"])) {
    return;
}
if ($_POST["id"] == 0 & $_POST["pr"] == 0) {
    ?>
    <script>
        $(".lisRes").addClass("nada");
        $(".lisRes").removeAttr("name");
        $(".lisRes").removeAttr("id");
    </script>
    <?php
    $respuesta = "Perdiste!";
    echo "<h3 class='responseFinal '>" . $respuesta . "</h3>";
    return;
}
function buscaCorrecta() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwplay_millonario_respuestas", "id", "pregunta=:id and correcta=:correcta");
    $ca->bindValue(":id", $_POST["pr"]);
    $ca->bindValue(":correcta", "SI");
    if (!$ca->exec()) {
        echo "No se pudo consultar" . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay resultados.";
        return;
    }
    $ca->next();
    $r = $ca->assoc();
    ?>
    <script>
        $(".lisResLi<?php echo $r["id"]; ?>").addClass("correctaDiv");
    </script>
    <?php
}
function resuelve() {
//    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    $resuelte = "mal";
    $clas = "";
    $ca->prepareSelect("nwplay_millonario_respuestas a left join nwplay_millonario_niveles b on (a.nivel=b.id)", "a.id as id_res,a.correcta, b.puntaje, b.terminal,b.id", "a.id=:id and a.pregunta=:pr");
    $ca->bindValue(":id", $_POST["id"]);
    $ca->bindValue(":pr", $_POST["pr"]);
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText() . " query: " . $ca->preparedQuery();
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay resultados.";
        return;
    }
    $r = $ca->flush();
    if ($r["correcta"] == "SI") {
        $respuesta = "<a class='continua'>Muy bien! has ganado " . $r["puntaje"] . ". Continuar</a>";
        $resuelte = "correcta";
        $clas = "responseFinalBien";
        ?>
        <script>
            clearTimeout(time);
            $(".lisRes").addClass("nada");
            $(".lisRes").removeAttr("name");
            $(".lisRes").removeAttr("id");
            $("#n<?php echo $r["id"]; ?>").addClass("ganandobien");

            $(".containMainNivelsHome").addClass("rightFull");
            $("#playButton").addClass("leftFull");
            $("#playButton").removeClass("leftFullAction");

            $(".continua").click(function() {
                play(<?php echo $_POST["sesion"]; ?>, <?php echo $_POST["nivel"]; ?>, <?php echo $_POST["pr"]; ?>, <?php echo $r["terminal"]; ?>);
            });
        </script>
        <?php
    } else {
        $respuesta = "Perdiste! . <a href='?terminal=" . $r["terminal"] . "'>Volver a comenzar</a> || <a href=''>Guardar puntaje y compartir.</a>";
    }
    insertSesion($resuelte);
    echo "<h3 class='responseFinal $clas'>" . $respuesta . "</h3>";
}

function insertSesion($p) {
//    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    $ca->prepareUpdate("nwplay_millonario_sesiones", "pregunta,fecha,respuesta", "id=:id");
    $ca->bindValue(":id", $_POST["sesion"]);
    $ca->bindValue(":pregunta", $_POST["pr"]);
    $ca->bindValue(":fecha", date("Y-m-d"));
    $ca->bindValue(":respuesta", $p);
    if (!$ca->exec()) {
        echo "No se pudo, ni idea qué pasó!" . $ca->lastErrorText();
        return;
    }
}
buscaCorrecta();
resuelve();
?>
