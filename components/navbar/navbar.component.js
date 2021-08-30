import router from '../../app.js';
import state from '../../util/state.js';

const NAVBAR_ELEMENT = document.getElementById('navbar');
// logic for the navbar lives here
function navbarComponent() {

    // declare variable to put HTML template in
    let templateHolder = '';
    // a fragment that will be reference multiple times later
    let frag = 'components/navbar/navbar.component';

    // instructions for getting the template onto the page
    function injectTemplate(callback) {
        // if there's a template in templateHolder then set the innerHTML to that
        if (templateHolder) {
            NAVBAR_ELEMENT.innerHTML = templateHolder;
        // if there isn't a template, grab the appropriate one and use that
        } else {
            fetch(`${frag}.html`)
                .then(resp => resp.text())
                .then(html => {
                    templateHolder = html;
                    NAVBAR_ELEMENT.innerHTML = templateHolder;
                    callback();
                })
                .catch(err => console.error(err));
        }
    }

    // set up dynamic css
    function injectStyleSheet() {
        let dynamicStyle = document.getElementById('nav-css')
        if (dynamicStyle) dynamicStyle.remove();
        dynamicStyle = document.createElement('link');
        dynamicStyle.id = 'nav-css';
        dynamicStyle.rel = 'stylesheet';
        dynamicStyle.href = `${frag}.css`;
        document.head.appendChild(dynamicStyle);
    }
    
    // uses the router to navigate between pages from the navbar
    function navigateToView(e) {
        router.navigate(e.target.dataset.route);
    }

    // navigates to the student dashboard after checking that a student is logged in
    function navigateToStudentView(e) {
        if (state.authUser.role === 'student') {
            router.navigate(e.target.dataset.route);
        }
    }

    // navigates to the faculty dashboard after checking that a faculty is logged in
    function navigateToFacultyView(e) {
        if (state.authUser.role === 'faculty') {
            router.navigate(e.target.dataset.route);
        }
    }

    // sets the authUser to an empty object and navigates them to the home page
    function logout() {
        state.authUser = {};
        router.navigate('/home');
    }

    this.render = function() {
        injectStyleSheet();
        injectTemplate(() => {
            // add event listeners to the appropriate documents (i.e. 'click home: go to /home')
            document.getElementById('home').addEventListener('click', navigateToView)
            document.getElementById('signup').addEventListener('click', navigateToView)
            document.getElementById('logout').addEventListener('click', logout);
            document.getElementById('nav-to-student-login').addEventListener('click', navigateToView);
            document.getElementById('nav-to-student-dashboard').addEventListener('click', navigateToStudentView);
            document.getElementById('nav-to-faculty-login').addEventListener('click', navigateToView);
            document.getElementById('nav-to-faculty-dashboard').addEventListener('click', navigateToFacultyView);
        })
    }
}

export default new navbarComponent;