/**
 * Created by Bright on 06/08/2016.
 */
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSequence = require('run-sequence').use(gulp);

gulp.task('browserSync', function(){
    browserSync.init({
        server : {
            baseDir : './'
        }
    });
});

gulp.task('watch',['browserSync'],function(){
    gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('default', function(callback){
    runSequence(['browserSync','watch'],callback);
});