<script type="text/javascript">
    alert("si si");
</script>

<?php

echo "no llega";

if (isset($_POST['usuario'])) {

    if ($nc_cfg["seguridad"] == "SI") {
        if ($securimage->check($_POST["captcha_code"]) == false) {
            echo "El texto ingresado es incorrecto. Inténtelo de nuevo. ";
            return;
        }
    }

    $sql = sprintf("SELECT * FROM usuarios_general WHERE usuario=%s", GetSQLValueString($_POST['usuario'], "text")
    );
    $result = mysql_query($sql);
    print_r($result);
    if (mysql_num_rows($result) == 0) {
        echo "Usuario o clave incorrecta";
    } else {
        $array = mysql_fetch_array($result);
        if ($array['clave'] == $_POST['clave']) {
            //  session_name('login');
            session_start();
            $_SESSION['pagina'] = "SI";
            $_SESSION['usuario'] = $array['usuario'];
            $_SESSION['ciudad'] = $array['ciudad'];
            $_SESSION['autenticado'] = 'SI';
            $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
            echo "Autenticado correctamente";
        } else {
            echo "Usuario o clave incorrecta";
        }
    }
    Desconectar();
}
?>