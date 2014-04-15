module.exports = function(grunt) {
    /*~~~very useful
    gruntjs.com/configuring-tasks
    ~~~*/
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: ['js/cwns-core.js', 'js/cwns-config.js'],
            //http://www.jshint.com/docs/options/
            options: {
                curly: true,
                //latedef: true,
                //undef: true,
                //eqnull: true,
                browser: true,
                jquery: true
            }
        },
        concat: {
            dist: {
                src: ['js/cwns-core.js', 'js/cwns-config.js'],
                dest: 'js/cwns-src.js',
            }
        },
        uglify: {
            build: {
                //the output from concat above
                src: 'js/cwns-src.js',
                dest: 'js/cwns.min.js'
            }
        },
        //https://npmjs.org/package/grunt-contrib-copy
        copy: {
          main: {
            options: {
                //replace the reference to cwns.js in our dev to our minified version for build
                //ToDo: verify that this happens after we copy the file even tho it is above the files array
                process: function (content, srcpath) {
                    return content.replace("cwns-src.js","cwns.min.js");
                  }
                },
              files: [
                {
                    //copy our index to the root of our distribution dir
                    src: 'index.html',
                    dest: 'dist/',
                },
                //copy our minified js file to distribution 'js' dir
                {
                    expand: true,
                    cwd: 'js',
                    src: ['cwns.min.js'],
                    dest: 'dist/js',
                    filter: 'isFile'
                },
                  //copy all of our lib folders and files to distribution
                {
                    expand: true,
                    cwd: 'js/lib',
                    src: ['**/*.js'],
                    dest: 'dist/js/lib',
                    filter: 'isFile'
                },
                  //copy all of our css folders and files to distribution
                {
                    expand: true,
                    cwd: 'css',
                    src: ['**/*.css'],
                    dest: 'dist/css',
                    filter: 'isFile'
                },
                  //copy all of our img folders and files to distribution
                {
                    expand: true,
                    cwd: 'img',
                    src: ['**/*'],
                    dest: 'dist/img',
                    filter: 'isFile'
                },
            ]
          }
        },
        //use watch to monitor changes to any of our js files
        //if so run concat and min so our app always has the latest
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat'],
                options: {
                    spawn: false,
                },
            } 
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    /*watch*/
    grunt.loadNpmTasks('grunt-contrib-watch');
    //!!!ToDo: this copy operation doesn't copy the images correctly
    grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy']);
    grunt.registerTask('dev', ['concat', 'watch']);
    grunt.registerTask('default', ['concat', 'uglify', 'copy']);
};