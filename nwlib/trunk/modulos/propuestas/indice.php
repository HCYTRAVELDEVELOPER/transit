<?php
require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
$uno = "";
$dos = "";
$fix = "";
$id_propuesta = $_POST["id"];
if ($_POST["tipo"] == "fixed") {
    $uno = " fixx";
    $fix = " fixxed";
    $dos = "class='olSubDos'";
}
?>

<div class="bloques_text_center bloque_indice<?php echo $fix; ?>">
    <h1 onclick="scroll('#loadIndice');">
        Índice Principal
    </h1>
    <div class="bloques_textos<?php echo $uno; ?>">
        <ol >
            <li onclick="scroll('body');">
                Portada Principal
            </li>
            <li class='olSubOne'>
                Características
                <ol <?php echo $dos; ?>>
                    <li onclick="scroll('#descripcion_general');">
                        Descripción General
                    </li>
                    <li onclick="scroll('#bases_datos');">
                        Arquitectura, bases de datos, seguridad y otros
                    </li>
                    <li onclick="scroll('#tecnicos');">
                        Aspectos técnicos, soporte, requisitos de la aplicación y etapas de desarrollo
                    </li>
                    <li onclick="scroll('#escencials');">
                        Características Esenciales
                    </li>
                </ol>
            </li>
            <?php
            global $id_propuesta;
            $dbdb = NWDatabase::database();
            $cb = new NWDbQuery($dbdb);
            $wheree = " where id_propuesta=:id_propuesta";
            $sqla = "select * FROM propuestas_hojas " . $wheree . " order by orden asc";
            $cb->prepare($sqla);
            $cb->bindValue(":id_propuesta", $id_propuesta);
            if (!$cb->exec()) {
                echo "No se pudo realizar la consulta. ";
                return;
            }
            if ($cb->size() == 0) {
                echo "";
            } else {
                echo "<li onclick='scroll(\"#modulos\");'>
                Módulos
            </li>";
            }
            ?>
            <li onclick="scroll('#requerimientos');">
                Requerimientos
            </li>
            <li onclick="scroll('#capacitacion');">
                Capacitación
            </li>
            <li onclick="scroll('#garantias');">
                Garantías
            </li>
            <li onclick="scroll('#clientes');">
                Portafolio de Clientes
            </li>
            <li onclick="scroll('#precio');">
                Precio
            </li>
            <li onclick="scroll('#contacto');">
                Contacto
            </li>
        </ol>
    </div>
</div>