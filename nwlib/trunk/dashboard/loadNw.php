<!--<link rel="stylesheet" type="text/css" href="/nwlib/dashboard/css/style_loadnw.css" />-->
<?php
if (session_id() == "") {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Sesión Inválida. Inicie sesión..";
    return;
}
global $id;
$id = $_GET["id"];
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
?>
<div class="boxSearch">
    <h3 class="h3Search">
        Buscar
    </h3>
    <form id="formId" name="form" action="javascript:search()">
        <input id="ci" type="text" value="" class="search"/>
        <input type="submit" value="Buscar" class="submit" />
    </form>
</div>
<div id="searchResult"></div>
<div class="bgBlack" onclick="limpiarSearch();"></div>