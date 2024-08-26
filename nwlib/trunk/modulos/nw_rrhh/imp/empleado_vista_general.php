<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";

function consultaTable($table, $campo, $fields, $p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect($table, $fields, "{$campo}=:id");
    $ca->bindValue(":id", $p);
    if (!$ca->exec()) {
        return "No se pudo realizar la consulta." . $ca->lastErrorText();
        return;
    }
    if ($ca->size() == 0) {
        return $ca->size();
    }
    $ca->next();
    return $ca->assoc();
}

$id_documento = $_GET["id"];
$noen = "<p class='no_encontrado'>Registro no encontrado</p>";

$r = consultaTable("rh_empleados", "documento", "*", $id_documento);
if ($r == 0) {
    echo $noen . " rh_empleados";
    return;
}
$hv = consultaTable("rh_datos_basicos", "documento", "*", $id_documento);
if ($hv == 0) {
    echo $noen . " rh_datos_basicos";
    return;
}
$el = consultaTable("rh_experiencia_laboral", "documento", "*", $id_documento);
if ($el == 0) {
    echo $noen . " rh_experiencia_laboral";
    return;
}
$estado = consultaTable("rh_estado", "id", "*", $r["estado"]);
if ($estado == 0) {
    echo $noen . " rh_datos_basicos";
    return;
}

//$where = "";
//if (isset($r["hv"])) {
//    $where .= " where id = " . $r["hv"];
//}
//$query = pg_exec("select *,func_concepto(ciudad, 'ciudades') as nom_ciudad, 
//    func_concepto(zona_asignada, 'rh_zonas') as nom_zona, 
//    func_concepto(departamento, 'rh_zonas') as nom_departamento 
//    FROM rh_hoja_vida " . $where);
//$hv = pg_fetch_array($query);

//$where = "";
//if (isset($id_documento)) {
//    $where .= " where id_hv = " . $id_documento;
//}
//$query = pg_exec("select * FROM rh_experiencia_laboral " . $where);
//$el = pg_fetch_array($query);

//MAESTROS
//$where = "";
//if (isset($r["estado"])) {
//    $where .= " where id = " . $r["estado"];
//}
//$query = pg_exec("select * FROM rh_estado " . $where);
//$estado = pg_fetch_array($query);


$where = "";
if (isset($r["id"])) {
    $where .= " where id_empleado = " . $r["id"];
}
$query = pg_exec("select *,
func_concepto(emp_contratante, 'rh_empresa_contratante') as nom_emp_contratante,
func_concepto(proyecto, 'proyectos') as nom_proyecto,
func_concepto(area, 'rh_areas') as nom_area,  
func_concepto(jefe_inmediato, 'view_empleados') as nom_jefe_inmediato,  
func_concepto(tipo_servicio, 'rh_tipos_servicio') as nom_tipo_servicio,  
func_concepto(cargo, 'rh_cargos') as nom_cargo,  
func_concepto(rol_operacion, 'rh_rol_operacion') as nom_rol_operacion,  
func_concepto(riesgo, 'rh_riesgos') as nom_riesgo,  
func_concepto(riesgo_asociado, 'rh_riesgo_asociado') as nom_riesgo_asociado,  
func_concepto(paz_salvo, 'rh_paz_salvo') as nom_paz_salvo,  
func_concepto(nov_disciplinarias, 'rh_novedades_disciplinarias') as nom_nov_disciplinarias,  
func_concepto(nov_osh, 'rh_novedades_osh') as nom_nov_osh FROM rh_datos_contratacion " . $where);
$contract = pg_fetch_array($query);
//print_r($contract);

$where = "";
if (isset($r["profesion"])) {
    $where .= " where id = " . $r["profesion"];
}
$query = pg_exec("select * FROM rh_profesiones " . $where);
$profesion = pg_fetch_array($query);

$where = "";
if (isset($r["conocimientos"])) {
    $where .= " where id = " . $r["conocimientos"];
}
$query = pg_exec("select * FROM rh_conocimientos " . $where);
$conocimientos = pg_fetch_array($query);

$where = "";
if (isset($r["nivel_conocimientos"])) {
    $where .= " where id = " . $r["nivel_conocimientos"];
}
$query = pg_exec("select * FROM rh_nivel_conocimientos " . $where);
$nivelconocimientos = pg_fetch_array($query);


$query = pg_exec("select * FROM empresas");
$empresa = pg_fetch_array($query);
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
                Empleado N°<?php echo $r["id"]; ?>
            </h1>
            <table>
                <tr>
                    <td colspan="2">
                        <h2>Datos Básicos</h2>
                    </td>
                    <td style="text-align: center;">
                        Estado: 
                        <?php
                        if ($r["estado"] == null) {
                            echo $noen;
                        } else
                        if ($r["estado"] == 1) {
                            echo "<strong style='color: green;'>" . $estado["nombre"] . "</p>";
                        } else
                        if ($r["estado"] == 2) {
                            echo "<strong style='color: yellow;'>" . $estado["nombre"] . "</p>";
                        } else
                        if ($r["estado"] == 3) {
                            echo "<strong style='color: red;'>" . $estado["nombre"] . "</p>";
                        }
                        else
                            echo $estado["nombre"];
                        ?>
                    </td>
                </tr>
                <tr>
                    <th>Nombres y Apellidos</th>
                    <th>Cédula</th>
                    <th>Fecha de Nacimiento</th>
                </tr>
                <tr>
                    <td><?php
                        echo $hv["nombre"];
                        echo " " . $hv["nombre_dos"];
                        echo " " . $hv["apellido_uno"];
                        echo " " . $hv["apellido_dos"]
                        ?></td>
                    <td>
                        <?php
                        if ($hv["cedula"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["cedula"];
                        }
                        ?>
                    </td>
                    <td>        
                        <?php
                        if ($hv["fecha_nacimiento"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["fecha_nacimiento"];
                        }
                        ?>
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
                        if ($hv["correo_corporativo"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["correo_corporativo"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($hv["numero_telefonico"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["numero_telefonico"];
                        }
                        ?>
                    </td>
                    <td>         <?php
                        if ($hv["numero_residencia"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["nombre_contacto_emergencia"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Datos de Ubicación</h2>
                    </td>
                </tr>
                <tr>
                    <th>Municipio</th>
                    <th>Zona</th>
                    <th>Departamento</th>
                </tr>
                <tr>
                    <td>
                        <?php
                        if ($hv["ciudad"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["nom_ciudad"];
                        }
                        ?>
                    </td>
                    <td>         
                        <?php
                        if ($hv["zona_asignada"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["nom_zona"];
                        }
                        ?>
                    </td>
                    <td>
                        <?php
                        if ($hv["departamento"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["nom_departamento"];
                        }
                        ?>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <strong>Dirección Residencia:</strong> 
                        <?php
                        if ($hv["direccion_residencia"] == null) {
                            echo $noen;
                        } else {
                            echo $hv["direccion_residencia"];
                        }
                        ?></td>
                </tr>
                <tr>
                    <td colspan="3">
                        <h2>Datos de Contratación</h2>
                    </td>
                </tr>
                <tr>
                    <td colspan="3">
                        <table width="100%">
                            <tr>
                                <th>Empresa Contratante</th>
                                <th>ID Huawei</th>
                                <th>Proyecto</th>
                                <th>Área</th>
                                <th>Jefe Inmediato</th>
                                <th>Tipo de Servicio</th>
                            </tr>
                            <tr>
                                <td>
                                    <?php
                                    if ($contract["emp_contratante"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_emp_contratante"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["id_huawei"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["id_huawei"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["proyecto"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_proyecto"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["area"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_area"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["jefe_inmediato"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_jefe_inmediato"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["tipo_servicio"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_tipo_servicio"];
                                    }
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <th>Cargo</th>
                                <th>Rol Operación</th>
                                <th>Riesgo</th>
                                <th>Riesgo Asociado</th>
                                <th>Fecha Ingreso</th>
                                <th>Fecha Retiro</th>
                            </tr>
                            <tr>
                                <td>
                                    <?php
                                    if ($contract["cargo"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_cargo"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["rol_operacion"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_rol_operacion"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["riesgo"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_riesgo"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["riesgo_asociado"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_riesgo_asociado"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["fecha_ingreso"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["fecha_ingreso"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["fecha_retiro"] == null) {
                                        echo "Actualmente laborando";
                                    } else {
                                        echo $contract["fecha_retiro"];
                                    }
                                    ?>
                                </td>
                            </tr>
                            <tr>
                                <th>Paz y Salvo</th>
                                <th>Novedades Disciplinarias</th>
                                <th>Novedades OSH</th>
                                <th colspan="3">Auxilios Extralegales</th>
                            </tr>
                            <tr>
                                <td>
                                    <?php
                                    if ($contract["paz_salvo"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_paz_salvo"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["nov_disciplinarias"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_nov_disciplinarias"];
                                    }
                                    ?>
                                </td>
                                <td>
                                    <?php
                                    if ($contract["nov_osh"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_nov_osh"];
                                    }
                                    ?>
                                </td>
                                <td colspan="3">
                                    <?php
                                    if ($contract["aux_extralegales"] == null) {
                                        echo $noen;
                                    } else {
                                        echo $contract["nom_aux_extralegales"];
                                    }
                                    ?>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <h2>Herramientas</h2>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <table width="100%">
                            <tr>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Marca</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                                <th>Adjunto</th>
                            </tr>
                            <?php
                            $where = "";

                            if (isset($r["id"])) {
                                $where .= " where id_empleado = " . $r["id"];
                            }
                            $sql = "select *, func_concepto(equipo, 'rh_herramientas') as nom_equipo, func_concepto(tipo, 'rh_herramientas_tipos') as nom_tipo,
                                func_concepto(marca, 'rh_herramientas_marcas') as nom_marca, 
                                func_concepto(estado, 'rh_estados_herramientas') as nom_estado 
                                FROM rh_herramientas_empleado " . $where;
                            $queryy = pg_exec($sql);
                            while ($rrr = pg_fetch_array($queryy)) {
                                //print_r($rrr);
                                ?>
                                <tr>
                                    <td>
                                        <?php echo $rrr["nom_equipo"]; ?>
                                    </td>
                                    <td>         
                                        <?php echo $rrr["nom_tipo"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrr["nom_marca"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrr["cantidad"]; ?>
                                    </td>
                                    <td>
                                        <?php echo $rrr["nom_estado"]; ?>
                                    </td>
                                    <td> 
                                        <?php
                                        $adjunto_image_pro = str_replace("/var/www/huawei/", "", $rrr["adjunto"]);
                                        $adjunto_image_pro_name = str_replace("imagenes", "", $adjunto_image_pro);
                                        if ($rrr["adjunto"] == null) {
                                            echo "No hay adjuntos disponibles";
                                        }
                                        else
                                            echo "$adjunto_image_pro_name <br />
                                                <img src='$adjunto_image_pro' width='100px' height='100px' /><br />
                                                  <a href='$adjunto_image_pro' target='_blank'>Descargar.</a>";
                                        ?>
                                    </td>
                                </tr>
                                <?php
                            }
                            ?>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
