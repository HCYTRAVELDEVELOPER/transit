
<?php

if (session_id() == "") {
    ini_set('session.cookie_domain', '.gruponw.com' );
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión para ver el manual.";
    include "log_in.php";
    return;
}

$dbd = NWDatabase::database();
$cau = new NWDbQuery($dbd);
$sqlu = "select a.*,func_concepto(b.perfil, 'perfiles') as mi_perfil,b.nombre as nombre_complet,b.email,b.celular,b.cargo,b.perfil
    from terminales a
    join usuarios b on(a.id=b.terminal) 
    where b.usuario=:usuario";
$cau->bindValue(":usuario", $_SESSION["usuario"]);
$cau->prepare($sqlu);
if (!$cau->exec()) {
    echo "No se pudo realizar la consulta de la búsqueda.";
    return;
}
if ($cau->size() == 0) {
    echo "<h3 class='no_found_contend'>El usuario no existe</h3>.";
    return;
}
$cau->next();
$arrayU = $cau->assoc();
?>

<link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces; ?>nw_learning/src/galeria_polaris/css/user.css" />
<div class="enc_space_user">
    <div>
        <h3>
            Bienvenido <?php echo $arrayU["nombre_complet"]; ?>!
            <iframe src="http://translate.google.com/translate_tts?tl=es&q=Bienvenido <?php echo $arrayU["nombre_complet"]; ?>" width="0" height="0" scrolling="auto" frameborder="0">
            </iframe>
        </h3>
        <span>Perfil: 
            <?php echo $arrayU["mi_perfil"]; ?>
        </span>
        |
        <span>Correo:
            <?php echo $arrayU["email"]; ?>
        </span>
        |
        <span>Móvil: 
            <?php echo $arrayU["celular"]; ?>
        </span>
        |
        <span>Cargo:
            <?php echo $arrayU["mi_perfil"]; ?>
        </span>
        <div>
            <?php
            if ($arrayU["perfil"] == 2) {
                echo "<div class='float_right'>";
                echo "<a class='button_green' href='$url_enl_pr_los' target='_blank'>Administrar Manuales</a>";
                echo "<a class='button_green' href='$url_enl_pr_los' target='_blank'>Editar Perfil</a>";
                echo "</div>";
            } else {
                echo "<div class='float_right'>";
                echo "<a class='button_green' href='$url_enl_pr_los' target='_blank'>No puedes Administrar Manuales</a>";
                echo "<a class='button_green' href='$url_enl_pr_los' target='_blank'>Editar Perfil</a>";
                echo "</div>";
            }
            ?>
        </div>
    </div>
    <div class="logo_space_user" style="background-image: url(<?php echo $arrayU["logo"]; ?>);">
        <img src="<?php echo $arrayU["logo"]; ?>" />
        <h1>
            <?php echo $arrayU["nombre"]; ?>
        </h1>
    </div>
    <div class="menu_space_user" style="display: none;">
        menú
    </div>
</div>

<?php
echo " <div class='list_manual'>";
include "manuales.php";
echo "</div>";
?>
