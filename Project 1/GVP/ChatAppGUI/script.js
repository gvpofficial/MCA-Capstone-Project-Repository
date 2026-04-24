let username = prompt("Enter your name:");
const chatBox = document.getElementById("chatBox");
const userList = document.getElementById("users");

// 🔹 Add user to database
window.db.ref("users/" + username).set(true);

// 🔹 Remove user when leaving
window.addEventListener("beforeunload", () => {
    window.db.ref("users/" + username).remove();
});

// 🔹 Show online users
window.db.ref("users").on("value", (snapshot) => {
    userList.innerHTML = "";

    snapshot.forEach((child) => {
        let li = document.createElement("li");
        li.innerText = child.key;
        userList.appendChild(li);
    });
});

// 🔹 Send message
function sendMessage() {
    let msgInput = document.getElementById("msg");
    let msg = msgInput.value;

    if (msg.trim() === "") return;

    window.db.ref("messages").push({
        user: username,
        text: msg
    });

    msgInput.value = "";
}

// 🔹 Receive messages
window.db.ref("messages").on("child_added", (snapshot) => {
    let msg = snapshot.val();

    let div = document.createElement("div");
    div.classList.add("message");

    if (msg.user === username) {
        div.classList.add("sent");
    } else {
        div.classList.add("received");
    }

    div.innerText = msg.user + ": " + msg.text;
    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
});