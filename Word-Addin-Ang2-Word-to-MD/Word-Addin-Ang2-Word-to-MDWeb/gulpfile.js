/// <binding />
/// Gulp configuration for Typescript, SASS and Live Reload

'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "./wwwroot"
        },
        files: ["./wwwroot/**/*"]
    });
});