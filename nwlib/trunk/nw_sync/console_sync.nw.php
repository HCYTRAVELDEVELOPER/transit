<?php
ini_set('display_errors', 1);

error_reporting(E_ALL);
global $datos;
$datos = $_GET;
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
include_once $_SERVER['DOCUMENT_ROOT'] . '/nwlib6/rpc/nwApi.inc.php';
$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nw_sync_enc", "*", "id=:id");
$ca->bindValue(":id", $_GET["enc"]);
if (!$ca->exec()) {
    echo $ca->lastErrorText();
}
$enc = $ca->flush();

$nwApi = new nwApi($enc["url"]);
?>

<!DOCTYPE html >
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title></title>
    </head>
    <style type="text/css">
        .body{
            margin: 0;
            padding: 0;
            font-family: calibri;
            font-size: 16px;
        }
        .header{
            height: 300px;
            width: 100%;
        }
        .encabezado{
            width: 100%;
            text-align: center;
            display:inline-block;
        }
        p{
            padding: 0;
            margin: 0;
        }
        h3{
            padding: 0;
            margin: 0;
        }
        .container{
            width: 100%;
            height: auto;
            margin-top: 15px;
        }
        section{
            width: 95%;
            margin: 0 auto;
            height: auto;
        }
        table{
            width: 100%;
            text-align: center;
            background: #FFF;
            font-family: Arial;
            font-size: 14px;
        }
        table th{
            width: auto;
            background: #9ABFBD;
        }
        table th,td{
            width: auto;
            height: 20px;
            border: 1px solid #000;
        }
        .servicios{
            width: 80%;
            margin: 0 auto;
            margin-top: 30px;
        }
        .coordenadas{
            width: 47%;
        }
        .integrantes{
            width: 47%;
        }
        .tablas{
            display: flex;
            justify-content: space-around;
        }
        .footer {
            color: black;
            font-family: arial;
            font-size: 10px;
            position: fixed;
            height: 50px;
            bottom: 0;
        }
        .presupuesto{
            background-color: #5F9AAC;
        }
        .gastos{
            background-color: #ED742E;
        }
        .datos_enc{
            width:50%;
            display: inline-block;
        }
    </style>
    <body>
        <div>
            <?php
            echo "  <h1>BienvenidoÂ¡Â¡</h1>";
            echo '<p>Estamos iniciando el proceso, sincronizando a <i style="color: blue">' . $enc["url"] . '.......</i></p><br />';
            $ca->prepareSelect("nw_sync_tables", "*", "1=1", "nivel,orden asc");
            $ca->bindValue(":id", $_GET["enc"]);
            if (!$ca->exec()) {
                echo $ca->lastErrorText();
            }
            $tables = array();
            $res = $ca->assocAll();
            for ($x = 0; $x < count($res); $x++) {
                $table = $res[$x];
                if ($table["tipo"] == "ENVIAR") {
                    if ($table["nivel"] == "1") {
                        $datos = nw_sync::getDataByTableNotRepeat($table["nombre"]);
                        ?>
                        <p><b><?php echo $table["nombre"] ?></b>  ->>Nivel: <?php echo $table["nivel"] ?> >> <b style="color: blue">Total registros por enviar: <?php echo count($datos) ?></b></p>
                        <?php
                        for ($data = 0; $data < count($datos); $data++) {
                            $r = Array();
                            $r["data"] = $datos[$data];
                            $r["table"] = $table["nombre"];
                            $nwApi->setUser($enc["user"]);
                            $nwApi->setPassword($enc["pass"]);
                            $nwApi->setProfile($enc["profile"]);
                            $nwApi->setCompany($enc["company"]);
                            $nwApi->startSession();
                            $arr = $r;
                            $method = $enc["method"];
                            $class = $enc["class"];
                            $ress = $nwApi->exec($method, $class, $arr);
                            if (isset($ress["error"]) && $ress["error"] != "") {
                                $ca->prepareInsert("nw_sync_history_enc", "id_resultado,error_text,enc,tabla,id_enviado,estado,usuario,fecha", "enc=:id and tipo='ENVIAR'", "nivel,orden asc");
                                $ca->bindValue(":usuario", $_SESSION["usuario"]);
                                $ca->bindValue(":fecha", date("Y-m-d"));
                                $ca->bindValue(":estado", 'FALLO');
                                $ca->bindValue(":tabla", $table["nombre"]);
                                $ca->bindValue(":enc", $_GET["enc"]);
                                $ca->bindValue(":error_text", $ress["error"]["message"], true);
                                $ca->bindValue(":id_resultado", 0);
                                $ca->bindValue(":id_enviado", $datos[$data]["id"]);
                                if (!$ca->exec()) {
                                    echo $ca->lastErrorText();
                                }
                                ?>
                                <li><b><?php echo $table["nombre"] ?></b>  Registro# : <?php echo $datos[$data]["id"] ?> >> <i style="color: red">FALLIDO</i> Error: <?php echo $ress["error"]["message"] ?></li>
                                <?php
                            } else {
                                if ($ress) {
                                    if ($ress["result"]) {
                                        $ca->prepareInsert("nw_sync_history_enc", "id_resultado,error_text,enc,tabla,id_enviado,estado,usuario,fecha", "enc=:id and tipo='ENVIAR'", "nivel,orden asc");
                                        $ca->bindValue(":usuario", $_SESSION["usuario"]);
                                        $ca->bindValue(":fecha", date("Y-m-d"));
                                        $ca->bindValue(":estado", 'ENVIADO');
                                        $ca->bindValue(":tabla", $table["nombre"]);
                                        $ca->bindValue(":enc", $_GET["enc"]);
                                        $ca->bindValue(":error_text", '');
                                        $ca->bindValue(":id_resultado", $ress["result"]);
                                        $ca->bindValue(":id_enviado", $datos[$data]["id"]);
                                        if (!$ca->exec()) {
                                            echo $ca->lastErrorText();
                                        }
                                        ?>
                                        <li><b><?php echo $table["nombre"] ?></b>  Registro# : <?php echo $ress["result"] ?> >> <i style="color: green">ENVIADO</i></li>
                                        <?php
                                        for ($y = 0; $y < count($res); $y++) {
                                            if ($res[$y]["tabla_a_conectar"] == $table["id"]) {
                                                $tables[$res[$y]["nombre"]] = nw_sync::getDataByTableNotRepeat($res[$y]["nombre"]);
                                            }
                                        }
                                        for ($y = 0; $y < count($res); $y++) {
                                            if ($res[$y]["tabla_a_conectar"] == $table["id"]) {
                                                for ($det = 0; $det < count($tables[$res[$y]["nombre"]]); $det++) {
                                                    if ($tables[$res[$y]["nombre"]][$det]["ingreso"] == $datos[$data]["id"]) {
                                                        $r = Array();
                                                        $r["data"] = $tables[$res[$y]["nombre"]][$det];
                                                        $r["table"] = $res[$y]["nombre"];
                                                        $keys = Array();
                                                        $keys["parent"] = "ingreso";
                                                        $keys["foreginkey"] = $ress["result"];
                                                        $r["keys"] = $keys;
                                                    } else if (isset($tables[$res[$y]["nombre"]][$det]["num_ingreso"]) && $tables[$res[$y]["nombre"]][$det]["num_ingreso"] == $datos[$data]["id"]) {
                                                        $r = Array();
                                                        $r["data"] = $tables[$res[$y]["nombre"]][$det];
                                                        $r["table"] = $res[$y]["nombre"];
                                                        $keys = Array();
                                                        $keys["parent"] = "num_ingreso";
                                                        $keys["foreginkey"] = $ress["result"];
                                                        $r["keys"] = $keys;
                                                    }
                                                    if ((isset($tables[$res[$y]["nombre"]][$det]["num_ingreso"]) && $tables[$res[$y]["nombre"]][$det]["num_ingreso"] == $datos[$data]["id"]) || (isset($tables[$res[$y]["nombre"]][$det]["ingreso"]) && $tables[$res[$y]["nombre"]][$det]["ingreso"] == $datos[$data]["id"])) {
                                                        $nwApi->setUser($enc["user"]);
                                                        $nwApi->setPassword($enc["pass"]);
                                                        $nwApi->setProfile($enc["profile"]);
                                                        $nwApi->setCompany($enc["company"]);
                                                        //$nwApi->startSession();
                                                        $arr = $r;
                                                        $method = $enc["method"];
                                                        $class = $enc["class"];
                                                        $ressdetalle = $nwApi->exec($method, $class, $arr);

                                                        if (isset($ressdetalle["error"]) && $ressdetalle["error"] != "") {
                                                            $ca->prepareInsert("nw_sync_history_enc", "id_resultado,error_text,enc,tabla,id_enviado,estado,usuario,fecha");
                                                            $ca->bindValue(":usuario", $_SESSION["usuario"]);
                                                            $ca->bindValue(":fecha", date("Y-m-d"));
                                                            $ca->bindValue(":estado", 'FALLIO');
                                                            $ca->bindValue(":tabla", $res[$y]["nombre"]);
                                                            $ca->bindValue(":enc", $_GET["enc"]);
                                                            $ca->bindValue(":error_text", $ressdetalle["error"]["message"]);
                                                            $ca->bindValue(":id_resultado", 0);
                                                            $ca->bindValue(":id_enviado", $tables[$res[$y]["nombre"]][$det]["ingreso"]);
                                                            if (!$ca->exec()) {
                                                                echo $ca->lastErrorText();
                                                            }
                                                            ?>
                                                            <li><b><?php
                                                                    echo $res[$y]["nombre"]
                                                                    ?></b>  Registro# : <?php echo $ressdetalle["result"] ?> >> <i style="color: red">FALLIDO</i> Error: <?php echo $ress["error"]["message"] ?></li>
                                                                    <?php
                                                                } else {
                                                                    if ($ressdetalle) {
                                                                        if ($ressdetalle["result"]) {
                                                                            $ca->prepareInsert("nw_sync_history_enc", "id_resultado,error_text,enc,tabla,id_enviado,estado,usuario,fecha");
                                                                            $ca->bindValue(":usuario", $_SESSION["usuario"]);
                                                                            $ca->bindValue(":fecha", date("Y-m-d"));
                                                                            $ca->bindValue(":estado", 'ENVIADO');
                                                                            $ca->bindValue(":tabla", $res[$y]["nombre"]);
                                                                            $ca->bindValue(":enc", $_GET["enc"]);
                                                                            $ca->bindValue(":error_text", '');
                                                                            $ca->bindValue(":id_resultado", $ressdetalle["result"]);
                                                                            $ca->bindValue(":id_enviado", $tables[$res[$y]["nombre"]][$det]["ingreso"]);
                                                                            if (!$ca->exec()) {
                                                                                echo $ca->lastErrorText();
                                                                            }
                                                                            ?>
                                                                    <li><b> <?php echo $res[$y]["nombre"] ?></b>  Registro# : <?php echo $ressdetalle["result"] ?> >> <i style="color: green">ENVIADO</i></li>
                                                                    <?php
                                                                }
                                                                $ca->prepareInsert("nw_sync_history", "tabla,id_enviado");
                                                                $ca->bindValue(":tabla", $res[$y]["nombre"]);
                                                                $ca->bindValue(":id_enviado", $tables[$res[$y]["nombre"]][$det]["ingreso"]);
                                                                if (!$ca->exec()) {
                                                                    echo $ca->lastErrorText();
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        $ca->prepareInsert("nw_sync_history", "tabla,id_enviado");
                                        $ca->bindValue(":tabla", $table["nombre"]);
                                        $ca->bindValue(":id_enviado", $datos[$data]["id"]);
                                        if (!$ca->exec()) {
                                            echo $ca->lastErrorText();
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    $id_in_table = master::getMaxId($table["nombre"], $db, false);
                    $r = Array();
                    $r["id_in_table"] = $id_in_table;
                    $r["table"] = $table["nombre"];
                    $nwApi->setUser($enc["user"]);
                    $nwApi->setPassword($enc["pass"]);
                    $nwApi->setProfile($enc["profile"]);
                    $nwApi->setCompany($enc["company"]);
                    $nwApi->startSession();
                    $arr = $r;
                    $method = "getInfoTable";
                    $class = $enc["class"];
                    $res_get = $nwApi->exec($method, $class, $arr);
                    if (isset($res_get["error"]) && $res_get["error"] != "") {
                        $ca->prepareInsert("nw_sync_history_enc", "id_resultado,error_text,enc,tabla,id_enviado,estado,usuario,fecha", "enc=:id and tipo='ENVIAR'", "nivel,orden asc");
                        $ca->bindValue(":usuario", $_SESSION["usuario"]);
                        $ca->bindValue(":fecha", date("Y-m-d"));
                        $ca->bindValue(":estado", 'FALLO');
                        $ca->bindValue(":tabla", $table["nombre"]);
                        $ca->bindValue(":enc", $_GET["enc"]);
                        $ca->bindValue(":error_text", $res_get["error"]["message"], true);
                        $ca->bindValue(":id_resultado", 0);
                        $ca->bindValue(":id_enviado", $id_in_table);
                        if (!$ca->exec()) {
                            echo $ca->lastErrorText();
                        }
                        ?>
                        <li><b><?php
                                echo $res[$y]["nombre"]
                                ?></b>  Registro# : <?php echo $res_get["result"] ?> >> <i style="color: red">FALLIDO</i> Error: <?php echo $ress["error"]["message"] ?></li>

                        <?php
                    } else {

                        $ca->prepare("SELECT column_name as nombre,data_type as field_type
            FROM information_schema.columns cols
            WHERE
            cols.table_name = :table 
            order by column_name, cols.ordinal_position");
                        $ca->bindValue(":table", $table["nombre"], true);
                        if (!$ca->exec()) {
                            return "Error ejecutando la consulta: " . $ca->lastErrorText();
                        }
                        $columns = $ca->assocAll();
                        $cols = "";
                        $values = "";
                        $arrCols = Array();
                        for ($i = 0; $i < count($columns); $i++) {
                            $cols .= $columns[$i]["nombre"];
                            $values .= ":" . $columns[$i]["nombre"];
                            $arrCols[$columns[$i]["nombre"]] = $columns[$i]["field_type"];
                            $u = count($columns) - 1;
                            if ($i <> $u) {
                                $cols .= ",";
                                $values .= ",";
                            }
                        }

                        for ($dat = 0; $dat < count($res_get["result"]); $dat++) {
                            $id_in_table++;
                            $ca->prepareInsert($table["nombre"], $cols, $values);
                            foreach ((array) $res_get["result"][$dat] as $key => $v) {
                                if ($key != "id") {
                                    if ($arrCols[$key] == 'timestamp without time zone' || $arrCols[$key] == 'time without time zone' || $arrCols[$key] == 'date') {
                                        $ca->bindValue(":" . $key, $v, true, true);
                                    } else if ($arrCols[$key] == 'integer' || $arrCols[$key] == 'double precision') {
                                        $ca->bindValue(":" . $key, $v == "" ? 0 : $v);
                                    } else if ($arrCols[$key] == 'boolean') {
                                        $ca->bindValue(":" . $key, $v == "" || $v == null || $v == "f" || $v == "false" ? 'f' : 't');
                                    } else {
                                        $ca->bindValue(":" . $key, $v, true);
                                    }
                                } else {
                                    $ca->bindValue(":id", $id_in_table);
                                }
                            }
                            if (!$ca->exec()) {
                                return "Error ejecutando la consulta: " . $ca->lastErrorText();
                            }
                        }
                        if (count($res_get) > 0) {
                            ?>
                            <li><b><?php echo $r["table"] ?></b>  Registros# : <?php echo count($res_get) ?> >> <i style="color: blue">RECIBIDOS</i></li>
                                    <?php
                                }
                            }
                        }
                    }
                    ?>
        </div>
    </body>
</html> 

