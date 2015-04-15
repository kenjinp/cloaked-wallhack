//include gulp
var gulp = require('gulp'),
    gutil = require('gulp-util');

//include plug-ins
var notify = require('gulp-notify'),
    source = require('vinyl-source-stream'),
    jshint = require('gulp-jshint'),
    changed = require('gulp-changed'),
    imagemin = require('gulp-imagemin'),
    minifyHTML = require('gulp-minify-html'),
    concat = require('gulp-concat'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefix = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    mocha = require('gulp-mocha'),
    scsslint = require('gulp-scss-lint'),
    connect = require('gulp-connect');

var scriptDir = './src/scripts',
    appEntryPoint = 'app.js',
    buildDir = './dis/scripts';

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}


//JS hint task
gulp.task('jshint', function() {
  gulp.src([
    './src/scripts/*.js',
     './src/scripts/spec/*.js',
     './src/scripts/spec/modules/*.js',
     './src/scripts/spec/integration/*.js',
     './src/scripts/spec/integration/modules*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//scss lint
gulp.task('scss-lint', function() {
  gulp.src('./src/styles/*.scss')
    .pipe(scsslint());
})

//minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './dis/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

//minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './src/*.html',
      htmlDst = './dis/';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

gulp.task('buildScript', function() {
  return browserify({
    entries: ['./src/scripts/lib/reddit.min.js' , scriptDir + '/'+ appEntryPoint], debug: true
  })
    .transform(reactify)
    .bundle()
    .pipe(source(appEntryPoint))
    .pipe(gulp.dest(buildDir))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(notify('Bundling Done.'));
});

//DEV
//JS concat, strip debugging then minify
gulp.task('scripts_dev', function() {
  var scriptSrc = ['./src/scripts/app.js'],
      scriptDst = './dis/scripts/';
  gulp.src(scriptSrc)
    .pipe(browserify())
    .pipe(reactify({reactTools: reactTools}))
    .pipe(concat('app.js'))
    //.pipe(stripDebug())
    //.pipe(uglify())
    .pipe(gulp.dest(scriptDst));
});

//PROD
//JS concat, strip debugging then minify
gulp.task('scripts_prod', function() {
  var scriptSrc = ['./src/scripts/app.js'],
      scriptDst = './dis/scripts/';
  gulp.src(scriptSrc)
    .pipe(browserify())
    .pipe(concat('app.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(scriptDst));
});


//CSS sass, concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./src/styles/normalize.css','./src/styles/style.scss'])
    .pipe(sass())
    .pipe(concat('syles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./dis/styles/'));
});

//server
gulp.task('connect', function() {
  connect.server({
    root:'dis'
  });
});

//default gulp task
gulp.task('default', ['connect','imagemin', 'htmlpage', 'buildScript', 'styles'], function() {
  //watch for HTMl changes
  gulp.watch('./src/*.html', ['htmlpage']);
  //watch for JS changes
  gulp.watch('./src/scripts/*.js' ['jshint', 'scripts_dev']);
  //watch for CSS changes
  gulp.watch('./src/styles/*.scss', ['styles']);
});

//default gulp task
gulp.task('prod', ['imagemin', 'htmlpage', 'buildScript', 'styles'], function() {
  //watch for HTMl changes
  gulp.watch('./src/*.html', ['htmlpage']);
  //watch for JS changes
  gulp.watch('./src/scripts/*.js' ['jshint', 'scripts_prod']);
  //watch for CSS changes
  gulp.watch('./src/styles/*.scss', ['styles']);
});
