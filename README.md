# grunt-kapocs

**Cache busting grunt plugin. Works with any file type.**

Appends an MD5 hash to asset file names, and injects file names into templates.

Appending a hash to file names based on their contents ensures that each time a file's content changes, browsers will download the updated file from the server,
rather than using the old, cached version. This is called cache busting.

A more detailed [explanation of HTTP caching & cache busting](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching).

## Example project

### Folder layout

Let's take the following folder layout:

```
project_folder
|- build
|  |- <This is where we want the final output>
|- src
|  |- assets
|  |  |- <Files that should be renamed, like images or videos>
|  |- asset_templates
|  |  |- <Files that should be renamed, but also refer to other assets, like CSS or JS>
|  |- templates
|     |- <Files that refer to assets, but should NOT be renamed, like HTML>
|- Gruntfile.js
```

### Config

Add the `kapocs` task to the config object in Gruntfile.js like this:

```js
kapocs: {
	my_target: {
		assets: [{
			expand: true,
			cwd: 'src/assets',
			dot: true,
			src: ['**'],
			dest: 'build'
		}],
		assetTemplates: [{
			expand: true,
			cwd: 'src/asset_templates',
			dot: true,
			src: ['**'],
			dest: 'build'
		}],
		templates: [{
			expand: true,
			cwd: 'src/templates',
			dot: true,
			src: ['**'],
			dest: 'build'
		}]
	}
}
```

### Run

Running `grunt kapocs:my_target` will:

1. Copy all the assets from `src/assets` to `build`, appending a hash to their file names.
  * A file called `src/assets/images/image.jpg` will be copied to `build/images/image.<md5-hash>.jpg`.
2. Copy all the files from `src/asset_templates` to `build`, appending an MD5 hash to their file names, and expanding asset references in their contents.
  * A file called `src/asset_templates/style/my-style.css` will be copied to `build/style/my-style.<md5-hash>.css`.
  * If an asset template contains `{{image.jpg}}` or `{{src/assets/images/image.jpg}}`, each such reference will be replaced with `image.<md5-hash>.jpg`.
3. Copy all the files from `src/templates` to `build`, expanding asset references in their contents.
  * A file called `src/templates/index.html` will be copied to `build/index.html`.
  * If a template contains `{{my-style.css}}` or `{{src/asset_templates/style/my-style.css}}`, each such reference will be replaced with `my-style.<md5-hash>.css`.

## Installing

You can install grunt-kapocs from NPM by doing:

```shell
npm install grunt-kapocs --save-dev
```

Don't forget to reference it in your `Gruntfile.js`:

```js
grunt.loadNpmTasks('grunt-kapocs');
```

## Using

Add the `kapocs` task to your Grunt config:

```js
grunt.initConfig({
	kapocs: {
		my_target: {
			options: {
				// Options go here
			},
			assets: [
				// JPG, PNG, MP4, and other assets
			],
			assetTemplates: [
				// CSS, JS and other asset templates
			],
			templates: [
				// HTML, PHP and other templates
			]
		}
	}
});
```

The `assets`, `assetTemplates` and `templates` arrays should contain Grunt file references in the [format specified in the Grunt docs](http://gruntjs.com/configuring-tasks#files).

Each of these file references may also contain [grunt.file.copy options](http://gruntjs.com/api/grunt.file#grunt.file.copy). This allows you to specify an `encoding`, for example.

### Assets

Assets are usually binary files, like image or video files. You will want to append an MD5 hash to their file names to ensure they get cached only until they change.

Assets will be copied from the sources specified in `src` to the destination folder specified in `dest`.

They will also be renamed to include an MD5 hash in the file name, based on their contents.
A file called `video.mp4` will be renamed to `video.<md5-hash>.mp4`.

### Templates

Templates are text files that contain references to assets or asset templates. They can be HTML, PHP, or in fact any other text file format.
Their encoding can be set on the Grunt file references in `Gruntfile.js`.

Templates contain references to assets in the format `{{image.jpg}}` or `{{path/to/image.jpg}}`
(the latter is based on the asset source path from the folder where `Gruntfile.js` is.

These references will be replaced with the new **file name** of each asset. Please note that the file path will **not** be included, only the name.
This means that both of the above references will be replaced with `image.<md5-hash>.jpg` in the templates.

Each template file will also be copied to the destination folder specified in the `dest` property.

### Asset templates

Asset templates are text files that contain references to assets or asset templates, just like templates.
But asset templates may be cached by the browser, and we want to ensure that when they change, the browser always loads the latest version.

A good example of asset templates is CSS or JS files, which refer to assets (images, fonts, etc.), but are in turn referenced by HTML or PHP files.

## Options

The following options may be specified in the Grunt config:

### referencePrefix

Type: `string`
Default: `'{{'`

The prefix for references. Changing this will alter the reference format that `grunt-kapocs` is searching for in templates and asset templates.

### referenceSuffix

Type: `string`
Default: `'}}'`

The suffix for references. Changing this will alter the reference format that `grunt-kapocs` is searching for in templates and asset templates.

### temporaryFolder

Type: `string`
Default: `'tmp'`

The temporary folder, where intermediate files may be placed. Asset templates are processed in two steps, so they will be copied here in the first step.

You may want to clean this folder using the `grunt-contrib-clean` plugin after running `grunt-kapocs`.

## Building

**This section explains how to build `grunt-kapocs` when you wish to contribute bug fixes or new features to the project.**

### Prerequisites

* You'll need [grunt-cli](https://www.npmjs.org/package/grunt-cli) to have a local copy of Grunt for this project.
* You'll also need [Bower](http://bower.io/) to fetch the dependencies.

### Building tasks/kapocs.js

1. Clone the repo and enter its folder.
2. Issue `npm install` to install the required NPM packages.
3. Issue `grunt update` to download dependencies and move them to the `lib` folder.
  * If you see any errors, resolve them by issuing `bower prune`, `bower update` and `bower install` manually and resolve conflicts.
  Once all conflicts are resolved, do `grunt update` again.
4. Issue `grunt` to build.

### Running tests

1. Enter the `test` folder.
2. Issue `npm install` to install the required NPM packages.
3. Issue `grunt --force`. The `--force` option is necessary as during testing the task throws some intentional errors.

## Coding style

**grunt-kapocs is written in TypeScript.**

Indent with tabs, please.

