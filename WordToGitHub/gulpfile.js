/// Gulp configuration for Typescript, SASS and Live Reload

'use strict';

// initialize all the requried libraries and files
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    rimraf = require('rimraf'),
    sass = require('gulp-sass'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    packageConfig = require('./package.json'),
    config = {
        lib: {
            source: './node_modules',
            dest: './wwwroot/lib'
        },
        app: {
            source: './src',
            dest: './wwwroot'
        },
        browserSync: {
            server: {
                'baseDir': './',
                'routes': {
                    '/node_modules': 'node_modules',
                    '/bower_components': 'bower_components',
                    '/rxjs': 'node_modules/rxjs'
                }
            }
        }
    };

// create the typescript project for transpiling
var tsProject = typescript.createProject('./tsconfig.json');

// clean the destination folder
gulp.task('clean', function (done) {
    return rimraf('./wwwroot', done);
});

// compile sass files found in source folder into corresponding destination folders
gulp.task('compile:sass', function () {
    return gulp.src(config.app.source + '/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(config.app.dest))
        .pipe(browserSync.stream());
});

// compile all typescript files
gulp.task('compile:ts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject))

    tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.app.dest))
        .pipe(browserSync.stream());
});

// copy anything that is not a sass file or typescript file
gulp.task('copy', function () {
    gulp.src([
        config.app.source + '/**/*',
        '!' + config.app.source + '/**/*.scss',
        '!' + config.app.source + '/**/*.ts',
    ], { base: config.app.source })
        .pipe(gulp.dest(config.app.dest))
});

gulp.task('build', ['compile:sass', 'compile:ts', 'copy']);

// start webserver and observe fiels for changes
gulp.task('serve', ['build'], function () {
    browserSync.init(config.browserSync);

    gulp.watch(config.app.source + '/**/*.scss', ['compile:sass']);
    gulp.watch(config.app.source + '/**/*.ts', ['compile:ts']);

    gulp.watch([
        config.app.source + '/**/*',
        '!' + config.app.source + '/**/*.scss',
        '!' + config.app.source + '/**/*.ts',
    ], ['copy'])
        .on('change', browserSync.reload);
});