<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
if (file_exists($file_nwlib)) {
    include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
} else {
    include_once $_SERVER["DOCUMENT_ROOT"] . '/nwproject/php/modulos/nwcommerce/_mod.php';
}
$p = $_POST;
$user = "";
$user_name = "";
if ($p["requiere_login"] == "si") {
    if (!isset($_SESSION["usuario"])) {
        echo "No puede ingresar, lo sentimos";
        return;
    }
    $db = NWDatabase::database();
    $cb = new NWDbQuery($db);
    $cb->prepareSelect("nwplay_ruleta_ganadores", "id, premio", "usuario_jugador=:usuario");
    $cb->bindValue(":usuario", $_SESSION["usuario"], true);
    if (!$cb->exec()) {
        echo "Error" . $cb->lastErrorText();
        return;
    }
    if ($cb->size() > 0) {
        $cb->next();
        $rr = $cb->assoc();
        echo "<h1>Ya habías jugado...</h1><p>El código de tu premio fue el #" . $rr["id"] . "</p>";
        return;
    }
    $user_name = $_SESSION["nombre"];
    $user = $_SESSION["usuario"];
} else {
    $user_name = $_SERVER['REMOTE_ADDR'];
    $user = $_SERVER['REMOTE_ADDR'];
}

$ca = new NWDbQuery($db);
$ca->prepareSelect("nwplay_ruleta_objetos", "id, premio, color", "id=:id");
$ca->bindValue(":id", $p["id"]);
if (!$ca->exec()) {
    echo "Error" . $ca->lastErrorText();
    return;
}
$total = $ca->size();
if ($total == 0) {
    return;
}
$ca->next();
$r = $ca->assoc();

$cj = new NWDbQuery($db);
$cj->prepareSelect("nwplay_ruleta_ganadores", "max(id) as id");
$cj->exec();
$cj->next();
$ra = $cj->assoc();
$id = $ra["id"] + 1;
//$id = master::getNextSequence("nwplay_ruleta_ganadores_id_seq");

$cc = new NWDbQuery($db);
$cc->prepareInsert("nwplay_ruleta_ganadores", "id, id_ruleta, usuario_jugador, premio_text, usuario, empresa, fecha, premio, usuario_nombre");
$cc->bindValue(":id", $id);
$cc->bindValue(":id_ruleta", $p["id_enc"]);
$cc->bindValue(":usuario_jugador", $user, true);
$cc->bindValue(":premio_text", $r["premio"]);
$cc->bindValue(":premio", $r["id"]);
$cc->bindValue(":usuario", $user, true);
$cc->bindValue(":empresa", 1);
$cc->bindValue(":fecha", date("Y-m-d H:i:s"));
$cc->bindValue(":usuario_nombre", $user_name, true);
if (!$cc->exec()) {
    echo "Error" . $cc->lastErrorText();
    return;
}
?>
<div class="div_premio">
    <h1>
        Felicitaciones
    </h1>
    <p>
        <?php echo $user_name; ?>
    </p>
    <h2>
        Ganaste: <?php echo $r["premio"]; ?>
    </h2>
    <p>
        Código de tu premio: <?php echo $id; ?>
    </p>
</div>
<?php
//echo "<div class='premio_div' style='background-color: " . $r["color"] . "' ># ". $p["id"] . ": Tu premio: " . $r["premio"] . "</div>";
?>
