var illa;
(function (illa) {
    /**
     * A reference to the global object.
     * This is the window in a browser, and the global in node.
     */
    illa.GLOBAL = (function () {
        return this;
    })();
    illa.classByType = (function () {
        var classes = 'Boolean Number String Function Array Date RegExp Object Error'.split(' ');
        var result = {};
        for (var i = 0, n = classes.length; i < n; i++) {
            result['[object ' + classes[i] + ']'] = classes[i].toLowerCase();
        }
        return result;
    })();
    /**
     * Returns true if the value is a string primitive.
     */
    function isString(v) {
        return typeof v == 'string';
    }
    illa.isString = isString;
    /**
     * Returns true if the value is a boolean primitive.
     */
    function isBoolean(v) {
        return typeof v == 'boolean';
    }
    illa.isBoolean = isBoolean;
    /**
     * Returns true if the value is a number primitive.
     */
    function isNumber(v) {
        return typeof v == 'number';
    }
    illa.isNumber = isNumber;
    /**
     * Returns true if the value is a function.
     */
    function isFunction(v) {
        return typeof v == 'function';
    }
    illa.isFunction = isFunction;
    /**
     * Returns true if the value is an array.
     * Array subclasses are not recognized as arrays.
     */
    function isArray(v) {
        return illa.getType(v) == 'array';
    }
    illa.isArray = isArray;
    if (Array.isArray)
        illa.isArray = Array.isArray;
    /**
     * Returns true if the value is undefined.
     */
    function isUndefined(v) {
        return typeof v == 'undefined';
    }
    illa.isUndefined = isUndefined;
    /**
     * Returns true if the value is null.
     */
    function isNull(v) {
        return v === null;
    }
    illa.isNull = isNull;
    /**
     * Returns true if the value is undefined or null.
     */
    function isUndefinedOrNull(v) {
        return typeof v == 'undefined' || v === null;
    }
    illa.isUndefinedOrNull = isUndefinedOrNull;
    /**
     * Returns true if the value is an object and not null. Includes functions.
     */
    function isObjectNotNull(v) {
        var t = typeof v;
        return t == 'object' && v !== null || t == 'function';
    }
    illa.isObjectNotNull = isObjectNotNull;
    /**
     * Returns the type of value.
     */
    function getType(v) {
        var result = '';
        if (v == null) {
            result = v + '';
        }
        else {
            result = typeof v;
            if (result == 'object' || result == 'function') {
                result = illa.classByType[illa.classByType.toString.call(v)] || 'object';
            }
        }
        return result;
    }
    illa.getType = getType;
    /**
     * Returns the value if ‘instanceof’ is true for the given constructor.
     */
    function as(c, v) {
        return v instanceof c ? v : null;
    }
    illa.as = as;
    function bind(fn, obj) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!fn)
            throw 'No function.';
        return function () {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    }
    illa.bind = bind;
    /**
     * Binds a function to a ‘this’ context, and also prepends the specified arguments.
     * This is not type safe.
     */
    function bindUnsafe(fn, obj) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return illa.bind.call(this, arguments);
    }
    illa.bindUnsafe = bindUnsafe;
    if (Function.prototype.bind) {
        illa.bind = illa.bindUnsafe = function (fn) {
            return fn.call.apply(fn.bind, arguments);
        };
    }
    /**
     * Generates a UUID.
     * Based on: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     */
    function uuid() {
        var base = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
        var result = base.replace(/[xy]/g, function (char) {
            var random = cryptoRandom16();
            var result = char == 'x' ? random : (random & 0x3 | 0x8);
            return result.toString(16);
        });
        return result;
    }
    illa.uuid = uuid;
    function cryptoRandom16() {
        var result;
        if (illa.GLOBAL.crypto) {
            if (illa.GLOBAL.crypto.getRandomValues) {
                result = illa.GLOBAL.crypto.getRandomValues(new Uint8Array(1))[0] % 16;
            }
            else if (illa.GLOBAL.crypto.randomBytes) {
                result = illa.GLOBAL.crypto.randomBytes(1)[0] % 16;
            }
        }
        if (isNaN(result)) {
            result = Math.random() * 16;
        }
        return Math.floor(result);
    }
    /**
     * Adds dynamic properties to an object.
     */
    function addProps(obj) {
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        for (var i = 0, n = rest.length; i < n; i += 2) {
            if (illa.isString(rest[i])) {
                obj[rest[i]] = rest[i + 1];
            }
        }
        return obj;
    }
    illa.addProps = addProps;
})(illa || (illa = {}));
/// <reference path='IConfigInitMethod.ts'/>
/// <reference path='IConfigRequiresMethod.ts'/>
/// <reference path='IEventEmitter2.ts'/>
/// <reference path='IFailWarnMethod.ts'/>
/// <reference path='IFileCopyOptionsProcessFunction.ts'/>
/// <reference path='IFileExpandMappingOptionsRenameCallback.ts'/>
/// <reference path='IMinimatchOptions.ts'/>
/// <reference path='IFileExpandMappingOptions.ts'/>
/// <reference path='IFileCopyOptions.ts'/>
/// <reference path='IFileDeleteOptions.ts'/>
/// <reference path='IFileExpandMappingOptions.ts'/>
/// <reference path='IFileExpandOptions.ts'/>
/// <reference path='IFileReadOptions.ts'/>
/// <reference path='IFileRecurseCallback.ts'/>
/// <reference path='ISrcDestFileMapping.ts'/>
/// <reference path='ILogMethods.ts'/>
/// <reference path='ILogMethods.ts'/>
/// <reference path='ILogVerbose.ts'/>
/// <reference path='ILogWordlistOptions.ts'/>
/// <reference path='ITaskCurrentAsyncDoneCallback.ts'/>
/// <reference path='ITaskCurrent.ts'/>
/// <reference path='ITaskCurrentMulti.ts'/>
/// <reference path='ITaskLoadNPMTasksMethod.ts'/>
/// <reference path='ITaskLoadTasksMethod.ts'/>
/// <reference path='ITaskRegisterMultiTaskMethod.ts'/>
/// <reference path='ITaskRegisterTaskMethod.ts'/>
/// <reference path='ITaskRenameTaskMethod.ts'/>
/// <reference path='IUtilSpawnDoneCallbackResult.ts'/>
/// <reference path='IUtilRecurseCallback.ts'/>
/// <reference path='IUtilRecurseContinueCallback.ts'/>
/// <reference path='IUtilSpawnDoneCallback.ts'/>
/// <reference path='IUtilSpawnOptions.ts'/>
/// <reference path='IConfig.ts'/>
/// <reference path='IEvent.ts'/>
/// <reference path='IFail.ts'/>
/// <reference path='IFile.ts'/>
/// <reference path='ILog.ts'/>
/// <reference path='IOption.ts'/>
/// <reference path='ITask.ts'/>
/// <reference path='ITemplate.ts'/>
/// <reference path='IUtil.ts'/>
var illa;
(function (illa) {
    var StringUtil = (function () {
        function StringUtil() {
        }
        StringUtil.escapeHTML = function (str) {
            return str.replace(/[&<>"']/g, function (s) {
                return StringUtil.CHAR_TO_HTML[s];
            });
        };
        StringUtil.castNicely = function (str) {
            return str == null ? '' : String(str);
        };
        StringUtil.trim = function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        };
        StringUtil.escapeRegExp = function (str) {
            return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        };
        StringUtil.hash = function (src) {
            var result = 0;
            if (src.length == 0)
                return result;
            for (var i = 0, n = src.length; i < n; i++) {
                result = ((result << 5) - result) + src.charCodeAt(i);
                result |= 0; // Convert to 32bit integer
            }
            return result;
        };
        StringUtil.parseQuery = function (query, multipleKeysAsArray) {
            var result = {};
            var match;
            while (match = this.QUERY_RE.exec(query)) {
                var key = this.decode(match[1]);
                var value = this.decode(match[2]);
                if (multipleKeysAsArray && key in result) {
                    if (illa.isString(result[key])) {
                        result[key] = [result[key], value];
                    }
                    else {
                        result[key].push(value);
                    }
                }
                else {
                    result[key] = value;
                }
            }
            return result;
        };
        StringUtil.decode = function (s) {
            return decodeURIComponent(s.replace(this.PLUS_RE, ' '));
        };
        StringUtil.CHAR_TO_HTML = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;' // IE8 does not support &apos;
        };
        StringUtil.QUERY_RE = /([^&=]+)=?([^&]*)/g;
        StringUtil.PLUS_RE = /\+/g;
        return StringUtil;
    }());
    illa.StringUtil = StringUtil;
})(illa || (illa = {}));
var kapocs;
(function (kapocs) {
    var TaskOptions = (function () {
        function TaskOptions() {
            this.referencePrefix = '{{';
            this.referenceSuffix = '}}';
            this.temporaryFolder = 'tmp';
        }
        return TaskOptions;
    }());
    kapocs.TaskOptions = TaskOptions;
})(kapocs || (kapocs = {}));
/// <reference path='../../lib/illa/StringUtil.ts'/>
/// <reference path='TaskOptions.ts'/>
var kapocs;
(function (kapocs) {
    var Task = (function () {
        function Task(grunt) {
            this.grunt = grunt;
            this.templateMap = {};
            this.currentTask = this.grunt.task.current;
            this.options = this.currentTask.options(new kapocs.TaskOptions());
            this.data = this.currentTask.data;
        }
        Task.prototype.expandMappings = function (fileDefs, name) {
            var result = [];
            if (illa.isArray(fileDefs)) {
                for (var i = 0, n = fileDefs.length; i < n; i++) {
                    var fileDef = fileDefs[i];
                    if (!illa.isObjectNotNull(fileDef)) {
                        this.grunt.log.error('Invalid file definition: ' + name + ' ' + i);
                        continue;
                    }
                    var src = fileDef.src;
                    if (!illa.isArray(src)) {
                        this.grunt.log.error('File src must be a string[]: ' + name + ' ' + i);
                        continue;
                    }
                    var dest = fileDef.dest;
                    if (!illa.isString(dest)) {
                        this.grunt.log.error('File dest must be a string: ' + name + ' ' + i);
                        continue;
                    }
                    var expanded = this.grunt.file.expandMapping(src, dest, fileDef);
                    this.applyOrig(expanded, fileDef);
                    result = result.concat(expanded);
                }
            }
            else {
                this.grunt.log.error(name + ' file definitions should be an array.');
            }
            return result;
        };
        Task.prototype.applyOrig = function (expanded, orig) {
            for (var i = 0, n = expanded.length; i < n; i++) {
                expanded[i].orig = orig;
            }
        };
        Task.prototype.processAssets = function (assets, isTemplate) {
            for (var i = 0, n = assets.length; i < n; i++) {
                var asset = assets[i];
                this.grunt.log.verbose.writeflags(asset, 'Asset ' + i);
                if (this.grunt.file.isDir(asset.src[0])) {
                    this.grunt.file.mkdir(asset.dest);
                }
                else if (this.grunt.file.isFile(asset.src[0])) {
                    var newDest = this.getDestWithHash(asset.src[0], asset.dest);
                    if (isTemplate) {
                        asset.dest = newDest;
                        newDest = path.join(this.options.temporaryFolder, newDest);
                    }
                    this.grunt.file.copy(asset.src[0], newDest, asset.orig);
                    this.setTemplateMapping(asset.src[0], newDest);
                    this.setTemplateMapping(path.basename(asset.src[0]), newDest);
                    if (isTemplate) {
                        asset.src[0] = newDest;
                    }
                }
                else {
                    this.grunt.log.writeln('Invalid src, ignoring: ' + asset.src[0]);
                }
            }
        };
        Task.prototype.setTemplateMapping = function (key, value) {
            if (this.templateMap.hasOwnProperty(key)) {
                this.grunt.log.writeln('Mapping already defined for ' + key + ' -> ' + this.templateMap[key]);
                this.grunt.log.writeln('is being overwritten by ' + key + ' -> ' + value);
                this.templateMap[key] = '';
            }
            else {
                this.templateMap[key] = value;
            }
        };
        Task.prototype.getTemplateMapping = function (key) {
            if (this.templateMap.hasOwnProperty(key)) {
                return this.templateMap[key];
            }
            else {
                return '';
            }
        };
        Task.prototype.processTemplates = function (templates) {
            for (var i = 0, n = templates.length; i < n; i++) {
                var template = templates[i];
                this.grunt.log.verbose.writeflags(template, 'Template ' + i);
                if (this.grunt.file.isDir(template.src[0])) {
                    this.grunt.file.mkdir(template.dest);
                }
                else if (this.grunt.file.isFile(template.src[0])) {
                    this.grunt.file.copy(template.src[0], template.dest, {
                        encoding: template.orig.encoding,
                        process: illa.bind(this.expandPlaceholders, this, template)
                    });
                }
                else {
                    this.grunt.log.writeln('Invalid src, ignoring: ' + template.src[0]);
                }
            }
        };
        Task.prototype.execute = function () {
            var assets = this.expandMappings(this.data.assets || [], 'Asset');
            var assetTemplates = this.expandMappings(this.data.assetTemplates || [], 'AssetTemplate');
            var templates = this.expandMappings(this.data.templates || [], 'Template');
            this.processAssets(assets);
            this.processAssets(assetTemplates, true);
            this.processTemplates(assetTemplates);
            this.processTemplates(templates);
        };
        Task.prototype.getDestWithHash = function (fullSrcPath, fullDestPath) {
            var destName = path.basename(fullDestPath);
            if (this.grunt.file.isFile(fullSrcPath)) {
                var md5 = crypto.createHash('md5');
                md5.update(fs.readFileSync(fullSrcPath));
                var md5Hash = md5.digest('hex');
                destName = destName.replace(/(\.[^.]*)$/, '.' + md5Hash + '$1');
            }
            return path.join(path.dirname(fullDestPath), destName);
        };
        Task.prototype.expandPlaceholders = function (template, contents, srcPath, destPath) {
            var otherProcess = template.orig.process;
            if (otherProcess && !this.grunt.file.isMatch(template.orig.noProcess || [], srcPath)) {
                var otherProcessResult = otherProcess(contents, srcPath, destPath);
                if (otherProcessResult === false) {
                    return false;
                }
                contents = otherProcessResult;
            }
            var regExpString = illa.StringUtil.escapeRegExp(this.options.referencePrefix) + '(.*?)' + illa.StringUtil.escapeRegExp(this.options.referenceSuffix);
            contents = contents.replace(new RegExp(regExpString, 'g'), illa.bind(this.expandPlaceholdersInternal, this, template));
            return contents;
        };
        Task.prototype.expandPlaceholdersInternal = function (template, matchedString, matchedPath) {
            var newName = this.getTemplateMapping(matchedPath);
            if (newName) {
                return path.basename(newName);
            }
            else {
                this.grunt.fail.warn('Unknown or ambiguous file reference: ' + matchedPath + ' in: ' + template.src[0]);
                return matchedString;
            }
        };
        return Task;
    }());
    kapocs.Task = Task;
})(kapocs || (kapocs = {}));
/// <reference path='../../lib/lib.core.d.ts'/>
/// <reference path='../../lib/illa/_module.ts'/>
/// <reference path='../../lib/grunt/IGrunt.ts'/>
/// <reference path='../../lib/node.d.ts'/>
/// <reference path='Task.ts'/>
illa.GLOBAL.path = require('path');
illa.GLOBAL.fs = require('fs');
illa.GLOBAL.crypto = require('crypto');
var kapocs;
(function (kapocs) {
    var Main = (function () {
        function Main() {
            this.tasks = [];
        }
        Main.prototype.init = function (grunt) {
            this.grunt = grunt;
            this.grunt.registerMultiTask(Main.TASK_NAME, Main.TASK_DESCRIPTION, illa.bind(this.doTask, this));
        };
        Main.prototype.doTask = function () {
            var task = new kapocs.Task(this.grunt);
            this.tasks.push(task);
            task.execute();
        };
        Main.getInstance = function () { return this.instance; };
        Main.TASK_NAME = 'kapocs';
        Main.TASK_DESCRIPTION = 'Appends a hash to asset file names, and injects file names into templates.';
        Main.instance = new Main();
        return Main;
    }());
    kapocs.Main = Main;
})(kapocs || (kapocs = {}));
module.exports = function (grunt) {
    kapocs.Main.getInstance().init(grunt);
};
