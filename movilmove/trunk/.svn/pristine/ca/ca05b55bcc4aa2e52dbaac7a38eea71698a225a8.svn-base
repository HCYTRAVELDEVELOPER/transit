/* ************************************************************************
 
 Copyright:
 
 License:
 
 Authors:
 
 ************************************************************************ */

/**
 * This is the main application class of your custom application "movilmove"
 *
 * @asset(movilmove/*)
 */
qx.Class.define("movilmove.Application", {
    extend: qx.application.Standalone,
    members: {
        root: null,
        main: function () {
            this.base(arguments);
            var self = this;
            if (qx.core.Environment.get("qx.debug")) {
                qx.log.appender.Native;
                qx.log.appender.Console;
            }
            qxnw.userPolicies.setProduct(true);
            qxnw.userPolicies.versionDashboard = 2;
            qxnw.userPolicies.versionDashboardisProduct = true;
            qxnw.userPolicies.versionDashboardUsedSecondView = true;
            qxnw.userPolicies.versionDashboardShowGroups = false;
            qxnw.userPolicies.name_product = "Movilmove";
            qxnw.userPolicies.openAuthByToken();
            qxnw.local.setAppTitle(self.tr("Movilmove, software de transporte"));

            qxnw.local.setAppVersion("6.5");

            qxnw.userPolicies.setNwlibVersion("6");


            qxnw.local.start();
            qxnw.userPolicies.setMethod("session");
            qxnw.userPolicies.setRpcUrl("/rpcsrv/server.php");
            qxnw.userPolicies.setDB({cliente: 1285, cliente_text: "CLIENTES ARRENDAMIENTO"});
            qxnw.userPolicies.setMainMethod("master");

            var rpc = new qxnw.rpc(qxnw.userPolicies.rpcUrl(), "session");
            rpc.exec("isSessionStarted");
            if (rpc.isError()) {
//                var d = window.location;
//                if (d.hostname != "localhost") {
//                    window.location = "/";
//                    return;
//                }
                qxnw.utils.populateInitSettings(this);
                var login = new qxnw.login();
                login.setMethod("session");
                login.settings.accept = function () {
                    self.loadMain();
                };
                login.show();
                return;
            }

            self.loadMain();

        },
        loadMain: function loadMain() {
            main = new movilmove.main();
            this.getRoot().add(main.getWidget(), {
                edge: 0
            });
        }
    }
});
