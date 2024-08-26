<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
require_once dirname(__FILE__) . '/includes/parsecsv/parsecsv.lib.php';

ini_set('memory_limit', '-1');

if (session_id() == null) {
    session_start();
}
if (!isset($_SESSION["usuario"])) {
    echo "Debe autenticarse para continuar";
    return;
}

ini_set("display_errors", 1);
ini_set("error_reporting", E_ALL);

$p = Array();
$p["table"] = master::clean($_GET["table"]);
$dt = master::getColumns($p);
$dt = $dt["cols"];
$cols = "";
$vals = "";

$ne = Array();

if (isset($_POST["nw_input_no_export"])) {
    $ne = explode(",", $_POST["nw_input_no_export"]);
}

$arr_size = count($ne);

for ($i = 0; $i < $arr_size; $i++) {
    array_push($ne, "nombre_" . $ne[$i]);
}

for ($i = 0; $i < count($dt); $i++) {
    if (!isset($dt[$i]["data_type"])) {
        array_splice($dt, $i, 1);
        continue;
    }
}

$serial = isset($_POST["serial"]) ? true : false;
$selectColumns = "";

for ($i = 0; $i < count($dt); $i++) {
    $colArr = $dt[$i];
    if ($serial && $colArr["column_name"] == "id") {
        continue;
    }
    if (!in_array($colArr["column_name"], $ne)) {
        $cols .= $colArr["column_name"];
        $vals .= ":" . $colArr["column_name"];
        $selectColumns .= "<option value='" . $colArr["column_name"] . "'>" . $colArr["column_name"] . "</option>";
        if ($i + 1 < count($dt)) {
            $cols .= ",";
            $vals .= ",";
        }
    }
}

$cols = rtrim($cols, ',');

function nw_error($msg, $ca = false, $campo = false) {
    $rta = $msg;
    if ($campo != false) {
        $rta .= ". <br /><b>Descripción campo:</b> " . $campo;
    }
    if ($ca != false) {
        $rta .= "<br /><b>Mensaje de error: </b>" . $ca->lastErrorText() . "<br /><b>Prepared SQL: </b>" . $ca->preparedQuery();
    }
    echo "<br />";
    echo "<br />";
    echo "<center>";
    echo $rta;
    echo "<br />";
    echo "<br />";
    echo "<button onclick='window.history.back();' ><img width='35px' src='/nwlib6/icons/volver.png'>Volver</img></button>";
    echo "</center>";
}

$arrTimes = array("application/octet-stream", "text/plain", "text/csv", "application/vnd.ms-excel");

if (isset($_FILES['archivo']['tmp_name'])) {

    if (in_array($_FILES['archivo']['type'], $arrTimes) != true) {
        nw_error("El tipo de archivo debe ser de extension <b>txt, csv o plano</b>. ");
        return;
    }

    $prefix = $_SERVER["DOCUMENT_ROOT"] . "/tmp/";

    $db = NWDatabase::database();
    $db->transaction();
    $ca = new NWDbQuery($db);

    $subio = false;
    if (is_uploaded_file($_FILES['archivo']['tmp_name'])) {
        copy($_FILES['archivo']['tmp_name'], $prefix . $_FILES['archivo']['name']);
        $subio = true;
    }

    if (!$subio) {
        nw_error("El archivo no fue subido al servidor");
        return;
    }

    $csv = new parseCSV();
    $fila = 1;
    switch ($_POST["delimiter"]) {
        case "TAB":
            $csv->delimiter = "\t";
            break;
        case "COMA":
            $csv->delimiter = ",";
            break;
        case "PUNTO_Y_COMA":
            $csv->delimiter = ";";
            break;

        default:
            $csv->delimiter = "\t";
            break;
    }

    $csv->heading = false;
    //$csv->encoding('UTF-8');

    $ic = 0;

    $registros_actualizados = 0;
    $registros_insertados = 0;

    if ($csv->parse($prefix . $_FILES['archivo']['name'], 0)) {

        foreach ($csv->data as $key => $row) {

            $ca->clear();

            $ic = 0;

            $d = array();

            $fields = Array();

            if (isset($_POST["omitir"]) && $_POST["omitir"] == "omitir") {
                if ($fila == 1) {
                    $fila++;
                    continue;
                }
            }
            foreach ($row as $value) {
                $d[$ic] = $value;
                $fields[] = $value;
                $ic++;
            }
            if (isset($_POST["column_update"]) && $_POST["column_update"] != "") {
                $ca->prepareSelect($p["table"], "*", $_POST["column_update"] . "::text=:token");
                $valSearch = "";
                $count = 0;
                for ($ia = 0; $ia < count($dt); $ia++) {
                    $arr = $dt[$ia];
                    if ($serial && $arr["column_name"] == "id") {
                        continue;
                    }
                    switch ($colArr["column_name"]) {
                        case "empresa":
                            $valCol = $_SESSION["empresa"];
                            break;
                        case "fecha":
                            $valCol = date("Y-m-d");
                            $obg = true;
                            break;
                        case "usuario":
                            $valCol = $_SESSION["usuario"];
                            $obg = true;
                            break;
                        default:
                            if ($arr["column_name"] == $_POST["column_update"]) {
                                $ca->bindValue(":token", $d[$count], true);
                                $valSearch = $d[$count];
                                $count++;
                                break;
                            }
                            break;
                    }
                }
                if (!$ca->exec()) {
                    echo $ca->lastErrorText();
                    return;
                }
                if ($ca->size() == 0) {
                    $ca->prepareInsert($p["table"], $cols);
                    $registros_insertados++;
                } else {
                    $ca->prepareUpdate($p["table"], $cols, $_POST["column_update"] . "=:token");
                    $ca->bindValue(":token", $valSearch);
                    $registros_actualizados++;
                }
            } else {
                $ca->prepareInsert($p["table"], $cols);
                $registros_insertados++;
            }
            $ca->cleanNonAscii(true);
            $ca->clean_html(true);
            $countDispCols = 0;
            $column = "";
            for ($ia = 0; $ia < count($dt); $ia++) {
                $obg = false;
                $colArr = $dt[$ia];

                $column = $colArr["column_name"];

                $valCol = "";
                if ($serial && $colArr["column_name"] == "id") {
                    continue;
                }
                switch ($colArr["column_name"]) {
                    case "empresa":
                        $valCol = $_SESSION["empresa"];
                        break;
                    case "fecha":
                        $valCol = date("Y-m-d");
                        $obg = true;
                        break;
                    case "usuario":
                        $valCol = $_SESSION["usuario"];
                        $obg = true;
                        break;
                    default:
                        if ($colArr["data_type"] == "varchar" || $colArr["data_type"] == "character varying" || $colArr["data_type"] == "text" || $colArr["data_type"] == "date") {
                            $obg = true;
                            if ($colArr["data_type"] != "date") {
                                if ($colArr["character_maximum_length"] != "") {
                                    $valCol = substr($d[$countDispCols], 0, (int) $colArr["character_maximum_length"]);
                                } else {
                                    $valCol = $d[$countDispCols];
                                }
                            } else {
                                $valCol = $d[$countDispCols];
                            }
                        } else {
                            if ($colArr["data_type"] == "double precision" || $colArr["data_type"] == "integer") {
                                $fixedVal = $d[$countDispCols];
                                if ($d[$countDispCols] == "" && $colArr["is_nullable"] == "YES") {
                                    $fixedVal = 'null';
                                    $obg = false;
                                } else if ($d[$countDispCols] == "" && $colArr["is_nullable"] == "NO") {
                                    nw_error("1. No se pudieron importar los registros en la línea " . (string) $fila . ". El campo : " . $column . " no puede estar vacío. ");
                                    return;
                                } else {
                                    $fixedVal = $d[$countDispCols];
                                }
                                $valCol = $fixedVal;
                            } else {
                                $valCol = $d[$countDispCols];
                            }
                        }
                        if (!in_array($colArr["column_name"], $ne)) {
                            $countDispCols++;
                        }
                        break;
                }

                if (!in_array($colArr["column_name"], $ne)) {
                    if (($valCol == "null" || $valCol == "NULL") && $colArr["is_nullable"] == "YES" && $colArr["data_type"] == "date") {
                        $obg = false;
                    }
                    if ($colArr["data_type"] == "character varying" || $colArr["data_type"] == "varchar" || $colArr["data_type"] == "VARCHAR" || $colArr["data_type"] == "CHAR") {
                        $valCol = mb_convert_encoding($valCol, "ISO-8859-1", "auto");
                        $obg = true;
                    }
                    if ($colArr["data_type"] == "date") {
                        if ($valCol == "") {
                            $ca->bindValue(":" . $column, "null", false);
                        } else if ($valCol == "0000-00-00 00:00:00") {
                            $ca->bindValue(":" . $column, "null", false);
                        } else if ($valCol == "0000-00-00") {
                            $ca->bindValue(":" . $column, "null", false);
                        } else {
                            $ca->bindValue(":" . $column, $valCol, $obg);
                        }
                    } else {
                        $ca->bindValue(":" . $column, $valCol, $obg);
                    }
                }
            }
            if (!$ca->exec()) {
                $db->rollback();
                $fila = $fila + 1;
                nw_error("No se pudieron importar los registros en la línea " . (string) ($fila - 1) . ". Los campos asociados encontrados (" . count($fields) . "): " . implode(",", $fields), $ca, 1 . ". <br /><b>Columna: </b>" . $column);
                return;
            }
            $fila++;
        }
    }

    $db->commit();

    if (!unlink($prefix . $_FILES['archivo']['name'])) {
        nw_error('no se pudo borrar el archivo: ' . $_FILES['archivo']['name']);
    }
    $fila--;

    if ($fila > 0) {
        $fila--;
    }

    echo "<center>";
    echo "<br /><b>Archivo importado satisfactoriamente. En total se insertaron " . $registros_insertados . " registros. Se actualizaron {$registros_actualizados} registros. </b>";
    echo "<br />";
    echo "<br />";
    echo "<b>El archivo importado fue " . $_FILES['archivo']['name'] . "</b>";
    echo "<br />";
    echo "<hr>";
    echo "</center>";
}
?>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<link rel="stylesheet" href="/nwlib6/css/import.css">
<div id="content">
    <form action="<?php echo $_SERVER["PHP_SELF"] . "?table=" . $_GET["table"]; ?>" method="post" enctype="multipart/form-data" name="form1">
        <input type="text" style="display: none;" id="nw_input_no_export" name="nw_input_no_export" value="" />
        <div id="import_text">
            <div class="tittle">
                <h4>Importaci&oacute;n masiva de datos desde archivo CSV/TXT. </h4>
                <p>Recuerde crear el archivo en Excel y guardarlo como archivo separado por <b>tabulaciones</b> o <b>comas(,)</b> (.CSV/.TXT)</p></div>
            <div class="table_tittle"><p>Estructura tabla <?php echo $_GET["table"]; ?></p></div> 
            <div class="table_tittle" style="font-size: 12px">
                <p>Actualizar registros por la columna: 
                    <select id="column_update" name="column_update" >
                        <option value="" selected="true">Seleccione...</option>
                        <?php
                        echo $selectColumns;
                        ?>
                    </select>    
                </p>
            </div> 
        </div>
        <script type="text/javascript">
            function checkExists(val, search) {
                var t = search.split(",");
                for (var i = 0; i < t.length; i++) {
                    if (t[i] == val) {
                        return true;
                    }
                }
                return false;
            }
            function changeSelected(widget) {

                var ne = document.getElementById("nw_input_no_export");
                var val = widget.value.replace("upload_", "");
                var oldValue = ne.value;

                if (widget.checked) {
                    if (checkExists(val, oldValue)) {
                        val = oldValue.replace(val, "");
                        ne.value = val;
                    }
                } else {
                    if (!checkExists(val, oldValue)) {
                        var splited = oldValue.split(",");
                        if (splited[0] == "") {
                            splited.splice(0, 1);
                        }
                        splited.push(val);
                        val = splited.join(",");
                        ne.value = val;
                    }
                }
            }
            function showFields(widget) {
                var table = document.getElementById("nw_table_fields");
                if (widget.checked) {
                    table.style.display = 'initial';
                } else {
                    table.style.display = 'none';
                }
            }
            function changeCheck() {
                var check = document.getElementById("show_fields");
                if (check.checked) {
                    check.check = false;
                } else {
                    check.check = false;
                }
                showFields(check);
            }
        </script>
        <?php
        echo "<div style='font-size: 22px;' onclick='javascript: changeCheck();'>Mostrar campos<input onclick='javascript: showFields(this)' type='checkbox' id='show_fields' name='show_fields' checked></input></div>";
        echo "<div id='nw_table_fields' >";
        echo "<table cellpadding='10' border='2'>";
        echo "<tr>";
        echo "<th>Nombre</th>";
        echo "<th>Tipo</th>";
        echo "<th>¿Puede estar vacío?</th>";
        echo "<th>Max caracteres</th>";
        echo "<th>Importar campo</th>";
        echo "</tr>";
        $countAll = count($dt);
        for ($i = 0; $i < $countAll; $i++) {
            $colArr = $dt[$i];
            if ($colArr["column_name"] == "id" || $colArr["column_name"] == "usuario" || $colArr["column_name"] == "empresa" || $colArr["column_name"] == "fecha") {
                continue;
            }
            echo "<tr>";
            $cou = 1;
            foreach ($colArr as $key) {
                if ($cou == count($colArr)) {
                    continue;
                }
                echo "<td>";
                if ($key == "YES") {
                    $key = "SÍ";
                }
                echo $key;
                echo "</td>";
                $cou++;
            }
            echo "<td>";
            echo "<input onclick='javascript: changeSelected(this)' checked type='checkbox' name='nwupload_" . $colArr["column_name"] . "' value='upload_" . $colArr["column_name"] . "'></input>";
            echo "</td>";
            echo "</tr>";
        }
        echo "</table>";
        echo "</div>";
        ?>
        <div class="action_text"><h1>Seleccione el archivo:</h1></div>
        <div class="select_field">
            <input type="file" id="archivo" name="archivo" />
        </div>
        <div class="guidelines">
            <p>Delimitador
                <select id="delimiter" name="delimiter" >
                    <option value="TAB" selected="true">Tabulaciones</option>
                    <option value="COMA">Comas (,)</option>
                    <option value="PUNTO_Y_COMA">Punto y coma (;)</option>
                </select>
            </p>
            <p>Omitir la primera línea
                <input type="checkbox" id="omitir" name="omitir" value="omitir" checked="true" />
            </p>
            <p>Serial en campo id
                <input type="checkbox" id="serial" name="serial" value="serial" checked="true" />
            </p>
        </div>
        <div class="button">
            <!onclick="javascript: this.disable = false">
            <input type="submit" id="importar" name="importar" onclick="javascript: this.disable = false" value="Importar" style="font-size: 16px" />
        </div>
    </form>
</div>