<?php

class locationBackground {

    public static function saveLocation($p) {
        error_log("class::locationBackground:::save:::start data location");
//        error_log(json_encode($p));
        
        $id_usuario = $p["id_usuario"];
        $usuario = $p["usuario"];
        $empresa = $p["empresa"];
        $latitud = $p["lat"];
        $longitud = $p["lon"];
        $fecha = $p["z_fromlib_fecha_actual_navigator_cliente"];
        $hora = $p["z_fromlib_hora_actual_navigator_cliente"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("pv_clientes", "latitud,longitud", "empresa=:empresa and usuario=:usuario and perfil=:perfil");
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $empresa);
        $ca->bindValue(":usuario", $empresa);
        $ca->bindValue(":latitud", $latitud, true, true);
        $ca->bindValue(":longitud", $longitud, true, true);
        if (!$ca->exec()) {
            nwMaker::error($ca->lastErrorText(), true);
            return false;
        }

        if (isset($p["data_service"])) {
            $a = Array();
            $a["latitud"] = $latitud;
            $a["longitud"] = $longitud;
            $a["latitudEnd"] = $latitud;
            $a["longitudEnd"] = $longitud;
            $a["id_usuario"] = $id_usuario;
            $a["usuario"] = $usuario;
            $a["metros"] = 0;
            $a["id_servicio"] = $p["data_service"]["id"];
            $a["tipo"] = $p["tipo"];
            $a["z_fromlib_fecha_actual_navigator_cliente"] = $fecha;
            $a["z_fromlib_hora_actual_navigator_cliente"] = $hora;
            $a["empresa"] = $empresa;
            if (isset($p["placa"])) {
                $a["placa"] = $p["placa"];
            }
            servicios_conductor::saveRecorrido($a);
        } else
        if (isset($p["placa"])) {
            $a = Array();
            $a["latitud"] = $latitud;
            $a["longitud"] = $longitud;
            $a["latitudEnd"] = $latitud;
            $a["longitudEnd"] = $longitud;
            $a["id_usuario"] = $id_usuario;
            $a["usuario"] = $usuario;
            $a["z_fromlib_fecha_actual_navigator_cliente"] = $fecha;
            $a["z_fromlib_hora_actual_navigator_cliente"] = $hora;
            $a["empresa"] = $empresa;
            $a["placa"] = $p["placa"];
            servicios_conductor::saveRecorrido($a);
        }
        error_log("class::locationBackground:::save:::End data location");
        return true;
    }
}
