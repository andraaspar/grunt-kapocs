/*
 * IMPORTANT NOTICE:
 * This test must be run with --force to complete, as it produces intentional warnings.
 */

'use strict';

module.exports = function(grunt) {
	
	grunt.initConfig({
		clean: {
			tests: ['tmp', 'build']
		},
		kapocs: {
			default_options: {
				assets: [{
					expand: true,
					cwd: 'src1/kapocs_asset',
					dot: true,
					src: ['**'],
					dest: 'build/test1'
				}],
				assetTemplates: [{
					expand: true,
					cwd: 'src1/kapocs_asset_template',
					dot: true,
					src: ['**'],
					dest: 'build/test1'
				}],
				templates: [{
					expand: true,
					cwd: 'src1/kapocs_template',
					dot: true,
					src: ['**'],
					dest: 'build/test1'
				}]
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
