<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
<style type="text/css">
    #contenedor_total{
        border: 0!important;
    }
</style>
<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
      $ruta_enlaces = "/nwlib/modulos/";
     echo '<script type="text/javascript" src="nw_learning/js/jquery-1.4.2.min.js" ></script>';
} else {
//MYSQL NWPROJECT
      $ruta_enlaces = "/nwproject/php/modulos/";
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
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
$cl_v = 54750;


//$url_navega="http://".$_SERVER['HTTP_HOST'].":".$_SERVER['SERVER_PORT']. $_SERVER['REQUEST_URI'];
$url_navega = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
?>
<link rel="stylesheet" type="text/css" href="css/style.css">
<link rel="stylesheet" type="text/css" href="css/component.css">

<script type="text/javascript" src="js/jquery-1.4.2.min.js" ></script>
<!--<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.22/jquery-ui.min.js"></script> -->

<div id="contenedor_total">
    <div class="list_manual">
        <?php
        if ($_GET["m"] != "") {
            
        } else
        if ($_GET["cat"] != "") {
            
        } else {
            include "manuales.php";
        }
        ?>
    </div>
    <div class="list_manual_categs">
        <?php
        if ($_GET["m"] == "") {
            
        } else
        if ($_GET["cat"] != "") {
            
        } else {
            include "categ.php";
        }
        ?>
    </div>
    <div class="list_manual_categs">
        <?php
        if ($_GET["cat"] != "") {
            include "objetos.php";
        }
        ?>
    </div>
    <div class="clear">

    </div>
</div>
<script type="text/javascript">
    function cargar_object_hoja(id, cat, id_atras) {
        //  $(".hoja_man_carga").remove;
        // $('#hoja_man').append("<div class='hoja_man_carga'>");
        $('.hoja_man_carga').fadeIn('slow');
        $(".hoja_man_carga").load("objetos_carga.php", {id: id, cat: cat, id_atras: id_atras});
        // $('#hoja_man').append("</div>");
    }
    ;
    function cargar_object_atras(id, cat, id_atras) {
        //  $(".hoja_man_carga").remove;
        // $('#hoja_man').append("<div class='hoja_man_carga'>");
        $('.hoja_man_carga').fadeIn('slow');
        $(".hoja_man_carga").load("objetos_carga.php", {id: id, cat: cat, id_atras: id_atras});
        // $('#hoja_man').append("</div>");
    }
    ;
    function cargar_popup(id) {
        $('#popup_carga_note').fadeIn('slow');
        //$("#popup_carga_note").dialog('destroy');
        $("#popup_carga_note").load("info_popup.php", {id: id});
    }
    ;
</script>
<div id="popup_carga_note"></div>