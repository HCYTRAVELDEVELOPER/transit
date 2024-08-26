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
var NWMRpc = function (rpcUrl) {
    var self = this;
    this.rpc = null;
    this.domain = null;
    this.callback = null;
    this.rpcUrl = rpcUrl;
    this.constructor = function () {
        this.rpc = new XMLHttpRequest();
        this.rpc.onload = this.onLoad;
        this.rpc.onerror = this.onError;
        this.callback = null;
    };
    this.onLoad = function (e) {
        console.log("LOAD");
        var data = JSON.parse(this.responseText);
        console.log("RECIBE:");
        console.log(data);
        console.log("saveOrUpdate", data);
        if (self.callback != null) {
            self.callback(data);
        }
    };
    this.onError = function (e) {
        console.log("ERROR LOAD");
        console.log(e);
        console.log('Fetch Error :-S', e);
        NWMUtils.information(e);
    };
    this.exec = function (data, callback) {
        console.log("DATA SERVIDOR:");
        console.log(data);
        this.callback = callback;
        this.rpc.open('POST', this.getDomain() + this.getRpcUrl(), true);
        this.rpc.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        this.rpc.send(data);
    };
    this.getRpcUrl = function () {
        return this.rpcUrl;
    };
    this.getDomain = function () {
        return window.location.protocol + "//" + window.location.host;
    };
    this.constructor();
};