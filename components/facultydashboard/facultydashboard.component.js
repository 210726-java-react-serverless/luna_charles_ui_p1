import { ViewComponent } from "../view.component.js";
import env from '../../util/env.js';
import state from '../../util/state.js';
import router from "../../app.js";

FacultyDashboard.prototype = new ViewComponent('facultydashboard')
function FacultyDashboard() {

    //declaring variables for button elements in the DOM
    let viewCoursesButtonElement;
    let addCourseButtonElement;
    let editCourseButtonElement;
    let removeCourseButtonElement;

    //declaring variable for the course container element in the DOM
    let coursesContainerElement;

    //declaring variables for elements in the DOM related to the Add Course form
    let addCourseFormElement;
    let addCourseNumberFieldElement;
    let addCourseTitleFieldElement;
    let addCourseDescriptionFieldElement;
    let addCourseCapacityFieldElement;
    let addSubmitCourseButtonElement;
    let addCourseErrorMessageElement;
    let addCourseNumber = '';
    let addCourseTitle = '';
    let addCourseDescription = '';
    let addCourseCapacity = '';

    //declaring variables for elements in the DOM related to the Remove Course form
    let removeCourseFormElement;
    let removeCourseNumberFieldElement;
    let removeCourseFormButtonElement;
    let removeCourseErrorMessageElement;
    let removeCourseNumber = '';

    //declaring variables for elements in the DOM related to the Update Course form
    let editCourseFormElement;
    let editCourseNumberElement;
    let editCourseFieldElement;
    let editCourseValueElement;
    let editCourseFormButtonElement;
    let editCourseErrorMessageElement;
    let editCourseNumber = '';
    let editCourseField = '';
    let editCourseValue = '';

    //declaring variable for holding the list of taught courses at the global scope
    //necessary for displaying options in the dropdown menus in the Remove Course and Update Course forms
    let query = '';

    //declaring variable for element in the DOM for displaying email address on dashboard
    let profileEmailElement = '';

    //clears input fields
    function clearInputs() {
        addCourseNumberFieldElement.value = '';
        addCourseTitleFieldElement.value = '';
        addCourseDescriptionFieldElement.value = '';
        addCourseCapacityFieldElement.value = '';
        editCourseValueElement.value = '';
    }

    //function for updating the Course Number in the Add Course form
    function updateAddCourseNumber(e){
        addCourseNumber = e.target.value;
    }

    //function for updating the Course Name in the Add Course form
    function updateAddCourseTitle(e){
        addCourseTitle = e.target.value;
    }

    //function for updating the Course Description in the Add Course form
    function updateAddCourseDescription(e){
        addCourseDescription = e.target.value;
    }

    //function for updating the Course Capacity in the Add Course form
    function updateAddCourseCapacity(e){
        addCourseCapacity = e.target.value;
    }

    //function for updating the Course Number in the Edit Course form
    function updateEditCourseNumber(e){
        editCourseNumber = e.target.value;
    }

    //function for updating the Course Field in the Edit Course form
    function updateEditCourseField(e){
        editCourseField = e.target.value;
    }

    //function for updating the Course's new value in the Edit Course form
    function updateEditCourseValue(e){
        editCourseValue = e.target.value;
    }

    //function for updating the Course Number in the Remove Course form
    function updateRemoveCourseNumber(e){
        removeCourseNumber = e.target.value;
    }

    //function for updating/displaying the error message on the Add Course form
    function updateAddCourseErrorMessage(errorMessage){
        if(errorMessage){
            addCourseErrorMessageElement.removeAttribute('hidden');
            addCourseErrorMessageElement.innerText = errorMessage;
        } else {
            addCourseErrorMessageElement.setAttribute('hidden', 'true');
            addCourseErrorMessageElement.innerText = '';
        }
    }

    //function for updating/displaying the error message on the Remove Course form
    function updateRemoveCourseErrorMessage(errorMessage){
        if(errorMessage){
            removeCourseErrorMessageElement.removeAttribute('hidden');
            removeCourseErrorMessageElement.innerText = errorMessage;
        } else {
            removeCourseErrorMessageElement.setAttribute('hidden', 'true');
            removeCourseErrorMessageElement.innerText = '';
        }
    }

    //function for updating/displaying the error message on the Edit Course form
    function updateEditCourseErrorMessage(errorMessage){
        if(errorMessage){
            editCourseErrorMessageElement.removeAttribute('hidden');
            editCourseErrorMessageElement.innerText = errorMessage;
        } else {
            editCourseErrorMessageElement.setAttribute('hidden', 'true');
            editCourseErrorMessageElement.innerText = '';
        }
    }

    //helper function for populating/updating the Taught Courses table with relevant data.
    function updateTaughtCoursesInfo(info) {
        if (info) {
            coursesContainerElement.removeAttribute('hidden');
            coursesContainerElement.innerHTML = info;
        } else {
            coursesContainerElement.setAttribute('hidden', 'true');
            coursesContainerElement.innerHTML = '';
        }
    }

    //helper function for populating the Remove Course dropdown menu with existing courses.
    function updateRemoveCoursesInfo(info) {
        if(info){
            removeCourseNumberFieldElement.innerHTML = info;
        } else {
            coursesContainerElement.innerHTML = '';
        }
    }

    //helper function for populating the Edit Course dropdown menu with existing courses.
    function updateEditCoursesInfo(info) {
        if(info){
            editCourseNumberElement.innerHTML = info;
        } else {
            editCourseNumberElement.innerHTML = '';
        }
    }

    // function for displaying the user's profile data (i.e., email) on the page.
    function updateProfileData(info) {
        if(info){
            profileEmailElement.innerHTML = info;
        } else {
            editCourseButtonElement.innerHTML = '';
        }
    }

    //function for showing displaying relevant faculty info (taught courses, email)
    async function showTaughtCourses(){

        //update all of the button's colors upon clicking the view taught courses button
        viewCoursesButtonElement.setAttribute('class', 'btn btn-primary');
        addCourseButtonElement.setAttribute('class', 'btn btn-secondary');
        editCourseButtonElement.setAttribute('class', 'btn btn-secondary');
        removeCourseButtonElement.setAttribute('class', 'btn btn-secondary');

        //unhiding the courses container and hiding all non-relevant elements
        coursesContainerElement.removeAttribute('hidden');
        addCourseFormElement.setAttribute('hidden', 'true');
        editCourseFormElement.setAttribute('hidden', 'true');
        removeCourseFormElement.setAttribute('hidden', 'true');
        addCourseErrorMessageElement.setAttribute('hidden', 'true');
        editCourseErrorMessageElement.setAttribute('hidden', 'true');
        removeCourseErrorMessageElement.setAttribute('hidden', 'true');

        // GET request to /course endpoint of the API with Authorization header
        try{
            let resp = await fetch(`${env.apiUrl}/course`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${state.authUser.token}`
                }
            });

            //query result is an array of courses taught by the faculty member
            let queryResult = await resp.json();
            //store the queryResult in a globally scoped variable for use other functions (e.g., populating dropdown menus in Edit Course and Remove Course forms)
            query = queryResult;

            // start of HTML to be added to the page, includes taught courses
            let newHTML = `
           
                <h3>Your Courses</h3>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Number</th>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Capacity</th>
                            </tr>
                        </thead>
                        </tbody>`

                        // add each course in the response as a row in the table
                        for(let i = 0; i < queryResult.length; i++){
                            newHTML += `
                                <tr>
                                    <th>${i+1}</th>
                                    <td>${queryResult[i].number}</td>
                                    <td>${queryResult[i].name}</td>
                                    <td>${queryResult[i].description}</td>
                                    <td>${queryResult[i].capacity}</td>
                                </tr>
                                `
                        }

            newHTML += `
                        </tbody>
                    </table>
                    `

            // feed the new HTML generated into updateInfo
            updateTaughtCoursesInfo(newHTML);

            //reset new HTML to be the authorized user's email address
            newHTML = `${state.authUser.email}`

            //update profile with email
            updateProfileData(newHTML);

        } catch (error) {
            console.error(error);
        }
    }

    //function to display the Add Course form
    function showAddCourseForm(){

        clearInputs();

        //update all of the button's colors upon clicking the Add Course button
        viewCoursesButtonElement.setAttribute('class', 'btn btn-secondary');
        addCourseButtonElement.setAttribute('class', 'btn btn-primary');
        editCourseButtonElement.setAttribute('class', 'btn btn-secondary');
        removeCourseButtonElement.setAttribute('class', 'btn btn-secondary');

        //unhiding the Add Course form and hiding all non-relevant form elements
        addCourseFormElement.removeAttribute('hidden');
        editCourseFormElement.setAttribute('hidden', 'true');
        removeCourseFormElement.setAttribute('hidden', 'true');
        coursesContainerElement.setAttribute('hidden', 'true');

        //hiding all non-relevant error message elements
        addCourseErrorMessageElement.setAttribute('hidden', 'true');
        editCourseErrorMessageElement.setAttribute('hidden', 'true');
        removeCourseErrorMessageElement.setAttribute('hidden', 'true');

    }

    
    //function to display the Update Course form
    function showEditForm(){

        clearInputs();

        //declare newHTML; will be populated with elements from the taught courses array wrapped in options tags
        let newHTML = ``;

        for(let i = 0; i < query.length; i++){
            newHTML += `<option>${query[i].number}</option>`
        }
        
        //updating the Edit Course dropdown menu with existing courses
        updateEditCoursesInfo(newHTML);

        //update all of the button's colors upon clicking the Edit Course button
        viewCoursesButtonElement.setAttribute('class', 'btn btn-secondary');
        addCourseButtonElement.setAttribute('class', 'btn btn-secondary');
        editCourseButtonElement.setAttribute('class', 'btn btn-primary');
        removeCourseButtonElement.setAttribute('class', 'btn btn-secondary');

        //unhiding the Update Course form and hiding all non-relevant form elements
        editCourseFormElement.removeAttribute('hidden');
        addCourseFormElement.setAttribute('hidden', 'true');
        removeCourseFormElement.setAttribute('hidden', 'true');
        coursesContainerElement.setAttribute('hidden', 'true');

        //hiding all non-relevant error message elements
        addCourseErrorMessageElement.setAttribute('hidden', 'true');
        editCourseErrorMessageElement.setAttribute('hidden', 'true');
        removeCourseErrorMessageElement.setAttribute('hidden', 'true');

    }


    //function to display the Remove Course form
    function showRemoveCourseForm() {
        
        //declare newHTML; will be populated with elements from the taught courses array wrapped in options tags
        let newHTML = ``;

        for(let i = 0; i < query.length; i++){
            newHTML += `<option>${query[i].number}</option>`
        }

        //updating the Remove Course dropdown menu with existing course numbers
        updateRemoveCoursesInfo(newHTML);
        
        //update all of the button's colors upon clicking the Edit Course button
        viewCoursesButtonElement.setAttribute('class', 'btn btn-secondary');
        addCourseButtonElement.setAttribute('class', 'btn btn-secondary');
        editCourseButtonElement.setAttribute('class', 'btn btn-secondary');
        removeCourseButtonElement.setAttribute('class', 'btn btn-primary');

        //unhiding the Remove Course form and hiding all non-relevant form elements
        removeCourseFormElement.removeAttribute('hidden');
        addCourseFormElement.setAttribute('hidden', 'true');
        editCourseFormElement.setAttribute('hidden', 'true');
        coursesContainerElement.setAttribute('hidden', 'true');

        //hiding all non-relevant error message elements
        addCourseErrorMessageElement.setAttribute('hidden', 'true');
        editCourseErrorMessageElement.setAttribute('hidden', 'true');
        removeCourseErrorMessageElement.setAttribute('hidden', 'true');
    }
    
    //function called upon clicking the Add Course button upon completion of Add Course form
    function addCourse(){
        //ensure that all entered data is truthy
        if(!addCourseNumber || !addCourseTitle || !addCourseDescription || !addCourseCapacity){
            updateAddCourseErrorMessage('You must complete the form');
            return;
        }
        //ensure that capacity is a number
        if (isNaN(addCourseCapacity)) {
            updateAddCourseErrorMessage('The capacity of the course must be a number')
            return;
        }

        //creating info object with user-entered info about the new course
        let info = {
            number: addCourseNumber,
            name: addCourseTitle,
            description: addCourseDescription,
            professor: `${state.authUser.email}`,
            capacity: addCourseCapacity,
            students: []
        }

        //intializing status code to 0, will be updated with appropriate status code in fetch
        let status = 0;

        //POST request to /course endpoint, for persisting new course to database 
        fetch(`${env.apiUrl}/course`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.authUser.token}`
            },
            body: JSON.stringify(info)
        }).then(resp => {
            status = resp.status;
            return resp.json();
        }).then(payload => {
            if(status >= 400){
                updateAddCourseErrorMessage(payload.message);
            } else {
                showTaughtCourses();
            }
        }).catch(err => console.error(err));
        
    }

    //function called upon clicking the Update Course button upon completion of Change Course Details form
    function editCourse() {
        //ensure that all entered data is truthy
        if(!editCourseNumber || !editCourseValue || !editCourseField){
            updateEditCourseErrorMessage('You must complete the form');
            return;
        }

        //creating info object with user-entered info the course and it's updated field and value
        let info = {
            currentNumber: editCourseNumber,
            field: editCourseField,
            newValue : editCourseValue
        }

        let status = 0;

        //PUT request to /course endpoint, for updating the exiting ourse with new data
        fetch(`${env.apiUrl}/course`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.authUser.token}`
            },
            body: JSON.stringify(info)
        }).then(resp => {
            status = resp.status;
            return resp.json();
        }).then(payload => {
            if(status >= 400){
                updateEditCourseErrorMessage(payload.message);
            } else {
                showTaughtCourses();
            }
        }).catch(err => console.error(err));

    }

    //function called upon clicking the Delete Course button from the Remove Course form
    function removeCourse() {
        if(!removeCourseNumber){
            updateRemoveCourseErrorMessage('You must complete the form');
            return;
        }

        let status = 0;

        //DELETE request to the /course endpoint, for deleting the existing course selected in the dropdown menu
        fetch(`${env.apiUrl}/course`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${state.authUser.token}`
            },
            body: `"${removeCourseNumber}"`
        }).then(resp => {
            status = resp.status;
            return resp;
        }).then(payload => {
            if(status >= 400){
                updateRemoveCourseErrorMessage(payload.message);
            } else {
                showTaughtCourses();
            }
        }).catch(err => console.error(err));
        
    }

    this.render = function() {
        FacultyDashboard.prototype.injectTemplate(() => {
            
            // getting the elements and assigning them to appropriate variables
            // adding event listeners to buttons, dropdown menus, and text fields
        
            coursesContainerElement = document.getElementById('courses-container');
            
            viewCoursesButtonElement = document.getElementById('faculty-view-courses-button');
            viewCoursesButtonElement.addEventListener('click', showTaughtCourses);
                
            editCourseButtonElement = document.getElementById('faculty-edit-course-button');
            editCourseButtonElement.addEventListener('click', showEditForm);

            addCourseButtonElement = document.getElementById('faculty-add-course-button');
            addCourseButtonElement.addEventListener('click', showAddCourseForm);

            removeCourseButtonElement = document.getElementById('faculty-remove-course-button');
            removeCourseButtonElement.addEventListener('click', showRemoveCourseForm);

            //related to add course form
            addCourseFormElement = document.getElementById('add-course-form');
            addCourseNumberFieldElement = document.getElementById('add-course-number');
            addCourseTitleFieldElement = document.getElementById('add-course-title');
            addCourseDescriptionFieldElement = document.getElementById('add-course-description');
            addCourseCapacityFieldElement = document.getElementById('add-course-capacity');
            addSubmitCourseButtonElement = document.getElementById('add-course-form-button');
            addCourseErrorMessageElement = document.getElementById('add-course-error-msg');

            addCourseNumberFieldElement.addEventListener('keyup', updateAddCourseNumber);
            addCourseTitleFieldElement.addEventListener('keyup', updateAddCourseTitle);
            addCourseDescriptionFieldElement.addEventListener('keyup', updateAddCourseDescription);
            addCourseCapacityFieldElement.addEventListener('keyup', updateAddCourseCapacity);
            addSubmitCourseButtonElement.addEventListener('click', addCourse);

            //related to remove course form
            removeCourseFormElement = document.getElementById('remove-course-form');
            removeCourseNumberFieldElement = document.getElementById('remove-course-number');
            removeCourseFormButtonElement = document.getElementById('remove-course-form-button');
            removeCourseErrorMessageElement = document.getElementById('remove-course-error-msg');
            removeCourseFormButtonElement.addEventListener('click', removeCourse);
            removeCourseNumberFieldElement.addEventListener('blur', updateRemoveCourseNumber);

            //related to edit course form
            editCourseFormElement = document.getElementById('edit-course-form');
            editCourseNumberElement = document.getElementById('edit-course-number');
            editCourseFieldElement = document.getElementById('edit-course-field');
            editCourseValueElement = document.getElementById('edit-course-value');
            editCourseFormButtonElement = document.getElementById('edit-course-form-button');
            editCourseErrorMessageElement = document.getElementById('edit-course-error-msg');
            editCourseNumberElement.addEventListener('blur', updateEditCourseNumber);
            editCourseFieldElement.addEventListener('blur', updateEditCourseField);
            editCourseValueElement.addEventListener('keyup', updateEditCourseValue);
            editCourseFormButtonElement.addEventListener('click', editCourse);

            profileEmailElement = document.getElementById('profile-email');

            //calling the show taught courses method, to immediately navigate user to Show Taught Courses view and thus initialize the query with course data
            showTaughtCourses();

        });

        FacultyDashboard.prototype.injectStylesheet();
    }
}

export default new FacultyDashboard();