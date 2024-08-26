<?php

class master {

    static $idCallWebRTC = false;

    public static function checkCeros($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("nw_list_edit", "usuario", "id=27");
        $ca->bindValue(":usuario", "0087542", true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function testSanitco($p) {
        session::check();
        $db = new NWDatabase("PGSQL");
        $db->setHostName("localhost");
        $db->setDatabaseName("app_sanitco_alter");
        $db->setUserName("lady");
        $db->setPassword("ladyg23");
        $db->open_();
        $ca = new NWDbQuery($db);
        $p["table"] = $p["table"];
        $ca->prepare("SELECT column_name as nombre,data_type as field_type
                    FROM information_schema.columns cols
                    WHERE
                    cols.table_name = :table 
                    order by column_name, cols.ordinal_position");
        $ca->bindValue(":table", $p["table"], true);
        if (!$ca->exec()) {
            return "Error ejecutando la consulta: " . $ca->lastErrorText();
        }
        $columns = $ca->assocAll();
        $cols = "";
        $values = "";
        $arrCols = Array();
        for ($i = 0; $i < count($columns); $i++) {
            $cols .= $columns[$i]["nombre"];
            $values .= ":" . $columns[$i]["nombre"];
            $arrCols[$columns[$i]["nombre"]] = $columns[$i]["field_type"];
            $u = count($columns) - 1;
            if ($i <> $u) {
                $cols .= ",";
                $values .= ",";
            }
        }
        //return $arrCols;
        $id_table = master::getMaxId($p["table"], $db, false);
        $id_table++;
        $ca->prepareInsert($p["table"], $cols, $values);
        foreach ($p["data"] as $key => $v) {
            if ($key != "id") {
                if ($key == "ingreso") {
                    $ca->bindValue(":ingreso", $p["keys"]["foreginkey"]);
                } else if ($key == "num_ingreso") {
                    $ca->bindValue(":num_ingreso", $p["keys"]["foreginkey"]);
                } else {
                    if ($arrCols[$key] == 'timestamp without time zone' || $arrCols[$key] == 'time without time zone' || $arrCols[$key] == 'date') {
                        $ca->bindValue(":" . $key, $v, true, true);
                    } else if ($arrCols[$key] == 'integer' || $arrCols[$key] == 'double precision') {
                        $ca->bindValue(":" . $key, $v == "" ? 0 : $v);
                    } else if ($arrCols[$key] == 'boolean') {
                        $ca->bindValue(":" . $key, $v == "" || $v == null || $v == "f" || $v == "false" ? 'f' : 't');
                    } else {
                        $ca->bindValue(":" . $key, $v, true);
                    }
                }
            } else {
                $ca->bindValue(":id", $id_table);
            }
        }
        if (!$ca->exec()) {
            return "Error ejecutando la consulta: " . $ca->lastErrorText();
        }
        return $id_table;
    }

    public static function checkPoints($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("nw_list_edit", "usuario", "id=66");
        $ca->bindValue(":usuario", $p["data"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getHTTP_USER_AGENT() {
        if (!isset($_SERVER['HTTP_USER_AGENT'])) {
            return "server";
        }
        return $_SERVER['HTTP_USER_AGENT'];
    }

    public static function getHTTP_HOST() {
        if (!isset($_SERVER['HTTP_HOST'])) {
            return "nodomain";
        }
        return $_SERVER['HTTP_HOST'];
    }

    public static function getREMOTE_ADDR() {
        if (!isset($_SERVER['REMOTE_ADDR'])) {
            return "no_remote_addr";
        }
        return $_SERVER['REMOTE_ADDR'];
    }

    public static function testRestService($p) {
        //--- MODIFICACION  CINDY
        $ch = curl_init("https://external.driv.in/api/external/v2/orders?schema_code=" . $p["code_esquema"]);

        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($p));

        $headers = [
            'Content-Type: application/json; charset=utf-8',
            'x-api-key: eb5fafe7-da69-4040-8281-f82d65617504'
        ];

        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

        $result = curl_exec($ch);

        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);

        error_log($result);

        return $result;
    }

    public static function testRestServiceGet($p) {
//--- TODO CINDY
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://external.driv.in/api/external/v2/pods?order_code[]=" . $p["numero_guia"]);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $headers = [
            'Content-Type: application/json; charset=utf-8',
            'x-api-key: eb5fafe7-da69-4040-8281-f82d65617504'
        ];
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        $data = curl_exec($ch);
        if (curl_error($ch)) {
            return json_encode(curl_error($ch));
        }
        curl_close($ch);
        return json_decode($data);
    }

    public static function getJitsiToken($p) {
        global $room;
        $room = $p["room"];
        include_once 'meetTokenGenerator.inc.php';
        return meetTokenGenerator::getToken();
    }

    public static function XML2Array($xml, $recursive = false) {
        if (!$recursive) {
            $array = simplexml_load_string($xml);
        } else {
            $array = $xml;
        }

        $newArray = array();
        $array = (array) $array;
        foreach ($array as $key => $value) {
            $value = (array) $value;
            if (isset($value [0])) {
                $newArray [$key] = trim($value [0]);
            } else {
                $newArray [$key] = XML2Array($value, true);
            }
        }
        return $newArray;
    }

    public static function tmpDelete($p) {
        return "hola";
    }

    public static function testProducts($p) {
        $send = Array();
        $send["product_id"] = 8;
        return self::callProducts($send, "getPlanes");
    }

    public static function getUserSettings($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_user_settings", "*", "usuario::text=:usuario");
        $ca->bindValue(":usuario", $si["usuario"], true);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return Array();
        }
        $ca->next();
        return $ca->assoc();
    }

    public static function saveUserSettings($p) {
        $si = session::info();
        if (!isset($si["usuario"])) {
            return;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_user_settings", "*", "usuario::text=:usuario");
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            $ca->clean();
            $ca->prepareInsert("nw_user_settings", "valores,empresa,usuario,fecha");
            $ca->bindValue(":valores", $p);
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d H:i:m"));
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        } else {
            $ca->next();
            $r = $ca->assoc();
            $json_extracted = json_decode($r["valores"], true);
            $p = json_decode($p, true);
            foreach ($p as $key => $value) {
                $json_extracted[$key] = $value;
            }
            $ca->prepareUpdate("nw_user_settings", "valores,fecha", "empresa=:empresa and usuario=:usuario");
            $ca->bindValue(":valores", json_encode($json_extracted));
            $ca->bindValue(":fecha", date("Y-m-d H:i:m"));
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            }
        }
        return true;
    }

    public static function testNWDbQuery($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "nombre,email", "usuario::text=:usuario");
        $ca->bindValue(":usuario", "andresf", true);
        if (!$ca->exec()) {
            master::logSystemError($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $db->rollback();
            master::logSystemError("El usuario no tiene correos asociados. Comuníquese con el administrador.");
            return false;
        }
        return true;
    }

    public static function enviarBiostar($p) {
        session::check();

        $db = new NWDatabase("MYSQL");
        $db->setHostName("192.168.1.235:3312");
        $db->setDatabaseName("biostar2_ac");
        $db->setPort(3312);
        $db->setUserName("andresf");
        $db->setPassword("Padre0808");
        $db->open_();

        $db->transaction();

        $ca = new NWDbQuery($db);
        $ca->setRegister(false);
        $ca->prepareInsert("t_fngptmpl", "USRUID,FNGPIDX,DUR,TMPL0,TMPL1");
        $ca->bindValue(":USRUID", 1028);
        $ca->bindValue(":FNGPIDX", 1);
        $ca->bindValue(":DUR", "N");
        $ca->bindValue(":TMPL0", base64_decode($p["huella"]));
        $ca->bindValue(":TMPL1", base64_decode($p["huella"]));
        if (!$ca->exec()) {
            $db->rollback();
            error_log($ca->lastErrorText());
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function buscarUsuariosActivos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "*", "estado='activo'", "nombre asc");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function buscarUsuariosActivosPorEmpresa($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select 
                    a.id,
                    a.nombre,
                    a.usuario,
                    a.documento,
                    a.pais 
                    from usuarios a
                    left join usuarios_empresas b on (a.usuario=b.usuario)
                    where a.estado='activo' and b.empresa=:empresa
                order by UPPER(nombre) ASC";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function checkUrl($p) {
        $file = $p;
        $file_headers = @get_headers($file);
        if (!$file_headers || $file_headers[0] == 'HTTP/1.1 404 Not Found') {
            $exists = false;
        } else {
            $exists = true;
        }
        return $exists;
    }

    public static function killSession($p) {
        try {
            if (session_status() === PHP_SESSION_ACTIVE) {
                session_destroy();
                session_unset();
            }
            var_dump($_SESSION);
            $a = & $_SESSION;
            unset($_SESSION);
        } catch (Exception $exc) {
            
        }
    }

    public static function testSleep($p) {
        sleep(10);
    }

    public static function cleanNWCalculateDev($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_export_calculate_dev", "1=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function checkNotificationsMobile($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_notificaciones", "*", "usuario_recibe='todos' and fecha_envio<=NOW()", "id desc");
//        $ca->prepareSelect("nwmaker_notificaciones", "*", "usuario_recibe='todos'", "id desc");  
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return Array();
        }
        return $ca->assocAll();
    }

    public static function testTransaction($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $ca->prepareInsert("tmp_trans1", "nombre");
        $ca->bindValue(":nombre", "nombre 1");
        if (!$ca->exec()) {
            error_log("ROLLBACK 1");
            $db->rollback();
            return;
//            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $ca->prepareInsert("tmp_trans2l", "nombre");
        $ca->bindValue(":nombre", "nombre 2");
        if (!$ca->exec()) {
            error_log("ROLLBACK 2");
            $db->rollback();
            return;
//            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function markNotificationsMobileAsViewed($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nwmaker_notificaciones", "leido='SI'", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return Array();
        }
        return $ca->assocAll();
    }

    public static function sendSMSByCBG($p) {
        if (isset($p["data"])) {
            $p = $p["data"];
        }
        $post['to'] = array($p["cel"]);
        $post['text'] = utf8_encode(substr($p["text"], 0, 155));
        $post['from'] = utf8_encode(substr($p["from"], 0, 10));
        $user = $p["user"];
        $password = $p["pass"];
        if (!function_exists('curl_version')) {
            NWJSonRpcServer::information("Debe instalar CURL / You must install CURL");
            return;
        }
        try {
            $base64 = "";
            if (NWUtils::functionExists('base64_encode')) {
                $base64 = base64_encode($user . ":" . $password);
            } else {
                $base64 = mb_convert_encoding($user . ":" . $password, "BASE64", "auto");
            }
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $p["url"]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                "Accept: application/json",
                "Authorization: Basic " . $base64));
            $result = curl_exec($ch);
            return $result;
        } catch (Exception $exc) {
            NWJSonRpcServer::error($exc->getTraceAsString());
        }
    }

    public static function saveImageBase64($p) {
        $p = preg_replace('#^data:image/\w+;base64,#i', '', $p);
        if (NWUtils::functionExists('base64_decode')) {
            $p = base64_decode($p);
        } else {
            $p = mb_convert_encoding($p, "auto", "BASE64");
        }
        $name = self::get_random_string("abcdefghijklmnopqrstwxyz123456789", 20);
        $path = $_SERVER["DOCUMENT_ROOT"] . '/imagenes/' . $name . ".png";
        $pathRta = '/imagenes/' . $name . ".png";
        $created = file_put_contents($path, $p);
        if ($created == false) {
            NWJSonRpcServer::error("El archivo no se puede guardar, revise con el administrador");
        }
        return $pathRta;
    }

//    public static function saveRecord($p) {
//        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
//        $ca->prepareSelect("nw_manuales", "*", "id=:id");
//        $ca->bindValue(":id", $p);
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error($ca->lastErrorText());
//        }
//
//        $ca->next();
//        return $ca->assoc();
//    }

    public static function getManualById($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_manuales", "*", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $ca->next();
        return $ca->assoc();
    }

    public static function testOracleDB($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function restartExportConfig($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_export_calculate_enc", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function saveNWCalculateHTMLDev($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->cleanHtml = false;
        $ca->prepareSelect("nw_export_calculate_dev", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $ca->prepareInsert("nw_export_calculate_dev", "encabezado,usuario,fecha,empresa");
            $ca->bindValue(":encabezado", $p);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        } else {
            $ca->prepareUpdate("nw_export_calculate_dev", "encabezado,fecha", "empresa=:empresa");
            $ca->bindValue(":encabezado", $p);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        return true;
    }

    public static function saveNWCalculateHTML($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->cleanHtml = false;
        $ca->prepareSelect("nw_export_calculate_enc", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $ca->prepareInsert("nw_export_calculate_enc", "encabezado,usuario,fecha,empresa");
            $ca->bindValue(":encabezado", $p);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        } else {
            $ca->prepareUpdate("nw_export_calculate_enc", "encabezado,fecha", "usuario=:usuario and empresa=:empresa");
            $ca->bindValue(":encabezado", $p);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        return true;
    }

    public static function cancelAll($p) {
        ignore_user_abort(false);
        ob_end_clean();
        ob_start();
        ob_flush();
        flush();
        sleep(2);
//        exit();
        return true;
    }

    public static function cleanUserWebRtc($user) {
        $user = str_replace("@", "", $user);
        $user = str_replace(".", "", $user);
        return $user;
    }

    public static function notificaUserCallRtc($p) {
        if (isset($_SESSION["nwproject"])) {
            $p = $p["data"];
        }
        $video = "";
        if (isset($p["video"])) {
            $video = "&video=false";
        }
        $MyUser = $_SESSION["usuario"];
        $userDestino = $p["usuario"];
        if (count(explode("@", $userDestino)) == 0) {
            return;
        }
        $link = "https://{" . master::getHTTP_HOST() . "}/nwlib6/nwproject/modules/webrtc/index.php?usuario={$MyUser}&answer=true" . $video;
        $mensaje = "<h1>Tienes una llamada entrante!</h1><p>Contesta dando OK!</p>";
        $mensaje .= "<p><strong>Correo</strong>{$userDestino}</p>";
        nwMaker::crearNotificacion($userDestino, $mensaje, "nwdialogframe", $link, "popup");
        if (isset($_SESSION["load_nwmaker"])) {
            master::creaMensajeVideoCall($p, "uno");
        }
        return true;
    }

    public static function creaMensajeVideoCall($p, $mode) {
        nwMaker::checkSession();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $ca->setCleanHtml(false);
        $si = session::info();
        $texto = "Video llamada iniciada...";
        $real_ip = master::getRealIp();
        $userscallintern1 = $si["usuario"] . "&" . $p["usuario"];
        $userscallintern2 = $p["usuario"] . "&" . $si["usuario"];
        $where = "userscallintern=:userscallintern or userscallintern_d=:userscallintern_d or userscallintern=:userscallintern_d or userscallintern_d=:userscallintern";
        $ca->prepareSelect("sop_visitantes", "id", $where);
        $ca->bindValue(":userscallintern", $userscallintern1);
        $ca->bindValue(":userscallintern_d", $userscallintern2);
        if (!$ca->exec()) {
            return "errores. " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        $id_call = $r["id"];
        $disp = nwMaker::getDispositivo();
        $fields = "texto,usuario,fecha, terminal, tipo_user, leido, ip, nombre_operador, foto_usuario, status,visitante,num_envio,dispositivo";
        $ca->prepareInsert("sop_chat", $fields);

        $link = "";
        if (isset($p["idc"])) {
            $link = "https://{" . master::getHTTP_HOST() . "}/nwlib6/nwproject/modules/webrtc/testing/two/index.php?idCall={$p["idc"]}";
        }

        if ($mode == "uno") {
            $texto = "He iniciado una video llamada... {$link} Haz Clic para ir a la llamada";
            $usuario = $si["usuario"];
            $usuario_not = $p["usuario"];
            $foto = $si["foto"];
            $nombre_operador = $si["nombre"] . " " . $si["apellido"];
            $nombre_operador_not = $si["nombre"] . " " . $si["apellido"];
        } else {
            $cb->prepareSelect("pv_clientes", "nombre,apellido,foto_perfil", "usuario_cliente=:us");
            $cb->bindValue(":us", $p["usuario"], true);
            if (!$cb->exec()) {
                return "errores. " . $cb->lastErrorText();
            }
            if ($cb->size() == 0) {
                return false;
            }
            $ra = $cb->flush();
            $texto = "He iniciado una video llamada...";
            $usuario = $p["usuario"];
            $usuario_not = $p["usuario"];
            $foto = $ra["foto_perfil"];
            $nombre_operador = $ra["nombre"] . " " . $ra["apellido"];
            $nombre_operador_not = $ra["nombre"] . " " . $ra["apellido"];
        }
        $ca->bindValue(":visitante", $id_call);
        $ca->bindValue(":texto", $texto);
        $ca->bindValue(":nombre_operador", $nombre_operador);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":foto_usuario", $foto);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":ip", $real_ip, true);
        $ca->bindValue(":tipo_user", "userInterNw");
        $ca->bindValue(":status", "VIDEOLLAMADA");
        $ca->bindValue(":leido", 1);
        $ca->bindValue(":num_envio", nwMaker::random(1000, 9999));
        $ca->bindValue(":dispositivo", $disp);
        if (!$ca->exec()) {
            return "errores. " . $ca->lastErrorText();
        }
        $msg = "<p><strong>{$nombre_operador_not} te envío un mensaje:</strong></p><p>{$texto}</p>";
        $title = "{$nombre_operador_not} inició una video llamada.";
        nwMaker::crearNotificacion($usuario_not, $msg, "chat", $link, null, false, false, false, $id_call, $title);
        $ca->prepareUpdate("sop_visitantes", "fecha_ultima_interaccion_operador", "id=:idcall");
        $ca->bindValue(":fecha_ultima_interaccion_operador", date("Y-m-d H:i:s"));
        $ca->bindValue(":idcall", $id_call);
        if (!$ca->exec()) {
            return "errores. " . $ca->lastErrorText();
        }
    }

    public static function getIDCallWebRTC() {
        return self::$idCallWebRTC;
    }

    public static function setIDCallWebRTC($id) {
        self::$idCallWebRTC = $id;
    }

    public static function getIDCallRtc($p) {
        if (isset($p["id_call"])) {
            return $p["id_call"];
        }
        return self::getIDCallWebRTC();
    }

    public static function getNameCallRtc($p, $mode = false) {
        return self::getIDCallRtc($p) . self::cleanUserWebRtc($_SESSION["usuario"]) . "_" . self::cleanUserWebRtc($p["usuario"]) . "_" . date("Y-m-d");
    }

    public static function getCarpetCallRtc($p) {
        $carpeta = $_SERVER["DOCUMENT_ROOT"] . "/tmp/";
        if (isset($p["id_call"])) {
            $carpeta .= $p["id_call"] . "/";
        }
        if (!file_exists($carpeta)) {
            mkdir($carpeta, 0777, true);
        }
        return $carpeta;
    }

    public static function saveCandidate($p) {
        if (isset($_SESSION["nwproject"])) {
            $p = $p["data"];
        }
        $filename = self::getCarpetCallRtc($p) . self::getNameCallRtc($p) . "_candidates.sdp";
        $file = fopen($filename, "a");
        fwrite($file, "||");
        fwrite($file, $p["candidate"]);
        fclose($file);
    }

    public static function processRtc($p) {
        if (isset($_SESSION["nwproject"])) {
            $p = $p["data"];
        }
        return file_put_contents(self::getCarpetCallRtc($p) . self::getNameCallRtc($p) . "_offer.sdp", $p["offer"]);
    }

    public static function saveResponseSecondRtc($p) {
        if (isset($_SESSION["nwproject"])) {
            $p = $p["data"];
        }
        return file_put_contents(self::getCarpetCallRtc($p) . self::getNameCallRtc($p) . "_answerSecond.sdp", $p["answer"]);
    }

    public static function getSdpCallRtc($p = false, $mode = false) {
        if (isset($_SESSION["nwproject"])) {
            if (isset($p["data"])) {
                $p = $p["data"];
            }
        }
        $MyUser = self::cleanUserWebRtc($_SESSION["usuario"]);
        $dir = self::getCarpetCallRtc($p);
        $directorio = opendir($dir);
        if ($mode != false) {
            $mode = "_" . $mode;
        }
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                $ext = pathinfo($archivo, PATHINFO_EXTENSION);
                if ($ext === "sdp") {
                    $arra = explode(".", $archivo);
                    $arr = explode("_", $arra[0]);
                    if (isset($arr[3])) {
                        if ($arr[3] == str_replace("_", "", $mode) && $arr[2] == date("Y-m-d")) {
                            if ($arr[1] == $MyUser) {
                                $name = $arr[0] . "_" . $MyUser . "_" . date("Y-m-d");
                                $rta = file_get_contents($dir . $name . "{$mode}.sdp");
//                                if ($mode == "_candidates") {
                                unlink($dir . $name . "{$mode}.sdp");
//                                }
                                return $rta;
                            }
                        }
                    }
                }
            }
        }
        closedir($directorio);
        return false;
    }

    public static function getRtc($p) {
        return self::getSdpCallRtc($p, "offer");
    }

    public static function getCandidates($p) {
        return self::getSdpCallRtc($p, "candidates");
    }

    public static function haveResponseRtc($p) {
        return self::getSdpCallRtc($p, "answerSecond");
    }

    public static function clearCalls($p) {
        return self::getSdpCallRtc($p, false);
    }

    public static function testOracle($p) {
        //SELECT
        $db = new NWDatabase("ORACLE");
        $db->setHostName("192.168.1.149");
        $db->setDatabaseName("XE");
        $db->setUserName("SYSTEM");
        $db->setPassword("admin");
        $db->open_();

        $ca = new NWDbQuery($db);
        $ca->prepareSelect("test", "*");
        return $ca->execPage($p);
//        for ($i = 0; $i < count($size); $i++) {
//            $r = $size[$i];
//            print_r($r);
//            echo "<br />";
//        }
//        return;
    }

    public static function testSQLServer($p) {
        //SELECT
        $db = new NWDatabase("SQLSERVER");
        $db->setInstance("SQLEXPRESS");
        $db->setHostName("192.168.1.175");
        $db->setDatabaseName("new");
        $db->setUserName("sa");
        $db->setPassword('padre08');
        $db->setPort(1433);
        $db->open_();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("test", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function diaSemana($num_semana) {
        $dias = array("", "Lunes", "Martes", "Mi&eacute;rcoles", "Jueves", "Viernes", "S&aacute;bado", "Domingo");
        return $dias[$num_semana];
    }

    public static function removeFavorite($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_favoritos", "modulo=:modulo and usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":modulo", $p["modulo"]);
        $ca->bindValue(":usuario", $_SESSION["usuario"]);
        $ca->bindValue(":empresa", $_SESSION["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function saveFavorite($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_favoritos", "modulo,usuario,empresa");
        $ca->bindValue(":modulo", $p["modulo"]);
        $ca->bindValue(":usuario", $_SESSION["usuario"]);
        $ca->bindValue(":empresa", $_SESSION["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function array_sort_by_column(&$arr, $col, $dir = SORT_ASC) {
        $sort_col = array();
        foreach ($arr as $key => $row) {
            $sort_col[$key] = $row[$col];
        }
        array_multisort($sort_col, $dir, $arr);
    }

    public static function execInBackground($cmd) {
        if (substr(php_uname(), 0, 7) == "Windows") {
            pclose(popen("start /B " . $cmd, "r"));
        } else {
            exec($cmd . " > /dev/null &");
        }
    }

    public static function getSmtpSettings($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepare(" SELECT *
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_NAME = 'nw_smtp' AND COLUMN_NAME = 'empresa'");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            $ca->prepare(" ALTER TABLE nw_smtp ADD COLUMN empresa INTEGER");
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        $ca->prepareSelect("nw_smtp", "*", "empresa=:empresa", "1");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function saveSmtpSettings($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_smtp", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->clear();
        $ca->prepareInsert("nw_smtp", "host,debug,auth,smtp_secure,port,username,pass,sended_from,usuario,fecha,empresa");
        $ca->bindValue(":host", $p["host"]);
        $ca->bindValue(":debug", $p["debug"]);
        if ($db->getDriver() == "MYSQL") {
            if ($p["auth"] == "true") {
                $p["auth"] = 1;
            } else {
                $p["auth"] = 0;
            }
            $ca->bindValue(":auth", $p["auth"]);
        } else {
            $ca->bindValue(":auth", $p["auth"]);
        }
        $ca->bindValue(":smtp_secure", $p["smtp_secure"]);
        $ca->bindValue(":port", $p["port"]);
        $ca->bindValue(":username", $p["username"]);
        $ca->bindValue(":pass", $p["pass"]);
        $ca->bindValue(":sended_from", $p["sended_from"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function sendXmlPost($URL, $xml) {
        $ch = curl_init($URL);
        curl_setopt($ch, CURLOPT_MUTE, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/xml', 'Content-length: ' . strlen($xml)));
        curl_setopt($ch, CURLOPT_POSTFIELDS, "$xml");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        curl_close($ch);
        return $output;
    }

    public static function httpPost($url, $params) {
        $postData = '';
        //create name value pairs seperated by &
        foreach ($params as $k => $v) {
            $postData .= $k . '=' . $v . '&';
        }
        $postData = rtrim($postData, '&');

        NWJSonRpcServer::information($postData);

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_POST, count($postData));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

        $output = curl_exec($ch);

        curl_close($ch);
        return $output;
    }

    public static function outputJavascript($javascript) {

        echo "<script type='text/javascript'>{$javascript}</script>";
    }

    public static function evalue($r, $type) {
        if (!isset($r) || $r == null || $r == '') {
            return false;
        }
        if (isset($type)) {
            switch ($type) {
                case "boolean":
                    if ($r == "t") {
                        return true;
                    } else if ($r == "true") {
                        return true;
                    } else if ($r == true) {
                        return true;
                    } else {
                        return false;
                    }
                    break;
            }
        }
        return true;
    }

    public static function tableAllTables($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        if (isset($p["token"]) && $p["token"] != "") {
            $where .= " where information_schema.tables.table_name like '%" . $p["token"] . "%' ";
        }
        $ca->prepare("select table_name as id, table_name as nombre from information_schema.tables " . $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function tableExists($p) {
        $db = NWDatabase::database();
        if (!isset($p["table"])) {
            return;
        }
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "MYSQL") {
            $dbname = $db->getDatabaseName();
            $ca->prepare("SHOW TABLES FROM :dbname");
            $ca->bindValue(":dbname", $dbname, false);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return;
            }
            $tablas = $ca->assocAll();
            for ($i = 0; $i < count($tablas); $i++) {
                $tabla = $tablas[$i];
                if ($p["table"] == $tabla["Tables_in_" . $dbname]) {
                    return true;
                }
            }
            return false;
        }
        $sql = "SELECT EXISTS (
                SELECT *
                FROM information_schema.tables
                WHERE table_schema = :schema AND
                      table_name = :table
       ) as exist";
        $ca->prepare($sql);
        $ca->bindValue(":table", $p["table"], true);
        $ca->bindValue(":schema", isset($p["schema"]) ? $p["schema"] : "public", true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        return $r["exist"];
    }

    public static function makeMaintenance($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("VACUUM ANALYSE");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepare("select current_database() as db");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            $ca->prepare("REINDEX DATABASE :db");
            $ca->bindValue(":db", $r["db"], false);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        return true;
    }

    public static function createWindowsLink($p) {
//        $WshShell = new COM("WScript.Shell");
//        $shortcut = $WshShell . CreateShortCut('\\Zimbra Webmail.lnk');
//        $shortcut->Targetpath = 'C:\Program Files\Mozilla Firefox\firefox.exe';
//        $shortcut->Arguments = 'http://mysite.com/auth/preauth.php';
//        $shortcut->WorkingDirectory = 'C:\Program Files\Mozilla Firefox';
//        $shortcut->save();
    }

    public static function validateDataArray($p) {
        foreach ($p as $key => $value) {
            if (!isset($p[$key])) {
                $p[$key] = "";
            }
        }
        return $p;
    }

    public static function getServerDate($p) {
        if ($p == "date") {
            return date("Y-m-d");
        } else {
            return date("Y-m-d H:i:s");
        }
    }

    public static function getCommaValueByColumn($data, $column, $quote) {
        if (!isset($quote)) {
            $quote = ",";
        }
        if (count($data) == 0) {
            return false;
        }
        $ids = Array();
        for ($i = 0; $i < count($data); $i++) {
            $ids[] = $data[$i][$column];
        }
        return implode($quote, $ids);
    }

    public static function logSystemError($text, $stack = false) {
        $date = date('d.m.Y h:i:s');
        $output = "INICIO:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::";
        if (is_array($text)) {
            $output .= print_r($text, 1);
        } else {
            $output .= $text;
        }
        $output .= "::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::FIN";
        $log = "Texto: " . $output . "   \n  Date:  " . $date . "\n";
        if (isset($_SESSION["usuario"])) {
            $log .= $log . " User:  " . $_SESSION["usuario"] . "\n";
        }

        if ($stack) {
            ob_start();
            debug_print_backtrace();
            $log .= ob_get_contents();
            ob_end_clean();
        }

        $log .= "\n";

        error_log($log, 0);
    }

    public static function duplicarRow($p) {
        //TODO: FOR TESTING ON ORACLE
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $p["getTableDescription"] = true;
        $fieldsArray = self::getColumnsAndDescriptions($p);
        $fields = "";
        for ($i = 0; $i < count($fieldsArray["cols"]); $i++) {
            if ($fieldsArray["cols"][$i]["column_name"] != "id") {
                $fields .= $fieldsArray["cols"][$i]["column_name"] . ",";
            }
        }
        $fields = rtrim($fields, ",");
        $newId = self::getNextSequence($p["table"] . "_id_seq");
        $sql = "insert into :table (id,{$fields}) (select {$newId},{$fields} from :table where id=:id)";
        $ca->prepare($sql);
        $ca->bindValue(":table", $p["table"], false);
        $ca->bindValue(":id", $p["row"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        if ($fieldsArray["table_description"] != "none") {
            if ($fieldsArray["table_description"] != "") {
                $json = json_decode($fieldsArray["table_description"], true);
                for ($i = 0; $i < count($json); $i++) {
                    if (isset($json[$i]["navTables"])) {
                        for ($ia = 0; $ia < count($json[$i]["navTables"]); $ia++) {
                            $r = $json[$i]["navTables"][$ia];
                            $pa = Array();
                            $pa["table"] = $r["table"];
                            $fieldsArrayIn = self::getOnlyColumns($pa);
                            $fieldsIn = "";
                            for ($ib = 0; $ib < count($fieldsArrayIn); $ib++) {
                                if ($fieldsArrayIn[$ib]["column_name"] != "id") {
                                    $fieldsIn .= $fieldsArrayIn[$ib]["column_name"] . ",";
                                }
                            }
                            $fieldsIn = rtrim($fieldsIn, ",");
                            $fieldsInAlter = str_replace($r["reference"], $newId, $fieldsIn);
                            $sql = "insert into :table ({$fieldsIn}) (select {$fieldsInAlter} from :table where :reference=:id) ";
                            $ca->prepare($sql);
                            $ca->bindValue(":table", $pa["table"], false);
                            $ca->bindValue(":reference", $r["reference"], false);
                            if (!$ca->exec()) {
                                $db->rollback();
                                NWJSonRpcServer::error($ca->lastErrorText());
                            }
                        }
                    }
                }
            }
        }
        $db->commit();
        return true;
    }

    public static function test_security($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("departamentos", "*", "1=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
//        NWJSonRpcServer::information($ca->preparedQuery());
    }

    public static function testListEdit($p) {
        $p = session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        //to_char(a.date::timestamp with time zone, 'DD/MM/YYYY'::text) AS date,
        if ($db->getDriver() === "PGSQL") {
            $sql = " select 
            a.*,
            CASE WHEN a.id > 23 THEN
            '<span style=\"color: green; font-weight: bold;\">CERRADA</span>' 
            ELSE
            '<span style=\"color: green; font-weight: bold;\">ABIERTA</span>'
            END AS html,
            a.imagen as image,
            b.nombre as nom_token_field
            from nw_list_edit a
            left join ciudades b on (a.token_field=b.id) ";
        } else {
            $sql = " select 
            a.*
            from nw_list_edit a ";
        }
//        func_concepto(select_token_field,'ciudades') as nom_select_token_field,
//            func_concepto(select_box,'ciudades') as nom_select_box
//            
        $ca->prepare($sql);
        if (isset($p["cleanAll"])) {
            return Array();
        }

        return $ca->execPage($p);
    }

    public static function saveListEdit($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        if (count($p) > 0) {
            $ca->prepareDelete("nw_list_edit", "1=1");
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        for ($i = 0; $i < count($p); $i++) {
            $r = $p[$i];
            $ca->prepareInsert("nw_list_edit", "imagen,date,visible,select_token_field,token_field,select_box,text_field,moneda");
            $ca->bindValue(":imagen", $r["image"]);
            $ca->bindValue(":date", date("Y-m-d"));
//            $ca->bindValue(":date", $r["date"] == '' ? null : $r["date"]);
            $ca->bindValue(":visible", $r["visible"]);
            //$ca->bindValue(":visible", $r["visible"]);
            $ca->bindValue(":select_token_field", !isset($r["select_token_field"]["id"]) ? 0 : $r["select_token_field"]["id"]);
            $ca->bindValue(":token_field", !isset($r["token_field"]["id"]) ? 0 : $r["token_field"]["id"]);
            $ca->bindValue(":text_field", !isset($r["text_field"]) ? 0 : $r["text_field"]);
            $ca->bindValue(":select_box", !isset($r["select_box"]["id"]) ? 0 : $r["select_box"]["id"]);
            $ca->bindValue(":moneda", $r["moneda"], true);
//            NWJSonRpcServer::information($ca->preparedQuery());
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
            break;
        }
        $db->commit();
        return true;
    }

    public static function getNextSequence($seq, &$db = false) {
        if ($db == false) {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "MYSQL") {
            $seq = str_replace("_id_seq", "", $seq);
            $ca->prepare("select max(id) as id from :sequence");
        } else if ($driver == "PGSQL") {
            $ca->prepare("select nextval(:sequence) as id");
        } else if ($driver == "ORACLE") {
            $ca->prepare("select :sequence.nextval as id from dual");
        }
        $indicative = true;
        if ($driver == "MYSQL" || $driver == "ORACLE") {
            $indicative = false;
        }
        $ca->bindValue(":sequence", $seq, $indicative);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("No se encontró el consecutivo: " . $ca->lastErrorText());
            return false;
        }
        $id = 1;
        $r = "";
        if ($driver == "ORACLE") {
            $ra = $ca->assocAll();
            if (count($ra) > 0) {
                $r = $ra[0];
                $id = $r["id"];
            }
        } else {
            if ($ca->size() != 0) {
                $ca->next();
                $r = $ca->assoc();
                $id = $r["id"];
            }
        }
        if ($driver == "MYSQL") {
            $id = $id + 1;
        }
        return $id;
    }

    public static function getMaxId($table, &$db = false, $sum = true) {
        if ($db == false) {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $ca->prepareSelect($table, "max(id) as id");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("No se encontró el consecutivo: " . $ca->lastErrorText());
            return false;
        }
        $id = 1;
        $r = "";
        if ($ca->size() != 0) {
            $ca->next();
            $r = $ca->assoc();
            $add = 0;
            if (isset($sum) && $sum) {
                $add = 1;
            }
            $id = $r["id"] + $add;
        }
        return $id;
    }

    public static function getRecordById($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect($p["table"], "*", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->flush(true);
    }

    public static function sendWelcomeMail($p) {
        $data = Array();
        if (!isset($p["empresa"])) {
            $p["empresa"] = "Grupo NW";
        }
        if (!isset($p["app_nombre"])) {
            $p["app_nombre"] = "QXNW";
        }
        if (!isset($p["nombre"])) {
            $p["nombre"] = "";
        }
        if (!isset($p["usuario"])) {
            $p["usuario"] = "";
        }
        if (!isset($p["clave"])) {
            $p["clave"] = "";
        }
        if (!isset($p["logo"])) {
            $p["logo"] = "https://www.netwoods.net/imagenes/imagenes_2012/logo_menu_kid.png";
        } else {
            $protocol = NWUtils::getProtocol();
            $p["logo"] = $protocol . master::getHTTP_HOST() . $p["logo"];
        }

        $usePlantilla = false;
        if (isset($p["tipo_plantilla"])) {
            $pl = nwMaker::getPlantillaByTypeCompany($p["tipo_plantilla"], $p["empresa"]);
            if ($pl != 0) {
                $body = $pl["cuerpo_mensaje"];
                $usePlantilla = true;
            }
        }
        if (!$usePlantilla) {
            $body = file_get_contents(dirname(__FILE__) . "/dev/welcome");
            if ($body == '') {
                $body = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns:v="urn:schemas-microsoft-com:vml"> <head> </head> <body style="background-color: #A5C4D9;"> <div style="max-width: 800px; padding-top: 10px; padding-left: 20px; background-image: url(\'https://www.gruponw.com/nwlib6/img/registro.jpg\');"> <table style="width:100%; max-width: 800px" border="0" width="100%" cellspacing="0" cellpadding="0" background=""> <tbody> <tr> <td> <a href="https://www.gruponw.com" target="_blank"> <img alt="QXNW, más que una herramienta." src="' . $p["logo"] . '" title="Clic para ir a gruponw.com"/> </a> <br/> </td></tr><tr> <td> <h3>Datos de Acceso a ' . $p["empresa"] . '</h3> </td></tr><tr> <td> <p>Recibe un cordial saludo, ' . $p["nombre"] . ', estos son <strong>tus datos de acceso</strong> a QXNW:</p></td></tr><tr> <td><br/><strong>Usuario: </strong>' . $p["usuario"] . '</td></tr><tr> <td><strong>Clave: </strong>' . $p["clave"] . '<br/><br/></td></tr><tr> <td> <p> <span style="line-height:1.6em">En tan solo tres pasos podr&aacute;s ingresar. Es muy simple.</span> </p><ol> <li>Digite en el navegador <a href="http://' . master::getHTTP_HOST() . '">' . master::getHTTP_HOST() . '</a></li><li>Presione sobre el v&iacute;nculo &#39;Ingresar&#39; ubicado en la esquina superior derecha</li><li>Digite sus datos de acceso y presione sobre el bot&oacute;n &#39;Ingresar&#39;</li></ol> </td></tr><tr> <td> <p>Cordialmente,</p><p> Equipo de NW <br/> www.gruponw.com<img src="https://www.gruponw.com" style="height:1px; width:1px"/> </p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></td></tr></tbody> </table> </div></body></html>';
            }
            if (isset($p["plantilla_bienvenida"])) {
                if ($p["plantilla_bienvenida"] != '') {
                    $contents = file_get_contents(dirname(__FILE__) . "/dev/" . $p["plantilla_bienvenida"]);
                    if ($contents !== false) {
                        if ($contents != '') {
                            $body = $contents;
                        }
                    }
                }
            }
        }
        $body = str_replace("{logo}", $p["logo"], $body);
        $body = str_replace("{empresa}", $p["empresa"], $body);
        $body = str_replace("{nombre}", $p["nombre"], $body);
        $body = str_replace("{usuario}", $p["usuario"], $body);
        $body = str_replace("{clave}", $p["clave"], $body);
        $body = str_replace("{HTTP_HOST}", master::getHTTP_HOST(), $body);

        $p["body"] = $body;
        $p["silent"] = true;
        self::sendEmail($p);
    }

    public static function getImageDimentions($imagepath) {
        if (!is_file($_SERVER["DOCUMENT_ROOT"] . $imagepath)) {
            return array(50, 50);
        }
        list($width, $height, $type, $attr) = getimagesize($_SERVER["DOCUMENT_ROOT"] . $imagepath);
        $ht = $height;
        $wd = $width;
        if ($width > 100) {
            $diff = $width - 100;
            $percnt_reduced = (($diff / $width) * 100);
            $ht = $height - (($percnt_reduced * $height) / 100);
            $wd = $width - $diff;
        } else if ($height > 100) {
            $diff = $height - 100;
            $percnt_reduced = (($diff / $height) * 100);
            $wd = $width - (($percnt_reduced * $width) / 100);
            $ht = $height - $diff;
        }
        return array($wd, $ht);
    }

    public static function clean($value) {
        if ($value == '' || $value == false || $value == null || is_array($value)) {
            $value = "";
        }
        $text = html_entity_decode(strip_tags($value));
        $text = str_replace("&rsquo;", "'", $text);
        $content = preg_replace("/&#?[a-z0-9]{2,8};/i", "", $text);
        //$rta = master::GetSQLValueString($content);
        $invalid_characters = array("$", "%", "#", "<", ">", "|");
        $str = str_replace($invalid_characters, "", $content);
        $output = preg_replace('/[^(\x20-\x7F)]*/', '', $str);
        $ser = serialize($output);
        $result = addslashes($ser);
        $result = quotemeta($result);
        return $str;
    }

    public static function salir($p) {
        if (!session::leaveUser($p)) {
            return false;
        }
        session_destroy();
        self::check();
        return true;
    }

    public static function GetSQLValueString($theValue) {
        $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
        $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) :
                (function_exists("mysql_escape_string") ? mysql_escape_string($theValue) : $theValue);
        return $theValue;
    }

    public static function deleteImage($p) {
        if ($p == "" || $p == null) {
            return false;
        }
        if (file_exists($_SERVER["DOCUMENT_ROOT"] . $p)) {
            if (!unlink($_SERVER["DOCUMENT_ROOT"] . $p)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    public static function createTempTableFromArray($p) {
        ini_set('zlib.output_compression', 0);
        ini_set('implicit_flush', 1);
        //ob_start("ob_gzhandler");
        if (function_exists('set_time_limit')) {
            set_time_limit(0);
        }
        //TODO: SE BORRA PARA MANEJAR TODO POR RPC
        //ignore_user_abort(True);
        //ini_set("memory_limit", "900M");
        $p = iconv(mb_detect_encoding(serialize($p)), "UTF-8", serialize($p));
        $si = session::info();
        $filename = $_SERVER["DOCUMENT_ROOT"] . "/tmp/" . $si["usuario"] . date("Y-m-d") . ".txt";
//        $filename = dirname(__FILE__) . "/../tmp/" . $si["usuario"] . date("Y-m-d") . ".txt";
        NWUtils::writeToFile($p, "w+", $filename);
        return $filename;
    }

    public static function populateUsedCities($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select 
                distinct
                *
                from ciudades where id in (select ciudad from :table) ";
        if ($p["order"] != '') {
            if ($p["order"] != null) {
                $sql .= " order by " . $p["order"];
            }
        }
        $ca->prepare($sql);
        $ca->bindValue(":table", $p["table"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateByTableId($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (!isset($p["field"])) {
            $p["field"] = "id";
        }
        if (!isset($p["fields"])) {
            $p["fields"] = "*";
        }
        if (!isset($p["order"])) {
            $p["order"] = "";
        }

        $d = Array();
        $d["table"] = $p["table"];
        $d["field"] = "empresa";
        $where_empresa = "";
        if (self::fieldExists($d, $db)) {
            $where_empresa = "and empresa=:empresa ";
        }

        $ca->prepareSelect($p["table"], $p["fields"], " :field in (:id) " . $where_empresa, $p["order"]);
        $ca->bindValue(":table", $p["table"], false);
        $ca->bindValue(":fields", $p["fields"], false);
        $ca->bindValue(":field", $p["field"], false);
        $ca->bindValue(":id", $p["id"], false);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getInitSettings($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $rand = "random()";
        if ($db->getDriver() == "MYSQL") {
            $rand = "RAND()";
        } else if ($db->getDriver() == "ORACLE") {
            $rand = "DBMS_RANDOM.RANDOM";
        }
        $ca->prepareSelect("nw_init_settings", "*", "empresa IS NULL", $rand);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        //SE ELIMINA LA SESIÓN PORQUE ESA FUNCIÓN NO LA REQUIERE
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            $r = $ca->assoc();
            $r["fondo"] = str_replace($_SERVER["DOCUMENT_ROOT"], "", $r["fondo"]);
            $r["logo"] = str_replace($_SERVER["DOCUMENT_ROOT"], "", $r["logo"]);
            if (isset($r["fondo_login"])) {
                $r["fondo_login"] = str_replace($_SERVER["DOCUMENT_ROOT"], "", $r["fondo_login"]);
            }
            return $r;
        }
    }

    public static function getFileForDownload($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_files_admin", "*", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function saveDescriptionOnDownload($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_files_records", "archivo,descripcion,usuario,fecha,hora");
        $ca->bindValue(":archivo", $p["id"]);
        $ca->bindValue(":descripcion", $p["description"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":hora", date("H:i:s"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function saveDownload($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("nw_files_downloads", "archivo,usuario,fecha,hora");
        $ca->bindValue(":archivo", $p);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":hora", date("H:i:s"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function deleteAttached($p) {
        if (!unlink($p)) {
            return true;
        } else {
            return false;
        }
    }

    public static function getReport($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);

        $ca->prepareSelect("nw_reports_enc", "id,nombre", "id=:id and empresa=:empresa");
        $ca->bindValue(":id", $p);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return null;
        }
        $ca->next();
        $r = $ca->assoc();

        $cb->prepareSelect("nw_reports_filters", "*,nombre as name", "reporte=:reporte");
        $cb->bindValue(":reporte", $p);
        if (!$cb->exec()) {
            NWJSonRpcServer::error($cb->lastErrorText());
        }
        $data = Array();
        for ($i = 0; $i < $cb->size(); $i++) {
            $cb->next();
            $data[] = $cb->assoc();
        }
        $r["detail"] = $data;
        return $r;
    }

    public static function testTableEdit($p) {
        session::check();
        if ($p["value"] == "") {
            return false;
        }
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("modulos", "*", "id=:id");
        $ca->bindValue(":id", $p["value"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return null;
        }
        return $ca->assocAll();
    }

    public static function getLogo($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $fields = "logo";
        $d = Array();
        $d["table"] = "empresas";
        $d["field"] = "web";
        if (self::fieldExists($d, $db)) {
            $fields = "logo,web";
        }
        $ca->prepareSelect("empresas", $fields, "id=:id");
        $ca->bindValue(":id", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return null;
        }
        $ca->next();
        $r = $ca->assoc();
        return $r;
    }

    public static function posposeAlert($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $where = "id=:id and usuario=:usuario and empresa=:empresa";
        $ca->prepareSelect("nw_alerts", "vigencia", $where);
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $vigencia = 0;
        $r = "";
        if ($ca->size() != 0) {
            $ca->next();
            $r = $ca->assoc();
            $vigencia = $r["vigencia"] + $p["tiempo_alerta"];
        }

        $ca->prepareUpdate("nw_alerts", "vigencia", $where);
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":vigencia", $vigencia);
        $ca->bindValue(":fecha", $p["fecha"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

    public static function discardAlert($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("nw_alerts", "estado", "id=:id and usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":estado", "DESCARTADA");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function checkAlerts($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $where = "";
        $fields = "id,fecha,texto,tiempo_alerta,estado,usuario";
        $where .= " usuario=:usuario and empresa=:empresa and estado='VIGENTE' 
            and fecha::date=CURRENT_DATE and (extract(epoch from fecha - current_timestamp) / 60)::integer + vigencia::integer <= tiempo_alerta 
             and (extract(epoch from fecha - current_timestamp) / 60)::integer + vigencia::integer > 0";
        $ca->prepareSelect("nw_alerts", $fields, $where . " limit 1");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            $db->rollback();
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        $db->commit();
        return $r;
    }

    public static function getNwlibVersion() {
        return $_SESSION["nwlibVersion"];
    }

    public static function getAlerts($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        $fields = "id,fecha,texto,tiempo_alerta,estado,usuario";
        if (isset($p["filters"])) {
            $where = NWDbQuery::sqlFieldsFilters($fields, $p["filters"]["buscar"], true);
            if ($where == "") {
                $where = " 1=1 ";
            }
            if ($p["filters"]["estado"] != "TODAS") {
                $where .= " and estado='" . $p["filters"]["estado"] . "' ";
            }
            $where .= " and ";
        }
        $where .= " usuario=:usuario and empresa=:empresa ";
        $ca->prepareSelect("nw_alerts", $fields, $where);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveAlert($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $fields = "fecha,texto,tiempo_alerta,vigencia,estado,usuario,empresa";
        $where = " usuario=:usuario and empresa=:empresa ";
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_alerts", $fields);
        } else {
            $ca->prepareUpdate("nw_alerts", $fields, " id=:id and " . $where);
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":fecha", $p["fecha"]);
        $ca->bindValue(":texto", $p["texto"]);
        $ca->bindValue(":tiempo_alerta", $p["tiempo_alerta"]);
        $ca->bindValue(":vigencia", 0);
        $ca->bindValue(":estado", "VIGENTE");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }

        $d = Array();
        $d["message"] = $p["texto"];
        $d["parte"] = "GESTOR_ALARMAS";
        $d["fecha_entrega"] = date($p["fecha"], strtotime("-" . $p["tiempo_alerta"] . " min"));
        $d["usersList"][] = Array("usuario" => $si["usuario"]);
        nw_notifications::saveNotifications($d);
        $db->commit();
        return true;
    }

    public static function getSequence($table, $field, $company = "") {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        $sequence = 1;
        if ($company != "") {
            $where = "empresa=:empresa";
        }
        $ca->prepareSelect($table, "max(" . $field . ") as id", $where);
        if ($company != "") {
            $ca->bindValue(":empresa", $company);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $r = "";
        if ($ca->size() != 0) {
            $ca->next();
            $r = $ca->assoc();
            $sequence = $r["id"] + 1;
        }
        return $sequence;
    }

    public static function sendDynamicTable($p) {
        session::check();
        if ($p["enviar_a_grupo"] != "") {
            $si = session::info();
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $sql = "select
                    a.*,
                    b.nombre,
                    b.email
                  from nw_email_groups_users a 
                  left join nw_emails b on (a.usuario=b.id) 
                  where a.grupo=:grupo and a.empresa=:empresa and b.email is not null";
            $ca->prepare($sql);
            $ca->bindValue(":grupo", $p["enviar_a_grupo"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
            if ($ca->size() == 0) {
                NWJSonRpcServer::information("No hay usuarios asociados al grupo de correos. Puede configurarlos por el menú: Configuración->Listas de correos");
                return;
            }
            for ($i = 0; $i < $ca->size(); $i++) {
                $ca->next();
                $d = $ca->assoc();
                $d["body"] = $p["body"];
                $d["silent"] = true;
                if (isset($p["excelPath"])) {
                    $d["excelPath"] = $p["excelPath"];
                }
                self::sendBeautyEmail($d);
            }
            return true;
        } else {
            self::sendBeautyEmail($p);
        }
    }

    public static function sendBeautyEmail($p) {
        $si = session::info();
        $oldBody = $p["body"];
        $p["body"] = "<div style='padding: 10px;width: 100%;background: #e5e5e5;'>";
        $p["body"] .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 13px 20px;'>";

        $nombre = $si["nombre"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "CONCAT(nombre, ' ', apellido) as nombres", "id=:id_usuario");
        $ca->bindValue(":id_usuario", $si["id_usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $ca->next();
            $rr = $ca->assoc();
            $nombre = $rr["nombres"];
        }

        $p["body"] .= "Información enviada por: " . $nombre . " <br />";
        $p["body"] .= "</div>";
        $p["body"] .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $p["body"] .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $p["body"] .= $oldBody;
        $p["body"] .= "<br />";
        //$p["body"] .= "<b>Link para ingresar al aplicativo: <a href='http://" . $_SERVER["HTTP_HOST"] . "'>" . $_SERVER["HTTP_HOST"] . "</a></b><br />";
        $p["body"] .= "</div>";
        $p["body"] .= "</div>";
        $p["body"] .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='https://www.gruponw.com' target='_blank' title='Diseñadores de Páginas Web y Desarrolladores de Software en toda Colombia. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> NW </span><span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>Group</span> Research.Desing.Development</a> 
               </p>";
        self::sendEmail($p);
    }

    public static function sendEmail($p) {
        if (!isset($p["silent"])) {
            $p["silent"] = false;
        }
        if (isset($p["subject"]) && $p["subject"] != "") {
            $subject = $p["subject"];
        } else {
            $subject = "Comunicaciones NW";
        }
        if (isset($p["subject"])) {
            $subject = $p["subject"];
        }

        $mail = new PHPMailer();
        master::trySendSmtp($mail);
        $mail->AddAddress($p["email"], $p["nombre"]);

        if (isset($p["email1"]) && isset($p["nombre1"])) {
            if ($p["email1"] != null && $p["nombre1"] != null) {
                if ($p["email1"] != "" && $p["nombre1"] != "") {
                    $mail->AddAddress($p["email1"], $p["nombre1"]);
                }
            }
        }
        if (isset($p["email2"]) && isset($p["nombre2"])) {
            if ($p["email2"] != null && $p["nombre2"] != null) {
                if ($p["email2"] != "" && $p["nombre2"] != "") {
                    $mail->AddAddress($p["email2"], $p["nombre2"]);
                }
            }
        }

        $mail->Subject = $subject;
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.gruponw.com";
        $mail->MsgHTML($p["body"]);

        //andresf: 23-AGO-2018, NO MOSTRAR INFORMACIÓN DE LA TECNOLOGÍA DE ENVÍO
        $mail->XMailer = ' ';

        if (isset($p["excelPath"])) {
            try {
                $url = parse_url($p["excelPath"]);
                $out = null;
                parse_str($url["query"], $out);
                $db = NWDatabase::database();
                $ca = new NWDbQuery($db);
                $ca->prepareSelect("nw_downloads", "*", "id=:id");
                $ca->bindValue(":id", $out["id"]);
                if (!$ca->exec()) {
                    echo $ca->lastErrorText();
                    return;
                }
                $r = $ca->flush();
                $mail->AddAttachment($_SERVER["DOCUMENT_ROOT"] . $r["path"], "Informe.xls");
            } catch (Exception $exc) {
                
            }
        }

        if (isset($p["attach"])) {
            $mail->AddAttachment($p["attach"]);
        }

        if (!$mail->Send()) {
            if (!$p["silent"]) {
                NWJSonRpcServer::information("Tuvimos un problema al enviar la información. Por favor comuníquese con el administrador. " . $mail->ErrorInfo);
            }
        } else {
            if (!$p["silent"]) {
                NWJSonRpcServer::information("El correo fue enviado exitosamente.");
            }
        }
    }

    public static function sendEmailWidthoutUser($p) {
        if (!isset($p["silent"])) {
            $p["silent"] = false;
        }
        $subject = "Comunicaciones NW";
        if (isset($p["subject"])) {
            $subject = $p["subject"];
        }
        $mail = new PHPMailer();
        if (isset($p["send_nombre_email"]) && $p["send_nombre_email"] != "") {
            master::trySendSmtp($mail, true, true, $p["send_nombre_email"]);
        } else {
            master::trySendSmtp($mail);
        }
        $mail->AddAddress($p["email"], $p["nombre"]);
        $mail->Subject = $subject;
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.gruponw.com";
        $mail->MsgHTML($p["body"]);

        if (isset($p["excelPath"])) {
            try {
                $url = parse_url($p["excelPath"]);
                $out = null;
                parse_str($url["query"], $out);
                $db = NWDatabase::database();
                $ca = new NWDbQuery($db);
                $ca->prepareSelect("nw_downloads", "*", "id=:id");
                $ca->bindValue(":id", $out["id"]);
                if (!$ca->exec()) {
                    echo $ca->lastErrorText();
                    return;
                }
                $r = $ca->flush();
                $mail->AddAttachment($_SERVER["DOCUMENT_ROOT"] . $r["path"], "Informe.xls");
            } catch (Exception $exc) {
                
            }
        }

        if (isset($p["attach"])) {
            $mail->AddAttachment($p["attach"]);
        }

        if (!$mail->Send()) {
            if (!$p["silent"]) {
                NWJSonRpcServer::information("Tuvimos un problema al enviar la información. Por favor comuníquese con el administrador. " . $mail->ErrorInfo);
            }
        } else {
            if (!$p["silent"]) {
                NWJSonRpcServer::information("El correo fue enviado exitosamente.");
            }
        }
    }

    public static function trySendSmtp($mail, $addReply = true, $addFrom = true, $sendFrom = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $emp = "";
        $where = " 1=1 ";
        $serv = !isset($_SERVER["HTTP_HOST"]) ? "NW Group" : $_SERVER["HTTP_HOST"];
        if (isset($_SESSION["empresa"]) && !isset($_SESSION["load_nwmaker"])) {
            $where = " empresa=" . $_SESSION["empresa"];
            if (isset($_SESSION["nom_empresa"])) {
                $emp = $_SESSION["nom_empresa"];
            }
        } else {
            $emp = $serv;
        }
        $where .= " order by id asc limit 1 ";
//        $ca->prepareSelect("nw_smtp", "*", $where, "1");
        $ca->prepareSelect("nw_smtp", "*", $where);
//        error_log($ca->preparedQuery());
//        return;
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        //TODO: en pruebas
        $mail->XMailer = ' ';
        if ($ca->size() > 0) {
            $r = $ca->flush();
            $mail->IsSMTP(); // telling the class to use SMTP
            $mail->Host = $r["host"]; // SMTP server
            $mail->SMTPDebug = $r["debug"]; // enables SMTP debug information (for testing)
            $mail->SMTPAuth = $r["auth"];                  // enable SMTP authentication
            $mail->SMTPSecure = $r["smtp_secure"];
            $mail->Port = $r["port"];                    // set the SMTP port for the GMAIL server
            $mail->Username = $r["username"]; // SMTP account username
            $mail->Password = $r["pass"];
            if ($sendFrom && is_string($sendFrom)) {
                $emp = $sendFrom;
            }
            if ($addReply == true) {
                $mail->AddReplyTo($r["sended_from"], $emp);
            }
            if ($addFrom == true) {
                $mail->SetFrom($r["sended_from"], $emp);
            }
        } else {
            if ($addReply == true) {
                $mail->AddReplyTo("info@{$serv}", "Info " . $emp);
            }
            if ($addFrom == true) {
                $mail->SetFrom("info@{$serv}", "Info " . $emp);
            }
        }
    }

    public static function sendLineByEmail($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $text = "";
        foreach ($p as $key => $value) {
            if (($key) == "detail") {
                continue;
            }
            $text .= str_replace("_", " ", ucfirst($key)) . ": " . $value;
            $text .= "<br />";
        }
        $mail = new PHPMailer();

        master::trySendSmtp($mail);

        $nombre = $si["nombre"];

        $ca->prepareSelect("usuarios", "CONCAT(nombre, ' ', apellido) as nombres", "id=:id_usuario");
        $ca->bindValue(":id_usuario", $si["id_usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $ca->next();
            $rr = $ca->assoc();
            $nombre = $rr["nombres"];
        }

        $body = "<div style='padding: 10px;max-width: 600px;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 13px 20px;'>";
        $body .= "Información enviada por: " . $nombre . " <br />";
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $body .= "<b>Línea: </b><br />" . $text . "<br />";
        $body .= "</div>";
        $body .= "<br />";
        $body .= "<b>Observaciones: </b><br />" . $p["detail"]["observaciones"] . "<br />";
        $body .= "<br />";
        $body .= "<b>Link para ingresar al aplicativo: <a href='http://" . master::getHTTP_HOST() . "'>" . master::getHTTP_HOST() . "</a></b><br />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='https://www.gruponw.com' target='_blank' title='Research.Design.Development. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Grupo</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>NW</span>
               .com</a> 
               </p>";

        if ($p["detail"]["enviar_a_grupo"] != "") {
            $sql = "
                select 
                a.*,
                b.email,
                b.nombre
                from nw_email_groups_users a
                join nw_emails b on (a.usuario=b.id)
                where a.grupo=:grupo
                ";
            $ca->prepare($sql);
            $ca->bindValue(":grupo", $p["detail"]["enviar_a_grupo"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
            }
            if ($ca->size() == 0) {
                NWJSonRpcServer::information("El grupo no tiene correos asociados. Puede hacerlo por el menú Configuración->Listas de correos");
                return false;
            }
            $r = "";
            for ($i = 0; $i < $ca->size(); $i++) {
                $ca->next();
                $r = $ca->assoc();
                $mail->AddAddress($r["email"], $r["nombre"]);
            }
        } else {
            $mail->AddAddress($p["detail"]["enviar_a"], $p["detail"]["nombre"]);
        }
        $mail->Subject = "Envío de datos NW";
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.gruponw.com";
        $mail->MsgHTML($body);

        if (!$mail->Send()) {
            NWJSonRpcServer::error("Tuvimos un problema al enviar la información. Por favor comuníquese con el administrador. Error: " . $mail->ErrorInfo);
        } else {
            return "El correo fue enviado exitosamente. ¿Desea enviar más correos?";
        }
    }

    public static function sendTemplateEmail($p) {
        $si = session::info();
        session::check();
        $mail = new PHPMailer();
        master::trySendSmtp($mail);

        $nombre = $si["nombre"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "CONCAT(nombre, ' ', apellido) as nombres", "id=:id_usuario");
        $ca->bindValue(":id_usuario", $si["id_usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() > 0) {
            $ca->next();
            $rr = $ca->assoc();
            $nombre = $rr["nombres"];
        }
        $body = "<div style='padding: 10px;max-width: 600px;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 13px 20px;'>";
        $body .= "Información enviada por: " . $nombre . " <br />";
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $body .= $p["text"];
        $body .= "</div>";
        $body .= "<br />";
        $body .= "<br />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='https://www.gruponw.com' target='_blank' title='Research.Design.Development. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
        $mail->AddAddress($p["send_to_email"], $p["send_to_name"]);
        //$mail->AddAddress("direccion@netwoods.net", "Andrés Flor");

        $mail->Subject = $p["subject"];
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.gruponw.com";
        $mail->MsgHTML($body);

        if (!$mail->Send()) {
            return false;
        } else {
            return true;
        }
    }

    public static function forgotPassword($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $mail = new PHPMailer();
        master::trySendSmtp($mail);
        $ca->prepareSelect("usuarios", "nombre,email,estado,usuario", "email=:email and estado='activo'");
        $ca->bindValue(":email", $p["email"], true);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::information("En este momento no se pudo realizar la solicitud. Intente más tarde.");
            return false;
        }
        if ($ca->size() == 0) {
            $db->rollback();
            NWJSonRpcServer::information("Su correo no se encuentra registrado en el sistema central. Comuníquese con el administrador. ");
            return false;
        }
        $ca->next();
        $r = $ca->assoc();
        $key = self::get_random_string("abcdefghijklmnopqrstwxyz1234567890", 10);
        $key = NWUtils::encrypt($key, "md5");
        $ca->prepareInsert("nw_forgot_password", "usuario,correo,clave,fecha,usada");
        $ca->bindValue(":clave", $key);
        $ca->bindValue(":correo", $r["email"]);
        $ca->bindValue(":usuario", $r["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":usada", 'false', false);
        if (!$ca->exec()) {
            $db->rollback();
            error_log($ca->lastErrorText());
            NWJSonRpcServer::information("No fue posible generar su nueva clave. Comuníquese con el administrador");
            return false;
        }
        $protocol = NWUtils::getProtocol();
        $url = $protocol . NWUtils::getVar("SERVER", "HTTP_HOST") . "/nwlib" . master::getNwlibVersion() . "/forgotPassword.inc.php?clave=" . $key . "&usuario=" . $r["usuario"] . "&email=" . $r["email"];

        $body = "<div style='padding: 20px;max-width: 600px;background: #e5e5e5;'>";
        $body .= "<div style='background-color: #4285f4;color: white;font: 20px arial,normal;padding: 23px 20px;'>";
        $body .= "Usted a solicitado un cambio de contraseña<br /><br />";
        $body .= "</div>";
        $body .= "<div style='padding: 20px;background: #ffffff;font-size: 12px;color:#666;font-weight: lighter;'>";
        $body .= "<div style='padding: 10px;background: #f1f1f1;color: #666;'>";
        $body .= "<b>Para recuperar su contraseña: </b><a target='_blank' href='" . $url . "'>Click aquí</a><br /><br />";
        $body .= "<b>O copie el siguiente enlace y péguelo en el navegador: <b>" . $url . "</b><br />";
        $body .= "</div>";
        $body .= "<br />";
        $body .= "<br />";
        $body .= "<b>Recuerde cambiar su clave cuando ingrese al sistema.</b><br />";
        $body .= "<br />";
        $body .= "<b>Si no ha solicitado un cambio de contraseña omita este mensaje</b><br />";
        $body .= "<br />";
        $body .= "<b>Link para ingresar al aplicativo: <a href='" . NWUtils::getVar("SERVER", "SERVER_PROTOCOL") . "://" . NWUtils::getVar("SERVER", "HTTP_HOST") . "'>" . NWUtils::getVar("SERVER", "HTTP_HOST") . "</a></b><br />";
        $body .= "</div>";
        $body .= "</div>";
        $body .= "<p style=''color: #999;text-align: center;max-width: 600px;font-size: 11px;>
            Notificación automática de NwAdmin.<br />Powered by 
            <a style='text-decoration: none;' href='http://www.gruponw.com' target='_blank' title='Research.Design.Development. Haz clic para más información.'>
               <span style='color: #d6002a;text-shadow: #444 1px 1px 1px;font-weight: bold;'> Net</span>
               <span style='color:#333; text-shadow: #999 1px 1px 1px;font-weight: bold;'>woods</span>
               .net</a> 
               </p>";
//        $mail->AddReplyTo("info@gruponw.com", "Grupo NW");
//        $mail->SetFrom("info@gruponw.com", "Grupo NW");
        $mail->AddAddress($p["email"], "UserName");
        $mail->Subject = "Recuperación de contraseñas NW";
        $mail->AltBody = "Si tiene problemas viendo este mensaje, por favor comuníquese con nosotros: www.gruponw.com";
        $mail->MsgHTML($body);

        if (!$mail->Send()) {
            $db->rollback();
            NWJSonRpcServer::information("Tuvimos un problema al enviar su clave. Por favor comuníquese con el administrador. ");
            try {
                error_log($mail->ErrorInfo);
            } catch (Exception $exc) {
                
            }
            return false;
        } else {
            $db->commit();
            return true;
        }
    }

    public static function get_random_string($valid_chars, $length) {
        $random_string = "";
        $num_valid_chars = strlen($valid_chars);
        for ($i = 0; $i < $length; $i++) {
            $random_pick = nwMaker::random(1, $num_valid_chars);
            $random_char = $valid_chars[$random_pick - 1];
            $random_string .= $random_char;
        }
        return $random_string;
    }

    public static function saveUsersInRoom($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        foreach ($p["users"] as $r) {
            if ($r["pertenece"] != "true") {
                $ca->prepareInsert("nw_chat_users_room", "room,usuario,nombre,user_id");
                $ca->bindValue(":room", $p["room"]);
                $ca->bindValue(":usuario", $r["usuario"]);
                $ca->bindValue(":nombre", $r["nombre"]);
                $ca->bindValue(":user_id", $r["id"]);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
        }
        return true;
    }

    public static function getConnectedUsersToRoom($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "";
        if (isset($p["room"])) {
            $where = " and room=:room";
        }
        $sql = "
            select 
            user_id as id,
            usuario,
            nombre,
            'NULL' as conectado,
            'true' as pertenece,
            (select count(*) from nw_chat_private where usuario_envia=usuario and usuario_recibe=:usuario_recibe and leido_recibe='NO') as private_messages
            from nw_chat_users_room
            where 1=1 " . $where . "
            UNION
            select 
            a.id,
            a.usuario, 
            a.nombre,
            a.conectado,
            'FALSE' as pertenece,
            (select count(*) from nw_chat_private where usuario_envia=a.usuario and usuario_recibe=:usuario_recibe and leido_recibe='NO') as private_messages
            from usuarios a 
            left join usuarios_empresas b on (a.usuario=b.usuario)
            where a.conectado='SI'
            and b.empresa=:empresa
            and a.usuario not in (select usuario from nw_chat_users_room where 1=1 " . $where . ") 
            and a.usuario <> :usuario_recibe order by nombre";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":room", $p["room"]);
        $ca->bindValue(":usuario_recibe", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function fieldExists($p, &$db = false) {
        $db = NWDatabase::database();
        if ($db !== false) {
            $ca = new NWDbQuery($db);
        }
        if ($db->getDriver() == "ORACLE") {
            $ca->prepare("SELECT
                    * 
            FROM
                ALL_TAB_COLUMNS 
            WHERE
                TABLE_NAME = :table
                AND COLUMN_NAME = :column ");
        } else {
            $ca->prepareSelect("information_schema.columns", "column_name", "table_name=:table and column_name=:column");
        }
        $ca->bindValue(":table", $p["table"]);
        $ca->bindValue(":column", $p["field"]);
        if (!$ca->exec()) {
            return false;
        }
        if ($ca->size() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public static function getAllActiveUsers($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "a.id,a.nombre,a.usuario,a.terminal,a.email";
        $d = Array();
        $d["table"] = "usuarios";
        $d["field"] = "apellido";
        if (self::fieldExists($d, $db)) {
            $fields = "a.id,CONCAT(a.nombre, ' ', a.apellido) as nombre,a.usuario,a.terminal,a.email";
        }
        $sql = "select {$fields} from usuarios a 
            left join usuarios_empresas b on (a.usuario=b.usuario) 
            where a.estado='activo' and b.empresa=:empresa
            order by a.nombre";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getConnectedUsers($p) {
        session::check();

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();

        if (isset($p["state"])) {
            if ($p["state"] != null && $p["state"] != "") {
                $ca->prepareUpdate("usuarios", "estado_chat,fecha_ultima_conexion", "usuario=:usuario and id=:usuario_id");
                $ca->bindValue(":estado_chat", $p["state"]);
                $ca->bindValue(":usuario", $si["usuario"]);
                $ca->bindValue(":usuario_id", $si["id"]);
                $ca->bindValue(":fecha_ultima_conexion", date("Y-m-d H:i:s"));
                if (!$ca->exec()) {
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
        }
//        $sql = "select DISTINCT a.id,
//       a.usuario,
//       a.nombre,
//       a.conectado,
//       (
//        select max(fecha)
//        from usuarios_log
//        where accion = 'INGRESO' and
//              empresa = 6 
//              and usuario = a.usuario
//      ) as fecha_completa,
//       date_part('day', CURRENT_TIMESTAMP -
//      (
//        select max(fecha)
//        from usuarios_log
//        where accion = 'INGRESO' and
//              empresa = :empresa
//              and usuario = a.usuario
//      )) as fecha_part,
//       (
//         select count(*)
//         from nw_chat_private
//         where usuario_envia = a.usuario and
//               usuario_recibe = :usuario_recibe and
//               leido_recibe = 'NO'
//       ) as private_messages
//from usuarios a
//     left join usuarios_empresas b on (a.usuario = b.usuario)
//where a.conectado = 'SI' and
//      date_part('day', CURRENT_TIMESTAMP -
//      (
//        select max(fecha)
//        from usuarios_log
//        where accion = 'INGRESO' and
//              empresa = :empresa
//              and usuario = a.usuario
//      )) <= 1 and
//      b.empresa = :empresa and a.usuario<>:usuario_recibe 
//order by private_messages desc";
        $terminal = "";
        if (isset($p["terminal"])) {
            if ($p["terminal"] == true) {
                $terminal = " and terminal=:terminal";
            }
        }
        if ($db->getDriver() == "ORACLE") {
            $sql = "select  usuarios.*,
       (select count(*) from nw_chat_private where usuario_envia=usuario and usuario_recibe=:usuario_recibe and leido_recibe='NO') as private_messages
       from usuarios  
       where conectado='SI' and estado='activo' $terminal and usuario<>:usuario_recibe  order by private_messages desc,"
                    . "(CASE WHEN (select fecha_timestamp from nw_chat_private where usuario_envia = usuario and usuario_recibe = :usuario_recibe and NUMROWS <= 1 order by fecha_timestamp desc) "
                    . "IS NULL THEN 0 ELSE 1 END) desc, "
                    . "(select fecha_timestamp from nw_chat_private where usuario_envia = usuario and usuario_recibe = :usuario_recibe and NUMROWS <= 1 order by fecha_timestamp desc ) "
                    . "desc, nombre asc";
        } else {
            $sql = "select  usuarios.*,
       (select count(*) from nw_chat_private where usuario_envia=usuario and usuario_recibe=:usuario_recibe and leido_recibe='NO') 
       as private_messages
       from usuarios  
       where conectado='SI' and estado='activo' $terminal and usuario<>:usuario_recibe 
       order by private_messages desc,fecha_ultima_conexion asc";
        }
        $ca->prepare($sql);
        $ca->bindValue(":terminal", $si["terminal"]);
        $ca->bindValue(":usuario_recibe", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }

        $rta = Array();

        $dir = $_SERVER["DOCUMENT_ROOT"] . "/tmp/";
        $directorio = @opendir($dir);
        if ($directorio == false) {
            NWJSonRpcServer::error("La ruta $dir no tiene los permisos suficientes para realizar la búsqueda de llamadas entrantes o salientes");
            return false;
        }
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                $ext = pathinfo($archivo, PATHINFO_EXTENSION);
                if ($ext === "sdp") {
                    $arra = explode(".", $archivo);
                    $arr = explode("_", $arra[0]);
                    if (isset($arr[3])) {
                        if ($arr[3] == "offer" && $arr[2] == date("Y-m-d")) {
                            if ($arr[1] == $_SESSION["usuario"]) {
                                $rta["haveMessage"] = true;
                                $rta["userCall"] = $arr[0];
                            }
                        }
                    }
                }
            }
        }
        closedir($directorio);
        $rta["records"] = $ca->assocAll();
        return $rta;
    }

    public static function getRoomUsers($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sql = "select 
            DISTINCT
            a.user_id as id,
            a.usuario, 
            a.nombre,
            a.room,
            (select count(*) from nw_chat_private where usuario_envia=a.usuario and usuario_recibe=:usuario_recibe and leido_recibe='NO') as private_messages
            from nw_chat_users_room a 
            where a.room=:room
            and a.usuario <> :usuario_recibe order by a.nombre";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":room", $p["room"]);
        $ca->bindValue(":usuario_recibe", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }

        $rta = Array();

        $dir = $_SERVER["DOCUMENT_ROOT"] . "/tmp/";
        $directorio = opendir($dir);
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                $ext = pathinfo($archivo, PATHINFO_EXTENSION);
                if ($ext === "sdp") {
                    $arra = explode(".", $archivo);
                    $arr = explode("_", $arra[0]);
                    if (isset($arr[3])) {
                        if ($arr[3] == "offer" && $arr[2] == date("Y-m-d")) {
                            if ($arr[1] == $_SESSION["usuario"]) {
                                $rta["haveMessage"] = true;
                            }
                        }
                    }
                }
            }
        }
        closedir($directorio);
        $rta["records"] = $ca->assocAll();
        return $rta;
    }

    public static function getRoomsByUser($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sql = "(select 
                id,nombre,fecha,usuario,hora,empresa
                from nw_chat_rooms 
                where empresa=:empresa 
                and usuario=:usuario)
                UNION
                (select a.id,
                a.nombre,
                a.fecha,
                a.usuario,
                a.hora,
                a.empresa
                    from nw_chat_rooms a
                where a.empresa = :empresa and
                (select count(b.id)
                from nw_chat_users_room b
                    where b.usuario = :usuario and b.room=a.id
                ) > 0 
                )";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function deleteRoom($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_chat_rooms", "id=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function newRoom($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();

        $id = master::getNextSequence("nw_chat_rooms_id_seq", $db);

        $ca->prepareInsert("nw_chat_rooms", "id,nombre,fecha,hora,usuario,empresa");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $p["title"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":hora", date("H:i:s"));
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        $ca->prepareInsert("nw_chat_users_room", "room,usuario,nombre,user_id");
        $ca->bindValue(":room", $id);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":nombre", $si["nombre"]);
        $ca->bindValue(":user_id", $si["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }

        foreach ($p["users"] as $r) {
            if ($r["pertenece"] != "true") {
                $ca->prepareInsert("nw_chat_users_room", "room,usuario,nombre,user_id");
                $ca->bindValue(":room", $id);
                $ca->bindValue(":usuario", $r["usuario"]);
                $ca->bindValue(":nombre", $r["nombre"]);
                $ca->bindValue(":user_id", $r["id"]);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error($ca->lastErrorText());
                }
            }
        }
        $p["id"] = $id;
        $db->commit();
        return $p;
    }

    public static function editChatMessage($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $table = "nw_chat";
        if (isset($p["is_private"]) && $p["is_private"] == true) {
            $table = "nw_chat_private";
        }
        $ca->prepareUpdate($table, "mensaje", "id=:id");
        $ca->bindValue(":mensaje", $p["message"]);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
    }

    public static function sendMessage($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareInsert("nw_chat", "usuario_envia,mensaje,fecha,hora,empresa,fecha_timestamp,sala");
        $ca->bindValue(":usuario_envia", $si["usuario"]);
        $ca->bindValue(":mensaje", $p["message"]);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha", NWUtils::getDate($db), false);
            $ca->bindValue(":hora", NWUtils::getTime($db), false);
            $ca->bindValue(":fecha_timestamp", NWUtils::getDateTime($db), false);
        } else {
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":hora", date("H:i:s"));
            $ca->bindValue(":fecha_timestamp", date("Y-m-d H:i:s"));
        }
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":sala", $p["room"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $ca->prepareUpdate("usuarios", "fecha_ultima_conexion", "usuario=:usuario");
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha_ultima_conexion", NWUtils::getDateTime($db));
        } else {
            $ca->bindValue(":fecha_ultima_conexion", date("Y-m-d H:i:s"));
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function sendPrivateMessage($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareInsert("nw_chat_private", "leido_envia,leido_recibe,usuario_envia,usuario_recibe,mensaje,fecha,hora,empresa,fecha_timestamp");
        $ca->bindValue(":leido", 'NO');
        $ca->bindValue(":leido_envia", "SI");
        $ca->bindValue(":leido_recibe", "NO");
        $ca->bindValue(":usuario_envia", $si["usuario"]);
        $ca->bindValue(":usuario_recibe", $p["user_private"]);
        $ca->bindValue(":mensaje", $p["message"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":hora", date("H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha_timestamp", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        //ENVÍO NOTIFICACIÓN A QXNW
//        $id_new_notify = master::getNextSequence("nw_notifications_id_seq");
        $ca->prepareSelect("nw_notifications", "max(id) as id");
        $ca->exec();
        $ca->next();
        $r_notifi = $ca->assoc();
        $id_new_notify = $r_notifi["id"] + 1;
        $ca->prepareInsert("nw_notifications", "id, parte, mensaje, enviado_por, fecha, empresa");
        $ca->bindValue(":id", $id_new_notify);
        $ca->bindValue(":parte", "CHAT");
        $ca->bindValue(":mensaje", $p["message"]);
        $ca->bindValue(":enviado_por", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $ca->prepareInsert("nw_notifications_det", "notificacion, leida, usuario, fecha");
        $ca->bindValue(":notificacion", $id_new_notify);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":leida", 0);
        } else {
            $ca->bindValue(":leida", "false");
        }
        $ca->bindValue(":usuario", $p["user_private"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $ca->prepareUpdate("usuarios", "fecha_ultima_conexion", "usuario=:usuario");
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha_ultima_conexion", NWUtils::getDateTime($db));
        } else {
            $ca->bindValue(":fecha_ultima_conexion", date("Y-m-d H:i:s"));
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        //FIN ENVÍO NOTIFICACIÓN A QXNW
        $db->commit();
        return true;
    }

    public static function getPrivateMessages($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        if ($p["rows"] < 0) {
            $p["rows"] = 1;
        }
        if ($db->getDriver() == "ORACLE") {
            $sql = "select 
                    * 
                from nw_chat_private 
                    where empresa=:empresa and (usuario_envia=:usuario_envia and usuario_recibe=:usuario_recibe 
                    or 
                    usuario_recibe=:usuario_envia and usuario_envia=:usuario_recibe)
                    and ROWNUM <= {$p["rows"]}
            order by fecha_timestamp desc ";
        } else {
            $sql = "select 
                    * 
                from nw_chat_private 
                    where empresa=:empresa and (usuario_envia=:usuario_envia and usuario_recibe=:usuario_recibe 
                    or 
                    usuario_recibe=:usuario_envia and usuario_envia=:usuario_recibe)
            order by fecha_timestamp desc 
            limit {$p["rows"]}";
        }
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario_envia", $si["usuario"], true);
        $ca->bindValue(":usuario_recibe", $p["user_private"], true);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return null;
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $data[] = $ca->assoc();
        }
//
//        $cb->prepareUpdate("nw_chat_private", "leido_recibe", "empresa=:empresa and (
//                usuario_recibe=:usuario_recibe and usuario_envia=:usuario_envia
//            )");
//        $cb->bindValue(":leido_recibe", 'SI');
//        $cb->bindValue(":empresa", $si["empresa"]);
//        $cb->bindValue(":usuario_recibe", $si["usuario"], true);
//        $cb->bindValue(":usuario_envia", $p["user_private"], true);
//        if (!$cb->exec()) {
//            $db->rollback();
//            NWJSonRpcServer::error($cb->lastErrorText());
//            return false;
//        }
        $db->commit();
        return array_reverse($data);
    }

    public static function readNotificationChats($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $cb = new NWDbQuery($db);
        $cc = new NWDbQuery($db);
        $si = session::info();
        $cb->prepareSelect("nw_notifications", "*", "enviado_por=:enviado_por  and parte='CHAT'");
        $cb->bindValue(":enviado_por", $p["user_private"], true);
        if (!$cb->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($cb->lastErrorText());
            return false;
        }
        $totalMens = $cb->size();
        for ($i = 0; $i < $totalMens; $i++) {
            $cb->next();
            $r = $cb->assoc();
            $cc->prepareUpdate("nw_notifications_det", "leida", "usuario=:usuario and notificacion=:notificacion");
            $cc->bindValue(":notificacion", $r["id"]);
            $cc->bindValue(":leida", "true");
            $cc->bindValue(":usuario", $si["usuario"]);
            if (!$cc->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($cc->lastErrorText());
                return false;
            }
        }
        $cb->prepareUpdate("nw_chat_private", "leido_recibe", "empresa=:empresa and (
                usuario_recibe=:usuario_recibe and usuario_envia=:usuario_envia)");
        $cb->bindValue(":leido_recibe", 'SI');
        $cb->bindValue(":empresa", $si["empresa"]);
        $cb->bindValue(":usuario_recibe", $si["usuario"], true);
        $cb->bindValue(":usuario_envia", $p["user_private"], true);
        if (!$cb->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($cb->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

    public static function getMessages($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        if ($p["rows"] < 0) {
            $p["rows"] = 1;
        }
        if ($db->getDriver() == "ORACLE") {
            $sql = "select * from nw_chat where empresa=:empresa and sala=:sala and ROWNUM <= {$p["rows"]} order by fecha_timestamp desc ";
        } else {
            $sql = "select * from nw_chat where empresa=:empresa and sala=:sala order by fecha_timestamp desc limit {$p["rows"]}";
        }
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":sala", $p["room"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $data = Array();
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $data[] = $ca->assoc();
        }
        return array_reverse($data);
    }

    public static function synchronizeNotes($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();

        if ($p == "" || $p == null) {
            $ca->prepareSelect("nw_notes", "*,left_a as left", "usuario=:usuario and empresa=:empresa");
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return;
            }
            return $ca->assocAll();
        }
        $db->transaction();

        $ca->prepareDelete("nw_notes", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        foreach ($p as $v) {
            $ca->prepareInsert("nw_notes", "note,top,left_a,width,height,usuario,fecha,empresa");
            $ca->bindValue(":note", $v["note"]);
            $ca->bindValue(":top", $v["top"], false);
            $ca->bindValue(":left_a", $v["left"], false);
            $ca->bindValue(":width", $v["width"], false);
            $ca->bindValue(":height", $v["height"], false);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
        }
        $db->commit();
        return true;
    }

    public static function getInfo() {
        return $_SESSION;
    }

    public static function info() {
        return $_SESSION;
    }

    public static function getMenuHeader($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("permisos", "*", "perfil=:perfil and consultar=true");
        $ca->bindValue(":perfil", $si["perfil"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            NWJSonRpcServer::error("No tiene permisos asociados. Consulte con el administrador.");
            return false;
        }
        $modulos = "";
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $modulos .= (int) $r["modulo"];
            if ($i + 1 < $ca->size()) {
                $modulos .= ",";
            }
        }
        $sql = "select 
                a.*,
                b.crear,
                b.consultar,
                b.editar,
                b.eliminar,
                b.todos,
                func_concepto(a.modulo, 'modulos', 'clase') as clase,
                b.terminal
                    from menu a
                    join permisos b on (a.modulo=b.modulo and b.perfil=:perfil)
                where a.modulo in (:modulos) and a.empresa=:empresa
                order by 
                a.nivel,
                a.orden,
                a.pariente";
        $ca->prepare($sql);
        $ca->bindValue(":modulos", $modulos, false);
        $ca->bindValue(":perfil", $si["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function testSignal($p) {
        return "Enlace sistema central reestablecido";
    }

    public static function testConnection($p) {
        return true;
    }

    public static function exportXLS($p) {

        ini_set('zlib.output_compression', 0);
        ini_set('implicit_flush', 1);
        //ob_start("ob_gzhandler");
        if (function_exists('set_time_limit')) {
            set_time_limit(0);  //this you know what gonna do 
        }
        ////TODO: SE BORRA PARA MANEJAR TODO POR RPC
        //ignore_user_abort(True);
        //ini_set("memory_limit", "900M");
        require_once dirname(__FILE__) . "/php-excel/excel.php";
        require_once dirname(__FILE__) . "/php-excel/excel-ext.php";

        session::check();
        $si = session::info();

        $filename = "/tmp/excelNW_" . $si["usuario"] . "_" . $si["empresa"] . "_" . date("Y-m-d H:i:s") . ".xls";
        $excelfile = "xlsfile:/" . $_SERVER["DOCUMENT_ROOT"] . $filename;

        //$excelfile = "xlsfile:/" . dirname(__FILE__) . "/../" . $filename;
        //If (!file_exists(dirname(__FILE__) . "/../" . "/tmp/")) {
        If (!file_exists($_SERVER["DOCUMENT_ROOT"] . "/tmp/")) {
            NWJSonRpcServer::error("La carpeta '/tmp' no está creada o no tiene los permisos suficientes. Comuníquese con el administrador. ");
        }

        $fp = fopen($excelfile, "w+");
        if (!is_resource($fp)) {
            NWJSonRpcServer::information("Error al crear $excelfile");
        }
        //$parte = $p["part"];
        $parte = "TODO";
        $p = iconv(mb_detect_encoding(serialize($p)), "UTF-8", serialize($p));
        $text = $p;

        $fc = $text;

        fwrite($fp, $fc);

        fclose($fp);

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
        $clave = self::get_random_string("abcdefghijkLMNWefr", 20);
        $ca->prepareInsert("nw_downloads", "id,file_name,path,clave,parte,fecha_creacion,usuario");
        $ca->bindValue(":id", $id);
        $ca->bindValue(":file_name", "nw_export_xls");
        $ca->bindValue(":path", "/" . $filename);
        $ca->bindValue(":clave", $clave);
        $ca->bindValue(":parte", $parte);
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

    public static function saveGeneric($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $data = master::getColumnsFromTable($p["table"]);
        $fields = master::transformTableArrayToString($data, ",");
        $id = 1;
        if ($p["id"] == "") {
            $ca->prepareInsert($p["table"], $fields);
        } else {
            $ca->prepareUpdate($p["table"], $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
            $id = $p["id"];
        }
        master::prepareBindValues($ca, $data, $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
        }
        if ($p["id"] == "") {
            $ca->prepareSelect($p["table"], "max(id) as id", "empresa=:empresa");
            $ca->bindValue(":empresa", $si["empresa"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $ca->next();
                $r = $ca->assoc();
                $id = $r["id"];
            }
        }
        if (isset($p["detalle"])) {
            if (count($p["detalle"])) {
                $ca->prepareDelete($p["navTable"], "id=:id");
                if (!$ca->exec()) {
                    NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
                }
                $data = master::getColumnsFromTable($p["navTable"]);
                $fields = master::transformTableArrayToString($data, ",");
                for ($i = 0; $i < count($p["detalle"]); $i++) {
                    $ca->prepareInsert($p["navTable"], $fields);
                    master::prepareBindValues($ca, $data, $p["detalle"]);
                    NWJSonRpcServer::information($ca->preparedQuery());
                    if (!$ca->exec()) {
                        NWJSonRpcServer::error("Error: " . $ca->lastErrorText());
                    }
                }
            }
        }
        return true;
    }

    public static function prepareBindValues($ca, $fields, $data) {
        for ($i = 0; $i < count($fields); $i++) {
            if ($fields[$i]["column_name"] == "id") {
                continue;
            }
            $ca->bindValue(":" . $fields[$i]["column_name"], $data[$fields[$i]["column_name"]]);
        }
        return $ca;
    }

    public static function transformTableArrayToString($arr, $glue) {
        $r = "";
        if ($glue == "" || !isset($glue)) {
            $glue = ",";
        }
        for ($i = 0; $i < count($arr); $i++) {
            if ($arr[$i]["column_name"] == "id") {
                continue;
            }
            if ($i + 1 < count($arr)) {
                $r .= $arr[$i]["column_name"] . $glue;
            } else if ($i + 1 >= count($arr)) {
                $r .= $arr[$i]["column_name"];
            }
        }
        return $r;
    }

    public static function writeToFile($data, $mode = "", $file = "") {
        if ($mode == "") {
            $mode = "a+";
        }
        if ($file == "") {
            $file = dirname(__FILE__) . "/log";
        }
        $fp = fopen($file, $mode);
        fwrite($fp, $data);
        fclose($fp);
    }

    public static function getLocationDetailsByIP() {
        $ip = $_SERVER['REMOTE_ADDR']; // your ip address here
        $ip = master::getRealIp();
//        $ip = '190.146.130.142'; // your ip address here
//        $ip = '192.168.1.53'; // your ip address here
//        $query = @unserialize(file_get_contents('http://ip-api.com/php/' . $ip));
//        if ($query && $query['status'] == 'success') {
//            return $query;
//        } else {
//            return false;
//        }
    }

    public static function getRealIp() {
        //verifica si está local para asignar IP por usuario, para evitar tener 127.0.0.1
        $pos = strrpos(master::getHTTP_HOST(), ".loc");
        $si = session::getInfo();
        //si está local (ej: domain.loc)
        if ($pos != "" && isset($si["usuario"])) {
            $ip = "127.0.0.1";
            if ($si["usuario"] == "ladyg") {
                $ip = "192.168.1.51";
            } else
            if ($si["usuario"] == "alexf") {
                $ip = "192.168.1.53";
            }
            return $ip;
        }

        // check for shared internet/ISP IP
        if (!empty($_SERVER['HTTP_CLIENT_IP']) && self::validate_ip($_SERVER['HTTP_CLIENT_IP'])) {
            return $_SERVER['HTTP_CLIENT_IP'];
        }
        // check for IPs passing through proxies
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // check if multiple ips exist in var
            if (strpos($_SERVER['HTTP_X_FORWARDED_FOR'], ',') !== false) {
                $iplist = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
                foreach ($iplist as $ip) {
//                    if (validate_ip($ip)) {
                    return $ip;
//                    }
                }
            } else {
                if (self::validate_ip($_SERVER['HTTP_X_FORWARDED_FOR']))
                    return $_SERVER['HTTP_X_FORWARDED_FOR'];
            }
        }
        if (!empty($_SERVER['HTTP_X_FORWARDED']) && self::validate_ip($_SERVER['HTTP_X_FORWARDED']))
            return $_SERVER['HTTP_X_FORWARDED'];
        if (!empty($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']) && self::validate_ip($_SERVER['HTTP_X_CLUSTER_CLIENT_IP']))
            return $_SERVER['HTTP_X_CLUSTER_CLIENT_IP'];
        if (!empty($_SERVER['HTTP_FORWARDED_FOR']) && self::validate_ip($_SERVER['HTTP_FORWARDED_FOR']))
            return $_SERVER['HTTP_FORWARDED_FOR'];
        if (!empty($_SERVER['HTTP_FORWARDED']) && self::validate_ip($_SERVER['HTTP_FORWARDED']))
            return $_SERVER['HTTP_FORWARDED'];

        // return unreliable ip since all else failed
//        return $_SERVER['REMOTE_ADDR'];
        return master::getREMOTE_ADDR();
    }

    /**
     * Ensures an ip address is both a valid IP and does not fall within
     * a private network range.
     */
    public static function validate_ip($ip) {

        if (strtolower($ip) === 'unknown')
            return false;

        // generate ipv4 network address
        $ip = ip2long($ip);

        // if the ip is set and not equivalent to 255.255.255.255
        if ($ip !== false && $ip !== -1) {
            // make sure to get unsigned long representation of ip
            // due to discrepancies between 32 and 64 bit OSes and
            // signed numbers (ints default to signed in PHP)
            $ip = sprintf('%u', $ip);
            // do private network range checking
            if ($ip >= 0 && $ip <= 50331647)
                return false;
            if ($ip >= 167772160 && $ip <= 184549375)
                return false;
            if ($ip >= 2130706432 && $ip <= 2147483647)
                return false;
            if ($ip >= 2851995648 && $ip <= 2852061183)
                return false;
            if ($ip >= 2886729728 && $ip <= 2887778303)
                return false;
            if ($ip >= 3221225984 && $ip <= 3221226239)
                return false;
            if ($ip >= 3232235520 && $ip <= 3232301055)
                return false;
            if ($ip >= 4294967040)
                return false;
        }
        return true;
    }

    public static function testDynamicWebService($p) {
        session::check();
        $con = Array();
        $con["urlPath"] = "https://www.gruponw.com/web_service/testSecurity.php?wsdl";
        $con["header"] = $GLOBALS['header'];
        $con["method"] = $GLOBALS['method'];
        $con["function"] = "testSecurity";
        $central = new connectCentral();
        $rta = $central->connect($p, $con);
        return $rta;
    }

    public static function callProducts($p, $func) {
//        session::check();
        $con = Array();
//        $con["urlPath"] = "https://www.gruponw.com/web_service/productos.php?wsdl";
//        $con["urlPath"] = "http://nw_ws.loc/productos.php?wsdl";
        $con["urlPath"] = "https://www.gruponw.com:443/web_service/productos.php?wsdl";
        $con["header"] = $GLOBALS['header'];
        $con["method"] = $GLOBALS['method'];
        $con["function"] = $func;
        $central = new connectCentral();
        $rta = $central->connect($p, $con);
        return $rta;
    }

    public static function callProductsAPI($p, $func) {
        include_once dirname(__FILE__) . '/rpc/nwApi.inc.php';
        //alexf: Comentado porque se usa en forms externos sin sessión
        $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
//        $nwApi = new nwApi("http://nwadmin.loc/rpcsrv/api.inc.php");
        $nwApi->setUser("robot");
        $nwApi->setPassword("123456");
        $nwApi->setProfile(56);
        $nwApi->setCompany(1);
        $nwApi->startSession();
//        $arr = array();
        $arr = $p;
        switch ($func) {
            case "getUsuarios":
                $method = "createUsersProd";
                $class = "usuarios";
                break;
            case "getEstado":
                $method = "getEstado";
                $class = "usuarios";
                break;
            case "wsClientesnw":
                $method = "envioCrmRingow";
                $class = "clientes_prospecto";
                break;
            case "wsClientesNwRDA":
                $method = "envioCrmForms";
                $class = "ws_clientes_rda";
                break;
            case "createUsuarios":
                $method = "createUsuarios";
                $class = "usuarios";
                break;

            default:
                break;
        }
        $res = $nwApi->exec($method, $class, $arr);
//        print_r($res);
//        NWJSonRpcServer::console($res);
        if (isset($res["result"])) {
            return $res["result"];
        } else {
            nwMaker::error("No se conectó con WS, result: " . json_encode($res), true);
            return false;
        }
    }

    public static function arrendamientoProductsAPI($p) {
        include_once dirname(__FILE__) . '/rpc/nwApi.inc.php';
        $nwApi = new nwApi($p["api"]["url_api"]);
        $nwApi->setUser($p["api"]["usuario_api"]);
        $nwApi->setPassword($p["api"]["clave_usuario_api"]);
        $nwApi->setProfile($p["api"]["perfil_api"]);
        $nwApi->setCompany($p["api"]["empresa_api"]);
        $nwApi->startSession();
        $arr = $p;
        $method = $p["api"]["metodo_api"];
        $class = $p["api"]["servicio_api"];
        $res = $nwApi->exec($method, $class, $arr);
        if (isset($res["result"])) {
            return $res["result"];
        } else {
            nwMaker::error("No se conectó con WS, result: " . json_encode($res), true);
            return json_encode($res);
        }
    }

    public static function verifyVersion($p) {
        session::check();
        $con = Array();
        $con["urlPath"] = "https://www.gruponw.com/web_service/error_reporting.php?wsdl";
        $con["header"] = $GLOBALS['header'];
        $con["method"] = $GLOBALS['method'];
        $con["function"] = "getVersion";
        $central = new connectCentral();
        $rta = $central->connect($p, $con);
        return $rta;
    }

    public static function confirmId(&$ca, $key = false) {
        if ($ca->size() > 0) {
            $ca->next();
            $r = $ca->assoc();
            if (!$key) {
                if (!isset($r["id"])) {
                    $r["id"] = 0;
                }
                return $r["id"];
            } else {
                if (!isset($r[$key])) {
                    $r[$key] = 0;
                }
                return $r[$key];
            }
        }
    }

    public static function validateFields($p, $fields) {
        $rta = Array();
        $rta["exists"] = true;
        foreach ($fields as $value) {
            if (!isset($p[$value])) {
                $rta["exists"] = false;
                $rta["key"] = $value;
            }
        }
        return $rta;
    }

    public static function testWs($p) {
        $con = Array();

        $con["urlPath"] = "https://wst.gruponw.com/ws/index.php?wsdl";
        $con["header"] = "https://wst.gruponw.com/ws";
        $con["method"] = "errorReport";
        $con["function"] = "consultTicket";

        //PARA createTicket
        $pa = Array();
        $pa["tipo"] = 1;
        $pa["observaciones"] = "test";
        $pa["id_tarea"] = "OCD215487";
        $pa["estacion"] = "ESTACION";
        $pa["id_estacion"] = "ID_ESTACION";
        $pa["fecha_alarma"] = date("Y-m-d H:i:s");
        $pa["prioridad"] = 3;

        //PARA consultTicket
        $pa["id_tiquet"] = "IN-22";

        $pa["comnetario"] = "IN-22";

        $central = new connectCentral();
        $rta = $central->connect($pa, $con);
        return $rta;
    }

    public static function sendPHPError($p) {
        echo $p;
        master::sendReport($p);
    }

    public static function sendReport($p) {
        $p = nwmaker::getData($p);
        $con = Array();
        $con["urlPath"] = $GLOBALS['urlPath'];
        $con["header"] = $GLOBALS['header'];
        $con["method"] = $GLOBALS['method'];
        $con["function"] = $GLOBALS['function'];

        $browser = NWUtils::getBrowser();

        if (!is_array($p)) {
            $old = $p;
            $p = Array();
            $p["error_text"] = $old;
        }
        //ADD 25 Oct 2022
        $requestHeaders = apache_request_headers();
        $p["error_text"] .= " <br /><br /><br />:: HEADERS: " . json_encode($requestHeaders);
        $debug = json_encode(debug_backtrace());
        $p["error_text"] .= " <br />:::debug_backtrace: " . $debug;
        //END ADD 25 Oct 2022

        if (!isset($p["browser_name"])) {
            $p["browser_name"] = $browser["name"];
        }
        if (!isset($p["code"])) {
            $p["code"] = 0;
        }
        if (!isset($p["origin"])) {
            $p["origin"] = 0;
        }
        if (!isset($p["browser_version"])) {
            $p["browser_version"] = $browser["version"];
        }
        if (!isset($p["device_name"])) {
//            $p["device_name"] = $_SERVER['HTTP_USER_AGENT'];
            $p["device_name"] = master::getHTTP_USER_AGENT();
        }
        if (!isset($p["engine_name"])) {
            $p["engine_name"] = $browser["webkit"];
        }
        if (!isset($p["engine_version"])) {
            $p["engine_version"] = "0";
        }
        if (!isset($p["os_name"])) {
            $p["os_name"] = NWUtils::getOS();
        }
        if (!isset($p["os_version"])) {
            $p["os_version"] = "0";
        }
        if (!isset($p["qx_version"])) {
            $p["qx_version"] = "3.0";
        }
        if (!isset($p["program_name"])) {
            $p["program_name"] = "NWLIB";
        }
        if (!isset($p["empresa"])) {
            $p["empresa"] = "NW";
        }
        if (!isset($p["profile"])) {
            $p["profile"] = isset($_SESSION["perfil"]) ? $_SESSION["perfil"] : "0";
        }
        if (!isset($p["usuario"])) {
            $p["usuario"] = isset($_SESSION["usuario"]) ? $_SESSION["usuario"] : "0";
        }
        if (!isset($p["email"])) {
            $p["email"] = isset($_SESSION["email"]) ? $_SESSION["email"] : "0";
        }
        if (!isset($p["user_name"])) {
            $p["user_name"] = isset($_SESSION["usuario"]) ? $_SESSION["usuario"] : "0";
        }
        if (!isset($p["db"])) {
            $p["db"] = "unknown";
        }
        if (!isset($p["terminal"])) {
            $p["terminal"] = isset($_SESSION["terminal"]) ? $_SESSION["terminal"] : "0";
        }
        if (!isset($p["theme"])) {
            $p["theme"] = "unknown";
        }
        if (!isset($p["errorPath"])) {
            $p["errorPath"] = "N/A";
        }
        if (!isset($p["qxnw_version"])) {
            $p["qxnw_version"] = "5";
        }
        if (!isset($p["dominio"])) {
//            $p["dominio"] = $_SERVER['HTTP_HOST'];
            $p["dominio"] = master::getHTTP_HOST();
        }

        $p["ip"] = self::getRealIp();
        $p["time"] = date("H:i:s");

        $central = new connectCentral();
        $rta = $central->connect($p, $con);
        return $rta;
    }

    public static function sendPqr($p) {
        $con = Array();

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $con["urlPath"] = $GLOBALS['urlPath'];
        $con["header"] = $GLOBALS['header'];
        $con["method"] = $GLOBALS['method'];
        $con["function"] = 'createPQR';
        $central = new connectCentral();
        $si = session::info();
        $p["contacto"] = $si["nombre"];
        $p["correo"] = $si["email"];
        $rta = $central->connect($p, $con);
        return $rta;
    }

    public static function getFilesFromUbication($p) {

        $dir = $_SERVER["DOCUMENT_ROOT"] . "/build" . "/" . $p["ubicacion"];
        if (is_dir($dir . "/")) {
            $directorio = @opendir($dir);
        } else {
            $p["error_text"] = "No se encontró la dirección buscada. La ruta " . $dir . " no ha sido encontrada";
            master::sendReport($p);
            NWJSonRpcServer::information("No se encontró la dirección buscada");
            return false;
        }
        if (!file_exists($dir)) {
            NWJSonRpcServer::information("No se encontró la dirección");
            return false;
        }
        $data = Array();
        $i = 0;
        while ($archivo = readdir($directorio)) {
            if ($archivo == '.' or $archivo == '..') {
                continue;
            } else {
                if (is_file($dir . "/" . $archivo)) {
                    $data[$archivo] = $archivo;
                }
            }
            $i++;
        }
        closedir($directorio);
        return $data;
    }

    public static function out($p) {
        try {
            $p = null;
            session::salir($p);
        } catch (Exception $exc) {
            error_log($exc);
        }
    }

    public static function saveErrors($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if (!isset($si["empresa"]) || !isset($si["usuario"])) {
            return;
        }
        $p["error"] = str_replace("'", "", $p["error"]);
        $ca->prepareInsert("nw_errores", "error,ubicacion,empresa,usuario,fecha,hora,status");
        $ca->bindValue(":error", $p["error"]);
        $ca->bindValue(":ubicacion", $p["ubicacion"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        $ca->bindValue(":hora", date("H:i:s"));
        $ca->bindValue(":status", "EN_PROCESO");
        if (!$ca->exec()) {
            return false;
        }
        return true;
    }

    public static function getDataFromTable($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (!isset($p["fields"])) {
            $p["fields"] = "*";
        }
        $ca->prepareSelect($p["table"], $p["fields"], $p["field"] . "=:" . $p["field"]);
        $ca->bindValue(":" . $p["field"], $p["value"]);
        if (!$ca->exec()) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function execPage($p) {
        session::check();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "";
        $columns = self::getColumns($p);
        $columns = $columns["cols"];
        $fields = "";
        $fieldsWhere = "";
        $cols = Array();
        $driver = $db->getDriver();
        $join = "";

        $letra = 'b';
        for ($i = 0; $i < count($columns); $i++) {
            $cols[] = $columns[$i]["column_name"];
            if (substr($columns[$i]["column_name"], 0, 7) == "nombre_") {
                $columns[$i]["column_name"] = str_replace("nombre_", "", $columns[$i]["column_name"]);
                $desc = explode(",", $columns[$i]["description"]);
                if (count($desc) > 0) {
                    if (isset($desc[0]) && isset($desc[1])) {
                        if (trim($desc[1]) != "''") {
                            if ($desc[0] == "ignore" && $desc[1] != "boolean" && $desc[1] != "array") {
                                $populateAnotherLocation = explode(".", $desc[1]);
                                if ($driver == "PGSQL") {
                                    if (count($populateAnotherLocation) == 1) {
                                        $fields .= "func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $desc[1] . "') as nombre_" . $columns[$i]["column_name"];
                                        $fieldsWhere .= " func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $desc[1] . "') ";
                                    } else if (count($populateAnotherLocation) == 2) {
                                        $result = call_user_func($populateAnotherLocation[0] . "::" . $populateAnotherLocation[1] . "Data", null);
                                        if (isset($result["field"])) {
                                            $fields .= "func_concepto(" . $result["column_name"] . "::int, '" . $result["table"] . "', '" . $result["field"] . "') as nombre_" . $columns[$i]["column_name"];
                                            $fieldsWhere .= " func_concepto(" . $result["column_name"] . "::int, '" . $result["table"] . "', '" . $result["field"] . "') ";
                                        } else {
                                            $fields .= "func_concepto(" . $result["column_name"] . "::int, '" . $result["table"] . "') as nombre_" . $columns[$i]["column_name"];
                                            $fieldsWhere .= " func_concepto(" . $result["column_name"] . "::int, '" . $result["table"] . "') ";
                                        }
                                    } else if (count($populateAnotherLocation) == 4) {
                                        $fields .= "func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $populateAnotherLocation[2] . "', '" . $populateAnotherLocation[3] . "') as nombre_" . $columns[$i]["column_name"];
                                        $fieldsWhere .= " func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $populateAnotherLocation[2] . "', '" . $populateAnotherLocation[3] . "') ";
                                    } else if (count($populateAnotherLocation) == 3) {
                                        $fields .= "func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $populateAnotherLocation[2] . "') as nombre_" . $columns[$i]["column_name"];
                                        $fieldsWhere .= " func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $populateAnotherLocation[2] . "') ";
                                    } else {
                                        $fields .= "func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $populateAnotherLocation[0] . "') as nombre_" . $columns[$i]["column_name"];
                                        $fieldsWhere .= " func_concepto(" . $columns[$i]["column_name"] . "::int, '" . $populateAnotherLocation[0] . "') ";
                                    }
                                } else if ($driver == "MYSQL") {
                                    if (count($populateAnotherLocation) == 1) {
                                        $fields .= $letra . ".nombre as nombre_" . $columns[$i]["column_name"];
                                        $join .= " left join " . $desc[1] . " " . $letra .
                                                " on (a." . $columns[$i]["column_name"] . "=" . $letra . ".id) ";
                                        $fieldsWhere .= $letra . ".nombre";
                                    } else if (count($populateAnotherLocation) == 3) {
                                        $fields .= $letra . ".nombre as nombre_" . $columns[$i]["column_name"];
                                        $join .= " left join " . $populateAnotherLocation[2] . " " . $letra .
                                                " on (a." . $columns[$i]["column_name"] . "=" . $letra . ".id) ";
                                        $fieldsWhere .= $letra . ".nombre";
                                    } else {
                                        $fields .= $letra . ".nombre as nombre_" . $columns[$i]["column_name"];
                                        $join .= " left join " . $populateAnotherLocation[0] . " " . $letra .
                                                " on (a." . $columns[$i]["column_name"] . "=" . $letra . ".id) ";
                                        $fieldsWhere .= $letra . ".nombre";
                                    }
                                    $letra++;
                                } else if ($driver == "ORACLE") {
                                    if (count($populateAnotherLocation) == 1) {
                                        $fields .= $letra . ".nombre as nombre_" . $columns[$i]["column_name"];
                                        $join .= " left join " . $desc[1] . " " . $letra .
                                                " on (a." . $columns[$i]["column_name"] . "=" . $letra . ".id) ";
                                        $fieldsWhere .= $letra . ".nombre";
                                    } else if (count($populateAnotherLocation) == 3) {
                                        $fields .= $letra . ".nombre as nombre_" . $columns[$i]["column_name"];
                                        $join .= " left join " . $populateAnotherLocation[2] . " " . $letra .
                                                " on (a." . $columns[$i]["column_name"] . "=" . $letra . ".id) ";
                                        $fieldsWhere .= $letra . ".nombre";
                                    } else {
                                        $fields .= $letra . ".nombre as nombre_" . $columns[$i]["column_name"];
                                        $join .= " left join " . $populateAnotherLocation[0] . " " . $letra .
                                                " on (a." . $columns[$i]["column_name"] . "=" . $letra . ".id) ";
                                        $fieldsWhere .= $letra . ".nombre";
                                    }
                                    $letra++;
                                }
                                if ($i + 1 != count($columns)) {
                                    $fields .= ",";
                                    $fieldsWhere .= "||";
                                }
                            }
                        }
                    }
                }
            } else {
                $prefix = "";
                if ($driver == "MYSQL") {
                    $prefix = "a.";
                } else if ($driver == "ORACLE") {
                    $prefix = "a.";
                }
                $fields .= $prefix . $columns[$i]["column_name"];
                $fieldsWhere .= $prefix . $columns[$i]["column_name"];
                if ($i + 1 != count($columns)) {
                    $fields .= ",";
                    $fieldsWhere .= "||";
                }
            }
        }

        if (isset($p["filters"]) && isset($p["filters"]["search"]) && $p["filters"]["search"] != "") {
            $where = " and " . NWDbQuery::sqlFieldsFiltersOptional($fieldsWhere, $p["filters"]["search"], true, "||");
        }

        if (in_array("empresa", $cols)) {
            if ($driver == "PGSQL") {
                $where .= " and empresa=:empresa";
            } else if ($driver == "MYSQL") {
                $where .= " and a.empresa=:empresa";
            } else if ($driver == "ORACLE") {
                $where .= " and a.empresa=:empresa";
            }
        }

        $where_dates = "";
        $pass1 = false;
        $pass2 = false;

        if (isset($p["filters"])) {
            if (count($p["filters"]) > 0) {
                foreach ($p["filters"] as $key => $value) {
                    if (array_search($key, Array("widget_dates", "getQuery", "nw_color_filter", "count", "export", "page", "part", "sort", "search", "exportCols", "rowHeight", "sorted", "sorted_name", "sorted_method", "subfilters", "special"), true) === false) {
                        if ($value != "") {
                            if ($key == "dateFieldFilter") {
                                if ($driver == "ORACLE") {
                                    $where_dates .= " and " . $prefix . $value . " between DATE:fecha_inicial_filters' and DATE:fecha_final_filters' ";
//                                    $where_dates .= " and " . $prefix . $value . " between DATE'%fecha_inicial_filters' and DATE'%fecha_final_filters' ";
                                } else if ($driver == "PGSQL") {
                                    $where_dates .= " and " . $prefix . $value . "::date between :fecha_inicial_filters and :fecha_final_filters ";
//                                    $where_dates .= " and " . $prefix . $value . "::date between '%fecha_inicial_filters' and '%fecha_final_filters' ";
                                } else {
                                    $where_dates .= " and " . $prefix . $value . " between :fecha_inicial_filters and :fecha_final_filters ";
//                                    $where_dates .= " and " . $prefix . $value . " between '%fecha_inicial_filters' and '%fecha_final_filters' ";
                                }
                            } else if ($key == "fecha_inicial_filters") {
                                //TODO: se eliinan en ambos $prefix . porque ponía una a. antes
//                                $where_dates = str_replace("%fecha_inicial_filters", $value, $where_dates);
                                $ca->bindValue(":fecha_inicial_filters", $value);
//                                $where_dates = str_replace("%fecha_inicial_filters", $value, $where_dates);
                                if ($value != "") {
                                    $pass1 = true;
                                }
                            } else if ($key == "fecha_final_filters") {
                                $ca->bindValue(":fecha_final_filters", $value);
//                                $where_dates = str_replace("%fecha_final_filters", $value, $where_dates);
                                if ($value != "") {
                                    $pass2 = true;
                                }
                            } else {
                                $testlabel = substr($key, -6);
                                if ($testlabel != "_label") {
                                    $match = array();
                                    preg_match("/[0-9\.]+/", $value, $match);
                                    if (count($match) == 0 || $match[0] != $value) {
                                        $where .= " and " . $prefix . $key . "='" . $value . "' ";
                                    } else {
                                        $where .= " and " . $prefix . $key . "=" . $value . " ";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if ($pass1 && $pass2) {
            $where .= $where_dates;
        }
        if ($fields == "") {
            return;
        }

        if (isset($p["navTableData"]) && $p["navTableData"] === true) {
            $where .= " and " . $p["reference"] . "=:nav_table_reference";
        }

        if ($driver == "MYSQL") {
            $sql = "select " . rtrim($fields, ',') . " from " . $p["table"] . " a " . $join . " where 1=1 " . $where;
            $ca->prepare($sql);
        } else if ($driver == "ORACLE") {
            $sql = "select " . rtrim($fields, ',') . " from " . $p["table"] . " a " . $join . " where 1=1 " . $where;
            $ca->prepare($sql);
        } else {
            $ca->prepareSelect($p["table"], rtrim($fields, ','), " 1=1 " . $where);
        }
        if (in_array("empresa", $cols)) {
            $ca->bindValue(":empresa", $si["empresa"]);
        }
        if (isset($p["navTableData"]) && $p["navTableData"] === true) {
            $ca->bindValue(":nav_table_reference", $p["id_parent"]);
        }
        if (in_array("pais", $cols) && isset($p["filters"]["pais"]) && isset($si["pais"])) {
            $ca->bindValue(":pais", $si["pais"]);
        }
//        NWJSonRpcServer::information($ca->preparedQuery());
        $r = $ca->execPage($p);
        return $r;
    }

    public static function populateAutoNavTable($p) {
        $p["navTableData"] = true;
        return self::execPage($p);
    }

    public static function getFields($p) {
        $columns = self::getOnlyColumns($p);
        $fields = "";
        for ($i = 0; $i < count($columns); $i++) {
            if (implode(",", $columns[$i]) != "id") {
                $fields .= implode(",", $columns[$i]);
                if ($i + 1 != count($columns)) {
                    $fields .= ",";
                }
            }
        }
    }

    public static function populate($p) {
        if (isset($p["data"])) {
            return nwprojectOut::populate($p);
        }
//        session::check();
        if (!isset($p["table"])) {
            return;
        }
        if ($p["table"] == "''") {
            return;
        }
        //$db = NWDatabase::database();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $order = "";
        $si = session::info();
        $fields = "id";
        $haveOrder = false;
        if (isset($p["order"])) {
            if ($p["order"] != null) {
                $order = $p["order"];
                $haveOrder = true;
            }
        }
        $fieldsArray = self::getOnlyColumns($p);
        $str = Array();
        for ($i = 0; $i < count($fieldsArray); $i++) {
            $str[$i] = $fieldsArray[$i]["column_name"];
        }
        $whereEmpresa = "";
        if (in_array("empresa", $str)) {
            $whereEmpresa = $p["table"] . ".empresa=:empresa";
        } else {
            $whereEmpresa = "";
        }

//        if (in_array("pais", $str) && isset($si["pais"])) {
//            if ($si["pais"] != "") {
//                if ($whereEmpresa != "") {
//                    $whereEmpresa .= " and " . $p["table"] . ".pais=:pais";
//                } else {
//                    $whereEmpresa .= $p["table"] . ".pais=:pais";
//                }
//            }
//        }

        if (isset($p["haveCompany"]) && $p["haveCompany"] !== "" && $p["haveCompany"] === false) {
            $whereEmpresa = "";
        }

        if (isset($p["where"])) {
            if ($p["where"] != null) {
                if ($whereEmpresa !== "") {
                    $whereEmpresa = $whereEmpresa . " and " . $p["where"];
                } else {
                    $whereEmpresa = " " . $p["where"];
                }
            }
        }

        $f = "*";
        if (isset($p["fields"])) {
            $f = $p["fields"];
        }

        if (in_array("nombre", $str) && !$haveOrder) {
            $order = "lower(" . $p["table"] . ".nombre)";
            $fields = $p["table"] . ".{$f}," . $p["table"] . "." . $fields . "," . $p["table"] . ".nombre";
        } else {
            $fields = $p["table"] . ".{$f}," . $p["table"] . "." . $fields;
        }
        $ca->prepareSelect($p["table"], $fields, $whereEmpresa, $order);
        if (in_array("empresa", $str)) {
            $empres = null;
            if (isset($p["empresa"])) {
                $empres = $p["empresa"];
            }
            $ca->bindValue(":empresa", isset($si["empresa"]) ? $si["empresa"] : $empres, true, true);
        }
//        if (in_array("pais", $str) && isset($si["pais"])) {
//            $ca->bindValue(":pais", $si["pais"]);
//        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if (isset($p["only_first_row"])) {
            if ($p["only_first_row"] != null && $p["only_first_row"] == true) {
                if ($ca->size() == 0) {
                    return Array();
                } else {
                    $ca->next();
                    return $ca->assoc();
                }
            }
        }
        $rta = $ca->assocAll();
        return $rta;
    }

//TODO: EVALUAR EL & EN EL SEGUNDO PARÁMETRO
    public static function getTableDescription($p, $db) {
//        session::check();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $driver = $db->getDriver();
        $ca = new NWDbQuery($db);
        if ($driver == "PGSQL") {
            $ca->prepare("select obj_description('public.{$p["table"]}' ::regclass) as description");
        } else if ($driver == "MYSQL") {
            $ca->prepare("SELECT table_comment as description FROM INFORMATION_SCHEMA.TABLES
                        WHERE table_schema=:schema
                        AND table_name=:table_name");
            $ca->bindValue(":schema", $db->getDatabaseName());
            $ca->bindValue(":table_name", $p["table"]);
        } else if ($driver == "ORACLE") {
            $ca->prepare("SELECT comments as description FROM user_tab_comments WHERE table_name = UPPER(:table_name)");
            $ca->bindValue(":table_name", $p["table"]);
        }
        $ca->bindValue(":table", $p["table"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $rta = $ca->flush();
        if ($ca->size() > 0) {
            $rta = $rta["description"];
        }

        return $rta;
    }

    public static function populateToken($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $v = Array();
        $v["table"] = $p["table"];
        $v["field"] = "empresa";
        $where = " 1= 1";
        if (self::fieldExists($v, $db)) {
            $where .= " and empresa=:empresa ";
        }
        if ($p["token"] != "") {
            $where .= " and ( 
                        lower(nombre::varchar) like lower('%{$p["token"]}%') 
                       )";
        }
        $ca->prepareSelect($p["table"], "id, nombre", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateTokenField($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "";
        $fieldsArray = self::getOnlyColumns($p);
        $str = Array();
        for ($i = 0; $i < count($fieldsArray); $i++) {
            $str[$i] = $fieldsArray[$i]["column_name"];
        }
        $fields = implode(",", $str);
        if ($p != "") {
            $where = NWDbQuery::sqlFieldsFilters($fields, $p["text"], true);
        }
        $whereEmpresa = "";
        if (in_array("empresa", $str)) {
            $whereEmpresa = "empresa=:empresa";
        } else {
            $whereEmpresa = "1=1";
        }

        if (in_array("pais", $str) && isset($si["pais"])) {
            $whereEmpresa .= " and pais=:pais";
        }

        $orderBy = "";
        if (in_array("nombre", $str)) {
            $orderBy = " order by lower(nombre) ";
        }

        $sql = "select {$fields} from {$p["table"]} where {$whereEmpresa} and {$where} {$orderBy}";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (in_array("pais", $str) && isset($si["pais"])) {
            $ca->bindValue(":pais", $si["pais"]);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function cleanLogs() {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_registro", "1=1");
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getColumnsAndDescriptions($p) {
        if (!isset($p["nwmaker"])) {
            session::check();
        }
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $db->transaction();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $sql = "SELECT cols.column_name,
                cols.data_type,
                cols.character_maximum_length,
                (select pg_catalog.col_description(oid, cols.ordinal_position::int)
                from pg_catalog.pg_class c
                where c.relname = cols.table_name
                ) as description
                FROM information_schema.columns cols
            WHERE 
                cols.table_name =:table
                order by cols.ordinal_position;";
        } else if ($driver == "MYSQL") {
            $sql = "
                SELECT
                    cols.column_name as column_name,
                    cols.data_type as data_type,
                    cols.is_nullable as is_nullable,
                    cols.character_maximum_length as character_maximum_length,
                    cols.column_comment as description
                FROM INFORMATION_SCHEMA.COLUMNS cols
                WHERE table_schema=:schema AND table_name=:table
                ORDER BY ordinal_position;";
        } else {
            $sql = "SELECT tc.column_name,
                    tc.data_type,
                    tc.nullable AS is_nullable,
                    CASE
                    WHEN tc.data_type = 'NUMBER' AND tc.data_precision IS NOT NULL
                    THEN tc.data_precision
                    WHEN tc.data_type LIKE '%CHAR%'
                    THEN tc.data_length
                    ELSE NULL
                    END character_maximum_length,
                    cc.comments AS description
                    FROM user_col_comments cc
                    JOIN user_tab_columns tc
                    ON cc.column_name = tc.column_name
                    AND cc.table_name = tc.table_name
                    WHERE cc.table_name = upper(:table) order by tc.column_id";
        }
        $ca->prepare($sql);
        $ca->bindValue(":table", $p["table"], true);
        $ca->bindValue(":schema", $db->getDatabaseName(), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $rta = Array();
        $rta["cols"] = $ca->assocAll();
        if ($driver == "ORACLE") {
            for ($i = 0; $i < count($rta["cols"]); $i++) {
                $rta["cols"][$i]["column_name"] = strtolower($rta["cols"][$i]["column_name"]);
            }
        }
        if (isset($p["getTableDescription"]) && $p["getTableDescription"] == true) {
            $rta["table_description"] = self::getTableDescription($p, $db);
        } else {
            $rta["table_description"] = "none";
        }
        return $rta;
    }

    public static function findSavedDb($id) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nw_server_db", "*", "id=:id");
        $ca->bindValue(":id", $id);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        if ($ca->size() == 0) {
            NWJSonRpcServer::information("No hay datos configurados con el id " . $id);
            return;
        }
        $conf = $ca->flush();
        $dba = new NWDatabase();
        $dba->setDriver($conf["driver"]);
        $dba->setHostName($conf["host"]);
        $dba->setDatabaseName($conf["dbname"]);
        $dba->setUserName($conf["username"]);
        $dba->setPassword($conf["pass"]);
        if ($conf["puerto"] != "") {
            $dba->setPort($conf["puerto"]);
        }
        $dba->open_();
        return $dba;
    }

    public static function getColumns($p) {
//        session::check();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $sql = "SELECT cols.column_name,
            cols.data_type,
            cols.is_nullable,
            character_maximum_length,
            (select pg_catalog.col_description(oid, cols.ordinal_position::int)
                from pg_catalog.pg_class c
                where c.relname = cols.table_name
                ) as description
                FROM information_schema.columns cols
            WHERE 
                cols.table_name = :table
                order by cols.ordinal_position;";
        } else if ($driver == "MYSQL") {
            $sql = "
                SELECT
                    cols.column_name as column_name,
                    cols.data_type as data_type,
                    cols.is_nullable as is_nullable,
                    cols.character_maximum_length as character_maximum_length,
                    cols.column_comment as description
                FROM INFORMATION_SCHEMA.COLUMNS cols
                WHERE table_schema=:schema AND table_name=:table
                ORDER BY ordinal_position;";
        } else if ($driver == "ORACLE") {
            $sql = "SELECT tc.column_name,
                    tc.data_type,
                    tc.nullable AS is_nullable,
                    CASE
                    WHEN tc.data_type = 'NUMBER' AND tc.data_precision IS NOT NULL
                    THEN tc.data_precision
                    WHEN tc.data_type LIKE '%CHAR%'
                    THEN tc.data_length
                    ELSE NULL
                    END character_maximum_length,
                    cc.comments AS description
                    FROM user_col_comments cc
                    JOIN user_tab_columns tc
                    ON cc.column_name = tc.column_name
                    AND cc.table_name = tc.table_name
                    WHERE cc.table_name = upper(:table) order by tc.column_id";
        }
        $ca->prepare($sql);
        $ca->bindValue(":table", $p["table"], true);
        $ca->bindValue(":schema", $db->getDatabaseName(), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $r = "";
        $ra = Array();
        if ($ca->size() == 0) {
            NWJSonRpcServer::error("La tabla " . $p["table"] . " no existe o está mal escrita. No se encontró en el catálogo del motor.");
        }
        $size = $ca->size();
        for ($i = 0; $i < $size; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $desc = explode(",", $r["description"]);
            if ($desc[0] == 0) {
                if ($desc[0] == "") {
                    if (isset($r["data_type"])) {
                        if ($r["data_type"] == "date") {
                            $desc[0] = "dateField";
                        } else if ($r["data_type"] == "integer") {
                            $desc[0] = "spinner";
                        }
                    }
                }
            }
            if (count($desc) > 0) {
                if (isset($desc[0]) && isset($desc[1])) {
                    if (($desc[0] == "selectBox" || $desc[0] == "tokenField" || $desc[0] == "selectTokenField") && ($desc[1] != "boolean" && $desc[1] != "array")) {
                        $arr = Array();
                        if ($driver == "ORACLE") {
                            $arr["column_name"] = "nombre_" . strtolower($r["column_name"]);
                        } else {
                            $arr["column_name"] = "nombre_" . $r["column_name"];
                        }
                        $arr["description"] = "ignore," . $desc[1];

                        try {
                            if (isset($desc[5]) && $desc[5] != "") {
                                $arr["alter_label"] = $desc[5];
                            }
                        } catch (Exception $exc) {
                            error_log($exc->getTraceAsString());
                        }

                        if (isset($desc[2])) {
                            if ($desc[2] == 'false') {
                                $arr["description"] = $arr["description"] . ",false";
                            }
                        }

                        $ra[] = $arr;
                        //TODO: SE OCULTA EL CAMPO QUE SÍ TENGA DESCRIPCIÓN
                        $desc[2] = 'false';
                    }
                }
            }
            if ($driver == "ORACLE") {
                $r["column_name"] = strtolower($r["column_name"]);
                $r["data_type"] = strtolower($r["data_type"]);
            }
            $r["description"] = implode(",", $desc);
            $ra[] = $r;
        }
        $rta = Array();
        $rta["cols"] = $ra;
        //TABLE DESCRIPTION FOR LISTS
        $rta["table_description"] = self::getTableDescription($p, $db);
        return $rta;
    }

    public static function getColumnsFromTable($table) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "SELECT a.column_name
                FROM information_schema.columns a where a.table_name='" . $table . "' order by a.ordinal_position;";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveNotifications($p) {
        nw_notifications::saveNotifications($p);
    }

    public static function getOnlyColumns($p) {
//        session::check();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $sql = "SELECT a.column_name as column_name
                FROM information_schema.columns a where a.table_name='" . $p["table"] . "' order by a.ordinal_position;";
        } else if ($driver == "MYSQL") {
            $sql = "SELECT a.column_name as column_name
                FROM INFORMATION_SCHEMA.COLUMNS a where a.table_schema=:schema and a.table_name='" . $p["table"] . "' order by a.ordinal_position;";
        } else if ($driver == "ORACLE") {
            $sql = "SELECT column_name
                FROM USER_TAB_COLUMNS WHERE table_name = upper('" . $p["table"] . "') order by column_id";
        }
        $ca->prepare($sql);
        $ca->bindValue(":schema", $db->getDatabaseName(), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $rta = $ca->assocAll();
        if ($driver == "ORACLE") {
            for ($i = 0; $i < count($rta); $i++) {
                $rta[$i]["column_name"] = strtolower($rta[$i]["column_name"]);
            }
        }
        return $rta;
    }

    public static function getOnlyColumnsAndTypes($p) {
        session::check();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $sql = "SELECT a.column_name, a.data_type
                FROM information_schema.columns a where a.table_name='" . $p["table"] . "' order by a.ordinal_position;";
        } else if ($driver == "MYSQL") {
            $sql = "SELECT 
                a.column_name as column_name, 
                a.data_type as data_type
                FROM INFORMATION_SCHEMA.COLUMNS a 
                where a.table_schema=:schema 
                and a.table_name='" . $p["table"] . "' order by a.ordinal_position;";
        } else if ($driver == "ORACLE") {
            $sql = "SELECT column_name, data_type
                FROM USER_TAB_COLUMNS WHERE table_name = upper('" . $p["table"] . "') order by column_id";
        }
        $ca->prepare($sql);
        $ca->bindValue(":schema", $db->getDatabaseName(), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $rta = $ca->assocAll();
        if ($driver == "ORACLE") {
            for ($i = 0; $i < count($rta); $i++) {
                $rta[$i]["column_name"] = strtolower($rta[$i]["column_name"]);
            }
        }
        return $rta;
    }

    public static function delete($p) {
        session::check();
        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        $where = "id=:id";
        if (isset($p["records"])) {
            if ((int) $p["records"] > 1) {
                $where = " id in (:id)";
                $str = "";
                $i = 0;
                foreach ($p["detail"] as $v) {
                    $str[] = $v["id"];
                    $i++;
                }
                $p["id"] = implode(",", $str);
            }
        }
        $ca->prepareDelete($p["table"], $where);
        $ca->bindValue(":id", $p["id"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function saveRecord($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $v = $p["records"];
        $sql = "insert into " . $p["table"] . " (" . $p["columns"] . ") ";
        $sql .= " VALUES ";
        foreach ($v as $key => $value) {
            if (strrpos($key, "_model") == false) {
                if (strrpos($key, "_text") == false) {
                    if (strrpos($key, "_array") == false) {
                        if (strrpos($key, "_value") == false) {
                            $sql .= " ('" . $key . "','" . $value . "'," . $si["empresa"] . ",'" . $si["usuario"] . "',CURRENT_DATE ),";
                        }
                    }
                }
            }
        }
        $ca->prepare(rtrim($sql, ","));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete($p["table"], "id=:id");
        $ca->bindValue(":id", $p["id"], false);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function updateSessionVariable($p) {
        if (isset($p["key"])) {
            if (isset($p["value"])) {
                $_SESSION[$p["key"]] = $p["value"];
            }
        }
    }

    public static function autoQuery($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        switch ($p["type"]) {
            case "update":
                $ca->prepareUpdate($p["table"], $p["fields"], $p["where"]);
                break;
            case "insert":
                $ca->prepareInsert($p["table"], $p["fields"]);
                break;
            case "select":
                $ca->prepareSelect($p["table"], $p["fields"], $p["where"]);
                break;

            default:
                break;
        }
        if ($p["type"] != "select") {
            $fields = explode(",", $p["fields"]);
            $values = explode(",", $p["values"]);
            for ($i = 0; $i < count($fields); $i++) {
                if ($fields[$i] != "id") {
                    if ($fields[$i] == "usuario") {
                        $ca->bindValue(":" . $fields[$i], $si["usuario"]);
                        continue;
                    }
                    if ($fields[$i] == "empresa") {
                        $ca->bindValue(":" . $fields[$i], $si["empresa"]);
                        continue;
                    }
                    if ($fields[$i] == "fecha") {
                        $ca->bindValue(":" . $fields[$i], date("Y-m-d"));
                        continue;
                    }
                    $ca->bindValue(":" . $fields[$i], $values[$i]);
                }
            }
        }
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($p["type"] == "select") {
            return $ca->assocAll();
        } else {
            return true;
        }
    }

    public static function save($p) {
        session::check();

        $si = session::getInfo();
        $columns = self::getOnlyColumnsAndTypes($p);
//        $columns = self::getOnlyColumns($p);

        $fields = "";

        for ($i = 0; $i < count($columns); $i++) {
            try {
                $impl = $columns[$i]["column_name"];
                if ($impl != "id") {
                    $fields .= $impl;
                    if ($i + 1 != count($columns)) {
                        $fields .= ",";
                    }
                }
            } catch (Exception $exc) {
                NWJSonRpcServer::error($exc->getTraceAsString());
            }
        }

        if (isset($p["useOtherDB"]) && $p["useOtherDB"] != null) {
            $db = self::findSavedDb($p["useOtherDB"]);
        } else {
            $db = NWDatabase::database();
        }

        $db->transaction();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();

        if (isset($p["cleanHtml"])) {
            $ca->cleanHtml = $p["cleanHtml"];
        }
        if (isset($p["cleanSpecialWords"])) {
            $ca->__haveAdvancedSecurity = $p["cleanSpecialWords"];
        }

        if ($p["id"] != "") {
            $id = $p["id"];
            $ca->prepareUpdate($p["table"], $fields, "id=:id");
            $ca->bindValue(":id", $id);
        } else {
            if (isset($p["uniqueFields"])) {
                if ($p["uniqueFields"] != "") {
                    $ra = explode(",", $p["uniqueFields"]);
                    for ($i = 0; $i < count($ra); $i++) {
                        $raz = $ra[$i];
                        if ($driver == "MYSQL") {
                            $ca->prepareSelect($p["table"], "*", "LOWER(cast(" . $raz . " as char))=LOWER(:field)");
                        } else if ($driver == "PGSQL") {
                            $where = " LOWER(" . $raz . "::text)=LOWER(:field::text) ";
                            for ($y = 0; $y < count($columns); $y++) {
                                $key = $columns[$y]["column_name"];
                                if ($key == "empresa") {
                                    $where .= " and empresa=:empresa ";
                                    $ca->bindValue(":" . $key, $si[$key]);
                                }
                            }
                            $ca->prepareSelect($p["table"], "*", $where);
                        } else if ($driver == "ORACLE") {
                            $ca->prepareSelect($p["table"], "*", "LOWER(CAST(" . $raz . " as VARCHAR2(100)))=LOWER(:field)");
                        }
                        $ca->bindValue(":field", $p[$raz]);
                        if (!$ca->exec()) {
                            NWJSonRpcServer::information($ca->lastErrorText());
                            return;
                        }
                        if ($ca->size() > 0) {
                            NWJSonRpcServer::information("El campo " . $raz . " se encuentra repetido");
                            return;
                        }
                    }
                }
            }
            if (isset($p["generateSequence"]) && $p["generateSequence"] == true) {
                $id = master::getNextSequence($p["table"] . "_id_seq", $db);
                $fields = "id," . $fields;
            }
            $ca->prepareInsert($p["table"], $fields);
            if (isset($p["generateSequence"]) && $p["generateSequence"] == true) {
                $ca->bindValue(":id", $id);
            }
        }

        for ($i = 0; $i < count($columns); $i++) {
            $key = $columns[$i]["column_name"];
            //$key = implode(",", $columns[$i]["column_name"]);
            if ($driver == "ORACLE") {
                $key = strtolower($key);
            }
            if ($key != "id") {
                if ($key == "empresa") {
                    $ca->bindValue(":" . $key, $si[$key]);
                } else if ($key == "empresa_cliente") {
                    $ca->bindValue(":" . $key, $si["cliente"]);
                } else if ($key == "usuario") {
                    $ca->bindValue(":" . $key, $si[$key]);
                } else if ($key == "pais") {
                    if (isset($p[$key])) {
                        $ca->bindValue(":" . $key, isset($p[$key]) ? $p[$key] : null, 'auto', true);
                    } else {
                        $ca->bindValue(":" . $key, isset($si[$key]) ? $si[$key] : null, false, true);
                    }
                } else if ($key == "fecha") {
                    if (isset($p[$key]) && $p[$key] != "") {
                        $ca->bindValue(":" . $key, $p[$key]);
                    } else {
                        if ($driver == "ORACLE") {
                            $ca->bindValue(":" . $key, NWUtils::getDate($db), false);
                        } else {
                            $ca->bindValue(":" . $key, date("Y-m-d H:i:s"));
                        }
                    }
                } else if ($key == "hora") {
                    if (isset($p[$key]) && $p[$key] != "") {
                        $ca->bindValue(":" . $key, $p[$key]);
                    } else {
                        if ($driver == "ORACLE") {
                            $ca->bindValue(":" . $key, NWUtils::getTime($db));
                        } else {
                            $ca->bindValue(":" . $key, date("H:i:s"));
                        }
                    }
                } else if (strpos($key, "hora") !== false && $p[$key] == "") {
                    if ($driver == "ORACLE") {
                        $ca->bindValue(":" . $key, NWUtils::getTime($db));
                    } else {
                        $ca->bindValue(":" . $key, date("H:i:s"));
                    }
                } else if (strpos($key, "fecha") !== false && $p[$key] == "") {
                    $ca->bindValue(":" . $key, null, true, true);
                } else {
                    if (isset($columns[$i]["data_type"]) && ($columns[$i]["data_type"] == "character varying" || $columns[$i]["data_type"] == "varchar" || $columns[$i]["data_type"] == "text")) {
                        $ca->bindValue(":" . $key, $p[$key] == "" ? 0 : $p[$key], true);
                    } else if (isset($columns[$i]["data_type"]) && ($columns[$i]["data_type"] == "integer" || $columns[$i]["data_type"] == "int")) {
                        $ca->bindValue(":" . $key, $p[$key] == "" ? 'null' : $p[$key], false);
                    } else {
                        $ca->bindValue(":" . $key, $p[$key] == "" ? 0 : $p[$key]);
                    }
                }
            }
        }
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }

        if (isset($p["sizeNavTable"]) && $p["sizeNavTable"] > 0) {
            if (is_countable($p["sizeNavTable"])) {
                for ($i = 0; $i < count($p["sizeNavTable"]); $i++) {
                    for ($ia = 0; $ia < count($p["detail" . $i]); $ia++) {
                        $d = $p["detail" . $i][$ia];
                        if ($p["id"] != "") {
                            $d["update"] = true;
                            $d["nw_save_sub_nav_table_new_id"] = $p["id"];
                        }
                        $d["id"] = $id;
                        $d["cleanHtml"] = $p["nav_table_cleanHtml" . $i];
                        $d["table"] = $p["detail_table" . $i];
                        $d["reference"] = $p["nav_table_referencie" . $i];
                        self::saveSubNavTable($d, $db);
                    }
                }
            }
        }

        $db->commit();
        if (isset($p["generateSequence"]) && $p["generateSequence"] == true) {
            return $id;
        } else {
            return true;
        }
    }

    public static function saveSubNavTable($p, $db) {
        session::check();
        $si = session::info();
        if (!isset($db) || is_array($db) || $db === null || $db === "") {
            $db = NWDatabase::database();
        }
        $ca = new NWDbQuery($db);
        if (isset($p["cleanHtml"])) {
            $ca->cleanHtml = $p["cleanHtml"];
        }
        $fields = "";
        $columns = self::getOnlyColumns($p);
        for ($i = 0; $i < count($columns); $i++) {
            if (implode(",", $columns[$i]) != "id") {
                $fields .= implode(",", $columns[$i]);
                if ($i + 1 != count($columns)) {
                    $fields .= ",";
                }
            }
        }
        if (isset($p["update"]) && $p["update"] == true && isset($p["nw_save_sub_nav_table_new_id"]) && $p["nw_save_sub_nav_table_new_id"] != null) {
            $ca->prepareUpdate($p["table"], $fields, "id=:id");
            $ca->bindValue(":id", $p["nw_save_sub_nav_table_new_id"]);
        } else {
            $ca->prepareInsert($p["table"], $fields);
        }
        for ($i = 0; $i < count($columns); $i++) {
            $key = implode(",", $columns[$i]);
            if ($key != "id") {
                if ($key == "empresa") {
                    $ca->bindValue(":" . $key, $si[$key]);
                } else if ($key == "usuario") {
                    $ca->bindValue(":" . $key, $si[$key]);
                } else if ($key == "pais") {
                    $ca->bindValue(":" . $key, isset($si[$key]) ? $si[$key] : null, false, true);
                } else if ($key == "fecha") {
                    $ca->bindValue(":" . $key, date("Y-m-d H:i:s"));
                } else if ($key == "hora") {
                    $ca->bindValue(":" . $key, date("H:i:s"));
                } else if (strpos($key, "hora") !== false && $p[$key] == "") {
                    $ca->bindValue(":" . $key, date("H:i:s"));
                } else if (strpos($key, "fecha") !== false && $p[$key] == "") {
                    $ca->bindValue(":" . $key, null, true, true);
                } else {
                    if ($key == $p["reference"]) {
                        $ca->bindValue(":" . $key, $p["id"]);
                    } else {
                        if (is_array($p[$key])) {
                            $ca->bindValue(":" . $key, $p[$key]["id"]);
                        } else {
                            $ca->bindValue(":" . $key, $p[$key]);
                        }
                    }
                }
            }
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function numToLetras($xcifra) {
        $xarray = array(0 => "Cero",
            1 => "UN", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE",
            "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISEIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE",
            "VEINTI", 30 => "TREINTA", 40 => "CUARENTA", 50 => "CINCUENTA", 60 => "SESENTA", 70 => "SETENTA", 80 => "OCHENTA", 90 => "NOVENTA",
            100 => "CIENTO", 200 => "DOSCIENTOS", 300 => "TRESCIENTOS", 400 => "CUATROCIENTOS", 500 => "QUINIENTOS", 600 => "SEISCIENTOS", 700 => "SETECIENTOS", 800 => "OCHOCIENTOS", 900 => "NOVECIENTOS"
        );
//
        $xcifra = trim($xcifra);
        $xlength = strlen($xcifra);
        $xpos_punto = strpos($xcifra, ".");
        $xaux_int = $xcifra;
        $xdecimales = "00";
        if (!($xpos_punto === false)) {
            if ($xpos_punto == 0) {
                $xcifra = "0" . $xcifra;
                $xpos_punto = strpos($xcifra, ".");
            }
            $xaux_int = substr($xcifra, 0, $xpos_punto); // obtengo el entero de la cifra a covertir
            $xdecimales = substr($xcifra . "00", $xpos_punto + 1, 2); // obtengo los valores decimales
        }

        $XAUX = str_pad($xaux_int, 18, " ", STR_PAD_LEFT); // ajusto la longitud de la cifra, para que sea divisible por centenas de miles (grupos de 6)
        $xcadena = "";
        for ($xz = 0; $xz < 3; $xz++) {
            $xaux = substr($XAUX, $xz * 6, 6);
            $xi = 0;
            $xlimite = 6; // inicializo el contador de centenas xi y establezco el l&#65533;mite a 6 d&#65533;gitos en la parte entera
            $xexit = true; // bandera para controlar el ciclo del While	
            while ($xexit) {
                if ($xi == $xlimite) { // si ya lleg&#65533; al l&#65533;mite máximo de enteros
                    break; // termina el ciclo
                }

                $x3digitos = ($xlimite - $xi) * -1; // comienzo con los tres primeros digitos de la cifra, comenzando por la izquierda
                $xaux = substr($xaux, $x3digitos, abs($x3digitos)); // obtengo la centena (los tres d&#65533;gitos)
                for ($xy = 1; $xy < 4; $xy++) { // ciclo para revisar centenas, decenas y unidades, en ese orden
                    switch ($xy) {
                        case 1: // checa las centenas
                            if (substr($xaux, 0, 3) < 100) { // si el grupo de tres d&#65533;gitos es menor a una centena ( < 99) no hace nada y pasa a revisar las decenas
                            } else {
                                $xseek = isset($xarray[substr($xaux, 0, 3)]) ? $xarray[substr($xaux, 0, 3)] : false; // busco si la centena es n&#65533;mero redondo (100, 200, 300, 400, etc..)
                                if ($xseek) {
                                    $xsub = self::subfijo($xaux); // devuelve el subfijo correspondiente (Mill&#65533;n, Millones, Mil o nada)
                                    if (substr($xaux, 0, 3) == 100)
                                        $xcadena = " " . $xcadena . " CIEN " . $xsub;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                    $xy = 3; // la centena fue redonda, entonces termino el ciclo del for y ya no reviso decenas ni unidades
                                } else { // entra aqu&#65533; si la centena no fue numero redondo (101, 253, 120, 980, etc.)
                                    $xseek = $xarray[substr($xaux, 0, 1) * 100]; // toma el primer caracter de la centena y lo multiplica por cien y lo busca en el arreglo (para que busque 100,200,300, etc)
                                    $xcadena = " " . $xcadena . " " . $xseek;
                                } // ENDIF ($xseek)
                            } // ENDIF (substr($xaux, 0, 3) < 100)
                            break;
                        case 2: // checa las decenas (con la misma l&#65533;gica que las centenas)
                            if (substr($xaux, 1, 2) < 10) {
                                
                            } else {
                                $xseek = isset($xarray[substr($xaux, 1, 2)]) ? $xarray[substr($xaux, 1, 2)] : false;
                                if ($xseek) {
                                    $xsub = self::subfijo($xaux);
                                    if (substr($xaux, 1, 2) == 20)
                                        $xcadena = " " . $xcadena . " VEINTE " . $xsub;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                                    $xy = 3;
                                } else {
                                    $xseek = $xarray[substr($xaux, 1, 1) * 10];
                                    if (substr($xaux, 1, 1) * 10 == 20)
                                        $xcadena = " " . $xcadena . " " . $xseek;
                                    else
                                        $xcadena = " " . $xcadena . " " . $xseek . " Y ";
                                } // ENDIF ($xseek)
                            } // ENDIF (substr($xaux, 1, 2) < 10)
                            break;
                        case 3: // checa las unidades
                            if (substr($xaux, 2, 1) < 1) { // si la unidad es cero, ya no hace nada
                            } else {
                                $xseek = $xarray[substr($xaux, 2, 1)]; // obtengo directamente el valor de la unidad (del uno al nueve)
                                $xsub = self::subfijo($xaux);
                                $xcadena = " " . $xcadena . " " . $xseek . " " . $xsub;
                            } // ENDIF (substr($xaux, 2, 1) < 1)
                            break;
                    } // END SWITCH
                } // END FOR
                $xi = $xi + 3;
            } // ENDDO

            if (substr(trim($xcadena), -5, 5) == "ILLON") // si la cadena obtenida termina en MILLON o BILLON, entonces le agrega al final la conjuncion DE
                $xcadena .= " DE";

            if (substr(trim($xcadena), -7, 7) == "ILLONES") // si la cadena obtenida en MILLONES o BILLONES, entoncea le agrega al final la conjuncion DE
                $xcadena .= " DE";

            // ----------- esta l&#65533;nea la puedes cambiar de acuerdo a tus necesidades o a tu pa&#65533;s -------
            if (trim($xaux) != "") {
                switch ($xz) {
                    case 0:
                        if (trim(substr($XAUX, $xz * 6, 6)) == "1")
                            $xcadena .= "UN BILLON ";
                        else
                            $xcadena .= " BILLONES ";
                        break;
                    case 1:
                        if (trim(substr($XAUX, $xz * 6, 6)) == "1")
                            $xcadena .= "UN MILLON ";
                        else
                            $xcadena .= " MILLONES ";
                        break;
                    case 2:
                        if ($xcifra < 1) {
                            $xcadena = "CERO PESOS ";
                        }
                        if ($xcifra >= 1 && $xcifra < 2) {
                            $xcadena = "UN PESO CON $xdecimales/100 MCTE.";
                        }
                        if ($xcifra >= 2) {
                            $xcadena .= " PESOS  CON $xdecimales/100 MCTE."; // 
                        }
                        break;
                } // endswitch ($xz)
            } // ENDIF (trim($xaux) != "")
            // ------------------      en este caso, para M&#65533;xico se usa esta leyenda     ----------------
            $xcadena = str_replace("VEINTI ", "VEINTI", $xcadena); // quito el espacio para el VEINTI, para que quede: VEINTICUATRO, VEINTIUN, VEINTIDOS, etc
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles 
            $xcadena = str_replace("UN UN", "UN", $xcadena); // quito la duplicidad
            $xcadena = str_replace("  ", " ", $xcadena); // quito espacios dobles 
            $xcadena = str_replace("BILLON DE MILLONES", "BILLON DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("BILLONES DE MILLONES", "BILLONES DE", $xcadena); // corrigo la leyenda
            $xcadena = str_replace("DE UN", "UN", $xcadena); // corrigo la leyenda
        } // ENDFOR	($xz)
        return trim($xcadena);
    }

// END FUNCTION

    public static function subfijo($xx) { // esta funci&#65533;n regresa un subfijo para la cifra
        $xx = trim($xx);
        $xstrlen = strlen($xx);
        if ($xstrlen == 1 || $xstrlen == 2 || $xstrlen == 3)
            $xsub = "";
        //	
        if ($xstrlen == 4 || $xstrlen == 5 || $xstrlen == 6)
            $xsub = "MIL";
        //
        return $xsub;
    }

    public static function getDataEquipoByIP($ipAdd = Array()) { // trae los datos del equipo registrado
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "ip=:ip";
        $ip = master::getRealIp();
        $id_red = "";
        if (isset($_SESSION["ip_real"])) {
            $ip = $_SESSION["ip_real"];
        } else if (isset($ipAdd["ip"])) {
            $ip = $ipAdd["ip"];
        }
        if (isset($ipAdd["ip"])) {
            $where .= " and id_red=:id_red ";
            $id_red = $ipAdd["id_red"];
        }
        if (isset($_SESSION["id_red"])) {
            $id_red = $_SESSION["id_red"];
        }
        $ca->prepareSelect("nw_equipos_ip", "*,func_concepto(terminal,'terminales') as nom_terminal", $where);
        $ca->bindValue(":ip", $ip, true, true);
        $ca->bindValue(":id_red", $id_red, true, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }
}
