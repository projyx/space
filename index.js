window.onload = async(event)=>{
    window.manifest = await get("/site.webmanifest");
    console.log(2, "window.onload", {
        manifest: window.manifest
    });

    browse.route(window.location.pathname);

    document.body.onclick = window.events.onclick.document;
}

window.onpopstate = (event)=>{
    var state = event.state;
    console.log(event, state);
    if (state && state.url) {
        console.log(state);
        state.url.length > 0 ? browse.route(state.url, {
            pop: true
        }) : null;
    }
}
