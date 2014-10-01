/// <reference path='../../lib/illa/_module.ts'/>

/// <reference path='../../lib/grunt/IGrunt.ts'/>

/// <reference path='../../lib/node.d.ts'/>

/// <reference path='Task.ts'/>

illa.GLOBAL.path = require('path');
illa.GLOBAL.fs = require('fs');
illa.GLOBAL.crypto = require('crypto');

module kapocs {
	export class Main {
		
		static TASK_NAME = 'kapocs';
		static TASK_DESCRIPTION = 'Appends a hash to asset file names, and injects file names into templates.';
		
		private static instance = new Main();
		
		private grunt: grunt.IGrunt;
		private tasks: Task[] = [];
		
		constructor() {
			
		}
		
		init(grunt: grunt.IGrunt): void {
			this.grunt = grunt;
			
			this.grunt.loadNpmTasks('grunt-contrib-clean');
			this.grunt.loadNpmTasks('grunt-contrib-copy');
			
			this.grunt.registerMultiTask(Main.TASK_NAME, Main.TASK_DESCRIPTION, illa.bind(this.doTask, this));
		}
		
		doTask(): void {
			var task = new Task(this.grunt);
			this.tasks.push(task);
			task.execute();
		}
		
		static getInstance() {return this.instance}
	}
}

module.exports = function(grunt: grunt.IGrunt) {
	kapocs.Main.getInstance().init(grunt);
};
