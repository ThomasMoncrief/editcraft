document.addEventListener("DOMContentLoaded", () => {
    const apiKey = document.querySelector("#api-key");
    const apiKeyEditButton = document.querySelector(".api-key-edit");
    const apiKeyForm = document.querySelector(".api-key-form");
    const apiKeyCancelButton = document.querySelector("#api-form-cancel");
    const apiKeyInput = document.querySelector("#api-key-input");
    const blankFormAlert = document.querySelector('#blank-form-alert')

    if (apiKey.textContent == "") {
        apiKey.textContent = "Enter an API key to upload text!";
    } else {
        //hide the key in the browswer display
        apiKey.textContent = apiKey.textContent.replace(/.(?<=.{10})/g, '*');
    }
    //show input field when the edit button is clicked
    apiKeyEditButton.addEventListener("click", () => {
        apiKeyForm.style.display = "block";
        apiKeyInput.focus();
        apiKeyInput.select();
    })
    apiKeyCancelButton.addEventListener("click", () => {
        apiKeyForm.style.display = "none";
        blankFormAlert.style.display = "none";
    })
    //prevent clicking submit on a blank form
    apiKeyForm.addEventListener('submit', function(event) {
        if (apiKeyInput.value == "") {
            event.preventDefault();
            blankFormAlert.style.display = "block";
        }
    })
})