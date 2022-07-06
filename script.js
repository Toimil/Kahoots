'use strict';

const TYPES = [];
const QUESTIONS = [];

function standarize(txt) {
    return txt.toLowerCase()
        .replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u");
}

const renderAnswers = (answers) => {
    const ul = document.createElement("ul");
    ul.classList.add("list-group");
    ul.classList.add("list-group-flush");

    answers.forEach(answer => {
        const li = document.createElement("li");
        li.classList.add("list-group-item");
        if (answer.correct) li.classList.add("active");
        li.innerText = answer.text;
        ul.appendChild(li);
    });

    return ul;
};

const renderQuestionCard = (question) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("hover-shadow");
    card.classList.add("w-100");
    if (question.help !== undefined && question.help !== null && question.help.length > 0) {
        card.title = question.help;
    }

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.style.paddingBottom = "0.0rem";

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = question.question;
    cardBody.appendChild(cardTitle);

    const ulQuestions = renderAnswers(question.answers);

    card.appendChild(cardBody);
    card.appendChild(ulQuestions);

    return card;
};

const renderQuestionAccordion = (question) => {
    const id = Math.floor(Math.random() * 1024);

    const item = document.createElement("div");
    item.classList.add("accordion-item");
    if (question.help !== undefined && question.help !== null && question.help.length > 0) {
        item.title = question.help;
    }

    const header = document.createElement("h2");
    header.classList.add("accordion-header");

    const button = document.createElement("button");
    button.classList.add("accordion-button");
    button.classList.add("collapsed");
    button.style.fontWeight = "bold";
    button.type = "button";
    button.setAttribute("data-mdb-toggle", "collapse");
    button.setAttribute("data-mdb-target", "#question" + id);
    button.setAttribute("data-mdb-target", "#question" + id);
    button.innerText = question.question;

    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.classList.add("bg-primary");
    badge.style.marginRight = "6px";
    badge.innerText = TYPES[question.type - 1];
    button.prepend(badge);

    header.appendChild(button);

    const collapse = document.createElement("div");
    collapse.classList.add("accordion-collapse");
    collapse.classList.add("collapse");
    collapse.id = "question" + id;

    const body = renderAnswers(question.answers);
    collapse.appendChild(body);

    item.appendChild(header);
    item.appendChild(collapse);

    return item;
};

function getTypesDisplay() {
    const checks = [];
    
    TYPES.forEach((type, id) => {
        const cb = document.getElementById("cb" + id);
        checks.push(cb.checked);
    });

    return checks;
}

function renderCard() {
    const container = document.getElementById("container");
    container.innerHTML = "";

    const types = getTypesDisplay();

    QUESTIONS.forEach(question => {
        if (types[question.type - 1]) {
            const row = document.createElement("div");
            row.classList.add("row");
            row.classList.add("py-2");

            const col = document.createElement("div");
            col.classList.add("col-md");

            const card = renderQuestionCard(question);
            col.appendChild(card);
            row.appendChild(col);

            container.appendChild(row);
        }
    });
};

function renderAccordion(txtValue) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    const types = getTypesDisplay();

    const row = document.createElement("div");
    row.classList.add("row");
    row.classList.add("py-2");

    const col = document.createElement("div");
    col.classList.add("col-md");

    const accordion = document.createElement("div");
    accordion.classList.add("accordion");

    QUESTIONS.forEach(question => {
        if (types[question.type - 1]) {
            let match = false;
            match = match || standarize(question.question).includes(txtValue);
            question.answers.forEach(answer => {
                match = match || standarize(answer.text).includes(txtValue);
            });
    
            if (match) {
                const accordionItem = renderQuestionAccordion(question);
                accordion.appendChild(accordionItem);
            }
        }
    });


    col.appendChild(accordion);
    row.appendChild(col);

    container.appendChild(row);
}

function update() {
    const txtSearch = document.getElementById("txtSearch");
    const txtValue = standarize(txtSearch.value);

    if (txtValue.length === 0) renderCard();
    else renderAccordion(txtValue);
}

function getQuestions() {
    const url = new URL(window.location.href);
    const title = decodeURI(url.searchParams.get("title"));
    const json = url.searchParams.get("json");

    document.getElementById("title").innerText = title;
    document.getElementsByTagName("title")[0].innerText = title + " | Tests";

    fetch("data/" + json + ".json")
        .then(response => response.json())
        .then(data => {
            data.types.forEach(q => TYPES.push(q));
            renderCheckboxes();
            data.questions.forEach(q => QUESTIONS.push(q));
            update();
        });
}

function renderCheckboxes() {
    const container = document.getElementById("cb");

    TYPES.forEach((type, id) => {
        const formCheck = document.createElement("div");
        formCheck.classList.add("form-check");
        formCheck.classList.add("form-check-inline");
        formCheck.classList.add("mt-1");

        const input = document.createElement("input");
        input.classList.add("form-check-input");
        input.type = "checkbox";
        input.id = "cb" + id;
        input.value = type.toLowerCase();
        input.checked = true;
        input.addEventListener("change", update);

        const label = document.createElement("label");
        label.classList.add("form-check-label");
        label.htmlFor = "cb" + id;
        label.innerText = type;

        formCheck.appendChild(input);
        formCheck.appendChild(label);

        container.appendChild(formCheck);
    });
}

document.getElementById("txtSearch").addEventListener("input", update);
getQuestions();
