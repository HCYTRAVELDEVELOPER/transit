<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
//if (session_id() == "") {
//    session_start();
//}
//if (!isset($_SESSION["usuario"])) {
//    echo "Sesion Invalida. Inicie sesion..";
//    return;
//}
//session::check();
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nwplay_millonario_respuestas", "id", "pregunta=:pregunta and correcta=:correcta order by random() limit 2");
$ca->bindValue(":pregunta", $_POST["id"]);
$ca->bindValue(":correcta", "NO");
if (!$ca->exec()) {
    echo "No se pudo";
}
if ($ca->size() == 0) {
    echo "No hay respuestas para esta pregunta, lo sentimos. Vuelve más tarde.";
    return;
}
for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $r = $ca->assoc();
    ?>
    <style>
        .lisResLi<?php echo $r["id"]; ?>{
            pointer-events: none;
        }
        .lisResLi<?php echo $r["id"]; ?> span{
            color: rgb(76, 185, 219);
        }
    </style>
    <script>
        $(".lisRes<?php echo $r["id"]; ?>").html("");
        $(".lisResLi<?php echo $r["id"]; ?>").removeClass("lisRes");
        $(".lisResLi<?php echo $r["id"]; ?>").addClass("nada");
        $(".lisResLi<?php echo $r["id"]; ?>").removeClass("lisResLi<?php echo $r["id"]; ?>");
        $(".cincu_cincu").removeAttr("id");
        $(".cincu_cincu").addClass("HelpUsada");
    </script>
    <?php
}
?>
