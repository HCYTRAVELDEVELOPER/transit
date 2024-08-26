<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//$nwlib_ver = "nwlib{$cfg["nwlibVersion"]}";
$nwlib_ver = "nwlib" . master::getNwlibVersion();
echo "<script type='text/javascript' src='/{$nwlib_ver}/modulos/juegos/millonario/js/play.js' ></script>";
//if (session_id() == "") {
//    //  ini_set('session.cookie_domain', '.gruponw.com');
//    session_start();
//}
//if (!isset($_SESSION["usuario"])) {
//    echo "Sesion Invalida. Inicie sesion..";
//    return;
//}
global $terminal;
$terminal = $_POST["terminal"];

function respuestas($p) {
//    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    global $terminal;
    $tableName = "nwplay_millonario_respuestas";
    $fields = "*";
    $where = "pregunta=:id and terminal=:terminal";
    $order = "random() limit 4";
    $ca->prepareSelect($tableName, $fields, $where, $order);
    $ca->bindValue(":terminal", $terminal);
    $ca->bindValue(":id", $p);
    if (!$ca->exec()) {
        echo "Error. " . $ca->lastErrorText() . " query: " . $ca->preparedQuery();
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay respuestas para esta pregunta, lo sentimos. Vuelve más tarde.";
        return;
    }
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($i == 0) {
            $letra = "A. ";
        }
        if ($i == 1) {
            $letra = "B. ";
        }
        if ($i == 2) {
            $letra = "C. ";
        }
        if ($i == 3) {
            $letra = "D. ";
        }
        echo "<li>";
        echo "<div class='lisRes lineRespInt lisResLi" . $r["id"] . "' id='" . $r["id"] . "' name='" . $r["pregunta"] . "' >" . $letra . "<span class='lisRes" . $r["id"] . "'>" . $r["nombre"] . "</span></div>";
        echo "</li>";
    }
}

function nivels($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    global $terminal;
    $where = "terminal=:terminal";
    if ($id != 0) {
        $where .= " and id>:id";
    }
    $ca->prepareSelect("nwplay_millonario_niveles", "id", $where . " order by puntaje asc");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":terminal", $terminal);
    if (!$ca->exec()) {
        echo "Error line 71. " . $ca->lastErrorText() . " query: " . $ca->preparedQuery();
        return;
    }
    if ($ca->size() == 0) {
        return false;
    }
    $ca->next();
    $r = $ca->assoc();
    return $r["id"];
}

function preguntas($id, $nivel) {
//    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
//    $nivelSuperior = "";
    global $terminal;
    $tableName = "nwplay_millonario_preguntas a left join nwplay_millonario_niveles b on (a.nivel=b.id)";
    $fields = "a.*,b.puntaje";
    $where = "a.terminal=:terminal";
    if ($id != 0) {
        $where .= " and a.id>:id and a.id<>:id";
    }
    $where .= " and a.nivel=:nivelSuperior";
    $order = "random() limit 1";
    $nivelSuperior = nivels($nivel);
    if ($nivelSuperior == false) {
        echo "No hay niveles {$nivel}";
        return;
    }
    $ca->prepareSelect($tableName, $fields, $where, $order);
    $ca->bindValue(":terminal", $terminal);
    $ca->bindValue(":id", $id);
    $ca->bindValue(":nivel", $nivel);
    $ca->bindValue(":nivelSuperior", $nivelSuperior);
    if (!$ca->exec()) {
        echo "Error line 105. " . $ca->lastErrorText() . " query: " . $ca->preparedQuery();
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay resultados.";
        return;
    }
    $ca->next();
    $r = $ca->assoc();
    insertSesion($r["id"]);
    ?>
    <style>
        #pregunta<?php echo $id; ?>{
            background: red;
        }
    </style>
    <?php
    echo "<div class='ayudas'><div class='cincu_cincu' id='" . $r["id"] . "'>50:50</div><div>Consejo/Pista</div><div>Ayuda del público</div>";
    ?>
    <div class="time" id="time"></div>
    <script>
        html = $(".containMainNivelsHome").html();
        $(".containMainNivelsHomeDialog").html(html);
        $(".porVuela").fadeIn(0);
        $(".porVuelaText").animate({top: 5 + "%"}, 1000);
        $(".porVuelaText").animate({top: 5 + "%"}, 4000);
        $(".porVuelaText").animate({top: -100 + "%"}, 1000);
        setTimeout(function() {
            $(".porVuela").fadeOut(500);
            $(".porVuela").remove();
        }, 5500);
        var set = setTimeout(function() {
            init(<?php echo $r["tiempo"]; ?>);
        }, 6000);
        $(".playDialog").click(function() {
            clearTimeout(set);
            $(".porVuela").fadeOut(100);
            $(".porVuela").remove();
            init(<?php echo $r["tiempo"]; ?>);
        });
    </script>
    <?php
    echo "</div>";
    echo "<div class='porVuela'>
           <div class='porVuelaText'>";
    echo "<div class='containMainNivelsHomeDialog'></div>";
    echo "<div class='divDialogPuntaj'>Por " . $r["puntaje"] . " responda la siguiente pregunta
            <div class='playDialog'>Comenzar</div>
            </div>
           </div>
          </div>";
    echo "<div id='boxPlayPreg'>";
    echo "<div class='enc_pregunta'>" . $r["nombre"] . "</div>";
    echo "<ul class='contendResponses'>";
    respuestas($r["id"]);
    echo "</ul>";
    echo "</div>";
    ?>
    <script>
        $(".contendResponsesResponse").html("");
        $(".containMainNivelsHome").removeClass("rightFull");
        $("#playButton").removeClass("leftFull");
        $(".containMainNivelsHome").addClass("rightFullAction");
        $("#playButton").addClass("leftFullAction");
        $(".lisRes").click(function() {
            pasa = 0;
            clearTimeout(time);
            var i = $(this).attr('id');
            var p = $(this).attr('name');
            if (p == "") {
                return;
            }
            if (p == undefined) {
                return;
            }
            $(".lisRes").addClass("nada");
            $(".lisRes").removeAttr("name");
            $(".lisRes").removeAttr("id");
            $(this).addClass("selected");
            load_mi_espacioNWSites(i, p, <?php echo $_POST["sesion"]; ?>, <?php echo $r["nivel"]; ?>);
        });
    </script>
    <?php
}

function insertSesion($p) {
//    session::check();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    $usuario = "Invitado";
    if (isset($si["usuario"])) {
        $usuario = $si["usuario"];
    }
    $ca->prepareUpdate("nwplay_millonario_sesiones", "pregunta,usuario,fecha", "id=:id");
    $ca->bindValue(":id", $_POST["sesion"]);
    $ca->bindValue(":pregunta", $p);
    $ca->bindValue(":usuario", $usuario);
    $ca->bindValue(":fecha", date("Y-m-d"));
    if (!$ca->exec()) {
        echo "No se pudo, ni idea qué pasó!..." . $ca->lastErrorText();
        return;
    }
}

$id = 0;
$nivel = 0;
if (isset($_POST["id"])) {
    if ($_POST["id"] != 0) {
        $id = $_POST["id"];
    }
}
if (isset($_POST["nivel"])) {
    if ($_POST["nivel"] != 0) {
        $nivel = $_POST["nivel"];
    }
}
echo "<div class='containMainNivels'>";
preguntas($id, $nivel);
echo "</div>";
echo "<div class='helps'></div>";
?>



