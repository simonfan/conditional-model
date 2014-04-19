(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'conditional-model',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(conditional, should) {
	'use strict';

	describe('conditional-model', function () {

		it('simple', function () {
			var model = conditional({
				top: 100,
				left: 400,


				name: 'lalala'
			});

			var control = false;


			// listen
			model.when({
				top: { $gt: 400 },
				left: { $lte: 350 },
				name: 'Bill',
			}, function (m) {

				if (m.get('top') > 400 && m.get('left') <= 350) {
					console.log('great!')
					control = true;
				}

			});




			model.set({
				top: 455,
				// left does not satisfy
				left: 500
			});
			control.should.eql(false);

			model.set({
				top: 450,
				left: 350,
				name: 'Bill'
			});
			control.should.eql(true);

		});
	});
});
