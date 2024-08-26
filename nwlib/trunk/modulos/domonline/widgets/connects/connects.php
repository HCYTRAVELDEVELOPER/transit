<?php

require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';

function consulta() {
    session::check();
    $si = session::info();
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $rta = "";
    $fechaMayor = nwMaker::sumaRestaFechas("+0 hour", "+25 minute", "+0 second");
    $fechaMenor = nwMaker::sumaRestaFechas("+0 hour", "-55 minute", "+0 second");
    $where = " empresa_cliente=:empresa_cliente and terminal=:terminal  ";
//    $where .= "and estado<>:estado ";
    $where .= " and (fecha_salida >=:fecha_menor and fecha_salida<=:fecha_mayor) ";
    $where .= " order by fecha_salida desc ";
    $ca->prepareSelect("pv_salidas", "*", $where);
    $ca->bindValue(":empresa_cliente", $si["cliente"]);
    $ca->bindValue(":terminal", $si["terminal"]);
    $ca->bindValue(":estado", "4");
    $ca->bindValue(":fecha_menor", $fechaMenor);
    $ca->bindValue(":fecha_mayor", $fechaMayor);
    if (!$ca->exec()) {
        NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->preparedQuery());
    }
    $total = $ca->size();
    $noatendidos = "";
    $totalnoatendidos = 0;
    $totalatendidos = 0;
    $atendidos = "";
    $despachados = "";
    $totaldespachados = "";
    $totalrechazados = 0;
    $rechazados = "";
    $totalcancelados = 0;
    $totalcanceladosyaceptados = 0;
    $cancelados = "";
    $canceladosyaceptados = "";
    if ($total > 0) {
        for ($i = 0; $i < $total; $i++) {
            $ca->next();
            $r = $ca->assoc();
            
            $vista = "";
            $textAtender = "";

            if ($r["estado"] == 1) {
                $rta .= "<audio src='/nwlib6/modulos/nw_soporte_chat/src/ring.mp3' autoplay></audio>";
                $textAtender = "<div class='buttons_domBT buttonGreen'>Atender</div>";
            } else
            if ($r["estado"] == 2) {
//                $textAtender = "<div class=''>Despachar</div>";
                $textAtender = "<div class=''></div>";
                $vista = "ATENDIDO";
            }
            if ($r["estado"] == 3) {
                $textAtender = "<div class=''>Despachado</div>";
                $vista = "DESPACHADO";
            }
            if ($r["estado"] == 5) {
                $rta .= "<audio src='/nwlib6/modulos/nw_soporte_chat/src/ring.mp3' autoplay></audio>";
                $textAtender = "<div class='buttons_domBT buttonBlue'>Entendido!</div>";
            }

            $click = "onclick=\"parent.nwproject5.main.slotAtender({$r["id"]}, '{$vista}', {$r["costo_domicilio"]});\"";
            if ($r["estado"] == 5) {
                $click = "onclick=\"parent.nwproject5.main.slotAtenderCancelado({$r["id"]});\"";
            }

            $registro = "<div class='user_chat' $click  style='cursor: pointer;'><div class='img_user_chat'  ></div><div class='contain_users_dom'>
        <h3>{$r["cliente_text"]}</h3>{$r["direccion"]} {$r["barrio"]} {$r["telefono"]}<p>{$r["fecha_salida"]}</p></div><div class='buttons_dom'>{$textAtender}</div></div>
        ";
        
            if ($r["estado"] == 1) {
                $noatendidos .= $registro;
                $totalnoatendidos++;
            } else
            if ($r["estado"] == 2) {
                $atendidos .= $registro;
                $totalatendidos++;
            } else
            if ($r["estado"] == 3) {
                $despachados .= $registro;
                $totaldespachados++;
            } else
            if ($r["estado"] == 4) {
                $rechazados .= $registro;
                $totalrechazados++;
            }
            if ($r["estado"] == 5) {
                $cancelados .= $registro;
                $totalcancelados++;
            }
            if ($r["estado"] == 7) {
                $canceladosyaceptados .= $registro;
                $totalcanceladosyaceptados++;
            }
        }
    }

    $rta .= "<div class='atendidos'>";
    if ($totalnoatendidos == 0) {
        $rta .= "0pedidos<h4 style='background: #e6e6e6; color: #333; '>Hay <span class='num_dom'>0</span> pedidos en línea</h4>";
    } else {
        $rta .= "<h4>¡Hay <span class='num_dom'>{$totalnoatendidos}</span> pedido(s) nuevo(s)</h4>";
    }
    $rta .= $noatendidos;
    $rta .= "</div>";

    $rta .= "<div class='atendidos'>";
    $rta .= "<h3>{$totalatendidos} pedido reciente(s) atendido(s) </h5>";
    $rta .= $atendidos;
    $rta .= "</div>";

    if ($totaldespachados > 0) {
        $rta .= "<div class='noatendidos'>";
        $rta .= "<h3>{$totaldespachados} pedido reciente(s) despachado(s)</h5>";
        $rta .= $despachados;
        $rta .= "</div>";
    }

    if ($totalrechazados > 0) {
        $rta .= "<div class='noatendidos'>";
        $rta .= "<h3>{$totalrechazados} pedido reciente(s) rechazado(s)</h5>";
        $rta .= $rechazados;
        $rta .= "</div>";
    }
    if ($totalcancelados > 0) {
        $rta .= "<div class='noatendidos pedidoscancelados'>";
        $rta .= "<h3>{$totalcancelados} pedido reciente(s) cancelados(s)</h5>";
        $rta .= $cancelados;
        $rta .= "</div>";
    }
    if ($totalcanceladosyaceptados > 0) {
        $rta .= "<div class='noatendidos pedidoscanceladosyaceptados'>";
        $rta .= "<h3>{$totalcanceladosyaceptados} pedidos recientes cancelados y aceptados por la tienda</h5>";
        $rta .= $canceladosyaceptados;
        $rta .= "</div>";
    }

    return $rta;
}

print_r(consulta());
?>
