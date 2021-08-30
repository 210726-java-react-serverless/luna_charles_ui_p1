import { ViewComponent } from "../view.component.js";
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

FacultyLoginComponent.prototype = new ViewComponent('facultylogin');
// this component holds logic for logging in a faculty user
function FacultyLoginComponent() {

    // declare variables used to access elements in the DOM
    let emailFieldElement;
    let passwordFieldElement;
    let loginButtonElement;
    let errorMessageElement;

    // declare variables used to store user info
    let email = '';
    let password = '';

    // updates email variable as user input changes
    function updateEmail(e) {
        email = e.target.value;
    }

    // updates password as user input changes
    function updatePassword(e) {
        password = e.target.value;
    }

    // shows the error message element and updates its message when provided a non-empty string
    // when the provided string is empty, the error message is hidden
    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }

    // this function logs in the faculty, sending them to /facultydashboard upon success
    async function login() {
        // update error message if email and/or password aren't provided
        if(!email || !password) {
            updateErrorMessage('You need to provide an email and a password');
            return;
        } else{
            updateErrorMessage('');
        }

        let credentials = {
            email: email,
            password: password
        };

        try {
            // POST request to /authfaculty endpoint of API with faculty's credentials in the body
            let resp = await fetch(`${env.apiUrl}/authfaculty`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
          });
          // get the user's token (because cookies don't like us, apparently)
          let token = resp.headers.get('Authorization');

          let user = await resp.json();
          // API will send back a 401 status if the user provides incorrect credentials
          if (resp.status === 401) {
              updateErrorMessage(user.message);
              return;
          }
          // save the token to the user
          if (user&&token) {
              user.token = token
          }
          // the user, including their token, is stored in the state to be referenced later
          state.authUser = user;

          router.navigate('/facultydashboard')
        } catch (error) {
            console.error(error);
        }
    }
    this.render = function() {
        FacultyLoginComponent.prototype.injectTemplate(() => {
            // get the field elements, store them in appropriate variables
            emailFieldElement = document.getElementById('login-form-email');
            passwordFieldElement = document.getElementById('login-form-password');
            loginButtonElement = document.getElementById('login-form-button');
            errorMessageElement = document.getElementById('error-msg');
            // add event listeners to track user input and respond to it
            emailFieldElement.addEventListener('keyup', updateEmail);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            loginButtonElement.addEventListener('click', login);
        });
        FacultyLoginComponent.prototype.injectStylesheet();
    }
}

export default new FacultyLoginComponent();