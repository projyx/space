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
                if (paths.length > 1) {
                    if (paths.length > 2) {
                        if (paths[2] === "blob") {
                            var file = paths[paths.length - 1];
                            if (file.includes('.')) {
                                console.log(37, 'routes.view editor');

                                window.dom = {

                                    body: document.body,

                                    "style": document.getElementById("css"),

                                    "code": document.getElementById("code"),

                                    "html": document.getElementById('code-html'),

                                    "css": document.getElementById('code-css'),

                                    "js": document.getElementById('js-editor'),

                                    "resize": {

                                        "code": document.getElementById("resizer"),

                                        "html": document.getElementById('html-resizer'),

                                        "css": document.getElementById('css-resizer'),

                                        "js": document.getElementById('js-resizer')

                                    },

                                    "iframe": {

                                        "code": {

                                            "elem": document.getElementById("code-frame")

                                        }

                                    }

                                };

                                window.cm = {};
                                cm.html = CodeMirror(component.querySelector('#code-html'), {

                                    lineNumbers: true,

                                    lineWrapping: true,

                                    htmlMode: true,

                                    mode: 'xml',

                                    styleActiveLine: true,

                                    theme: 'abcdef',

                                    matchBrackets: true

                                });

                                cm.html.on("change", (change)=>{

                                    upd();

                                }
                                );

                                cm.css = CodeMirror(component.querySelector('#code-css'), {

                                    lineNumbers: true,

                                    lineWrapping: true,

                                    mode: 'css',

                                    styleActiveLine: true,

                                    theme: 'abcdef',

                                    matchBrackets: true

                                });

                                cm.css.on("change", (change)=>{

                                    upd();

                                }
                                );

                                cm.js = CodeMirror(component.querySelector('#code-js'), {

                                    lineNumbers: true,

                                    lineWrapping: true,

                                    mode: 'javascript',

                                    styleActiveLine: true,

                                    theme: 'abcdef',

                                    matchBrackets: true

                                });

                                cm.js.on("change", (change)=>{

                                    upd();

                                }
                                );

                                var file = paths[paths.length - 1];
                                var owner = paths[0];
                                var repo = paths[1];
                                var path = uri.split('/').filter(o=>o.length > 0).splice(4);
                                path.pop();
                                path = path.join('/');
                                console.log(143, path, file);
                                ["html", "css", "js"].forEach(async(ext)=>{
                                    try {
                                        var json = await github.repos.contents(owner, repo, path + "/" + file.split('.')[0] + "." + ext);
                                        var content = atob(json.content);
                                        cm[ext].setValue(content);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }
                                );

                            } else {
                                status = 400;
                                e = {
                                    code: status,
                                    message: "This page does not exist"
                                }
                            }
                        } else if (paths[2] === "tree") {
                            component.querySelector('.explorer-section').innerHTML = "";
                            var path = uri.split('/').filter(o=>o.length > 0).splice(4).join('/');
                            console.log("routes.view repository", {
                                path
                            });
                            var contents = await github.repos.contents(sub, paths[1], path);
                            var explorer = component.querySelector('.explorer-section');
                            explorer.innerHTML = "";
                            var html = await request("/raw/asset/html/explorer.repo.html");
                            explorer.innerHTML = html;
                            var feed = explorer.querySelector('.section-repositories > section');
                            var template = feed.nextElementSibling.content.firstElementChild;
                            function compare(a, b) {
                                return a.type.localeCompare(b.type) || b.name - a.name;
                            }
                            contents.sort(compare).forEach((content,index)=>{
                                var el = template.cloneNode(true);
                                var icon = null;
                                var href = null;
                                if (content.type === "file") {
                                    href = '/' + sub + '/' + paths[1] + '/blob/main/' + path + '/' + content.name;
                                    icon = "/raw/asset/png/file-repository.png";
                                } else if (content.type === "dir") {
                                    href = '/' + sub + '/' + paths[1] + '/tree/main/' + path + '/' + content.name;
                                    icon = "/raw/asset/png/folder-repository.png";
                                }
                                console.log({
                                    href,
                                    icon,
                                    content
                                });
                                href ? el.setAttribute('href', href) : null;
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
                        component.querySelector('.explorer-section').innerHTML = "";
                        var path = uri.split('/').splice(3).join('/');
                        console.log(82, path, uri.split('/').splice(3));
                        var contents = await github.repos.contents(sub, paths[1], path);
                        var explorer = component.querySelector('.explorer-section');
                        explorer.innerHTML = "";
                        var html = await request("/raw/asset/html/explorer.repo.html");
                        explorer.innerHTML = html;
                        var feed = explorer.querySelector('.section-repositories > section');
                        var template = feed.nextElementSibling.content.firstElementChild;
                        function compare(a, b) {
                            return a.type.localeCompare(b.type) || b.name - a.name;
                        }
                        contents.sort(compare).forEach((content)=>{
                            console.log(84, path, content.name, '/' + sub + '/' + paths[1] + '/blob/main/' + path);
                            var el = template.cloneNode(true);
                            var icon = null;
                            var href = null;
                            if (content.type === "file") {
                                href = '/' + sub + '/' + paths[1] + '/blob/main/' + path + content.name;
                                icon = "/raw/asset/png/file-repository.png";
                            } else if (content.type === "dir") {
                                href = '/' + sub + '/' + paths[1] + '/tree/main/' + path + content.name;
                                icon = "/raw/asset/png/folder-repository.png";
                            }
                            el.setAttribute('href', href);
                            icon ? el.querySelector('.folder-image img').src = icon : null;
                            el.querySelector('.folder-name').textContent = content.name;
                            feed.insertAdjacentHTML('beforeend', el.outerHTML)
                        }
                        );
                        console.log('users.repos', repos);

                    }
                } else {
                    console.log("routes.view user");
                    component.querySelector('.explorer-section').innerHTML = "";
                    var repos = await github.users.repos(sub);
                    var explorer = component.querySelector('.explorer-section');
                    explorer.innerHTML = "";
                    var html = await request("/raw/asset/html/explorer.user.html");
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
            var html = await request("/raw/asset/html/explorer.home.html");
            explorer.innerHTML = html;
            console.log("routes.view home");
        }

        console.log(135, uri);
        status === 200 ? resolve(uri) : reject(e);
    }
}
