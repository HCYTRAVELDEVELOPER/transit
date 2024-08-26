<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
}
$ruta_carpeta = "/nwlib" . master::getNwlibVersion() . "/modulos/";
global $ruta_carpeta;
$ruta_carpeta = "/nwlib" . master::getNwlibVersion() . "/modulos/";
if (session_id() == "") {
//    ini_set('session.cookie_domain', '.gruponw.com');
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}

function grup_trabajo() {
    $where = "";
    $where .= " where empresa=:empresa";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);

//    $sql = "select * from view_empleados " . $where;
    $sql = "select foto, usuario, nombre as nombre_uno, '' as nombre_dos, apellido as apellido_uno, '' as apellido_dos"
            . " from usuarios " . $where;
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->prepare($sql);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    if ($ca->size() == 0) {
        echo "No se han encontrado datos";
        return;
    }
    for ($ii = 0; $ii < $ca->size(); $ii++) {
        $ca->next();
        $ra = $ca->assoc();
        echo "<div class='box_users_group'>";
        echo "<p>
               <a href='/profile/" . $ra["usuario"] . "'>
                   <img class='photo_post' src='" . $ra["foto"] . "' />
                       " . $ra["nombre_uno"] . " " . $ra["nombre_dos"] . " " . $ra["apellido_uno"] . " " . $ra["apellido_dos"] . "
              </a>
            </p>";
        ?>
        <?php
        echo "</div>";
    }
}

function movimientos($id, $user) {
    $where = "";
    $limit = "";
    if ($id != 0) {
        $where .= " where a.id=:id ";
    } else
    if ($user != "") {
        $where .= " where a.usuario=:usuario ";
    } else
    if ($id == 0 & $user == 0) {
        $where .= " where 1=1 ";
    }
    if (isset($_GET["embed"]) && $_GET["embed"] == "true") {
        $limit = " limit 12";
    }
    $where .= " order by a.fecha desc";
    $db = NWDatabase::database();
    if ($limit != "" && $db->getDriver() == "ORACLE") {
        $limit = " ";
        $where = " and ROWNUM <= 12 " . $where;
    }
    $ca = new NWDbQuery($db);
//           func_concepto(a.id_relation, 'tareas_diarias', 'tarea') as id_tarea_text,
    $sql = "select a.id,a.fecha,a.comentario,a.usuario,a.id_relation,
        b.foto
        from nwtaks_publications a
        left join usuarios b on (a.usuario=b.usuario) 
        " . $where . " " . $limit;
    $ca->bindValue(":id", $id);
    $ca->bindValue(":usuario", $user);
    $ca->prepare($sql);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. file walk line 116 ";
        return;
    }
    if ($ca->size() == 0) {
        echo "<div class='box_walk_all'>No hay publicaciones aún, sé el primero en escribir algo en el muro!</div>";
        return;
    }
    for ($ii = 0; $ii < $ca->size(); $ii++) {
        $ca->next();
        $ra = $ca->assoc();
        echo "<div class='box_walk_all'>";
        if ($ra["usuario"] == $_SESSION["usuario"]) {
            echo "<div onclick='javascript:deletField(" . $ra["id"] . ");' class='eliminar_cerrar'>X Eliminar</div>";
        }
        echo "<div class='box_walk'>";
        $limite = 10;
        $texto = $ra["comentario"];
        echo "<p><b>  <a href='/nwlib" . master::getNwlibVersion() . "/modulos/nw_tareas.php?profile=" . $ra["usuario"] . "&walk=show'><img class='photo_post' src='" . $ra["foto"] . "' />" . $ra["usuario"] . "</a></b><br />
            <a href='/postwalk/" . $ra["id"] . "' >" . $texto . "</a></p>";
        echo "<span>" . $ra["fecha"] . "</span>";
        echo "</div>";
        echo "<div id='comments" . $ra["id"] . "' class='comments" . $ra["id"] . "'>";
        echo "<div id='boxComment_" . $ra["id"] . "'>";
        ?>
        <div class="comments_bloq">
            <form id="form_comment<?php echo $ra["id"] ?>" name="form_comment" method="post"  action="javascript: commentInt(<?php echo $ra["id"] ?>);">
                <input id="id_relation" name="id_relation" type="hidden" value="<?php echo $ra["id"] ?>" />
                <input id="tipo" name="tipo" type="hidden" value="1" />
                <input class="comment_input" id="comentario<?php echo $ra["id"] ?>" name="comentario" type="text" value="" />
                <input  type="submit" value="Comentar" class="buttonComentBox"/>
            </form>
        </div>
        <?php
        comentarios($ra["id"]);
        echo "</div>";
        echo "</div>";
        echo "</div>";
    }
    if (isset($_GET["embed"]) && $_GET["embed"] == "true") {
        echo '<div class="open_wall_all" onclick="parent.main.slotNwTareasMuro();">Ver Todas</div>';
    }
}

function comentarios($id) {
    $where = " where 1=1 ";
    $where .= " and a.id_relation=:id_relation";
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $sql = "select a.*,b.foto FROM nwtask_comments a
        left join usuarios b on (a.usuario=b.usuario) 
        " . $where;
    $ca->prepare($sql);
    $ca->bindValue(":id_relation", $id);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta a los comentarios. file comments.php line 65 ";
        return;
    }
    if ($ca->size() == 0) {
        echo "";
        return;
    }
    if ($ca->size() != 0) {
        echo "<h2 class='title_comments_h2'>" . $ca->size() . " Comentarios</h2>";
    }
    for ($ii = 0; $ii < $ca->size(); $ii++) {
        $ca->next();
        $ra = $ca->assoc();
        echo "<div class='box_comment_user'>";
        echo "<b>
                      <a href='/nwlib" . master::getNwlibVersion() . "/modulos/nw_tareas.php?profile=" . $ra["usuario"] . "&walk=show'>
                    <img class='photo_post photo_post_mini' src='" . $ra["foto"] . "' />
                        " . $ra["usuario"] . "
                            </a>: 
                            </b>";
        echo $ra["comentario"];
        echo "<br /><span>" . $ra["fecha"] . "</span>";
        echo "</div>";
    }
}

function profile() {
    global $ruta_carpeta;
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
//    $sql = "select * from usuarios $where";
    $ca->prepareSelect("usuarios a left join usuarios_empresas b on (a.usuario=b.usuario)", "*", " a.estado='activo' and b.empresa=:empresa and  a.usuario=:user_name");
    $ca->bindValue(":user_name", $_POST["us"]);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
//    $ca->prepare($sql);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. " . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        echo "No se han encontrado datos";
        return;
    }
    $ca->next();
    $ra = $ca->assoc();
    ?>
    <link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/profile.css" />
    <div class="contend_user">
        <div class="back">
            <a href="javascript:history.back(1)">Volver Atrás</a>
        </div>
        <div class="user_enc box_users">
            <div class="user_photo">
                <?php
                $phot = "/nwlib" . master::getNwlibVersion() . "/dashboard/img/icon_user.png";
                if ($ra["foto"] != null || $ra["foto"] != "") {
                    $phot = $ra["foto"];
                }
                echo "<img src='" . $phot . "' />";
                ?>
            </div>
            <div class="user_name">
                <?php
//                echo $ra["documento"]; 
                ?>
                <h3>
                    <?php echo $ra["nombre"] . " " . $ra["apellido"]; ?>
                </h3>
            </div>
            <div class="user_info_basic">
                <h2>Información Básica</h2>
                <p>
                    <?php echo "Cumpleaños: " . $ra["fecha_nacimiento"]; ?>
                </p>
                <p>
                    <?php echo "Cargo: " . $ra["cargo"]; ?>
                </p>
                <p>
                    <?php echo "Estado: " . $ra["estado"]; ?>
                </p>
                <p>
                    <?php echo "E-mail: " . $ra["email"]; ?>
                </p>
            </div>
            <div class="user_logros box_users">
                <h2>Logros</h2>
            </div>
            <div class="user_competitividad box_users">
                <h2> Competitividad</h2>
            </div>
        </div>
        <div class="user_postest box_users">
            <h2>Actividad</h2>
            <?php
            movimientos(0, $_POST["us"]);
            ?>
        </div>
    </div>
    <?php
}
?>
<script type="text/javascript">
    $("#form_public").validate({
        rules: {
            comentario: {
                required: true
            }
        },
        submitHandler: function () {
            publicatInt();
        }
    });
</script>
<?php
//if (isset($_POST["id"]) == 0 & isset($_POST["us"]) == "0") {
?>
<div class="box_publication">
    <form id="form_public" name="form_public" method="post"  action="javascript: publicatInt()">
        <textarea id="comentario" onfocus="if (this.value == 'Realiza una publicación') {
                    this.value = '';
                }" onblur="if (this.value == '') {
                            this.value = 'Realiza una publicación';
                        }" name="comentario" id="comentario" required class="required"></textarea>
        <input  type="submit" value="Enviar" class="commentButton"/>
    </form>
</div>
<?php
//}
echo "<div class='contenedor_others_right'>";
echo "<h2>Cumpleaños, eventos:</h2>";
echo "<p>no hay en este mes</p>";
echo "</div>";

echo "<div class='contenedor_publications'>";
if (isset($_POST["id"]) && $_POST["id"] != 0) {
    movimientos($_POST["id"], 0);
} else
if (isset($_POST["us"]) && $_POST["us"] != "0") {
    profile();
} else {
    movimientos(0, 0);
}
echo "</div>";

echo "<div class='contenedor_others_right'>";
echo "<h2>Personas destacadas del mes</h2>";
echo "<p>no hay en este mes</p>";
echo "</div>";

echo "<div class='contenedor_others_right'>";
echo "<h2>Tu Grupo de Trabajo</h2>";
grup_trabajo();
echo "</div>";
?> 
<div class='loading_see'>
    <div>Cargando...</div>
</div>

<script type="text/javascript">
    $(document).ready(function () {
        removeLoadingSee();
        removeLoading();
        $(".button_list").click(function () {
            $(".ui-dialog").remove();
            $(".ui-widget-overlay").remove();
        });
    });
</script>