<?php
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib" . master::getNwlibVersion() . "/modulos/";
    $motor_bd = "PSQL";
} else {
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
//    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
}
?> 
<script>
    $('#menu_mobil').click(function() {
        $('.menu_mobil_cerrar').fadeIn(100);
        $('.menu_mobil').fadeOut(100);
        $('.enc_calendar_contros_hours').fadeIn(100);
        $(".enc_calendar_contros_hours").animate({left: "0px"}, 400);
    });
    $('#menu_mobil_cerrar').click(function() {
        $('.menu_mobil').fadeIn(100);
        $('.menu_mobil_cerrar').fadeOut(100);
        //  $('.enc_calendar_contros_hours').fadeOut(100);
        $(".enc_calendar_contros_hours").animate({left: "-200%"}, 500);
    });
    $('#menu_home').click(function() {
        //  history.pushState(null, "Muro", "tareas");
        window.location = "/tareas";
    });
    $('#menu_walk').click(function() {
        history.pushState(null, "Muro", "walk");
        window.location = "/walk";
    });
    $('.menu_walk_mobil').click(function() {
        window.location = "/viewLists";
    });
    $('.menu_walk_pc').click(function() {
        // window.location = "/viewLists";
    });
    $('#menu_walk_proyects').click(function() {
        window.location = "/projects";
    });
</script>
<div class="enc_user">
    <div id="enc_user">
        <div class="logo_title_div">
            <h1 class="logo_title">
                <a href="/tareas">
                    Nw tasks
                </a>
            </h1>
        </div>
        <div class="menu_mobil icons" id="menu_mobil">
            Menú
        </div>
        <div class="menu_mobil_cerrar" id="menu_mobil_cerrar">
            Cerrar
        </div>
        <div class="div_buttons_menu_enc">
            <div class="buttons_menu_enc menu_home" id="menu_home">
                Inicio
            </div>
            <div class="buttons_menu_enc menu_walk" id="menu_walk">
                Muro
            </div>
            <div class="buttons_menu_enc menu_walk menu_walk_pc" id="menu_walk">
                Lista
            </div>
            <div class="buttons_menu_enc menu_walk menu_walk_mobil" id="menu_walk">
                Listas
            </div>
            <div class="buttons_menu_enc menu_walk menu_walk_proyects" id="menu_walk_proyects">
                Proyectos
            </div>
        </div>
        <div class="enc_user_dats">
            <ul class="ul_user_enc">
                <li>
                    <p>
                        <?php
                        echo $_SESSION["nombre"]; ?>
                    </p>
                    <ul class="ul_user_enc_intro">
                        <li>
                            <p>
                                Perfil: <?php echo $_SESSION["nom_perfil"]; ?>
                            </p>
                        </li>
                        <li>
                            <p>
                                Empresa: <?php echo $_SESSION["nom_empresa"]; ?>
                            </p>
                        </li>
                        <li>

                            <p>
                                Terminal: <?php echo $_SESSION["nom_terminal"]; ?>
                            </p>
                        </li>
                        <li>
                            <p>
                                <a href='<?php echo $ruta_enlaces ?>nw_tareas/src/cerrar_sesion.php'>Cerrar sesión</a>
                            </p>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>