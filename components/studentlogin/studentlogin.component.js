import { ViewComponent } from "../view.component.js";
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

StudentLoginComponent.prototype = new ViewComponent('studentlogin');
// this component holds logic for the student login
function StudentLoginComponent() {

    // declare variables used to access elements in the DOM
    let emailFieldElement;
    let passwordFieldElement;
    let loginButtonElement;
    let errorMessageElement;

    // declare variables used to store user input
    let email = '';
    let password = '';

    // updates the email variable as user input changes
    function updateEmail(e) {
        email = e.target.value;
    }

    // updates the password variable as user input changes
    function updatePassword(e) {
        password = e.target.value;
    }

    // shows the error message element and updates its message when provided a non-empty string
    // when the provided string is empty, the error message is hidden
    function updateErrorMessage(errorMessage){
        if(errorMessage){
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden', 'true');
            errorMessageElement.innerText = '';
        }
    }

    // this function logs in the student, passing them through to the dashboard if successful
    async function login() {
        // update the error message if an email and/or password aren't provided
        if(!email || !password){
            updateErrorMessage('You need to provide an email and a password');
            return;
        } else {
            updateErrorMessage('');
        }
    
        let credentials = {
            email: email,
            password: password
        };

        try{
            // POST request to /authstudent endpoint of API with the student's credentials in the body
            let resp = await fetch(`${env.apiUrl}/authstudent`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });
            // get the user's token (because cookies don't like us apparently)
            let token = resp.headers.get('Authorization');

            let user = await resp.json();
            // API will send back a 401 status if the student provides the incorrect credentials
            if(resp.status === 401) {
                updateErrorMessage(user.message);
                return;
            }
            // save the token to the user
            if(user && token){
                user.token = token;
            }
            // the user, including their token, is stored in authUser to be accessed later
            state.authUser = user;

            router.navigate('/studentdashboard');

        } catch (error) {
            console.error(error);
        }
    }

    this.render = function() {
        StudentLoginComponent.prototype.injectTemplate(() => {
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
        StudentLoginComponent.prototype.injectStylesheet();
    }

}


export default new StudentLoginComponent();