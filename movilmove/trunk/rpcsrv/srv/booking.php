<?php

class booking {

//   "https://warpdrive.staging.transferz.com"; //pruebas
//  "https://warpdrive.transferz.com"; //producción

    public static function updateStatusTravel($data) {
        $p = nwMaker::getData($data);
        if (!isset($p["creado_por_pc"])) {
            return false;
        }
        if ($p["creado_por_pc"] != "Booking") {
            return false;
        }
        if (!nwMaker::evalueData($p["config"]["booking_key"])) {
            return false;
        }
        if (!nwMaker::evalueData($p["config"]["booking_url_endpoint"])) {
            return false;
        }
        if (!nwMaker::evalueData($p["booking_id_real_journey"])) {
            return false;
        }
        $key = $p["config"]["booking_key"];
        $url_t = $p["config"]["booking_url_endpoint"];
        $id = $p["booking_id_real_journey"];
        $estado = $p["estado_nuevo"];

        if ($estado == "EN_RUTA") {
//        DRIVER_UNDERWAY // CONDUCTOR_EN RUTA
            $url = "{$url_t}/transfercompanies/journeys/{$id}/status/driver-underway";
        } else
        if ($estado == "EN_SITIO") {
//        DRIVER_ARRIVED // CONDUCTOR_LLEGADO
            $url = "{$url_t}/transfercompanies/journeys/{$id}/status/driver-arrived";
        } else
        if ($estado == "ABORDO") {
//        IN_PROGRESS // EN CURSO
            $url = "{$url_t}/transfercompanies/journeys/{$id}/status/in-progress";
        } else
        if ($estado == "LLEGADA_DESTINO") {
//        COMPLETED // TERMINADA
            $url = "{$url_t}/transfercompanies/journeys/{$id}/complete";
        } else {
            return false;
        }

        $ch = curl_init();
//        $headers = [
//            'Content-Type: application/json',
//            'X-API-Key: ' . $key
//        ];
        $headers = [
            'Accept: application/json',
            'Content-Type: application/json',
            'X-API-Key: ' . $key
        ];
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
//        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{"latitude": ' . $p["latitude"] . ',"longitude": ' . $p["longitude"] . '}');
        $result = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        $response = $result;
        $ra = json_decode($response, true);

        $li = Array();
        $li["id_servicio"] = $id;
        $li["modulo"] = "Booking:::cambio estado.";
        $li["accion"] = "Cambio de estado Booking";
        $li["comentarios"] = "Cambio de estado a {$estado}";
        $li["empresa"] = $p["empresa"];
        $li["all_data"] = $p;
        lineTime::save($li);

        return $ra;
    }

    public static function declineTravel($data) {
//        https://developers.transferz.com/docs/accept-or-decline-an-offer
        $p = nwMaker::getData($data);
        $key = $p["key"];
        $id = $p["id"];
        $url_t = $p["url_endpoint"];
        $url = "{$url_t}/transfercompanies/offers/{$id}/decline";

        $reason = $p["reason"];
        $description = $p["description"];

        $ch = curl_init();
        $headers = [
            'Content-Type: application/json',
            'X-API-Key: ' . $key
        ];
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, '{"reason": "' . $reason . '","description": "' . $description . '"}');
        $result = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        $response = $result;
        $ra = json_decode($response, true);
        return $ra;
    }

    public static function acceptTravel($data) {
        $p = nwMaker::getData($data);
        $key = $p["key"];
        $id = $p["id"];
        $meetingPointId = "";
        if (isset($p["meetingPointId"])) {
            $meetingPointId = $p["meetingPointId"];
        }
        $meetingPointIdType = "";
        if (isset($p["meetingPointIdType"])) {
            $meetingPointIdType = $p["meetingPointIdType"];
        }
        $url_t = $p["url_endpoint"];
//        https://developers.transferz.com/docs/accept-or-decline-an-offer
        $url = "{$url_t}/transfercompanies/offers/{$id}/accept";

        $ch = curl_init();
        $headers = [
            'Accept: application/json',
            'Content-Type: application/json',
            'X-API-Key: ' . $key
        ];
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, 1);
//        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        if ($meetingPointId !== "" && $meetingPointIdType !== "") {
            curl_setopt($ch, CURLOPT_POSTFIELDS, '{"meetingPointId": ' . $meetingPointId . ',"type": "' . $meetingPointIdType . '"}');
        }
        $result = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        $response = $result;
        $ra = json_decode($response, true);

        $p["booking_id_journey"] = $ra["code"];
        $p["booking_id_real_journey"] = $ra["id"];

        $ex = self::existTravelByCode($ra);
        if ($ex != false) {
            $ra["id_booking_api"] = $ex["booking_id_real_journey"];
        }

        $rta = self::saveInMovilmoveTravel($p, $ra);
        $rta = self::saveLine($p, $ra);

        $li = Array();
        $li["modulo"] = "back:::booking";
        $li["accion"] = "Acepta viaje";
        $li["comentarios"] = $response;
        $li["id_servicio"] = $rta;
        $li["all_data"] = $p;
        $line = lineTime::save($li);
        if ($line !== true) {
            return $line;
        }
        return $ra;
    }

    public static function existTravelByCode($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $empresa = nwMaker::getDataSESSION($p, "empresa");
        $ca->prepareSelect("edo_servicios", "id,booking_id_real_journey", "booking_id_journey=:booking_id_journey and empresa=:empresa order by id desc limit 1");
        $ca->bindValue(":booking_id_journey", $p["code"]);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() > 0) {
            return $ca->flush();
        }
        return false;
    }

    public static function saveInMovilmoveTravel($p, $ra) {
        $r = Array();
        //valores y encabezado
        if (isset($ra["id_booking_api"])) {
            $r["id_booking_api"] = $ra["id_booking_api"];
        }
        if (isset($p["booking_id_journey"])) {
            $r["booking_id_journey"] = $p["booking_id_journey"];
        }
        if (isset($p["booking_id_real_journey"])) {
            $r["booking_id_real_journey"] = $p["booking_id_real_journey"];
        }
        if (isset($ra["travellerInfo"])) {
            if (isset($ra["travellerInfo"]["flightNumber"]) && nwMaker::evalueData($ra["travellerInfo"]["flightNumber"])) {
                $r["vuelo_numero"] = $ra["travellerInfo"]["flightNumber"];
            }
        }
        if (isset($p["actualiza_valor"]) && $p["actualiza_valor"] == false) {
            
        } else {
            $r["valor_viaje"] = $ra["fareSummary"]["includingVat"];
        }
        $r["valor_viaje_booking"] = $ra["fareSummary"]["includingVat"];
        $r["moneda"] = $ra["fareSummary"]["currency"];
        if (isset($p["terminal"])) {
            $r["terminal"] = $p["terminal"];
        }
        $r["observaciones_servicio"] = "Vehículo: {$ra["vehicleCategory"]} - Code: {$ra["code"]}";

        if (isset($ra["addOns"])) {
//            if (nwMaker::evalueData($ra["addOns"])) {
            for ($i = 0; $i < count($ra["addOns"]); $i++) {
                $r["observaciones_servicio"] .= " " . $ra["addOns"][$i];
            }
//            }
        }

        $r["tiempo_estimado"] = $ra["duration"];
        $r["total_metros"] = $ra["distance"];
        //tiempo
        $r["fecha"] = explode("T", $ra["pickupTime"]["localTime"])[0];
        $r["hora"] = explode("T", $ra["pickupTime"]["localTime"])[1];
        //info user app
        $r["usuario"] = null;
        $r["usuario_text"] = $ra["travellerInfo"]["email"];
        $r["nombre_usuario"] = $ra["travellerInfo"]["firstName"] . " " . $ra["travellerInfo"]["lastName"];
        $r["celular_usuario"] = $ra["travellerInfo"]["phone"];

//        $r["bodega"] = $p["form"]["cliente"];
//        $r["bodega_text"] = $p["form"]["cliente_array"]["nombre"];
        //ubicación origen
        $r["latitudOri"] = $ra["pickup"]["latitude"];
        $r["longitudOri"] = $ra["pickup"]["longitude"];
        $r["origen"] = $ra["pickup"]["resolvedAddress"];
//        $r["ciudad_origen"] = $ra["pickup"]["fullResolvedAddress"]["region"];
        $r["ciudad_origen"] = $ra["pickup"]["resolvedAddress"];
        if (isset($ra["pickup"]["fullResolvedAddress"]["region"]) && nwMaker::evalueData($ra["pickup"]["fullResolvedAddress"]["region"])) {
            $r["ciudad_origen"] = $ra["pickup"]["fullResolvedAddress"]["region"];
        }
//        $r["ciudad_conductores_id"] = $p["form"]["ciudad"];
//        $r["ciudad_conductores_nombre"] = $p["form"]["ciudad_text"];
        //ubicación destino
        $r["latitudDes"] = $ra["dropoff"]["latitude"];
        $r["longitudDes"] = $ra["dropoff"]["longitude"];
        $r["destino"] = $ra["dropoff"]["resolvedAddress"];
        $r["ciudad_destino"] = $ra["dropoff"]["resolvedAddress"];
        if (isset($ra["dropoff"]["fullResolvedAddress"])) {
            $r["ciudad_destino"] = $ra["dropoff"]["fullResolvedAddress"]["region"];
            if (!nwMaker::evalueData($ra["dropoff"]["fullResolvedAddress"]["region"])) {
                $r["ciudad_destino"] = $ra["dropoff"]["resolvedAddress"];
            }
        }
        //driver info
//        if ($p["conductor"] != false) {
//            $r["conductor"] = $p["conductor"]["id"];
//            $r["conductor_text"] = $p["conductor"]["nombre"];
//            $r["usuario_cond"] = $p["conductor"]["usuario_cliente"];
//            $r["placa"] = $p["conductor"]["placa"];
//            $r["marca"] = $p["conductor"]["marca"];
//            $r["vehiculo_text"] = $p["conductor"]["marca_text"];
//            $r["vehiculo"] = $p["conductor"]["id"];
//            $r["tipo_servicio"] = $p["conductor"]["servicios_driver"][0]["id"];
//            $r["subcategoria_servicio"] = $p["conductor"]["servicios_driver"][0]["id"];
//            $r["subcategoria_servicio_text"] = $p["conductor"]["servicios_driver"][0]["nombre"];
//            $r["id_tarifa"] = $p["conductor"]["servicios_driver"][0]["id"];
//        }
        //NUEVO
        if (!isset($ra["id_booking_api"])) {
            $r["creado_por_pc"] = "Booking";
            $r["servicio_para"] = "reservado";
            $r["tipo_tarifa"] = "trayecto";
            $r["estado"] = "SOLICITUD";
            $r["sentido"] = "EJECUTIVO";
            $r["fecha_asignacion_para_conductor"] = date("Y-m-d H:i:s");
            $r["code_verifi_service"] = rand(1000, 9999);
            $r["code_verifi_service_fin"] = rand(1000, 9999);
        }
        if (isset($ra["estado_nuevo"])) {
            $r["estado"] = $ra["estado_nuevo"];
        }

//        $pas = Array();
//        $pas["direccion"] = $p["form"]["direccion_b"];
//        $pas["latitud_parada"] = $p["form"]["direccion_b_latitud"];
//        $pas["longitud_parada"] = $p["form"]["direccion_b_longitud"];
//        $pas["ciudad"] = $p["form"]["direccion_b_ciudad"];
//        $pas["nombre_pasajero"] = $r["nombre_usuario"];
//        $pas["telefono"] = $r["celular_usuario"];
//        $pas["descripcion_carga"] = "Destino final";
//        $pas["tipo"] = "DESTINO_FINAL_EJECUTIVO";
//            $p["pasajeros"][count($p["pasajeros"])] = $pas;
//        $pasajeros = Array();
//        for ($i = 0; $i < $ra["travellerInfo"]["passengerCount"]; $i++) {
//        for ($i = 0; $i < $totalParadas; $i++) {
//            $pasajeros[$i] = Array();
//            $pasajeros[$i]["direccion_origen"] = $p["pasajeros"][$i]["direccion"];
////                $pasajeros[$i]["direccion_destino"] = $cliente_direccion;
//            $pasajeros[$i]["direccion_destino"] = $destino_direccion;
////                if ($sentido == "SALIDA") {
////                    $pasajeros[$i]["direccion_origen"] = $cliente_direccion;
////                    $pasajeros[$i]["direccion_destino"] = $p["pasajeros"][$i]["direccion"];
////                }
//        }
        $r["total_pasajeros"] = $ra["travellerInfo"]["passengerCount"];
//        $r["parada"] = $pasajeros;
        $rta = servicios_admin::saveServicio($r);
        return $rta;
    }

    public static function acceptOrDecline($data) {
        $p = nwMaker::getData($data);
        if ($p["type"] == "accept") {
            return self::acceptTravel($data);
        }
        if ($p["type"] == "decline") {
            return self::declineTravel($data);
        }
        return false;
    }

    public static function getavailableoffers($data) {
//https://developers.transferz.com/reference/getavailableoffers-1
        $p = nwMaker::getData($data);
        $key = $p["key"];

        $url_t = $p["url_endpoint"];

        $url = "{$url_t}/transfercompanies/offers/available/all";

        $ch = curl_init();
        $headers = [
            'Accept: application/json',
            'X-API-Key: ' . $key
        ];
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
//        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        $response = $result;
        $r = json_decode($response, true);

        $rta = Array();
        $rta["offers"] = $r;
        return $rta;
    }

    public static function cancelledoffers($data) {
        $p = nwMaker::getData($data);
        $url_t = $p["url_endpoint"];
        $key = $p["key"];

//      'https://warpdrive.transferz.com/transfercompanies/journeys?includedStatuses=CANCELLED_FREE&includedStatuses=CANCELLED_WITH_COSTS&includedStatuses=BOOKER_CANCELLED&includedStatuses=SUPPLIER_CANCELLED&excludedStatuses=COMPLETED&excludedStatuses=CANCELLED_FREE&excludedStatuses=CANCELLED_WITH_COSTS&excludedStatuses=BOOKER_CANCELLED&excludedStatuses=SUPPLIER_CANCELLED&page=0&size=10&sort=pickup%3Basc' \ 
//        $url = "{$url_t}/transfercompanies/journeys?page=0&size=10";


        $page = "page=0";
        if (isset($p["filters"]["pageActual"]) && $p["filters"]["pageActual"] != "") {
            $page = "page={$p["filters"]["pageActual"]}";
        }
        $journeyCode = "";
        if (isset($p["filters"]["journeyCode"]) && $p["filters"]["journeyCode"] != "") {
            $journeyCode = "&journeyCode={$p["filters"]["journeyCode"]}";
        }
        $size = "&size=10";
        if (isset($p["filters"]["size"]) && $p["filters"]["size"] != "") {
            $size = "&size={$p["filters"]["size"]}";
        }
        $sort = "&sort=pickup%3Basc";
        if (isset($p["filters"]["sort"]) && $p["filters"]["sort"] != "") {
            $sort = "&sort={$p["filters"]["sort"]}";
        }
        $pickupDateAfter = "";
        if (isset($p["filters"]["pickupDateAfter"]) && $p["filters"]["pickupDateAfter"] != "") {
            $f = str_replace(" ", "T", $p["filters"]["pickupDateAfter"]);
//            $pickupDateAfter = "&pickupDateAfter={$f}:00";
        }
        $includesStatus = "&includedStatuses=CANCELLED_FREE&includedStatuses=CANCELLED_WITH_COSTS&includedStatuses=BOOKER_CANCELLED&includedStatuses=SUPPLIER_CANCELLED";
//        $excludesStatus = "&excludedStatuses=COMPLETED&excludedStatuses=CANCELLED_FREE&excludedStatuses=CANCELLED_WITH_COSTS&excludedStatuses=BOOKER_CANCELLED&excludedStatuses=SUPPLIER_CANCELLED";
        $url = "{$url_t}/transfercompanies/journeys?{$page}{$size}{$sort}{$includesStatus}{$journeyCode}{$pickupDateAfter}";

//        $url = "{$url_t}/transfercompanies/journeys?page=0&size=20&sort=pickup%3Basc{$includesStatus}";

        $ch = curl_init();
        $headers = [
            'Accept: application/json',
            'X-API-Key: ' . $key
        ];
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        $response = $result;
        $r = json_decode($response, true);

        $res = Array();
        $res["results"] = Array();
        $total = count($r["results"]);
        if ($total > 0) {
            $si = session::getInfo();
            $terminal = $si["terminal"];
            for ($i = 0; $i < $total; $i++) {
                $ra = $r["results"][$i];

//                if ($ra["status"] == "CANCELLED_FREE" || $ra["status"] == "CANCELLED_WITH_COSTS") {
                if (explode("T", $ra["pickupTime"]["localTime"])[0] >= date("Y-m-d")) {

                    $ra["id_booking_api"] = $ra["id"];

                    $p["booking_id_journey"] = $ra["code"];
                    $p["booking_id_real_journey"] = $ra["id"];

                    $ra["terminal"] = $terminal;

                    $ra["estado_nuevo"] = $ra["status"];

                    $rta = self::saveInMovilmoveTravel($p, $ra);

                    $rta = self::saveLine($p, $ra);
                }
                $res["results"][] = $ra;
//                }
            }
        }
        return $res;
    }

    public static function actualizacionesoffers($data) {
        $p = nwMaker::getData($data);

        $key = $p["key"];
        $url_t = $p["url_endpoint"];

        $page = "page=0";
        if (isset($p["filters"]["pageActual"]) && $p["filters"]["pageActual"] != "") {
            $page = "page={$p["filters"]["pageActual"]}";
        }
        $journeyCode = "";
        if (isset($p["filters"]["journeyCode"]) && $p["filters"]["journeyCode"] != "") {
            $journeyCode = "&journeyCode={$p["filters"]["journeyCode"]}";
        }
        $size = "&size=10";
        if (isset($p["filters"]["size"]) && $p["filters"]["size"] != "") {
            $size = "&size={$p["filters"]["size"]}";
        }
        $sort = "&sort=pickup%3Basc";
        if (isset($p["filters"]["sort"]) && $p["filters"]["sort"] != "") {
            $sort = "&sort={$p["filters"]["sort"]}";
        }
        $pickupDateAfter = "";
        if (isset($p["filters"]["pickupDateAfter"]) && $p["filters"]["pickupDateAfter"] != "") {
//            $f = str_replace(" ", "T", $p["filters"]["pickupDateAfter"]);
//            $pickupDateAfter = "&pickupDateAfter={$f}:00";
        }
        $excludesStatus = "&excludedStatuses=COMPLETED&excludedStatuses=CANCELLED_FREE&excludedStatuses=CANCELLED_WITH_COSTS&excludedStatuses=BOOKER_CANCELLED&excludedStatuses=SUPPLIER_CANCELLED";
        $url = "{$url_t}/transfercompanies/journeys?{$page}{$size}{$sort}{$excludesStatus}{$journeyCode}{$pickupDateAfter}";
//  'https://warpdrive.transferz.com/transfercompanies/journeys?excludedStatuses=COMPLETED&excludedStatuses=CANCELLED_FREE&excludedStatuses=CANCELLED_WITH_COSTS&excludedStatuses=BOOKER_CANCELLED&excludedStatuses=SUPPLIER_CANCELLED&page=0&size=10&sort=pickup%3Basc' \




        $ch = curl_init();
        $headers = [
            'Accept: application/json',
            'X-API-Key: ' . $key
        ];
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_POST, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        $response = $result;
        $r = json_decode($response, true);

        $res = Array();

        $total = 0;
        if (isset($r["results"])) {
            if (is_countable($r["results"])) {
                $total = count($r["results"]);
            }
        }
        if ($total > 0) {
            $si = session::getInfo();
            $terminal = $si["terminal"];

            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);

            for ($i = 0; $i < $total; $i++) {
                $ra = $r["results"][$i];

                $ca->prepareSelect("edo_booking_journeys_accepted", "id", "booking_id={$ra["id"]} ");
                if (!$ca->exec()) {
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                    return false;
                }
                if ($ca->size() == 0) {
                    continue;
                }

//                if (explode("T", $ra["pickupTime"]["localTime"])[0] >= date("Y-m-d")) {
                $ra["id_booking_api"] = $ra["id"];

                $p["booking_id_journey"] = $ra["code"];
                $p["booking_id_real_journey"] = $ra["id"];

                $ra["terminal"] = $terminal;

                $p["actualiza_valor"] = false;
                $rta = self::saveInMovilmoveTravel($p, $ra);

                $rta = self::saveLine($p, $ra);

                $res[] = $ra;
//                }
            }
        }
//        return $r;

        $resp = Array();
        $resp["results"] = $res;
        return $resp;
    }

    public static function saveLine($p, $ra) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getDataSESSION($p, "usuario");
        $empresa = nwMaker::getDataSESSION($p, "empresa");

        $fecha = explode("T", $ra["pickupTime"]["localTime"])[0];
        $hora = explode("T", $ra["pickupTime"]["localTime"])[1];

        $fields = "fecha_actualizacion,json,booking_code,fecha_servicio,estado";
        $id_booking_api = null;
        if (isset($ra["id_booking_api"]) && nwMaker::evalueData($ra["id_booking_api"])) {
            $id_booking_api = $ra["id_booking_api"];
            $ca->prepareUpdate("edo_booking_journeys_accepted", $fields, "booking_id=':id_booking_api'");
        } else {
            $fields .= ",fecha_creacion,usuario,empresa,booking_id";
            $ca->prepareInsert("edo_booking_journeys_accepted", $fields);
        }
        $ca->bindValue(":id_booking_api", $id_booking_api);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":fecha_creacion", date("Y-m-d H:i:s"));
        $ca->bindValue(":fecha_actualizacion", date("Y-m-d H:i:s"));
        $ca->bindValue(":fecha_servicio", $fecha . " " . $hora);
        $ca->bindValue(":json", json_encode($ra));
        $ca->bindValue(":booking_id", $ra["id"]);
        $ca->bindValue(":booking_code", $ra["code"]);
        $ca->bindValue(":estado", $ra["status"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }
}
