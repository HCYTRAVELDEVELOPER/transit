<?php

/* * ***********************************************************************

  Copyright:
  2015 Grupo NW S.A.S, http://www.gruponw.com

  License:
  LGPL: http://www.gnu.org/licenses/lgpl.html
  EPL: http://www.eclipse.org/org/documents/epl-v10.php
  See the LICENSE file in the project's top-level directory for details.

  Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects

 * *********************************************************************** */

class mobile {

    public static function getAdminMenu($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $sql = "select 
               a.*,
               CASE WHEN b.id > 0 THEN
                true
               ELSE 
                false
               END AS asociado,
               b.pagina_principal
               from menu a 
               left join nw_mobile_menu b on (b.menu = a.id and b.perfil=:perfil )
               where a.empresa=:empresa 
               and callback like '%createMaster%' ";
        $ca->prepare($sql);
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        return $ca->assocAll();
    }

    public static function saveSelected($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        if ($p["asociado"] == false) {
            $ca->prepareDelete("nw_mobile_menu", "menu=:menu and perfil=:perfil");
            $ca->bindValue(":menu", $p["id"]);
            $ca->bindValue(":perfil", $p["perfil"]);
            if (!$ca->exec()) {
                NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                return false;
            }
            return;
        }
        $ca->prepareSelect("nw_mobile_menu", "*", "menu=:menu and perfil=:perfil");
        $ca->bindValue(":menu", $p["id"]);
        $ca->bindValue(":perfil", $p["perfil"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            $ca->prepareInsert("nw_mobile_menu", "menu,usuario,fecha,perfil,pagina_principal");
            $ca->bindValue(":menu", $p["id"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":perfil", $p["perfil"]);
            $ca->bindValue(":pagina_principal", $p["pagina_principal"] == '' ? 'false' : $p["pagina_principal"]);
        } else {
            $ca->prepareUpdate("nw_mobile_menu", "menu,usuario,fecha,perfil,pagina_principal", "menu=:menu and perfil=:perfil");
            $ca->bindValue(":menu", $p["id"]);
            $ca->bindValue(":usuario", $si["usuario"]);
            $ca->bindValue(":fecha", date("Y-m-d"));
            $ca->bindValue(":perfil", $p["perfil"]);
            $ca->bindValue(":pagina_principal", $p["pagina_principal"] == "" ? 'false' : $p["pagina_principal"]);
        }
        if (!$ca->exec()) {
            NWJSonRpcServer::error($ca->lastErrorText());
        }
        return true;
    }

}