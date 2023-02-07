async function fetchAuthor() {
    await fetch("https://wt.ops.labs.vu.nl/api23/b857caa6")
    .then(jason => jason.json())
    .then(makeRow)
    .then(window.location.reload())
    document.querySelector("form").reset();
}

async function postAuthor() {
    form = document.querySelector("form");
    body = new FormData(form);
    fetch("https://wt.ops.labs.vu.nl/api23/b857caa6",{
        method: "POST",
        body: JSON.stringify(Object.fromEntries(body)),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(fetchAuthor)
}

function makeRow(json) {
    let last = json[json.length - 1];

    let table = document.getElementById("gallery");
    let newRow = table.insertRow(table.rows.length);
    let cellImage = newRow.insertCell(0);
    let cellAuthor = newRow.insertCell(1);
    let cellAlt = newRow.insertCell(2);
    let cellTags = newRow.insertCell(3);
    let cellDescription = newRow.insertCell(4);

    cellImage.innerHTML = `<img class="image" src=${last.image} alt=${last.alt}>`;
    cellAuthor.innerHTML = `<span class="author"><em>${last.author}</em></span>`;
    cellAlt.innerHTML = `${last.alt}`;
    cellTags.innerHTML = `<ul class="tags"><li>${last.tags}</li></ul>`;
    cellDescription.innerHTML = `<p class="description">${last.description}</p>`;
}

function resetPage() {
    fetch("https://wt.ops.labs.vu.nl/api23/b857caa6/reset")
    .then(jason => jason.json())
    .then(addFromDatabase)
    .then(window.location.reload());
}

async function fetchDatabase() {
    await fetch("https://wt.ops.labs.vu.nl/api23/b857caa6")
    .then(jason => jason.json())
    .then(addFromDatabase);
}

async function addFromDatabase(json) {
    for (let i = 0; i < json.length; i++) {
        let n = json[i];
        let table = document.getElementById("gallery");
        let newRow = table.insertRow(table.rows.length);
        let cellImage = newRow.insertCell(0);
        let cellAuthor = newRow.insertCell(1);
        let cellAlt = newRow.insertCell(2);
        let cellTags = newRow.insertCell(3);
        let cellDescription = newRow.insertCell(4);

        cellImage.innerHTML = `<img class="image" src=${n.image} alt=${n.alt}>`;
        cellAuthor.innerHTML = `<span class="author"><em>${n.author}</em></span>`;
        cellAlt.innerHTML = `<p class="alt">${n.alt}</p>`;
        cellTags.innerHTML = `<ul class="tags"><li>${n.tags}</li></ul>`;
        cellDescription.innerHTML = `<p class="description">${n.description}</p>`;
    }
}

function modalAdd() {
    let modal = document.getElementById("myModal");
    let btn = document.getElementById("myBtn");
    let span = document.getElementsByClassName("close")[0];

    btn.addEventListener("click", function() {
        modal.style.display = "block";
    });
    span.addEventListener("click", function() {
        modal.style.display = "none";
    });
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });
}

function modalUpdate() {
    const modalU = document.querySelector(".modalU");
    const trigger = document.querySelector(".trigger");
    const closeButton = document.querySelector(".close-button");

    function toggleModal() {
        modalU.classList.toggle("show-modalU");
    }
    function windowOnClick(event) {
        if (event.target === modalU) {
            toggleModal();
        }
    }

    trigger.addEventListener("click", toggleModal);
    closeButton.addEventListener("click", toggleModal);
    window.addEventListener("click", windowOnClick);
}

async function updateNames() {
    await fetch("https://wt.ops.labs.vu.nl/api23/b857caa6")
    .then(jason => jason.json())
    .then(updateDatabase);
}

function updateDatabase(json) {
    let list = document.getElementById("select-author");

    for (let i = 0; i < json.length; i++) {
        list.innerHTML += `<input type="radio" class="select-list" name="radio-button" id=${json[i].id}>${json[i].author}</input>`;
    }

    let allNames = document.getElementsByClassName("select-list");
    let selectedName;

    for (let i = 0; i < allNames.length; i++) {
        allNames[i].addEventListener("change", function() {
            selectedName = this.id;
        });
    }

    document.getElementById("update-inputs").addEventListener("change", function() {
        let newImage = document.getElementById("updated-image").value;
        let newAuthor = document.getElementById("updated-author").value;
        let newAlt = document.getElementById("updated-alt").value;
        let newTags = document.getElementById("updated-tags").value;
        let newDescription = document.getElementById("updated-description").value;

        for (let i = 0; i < json.length; i++) {
            if (json[i].id == selectedName) {
                if (newImage === "") {
                    newImage = json[i].image;
                }
                if (newAuthor === "") {
                    newAuthor = json[i].author;
                }
                if (newAlt === "") {
                    newAlt = json[i].alt;
                }
                if (newTags === "") {
                    newTags = json[i].tags;
                }
                if (newDescription === "") {
                    newDescription = json[i].description;
                }
            }
        }
        
        let link = "https://wt.ops.labs.vu.nl/api23/b857caa6/item/" + selectedName;

        fetch(link, {
            method: "PUT",
            body: JSON.stringify({
                "image": newImage,
                "author": newAuthor,
                "alt": newAlt,
                "tags": newTags,
                "description": newDescription
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    });
}

async function fetchNames() {
    await fetch("https://wt.ops.labs.vu.nl/api23/b857caa6")
    .then(jason => jason.json())
    .then(showAuthor);
}

async function showAuthor(json) {
    let list = document.getElementById("filterable-gallery");

    for (let i = 0; i < json.length; i++) {
        let exists = false;
        for (let j = 0; j < i; j++) {
            if (json[j].author === json[i].author) {
                exists = true;
                break;
            }
        }
        if (exists === false) {
            let index = i + 2;
            list.innerHTML += `<button class="list-content" id=${index}> ${json[i].author}</button>`;
        }
    }

    let buttons = document.getElementsByClassName("list-content");
    let table = document.getElementById("gallery");
    let prevName = "";
    let prevCount;

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            let name = this.innerText;

            for (let j = 0; j < table.rows.length; j++) {
                table.rows[j].style.display = "";
            }

            if (prevName !== name) {
                for (let j = 0; j < json.length; j++) {
                    if (name !== json[j].author) {
                        table.rows[j + 2].style.display = "none";
                    }
                }
                prevCount = 0;
            }
            else {
                prevCount++;
            }

            if (prevCount % 2 == 0) {
                for (let j = 0; j < json.length; j++) {
                    if (name !== json[j].author) {
                        table.rows[j + 2].style.display = "none";
                    }
                }
            }
            prevName = name;
        });
    }
}

async function fetchSearch() {
    await fetch("https://wt.ops.labs.vu.nl/api23/b857caa6")
    .then(jason => jason.json())
    .then(searchSomething);
}

async function searchSomething(json) {
    let userInput = document.getElementById("input-search").value;
    let table = document.getElementById("gallery");
    let nameOrTag = false;
    let searchedAuthor;

    for (let i = 0; i < json.length; i++) {
        if (userInput === json[i].author) {
            searchedAuthor = json[i].id;
            nameOrTag = true;
            break;
        }
    }

    if (!nameOrTag) {
        for (let i = 0; i < json.length; i++) {
            if (userInput === json[i].tags) {
                searchedAuthor = json[i].id;
                nameOrTag = true;
                break;
            }
        }
    }

    if (!nameOrTag) {
        alert("this doesn't exist in our database");
    }
    else {
        for (let i = 0; i < json.length; i++) {
            if (json[i].id != searchedAuthor) {
                table.rows[i + 2].style.display = "none";
            }
        }
    }
}

modalAdd(); 
//for modal 'Add Author' code we used W3schools https://www.w3schools.com/howto/howto_css_modals.asp
modalUpdate();
//for modal 'Update' code we used SABE https://sabe.io/tutorials/how-to-create-modal-popup-box

window.addEventListener("load", fetchDatabase);
window.addEventListener("load", fetchNames);
window.addEventListener("load", updateNames);
document.getElementById("resetDatabase").addEventListener("click", resetPage);
document.querySelector("form").addEventListener("submit", postAuthor);
document.querySelector("form").addEventListener("submit", function(e){ e.preventDefault() });
document.getElementById("update-form").addEventListener("submit", updateDatabase);
document.getElementById("search").addEventListener("click", fetchSearch);

document.getElementById("input-search").addEventListener("focus", function () {
    let table = document.getElementById("gallery");

    for (let j = 0; j < table.rows.length; j++) {
        table.rows[j].style.display = "";
    }
});
