module.exports = function(grunt) {
    /*~~~very useful
    gruntjs.com/configuring-tasks
    ~~~*/
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            src: ['js/brs.js'],
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
        /*
        concat: {
            dist: {
                src: ['js/brs-core.js', 'js/brs-config.js'],
                dest: 'js/brs-src.js',
            }
        },*/
        uglify: {
            build: {
                //the output from concat above
                src: 'js/brs.js',
                dest: 'js/brs.min.js'
            }
        },
        //https://npmjs.org/package/grunt-contrib-copy
        copy: {
            main: {
                options: {
                    processContentExclude: [
                        '**/*.{pdf,png,gif,jpg,ico,psd}'
                    ],
                    //replace the reference to brs.js in our dev to our minified version for build
                    process: function (content, srcpath) {
                        return content.replace("brs.js","brs.min.js");
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
                        src: ['brs.min.js', 'brs-clients.geojson', 'slimbox2.js'],
                        dest: 'dist/js',
                        filter: 'isFile'
                    },
                    //copy all of our style folders and files to distribution
                    {
                        expand: true,
                        cwd: 'style',
                        src: ['**/*.css'],
                        dest: 'dist/style',
                        filter: 'isFile'
                    },
                    //copy all of our img folders and files to distribution
                    {
                        expand: true,
                        cwd: 'images',
                        src: ['**/*'],
                        dest: 'dist/images',
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
    //grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy']);
    grunt.registerTask('build', ['jshint', 'uglify', 'copy']);
    //grunt.registerTask('dev', ['concat', 'watch']);
    grunt.registerTask('default', ['uglify', 'copy']);
};