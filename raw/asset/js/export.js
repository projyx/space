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

    const source = `

    <html>

      <head>

        ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}

        ${js && `<script src="${jsURL}">${atob('PC9zY3JpcHQ+')}`}

      </head>

      <body>

        ${html || ''}

      </body>

    </html>

  `;

    return getBlobURL(source, 'text/html');

}

function pvw() {
    
    dom.iframe.code.doc = document.getElementById("code-frame").contentDocument;

    dom.iframe.code.head = document.getElementById("code-frame").contentDocument.querySelector('head');

    dom.iframe.code.head.innerHTML = '<style id="style"></style>';

    dom.iframe.code.style = dom.iframe.code.head.querySelector('style');

    dom.iframe.code.body = document.getElementById("code-frame").contentDocument.querySelector('body');

}

function upd() {

    pvw();

    var html = cm.html.getValue();

    var css = cm.css.getValue();

    var js = cm.js.getValue();

    var page = getPageURL(html, css, js);

    dom.iframe.code.style.textContent = css;

    dom.iframe.code.elem.src = page;

}
