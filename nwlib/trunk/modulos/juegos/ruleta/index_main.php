<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
    ?>
    <script>
        $(document).ready(function() {
            rute_files = "/nwlib/modulos/";
        });
    </script>
    <?php
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
    ?>
    <script>
        $(document).ready(function() {
            rute_files = "/nwproject/php/modulos/";
        });
    </script>
    <?php
}
if (session_id() == "") {
    session_start();
}
global $id;
$id = "";
if (isset($_POST["id"])) {
    $id = $_POST["id"];
}
if ($id == "") {
    echo "<h1><a href='http://www.netwoods.net'>netwoods.net</a></h1>";
    return;
}
global $id;
$db = NWDatabase::database();
$cb = new NWDbQuery($db);
$cb->prepareSelect("nwplay_ruleta_enc", "*", "id=:id");
$cb->bindValue(":id", $id);
if (!$cb->exec()) {
    echo "Error" . $cb->lastErrorText();
    return;
}
$totales = $cb->size();
if ($totales == 0) {
    echo "No hay configuración";
    return;
}
$cb->next();
$ra = $cb->assoc();
?>
<script>
    $(document).ready(function() {
        manipuled = "<?php echo $ra["manipulado"]; ?>";
    });
</script>
<?php
$enc = "<div class='datos_enc'>" . $ra["nombre"] . "</div>";
if ($ra["css"] != "") {
    ?>
    <style>
    <?php
    echo $ra["css"];
    ?>
    </style>
    <?php
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>Ruleta de la Fortuna</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="css/style.css" /> 
        <link rel="stylesheet" type="text/css" href="css/cssWindows.css" /> 
        <style>
            .left {
                background-color: <?php echo $ra["fondo_izquierda"]; ?>;
            }
            #right {
                background-color: <?php echo $ra["fondo_derecha"]; ?>;     
            }
            .contenedor {
                background-color: <?php echo $ra["fondo_derecha"]; ?>;     
            }
        </style>
        <link rel="stylesheet" href="js/jquery-ui.css">
        <script src="js/jquery-1.10.2.js"></script>
        <script src="js/jquery-ui.js"></script>
        <script type="text/javascript" src="js/js.js" ></script>
    </head>
    <body>
        <div id="loading">
            <div id="loading_inter">
                <h1>
                    Cargando... por favor espere.
                </h1>
                <a class="enlace_powered" href="http://www.netwoods.net" target="_blank">Powered By <span style="color:red;">Net</span><span style="color:#e9e9e9;">woods</span></a>
            </div>
        </div>
        <div class="contenedor" data="<?php echo $_POST["id"]; ?>" data-l="<?php echo $ra["requiere_login"]; ?>">
            <div id="right">
                <div id="div_selector">
                    <div class="selector"></div>
                </div>
                <div class="ruleta" id="ruleta">
                    <div class="centro_ruleta"></div>
                    <?php
                    $ca = new NWDbQuery($db);
                    $ca->prepareSelect("nwplay_ruleta_objetos", "*", "id_enc=:id order by numero");
                    $ca->bindValue(":id", $id);
                    if (!$ca->exec()) {
                        echo "Error" . $ca->lastErrorText();
                        return;
                    }
                    $total = $ca->size();
                    if ($total == 0) {
                        echo "No hay configuración";
                        return;
                    }
                    $divs_unic = "";
                    for ($i = 0; $i < $total; $i++) {
                        $ca->next();
                        $r = $ca->assoc();
                        $num = $r["numero"];
                        $divs_unic .= "<div class='div_list_objets'><div class='div_list_objets_inter' style='background-color: " . $r["color"] . "'><h2>" . $r["numero"] . "</h2> <p>" . $r["premio"] . "</p></div></div>";
                        ?>
                        <div class="ruleta_int ruleta_int<?php echo $num; ?>" >
                            <div class="pasos paso<?php echo $num; ?>" style="border-top-color: <?php echo $r["color"]; ?>;" name="<?php echo $r["id"]; ?>">
                                <h1 class="number_paso">
                                    <?php echo $num; ?>
                                </h1>
                            </div>
                        </div>
                        <?php
                        if ($num == $total) {
                            ?>
                            <script>
                                $(document).ready(function() {
                                    setTimeout(function() {
                                        loadAll(<?php echo $total; ?>, '<?php echo $ra["requiere_codigo"]; ?>');
                                    }, 1000);
                                });
                            </script>
                            <?php
                        }
                    }
                    ?>
                </div>
            </div>
            <div class="left">
                <?php
                if ($ra["requiere_login"] == "si") {
                    if (!isset($_SESSION["usuario"])) {
                        ?>
                        <div class="bt_registro buttonGreen">
                            <a class="registro" href="#">Regístrate</a> / <a class="login" href="#"> Inicia Sesión</a>
                            <p>
                                Debes estar registrado para poder jugar.
                            </p>
                        </div>
                        <?php
                    } else {
                        ?>
                        <div class="play buttonGreen">
                            Click para Jugar
                        </div>
                        <?php
                    }
                } else {
                    ?>
                    <div class="play buttonGreen">
                        Click para Jugar
                    </div>
                    <?php
                }
                ?>
                <div class='objects'>
                    <h2>
                        Lista de Premios
                    </h2>
                    <?php echo $divs_unic; ?>
                </div>
                <div class="enc">
                    <?php
                    echo $enc;
                    ?>
                </div>
                <div class="resultado_post"></div>
            </div>
        </div>
        <div id="fond_gen_mod_oculto"></div>
        <div id="credits">
            <a class="enlace_powered" href="http://www.netwoods.net" target="_blank">Powered By <span style="color:red;">Net</span><span style="color:#e9e9e9;">woods</span></a>
        </div>
    </body>
</html>