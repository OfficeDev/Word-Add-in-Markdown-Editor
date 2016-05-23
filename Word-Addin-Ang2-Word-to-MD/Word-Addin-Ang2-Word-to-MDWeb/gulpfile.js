'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    config = require('./gulp.config.json'),
    packageConfig = require('./package.json');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('clean', function (done) {
    return del('./wwwroot', done);
});

gulp.task('compile:sass', function () {
    return gulp.src(config.app.source + "/app/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(config.app.dest + '/app'));
});

gulp.task('compile:ts', function () {
    var tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    tsResult.js
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.app.dest));
});

gulp.task('copy', function () {
    gulp.src([
        config.app.source + "/**/*",
        "!" + config.app.source + "/**/*.scss",
        "!" + config.app.source + "/**/*.ts",
    ], { base: config.app.source })
        .pipe(gulp.dest(config.app.dest));
});

gulp.task('watch', function () {
    gulp.watch(config.app.source + "/app/**/*.scss", ['compile:sass']);
    gulp.watch(config.app.source + "/app/**/*.ts", ['compile:ts']);
    gulp.watch([
        config.app.source + "/**/*",
        "!" + config.app.source + "/**/*.scss",
        "!" + config.app.source + "/**/*.ts",
    ], ['copy']);
});

gulp.task('build', ['compile:sass', 'compile:ts', 'copy']);
gulp.task('default', ['watch', 'build']);