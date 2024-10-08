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
      "qx.data.marshal.MEventBubbling": {
        "require": true
      },
      "qx.data.IListData": {
        "require": true
      },
      "qx.lang.Array": {
        "construct": true
      },
      "qx.core.Assert": {}
    }
  };
  qx.Bootstrap.executePendingDefers($$dbClassInfo);

  /* ************************************************************************
  
     qooxdoo - the new era of web development
  
     http://qooxdoo.org
  
     Copyright:
       2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
  
     License:
       MIT: https://opensource.org/licenses/MIT
       See the LICENSE file in the project's top-level directory for details.
  
     Authors:
       * Martin Wittemann (martinwittemann)
  
  ************************************************************************ */

  /**
   * The data array is a special array used in the data binding context of
   * qooxdoo. It does not extend the native array of JavaScript but its a wrapper
   * for it. All the native methods are included in the implementation and it
   * also fires events if the content or the length of the array changes in
   * any way. Also the <code>.length</code> property is available on the array.
   *
   * This class does not need to be disposed, unless you set the autoDisposeItems
   * property to true and want the items to be disposed.
   */
  qx.Class.define("qx.data.Array", {
    extend: qx.core.Object,
    include: qx.data.marshal.MEventBubbling,
    implement: [qx.data.IListData],

    /**
     * Creates a new instance of an array.
     *
     * @param param {var} The parameter can be some types.<br/>
     *   Without a parameter a new blank array will be created.<br/>
     *   If there is more than one parameter is given, the parameter will be
     *   added directly to the new array.<br/>
     *   If the parameter is a number, a new Array with the given length will be
     *   created.<br/>
     *   If the parameter is a JavaScript array, a new array containing the given
     *   elements will be created.
     */
    construct(param) {
      qx.core.Object.constructor.call(this); // if no argument is given

      if (param == undefined) {
        this.__array__P_66_0 = []; // check for elements (create the array)
      } else if (arguments.length > 1) {
        // create an empty array and go through every argument and push it
        this.__array__P_66_0 = [];

        for (var i = 0; i < arguments.length; i++) {
          this.__array__P_66_0.push(arguments[i]);
        } // check for a number (length)

      } else if (typeof param == "number") {
        this.__array__P_66_0 = new Array(param); // check for an array itself
      } else if (param instanceof Array) {
        this.__array__P_66_0 = qx.lang.Array.clone(param); // error case
      } else {
        this.__array__P_66_0 = [];
        this.dispose();
        throw new Error("Type of the parameter not supported!");
      } // propagate changes


      for (var i = 0; i < this.__array__P_66_0.length; i++) {
        this._applyEventPropagation(this.__array__P_66_0[i], null, i);
      } // update the length at startup


      this.__updateLength__P_66_1(); // work against the console printout of the array


      {
        this[0] = "Please use 'toArray()' to see the content.";
      }
    },

    /*
    *****************************************************************************
       PROPERTIES
    *****************************************************************************
    */
    properties: {
      /**
       * Flag to set the dispose behavior of the array. If the property is set to
       * <code>true</code>, the array will dispose its content on dispose, too.
       */
      autoDisposeItems: {
        check: "Boolean",
        init: false
      }
    },

    /*
    *****************************************************************************
       EVENTS
    *****************************************************************************
    */
    events: {
      /**
       * The change event which will be fired if there is a change in the array.
       * The data contains a map with five key value pairs:
       * <li>start: The start index of the change.</li>
       * <li>end: The end index of the change.</li>
       * <li>type: The type of the change as a String. This can be 'add',
       * 'remove', 'order' or 'add/remove'</li>
       * <li>added: The items which has been added (as a JavaScript array)</li>
       * <li>removed: The items which has been removed (as a JavaScript array)</li>
       */
      change: "qx.event.type.Data",

      /**
       * The changeLength event will be fired every time the length of the
       * array changes.
       */
      changeLength: "qx.event.type.Data"
    },
    members: {
      // private members
      __array__P_66_0: null,

      /**
       * Concatenates the current and the given array into a new one.
       *
       * @param array {qx.data.Array|Array} The javaScript array which should be concatenated
       *   to the current array.
       *
       * @return {qx.data.Array} A new array containing the values of both former
       *   arrays.
       */
      concat(array) {
        array = qx.lang.Array.toNativeArray(array);

        if (array) {
          var newArray = this.__array__P_66_0.concat(array);
        } else {
          var newArray = this.__array__P_66_0.concat();
        }

        return new qx.data.Array(newArray);
      },

      /**
       * Returns the array as a string using the given connector string to
       * connect the values.
       *
       * @param connector {String} the string which should be used to past in
       *  between of the array values.
       *
       * @return {String} The array as a string.
       */
      join(connector) {
        return this.__array__P_66_0.join(connector);
      },

      /**
       * Removes and returns the last element of the array.
       * An change event will be fired.
       *
       * @return {var} The last element of the array.
       */
      pop() {
        var item = this.__array__P_66_0.pop();

        this.__updateLength__P_66_1(); // remove the possible added event listener


        this._registerEventChaining(null, item, this.length - 1); // fire change bubble event


        this.fireDataEvent("changeBubble", {
          value: [],
          name: this.length + "",
          old: [item],
          item: this
        });
        this.fireDataEvent("change", {
          start: this.length - 1,
          end: this.length - 1,
          type: "remove",
          removed: [item],
          added: []
        }, null);
        return item;
      },

      /**
       * Adds an element at the end of the array.
       *
       * @param varargs {var} Multiple elements. Every element will be added to
       *   the end of the array. An change event will be fired.
       *
       * @return {Number} The new length of the array.
       */
      push(varargs) {
        for (var i = 0; i < arguments.length; i++) {
          this.__array__P_66_0.push(arguments[i]);

          this.__updateLength__P_66_1(); // apply to every pushed item an event listener for the bubbling


          this._registerEventChaining(arguments[i], null, this.length - 1); // fire change bubbles event


          this.fireDataEvent("changeBubble", {
            value: [arguments[i]],
            name: this.length - 1 + "",
            old: [],
            item: this
          }); // fire change event

          this.fireDataEvent("change", {
            start: this.length - 1,
            end: this.length - 1,
            type: "add",
            added: [arguments[i]],
            removed: []
          }, null);
        }

        return this.length;
      },

      /**
       * Reverses the order of the array. An change event will be fired.
       */
      reverse() {
        // ignore on empty arrays
        if (this.length == 0) {
          return;
        }

        var oldArray = this.__array__P_66_0.concat();

        this.__array__P_66_0.reverse();

        this.__updateEventPropagation__P_66_2(0, this.length);

        this.fireDataEvent("change", {
          start: 0,
          end: this.length - 1,
          type: "order",
          added: [],
          removed: []
        }, null); // fire change bubbles event

        this.fireDataEvent("changeBubble", {
          value: this.__array__P_66_0,
          name: "0-" + (this.__array__P_66_0.length - 1),
          old: oldArray,
          item: this
        });
      },

      /**
       * Removes the first element of the array and returns it. An change event
       * will be fired.
       *
       * @return {var} the former first element.
       */
      shift() {
        // ignore on empty arrays
        if (this.length == 0) {
          return;
        }

        var item = this.__array__P_66_0.shift();

        this.__updateLength__P_66_1(); // remove the possible added event listener


        this._registerEventChaining(null, item, this.length - 1); // as every item has changed its position, we need to update the event bubbling


        this.__updateEventPropagation__P_66_2(0, this.length); // fire change bubbles event


        this.fireDataEvent("changeBubble", {
          value: [],
          name: "0",
          old: [item],
          item: this
        }); // fire change event

        this.fireDataEvent("change", {
          start: 0,
          end: this.length - 1,
          type: "remove",
          removed: [item],
          added: []
        }, null);
        return item;
      },

      /**
       * Returns a new array based on the range specified by the parameters.
       *
       * @param from {Number} The start index.
       * @param to {Number?null} The zero-based end index. <code>slice</code> extracts
       *   up to but not including <code>to</code>. If omitted, slice extracts to the
       *   end of the array.
       *
       * @return {qx.data.Array} A new array containing the given range of values.
       */
      slice(from, to) {
        return new qx.data.Array(this.__array__P_66_0.slice(from, to));
      },

      /**
       * Method to remove and add new elements to the array. A change event
       * will be fired for every removal or addition unless the array is
       * identical before and after splicing.
       *
       * @param startIndex {Integer} The index where the splice should start
       * @param amount {Integer} Defines number of elements which will be removed
       *   at the given position.
       * @param varargs {var} All following parameters will be added at the given
       *   position to the array.
       * @return {qx.data.Array} An data array containing the removed elements.
       *   Keep in to dispose this one, even if you don't use it!
       */
      splice(startIndex, amount, varargs) {
        // store the old length
        var oldLength = this.__array__P_66_0.length; // invoke the slice on the array

        var returnArray = this.__array__P_66_0.splice.apply(this.__array__P_66_0, arguments); // fire a change event for the length


        if (this.__array__P_66_0.length != oldLength) {
          this.__updateLength__P_66_1();
        } else if (amount == arguments.length - 2) {
          // if we added as much items as we removed
          var addedItems = qx.lang.Array.fromArguments(arguments, 2); // check if the array content equals the content before the operation

          for (var i = 0; i < addedItems.length; i++) {
            if (addedItems[i] !== returnArray[i]) {
              break;
            } // if all added and removed items are equal


            if (i == addedItems.length - 1) {
              // prevent all events and return a new array
              return new qx.data.Array();
            }
          }
        } // fire an event for the change


        var removed = amount > 0;
        var added = arguments.length > 2;

        if (removed || added) {
          var addedItems = qx.lang.Array.fromArguments(arguments, 2);
          let type;
          let end;

          if (returnArray.length == 0) {
            type = "add";
            end = startIndex + addedItems.length;
          } else if (addedItems.length == 0) {
            type = "remove";
            end = this.length - 1;
          } else {
            type = "add/remove";
            end = startIndex + Math.max(addedItems.length, returnArray.length) - 1;
          }

          this.fireDataEvent("change", {
            start: startIndex,
            end: end,
            type: type,
            added: addedItems,
            removed: returnArray
          }, null);
        } // remove the listeners first [BUG #7132]


        for (var i = 0; i < returnArray.length; i++) {
          this._registerEventChaining(null, returnArray[i], i);
        } // add listeners


        for (var i = 2; i < arguments.length; i++) {
          this._registerEventChaining(arguments[i], null, startIndex + (i - 2));
        } // apply event chaining for every item moved


        this.__updateEventPropagation__P_66_2(startIndex + (arguments.length - 2) - amount, this.length); // fire the changeBubble event


        if (removed || added) {
          var value = [];

          for (var i = 2; i < arguments.length; i++) {
            value[i - 2] = arguments[i];
          }

          var endIndex = startIndex + Math.max(arguments.length - 3, amount - 1);
          var name = startIndex == endIndex ? endIndex : startIndex + "-" + endIndex;
          var eventData = {
            value: value,
            name: name + "",
            old: returnArray,
            item: this
          };
          this.fireDataEvent("changeBubble", eventData);
        }

        return new qx.data.Array(returnArray);
      },

      /**
       * Efficiently replaces the array with the contents of src; this will suppress the
       * change event if the array contents are the same, and will make sure that only
       * one change event is fired
       *
       * @param src {qx.data.Array|Array} the new value to set the array to
       */
      replace(src) {
        src = qx.lang.Array.toNativeArray(src);

        if (this.equals(src)) {
          return;
        }

        var args = [0, this.getLength()];
        src.forEach(function (item) {
          args.push(item);
        });
        this.splice.apply(this, args);
      },

      /**
       * Sorts the array. If a function is given, this will be used to
       * compare the items. <code>changeBubble</code> event will only be fired,
       * if sorting result differs from original array.
       *
       * @param func {Function} A compare function comparing two parameters and
       *   should return a number.
       */
      sort(func) {
        // ignore if the array is empty
        if (this.length == 0) {
          return;
        }

        var oldArray = this.__array__P_66_0.concat();

        this.__array__P_66_0.sort.apply(this.__array__P_66_0, arguments); // prevent changeBubble event if nothing has been changed


        if (qx.lang.Array.equals(this.__array__P_66_0, oldArray) === true) {
          return;
        }

        this.__updateEventPropagation__P_66_2(0, this.length);

        this.fireDataEvent("change", {
          start: 0,
          end: this.length - 1,
          type: "order",
          added: [],
          removed: []
        }, null); // fire change bubbles event

        this.fireDataEvent("changeBubble", {
          value: this.__array__P_66_0,
          name: "0-" + (this.length - 1),
          old: oldArray,
          item: this
        });
      },

      /**
       * Adds the given items to the beginning of the array. For every element,
       * a change event will be fired.
       *
       * @param varargs {var} As many elements as you want to add to the beginning.
       * @return {Integer} The new length of the array
       */
      unshift(varargs) {
        for (var i = arguments.length - 1; i >= 0; i--) {
          this.__array__P_66_0.unshift(arguments[i]);

          this.__updateLength__P_66_1(); // apply to every item an event listener for the bubbling


          this.__updateEventPropagation__P_66_2(0, this.length); // fire change bubbles event


          this.fireDataEvent("changeBubble", {
            value: [this.__array__P_66_0[0]],
            name: "0",
            old: [this.__array__P_66_0[1]],
            item: this
          }); // fire change event

          this.fireDataEvent("change", {
            start: 0,
            end: this.length - 1,
            type: "add",
            added: [arguments[i]],
            removed: []
          }, null);
        }

        return this.length;
      },

      /**
       * Returns the list data as native array. Beware of the fact that the
       * internal representation will be returned and any manipulation of that
       * can cause a misbehavior of the array. This method should only be used for
       * debugging purposes.
       *
       * @return {Array} The native array.
       */
      toArray() {
        return this.__array__P_66_0;
      },

      /**
       * Replacement function for the getting of the array value.
       * array[0] should be array.getItem(0).
       *
       * @param index {Number} The index requested of the array element.
       *
       * @return {var} The element at the given index.
       */
      getItem(index) {
        return this.__array__P_66_0[index];
      },

      /**
       * Replacement function for the setting of an array value.
       * array[0] = "a" should be array.setItem(0, "a").
       * A change event will be fired if the value changes. Setting the same
       * value again will not lead to a change event.
       *
       * @param index {Number} The index of the array element.
       * @param item {var} The new item to set.
       */
      setItem(index, item) {
        var oldItem = this.__array__P_66_0[index]; // ignore settings of already set items [BUG #4106]

        if (oldItem === item) {
          return;
        }

        this.__array__P_66_0[index] = item; // set an event listener for the bubbling

        this._registerEventChaining(item, oldItem, index); // only update the length if its changed


        if (this.length != this.__array__P_66_0.length) {
          this.__updateLength__P_66_1();
        } // fire change bubbles event


        this.fireDataEvent("changeBubble", {
          value: [item],
          name: index + "",
          old: [oldItem],
          item: this
        }); // fire change event

        this.fireDataEvent("change", {
          start: index,
          end: index,
          type: "add/remove",
          added: [item],
          removed: [oldItem]
        }, null);
      },

      /**
       * This method returns the current length stored under .length on each
       * array.
       *
       * @return {Number} The current length of the array.
       */
      getLength() {
        return this.length;
      },

      /**
       * Returns the index of the item in the array. If the item is not in the
       * array, -1 will be returned.
       *
       * @param item {var} The item of which the index should be returned.
       * @return {Number} The Index of the given item.
       */
      indexOf(item) {
        return this.__array__P_66_0.indexOf(item);
      },

      /**
       * Returns the last index of the item in the array. If the item is not in the
       * array, -1 will be returned.
       *
       * @param item {var} The item of which the index should be returned.
       * @return {Number} The Index of the given item.
       */
      lastIndexOf(item) {
        return this.__array__P_66_0.lastIndexOf(item);
      },

      /**
       * Returns the toString of the original Array
       * @return {String} The array as a string.
       */
      toString() {
        if (this.__array__P_66_0 != null) {
          return this.__array__P_66_0.toString();
        }

        return "";
      },

      /*
      ---------------------------------------------------------------------------
         IMPLEMENTATION OF THE QX.LANG.ARRAY METHODS
      ---------------------------------------------------------------------------
      */

      /**
       * Check if the given item is in the current array.
       *
       * @deprecated {6.0} Please use the include method instead
       *
       * @param item {var} The item which is possibly in the array.
       * @return {Boolean} true, if the array contains the given item.
       */
      contains(item) {
        return this.includes(item);
      },

      /**
       * Check if the given item is in the current array.
       *
       * @param item {var} The item which is possibly in the array.
       * @return {Boolean} true, if the array contains the given item.
       */
      includes(item) {
        return this.__array__P_66_0.indexOf(item) !== -1;
      },

      /**
       * Return a copy of the given arr
       *
       * @return {qx.data.Array} copy of this
       */
      copy() {
        return this.concat();
      },

      /**
       * Insert an element at a given position.
       *
       * @param index {Integer} Position where to insert the item.
       * @param item {var} The element to insert.
       */
      insertAt(index, item) {
        this.splice(index, 0, item).dispose();
      },

      /**
       * Insert an item into the array before a given item.
       *
       * @param before {var} Insert item before this object.
       * @param item {var} The item to be inserted.
       */
      insertBefore(before, item) {
        var index = this.indexOf(before);

        if (index == -1) {
          this.push(item);
        } else {
          this.splice(index, 0, item).dispose();
        }
      },

      /**
       * Insert an element into the array after a given item.
       *
       * @param after {var} Insert item after this object.
       * @param item {var} Object to be inserted.
       */
      insertAfter(after, item) {
        var index = this.indexOf(after);

        if (index == -1 || index == this.length - 1) {
          this.push(item);
        } else {
          this.splice(index + 1, 0, item).dispose();
        }
      },

      /**
       * Remove an element from the array at the given index.
       *
       * @param index {Integer} Index of the item to be removed.
       * @return {var} The removed item.
       */
      removeAt(index) {
        var returnArray = this.splice(index, 1);
        var item = returnArray.getItem(0);
        returnArray.dispose();
        return item;
      },

      /**
       * Remove all elements from the array.
       *
       * @return {Array} A native array containing the removed elements.
       */
      removeAll() {
        // remove all possible added event listeners
        for (var i = 0; i < this.__array__P_66_0.length; i++) {
          this._registerEventChaining(null, this.__array__P_66_0[i], i);
        } // ignore if array is empty


        if (this.getLength() == 0) {
          return [];
        } // store the old data


        var oldLength = this.getLength();

        var items = this.__array__P_66_0.concat(); // change the length


        this.__array__P_66_0.length = 0;

        this.__updateLength__P_66_1(); // fire change bubbles event


        this.fireDataEvent("changeBubble", {
          value: [],
          name: "0-" + (oldLength - 1),
          old: items,
          item: this
        }); // fire the change event

        this.fireDataEvent("change", {
          start: 0,
          end: oldLength - 1,
          type: "remove",
          removed: items,
          added: []
        }, null);
        return items;
      },

      /**
       * Append the items of the given array.
       *
       * @param array {Array|qx.data.IListData} The items of this array will
       * be appended.
       * @throws {Error} if the argument is not an array.
       */
      append(array) {
        // qooxdoo array support
        array = qx.lang.Array.toNativeArray(array); // this check is important because opera throws an uncatchable error if
        // apply is called without an array as argument.

        {
          qx.core.Assert.assertArray(array, "The parameter must be an array.");
        }
        var oldLength = this.__array__P_66_0.length;
        Array.prototype.push.apply(this.__array__P_66_0, array); // add a listener to the new items

        for (var i = 0; i < array.length; i++) {
          this._registerEventChaining(array[i], null, oldLength + i);
        }

        var oldLength = this.length;

        this.__updateLength__P_66_1(); // fire change bubbles


        var name = oldLength == this.length - 1 ? oldLength : oldLength + "-" + (this.length - 1);
        this.fireDataEvent("changeBubble", {
          value: array,
          name: name + "",
          old: [],
          item: this
        }); // fire the change event

        this.fireDataEvent("change", {
          start: oldLength,
          end: this.length - 1,
          type: "add",
          added: array,
          removed: []
        }, null);
      },

      /**
       * Removes all elements which are listed in the array.
       *
       * @param array {Array} the elements of this array will be excluded from this one
       */
      exclude(array) {
        array = qx.lang.Array.toNativeArray(array);
        array.forEach(function (item) {
          this.remove(item);
        }, this);
      },

      /**
       * Remove the given item.
       *
       * @param item {var} Item to be removed from the array.
       * @return {var} The removed item.
       */
      remove(item) {
        var index = this.indexOf(item);

        if (index != -1) {
          this.splice(index, 1).dispose();
          return item;
        }
      },

      /**
       * Check whether the given array has the same content as this.
       * Checks only the equality of the arrays' content.
       *
       * @param array {qx.data.Array} The array to check.
       * @return {Boolean} Whether the two arrays are equal.
       */
      equals(array) {
        if (this.length !== array.length) {
          return false;
        }

        array = qx.lang.Array.toNativeArray(array);

        for (var i = 0; i < this.length; i++) {
          if (this.getItem(i) !== array[i]) {
            return false;
          }
        }

        return true;
      },

      /**
       * Returns the sum of all values in the array. Supports
       * numeric values only.
       *
       * @return {Number} The sum of all values.
       */
      sum() {
        var result = 0;

        for (var i = 0; i < this.length; i++) {
          result += this.getItem(i);
        }

        return result;
      },

      /**
       * Returns the highest value in the given array.
       * Supports numeric values only.
       *
       * @return {Number | null} The highest of all values or undefined if the
       *   array is empty.
       */
      max() {
        var result = this.getItem(0);

        for (var i = 1; i < this.length; i++) {
          if (this.getItem(i) > result) {
            result = this.getItem(i);
          }
        }

        return result === undefined ? null : result;
      },

      /**
       * Returns the lowest value in the array. Supports
       * numeric values only.
       *
       * @return {Number | null} The lowest of all values or undefined
       *   if the array is empty.
       */
      min() {
        var result = this.getItem(0);

        for (var i = 1; i < this.length; i++) {
          if (this.getItem(i) < result) {
            result = this.getItem(i);
          }
        }

        return result === undefined ? null : result;
      },

      /**
       * Invokes the given function for every item in the array.
       *
       * @param callback {Function} The function which will be call for every
       *   item in the array. It will be invoked with three parameters:
       *   the item, the index and the array itself.
       * @param context {var?} The context in which the callback will be invoked.
       */
      forEach(callback, context) {
        this.__array__P_66_0.forEach((element, index) => callback.call(context, element, index, this));
      },

      /*
      ---------------------------------------------------------------------------
        Additional JS1.6 methods
      ---------------------------------------------------------------------------
      */

      /**
       * Creates a new array with all elements that pass the test implemented by
       * the provided function. It returns a new data array instance so make sure
       * to think about disposing it.
       * @param callback {Function} The test function, which will be executed for every
       *   item in the array. The function will have three arguments.
       *   <li><code>item</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param self {var?undefined} The context of the callback.
       * @return {qx.data.Array} A new array instance containing only the items
       *  which passed the test.
       */
      filter(callback, self) {
        return new qx.data.Array(this.__array__P_66_0.filter(callback, self));
      },

      /**
       * Creates a new array with the results of calling a provided function on every
       * element in this array. It returns a new data array instance so make sure
       * to think about disposing it.
       * @param callback {Function} The mapping function, which will be executed for every
       *   item in the array. The function will have three arguments.
       *   <li><code>item</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param self {var?undefined} The context of the callback.
       * @return {qx.data.Array} A new array instance containing the new created items.
       */
      map(callback, self) {
        return new qx.data.Array(this.__array__P_66_0.map(callback, self));
      },

      /**
       * Finds the first matching element in the array which passes the test implemented by the
       * provided function.
       * @param callback {Function} The test function, which will be executed for every
       *   item in the array. The function will have three arguments.
       *   <li><code>item</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param self {var?undefined} The context of the callback.
       * @return {var | undefined} The found item.
       */
      find(callback, self) {
        return this.__array__P_66_0.find(callback, self);
      },

      /**
       * Tests whether any element in the array passes the test implemented by the
       * provided function.
       * @param callback {Function} The test function, which will be executed for every
       *   item in the array. The function will have three arguments.
       *   <li><code>item</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param self {var?undefined} The context of the callback.
       * @return {Boolean} <code>true</code>, if any element passed the test function.
       */
      some(callback, self) {
        return this.__array__P_66_0.some(callback, self);
      },

      /**
       * Tests whether every element in the array passes the test implemented by the
       * provided function.
       * @param callback {Function} The test function, which will be executed for every
       *   item in the array. The function will have three arguments.
       *   <li><code>item</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param self {var?undefined} The context of the callback.
       * @return {Boolean} <code>true</code>, if every element passed the test function.
       */
      every(callback, self) {
        return this.__array__P_66_0.every(callback, self);
      },

      /**
       * Apply a function against an accumulator and each value of the array
       * (from left-to-right) as to reduce it to a single value.
       * @param callback {Function} The accumulator function, which will be
       *   executed for every item in the array. The function will have four arguments.
       *   <li><code>previousItem</code>: the previous item</li>
       *   <li><code>currentItem</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param initValue {var?undefined} Object to use as the first argument to the first
       *   call of the callback.
       * @return {var} The returned value of the last accumulator call.
       */
      reduce(callback, initValue) {
        return this.__array__P_66_0.reduce(callback, initValue);
      },

      /**
       * Apply a function against an accumulator and each value of the array
       * (from right-to-left) as to reduce it to a single value.
       * @param callback {Function} The accumulator function, which will be
       *   executed for every item in the array. The function will have four arguments.
       *   <li><code>previousItem</code>: the previous item</li>
       *   <li><code>currentItem</code>: the current item in the array</li>
       *   <li><code>index</code>: the index of the current item</li>
       *   <li><code>array</code>: The native array instance, NOT the data array instance.</li>
       * @param initValue {var?undefined} Object to use as the first argument to the first
       *   call of the callback.
       * @return {var} The returned value of the last accumulator call.
       */
      reduceRight(callback, initValue) {
        return this.__array__P_66_0.reduceRight(callback, initValue);
      },

      /*
      ---------------------------------------------------------------------------
        INTERNAL HELPERS
      ---------------------------------------------------------------------------
      */

      /**
       * Internal function which updates the length property of the array.
       * Every time the length will be updated, a {@link #changeLength} data
       * event will be fired.
       */
      __updateLength__P_66_1() {
        var oldLength = this.length;
        this.length = this.__array__P_66_0.length;
        this.fireDataEvent("changeLength", this.length, oldLength);
      },

      /**
       * Helper to update the event propagation for a range of items.
       * @param from {Number} Start index.
       * @param to {Number} End index.
       */
      __updateEventPropagation__P_66_2(from, to) {
        for (var i = from; i < to; i++) {
          this._registerEventChaining(this.__array__P_66_0[i], this.__array__P_66_0[i], i);
        }
      }

    },

    /*
     *****************************************************************************
        DESTRUCTOR
     *****************************************************************************
    */
    destruct() {
      for (var i = 0; i < this.__array__P_66_0.length; i++) {
        var item = this.__array__P_66_0[i];

        this._applyEventPropagation(null, item, i); // dispose the items on auto dispose


        if (this.isAutoDisposeItems() && item && item instanceof qx.core.Object) {
          item.dispose();
        }
      }

      this.__array__P_66_0 = null;
    }

  });
  qx.data.Array.$$dbClassInfo = $$dbClassInfo;
})();

//# sourceMappingURL=Array.js.map?dt=1658886721855