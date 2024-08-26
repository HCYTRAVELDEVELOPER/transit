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
    $sqlg = "select *,func_concepto(terminal, 'terminales') as nom_terminal from usuarios where usuario=:usuario";
    $cg->bindValue(":usuario", $_POST["usuario"], true);
    $cg->prepare($sqlg);
    if (!$cg->exec()) {
        echo "No se pudo realizar la consulta de la búsqueda.";
        return;
    }
    if ($cg->size() == 0) {
        echo "<h3 class='no_found_contend'>Usuario o Clave Incorrecta</h3>.";
        echo "<a class='' href='javascript:history.back()' >Volver</a>";
        return;
    }
    $cg->next();
    $array_t = $cg->assoc();
    if ($array_t['clave'] == $clave) {
        //  session_name('login');
//        ini_set('session.cookie_domain', '.gruponw.com');
//        session_set_cookie_params(0, '/', '.gruponw.com');
        session_start();
        $_SESSION['pagina'] = "SI";
        $_SESSION['usuario'] = $array_t['usuario'];
        $_SESSION['empresa'] = $array_t['empresa'];
        $_SESSION['terminal'] = $array_t['terminal'];
        $_SESSION['perfil'] = $array_t['perfil'];
        $_SESSION['nom_terminal'] = $array_t['nom_terminal'];
        $_SESSION['autenticado'] = 'SI';
        $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
        echo "Autenticado correctamente";
        ?>
        <script type="text/javascript">
            window.location.reload();
        </script>
        <?php

    } else {
        echo "Usuario o clave incorrecta";
    }
}
?>