<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"  
      xmlns:fb="http://www.facebook.com/2008/fbml"
      xmlns:og="http://ogp.me/ns#"
      xml:lang="es-ES" >
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"></meta>
        <meta name="robots" content="INDEX, FOLLOW" ></meta>
        <script src="includes/wz_dragdrop.js" type="text/javascript" ></script>
        <script type="text/javascript" src="includes/jquery/jquery-1.4.2.min.js" ></script>

        <script type="text/javascript" src="includes/jquery/jquery-ui.min.js" ></script>

        <script src="includes/jquery/slide_jquery/js/simple-slider.js"></script>
        <link href="includes/jquery/slide_jquery/css/simple-slider.css" rel="stylesheet" type="text/css" />

        <script type="text/javascript">
            function changeMap(val) {
                $("#img_remove").remove();
                $('#map_carga_img').append("<div id='img_remove' class='box_img'><img id='img_id' class='img_full' src='" + val + "' /></div>");
            }
            ;
            function setParamRecord(top, left, hoja_x, hoja_y, zoom, tipoo) {
                //   $("#map_carga_img").css({zoom: zoom});
                $(".img_full").animate({top: hoja_y, left: hoja_x});
                $(".img_full")
                        .css('-webkit-transform', 'scale(' + zoom + ')')
                        .css('-webkit-transform', 'scale(' + zoom + ')')
                        .css('-moz-transform', 'scale(' + zoom + ')')
                        .css('-o-transform', 'scale(' + zoom + ')')
                        .css('transform', 'scale(' + zoom + ')');
                $(".value").val(zoom);
                if (tipoo == "1") {
                    $('head').append("<link href='css/pointOnMap/tipo_uno.css' rel='stylesheet' type='text/css' />");
                } else
                if (tipoo == "2") {
                    $('head').append("<link href='css/pointOnMap/tipo_dos.css' rel='stylesheet' type='text/css' />");
                }
                dd.elements.x1y1.moveTo(top, left);
                $("#x1y1").draggable();
                //  $("#map_carga_img").draggable();
                $(".img_full").draggable();
            }
        </script>
    </head>
    <body>
        <input class="value" id="miinput" type="text" value="0.5"  data-slider="true" style="height: 0; padding: 0; margin: 0;" />
        <div id="map_carga_img" class="hoja_man_carga">
            <div id='objeto'>
                <div>
                    <div id='x1y1' class="box_object">
                        <div class="punta_top_two"></div>
                        <span>
                            <div class='pointer_on_map_icono'></div>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            SET_DHTML(CURSOR_MOVE, RESIZABLE, NO_ALT, SCROLL, "objetos", "x1y1" + TRANSPARENT);
            //            function my_DropFunc() {
            //                parent.document.getElementById('qxnw_y').value = dd.obj.y - dd.elements.objetos.y + 1;
            //                parent.document.getElementById('qxnw_x').value = dd.obj.x - dd.elements.objetos.x + 1;
            //
            //            }
            $("#x1y1").mouseup(function() {
                var left = document.getElementById('x1y1').offsetLeft;
                var top = document.getElementById('x1y1').offsetTop;
                parent.document.getElementById('qxnw_x').value = left;
                parent.document.getElementById('qxnw_y').value = top;
            });

            $("#map_carga_img").mouseup(function() {
                var leff = document.getElementById('img_id').offsetLeft;
                var topp = document.getElementById('img_id').offsetTop;
                parent.document.getElementById('mapa_x').value = leff;
                parent.document.getElementById('mapa_y').value = topp;
            });
            $("#map_carga_img").mousedown(function() {
                $(".img_full").draggable();
            });

            $("[data-slider]")
                    .each(function() {
                var input = $(this);
                $("<p>")
                        .addClass("output")
                        .insertAfter($(this));
            })
                    .bind("slider:ready slider:changed", function(event, data) {
                $(this)
                        .nextAll(".output:first")
                        .html(data.value.toFixed(3));
                var suma = data.value * 2;
                $(".img_full")
                        .css('-webkit-transform', 'scale(' + suma + ')')
                        .css('-webkit-transform', 'scale(' + suma + ')')
                        .css('-moz-transform', 'scale(' + suma + ')')
                        .css('-o-transform', 'scale(' + suma + ')')
                        .css('transform', 'scale(' + suma + ')');
                //  $(".box_img").css({zoom: suma});
                parent.document.getElementById('zoom').value = suma;
            });
        </script>
    </body>
</html>