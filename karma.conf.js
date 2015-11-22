module.exports = function(config) {
	config.set({
		basePath: '.',
		frameworks: ['jasmine', 'sinon'],
		plugins: [
			'karma-jasmine',
			'karma-sinon',
			'karma-phantomjs-launcher',
			'karma-junit-reporter',
			'karma-coverage'
		],
		browsers: ['PhantomJS'],
		reporters: ['dots', 'coverage', 'junit'],
		junitReporter: {
			outputDir: 'target/test/unit',
			suite: ''
		},
		coverageReporter: {
			dir: 'target/test/coverage',
			reporters: [
				{type: 'html', subdir: 'html'},
				{type: 'cobertura', subdir: '.', file: 'cobertura.xml'}
			]
		},
		preprocessors: {
			'src/main/webapp/scripts/**/*.js': ['coverage']
		},
		files: [
			"node_modules/jquery/dist/jquery.js",
			"node_modules/lodash/index.js",
			"node_modules/angular/angular.js",
			"node_modules/angular-animate/angular-animate.js",
			"node_modules/angular-aria/angular-aria.js",
			"node_modules/angular-material/angular-material.js",
			"node_modules/angular-route/angular-route.js",
			"node_modules/angular-mocks/angular-mocks.js",
			'src/main/webapp/scripts/**/*.js',
			'src/test/webapp/mock.templates.js',
			'src/test/webapp/services/**/*.spec.js',
			'src/test/webapp/components/**/*.spec.js'
		],
		singleRun: true
	});
};
