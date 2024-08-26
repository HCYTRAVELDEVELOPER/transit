<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
//MYSQL NWPROJECT
    require_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nw_animate/_mod.php';
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$tabla = "nwanimate_objetos";
$ca->prepareSelect($tabla, "*", "id_escena=:escena order by orden asc");
$ca->bindValue(":escena", $_POST["escena"]);
if (!$ca->exec()) {
    echo "Errot: " . $ca->preparedQuery() . "... Error:" . $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    return;
}
echo "<ul class='ulLeftObjects'>";
for ($i = 0; $i < $total; $i++) {
    $ca->next();
    $r = $ca->assoc();
    echo "<li id='" . $r["id"] . "' name='" . $r["id"] . "' class='listObjectLeft listObject" . $r["id"] . "' >
         <div class='objectList objectList_" . $r["id"] . "' name='" . $r["id"] . "'>
        <img class='objectListImg' name='" . $r["id"] . "'  src='" . $r["imagen"] . "' /> <h1 class='titleTags'>" . strip_tags($r["nombre"]) . "</h1>
            
<div class='optionsLeftObject'>
        <div name='" . $r["id"] . "' class='buttonDuplicarLeft buttonsLeft' >Duplicar</div>
        <div name='" . $r["id"] . ", " . $r["velocidad"] . ", " . $r["reproducir"] . "' class='buttonAnimarLeft buttonsLeft' >Animar</div>
        <div id='" . $r["id"] . "' class='buttonMove buttonsLeft'>Mover</div>
        <div id='" . $r["id"] . "' class='buttonDelete buttonsLeft'>X</div>
</div>            

            </div>
            </li>";
    if ($i + 1 == $total) {
        ?>
        <script>
            $(document).ready(function() {
                jsObjectsLeft();
            });
        </script>
        <?php
    }
}
echo "</ul>";
?>
