'use strict';

var
	assert  = require('assert'),
	configs = require('../config'),
	process = require('x-process');

suite('configs',function(){
	suite('test no env',function(){
		delete process.env.NODE_ENV;
		var	config = configs(__dirname+'/config');
		test('config is development',function(){
			assert.equal(config.example,'dev');
		});
	});
	suite('env development',function(){
		process.env.NODE_ENV='development'
		var	config = configs(__dirname+'/config');
		test('config is development',function(){
			assert.equal(config.example,'dev');
		});
	});
	suite('env test_extra1',function(){
		process.env.NODE_ENV='test_extra1'
		var	config = configs(__dirname+'/config');
		test('config is test_extra1',function(){
			assert.equal(config.example,'test_extra1');
		});
	});
	suite('env test_extra2',function(){ // does not exists
		process.env.NODE_ENV='test_extra2'
		var	config = configs(__dirname+'/config');
		test('config is test',function(){
			assert.equal(config.example,'test');
		});
		test('example is removed',function(){
			assert.equal(config.example2,void 0);
		});
	});
	suite('env production',function(){
		process.env.NODE_ENV='production'
		var	config = configs(__dirname+'/config');
		test('config is production',function(){
			assert.equal(config.example,'prod');
		});
	});
});
