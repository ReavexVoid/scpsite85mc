const socket = io();

const scpList = document.getElementById("scpList");
const searchBar = document.getElementById("searchBar");

let scps = [];

async function load() {
    scps = await (await fetch("/api/scps")).json();
    render(scps);
}

function render(data) {
    scpList.innerHTML = "";
    data.forEach(add);
}

function add(scp) {
    const div = document.createElement("div");

    div.className = "scp-card " +
        (scp.containment === "High Containment Zone"
            ? "zone-high"
            : "zone-low");

    div.innerHTML = `
        <h2>${scp.number} - ${scp.name}</h2>
        <p>${scp.class}</p>
        <p>${scp.containment}</p>
        <p>${scp.status}</p>
        <p>${scp.description}</p>
    `;

    scpList.appendChild(div);
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