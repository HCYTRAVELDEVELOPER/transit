
<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/";
    ?>
    <html xmlns="http://www.w3.org/1999/xhtml"
          xmlns:fb="http://www.facebook.com/2008/fbml"
          xmlns:og="http://ogp.me/ns#"
          xml:lang="es-ES" >
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
            <title>nwLearning</title>
            <style>
                body {
                    position: relative;
                    margin: 0;
                    padding: 0;
                    font-family: arial;
                    font-size: 12px;
                }
                a {
                    text-decoration: none;
                    color: inherit;
                }
            </style>
            <?php
            echo '<script type="text/javascript" src="nw_learning/js/jquery-1.4.2.min.js" ></script>';
        } else {
//MYSQL NWPROJECT
            $ruta_enlaces = "/nwproject/php/modulos/";
            include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
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
        $url_gen = "";

        include "config_img.php";
        include "cryp.php";

        $embed = "";

        if ($_GET["embed"] == true) {
            $embed = $_GET["embed"];
            echo "<link href='" . $ruta_enlaces . "nw_learning/css/embed.css' rel='stylesheet' type='text/css' charset='utf-8'/>";
            echo "<script type='text/javascript' src='" . $ruta_enlaces . "nw_learning/js/jquery-1.4.2.min.js' ></script>";
        }

//$url_navega="http://".$_SERVER['HTTP_HOST'].":".$_SERVER['SERVER_PORT']. $_SERVER['REQUEST_URI'];
        $nombre_hoja = $_GET["nombre"];
        $id_hoja = $_GET["pagina"];
        $url_host = "http://" . $_SERVER['HTTP_HOST'] . "/aplicaciones/$nombre_hoja-$id_hoja";
        $url_cuenta = "http://" . $_SERVER['HTTP_HOST'] . "/cuenta/$nombre_hoja-$id_hoja?account=account";
        $url_navega = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        $url_navega_man = "http://" . $_SERVER['HTTP_HOST'] . "/embed/" . $_GET["cat"];
        $url_navega_object = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
        ?>
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces; ?>nw_learning/css/style.css" />
        <link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces; ?>nw_learning/css/component.css" />
        <script type="text/javascript" src="<?php echo $ruta_enlaces; ?>nw_learning/js/main.js" ></script>
        <script type="text/javascript" src="<?php echo $ruta_enlaces; ?>nw_learning/js/jquery-ui.min.js" ></script>
        <script type="text/javascript" src="<?php echo $ruta_enlaces; ?>nw_learning/js/jquery.animate-colors-min.js" ></script>
        <?php
        if (file_exists($file_nwlib)) {
            ?>
        </head>
        <body>
            <?php
        }
        ?>

        <?php
        echo " <div class='header_contend menu_fix_manuals'>";
        require "src/cuenta/header_enc.php";
        echo "</div>";

        if ($_GET["account"] != "") {
            
        } else
        if ($_GET["buscar"] != "") {
            
        } else
        if ($_GET["m"] != "") {
            
        } else
        if ($_GET["cat"] != "") {
            
        } else
        if ($_GET["MainUrl"] != "") {
            
        } else {
            echo " <div class='galery_home'>";
            include "src/galeria_polaris/galeria_polaris.php";
            echo "</div>";
        }
        echo "<div id='contenedor_total'>";
        echo "<p id='hora'></p>";

        if ($_GET["account"] != "") {
            
        } else
        if ($_GET["buscar"] != "") {
            
        } else
        if ($_GET["m"] != "") {
            
        } else
        if ($_GET["cat"] != "") {
            
        } else
        if ($_GET["MainUrl"] != "") {
            
        } else {
            echo " <div class='list_manual'>";
            include "manuales.php";
            echo "</div>";
        }


        if ($_GET["buscar"] != "") {
            include $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . "nw_learning/buscar/resultados.php";
        } if ($_POST["buscar_manuals"] != "") {
            include $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . "nw_learning/buscar/resultados.php";
        }



        if ($_GET["m"] == "") {
            
        } else
        if ($_GET["cat"] != "") {
            
        } else {
            echo " <div class='list_manual_categs'>";
            include "categ.php";
            echo "</div>";
        }

        if ($_GET["cat"] != "") {
            echo " <div class='list_manual_categs'>";
            include "objeto.php";
            echo "</div>";
        }

        if ($_GET["m"] != "") {
            
        } else
        if ($_GET["cat"] != "") {
            
        } else
        if ($_GET["MainUrl"] != "") {
            if (!isset($_SESSION["usuario"])) {
                echo "<div class='list_manual'>";
                include "espace_user.php";
                echo "</div>";
            } else {
                $dbd = NWDatabase::database();
                $cau = new NWDbQuery($dbd);
                $sqlu = "select a.url
    from terminales a
    join usuarios b on(a.id=b.terminal) 
    where b.usuario=:usuario";
                $cau->bindValue(":usuario", $_SESSION["usuario"]);
                $cau->prepare($sqlu);
                $cau->exec();
                $cau->next();
                $arrayUP = $cau->assoc();
                if ($arrayUP["url"] == $_GET["MainUrl"]) {
                    if (isset($_SESSION["usuario"])) {
                        include "cuenta.php";
                    }
                } else {
                    echo "<div class='list_manual'>";
                    include "espace_user.php";
                    echo "</div>";
                }
            }
        }
        if ($_GET["account"] == "account") {
            echo "<div class='account'>";
            include "redirec.php";
            echo "</div>";
        }

        echo "<div class='clear'></div>";
        echo "</div>";
        echo "<div id='popup_carga_note'></div>";
        ?>
        <?php
        if (file_exists($file_nwlib)) {
            ?>
        </body>
    </html>
    <?php
}
?>
