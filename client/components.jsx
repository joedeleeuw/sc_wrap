"use strict";

var React = require("react");
var ReactDOM = require("react-dom");

var Track = React.createClass({
    render: function () {
        return (
            <div className="track">
                <h2 className="author">
                    {this.props.username}
                </h2>
                <a href={this.props.url}>
                    {this.props.title}
                </a>
            </div>
        );
    }
});

var TrackList = React.createClass({
    render: function () {
        var trackNodes = this.props.data.map(function (track) {
            return (
                <Track username={track.user.username}
                       url={track.permalink_url}
                       title={track.title}
                       key={track.id}
                />
            );
        });
        return (
            <div className="trackList">
                {trackNodes}
            </div>
        );
    }
});

module.exports = {
    TrackList: TrackList
};