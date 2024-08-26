<?php

class nw_printer {

    static $fields = "id,oculto,nombre,encabezado,pie,centro,empresa,fecha,usuario,alto,ancho,text_transform,ancho_tabla,
            margen_superior,margen_inferior,margen_izquierda,margen_derecha,fuente,tamano_fuente,centrar";

    public static function duplicityPrinter($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $ca->haveAdvancedSecurity(false);
        $si = session::info();
        $ca->prepareSelect("nw_printer_settings", "*", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $db->rollback();
            NWJSonRpcServer::error("Hay un problema al duplicar los encabezados. Inténtelo de nuevo.");
        }
        $ca->next();
        $r = $ca->assoc();
        $id= master::getNextSequence("nw_printer_settings" . "_id_seq", $db);
        $ca->prepareInsert("nw_printer_settings", self::$fields);
        $ca->bindValue(":id", $id);
        $ca->bindValue(":oculto", $r["oculto"]);
        $ca->bindValue(":nombre", $r["nombre"]);
        $ca->bindValue(":encabezado", $r["encabezado"]);
        $ca->bindValue(":pie", $r["pie"]);
        $ca->bindValue(":centro", $r["centro"]);
        $ca->bindValue(":alto", $r["alto"], false, true);
        $ca->bindValue(":ancho", $r["ancho"], false, true);
        $ca->bindValue(":text_transform", $r["text_transform"]);
        $ca->bindValue(":ancho_tabla", $r["ancho_tabla"], false, true);
        $ca->bindValue(":margen_superior", $r["margen_superior"], false, true);
        $ca->bindValue(":margen_inferior", $r["margen_inferior"], false, true);
        $ca->bindValue(":margen_derecha", $r["margen_derecha"], false, true);
        $ca->bindValue(":margen_izquierda", $r["margen_izquierda"], false, true);
        $ca->bindValue(":fuente", $r["fuente"]);
        $ca->bindValue(":tamano_fuente", $p["tamano_fuente"], false, true);
        $ca->bindValue(":centrar", $p["centrar"], false, true);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $ca->prepareSelect("nw_printer_water_mark", "*", "printer=:printer");
        $ca->bindValue(":printer", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $fields = Array();
            foreach ($r as $key => $v) {
                if ($key != "id") {
                    $fields[] = $key;
                }
            }
            $r["printer"] = $id;
            $ca->prepareInsert("nw_printer_water_mark", implode(",", $fields));
            foreach ($r as $key => $v) {
                if ($key != "id") {
                    if ($key == "rotacion" || $key == "tamano_fuente" || $key == "espacio" || $key == "rojo_fuente" || $key == "verde_fuente" ||
                            $key == "azul_fuente" || $key == "rojo_fondo" || $key == "verde_fondo" || $key == "azul_fondo" || $key == "empresa" || $key == "fecha") {
                        $ca->bindValue(":" . $key, $v, false, true);
                    } else {
                        $ca->bindValue(":" . $key, $v);
                    }
                }
            }
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }

        $table = "nw_printer_data";
        $ca->prepareSelect($table, "*", "printer=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            if ($db->getDriver() == "MYSQL") {
                $fields = "printer,nombre,sql_data";
            } else {
                $fields = "printer,nombre,sql";
            }
            $ca->prepareInsert($table, $fields);
            $ca->bindValue(":printer", $id);
            $ca->bindValue(":nombre", $r["nombre"]);
            if ($db->getDriver() == "MYSQL") {
                $ca->bindValue(":sql_data", $r["sql"]);
            } else {
                $ca->bindValue(":sql", $r["sql"]);
            }
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        $db->commit();
        return true;
    }

    public static function getSQLData($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "MYSQL") {
            $ca->prepareSelect("nw_printer_data", "nombre,sql_data", "printer=:printer");
        } else {
            $ca->prepareSelect("nw_printer_data", "nombre,sql", "printer=:printer");
        }
        $ca->bindValue(":printer", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getBody($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_printer_settings", "centro,encabezado,pie,oculto", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return Array();
        }
        $ca->next();
        return $ca->assoc();
    }

    public static function getPrinterSettings($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        //, "empresa=:empresa" TODO: se dejan compartidos para todas las empresas que usen el sistema
        $ca->prepareSelect("nw_printer_settings", "*");
        //$ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getOculto($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_printer_settings", "oculto", "empresa=:empresa and id=:id");
        $ca->bindValue(":id", $p);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $ca->next();
        return $ca->assoc();
    }

    public static function consult($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " empresa=empresa ";
        $fields = "nombre,encabezado,pie,empresa,fecha,usuario,ancho,alto,text_transform,ancho_tabla,margen_superior,
            margen_inferior,margen_izquierda,margen_derecha,fuente,tamano_fuente,centrar,marca_agua";
        if (isset($p["filters"])) {
            if ($p["filters"]["search"] != "") {
                $where .= " and " . NWDbQuery::sqlFieldsFilters($fields, $p["filters"]["search"], true);
            }
        }
        $ca->prepareSelect("nw_printer_settings", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $ca->haveAdvancedSecurity(false);
        $si = session::info();
        $fields = "nombre,oculto,encabezado,pie,centro,empresa,fecha,usuario,alto,ancho,text_transform,ancho_tabla,
            margen_superior,margen_inferior,margen_izquierda,margen_derecha,fuente,tamano_fuente,centrar";
        $id = $p["id"];
        if ($id == "") {
            $ca->prepareSelect("nw_printer_settings", "max(id) as id", "empresa=:empresa");
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
                $id = 1;
            } else {
                $ca->next();
                $r = $ca->assoc();
                $id = $r["id"] + 1;
            }
            $ca->prepareInsert("nw_printer_settings", "id," . $fields);
        } else {
            $ca->prepareUpdate("nw_printer_settings", $fields, "id=:id and empresa=:empresa");
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":encabezado", $p["encabezado"]);
        $ca->bindValue(":oculto", $p["oculto"]);
        $ca->bindValue(":pie", $p["pie"]);
        $ca->bindValue(":centro", $p["centro"]);
        $ca->bindValue(":alto", $p["alto"]);
        $ca->bindValue(":ancho", $p["ancho"]);
        $ca->bindValue(":text_transform", $p["text_transform"]);
        $ca->bindValue(":ancho_tabla", $p["ancho_tabla"]);
        $ca->bindValue(":margen_superior", $p["margen_superior"]);
        $ca->bindValue(":margen_inferior", $p["margen_inferior"]);
        $ca->bindValue(":margen_derecha", $p["margen_derecha"]);
        $ca->bindValue(":margen_izquierda", $p["margen_izquierda"]);
        $ca->bindValue(":fuente", $p["fuente"]);
        $ca->bindValue(":tamano_fuente", $p["tamano_fuente"]);
        $ca->bindValue(":centrar", $p["centrar"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        if (isset($p["marca_agua"])) {
            $r = $p["marca_agua"];
            $table = "nw_printer_water_mark";
            if ($id != "") {
                $ca->prepareDelete($table, "printer=:id");
                $ca->bindValue(":id", $id);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
            $r["printer"] = $id;
            $fields = Array();
            foreach ($r as $key => $v) {
                if ($key != "id") {
                    $fields[] = $key;
                }
            }
            $ca->prepareInsert($table, implode(",", $fields));
            foreach ($r as $key => $v) {
                if ($key != "id") {
                    $ca->bindValue(":" . $key, $v);
                }
            }
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }

        if (isset($p["datos"])) {
            $table = "nw_printer_data";
            if ($id != "") {
                $ca->prepareDelete($table, "printer=:id");
                $ca->bindValue(":id", $id);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
            for ($i = 0; $i < count($p["datos"]); $i++) {
                $r = $p["datos"][$i];
                if ($db->getDriver() == "MYSQL") {
                    $fields = "printer,nombre,sql_data";
                } else {
                    $fields = "printer,nombre,sql";
                }
                $ca->prepareInsert($table, $fields);
                $ca->bindValue(":printer", $id);
                $ca->bindValue(":nombre", $r["nombre"]);
                if ($db->getDriver() == "MYSQL") {
                    $ca->bindValue(":sql_data", NWUtils::removeSecuritySql($r["sql"]));
                } else {
                    $ca->bindValue(":sql", NWUtils::removeSecuritySql($r["sql"]));
                }
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
        }
        $db->commit();
        return true;
    }

    public static function delete($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_printer_settings", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareDelete("nw_printer_data", "printer=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareDelete("nw_printer_water_mark", "printer=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

}
