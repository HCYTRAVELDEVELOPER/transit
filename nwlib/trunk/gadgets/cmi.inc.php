<?php

/* * ***********************************************************************

  Copyright:
  2013 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

class cmi {

    public static function executeQuery($data) {
        //session::check();
        $p = nwMaker::getData($data);

        $db = NWDatabase::database();
        $db->setModule("NW_CMI");
        $ca = new NWDbQuery($db);

        $ca->prepareSelect("nw_cmi_enc", "query", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        if ($ca->size() <= 0) {
            NWJSonRpcServer::error("No se encontró el query requerido para el id {$p["id"]}");
            return;
        }

        $ca->next();
        $r = $ca->assoc();

        $p["query"] = str_replace("\r", "", $r["query"]);
        $p["query"] = str_replace("\n", "", $p["query"]);
        $p["query"] = trim(preg_replace('/\s\s+/', ' ', $p["query"]));

        $ca->setSaveInRegistroSelect(true);

        $ca->prepare($p["query"]);
        if (isset($p["filters"])) {
            for ($i = 0; $i < count($p["filters"]); $i++) {
                $v = $p["filters"][$i];
                $ca->bindValue(":" . $v["clave"], $v["valor"]);
            }
        }
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":pais", $p["pais"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function executeFilters($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_cmi_det", "*", "enc=:enc and tipo='FILTER'");
        $ca->bindValue(":enc", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function removeScoreCard($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_cmi_enc", "id=:id");
        $ca->bindValue(":id", $p["select_cmi"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareDelete("nw_cmi_det", "enc=:enc");
        $ca->bindValue(":enc", $p["select_cmi"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function selectScoreCard($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $si = session::info();
        $ca = new NWDbQuery($db);

        $ca->prepareUpdate("nw_cmi_enc", "selected=false", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $ca->prepareUpdate("nw_cmi_enc", "selected", "id=:id");
        $ca->bindValue(":id", $p["select_cmi"]);
        $ca->bindValue(":selected", true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $db->commit();
        return true;
    }

    public static function populateScoreCards($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $perfil = "";
        if (isset($p["profile"]) && $p["profile"] !== "") {
            $perfil = " or perfiles=:perfil ";
        }
        $ca->prepareSelect("nw_cmi_enc", "id, nombre, table_method, classname, is_main_form, serial_column, table_main, label, part, usuario, fecha, empresa, "
                . "json_fields, rotulos_fila, rotulos_columna, valores, filtros, tipo_grafico, privado, perfiles, selected, usuarios_autorizados, descripcion",
                "empresa=:empresa and (privado = false or usuario=:usuario or usuarios_autorizados like '%:usuario%' {$perfil}) order by UPPER(nombre) ");
        $ca->bindValue(":usuario", $p["user"]);
        $ca->bindValue(":empresa", $p["company"]);
        $ca->bindValue(":perfil", $p["profile"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $rta = $ca->assocAll();
        return $rta;
    }

    public static function saveListAsCmi($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();

        $si = session::info();

        $usuarios_autorizados = Array();

        if (isset($p["usuarios"])) {
            if (is_countable($p["usuarios"])) {
                for ($ia = 0; $ia < count($p["usuarios"]); $ia++) {
                    $ra = Array();
                    $ra["usuario"] = $p["usuarios"][$ia]["usuario"];
                    $ra["id"] = $p["usuarios"][$ia]["id"];
                    $ra["nombre"] = $p["usuarios"][$ia]["nombre"];
                    $usuarios_autorizados[] = $ra;
                }
            }
        }

        $usuarios_autorizados = json_encode($usuarios_autorizados);

        $ca = new NWDbQuery($db);
        $ca->clean_html(false);
        $ca->haveAdvancedSecurity(false);
        if (isset($p["id"]) && $p["id"] !== "") {
            $fields = "nombre,usuarios_autorizados,perfiles,privado,descripcion";
            $ca->prepareUpdate("nw_cmi_enc", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        } else {
            $id = $ca->getNextId($ca, "nw_cmi_enc", false);
            $fields = "id,nombre,table_method,classname,is_main_form,part,
                serial_column,table_main,label,usuario,fecha,empresa,
                query,valores,rotulos_fila,rotulos_columna,tipo_grafico,privado,perfiles,usuarios_autorizados,descripcion";
            $ca->prepareInsert("nw_cmi_enc", $fields);
            $ca->bindValue(":id", $id);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":table_method", $p["tableMethod"]);

        $part = "";
        $arr = explode(".", $p["classname"]);
        if (count($arr) >= 2) {
            $part = $arr[0];
        }

        $ca->bindValue(":part", $part);
        $ca->bindValue(":classname", $p["classname"]);
        $ca->bindValue(":is_main_form", $p["isMainForm"]);
        $ca->bindValue(":serial_column", $p["serialColumn"]);
        $ca->bindValue(":table_main", $p["table"]);
        $ca->bindValue(":label", $p["label"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":usuarios_autorizados", $usuarios_autorizados);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":query", $p["query"]);
        $ca->bindValue(":valores", json_encode($p["valores"]));
        $ca->bindValue(":rotulos_fila", json_encode($p["rotulos_fila"]));
        $ca->bindValue(":rotulos_columna", json_encode($p["rotulos_columna"]));
        $ca->bindValue(":tipo_grafico", $p["tipo_grafico"]);
        $ca->bindValue(":privado", $p["privado"]);
        $ca->bindValue(":perfiles", $p["perfiles"]);
        $ca->bindValue(":descripcion", isset($p["descripcion"]) ? $p["descripcion"] : "");
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        if (isset($p["filters"])) {
            foreach ($p["filters"] as $key => $value) {
                if (!is_array($p["filters"][$key])) {
                    if ($value != null) {
                        $ca->prepareInsert("nw_cmi_det", "enc,tipo,valor,clave,fecha,usuario,empresa");
                        $ca->bindValue(":enc", $id);
                        $ca->bindValue(":tipo", "FILTER");
                        $ca->bindValue(":valor", $value);
                        $ca->bindValue(":clave", $key);
                        $ca->bindValue(":fecha", NWUtils::getDate($db));
                        $ca->bindValue(":usuario", $si["usuario"]);
                        $ca->bindValue(":empresa", $si["empresa"]);
                        if (!$ca->exec()) {
                            $db->rollback();
                            NWJSonRpcServer::error($ca->lastErrorText());
                        }
                    }
                } else {
                    if ($value != null) {
                        $ca->prepareInsert("nw_cmi_det", "enc,tipo,valor,clave,fecha,usuario,empresa");
                        $ca->bindValue(":enc", $id);
                        $ca->bindValue(":tipo", "FILTER");
                        $ca->bindValue(":valor", json_encode($value));
                        $ca->bindValue(":clave", $key);
                        $ca->bindValue(":fecha", NWUtils::getDate($db));
                        $ca->bindValue(":usuario", $si["usuario"]);
                        $ca->bindValue(":empresa", $si["empresa"]);
                        if (!$ca->exec()) {
                            $db->rollback();
                            NWJSonRpcServer::error($ca->lastErrorText());
                        }
                    }
                }
            }
        }
        $db->commit();
        return true;
    }
}

?>