function getIPs(callback) {
    window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;   //compatibility for firefox and chrome
//    var peerConnectionConfig = iceServers: [];
    var peerConnectionConfig = getConfigWrpc();
    var pc = new RTCPeerConnection(peerConnectionConfig), noop = function () {};
//    var pc = new RTCPeerConnection({iceServers: []}), noop = function () {};
    pc.createDataChannel("");
    pc.createOffer(pc.setLocalDescription.bind(pc), noop);
    pc.onicecandidate = function (ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate)
            return;
        var myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
        pc.onicecandidate = noop;
        var candidate = ice.candidate.candidate;
        var os = candidate.split(":")[1];
        os = os.split(" ");
        if (typeof callback !== "undefined") {
            var d = {};
            d.ip = myIP;
            d.id_red = os[0];
            callback(d);
        }
    };

    function getConfigWrpc() {
        var moz = !!navigator.mozGetUserMedia;
//        var chromeVersion = !!navigator.mozGetUserMedia ? 0 : parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
        var iceServers = [];
//       iceServers.push(
//             {urls: ["turn:173.194.72.127:19305?transport=udp",
//       "turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
//       "turn:173.194.72.127:443?transport=tcp",
//       "turn:[2404:6800:4008:C01::7F]:443?transport=tcp"
//       ],
//     username:"CKjCuLwFEgahxNRjuTAYzc/s6OMT",
//     credential:"u1SQDR/SQsPQIxXNWQT7czc/G4c="
//    }   
//            );
        if (moz) {
            iceServers.push({
                url: 'stun:23.21.150.121'
            });
            iceServers.push({
                url: 'stun:stun.services.mozilla.com'
            });
        } else {
            iceServers.push({
                url: 'stun:stun.l.google.com:19302'
            });

            iceServers.push({
                url: 'stun:stun.anyfirewall.com:3478'
            });
        }
        iceServers.push({
            'url': 'turn:192.158.29.39:3478?transport=udp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        });
        iceServers.push({
            'url': 'turn:192.158.29.39:3478?transport=tcp',
            'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            'username': '28224511:1379330808'
        });
        iceServers.push({
            url: 'turn:turn.bistri.com:80',
            username: 'homeo',
            credential: 'homeo'
        });
        iceServers.push({
            url: 'stun:stun.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun1.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun2.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stu3.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun4.l.google.com:19302'
        });
        iceServers.push({
            url: 'stun:stun.ekiga.net'
        });
        iceServers.push({
            url: 'stun:stun.ideasip.com'
        });
        iceServers.push({
            url: 'stun:stun.iptel.org'
        });
        iceServers.push({
            url: 'stun:stun.rixtelecom.se'
        });
        iceServers.push({
            url: 'stun:stun.schlund.de'
        });
        iceServers.push({
            url: 'stun:stunserver.org'
        });
        iceServers.push({
            url: 'stun:stun.softjoys.com'
        });
        iceServers.push({
            url: 'stun:stun.voiparound.com'
        });
        iceServers.push({
            url: 'stun:stun.voipbuster.com'
        });
        iceServers.push({
            url: 'stun:stun.voipstunt.com'
        });
        iceServers.push({
            url: 'stun:stun.stunprotocol.org:3478'
        });
        iceServers.push({
            url: 'stun:stun.services.mozilla.com'
        });
        iceServers.push({
            url: 'stun:stun.sipgate.net'
        });
        iceServers.push({
            url: 'turn:numb.viagenie.ca:3478',
            username: 'assdres@gmail.com',
            credential: 'padre08'
        });


        var peerConnectionConfig = {
            iceServers: iceServers
        };
//    var peerConnectionConfig = {
//  iceServers:[
//    {urls: ["turn:173.194.72.127:19305?transport=udp",
//       "turn:[2404:6800:4008:C01::7F]:19305?transport=udp",
//       "turn:173.194.72.127:443?transport=tcp",
//       "turn:[2404:6800:4008:C01::7F]:443?transport=tcp"
//       ],
//     username:"CKjCuLwFEgahxNRjuTAYzc/s6OMT",
//     credential:"u1SQDR/SQsPQIxXNWQT7czc/G4c="
//    },
////    {urls:["stun:stun.l.google.com:19302"]}
//  ]};
        return peerConnectionConfig;
    }
}