/// Gulp configuration for Typescript, SASS and Live Reload

'use strict';

var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    typescript = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    merge = require('merge2'),
    config = require('./gulp.config.json'),
    packageConfig = require('./package.json');

var tsProject = typescript.createProject('tsconfig.json');

gulp.task('clean', function (done) {
    return del('./www', done);
});

gulp.task('compile:sass', function () {
    return gulp.src(config.app.source + "/**/*.scss")
        .pipe(sass())
        .pipe(gulp.dest(config.app.dest));
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
    gulp.src(config.app.source + "/**/!(*.ts|*.scss)", { base: config.app.source })
        .pipe(gulp.dest(config.app.dest));
});

gulp.task('watch', function () {
    gulp.watch(config.app.source + "/**/*.scss", ['compile:sass']);
    gulp.watch(config.app.source + "/**/*.ts", ['compile:ts']);
    gulp.watch(config.app.source + "/**/!(*.ts|*.scss)", ['refresh']);
});

gulp.task('build', ['compile:sass', 'compile:ts', 'copy']);
gulp.task('default', ['watch', 'build']);