/// <reference path='../../lib/illa/_module.ts'/>

/// <reference path='../../lib/grunt/IGrunt.ts'/>

/// <reference path='../node.d.ts'/>

module.exports = function(grunt: grunt.IGrunt) {

	grunt.registerMultiTask('kapocs', 'Appends a hash to asset file names, and injects file names into templates.', function() {
		
		grunt.loadNpmTasks('grunt-contrib-clean');
		grunt.loadNpmTasks('grunt-contrib-copy');
		
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			buildName: 'build/',
			srcName: 'src/',
			tmpName: 'tmp/',
			cleanBuild: true,
			cleanTmp: true
		});
		
		var templateMap = {};
		
		function appendHash(dest: string, srcName: string, options: grunt.IFileExpandOptions) {
			
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
					{expand: true, dot: true, cwd: options.tmpName + 'kapocs_asset_template/', src: ['**/*'], dest: options.tmpName + 'kapocs_template/', rename: appendHash},
					{expand: true, dot: true, cwd: options.tmpName + 'kapocs_asset/', src: ['**/*'], dest: options.buildName, rename: appendHash},
					{expand: true, dot: true, cwd: options.srcName + 'kapocs_asset_template/', src: ['**/*'], dest: options.tmpName + 'kapocs_template/', rename: appendHash},
					{expand: true, dot: true, cwd: options.srcName + 'kapocs_asset/', src: ['**/*'], dest: options.buildName, rename: appendHash}
				]
			},
			kapocs_template: {
				options: {
					process: function(content, srcpath) {
						for (var i in templateMap) {
							if (templateMap.hasOwnProperty(i)) {
								content = content.replace(new RegExp(i, 'g'), templateMap[i]);
							}
						}
						return content;
					}
				},
				files: [
					{expand: true, dot: true, cwd: options.tmpName + 'kapocs_template/', src: ['**/*'], dest: options.buildName},
					{expand: true, dot: true, cwd: options.srcName + 'kapocs_template/', src: ['**/*'], dest: options.buildName}
				]
			},
			kapocs_dropin: {
				files: [
					{expand: true, dot: true, cwd: options.tmpName + 'kapocs_dropin/', src: ['**/*'], dest: options.buildName},
					{expand: true, dot: true, cwd: options.srcName + 'kapocs_dropin/', src: ['**/*'], dest: options.buildName}
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
