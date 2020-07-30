const   gulp = require('gulp'),
		ts = require('gulp-typescript'),
		clean = require('gulp-clean');

const   BUILD_DIRECTORY = 'dist',
		tsProject = ts.createProject('tsconfig.json');

var watch = function () {
    gulp.watch('src/**/*.ts', gulp.series(scripts));
}

var cleanScripts = function () {
    return gulp.src(BUILD_DIRECTORY, {read: false}).pipe(clean());
}

var scripts = function () {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(BUILD_DIRECTORY));
}

gulp.task('build', gulp.series(scripts));

exports.scripts = scripts;
exports.watch = watch;
exports.cleanScripts = cleanScripts;
exports.default = gulp.series(scripts);