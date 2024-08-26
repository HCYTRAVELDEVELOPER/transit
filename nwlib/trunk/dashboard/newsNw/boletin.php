<?php
error_reporting(-1);

include dirname(__FILE__) . "/../nwlib.inc.php";

$con = Array();
$con["urlPath"] = "http://www.gruponw.com/web_service/boletin.php?wsdl";
$con["header"] = $GLOBALS['header'];
$con["method"] = $GLOBALS['method'];
$con["function"] = "getNotices";

$central = new connectCentral();
$p = Array('parametro' => "0");
$rta = $central->connect($p, $con);
$rta = json_decode($rta);
?>
<div id="contend_prods_home_dos">
    <h2 class="title_nov_h2">¿Qué hay de nuevo?</h2>
    <div class="bx-wrapper" >
        <div class="bx-window">
            <ul id="slider1">
                <?php
                for ($i = 0; $i < count($rta); $i++) {
                    $v = $rta[$i];
                    ?>
                    <li>
                        <div class="producto_fila_dos">
                            <div class="span_name2">
                                <h4>
                                    <a  href="#" title=" Versión QXNW 3.0 Liberada!">
                                        Versión QXNW 5.1.4 Liberada!                            
                                    </a>
                                </h4>
                                <p>
                                    <?php
                                    echo $v->texto;
                                    ?>
                                </p>
                            </div>
                            <div class="image_pr_dos image_pr_dosodc" style="background-image: url(/nwproject/includes/phpthumb/phpThumb.php?src=/imagenes//fondo_nwadmin_3.jpg&amp;w=120);" onclick="javascript:location.href = '#';">
                                <div class="tooltip animate">
                                    <h4>   
                                        Versión QXNW 3.0 Liberada!
                                    </h4>
                                    <h3>
                                        <p>
                                            <?php
                                            echo $v->texto;
                                            ?>
                                        </p>
                                    </h3>
                                    <a href="#">
                                        Ver más
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                    <?php
                }
                ?>
            </ul>
        </div>
    </div>
    <a href="noticias-  118" class="todos_prod_art_dos">Ver Todas las noticias</a>
</div>       
