<?php

class calendar {

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $flota = null;
        if (isset($p["empresa_o_flota"])) {
            $flota = $p["empresa_o_flota"];
        }
        $where = " empresa=:empresa";
        if (isset($p["permisos"]["filtrar_por_terminal"])) {
            if ($p["permisos"]["filtrar_por_terminal"] === "true" || $p["permisos"]["filtrar_por_terminal"] === true) {
                $where .= " and terminal=:terminal ";
            }
        }
        if (isset($p["permisos"]["filtrar_por_flota"])) {
            if ($p["permisos"]["filtrar_por_flota"] === "true" || $p["permisos"]["filtrar_por_flota"] === true) {
                $where .= " and flota_id=:flota ";
            }
        }
        if (isset($p["conductor"]) && $p["conductor"] != "") {
            $campos = "placa,conductor_usuario,conductor_celular,conductor,cliente_nombre,bodega_text";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["conductor"], true);
        }
        if (isset($p["fecha_inicial"]) && isset($p["fecha_final"])) {
            if ($p["fecha_inicial"] != "" && $p["fecha_final"] != "") {
                $where .= " and fecha between :fecha_inicial and :fecha_final";
                $ca->bindValue(":fecha_inicial", $p["fecha_inicial"]);
                $ca->bindValue(":fecha_final", $p["fecha_final"]);
            }
        }
        $where .= " order by id desc";
//        $where .= " order by a.fecha desc,a.hora asc";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("edo_servicios", "usuario,id,origen,destino,fecha,hora,placa,conductor,conductor_usuario,conductor_celular,cliente_nombre,estado,observaciones_servicio", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":flota", $flota);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

}
