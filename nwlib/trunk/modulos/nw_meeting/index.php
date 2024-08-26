<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib{$cfg["nwlibVersion"]}/modulos/nw_meeting/";
    $ruta_js = "http://" . $_SERVER["HTTP_HOST"] . $ruta_enlaces;
} else {
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animation/_mod.php';
}
session::check();

function loadConfig() {
    session::check();
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $ca->prepareSelect("nwreu_config", "integrar_tareas", "usuario=:usuario and usuario_id_enc=:usuario_id_enc and terminal=:terminal and empresa=:empresa");
    $ca->prepareSelect("nwreu_config", "integrar_tareas", "terminal=:terminal and empresa=:empresa");
//    $ca->bindValue(":usuario", $si["usuario"]);
//    $ca->bindValue(":usuario_id_enc", $si["id"]);
    $ca->bindValue(":terminal", $si["terminal"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    if (!$ca->exec()) {
        echo "Upps! Error al consultar la configuración. Consulte con el administrador del sistema." . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total > 0) {
        $ca->next();
        $r = $ca->assoc();
        setcookie("integrar_tareas", $r["integrar_tareas"]);
    }
}

if (!isset($_COOKIE["integrar_tareas"])) {
    loadConfig();
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <link rel="stylesheet" href="<?php echo $ruta_enlaces; ?>css/style.css">
        <link rel="stylesheet" href="<?php echo $ruta_enlaces; ?>css/style_2.css">
        <link rel="stylesheet" href="<?php echo $ruta_enlaces; ?>/js/jquery-ui.css">
        <link href="<?php echo $ruta_enlaces; ?>css/cssWindows.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="<?php echo $ruta_enlaces; ?>css/style_movil.css">
        <script type="text/javascript" src="<?php echo $ruta_enlaces; ?>/js/jquery.min.js" ></script>
        <script src="<?php echo $ruta_enlaces; ?>/js/jquery-ui.min.js"></script>
        <script src="<?php echo $ruta_enlaces; ?>/js/main.js"></script>
    </head>
    <body>
        <div class="container_main">
            <div class="container_enc">
                <div class="logo_nwmeet">
                    <div class="logo_nwmeet_inter">
                        Nw Meet
                    </div>
                </div>
                <?php
                if (!isset($_GET["beginID"])) {
                    ?>
                    <div class="inputs_enc">
                        <input type="date" value="<?php echo date("Y-m-d"); ?>"/>
                        <input type="search" placeholder="Buscar..." />
                        <input type="button" value="Buscar" />
                    </div>
                    <div class="div_menu_enc">
                        <div class="div_redondButton buttonDash menuActive">
                            Home <div class="showInt tHome"></div>
                        </div>
                        <div class="div_redondButton buttonToday">
                            Hoy <div class="showInt tHoy"></div>
                            <ul class="submenuToday">
                                <li>
                                    Próximas <div class="showInt tHoyNext"></div>      
                                </li>
                                <li>
                                    Ejecutadas <div class="showInt tHoyEjecut"></div>      
                                </li>
                                <li>
                                    No Ejecutadas <div class="showInt tHoyNoEjecut"></div>      
                                </li>
                            </ul>
                        </div>
                        <div class="div_redondButton buttonNext">
                            Próximas <div class="showInt tNext"></div>
                        </div>
                        <div class="div_redondButton buttonHistory">
                            Historial <div class="showInt tHis"></div>
                        </div>
                        <div class="div_redondButton">
                            Archivo <div class="showInt tArchivo"></div>
                        </div>
                    </div>
                    <div class="button_gray buttonAddReu">
                        <p class="button_gray_p">+</p> Nueva Reunión
                    </div>
                    <?php
                } else {
                    ?>
                    <style>
                        .container_enc{
                            overflow: hidden;   
                        }
                        #reuview {
                            background: transparent!important;
                        }
                    </style>
                    <div class="inputs_enc">
                        <div class="menu_one">
                            <ul>
                                <li id="play_r" class="button_green_important">
                                    Iniciar 
                                </li>
                                <li class="finishReu">
                                    Terminar
                                    <div class="button_gray_p_dos">x</div>
                                </li>
                                <li class="bt_action" data="decision">
                                    Decisiones
                                    <div class="button_gray_p_dos">+</div>
                                </li>
                                <li class="bt_action" data="idea">
                                    Ideas
                                    <div class="button_gray_p_dos">+</div>
                                </li>
                                <li class="bt_action" data="tarea">
                                    Tareas
                                    <div class="button_gray_p_dos">+</div>
                                </li>
                                <li class="bt_action" data="nota">
                                    Notas
                                    <div class="button_gray_p_dos">+</div>
                                </li>
                                <li>
                                    Duración
                                    <p>
                                        <?php
                                        echo date("Y-m-d");
                                        ?>
                                    </p>
                                    <h1 id="play_times">
                                        00:00
                                    </h1>
                                </li>
                                <li>
                                    Tiempo Perdido
                                    <p>
                                        <?php
                                        echo date("Y-m-d");
                                        ?>
                                    </p>
                                    <h1 id="time_lose">
                                        00:00
                                    </h1>
                                </li>
                                <li>
                                    Hora Reunión
                                    <p>
                                        <?php
                                        echo date("Y-m-d");
                                        ?>
                                    </p>
                                    <h1 id="hora_reunion_enc">
                                        00:00
                                    </h1>
                                </li>
                                <li>
                                    Hora Actual
                                    <p>
                                        <?php
                                        echo date("Y-m-d");
                                        ?>
                                    </p>
                                    <h1 id="hora">
                                        00:00
                                    </h1>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <?php
                }
                ?>
            </div>
            <?php
            if (!isset($_GET["beginID"])) {
                ?>
                <div class="container_body body_left">
                    <div class="container_body_inter">
                        <?php
                        include 'src/meetings.php';
                        ?>
                    </div>
                </div>
                <div class="container_body body_right">
                    <div class="container_body_inter container_body_inter_right"> 
                        <?php
                        include 'src/meetings_month.php';
                        ?>
                    </div>
                </div>
                <?php
            } else {
                include 'src/beginReu.php';
            }
            ?>
        </div>
        <script>
            $(document).ready(function() {
<?php
if (isset($_GET["view"]) && $_GET["view"] != "") {
    ?>
                    viewReu(<?php echo $_GET["view"]; ?>);
    <?php
}
if (isset($_GET["viewHis"]) && $_GET["viewHis"] == "true") {
    ?>
                    viewHis();
    <?php
}
if (isset($_GET["next"]) && $_GET["next"] == "true") {
    ?>
                    viewNext();
    <?php
}
if (isset($_GET["today"]) && $_GET["today"] == "true") {
    ?>
                    viewToday();
    <?php
}
if (isset($_GET["beginID"]) && $_GET["beginID"] != "") {
    ?>
                    myTimer();
    <?php
}
$integrar_tareas = "NO";
if (isset($_COOKIE["integrar_tareas"]) && $_COOKIE["integrar_tareas"] != "") {
    $integrar_tareas = $_COOKIE["integrar_tareas"];
}
?>
                configAll("<?php echo $integrar_tareas; ?>");
            });
        </script>
    </body>
</html>


