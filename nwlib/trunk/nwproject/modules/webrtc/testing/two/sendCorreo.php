<?php

include $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

$p = $_POST;
$micorreoCorreo = $p["micorreoCorreo"];
$nombreCorreo = $p["nombreCorreo"];
$url = $p["url"];
$email = $p["correo"];
$name = $p["correo"];
$asunto = "Invitación a video conferencia con {$nombreCorreo}";
$titleEnc = "{$nombreCorreo} te ha invitado a una video llamada.";
$textBody = "Para unirse a la llamada, solo abra el siguiente enlace en su navegador:  <a target='_BLANK' href='{$url}'>{$url}</a>";
$textBody .= "<br /><br /><br />Si necesita ayuda o tiene sugerencias con el arreglo de llamadas, contáctenos a través de <a target='_BLANK' href='https://videoconf.gruponw.com/'>https://videoconf.gruponw.com/</a>";
$cliente_nws = false;
nw_configuraciones::sendEmail($email, $name, $asunto, $titleEnc, $textBody, $cliente_nws);
echo "OK";
return true;