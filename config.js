'use strict';

var
	process = require('x-process'),
	merge   = require('x-common').merge;

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
module.exports = function F( filename, env/*! if begins with '_' it appended to current env */ ) {
	
	var
		configs = require(filename),
		config  = F.config(require(filename),env),
		
		first   = filename.    indexOf('/node_modules/'),
		last    = filename.lastIndexOf('/node_modules/');
	
	// load overrides from a root based file: config/<module>.js
	if(~first && ~last ){
		var
			rest               = filename.substring(last+'/node_modules/'.length),
			module_end         = rest.indexOf('/'),
			module_name        = ~module_end ? rest.substring(0,module_end) : null,
			overrides_filename = filename.substring(0,first)+'/config/'+ module_name,
			exists             = false,
			overrides          = null;
		
		try { fs.accessSync(overrides_filename + '.js'   ,fs.R_OK); exists=true; } catch(e){}
		try { fs.accessSync(overrides_filename + '.json' ,fs.R_OK); exists=true; } catch(e){}
		
		if(exists) try {
			overrides = require(overrides_filename);
		} catch(e){ console.log(e); }
	}
	
	return overrides ? merge(config,overrides) : config;
};

// extract a config from an object property based on the environment
module.exports.config = function( configs, env ){
	
	var config, tmp, suffix='';
	
	if( env && '_' === env.charAt(0)){suffix=env;env=null;}
	
	env = env || process.env.NODE_ENV || 'development';
	
	env += suffix;
	
	if( env && configs ){
		
		do{
			config= (tmp=configs[env]) ? tmp :  null;
		} while  ( !config                     // while no config was found
		        && ~(tmp=env.lastIndexOf('_')) // and we can remove a _suffix
		        && (env=env.substring(0,tmp) ) // and the resulting env is not empty
		         );                            // try again
	}
	
	return config;
};

