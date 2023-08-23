window.api = {};

window.api.auth = {};

window.api.rooms = {};
window.api.rooms.random = function() {
    request('/assets/json/rooms.json').then(room);
    function room(rooms) {
        var n = Math.floor(Math.random() * (rooms.length - 0 + 1) + 0);
        console.log(10, n);
        var room = rooms[n].name;
        browse.route('/chat/' + room);
    }
}
