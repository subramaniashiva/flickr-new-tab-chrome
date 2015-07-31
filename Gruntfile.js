module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
          main: {
              files: [{
                  expand: true,
                  src: ['index.html', 'manifest.json', 'popup.html', 'img/*', 'icons/*'],
                  dest: 'build/'
              }]
          }
        },
        jshint: {
          files: {
            src: 'js/*.js'
          }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [{
                    expand: true,
                    src: '*.js',
                    dest: 'build/js',
                    cwd: 'js'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.css'
                }]
            }
        },
        html_minify: {
            build: {
                files: [{
                    expand: true,
                    src: '*.html',
                    dest: 'build/',
                }]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.loadNpmTasks('grunt-html-minify');

    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['jshint','html_minify', 'uglify', 'cssmin', 'copy']);

};