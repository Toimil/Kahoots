const renderCard = (s) => {
    const col = document.createElement("div");
    col.classList.add("col");

    const card = document.createElement("div");
    card.classList.add("card");
    card.classList.add("hover-shadow");

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.alt = s.json;
    img.src = s.img;

    const body = document.createElement("div");
    body.classList.add("card-body");

    const title = document.createElement("h5");
    title.classList.add("card-ttile");
    title.innerText = s.title;

    const button = document.createElement("a");
    button.href = "test.html?title=" + encodeURI(s.title) + "&json=" + s.json;
    button.classList.add("btn");
    button.classList.add("btn-primary");
    button.innerText = "Ir a " + s.json;

    body.appendChild(title);
    body.appendChild(button);

    card.appendChild(img);
    card.appendChild(body);

    col.appendChild(card);
    return col;
}

function render() {
    fetch("index.json")
        .then(response => response.json())
        .then(data => {
            const div = document.getElementById("container");
            data.forEach(s => {
                const card = renderCard(s);
                div.appendChild(card);
            });
        });
}

render();
