console.log("Workshop script loaded")

//delete article when trash icon clicked
const articleTitles = document.querySelectorAll('.workshop-article');
const trashIcons = document.querySelectorAll('.trash-wrapper');
let titleEditForm = null;

articleTitles.forEach(title => {
    // handle pencil icon click
    title.querySelector("#edit-icon").addEventListener('click', () => {
        
        // hide any existing form and before opening a new form
        if (titleEditForm) {
            titleEditForm.style.display = "none";
            titleToEdit.style.display = "block";
        }
        // set title and form variables to current edit
        titleToEdit = title.querySelector('.workshop-article-title');
        titleEditForm = title.querySelector(".title-edit-form");

        // display form
        titleToEdit.style.display = "none";
        titleEditForm.style.display = "block";
        title.querySelector(".title-edit-input").value = titleToEdit.innerText;
        
        // handle check icon click: update new title for HTML and server
        title.querySelector("#check-icon").addEventListener('click', () => {
            updateTitle(title);
        });
        titleEditForm.addEventListener('keyup', (event) => {
            if (event.keyCode === 13) {
                updateTitle(title)
            } 
        });
    });
});

trashIcons.forEach(icon => {
    icon.addEventListener('click', (event) => {
        const iconId = event.target.id;
        console.log(`Delete icon clicked: ${iconId}`);
        fetch('/api/workshop_api/' + iconId, {
            method: 'DELETE',
            body: JSON.stringify({
                id: iconId
            })
        })
        .then(response => {
            if (response.ok) {
                const trElement = event.target.closest('tr');
                trElement.remove();
            } else {
                // Handle error response from server
                console.error('Failed to delete item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});


function updateTitle(title) {
    let newTitle = title.querySelector(".title-edit-input").value;
    console.log(newTitle)
    titleToEdit.firstChild.innerText = newTitle;
    titleEditForm.style.display = "none";
    titleToEdit.style.display = "block";
    
    // update server
    fetch('/api/workshop_api/' + title.id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_type: "update_title",
            new_title: newTitle
        })
    })
    .then(response => {
        if (response.ok) {
            console.log("title updated!");
        } else {
            console.error('PUT request failed:', response.statusText);
        }
    });
}