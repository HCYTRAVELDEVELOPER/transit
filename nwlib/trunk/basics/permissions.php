<?php

class nw_permissions {

    public static function getPermissionsByClass($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);

        $empresa = "and a.empresa=:empresa";
        if (isset($p["isProduct"]) && $p["isProduct"] === true) {
            $empresa = "";
        }

        $sql = "select 
                a.*,
                b.crear as creates,
                b.consultar,
                b.editar as edits,
                b.eliminar as deletes,
                b.todos,
                b.imprimir as prints,
                b.enviar_correo as send_email,
                b.exportar as exports,
                b.importar as imports,
                b.columnas_ocultas as hidden_cols,
                c.clase,
                b.terminal
                    from menu a
                    join permisos b on (a.modulo=b.modulo and b.perfil=:perfil)
                    left join modulos c on (a.modulo=c.id)
                where c.clase = :clase {$empresa}
                order by 
                a.nivel,
                a.orden,
                a.pariente";
        $ca->prepare($sql);
        $ca->bindValue(":clase", $p["clase"]);
        $ca->bindValue(":perfil", $si["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);

//        NWJSonRpcServer::information($ca->preparedQuery());

        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            return $ca->assoc();
        }
    }

    public static function populateUsersByProfile($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("usuarios", "*", "perfil=:perfil", "nombre");
        $ca->bindValue(":perfil", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function populateUsersFromProfile($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select 
            a.*,
            b.nombre,
            b.estado
            from
            usuarios_empresas a
            join usuarios b on (a.usuario=b.usuario)
            where a.perfil=:perfil and estado='activo' order by nombre";
        $ca->prepare($sql);
        $ca->bindValue(":perfil", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
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
        $ca->prepare($sql);
        $ca->bindValue(":perfil", $p["perfil"]);
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
                c.clase,
                b.terminal
                    from menu a
                    join permisos b on (a.modulo=b.modulo and b.perfil=:perfil)
                    join modulos c on (a.modulo=c.id)
                where a.modulo in (:modulos) and a.empresa=:empresa
                order by 
                a.nivel,
                a.orden,
                a.pariente";
        $ca->prepare($sql);
        $ca->bindValue(":modulos", $modulos, false);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getModulesDashboard($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "ORACLE") {
            $sql = "select DISTINCT
                    c.id,
                    b.grupo,
                    c.nombre,
                    c.parte,
                    c.pariente,
                    c.icono
                from permisos a
                join modulos b on (a.modulo = b.id)
                join nw_modulos_grupos c on (b.grupo=c.id and b.empresa=c.empresa)
                    where a.perfil = :perfil and a.consultar = 1 and b.empresa=:empresa order by c.nombre asc";
        } else {
            $sql = "select DISTINCT
                    c.id,
                    b.grupo,
                    c.nombre,
                    c.parte,
                    c.pariente,
                    c.icono
                from permisos a
                join modulos b on (a.modulo = b.id)
                join nw_modulos_grupos c on (b.grupo=c.id and b.empresa=c.empresa)
                    where a.perfil = :perfil and a.consultar = true and b.empresa=:empresa order by c.nombre asc";
        }
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $_SESSION["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            echo $ca->lastErrorText();
        }
        return $ca->assocAll();
    }

    public static function copyProfile($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sql = "select 
            a.*
            from permisos a
            left join modulos b on (a.modulo=b.id)
            where a.perfil=:perfil and b.empresa=:empresa";
        $ca->prepare($sql);
        $ca->bindValue(":perfil", $p["last_profile"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        $r = $ca->assocAll();
        if (count($r) > 0) {
            $ca->prepareDelete("permisos", "perfil=:perfil");
            $ca->bindValue(":perfil", $p["first_profile"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
        }
        for ($i = 0; $i < count($r); $i++) {
            $ra = $r[$i];
            $ca->prepareInsert("permisos", "perfil,modulo,usuario,fecha,crear,consultar,editar,eliminar,todos,terminal,imprimir,enviar_correo,exportar,importar,columnas_ocultas");
            $ca->bindValue(":perfil", $p["first_profile"]);
            $ca->bindValue(":modulo", $ra["modulo"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":consultar", $ra["consultar"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":crear", $ra["crear"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":editar", $ra["editar"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":eliminar", $ra["eliminar"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":todos", $ra["todos"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":terminal", $ra["terminal"] == "t" || true ? 'true' : 'false', false);

            $ca->bindValue(":imprimir", $ra["imprimir"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":enviar_correo", $ra["enviar_correo"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":exportar", $ra["exportar"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":importar", $ra["importar"] == "t" || true ? 'true' : 'false', false);
            $ca->bindValue(":columnas_ocultas", $ra["columnas_ocultas"] == "t" || true ? 'true' : 'false', false);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
                return false;
            }
        }
        $db->commit();
        return true;
    }

    public static function asociateComponentToProfile($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if (isset($p["component"])) {
            if (count($p["component"]) > 0) {
                for ($i = 0; $i < count($p["component"]); $i++) {
                    $r = $p["component"][$i];
                    $ca->prepareSelect("permisos", "*", "perfil=:perfil and modulo=:modulo");
                    $ca->bindValue(":perfil", $p["profile"]);
                    $ca->bindValue(":modulo", $r["id"]);
                    if (!$ca->exec()) {
                        NWJSonRpcServer::error($ca->lastErrorText());
                    }
                    if ($ca->size() > 0) {
                        continue;
                    }

                    $ca->prepareInsert("permisos", "perfil,modulo,usuario,fecha");
                    $ca->bindValue(":perfil", $p["profile"]);
                    $ca->bindValue(":modulo", $r["id"]);
                    $ca->bindValue(":usuario", $si["usuario"]);
                    if ($db->getDriver() == "ORACLE") {
                        $ca->bindValue(":fecha", NWUtils::getDate($db), false);
                    } else {
                        $ca->bindValue(":fecha", date("Y-m-d"));
                    }
                    if (!$ca->exec()) {
                        NWJSonRpcServer::error($ca->lastErrorText());
                    }
                }
            }
        }
        return true;
    }

    public static function disassociateComponent($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("permisos", "perfil=:perfil and modulo=:modulo");
        $ca->bindValue(":perfil", $p["profile"]);
        $ca->bindValue(":modulo", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function getAllProfiles($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select a.id,concat(a.nombre, ' - ', b.nombre) as nombre from perfiles a  left join empresas b on (a.empresa = b.id)";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function getEmpresas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("empresas", "*,CONCAT(razon_social, ' - ', id) as nombre", "1=1", "razon_social asc");
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function getProfileByCompany($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($db->getDriver() == "MYSQL") {
            $ca->prepareSelect("perfiles", "id,concat(nombre, ' - ', id) as nombre", "empresa=:company and (tipo is null or tipo='0' or coalesce(CAST(tipo as char)) = '')", "UPPER(nombre)");
        } else {
            $ca->prepareSelect("perfiles", "id,concat(nombre, ' - ', id) as nombre", "empresa=:company and (tipo is null or tipo='0' or coalesce(tipo::char) = '')", "UPPER(nombre)");
        }
        $ca->bindValue(":company", $p["company"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function copyPermissionsByProfile($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["perfil"]["profile"] == "") {
            NWJSonRpcServer::information("Seleccione el perfil de destino");
        }
        $sql = "insert into permisos (perfil, modulo, usuario, fecha, crear, consultar, editar, eliminar, todos, terminal, imprimir, enviar_correo, exportar, importar, columnas_ocultas, pariente) select :perfil,modulo,usuario,fecha,crear,consultar,editar,eliminar,todos,terminal,imprimir,enviar_correo,exportar,importar,columnas_ocultas,pariente "
                . "from permisos where perfil=:profile_copy_from ";
        $ca->prepare($sql);
        $ca->bindValue(":perfil", $p["perfil"]["profile"]);
        $ca->bindValue(":profile_copy_from", $p["profile_copy_from"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return true;
    }

    public static function populateModulosGrupos($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "empresa=:empresa";
        if (isset($p["is_product"]) && $p["is_product"] == true) {
            $where = "";
        }
        $ca->prepareSelect("nw_modulos_grupos", "*", $where, "lower(nombre)");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        //$db->transaction();
        for ($i = 0; $i < count($p); $i++) {
            if ($p[$i]["profile"] == '') {
                continue;
            }
            $ca->prepareSelect("permisos", "perfil,modulo", "perfil=:perfil and modulo=:modulo");
            $ca->bindValue(":perfil", $p[$i]["profile"]);
            $ca->bindValue(":modulo", $p[$i]["module"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
                return;
            }
            if ($ca->size() == 0) {
                $ca->prepareInsert("permisos", "perfil,modulo,crear,editar,eliminar,consultar,usuario,todos,terminal,imprimir,enviar_correo,exportar,importar,columnas_ocultas,pais");
            } else {
                $ca->prepareUpdate("permisos", "perfil,modulo,crear,editar,eliminar,consultar,usuario,todos,terminal,imprimir,enviar_correo,exportar,importar,columnas_ocultas,pais", "perfil=:perfil and modulo=:modulo");
            }

            if (!isset($p[$i]["columnas_ocultas"])) {
                $p[$i]["columnas_ocultas"] = false;
            }
            $ca->bindValue(":perfil", $p[$i]["profile"]);
            $ca->bindValue(":modulo", $p[$i]["module"]);
            if ($db->getDriver() == "ORACLE") {
                $ca->bindValue(":crear", $p[$i]["crear"] == true ? 1 : 0, false);
                $ca->bindValue(":editar", $p[$i]["editar"] == true ? 1 : 0, false);
                $ca->bindValue(":eliminar", $p[$i]["eliminar"] == true ? 1 : 0, false);
                $ca->bindValue(":consultar", $p[$i]["consultar"] == true ? 1 : 0, false);
                $ca->bindValue(":terminal", $p[$i]["terminal"] == true ? 1 : 0, false);
                $ca->bindValue(":imprimir", $p[$i]["imprimir"] == true ? 1 : 0, false);
                $ca->bindValue(":enviar_correo", $p[$i]["enviar_por_correo"] == true ? 1 : 0, false);
                $ca->bindValue(":exportar", $p[$i]["exportar"] == true ? 1 : 0, false);
                $ca->bindValue(":importar", $p[$i]["importar"] == true ? 1 : 0, false);
                $ca->bindValue(":columnas_ocultas", $p[$i]["columnas_ocultas"] == true ? 1 : 0, false);
                $ca->bindValue(":pais", $p[$i]["pais"] == true ? 1 : 0, false);
                $ca->bindValue(":todos", 'false', 0);
            } else {
                $ca->bindValue(":crear", $p[$i]["crear"] == true ? 'true' : 'false', false);
                $ca->bindValue(":editar", $p[$i]["editar"] == true ? 'true' : 'false', false);
                $ca->bindValue(":eliminar", $p[$i]["eliminar"] == true ? 'true' : 'false', false);
                $ca->bindValue(":consultar", $p[$i]["consultar"] == true ? 'true' : 'false', false);
                $ca->bindValue(":terminal", $p[$i]["terminal"] == true ? 'true' : 'false', false);
                $ca->bindValue(":imprimir", $p[$i]["imprimir"] == true ? 'true' : 'false', false);
                $ca->bindValue(":enviar_correo", $p[$i]["enviar_por_correo"] == true ? 'true' : 'false', false);
                $ca->bindValue(":exportar", $p[$i]["exportar"] == true ? 'true' : 'false', false);
                $ca->bindValue(":importar", $p[$i]["importar"] == true ? 'true' : 'false', false);
                $ca->bindValue(":columnas_ocultas", $p[$i]["columnas_ocultas"] == true ? 'true' : 'false', false);
                $ca->bindValue(":pais", $p[$i]["pais"] == true ? 'true' : 'false', false);
                $ca->bindValue(":todos", 'false', false);
            }
            $ca->bindValue(":usuario", $si["usuario"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
                return;
            }
        }
        $db->commit();
        return true;
    }

    public static function getSelectedGroups($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("modulos", "*", "empresa=:empresa and grupo is null", "lower(nombre)");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getGeneralModules($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "";
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != "") {
                $where .= " and (";
                $where .= " lower(a.nombre) like lower('%:filtro%') or c.nombre like lower('%:filtro%') or lower(clase) like lower('%:filtro%')  ";
                $where .= ")";
            }
        }
        $sql = "select 
            a.*,
            b.crear,
            b.consultar,
            b.editar,
            b.eliminar,
            b.terminal,
            b.imprimir,
            b.enviar_correo as enviar_por_correo,
            b.exportar,
            b.importar,
            b.columnas_ocultas,
            b.pais
            from modulos a
            left join permisos b on (a.id=b.modulo)
            left join nw_modulos_grupos c on (a.grupo=c.id)
            where b.perfil=:perfil {$where}
            and a.empresa=:empresa 
            and (a.grupo is null or a.grupo=0 or a.grupo not in (select id from nw_modulos_grupos))
            order by lower(a.nombre)";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $p["profile"]);
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != "") {
                $ca->bindValue(":filtro", $p["filtro"]);
            }
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getModulesByGroup($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "and a.empresa=:empresa";
        if (isset($p["is_product"]) && $p["is_product"] == true) {
            $where = "";
        }
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != "") {
                $where .= " and (";
                $where .= " lower(a.nombre) like lower('%:filtro%') or lower(clase) like lower('%:filtro%')  ";
                $where .= ")";
            }
        }
        $sql = "select 
            a.*,
            c.nombre as menu,
            c.id as id_menu,
            c.nivel,
            b.crear,
            b.consultar,
            b.editar,
            b.eliminar,
            b.terminal,
            b.imprimir,
            b.enviar_correo as enviar_por_correo,
            b.exportar,
            b.importar,
            b.columnas_ocultas,
            b.pais
            from modulos a
            left join permisos b on (a.id=b.modulo)
            left join menu c on (a.id=c.modulo)
            where b.perfil=:perfil {$where} 
            and a.grupo=:grupo
            order by c.nivel asc, lower(a.nombre)";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":grupo", $p["id"]);
        $ca->bindValue(":perfil", $p["profile"]);
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != "") {
                $ca->bindValue(":filtro", $p["filtro"]);
            }
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $r = Array();
        $data = Array();
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $r["profile"] = $p["profile"];
            $data[] = $r;
        }
        return $data;
    }

    public static function getModulesByGroupProducts($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "and a.empresa=:empresa";
        if (isset($p["is_product"]) && $p["is_product"] == true) {
            $where = "";
        }
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != "") {
                $where .= " and (";
                $where .= " lower(a.nombre) like lower('%:filtro%') or lower(c.nombre) like lower('%:filtro%') or lower(clase) like lower('%:filtro%')  ";
                $where .= ")";
            }
        }
        $sql = "select 
            a.*,
            b.crear,
            b.consultar,
            b.editar,
            b.eliminar,
            b.terminal,
            b.imprimir,
            b.enviar_correo as enviar_por_correo,
            b.exportar,
            b.importar,
            b.columnas_ocultas,
            b.pais,
            d.nombre as menu,
            d.id as id_menu,
            d.nivel
            from modulos a
            left join permisos b on (a.id=b.modulo)
            left join nw_modulos_grupos c on (a.grupo=c.id)
            left join menu d on (a.id=d.modulo)
            where b.perfil=:perfil {$where} 
            and a.grupo=:grupo
            order by d.nivel asc, lower(a.nombre)";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":grupo", $p["id"]);
        $ca->bindValue(":perfil", $p["profile"]);
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != "") {
                $ca->bindValue(":filtro", $p["filtro"]);
            }
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $r = Array();
        $data = Array();
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $r["profile"] = $p["profile"];
            $data[] = $r;
        }
        return $data;
    }

    public static function getComponentsByModule($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " empresa=:empresa ";
        if (isset($p["is_product"]) && $p["is_product"] === true) {
            $where = "1=1";
        }
        if ($p["module"] == "Elija") {
            return false;
        }
        if ($p["module"] == "General") {
            $sql = "select 
            a.id,
            CONCAT(a.nombre, ' - ', a.clase) as nombre
            from modulos a
            left join permisos b on (a.id=b.modulo)
            where {$where} 
            and grupo=:grupo
            and 
            (grupo is null or grupo = 0 or grupo not in (select id from nw_modulos_grupos))
            and a.id not in (select modulo from permisos where perfil=:perfil and {$where} and grupo is null)
            group by a.id,a.nombre,a.clase 
            order by lower(nombre)";
        } else {
            $sql = "select 
            a.id,
            CONCAT(a.nombre, ' - ', a.clase) as nombre
            from modulos a
            left join permisos b on (a.id=b.modulo)
            where {$where} 
            and grupo=:grupo
            and grupo is not null
            and a.id not in (select modulo from permisos where perfil=:perfil and {$where} and grupo is not null)
            group by a.id,a.nombre,a.clase 
            order by lower(a.nombre)";
        }
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":grupo", $p["module"]);
        $ca->bindValue(":perfil", $p["profile"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getProfiles($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "";
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != null) {
                $where .= " and lower(nombre) like '%" . $p["filtro"] . "%' ";
            }
        }
        $ca->prepareSelect("perfiles", "id,nombre", "empresa=:empresa" . $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getProfilesWithoutUsers($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "";
        if (isset($p["filtro"])) {
            if (trim($p["filtro"]) != null) {
                $where .= " and lower(nombre) like '%" . $p["filtro"] . "%' ";
            }
        }
        $ca->prepareSelect("perfiles", "id,CONCAT(nombre, ' - ', id) as nombre,empresa", "empresa=:empresa and (tipo is null or tipo = '') " . $where, "UPPER(nombre)");
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::console($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getUsers($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1";
        if (isset($p["token"])) {
            if ($p["token"] != "") {
                $where .= " and (lower(id::text) like lower('%{$p["token"]}%') 
                        or lower(nombre::text) like lower('%{$p["token"]}%')
                        or lower(usuario::text) like lower('%{$p["token"]}%')
                        or lower(documento::text) like lower('%{$p["token"]}%')
                        or lower(apellido::text) like lower('%{$p["token"]}%')"
                        . ")";
            }
        }
        $where .= " order by nombre asc";
        $ca->prepareSelect("usuarios", "id,nombre,apellido,usuario,documento", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function getProfileByUser($p) {
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "id_usuario=:id_usuario and empresa=:empresa and tipo='USUARIO'";
        $ca->prepareSelect("perfiles", "id,nombre,empresa,tipo,id_usuario,usuario", $where, "nombre");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id_usuario", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function createUserProfile($p) {
        $si = session::getInfo();
        $db = NWDatabase::database();
        $db->transaction();

        $ca = new NWDbQuery($db);
        $ca->prepareInsert("perfiles", "nombre,empresa,tipo,id_usuario,usuario");
        $ca->bindValue(":nombre", $p["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":tipo", "USUARIO");
        $ca->bindValue(":id_usuario", $p["id"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $ra = self::getProfileByUser($p);

        $ca->prepareUpdate("usuarios_empresas", "perfil", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $p["empresaCopyFrom"]);
        $ca->bindValue(":perfil", $ra[0]["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error eliminando el registro: " . $ca->lastErrorText());
        }

        $db->commit();
        return $ra;
    }

    public static function deleteProfileAndPermissions($p) {
        $db = NWDatabase::database();
        $db->transaction();

        $ca = new NWDbQuery($db);
        $ca->prepareDelete("perfiles", "id=:id");
        $ca->bindValue(":id", $p["profile"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $ca->clean();
        $ca->prepareDelete("permisos", "perfil=:id");
        $ca->bindValue(":id", $p["profile"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $db->commit();
        return true;
    }

}
