qx.Class.define("qxnw.nw_admin_db.forms.f_view_objects", {
    extend: qxnw.forms,
    construct: function () {
        var self = this;
        this.base(arguments);
        this.setColumnsFormNumber(0);
        this.createBase();
        this.setTitle("");
        self.orden_cargue = {};
        self.setGroupHeader("");
        var fields = [
            {
                name: "Edición",
                type: "startGroup",
                icon: qxnw.config.execIcon("bookmark-new", "actions"),
                mode: "horizontal"
            },
            {
                name: "object",
                label: "",
                type: "textArea",
                required: true
            },
            {
                name: "",
                type: "endGroup",
                icon: ""
            }];
        self.setFields(fields);
        self.ui.cancel.hide();
        self.ui.accept.set({
            label: "Ejecutar"
        });
        self.ui.accept.addListener("execute", function () {
            self.slotSave();
        });
//        qxnw.utils.populateSelectAsync(self.ui.owner, "nw_admin_tables", "populateOwner", 0);

    },
    members: {pr: null,
        box1: null,
        deleteButton: null,
        navTable: null,
        texto: null,
        setParamRecord: function setParamRecord(data) {
            var self = this;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_tables", true);
            var func = function (r) {
                if (r) {
                    var text = "";
                    if (r.length > 0) {
                        if (r[0].tipo == "view") {
                            text = "CREATE OR REPLACE VIEW public." + data.nombre + "(";
                            text += qxnw.utils.getStringFromArrayList(r, "column_name");
                            text += ") AS";
                            text += r[0].definition;
                            self.ui.object.setValue(text);
                        }
                    }
                    else if (r.tipo == "function") {
                        self.setRecord(r);
                    }
                }
            };
            if (data.tipo == "function") {
                rpc.exec("populateFunctionsByName", data, func);
            }
            if (data.tipo == "view") {
                rpc.exec("populateViewsByName", data, func);
            }
        },
        Function: function Function(data) {
            var self = this;
            var text = "CREATE OR REPLACE FUNCTION public.{function_name}\n\
{parameters}\n\
 RETURNS {type_return}\n\
 $body$ \n\
DECLARE \n\
\n\
\n\
BEGIN \n\
END; \n\
$body$\n\
LANGUAGE 'plpgsql'\n\
VOLATILE\n\
CALLED ON NULL INPUT\n\
SECURITY INVOKER\n\
COST 100;"
            self.ui.object.setValue(text);
        },
        View: function View(data) {
            var self = this;
            var text = "CREATE VIEW public.{view_name} \n\
( \n\
\n\
{columns} \n\
\n\
)\n\
 AS\n\
  {query};"
            self.ui.object.setValue(text);
        },
        slotSave: function slotSave() {
            var self = this;
            var data = this.getRecord();
            if (!self.validate()) {
                return;
            }
            data.query = data.object;
            var rpc = new qxnw.rpc(self.getRpcUrl(), "nw_admin_table_init");
            rpc.setAsync(true);
            var func = function (r) {
                console.log("OK¡¡¡");
            };
            rpc.exec("executeQuery", data, func);
        }
    }
});