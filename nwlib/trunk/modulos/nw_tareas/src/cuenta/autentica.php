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
    $cl = new NWDbQuery($dbb);
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
        echo $_POST['recordar'];
        //  session_name('login');
//        ini_set('session.cookie_domain', '.gruponw.com');
//        session_set_cookie_params(0, '/', '.gruponw.com');
        session_start();
        $_SESSION['pagina'] = "SI";
        $_SESSION['id'] = $array_t['id'];
        $_SESSION['usuario'] = $array_t['usuario'];
        $_SESSION['empresa'] = $array_t['empresa'];
        $_SESSION['documento'] = $array_t['documento'];
        $_SESSION['terminal'] = $array_t['terminal'];
        $_SESSION['perfil'] = $array_t['perfil'];
        $_SESSION['nom_terminal'] = $array_t['nom_terminal'];
        $_SESSION['autenticado'] = 'SI';
        $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
        if ($_POST['recordar'] == "on") {
            mt_srand(time());
            $rand = mt_rand(1000000, 9999999);
            $sqlU = "UPDATE usuarios SET cookie=:rand WHERE usuario=:uss";
            $cl->bindValue(":rand", $rand);
            $cl->bindValue(":uss", $array_t['usuario']);
            $cl->prepare($sqlU);
            if (!$cl->exec()) {
                echo "Hubo un error, inténtelo nuevamente. Lo sentimos!";
                return;
            }
            setcookie("username", $array_t['usuario'], time() + (60 * 60 * 24 * 365));
            setcookie("marca", $rand, time() + (60 * 60 * 24 * 365));
        }
        echo "Autenticado correctamente";
        ?>
        <script type="text/javascript">
            window.location = "/tareas";
        </script>
        <?php

    } else {
        echo "Usuario o clave incorrecta";
    }
}
?>