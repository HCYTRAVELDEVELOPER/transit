<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/nw_tareas/src/";
    echo '<script type="text/javascript" src="' . $ruta_enlaces . 'login_qxnw/js/jquery-1.4.2.min.js" ></script>';
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/login_qxnw/_mod.php';
    if (!function_exists("GetSQLValueString")) {

        function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
            $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;

            $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

            switch ($theType) {
                case "text":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "long":
                case "int":
                    $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                    break;
                case "double":
                    $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                    break;
                case "date":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "defined":
                    $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                    break;
            }
            return $theValue;
        }

    }
}
?>
<!--<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>login_qxnw/js/jquery-1.4.2.min.js" ></script>-->
<script type="text/javascript" src="<?php echo $ruta_enlaces; ?>login_qxnw/js/main.js" ></script>

<style>
    #popup_carga_note {
        display: none;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000000000000!important;
        height: 100%;
        background: #000;
        background: rgba(0,0,0,0.8);
        opacity: 1;
    }
    .box_info_popup {
        position: relative;
        width: 90%;
        margin: auto;
        background: #fff;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        color: #869690;
        max-width: 800px;
        top: 10%;
    }
    #close_bg {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: -1;
    }
    #form_login_two {
        margin: auto;
        padding: 10px 30px;
    }
    .box_info_popup table {
        width: 100%;
    }
    .box_info_popup input {
        margin: 0px 0px 0px 10px;
        border: 1px solid rgb(204, 204, 204);
        width: 70%;
        font-weight: normal;
        border-radius: 3px;
        outline: 0 none;
        display: block;
        font-family: "Helvetica Neue", Arial, sans-serif;
        border-style: solid;
        border-width: 1px;
        border-color: #dedede;
        margin-bottom: 20px;
        font-size: 1.55em;
        padding: 11px 25px 11px 8px;
        color: #777;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
        -moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
        -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) inset;
        transition: border 0.15s linear 0s, box-shadow 0.15s linear 0s, color 0.15s linear 0s;
        -webkit-transition: border 0.15s linear 0s, box-shadow 0.15s linear 0s, color 0.15s linear 0s;
        -moz-transition: border 0.15s linear 0s, box-shadow 0.15s linear 0s, color 0.15s linear 0s;
        -o-transition: border 0.15s linear 0s, box-shadow 0.15s linear 0s, color 0.15s linear 0s;
    }
    .send_data_login_two {
        background: #ec534d;
        margin: 0 auto!important;
        padding: 10px 0px!important;
        color: #fff!important;
        font-size: 22px!important;
        text-align: center;
    }
</style>

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
                console.log(x);
                window.location = "http://" + x;
            </script>
            <?php
        }
    } else {
        echo "<div id='log' class='button_orange'>Iniciar Sesión</div>";
    }
    ?>   
</div>
<?php
if ($_GET["loginqxnw"] == "login") {
    ?>
    <script type="text/javascript">
        $(document).ready(function() {
            log_in();
        });
    </script>
    <?php
}
?>
<?php
if ($_GET["createaccount"] == "createaccount") {
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