<?php
include_once $_SERVER["DOCUMENT_ROOT"] . "/rpcsrv/_mod.inc.php";
$id = $_GET["id"];

function consultaTable($table, $campo, $p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $ca->prepareSelect($table, "*", "{$campo}=:id");
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

$r = consultaTable("rh_datos_basicos", "documento", "{$id}");
if ($r == 0) {
    echo "No hay registros";
    return;
}
$ub = consultaTable("rh_ubicacion", "id_empleado", "{$r["documento"]}");
if ($ub == 0) {
    echo "No hay registros";
    return;
}
//$db = NWDatabase::database();
//$ca = new NWDbQuery($db);
//$ca->prepareSelect("rh_datos_basicos", "*", "id=:id");
//$ca->bindValue(":id", $id);
//if (!$ca->exec()) {
//    echo "No se pudo realizar la consulta.";
//    return;
//}
//if ($ca->size() == 0) {
//    echo "No se han encontrado datos";
//    return;
//}
//$ca->next();
//$r = $ca->assoc();
//$ca->prepareSelect("rh_ubicacion", "*", "id_empleado=:id_empleado");
//$ca->bindValue(":id_empleado", $r["id_empleado"]);
//if (!$ca->exec()) {
//    echo "No se pudo realizar la consulta.";
//    return;
//}
//if ($ca->size() == 0) {
//    echo "No se han encontrado datos";
//    return;
//}
//$ca->next();
//$ub = $ca->assoc();

$where = "";
if (isset($r["id_empleado"])) {
    $where .= " where id_empleado = " . $r["id_empleado"];
}
$query = pg_exec("select * FROM rh_datos_profesionales " . $where);
$dp = pg_fetch_array($query);
//  echo "<br />detalle<br />";
// print_r($dp);
?>
<?php
$where = "";
if (isset($r["id_empleado"])) {
    $where .= " where id_empleado = " . $r["id_empleado"];
}
$query = pg_exec("select * FROM rh_datos_profesionales " . $where);
$dp = pg_fetch_array($query);
//echo "<br />detalle<br />";
// print_r($dp);
?>
<?php
$where = "";
if (isset($r["id_empleado"])) {
    $where .= " where id_empleado = " . $r["id_empleado"];
}
$query = pg_exec("select * FROM rh_datos_contratacion " . $where);
$dc = pg_fetch_array($query);
//echo "<br />detalle<br />";
// print_r($dc);
?>

<?php
$where = "";

if (isset($r["producto"])) {
    $where .= " where id = " . $r["producto"];
}
$query = pg_exec("select * FROM productos " . $where);
$prd = pg_fetch_array($query);
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
                color: #555;
            }
            #contenedor{
                position: relative;
                margin:auto;
                width:900px;
                height: 1000px;	
            }
            #contenedor table{
                border-collapse: collapse;
            }
            #contenedor td{
                border: 1px solid #ccc;	
                padding: 2px;
            }
            #contenedor th{
                text-align:left;
                border: 1px solid #ccc;
                padding: 3px;
            }
        </style>
    </head>
    <body>
        <div id="contenedor">
            <h1>Hoja de Vida N°</h1>
            <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td colspan="3">
                        <h2>Datos Básicos</h2>
                    </td>
                </tr>
                <tr>
                    <th>Nombres</th>
                    <th>Cédula</th>
                    <th>ID Huawei</th>
                </tr>
                <tr>
                    <td><?php echo $r["nombre"]; ?></td>
                    <td><?php echo $r["cedula"]; ?></td>
                    <td><?php echo $r["id_huawei"]; ?></td>
                </tr>
                <tr>
                    <th>Correo Corporativo</th>
                    <th>N° Teléfono:</th>
                    <th>N° Residencia</th>
                </tr>
                <tr>
                    <td><?php echo $r["correo_corporativo"] ?></td>
                    <td><?php echo $r["numero_telefonico"] ?></td>
                    <td><?php echo $r["numero_residencia"] ?></td>
                </tr>
                <tr>
                    <th>N° Contacto de Emergencias</th>
                    <th>Estado	</th>
                    <th>&nbsp;</th>
                </tr>
                <tr>
                    <td><?php echo $r["numero_contacto_emergencia"] ?></td>
                    <td><?php echo $r["estado"] ?></td>
                    <td></td>
                </tr>

                <tr>
                    <td colspan="3">
                        <h2>Datos de Proyecto Asignado</h2>
                    </td>
                </tr>
                <tr>
                    <th>Cliente Objetivo</th>
                    <th>Proyecto</th>
                    <th>Código de Proyecto</th>
                </tr>
                <tr>
                    <td>campo</td>
                    <td><?php echo $r["proyecto"] ?></td>
                    <td><?php echo $r["proyecto"] ?></td>
                </tr>

                <tr>
                    <td colspan="3">
                        <h2>Datos de Ubicación</h2>
                    </td>
                </tr>
                <tr>
                    <th>Municipio Contrato</th>
                    <th>Zona Asignada</th>
                    <th>Departamento</th>
                </tr>
                <tr>
                    <td><?php echo $ub["municipio_contrato"] ?></td>
                    <td><?php echo $ub["zona_asignada"] ?></td>
                    <td><?php echo $ub["departamento"] ?></td>
                </tr>
                <tr>
                    <th>Municipio</th>
                    <th>Dirección Residencia</th>
                    <th></th>
                </tr>
                <tr>
                    <td><?php echo $ub["ciudad"] ?></td>
                    <td><?php echo $ub["direccion_residencia"] ?></td>
                </tr>

                <tr>
                    <td colspan="3">
                        <h2>Datos Profesionales</h2>
                    </td>
                </tr>
                <tr>
                    <th>Nivel Educativo</th>
                    <th>Profesión</th>
                    <th>Conocimientos</th>
                </tr>
                <tr>
                    <td><?php echo $dp["nivel_educativo"] ?></td>
                    <td><?php echo $dp["profesion"] ?></td>
                    <td><?php echo $dp["conocimientos"] ?></td>
                </tr>
                <tr>
                    <th>Nivel de Conocimientos</th>
                    <th>Alturas Fecha de Certificación</th>
                    <th>Alturas Fecha de Vencimiento</th>
                </tr>
                <tr>
                    <td><?php echo $dp["nivel_conocimientos"] ?></td>
                    <td><?php echo $dp["altura_fecha_inicial"] ?></td>
                    <td><?php echo $dp["altura_fecha_final"] ?></td>
                </tr>
                <tr>
                    <th colspan="3">Otras</th>
                </tr>
                <tr>
                    <td colspan="3"><?php echo $dp["otras"] ?></td>
                </tr>

                <tr>
                    <td colspan="3">
                        <h2>Datos de Contratación</h2>
                    </td>
                </tr>
                <tr>
                    <th>N° Orden de Compra</th>
                    <th>Tipo de Servicio</th>
                    <th>Riesgo</th>
                </tr>
                <tr>
                    <td><?php echo $dc["no_compra"] ?></td>
                    <td><?php echo $dc["tipo_servicio"] ?></td>
                    <td><?php echo $dc["riesgo"] ?></td>
                </tr>
                <tr>
                    <th>Riesgo Asociado</th>
                    <th>Auxilios Extralegales</th>
                    <th>Cargo</th>
                </tr>
                <tr>
                    <td><?php echo $dc["riesgo_asociado"] ?></td>
                    <td><?php echo $dc["aux_extralegales"] ?></td>
                    <td><?php echo $dc["cargo"] ?></td>
                </tr>
                <tr>
                    <th>Rol Operación</th>
                    <th>Estado del Personal</th>
                    <th>Empresa Contratante</th>
                </tr>
                <tr>
                    <td><?php echo $dc["rol_operacion"] ?></td>
                    <td><?php echo $dc["estado_personal"] ?></td>
                    <td><?php echo $dc["emp_contratante"] ?></td>
                </tr>
                <tr>
                    <th>Fecha de Ingreso</th>
                    <th>Fecha de Retiro</th>
                    <th>Paz y Salvo</th>
                </tr>
                <tr>
                    <td><?php echo $dc["fecha_ingreso"] ?></td>
                    <td><?php echo $dc["fecha_retiro"] ?></td>
                    <td><?php echo $dc["paz_salvo"] ?></td>
                </tr>
                <tr>
                    <th>Novedades OSH</th>
                    <th colspan="2">Novedades Disciplinarias</th>
                </tr>
                <tr>
                    <td><?php echo $dc["nov_osh"] ?></td>
                    <td colspan="2"><?php echo $dc["nov_disciplinarias"] ?></td>
                </tr>
                <tr>
                    <th>EPS</th>
                    <th>AFP</th>
                    <th>RH</th>
                </tr>
                <tr>
                    <td><?php echo $dc["eps"] ?></td>
                    <td><?php echo $dc["afp"] ?></td>
                    <td><?php echo $dc["rh"] ?></td>
                </tr>

            </table>
        </div>
    </body>
</html>
