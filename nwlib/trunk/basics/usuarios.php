<?php

class nw_usuarios {

    public static function getTerminales($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("terminales", "id,nombre", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populatePermisosEmpresas($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "ORACLE") {
            $sql = "select 
                id,
                razon_social as nombre,
                0 as pertenece
                from empresas";
        } else {
            $sql = "select 
                id,
                razon_social as nombre,
                false as pertenece
                from empresas";
        }
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populatePerfilesPorEmpresa($p) {
        $products = nw_configuraciones::getOptionProduc();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa";
        if ($products === true)
            $where = "1=1";

        if (isset($p["table"]) && $p["table"] == "porEmpresa") {
            $where = "empresa=:empresa";
        }

        $ca->prepareSelect("perfiles", "*", $where, "nombre asc");
        $ca->bindValue(":empresa", $p["row"]["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function populateTerminalesPorEmpresa($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("terminales", "*", "empresa=:empresa", "lower(nombre)");
        $ca->bindValue(":empresa", $p["row"]["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function permisosEmpresas($p) {

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        //func_permisos_empresa_usuario(:usuario, id) as pertenece
        if (isset($p["version"]) && floatval($p["version"]) >= 6.3) {
            if ($db->getDriver() == "ORACLE") {
                $sql = "select distinct
            a.id,
            a.razon_social as nombre,
            CASE WHEN b.perfil IS NULL THEN
                0
            ELSE 
                b.perfil
            END AS perfil,
            CASE WHEN b.perfil IS NULL THEN
                'Ninguno registrado'
            ELSE 
                c.nombre
            END AS nom_perfil,
            CASE WHEN b.terminal IS NULL THEN
                0
            ELSE 
                b.terminal
            END AS terminal,
            CASE WHEN b.terminal IS NULL THEN
                'Ninguno registrado'
            ELSE 
                d.nombre
            END AS nom_terminal,
            CASE WHEN b.usuario IS NULL THEN
                    0
            ELSE 
                    1
            END AS pertenece
                from empresas a
            left join usuarios_empresas b on (b.empresa = a.id and b.usuario=:usuario) 
            left join perfiles c on (b.perfil=c.id)
            left join terminales d on (b.terminal=d.id)
            ";
            } else {
                $sql = "select distinct
            a.id,
            a.razon_social as nombre,
            CASE WHEN b.perfil IS NULL THEN
                0
            ELSE 
                b.perfil
            END AS perfil,
            CASE WHEN b.perfil IS NULL THEN
                'Ninguno registrado'
            ELSE 
                c.nombre
            END AS nom_perfil,
            CASE WHEN b.terminal IS NULL THEN
                0
            ELSE 
                b.terminal
            END AS terminal,
            CASE WHEN b.terminal IS NULL THEN
                'Ninguno registrado'
            ELSE 
                d.nombre
            END AS nom_terminal,
            CASE WHEN b.usuario IS NULL THEN
                    false
            ELSE 
                    true
            END AS pertenece
                from empresas a
            left join usuarios_empresas b on (b.empresa = a.id and b.usuario=:usuario) 
            left join perfiles c on (b.perfil=c.id)
            left join terminales d on (b.terminal=d.id)
            ";
            }
        } else {
            $sql = "select distinct
            a.id,
            a.razon_social as nombre,
            CASE WHEN b.perfil IS NULL THEN
                0
            ELSE 
                b.perfil
            END AS perfil,
            CASE WHEN b.perfil IS NULL THEN
                'Ninguno registrado'
            ELSE 
                c.nombre
            END AS nom_perfil,
            CASE WHEN b.terminal IS NULL THEN
                0
            ELSE 
                b.terminal
            END AS terminal,
            CASE WHEN b.terminal IS NULL THEN
                'Ninguno registrado'
            ELSE 
                d.nombre
            END AS nom_terminal,
            CASE WHEN b.usuario IS NULL THEN
                    false
            ELSE 
                    true
            END AS pertenece
                from empresas a
            left join usuarios_empresas b on (b.empresa = a.id and b.usuario=:usuario) 
            left join perfiles c on (b.perfil=c.id)
            left join terminales d on (b.terminal=d.id) ";
        }
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $p["usuario"], true);
        //NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function activationUser($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        $ca->prepareInsert("usuarios_log", "usuario,ip,fecha,accion,empresa");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":ip", $ip, true);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP", false);
        } else if ($db->getDriver() == "PGSQL") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
        } else if ($db->getDriver() == "MYSQL") {
            $ca->bindValue(":fecha", "CURRENT_TIMESTAMP");
        }
        $ca->bindValue(":accion", 'INGRESO');
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function execPage($p) {
        session::check();

        $where = " ";

        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") {
                $where .= " and ";
                $campos = "a.id:a.nombre:email:a.usuario:conectado:estado";
                $where .= NWDbQuery::sqlFieldsFiltersOptional($campos, $p["filters"]["buscar"], true, ":");
            }

            if (isset($p["filters"]["terminal"]) && $p["filters"]["terminal"] != "TODAS") {
                $where .= " and a.terminal=" . $p["filters"]["terminal"];
            }
            if (isset($p["filters"]["activo"]) && $p["filters"]["activo"] != "TODOS") {
                $where .= " and a.estado='" . $p["filters"]["activo"] . "' ";
            }
        }

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "PGSQL") {
            $sql = "select 
                    a.*, 
                    b.nombre as nom_terminal, 
                    c.nombre as nom_perfil,
                    d.nombre as nom_pais,
                    func_usuarios_empresa(a.usuario) as details
                from usuarios a 
                left join terminales b on (a.terminal=b.id)
                left join perfiles c on (a.perfil=c.id)
                left join paises d on (a.pais=d.id) where 1=1 {$where} ";
        } else {
            $sql = "select 
                    a.*, 
                    b.nombre as nom_terminal, 
                    c.nombre as nom_perfil,
                    d.nombre as nom_pais
                from usuarios a 
                left join terminales b on (a.terminal=b.id)
                left join perfiles c on (a.perfil=c.id)
                left join paises d on (a.pais=d.id) where 1=1 {$where} ";
        }
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function save($p) {
        if (!isset($p["nwmaker"])) {
            session::check();
        }
        $db = NWDatabase::database();
        $db->transaction();
        $si = session::info();
        $ca = new NWDbQuery($db);

        if ($p["id"] == "") {
            $ca->prepareSelect("usuarios", "*", "usuario=:usuario");
            $ca->bindValue(":usuario", $p["usuario"], true);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error procesando datos: " . $ca->preparedQuery());
            }
            if ($ca->size() > 0) {
                $db->rollback();
                NWJSonRpcServer::information("El usuario " . $p["usuario"] . " ya está creado");
            }
        }
        $usuario_principal = "";
        $fields = "";
        $modificado = "";
        if (isset($si["usuario"])) {
            $modificado = ",modificado_por";
        }
        if ($p["clave"] == "12345") {
            $fields = "nombre,apellido,usuario,terminal,perfil,estado,cliente,email,fecha_nacimiento,foto,"
                    . "documento,ver_chat,empresa" . $modificado;
        } else {
            $fields = "nombre,apellido,usuario,clave,terminal,perfil,estado,cliente,email,"
                    . "fecha_nacimiento,foto,documento,ver_chat,empresa" . $modificado;
        }
        if (isset($p["usuario_principal"])) {
            $fields .= ",usuario_principal";
            $usuario_principal = $p["usuario_principal"];
        }
        $pais = null;
        if (isset($p["pais"])) {
            $fields .= ",pais";
            $pais = $p["pais"];
        }
        $ciudad = null;
        if (isset($p["ciudad"])) {
            $fields .= ",ciudad";
            $ciudad = $p["ciudad"];
        }
        $cargo = null;
        if (isset($p["cargo"])) {
            $fields .= ",cargo";
            $cargo = $p["cargo"];
        }
        $celular = null;
        if (isset($p["celular"])) {
            $fields .= ",celular";
            $celular = $p["celular"];
        }
        $tipo_creacion = null;
        if (isset($p["tipo_creacion"])) {
            if ($p["tipo_creacion"] !== null && $p["tipo_creacion"] !== false && $p["tipo_creacion"] !== "") {
                $fields .= ",tipo_creacion";
                $tipo_creacion = $p["tipo_creacion"];
            }
        }
        $id = 1;
        $sendMail = true;
        if ($p["id"] != "") {
            $id = $p["id"];
            $ca->prepareUpdate("usuarios", $fields, "id=:id");
            $sendMail = false;
        } else {
            $id = master::getNextSequence("usuarios_id_seq", $db);
            $ca->prepareInsert("usuarios", "id," . $fields);
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":apellido", $p["apellido"]);
        $ca->bindValue(":ver_chat", $p["ver_chat"]);
        $ca->bindValue(":usuario", $p["usuario"], true);
        if ($p["clave"] != "12345") {
            $ca->bindValue(":clave", NWUtils::encrypt($p["clave"]));
        }
        $ca->bindValue(":terminal", $p["terminal"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":estado", $p["estado"]);
        if ($db->getDriver() == "ORACLE") {
            $ca->bindValue(":fecha_nacimiento", "DATE'{$p["fecha_nacimiento"]}'", false, true);
        } else {
            $ca->bindValue(":fecha_nacimiento", $p["fecha_nacimiento"], true, true);
        }
        $ca->bindValue(":foto", !isset($p["foto"]) ? "" : $p["foto"]);
        $ca->bindValue(":cliente", $p["cliente"] == "TODOS" ? 0 : $p["cliente"]);
        $ca->bindValue(":email", $p["email"]);
        if (isset($si["empresa"])) {
            $ca->bindValue(":empresa", $si["empresa"]);
        } else
        if (isset($p["empresa"])) {
            $ca->bindValue(":empresa", $p["empresa"]);
        } else {
            $ca->bindValue(":empresa", "0", false, false);
        }
        $ca->bindValue(":documento", $p["documento"], true);
        $ca->bindValue(":usuario_principal", $usuario_principal, true);
        $ca->bindValue(":pais", $pais, true);
        $ca->bindValue(":ciudad", $ciudad, true);
        $ca->bindValue(":celular", $celular, true);
        $ca->bindValue(":cargo", $cargo, true);
        $ca->bindValue(":tipo_creacion", $tipo_creacion, true);
        if (isset($si["usuario"])) {
            $ca->bindValue(":modificado_por", $si["usuario"]);
        }
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }
        $empresa = 1;

        $outChangeProfile = false;

        if (isset($p["detail"])) {
            if (count($p["detail"]) > 0) {
                $ca->prepareDelete("usuarios_empresas", "usuario=:usuario");
                $ca->bindValue(":usuario", $p["usuario"], true);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error($ca->lastErrorText());
                    return;
                }
                foreach ($p["detail"] as $r) {
                    if ($r["pertenece"] == true) {
                        $ca->prepareInsert("usuarios_empresas", "usuario,empresa,perfil,terminal");
                        $ca->bindValue(':usuario', $p["usuario"], true);
                        $ca->bindValue(':empresa', $r["id"]);
                        $ca->bindValue(':perfil', isset($r["perfil"]["id"]) ? $r["perfil"]["id"] : "null", false, true);
                        $ca->bindValue(':terminal', isset($r["terminal"]["id"]) ? $r["terminal"]["id"] : "null", false, true);
                        if (!$ca->exec()) {
                            $db->rollback();
                            NWJSonRpcServer::error($ca->lastErrorText());
                            return false;
                        }
                        $outChangeProfile = true;
                    }
                }
                $empresa = $r["id"];
            }
        }
        $db->commit();
        $ca->prepareSelect("empresas", "*", "id=:id");
        $ca->bindValue(":id", $empresa);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->preparedQuery());
            return false;
        }
        if ($ca->size() > 0) {
            $r = $ca->flush();
            $p["app_nombre"] = $r["razon_social"];
            $p["empresa"] = $r["razon_social"];
            $p["logo"] = $r["logo"];
            if (isset($r["plantilla_bienvenida"]) && $r["plantilla_bienvenida"] != "0") {
                $p["plantilla_bienvenida"] = $r["plantilla_bienvenida"];
            }
        }
        if (!isset($p["nwmaker"])) {
            master::sendWelcomeMail($p);
        }

        if ($outChangeProfile) {
            $ca->clean();
            $ca->prepareUpdate("usuarios", "cookie", "id=:id");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":cookie", 0);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
                return true;
            }
        }
        return true;
    }

    public static function editMyPersonalData($p) {
        session::check();
        $db = NWDatabase::database();
        $si = session::info();
        $ca = new NWDbQuery($db);
        $ca->prepareUpdate("usuarios", "foto", "id=:id");
        $ca->bindValue(":id", $p["code"]);
        $ca->bindValue(":foto", $p["foto"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
        }
        $_SESSION["foto"] = $p["foto"];
        return true;
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["id"] == "") {
            NWJSonRpcServer::error("Debe seleccionar un registro para poder eliminarlo");
        }
        $ca->prepareDelete("usuarios", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
        }
        return true;
    }

}
