<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
print nwprojectOut::getNwMakerLib();

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$cb = new NWDbQuery($db);
$p = $_GET;

$id_enc = "";
$fecha_inicial = "";
$fecha_final = "";
if (isset($p["id_enc"])) {
    $id_enc = $p["id_enc"];
}
if (isset($p["fecha_inicial"])) {
    $fecha_inicial = $p["fecha_inicial"];
}
if (isset($p["fecha_final"])) {
    $fecha_final = $p["fecha_final"];
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>NwForms</title>
        <meta http-equiv="Content-Type" content="text/html, charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery.min.js'></script>
        <style>
            body {
                position: relative;
                margin: 0;
                padding: 0;
                font-size: 12px;
                font-family: arial;
            }
            * {
                font-size: 12px;
            }
            table {
                position: relative;
                width: 100%;
                border-collapse: collapse;
            }
            tr {

            }
            th {
                border: 1px solid #ccc; 
            }
            td {
                border: 1px solid #ccc;
                position: relative;
                min-width: 150px;
                padding: 5px 3px;
            }
        </style>

        <script>
            document.addEventListener("DOMContentLoaded", function () {
                document.querySelector(".quitar_titulos").addEventListener("click", function () {
                    var d = document.querySelectorAll(".titleO");
                    for (var i = 0; i < d.length; i++) {
                        var a = d[i];
                        a.remove();
                    }
                });
                document.querySelector(".quitar").addEventListener("click", function () {
                    var a = document.querySelectorAll(".repeat");
                    for (var i = 0; i < a.length; i++) {
                        var b = a[i];
                        b.remove();
                    }
                });


                var b = document.querySelector(".botonExcelAdd");
                b.addEventListener("click", function () {
                    var h = document.querySelector(".containerTableMain").innerHTML;
                    downloadExcel(h);
                    return;
                    $("#datos_a_enviar").val($("<div>").append($("#Exportar_a_Excel").eq(0).clone()).html());
                    $("#FormularioExportacion").submit();
                });

            });
        </script>

    </head>
    <body>
        <div class="container">
            <div class="filters">
                <form>
                    <h3>
                        Seleccione formulario, fecha inicial y final
                    </h3>
                    Form 
                    <select name="id_enc" type="number" required="required" >
                        <option value="">Seleccione</option>
                        <?php
                        $ca->prepareSelect("nwforms_enc", "id,nombre", "1=1");
                        if (!$ca->exec()) {
                            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                            return;
                        }
                        $h = $ca->size();
                        if ($h == 0) {
                            echo "No existen formularios";
                            return;
                        }
                        for ($y = 0; $y < $h; $y++) {
                            $z = $ca->flush();
                            $s = "";
                            if ($id_enc == $z["id"]) {
                                $s = "selected";
                            }
                            echo "<option {$s} value='{$z["id"]}'>{$z["nombre"]}</option>";
                        }
                        ?>


                    </select>
                    Inicial <input name="fecha_inicial" type="date" required="required" value="<?php echo $fecha_inicial; ?>" />
                    Final <input name="fecha_final" type="date"  required="required" value="<?php echo $fecha_final; ?>" />
                    <input type="submit" value="Enviar" />
                </form>
                <h3>
                    Herramientas
                </h3>
                <div>
                    <input type="button" value="Quitar títulos de filas" class="quitar_titulos" />
                    <input type="button" value="Quitar columnas repetidas" class="quitar" />

                    <div class="botonExcelAdd" >
                        <br /> Descargar Excel  
                    </div>

                </div>
                <br />
            </div>
            <div class="containerTableMain">
                <table>
                    <?php
                    if (isset($p["fecha_inicial"]) && isset($p["fecha_final"]) && isset($p["id_enc"])) {

                        $where = " id_enc=:id ";
                        $where2 = "enc_user=:id";
                        if (isset($p["fecha_inicial"])) {
                            if ($p["fecha_inicial"] != "" && $p["fecha_final"] != "") {
                                $where .= " and DATE(fecha) between :fecha_inicial and :fecha_final";
                                $ca->bindValue(":fecha_inicial", $p["fecha_inicial"]);
                                $ca->bindValue(":fecha_final", $p["fecha_final"]);

                                $where2 .= " and DATE(fecha) between :fecha_inicial and :fecha_final ";
                                $cb->bindValue(":fecha_inicial", $p["fecha_inicial"]);
                                $cb->bindValue(":fecha_final", $p["fecha_final"]);
                            }
                        }


                        $where .= " and id is not null and id <> '' order by fecha desc";

//                    $where .= " limit 1";

                        $ca->prepareSelect("nwforms_respuestas_users_enc", "id,fecha,usuario", $where);
                        $ca->bindValue(":id", $id_enc);
                        if (!$ca->exec()) {
                            NWJSonRpcServer::error("Error ejecutando la consulta: " . $ca->lastErrorText());
                            return;
                        }
                        $data = array();
                        $total = $ca->size();
                        if ($total == 0) {
                            return false;
                        }

                        $th = "";
                        $t = "";
                        for ($i = 0; $i < $total; $i++) {
                            $r = $ca->flush();

                            $cb->prepareSelect("nwforms_respuestas_users", "campo,respuesta", $where2 . " order by id asc");
                            $cb->bindValue(":id", $r["id"]);
                            if (!$cb->exec()) {
                                NWJSonRpcServer::error("Error ejecutando la consulta: " . $cb->lastErrorText());
                                return;
                            }
                            $totald = $cb->size();
                            if ($totald > 0) {
                                $t .= "<tr>";
                                $t .= "<td>" . $r["fecha"] . "</td>";
                                $t .= "<td>" . $r["usuario"] . "</td>";


                                $num = 0;
                                $old = "";
                                for ($ia = 0; $ia < $totald; $ia++) {
                                    $ra = $cb->flush();
                                    $class = "repeat";
                                    if ($old != $ra["campo"]) {
                                        $num++;
                                        $class = "normal";
                                    }


                                    if ($i == 0) {
                                        $th .= "<th class='{$class}'>" . $ra["campo"] . "</th>";
                                    }

                                    $t .= "<td class='col col_{$num} {$class} '><strong class='titleO'>" . $ra["campo"] . "<br /></strong>";
                                    $t .= $ra["respuesta"] . "</td>";




                                    $old = $ra["campo"];
                                }

                                $t .= "</tr>";
                            }
                        }


                        echo "<tr><th></th><th></th>" . $th . "</tr>";
                        echo $t;
                    }
                    ?>
                </table>
            </div>
        </div>
    </body>
</html>