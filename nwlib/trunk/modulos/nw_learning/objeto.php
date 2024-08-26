<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/";
//     echo '<script type="text/javascript" src="nw_learning/js/jquery-1.4.2.min.js" ></script>';
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
?>
<style type="text/css">
    .menu_fix_manuals {
        /*position: relative!important;*/   
    }
</style>
<div class="enc_tuto">
    <?php
//    $e = new encript;
//    $tem = $e->encode($array["id"], $cl_v);
//    $code_script = encript::$string; // valor encriptado

    encript::decode($_GET["cat"], $cl_v);
    $decode_script = encript::$string; // valor desencriptado

    $id_category = $decode_script;
    $dbb = NWDatabase::database();
    $cg = new NWDbQuery($dbb);
    $sqlg = "select a.nombre as nombre_man,b.nombre as nombre_cat,b.publico
            from man_categorias a
            left join man_enc b on (a.man=b.id) where a.id=:cat";
    $cg->bindValue(":cat", $id_category);
    $cg->prepare($sqlg);
    if (!$cg->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda. ";
        return;
    }
    if ($cg->size() == 0) {
        echo "<h3 class='no_found_contend'>No hay objetos que mostrar. Seleccione otra categoria.</h3>.";
        echo "<a class='' href='javascript:history.back()' >Volver</a>";
        return;
    }
    $cg->next();
    $array_t = $cg->assoc();

    if ($array_t["publico"] == "NO") {
        if (session_id() == "") {
            session_start();
        }
        if (!isset($_SESSION["cedula"])) {
            if (!isset($_SESSION["usuario"])) {
                include "login_no_autoriced.php";
                return;
            }
        } else
        if (isset($_SESSION["cedula"])) {
            session_destroy();
        }
    }

    echo "<h1>Manual: " . $array_t["nombre_man"] . " </h1>";
    echo "<h2>Categoría: " . $array_t["nombre_cat"] . "</h2>";
    ?>
    <div class='box_float_right'>
        <a class='button_volver' href='javascript:history.back()'>
            Volver
        </a>
    </div>
    <div class="controls_object">
        <script src="<?php echo $ruta_enlaces; ?>nw_learning/src/slide_jquery/js/simple-slider.js"></script>
        <link href="<?php echo $ruta_enlaces; ?>nw_learning/src/slide_jquery/css/simple-slider.css" rel="stylesheet" type="text/css" />
        <div class="zoom_div"></div>
        <input id="miinput" type="text" value="0.5"  data-slider="true">
        <script>
            scale();
        </script>
        <div class="input_maxi">
            <div id="goFS" class="input_maxi_button">
                Ampliar
            </div>
        </div>
        <!--        <div class="div_button_controls">
                    <div class="addthis_toolbox addthis_default_style addthis_32x32_style">
                        <a class="addthis_button_preferred_1"></a>
                        <a class="addthis_button_preferred_2"></a>
                        <a class="addthis_button_preferred_3"></a>
                        <a class="addthis_button_preferred_4"></a>
                        <a class="addthis_button_compact"></a>
                        <a class="addthis_counter addthis_bubble_style"></a>
                    </div>
                    <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-4def9b610efbce04"></script>
                </div>-->
    </div>
</div>
<div id="hoja_man">
    <div class="hoja_man_carga">
        <?php
        $java_atras = "";
        $categoria_get = $id_category;
        $text_next = "Siguiente";
        $next_object = "";
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $sql = "select a.*,b.imagen 
        from man_objetos a
        left join man_hojas b on (a.hoja=b.id) where a.categoria=:cat order by orden asc limit 1";
        $ca->bindValue(":cat", $id_category);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda. ";
            return;
        }
        if ($ca->size() == 0) {
            echo "<h3 class='no_found_contend'>No hay objetos que mostrar. Seleccione otra categoria.</h3>.";
            echo "<a class='' href='javascript:history.back()' >Volver</a>";
            return;
        }

        $ca->next();
        $array = $ca->assoc();

        $pos_y = $array["pos_y"];
        $pos_x = $array["pos_x"];
        $hoja_x = $array["hoja_x"];
        $hoja_y = $array["hoja_y"];
        $zoom = $array["zoom"];
        if ($array["hoja_x"] == "") {
            $hoja_x = "0";
        }
        if ($array["hoja_y"] == "") {
            $hoja_y = "0";
        }
        if ($array["zoom"] == "") {
            $zoom = "1";
        }

        $sql_next = "select id,nombre from man_objetos where id<>:id and orden >:orden and categoria=:categoria order by orden asc limit 1";
        $cb->bindValue(":id", $array["id"]);
        $cb->bindValue(":orden", $array["orden"]);
        $cb->bindValue(":categoria", $id_category);
        $cb->prepare($sql_next);
        if (!$cb->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda. ";
            //  return;
        }
        if ($cb->size() == 0) {
            $text_next = "Finalizar";
            $java_next = "<div class='contend_button_next'><a class='button_next button_next_tema' href='javascript:history.back()'> Finalizar</a><a class='button_next button_next_tema' href='nw_learning.php'> Siguiente tema</a></div>";
            //  return;
        }
        for ($ii = 0; $ii < $cb->size(); $ii++) {
            $cb->next();
            $array_nex = $cb->assoc();
            $next_object = "<br />" . $array_nex["nombre"];
            $java_next = "<div class='contend_button_next'><a class='button_next' href='javascript:cargar_object_hoja(" . $array_nex["id"] . "," . $categoria_get . "," . $array["id"] . ")'> $text_next . $next_object</a></div>";
        }
        ?>
        <script type="text/javascript">
            $(document).ready(function () {
                drag_anime_object(<?php echo $zoom; ?>,<?php echo $hoja_x; ?>,<?php echo $hoja_y; ?>);
            });
        </script>
        <div id="<?php echo $array["id"]; ?>" class="map_carga_img" style="top: 0px; left: 0px;" draggable=true>
            <div id="box_object" class="box_object" style="top: 0px; left: 0px;display: none;">
                <div class="punta_top_two"></div>
                <div class="object_float box_object_left">
                    <script>
                        decide_taman(<?php echo $array["pos_x"]; ?>);
                    </script>
                    <div class="cerrar_opacity">x</div>
                    <strong>Paso <?php echo $array["orden"]; ?></strong>
                    <p>
                        <?php echo $array["nombre"]; ?>
                    </p>
                    <div id="descrip_box">
                        <p>
                            <?php
                            echo $array["descripcion"];
                            ?>
                        </p>
                        <div id="carga_voice"></div>
                    </div>
                    <div class='contend_button_next'>
                        <script type="text/javascript">
                            function PulsarTecla(e) {
                                var e = e || event;
                                tecla = event.keyCode;
                                if (tecla == 39) {
                                    cargar_object_hoja(<?php echo $array_nex['id'] . "," . $categoria_get . "," . $array['id'] ?>);
                                }
                            }

                            window.onkeydown = PulsarTecla;

                        </script>
                        <?php
                        echo $java_next;
                        if ($id_atras == "0") {
                            
                        } else {
                            echo $java_atras;
                        }
                        ?>
                        <div class="clear"></div>
                    </div>
                </div>
            </div>
            <div id='img_remove' class='box_img'>
                <?php
                if ($array["imagen"] == "" || $array["imagen"] == "") {
                    echo "<h3 class='no_found_contend'>Lo sentimos, La imagen que intenta cargar no existe o no está disponible. Intente mas tarde.</h3>.";
                    echo "<a class='' href='javascript:history.back()' >Volver</a>";
                    return;
                } else {
                    echo "<img onload=\"carga();\" id='img_id' class='img_full' src='" . $host_software . $array["imagen"] . "' />";

//                    $ruta_imagen = $array["imagen"];
//                    $ruta_nw = "imagenes";
//                    $width_get = "&w=1000";
//                    $ruta_localhost_phpthumb = "http://" . $_SERVER['HTTP_HOST'] . $ruta_phpthumb . $url_enl_pr_los . $ruta_imagen . $width_get;
//                    $ruta_localhost_sin_phpthumb = $url_enl_pr_los . $ruta_imagen;
//                    $ruta_externa_thumb = $ruta_phpthumb . $ruta_imagen;
//                    $ruta_externa = $ruta_imagen;
//                    $ruta_localhost = $ruta_localhost_sin_phpthumb;
//
//                    $ruta_img = explode("/", $ruta_imagen);
//                    if ($ruta_img[1] == $ruta_nw) {
//                        $ruta_imagen = $ruta_localhost;
//                    } else {
//                        $ruta_imagen = $ruta_externa;
//                    }
//                    $file_ok = $ruta_imagen;
//                    if (@fopen("$file_ok", "r")) {
//                        echo "<img id='img_id' class='img_full' src='" . $file_ok . "' />";
//                    } else {
//                        echo "<h3 class='no_found_contend'>Lo sentimos, La imagen que intenta cargar no existe o no está disponible. Intente de nuevo.</h3>.";
//                        echo "<a class='' href='javascript:history.back()' >Volver</a>";
//                        return;
//                    }
                }
                ?>
            </div>
        </div>
    </div>
</div>
<div id="myDivLoadingObject">
    <div class="la-anim-10 la-animate"></div>
    <h1 class="h1_carga">
        Cargando... por favor espere
    </h1>
</div>
<div id="temporal">
    <?php
    if ($array["pos_y"] < "250") {
        $scroll_top = 10;
    } else if ($array["pos_y"] <= "400") {
        $scroll_top = $array["pos_y"] / 2;
    } else {
        $scroll_top = $array["pos_y"] / 1.1;
    }

    $id_p = $array["id"];
    $e = new encript;
    $tem = $e->encode($id_p, $cl_v);
    $code_script = encript::$string; // valor encriptado
//    encript::decode($tem, $cl_v);
//    $decode_script = encript::$string; // valor desencriptado
    ?>
    <script type="text/javascript">

        $(document).ready(function () {
            function PulsarTeclaEnter(e) {
                var e = e || event;
                tecla = event.keyCode;
                if (tecla == 13) {
                    var id_p = "<?php echo $code_script ?>";
                    scroll_object_x_y(<?php echo $scroll_top ?>,<?php echo $array["pos_y"] ?>,<?php echo $array["pos_x"] ?>);
                    fram_voic(id_p);
                    fond_opace();
                    window.onkeydown = PulsarTecla;
                    $('#popup_carga_note').fadeOut('slow');
                    $('#popup_carga_note').remove();
                    $('#temporal').remove();
                    $("#popup_carga_note").dialog('destroy');
                }
            }
            window.onkeydown = PulsarTeclaEnter;
        });
    </script>
</div>
<script type="text/javascript">

    $(document).ready(function () {

        $('#popup_carga_note').click(function () {
            var id_p = "<?php echo $code_script ?>";
            fond_opace();
            scroll_object_x_y(<?php echo $scroll_top ?>,<?php echo $array["pos_y"] ?>,<?php echo $array["pos_x"] ?>);
            fram_voic(id_p);
//            window.onkeydown = PulsarTecla;
            $('#popup_carga_note').fadeOut('slow');
            $('#popup_carga_note').remove();
            $('#temporal').remove();
            $("#popup_carga_note").dialog('destroy');
        });
        oculta_box();
        $(window).scroll(function () {
            OnScrollDivConsole();
        });

    });
</script>
<div class="box_code_genera">
    Insertar este tutorial en tu web, copia y pega el código html
    <br />
    <script type="text/javascript">
        $(document).ready(function () {
            var he = document.getElementById("contenedor_total").offsetHeight;
            var we = document.getElementById("contenedor_total").offsetWidth;
            $("#div_frame").css({position: "relative", width: "1000px", height: "0", paddingBottom: "70%"});
//            $(".input_genera_code").val($(".input_genera_code").val() + "<iframe src='<?php echo $url_navega_man; ?>' width='" + we + "px' height='" + he + "px' scrolling='auto' frameborder='0' ></iframe>");
            $(".input_genera_code").val($(".input_genera_code").val() + "<iframe src='<?php echo $url_navega_man; ?>' width='100%' height='100%' scrolling='no' frameborder='0' style='min-height: 100%;' ></iframe>");
            cargar_popup(<?php echo $array["categoria"]; ?>);
        });
    </script>
    <input class="input_genera_code" type="text" value="" />
</div>
