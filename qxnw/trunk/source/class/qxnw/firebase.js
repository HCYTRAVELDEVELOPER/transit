/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.grupoqxnw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Alexander Flórez (alexf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */
qx.Class.define("qxnw.firebase", {
    extend: qx.core.Object,
    construct: function () {
        var self = this;
    },
    destruct: function () {
    },
    members: {
    },
    statics: {
        loaded: false,
        load: function (firebaseConfig, callback, local, persistence) {

            qxnw.firebase.persistence = persistence;
            var loaded = qxnw.firebase.loaded;
            if (typeof callback === "undefined") {
                callback = function () {

                };
            }
            var online = qxnw.utils.isOnline();
            if (loaded === true || !online) {
                return callback();
            }
            console.log("firebase version 9.6.11 -compat ::: local=", local);
            if (local) {
//                qxnw.utils.require(config.domain_rpc + config.carpet_files_extern + "/nwmaker/firebase-compress.js", function () {
//                qxnw.utils.require("nwmaker/firebase-compress.js", function () {
                qxnw.utils.require("nwmaker/firebase-compress-9.6.11.js", function () {
                    callbackload();
                }, true);
            } else {

                var v = "7.15.5";
                var v = "9.6.11";
                var v = "9.19.0";
                if (qxnw.utils.isDebug()) {
                    console.log("firebase V: ", v);
                }
                qxnw.utils.require("https://www.gstatic.com/firebasejs/" + v + "/firebase-app-compat.js", function () {
//                qxnw.utils.require("https://www.gstatic.com/firebasejs/7.15.5/firebase-analytics.js", function () {
                    qxnw.utils.require("https://www.gstatic.com/firebasejs/" + v + "/firebase-storage-compat.js", function () {
                        qxnw.utils.require("https://www.gstatic.com/firebasejs/" + v + "/firebase-messaging-compat.js", function () {
//                            qxnw.utils.require("https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js", function () {
//                            qxnw.utils.require("https://www.gstatic.com/firebasejs/" + v + "/firebase-firestore.js", function () {
                            qxnw.utils.require("https://www.gstatic.com/firebasejs/" + v + "/firebase-firestore-compat.js", function () {
//                                qxnw.utils.require("https://www.gstatic.com/firebasejs/7.15.5/firebase-auth.js", function () {
//                                    qxnw.utils.require("https://www.gstatic.com/firebasejs/7.15.5/firebase-database.js", function () {
                                //No important
//                                    qxnw.utils.require("https://www.gstatic.com/firebasejs/7.15.5/firebase-performance.js", function () {
                                callbackload();
//                                    });
//                                    });
//                                    });
//                                });
                            });
                        });
                    });
                });
            }
            function callbackload() {
                console.log("load firebase!");
//                            var firebaseConfig = {
//                                apiKey: "AIzaSyBYFSGZ4dcrxCpa6K1-nbGJs3DcDfpmi6k",
//                                authDomain: "chat-43efa.firebaseapp.com",
//                                databaseURL: "https://chat-43efa.firebaseio.com",
//                                projectId: "chat-43efa",
//                                storageBucket: "chat-43efa.appspot.com",
//                                messagingSenderId: "111021014435",
//                                appId: "1:111021014435:web:e7f8c001e86398165d2e16",
//                                measurementId: "G-N6JV4CVH84"
//                            };
                // Initialize Firebase
                qxnw.firebase.app = firebase.initializeApp(firebaseConfig);
//                firebase.analytics();

                qxnw.firebase.firestore = firebase.firestore();
                if (qxnw.firebase.persistence === true || qxnw.firebase.persistence === "true_double" || qxnw.firebase.persistence === "false_double") {
                    if (qxnw.firebase.persistence === "false_double") {
                        qxnw.firebase.app_two = firebase.initializeApp(firebaseConfig, "secondary");
                        qxnw.firebase.firestore_two = qxnw.firebase.app_two.firestore();
                    } else
                    if (qxnw.firebase.persistence === "true_double") {
                        qxnw.firebase.app_two = firebase.initializeApp(firebaseConfig, "secondary");
                        qxnw.firebase.firestore_two = qxnw.firebase.app_two.firestore();
                        qxnw.firebase.firestore_two.enablePersistence();
                    }
                    qxnw.firebase.firestore.enablePersistence({synchronizeTabs: true}).then(function (res) {
                    }).catch(function (err) {
                        console.log("ERROR IN enablePersistence FIREBASE:::err:::", err);
                        if (err.code == 'failed-precondition') {
                            console.log("Múltiples pestañas abiertas, la persistencia solo se puede habilitar en una pestaña a la vez.");
                        } else
                        if (err.code == 'unimplemented') {
                            console.log("El navegador actual no es compatible con todas las características requeridas para habilitar la persistencia");
                        }
                    });
                }
                callback();
                qxnw.firebase.loaded = true;
            }
        },
        initFirebaseAuth: function () {
            firebase.auth().onAuthStateChanged(qxnw.firebase.authStateObserver);
        },
        authStateObserver: function (user) {
            if (qxnw.utils.isDebug()) {
                console.log("user", user);
            }
//            var profilePicUrl = getProfilePicUrl();
//            var userName = getUserName();

            // Set the user's profile pic and name.
//                userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
//                userNameElement.textContent = userName;

            // Show user's profile and sign-out button.
//                userNameElement.removeAttribute('hidden');
//                userPicElement.removeAttribute('hidden');
//                signOutButtonElement.removeAttribute('hidden');

            // Hide sign-in button.
//                signInButtonElement.setAttribute('hidden', 'true');

            qxnw.saveMessagingDeviceToken();
        },
        execFirebase: function (callback) {
            if (typeof firebase === "undefined") {
                setTimeout(function () {
                    qxnw.firebase.execFirebase(callback);
                }, 100);
                return false;
            }
            if (typeof firebase.firestore === "undefined") {
                setTimeout(function () {
                    qxnw.firebase.execFirebase(callback);
                }, 100);
                return false;
            }
            return callback();
        },
        getDeviceToken: function (callback) {
            firebase.messaging().getToken().then(function (currentToken) {
                if (currentToken) {
                    callback(currentToken);
                } else {
                    requestNotificationsPermissions();
                }
            }).catch(function (error) {
                console.error('Unable to get messaging token.', error);
            });
        },
        saveMessagingDeviceToken: function (id, currentToken) {
            firebase.firestore().collection('fcmTokens').doc(currentToken).set({uid: id, token: currentToken});
        },
        sendNotificacion: function (array, callback) {
            var key = 'AAAAGdlePaM:APA91bHRnSqVwY6_DJaJ7jIyAXI8k8eoMx2j59qDbtsll4sw4G0vR-FpfB3uUe0GRQ-_pYmzYfu1BDbHHVI4n85D5JZBcbfAd19YOjCuwfJ8LN0Giy06V1QOVb8lK-InpbEztUyWK2im';
            var to = array.to;
            var notification = {
                'title': array.title,
                'body': array.body,
                'icon': array.icon,
                'sound': array.sound,
                'click_action': array.callback,
                'others': array.others
            };
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    'to': to,
                })
            }).then(function (response) {
                callback(response);
            }).catch(function (error) {
                console.error(error);
            });
        },
        select: function select(pr) {
            if (qxnw.utils.isDebug()) {
                console.log("firebase select", pr);
                console.log("firebase select table", pr.table);
            }
//            alert("firebase select " + pr.table)
            qxnw.firebase.execFirebase(function () {
                var limit = 100;
                if (qxnw.evalueData(pr.limit)) {
                    limit = pr.limit;
                }
                var order = false;
                var orderField = false;
                var orderAscDesc = false;
                if (qxnw.evalueData(pr.order)) {
                    order = pr.order;
                    orderField = pr.orderField;
                    orderAscDesc = pr.orderAscDesc;
                }
                var getModelData = false;
                if (pr.getModelData === true) {
                    getModelData = true;
                }
                var destroyQuery = false;
                if (pr.destroyQuery === true) {
                    destroyQuery = true;
                }
//                var response = function (snapshot, query) {
////                console.log("response:::snapshot", snapshot);
//                    var data = snapshot;
//                    if (getModelData === true) {
//                        data = modelData(snapshot, query);
//                    }
//                    if (destroyQuery) {
//                        query();
//                    }
//                    return pr.callback(data, snapshot, query, pr);
//                };

                var includeMetadataChanges = false;
                if (typeof pr.includeMetadataChanges !== "undefined") {
                    includeMetadataChanges = pr.includeMetadataChanges;
                }

//                var query = firebase.firestore();
                var query = qxnw.firebase.firestore;
                if (typeof pr.enablePersistence !== "undefined") {
                    if (!pr.enablePersistence) {
                        if (qxnw.firebase.persistence === "false_double") {
                            query = qxnw.firebase.firestore_two;
                        } else {
                            query = firebase.firestore();
                        }
                    }
                }

                query = query.collection(pr.table);

                if (qxnw.evalueData(pr.where)) {
                    query = query.where(pr.where[0], pr.where[1], pr.where[2]);
                }
                if (qxnw.evalueData(pr.where2)) {
                    query = query.where(pr.where2[0], pr.where2[1], pr.where2[2]);
                }
                if (qxnw.evalueData(pr.where3)) {
                    query = query.where(pr.where3[0], pr.where3[1], pr.where3[2]);
                }
                if (order == true && qxnw.evalueData(orderField) && qxnw.evalueData(orderAscDesc)) {
                    query = query.orderBy(orderField, orderAscDesc);
                }
                if (qxnw.evalueData(pr.orderField2)) {
                    query = query.orderBy(pr.orderField2[0], pr.orderField2[1]);
                }
                if (qxnw.evalueData(pr.startAt)) {
                    query = query.startAt(pr.startAt).endAt(pr.startAt + '\uf8ff');
                }
                if (qxnw.evalueData(pr.lastVisible)) {
                    query = query.startAfter(pr.lastVisible);
                }
                if (qxnw.evalueData(pr.free)) {
                    query = query.free;
                }
                query = query.limit(limit);
                query = query.onSnapshot({includeMetadataChanges: includeMetadataChanges}, function (snapshot) {
//                    response(snapshot, query);
                    var data = snapshot;
                    if (getModelData === true) {
                        data = modelData(snapshot, query);
                    }
//                    setTimeout(function () {
//                        pr.callback(data, snapshot, query, pr);
//                        if (destroyQuery) {
//                            query();
//                        }
//                    }, 500);
                    if (destroyQuery) {
                        query();
                    }
                    return pr.callback(data, snapshot, query, pr);
                });

                function modelData(snapshot, query) {
                    var data = [];
                    data.query = query;
                    snapshot.forEach(function (dat) {
                        var reg = dat.data();
//                    console.log("dat", dat);
//                    console.log("reg", reg);
                        if (qxnw.evalueData(reg.datos)) {
                            data.push(reg.datos);
                        } else {
                            data.push(reg);
                        }
                    });
                    return data;
                }
            });
        },
        add: function add() {
        },
        serverTimestamp: function serverTimestamp() {
            return qxnw.firebase.execFirebase(function () {
                return firebase.firestore.FieldValue.serverTimestamp();
            });
        },
        arrayUnion: function arrayUnion(texto) {
            return qxnw.firebase.execFirebase(function () {
                return firebase.firestore.FieldValue.arrayUnion(texto);
            });
        },
        set: function set(data) {
            qxnw.firebase.execFirebase(function () {
//                firebase.firestore().collection(data.collection).doc(data.document).set(data);
                qxnw.firebase.firestore.collection(data.collection).doc(data.document).set(data);
            });
        },
        update: function update(data) {
            qxnw.firebase.execFirebase(function () {
                qxnw.firebase.firestore.collection(data.collection).doc(data.document).update(data.fields).then(function () {
//                firebase.firestore().collection(data.collection).doc(data.document).update(data.fields).then(function () {
                    if (qxnw.utils.isDebug())
                        console.log("FIREBASE::UPDATE:: collection: " + data.collection + " document: " + data.document);

                    if (qxnw.evalueData(data.callback)) {
                        if (typeof data.callback === "function")
                            data.callback(data);
                    }
                }).catch(function (error) {
                    console.error("Error writing document: ", error, data);
                    if (qxnw.evalueData(data.callback)) {
                        data.callback(false, data, error);
                    }
                });
            });
        },
        insert: function insert(data) {
            qxnw.firebase.execFirebase(function () {
                qxnw.firebase.firestore.collection(data.collection).add(data).then(function () {
//                return firebase.firestore().collection(data.collection).add(data).then(function () {
                    if (qxnw.utils.isDebug())
                        console.log("FIREBASE::INSERT::Document successfully insert!", data);
                    if (qxnw.evalueData(data.callback)) {
                        if (typeof data.callback === "function")
                            data.callback(true, data);
                    }
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                    if (qxnw.evalueData(data.callback)) {
                        if (typeof data.callback === "function")
                            data.callback(false, data);
                    }
                });
            });
        },
        remove: function remove(data) {
            qxnw.firebase.execFirebase(function () {
                qxnw.firebase.firestore.collection(data.collection).doc(data.document).delete().then(function () {
//                firebase.firestore().collection(data.collection).doc(data.document).delete().then(function () {
                    if (qxnw.utils.isDebug())
                        console.log("FIREBASE::REMOVE::Document successfully deleted!", data);
                    if (qxnw.evalueData(data.callback)) {
                        if (typeof data.callback === "function")
                            data.callback(true, data);
                    }
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                    if (qxnw.evalueData(data.callback)) {
                        if (typeof data.callback === "function")
                            data.callback(false, data);
                    }
                });
            });
        }
    }
});