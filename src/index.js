//     conditional-model
//     (c) simonfan
//     conditional-model is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module conditional-model
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';

	var backbone = require('lowercase-backbone'),
		objectQuery = require('object-query'),
		_ = require('lodash');

	var conditional = module.exports = backbone.model.extend({

		when: function when(condition, callback, context) {
			// [1] build the query
			var query = objectQuery(condition);

			// [2] listen to changes of the given attribute
			this.on('change', function () {
				// 'this' refers to the model itself.
				if (query(this.toJSON())) {

					// [3] run the callback with given context
					//     and with the model as first argument
					callback.apply(context, [this]);
				}

			}, this);
		},
	});
});
