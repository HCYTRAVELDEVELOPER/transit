<?php
$file_nwlib = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$ruta_enlaces = "";
$motor_bd = "";
if (file_exists($file_nwlib)) {
//POSTGRESQL NWLIB
    require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
    $ruta_enlaces = "";
    $motor_bd = "PSQL";
} else {
//MYSQL NWPROJECT
    $ruta_enlaces = "/nwproject/php/modulos/";
    $motor_bd = "MYSQL";
    require_once $_SERVER["DOCUMENT_ROOT"] . $ruta_enlaces . 'nw_maps/_mod.php';
    if (!function_exists("GetSQLValueString")) {

        function GetSQLValueString($theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
            $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;

            $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysql_escape_string($theValue);

            switch ($theType) {
                case "text":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "long":
                case "int":
                    $theValue = ($theValue != "") ? intval($theValue) : "NULL";
                    break;
                case "double":
                    $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
                    break;
                case "date":
                    $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
                    break;
                case "defined":
                    $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
                    break;
            }
            return $theValue;
        }

    }
}
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$where = "1=1 ";
$where .= "and empresa=:empresa and terminal=:terminal ";
$ca->prepareSelect("usuarios", "*", "$where order by nombre asc");
$ca->bindValue(":empresa", $_SESSION["empresa"]);
$ca->bindValue(":terminal", $_SESSION["terminal"]);
if (!$ca->exec()) {
    echo "No se pudo consultar los states";
    return;
}
$total = $ca->size();
if ($total == 0) {
    echo "No hay registros";
    return;
}
?>
<select name='users_list'  onchange="loadList();">
    <option value="">Todos</option>
    <?php
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        echo "<option value='" . $r["id"] . "'>" . $r["nombre"] . "</option>";
    }
    ?>
</select>