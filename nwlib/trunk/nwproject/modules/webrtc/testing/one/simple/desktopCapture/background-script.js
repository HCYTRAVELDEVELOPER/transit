// this background script is used to invoke desktopCapture API
// to capture screen-MediaStream.

        var screenOptions = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(portOnMessageHanlder);

    // this one is called for each message from "content-script.js"
    function portOnMessageHanlder(message) {
        if (message == 'get-sourceId') {
            chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
        }

        if (message == 'audio-plus-tab') {
            screenOptions = ['audio', 'tab'];
            chrome.desktopCapture.chooseDesktopMedia(screenOptions, port.sender.tab, onAccessApproved);
        }
    }

    // on getting sourceId
    // "sourceId" will be empty if permission is denied.
    function onAccessApproved(sourceId) {
        // if "cancel" button is clicked
        if (!sourceId || !sourceId.length) {
            return port.postMessage('PermissionDeniedError');
        }

        // "ok" button is clicked; share "sourceId" with the
        // content-script which will forward it to the webpage
        port.postMessage({
            sourceId: sourceId
        });
    }
});


/* background page, responsible for actually choosing media */
chrome.runtime.onMessageExternal.addListener(function (message, sender, callback) {
    switch (message.type) {
        case 'getScreen':
            var pending = chrome.desktopCapture.chooseDesktopMedia(message.options || ['screen', 'window'],
                    sender.tab, function (streamid) {
                        // communicate this string to the app so it can call getUserMedia with it
                        message.type = 'gotScreen';
                        message.sourceId = streamid;
                        callback(message);
                        return false;
                    });
            return true; // retain callback for chooseDesktopMedia result
        case 'cancelGetScreen':
            chrome.desktopCapture.cancelChooseDesktopMedia(message.request);
            message.type = 'canceledGetScreen';
            callback(message);
            return false; //dispose callback
    }
});
