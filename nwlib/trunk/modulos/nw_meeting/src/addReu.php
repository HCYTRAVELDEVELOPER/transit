<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/nw_animate/";
    $ruta_js = "http://" . $_SERVER["HTTP_HOST"] . $ruta_enlaces;
} else {
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animation/_mod.php';
}
session::check();

function hours_day($n, $d, $t) {
    $horas_dia = $d;
    if ($n == "hora_estimada") {
        $horas_dia = 0;
    }
    $hour = $horas_dia;
    $media = "00";
    $hour_sistem = $horas_dia;
    echo "<select  id='" . $n . "_task' name='" . $n . "' >";
    for ($ib = 0; $ib <= $t; $ib++) {
        if ($ib == 0) {
            if ($n != "hora_estimada") {
                echo "<option value=''>Seleccione</option>";
            }
        } else {
            echo "<option value='" . $hour_sistem . ":" . $media . "'>" . $hour . ":" . $media . " </p>";
            if ($media == "30") {
                if ($hour == 12 && $media == "30") {
                    $hour = 1;
                } else {
                    $hour++;
                }
                $hour_sistem++;
                $media = "00";
            } else {
                $media = "30";
            }
        }
    }
    echo "</select>";
}

function loadUsuariosList($title, $tipo) {
    session::check();
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $ca->prepareSelect("usuarios", "*", "empresa=:empresa and terminal=:terminal and usuario<>:usuario");
    $ca->prepareSelect("nwreu_contactos", "*", "usuario_id_enc=:usuario_id_enc and usuario=:usuario and empresa=:empresa and terminal=:terminal");
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":usuario_id_enc", $si["id"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    $ca->bindValue(":terminal", $si["terminal"]);
    if (!$ca->exec()) {
        echo "Error: " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
//        echo "No hay usuarios creados";
        return;
    }
    $otro = "";
    ?>
    <datalist id="<?php echo $title; ?>">
        <?php
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $user = explode(" ", $r["nombre"]);
            if ($tipo == "nombre") {
                $otro = $r["email"];
                ?>
                <option class="userLister user_<?php echo $user[0]; ?>"  value="<?php echo $r["nombre"]; ?> | <?php echo $r["email"]; ?>">
                    <?php
                } else
                if ($tipo == "email") {
                    $otro = $r["nombre"];
                    ?>
                <option class="userLister user_<?php echo $user[0]; ?>"  value="<?php echo $r["email"]; ?> | <?php echo $r["nombre"]; ?>">
                    <?php
                }
                ?>
        <!--<option class="userLister user_<?php echo $user[0]; ?>" label="<?php echo $otro; ?>" value="<?php echo $r[$tipo]; ?>">-->
                <?php
            }
            ?>
    </datalist>
    <?php
}

function loadLugaresList() {
    session::check();
    $si = session::getInfo();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwreu_lugares", "*", "usuario_id_enc=:usuario_id_enc and usuario=:usuario and empresa=:empresa and terminal=:terminal");
    $ca->bindValue(":usuario_id_enc", $si["id"]);
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    $ca->bindValue(":terminal", $si["terminal"]);
    if (!$ca->exec()) {
        echo "Error: " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        return;
    }
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        ?>
        <option value="<?php echo $r["nombre"]; ?>">
            <?php
        }
    }
    ?>
<form id="new_reu_form">
    <div class="warp_columns">
        <div class="warp_columns_inter">
            <div class="warp">
                <label>
                    Título
                </label>
                <input type="text" name="titulo" class="titulo" id="titulo" />
            </div>
            <div class="warp">
                <label>
                    Objetivo Principal
                </label>
                <input type="text" name="objetivo_principal" class="objetivo_principal" />
            </div>
            <div class="warp">
                <label>
                    Lugar
                </label>
                <input list="lugar_lista" type="text" name="lugar" class="lugar" id="lugar" placeholder="Lugar" />
                <datalist id="lugar_lista" >
                    <?php
                    loadLugaresList();
                    ?>
                </datalist>
            </div>
            <div class="warp">
                <label>
                    Fecha
                </label>
                <input type="date" name="fecha" class="fecha" value="" />
            </div>
            <div class="warp">
                <label>
                    Hora
                </label>
                <?php
                $hora = date("H:s:i");
                ?>
                <!--<input type="time" name="hora" class="hora" value="" />-->
                <?php
                hours_day("hora", 8, 22);
                ?>
            </div>
            <div class="warp">
                <label>
                    Tiempo Previsto
                </label>
                <?php
                $hora_prevista = date('H:s:i', strtotime($hora . ' + 1 hours + 00 minutes'));
                ?>
                <!--<input type="time" name="tiempo_previsto" class="tiempo_previsto" value="" />-->
                <?php
                hours_day("tiempo_previsto", 0, 16);
                ?>
            </div>
            <div class="warp">
                <label>
                    Tiempo Transporte Ida
                </label>
                <?php
                hours_day("transporte_ida", 0, 10);
                ?>
            </div>
            <div class="warp">
                <label>
                    Tiempo Transporte Vuelta
                </label>
                <?php
                hours_day("transporte_vuelta", 0, 10);
                ?>
            </div>
            <div class="warp">
                <label>
                    Solicitar Confirmación
                </label>
                <input type="checkbox" name="confirmacion" class="confirmacion" />
            </div>
        </div>
    </div>
    <div class="warp_columns">
        <div class="warp_columns_inter">
            <div class="warp warp_listas">
                <label>
                    Asistentes
                </label>
                <input list="listas_usuarios_nombres" type="text" name="asistentes_nombre" class="input_asistentes asistentes_nombre" id="asistentes_nombre" placeholder="Nombre" />
                <input list="listas_usuarios_emails" type="text" name="asistentes" class="input_asistentes asistentes asistentes_emails" id="asistentes" placeholder="Email" />
                <?php
                loadUsuariosList("listas_usuarios_emails", "email");
                loadUsuariosList("listas_usuarios_nombres", "nombre");
                ?>
                <a class="no-link" id="link-addUser" href="#">
                    <div class="add_item add_item_user button_gray">+</div>
                </a>
            </div>
            <div class="list_navTable list_navTable_users"></div>
            <div class="warp warp_listas">
                <label>
                    Temas
                </label>
                <input type="text" name="temas" class="temas" id="temas" placeholder="Temas a tratar" />
                <a class="no-link-tem" id="link-addUser" href="#">
                    <div class="add_item add_item_tema button_gray">+</div>
                </a>
                <div class="list_navTable list_navTable_temas"></div>
            </div>
        </div>
    </div>
</form>
<script>
    $(document).ready(function() {
        $(function() {
            $('.no-link').click(function(e) {
//                e.preventDefault();
                add_item_user();
            });
            $('.no-link-tem').click(function(e) {
                add_item_tema();
            });
        });
        $(".asistentes_nombre").change(function() {
            var dataa = $(this).val();
            if (dataa != "") {
                var sstr = dataa.split(" | ");
                if (sstr[1] != undefined) {
                    $(this).val(sstr[0]);
                    $(".asistentes_emails").val(sstr[1]);
                    document.getElementById('link-addUser').focus();
                }
            }
        });
        $(".asistentes_emails").change(function() {
            var dataaa = $(this).val();
            if (dataaa != "") {
                var ssstr = dataaa.split(" | ");
                if (ssstr[1] != undefined) {
                    $(this).val(ssstr[0]);
                    $(".asistentes_nombre").val(ssstr[1]);
                }
            }
        });
        var emailreg = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
        $(".titulo, .objetivo_principal, .lugar, .fecha, .hora, .tiempo_previsto").keyup(function() {
            if ($(this).val() != "") {
                $(".error").fadeOut();
                return false;
            }
        });
        $(".asistentes").click(function() {
            if ($(this).val() != "" && emailreg.test($(this).val())) {
                $(".error").fadeOut();
                return false;
            }
        });
        $(".asistentes").keyup(function() {
            if ($(this).val() != "" && emailreg.test($(this).val())) {
                $(".error").fadeOut();
                return false;
            }
        });
        num = 0;
        $(".userLister").click(function() {
            alert("fdsfdas");
        });
//        $(".add_item_user").click(function() {
//            add_item_user();
//        });
        function add_item_user() {
            var data = $(".asistentes").val();
            if ($(".asistentes").val() == "" || !emailreg.test($(".asistentes").val())) {
                $(".asistentes").focus().after("<span class='error'>Ingrese un email correcto</span>");
                return false;
            } else {
                $(".error").fadeOut();
            }
            var data_name = $(".asistentes_nombre").val();
            if ($(".asistentes_nombre").val() == "") {
                $(".asistentes_nombre").focus().after("<span class='error'>Ingrese un nombre</span>");
                return false;
            } else {
                $(".error").fadeOut();
            }

            if (data != "") {
                $(".list_navTable_users").append("<div class='list_item list_item_asistentes' id='asistente_" + num + "' name-data='" + data_name + "' email-data='" + data + "' >\n\
                                                                      " + data_name + " - " + data + "</div>");
                $(".asistentes").val("");
                $(".asistentes_nombre").val("");
                var str = data_name;
                var res = str.split(" ");
                $(".user_" + res[0]).remove();
                document.getElementById('asistentes_nombre').focus();
                num++;
            } else {
                alert("Ingresa un correo");
            }
        }
        num_tem = 0;
//        $(".add_item_tema").click(function() {
//            add_item_tema();
//        });
        function add_item_tema() {
            var data = $(".temas").val();
            if (data != "") {
                $(".list_navTable_temas").append("<div class='list_item list_item_temas' id='tema_" + num_tem + "' name='" + data + "'>" + data + "</div>");
                $(".temas").val("");
                document.getElementById('temas').focus();
                num_tem++;
            } else {
                alert("Ingresa un tema");
                document.getElementById('temas').focus();
            }
        }
        document.getElementById('titulo').focus();
    });
</script>