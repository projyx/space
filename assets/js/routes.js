window.routes = function(uri, options) {
    return new Promise((resolve,reject)=>viewer(resolve, reject));
    async function viewer(resolve, reject) {
        var component = options.component;
        var obj = {};
        var paths = uri.split('/').splice(1);
        var sub = paths[0]
        console.log(5, 'routes.js', {
            options,
            paths,
            uri
        });
        var e = {};
        var status = 200;

        if (sub) {
            if (sub === "settings") {
                console.log("routes.view settings");
            } else {
                component.querySelector('.explorer-section').innerHTML = "";
                if (paths.length > 1) {
                    if (paths.length > 2) {
                        if (["edit"].includes(paths[2])) {
                            var file = paths[paths.length - 1];
                            if (file.includes('.')) {
                                alert(file);
                            } else {
                                status = 400;
                                e = {
                                    code: status,
                                    message: "This page does not exist"
                                }
                            }
                            console.log("routes.view editor." + paths[2]);
                        } else if (paths[2] === "tree") {
                            var path = uri.split('/').filter(o=>o.length > 0).splice(4).join('/');
                            console.log("routes.view repository", {
                                path
                            });
                            var contents = await github.repos.contents(sub, paths[1], path);
                            var explorer = component.querySelector('.explorer-section');
                            explorer.innerHTML = "";
                            var html = await get("/assets/html/explorer.repo.html");
                            explorer.innerHTML = html;
                            var feed = explorer.querySelector('.section-repositories > section');
                            var template = feed.nextElementSibling.content.firstElementChild;
                            function compare(a, b) {
                                return a.type.localeCompare(b.type) || b.name - a.name;
                            }
                            contents.sort(compare).forEach((content,index)=>{
                                var el = template.cloneNode(true);
                                var icon = null;
                                if (content.type === "file") {
                                    icon = "/assets/png/file-repository.png";
                                } else if (content.type === "folder") {
                                    icon = "/assets/png/file-folder.png";
                                }
                                const href = '/' + sub + '/' + paths[1] + '/tree/main/' + path + '/' + content.name;
                                el.setAttribute('href', href);
                                icon ? el.querySelector('.folder-image img').src = icon : null;
                                el.querySelector('.folder-name').textContent = content.name;
                                feed.insertAdjacentHTML('beforeend', el.outerHTML)
                            }
                            );
                            console.log('users.repos', repos);
                        } else {
                            status = 400;
                            e = {
                                code: status,
                                message: "This page does not exist"
                            }
                        }
                    } else {
                        console.log("routes.view repository");
                        var path = uri.split('/').splice(3).join('/')
                        var contents = await github.repos.contents(sub, paths[1], path);
                        var explorer = component.querySelector('.explorer-section');
                        explorer.innerHTML = "";
                        var html = await get("/assets/html/explorer.repo.html");
                        explorer.innerHTML = html;
                        var feed = explorer.querySelector('.section-repositories > section');
                        var template = feed.nextElementSibling.content.firstElementChild;
                        function compare(a, b) {
                            return a.type.localeCompare(b.type) || b.name - a.name;
                        }
                        contents.sort(compare).forEach((content,index)=>{
                            console.log(84, content);
                            var el = template.cloneNode(true);
                            var icon = null;
                            if (content.type === "file") {
                                icon = "/assets/png/file-repository.png";
                            } else if (content.type === "folder") {
                                icon = "/assets/png/file-folder.png";
                            }
                            el.setAttribute('href', '/' + paths.join('/') + '/tree/main/' + content.name);
                            icon ? el.querySelector('.folder-image img').src = icon : null;
                            el.querySelector('.folder-name').textContent = content.name;
                            feed.insertAdjacentHTML('beforeend', el.outerHTML)
                        }
                        );
                        console.log('users.repos', repos);
                    }
                } else {
                    console.log("routes.view user");
                    var repos = await github.users.repos(sub);
                    var explorer = component.querySelector('.explorer-section');
                    explorer.innerHTML = "";
                    var html = await get("/assets/html/explorer.user.html");
                    explorer.innerHTML = html;
                    var feed = explorer.querySelector('.section-repositories > section');
                    var template = feed.nextElementSibling.content.firstElementChild;
                    repos.forEach((repo,index)=>{
                        var el = template.cloneNode(true);
                        el.setAttribute('href', '/' + sub + '/' + repo.name);
                        el.querySelector('.folder-name').textContent = repo.name;
                        feed.insertAdjacentHTML('beforeend', el.outerHTML)
                    }
                    );
                    console.log('users.repos', repos);
                }
            }
        } else {
            var explorer = component.querySelector('.explorer-section');
            explorer.innerHTML = "";
            var html = await get("/assets/html/explorer.home.html");
            explorer.innerHTML = html;
            console.log("routes.view home");
        }

        status === 200 ? resolve(obj) : reject(e);
    }
}
