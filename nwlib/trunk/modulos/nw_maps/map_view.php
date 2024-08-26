<div class="list_maps">
    <h1  class="h1_full_text">
        <?php
        $v1 = isset($_POST['mapa_id_post']);
        $v2 = isset($_POST['map_id_enc']);
        if (isset($_GET['viewmaps']) != "") {
            $id_map_enc = $_GET['viewmaps'];
        } else
        if ($v2 != "") {
            $id_map_enc = $v2;
        }
        echo $v1;
        ?>
    </h1>
    <?php
    if (isset($_POST["buscar_mapas"]) != "") {
        echo "<a class='volver_pr_unit' href='" . $ruta_enlaces . "nw_maps.php' >Volver al inicio</a>";
    } else {
        
    }
    ?>
    <ul class="ul_contend_flours">
        <?php
        $db = NWDatabase::database();
        $caAlbum = new NWDbQuery($db);
        if (isset($_GET["viewmaps"]) != "") {
            $where = " where id_map_enc=:terminal_get";
        } else
        if ($v1 != "") {
            $where = " where id_map_enc=:id_map_encGET";
        } else {
            $where = " ";
        }
        $prTerminal = "";
        if (isset($pr["terminal"])) {
            $prTerminal = $pr["terminal"];
        }
        $sql = "select * from nc_maps_config" . $where . " order by id asc";
        $caAlbum->bindValue(":terminal_get", $id_map_enc);
        $caAlbum->bindValue(":id_map", $v1);
        $caAlbum->bindValue(":id_map_enc", $v2);
        $caAlbum->bindValue(":id_map_encGET", $_GET["viewmaps"]);
        $caAlbum->bindValue(":terminal", $prTerminal);
        $caAlbum->prepare($sql);
        if (!$caAlbum->exec()) {
            echo "No se pudo realizar la consulta de la búsqueda. ";
            return;
        }
        if ($caAlbum->size() == 0) {
            echo "<h3 class='no_found_contend'>No hay álbumes que mostrar</h3>.";
            return;
        }
        for ($i = 0; $i < $caAlbum->size(); $i++) {
            $caAlbum->next();
            $array = $caAlbum->assoc();
            $ruteIMG = "";
            if ($array["imagen"] == "") {
                $ruteIMG = "$ruta_enlaces . nwcommerce/images/espacio_imagen_producto300x300.jpg";
            } else {
                $ruteIMG = $ruta_phpthumb . $url_enl_pr_los . $array["imagen"] . $img_thumb_medium;
            }
            ?>
            <style type="text/css">
                .select_<?php echo isset($_GET["map"]) ?>{
                    background: firebrick;
                }
                .select_<?php echo isset($_POST["mapa_id_post"]) ?>{
                    background: firebrick!important;
                }
            </style>
            <li class="list_mapas_men select_<?php echo $array["id"] ?>">
                <a href="<?php echo $url_gen . "?viewmaps=$id_map_enc&map=" . $array["id"]; ?>">
                    <div class="text_flour">
                        <p>
                            <?php echo $array["nombre"]; ?>
                        </p>
                    </div>
                    <div class="img_flour" style="background-image: url(<?php echo $ruteIMG; ?>)"></div>
                </a>
            </li>
            <?php
        }
        ?>
    </ul>
</div>

<div class="contend_maps">
    <div class="controls_zoom">
        <div class="acercar">+</div><div class="alejar">-</div>
    </div>
    <div class="show_map" id="show_map">
        <?php
        $map_id = "";
        if (isset($_GET["map"])) {
            $map_id = $_GET["map"];
        }
        if (isset($_POST["map"])) {
            $map_id = $_POST["map"];
        }
        $map_id_enc = "";
        if (isset($_GET["viewmaps"])) {
            $map_id_enc = $_GET["viewmaps"];
        }
        if (isset($_POST["viewmaps"])) {
            $map_id_enc = $_POST["viewmaps"];
        }
        $db = NWDatabase::database();
        $cb = new NWDbQuery($db);
        // $where = "";
        if (isset($_GET["map"]) != "") {
            $where = "where id=:id";
        } else
        if ($v1 != "") {
            $where = "where id=:id_post";
        } else
        if ($_GET["viewmaps"] != "") {
            $where = " where id_map_enc=:terminal";
        } else {
            $where = " ";
        }
        $sql_map = "select * from nc_maps_config " . $where . " order by id asc limit 1";
        $cb->bindValue(":id_post", isset($_POST['mapa_id_post']));
        $cb->bindValue(":terminal", $id_map_enc);
        $cb->bindValue(":id", $map_id);

        $cb->prepare($sql_map);
        if (!$cb->exec()) {
            echo "No se pudo realizar la consulta de las votaciones. ";
            return;
        }
        if ($cb->size() == 0) {
            echo "No se han encontrado datos";
            return;
        }
        $cb->next();
        $ra = $cb->assoc();
        $url_map_ime = $url_enl_pr_los . $ra["imagen"];

        //MAPA
        echo "<div id='map_scale' class='map_scale'>";
        echo "<div id='map' class='map'>";
        echo "<img id='img_load' class='img_load' src ='$url_map_ime' />";
//        if (isset($_POST["buscar_mapas"]) != "" || isset($_GET["buscar_mapas"]) != "") {
////            include "ubics_results.php";
//               include "ubics.php";
//        } else {
//            include "ubics.php";
//        }
        include "ubics.php";
        echo "</div>";
        echo "</div>";

        //UBICS
//        echo "<div id='mapedUbics' class='mapedUbics'>";
//        echo "<div id='maped' class='maped'>";
//        if ($_POST["buscar_mapas"] != "") {
//            include "ubics_results.php";
//        } else {
//            include "ubics.php";
//        }
//        echo "</div>";
        echo "</div>";
        ?>
    </div>
    <?php
    include "mapas_lista.php";
    ?>
</div>
<script>
//    createWidthImg("<?php echo $url_map_ime; ?>");
</script>