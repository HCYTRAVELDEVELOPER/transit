<div class="text">
    <?php
//    if ($mostrar_notificaciones == "SI") {
    if ($mostrar_notificaciones == "sisisisi") {
        ?>
        <div class="contend_blanc_lista_simple divNotifications">
            <h2>Notificaciones</h2>
            <?php
            print_r(notifications());
            ?>
        </div>
        <?php
    }
    ?>
    <div class="contend_blanc_lista_simple divFrameWall">
        <link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/css/walk.css" />
        <link rel="stylesheet" type="text/css" href="/nwlib<?php echo master::getNwlibVersion() ?>/modulos/nw_tareas/css/walkEmbedInclude.css" />
        <h2 class="divFrameWall_h2">Muro Corporativo</h2>
        <div class="open_moduleNWLIVE" onclick="parent.main.slotNwTareasMuro();">Abrir Muro</div>
        <div id="walk"></div>
        <script>
            document.addEventListener("DOMContentLoaded", loadWall);
        </script>
    </div>
    <div class="contend_blanc_lista_simple divUBirtDay">
        <h2>Cumpleaños en este mes</h2>
        <ul>
            <li>
                <?php
                include 'modulos/birthdays.php';
                ?>
            </li>
        </ul>
    </div>
    <div class="contend_blanc_lista_simple divUsersOnline">
        <?php 
        print usersChat(); 
        ?>
    </div>
    <div class="contend_blanc_lista_simple">
        <?php 
        print modulosHome("right"); 
        ?>
    </div>
</div>
