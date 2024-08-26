var loadApiNwYouTube = false;
var nwyt = {
    elementStatus: null,
    elementVideoID: null,
    elementDuration: null,
    elementCurrentTime: null,
    elementPercentLoaded: null,
    elementEmbedCode: null,
    elementUrl: null,
    elementVolume: null,
    elementMute: null,
    elementQuality: null,
    elementQualityOptions: null,
    elementRate: null,
    elementTitle: null,
    elementAuthor: null,
    listID: null,
    type: null,
    id_station: "",
    start: function (callbackInit) {
        var self = this;
        if (!loadApiNwYouTube) {
            self.loadApi(callbackInit);
        } else {
            callbackInit();
        }
    },
    loadApi: function (callbackInit) {
        var url = "https://www.youtube.com/iframe_api";
        callBack = function () {
            window.onYouTubeIframeAPIReady = function () {
                callbackInit();
            };
        };
        try {
            var async = true;
            var id = url.replace(/\//gi, "");
            id = id.replace(/\:/gi, "");
            id = id.replace(/\?/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\./gi, "");
            id = id.replace(/\,/gi, "");
            id = id.replace(/\&/gi, "");
            id = id.replace(/\=/gi, "");
            id = id.replace(/\_/gi, "");
            id = id.replace(/\-/gi, "");
            id = id.replace(/\</gi, "");
            id = id.replace(".", "");
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.id = id;
            script.className = id;
            script.charset = "UTF-8";
            script.async = "async";
            script.src = url;
            var style = document.querySelector("." + id);
            if (!style) {
                script.onload = function () {
                    loadApiNwYouTube = true;
                    callBack();
                };
                if (async === true) {
                    document.getElementsByTagName('head')[0].appendChild(script);
                } else {
                    $("body").append(script);
                }
            } else {
                callbackInit();
            }
        } catch (e) {
            console.log(e);
        }
    },
    intialize: function (params) {
        var self = this;
        self.listID = params.listID;
        if (params.id_station !== "undefined") {
            self.id_station = params.id_station;
        }
        self.type = params.type;
        var op = {};
        op.suggestedQuality = "tyni";
        op.height = params.height;
        op.width = params.width;
        op.playerVars = {
            suggestedQuality: "tyni",
            'enablejsapi': 1,
            'playsinline': 1,
            'autoplay': 1,
            'controls': 1,
            'rel': 0,
            'showinfo': 0,
            'showsearch': 0,
            'modestbranding': 1,
            'disablekb': 1,
            iv_load_policy: 3,
            ecver: 2,
            loop: 1
        };
        if (params.type === "list") {
            op.playerVars.listType = "list";
            op.playerVars.list = self.listID;
        } else {
            op.videoId = params.videoID;
        }
        // Set the id of the video to be played
        // Setup event handelers
        op.events = {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange,
            'onPlaybackQualityChange': onPlaybackQualityChange,
            'onPlaybackRateChange': onPlaybackRateChange,
            'onError': onError,
            'onApiChange': onApiChange
        };
        self.player = new YT.Player(params.containerVideo, op);
        function  onPlayerReady() {
            self.onPlayerReady();
        }
        function  onPlayerStateChange(event) {
            self.onPlayerStateChange(event);
        }
        function  onPlaybackQualityChange() {
            self.onPlaybackQualityChange();
        }
        function  onPlaybackRateChange() {
            self.onPlaybackRateChange();
        }
        function  onError(error) {
            self.onError(error);
        }
        function  onApiChange(event) {
            self.onApiChange(event);
        }
    },
// Event Handlers 
    onPlaybackQualityChange: function () {
        var self = this;
        // Update playback quality on page
        self.update("quality");
    },
    onPlaybackRateChange: function () {
        var self = this;
        // Update playback rate on page
        self.update("rate");
    },
    onError: function (error) {
        // Update errors on page
        console.log("Error!", error);
    },
    onApiChange: function (event) {
        // Update currently availbe APIs
        console.log("API Change!", event);
    },
    onPlayerReady: function () {
        var self = this;
        // Update page after player is ready
        self.updateAll();

        var index = self.player.getPlaylistIndex();
        var currentTime = 0;
        if (typeof window.localStorage.getItem(self.id_station + "_nwyt_CurrentTime") !== "undefined") {
            currentTime = window.localStorage.getItem(self.id_station + "_nwyt_CurrentTime");
        }
        if (typeof window.localStorage.getItem(self.id_station + "_nwyt_index") !== "undefined") {
            index = window.localStorage.getItem(self.id_station + "_nwyt_index");
        }
        index = parseInt(index);
        self.playVideo();

        if (self.type === "list") {
            self.player.playVideoAt(index);
            self.player.seekTo(currentTime);
        }

//        var playlist = self.player.getPlaylist();
//        var newPlaylist = [];
//        for (var i = 0; i < playlist.length; i++) {
//            newPlaylist.push(playlist[i]);
//        }
//        console.log("playlist", playlist)
//        console.log("newPlaylist", newPlaylist)
        if (typeof self.onload !== "undefined") {
            self.onload();
        }
    },
    onPlayerStateChange: function (event) {
        var self = this;
        console.log("onPlayerStateChange", event)
        self.player.setPlaybackQuality("tyni");
        var index = self.player.getPlaylistIndex();
        console.log("index", index)
        var currentTime = parseInt(self.player.getCurrentTime());
        var duration = parseInt(self.player.getDuration());
        console.log("currentTime", currentTime)
        console.log("duration", duration)
        if (currentTime >= duration) {
//            self.player.nextVideo();
        }

        window.localStorage.setItem(self.id_station + "_nwyt_index", parseInt(index).toString());

        if (event.data === -1 || event.data === 0) {
//            self.player.nextVideo();
        }
        // Get current state
        // Video has ended
        switch (event.data) {
            case YT.PlayerState.ENDED:
                self.updateAll(); // set status for state, ...
                self.clearIntervals() // clear all intervals
                break;
            case YT.PlayerState.PLAYING:
                self.updateAll() // set status for state, ...
                self.setIntervals() // set intervals for ...
                break;
            case YT.PlayerState.PAUSED:
                self.updateAll() // set status for state, ...
                self.clearIntervals() // clear all intervals
                break;
            case YT.PlayerState.BUFFERING:
                self.updateAll() // set status for state, ...
                self.clearIntervals() // clear all intervals
                break;
            case YT.PlayerState.CUED:
                self.updateAll() // set status for state, ...
                self.clearIntervals() // clear all intervals
                break;
            default:
                self.updateAll() // set status for state, ...
                self.clearIntervals() // clear all intervals
                break;
        }
    },
    // Array to track all HTML nodes
    nodeList: [
        "duration",
        "url",
        "embedCode",
        "percentLoaded",
        "status",
        "currentTime",
        "volume",
        "mute",
        "quality",
        "rate",
        "title",
        "author",
        "video_id"
    ],
// Updates all HTML nodes
    updateAll: function () {
        var self = this;
        for (var node in self.nodeList) {
            self.update(self.nodeList[node]);
        }
    },
// Update HTML nodes on the page
// with most recent values from
// the YouTube iFrame API
    update: function (node) {
        var self = this;
        if (typeof self.getUpdates !== "undefined") {
            self.getUpdates(node);
        }
        var state = self.player.getPlayerState();
        switch (node) {
            // Update player reported changes
            case "duration":
                if (self.elementDuration) {
                    self.elementDuration.innerHTML = self.player.getDuration() + "s";
                }
                break;
            case "url":
                var url = self.player.getVideoUrl();
                if (self.elementUrl)
                    self.elementUrl.innerHTML = "<a href=\"" + url + "\" target=\"_blank\">" + url + "</a>";
                break;
            case "embedCode":
                var embedCode = self.player.getVideoEmbedCode();
                var index = Math.ceil(embedCode.length / 3);
                var fmtEmbedCode = [embedCode.slice(0, index), "\n", embedCode.slice(index, index * 2), "\n", embedCode.slice(index * 2)].join('');
                if (self.elementEmbedCode)
                    self.elementEmbedCode.innerText = fmtEmbedCode;
                break;
            case "percentLoaded":
                if (self.elementPercentLoaded) {
                    self.elementPercentLoaded.innerHTML = self.player.getVideoLoadedFraction() * 100 + "%"
                }
                break;
            case "status":
                var state = self.player.getPlayerState();
                switch (state) {
                    case YT.PlayerState.ENDED:
                        status = "ENDED";
                        break;
                    case YT.PlayerState.PLAYING:
                        status = "PLAYING";
                        break;
                    case YT.PlayerState.PAUSED:
                        status = "PAUSED";
                        break;
                    case YT.PlayerState.BUFFERING:
                        status = "BUFFERING";
                        break;
                    case YT.PlayerState.CUED:
                        status = "CUED";
                        break;
                    default:
                        status = "UNKNOWN";
                        break;
                }
                if (self.elementStatus) {
                    self.elementStatus.innerHTML = status + " (" + state + ")";
                }
                break;
            case "currentTime":
                if (state === 1) {
                    if (self.type === "list") {
                        window.localStorage.setItem(self.id_station + "_nwyt_CurrentTime", parseInt(self.player.getCurrentTime()).toString());
                    }
                }
                if (self.elementCurrentTime) {
                    self.elementCurrentTime.innerHTML = parseInt(self.player.getCurrentTime()) + "s";
                }
                break;
            case "volume":
                if (self.elementVolume)
                    self.elementVolume.innerHTML = self.player.getVolume()
                break;
            case "mute":
                if (self.elementMute)
                    self.elementMute.innerHTML = self.player.isMuted()
                break;
            case "quality":
                if (self.elementQualityOptions) {
                    var availableQualityLevels = self.player.getAvailableQualityLevels()
                    var selectbox = document.getElementById('qualityOption');
                    //clear existing options
                    var i;
                    for (i = selectbox.options.length - 1; i >= 0; i--) {
                        selectbox.remove(i);
                    }
                    //write current available options
                    for (var i in availableQualityLevels) {
                        var opt = document.createElement("OPTION");
                        opt.text = availableQualityLevels[i];
                        opt.value = availableQualityLevels[i];
                        selectbox.options.add(opt);
                    }
                }
                if (self.elementQuality) {
                    self.elementQuality.innerHTML = self.player.getPlaybackQuality();
                }
                break;
            case "rate":
                if (self.elementRate) {
                    var availableRates = self.player.getAvailablePlaybackRates()
                    var selectbox = document.getElementById('rateOption');
                    //clear existing options
                    var i;
                    for (i = selectbox.options.length - 1; i >= 0; i--) {
                        selectbox.remove(i);
                    }
                    //write current available options
                    for (var i in availableRates) {
                        var opt = document.createElement("OPTION");
                        opt.text = availableRates[i];
                        opt.value = availableRates[i];
                        selectbox.options.add(opt);
                    }
                    self.elementRate.innerHTML = self.player.getPlaybackRate()
                }
                break;
            case "title":
                if (self.elementTitle)
                    self.elementTitle.innerHTML = self.player.getVideoData()["title"]
                break;
            case "author":
                if (self.elementAuthor)
                    self.elementAuthor.innerHTML = self.player.getVideoData()["author"]
                break;
            case "video_id":
                if (self.type === "list") {
                    window.localStorage.setItem(self.id_station + "_nwyt_VideoID", self.player.getVideoData()["video_id"]);
                }
                if (self.elementVideoID) {
                    self.elementVideoID.innerHTML = self.player.getVideoData()["video_id"]
                }
                break;
        }
    },
// Functions to invoke user requested action through the iFrame API
    loadNewVideo: function () {
        var self = this;
        self.player.loadVideoById(document.getElementById("video_idOption").value);
    },
    cueNewVideo: function () {
        var self = this;
        self.player.cueVideoById(document.getElementById("video_idOption").value);
    },
    playVideo: function () {
        var self = this;
        self.player.playVideo();
    },
    pauseVideo: function () {
        var self = this;
        self.player.pauseVideo();
    },
    stopVideo: function () {
        var self = this;
        self.player.stopVideo();
    },
    nextVideo: function () {
        var self = this;
        self.player.nextVideo();
    },
    previousVideo: function () {
        var self = this;
        self.player.previousVideo();
    },
    seekTo: function () {
        var self = this;
        self.player.seekTo(document.getElementById("currentTimeOption").value);
    },
    setVolume: function (num) {
        var self = this;
        self.player.setVolume(num);
    },
    mute: function () {
        var self = this;
        self.player.mute();
    },
    unmute: function () {
        var self = this;
        self.player.unMute();
    },
    setQuality: function () {
        var self = this;
        self.player.setPlaybackQuality(document.getElementById("qualityOption").value);
    },
    setRate: function () {
        var self = this;
        self.player.setPlaybackRate(document.getElementById("rateOption").value);
    },
// Controls interval handlers to update page contens
// Array to track intervals
    activeIntervals: [],
    setIntervals: function () {
        var self = this;
        // Sets invertval funtions to actively update page content
        self.activeIntervals[0] = setInterval(function () {
            self.update("percentLoaded")
        }, 500);
        self.activeIntervals[1] = setInterval(function () {
            self.update("currentTime")
        }, 500);
        self.activeIntervals[2] = setInterval(function () {
            self.update("mute")
        }, 500);
        self.activeIntervals[3] = setInterval(function () {
            self.update("volume")
        }, 500);
    },
    clearIntervals: function () {
        // Clears existing intervals to actively update page content
        var self = this;
        for (var interval in self.activeIntervals) {
            clearInterval(interval);
        }
    }
};