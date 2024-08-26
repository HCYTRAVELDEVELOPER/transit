/* ************************************************************************
 
 Copyright:
 2015 Grupo NW S.A.S, http://www.gruponw.com
 
 License:
 LGPL: http://www.gnu.org/licenses/lgpl.html
 EPL: http://www.eclipse.org/org/documents/epl-v10.php
 See the LICENSE file in the project's top-level directory for details.
 
 Authors:
 * Andrés Flórez (andresf)
 * 
 * Class to test on andresf projects
 
 ************************************************************************ */
qx.Class.define("qxnw.mobile.treeAdmin", {
    extend: qxnw.treeWidget,
    construct: function () {
        this.base(arguments);
        var self = this;
        self.setTitle(self.tr("Administrador de propiedades del sistema móvil"));
        self.populateProfiles();
        self.createSubWindow();
    },
    destruct: function () {

    },
    members: {
        createSubWindow: function createSubWindow() {
            var self = this;
            self.mainPage = new qxnw.listEdit();
            var cols = [
                {
                    caption: "id",
                    label: "ID"
                },
                {
                    caption: "nombre",
                    label: self.tr("Nombre")
                },
                {
                    caption: "asociado",
                    label: self.tr("Asociado"),
                    type: "checkBox",
                    editable: true
                },
                {
                    caption: "pagina_principal",
                    label: self.tr("Página principal"),
                    type: "checkBox",
                    editable: true
                }
            ];
            self.mainPage.setColumns(cols);
            self.mainPage.table.addListener("dataEdited", function (e) {
                var cellData = e.getData();
                if (cellData.col == 3 && cellData.value == true) {
                    self.mainPage.setCellValue(2, cellData.row, true);
                }
                var sl = self.mainPage.getRecordByRow(cellData.row);
                var perfil = self.tree.getSelection();
                perfil = perfil[0].getModel();
                sl.perfil = perfil.id;
                qxnw.utils.fastAsyncCallRpc("mobile", "saveSelected", sl);
            });
            self.mainPage.setListEdit();
            this.addSubWindow(self.tr("Menú"), self.mainPage);
        },
        populateProfiles: function populateProfiles() {
            var self = this;
            self.addTreeHeader(self.tr("Perfiles disponibles"), qxnw.config.execIcon("preferences-users", "apps"));
            var callback = function (r) {
                self.populateSubWindow(r);
            };
            self.populate("master", "populate", {table: "perfiles", order: "nombre"}, 0, callback);
        },
        populateSubWindow: function populateSubWindow(itemRecord) {
            var self = this;
            var func = function (r) {
                self.mainPage.setModelData(r);
            };
            qxnw.utils.fastAsyncCallRpc("mobile", "getAdminMenu", itemRecord, func);
        }
    }
});

