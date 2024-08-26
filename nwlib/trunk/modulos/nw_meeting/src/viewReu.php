<?php
include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "/nwlib{$cfg["nwlibVersion"]}/modulos/nw_meeting/";
date_default_timezone_set('UTC');
$id = "";
if (isset($_POST["id"]) && $_POST["id"] != "") {
    $id = $_POST["id"];
}
if (isset($_GET["id"]) && $_GET["id"] != "") {
    $id = $_GET["id"];
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

function actions($id, $p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect("nwreu_actions", "*", "reunion=:id and tipo=:tipo order by id asc");
    $ca->bindValue(":id", $id);
    $ca->bindValue(":tipo", $p);
    if (!$ca->exec()) {
        echo "Error 19. " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "No hay acciones de {$p} para la reunión {$id} ";
        return;
    }
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["observaciones"] != "") {
            ?>
            <div class="fila_action">
                <div class="text_action">
                    <?php
                    echo $r["observaciones"];
                    ?>
                </div>
            </div>
            <?php
        }
    }
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
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        $css = "";
        if ($r["estado"] == 1) {
            $css = " style=' background: #e6e6e6; ' ";
        } else
        if ($r["estado"] == 2) {
            $css = " style=' color: #fff; background: #F8CB00; ' ";
        }
        if ($r["estado"] == 3) {
            $css = " style=' color: #fff; background: #45B7AF; ' ";
        }
        if ($r["estado"] == 4) {
            $css = " style=' color: #fff; background: #FF6B6B; ' ";
        }
        ?>
        <div class="div_tems">
            <div class="div_tems_status">
                <div class="div_tems_status_inter" <?php echo $css; ?>>
                    <?php
                    echo $r["estado_text"];
                    ?>
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
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        ?>
        <div class="div_asis">
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
        </div>
        <?php
    }
}

if (isset($_GET["id"]) && $_GET["id"] != "") {
    ?>
    <!DOCTYPE html>
    <html>
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <link rel="stylesheet" href="<?php echo $ruta_enlaces; ?>css/style.css">
            <style>
                #reuview {
                    background: #F6F6F6;
                    max-width: 1000px;
                    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.17);
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <?php
        } else {
            ?>
            <style>
                .ui-dialog-titlebar {
                    display: none;
                }
            </style>
            <?php
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
                    <?php
                    if (!isset($_GET["id"]) && $r["estado_text"] != "Finalizado") {
                        ?>
                        <div class="button_gray buttonInitReu" data="<?php echo $r["id"]; ?>">
                            Comenzar
                        </div>
                        <?php
                    }
                    ?>
                    <div class="date_enc">
                        <p>
                            <strong>
                                Fecha:
                            </strong>
                            <?php
                            $diaText = array("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo");
                            $mesText = array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
                            $expl_fecha = explode("-", $r["fecha"]);
                            echo $diaText[date("d", $expl_fecha[2]) - 1] . ", $expl_fecha[2] de " . $mesText[str_replace("0", "", $expl_fecha[1]) - 1] . " a las " . $r["hora"];
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
                                <div class="actions_divs_decision">
                                    <?php
                                    actions($id, "decision");
                                    ?>
                                </div>
                            </div>
                        </div>
                        <div class="actions_divs">
                            <div class="actions_divs_inter">
                                <h3>
                                    Ideas
                                </h3>
                                <div class="actions_divs_idea">
                                    <?php
                                    actions($id, "idea");
                                    ?>
                                </div>
                            </div>
                        </div>
                        <div class="actions_divs">
                            <div class="actions_divs_inter">
                                <h3>
                                    Tareas
                                </h3>
                                <div class="actions_divs_tarea">
                                    <?php
                                    actions($id, "tarea");
                                    ?>
                                </div>
                            </div>
                        </div>
                        <div class="actions_divs"> 
                            <div class="actions_divs_inter"> 
                                <h3>
                                    Notas
                                </h3>
                                <div class="actions_divs_nota">
                                    <?php
                                    actions($id, "nota");
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script>
            $(document).ready(function() {
                $(".buttonInitReu").click(function() {
                    var id = $(this).attr("data");
//                    localStorage["decision"] = "";
//                    localStorage["idea"] = "";
//                    localStorage["tarea"] = "";
//                    localStorage["nota"] = "";
//                    localStorage["min"] = 0;
//                    localStorage["hour"] = 0;
//                    window.location = "?";
                    window.location = "?beginID=" + id;
                });
            });
        </script>
        <?php
        if (isset($_GET["id"]) && $_GET["id"] != "") {
            ?>
        </body>
    </html>
    <?php
}
?>