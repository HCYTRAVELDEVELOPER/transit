<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html xmlns='http://www.w3.org/1999/xhtml' xml:lang='es-ES' lang='es-ES'>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" />
        <meta name="apple-touch-fullscreen" content="YES" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script type="text/javascript" src="/nwlib/includes/jquery/jquery-1.4.2.min.js" ></script>
        <script type="text/javascript" src="/nwlib/modulos/nw_soporte_chat/js/nw.js"></script> 
        <link href="/nwlib/modulos/nw_soporte_chat/css/css.css" rel="stylesheet" type="text/css" charset="utf-8"/>
    </head>
    <body> 

        <?php
        require_once $_SERVER['DOCUMENT_ROOT'] . "/rpcsrv/_mod.inc.php";
        ?>
        <script>
            function update() {
                var url_data = "/nwlib/modulos/nw_rias/src/learn/srv.php";
                var data_form = $("#form_chat").serialize();
//                alert(data_form);
                $('#texto').val('');
                $.ajax({
                    type: "POST",
                    url: url_data,
                    data: data_form,
                    error: function() {
                        alert("La operación no pudo ser procesada. Inténtelo de nuevo. ");
                    },
                    success: function(data) {
                        alert(data);
                        window.location.reload();
                    }
                });
                return false;
            }
        </script>
        <form action="javascript: update();" method="post" name="form_chat" id="form_chat">
            <div>
                <label>Pregunta:</label>
                <br />
                <input type="text" value="" name="pregunta" />
            </div>
            <div>
                <label>Respuesta:</label>
                <br />
                <input type="text" value="" name="respuesta" />
            </div>
            <div>
                <label>Palabras Clave:</label>
                <br />
                <input type="text" value="" name="keys" />
            </div>
            <input id="envia_message" type="submit" value="Enviar" />
        </form>
        <div class="respuestas">

        </div>
    </body>
</html>
