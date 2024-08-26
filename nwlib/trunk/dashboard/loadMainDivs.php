<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$vn = master::getNwlibVersion();
require_once $_SERVER["DOCUMENT_ROOT"] . "/nwlib{$vn}/dashboard/srv/main.nw.php";
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
$id_intern = $_GET["id"];
//print_r($_GET);
//    print_r($id_intern);
$usedSecondView = false;
$tercerVista = false;
$onclick = "onclick=\"location.href = '/nwlib6/user_bienvenido.php';\"";
if (isset($_GET["usedSecondView"])) {
    if ($_GET["usedSecondView"] == "true") {
        $usedSecondView = true;
    }
}
if (isset($_GET["plantilla"])) {
    if ($_GET["plantilla"] == "3" && isset($_GET["tercer_vista"])) {
        $onclick = "";
    }
    if ($_GET["plantilla"] == "3" && isset($_GET["normal"])) {
        $onclick = "";
    }

    if ($_GET["plantilla"] == "3") {
        ?>
        <div class="title_main">
            <?php
            if (isset($_GET["boton1"])) {
                ?>
                <div class='div_salirOther contend_modules_div div_salir DivNivelSalir s88' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div> </div>
                <?php
            } else if (isset($_GET["boton2"])) {
                ?>
                <div class='div_salirOther contend_modules_div div_salir DivNivelSalir s66' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div></div>
                <?php
            } else {
                ?>
                <div class='div_salirOther contend_modules_div div_salir DivNivelSalir' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div></div>
                <?php
            }
            ?>
            <p>  Módulos Disponibles.</p>
        </div>
        <?php
    } else {
        ?>
        <h1 class="title_main">
            Módulos Disponibles.
        </h1>
        <?php
    }
} else {
    ?>
    <h1 class="title_main">
        Módulos Disponibles.
    </h1>
    <?php
}
?>
<div class="contend_modules">
    <?php
    if (isset($_GET["tercer_vista"])) {
        $tercerVista = "SI";
        print getButtonModules2($id_intern, $usedSecondView, $tercerVista);
    } else {
        ////////////////////////////////////////////////////////botones módulos////////////////////////////////
        print getButtonModules($id_intern, $usedSecondView, $tercerVista);
    }
    ?>
</div>
<?php
if (!isset($_GET["plantilla"])) {
    ?>
    <div class='div_salirOther contend_modules_div div_salir DivNivelSalir' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div>Volver </div>
    <?php
} else if ($_GET["plantilla"] !== "3") {
    if (isset($_GET["boton1"])) {
        ?>
        <div class='div_salirOther contend_modules_div div_salir DivNivelSalir s88' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div>Volver </div>
        <?php
    } else if (isset($_GET["boton2"])) {
        ?>
        <div class='div_salirOther contend_modules_div div_salir DivNivelSalir s66' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div>Volver </div>
        <?php
    } else {
        ?>
        <div class='div_salirOther contend_modules_div div_salir DivNivelSalir' <?php echo $onclick; ?>><div class='img_contend_modules_div img_salir'></div>Volver </div>
        <?php
    }
}
modulosHome($id_intern);
?>