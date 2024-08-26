<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwanimate_objetos", "*", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
if (!$ca->exec()) {
    echo "error";
    return;
}
$total = $ca->size();
if ($total > 0) {
    $ca->next();
    $r = $ca->assoc();
}
$backgroundGlobal = null;
if (isset($r["color"]) && $r["color"] != "" && $r["color"] != null) {
    $backgroundGlobal = $r["color"];
}
$titleName = "Nombre";
$img = "";
$texto = "";
$figure = "";
if (isset($r["tipo"])) {
    if ($r["tipo"] != "" && $r["tipo"] != "undefined" && $r["tipo"] != null) {
        if ($r["tipo"] == "img") {
            $titleName = "Nombre";
            $img = "imagen";
        } else
        if ($r["tipo"] == "text") {
            $titleName = "Text";
            $texto = "texto";
        } else
        if ($r["tipo"] == "figure") {
            $titleName = "Nombre Figura";
            $figure = "figura";
        } else {
            return;
        }
    }
}
if (isset($_POST["tipo"])) {
    if ($_POST["tipo"] != "" && $_POST["tipo"] != "undefined") {
        if ($_POST["tipo"] == "img") {
            $titleName = "Nombre";
            $img = "imagen";
        } else
        if ($_POST["tipo"] == "text") {
            $titleName = "Texto";
            $texto = "texto";
        } else
        if ($_POST["tipo"] == "figure") {
            $titleName = "Nombre Figura";
            $figure = "figura";
        } else
        if ($_POST["tipo"] == "capa") {
            $titleName = "Nombre Capa de Recorte";
        } else {
            return;
        }
    }
}
?>
<form id="form">
    <table>
        <tr>
            <td>
                <label>
                    <?php
                    echo $titleName;
                    $textEditor = "";
                    ?> 
                </label>
                <?php
                if ($titleName == "Texto" || $titleName == "Text") {
                    ?>
                    <script type="text/javascript">
                        function envia_datos_editor(p) {
                            $(".ckediot").val(p);
                        }
                        function cambiarIframe() {
                            var x = window.frames['SubHtmlEditor'].document.getElementById('editor').innerHTML = "<?php
                if (isset($r["nombre"])) {
//                    $textEditor = str_replace(";", "", $r["nombre"]);
                    $textEditor = str_replace('"', "'", $r["nombre"]);
                    echo $textEditor;
                }
                ?>";
                        }
                        $(document).ready(function() {
                            $('#SubHtmlEditor').load(function() {
                                cambiarIframe();
                            });
                            $('.name_input_edit').keyup(function() {
                                var text = $(this).val();
                                window.frames['SubHtmlEditor'].document.getElementById('editor').innerHTML = text;
                            });
                            $(".fuenteHtml").click(function() {
                                $("#SubHtmlEditor").fadeOut(0);
                                $(".fuenteEditor").fadeIn(0);
                                $(".fuenteHtml").fadeOut(0);
                                $(".name_input_edit").fadeIn(0);
                            });
                            $(".fuenteEditor").click(function() {
                                $(".name_input_edit").fadeOut(0);
                                $(".fuenteEditor").fadeOut(0);
                                $("#SubHtmlEditor").fadeIn(0);
                                $(".fuenteHtml").fadeIn(0);
                            });
                        });
                    </script>
                    <a href="javascript:void(0)" class="fuenteHtml">Fuente HTML</a>
                    <a href="javascript:void(0)" class="fuenteEditor" style="display: none;">Editor</a>
                    <iframe src="/nwlib6/modulos/nw_tareas/includes/editor/editor1.php" name="SubHtmlEditor" id="SubHtmlEditor"
                            width="100%" height="230px" scrolling="auto" frameborder="0">
                    <p>Texto alternativo para navegadores que no aceptan iframes.</p>
                    </iframe>
                    <textarea id="respuesta" name="nombre" class="name_input_edit ckediot" style="display: none;"><?php if (isset($r["nombre"])) echo $r["nombre"]; ?></textarea>
                    <?php
                } else {
                    ?>
                    <input class="name_input_edit" type="text" name="nombre" value="<?php if (isset($r["nombre"])) echo $r["nombre"]; ?>" />
                    <?php
                }
                if (isset($_POST["tipo"]) && $_POST["tipo"] != "" && $_POST["tipo"] != "undefined") {
                    ?>
                    <input class="tipo" type="hidden" name="tipo" value="<?php echo $_POST["tipo"]; ?>" />
                    <?php
                }
                ?>
            </td>
            <?php
            if (isset($r["orden"])) {
                ?>
                <td>
                    <label>
                        Orden
                    </label>
                    <input type="text" name="orden" value="<?php if (isset($r["orden"])) echo $r["orden"]; ?>" />
                </td>
                <?php
            }
            ?>
        </tr>
        <?php
        if ($img != "") {
            ?>
            <tr>
                <td>
                    <label>
                        Imágenes agrupadas en una sola? <br />(sprites)
                    </label>
                    <select name="animado">
                        <option <?php
                        if (isset($r["animado"]) && $r["animado"] == "no") {
                            echo " selected='selected' ";
                        }
                        ?> value="no">No</option>
                        <option <?php
                        if (isset($r["animado"]) && $r["animado"] == "si") {
                            echo " selected='selected' ";
                        }
                        ?> value="si">Si</option>
                    </select>
                </td>
                <td>
                    <label>
                        N° Imágenes agrupadas <br />(sprites)
                    </label>
                    <input type="text" name="repeticiones" value="<?php if (isset($r["repeticiones"])) echo $r["repeticiones"]; ?>" />
                </td>
            </tr>
            <?php
        }
        if ($figure != "" || $texto != "") {
            ?>
            <tr>
                <td>
                    <label>
                        Color
                    </label>
                    <input type="color" value="<?php
                    if (isset($backgroundGlobal) && $backgroundGlobal != null) {
                        echo $backgroundGlobal;
                    } else {
                        echo "#ffffff";
                    }
                    ?>" name="color" id="color" class="color" /> 
                </td>
                <td>
                    <?php
                    if ($figure != "") {
                        ?>
                        <label>
                            Tipo Figura
                        </label>
                        <select name="tipo_figura">
                            <option <?php
                            if (isset($r["tipo_figura"]) && $r["tipo_figura"] == "cuadro") {
                                echo " selected='selected' ";
                            }
                            ?> value="cuadro">Cuadrado</option>
                            <option <?php
                            if (isset($r["tipo_figura"]) && $r["tipo_figura"] == "circulo") {
                                echo " selected='selected' ";
                            }
                            ?> value="circulo">Círculo</option>
                            <option <?php
                            if (isset($r["tipo_figura"]) && $r["tipo_figura"] == "cuadrado_puntas_redondas") {
                                echo " selected='selected' ";
                            }
                            ?> value="cuadrado_puntas_redondas">Cuadrado Puntas Redondas</option>
                        </select>
                        <?php
                    } else {
                        ?>
                        <label>
                            Tamaño (px)
                        </label>
                        <input type="text" name="tipo_figura" value="<?php if (isset($r["tipo_figura"])) echo $r["tipo_figura"]; ?>" />
                        <?php
                    }
                    ?>
                </td>
            </tr>
            <?php
        }
        if (isset($r["pos_x"]) && isset($r["pos_y"])) {
            ?>
            <tr>
                <td>
                    <label>
                        Top
                    </label>
                    <input type="text" name="pos_y" value="<?php if (isset($r["pos_y"])) echo $r["pos_y"]; ?>" />
                </td>
                <td>
                    <label>
                        Left
                    </label>
                    <input type="text" name="pos_x" value="<?php if (isset($r["pos_x"])) echo $r["pos_x"]; ?>" />
                </td>
            </tr>
            <?php
        }
        if (isset($r["width"]) && isset($r["height"])) {
            ?>
            <tr>
                <td>
                    <label>
                        width
                    </label>
                    <input type="text" name="width" value="<?php if (isset($r["width"])) echo $r["width"]; ?>" />
                </td>
                <td>
                    <label>
                        height
                    </label>
                    <input type="text" name="height" value="<?php if (isset($r["height"])) echo $r["height"]; ?>" />
                </td>
            </tr>
            <?php
        }
        if ($img != "") {
            ?>
            <tr>
                <td class="tr_img_prop">
                    <label>
                        Imagen
                    </label>
                    <?php
                    if (isset($r["imagen"])) {
                        if (isset($r["animado"]) && $r["animado"] == "no") {
                            ?>
                            <style>
                                .tr_img_prop img{
                                    width: 100%;
                                }
                            </style>
                            <?php
                        }
                        echo "<input id='imagen' name='imagen'  type='hidden' value='" . $r["imagen"] . "'  />";
                        echo "<img src='" . $r["imagen"] . "' class='imgLoadAlbum' />";
                    }
                    ?>
                </td>
                <td>
                    <script>
                        function envia_datos(p) {
                            $("#imagen").remove();
                            $(".imgLoadAlbum").remove();
                            $("#form").append("<input id='imagen' name='imagen'  type='hidden' value='" + p + "'  />");
                            $("#form").append("<img src='" + p + "' class='imgLoadAlbum' />");
                        }
                    </script>
                    <iframe src="/nwlib6/modulos/nw_animate/editing/upload_ajax/index.php?func=envia_datos&css=noimg" name="SubHtml"
                            width="100%" height="170px" scrolling="auto" frameborder="0">
                    </iframe>
                </td>
            </tr>
            <?php
        }
        if (isset($r["movimiento"]) && $r["movimiento"] != null) {
            ?>
            <tr>
                <td>
                    <label>
                        movimiento
                    </label>
                    <select name="movimiento">
                        <option <?php
                        if (isset($r["movimiento"]) && $r["movimiento"] == "no") {
                            echo " selected='selected' ";
                        }
                        ?> value="no">No</option>
                        <option <?php
                        if (isset($r["movimiento"]) && $r["movimiento"] == "si") {
                            echo " selected='selected' ";
                        }
                        ?> value="si">Si</option>
                    </select>
                </td>
                <td>
                    <label>
                        Reproducir
                    </label>
                    <select name="reproducir">
                        <option <?php
                        if (isset($r["reproducir"]) && $r["reproducir"] == "una_vez") {
                            echo " selected='selected' ";
                        }
                        ?> value="una_vez">Una Vez</option>
                        <option <?php
                        if (isset($r["reproducir"]) && $r["reproducir"] == "infinito") {
                            echo " selected='selected' ";
                        }
                        ?> value="infinito">Indefinidamente</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <div class="listMovsObjectEdit">
                        <div class='movimientosTest'></div>
                        <?php
                        if ($r["movimiento"] == "si") {
                            $cc = new NWDbQuery($db);
                            $cc->prepareSelect("nwanimate_objects_animation", "*", "objeto=:objecto and activo='si' order by id asc");
                            $cc->bindValue(":objecto", $r["id"]);
                            if (!$cc->exec()) {
                                echo "error:" . $cc->lastErrorText();
                                return;
                            }
                            $totalANims = $cc->size();
                            if ($totalANims > 0) {
                                echo "<table>";
                                echo "<tr>";
                                echo "<th>";
                                echo "Orden";
                                echo "</th>";
                                echo "<th>";
                                echo "pos_x";
                                echo "</th>";
                                echo "<th>";
                                echo "pos_y";
                                echo "</th>";
                                echo "<th>";
                                echo "opacidad";
                                echo "</th>";
                                echo "<th>";
                                echo "velocidad";
                                echo "</th>";
                                echo "<th>";
                                echo "delay";
                                echo "</th>";
                                echo "</tr>";
                                for ($e = 0; $e < $totalANims; $e++) {
                                    $cc->next();
                                    $rob = $cc->assoc();
                                    $velocity_object = $rob["velocidad"] . "000";
                                    if ($rob["velocidad"] < 1) {
                                        $tvel = explode(".", $rob["velocidad"]);
                                        if (isset($tvel[1])) {
                                            $velocity_object = $tvel[1] . "00";
                                        }
                                    }
                                    $ord = $e + 1;
                                    echo "<tr>";
                                    echo "<td>";
                                    echo $ord;
                                    echo "</td>";
                                    echo "<td>";
                                    echo $rob["pos_x"];
                                    echo "</td>";
                                    echo "<td>";
                                    echo $rob["pos_y"];
                                    echo "</td>";
                                    echo "<td>";
                                    echo $rob["opacidad"];
                                    echo "</td>";
                                    echo "<td>";
                                    echo $rob["velocidad"];
                                    echo "</td>";
                                    echo "<td>";
                                    echo $rob["delay"];
                                    echo "</td>";
                                    echo "</tr>";
//                                    $obj_x = $rob["pos_x"] / 10;
//                                    $obj_y = $rob["pos_y"] / 10;
                                    $obj_x = $rob["pos_x"] / 5;
                                    $obj_y = $rob["pos_y"] / 5;
//                                     $ob_medida = "vw";
//                                    $obj_x = $rob["pos_x"];
//                                    $obj_y = $rob["pos_y"];
//                                     $ob_medida = "px";
                                    $ob_medida = "pt";
                                    ?>
                                    <script>
                                        createRastroObjectEditing('<?php echo $obj_x; ?>', '<?php echo $obj_y; ?>', '<?php echo $ob_medida; ?>');
                                    </script>
                                    <?php
                                }
                                echo "</table>";
                            }
                        }
                        ?>
                    </div>
                </td>
            </tr>
            <?php
        }
        ?>
    </table>
</form>
