var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('server', function(){

	server.run(['app.js']);

	gulp.watch(['app/**/*.*'],server.notify);

	gulp.watch(['router/*.js'],server.notify);
});

gulp.task('default',['server']);