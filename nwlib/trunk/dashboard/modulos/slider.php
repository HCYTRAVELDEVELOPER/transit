<div id="1000294" class="special special_1000294 selector_edit contenidoM nw_object_blue">
    <div class="imageBox_s imageBox_s_1000294">
        <div style="position: relative;" class="textDiv">
            <div class="text" id="div_text1000294">
                <img class="imgSlide" alt="" src="/nwlib<?php echo master::getNwlibVersion() ?>/dashboard/modulos/slider/nwadmin_home_banner1.png" >
                <h3 class="nw_user_dash">
                    Bienvenid@ <?php echo $_SESSION["nombre"]; ?>!
                </h3>
                <?php
                if ($_SERVER["HTTP_HOST"] == "nwposzonafria.gruponw.com" || $_SERVER["HTTP_HOST"] == "sistemapos.zonafria.co") {
                    if (isset($_SESSION["nom_bodega"])) {
                        echo "<span style='color: red;font-size: 20px;'>Bodega: " . utf8_encode($_SESSION["nom_bodega"]) . "</span>";
                    }
                }
                ?>
                <div class="divReadUserEnc">
                    <?php
//                    readUserDash();
                    ?>
                </div>
            </div>
        </div>
    </div>
    <div class="bgSlid"></div>
</div>