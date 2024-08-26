<?php

$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
//    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod_all.php';
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
if (isset($_POST['usuario'])) {
    $clave = md5($_POST["clave"]);

    $dbb = NWDatabase::database();
    $cg = new NWDbQuery($dbb);
    $sqlg = "select *,
             func_concepto(pais, 'paises') as pais_name, 
                                                               func_concepto(terminal, 'terminales') as nom_terminal, 
                                                               func_concepto(perfil, 'perfiles') as nom_perfil
         from usuarios where usuario=:usuario";
    $cg->bindValue(":usuario", $_POST["usuario"], true);
    $cg->prepare($sqlg);
    if (!$cg->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda.";
        return;
    }
    if ($cg->size() == 0) {
        echo "<h3 class='no_found_contend'>Usuario o Clave  ddIncorrecta</h3>.";
        echo "<a class='' href='javascript:history.back()' >Volver</a>";
        return;
    }
    $cg->next();
    $r = $cg->assoc();
    if ($r['clave'] == $clave) {
        session_start();
        $_SESSION['pagina'] = "SI";
        $_SESSION['id'] = $r['id'];
        $_SESSION['nombre'] = $r['nombre'];
        $_SESSION['usuario'] = $r['usuario'];
        $_SESSION['empresa'] = $r['empresa'];
        $_SESSION['terminal'] = $r['terminal'];
        $_SESSION['nom_terminal'] = $r['nom_terminal'];
        $_SESSION['perfil'] = $r['perfil'];
        $_SESSION['nom_perfil'] = $r['nom_perfil'];
        $_SESSION['email'] = $r['email'];
        if (isset($r["foto"])) {
            $_SESSION["foto"] = $r["foto"];
        }
        if (isset($r["pais"])) {
            $_SESSION["pais"] = $r["pais"];
            $_SESSION["pais_name"] = $r["pais_name"];
        }
        if (isset($r["ciudad"])) {
            $_SESSION["ciudad"] = $r["ciudad"];
        }
        if (isset($r["bodega"])) {
            $_SESSION["bodega"] = $r["bodega"];
        }
        if (isset($r["documento"])) {
            $_SESSION["documento"] = $r["documento"];
        }
        $_SESSION['autenticado'] = 'SI';
        $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
        echo "Autenticado correctamente";
        ?>
        <script type="text/javascript">
            window.location.reload();
        </script>
        <?php

    } else {
        echo "<h3 class='no_found_contend'>Usuario o Clave a a a aIncorrecta</h3>.";
        return;
    }
}
?>