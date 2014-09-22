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

    if (Function.prototype.bind) {
        illa.bind = function (fn, obj) {
            return fn.call.apply(fn.bind, arguments);
        };
    }
})(illa || (illa = {}));
module.exports = function (grunt) {
    grunt.registerMultiTask('kapocs', 'Appends a hash to asset file names, and injects file names into templates.', function () {
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-copy');

        var options = this.options({
            buildName: 'build/',
            srcName: 'src/',
            tmpName: 'tmp/',
            cleanBuild: true,
            cleanTmp: true
        });

        var templateMap = {};

        function appendHash(dest, srcName, options) {
            var path = require('path');

            var fullSrcName = grunt.template.process(options.cwd + srcName);

            if (grunt.file.isFile(fullSrcName)) {
                var fs = require('fs');
                var crypto = require('crypto');

                var md5 = crypto.createHash('md5');
                md5.update(fs.readFileSync(fullSrcName));
                var md5Hash = md5.digest('hex');

                var dstName = srcName.replace(/(\.[^.]*)$/, '.' + md5Hash + '$1');

                templateMap['{{' + path.basename(srcName) + '}}'] = path.basename(dstName);

                srcName = dstName;
            }

            return path.join(dest, srcName);
        }

        var cleanFiles = [];
        if (options.cleanBuild) {
            cleanFiles.push(options.buildName);
        }
        if (options.cleanTmp) {
            cleanFiles.push(options.tmpName);
        }

        var copyConfig = {
            kapocs_asset: {
                files: [
                    { expand: true, dot: true, cwd: options.tmpName + 'kapocs_asset_template/', src: ['**/*'], dest: options.tmpName + 'kapocs_template/', rename: appendHash },
                    { expand: true, dot: true, cwd: options.tmpName + 'kapocs_asset/', src: ['**/*'], dest: options.buildName, rename: appendHash },
                    { expand: true, dot: true, cwd: options.srcName + 'kapocs_asset_template/', src: ['**/*'], dest: options.tmpName + 'kapocs_template/', rename: appendHash },
                    { expand: true, dot: true, cwd: options.srcName + 'kapocs_asset/', src: ['**/*'], dest: options.buildName, rename: appendHash }
                ]
            },
            kapocs_template: {
                options: {
                    process: function (content, srcpath) {
                        for (var i in templateMap) {
                            if (templateMap.hasOwnProperty(i)) {
                                content = content.replace(new RegExp(i, 'g'), templateMap[i]);
                            }
                        }
                        return content;
                    }
                },
                files: [
                    { expand: true, dot: true, cwd: options.tmpName + 'kapocs_template/', src: ['**/*'], dest: options.buildName },
                    { expand: true, dot: true, cwd: options.srcName + 'kapocs_template/', src: ['**/*'], dest: options.buildName }
                ]
            },
            kapocs_dropin: {
                files: [
                    { expand: true, dot: true, cwd: options.tmpName + 'kapocs_dropin/', src: ['**/*'], dest: options.buildName },
                    { expand: true, dot: true, cwd: options.srcName + 'kapocs_dropin/', src: ['**/*'], dest: options.buildName }
                ]
            }
        };

        grunt.config.merge({
            clean: {
                kapocs: cleanFiles
            }
        });
        grunt.config.merge({
            copy: copyConfig
        });

        grunt.task.run(['clean:kapocs', 'copy:kapocs_dropin', 'copy:kapocs_asset', 'copy:kapocs_template']);
    });
};
