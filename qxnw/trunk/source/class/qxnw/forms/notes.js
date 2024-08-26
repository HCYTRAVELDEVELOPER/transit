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
 * Class created to be the main window. Into this class, you can put content as sub-windows, show forms, see some bars and more!
 */
qx.Class.define("qxnw.forms.notes", {
    extend: qxnw.forms,
    /**
     * Gets and create the session data, starts partial layout, sets the rpcUrl value and gets and save the actual theme. 
     */
    construct: function () {
        this.base(arguments);
        var self = this;

        self.setTitle(self.tr("Mis notas"));
        self.set({
            contentPaddingTop: 0,
            contentPaddingRight: 0,
            contentPaddingLeft: 0
        });
        var layout = new qx.ui.layout.VBox();
        self.setLayout(layout);
//        self.addListenerOnce('appear', function() {
//            var root = qx.core.Init.getApplication().getRoot();
//            var bounds = root.getBounds();
//            var rst = 30;
//            if (self.getWidth() == bounds.width) {
//                self.setWidth(bounds.width - rst);
//            }
//            var width = bounds.width - self.getWidth() - rst;
//            self.moveTo(width, 0);
//            qxnw.animation.startEffect("rotateIn", self);
//        });
        self.__layoutButtons = new qx.ui.layout.HBox();
        self.__containerButtons = new qx.ui.container.Composite(self.__layoutButtons).set({
            height: 0
        });
        self.addWidget(self.__containerButtons, 0);

        self.__layoutContent = new qx.ui.layout.VBox();
        self.setLayout(self.__layoutContent);

        self.__containerContent = new qx.ui.window.Desktop();
        self.addWidget(self.__containerContent, 1);
        self.createButtonsBar();

        self.populateNotes();
    },
    destruct: function destruct() {
        try {
            this._disposeObjects("__layoutButtons");
            this._disposeObjects("__layoutContent");
            this._disposeObjects("__containerButtons");
            this._disposeObjects("__containerContent");
            if (this.ui != null) {
                for (var i = 0; i < this.ui.length; i++) {
                    this._disposeObjects(this.fields[i]);
                }
            }
        } catch (e) {
            qxnw.utils.bindError(e, this, 0, true, false);
        }
    },
    properties: {
        lastId: {
            init: 1,
            check: "Integer"
        }
    },
    members: {
        __layoutButtons: null,
        __layoutContent: null,
        __containerButtons: null,
        __containerContent: null,
        __count: 1,
        __notes: [],
        __isSincronized: false,
        populateNotes: function populateNotes() {
            var self = this;
            var notes = qxnw.local.getData("notes");
            if (notes == null) {
                self.synchronize();
                return;
            }
            for (var i = 0; i < notes.length; i++) {
                self.addNote(notes[i], false);
            }
        },
        saveNote: function saveNote(textArea, note) {
            var data = {};
            data["note"] = textArea.getValue();
            var bounds = note.getBounds();
            data["width"] = bounds.width;
            data["height"] = bounds.height;
            data["top"] = bounds.top;
            data["left"] = bounds.left;
            data["id"] = parseInt(note.getUserData("noteData").id);
            try {
                if (typeof data["note"] != 'undefined') {
                    if (typeof data["note"] == 'string') {
                        var mainNote = note;
                        if (mainNote != null) {
                            var splitedTitle = data["note"].split("\n");
                            if (typeof splitedTitle.length != 'undefined') {
                                for (var iz = 0; iz < splitedTitle.length; iz++) {
                                    if (typeof splitedTitle[iz] != 'undefined') {
                                        var noteIn = splitedTitle[iz].trim();
                                        if (noteIn != '') {
                                            mainNote.setTitle(splitedTitle[iz]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log({
                    error_notas: e
                });
            }
            var storedNotes = qxnw.local.getData("notes");
            var notesToStore = [];
            if (storedNotes == null) {
                notesToStore.push(data);
                qxnw.local.storeData("note", notesToStore);
                return;
            }
            var finded = false;
            for (var i = 0; i < storedNotes.length; i++) {
                if (parseInt(data["id"]) == parseInt(storedNotes[i].id)) {
                    storedNotes.splice(i, 1, data);
                    qxnw.local.storeData("notes", storedNotes);
                    finded = true;
                }
            }
            if (!finded) {
                storedNotes.push(data);
                qxnw.local.storeData("notes", storedNotes);
            }
        },
        addNote: function addNote(noteData, setFocus) {
            var self = this;
            if (typeof noteData == 'undefined') {
                noteData = {};
                noteData["note"] = "";
                noteData["width"] = 300;
                noteData["height"] = 300;
                noteData["top"] = 10;
                noteData["left"] = 10;
                noteData["id"] = self.getLastId() + 1;
            } else {
                self.setLastId(parseInt(noteData["id"]));
            }
            var layout = new qx.ui.layout.VBox();
            var note = new qxnw.forms();
            note.setAppWidgetName(note.classname + noteData["id"]);
            note.setUserData("noteData", noteData);
            note.removeListenerById(self.getListenerIdClose());
            note.setLayout(layout);
            note.getChildControl("pane").set({
                backgroundColor: "#FCFF6B"
            });
            note.set({
                showMinimize: false
            });

            var textArea = new qx.ui.form.TextArea();
            textArea.setNativeContextMenu(true);
            textArea.setLiveUpdate(true);
            textArea.getChildrenContainer().set({
                backgroundColor: "#FCFF6B"
            });

            note.setUserData("nw_main_note_textarea", textArea);

            note.canCloseNWNote = false;

            note.addListener("beforeClose", function (e) {
                var these = this;
                if (these.canCloseNWNote == false) {
                    var textArea = this.getUserData("nw_main_note_textarea");
                    var value = "";
                    if (textArea != null) {
                        value = textArea.getValue();
                    }
                    if (value != "") {
                        e.preventDefault();
                        qxnw.utils.question(self.tr("La nota no está vacía. ¿Estás segur@ de borrarla?"), function (rta) {
                            if (rta == true) {
                                these.canCloseNWNote = true;
                                these.reject();
                            } else {
                                these.canCloseNWNote = false;
                            }
                        });
                    }
                }
            });
            note.addListener("close", function (e) {
                var storedNotes = qxnw.local.getData("notes");
                if (storedNotes == null) {
                    return;
                }
                for (var i = 0; i < storedNotes.length; i++) {
                    if (note.getUserData("noteData").id == storedNotes[i].id) {
                        storedNotes.splice(i);
                    }
                }
                qxnw.local.storeData("notes", storedNotes);
                self.synchronize();
            });
            textArea.setAppearance("widget");

            self.storeNote(noteData);

            textArea.setValue(noteData.note == null ? "" : noteData.note);

            try {
                if (typeof noteData.note != 'undefined') {
                    if (typeof noteData.note == 'string') {
                        var mainNote = note;
                        if (mainNote != null) {
                            var splitedTitle = noteData.note.split("\n");
                            if (typeof splitedTitle.length != 'undefined') {
                                for (var iz = 0; iz < splitedTitle.length; iz++) {
                                    if (typeof splitedTitle[iz] != 'undefined') {
                                        var noteIn = splitedTitle[iz].trim();
                                        if (noteIn != '') {
                                            mainNote.setTitle(splitedTitle[iz]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.log({
                    error_notas: e
                });
            }

            textArea.setUserData("nw_main_note", note);

            textArea.addListener("changeValue", function () {
                var note = this.getUserData("nw_main_note");
                self.saveNote(this, note);
            });
            textArea.addListener("focusout", function () {
                self.synchronize();
            });
            note.masterContainer.add(textArea, {
                flex: 1
            });
            note.getNoteValue = function () {
                textArea.getValue();
            };
            note.getChildControl("captionbar").set({
                minHeight: 15,
                maxHeight: 15
            });

            noteData["left"] = parseInt(noteData["left"]) == 'NaN' ? 300 : parseInt(noteData["left"]);
            noteData["top"] = parseInt(noteData["top"]) == 'NaN' ? 10 : parseInt(noteData["top"]);
            noteData["width"] = parseInt(noteData["width"]) == 'NaN' ? 300 : parseInt(noteData["width"]);
            noteData["height"] = parseInt(noteData["height"]) == 'NaN' ? 300 : parseInt(noteData["height"]);
            note.nwIsResizing = false;
            note.addListener("appear", function () {
                var these = this;
                note.setWidth(noteData["width"]);
                note.setHeight(noteData["height"]);
                note.moveTo(noteData.left, noteData.top);
                textArea.getContentElement().scrollToY(1);

                var timer = new qx.event.Timer(200);
                timer.start();
                timer.addListener("interval", function (e) {
                    this.stop();
                    these.addListener("move", function (e) {
                        if (these.nwIsResizing == true) {
                            return;
                        }
                        var textArea = this.getUserData("nw_main_note_textarea");
                        self.saveNote(textArea, this);
                    });
                    these.addListener("resize", function (e) {
                        these.nwIsResizing = true;
                        var textArea = this.getUserData("nw_main_note_textarea");
                        self.saveNote(textArea, this);
                        these.nwIsResizing = false;
                    });
                });

            });
            self.__containerContent.add(note);
            note.show();
            if (typeof setFocus == 'undefined') {
                textArea.focus();
            }
        },
        storeNote: function storeNote(note) {
            var notes = qxnw.local.getData("notes");
            var notesArray = [];
            if (notes == null) {
                notesArray.push(note);
                qxnw.local.storeData("notes", notesArray);
                return;
            }
            var finded = false;
            for (var i = 0; i < notes.length; i++) {
                if (parseInt(note.id) == parseInt(notes[i].id)) {
                    notes.splice(i, 1, note);
                    finded = true;
                }
            }
            if (!finded) {
                notes.push(note);
                qxnw.local.storeData("notes", notes);
            }
        },
        createContent: function createContent() {

        },
        synchronize: function synchronize() {
            var self = this;
            if (self.__isSynchronized) {
                return;
            }
            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "master");
            rpc.setShowLoading(false);
            rpc.setAsync(true);
            rpc.setHandleError(false);
            var func = function (r) {
                if (r === true) {
                    return;
                }
                for (var i = 0; i < r.length; i++) {
                    self.addNote(r[i]);
                }
            };
            var notes = qxnw.local.getData("notes");
            rpc.exec("synchronizeNotes", notes, func);
        },
        createButtonsBar: function createButtonsBar() {
            var self = this;
            var wNote = new qxnw.widgets.button(self.tr("Nueva nota"), qxnw.config.execIcon("list-add")).set({
                cursor: "pointer"
            });
            var toolTipNote = new qx.ui.tooltip.ToolTip(self.tr("Agregar notas"));
            wNote.setToolTip(toolTipNote);
            wNote.addListener("execute", function () {
                self.addNote();
            });
            self.__containerButtons.add(new qx.ui.core.Spacer(), {
                flex: 1
            });
            self.__containerButtons.add(wNote);
        }
    }
});