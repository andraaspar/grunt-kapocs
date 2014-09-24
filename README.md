# grunt-kapocs

**Appends a hash to asset file names, and injects file names into templates.**

Appending a hash to file names based on their contents lets you employ a cache busting technique on a web server. Each time a file's content changes, a new hash is appended to its name,
so browsers must download the updated file from the server, rather than using a cached version.

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

```
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
			dest: 'build
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

## Options

### referencePrefix

Type: | `string`
Default: | `'{{'`

The prefix for references.

### referenceSuffix

Type: | `string`
Default: | `'}}'`

The suffix for references.

### temporaryFolder

Type: | `string`
Default: | `'tmp'`

The temporary folder, where intermediate files may be placed.
