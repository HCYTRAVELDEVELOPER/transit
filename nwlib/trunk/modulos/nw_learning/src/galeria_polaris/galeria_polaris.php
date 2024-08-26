

<link rel="stylesheet" type="text/css" href="<?php echo $ruta_enlaces; ?>nw_learning/src/galeria_polaris/css/component.css" />
<script src="<?php echo $ruta_enlaces; ?>nw_learning/src/galeria_polaris/js/modernizr.min.js"></script>
<div class="container_gal_polaris">
    <!-- Top Navigation -->
    <section id="photostack-1" class="photostack photostack-start">
        <div>
            <?php
            $db = NWDatabase::database();
            $ca = new NWDbQuery($db);


            if ($_GET["MainUrl"] != "") {
                $sql = "select * from man_enc where publico='SI' and terminal=:terminal order by id desc limit 5";
                $ca->bindValue(":terminal", $arrayU["id"]);
            } else {
                $sql = "select * from man_enc where publico='SI' order by id desc limit 5";
            }
            $ca->prepare($sql);
            if (!$ca->exec()) {
                echo "No se pudo realizar la consulta de la búsqueda. ";
                return;
            }
            if ($ca->size() == 0) {
                echo "<h3 class='no_found_contend'>No hay manuales que mostrar</h3>.";
                //return;
            }
            for ($i = 0; $i < $ca->size(); $i++) {
                $ca->next();
                $array = $ca->assoc();
                $manual_id_encrypt = base64_encode($array["id"]);

                $e = new encript;
                $tem = $e->encode($array["id"], $cl_v);
                $code_script = encript::$string; // para volver a optener el valor

                encript::decode($tem, $cl_v);
                $decode_script = encript::$string;
                $max_name = 30;
                $max_descp = 100;

                if (strlen($array["nombre"]) >= $max_name) {
                    $text_name = substr($array["nombre"], 0, $max_name) . "...";
                } else {
                    $text_name = substr($array["nombre"], 0, $max_name);
                }

                if (strlen($array["descripcion"]) >= $max_descp) {
                    $text_descrip = substr($array["descripcion"], 0, $max_descp) . "...";
                } else {
                    $text_descrip = substr($array["descripcion"], 0, $max_descp);
                }

                if ($array["imagen"] == "") {
                    $imagen = "/nwproject/php/modulos/nwcommerce/images/espacio_imagen_producto300x300.jpg";
                } else {

                    $imagen = $ruta_phpthumb . $url_image_pr_locs . $array["imagen"] . "&h=260";
                }
                ?>   
                <figure>
                    <div id="bookshelf" class="bookshelf">
                        <div class="figura_man figura_man_gal">
                            <div class="book booked_gal<?php echo $code_script ?> booked_galery" style="background-image: url(<?php echo $imagen ?>);" onclick="javascript:open_details_gal('<?php echo $code_script ?>')"></div>
                            <div class="detalles_manu detalles<?php echo $code_script ?> detalles_manu_galery">
                                <div class="cerrar_equis equis<?php echo $code_script ?>">
                                    <a href="javascript:close_details_gal('<?php echo $code_script ?>')">
                                        x
                                    </a>
                                </div>
                                <h3>
                                    <a href="<?php echo $url_gen . "?m=" . $code_script; ?>" > 
                                        <?php echo $text_name; ?>
                                    </a>
                                </h3>
                                <p>
                                    <?php echo $text_descrip; ?>
                                </p>
                                <a class="button_red_dos button_bottom" href="<?php echo $url_gen . "?m=" . $code_script; ?>">
                                    Ingresar
                                </a>
                            </div>
                            <div class="links_manual links_manual_galery">
                                <a href="<?php echo $url_gen . "?m=" . $code_script; ?>" >Ingresar </a>
                                <a class="details_button_m mmm_<?php echo $code_script ?>" href="javascript:open_details_gal('<?php echo $code_script ?>')" >Detalles</a>
                            </div>
                            <div class="text_flour">
                                <h1>
                                    <a href="<?php echo $url_gen . "?m=" . $code_script; ?>" > 
                                        <?php echo $text_name; ?>
                                    </a>
                                </h1>
                                <p>
                                    <?php
                                    $dbb = NWDatabase::database();
                                    $ca_u = new NWDbQuery($dbb);
                                    $where = "";
                                    if ($array["terminal"] != "") {
                                        $where .= " where id=:terminal";
                                    }
                                    $sqlu = "select * from terminales $where";
                                    $ca_u->bindValue(":terminal", $array["terminal"]);
                                    $ca_u->prepare($sqlu);
                                    if (!$ca_u->exec()) {
                                        echo "No se pudo realizar la consulta de la búsqueda. ";
                                        // return;
                                    }
                                    if ($ca_u->size() == 0) {
                                        
                                    } else {
                                        $ca_u->next();
                                        $arrayUs = $ca_u->assoc();
                                        echo "<a href='http://" . $_SERVER['HTTP_HOST'] . "/" . $arrayUs["url"] . "' >" . substr($arrayUs["nombre"], 0, 100) . "</a>";
                                    }
                                    ?>
                                </p>
                            </div>
                        </div>
                    </div>
                </figure>
                <?php
            }
            ?>
        </div>
    </section>

</div><!-- /container -->
<script src="<?php echo $ruta_enlaces; ?>nw_learning/src/galeria_polaris/js/classie.js"></script>
<script src="<?php echo $ruta_enlaces; ?>nw_learning/src/galeria_polaris/js/photostack.js"></script>
<script>
                            new Photostack(document.getElementById('photostack-1'), {
                                callback: function(item) {
                                }
                            });
</script>
