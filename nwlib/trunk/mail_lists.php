<?php

class email {

    public static function getGroupsByUser($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_email_groups", "*", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function deleteGroup($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $db->transaction();
        $ca->prepareDelete("nw_email_groups", "id=:grupo");
        $ca->bindValue(":grupo", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $ca->prepareDelete("nw_email_groups_users", "grupo=:grupo");
        $ca->bindValue(":grupo", $p["id"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        $db->commit();
        return true;
    }

    public static function asociateUserToGroup($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $ca->prepareSelect("nw_email_groups_users", "*", "usuario=:usuario and grupo=:grupo and empresa=:empresa");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":grupo", $p["grupo"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        if ($ca->size() != 0) {
            NWJSonRpcServer::information("El usuario que intenta asociar ya se encuentra en este grupo");
        }
        $ca->prepareInsert("nw_email_groups_users", "usuario,grupo,empresa,fecha");
        $ca->bindValue(":usuario", $p["usuario"]);
        $ca->bindValue(":grupo", $p["grupo"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

    public static function eliminar($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_emails", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function deleteUserFromGroup($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("nw_email_groups_users", "usuario=:id and grupo=:grupo");
        $ca->bindValue(":id", $p["id"]);
        $ca->bindValue(":grupo", $p["grupo"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return true;
    }

    public static function consulta($p) {
        session::check();
        $db = NWDatabase::database();
        $db->transaction();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $where = "";
        if (isset($p["filters"])) {
            if (isset($p["filters"]["buscar"]) && $p["filters"]["buscar"] != "") { //filters para el filtro de buscar
                $campos = "nombre,email";
                $where .= " and " . NWDbQuery::sqlFieldsFilters($campos, $p["filters"]["buscar"], true);
            }
        }

        if (isset($p["group"]) != 0) {
            $ca->prepareSelect("nw_email_groups_users", "*", "grupo=:grupo");
            $ca->bindValue(":grupo", $p["group"]);
            if (!$ca->exec()) {
                $db->rollback();
                NWJSonRpcServer::error($ca->lastErrorText());
            }
            if ($ca->size() != 0) {
                $ids = Array();
                for ($i = 0; $i < $ca->size(); $i++) {
                    $ca->next();
                    $r = $ca->assoc();
                    $ids[] = $r["usuario"];
                }
                $ids = implode(",", $ids);
                $where .= " and id in (" . $ids . ") ";
            } else {
                return false;
            }
        }
        $where .= " and empresa=:empresa ";
        $ca->prepareSelect("nw_emails", "*", "1=1" . $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            $db->rollback();
            NWJSonRpcServer::error($ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        $fields = "usuario,nombre,email,empresa,fecha";
        if ($p["id"] == "") {
            $ca->prepareInsert("nw_emails", $fields);
        } else {
            $ca->prepareUpdate("nw_emails", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":nombre", $p["nombre"]);
        $ca->bindValue(":email", $p["email"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":fecha", date("Y-m-d"));
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error:" . $ca->lastErrorText());
            return false;
        }
        return true;
    }

}
