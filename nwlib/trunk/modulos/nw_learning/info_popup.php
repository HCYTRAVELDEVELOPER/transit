<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
      $ruta_enlaces = "/nwlib/modulos/";
//     echo '<script type="text/javascript" src="nw_learning/js/jquery-1.4.2.min.js" ></script>';
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

include "config_img.php";
?>
<style type="text/css">
    .img_full{
        display: none;
    }
    .loading_numbers{
        position: relative;
        background: blue;
        width: 0;
        height: 20px;
        margin: 5px;
    }
    .progreso{
        background-color: green;
        border-radius: 9px;
        border: 0;
        height: 15px;
        width: 100%;
    }
</style>
<?php
$id_c = $_POST["id"];
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$sql = "select * from man_categorias where id=:id_post";
$ca->bindValue(":id_post", $id_c);

$ca->prepare($sql);
if (!$ca->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda. ";
    return;
}
if ($ca->size() == 0) {
    echo "<h3 class='no_found_contend'>No hay información que mostrar. Seleccione otra categoria.</h3>.";
    echo "<a class='' href='javascript:history.back()' >Volver</a>";
    //return;
}
for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $array = $ca->assoc();
    ?>
    <div class="box_info_popup">
        <h3>
            <?php echo $array["nombre"]; ?>
        </h3>
        <br />
        <strong>
            Descripción General: 
        </strong>
        <br />
        <div class="descrip_popup">
            <p>
                <?php
                if ($array["descripcion"] == "") {
                    echo "<br />No hay descripción disponible para este tema.<br /><br />";
                } else {
                    echo $array["descripcion"];
                }
                ?>
            </p>
        </div>
        <div id="contend_precarga_img" class="contend_precarga_img">
            <?php
            $dba = NWDatabase::database();
            $c_all = new NWDbQuery($dba);
            $sqll = "select a.*,b.imagen 
        from man_objetos a
        left join man_hojas b on (a.hoja=b.id) where a.categoria=:cat order by orden";
            $c_all->bindValue(":cat", $id_c);
            $c_all->prepare($sqll);
            if (!$c_all->exec()) {
                echo "No se pudo realizar la consulta de la búsqueda. ";
                return;
            }
            if ($c_all->size() == 0) {
                echo "<h3 class='no_found_contend'>No hay objetos que mostrar. Seleccione otra categoria.</h3>.";
                echo "<a class='' href='javascript:history.back()' >Volver</a>";
                return;
            }
            $total_img = $c_all->size();
            for ($i = 0; $i < $c_all->size(); $i++) {
                $i_img = $i + 1;
                $c_all->next();
                $array_all = $c_all->assoc();
                echo "<img onload='enabled_all($i_img)' id='img_id' class='img_full' src='" . $host_software . $array_all["imagen"] . "' />";

//                $ruta_imagen = $array_all["imagen"];
//                $ruta_nw = "imagenes";
//                $width_get = "&w=1000";
//                $ruta_localhost_phpthumb = "http://" . $_SERVER['HTTP_HOST'] . $ruta_phpthumb . $url_enl_pr_los . $ruta_imagen . $width_get;
//                $ruta_localhost_sin_phpthumb = $url_enl_pr_los . $ruta_imagen;
//                $ruta_externa_thumb = $ruta_phpthumb . $ruta_imagen;
//                $ruta_externa = $ruta_imagen;
//                $ruta_localhost = $ruta_localhost_sin_phpthumb;
//
//                $ruta_img = explode("/", $ruta_imagen);
//                if ($ruta_img[1] == $ruta_nw) {
//                    $ruta_imagen = $ruta_localhost;
//                } else {
//                    $ruta_imagen = $ruta_externa;
//                }
//                $file_ok = $ruta_imagen;
//                if (@fopen("$file_ok", "r")) {
//                    echo "<img onload='enabled_all($i_img)' id='img_id' class='img_full' src='" . $file_ok . "' />";
//                } else {
//                    echo "<h3 class='no_found_contend'>Lo sentimos, La imagen que intenta cargar no existe o no está disponible. Intente de nuevo.</h3>.";
//                    echo "<a class='' href='javascript:history.back()' >Volver</a>";
//                    return;
//                }
            }
            ?>
        </div>
        <div class="show_numbers_loading"></div>
        <div class="button_red enabled_all_button" id="close" disabled="false">Play</div>
        <div class="cargando" style="display: none;">
            <div id="myDivLoadingObject">
                <div class="la-anim-10 la-animate"></div>
                <h1 class="h1_carga">
                    Cargando... por favor espere
                </h1>
            </div>
        </div>
    </div>
    <?php
}
?>
<div id="close_bg">
</div>
<script type="text/javascript">
    $("#popup_carga_note").addClass("popup_carga_note_point_no");
    count = 0;
    function enabled_all() {
        count++;
        var total = <?php echo $total_img ?>;
        //CREA EL CARGANDO
        $(".cargue").remove();
        $(".show_numbers_loading").append("<div class='cargue'>Cargando" + count + " de <?php echo $total_img ?> <br /> <progress class='progreso' value='" + count + "' max='<?php echo $total_img ?>'></progress></div>");
        if (count == total) {
            $("#popup_carga_note").addClass("enabled_all");
            $("#close").removeClass("enabled_all_button");
            $("#close_dos").removeClass("enabled_all_button");
            $(".cargando").addClass("no_display");
        }
        return;
    }
</script>


