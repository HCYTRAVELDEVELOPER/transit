<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/nwproject/conectar/conectar.php");
include_once($_SERVER['DOCUMENT_ROOT'] . "/nwproject/php/utiles.php");
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

if ($_POST["mail"] == "" || $_POST["comentario"] == "") {
    echo "Debe llenar todos los campos. ";
    return;
}

$sql = sprintf("INSERT INTO nc_comments (product, comment, url, mail, user, date) 
    VALUES (%s, %s, %s, %s, %s, NOW())",
                GetSQLValueString($_POST['id_product_comment'], "int"),
                GetSQLValueString(clean_html($_POST['comentario']), "text"),
                GetSQLValueString(clean_html($_POST['url']), "text"),
                GetSQLValueString(clean_html($_POST['mail']), "text"),
                GetSQLValueString(isset($_SESSION["usuario"]) ? $_SESSION["usuario"] : "", "text")
);

if (!mysql_query($sql)) {
    echo "Error al insertar el nuevo usuario: \n$sql";
    exit;
} else {


    $mail = htmlspecialchars(str_replace(" ", "", $_POST['mail']));
    $mensaje = strip_tags($_POST['comentario']);
    $url = strip_tags($url);
    $de = "webmaster@" . str_replace("www.", "", $_SERVER["HTTP_HOST"]);

    if (comprobar_email($mail)) {

        $_POST['mail'] = str_replace("\r", "", $_POST['mail']); //preg_replace
        $_POST['mail'] = str_replace("\n", "", $_POST['mail']);

        $_SESSION['token'] = $token;
        $secret = 'ssshhitsasecret';
        $token = md5(rand(1, 1000) . $secret);
        $field = preg_replace("/[\n\r]+/", " ", $field);
// Remove injected headers
        $find = array("/bcc\:/i", "/Content\-Type\:/i", "/cc\:/i", "/to\:/i");
        $_POST['mail'] = preg_replace($find, "", $_POST['mail']);

        $mensajef = preg_replace($find, "", $mensaje);
        $mail = str_replace("\r", "\n", $mail);
        $mensajef = str_replace("\r", "\n", $mensajef);
        $url = str_replace("\r", "\n", $url);

        if (!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $mail)) {
            ob_clean();
            mail("assdres@hotmail.com", "Mensaje detenido", "$mensaje", "From: nombre <$mail>");
            exit("Mensaje detenido.");
        }
        if (eregi('^(bcc$|content-type|mime-version|--)', $key)) {
            print_error("Error al analizar."); //bloqueo de spam
        }

        $sql = "select * from correos";
        $query = mysql_query($sql);
        $correos = "";
        $i = 0;
        while ($result_correos = mysql_fetch_array($query)){
            $correos[$i] = $result_correos["correo"];
            $i++;
        }
        
        $destinatario = implode(",", $correos);
        
        $asunto = "Correo de " . $mail;
        $cuerpo = '
<html>
<head>
   <title>Correo de ' . $mail . '</title>
</head>
<body>
<h1>Correo de comentario en la página '. $_SERVER["HTTP_HOST"] .'</h1>
<p>
<b></b>
</p>
<p>
<b>E-Mail: ' . $mail . '</b>
    </p>
    <p>
<b>URL: ' . $url . '</b>
    </p>
        <p>
        <b>Comentarios: ' . $mensaje . '</b>
</p>
</body>
</html>
';

//para el envío en formato HTML
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
//dirección del remitente
        $headers .= "From: Comentarios: Webmaster NW <" . $de . ">\r\n";
//dirección de respuesta, si queremos que sea distinta que la del remitente
        $headers .= "Reply-To: " . $de . "\r\n";
//ruta del mensaje desde origen a destino
        $headers .= "Return-path: " . $de . "\r\n";
//direcciones que recibián copia
//$headers .= "Cc: assdres@hotmail.com\r\n";
//direcciones que recibirán copia oculta
        $headers .= "Bcc: assdres@hotmail.com\r\n";

        mail($destinatario, $asunto, $cuerpo, $headers);
    } else {
        echo "Verifique los datos a enviar.";
        exit;
    }
    echo "Muchas gracias por participar. Su comentario ha sido guardado. ";
}
?>