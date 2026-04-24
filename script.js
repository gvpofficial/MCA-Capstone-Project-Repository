// 1. GLOBAL VARIABLES (Must be at the very top)
let username = "";
let currentRoom = null;

// 2. USER IDENTIFICATION (Fixed Continue Button)
function setDisplayName() {
    const nameInput = document.getElementById("userNameInput").value.trim();
    
    if (!nameInput) {
        alert("Please enter a name!");
        return;
    }
    
    username = nameInput;
    document.getElementById("welcomeText").innerText = `Welcome ${username} to Chatozz`;
    
    // Hide name entry, show room panel
    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("homePanel").classList.remove("hidden");
}

// 3. THEME TOGGLE
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("themeToggle");
    
    if (body.classList.contains("dark-theme")) {
        body.classList.replace("dark-theme", "light-theme");
        btn.innerText = "☀️ Light";
    } else {
        body.classList.replace("light-theme", "dark-theme");
        btn.innerText = "🌙 Dark";
    }
}

// 4. ROOM LOGIC
async function createRoom() {
    const name = document.getElementById("roomName").value.trim();
    const pass = document.getElementById("roomPass").value.trim();
    if (!name || !pass) return alert("Enter room details");

    await db.ref("rooms/" + name).set({ password: pass });
    alert("Room created! You can now join it.");
}

async function joinRoom() {
    const name = document.getElementById("roomName").value.trim();
    const pass = document.getElementById("roomPass").value.trim();

    const snap = await db.ref("rooms/" + name).once("value");
    if (!snap.exists()) return alert("Room doesn't exist");
    if (snap.val().password !== pass) return alert("Wrong password");

    currentRoom = name;
    document.getElementById("roomTitle").innerText = `Room: ${name}`;
    document.getElementById("homePanel").classList.add("hidden");
    document.getElementById("chatPanel").classList.remove("hidden");

    setupRoomListeners(name);
}

// 5. CHAT & PRESENCE LOGIC
function setupRoomListeners(name) {
    const chatBox = document.getElementById("chatBox");
    
    // Track User presence
    const userRef = db.ref(`rooms/${name}/users/${username}`);
    userRef.set(true);
    userRef.onDisconnect().remove();

    // Sync Active Users
    db.ref(`rooms/${name}/users`).on("value", snap => {
        const container = document.getElementById("usersContainer");
        container.innerHTML = "";
        snap.forEach(u => {
            const div = document.createElement("div");
            div.style.padding = "8px";
            div.style.marginBottom = "5px";
            div.style.background = "rgba(255,255,255,0.1)";
            div.style.borderRadius = "5px";
            div.innerText = u.key === username ? "You (Online)" : u.key;
            container.appendChild(div);
        });
    });

    // Sync Messages
    chatBox.innerHTML = "";
    db.ref(`rooms/${name}/messages`).on("child_added", snap => {
        const msg = snap.val();
        const div = document.createElement("div");
        div.className = `message ${msg.user === username ? 'sent' : 'received'}`;
        div.innerHTML = `<strong>${msg.user}</strong><br>${msg.text}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

function sendMessage() {
    const msgInput = document.getElementById("msg");
    const text = msgInput.value.trim();
    if (!currentRoom || !text) return;

    db.ref(`rooms/${currentRoom}/messages`).push({
        user: username,
        text: text,
        timestamp: Date.now()
    });
    msgInput.value = "";
}

function leaveRoom() {
    if (currentRoom) {
        db.ref(`rooms/${currentRoom}/users/${username}`).remove();
        location.reload(); 
    }
}

// 6. INITIAL LOAD (Fetch existing rooms)
db.ref("rooms").on("value", snap => {
    const list = document.getElementById("roomList");
    list.innerHTML = "";
    snap.forEach(r => {
        const li = document.createElement("li");
        li.innerText = r.key;
        li.style.cursor = "pointer";
        li.style.padding = "5px 0";
        li.onclick = () => { document.getElementById("roomName").value = r.key; };
        list.appendChild(li);
    });
});