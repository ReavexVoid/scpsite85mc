const socket = io();

const scpList = document.getElementById("scpList");
const searchBar = document.getElementById("searchBar");

const editId = document.getElementById("editId");

const numberInput = document.getElementById("number");
const nameInput = document.getElementById("name");
const classInput = document.getElementById("class");
const containmentInput = document.getElementById("containment");
const statusInput = document.getElementById("status");
const descriptionInput = document.getElementById("description");
const notesInput = document.getElementById("notes");

let scps = [];

async function load() {
    const res = await fetch("/api/scps");
    scps = await res.json();
    render(scps);
}

function render(data) {
    scpList.innerHTML = "";
    data.forEach(addCard);
}

function addCard(scp) {
    const div = document.createElement("div");

    div.className = "scp-card";

    div.innerHTML = `
        <h2>${scp.number} - ${scp.name}</h2>

        <p>${scp.class}</p>
        <p>${scp.containment}</p>
        <p>${scp.status}</p>

        <button onclick="editSCP(${scp.id})">
            EDIT
        </button>

        <button onclick="deleteSCP(${scp.id})">
            DELETE
        </button>
    `;

    scpList.appendChild(div);
}

window.saveSCP = async function () {

    const payload = {
        number: numberInput.value,
        name: nameInput.value,
        class: classInput.value,
        containment: containmentInput.value,
        status: statusInput.value,
        description: descriptionInput.value,
        notes: notesInput.value
    };

    const id = editId.value;

    if (id) {
        await fetch(`/api/scps/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    } else {
        await fetch("/api/scps", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
    }

    clearForm();
    load();
};

window.editSCP = function (id) {

    const scp = scps.find(s => s.id === id);

    if (!scp) return;

    editId.value = scp.id;

    numberInput.value = scp.number;
    nameInput.value = scp.name;
    classInput.value = scp.class;
    containmentInput.value = scp.containment;
    statusInput.value = scp.status;
    descriptionInput.value = scp.description;
    notesInput.value = scp.notes;

    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.deleteSCP = async function (id) {

    await fetch(`/api/scps/${id}`, {
        method: "DELETE"
    });

    load();
};

function clearForm() {

    editId.value = "";

    numberInput.value = "";
    nameInput.value = "";
    classInput.value = "";
    descriptionInput.value = "";
    notesInput.value = "";
}

searchBar.addEventListener("input", () => {

    const v = searchBar.value.toLowerCase();

    render(scps.filter(s =>
        s.number.toLowerCase().includes(v) ||
        s.name.toLowerCase().includes(v)
    ));
});

socket.on("scpAdded", load);
socket.on("scpDeleted", load);
socket.on("scpUpdated", load);

load();