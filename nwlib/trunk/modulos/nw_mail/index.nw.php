<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

if (isset($_POST["email"])) {
    if (isset($_POST["clave_anterior"])) {
        if (isset($_POST["clave_nueva"])) {
            $dbscs = new NWDatabase();
            $dbscs->setDriver(NWDatabase::PGSQL);
            $dbscs->setHostName("192.168.2.11");
            $dbscs->setDatabaseName("ek");
            $dbscs->setUserName("andresf");
            $dbscs->setPassword("padre08");
            $dbscs->open_();

            $email = master::clean($_POST["email"]);
            $password = $_POST["clave_anterior"];

            $ca = new NWDbQuery($dbscs);
            $ca->prepareSelect("nwmail_users", "id,email", "email=:email and enabled=1 and password=:password");
            $ca->bindValue(":email", $email);
            $ca->bindValue(":password", md5($password));
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            if ($ca->size() == 0) {
                echo "El correo " . $_POST["email"] . " no se encuentra registrado en la base de datos, está desactivado o la clave anterior es incorrecta";
                return;
            }
            $ca->next();
            $r = $ca->assoc();
            $clave_nueva = master::clean($_POST["clave_nueva"]);
            $ca->prepareUpdate("nwmail_users", "password", "email=:email and id=:id");
            $ca->bindValue(":id", $r["id"]);
            $ca->bindValue(":email", $r["email"]);
            $ca->bindValue(":password", md5($clave_nueva));
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
                return;
            }
            echo "Cambio realizado exitosamente";
        }
    }
}
?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Actualizar Claves E-mail</title>
        <script type="text/javascript">
            function check() {
                var email = document.getElementById("email").value;
                var clave_anterior = document.getElementById("clave_anterior").value;
                var clave_nueva = document.getElementById("clave_nueva").value;
                var confirmar = document.getElementById("confirmar").value;
                if (email == "") {
                    alert("El correo es obligatorio");
                    return false;
                }
                if (clave_anterior == "") {
                    alert("La clave anterior es obligatoria");
                    return false;
                }
                if (clave_nueva == "") {
                    alert("La clave nueva es obligatoria");
                    return false;
                }
                if (clave_nueva != confirmar) {
                    alert("La clave nueva es diferente de la confirmación");
                    return false;
                }
                return true;
            }
        </script>
        <style type="text/css">
            .text_mail{ 
                position: relative;
                margin: 0;
                padding: 0;
                font-family: Arial;
                font-size: 1em;
                color: #972226;
                text-transform: uppercase;
                text-align: center;
                font-weight: bold;

            }
        </style>
    </head>
</html>
<div style="padding-right: 10px">
    <form onsubmit="return check();" method="POST" action="<?php echo $_SERVER["PHP_SELF"] ?>" id="nw_mail_form" class="nw_mail_form" name="nw_mail_form">
        <div class="text_mail">
            Mail: <br />
            <input style="text-align: center;" 
                   pattern="^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"
                   title="Ingrese su correo coorporativo" 
                   type="email" 
                   id="email"
                   name="email" required value="<?php echo isset($_SESSION["email"]) ? $_SESSION["email"] : ""; ?>"/><br />
            Clave Anterior:  <br />
            <input style="text-align: center;" type="password" name="clave_anterior" id="clave_anterior" required/><br />
            Clave Nueva:  <br />
            <input style="text-align: center;" type="password" name="clave_nueva" id="clave_nueva" required/><br />
            Confirmar Clave:  <br />
            <input  style="text-align: center;"type="password" name="confirmar" id="confirmar" required/><br />
            <input type="submit" name="submit" value="Cambiar clave" />
        </div>
    </form>
</div>