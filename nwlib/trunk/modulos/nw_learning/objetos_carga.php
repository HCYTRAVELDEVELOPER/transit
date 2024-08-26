<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
include "config_img.php";
require "cryp.php";
$java_atras = "";
//
$categoria_post = $_POST["cat"];
//    $e = new encript;
//    $tem = $e->encode($array["id"], $cl_v);
//    $code_script = encript::$string; // valor encriptado
//    encript::decode($_POST["cat"], $cl_v);
//    $decode_script = encript::$string; // valor desencriptado
//    alert($decode_script);
//
//    $categoria_post = $decode_script;
$next_object = "";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cba = new NWDbQuery($db);

$sql = "select a.*,b.imagen 
        from man_objetos a
        left join man_hojas b on (a.hoja=b.id) where a.id=:id_post order by a.orden limit 1";
$ca->bindValue(":id_post", $_POST["id"]);

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
//for ($i = 0; $i < $ca->size(); $i++) {
$ca->next();
$array = $ca->assoc();
//    print_r($array);
$sql_atras = "select id,nombre from man_objetos where id<:id and orden <:orden and categoria=:categoria order by orden desc limit 1";
$cba->bindValue(":id", $array["id"]);
$cba->bindValue(":orden", $array["orden"]);
$cba->bindValue(":categoria", $categoria_post);
$cba->prepare($sql_atras);
if (!$cba->exec()) {
    echo "fasdfsadf fsd fsad fsadf sda";
    //return;
}
if ($cba->size() == 0) {
    $id_atras = "0";
}
for ($ii = 0; $ii < $cba->size(); $ii++) {
    $cba->next();
    $array_atras = $cba->assoc();
    $id_atras = $array_atras["id"];
}
$sql_next = "select id,nombre from man_objetos where id<>:id and orden >:orden and categoria=:categoria order by orden asc limit 1";
$cb->bindValue(":id", $array["id"]);
$cb->bindValue(":orden", $array["orden"]);
$cb->bindValue(":categoria", $categoria_post);
$cb->prepare($sql_next);
if (!$cb->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda. ";
    return;
}
if ($cb->size() == 0) {
    $java_next = "0";
    $java_end = "<div class='contend_button_next'><a class='button_next button_next_tema' href='javascript:history.back()'> Finalizar</a><a class='button_next button_next_tema' href='nw_learning.php'> Siguiente tema</a><a class='button_atras' href='javascript:cargar_object_atras(" . $id_atras . "," . $categoria_post . ", " . $id_atras . ")'> << Atrás</a></div>";
    //return;
}
for ($ii = 0; $ii < $cb->size(); $ii++) {
    $cb->next();
    $array_nex = $cb->assoc();
    $next_object = "<br />" . $array_nex["nombre"] . "";
    if ($id_atras == "0") {
        $atras_object = "<br />";
    } else {
        $atras_object = "<br />" . $array_atras["nombre"] . "";
    }
    $java_next = "<div class='button_next' onclick='javascript:cargar_object_hoja(" . $array_nex["id"] . "," . $categoria_post . "," . $array["id"] . ")'><strong>Siguiente >></strong> $next_object</div>";
    $java_atras = "<a class='button_atras' href='javascript:cargar_object_atras(" . $id_atras . "," . $categoria_post . ", " . $id_atras . ")'><strong><< Atrás</strong> $atras_object</a>";
}
?>
<div id="<?php echo $array["id"]; ?>" class="map_carga_img">
    <div id="box_object" class="box_object" style="top: 0px; left: 0px;display: none;">
        <div class="punta_top_two"></div>
        <div class="object_float box_object_left">
            <script>
                decide_taman(<?php echo $array["pos_x"]; ?>);
            </script>
            <div class="cerrar_opacity">x</div>
            <strong>Paso <?php echo $array["orden"]; ?></strong>
            <h3 class="h3_title_box">
                <?php echo $array["nombre"]; ?>
            </h3>
            <div id="descrip_box">
                <p>
                    <?php
                    echo $array["descripcion"];
                    ?>
                </p>
                <div id="carga_voice"></div>
                <?php
                if ($_GET["embed"] == true) {
                    $scroll_top = $array["pos_y"];
                   
                } else {
                    if ($array["pos_y"] < "250") {
//                        $scroll_top = 200;
                        $scroll_top = 10;
                    } else if ($array["pos_y"] <= "400") {
                        $scroll_top = $array["pos_y"] / 2;
                    } else {
                        $scroll_top = $array["pos_y"] / 1.1;
                    }
                }
                
                $pos_y = $array["pos_y"];
                $pos_x = $array["pos_x"];
                $hoja_x = $array["hoja_x"];
                $hoja_y = $array["hoja_y"];
                $zoom = $array["zoom"];
                if ($array["hoja_x"] == "" & $array["hoja_y"] == "" & $array["zoom"] == "") {
                    $hoja_x = "0";
                    $hoja_y = "0";
                    $zoom = "1";
                }

                $id_p = $array["id"];
                $e = new encript;
                $tem = $e->encode($id_p, $cl_v);
                $code_script = encript::$string; // valor encriptado
                ?>
                <script type="text/javascript">
                    oculta_box();
                    function carga() {
                        scroll_object_x_y(<?php echo $scroll_top ?>,<?php echo $pos_y ?>,<?php echo $pos_x ?>);
                        var id_p = "<?php echo $code_script ?>";
                        fram_voic(id_p);
                        scaleNormal();
                        drag_anime_object(<?php echo $zoom; ?>,<?php echo $hoja_x; ?>,<?php echo $hoja_y; ?>);
                    }
                </script>
            </div>
            <div class='contend_button_next'>
                <?php
                if ($java_next == "0") {
                    echo $java_end;
                } else {
                    echo $java_next;
                    ?>
                    <script type="text/javascript">
                        function PulsarTeclaAdelante(e) {
                            var e = e || event;
                            tecla = event.keyCode;
                            if (tecla == 39) {
                                // alert("Siguiente 39");
                                cargar_object_hoja(<?php echo $array_nex['id'] . "," . $categoria_post . "," . $array['id'] ?>);
                            }
                        }
                        window.onkeydown = PulsarTeclaAdelante;</script>
                    <?php
                }

                if ($id_atras == "0") {
                    
                } else {
                    echo $java_atras;
                    ?>
                    <script type="text/javascript">
                        function PulsarTeclaAdelanteAtras(e) {
                            var e = e || event;
                            tecla = event.keyCode;
                            if (tecla == 39) {
                                // alert("Siguiente 39");
                                cargar_object_hoja(<?php echo $array_nex['id'] . "," . $categoria_post . "," . $array['id'] ?>);
                            }
                            if (tecla == 37) {
                                //alert("Atras 37");
                                cargar_object_atras(<?php echo $id_atras . "," . $categoria_post . ", " . $id_atras ?>);
                            }
                        }
                        window.onkeydown = PulsarTeclaAdelanteAtras;</script>
                    <?php
                }
                if ($java_next == "0") {
                    ?>
                    <script type="text/javascript">
                        function PulsarTeclaAtras(e) {
                            var e = e || event;
                            tecla = event.keyCode;
                            if (tecla == 37) {
                                cargar_object_atras(<?php echo $id_atras . "," . $categoria_post . "," . $id_atras; ?>);
                            }
                        }
                        window.onkeydown = PulsarTeclaAtras;</script>
                    <?php
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
//             
//            $ruta_imagen = $array["imagen"];
//            $ruta_nw = "imagenes";
//            $width_get = "&w=1000";
//            $ruta_localhost_phpthumb = "http://" . $_SERVER['HTTP_HOST'] . $ruta_phpthumb . $url_enl_pr_los . $ruta_imagen . $width_get;
//            $ruta_localhost_sin_phpthumb = $url_enl_pr_los . $ruta_imagen;
//            $ruta_externa_thumb = $ruta_phpthumb . $ruta_imagen;
//            $ruta_externa = $ruta_imagen;
//            $ruta_localhost = $ruta_localhost_sin_phpthumb;
//
//            $ruta_img = explode("/", $ruta_imagen);
//            if ($ruta_img[1] == $ruta_nw) {
//                $ruta_imagen = $ruta_localhost;
//            } else {
//                $ruta_imagen = $ruta_externa;
//            }
//            $file_ok = $ruta_imagen;
//            if (@fopen("$file_ok", "r")) {
//                
//               echo  "<img onload=\"carga();\" id='img_id' class='img_full' src='$file_ok' />";
//                
//            } else {
//                echo "<h3 class='no_found_contend'>Lo sentimos, La imagen que intenta cargar no existe o no está disponible. Intente de nuevo.</h3>.";
//                echo "<a class='' href='javascript:history.back()' >Volver</a>";
//                return;
//            }
        }
        ?>
    </div>
</div>
</div>
<div class="espace"></div>
<div id="myDivLoadingObject" style="display: none;">
    <div class="la-anim-10 la-animate"></div>
    <h1 class="h1_carga">
        Cargando... por favor espere
    </h1>
</div>



