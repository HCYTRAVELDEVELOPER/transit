<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

$noen = "No disponible";

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$documento = $_GET["id"];
if (!isset($documento)) {
    return;
}
if ($documento == "") {
    return;
}
if ($documento == 0) {
    return;
}
$where = " where documento=:documento";
$sql = "select *,'<img src=\"' || foto || '\" width=\"auto\" height=\"150px\"  style=\"text-align\: center\;\" />' as img_show,
                                                 func_concepto(cargo_postulante, 'rh_cargos') as cargo_postulante_text,
                                                 func_concepto(estado, 'rh_estado_hv') as estado_text,
                                                 func_concepto(sexo, 'rh_sexo') as sexo_text,
                                                 func_concepto(profesion, 'rh_profesiones') as profesion_text,
                                                 func_concepto(estado_civil, 'estado_civil') as estado_civil_text,
                                                 func_concepto(ciudad, 'ciudades') as ciudad_text from rh_datos_basicos " . $where;
$ca->prepare($sql);
$ca->bindValue(":documento", $documento);
if (!$ca->exec()) {
    echo "No se pudo realizar la consulta.";
    return;
}
if ($ca->size() == 0) {
    echo "No se han encontrado datos";
}
for ($i = 0; $i < $ca->size(); $i++) {
    $ca->next();
    $r = $ca->assoc();
}

function datos_educativos() {
    $db = NWDatabase::database();
    $caa = new NWDbQuery($db);
    global $documento;
    $where = " where documento=:documento order by fecha_final desc";
    $sqll = "select *,func_concepto(nivel_educativo, 'rh_niveles_educativos') as nivel_educativo_text from rh_datos_educativos" . $where;
    $caa->prepare($sqll);
    $caa->bindValue(":documento", $documento);
    if (!$caa->exec()) {
        echo "No se pudo realizar la consulta.";
        return;
    }
    if ($caa->size() == 0) {
        echo "No se han encontrado datos";
        return;
    }
    echo "<tr>";
    echo "<td>Nivel Educativo</td>";
    echo "<td>Institución</td>";
    echo "<td>Carrera</td>";
    echo "<td>Fecha de Inicio</td>";
    echo "<td>Fecha de finalización</td>";
    echo "<td>Observaciones</td>";
    echo "</tr>";
    for ($ii = 0; $ii < $caa->size(); $ii++) {
        $caa->next();
        $ra = $caa->assoc();
        echo "<tr>";
        echo "<td>" . $ra["nivel_educativo_text"] . "</td>";
        echo "<td>" . $ra["institucion"] . "</td>";
        echo "<td>" . $ra["carrera"] . "</td>";
        echo "<td>" . $ra["fecha_inicio"] . "</td>";
        echo "<td>" . $ra["fecha_final"] . "</td>";
        echo "<td>" . $ra["observacion"] . "</td>";
        echo "</tr>";
    }
}

function datos_laborales() {
    $db = NWDatabase::database();
    $caa = new NWDbQuery($db);
    global $documento;
    $where = " where documento=:documento order by fecha_ingreso desc";
    $sqll = "select *,func_concepto(estado, 'rh_experiencia_laboral_estados') as estado_text from rh_experiencia_laboral" . $where;
    $caa->prepare($sqll);
    $caa->bindValue(":documento", $documento);
    if (!$caa->exec()) {
        echo "No se pudo realizar la consulta.";
        return;
    }
    if ($caa->size() == 0) {
        echo "No se han encontrado datos";
        return;
    }
    echo "<tr>";
    echo "<td>Empresa</td>";
    echo "<td>Cargo</td>";
    echo "<td>Ingreso</td>";
    echo "<td>Salida</td>";
    echo "<td>Estado</td>";
    echo "<td>País</td>";
    echo "<td>Ciudad</td>";
    echo "<td>Adjunto</td>";
    echo "<td>Observaciones</td>";
    echo "</tr>";
    for ($ii = 0; $ii < $caa->size(); $ii++) {
        $caa->next();
        $ra = $caa->assoc();
        echo "<tr>";
        echo "<td>" . $ra["empresa_laboral"] . "</td>";
        echo "<td>" . $ra["cargo"] . "</td>";
        echo "<td>" . $ra["fecha_ingreso"] . "</td>";
        echo "<td>" . $ra["fecha_salida"] . "</td>";
        echo "<td>" . $ra["estado_text"] . "</td>";
        echo "<td>" . $ra["pais"] . "</td>";
        echo "<td>" . $ra["ciudad"] . "</td>";
        $adjunto_image = $ra["adjunto"];
        echo "<td><a href='" . $adjunto_image . "' target='_blank'><img src='" . $ra["adjunto"] . "' width='20px' /></a></td>";
        echo "<td>" . $ra["observaciones"] . "</td>";
        echo "</tr>";
    }
}

function datos_familiares() {
    $db = NWDatabase::database();
    $caa = new NWDbQuery($db);
    global $documento;
    $where = " where documento=:documento";
    $sqll = "select *,
                      func_concepto(tipo, 'rh_tipo') as tipo_text,
                      func_concepto(sexo, 'rh_sexo') as sexo_text
                      from rh_datos_familiares" . $where;
    $caa->prepare($sqll);
    $caa->bindValue(":documento", $documento);
    if (!$caa->exec()) {
        echo "No se pudo realizar la consulta.";
        return;
    }
    if ($caa->size() == 0) {
        echo "No se han encontrado datos";
        return;
    }
    echo "<tr>";
    echo "<td>Tipo de Documento</td>";
    echo "<td>Documento</td>";
    echo "<td>Nombre</td>";
    echo "<td>Edad</td>";
    echo "<td>Parentesco</td>";
    echo "<td>Género</td>";
    echo "<td>Telefono</td>";
    echo "</tr>";
    for ($ii = 0; $ii < $caa->size(); $ii++) {
        $caa->next();
        $ra = $caa->assoc();
        echo "<tr>";
        echo "<td>" . $ra["tipo_doc"] . "</td>";
        echo "<td>" . $ra["documento_familiar"] . "</td>";
        echo "<td>" . $ra["nombre"] . "</td>";
        echo "<td>" . $ra["edad"] . "</td>";
        echo "<td>" . $ra["tipo_text"] . "</td>";
        echo "<td>" . $ra["sexo_text"] . "</td>";
        echo "<td>" . $ra["telefono"] . "</td>";
        echo "</tr>";
    }
}
?>


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Hoja de Vida</title>

        <style type="text/css">
            body{
                position: relative;
                margin: 0;
                padding: 0;
                font-family: Arial;
                font-size: 12px;
                color: #777;
                text-transform: uppercase;
                background: #eee;
            }
            .no_encontrado{
                color: firebrick;
                opacity: 0.3;
                font-weight: bold;
                font-size: 10px;
            }
            #contenedor{
                position: relative;
                margin: auto;
                width: 900px;
                height: auto;
                max-width: 900px;
                min-width: 900px;
                overflow: hidden;
                background: #fff;
                box-shadow: 0px 0px 10px rgba(0,0,0,0.3);
                margin-top: 20px;
                margin-bottom: 20px;
            }
            #contenedor h2 {
                color: firebrick;
            }
            #contenedor table{
                border-collapse: collapse;
                border-radius: 10px;
                overflow: hidden;
                width: 100%;
            }
            #contenedor td{
                border: 1px solid #e6e6e6;	
                padding: 7px;
            }
            #contenedor th{
                text-align:left;
                border: 1px solid #e6e6e6;
                padding: 8px;
                text-transform: none;
            }
        </style>
    </head>
    <body>
        <div id="contenedor">
            <img src="<?php echo $empresa["logo"]; ?>" style="float: left; margin-bottom: 10px; max-width: 200px;" />
            <h1 style="float: right;right: 10px;position: relative;">
                Hoja de Vida N°<?php echo $r["id"]; ?>
            </h1>
            <h2>
                Datos Básicos
            </h2>
            <table>
                <tr>
                    <td>
                        Cargo postulante:  <?php echo $r["cargo_postulante_text"]; ?>
                    </td>
                    <td>
                        Estado: 
                        <?php echo $r["estado_text"]; ?>
                    </td>
                    <?php
                    if ($r["foto"] != null || $r["foto"] != "") {
                        echo "<td>" . $r["img_show"] . "</td>";
                    } else {
                        echo "";
                    }
                    ?>
                </tr>
                <tr>
                    <th>Nombres y Apellidos</th>
                    <th>Cédula</th>
                    <th>Fecha de Nacimiento</th>
                </tr>
                <tr>
                    <td><?php
                        echo $r["nombre_uno"];
                        echo " " . $r["nombre_dos"];
                        echo " " . $r["apellido_uno"];
                        echo " " . $r["apellido_dos"]
                        ?>
                    </td>
                    <td>
                        <?php echo $r["documento"]; ?>
                    </td>
                    <td>        
                        <?php echo $r["fecha_nacimiento"]; ?>
                    </td>
                </tr>
                <tr>
                    <th>Correo Personal</th>
                    <th>N° Teléfono</th>
                    <th>N° Celular</th>
                </tr>
                <tr>
                    <td>         
                        <?php
                        if ($r["correo"] == null) {
                            echo $noen;
                        } else {
                            echo $r["correo"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["telefono_fijo"] == null) {
                            echo $noen;
                        } else {
                            echo $r["telefono_fijo"];
                        }
                        ?>
                    </td>
                    <td>         <?php
                        if ($r["celular"] == null) {
                            echo $noen;
                        } else {
                            echo $r["celular"];
                        }
                        ?></td>
                </tr>
                <tr>
                    <th>Dirección</th>
                    <th>Ciudad</th>
                    <th>Observaciones</th>
                </tr>
                <tr>
                    <td>         
                        <?php
                        if ($r["direccion"] == null) {
                            echo $noen;
                        } else {
                            echo $r["direccion"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["ciudad"] == null) {
                            echo $noen;
                        } else {
                            echo $r["ciudad_text"];
                        }
                        ?>
                    </td>
                    <td>         <?php
                        if ($r["observaciones"] == null) {
                            echo $noen;
                        } else {
                            echo $r["observaciones"];
                        }
                        ?></td>
                </tr>
                <tr>
                    <th>Género</th>
                    <th>Estado Civíl</th>
                    <th>Profesión</th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($r["sexo"] == null) {
                            echo $noen;
                        } else {
                            echo $r["sexo_text"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["estado_civil"] == null) {
                            echo $noen;
                        } else
                        if ($r["estado_civil_text"] == "CASADO" & $r["sexo_text"] == "FEMENINO") {
                            echo "Casada";
                        } else {
                            echo $r["estado_civil_text"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($r["profesion_text"] == null) {
                            echo $noen;
                        } else {
                            echo $r["profesion_text"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h3>Adjuntos</h3>
                        <?php
                        $adjunto_image = $r["adjunto"];
                        $adjunto_image_name = str_replace("/var/www/nwadmin3/", "", $adjunto_image);
                        $adjunto_image_name = str_replace("/nwlib6/modulos/nw_rrhh/imp", "", $adjunto_image_name);
//                        $adjunto_image_name = $_SERVER['HTTP_HOST'] . "/" . $r["adjunto"];
                        if ($r["adjunto"] == null) {
                            echo "No hay adjuntos disponibles";
                        } else
                            echo "<a href='" . $adjunto_image_name . "' target='_blank'>
                                 <br /> " . $adjunto_image_name . "
                                  </a>";
                        ?>
                    </td>
                </tr>
            </table>
            <br />
            <br />
            <br />
            <table>
                <tr>
                    <td colspan="3">
                        <h2>Datos Educativos</h2>
                    </td>
                </tr>
                <tr> 
                    <td colspan="3">
                        <table width="100%">
                            <?php
                            datos_educativos();
                            ?>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Experiencia Laboral</h2>
                    </td>
                </tr>
                <tr> 
                    <td colspan="3">
                        <table width="100%">
                            <?php
                            datos_laborales();
                            ?>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Datos Familiares</h2>
                    </td>
                </tr>
                <tr> 
                    <td colspan="3">
                        <table width="100%">
                            <?php
                            datos_familiares();
                            ?>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
