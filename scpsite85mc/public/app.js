const socket = io();

const scpList =
    document.getElementById("scpList");

async function loadSCPs() {

    const res =
        await fetch("/api/scps");

    const data =
        await res.json();

    scpList.innerHTML = "";

    data.forEach(addCard);

}

function addCard(scp) {

    const div =
        document.createElement("div");

    div.className = "scp-card";

    div.id = `scp-${scp.id}`;

    if (
        scp.containment ===
        "High Containment Zone"
    ) {

        div.classList.add("zone-high");

    } else {

        div.classList.add("zone-low");

    }

    div.innerHTML = `

        <h2>
            ${scp.number}
            -
            ${scp.name}
        </h2>

        <p>
            <b>Objektum osztály:</b>
            ${scp.class}
        </p>

        <p>
            <b>Containment:</b>
            ${scp.containment}
        </p>

        <p>
            <b>Státusz:</b>
            ${scp.status}
        </p>

        <hr>

        <h3>Leírás</h3>

        <p>
            ${scp.description}
        </p>

        <h3>
            Containment Protokoll
        </h3>

        <p>
            ${scp.notes}
        </p>

        <small>
            ${new Date(
                scp.createdAt
            ).toLocaleString()}
        </small>

        <div class="buttons">

            <button
                onclick="editSCP(${scp.id})"
            >
                SCP módosítása
            </button>

            <button
                class="delete-btn"
                onclick="deleteSCP(${scp.id})"
            >
                SCP törlése
            </button>

        </div>

    `;

    scpList.prepend(div);

}

async function addSCP() {

    const number =
        document.getElementById(
            "number"
        ).value;

    const name =
        document.getElementById(
            "name"
        ).value;

    const scpClass =
        document.getElementById(
            "class"
        ).value;

    const containment =
        document.getElementById(
            "containment"
        ).value;

    const status =
        document.getElementById(
            "status"
        ).value;

    const description =
        document.getElementById(
            "description"
        ).value;

    const notes =
        document.getElementById(
            "notes"
        ).value;

    await fetch("/api/scps", {

        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            number,
            name,

            class: scpClass,

            containment,

            status,

            description,

            notes

        })

    });

}

async function deleteSCP(id) {

    await fetch(
        `/api/scps/${id}`,

        {
            method: "DELETE"
        }
    );

}

async function editSCP(id) {

    const newName =
        prompt("Új SCP név:");

    if (!newName) return;

    await fetch(
        `/api/scps/${id}`,

        {

            method: "PUT",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body: JSON.stringify({

                number:
                    prompt(
                        "SCP szám:"
                    ),

                name: newName,

                class:
                    prompt(
                        "Objektum osztály:"
                    ),

                containment:
                    prompt(
                        "Containment:"
                    ),

                status:
                    prompt(
                        "Státusz:"
                    ),

                description:
                    prompt(
                        "Leírás:"
                    ),

                notes:
                    prompt(
                        "Containment protokoll:"
                    )

            })

        }
    );

}

socket.on(
    "scpAdded",

    scp => {

        addCard(scp);

    }
);

socket.on(
    "scpDeleted",

    id => {

        const element =
            document.getElementById(
                `scp-${id}`
            );

        if (element) {

            element.remove();

        }

    }
);

socket.on(
    "scpUpdated",

    updated => {

        const old =
            document.getElementById(
                `scp-${updated.id}`
            );

        if (old) {

            old.remove();

        }

        addCard(updated);

    }
);

loadSCPs();