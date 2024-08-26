<div class="contenedorResults">
    <?php
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $dbd = NWDatabase::database();
    $ca = new NWDbQuery($dbd);
    $where = "empresa=:empresa";
    $campos = "id,tarea,observaciones";
    $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $_POST["buscar"], true);
    if (isset($_POST["asignement"]) && $_POST["asignement"] != "") {
        $where .= " and usuario=:usuario";
    } else {
        $where .= " and usuario_asignado=:usuario_id";
    }
    $ca->prepareSelect("tareas_diarias", "*,
                                           func_concepto(usuario_asignado, 'usuarios') as usuario_asignado_text,
                                           func_concepto(estado, 'estados_tareas_diarias') as estado_text,
                                           func_concepto(estado, 'estados_tareas_diarias', 'color') as color,
                                           func_concepto(proyecto, 'projectplan_enc') as proyecto_text
                                           ", $where . " order by fecha_final desc");
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    $ca->bindValue(":usuario_id", $_SESSION["id"]);
    if (!$ca->exec()) {
        echo "errores" . $ca->preparedQuery() . " Error: " . $ca->lastErrorText();
        return;
    }
    echo "<div class='encResultsSearch'>";
    ?>
    <form  method="post" name="form_chat_tres" id="form_chat_tres">
        <input type='hidden' value='<?php echo $_POST["buscar"]; ?>' id="buscar" name="buscar" />
        <?php
        if (!isset($_POST["asignement"])) {
            ?>
            <input type='hidden' value='<?php echo $_SESSION["id"]; ?>' id="asignement" name="asignement" />
            <?php
        }
        ?>
    </form>
    <?php
    echo "<h3>Resultados de su búsqueda " . $_POST["buscar"] . ". Total " . $ca->size() . " resultados encontrados.</h3>";
    if (isset($_POST["asignement"]) && $_POST["asignement"] != "") {
        ?>
        <input onclick="searchTask('form_chat_tres')" class='buttonSearhcAsigned' type='button' value='Buscar en mis tareas' />
        <?php
    } else {
        ?>
        <input onclick="searchTask('form_chat_tres')" class='buttonSearhcAsigned' type='button' value='Buscar tareas asignadas por mi' />
        <?php
    }
    include "buscador_others.php";
    echo "</div>";
    ?>
    <table><tr><th>ID</th><th>Creación</th><th>Fecha Final</th><th>Estado</th><th>Creador</th><th>Responsable</th><th>Proyecto</th><th>Tarea</th></tr>
        <?php
        if ($ca->size() == 0) {
            echo "No hay resultados";
            return;
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            if ($r["observaciones"] == "") {
                $tarea = $r["tarea"];
            } else {
                $tarea = $r["observaciones"];
            }
            ?>
            <tr onclick=" seetareaDialog(<?php echo $r["id"]; ?>, 1, '<?php echo $r["fecha_final"]; ?>', '<?php echo $r["fecha_final"]; ?>',<?php echo $r["id"]; ?>, <?php echo $r["id"]; ?>);" class='tr_taks_result' style='color: <?php echo $r["color"]; ?>;'>
                <td><span><?php echo $r["id"]; ?></span></td>
                <td><span><?php echo $r["fecha"]; ?></span></td>
                <td><span><?php echo $r["fecha_final"]; ?></span></td>
                <td><span><?php echo $r["estado_text"]; ?></span></td>
                <td><span><?php echo $r["usuario"]; ?></span></td>
                <td><span><?php echo $r["usuario_asignado_text"]; ?></span></td>
                <td><span><?php echo $r["proyecto_text"]; ?></span></td>
                <td><?php echo strip_tags($tarea); ?></td>
            </tr>
            <?php
        }
        ?>
    </table>
    <?php
    ?>
</div>