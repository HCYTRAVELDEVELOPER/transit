<?php

class nwprojectOut {

    static $idioma = null;
    static $nwpMakerLoginConfigData = null;
    static $nwpMakerConfig = null;

    public static function getIdioma() {
        return self::$idioma;
    }

    public static function nwTranslate($text, $langOrigin, $langTranslate, $callback = false, $datacallback = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("nc_translate_keys", "apiKey", "estado='ACTIVO'");
        if (!$ca->exec()) {
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return NWJSonRpcServer::error("Error, no existe configuración de translate keys. No se pudo traducir.");
        }
        $tr = $ca->flush();
//        $apiKey = 'AIzaSyB61YikB30yCYNFKTQPbYLvps9LsX_yGwk'; //new desarrollonw@gmail.com credit card Libia 12abr2022
        $apiKey = $tr["apiKey"];

        $url = 'https://www.googleapis.com/language/translate/v2?key=' . $apiKey . '&q=' . rawurlencode($text) . '&source=' . $langOrigin . '&target=' . $langTranslate;
        $handle = curl_init($url);
        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($handle);
        $responseDecoded = json_decode($response, true);
        $responseCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);      //Here we fetch the HTTP response code
        curl_close($handle);

        $r = Array();
        if ($responseCode != 200) {
            $error = "";
            $error .= 'Fetching translation failed! Server response code:' . $responseCode . '<br>';
            $error .= 'Error description: ' . $responseDecoded['error']['errors'][0]['message'];
            $r["error"] = $error;
        } else {
            $r["source"] = $text;
            $r["translation"] = $responseDecoded['data']['translations'][0]['translatedText'];
        }
        if ($callback !== false) {
            $r["datacallback"] = $datacallback;
            return $callback($r);
        }
        return $r;
//get languages support
//$url = 'https://www.googleapis.com/language/translate/v2/languages?key=' . $apiKey;
//$handle = curl_init($url);
//curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);     //We want the result to be saved into variable, not printed out
//$response = curl_exec($handle);
//curl_close($handle);
//        $url = 'https://www.googleapis.com/language/translate/v2?key=' . $apiKey . '&q=' . rawurlencode($text) . '&source=es&target=en';
//        $handle = curl_init($url);
//        curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
//        $response = curl_exec($handle);
//        $responseDecoded = json_decode($response, true);
//        curl_close($handle);
    }

    public static function startCode($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ter = false;
        if (isset($p["terminal"])) {
            $ter = $p["terminal"];
        } else {
            echo "NO TERM";
            return;
        }
        $ca->prepareSelect("sop_config", "codigo_oculto", "terminal=:terminal");
        $ca->bindValue(":terminal", $ter);
        if (!$ca->exec()) {
            $db->rollback();
            $a = Array();
            $a["error_text"] = "Ringow up.php ERROR:" . $ca->lastErrorText();
            $a["program_name"] = "Ringow up.php {$_SERVER["HTTP_HOST"]}";
            nwMaker::sendError($a);
            echo "Error. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() === 0) {
            echo "NO config";
            return false;
        }
        $co = $ca->flush();
        return $co;
    }

    public static function nwpMakerConfig() {
        if (self::$nwpMakerConfig === null) {
            $nombre_fichero = $_SERVER["DOCUMENT_ROOT"] . "/config_nwmaker.json";
            if (file_exists($nombre_fichero)) {
                $data = file_get_contents($nombre_fichero);
                $products = json_decode($data, true);
                self::$nwpMakerConfig = $products;
                return $products;
            }
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("nwmaker_codigo_oculto", "*", "activo='SI' order by id desc limit 1");
            if (!$ca->exec()) {
                return "Error line 8 " . $ca->lastErrorText();
            }
            if ($ca->size() == 0) {
                return false;
            }
            $r = $ca->flush();
            $response = Array();
            $response["config_login"] = nwprojectOut::nwpMakerLoginConfig();
            $response["config"] = $r;
            self::$nwpMakerConfig = $response;

//            $db->close();

            return $response;
        } else {
            return self::$nwpMakerConfig;
        }
    }

    public static function nwpMakerLoginConfig() {
        if (self::$nwpMakerLoginConfigData === null) {
//            error_log("NO");
            $nombre_fichero = $_SERVER["DOCUMENT_ROOT"] . "/config_nwmaker.json";
            if (file_exists($nombre_fichero)) {
                $data = file_get_contents($nombre_fichero);
                $f = json_decode($data, true);
                self::$nwpMakerLoginConfigData = $f["config_login"];
                return $f["config_login"];
            }
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);
            $ca->prepareSelect("nwmaker_login", "*", "1=1 order by id desc limit 1");
            if (!$ca->exec()) {
                return "Error line 8 " . $ca->lastErrorText();
            }
            if ($ca->size() == 0) {
                return false;
            }
            $r = $ca->flush();
            self::$nwpMakerLoginConfigData = $r;
            return $r;
        } else {
//            error_log("SI");
            return self::$nwpMakerLoginConfigData;
        }
    }

    public static function getGetNwProject() {
        $file_nwp = $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/srv/nwproject.nw.php";
        $rta = false;
        if (file_exists($file_nwp)) {
//            $rta = nwproject::varGet();
        }
        return $rta;
    }

    public static function updatePassNwMaker($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $usuario = $si["usuario"];
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        }
        if (!isset($p["admin"])) {
            $ca->prepareSelect(nwMaker::tableUsersNwMaker(), "clave", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario and clave=:clave");
            $ca->bindValue(":usuario", $usuario);
            $ca->bindValue(":clave", nwMaker::encrypt($p["pass_actual"]));
            if (!$ca->exec()) {
                echo "Error. " . $ca->lastErrorText();
                return true;
            }
            if ($ca->size() == 0) {
                return 0;
            }
        }
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), "clave", nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":clave", nwMaker::encrypt($p["clave"]));
        if (!$ca->exec()) {
            echo "Error. " . $ca->lastErrorText();
            return true;
        }
        return true;
    }

    public static function updateInfoUserperfil($data) {
        $p = nwMaker::getData($data);
//        $c = nwprojectOut::nwpMakerConfig();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $si = session::info();
        $usuario = nwMaker::getUser($p);
        $f = "";
        $f .= nwMaker::fieldsUsersNwMaker("fecha_actualizacion");
        $nombre = null;
        if (isset($p["nombre"]) && $p["nombre"] !== "") {
            $nombre = $p["nombre"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("nombre");
        }
        $apellido = null;
        if (isset($p["apellido"]) && $p["apellido"] !== "") {
            $apellido = $p["apellido"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("apellido");
        }
        $celular = null;
        if (isset($p["celular"]) && $p["celular"] !== "") {
            $celular = $p["celular"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("celular");
        }
        $nit = null;
        if (isset($p["nit"]) && $p["nit"] !== "") {
            $nit = $p["nit"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("nit");
        }
        $fecha_nacimiento = null;
        if (isset($p["fecha_nacimiento"]) && $p["fecha_nacimiento"] !== "") {
            $fecha_nacimiento = $p["fecha_nacimiento"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("fecha_nacimiento");
        }
        $correo_gmail = null;
        if (isset($p["correo_gmail"]) && $p["correo_gmail"] !== "") {
            $correo_gmail = $p["correo_gmail"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("correo_gmail");
        }
        $foto_perfil = null;
        if (isset($p["foto_perfil"]) && $p["foto_perfil"] !== "") {
            $foto_perfil = $p["foto_perfil"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("foto_perfil");
        }
        $tags = null;
        if (isset($p["tags"]) && $p["tags"] !== "") {
            $tags = $p["tags"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("tags");
        }
        $foto_portada = null;
        if (isset($p["foto_portada"]) && $p["foto_portada"] !== "") {
            $foto_portada = $p["foto_portada"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("foto_portada");
        }
        $pais = null;
        if (isset($p["pais"]) && $p["pais"] !== "") {
            $pais = $p["pais"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("pais");
        }
        $ciudad = null;
        if (isset($p["ciudad"]) && $p["ciudad"] !== "") {
            $ciudad = $p["ciudad"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("ciudad");
        }
        $departamento = null;
        if (isset($p["departamento"]) && $p["departamento"] !== "") {
            $departamento = $p["departamento"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("departamento");
        }
        $cargo_actual = null;
        if (isset($p["cargo_actual"]) && $p["cargo_actual"] !== "") {
            $cargo_actual = $p["cargo_actual"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("cargo_actual");
        }
        $empresa_labora = null;
        if (isset($p["empresa_labora"]) && $p["empresa_labora"] !== "") {
            $empresa_labora = $p["empresa_labora"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("empresa_labora");
        }
        $descripcion = null;
        if (isset($p["descripcion"]) && $p["descripcion"] !== "") {
            $descripcion = $p["descripcion"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("descripcion");
        }
        $profesion = null;
        if (isset($p["profesion"]) && $p["profesion"] !== "") {
            $profesion = $p["profesion"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("profesion");
        }
        $genero = null;
        if (isset($p["genero"]) && $p["genero"] !== "") {
            $genero = $p["genero"];
            $f .= "," . nwMaker::fieldsUsersNwMaker("genero");
        }
        $generos_musicales = null;
        if (isset($p["generos_musicales"]) && $p["generos_musicales"] !== "") {
            $generos_musicales = $p["generos_musicales"];
            $f .= ",generos_musicales";
        }
        $tipo_documento = null;
        if (isset($p["tipo_documento"]) && $p["tipo_documento"] !== "") {
            $tipo_documento = $p["tipo_documento"];
            $f .= ",tipo_doc";
        }
        $adjunto_opcional = null;
        if (isset($p["adjunto_opcional"]) && $p["adjunto_opcional"] !== "") {
            $adjunto_opcional = $p["adjunto_opcional"];
            $f .= ",adjunto_opcional";
        }
        $perfil = null;
        $empresa = null;
        $where = nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario ";
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
            $where .= " and empresa=:empresa ";
        }
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil ";
        }
        $ca->prepareUpdate(nwMaker::tableUsersNwMaker(), $f, $where);
        $ca->bindValue(":usuario", $usuario, true, true);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("nombre"), $nombre);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("apellido"), $apellido);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("celular"), $celular);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("nit"), $nit);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("fecha_nacimiento"), $fecha_nacimiento);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("correo_gmail"), $correo_gmail);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("foto_perfil"), $foto_perfil);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("tags"), $tags);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("foto_portada"), $foto_portada);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("pais"), $pais);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("ciudad"), $ciudad);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("departamento"), $departamento, true, true);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("cargo_actual"), $cargo_actual);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("empresa_labora"), $empresa_labora);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("descripcion"), $descripcion);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("profesion"), $profesion, true, true);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("genero"), $genero, true, true);
        $ca->bindValue(":" . nwMaker::fieldsUsersNwMaker("fecha_actualizacion"), date("Y-m-d H:i:s"));
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        $ca->bindValue(":generos_musicales", $generos_musicales);
        $ca->bindValue(":tipo_doc", $tipo_documento);
        $ca->bindValue(":adjunto_opcional", $adjunto_opcional);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        $r = self::getInfoUserperfil($p);
        if ($r == 0) {
            return "Error inesperado... El usuario {$usuario} con empresa {$p["empresa"]} y perfil {$p["perfil"]} no existe. Consulte con el administrador del sistema.";
        }
        foreach ($r as $key => $value) {
            $_SESSION[$key] = $value;
        }
        if ($foto_perfil !== null) {
            $_SESSION['foto'] = $foto_perfil;
            $_SESSION['foto_perfil'] = $foto_perfil;
        }
        if ($foto_portada !== null)
            $_SESSION['foto_portada'] = $foto_portada;

        if ($nombre !== null)
            $_SESSION['nombre'] = $nombre;

        if ($apellido !== null)
            $_SESSION['apellido'] = $apellido;

        if ($celular !== null)
            $_SESSION['celular'] = $celular;

        if ($genero !== null)
            $_SESSION['genero'] = $genero;

        if ($fecha_nacimiento !== null)
            $_SESSION['fecha_nacimiento'] = $fecha_nacimiento;

        if ($correo_gmail !== null)
            $_SESSION['correo_gmail'] = $correo_gmail;

        if ($ciudad !== null)
            $_SESSION['ciudad'] = $ciudad;

        if ($ciudad !== null && isset($p['ciudad_text']))
            $_SESSION['ciudad_text'] = $p['ciudad_text'];

        if ($pais !== null)
            $_SESSION['pais'] = $pais;
        if ($pais !== null && isset($p['pais_text']))
            $_SESSION['pais_text'] = $p['pais_text'];
        return $_SESSION;
    }

    public static function getInfoUserperfil($data) {
        $p = nwMaker::getData($data);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $usuario = nwMaker::getUser($p);
        $table = nwMaker::tableUsersNwMaker();
        $perfil = null;
        $empresa = null;
        $where = nwMaker::fieldsUsersNwMaker("usuario_cliente") . "=:usuario ";
        if (isset($p["empresa"])) {
            $empresa = $p["empresa"];
            $where .= " and empresa=:empresa ";
        }
        if (isset($p["perfil"])) {
            $perfil = $p["perfil"];
            $where .= " and perfil=:perfil ";
        }
        $where .= " order by id asc limit 1 ";
        $ca->prepareSelect($table, "*", $where);
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":empresa", $empresa);
        $ca->bindValue(":perfil", $perfil);
        if (!$ca->exec()) {
            echo "Error. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() == 0) {
            return 0;
        }
        $r = $ca->flush();
        if ($table === "pv_clientes") {
            $r["usuario"] = $r["usuario_cliente"];
        }
        return $r;
    }

    public static function getProfilesNwMaker($page = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1";
        if ($page != false) {
            $where = "pagina=:id";
        }
        $ca->prepareSelect("nwmaker_perfiles", "*", " $where order by id asc limit 1");
        $ca->bindValue(":id", $page);
        if (!$ca->exec()) {
            echo "Error. " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() == 0) {
            return 0;
        }
        return $ca->flush();
    }

    public static function getIdiomaNative($idioma) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        if ($driver == "ORACLE") {
            return false;
        }
//        $ca->prepareSelect("information_schema.tables", "COUNT(*) AS count", " table_name = 'idiomas' ");
//        if (!$ca->exec()) {
//            echo "Error nwproject.nw getIdiomaNative " . $ca->lastErrorText();
//            return;
//        }
//        if ($ca->size() == 0) {
//            return false;
//        }
        $ca->prepareSelect("idiomas", "name_in_english", "id=:id");
        $ca->bindValue(":id", $idioma);
        if (!$ca->exec()) {
            echo "Error nwproject.nw getIdiomaNative " . $ca->lastErrorText();
            return;
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function ciudades($data) {
        $p = $data["data"];
        $id_citie = $p["id_citie"];
        $depto = $p["depto"];
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1";
        if ($depto != null && $depto != false) {
            $where .= " and departamento=:depto";
//            setcookie("data_departamento", $depto, time() + (86400 * 1), "/");
        }
        $ca->prepareSelect("ciudades", "*", $where);
        if ($depto != null && $depto != false) {
            $ca->bindValue(":depto", $depto);
        }
        if (!$ca->exec()) {
            print "Ocurrió un error al cargar las ciudades";
            return false;
        }
        if ($ca->size() == 0) {
            print "No hay ciudades. Ingrese a nwproject para configurarlas.";
            return false;
        }
        $rta = "";
        if (!isset($p["only_options"])) {
            $rta .= "<select id='ciudad' name='ciudad' class='required input_all'>";
        }
        $rta .= "<option value='0' data-dom='0' class='city_0' >Seleccione</option>";
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $selected = "";
            if ($id_citie == $r["id"]) {
                $selected = "selected";
            }
            $rta .= "<option $selected class='city_{$r["id"]}' data-dom='{$r["valor_domicilio"]}' value='{$r["id"]}' >";
            $rta .= $r["nombre"];
            $rta .= "</option>";
        }
        if (!isset($p["only_options"])) {
            $rta .= "</select>";
        }
        return $rta;
    }

    public static function getRealIP() {
        if (!empty($_SERVER["HTTP_CLIENT_IP"]))
            return $_SERVER["HTTP_CLIENT_IP"];
        if (!empty($_SERVER["HTTP_X_FORWARDED_FOR"]))
            return $_SERVER["HTTP_X_FORWARDED_FOR"];
        return $_SERVER["REMOTE_ADDR"];
    }

    public static function getFormPayu($data) {
        $p = $data["data"];
        $tipo = null;
        $session = true;
        $valor = $p["valor"];

        if (isset($p["session"])) {
            if ($p["session"] == "false" || $p["session"] == "0" || $p["session"] == false || $p["session"] == "no" || $p["session"] == "NO") {
                $session = false;
            }
        }

        $referencia = null;
        if (isset($p["referencia"])) {
            $referencia = $p["referencia"];
        }

        $name = null;
        if (isset($p["cliente_nombre"])) {
            $name = $p["cliente_nombre"];
        }
        $mail = null;
//        $createNwpay = true;
        $createNwpay = array();
        $createNwpay["crear_pago"] = true;

        if (isset($p["factura_crear_pago"])) {
            $createNwpay["factura_crear_pago"] = $p["factura_crear_pago"];
        }

        if (isset($p["id_cuenta"])) {
            $rta = nwpayuIdCuenta($tipo, $session, $valor, $referencia, $name, $mail, $createNwpay, $p["id_cuenta"]);
        } else {
            $rta = nwpayu($tipo, $session, $valor, $referencia, $name, $mail, $createNwpay);
        }

        return $rta;
    }

    public static function getApiGoogleMaps($callback = null, $conf = false) {
        if ($conf != false) {
            if (isset($conf["useApiGoogleMaps"])) {
                if ($conf["useApiGoogleMaps"] == "NO") {
                    return;
                }
            }
        }
//        $version = "2";
        $version = "3";
//        $rta = " <script src='https://maps.googleapis.com/maps/api/js?file=api&amp;v={$version}&amp;key=AIzaSyCkI3HE2iU7-m3qSy3LR7dON2Pf_Qx8Tas&libraries=geometry,places{$callback}'></script>";
        $rta = " <script src='https://maps.googleapis.com/maps/api/js?file=api&amp;v={$version}&amp;key=AIzaSyDwzPL22nfy3hRDB-kxNSJLc_dpSMGQijY&libraries=geometry,places{$callback}'></script>";
        return $rta;
    }

    public static function getNwMakerLibNwProjectAndOut() {
        $get = nwprojectOut::getGetNwProject();
        $nwproject = true;
        if (!isset($get["url_sites"])) {
            $nwproject = false;
        } else
        if ($get["url_sites"] == "") {
            $nwproject = false;
        }
        if ($nwproject) {
            //está dentro de nwproject
//            print nwprojectOut::getNwMaker();
            print nwprojectOut::getNwMaker();
        } else {
            //está fuera de nwproject
            print nwprojectOut::getNwProjectLib();
        }
        return $nwproject;
    }

    public static function getNwMakerForNwProjectModule() {
        $r = "";
        //new
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/media.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/style.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css' />";

        $r .= "<script src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js'></script>";
//        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js'></script>";
        //new
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/forms.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/main.js'></script>";
        return $r;
    }

    public static function getLibNwMaker() {
        $r = "";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/media.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/style.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css' />";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/forms.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/main.js'></script>";
        return $r;
    }

    public static function getNwMaker($jquery = false) {
        $r = "";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/media.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/style.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/styleOut.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/home.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/nwdialog.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/media.css' />";
//        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css' />";
        if ($jquery === true) {
//            $r .= "<script src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>";
            $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js'></script>";
        }
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js'></script>";
        //new
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/forms.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/main.js'></script>";
        return $r;
    }

    public static function getNwMakerLib() {
        $r = "";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/home.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/css/nwdialog.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/style.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/media.css' />";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/forms.js'></script>";
        print $r;
    }

    public static function getNwProjectLib() {
        $r = "";
        //new
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/media.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nwforms/css/style.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.css' />";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>";
        $r .= "<script src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js'></script>";
        //new
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/forms.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nwforms/js/main.js'></script>";
        return $r;
    }

    public static function getOnlyNwProjectLib() {
        $r = "";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.css' />";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.css' />";
        $r .= "<script src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/fastclick.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/datePicker.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/home.js'></script>";
        return $r;
    }

    public static function jqueryLib() {
        $r = "";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.css' />";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>";
        $r .= "<script src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js'></script>";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/js/main.js'></script>";
        return $r;
    }

    public static function getJqueryLib() {
        $r = "";
        $r .= "<link rel='stylesheet' href='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.css' />";
        $r .= "<script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>";
        $r .= "<script src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-ui.min.js'></script>";
        return $r;
    }

    public static function validateChangeRecoverPass($data) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $p = $_GET;
        $p = $data["data"];
        $ca->prepareSelect("nwmaker_resetpass", "*", "token=:token and usuario=:user and usado='NO' and tipo='resetpass' ");
        $ca->bindValue(":token", $p["token"]);
        $ca->bindValue(":user", $p["user"]);
        if (!$ca->exec()) {
            print_r("Error. " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function consultaDemo() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "*", "1=1");
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function populate($data) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1";
        $order = "";
        $p = $data["data"];
        if (isset($p["where"])) {
            if ($p["where"] != "undefined" && $p["where"] != "") {
                $where .= " " . $p["where"] . " ";
            }
        }
        if (isset($p["data"]["where"])) {
            if ($p["data"]["where"] != false && $p["data"]["where"] != "false" && $p["data"]["where"] != "0") {
                $nn = $p["data"]["where"];
                if ($nn == "ciudad_id") {
                    $nn = "ciudad";
                }
                $n = $_SESSION[$nn];
                $where .= " and {$p["data"]["where"]}={$n} ";
            }
        }
        if (isset($p["order"])) {
            $order = " order by {$p["order"]} asc";
        }
        $f = "*";
        if (isset($p["fields"])) {
            $f = $p["fields"];
        }
        $ca->prepareSelect(":table", $f, $where . $order);
        $ca->bindValue(":table", $p["table"], false);
        if (isset($p["bindValues"])) {
            if ($p["bindValues"] != "undefined" && $p["bindValues"] != "") {
                foreach ($p["bindValues"] as $key => $value) {
                    $ca->bindValue(":" . $key, $value);
                }
            }
        }
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->assocAll();
    }

    public static function loadInclude($ruta) {
        if (isset($ruta["data"])) {
            $ruta = $ruta["data"];
        }
        $filename = $_SERVER["DOCUMENT_ROOT"] . $ruta;
        if (is_file($filename)) {
            ob_start();
            include $filename;
            return ob_get_clean();
        }
        return false;
    }

    public static function loadModulesMaker($p, $params) {
        $ruta = "/nwlib6/nwproject/modules/{$p}/index.php";
        $filename = $_SERVER["DOCUMENT_ROOT"] . $ruta;
        if (is_file($filename)) {
            ob_start();
            $paramObject = $params;
            include $filename;
            return ob_get_clean();
        }
        return false;
    }

    public static function loadModulesNwproject($p, $params) {

        $ruta = "/modules/{$p}/index.php";
        $filename = $_SERVER["DOCUMENT_ROOT"] . $ruta;
        if (is_file($filename)) {
            ob_start();
            $paramObject = $params;
            include $filename;
            return ob_get_clean();
        }
        return false;
    }

    public static function getDataByIdAndTable($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect(":table", "*", "id=:id");
        $ca->bindValue(":table", $p["table"], false);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function getTableByHash($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $driver = $db->getDriver();
        $hash = $p["hash"];
        $hash = str_replace("#callback=", "", $hash);
        $hashS = explode("&", $hash);
        if (isset($hashS[0])) {
            $hash = $hashS[0];
        }
        if ($driver == "PGSQL") {
            $ca->prepareSelect("nwmaker_menu a left join nwmaker_modulos_componentes b ON (a.callback::int=b.modulo)", "b.maestro", "a.callback=:hash");
        } else {
            $ca->prepareSelect("nwmaker_menu a left join nwmaker_modulos_componentes b ON (a.callback=b.modulo)", "b.maestro", "a.callback=:hash");
        }
        $ca->bindValue(":hash", $hash, true, true);
        if (!$ca->exec()) {
            return "Error. " . $ca->lastErrorText();
        }
        if ($ca->size() == 0) {
            return false;
        }
        $r = $ca->flush();
        return $r["maestro"];
    }

}
