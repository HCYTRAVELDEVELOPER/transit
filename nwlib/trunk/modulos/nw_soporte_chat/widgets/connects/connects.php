<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

function consulta() {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $cb = new NWDbQuery($db);
    $fechaMayor = nwMaker::sumaRestaFechas("+0 hour", "+15 minute", "+0 second");
    $fechaMenor = nwMaker::sumaRestaFechas("+0 hour", "-15 minute", "+0 second");
//            and (EXTRACT(EPOCH FROM fecha::timestamp) > (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 1800)) ");
    if ($db->getDriver() == "MYSQL") {
        $where = " 1=1 ";
//        $where .= " and terminal=:terminal ";
        $where .= " and (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') and (fecha >=:fecha_menor and fecha<=:fecha_mayor)  ";
        $where .= " order by fecha desc  ";
        $ca->prepareSelect("sop_visitantes", "*", $where);
//        $ca->prepareSelect("sop_visitantes", "*", "terminal=:terminal and (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') 
//        and TIMESTAMPDIFF(MINUTE,DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE),CAST(fecha AS DATETIME)) > 0 ");
    } else if ($db->getDriver() == "PGSQL") {
        $where = " 1=1 ";
        $where .= " and terminal=:terminal ";
        $where .= " and (estado<>'NO_CONECTADO' and estado<>'DESCONECTADO') 
        and (EXTRACT(EPOCH FROM fecha::timestamp) > (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) - 1800)) ";
        $ca->prepareSelect("sop_visitantes", "*", $where);
    } else {
        echo "NO para ORACLE POR EL MOMENTO...";
        return;
    }
    $ca->bindValue(":terminal", $si["terminal"]);
    $ca->bindValue(":fecha_menor", $fechaMenor);
    $ca->bindValue(":fecha_mayor", $fechaMayor);
    if (!$ca->exec()) {
        NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
    }
    $cb->prepareUpdate("sop_operadores", "fecha", "usuario=:usuario");
    $cb->bindValue(":fecha", date("Y-m-d H:i:s"));
    $cb->bindValue(":usuario", $si["usuario"]);
    if (!$cb->exec()) {
        NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->preparedQuery());
    }
    $total = $ca->size();
    if ($total == 1) {
        echo "<h4>Hay $total usuario conectado</h4>";
    } else
    if ($total == 0) {
        echo "<h4>Hay $total usuarios conectados</h4>";
    } else
    if ($total > 1) {
        echo "<h4>Hay $total usuarios conectados</h4>";
    }
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            $css = "";
            $click = "";
            $atentidopor = "";
            if ($r["estado"] == "LLAMANDO") {
                $css = "background: orange; color: #fff; ";
                $click = "onclick=\"parent.soporte.trees.soporte.slotAtender(" . $r["id"] . "); publicatInt();\"";
                ?>
                <audio src="/nwlib6/modulos/nw_soporte_chat/src/ring.mp3" autoplay></audio>
                <?php
            }
            if ($r["estado"] == "ATENDIDO") {
                $css = "background: green; color: #fff; ";
                $atentidopor = " por: " . $r["atiende"];
            }
            echo "<div class='user_chat' $click  style='cursor: pointer; $css '>
                            <div class='img_user_chat'  ></div>
                            <div class='contain_data_chat'>
                            <p>
                                " . $r["nombre"] . " " . $r["ip"] . "
                            </p>
                            <p>
                                " . $r["estado"] . " $atentidopor
                            </p>
                            <p>
                                " . $r["fecha"] . " $atentidopor
                            </p>
                            <p>
                                " . $r["url"] . " $atentidopor
                            </p>
                        </div>
                       </div>
                    ";
        }
    }
}

consulta();
?>
