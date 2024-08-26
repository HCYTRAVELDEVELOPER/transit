<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

function changes($p) {
    $db = NWDatabase::database();
    $ca = new NWDbQuery($db);
    $wheree = " where a.id_propuesta=:id_propuesta";
    $sql = "select * from (select a.*, b.nombre as usuario_text, b.cargo as cargo_usuario FROM propuestas_cambios  a left join usuarios b on (a.usuario=b.usuario) {$wheree} order by a.fecha desc limit 10) a order by a.fecha asc";
    $ca->prepare($sql);
    $ca->bindValue(":id_propuesta", $p);
    if (!$ca->exec()) {
        echo "No se pudo realizar la consulta. ";
        return;
    }
    $tot = $ca->size();
    for ($i = 0; $i < $tot; $i++) {
        $ca->next();
        $r = $ca->assoc();
        ?>
        <tr>
            <td style="text-align: center">
                <?php echo $r["fecha"] ?>
            </td>
            <td>
                <b><?php echo $r["usuario_text"] ?></b>  (<?php echo $r["usuario"] ?>)
            </td>
            <td>
                <?php echo $r["cargo_usuario"] ?>
            </td>
            <td>
                <?php echo $r["accion"] ?>
            </td>
        </tr>
        <?php
    }
}
?>
<table class="tablleChanges">
    <tr>  
        <th colspan="4">
            CONTROL  DE CAMBIOS
        </th>
    <tr>
    <tr>
        <th>
            Fecha Cambio
        </th>
        <th>
            Autor 
        </th>
        <th>
            Cargo
        </th>
        <th>
            Referencia de Cambio 
        </th>
    </tr>
    <tr>
        <td style="text-align: center"><?php echo $r["fecha"] ?></td>
        <td style="text-align: center"><?php echo $r["usuario"] ?></td>
        <td style="text-align: center"></td>
        <td style="text-align: center">Creación</td>
    </tr>
    <?php
    changes($id_propuesta);
    ?>
</table>
