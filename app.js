"use strict";

var fs   = require('fs'),
    path = require('path');

var express = require('express'),
    sqlite  = require('sqlite3').verbose();

var app = express();
var config = require('./_config');

//~ app set up
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

/**
 * Get (or create) a database handle.
 */
function getDatabase(file) {
    var exists = fs.existsSync(file);
    if (!exists) {
        console.log("Creating DB file %j.", file);
        fs.openSync(file, "w");
    }

    var db = new sqlite.Database(file);
    if (exists) return db;

    db.serialize(function () {
        //~ Create Users table.
        db.run("CREATE TABLE Users (" +
            "Uno INTEGER PRIMARY KEY," +
            "id TEXT," +
            "username TEXT," +
            "token TEXT)");

        //~ Create Tracks table
        db.run("CREATE TABLE Tracks (" +
            "Uno INTEGER PRIMARY KEY," +
            "userUno INTEGER," +
            "id TEXT," +
            "username TEXT," +
            "permalink_url TEXT," +
            "stream_url TEXT," +
            "is_favorite INTEGER," +
            "is_embeddable INTEGER," +
            "last_modified TEXT," +
            "FOREIGN KEY(userUno) REFERENCES Users(Uno)" +
            ")");
    });

    return db;
}

var db = getDatabase(config.paths.database);

//"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
//~ routes

app.get('/', function (req, res) {
    res.render('index', {title: "sc_wrap", configObj: JSON.stringify(config.SC)});
});

app.get('/auth', function (req, res) {
    res.render('auth');
});

//~ api stuff
app.get('/api', function(req, res) {
    res.send("todo");
});

//"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

//~ catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//~ error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

//"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

module.exports = app;
