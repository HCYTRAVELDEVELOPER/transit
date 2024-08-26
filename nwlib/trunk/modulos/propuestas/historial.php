<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="stylesheet" type="text/css" href="/impresiones/propuestas/css/css_before_print.css" />
        <link rel="stylesheet" type="text/css" href="/impresiones/propuestas/css/estilos_new.css" media="print" ></link>
        <style type="text/css">
            body {
                background: #fff;
                font-family: Arial;
                font-size: 12px;
                margin: 0;
                padding: 0;
            }
            #contenedor{

            }
            .enc_history h1{

            }
            .history_list{

            }
            .history_list h1{

            }
            .history_list_table table{
                border-collapse: collapse;
            }
            .history_list_table td{
                border: 1px solid #ccc;
                padding: 5px;
            }
            .ubicador{
                position: fixed;
                top: 0;
                right: 0;
                background: #f1f1f1;
                padding: 5px;
                border: 1px solid #EEE;
                box-shadow: 0px 0px 15px rgba(0,0,0,0.2);
            }
            .ubicador h1{
                margin: 0;
                padding: 0;
            }
            .ubicador p{
                margin: 0;
                padding: 0;
            }
        </style>

        <script type="text/javascript" src="/<?php echo "nwlib{$cfg["nwlibVersion"]}"; ?>/includes/jquery/jquery-1.4.2.min.js" ></script>

    </head>
    <body>
        <div id="contenedor">
            <div class="bloques_text_center">
                <?php
                require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

                global $id_get;
                $id_get = $_GET["id"];

                function enviadas() {
                    global $id_get;
                    $dbdb = NWDatabase::database();
                    $ca = new NWDbQuery($dbdb);
                    $cb = new NWDbQuery($dbdb);
                    $wheree = " where id_propuesta=:id";

                    $sqla = "select *,func_concepto(cliente, 'clientes_prospecto') as cliente_text FROM propuestas_enviadas " . $wheree . " order by fecha desc";
                    $ca->prepare($sqla);
                    $ca->bindValue(":id", $_GET["id"]);
                    if (!$ca->exec()) {
                        echo "No se pudo realizar la consulta. ";
                        return;
                    }
                    if ($ca->size() == 0) {
                        echo "Esta propuesta no se ha enviado aún.";
                        return;
                    }
                    $r = $ca->flush();
                    echo "<div class='enc_history'>";
                    echo "<h1>Propuesta N°" . $r["id_propuesta"] . ". Cliente " . $r["cliente_text"] . "</h1>";
                    echo "<span>Creada el " . $r["fecha"] . " por " . $r["usuario"] . "</span><br /><br />";
                    for ($ii = 0; $ii < $cb->size(); $ii++) {
                        $cb->next();
                        $rr = $cb->assoc();
                        echo "Enviada el " . $rr["fecha"] . " por " . $rr["usuario"];
                        echo "<br />";
                        echo "</div>";
                    }
                }

                function movimientos() {
                    global $id_get;
                    $dbdb = NWDatabase::database();
                    $cb = new NWDbQuery($dbdb);
                    $wheree = " where id_propuesta=:id";

                    $sqla = "select *,func_concepto(cliente, 'clientes_prospecto') as cliente_text FROM propuestas_movs " . $wheree . " order by fecha desc";
                    $cb->prepare($sqla);
                    $cb->bindValue(":id", $id_get);
                    if (!$cb->exec()) {
                        echo "No se pudo realizar la consulta. ";
                        return;
                    }
                    if ($cb->size() == 0) {
                        echo "<br />la propuesta no ha sido vista aún, lo sentimos! Revise de nuevo en otro momento.";
                    } else {
                        echo "<div class='bloques_text_center history_list_table'>";
                        echo "<h1>Historial de Movimientos, lectura, descargas y aprobación</h1>";
                        echo "<table>";
                        echo "<tr>";
                        echo "<td>FECHA Y HORA</td>";
                        echo "<td>ACCIÓN</td>";
                        echo "<td>IP</td>";
                        echo "<td>CIUDAD</td>";
                        echo "<td>OBSERVACIONES</td>";
                        echo "</tr>";
                        for ($ii = 0; $ii < $cb->size(); $ii++) {
                            $cb->next();
                            $rr = $cb->assoc();
                            echo "<tr>";
                            echo "<td>" . $rr["fecha"] . "</td>";
                            echo "<td>" . $rr["accion"] . "</td>";
                            echo "<td>" . $rr["ip"] . "</td>";
                            echo "<td>";
                            //   echo $rr["ciudad"];
//                        $tags = get_meta_tags('http://www.geobytes.com/IpLocator.htm?GetLocation&template=php3.txt&IpAddress=190.146.116.165');
                            if (isset($tags['city'])) {
                                print $tags['city'];  // city name
                            }
                            echo "</td>";
                            echo "<td>" . $rr["observaciones"] . "</td>";
                            echo "</tr>";
                        }
                        echo "</table>";
                    }
                    echo "<div class='ubicador'>";
                    ?>
                    <h1>Ubicador de IP</h1>
                    <p>
                        Copia y pega la ip que quiere ubicar.
                    </p>
                    BEGIN: GeoIPView.com IP Locator 
                    <script type="text/javascript" src="http://api.geoipview.com/api.php?t=1&amp;lang=es&amp;w=230&amp;h=300&amp;bg=ECDDC0&amp;bd=8DADCC&amp;tx=222222"></script>                        
                    END: GeoIPView.com IP Locator 
                    <?php
                    echo "</div>";
                    echo "</div>";
                }

                enviadas();
                movimientos();
                ?>
            </div>
        </div>
    </body>
</html>
