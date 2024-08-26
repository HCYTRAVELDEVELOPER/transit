var appTask = {
    usersRoom: [],
    usersRoomDetalle: [],
    idTask: "NONE",
    init: function () {
        var self = this;
        var get = self.getGET();
        var up = self.getUserData();
        var host = window.location.hostname;
        var firebaseConfig = {
            //refinancia
            apiKey: "AIzaSyC3VBxbBHOt_XrIqD8SDk8MZ_nND8XtpaA",
            authDomain: "chat-refinancia.firebaseapp.com",
            projectId: "chat-refinancia",
            storageBucket: "chat-refinancia.appspot.com",
            messagingSenderId: "784427717452",
            appId: "1:784427717452:web:67d4f852a6492c647ef5e9"
        };
        var usenw = false;
        if (typeof up !== "undefined") {
            if (typeof up.empresa !== "undefined") {
                if (up.empresa.toString() === "1") {
                    usenw = true;
                }
            }
        }
        if (get) {
            if (get.terminal === "1") {
                usenw = true;
            }
        }
        if (usenw) {
            //producción nw
            var firebaseConfig = {
                apiKey: "AIzaSyBYFSGZ4dcrxCpa6K1-nbGJs3DcDfpmi6k",
                authDomain: "chat-43efa.firebaseapp.com",
                databaseURL: "https://chat-43efa.firebaseio.com",
                projectId: "chat-43efa",
                storageBucket: "chat-43efa.appspot.com",
                messagingSenderId: "111021014435",
                appId: "1:111021014435:web:e7f8c001e86398165d2e16",
                measurementId: "G-N6JV4CVH84"
            };
        }
        if (host === "localhost" || host === "localhost:8383" || host === "192.168.10.19") {
            //pruebas
            var firebaseConfig = {
                apiKey: "AIzaSyC1ZZdP1KLUW5xB0NiZlEqavdg7TlrDNK8",
                authDomain: "chat-test-c220f.firebaseapp.com",
                databaseURL: "https://chat-test-c220f-default-rtdb.firebaseio.com",
                projectId: "chat-test-c220f",
                storageBucket: "chat-test-c220f.appspot.com",
                messagingSenderId: "652497765599",
                appId: "1:652497765599:web:725707540bb84a6ef0956a"
            };
        }

        firebase.initializeApp(firebaseConfig);

        var db = firebase.firestore();

        var host = window.location.host;
        var protocol = window.location.protocol;

        //insert
        var horaSola = self.getActualHour();
        var fechaSola = self.getActualDate();
        var fecha = self.getActualFullDate();
        var fechaUltimaInteraccion = self.getActualFullDate();

        //select
        var myuser = document.body.getAttribute("data-email");
        var myname = document.body.getAttribute("data-name");
        var myphoto = document.body.getAttribute("data-photo");
        var terminal = document.body.getAttribute("data-terminal");
        var id_usuario = false;
        if (typeof get.id_usuario !== "undefined") {
            id_usuario = get.id_usuario;
        }
        if (typeof get.terminal !== "undefined") {
            terminal = get.terminal;
        }
        if (typeof get.user !== "undefined") {
            myuser = get.user;
        }
        if (typeof get.name !== "undefined") {
            myname = get.name;
        }
        if (typeof get.photo !== "undefined") {
            myphoto = get.photo;
        }
        if (myuser === null || myuser === "") {
            myuser = "Invitado";
        }

        //valida por up
        if (typeof up.id_usuario !== "undefined") {
            id_usuario = up.id_usuario;
        }
        if (typeof up.terminal !== "undefined") {
            terminal = up.terminal;
        }
        if (typeof up.usuario !== "undefined") {
            myuser = up.usuario;
        }
        if (typeof up.nombre !== "undefined") {
            myname = up.nombre;
        }
        if (typeof up.foto_perfil !== "undefined") {
            myphoto = protocol + "//" + host + "/" + up.foto_perfil;
        }

        if (myuser === null || myuser === "") {
            myuser = "Invitado";
        }
        myname = startName;

        self.terminal = terminal;
        self.myphoto = myphoto;
        self.myuser = myuser;
        self.myname = myname;
        self.id_usuario = id_usuario;
        self.room = get.room;


        //        db.collection("videollamadas").doc(self.room).set({
//            data: "Alexander Flórez",
//            room: self.room,
//            fecha: fecha
//        });

//
//        var citiesRef = db.collection('videollamadas');
//        var landmarks = Promise.all([
//            citiesRef.doc(self.room).collection('usuarios').doc().set({
//                name: 'Alexander',
//                type: 'no sé'
//            })
//        ]);
//        return;

        var users = Array();
        var usersDetalle = Array();
        var insert = false;
        var update = false;
        var query = db.collection("videollamadas").where("room", "==", self.room);
        query.onSnapshot(function (snapshot) {
            console.log("snapshot.empty", snapshot.empty);

            snapshot.forEach(function (dat) {
                var reg = dat.data();
                console.log("reg", reg);
                fecha = reg.fecha;
                fechaSola = reg.fechaSola;
                horaSola = reg.horaSola;
                users = Array();
                for (var i = 0; i < reg.users.length; i++) {
                    if (reg.users[i] !== myuser) {
                        users.push(reg.users[i]);
                    }
                }
                usersDetalle = Array();
                for (var i = 0; i < reg.usersDetalle.length; i++) {
                    if (reg.usersDetalle[i].usuario !== myuser) {
                        usersDetalle.push({
                            nombre: reg.usersDetalle[i].nombre,
                            usuario: reg.usersDetalle[i].usuario,
                            photo: reg.usersDetalle[i].photo,
                            fechaUltimaInteraccion: reg.usersDetalle[i].fechaUltimaInteraccion
                        });
                    }
                }
            });

            if (snapshot.empty === true) {
                if (!insert) {
                    users.push(myuser);
                    usersDetalle.push({
                        nombre: myname,
                        usuario: myuser,
                        photo: myphoto,
                        fechaUltimaInteraccion: fechaUltimaInteraccion
                    });
                    db.collection("videollamadas").doc(self.room).set({
                        terminal: terminal,
                        room: self.room,
                        fecha: fecha,
                        fechaUltimaInteraccion: fechaUltimaInteraccion,
                        fechaSola: fechaSola,
                        horaSola: horaSola,
                        users: users,
                        usersDetalle: usersDetalle
                    });
                }
                insert = true;
            } else {
                if (!update && !insert) {
                    usersFinal = users;
                    users.push(myuser);
                    usersDetalle.push({
                        nombre: myname,
                        usuario: myuser,
                        photo: myphoto,
                        fechaUltimaInteraccion: fechaUltimaInteraccion
                    });
                    db.collection("videollamadas").doc(self.room).set({
                        terminal: terminal,
                        room: self.room,
                        fecha: fecha,
                        fechaUltimaInteraccion: fechaUltimaInteraccion,
                        fechaSola: fechaSola,
                        horaSola: horaSola,
                        users: users,
                        usersDetalle: usersDetalle
                    });
                }
                insert = true;
                update = true;
            }

            self.usersRoom = users;
            self.usersRoomDetalle = usersDetalle;
            self.save();
        });

        var minutes = 2;
        var second = 60;
        var time = second * (minutes * 1000);
//        var time = 10000;
//        var num = 0;
//        setInterval(function () {
//            num++;
//            console.log(num);
//        }, 1000);
        var interval = setInterval(function () {
            var fechaUltimaInteraccion = self.getActualFullDate();
            users.push(myuser);
            usersDetalle.push({
                nombre: myname,
                usuario: myuser,
                photo: myphoto,
                fechaUltimaInteraccion: fechaUltimaInteraccion
            });
            db.collection("videollamadas").doc(self.room).set({
                terminal: terminal,
                room: self.room,
                fecha: fecha,
                fechaUltimaInteraccion: fechaUltimaInteraccion,
                fechaSola: fechaSola,
                horaSola: horaSola,
                users: users,
                usersDetalle: usersDetalle
            });

            self.usersRoom = users;
            self.usersRoomDetalle = usersDetalle;
            self.save();

        }, time);

        return;





//        var query = firebase.firestore().collection("videollamadas").where("usuarios", "array-contains", up.usuario).orderBy('fecha', 'desc');
//        var query = firebase.firestore().collection("videollamadas");
        var query = firebase.firestore().collection("videollamadas").where("room", "==", self.room);
        console.log("query", query);
        query.onSnapshot(function (snapshot) {
            console.log("snapshot", snapshot);
            snapshot.docChanges().forEach(function (change) {
                var token = change.doc.data();
                console.log("token", token);
//                firebase.firestore().collection(nameTableTokens).doc(currentToken).set({uid: usuario_cliente, token: currentToken});
//                   
//                firebase.firestore().collection(self.room).doc(token.room).set({data: "Pedro"});
//                firebase.firestore().collection("videollamadas").doc(token.room).set({data: "Pedro"});
            });
        });
//        return;
    },
    getUserData: function () {
        return localStorage;
    },
    getGET: function (url) {
        var loc = document.location.href;
        if (typeof url !== "undefined") {
            loc = url;
        }
        var getString = loc.split('?')[1];
        if (getString == undefined) {
            return false;
        }
        var GET = getString.split('&');
        var get = {};
        for (var i = 0, l = GET.length; i < l; i++) {
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return get;
    },
    getActualDate: function (format) {
        var self = this;
        var d = new Date();
        var day = self.addZero(d.getDate());
        var month = self.addZero(d.getMonth() + 1);
        var year = self.addZero(d.getFullYear());
        return year + "-" + month + "-" + day;
    },
    addZero: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    getActualHour: function (format) {
        var self = this;
        var d = new Date();
        var h = self.addZero(d.getHours());
        var m = self.addZero(d.getMinutes());
        var s = self.addZero(d.getSeconds());
        if (format == "datetime-local") {
            return h + ":" + m;
        }
        return h + ":" + m + ":" + s;
    },
    getActualFullDate: function (format) {
        var self = this;
        var hoy = self.getActualDate(format);
        var hour = self.getActualHour(format);
        if (format == "datetime-local") {
            return hoy + "T" + hour;
        }
        return hoy + " " + hour;
    },
    saveInit: false,
    save: function () {
        var self = this;
        if (self.saveInit === true) {
            return false;
        }
        self.saveInit = true;
        var data = {};
        data.terminal = self.terminal;
        data.foto = self.myphoto;
        data.usuario = self.myuser;
        data.username = self.myname;
        data.id_usuario = self.id_usuario;
        data.id_tarea = self.idTask;
        data.room = self.room;
        data.users = JSON.stringify(self.usersRoom);
        data.usersDetalle = JSON.stringify(self.usersRoomDetalle);
        if (!self.id_usuario) {
            return false;
        }
//        console.log("data", data);
        var rpc = {};
        rpc.service = "nwMaker";
        rpc.method = "saveVideollamadaInTaskCalendar";
        rpc.data = data;
        rpc.server_data = {};
        rpc.server_data.key = "nwcaf2323";
        $.ajax({
            type: "POST",
            url: "/nwlib6/nwproject/modules/nw_user_session/src/rpcNw.php",
            data: rpc,
            dataType: "json",
            async: true,
            cache: true,
            error: function (e) {
                console.log("Error", e);
//                alert("ERROR");
            },
            success: function (data) {
                console.log("success", data);
                self.saveInit = false;
                self.idTask = data;
            }
        });
    }
};

//appTask.init();