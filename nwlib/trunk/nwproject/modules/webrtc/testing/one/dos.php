<!DOCTYPE html>
<html>
    <head>
        <title>SimpleWebRTC Videoconferencia</title>
        <link rel="stylesheet" type="text/css" href="estilos.css">
    </head>
    <body>
        <h1 id="title">Videoconferencia</h1>


        <form id="createRoom">
            <input id="sessionInput"/>
            <button type="submit">Crear Videoconferencia</button>
        </form>
        <div class="contenedor">
            <video id="localVideo" style="height: 150px;" oncontextmenu="return false;"></video>
            <div id="localVolume" class="volumen"></div>
        </div>
        <div id="remotes"></div>
        <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"></script>-->
            <script type='text/javascript' src='/nwlib6/nwproject/modules/nw_user_session/js/jquery/jquery-3.3.1.min.js'></script>
        <script src="simplewebrtc.bundle.js"></script>
        <script>
            // Crear url de la sala de conferencia
            var salaconferencia = location.search && location.search.split('?')[1];
            // Iniciamos la conexion a nuestro camara de video
            var webrtc = new SimpleWebRTC({
                // indicamos cual sera el id del elemento a conectar
                localVideoEl: 'localVideo',
                // indicamos el id del elemento video remoto
                remoteVideosEl: '',
                // accedemos a nuestra camara de video si es detectada
                autoRequestMedia: true,
                debug: false,
                detectSpeakingEvents: true,
                autoAdjustMic: false
            });

            // Si inica nuestra camra de video
            webrtc.on('readyToCall', function () {
                // el enlace de la sala de videocnferencia quedara a la espera de usuarios
                if (salaconferencia)
                    webrtc.joinRoom(salaconferencia);
            });

            function showVolume(el, volume) {
                if (!el)
                    return;
                if (volume < -45) { // variamos el volumen -45 and -20
                    el.style.height = '0px';
                } else if (volume > -20) {
                    el.style.height = '100%';
                } else {
                    el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
                }
            }
            webrtc.on('channelMessage', function (peer, label, data) {
                if (data.type == 'volume') {
                    showVolume(document.getElementById('volume_' + peer.id), data.volume);
                }
            });
            webrtc.on('videoAdded', function (video, peer) {
                console.log('video added', peer);
                var remotes = document.getElementById('remotes');
                if (remotes) {
                    var d = document.createElement('div');
                    d.className = 'contenedor';
                    d.id = 'container_' + webrtc.getDomId(peer);
                    d.appendChild(video);
                    var vol = document.createElement('div');
                    vol.id = 'volume_' + peer.id;
                    vol.className = 'volumen';
                    video.onclick = function () {
                        video.style.width = video.videoWidth + 'px';
                        video.style.height = video.videoHeight + 'px';
                    };
                    d.appendChild(vol);
                    remotes.appendChild(d);
                }
            });
            webrtc.on('videoRemoved', function (video, peer) {
                console.log('video removed ', peer);
                var remotes = document.getElementById('remotes');
                var el = document.getElementById('container_' + webrtc.getDomId(peer));
                if (remotes && el) {
                    remotes.removeChild(el);
                }
            });
            webrtc.on('volumeChange', function (volume, treshold) {
                //console.log('own volume', volume);
                showVolume(document.getElementById('localVolume'), volume);
            });
            // Since we use this twice we put it here
            function setRoom(name) {
                $('form').remove();
                $('h1').text(name);
                $('#subTitle').text('Link to join: ' + location.href);
                $('body').addClass('active');
            }
            if (salaconferencia) {
                setRoom(salaconferencia);
            } else {
                $('form').submit(function () {
                    var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
                    webrtc.createRoom(val, function (err, name) {
                        console.log(' create salaconferencia cb', arguments);

                        var newUrl = location.pathname + '?' + name;
                        if (!err) {
                            history.replaceState({foo: 'bar'}, null, newUrl);
                            setRoom(name);
                        } else {
                            console.log(err);
                        }
                    });
                    return false;
                });
            }
            var button = $('#screenShareButton'),
                    setButton = function (bool) {
                        button.text(bool ? 'share screen' : 'stop sharing');
                    };
            webrtc.on('localScreenStopped', function () {
                setButton(true);
            });
            setButton(true);
            button.click(function () {
                if (webrtc.getLocalScreen()) {
                    webrtc.stopScreenShare();
                    setButton(true);
                } else {
                    webrtc.shareScreen(function (err) {
                        if (err) {
                            setButton(true);
                        } else {
                            setButton(false);
                        }
                    });

                }
            });
        </script>
    </body>
</html>