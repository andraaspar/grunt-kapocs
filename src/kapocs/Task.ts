/// <reference path='../../lib/illa/StringUtil.ts'/>

/// <reference path='TaskOptions.ts'/>

module kapocs {
	export class Task {

		private templateMap: { [s: string]: string } = {};
		private currentTask: grunt.ITaskCurrentMulti;
		private options: TaskOptions;
		private data: any;

		constructor(private grunt: grunt.IGrunt) {
			this.currentTask = this.grunt.task.current;
			this.options = this.currentTask.options(new TaskOptions());
			this.data = this.currentTask.data;
		}

		expandMappings(fileDefs: any[], name: string): grunt.ISrcDestFileMapping[] {
			var result: grunt.ISrcDestFileMapping[] = [];
			if (illa.isArray(fileDefs)) {
				for (var i = 0, n = fileDefs.length; i < n; i++) {
					var fileDef = fileDefs[i];
					if (!illa.isObjectNotNull(fileDef)) {
						this.grunt.log.error('Invalid file definition: ' + name + ' ' + i);
						continue;
					}
					var src: string[] = fileDef.src;
					if (!illa.isArray(src)) {
						this.grunt.log.error('File src must be a string[]: ' + name + ' ' + i);
						continue;
					}
					var dest: string = fileDef.dest;
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
		}

		applyOrig(expanded: grunt.ISrcDestFileMapping[], orig: any): void {
			for (var i = 0, n = expanded.length; i < n; i++) {
				expanded[i].orig = orig;
			}
		}

		processAssets(assets: grunt.ISrcDestFileMapping[], isTemplate?: boolean): void {
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
		}

		setTemplateMapping(key: string, value: string): void {
			if (this.templateMap.hasOwnProperty(key)) {
				this.grunt.log.writeln('Mapping already defined for ' + key + ' -> ' + this.templateMap[key]);
				this.grunt.log.writeln('is being overwritten by ' + key + ' -> ' + value);
				this.templateMap[key] = '';
			} else {
				this.templateMap[key] = value;
			}
		}

		getTemplateMapping(key: string): string {
			if (this.templateMap.hasOwnProperty(key)) {
				return this.templateMap[key];
			} else {
				return '';
			}
		}

		processTemplates(templates: grunt.ISrcDestFileMapping[]): void {
			for (var i = 0, n = templates.length; i < n; i++) {
				var template = templates[i];
				this.grunt.log.verbose.writeflags(template, 'Template ' + i);
				if (this.grunt.file.isDir(template.src[0])) {
					this.grunt.file.mkdir(template.dest);
				} else if (this.grunt.file.isFile(template.src[0])) {
					this.grunt.file.copy(template.src[0], template.dest, {
						encoding: template.orig.encoding,
						process: <grunt.IFileCopyOptionsProcessFunction>illa.partial(this.expandPlaceholders, this, template)
					});
				} else {
					this.grunt.log.writeln('Invalid src, ignoring: ' + template.src[0]);
				}
			}
		}

		execute() {
			var assets = this.expandMappings(this.data.assets || [], 'Asset');
			var assetTemplates = this.expandMappings(this.data.assetTemplates || [], 'AssetTemplate');
			var templates = this.expandMappings(this.data.templates || [], 'Template');

			this.processAssets(assets);
			this.processAssets(assetTemplates, true);

			this.processTemplates(assetTemplates);
			this.processTemplates(templates);
		}

		getDestWithHash(fullSrcPath: string, fullDestPath: string): string {

			var destName = path.basename(fullDestPath);

			if (this.grunt.file.isFile(fullSrcPath)) {

				var md5 = crypto.createHash('md5');
				md5.update(fs.readFileSync(fullSrcPath));
				var md5Hash = md5.digest('hex');

				destName = destName.replace(/(\.[^.]*)$/, '.' + md5Hash + '$1');
			}

			return path.join(path.dirname(fullDestPath), destName);
		}

		expandPlaceholders(template: grunt.ISrcDestFileMapping, contents: string, srcPath: string, destPath: string): any {
			var otherProcess: grunt.IFileCopyOptionsProcessFunction = template.orig.process;
			if (otherProcess && !this.grunt.file.isMatch(template.orig.noProcess || [], srcPath)) {
				var otherProcessResult = otherProcess(contents, srcPath, destPath);
				if (otherProcessResult === false) {
					return false;
				}
				contents = otherProcessResult;
			}
			var regExpString = illa.StringUtil.escapeRegExp(this.options.referencePrefix) + '(.*?)' + illa.StringUtil.escapeRegExp(this.options.referenceSuffix);
			contents = contents.replace(new RegExp(regExpString, 'g'), <any>illa.partial(this.expandPlaceholdersInternal, this, template));
			return contents;
		}

		expandPlaceholdersInternal(template: grunt.ISrcDestFileMapping, matchedString: string, matchedPath: string): string {
			var newName = this.getTemplateMapping(matchedPath);
			if (newName) {
				return path.basename(newName);
			} else {
				this.grunt.fail.warn('Unknown or ambiguous file reference: ' + matchedPath + ' in: ' + template.src[0]);
				return matchedString;
			}
		}
	}
}