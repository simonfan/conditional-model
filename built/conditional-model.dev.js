//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

//     Iterator
//     (c) simonfan
//     Iterator is licensed under the MIT terms.

define("subject",["lodash"],function(t){var r={initialize:function(){}},e=function(){};return e.prototype=r,e.proto=function(r,e){return t.isObject(r)?t.assign(this.prototype,r):this.prototype[r]=e,this},e.extend=function(r,e,n){var i,u;t.isFunction(r)?(i=t.assign({},e,{initialize:r}),u=n):t.isObject(r)&&(i=r||{},u=n);var o,s=this;return o=function(){var t=Object.create(o.prototype);return t.initialize.apply(t,arguments),t},t.assign(o,s,u),o.prototype=Object.create(s.prototype),o.prototype.constructor=o,o.proto(i),o.__super__=s.prototype,o},e.extend.bind(e)}),define("iterator/base",["subject","lodash"],function(t,r){var e=t(function(t,r){this.data=t,r=r||{},this.currentIndex=r.startAt||-1,this.options=r,this.evaluate=r.evaluate||r.evaluator||this.evaluate});e.proto({move:function(t){return this.index(this.currentIndex+t),this},evaluate:function(t){return t},evaluator:function(t){return this.evaluate=t,this},start:function(){return this.currentIndex=-1,this},end:function(){return this.currentIndex=this.length(),this},index:function(t){if(t>this.length()-1||0>t)throw new Error("No such index "+t);return this.currentIndex=t,this},countBefore:function(){return this.currentIndex+1},countAfter:function(){return this.length()-(this.currentIndex+1)},range:function(t,r){for(var e=[];r>=t;)e.push(this.at(t)),t++;return e},hasNext:function(){return this.currentIndex<this.length()-1},next:function(){return this.move(1),this.current()},nextN:function(t){for(var r=[],e=this.currentIndex+t-1;this.hasNext()&&this.currentIndex<=e;)r.push(this.next());return r},hasPrevious:function(){return this.currentIndex>0},previous:function(){return this.move(-1),this.current()},previousN:function(t){for(var r=[],e=this.currentIndex-t+1;this.hasPrevious()&&this.currentIndex>=e;)r.push(this.previous());return r},current:function(){return this.at(this.currentIndex)},value:function(){return this.data}}),e.proto({hasPrev:e.prototype.hasPrevious,prev:e.prototype.previous,prevN:e.prototype.previousN});var n=["map","filter","compact","difference"];return r.each(n,function(t){e.proto(t,function(){var e=r(this.data);e=e[t].apply(e,arguments);var n=this.constructor(e.value());return n})}),e}),define("iterator/array",["require","exports","module","./base","lodash"],function(t){var r=t("./base"),e=t("lodash"),n=r.extend({at:function(t){return this.evaluate(this.data[t],t)},length:function(){return this.data.length}}),i=["push","reverse","shift","sort","splice","unshift"];return e.each(i,function(t){n.proto(t,function(){return this.data[t].apply(this.data,arguments),this})}),e.each(["concat","slice"],function(t){n.proto(t,function(){var r=this.data[t].apply(this.data,arguments);return this.constructor(r)})}),n}),define("iterator/object",["require","exports","module","./base","lodash"],function(t){var r=t("./base"),e=t("lodash"),n=r.extend({initialize:function(t,n){n=n||{},r.prototype.initialize.apply(this,arguments),this.order=n.order||e.keys(t)},keyAt:function(t){return this.order[t]},at:function(t){var r=this.keyAt(t),e=this.data[r];return this.evaluate(e,r)},length:function(){return this.order.length},nextKey:function(){return this.keyAt(this.currentIndex+1)},currentKey:function(){return this.keyAt(this.currentIndex)},previousKey:function(){return this.keyAt(this.currentIndex-1)},map:function(t){var r={};return e.each(this.order,function(e,n){r[e]=t(this.data[e],e,n)}.bind(this)),this.constructor(r)}});return n.proto("constructor",n),n}),define("iterator/number",["require","exports","module","./base"],function(t){var r=t("./base"),e=r.extend({at:function(t){return this.evaluate(t,t)},length:function(){return this.data}});return e}),define("itr",["require","exports","module","./iterator/array","./iterator/object","./iterator/number","lodash"],function(t){var r=t("./iterator/array"),e=t("./iterator/object"),n=t("./iterator/number"),i=t("lodash"),u=function(t){var u;return i.isArray(t)?u=r:i.isObject(t)?u=e:i.isNumber(t)&&(u=n),u.apply(this,arguments)};return u.object=e,u.array=r,u.number=n,u});
//     Deep
//     (c) simonfan
//     Deep is licensed under the MIT terms.

define("__deep__/keys",["require","exports","module"],function(){return function(e){return e.replace(/\[(["']?)([^\1]+?)\1?\]/g,".$2").replace(/^\./,"").split(".")}}),define("__deep__/walker",["require","exports","module","lodash","itr","./keys"],function(e,r,t){var n=e("lodash"),i=e("itr"),s=e("./keys"),u=i.object.extend({nextStep:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.nextKey().replace(e,"")},currentStep:function(){var e=new RegExp("^"+this.previousKey()+"\\.");return this.currentKey().replace(e,"")},previousStep:function(){var e=this.previousKey()||"";return n.last(e.split("."))},remainingSteps:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.destination().replace(e,"")},destination:function(){return n.last(this.order)}});t.exports=function(e,r){r=n.isArray(r)?r:s(r);var t={"":e},i=[""];return n.every(r,function(s,u){var o=n.first(r,u+1).join(".");return i.push(o),e=e[s],t[o]=e,!n.isUndefined(e)}),u(t,{order:i})}}),define("__deep__/getset",["require","exports","module","lodash","./keys"],function(e,r){var t=e("lodash"),n=e("./keys");r.get=function(e,r){return r=t.isArray(r)?r:n(r),t.reduce(r,function(e,r){return e[r]},e)},r.set=function(e,i,s){i=t.isArray(i)?i:n(i);var u=i.pop();e=r.get(e,i),e[u]=s}}),define("deep",["require","exports","module","lodash","./__deep__/keys","./__deep__/walker","./__deep__/getset"],function(e){var r=e("lodash"),t={};return t.parseKeys=e("./__deep__/keys"),t.walker=e("./__deep__/walker"),r.extend(t,e("./__deep__/getset")),t});
//     Containers
//     (c) simonfan
//     Containers is licensed under the MIT terms.

define("containers",["lodash"],function(){function n(n,i){return _.all(i,function(i){return _.contains(n,i)})}function i(n,i){return _.any(i,function(i){return _.contains(n,i)})}function t(n,i){return n[0]<i&&i<n[1]}function r(n,i){return n[0]<=i&&i<=n[1]}function u(n,i,u){var e=u?t:r;return e=_.partial(e,n),_.isArray(i)?_.every(i,e):e(i)}return{containsAll:n,containsAny:i,exclusiveWithin:t,inclusiveWithin:r,within:u}});
//     ObjectMatcher
//     (c) simonfan
//     ObjectMatcher is licensed under the MIT terms.

define("__object-query__/operators/match",["require","exports","module","lodash"],function(e,n){var r=e("lodash");n.$matchSingle=function(e,n){return r.isRegExp(e)?e.test(n):e===n},n.$match=function(e,t){return r.isArray(t)?r.any(t,function(r){return n.$matchSingle(e,r)}):n.$matchSingle(e,t)}}),define("__object-query__/operators/range",["require","exports","module"],function(e,n){n.$lt=function(e,n){return e>n},n.$lte=function(e,n){return e>=n},n.$gt=function(e,n){return n>e},n.$gte=function(e,n){return n>=e}}),define("__object-query__/operators/set",["require","exports","module","lodash","containers"],function(e,n){var r=e("lodash"),t=e("containers");n.$in=function(e,n){return r.isArray(n)?t.containsAny(e,n):r.contains(e,n)},n.$nin=function(e,n){return r.isArray(n)?!t.containsAny(e,n):!r.contains(e,n)},n.$all=function(e,n){return t.containsAll(n,e)}}),define("__object-query__/operators/boolean",["require","exports","module"],function(e,n){n.$e=function(){},n.$ne=function(){},n.$not=function(){},n.$or=function(){},n.$and=function(){},n.$exists=function(){}}),define("__object-query__/operators/index",["require","exports","module","lodash","deep","containers","./match","./range","./set","./boolean"],function(e,n){var r=e("lodash");e("deep"),e("containers"),r.extend(n,e("./match"),e("./range"),e("./set"),e("./boolean")),n.evaluateValue=function(e,t){return r.isObject(e)&&!r.isRegExp(e)?r.every(e,function(e,r){var o=n[r];if(o)return o(e,t);throw new Error("The operator "+r+" is not supported by object-query.")}):n.$match(e,t)}}),define("__object-query__/match",["require","exports","module","lodash","deep","./operators/index"],function(e,n,r){var t=e("lodash"),o=e("deep"),i=e("./operators/index"),a=/[0-9]+/,u=function(e,n,r){return t.any(n,function(n){return c(e,n,r)})},c=r.exports=function(e,n,r){for(var c,s=o.walker(n,r);s.hasNext();){var f=s.next();{if(!s.hasNext()){c=i.evaluateValue(e,f);break}if(t.isArray(f)&&!a.test(s.nextStep())){c=u(e,f,s.remainingSteps());break}}}return c}}),define("__object-query__/find",["require","exports","module","lodash","deep","./operators/index"],function(e,n,r){var t=e("lodash"),o=e("deep"),i=e("./operators/index"),a=/[0-9]+/,u=function(e,n,r){return t.any(n,function(n){return c(e,n,r)})},c=r.exports=function(e,n,r){for(var c,s=o.walker(n,r);s.hasNext();){var f=s.next();{if(!s.hasNext()){c=i.evaluateValue(e,f);break}if(t.isArray(f)&&!a.test(s.nextStep())){c=u(e,f,s.remainingSteps());break}}}return c}}),define("object-query",["require","exports","module","lodash","./__object-query__/match","./__object-query__/find"],function(e){function n(e,n){return r.every(e,function(e,r){return t(e,n,r)})}var r=e("lodash"),t=e("./__object-query__/match");e("./__object-query__/find");var o=function(e){return e=e||{},r.partial(n,e)},i=["every","all","some","any","filter","find","reject"];return r.each(i,function(e){o[e]=function(n,t){return r[e](n,o(t))}}),o});
//     conditional-model
//     (c) simonfan
//     conditional-model is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module conditional-model
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('conditional-model',['require','exports','module','lowercase-backbone','object-query','lodash'],function (require, exports, module) {
	

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

