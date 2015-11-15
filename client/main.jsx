"use strict";

var React = require("react"),
    ReactDOM = require("react-dom");

var soundcloud = require('soundcloud');

var components = require('./components');
var TrackList = components.TrackList;

function RenderTracks(tracks) {
    ReactDOM.render(
        <TrackList data={tracks}/>,
        document.getElementById('log')
    );
}

window.onload = function () {
    soundcloud.initialize(config);

    soundcloud.connect().then(function (options) {
        console.log('success', options);
    }).then(function () {
        return soundcloud.get('/me/favorites');
    }).then(function (favorites) {
        console.log(favorites);
        RenderTracks(favorites);
    }).catch(function (op) {
        console.log('error', op);
    });
};