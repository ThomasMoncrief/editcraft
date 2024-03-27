const articleId = document.querySelector(".page-title").getAttribute("article-id");

// selected Delete and Insert nodes default to null
let selectedDeleteNode = null;
let selectedInsertNode = null;

// make changes selectable
let changes = document.querySelectorAll("del, ins");
changes.forEach(thisNode => {
    // add pilcrow characters to denote differences in paragraph breaks
    let replacementHTML = thisNode.innerHTML.replace(/<br>/g, '<br>¶');
    thisNode.innerHTML = replacementHTML;
    
    // add selection event to all delete and insert nodes
    thisNode.addEventListener('click', () => {
        selectNode(thisNode);
    });
});
    
// jump to next change
document.querySelector(".jump-buttons").addEventListener('click', () => {
    let change = null;
    let highlighted = document.querySelector(".del-selected, .ins-selected");

    // find next change beginning from current selection
    if (highlighted) {
        change = highlighted.nextElementSibling;
        while (change && change.nodeName !== "DEL" && change.nodeName !== "INS") {
            change = change.nextElementSibling;
        }
    // find next change from top of the DOM if no current selection
    } else {
        change = document.querySelector("del, ins");
    }
    selectNode(change);
    change.scrollIntoView({block: "center", inline: "nearest"});
});

// universal reject and accept buttons
const rejectButton = document.getElementById('reject-button');
const acceptButton = document.getElementById('accept-button');

rejectButton.addEventListener('click', () => {
    rejectChange();
});
acceptButton.addEventListener('click', () => {
    acceptChange();
});


// reject / accept remaining changes. Save icon is probably not necessary.
const rejectRemainingIcon = document.querySelector("#reject-remaining-icon");
rejectRemainingIcon.addEventListener('click', (rejectRemainingChanges));

document.querySelector("#accept-remaining-icon").addEventListener('click', (acceptRemainingChanges));
document.querySelector("#review-icon").addEventListener('click', () => {
    saveCurrentChanges();
});
document.querySelector("#exit-icon").addEventListener('click', () => {
    window.location.href = '/workshop/'
});

// Hover reject
rejectButton.addEventListener('mouseover', () => {
    if (selectedDeleteNode) {
        if (selectedDeleteNode.textContent.includes("¶")) selectedDeleteNode.style.visibility = "hidden";
        selectedDeleteNode.style.background = "none";
        selectedDeleteNode.style.textDecoration = "none";
    } 
    if (selectedInsertNode) selectedInsertNode.style.display = "none";
});
rejectButton.addEventListener('mouseout', () => {
    if (selectedDeleteNode) selectedDeleteNode.style.cssText = "";
    if (selectedInsertNode) selectedInsertNode.style.cssText = "";
});

// Hover accept
acceptButton.addEventListener('mouseover', () => {
    if (selectedDeleteNode) selectedDeleteNode.style.display = "none";
    if (selectedInsertNode) {
        // pilcrow character still visible on hover. Could implement something to hide it here and make it reappear on mouseout.
        selectedInsertNode.style.background = "none";
        selectedInsertNode.style.textDecoration = "none";
    } 
});
acceptButton.addEventListener('mouseout', () => {
    if (selectedDeleteNode) selectedDeleteNode.style.cssText = "";
    if (selectedInsertNode) selectedInsertNode.style.cssText = "";
});


// Select and unselect changes
function selectNode(thisNode) {
    if (selectedDeleteNode) selectedDeleteNode.classList.remove('del-selected');
    if (selectedInsertNode) selectedInsertNode.classList.remove('ins-selected');
    
    //selecting delete
    if (thisNode.nodeName == "DEL") {
        thisNode.classList.toggle('del-selected');
        selectedDeleteNode = thisNode;
        if (thisNode.nextElementSibling.nodeName == "INS") {
            selectedInsertNode = thisNode.nextElementSibling;
        } else {
            selectedInsertNode = null;
        }
    }

    //selecting insert
    if (thisNode.nodeName == "INS") {
        thisNode.classList.toggle('ins-selected');
        selectedInsertNode = thisNode;
        if (thisNode.previousElementSibling.nodeName == "DEL") {
            selectedDeleteNode = thisNode.previousElementSibling;
        } else {
            selectedDeleteNode = null;
        }
    }
}

function rejectChange() {
    if (selectedInsertNode) selectedInsertNode.remove();
    if (selectedDeleteNode) {
        moveTextIntoSpan(selectedDeleteNode, selectedDeleteNode.innerHTML); 
        selectedDeleteNode.remove();
    }
}

function acceptChange() {
    if (selectedDeleteNode) selectedDeleteNode.remove();
    if (selectedInsertNode) {
        moveTextIntoSpan(selectedInsertNode, selectedInsertNode.innerHTML);
        selectedInsertNode.remove();
    }
}

function rejectRemainingChanges() {
    deletes = document.querySelectorAll("del");
    inserts = document.querySelectorAll("ins")
    // remove insertions. No need to keep the contents.
    inserts.forEach(insNode => {
        insNode.remove();
    });
    // reject all deletions
    deletes.forEach(delNode => {
        moveTextIntoSpan(delNode, delNode.innerHTML); 
        delNode.remove();
    })
}

function acceptRemainingChanges() {
    deletes = document.querySelectorAll("del");
    inserts = document.querySelectorAll("ins");
    // remove all deletions. No need to keep the contents.
    deletes.forEach(delNode => {
        delNode.remove();
    });
    // accept all insertions.
    inserts.forEach(insNode => {
        moveTextIntoSpan(insNode, insNode.innerHTML);
        insNode.remove();
    });
}

function saveCurrentChanges() {
    // reject all remaining changes and remove "ins" nodes. They will re-render after the refresh.
    console.log("hello")
    rejectRemainingChanges();
    finalText = document.querySelector(".article").innerText;
    
    // update the final_text in the Archive model
    fetch('/api/workshop_api/' + articleId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_type: "update_text",
            final_text: finalText
        })
    })
    // redirect to the download page
    .then(response => {
        if (response.ok) {
            window.location.href = '/workshop/' + articleId + '/download';
        } else {
            console.error('PUT request failed:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function moveTextIntoSpan(existentNode, nodeContent) {
    const newNode = document.createElement("span");
    newNode.innerHTML = nodeContent.replace(/¶/g, ""); //eliminate ¶ characters while moving HTML
    existentNode.before(newNode);
}