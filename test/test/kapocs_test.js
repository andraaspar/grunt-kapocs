'use strict';

var grunt = require('grunt');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports.kapocs = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	default_options: function(test) {
		test.expect(7);
		
		var actual = grunt.file.read('build/template1.txt');
		var expected = grunt.file.read('test/expected1/template1.txt');
		test.equal(actual, expected, 'Test 1');
		
		actual = grunt.file.read('build/dropin1.txt');
		expected = grunt.file.read('test/expected1/dropin1.txt');
		test.equal(actual, expected, 'Test 2');
		
		actual = grunt.file.read('build/asset1.03f3a5cfb2574990393f7b3c1cf5a68d.txt');
		expected = grunt.file.read('test/expected1/asset1.03f3a5cfb2574990393f7b3c1cf5a68d.txt');
		test.equal(actual, expected, 'Test 3');
		
		actual = grunt.file.read('build/asset_template1.4cfd644631fbe7a0d608cfbf8f087f94.txt');
		expected = grunt.file.read('test/expected1/asset_template1.4cfd644631fbe7a0d608cfbf8f087f94.txt');
		test.equal(actual, expected, 'Test 4');
		
		actual = grunt.file.read('build/assets/dropin2.txt');
		expected = grunt.file.read('test/expected1/assets/dropin2.txt');
		test.equal(actual, expected, 'Test 5');
		
		actual = grunt.file.read('build/assets/asset2.25699a320a6c5a69b42d2ab23f22915e.txt');
		expected = grunt.file.read('test/expected1/assets/asset2.25699a320a6c5a69b42d2ab23f22915e.txt');
		test.equal(actual, expected, 'Test 6');
		
		actual = grunt.file.read('build/assets/asset_template2.f6cbfbefa15d962f1a1268e0d60a91b4.txt');
		expected = grunt.file.read('test/expected1/assets/asset_template2.f6cbfbefa15d962f1a1268e0d60a91b4.txt');
		test.equal(actual, expected, 'Test 7');
		
		test.done();
	},
	custom_options: function(test) {
		test.expect(7);
		
		var actual = grunt.file.read('build2/template1.txt');
		var expected = grunt.file.read('test/expected1/template1.txt');
		test.equal(actual, expected, 'Test 1');
		
		actual = grunt.file.read('build2/dropin1.txt');
		expected = grunt.file.read('test/expected1/dropin1.txt');
		test.equal(actual, expected, 'Test 2');
		
		actual = grunt.file.read('build2/asset1.03f3a5cfb2574990393f7b3c1cf5a68d.txt');
		expected = grunt.file.read('test/expected1/asset1.03f3a5cfb2574990393f7b3c1cf5a68d.txt');
		test.equal(actual, expected, 'Test 3');
		
		actual = grunt.file.read('build2/asset_template1.4cfd644631fbe7a0d608cfbf8f087f94.txt');
		expected = grunt.file.read('test/expected1/asset_template1.4cfd644631fbe7a0d608cfbf8f087f94.txt');
		test.equal(actual, expected, 'Test 4');
		
		actual = grunt.file.read('build2/assets/dropin2.txt');
		expected = grunt.file.read('test/expected1/assets/dropin2.txt');
		test.equal(actual, expected, 'Test 5');
		
		actual = grunt.file.read('build2/assets/asset2.25699a320a6c5a69b42d2ab23f22915e.txt');
		expected = grunt.file.read('test/expected1/assets/asset2.25699a320a6c5a69b42d2ab23f22915e.txt');
		test.equal(actual, expected, 'Test 6');

		actual = grunt.file.read('build2/assets/asset_template2.f6cbfbefa15d962f1a1268e0d60a91b4.txt');
		expected = grunt.file.read('test/expected1/assets/asset_template2.f6cbfbefa15d962f1a1268e0d60a91b4.txt');
		test.equal(actual, expected, 'Test 7');

		test.done();
	}
};
