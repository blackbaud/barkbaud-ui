/// <vs BeforeBuild='default' SolutionOpened='watch' />
/*jshint node: true */

module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        buildPath: grunt.option('buildpath') || 'build',
        bump: {
            options: {
                files: ['bower.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: false,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: false,
                regExp: false
            }
        },
        // We used to use grunt-contrib-concat here but the source maps never came out right.  This one works much better.
        concat_sourcemap: {
            options: {
                sourcesContent: true,
                sourceRoot: '../..'
            },
            app: {
                files: {
                    '<%= buildPath %>/js/app.js': [
                        'bower_components/angular-gravatar/build/angular-gravatar.js',
                        'src/index.js',
                        'src/**/*.js',
                        'tmp/templates.js'
                    ]
                }
            }
        },
        uglify: {
            options: {
                // Source map isn't perfect here, but it's serviceable.  Be on the lookout for updates to this task
                // in case it's fixed.
                sourceMap: true,
                sourceMapIncludeSources: true
            },
            app: {
                options: {
                    sourceMapIn: '<%= buildPath %>/js/app.js.map'
                },
                src: ['<%= buildPath %>/js/app.js'],
                dest: '<%= buildPath %>/js/app.min.js'
            }
        },
        copy: {
            css: {
                files: [{
                    expand: true,
                    src: ['**/*.*'],
                    cwd: 'bower_components/blackbaud-skyux/dist/css',
                    dest: '<%= buildPath %>/css/sky'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    src: ['**/*.*'],
                    cwd: 'bower_components/blackbaud-skyux/dist/js',
                    dest: '<%= buildPath %>/js/sky'
                }, {
                    expand: true,
                    src: ['**/*.*'],
                    cwd: 'node_modules/angular2/bundles',
                    dest: '<%= buildPath %>/js/angular2'
                }, {
                    expand: true,
                    src: ['**/*.*'],
                    cwd: 'node_modules/rxjs/bundles',
                    dest: '<%= buildPath %>/js/rxjs'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['index.html'],
                    dest: '<%= buildPath %>/'
                }]
            }
        },
        sass: {
            libs: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= buildPath %>/css/app.css': 'src/scss/app.scss'
                }
            }
        },
        html2js: {
            options: {
                module: 'barkbaud.templates',
                quoteChar: '\'',
                indentString: '    ',
                singleModule: true
            },
            main: {
                src: ['src/**/*.html'],
                dest: 'tmp/templates.js'
            }
        },
        watch: {
            sass: {
                files: ['src/scss/*.scss'],
                tasks: ['sass']
            },
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['compileappscripts']
            },
            html: {
                files: ['src/index.html'],
                tasks: ['copy:html']
            },
            templates: {
                files: ['src/components/**/*.html', 'src/pages/**/*.html'],
                tasks: ['html2js', 'compileappscripts']
            }
        },
        skylint: {
            options: {
                linterUrl: 'http://localhost:8080/build/js/blackbaud-skyux/skylint.min.js'
            },
            files: ['src/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concat-sourcemap');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-skylint');

    grunt.registerTask('compileappscripts', ['concat_sourcemap:app', 'uglify:app', 'copy:js']);
    grunt.registerTask('default', ['html2js', 'concat_sourcemap', 'uglify', 'sass', 'copy']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('buildfromsrc', ['copy:dist', 'build']);
};
