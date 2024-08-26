<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
//variables funcionales para el select dependiente
$id_relation = "";
$col_relation = "";
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$p = $_POST;
$orden = "";
$ordenAsc = "";
if (isset($order)) {
    $orden = $order;
}
if (isset($p["order"])) {
    $orden = $p["order"];
}
if (isset($orderAscDesc)) {
    $ordenAsc = $orderAscDesc;
}
if (isset($p["order_asc"])) {
    $ordenAsc = $p["order_asc"];
}
//revisa si existe data por POST, si no obliga a tener la variable $id
if (!isset($p["id_select_enc"])) {
    if (!isset($id) && !isset($tableData)) {
        return false;
    }
} else {
    $id = $p["id_select_depend"];
    $id_select_enc = $p["id_select_enc"];
    $col_relation = $p["column_relation"];
    $tabla_data = $p["relation_tb"];
    $tableData = $p["table_data"];
    $cf = new NWDbQuery($db);
    $cf->prepareSelect($tabla_data, "id", "nombre=:id ");
    $cf->bindValue(":id", $id_select_enc);
    if (!$cf->exec()) {
        $rta = "Error. " . $cf->lastErrorText();
        return;
    }
    if ($cf->size() > 0) {
        $ra = $cf->flush();
        $id_relation = $ra["id"];
    }
}
//comprueba que el selectbox tenga relación o no
if (!isset($p["id_select_enc"])) {
    $cf = new NWDbQuery($db);
    $cf->prepareSelect("nwforms_preguntas a", "a.asociado,a.asociado_selectbox,a.asociado_columna", "a.id=:id and a.asociado='SI' ");
    $cf->bindValue(":id", $id);
    if (!$cf->exec()) {
        $rta = "Error. " . $cf->lastErrorText();
        return;
    }
    if ($cf->size() > 0) {
        $ra = $cf->flush();

        $ca->prepareSelect("nwforms_preguntas", "tabla_data", "id=:id ");
        $ca->bindValue(":id", $ra["asociado_selectbox"]);
        if (!$ca->exec()) {
            $rta = "Error. " . $ca->lastErrorText();
            return;
        }
        $rb = $ca->flush();
        $table = $rb["tabla_data"];
        ?>
        <script>
            $(document).ready(function () {
                actionSelectBoxDinamic({asociado_selectbox: "<?php echo $ra["asociado_selectbox"]; ?>", id: "<?php echo $id; ?>", table: "<?php echo $table; ?>", asociado_columna: "<?php echo $ra["asociado_columna"]; ?>", tableData: "<?php echo $tableData; ?>"});
            });
        </script>
        <?php
        return false;
    }
}
//inicia la consulta
$rta = "";
if ($tableData != null) {
    $table = $tableData;
    $where = "1=1";
    if ($table != "ciudades") {
        if (isset($_SESSION["terminal"])) {
            if (isset($_SESSION["multi_terminal"])) {
                $where .= " and terminal=:terminal";
            }
        }
    }
} else {
    $table = "nwforms_preguntas_valores";
    $where = "id_pregunta=:id";
}
$whereOrder = "";
if ($orden != "") {
    $whereOrder .= " order by {$orden} ";
    if ($ordenAsc != "") {
        $whereOrder .= " {$ordenAsc} ";
    }
}
//comprueba que el selectbox tenga relación o no
if (isset($p["id_select_enc"])) {
    if ($col_relation != "") {
        $where .= " and {$col_relation}=:id_relation ";
        $whereOrder = " order by nombre asc";
    }
}
$ca->prepareSelect($table, "*", $where . $whereOrder);
$ca->bindValue(":id", $id);
if (isset($_SESSION["terminal"])) {
    if (isset($_SESSION["multi_terminal"])) {
        $ca->bindValue(":terminal", $_SESSION["terminal"]);
    }
}
//comprueba que el selectbox tenga relación o no
if (isset($p["id_select_enc"])) {
    $ca->bindValue(":id_relation", $id_relation);
}
if (!$ca->exec()) {
    $rta = "Error. " . $ca->lastErrorText();
    return;
}
$total = $ca->size();
$text_seleccione = "Seleccione";
$rta .= "<option value=''>{$text_seleccione}</option>";
if ($ca->size() > 0) {
    for ($i = 0; $i < $total; $i++) {
        $r = $ca->flush();

        $selected = "";
        if (isset($value)) {
            if ($r["nombre"] == $value) {
                $selected = "selected='selected' ";
            } else
            if ($r["id"] == $value) {
                $selected = "selected='selected' ";
            }
        }

        if ($id == "newrecord") {
            $val = $r["id"];
        } else
        if ($tableData != null) {
            $val = $r["nombre"];
        } else {
            $val = $r["value"];
        }
        $rta .= "<option {$selected} value='{$val}'>{$r["nombre"]}</option>";
    }
}
echo $rta;
