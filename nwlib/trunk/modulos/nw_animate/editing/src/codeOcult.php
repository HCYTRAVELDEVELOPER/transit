<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_learning/_mod.php';
}
session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$si = session::info();
$p = $_POST;
$ca->prepareSelect("nwanimate_code", "id,codigo", "id_enc=:id_enc and escena=:escena");
$ca->bindValue(":id_enc", $p["id_enc"]);
$ca->bindValue(":escena", $p["escena"]);
if (!$ca->exec()) {
    $db->rollback();
    echo "Error: " . $ca->lastErrorText();
    return;
}
$id = "";
$code = "";
if ($ca->size() > 0) {
    $ca->next();
    $ra_next = $ca->assoc();
    $id = $ra_next["id"];
    $code = $ra_next["codigo"];
}
?>
<form id='form_code'>
    <input type="hidden" name="id" value="<?php echo $id; ?>" />
    <textarea name='codigo' class='codigo' id='codigo'><?php echo $code; ?></textarea>
</form>