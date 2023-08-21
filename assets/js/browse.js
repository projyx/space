window.browse = {};

browse.route = (href,params)=>{
    return new Promise((resolve,reject)=>browser(resolve, reject));
    async function browser(resolve, reject) {
        //URL VARIABLES
        var url = new URL(href,location.origin);
        var pathname = url.pathname;
        var search = url.search ? url.search : null;
        var paths = pathname.split("/").splice(1).filter(n=>n);

        //TRANSFORM URL
        var link = pathname;
        if (paths.length > 0) {
            var r = [];
            paths.forEach((path,index)=>schema(path, index));
            function schema(path, index) {
                var p = path;
                if (p.startsWith(":")) {
                    var x = p.split(":")[1];
                    if (x === "room") {
                        p = window.location.pathname.split('/').splice(1)[i];
                    }
                } else if (p.startsWith("*")) {
                    p = window.location.pathname.split('/').splice(1)[i];
                }
                r.push(p);
            }
            link = "/" + r.join('/');
        }

        //DYNAMIC URL
        var loop = null;
        var pool = null;
        var bool = null;
        var loob = null;
        var shtap = null;
        var dynamic = pathname;
        var matched = pathname;
        if (paths.length > 0) {
            var route = window.manifest.routes.reverse().filter(o=>o.url !== "/").every(function(route, index) {
                //console.log('manifest.route', {dynamic, url: route.url});
                var path = route.url.split('/').filter(o=>o.length > 0);
                //path.reverse();
                console.log(41, route.url, path, paths);
                shtap = [];
                bool = [];
                loob = [];
                loop = [];
                pool = [];
                paths.forEach((a,z)=>findComponent(a, z))
                async function findComponent(a, z) {
                    if (paths.length >= path.length) {
                        var p = paths[z];
                        var q = path[z] ? path[z] : null;
                        var d = p;
                        var e = null;
                        console.log(48, z);
                        if (z < path.length) {
                            if (p.startsWith(':')) {
                                var b = p.split(':')[1];
                                var c = '*';
                                if (b === "user") {
                                    d = window.auth.user().localId;
                                }
                                bool.push(true);
                            } else if (a.startsWith('*')) {
                                var c = '*';
                                bool.push(true);
                            } else {
                                c = a;
                                bool.push(paths[z] === c);
                            }
                            e = q === "*" ? q : d;
                            loob.push(c);
                            loop.push(d);
                            shtap.push(c);
                            if (q === "*") {
                                pool.push(e)
                            } else {
                                if (p === q) {
                                    pool.push(e)
                                }
                            }
                        } else {
                            e = q ? q : d;
                            loop.push(d);
                            shtap.push(d);
                            //pool.push(e);
                        }
                        console.log(66, {
                            paths,
                            shtap,
                            a,
                            p,
                            q,
                            z,
                            c,
                            d,
                            e,
                            bool,
                            loob,
                            loop,
                            pool,
                            url: route.url
                        });
                    }
                }
                var booled = bool.length > 0 && bool.every(Boolean);
                var rooted = booled && ('/' + loop.join('/').startsWith(route.url));
                console.log(68, {
                    bool,
                    booled,
                    rooted,
                    url: route.url
                }, {
                    loob,
                    loop,
                    pool
                }, {
                    loob: '/' + loob.join('/'),
                    loop: '/' + loop.join('/'),
                    pool: '/' + pool.join('/')
                });
                if (booled) {
                    dynamic = '/' + shtap.join('/');
                    matched = '/' + pool.join('/');
                    console.log(72, matched);
                    return false
                } else {
                    return true
                }
            })
            link = '/' + shtap.join('/');
        }

        //PAGE ROUTE
        var uri = link + (search ? "?" + search : "");
        var component = document.querySelector('[route="' + matched + '"]');
        var route = window.manifest.routes.filter(o=>o.url === matched)[0];
        var options = {
            loop,
            pool,
            component,
            match: {
                dynamic,
                matched,
                pathname
            },
            route,
            url: {
                search
            }
        };
        console.log(4, "browse.route", {
            uri,
            options,
            params
        });
        document.querySelectorAll('.component').forEach(c=>c.classList.remove('active'));
        var html = await get('/assets/html/' + route.file);
        component.innerHTML.length === 0 ? component.innerHTML = html : null;
        try {
            var obj = await window.routes(uri, options);
            component.classList.add('active');
        } catch (e) {
            console.log(e);
            alert(e.message);
        }

        //VIEW PAGE
        const pop = params && params.pop;
        const mod = matched !== pathname

        const state = {
            url: uri
        }
        if (!(pop)) {
            //console.log(121, obj);
            history.pushState(state, null, uri)
        } else {
            history.replaceState(state, null, uri);
        }
        resolve(obj);
    }
}
