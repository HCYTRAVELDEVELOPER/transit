<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "/nwlib/modulos/";
    $motor_bd = "PSQL";
} else {
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
}
$user_p = "";
$priority_p = "";
$estado_p = "";
if (isset($_POST["priority"])) {
    $priority_p = $_POST["priority"];
}
if (isset($_POST["estado"])) {
    $estado_p = $_POST["estado"];
}
//print_r($_POST);
if (isset($_SESSION["id"])) {
    $user_p = $_SESSION["id"];
}

function states($table) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = "1=1 ";
    $where .= " and empresa=:empresa and terminal=:terminal ";
    $ca->prepareSelect($table, "id, nombre", "$where order by nombre asc");
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":terminal", $_SESSION["terminal"]);
    if (!$ca->exec()) {
        echo "No se pudo consultar los states";
        return;
    }
    if ($ca->size() == 0) {
        echo "No hay registros";
        return;
    }
    $total = $ca->size();
    $select = "";
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r["nombre"] == "Finalizado") {
            $select = "selected";
        } else {
            $select = "";
        }
        echo "<option $select value='" . $r["id"] . "'>" . $r["nombre"] . "</option>";
    }
}
?>
<form id="formListTask">
    <input type="hidden" value="<?php echo $user_p; ?>" name="user" />
    <input type="hidden" value="<?php echo $priority_p; ?>" name="priority" />
    <input type="hidden" value="<?php echo $estado_p; ?>" name="estado" />
    <div class="filters_list">
        <div class="boxFiltersInput">
            <label>
                Mostrar: 
            </label>
            <select name="show"  onchange="loadList();">
                <option selected value="">Todos</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Último Mes</option>
            </select>
        </div>
        <div class="boxFiltersInput">
            <label>
                Modo: 
            </label>
            <select name="mode"  onchange="loadList();">
                <option value="">Todos</option>
                <option value="incluir">Incluir</option>
                <option selected value="excluir">Excluir</option>
            </select>
        </div>
        <div class="boxFiltersInput">
            <label>
                Estado: 
            </label>
            <select name="state" onchange="loadList();">
                <option value="">Todos</option>
                <?php
                states("estados_tareas_diarias");
                ?>
            </select>
        </div>
        <div class="boxFiltersInput">
            <label>
                Proyecto: 
            </label>
            <select name="proyecto" onchange="loadList();">
                <option value="">Todos</option>
                <option value="0">Sin Proyecto</option>
                <?php
                states("projectplan_enc");
                ?>
            </select>
        </div>
        <div class="boxFiltersInput">
            <label>
                Tipo: 
            </label>
            <select name="tipo"  onchange="loadList();">
                <option value="">Todos</option>
                <option value="tarea">Tareas</option>
                <option value="adicional">Adicionales</option>
                <option value="cita">Citas</option>
            </select>
        </div>
        <div class="boxFiltersInput">
            <label>
                Prioridad 
            </label>
            <select name="prioridad"  onchange="loadList();">
                <option value="">Todos</option>
                <option value="4">Inmediata</option>
                <option value="3">Alta</option>
                <option value="2">Media</option>
                <option value="1">Baja</option>
            </select>
        </div>
        <div class="boxFiltersInput">
            <label>
                Ver
            </label>
            <select name="asignated"  onchange="verOthers(this);">
                <option value="my">Mis Tareas</option>
                <option value="other">Asignadas</option>
            </select>
        </div>
        <div id="lists_tasks_users"></div>
    </div>
</form>