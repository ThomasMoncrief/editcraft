document.addEventListener("DOMContentLoaded", () => {

    //alert the user if a blank form is submitted
    document.getElementById('login-form').addEventListener('submit', function(event) {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const blankLoginAlert = document.getElementById('blank-form-alert')
        if (username === '' || password === '') {
            event.preventDefault();
            blankLoginAlert.style.display = 'block';
        }
    });
});