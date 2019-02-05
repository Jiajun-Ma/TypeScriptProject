var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create()


var paths = {
  source: {
    pages: './src/index.html',
    sass: './src/scss/**/*.scss',
    typescript: './src/ts/main.ts'
  },
  target: {
    pages: './dist',
    css: './dist/css',
    javascript: './dist/js'
  }
};

gulp.task('default', ['serve'], function () { })

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ['sass', 'copy-html', 'compile-typeScript'], function () {
  browserSync.init({
    server: paths.target.pages
  });
  gulp.watch(paths.source.sass, ['sass']).on('change', browserSync.reload);
  gulp.watch("./src/ts/**/*.ts", ['compile-typeScript']).on("change", browserSync.reload)
  gulp.watch("./src/**/*.html", ['copy-html']).on('change', browserSync.reload);
});

gulp.task("copy-html", function () {
  return gulp.src(paths.source.pages)
    .pipe(gulp.dest(paths.target.pages));
});

gulp.task('sass', function () {
  return gulp.src(paths.source.sass)
    .pipe(sass({ sourcemap: true }))
    .pipe(gulp.dest(paths.target.css))// Write the CSS & Source maps
    // .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('compile-typeScript', function () {
  return browserify({
    basedir: '.',
    debug: true,
    entries: [paths.source.typescript],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.target.javascript));
})

