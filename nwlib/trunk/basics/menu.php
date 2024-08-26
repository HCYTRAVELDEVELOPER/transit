<?php

class nw_menu {

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);

        if (isset($p["crear_modulo"]) && $p["crear_modulo"] === true) {
            $id = master::getNextSequence("modulos" . "_id_seq", $db);
            $ca->prepareInsert("modulos", "id,nombre,clase,grupo,empresa,iconos_home");
            $ca->bindValue(":id", $id);
            $ca->bindValue(":nombre", $p["nombre"]);
            $ca->bindValue(":clase", $p["clase"]);
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":iconos_home", $p["iconos_home"]);
            $ca->bindValue(":grupo", $p["grupo"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
            $p["modulo"][0]["id"] = $id;
        }

        $si = session::getInfo();
        if ($p["id"] == "") {
            $ca->prepareInsert("menu", "nombre,orden,nivel,callback,pariente,icono,modulo,empresa,movil,orden_movil");
        } else {
            $ca->prepareUpdate("menu", "nombre,orden,nivel,callback,pariente,icono,modulo,empresa,movil,orden_movil", "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":orden", $p["orden"]);
        $ca->bindValue(":nivel", $p["nivel"]);
        $ca->bindValue(":callback", $p["callback"]);
        $ca->bindValue(":pariente", !isset($p["pariente"][0]["id"]) ? 0 : $p["pariente"][0]["id"]);
        $ca->bindValue(":icono", $p["icono"]);
        $ca->bindValue(":modulo", !isset($p["modulo"][0]["id"]) ? 0 : $p["modulo"][0]["id"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if ($db->getDriver() == "MYSQL") {
            if ($p["movil"] === true) {
                $p["movil"] = 1;
            } else {
                $p["movil"] = 0;
            }
        }
        $ca->bindValue(":movil", $p["movil"]);
        $ca->bindValue(":orden_movil", $p["orden_movil"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $db->commit();
        return true;
    }

    public static function populateParents($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select id, nombre || '-' || nivel as nombre from menu where empresa=:empresa order by nivel,orden,pariente";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getSystemIcons($p) {
        $dir = $_SERVER["DOCUMENT_ROOT"] . "/" . $p["ubicacion"];
        if (is_dir($dir . "/")) {
            $directorio = @opendir($dir);
        } else {
            $p["error_text"] = "No se encontró la dirección buscada. La ruta " . $dir . " no ha sido encontrada";
            master::sendReport($p);
            NWJSonRpcServer::information("No se encontró la dirección buscada. La ruta " . $dir . " no ha sido encontrada");
            return false;
        }
        if (!file_exists($dir)) {
            master::sendReport($p);
            NWJSonRpcServer::information("No se encontró la dirección buscada. La ruta " . $dir . " no ha sido encontrada");
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

    public static function populateParentsByLevel($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("menu", "id, nombre", "nivel=:nivel and empresa=:empresa", "nombre");
        $ca->bindValue(":nivel", $p["nivel_pariente"]);
        $ca->bindValue(":empresa", $p["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consulta($p) {

        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " ";
        $fields = "a.nombre:a.callback:a.icono:c.nombre:b.nombre";
        if (isset($p["filters"])) {
            if ($p["filters"]["nivel"] != "TODOS") {
                $where .= " and a.nivel=" . $p["filters"]["nivel"];
            }
//            if ($p["filters"]["empresa"] != "TODOS") {
//                $where .= " and a.empresa=" . $p["filters"]["empresa"];
//            }
            if ($p["filters"]["grupo"] != "TODOS") {
                if ($p["filters"]["grupo"] == "General") {
                    $where .= " and (b.grupo is null or b.grupo=0) ";
                } else {
                    $where .= " and b.grupo=" . $p["filters"]["grupo"];
                }
            }
            if ($p["filters"]["buscar"] != "") {
                $where .= " and ";
                $where .= NWDbQuery::sqlFieldsFiltersOptional($fields, $p["filters"]["buscar"], false, ':');
            }
        }
        $splited1 = "split_part(a.icono, '/', 1)";
        $splited2 = "'resource/qxnw/icon/' || split_part(a.icono, '/', 2) || '/' || split_part(a.icono, '/', 3)";
        $splited3 = "split_part(a.icono, '/', 1)";
        if ($db->getDriver() == "MYSQL") {
            $splited1 = "SUBSTRING_INDEX(a.icono, '/', 1)";
            $splited2 = "'resource/qxnw/icon/' || SUBSTRING_INDEX(a.icono, '/', 2) || '/' || SUBSTRING_INDEX(a.icono, '/', 3)";
            $splited3 = "SUBSTRING_INDEX(a.icono, '/', 3)";
        } else if ($db->getDriver() == "ORACLE") {
            $splited1 = "regexp_substr(a.icono, '[^/ ]+', 1)";
            $splited2 = "'resource/qxnw/icon/' || regexp_substr(a.icono, '[^/ ]+', 2) || '/' || regexp_substr(a.icono, '[^/ ]+', 3)";
            $splited3 = "regexp_substr(a.icono, '[^/ ]+', 3)";
        }
        $sql = "select 
            a.*,
            c.nombre as nom_pariente, 
            b.nombre as nom_modulo ,
            b.grupo,
            CASE WHEN d.nombre is null THEN
                'General'
            ELSE
                d.nombre
            END AS nom_grupo,
            CASE WHEN {$splited1} = 'qxnw' THEN
                {$splited2}
            ELSE
                CASE WHEN {$splited3} <> '' THEN
                    'qx/icon/Tango/16' || a.icono 
                ELSE 
                    'qx/icon/Tango/16' || a.icono 
                END 
            END AS img_icono
            from menu a
            left join modulos b on (a.modulo=b.id)
            left join menu c on (a.pariente=c.id)
            left join nw_modulos_grupos d on (b.grupo=d.id)
            where a.empresa=:empresa " . $where . " order by a.id";
        $ca->bindValue(":empresa", $p["filters"]["empresa"]);
        $ca->prepare($sql);
        return $ca->execPage($p);
    }

    public static function getMenuHeader($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "";
        if (isset($p["modulo"])) {
            if ($p["modulo"] == 0) {
                $where .= "and b.grupo is null or c.nombre is null ";
            } else {
                $where .= "and b.grupo=:modulo";
            }
        }
        if ($db->getDriver() == "ORACLE") {
            $sql = "select 
                DISTINCT
                a.modulo,
                b.grupo
                    from permisos a
                left join modulos b on (a.modulo=b.id)
                left join nw_modulos_grupos c on (b.grupo=c.id)
                where perfil = :perfil and
                consultar = 1
                $where ";
        } else {
            $sql = "select 
                DISTINCT
                a.modulo,
                b.grupo
                    from permisos a
                left join modulos b on (a.modulo=b.id)
                left join nw_modulos_grupos c on (b.grupo=c.id)
                where perfil = :perfil and
                consultar = true
                $where ";
        }
        $ca->prepare($sql);
        $ca->bindValue(":perfil", $si["perfil"]);
        if (isset($p["modulo"])) {
            $ca->bindValue(":modulo", $p["modulo"]);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            NWJSonRpcServer::information("No tiene permisos asociados. Consulte con el administrador.");
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

        $empresa = "and a.empresa=:empresa";

        if (isset($p["isProduct"]) && $p["isProduct"] === true) {
            $empresa = "";
        }

        $sql = "select 
                a.*,
                b.crear,
                b.consultar,
                b.editar,
                b.eliminar,
                b.todos,
                b.imprimir,
                b.enviar_correo,
                b.exportar,
                b.importar,
                b.columnas_ocultas,
                b.pais,
                c.clase,
                b.terminal
                    from menu a
                    join permisos b on (a.modulo=b.modulo and b.perfil=:perfil)
                    left join modulos c on (a.modulo=c.id)
                where a.modulo in (:modulos) {$empresa}
                order by 
                a.nivel,
                a.pariente,
                a.nombre ASC";
        // SE QUITAR EL a.orden, Y SE DEJA ALFABÉTICAMENTE
        $ca->prepare($sql);
        $ca->bindValue(":modulos", $modulos, false);
        $ca->bindValue(":perfil", $si["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
//        if (isset($p["modulo"])) {
//            self::readuser($p["modulo"]);
//        }
        return $ca->assocAll();
    }

    public static function readuser($id) {
        session::check();
        $db = NWDatabase::database();
//        $ca = new NWDbQuery($db);
        $cb = new NWDbQuery($db);
        $si = session::getInfo();
        $prefix = "";
        $driver = $db->getDriver();
        if ($driver == "PGSQL") {
            $id_ = master::getNextSequence("nw_read_user_id_seq");
        } else if ($driver == "MYSQL") {
            //$prefix = "id,";
            $id_ = "";
        } else if ($driver == "ORACLE") {
            $prefix = "id,";
            $id_ = "";
        }
        $cb->prepareInsert("nw_read_user", $prefix . "modulo,usuario,empresa,fecha,visitas");
        $cb->bindValue(":id", $id_);
        $cb->bindValue(":modulo", $id);
        $cb->bindValue(":usuario", $si["usuario"]);
        $cb->bindValue(":empresa", $si["empresa"]);
        if ($driver == "ORACLE") {
            $cb->bindValue(":fecha", "CURRENT_TIMESTAMP", false);
        } else {
            $cb->bindValue(":fecha", date("Y-m-d H:i:s"));
        }
        $cb->bindValue(":visitas", 1);
        if (!$cb->exec()) {
            NWJSonRpcServer::error($cb->lastErrorText());
            return false;
        }
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("menu", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }
}
