<?php

require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";

class textPNG {

    var $font = 'fonts/arial.ttf'; //default font. directory relative to script directory.
    var $msg = ""; // default text to display.
    var $size = 24; // default font size.
    var $rot = 0; // rotation in degrees.
    var $pad = 0; // padding.
    var $transparent = 1; // transparency set to on.
    var $red = 0; // black text...
    var $grn = 0;
    var $blu = 0;
    var $bg_red = 255; // on white background.
    var $bg_grn = 255;
    var $bg_blu = 255;

    function draw() {
        $width = 0;
        $height = 0;
        $offset_x = 0;
        $offset_y = 0;
        $bounds = array();
        $image = "";

// get the font height.
        $bounds = ImageTTFBBox($this->size, $this->rot, $this->font, "W");
        if ($this->rot < 0) {
            $font_height = abs($bounds[7] - $bounds[1]);
        } else if ($this->rot > 0) {
            $font_height = abs($bounds[1] - $bounds[7]);
        } else {
            $font_height = abs($bounds[7] - $bounds[1]);
        }
// determine bounding box.
        $bounds = ImageTTFBBox($this->size, $this->rot, $this->font, $this->msg);
        if ($this->rot < 0) {
            $width = abs($bounds[4] - $bounds[0]);
            $height = abs($bounds[3] - $bounds[7]);
            $offset_y = $font_height;
            $offset_x = 0;
        } else if ($this->rot > 0) {
            $width = abs($bounds[2] - $bounds[6]);
            $height = abs($bounds[1] - $bounds[5]);
            $offset_y = abs($bounds[7] - $bounds[5]) + $font_height;
            $offset_x = abs($bounds[0] - $bounds[6]);
        } else {
            $width = abs($bounds[4] - $bounds[6]);
            $height = abs($bounds[7] - $bounds[1]);
            $offset_y = $font_height;
            ;
            $offset_x = 0;
        }

        $image = imagecreate($width + ($this->pad * 2) + 1, $height + ($this->pad * 2) + 1);
        $background = ImageColorAllocate($image, $this->bg_red, $this->bg_grn, $this->bg_blu);
        $foreground = ImageColorAllocate($image, $this->red, $this->grn, $this->blu);

        if ($this->transparent)
            ImageColorTransparent($image, $background);
        ImageInterlace($image, false);

// render the image
        ImageTTFText($image, $this->size, $this->rot, $offset_x + $this->pad, $offset_y + $this->pad, $foreground, $this->font, $this->msg);

// output PNG object.
        imagePNG($image);
    }

}

Header("Content-type: image/png");

if (!isset($_GET["printer"]) || $_GET["printer"] == "" || $_GET["printer"] == null) {
    return;
}

$printer = master::clean($_GET["printer"]);

$text = new textPNG;

$db = NWDatabase::database();
$ca = new NWDbQuery($db);
$ca->prepareSelect("nw_printer_water_mark", "*", "printer=:printer");
$ca->bindValue(":printer", $printer);
if (!$ca->exec()) {
    return;
}
if ($ca->size() == 0) {
    return;
}

$ca->next();
$r = $ca->assoc();

$msg = isset($_GET["water_text"]) ? $_GET["water_text"] != "" ? $_GET["water_text"] : $r["texto"]  : $r["texto"];
$font = $r["fuente"];
$size = $r["tamano_fuente"];
$rot = $r["rotacion"];
$pad = $r["espacio"];
$red = $r["rojo_fuente"];
$grn = $r["verde_fuente"];
$blu = $r["azul_fuente"];
$bg_red = $r["rojo_fondo"];
$bg_grn = $r["verde_fondo"];
$bg_blu = $r["azul_fondo"];

$tr = $r["transparente"] == "t" ? 1 : 0;

if (isset($msg))
    $text->msg = $msg;
if (isset($font) && $font != "")
    $text->font = $font;
if (isset($size))
    $text->size = $size;
if (isset($rot))
    $text->rot = $rot;
if (isset($pad))
    $text->pad = $pad; // padding in pixels around text.
if (isset($red))
    $text->red = $red; // text color
if (isset($grn))
    $text->grn = $grn; // ..
if (isset($blu))
    $text->blu = $blu; // ..
if (isset($bg_red))
    $text->bg_red = $bg_red; // background color.
if (isset($bg_grn))
    $text->bg_grn = $bg_grn; // ..
if (isset($bg_blu))
    $text->bg_blu = $bg_blu; // ..
if (isset($tr))
    $text->transparent = $tr; // transparency flag (boolean).

$text->draw();
?>
