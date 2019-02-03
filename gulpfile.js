var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');

// 设置保存自动编译
var watchedBrowserify = watchify(browserify({
  basedir: '.',
  debug: true,
  entries: ['src/main.ts'],
  cache: {},
  packageCache: {}
}).plugin(tsify));
watchedBrowserify.on("update", bundle, copyHtml);
watchedBrowserify.on("log", gutil.log);

// 设置gulp任务
gulp.task("copy-html", copyHtml);
gulp.task("default", ["copy-html"], bundle);
var paths = {
  pages: ['src/*.html']
};
function copyHtml() {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
}
function bundle() {
  return watchedBrowserify
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
}
