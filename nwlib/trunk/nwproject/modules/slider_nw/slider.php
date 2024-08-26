<?php
include_once($_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php");
//print nwMaker::getNwMakerLibOut();

$db = NWDatabase::database();
$pa_slnw = "5";
$table = "galeria_noticias";
$tipo = "";
$where = " 1=1 ";
//$where = "pagina=:pagina ";
$where .= " order by id asc ";
$cc_bannerConfig = new NWDbQuery($db);
$cc_bannerConfig->prepareSelect("galeria_noticias_config", "*", $where);
$cc_bannerConfig->bindValue(":pagina", $pa_slnw);
$cc_bannerConfig->bindValue(":tipo", $tipo);
if (!$cc_bannerConfig->exec()) {
//    echo "Error al consultar la configuración del banner";
//    return;
}
$speedBanner = "8000";
$banner_autoslide = "si";
$banner_showbar = "si";
$banner_height = "300px";
$banner_width = "100%";
$banner_easing = "easing";
$banner_type = " ";
$overlay = "";
$controlStop = "";
$mostrar_flechas = "";
$tipo_thumbs_textos = "";
$thumbnails = "";
$acceptHtml = "";
$imagen_mode = "";
$position_description = "";
$paginacion = "";
//$banner_type_sql = " pagina=:pagina and publicado<>'NO' and tipo IS NULL or pagina=:pagina and publicado='SI' and tipo=0  order by orden,id asc";
//$banner_type_sql = " publicado<>'NO' and tipo IS NULL or publicado='SI' and tipo=0  order by orden,id asc";
$banner_type_sql = " tipo IS NULL or tipo=0 order by orden,id asc";
$typy = "0";
if ($tipo != "") {
    $typy = $tipo;
}
//$banner_type_sql_post = " tipo=0 or NULL";
//if ($cc_bannerConfig->size() > 0) {
//    $cc_bannerConfig->next();
//    $config_bannernw = $cc_bannerConfig->assoc();
//
////    $banner_type_sql = "pagina=:pagina and tipo=:typy and publicado='SI' order by orden,id asc";
//    $banner_type_sql = " tipo=:typy and publicado='SI' order by orden,id asc";
//
//    $typy = $config_bannernw["tipo"];
//    $banner_type_sql_post = " tipo=$typy";
//
//    $thumbnails = $config_bannernw["thumbnails"];
//    $speedBanner = $config_bannernw["speed"];
//    $banner_autoslide = $config_bannernw["autoslide"];
//    $banner_showbar = $config_bannernw["showbar"];
//    $banner_height = $config_bannernw["height"];
//    $banner_width = $config_bannernw["width"];
//    $tipo_thumbs_textos = $config_bannernw["tipo_thumbs_textos"];
//    $overlay = $config_bannernw["overlay"];
//    $controlStop = $config_bannernw["show_play_stop"];
//    $mostrar_flechas = $config_bannernw["mostrar_flechas"];
//    $banner_easing = $config_bannernw["$banner_easing"];
//    $acceptHtml = $config_bannernw["html"];
//    $imagen_mode = $config_bannernw["imagen_mode"];
//    $position_description = $config_bannernw["position_description"];
//    $paginacion = $config_bannernw["pagination"];
//
//    if (isset($config_bannernw["$banner_easing"]) && $config_bannernw["$banner_easing"] != "") {
//        $banner_type = $config_bannernw["$banner_easing"];
//    }
//}
if ($banner_type != "0") {
    $banner_type = " tipo=$banner_type";
} else {
    $banner_type = " tipo=0 or NULL";
}

$widthContain = " width: 100%; ";
if ($banner_width != null || $banner_width != "") {
    $widthContain = "width: {$banner_width};";
}
?>
<div class="contenedor_slidernw contenedor_slidernw<?php echo $typy; ?>" style='<?php echo $widthContain; ?>' data-css="">
    <?php
    $htmlOverlay = "";
    if ($overlay == "si") {
        $htmlOverlay = '<div class="overlay_bg_nw"></div>';
    }
    $ca_banner = new NWDbQuery($db);
    $ca_banner->prepareSelect($table, "*", " $banner_type_sql ");
    $ca_banner->bindValue(":pagina", $pa_slnw);
    $ca_banner->bindValue(":typy", $typy);
    if (!$ca_banner->exec()) {
        echo "No se pudo realizar la consulta " . $ca_banner->lastErrorText();
        return;
    }
    $totalBanners = $ca_banner->size();
    if ($totalBanners == 0) {
        echo "</div>";
        return;
    }
    $target = "_self";
    if (isset($_GET["target"])) {
        $target = $_GET["target"];
    }
    ?>
    <div class="contenedor_slidernw_interno contenedor_slidernw_interno<?php echo $typy; ?>">
        <?php
        for ($i = 0; $i < $totalBanners; $i++) {
            $number = $i + 1;
            $ca_banner->next();
            $r_bannernw = $ca_banner->assoc();
            $urlOpen = "";
            $urlClose = "";
            $imgBanner = "";
//            $imgBannerExplode = explode(".com", $r_bannernw["imagen"]);
            $imgBannerExplode = explode(".com", $r_bannernw["video_url"]);
            $imgBannerExplodeMp4 = explode(".", $r_bannernw["video_url"]);
//            $imgBannerExplodeMp4 = explode(".", $r_bannernw["imagen"]);
//            $imgBannerExplodeFrame = explode("iframe", $r_bannernw["imagen"]);
            $imgBannerExplodeFrame = explode("iframe", $r_bannernw["video_url"]);
            $video = "";
            $esVideo = "";
            if (isset($imgBannerExplodeMp4[1])) {
                $esVideo = $imgBannerExplodeMp4[1];
            }
            $esIframe = $imgBannerExplodeFrame[0];
            $imgPartBann = $imgBannerExplode[0];
            $clickdiv = "";
            $classdivpointer = "";
            $onclick = "";
            if ($r_bannernw["otro_dos"] != NULL && $r_bannernw["otro_dos"] != "#" && $r_bannernw["otro_dos"] != "") {
                $clickdiv = "window.open('{$r_bannernw["otro_dos"]}', '{$target}');";
                $classdivpointer = " classdivpointer";
                $onclick = " onclick=\"{$clickdiv}\" ";
            }
            ?>
            <div class="boxSliderNw boxSliderNw<?php echo $typy; ?> slidernw_<?php echo $number; ?>">
                <?php
                echo $htmlOverlay;
                ?>
                <div class="img_slider_nw img_slider_nw<?php echo $number; ?>">
                    <?php
                    if ($esIframe == "<") {
                        $video = $r_bannernw["video_url"];
                    } else
                    if ($esVideo == "mp4") {
                        $video = "<style>.contenedor_slidernw{height: auto!important;}</style>
                            <video id='nwvideo' class='main-background nwvideo' loop='true' autoplay='true' muted poster='{$r_bannernw["imagen"]}'  >
                           <source src='" . $r_bannernw["video_url"] . "' type='video/mp4' > 
                               Your browser does not support HTML5 video.
                           </video>
                           ";
                    } else
                    if ($imgPartBann == "http://www.youtube" || $imgPartBann == "https://www.youtube") {
                        $youtube_id = getYouTubeIdFromURL($r_bannernw["video_url"]);
                        ?>
                        <style>
                            .contend_into_text_slider_nw<?php echo $r_bannernw["id"]; ?> {
                                display: none;
                            }
                        </style>
                        <?php
                        $video = '<iframe style="min-height: 400px;" width="100%" height="100%" src="//www.youtube.com/embed/' . $youtube_id . '" frameborder="0" allowfullscreen></iframe>';
                    }
//                    $imgShow = imgThumb($r_bannernw["imagen"], 1100);
                    $imgShow = $r_bannernw["imagen"];
                    if ($r_bannernw["otro_dos"] != "") {
                        $urlOpen = "<a href='" . $r_bannernw["otro_dos"] . "' title='{$r_bannernw["otro_dos"]}'>";
                        $urlClose = "</a>";
                    }
                    if ($r_bannernw["video"] == "SI") {
                        $imgBanner = $video;
                    } else {
                        $imgBg = "style='background-image: url({$imgShow});'";
                        $imgBgContain = "";
                        if ($imagen_mode == "contain") {
                            $imgBg = "";
                            $imgBgContain = "<img src='" . $imgShow . "' title='Imagen' alt='imagen nw {$number}' />";
                        }
                        $imgBanner = "";
                        $imgBanner .= "<div name='" . $r_bannernw["imagen"] . "' class='imgBgSnw imgBgSnw_$number' {$imgBg} >";
                        $imgBanner .= $imgBgContain;
                        $imgBanner .= "</div>";
                    }
                    echo $urlOpen;
                    echo $imgBanner;
                    echo $urlClose;

                    $position_text = "";
                    if ($position_description == "fuera_imagen") {
                        $position_text = " style='position: relative;' ";
                    }
                    ?>
                </div>

                <div class="contend_text_slider_nw<?php echo $classdivpointer; ?>"<?php echo $onclick . " " . $position_text; ?> >
                    <div class="contend_into_text_slider_nw contend_into_text_slider_nw<?php echo $r_bannernw["id"]; ?>">
                        <div class="text_slider_nw text_slider_nw<?php echo $r_bannernw["id"]; ?> text_slider_nw_n<?php echo $number; ?>">
                            <?php
                            if ($r_bannernw["otro"] != "" | $r_bannernw["otro"] != null) {
                                ?>
                                <h2 class="titleSnw titleSnw_<?php echo $number; ?>">
                                    <?php echo $r_bannernw["otro"]; ?>
                                </h2>
                                <?php
                            }

                            if ($r_bannernw["otro_dos"] != "") {
                                echo "<a href='" . $r_bannernw["otro_dos"] . "' title='{$r_bannernw["otro_dos"]}' class='btn_ver_mas btn_ver_mas_slider_nw btn_ver_mas_{$tipo}'>Ver más</a>";
                            }
                            ?>

                            <div  class="textSnw textSnw_<?php echo $number; ?>">
                                <?php
                                if ($acceptHtml == "si") {
                                    echo $r_bannernw["contenido"];
                                } else {
                                    echo strip_tags($r_bannernw["contenido"]);
                                }
                                ?>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <?php
        }
        ?>
    </div>
    <div class="clear"></div>
    <div class="barProgress barProgress<?php echo $typy; ?>"><div class="barInt barInt<?php echo $typy; ?>"></div></div>
    <?php
    if ($mostrar_flechas != "no") {
        ?>
        <div class="controlsDirections controlLeft controlLeft<?php echo $typy; ?>"></div>
        <div class="controlsDirections controlRight controlRight<?php echo $typy; ?>"></div>
        <?php
    }
    if ($controlStop != "no") {
        ?>
        <div class="controlsDirections controlStop"></div>
        <div class="controlsDirections controlPlay"></div>
        <?php
    }
    ?>
    <div class="controlsSliderNw controlsSliderNw<?php echo $typy; ?>" >
        <div class="controlsSliderNwPagination controlsSliderNwPagination<?php echo $typy; ?>" ></div>
        <div class="controlsSliderNwThumbs controlsSliderNwThumbs<?php echo $typy; ?>" ></div>
    </div>
    <div class="loaderSl" ></div>
</div>

<script>

    $(document).ready(function () {

        loadJs("/nwlib6/nwproject/modules/slider_nw/js/main.js");

        function init() {
            var d = {};
            d["banner_speed"] = <?php echo $speedBanner; ?>;
            d["banner_autoslide"] = "<?php echo $banner_autoslide; ?>";
            d["banner_bar"] = "<?php echo $banner_showbar; ?>";
            d["banner_height"] = "<?php echo $banner_height; ?>";
            d["banner_width"] = "<?php echo $banner_width; ?>";
            d["banner_easing"] = "<?php echo $banner_easing; ?>";
            d["thumbnails"] = "<?php echo $thumbnails; ?>";
            d["tipo_thumbs_textos"] = "<?php echo $tipo_thumbs_textos; ?>";
            d["imagen_mode"] = "<?php echo $imagen_mode; ?>";
            d["tipo"] = "<?php echo $typy; ?>";
            d["paginacion"] = "<?php echo $paginacion; ?>";
            all_slider(d);
        }
        init();
    });
</script>