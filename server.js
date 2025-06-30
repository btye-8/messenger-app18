import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const PORT = process.env.PORT || 3000;

let messages = [];
const lastSeen = {};
let users = {
  Gini: "18072007",
  Dev: "18042004"
};

let messages = [];
const messageFile = path.join(__dirname, 'messages.json');
if (fs.existsSync(messageFile)) {
  messages = JSON.parse(fs.readFileSync(messageFile));
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] === password) {
    res.send({ success: true });
  } else {
    res.send({ success: false });
  }
});
// this 
// Set current user
    socket.emit("set-user", username);

    // Determine friend
    const otherUser = username === "gini" ? "dev" : "gini";

    // Show last seen or online
    function updateLastSeen() {
      fetch(`${BACKEND_URL}/last-seen/${otherUser}`)
        .then(res => res.json())
        .then(data => {
          const statusText = data.lastSeen === "online"
            ? "Online"
            : `Last seen at ${new Date(data.lastSeen).toLocaleTimeString()}`;
          document.getElementById("status").innerText = `${otherUser}: ${statusText}`;
        });
    }

    setInterval(updateLastSeen, 10000);
    updateLastSeen();
// th

app.get('/messages', (req, res) => {
  res.send(messages);
});

app.post('/clear', (req, res) => {
  messages = [];
  fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));
  res.sendStatus(200);
});

io.on('connection', socket => {
  socket.on('new-message', msg => {
    messages.push(msg);
    fs.writeFileSync(messageFile, JSON.stringify(messages, null, 2));
    io.emit('new-message', msg);
  });
});

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
