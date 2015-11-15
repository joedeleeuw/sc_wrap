window.onload = function () {
    "use strict";

    SC.initialize(config);

    function logFavorites(favorites) {
        var output = document.getElementById('log');
        output.innerHTML += "<ul>";

        favorites.forEach(function (element, index) {
            output.innerHTML += "<li><b>"
                + element.user.username + "</b> - "
                + "<a href='" + element.permalink_url + "'>"
                + element.title + "</a></li>";
        });
        output.innerHTML += "</ul>";
    }

    function handleFavs(favs) {
        console.log(window.favs = favs);
        //console.log("arguments", window.favArgs = arguments);
        //console.log("next_href", favs.next_href);
        console.log("resolved", SC.resolve(favs.next_href));
        logFavorites(favs.collection);
    }

    var connect = function () {
        SC.connect().then(function (options) {
            console.log('success', options);
        }).then(function () {
            return SC.get('/me/favorites', {limit: 20, linked_partitioning: 1});
        }).then(function (favs) {
            handleFavs(favs);
            var ref = new URL(favs.next_href);
            return SC.get(ref.pathname + ref.search);
        }).then(function (favs) {
            handleFavs(favs);
            var ref = new URL(favs.next_href);
            console.log('yo im on page 2');
        }).catch(function (op) {
            console.log('error', op);
        })
    };

    document.getElementById('connect').addEventListener('click', connect);
};