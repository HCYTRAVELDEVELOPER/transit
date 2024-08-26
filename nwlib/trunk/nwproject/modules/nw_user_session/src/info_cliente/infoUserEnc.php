<div class="contain_infouserenc">
    <?php
    if (isset($_SESSION["usuario"])) {
        $si = $_SESSION;
        echo "<a href='/nwmaker' ><span class='userIcon'></span>" . $si["nombre"] . "</a><div class='cerrar_sesion' >Cerrar sesión</div>";
        if (isset($allInfo)) {
//            print_r($si);
            echo "<ul class='dataUserAll'>";
            echo "<li><strong>Nombre</strong> {$si["nombre"]}</li>";
            echo "<li><strong>Apellido</strong> {$si["apellido"]}</li>";
            echo "<li><strong>Usuario</strong> {$si["usuario"]}</li>";
            echo "<li><strong>Email</strong> {$si["email"]}</li>";
            echo "<li><strong>Teléfono</strong> {$si["telefono"]}</li>";
            echo "<li><strong>Celular</strong> {$si["celular"]}</li>";
            echo "<li><strong>Ciudad</strong> {$si["ciudad_text"]}</li>";
            echo "<li><strong>Direccion</strong> {$si["direccion"]}</li>";
            echo "</ul>";
        }
    } else {
        echo "<div class='link_log'>Iniciar Sesión</div>";
    }
    ?>
</div>