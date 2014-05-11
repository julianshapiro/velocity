/****************
     jQuery utilities
     ****************/

    /* Whilst requiring the whole jQuery library as a dependency causes many problems, integrating key parts of it (the parts velocity actually uses.) */
    /* The following acts as a fallback in case jQuery isn't loaded, as to limit the overhead for the users using it anyway. */
    /* jQuery: Copyright The jQuery Foundation. MIT License: https://jquery.org/license */
    /* Zepto.js: Copyright Thomas Fuchs. MIT License: http://zeptojs.com/license/ */
    var $ = window.jQuery || (function() {
        /* Declaration of the actual jQuery-like object, window.jQuery */
        var $ = function (selector, context) {
            return new $.fn.init(selector, context);
        };

        /*****************
            $.methods()
         ****************/
        /* Creation of the fn prototype alias, used in the $().method calls */
        $.fn = $.prototype = {
            init: function(selector) {
                if (selector.nodeType) {
                    this[0] = selector;
                    return this;
                }
                throw new Error('The parameter given was not a DOM node.');
            },
            offset: function () {
            /* jQuery altered code */
                var box = this[0].getBoundingClientRect();

                return {
                    top: box.top  + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                    left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
                };
            },
            position: function () {
            /* jQuery/Zepto altered code */
                function offsetParent() {
                    var offsetParent = this.offsetParent || document;

                    while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                        offsetParent = offsetParent.offsetParent;
                    }
                    return offsetParent || document;
                }

                var elem = this[0],
                  // Get *real* offsetParent
                  offsetParent = offsetParent.apply(elem),
                  // Get correct offsets
                  offset       = this.offset(),
                  parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

                // Subtract element margins
                // note: when an element has margin: auto the offsetLeft and marginLeft
                // are the same in Safari causing offset.left to incorrectly be 0
                offset.top  -= parseFloat(elem.style.marginTop) || 0;
                offset.left -= parseFloat(elem.style.marginLeft) || 0;

                // Add offsetParent borders
                if(offsetParent.style) {
                    parentOffset.top  += parseFloat(offsetParent.style.borderTopWidth) || 0
                    parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
                }
                // Subtract the two offsets
                return {
                  top:  offset.top  - parentOffset.top,
                  left: offset.left - parentOffset.left
                }
            }
        };
        /* Makes $(nodeElement) possible, without having to call init. */
        $.fn.init.prototype = $.fn;

        /*****************
         Private methods
         ****************/

        var optionsCache = {},
            data = {},
            class2type = {}
            hasOwn = class2type.hasOwnProperty,
            toString = class2type.toString;

            
        "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(function(name) {
            class2type["[object " + name + "]"] = name.toLowerCase()
        });

        $.expando = "velocity" + (Math.random() + '').replace(/\D/g, "");
        $.cache = {};
        $.uuid = 1;

        function isArraylike(obj) {
            /* jQuery altered code */
            var length = obj.length,
                type = $.type(obj);

            if (type === "function" || $.isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 ||
                typeof length === "number" && length > 0 && (length - 1) in obj;
        }

        function createOptions(options) {
            /* jQuery original code */
            var object = optionsCache[options] = {};
            $.each(options.match(/\S+/g) || [], function(_, flag) {
                object[flag] = true;
            });
            return object;
        }

        /* Functions used in more than just one helper, so they weren't absorbed */
        $.isWindow = function (obj) {
            /* jQuery original code */
            /* jshint eqeqeq: false */
            return obj != null && obj == obj.window;
        };
        $.type = function (obj) {
            /* Zepto altered code */
            if (obj == null) {
                return obj + "";
            }

            return typeof obj === "object" || typeof obj === "function" ?
                class2type[toString.call(obj)] || "object" :
                typeof obj;
        };
        $.isArray = Array.isArray || function (obj) {
            /* jQuery original code */
            return $.type(obj) === "array";
        };
        $.camelCase = function (string) {
            /* jQuery altered code */
            return string.replace(/^-ms-/, "ms-")
                .replace(/-([\da-z])/gi, function(all, letter) {
                    return letter.toUpperCase();
                });
        };

        /*****************
            $.methods()
         ****************/
        /* Creation of the jQuery.methods()  */
        $.each = function(obj, callback, args) {
            /* jQuery altered code */
            var i = 0,
                isArray = isArraylike(obj);

            if (args) {
                if (isArray) {
                    for (; i < obj.length; i++) {
                        if ((callback.apply(obj[i], args)) === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        if ((callback.apply(obj[i], args)) === false) {
                            break;
                        }
                    }
                }
                // A special, fast, case for the most common use of each
            } else {
                if (isArray) {
                    for (; i < obj.length; i++) {
                        if ((callback.call(obj[i], i, obj[i])) === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        if ((callback.call(obj[i], i, obj[i])) === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        };
        $.data = function(node, name, value) {
            /* Zepto altered code */
            var id = node[$.expando] || (node[$.expando] = ++$.uuid),
                camelName = $.camelCase(name),
                store;
                /* $.getData() */
            if(value !== undefined) {
                store = data[id] || (data[id] = {});

                if (name !== undefined) {
                    store[camelName] = value;
                }

                return store;
            }

                /* $.setData() */
            store = id && data[id];
            if (store) {
                if (name in store) {
                    return store[name];
                }

                if (camelName in store) {
                    return store[camelName]
                }
            }
        };
        $.extend = function (target) {
            /* Zepto altered code */
            function extend (target, source, deep) {
                for (key in source) {
                    if (deep && ($.isPlainObject(source[key]) || $.isArray(source[key]))) {
                        if ($.isPlainObject(source[key]) && !$.isPlainObject(target[key]))
                            target[key] = {};
                        if ($.isArray(source[key]) && !$.isArray(target[key]))
                            target[key] = [];
                        extend(target[key], source[key], deep);
                    }
                    else if (source[key] !== undefined) target[key] = source[key];
                }
            }

            var deep, args = [].slice.call(arguments, 1);
            if (typeof target == 'boolean') {
                deep = target;
                target = args.shift();
            }

            $.each(args, function (_, arg) {
                extend(target, arg, deep)
            });
            return target;
        };
        $.queue = function (elem, type, data) {
            /* jQuery altered code */
            /* Courtesy of https://gist.github.com/zohararad/6291798 */
            if(elem) {
                function $makeArray (arr, results) {
                    var ret = results || [];

                    if (arr != null) {
                        if (isArraylike(Object(arr))) {
                            /* $.merge */
                            (function(first, second) {
                                /* jQuery altered code */
                                var l = second.length,
                                    i = first.length,
                                    j = 0;

                                if (typeof l === "number") {
                                    for (; j < l; j++) {
                                        first[i++] = second[j];
                                    }
                                } else {
                                    while (second[j] !== undefined) {
                                        first[i++] = second[j++];
                                    }
                                }

                                first.length = i;

                                return first;
                            })(ret, typeof arr === "string" ? [arr] : arr);
                        } else {
                            [].push.call(ret, arr);
                        }
                    }

                    return ret;
                }

                var queue;
                type = (type || "fx") + "queue";
                queue = $.data(elem, type);

                // Speed up dequeue by getting out quickly if this is just a lookup
                if (data) {
                    if (!queue || $.isArray(data)) {
                        queue =  $.data(elem, type, $makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        };
        $.dequeue = function (elem, type) {
            /* jQuery altered code */
            /* Courtesy of https://gist.github.com/zohararad/6291798 */
            type = type || "fx";

            var queue = $.queue(elem, type),
                startLength = queue.length,
                fn = queue.shift(),
                _queueHooks = function (elem, type) {
                    /* jQuery altered code */
                    var key = type + "queueHooks";
                    return $.data(elem, key) || $.data(elem, key, {
                        empty: $.Callbacks("once memory").add(function() {
                            $.removeData(elem, [type + "queue", key]);
                        })
                    });
                },
                hooks = _queueHooks(elem, type),
                next = function () {
                    $.dequeue(elem, type);
                };

            // If the fx queue is dequeued, always remove the progress sentinel
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }

            if (fn) {

                // Add a progress sentinel to prevent the fx queue from being
                // automatically dequeued
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                // clear up the last queue stop function
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }

            if (!startLength && hooks && hooks.empty) {
                hooks.empty.fire();
            }
        };
        $.isPlainObject = function (obj) {
            /* jQuery altered code */
            var key;

            // Must be an Object.
            // Because of IE, we also have to check the presence of the constructor property.
            // Make sure that DOM nodes and window objects don't pass through, as well
            if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
                return false;
            }

            try {
                // Not own constructor property must be Object
                if (obj.constructor &&
                    !hasOwn.call(obj, "constructor") &&
                    !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                // IE8,9 Will throw exceptions on certain host objects #9897
                return false;
            }

            // Own properties are enumerated firstly, so to speed up,
            // if last one is own, then all properties are own.
            for (key in obj) {}

            return key === undefined || hasOwn.call(obj, key);
        };
        $.isEmptyObject = function (obj) {
            /* jQuery original code */
            var name;
            for(name in obj) {
                return false;
            }
            return true;
        };

        $.removeData = function (node, names) {
            /* Zepto altered code */
            var id = node[$.expando],
                store = id && data[id];
            if (store) {
                $.each(names, function(_, name) {
                    delete store[name ? $.camelCase(this) : name];
                });
            }
        };

        $.Callbacks = function (options) {
            /* jQuery altered code */
            // Convert options from String-formatted to Object-formatted if needed
            // (we check in cache first)
            options = typeof options === "string" ?
                (optionsCache[options] || createOptions(options)) :
                $.extend({}, options);

            var // Flag to know if list is currently firing
                firing,
            // Last fire value (for non-forgettable lists)
                memory,
            // Flag to know if list was already fired
                fired,
            // End of the loop when firing
                firingLength,
            // Index of currently firing callback (modified by remove if needed)
                firingIndex,
            // First callback to fire (used internally by add and fireWith)
                firingStart,
            // Actual callback list
                list = [],
            // Stack of fire calls for repeatable lists
                stack = !options.once && [],
            // Fire callbacks
                fire = function (data) {
                    memory = options.memory && data;
                    fired = true;
                    firingIndex = firingStart || 0;
                    firingStart = 0;
                    firingLength = list.length;
                    firing = true;
                    for (; list && firingIndex < firingLength; firingIndex++) {
                        if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                            memory = false; // To prevent further calls using add
                            break;
                        }
                    }
                    firing = false;
                    if (list) {
                        if (stack) {
                            if (stack.length) {
                                fire(stack.shift());
                            }
                        } else if (memory) {
                            list = [];
                        } else {
                            self.disable();
                        }
                    }
                },
            // Actual Callbacks object
                self = {
                    // Add a callback or a collection of callbacks to the list
                    add: function () {
                        if (list) {
                            // First, we save the current length
                            var start = list.length;
                            (function add(args) {
                                $.each(args, function (_, arg) {
                                    var type = $.type(arg);
                                    if (type === "function") {
                                        if (!options.unique || !self.has(arg)) {
                                            list.push(arg);
                                        }
                                    } else if (arg && arg.length && type !== "string") {
                                        // Inspect recursively
                                        add(arg);
                                    }
                                });
                            })(arguments);
                            // Do we need to add the callbacks to the
                            // current firing batch?
                            if (firing) {
                                firingLength = list.length;
                                // With memory, if we're not firing then
                                // we should call right away
                            } else if (memory) {
                                firingStart = start;
                                fire(memory);
                            }
                        }
                        return this;
                    },
                    // Remove a callback from the list
                    remove: function () {
                        if (list) {
                            var $inArray = function (elem, arr, i) {
                                var len,
                                    indexOf = arr.indexOf || function (elem) {
                                        var i = 0,
                                            len = this.length;
                                        for (; i < len; i++) {
                                            if (this[i] === elem) {
                                                return i;
                                            }
                                        }
                                        return -1;
                                    };

                                if (arr) {
                                    if (indexOf) {
                                        return indexOf.call(arr, elem, i);
                                    }

                                    len = arr.length;
                                    i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

                                    for (; i < len; i++) {
                                        // Skip accessing in sparse arrays
                                        if (i in arr && arr[i] === elem) {
                                            return i;
                                        }
                                    }
                                }

                                return -1;
                            };
                            $.each(arguments, function (_, arg) {
                                var index;
                                while ((index = $inArray(arg, list, index)) > -1) {
                                    list.splice(index, 1);
                                    // Handle firing indexes
                                    if (firing) {
                                        if (index <= firingLength) {
                                            firingLength--;
                                        }
                                        if (index <= firingIndex) {
                                            firingIndex--;
                                        }
                                    }
                                }
                            });
                        }
                        return this;
                    },
                    // Remove all callbacks from the list
                    empty: function () {
                        list = [];
                        firingLength = 0;
                        return this;
                    },
                    // Call all callbacks with the given context and arguments
                    fireWith: function (context, args) {
                        if (list && (!fired || stack)) {
                            args = args || [];
                            args = [context, args.slice ? args.slice() : args];
                            if (firing) {
                                stack.push(args);
                            } else {
                                fire(args);
                            }
                        }
                        return this;
                    },
                    // Call all the callbacks with the given arguments
                    fire: function () {
                        self.fireWith(this, arguments);
                        return this;
                    }
                };

            return self;
        };

        return $;
    })();