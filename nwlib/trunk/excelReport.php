<?php

class excelReport {

    public static function saveHtmlToExportToExcel($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $id = 0;
        $driver = $db->getDriver();
        if ($driver == "MYSQL") {
            $ca->prepare("select max(id) as id from nw_excel_list");
        } else if ($driver == "PGSQL") {
            $ca->prepare("select nextval('nw_excel_list_id_seq') as id");
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            if ($driver == "MYSQL") {
                $id = $r["id"] + 1;
            } else if ($driver == "PGSQL") {
                $id = $r["id"];
            }
        }
        $ca->prepareInsert("nw_excel_list", "id,html,usuario,fecha,empresa");
        $ca->cleanHtml = false;
        $ca->bindValue(":id", $id);
        $ca->bindValue(":html", $p);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $id;
    }

    public static function exportXLS($p) {
        require_once dirname(__FILE__) . "/php-excel/excel.php";
        $filename = "tmp/excelNWReport" . date("Y-m-d") . ".xls";
        $excelfile = "xlsfile:/" . $_SERVER["DOCUMENT_ROOT"] . $filename;
        $fp = fopen($excelfile, "w+");
        if (!is_resource($fp)) {
            NWJSonRpcServer::information("Error al crear $excelfile");
        }

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $ca->prepareSelect("nw_reports_excel_enc", "*", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            NWJSonRpcServer::information("No se realizó la consulta del informe. Inténtelo más tarde.");
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        $ca->prepareSelect("nw_reports_excel_filters", "*", "reporte=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        $filters = Array();
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $rb = $ca->assoc();
            $filters[] = $rb;
            $quote = "";
            if ($rb["type"] == "dateField") {
                $quote = "'";
            }
            if ($p[$rb["nombre"]] != null) {
                if ($p[$rb["nombre"]] != "null") {
                    if ($rb["required"] == 1 && $p[$rb["nombre"]] == "") {
                        NWJSonRpcServer::information("Debe ingresar un valor en el campo " . $rb["label"]);
                        return;
                    }
                    if ($p[$rb["nombre"]] != "") {
                        $r["sql_query"] = str_replace(":" . $rb["nombre"], $quote . $p[$rb["nombre"]] . $quote, $r["sql_query"]);
                    }
                }
            }
        }
        $cb->prepare(str_replace("$", "'", $r["sql_query"]));
        for ($i = 0; $i < count($filters); $i++) {
            if (isset($p[$filters[$i]["nombre"]])) {
                if ($p[$filters[$i]["nombre"]] != null) {
                    if ($p[$filters[$i]["nombre"]] != "null") {
                        if ($p[$filters[$i]["nombre"]] != "") {
                            $cb->bindValue(":" . $filters[$i]["nombre"], $p[$filters[$i]["nombre"]], true);
                        }
                    }
                }
            }
        }
        if (!$cb->exec()) {
            NWJSonRpcServer::error($cb->lastErrorText());
            return;
        }
        $rc = $cb->assocAll();

        //$p = iconv(mb_detect_encoding(serialize($rc)), "UTF-8", serialize($rc));
        $p = serialize($rc);
        $fc = $p;
        header("Content-type: application/x-msexcel;charset=iso-8859-1");
        header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        header("Content-type: application/x-msexcel");
        header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
        fwrite($fp, $fc);
        fclose($fp);
        return "/" . $filename;
    }

    public static function consulta($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_reports_excel_enc", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getSimpleFilters($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_reports_excel_filters", "*,CASE WHEN required=1 THEN 'SI' ELSE 'NO' END as required_nom", "reporte=:reporte");
        $ca->bindValue(":reporte", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getFilters($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_reports_excel_filters", "nombre as name,label,type,required,descripcion as description", "reporte=:reporte");
        $ca->bindValue(":reporte", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $data = $ca->assocAll();
        $enc = Array();
        $ca->prepareSelect("nw_reports_excel_enc", "*", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            array_push($data, $enc);
        } else {
            $ca->next();
            $r = $ca->assoc();
            array_push($data, $r);
        }
        return $data;
    }

    public static function save($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->setPregMatchDuplicate(false);
        $ca->cleanHtml = false;
        $ca->__haveAdvancedSecurity = false;
        $si = session::info();
        $fields = "id,nombre,sql_query,usuario,fecha,empresa";
        $id = 1;
        if ($p["id"] == "") {
            $ca->prepareSelect("nw_reports_excel_enc", "max(id) as id", "empresa=:empresa");
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() != 0) {
                $ca->next();
                $r = $ca->assoc();
                $id = $r["id"] + 1;
            }
            $ca->prepareInsert("nw_reports_excel_enc", $fields, "empresa=:empresa");
        } else {
            $id = $p["id"];
            $ca->prepareUpdate("nw_reports_excel_enc", $fields, "id=:id and empresa=:empresa");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":sql_query", NWUtils::removeSecuritySql(str_replace("'", "$", $p["sql_query"])));
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareDelete("nw_reports_excel_filters", "reporte=:reporte");
        $ca->bindValue(":reporte", $id);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        if (count($p["detalleFiltros"]) > 0) {
            for ($i = 0; $i < count($p["detalleFiltros"]); $i++) {
                if ($p["detalleFiltros"][$i]["required"] == "true") {
                    $required = 1;
                } else if ($p["detalleFiltros"][$i]["required"] == "false") {
                    $required = 0;
                } else if ($p["detalleFiltros"][$i]["required"] == 1) {
                    $required = 1;
                } else {
                    $required = $p["detalleFiltros"][$i]["required"];
                }
                $ca->prepareInsert("nw_reports_excel_filters", "reporte,nombre,label,type,required,descripcion");
                $ca->bindValue(":reporte", $id);
                $ca->bindValue(":nombre", $p["detalleFiltros"][$i]["nombre"]);
                $ca->bindValue(":label", $p["detalleFiltros"][$i]["label"]);
                $ca->bindValue(":type", $p["detalleFiltros"][$i]["type"]);
                $ca->bindValue(":descripcion", $p["detalleFiltros"][$i]["descripcion"]);
                $ca->bindValue(":required", $required, false);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
                }
            }
        }
        $db->commit();
        return $id;
    }

    public static function delete($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_reports_excel_enc", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("nw_reports_excel_filters", "reporte=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

}
