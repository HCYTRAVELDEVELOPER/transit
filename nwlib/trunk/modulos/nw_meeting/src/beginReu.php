<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib{$cfg["nwlibVersion"]}/modulos/nw_meeting/";
    $ruta_js = "http://" . $_SERVER["HTTP_HOST"] . $ruta_enlaces;
} else {
    $ruta_enlaces = "/nwproject/php/modulos/";
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animation/_mod.php';
}
date_default_timezone_set('UTC');
$id = "";
if (isset($_POST["beginID"]) && $_POST["beginID"] != "") {
    $id = $_POST["beginID"];
}
if (isset($_GET["beginID"]) && $_GET["beginID"] != "") {
    $id = $_GET["beginID"];
}
if ($id == "") {
    echo "No puede ingresar";
    return;
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwreu_enc", "*", "id=:id");
$ca->bindValue(":id", $id);
if (!$ca->exec()) {
    echo "Error 19. " . $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    echo "No existe la reunión";
    return;
}
$ca->next();
$r = $ca->assoc();
$css = "";
if ($r["estado"] == 1) {
    $css = " style=' background: #CFCFCF; ' ";
} else
if ($r["estado"] == 2) {
    $css = " style=' background: #F8CB00; ' ";
}
if ($r["estado"] == 3) {
    $css = " style='  background: #45B7AF;  ' ";
}
if ($r["estado"] == 4) {
    $css = " style=' background: #FF6B6B;  ' ";
}
if ($r["estado_text"] == "Finalizado") {
    echo "Reunión finalizada anteriormente";
    ?>
    <script>
        $(document).ready(function() {
            window.location = "?view=<?php echo $id; ?>";
        });
    </script>
    <?php
    return;
}

function temas($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwreu_temas", "*", "reunion=:id order by id asc");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error 19. " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "No hay asistentes";
        return;
    }
    ?>
    <script>
        $(document).ready(function() {
            selectTema(<?php echo $total; ?>, <?php echo $id; ?>);
        });
    </script>
    <?php
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $num = $i + 1;
        ?>
        <div class="div_tems" id="tema_<?php echo $num; ?>" data="<?php echo $num; ?>" data-i="<?php echo $r["id"]; ?>" data-s="1">
            <div class="div_tems_status">
                <div id="containT_<?php echo $num; ?>" class="div_tems_status_inter class_status">
                    <div class="temaCheck" id="temaCheck_<?php echo $num; ?>" data="<?php echo $num; ?>" >
                        Iniciar
                    </div>
                </div>
            </div>
            <div class="div_asis_data">
                <h5>
                    <?php
                    echo $r["nombre"];
                    ?>
                </h5>
            </div>
        </div>
        <?php
    }
}

function asistentes($id) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwreu_asistentes", "*", "reunion=:id order by id asc");
    $ca->bindValue(":id", $id);
    if (!$ca->exec()) {
        echo "Error 19. " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "No hay asistentes";
        return;
    }
    ?>
    <script>
        $(document).ready(function() {
            selectAsistentes(<?php echo $total; ?>);
        });
    </script>
    <?php
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $num = $i + 1;
        ?>
        <div class="div_asis" id="asist_<?php echo $num; ?>" data="<?php echo $r["id"]; ?>" data-check="false" >
            <div class="img_user_chat"></div>
            <div class="div_asis_data">
                <h5>
                    <?php
                    echo $r["asistente_text"];
                    if ($i == 0) {
                        echo " (Creador)";
                    }
                    ?>
                </h5>
                <p>
                    <?php
                    echo $r["asistente_mail"];
                    ?>
                </p>
            </div>
            <div class="revisaUsers">
                <input type="checkbox" class="checkUsers" name="<?php echo $num; ?>" />
            </div>
        </div>
        <?php
    }
}
?>
<div id="reuview">
    <div id="reuview_inter" class="reuview_inter">
        <div class="reuview_enc">
            <h1>
                <?php echo $r["titulo"]; ?>
            </h1>
            <p>
                <?php echo $r["objetivo_general"]; ?>
            </p>
            <div class="date_enc">
                <p>
                    <strong>
                        Fecha:
                    </strong>
                    <?php
                    $diaText = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
                    $mesText = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
                    $expl_fecha = explode("-", $r["fecha"]);
                    echo $diaText[date("d", $expl_fecha[2]) - 1] . ", $expl_fecha[2] de " . $mesText[str_replace("0", "", $expl_fecha[1]) - 1] . " a las <span class='hora_reunion'>" . $r["hora"] . "</span>";
                    ?>
                </p>
                <p>
                    <strong>
                        Lugar
                    </strong>
                    <?php
                    echo $r["lugar_text"];
                    ?>
                </p>
                <p class="status_enc" <?php echo $css; ?>>
                    <strong>
                        Status
                    </strong>
                    <?php
                    echo $r["estado_text"];
                    ?>
                </p>
            </div>
        </div>
        <div class="reuview_asistentes">
            <div class="reuview_asistentes_inter">
                <h3>
                    Asistentes
                </h3>
                <?php
                asistentes($id);
                ?>
            </div>
        </div>
        <div class="reuview_actividades">
            <div class="reuview_actividades_inter">
                <h3>
                    Actividad de la Reunión
                </h3>
                <?php
                temas($id);
                ?>
            </div>
        </div>
        <div class="reuview_actions">
            <div class="reuview_actions_inter">
                <div class="actions_divs">
                    <div class="actions_divs_inter">
                        <h3>
                            Decisiones
                        </h3>
                        <div class="actions_divs_decision"></div>
                    </div>
                </div>
                <div class="actions_divs">
                    <div class="actions_divs_inter">
                        <h3>
                            Ideas
                        </h3>
                        <div class="actions_divs_idea"></div>
                    </div>
                </div>
                <div class="actions_divs">
                    <div class="actions_divs_inter">
                        <h3>
                            Tareas
                        </h3>
                        <div class="actions_divs_tarea"></div>
                    </div>
                </div>
                <div class="actions_divs"> 
                    <div class="actions_divs_inter"> 
                        <h3>
                            Notas
                        </h3>
                        <div class="actions_divs_nota"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    $(document).ready(function() {
        loadTimeInit(<?php echo $_GET["beginID"]; ?>);
        myTimer();
    });
</script>