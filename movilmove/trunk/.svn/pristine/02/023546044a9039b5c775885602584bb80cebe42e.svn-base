<?php

class detalle {

    public static function consulta($data) {
        $p = nwMaker::getData($data);
//        print_r($p);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = " reservado_text=:reservado_text and usuario=:usuario order by id desc";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":reservado_text", $p["tipo"] == "ahora" ? "NO" : "SI");
        $ca->bindValue(":usuario", $si["usuario"]);
//        print_r($ca->preparedQuery());
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        $servicios["list"] = $ca->assocAll();
        $where = " reservado_text=:reservado_text and usuario=:usuario order by id desc";
        $ca->prepareSelect("edo_servicios", "*", $where);
        $ca->bindValue(":reservado_text", $p["tipo"] == "ahora" ? "SI" : "NO");
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            return "Ha ocurrido un error! Log: " . $ca->lastErrorText();
        }
        $servicios["label"] = count($ca->assocAll());
//        print_r($ca->assocAll());
        return $servicios;
    }

}
