<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <?php
        $file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
        $ruta_enlaces = "";
        if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
            include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
            ?>
            <link rel="stylesheet" href="../js/jquery-ui.css">
    <!--                                                <script type="text/javascript" src="../js/jquery-1.4.2.min.js" ></script>
                                                <script type="text/javascript" src="/nwlib/includes/jquery/jquery-ui.min.js" ></script>-->
            <!--            
            -->            <script src="../js/jquery-1.10.2.js"></script>
            <script src="../js/jquery-ui.js"></script>
            <?php
            $ruta_enlaces = "";
        } else {
//MYSQL NWPROJECT
            $ruta_enlaces = "/nwproject/php/modulos/";
            include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animation/_mod.php';
        }
        $id = "";
        if (isset($_GET["id"])) {
            $id = $_GET["id"];
        }
        if (isset($_POST["id"])) {
            $id = $_POST["id"];
        }
        global $id_enc;
        global $escena;
        $id_enc = "";
        $escena = "";
        if (isset($_GET["id_enc"])) {
            $id_enc = $_GET["id_enc"];
        }
        if (isset($_POST["id_enc"])) {
            $id_enc = $_POST["id_enc"];
        }
        if (isset($_GET["escena"])) {
            $escena = $_GET["escena"];
        }
        if (isset($_POST["escena"])) {
            $escena = $_POST["escena"];
        }

        function loadObjects() {
            global $escena;
            global $id_enc;
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("nwanimate_objetos", "*", "id_escena=:escena and id_enc=:id_enc order by id asc");
            $ca->bindValue(":escena", $escena);
            $ca->bindValue(":id_enc", $id_enc);
            if (!$ca->exec()) {
                echo "Error";
                return;
            }
            $total = $ca->size();
            ?>
            <script>
                im = <?php echo $total; ?>;
                person = [];
            </script>
            <?php
            if ($total > 0) {
                for ($i = 0; $i < $total; $i++) {
                    $ca->next();
                    $object = $ca->assoc();
                    $num = $i + 1;
                    $repeticiones = 9;
                    if ($object["repeticiones"] != "") {
                        $repeticiones = $object["repeticiones"];
                    }
                    ?>
                <div  style="<?php
                if (isset($object["pos_x"])) {
                    echo "left: " . $object["pos_x"] . "px;";
                }
                if (isset($object["pos_y"])) {
                    echo "top: " . $object["pos_y"] . "px;";
                }
                if (isset($object["width"])) {
                    echo "width: " . $object["width"] . "px;";
                }
                if (isset($object["height"])) {
                    echo "height: " . $object["height"] . "px;";
                }
                if (isset($object["imagen"])) {
                    echo "background-image: url(" . $object["imagen"] . ");";
                }
                if (isset($object["animado"]) && $object["animado"] == "si") {
                    echo "background-size: cover;";
                }
                ?>" id='object_<?php echo $object["id"]; ?>' class='box_object'>
                      <?php
                      if (isset($object["animado"]) && $object["animado"] == "si") {
                          ?>
                        <div class="buttonBlue buttonAnimar buttonAnimarButton" name="<?php echo $object["id"]; ?>">
                            Movimiento
                        </div>
                        <div class="buttonBlue buttonEditar buttonAnimarButton">
                            Editar
                        </div>
                        <?php
                    }
                    ?>
                </div>
                <script>
                    person[<?php echo $num; ?>] = <?php echo $object["id"]; ?>;
            <?php
            if (isset($object["animado"]) && $object["animado"] == "si") {
                ?>
                        animated(<?php echo $object["id"]; ?>, <?php echo $repeticiones; ?>, 0);
                <?php
            } else {
                
            }
            ?>
            <?php
            if (isset($object["movimiento"]) && $object["movimiento"] == "si") {
                ?>
                        animatedMovimiento(<?php echo $object["id"]; ?>, <?php echo $object["pos_y"]; ?>, <?php echo $object["pos_x"]; ?>,  <?php echo $object["pos_y"]; ?>, <?php echo $object["pos_x"]; ?>, <?php echo $object["pos_y_final"]; ?>, <?php echo $object["pos_x_final"]; ?>, 5000);
                <?php
            } else {
                
            }
            ?>
                </script>
                <?php
            }
        }
    }
    ?>
    <link href="css/style.css" rel="stylesheet" type="text/css" charset="utf-8"/>
    
    <script>
        $(document).ready(function() {
            $(".box_object").draggable();
            $(".box_object").resizable();
            var ElementosMitexto = $(".box_object_added");
            var total = ElementosMitexto.length;
            if (typeof im == "undefined") {
                if (total == 0) {
                    im = 1;
                } else {
                    im = total + 1;
                }
            }
            $(".remove").click(function() {
                var id = $(this).attr("name");
                $(".box_object" + id).remove();
            });
            $(".addBox").click(function() {
                formNew();
            });
            $("#save").click(function() {
                saveFinal();
            });
            $(".buttonAnimar").click(function() {
                var id = $(this).attr("name");
                activaInterpolacionMovimiento(id);
            });
            loadObjects();
        });
        function loadObjects() {
            var escena = $(".addBox").attr("name");
            $("#loadObjects").load("/nwlib/modulos/nw_animate/editing/src/objectsLeft.php", {escena: escena});
        }
        function formNew() {
            var existe = $(".popup").val();
            if (existe != undefined) {
                return;
            }
            var ruta = "src/newObject.php";
            $.ajax({
                url: ruta,
                type: 'post',
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    $('body').append("<div class='popup'></div>");
                    $(".popup").dialog({
                        resizable: true,
                        modal: true,
                        height: '400',
                        width: '600',
                        position: 'center top',
                        close: function() {
                            $(this).empty();
                            $(this).dialog('destroy');
                            $(".popup").remove();
                        },
                        buttons: {
                            'Salir': function() {
                                $(this).dialog('close');
                                $(this).empty();
                                $(".popup").remove();

                            },
                            'Guardar': function() {
                                save();
                                $(this).dialog('close');
                                $(this).empty();
                                $(".popup").remove();
                            }
                        }
                    });
                    $(".popup").append(data);
                }
            });
        }
        function loadObjectsCampus(id) {
            var ruta = "src/objectCampus.php";
            $.ajax({
                url: ruta,
                type: 'post',
                data: {id: id, im: im},
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    im++;
                    $('#contendImg').append(data);
//                    $(".box_object" + id + "").append(data);
                    $("#object_" + id).draggable();
                    $("#object_" + id).resizable();
                }
            });
        }
        function save() {
            var url = "srv/saveObject.php";
            var data = $("#form").serialize();
            var id_enc = $(".addBox").attr("id");
            var escena = $(".addBox").attr("name");
            data += "&id_enc=" + id_enc + "&escena=" + escena;
            console.log(data);
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    loadObjects();
//                    saveFinal();
                    loadObjectsCampus(data);
//                        window.location.reload();
                }
            });
            return false;
        }
        function deleteObjects(man, hoja) {
            var url = "srv/deleteOthers.php";
            $.ajax({
                type: "POST",
                url: url,
                data: {man: man, hoja: hoja},
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert(data);
                    } else {
//                            saveObjects(p);
                    }
                }
            });
        }
        function activaInterpolacionMovimiento(id) {
            $("#object_" + id).addClass("mover_inicial");
            $(".buttonAnimarButton").addClass("display_none");
            $("#center").append("<div class='mensajeStartAnimation'></div>");
            $(".mensajeStartAnimation").load("src/mensajeStartAnimation.php");
            $(".mensajeStartAnimation").addClass("buttonBlue");
            $(".mensajeStartAnimation").fadeIn();
            $(".box_object").addClass("no_anima");
            $("#object_" + id).removeClass("no_anima");
//            setTimeout(function() {
//                $(".mover_inicial").mousedown(function() {
            $(".mover_inicial").mouseup(function() {
                moverInicial(id);
            });
//            }, 2000);
        }
        function activaInterpolacionMovimientoFinal(id, left, top) {
            $("#object_" + id).removeClass("mover_inicial");
            $("#object_" + id).addClass("mover_inicial_final");
            $(".mensajeStartAnimation").remove();
            $(".mensajeStartAnimation").fadeOut();
            $("#center").append("<div class='mensajeStartAnimation'></div>");
            $(".mensajeStartAnimation").load("src/mensajeStartAnimationFinal.php");
            $(".mensajeStartAnimation").addClass("buttonGreen");
            $(".mensajeStartAnimation").fadeIn();
            $(".mover_inicial").mousedown(function() {
                return false;
            });
//            setTimeout(function() {
            $(".mover_inicial_final").mouseup(function() {
                moverFinal(id, left, top);
            });
//            }, 2000);
        }
        function cerrarAnimationStart() {
            $(".box_object").removeClass("no_anima");
            $(".box_object").removeClass("mover_inicial");
            $(".mensajeStartAnimation").remove();
            $(".buttonAnimarButton").removeClass("display_none");
        }
        function moverInicial(id_object) {
            $("#object_" + id_object).removeClass("mover_inicial");
            console.log("inicial");
            var p = $("#object_" + id_object).position();
            var width = $("#object_" + id_object).width();
            var height = $("#object_" + id_object).height();
            var lefto = p.left;
            var topo = p.top;
            activaInterpolacionMovimientoFinal(id_object, lefto, topo);
//            var url = "srv/saveAnimateMovObject.php";
//            var data = p;
//            $.ajax({
//                type: "POST",
//                url: url,
//                data: {id: id_object, pos_x: lefto, pos_y: topo, width: width, height: height},
//                error: function() {
//                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
//                },
//                success: function(data) {
//                    activaInterpolacionMovimientoFinal(data);
//                }
//            });
        }
        function moverFinal(id_object, left, top) {
            console.log("final");
            var p = $("#object_" + id_object).position();
            var width = $("#object_" + id_object).width();
            var height = $("#object_" + id_object).height();
            var lefto = p.left;
            var topo = p.top;
            var url = "srv/saveAnimateMovObjectFinal.php";
            var data = p;
            $.ajax({
                type: "POST",
                url: url,
                data: {id: id_object, pos_x_final: lefto, pos_y_final: topo, pos_x: left, pos_y: top},
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    cerrarAnimationStart();
                }
            });
        }
        function animated(id, rep, vel) {
            var width = $("#object_" + id).width();
            var width_al = width * rep;
            vel += width;
            if (vel >= width_al) {
                vel = 0;
            }
//            $("#object_" + id).animate({backgroundPosition: repeticiones + "px 0px"}, 5000);
//            console.log(id);
//            $('#object_' + id).animate({backgroundPositionX: '0px'}, 500, 'linear');
//            $('#object_' + id).animate({backgroundPositionX: '-' + repeticiones + 'px'}, 7000, 'linear');
            $('#object_' + id).css('backgroundPosition', "-" + vel + "px 0px");
            setTimeout(function() {
                animated(id, rep, vel);
            }, 100);
        }
        var timeoutID;
        function delayedAlert(func, time) {
//            timeoutID = window.setTimeout(func, time);
            timeoutID = setTimeout(func, 3000);
        }
        function clearAlert() {
            window.clearTimeout(timeoutID);
        }
        function animatedMovimiento(id, top, left, pos_y, pos_x, top_final, left_final, vel) {
//            var width = $("#object_" + id).width();
//            var width_al = width * rep;
            top -= 1;
            left += 1;
            if (top >= top_final) {
                top = pos_y;
            }
            if (left >= left_final) {
                left = pos_x;
            }
            $("#object_" + id).css({"top": top, "left": left});
//            $("#object_" + id).animate({"top": top_final + "px", "left": left_final + "px"}, vel);
            setTimeout(function() {
                animatedMovimiento(id, top, left, pos_y, pos_x, top_final, left_final, vel);
            }, 10);
        }
        function saveFinal() {
            var ElementosMitexto = $(".box_object_added");
            var total = ElementosMitexto.length;
            var id_enc = $(".addBox").attr("id");
            var escena = $(".addBox").attr("name");
            if (im > 0) {
                for (var i = 0; i < im; i++) {
                    var num = i + 1;
                    var id_object = person[num];
                    console.log(id_object);
                    var existe = $('#object_' + id_object).length;
                    if (existe != 0) {
                        var p = $("#object_" + id_object).position();
                        var width = $("#object_" + id_object).width();
                        var height = $("#object_" + id_object).height();
                        var lefto = p.left;
                        var topo = p.top;
                        var dat = {id_enc: id_enc, escena: escena, id: id_object, pos_x: lefto, pos_y: topo, width: width, height: height};
                        saveOtrosObjects(dat);
                    }
                }
            }
        }
        function saveOtrosObjects(p) {
            var url = "srv/saveOthers.php";
            var data = p;
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                error: function() {
                    alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                },
                success: function(data) {
                    if (data != "") {
                        alert(data);
                    }
                }
            });
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
        <input class="buttonGreen buttonSave" id="save" type="button" value="Guardar" />
        <div class="capas">
            <div class="box">
                <div class="addBox" id="<?php echo $id_enc; ?>" name="<?php echo $escena; ?>">                   
                    Nuevo Objeto
                </div>
            </div>
            Objetos
            <div class="box imagenes" id="loadObjects">
                <?php
//                    images();
                ?>
            </div>
        </div>
        <div class="center" id="center">
            <div class="contendImg" id="contendImg">
                <?php
                loadObjects($id);
                ?>
            </div>
        </div>
    </div>
</div>
</body>
</html>
