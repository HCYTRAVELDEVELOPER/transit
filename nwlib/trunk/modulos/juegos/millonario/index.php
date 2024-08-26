<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

//if (session_id() == "") {
//    //  ini_set('session.cookie_domain', '.gruponw.com');
//    session_start();
//}
//if (!isset($_SESSION["usuario"])) {
//    echo "Sesion Invalida. Inicie sesion..";
//    return;
//}

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
        echo "No se pudo consultar";
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

//$nwlib_ver = "nwlib{$cfg["nwlibVersion"]}";
$nwlib_ver = "nwlib" . master::getNwlibVersion();
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <!-- IMPORTANTE PARA QUE TOME EL ANCHO DEL DISPOSITIVO!!-->
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="/<?php echo $nwlib_ver; ?>/modulos/juegos/millonario/css/css.css" />
        <script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/includes/jquery/jquery-1.4.2.min.js" ></script>
        <script type="text/javascript" src="/<?php echo $nwlib_ver; ?>/modulos/juegos/millonario/js/main.js" ></script>
    </head>
    <body>
        <div class="container">
            <div class="titleHomeLogo">
                <div class="titleHomeLogoInt">
                    <h1>
                        QUIZ!
                    </h1>
                </div>
            </div>
            <?php
            echo "<div class='containMainHomeT'>";
//            niveles();
            echo "</div>";
            ?>
            <?php
            if (isset($_GET["terminal"])) {
                niveles($_GET["terminal"]);
            }
            ?>
            <div class='contendResponsesResponse'></div>
            <div id="sesion"></div>
        </div>
    </body>
</html>
