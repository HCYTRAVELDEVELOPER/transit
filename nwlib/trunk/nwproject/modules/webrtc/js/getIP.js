//get the IP addresses associated with an account
function getIPs(callback) {
    var ip_dups = {};
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;
    //bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection
                || win.mozRTCPeerConnection
                || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }
    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };
    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;
    //add same stun server for chrome
    if (useWebKit)
        servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);
    function handleCandidate(candidate) {
        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
        var ip_addr = ip_regex.exec(candidate)[1];
        //remove duplicates
        if (ip_dups[ip_addr] === undefined) {
            var os = candidate.split(":")[1];
            os = os.split(" ");
            var d = {
                ip: ip_addr,
                id_red: os[0]
            };
            callback(d);
        }
        ip_dups[ip_addr] = true;
    }
    //listen for candidate events
    pc.onicecandidate = function (ice) {
        //skip non-candidate events
        if (ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };
    //create a bogus data channel
    pc.createDataChannel("");
    //create an offer sdp

    pc.createOffer(function (result) {
        pc.setLocalDescription(result, function () {}, function () {});
    }, function () {});
    setTimeout(function () {
        var lines = pc.sdp.split('\n');
        lines.forEach(function (line) {
            if (line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });

    }, 1000);
}