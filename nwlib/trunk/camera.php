<?php

class camera {
 
    public static function getCamera($p) {
        return "
<!doctype html>
<html>  
<head>
<meta charset = 'UTF-8'/>
<title>Cam NW</title>
<script type = 'text/javascript' src = 'webcam.js'></script>
</head>
<body>
    <div id='camara'>
        <script language='JavaScript'>
            webcam.set_api_url('test.php');
            webcam.set_swf_url('webcam.swf');
            webcam.set_quality(100); // JPEG quality (1 - 100)
            webcam.set_shutter_sound(true); // play shutter click sound
            webcam.shutter_url = 'shutter.mp3';
            webcam.set_hook('onLoad', null);
            webcam.set_hook('onComplete', 'callback_func');
            webcam.set_hook('onError', null);
            document.write(webcam.get_html(500, 350));

            function callback_func(response) {
                alert(response);
            }

            function camGrabar() {
                //webcam.reset();
                webcam.freeze();
                //webcam.snap();
                document.getElementById('btnGrabar').style.display = 'none';
                document.getElementById('btnCancelar').style.display = '';
                document.getElementById('btnEnviar').style.display = '';
            }
            function camCancelar() {
                webcam.reset();
                document.getElementById('btnGrabar').style.display = '';
                document.getElementById('btnCancelar').style.display = 'none';
                document.getElementById('btnEnviar').style.display = 'none';
            }
            function camEnviar() {
                webcam.snap();
                webcam.upload();
            }
        </script>
    </div>
    <p>
        <button onClick='camGrabar();
                return false;' id='btnGrabar'>Tomar Foto</button>
        <button onClick='camCancelar();
                return false;' id='btnCancelar' style='display:none'>Cancelar</button>
        <button onClick='camEnviar();
                return false;' id='btnEnviar' style='display:none'>Subir</button>
    </p>
</body>
</html>";
    }

}
?>