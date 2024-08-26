<?php

/* * ***********************************************************************

  Copyright:
  2015 Netwoods.net, http://www.netwoods.net

  Author:
  Andrés Flórez

 * *********************************************************************** */

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

class userDateTime {

    public static function consultaTiempos($users, $fecha) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("tareas_diarias", "*,func_concepto(estado, 'estados_tareas_diarias', 'color') as color, 
                           func_concepto(proyecto, 'projectplan_enc') as proyecto_nom", "publico='SI' and usuario_asignado=:usuario and fecha_final=:fecha_final", "fecha_final, hora_final asc");
        $ca->bindValue(":usuario", $users[0]);
        $ca->bindValue(":fecha_final", $fecha);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $data = $ca->assocAll();
        //return json_encode($data);

        $rta = "";
        $horas_dia = 8;
        $hour = $horas_dia;
        $media = "00";
        $hour_sistem = $horas_dia;
        $rta .= "<select  id='" . $n . "_task' name='" . $n . "' >";

        for ($ib = 0; $ib <= 22; $ib++) {
            if ($hour < 10) {
                $hour = "0" . (int) $hour;
            }
            for ($iz = 0; $iz < count($data); $iz++) {
                $ra = $data[$iz];
                $hora = $hour . ":" . $media;
                if ($ib == 0) {
                    if ($n != "hora_estimada") {
                        $rta .= "<option value=''>00:00</option>";
                    }
                } else {
                    if ($hora != substr($ra["hora_final"], 0, -3)) {
                        $rta .="<option value='" . $hour_sistem . ":" . $media . "'>" . $hour . ":" . $media . "</p>";
                    }
                    if ($media == "30") {
                        if ($hour == 12 && $media == "30") {
                            $hour = 1;
                        } else {
                            $hour++;
                        }
                        $hour_sistem++;
                        $media = "00";
                    } else {
                        $media = "30";
                    }
                }
            }
        }
        $rta .= "</select>";
        return $rta;
    }

    public static function consultaTiemposAll($p) {
        $rta = "";
        $horas_dia = 8;
        $n = "hora_estimada";
        if ($n == "hora_estimada") {
            $horas_dia = 0;
        }
        $hour = $horas_dia;
        $media = "00";
        $hour_sistem = $horas_dia;
        $rta .= "<select  id='" . $n . "_task' name='" . $n . "' >";
        for ($ib = 0; $ib <= 22; $ib++) {
            if ($ib == 0) {
                if ($n != "hora_estimada") {
                    $rta .= "<option value=''>00:00</option>";
                }
            } else {
                $rta .="<option value='" . $hour_sistem . ":" . $media . "'>" . $hour . ":" . $media . "</p>";
                if ($media == "30") {
                    if ($hour == 12 && $media == "30") {
                        $hour = 1;
                    } else {
                        $hour++;
                    }
                    $hour_sistem++;
                    $media = "00";
                } else {
                    $media = "30";
                }
            }
        }
        $rta .= "</select>";
        return $rta;
    }

}

$p = Array();
if (count($_POST["users"]) == 1) {
    echo userDateTime::consultaTiempos($_POST["users"], $_POST["fecha"]);
} else {
    echo userDateTime::consultaTiemposAll($p);
}
?>