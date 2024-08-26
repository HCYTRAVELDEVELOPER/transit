<?php

/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */

class nw_import_data {

    public static function saveNewFields($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_import_data", "orden,char_len,clean_spaces,title,data_type,useful,remove_zero_left,enc");
        $ca->bindValue(":orden", $p["orden"]);
        $ca->bindValue(":char_len", $p["char_len"] == "" ? 0 : $p["char_len"]);
        $ca->bindValue(":clean_spaces", $p["clean_spaces"]);
        $ca->bindValue(":title", $p["title"]);
        $ca->bindValue(":data_type", $p["data_type"]);
        $ca->bindValue(":useful", $p["useful"] == "" ? "true" : $p["useful"]);
        $ca->bindValue(":remove_zero_left", $p["remove_zero_left"] == "" ? "false" : $p["remove_zero_left"]);
        $ca->bindValue(":enc", $p["enc"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getColumnsToImport($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_import_data", "*", "enc=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getMain($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_import_enc", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function findFileColumnsByParameters($p) {
        require_once dirname(__FILE__) . '/../includes/parsecsv/parsecsv.lib.php';

        $filePath = $_SERVER["DOCUMENT_ROOT"] . $p['file'];

//        $fileData = file_get_contents($filePath);
//        error_log(mb_detect_encoding($fileData));
//        return mb_detect_encoding($fileData);

        $csv = new parseCSV();
        $csv->heading = false;
        $csv->delimiter = "||";

        $rta = Array();
        $cols = Array();

        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);

        $ca->prepareSelect("nw_import_enc", "*", "ref=:ref");
        $ca->bindValue(":ref", $p["ref"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() < 1) {
            NWJSonRpcServer::error("No se encontraron registros de encabezado");
        }
        $ca->next();
        $enc = $ca->assoc();
        $ca->clear();
        if (isset($p["encoding"])) {
            $csv->encoding($p["encoding"], 'UTF-8');
        }
        if ($enc["tipo"] == "TAB") {
            $csv->delimiter = "\t";
        } else {
//            $csv->encoding('UTF-8');
        }
        $ca->prepareSelect("nw_import_data", "*", " enc=:id order by orden");
        $ca->bindValue(":id", $enc["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $cols = $ca->assocAll();
        $rows = Array();
        $colsReal = Array();
        if ($csv->parse($filePath, 0)) {
            $rows_pos = 0;
            foreach ($csv->data as $row) {
                if ($p["omitir"] == true && $rows_pos == 0) {
                    $rows_pos++;
                    continue;
                }
                $col = 0;
                $str = $row[$col];
                if ($str == "") {
                    continue;
                }
                if ($enc["tipo"] == "TAB") {
                    $v = Array();
                    for ($i = 0; $i < count($cols); $i++) {
                        $c = $cols[$i];
                        $row[$col] = $row[$col];
                        if (isset($row[$col])) {
                            $row[$col] = utf8_encode($row[$col]);
                        }
                        $colsReal[$col] = $c["title"];
                        if (isset($row[$c["orden"] - 1])) {
                            $v[$c["title"]] = $row[$c["orden"] - 1];
                        }
                        $col++;
                    }
                    array_push($rows, $v);
                } else {
                    $str = utf8_decode($str);
                    $str = str_replace('?', '', $str);
                    $v = Array();
                    $char_len = 0;
                    for ($i = 0; $i < count($cols); $i++) {
                        $c = $cols[$i];
                        $r = "";
                        if ($c["clean_spaces"] == "t") {
                            $r = trim(substr($str, $char_len, $c["char_len"]));
                            if (!mb_detect_encoding($r, 'UTF-8', true)) {
                                $r = mb_convert_encoding(utf8_encode($r), "UTF-8", "auto");
                            }
                        } else {
                            $r = substr($str, $char_len, $c["char_len"]);
                            if (!mb_detect_encoding($r, 'UTF-8', true)) {
                                $r = mb_convert_encoding(utf8_encode($r), "UTF-8", "auto");
                            }
                        }
                        if ($c["remove_zero_left"] == "t") {
                            $r = ltrim($r, '0');
                        }
                        $colsReal[$col] = $c["title"];
                        $v[$c["title"]] = $r;
                        $char_len = $char_len + $c["char_len"];
                        $col++;
                    }
                    array_push($rows, $v);
                }
                $rows_pos++;
            }
        }
        $rta["columns"] = $colsReal;
        $rta["rows"] = $rows;
        return $rta;
    }

    public static function findFileColumns($p) {
        require_once dirname(__FILE__) . '/../includes/parsecsv/parsecsv.lib.php';

        $filePath = $_SERVER["DOCUMENT_ROOT"] . $p['file'];

        $csv = new parseCSV();
        switch ($p["delimiter"]["delimiter"]) {
            case "EXCEL":
                $array = explode('.', $filePath);
                $extension = end($array);
                if ($extension == "xls" || $extension == "XLS") {
                    $csv->delimiter = ",";
                    exportExcel::excelToArray($p);
                } else {
                    NWJSonRpcServer::information("Está intentando subir un archivo diferente al tipo Excel 97-2013 (.xls)");
                    return;
                }
                break;
            case "EXCEL_365":
                $array = explode('.', $filePath);
                $extension = end($array);
                if ($extension == "xlsx" || $extension == "XLSX") {
                    $csv->delimiter = ",";
                    $p["excel_tipo"] = "Excel2007";
                    exportExcel::excelToArray($p);
                } else {
                    NWJSonRpcServer::information("Está intentando subir un archivo diferente al tipo Excel 2007-365 (.xlsx)");
                    return;
                }
                break;
            case "TAB":
                $csv->delimiter = "\t";
                break;
            case "COMA":
                $csv->delimiter = ",";
                break;
            case "PUNTO_Y_COMA":
                $csv->delimiter = ";";
                break;
            case "ESPACIOS":
                $csv->delimiter = " ";
                break;

            default:
                $csv->delimiter = "\t";
                break;
        }
        $csv->heading = false;

        $rta = Array();
        $cols = Array();
        $rows = Array();

        if ($csv->parse($filePath, 0)) {
            $rows_pos = 0;
            foreach ($csv->data as $key => $row) {
                if ($rows_pos == 0) {
                    $col = 0;
                    foreach ($row as $value) {
                        array_push($cols, $row[$col]);
                        $col++;
                    }
                    $rows_pos++;
                    continue;
                }
                $col = 0;
                $v = Array();
                foreach ($row as $value) {
                    if (!mb_detect_encoding($row[$col], 'UTF-8', true)) {
                        $row[$col] = mb_convert_encoding(utf8_encode($row[$col]), "UTF-8", "auto");
                    }
                    if (!isset($cols[$col])) {
                        continue;
                    }
                    $v[$cols[$col]] = $row[$col] == null ? "" : $row[$col];
                    $col++;
                }
                array_push($rows, $v);
                $rows_pos++;
            }
        }
        $rta["cols"] = $cols;
        $rta["rows"] = $rows;
        return $rta;
    }

    public static function importData($p) {

        require_once dirname(__FILE__) . '/../includes/parsecsv/parsecsv.lib.php';
        ini_set('memory_limit', '-1');

        $p["table"] = master::clean($p["table"]);
        $dt = master::getColumns($p);
        $dt = $dt["cols"];
        $cols = "";
        $vals = "";

        $ne = Array();

        if (isset($p["nw_input_no_export"])) {
            $ne = explode(",", $p["nw_input_no_export"]);
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

        $serial = $p["serial"];
        $defect_data = $p["defect_data"];
        $ignored_lines = explode(",", $p["ignoredLines"]);
        $noImportRows = explode(",", $p["noImportRows"]);

        $selectColumns = "";

        for ($i = 0; $i < count($dt); $i++) {
            $colArr = $dt[$i];
            if ($serial == "true") {
                if ($colArr["column_name"] == "id") {
                    continue;
                }
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

        $arrTimes = array("application/octet-stream", "text/plain", "text/csv", "application/vnd.ms-excel");

        if (isset($p['file'])) {

            if (!file_exists($_SERVER["DOCUMENT_ROOT"] . $p['file'])) {
                NWJSonRpcServer::information("El archivo no existe. Por favor súbalo de nuevo");
                return;
            }

            $prefix = $_SERVER["DOCUMENT_ROOT"];

            $db = NWDatabase::database();
            $db->transaction();
            $ca = new NWDbQuery($db);

            $subio = true;

            if (!$subio) {
                NWJSonRpcClient::information("El archivo no fue subido al servidor");
                return;
            }

            $csv = new parseCSV();
            $fila = 1;
            switch ($p["delimiter"]) {
                case "EXCEL":
                    $csv->delimiter = ",";
                    break;
                case "TAB":
                    $csv->delimiter = "\t";
                    break;
                case "COMA":
                    $csv->delimiter = ",";
                    break;
                case "PUNTO_Y_COMA":
                    $csv->delimiter = ";";
                    break;
                case "ESPACIOS":
                    $csv->delimiter = "\b";
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
            $inserted_lines = 0;

            if ($csv->parse($_SERVER["DOCUMENT_ROOT"] . $p['file'], 0)) {

                foreach ($csv->data as $key => $row) {

                    $ca->clear();

                    $ic = 0;

                    $d = array();

                    $fields = Array();

                    if (isset($p["omitir"]) && $p["omitir"] == true) {
                        if ($fila == 1) {
                            $fila++;
                            continue;
                        }
                    }

                    if (in_array($fila, $ignored_lines)) {
                        $fila++;
                        continue;
                    }

                    if (in_array($fila, $noImportRows)) {
                        $fila++;
                        continue;
                    }

                    foreach ($row as $value) {
                        $d[$ic] = $value;
                        $fields[] = $value;
                        $ic++;
                    }
                    if (isset($p["column_update"]) && $p["column_update"] != "") {
                        $ca->prepareSelect($p["table"], "*", $p["column_update"] . "::text=:token");
                        $valSearch = "";
                        $count = 0;
                        for ($ia = 0; $ia < count($dt); $ia++) {
                            $arr = $dt[$ia];
                            if (($serial == "true") && $arr["column_name"] == "id") {
                                continue;
                            }
                            switch ($arr["column_name"]) {
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
                                    if ($arr["column_name"] == $p["column_update"]) {
                                        $ca->bindValue(":token", $d[$count], true);
                                        $valSearch = $d[$count];
                                        break;
                                    }
                                    $count++;
                                    continue 2;
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
                            $ca->prepareUpdate($p["table"], $cols, $p["column_update"] . "::text=:token::text");
                            $ca->bindValue(":token", $valSearch, true);
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
                        if (($serial == "true") && $colArr["column_name"] == "id") {
                            continue;
                        }
                        if ($defect_data == "true") {
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
                                    if (!isset($d[$countDispCols])) {
                                        continue 2;
                                    }
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
                                                $rta = Array();
                                                $rta["line"] = $fila;
                                                $rta["fields_size"] = count($fields);
                                                $rta["fields"] = implode(",", $fields);
                                                $rta["error"] = "No se pudieron importar los registros en la línea " . (string) $fila . ". El campo : " . $column . " no puede estar vacío. ";
                                                $rta["column"] = $column;
                                                $rta["isError"] = true;
                                                return $rta;
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
                        } else {
                            if (!isset($d[$countDispCols])) {
                                continue;
                            }
                            if ($colArr["data_type"] == "varchar" || $colArr["data_type"] == "char" || $colArr["data_type"] == "character varying" || $colArr["data_type"] == "text" || $colArr["data_type"] == "date") {
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
                                if ($colArr["data_type"] == "double precision" || $colArr["data_type"] == "integer" || $colArr["data_type"] == "int") {
                                    $fixedVal = $d[$countDispCols];
                                    if ($d[$countDispCols] == "" && $colArr["is_nullable"] == "YES") {
                                        $fixedVal = 'null';
                                        $obg = false;
                                    } else if ($d[$countDispCols] == "" && $colArr["is_nullable"] == "NO") {
                                        $rta = Array();
                                        $rta["line"] = $fila;
                                        $rta["fields_size"] = count($fields);
                                        $rta["fields"] = implode(",", $fields);
                                        $rta["error"] = "No se pudieron importar los registros en la línea " . (string) $fila . ". El campo : " . $column . " no puede estar vacío. ";
                                        $rta["column"] = $column;
                                        $rta["isError"] = true;
                                        return $rta;
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
                        }

                        if (!in_array($colArr["column_name"], $ne)) {
                            if (($valCol == "null" || $valCol == "NULL") && $colArr["is_nullable"] == "YES" && $colArr["data_type"] == "date") {
                                $obg = false;
                            }
//                            if ($colArr["data_type"] == "character varying" || $colArr["data_type"] == "varchar" || $colArr["data_type"] == "VARCHAR" || $colArr["data_type"] == "CHAR") {
//                                $valCol = mb_convert_encoding($valCol, "ISO-8859-1", "auto");
//                                $obg = true;
//                            }
//                            if (!mb_detect_encoding($valCol, 'UTF-8', true)) {
                            if ($colArr["data_type"] == "character varying" || $colArr["data_type"] == "varchar" || $colArr["data_type"] == "VARCHAR" || $colArr["data_type"] == "CHAR" || $colArr["data_type"] == "char") {
                                $valCol = mb_convert_encoding(utf8_encode($valCol), "UTF-8", "auto");
//                                $valCol = mb_convert_encoding(utf8_encode($valCol), "ISO-8859-1", "auto");
                                $obg = true;
                            }
                            if ($colArr["data_type"] == "date") {
                                if ($valCol == "0") {
                                    $ca->bindValue(":" . $column, "null", false);
                                } else if ($valCol == "") {
                                    $ca->bindValue(":" . $column, "null", false);
                                } else if ($valCol == "0000-00-00 00:00:00") {
                                    $ca->bindValue(":" . $column, "null", false);
                                } else if ($valCol == "0000-00-00") {
                                    $ca->bindValue(":" . $column, "null", false);
                                } else {
                                    $ca->bindValue(":" . $column, $valCol, $obg);
                                }
                            } else {
                                if ($colArr["data_type"] == "boolean" && $valCol == 0) {
                                    $ca->bindValue(":" . $column, "false");
                                } else if ($colArr["data_type"] == "boolean" && $valCol == "") {
                                    $ca->bindValue(":" . $column, "false");
                                } else {
                                    $ca->bindValue(":" . $column, $valCol, $obg);
                                }
                            }
                        }
                    }
                    if (!$ca->exec()) {
//                        NWJSonRpcServer::information($colArr["data_type"] . "___" . $ca->lastErrorText());
                        $db->rollback();
                        $rta = Array();
                        $rta["inserted_lines"] = $inserted_lines;
                        $rta["filaReal"] = $fila;
                        $rta["line"] = $fila - 1;
                        $rta["total"] = $fila - 2;
                        $rta["fields_size"] = count($fields);
                        $rta["fields"] = implode(",", $fields);
                        $rta["error"] = $ca->lastErrorText();
                        $rta["column"] = $column;
                        $rta["isError"] = true;
                        $fila = $fila + 1;
                        return $rta;
                    } else {
                        $inserted_lines++;
                    }
                    $fila++;
                }
            }

            $db->commit();

            if (!@unlink($_SERVER["DOCUMENT_ROOT"] . $p['file'])) {
                NWJSonRpcServer::information('no se pudo borrar el archivo: ' . $p['file']);
            }
            $fila--;

            if ($fila > 0) {
                $fila--;
            }

            $rta = Array();
            $rta["inserted_lines"] = $inserted_lines;
            $rta["fields_size"] = count($fields);
            $rta["updated_registers"] = $registros_actualizados;
            $rta["isError"] = false;
            $rta["file"] = $p["file"];
            return $rta;

            $rta = "<center>";
            $rta .= "<br /><b>Archivo importado satisfactoriamente. En el lote final se insertaron " . $registros_insertados . " registros. Se actualizaron {$registros_actualizados} registros. </b>";
            $rta .= "<br />";
            $rta .= "<br />";
            $rta .= "<b>El archivo importado fue " . $p['file'] . "</b>";
            $rta .= "<br />";
            $rta .= "<hr>";
            $rta .= "</center>";
            return $rta;
        }
    }

}

?>