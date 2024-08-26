<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//ES" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

        <link rel="stylesheet" type="text/css" href="/impresiones/nw_rh/css/css_before_print.css" />
        <link rel="stylesheet" type="text/css" href="/impresiones/nw_rh/css/estilos_new.css" media="print" ></link>
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

        <script type="text/javascript" src="/nwlib/includes/jquery/jquery-1.4.2.min.js" ></script>

    </head>
    <body>
        <div id="contenedor">
            <div class="bloques_text_center">
                <?php
                require_once dirname(__FILE__) . '/../../rpcsrv/_mod.inc.php';
                global $id_get;
                global $nivel_get;
                $id_get = $_GET["id"];
                $nivel_get = $_GET["nivel"];

                function hv() {
                    global $id_get;
                    global $nivel_get;
                    $dbdb = NWDatabase::database();
                    $cb = new NWDbQuery($dbdb);
                    $cb->prepareSelect("rh_datos_basicos", "*,func_concepto(cargo_postulante, 'rh_cargos') as cargo_postulante_text", "documento=:documento");
                    $cb->bindValue(":documento", $id_get);
                    if (!$cb->exec()) {
                        echo "No se pudo realizar la consulta. ";
                        return;
                        return;
                    }
                    if ($cb->size() == 0) {
                        echo "<br />la propuesta no ha sido vista aún, lo sentimos! Revise de nuevo en otro momento.";
                        return;
                    }
                    $cb->next();
                    $rr = $cb->assoc();
                    global $cargo_postulante;
                    $cargo_postulante = $rr["cargo_postulante"];
                    echo "<div class='bloques_text_center history_list_table'>";
                    echo "<h1>Evaluación de hoja de vida Nivel $nivel_get</h1>";
                    echo "<h3>Postulante: " . $rr["nombre_uno"] . " " . $rr["nombre_dos"] . " " . $rr["apellido_uno"] . " " . $rr["apellido_dos"] . "</h3>";
                    echo "<p>Documento: $id_get. Nivel: $nivel_get. Cargo Postulante: " . $rr["cargo_postulante_text"] . "</p>";
                    echo "</div>";
                }

                function max_puntaje($p) {
                    global $id_get;
                    global $nivel_get;
                    global $cargo_postulante;
                    $dbdb = NWDatabase::database();
                    $cb = new NWDbQuery($dbdb);
                    $cb->prepareSelect("rh_evaluacion_respuestas", "*", "id_pregunta=:id order by puntaje desc");
                    $cb->bindValue(":cargo", $cargo_postulante);
                    $cb->bindValue(":nivel", $nivel_get);
                    $cb->bindValue(":id", $p);
                    if (!$cb->exec()) {
                        echo "No se pudo realizar la consulta. ";
                        return;
                    }
                    if ($cb->size() == 0) {
                        echo "<br />No existe la evaluación.";
                        return;
                    }
                    $cb->next();
                    $rr = $cb->assoc();
                    global $max_puntaje;
                    $max_puntaje = $rr["puntaje"];
                    echo $max_puntaje;
                }

                function movimientos() {
                    global $id_get;
                    global $nivel_get;
                    global $max_puntaje;
                    $dbdb = NWDatabase::database();
                    $cb = new NWDbQuery($dbdb);
                    $wheree .= " where id_propuesta=:id";

                    $cb->prepareSelect("rh_evaluacion_preguntas_result", "*,
                                                                            func_concepto(pregunta, 'rh_evaluacion_preguntas') as pregunta_text,
                                                                            func_concepto(respuesta, 'rh_evaluacion_respuestas') as respuesta_text
                                                                            ", "documento=:documento and nivel=:nivel");
                    $cb->bindValue(":documento", $id_get);
                    $cb->bindValue(":nivel", $nivel_get);
                    if (!$cb->exec()) {
                        echo "No se pudo realizar la consulta. ";
                        return;
                        return;
                    }
                    if ($cb->size() == 0) {
                        echo "<br />la evaluación no ha sido realizada, lo sentimos! Revise de nuevo en otro momento.";
                        return;
                    }
                    echo "<table>";
                    echo "<tr>";
                    echo "<th>Fecha</th>";
                    echo "<th>Pregunta</th>";
                    echo "<th>Respuesta</th>";
                    echo "<th>Puntaje</th>";
                    echo "<th>Max Puntaje</th>";
                    echo "</tr>";
                    for ($ii = 0; $ii < $cb->size(); $ii++) {
                        $cb->next();
                        $rr = $cb->assoc();
                        $id = $rr["pregunta"];
                        echo "<tr>";
                        echo "<td>" . $rr["fecha"] . "</td>";
                        echo "<td>" . $rr["pregunta_text"] . "</td>";
                        echo "<td>" . $rr["respuesta_text"] . "</td>";
                        echo "<td>" . $rr["puntaje"] . "</td>";
                        echo "<td>";
                        max_puntaje($id);
                        echo "</td>";
                        //   echo "<td> $max_puntaje </td>";
                        echo "</tr>";
                        $total_puntaje += $rr["puntaje"];
                        $total_puntaje_max += $max_puntaje;
                    }
                    $resultado = "";
                    $color_fondo = "";
                    $resultado_status = "";
                    if ($total_puntaje < $total_puntaje_max) {
                        $puntaje_medio = $total_puntaje_max / 2;
                        $puntaje_cuarto = $puntaje_medio / 2;
                        $puntaje_75 = $puntaje_cuarto * 3;
                        if ($total_puntaje > $puntaje_medio & $total_puntaje <= $puntaje_75) {
                            $resultado = "Pasa, pero no obtuvo el mejor resultado, estuvo entre el 50% y el 75% del resultado máximo.";
                            $color_fondo = "background: orange;";
                            $resultado_status = "Medio";
                        } else
                        if ($total_puntaje <= $puntaje_medio & $total_puntaje >= $puntaje_cuarto) {
                            $resultado = "No pasa. Obtuvo menos del promedio";
                            $color_fondo = "background: rgb(255, 144, 144);";
                            $resultado_status = "Malo";
                        } else
                        if ($total_puntaje <= $puntaje_cuarto) {
                            $resultado = "Super malo. Obtuvo menos del 25% del puntaje total.";
                            $color_fondo = "background: red;";
                            $resultado_status = "Muy malo, no lo contrate";
                        }
                    } else
                    if ($total_puntaje >= $total_puntaje_max) {
                        $resultado = "Excelente! Cumple con todas las expectativas. Respondió todas las preguntas con el mayor puntaje.";
                        $color_fondo = "background: #76E26D;";
                        $resultado_status = "Excelente";
                    }
                    echo "<tr class='tr_end' style='$color_fondo'>";
                    echo "<td colspan='2'>Resultado: $resultado_status</td>";
                    echo "<td>Puntaje Total:</td>";
                    echo "<td> $total_puntaje </td>";
                    echo "<td> $total_puntaje_max </td>";
                    echo "</tr>";

                    echo "<tr>";
                    echo "<td colspan='5'> $resultado </td>";
                    echo "</tr>";
                    echo "</table>";
                    echo "</div>";
                }

                hv();
                movimientos();
                ?>
            </div>
        </div>
    </body>
</html>
