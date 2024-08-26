<?php

include_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$fecha = date("Y-m-d H:i:s");
session::check();
$p = $_POST;
$si = session::getInfo();
$db = NWDatabase::database();
$db->transaction();
$cf = new NWDbQuery($db);
$cf->prepareUpdate("nwreu_enc", "estado, estado_text", "id=:id and terminal=:terminal and empresa=:empresa and usuario=:usuario");
$cf->bindValue(":id", $p["reu"]);
$cf->bindValue(":terminal", $si["terminal"]);
$cf->bindValue(":empresa", $si["empresa"]);
$cf->bindValue(":usuario", $si["usuario"]);
$cf->bindValue(":estado", "2");
$cf->bindValue(":estado_text", "Finalizado");
if (!$cf->exec()) {
    echo "error. " . $cf->lastErrorText();
    $db->rollback();
    return;
}
//$actions = explode(",", $_POST["actions"]);
$_POST["actions"] = str_replace(",", " ", $_POST["actions"]);
$actions = explode("|", $_POST["actions"]);
$total_actions = count($actions);
//echo $total_actions;
//print_r($actions);
if (isset($_POST["actions"])) {
    if ($_POST["actions"] != "") {
        if ($total_actions > 0) {
            $cc_dec = new NWDbQuery($db);
            for ($ii = 0; $ii < $total_actions; $ii++) {
//                $accs = explode("|", $actions[$ii]);
                $accs = explode("(/)", $actions[$ii]);
//                print_r($accs);
                $cc_dec->prepareInsert("nwreu_actions", "reunion, tipo, fecha,usuario, empresa, terminal, observaciones, estado");
                $cc_dec->bindValue(":reunion", $p["reu"]);
                $accs[0] = str_replace(" ", "", $accs[0]);
                $accs[0] = str_replace(",", "", $accs[0]);
                $accs[0] = str_replace("|", "", $accs[0]);
                $accs[0] = str_replace("  ", "", $accs[0]);
                $accs[0] = str_replace("   ", "", $accs[0]);
                $cc_dec->bindValue(":tipo", $accs[0]);
                $cc_dec->bindValue(":usuario", $si["usuario"]);
                $cc_dec->bindValue(":empresa", $si["empresa"]);
                $cc_dec->bindValue(":terminal", $si["terminal"]);
                $cc_dec->bindValue(":observaciones", $accs[1]);
                $cc_dec->bindValue(":estado", "Creado en Reunión");
                $cc_dec->bindValue(":fecha", $fecha);
                if (!$cc_dec->exec()) {
                    echo "Error: " . $cc_dec->lastErrorText();
                    $db->rollback();
                    return;
                }
            }
        }
    }
}

$users_asigna = explode(",", $_POST["asists"]);
$total = count($users_asigna);
if ($total > 0) {
    for ($i = 0; $i < $total; $i++) {
        $cc = new NWDbQuery($db);
        $ass = explode("|", $users_asigna[$i]);
        $asistente_id = $ass[0];
        if ($ass[1] == "false") {
            $asistente_status = "3";
        } else if ($ass[1] == "true") {
            $asistente_status = "3";
        }
        $cc->prepareUpdate("nwreu_asistentes", "estado, estado_text, fecha_update", "reunion=:reunion and id=:id and terminal=:terminal and empresa=:empresa and usuario=:usuario");
        $cc->bindValue(":reunion", $p["reu"]);
        $cc->bindValue(":usuario", $si["usuario"]);
        $cc->bindValue(":empresa", $si["empresa"]);
        $cc->bindValue(":terminal", $si["terminal"]);
        $cc->bindValue(":id", $asistente_id);
        $cc->bindValue(":estado", $asistente_status);
        $cc->bindValue(":estado_text", "Confirmado");
        $cc->bindValue(":fecha_update", $fecha);
        if (!$cc->exec()) {
            echo "Error: " . $cc->lastErrorText();
            $db->rollback();
            return;
        }
    }
}
$temas_asigna = explode(",", $_POST["temas"]);
$total_temas = count($temas_asigna);
if ($total_temas > 0) {
    for ($ii = 0; $ii < $total_temas; $ii++) {
        $temss = explode("|", $temas_asigna[$ii]);
        $tema_id = $temss[0];
        if ($tema_id != "") {
            $tema_status = $temss[1];
            $ce = new NWDbQuery($db);
            $ce->prepareUpdate("nwreu_temas", "estado, estado_text, fecha_update", "reunion=:reunion and id=:id and terminal=:terminal and empresa=:empresa and usuario=:usuario");
            $ce->bindValue(":reunion", $p["reu"]);
            $ce->bindValue(":id", $tema_id);
            $ce->bindValue(":usuario", $si["usuario"]);
            $ce->bindValue(":empresa", $si["empresa"]);
            $ce->bindValue(":terminal", $si["terminal"]);
            $ce->bindValue(":estado", $tema_status);
            $ce->bindValue(":estado_text", "Finalizado");
            $ce->bindValue(":fecha_update", $fecha);
            if (!$ce->exec()) {
                echo "Error: " . $ce->lastErrorText();
                $db->rollback();
                return;
            }
        }
    }
}
$db->commit();
return true;
?>