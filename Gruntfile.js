module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        build: {
            options: {
                banner: '/*! WebUploader <%= pkg.version %> */\n'
            },

            all: {
                preset: 'all',
                dest: "dist/webuploader.js",

                // 在没有jquery类似的库的前提下可以设置builtin,去除强行依赖。
                builtin: {
                    dollar: false,
                    promise: false
                }
            },

            flashonly: {
                preset: 'flashonly',
                dest: "dist/webuploader.flashonly.js",
            },

            html5only: {
                preset: 'html5only',
                dest: "dist/webuploader.html5only.js",
            },

            withoutimage: {
                preset: 'withoutimage',
                dest: "dist/webuploader.withoutimage.js",
            },

            // 自己配置的实例
            // glob语法。
            custom: {
                preset: "custom",
                cwd: "src",
                src: [
                    'widgets/**/*.js',
                    'runtime/html5/**/*.js'
                ],
                dest: "dist/webuploader.custom.js"
            }
        },

        uglify: {
            options: {
                mangle: true,
                banner: '/* WebUploader <%= pkg.version %> */'
            },

            static_mapping: {
                files: [{
                    src: 'dist/webuploader.js',
                    dest: 'dist/webuploader.min.js'
                }, {
                    src: 'dist/webuploader.flashonly.js',
                    dest: 'dist/webuploader.flashonly.min.js'
                }, {
                    src: 'dist/webuploader.html5only.js',
                    dest: 'dist/webuploader.html5only.min.js'
                }, {
                    src: 'dist/webuploader.withoutimage.js',
                    dest: 'dist/webuploader.withoutimage.min.js'
                }, {
                    src: 'dist/webuploader.custom.js',
                    dest: 'dist/webuploader.custom.min.js'
                }]
            }
        },

        copy: {
            jekyll: {
                src: 'dist/webuploader.js',
                dest: 'jekyll/js/webuploader.js',
            },

            css: {
                src: 'css/webuploader.css',
                dest: 'dist/webuploader.css'
            },

            css2: {
                src: 'css/webuploader.css',
                dest: 'jekyll/css/webuploader.css'
            }
        },

        watch: {
            options: {
                debounceDelay: 250
            },

            all: {
                files: ['src/**/*.js', 'Gruntfile.js'],
                tasks: ['default'],
            },

            dist: {
                files: ['src/**/*.js', 'Gruntfile.js'],
                tasks: ['dist'],
            },

            doc: {
                files: ['src/**/*.js', 'Gruntfile.js', 'build/docTpl/**/*'],
                tasks: ['doc'],
            },


            dev: {
                files: 'src/**/*.js',
                tasks: 'build:all'
            }
        },

        jsbint: {
            options: {
                jshintrc: '.jshintrc'
            },

            all: [
                'src/**/*.js',
                '!src/runtime/html5/jpegencoder.js'
            ]
        },

        size: {
            dist: {
                cwd: 'dist/',
                src: '*.js'
            },

            src: {
                src: 'src/**/*.js'
            }
        },

        doc: {
            options: {
                cwd: './src/',
                files: [
                    'uploader.js',
                    'base.js',
                    'mediator.js',
                    '**/*.js'
                ],
                tplDir: './build/docTpl',
                theme: 'gmu',
                outputDir: './jekyll/doc',
                title: 'WebUploader API文档'
            }
        },

        jekyll: {
            options: { // Universal options
                src: 'jekyll'
            },
            dist: { // Target
                options: { // Target options
                    dest: 'pages',
                    config: 'jekyll/_config.yml'
                }
            }
        },

        'gh-pages': {
            options: {
                message: '程序自动提交，源码请查看tree/master/jekyll目录',
                base: 'pages',
                repo: 'https://github.com/fex-team/webuploader.git'
            },
            src: ['**/*']
        },

        qunit: {
            all: {
                options: {
                    urls: [
                        'http://0.0.0.0:8000/test/index.html'
                    ]
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
            /*,

            keepalive: {
                options: {
                    port: 8000,
                    base: '.',
                    keepalive: true
                }
            }*/
        },
    });

    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('build/tasks');    // 加载build目录下的所有task

    // Default task(s).
    grunt.registerTask('default', ['jsbint:all', 'dist']);
    grunt.registerTask('dist', ['build', 'uglify', 'copy']);
    grunt.registerTask('deploy', ['doc', 'jekyll', 'gh-pages']);
    grunt.registerTask('test', ['connect', 'qunit']);
};