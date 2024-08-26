<?php
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
<div id="contend_prods_home_dos">
    <h2 class="title_nov_h2">¿Qué hay de nuevo?</h2>
    <div class="bx-wrapper" >
        <div class="bx-window">
            <ul id="slider1">
                <?php
                $totalRecords = count($rta);
                for ($i = 0; $i < $totalRecords; $i++) {
                    $v = $rta[$i];
                    ?>
                    <li>
                        <div class="producto_fila_dos">
                            <div class="span_name2">
                                <h4>
                                    <?php
                                    echo $v->titulo;
                                    echo "<p style='font-size: 9px;color: #B6B6B6;margin: 0;'>Fecha: " . substr($v->fecha, 0, 10) . "</p>";
                                    ?>                    
                                </h4>
                                <p>
                                    <?php
                                    echo $v->texto;
                                    ?>
                                </p>
                            </div>
                        </div>
                    </li>
                    <?php
                }
                ?>
            </ul>
        </div>
    </div>
    <!--<a href="noticias-  118" class="todos_prod_art_dos">Ver Todas las noticias</a>-->
    <a onclick="loadNewsNw(null, '<?php echo $offset; ?>');" href="#">Ver más</a>
</div>       
