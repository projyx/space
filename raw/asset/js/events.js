window.events = {};

window.events.onclick = {}
window.events.onclick.document = async function(event) {
    var target = event.target;
    var elem = target;

    elem = target.closest('[href]');
    if (elem) {
        event.preventDefault();
        var href = elem.getAttribute('href');
        //console.log(47, href);
        browse.route(href);
    }
}

window.events.onsubmit = {};
