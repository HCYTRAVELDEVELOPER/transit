<?php

//ini_set('session.cookie_httponly', 1);

class nw_session {

    public static function forgotPassword($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $mail = new PHPMailer();
        $body = "Para cambiar su contraseña";
        $mail->AddReplyTo("assdres@hotmail.com", "Webmaster NW");
        $mail->SetFrom('assdres@hotmail.com', 'Webmaster NW');
        $address = "direccion@netwoods.net";
        $mail->AddAddress($address, "Usuario");
        $mail->Subject = "Envío de contraseña temporal";
        $mail->AltBody = "Para ver correctamente este mensaje comuníquese con NW <netwoods.net>";
        $mail->MsgHTML($body);
        if (!$mail->Send()) {
            NWJSonRpcServer::information("Tuvimos un problema al enviar su clave. Por favor comuníquese con el administrador. ");
        } else {
            nw_security::updatefailedAccess($p);
            NWJSonRpcServer::information("En pocos minutos recibirá un correo con su contraseña.");
        }
    }

    public static function setEmpresa($p) {
        //ONLY FOR DEVICES
        if (isset($GLOBALS["sessionId"])) {
            if ($GLOBALS["sessionId"] != "") {
                session_commit();
                session_id($GLOBALS["sessionId"]);
                session_start($GLOBALS["sessionId"]);
            }
        }

        $ignoredkeys = Array("id", "id_usuario", "usuario_id", "nombre", "usuario", "cliente", "email", "sala", "foto", "ciudad", "bodega", "nom_bodega", "documento", "concurrency");

        $_SESSION["empresa"] = $p["empresa"];
        $_SESSION["nom_empresa"] = $p["nom_empresa"];

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepare("select * from nw_params where empresa=:empresa");
        $ca->bindValue(":empresa", $_SESSION["empresa"], false);
        if (!$ca->exec()) {
            error_log("No se consultaron los permisos adicionales: " . $ca->lastErrorText());
            NWJSonRpcServer::error("Error consultando los permisos adicionales. Comuníquese con el administrador.");
            return false;
        }
        $params = $ca->assocAll();
        unset($_SESSION["perms"]);
        if (!function_exists('is_countable')) {

            function is_countable($var) {
                return (is_array($var) || $var instanceof Countable);
            }

        }
        if (is_countable($params)) {
            for ($i = 0; $i < count($params); $i++) {
                $ra = $params[$i];
                $_SESSION["perms"][$ra["clave"]] = $ra["valor"];
            }
        }

        if (isset($p["model"])) {
            foreach ($p["model"] as $key => $value) {
                if (!in_array($key, $ignoredkeys)) {
                    $_SESSION["model"][$key] = $value;
                }
            }
        }

        if (isset($p["model"])) {
            if (isset($p["model"]["perfil"])) {
                if ($p["model"]["perfil"] != "") {
                    $_SESSION["perfil"] = $p["model"]["perfil"];
                }
            }
            if (isset($p["model"]["nom_perfil"])) {
                if ($p["model"]["nom_perfil"] != "") {
                    $_SESSION["nom_perfil"] = $p["model"]["nom_perfil"];
                }
            }
            if (isset($p["model"]["tipo_perfil"])) {
                if ($p["model"]["tipo_perfil"] != "") {
                    $_SESSION["tipo_perfil"] = $p["model"]["tipo_perfil"];
                }
            }
            if (isset($p["model"]["terminal"])) {
                if ($p["model"]["terminal"] != "") {
                    $_SESSION["terminal"] = $p["model"]["terminal"];
                }
            }
            if (isset($p["model"]["nom_terminal"])) {
                if ($p["model"]["nom_terminal"] != "") {
                    $_SESSION["nom_terminal"] = $p["model"]["nom_terminal"];
                }
            }

            if (isset($p["model"]["pais"])) {
                if ($p["model"]["pais"] != "") {
                    $_SESSION["pais"] = $p["model"]["pais"];
                }
            }
            if (isset($p["model"]["pais_nombre"])) {
                if ($p["model"]["pais_nombre"] != "") {
                    $_SESSION["pais_nombre"] = $p["model"]["pais_nombre"];
                }
            }
            if (isset($p["model"]["zona_horaria"])) {
                if ($p["model"]["zona_horaria"] != "") {
                    $_SESSION["zona_horaria"] = $p["model"]["zona_horaria"];
                }
            }
            if (isset($p["model"]["idioma_text"])) {
                if ($p["model"]["idioma_text"] != "") {
                    $_SESSION["idioma"] = $p["model"]["idioma_text"];
                }
            }
            if (isset($p["model"]["logo"])) {
                if ($p["model"]["logo"] != "") {
                    $_SESSION["logo"] = $p["model"]["logo"];
                }
            }
            if (isset($p["model"]["web"])) {
                if ($p["model"]["web"] != "") {
                    $_SESSION["web"] = $p["model"]["web"];
                }
            }
        }
        if (isset($_SESSION["nom_perfil"])) {
            setcookie("nom_perfil", $_SESSION["perfil"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["perfil"])) {
            setcookie("perfil", $_SESSION["perfil"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["pais"])) {
            setcookie("pais", $_SESSION["pais"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["pais_nombre"])) {
            setcookie("pais_nombre", $_SESSION["pais_nombre"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["idioma"])) {
            setcookie("idioma", $_SESSION["idioma"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["zona_horaria"])) {
            setcookie("zona_horaria", $_SESSION["zona_horaria"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["logo"])) {
            setcookie("logo", $_SESSION["logo"], time() + (60 * 60 * 24 * 365));
        }
        if (isset($_SESSION["web"])) {
            setcookie("web", $_SESSION["web"], time() + (60 * 60 * 24 * 365));
        }
        setcookie("empresa", $p["empresa"], time() + (60 * 60 * 24 * 365));
        setcookie("nom_empresa", $p["nom_empresa"], time() + (60 * 60 * 24 * 365));

        $checkConcurrency = true;

        if (isset($p["checkConcurrency"])) {
            $checkConcurrency = $p["checkConcurrency"];
        }

        if ($checkConcurrency) {
            $sec = nw_security::getData();
            if (isset($sec["concurrency"]) && $sec["concurrency"] == "NO") {
                if (!isset($_SESSION["usuario"]) || $_SESSION["usuario"] == "") {
                    $arr = Array();
                    $arr["concurrency"] = true;
                    $arr["msg"] = "";
                    return $arr;
                }
                $con = nw_security::getConnectedUser10Min($p["empresa"]);
                if ($con !== false) {
                    session_unset();
                    session_destroy();
                    session_write_close();
                    setcookie(session_name(), '', 0, '/');
                    @session_regenerate_id(true);
                    unset($_SESSION['empresa']);
                    unset($_SESSION['usuario']);
                    unset($_COOKIE['id_user']);
                    setcookie("id_user", '', time() - 3600);
                    unset($_COOKIE['marca']);
                    unset($_COOKIE['empresa']);
                    $arr = Array();
                    $arr["session_id"] = $con["session_id"];
                    $arr["concurrency"] = true;
                    $arr["msg"] = "Ya tiene una conexión abierta. La normatividad actual no permite la concurrencia de usuarios. <br />¿Desea cerrar la sesión anteriormente abierta?";
                    return $arr;
                }
            }
        }
        if (!isset($p["verifyAccount"])) {
            self::enterUser();
        }
        return $_SESSION;
    }

    public static function liberarUsuario($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareInsert("usuarios_log", "usuario,fecha,ip,accion,session_id");
        $ca->bindValue(":usuario", $p["usuario"]);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha", "NOW()", false);
        } else {
            $ca->bindValue(":fecha", "now()", false);
        }
        $ca->bindValue(":ip", self::getRealIpAddr(), true);
        $ca->bindValue(":accion", "INGRESO", true);
        $ca->bindValue(":session_id", session_id(), true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se ingresó su visita al log. \n SQL: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function getEmpresas($p) {
        $si = self::getInfo();
        if (!isset($si["usuario"])) {
            error_log("Error en getEmpresas::: No se encuentra el usuario en las variables de sesión. Es probable que la autenticación no fue exitosa en el paso anterior.");
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "MYSQL") {
            $sql = "select 
                distinct 
                b.*,                
                a.empresa as id,
                b.logo,
                b.web,
                b.razon_social as nombre,
                c.change_at_init,
                CASE WHEN a.perfil IS NULL then d.perfil else a.perfil END as perfil,
                e.nombre as nom_perfil,
                e.tipo as tipo_perfil,
                a.terminal,
                f.nombre as nom_terminal,
                d.cambio_clave,
                b.pais,
                g.nombre as pais_nombre,
                g.zona_horaria,
                g.idioma_text
            from usuarios_empresas a
                left join empresas b on (a.empresa = b.id)
                left join nw_keys_conf c on (1=1) 
                left join usuarios d on (a.usuario=d.usuario and d.estado='activo')
                left join perfiles e on (a.perfil=e.id)
                left join terminales f on (a.terminal=f.id)
                left join paises g on (b.pais=g.id)
            where a.usuario =:usuario order by b.razon_social";
        } else {
            $sql = "select 
                distinct 
                b.*,
                a.empresa as id,
                b.logo,
                b.web,
                b.razon_social as nombre,
                c.change_at_init,
                CASE WHEN a.perfil IS NULL then d.perfil else a.perfil END as perfil,
                CASE WHEN a.perfil IS NULL then func_concepto(d.perfil,'perfiles') else e.nombre END as nom_perfil,
                e.tipo as tipo_perfil,
                a.terminal,
                f.nombre as nom_terminal,
                d.cambio_clave,
                b.pais,
                g.nombre as pais_nombre,
                g.zona_horaria,
                g.idioma_text
            from usuarios_empresas a
                left join empresas b on (a.empresa = b.id)
                left join nw_keys_conf c on (1=1) 
                left join usuarios d on (a.usuario=d.usuario and d.estado='activo')
                join perfiles e on (a.perfil=e.id)
                left join terminales f on (a.terminal=f.id)
                left join paises g on (b.pais=g.id)
            where a.usuario =:usuario order by b.razon_social";
        }
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            error_log("No se pudo consultar las empresas asociadas: " . $ca->lastErrorText());
            NWJSonRpcServer::error("Error consultando la información de empresas. Comuníquese con el administrador.");
            return false;
        }

        $rta = $ca->assocAll();
        return $rta;
    }

    public static function consulta($p) {

        if (!isset($p["usuario"])) {
            NWJSonRpcServer::information("Debe ingresar su usuario");
            return false;
        }
        if (!isset($p["clave"])) {
            NWJSonRpcServer::information("Debe ingresar su clave");
            return false;
        }
        if ($p["usuario"] == "") {
            NWJSonRpcServer::information("Debe ingresar su usuario");
            return false;
        }
        if ($p["clave"] == "") {
            NWJSonRpcServer::information("Debe ingresar su clave");
            return false;
        }

        $sec = nw_security::getData();

        if (isset($sec["block_fail_access"])) {

            if ($sec["block_fail_access"] !== "" && $sec["block_fail_access"] !== 0) {
                $tryes = nw_security::getFailedAccess($p);
                if ($tryes != false) {
                    $time_failed = explode(":", $tryes["max_hora"]);
                    if (isset($time_failed[1])) {
                        if (((int) $time_failed[1]) >= (int) $sec["minutes_blocked_fail_access"]) {
                            nw_security::updatefailedAccess($p);
                        } else {
                            if (((int) $tryes["failed_access"] - 1) >= (int) $sec["block_fail_access"]) {
                                $minutes = "minutos";
                                if ((int) $sec["minutes_blocked_fail_access"] == 1) {
                                    $minutes = "minuto";
                                }
                                NWJSonRpcServer::information(sprintf("Superó el número máximo de intentos. Podrá volver a ingresar en %s " . $minutes, (int) $sec["minutes_blocked_fail_access"] - ((int) $time_failed[1])));
                                return false;
                            }
                        }
                    }
                }
            }
        }

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $estado = "activo";
        $empresa = null;
        $perfil = null;
        $where = "where a.usuario=:usuario ";
        $where .= " and (a.estado=:estado or a.estado='registrado_sin_validacion')";
        if (isset($p["estado"])) {
            $estado = $p["estado"];
        }
        if (isset($p["pedir_empresa"])) {
            if ($p["pedir_empresa"] !== null && $p["pedir_empresa"] !== false && $p["pedir_empresa"] !== "") {
                $empresa = $p["pedir_empresa"];
                $where .= " and a.empresa=:empresa";
            }
        }
        if (isset($p["perfil_send"])) {
            if ($p["perfil_send"] !== null && $p["perfil_send"] !== false && $p["perfil_send"] !== "") {
                $perfil = $p["perfil_send"];
                $where .= " and a.perfil=:perfil";
            }
        }
        $clave = null;
        if (isset($p["conclave"])) {
            $where .= " and a.clave=:clave";
            $clave = NWUtils::encrypt($p["conclave"]);
            $p["clave"] = NWUtils::encrypt($p["conclave"]);
        }
        $table = "usuarios";
        $sql = "select 
                a.*
               from {$table} a {$where} ";
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $p["usuario"], true);
        $ca->bindValue(":estado", $estado, true);
        $ca->bindValue(":empresa", $empresa, true);
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":clave", $clave);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            $p["error_description"] = "Se a presentado un error en su usuario o clave. Error:" . $ca->lastErrorText();
            nw_security::setFailAccess($p, true);
            NWJSonRpcServer::information("Se a presentado un error en su usuario o clave, comuníquese con el administrador.");
            return false;
        }

        if ($ca->size() == 0) {
            error_log("El tamaño de la consulta inicial por usuario de NWDbQuery es 0");
            $p["error_description"] = "Se a presentado un error en su usuario o clave. Error:" . $ca->lastErrorText();
            nw_security::setFailAccess($p);
            NWJSonRpcServer::information("Error en su usuario o clave");
            return false;
        }

        $ca->next();
        $r = $ca->assoc();

        if ($r["clave"] == $p["clave"]) {
            if ($r["estado"] != "INACTIVO") {
                if (isset($sec["inactivity_days"])) {
                    if ($sec["inactivity_days"] != "" && $sec["inactivity_days"] != 0) {
                        $ra = nw_security::getDaysNotEntered($p);
                        if ($ra != null && $ra != false) {
                            if ($ra >= $sec["inactivity_days"]) {
                                NWJSonRpcServer::information("Su clave a vencido por inactividad. Comuníquese con el administrador");
                                return false;
                            }
                        }
                    }
                }

                nw_security::updatefailedAccess($p);

                if (session_id() == "") {
                    session_start();
                }

                $_SESSION["id"] = $r["id"];
                $_SESSION["id_usuario"] = $r["id"];
                $_SESSION["usuario_id"] = $r["id"];
                $_SESSION["nombre"] = $r["nombre"];
                $_SESSION["usuario"] = $r["usuario"];
                if (isset($sec["check_terminal"]) && $sec["check_terminal"] === true) {
                    $userIp = master::getRealIp();
                    $sql = "select 
                            a.id,
                            a.terminal,
                            a.mac,      
                            a.estacion,
                            a.otro,
                            b.nombre as nombre_terminal
                                from 
                            nw_equipos_ip a
                            left join terminales b on (a.terminal=b.id) where ip=:ip";
                    $ca->prepare($sql);
                    $ca->bindValue(":ip", $userIp, true);
                    if (!$ca->exec()) {
                        error_log("La tabla de ip's vs sedes tiene problemas de consulta. Verifique con el administrador" . $ca->lastErrorText());
                        NWJSonRpcServer::error("La tabla de ip's vs sedes tiene problemas de consulta. Verifique con el administrador");
                        return false;
                    }
                    if ($ca->size() == 0) {
                        $_SESSION["terminal"] = $r["terminal"];
                        $_SESSION["nom_terminal"] = $r["nom_terminal"];
                    } else {
                        $ca->next();
                        $rr = $ca->assoc();
                        $_SESSION["terminal"] = $rr["terminal"];
                        $_SESSION["nom_terminal"] = $rr["nombre_terminal"];
                    }
                }

                $_SESSION["cliente"] = $r["cliente"];
                $_SESSION["email"] = $r["email"];
                if (isset($r["sala"])) {
                    $_SESSION["sala"] = $r["sala"];
                }
                if (isset($r["foto"])) {
                    $_SESSION["foto"] = $r["foto"];
                }
                if (isset($r["ciudad"])) {
                    $_SESSION["ciudad"] = $r["ciudad"];
                }
                if (isset($r["bodega"])) {
                    $_SESSION["bodega"] = $r["bodega"];
                }
                if (isset($r["nom_bodega"])) {
                    $_SESSION["nom_bodega"] = $r["nom_bodega"];
                }
                if (isset($r["documento"])) {
                    $_SESSION["documento"] = $r["documento"];
                }
                if (isset($sec["concurrency"])) {
                    $_SESSION["concurrency"] = $sec["concurrency"];
                }
                $rta = Array();
                $rta["id"] = $r["id"];
                $rta["nombre"] = $r["nombre"];
                $rta["usuario"] = $r["usuario"];
                $rta["cliente"] = $r["cliente"];
                $rta["email"] = $r["email"];
                if (isset($r["bodega"])) {
                    $rta["bodega"] = $r["bodega"];
                }
                if (isset($r["ciudad"])) {
                    $rta["ciudad"] = $r["ciudad"];
                }
                if (isset($r["terminal"])) {
                    $rta["terminal"] = $r["terminal"];
                }
                if (isset($r["empresa"])) {
                    $rta["empresa"] = $r["empresa"];
                }
                if (isset($r["nom_bodega"])) {
                    $rta["nom_bodega"] = $r["nom_bodega"];
                }
                if (isset($r["foto"])) {
                    $rta["foto"] = $r["foto"];
                }
                if (isset($p["conclave"])) {
                    if (isset($r["empresa"]) && $r["empresa"] !== "" && $r["empresa"] !== null) {
                        $rta["empresa"] = $r["empresa"];
                    }
                }
                if (isset($r["cambio_clave"])) {
                    $_SESSION["cambio_clave"] = $r["cambio_clave"];
                    $rta["cambio_clave"] = $r["cambio_clave"];
                }
                //PARA UNA VERIFICACIÓN DE DOMINIOS IDÉNTICOS
                $rta["domain_server"] = $_SERVER["HTTP_HOST"];
                if (isset($r["documento"])) {
                    $rta["documento"] = $r["documento"];
                }

                if (isset($p["isDevice"])) {
                    if ($p["isDevice"] === true) {
                        $rta["sessionId"] = session_id();
                    }
                }

                setcookie("session_id", session_id(), time() + (60 * 60 * 24 * 365));

                if (isset($p["no_close"])) {
                    if ($p["no_close"] === true || $p["no_close"] === "true") {
                        mt_srand(time());
                        $rand = nwMaker::random(1000000, 9999999);

                        $ca->prepareUpdate("usuarios", "cookie", "id=id and usuario=:usuario");
                        $ca->bindValue(":id", $r["id"]);
                        $ca->bindValue(":usuario", $r["usuario"], true);
                        $ca->bindValue(":cookie", $rand);
                        if (!$ca->exec()) {
                            error_log("File: session.php. ERROR: " . $ca->lastErrorText());
                            NWJSonRpcServer::error("Error al actualizar una cookie. Comuníquese con el administrador.");
                            return false;
                        }
                        $time_left = 2678400;
                        setcookie("id_user", $r["id"], time() + $time_left);
                        setcookie("usuario_id", $r["id"], time() + $time_left);
                        setcookie("usuario_name", $r["usuario"], time() + $time_left);
                        setcookie("marca", $rand, time() + $time_left);

                        $rta["marca_cookie"] = $rand;
                    }
                }
                return $rta;
            } else {
                error_log("Su cuenta está inactiva. Comuníquese con el administrador.");
                $p["error_description"] = "Su cuenta está inactiva. Comuníquese con el administrador.";
                nw_security::setFailAccess($p);
                NWJSonRpcServer::information("Su cuenta está inactiva. Comuníquese con el administrador.");
                return false;
            }
        } else {
            error_log("La clave es incorrecta para el usuario {$p['usuario']}");
            $p["error_description"] = "Error en su usuario o clave";
            nw_security::setFailAccess($p);
            return false;
        }
    }

    public static function closePreviousSession($p) {

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
            session_unset();
        }

        session_id($p["session_id"]);
        session_start();
        unset($_SESSION);
        session_destroy();
        session_unset();
        session_write_close();

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("usuarios_log", "accion", "session_id=:session_id");
        $ca->bindValue(":accion", "SALIDA", true);
        $ca->bindValue(":session_id", $p["session_id"], true);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
            return false;
        }

        return true;
    }

    public static function salir($p) {

        self::leaveUser($p);

        // ALEXF CONFIRMA 2 MAR
//        nwMaker::closeSession();

        if (isset($_COOKIE['nwlibVersion'])) {
            unset($_COOKIE['nwlibVersion']);
            setcookie('nwlibVersion', '', time() - 3600);
        }
        if (isset($_COOKIE['id_user'])) {
            unset($_COOKIE['id_user']);
            setcookie('id_user', '', time() - 3600);
        }
        if (isset($_COOKIE['usuario_id'])) {
            unset($_COOKIE['usuario_id']);
            setcookie('usuario_id', '', time() - 3600);
        }
        if (isset($_COOKIE['usuario_name'])) {
            unset($_COOKIE['usuario_name']);
            setcookie('usuario_name', '', time() - 3600);
        }
        if (isset($_COOKIE['marca'])) {
            unset($_COOKIE['marca']);
            setcookie('marca', '', time() - 3600);
        }
        if (isset($_COOKIE['empresa'])) {
            unset($_COOKIE['empresa']);
            setcookie('empresa', '', time() - 3600);
        }
        if (isset($_COOKIE['pais'])) {
            unset($_COOKIE['pais']);
            setcookie('pais', '', time() - 3600);
        }
        if (isset($_COOKIE['pais_name'])) {
            unset($_COOKIE['pais_name']);
            setcookie('pais_name', '', time() - 3600);
        }
        if (isset($_COOKIE['nom_empresa'])) {
            unset($_COOKIE['nom_empresa']);
            setcookie('nom_empresa', '', time() - 3600);
        }
        if (isset($_COOKIE['perfil'])) {
            unset($_COOKIE['perfil']);
            setcookie('perfil', '', time() - 3600);
        }
        if (isset($_COOKIE['nom_perfil'])) {
            unset($_COOKIE['nom_perfil']);
            setcookie('nom_perfil', '', time() - 3600);
        }

        session_regenerate_id();
        session_destroy();
        session_start();
        $_SESSION = array();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        return true;
    }

    public static function enterUser() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();

        if (!isset($si["usuario"])) {
            return false;
        }
        if (!isset($si["terminal"])) {
            return false;
        }
        if (!isset($si["empresa"])) {
            return false;
        }

        $ca->prepareInsert("usuarios_log", "usuario,fecha,ip,accion,empresa,terminal,session_id");
        $ca->bindValue(":usuario", $si["usuario"], true);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP", false);
        } else if ($db->getDriver() == "PGSQL") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
        } else if ($db->getDriver() == "MYSQL") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
        }
        $ca->bindValue(":ip", self::getRealIpAddr(), true);
        $ca->bindValue(":accion", "INGRESO", true);
        $ca->bindValue(":empresa", $si["empresa"], false, true);
        $ca->bindValue(":terminal", $si["terminal"], false, true);
        $ca->bindValue(":session_id", session_id(), true);

        if (!$ca->exec()) {
            error_log("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
            NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
            return false;
        }

        $ca->clear();

//        $ca->prepareSelect("nw_control_acceso", "MAX(id) as id");
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
//            return false;
//        }
//        $ca->next();
//        $rr = $ca->assoc();
//        $id_ca = $rr["id"] == "" ? 1 : $rr["id"] + 1;
//
//        $ca->clear();
//
//        $ca->prepareInsert("nw_control_acceso", "id,usuario,fecha,fecha_dia,hora,ip,accion,empresa,hora_ingreso");
//        $ca->bindValue(":id", $id_ca);
//        $ca->bindValue(":usuario", $si["usuario"], true);
//        if ($db->getDriver() == "ORACLE") {
//            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP", false);
//            $ca->bindValue(":fecha_dia", NWUtils::getDate($db), false);
//            $ca->bindValue(":hora", NWUtils::getDate($db), false);
//            $ca->bindValue(":hora_ingreso", NWUtils::getDate($db), false);
//        } else {
//            $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
//            $ca->bindValue(":fecha_dia", date("Y-m-d"));
//            $ca->bindValue(":hora", date("H:i:s"));
//            $ca->bindValue(":hora_ingreso", date("H:i:s"));
//        }
//        $ca->bindValue(":ip", self::getRealIpAddr(), true);
//        $ca->bindValue(":accion", "INGRESO", true);
//        $ca->bindValue(":empresa", $si["empresa"], false, true);
//        if (!$ca->exec()) {
//            if ($db->getDriver() != "ORACLE") {
//                NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
//            }
//            return false;
//        }

        $ca->prepareUpdate("usuarios", "conectado", "usuario=:usuario");
        $ca->bindValue(":conectado", "SI");
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function leaveUser($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $usuario = "";
        if (!isset($si["usuario"])) {
            if (!isset($p["user"])) {
                return;
            }
            $usuario = $p["user"];
        } else {
            $usuario = $si["usuario"];
        }
        $empresa = 0;
        if (isset($si["empresa"])) {
            $empresa = $si["empresa"];
        } else {
            if ($p["company"] !== null) {
                $empresa = $p["company"];
            }
        }
        if (!isset($si["terminal"])) {
            $terminal = 0;
        } else {
            $terminal = $si["terminal"];
        }
        $ca->prepareInsert("usuarios_log", "usuario,fecha,ip,accion,empresa,terminal,session_id");
        $ca->bindValue(":usuario", $usuario, true);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP", false);
        } else if ($db->getDriver() == "PGSQL") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
        } else if ($db->getDriver() == "MYSQL") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
        }
        $ca->bindValue(":ip", self::getRealIpAddr(), true);
        $ca->bindValue(":accion", "SALIDA", true);
        $ca->bindValue(":empresa", $empresa == '' ? 0 : $empresa, false, true);
        $ca->bindValue(":terminal", $terminal == '' ? 0 : $terminal, false, true);
        $ca->bindValue(":session_id", session_id(), true);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
            return false;
        }

//        $ca->prepareSelect("nw_control_acceso", "MAX(id) as id");
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("No se ingresó su visita al log. \n Error: " . $ca->lastErrorText());
//            return false;
//        }
//        $ca->next();
//        $rr = $ca->assoc();
//        $id_ca = $rr["id"] == "" ? 1 : $rr["id"] + 1;
//
//        $ca->prepareInsert("nw_control_acceso", "id,usuario,fecha,ip,accion,empresa,fecha_dia,hora,hora_salida");
//        $ca->bindValue(":id", $id_ca);
//        $ca->bindValue(":usuario", $usuario, true);
//        if ($db->getDriver() == "ORACLE") {
//            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP", false);
//            $ca->bindValue(":fecha_dia", NWUtils::getDate($db), false);
//            $ca->bindValue(":hora", NWUtils::getDate($db), false);
//            $ca->bindValue(":hora_salida", NWUtils::getDate($db), false);
//        } else if ($db->getDriver() == "MYSQL") {
//            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
//            $ca->bindValue(":fecha_dia", "CURRENT_DATE");
//            $ca->bindValue(":hora", date("H:i:s"));
//            $ca->bindValue(":hora_salida", date("H:i:s"));
//        } else {
//            $ca->bindValue(":fecha", NWUtils::getDateTime($db));
//            $ca->bindValue(":fecha_dia", NWUtils::getDate($db));
//            $ca->bindValue(":hora", NWUtils::getTime($db));
//            $ca->bindValue(":hora_salida", NWUtils::getTime($db));
//        }
//        $ca->bindValue(":ip", self::getRealIpAddr(), true);
//        $ca->bindValue(":accion", "SALIDA", true);
//        $ca->bindValue(":empresa", $empresa == '' ? 0 : $empresa, false, true);
//
//        if (!$ca->exec()) {
//            NWJSonRpcServer::error("No se ingresó su visita al log. \n SQL: " . $ca->lastErrorText());
//            return false;
//        }
        $ca->prepareUpdate("usuarios", "conectado", "usuario=:usuario");
        $ca->bindValue(":conectado", "NO");
        $ca->bindValue(":usuario", $usuario, true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function check() {
        if (!isset($_SERVER['HTTP_HOST'])) {
            return true;
        }
        $si = self::getInfo();
        if (!isset($si["usuario"]) || !isset($si["empresa"])) {
            $data["code"] = 10;

            $id_user = filter_input(INPUT_COOKIE, 'id_user');
            $marca = filter_input(INPUT_COOKIE, 'marca');
            $empresa = filter_input(INPUT_COOKIE, 'empresa');

            if (isset($id_user) && isset($marca) && isset($empresa)) {
                if ($id_user !== "" && $marca !== "" && $empresa !== "") {
                    $db = NWDatabase::database();
                    $ca = new NWDbQuery($db);
                    $sql = "select 
                        a.*
                        from usuarios a 
                        where a.id=:id and a.cookie=:cookie and a.cookie is not null and estado='activo' ";
                    $ca->prepare($sql);
                    $ca->bindValue(":id", $id_user);
                    $ca->bindValue(":cookie", $marca, false);
                    $ca->exec();
                    if ($ca->size() > 0) {
                        $ca->next();
                        $r = $ca->assoc();

                        if (!session_id()) {
                            session_start();
                        }

                        $_SESSION["id"] = $r["id"];
                        $_SESSION["id_usuario"] = $r["id"];
                        $_SESSION["usuario_id"] = $r["id"];
                        $_SESSION["nombre"] = $r["nombre"];
                        $_SESSION["usuario"] = $r["usuario"];
                        $_SESSION["cliente"] = $r["cliente"];
                        $_SESSION["email"] = $r["email"];
                        if (isset($r["sala"])) {
                            $_SESSION["sala"] = $r["sala"];
                        }
                        if (isset($r["foto"])) {
                            $_SESSION["foto"] = $r["foto"];
                        }
                        if (isset($r["ciudad"])) {
                            $_SESSION["ciudad"] = $r["ciudad"];
                        }
                        if (isset($r["bodega"])) {
                            $_SESSION["bodega"] = $r["bodega"];
                        }
                        if (isset($r["nom_bodega"])) {
                            $_SESSION["nom_bodega"] = $r["nom_bodega"];
                        }
                        if (isset($r["documento"])) {
                            $_SESSION["documento"] = $r["documento"];
                        }
                        if (isset($sec["concurrency"])) {
                            $_SESSION["concurrency"] = $sec["concurrency"];
                        }

                        setcookie("session_id", session_id(), time() + (60 * 60 * 24 * 365));

                        $companyData = self::getEmpresas($r);

                        if (count($companyData) == 0) {
                            $_SESSION["id"] = "";
                            $_SESSION["nombre"] = "";
                            $_SESSION["usuario"] = "";
                            $_SESSION["terminal"] = "";
                            $_SESSION["nom_terminal"] = "";
                            $_SESSION["perfil"] = "";
                            $_SESSION["nom_perfil"] = "";
                            $_SESSION["cliente"] = "";
                            $_SESSION["email"] = "";
                            $_SESSION["documento"] = "";
                            $_SESSION["empresa"] = "";
                            self::salir();
                            return false;
                        } else {
                            $finded = false;
                            for ($i = 0; $i < count($companyData); $i++) {
                                if ($companyData[$i]["id"] == $empresa) {
                                    if (isset($companyData[$i]["model"])) {
                                        $companyData[$i]["model"] = $companyData[$i]["model"];
                                    } else {
                                        $companyData[$i]["model"] = $companyData[$i];
                                    }
                                    $ri = $companyData[$i];
                                    $ri["empresa"] = $ri["id"];
                                    $ri["nom_empresa"] = $ri["nombre"];
                                    $ri["checkConcurrency"] = false;
                                    $sa = self::setEmpresa($ri);
                                    $finded = true;
                                    $si = session::getInfo();
                                    return true;
                                }
                            }
                            if (!$finded) {
                                self::invalidSession($data);
                            }
                        }
                        return true;
                    } else {
                        self::invalidSession($data);
                        return false;
                    }
                }
            }
            self::invalidSession($data);
            return false;
        }
        return true;
    }

    public static function invalidSession($data) {
        $p = Array();
        $session_id = filter_input(INPUT_COOKIE, 'session_id');
        $p["session_id"] = $session_id;
        self::closePreviousSession($p);

        if (isset($_SERVER['HTTP_COOKIE'])) {
            $cookies = explode(';', $_SERVER['HTTP_COOKIE']);
            foreach ($cookies as $cookie) {
                $parts = explode('=', $cookie);
                $name = trim($parts[0]);
                setcookie($name, '', time() - 1000);
                setcookie($name, '', time() - 1000, '/');
            }
        }

        if (class_exists('NWJSonRpcServer')) {
            NWJSonRpcServer::error("Sesión Inválida", $data);
        }
    }

    public static function isSessionStarted($p) {

//        if (session_id() == "") {
//            session_start();
//        }

        $si = self::info();

        if (!isset($si["usuario"]) || !isset($si["empresa"])) {
            if (isset($_COOKIE['id_user']) && isset($_COOKIE['marca']) && isset($_COOKIE["empresa"])) {
//                NWJSonRpcServer::information($_COOKIE['id_user']);
                if ($_COOKIE['id_user'] != "" || $_COOKIE['marca'] != "" && $_COOKIE["empresa"] != "") {
                    $db = NWDatabase::database();
                    $ca = new NWDbQuery($db);
                    $sql = "select 
                        a.*,
                        a.perfil,
                        b.nombre as nom_perfil,
                        c.nombre as nom_terminal
                        from usuarios a 
                        left join perfiles b on (a.perfil=b.id)
                        left join terminales c on (a.terminal=c.id)
                        where a.id=:id and a.cookie=:cookie and a.cookie is not null and a.estado='activo' ";
                    $ca->prepare($sql);
                    $ca->bindValue(":id", $_COOKIE["id_user"]);
                    $ca->bindValue(":cookie", $_COOKIE["marca"], false);
                    if (!$ca->exec()) {
                        error_log($ca->lastErrorText());
                        return false;
                    }
                    if ($ca->size() > 0) {
                        $ca->next();
                        $r = $ca->assoc();
                        $_SESSION["id"] = $r["id"];
                        $_SESSION["id_usuario"] = $r["id"];
                        $_SESSION["usuario_id"] = $r["id"];
                        $_SESSION["nombre"] = $r["nombre"];
                        $_SESSION["usuario"] = $r["usuario"];
                        $_SESSION["terminal"] = $r["terminal"];
                        $_SESSION["nom_terminal"] = $r["nom_terminal"];
                        $_SESSION["perfil"] = $r["perfil"];
                        $_SESSION["nom_perfil"] = $r["nom_perfil"];
                        $_SESSION["cliente"] = $r["cliente"];
                        $_SESSION["email"] = $r["email"];
                        if (isset($r["sala"])) {
                            $_SESSION["sala"] = $r["sala"];
                        }
//                        if (isset($r["pais"])) {
//                            $_SESSION["pais"] = $r["pais"];
//                        }
//                        if (isset($r["pais_name"])) {
//                            $_SESSION["pais_name"] = $r["pais_name"];
//                        }
                        if (isset($r["foto"])) {
                            $_SESSION["foto"] = $r["foto"];
                        }
                        if (isset($r["ciudad"])) {
                            $_SESSION["ciudad"] = $r["ciudad"];
                        }
                        if (isset($r["bodega"])) {
                            $_SESSION["bodega"] = $r["bodega"];
                        }
                        if (isset($r["nom_bodega"])) {
                            $_SESSION["nom_bodega"] = $r["nom_bodega"];
                        }
                        if (isset($r["documento"])) {
                            $_SESSION["documento"] = $r["documento"];
                        }
                        if (isset($r["concurrency"])) {
                            $_SESSION["concurrency"] = $r["concurrency"];
                        }

                        $_SESSION["empresa"] = $_COOKIE['empresa'];
                        if (isset($_COOKIE["perfil"])) {
                            $_SESSION["perfil"] = $_COOKIE['perfil'];
                        }
                        if (isset($_COOKIE["nom_perfil"])) {
                            $_SESSION["nom_perfil"] = $_COOKIE['nom_perfil'];
                        }
                        if (isset($_COOKIE["terminal"])) {
                            $_SESSION["terminal"] = $_COOKIE['terminal'];
                        }
                        if (isset($_COOKIE["nom_terminal"])) {
                            $_SESSION["nom_terminal"] = $_COOKIE['nom_terminal'];
                        }
                        if (isset($_COOKIE['nom_empresa'])) {
                            $_SESSION["nom_empresa"] = $_COOKIE['nom_empresa'];
                            self::enterUser();
                        } else {
                            $sql = "select distinct 
                                a.empresa,a.perfil,a.terminal,p.nombre as nom_perfil,t.nombre as nom_terminal
                                b.razon_social as nom_empresa
                                from usuarios_empresas a 
                                left join empresas b on (a.empresa=b.id) 
                                left join perfiles p on (a.perfil=p.id) 
                                left join terminales t on (a.terminal=t.id) 
                                where a.usuario=:usuario and a.empresa=:empresa ";
                            $ca->prepare($sql);
                            $ca->bindValue(":usuario", $_SESSION["usuario"], true);
                            $ca->bindValue(":empresa", $_COOKIE["empresa"], false);
                            if (!$ca->exec(terminales)) {
                                NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
                                return false;
                            }
                            if ($ca->size() == 0) {
                                $_SESSION["id"] = "";
                                $_SESSION["nombre"] = "";
                                $_SESSION["usuario"] = "";
                                $_SESSION["terminal"] = "";
                                $_SESSION["nom_terminal"] = "";
                                $_SESSION["perfil"] = "";
                                $_SESSION["nom_perfil"] = "";
                                $_SESSION["cliente"] = "";
                                $_SESSION["email"] = "";
                                $_SESSION["documento"] = "";
                                $_SESSION["empresa"] = "";
                                self::salir();
                                return false;
                            } else {
                                $ca->next();
                                $ri = $ca->assoc();
                                self::setEmpresa($ri);
                                self::enterUser();
                            }
                        }
                        return true;
                    }
                }
            }
            $data = Array();
            $data["code"] = 10;
            session_destroy();
            NWJSonRpcServer::error("Sesión inválida", $data);
            return false;
        }

        return true;
    }

    public static function getRealIpAddr() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {   //check ip from share internet
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {   //to check ip is pass from proxy
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    public static function getTerminal() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = $_SESSION;
        if (isset($si["usuario"]) && isset($si["empresa"])) {
            $ca->prepareSelect("usuarios_empresas a left join terminales b on(a.terminal=b.id)", "b.nombre,a.terminal", "a.empresa=:empresa and a.usuario=:usuario");
            $ca->bindValue(":usuario", $si["usuario"], true);
            $ca->bindValue(":empresa", $si["empresa"], true);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("No se se pudo consultar la terminal. \n Error: " . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                $terminal = $ca->flush();
                if (is_null($terminal["terminal"])) {
                    $ca->prepareSelect("usuarios a left join terminales b on (a.terminal=b.id)", "b.nombre,a.terminal", "a.empresa=:empresa and a.usuario=:usuario");
                    $ca->bindValue(":usuario", $si["usuario"], true);
                    $ca->bindValue(":empresa", $si["empresa"], true);
                    if (!$ca->exec()) {
                        NWJSonRpcServer::error("No se se pudo consultar la terminal. \n Error: " . $ca->lastErrorText());
                        return false;
                    }
                    if ($ca->size() > 0) {
                        $terminal2 = $ca->flush();
                        $_SESSION["terminal"] = $terminal2["terminal"];
                        $_SESSION["nom_terminal"] = $terminal2["nombre"];
                    }
                } else {
                    $_SESSION["terminal"] = $terminal["terminal"];
                    $_SESSION["nom_terminal"] = $terminal["nombre"];
                }
            } else {
                $ca->prepareSelect("usuarios a left join terminales b on (a.terminal=b.id)", "b.nombre,a.terminal", "a.empresa=:empresa and a.usuario=:usuario");
                $ca->bindValue(":usuario", $si["usuario"], true);
                $ca->bindValue(":empresa", $si["empresa"], true);
                if (!$ca->exec()) {
                    NWJSonRpcServer::error("No se se pudo consultar la terminal. \n Error: " . $ca->lastErrorText());
                    return false;
                }
                if ($ca->size() > 0) {
                    $terminal2 = $ca->flush();
                    $_SESSION["terminal"] = $terminal2["terminal"];
                    $_SESSION["nom_terminal"] = $terminal2["nombre"];
                }
            }
        }
    }

    public static function getInfo() {
        //ONLY FOR DEVICES
        if (!isset($_SESSION)) {
            $r = Array();
            return $r;
        }
        if (isset($GLOBALS["sessionId"])) {
            if ($GLOBALS["sessionId"] != "") {
                session_commit();
                session_id($GLOBALS["sessionId"]);
                session_start($GLOBALS["sessionId"]);
            }
        }
        if (array_key_exists('nom_terminal', $_SESSION) && array_key_exists('terminal', $_SESSION) && is_null($_SESSION["nom_terminal"]) && ($_SESSION["terminal"] == "0" || $_SESSION["terminal"] == 0)) {
            session::getTerminal();
        }
        return $_SESSION;
    }

    public static function info() {
        if (!isset($_SESSION)) {
            $r = Array();
            return $r;
        }
        return $_SESSION;
    }

    public static function cambiar_clave($p) {
        $p = nwMaker::getData($p);
        if (!isset($p["usuario"])) {
            session::check();
        }
        if (!isset($p["showFirst"])) {
            if ($p["vieja"] == "") {
                NWJSonRpcServer::information("Debe ingresar su clave actual");
                return false;
            }
        }

        if ($p["nueva"] == "") {
            NWJSonRpcServer::information("Debe ingresar su clave nueva");
            return false;
        }

        if ($p["repetida"] == "") {
            NWJSonRpcServer::information("Debe digitar su nueva clave nuevamente");
            return false;
        }

        if ($p["nueva"] != $p["repetida"]) {
            NWJSonRpcServer::information("La clave nueva es diferente a la digitada");
            return false;
        }

        $sec = nw_security::getData();

        if ($sec != false) {
            if ($sec["minimun_length"] != 0) {
                if (strlen($p["nueva"]) < $sec["minimun_length"]) {
                    NWJSonRpcServer::information("Su clave debe tener por lo menos 8 dígitos");
                }
            }

            if ($sec["numeric_word"] == "SI") {
                if (ctype_alpha($p["nueva"])) {
                    NWJSonRpcServer::information("Su nueva clave debe llevar al menos un número");
                }
            }

            if ($sec["upper_word"] == "SI") {
                if (preg_match('/[A-Z]/', $p["nueva"]) == 0) {
                    NWJSonRpcServer::information("Su nueva clave debe llevar al menos una letra en mayúscula");
                }
            }

            if ($sec["special_characters"] == "SI") {
                if (preg_match("/[#]|[@]|[$]/", $p["nueva"]) == 0) {
                    NWJSonRpcServer::information("Su nueva clave debe llevar caracteres especiales como @ # $");
                }
            }
        }

        $db = NWDatabase::database();

        $db->transaction();

        $ca = new NWDbQuery($db);
        $usuario = "";
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        } else {
            self::check();
            $si = self::getInfo();
            $usuario = $si["usuario"];
        }

        if (isset($p["showFirst"]) && $p["showFirst"] == false || isset($p["showFirst"]) && $p["showFirst"] == "false") {
//            $table = "usuarios";
            $table = nwMaker::tableUsersNwMaker();
//            $fields = "clave";
            $fields = nwMaker::fieldsUsersNwMaker("clave");
//            $user = "usuario";
            $user = nwMaker::fieldsUsersNwMaker("usuario_cliente");
            $ca->prepareSelect($table, $fields, "{$user}=:usuario");
            $ca->bindValue(":usuario", $usuario, true);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("No se pudo consultar su clave actual " . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() == 0) {
                $db->rollback();
                NWJSonRpcServer::information("Su usuario no está configurado. Comuníquese con el administrador. LOG: (table: {$table}, Fields: {$fields}, FUser: {$user}, User: {$usuario}) ");
                return false;
            }
            $ca->next();
            $ra = $ca->assoc();
            $p["vieja"] = $ra["clave"];
            $oldKey = $p["vieja"];
        } else {
            $oldKey = NWUtils::encrypt($p["vieja"]);
            $table = "usuarios";
            $user = "usuario";
        }

        $ca->prepareSelect($table, "{$user},clave,cambio_clave", "{$user}=:usuario and clave=:clave");
        $ca->bindValue(":usuario", $usuario, true);
        $ca->bindValue(":clave", $oldKey);
        $ca->bindValue(":cambio_clave", "SI");

        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("No se pudo cambiar la clave. " . $ca->lastErrorText());
            return false;
        }

        if ($ca->size() == 0) {
            $db->rollback();
            NWJSonRpcServer::information("Su clave anterior está errada. Digítela nuevamente. ");
            return false;
        }

        $ca->next();

        $r = $ca->assoc();

        if (isset($p["showFirst"]) && $p["showFirst"] == false || isset($p["showFirst"]) && $p["showFirst"] == "false") {
            if ($r["clave"] != $p["vieja"]) {
                $db->rollback();
                NWJSonRpcServer::information("La clave digitada actual es diferente a la registrada");
                return false;
            }
        } else {
            if ($r["clave"] != NWUtils::encrypt($p["vieja"])) {
                $db->rollback();
                NWJSonRpcServer::information("La clave digitada actual es diferente a la registrada");
                return false;
            }
        }

        $ca->prepareUpdate($table, "clave,cambio_clave", "{$user}=:usuario and clave=:vieja");
        $ca->bindValue(":usuario", $usuario, true);
        $ca->bindValue(":vieja", $r["clave"]);
        $ca->bindValue(":clave", NWUtils::encrypt($p["nueva"]));
        $ca->bindValue(":cambio_clave", 1);

        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::information("No se pudo cambiar la clave. Consulte con el administrador.");
            return false;
        }

        $ca->prepareUpdate($table, "cambio_prox", "{$user}=:usuario");
        $ca->bindValue(":usuario", $usuario, true);
        $ca->bindValue(":cambio_prox", '0');
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::information("No se actualizó la información del usuario. \n SQL: " . $ca->lastErrorText());
            return false;
        }

        $ca->prepareInsert("nw_cambios_claves", "usuario,fecha");
        $ca->bindValue(":usuario", $usuario, true);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha", "NOW()", false);
        } else {
            $ca->bindValue(":fecha", "now()", false);
        }
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::information("No se ingresó el registro en el historial de cambios. \n SQL: " . $ca->lastErrorText());
            return false;
        }
        $db->commit();

        return true;
    }
}

class session extends nw_session {
    
}
