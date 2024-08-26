<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class exportExcel {

    static $columnsToExport;
    static $counter;

    public static function excelToArray($p) {
        $excel_readers = array(
            'Excel5',
            'Excel2003XML',
            'Excel2007'
        );
        require_once dirname(__FILE__) . '/includes/PHPExcel/PHPExcel.php';

        if (!isset($p["excel_tipo"])) {
            $reader = PHPExcel_IOFactory::createReader('Excel5');
        } else {
            $reader = PHPExcel_IOFactory::createReader($p["excel_tipo"]);
        }
        $reader->setReadDataOnly(true);

        $path = $_SERVER["DOCUMENT_ROOT"] . $p["file"];
        $excel = $reader->load($path);

        $writer = PHPExcel_IOFactory::createWriter($excel, 'CSV');
        $rta = $path;
        $writer->save($rta);
        return true;
    }

    public static function is_normal_file($ext) {
        if ($ext == "mp4") {
            return false;
        } else if ($ext == "MP4") {
            return false;
        }
        return true;
    }

    public static function exportSimple($p) {
        //session::check();
        $si = session::info();

        //alexf 03 nov 2021, data nwmaker compatibilidad
        $p = nwMaker::getData($p);
        if (!isset($p["noExportColumns"])) {
            $p["noExportColumns"] = Array();
        }

        if (!isset($si["usuario"])) {
            $si["usuario"] = "guest";
        }
        if (!isset($si["empresa"])) {
            $si["empresa"] = "1";
        }

        $arr = $p["records"];
        $part = $si["usuario"];
        $filename = "/tmp/" . (string) str_replace(":", "_", $si["usuario"]) . "_" . (string) $si["empresa"] . "_" . date("Y-m-d") . "_" . date("H_i_s") . ".csv";
        $f = fopen($_SERVER["DOCUMENT_ROOT"] . $filename, 'w');

        fprintf($f, chr(0xEF) . chr(0xBB) . chr(0xBF));

        function delete_col(&$array, $offset) {
            return array_walk($array, function (&$v) use ($offset) {
                array_splice($v, $offset, 1);
            });
        }

        $counter = 0;
        foreach ($p["records"] as $campos) {
            if ($counter == 0) {
                $insert = Array();
                for ($iz = 0; $iz < count($campos); $iz++) {
                    foreach ($campos[$iz] as $key => $value) {
                        if (in_array($key, $p["cols"])) {
                            if (!in_array($key, $p["noExportColumns"])) {
                                $insert[strip_tags(NWUtils::cleanCols($p["labels"][$key]))] = utf8_decode($campos[$iz][$key]);
                            }
                        }
                    }
                    if (count($insert) > 0) {
                        fputcsv($f, array_keys($insert), $p["separado_por"]);
                        $counter++;
                        break;
                    } else {
                        break;
                    }
                }
            }
            $insert = Array();
            for ($iz = 0; $iz < count($campos); $iz++) {
                foreach ($campos[$iz] as $key => $value) {
                    if (in_array($key, $p["cols"])) {
                        if (!in_array($key, $p["noExportColumns"])) {
                            $insert[$key] = preg_replace('/[\x00-\x1F\x7F-\xA0\xAD]/u', '', strip_tags($campos[$iz][$key]));
                        }
                    }
                }
                if (count($insert) > 0) {
                    fputcsv($f, $insert, $p["separado_por"]);
                    $counter++;
                } else {
                    continue;
                }
                $counter++;
            }
        }

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $ca->prepareSelect("nw_downloads", "max(id) as id");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $id = 1;
        $r = $ca->flush();
        if ($r != false) {
            $id = $r["id"] + 1;
        }
        $clave = master::get_random_string("abcdefghijkLMNWefr", 20);
        $ca->prepareInsert("nw_downloads", "id,file_name,path,clave,parte,fecha_creacion,usuario");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":file_name", basename($filename));
        $ca->bindValue(":path", $filename);
        $ca->bindValue(":clave", $clave);
        $ca->bindValue(":parte", "LIGHT_EXPORT");
        $ca->bindValue(":fecha_creacion", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $data = Array();
        $data["id"] = $id;
        $data["key"] = $clave;
        return $data;
    }

    public static function exportXLSLight($p, $sd = false, $noExport = Array(), $export = Array(), $rowHeight = false, $sorted = '', $special = true) {

        global $objPHPExcel;
        if (function_exists('set_time_limit')) {
            set_time_limit(0);
        }
        //ignore_user_abort(True);
        ini_set("memory_limit", "90000M");
        date_default_timezone_set(@date_default_timezone_get());
        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

        //require_once dirname(__FILE__) . '/includes/PHPExcel/PHPExcel.php';

        require_once dirname(__FILE__) . '/includes/ExcelWriterXML/ExcelWriterXML.php';

        if (!file_exists($_SERVER["DOCUMENT_ROOT"] . "/tmp/")) {
            NWJSonRpcServer::error("La carpeta '/tmp' no está creada o no tiene los permisos suficientes. Comuníquese con el administrador. ");
        }
        // ANDRESF SE QUITAN COMO MEDIDA DE SEGURIDAD
        //error_reporting(E_ALL);
        //ini_set('display_errors', TRUE);
        //ini_set('display_startup_errors', TRUE);
        //error_reporting(1);
        //session::check();
        $si = session::info();

        if (!isset($si["usuario"])) {
            $si["usuario"] = "guest";
        }
        if (!isset($si["empresa"])) {
            $si["empresa"] = "1";
        }

        $part = "";
        if ($sd != false) {
            $part = (String) $sd;
            $part = array_map('trim', explode(".", $part));
            if (count($part) > 1) {
                $part = $part[count($part) - 1];
            } else {
                $part = $part[0];
            }
            $part = str_replace("l_", "", $part);
            $part = ucfirst($part);
        }
        if (!isset($part) || $part == "" || $part == null) {
            $part = $si["usuario"];
        }
        $filename = $_SERVER["DOCUMENT_ROOT"] . "/tmp/" . (string) str_replace(":", "_", $part) . "_" . (string) str_replace(":", "_", $si["usuario"]) . "_" . (string) $si["empresa"] . "_" . date("Y-m-d") . "_" . date("H_i_s") . ".xlsx";

        $objPHPExcel = new ExcelWriterXML();

        $startNumber = 2;

        $Cantidad_de_columnas_a_crear = 100;
        $Contador = 0;
        $Letra = 'A';
        $letters = Array();
        while ($Contador < $Cantidad_de_columnas_a_crear) {
            $letters[$Contador] = $Letra;
            $Contador++;
            $Letra++;
        }

        if (isset($export)) {
            self::$columnsToExport = $export;
        } else {
            self::$columnsToExport = Array();
            if (count($p) > 0) {
                foreach ($p[1] as $key => $value) {
                    self::$columnsToExport[] = $key;
                }
            }
        }
        if (self::$columnsToExport === false) {
            self::$columnsToExport = Array();
            if (count($p) > 0) {
                if (count($p) > 1) {
                    foreach ($p[1] as $key => $value) {
                        self::$columnsToExport[] = Array($key);
                    }
                }
            }
        }

        if (!isset($special)) {
            $special = true;
        }

        if (count($p) == 0) {
            $p = Array(Array());
        }

        if ($special === true) {
            if (isset($sorted) && $sorted != '') {
                if (count($sorted) > 0) {
                    if (isset($sorted["sorted"]) && $sorted["sorted"] != "") {
                        if (isset($sorted["sorted_name"]) && $sorted["sorted_name"] != "" && $sorted["sorted_name"] != -1) {
                            if ($sorted["sorted_method"] === true) {
                                $sortMethod = SORT_ASC;
                            } else {
                                $sortMethod = SORT_DESC;
                            }
                            master::array_sort_by_column($p, $sorted["sorted_name"], $sortMethod);
                        }
                    }
                }
            }
            foreach ($sorted["subfilters"] as $value) {
                if ($value == null) {
                    continue;
                }
                $hidingStore = Array();
                $colName = $value[0]["colName"];
                $dt = Array();
                for ($ib = 0; $ib < count($value); $ib++) {
                    $val = $value[$ib]["value"];
                    $dt[] = $val;
                }
                for ($i = 0; $i < count($p); $i++) {
                    $counter = 0;
                    $maxCounter = count(self::$columnsToExport);
                    for ($ia = 0; $ia < $maxCounter; $ia++) {
                        $name = self::$columnsToExport[$ia][0];
                        if ($name == $colName) {
                            if (in_array($p[$i][self::$columnsToExport[$ia][0]], $dt) === false) {
                                $hidingStore[] = $i;
                            }
                        }
                        $counter++;
                    }
                }

                $hidden = 0;
                $i = 0;
                for ($id = 0; $id < count($hidingStore); $id++) {
                    $row = $hidingStore[$id];
                    $count = 1;
                    while ($i + 1 < count($hidingStore) && isset($hidingStore[$id + 1]) && $hidingStore[$id] == $hidingStore[$id + 1] - 1) {
                        $count++;
                        $id++;
                    }
                    array_splice($p, $row - $hidden, $count);

                    $hidden += $count;
                }
            }
        }

        $activeSheet = $objPHPExcel->addSheet('Data');

        for ($i = 0; $i < count($p); $i++) {

            $columnCount = 0;

            $maxCounter = count(self::$columnsToExport);

            for ($ia = 0; $ia < $maxCounter; $ia++) {
                $val = "";
                $type = "";
                $name = "";
                $color = "";
                $colorCondition = "";
                $colorValue = "";

                if (isset($p[$i][self::$columnsToExport[$ia][0]])) {
                    $val = $p[$i][self::$columnsToExport[$ia][0]];
                }

                if (isset(self::$columnsToExport[$ia][1])) {
                    $name = self::$columnsToExport[$ia][1];
                } else {
                    $name = self::$columnsToExport[$ia][0];
                }
                if (isset(self::$columnsToExport[$ia][2])) {
                    if (self::$columnsToExport[$ia][2]) {
                        $type = self::$columnsToExport[$ia][2];
                    }
                }
                if (isset(self::$columnsToExport[$ia][3])) {
                    if (self::$columnsToExport[$ia][3]) {
                        $d = explode("::", self::$columnsToExport[$ia][3]);
                        $color = $d[0];
                        $d = explode(";;", $d[1]);
                        $colorCondition = $d[0];
                        $colorValue = $d[1];
                        $colorType = $d[2];
                    }
                }
                if ($i == 0) {
                    //$activeSheet->write(0, 1, str_replace("<b style='color:red'>*</b>", "", $name));
                }

                if ($type == "string") {
                    //$objPHPExcel->getActiveSheet()->setCellValueExplicit($letters[$columnCount] . $startNumber, $val, PHPExcel_Cell_DataType::TYPE_STRING);
                } else if ($type == "money") {
                    //$objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getNumberFormat()->setFormatCode("$#,##0.00");
                } else if ($type == "numeric") {
                    //$objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getNumberFormat()->setFormatCode("#,##0.00");
                } else if ($type == "textArea") {
                    //$objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getAlignment()->setWrapText(true);
                    //$objPHPExcel->getActiveSheet()->getRowDimension($i)->setRowHeight(-1);
                }
                $activeSheet->writeString($columnCount, 1, $val);

                $columnCount++;
            }
            $startNumber++;
        }

        try {
            $objPHPExcel->sendHeaders();
            $objPHPExcel->writeData($filename);
        } catch (Exception $exc) {
            NWJSonRpcServer::error($exc->getTraceAsString());
        }

        //$callEndTime = microtime(true);
        //$callTime = $callEndTime - $callStartTime;

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $ca->prepareSelect("nw_downloads", "max(id) as id");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $id = 1;
        $r = $ca->flush();
        if ($r != false) {
            $id = $r["id"] + 1;
        }
        $parte = isset($sd["part"]) ? $sd["part"] : "TODO";
        $clave = master::get_random_string("abcdefghijkLMNWefr", 20);
        $ca->prepareInsert("nw_downloads", "id,file_name,path,clave,parte,fecha_creacion,usuario");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":file_name", basename($filename));
        $ca->bindValue(":path", $filename);
        $ca->bindValue(":clave", $clave);
        $ca->bindValue(":parte", $parte == "" ? $_SESSION["usuario"] : $parte);
        $ca->bindValue(":fecha_creacion", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $data = Array();
        $data["id"] = $id;
        $data["key"] = $clave;
        return $data;
    }

    public static function cmp($a, $b) {
        $rta = 0;
        $maxCounter = count(self::$columnsToExport);
        if (self::$columnsToExport[self::$counter] == $a) {
            $rta = 0;
        } else {
            $rta = 1;
        }
        if (self::$counter + 1 == $maxCounter) {
            self::$counter = 0;
        } else {
            self::$counter++;
        }
        return $rta;
    }

    public static function cellColor($cells, $color) {
        global $objPHPExcel;
        $colors = array(
            'aliceblue' => 'F0F8FF',
            'antiquewhite' => 'FAEBD7',
            'aqua' => '00FFFF',
            'aquamarine' => '7FFFD4',
            'azure' => 'F0FFFF',
            'beige' => 'F5F5DC',
            'bisque' => 'FFE4C4',
            'black' => '000000',
            'blanchedalmond ' => 'FFEBCD',
            'blue' => '0000FF',
            'blueviolet' => '8A2BE2',
            'brown' => 'A52A2A',
            'burlywood' => 'DEB887',
            'cadetblue' => '5F9EA0',
            'chartreuse' => '7FFF00',
            'chocolate' => 'D2691E',
            'coral' => 'FF7F50',
            'cornflowerblue' => '6495ED',
            'cornsilk' => 'FFF8DC',
            'crimson' => 'DC143C',
            'cyan' => '00FFFF',
            'darkblue' => '00008B',
            'darkcyan' => '008B8B',
            'darkgoldenrod' => 'B8860B',
            'darkgray' => 'A9A9A9',
            'darkgreen' => '006400',
            'darkgrey' => 'A9A9A9',
            'darkkhaki' => 'BDB76B',
            'darkmagenta' => '8B008B',
            'darkolivegreen' => '556B2F',
            'darkorange' => 'FF8C00',
            'darkorchid' => '9932CC',
            'darkred' => '8B0000',
            'darksalmon' => 'E9967A',
            'darkseagreen' => '8FBC8F',
            'darkslateblue' => '483D8B',
            'darkslategray' => '2F4F4F',
            'darkslategrey' => '2F4F4F',
            'darkturquoise' => '00CED1',
            'darkviolet' => '9400D3',
            'deeppink' => 'FF1493',
            'deepskyblue' => '00BFFF',
            'dimgray' => '696969',
            'dimgrey' => '696969',
            'dodgerblue' => '1E90FF',
            'firebrick' => 'B22222',
            'floralwhite' => 'FFFAF0',
            'forestgreen' => '228B22',
            'fuchsia' => 'FF00FF',
            'gainsboro' => 'DCDCDC',
            'ghostwhite' => 'F8F8FF',
            'gold' => 'FFD700',
            'goldenrod' => 'DAA520',
            'gray' => '808080',
            'green' => '008000',
            'greenyellow' => 'ADFF2F',
            'grey' => '808080',
            'honeydew' => 'F0FFF0',
            'hotpink' => 'FF69B4',
            'indianred' => 'CD5C5C',
            'indigo' => '4B0082',
            'ivory' => 'FFFFF0',
            'khaki' => 'F0E68C',
            'lavender' => 'E6E6FA',
            'lavenderblush' => 'FFF0F5',
            'lawngreen' => '7CFC00',
            'lemonchiffon' => 'FFFACD',
            'lightblue' => 'ADD8E6',
            'lightcoral' => 'F08080',
            'lightcyan' => 'E0FFFF',
            'lightgoldenrodyellow' => 'FAFAD2',
            'lightgray' => 'D3D3D3',
            'lightgreen' => '90EE90',
            'lightgrey' => 'D3D3D3',
            'lightpink' => 'FFB6C1',
            'lightsalmon' => 'FFA07A',
            'lightseagreen' => '20B2AA',
            'lightskyblue' => '87CEFA',
            'lightslategray' => '778899',
            'lightslategrey' => '778899',
            'lightsteelblue' => 'B0C4DE',
            'lightyellow' => 'FFFFE0',
            'lime' => '00FF00',
            'limegreen' => '32CD32',
            'linen' => 'FAF0E6',
            'magenta' => 'FF00FF',
            'maroon' => '800000',
            'mediumaquamarine' => '66CDAA',
            'mediumblue' => '0000CD',
            'mediumorchid' => 'BA55D3',
            'mediumpurple' => '9370D0',
            'mediumseagreen' => '3CB371',
            'mediumslateblue' => '7B68EE',
            'mediumspringgreen' => '00FA9A',
            'mediumturquoise' => '48D1CC',
            'mediumvioletred' => 'C71585',
            'midnightblue' => '191970',
            'mintcream' => 'F5FFFA',
            'mistyrose' => 'FFE4E1',
            'moccasin' => 'FFE4B5',
            'navajowhite' => 'FFDEAD',
            'navy' => '000080',
            'oldlace' => 'FDF5E6',
            'olive' => '808000',
            'olivedrab' => '6B8E23',
            'orange' => 'FFA500',
            'orangered' => 'FF4500',
            'orchid' => 'DA70D6',
            'palegoldenrod' => 'EEE8AA',
            'palegreen' => '98FB98',
            'paleturquoise' => 'AFEEEE',
            'palevioletred' => 'DB7093',
            'papayawhip' => 'FFEFD5',
            'peachpuff' => 'FFDAB9',
            'peru' => 'CD853F',
            'pink' => 'FFC0CB',
            'plum' => 'DDA0DD',
            'powderblue' => 'B0E0E6',
            'purple' => '800080',
            'red' => 'FF0000',
            'rosybrown' => 'BC8F8F',
            'royalblue' => '4169E1',
            'saddlebrown' => '8B4513',
            'salmon' => 'FA8072',
            'sandybrown' => 'F4A460',
            'seagreen' => '2E8B57',
            'seashell' => 'FFF5EE',
            'sienna' => 'A0522D',
            'silver' => 'C0C0C0',
            'skyblue' => '87CEEB',
            'slateblue' => '6A5ACD',
            'slategray' => '708090',
            'slategrey' => '708090',
            'snow' => 'FFFAFA',
            'springgreen' => '00FF7F',
            'steelblue' => '4682B4',
            'tan' => 'D2B48C',
            'teal' => '008080',
            'thistle' => 'D8BFD8',
            'tomato' => 'FF6347',
            'turquoise' => '40E0D0',
            'violet' => 'EE82EE',
            'wheat' => 'F5DEB3',
            'white' => 'FFFFFF',
            'whitesmoke' => 'F5F5F5',
            'yellow' => 'FFFF00',
            'yellowgreen' => '9ACD32');

        $color_name = strtolower($color);
        if (isset($colors[$color_name])) {
            $color = $colors[$color_name];
        }
        $objPHPExcel->getActiveSheet()->getStyle($cells)->getFill()
                ->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,
                    'startcolor' => array('rgb' => str_replace("#", "", $color))
        ));
    }

    public static function processHeader($objPHPExcel, $letters, $activeSheet) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $findedDBEnc = false;
        $si = session::info();
        $ca->prepareSelect("nw_export_calculate_enc", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $ca->prepareSelect("nw_export_calculate_dev", "*", "empresa=:empresa");
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
                ob_start();
                include_once dirname(__FILE__) . '/nw_calculate/nw_calc_test.inc.php';
                $encData = ob_get_clean();
            } else {
                $findedDBEnc = true;
            }
        } else {
            $findedDBEnc = true;
        }
        if ($findedDBEnc == true) {
            $ca->next();
            $raz = $ca->assoc();
            $encData = $raz["encabezado"];
        }
        $DOM = new DOMDocument;
        $DOM->loadHTML($encData);
        $rows = $DOM->getElementsByTagName('tr');
        $counterCols = 1;
        $mergeCells = Array();
        foreach ($rows as $row) {
            $counterEnc = 0;
            foreach ($row->getElementsByTagName("td") as $col) {
                $imgInside = $col->getElementsByTagName('img');
                $havePath = false;
                $haveWidth = false;
                $imgEncPath = "";
                $imgWidth = "";
                if ($imgInside->length != 0) {
                    foreach ($imgInside as $inside) {
                        if ($inside->hasAttributes()) {
                            foreach ($inside->attributes as $attrImg) {
                                $nameColImg = $attrImg->nodeName;
                                $valueImg = $attrImg->nodeValue;
                                if ($nameColImg == "src" && $valueImg != "") {
                                    $imgEncPath = $_SERVER["DOCUMENT_ROOT"] . "/" . $valueImg;
                                    if (!file_exists($imgEncPath)) {
                                        $objDrawing = null;
                                        $havePath = false;
                                        continue;
                                    }
                                    $havePath = true;
                                } else if ($nameColImg == "width") {
                                    $haveWidth = true;
                                    $imgWidth = $valueImg;
                                }
                            }
                        }
                    }
                    if ($havePath === true && $imgEncPath != "") {
                        $objDrawing = new PHPExcel_Worksheet_Drawing();
                        $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                        $objDrawing->setName("name");
                        $objDrawing->setDescription("NW Excel Image");
                        $objDrawing->setCoordinates($letters[$counterEnc] . $counterCols);
                        $objDrawing->setPath($imgEncPath);
                        $objDrawing->setOffsetX(0);
                        $objDrawing->setOffsetY(0);
                    } else {
                        unset($imgInside);
                        unset($objDrawing);
                        $objDrawing = null;
                        $imgInside = null;
                    }
                    if ($haveWidth === false && $objDrawing != null) {
                        $objDrawing->setWidth(100);
                    } else if ($haveWidth === true && $objDrawing != null && $imgWidth != "") {
                        $objDrawing->setWidth($imgWidth);
                    }
                }
                $val = $col->nodeValue;
                if ($havePath == false) {
                    if ($val == "fecha_actual()") {
                        $activeSheet->setCellValue($letters[$counterEnc] . $counterCols, utf8_decode(date("Y-m-d")));
                    } else {
                        $activeSheet->setCellValue($letters[$counterEnc] . $counterCols, utf8_decode($val));
                    }
                }
                if ($col->hasAttributes()) {
                    foreach ($col->attributes as $attr) {
                        $nameCol = $attr->nodeName;
                        $value = $attr->nodeValue;
                        if ($nameCol == "style") {
                            $exploded = explode(";", $value);
                            for ($ixx = 0; $ixx < count($exploded); $ixx++) {
                                $style = explode(":", $exploded[$ixx]);
                                switch (trim($style[0])) {
                                    case "text-align":
                                        if (isset($style[1])) {
                                            if ($style[1] == "center") {
                                                $objPHPExcel->getActiveSheet()->getStyle($letters[$counterEnc] . $counterCols)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
                                            } else if ($style[1] == "left") {
                                                $objPHPExcel->getActiveSheet()->getStyle($letters[$counterEnc] . $counterCols)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
                                            } else if ($style[1] == "right") {
                                                $objPHPExcel->getActiveSheet()->getStyle($letters[$counterEnc] . $counterCols)->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
                                            }
                                        }
                                        break;
                                    case "font-weight":
                                        $objPHPExcel->getActiveSheet()->getStyle($letters[$counterEnc] . $counterCols)->getFont()->setBold(true);
                                        break;
                                    case "font-size":
                                        if (isset($style[1])) {
                                            $objPHPExcel->getActiveSheet()->getStyle($letters[$counterEnc] . $counterCols)->getFont()->setSize($style[1]);
                                        }
                                        break;
                                    case "background-color":
                                        if (isset($style[1])) {
                                            $phpColor = new PHPExcel_Style_Color();
                                            $phpColor->setRGB($style[1]);
                                            $objPHPExcel->getActiveSheet()->getStyle($letters[$counterEnc] . $counterCols)->getFont()->setColor($phpColor);
                                        }
                                        break;
                                }
                            }
                        } else if ($nameCol == "colspan") {
                            $mergeCells[] = $letters[$counterEnc] . $counterCols . ":" . $letters[$counterEnc + ($value - 1)] . $counterCols;
                        } else if ($nameCol == "bgcolor" && $value != "") {
                            self::cellColor($letters[$counterEnc] . $counterCols, $value);
                        }
                    }
                }
                $counterEnc++;
            }
            $counterCols++;
        }
        $DOM = null;
        //TRY TO MERGE
        for ($iuu = 0; $iuu < count($mergeCells); $iuu++) {
            $toMerge = $mergeCells[$iuu];
            try {
                @$activeSheet->mergeCells($toMerge);
            } catch (Exception $e) {
                
            }
        }
        return $counterEnc;
    }

    public static function errorLog($str) {
        error_log($str);
    }

    public static function exportXLS2007($pa, $sd = false, $noExport = Array(), $export = Array(), $rowHeight = false, $sorted = '', $special = true, $plot_img = false, $boolEnc = false, $maxRowsEnc = false, $name = '', $startNumbers = null, $tittle = false, $dimensiones = false) {

        global $objPHPExcel;
        if (function_exists('set_time_limit')) {
            set_time_limit(0);
        }

        if (count($pa) == 0) {
            $pa = Array(Array($pa));
        }

        //ignore_user_abort(True);

        ini_set('memory_limit', '-1'); // mem
        ini_set('max_execution_time', 3000); // time

        date_default_timezone_set(@date_default_timezone_get());
        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

        require_once dirname(__FILE__) . '/includes/PHPExcel/PHPExcel.php';

        libxml_use_internal_errors(true);

//        error_reporting(E_ALL);
//        ini_set('display_errors', TRUE);
//        ini_set('display_startup_errors', TRUE);
        //session::check();
        $si = session::info();

        if (!isset($si["usuario"])) {
            $si["usuario"] = "guest";
        }
        if (!isset($si["empresa"])) {
            $si["empresa"] = "1";
        }

        $part = "";
        if ($sd != false) {
            $part = (String) $sd;
            $part = array_map('trim', explode(".", $part));
            if (count($part) > 1) {
                $part = $part[count($part) - 1];
            } else {
                $part = $part[0];
            }
            $part = str_replace("l_", "", $part);
            $part = ucfirst($part);
        }
        if (!isset($part) || $part == "" || $part == null) {
            $part = $si["usuario"];
        }
        if ($name == '') {
            $filename = "/tmp/" . (string) str_replace(":", "_", $part) . "_" . (string) str_replace(":", "_", $si["usuario"]) . "_" . (string) $si["empresa"] . "_" . date("Y-m-d") . "_" . date("H_i_s") . ".xlsx";
        } else {
            $filename = "/tmp/" . $name . ".xlsx";
        }
        $objPHPExcel = new PHPExcel();

        if (!class_exists('ZipArchive')) {
            define('PCLZIP_TEMPORARY_DIR', $_SERVER["DOCUMENT_ROOT"] . '/tmp/');
            PHPExcel_Settings::setZipClass(PHPExcel_Settings::PCLZIP);
        }

        if (class_exists('Memcache')) {
            $cacheMethod = PHPExcel_CachedObjectStorageFactory::cache_to_memcache;
            $cacheSettings = array('memcacheServer' => 'localhost', 'memcachePort' => 11211, 'cacheTime' => 16600);
            PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);
        } else {
            $cacheMethod = PHPExcel_CachedObjectStorageFactory::cache_to_phpTemp;
            $cacheSettings = array('memoryCacheSize' => '32M');
            PHPExcel_Settings::setCacheStorageMethod($cacheMethod, $cacheSettings);
        }

        $objPHPExcel->getProperties()->setCreator("Andrés Flórez")
                ->setLastModifiedBy("Andrés Flórez")
                ->setTitle("NW Export::Grupo NW S.A.S")
                ->setSubject("NW Export Excel Class")
                ->setDescription("Document generated by NWLIB Class.")
                ->setKeywords("office PHPExcel php netwoods nw qxnw class tech")
                ->setCategory("Result File");

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $haveToEnterToCreate = true;

        for ($izzz = 0; $izzz < count($pa); $izzz++) {
            $startNumber = 2;
            if (isset($startNumbers) && $startNumbers != null) {
                $startNumber = $startNumbers;
            }
            $haveEnc = false;
            if ($boolEnc === "true" || $boolEnc === true) {
                if ($maxRowsEnc != false) {
                    if ($maxRowsEnc > 2) {
                        $startNumber = $maxRowsEnc + 1;
                        $haveEnc = true;
                    }
                }
            }
            $Cantidad_de_columnas_a_crear = 600;
            $Contador = 0;
            $Letra = 'A';
            $letters = Array();
            while ($Contador < $Cantidad_de_columnas_a_crear) {
                $letters[$Contador] = $Letra;
                $Contador++;
                $Letra++;
            }

            if ($izzz > 0) {
                $activeSheet = $objPHPExcel->createSheet($izzz);
                $special = false;
            } else {
                $activeSheet = $objPHPExcel->setActiveSheetIndex($izzz);
            }
            $colToBold = (String) $startNumber - 1;

            $activeSheet->getStyle("A" . $colToBold . ":AAZ" . $colToBold)->getFont()->setBold(true);

            $rowsCountHeader = 0;
            $encData = "";
            $encDataArray = "";
            if ($haveToEnterToCreate == true) {
                if ($haveEnc == true) {
                    if ($boolEnc === "true" || $boolEnc === true) {
                        if ($maxRowsEnc != false) {
                            if ($maxRowsEnc > 2) {
                                $rowsCountHeader = self::processHeader($objPHPExcel, $letters, $activeSheet);
                            }
                            $haveToEnterToCreate = false;
                        }
                    }
                }
            }
            $p = $pa[$izzz];

            if (isset($export)) {
                self::$columnsToExport = $export;
            } else {
                self::$columnsToExport = Array();
                if (count($p) > 0) {
                    foreach ($p[1] as $key => $value) {
                        self::$columnsToExport[] = $key;
                    }
                }
            }
            if (self::$columnsToExport === false) {
                self::$columnsToExport = Array();
                //TODO: CAMBIO PARA EXPORTAR 1 ROW NAVTABLE. LIST NO ENTRA
//                NWJSonRpcServer::console($p);
                if (count($p) > 0) {
                    foreach ($p[0] as $key => $value) {
                        self::$columnsToExport[] = Array($key);
                    }
                }
            }

            if (!isset($special) && $izzz == 0) {
                $special = true;
            }

            if (count($p) == 0) {
                $p = Array(Array());
            }

            if ($special === true && $izzz == 0) {
                if (isset($sorted) && $sorted != '' && $sorted != 0) {
                    if (count($sorted) > 0) {
                        if (isset($sorted["sorted"]) && $sorted["sorted"] != "") {
                            if (isset($sorted["sorted_name"]) && $sorted["sorted_name"] != "" && $sorted["sorted_name"] != -1) {
                                if ($sorted["sorted_method"] === true) {
                                    $sortMethod = SORT_ASC;
                                } else {
                                    $sortMethod = SORT_DESC;
                                }
                                master::array_sort_by_column($p, $sorted["sorted_name"], $sortMethod);
                            }
                        }
                    }
                }
                if (isset($sorted["subfilters"])) {
                    foreach ($sorted["subfilters"] as $value) {
                        if ($value == null) {
                            continue;
                        }
                        $hidingStore = Array();
                        $colName = $value[0]["colName"];
                        $dt = Array();
                        for ($ib = 0; $ib < count($value); $ib++) {
                            $val = $value[$ib]["value"];
                            $dt[] = $val;
                        }
                        for ($i = 0; $i < count($p); $i++) {
                            $counter = 0;
                            $maxCounter = count(self::$columnsToExport);
                            for ($ia = 0; $ia < $maxCounter; $ia++) {
                                $name = self::$columnsToExport[$ia][0];
                                if ($name == $colName) {
                                    if (in_array($p[$i][self::$columnsToExport[$ia][0]], $dt) === false) {
                                        $hidingStore[] = $i;
                                    }
                                }
                                $counter++;
                            }
                        }

                        $hidden = 0;
                        $i = 0;
                        for ($id = 0; $id < count($hidingStore); $id++) {
                            $row = $hidingStore[$id];
                            $count = 1;
                            while ($i + 1 < count($hidingStore) && isset($hidingStore[$id + 1]) && $hidingStore[$id] == $hidingStore[$id + 1] - 1) {
                                $count++;
                                $id++;
                            }
                            array_splice($p, $row - $hidden, $count);

                            $hidden += $count;
                        }
                    }
                }
            }

//            NWJSonRpcServer::console($p);

            for ($i = 0; $i < count($p); $i++) {

                $columnCount = 0;

                if ($izzz == 0) {
                    $maxCounter = count(self::$columnsToExport);
                } else {
                    $maxCounter = 0;
                    foreach ($p[$i] as $value) {
                        $maxCounter++;
                    }
                }

                $haveColor = false;
                $colorHaveColor = true;

                for ($ia = 0; $ia < $maxCounter; $ia++) {
                    $val = "";
                    $type = "";
                    $name = "";
                    $color = "";
                    $colorCondition = "";
                    $colorValue = "";

                    if (isset($p[$i][self::$columnsToExport[$ia][0]])) {
                        $val = $p[$i][self::$columnsToExport[$ia][0]];
                    }

                    if (isset(self::$columnsToExport[$ia][1])) {
                        $name = self::$columnsToExport[$ia][1];
                    } else {
                        $name = self::$columnsToExport[$ia][0];
                    }
                    if (isset(self::$columnsToExport[$ia][2])) {
                        if (self::$columnsToExport[$ia][2]) {
                            $type = self::$columnsToExport[$ia][2];
                        }
                    }
                    if (isset(self::$columnsToExport[$ia][3])) {
                        if (self::$columnsToExport[$ia][3]) {
                            $d = explode("::", self::$columnsToExport[$ia][3]);
                            $color = $d[0];
                            $d = explode(";;", $d[1]);
                            $colorCondition = $d[0];
                            $colorValue = $d[1];
                            $colorType = $d[2];
                        }
                    }
                    if ($tittle == true) {
                        if ($i == 0) {
                            $oldName = strip_tags($name);
                            $activeSheet->setCellValue($letters[$columnCount] . ($startNumber - 1), $oldName);
                            $pos = strpos($name, "div", 0);
                            if ($pos !== false) {
                                $htmlName = substr($name, $pos - 1);
                                $DOMSTYLES = new DOMDocument;
                                $DOMSTYLES->loadHTML($htmlName);
                                $nameFinded = $DOMSTYLES->getElementsByTagName('div');
                                if ($nameFinded->item(0)) {
                                    if ($nameFinded->item(0)->hasAttributes()) {
                                        foreach ($nameFinded->item(0)->attributes as $attr) {
                                            $nameCol = $attr->nodeName;
                                            $valueCol = $attr->nodeValue;
                                            if ($nameCol == "color") {
                                                self::cellColor($letters[$columnCount] . ($startNumber - 1), $valueCol);
                                            }
                                        }
                                    }
                                }
                                $DOMSTYLES = null;
                            }
                        }
                    }
                    $ext = "";
                    if ($val != "") {
                        try {
                            if (gettype($val) == "array") {
                                if (isset($val["name"])) {
                                    $val = $val["name"];
                                } else if (isset($val["nombre"])) {
                                    $val = $val["nombre"];
                                } else if ($val["id"]) {
                                    $val = $val["id"];
                                }
                                $ext_explode = explode(".", $val);
                            } else {
                                $ext_explode = explode(".", $val);
                            }
                            $ext = array_pop($ext_explode);
                        } catch (Exception $exc) {
                            
                        }
                    }

                    if ($type == "image") {

                        if ($val == "") {
                            $objPHPExcel->setActiveSheetIndex(0)->setCellValue($letters[$columnCount] . $startNumber, $val);
                            $columnCount++;
                            continue;
                        }
                        $description = "Image powered by qxnw library";

                        $is_file = self::checkExtension($ext);
                        if ($is_file != false) {
                            $val = $is_file;
                        }

                        $img_path = $_SERVER["DOCUMENT_ROOT"] . $val;

                        $width_image = self::checkImageSize($img_path);

                        if (!file_exists($img_path)) {
                            $img_path = $_SERVER["DOCUMENT_ROOT"] . "/resource/" . $val;
                            $width_image = self::checkImageSize($img_path);
                            if (!file_exists($img_path)) {
                                $img_path = $_SERVER["DOCUMENT_ROOT"] . "/build/resource/" . $val;
                                $width_image = self::checkImageSize($img_path);
                                if (!file_exists($img_path)) {
                                    $img_path = $val;
                                    $width_image = self::checkImageSize($img_path);
                                    if (!file_exists($img_path)) {
                                        $img_path = "https://" . $_SERVER["HTTP_HOST"] . "/" . $val;
                                        $width_image = self::checkImageSize($img_path);
                                        if (!file_exists($img_path)) {
                                            $objPHPExcel->setActiveSheetIndex(0)->setCellValue($letters[$columnCount] . $startNumber, $val);
                                        } else {
                                            $objDrawing = new PHPExcel_Worksheet_Drawing();
                                            $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                                            $objDrawing->setName("name");
                                            $objDrawing->setDescription($description);
                                            $objDrawing->setPath($img_path);
                                            $objDrawing->setCoordinates($letters[$columnCount] . $startNumber);
                                            $objDrawing->setOffsetX(1);
                                            $objDrawing->setOffsetY(5);
                                            $objDrawing->setWidth($width_image);
                                        }
                                    } else {
                                        $objDrawing = new PHPExcel_Worksheet_Drawing();
                                        $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                                        $objDrawing->setName("name");
                                        $objDrawing->setDescription($description);
                                        $objDrawing->setPath($img_path);
                                        $objDrawing->setCoordinates($letters[$columnCount] . $startNumber);
                                        $objDrawing->setOffsetX(1);
                                        $objDrawing->setOffsetY(5);
                                        $objDrawing->setWidth($width_image);
                                    }
                                } else {
                                    $objDrawing = new PHPExcel_Worksheet_Drawing();
                                    $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                                    $objDrawing->setName("name");
                                    $objDrawing->setDescription($description);
                                    $objDrawing->setPath($img_path);
                                    $objDrawing->setCoordinates($letters[$columnCount] . $startNumber);
                                    $objDrawing->setOffsetX(1);
                                    $objDrawing->setOffsetY(5);
                                    $objDrawing->setWidth($width_image);
                                }
                            } else {
                                $objDrawing = new PHPExcel_Worksheet_Drawing();
                                $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                                $objDrawing->setName("name");
                                $objDrawing->setDescription($description);
                                $objDrawing->setPath($img_path);
                                $objDrawing->setCoordinates($letters[$columnCount] . $startNumber);
                                $objDrawing->setOffsetX(1);
                                $objDrawing->setOffsetY(5);
                                $objDrawing->setWidth($width_image);
                            }
                        } else {
                            $objDrawing = new PHPExcel_Worksheet_Drawing();
                            $objDrawing->setWorksheet($objPHPExcel->getActiveSheet());
                            $objDrawing->setName("name");
                            $objDrawing->setDescription($description);
                            $objDrawing->setPath($img_path);
                            $objDrawing->setCoordinates($letters[$columnCount] . $startNumber);
                            $objDrawing->setOffsetX(1);
                            $objDrawing->setOffsetY(5);
                            $objDrawing->setWidth($width_image);
                        }
                    } else {
                        if ($special === true && $izzz == 0) {
                            $colorThat = false;
                            if (isset($colorCondition)) {
                                if ($colorCondition == "==") {
                                    if ($color != "" && $val == $colorValue) {
                                        $colorThat = true;
                                    }
                                } else if ($colorCondition == ">") {
                                    if ($color != "" && $val > $colorValue) {
                                        $colorThat = true;
                                    }
                                } else if ($colorCondition == "<") {
                                    if ($color != "" && $val < $colorValue) {
                                        $colorThat = true;
                                    }
                                } else if ($colorCondition == "<=") {
                                    if ($color != "" && $val <= $colorValue) {
                                        $colorThat = true;
                                    }
                                } else if ($colorCondition == ">=") {
                                    if ($color != "" && $val >= $colorValue) {
                                        $colorThat = true;
                                    }
                                } else if ($colorCondition == "!=") {
                                    if ($color != "" && $val != $colorValue) {
                                        $colorThat = true;
                                    }
                                }
                            }

                            if ($colorThat == true) {
                                $haveColor = true;
                                $colorHaveColor = $color;
                                self::cellColor($letters[$columnCount] . $startNumber, $color);
                                for ($ibb = 0; $ibb < $ia; $ibb++) {
                                    if ($colorType != "SOLO_LETRA") {
                                        self::cellColor($letters[$ibb] . $startNumber, $color);
                                    }
                                }
                            }

                            if ($haveColor) {
                                if ($colorHaveColor !== true && $colorType != "SOLO_LETRA") {
                                    self::cellColor($letters[$columnCount] . $startNumber, $colorHaveColor);
                                }
                            }
                            if ($type == "string") {
                                $objPHPExcel->getActiveSheet()->setCellValueExplicit($letters[$columnCount] . $startNumber, $val, PHPExcel_Cell_DataType::TYPE_STRING);
                            } else if ($type == "money") {
                                $objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getNumberFormat()->setFormatCode("$#,##0.00");
                            } else if ($type == "percent") {
                                $objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getNumberFormat()->setFormatCode("0.00");
                            } else if (($type == "date" || $type == "dateField" || $type == "dateTimeField") && $val != "" && $val != null) {
                                $internal = explode(" ", $val);
                                $format = "yyyy-mm-dd";
                                $conf = NWUtils::readConfig();
                                if (isset($conf)) {
                                    if ($conf != null) {
                                        if ($conf != "") {
                                            if (isset($conf["fecha_normal"])) {
                                                if ($conf["fecha_normal"] != null) {
                                                    if ($conf["fecha_normal"] != "") {
                                                        $format = $conf["fecha_normal"];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                $haveDiff = false;
                                if (isset($internal[0])) {
                                    $testDate = explode("/", $internal[0]);
                                    if (isset($testDate[0])) {
                                        if (isset($testDate[2])) {
                                            if (strlen($testDate[2]) == 4) {
                                                $format = "d/m/yy";
                                                $haveDiff = true;
                                            }
                                        }
                                    }
                                }
                                if (count($internal) > 1) {
                                    $format = $format . " hh:mm:ss";
                                }
                                if ($haveDiff === false) {
//                                    if (!self::validateDate($val, $format)) {
//                                        $unixTimestamp = null;
//                                    } else {
                                    $unixTimestamp = new DateTime($val);
//                                    }
                                } else {
                                    $dateTime = new DateTime();
                                    $unixTimestamp = $dateTime->createFromFormat($format, $val);
                                }
                                $val = PHPExcel_Shared_Date::PHPToExcel($unixTimestamp);
                                $objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getNumberFormat()->setFormatCode($format);
                            } else if ($type == "numeric") {
                                $objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getNumberFormat()->setFormatCode("#,##0.00");
                            } else if ($type == "textArea") {
                                $objPHPExcel->getActiveSheet()->getStyle($letters[$columnCount] . $startNumber)->getAlignment()->setWrapText(true);
                                $objPHPExcel->getActiveSheet()->getRowDimension($i)->setRowHeight(-1);
                            }
                            if (is_array($val)) {
                                if (isset($val["name"])) {
                                    $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val["name"]);
                                } else {
                                    $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val["nombre"]);
                                }
                            } else {
                                if ($type != "string") {
                                    if ($type == "html") {
                                        $val = strip_tags(str_replace("<br>", "\n", $val));
                                        $val = strip_tags(str_replace("< br/>", "\n", $val));
                                        $val = strip_tags(str_replace("<br/>", "\n", $val));
                                        $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val);
                                    } else {
                                        if (isset($val[0]) && $val[0] == "0") {
                                            $objPHPExcel->getActiveSheet()->setCellValueExplicit($letters[$columnCount] . $startNumber, $val, PHPExcel_Cell_DataType::TYPE_STRING);
                                        } else {
                                            $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val);
                                        }
                                    }
                                }
                            }
                        } else {
                            if (is_array($val)) {
                                if (isset($val["name"])) {
                                    $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val["name"]);
                                } else {
                                    $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val["nombre"]);
                                }
                            } else {
                                $activeSheet->setCellValue($letters[$columnCount] . $startNumber, $val);
                            }
                        }
                    }
                    $columnCount++;
                }
                $startNumber++;
            }

            if ($plot_img != false) {
                if ($plot_img != "false" && $plot_img != '' && $izzz == 0 && $plot_img !== null) {
                    $plot_img = str_replace("data:image/png;base64,", "", $plot_img);
                    if (!extension_loaded('gd') && !function_exists('gd_info')) {
                        NWJSonRpcServer::error("La librería GD de PHP no está instalada");
                        return;
                    }
                    $image = imagecreatefromstring(base64_decode($plot_img));
                    imagesavealpha($image, true);
                    $drawing = new PHPExcel_Worksheet_MemoryDrawing();
                    $drawing->setName("NW Graph");
                    $drawing->setImageResource($image);
                    $drawing->setRenderingFunction(PHPExcel_Worksheet_MemoryDrawing::RENDERING_JPEG);
                    $drawing->setMimeType(PHPExcel_Worksheet_MemoryDrawing::MIMETYPE_DEFAULT);
                    $drawing->setCoordinates("F1");
                    $drawing->setWidth(200);
                    $drawing->setHeight(300);
                    $drawing->setWorksheet($objPHPExcel->getActiveSheet());
                }
            }

            if ($izzz == 0) {
                $colCount = count(self::$columnsToExport);
                $getActiveSheet = $objPHPExcel->getActiveSheet();

                if (isset($dimensiones) && $dimensiones != false) {
                    foreach ($dimensiones[0] as $key2 => $value2) {
                        $width = intval($value2);
                        $letra = strval($key2);
                        $objPHPExcel->getActiveSheet()->getColumnDimension($letra)->setAutoSize(false);
                        $objPHPExcel->getActiveSheet()->getColumnDimension($letra)->setWidth($width);
                    }
                } else {
                    for ($i = 0; $i < $colCount; $i++) {
                        $getActiveSheet->getColumnDimension($letters[$i])->setAutoSize(true);
                    }
                }
                if ($rowHeight != false) {
                    if (!isset($maxRowsEnc) || $maxRowsEnc == null || $maxRowsEnc == "") {
                        $maxRowsEnc = 0;
                    }
                    if ($boolEnc == "false") {
                        $maxRowsEnc = 0;
                    }
                    for ($iaaa = $maxRowsEnc; $iaaa <= count($p) + ($maxRowsEnc + 1); $iaaa++) {
                        $getActiveSheet->getRowDimension($iaaa)->setRowHeight($rowHeight);
                    }
                }
            }
            if ($izzz == 0) {
                $activeSheet->setTitle(substr($part, 0, 30));
            } else {
                $activeSheet->setTitle(substr($part . " " . $izzz, 0, 30));
            }
        }

        $objPHPExcel->setActiveSheetIndex(0);

        //$callStartTime = microtime(true);

        if (!file_exists($_SERVER["DOCUMENT_ROOT"] . "/tmp/")) {
            NWJSonRpcServer::error("La carpeta '/tmp' no está creada o no tiene los permisos suficientes. Comuníquese con el administrador. ");
        }

        if (!is_writable($_SERVER["DOCUMENT_ROOT"] . "/tmp/")) {
            NWJSonRpcServer::error("La carpeta '/tmp' no tiene los permisos suficientes. Comuníquese con el administrador. ");
        }

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');

        $objWriter->setUseDiskCaching(true);

        $objWriter->save($_SERVER["DOCUMENT_ROOT"] . $filename);

        $objPHPExcel->disconnectWorksheets();

        libxml_use_internal_errors(false);

        unset($objPHPExcel);

        //$callEndTime = microtime(true);
        //$callTime = $callEndTime - $callStartTime;
        $ca->prepareSelect("nw_downloads", "max(id) as id");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $id = 1;
        $r = $ca->flush();
        if ($r != false) {
            $id = $r["id"] + 1;
        }
//        $id = master::getNextSequence("nw_downloads" . "_id_seq", $db);

        $parte = isset($sd["part"]) ? $sd["part"] : "TODO";
        $clave = master::get_random_string("abcdefghijkLMNWefr", 20);
        $ca->prepareInsert("nw_downloads", "id,file_name,path,clave,parte,fecha_creacion,usuario,num_rows");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":file_name", basename($filename));
        $ca->bindValue(":path", $filename);
        $ca->bindValue(":clave", $clave);
        $ca->bindValue(":parte", $parte == "" ? $_SESSION["usuario"] : $parte);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha_creacion", NWUtils::getDate($db), false);
        } else {
            $ca->bindValue(":fecha_creacion", date("Y-m-d"));
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":num_rows", count($p));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        $data = Array();
        $data["id"] = $id;
        $data["key"] = $clave;
        return $data;
    }

    public static function validateDate($date, $format = 'yyyy-mm-dd H:i:s') {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    public static function checkImageSize($path) {
        $rta = 100;
        if (file_exists($path) && function_exists('getimagesize')) {
            $v = getimagesize($path);
            if (isset($v[0])) {
                $rta = (int) $v[0];
            }
        }
        if ($rta > 100) {
            $rta = 100;
        }
        return $rta;
    }

    public static function checkExtension($ext) {
        $files_ext = array("bmp", "BMP", "tiff", "mp3", "htm", "rar", "zip", "txt", "TXT", "doc", "XLS", "xls", "PDF", "pdf", "mov", "avi", "flv", "rar", "WMA", "DOCX", "docx", "wma", "pptx", "ppt", "xlsx", "XLSX", "wmv", "WMV", "part", "csv", "ttf", "otf", "TTF", "OTF");
        if (in_array(strtolower($ext), $files_ext)) {
            switch (strtolower($ext)) {
                case "odt":
                    return "/nwlib6/icons/32/word.png";
                    break;
                case "docx":
                    return "/nwlib6/icons/32/word.png";
                    break;
                case "doc":
                    return "/nwlib6/icons/32/word.png";
                    break;
                case "txt":
                    return "/nwlib6/icons/32/word.png";
                    break;
                case "pdf":
                    return "/nwlib6/icons/32/pdf.png";
                    break;
                case "xls":
                    return "/nwlib6/icons/32/excel.png";
                    break;
                case "xlsx":
                    return "/nwlib6/icons/32/excel.png";
                    break;
                case "ppt":
                    return "/nwlib6/icons/32/PowerPoint-icon.png";
                    break;
                case "ppp":
                    return "/nwlib6/icons/32/PowerPoint-icon.png";
                    break;
                case "pptx":
                    return "/nwlib6/icons/32/PowerPoint-icon.png";
                    break;
                default:
                    return "/nwlib6/icons/32/upload.png";
                    break;
            }
        } else {
            return false;
        }
    }

    public static function exportPHPExcelSimple($p) {
        $p = nwMaker::getData($p);
        $noExport = false;
        $export = false;
        $rowHeight = false;
        $sort = '';
        $special = false;
        $boolEnc = false;
        $maxRowsEnc = false;
        $tittle = true;
        $dimensions = false;
        $startNumbers = 2;
        $name = '';
        if (isset($p["special"])) {
            $special = $p["special"];
        }
        if (isset($p["noExport"])) {
            $noExport = $p["noExport"];
        }
        if (isset($p["name"])) {
            $name = $p["name"];
        }
        if (isset($p["rowHeight"])) {
            $rowHeight = $p["rowHeight"];
        }
        if (isset($p["exportCols"])) {
            $export = $p["exportCols"];
        }
        if (isset($p["encBoolean"])) {
            $boolEnc = $p["encBoolean"];
        }
        if (isset($p["maxEncRows"])) {
            $maxRowsEnc = $p["maxEncRows"];
        }
        if (isset($p["startNumber"])) {
            $startNumbers = $p["startNumber"];
        }
        if (isset($p["title"])) {
            $tittle = $p["title"];
        }
        if (isset($p["dimensions"])) {
            $dimensions = $p["dimensions"];
        }
        $part = "";
        if (isset($p["part"])) {
            $part = $p["part"];
        } else if (isset($p["table"])) {
            $part = $p["table"];
        }
        $plot_img = isset($p["img_plot"]) ? $p["img_plot"] : false;
        $d = exportExcel::exportXLS2007($p["records"], $part, $noExport, $export, $rowHeight, 0, true, $plot_img, $boolEnc, $maxRowsEnc, $name, $startNumbers, $tittle, $dimensions);
        $exportId = $d["id"];
        $exportKey = $d["key"];
        return array(
            "id" => $exportId,
            "key" => $exportKey
        );
    }

    public static function exportExcel5($p) {
        session::check();
        $si = session::info();
        // Create new PHPExcel object
        echo date('H:i:s'), " Create new PHPExcel object", EOL;
        $objPHPExcel = new PHPExcel();

// Set document properties
        echo date('H:i:s'), " Set document properties", EOL;
        $objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
                ->setLastModifiedBy("Maarten Balliauw")
                ->setTitle("PHPExcel Test Document")
                ->setSubject("PHPExcel Test Document")
                ->setDescription("Test document for PHPExcel, generated using PHP classes.")
                ->setKeywords("office PHPExcel php")
                ->setCategory("Test result file");

// Add some data
        echo date('H:i:s'), " Add some data", EOL;
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A1', 'Hello')
                ->setCellValue('B2', 'world!')
                ->setCellValue('C1', 'Hello')
                ->setCellValue('D2', 'world!');

// Miscellaneous glyphs, UTF-8
        $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A4', 'Miscellaneous glyphs')
                ->setCellValue('A5', 'éàèùâêîôûëïüÿäöüç');

// Rename worksheet
        echo date('H:i:s'), " Rename worksheet", EOL;
        $objPHPExcel->getActiveSheet()->setTitle('Simple');

// Set active sheet index to the first sheet, so Excel opens this as the first sheet
        $objPHPExcel->setActiveSheetIndex(0);

// Save Excel5 file
        echo date('H:i:s'), " Write to Excel5 format", EOL;
        $callStartTime = microtime(true);

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        $objWriter->save(str_replace('.php', '.xls', __FILE__));
        $callEndTime = microtime(true);
        $callTime = $callEndTime - $callStartTime;

        echo date('H:i:s'), " File written to ", str_replace('.php', '.xls', pathinfo(__FILE__, PATHINFO_BASENAME)), EOL;
        echo 'Call time to write Workbook was ', sprintf('%.4f', $callTime), " seconds", EOL;
// Echo memory usage
        echo date('H:i:s'), ' Current memory usage: ', (memory_get_usage(true) / 1024 / 1024), " MB", EOL;

// Echo memory peak usage
        echo date('H:i:s'), " Peak memory usage: ", (memory_get_peak_usage(true) / 1024 / 1024), " MB", EOL;

// Echo done
        echo date('H:i:s'), " Done writing files", EOL;
        echo 'Files have been created in ', getcwd(), EOL;
    }

}
