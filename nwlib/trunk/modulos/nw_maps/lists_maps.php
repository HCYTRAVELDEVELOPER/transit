<div class="list_maps">
    <ul class="ul_contend_flours">
        <?php
        $prTerminal = "";
        if(isset($pr["terminal"])) {
            $prTerminal = $pr["terminal"];
        }
        $db = NWDatabase::database();
        $ca = new NWDbQuery($db);
        $sql = "select * from nc_maps_enc order by id asc";
        $ca->bindValue(":terminal", $prTerminal);
        $ca->prepare($sql);
        if (!$ca->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda. ";
            return;
        }
        if ($ca->size() == 0) {
            echo "<h3 class='no_found_contend'>No hay mapas que mostrar</h3>.";
            //return;
        }
        for ($i = 0; $i < $ca->size(); $i++) {
            $ca->next();
            $array = $ca->assoc();
            ?>
            <li class="list_mapas_men select_<?php echo $array["id"] ?>">
                <a href="<?php echo $url_gen . "?viewmaps=" . $array["id"]; ?>">
                    <div class="text_flour">
                        <p>
                            <?php echo $array["nombre"]; ?>
                        </p>
                    </div>
                    <div class="img_flour">
                        <?php
                        if ($array["imagen"] == "") {
                            echo "<img style='height: 100%;width: 200px;' src='/nwproject/php/modulos/nwcommerce/images/espacio_imagen_producto300x300.jpg' />";
                        } else {
                            echo "<img src='" . $ruta_phpthumb . $url_enl_pr_los . $array["imagen"] . "$img_thumb_medium' />";
                        }
                        ?>
                    </div>
                </a>
            </li>
            <?php
        }
        ?>
    </ul>
</div>