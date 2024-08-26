<?php

class nw_configuraciones {

    public static function getOptionProduc() {
        $products = false;
        $json = json_encode($_GET);
        if (isset($_GET["products"])) {
            if ($_GET["products"] == "true") {
                $_SESSION["products"] = "true";
                $products = true;
            }
        }
        if (isset($_SESSION["products"])) {
            if ($_SESSION["products"] == "true") {
                $products = true;
            }
        }
        return $products;
    }

    public static function getConfig($mode = null) {
        $si = session::getInfo();
        $rs = Array();
        if (!isset($si["empresa"])) {
            error_log(" error al consultar la configuración del diseño del dashboard (no tiene si[empresa].");
            echo " error al consultar la configuración del diseño del dashboard (no tiene si[empresa].";
            if ($mode === "compose") {
                $rs["error"] = " error al consultar la configuración del diseño del dashboard (no tiene si[empresa].";
                return $rs;
            } else {
                return false;
            }
        }
        $products = nw_configuraciones::getOptionProduc();
        $db = NWDatabase::database();
        $cai = new NWDbQuery($db);
        $where_empresa = " 1=1 ";

        if (!$products)
            $where_empresa = " empresa=:empresa ";

        if ($db->getDriver() == "ORACLE") {
            $cai->prepareSelect("nw_design", "*", " {$where_empresa} and activo='SI' and ROWNUM =1 order by id");
        } else {
            $cai->prepareSelect("nw_design", "*", " {$where_empresa} and activo='SI' order by id desc limit 1");
        }
        $cai->bindValue(":empresa", $si["empresa"]);
        if (!$cai->exec()) {
            error_log(" error al consultar la configuración del diseño del dashboard. " . $cai->lastErrorText());
            echo " error al consultar la configuración del diseño del dashboard. " . $cai->lastErrorText();
            if ($mode === "compose") {
                $rs["error"] = " error al consultar la configuración del diseño del dashboard. " . $cai->lastErrorText();
                return $rs;
            } else {
                return false;
            }
        }
        if ($cai->size() == 0) {
            error_log(" error al consultar la configuración del diseño del dashboard. Sin registros. " . $cai->preparedQuery());
            echo " error al consultar la configuración del diseño del dashboard. Sin registros. " . $cai->preparedQuery();
            if ($mode === "compose") {
                $rs["error"] = " error al consultar la configuración del diseño del dashboard. Sin registros. " . $cai->preparedQuery();
                return $rs;
            } else {
                return false;
            }
        } else {
            if ($mode === "compose") {
                $rs["data"] = $cai->flush();
            }
        }
        if ($mode === "compose") {
            return $rs;
        }
        return $cai->flush();
    }

    public static function loadModules() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $configImg = nw_configuraciones::getConfig();
        $rta = "";
        $order = " order by c.nombre asc  ";

        $where = " where 1=1 ";
        if ($db->getDriver() == "ORACLE") {
            $where .= " and a.perfil = :perfil and a.consultar = 1   ";
        } else if ($db->getDriver() == "POSTGRESQL") {
            $where .= " and a.perfil = :perfil and a.consultar = true  ";
        } else if ($db->getDriver() == "MYSQL") {
            $where .= " and a.perfil = :perfil and a.consultar = 1  ";
        }
        if (!isset($_SESSION["products"])) {
            $where .= "  and b.empresa=:empresa  ";
//        $subConsult = "  b.empresa=c.empresa";
        }
        if ($db->getDriver() == "ORACLE") {
            $sql = "select DISTINCT
                    c.id,
                    b.grupo,
                    c.nombre,
                    c.parte,
                    c.pariente,
                    to_char(c.icono) as icono
                from permisos a
                join modulos b on (a.modulo = b.id)
                join nw_modulos_grupos c on (b.grupo=c.id)
                  {$where}  {$order} ";
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
                join nw_modulos_grupos c on (b.grupo=c.id)
                  {$where} {$order}  ";
        }

        $ca->prepare($sql);
        $ca->bindValue(":empresa", $_SESSION["empresa"]);
        $ca->bindValue(":perfil", $_SESSION["perfil"]);
        if (!$ca->exec()) {
            $rta = $ca->lastErrorText();
            master::sendReport($rta);
            return "ERROR LINE 515 MAIN.NW: " . $rta;
        }
        $populate = "";
        $openVista = "";
        $bg = "";
        $functed = "";
        $execSlotInitial = "";
        $hostHTTP = "";
        if ($_SERVER["HTTP_HOST"] == "mydamcovas.com") {
            $hostHTTP = "mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "alter.mydamcovas.com") {
            $hostHTTP = "mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "mymaerskvas.com") {
            $hostHTTP = "mymaerskvas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "www.mymaerskvas.com") {
            $hostHTTP = "www.mymaerskvas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "www.mydamcovas.com") {
            $hostHTTP = "www.mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "damco.gruponw.com") {
            $hostHTTP = "damco.gruponw.com";
        }
        if ($_SERVER["HTTP_HOST"] == "190.146.205.93") {
            $hostHTTP = "190.146.205.93";
        }
        if ($_SERVER["HTTP_HOST"] == "damco.loc") {
            $hostHTTP = "damco.loc";
        }
        if ($si["cliente"] == 0) {
            if ($_SERVER["HTTP_HOST"] != $hostHTTP) {
                if (isset($configImg["mostrar_generales"])) {
                    if ($configImg["mostrar_generales"] != "NO") {
                        $rta .= "<div class='box containerBoxM '><div class='contend_modules_div contend_modules_divEnc' onclick=\"parent.qxnw.main.slotLoadModule('0', '0');\">
                                     <div class='img_contend_modules_div img_contend_modules_divEnc divButtonGenerales' style='background-image: url(/nwlib" . master::getNwlibVersion() . "/dashboard/img/config_icon.png);'></div>
                                       <div class='textModule'>Generales</div>
                                     </div>
                                     </div>";
                    }
                } else {
                    $rta .= "<div class='box containerBoxM '><div class='contend_modules_div contend_modules_divEnc' onclick=\"parent.qxnw.main.slotLoadModule('0', '0');\">
                                     <div class='img_contend_modules_div img_contend_modules_divEnc divButtonGenerales' style='background-image: url(/nwlib" . master::getNwlibVersion() . "/dashboard/img/config_icon.png);'></div>
                                     <div class='textModule'>Generales</div>
                                     </div>
                                     </div>";
                }
            }
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $r["nombre"] = ucfirst($r["nombre"]);
            $parte = "";
            $explodeParte = explode(".", $r["parte"]);
            $totalParte = count($explodeParte);
            if ($totalParte == 1) {
                $parte = $r["parte"];
                $execSlotInitial = "";
            } else {
                $parte = $explodeParte[0];
                $execSlotInitial = "parent.qxnw.main.openAnyFunction('{$explodeParte[1]}');";
            }

            $numero = $r["id"];
            $rand = nwMaker::random(0, 500);
            $randT = nwMaker::random(100, 600);
            $color_borde = "";
            $openVista = "";
            if (isset($configImg["mostrar_menu_superior"])) {
                if ($configImg["mostrar_menu_superior"] == "SI") {
                    $populate = "parent.qxnw.main.slotLoadModule('{$parte}', '{$r["id"]}');";
                }
            } else {
                $populate = "parent.qxnw.main.slotLoadModule('{$parte}', '{$r["id"]}');";
            }
            if (isset($r["icono"])) {
                if ($r["icono"] != "0") {
                    $bg = " style='background-image: url(" . $r["icono"] . ");' ";
                    $casSize = "imgContain";
                } else {
                    $bg = "";
                    $casSize = "";
                }
            } else {
                $bg = "";
                $casSize = "";
            }
            if ($_SERVER["HTTP_HOST"] == $hostHTTP) {
                if (isset($r["pariente"])) {
                    if ($r["pariente"] == $r["id"]) {
                        $populate = "";
                        $openVista = "";
                        $functed = "loadMainDivs({$r["pariente"]});";
                        $rta .= "<div class='box containerBoxM'>
                                      <div id='contend_modules_div' $color_borde  class='contend_modules_div contend_modules_divEnc contend_modules_div" . $r["id"] . "' onclick=\"$populate $openVista $functed $execSlotInitial \">
                                        <div class='img_contend_modules_div img_contend_modules_divEnc $casSize ' $bg ></div>
                                           <div class='textModule'>{$r['nombre']}</div>
                                     </div>
                                </div>";
                    }
                }
            } else {
                $rta .= "<div class='box containerBoxM'>
                           <div id='contend_modules_div' $color_borde  class='contend_modules_div contend_modules_div" . $r["id"] . "' onclick=\"$populate $openVista $functed $execSlotInitial \">
                                <div class='img_contend_modules_div img_contend_modules_divEnc $casSize ' $bg ></div>
                               <div class='textModule'>{$r['nombre']}</div>
                             </div>
                         </div>";
            }
        }
        $rta .= "<div class='box containerBoxM div_salirMbox'>
                    <div class='contend_modules_div div_salir div_salirHome contend_modules_divEnc' onclick=\"parent.qxnw.main.slotSalir();\">
                        <div class='img_contend_modules_div img_salir img_contend_modules_divEnc'></div>
                          <div class='textModule'>Salir</div> 
                     </div>
                 </div>";
        return $rta;
    }

    public static function consultaDesignDash() {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $where = "empresa=:empresa or empresa IS NULL";
        $ca->prepareSelect("nw_init_settings", "*", $where);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            error_log($ca->lastErrorText());
            return master::sendReport($ca->lastErrorText());
        }
        return $ca->assocAll();
    }

    public static function consultaModulesNew($p) {
        $segVista = false;
        if (isset($p["segVista"])) {
            $segVista = $p["segVista"];
        }
        $usedSecondView = false;
        if (isset($p["usedSecondView"])) {
            $usedSecondView = $p["usedSecondView"];
        }
        $showGroups = false;
        if (isset($p["showGroups"])) {
            $showGroups = $p["showGroups"];
        }
        $hostHTTP = "";
        if (isset($p["hostHTTP"])) {
            $hostHTTP = $p["hostHTTP"];
        }
        $products = false;
        if (isset($p["products"])) {
            $products = $p["products"];
        }
        $getOnlyData = false;
        if (isset($p["getOnlyData"])) {
            $getOnlyData = $p["getOnlyData"];
        }
        $versionDashboard = false;
        if (isset($p["versionDashboard"])) {
            $versionDashboard = $p["versionDashboard"];
        }
        $dashbysit = false;
        if (isset($p["dashbysit"])) {
            $dashbysit = $p["dashbysit"];
        }
        $getStyle = true;
        if (isset($p["getStyle"])) {
            $getStyle = $p["getStyle"];
        }
        $rs = Array();
        if ($getStyle) {
            $rs["design"] = self::consultaDesignDash();
        }
        $rs["modules"] = self::consultaModules($segVista, $usedSecondView, $showGroups, $hostHTTP, $products, $getOnlyData, $versionDashboard, $dashbysit);
        return $rs;
    }

    public static function consultaModules($var = false, $usedSecondView = false, $showGroups = false, $hostHTTP = "", $products = false, $getOnlyData = false, $versionDashboard = 1, $dashbysit = false) {
        $segVista = $var;
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $true = "true";
        $icono = "c.icono";
        if ($db->getDriver() == "ORACLE") {
            $true = "1";
            $icono = "to_char(c.icono) as icono";
        }
        if ($db->getDriver() == "MYSQL") {
            $true = "1";
        }
        $most = "";
        if ($products === true || $products === "true" || $products === "1" || $products === 1) {
            $most = ",c.mostrar_popup";
        }
        $tabs = "permisos a join modulos b on (a.modulo = b.id) join nw_modulos_grupos c on (b.grupo=c.id and b.empresa=c.empresa) ";
        $fields = "DISTINCT c.id,b.grupo,c.nombre,c.parte,c.pariente,{$icono},c.orden" . $most;
        $where = "  a.perfil = :perfil and a.consultar = {$true} ";
        if ($segVista == false) {
            $where .= "  and (c.mostrar_en_el_home is null or c.mostrar_en_el_home='SI')";
        }
        if ($products === false) {
            $where .= " and b.empresa=:empresa ";
        }
        if ($segVista != false && !$usedSecondView) {
            $where .= " and c.pariente=:id_pariente ";
        }
        if ($_SERVER["HTTP_HOST"] == $hostHTTP || $products === true) {
            if ($segVista != false && !$usedSecondView) {
                $where .= "  and c.pariente<>c.id ";
            } else
            if (!$segVista && $versionDashboard == 1 || !$segVista && $dashbysit == true) {
                $where .= "  and c.pariente=c.id ";
            } else
            if ($segVista != false && $usedSecondView) {
                $where .= "  and c.pariente=c.id ";
            }
        }
        $ca->prepareSelect($tabs, $fields, $where, "c.orden asc");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":perfil", $si["perfil"]);
        if ($segVista != false) {
            $ca->bindValue(":id_pariente", $segVista);
        }
        if (!$ca->exec()) {
            return master::sendReport($ca->lastErrorText());
        }
        if ($getOnlyData === true) {
            return $ca->assocAll();
        }
        $total = $ca;
        return $total;
    }

    public static function getButtonModules($segVista = false, $usedSecondView = false, $showGroups = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//        $configImg = getConfig();
        if (isset($_SESSION["config_dashboard"])) {
            $configImg = $_SESSION["config_dashboard"];
        } else {
            $configImg = null;
//            $configImg = nw_configuraciones::getConfig();
//            $_SESSION["config_dashboard"] = $configImg;
        }
        $segunda_vista = $configImg["usar_segunda_vista"];
        $products = nw_configuraciones::getOptionProduc();
//        global $products;
        $si = session::getInfo();
        //////variables
//        print_r('esto es otra cosa' . $segVista);
        $var = $segVista;
//        global $var;
//        global $usedSecondView;
        $populate = "";
        $tercer_nivel = false;
        $openVista = "";
        $bg = "";
        $functed = "";
        $execSlotInitial = "";
        $hostHTTP = "";
        if ($_SERVER["HTTP_HOST"] == "192.168.1.43") {
            $hostHTTP = "192.168.1.43";
        }
        if ($_SERVER["HTTP_HOST"] == "190.146.205.93") {
            $hostHTTP = "190.146.205.93";
        }
        if ($_SERVER["HTTP_HOST"] == "mymaerskvas.com") {
            $hostHTTP = "mymaerskvas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "www.mymaerskvas.com") {
            $hostHTTP = "www.mymaerskvas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "mydamcovas.com") {
            $hostHTTP = "mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "alter.mydamcovas.com") {
            $hostHTTP = "alter.mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "www.mydamcovas.com") {
            $hostHTTP = "www.mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "damco.gruponw.com") {
            $hostHTTP = "damco.gruponw.com";
        }
        if ($_SERVER["HTTP_HOST"] == "damco.loc") {
            $hostHTTP = "damco.loc";
        }
        if ($_SERVER["HTTP_HOST"] == "af.loc") {
            $hostHTTP = "af.loc";
        }
//        if ($_SERVER["HTTP_HOST"] == "app.sitca.loc") {
//            $tercer_nivel = true;
//            $hostHTTP = "app.sitca.loc";
//        }
//        if ($_SERVER["HTTP_HOST"] == "app.logimov.loc") {
//            $tercer_nivel = true;
//            $hostHTTP = "app.logimov.loc";
//        }
        if ($_SERVER["HTTP_HOST"] == "af.gruponw.com") {
            $hostHTTP = "af.gruponw.com";
        }

//        global $_SERVER;
//        global $hostHTTP;
        $rta = "";

        if (isset($si["cliente"])) {

            $htmlBtnGens = "<div class='containerBoxM div_generales'><div class='contend_modules_div contend_modules_divEnc' onclick=\"parent.qxnw.main.slotLoadModule('0', '0');\">
                                     <div class='img_contend_modules_div img_contend_modules_divEnc divButtonGenerales' style='background-image: url(/nwlib" . master::getNwlibVersion() . "/dashboard/img/config_icon.png);'></div>
                                     Generales
                                     </div>
                                     </div>";

            if ($si["cliente"] == 0) {
                if ($_SERVER["HTTP_HOST"] != $hostHTTP) {
                    if ($configImg != null && isset($configImg["mostrar_generales"])) {
                        if ($configImg["mostrar_generales"] != "NO") {
                            $rta .= $htmlBtnGens;
                        }
                    } else {
                        $rta .= $htmlBtnGens;
                    }
                }
            }
        }
        $vaser = $_SERVER;
        $res = self::consultaModules($var, $usedSecondView = false, $showGroups = false, $hostHTTP, $products);
//
        $total = $res->size();
        for ($i = 0; $i < $total; $i++) {
            $r = $res->flush();
            $functed = "";
            $r["nombre"] = ucfirst($r["nombre"]);

            $parte = "";
            $explodeParte = explode(".", $r["parte"]);
            $totalParte = count($explodeParte);

            if ($totalParte == 1) {
                $parte = $r["parte"];
                $execSlotInitial = "";
            } else {
                $parte = $explodeParte[0];
                $execSlotInitial = "parent.qxnw.main.openAnyFunction('{$explodeParte[1]}', null, 2000);";
            }

            if ($segunda_vista == "SI") {
                
            } else {
                $openVista = "";
            }

            if ($configImg["mostrar_menu_superior"] != "NO") {
                $populate = "parent.qxnw.main.slotLoadModule('{$parte}', '{$r["id"]}');";
            }

            if (isset($r["icono"])) {
                if ($r["icono"] != "0") {
                    $bg = " style='background-image: url(" . $r["icono"] . ");' ";
                    $casSize = "imgContain";
                } else {
                    $bg = "";
                    $casSize = "";
                }
            } else {
                $bg = "";
                $casSize = "";
            }

            $module = "";
            if ($_SERVER["HTTP_HOST"] == $hostHTTP || $products === true) {
                if ($segVista != false && !$usedSecondView) {
                    $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $showGroups, true);
                } else
                if (!$segVista) {
                    if (isset($r["mostrar_popup"])) {
                        if ($r["mostrar_popup"] === 't' || $r["mostrar_popup"] === 1) {
                            if (isset($configImg["tercer_nivel"])) {
                                $functed = "loadMainSubDivs({$r["pariente"]});";
                            } else {
                                $functed = "loadMainDivs({$r["pariente"]});";
                            }
                        }
                        $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, false, true);
                    } else {
                        $populate = "";
                        $openVista = "";
                        $functed = "loadMainDivs({$r["pariente"]});";
                        $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, false, true);
                    }
                } else
                if ($segVista != false && $usedSecondView && $r["pariente"] == $r["id"]) {
                    $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, false, true);
                }
            } else {
                $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $showGroups);
            }

            if ($showGroups) {
                $rta .= "<div class='containGroups' >";
            }
            $rta .= $module;
            //en pruebas //
            if ($showGroups) {
                for ($o = 1; $o < 4; $o++) {
                    $rta .= "<div class='divBoxModuleN{$o}'>";
                    $rta .= modules($o, $r["id"]);
                    $rta .= "</div>";
                }
            }
            if ($showGroups) {
                $rta .= "</div>";
            }
        }
        return $rta;
    }

    public static function getButtonModules2($segVista = false, $usedSecondView = false, $showGroups = false) {
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
//    $configImg = getConfig();
        $configImg = [];
        if (isset($_SESSION["config_dashboard"])) {
            $configImg = $_SESSION["config_dashboard"];
        } else {
            $configImg["usar_segunda_vista"] = false;
            //            $configImg = nw_configuraciones::getConfig();
//            $_SESSION["config_dashboard"] = $configImg;
        }
        $segunda_vista = $configImg["usar_segunda_vista"];
        $products = nw_configuraciones::getOptionProduc();
//        global $products;
        $si = session::getInfo();
        //////variables
//        print_r('esto es otra cosa' . $segVista);
        $var = $segVista;
//        global $var;
//        global $usedSecondView;
        $populate = "";
        $tercer_nivel = false;
        $openVista = "";
        $bg = "";
        $functed = "";
        $execSlotInitial = "";
        $hostHTTP = "";
        if ($_SERVER["HTTP_HOST"] == "192.168.1.43") {
            $hostHTTP = "192.168.1.43";
        }
        if ($_SERVER["HTTP_HOST"] == "190.146.205.93") {
            $hostHTTP = "190.146.205.93";
        }
        if ($_SERVER["HTTP_HOST"] == "mymaerskvas.com") {
            $hostHTTP = "mymaerskvas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "www.mymaerskvas.com") {
            $hostHTTP = "www.mymaerskvas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "mydamcovas.com") {
            $hostHTTP = "mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "alter.mydamcovas.com") {
            $hostHTTP = "alter.mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "www.mydamcovas.com") {
            $hostHTTP = "www.mydamcovas.com";
        }
        if ($_SERVER["HTTP_HOST"] == "damco.gruponw.com") {
            $hostHTTP = "damco.gruponw.com";
        }
        if ($_SERVER["HTTP_HOST"] == "damco.loc") {
            $hostHTTP = "damco.loc";
        }
        if ($_SERVER["HTTP_HOST"] == "af.loc") {
            $hostHTTP = "af.loc";
        }
        if ($_SERVER["HTTP_HOST"] == "app.sitca.loc") {
            $tercer_nivel = true;
            $hostHTTP = "app.sitca.loc";
        }
        if ($_SERVER["HTTP_HOST"] == "af.gruponw.com") {
            $hostHTTP = "af.gruponw.com";
        }

//        global $_SERVER;
//        global $hostHTTP;
        $rta = "";

        if (isset($si["cliente"])) {

            $htmlBtnGens = "<div class='containerBoxM div_generales'><div class='contend_modules_div contend_modules_divEnc' onclick=\"parent.qxnw.main.slotLoadModule('0', '0');\">
                                     <div class='img_contend_modules_div img_contend_modules_divEnc divButtonGenerales' style='background-image: url(/nwlib" . master::getNwlibVersion() . "/dashboard/img/config_icon.png);'></div>
                                     Generales
                                     </div>
                                     </div>";

            if ($si["cliente"] == 0) {
                if ($_SERVER["HTTP_HOST"] != $hostHTTP) {
                    if (isset($configImg["mostrar_generales"])) {
                        if ($configImg["mostrar_generales"] != "NO") {
                            $rta .= $htmlBtnGens;
                        }
                    } else {
                        $rta .= $htmlBtnGens;
                    }
                }
            }
        }
        $vaser = $_SERVER;
        $res = self::consultaModules($var, $usedSecondView = false, $showGroups = false, $hostHTTP, $products);
//                print_r($res);

        $total = $res->size();
//        echo $total;

        if ($segVista != false && !$usedSecondView) {
//            print_r($total);
        }
        for ($i = 0; $i < $total; $i++) {
            $r = $res->flush();
//                        print_r($r);

            $r["nombre"] = ucfirst($r["nombre"]);

            $parte = "";
            $explodeParte = explode(".", $r["parte"]);
            $totalParte = count($explodeParte);

            if ($totalParte == 1) {
                $parte = $r["parte"];
                $execSlotInitial = "";
            } else {
                $parte = $explodeParte[0];
                $execSlotInitial = "parent.qxnw.main.openAnyFunction('{$explodeParte[1]}');";
            }

            if ($segunda_vista == "SI") {
//                $openVista = "loadXMLDoc({$r["id"]});";
            } else {
                $openVista = "";
            }

            if ($configImg["mostrar_menu_superior"] != "NO") {
                $populate = "parent.qxnw.main.slotLoadModule('{$parte}', '{$r["id"]}');";
            }

            if (isset($r["icono"])) {
                if ($r["icono"] != "0") {
                    $bg = " style='background-image: url(" . $r["icono"] . ");' ";
                    $casSize = "imgContain";
                } else {
                    $bg = "";
                    $casSize = "";
                }
            } else {
                $bg = "";
                $casSize = "";
            }

            $module = "";
//            print_r($r);
            if (isset($r["mostrar_popup"])) {
                if ($r["mostrar_popup"] === 'true' || $r["mostrar_popup"] === 1 || $r["mostrar_popup"] === TRUE || $r["mostrar_popup"] === 't') {
                    $populate = "";
                    $openVista = "";
                    $functed = "loadMainSubDivs2({$r["id"]});";
                    $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, false, true);
                } else {
//                    print_r($r);
                    $functed = "";
                    $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $showGroups, true);
                }
            } else {
                $functed = "";
                $module = self::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $showGroups, true);
            }
            if ($showGroups) {
                $rta .= "<div class='containGroups' >";
            }
            $rta .= $module;
            //en pruebas //
            if ($showGroups) {
                for ($o = 1; $o < 4; $o++) {
                    $rta .= "<div class='divBoxModuleN{$o}'>";
                    $rta .= modules($o, $r["id"]);
                    $rta .= "</div>";
                }
            }
            if ($showGroups) {
                $rta .= "</div>";
            }
        }
        return $rta;
    }

    public static function createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $group = false, $products = false) {
        $classGroup = " ";
        $class_containerBoxM = " containerBoxM_home";

        if ($group) {
            $classGroup = " contend_modules_div_buttonmodule ";
            $class_containerBoxM = " containerBoxM_group ";
            $openVista = "";
        }
        $button = "<div class='containerBoxM {$class_containerBoxM}'><div id='contend_modules_div'   class='contend_modules_div  {$classGroup} contend_modules_div" . $r["id"] . "' onclick=\"$populate $openVista $functed $execSlotInitial \" >
                                <div class='img_contend_modules_div  img_contend_modules_divEnc $casSize ' $bg ></div>
                                 <span class='textSpan'>{$r['nombre']}</span>
                                     <div class='boxDownText'>
                                 <span class='textSpanTwo'>{$r['nombre']}</span>
                                     </div>
                             </div></div>";
        return $button;
    }

    public static function populateTokenCiudades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = " 1=1 ";
        if ($p["token"] != "") {
            $where .= " and (lower(id::text) like lower('%{$p["token"]}%') 
                        or lower(nombre::text) like lower('%{$p["token"]}%'))";
        }
        $ca->prepareSelect("ciudades", "*", $where);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
        }
        return $ca->assocAll();
    }

    public static function sendEmailNew($p) {
        $email = "";
        if (isset($p["email"])) {
            $email = $p["email"];
        }
        $name = "";
        if (isset($p["name"])) {
            $name = $p["name"];
        }
        $asunto = "";
        if (isset($p["asunto"])) {
            $asunto = $p["asunto"];
        }
        $titleEnc = "";
        if (isset($p["titleEnc"])) {
            $titleEnc = $p["titleEnc"];
        }
        $textBody = "";
        if (isset($p["textBody"])) {
            $textBody = $p["textBody"];
        }
        $cliente_nws = false;
        if (isset($p["cliente_nws"])) {
            $cliente_nws = $p["cliente_nws"];
        }
        $pa = false;
        if (isset($p["p"])) {
            $pa = $p["p"];
        }
        $cleanHtml = false;
        if (isset($p["cleanHtml"])) {
            $cleanHtml = $p["cleanHtml"];
        }
        $fromName = false;
        if (isset($p["fromName"])) {
            $fromName = $p["fromName"];
        }
        $fromEmail = false;
        if (isset($p["fromEmail"])) {
            $fromEmail = $p["fromEmail"];
        }
        return self::sendEmail($email, $name, $asunto, $titleEnc, $textBody, $cliente_nws, $pa, $cleanHtml, $fromName, $fromEmail);
    }

    public static function sendEmail($email, $name, $asunto, $titleEnc, $textBody, $cliente_nws, $p = false, $cleanHtml = false, $fromName = false, $fromEmail = false, $empresa_smtp = null) {
        $hostname = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : exec("hostname");
//        if ($hostname == "nwp5.loc" || $hostname == "www.nwp5.loc" || count(explode(".loc", $hostname)) > 1 || $hostname == "localhost" || $hostname == "localhost:8000") {
//            return true;
//        }
        $si = session::info();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $where = "1=1 and  empresa is not null ";
        $empresa = null;
        if (isset($si["empresa"]) && !isset($_SESSION["load_nwmaker"])) {
            $where .= " and empresa=:empresa";
            $empresa = $si["empresa"];
        } else
        if ($empresa_smtp != null && is_string($empresa_smtp)) {
            $where .= " and empresa=:empresa";
            $empresa = $empresa_smtp;
        }
        $where .= " order by id asc limit 1 ";
        $ca->prepareSelect("nw_smtp", "*", $where);
        $ca->bindValue(":empresa", $empresa);
        if (!$ca->exec()) {
            return $ca->lastErrorText();
        }
        $remite = "noreply@" . str_replace("www.", "", $hostname);
        if ($ca->size() > 0) {
            $r = $ca->flush();
            $remite = $r["sended_from"];
        }
        $mail = new PHPMailer();
        $addReply = true;
        $addFrom = true;
        if ($fromEmail !== false) {
            $addReply = false;
            $addFrom = false;
        }
        master::trySendSmtp($mail, $addReply, $addFrom);
        $logo = false;
        $razon_social = false;
        $slogan = false;
        if (isset($p["logo"]) && isset($p["razon_social"]) && isset($p["slogan"])) {
            $logo = $p["logo"];
            $razon_social = $p["razon_social"];
            $slogan = $p["slogan"];
        } else {
            $where = " 1=1 ";
            if (isset($si["empresa"])) {
//                $where = "id=:empresa";
            }
            $where .= " order by id asc limit 1";
            $ca->prepareSelect("empresas", "*", $where);
            if (isset($si["empresa"])) {
                $ca->bindValue(":empresa", $si["empresa"]);
            }
            if (!$ca->exec()) {
                return ("Error: " . $ca->lastErrorText());
            }
            if ($ca->size() > 0) {
                $r = $ca->flush();
                $logo = "https://" . $hostname . "/{$r["logo"]}";
                $razon_social = $r["razon_social"];
                $slogan = $r["slogan"];
            }
        }
        if ($logo === false || $razon_social === false || $slogan === false) {
            return "No hay data empresa";
        }
        if ($cleanHtml === true) {
            $body = $textBody;
        } else {
//OPEN CONTENEDOR
            $body = "<div style='margin: auto;font-family: Arial,Helvetica,sans-serif;text-align: center;font-size: 15px;max-width: 600px;color: #3e3e56;'>";
//TITLE
            $body .= "<div style='text-align: center;margin: 30px 0 20px 0;'>
                        <img src='{$logo}' style='width: auto; max-width: 100%;' />
                        <p>{$razon_social}</p>
                        <p>{$slogan}</p>
                     </div>";
//MENSAJE GRANDE ALERT ENC
            $body .= " <div style='text-align: center;margin: 30px 0 20px 0;'>
                          <p style='    Margin: 0 0 35px 0;color: #3e3e56;font-family: Arial,Helvetica,sans-serif;font-size: 30px;font-weight: normal;line-height: 1.5;padding: 0;text-align: center;word-break: normal;word-wrap: normal;'>
                            {$titleEnc}
                          </p>
                      </div>";
//MENSAJE CENTRO
            $body .= " <div style='text-align: center;margin: 30px 0 20px 0;'>
                         <p>
                          {$textBody}
                        </p>
                       </div>";
//FOOTER
            $body .= " <div style='text-align: center;margin: 30px 0 20px 0;'>";
            if (isset($si["nom_terminal"])) {
                $body .= "<p>";
                $body .= "Creado por {$si["nombre"]} || Fecha: " . date("Y-m-d H:i:s");
                if (isset($si["nom_terminal"])) {
                    $body .= " || Terminal: {$si["nom_terminal"]}";
                }
                $body .= "</p>";
            }
            $body .= "<p>Con la tecnología de <a href='https://www.gruponw.com' target='_blank'>NW Group</a></p>";
            $body .= "<p>Hostname: {$hostname} - " . date("Y-m-d H:i:s") . "</p>";
            $body .= " </div>";
//CIERRA CONTENEDOR TOTAL
            $body .= "</div>";
        }
        //REMITENTE
        $remName = $remite;
        $remEmail = $remite;
//        if (isset($si["nom_terminal"])) {
//            $remName = $si["email"];
//            $remEmail = $si["usuario"];
//        }
        if ($fromEmail != false) {
            $remEmail = $fromEmail;
        }
        if ($fromName != false) {
            $remName = $fromName;
        }
        $mail->SetFrom($remEmail, $remName);
        $mail->AddReplyTo($remEmail, $remName);
        //DESTINATARIOS
        $mail->AddAddress($email, $name);
        $mail_cop = explode(",", $email);
        for ($i = 0; $i < count($mail_cop); $i++) {
            $mail->AddAddress(trim($mail_cop[$i]), $name);
        }

        if ($cliente_nws == true) {
            if (isset($si["cliente"])) {
                $ca->prepareSelect("nw_emails", "email", "cliente_nws=:cliente");
                $ca->bindValue(":cliente", $si["cliente"]);
                if (!$ca->exec()) {
                    return ("Error: " . $ca->lastErrorText());
                }
                if ($ca->size() > 0) {
                    for ($i = 0; $i < $ca->size(); $i++) {
                        $m = $ca->flush();
                        $mail->AddBCC($m["email"]);
                    }
                }
            }
        } else
        if ($cliente_nws != true && $cliente_nws != false && $cliente_nws != null && $cliente_nws != "" && $cliente_nws != 0 && $cliente_nws != "0") {
            $mail->AddBCC($cliente_nws);
        }
        $mail->Subject = $asunto;
        $mail->AltBody = "Mensaje reenviado de contacto nwsites";
        $mail->MsgHTML($body);
//       print_r($mail);
        if ($hostname != "192.168.10.19" && $hostname != "nwp5.loc" && $hostname != "www.nwp5.loc" && $hostname != "www.transmov.loc" && $hostname != "localhost" && $hostname != "localhost:8000") {
            if (!$mail->Send()) {
                return nwMaker::error("Error al enviar el correo para {$email}:" . $mail->ErrorInfo . " Mensaje: {$body} .", true);
            }
        }
        return true;
    }

    public static function getConfigByType($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("config", "*", "empresa=:empresa and usuario=:usuario and tipo=:tipo");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"], true);
        $ca->bindValue(":tipo", $p["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            return $ca->assoc();
        }
    }

    public static function getData($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("config", "*", "empresa=:empresa and usuario=:usuario");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            return $ca->assoc();
        }
    }

    public static function consultaLogo($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("empresas", "logo", "empresa=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
//        $ca->bindValue(":usuario", $si["usuario"], true);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        if ($ca->size() == 0) {
            return false;
        } else {
            $ca->next();
            return $ca->flush();
        }
    }

    public static function getAllCiudades($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("ciudades", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getAllDepartamentos($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("departamentos", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getAllPaises($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("paises", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function getAllEmpresas($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("empresas", "*");
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return $ca->assocAll();
    }

    public static function save($p) {
        session::check();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::getInfo();
        $ca->prepareSelect("config", "*", "empresa=:empresa and usuario=:usuario");
        $ca->bindValue(":empresa", $si["empresa"]);
        $ca->bindValue(":usuario", $si["usuario"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        $fields = "usuario,all_top,all_left,tipo_impresion,empresa";
        if ($ca->size() == 0) {
            $ca->prepareInsert("config", $fields);
        } else {
            $ca->prepareUpdate("config", $fields, "id=:id");
            $ca->bindValue(":id", $p["id"]);
        }
        $ca->bindValue(":usuario", $si["usuario"]);
        $ca->bindValue(":all_top", $p["all_top"]);
        $ca->bindValue(":all_left", $p["all_left"]);
        $ca->bindValue(":tipo_impresion", $p["tipo_impresion"]);
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
            return false;
        }
        return true;
    }

    public static function eliminar($p) {
        session::check();
        if ($p["id"] == "") {
            return false;
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $ca->prepareDelete("conductores", "id=:id");
        $ca->bindValue(":id", $p["id"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("No se realizó la consulta");
            return false;
        }
    }

    public static function enviopqrService($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $si = session::info();
        if (isset($p["nombre"])) {
            $nombre = $p["nombre"];
        }
        $send = Array();
        $send["usuario"] = $si["usuario"];
        $send["empresa"] = $si["empresa"];
        $send["nombre"] = $nombre;
        $send["correo"] = $p["correo"];
        $send["asunto"] = $p["asunto"];
        $send["mensaje"] = $p["mensaje"];
        $send["tipo_solicitud"] = $p["tipo_solicitud"];
        $send["producto_url"] = $p["url"];

        $yep = master::callProducts($send, "reportPqr");
        return $yep;
    }

    public static function consultaGeneracionTk($p) {
        include_once dirname(__FILE__) . '../../rpc/nwApi.inc.php';
        nwMaker::checkSession();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
//        $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
        $nwApi = new nwApi("http://nwadmin.loc/rpcsrv/api.inc.php");
        $nwApi->setUser("andresf");
        $nwApi->setPassword("ayahuasca");
        $nwApi->setProfile(1);
        $nwApi->setCompany(1);
        $nwApi->startSession();
        $arr = array();
        $arr = $p;
        $cliente = $nwApi->exec("consultaGeneracionTk", "control_tiquets", $arr);
        if (isset($cliente["result"])) {
            return $cliente["result"];
        } else {
            return false;
        }
    }

    public static function populateConsultasTK($p) {
        include_once dirname(__FILE__) . '../../rpc/nwApi.inc.php';
        nwMaker::checkSession();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
//        $nwApi = new nwApi("https://nwadmin.gruponw.com/rpcsrv/api.inc.php");
        $nwApi = new nwApi("http://nwadmin.loc/rpcsrv/api.inc.php");
        $nwApi->setUser("andresf");
        $nwApi->setPassword("ayahuasca");
        $nwApi->setProfile(1);
        $nwApi->setCompany(1);
        $nwApi->startSession();
        $arr = array();
        if (isset($p["array_param"]) && is_array($p["array_param"])) {
            $p["array_param"]["usuario"] = $si["usuario"];
            $p["array_param"]["usuario_id"] = $si["usuario_id"];
            $p["array_param"]["empresa"] = $si["empresa"];
            $p["array_param"]["nombre"] = $si["nombre"];
            $arr = $p;
        } else if (isset($p["id"])) {
            $arr = $p["id"];
        }
        if (isset($p["class_param"])) {
            $classParam = $p["class_param"];
        } else {
            $classParam = "control_tiquets";
        }


        $cliente = $nwApi->exec($p["method"], $classParam, $arr);
        if (isset($cliente["result"])) {
            return $cliente["result"];
        } else {
            return false;
        }
    }

    public static function envioTicket($p) {
        $p = nwMaker::getData($p);
        nwMaker::checkSession();
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $si = session::info();
        if ($p["tiempo_respuesta"] == null) {
            $p["tiempo_respuesta"] = 10;
        }
        $ca->prepareSelect("empresas", "id_nw,id_text_nw", "id=:empresa");
        $ca->bindValue(":empresa", $si["empresa"]);
        if (!$ca->exec()) {
            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
            return false;
        }
        if ($ca->size() == 0) {
            NWJSonRpcServer::information("Usuario no cuenta con una empresa asociada, Verifique por favor");
            return;
        } else {
            $res = $ca->flush();
        }
        $send = Array();
        $send["asunto"] = $p["asunto"];
        $send["cliente"] = $res["id_nw"];
        $send["cliente_text"] = $res["id_text_nw"];
        $send["fecha_reporte"] = $p["fecha_reporte"];
        $send["fecha"] = date("Y-m-d");
        $send["medio_ingreso"] = $p["medio_ingreso"];
        $send["quien_reporta"] = $p["quien_reporta"];
        $send["correo_quien_reporto"] = $p["correo_quien_reporto"];
        $send["atiende"] = $p["atiende"];
        $send["atiende_text"] = $p["atiende_text"];
        if (isset($p["adjunto"])) {
            $send["adjunto"] = $p["adjunto"];
            $send["novedad"] = $p["novedad"] . "  se anexa ruta del archivo adjunto: " . $send["adjunto"];
        } else {
            $send["adjunto"] = 0;
            $send["novedad"] = $p["novedad"];
        }
        $send["programa"] = 0;
        $send["tipo_servicio"] = $p["tipo_servicio"];
        $send["diagnostico"] = "Sin verificar";
        $send["tipo_ticket"] = $p["tipo_ticket"];
        $send["usuario_id"] = $si["usuario_id"];
        $send["usuario"] = $si["usuario"];
        $send["empresa"] = $si["empresa"];
        $send["tiempo_respuesta"] = $p["tiempo_respuesta"];
        $send["enviar_correo"] = $p["enviar_correo"];

        $res = master::callProducts($send, "saveGeneracionTk");
        return $res;
    }

}
