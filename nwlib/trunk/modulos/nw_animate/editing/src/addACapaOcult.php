<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
session::check();

function loadOb() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::info();
    $rta = "";
    $p = $_POST;
    $ca->prepareSelect("nwanimate_objetos", "id,nombre", "id_enc=:id_enc and id_escena=:escena and tipo=:tipo");
    $ca->bindValue(":id_enc", $p["id_enc"]);
    $ca->bindValue(":escena", $p["escena"]);
    $ca->bindValue(":tipo", "capa");
    if (!$ca->exec()) {
        $db->rollback();
        echo "Error: " . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total > 0) {
        $rta .= "<select name='capa' id='capa' >";
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $rta .= "<option value='{$r["id"]}'>{$r["nombre"]}</option>";
        }
        $rta .= " </select>";
    } else {
        $rta .= " No hay capas";
    }
    return $rta;
}
?>
<form id='form_addcapa'>
    <p>
        Seleccione la capa a agregar el objeto
    </p>
    <input type="hidden" name="id" value="<?php echo $_POST["id"]; ?>" />
    <?php
    print_r(loadOb());
    ?>
</form>