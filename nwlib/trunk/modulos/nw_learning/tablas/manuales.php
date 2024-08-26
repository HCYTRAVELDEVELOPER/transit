<?php
echo "hola";
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
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

echo "ID paso post:" . $_POST["id"];
$id_c = $_POST["id"];
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
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
    //print_r($array);
    ?>
    <div class="box_info_popup">
        <h3>
            <?php echo $array["nombre"]; ?>
        </h3>
        <strong>
            Descripción General: 
        </strong>
        <p>
            <?php
            if ($array["descripcion"] == "") {
                echo "<br />No hay descripción disponible para este tema.<br /><br />";
            } else {
                echo $array["descripcion"];
            }
            ?>
        </p>
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

                 $ruta_imagen = $array_all["imagen"];
                    $ruta_nw = "imagenes";
                    $width_get = "&w=1000";
                    $ruta_localhost_phpthumb = "http://" . $_SERVER['HTTP_HOST'] . $ruta_phpthumb . $url_enl_pr_los . $ruta_imagen . $width_get;
                    $ruta_localhost_sin_phpthumb = $url_enl_pr_los . $ruta_imagen;
                    $ruta_externa_thumb = $ruta_phpthumb . $ruta_imagen;
                    $ruta_externa = $ruta_imagen;
                    $ruta_localhost = $ruta_localhost_sin_phpthumb;

                    $ruta_img = explode("/", $ruta_imagen);
                    if ($ruta_img[1] == $ruta_nw) {
                        $ruta_imagen = $ruta_localhost;
                    } else {
                        $ruta_imagen = $ruta_externa;
                    }
                    $file_ok = $ruta_imagen;
                    if (@fopen("$file_ok", "r")) {
                        echo "<img onload='enabled_all($i_img)' id='img_id' class='img_full' src='" . $file_ok . "' />";
                       
                    } else {
                        echo "<h3 class='no_found_contend'>Lo sentimos, La imagen que intenta cargar no existe o no está disponible. Intente de nuevo.</h3>.";
                        echo "<a class='' href='javascript:history.back()' >Volver</a>";
                        return;
                    }
            }
            ?>
        </div>
        <div class="button_red enabled_all_button" id="close" disabled="false">Play</div>
        <!--<a class="button_red" id="close" href="">Cerrar</a>-->
        <!--<a class="button_red" id="ingresa" href="<?php echo $url_gen . "?cat=" . $id_c; ?>">Ingresar</a>-->

        <div class="cargando">
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
$descp_clean = "Bienvenido. Categoría " . $array["nombre"] . ". Oprima la tecla Enter para comenzar.";
?>
<div id="close_bg">
</div>
<iframe src="http://translate.google.com/translate_tts?tl=es&q=<?php echo $descp_clean; ?>" width="0" height="0" scrolling="auto" frameborder="0">
                    <!--<iframe src="/nwproject/php/modulos/text_voz/code/voice_nw.php?tx=<?php echo $orden_voz, $title_voz, $punto, strip_tags($descp_clean); ?>" width="0" height="0" scrolling="auto" frameborder="0">-->
                    </iframe>
<script type="text/javascript">
    count = 0;
    function enabled_all(r) {
        count++;
        var total = <?php echo $total_img ?>;
         if (count == total) {
                $("#popup_carga_note").addClass("enabled_all");
                $("#close").removeClass("enabled_all_button");
                $(".cargando").addClass("no_display");
            }
        return;
    }
    $(document).ready(function() {
        $('#close').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
        $('#close_bg').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
        $('#popup_carga_note').click(function() {
            $('#popup_carga_note').fadeOut('slow');
            $("#popup_carga_note").dialog('destroy');
        });
    });
</script>


