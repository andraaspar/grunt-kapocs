'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
			clean: {
				compile: [
					'tasks'
				],
				update: [
					'lib'
				]
			},
			copy: {
				update: {
					files:[
						{
							dot: true,
							expand: true,
							cwd: 'bower_components/illa/src',
							src: ['**'],
							dest: 'lib'
						},
						{
							dot: true,
							expand: true,
							cwd: 'bower_components/grunt-d-ts/src',
							src: ['**'],
							dest: 'lib'
						},
						{
							dot: true,
							expand: true,
							cwd: 'bower_components/node-d-ts/src',
							src: ['**'],
							dest: 'lib'
						},
						{
							dot: true,
							expand: true,
							cwd: 'node_modules/typescript/lib',
							src: ['lib.core.d.ts'],
							dest: 'lib'
						}
					]
				}
			},
			shell: {
				compileTs: {
					command: '"node_modules/.bin/tsc" "src/kapocs/Main.ts" --noLib --outFile "tasks/kapocs.js"'
				},
				update: {
					command: [
						'bower prune',
						'bower install',
						'bower update'
					].join('&&')
				}
			}
		});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-shell');
	
	grunt.registerTask('update', [
		'shell:update',
		'clean:update',
		'copy:update'
	]);
	grunt.registerTask('compile', [
		'clean:compile',
		'shell:compileTs'
	]);
	grunt.registerTask('default', [
		'compile'
	]);
};
