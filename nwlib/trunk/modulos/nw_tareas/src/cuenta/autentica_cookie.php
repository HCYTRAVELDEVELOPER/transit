<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//return;
if (isset($_COOKIE['username']) && isset($_COOKIE['marca'])) {
    if ($_COOKIE['username'] != "" || $_COOKIE['marca'] != "") {
        $dbb = NWDatabase::database();
        $cgg = new NWDbQuery($dbb);
        $where = "usuario=:user_cookie and cookie=:marca_cookie";
        $cgg->prepareSelect("usuarios", "*,func_concepto(terminal, 'terminales') as nom_terminal", $where);
        $cgg->bindValue(":user_cookie", $_COOKIE["username"], true);
        $cgg->bindValue(":marca_cookie", $_COOKIE["marca"], true);
        $cgg->bindValue(":nada", " ", true);
        if (!$cgg->exec()) {
            echo "No se pudo realizar la consulta";
            return;
        }
        if ($cgg->size() == 0) {
            echo "No hay cookie";
            ?>
        <script type="text/javascript">
            //            window.location.reload();
//            window.location = "/fdsafsda";
        </script>
        <?php
            return;
        }
        $cgg->next();
        $array_tcook = $cgg->assoc();
        session_start();
        $_SESSION['pagina'] = "SI";
        $_SESSION['id'] = $array_tcook['id'];
        $_SESSION['usuario'] = $array_tcook['usuario'];
        $_SESSION['empresa'] = $array_tcook['empresa'];
        $_SESSION['documento'] = $array_tcook['documento'];
        $_SESSION['terminal'] = $array_tcook['terminal'];
        $_SESSION['perfil'] = $array_tcook['perfil'];
        $_SESSION['nom_terminal'] = $array_tcook['nom_terminal'];
        $_SESSION['autenticado'] = 'SI';
        $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
        echo "El usuario " . $array_tcook['usuario'] . " se ha identificado correctamente.";
        ?>
        <script type="text/javascript">
            //            window.location.reload();
            window.location = "/tareas";
        </script>
        <?php
    } else {
        echo "no hay cookie";
    }
}
?>
