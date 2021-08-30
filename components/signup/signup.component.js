import { ViewComponent } from "../view.component.js";
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from '../../app.js';

SignupComponent.prototype = new ViewComponent('signup');
// this component holds logic for registering a new student account
function SignupComponent() {
    
    // declare variables used to access elements in the DOM
    let firstnameFieldElement;
    let lastnameFieldElement;
    let emailFieldElement;
    let passwordFieldElement;
    let passwordConfirmFieldElement;
    let signupButtonElement;
    let errorMessageElement;

    // declare variables used to store user input
    let firstname = '';
    let lastname = '';
    let email = '';
    let password = '';
    let passwordConfirm = '';

    // updates firstname variable as user input changes
    function updateFirstname(e) {
        firstname = e.target.value;
    }

    // updates lastname variable as user input changes
    function updateLastname(e) {
        lastname = e.target.value;
    }

    // updates email variable as user input changes
    function updateEmail(e) {
        email = e.target.value;
    }

    // updates password variables as user input changes
    function updatePassword(e) {
        password = e.target.value;
    }

    // updates passwordConfirm as user input changes
    function updatePasswordConfirm(e) {
        passwordConfirm = e.target.value;
    }

    // shows the error message element and updates its message when provided a non-empty string
    // when the provided string is empty, the error message is hidden
    function updateErrorMessage(errorMessage) {
        if (errorMessage) {
            errorMessageElement.removeAttribute('hidden');
            errorMessageElement.innerText = errorMessage;
        } else {
            errorMessageElement.setAttribute('hidden','true');
            errorMessageElement.innerText = '';
        }
    }

    // this function registers a new student account and sends them to /studentlogin upon success
    function signup(e) {
        // because <form>
        e.preventDefault();
        // lets user know if they don't provide the necessary input
        if (!firstname || !lastname || !email || !password || !passwordConfirm) {
            updateErrorMessage('You need to provide information in all fields');
            return;
        // lets the user know if their password inputs don't match
        } else if (!(password === passwordConfirm)) {
            updateErrorMessage('Password and Confirm password must be the same');
            return;
        }

        let info = {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password
        };

        let status = 0;
        // POST request to /student endpoint of API
        fetch(`${env.apiUrl}/student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(resp => {
                status = resp.status;
                return resp.json();
            }).then(payload => {
                // API sends a 400 status if the user sends invalid information
                if (status === 400) {
                    updateErrorMessage(payload.message);
                // API sends a 409 status if the user's info can't be saved to the database
                } else if (status === 409) {
                    updateErrorMessage(payload.message);
                // a 500 status is sent if an unexpected error occurs
                } else if (status === 500) {
                    updateErrorMessage('Server error occured, could not register new user');
                } else {
                    router.navigate('/studentlogin');
                }
            }).catch(err => console.error(err));
    }

    this.render = function() {
        SignupComponent.prototype.injectTemplate(() => {
            // get the field elements, store them to appropriate variables
            firstnameFieldElement = document.getElementById('signup-form-firstname');
            lastnameFieldElement = document.getElementById('signup-form-lastname');
            emailFieldElement = document.getElementById('signup-form-email');
            passwordFieldElement = document.getElementById('signup-form-password');
            passwordConfirmFieldElement = document.getElementById('signup-form-password-confirm');
            signupButtonElement = document.getElementById('signup-form-button');
            errorMessageElement = document.getElementById('error-msg');
            // add event listeners to track user input and respond to it
            firstnameFieldElement.addEventListener('keyup', updateFirstname);
            lastnameFieldElement.addEventListener('keyup', updateLastname);
            emailFieldElement.addEventListener('keyup', updateEmail);
            passwordFieldElement.addEventListener('keyup', updatePassword);
            passwordConfirmFieldElement.addEventListener('keyup', updatePasswordConfirm);
            signupButtonElement.addEventListener('click', signup);
        });

        SignupComponent.prototype.injectStylesheet();
    }
}

export default new SignupComponent();