<!DOCTYPE html>
<html><head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta charset="UTF-8"> <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Tutorial WebRTC getUserMedia API</title>
        <style>
            body
            {
                max-width: 500px;
                margin: 2em auto;
                padding: 0 0.5em;
                font-size: 20px;
                background-color:#223254;
            }

            h2
            {
                text-align: center;
                color:#ffffff;
            }

            .botonera
            {
                text-align: center;
            }

            #video
            {
                display: block;
                border:solid 5px #f7f7f7;
                width: 100%;
            }
            .boton
            {
                padding: 0.5em;
                display: inline-block;
                margin: 1em auto;
            }

        </style>
    </head>
    <body>
        <h2>WebRTC getUserMedia API</h2>
        <h2>Probando video</h2>


        <video id="video" autoplay="autoplay" controls="controls">


        </video>
        <div class="botonera">
            <button id="btconectar" class="boton">Conectar</button>
            <button id="btdescanectar" class="button-demo">Desconectar</button>
        </div>
        <script>var trasmitevideo = null;
            var video = document.getElementById('video');

            // Detectar navegador MS Edge, Chrome o Firefox
            window.navigator = window.navigator || {};
            navigator.getUserMedia = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
                    null;
            if (navigator.getUserMedia === null) {
                document.getElementById('btconectar').setAttribute('disabled', 'disabled');
                document.getElementById('btdesconectar').setAttribute('disabled', 'disabled');
            } else {

                var escena = window.URL ? window.URL.createObjectURL : function (stream) {
                    return stream;
                };
                var audio = window.AudioContext ||
                        window.webkitAudioContext ||
                        null;


                document.getElementById('btconectar').addEventListener('click', function () {

                    // Capturamos el audio y el video
                    navigator.getUserMedia({
                        video: true,
                        audio: true
                    },
                            function (stream) {
                                trasmitevideo = stream;
                                // trasmitir datos de video
                                video.src = escena(stream);
                                video.play();
                            },
                            function (error) {
                                console.log('Error de video: ' + error.code);
                            });
                });
                document.getElementById('btdesconectar').addEventListener('click', function () {
                    // Pausar trasmision de video
                    video.pause();
                    // Detener transmision de video
                    trasmitevideo.stop();
                });
                }</script>  </body></html>