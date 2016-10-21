module.exports = function(config) {
	config.set({
		basePath: '.',
		frameworks: ['jasmine'],
		plugins: [
			'karma-jasmine',
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
			'target/web/js/vendor.min.js',
			"node_modules/angular-mocks/angular-mocks.js",
			'target/build/app.templates.js',
			'src/main/webapp/scripts/**/*.js',
			'src/test/webapp/services/**/*.spec.js',
			'src/test/webapp/components/**/*.spec.js'
		],
		singleRun: true
	});
};
