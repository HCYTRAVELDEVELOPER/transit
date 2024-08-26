    const applicationServerPublicKey = 'BChyOxp98K3qSHGkeeE_j62ClDMhdRLTgrhWZxe5Y394pLBPpN4RFATJpqaP5OA7Aszr6h5_c7uO9mtEH7EycjA';
var isSubscribed = false;
var swRegistration = null;
var showFormServerWorker = false;

function initServerWorker(callBack) {
var config = nwm.getConfigApp();
var workLocal = false;
var isInFrame = insideIframe();
if (typeof config.workLocal != "undefined") {
    workLocal = config.workLocal;
}
if (isInFrame == false) {
      if(showFormServerWorker === true) {
        return;
    }
    showFormServerWorker = true;
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        if (workLocal === true) {
            console.log('Service Worker and Push is supported');
        }
        navigator.serviceWorker.register('/service-worker.js').then(function (swReg) {
            if (workLocal === true) {
                console.log('Service Worker is registered (/service-worker.js)', swReg);
            }
            swRegistration = swReg;
            initialiseUI(callBack);
//            installAppNwMaker();
        }).catch(function (error) {
            console.error('Service Worker Error', error);
        });
    } else {
        console.warn('Push messaging and/or serviceWorker is not supported');
    }
}    

function initialiseUI(callBack) {
    swRegistration.pushManager.getSubscription().then(function (subscription) {
        isSubscribed = !(subscription === null);
        if (isSubscribed) {
        } else {
            console.log('User is NOT subscribed.');
        }
        updateBtn(callBack);
    });
}
function updateBtn(callBack) {
    if (Notification.permission === 'denied') {
        updateSubscriptionOnServer(null);
        newRemoveLoading("body");
        if(typeof callBack !== "undefined") {
            callBack("denied");
        }
        return;
    }
    if (isSubscribed) {
          if(typeof callBack !== "undefined") {
            callBack(isSubscribed);
        }
        newRemoveLoading("body");
    } else {
        openFormSuscribe(callBack);
    }
}
function openFormSuscribe(callBack) {
    var params = {};
    params.html = location.hostname + ' requiere enviarte notificaciones. ¿Deseas activarlas? ';
    params.onSave = function () {
        if (isSubscribed) {
             if(typeof callBack !== "undefined") {
            callBack(isSubscribed);
        }
        } else {
            var css = "position: fixed;z-index: 10000000000;background: rgba(255, 255, 255, 0.76);";
            newLoading("body", "Activando...", css, "allWindow");
            subscribeUser(callBack);
        }
        return true;
    };
    createDialogNw(params);
}
function subscribeUser(callBack) {
    var is = navigator.onLine;
    
    setTimeout(function () {
        newRemoveLoading("body");
    }, 5000);
    
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: applicationServerKey}).then(function (subscription) {
        console.log('User is subscribed:', subscription);
        updateSubscriptionOnServer(subscription);
        isSubscribed = true;
        updateBtn(callBack);
    }).catch(function (err) {
        console.log('Failed to subscribe the user: ', err);
        updateBtn(callBack);
    });
}
function updateSubscriptionOnServer(subscription) {
    const subscriptionJson = document.querySelector('.js-subscription-json');
    if (subscription) {
        var data = {};
        data["json"] = JSON.stringify(subscription);
        var rpc = {};
        rpc["service"] = "nwMaker";
        rpc["method"] = "saveSuscriptorPush";
        rpc["data"] = data;
        var func = function (r) {
            console.log(r);
            if (!verifyErrorNwMaker(r)) {
                return;
            }
            newRemoveLoading("body");
        };
        rpcNw("rpcNw", rpc, func, true);
    } else {
        newRemoveLoading("body");
    }
}
function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
}