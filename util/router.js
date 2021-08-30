export function Router(routes) {
    // renders a component depending on the path it is given. logs an error to the console if a component isn't found for the given route
    this.navigate = function(routePath) {
        let nextRoute = routes.filter(route => route.path === routePath).pop();
        if (nextRoute) {
            nextRoute.component.render();
        } else {
            console.error(`No component found for route: ${routePath}`);
        }
    }
}