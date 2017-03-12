//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, fileinclude, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber, htmlmin;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
sourceMaps  = require('gulp-sourcemaps');
imagemin    = require('gulp-imagemin');
minifyCSS   = require('gulp-minify-css');
htmlmin     = require('gulp-htmlmin');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');
plumber     = require('gulp-plumber');
fileinclude = require('gulp-file-include');

var buildDir = 'build/';
var deployDir = 'dist/';

gulp.task('browserSync', function() {
    browserSync({
        port: 3002,
        ui: {
          port: 3003
        },
        server: {
            baseDir: buildDir
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});


gulp.task('copy-images', function(tmp) {
    return gulp.src(['app/images/**/*.jpg', 'app/images/**/*.png', 'app/images/**/*.gif'], {
        })
        .pipe(gulp.dest(buildDir + 'images'))
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

gulp.task('copy-fonts', function(tmp) {
    gulp.src(['app/fonts/*'])
        .pipe(gulp.dest(buildDir + 'fonts'))
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});
gulp.task('copy-videos', function(tmp) {
    gulp.src(['app/video/*'])
        .pipe(gulp.dest(buildDir + 'video'))
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

//compressing images & handle SVG files
gulp.task('images-deploy', function() {
    gulp.src(['app/images/**/*', '!app/images/README'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest(deployDir + 'images'));
});

//compiling our Javascripts
gulp.task('scripts', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
                //catch errors
                .on('error', gutil.log)
                //where we will store our finalized, compressed script
                .pipe(gulp.dest(buildDir + 'scripts'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/src/_includes/**/*.js', 'app/scripts/src/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
                //compress :D
                .pipe(uglify())
                //where we will store our finalized, compressed script
                .pipe(gulp.dest(deployDir + 'scripts'));
});

//compiling our SCSS files
gulp.task('styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/scss/init.scss')
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber({
                  errorHandler: function (err) {
                    console.log(err);
                    this.emit('end');
                  }
                }))
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'app/styles/scss/'
                      ]
                }))
                .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
                //catch errors
                .on('error', gutil.log)
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write())
                //where to save our final, compressed css file
                .pipe(gulp.dest(buildDir + 'styles'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/scss/init.scss')
                .pipe(plumber())
                //include SCSS includes folder
                .pipe(sass({
                      includePaths: [
                          'app/styles/scss',
                      ]
                }))
                .pipe(autoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                .pipe(minifyCSS())
                //where to save our final, compressed css file
                .pipe(gulp.dest(deployDir + 'styles'));
});

//basically just keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function() {
    //grab everything, which should include htaccess, robots, etc
    gulp.src(deployDir + '*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('app/.*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(deployDir + 'fonts'));

    gulp.src('app/video/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(deployDir + 'video'));

    //grab all of the styles
    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest(deployDir + 'styles'));
});

//cleans our build directory in case things got deleted
gulp.task('clean-build', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});
//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});

//create folders using shell
gulp.task('scaffold', function() {
  return shell.task([
      'mkdir ' + deployDir.substr(0, deployDir.length-1), //remove last / from path
      'mkdir ' + deployDir + 'fonts',
      'mkdir ' + deployDir + 'images',
      'mkdir ' + deployDir + 'scripts',
      'mkdir ' + deployDir + 'styles',
      'mkdir ' + deployDir + 'video'
    ]
  );
});

//include files using gulp-file-include
gulp.task('fileinclude', function() {
  gulp.src(['app/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(buildDir))
    .pipe(browserSync.stream());
});

//include files using gulp-file-include
gulp.task('fileinclude-deploy', function() {
  gulp.src(['app/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(deployDir));
});

// Watch
gulp.task('watch', function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('app/scripts/src/**', ['scripts']);
    gulp.watch('app/styles/scss/**', ['styles']);
    gulp.watch('app/images/**', ['copy-images']);
    gulp.watch('app/fonts/**', ['copy-fonts']);
    gulp.watch('app/video/**', ['copy-videos']);
    gulp.watch(['app/**/*.html', 'app/**/*.json'], ['html', 'fileinclude']);
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['clean-build', 'browserSync', 'scripts', 'copy-images', 'styles', 'copy-fonts', 'copy-videos', 'fileinclude', 'watch']);

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy', 'images-deploy'], 'fileinclude-deploy', 'html-deploy'));
