let username = prompt("Enter your name:");
const chatBox = document.getElementById("chatBox");

// Send message
function sendMessage() {
    let msg = document.getElementById("msg").value;

    db.ref("messages").push({
        user: username,
        text: msg
    });

    document.getElementById("msg").value = "";
}

// Receive messages
db.ref("messages").on("child_added", (data) => {
    let msg = data.val();

    let div = document.createElement("div");
    div.classList.add("message");

    if (msg.user === username) {
        div.classList.add("sent");
    } else {
        div.classList.add("received");
    }

    div.innerText = msg.user + ": " + msg.text;
    chatBox.appendChild(div);
});