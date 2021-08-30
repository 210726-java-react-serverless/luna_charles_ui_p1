import { ViewComponent } from "../view.component.js";
import env from '../../util/env.js';
import state from '../../util/state.js';

StudentDashboard.prototype = new ViewComponent('studentdashboard')
// this component holds logic for the student dashboard, including CRUD operations students can perform
function StudentDashboard() {

    // declare variables used to access elements in the DOM
    let studentEmailElement;
    let infoButtonElement;
    let courseButtonElement;
    let registerFormButtonElement;
    let unregisterFormButtonElement;
    let infoContainerElement;
    let errorMessageElement;
    let registerButtonElement;
    let registerFieldElement;

    // declare a variable to store course number input for register/unregister
    let number = '';

    // shows a welcome message
    function showWelcome() {
        studentEmailElement.innerText = `${state.authUser.email}`
    }

    // updates the information shown to the user from the API
    function updateInfo(info) {
        // add the provided HTML into the info container and unhide it if theinfo is truthy
        if (info) {
            infoContainerElement.removeAttribute('hidden');
            infoContainerElement.innerHTML = '';
            infoContainerElement.innerHTML = info;
        // if info isn't truthy (generally '') then hide the container and reset its innerHTML
        } else {
            infoContainerElement.setAttribute('hidden', 'true');
            infoContainerElement.innerHTML = '';
        }
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

    // this function shows the student's info, including their name, email, and courses they're registered for
    async function showInfo() {
        // hide unnecessary elements
        updateErrorMessage('');
        hideRegisterForm();
        try {
            // GET request to /student endpoint of the API with Authorization header
            let resp = await fetch(`${env.apiUrl}/student`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.authUser.token}`
                }
            });

            let queryResult = await resp.json();

            // start of HTML to be added to the page, includes the Student's personal info and some table setup
            let newHtml = `
            <br>
            <h3>User Info</h3>
            <p>name: ${queryResult[0].firstName} ${queryResult[0].lastName}</p>
            <p>email: ${queryResult[0].email}</p>
            <h3>Registered Courses</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Professor</th>
                    </tr>
                </thead>
                <tbody>`

                // add each course in the response as a row in the table
                for (let i = 1; i < queryResult.length; i++) {
                    newHtml += `
                        <tr>
                            <th>${i}</h>
                            <td>${queryResult[i].number}</td>
                            <td>${queryResult[i].name}</td>
                            <td>${queryResult[i].description}</td>
                            <td>${queryResult[i].professor}</td>
                        </tr>`
                }

                newHtml += `
                </tbody>
                </table>`

            // feed the new HTML generated into updateInfo
            updateInfo(newHtml);
        } catch (error) {
            console.error(error);
        }
    }

    // this function displays the full list of courses
    async function showCourses() {
        // reset unnecessary elements
        updateErrorMessage('');
        hideRegisterForm();
        try {
            // GET request to /registration endpoint of the API, including Authorization header
            let resp = await fetch(`${env.apiUrl}/registration`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.authUser.token}`
                }
            });

            let courses = await resp.json();

            // set up the Course List table
            let newHtml = `
            <br>
            <h3>Course List</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Number</th>
                        <th scope="col">Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Professor</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Registered</th>
                    </tr>
                </thead>
                <tbody>`;

            // loop over the array returned by the fetch request
            for (let i = 0; i < courses.length; i++) {
                // add a row with a non-zero number of students registered
                if (courses[i].students) {
                    newHtml += `
                        <tr>
                            <th>${i+1}</th>
                            <td>${courses[i].number}</td>
                            <td>${courses[i].name}</td>
                            <td>${courses[i].description}</td>
                            <td>${courses[i].professor}</td>
                            <td>${courses[i].capacity}</td>
                            <td>${courses[i].students.length}</td>
                        </tr>`
                // add a row with 0 students registered if the students field in this array element is falsy
                } else {
                    newHtml += `
                        <tr>
                            <th>${i+1}</th>
                            <td>${courses[i].number}</td>
                            <td>${courses[i].name}</td>
                            <td>${courses[i].description}</td>
                            <td>${courses[i].professor}</td>
                            <td>${courses[i].capacity}</td>
                            <td>0</td>
                        </tr>`
                }
            }

            newHtml += `
            </tbody>
            </table>`

            // feed the new HTML generated into updateInfo
            updateInfo(newHtml);
        } catch(e) {
            console.error(e);
        }
    }

    // this function shows the register form, allowing the user to enter a course number and click 'Register'
    function showRegisterForm() {
        // reset the input field
        registerFieldElement.value = '';
        updateErrorMessage('');
        updateInfo('');
        document.getElementById('show-form-container').removeAttribute('hidden');
        document.getElementById('student-course-registration-button').innerText = 'Register';
    }

    // this function shows the unregister form, allowing the user to enter a course number and click 'Unregister'
    function showUnregisterForm() {
        // reset the input field
        registerFieldElement.value = '';
        updateErrorMessage('');
        updateInfo('');
        document.getElementById('show-form-container').removeAttribute('hidden');
        document.getElementById('student-course-registration-button').innerText = 'Unregister'
    }

    // updates the number variable as the user types into the Course Number input field
    function updateNumber(e) {
        number = e.target.value;
    }

    // hides the register/unregister form
    function hideRegisterForm() {
        document.getElementById('show-form-container').setAttribute('hidden', 'true');
    }

    // this functions registers or unregisters the student for a course, showing them their info (including registered courses) upon success
    async function register() {
        // let student know that they must provide a number
        if (!number) {
            updateErrorMessage('You must provide a course number');
            return;
        }
        try {
            let reqBody;
            // checks the text on the registration button and sets up a request body accordingly
            if (document.getElementById('student-course-registration-button').innerText === 'Register') {
                reqBody = {
                    action: 'Register',
                    courseNumber: `${number}`
                }
            } else {
                reqBody = {
                    action: 'Unregister',
                    courseNumber: `${number}`
                }
            }
            // PUT request to /registration endpoint of API
            let resp = await fetch(`${env.apiUrl}/registration`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.authUser.token}`
                },
                body: JSON.stringify(reqBody)
            });
            // the API responds with a 404 status if a course with that number wasn't found
            if (resp.status === 404) {
                updateErrorMessage('The course number you provided is not valid');
                return;
            }
            // show the student their info, included registered courses, upon success
            showInfo();
        } catch (e) {
            console.error(e);
        }
    }

    this.render = function() {
        StudentDashboard.prototype.injectTemplate(() => {
            // get the field elements and assign them to appropriate variables
            studentEmailElement = document.getElementById('profile-email')
            infoButtonElement = document.getElementById('student-info-button');
            courseButtonElement = document.getElementById('student-course-button');
            registerFormButtonElement = document.getElementById('student-register-button');
            unregisterFormButtonElement = document.getElementById('student-unregister-button');
            infoContainerElement = document.getElementById('show-info-container');
            registerButtonElement = document.getElementById('student-course-registration-button');
            registerFieldElement = document.getElementById('student-course-number')
            errorMessageElement = document.getElementById('error-msg');
            // show the welcome message with personal email
            showWelcome();
            // show the student their info upon login
            showInfo();
            // add event listeners to track user input and respond to it
            infoButtonElement.addEventListener('click', showInfo);
            courseButtonElement.addEventListener('click', showCourses);
            registerFormButtonElement.addEventListener('click', showRegisterForm);
            registerButtonElement.addEventListener('click', register);
            registerFieldElement.addEventListener('keyup',updateNumber);
            unregisterFormButtonElement.addEventListener('click', showUnregisterForm);
        });
        StudentDashboard.prototype.injectStylesheet();
    }
}

export default new StudentDashboard();