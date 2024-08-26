var wnwEmoji = {
    debug: false,
    messageBox: wnw.messageInputElement,
    arrayRecentEmoji: [],
    createBtnEmojis: function () {
        var self = this;
        if (wnwUtils.evalueData(window.localStorage.getItem("arrayRecentEmoji"))) {
            self.arrayRecentEmoji = JSON.parse(window.localStorage.getItem("arrayRecentEmoji"));
        }

        if (self.debug)
            console.log("start create emoji");

        self.containerEmojis = document.createElement("div");
        self.containerEmojis.className = "containerEmojis";
        wnw.contentChat.appendChild(self.containerEmojis);

        self.containerEmojisEncBtns = document.createElement("div");
        self.containerEmojisEncBtns.className = "containerEmojisEncBtns";
        self.containerEmojis.appendChild(self.containerEmojisEncBtns);

        self.btnCloseEmojis = document.createElement("button");
        self.btnCloseEmojis.className = "btnEmojisSel btnCloseEmojis";
        self.btnCloseEmojis.innerHTML = "<i class='material-icons'>close</i>";
        self.btnCloseEmojis.onclick = function () {
            wnwUtils.removeClass(self.containerEmojis, "containerEmojis_show", true);
        };
        self.containerEmojisEncBtns.appendChild(self.btnCloseEmojis);

        self.btnEmojisSelEmoji = document.createElement("button");
        self.btnEmojisSelEmoji.className = "btnEmojisSel btnEmojisSelEmoji";
        self.btnEmojisSelEmoji.innerHTML = "<i class='material-icons'>insert_emoticon</i>";
        self.btnEmojisSelEmoji.onclick = function () {
            self.openEmojis("img");
        };
        self.containerEmojisEncBtns.appendChild(self.btnEmojisSelEmoji);

        self.btnEmojisSelGif = document.createElement("button");
        self.btnEmojisSelGif.className = "btnEmojisSel btnEmojisSelGif";
        self.btnEmojisSelGif.innerHTML = "<i class='material-icons'>gif</i>";
        self.btnEmojisSelGif.onclick = function () {
            self.openEmojis("gif");
        };
        self.containerEmojisEncBtns.appendChild(self.btnEmojisSelGif);

        self.containerEmojisIntRecent = document.createElement("div");
        self.containerEmojisIntRecent.className = "containerEmojisIntRecent";
        self.containerEmojis.appendChild(self.containerEmojisIntRecent);

        self.containerEmojisInt = document.createElement("div");
        self.containerEmojisInt.className = "containerEmojisInt";
        self.containerEmojis.appendChild(self.containerEmojisInt);

    },
    openEmojis: function (tipo) {
        var self = this;
        wnwUtils.addClass(self.containerEmojis, "containerEmojis_show");
        if (!wnwUtils.evalueData(tipo)) {
            tipo = "img";
        }

        if (self.debug)
            console.log("Open emojis type ", tipo);

        self.sendGifOrImage = tipo;
        var totalreci = self.arrayRecentEmoji.length;
        self.containerEmojisIntRecent.innerHTML = "<div class='titleemoj'>Recientes</div> No hay recientes...";
        if (totalreci > 0) {
            var sum = 0;
            var html = "";
            var type = "";
            var endht = [];
            for (var i = 0; i < totalreci; i++) {
                var le = self.arrayRecentEmoji[i];
                if (wnwUtils.evalueData(le.emoji)) {
                    if (le.type === tipo) {
                        var t = le.emoji;
                        if (le.type === "gif") {
                            t = t.replace("(", "");
                            t = t.replace(")", "");
                        }
                        var emo = self.replaceEmojis(t, false);
                        if (emo.indexOf("<span") !== -1) {
                            html += emo;
                            endht.push(emo);
                            type = le.type;
                            sum++;
                        }
                    }
                }
            }
            if (sum > 0) {
                endht.reverse();
                var limit = 8;
                var ht = "";
                for (var x = 0; x < endht.length; x++) {
                    ht += endht[x];
                    if (x + 1 >= limit) {
                        break;
                    }
                }
                self.containerEmojisIntRecent.innerHTML = "<div class='titleemoj'>Recientes</div>" + ht;
                wnwUtils.addClass(self.containerEmojisInt, "emojis_type_" + type);
            }
        }

        if (self.debug)
            console.log("create emoji recent", self.arrayRecentEmoji);

        self.getAllEmoji(function (r) {
            self.containerEmojisInt.innerHTML = r;

            var ems = self.containerEmojis.querySelectorAll(".em");
            for (var i = 0; i < ems.length; i++) {
                var em = ems[i];
                em.addEventListener("click", function (event) {
                    var data = this.getAttribute("data");
                    var box = wnw.messageInputElement;
                    var message = box.innerHTML + data;
                    message = self.replaceEmojis(message, true);
                    box.innerHTML = message;
                    box.focus();

                    wnw.cursorMoveEnd();

                    if (self.debug)
                        console.log("click in emoji", data, message);

                    wnwUtils.removeClass(self.containerEmojis, "containerEmojis_show", true);
                    if (self.sendGifOrImage === "gif") {
                        wnw.onMessageFormSubmit();
//                    self.showHiddenPlaceholderMessageBox();
                    }

                    var add = true;
                    for (var x = 0; x < self.arrayRecentEmoji.length; x++) {
                        if (wnwUtils.evalueData(self.arrayRecentEmoji[x].emoji)) {
                            if (self.arrayRecentEmoji[x].emoji.indexOf(data) !== -1) {
                                add = false;
                            }
                        }
                    }
                    if (add) {
                        self.arrayRecentEmoji.push({emoji: data, type: tipo});
                    }
                    self.arrayRecentEmoji = wnwUtils.removeDuplicates(self.arrayRecentEmoji, "emoji");
                    var arrayPromosSee = JSON.stringify(self.arrayRecentEmoji);
                    window.localStorage.setItem("arrayRecentEmoji", arrayPromosSee);

                });
            }
        });

    },
    replaceEmoji: function (name, texto, par, gif, imgWidget) {
        var self = this;
        var r = name;
        if (par === true) {
            r = "\(" + name + "\)";
        }
        return wnwUtils.str_replace(r, self.getEmoji(name, par, gif, true, imgWidget), texto);
    },
    replaceEmojis: function (texto, imgWidget) {
        var self = this;
        if (self.debug)
            console.log("texto", texto)
//        texto = texto.replace(/:\)/g, self.getEmoji(":)", "smiley", false, false, imgWidget));
//        texto = texto.replace(/:-\)/g, self.getEmoji(":)", "smiley", false, false, imgWidget));

        texto = self.replaceEmoji(":d", texto, "open_mouth", false, false, imgWidget);
//        texto = self.replaceEmoji(":D", texto, "smile", false, false, imgWidget);
//        texto = self.replaceEmoji(":-D", texto, "smile", false, false, imgWidget);
        texto = self.replaceEmoji(":o", texto, "open_mouth", false, false, imgWidget);
        texto = self.replaceEmoji(":-O", texto, "open_mouth", false, false, imgWidget);
        texto = self.replaceEmoji(":p", texto, "stuck_out_tongue", false, false, imgWidget);
        texto = self.replaceEmoji(":P", texto, "stuck_out_tongue", false, false, imgWidget);
        texto = self.replaceEmoji(":-P", texto, "stuck_out_tongue", false, false, imgWidget);

        texto = texto.replace(/;\)/g, self.getEmoji(";)", "wink", false, false, imgWidget));
        texto = texto.replace(/;-\)/g, self.getEmoji(";)", "wink", false, false, imgWidget));
        texto = texto.replace(/:\(/g, self.getEmoji(":(", "disappointed", false, false, imgWidget));
        texto = texto.replace(/:-\(/g, self.getEmoji(":(", "disappointed", false, false, imgWidget));
        texto = texto.replace(/B-\)/g, self.getEmoji("B-)", "sunglasses", false, false, imgWidget));

        texto = texto.replace(/\(rda_feliz\)/g, self.getEmoji("rda_feliz", true, false, true, imgWidget));
        texto = texto.replace(/\(green_heart\)/g, self.getEmoji("green_heart", true, false, true, imgWidget));
        texto = texto.replace(/\(rda_gaf\)/g, self.getEmoji("rda_gaf", true, false, true, imgWidget));
        texto = texto.replace(/\(emojiThking_50\)/g, self.getEmoji("emojiThking_50", true, false, true, imgWidget));
        texto = texto.replace(/\(taskenter_rocket\)/g, self.getEmoji("taskenter_rocket", true, false, true, imgWidget));
        texto = texto.replace(/\(rda_ok\)/g, self.getEmoji("rda_ok", true, false, true, imgWidget));
        texto = texto.replace(/\(happyface\)/g, self.getEmoji("happyface", true, false, true, imgWidget));
        texto = texto.replace(/\(happyface2\)/g, self.getEmoji("happyface2", true, false, true, imgWidget));
        texto = texto.replace(/\(flushed\)/g, self.getEmoji("flushed", true, false, true, imgWidget));
        texto = texto.replace(/\(scream\)/g, self.getEmoji("scream", true, false, true, imgWidget));
        texto = texto.replace(/\(sob\)/g, self.getEmoji("sob", true, false, true, imgWidget));
        texto = texto.replace(/\(sleeping\)/g, self.getEmoji("sleeping", true, false, true, imgWidget));
        texto = texto.replace(/\(sleepy\)/g, self.getEmoji("sleepy", true, false, true, imgWidget));
        texto = texto.replace(/\(anguished\)/g, self.getEmoji("anguished", true, false, true, imgWidget));
        texto = texto.replace(/\(baby_chick\)/g, self.getEmoji("baby_chick", true, false, true, imgWidget));
        texto = texto.replace(/\(blush\)/g, self.getEmoji("blush", true, false, true, imgWidget));
        texto = texto.replace(/\(bowtie\)/g, self.getEmoji("bowtie", true, false, true, imgWidget));
        texto = texto.replace(/\(angry\)/g, self.getEmoji("angry", true, false, true, imgWidget));
        texto = texto.replace(/\(cold_sweat\)/g, self.getEmoji("cold_sweat", true, false, true, imgWidget));
        texto = texto.replace(/\(confounded\)/g, self.getEmoji("confounded", true, false, true, imgWidget));
        texto = texto.replace(/\(confused\)/g, self.getEmoji("confused", true, false, true, imgWidget));
        texto = texto.replace(/\(dizzy_face\)/g, self.getEmoji("dizzy_face", true, false, true, imgWidget));
        texto = texto.replace(/\(frowning\)/g, self.getEmoji("frowning", true, false, true, imgWidget));
        texto = texto.replace(/\(grin\)/g, self.getEmoji("grin", true, false, true, imgWidget));
        texto = texto.replace(/\(grimacing\)/g, self.getEmoji("grimacing", true, false, true, imgWidget));
        texto = texto.replace(/\(heart_eyes\)/g, self.getEmoji("heart_eyes", true, false, true, imgWidget));
        texto = texto.replace(/\(imp\)/g, self.getEmoji("imp", true, false, true, imgWidget));
        texto = texto.replace(/\(innocent\)/g, self.getEmoji("innocent", true, false, true, imgWidget));
        texto = texto.replace(/\(joy\)/g, self.getEmoji("joy", true, false, true, imgWidget));
        texto = texto.replace(/\(kissing_closed_eyes\)/g, self.getEmoji("kissing_closed_eyes", true, false, true, imgWidget));
        texto = texto.replace(/\(kissing_heart\)/g, self.getEmoji("kissing_heart", true, false, true, imgWidget));
        texto = texto.replace(/\(mask\)/g, self.getEmoji("mask", true, false, true, imgWidget));
        texto = texto.replace(/\(neutral_face\)/g, self.getEmoji("neutral_face", true, false, true, imgWidget));
        texto = texto.replace(/\(worried\)/g, self.getEmoji("worried", true, false, true, imgWidget));
        texto = texto.replace(/\(persevere\)/g, self.getEmoji("persevere", true, false, true, imgWidget));
        texto = texto.replace(/\(rage\)/g, self.getEmoji("rage", true, false, true, imgWidget));
        texto = texto.replace(/\(relaxed\)/g, self.getEmoji("relaxed", true, false, true, imgWidget));
        texto = texto.replace(/\(stuck_out_tongue_winking_eye\)/g, self.getEmoji("stuck_out_tongue_winking_eye", true, false, true, imgWidget));
        texto = texto.replace(/\(sweat\)/g, self.getEmoji("sweat", true, false, true, imgWidget));
//        texto = texto.replace(/\(sweat_smile\)/g, self.getEmoji("sweat_smile", true, false, true, imgWidget));
        texto = texto.replace(/\(sweat_facehappy\)/g, self.getEmoji("sweat_facehappy", true, false, true, imgWidget));
        texto = texto.replace(/\(tired_face\)/g, self.getEmoji("tired_face", true, false, true, imgWidget));
        texto = texto.replace(/\(triumph\)/g, self.getEmoji("triumph", true, false, true, imgWidget));
        texto = texto.replace(/\(unamused\)/g, self.getEmoji("unamused", true, false, true, imgWidget));
        texto = texto.replace(/\(yum\)/g, self.getEmoji("yum", true, false, true, imgWidget));
        texto = texto.replace(/\(y\)/g, self.getEmoji("(y)", "--1", false, true, imgWidget));
        texto = texto.replace(/\(it_is_not_like\)/g, self.getEmoji("it_is_not_like", true, false, true, imgWidget));
        texto = texto.replace(/\(ok_hand\)/g, self.getEmoji("ok_hand", true, false, true, imgWidget));
        texto = texto.replace(/\(wave\)/g, self.getEmoji("wave", true, false, true, imgWidget));
        texto = texto.replace(/\(v\)/g, self.getEmoji("v", true, false, true, imgWidget));
        texto = texto.replace(/\(thumbsdown\)/g, self.getEmoji("thumbsdown", true, false, true, imgWidget));
        texto = texto.replace(/\(zap\)/g, self.getEmoji("zap", true, false, true, imgWidget));
        texto = texto.replace(/\(snail\)/g, self.getEmoji("snail", true, false, true, imgWidget));
        texto = texto.replace(/\(shaved_ice\)/g, self.getEmoji("shaved_ice", true, false, true, imgWidget));
        texto = texto.replace(/\(older_man\)/g, self.getEmoji("older_man", true, false, true, imgWidget));
        texto = texto.replace(/\(art\)/g, self.getEmoji("art", true, false, true, imgWidget));
        texto = texto.replace(/\(bow\)/g, self.getEmoji("bow", true, false, true, imgWidget));
        texto = texto.replace(/\(bulb\)/g, self.getEmoji("bulb", true, false, true, imgWidget));
        texto = texto.replace(/\(dancers\)/g, self.getEmoji("dancers", true, false, true, imgWidget));
        texto = texto.replace(/\(eyes\)/g, self.getEmoji("eyes", true, false, true, imgWidget));
        texto = texto.replace(/\(envelope\)/g, self.getEmoji("envelope", true, false, true, imgWidget));
        texto = texto.replace(/\(grey_question\)/g, self.getEmoji("grey_question", true, false, true, imgWidget));
        texto = texto.replace(/\(heavy_check_mark\)/g, self.getEmoji("heavy_check_mark", true, false, true, imgWidget));
        texto = texto.replace(/\(honeybee\)/g, self.getEmoji("honeybee", true, false, true, imgWidget));
        texto = texto.replace(/\(japanese_goblin\)/g, self.getEmoji("japanese_goblin", true, false, true, imgWidget));
        texto = texto.replace(/\(umbrella\)/g, self.getEmoji("umbrella", true, false, true, imgWidget));
        texto = texto.replace(/\(metal\)/g, self.getEmoji("metal", true, false, true, imgWidget));
        texto = texto.replace(/\(monkey\)/g, self.getEmoji("monkey", true, false, true, imgWidget));
        texto = texto.replace(/\(monkey_face\)/g, self.getEmoji("monkey_face", true, false, true, imgWidget));
        texto = texto.replace(/\(moneybag\)/g, self.getEmoji("moneybag", true, false, true, imgWidget));
        texto = texto.replace(/\(pray\)/g, self.getEmoji("pray", true, false, true, imgWidget));
        texto = texto.replace(/\(ear\)/g, self.getEmoji("ear", true, false, true, imgWidget));
        texto = texto.replace(/\(facepunch\)/g, self.getEmoji("facepunch", true, false, true, imgWidget));
        texto = texto.replace(/\(first_quarter_moon_with_face\)/g, self.getEmoji("first_quarter_moon_with_face", true, false, true, imgWidget));
        texto = texto.replace(/\(fries\)/g, self.getEmoji("fries", true, false, true, imgWidget));
        texto = texto.replace(/\(clap\)/g, self.getEmoji("clap", true, false, true, imgWidget));
        texto = texto.replace(/\(hear_no_evil\)/g, self.getEmoji("hear_no_evil", true, false, true, imgWidget));
        texto = texto.replace(/\(see_no_evil\)/g, self.getEmoji("see_no_evil", true, false, true, imgWidget));
        texto = texto.replace(/\(zzz\)/g, self.getEmoji("zzz", true, false, true, imgWidget));


        var arraye = self.arrayEmojis();
        var tot = arraye.length;
        for (var i = 0; i < tot; i++) {
            var ra = arraye[i];
//            texto = texto.replace(ra.name, self.getEmoji(ra.name, ra.img, ra.gif, ra.lectura, ra.imgWidget, ra.imagen));
            texto = texto.replace(ra.name, self.getEmoji(ra.name, false, true, true, true, ra.imagen));
        }
        return texto;
    },
    getAllEmoji: function (callback) {
        var self = this;
        var html = "";
        var gif = self.sendGifOrImage;
        if (gif === "gif") {
            var arraye = self.arrayEmojis();
            var tot = arraye.length;
            for (var i = 0; i < tot; i++) {
                var ra = arraye[i];
                html += self.getEmoji(ra.name, false, true, true, true, ra.imagen);
//                html += self.getEmoji(ra.name, ra.img, ra.gif, ra.lectura, ra.imgWidget, ra.imagen);
            }
            if (typeof callback !== "undefined") {
                callback(html);
            }
            return html;
        }
//        html += self.getEmoji(":)", "smiley");
        html += self.getEmoji("happyface", true);
        html += self.getEmoji("happyface2", true);
//        html += self.getEmoji(":d", "smile");
        html += self.getEmoji(":o", "open_mouth");
        html += self.getEmoji(":p", "stuck_out_tongue");
        html += self.getEmoji(";)", "wink");
        html += self.getEmoji(":(", "disappointed");
        html += self.getEmoji("B-)", "sunglasses");
        html += self.getEmoji("emojiThking_50", true);
        html += self.getEmoji("taskenter_rocket", true);
        html += self.getEmoji("rda_ok", true);
        html += self.getEmoji("rda_gaf", true);
        html += self.getEmoji("green_heart", true);
        html += self.getEmoji("rda_feliz", true);
        html += self.getEmoji("cry", true);
        html += self.getEmoji("flushed", true);
        html += self.getEmoji("scream", true);
        html += self.getEmoji("sob", true);
        html += self.getEmoji("sleeping", true);
        html += self.getEmoji("sleepy", true);
        html += self.getEmoji("anguished", true);
        html += self.getEmoji("baby_chick", true);
        html += self.getEmoji("blush", true);
        html += self.getEmoji("bowtie", true);
        html += self.getEmoji("angry", true);
        html += self.getEmoji("cold_sweat", true);
        html += self.getEmoji("confounded", true);
        html += self.getEmoji("confused", true);
        html += self.getEmoji("dizzy_face", true);
        html += self.getEmoji("frowning", true);
        html += self.getEmoji("grin", true);
        html += self.getEmoji("grimacing", true);
        html += self.getEmoji("heart_eyes", true);
        html += self.getEmoji("imp", true);
        html += self.getEmoji("innocent", true);
        html += self.getEmoji("joy", true);
        html += self.getEmoji("kissing_closed_eyes", true);
        html += self.getEmoji("kissing_heart", true);
        html += self.getEmoji("mask", true);
        html += self.getEmoji("neutral_face", true);
        html += self.getEmoji("worried", true);
        html += self.getEmoji("persevere", true);
        html += self.getEmoji("rage", true);
        html += self.getEmoji("relaxed", true);
        html += self.getEmoji("stuck_out_tongue_winking_eye", true);
        html += self.getEmoji("sweat", true);
//        html += self.getEmoji("sweat_smile", true);
        html += self.getEmoji("sweat_facehappy", true);
        html += self.getEmoji("tired_face", true);
        html += self.getEmoji("triumph", true);
        html += self.getEmoji("unamused", true);
        html += self.getEmoji("yum", true);
        html += self.getEmoji("(y)", "--1");
        html += self.getEmoji("ok_hand", true);
        html += self.getEmoji("it_is_not_like", true);
        html += self.getEmoji("wave", true);
        html += self.getEmoji("v", true);
        html += self.getEmoji("thumbsdown", true);
        html += self.getEmoji("zap", true);
        html += self.getEmoji("snail", true);
        html += self.getEmoji("shaved_ice", true);
        html += self.getEmoji("older_man", true);
        html += self.getEmoji("art", true);
        html += self.getEmoji("bow", true);
        html += self.getEmoji("bulb", true);
        html += self.getEmoji("dancers", true);
        html += self.getEmoji("eyes", true);
        html += self.getEmoji("envelope", true);
        html += self.getEmoji("grey_question", true);
        html += self.getEmoji("heavy_check_mark", true);
        html += self.getEmoji("honeybee", true);
        html += self.getEmoji("japanese_goblin", true);
        html += self.getEmoji("umbrella", true);
        html += self.getEmoji("metal", true);
        html += self.getEmoji("monkey", true);
        html += self.getEmoji("monkey_face", true);
        html += self.getEmoji("moneybag", true);
        html += self.getEmoji("pray", true);
        html += self.getEmoji("ear", true);
        html += self.getEmoji("facepunch", true);
        html += self.getEmoji("first_quarter_moon_with_face", true);
        html += self.getEmoji("fries", true);
        html += self.getEmoji("clap", true);
        html += self.getEmoji("hear_no_evil", true);
        html += self.getEmoji("see_no_evil", true);
        html += self.getEmoji("zzz", true);
        if (typeof callback !== "undefined") {
            callback(html);
        }
        return html;
    },
    getEmoji: function (name, img, gif, lectura, imgWidget, urlimagen) {
        var nameclean = name;
        if (img === true && imgWidget !== true) {
            img = name;
            if (!gif)
                name = "(" + name + ")";
        }
        var g = "";
        if (gif === true) {
            g = " emIfGif";
            img = img + "-gif"
        }
        var data = "data='" + name + "'";
        var s = "emojiSelect";
        if (lectura === true) {
            s = "";
//            data = "";
        }
//        nameclean = nameclean.replace(":)", "smile");
//        nameclean = nameclean.replace(/:.\)/g, "smiley");
//        nameclean = nameclean.replace(":D", "smile");
//        nameclean = nameclean.replace(":-D", "smile");
//        nameclean = nameclean.replace(":d", "smiley");
        nameclean = nameclean.replace(";)", "wink");
        nameclean = nameclean.replace(":(", "disappointed");
        nameclean = nameclean.replace("B-)", "sunglasses");
        nameclean = nameclean.replace("(y)", "hand_ok");
        nameclean = nameclean.replace(":o", "open_mouth");
        nameclean = nameclean.replace(":-O", "open_mouth");
        nameclean = nameclean.replace(":p", "stuck_out_tongue");
        nameclean = nameclean.replace(":P", "stuck_out_tongue");
        nameclean = nameclean.replace(":-P", "stuck_out_tongue");
//        nameclean = nameclean.replace("facepalmen", "it_is_not_like");

//        if (nameclean === "smile") {
//            console.log("gif", gif)
//            console.log("name", name)
//            console.log("nameclean", nameclean)
//            console.log("data", data)
//        }

        if (gif === true) {
            var url = wnw.domainSrv + "/nwlib6/css/emoji/gifs/" + nameclean + ".gif";
            if (wnwUtils.evalueData(urlimagen)) {
                url = urlimagen;
            }
            return "<span style='background-image: url(" + url + ");'  data-css='background-image: url(" + url + ");'  " + data + " class='" + s + " em em-some-emoji em-" + img + " " + g + "'></span><span class='emojiHiddenMomment'>" + name + "</span>";
        } else {
            return "<span style='background-image: url(" + wnw.domainSrv + "/nwlib6/css/emoji/emoji/" + nameclean + ".png);' data-css='background-image: url(" + wnw.domainSrv + "/nwlib6/css/emoji/emoji/" + nameclean + ".png);' " + data + " class='emojif em em-some-emoji'></span><span class='emojiHiddenMomment'>(" + name + ")</span>";
        }
//        }
    },
    showHiddenPlaceholderMessageBox: function () {
        var self = this;
        var box = self.messageBox;
        var message = box.innerHTML;
        if (message.length > 0) {
            self.btnsubmit.style = "display:flex;";
            self.dictation.style = "display:none;";
            self.placeHolderMessageBox.style.display = "none";
        } else {
            self.btnsubmit.style = "display:none;";
            self.dictation.style = "display:flex;";
            self.placeHolderMessageBox.style.display = "block";
        }
    },
    arrayEmojis: function () {
        var r = [];
        if (typeof mainNwOutEmojis !== "undefined") {
            for (var i = 0; i < mainNwOutEmojis.length; i++) {
                var ra = mainNwOutEmojis[i];
                r.push({name: ra.name, img: false, gif: true, lectura: true, imgWidget: true, imagen: ra.imagen});
            }
        }
//        r.push({name: "nonono", img: false, gif: true, lectura: true, imgWidget: true, imagen: "/imagenes/Ups.gif"});
        r.push({name: "nonono", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "f5", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "fp1", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "please1", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "lenny1", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "burns", img: false, gif: true, lectura: true, imgWidget: true});
//        r.push({name: "burns2", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "bnsr2", img: false, gif: true, lectura: true, imgWidget: true});
//        r.push({name: "burns3", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "brns3", img: false, gif: true, lectura: true, imgWidget: true});
//        r.push({name: "mrburns", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "mrbsrn", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "think1", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "tienesrazonoffice", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "ninio_llora", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "thankyou", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "win1", img: false, gif: true, lectura: true, imgWidget: true});
//        r.push({name: "smile", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "facepalm", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "tenor", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "homer_happy", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "according", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "nobody", img: false, gif: true, lectura: true, imgWidget: true});
        r.push({name: "jesusSuperStar", img: false, gif: true, lectura: true, imgWidget: true});
        return r;
    }
};