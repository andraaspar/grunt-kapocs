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
			}
		});

	grunt.loadTasks('../tasks');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	
	grunt.registerTask('test', ['clean', 'kapocs', 'nodeunit']);

	grunt.registerTask('default', ['test']);

};
