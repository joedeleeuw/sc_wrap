"use strict";

var path = require('path');

module.exports = {
    port: 8000,
    root: __dirname,

    paths: {
        server: './app.js',
        database: path.join(__dirname, 'bin', 'test.db'),
        runner: path.join(__dirname, 'bin', 'www'),
        public: path.join(__dirname, 'public'),
        js: ['./client/**/*.js', './client/**/*.jsx'],
        jsEntry: './client/main.jsx',
        jsResult: 'bundle.js',
    },
    SC: {
        client_id: "",
        secret: "",
        oauth_token: "",
        redirect_uri: "http://localhost:8000/auth"
    }
};