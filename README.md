# grunt-kapocs

**Appends a hash to asset file names, and injects file names into templates.**

Appending a hash to file names based on their contents lets you employ a cache busting technique on a web server. Each time a file's content changes, a new hash is appended to its name,
so browsers must download the updated file from the server, rather than using a cached version. A more detailed explanation of HTTP caching & cache busting can be found
[here](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#invalidating-and-updating-cached-responses).

## Example project

Let's take the following folder layout:

```
project_folder
|- build
|- src
|  |- assets
|  |  |- <Files that should be renamed, like images or videos>
|  |- asset_templates
|  |  |- <Files that should be renamed, but they also refer to other assets, like CSS or JS>
|  |- templates
|     |- <Files that refer to assets, but should NOT be renamed, like HTML>
|- Gruntfile.js
```

Add the `kapocs` task to Gruntfile.js like this:

```js
kapocs: {
	doit: {
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

This will:

1. Copy all the assets from `src/assets` to `build`, appending a hash to their file names.
  * A file called `src/assets/images/image.jpg` will be copied to `build/images/image.<md5-hash>.jpg`.
2. Copy all the files from `src/asset_templates` to `build`, appending a hash to their file names, and expanding asset references in their contents.
  * A file called `src/asset_templates/style/my-style.css` will be copied to `build/style/my-style.<md5-hash>.css`.
  * If a file contains `{{image.jpg}}` or `{{src/assets/images/image.jpg}}`, each such reference will be replaced with `image.<md5-hash>.jpg`.
3. Copy all the files from `src/templates` to `build`, expanding asset references in their contents.
  * A file called `src/templates/index.html` will be copied to `build/index.html`.
  * If a file contains `{{my-style.css}}` or `{{src/asset_templates/style/my-style.css}}`, each such reference will be replaced with `my-style.<md5-hash>.css`.

## Installing

You can install the NPM package by doing:

```shell
npm install grunt-kapocs --save-dev
```

Don't forget to reference it in your `Gruntfile.js`:

```js
grunt.loadNpmTasks('grunt-kapocs');
```

## Using

Add the `kapocs` task to your config:

```js
grunt.initConfig({
	kapocs: {
		<task name>: {
			options: {
				// Options go here
			},
			assets: [
				// JPG, PNG, MP4, and other assets
			],
			assetTemplates: [
				// CSS, JS and other asset-templates
			],
			templates: [
				// HTML, PHP and other templates
			]
		}
	}
});
```

The `assets`, `assetTemplates` and `templates` arrays should contain Grunt file references in the [format specified in the Grunt docs](http://gruntjs.com/configuring-tasks#files).

They also accept [grunt.file.copy options](http://gruntjs.com/api/grunt.file#grunt.file.copy).

### Assets

Assets will be renamed and copied from the sources specified in `src` to the destination folder specified in `dest`.

They will also be renamed to include an MD5 hash in the file name, based on their contents.
A file called `asset.ext` will be renamed to `asset.<md5-hash>.ext`.

### Templates

Templates contain references to assets in the format `{{asset.ext}}` or `{{path/to/asset.ext}}`
(the latter based on the asset source path from the folder where `Gruntfile.js` is.

These references will be replaced with the new **file name** of each asset. Please note that the file path will **not** be included, only the name.
This means that both of the above references will be replaced with `asset.<md5-hash>.ext` in the templates.

Each template file will also be copied to the destination folder specified in `dest`.

### Asset templates

Asset templates will be treated just like assets, but then they will also be treated like templates.

In simple terms, they should not be cached, but they contain references to other assets. For example CSS or Js files.

## Options

### referencePrefix

Type: `string`
Default: `'{{'`

The prefix for references.

### referenceSuffix

Type: `string`
Default: `'}}'`

The suffix for references.

### temporaryFolder

Type: `string`
Default: `'tmp'`

The temporary folder, where intermediate files may be placed.

## Building

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
2. Issue `grunt --force`. The `--force` option is necessary as during testing the task throws some intentional errors.

## Coding

**It is written in TypeScript.**

Indent with tabs, please.

