let username = prompt("Enter your name:");
let currentRoom = null;

// ENTER KEY
document.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

// CREATE ROOM
async function createRoom() {
  let name = roomName.value;
  let pass = roomPass.value;

  if (!name || !pass) return alert("Enter details");

  await db.ref("rooms/" + name).set({
    password: pass
  });

  loadRooms();
}

// JOIN ROOM
async function joinRoom() {
  let name = roomName.value;
  let pass = roomPass.value;

  let snap = await db.ref("rooms/" + name).once("value");

  if (!snap.exists()) return alert("Room not found");
  if (snap.val().password !== pass) return alert("Wrong password");

  currentRoom = name;

  homePanel.classList.add("hidden");
  chatPanel.classList.remove("hidden");
  roomTitle.innerText = name;

  // add user
  db.ref(`rooms/${name}/users/${username}`).set(true);

  // USERS LIST (FIXED)
  db.ref(`rooms/${name}/users`).on("value", snap => {
    users.innerHTML = "";
    snap.forEach(u => {
      let li = document.createElement("li");
      li.innerText = u.key;
      users.appendChild(li);
    });
  });

  // MESSAGES
  chatBox.innerHTML = "";
  db.ref(`rooms/${name}/messages`).on("child_added", snap => {
    showMessage(snap.val());
  });
}

// SEND MESSAGE
function sendMessage() {
  if (!currentRoom) return;

  let msg = document.getElementById("msg").value;
  if (!msg.trim()) return;

  db.ref(`rooms/${currentRoom}/messages`).push({
    user: username,
    text: msg
  });

  document.getElementById("msg").value = "";
}

// SHOW MESSAGE
function showMessage(msg) {
  let div = document.createElement("div");
  div.classList.add("message");

  if (msg.user === username) div.classList.add("sent");
  else div.classList.add("received");

  div.innerText = msg.user + ": " + msg.text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// LEAVE ROOM
async function leaveRoom() {
  await db.ref(`rooms/${currentRoom}/users/${username}`).remove();
  location.reload();
}

// LOAD ROOMS LIST
function loadRooms() {
  db.ref("rooms").on("value", snap => {
    roomList.innerHTML = "";
    snap.forEach(r => {
      let li = document.createElement("li");
      li.innerText = r.key;
      li.onclick = () => {
        roomName.value = r.key;
      };
      roomList.appendChild(li);
    });
  });
}

loadRooms();