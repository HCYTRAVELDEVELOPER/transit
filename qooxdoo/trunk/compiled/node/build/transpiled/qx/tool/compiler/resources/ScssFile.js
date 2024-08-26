(function () {
  var $$dbClassInfo = {
    "dependsOn": {
      "qx.tool.utils.Promisify": {
        "require": true
      },
      "qx.Class": {
        "usage": "dynamic",
        "require": true
      },
      "qx.core.Object": {
        "construct": true,
        "require": true
      },
      "qx.Promise": {},
      "qx.tool.compiler.Console": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
   *
   *    qooxdoo-compiler - node.js based replacement for the Qooxdoo python
   *    toolchain
   *
   *    https://github.com/qooxdoo/qooxdoo
   *
   *    Copyright:
   *      2011-2019 Zenesis Limited, http://www.zenesis.com
   *
   *    License:
   *      MIT: https://opensource.org/licenses/MIT
   *
   *      This software is provided under the same licensing terms as Qooxdoo,
   *      please see the LICENSE file in the Qooxdoo project's top-level directory
   *      for details.
   *
   *    Authors:
   *      * John Spackman (john.spackman@zenesis.com, @johnspackman)
   *
   * *********************************************************************** */

  /* eslint-disable @qooxdoo/qx/no-illegal-private-usage */
  const fs = qx.tool.utils.Promisify.fs;

  const path = require("upath");
  /**
   * @external(qx/tool/loadsass.js)
   * @ignore(loadSass)
   */

  /* global loadSass */


  const sass = loadSass();
  /**
   * @ignore(process)
   */

  qx.Class.define("qx.tool.compiler.resources.ScssFile", {
    extend: qx.core.Object,

    construct(target, library, filename) {
      qx.core.Object.constructor.call(this);
      this.__P_37_0 = library;
      this.__filename = filename;
      this.__P_37_1 = target;
      this.__P_37_2 = {};
      this.__P_37_3 = {};
    },

    properties: {
      file: {
        nullable: false,
        check: "String",
        event: "changeFile"
      },
      themeFile: {
        init: false,
        check: "Boolean"
      }
    },
    members: {
      __P_37_0: null,
      __filename: null,
      __P_37_4: null,
      __P_37_5: null,
      __P_37_2: null,
      __P_37_3: null,

      /**
       * Compiles the SCSS, returns a list of files that were imported)
       *
       * @param outputFilename {String} output
       * @return {String[]} dependent files
       */
      async compile(outputFilename) {
        this.__P_37_4 = path.dirname(outputFilename);
        this.__P_37_5 = {};
        let inputFileData = await this.loadSource(this.__filename, this.__P_37_0);
        await new qx.Promise((resolve, reject) => {
          sass.render({
            // Always have file so that the source map knows the name of the original
            file: this.__filename,
            // data provides the contents, `file` is only used for the sourcemap filename
            data: inputFileData,
            outputStyle: "compressed",
            sourceMap: true,
            outFile: path.basename(outputFilename),

            /*
             * Importer
             */
            importer: (url, prev, done) => {
              let contents = this.__P_37_2[url];

              if (!contents) {
                let tmp = this.__P_37_3[url];

                if (tmp) {
                  contents = this.__P_37_2[tmp];
                }
              }

              return contents ? {
                contents
              } : null;
            },
            functions: {
              "qooxdooUrl($filename, $url)": ($filename, $url, done) => this.__P_37_6($filename, $url, done)
            }
          }, (error, result) => {
            if (error) {
              qx.tool.compiler.Console.error("Error status " + error.status + " in " + this.__filename + "[" + error.line + "," + error.column + "]: " + error.message);
              resolve(error); // NOT reject

              return;
            }

            fs.writeFileAsync(outputFilename, result.css.toString(), "utf8").then(() => fs.writeFileAsync(outputFilename + ".map", result.map.toString(), "utf8")).then(() => resolve(null)).catch(reject);
          });
        });
        return Object.keys(this.__P_37_2);
      },

      _analyseFilename(url, currentFilename) {
        var m = url.match(/^([a-z0-9_.]+):(\/?[^\/].*)/);

        if (m) {
          return {
            namespace: m[1],
            filename: m[2],
            externalUrl: null
          };
        } // It's a real URL like http://abc.com/..


        if (url.match(/^[a-z0-9_]+:\/\//)) {
          return {
            externalUrl: url
          };
        } // It's either absolute to the website (i.e. begins with a slash) or it's
        //  relative to the current file


        if (url[0] == "/") {
          return {
            namespace: null,
            filename: url
          };
        } // Must be relative to current file


        let dir = path.dirname(currentFilename);
        let filename = path.resolve(dir, url);

        let library = this.__P_37_1.getAnalyser().getLibraries().find(library => filename.startsWith(path.resolve(library.getRootDir())));

        if (!library) {
          qx.tool.compiler.Console.error("Cannot find library for " + url + " in " + currentFilename);
          return null;
        }

        let libResourceDir = path.join(library.getRootDir(), this.isThemeFile() ? library.getThemePath() : library.getResourcePath());
        return {
          namespace: library.getNamespace(),
          filename: path.relative(libResourceDir, filename),
          externalUrl: null
        };
      },

      reloadSource(filename) {
        filename = path.resolve(filename);
        delete this.__P_37_2[filename];
        return this.loadSource(filename);
      },

      async loadSource(filename, library) {
        filename = path.relative(process.cwd(), path.resolve(this.isThemeFile() ? library.getThemeFilename(filename) : library.getResourceFilename(filename)));
        let absFilename = filename;

        if (path.extname(absFilename) == "") {
          absFilename += ".scss";
        }

        let exists = fs.existsSync(absFilename);

        if (!exists) {
          let name = path.basename(absFilename);

          if (name[0] != "_") {
            let tmp = path.join(path.dirname(absFilename), "_" + name);
            exists = fs.existsSync(tmp);

            if (exists) {
              absFilename = tmp;
            }
          }
        }

        if (!exists) {
          this.__P_37_2[absFilename] = null;
          return null;
        }

        if (this.__P_37_2[absFilename] !== undefined) {
          return qx.Promise.resolve(this.__P_37_2[absFilename]);
        }

        let contents = await fs.readFileAsync(absFilename, "utf8");
        let promises = [];
        contents = contents.replace(/@import\s+["']([^;]+)["']/gi, (match, p1, offset) => {
          let pathInfo = this._analyseFilename(p1, absFilename);

          if (pathInfo.externalUrl) {
            return '@import "' + pathInfo.externalUrl + '"';
          }

          let newLibrary = this.__P_37_1.getAnalyser().findLibrary(pathInfo.namespace);

          if (!newLibrary) {
            qx.tool.compiler.Console.error("Cannot find file to import, url=" + p1 + " in file " + absFilename);
            return null;
          }

          promises.push(this.loadSource(pathInfo.filename, newLibrary));
          let filename = this.isThemeFile() ? newLibrary.getThemeFilename(pathInfo.filename) : newLibrary.getResourceFilename(pathInfo.filename);
          return '@import "' + path.relative(process.cwd(), filename) + '"';
        });
        contents = contents.replace(/\burl\s*\(\s*([^\)]+)*\)/gi, (match, url) => {
          let c = url[0];

          if (c === "'" || c === '"') {
            url = url.substring(1);
          }

          c = url[url.length - 1];

          if (c === "'" || c === '"') {
            url = url.substring(0, url.length - 1);
          } //return `qooxdooUrl("${filename}", "${url}")`;


          let pathInfo = this._analyseFilename(url, filename);

          if (pathInfo) {
            if (pathInfo.externalUrl) {
              return `url("${pathInfo.externalUrl}")`;
            }

            if (pathInfo.namespace) {
              let targetFile = path.relative(process.cwd(), path.join(this.__P_37_1.getOutputDir(), "resource", pathInfo.filename));
              let relative = path.relative(this.__P_37_4, targetFile);
              return `url("${relative}")`;
            }
          }

          return `url("${url}")`;
        });
        this.__P_37_2[absFilename] = contents;
        this.__P_37_3[filename] = absFilename;
        await qx.Promise.all(promises);
        return contents;
      },

      getSourceFilenames() {
        return Object.keys(this.__P_37_2);
      },

      __P_37_6($filename, $url, done) {
        let currentFilename = $filename.getValue();
        let url = $url.getValue();

        let pathInfo = this._analyseFilename(url, currentFilename);

        if (pathInfo) {
          if (pathInfo.externalUrl) {
            return sass.types.String("url(" + pathInfo.externalUrl + ")");
          }

          if (pathInfo.namespace) {
            let targetFile = path.relative(process.cwd(), path.join(this.__P_37_1.getOutputDir(), "resource", pathInfo.filename));
            let relative = path.relative(this.__P_37_4, targetFile);
            return sass.types.String("url(" + relative + ")");
          }
        }

        return sass.types.String("url(" + url + ")");
      }

    }
  });
  qx.tool.compiler.resources.ScssFile.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=ScssFile.js.map