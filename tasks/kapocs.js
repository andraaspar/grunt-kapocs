var illa;
(function (illa) {
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

    function isString(v) {
        return typeof v == 'string';
    }
    illa.isString = isString;

    function isBoolean(v) {
        return typeof v == 'boolean';
    }
    illa.isBoolean = isBoolean;

    function isNumber(v) {
        return typeof v == 'number';
    }
    illa.isNumber = isNumber;

    function isFunction(v) {
        return typeof v == 'function';
    }
    illa.isFunction = isFunction;

    function isArray(v) {
        return illa.getType(v) == 'array';
    }
    illa.isArray = isArray;

    if (Array.isArray)
        illa.isArray = Array.isArray;

    function isUndefined(v) {
        return typeof v == 'undefined';
    }
    illa.isUndefined = isUndefined;

    function isNull(v) {
        return v === null;
    }
    illa.isNull = isNull;

    function isUndefinedOrNull(v) {
        return typeof v == 'undefined' || v === null;
    }
    illa.isUndefinedOrNull = isUndefinedOrNull;

    function isObjectNotNull(v) {
        var t = typeof v;
        return t == 'object' && v !== null || t == 'function';
    }
    illa.isObjectNotNull = isObjectNotNull;

    function getType(v) {
        var result = '';
        if (v == null) {
            result = v + '';
        } else {
            result = typeof v;
            if (result == 'object' || result == 'function') {
                result = illa.classByType[illa.classByType.toString.call(v)] || 'object';
            }
        }
        return result;
    }
    illa.getType = getType;

    function as(c, v) {
        return v instanceof c ? v : null;
    }
    illa.as = as;

    function bind(fn, obj) {
        if (!fn)
            throw 'No function.';
        return function () {
            return fn.apply(obj, arguments);
        };
    }
    illa.bind = bind;

    function partial(fn, obj) {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            args[_i] = arguments[_i + 2];
        }
        if (!fn)
            throw 'No function.';
        return function () {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        };
    }
    illa.partial = partial;

    if (Function.prototype.bind) {
        illa.bind = illa.partial = function (fn, obj) {
            return fn.call.apply(fn.bind, arguments);
        };
    }
})(illa || (illa = {}));
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
        StringUtil.CHAR_TO_HTML = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return StringUtil;
    })();
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
    })();
    kapocs.TaskOptions = TaskOptions;
})(kapocs || (kapocs = {}));
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
            } else {
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
                } else if (this.grunt.file.isFile(asset.src[0])) {
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
                } else {
                    this.grunt.log.writeln('Invalid src, ignoring: ' + asset.src[0]);
                }
            }
        };

        Task.prototype.setTemplateMapping = function (key, value) {
            if (this.templateMap.hasOwnProperty(key)) {
                this.grunt.log.writeln('Mapping already defined for ' + key + ' -> ' + this.templateMap[key]);
                this.grunt.log.writeln('is being overwritten by ' + key + ' -> ' + value);
                this.templateMap[key] = '';
            } else {
                this.templateMap[key] = value;
            }
        };

        Task.prototype.getTemplateMapping = function (key) {
            if (this.templateMap.hasOwnProperty(key)) {
                return this.templateMap[key];
            } else {
                return '';
            }
        };

        Task.prototype.processTemplates = function (templates) {
            for (var i = 0, n = templates.length; i < n; i++) {
                var template = templates[i];
                this.grunt.log.verbose.writeflags(template, 'Template ' + i);
                if (this.grunt.file.isDir(template.src[0])) {
                    this.grunt.file.mkdir(template.dest);
                } else if (this.grunt.file.isFile(template.src[0])) {
                    this.grunt.file.copy(template.src[0], template.dest, {
                        encoding: template.orig.encoding,
                        process: illa.partial(this.expandPlaceholders, this, template)
                    });
                } else {
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
            contents = contents.replace(new RegExp(regExpString, 'g'), illa.partial(this.expandPlaceholdersInternal, this, template));
            return contents;
        };

        Task.prototype.expandPlaceholdersInternal = function (template, matchedString, matchedPath) {
            var newName = this.getTemplateMapping(matchedPath);
            if (newName) {
                return path.basename(newName);
            } else {
                this.grunt.fail.warn('Unknown or ambiguous file reference: ' + matchedPath + ' in: ' + template.src[0]);
                return matchedString;
            }
        };
        return Task;
    })();
    kapocs.Task = Task;
})(kapocs || (kapocs = {}));
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

        Main.getInstance = function () {
            return this.instance;
        };
        Main.TASK_NAME = 'kapocs';
        Main.TASK_DESCRIPTION = 'Appends a hash to asset file names, and injects file names into templates.';

        Main.instance = new Main();
        return Main;
    })();
    kapocs.Main = Main;
})(kapocs || (kapocs = {}));

module.exports = function (grunt) {
    kapocs.Main.getInstance().init(grunt);
};
