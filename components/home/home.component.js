import { ViewComponent } from "../view.component.js";



homeComponent.prototype = new ViewComponent('home')
// basic javascript for the home component
function homeComponent() {


    this.render = function() {
        // render contains necessary functions
        homeComponent.prototype.injectTemplate(() => {});

        homeComponent.prototype.injectStylesheet();
    }

}

export default new homeComponent();