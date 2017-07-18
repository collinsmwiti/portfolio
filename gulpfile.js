// Dependencies used in gulpfile.js. It entails both for the bower and modules

var gulp = require('gulp'); /*Dependency used for displaying in the terminal*/
var browserify = require('browserify'); /*Dependency used for browserification*/
var source = require('vinyl-source-stream'); /*Dependency used after building app.js*/
var concat = require('gulp-concat'); /*Dependency used for concatination*/
var uglify = require('gulp-uglify'); /*Dependency used for minification*/
var utilities = require('gulp-util'); /*Dependency used in utilities functions*/
var buildProduction = utilities.env.production; /*Dependency used in utilities function for building production*/
var del = require('del'); /*Dependency used for cleaning*/
var jshint = require('gulp-jshint'); /*Dependency used for checking of errors*/
var lib = require('bower-files')({
  "overrides": {
    "bootstrap": {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
}); /*Dependency for using bower packages in the gulpfile*/
var browserSync = require('browser-sync').create(); /*Dependency used for browser synchronization*/
/*Dependencies used for processing our sass and turning it into vanilla CSS*/
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

//Tasks used in gulpfile.js

/*Task used for displaying in the console*/
gulp.task('myTask', function() {
  console.log('hello gulp');
});

/*Task used for concatination*/
gulp.task('concatInterface', function() {
  return gulp.src(['./js/app.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

/*Task used for browserifying concatinated items*/
gulp.task('jsBrowserify', ['concatInterface'], function() {
  return browserify({
      entries: ['./tmp/allConcat.js']
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'));
});

/*task used for minification*/
gulp.task('minifyScripts', ['jsBrowserify'], function() {
  return gulp.src('./build/js/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

/*task used for building,minifying and browserifying the built production*/
gulp.task('build', function() {
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

/*task used for cleaning*/
gulp.task('clean', function() {
  return del(['build', 'tmp']);
});

/*task used for first building and cleaning afterwards minifying and browserifying the built production*/
gulp.task('build', ['clean'], function() {
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
    gulp.start('cssBuild');
    gulp.start('serve');

  }
  gulp.start('bower');
});

/*task used for checking of errors*/
gulp.task('jshint', function() {
  return gulp.src(['js/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

/*task used to concat all the js dependencies into vendor.min.js file and then places it into build/js directory*/
gulp.task('bowerJS', function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

/*task used to concat all the js dependencies into vendor.css file and then places it into build/css directory*/
gulp.task('bowerCSS', function() {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

/*task for combining both bower tasks into one to be run in parallel*/
gulp.task('bower', ['bowerJS', 'bowerCSS']);

/*task used for browser synchronization where we launch the local server from the directory baseDir when we run gulp serve*/
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(['js/*.js'], ['jsBuild']); //this is a task which automatically replace the files on the server and reload the browser when our javascript changes//
  gulp.watch(['bower.json'], ['bowerBuild']); //this is a task for watching the bower manifest file for changes so that whenever we install or uninstall a frontend dependency, our vendor files will be rebuilt and the browser reloaded with the bowerBuild task//
  gulp.watch(['*.html'], ['htmlBuild']); // this is a task to keep track of html files//
});

/*task to enable building, browserification and error correction before reloading*/
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function() {
  browserSync.reload();
});

/*task for bowerBuild*/
gulp.task('bowerBuild', ['bower'], function() {
  browserSync.reload();
});

/*task for htmlBuild*/
gulp.task('htmlBuild', function() {
  browserSync.reload();
});

/*tasks used for processing our sass and turning it into vanilla CSS*/
gulp.task('cssBuild', function() {
  return gulp.src(['scss/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});
// task used for compilation of the above sass//
gulp.watch(['scss/*.scss'], ['cssBuild']);
