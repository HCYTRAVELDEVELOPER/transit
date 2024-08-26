<script type="text/javascript">
//    var imgsrc = 'http://www.google.es/intl/en_com/images/logo_plain.png ';
//    var img = new Image();
//
//    img.onerror = function() {
//        alert("No hay conexion a internet.");
//        window.location = "/nwlib/modulos/nw_tareas/offline_task.html";
//        return;
//    }
//    img.onload = function() {
//alert("Hay conexion a internet."); 
//    }
//
//    img.src = imgsrc;



</script> 
<!--<img src="logo_plain.png" onerror="this.onerror=null;this.src='sinconexion.jpg' ;" style="display: none;"/>--> 
<script>
//    if (screen.width <= 900) {
//        document.write('<html manifest="<?php echo $ruta_carpeta; ?>nw_tareas/cach.manifest" type="text/cache-manifest">');
//    } else {
//        document.write('<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es-ES" lang="es-ES">');
//    }
//    document.write('<html manifest="<?php echo $ruta_carpeta; ?>nw_tareas/cach.manifest" type="text/cache-manifest">');
</script>


<script>
     //            document.write('<link rel="stylesheet" type="text/css" href="<?php echo $ruta_carpeta; ?>/nw_tareas/css/style.css" />');
        $(function() {

            //                var url = "<?php echo $ruta_carpeta; ?>/nw_tareas/";

            //                    $("body").append('<script type="text/javascript" src=" ' + url + 'js/main.js" />\n\
            //                $("body").append('<div id="enc_main_user_dats"></div>\n\
            //                                   <div id="main_main"><div id="main"></div></div>\n\
            //                                   <div id="calendar_nw"></div>\n\
            //                                   <div class="show_contend_popup" id="show_contend_popup"></div>\n\
            //                                   <div id="update_for"></div>\n\
            //                                   <div id="loading"><div>Cargando</div></div>');
            $("#main_main").resizable();


            //                var script_ckeditor = document.createElement("script");
            //                script_ckeditor.type = "text/javascript";
            //                script_ckeditor.src = url + "js/main.js";
            //                document.body.appendChild(script_ckeditor);
            //
            //                var script_div1 = document.createElement("div");
            //                script_div1.id = "enc_main_user_dats";
            //                document.body.appendChild(script_div1);
            //
            //                var main_main = document.createElement("div");
            //                main_main.id = "main_main";
            //                document.body.appendChild(main_main);
            //
            //                var main = document.createElement("div");
            //                main.id = "main";
            //                document.getElementById('main_main').appendChild(main);
            //
            //                var calendar_nw = document.createElement("div");
            //                calendar_nw.id = "calendar_nw";
            //                document.body.appendChild(calendar_nw);
            //
            //                var show_contend_popup = document.createElement("div");
            //                show_contend_popup.id = "show_contend_popup";
            //                document.body.appendChild(show_contend_popup);
            //
            //
            //
            //                var update_for = document.createElement("div");
            //                update_for.id = "update_for";
            //                document.body.appendChild(update_for);
            //
            //                var loading = document.createElement("div");
            //                loading.id = "loading";
            //                document.body.appendChild(loading);
            //
            //                var loading_into = document.createElement("div");
            //                loading_into.id = "loading_into";
            //                document.getElementById('loading').appendChild(loading_into);



        });
        //                 window.onload = loadScript;
        
        
        
            function crear(data) {
                var url_data = "/nwlib/modulos/nw_tareas/srv/create.php";
                var data_form = {};
                data_form.data_all = data;
                $.ajax({
                    type: "POST",
                    url: url_data,
                    data: data_form,
                    error: function() {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function(data) {
                        alert(data);
                    }
                });
                return false;
            }
</script>