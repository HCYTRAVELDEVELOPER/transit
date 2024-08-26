<?php

function readUserDash() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $rta = "";
    $where = " where 1=1 ";
    $where .= " and usuario=:usuario";
    $sql = "SELECT
	a.modulo,
	b.nombre,
	b.parte,
	SUM(a.visitas)
FROM
	nw_read_user a
LEFT JOIN 
        nw_modulos_grupos b on (a.modulo=b.id)
 WHERE
               a.usuario=:usuario
GROUP BY
	a.modulo,b.nombre, b.parte
ORDER BY
	SUM(a.visitas) DESC limit 3";
    $ca->prepare($sql);
    $ca->bindValue(":usuario", $_SESSION["usuario"]);
    if (!$ca->exec()) {
        $rta = "Error:" . $ca->lastErrorText();
        return $rta;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "<p>El software activa los aplicativos y funcionalidades dependiendo de tus necesidades. Al comenzar a abrir módulos, 
                    el aplicativo activa sólo lo que necesitas, mejorando la experiencia y la velocidad en la plataforma. 
                    Puedes cambiar el tema, el diseño del entorno, entre otras opciones.</p>";
        return;
    }
    for ($i = 0; $i < $total; $i++) {
        $ca->next();
        $r = $ca->assoc();
        if ($r['nombre'] != "") {
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
            $rta .= " <div class='admin' onclick=\"parent.qxnw.main.slotLoadModule('{$parte}', '{$r['modulo']}'); $execSlotInitial \">
                            <div class='admin_intern'>
                              <div class='boxicon blue'></div>
                              <h5> {$r['nombre']}</h5>
                             </div>
                        </div>";
        }
    }
    return $rta;
}

function loadModules() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::getInfo();
    $rta = "";
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
    $ca->prepare($sql);
    $ca->bindValue(":empresa", $_SESSION["empresa"]);
    $ca->bindValue(":perfil", $_SESSION["perfil"]);
    if (!$ca->exec()) {
        $rta = $ca->lastErrorText();
        return "Line 83 Error: " . $rta;
    }
    $populate = "";
    $openVista = "";
    $bg = "";
    $functed = "";
    $execSlotInitial = "";
    $hostHTTP = "";
    if ($_SERVER["HTTP_HOST"] == "www.mymaerskvas.com") {
        $hostHTTP = "mymaerskvas.com";
    }
    if ($_SERVER["HTTP_HOST"] == "mymaerskvas.com") {
        $hostHTTP = "mymaerskvas.com";
    }
    if ($_SERVER["HTTP_HOST"] == "mydamcovas.com") {
        $hostHTTP = "mydamcovas.com";
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
    if ($_SERVER["HTTP_HOST"] == "190.146.205.93") {
        $hostHTTP = "190.146.205.93";
    }
    if ($si["cliente"] == 0) {
        if ($_SERVER["HTTP_HOST"] != $hostHTTP) {
            if (isset($configImg["mostrar_generales"])) {
                if ($configImg["mostrar_generales"] != "NO") {
                    $rta .= "<div class='box containerBoxM'><div class='contend_modules_div contend_modules_divEnc' onclick=\"parent.qxnw.main.slotLoadModule('0', '0');\">
                                     <div class='img_contend_modules_div img_contend_modules_divEnc divButtonGenerales' style='background-image: url(/nwlib" . master::getNwlibVersion() . "/dashboard/img/config_icon.png);'></div>
                                       <div class='textModule'>Generales</div>
                                     </div>
                                     </div>";
                }
            } else {
                $rta .= "<div class='box containerBoxM'><div class='contend_modules_div contend_modules_divEnc' onclick=\"parent.qxnw.main.slotLoadModule('0', '0');\">
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
        $rand = mt_rand(0, 500);
        $randT = mt_rand(100, 600);
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

function notifications() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::getInfo();
    $rta = "";
    $ca->prepareSelect("nw_notifications_det a left join nw_notifications b on (a.notificacion=b.id)", "b.*", "a.usuario=:usuario and a.leida<>:leida order by fecha desc limit 5");
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":leida", "true");
    if (!$ca->exec()) {
        $rta = "errores" . $ca->lastErrorText();
        return $rta;
    }
    if ($ca->size() > 0) {
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $r = $ca->assoc();
            $rta .= "<p><b>" . $r["enviado_por"] . ":</b> " . $r["mensaje"] . "</p>";
        }
    }
    return $rta;
}

function usersChat() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::getInfo();
    $rta = "";
    $ca->prepareSelect("usuarios a left join usuarios_empresas b on (a.usuario=b.usuario)", "a.usuario,a.nombre,a.apellido, a.foto", "a.conectado='SI' and a.estado='activo' and a.usuario<>:usuario and b.empresa=:empresa order by usuario asc");
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    if (!$ca->exec()) {
        $rta = "errores" . $ca->lastErrorText();
        return $rta;
    }
    if ($ca->size() == 0) {
        $rta = "<h2>No hay usuarios en línea</h2>";
        return $rta;
    }
    $rta .= "  <h3 class='muro'>En línea {$ca->size()}</h3>";
    for ($i = 0; $i < $ca->size(); $i++) {
        $ca->next();
        $r = $ca->assoc();
        $phot = "/nwlib" . master::getNwlibVersion() . "/dashboard/img/icon_user.png";
        if ($r["foto"] != null || $r["foto"] != "") {
            $phot = $r["foto"];
        }
        $rta .= "<div class='user_chat'>
                       <a href='/nwlib" . master::getNwlibVersion() . "/modulos/nw_tareas.php?profile=" . $r["usuario"] . "&walk=show'>
                            <div class='visit circles'  style='background-image: url({$phot});' ></div>
                            <p>
                                " . $r["nombre"] . " " . $r["apellido"] . " 
                            </p>
                            </a>
                        </div>";
    }
    return $rta;
}

?>
