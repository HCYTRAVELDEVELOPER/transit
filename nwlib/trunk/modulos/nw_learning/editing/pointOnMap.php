<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link href='/nwlib6/css/pointOnMap/tipo_uno.css' rel='stylesheet' type='text/css' />
        <?php
        $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
        $ruta_enlaces = "";
        if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
            include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
            ?>
            <link rel="stylesheet" href="../js/jquery-ui.css">
    <!--                                                <script type="text/javascript" src="../js/jquery-1.4.2.min.js" ></script>
                                                <script type="text/javascript" src="/nwlib6/includes/jquery/jquery-ui.min.js" ></script>-->
            <!--            
            -->            <script src="../js/jquery-1.10.2.js"></script>
            <script src="../js/jquery-ui.js"></script>
            <?php
            $ruta_enlaces = "";
        } else {
//MYSQL NWPROJECT
            $ruta_enlaces = "/nwproject/php/modulos/";
            include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
        }
        $id = "";
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
        }
        if ($id != "") {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("man_objetos a left join man_hojas b ON(a.hoja=b.id)", "a.*,b.imagen", "a.id=:id");
            $ca->bindValue(":id", $id);
            if (!$ca->exec()) {
                echo "No se pudo consultar, error: " . $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {
                echo "No existe este objeto";
                return;
            }
            $ca->next();
            $object = $ca->assoc();
        }

        global $man;
        global $categ;
        $man = "";
        $categ = "";
        if (isset($_GET["man"])) {
            $man = $_GET["man"];
        }
        if (isset($_POST["man"])) {
            $man = $_POST["man"];
        }
        if (isset($_GET["categ"])) {
            $categ = $_GET["categ"];
        }
        if (isset($_POST["categ"])) {
            $categ = $_POST["categ"];
        }

//        function loadOthersObjects($p) {
        function loadOthersObjects($p, $hoja, $man) {
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
//            $ca->prepareSelect("man_otros_objetos", "*", " id_object=:id_object order by id_orden asc");
            $ca->prepareSelect("man_otros_objetos", "*", " hoja=:hoja and man=:man order by id_orden asc");
            $ca->bindValue(":id_object", $p);
            $ca->bindValue(":hoja", $hoja);
            $ca->bindValue(":man", $man);
            if (!$ca->exec()) {
                echo "no se pudo consultar..." . $ca->lastErrorText();
                return;
            }
            $total = $ca->size();
            if ($total == 0) {
                return;
            }
            ?>
            <script>
                im = 1;
            </script>
            <?php
            for ($i = 0; $i < $total; $i++) {
                $ca->next();
                $r = $ca->assoc();
                if ($r["tipo"] == "box") {
                    echo "<div id='" . $r["id"] . "' style='height: " . $r["height"] . "px;width: " . $r["width"] . "px;top: " . $r["pos_y"] . "px; left: " . $r["pos_x"] . "px;'  name='box' class='box_object box_object_added box_object" . $r["id_orden"] . "'><div class='delayText'>Delay<input class='delay_" . $r["id_orden"] . "' value='" . $r["delay"] . "' /></div><div class='remove' name='" . $r["id_orden"] . "'>x</div><textarea class='textAreaUbics textarea" . $r["id_orden"] . "' >" . $r["descripcion"] . "</textarea><div class='ordenShow'>" . $r["id_orden"] . "</div><div class='punta_top_two'></div><span><div class='pointer_on_map_icono'></div></span></div>";
                } else
                if ($r["tipo"] == "cuadro") {
                    echo "<div name='cuadro' id='" . $r["id"] . "' style='height: " . $r["height"] . "px;width: " . $r["width"] . "px;top: " . $r["pos_y"] . "px; left: " . $r["pos_x"] . "px;' class='addCuadroBox box_object_added box_object" . $r["id_orden"] . "'><div class='delayText'>Delay<input class='delay_" . $r["id_orden"] . "'  value='" . $r["delay"] . "' /></div><div class='remove' name='" . $r["id_orden"] . "'>x</div><div class='ordenShow'>" . $r["id_orden"] . "</div></div>";
                }
            }
            ?>
            <script>
                im = <?php echo $r["id_orden"]; ?> + 1;
            </script>
            <?php
        }

        function images() {
            global $man;
            global $categ;
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("man_hojas", "*", " man=:man and categoria=:categ");
            $ca->bindValue(":man", $man);
            $ca->bindValue(":categ", $categ);
            if (!$ca->exec()) {
                echo "no se pudo consultar..." . $ca->lastErrorText();
                return;
            }
            $total = $ca->size();
            if ($total == 0) {
                echo "no hay datos man_hojas";
                return;
            }
            for ($i = 0; $i < $total; $i++) {
                $ca->next();
                $r = $ca->assoc();
                echo "<div class='imgSelector'><img class='ImgSelect ImgSelect" . $r["id"] . "' name='" . $r["id"] . "' width='100' src='" . $r["imagen"] . "' /></div>";
            }
        }

        function orden() {
            global $man;
            global $categ;
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("man_objetos", "orden", "man=:man and categoria=:categ order by id desc limit 1");
            $ca->bindValue(":man", $man);
            $ca->bindValue(":categ", $categ);
            if (!$ca->exec()) {
                echo "no se pudo consultar..." . $ca->lastErrorText();
                return;
            }
            $total = $ca->size();
            if ($total > 0) {
                $ca->next();
                $r = $ca->assoc();
                $orden = $r["orden"] + 1;
            } else {
                $orden = 1;
            }
            echo '<input type="hidden" name="orden" class="orden" value="' . $orden . '" />';
        }
        ?>
        <link href="css/style.css" rel="stylesheet" type="text/css" charset="utf-8"/>
        <script>
            $(document).ready(function () {
                $(".box_object").draggable();
                $(".addCuadroBox").draggable();
                $(".addCuadroBox").resizable();
                $(".box_object").resizable();
                $(".img_full").draggable();
                var ElementosMitexto = $(".box_object_added");
                var total = ElementosMitexto.length;
                if (typeof im == "undefined") {
                    if (total == 0) {
                        im = 1;
                    } else {
                        im = total + 1;
                    }
                }
                $(".remove").click(function () {
                    var id = $(this).attr("name");
                    $(".box_object" + id).remove();
                });
                $(".addBox").click(function () {
                    $('#center').append("<div name='box' class='box_object box_object_added box_object" + im + "'><div class='punta_top_two'></div><span><div class='pointer_on_map_icono'></div></span><div class='ordenShow'>" + im + "</div><div class='delayText'>Delay<input class='delay_" + im + "' /></div><div class='remove' name='" + im + "'>x</div><textarea class='textAreaUbics textarea" + im + "'></textarea></div>");
                    $(".box_object" + im).draggable();
                    $(".box_object" + im).resizable();
                    im++;
                });
                $(".addCuadro").click(function () {
                    $('#center').append("<div name='cuadro' class='addCuadroBox box_object_added box_object" + im + "'></div>");
                    $(".box_object" + im).draggable();
                    $(".box_object" + im).resizable();
                    im++;
                });
                $(".ImgSelect").click(function () {
                    $(".ImgSelect").removeClass("imgSeleccionada");
                    $(this).addClass("imgSeleccionada");
                    var id = $(this).attr("name");
                    var img = $(this).attr("src");
                    $(".box_img").remove();
                    $('#center').append("<div class='box_img'><img id='img_id' name='" + id + "' class='img_full' src='" + img + "' /></div>");
                });
                $("#save").click(function () {
<?php
if ($id != "") {
    ?>
                        saveFinal(<?php echo $id; ?>, "true");
    <?php
} else {
    ?>
                        save();
    <?php
}
?>
                });
            });
            function save() {
                var url = "srv/consultaID.php";
                $.ajax({
                    type: "POST",
                    url: url,
                    error: function () {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function (data) {
                        saveFinal(data);
                    }
                });
                return false;
            }
            function saveOtrosObjects(p) {
                var url = "srv/saveOthers.php";
                var data = p;
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    error: function () {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function (data) {
                        console.log(data);
                        if (data != "") {
                            alert(data);
                        }
                    }
                });
                return false;
            }
            function deleteObjects(man, hoja) {
                var data = {};
                data.man = man;
                data.hoja = hoja;
                var url = "srv/deleteOthers.php";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    error: function () {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function (data) {
                        console.log(data);
                        if (data != "") {
                            alert(data);
                        } else {
//                            saveObjects(p);
                        }
                    }
                });
                return false;
            }
            function saveFinal(id, upda) {
                if (upda == undefined) {
                    upda = "false";
                }
                var ElementosMitexto = $(".box_object_added");
                var total = ElementosMitexto.length;
                var man = $(".man").val();
                var categ = $(".categoria").val();
                var nombre = $(".nombre").val();
                var descripcion = $(".descripcion").val();
                var img = $("#img_id").attr("name");
                if (nombre == "") {
                    alert("Debe poner un título");
                    return;
                }
                if (descripcion == "") {
                    alert("Debe poner una descripción");
                    return;
                }
                if (img == undefined) {
                    alert("Seleccione una imagen");
                    return;
                }
                console.log(im);
                deleteObjects(man, img);
//                if (total > 0) {
                if (im > 0) {
//                    for (var i = 0; i < total; i++) {
                    for (var i = 0; i < im; i++) {
                        var num = i + 1;
                        var existe = $('.box_object' + num).length;
                        if (existe != 0) {
                            var descripcion = $(".textarea" + num).val();
                            var p = $(".box_object" + num).position();
                            var id_o = $(".box_object" + num).attr("id");
                            var tipo = $(".box_object" + num).attr("name");
                            var width = $(".box_object" + num).width();
                            var height = $(".box_object" + num).height();
                            var delay = $(".delay_" + num).val();
                            if (id_o == undefined) {
                                id_o = "false";
                            }
                            var lefto = p.left;
                            var topo = p.top;
                            var dat = {man: man, categoria: categ, id_object: id, id_orden: num, pos_x: lefto, pos_y: topo, nombre: "test", descripcion: descripcion, hoja: img, tipo: tipo, width: width, height: height, update: upda, id: id_o, delay: delay};
                            saveOtrosObjects(dat);
                        }
                    }
                }
                var url = "srv/save.php";
                var data = $("#form").serialize();
                var left = document.getElementById('x1y1').offsetLeft;
                var top = document.getElementById('x1y1').offsetTop;
                data += "&pos_x=" + left + "&pos_y=" + top + "&id_imagen=" + img + "&id=" + id + "&update=" + upda;
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    error: function () {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function (data) {
                        alert(data);
                        window.location = "?man=" + man + "&categ=" + categ + "&id=" + id;
                    }
                });
                return false;
            }
            function scroll(p) {
                var top = $(p).offset().top - 100;
                $('.imagenes').animate({
                    scrollTop: top
                }, 1000);
            }
            function addClassImgSelected(id) {
                $(".ImgSelect" + id).addClass("imgSeleccionada");
                scroll('.imgSeleccionada');
            }
        </script>
    </head>
    <body>
        <div id="contenedor">
            <div class="container_left">
                <form id="form">
                    <input type="hidden" name="hoja_x" class="hoja_x" value="<?php
                    if (isset($object["hoja_x"])) {
                        echo $object["hoja_x"];
                    } else {
                        echo "0";
                    }
                    ?>" />
                    <input type="hidden" name="hoja_y" class="hoja_y" value="<?php
                    if (isset($object["hoja_y"])) {
                        echo $object["hoja_y"];
                    } else {
                        echo "0";
                    }
                    ?>" />
                    <input type="hidden" name="zoom" class="zoom" value="<?php
                    if (isset($object["zoom"])) {
                        echo $object["zoom"];
                    } else {
                        echo "1";
                    }
                    ?>" />
                    <input type="hidden" name="man" class="man" value="<?php echo $man; ?>" />
                    <input type="hidden" name="categoria" class="categoria" value="<?php echo $categ; ?>" />
                    <?php
                    if ($id != "") {
                        echo '<input type="hidden" name="orden" class="orden" value="' . $object["orden"] . '" />';
                    } else {
                        orden();
                    }
                    ?>
                    <div class="box">
                        Título
                        <input type="text" name="nombre" class="nombre" value="<?php
                        if (isset($object["nombre"])) {
                            echo $object["nombre"];
                        }
                        ?>" />
                    </div>
                    <div class="box">
                        Tiempo de lectura (minutos)
                        <input type="number" name="texto_audio" value="<?php
                        if (isset($object["texto_audio"])) {
                            echo $object["texto_audio"];
                        }
                        ?>" />
                    </div>
                    <div class="box">
                        Descripción
                        <textarea  name="descripcion" class="descripcion" ><?php
                            if (isset($object["descripcion"])) {
                                echo $object["descripcion"];
                            }
                            ?></textarea>
                    </div>
                    <input class="buttonGreen buttonSave" id="save" type="button" value="Guardar" />
                </form>
            </div>
            <div class="brocha">
                Imágenes
                <div class="box imagenes">
                    <?php
                    images();
                    ?>
                </div>
                <div class="box">
                    <div class="addBox">                   
                        Agregar box
                    </div>
                    <div class="addCuadro">                   
                        Agregar Cuadro
                    </div>
                </div>
            </div>
            <div class="center" id="center">
                <div class="contendImg" id="contendImg">
                    <?php
                    if ($id != "") {
                        loadOthersObjects($id, $object["hoja"], $object["man"]);
                    }
                    if (isset($object["hoja"])) {
                        echo "<div class='box_img'><img id='img_id' name='" . $object["hoja"] . "' class='img_full' src='" . $object["imagen"] . "' /></div>";
                        ?>
                        <script>
                            addClassImgSelected(<?php echo $object["hoja"]; ?>);
                        </script>
                        <?php
                    }
                    ?>
                    <div  style="<?php
                    if (isset($object["pos_x"])) {
                        echo "left: " . $object["pos_x"] . "px;";
                    }
                    if (isset($object["pos_y"])) {
                        echo "top: " . $object["pos_y"] . "px;";
                    }
                    ?>" id='x1y1' class='box_object'><div class='punta_top_two'></div><span><div class='pointer_on_map_icono'></div></span></div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
