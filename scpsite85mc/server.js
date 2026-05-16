const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
const DATA_FILE = "./scps.json";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function loadSCPs() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "[]");
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveSCPs(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/scps", (req, res) => {
    res.json(loadSCPs());
});

app.post("/api/scps", (req, res) => {
    const scps = loadSCPs();

    const newScp = {
        id: Date.now(),
        number: req.body.number,
        name: req.body.name,
        class: req.body.class,
        containment: req.body.containment,
        status: req.body.status,
        description: req.body.description,
        notes: req.body.notes,
        createdAt: new Date().toISOString()
    };

    scps.push(newScp);
    saveSCPs(scps);

    io.emit("scpAdded", newScp);

    res.json({ success: true });
});

app.put("/api/scps/:id", (req, res) => {
    let scps = loadSCPs();

    const index = scps.findIndex(s => s.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "Not found" });
    }

    scps[index] = {
        ...scps[index],
        ...req.body
    };

    saveSCPs(scps);

    io.emit("scpUpdated", scps[index]);

    res.json({ success: true });
});

app.delete("/api/scps/:id", (req, res) => {
    let scps = loadSCPs();

    scps = scps.filter(s => s.id != req.params.id);

    saveSCPs(scps);

    io.emit("scpDeleted", req.params.id);

    res.json({ success: true });
});

io.on("connection", socket => {
    console.log("Client connected");
});

server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});