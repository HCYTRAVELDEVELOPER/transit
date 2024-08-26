<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/";
    echo '<script type="text/javascript" src="' . $ruta_enlaces . 'login_qxnw/js/jquery-1.4.2.min.js" ></script>';
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/login_qxnw/_mod.php';
}
?>
<!--<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>login_qxnw/js/jquery-1.4.2.min.js" ></script>-->
<link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces; ?>login_qxnw/css/index.css" />
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>login_qxnw/js/main.js" ></script>
<div class="menu_right">
    <?php
    if (isset($_SESSION["autenticado"]) == 'SI') {
        if (isset($_GET['edite'])) {
            if ($_GET['edite'] == "TrueEditNW") {
                echo "Acceder, está en nwproject";
            }
        } else {
            echo "hola";
            //  php_location('http://dfsa' . $_SERVER["HTTP_HOST"]);
            ?>
            <script type="text/javascript">
                var x = location.host;
                window.location = "http://" + x;
            </script>
            <?php
        }
    } else {
        echo "<div id='log' class='button_orange'><h1>Debe Iniciar sesión para continuar. Clic Aquí</h1></div>";
    }
    ?>   
</div>
<?php
if (isset($_GET["loginqxnw"]) && $_GET["loginqxnw"] == "login") {
    ?>
    <script type="text/javascript">
        $(document).ready(function() {
            log_in();
        });
    </script>
    <?php
}
if (isset($_GET["createaccount"]) && $_GET["createaccount"] == "createaccount") {
    ?>
    <script type="text/javascript">
        $(document).ready(function() {
            crearCuenta();
        });
    </script>
    <?php
}
?>
<script type="text/javascript">
    $(document).ready(function() {
        $("#log").click(function() {
            log_in();
        });
    });
</script>
<div id="popup_carga_note"></div>