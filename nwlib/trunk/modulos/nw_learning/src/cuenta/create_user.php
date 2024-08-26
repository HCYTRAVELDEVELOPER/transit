<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
    if (!function_exists("GetSQLValueString")) {

        function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
            $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;

            $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

            switch ($theType) {
                case "text":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "long":
                case "int":
                    $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                    break;
                case "double":
                    $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                    break;
                case "date":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "defined":
                    $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                    break;
            }
            return $theValue;
        }

    }
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cf = new NWDbQuery($db);

if (!isset($_POST["name"])) {
    return;
}
if ($_POST["name"] == "") {
    return;
}
if (!isset($_POST["mail"])) {
    return;
}
if ($_POST["mail"] == "") {
    return;
}
if (!isset($_POST["pass"])) {
    return;
}
if ($_POST["pass"] == "") {
    return;
}
$name = $_POST["name"];
$mail = $_POST["mail"];
$clave = md5($_POST["pass"]);

$cf->prepareSelect("terminales", "max(id) as id");
$cf->exec();
$cf->next();
$r_new_id = $cf->assoc();
$id_terminal = $r_new_id["id"] + 1;

$fields_t = "id,empresa,nombre,ciudad,url";
$cb->prepareInsert("terminales", $fields_t);
$cb->bindValue(":id", $id_terminal);
$cb->bindValue(":empresa", 1);
$cb->bindValue(":nombre", $name);
$cb->bindValue(":ciudad", 1);
$cb->bindValue(":url", $mail);
//$cb->bindValue(":user_main", $mail);
if (!$cb->exec()) {
    echo "errores";
    return;
}

$terminal = $id_terminal;


$fields = "nombre,  usuario, clave,  email, estado, terminal, perfil, empresa, conectado, cliente";
$ca->prepareInsert("usuarios", $fields);
$ca->bindValue(":nombre", $name);
$ca->bindValue(":usuario", $name);
$ca->bindValue(":clave", $clave);
$ca->bindValue(":email", $mail);
$ca->bindValue(":estado", "activo");
$ca->bindValue(":terminal", $terminal);
$ca->bindValue(":perfil", 2);
$ca->bindValue(":empresa", 1);
$ca->bindValue(":conectado", "SI");
$ca->bindValue(":cliente", 0);
if (!$ca->exec()) {
    echo "errores";
    return;
} else {
    echo "enviado correctamente";
//    ini_set('session.cookie_domain', '.gruponw.com');
//    session_set_cookie_params(0, '/', '.gruponw.com');
    session_start();
    $_SESSION['pagina'] = "SI";
    $_SESSION['usuario'] = $name;
    $_SESSION['empresa'] = 1;
    $_SESSION['terminal'] = $terminal;
    $_SESSION['perfil'] = 2;
    $_SESSION['nom_terminal'] = "hola";
    $_SESSION['autenticado'] = 'SI';
    $_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
    echo "Autenticado correctamente";
    ?>
    <script type="text/javascript">
    //        window.location.reload();
        url = '<?php echo $mail; ?>';
        window.location = "/" + url;
    </script>
    <?php
}
?>