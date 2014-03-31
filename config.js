'use strict';

var process = require('x-process');

module.exports =
/**
 * x-configs
 * ---------
 * selects configuration settings based on a given env or the NODE_ENV variable, with a value like `development`,`test` or `production`.
 *
 * **usage**:
 *
 *     var config          = require('x-configs')(__dirname+'/config'),
 *
 * the config is loaded from the given file. The file is a normal node module
 * and we expect an object with keys for each of the following env values:
 *
 *     module.exports={
 *       'development':{ ... }
 *       'test':{ ... }
 *       'production':{ ... }
 *    }
 *
 * each environment specific object must contain the *complete* settings.
 *
 * as a config file is a normal javascript module, one can use the function `merge` from the module "x-common" to reuse some settings:
 *
 * **example**:
 *
 *     var merge = require('x-commen').merge;
 *     
 *     var generic={
 *       ... same settings for all environments ...
 *       url:'http://abc'
 *     };
 *     module.exports={
 *         // merging into a new empty object, the generic setting and the following overriding settings
 *         development:merge({},generic,{
 *             url: 'http://devurl'
 *         }),
 *         test:merge({},generic,{
 *             url: 'http://testurl'
 *         }),
 *         production:merge({},generic)
 *     };
 *
 * **fallbacks**:
 *
 * one can have in a config additional specific variants besides development,test and production.
 *
 * example:
 *
 *     require('x-configs')( filename ,'production_ref')
 *
 * if the config module contains a key `production_ref:{..}` this one is returned otherwise
 * 'production' is used.
 *
 * Thus as fallback _suffixes are removed from the key until an object is found or the key is empty
 *
 * If env is a name beginning with an '_' p.e. '_variant', then this value is combined with
 * the current NODE_ENV value p.e. 'production'. The key tried first is then: 'production_variant'.
 *
 * @param filename  The file name to require the config from
 * @param env       Optional name of the environment, default is the NODE_ENV value.
 * @return          The config object found or undefined
 */
function ( filename, env/*! if begins with '_' it appended to current env */ ) {
	
	var configs = require(filename), config, index_underscore, tmp, suffix='';
	
	if( env && '_' === env.charAt(0)){suffix=env;env=null;}
	
	env = env || process.env.NODE_ENV || 'development';
	
	env += suffix;
	
	if( env && configs ){
		
		do{
			config= (tmp=configs[env]) ? tmp :  void 0;
		} while  ( !config                       // while no config was found
		        && -1<(tmp=env.lastIndexOf('_')) // and we can remove a _suffix
		        && (env=env.substring(0,tmp) )   // and the resulting env is not empty
		         );                              // try again
	}
	return config;
};
