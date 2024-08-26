(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.tool.utils.Utils": {},
      "qx.Promise": {},
      "qx.tool.compiler.Console": {
        "defer": "runtime"
      },
      "qx.tool.config.Compile": {},
      "qx.tool.utils.files.Utils": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2017 Zenesis Ltd
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * John Spackman (john.spackman@zenesis.com, @johnspackman)
  
  ************************************************************************ */
  const fs = require("fs");

  const path = require("upath");

  const chokidar = require("chokidar");

  qx.Class.define("qx.tool.cli.Watch", {
    extend: qx.core.Object,

    construct(maker) {
      qx.core.Object.constructor.call(this);
      this.__P_5_0 = maker;
      this.__P_5_1 = {
        classesCompiled: 0
      };
      this.__P_5_2 = {};
      this.__P_5_3 = [];
      this.__P_5_4 = {};
      maker.addListener("writtenApplication", this._onWrittenApplication, this);
    },

    properties: {
      debug: {
        init: false,
        check: "Boolean"
      }
    },
    events: {
      making: "qx.event.type.Event",
      remaking: "qx.event.type.Event",
      made: "qx.event.type.Event",
      configChanged: "qx.event.type.Event"
    },
    members: {
      __P_5_5: null,
      __P_5_6: null,
      __P_5_7: false,
      __P_5_0: null,
      __P_5_1: null,
      __P_5_8: null,
      __P_5_9: false,
      __P_5_10: null,
      __P_5_11: null,
      __P_5_2: null,
      __P_5_3: null,
      __P_5_12: null,

      /** @type{Map<String,Object>} list of runWhenWatching configurations, indexed by app name */
      __P_5_4: null,

      async setConfigFilenames(arr) {
        if (!arr) {
          this.__P_5_3 = [];
        } else {
          this.__P_5_3 = arr.map(filename => path.resolve(filename));
        }
      },

      setRunWhenWatching(appName, config) {
        this.__P_5_4[appName] = config;
        let arr = qx.tool.utils.Utils.parseCommand(config.command);
        config._cmd = arr.shift();
        config._args = arr;
      },

      async _onWrittenApplication(evt) {
        let appInfo = evt.getData();
        let name = appInfo.application.getName();
        let config = this.__P_5_4[name];

        if (!config) {
          return;
        }

        if (config._process) {
          try {
            await qx.tool.utils.Utils.killTree(config._process.pid);
          } catch (ex) {//Nothing
          }

          if (config._processPromise) {
            await config._processPromise;
          }

          config._process = null;
        }

        console.log("Starting application: " + config._cmd + " " + config._args.join(" "));
        config._processPromise = new qx.Promise((resolve, reject) => {
          let child = config._process = require("child_process").spawn(config._cmd, config._args);

          child.stdout.setEncoding("utf8");
          child.stdout.on("data", data => console.log(data));
          child.stderr.setEncoding("utf8");
          child.stderr.on("data", data => console.log(data));
          child.on("close", function (code) {
            console.log("Application has terminated");
            config._process = null;
            resolve();
          });
          child.on("error", err => console.error("Application has failed: " + err));
        });
      },

      start() {
        if (this.isDebug()) {
          qx.tool.compiler.Console.debug("DEBUG: Starting watch");
        }

        if (this.__P_5_5) {
          throw new Error("Cannot start watching more than once");
        }

        this.__P_5_5 = qx.tool.utils.Utils.newExternalPromise();
        var dirs = [];

        var analyser = this.__P_5_0.getAnalyser();

        analyser.addListener("compiledClass", function () {
          this.__P_5_1.classesCompiled++;
        }, this);
        dirs.push(qx.tool.config.Compile.config.fileName);
        dirs.push("compile.js");
        analyser.getLibraries().forEach(function (lib) {
          let dir = path.join(lib.getRootDir(), lib.getSourcePath());
          dirs.push(dir);
          dir = path.join(lib.getRootDir(), lib.getResourcePath());
          dirs.push(dir);
          dir = path.join(lib.getRootDir(), lib.getThemePath());
          dirs.push(dir);
        });
        var applications = this.__P_5_6 = [];

        this.__P_5_0.getApplications().forEach(function (application) {
          var data = {
            application: application,
            dependsOn: {},
            outOfDate: false
          };
          applications.push(data);
          let dir = application.getBootPath();

          if (dir && !dirs.includes(dir)) {
            dirs.push(dir);
          }
        });

        if (this.isDebug()) {
          qx.tool.compiler.Console.debug(`DEBUG: applications=${JSON.stringify(applications.map(d => d.application.getName()), 2)}`);
          qx.tool.compiler.Console.debug(`DEBUG: dirs=${JSON.stringify(dirs, 2)}`);
        }

        var confirmed = [];
        Promise.all(dirs.map(dir => new Promise((resolve, reject) => {
          dir = path.resolve(dir);
          fs.stat(dir, function (err) {
            if (err) {
              if (err.code == "ENOENT") {
                resolve();
              } else {
                reject(err);
              }

              return;
            } // On case insensitive (but case preserving) filing systems, qx.tool.utils.files.Utils.correctCase
            // is needed corrects because chokidar needs the correct case in order to detect changes.


            qx.tool.utils.files.Utils.correctCase(dir).then(dir => {
              confirmed.push(dir);
              resolve();
            });
          });
        }))).then(() => {
          if (this.isDebug()) {
            qx.tool.compiler.Console.debug(`DEBUG: confirmed=${JSON.stringify(confirmed, 2)}`);
          }

          var watcher = this._watcher = chokidar.watch(confirmed, {//ignored: /(^|[\/\\])\../
          });
          watcher.on("change", filename => this.__P_5_13("change", filename));
          watcher.on("add", filename => this.__P_5_13("add", filename));
          watcher.on("unlink", filename => this.__P_5_13("unlink", filename));
          watcher.on("ready", () => {
            this.__P_5_7 = true;

            this.__P_5_14();
          });
          watcher.on("error", err => {
            qx.tool.compiler.Console.print(err.code == "ENOSPC" ? "qx.tool.cli.watch.enospcError" : "qx.tool.cli.watch.watchError", err);
          });
        });
      },

      async stop() {
        this.__P_5_9 = true;

        this._watcher.close();

        if (this.__P_5_8) {
          await this.__P_5_8;
        }
      },

      __P_5_14() {
        if (this.__P_5_8) {
          this.__P_5_15 = true;
          return this.__P_5_8;
        }

        this.fireEvent("making");
        var t = this;
        var Console = qx.tool.compiler.Console;

        function make() {
          Console.print("qx.tool.cli.watch.makingApplications");
          t.__P_5_12 = null;
          var startTime = new Date().getTime();
          t.__P_5_1.classesCompiled = 0;
          t.__P_5_10 = false;
          return t.__P_5_0.make().then(() => {
            if (t.__P_5_9) {
              Console.print("qx.tool.cli.watch.makeStopping");
              return null;
            }

            if (t.__P_5_10) {
              return new qx.Promise(resolve => {
                setImmediate(function () {
                  Console.print("qx.tool.cli.watch.restartingMake");
                  t.fireEvent("remaking");
                  make().then(resolve);
                });
              });
            }

            var analyser = t.__P_5_0.getAnalyser();

            var db = analyser.getDatabase();
            var promises = [];

            t.__P_5_6.forEach(data => {
              data.dependsOn = {};
              var deps = data.application.getDependencies();
              deps.forEach(function (classname) {
                var info = db.classInfo[classname];
                var lib = analyser.findLibrary(info.libraryName);
                var parts = [lib.getRootDir(), lib.getSourcePath()].concat(classname.split("."));
                var filename = path.resolve.apply(path, parts) + ".js";
                data.dependsOn[filename] = true;
              });
              var filename = path.resolve(data.application.getLoaderTemplate());
              promises.push(qx.tool.utils.files.Utils.correctCase(filename).then(filename => data.dependsOn[filename] = true));
            });

            return Promise.all(promises).then(() => {
              var endTime = new Date().getTime();
              Console.print("qx.tool.cli.watch.compiledClasses", t.__P_5_1.classesCompiled, qx.tool.utils.Utils.formatTime(endTime - startTime));
              t.fireEvent("made");
            });
          }).then(() => {
            t.__P_5_8 = null;
          }).catch(err => {
            Console.print("qx.tool.cli.watch.compileFailed", err);
            t.__P_5_8 = null;
            t.fireEvent("made");
          });
        }

        const runIt = () => make().then(() => {
          if (this.__P_5_15) {
            delete this.__P_5_15;
            return runIt();
          }

          return null;
        });

        return this.__P_5_8 = runIt();
      },

      __P_5_16() {
        if (this.__P_5_8) {
          this.__P_5_15 = true;
          return this.__P_5_8;
        }

        if (this.__P_5_11) {
          clearTimeout(this.__P_5_11);
        }

        this.__P_5_11 = setTimeout(() => this.__P_5_14());
        return null;
      },

      __P_5_13(type, filename) {
        const Console = qx.tool.compiler.Console;

        if (!this.__P_5_7) {
          return null;
        }

        filename = path.normalize(filename);

        const handleFileChange = async () => {
          var outOfDate = false;

          if (this.__P_5_3.find(str => str == filename)) {
            if (this.isDebug()) {
              Console.debug(`DEBUG: onFileChange: configChanged`);
            }

            this.fireEvent("configChanged");
            return;
          }

          let outOfDateApps = {};

          this.__P_5_6.forEach(data => {
            if (data.dependsOn[filename]) {
              outOfDateApps[data.application.getName()] = data.application;
              outOfDate = true;
            } else {
              var boot = data.application.getBootPath();

              if (boot) {
                boot = path.resolve(boot);

                if (filename.startsWith(boot)) {
                  outOfDateApps[data.application.getName()] = true;
                  outOfDate = true;
                }
              }
            }
          });

          let outOfDateAppNames = Object.keys(outOfDateApps);

          if (this.isDebug()) {
            if (outOfDateAppNames.length) {
              Console.debug(`DEBUG: onFileChange: ${filename} impacted applications: ${JSON.stringify(outOfDateAppNames, 2)}`);
            }
          }

          let analyser = this.__P_5_0.getAnalyser();

          let fName = "";
          let isResource = analyser.getLibraries().some(lib => {
            var dir = path.resolve(path.join(lib.getRootDir(), lib.getResourcePath()));

            if (filename.startsWith(dir)) {
              fName = path.relative(dir, filename);
              return true;
            }

            dir = path.resolve(path.join(lib.getRootDir(), lib.getThemePath()));

            if (filename.startsWith(dir)) {
              fName = path.relative(dir, filename);
              return true;
            }

            return false;
          });

          if (isResource) {
            let rm = analyser.getResourceManager();

            let target = this.__P_5_0.getTarget();

            if (this.isDebug()) {
              Console.debug(`DEBUG: onFileChange: ${filename} is a resource`);
            }

            let asset = rm.getAsset(fName, type != "unlink");

            if (asset && type != "unlink") {
              await asset.sync(target);
              let dota = asset.getDependsOnThisAsset();

              if (dota) {
                await qx.Promise.all(dota.map(asset => asset.sync(target)));
              }
            }
          }

          if (outOfDate) {
            this.__P_5_10 = true;

            this.__P_5_16();
          }
        };

        const runIt = dbc => handleFileChange().then(() => {
          if (dbc.restart) {
            delete dbc.restart;
            return runIt(dbc);
          }

          return null;
        });

        let dbc = this.__P_5_2[filename];

        if (!dbc) {
          dbc = this.__P_5_2[filename] = {
            types: {}
          };
        }

        dbc.types[type] = true;

        if (dbc.promise) {
          if (this.isDebug()) {
            Console.debug(`DEBUG: onFileChange: seen '${filename}', but restarting promise`);
          }

          dbc.restart = 1;
          return dbc.promise;
        }

        if (dbc.timerId) {
          clearTimeout(dbc.timerId);
          dbc.timerId = null;
        }

        if (this.isDebug()) {
          Console.debug(`DEBUG: onFileChange: seen '${filename}', queuing`);
        }

        dbc.timerId = setTimeout(() => {
          dbc.promise = runIt(dbc).then(() => delete this.__P_5_2[filename]);
        }, 150);
        return null;
      },

      __P_5_17() {
        this.__P_5_5.resolve();
      }

    },

    defer() {
      qx.tool.compiler.Console.addMessageIds({
        "qx.tool.cli.watch.makingApplications": ">>> Making the applications...",
        "qx.tool.cli.watch.restartingMake": ">>> Code changed during make, restarting...",
        "qx.tool.cli.watch.makeStopping": ">>> Not restarting make because make is stopping...",
        "qx.tool.cli.watch.compiledClasses": ">>> Compiled %1 classes in %2"
      });
      qx.tool.compiler.Console.addMessageIds({
        "qx.tool.cli.watch.compileFailed": ">>> Fatal error during compile: %1",
        "qx.tool.cli.watch.enospcError": ">>> ENOSPC error occured - try increasing fs.inotify.max_user_watches",
        "qx.tool.cli.watch.watchError": ">>> Error occured while watching files - file modifications may not be detected; error: %1"
      }, "error");
    }

  });
  qx.tool.cli.Watch.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Watch.js.map