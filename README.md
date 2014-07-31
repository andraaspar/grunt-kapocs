# grunt-kapocs

> Appends a hash to asset file names, and injects file names into templates.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-kapocs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-kapocs');
```

## The "kapocs" task

### Overview
In your project's Gruntfile, add a section named `kapocs` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  kapocs: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

#### options.buildName
Type: `String`
Default value: `'build/'`

The name of the folder to output files to.

**WARNING: By default, this folder will be cleaned before operation!**

#### options.srcName
Type: `String`
Default value: `'src/'`

The name of the src folder, where the kapocs_asset, kapocs_template, kapocs_asset_template and kapocs_dropin folders are.

#### options.tmpName
Type: `String`
Default value: `'tmp/'`

Temporary directory name.

**WARNING: By default, this folder will be cleaned before operation!**

#### options.cleanBuild
Type: `Boolean`
Default value: `true`

Whether to clean the build folder before operation.

#### options.cleanTmp
Type: `Boolean`
Default value: `true`

Whether to clean the tmp folder before operation.

### Usage Examples

#### Default Options
Files under `src/kapocs_asset/` and `src/kapocs_asset_template/` will be copied to `build/`, and will get a hash appended to the file names.

Files under `src/kapocs_template/` and `src/kapocs_asset_template/` will get the new file names injected.

A file called `foo.txt` may get a name like `foo.03f3a5cfb2574990393f7b3c1cf5a68d.txt`. Template files with `{{foo.txt}}` will have the new name injected. Currently, the file path is not checked.

Files under `src/kapocs_dropin/` will be copied into `build/`, unchanged.

```js
grunt.initConfig({
  kapocs: {
    foo: {}
  },
});
```

#### All Options
Here are all the options and their default values:

```js
grunt.initConfig({
  kapocs: {
    foo: {
      options: {
        buildName: 'build/',
        srcName: 'src/',
        tmpName: 'tmp/',
        cleanBuild: true,
        cleanTmp: true
      }
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
