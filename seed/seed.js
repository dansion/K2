/*!
 * Powered by YUI 3.3.0(include yui-base,get,features,yui-later,yui-throttle,loader-base,loader-yui3)
 * @revision:
 */

/*
 * @author:sanqi
 * @version:1-3-13
 * @modules:yui.js & loader.js & YUI_config for K2
 * @k2-patch: 2 in yui-base & 1 in loader-base, please search k2-patch
 */

//yui-base:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
/**
 * The YUI module contains the components required for building the YUI seed
 * file.  This includes the script loading mechanism, a simple queue, and
 * the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

if (typeof YUI != 'undefined') {
    YUI._YUI = YUI;
}

/**
 * The YUI global namespace object.  If YUI is already defined, the
 * existing YUI object will not be overwritten so that defined
 * namespaces are preserved.  It is the constructor for the object
 * the end user interacts with.  As indicated below, each instance
 * has full custom event support, but only if the event system
 * is available.  This is a self-instantiable factory function.  You
 * can invoke it directly like this:
 *
 * YUI().use('*', function(Y) {
 *   // ready
 * });
 *
 * But it also works like this:
 *
 * var Y = YUI();
 *
 * @class YUI
 * @constructor
 * @global
 * @uses EventTarget
 * @param o* {object} 0..n optional configuration objects.  these values
 * are store in Y.config.  See config for the list of supported
 * properties.
 */
    /*global YUI*/
    /*global YUI_config*/
    var YUI = function() {
        var i = 0,
            Y = this,
            args = arguments,
            l = args.length,
            instanceOf = function(o, type) {
                return (o && o.hasOwnProperty && (o instanceof type));
            },
            gconf = (typeof YUI_config !== 'undefined') && YUI_config;

        if (!(instanceOf(Y, YUI))) {
            Y = new YUI();
        } else {
            // set up the core environment
            Y._init();

            // YUI.GlobalConfig is a master configuration that might span
            // multiple contexts in a non-browser environment.  It is applied
            // first to all instances in all contexts.
            if (YUI.GlobalConfig) {
                Y.applyConfig(YUI.GlobalConfig);
            }

            // YUI_Config is a page-level config.  It is applied to all
            // instances created on the page.  This is applied after
            // YUI.GlobalConfig, and before the instance level configuration
            // objects.
            if (gconf) {
                Y.applyConfig(gconf);
            }

            // bind the specified additional modules for this instance
            if (!l) {
                Y._setup();
            }
        }

        if (l) {
            // Each instance can accept one or more configuration objects.
            // These are applied after YUI.GlobalConfig and YUI_Config,
            // overriding values set in those config files if there is a '
            // matching property.
            for (; i < l; i++) {
                Y.applyConfig(args[i]);
            }

            Y._setup();
        }

        Y.instanceOf = instanceOf;

        return Y;
    };

(function() {

    var proto, prop,
        VERSION = '3.3.0',
        PERIOD = '.',
        BASE = 'http://yui.yahooapis.com/',
        DOC_LABEL = 'yui3-js-enabled',
        NOOP = function() {},
        SLICE = Array.prototype.slice,
        APPLY_TO_AUTH = { 'io.xdrReady': 1,   // the functions applyTo
                          'io.xdrResponse': 1,   // can call. this should
                          'SWF.eventHandler': 1 }, // be done at build time
        hasWin = (typeof window != 'undefined'),
        win = (hasWin) ? window : null,
        doc = (hasWin) ? win.document : null,
        docEl = doc && doc.documentElement,
        docClass = docEl && docEl.className,
        instances = {},
        time = new Date().getTime(),
        add = function(el, type, fn, capture) {
            if (el && el.addEventListener) {
                el.addEventListener(type, fn, capture);
            } else if (el && el.attachEvent) {
                el.attachEvent('on' + type, fn);
            }
        },
        remove = function(el, type, fn, capture) {
            if (el && el.removeEventListener) {
                // this can throw an uncaught exception in FF
                try {
                    el.removeEventListener(type, fn, capture);
                } catch (ex) {}
            } else if (el && el.detachEvent) {
                el.detachEvent('on' + type, fn);
            }
        },
        handleLoad = function() {
            YUI.Env.windowLoaded = true;
            YUI.Env.DOMReady = true;
            if (hasWin) {
                remove(window, 'load', handleLoad);
            }
        },
        getLoader = function(Y, o) {
            var loader = Y.Env._loader;
            if (loader) {
                loader.ignoreRegistered = false;
                loader.onEnd = null;
                loader.data = null;
                loader.required = [];
                loader.loadType = null;
            } else {
                loader = new Y.Loader(Y.config);
                Y.Env._loader = loader;
            }

            return loader;
        },

        clobber = function(r, s) {
            for (var i in s) {
                if (s.hasOwnProperty(i)) {
                    r[i] = s[i];
                }
            }
        },

        ALREADY_DONE = { success: true };

//  Stamp the documentElement (HTML) with a class of "yui-loaded" to
//  enable styles that need to key off of JS being enabled.
if (docEl && docClass.indexOf(DOC_LABEL) == -1) {
    if (docClass) {
        docClass += ' ';
    }
    docClass += DOC_LABEL;
    docEl.className = docClass;
}

if (VERSION.indexOf('@') > -1) {
    VERSION = '3.2.0'; // dev time hack for cdn test
}

proto = {
    /**
     * Applies a new configuration object to the YUI instance config.
     * This will merge new group/module definitions, and will also
     * update the loader cache if necessary.  Updating Y.config directly
     * will not update the cache.
     * @method applyConfig
     * @param {object} the configuration object.
     * @since 3.2.0
     */
    applyConfig: function(o) {

        o = o || NOOP;

        var attr,
            name,
            // detail,
            config = this.config,
            mods = config.modules,
            groups = config.groups,
            rls = config.rls,
            loader = this.Env._loader;
        
        //k2-patch:set k2 base & combine:{{{
        //如果root存在，而base不存在，
        //那么就设置base = 'http://k.kbcdn.com/' + root，
        //这样就简化了所有位于k.kbcdn.com上的设置，即不需要再重复设置base了
        //设置默认的combine为true
        //console.debug(o);
        var k2Name,
            k2Groups,
            k2GroupName,
            k2SetConf = function(obj){
			       if(obj.root && !obj.base){
			         obj.base = 'http://k.kbcdn.com/' + obj.root;  
               if(typeof obj.combine === 'undefined'){
                  obj.combine = true;  
               }
			       }    
            };
        k2SetConf(o);
        for(k2Name in o ){
          if(o.hasOwnProperty(k2Name) && k2Name === 'groups'){
              k2Groups = o.groups;
              //console.debug(o.groups,'o.groups');
              for(k2GroupName in k2Groups){
                if(k2Groups.hasOwnProperty(k2GroupName)){
                  k2SetConf(k2Groups[k2GroupName]);
                }
              }    
          }  
        }
        //set k2 base & combine:}}}

        for (name in o) {
            if (o.hasOwnProperty(name)) {
                attr = o[name];
                if (mods && name == 'modules') {
                    clobber(mods, attr);
                } else if (groups && name == 'groups') {
                    clobber(groups, attr);
                } else if (rls && name == 'rls') {
                    clobber(rls, attr);
                } else if (name == 'win') {
                    config[name] = attr.contentWindow || attr;
                    config.doc = config[name].document;
                } else if (name == '_yuid') {
                    // preserve the guid
                } else {
                    config[name] = attr;
                }
            }
        }

        if (loader) {
            loader._config(o);
        }
    },

    _config: function(o) {
        this.applyConfig(o);
    },

    /**
     * Initialize this YUI instance
     * @private
     */
    _init: function() {
        var filter,
            Y = this,
            G_ENV = YUI.Env,
            Env = Y.Env,
            prop;

        /**
         * The version number of the YUI instance.
         * @property version
         * @type string
         */
        Y.version = VERSION;

        if (!Env) {
            Y.Env = {
                mods: {}, // flat module map
                versions: {}, // version module map
                base: BASE,
                cdn: BASE + VERSION + '/build/',
                // bootstrapped: false,
                _idx: 0,
                _used: {},
                _attached: {},
                _yidx: 0,
                _uidx: 0,
                _guidp: 'y',
                _loaded: {},
                serviced: {},
                getBase: G_ENV && G_ENV.getBase ||

    function(srcPattern, comboPattern) {
        var b, nodes, i, src, match;
        // get from querystring
        nodes = (doc && doc.getElementsByTagName('script')) || [];
        for (i = 0; i < nodes.length; i = i + 1) {
            src = nodes[i].src;
            if (src) {

                match = src.match(srcPattern);
                b = match && match[1];
                if (b) {
                    // this is to set up the path to the loader.  The file
                    // filter for loader should match the yui include.
                    filter = match[2];

                    if (filter) {
                        match = filter.indexOf('js');

                        if (match > -1) {
                            filter = filter.substr(0, match);
                        }
                    }

                    // extract correct path for mixed combo urls
                    // http://yuilibrary.com/projects/yui3/ticket/2528423
                    match = src.match(comboPattern);
                    if (match && match[3]) {
                        b = match[1] + match[3];
                    }

                    break;
                }
            }
        }

        // use CDN default
        return b || Env.cdn;
    }
            };

            Env = Y.Env;

            Env._loaded[VERSION] = {};

            if (G_ENV && Y !== YUI) {
                Env._yidx = ++G_ENV._yidx;
                Env._guidp = ('yui_' + VERSION + '_' +
                             Env._yidx + '_' + time).replace(/\./g, '_');
            } else if (YUI._YUI) {

                G_ENV = YUI._YUI.Env;
                Env._yidx += G_ENV._yidx;
                Env._uidx += G_ENV._uidx;

                for (prop in G_ENV) {
                    if (!(prop in Env)) {
                        Env[prop] = G_ENV[prop];
                    }
                }

                delete YUI._YUI;
            }

            Y.id = Y.stamp(Y);
            instances[Y.id] = Y;

        }

        Y.constructor = YUI;

        // configuration defaults
        Y.config = Y.config || {
            win: win,
            doc: doc,
            debug: true,
            useBrowserConsole: true,
            throwFail: true,
            bootstrap: true,
            cacheUse: true,
            fetchCSS: true
        };

        Y.config.base = YUI.config.base ||
            Y.Env.getBase(/^(.*)yui\/yui([\.\-].*)js(\?.*)?$/,
                          /^(.*\?)(.*\&)(.*)yui\/yui[\.\-].*js(\?.*)?$/);

        if (!filter || (!('-min.-debug.').indexOf(filter))) {
            filter = '-min.';
        }

        Y.config.loaderPath = YUI.config.loaderPath ||
            'loader/loader' + (filter || '-min.') + 'js';

    },

    /**
     * Finishes the instance setup. Attaches whatever modules were defined
     * when the yui modules was registered.
     * @method _setup
     * @private
     */
    _setup: function(o) {
        var i, Y = this,
            core = [],
            mods = YUI.Env.mods,
            extras = Y.config.core || ['get',
                                        'rls',
                                        'intl-base',
                                        'loader',
                                        'yui-log',
                                        'yui-later',
                                        'yui-throttle'];

        for (i = 0; i < extras.length; i++) {
            if (mods[extras[i]]) {
                core.push(extras[i]);
            }
        }

        Y._attach(['yui-base']);
        Y._attach(core);

    },

    /**
     * Executes a method on a YUI instance with
     * the specified id if the specified method is whitelisted.
     * @method applyTo
     * @param id {string} the YUI instance id.
     * @param method {string} the name of the method to exectute.
     * Ex: 'Object.keys'.
     * @param args {Array} the arguments to apply to the method.
     * @return {object} the return value from the applied method or null.
     */
    applyTo: function(id, method, args) {
        if (!(method in APPLY_TO_AUTH)) {
            this.log(method + ': applyTo not allowed', 'warn', 'yui');
            return null;
        }

        var instance = instances[id], nest, m, i;
        if (instance) {
            nest = method.split('.');
            m = instance;
            for (i = 0; i < nest.length; i = i + 1) {
                m = m[nest[i]];
                if (!m) {
                    this.log('applyTo not found: ' + method, 'warn', 'yui');
                }
            }
            return m.apply(instance, args);
        }

        return null;
    },

    /**
     * Registers a module with the YUI global.  The easiest way to create a
     * first-class YUI module is to use the YUI component build tool.
     *
     * http://yuilibrary.com/projects/builder
     *
     * The build system will produce the YUI.add wrapper for you module, along
     * with any configuration info required for the module.
     * @method add
     * @param name {string} module name.
     * @param fn {Function} entry point into the module that
     * is used to bind module to the YUI instance.
     * @param version {string} version string.
     * @param details {object} optional config data:
     * requires: features that must be present before this module can be
     * attached.
     * optional: optional features that should be present if loadOptional
     * is defined.  Note: modules are not often loaded this way in YUI 3,
     * but this field is still useful to inform the user that certain
     * features in the component will require additional dependencies.
     * use: features that are included within this module which need to
     * be attached automatically when this module is attached.  This
     * supports the YUI 3 rollup system -- a module with submodules
     * defined will need to have the submodules listed in the 'use'
     * config.  The YUI component build tool does this for you.
     * @return {YUI} the YUI instance.
     *
     */
    add: function(name, fn, version, details) {
        details = details || {};
        var env = YUI.Env,
            mod = {
                name: name,
                fn: fn,
                version: version,
                details: details
            },
            loader,
            i, versions = env.versions;

        env.mods[name] = mod;
        versions[version] = versions[version] || {};
        versions[version][name] = mod;

        for (i in instances) {
            if (instances.hasOwnProperty(i)) {
                loader = instances[i].Env._loader;
                if (loader) {
                    if (!loader.moduleInfo[name]) {
                        loader.addModule(details, name);
                    }
                }
            }
        }

        return this;
    },

    /**
     * Executes the function associated with each required
     * module, binding the module to the YUI instance.
     * @method _attach
     * @private
     */
    _attach: function(r, fromLoader) {
        var i, name, mod, details, req, use, after,
            mods = YUI.Env.mods,
            Y = this, j,
            done = Y.Env._attached,
            len = r.length, loader;


        for (i = 0; i < len; i++) {
            if (!done[r[i]]) {
                name = r[i];
                mod = mods[name];
                if (!mod) {
                    loader = Y.Env._loader;


                    if (!loader || !loader.moduleInfo[name]) {
                        Y.message('NOT loaded: ' + name, 'warn', 'yui');
                    }
                } else {
                    done[name] = true;
                    details = mod.details;
                    req = details.requires;
                    use = details.use;
                    after = details.after;

                    if (req) {
                        for (j = 0; j < req.length; j++) {
                            if (!done[req[j]]) {
                                if (!Y._attach(req)) {
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    if (after) {
                        for (j = 0; j < after.length; j++) {
                            if (!done[after[j]]) {
                                if (!Y._attach(after)) {
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    if (use) {
                        for (j = 0; j < use.length; j++) {
                            if (!done[use[j]]) {
                                if (!Y._attach(use)) {
                                    return false;
                                }
                                break;
                            }
                        }
                    }

                    if (mod.fn) {
                        try {
                            mod.fn(Y, name);
                        } catch (e) {
                            Y.error('Attach error: ' + name, e, name);
                            return false;
                        }
                    }

                }
            }
        }

        return true;
    },

    /**
     * Attaches one or more modules to the YUI instance.  When this
     * is executed, the requirements are analyzed, and one of
     * several things can happen:
     *
     * - All requirements are available on the page --  The modules
     *   are attached to the instance.  If supplied, the use callback
     *   is executed synchronously.
     *
     * - Modules are missing, the Get utility is not available OR
     *   the 'bootstrap' config is false -- A warning is issued about
     *   the missing modules and all available modules are attached.
     *
     * - Modules are missing, the Loader is not available but the Get
     *   utility is and boostrap is not false -- The loader is bootstrapped
     *   before doing the following....
     *
     * - Modules are missing and the Loader is available -- The loader
     *   expands the dependency tree and fetches missing modules.  When
     *   the loader is finshed the callback supplied to use is executed
     *   asynchronously.
     *
     * @param modules* {string} 1-n modules to bind (uses arguments array).
     * @param *callback {function} callback function executed when
     * the instance has the required functionality.  If included, it
     * must be the last parameter.
     * <code>
     * // loads and attaches drag and drop and its dependencies
     * YUI().use('dd', function(Y) &#123;&#125);
     * // attaches all modules that are available on the page
     * YUI().use('*', function(Y) &#123;&#125);
     * // intrinsic YUI gallery support (since 3.1.0)
     * YUI().use('gallery-yql', function(Y) &#123;&#125);
     * // intrinsic YUI 2in3 support (since 3.1.0)
     * YUI().use('yui2-datatable', function(Y) &#123;&#125);.
     * </code>
     *
     * @return {YUI} the YUI instance.
     */
    use: function() {
        var args = SLICE.call(arguments, 0),
            callback = args[args.length - 1],
            Y = this,
            key;

        // The last argument supplied to use can be a load complete callback
        if (Y.Lang.isFunction(callback)) {
            args.pop();
        } else {
            callback = null;
        }

        if (Y._loading) {
            Y._useQueue = Y._useQueue || new Y.Queue();
            Y._useQueue.add([args, callback]);
        } else {
            key = args.join();

            if (Y.config.cacheUse && Y.Env.serviced[key]) {
                Y._notify(callback, ALREADY_DONE, args);
            } else {
                Y._use(args, function(Y, response) {
                    if (Y.config.cacheUse) {
                        Y.Env.serviced[key] = true;
                    }
                    Y._notify(callback, response, args);
                });
            }
        }

        return Y;
    },

    _notify: function(callback, response, args) {
        if (!response.success && this.config.loadErrorFn) {
            this.config.loadErrorFn.call(this, this, callback, response, args);
        } else if (callback) {
            try {
                callback(this, response);
            } catch (e) {
                this.error('use callback error', e, args);
            }
        }
    },

    _use: function(args, callback) {

        if (!this.Array) {
            this._attach(['yui-base']);
        }

        var len, loader, handleBoot,
            Y = this,
            G_ENV = YUI.Env,
            mods = G_ENV.mods,
            Env = Y.Env,
            used = Env._used,
            queue = G_ENV._loaderQueue,
            firstArg = args[0],
            YArray = Y.Array,
            config = Y.config,
            boot = config.bootstrap,
            missing = [],
            r = [],
            ret = true,
            fetchCSS = config.fetchCSS,
            process = function(names, skip) {

                if (!names.length) {
                    return;
                }

                YArray.each(names, function(name) {

                    // add this module to full list of things to attach
                    if (!skip) {
                        r.push(name);
                    }

                    // only attach a module once
                    if (used[name]) {
                        return;
                    }

                    var m = mods[name], req, use;

                    if (m) {
                        used[name] = true;
                        req = m.details.requires;
                        use = m.details.use;
                    } else {
                        // CSS files don't register themselves, see if it has
                        // been loaded
                        if (!G_ENV._loaded[VERSION][name]) {
                            missing.push(name);
                        } else {
                            used[name] = true; // probably css
                        }
                    }

                    // make sure requirements are attached
                    if (req && req.length) {
                        process(req);
                    }

                    // make sure we grab the submodule dependencies too
                    if (use && use.length) {
                        process(use, 1);
                    }
                });
            },

            handleLoader = function(fromLoader) {
                var response = fromLoader || {
                        success: true,
                        msg: 'not dynamic'
                    },
                    redo, origMissing,
                    ret = true,
                    data = response.data;


                Y._loading = false;

                if (data) {
                    origMissing = missing;
                    missing = [];
                    r = [];
                    process(data);
                    redo = missing.length;
                    if (redo) {
                        if (missing.sort().join() ==
                                origMissing.sort().join()) {
                            redo = false;
                        }
                    }
                }

                if (redo && data) {
                    Y._loading = false;
                    Y._use(args, function() {
                        if (Y._attach(data)) {
                            Y._notify(callback, response, data);
                        }
                    });
                } else {
                    if (data) {
                        ret = Y._attach(data);
                    }
                    if (ret) {
                        Y._notify(callback, response, args);
                    }
                }

                if (Y._useQueue && Y._useQueue.size() && !Y._loading) {
                    Y._use.apply(Y, Y._useQueue.next());
                }

            };


        // YUI().use('*'); // bind everything available
        if (firstArg === '*') {
            ret = Y._attach(Y.Object.keys(mods));
            if (ret) {
                handleLoader();
            }
            return Y;
        }


        // use loader to expand dependencies and sort the
        // requirements if it is available.
        if (boot && Y.Loader && args.length) {
            loader = getLoader(Y);
            loader.require(args);
            loader.ignoreRegistered = true;
            loader.calculate(null, (fetchCSS) ? null : 'js');
            args = loader.sorted;
        }

        // process each requirement and any additional requirements
        // the module metadata specifies
        process(args);

        len = missing.length;

        if (len) {
            missing = Y.Object.keys(YArray.hash(missing));
            len = missing.length;
        }

        // dynamic load
        if (boot && len && Y.Loader) {
            Y._loading = true;
            loader = getLoader(Y);
            loader.onEnd = handleLoader;
            loader.context = Y;
            loader.data = args;
            loader.ignoreRegistered = false;
            loader.require(args);
            loader.insert(null, (fetchCSS) ? null : 'js');
            // loader.partial(missing, (fetchCSS) ? null : 'js');

        } else if (len && Y.config.use_rls) {

            // server side loader service
            Y.Get.script(Y._rls(args), {
                onEnd: function(o) {
                    handleLoader(o);
                },
                data: args
            });

        } else if (boot && len && Y.Get && !Env.bootstrapped) {

            Y._loading = true;

            handleBoot = function() {
                Y._loading = false;
                queue.running = false;
                Env.bootstrapped = true;
                if (Y._attach(['loader'])) {
                    Y._use(args, callback);
                }
            };

            if (G_ENV._bootstrapping) {
                queue.add(handleBoot);
            } else {
                G_ENV._bootstrapping = true;
                Y.Get.script(config.base + config.loaderPath, {
                    onEnd: handleBoot
                });
            }

        } else {
            ret = Y._attach(args);
            if (ret) {
                handleLoader();
            }
        }

        return Y;
    },


    /**
     * Returns the namespace specified and creates it if it doesn't exist
     * <pre>
     * YUI.namespace("property.package");
     * YUI.namespace("YAHOO.property.package");
     * </pre>
     * Either of the above would create YUI.property, then
     * YUI.property.package (YAHOO is scrubbed out, this is
     * to remain compatible with YUI2)
     *
     * Be careful when naming packages. Reserved words may work in some browsers
     * and not others. For instance, the following will fail in Safari:
     * <pre>
     * YUI.namespace("really.long.nested.namespace");
     * </pre>
     * This fails because "long" is a future reserved word in ECMAScript
     *
     * @method namespace
     * @param  {string*} arguments 1-n namespaces to create.
     * @return {object}  A reference to the last namespace object created.
     */
    namespace: function() {
        var a = arguments, o = this, i = 0, j, d, arg;
        for (; i < a.length; i++) {
            // d = ('' + a[i]).split('.');
            arg = a[i];
            if (arg.indexOf(PERIOD)) {
                d = arg.split(PERIOD);
                for (j = (d[0] == 'YAHOO') ? 1 : 0; j < d.length; j++) {
                    o[d[j]] = o[d[j]] || {};
                    o = o[d[j]];
                }
            } else {
                o[arg] = o[arg] || {};
            }
        }
        return o;
    },

    // this is replaced if the log module is included
    log: NOOP,
    message: NOOP,

    /**
     * Report an error.  The reporting mechanism is controled by
     * the 'throwFail' configuration attribute.  If throwFail is
     * not specified, the message is written to the Logger, otherwise
     * a JS error is thrown
     * @method error
     * @param msg {string} the error message.
     * @param e {Error|string} Optional JS error that was caught, or an error string.
     * @param data Optional additional info
     * and throwFail is specified, this error will be re-thrown.
     * @return {YUI} this YUI instance.
     */
    error: function(msg, e, data) {

        var Y = this, ret;

        if (Y.config.errorFn) {
            ret = Y.config.errorFn.apply(Y, arguments);
        }

        if (Y.config.throwFail && !ret) {
            throw (e || new Error(msg));
        } else {
            Y.message(msg, 'error'); // don't scrub this one
        }

        return Y;
    },

    /**
     * Generate an id that is unique among all YUI instances
     * @method guid
     * @param pre {string} optional guid prefix.
     * @return {string} the guid.
     */
    guid: function(pre) {
        var id = this.Env._guidp + (++this.Env._uidx);
        return (pre) ? (pre + id) : id;
    },

    /**
     * Returns a guid associated with an object.  If the object
     * does not have one, a new one is created unless readOnly
     * is specified.
     * @method stamp
     * @param o The object to stamp.
     * @param readOnly {boolean} if true, a valid guid will only
     * be returned if the object has one assigned to it.
     * @return {string} The object's guid or null.
     */
    stamp: function(o, readOnly) {
        var uid;
        if (!o) {
            return o;
        }

        // IE generates its own unique ID for dom nodes
        // The uniqueID property of a document node returns a new ID
        if (o.uniqueID && o.nodeType && o.nodeType !== 9) {
            uid = o.uniqueID;
        } else {
            uid = (typeof o === 'string') ? o : o._yuid;
        }

        if (!uid) {
            uid = this.guid();
            if (!readOnly) {
                try {
                    o._yuid = uid;
                } catch (e) {
                    uid = null;
                }
            }
        }
        return uid;
    },

    /**
     * Destroys the YUI instance
     * @method destroy
     * @since 3.3.0
     */
    destroy: function() {
        var Y = this;
        if (Y.Event) {
            Y.Event._unload();
        }
        delete instances[Y.id];
        delete Y.Env;
        delete Y.config;
    }

    /**
     * instanceof check for objects that works around
     * memory leak in IE when the item tested is
     * window/document
     * @method instanceOf
     * @since 3.3.0
     */
};



    YUI.prototype = proto;

    // inheritance utilities are not available yet
    for (prop in proto) {
        if (proto.hasOwnProperty(prop)) {
            YUI[prop] = proto[prop];
        }
    }

    // set up the environment
    YUI._init();

    if (hasWin) {
        // add a window load event at load time so we can capture
        // the case where it fires before dynamic loading is
        // complete.
        add(window, 'load', handleLoad);
    } else {
        handleLoad();
    }

    YUI.Env.add = add;
    YUI.Env.remove = remove;

    /*global exports*/
    // Support the CommonJS method for exporting our single global
    if (typeof exports == 'object') {
        exports.YUI = YUI;
    }

}());


/**
 * The config object contains all of the configuration options for
 * the YUI instance.  This object is supplied by the implementer
 * when instantiating a YUI instance.  Some properties have default
 * values if they are not supplied by the implementer.  This should
 * not be updated directly because some values are cached.  Use
 * applyConfig() to update the config object on a YUI instance that
 * has already been configured.
 *
 * @class config
 * @static
 */

/**
 * Allows the YUI seed file to fetch the loader component and library
 * metadata to dynamically load additional dependencies.
 *
 * @property bootstrap
 * @type boolean
 * @default true
 */

/**
 * Log to the browser console if debug is on and the browser has a
 * supported console.
 *
 * @property useBrowserConsole
 * @type boolean
 * @default true
 */

/**
 * A hash of log sources that should be logged.  If specified, only
 * log messages from these sources will be logged.
 *
 * @property logInclude
 * @type object
 */

/**
 * A hash of log sources that should be not be logged.  If specified,
 * all sources are logged if not on this list.
 *
 * @property logExclude
 * @type object
 */

/**
 * Set to true if the yui seed file was dynamically loaded in
 * order to bootstrap components relying on the window load event
 * and the 'domready' custom event.
 *
 * @property injected
 * @type boolean
 * @default false
 */

/**
 * If throwFail is set, Y.error will generate or re-throw a JS Error.
 * Otherwise the failure is logged.
 *
 * @property throwFail
 * @type boolean
 * @default true
 */

/**
 * The window/frame that this instance should operate in.
 *
 * @property win
 * @type Window
 * @default the window hosting YUI
 */

/**
 * The document associated with the 'win' configuration.
 *
 * @property doc
 * @type Document
 * @default the document hosting YUI
 */

/**
 * A list of modules that defines the YUI core (overrides the default).
 *
 * @property core
 * @type string[]
 */

/**
 * A list of languages in order of preference. This list is matched against
 * the list of available languages in modules that the YUI instance uses to
 * determine the best possible localization of language sensitive modules.
 * Languages are represented using BCP 47 language tags, such as "en-GB" for
 * English as used in the United Kingdom, or "zh-Hans-CN" for simplified
 * Chinese as used in China. The list can be provided as a comma-separated
 * list or as an array.
 *
 * @property lang
 * @type string|string[]
 */

/**
 * The default date format
 * @property dateFormat
 * @type string
 * @deprecated use configuration in DataType.Date.format() instead.
 */

/**
 * The default locale
 * @property locale
 * @type string
 * @deprecated use config.lang instead.
 */

/**
 * The default interval when polling in milliseconds.
 * @property pollInterval
 * @type int
 * @default 20
 */

/**
 * The number of dynamic nodes to insert by default before
 * automatically removing them.  This applies to script nodes
 * because remove the node will not make the evaluated script
 * unavailable.  Dynamic CSS is not auto purged, because removing
 * a linked style sheet will also remove the style definitions.
 * @property purgethreshold
 * @type int
 * @default 20
 */

/**
 * The default interval when polling in milliseconds.
 * @property windowResizeDelay
 * @type int
 * @default 40
 */

/**
 * Base directory for dynamic loading
 * @property base
 * @type string
 */

/*
 * The secure base dir (not implemented)
 * For dynamic loading.
 * @property secureBase
 * @type string
 */

/**
 * The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?
 * For dynamic loading.
 * @property comboBase
 * @type string
 */

/**
 * The root path to prepend to module path for the combo service.
 * Ex: 3.0.0b1/build/
 * For dynamic loading.
 * @property root
 * @type string
 */

/**
 * A filter to apply to result urls.  This filter will modify the default
 * path for all modules.  The default path for the YUI library is the
 * minified version of the files (e.g., event-min.js).  The filter property
 * can be a predefined filter or a custom filter.  The valid predefined
 * filters are:
 * <dl>
 *  <dt>DEBUG</dt>
 *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
 *      This option will automatically include the Logger widget</dd>
 *  <dt>RAW</dt>
 *  <dd>Selects the non-minified version of the library (e.g., event.js).</dd>
 * </dl>
 * You can also define a custom filter, which must be an object literal
 * containing a search expression and a replace string:
 * <pre>
 *  myFilter: &#123;
 *      'searchExp': "-min\\.js",
 *      'replaceStr': "-debug.js"
 *  &#125;
 * </pre>
 *
 * For dynamic loading.
 *
 * @property filter
 * @type string|object
 */

/**
 * The 'skin' config let's you configure application level skin
 * customizations.  It contains the following attributes which
 * can be specified to override the defaults:
 *
 *      // The default skin, which is automatically applied if not
 *      // overriden by a component-specific skin definition.
 *      // Change this in to apply a different skin globally
 *      defaultSkin: 'sam',
 *
 *      // This is combined with the loader base property to get
 *      // the default root directory for a skin.
 *      base: 'assets/skins/',
 *
 *      // Any component-specific overrides can be specified here,
 *      // making it possible to load different skins for different
 *      // components.  It is possible to load more than one skin
 *      // for a given component as well.
 *      overrides: {
 *          slider: ['capsule', 'round']
 *      }
 *
 * For dynamic loading.
 *
 *  @property skin
 */

/**
 * Hash of per-component filter specification.  If specified for a given
 * component, this overrides the filter config.
 *
 * For dynamic loading.
 *
 * @property filters
 */

/**
 * Use the YUI combo service to reduce the number of http connections
 * required to load your dependencies.  Turning this off will
 * disable combo handling for YUI and all module groups configured
 * with a combo service.
 *
 * For dynamic loading.
 *
 * @property combine
 * @type boolean
 * @default true if 'base' is not supplied, false if it is.
 */

/**
 * A list of modules that should never be dynamically loaded
 *
 * @property ignore
 * @type string[]
 */

/**
 * A list of modules that should always be loaded when required, even if already
 * present on the page.
 *
 * @property force
 * @type string[]
 */

/**
 * Node or id for a node that should be used as the insertion point for new
 * nodes.  For dynamic loading.
 *
 * @property insertBefore
 * @type string
 */

/**
 * Object literal containing attributes to add to dynamically loaded script
 * nodes.
 * @property jsAttributes
 * @type string
 */

/**
 * Object literal containing attributes to add to dynamically loaded link
 * nodes.
 * @property cssAttributes
 * @type string
 */

/**
 * Number of milliseconds before a timeout occurs when dynamically
 * loading nodes. If not set, there is no timeout.
 * @property timeout
 * @type int
 */

/**
 * Callback for the 'CSSComplete' event.  When dynamically loading YUI
 * components with CSS, this property fires when the CSS is finished
 * loading but script loading is still ongoing.  This provides an
 * opportunity to enhance the presentation of a loading page a little
 * bit before the entire loading process is done.
 *
 * @property onCSS
 * @type function
 */

/**
 * A hash of module definitions to add to the list of YUI components.
 * These components can then be dynamically loaded side by side with
 * YUI via the use() method. This is a hash, the key is the module
 * name, and the value is an object literal specifying the metdata
 * for the module.  * See Loader.addModule for the supported module
 * metadata fields.  Also @see groups, which provides a way to
 * configure the base and combo spec for a set of modules.
 * <code>
 * modules: {
 * &nbsp; mymod1: {
 * &nbsp;   requires: ['node'],
 * &nbsp;   fullpath: 'http://myserver.mydomain.com/mymod1/mymod1.js'
 * &nbsp; },
 * &nbsp; mymod2: {
 * &nbsp;   requires: ['mymod1'],
 * &nbsp;   fullpath: 'http://myserver.mydomain.com/mymod2/mymod2.js'
 * &nbsp; }
 * }
 * </code>
 *
 * @property modules
 * @type object
 */

/**
 * A hash of module group definitions.  It for each group you
 * can specify a list of modules and the base path and
 * combo spec to use when dynamically loading the modules.  @see
 * @see modules for the details about the modules part of the
 * group definition.
 * <code>
 * &nbsp; groups: {
 * &nbsp;     yui2: {
 * &nbsp;         // specify whether or not this group has a combo service
 * &nbsp;         combine: true,
 * &nbsp;
 * &nbsp;         // the base path for non-combo paths
 * &nbsp;         base: 'http://yui.yahooapis.com/2.8.0r4/build/',
 * &nbsp;
 * &nbsp;         // the path to the combo service
 * &nbsp;         comboBase: 'http://yui.yahooapis.com/combo?',
 * &nbsp;
 * &nbsp;         // a fragment to prepend to the path attribute when
 * &nbsp;         // when building combo urls
 * &nbsp;         root: '2.8.0r4/build/',
 * &nbsp;
 * &nbsp;         // the module definitions
 * &nbsp;         modules:  {
 * &nbsp;             yui2_yde: {
 * &nbsp;                 path: "yahoo-dom-event/yahoo-dom-event.js"
 * &nbsp;             },
 * &nbsp;             yui2_anim: {
 * &nbsp;                 path: "animation/animation.js",
 * &nbsp;                 requires: ['yui2_yde']
 * &nbsp;             }
 * &nbsp;         }
 * &nbsp;     }
 * &nbsp; }
 * </code>
 * @property modules
 * @type object
 */

/**
 * The loader 'path' attribute to the loader itself.  This is combined
 * with the 'base' attribute to dynamically load the loader component
 * when boostrapping with the get utility alone.
 *
 * @property loaderPath
 * @type string
 * @default loader/loader-min.js
 */

/**
 * Specifies whether or not YUI().use(...) will attempt to load CSS
 * resources at all.  Any truthy value will cause CSS dependencies
 * to load when fetching script.  The special value 'force' will
 * cause CSS dependencies to be loaded even if no script is needed.
 *
 * @property fetchCSS
 * @type boolean|string
 * @default true
 */

/**
 * The default gallery version to build gallery module urls
 * @property gallery
 * @type string
 * @since 3.1.0
 */

/**
 * The default YUI 2 version to build yui2 module urls.  This is for
 * intrinsic YUI 2 support via the 2in3 project.  Also @see the '2in3'
 * config for pulling different revisions of the wrapped YUI 2
 * modules.
 * @since 3.1.0
 * @property yui2
 * @type string
 * @default 2.8.1
 */

/**
 * The 2in3 project is a deployment of the various versions of YUI 2
 * deployed as first-class YUI 3 modules.  Eventually, the wrapper
 * for the modules will change (but the underlying YUI 2 code will
 * be the same), and you can select a particular version of
 * the wrapper modules via this config.
 * @since 3.1.0
 * @property 2in3
 * @type string
 * @default 1
 */

/**
 * Alternative console log function for use in environments without
 * a supported native console.  The function is executed in the
 * YUI instance context.
 * @since 3.1.0
 * @property logFn
 * @type Function
 */

/**
 * A callback to execute when Y.error is called.  It receives the
 * error message and an javascript error object if Y.error was
 * executed because a javascript error was caught.  The function
 * is executed in the YUI instance context.
 *
 * @since 3.2.0
 * @property errorFn
 * @type Function
 */

/**
 * A callback to execute when the loader fails to load one or
 * more resource.  This could be because of a script load
 * failure.  It can also fail if a javascript module fails
 * to register itself, but only when the 'requireRegistration'
 * is true.  If this function is defined, the use() callback will
 * only be called when the loader succeeds, otherwise it always
 * executes unless there was a javascript error when attaching
 * a module.
 *
 * @since 3.3.0
 * @property loadErrorFn
 * @type Function
 */

/**
 * When set to true, the YUI loader will expect that all modules
 * it is responsible for loading will be first-class YUI modules
 * that register themselves with the YUI global.  If this is
 * set to true, loader will fail if the module registration fails
 * to happen after the script is loaded.
 *
 * @since 3.3.0
 * @property requireRegistration
 * @type boolean
 * @default false
 */

/**
 * Cache serviced use() requests.
 * @since 3.3.0
 * @property cacheUse
 * @type boolean
 * @default true
 */

/**
 * The parameter defaults for the remote loader service.
 * Requires the rls submodule.  The properties that are
 * supported:
 * <pre>
 * m: comma separated list of module requirements.  This
 *    must be the param name even for custom implemetations.
 * v: the version of YUI to load.  Defaults to the version
 *    of YUI that is being used.
 * gv: the version of the gallery to load (@see the gallery config)
 * env: comma separated list of modules already on the page.
 *      this must be the param name even for custom implemetations.
 * lang: the languages supported on the page (@see the lang config)
 * '2in3v':  the version of the 2in3 wrapper to use (@see the 2in3 config).
 * '2v': the version of yui2 to use in the yui 2in3 wrappers
 *       (@see the yui2 config)
 * filt: a filter def to apply to the urls (@see the filter config).
 * filts: a list of custom filters to apply per module
 *        (@see the filters config).
 * tests: this is a map of conditional module test function id keys
 * with the values of 1 if the test passes, 0 if not.  This must be
 * the name of the querystring param in custom templates.
 *</pre>
 *
 * @since 3.2.0
 * @property rls
 */

/**
 * The base path to the remote loader service
 *
 * @since 3.2.0
 * @property rls_base
 */

/**
 * The template to use for building the querystring portion
 * of the remote loader service url.  The default is determined
 * by the rls config -- each property that has a value will be
 * represented.
 *
 * ex: m={m}&v={v}&env={env}&lang={lang}&filt={filt}&tests={tests}
 *
 *
 * @since 3.2.0
 * @property rls_tmpl
 */

/**
 * Configure the instance to use a remote loader service instead of
 * the client loader.
 *
 * @since 3.2.0
 * @property use_rls
 */
YUI.add('yui-base', function(Y) {

/*
 * YUI stub
 * @module yui
 * @submodule yui-base
 */
/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * Provides the language utilites and extensions used by the library
 * @class Lang
 * @static
 */
Y.Lang = Y.Lang || {};

var L = Y.Lang,

ARRAY = 'array',
BOOLEAN = 'boolean',
DATE = 'date',
ERROR = 'error',
FUNCTION = 'function',
NUMBER = 'number',
NULL = 'null',
OBJECT = 'object',
REGEX = 'regexp',
STRING = 'string',
STRING_PROTO = String.prototype,
TOSTRING = Object.prototype.toString,
UNDEFINED = 'undefined',

TYPES = {
    'undefined' : UNDEFINED,
    'number' : NUMBER,
    'boolean' : BOOLEAN,
    'string' : STRING,
    '[object Function]' : FUNCTION,
    '[object RegExp]' : REGEX,
    '[object Array]' : ARRAY,
    '[object Date]' : DATE,
    '[object Error]' : ERROR
},

TRIMREGEX = /^\s+|\s+$/g,
EMPTYSTRING = '',
SUBREGEX = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;

/**
 * Determines whether or not the provided item is an array.
 * Returns false for array-like collections such as the
 * function arguments collection or HTMLElement collection
 * will return false.  Use <code>Y.Array.test</code> if you
 * want to test for an array-like collection.
 * @method isArray
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is an array.
 */
// L.isArray = Array.isArray || function(o) {
//     return L.type(o) === ARRAY;
// };

L.isArray = function(o) {
    return L.type(o) === ARRAY;
};

/**
 * Determines whether or not the provided item is a boolean.
 * @method isBoolean
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a boolean.
 */
L.isBoolean = function(o) {
    return typeof o === BOOLEAN;
};

/**
 * <p>
 * Determines whether or not the provided item is a function.
 * Note: Internet Explorer thinks certain functions are objects:
 * </p>
 *
 * <pre>
 * var obj = document.createElement("object");
 * Y.Lang.isFunction(obj.getAttribute) // reports false in IE
 * &nbsp;
 * var input = document.createElement("input"); // append to body
 * Y.Lang.isFunction(input.focus) // reports false in IE
 * </pre>
 *
 * <p>
 * You will have to implement additional tests if these functions
 * matter to you.
 * </p>
 *
 * @method isFunction
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a function.
 */
L.isFunction = function(o) {
    return L.type(o) === FUNCTION;
};

/**
 * Determines whether or not the supplied item is a date instance.
 * @method isDate
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a date.
 */
L.isDate = function(o) {
    // return o instanceof Date;
    return L.type(o) === DATE && o.toString() !== 'Invalid Date' && !isNaN(o);
};

/**
 * Determines whether or not the provided item is null.
 * @method isNull
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is null.
 */
L.isNull = function(o) {
    return o === null;
};

/**
 * Determines whether or not the provided item is a legal number.
 * @method isNumber
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a number.
 */
L.isNumber = function(o) {
    return typeof o === NUMBER && isFinite(o);
};

/**
 * Determines whether or not the provided item is of type object
 * or function. Note that arrays are also objects, so
 * <code>Y.Lang.isObject([]) === true</code>.
 * @method isObject
 * @static
 * @param o The object to test.
 * @param failfn {boolean} fail if the input is a function.
 * @return {boolean} true if o is an object.
 */
L.isObject = function(o, failfn) {
    var t = typeof o;
    return (o && (t === OBJECT ||
        (!failfn && (t === FUNCTION || L.isFunction(o))))) || false;
};

/**
 * Determines whether or not the provided item is a string.
 * @method isString
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is a string.
 */
L.isString = function(o) {
    return typeof o === STRING;
};

/**
 * Determines whether or not the provided item is undefined.
 * @method isUndefined
 * @static
 * @param o The object to test.
 * @return {boolean} true if o is undefined.
 */
L.isUndefined = function(o) {
    return typeof o === UNDEFINED;
};

/**
 * Returns a string without any leading or trailing whitespace.  If
 * the input is not a string, the input will be returned untouched.
 * @method trim
 * @static
 * @param s {string} the string to trim.
 * @return {string} the trimmed string.
 */
L.trim = STRING_PROTO.trim ? function(s) {
    return (s && s.trim) ? s.trim() : s;
} : function (s) {
    try {
        return s.replace(TRIMREGEX, EMPTYSTRING);
    } catch (e) {
        return s;
    }
};

/**
 * Returns a string without any leading whitespace.
 * @method trimLeft
 * @static
 * @param s {string} the string to trim.
 * @return {string} the trimmed string.
 */
L.trimLeft = STRING_PROTO.trimLeft ? function (s) {
    return s.trimLeft();
} : function (s) {
    return s.replace(/^\s+/, '');
};

/**
 * Returns a string without any trailing whitespace.
 * @method trimRight
 * @static
 * @param s {string} the string to trim.
 * @return {string} the trimmed string.
 */
L.trimRight = STRING_PROTO.trimRight ? function (s) {
    return s.trimRight();
} : function (s) {
    return s.replace(/\s+$/, '');
};

/**
 * A convenience method for detecting a legitimate non-null value.
 * Returns false for null/undefined/NaN, true for other values,
 * including 0/false/''
 * @method isValue
 * @static
 * @param o The item to test.
 * @return {boolean} true if it is not null/undefined/NaN || false.
 */
L.isValue = function(o) {
    var t = L.type(o);
    switch (t) {
        case NUMBER:
            return isFinite(o);
        case NULL:
        case UNDEFINED:
            return false;
        default:
            return !!(t);
    }
};

/**
 * <p>
 * Returns a string representing the type of the item passed in.
 * </p>
 *
 * <p>
 * Known issues:
 * </p>
 *
 * <ul>
 *   <li>
 *     <code>typeof HTMLElementCollection</code> returns function in Safari, but
 *     <code>Y.type()</code> reports object, which could be a good thing --
 *     but it actually caused the logic in <code>Y.Lang.isObject</code> to fail.
 *   </li>
 * </ul>
 *
 * @method type
 * @param o the item to test.
 * @return {string} the detected type.
 * @static
 */
L.type = function(o) {
    return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? OBJECT : NULL);
};

/**
 * Lightweight version of <code>Y.substitute</code>. Uses the same template
 * structure as <code>Y.substitute</code>, but doesn't support recursion,
 * auto-object coersion, or formats.
 * @method sub
 * @param {string} s String to be modified.
 * @param {object} o Object containing replacement values.
 * @return {string} the substitute result.
 * @static
 * @since 3.2.0
 */
L.sub = function(s, o) {
    return ((s.replace) ? s.replace(SUBREGEX, function(match, key) {
        return (!L.isUndefined(o[key])) ? o[key] : match;
    }) : s);
};

/**
 * Returns the current time in milliseconds.
 * @method now
 * @return {int} the current date
 * @since 3.3.0
 */
L.now = Date.now || function () {
  return new Date().getTime();
};

/**
 * The YUI module contains the components required for building the YUI seed
 * file.  This includes the script loading mechanism, a simple queue, and the
 * core utilities for the library.
 * @module yui
 * @submodule yui-base
 */


var Native = Array.prototype, LENGTH = 'length',

/**
 * Adds the following array utilities to the YUI instance.  Additional
 * array helpers can be found in the collection component.
 * @class Array
 */

/**
 * Y.Array(o) returns an array:
 * - Arrays are return unmodified unless the start position is specified.
 * - "Array-like" collections (@see Array.test) are converted to arrays
 * - For everything else, a new array is created with the input as the sole
 *   item.
 * - The start position is used if the input is or is like an array to return
 *   a subset of the collection.
 *
 *   @todo this will not automatically convert elements that are also
 *   collections such as forms and selects.  Passing true as the third
 *   param will force a conversion.
 *
 * @method ()
 * @static
 *   @param {object} o the item to arrayify.
 *   @param {int} startIdx if an array or array-like, this is the start index.
 *   @param {boolean} arraylike if true, it forces the array-like fork.  This
 *   can be used to avoid multiple Array.test calls.
 *   @return {Array} the resulting array.
 */
YArray = function(o, startIdx, arraylike) {
    var t = (arraylike) ? 2 : YArray.test(o),
        l, a, start = startIdx || 0;

    if (t) {
        // IE errors when trying to slice HTMLElement collections
        try {
            return Native.slice.call(o, start);
        } catch (e) {
            a = [];
            l = o.length;
            for (; start < l; start++) {
                a.push(o[start]);
            }
            return a;
        }
    } else {
        return [o];
    }
};

Y.Array = YArray;

/**
 * Evaluates the input to determine if it is an array, array-like, or
 * something else.  This is used to handle the arguments collection
 * available within functions, and HTMLElement collections
 *
 * @method test
 * @static
 *
 * @todo current implementation (intenionally) will not implicitly
 * handle html elements that are array-like (forms, selects, etc).
 *
 * @param {object} o the object to test.
 *
 * @return {int} a number indicating the results:
 * 0: Not an array or an array-like collection
 * 1: A real array.
 * 2: array-like collection.
 */
YArray.test = function(o) {
    var r = 0;
    if (Y.Lang.isObject(o)) {
        if (Y.Lang.isArray(o)) {
            r = 1;
        } else {
            try {
                // indexed, but no tagName (element) or alert (window),
                // or functions without apply/call (Safari
                // HTMLElementCollection bug).
                if ((LENGTH in o) && !o.tagName && !o.alert && !o.apply) {
                    r = 2;
                }

            } catch (e) {}
        }
    }
    return r;
};

/**
 * Executes the supplied function on each item in the array.
 * @method each
 * @param {Array} a the array to iterate.
 * @param {Function} f the function to execute on each item.  The
 * function receives three arguments: the value, the index, the full array.
 * @param {object} o Optional context object.
 * @static
 * @return {YUI} the YUI instance.
 */
YArray.each = (Native.forEach) ?
    function(a, f, o) {
        Native.forEach.call(a || [], f, o || Y);
        return Y;
    } :
    function(a, f, o) {
        var l = (a && a.length) || 0, i;
        for (i = 0; i < l; i = i + 1) {
            f.call(o || Y, a[i], i, a);
        }
        return Y;
    };

/**
 * Returns an object using the first array as keys, and
 * the second as values.  If the second array is not
 * provided the value is set to true for each.
 * @method hash
 * @static
 * @param {Array} k keyset.
 * @param {Array} v optional valueset.
 * @return {object} the hash.
 */
YArray.hash = function(k, v) {
    var o = {}, l = k.length, vl = v && v.length, i;
    for (i = 0; i < l; i = i + 1) {
        o[k[i]] = (vl && vl > i) ? v[i] : true;
    }

    return o;
};

/**
 * Returns the index of the first item in the array
 * that contains the specified value, -1 if the
 * value isn't found.
 * @method indexOf
 * @static
 * @param {Array} a the array to search.
 * @param {any} val the value to search for.
 * @return {int} the index of the item that contains the value or -1.
 */
YArray.indexOf = (Native.indexOf) ?
    function(a, val) {
        return Native.indexOf.call(a, val);
    } :
    function(a, val) {
        for (var i = 0; i < a.length; i = i + 1) {
            if (a[i] === val) {
                return i;
            }
        }

        return -1;
    };

/**
 * Numeric sort convenience function.
 * Y.ArrayAssert.itemsAreEqual([1,2,3], [3,1,2].sort(Y.Array.numericSort));
 * @method numericSort
 * @static
 * @param {number} a a number.
 * @param {number} b a number.
 */
YArray.numericSort = function(a, b) {
    return (a - b);
};

/**
 * Executes the supplied function on each item in the array.
 * Returning true from the processing function will stop the
 * processing of the remaining items.
 * @method some
 * @param {Array} a the array to iterate.
 * @param {Function} f the function to execute on each item. The function
 * receives three arguments: the value, the index, the full array.
 * @param {object} o Optional context object.
 * @static
 * @return {boolean} true if the function returns true on
 * any of the items in the array.
 */
YArray.some = (Native.some) ?
    function(a, f, o) {
        return Native.some.call(a, f, o);
    } :
    function(a, f, o) {
        var l = a.length, i;
        for (i = 0; i < l; i = i + 1) {
            if (f.call(o, a[i], i, a)) {
                return true;
            }
        }
        return false;
    };

/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * A simple FIFO queue.  Items are added to the Queue with add(1..n items) and
 * removed using next().
 *
 * @class Queue
 * @constructor
 * @param {MIXED} item* 0..n items to seed the queue.
 */
function Queue() {
    this._init();
    this.add.apply(this, arguments);
}

Queue.prototype = {
    /**
     * Initialize the queue
     *
     * @method _init
     * @protected
     */
    _init: function() {
        /**
         * The collection of enqueued items
         *
         * @property _q
         * @type Array
         * @protected
         */
        this._q = [];
    },

    /**
     * Get the next item in the queue. FIFO support
     *
     * @method next
     * @return {MIXED} the next item in the queue.
     */
    next: function() {
        return this._q.shift();
    },

    /**
     * Get the last in the queue. LIFO support.
     *
     * @method last
     * @return {MIXED} the last item in the queue.
     */
    last: function() {
        return this._q.pop();
    },

    /**
     * Add 0..n items to the end of the queue.
     *
     * @method add
     * @param {MIXED} item* 0..n items.
     * @return {object} this queue.
     */
    add: function() {
        this._q.push.apply(this._q, arguments);

        return this;
    },

    /**
     * Returns the current number of queued items.
     *
     * @method size
     * @return {Number} The size.
     */
    size: function() {
        return this._q.length;
    }
};

Y.Queue = Queue;

YUI.Env._loaderQueue = YUI.Env._loaderQueue || new Queue();

/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

var CACHED_DELIMITER = '__',

/*
 * IE will not enumerate native functions in a derived object even if the
 * function was overridden.  This is a workaround for specific functions
 * we care about on the Object prototype.
 * @property _iefix
 * @for YUI
 * @param {Function} r  the object to receive the augmentation
 * @param {Function} s  the object that supplies the properties to augment
 * @private
 */
_iefix = function(r, s) {
    var fn = s.toString;
    if (Y.Lang.isFunction(fn) && fn != Object.prototype.toString) {
        r.toString = fn;
    }
};


/**
 * Returns a new object containing all of the properties of
 * all the supplied objects.  The properties from later objects
 * will overwrite those in earlier objects.  Passing in a
 * single object will create a shallow copy of it.  For a deep
 * copy, use clone.
 * @method merge
 * @for YUI
 * @param arguments {Object*} the objects to merge.
 * @return {object} the new merged object.
 */
Y.merge = function() {
    var a = arguments, o = {}, i, l = a.length;
    for (i = 0; i < l; i = i + 1) {
        Y.mix(o, a[i], true);
    }
    return o;
};

/**
 * Applies the supplier's properties to the receiver.  By default
 * all prototype and static propertes on the supplier are applied
 * to the corresponding spot on the receiver.  By default all
 * properties are applied, and a property that is already on the
 * reciever will not be overwritten.  The default behavior can
 * be modified by supplying the appropriate parameters.
 *
 * @todo add constants for the modes
 *
 * @method mix
 * @param {Function} r  the object to receive the augmentation.
 * @param {Function} s  the object that supplies the properties to augment.
 * @param ov {boolean} if true, properties already on the receiver
 * will be overwritten if found on the supplier.
 * @param wl {string[]} a whitelist.  If supplied, only properties in
 * this list will be applied to the receiver.
 * @param {int} mode what should be copies, and to where
 *        default(0): object to object
 *        1: prototype to prototype (old augment)
 *        2: prototype to prototype and object props (new augment)
 *        3: prototype to object
 *        4: object to prototype.
 * @param merge {boolean/int} merge objects instead of overwriting/ignoring.
 * A value of 2 will skip array merge
 * Used by Y.aggregate.
 * @return {object} the augmented object.
 */
Y.mix = function(r, s, ov, wl, mode, merge) {

    if (!s || !r) {
        return r || Y;
    }

    if (mode) {
        switch (mode) {
            case 1: // proto to proto
                return Y.mix(r.prototype, s.prototype, ov, wl, 0, merge);
            case 2: // object to object and proto to proto
                Y.mix(r.prototype, s.prototype, ov, wl, 0, merge);
                break; // pass through
            case 3: // proto to static
                return Y.mix(r, s.prototype, ov, wl, 0, merge);
            case 4: // static to proto
                return Y.mix(r.prototype, s, ov, wl, 0, merge);
            default:  // object to object is what happens below
        }
    }

    // Maybe don't even need this wl && wl.length check anymore??
    var i, l, p, type;

    if (wl && wl.length) {
        for (i = 0, l = wl.length; i < l; ++i) {
            p = wl[i];
            type = Y.Lang.type(r[p]);
            if (s.hasOwnProperty(p)) {
                if (merge && type == 'object') {
                    Y.mix(r[p], s[p]);
                } else if (ov || !(p in r)) {
                    r[p] = s[p];
                }
            }
        }
    } else {
        for (i in s) {
            // if (s.hasOwnProperty(i) && !(i in FROZEN)) {
            if (s.hasOwnProperty(i)) {
                // check white list if it was supplied
                // if the receiver has this property, it is an object,
                // and merge is specified, merge the two objects.
                if (merge && Y.Lang.isObject(r[i], true)) {
                    Y.mix(r[i], s[i], ov, wl, 0, true); // recursive
                // otherwise apply the property only if overwrite
                // is specified or the receiver doesn't have one.
                } else if (ov || !(i in r)) {
                    r[i] = s[i];
                }
                // if merge is specified and the receiver is an array,
                // append the array item
                // } else if (arr) {
                    // r.push(s[i]);
                // }
            }
        }

        if (Y.UA.ie) {
            _iefix(r, s);
        }
    }

    return r;
};

/**
 * Returns a wrapper for a function which caches the
 * return value of that function, keyed off of the combined
 * argument values.
 * @method cached
 * @param source {function} the function to memoize.
 * @param cache an optional cache seed.
 * @param refetch if supplied, this value is tested against the cached
 * value.  If the values are equal, the wrapped function is executed again.
 * @return {Function} the wrapped function.
 */
Y.cached = function(source, cache, refetch) {
    cache = cache || {};

    return function(arg1) {

        var k = (arguments.length > 1) ?
            Array.prototype.join.call(arguments, CACHED_DELIMITER) : arg1;

        if (!(k in cache) || (refetch && cache[k] == refetch)) {
            cache[k] = source.apply(source, arguments);
        }

        return cache[k];
    };

};

/**
 * The YUI module contains the components required for building the YUI
 * seed file.  This includes the script loading mechanism, a simple queue,
 * and the core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * Adds the following Object utilities to the YUI instance
 * @class Object
 */

/**
 * Y.Object(o) returns a new object based upon the supplied object.
 * @method ()
 * @static
 * @param o the supplier object.
 * @return {Object} the new object.
 */
var F = function() {},

// O = Object.create || function(o) {
//     F.prototype = o;
//     return new F();
// },

O = function(o) {
    F.prototype = o;
    return new F();
},

owns = function(o, k) {
    return o && o.hasOwnProperty && o.hasOwnProperty(k);
    // return Object.prototype.hasOwnProperty.call(o, k);
},

UNDEF,

/**
 * Extracts the keys, values, or size from an object
 *
 * @method _extract
 * @param o the object.
 * @param what what to extract (0: keys, 1: values, 2: size).
 * @return {boolean|Array} the extracted info.
 * @static
 * @private
 */
_extract = function(o, what) {
    var count = (what === 2), out = (count) ? 0 : [], i;

    for (i in o) {
        if (owns(o, i)) {
            if (count) {
                out++;
            } else {
                out.push((what) ? o[i] : i);
            }
        }
    }

    return out;
};

Y.Object = O;

/**
 * Returns an array containing the object's keys
 * @method keys
 * @static
 * @param o an object.
 * @return {string[]} the keys.
 */
// O.keys = Object.keys || function(o) {
//     return _extract(o);
// };

O.keys = function(o) {
    return _extract(o);
};

/**
 * Returns an array containing the object's values
 * @method values
 * @static
 * @param o an object.
 * @return {Array} the values.
 */
// O.values = Object.values || function(o) {
//     return _extract(o, 1);
// };

O.values = function(o) {
    return _extract(o, 1);
};

/**
 * Returns the size of an object
 * @method size
 * @static
 * @param o an object.
 * @return {int} the size.
 */
O.size = Object.size || function(o) {
    return _extract(o, 2);
};

/**
 * Returns true if the object contains a given key
 * @method hasKey
 * @static
 * @param o an object.
 * @param k the key to query.
 * @return {boolean} true if the object contains the key.
 */
O.hasKey = owns;
/**
 * Returns true if the object contains a given value
 * @method hasValue
 * @static
 * @param o an object.
 * @param v the value to query.
 * @return {boolean} true if the object contains the value.
 */
O.hasValue = function(o, v) {
    return (Y.Array.indexOf(O.values(o), v) > -1);
};

/**
 * Determines whether or not the property was added
 * to the object instance.  Returns false if the property is not present
 * in the object, or was inherited from the prototype.
 *
 * @method owns
 * @static
 * @param o {any} The object being testing.
 * @param p {string} the property to look for.
 * @return {boolean} true if the object has the property on the instance.
 */
O.owns = owns;

/**
 * Executes a function on each item. The function
 * receives the value, the key, and the object
 * as parameters (in that order).
 * @method each
 * @static
 * @param o the object to iterate.
 * @param f {Function} the function to execute on each item. The function
 * receives three arguments: the value, the the key, the full object.
 * @param c the execution context.
 * @param proto {boolean} include proto.
 * @return {YUI} the YUI instance.
 */
O.each = function(o, f, c, proto) {
    var s = c || Y, i;

    for (i in o) {
        if (proto || owns(o, i)) {
            f.call(s, o[i], i, o);
        }
    }
    return Y;
};

/**
 * Executes a function on each item, but halts if the
 * function returns true.  The function
 * receives the value, the key, and the object
 * as paramters (in that order).
 * @method some
 * @static
 * @param o the object to iterate.
 * @param f {Function} the function to execute on each item. The function
 * receives three arguments: the value, the the key, the full object.
 * @param c the execution context.
 * @param proto {boolean} include proto.
 * @return {boolean} true if any execution of the function returns true,
 * false otherwise.
 */
O.some = function(o, f, c, proto) {
    var s = c || Y, i;

    for (i in o) {
        if (proto || owns(o, i)) {
            if (f.call(s, o[i], i, o)) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Retrieves the sub value at the provided path,
 * from the value object provided.
 *
 * @method getValue
 * @static
 * @param o The object from which to extract the property value.
 * @param path {Array} A path array, specifying the object traversal path
 * from which to obtain the sub value.
 * @return {Any} The value stored in the path, undefined if not found,
 * undefined if the source is not an object.  Returns the source object
 * if an empty path is provided.
 */
O.getValue = function(o, path) {
    if (!Y.Lang.isObject(o)) {
        return UNDEF;
    }

    var i,
        p = Y.Array(path),
        l = p.length;

    for (i = 0; o !== UNDEF && i < l; i++) {
        o = o[p[i]];
    }

    return o;
};

/**
 * Sets the sub-attribute value at the provided path on the
 * value object.  Returns the modified value object, or
 * undefined if the path is invalid.
 *
 * @method setValue
 * @static
 * @param o             The object on which to set the sub value.
 * @param path {Array}  A path array, specifying the object traversal path
 *                      at which to set the sub value.
 * @param val {Any}     The new value for the sub-attribute.
 * @return {Object}     The modified object, with the new sub value set, or
 *                      undefined, if the path was invalid.
 */
O.setValue = function(o, path, val) {
    var i,
        p = Y.Array(path),
        leafIdx = p.length - 1,
        ref = o;

    if (leafIdx >= 0) {
        for (i = 0; ref !== UNDEF && i < leafIdx; i++) {
            ref = ref[p[i]];
        }

        if (ref !== UNDEF) {
            ref[p[i]] = val;
        } else {
            return UNDEF;
        }
    }

    return o;
};

/**
 * Returns true if the object has no properties of its own
 * @method isEmpty
 * @static
 * @return {boolean} true if the object is empty.
 * @since 3.2.0
 */
O.isEmpty = function(o) {
    for (var i in o) {
        if (owns(o, i)) {
            return false;
        }
    }
    return true;
};
/**
 * The YUI module contains the components required for building the YUI seed
 * file.  This includes the script loading mechanism, a simple queue, and the
 * core utilities for the library.
 * @module yui
 * @submodule yui-base
 */

/**
 * YUI user agent detection.
 * Do not fork for a browser if it can be avoided.  Use feature detection when
 * you can.  Use the user agent as a last resort.  UA stores a version
 * number for the browser engine, 0 otherwise.  This value may or may not map
 * to the version number of the browser using the engine.  The value is
 * presented as a float so that it can easily be used for boolean evaluation
 * as well as for looking for a particular range of versions.  Because of this,
 * some of the granularity of the version info may be lost (e.g., Gecko 1.8.0.9
 * reports 1.8).
 * @class UA
 * @static
 */
/**
* Static method for parsing the UA string. Defaults to assigning it's value to Y.UA
* @static
* @method Env.parseUA
* @param {String} subUA Parse this UA string instead of navigator.userAgent
* @returns {Object} The Y.UA object
*/
YUI.Env.parseUA = function(subUA) {
    
    var numberify = function(s) {
            var c = 0;
            return parseFloat(s.replace(/\./g, function() {
                return (c++ == 1) ? '' : '.';
            }));
        },

        win = Y.config.win,

        nav = win && win.navigator,

        o = {

        /**
         * Internet Explorer version number or 0.  Example: 6
         * @property ie
         * @type float
         * @static
         */
        ie: 0,

        /**
         * Opera version number or 0.  Example: 9.2
         * @property opera
         * @type float
         * @static
         */
        opera: 0,

        /**
         * Gecko engine revision number.  Will evaluate to 1 if Gecko
         * is detected but the revision could not be found. Other browsers
         * will be 0.  Example: 1.8
         * <pre>
         * Firefox 1.0.0.4: 1.7.8   <-- Reports 1.7
         * Firefox 1.5.0.9: 1.8.0.9 <-- 1.8
         * Firefox 2.0.0.3: 1.8.1.3 <-- 1.81
         * Firefox 3.0   <-- 1.9
         * Firefox 3.5   <-- 1.91
         * </pre>
         * @property gecko
         * @type float
         * @static
         */
        gecko: 0,

        /**
         * AppleWebKit version.  KHTML browsers that are not WebKit browsers
         * will evaluate to 1, other browsers 0.  Example: 418.9
         * <pre>
         * Safari 1.3.2 (312.6): 312.8.1 <-- Reports 312.8 -- currently the
         *                                   latest available for Mac OSX 10.3.
         * Safari 2.0.2:         416     <-- hasOwnProperty introduced
         * Safari 2.0.4:         418     <-- preventDefault fixed
         * Safari 2.0.4 (419.3): 418.9.1 <-- One version of Safari may run
         *                                   different versions of webkit
         * Safari 2.0.4 (419.3): 419     <-- Tiger installations that have been
         *                                   updated, but not updated
         *                                   to the latest patch.
         * Webkit 212 nightly:   522+    <-- Safari 3.0 precursor (with native
         * SVG and many major issues fixed).
         * Safari 3.0.4 (523.12) 523.12  <-- First Tiger release - automatic
         * update from 2.x via the 10.4.11 OS patch.
         * Webkit nightly 1/2008:525+    <-- Supports DOMContentLoaded event.
         *                                   yahoo.com user agent hack removed.
         * </pre>
         * http://en.wikipedia.org/wiki/Safari_version_history
         * @property webkit
         * @type float
         * @static
         */
        webkit: 0,

        /**
         * Chrome will be detected as webkit, but this property will also
         * be populated with the Chrome version number
         * @property chrome
         * @type float
         * @static
         */
        chrome: 0,

        /**
         * The mobile property will be set to a string containing any relevant
         * user agent information when a modern mobile browser is detected.
         * Currently limited to Safari on the iPhone/iPod Touch, Nokia N-series
         * devices with the WebKit-based browser, and Opera Mini.
         * @property mobile
         * @type string
         * @static
         */
        mobile: null,

        /**
         * Adobe AIR version number or 0.  Only populated if webkit is detected.
         * Example: 1.0
         * @property air
         * @type float
         */
        air: 0,
        /**
         * Detects Apple iPad's OS version
         * @property ipad
         * @type float
         * @static
         */
        ipad: 0,
        /**
         * Detects Apple iPhone's OS version
         * @property iphone
         * @type float
         * @static
         */
        iphone: 0,
        /**
         * Detects Apples iPod's OS version
         * @property ipod
         * @type float
         * @static
         */
        ipod: 0,
        /**
         * General truthy check for iPad, iPhone or iPod
         * @property ios
         * @type float
         * @static
         */
        ios: null,
        /**
         * Detects Googles Android OS version
         * @property android
         * @type float
         * @static
         */
        android: 0,
        /**
         * Detects Palms WebOS version
         * @property webos
         * @type float
         * @static
         */
        webos: 0,

        /**
         * Google Caja version number or 0.
         * @property caja
         * @type float
         */
        caja: nav && nav.cajaVersion,

        /**
         * Set to true if the page appears to be in SSL
         * @property secure
         * @type boolean
         * @static
         */
        secure: false,

        /**
         * The operating system.  Currently only detecting windows or macintosh
         * @property os
         * @type string
         * @static
         */
        os: null

    },

    ua = subUA || nav && nav.userAgent,

    loc = win && win.location,

    href = loc && loc.href,

    m;

    o.secure = href && (href.toLowerCase().indexOf('https') === 0);

    if (ua) {

        if ((/windows|win32/i).test(ua)) {
            o.os = 'windows';
        } else if ((/macintosh/i).test(ua)) {
            o.os = 'macintosh';
        } else if ((/rhino/i).test(ua)) {
            o.os = 'rhino';
        }

        // Modern KHTML browsers should qualify as Safari X-Grade
        if ((/KHTML/).test(ua)) {
            o.webkit = 1;
        }
        // Modern WebKit browsers are at least X-Grade
        m = ua.match(/AppleWebKit\/([^\s]*)/);
        if (m && m[1]) {
            o.webkit = numberify(m[1]);

            // Mobile browser check
            if (/ Mobile\//.test(ua)) {
                o.mobile = 'Apple'; // iPhone or iPod Touch

                m = ua.match(/OS ([^\s]*)/);
                if (m && m[1]) {
                    m = numberify(m[1].replace('_', '.'));
                }
                o.ios = m;
                o.ipad = o.ipod = o.iphone = 0;

                m = ua.match(/iPad|iPod|iPhone/);
                if (m && m[0]) {
                    o[m[0].toLowerCase()] = o.ios;
                }
            } else {
                m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/);
                if (m) {
                    // Nokia N-series, Android, webOS, ex: NokiaN95
                    o.mobile = m[0];
                }
                if (/webOS/.test(ua)) {
                    o.mobile = 'WebOS';
                    m = ua.match(/webOS\/([^\s]*);/);
                    if (m && m[1]) {
                        o.webos = numberify(m[1]);
                    }
                }
                if (/ Android/.test(ua)) {
                    o.mobile = 'Android';
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        o.android = numberify(m[1]);
                    }

                }
            }

            m = ua.match(/Chrome\/([^\s]*)/);
            if (m && m[1]) {
                o.chrome = numberify(m[1]); // Chrome
            } else {
                m = ua.match(/AdobeAIR\/([^\s]*)/);
                if (m) {
                    o.air = m[0]; // Adobe AIR 1.0 or better
                }
            }
        }

        if (!o.webkit) { // not webkit
// @todo check Opera/8.01 (J2ME/MIDP; Opera Mini/2.0.4509/1316; fi; U; ssr)
            m = ua.match(/Opera[\s\/]([^\s]*)/);
            if (m && m[1]) {
                o.opera = numberify(m[1]);
                m = ua.match(/Opera Mini[^;]*/);
                if (m) {
                    o.mobile = m[0]; // ex: Opera Mini/2.0.4509/1316
                }
            } else { // not opera or webkit
                m = ua.match(/MSIE\s([^;]*)/);
                if (m && m[1]) {

                    //k2-patch:start:fix Y.UA.ie:{{{
                    //o.ie=numberify(m[1]);

									  //Fixed YAHOO.env.ua.ie bug in IE8
									  //http://yuilibrary.com/projects/yui3/ticket/2529670
									  //当系统是IE6，而浏览器是遨游2.5.11时，默认的UA是IE7
                    var _fixed_ie = numberify(m[1]);
									  if(document.documentMode){
									    var _documentMode = document.documentMode;
									    if(_documentMode !== _fixed_ie){
									      _fixed_ie = _documentMode;  
									    }  
									  }else if(window.XMLHttpRequest){
									    _fixed_ie = 7;
									  }else{
									    if(_fixed_ie > 6){
									      _fixed_ie = 6;  
									    }  
									  }

                    o.ie = _fixed_ie;
                    //fix Y.UA.ie:}}}

                } else { // not opera, webkit, or ie
                    m = ua.match(/Gecko\/([^\s]*)/);
                    if (m) {
                        o.gecko = 1; // Gecko detected, look for revision
                        m = ua.match(/rv:([^\s\)]*)/);
                        if (m && m[1]) {
                            o.gecko = numberify(m[1]);
                        }
                    }
                }
            }
        }
    }

    YUI.Env.UA = o;

    return o;
};


Y.UA = YUI.Env.UA || YUI.Env.parseUA();


}, '3.3.0' );
//yui-base:}}}

//get:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('get', function(Y) {


/**
 * Provides a mechanism to fetch remote resources and
 * insert them into a document.
 * @module yui
 * @submodule get
 */

var ua = Y.UA,
    L = Y.Lang,
    TYPE_JS = 'text/javascript',
    TYPE_CSS = 'text/css',
    STYLESHEET = 'stylesheet';

/**
 * Fetches and inserts one or more script or link nodes into the document
 * @class Get
 * @static
 */
Y.Get = function() {

    /**
     * hash of queues to manage multiple requests
     * @property queues
     * @private
     */
    var _get, _purge, _track,

    queues = {},

    /**
     * queue index used to generate transaction ids
     * @property qidx
     * @type int
     * @private
     */
    qidx = 0,

    /**
     * interal property used to prevent multiple simultaneous purge
     * processes
     * @property purging
     * @type boolean
     * @private
     */
    purging,


    /**
     * Generates an HTML element, this is not appended to a document
     * @method _node
     * @param {string} type the type of element.
     * @param {string} attr the attributes.
     * @param {Window} win optional window to create the element in.
     * @return {HTMLElement} the generated node.
     * @private
     */
    _node = function(type, attr, win) {
        var w = win || Y.config.win,
            d = w.document,
            n = d.createElement(type),
            i;

        for (i in attr) {
            if (attr[i] && attr.hasOwnProperty(i)) {
                n.setAttribute(i, attr[i]);
            }
        }

        return n;
    },

    /**
     * Generates a link node
     * @method _linkNode
     * @param {string} url the url for the css file.
     * @param {Window} win optional window to create the node in.
     * @param {object} attributes optional attributes collection to apply to the
     * new node.
     * @return {HTMLElement} the generated node.
     * @private
     */
    _linkNode = function(url, win, attributes) {
        var o = {
            id: Y.guid(),
            type: TYPE_CSS,
            rel: STYLESHEET,
            href: url
        };
        if (attributes) {
            Y.mix(o, attributes);
        }
        return _node('link', o, win);
    },

    /**
     * Generates a script node
     * @method _scriptNode
     * @param {string} url the url for the script file.
     * @param {Window} win optional window to create the node in.
     * @param {object} attributes optional attributes collection to apply to the
     * new node.
     * @return {HTMLElement} the generated node.
     * @private
     */
    _scriptNode = function(url, win, attributes) {
        var o = {
            id: Y.guid(),
            type: TYPE_JS
        };

        if (attributes) {
            Y.mix(o, attributes);
        }

        o.src = url;

        return _node('script', o, win);
    },

    /**
     * Returns the data payload for callback functions.
     * @method _returnData
     * @param {object} q the queue.
     * @param {string} msg the result message.
     * @param {string} result the status message from the request.
     * @return {object} the state data from the request.
     * @private
     */
    _returnData = function(q, msg, result) {
        return {
                tId: q.tId,
                win: q.win,
                data: q.data,
                nodes: q.nodes,
                msg: msg,
                statusText: result,
                purge: function() {
                    _purge(this.tId);
                }
            };
    },

    /**
     * The transaction is finished
     * @method _end
     * @param {string} id the id of the request.
     * @param {string} msg the result message.
     * @param {string} result the status message from the request.
     * @private
     */
    _end = function(id, msg, result) {
        var q = queues[id], sc;
        if (q && q.onEnd) {
            sc = q.context || q;
            q.onEnd.call(sc, _returnData(q, msg, result));
        }
    },

    /*
     * The request failed, execute fail handler with whatever
     * was accomplished.  There isn't a failure case at the
     * moment unless you count aborted transactions
     * @method _fail
     * @param {string} id the id of the request
     * @private
     */
    _fail = function(id, msg) {

        var q = queues[id], sc;
        if (q.timer) {
            // q.timer.cancel();
            clearTimeout(q.timer);
        }

        // execute failure callback
        if (q.onFailure) {
            sc = q.context || q;
            q.onFailure.call(sc, _returnData(q, msg));
        }

        _end(id, msg, 'failure');
    },

    /**
     * The request is complete, so executing the requester's callback
     * @method _finish
     * @param {string} id the id of the request.
     * @private
     */
    _finish = function(id) {
        var q = queues[id], msg, sc;
        if (q.timer) {
            // q.timer.cancel();
            clearTimeout(q.timer);
        }
        q.finished = true;

        if (q.aborted) {
            msg = 'transaction ' + id + ' was aborted';
            _fail(id, msg);
            return;
        }

        // execute success callback
        if (q.onSuccess) {
            sc = q.context || q;
            q.onSuccess.call(sc, _returnData(q));
        }

        _end(id, msg, 'OK');
    },

    /**
     * Timeout detected
     * @method _timeout
     * @param {string} id the id of the request.
     * @private
     */
    _timeout = function(id) {
        var q = queues[id], sc;
        if (q.onTimeout) {
            sc = q.context || q;
            q.onTimeout.call(sc, _returnData(q));
        }

        _end(id, 'timeout', 'timeout');
    },


    /**
     * Loads the next item for a given request
     * @method _next
     * @param {string} id the id of the request.
     * @param {string} loaded the url that was just loaded, if any.
     * @return {string} the result.
     * @private
     */
    _next = function(id, loaded) {
        var q = queues[id], msg, w, d, h, n, url, s,
            insertBefore;

        if (q.timer) {
            // q.timer.cancel();
            clearTimeout(q.timer);
        }

        if (q.aborted) {
            msg = 'transaction ' + id + ' was aborted';
            _fail(id, msg);
            return;
        }

        if (loaded) {
            q.url.shift();
            if (q.varName) {
                q.varName.shift();
            }
        } else {
            // This is the first pass: make sure the url is an array
            q.url = (L.isString(q.url)) ? [q.url] : q.url;
            if (q.varName) {
                q.varName = (L.isString(q.varName)) ? [q.varName] : q.varName;
            }
        }

        w = q.win;
        d = w.document;
        h = d.getElementsByTagName('head')[0];

        if (q.url.length === 0) {
            _finish(id);
            return;
        }

        url = q.url[0];

        // if the url is undefined, this is probably a trailing comma
        // problem in IE.
        if (!url) {
            q.url.shift();
            return _next(id);
        }


        if (q.timeout) {
            // q.timer = L.later(q.timeout, q, _timeout, id);
            q.timer = setTimeout(function() {
                _timeout(id);
            }, q.timeout);
        }

        if (q.type === 'script') {
            n = _scriptNode(url, w, q.attributes);
        } else {
            n = _linkNode(url, w, q.attributes);
        }

        // track this node's load progress
        _track(q.type, n, id, url, w, q.url.length);

        // add the node to the queue so we can return it to the user supplied
        // callback
        q.nodes.push(n);

        // add it to the head or insert it before 'insertBefore'.  Work around
        // IE bug if there is a base tag.
        insertBefore = q.insertBefore ||
                       d.getElementsByTagName('base')[0];

        if (insertBefore) {
            s = _get(insertBefore, id);
            if (s) {
                s.parentNode.insertBefore(n, s);
            }
        } else {
            h.appendChild(n);
        }


        // FireFox does not support the onload event for link nodes, so
        // there is no way to make the css requests synchronous. This means
        // that the css rules in multiple files could be applied out of order
        // in this browser if a later request returns before an earlier one.
        // Safari too.
        if ((ua.webkit || ua.gecko) && q.type === 'css') {
            _next(id, url);
        }
    },

    /**
     * Removes processed queues and corresponding nodes
     * @method _autoPurge
     * @private
     */
    _autoPurge = function() {
        if (purging) {
            return;
        }
        purging = true;

        var i, q;

        for (i in queues) {
            if (queues.hasOwnProperty(i)) {
                q = queues[i];
                if (q.autopurge && q.finished) {
                    _purge(q.tId);
                    delete queues[i];
                }
            }
        }

        purging = false;
    },

    /**
     * Saves the state for the request and begins loading
     * the requested urls
     * @method queue
     * @param {string} type the type of node to insert.
     * @param {string} url the url to load.
     * @param {object} opts the hash of options for this request.
     * @return {object} transaction object.
     * @private
     */
    _queue = function(type, url, opts) {
        opts = opts || {};

        var id = 'q' + (qidx++), q,
            thresh = opts.purgethreshold || Y.Get.PURGE_THRESH;

        if (qidx % thresh === 0) {
            _autoPurge();
        }

        queues[id] = Y.merge(opts, {
            tId: id,
            type: type,
            url: url,
            finished: false,
            nodes: []
        });

        q = queues[id];
        q.win = q.win || Y.config.win;
        q.context = q.context || q;
        q.autopurge = ('autopurge' in q) ? q.autopurge :
                      (type === 'script') ? true : false;

        q.attributes = q.attributes || {};
        q.attributes.charset = opts.charset || q.attributes.charset || 'utf-8';

        _next(id);

        return {
            tId: id
        };
    };

    /**
     * Detects when a node has been loaded.  In the case of
     * script nodes, this does not guarantee that contained
     * script is ready to use.
     * @method _track
     * @param {string} type the type of node to track.
     * @param {HTMLElement} n the node to track.
     * @param {string} id the id of the request.
     * @param {string} url the url that is being loaded.
     * @param {Window} win the targeted window.
     * @param {int} qlength the number of remaining items in the queue,
     * including this one.
     * @param {Function} trackfn function to execute when finished
     * the default is _next.
     * @private
     */
    _track = function(type, n, id, url, win, qlength, trackfn) {
        var f = trackfn || _next;

        // IE supports the readystatechange event for script and css nodes
        // Opera only for script nodes.  Opera support onload for script
        // nodes, but this doesn't fire when there is a load failure.
        // The onreadystatechange appears to be a better way to respond
        // to both success and failure.
        if (ua.ie) {
            n.onreadystatechange = function() {
                var rs = this.readyState;
                if ('loaded' === rs || 'complete' === rs) {
                    n.onreadystatechange = null;
                    f(id, url);
                }
            };

        // webkit prior to 3.x is no longer supported
        } else if (ua.webkit) {
            if (type === 'script') {
                // Safari 3.x supports the load event for script nodes (DOM2)
                n.addEventListener('load', function() {
                    f(id, url);
                });
            }

        // FireFox and Opera support onload (but not DOM2 in FF) handlers for
        // script nodes.  Opera, but not FF, supports the onload event for link
        // nodes.
        } else {
            n.onload = function() {
                f(id, url);
            };

            n.onerror = function(e) {
                _fail(id, e + ': ' + url);
            };
        }
    };

    _get = function(nId, tId) {
        var q = queues[tId],
            n = (L.isString(nId)) ? q.win.document.getElementById(nId) : nId;
        if (!n) {
            _fail(tId, 'target node not found: ' + nId);
        }

        return n;
    };

    /**
     * Removes the nodes for the specified queue
     * @method _purge
     * @param {string} tId the transaction id.
     * @private
     */
    _purge = function(tId) {
        var n, l, d, h, s, i, node, attr, insertBefore,
            q = queues[tId];

        if (q) {
            n = q.nodes;
            l = n.length;
            d = q.win.document;
            h = d.getElementsByTagName('head')[0];

            insertBefore = q.insertBefore ||
                           d.getElementsByTagName('base')[0];

            if (insertBefore) {
                s = _get(insertBefore, tId);
                if (s) {
                    h = s.parentNode;
                }
            }

            for (i = 0; i < l; i = i + 1) {
                node = n[i];
                if (node.clearAttributes) {
                    node.clearAttributes();
                } else {
                    for (attr in node) {
                        if (node.hasOwnProperty(attr)) {
                            delete node[attr];
                        }
                    }
                }

                h.removeChild(node);
            }
        }
        q.nodes = [];
    };

    return {

        /**
         * The number of request required before an automatic purge.
         * Can be configured via the 'purgethreshold' config
         * property PURGE_THRESH
         * @static
         * @type int
         * @default 20
         * @private
         */
        PURGE_THRESH: 20,

        /**
         * Called by the the helper for detecting script load in Safari
         * @method _finalize
         * @static
         * @param {string} id the transaction id.
         * @private
         */
        _finalize: function(id) {
            setTimeout(function() {
                _finish(id);
            }, 0);
        },

        /**
         * Abort a transaction
         * @method abort
         * @static
         * @param {string|object} o Either the tId or the object returned from
         * script() or css().
         */
        abort: function(o) {
            var id = (L.isString(o)) ? o : o.tId,
                q = queues[id];
            if (q) {
                q.aborted = true;
            }
        },

        /**
         * Fetches and inserts one or more script nodes into the head
         * of the current document or the document in a specified window.
         *
         * @method script
         * @static
         * @param {string|string[]} url the url or urls to the script(s).
         * @param {object} opts Options:
         * <dl>
         * <dt>onSuccess</dt>
         * <dd>
         * callback to execute when the script(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>onTimeout</dt>
         * <dd>
         * callback to execute when a timeout occurs.
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>onEnd</dt>
         * <dd>a function that executes when the transaction finishes,
         * regardless of the exit path</dd>
         * <dt>onFailure</dt>
         * <dd>
         * callback to execute when the script load operation fails
         * The callback receives an object back with the following
         * data:
         * <dl>
         * <dt>win</dt>
         * <dd>the window the script(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted successfully</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove any nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>context</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>autopurge</dt>
         * <dd>
         * setting to true will let the utilities cleanup routine purge
         * the script once loaded
         * </dd>
         * <dt>purgethreshold</dt>
         * <dd>
         * The number of transaction before autopurge should be initiated
         * </dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callback when the script(s) are
         * loaded.
         * </dd>
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling.
         * If this is not specified, nodes will be inserted before a base
         * tag should it exist.  Otherwise, the nodes will be appended to the
         * end of the document head.</dd>
         * </dl>
         * <dt>charset</dt>
         * <dd>Node charset, default utf-8 (deprecated, use the attributes
         * config)</dd>
         * <dt>attributes</dt>
         * <dd>An object literal containing additional attributes to add to
         * the link tags</dd>
         * <dt>timeout</dt>
         * <dd>Number of milliseconds to wait before aborting and firing
         * the timeout event</dd>
         * <pre>
         * &nbsp; Y.Get.script(
         * &nbsp; ["http://yui.yahooapis.com/2.5.2/build/yahoo/yahoo-min.js",
         * &nbsp;  "http://yui.yahooapis.com/2.5.2/build/event/event-min.js"],
         * &nbsp; &#123;
         * &nbsp;   onSuccess: function(o) &#123;
         * &nbsp;     this.log("won't cause error because Y is the context");
         * &nbsp;                   // immediately
         * &nbsp;   &#125;,
         * &nbsp;   onFailure: function(o) &#123;
         * &nbsp;   &#125;,
         * &nbsp;   onTimeout: function(o) &#123;
         * &nbsp;   &#125;,
         * &nbsp;   data: "foo",
         * &nbsp;   timeout: 10000, // 10 second timeout
         * &nbsp;   context: Y, // make the YUI instance
         * &nbsp;   // win: otherframe // target another window/frame
         * &nbsp;   autopurge: true // allow the utility to choose when to
         * &nbsp;                   // remove the nodes
         * &nbsp;   purgetheshold: 1 // purge previous transaction before
         * &nbsp;                    // next transaction
         * &nbsp; &#125;);.
         * </pre>
         * @return {tId: string} an object containing info about the
         * transaction.
         */
        script: function(url, opts) {
            return _queue('script', url, opts);
        },

        /**
         * Fetches and inserts one or more css link nodes into the
         * head of the current document or the document in a specified
         * window.
         * @method css
         * @static
         * @param {string} url the url or urls to the css file(s).
         * @param {object} opts Options:
         * <dl>
         * <dt>onSuccess</dt>
         * <dd>
         * callback to execute when the css file(s) are finished loading
         * The callback receives an object back with the following
         * data:
         * <dl>win</dl>
         * <dd>the window the link nodes(s) were inserted into</dd>
         * <dt>data</dt>
         * <dd>the data object passed in when the request was made</dd>
         * <dt>nodes</dt>
         * <dd>An array containing references to the nodes that were
         * inserted</dd>
         * <dt>purge</dt>
         * <dd>A function that, when executed, will remove the nodes
         * that were inserted</dd>
         * <dt>
         * </dl>
         * </dd>
         * <dt>context</dt>
         * <dd>the execution context for the callbacks</dd>
         * <dt>win</dt>
         * <dd>a window other than the one the utility occupies</dd>
         * <dt>data</dt>
         * <dd>
         * data that is supplied to the callbacks when the nodes(s) are
         * loaded.
         * </dd>
         * <dt>insertBefore</dt>
         * <dd>node or node id that will become the new node's nextSibling</dd>
         * <dt>charset</dt>
         * <dd>Node charset, default utf-8 (deprecated, use the attributes
         * config)</dd>
         * <dt>attributes</dt>
         * <dd>An object literal containing additional attributes to add to
         * the link tags</dd>
         * </dl>
         * <pre>
         * Y.Get.css("http://localhost/css/menu.css");
         * </pre>
         * <pre>
         * &nbsp; Y.Get.css(
         * &nbsp; ["http://localhost/css/menu.css",
         * &nbsp;   insertBefore: 'custom-styles' // nodes will be inserted
         * &nbsp;                                 // before the specified node
         * &nbsp; &#125;);.
         * </pre>
         * @return {tId: string} an object containing info about the
         * transaction.
         */
        css: function(url, opts) {
            return _queue('css', url, opts);
        }
    };
}();



}, '3.3.0' ,{requires:['yui-base']});
//get:}}}

//features:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('features', function(Y) {

var feature_tests = {};

Y.mix(Y.namespace('Features'), {

    tests: feature_tests,

    add: function(cat, name, o) {
        feature_tests[cat] = feature_tests[cat] || {};
        feature_tests[cat][name] = o;
    },

    all: function(cat, args) {
        var cat_o = feature_tests[cat],
            // results = {};
            result = '';
        if (cat_o) {
            Y.Object.each(cat_o, function(v, k) {
                // results[k] = Y.Features.test(cat, k, args);
                result += k + ':' +
                       (Y.Features.test(cat, k, args) ? 1 : 0) + ';';
            });
        }

        return result;
    },

    test: function(cat, name, args) {
        args = args || [];
        var result, ua, test,
            cat_o = feature_tests[cat],
            feature = cat_o && cat_o[name];

        if (!feature) {
        } else {

            result = feature.result;

            if (Y.Lang.isUndefined(result)) {

                ua = feature.ua;
                if (ua) {
                    result = (Y.UA[ua]);
                }

                test = feature.test;
                if (test && ((!ua) || result)) {
                    result = test.apply(Y, args);
                }

                feature.result = result;
            }
        }

        return result;
    }
});

// Y.Features.add("load", "1", {});
// Y.Features.test("load", "1");
// caps=1:1;2:0;3:1;

/* This file is auto-generated by src/loader/meta_join.py */
var add = Y.Features.add;
// autocomplete-list-keys-sniff.js
add('load', '0', {
    "test": function (Y) {
    // Only add keyboard support to autocomplete-list if this doesn't appear to
    // be an iOS or Android-based mobile device.
    //
    // There's currently no feasible way to actually detect whether a device has
    // a hardware keyboard, so this sniff will have to do. It can easily be
    // overridden by manually loading the autocomplete-list-keys module.
    //
    // Worth noting: even though iOS supports bluetooth keyboards, Mobile Safari
    // doesn't fire the keyboard events used by AutoCompleteList, so there's
    // no point loading the -keys module even when a bluetooth keyboard may be
    // available.
    return !(Y.UA.ios || Y.UA.android);
}, 
    "trigger": "autocomplete-list"
});
// ie-style-test.js
add('load', '1', {
    "test": function (Y) {

    var testFeature = Y.Features.test,
        addFeature = Y.Features.add,
        WINDOW = Y.config.win,
        DOCUMENT = Y.config.doc,
        DOCUMENT_ELEMENT = 'documentElement',
        ret = false;

    addFeature('style', 'computedStyle', {
        test: function() {
            return WINDOW && 'getComputedStyle' in WINDOW;
        }
    });

    addFeature('style', 'opacity', {
        test: function() {
            return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;
        }
    });

    ret =  (!testFeature('style', 'opacity') &&
            !testFeature('style', 'computedStyle'));

    return ret;
}, 
    "trigger": "dom-style"
});
// 0
add('load', '2', {
    "trigger": "widget-base", 
    "ua": "ie"
});
// ie-base-test.js
add('load', '3', {
    "test": function(Y) {
    var imp = Y.config.doc && Y.config.doc.implementation;
    return (imp && (!imp.hasFeature('Events', '2.0')));
}, 
    "trigger": "node-base"
});
// dd-gestures-test.js
add('load', '4', {
    "test": function(Y) {
    return (Y.config.win && ('ontouchstart' in Y.config.win && !Y.UA.chrome));
}, 
    "trigger": "dd-drag"
});
// history-hash-ie-test.js
add('load', '5', {
    "test": function (Y) {
    var docMode = Y.config.doc.documentMode;

    return Y.UA.ie && (!('onhashchange' in Y.config.win) ||
            !docMode || docMode < 8);
}, 
    "trigger": "history-hash"
});


}, '3.3.0' ,{requires:['yui-base']});
//features:}}}

//intl-base:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('intl-base', function(Y) {

/**
 * The Intl utility provides a central location for managing sets of
 * localized resources (strings and formatting patterns).
 *
 * @class Intl
 * @uses EventTarget
 * @static
 */

var SPLIT_REGEX = /[, ]/;

Y.mix(Y.namespace('Intl'), {

 /**
    * Returns the language among those available that
    * best matches the preferred language list, using the Lookup
    * algorithm of BCP 47.
    * If none of the available languages meets the user's preferences,
    * then "" is returned.
    * Extended language ranges are not supported.
    *
    * @method lookupBestLang
    * @param {String[] | String} preferredLanguages The list of preferred
    * languages in descending preference order, represented as BCP 47
    * language tags. A string array or a comma-separated list.
    * @param {String[]} availableLanguages The list of languages
    * that the application supports, represented as BCP 47 language
    * tags.
    *
    * @return {String} The available language that best matches the
    * preferred language list, or "".
    * @since 3.1.0
    */
    lookupBestLang: function(preferredLanguages, availableLanguages) {

        var i, language, result, index;

        // check whether the list of available languages contains language;
        // if so return it
        function scan(language) {
            var i;
            for (i = 0; i < availableLanguages.length; i += 1) {
                if (language.toLowerCase() ===
                            availableLanguages[i].toLowerCase()) {
                    return availableLanguages[i];
                }
            }
        }

        if (Y.Lang.isString(preferredLanguages)) {
            preferredLanguages = preferredLanguages.split(SPLIT_REGEX);
        }

        for (i = 0; i < preferredLanguages.length; i += 1) {
            language = preferredLanguages[i];
            if (!language || language === '*') {
                continue;
            }
            // check the fallback sequence for one language
            while (language.length > 0) {
                result = scan(language);
                if (result) {
                    return result;
                } else {
                    index = language.lastIndexOf('-');
                    if (index >= 0) {
                        language = language.substring(0, index);
                        // one-character subtags get cut along with the
                        // following subtag
                        if (index >= 2 && language.charAt(index - 2) === '-') {
                            language = language.substring(0, index - 2);
                        }
                    } else {
                        // nothing available for this language
                        break;
                    }
                }
            }
        }

        return '';
    }
});


}, '3.3.0' ,{requires:['yui-base']});
//intl-base:}}}

//yui-later:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('yui-later', function(Y) {

/**
 * Provides a setTimeout/setInterval wrapper
 * @module yui
 * @submodule yui-later
 */

/**
 * Executes the supplied function in the context of the supplied
 * object 'when' milliseconds later.  Executes the function a
 * single time unless periodic is set to true.
 * @method later
 * @for YUI
 * @param when {int} the number of milliseconds to wait until the fn
 * is executed.
 * @param o the context object.
 * @param fn {Function|String} the function to execute or the name of
 * the method in the 'o' object to execute.
 * @param data [Array] data that is provided to the function.  This
 * accepts either a single item or an array.  If an array is provided,
 * the function is executed with one parameter for each array item.
 * If you need to pass a single array parameter, it needs to be wrapped
 * in an array [myarray].
 * @param periodic {boolean} if true, executes continuously at supplied
 * interval until canceled.
 * @return {object} a timer object. Call the cancel() method on this
 * object to stop the timer.
 */
Y.later = function(when, o, fn, data, periodic) {
    when = when || 0;

    var m = fn, f, id;

    if (o && Y.Lang.isString(fn)) {
        m = o[fn];
    }

    f = !Y.Lang.isUndefined(data) ? function() {
        m.apply(o, Y.Array(data));
    } : function() {
        m.call(o);
    };

    id = (periodic) ? setInterval(f, when) : setTimeout(f, when);

    return {
        id: id,
        interval: periodic,
        cancel: function() {
            if (this.interval) {
                clearInterval(id);
            } else {
                clearTimeout(id);
            }
        }
    };
};

Y.Lang.later = Y.later;



}, '3.3.0' ,{requires:['yui-base']});
//yui-later:}}}

//yui-throttle:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('yui-throttle', function(Y) {

/**
 * Provides a throttle/limiter for function calls
 * @module yui
 * @submodule yui-throttle
 */

/*! Based on work by Simon Willison: http://gist.github.com/292562 */
/**
 * Throttles a call to a method based on the time between calls.
 * @method throttle
 * @for YUI
 * @param fn {function} The function call to throttle.
 * @param ms {int} The number of milliseconds to throttle the method call.
 * Can set globally with Y.config.throttleTime or by call. Passing a -1 will
 * disable the throttle. Defaults to 150.
 * @return {function} Returns a wrapped function that calls fn throttled.
 * @since 3.1.0
 */
Y.throttle = function(fn, ms) {
    ms = (ms) ? ms : (Y.config.throttleTime || 150);

    if (ms === -1) {
        return (function() {
            fn.apply(null, arguments);
        });
    }

    var last = Y.Lang.now();

    return (function() {
        var now = Y.Lang.now();
        if (now - last > ms) {
            last = now;
            fn.apply(null, arguments);
        }
    });
};


}, '3.3.0' ,{requires:['yui-base']});
//yui-throttle:}}}

//loader-base:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('loader-base', function(Y) {

/**
 * The YUI loader core
 * @module loader
 * @submodule loader-base
 */

if (!YUI.Env[Y.version]) {

    (function() {
        var VERSION = Y.version,
            BUILD = '/build/',
            ROOT = VERSION + BUILD,
            CDN_BASE = Y.Env.base,
            GALLERY_VERSION = 'gallery-2010.12.16-18-24',
            TNT = '2in3',
            TNT_VERSION = '4',
            YUI2_VERSION = '2.8.2',
            COMBO_BASE = CDN_BASE + 'combo?',
            META = { version: VERSION,
                              root: ROOT,
                              base: Y.Env.base,
                              comboBase: COMBO_BASE,
                              skin: { defaultSkin: 'sam',
                                           base: 'assets/skins/',
                                           path: 'skin.css',
                                           after: ['cssreset',
                                                          'cssfonts',
                                                          'cssgrids',
                                                          'cssbase',
                                                          'cssreset-context',
                                                          'cssfonts-context']},
                              groups: {},
                              patterns: {} },
            groups = META.groups,
            yui2Update = function(tnt, yui2) {
                                  var root = TNT + '.' +
                                            (tnt || TNT_VERSION) + '/' +
                                            (yui2 || YUI2_VERSION) + BUILD;
                                  groups.yui2.base = CDN_BASE + root;
                                  groups.yui2.root = root;
                              },
            galleryUpdate = function(tag) {
                                  var root = (tag || GALLERY_VERSION) + BUILD;
                                  groups.gallery.base = CDN_BASE + root;
                                  groups.gallery.root = root;
                              };

        groups[VERSION] = {};

        groups.gallery = {
            ext: false,
            combine: true,
            comboBase: COMBO_BASE,
            update: galleryUpdate,
            patterns: { 'gallery-': { },
                        'gallerycss-': { type: 'css' } }
        };

        groups.yui2 = {
            combine: true,
            ext: false,
            comboBase: COMBO_BASE,
            update: yui2Update,
            patterns: {
                'yui2-': {
                    configFn: function(me) {
                        if (/-skin|reset|fonts|grids|base/.test(me.name)) {
                            me.type = 'css';
                            me.path = me.path.replace(/\.js/, '.css');
                            // this makes skins in builds earlier than
                            // 2.6.0 work as long as combine is false
                            me.path = me.path.replace(/\/yui2-skin/,
                                             '/assets/skins/sam/yui2-skin');
                        }
                    }
                }
            }
        };

        galleryUpdate();
        yui2Update();

        YUI.Env[VERSION] = META;
    }());
}



/**
 * Loader dynamically loads script and css files.  It includes the dependency
 * info for the version of the library in use, and will automatically pull in
 * dependencies for the modules requested.  It supports rollup files and will
 * automatically use these when appropriate in order to minimize the number of
 * http connections required to load all of the dependencies.  It can load the
 * files from the Yahoo! CDN, and it can utilize the combo service provided on
 * this network to reduce the number of http connections required to download
 * YUI files.
 *
 * @module loader
 * @submodule loader-base
 */

var NOT_FOUND = {},
    NO_REQUIREMENTS = [],
    //k2-patch:MAX_URL_LENGTH{{{
    //MAX_URL_LENGTH = (Y.UA.ie) ? 2048 : 8192,
    MAX_URL_LENGTH = 2000,
    //MAX_URL_LENGTH}}}
    GLOBAL_ENV = YUI.Env,
    GLOBAL_LOADED = GLOBAL_ENV._loaded,
    CSS = 'css',
    JS = 'js',
    INTL = 'intl',
    VERSION = Y.version,
    ROOT_LANG = '',
    YObject = Y.Object,
    oeach = YObject.each,
    YArray = Y.Array,
    _queue = GLOBAL_ENV._loaderQueue,
    META = GLOBAL_ENV[VERSION],
    SKIN_PREFIX = 'skin-',
    L = Y.Lang,
    ON_PAGE = GLOBAL_ENV.mods,
    modulekey,
    cache,
    _path = function(dir, file, type, nomin) {
                        var path = dir + '/' + file;
                        if (!nomin) {
                            path += '-min';
                        }
                        path += '.' + (type || CSS);

                        return path;
                    };

/**
 * The component metadata is stored in Y.Env.meta.
 * Part of the loader module.
 * @property Env.meta
 * @for YUI
 */
Y.Env.meta = META;

/**
 * Loader dynamically loads script and css files.  It includes the dependency
 * info for the version of the library in use, and will automatically pull in
 * dependencies for the modules requested.  It supports rollup files and will
 * automatically use these when appropriate in order to minimize the number of
 * http connections required to load all of the dependencies.  It can load the
 * files from the Yahoo! CDN, and it can utilize the combo service provided on
 * this network to reduce the number of http connections required to download
 * YUI files.
 *
 * While the loader can be instantiated by the end user, it normally is not.
 * @see YUI.use for the normal use case.  The use function automatically will
 * pull in missing dependencies.
 *
 * @constructor
 * @class Loader
 * @param {object} o an optional set of configuration options.  Valid options:
 * <ul>
 *  <li>base:
 *  The base dir</li>
 *  <li>comboBase:
 *  The YUI combo service base dir. Ex: http://yui.yahooapis.com/combo?</li>
 *  <li>root:
 *  The root path to prepend to module names for the combo service.
 *  Ex: 2.5.2/build/</li>
 *  <li>filter:.
 *
 * A filter to apply to result urls.  This filter will modify the default
 * path for all modules.  The default path for the YUI library is the
 * minified version of the files (e.g., event-min.js).  The filter property
 * can be a predefined filter or a custom filter.  The valid predefined
 * filters are:
 * <dl>
 *  <dt>DEBUG</dt>
 *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
 *      This option will automatically include the Logger widget</dd>
 *  <dt>RAW</dt>
 *  <dd>Selects the non-minified version of the library (e.g., event.js).
 *  </dd>
 * </dl>
 * You can also define a custom filter, which must be an object literal
 * containing a search expression and a replace string:
 * <pre>
 *  myFilter: &#123;
 *      'searchExp': "-min\\.js",
 *      'replaceStr': "-debug.js"
 *  &#125;
 * </pre>
 *
 *  </li>
 *  <li>filters: per-component filter specification.  If specified
 *  for a given component, this overrides the filter config</li>
 *  <li>combine:
 *  Use the YUI combo service to reduce the number of http connections
 *  required to load your dependencies</li>
 *  <li>ignore:
 *  A list of modules that should never be dynamically loaded</li>
 *  <li>force:
 *  A list of modules that should always be loaded when required, even if
 *  already present on the page</li>
 *  <li>insertBefore:
 *  Node or id for a node that should be used as the insertion point for
 *  new nodes</li>
 *  <li>charset:
 *  charset for dynamic nodes (deprecated, use jsAttributes or cssAttributes)
 *  </li>
 *  <li>jsAttributes: object literal containing attributes to add to script
 *  nodes</li>
 *  <li>cssAttributes: object literal containing attributes to add to link
 *  nodes</li>
 *  <li>timeout:
 *  The number of milliseconds before a timeout occurs when dynamically
 *  loading nodes.  If not set, there is no timeout</li>
 *  <li>context:
 *  execution context for all callbacks</li>
 *  <li>onSuccess:
 *  callback for the 'success' event</li>
 *  <li>onFailure: callback for the 'failure' event</li>
 *  <li>onCSS: callback for the 'CSSComplete' event.  When loading YUI
 *  components with CSS the CSS is loaded first, then the script.  This
 *  provides a moment you can tie into to improve
 *  the presentation of the page while the script is loading.</li>
 *  <li>onTimeout:
 *  callback for the 'timeout' event</li>
 *  <li>onProgress:
 *  callback executed each time a script or css file is loaded</li>
 *  <li>modules:
 *  A list of module definitions.  See Loader.addModule for the supported
 *  module metadata</li>
 *  <li>groups:
 *  A list of group definitions.  Each group can contain specific definitions
 *  for base, comboBase, combine, and accepts a list of modules.  See above
 *  for the description of these properties.</li>
 *  <li>2in3: the version of the YUI 2 in 3 wrapper to use.  The intrinsic
 *  support for YUI 2 modules in YUI 3 relies on versions of the YUI 2
 *  components inside YUI 3 module wrappers.  These wrappers
 *  change over time to accomodate the issues that arise from running YUI 2
 *  in a YUI 3 sandbox.</li>
 *  <li>yui2: when using the 2in3 project, you can select the version of
 *  YUI 2 to use.  Valid values *  are 2.2.2, 2.3.1, 2.4.1, 2.5.2, 2.6.0,
 *  2.7.0, 2.8.0, and 2.8.1 [default] -- plus all versions of YUI 2
 *  going forward.</li>
 * </ul>
 */
Y.Loader = function(o) {

    var defaults = META.modules,
        self = this;

    modulekey = META.md5;

    /**
     * Internal callback to handle multiple internal insert() calls
     * so that css is inserted prior to js
     * @property _internalCallback
     * @private
     */
    // self._internalCallback = null;

    /**
     * Callback that will be executed when the loader is finished
     * with an insert
     * @method onSuccess
     * @type function
     */
    // self.onSuccess = null;

    /**
     * Callback that will be executed if there is a failure
     * @method onFailure
     * @type function
     */
    // self.onFailure = null;

    /**
     * Callback for the 'CSSComplete' event.  When loading YUI components
     * with CSS the CSS is loaded first, then the script.  This provides
     * a moment you can tie into to improve the presentation of the page
     * while the script is loading.
     * @method onCSS
     * @type function
     */
    // self.onCSS = null;

    /**
     * Callback executed each time a script or css file is loaded
     * @method onProgress
     * @type function
     */
    // self.onProgress = null;

    /**
     * Callback that will be executed if a timeout occurs
     * @method onTimeout
     * @type function
     */
    // self.onTimeout = null;

    /**
     * The execution context for all callbacks
     * @property context
     * @default {YUI} the YUI instance
     */
    self.context = Y;

    /**
     * Data that is passed to all callbacks
     * @property data
     */
    // self.data = null;

    /**
     * Node reference or id where new nodes should be inserted before
     * @property insertBefore
     * @type string|HTMLElement
     */
    // self.insertBefore = null;

    /**
     * The charset attribute for inserted nodes
     * @property charset
     * @type string
     * @deprecated , use cssAttributes or jsAttributes.
     */
    // self.charset = null;

    /**
     * An object literal containing attributes to add to link nodes
     * @property cssAttributes
     * @type object
     */
    // self.cssAttributes = null;

    /**
     * An object literal containing attributes to add to script nodes
     * @property jsAttributes
     * @type object
     */
    // self.jsAttributes = null;

    /**
     * The base directory.
     * @property base
     * @type string
     * @default http://yui.yahooapis.com/[YUI VERSION]/build/
     */
    self.base = Y.Env.meta.base;

    /**
     * Base path for the combo service
     * @property comboBase
     * @type string
     * @default http://yui.yahooapis.com/combo?
     */
    self.comboBase = Y.Env.meta.comboBase;

    /*
     * Base path for language packs.
     */
    // self.langBase = Y.Env.meta.langBase;
    // self.lang = "";

    /**
     * If configured, the loader will attempt to use the combo
     * service for YUI resources and configured external resources.
     * @property combine
     * @type boolean
     * @default true if a base dir isn't in the config
     */
    self.combine = o.base &&
        (o.base.indexOf(self.comboBase.substr(0, 20)) > -1);

    /**
     * Max url length for combo urls.  The default is 2048 for
     * internet explorer, and 8192 otherwise.  This is the URL
     * limit for the Yahoo! hosted combo servers.  If consuming
     * a different combo service that has a different URL limit
     * it is possible to override this default by supplying
     * the maxURLLength config option.  The config option will
     * only take effect if lower than the default.
     *
     * Browsers:
     *    IE: 2048
     *    Other A-Grade Browsers: Higher that what is typically supported
     *    'capable' mobile browsers:
     *
     * Servers:
     *    Apache: 8192
     *
     * @property maxURLLength
     * @type int
     */
    self.maxURLLength = MAX_URL_LENGTH;

    /**
     * Ignore modules registered on the YUI global
     * @property ignoreRegistered
     * @default false
     */
    // self.ignoreRegistered = false;

    /**
     * Root path to prepend to module path for the combo
     * service
     * @property root
     * @type string
     * @default [YUI VERSION]/build/
     */
    self.root = Y.Env.meta.root;

    /**
     * Timeout value in milliseconds.  If set, self value will be used by
     * the get utility.  the timeout event will fire if
     * a timeout occurs.
     * @property timeout
     * @type int
     */
    self.timeout = 0;

    /**
     * A list of modules that should not be loaded, even if
     * they turn up in the dependency tree
     * @property ignore
     * @type string[]
     */
    // self.ignore = null;

    /**
     * A list of modules that should always be loaded, even
     * if they have already been inserted into the page.
     * @property force
     * @type string[]
     */
    // self.force = null;

    self.forceMap = {};

    /**
     * Should we allow rollups
     * @property allowRollup
     * @type boolean
     * @default true
     */
    self.allowRollup = true;

    /**
     * A filter to apply to result urls.  This filter will modify the default
     * path for all modules.  The default path for the YUI library is the
     * minified version of the files (e.g., event-min.js).  The filter property
     * can be a predefined filter or a custom filter.  The valid predefined
     * filters are:
     * <dl>
     *  <dt>DEBUG</dt>
     *  <dd>Selects the debug versions of the library (e.g., event-debug.js).
     *      This option will automatically include the Logger widget</dd>
     *  <dt>RAW</dt>
     *  <dd>Selects the non-minified version of the library (e.g., event.js).
     *  </dd>
     * </dl>
     * You can also define a custom filter, which must be an object literal
     * containing a search expression and a replace string:
     * <pre>
     *  myFilter: &#123;
     *      'searchExp': "-min\\.js",
     *      'replaceStr': "-debug.js"
     *  &#125;
     * </pre>
     * @property filter
     * @type string| {searchExp: string, replaceStr: string}
     */
    // self.filter = null;

    /**
     * per-component filter specification.  If specified for a given
     * component, this overrides the filter config.
     * @property filters
     * @type object
     */
    self.filters = {};

    /**
     * The list of requested modules
     * @property required
     * @type {string: boolean}
     */
    self.required = {};

    /**
     * If a module name is predefined when requested, it is checked againsts
     * the patterns provided in this property.  If there is a match, the
     * module is added with the default configuration.
     *
     * At the moment only supporting module prefixes, but anticipate
     * supporting at least regular expressions.
     * @property patterns
     * @type Object
     */
    // self.patterns = Y.merge(Y.Env.meta.patterns);
    self.patterns = {};

    /**
     * The library metadata
     * @property moduleInfo
     */
    // self.moduleInfo = Y.merge(Y.Env.meta.moduleInfo);
    self.moduleInfo = {};

    self.groups = Y.merge(Y.Env.meta.groups);

    /**
     * Provides the information used to skin the skinnable components.
     * The following skin definition would result in 'skin1' and 'skin2'
     * being loaded for calendar (if calendar was requested), and
     * 'sam' for all other skinnable components:
     *
     *   <code>
     *   skin: {
     *
     *      // The default skin, which is automatically applied if not
     *      // overriden by a component-specific skin definition.
     *      // Change this in to apply a different skin globally
     *      defaultSkin: 'sam',
     *
     *      // This is combined with the loader base property to get
     *      // the default root directory for a skin. ex:
     *      // http://yui.yahooapis.com/2.3.0/build/assets/skins/sam/
     *      base: 'assets/skins/',
     *
     *      // Any component-specific overrides can be specified here,
     *      // making it possible to load different skins for different
     *      // components.  It is possible to load more than one skin
     *      // for a given component as well.
     *      overrides: {
     *          calendar: ['skin1', 'skin2']
     *      }
     *   }
     *   </code>
     *   @property skin
     */
    self.skin = Y.merge(Y.Env.meta.skin);

    /*
     * Map of conditional modules
     * @since 3.2.0
     */
    self.conditions = {};

    // map of modules with a hash of modules that meet the requirement
    // self.provides = {};

    self.config = o;
    self._internal = true;


    cache = GLOBAL_ENV._renderedMods;

    if (cache) {
        oeach(cache, function(v, k) {
            self.moduleInfo[k] = Y.merge(v);
        });

        cache = GLOBAL_ENV._conditions;

        oeach(cache, function(v, k) {
            self.conditions[k] = Y.merge(v);
        });

    } else {
        oeach(defaults, self.addModule, self);
    }

    if (!GLOBAL_ENV._renderedMods) {
        GLOBAL_ENV._renderedMods = Y.merge(self.moduleInfo);
        GLOBAL_ENV._conditions = Y.merge(self.conditions);
    }

    self._inspectPage();

    self._internal = false;

    self._config(o);

    /**
     * List of rollup files found in the library metadata
     * @property rollups
     */
    // self.rollups = null;

    /**
     * Whether or not to load optional dependencies for
     * the requested modules
     * @property loadOptional
     * @type boolean
     * @default false
     */
    // self.loadOptional = false;

    /**
     * All of the derived dependencies in sorted order, which
     * will be populated when either calculate() or insert()
     * is called
     * @property sorted
     * @type string[]
     */
    self.sorted = [];

    /**
     * Set when beginning to compute the dependency tree.
     * Composed of what YUI reports to be loaded combined
     * with what has been loaded by any instance on the page
     * with the version number specified in the metadata.
     * @property loaded
     * @type {string: boolean}
     */
    self.loaded = GLOBAL_LOADED[VERSION];

    /*
     * A list of modules to attach to the YUI instance when complete.
     * If not supplied, the sorted list of dependencies are applied.
     * @property attaching
     */
    // self.attaching = null;

    /**
     * Flag to indicate the dependency tree needs to be recomputed
     * if insert is called again.
     * @property dirty
     * @type boolean
     * @default true
     */
    self.dirty = true;

    /**
     * List of modules inserted by the utility
     * @property inserted
     * @type {string: boolean}
     */
    self.inserted = {};

    /**
     * List of skipped modules during insert() because the module
     * was not defined
     * @property skipped
     */
    self.skipped = {};

    // Y.on('yui:load', self.loadNext, self);

    self.tested = {};

    /*
     * Cached sorted calculate results
     * @property results
     * @since 3.2.0
     */
    //self.results = {};

};

Y.Loader.prototype = {

    FILTER_DEFS: {
        RAW: {
            'searchExp': '-min\\.js',
            'replaceStr': '.js'
        },
        DEBUG: {
            'searchExp': '-min\\.js',
            'replaceStr': '-debug.js'
        }
    },

   _inspectPage: function() {
       oeach(ON_PAGE, function(v, k) {
           if (v.details) {
               var m = this.moduleInfo[k],
                   req = v.details.requires,
                   mr = m && m.requires;
               if (m) {
                   if (!m._inspected && req && mr.length != req.length) {
                       // console.log('deleting ' + m.name);
                       delete m.expanded;
                   }
               } else {
                   m = this.addModule(v.details, k);
               }
               m._inspected = true;
           }
       }, this);
   },

// returns true if b is not loaded, and is required
// directly or by means of modules it supersedes.
   _requires: function(mod1, mod2) {

        var i, rm, after_map, s,
            info = this.moduleInfo,
            m = info[mod1],
            other = info[mod2];
            // key = mod1 + mod2;

        // if (this.tested[key]) {
            // return this.tested[key];
        // }

        // if (loaded[mod2] || !m || !other) {
        if (!m || !other) {
            return false;
        }

        rm = m.expanded_map;
        after_map = m.after_map;

        // check if this module should be sorted after the other
        // do this first to short circut circular deps
        if (after_map && (mod2 in after_map)) {
            return true;
        }

        after_map = other.after_map;

        // and vis-versa
        if (after_map && (mod1 in after_map)) {
            return false;
        }

        // check if this module requires one the other supersedes
        s = info[mod2] && info[mod2].supersedes;
        if (s) {
            for (i = 0; i < s.length; i++) {
                if (this._requires(mod1, s[i])) {
                    return true;
                }
            }
        }

        s = info[mod1] && info[mod1].supersedes;
        if (s) {
            for (i = 0; i < s.length; i++) {
                if (this._requires(mod2, s[i])) {
                    return false;
                }
            }
        }

        // check if this module requires the other directly
        // if (r && YArray.indexOf(r, mod2) > -1) {
        if (rm && (mod2 in rm)) {
            return true;
        }

        // external css files should be sorted below yui css
        if (m.ext && m.type == CSS && !other.ext && other.type == CSS) {
            return true;
        }

        return false;
    },

    _config: function(o) {
        var i, j, val, f, group, groupName, self = this;
        // apply config values
        if (o) {
            for (i in o) {
                if (o.hasOwnProperty(i)) {
                    val = o[i];
                    if (i == 'require') {
                        self.require(val);
                    } else if (i == 'skin') {
                        Y.mix(self.skin, o[i], true);
                    } else if (i == 'groups') {
                        for (j in val) {
                            if (val.hasOwnProperty(j)) {
                                groupName = j;
                                group = val[j];
                                self.addGroup(group, groupName);
                            }
                        }

                    } else if (i == 'modules') {
                        // add a hash of module definitions
                        oeach(val, self.addModule, self);
                    } else if (i == 'gallery') {
                        this.groups.gallery.update(val);
                    } else if (i == 'yui2' || i == '2in3') {
                        this.groups.yui2.update(o['2in3'], o.yui2);
                    } else if (i == 'maxURLLength') {
                        self[i] = Math.min(MAX_URL_LENGTH, val);
                    } else {
                        self[i] = val;
                    }
                }
            }
        }

        // fix filter
        f = self.filter;

        if (L.isString(f)) {
            f = f.toUpperCase();
            self.filterName = f;
            self.filter = self.FILTER_DEFS[f];
            if (f == 'DEBUG') {
                self.require('yui-log', 'dump');
            }
        }

    },

    /**
     * Returns the skin module name for the specified skin name.  If a
     * module name is supplied, the returned skin module name is
     * specific to the module passed in.
     * @method formatSkin
     * @param {string} skin the name of the skin.
     * @param {string} mod optional: the name of a module to skin.
     * @return {string} the full skin module name.
     */
    formatSkin: function(skin, mod) {
        var s = SKIN_PREFIX + skin;
        if (mod) {
            s = s + '-' + mod;
        }

        return s;
    },

    /**
     * Adds the skin def to the module info
     * @method _addSkin
     * @param {string} skin the name of the skin.
     * @param {string} mod the name of the module.
     * @param {string} parent parent module if this is a skin of a
     * submodule or plugin.
     * @return {string} the module name for the skin.
     * @private
     */
    _addSkin: function(skin, mod, parent) {
        //k2-patch:global skinnable:{{{
        //http://yuilibrary.com/projects/yui3/ticket/2530057 
        //fetchCSS的配置可以实现，是否考虑去掉这个设置，同时解决其他其他使用过这个属性的同学
        /*
        var mdef, pkg, name,
            info = this.moduleInfo,
            sinf = this.skin,
            ext = info[mod] && info[mod].ext;

        // Add a module definition for the module-specific skin css
        if (mod) {
            name = this.formatSkin(skin, mod);
            if (!info[name]) {
                mdef = info[mod];
                pkg = mdef.pkg || mod;
                this.addModule({
                    name: name,
                    group: mdef.group,
                    type: 'css',
                    after: sinf.after,
                    path: (parent || pkg) + '/' + sinf.base + skin +
                          '/' + mod + '.css',
                    ext: ext
                });

            }
        }

        return name;
        */
        if(this.skinnable !== false){
	        var mdef, pkg, name,
	            info = this.moduleInfo,
	            sinf = this.skin,
	            ext = info[mod] && info[mod].ext;
	
	        // Add a module definition for the module-specific skin css
	        if (mod) {
	            name = this.formatSkin(skin, mod);
	            if (!info[name]) {
	                mdef = info[mod];
	                pkg = mdef.pkg || mod;
	                this.addModule({
	                    name: name,
	                    group: mdef.group,
	                    type: 'css',
	                    after: sinf.after,
	                    path: (parent || pkg) + '/' + sinf.base + skin +
	                          '/' + mod + '.css',
	                    ext: ext
	                });
	
	            }
	        }
	
	        return name;
        } 
        //global skinnable:}}}
    },

    /** Add a new module group
     * <dl>
     *   <dt>name:</dt>      <dd>required, the group name</dd>
     *   <dt>base:</dt>      <dd>The base dir for this module group</dd>
     *   <dt>root:</dt>      <dd>The root path to add to each combo
     *   resource path</dd>
     *   <dt>combine:</dt>   <dd>combo handle</dd>
     *   <dt>comboBase:</dt> <dd>combo service base path</dd>
     *   <dt>modules:</dt>   <dd>the group of modules</dd>
     * </dl>
     * @method addGroup
     * @param {object} o An object containing the module data.
     * @param {string} name the group name.
     */
    addGroup: function(o, name) {
        var mods = o.modules,
            self = this;
        name = name || o.name;
        o.name = name;
        self.groups[name] = o;

        if (o.patterns) {
            oeach(o.patterns, function(v, k) {
                v.group = name;
                self.patterns[k] = v;
            });
        }

        if (mods) {
            oeach(mods, function(v, k) {
                v.group = name;
                self.addModule(v, k);
            }, self);
        }
    },

    /** Add a new module to the component metadata.
     * <dl>
     *     <dt>name:</dt>       <dd>required, the component name</dd>
     *     <dt>type:</dt>       <dd>required, the component type (js or css)
     *     </dd>
     *     <dt>path:</dt>       <dd>required, the path to the script from
     *     "base"</dd>
     *     <dt>requires:</dt>   <dd>array of modules required by this
     *     component</dd>
     *     <dt>optional:</dt>   <dd>array of optional modules for this
     *     component</dd>
     *     <dt>supersedes:</dt> <dd>array of the modules this component
     *     replaces</dd>
     *     <dt>after:</dt>      <dd>array of modules the components which, if
     *     present, should be sorted above this one</dd>
     *     <dt>after_map:</dt>  <dd>faster alternative to 'after' -- supply
     *     a hash instead of an array</dd>
     *     <dt>rollup:</dt>     <dd>the number of superseded modules required
     *     for automatic rollup</dd>
     *     <dt>fullpath:</dt>   <dd>If fullpath is specified, this is used
     *     instead of the configured base + path</dd>
     *     <dt>skinnable:</dt>  <dd>flag to determine if skin assets should
     *     automatically be pulled in</dd>
     *     <dt>submodules:</dt> <dd>a hash of submodules</dd>
     *     <dt>group:</dt>      <dd>The group the module belongs to -- this
     *     is set automatically when it is added as part of a group
     *     configuration.</dd>
     *     <dt>lang:</dt>
     *       <dd>array of BCP 47 language tags of languages for which this
     *           module has localized resource bundles,
     *           e.g., ["en-GB","zh-Hans-CN"]</dd>
     *     <dt>condition:</dt>
     *       <dd>Specifies that the module should be loaded automatically if
     *           a condition is met.  This is an object with up to three fields:
     *           [trigger] - the name of a module that can trigger the auto-load
     *           [test] - a function that returns true when the module is to be
     *           loaded.
     *           [when] - specifies the load order of the conditional module
     *           with regard to the position of the trigger module.
     *           This should be one of three values: 'before', 'after', or
     *           'instead'.  The default is 'after'.
     *       </dd>
     * </dl>
     * @method addModule
     * @param {object} o An object containing the module data.
     * @param {string} name the module name (optional), required if not
     * in the module data.
     * @return {object} the module definition or null if
     * the object passed in did not provide all required attributes.
     */
    addModule: function(o, name) {

        name = name || o.name;
        o.name = name;

        if (!o || !o.name) {
            return null;
        }

        if (!o.type) {
            o.type = JS;
        }

        if (!o.path && !o.fullpath) {
            o.path = _path(name, name, o.type);
        }

        o.supersedes = o.supersedes || o.use;

        o.ext = ('ext' in o) ? o.ext : (this._internal) ? false : true;
        o.requires = o.requires || [];

        // Handle submodule logic
        var subs = o.submodules, i, l, sup, s, smod, plugins, plug,
            j, langs, packName, supName, flatSup, flatLang, lang, ret,
            overrides, skinname, when,
            conditions = this.conditions, trigger;
            // , existing = this.moduleInfo[name], newr;

        this.moduleInfo[name] = o;

        if (!o.langPack && o.lang) {
            langs = YArray(o.lang);
            for (j = 0; j < langs.length; j++) {
                lang = langs[j];
                packName = this.getLangPackName(lang, name);
                smod = this.moduleInfo[packName];
                if (!smod) {
                    smod = this._addLangPack(lang, o, packName);
                }
            }
        }

        if (subs) {
            sup = o.supersedes || [];
            l = 0;

            for (i in subs) {
                if (subs.hasOwnProperty(i)) {
                    s = subs[i];

                    s.path = s.path || _path(name, i, o.type);
                    s.pkg = name;
                    s.group = o.group;

                    if (s.supersedes) {
                        sup = sup.concat(s.supersedes);
                    }

                    smod = this.addModule(s, i);
                    sup.push(i);

                    if (smod.skinnable) {
                        o.skinnable = true;
                        overrides = this.skin.overrides;
                        if (overrides && overrides[i]) {
                            for (j = 0; j < overrides[i].length; j++) {
                                skinname = this._addSkin(overrides[i][j],
                                         i, name);
                                sup.push(skinname);
                            }
                        }
                        skinname = this._addSkin(this.skin.defaultSkin,
                                        i, name);
                        sup.push(skinname);
                    }

                    // looks like we are expected to work out the metadata
                    // for the parent module language packs from what is
                    // specified in the child modules.
                    if (s.lang && s.lang.length) {

                        langs = YArray(s.lang);
                        for (j = 0; j < langs.length; j++) {
                            lang = langs[j];
                            packName = this.getLangPackName(lang, name);
                            supName = this.getLangPackName(lang, i);
                            smod = this.moduleInfo[packName];

                            if (!smod) {
                                smod = this._addLangPack(lang, o, packName);
                            }

                            flatSup = flatSup || YArray.hash(smod.supersedes);

                            if (!(supName in flatSup)) {
                                smod.supersedes.push(supName);
                            }

                            o.lang = o.lang || [];

                            flatLang = flatLang || YArray.hash(o.lang);

                            if (!(lang in flatLang)) {
                                o.lang.push(lang);
                            }

// Add rollup file, need to add to supersedes list too

                            // default packages
                            packName = this.getLangPackName(ROOT_LANG, name);
                            supName = this.getLangPackName(ROOT_LANG, i);

                            smod = this.moduleInfo[packName];

                            if (!smod) {
                                smod = this._addLangPack(lang, o, packName);
                            }

                            if (!(supName in flatSup)) {
                                smod.supersedes.push(supName);
                            }

// Add rollup file, need to add to supersedes list too

                        }
                    }

                    l++;
                }
            }
            o.supersedes = YObject.keys(YArray.hash(sup));
            o.rollup = (l < 4) ? l : Math.min(l - 1, 4);
        }

        plugins = o.plugins;
        if (plugins) {
            for (i in plugins) {
                if (plugins.hasOwnProperty(i)) {
                    plug = plugins[i];
                    plug.pkg = name;
                    plug.path = plug.path || _path(name, i, o.type);
                    plug.requires = plug.requires || [];
                    plug.group = o.group;
                    this.addModule(plug, i);
                    if (o.skinnable) {
                        this._addSkin(this.skin.defaultSkin, i, name);
                    }

                }
            }
        }

        if (o.condition) {
            trigger = o.condition.trigger;
            when = o.condition.when;
            conditions[trigger] = conditions[trigger] || {};
            conditions[trigger][name] = o.condition;
            // the 'when' attribute can be 'before', 'after', or 'instead'
            // the default is after.
            if (when && when != 'after') {
                if (when == 'instead') { // replace the trigger
                    o.supersedes = o.supersedes || [];
                    o.supersedes.push(trigger);
                } else { // before the trigger
                    // the trigger requires the conditional mod,
                    // so it should appear before the conditional
                    // mod if we do not intersede.
                }
            } else { // after the trigger
                o.after = o.after || [];
                o.after.push(trigger);
            }
        }

        if (o.after) {
            o.after_map = YArray.hash(o.after);
        }

        // this.dirty = true;

        if (o.configFn) {
            ret = o.configFn(o);
            if (ret === false) {
                delete this.moduleInfo[name];
                o = null;
            }
        }

        return o;
    },

    /**
     * Add a requirement for one or more module
     * @method require
     * @param {string[] | string*} what the modules to load.
     */
    require: function(what) {
        var a = (typeof what === 'string') ? arguments : what;
        this.dirty = true;
        Y.mix(this.required, YArray.hash(a));
    },

    /**
     * Returns an object containing properties for all modules required
     * in order to load the requested module
     * @method getRequires
     * @param {object}  mod The module definition from moduleInfo.
     * @return {array} the expanded requirement list.
     */
    getRequires: function(mod) {

        if (!mod || mod._parsed) {
            return NO_REQUIREMENTS;
        }

        var i, m, j, add, packName, lang,
            name = mod.name, cond, go,
            adddef = ON_PAGE[name] && ON_PAGE[name].details,
            d,
            r, old_mod,
            o, skinmod, skindef,
            intl = mod.lang || mod.intl,
            info = this.moduleInfo,
            hash;

        // pattern match leaves module stub that needs to be filled out
        if (mod.temp && adddef) {
            old_mod = mod;
            mod = this.addModule(adddef, name);
            mod.group = old_mod.group;
            mod.pkg = old_mod.pkg;
            delete mod.expanded;
        }

        // if (mod.expanded && (!mod.langCache || mod.langCache == this.lang)) {
        if (mod.expanded && (!this.lang || mod.langCache === this.lang)) {
            return mod.expanded;
        }

        d = [];
        hash = {};

        r = mod.requires;
        o = mod.optional;


        mod._parsed = true;


        for (i = 0; i < r.length; i++) {
            if (!hash[r[i]]) {
                d.push(r[i]);
                hash[r[i]] = true;
                m = this.getModule(r[i]);
                if (m) {
                    add = this.getRequires(m);
                    intl = intl || (m.expanded_map &&
                        (INTL in m.expanded_map));
                    for (j = 0; j < add.length; j++) {
                        d.push(add[j]);
                    }
                }
            }
        }

        // get the requirements from superseded modules, if any
        r = mod.supersedes;
        if (r) {
            for (i = 0; i < r.length; i++) {
                if (!hash[r[i]]) {
                    // if this module has submodules, the requirements list is
                    // expanded to include the submodules.  This is so we can
                    // prevent dups when a submodule is already loaded and the
                    // parent is requested.
                    if (mod.submodules) {
                        d.push(r[i]);
                    }

                    hash[r[i]] = true;
                    m = this.getModule(r[i]);

                    if (m) {
                        add = this.getRequires(m);
                        intl = intl || (m.expanded_map &&
                            (INTL in m.expanded_map));
                        for (j = 0; j < add.length; j++) {
                            d.push(add[j]);
                        }
                    }
                }
            }
        }

        if (o && this.loadOptional) {
            for (i = 0; i < o.length; i++) {
                if (!hash[o[i]]) {
                    d.push(o[i]);
                    hash[o[i]] = true;
                    m = info[o[i]];
                    if (m) {
                        add = this.getRequires(m);
                        intl = intl || (m.expanded_map &&
                            (INTL in m.expanded_map));
                        for (j = 0; j < add.length; j++) {
                            d.push(add[j]);
                        }
                    }
                }
            }
        }

        cond = this.conditions[name];

        if (cond) {
            oeach(cond, function(def, condmod) {

                if (!hash[condmod]) {
                    go = def && ((def.ua && Y.UA[def.ua]) ||
                                 (def.test && def.test(Y, r)));
                    if (go) {
                        hash[condmod] = true;
                        d.push(condmod);
                        m = this.getModule(condmod);
                        if (m) {
                            add = this.getRequires(m);
                            for (j = 0; j < add.length; j++) {
                                d.push(add[j]);
                            }
                        }
                    }
                }
            }, this);
        }

        // Create skin modules
        if (mod.skinnable) {
            skindef = this.skin.overrides;
            if (skindef && skindef[name]) {
                for (i = 0; i < skindef[name].length; i++) {
                    skinmod = this._addSkin(skindef[name][i], name);
                    d.push(skinmod);
                }
            } else {
                skinmod = this._addSkin(this.skin.defaultSkin, name);
                d.push(skinmod);
            }
        }

        mod._parsed = false;

        if (intl) {

            if (mod.lang && !mod.langPack && Y.Intl) {
                lang = Y.Intl.lookupBestLang(this.lang || ROOT_LANG, mod.lang);
                mod.langCache = this.lang;
                packName = this.getLangPackName(lang, name);
                if (packName) {
                    d.unshift(packName);
                }
            }

            d.unshift(INTL);
        }

        mod.expanded_map = YArray.hash(d);

        mod.expanded = YObject.keys(mod.expanded_map);

        return mod.expanded;
    },


    /**
     * Returns a hash of module names the supplied module satisfies.
     * @method getProvides
     * @param {string} name The name of the module.
     * @return {object} what this module provides.
     */
    getProvides: function(name) {
        var m = this.getModule(name), o, s;
            // supmap = this.provides;

        if (!m) {
            return NOT_FOUND;
        }

        if (m && !m.provides) {
            o = {};
            s = m.supersedes;

            if (s) {
                YArray.each(s, function(v) {
                    Y.mix(o, this.getProvides(v));
                }, this);
            }

            o[name] = true;
            m.provides = o;

        }

        return m.provides;
    },

    /**
     * Calculates the dependency tree, the result is stored in the sorted
     * property.
     * @method calculate
     * @param {object} o optional options object.
     * @param {string} type optional argument to prune modules.
     */
    calculate: function(o, type) {
        if (o || type || this.dirty) {

            if (o) {
                this._config(o);
            }

            if (!this._init) {
                this._setup();
            }

            this._explode();

            if (this.allowRollup) {
                this._rollup();
            }
            this._reduce();
            this._sort();
        }
    },

    _addLangPack: function(lang, m, packName) {
        var name = m.name,
            packPath,
            existing = this.moduleInfo[packName];

        if (!existing) {

            packPath = _path((m.pkg || name), packName, JS, true);

            this.addModule({ path: packPath,
                             intl: true,
                             langPack: true,
                             ext: m.ext,
                             group: m.group,
                             supersedes: [] }, packName, true);

            if (lang) {
                Y.Env.lang = Y.Env.lang || {};
                Y.Env.lang[lang] = Y.Env.lang[lang] || {};
                Y.Env.lang[lang][name] = true;
            }
        }

        return this.moduleInfo[packName];
    },

    /**
     * Investigates the current YUI configuration on the page.  By default,
     * modules already detected will not be loaded again unless a force
     * option is encountered.  Called by calculate()
     * @method _setup
     * @private
     */
    _setup: function() {
        var info = this.moduleInfo, name, i, j, m, l,
            packName;

        for (name in info) {
            if (info.hasOwnProperty(name)) {
                m = info[name];
                if (m) {

                    // remove dups
                    m.requires = YObject.keys(YArray.hash(m.requires));

                    // Create lang pack modules
                    if (m.lang && m.lang.length) {
                        // Setup root package if the module has lang defined,
                        // it needs to provide a root language pack
                        packName = this.getLangPackName(ROOT_LANG, name);
                        this._addLangPack(null, m, packName);
                    }

                }
            }
        }


        //l = Y.merge(this.inserted);
        l = {};

        // available modules
        if (!this.ignoreRegistered) {
            Y.mix(l, GLOBAL_ENV.mods);
        }

        // add the ignore list to the list of loaded packages
        if (this.ignore) {
            Y.mix(l, YArray.hash(this.ignore));
        }

        // expand the list to include superseded modules
        for (j in l) {
            if (l.hasOwnProperty(j)) {
                Y.mix(l, this.getProvides(j));
            }
        }

        // remove modules on the force list from the loaded list
        if (this.force) {
            for (i = 0; i < this.force.length; i++) {
                if (this.force[i] in l) {
                    delete l[this.force[i]];
                }
            }
        }

        Y.mix(this.loaded, l);

        this._init = true;
    },

    /**
     * Builds a module name for a language pack
     * @method getLangPackName
     * @param {string} lang the language code.
     * @param {string} mname the module to build it for.
     * @return {string} the language pack module name.
     */
    getLangPackName: function(lang, mname) {
        return ('lang/' + mname + ((lang) ? '_' + lang : ''));
    },

    /**
     * Inspects the required modules list looking for additional
     * dependencies.  Expands the required list to include all
     * required modules.  Called by calculate()
     * @method _explode
     * @private
     */
    _explode: function() {
        var r = this.required, m, reqs, done = {},
            self = this;

        // the setup phase is over, all modules have been created
        self.dirty = false;

        oeach(r, function(v, name) {
            if (!done[name]) {
                done[name] = true;
                m = self.getModule(name);
                if (m) {
                    var expound = m.expound;

                    if (expound) {
                        r[expound] = self.getModule(expound);
                        reqs = self.getRequires(r[expound]);
                        Y.mix(r, YArray.hash(reqs));
                    }

                    reqs = self.getRequires(m);
                    Y.mix(r, YArray.hash(reqs));
                }
            }
        });

    },

    getModule: function(mname) {
        //TODO: Remove name check - it's a quick hack to fix pattern WIP
        if (!mname) {
            return null;
        }

        var p, found, pname,
            m = this.moduleInfo[mname],
            patterns = this.patterns;

        // check the patterns library to see if we should automatically add
        // the module with defaults
        if (!m) {
            for (pname in patterns) {
                if (patterns.hasOwnProperty(pname)) {
                    p = patterns[pname];

                    // use the metadata supplied for the pattern
                    // as the module definition.
                    if (mname.indexOf(pname) > -1) {
                        found = p;
                        break;
                    }
                }
            }

            if (found) {
                if (p.action) {
                    p.action.call(this, mname, pname);
                } else {
                    // ext true or false?
                    m = this.addModule(Y.merge(found), mname);
                    m.temp = true;
                }
            }
        }

        return m;
    },

    // impl in rollup submodule
    _rollup: function() { },

    /**
     * Remove superceded modules and loaded modules.  Called by
     * calculate() after we have the mega list of all dependencies
     * @method _reduce
     * @return {object} the reduced dependency hash.
     * @private
     */
    _reduce: function(r) {

        r = r || this.required;

        var i, j, s, m, type = this.loadType;
        for (i in r) {
            if (r.hasOwnProperty(i)) {
                m = this.getModule(i);
                // remove if already loaded
                if (((this.loaded[i] || ON_PAGE[i]) &&
                        !this.forceMap[i] && !this.ignoreRegistered) ||
                        (type && m && m.type != type)) {
                    delete r[i];
                }
                // remove anything this module supersedes
                s = m && m.supersedes;
                if (s) {
                    for (j = 0; j < s.length; j++) {
                        if (s[j] in r) {
                            delete r[s[j]];
                        }
                    }
                }
            }
        }

        return r;
    },

    _finish: function(msg, success) {

        _queue.running = false;

        var onEnd = this.onEnd;
        if (onEnd) {
            onEnd.call(this.context, {
                msg: msg,
                data: this.data,
                success: success
            });
        }
        this._continue();
    },

    _onSuccess: function() {
        var self = this, skipped = Y.merge(self.skipped), fn,
            failed = [], rreg = self.requireRegistration,
            success, msg;

        oeach(skipped, function(k) {
            delete self.inserted[k];
        });

        self.skipped = {};

        oeach(self.inserted, function(v, k) {
            var mod = self.getModule(k);
            if (mod && rreg && mod.type == JS && !(k in YUI.Env.mods)) {
                failed.push(k);
            } else {
                Y.mix(self.loaded, self.getProvides(k));
            }
        });

        fn = self.onSuccess;
        msg = (failed.length) ? 'notregistered' : 'success';
        success = !(failed.length);
        if (fn) {
            fn.call(self.context, {
                msg: msg,
                data: self.data,
                success: success,
                failed: failed,
                skipped: skipped
            });
        }
        self._finish(msg, success);
    },
    _onFailure: function(o) {
        var f = this.onFailure, msg = 'failure: ' + o.msg;
        if (f) {
            f.call(this.context, {
                msg: msg,
                data: this.data,
                success: false
            });
        }
        this._finish(msg, false);
    },

    _onTimeout: function() {
        var f = this.onTimeout;
        if (f) {
            f.call(this.context, {
                msg: 'timeout',
                data: this.data,
                success: false
            });
        }
        this._finish('timeout', false);
    },

    /**
     * Sorts the dependency tree.  The last step of calculate()
     * @method _sort
     * @private
     */
    _sort: function() {

        // create an indexed list
        var s = YObject.keys(this.required),
            // loaded = this.loaded,
            done = {},
            p = 0, l, a, b, j, k, moved, doneKey;


        // keep going until we make a pass without moving anything
        for (;;) {

            l = s.length;
            moved = false;

            // start the loop after items that are already sorted
            for (j = p; j < l; j++) {

                // check the next module on the list to see if its
                // dependencies have been met
                a = s[j];

                // check everything below current item and move if we
                // find a requirement for the current item
                for (k = j + 1; k < l; k++) {
                    doneKey = a + s[k];

                    if (!done[doneKey] && this._requires(a, s[k])) {

                        // extract the dependency so we can move it up
                        b = s.splice(k, 1);

                        // insert the dependency above the item that
                        // requires it
                        s.splice(j, 0, b[0]);

                        // only swap two dependencies once to short circut
                        // circular dependencies
                        done[doneKey] = true;

                        // keep working
                        moved = true;

                        break;
                    }
                }

                // jump out of loop if we moved something
                if (moved) {
                    break;
                // this item is sorted, move our pointer and keep going
                } else {
                    p++;
                }
            }

            // when we make it here and moved is false, we are
            // finished sorting
            if (!moved) {
                break;
            }

        }

        this.sorted = s;

    },

    partial: function(partial, o, type) {
        this.sorted = partial;
        this.insert(o, type, true);
    },

    _insert: function(source, o, type, skipcalc) {


        // restore the state at the time of the request
        if (source) {
            this._config(source);
        }

        // build the dependency list
        // don't include type so we can process CSS and script in
        // one pass when the type is not specified.
        if (!skipcalc) {
            this.calculate(o);
        }

        this.loadType = type;

        if (!type) {

            var self = this;

            this._internalCallback = function() {

                var f = self.onCSS, n, p, sib;

                // IE hack for style overrides that are not being applied
                if (this.insertBefore && Y.UA.ie) {
                    n = Y.config.doc.getElementById(this.insertBefore);
                    p = n.parentNode;
                    sib = n.nextSibling;
                    p.removeChild(n);
                    if (sib) {
                        p.insertBefore(n, sib);
                    } else {
                        p.appendChild(n);
                    }
                }

                if (f) {
                    f.call(self.context, Y);
                }
                self._internalCallback = null;

                self._insert(null, null, JS);
            };

            this._insert(null, null, CSS);

            return;
        }

        // set a flag to indicate the load has started
        this._loading = true;

        // flag to indicate we are done with the combo service
        // and any additional files will need to be loaded
        // individually
        this._combineComplete = {};

        // start the load
        this.loadNext();

    },

    // Once a loader operation is completely finished, process
    // any additional queued items.
    _continue: function() {
        if (!(_queue.running) && _queue.size() > 0) {
            _queue.running = true;
            _queue.next()();
        }
    },

    /**
     * inserts the requested modules and their dependencies.
     * <code>type</code> can be "js" or "css".  Both script and
     * css are inserted if type is not provided.
     * @method insert
     * @param {object} o optional options object.
     * @param {string} type the type of dependency to insert.
     */
    insert: function(o, type, skipsort) {
        var self = this, copy = Y.merge(this);
        delete copy.require;
        delete copy.dirty;
        _queue.add(function() {
            self._insert(copy, o, type, skipsort);
        });
        this._continue();
    },

    /**
     * Executed every time a module is loaded, and if we are in a load
     * cycle, we attempt to load the next script.  Public so that it
     * is possible to call this if using a method other than
     * Y.register to determine when scripts are fully loaded
     * @method loadNext
     * @param {string} mname optional the name of the module that has
     * been loaded (which is usually why it is time to load the next
     * one).
     */
    loadNext: function(mname) {
        // It is possible that this function is executed due to something
        // else one the page loading a YUI module.  Only react when we
        // are actively loading something
        if (!this._loading) {
            return;
        }

        var s, len, i, m, url, fn, msg, attr, group, groupName, j, frag,
            comboSource, comboSources, mods, combining, urls, comboBase,
            self = this,
            type = self.loadType,
            handleSuccess = function(o) {
                self.loadNext(o.data);
            },
            handleCombo = function(o) {
                self._combineComplete[type] = true;
                var i, len = combining.length;

                for (i = 0; i < len; i++) {
                    self.inserted[combining[i]] = true;
                }

                handleSuccess(o);
            };

        if (self.combine && (!self._combineComplete[type])) {

            combining = [];

            self._combining = combining;
            s = self.sorted;
            len = s.length;

            // the default combo base
            comboBase = self.comboBase;

            url = comboBase;
            urls = [];

            comboSources = {};

            for (i = 0; i < len; i++) {
                comboSource = comboBase;
                m = self.getModule(s[i]);
                groupName = m && m.group;
                if (groupName) {

                    group = self.groups[groupName];

                    if (!group.combine) {
                        m.combine = false;
                        continue;
                    }
                    m.combine = true;
                    if (group.comboBase) {
                        comboSource = group.comboBase;
                    }

                    if (group.root) {
                        m.root = group.root;
                    }

                }

                comboSources[comboSource] = comboSources[comboSource] || [];
                comboSources[comboSource].push(m);
            }

            for (j in comboSources) {
                if (comboSources.hasOwnProperty(j)) {
                    url = j;
                    mods = comboSources[j];
                    len = mods.length;

                    for (i = 0; i < len; i++) {
                        // m = self.getModule(s[i]);
                        m = mods[i];

                        // Do not try to combine non-yui JS unless combo def
                        // is found
                        if (m && (m.type === type) && (m.combine || !m.ext)) {

                            frag = (m.root || self.root) + m.path;

                            if ((url !== j) && (i < (len - 1)) &&
                            ((frag.length + url.length) > self.maxURLLength)) {
                                urls.push(self._filter(url));
                                url = j;
                            }

                            //k2-patch:rewrite combo url rule & fix url bug:{{{
                            //url bug is http://yuilibrary.com/projects/yui3/ticket/2528680
                            if(url.slice(-3) ==='.js' || url.slice(-4) === '.css'){
                                //for K2
                                //use Minify Combo URL Rule instead of YUI Combo Handler Rule
                                url += ',';
                            }

                            url += frag;

                            /*
                            if (i < (len - 1)) {
                                url += '&';
                            }
                            */

                            //Y.log(url,'info','loader');
                            //rewrite combo url rule & fix url bug:}}}

                            combining.push(m.name);
                        }

                    }

                    if (combining.length && (url != j)) {
                        urls.push(self._filter(url));
                    }
                }
            }

            if (combining.length) {


                // if (m.type === CSS) {
                if (type === CSS) {
                    fn = Y.Get.css;
                    attr = self.cssAttributes;
                } else {
                    fn = Y.Get.script;
                    attr = self.jsAttributes;
                }

                fn(urls, {
                    data: self._loading,
                    onSuccess: handleCombo,
                    onFailure: self._onFailure,
                    onTimeout: self._onTimeout,
                    insertBefore: self.insertBefore,
                    charset: self.charset,
                    attributes: attr,
                    timeout: self.timeout,
                    autopurge: false,
                    context: self
                });

                return;

            } else {
                self._combineComplete[type] = true;
            }
        }

        if (mname) {

            // if the module that was just loaded isn't what we were expecting,
            // continue to wait
            if (mname !== self._loading) {
                return;
            }


            // The global handler that is called when each module is loaded
            // will pass that module name to this function.  Storing this
            // data to avoid loading the same module multiple times
            // centralize this in the callback
            self.inserted[mname] = true;
            // self.loaded[mname] = true;

            // provided = self.getProvides(mname);
            // Y.mix(self.loaded, provided);
            // Y.mix(self.inserted, provided);

            if (self.onProgress) {
                self.onProgress.call(self.context, {
                        name: mname,
                        data: self.data
                    });
            }
        }

        s = self.sorted;
        len = s.length;

        for (i = 0; i < len; i = i + 1) {
            // this.inserted keeps track of what the loader has loaded.
            // move on if this item is done.
            if (s[i] in self.inserted) {
                continue;
            }

            // Because rollups will cause multiple load notifications
            // from Y, loadNext may be called multiple times for
            // the same module when loading a rollup.  We can safely
            // skip the subsequent requests
            if (s[i] === self._loading) {
                return;
            }

            // log("inserting " + s[i]);
            m = self.getModule(s[i]);

            if (!m) {
                if (!self.skipped[s[i]]) {
                    msg = 'Undefined module ' + s[i] + ' skipped';
                    // self.inserted[s[i]] = true;
                    self.skipped[s[i]] = true;
                }
                continue;

            }

            group = (m.group && self.groups[m.group]) || NOT_FOUND;

            // The load type is stored to offer the possibility to load
            // the css separately from the script.
            if (!type || type === m.type) {
                self._loading = s[i];

                if (m.type === CSS) {
                    fn = Y.Get.css;
                    attr = self.cssAttributes;
                } else {
                    fn = Y.Get.script;
                    attr = self.jsAttributes;
                }

                url = (m.fullpath) ? self._filter(m.fullpath, s[i]) :
                      self._url(m.path, s[i], group.base || m.base);

                fn(url, {
                    data: s[i],
                    onSuccess: handleSuccess,
                    insertBefore: self.insertBefore,
                    charset: self.charset,
                    attributes: attr,
                    onFailure: self._onFailure,
                    onTimeout: self._onTimeout,
                    timeout: self.timeout,
                    autopurge: false,
                    context: self
                });

                return;
            }
        }

        // we are finished
        self._loading = null;

        fn = self._internalCallback;

        // internal callback for loading css first
        if (fn) {
            self._internalCallback = null;
            fn.call(self);
        } else {
            self._onSuccess();
        }
    },

    /**
     * Apply filter defined for this instance to a url/path
     * method _filter
     * @param {string} u the string to filter.
     * @param {string} name the name of the module, if we are processing
     * a single module as opposed to a combined url.
     * @return {string} the filtered string.
     * @private
     */
    _filter: function(u, name) {
        var f = this.filter,
            hasFilter = name && (name in this.filters),
            modFilter = hasFilter && this.filters[name];

        if (u) {
            if (hasFilter) {
                f = (L.isString(modFilter)) ?
                    this.FILTER_DEFS[modFilter.toUpperCase()] || null :
                    modFilter;
            }
            if (f) {
                u = u.replace(new RegExp(f.searchExp, 'g'), f.replaceStr);
            }
        }

        return u;
    },

    /**
     * Generates the full url for a module
     * method _url
     * @param {string} path the path fragment.
     * @return {string} the full url.
     * @private
     */
    _url: function(path, name, base) {
        return this._filter((base || this.base || '') + path, name);
    }
};




}, '3.3.0' ,{requires:['get']});
//loader-base:}}}

//loader-yui3:{{{
/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.3.0
build: 3167
*/
YUI.add('loader-yui3', function(Y) {

/* This file is auto-generated by src/loader/meta_join.py */

/**
 * YUI 3 module metadata
 * @module loader
 * @submodule yui3
 */
YUI.Env[Y.version].modules = YUI.Env[Y.version].modules || {
    "anim": {
        "submodules": {
            "anim-base": {
                "requires": [
                    "base-base", 
                    "node-style"
                ]
            }, 
            "anim-color": {
                "requires": [
                    "anim-base"
                ]
            }, 
            "anim-curve": {
                "requires": [
                    "anim-xy"
                ]
            }, 
            "anim-easing": {
                "requires": [
                    "anim-base"
                ]
            }, 
            "anim-node-plugin": {
                "requires": [
                    "node-pluginhost", 
                    "anim-base"
                ]
            }, 
            "anim-scroll": {
                "requires": [
                    "anim-base"
                ]
            }, 
            "anim-xy": {
                "requires": [
                    "anim-base", 
                    "node-screen"
                ]
            }
        }
    }, 
    "arraysort": {
        "requires": [
            "yui-base"
        ]
    }, 
    "async-queue": {
        "requires": [
            "event-custom"
        ]
    }, 
    "attribute": {
        "submodules": {
            "attribute-base": {
                "requires": [
                    "event-custom"
                ]
            }, 
            "attribute-complex": {
                "requires": [
                    "attribute-base"
                ]
            }
        }
    }, 
    "autocomplete": {
        "submodules": {
            "autocomplete-base": {
                "optional": [
                    "autocomplete-sources"
                ], 
                "plugins": {
                    "autocomplete-filters": {
                        "path": "autocomplete/autocomplete-filters-min.js", 
                        "requires": [
                            "array-extras", 
                            "text-wordbreak"
                        ]
                    }, 
                    "autocomplete-filters-accentfold": {
                        "path": "autocomplete/autocomplete-filters-accentfold-min.js", 
                        "requires": [
                            "array-extras", 
                            "text-accentfold", 
                            "text-wordbreak"
                        ]
                    }, 
                    "autocomplete-highlighters": {
                        "path": "autocomplete/autocomplete-highlighters-min.js", 
                        "requires": [
                            "array-extras", 
                            "highlight-base"
                        ]
                    }, 
                    "autocomplete-highlighters-accentfold": {
                        "path": "autocomplete/autocomplete-highlighters-accentfold-min.js", 
                        "requires": [
                            "array-extras", 
                            "highlight-accentfold"
                        ]
                    }
                }, 
                "requires": [
                    "array-extras", 
                    "base-build", 
                    "escape", 
                    "event-valuechange", 
                    "node-base"
                ]
            }, 
            "autocomplete-list": {
                "after": "autocomplete-sources", 
                "lang": [
                    "en"
                ], 
                "plugins": {
                    "autocomplete-list-keys": {
                        "condition": {
                            "test": function (Y) {
    // Only add keyboard support to autocomplete-list if this doesn't appear to
    // be an iOS or Android-based mobile device.
    //
    // There's currently no feasible way to actually detect whether a device has
    // a hardware keyboard, so this sniff will have to do. It can easily be
    // overridden by manually loading the autocomplete-list-keys module.
    //
    // Worth noting: even though iOS supports bluetooth keyboards, Mobile Safari
    // doesn't fire the keyboard events used by AutoCompleteList, so there's
    // no point loading the -keys module even when a bluetooth keyboard may be
    // available.
    return !(Y.UA.ios || Y.UA.android);
}, 
                            "trigger": "autocomplete-list"
                        }, 
                        "path": "autocomplete/autocomplete-list-keys-min.js", 
                        "requires": [
                            "autocomplete-list", 
                            "base-build"
                        ]
                    }, 
                    "autocomplete-plugin": {
                        "path": "autocomplete/autocomplete-plugin-min.js", 
                        "requires": [
                            "autocomplete-list", 
                            "node-pluginhost"
                        ]
                    }
                }, 
                "requires": [
                    "autocomplete-base", 
                    "selector-css3", 
                    "widget", 
                    "widget-position", 
                    "widget-position-align", 
                    "widget-stack"
                ], 
                "skinnable": true
            }, 
            "autocomplete-sources": {
                "optional": [
                    "io-base", 
                    "json-parse", 
                    "jsonp", 
                    "yql"
                ], 
                "requires": [
                    "autocomplete-base"
                ]
            }
        }
    }, 
    "base": {
        "submodules": {
            "base-base": {
                "after": [
                    "attribute-complex"
                ], 
                "requires": [
                    "attribute-base"
                ]
            }, 
            "base-build": {
                "requires": [
                    "base-base"
                ]
            }, 
            "base-pluginhost": {
                "requires": [
                    "base-base", 
                    "pluginhost"
                ]
            }
        }
    }, 
    "cache": {
        "submodules": {
            "cache-base": {
                "requires": [
                    "base"
                ]
            }, 
            "cache-offline": {
                "requires": [
                    "cache-base", 
                    "json"
                ]
            }, 
            "cache-plugin": {
                "requires": [
                    "plugin", 
                    "cache-base"
                ]
            }
        }
    }, 
    "charts": {
        "requires": [
            "dom", 
            "datatype", 
            "event-custom", 
            "event-mouseenter", 
            "widget", 
            "widget-position", 
            "widget-stack"
        ]
    }, 
    "classnamemanager": {
        "requires": [
            "yui-base"
        ]
    }, 
    "collection": {
        "submodules": {
            "array-extras": {}, 
            "array-invoke": {}, 
            "arraylist": {}, 
            "arraylist-add": {
                "requires": [
                    "arraylist"
                ]
            }, 
            "arraylist-filter": {
                "requires": [
                    "arraylist"
                ]
            }
        }
    }, 
    "compat": {
        "requires": [
            "event-base", 
            "dom", 
            "dump", 
            "substitute"
        ]
    }, 
    "console": {
        "lang": [
            "en", 
            "es"
        ], 
        "plugins": {
            "console-filters": {
                "requires": [
                    "plugin", 
                    "console"
                ], 
                "skinnable": true
            }
        }, 
        "requires": [
            "yui-log", 
            "widget", 
            "substitute"
        ], 
        "skinnable": true
    }, 
    "cookie": {
        "requires": [
            "yui-base"
        ]
    }, 
    "cssbase": {
        "after": [
            "cssreset", 
            "cssfonts", 
            "cssgrids", 
            "cssreset-context", 
            "cssfonts-context", 
            "cssgrids-context"
        ], 
        "path": "cssbase/base-min.css", 
        "type": "css"
    }, 
    "cssbase-context": {
        "after": [
            "cssreset", 
            "cssfonts", 
            "cssgrids", 
            "cssreset-context", 
            "cssfonts-context", 
            "cssgrids-context"
        ], 
        "path": "cssbase/base-context-min.css", 
        "type": "css"
    }, 
    "cssfonts": {
        "path": "cssfonts/fonts-min.css", 
        "type": "css"
    }, 
    "cssfonts-context": {
        "path": "cssfonts/fonts-context-min.css", 
        "type": "css"
    }, 
    "cssgrids": {
        "optional": [
            "cssreset", 
            "cssfonts"
        ], 
        "path": "cssgrids/grids-min.css", 
        "type": "css"
    }, 
    "cssgrids-context-deprecated": {
        "optional": [
            "cssreset-context"
        ], 
        "path": "cssgrids-deprecated/grids-context-min.css", 
        "requires": [
            "cssfonts-context"
        ], 
        "type": "css"
    }, 
    "cssgrids-deprecated": {
        "optional": [
            "cssreset"
        ], 
        "path": "cssgrids-deprecated/grids-min.css", 
        "requires": [
            "cssfonts"
        ], 
        "type": "css"
    }, 
    "cssreset": {
        "path": "cssreset/reset-min.css", 
        "type": "css"
    }, 
    "cssreset-context": {
        "path": "cssreset/reset-context-min.css", 
        "type": "css"
    }, 
    "dataschema": {
        "submodules": {
            "dataschema-array": {
                "requires": [
                    "dataschema-base"
                ]
            }, 
            "dataschema-base": {
                "requires": [
                    "base"
                ]
            }, 
            "dataschema-json": {
                "requires": [
                    "dataschema-base", 
                    "json"
                ]
            }, 
            "dataschema-text": {
                "requires": [
                    "dataschema-base"
                ]
            }, 
            "dataschema-xml": {
                "requires": [
                    "dataschema-base"
                ]
            }
        }
    }, 
    "datasource": {
        "submodules": {
            "datasource-arrayschema": {
                "requires": [
                    "datasource-local", 
                    "plugin", 
                    "dataschema-array"
                ]
            }, 
            "datasource-cache": {
                "requires": [
                    "datasource-local", 
                    "cache-base"
                ]
            }, 
            "datasource-function": {
                "requires": [
                    "datasource-local"
                ]
            }, 
            "datasource-get": {
                "requires": [
                    "datasource-local", 
                    "get"
                ]
            }, 
            "datasource-io": {
                "requires": [
                    "datasource-local", 
                    "io-base"
                ]
            }, 
            "datasource-jsonschema": {
                "requires": [
                    "datasource-local", 
                    "plugin", 
                    "dataschema-json"
                ]
            }, 
            "datasource-local": {
                "requires": [
                    "base"
                ]
            }, 
            "datasource-polling": {
                "requires": [
                    "datasource-local"
                ]
            }, 
            "datasource-textschema": {
                "requires": [
                    "datasource-local", 
                    "plugin", 
                    "dataschema-text"
                ]
            }, 
            "datasource-xmlschema": {
                "requires": [
                    "datasource-local", 
                    "plugin", 
                    "dataschema-xml"
                ]
            }
        }
    }, 
    "datatable": {
        "submodules": {
            "datatable-base": {
                "requires": [
                    "recordset-base", 
                    "widget", 
                    "substitute", 
                    "event-mouseenter"
                ], 
                "skinnable": true
            }, 
            "datatable-datasource": {
                "requires": [
                    "datatable-base", 
                    "plugin", 
                    "datasource-local"
                ]
            }, 
            "datatable-scroll": {
                "requires": [
                    "datatable-base", 
                    "plugin", 
                    "stylesheet"
                ]
            }, 
            "datatable-sort": {
                "lang": [
                    "en"
                ], 
                "requires": [
                    "datatable-base", 
                    "plugin", 
                    "recordset-sort"
                ]
            }
        }
    }, 
    "datatype": {
        "submodules": {
            "datatype-date": {
                "lang": [
                    "ar", 
                    "ar-JO", 
                    "ca", 
                    "ca-ES", 
                    "da", 
                    "da-DK", 
                    "de", 
                    "de-AT", 
                    "de-DE", 
                    "el", 
                    "el-GR", 
                    "en", 
                    "en-AU", 
                    "en-CA", 
                    "en-GB", 
                    "en-IE", 
                    "en-IN", 
                    "en-JO", 
                    "en-MY", 
                    "en-NZ", 
                    "en-PH", 
                    "en-SG", 
                    "en-US", 
                    "es", 
                    "es-AR", 
                    "es-BO", 
                    "es-CL", 
                    "es-CO", 
                    "es-EC", 
                    "es-ES", 
                    "es-MX", 
                    "es-PE", 
                    "es-PY", 
                    "es-US", 
                    "es-UY", 
                    "es-VE", 
                    "fi", 
                    "fi-FI", 
                    "fr", 
                    "fr-BE", 
                    "fr-CA", 
                    "fr-FR", 
                    "hi", 
                    "hi-IN", 
                    "id", 
                    "id-ID", 
                    "it", 
                    "it-IT", 
                    "ja", 
                    "ja-JP", 
                    "ko", 
                    "ko-KR", 
                    "ms", 
                    "ms-MY", 
                    "nb", 
                    "nb-NO", 
                    "nl", 
                    "nl-BE", 
                    "nl-NL", 
                    "pl", 
                    "pl-PL", 
                    "pt", 
                    "pt-BR", 
                    "ro", 
                    "ro-RO", 
                    "ru", 
                    "ru-RU", 
                    "sv", 
                    "sv-SE", 
                    "th", 
                    "th-TH", 
                    "tr", 
                    "tr-TR", 
                    "vi", 
                    "vi-VN", 
                    "zh-Hans", 
                    "zh-Hans-CN", 
                    "zh-Hant", 
                    "zh-Hant-HK", 
                    "zh-Hant-TW"
                ], 
                "requires": [
                    "yui-base"
                ], 
                "supersedes": [
                    "datatype-date-format"
                ]
            }, 
            "datatype-number": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "datatype-xml": {
                "requires": [
                    "yui-base"
                ]
            }
        }
    }, 
    "datatype-date-format": {
        "path": "datatype/datatype-date-format-min.js"
    }, 
    "dd": {
        "plugins": {
            "dd-drop-plugin": {
                "requires": [
                    "dd-drop"
                ]
            }, 
            "dd-gestures": {
                "condition": {
                    "test": function(Y) {
    return (Y.config.win && ('ontouchstart' in Y.config.win && !Y.UA.chrome));
}, 
                    "trigger": "dd-drag"
                }, 
                "requires": [
                    "dd-drag", 
                    "event-move"
                ]
            }, 
            "dd-plugin": {
                "optional": [
                    "dd-constrain", 
                    "dd-proxy"
                ], 
                "requires": [
                    "dd-drag"
                ]
            }
        }, 
        "submodules": {
            "dd-constrain": {
                "requires": [
                    "dd-drag"
                ]
            }, 
            "dd-ddm": {
                "requires": [
                    "dd-ddm-base", 
                    "event-resize"
                ]
            }, 
            "dd-ddm-base": {
                "requires": [
                    "node", 
                    "base", 
                    "yui-throttle", 
                    "classnamemanager"
                ]
            }, 
            "dd-ddm-drop": {
                "requires": [
                    "dd-ddm"
                ]
            }, 
            "dd-delegate": {
                "requires": [
                    "dd-drag", 
                    "dd-drop-plugin", 
                    "event-mouseenter"
                ]
            }, 
            "dd-drag": {
                "requires": [
                    "dd-ddm-base"
                ]
            }, 
            "dd-drop": {
                "requires": [
                    "dd-ddm-drop"
                ]
            }, 
            "dd-proxy": {
                "requires": [
                    "dd-drag"
                ]
            }, 
            "dd-scroll": {
                "requires": [
                    "dd-drag"
                ]
            }
        }
    }, 
    "dial": {
        "lang": [
            "en", 
            "es"
        ], 
        "requires": [
            "widget", 
            "dd-drag", 
            "substitute", 
            "event-mouseenter", 
            "transition", 
            "intl"
        ], 
        "skinnable": true
    }, 
    "dom": {
        "plugins": {
            "dom-deprecated": {
                "requires": [
                    "dom-base"
                ]
            }, 
            "dom-style-ie": {
                "condition": {
                    "test": function (Y) {

    var testFeature = Y.Features.test,
        addFeature = Y.Features.add,
        WINDOW = Y.config.win,
        DOCUMENT = Y.config.doc,
        DOCUMENT_ELEMENT = 'documentElement',
        ret = false;

    addFeature('style', 'computedStyle', {
        test: function() {
            return WINDOW && 'getComputedStyle' in WINDOW;
        }
    });

    addFeature('style', 'opacity', {
        test: function() {
            return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;
        }
    });

    ret =  (!testFeature('style', 'opacity') &&
            !testFeature('style', 'computedStyle'));

    return ret;
}, 
                    "trigger": "dom-style"
                }, 
                "requires": [
                    "dom-style"
                ]
            }, 
            "selector-css3": {
                "requires": [
                    "selector-css2"
                ]
            }
        }, 
        "requires": [
            "oop"
        ], 
        "submodules": {
            "dom-base": {
                "requires": [
                    "oop"
                ]
            }, 
            "dom-screen": {
                "requires": [
                    "dom-base", 
                    "dom-style"
                ]
            }, 
            "dom-style": {
                "requires": [
                    "dom-base"
                ]
            }, 
            "selector": {
                "requires": [
                    "dom-base"
                ]
            }, 
            "selector-css2": {
                "requires": [
                    "selector-native"
                ]
            }, 
            "selector-native": {
                "requires": [
                    "dom-base"
                ]
            }
        }
    }, 
    "dump": {
        "requires": [
            "yui-base"
        ]
    }, 
    "editor": {
        "submodules": {
            "createlink-base": {
                "requires": [
                    "editor-base"
                ]
            }, 
            "editor-base": {
                "requires": [
                    "base", 
                    "frame", 
                    "node", 
                    "exec-command", 
                    "selection"
                ],
								/* k2-patch fix image blur bug for ie,by wulong */
								"path": "editor/editor-base-path-min.js"
            }, 
            "editor-bidi": {
                "requires": [
                    "editor-base"
                ]
            }, 
            "editor-br": {
                "requires": [
                    "node"
                ]
            }, 
            "editor-lists": {
                "requires": [
                    "editor-base"
                ]
            }, 
            "editor-para": {
                "requires": [
                    "node"
                ]
            }, 
            "exec-command": {
                "requires": [
                    "frame"
                ]
            }, 
            "frame": {
                "requires": [
                    "base", 
                    "node", 
                    "selector-css3", 
                    "substitute"
                ]
            }, 
            "selection": {
                "requires": [
                    "node"
                ]
            }
        }
    }, 
    "escape": {}, 
    "event": {
        "after": "node-base", 
        "plugins": {
            "event-base-ie": {
                "after": [
                    "event-base"
                ], 
                "condition": {
                    "test": function(Y) {
    var imp = Y.config.doc && Y.config.doc.implementation;
    return (imp && (!imp.hasFeature('Events', '2.0')));
}, 
                    "trigger": "node-base"
                }, 
                "requires": [
                    "node-base"
                ]
            }, 
            "event-touch": {
                "requires": [
                    "node-base"
                ]
            }
        }, 
        "submodules": {
            "event-base": {
                "after": "node-base", 
                "requires": [
                    "event-custom-base"
                ]
            }, 
            "event-delegate": {
                "requires": [
                    "node-base"
                ]
            }, 
            "event-focus": {
                "requires": [
                    "event-synthetic"
                ]
            }, 
            "event-hover": {
                "requires": [
                    "event-synthetic"
                ]
            }, 
            "event-key": {
                "requires": [
                    "event-synthetic"
                ]
            }, 
            "event-mouseenter": {
                "requires": [
                    "event-synthetic"
                ]
            }, 
            "event-mousewheel": {
                "requires": [
                    "event-synthetic"
                ]
            }, 
            "event-resize": {
                "requires": [
                    "event-synthetic"
                ]
            }, 
            "event-synthetic": {
                "requires": [
                    "node-base", 
                    "event-custom-complex"
                ]
            }
        }
    }, 
    "event-custom": {
        "submodules": {
            "event-custom-base": {
                "requires": [
                    "oop"
                ]
            }, 
            "event-custom-complex": {
                "requires": [
                    "event-custom-base"
                ]
            }
        }
    }, 
    "event-gestures": {
        "submodules": {
            "event-flick": {
                "requires": [
                    "node-base", 
                    "event-touch", 
                    "event-synthetic"
                ]
            }, 
            "event-move": {
                "requires": [
                    "node-base", 
                    "event-touch", 
                    "event-synthetic"
                ]
            }
        }
    }, 
    "event-simulate": {
        "requires": [
            "event-base"
        ]
    }, 
    "event-valuechange": {
        "requires": [
            "event-focus", 
            "event-synthetic"
        ]
    }, 
    "highlight": {
        "submodules": {
            "highlight-accentfold": {
                "requires": [
                    "highlight-base", 
                    "text-accentfold"
                ]
            }, 
            "highlight-base": {
                "requires": [
                    "array-extras", 
                    "escape", 
                    "text-wordbreak"
                ]
            }
        }
    }, 
    "history": {
        "plugins": {
            "history-hash-ie": {
                "condition": {
                    "test": function (Y) {
    var docMode = Y.config.doc.documentMode;

    return Y.UA.ie && (!('onhashchange' in Y.config.win) ||
            !docMode || docMode < 8);
}, 
                    "trigger": "history-hash"
                }, 
                "requires": [
                    "history-hash", 
                    "node-base"
                ]
            }
        }, 
        "submodules": {
            "history-base": {
                "after": [
                    "history-deprecated"
                ], 
                "requires": [
                    "event-custom-complex"
                ]
            }, 
            "history-hash": {
                "after": [
                    "history-html5"
                ], 
                "requires": [
                    "event-synthetic", 
                    "history-base", 
                    "yui-later"
                ]
            }, 
            "history-html5": {
                "optional": [
                    "json"
                ], 
                "requires": [
                    "event-base", 
                    "history-base", 
                    "node-base"
                ]
            }
        }
    }, 
    "history-deprecated": {
        "requires": [
            "node"
        ]
    }, 
    "imageloader": {
        "requires": [
            "base-base", 
            "node-style", 
            "node-screen"
        ]
    }, 
    "intl": {
        "requires": [
            "intl-base", 
            "event-custom"
        ]
    }, 
    "io": {
        "submodules": {
            "io-base": {
                "optional": [
                    "querystring-stringify-simple"
                ], 
                "requires": [
                    "event-custom-base"
                ]
            }, 
            "io-form": {
                "requires": [
                    "io-base", 
                    "node-base", 
                    "node-style"
                ]
            }, 
            "io-queue": {
                "requires": [
                    "io-base", 
                    "queue-promote"
                ]
            }, 
            "io-upload-iframe": {
                "requires": [
                    "io-base", 
                    "node-base"
                ]
            }, 
            "io-xdr": {
                "requires": [
                    "io-base", 
                    "datatype-xml"
                ]
            }
        }
    }, 
    "json": {
        "submodules": {
            "json-parse": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "json-stringify": {
                "requires": [
                    "yui-base"
                ]
            }
        }
    }, 
    "jsonp": {
        "plugins": {
            "jsonp-url": {
                "requires": [
                    "jsonp"
                ]
            }
        }, 
        "requires": [
            "get", 
            "oop"
        ]
    }, 
    "loader": {
        "submodules": {
            "loader-base": {
                "requires": [
                    "get"
                ]
            }, 
            "loader-rollup": {
                "requires": [
                    "loader-base"
                ]
            }, 
            "loader-yui3": {
                "requires": [
                    "loader-base"
                ]
            }
        }
    }, 
    "node": {
        "plugins": {
            "align-plugin": {
                "requires": [
                    "node-screen", 
                    "node-pluginhost"
                ]
            }, 
            "node-deprecated": {
                "requires": [
                    "node-base"
                ]
            }, 
            "node-event-simulate": {
                "requires": [
                    "node-base", 
                    "event-simulate"
                ]
            }, 
            "node-load": {
                "requires": [
                    "node-base", 
                    "io-base"
                ]
            }, 
            "shim-plugin": {
                "requires": [
                    "node-style", 
                    "node-pluginhost"
                ]
            }, 
            "transition": {
                "requires": [
                    "transition-native", 
                    "node-style"
                ]
            }, 
            "transition-native": {
                "requires": [
                    "node-base"
                ]
            }
        }, 
        "submodules": {
            "node-base": {
                "requires": [
                    "dom-base", 
                    "selector-css2", 
                    "event-base"
                ]
            }, 
            "node-event-delegate": {
                "requires": [
                    "node-base", 
                    "event-delegate"
                ]
            }, 
            "node-pluginhost": {
                "requires": [
                    "node-base", 
                    "pluginhost"
                ]
            }, 
            "node-screen": {
                "requires": [
                    "dom-screen", 
                    "node-base"
                ]
            }, 
            "node-style": {
                "requires": [
                    "dom-style", 
                    "node-base"
                ]
            }
        }
    }, 
    "node-flick": {
        "requires": [
            "classnamemanager", 
            "transition", 
            "event-flick", 
            "plugin"
        ], 
        "skinnable": true
    }, 
    "node-focusmanager": {
        "requires": [
            "attribute", 
            "node", 
            "plugin", 
            "node-event-simulate", 
            "event-key", 
            "event-focus"
        ]
    }, 
    "node-menunav": {
        "requires": [
            "node", 
            "classnamemanager", 
            "plugin", 
            "node-focusmanager"
        ], 
        "skinnable": true
    }, 
    "oop": {
        "requires": [
            "yui-base"
        ]
    }, 
    "overlay": {
        "requires": [
            "widget", 
            "widget-stdmod", 
            "widget-position", 
            "widget-position-align", 
            "widget-stack", 
            "widget-position-constrain"
        ], 
        "skinnable": true
    }, 
    "plugin": {
        "requires": [
            "base-base"
        ]
    }, 
    "pluginhost": {
        "submodules": {
            "pluginhost-base": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "pluginhost-config": {
                "requires": [
                    "pluginhost-base"
                ]
            }
        }
    }, 
    "profiler": {
        "requires": [
            "yui-base"
        ]
    }, 
    "querystring": {
        "submodules": {
            "querystring-parse": {
                "requires": [
                    "yui-base", 
                    "array-extras"
                ]
            }, 
            "querystring-stringify": {
                "requires": [
                    "yui-base"
                ]
            }
        }
    }, 
    "querystring-parse-simple": {
        "path": "querystring/querystring-parse-simple-min.js", 
        "requires": [
            "yui-base"
        ]
    }, 
    "querystring-stringify-simple": {
        "path": "querystring/querystring-stringify-simple-min.js", 
        "requires": [
            "yui-base"
        ]
    }, 
    "queue-promote": {
        "requires": [
            "yui-base"
        ]
    }, 
    "queue-run": {
        "path": "async-queue/async-queue-min.js", 
        "requires": [
            "event-custom"
        ]
    }, 
    "recordset": {
        "submodules": {
            "recordset-base": {
                "requires": [
                    "base", 
                    "arraylist"
                ]
            }, 
            "recordset-filter": {
                "requires": [
                    "recordset-base", 
                    "array-extras", 
                    "plugin"
                ]
            }, 
            "recordset-indexer": {
                "requires": [
                    "recordset-base", 
                    "plugin"
                ]
            }, 
            "recordset-sort": {
                "requires": [
                    "arraysort", 
                    "recordset-base", 
                    "plugin"
                ]
            }
        }
    }, 
    "resize": {
        "submodules": {
            "resize-base": {
                "requires": [
                    "widget", 
                    "substitute", 
                    "event", 
                    "oop", 
                    "dd-drag", 
                    "dd-delegate", 
                    "dd-drop"
                ], 
                "skinnable": true
            }, 
            "resize-constrain": {
                "requires": [
                    "plugin", 
                    "resize-base"
                ]
            }, 
            "resize-proxy": {
                "requires": [
                    "plugin", 
                    "resize-base"
                ]
            }
        }
    }, 
    "scrollview": {
        "plugins": {
            "scrollview-base": {
                "path": "scrollview/scrollview-base-min.js", 
                "requires": [
                    "widget", 
                    "event-gestures", 
                    "transition"
                ], 
                "skinnable": true
            }, 
            "scrollview-base-ie": {
                "condition": {
                    "trigger": "scrollview-base", 
                    "ua": "ie"
                }, 
                "requires": [
                    "scrollview-base"
                ]
            }, 
            "scrollview-paginator": {
                "path": "scrollview/scrollview-paginator-min.js", 
                "requires": [
                    "plugin"
                ]
            }, 
            "scrollview-scrollbars": {
                "path": "scrollview/scrollview-scrollbars-min.js", 
                "requires": [
                    "plugin"
                ], 
                "skinnable": true
            }
        }, 
        "requires": [
            "scrollview-base", 
            "scrollview-scrollbars"
        ]
    }, 
    "slider": {
        "submodules": {
            "clickable-rail": {
                "requires": [
                    "slider-base"
                ]
            }, 
            "range-slider": {
                "requires": [
                    "slider-base", 
                    "slider-value-range", 
                    "clickable-rail"
                ]
            }, 
            "slider-base": {
                "requires": [
                    "widget", 
                    "dd-constrain", 
                    "substitute"
                ], 
                "skinnable": true
            }, 
            "slider-value-range": {
                "requires": [
                    "slider-base"
                ]
            }
        }
    }, 
    "sortable": {
        "plugins": {
            "sortable-scroll": {
                "requires": [
                    "dd-scroll"
                ]
            }
        }, 
        "requires": [
            "dd-delegate", 
            "dd-drop-plugin", 
            "dd-proxy"
        ]
    }, 
    "stylesheet": {
        "requires": [
            "yui-base"
        ]
    }, 
    "substitute": {
        "optional": [
            "dump"
        ]
    }, 
    "swf": {
        "requires": [
            "event-custom", 
            "node", 
            "swfdetect"
        ]
    }, 
    "swfdetect": {}, 
    "tabview": {
        "plugins": {
            "tabview-base": {
                "requires": [
                    "node-event-delegate", 
                    "classnamemanager", 
                    "skin-sam-tabview"
                ]
            }, 
            "tabview-plugin": {
                "requires": [
                    "tabview-base"
                ]
            }
        }, 
        "requires": [
            "widget", 
            "widget-parent", 
            "widget-child", 
            "tabview-base", 
            "node-pluginhost", 
            "node-focusmanager"
        ], 
        "skinnable": true
    }, 
    "test": {
        "requires": [
            "substitute", 
            "node", 
            "json", 
            "event-simulate"
        ], 
        "skinnable": true
    }, 
    "text": {
        "submodules": {
            "text-accentfold": {
                "requires": [
                    "array-extras", 
                    "text-data-accentfold"
                ]
            }, 
            "text-data-accentfold": {}, 
            "text-data-wordbreak": {}, 
            "text-wordbreak": {
                "requires": [
                    "array-extras", 
                    "text-data-wordbreak"
                ]
            }
        }
    }, 
    "transition": {
        "submodules": {
            "transition-native": {
                "requires": [
                    "node-base"
                ]
            }, 
            "transition-timer": {
                "requires": [
                    "transition-native", 
                    "node-style"
                ]
            }
        }
    }, 
    "uploader": {
        "requires": [
            "event-custom", 
            "node", 
            "base", 
            "swf"
        ]
    }, 
    "widget": {
        "plugins": {
            "widget-base-ie": {
                "condition": {
                    "trigger": "widget-base", 
                    "ua": "ie"
                }, 
                "requires": [
                    "widget-base"
                ]
            }, 
            "widget-child": {
                "requires": [
                    "base-build", 
                    "widget"
                ]
            }, 
            "widget-parent": {
                "requires": [
                    "base-build", 
                    "arraylist", 
                    "widget"
                ]
            }, 
            "widget-position": {
                "requires": [
                    "base-build", 
                    "node-screen", 
                    "widget"
                ]
            }, 
            "widget-position-align": {
                "requires": [
                    "widget-position"
                ]
            }, 
            "widget-position-constrain": {
                "requires": [
                    "widget-position"
                ]
            }, 
            "widget-stack": {
                "requires": [
                    "base-build", 
                    "widget"
                ], 
                "skinnable": true
            }, 
            "widget-stdmod": {
                "requires": [
                    "base-build", 
                    "widget"
                ]
            }
        }, 
        "skinnable": true, 
        "submodules": {
            "widget-base": {
                "requires": [
                    "attribute", 
                    "event-focus", 
                    "base-base", 
                    "base-pluginhost", 
                    "node-base", 
                    "node-style", 
                    "classnamemanager"
                ]
            }, 
            "widget-htmlparser": {
                "requires": [
                    "widget-base"
                ]
            }, 
            "widget-skin": {
                "requires": [
                    "widget-base"
                ]
            }, 
            "widget-uievents": {
                "requires": [
                    "widget-base", 
                    "node-event-delegate"
                ]
            }
        }
    }, 
    "widget-anim": {
        "requires": [
            "plugin", 
            "anim-base", 
            "widget"
        ]
    }, 
    "widget-locale": {
        "path": "widget/widget-locale-min.js", 
        "requires": [
            "widget-base"
        ]
    }, 
    "yql": {
        "requires": [
            "jsonp", 
            "jsonp-url"
        ]
    }, 
    "yui": {
        "submodules": {
            "features": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "get": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "intl-base": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "rls": {
                "requires": [
                    "get", 
                    "features"
                ]
            }, 
            "yui-base": {}, 
            "yui-later": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "yui-log": {
                "requires": [
                    "yui-base"
                ]
            }, 
            "yui-throttle": {
                "requires": [
                    "yui-base"
                ]
            }
        }
    }
};
YUI.Env[Y.version].md5 = 'faf08d27c01d7ab5575789a63b1e36fc';



}, '3.3.0' ,{requires:['loader-base']});
//loader-yui3:}}}

//YUI_config for K2:{{{
if (typeof YUI_config === 'undefined'){
  var YUI_config = {
    core:['get','features','intl-base','yui-later','yui-throttle','loader-base','loader-yui3'],//定义默认use的模块
    //base:'http://k.kbcdn.com/yui/3.3.0/',
    root : 'yui/3.3.0/',
    //combine : false,
    comboBase : 'http://k.kbcdn.com/min/f=',
    groups:{
      /*
      //这是一个例子，比如加入YUI2时可能需要这么写
      yui2:{
        combine : true,
        base:'http://k.kbcdn.com/yui/2.8.1/',
        root:'yui/2.8.1/',
        modules:{
          'yui2-dom-event':{
            path:'yahoo-dom-event/yahoo-dom-event.js'  
          }  
        }  
      },
      */
      k2:{
        //combine : true,
        //base:'http://k.kbcdn.com/k2/',
        root:'k2/',
        modules:{
          /*
          //k2的模块名记得加上k2-的前缀，防止和YUI的官方组件冲突，
          //k2的文件名是小写单词且用-连接
          //示例如下
          'k2-break-word':{
            path:'break-word/break-word-1-0-0.js',
            requires:['node-base','node-style']  
          },  
          */
		  'k2-button':{
		  	path:'button/button-1-0-2.css',
          	type:'css'
		  },
		  'k2-button-v2':{
			path:'button/btn-1-0-2.css',
          	type:'css'
		  },
          'k2-ww':{
            path:'ww/ww-1-0-0.js',
            requires:['node-base','node-event-delegate','stylesheet']
          },
          'k2-popup':{
            path:'popup/popup-1-0-5.js',
            requires:['dd-constrain','dd-ddm-base','dd-plugin','stylesheet','k2-button']
          },
				  'k2-shutter-base':{
					 path:'shutter/shutter-base-1-0-3.js',
					 requires:['base-base','node-base']
				  },
				  'k2-shutter-gallery':{
					 path:'shutter/shutter-gallery-1-0-10.js',
					 requires:['k2-shutter-base','json-parse','anim-base','anim-easing']
				  },
				  'k2-shutter-pucker':{
					 path:'shutter/shutter-pucker-1-0-4.js',
					 requires:['k2-shutter-base','json-parse','anim-base','anim-easing']
				  },
				  'k2-swfobject':{
					 path:'swfobject/swfobject-1-0-0.js'
				  },
				  'k2-number':{
					 path:'number/number-1-0-1.js',
					 requires:['node-base','node-style','event-base']
				  },
				  'k2-countdown':{
					 path:'countdown/countdown-1-1-2.js',
					 requires:['base-base','node-base']
				  },
				  'k2-fly':{
					 path:'fly/fly-1-0-2.js',
					 requires:['node-base','dom-base','node-screen','anim-base','anim-easing']
				  },
				  'k2-validator':{
					 path:'validator/validator-1-4-2.js',
					 requires:['base-base', 'node-base', 'k2-validator-date']
				  },
					'k2-validator-default':{
					 path:'validator/default-1-0-0.css',
           type:'css'
				  },
				  'k2-placeholder':{
					 path:'placeholder/placeholder-1-0-0.js',
					 requires:['base-base','node-base','k2-placeholder-style']
				  },
				  'k2-placeholder-style':{
					 path:'placeholder/placeholder-1-0-0.css',
           type:'css'
				  },
				  'k2-switch':{
					 path:'switch/switchable-1-1-1.js',
					 requires:['node-base','event-mouseenter','base-base']
				  },
				  'k2-switch-slide':{
					 path:'switch/widget-slide-1-1-0.js',
           requires:['k2-switch']
				  },
				  'k2-switch-effect':{
					 path:'switch/mod-effect-1-1-0.js',
           requires:['anim-easing','anim-curve','k2-switch']
				  },
				  'k2-switch-autoplay':{
					 path:'switch/mod-autoplay-1-1-0.js',
           requires:['k2-switch']
				  },
				  'k2-switch-carousel':{
					 path:'switch/widget-carousel-1-1-0.js',
           requires:['k2-switch']
				  },
				  'k2-switch-tabs':{
					 path:'switch/widget-tabs-1-1-0.js',
           requires:['k2-switch']
				  },
					'k2-cdselector-skin':{
					 path:'cdselector/assets/cdselector-1-0-0.css',
           type:'css'
				  },
					'k2-cdselector-base':{
					 path:'cdselector/cdselector-base-1-0-6.js',
           requires:['k2-cdselector-skin',"base-base","node-base","event-base","json-parse"]
				  },
					'k2-cdselector':{
					 path:'cdselector/cdselector-1-0-5.js',
           requires:["k2-cdselector-base"]
				  },
                         'k2-cdselector-step':{
					 path:'cdselector/cdselector-step-1-0-0.js',
           requires:["k2-cdselector-base"]
				  },
					'k2-regionCode':{
					 path:'cdselector/cds-data-region-1-0-0.js',
           requires:['k2-cdselector-base']
				  },
					'k2-multiSelector':{
					 path:'cdselector/mulitSelector-1-0-3.js',
           requires:["k2-cdselector"]
				  },
          'k2-xuanwuCode':{
					 path:'cdselector/cds_data_region_new-1-0-0.js',
           requires:['k2-cdselector-base']
				  },
          'k2-cdselector-option':{
					 path:'cdselector/cdselector-option-1-0-4.js',
           requires:["k2-cdselector-base"]
				  },
          'k2-categoryData':{
					 path:'cdselector/category-data-1-0-0.js',
           requires:['k2-cdselector-base']
				  },
          'k2-mapRegionSelectorNew':{
					 path:'cdselector/mapRegionSelector-1-0-2.js',
           requires:["k2-cdselector"]
				  },
          'k2-cdselector-optionByStep':{
					 path:'cdselector/cdselector-optionByStep-1-0-4.js',
           requires:["k2-cdselector-option"]
				  },
					'k2-mulitSelector-option':{
					 path:'cdselector/mulitSelector-option-1-0-3.js',
					 requires:["k2-cdselector-base"]
					},
          'k2-calendar-skin':{
           path:'calendar/assets/calendar-1-0-3.css',
           type:'css'
          },
          'k2-calendar':{
           path:'calendar/calendar-1-0-8.js',
           requires:['k2-calendar-skin','node-base','node-style','node-screen']
          },
					"k2-swf": {
						path:"swf/swf-1-0-1.js",
						requires:['node-base', 'event-base', 'swfdetect']
					},
					"k2-uploader": {
						path:"uploader/uploader-1-0-2.js",
						requires:['k2-uploader-abstract', 'k2-uploader-io']
					},
					"k2-uploader-abstract":{
						path:"uploader/uploader-abstract-1-0-1.js",
						requires:['base-base']
					},
					"k2-uploader-html5": {
						path:"uploader/uploader-html5-1-0-2.js",
						requires:['k2-uploader-abstract', 'node-base']
					},
					'k2-uploader-io': {
						path:"uploader/uploader-io-1-0-3.js",
						requires:['k2-uploader-abstract', 'node-base', 'io-upload-iframe', 'querystring-stringify']
					},
					'k2-uploader-flash': {
						path:"uploader/uploader-flash-1-0-3.js",
						requires:['k2-uploader-abstract', 'k2-swf']
					}, 
					"k2-uploader-style":{
						path:"uploader/uploader-style-1-0-2.css",
						type:'css'
					},
					"k2-uploader-view": {
						path:"uploader/uploader-view-1-0-3.js",
						requires:['k2-uploader','k2-uploader-style', 'json-parse', 'node-style']
					},
					"k2-uploader-style": {
						path:"uploader/uploader-ui-style-1-0-1.css",
						type: "css"
					},
					"k2-uploader-ui": {
						path:"uploader/uploader-ui-1-0-4.js",
						requires:['k2-uploader', 'k2-uploader-html5', 'k2-uploader-flash','json-parse', 'json-stringify', 'k2-uploader-style', 'node-style', 'substitute']
					},
					"k2-editor-style":{
						path:"editor/editor-1-0-6.css",
						type:'css'
					},
					'k2-editor-htmlparser' : {
						path : 'editor/editor-htmlparser-1-0-10.js',
						requires:['editor-base']
					},
					'k2-editor-button' : {
						path : 'editor/editor-button-1-0-3.js',
						requires:['editor-base','event-base']
					},
					'k2-editor-select' : {
						path : 'editor/editor-select-1-0-3.js',
						requires:['editor-base','overlay','event-base']
					},
					'k2-editor-wrap' : {
						path : 'editor/editor-1-0-7.js',
						requires:['editor-base','editor-para','editor-bidi','k2-editor-htmlparser','k2-editor-style']
					},
					'k2-editor-format' : {
						path : 'editor/editor-format-1-0-2.js',
						requires:['editor-base','k2-editor-button','k2-editor-select']
					},
					'k2-editor-font' : {
						path : 'editor/editor-font-1-0-1.js',
						requires:['k2-editor-format']
					},
					'k2-editor-colorsupport' : {
						path : 'editor/editor-colorsupport-1-0-1.js',
						requires:['editor-base','overlay','k2-editor-button']
					},
					'k2-editor-bgcolor' : {
						path : 'editor/editor-bgcolor-1-0-2.js',
						requires:['k2-editor-colorsupport']
					},
					'k2-editor-forecolor' : {
						path : 'editor/editor-forecolor-1-0-2.js',
						requires:['k2-editor-colorsupport']
					},
					'k2-editor-insertlist' : {
						path : 'editor/editor-list-1-0-2.js',
						requires:['k2-editor-format','editor-lists']
					},
					'k2-editor-createlink' : {
						path : 'editor/editor-createlink-1-0-3.js',
						requires:['k2-editor-button','createlink-base','k2-popup']
					},
					'k2-editor-image' : {
						path : 'editor/editor-image-1-0-13.js',
						requires:['node-base', 'node-style', 'json-parse', 'editor-base', 'k2-editor-button',
							'k2-uploader', 'k2-uploader-html5', 'k2-uploader-flash','k2-editor-uploader-style', 'k2-popup']
					},
					'k2-editor-uploader-style' : {
						path : 'editor/editor-uploader-1-0-0.css',
						type: 'css'
					},
					'k2-editor-emotion' : {
						path : 'editor/editor-emotion-1-0-0.js',
						requires:['node-base', 'node-style', 'editor-base', 'k2-editor-button', 'overlay']
					},
					'k2-editor-flash' : {
						path : 'editor/editor-flash-1-0-2.js',
						requires:['node-base', 'editor-base', 'k2-editor-button', 'k2-popup']
					},
					'k2-editor-preview' : {
						path : 'editor/editor-preview-1-0-0.js',
						requires:['node-base', 'editor-base', 'k2-editor-button']
					},
					'k2-editor-simple' : {
						path : 'editor/editor-simple-1-0-4.js',
						requires:['k2-editor-wrap','k2-editor-image','editor-bidi','k2-editor-resizer','k2-editor-font','k2-editor-source','k2-editor-align','k2-editor-indent','k2-editor-forecolor','k2-editor-bgcolor','k2-editor-createlink','k2-editor-insertlist','k2-editor-status']
					},
					'k2-editor-mini' : {
						path : 'editor/editor-mini-1-0-4.js',
						requires:['k2-editor-wrap','k2-editor-image','editor-bidi','k2-editor-resizer','k2-editor-status']
					},
					'k2-editor-resizer':{
						path : 'editor/editor-resizer-1-0-2.js',
						requires:['base-base','dd-ddm-base','dd-constrain']
					},
					'k2-editor-align':{
						path:'editor/editor-align-1-0-0.js',
						requires:['editor-base','k2-editor-button']
					},
					'k2-editor-source':{
						path:'editor/editor-source-1-0-0.js',
						requires:['editor-base','k2-editor-button']
					},
					'k2-editor-indent':{
						path:'editor/editor-indent-1-0-0.js',
						requires:['editor-base','k2-editor-button']
					},
					'k2-editor-status':{
						path:'editor/editor-status-1-0-1.js',
						requires:['editor-base']
					},
				  'k2-scrollfollow':{
						path:'scroll-follow/scroll-follow-1-0-7.js',
						requires:['node-base','node-style','dom-base','dom-screen','anim-base','event-base']
				    },
					'k2-data-lazyload' : {
						path : 'data-lazy-load/data-lazy-load-1-0-1.js',
						requires : ['event-base','node-base','node-screen']	
					},
					'k2-map': {
						path:'map/map-1-0-0.js'
					},
					'k2-graphic': {
						path:'graphic/graphic-1-0-1.js',
						requires : ['base-base', 'base-build', 'dom', 'node-base', 'event-custom']	
					},
				  'mustache':{
					  path:'mustache/mustache-1-0-0.js'  
				  },
					'k2-local-store': {
            path:'localstore/localstore-1-0-0.js',
            requires:['node-base','base-base','base-build','k2-swf','swfdetect','json-parse','json-stringify']
					}
        }  
      }  
    }
  };  
}
//YUI_config for K2:}}}


