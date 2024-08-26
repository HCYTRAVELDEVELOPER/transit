<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animate/_mod.php';
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$tabla = "nwanimate_objetos";
$ca->prepareSelect($tabla, "*", "id=:id");
$ca->bindValue(":id", $_POST["id"]);
if (!$ca->exec()) {
    echo "Errot: " . $ca->preparedQuery() . "... Error:" . $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    echo "No hay objetos";
    return;
}
$ca->next();
$object = $ca->assoc();
$num = $_POST["im"] + 1;
$repeticiones = 9;
if ($object["repeticiones"] != "") {
    $repeticiones = $object["repeticiones"];
}
?>
<div  style="<?php
if (isset($object["pos_x"])) {
    echo "left: " . $object["pos_x"] . "px;";
}
if (isset($object["pos_y"])) {
    echo "top: " . $object["pos_y"] . "px;";
}
if (isset($object["imagen"])) {
    echo "background-image: url(" . $object["imagen"] . ");";
}
if (isset($object["animado"]) && $object["animado"] == "si") {
    echo "background-size: cover;";
}
?>" id='object_<?php echo $object["id"]; ?>' class='box_object'  ></div>
<script>
    person[<?php echo $num; ?>] = <?php echo $object["id"]; ?>;       
<?php
if (isset($object["animado"]) && $object["animado"] == "si") {
    ?>
        animated(<?php echo $object["id"]; ?>, <?php echo $repeticiones; ?>, 0);
    <?php
} else {
    
}
</script>
