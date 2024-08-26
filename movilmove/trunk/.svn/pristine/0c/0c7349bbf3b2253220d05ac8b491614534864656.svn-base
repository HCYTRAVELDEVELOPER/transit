<?php

class api_movilmove {

    public static function actualizaGuiaSitca($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("edo_servicio_parada", "estado", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":estado", $p["estado"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $li = Array();
        $li["modulo"] = "app_driver:::cambiaEstadoParada";
        $li["accion"] = "Parada - Cambio de estado {$p["estado"]}";
        $li["comentarios"] = "#{$p["id"]} (id parada)";
        if (isset($p["id_servicio"])) {
            $li["id_servicio"] = $p["id_servicio"];
        }
        $li["usuario"] = $p["usuario"];
        $li["empresa"] = $p["empresa"];
        $li["perfil"] = 2;
        if (isset($p["latitud"])) {
            $li["latitud"] = $p["latitud"];
        }
        if (isset($p["longitud"])) {
            $li["longitud"] = $p["longitud"];
        }
        $li["all_data"] = $p;
        lineTime::save($li);
        if ($p["usaSitca"] === "SI") {
            return api_sitca::envioEstado($p);
        }
        return true;
    }

    public static function consultaViajes($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "";
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_fin"] != "") {
                $where .= " CAST(a.fecha as date) BETWEEN :fecha_inicial and :fecha_fin ";
                $ca->bindValue(":fecha_inicial", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_fin"]);
            }
        }
        $where .= " order by e.id,a.id asc ";
        $ca->prepareSelect("edo_servicios a left join empresas e on(a.empresa=e.id)", "a.placa,e.razon_social,e.nit,e.id", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $res = $ca->assocAll();
        return $res;
    }

    public static function consultaUsuarios($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "1=1";
        if (isset($p["filters"])) {
            if ($p["filters"]["fecha_inicial"] != "" && $p["filters"]["fecha_fin"] != "") {
//                $where .= " a.fecha::date BETWEEN :fecha_inicial and :fecha_fin ";
                $ca->bindValue(":fecha_inicial", $p["filters"]["fecha_inicial"]);
                $ca->bindValue(":fecha_fin", $p["filters"]["fecha_fin"]);
            }
        }
        $where .= " order by e.id,u.id asc ";
        $ca->prepareSelect("usuarios u left join empresas e on(u.empresa=e.id)", " DISTINCT u.usuario,u.email,e.razon_social,e.nit,e.id ", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $res = $ca->assocAll();
        return $res;
    }
}
