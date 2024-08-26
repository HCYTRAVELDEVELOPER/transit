<?php

function createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $group = false) {
    return nw_configuraciones::createButton($r, $populate, $openVista, $functed, $execSlotInitial, $casSize, $bg, $group);
}

function getButtonModules($segVista = false, $usedSecondView = false, $showGroups = false) {
    return nw_configuraciones::getButtonModules($segVista, $usedSecondView, $showGroups);
}
function getButtonModules2($segVista = false, $usedSecondView = false, $showGroups = false) {
    return nw_configuraciones::getButtonModules2($segVista, $usedSecondView, $showGroups);
}

function modulosHome($p, $id = false) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::getInfo();
    $where = " 1=1 ";
    $where .= " and empresa=:empresa and activo='SI' ";
    if ($p == "right") {
        $where .= " and columna='right'";
    } else {
//        $where .= " and columna='center'";
        $where .= " and columna<>'right'";
    }
    if (!$id || $id == 0 || $id == "0") {
        $where .= " and (modulo=0 or modulo IS NULL )";
    } else {
        $where .= " and modulo=:modulo  ";
    }

    $ca->prepareSelect("nw_modulos_home", "*", " $where order by orden asc");
    $ca->bindValue(":usuario", $si["usuario"]);
    $ca->bindValue(":empresa", $si["empresa"]);
    $ca->bindValue(":modulo", $id);
    if (!$ca->exec()) {
        echo "errores" . $ca->lastErrorText();
        return;
    }
//    echo "<h1> {$id} fdsafdsa " . $ca->preparedQuery() . " </h1>";
    if ($ca->size() == 0) {
        return;
    }
//    echo "<h1>hay</h1>";
    $rta = "";
    for ($i = 0; $i < $ca->size(); $i++) {
        $r = $ca->flush();
        if ($r["frame_si_no"] == "NO" || $r["frame_si_no"] == "no") {
            $rta .= "<div  style='width:" . $r['ancho'] . ";float: " . $r['float'] . ";'>";
            $rta .= "<h3 class='contend_specials_title'>" . $r['nombre'] . "</h3>";

            $ruta = $r['url_php'];
            $filename = $_SERVER["DOCUMENT_ROOT"] . $ruta;
            if (is_file($filename)) {
                ob_start();
                include $filename;
                $rta .= ob_get_clean();
            }
//            $rta .= nwprojectOut::loadInclude($r['url_php']);
            $rta .= "</div>";
        } else {
            $rta .= "<div class='contend_specials_divs' style='width:" . $r['ancho'] . ";float: " . $r['float'] . ";'>";
            $rta .= "<h3 class='contend_specials_title'>" . $r['nombre'] . "</h3>";
            $rta .= " <iframe src='" . $r['url_php'] . "' name='SubHtml'
                       width='100%' height='" . $r['alto'] . "' scrolling='" . $r['scrolling'] . "' frameborder='0'>
                       <p>Texto alternativo para navegadores que no aceptan iframes.</p>
        </iframe>";
            $rta .= "</div>";
        }
    }
    return $rta;
}

function getSaludoHomeUserAndNews($configImg = false) {
    $si = session::getInfo();
    ?>
    <div class="contend_sliderEnc">
        <div class="user_enc box_users">
            <?php
            $imgPerfil = "/nwlib" . master::getNwlibVersion() . "/dashboard/img/icon_user.png";
            if (isset($si["foto"])) {
                if ($si["foto"] != "") {
                    $imgPerfil = $si["foto"];
                }
            }
            ?>
            <div class="user_photo" style="background-image: url(<?php echo $imgPerfil; ?>);">
                <div class="changePhoto" onclick="parent.main.slotMyPersonalData();">
                    Cambiar Foto
                </div>
            </div>
            <div class="user_name">
                <h3>
                    <?php echo $_SESSION["nombre"]; ?>     
                </h3>
            </div>
            <div class="user_info_basic">
                <p>
                    Cargo: <?php
                    if (isset($_SESSION["cargo"])) {
                        echo $_SESSION["cargo"];
                    }
                    ?>               
                </p>
                <p>
                    E-mail: <?php echo $_SESSION["email"]; ?>              
                </p>
            </div>
        </div>
        <?php
        include $_SERVER["DOCUMENT_ROOT"] . "/nwlib" . master::getNwlibVersion() . "/dashboard/modulos/slider.php";
        if (isset($configImg["mostrar_noticiasnw"])) {
            if ($configImg["mostrar_noticiasnw"] != "NO") {
                ?>
                <!--<div id="loadNewsNw">-->
                    <?php
//                    include $_SERVER["DOCUMENT_ROOT"] . "/nwlib" . master::getNwlibVersion() . "/dashboard/newsNw/index.php";
                    ?>
                <!--</div>-->
                <?php
            }
        }
        ?>
    </div>
    <?php
}

function readUserDash() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $where = " where 1=1 ";
    $where .= " and usuario=:usuario";
    if ($db->getDriver() == "ORACLE") {
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
        a.usuario=:usuario and ROWNUM <= 4
        GROUP BY
	a.modulo,b.nombre, b.parte
        ORDER BY
	SUM(a.visitas) DESC";
    } else {
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
	SUM(a.visitas) DESC limit 4";
    }
    $ca->prepare($sql);
    $ca->bindValue(":usuario", $_SESSION["usuario"], true);
    if (!$ca->exec()) {
        echo "Error:" . $ca->lastErrorText();
        return;
    }
    $total = $ca->size();
    if ($total == 0) {
        echo "<p>El software activa los aplicativos y funcionalidades dependiendo de tus necesidades. Al comenzar a abrir módulos, 
                    el aplicativo activa sólo lo que necesitas, mejorando la experiencia y la velocidad en la plataforma. 
                    Puedes cambiar el tema, el diseño del entorno, entre otras opciones.</p>";
        return;
    }
    echo "<h4>Estas son sus aplicaciones más usadas.
                    ¿Desea trabajar en...?
                </h4>";
    echo "<div class='contendMoreUsed'>";
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
            echo " <div  class='divReadUserModules' 
                       onclick=\"parent.qxnw.main.slotLoadModule('{$parte}', '{$r['modulo']}'); $execSlotInitial \">
                           <div class='diInterReadUss'>
                        {$r['nombre']}
                            </div>
                    </div>";
        }
    }
    echo "</div>";
}

function loadModules() {
    return nw_configuraciones::loadModules();
}

function notifications() {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $si = session::getInfo();
    $rta = "";
    if ($db->getDriver() == "ORACLE") {
        $ca->prepareSelect("nw_notifications_det a left join nw_notifications b on (a.notificacion=b.id) left join usuarios c on (b.enviado_por=c.usuario) ", "b.*,c.foto", "a.usuario=:usuario and a.leida<>:leida and ROWNUM <= 10 order by a.fecha desc");
    } else {
        $ca->prepareSelect("nw_notifications_det a left join nw_notifications b on (a.notificacion=b.id) left join usuarios c on (b.enviado_por=c.usuario) ", "b.*,c.foto", "a.usuario=:usuario and a.leida<>:leida order by fecha desc limit 10");
    }
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
            $rta .= "<div class='contend_blanc_lista_simple_p'>";
            $rta .= "<div class='userIconDiv'>";
            $rta .= "<div class='userIcon' style='background-image: url({$r["foto"]});'></div>";
            $rta .= "<span>" . $r["enviado_por"] . "</span>";
            $rta .= "</div>";
            $rta .= "<div class='dateNot'>" . $r["fecha"] . "</div>";
            $rta .= "<p>" . $r["mensaje"] . "</p>";
            $rta .= "</div>";
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
