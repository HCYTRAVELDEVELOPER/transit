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
      "qx.tool.utils.files.Utils": {}
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
   * ************************************************************************/
  const fs = qx.tool.utils.Promisify.fs;

  const path = require("upath");

  const crypto = require("crypto");

  const sourceMap = require("source-map");
  /**
   * Copies multiple javascript source files into a single destination, preserving (merging)
   * source maps as it goes.
   *
   * This will not rewrite the output files if the file content will not change.
   */


  qx.Class.define("qx.tool.compiler.targets.SourceCodeCopier", {
    extend: qx.core.Object,

    /**
     * Constructor
     * @param outputFilename {String} the destination file for combined output
     */
    construct(outputFilename) {
      qx.core.Object.constructor.call(this);
      let pos = outputFilename.lastIndexOf(".");
      let basename = outputFilename.substring(0, pos);
      this.__tmpFilename__P_38_0 = basename + "-tmp.js";
      this.__outputFilename__P_38_1 = basename + ".js";
      this.__mapFilename__P_38_2 = basename + ".js.map";
      this.__ws__P_38_3 = fs.createWriteStream(this.__tmpFilename__P_38_0);
      this.__hash__P_38_4 = crypto.createHash("sha256");

      this.__hash__P_38_4.setEncoding("hex");

      this.__generator__P_38_5 = new sourceMap.SourceMapGenerator({
        file: this.__mapFilename__P_38_2
      });
      this.__lineOffset__P_38_6 = 0;
    },

    members: {
      /** {String} Output filename for combined javascript */
      __outputFilename__P_38_1: null,

      /** {String} output filename for temporary code */
      __tmpFilename__P_38_0: null,

      /** {String} output filename for the combined sourcemap */
      __mapFilename__P_38_2: null,

      /** {String} write stream for javascript */
      __ws__P_38_3: null,

      /** {crypto.createHash} hash accumulator for combined javascript */
      __hash__P_38_4: null,

      /** {String} hash value for existing combined javascript */
      __existingHashValue__P_38_7: null,
      __generator__P_38_5: null,
      __lineOffset__P_38_6: null,

      /**
       * Returns the file the code is copied to
       */
      getOutputFilename() {
        return this.__outputFilename__P_38_1;
      },

      /**
       * Opens the output
       */
      async open() {
        let stat = await qx.tool.utils.files.Utils.safeStat(this.__outputFilename__P_38_1);

        if (stat) {
          let hash = crypto.createHash("sha256");
          hash.setEncoding("hex");
          let data = await fs.readFileAsync(this.__outputFilename__P_38_1, "utf8");
          hash.write(data);
          this.__existingHashValue__P_38_7 = this.__hash__P_38_4.read();
        }
      },

      /**
       * Helper method to write output
       * @param str {String} data to write
       */
      __write__P_38_8(str) {
        this.__hash__P_38_4.write(str);

        this.__ws__P_38_3.write(str);
      },

      /**
       * Adds a source file to the output
       *
       * @param jsFilename {String} filename to add
       * @param jsUri {String} uri of the file being added, relative to the output directory
       */
      async addSourceFile(jsFilename, jsUri) {
        let jsMapFilename = jsFilename + ".map";
        let numLines = 0;
        let data = await fs.readFileAsync(jsFilename, "utf8");
        data = data.replace(/\/\/[@#]\ssourceMappingURL[^\r\n]*/g, "//");
        data += "\n";

        this.__write__P_38_8(data);

        for (var i = 0; i < data.length; i++) {
          if (data[i] === "\n") {
            numLines++;
          }
        }

        let stat = await qx.tool.utils.files.Utils.safeStat(jsMapFilename);

        if (stat) {
          let source = jsUri || jsFilename;
          data = await fs.readFileAsync(jsMapFilename, "utf8");
          var map = new sourceMap.SourceMapConsumer(data);
          map.eachMapping(mapping => {
            mapping = {
              generated: {
                line: mapping.generatedLine + this.__lineOffset__P_38_6,
                column: mapping.generatedColumn
              },
              original: {
                line: mapping.originalLine || 1,
                column: mapping.originalColumn || 1
              },
              source: source
            };

            this.__generator__P_38_5.addMapping(mapping);
          });
          map.sources.forEach(origSource => this.__generator__P_38_5.setSourceContent(source, map.sourceContentFor(origSource)));
        }

        this.__lineOffset__P_38_6 += numLines;
      },

      /**
       * Closes the output
       */
      async close() {
        this.__write__P_38_8("\n//# sourceMappingURL=" + path.basename(this.__mapFilename__P_38_2) + "\n");

        this.__ws__P_38_3.end();

        this.__hash__P_38_4.end();

        var hashValue = this.__hash__P_38_4.read();

        if (!this.__existingHashValue__P_38_7 || hashValue !== this.__existingHashValue__P_38_7) {
          await fs.renameAsync(this.__tmpFilename__P_38_0, this.__outputFilename__P_38_1);
          await fs.writeFileAsync(this.__mapFilename__P_38_2, JSON.stringify(JSON.parse(this.__generator__P_38_5.toString()), null, 2), "utf8");
          return true;
        }

        await fs.unlinkAsync(this.__tmpFilename__P_38_0);
        return false;
      }

    }
  });
  qx.tool.compiler.targets.SourceCodeCopier.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=SourceCodeCopier.js.map