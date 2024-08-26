var loading_css = document.createElement("style");
loading_css.className = 'styleLoadingFirstTime';
loading_css.innerHTML = ".containerLoadingFirstTime {  opacity: 1;  z-index: 100000000000000000000000000!important;background-color: #fff;position:fixed; -webkit-transition: all 0.5s ease; -moz-transition: all 0.5s ease; -o-transition: all 0.5s ease; transition: all 0.5s ease; height: 100vh; width: 100vw; font-family: Helvetica; } .loader { height: 20px; width: 250px; position: absolute; top: 0; bottom: 0; left: 0; right: 0; margin: auto; } .loader--dot { animation-name: loader; animation-timing-function: ease-in-out; animation-duration: 3s; animation-iteration-count: infinite; height: 20px; width: 20px; border-radius: 100%; background-color: black; position: absolute; border: 2px solid white; } .loader--dot:first-child { background-color: #8cc759; animation-delay: 0.5s; } .loader--dot:nth-child(2) { background-color: #8c6daf; animation-delay: 0.4s; } .loader--dot:nth-child(3) { background-color: #ef5d74; animation-delay: 0.3s; } .loader--dot:nth-child(4) { background-color: #f9a74b; animation-delay: 0.5s; } .loader--dot:nth-child(5) { background-color: #60beeb; animation-delay: 0.1s; } .loader--dot:nth-child(6) { background-color: #fbef5a; animation-delay: 0s; } .loader--text {    word-break: normal; position: absolute; top: 200%; left: 0; right: 0; width: 4rem; margin: auto; } .loader--text:after { content: 'Loading'; font-weight: bold; animation-name: loading-text; animation-duration: 3s; animation-iteration-count: infinite; } @keyframes loader { 15% { transform: translateX(0); } 45% { transform: translateX(230px); } 65% { transform: translateX(230px); } 95% { transform: translateX(0); } } @keyframes loading-text { 0% { content: 'Loading'; } 25% { content: 'Loading.'; } 50% { content: 'Loading..'; } 75% { content: 'Loading...'; } }";
document.body.appendChild(loading_css);

var loading = document.createElement("div");
loading.className = "containerLoadingFirstTime";
loading.innerHTML = '<div class="loader"> <div class="loader--dot"></div> <div class="loader--dot"></div> <div class="loader--dot"></div> <div class="loader--dot"></div> <div class="loader--dot"></div> <div class="loader--dot"></div> <div class="loader--text"></div> </div>';
document.body.appendChild(loading);

var versionCache = "1";
if (typeof window.localStorage.getItem("lastVersionCacheCloud") != "undefined") {
    versionCache = window.localStorage.getItem("lastVersionCacheCloud");
}
var urlc = "nwmaker/nwmaker-2.min.min.js?v=" + versionCache;
console.log("urlc", urlc);
if (typeof domainLib != "undefined") {
    urlc = domainLib.replace("nwmaker/", "") + "/" + urlc;
}
console.log("urlc", urlc);
var script = document.createElement("script");
script.type = "text/javascript";
script.id = "nw_libscript_main";
script.className = "nw_libscript_main";
script.charset = "UTF-8";
script.async = "async";
script.defer = "defer";
script.src = urlc + "&versionCache=" + versionCache;
script.onload = function () {
    var other = document.querySelector(".containerLoadingFirstTime_index");
if (other) {
    other.remove();
}
var other = document.querySelector(".styleLoadingFirstTime_index");
if (other) {
    other.remove();
}
functionsStartedAppLoadAllFiles = function () {
    setTimeout(function () {
        var foo = document.querySelector("#foo");
        foo.classList.remove("foo_noshow");
        var foo = document.querySelector(".headerHome");
        foo.classList.remove("headerHome_noshow");

        loading.style.opacity = "0";
        setTimeout(function () {
            loading.remove();
            loading_css.remove();
        }, 500);
    }, 2000);
};
};
document.getElementsByTagName('head')[0].appendChild(script);
script.setAttribute("async", "async");
script.setAttribute("defer", "defer");
