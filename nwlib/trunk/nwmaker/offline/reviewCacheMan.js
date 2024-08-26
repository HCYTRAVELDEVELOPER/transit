$(document).ready(function () {
    function onUpdateReady() {
        window.location.reload();
    }
    window.applicationCache.addEventListener('updateready', onUpdateReady);
    if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
        onUpdateReady();
    }
    var appStatus = $("#applicationStatus");
    var appEvents = $("#applicationEvents");
    var appCache = window.applicationCache;
    var cacheProperties = {
        filesDownloaded: 0,
        totalFiles: 0
    };
    function getTotalFiles() {
        cacheProperties.filesDownloaded = 0;
        cacheProperties.totalFiles = 0;
        $.ajax({
            type: "get",
            url: "/nw.manifest",
            dataType: "text",
            cache: false,
            success: function (content) {
                content = content.replace(
                        new RegExp(
                                "(NETWORK|FALLBACK):" +
                                "((?!(NETWORK|FALLBACK|CACHE):)[\\w\\W]*)",
                                "gi"
                                ),
                        ""
                        );
                content = content.replace(
                        new RegExp("#[^\\r\\n]*(\\r\\n?|\\n)", "g"),
                        ""
                        );
                content = content.replace(
                        new RegExp("CACHE MANIFEST\\s*|\\s*$", "g"),
                        ""
                        );
                content = content.replace(
                        new RegExp("[\\r\\n]+", "g"),
                        "#"
                        );
                var totalFiles = content.split("#").length;
                cacheProperties.totalFiles = (totalFiles + 1);
                $(".downloadingPageTotal").html("/" + cacheProperties.totalFiles);
            }
        });
    }
    $(window).bind(
            "online offline",
            function (event) {
                console.log("Update the online status.");
                appStatus.text(navigator.onLine ? "Online" : "Offline");
                var uri = getUrlActual();
                if (uri.indexOf("/nwlib6/nwproject/modules/nw_user_session/offline.php") != -1) {
                    window.location = "/?";
                    console.log("vuelve al mundo");
                }
            }
    );
    if (navigator.onLine == false) {
        $(".loadLocalStorage").fadeIn("fast");
    }
    appStatus.text(navigator.onLine ? "Online" : "Offline App");

    __configApp.onLine = navigator.onLine;


    if (navigator.onLine === false) {
        console.log("IS OFFLINE!!! Show data in caché");
        var uri = getUrlActual();
        var launchOffline = false;
        if (uri.indexOf("/nwlib6/nwproject/modules/nw_user_session/offline.php") == -1) {
            launchOffline = true;
        }
        if (uri.indexOf("localhost") != -1) {
            launchOffline = false;
        }
        if (uri.indexOf(".loc") != -1) {
            launchOffline = false;
        }
        if (launchOffline === true) {
            window.location = "/nwlib6/nwproject/modules/nw_user_session/offline.php";
        }
        newRemoveLoading("body");
        setTimeout(function () {
            newRemoveLoading("body");
        }, 3000);
    }

    $(appCache).bind(
            "checking",
            function (event) {
//                console.log("Checking for manifest");
            }
    );
    $(appCache).bind(
            "noupdate",
            function (event) {
//                console.log("No cache updates");
                $("#downloading").remove();
            }
    );
    $(appCache).bind(
            "updateready",
            function (event) {
                console.log("New cache available");
                appCache.swapCache();
                $("#downloading").remove();
            }
    );
    $(appCache).bind(
            "downloading",
            function (event) {
//                console.log("downloading cache");
                $(".downloadingPage").fadeIn();
                $(".downloadingPageTitle").html("<strong>Nueva actualización encontrada! </strong>");
                getTotalFiles();
            }
    );
    summmmm = 0;
    $(appCache).bind(
            "progress",
            function (event) {
//                console.log("File downloaded");
                $(".downloadingPageStatus").html("Descargando " + summmmm);
                summmmm++;
            }
    );
    $(appCache).bind(
            "cached",
            function (event) {
//                console.log("All files downloaded");
                $(".downloadingPage").remove();
                $("#downloading").remove();
            }
    );
    $(appCache).bind(
            "obsolete",
            function (event) {
                console.log("Manifest cannot be found");
            }
    );
    $(appCache).bind(
            "error",
            function (event) {
                console.log("An error occurred");
                $("#downloading").remove();
            }
    );
});