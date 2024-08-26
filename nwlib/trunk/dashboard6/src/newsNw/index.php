<?php
require_once $_SERVER["DOCUMENT_ROOT"] . '/rpcsrv/_mod.inc.php';
$con = Array();
$con["urlPath"] = "http://www.gruponw.com/web_service/boletin.php?wsdl";
$con["header"] = $GLOBALS['header'];
$con["method"] = $GLOBALS['method'];
$con["function"] = "getNotices";
$central = new connectCentral();
$limit = 10;
$offset = !isset($_GET["offset"]) ? 0 : ($_GET["offset"] == "" ? 0 : ($_GET["offset"] + 10));
$offset = master::clean($offset);
$p = Array('parametro' => $offset . "," . $limit);
$rta = $central->connect($p, $con);
$rta = json_decode($rta);
?>
<ul id="slider1">
    <?php
    $totalRecords = count($rta);
    for ($i = 0; $i < $totalRecords; $i++) {
        $v = $rta[$i];
        ?>
        <li>
            <?php
            echo $v->titulo;
            echo "<br />";
            echo "<span style='font-size: 9px;color: #B6B6B6;margin: 0;'>Fecha: " . substr($v->fecha, 0, 10) . "</span>";
            ?>    
            <br />
            <span>
                <?php
                echo $v->texto;
                ?>
            </span>
        </li>
        <?php
    }
    ?>
</ul>
<a onclick="loadNewsNw(null, '<?php echo $offset; ?>');" href="#">Ver más</a>
