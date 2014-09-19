/*
 * grunt-kapocs
 * https://github.com/andraaspar/grunt-kapocs
 *
 * Copyright (c) 2014 András Parditka
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
			clean: {
				tests: ['tmp']
			},
			kapocs: {
				default_options: {},
				custom_options: {
					options: {
						buildName: 'build2/',
						srcName: 'src2/',
						tmpName: 'tmp2/'
					}
				}
			},
			nodeunit: {
				tests: ['test/*_test.js']
			},
			typescript: {
				tests: {
					files: {'tmp/kapocs.js': ['src/kapocs/Main.ts']}
				}
			},
			sas: {
				update: {}
			},
			shell: {
				update: {
					command: [
						'bower update',
						'bower prune',
						'bower install'
					].join('&&')
				}
			}
		});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sas');
	grunt.loadNpmTasks('grunt-typescript');
	
	grunt.registerTask('update', ['shell:update','sas:update']);
	grunt.registerTask('compile', ['clean:tests','typescript:tests']);

	grunt.registerTask('test', ['clean', 'kapocs', 'nodeunit']);

	grunt.registerTask('default', ['test']);

};
