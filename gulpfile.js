"use strict";

var gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    del        = require('del'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    watchify   = require('watchify'),
    reactify   = require('reactify');

var nodemon     = require('gulp-nodemon'),
    browserSync = require('browser-sync');

//""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

var config = require('./_config');
global.config = config;
console.log("config: %j", config);

//""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

gulp.task('sync', ['nodemon'], function () {
    browserSync({
        files: [config.paths.public + '/**/*.*'],
        proxy: "localhost:" + config.port,  // local node app address
        port: 5000,  // use *different* port than above
        notify: true,
        //browser: "google chrome",
    })
});

//""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

gulp.task('nodemon', function (cb) {
    var called = false;

    nodemon({
        script: config.paths.runner,
        ignore: [
            'gulpfile.js',
            'node_modules/',
            'public/',
            'bin/'
        ]
    }).on('start', function () {
        console.info('Starting.');
        if (!called) {
            called = true;
            cb();
        }
    }).on('restart', function () {
        console.log("Restarted!");
        setTimeout(function () {
            browserSync.reload({stream: false});
        }, 200);
    });
});

// - - - - - - - - - - - - - - - - - - - - - -

var wb = watchify(browserify({
    entries: [config.paths.jsEntry],
    extensions: ['.js', '.jsx'],
    insertGlobals: false,
    debug: true, // Uses sourcemapping
    cache: {}, packageCache: {},
    fullPaths: true // Requirement of watchify
}));

wb.transform(reactify);

gulp.task('browserify', bundle);
wb.on('update', bundle);    // on any dep update, runs the bundler
wb.on('log', gutil.log);    // output build logs to terminal

function bundle() {
    return wb.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(config.paths.jsResult))
        .pipe(gulp.dest(config.paths.public));
}

// - - - - - - - - - - - - - - - - - - - - - -

gulp.task('watch', function () {
    gulp.watch(config.paths.js, ['browserify', browserSync.reload]);
});

// - - - - - - - - - - - - - - - - - - - - - -

gulp.task('serve', ['browser-sync', 'watch']);
gulp.task('default', ['browserify', 'nodemon', 'watch']);