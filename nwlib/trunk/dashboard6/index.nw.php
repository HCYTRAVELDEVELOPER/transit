<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

//require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib{$vn}/dashboard6/srv/main.nw.php";
//require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib{$vn}/dashboard/srv/main.nw.php";
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$si = session::getInfo();
?>
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/dashboard6/css/style.css">
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/css/walk.css" />
<link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/css/walkEmbedInclude.css" />
<script src="/nwlib<?php echo $vn; ?>/dashboard6/js/main.js" type="text/javascript"></script>
<div class="container">
    <div class="users">
        <div class="user_name">
            <div class="name_info">
                <div class="photo user_photo" style="background-image: url(<?php echo $si["foto"] ?>);">
                    <div class="changePhoto" onclick="parent.main.slotMyPersonalData();">
                        Cambiar Foto
                    </div>
                </div>
                <h3><?php echo $si["nombre"] ?></h3>
                <h3><?php echo $si["email"] ?></h3>
            </div>
        </div>
        <ul class="options">
            <li><a href="#">Chat</a></li>
            <li><a href="#">Notificaciones</a></li>
            <li><a href="#">Drive</a></li>
            <li><a href="#">Soporte</a></li>
            <li><a href="#">Notas</a></li>
            <li><a href="#">Alertas</a></li>
            <li><a href="#">Calculadora</a></li>
            <li><a href="#">Busqueda</a></li>
            <li><a href="#">PQR</a></li>
            <li><a href="#">Cuadro de mando</a></li>
            <li><a href="#">Idiomas</a></li>
            <li><a href="#">Salir</a></li>
        </ul>
        <div class="usuarios">
            <?php
            print_r(usersChat());
            ?>
        </div>
    </div>
    <div class="content">
        <div class="news">
            <div class="widgets notificaciones">
                <h3 class="muro">
                    Notificaciones Recientes
                </h3>
                <?php
                print_r(notifications());
                ?>
            </div>
            <div class="widgets murocorp">
                <h3 class="muro">Muro</h3>
                <div class="open_moduleNWLIVE" onclick="parent.main.slotNwTareasMuro();">Abrir Muro</div>
                <div id="wall"></div>
            </div>
            <div class="widgets quehaydenuevo">
                <h3 class="muro">Lo nuevo!</h3>
                <div id="loadNewsNw"></div>
            </div>
        </div>
        <div class="contentInter">
            <div class="bloq_apps">

                <div class="bloq_apps_encuser">

                    <div class="photo user_photo user_photo_center" style="background-image: url(<?php echo $si["foto"] ?>);">
                        <div class="changePhoto" onclick="parent.main.slotMyPersonalData();">
                            Cambiar Foto
                        </div>
                    </div>
                    <h1 class="nw_user_dash">Bienvenid@ <span> <?php echo $si["nombre"] ?></span>. Aplicaciones más usadas</h1>
                </div>

                <div class="more_useful">
                    <?php
                    print_r(readUserDash());
                    ?>
                </div>
            </div>

            <div class="bloq_apps2">
                <div class="lines">
                    <?php
                    print_r(loadModules());
                    ?>
                </div>
            </div>
            <div class="bloq_apps2">
            </div>
        </div>
    </div>
</div>