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
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/login_qxnw/_mod.php';
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$cf = new NWDbQuery($db);
$ce = new NWDbQuery($db);

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
$host = $_POST["host"];
$clave = md5($_POST["pass"]);

$id_terminal = master::getNextSequence("terminales_id_seq");
mt_srand(time());
$rand = mt_rand(1000000, 9999999);

$fields_t = "id,empresa,nombre,ciudad,clave,host";
$cb->prepareInsert("terminales", $fields_t);
$cb->bindValue(":id", $id_terminal);
$cb->bindValue(":empresa", 1);
$cb->bindValue(":nombre", $host);
$cb->bindValue(":ciudad", 1);
$cb->bindValue(":clave", $rand);
$cb->bindValue(":host", $host);
//$cb->bindValue(":user_main", $mail);
if (!$cb->exec()) {
    echo "ERROR: " . $cb->lastErrorText();
    return;
}
$terminal = $id_terminal;
$foto = "/nwlib" . master::getNwlibVersion() . "/dashboard/img/icon_user.png";
$id_user = master::getNextSequence("usuarios_id_seq");
$fields = "id, nombre,  usuario, clave,  email, estado, terminal, perfil, empresa, conectado, cliente, pais, foto";
$ca->prepareInsert("usuarios", $fields);
$ca->bindValue(":id", $id_user);
$ca->bindValue(":nombre", $name);
$ca->bindValue(":usuario", $mail);
$ca->bindValue(":clave", $clave);
$ca->bindValue(":email", $mail);
$ca->bindValue(":estado", "activo");
$ca->bindValue(":terminal", $terminal);
$ca->bindValue(":perfil", 2);
$ca->bindValue(":empresa", 1);
$ca->bindValue(":conectado", "SI");
$ca->bindValue(":cliente", 0);
$ca->bindValue(":pais", 1);
$ca->bindValue(":foto", $foto);
if (!$ca->exec()) {
    echo "Error line 110: " . $ca->lastErrorText();
    return;
}
$ce->prepareInsert("usuarios_empresas", "usuario,empresa");
$ce->bindValue(":usuario", $mail);
$ce->bindValue(":empresa", 1);
if (!$ce->exec()) {
    echo "Error line 117: " . $ca->lastErrorText();
    return;
}
echo "enviado correctamente";
session_start();
$_SESSION['pagina'] = "SI";
$_SESSION['foto'] = $foto;
$_SESSION['nombre'] = $name;
$_SESSION['usuario'] = $mail;
$_SESSION['email'] = $mail;
$_SESSION['empresa'] = 1;
$_SESSION['terminal'] = $terminal;
$_SESSION['perfil'] = 2;
$_SESSION['nom_terminal'] = "hola";
$_SESSION['autenticado'] = 'SI';
$_SESSION['ultimoAcceso'] = date("Y-n-j H:i:s");
$_SESSION['id'] = $id_user;
$_SESSION['nom_terminal'] = $host;
$_SESSION['perfil'] = 2;
$_SESSION['nom_perfil'] = "Operador Admin";
$_SESSION["pais_name"] = "Colombia";
echo "Autenticado correctamente";
?> 
<script type="text/javascript">
    window.location = "http://<?php echo $_SERVER["HTTP_HOST"]; ?>";
</script>