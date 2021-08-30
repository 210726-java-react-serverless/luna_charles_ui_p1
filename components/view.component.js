import env from '../util/env.js'

// ViewComponent is the prototype of our other components and defines methods used when rendering
export function ViewComponent(viewName) {

    let templateHolder = '';
    let frag = `components/${viewName}/${viewName}.component`;

    this.viewMetadata = {
        name: viewName,
        url: `/${viewName}`,
        templateUri: `${frag}.html`,
        stylesheetUri: `${frag}.css`,
    };

    // called in render() method of other components, injects the appropriate html template into the DOM
    this.injectTemplate = function (cb) {
        if (templateHolder) {
            env.rootDiv.innerHTML = templateHolder;
            cb();
        } else {
            fetch(this.viewMetadata.templateUri)
                .then(resp => resp.text())
                .then(html => {
                    templateHolder = html;
                    env.rootDiv.innerHTML = templateHolder;
                    cb();
                })
                .catch(err => console.error(err));
        }
    }

    // similar to injectTemplate(), allows for dynamic css
    this.injectStylesheet = function() {
        let stylesheet = document.getElementById('dynamic-css');
        if (stylesheet) stylesheet.remove();
        stylesheet = document.createElement('link');
        stylesheet.id = 'dynamic-css'
        stylesheet.rel = 'stylesheet';
        stylesheet.href = this.viewMetadata.stylesheetUri;
        document.head.appendChild(stylesheet);
    }

}