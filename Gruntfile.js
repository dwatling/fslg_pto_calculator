module.exports = function (grunt) {  
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);  

    // Project configuration.  
    grunt.initConfig({  
        pkg: grunt.file.readJSON('package.json'),  
		global: {
			tempBuildFolder: 'target/build',
			outputFolder: 'target/web',
			sourceFolder: 'src/main/webapp'
		},
		sass: {
			options: {
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					"<%= global.outputFolder %>/css/app.min.css": ["<%= global.sourceFolder %>/stylesheets/app.scss"],
					"<%= global.outputFolder %>/css/vendor.min.css": ["<%= global.sourceFolder %>/stylesheets/vendor.scss"]
				}
			}
		},
		watch: {
			index: {
				files: ["<%= global.sourceFolder %>/index.html"],
				tasks: ['copy:build', 'copy:deploy'],
				options: {
					spawn: false,
					interrupt: true
				},
			},
			app: {
				files: ["<%= global.sourceFolder %>/scripts/**/*.js"],
				tasks: ['jshint', 'concat', 'copy:deploy'],
				options: {
					spawn: false,
					interrupt: true
				},
			},
			templates: {
				files: ["<%= global.sourceFolder %>/**/*.tpl.html"],
				tasks: ['ngtemplates', 'concat', 'copy:deploy'],
				options: {
					spawn: false,
					interrupt: true
				},
			},
			styles: {
				files: ["<%= global.sourceFolder %>/**/*.scss"],
				tasks: ['sass', 'copy:deploy'],
				options: {
					spawn: false,
					interrupt: true
				},
			}
		},
		ngtemplates: {
			options: {
				module: 'app.templates',
			},
			app: {
				cwd: "<%= global.sourceFolder %>",
				src: '**/*.tpl.html',
				dest: "<%= global.tempBuildFolder %>/app.templates.js",
				options: {
					standalone: true,
					htmlmin: {
						collapseBooleanAttributes:      true,
						collapseWhitespace:             true,
						removeAttributeQuotes:          true,
						removeComments:                 true,
						removeEmptyAttributes:          true,
						removeRedundantAttributes:      true,
						removeScriptTypeAttributes:     true,
						removeStyleLinkTypeAttributes:  true
					},
				}
			}
		},
		uglify: {
			app: {
				files: {
					"<%= global.outputFolder %>/js/app.min.js": ["<%= global.tempBuildFolder %>/app.templates.js", "<%= global.sourceFolder %>/scripts/**/*.js"]
				}
			},
			vendor: {
				files: {
					"<%= global.outputFolder %>/js/vendor.min.js": [
						"node_modules/jquery/dist/jquery.js",
						"node_modules/lodash/index.js",
						"node_modules/angular/angular.js",
						"node_modules/angular-animate/angular-animate.js",
						"node_modules/angular-aria/angular-aria.js",
						"node_modules/angular-material/angular-material.js",
						"node_modules/angular-route/angular-route.js",
					]
				}
			}
		},
		concat: {
			app: {
				options: {
					sourceMap: true
				},
				files: {
					"<%= global.outputFolder %>/js/app.min.js": [
						"<%= global.tempBuildFolder %>/app.templates.js",
						"<%= global.sourceFolder %>/scripts/**/*.js"
					]
				}
			}
		},
		copy: {
			build: {
				files: [
					{expand: true, flatten: true, cwd: "<%= global.sourceFolder %>", src: ['index.html', 'favicon.ico'], dest: '<%= global.outputFolder%>'}
				]
			},
			deploy: {
				files: [
					{expand: true, flatten: true, cwd: "<%= global.outputFolder %>/js/", src: ['vendor.min.*', 'app.min.*'], dest: '<%= global.httpServerFolder %>/js/'},
					{expand: true, flatten: true, cwd: "<%= global.outputFolder %>/css/", src: ['vendor.min.*', 'app.min.*'], dest: '<%= global.httpServerFolder %>/css/'},
					{expand: true, flatten: true, cwd: "<%= global.sourceFolder %>", src: ['index.html', 'favicon.ico'], dest: '<%= global.httpServerFolder %>/'}
				]
			}
		},
		jshint: {
			options: {
				"predef": [ "angular", "document"]
			},
			files:  {
		                src: ["<%= global.sourceFolder %>/scripts/**/*.js"]
		  	}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
    });  

    // Default task.  
    grunt.registerTask('build', ['sass:dist', 'jshint', 'ngtemplates', 'uglify', 'copy:build']);
    grunt.registerTask('test', ['karma']);
	grunt.registerTask('default', ['build', 'test']);
};
