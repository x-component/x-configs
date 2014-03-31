
var merge = require('x-common').merge;

var generic = {
	example  : 'example',
	example2 : 'example2'
};

module.exports = {
	development : merge( {}, generic, {
		example: 'dev'
	}),
	
	development_ci: merge( {}, generic, {
		example: 'ci'
	}),
	
	test : merge( {}, generic, {
		example: 'test',
		example2 : merge.remove
	}),
	
	test_extra1 : merge( {}, generic, {
		example: 'test_extra1'
	}),
	
	production : merge( {}, generic, {
		example: 'prod'
	})
};
