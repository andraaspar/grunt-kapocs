'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
			typescript: {
				compile: {
					files: {'tasks/kapocs.js': ['src/kapocs/Main.ts']}
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

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-sas');
	grunt.loadNpmTasks('grunt-typescript');
	
	grunt.registerTask('update', ['shell:update','sas:update']);
	grunt.registerTask('compile', ['typescript:compile']);

	grunt.registerTask('default', ['compile']);

};
