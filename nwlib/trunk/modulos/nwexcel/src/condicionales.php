<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
$db = NWDatabase::database();

$p = $_POST;
$id_documento = $p["id_documento"];
$div = $p["campo_div"];
$val = $p["val"];
$id = "";
$campo_max = "";
$campo_min = "";
$colormax = "";
$colormin = "";
$igual = "";
$colorigual = "";
$colornormal = "";

$ca = new NWDbQuery($db);
$ca->prepareSelect("nwexcel_condicionales", "*", "id_documento=:id and campo_div=:campo_div");
$ca->bindValue(":id", $id_documento);
$ca->bindValue(":campo_div", $div);
if (!$ca->exec()) {
    echo "Error . " . $ca->lastErrorText();
    return;
}
if ($ca->size() > 0) {
    $ca->next();
    $r = $ca->assoc();
    $id = $r["id"];
    $campo_max = $r["campo_max"];
    $campo_min = $r["campo_min"];
    $colormax = $r["colormax"];
    $colormin = $r["colormin"];
    $igual = $r["igual"];
    $colorigual = $r["colorigual"];
    $colornormal = $r["colornormal"];
}
?>
<h2>
    Condicionales
</h2>
<p>
    Complete las casillas de acuerdo a las condiciones y valores a comparar.
</p>
<form id="form_conditions">
    <input type="hidden" name="id" value="<?php echo $id; ?>" />
    <input type="hidden" name="id_documento" value="<?php echo $id_documento; ?>" />
    <input type="hidden" name="campo_div" value="<?php echo $div; ?>" />
    <div class="contain_condiv">
        <h3>
            1. Mayor que
        </h3>
        <p>
            Si <strong><?php echo $val; ?></strong> es mayor a   <input type="text" name="campo_max" value="<?php echo $campo_max; ?>" />
            <br />
            El color del texto será  <input type="color" id="cond_color"  tipo="cond_color" class="cond_button" name="colormax" value="<?php echo $colormax; ?>" />
        </p>
    </div>
    <div class="contain_condiv">
        <h3>
            2. Menor que
        </h3>
        <p>
            Si <strong><?php echo $val; ?></strong> es menor a   <input type="text" name="campo_min" value="<?php echo $campo_min; ?>" />
            <br />
            El color del texto será  <input type="color" id="colormin"  tipo="cond_color" class="cond_button" name="colormin" value="<?php echo $colormin; ?>" />
        </p>
    </div>
    <div class="contain_condiv">
        <h3>
            3. Igual a
        </h3>
        <p>
            Si <strong><?php echo $val; ?></strong> es igual a   <input type="text" name="igual" value="<?php echo $igual; ?>" />
            <br />
            El color del texto será  <input type="color" id="colorigual"  tipo="cond_color" class="cond_button" name="colorigual" value="<?php echo $colorigual; ?>" />
        </p>
    </div>
    <div class="contain_condiv">
        <h3>
            4. Si no pasa nada
        </h3>
        <p>
            El color del texto será  <input type="color" id="colorigual"  tipo="cond_color" class="cond_button" name="colornormal" <?php echo $colornormal; ?> />
        </p>
    </div>
</form>