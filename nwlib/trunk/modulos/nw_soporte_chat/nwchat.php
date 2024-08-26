<?php
$user = "visitante";
$mail = "0";
if (session_id() == "") {
    session_start();
}
if (isset($_SESSION["usuario"])) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $user = $_SESSION["usuario"];
    $mail = $_SESSION["email"];
}
?>
<style>
    .chatnwsubframe{
        position: fixed;
        bottom: 0px;
        right: 0px;
        width: 255px;
        height: 98px;
    }
</style>
<iframe class="chatnwsubframe" src="http://nwadmin.gruponw.com/nwlib/modulos/nw_soporte_chat.php?host=<?php echo $_SERVER["HTTP_HOST"]; ?>&user=<?php echo $user; ?>&mail=<?php echo $mail; ?>"
        name="SubHtml"
        width="100%" height="200px" scrolling="auto" frameborder="0">
<p>Texto alternativo para navegadores que no aceptan iframes.</p>
</iframe>