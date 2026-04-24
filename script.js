// 1. GLOBAL VARIABLES
let username = "";
let currentRoom = null;

// 2. UNIVERSAL KEYBOARD LISTENER
// Ensures the Enter key works globally when typing in the message box
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        const msgInput = document.getElementById("msg");
        // Only trigger sendMessage if the user is currently typing in the chat box
        if (msgInput === document.activeElement) {
            e.preventDefault(); 
            sendMessage();
        }
    }
});

// 3. USER IDENTIFICATION (Continue Button Logic)
function setDisplayName() {
    const nameInput = document.getElementById("userNameInput").value.trim();
    if (!nameInput) {
        alert("Please enter a name!");
        return;
    }
    username = nameInput;
    document.getElementById("welcomeText").innerText = `Welcome ${username} to Chatozz`;
    
    // Panel Transition
    document.getElementById("userPanel").classList.add("hidden");
    document.getElementById("homePanel").classList.remove("hidden");
}

// 4. THEME TOGGLE
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

// 5. ROOM LOGIC
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
    document.getElementById("roomTitle").innerText = name;
    document.getElementById("homePanel").classList.add("hidden");
    document.getElementById("chatPanel").classList.remove("hidden");
    setupRoomListeners(name);
}

// 6. CHAT & PRESENCE LOGIC (Includes Immediate Cleanup)
function setupRoomListeners(name) {
    const chatBox = document.getElementById("chatBox");
    const roomRef = db.ref(`rooms/${name}`);
    const userRef = roomRef.child(`users/${username}`);
    
    // Set user as active
    userRef.set(true);

    // Auto-cleanup if the user closes their browser tab
    userRef.onDisconnect().remove().then(() => {
        roomRef.child("users").on("value", (snap) => {
            if (!snap.exists()) {
                // No users left? Immediately delete messages and room metadata
                roomRef.remove();
            }
        });
    });

    // Sync Active Users List
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
        div.innerHTML = `<strong>${msg.user}</strong>: ${msg.text}`;
        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// 7. SENDING MESSAGES
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
    msgInput.focus(); // Keep focus for next message
}

// 8. LEAVE ROOM & MANUAL CLEANUP
async function leaveRoom() {
    if (!currentRoom) return;
    const roomRef = db.ref(`rooms/${currentRoom}`);
    const userRef = roomRef.child(`users/${username}`);
    
    await userRef.remove();
    const usersSnap = await roomRef.child("users").once("value");
    
    if (!usersSnap.exists()) {
        await roomRef.remove(); // Immediate deletion if room is empty
    }
    location.reload();
}

// 9. INITIAL LOAD (Fetch existing rooms for the sidebar)
db.ref("rooms").on("value", snap => {
    const list = document.getElementById("roomList");
    list.innerHTML = "";
    snap.forEach(r => {
        const roomData = r.val();
        // Show only rooms with active users
        if (roomData.users && Object.keys(roomData.users).length > 0) {
            const li = document.createElement("li");
            li.innerText = `${r.key} (${Object.keys(roomData.users).length})`;
            li.style.cursor = "pointer";
            li.style.padding = "5px 0";
            li.onclick = () => {
                document.getElementById("roomName").value = r.key;
            };
            list.appendChild(li);
        }
    });
});