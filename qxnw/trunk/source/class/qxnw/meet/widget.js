/* ************************************************************************
 
 Copyright:
 2013 Netwoods.net, http://www.netwoods.net
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 
 ************************************************************************ */
/**
 * Creates a form with jitsi meet call and all those functionality
 */
qx.Class.define("qxnw.meet.widget", {
    extend: qxnw.forms,
    include: [qx.locale.MTranslation],
    events: {
        "videoConferenceLeft": "qx.event.type.Data",
        "participantJoined": "qx.event.type.Data"
    },
    construct: function construct() {
        this.base(arguments);
        var self = this;
        if (qxnw.config.getIsJitsiLoaded() == false) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://meet.jit.si/external_api.js";
            script.onload = function () {
                qxnw.config.setIsJitsiLoaded(true);
                main.fireEvent("loadedJisti");
                self.initialize();
            };
            document.body.appendChild(script);
        } else {
            var timer = new qx.event.Timer(1000);
            timer.start();
            timer.addListener("interval", function (e) {
                this.stop();
                self.initialize();
            });
        }
        self.addListener("close", function () {
            if (self.api != null) {
                self.api.executeCommand('hangup');
                self.api = null;
            }
        });
        self.configOptions = {};
    },
    properties: {
        conferenceUrl: {
            init: "meet.gruponw.com",
            check: "string"
        },
        room: {
            init: null
        },
        roomName: {
            init: "QXNW :: Videocall"
        },
        email: {
            init: null
        },
        avatarUrl: {
            init: null
        },
        displayName: {
            init: null
        }
    },
    destruct: function () {

    },
    members: {
        api: null,
        configOptions: null,
        setConfigOptions: function setConfigOptions(configOptions) {
            this.configOptions = configOptions;
        },
        initialize: function initialize() {
            var self = this;
            if (self.getRoom() == null) {
                qxnw.utils.information(self.tr("No se envío número de sala"));
                return;
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.getRpcUrl(), "master");
            rpc.setAsync(true);
            var func = function (r) {
                qxnw.utils.loading("Cargando videollamada...");
                var container = new qx.ui.container.Composite(new qx.ui.layout.HBox());
                self.masterContainer.add(container, {
                    flex: 1
                });
                container.addListener("disappear", function () {
                    if (self.api != null) {
                        self.api.executeCommand('hangup');
                        self.api = null;
                    }
                });
                container.addListener("appear", function () {
                    var node = this.getContentElement().getDomElement();
                    var options = {
                        jwt: r,
                        roomName: self.getRoom(),
                        parentNode: node,
                        height: 700,
                        userInfo: {
                            email: 'direccion@netwoods.net.com',
                            displayName: 'NW AF'
                        }
                    };
                    if (self.configOptions != null) {
                        options.configOverwrite = self.configOptions;
                    }
                    self.api = new JitsiMeetExternalAPI(self.getConferenceUrl(), options);
                    self.api.executeCommand('subject', self.getRoomName());
                    if (self.getEmail() != null) {
                        self.api.executeCommand('email', self.getEmail());
                    }
                    if (self.getAvatarUrl() != null) {
                        self.api.executeCommand('avatarUrl', self.getAvatarUrl());
                    }
                    if (self.getDisplayName() != null) {
                        self.api.executeCommand('displayName', self.getDisplayName());
                    }
                    self.api.addEventListener("videoConferenceLeft", function () {
                        self.fireDataEvent("videoConferenceLeft", null);
                        self.close();
                    });
                    self.api.addEventListener("participantJoined", function () {
                        self.fireDataEvent("participantJoined", null);
                    });
                    var timer = new qx.event.Timer(5000);
                    timer.start();
                    timer.addListener("interval", function (e) {
                        this.stop();
                        qxnw.utils.stopLoading();
                    });
                });
            };
            var p = {};
            p["room"] = self.getRoom();
            rpc.exec("getJitsiToken", p, func);
        }
    }
});