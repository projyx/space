function request(resource, options) {
    return new Promise(async function(resolve, reject) {
        await fetch(resource, options).then(async(response)=>{
            if (!response.ok) {
                return response.text().then(text=>{
                    var text = JSON.stringify({
                        code: response.status,
                        message: JSON.parse(text)
                    });
                    throw new Error(text);
                }
                )
            }
            return response.text();
        }
        ).then(response=>{
            try {
                response = JSON.parse(response);
                resolve(response);
            } catch (err) {
                resolve(response);
            }
        }
        ).catch(error=>{
            console.log("function_get 404 ERROR", error);
            reject(error);
        }
        )
    }
    );
}

function getBlobURL(code, type) {

    const blob = new Blob([code],{
        type
    });

    return URL.createObjectURL(blob);

}

function getPageURL(html, css, js) {

    const cssURL = getBlobURL(css, 'text/css');

    const jsURL = getBlobURL(js, 'text/javascript');

    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.documentElement;
    const head = body.querySelector("head");
    const styles = head.querySelectorAll("link");
    const scripts = head.querySelectorAll("script")

    var paths = window.location.pathname.split("/").filter(n=>n.length > 0);
    const owner = paths[0];
    const repo = paths[1];

    console.log({
        owner,
        repo
    });

    var l = [];
    Array.from(styles).forEach(async(link)=>{
        var uri = new URL(link.href);
        var path = uri.pathname;
        var json = await github.repos.contents(owner, repo, path);
        var text = atob(json.content);
        var blob = getBlobURL(text, 'text/javascript');
        var elem = `<link rel="stylesheet" type="text/css" href="${blob}" />`
        //console.log(path, {json,text,blob});
        l.push(elem)
    }
    )

    0 < 1 ? console.log(95, body, {
        styles,
        l
    }) : null;

    var s = [];
    Array.from(scripts).forEach(async(script)=>{
        var uri = new URL(script.src);
        var path = uri.pathname;
        var json = await github.repos.contents(owner, repo, path);
        var text = atob(json.content);
        var blob = getBlobURL(text, 'text/javascript');
        var elem = `<script src="${jsURL}">${atob('PC9zY3JpcHQ+')}`;
        //console.log(path, {json,text,blob});
        s.push(elem)
    }
    )

    0 < 1 ? console.log(112, body, {
        scripts,
        s
    }) : null;

    const src = `

    <html>

      <head>

        ${l && l.join(" ")}

        ${s && s.join(" ")}

      </head>

      <body>

        ${html || ''}

      </body>

    </html>

  `;

    console.log(120, {
        l,
        s,
        src
    })

    return getBlobURL(src, 'text/html');

}

async function pvw() {

    const html = dom.iframe.code.doc = window.cm.html.getValue();
    const css = dom.iframe.code.doc = window.cm.css.getValue();
    const js = dom.iframe.code.doc = window.cm.js.getValue();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const head = doc.head;
    const body = doc.body;
    const styles = head.querySelectorAll("link");
    const scripts = head.querySelectorAll("script")

    dom.iframe.code.head = head;
    dom.iframe.code.body = body;

    var paths = window.location.pathname.split("/").filter(n=>n.length > 0);
    const owner = paths[0];
    const repo = paths[1];

    0 > 1 ? console.log(149, {
        html,
        head,
        body,
    }, {
        styles,
        scripts
    }, {
        owner,
        repo
    }) : null;

    var l = [];
    if (styles.length > 0) {
        var i = 0;
        do {
            var link = styles[i];
            console.log(i, link, styles);
            var uri = new URL(link.href);
            var path = uri.pathname;
            var json = await github.repos.contents(owner, repo, path);
            var text = atob(json.content);
            var blob = getBlobURL(text, 'text/javascript');
            var elem = `<link rel="stylesheet" type="text/css" href="${blob}" />`
            //console.log(path, {json,text,blob});
            l.push(elem)
            //console.log(164, l);
            i++;
        } while (i < styles.length);
    }

    0 > 1 ? console.log(95, body, {
        styles,
        l
    }) : null;

    var s = [];
    if (scripts.length > 0) {
        var i = 0;
        do {
            var script = scripts[i];
            if(script.src.startsWith("http")) {
            var uri = new URL(script.src);
            var path = uri.pathname;
            var json = await github.repos.contents(owner, repo, path);
            var text = atob(json.content);
            var blob = getBlobURL(text, 'text/javascript');
            var elem = `<script src="${blob}">${atob('PC9zY3JpcHQ+')}`;
            } else {
            var elem = `<script src="${script.src}"></script>`;                
            }
            //console.log(path, {json,text,blob});
            s.push(elem);
            //console.log(182, s);
            i++;
        } while (i < scripts.length);
    }

    0 > 1 ? console.log(112, body, {
        scripts,
        s
    }) : null;

    const htmlHead = (l && l.join(" ")) + (s && s.join(" "));
    const htmlBody = body.querySelector('body');
    const src = `

    <html>

      <head>

        ${l.join(" ")}

        ${s.join(" ")}

        <style>${css}</style>

        <script>${js}</script>

      </head>

      <body>

        ${body.innerHTML}

      </body>

    </html>

  `;

    0 > 1 ? console.log(211, dom.iframe.code, dom.iframe.code.head, {
        html,
        src,
        head,
        l,
        s,
        htmlHead: l.join(" "),
        htmlBody: l.join(" "),
    }) : null;

    //dom.iframe.code.head.innerHTML = '<style id="style"></style>';
    //dom.iframe.code.head.innerHTML = head;

    //dom.iframe.code.style = dom.iframe.code.head.querySelector('style');

    //dom.iframe.code.body = document.getElementById("code-frame").contentDocument.querySelector('body');

    dom.iframe.code.elem.src = getBlobURL(src, 'text/html');

}

function upd() {

    pvw();

    var html = cm.html.getValue();

    var css = cm.css.getValue();

    var js = cm.js.getValue();

    //var page = getPageURL(html, css, js);
    //console.log(153, page);

    //dom.iframe.code.style.textContent = css;

    //dom.iframe.code.elem.src = page;

}
