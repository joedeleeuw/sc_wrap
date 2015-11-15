"use strict";

var React = require("react");
var ReactDOM = require("react-dom");

var soundcloud = require('soundcloud');

var components = require('./components');
var TrackList = components.TrackList;

function RenderTracks(tracks) {
    ReactDOM.render(
        <TrackList data={tracks} />,
        document.getElementById('log')
    );
}

window.onload = function () {
    //soundcloud.initialize(config);

    soundcloud.connect().then(function(options) {
       console.log('success', options);
    }).then(function() {
        return soundcloud.get('/me/favorites');
    }).then(function(favorites) {
        RenderTracks(favorites);
    }).catch(function (op) {
        console.log('error', op);
    });

    var old_connect = function () {
        SC.connect().then(function (options) {
            console.log('success', options);
        }).then(function () {
            return SC.get('/me/favorites', {limit: 20, linked_partitioning: 1});
        }).then(function (favs) {
            RenderTracks(favs.collection);
            var ref = new URL(favs.next_href);
            return SC.get(ref.pathname + ref.search);
        }).then(function (favs) {
            RenderTracks(favs.collection);
            console.log('yo im on page 2');
            //return SC.get(ref.pathname + ref.search);
        }).catch(function (op) {
            console.log('error', op);
        })
    };

    document.getElementById('connect').addEventListener('click', old_connect);
};