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
    
    thisNode.addEventListener('click', () => {
        selectNode(thisNode);
    });
});
    
let highlighted = null;

// jump to next change
document.querySelector(".jump-buttons").addEventListener('click', jumpToNextChange);

// universal reject and accept buttons
const rejectButton = document.getElementById('reject-button');
const acceptButton = document.getElementById('accept-button');

rejectButton.addEventListener('click', () => {
    rejectChange();
});
acceptButton.addEventListener('click', () => {
    acceptChange();
});


//top-left buttons
document.querySelector("#revert-changes-icon").addEventListener('click', () => {
    revertChanges().then(() => {
        window.location.href = '/workshop/' + articleId
    })
});

// top-right buttons
document.querySelector("#reject-remaining-icon").addEventListener('click', (rejectRemainingChanges));
document.querySelector("#accept-remaining-icon").addEventListener('click', (acceptRemainingChanges));

document.querySelector("#exit-icon").addEventListener('click', () => {
    saveCurrentChanges().then(() => {
        window.location.href = '/workshop/';
    });
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
    //This is not working as intended, but some implementation is needed.
    //We need to jump to the next change before the highlighted text is removed. Otherwise the "next change"
    //button will begin from the top. Make sure to implement in `acceptChange()` also.
    // jumpToNextChange();
    
    if (selectedInsertNode) selectedInsertNode.remove();
    if (selectedDeleteNode) {
        moveTextIntoSpan(selectedDeleteNode, selectedDeleteNode.innerHTML); 
        selectedDeleteNode.remove();
    }
}

function acceptChange() {
    // jumpToNextChange();
    if (selectedDeleteNode) selectedDeleteNode.remove();
    if (selectedInsertNode) {
        moveTextIntoSpan(selectedInsertNode, selectedInsertNode.innerHTML);
        selectedInsertNode.remove();
    }
}

function revertChanges() {
    return fetch('/api/workshop_api/' + articleId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_type: "revert_changes",
        })
    })
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
    rejectRemainingChanges();
    let finalText = document.querySelector(".article").innerText;
    
    // update the final_text in the Archive model
    return fetch('/api/workshop_api/' + articleId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            request_type: "update_text",
            final_text: finalText
        })
    })
}

function moveTextIntoSpan(existentNode, nodeContent) {
    const newNode = document.createElement("span");
    newNode.innerHTML = nodeContent.replace(/¶/g, ""); //eliminate ¶ characters while moving HTML
    existentNode.before(newNode);
}

function jumpToNextChange() {
    
    let change = null;
    highlighted = document.querySelector(".del-selected, .ins-selected");

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
}