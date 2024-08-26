<?php

class usuarios {

    public static function consultaHistoricoDirecciones($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_favoritos", "*", "empresa=:empresa and usuario=:usuario order by fecha desc");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->AssocAll();
    }

    public static function consultaHistoricoPermisos($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_app_permisos_users", "*", "empresa=:empresa and usuario=:usuario and perfil=:perfil order by fecha desc");
        $ca->bindValue(":empresa", $p["empresa"]);
        $ca->bindValue(":usuario", $p["usuario_cliente"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->AssocAll();
    }

    public static function getDataByCustomer($p) {
        $p = nwMaker::getData($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_empresas", "razon_social,logo", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }
        if ($ca->size() == 0) {
            return false;
        }
        return $ca->flush();
    }

    public static function setCountry($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $country = geimp_vista::getCountry($db);
        $_SESSION["pais"] = $country;
        setcookie("pais", $country, time() + (60 * 60 * 24 * 365));
        return true;
    }

    public static function changeSaldo($p) {
        session::check();
        $si = session::getInfo();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        if (isset($p["rest_s"]) && $p["rest_s"] == true) {
            $sql = "select tope_saldo from edo_empresas where empresa=:empresa and id=:bodega";
            $ca->bindValue(":empresa", $p["empresa"]);
            $ca->bindValue(":bodega", $p["bodega"]);
            $ca->prepare($sql);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                $saldo_tp = $ca->flush();
                if ($saldo_tp["tope_saldo"] == "" || $saldo_tp["tope_saldo"] == null || floatval($saldo_tp["tope_saldo"]) == 0 && floatval($p["saldo_add"]) >= 0) {
                    NWJSonRpcServer::information("No tiene saldo, por favor comuníquese con el administrador");
                }
                $disponible = 0;
                if (floatval($saldo_tp["tope_saldo"]) >= floatval($p["saldo_add"])) {
                    if (floatval($p["saldo_add"]) > 0) {
                        $disponible = floatval($saldo_tp["tope_saldo"]) - floatval($p["saldo_add"]);
                    } else {
                        $disponible = floatval($saldo_tp["tope_saldo"]) + (floatval($p["saldo_add"]) * (-1));
                    }
                } else {
                    NWJSonRpcServer::information("No tiene saldo, por favor comuníquese con el administrador");
                }
                $ca->prepareUpdate("edo_empresas", "tope_saldo", "empresa=:empresa and id=:bodega");
                $ca->bindValue(":tope_saldo", $disponible);
                $ca->bindValue(":empresa", $p["empresa"]);
                $ca->bindValue(":bodega", $p["bodega"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                    return false;
                }
            }
        }
        $saldo = $p["saldo_new"];
        $ca->prepareUpdate("pv_clientes", "saldo,fecha_vencimiento_saldo", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":saldo", $saldo);
        $ca->bindValue(":fecha_vencimiento_saldo", $p["fecha_vencimiento_saldo"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }

        $ca->prepareSelect("pv_clientes", "usuario_cliente,empresa,perfil,terminal,CONCAT(nombre, ' ', apellido) as nombre_completo", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        $uss = $ca->flush();

        $ca->prepareInsert("edo_recargas", "valor_recarga,total_recarga,usuario,empresa,perfil,fecha,estado,nombre,saldo_anterior,saldo_actual,usuario_modifica");
        $ca->bindValue(":valor_recarga", $p["saldo_add"], true, true);
        $ca->bindValue(":total_recarga", $p["saldo_add"], true, true);
        $ca->bindValue(":usuario", $uss["usuario_cliente"]);
        $ca->bindValue(":empresa", $uss["empresa"]);
        $ca->bindValue(":perfil", $uss["perfil"]);
        $ca->bindValue(":fecha", date("Y-m-d H:i:s"));
        $ca->bindValue(":estado", "adminpc_recarga");
        $ca->bindValue(":nombre", $uss["nombre_completo"]);
        $ca->bindValue(":saldo_anterior", $p["saldo"]);
        $ca->bindValue(":saldo_actual", $saldo);
        $ca->bindValue(":usuario_modifica", $si["usuario"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }

        $ca->prepareSelect("nwmaker_suscriptorsPush", "DISTINCT json,usuario,perfil,empresa", "empresa=:empresa and perfil=:perfil and usuario=:usuario");
        $ca->bindValue(":empresa", $uss["empresa"]);
        $ca->bindValue(":perfil", $uss["perfil"]);
        $ca->bindValue(":usuario", $uss["usuario_cliente"]);
        if (!$ca->exec()) {
            $db->rollback();
            return NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
        }

        $res = Array();
        $res["tokens"] = $ca->assocAll();

        $db->commit();
        return $res;
    }

    public static function execPageO($p) {
        session::check();
        $si = session::info();
        $where = " a.empresa=:empresa ";
        if ($si["empresa"] != "24") {
            $where .= "  and a.usuario!='alexf'  ";
        }
        if (isset($p["filters"]) && $p["filters"]["buscar"] != "") {
            $campos = "a.id,a.nombre,a.apellido,a.email,a.usuario,a.estado_conexion,a.estado,a.celular,a.perfil_text";
            $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
        }
        $where .= " order by a.id desc";
        $where = str_replace("::text", "", $where);
        $f = "a.*";
        $f .= ",b.tipo_empresa,b.nombre as bodega_text";
        $f .= ",c.nombre as nom_ciudad";
        $f .= ",d.nombre as terminal_text";
        $tables = "usuarios a left join edo_empresas b ON(a.bodega=b.id)";
        $tables .= " left join ciudades c ON(a.ciudad=c.id)";
        $tables .= " left join terminales d ON(a.terminal=d.id)";
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect($tables, $f, $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        return $ca->execPage($p);
    }

    public static function populatePermisosEmpresas($p) {

        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select 
                id,
                razon_social as nombre,
                false as pertenece
                from empresas";
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function permisosEmpresas($p) {
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $sql = "SELECT id,razon_social as nombre
                FROM empresas
                WHERE EXISTS (SELECT usuario FROM usuarios_empresas WHERE usuario=:usuario and empresa=:empresa)";
        $ca->prepare($sql);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
//        NWJSonRpcServer::information($ca->preparedQuery());

        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }

//        NWJSonRpcServer::console($ca->assocAll());
        return $ca->assocAll();
    }

    public static function permisosGeneralesCopiarInitial($p) {
        session::check();
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareSelect("edo_configuraciones", "*", "empresa=24");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        $r = $ca->flush();
        $fields = "empresa,";
        foreach ($r as $key => $value) {
            if ($key != "empresa" && $key != "id")
                $fields .= "{$key},";
        }
        $fields = substr($fields, 0, -1);
        $ca->prepareInsert("edo_configuraciones", $fields);
        foreach ($r as $key => $value) {
            $ca->bindValue(":{$key}", $value, true, true);
        }
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareUpdate("usuarios", "perfil", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":perfil", "1229");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareUpdate("usuarios_empresas", "perfil", "usuario=:usuario and empresa=:empresa");
        $ca->bindValue(":perfil", "1229");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function permisosGenerales($p) {
        $si = session::info();
        $p["empresa"] = $si["empresa"];
        return servicios::consultaConfiguracion($p);
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select a.* from edo_configuraciones a where a.empresa=:empresa";
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->flush();
    }

    public static function tarifa($p) {
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        NWJSonRpcServer::console($si);
        $sql = "select id,tipo_servicio as nombre,reservar,mostrar_fecha_hora,minutos_agregar_a_fecha,"
                . "pide_vehiculo_cliente,valor_mascota,minutosMinimosParaPedirService from edo_taximetro where empresa=:empresa";
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveBack($p) {
        session::check();
//        NWJSonRpcServer::console($p);
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["id"] == "") {
            $sql = "select usuario,id from usuarios where usuario=:usuario and empresa=:empresa";
            $ca->bindValue(":usuario", $p["usuario"]);
            $ca->bindValue(":empresa", $si["empresa"]);
            $ca->prepare($sql);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta. SQL: " . $ca->lastErrorText());
                return false;
            }
            if ($ca->size() > 0) {
                NWJSonRpcServer::information("El nombre de usuario ya se encuentra ocupado.");
                return false;
            }
        }
        $bodega = null;
        if (isset($p["bodega"])) {
            $bodega = $p["bodega"];
        }
        $centro_costo = null;
        if (isset($p["centro_costo"])) {
            $centro_costo = $p["centro_costobodega"];
        }

        if ($p["id"] != "") {
            $id = $p["id"];
        } else {
            $id = master::getNextSequence("usuarios" . "_id_seq", $db);
        }
        $fields = "id,usuario,nombre,apellido,celular,empresa,estado,firma,"
                . "email,perfil,perfil_text,terminal,ciudad,bodega,centro_costo,pais";
        if ($p["clave"] != 12345) {
            $fields .= ",clave";
        }
        if ($p["id"] == "") {
            $ca->prepareInsert("usuarios", $fields, ",fecha_registro");
            $ca->bindValue(":fecha_registro", date("Y-m-d H:i:s"));
        } else {
            $ca->prepareUpdate("usuarios", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":id", $id);
        $ca->bindValue(":usuario", $p["usuario"]);
//        $ca->bindValue(":foto_perfil", $p["foto"]);
        $ca->bindValue(":firma", $p["firma"]);
        $ca->bindValue(":ciudad", $p["ciudad"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":apellido", $p["apellido"]);
//        $ca->bindValue(":documento", $p["documento"]);
        $ca->bindValue(":celular", $p["celular"]);
//        $ca->bindValue(":telefono", $p["telefono"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":estado", $p["estado"]);
//        $ca->bindValue(":estado_text", $p["estado_text"]);
        $ca->bindValue(":clave", md5($p["clave"]));
//        $ca->bindValue(":no_licencia", $p["no_licencia"]);
//        $ca->bindValue(":categoria", $p["categoria"]);
//        $ca->bindValue(":fecha_vencimiento", $p["fecha_vencimiento"], true, true);
        $ca->bindValue(":perfil", $p["perfil"] == "" ? 0 : $p["perfil"]);
        $ca->bindValue(":perfil_text", $p["perfil_text"]);
        $ca->bindValue(":usuario_cliente", $p["email"]);
        $ca->bindValue(":terminal", $p["terminal"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":bodega", $bodega, true, true);
        $ca->bindValue(":centro_costo", $centro_costo, true, true);
        $ca->bindValue(":pais", $p["pais"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }

//        if (isset($p["detail"])) {
//        $ca->prepareDelete("usuarios_empresas", "usuario=:usuario");
//        $ca->bindValue(":usuario", $p["usuario"]);
//        if (!$ca->exec()) {
//            $db->rollback();
//            NWJSonRpcServer::error("Error procesando datos: " . $ca->preparedQuery());
//            return false;
//        }
        $usuario_anterior = false;
        if (isset($p["usu"]) && $p["usu"]["usuario"] != "") {
            $usuario_anterior = $p["usu"]["usuario"];
        }
        $fields = "usuario,empresa,perfil,terminal";
        if ($p["id"] != "") {
            $ca->prepareUpdate("usuarios_empresas", $fields, "empresa=:empresa and usuario=:usuario_anterior");
        } else {
            $ca->prepareInsert("usuarios_empresas", $fields);
        }
        $ca->bindValue(":usuario_anterior", $usuario_anterior);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":terminal", $si["terminal"]);
//        NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }
        if ($p["id"] == "") {
            $p["tipo_plantilla"] = "CREAR_CUENTA_BACK_MOVILMOVE";
            master::sendWelcomeMail($p);
        }


        if (isset($p["terminales"])) {
            $ca->prepareDelete("edo_usuarios_terminales", "usuario=:usuario");
            $ca->bindValue(":usuario", trim($p["usuario"]));
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error("Error procesando datos: " . $ca->preparedQuery());
                return false;
            }
            foreach ($p["terminales"] as $r) {
//                NWJSonRpcServer::console($r);

                $ca->prepareInsert("edo_usuarios_terminales", "usuario,empresa,terminal");
                $ca->bindValue(":usuario", trim($p["usuario"]));
                $ca->bindValue(":empresa", $si["empresa"]);
                $ca->bindValue(":terminal", $r["id"]);
                if (!$ca->exec()) {
                    $db->rollback();
                    NWJSonRpcServer::error("Error procesando datos: " . $ca->preparedQuery());
                    return false;
                }
            }
        }

//        $p["email_principal"] = $p["email"];
//        $p["pais_all_data"]["alias"] = "CO";
//        $pr = 5;
//        if ($p["id"] == "") {
//            $serv = nwMaker::consumeServiceLady($p, $pr);
//        NWJSonRpcServer::console("jajaj");
//        }
        $db->commit();
        return $id;
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["id"] == "") {
            NWJSonRpcServer::error("Debe seleccionar un registro para poder eliminarlo");
            return false;
        }
        $si = session::info();
        $ca->prepareDelete("pv_clientes", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function eliminarB($p) {
//        NWJSonRpcServer::console($p);
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        if ($p["id"] == "") {
            NWJSonRpcServer::error("Debe seleccionar un registro para poder eliminarlo");
            return false;
        }
        $si = session::info();
        $ca->prepareDelete("usuarios", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        $ca->prepareDelete("usuarios_empresas", "usuario=:usuario and empresa=:empresa and perfil=:perfil");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function terminal($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("pe_caja", "id,nombre", "terminal=:id");
        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function traePaises($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("paises", "id,nombre", "1=1 order by nombre asc");
//        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function ciudad($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $pais_id = null;
        $w = "1=1 ";
        if (isset($p["pais_id"])) {
            $w .= " and pais_id=:pais_id ";
            $pais_id = $p["pais_id"];
        }
        $w .= " order by nombre asc";
        $ca->prepareSelect("ciudades", "id,nombre", $w);
        $ca->bindValue(":pais_id", $pais_id);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function perfiles($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();

        $where = "";
        if (isset($p["where"])) {
            $where = $p["where"];
        }
        $ca->prepareSelect("perfiles", "id,nombre", " 1=1 " . $where);
//        $ca->bindValue(":id", $p);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaHistoricoReferidos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "a.empresa=:empresa ";
        $where .= " and " . NWDbQuery::sqlFieldsFilters("a.usuario_refiere", $p["id"], true);
        $where .= " order by a.fecha desc ";
        $where = str_replace("::text", "", $where);
        $ca->prepareSelect("usuarios_referidos_register a left join pv_clientes b ON(a.usuario=b.usuario_cliente and a.perfil=b.perfil and a.empresa=b.empresa)", "a.*,a.usuario as usuario_referido,b.nombre as nombre_referido", $where);
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function consultaHistoricoRecargas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $usuario = false;
        if (isset($p["usuario"])) {
            $usuario = $p["usuario"];
        }
        if (isset($p["usuario_cliente"])) {
            $usuario = $p["usuario_cliente"];
        }
        $ca->prepareSelect("edo_recargas", "*", " usuario=:usuario and perfil=:perfil and empresa=:empresa order by fecha desc");
        $ca->bindValue(":usuario", $usuario);
        $ca->bindValue(":perfil", $p["perfil"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se eliminó el registro. Error:" . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function eliminarSucursal($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("vet_sucursales", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function getTerminales() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("edo_usuarios_terminales a left join terminales b on a.terminal=b.id", "b.id,b.nombre", "a.empresa=:empresa  and a.usuario=:usuario order by nombre asc");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        //                NWJSonRpcServer::information($ca->preparedQuery());

        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function slotTerminales($p) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
//        NWJSonRpcServer::console($p);
        $ca->prepareSelect("edo_usuarios_terminales a left join terminales b on a.terminal=b.id", "b.id,b.nombre", "a.empresa=:empresa  and a.usuario=:usuario order by nombre asc");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $p["usuario"]);
        //                NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function configModCon($p) {
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $_SESSION["terminal"] = $p["terminal"];
        $_SESSION["nom_terminal"] = $p["terminal_text"];
        $ca->prepareUpdate("usuarios", "terminal", "id=:id");
        $ca->bindValue(":id", $si["id_usuario"]);
        $ca->bindValue(":terminal", $p["terminal"]);
//                NWJSonRpcServer::information($ca->preparedQuery());
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }
        $fields = "terminal";
        $ca->prepareUpdate("usuarios_empresas", $fields, "empresa=:empresa and usuario=:usuario");
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":terminal", $p["terminal"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error("Error procesando datos: " . $ca->lastErrorText());
            return false;
        }
        $db->commit();
        return $p;
    }
}
